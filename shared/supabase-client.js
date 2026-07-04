// ============================================================================
//  supabase-client.js — khởi tạo 1 Supabase client dùng chung cho cả 3 trang
//  (index.html, H.Phuc/Phuc_calo.html, N.Anh/Anh_calo.html).
//
//  Cần nạp SAU thẻ:
//    <script src="https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
//
//  SUPABASE_URL và SUPABASE_ANON_KEY là 2 giá trị CÔNG KHAI (lấy ở Supabase →
//  Project Settings → API → "Project URL" và "anon public"). Không phải bí
//  mật — hardcode thẳng vào đây là an toàn, vì bảo mật thật nằm ở Row Level
//  Security (xem supabase/schema.sql), không nằm ở việc giấu 2 chuỗi này.
//  TUYỆT ĐỐI không đưa "service_role" key vào file này hay bất kỳ đâu trong
//  code chạy ở trình duyệt — key đó bỏ qua RLS hoàn toàn.
// ============================================================================
(function () {
  'use strict';

  var SUPABASE_URL = 'https://ekcehdoyuhvlkktxkret.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_V4oh4JW5sQkKn-agvcGK6w_q4Y0WvQf';

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('VITAL: chưa nạp được thư viện supabase-js — kiểm tra thẻ <script> CDN có chạy trước file này không.');
    return;
  }
  if (SUPABASE_URL.indexOf('YOUR-PROJECT-REF') !== -1) {
    console.warn('VITAL: shared/supabase-client.js chưa được điền SUPABASE_URL/ANON_KEY thật — app sẽ không kết nối được tới Supabase cho tới khi điền.');
  }

  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();
