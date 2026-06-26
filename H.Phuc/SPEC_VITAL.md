# VITAL — Đặc tả hệ thống theo dõi calo & vóc dáng
### Tài liệu dành cho AI/developer build lại từ đầu. Gồm 2 hệ: NAM (đã chạy thật, đã QC 39/39 PASS) và NỮ (thiết kế mở rộng).

---

# PHẦN 0 — TRIẾT LÝ THIẾT KẾ (đọc trước khi build)

Hai hệ thống nam/nữ **không phải một app đổi màu** — chúng trả lời hai câu hỏi khác nhau:

| | NAM | NỮ |
|---|---|---|
| Câu hỏi cốt lõi | "Tôi có đạt mục tiêu không? Bao giờ?" | "Cơ thể tôi đang xảy ra chuyện gì? Khi nào tôi sẽ đẹp hơn?" |
| Màn hình chính xoay quanh | Tiến độ mục tiêu + ngày đạt đích | Giải thích cơ thể + dự báo vài ngày tới |
| Lý do quay lại app | Xem mình nhanh/chậm hơn kế hoạch bao nhiêu ngày | Hôm nay cơ thể ở trạng thái nào, kỳ kinh tiếp theo khi nào, mình giảm mỡ thật hay chỉ giữ nước |
| Rủi ro lớn nhất nếu làm sai | Mục tiêu quá xa → nản | Cân tăng 1kg trong 3 ngày do nước/hormone → app phán "bạn đang thất bại" → mất niềm tin → bỏ app |

**Vấn đề chí mạng nếu áp hệ nam cho nữ:** người dùng nữ ăn đúng kế hoạch, tập đúng kế hoạch, nhưng tăng 1kg trong 3 ngày — thực tế là nước, hormone, chu kỳ kinh nguyệt. App chỉ nhìn cân nặng sẽ kết luận sai. Vì vậy hệ nữ phải có **Menstrual Engine làm lõi**, mọi đánh giá khác đều đi qua nó.

---

# PHẦN 1 — HỆ THỐNG NAM (VITAL-M, đã vận hành thật)

## 1.1 Kiến trúc tổng quát

```
[index.html — CSS inline, body là khung rỗng]
        │ load 13 <script> theo thứ tự phụ thuộc
        ▼
constants.js → db.js → food_db.js → act_db.js
→ e1_body.js → e2_nutrition.js → e3_progress.js → e4_prediction.js
→ e5_goal.js → e6_risk.js → e7_reco.js
→ output_builder.js → app.js (glue UI)
```

- **Mỗi engine 1 file, thuần logic, không đụng DOM.** Engine nhận input → trả object kết quả.
- **OutputBuilder** gọi tuần tự E1→E7, gom thành 1 object `out` duy nhất. UI chỉ đọc `out`, không bao giờ gọi engine trực tiếp (trừ E3 cho biểu đồ).
- **app.js** là glue duy nhất đụng DOM: `refresh()` = đọc DB → build output → render lại toàn bộ 2 trang.
- Mọi thao tác người dùng (thêm món, sửa, xóa, lưu cân) đều: cập nhật LOG → `persist()` (ghi localStorage) → `refresh()` (render lại). Không có state UI tách rời dữ liệu.

**Bài học kỹ thuật bắt buộc (đã dính lỗi thật):**
1. Mỗi file engine khai báo `const C = ...` ở đầu để chạy được cả Node lẫn browser. Khi load bằng `<script>` thường, tất cả dùng chung global scope → SyntaxError trùng tên. **Bắt buộc bọc mỗi file trong IIFE** `(function(){...})()`.
2. **Không bao giờ dùng `toISOString().slice(0,10)` để lấy ngày hôm nay** — máy múi giờ UTC+7 sẽ bị lùi 1 ngày trước 7h sáng. Phải dùng `getFullYear/getMonth/getDate` local.
3. Mọi chuỗi người dùng nhập (tên, tên món) phải **escape HTML** trước khi đưa vào innerHTML (chống XSS — đã test tên chứa `<script>`).
4. Food/log cũ có thể thiếu field (`fiber`, `sugar`, `acts`, `qty`) — mọi phép tính phải có fallback `|| 0` / `|| 1` / `|| []`. Đã QC: không NaN, không crash với log kiểu cũ.

