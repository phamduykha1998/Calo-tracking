// ============================================================================
//  service-worker.js — giúp app CHẠY OFFLINE và cài được như app điện thoại.
//  Chiến lược: cache-first + cập nhật nền (lần đầu online tải gì thì lưu nấy;
//  lần sau, kể cả mất mạng, lấy từ cache). Đổi CACHE để buộc làm mới khi nâng cấp.
// ============================================================================
const CACHE = 'vital-v8';

self.addEventListener('install', (e) => {
  self.skipWaiting(); // kích hoạt SW mới ngay
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // Chỉ xử lý GET cùng origin (bỏ qua font Google, v.v. — để trình duyệt lo).
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;

  e.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached); // mất mạng → dùng cache nếu có
      return cached || network; // có cache trả ngay, không thì chờ mạng
    })
  );
});
