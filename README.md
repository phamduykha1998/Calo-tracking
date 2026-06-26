# VITAL — Theo dõi calo & vóc dáng (PWA)

Ứng dụng web theo dõi sức khỏe, **chạy 100% trong trình duyệt**, dữ liệu lưu ngay trên máy bằng **SQLite (sql.js / WebAssembly)**. Cài được lên điện thoại như app thật, **chạy offline**, không cần server.

- 👨 **Phúc (FORGE)** — hệ Nam: tập trung *mục tiêu & tiến độ* (bao giờ đạt cân?).
- 👩 **Ngọc Anh (ÉLYSÉE)** — hệ Nữ: tập trung *trạng thái cơ thể theo chu kỳ*.

---

## Chạy thử trên máy

Chỉ cần một static server (không cần cài gì cho phần app):

```bash
npx serve .
# hoặc: python -m http.server 8000
```
Mở `http://localhost:8000` → chọn hồ sơ.

> Lần đầu mở, app tự dựng database trong trình duyệt và nạp danh mục món ăn/hoạt động. Dữ liệu bạn nhập lưu trong IndexedDB của thiết bị, mở lại vẫn còn.

---

## 🚀 Đưa lên GitHub để tạo link (GitHub Pages)

1. Tạo repo trên GitHub, đẩy code lên:
   ```bash
   git init
   git add .
   git commit -m "VITAL PWA"
   git branch -M main
   git remote add origin https://github.com/<tên-bạn>/<tên-repo>.git
   git push -u origin main
   ```
2. Trên GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save.**
3. Đợi ~1 phút. Link của bạn sẽ là:
   ```
   https://<tên-bạn>.github.io/<tên-repo>/
   ```

GitHub Pages tự phục vụ HTTPS + đúng kiểu file `.wasm` → PWA hoạt động ngay.

---

## 📱 Cài lên điện thoại từ link

- **Android (Chrome):** mở link → menu ⋮ → **"Thêm vào màn hình chính" / "Cài đặt ứng dụng"**.
- **iPhone (Safari):** mở link → nút Chia sẻ → **"Thêm vào MH chính"**.

Sau khi cài, mở từ icon ngoài màn hình → chạy full màn hình như app, **dùng được cả khi không có mạng**.

---

## Cấu trúc dự án

```
index.html / index.css / index.js     ← màn hình chọn hồ sơ
H.Phuc/                                ← app hệ Nam (UI + engine E1–E7)
N.Anh/                                 ← app hệ Nữ (UI + engine chu kỳ)
shared/vital-sqlite.js                 ← SQLite-WASM + lưu IndexedDB (lõi dữ liệu)
vendor/sqljs/                          ← engine sql.js (.js + .wasm) đã vendor sẵn
manifest.webmanifest                   ← khai báo PWA (tên, icon, màu)
service-worker.js                      ← cache để chạy offline
icons/                                 ← icon app
server/                                ← (tham khảo) backend SQLite quan hệ + REST API
```

## Hai cách lưu trữ trong repo này (để học)

| | Bản chạy thật (trình duyệt) | Bản tham khảo (server/) |
|---|---|---|
| Nơi lưu | IndexedDB trên thiết bị | file `vital.db` trên máy chủ |
| Engine | sql.js (WASM) | `node:sqlite` |
| Schema | JSON theo người dùng + danh mục quan hệ | quan hệ chuẩn hoá đầy đủ |
| Dùng để | ship PWA, offline | học SQL/JOIN/khóa ngoại — xem [server/README_DATABASE.md](server/README_DATABASE.md) |

Phần `server/` **không cần** để chạy app; giữ lại làm tài liệu học database quan hệ.