## 1.2 INPUT

**Hồ sơ (nhập 1 lần khi onboarding):** tên, tuổi, chiều cao, giới tính, cân hiện tại, cân mục tiêu, loại mục tiêu (giảm mỡ −500 / giảm cân −600 / tăng cơ +300 / recomp 0 / duy trì 0 kcal so TDEE), mức vận động nền (5 mức, hệ số 1.20→1.90), thời hạn (30/60/90/180 ngày). Tùy chọn: vòng eo/cổ/hông để tính body fat (công thức Navy).

**Nhật ký hằng ngày:**
- **Món ăn:** chọn từ DB ~100 món Việt định sẵn (mỗi món: kcal, protein, fat, carb, fiber, sugar, cờ "chế biến sẵn", đơn vị phần ăn). Pop-up hiện thông số định sẵn, **người dùng sửa được TỪNG Ô** cho đúng phần ăn thật, kèm stepper số lượng ×0.5. Tìm kiếm phải **bỏ dấu tiếng Việt** (chuẩn hóa NFD, xóa dấu kết hợp U+0300–U+036F, đ→d) để gõ "pho" ra "Phở".
- **Hoạt động:** DB 16 hoạt động kèm MET. Kcal tự tính = `MET × cân_nặng_kg × (phút/60)`, người dùng sửa được nếu đồng hồ đo khác.
- **Cơ thể:** cân buổi sáng, giờ ngủ, số bước.

**Lưu trữ:** localStorage 4 key — profile, mảng logs theo ngày, snapshots kết quả, mốc flame đã xem.

## 1.3 THUẬT TOÁN — 7 ENGINE

**Engine 1 — Body:**
- BMR Mifflin-St Jeor: `10×cân + 6.25×cao − 5×tuổi + 5` (nam) / `−161` (nữ).
- TDEE = BMR × hệ số vận động.
- **TDEE thích nghi (điểm hay nhất):** khi có ≥7 ngày cân + ≥5 ngày ghi ăn, tính TDEE thực = `trung_bình_nạp − (Δcân × 7700 / số_ngày)` trên cửa sổ 14 ngày. Có thì ưu tiên dùng thay công thức, UI ghi rõ "TDEE thực đo".
- Mục tiêu nạp = TDEE + deficit theo mục tiêu. Protein mục tiêu = 1.8g/kg.

**Engine 2 — Dinh dưỡng (trong ngày):** tổng kcal/macro hôm nay; điểm tuân thủ calo; điểm protein; **điểm chất lượng ăn 0–100** = 35% mật độ protein + 20% chất xơ + 25% (ít) đường + 20% (ít) đồ chế biến sẵn, tính trên mỗi 1000 kcal.

**Engine 3 — Tiến độ:** cân trend = **trung bình động 7 ngày (MA-7)** để lọc nhiễu nước; tốc độ tuần = hồi quy tuyến tính trên MA 14 ngày gần nhất × 7; % chặng đường; cờ `enough` khi ≥7 ngày cân.

**Engine 4 — Dự báo:**
- Tốc độ dùng để chiếu: nếu đủ dữ liệu cân → dùng tốc độ đo thật (E3); nếu chưa → tốc độ lý thuyết từ deficit.
- **LỖI ĐÃ SỬA, AI build lại phải tránh:** deficit lý thuyết KHÔNG được tính bằng `TDEE_công_thức − nạp` — phải dùng `max(BMR + kcal_hoạt_động_đã_ghi_trung_bình_7_ngày, TDEE) − nạp`. Nếu không, người tập nặng có ghi hoạt động sẽ bị dự báo sai khổng lồ (case thật: hiện "trễ hạn 2150 ngày" trong khi thực tế ~63 ngày).
- Dự báo cân 30/60/90 ngày; ngày đạt mục tiêu; số ngày nhanh/chậm hơn kế hoạch = (tiến_độ_thật − tiến_độ_kế_hoạch)/tốc_độ_kế_hoạch_ngày.

