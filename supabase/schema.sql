-- ============================================================================
--  VITAL — Supabase schema + Row Level Security (RLS)
--  Dán TOÀN BỘ file này vào Supabase → SQL Editor → New query → Run.
--  Chạy 1 lần lúc mới tạo project. An toàn chạy lại nhiều lần (IF NOT EXISTS).
--
--  Ghi chú cho người mới học DB:
--    • auth.users  = bảng tài khoản đăng nhập, Supabase tự quản lý (email, mật khẩu…).
--    • public.profiles.id THAM CHIẾU auth.users.id → 1 tài khoản đăng nhập = 1 hồ sơ.
--    • jsonb        = kiểu lưu "1 cục JSON" trong 1 cột — giữ đúng hình dạng dữ liệu
--                     mà app.js/Anh_calo.js đang dùng, khỏi phải tách thành chục cột.
--    • RLS (Row Level Security) = luật ai được đọc/ghi DÒNG NÀO — bật ở cuối file.
--      Đây là hàng rào bảo mật THẬT, vì trang web gọi thẳng Supabase từ trình
--      duyệt bằng khóa công khai (anon key) — không có server nào đứng giữa để
--      tự kiểm tra quyền, nên phải để chính Postgres kiểm tra.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) profiles — 1 dòng = 1 tài khoản thật (Phúc / Ngọc Anh / người sau này).
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,                                   -- chỉ để hiển thị, không dùng để đăng nhập
  name        text not null,
  gender      text not null check (gender in ('male','female')),
  partner_id  uuid references public.profiles(id) on delete set null,  -- "đối tác" — xem chéo (chỉ xem); xoá người kia thì tự gỡ liên kết
  couple_id   uuid,                                    -- dự phòng mở rộng nhiều cặp sau này (chưa dùng)
  data        jsonb not null default '{}'::jsonb,      -- age/height/weight_start/weight_goal/goal_type/...
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2) logs — 1 dòng = 1 (chủ hồ sơ, ngày). Y hệt hình dạng JSON hiện tại
--    (foods[], acts[], activity{}, recovery{}, weight_morning, waist, hip...).
-- ----------------------------------------------------------------------------
create table if not exists public.logs (
  id         bigint generated always as identity primary key,
  owner_id   uuid not null references public.profiles(id) on delete cascade,
  date       date not null,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (owner_id, date)
);

-- ----------------------------------------------------------------------------
-- 3) snapshots — kết quả engine đã tính, lưu JSON (giữ nguyên như bản SQLite).
-- ----------------------------------------------------------------------------
create table if not exists public.snapshots (
  id         bigint generated always as identity primary key,
  owner_id   uuid not null references public.profiles(id) on delete cascade,
  date       date not null,
  data       jsonb not null default '{}'::jsonb,
  unique (owner_id, date)
);

-- ----------------------------------------------------------------------------
-- 4) custom_foods — món người dùng tự thêm, riêng từng tài khoản.
-- ----------------------------------------------------------------------------
create table if not exists public.custom_foods (
  owner_id  uuid not null references public.profiles(id) on delete cascade,
  id        text not null,
  data      jsonb not null default '{}'::jsonb,
  primary key (owner_id, id)
);

-- Ghi chú: KHÔNG có bảng foods/activities ở đây — danh mục món ăn (497 món) và
-- hoạt động (MET) vẫn nằm trong js/food_db.js + js/act_db.js (mảng JS tĩnh, nạp
-- kèm trang), không phải dữ liệu người dùng nên không cần đưa lên Supabase.

-- Index tăng tốc truy vấn hay dùng.
create index if not exists idx_logs_owner_date      on public.logs(owner_id, date);
create index if not exists idx_snapshots_owner_date on public.snapshots(owner_id, date);
create index if not exists idx_profiles_partner     on public.profiles(partner_id);


-- ============================================================================
--  ROW LEVEL SECURITY — bật + luật cho từng bảng.
--  Luật chung: CHỦ được đọc/ghi/xoá dòng của mình; ĐỐI TÁC chỉ được ĐỌC.
-- ============================================================================
alter table public.profiles     enable row level security;
alter table public.logs         enable row level security;
alter table public.snapshots    enable row level security;
alter table public.custom_foods enable row level security;

