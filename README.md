# VITAL — Theo dõi calo & vóc dáng (PWA, 2 tài khoản thật)

Ứng dụng web theo dõi sức khỏe cho 1 cặp đôi, có **tài khoản + mật khẩu thật**, dữ liệu lưu trên **Supabase (Postgres đám mây)** — đăng nhập từ máy nào cũng thấy đúng dữ liệu, và mỗi người xem được (chỉ xem, không sửa) dữ liệu thật của người kia. Cài được lên điện thoại như app (PWA).

- 👨 **Nam (FORGE)** — tập trung *mục tiêu & tiến độ* (bao giờ đạt cân?).
- 👩 **Nữ (ÉLYSÉE)** — tập trung *trạng thái cơ thể theo chu kỳ*.

---

## Kiến trúc

- **Frontend**: HTML/CSS/JS thuần, không build tool. `index.html` = đăng nhập/đăng ký; `H.Phuc/` = dashboard Nam; `N.Anh/` = dashboard Nữ.
- **Backend**: [Supabase](https://supabase.com) — Postgres (bảng `profiles`/`logs`/`snapshots`/`custom_foods`, xem [supabase/schema.sql](supabase/schema.sql)) + Auth (email/mật khẩu) + Row Level Security (chủ hồ sơ đọc/ghi được, đối tác chỉ đọc được).
- **Hosting**: GitHub (mã nguồn) → Vercel (deploy tĩnh, tự động mỗi lần push).
- Danh mục món ăn (497 món)/hoạt động (MET) vẫn là mảng JS tĩnh trong `H.Phuc/js/food_db.js` / `act_db.js` — không phải dữ liệu người dùng nên không cần đưa lên Supabase.

## Chạy thử trên máy

1. Tạo project Supabase, chạy [supabase/schema.sql](supabase/schema.sql) trong SQL Editor, lấy `Project URL` + `anon public key`.
2. Điền 2 giá trị đó vào `shared/supabase-client.js`.
3. Chạy 1 static server ở gốc repo:
   ```bash
   npx serve .
   # hoặc: python -m http.server 8000
   ```
4. Mở `http://localhost:8000` → tạo tài khoản → đăng nhập.

## Đưa lên Vercel

1. Đẩy code lên GitHub (repo này).
2. Vào [vercel.com](https://vercel.com) → đăng nhập bằng GitHub → **Add New Project** → chọn repo.
3. Framework Preset: **Other**. Build Command: để trống. Output Directory: `.` (gốc). Không cần biến môi trường (URL/anon key của Supabase là công khai, bảo mật thật nằm ở Row Level Security).
4. Deploy.

## 📱 Cài lên điện thoại từ link

- **Android (Chrome):** mở link → menu ⋮ → **"Thêm vào màn hình chính" / "Cài đặt ứng dụng"**.
- **iPhone (Safari):** mở link → nút Chia sẻ → **"Thêm vào MH chính"**.

> Cần có mạng để ghi nhật ký (dữ liệu lưu trên Supabase, không còn lưu offline trong máy) — đánh đổi tất yếu để 2 người xem được dữ liệu thật của nhau.

## Cấu trúc dự án

```
index.html / index.css / index.js     ← đăng nhập / tạo tài khoản
H.Phuc/                                ← dashboard hệ Nam (UI + engine E1–E7)
N.Anh/                                 ← dashboard hệ Nữ (UI + engine chu kỳ)
shared/supabase-client.js              ← khởi tạo Supabase client dùng chung
shared/vital-auth.js                   ← phiên đăng nhập + chế độ chỉ-xem đối tác
shared/custom-foods.js                 ← món tự thêm (Supabase, bảng custom_foods)
supabase/schema.sql                    ← toàn bộ CREATE TABLE + Row Level Security
manifest.webmanifest                   ← khai báo PWA (tên, icon, màu)
service-worker.js                      ← cache để chạy offline (bump CACHE khi đổi code)
icons/                                 ← icon app
```