**Engine 5 — Xác suất đạt mục tiêu:** ratio = tốc_độ_thật / tốc_độ_cần_thiết (trong số ngày còn lại); xác suất = sigmoid `1/(1+e^(−4(ratio−0.7)))` × 100; phạt ×0.75 nếu chưa đủ 7 ngày dữ liệu; kẹp [5,99]; nếu đã chạm mục tiêu → 99 + verdict "giữ phong độ". Sinh câu verdict: "nhanh hơn kế hoạch X ngày / chậm hơn X ngày / đúng nhịp".

**Engine 6 — Rủi ro (4 luật, đếm chuỗi ngày liên tục từ hôm nay lùi về):**
1. Protein < 70% mục tiêu ≥ 3–5 ngày liên tục (chỉ tính ngày có ghi ăn) → "nguy cơ mất cơ khi đang giảm mỡ" (severity cao).
2. Giảm > 1%/tuần (chỉ khi đủ dữ liệu) → "giảm quá nhanh".
3. Ngủ < 6h ≥ 5 ngày liên tục → cortisol/giữ mỡ.
4. Nạp vượt TDEE > 300 kcal ≥ 7 ngày liên tục → thừa calo. *Lưu ý: khi TDEE thích nghi đã bật, luật này tự hội tụ thành "tăng >0.27kg/tuần thật sự" — đó là hành vi đúng, đừng "sửa".*

**Engine 7 — Khuyến nghị (tối đa 3, xếp ưu tiên):** KHÔNG nói chung chung "ăn ít hơn". Phải cụ thể:
- Có risk protein → "Bù Xg protein hôm nay — 2 quả trứng + 1 hộp sữa chua ≈ 18g".
- Vượt calo >150 → tìm **món thủ phạm lớn nhất** (điểm = kcal + đường×4 + 150 nếu chế biến sẵn) → "Bỏ [tên món] — riêng món này X kcal".
- Thiếu ngủ → "Ngủ trước 23h tối nay".
- Bước thấp → "Đi thêm X bước — tăng tiêu hao mà không cần cắt ăn".
- Không có gì → "Giữ nguyên nhịp hôm nay".
- Kèm **bảng xếp hạng nguồn calo lớn nhất hôm nay** (vd "trà sữa 180 kcal") để người dùng thấy thủ phạm bằng mắt.

## 1.4 OUTPUT — 2 trang

**Trang 1 (Tổng quan):** header (ngày + tên + flame badge) → verdict 1 câu lớn → vòng calo (nạp/đốt/mục tiêu/BMR) → 3 thanh macro → khối Mục tiêu (cân trend → đích, % chặng, tốc độ thực-tế-vs-kế-hoạch, biểu đồ chiếu SVG: đường kế hoạch đứt + đường thật MA7 + đường chiếu, ETA "sớm/trễ hạn X ngày") → Dự báo 30/60/90 + donut xác suất → card Rủi ro → card Hành động + xếp hạng thủ phạm → 3 ô phân tích nhanh (nạp-vs-đốt, sparkline 7 ngày, donut chất lượng ăn).

**Trang 2 (Dữ liệu):** card Nạp (cảnh báo E2 + danh sách món chạm-để-sửa) → card Đốt (danh sách hoạt động, xóa được) → card Cơ thể (3 input + nút lưu) → link đặt lại toàn bộ.

**Quyết định UX quan trọng (đừng bỏ):**
- **Dưới 3 ngày dữ liệu cân: ẨN % xác suất và ẩn "sớm/trễ hạn"** — hiện "—" + câu hướng dẫn "cân mỗi sáng, sau 3 ngày hệ thống tính xác suất, sau 7 ngày dự báo chuẩn". Lý do: ngày 1 mà hiện "6% đạt mục tiêu" hay "trễ 2150 ngày" thì người dùng bỏ app ngay.
- "Đốt" hiển thị = BMR + hoạt động ghi tay (con số người dùng kiểm soát được); engine dự báo dùng TDEE. Hai con số khác nhau có chủ đích.
- Mục tiêu phải xếp dễ→khó (nam thích mục tiêu, mục tiêu phải đạt được).

## 1.5 Habit Flame (hệ động lực thay cho "mốc chinh phục")