-- Hàm phụ trợ: tra "partner_id của chính mình", chạy BỎ QUA RLS (security definer).
-- Bắt buộc phải có hàm này — nếu policy của profiles tự query lại chính bảng
-- profiles (kể cả gián tiếp qua policy của logs/snapshots/custom_foods), Postgres
-- báo lỗi "infinite recursion detected in policy for relation profiles".
create or replace function public.my_partner_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select partner_id from public.profiles where id = auth.uid()
$$;
grant execute on function public.my_partner_id() to anon, authenticated;

-- ---------- profiles ----------
drop policy if exists "profiles_select_own_or_partner" on public.profiles;
create policy "profiles_select_own_or_partner" on public.profiles for select
  using (
    id = auth.uid()
    or id = public.my_partner_id()
  );

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert
  with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

-- ---------- logs ----------
drop policy if exists "logs_select_own_or_partner" on public.logs;
create policy "logs_select_own_or_partner" on public.logs for select
  using (
    owner_id = auth.uid()
    or owner_id = public.my_partner_id()
  );

drop policy if exists "logs_insert_own" on public.logs;
create policy "logs_insert_own" on public.logs for insert with check (owner_id = auth.uid());

drop policy if exists "logs_update_own" on public.logs;
create policy "logs_update_own" on public.logs for update
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "logs_delete_own" on public.logs;
create policy "logs_delete_own" on public.logs for delete using (owner_id = auth.uid());

-- ---------- snapshots (cùng luật) ----------
drop policy if exists "snapshots_select_own_or_partner" on public.snapshots;
create policy "snapshots_select_own_or_partner" on public.snapshots for select
  using (
    owner_id = auth.uid()
    or owner_id = public.my_partner_id()
  );
drop policy if exists "snapshots_insert_own" on public.snapshots;
create policy "snapshots_insert_own" on public.snapshots for insert with check (owner_id = auth.uid());
drop policy if exists "snapshots_update_own" on public.snapshots;
create policy "snapshots_update_own" on public.snapshots for update
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "snapshots_delete_own" on public.snapshots;
create policy "snapshots_delete_own" on public.snapshots for delete using (owner_id = auth.uid());

-- ---------- custom_foods (cùng luật) ----------
drop policy if exists "custom_foods_select_own_or_partner" on public.custom_foods;
create policy "custom_foods_select_own_or_partner" on public.custom_foods for select
  using (
    owner_id = auth.uid()
    or owner_id = public.my_partner_id()
  );
drop policy if exists "custom_foods_insert_own" on public.custom_foods;
create policy "custom_foods_insert_own" on public.custom_foods for insert with check (owner_id = auth.uid());
drop policy if exists "custom_foods_update_own" on public.custom_foods;
create policy "custom_foods_update_own" on public.custom_foods for update
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "custom_foods_delete_own" on public.custom_foods;
create policy "custom_foods_delete_own" on public.custom_foods for delete using (owner_id = auth.uid());


-- ============================================================================
--  TRIGGER TỰ TẠO HỒ SƠ khi có tài khoản mới.
--  Lý do: lúc signUp() vừa xong, trình duyệt có thể CHƯA có phiên đăng nhập
--  (nhất là khi bật xác nhận email) → auth.uid() = null → RLS chặn INSERT vào
--  profiles ("new row violates row-level security policy"). Giải pháp chuẩn của
--  Supabase: để Postgres tự chèn hồ sơ bằng hàm security definer (bỏ qua RLS),
--  đọc tên + giới tính từ metadata mà signUp gửi kèm.
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, gender)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', 'Bạn'),
    coalesce(new.raw_user_meta_data->>'gender', 'male')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================================
--  BƯỚC THỦ CÔNG SAU KHI 2 NGƯỜI ĐÃ ĐĂNG KÝ QUA TRANG WEB (chạy 1 lần):
--  Nối "đối tác" cho nhau để mỗi người xem được (chỉ xem) trang của người kia.
--  Thay 'EMAIL_CUA_PHUC' / 'EMAIL_CUA_NGOC_ANH' bằng email thật đã đăng ký.
-- ============================================================================
-- update public.profiles set partner_id = (select id from public.profiles where email = 'EMAIL_CUA_NGOC_ANH')
--   where email = 'EMAIL_CUA_PHUC';
-- update public.profiles set partner_id = (select id from public.profiles where email = 'EMAIL_CUA_PHUC')
--   where email = 'EMAIL_CUA_NGOC_ANH';