- **Streak** = số ngày liên tục có ghi ít nhất 1 món ăn, tính từ hôm nay lùi về (nếu hôm nay chưa ghi thì bắt đầu đếm từ hôm qua — không phạt giữa ngày).
- Badge ngọn lửa góc phải header: màu nội suy tuyến tính RGB **xám (120,120,120) → tím (180,80,255)** theo `p = min(streak/200, 1)`; brightness 50%+p×50%; glow theo bậc: 0–30 không, 30–100 blur 10px/20%, 100–200 blur 20→40px/30→70%, 200 ngày blur 50px/100% + pulse.
- 9 mốc **3, 10, 20, 30, 50, 75, 100, 150, 200 ngày** → bung celebration toàn màn hình: lửa 70vw zoom-in 1.5–2s, tên bậc chữ nghiêng serif, lưu mốc-đã-xem vào localStorage để không bung lại; streak đứt thì cho ăn mừng lại từ đầu.
- *Bài học hiển thị:* đừng để icon lửa vừa fill bằng màu nội suy vừa nhân brightness — ở streak thấp sẽ ra gần đen, không nhìn thấy. Icon nên tím cố định, text trắng; chỉ glow/viền tiến hóa.

---

# PHẦN 2 — HỆ THỐNG NỮ (VITAL-F)

> Giữ nguyên kiến trúc kỹ thuật Phần 1 (engine thuần logic + OutputBuilder + glue UI + localStorage + các bài học IIFE/ngày local/escape). Khác biệt nằm ở **bộ engine và màn hình chính**.

## 2.1 INPUT

**Hồ sơ cá nhân (nhập một lần):** tuổi, chiều cao, cân hiện tại, cân mục tiêu.

**Mục tiêu:** Giảm cân / Giảm mỡ / Săn chắc cơ thể / Tăng cơ / Giữ dáng.

**Thông tin chu kỳ — cực kỳ quan trọng, là input định danh của hệ nữ:**
- Ngày bắt đầu kỳ kinh gần nhất (vd 01/06)
- Số ngày hành kinh (vd 5 ngày)
- Độ dài chu kỳ trung bình (vd 29 ngày)

**Tracking hằng ngày:**
- Dinh dưỡng: calories, protein, carb, fat, fiber, sugar (dùng lại food DB + pop-up sửa-từng-ô của hệ nam).
- Hoạt động: bước chân, tập luyện, cardio, gym, yoga (dùng lại MET engine).
- Cơ thể: cân nặng, **vòng eo, vòng hông** (hệ nam không bắt buộc — hệ nữ bắt buộc, vì là nguyên liệu của Body Shape Engine).
- **Cảm nhận cá nhân (hệ nam không có):** mức năng lượng /10, tâm trạng /10, độ thèm ăn /10, mức stress /10. Nhập dạng slider 30 giây, không bắt gõ chữ.

## 2.2 THUẬT TOÁN — 9 ENGINE

**Engine 1 — Body Engine:** y hệt hệ nam (BMR dùng hằng số nữ −161, TDEE, TDEE thích nghi, macro mục tiêu).

**Engine 2 — Menstrual Engine (LÕI của hệ nữ):**
- Ngày chu kỳ = hôm nay − ngày bắt đầu kỳ gần nhất + 1 (vd kỳ gần nhất 01/06, hôm nay 08/06 → Day 8). Quá độ dài chu kỳ thì modulo và tự dự đoán kỳ mới.
- Xác định phase (chuẩn hóa theo độ dài chu kỳ thật của người dùng, ví dụ với chu kỳ 28):
  - **Menstrual:** Day 1–5 (theo số ngày hành kinh khai báo)
  - **Follicular:** Day 6–13
  - **Ovulation:** Day 14–16
  - **Luteal:** Day 17–28
- Mọi engine phía sau đều nhận `{cycleDay, phase}` làm context.

**Engine 3 — Hormone Impact Engine (giải thích cơ thể):**
- Mỗi phase gắn bộ thuộc tính: khả năng giữ nước, mức thèm ăn kỳ vọng, năng lượng kỳ vọng, khả năng "tăng cân giả".
- **Nhiệm vụ then chốt: phân loại biến động cân.** Khi cân tăng (vd +0.8kg) thuật toán phải đánh giá: *mỡ thật hay nước?* Nếu đang Luteal → kết luận "~80% là giữ nước" và **verdict không được phép nói tiêu cực**. Logic gợi ý: so tốc độ tăng với mức tăng-mỡ-tối-đa-khả-thi từ surplus calo thực (1kg mỡ = 7700 kcal — tăng 1kg/3 ngày đòi hỏi thừa ~2500 kcal/ngày; nếu nhật ký ăn không cho thấy mức đó → phần dư là nước).

**Engine 4 — Progress Engine (so sánh theo chu kỳ — KHÁC HẲN nam):**
- Nam so theo thời gian tuyến tính. Nữ **so cùng-ngày-chu-kỳ:** KHÔNG so Day 8 tháng này với Day 24 tháng trước, mà so **Day 8 tháng này với Day 8 tháng trước**. Kết quả ổn định hơn nhiều vì cùng trạng thái hormone.
- Trend cân vẫn dùng MA-7 nhưng có thể loại trừ/giảm trọng số các ngày Luteal muộn + Menstrual đầu khi tính tốc độ.

**Engine 5 — Body Shape Engine (phần hấp dẫn nhất với người dùng nữ):**
- Theo dõi: vòng eo, vòng hông, cân nặng, body fat → dựng **Body Shape Trend**.
- Logic vàng: **cân không đổi nhưng eo −3cm = "Đang giảm mỡ thành công"** — phải nói to điều này thay vì im lặng vì số cân đứng yên. Đây chính là câu trả lời cho "mình giảm mỡ thật hay chỉ giữ nước".

**Engine 6 — Prediction Engine:** dự báo 3 lớp:
- Cân nặng: 7 / 30 / 90 ngày (kỹ thuật chiếu như hệ nam, nhưng làm phẳng nhiễu chu kỳ bằng Engine 4).
- Chu kỳ: ngày kinh tiếp theo + ngày rụng trứng, kèm **độ tin cậy %** (dựa độ đều của các chu kỳ đã ghi).
- Ngoại hình: vòng eo, body fat (vd "30 ngày nữa: eo −2cm, body fat −1.5%") — ngoại suy tuyến tính từ trend đo eo/hông.

**Engine 7 — Symptom Engine (học hành vi cá nhân):**
- Ghi nhận cảm nhận hằng ngày theo ngày-chu-kỳ. Sau ~3 chu kỳ, tìm pattern lặp: vd trước kỳ kinh hay thèm ngọt, hay mất ngủ.
- Tháng sau, đến đúng giai đoạn đó, app **chủ động báo trước**: "Bạn thường thèm đồ ngọt trong giai đoạn này." → người dùng cảm thấy app hiểu mình. Cài đặt đơn giản: trung bình điểm thèm ăn/năng lượng/tâm trạng theo cửa sổ ngày-chu-kỳ qua các tháng, ngưỡng lệch ≥1.5 điểm so baseline cá nhân thì thành "đặc điểm".

**Engine 8 — Goal Achievement Engine:** không chỉ hỏi "có đạt cân nặng không?" mà hỏi "**có đạt vóc dáng không?**" — xác suất tổng hợp từ cả trend cân (như E5 nam: sigmoid, kẹp [5,99], ẩn khi <3 ngày dữ liệu) lẫn trend số đo. Output: "Khả năng đạt: 85% · Ngày đạt: 15/09/2026".

**Engine 9 — Recommendation Engine (quan trọng nhất):**
- Mọi khuyến nghị phải **đi qua context phase**. Không nói "Ăn ít hơn." Mà nói: "Bạn đang ở Luteal Phase. Thèm ăn tăng là bình thường. Ưu tiên: Protein, Trái cây, Nước."
- Giữ cơ chế "thủ phạm cụ thể" của hệ nam (xếp hạng món) nhưng lời khuyên phải dịu và giải-thích-trước-khuyên-sau.
- Khuyến nghị tập theo phase: Follicular/Ovulation → "dễ tập nặng, tập chân trong 2 ngày tới"; Luteal muộn/Menstrual → ưu tiên yoga, đi bộ, ngủ.

## 2.3 OUTPUT — màn hình chính hệ nữ

Thứ tự khối (khác hệ nam — "giải thích cơ thể" đứng trên "tiến độ"):

- **A. Verdict 1 câu** — ưu tiên giải thích: "Bạn đang đi đúng lộ trình." hoặc "Cân tăng hôm nay chủ yếu do giữ nước." (KHÔNG bao giờ "bạn đang thất bại" trong Luteal/Menstrual.)
- **B. Trạng thái cơ thể hôm nay:** Ngày chu kỳ: 8 · Giai đoạn: Follicular · Năng lượng: Cao · Khả năng tập luyện: Tốt.
- **C. Tiến độ:** 60kg → 58.8kg · Đã hoàn thành 24%.
- **D. Dự báo cân:** tuần sau 58.3 · 30 ngày 57.2 · 90 ngày 54.8.
- **E. Dự báo cơ thể:** 30 ngày: eo −2cm · hông −1cm · body fat −1.3%.
- **F. Chu kỳ:** Kỳ kinh tiếp theo 01/07/2026 · Độ tin cậy 91%.
- **G. Dự báo 7 ngày tới (điểm giữ chân số 1):** "Ngày mai: năng lượng cao · 2 ngày nữa: dễ tập nặng · 5 ngày nữa: bắt đầu tăng cảm giác thèm ăn."
- **H. Hành động tiếp theo (tối đa 3, cụ thể):** "1. Thêm 15g protein · 2. Đi thêm 1000 bước · 3. Tập chân trong 2 ngày tới."

Habit Flame dùng lại được nguyên vẹn (streak ghi nhật ký không liên quan giới tính).

## 2.4 KPI giữ chân

- Nam quay lại vì: *bao giờ đạt mục tiêu?* → tối ưu khối Mục tiêu/ETA/xác suất.
- Nữ quay lại vì: *hôm nay cơ thể mình đang ở trạng thái nào? ngày mai thay đổi thế nào? kỳ kinh tiếp theo khi nào? mình giảm mỡ thật hay giữ nước?* → tối ưu khối B, G, F, E. Đo retention theo tỷ lệ mở app ở các ngày Luteal (giai đoạn dễ bỏ app nhất ở hệ cũ).

---

# PHẦN 3 — CHECKLIST QC CHO AI BUILD LẠI (rút từ phiên QC thật 39/39)

**Thuật toán:**
- [ ] Không profile → trả lỗi sạch, không crash
- [ ] Ngày 1 trống → mọi số nền (BMR/TDEE/mục tiêu) vẫn ra, xác suất/ETA ẩn "—"
- [ ] 14 ngày giảm chuẩn → TDEE thích nghi bật, dự báo hợp lý (<400 ngày), xác suất trong [5,99]
- [ ] Mục tiêu chiều ngược (tăng cơ / start<goal) → mọi dấu, mọi hướng dự báo đúng
- [ ] Đã chạm mục tiêu → 99% + verdict tích cực
- [ ] Cả 4 risk kích hoạt đúng kịch bản chuẩn; hiểu rằng surplus + TDEE thích nghi tự hội tụ là ĐÚNG
- [ ] Quá deadline / cân=mục tiêu (maintain) → không chia 0, không NaN
- [ ] Log thiếu field, món thiếu fiber/sugar/qty → không NaN, không crash
- [ ] (Hệ nữ) cân +1kg trong Luteal với nhật ký ăn không surplus → verdict phải là "giữ nước", KHÔNG phải cảnh báo thất bại
- [ ] (Hệ nữ) ngày chu kỳ vượt độ dài chu kỳ → modulo đúng, dự báo kỳ mới

**Hiển thị:** mọi card có số thật (không rỗng/undefined); tên chứa `<script>` bị escape; streak badge hiện đúng; biểu đồ chiếu có đủ 3 đường khi đủ dữ liệu.

**Luồng thao tác:** thêm món → tổng tăng đúng; sửa kcal+qty → tổng = kcal×qty; thêm hoạt động → burn tăng đúng MET×kg×giờ; lưu cân → engine nhận ngay (dataDays+1); xóa → về 0; đóng mở app → localStorage giữ nguyên.

**Streak/Flame:** chuỗi liên tục đếm đúng; hôm nay chưa ghi không phạt; đứt 1 ngày giữa → reset; mốc bung 1 lần duy nhất; không phải mốc → im lặng.
