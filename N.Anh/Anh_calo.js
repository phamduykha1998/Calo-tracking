(function () {
'use strict';

// ═══════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════
var KCAL_PER_KG = 7700;
var PROTEIN_PER_KG = 1.6;
var MA_DAYS = 7;
var ACT_FACTORS = {
  sedentary: 1.20, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.90
};
var GOAL_DEF = {
  lose_fat: -500, lose_weight: -600, tone: -200, maintain: 0, gain_muscle: 300
};

// ═══════════════════════════════════════════════════════════
// FOOD DATABASE (497 món — calo_F.A.xlsx)
// ═══════════════════════════════════════════════════════════
var FOOD_DB = [
  {id:'pho_bo_tai', name:'Phở Bò tái', kcal:450, protein:28, carb:55, fat:12, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'pho_bo_nam_gau', name:'Phở Bò nạm/gầu', kcal:520, protein:30, carb:55, fat:18, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'pho_bo_dac_biet', name:'Phở Bò đặc biệt', kcal:600, protein:35, carb:58, fat:22, fiber:0, sugar:0, qty:1, unit:'tô', processed:1},
  {id:'pho_ga', name:'Phở Gà', kcal:400, protein:26, carb:55, fat:8, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'bun_bo_hue_chuan', name:'Bún bò Huế Chuẩn', kcal:550, protein:30, carb:65, fat:18, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'bun_rieu_cua', name:'Bún riêu Cua', kcal:480, protein:22, carb:60, fat:15, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'bun_cha_ha_noi', name:'Bún chả Hà Nội', kcal:600, protein:32, carb:70, fat:20, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'bun_thit_nuong_chuan', name:'Bún thịt nướng Chuẩn', kcal:550, protein:28, carb:65, fat:18, fiber:0, sugar:0, qty:1, unit:'tô', processed:1},
  {id:'bun_mam_chuan', name:'Bún mắm Chuẩn', kcal:500, protein:25, carb:65, fat:15, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'bun_ca_chuan', name:'Bún cá Chuẩn', kcal:450, protein:28, carb:55, fat:12, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'hu_tieu_nam_vang', name:'Hủ tiếu Nam Vang', kcal:480, protein:25, carb:60, fat:14, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'hu_tieu_my', name:'Hủ tiếu Mỳ', kcal:500, protein:26, carb:60, fat:16, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'mi_quang_chuan', name:'Mì Quảng Chuẩn', kcal:550, protein:28, carb:62, fat:20, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'cao_lau_hoi_an', name:'Cao lầu Hội An', kcal:520, protein:25, carb:65, fat:18, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'com_tam_suon', name:'Cơm tấm Sườn', kcal:700, protein:35, carb:80, fat:25, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'com_tam_suon_bi_cha', name:'Cơm tấm Sườn bì chả', kcal:850, protein:40, carb:85, fat:35, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'com_ga_hai_nam', name:'Cơm gà Hải Nam', kcal:650, protein:35, carb:75, fat:20, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'com_ga_xoi_mo', name:'Cơm gà Xối mỡ', kcal:750, protein:35, carb:80, fat:28, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'com_chien_duong_chau', name:'Cơm chiên Dương Châu', kcal:600, protein:20, carb:75, fat:22, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'com_chien_hai_san', name:'Cơm chiên Hải sản', kcal:580, protein:25, carb:70, fat:20, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'com_trang', name:'Cơm trắng', kcal:200, protein:4, carb:45, fat:0.5, fiber:0, sugar:0, qty:1, unit:'chén', processed:0},
  {id:'com_trang_2', name:'Cơm trắng', kcal:400, protein:8, carb:90, fat:1, fiber:0, sugar:0, qty:1, unit:'tô lớn', processed:0},
  {id:'chao_long_chuan', name:'Cháo lòng Chuẩn', kcal:400, protein:20, carb:45, fat:15, fiber:0, sugar:0, qty:1, unit:'tô', processed:1},
  {id:'chao_ga_chuan', name:'Cháo gà Chuẩn', kcal:350, protein:22, carb:45, fat:8, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'chao_trang', name:'Cháo trắng', kcal:150, protein:3, carb:32, fat:0.5, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'banh_mi_thit_nguoi', name:'Bánh mì Thịt nguội', kcal:450, protein:18, carb:50, fat:18, fiber:0, sugar:0, qty:1, unit:'ổ', processed:1},
  {id:'banh_mi_thit_nuong', name:'Bánh mì Thịt nướng', kcal:500, protein:22, carb:55, fat:20, fiber:0, sugar:0, qty:1, unit:'ổ', processed:1},
  {id:'banh_mi_cha_ca', name:'Bánh mì Chả cá', kcal:420, protein:20, carb:50, fat:15, fiber:0, sugar:0, qty:1, unit:'ổ', processed:0},
  {id:'banh_mi_xiu_mai', name:'Bánh mì Xíu mại', kcal:480, protein:20, carb:52, fat:20, fiber:0, sugar:0, qty:1, unit:'ổ', processed:1},
  {id:'banh_mi_trung', name:'Bánh mì Trứng', kcal:400, protein:15, carb:45, fat:18, fiber:0, sugar:0, qty:1, unit:'ổ', processed:0},
  {id:'banh_xeo_tom_thit', name:'Bánh xèo Tôm thịt', kcal:450, protein:20, carb:45, fat:22, fiber:0, sugar:0, qty:1, unit:'cái lớn', processed:1},
  {id:'banh_khot_chuan', name:'Bánh khọt Chuẩn', kcal:400, protein:18, carb:42, fat:18, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'banh_cuon_thit', name:'Bánh cuốn Thịt', kcal:350, protein:15, carb:50, fat:10, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'banh_canh_cua', name:'Bánh canh Cua', kcal:480, protein:25, carb:60, fat:15, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'banh_canh_gio_heo', name:'Bánh canh Giò heo', kcal:550, protein:28, carb:60, fat:22, fiber:0, sugar:0, qty:1, unit:'tô', processed:1},
  {id:'lau_thai_1_nguoi', name:'Lẩu Thái 1 người', kcal:600, protein:35, carb:60, fat:20, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'lau_mam_1_nguoi', name:'Lẩu mắm 1 người', kcal:550, protein:30, carb:55, fat:18, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'lau_ga_la_e_1_nguoi', name:'Lẩu gà lá é 1 người', kcal:500, protein:32, carb:45, fat:18, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'goi_cuon_tom_thit', name:'Gỏi cuốn Tôm thịt', kcal:110, protein:5, carb:18, fat:2, fiber:0, sugar:0, qty:1, unit:'cuốn', processed:0},
  {id:'cha_gio_chien', name:'Chả giò Chiên', kcal:150, protein:5, carb:12, fat:8, fiber:0, sugar:0, qty:1, unit:'cuốn', processed:1},
  {id:'nem_nuong_nha_trang', name:'Nem nướng Nha Trang', kcal:450, protein:22, carb:45, fat:20, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'thit_kho_tau_trung', name:'Thịt kho Tàu (trứng)', kcal:350, protein:22, carb:8, fat:25, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'ca_kho_to', name:'Cá kho Tộ', kcal:280, protein:25, carb:5, fat:18, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'ga_kho_gung', name:'Gà kho Gừng', kcal:320, protein:28, carb:8, fat:18, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'thit_luoc_heo', name:'Thịt luộc Heo', kcal:250, protein:20, carb:0, fat:18, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'rau_xao_toi', name:'Rau xào Tỏi', kcal:120, protein:3, carb:10, fat:8, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:0},
  {id:'rau_muong_xao_toi', name:'Rau muống Xào tỏi', kcal:110, protein:3, carb:10, fat:7, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:0},
  {id:'canh_chua_ca', name:'Canh chua Cá', kcal:100, protein:12, carb:8, fat:3, fiber:0, sugar:0, qty:1, unit:'chén', processed:0},
  {id:'canh_rau_thit_bam', name:'Canh rau Thịt bằm', kcal:80, protein:8, carb:6, fat:3, fiber:0, sugar:0, qty:1, unit:'chén', processed:0},
  {id:'trung_chien_op_la', name:'Trứng chiên Ốp la', kcal:90, protein:6, carb:0.5, fat:7, fiber:0, sugar:0, qty:1, unit:'quả', processed:0},
  {id:'bun_dau_mam_tom', name:'Bún đậu Mắm tôm', kcal:850, protein:32, carb:75, fat:40, fiber:0, sugar:0, qty:1, unit:'mẹt', processed:1},
  {id:'bun_oc_chuan', name:'Bún ốc Chuẩn', kcal:400, protein:18, carb:55, fat:10, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'bun_moc_chuan', name:'Bún mọc Chuẩn', kcal:450, protein:22, carb:58, fat:12, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'mien_ga_chuan', name:'Miến gà Chuẩn', kcal:380, protein:25, carb:50, fat:8, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'mien_luon_chuan', name:'Miến lươn Chuẩn', kcal:420, protein:25, carb:55, fat:12, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'pho_cuon_ha_noi', name:'Phở cuốn Hà Nội', kcal:90, protein:6, carb:10, fat:3, fiber:0, sugar:0, qty:1, unit:'cuốn', processed:0},
  {id:'pho_xao_bo', name:'Phở xào Bò', kcal:620, protein:28, carb:70, fat:22, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'mi_xao_gion_hai_san', name:'Mì xào Giòn hải sản', kcal:680, protein:25, carb:75, fat:28, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'mi_xao_mem_bo', name:'Mì xào Mềm bò', kcal:620, protein:28, carb:70, fat:22, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'hoanh_thanh_mi', name:'Hoành thánh Mì', kcal:450, protein:22, carb:55, fat:15, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'banh_bao_thit_trung', name:'Bánh bao Thịt trứng', kcal:280, protein:12, carb:35, fat:10, fiber:0, sugar:0, qty:1, unit:'cái', processed:0},
  {id:'banh_bao_chay', name:'Bánh bao Chay', kcal:200, protein:6, carb:32, fat:5, fiber:0, sugar:0, qty:1, unit:'cái', processed:0},
  {id:'banh_gio_chuan', name:'Bánh giò Chuẩn', kcal:320, protein:12, carb:40, fat:12, fiber:0, sugar:0, qty:1, unit:'cái', processed:1},
  {id:'xoi_man_day_du', name:'Xôi mặn Đầy đủ', kcal:620, protein:18, carb:85, fat:20, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'xoi_ga_chuan', name:'Xôi gà Chuẩn', kcal:550, protein:25, carb:80, fat:15, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'xoi_xeo_chuan', name:'Xôi xéo Chuẩn', kcal:500, protein:12, carb:78, fat:14, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'xoi_che_ngot', name:'Xôi chè Ngọt', kcal:420, protein:8, carb:80, fat:5, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'com_cuon_han_viet_hoa', name:'Cơm cuộn Hàn (Việt hóa)', kcal:350, protein:12, carb:55, fat:8, fiber:0, sugar:0, qty:1, unit:'cuộn', processed:0},
  {id:'bot_chien_trung', name:'Bột chiên Trứng', kcal:500, protein:15, carb:55, fat:22, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'banh_trang_tron', name:'Bánh tráng Trộn', kcal:350, protein:10, carb:50, fat:12, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'banh_trang_nuong', name:'Bánh tráng Nướng', kcal:220, protein:8, carb:28, fat:8, fiber:0, sugar:0, qty:1, unit:'cái', processed:1},
  {id:'banh_trang_cuon', name:'Bánh tráng Cuốn', kcal:120, protein:5, carb:18, fat:4, fiber:0, sugar:0, qty:1, unit:'cuốn', processed:0},
  {id:'ha_cao_hap', name:'Há cảo Hấp', kcal:50, protein:3, carb:6, fat:1.5, fiber:0, sugar:0, qty:1, unit:'cái', processed:0},
  {id:'banh_bot_loc_tom_thit', name:'Bánh bột lọc Tôm thịt', kcal:60, protein:3, carb:9, fat:1.5, fiber:0, sugar:0, qty:1, unit:'cái', processed:0},
  {id:'banh_nam_chuan', name:'Bánh nậm Chuẩn', kcal:70, protein:3, carb:11, fat:2, fiber:0, sugar:0, qty:1, unit:'cái', processed:0},
  {id:'banh_it_tran', name:'Bánh ít Trần', kcal:120, protein:4, carb:20, fat:3, fiber:0, sugar:0, qty:1, unit:'cái', processed:0},
  {id:'banh_duc_nong', name:'Bánh đúc Nóng', kcal:250, protein:10, carb:35, fat:8, fiber:0, sugar:0, qty:1, unit:'chén', processed:0},
  {id:'banh_beo_hue_8_cai', name:'Bánh bèo Huế (8 cái)', kcal:280, protein:10, carb:40, fat:8, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'che_dau_den_nuoc_cot', name:'Chè đậu đen Nước cốt', kcal:250, protein:6, carb:45, fat:5, fiber:0, sugar:0, qty:1, unit:'ly', processed:1},
  {id:'che_ba_mau_chuan', name:'Chè ba màu Chuẩn', kcal:300, protein:5, carb:50, fat:8, fiber:0, sugar:0, qty:1, unit:'ly', processed:1},
  {id:'che_khuc_bach_chuan', name:'Chè khúc bạch Chuẩn', kcal:280, protein:8, carb:35, fat:12, fiber:0, sugar:0, qty:1, unit:'ly', processed:1},
  {id:'che_thai_chuan', name:'Chè Thái Chuẩn', kcal:350, protein:6, carb:55, fat:10, fiber:0, sugar:0, qty:1, unit:'ly', processed:1},
  {id:'che_troi_nuoc', name:'Chè trôi nước', kcal:250, protein:4, carb:45, fat:6, fiber:0, sugar:0, qty:1, unit:'chén', processed:1},
  {id:'tau_hu_nuoc_duong', name:'Tàu hủ Nước đường', kcal:150, protein:8, carb:22, fat:3, fiber:0, sugar:0, qty:1, unit:'chén', processed:0},
  {id:'sua_chua_nep_cam', name:'Sữa chua Nếp cẩm', kcal:220, protein:8, carb:35, fat:5, fiber:0, sugar:0, qty:1, unit:'ly', processed:0},
  {id:'kem_trang_tien', name:'Kem Tràng Tiền', kcal:180, protein:3, carb:25, fat:8, fiber:0, sugar:0, qty:1, unit:'cây', processed:1},
  {id:'tra_sua_tran_chau_size_m', name:'Trà sữa Trân châu (size M)', kcal:350, protein:5, carb:60, fat:10, fiber:0, sugar:0, qty:1, unit:'500ml', processed:1},
  {id:'tra_sua_tran_chau_size_l', name:'Trà sữa Trân châu (size L)', kcal:500, protein:7, carb:85, fat:14, fiber:0, sugar:0, qty:1, unit:'700ml', processed:1},
  {id:'tra_dao_cam_sa', name:'Trà đào Cam sả', kcal:180, protein:1, carb:45, fat:0, fiber:0, sugar:0, qty:1, unit:'500ml', processed:1},
  {id:'ca_phe_sua_da_chuan', name:'Cà phê sữa đá Chuẩn', kcal:150, protein:3, carb:25, fat:4, fiber:0, sugar:0, qty:1, unit:'ly', processed:1},
  {id:'ca_phe_den_da', name:'Cà phê đen Đá', kcal:5, protein:0, carb:1, fat:0, fiber:0, sugar:0, qty:1, unit:'ly', processed:0},
  {id:'bac_xiu_chuan', name:'Bạc xỉu Chuẩn', kcal:200, protein:4, carb:30, fat:6, fiber:0, sugar:0, qty:1, unit:'ly', processed:1},
  {id:'nuoc_mia_chuan', name:'Nước mía Chuẩn', kcal:180, protein:0, carb:45, fat:0, fiber:0, sugar:0, qty:1, unit:'ly', processed:1},
  {id:'sinh_to_bo_chuan', name:'Sinh tố bơ Chuẩn', kcal:350, protein:6, carb:40, fat:18, fiber:0, sugar:0, qty:1, unit:'ly', processed:0},
  {id:'sinh_to_xoai_chuan', name:'Sinh tố xoài Chuẩn', kcal:250, protein:4, carb:50, fat:4, fiber:0, sugar:0, qty:1, unit:'ly', processed:1},
  {id:'nuoc_cam_vat', name:'Nước cam Vắt', kcal:120, protein:2, carb:28, fat:0, fiber:0, sugar:0, qty:1, unit:'ly', processed:0},
  {id:'nem_chua_ran', name:'Nem chua Rán', kcal:90, protein:5, carb:5, fat:6, fiber:0, sugar:0, qty:1, unit:'cái', processed:1},
  {id:'cha_ca_la_vong', name:'Chả cá Lã Vọng', kcal:450, protein:30, carb:30, fat:22, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'cha_lua', name:'Chả lụa', kcal:200, protein:12, carb:5, fat:14, fiber:0, sugar:0, qty:1, unit:'100g', processed:1},
  {id:'tom_nuong_muoi_ot', name:'Tôm nướng Muối ớt', kcal:120, protein:22, carb:1, fat:3, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'muc_nuong_muoi_ot', name:'Mực nướng Muối ớt', kcal:140, protein:18, carb:4, fat:5, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'ca_nuong_trui_la_chuoi', name:'Cá nướng Trui/lá chuối', kcal:180, protein:22, carb:1, fat:10, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'ga_nuong_muoi_ot_dui', name:'Gà nướng Muối ớt (đùi)', kcal:280, protein:28, carb:0, fat:18, fiber:0, sugar:0, qty:1, unit:'đùi', processed:0},
  {id:'ga_nuong_mat_ong', name:'Gà nướng Mật ong', kcal:320, protein:28, carb:8, fat:18, fiber:0, sugar:0, qty:1, unit:'đùi', processed:1},
  {id:'canh_ga_chien_nuoc_mam', name:'Cánh gà Chiên nước mắm', kcal:320, protein:22, carb:8, fat:22, fiber:0, sugar:0, qty:1, unit:'100g', processed:1},
  {id:'heo_quay', name:'Heo quay', kcal:350, protein:22, carb:0, fat:28, fiber:0, sugar:0, qty:1, unit:'100g', processed:1},
  {id:'vit_quay', name:'Vịt quay', kcal:320, protein:19, carb:0, fat:28, fiber:0, sugar:0, qty:1, unit:'100g', processed:1},
  {id:'bo_ne_banh_mi', name:'Bò né Bánh mì', kcal:650, protein:35, carb:50, fat:35, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'bo_bit_tet_chuan', name:'Bò bít tết Chuẩn', kcal:550, protein:40, carb:25, fat:30, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'long_lon_luoc_nuong', name:'Lòng lợn Luộc/nướng', kcal:230, protein:14, carb:2, fat:18, fiber:0, sugar:0, qty:1, unit:'100g', processed:1},
  {id:'tiet_canh', name:'Tiết canh', kcal:150, protein:18, carb:2, fat:6, fiber:0, sugar:0, qty:1, unit:'chén', processed:1},
  {id:'oc_luoc_xao', name:'Ốc Luộc/xào', kcal:250, protein:25, carb:25, fat:5, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'khoai_lang_nuong', name:'Khoai lang Nướng', kcal:130, protein:2, carb:30, fat:0, fiber:0, sugar:0, qty:1, unit:'củ vừa', processed:0},
  {id:'khoai_mi_hap_nuong', name:'Khoai mì Hấp/nướng', kcal:160, protein:1, carb:38, fat:0, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'bap_luoc', name:'Bắp Luộc', kcal:100, protein:3, carb:22, fat:1, fiber:0, sugar:0, qty:1, unit:'trái', processed:0},
  {id:'bap_xao_bo', name:'Bắp Xào bơ', kcal:250, protein:5, carb:35, fat:12, fiber:0, sugar:0, qty:1, unit:'ly', processed:1},
  {id:'dau_hu_chien', name:'Đậu hũ Chiên', kcal:200, protein:12, carb:8, fat:14, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'dau_hu_sot_ca', name:'Đậu hũ Sốt cà', kcal:180, protein:11, carb:12, fat:10, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'trung_vit_lon', name:'Trứng vịt lộn', kcal:180, protein:14, carb:2, fat:12, fiber:0, sugar:0, qty:1, unit:'quả', processed:0},
  {id:'trung_cut_lon_luoc_5_qua', name:'Trứng cút Lộn/luộc (5 quả)', kcal:100, protein:9, carb:1, fat:7, fiber:0, sugar:0, qty:5, unit:'quả', processed:0},
  {id:'banh_chuoi_nuong_chien', name:'Bánh chuối Nướng/chiên', kcal:250, protein:4, carb:38, fat:10, fiber:0, sugar:0, qty:1, unit:'miếng', processed:1},
  {id:'che_dau_den_nuoc_cot_dua', name:'Chè đậu đen Nước cốt dừa', kcal:250, protein:6, carb:45, fat:5, fiber:0, sugar:0, qty:1, unit:'ly', processed:1},
  {id:'che_dau_xanh_danh_nuoc', name:'Chè đậu xanh Đánh/nước', kcal:220, protein:7, carb:42, fat:3, fiber:0, sugar:0, qty:1, unit:'ly', processed:0},
  {id:'che_thai_chuan_2', name:'Chè thái Chuẩn', kcal:350, protein:6, carb:55, fat:10, fiber:0, sugar:0, qty:1, unit:'ly', processed:1},
  {id:'che_buoi_chuan', name:'Chè bưởi Chuẩn', kcal:280, protein:4, carb:52, fat:6, fiber:0, sugar:0, qty:1, unit:'ly', processed:1},
  {id:'che_troi_nuoc_chuan', name:'Chè trôi nước Chuẩn', kcal:250, protein:4, carb:45, fat:6, fiber:0, sugar:0, qty:1, unit:'chén', processed:1},
  {id:'che_hat_sen_long_nhan', name:'Chè hạt sen Long nhãn', kcal:180, protein:5, carb:35, fat:2, fiber:0, sugar:0, qty:1, unit:'chén', processed:0},
  {id:'che_dau_do_chuan', name:'Chè đậu đỏ Chuẩn', kcal:240, protein:7, carb:48, fat:2, fiber:0, sugar:0, qty:1, unit:'ly', processed:0},
  {id:'che_khoai_mon_nuoc_cot', name:'Chè khoai môn Nước cốt', kcal:260, protein:4, carb:48, fat:6, fiber:0, sugar:0, qty:1, unit:'ly', processed:1},
  {id:'che_chuoi_nuoc_cot_dua', name:'Chè chuối Nước cốt dừa', kcal:280, protein:3, carb:45, fat:10, fiber:0, sugar:0, qty:1, unit:'chén', processed:1},
  {id:'che_suong_sa_hat_luu_chuan', name:'Chè sương sa hạt lựu Chuẩn', kcal:220, protein:2, carb:45, fat:4, fiber:0, sugar:0, qty:1, unit:'ly', processed:1},
  {id:'yaourt_da', name:'Yaourt Đá', kcal:180, protein:6, carb:30, fat:4, fiber:0, sugar:0, qty:1, unit:'ly', processed:0},
  {id:'rau_cau_dua_la_dua', name:'Rau câu Dừa/lá dứa', kcal:90, protein:1, carb:18, fat:2, fiber:0, sugar:0, qty:1, unit:'miếng', processed:0},
  {id:'banh_flan_caramel', name:'Bánh flan Caramel', kcal:120, protein:4, carb:15, fat:5, fiber:0, sugar:0, qty:1, unit:'cái', processed:1},
  {id:'kem_que_socola', name:'Kem Que/socola', kcal:220, protein:3, carb:28, fat:12, fiber:0, sugar:0, qty:1, unit:'cây', processed:1},
  {id:'kem_ly', name:'Kem Ly', kcal:250, protein:5, carb:30, fat:14, fiber:0, sugar:0, qty:1, unit:'ly nhỏ', processed:1},
  {id:'banh_su_kem_vanilla', name:'Bánh su kem Vanilla', kcal:120, protein:2, carb:14, fat:7, fiber:0, sugar:0, qty:1, unit:'cái', processed:1},
  {id:'banh_tiramisu_chuan', name:'Bánh tiramisu Chuẩn', kcal:320, protein:5, carb:30, fat:20, fiber:0, sugar:0, qty:1, unit:'miếng', processed:1},
  {id:'banh_mousse_chocolate', name:'Bánh mousse Chocolate', kcal:350, protein:5, carb:35, fat:22, fiber:0, sugar:0, qty:1, unit:'miếng', processed:1},
  {id:'banh_cheesecake_new_york', name:'Bánh cheesecake New York', kcal:380, protein:7, carb:30, fat:26, fiber:0, sugar:0, qty:1, unit:'miếng', processed:1},
  {id:'panna_cotta_dau_xoai', name:'Panna cotta Dâu/xoài', kcal:220, protein:4, carb:24, fat:12, fiber:0, sugar:0, qty:1, unit:'hũ', processed:1},
  {id:'trai_cay_dua_hau', name:'Trái cây Dưa hấu', kcal:30, protein:0.6, carb:8, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'trai_cay_xoai_chin', name:'Trái cây Xoài chín', kcal:65, protein:0.8, carb:17, fat:0.4, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'trai_cay_xoai_xanh', name:'Trái cây Xoài xanh', kcal:50, protein:0.5, carb:13, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'trai_cay_chuoi', name:'Trái cây Chuối', kcal:105, protein:1.3, carb:27, fat:0.4, fiber:0, sugar:0, qty:1, unit:'quả vừa', processed:0},
  {id:'trai_cay_tao', name:'Trái cây Táo', kcal:95, protein:0.5, carb:25, fat:0.3, fiber:0, sugar:0, qty:1, unit:'quả vừa', processed:0},
  {id:'trai_cay_cam', name:'Trái cây Cam', kcal:65, protein:1.2, carb:16, fat:0.2, fiber:0, sugar:0, qty:1, unit:'quả vừa', processed:0},
  {id:'trai_cay_quyt', name:'Trái cây Quýt', kcal:45, protein:0.7, carb:12, fat:0.2, fiber:0, sugar:0, qty:1, unit:'quả', processed:0},
  {id:'trai_cay_oi', name:'Trái cây Ổi', kcal:68, protein:2.6, carb:14, fat:1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'trai_cay_thanh_long', name:'Trái cây Thanh long', kcal:50, protein:1.1, carb:12, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'trai_cay_nho', name:'Trái cây Nho', kcal:70, protein:0.7, carb:18, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'trai_cay_dua_thom', name:'Trái cây Dứa (thơm)', kcal:50, protein:0.5, carb:13, fat:0.1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'trai_cay_buoi', name:'Trái cây Bưởi', kcal:42, protein:0.8, carb:11, fat:0.1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'trai_cay_mit', name:'Trái cây Mít', kcal:95, protein:1.7, carb:24, fat:0.6, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'trai_cay_sau_rieng', name:'Trái cây Sầu riêng', kcal:150, protein:2, carb:27, fat:5, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'trai_cay_bo', name:'Trái cây Bơ', kcal:160, protein:2, carb:9, fat:15, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'trai_cay_vai', name:'Trái cây Vải', kcal:66, protein:0.8, carb:17, fat:0.4, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'trai_cay_nhan', name:'Trái cây Nhãn', kcal:60, protein:1, carb:15, fat:0.1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'trai_cay_mang_cut', name:'Trái cây Măng cụt', kcal:73, protein:0.5, carb:18, fat:0.6, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'trai_cay_chom_chom', name:'Trái cây Chôm chôm', kcal:68, protein:0.9, carb:17, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'trai_cay_dau_tay', name:'Trái cây Dâu tây', kcal:32, protein:0.7, carb:8, fat:0.3, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'nuoc_uong_nuoc_loc', name:'Nước uống Nước lọc', kcal:0, protein:0, carb:0, fat:0, fiber:0, sugar:0, qty:1, unit:'500ml', processed:0},
  {id:'nuoc_uong_nuoc_dua', name:'Nước uống Nước dừa', kcal:60, protein:1, carb:15, fat:0, fiber:0, sugar:0, qty:1, unit:'trái', processed:0},
  {id:'nuoc_uong_nuoc_cam_vat', name:'Nước uống Nước cam vắt', kcal:120, protein:2, carb:28, fat:0, fiber:0, sugar:0, qty:1, unit:'ly', processed:0},
  {id:'nuoc_uong_nuoc_ep_thom', name:'Nước uống Nước ép thơm', kcal:110, protein:1, carb:26, fat:0, fiber:0, sugar:0, qty:1, unit:'ly', processed:0},
  {id:'nuoc_uong_sinh_to_bo', name:'Nước uống Sinh tố bơ', kcal:350, protein:6, carb:40, fat:18, fiber:0, sugar:0, qty:1, unit:'ly', processed:0},
  {id:'nuoc_uong_sinh_to_xoai', name:'Nước uống Sinh tố xoài', kcal:250, protein:4, carb:50, fat:4, fiber:0, sugar:0, qty:1, unit:'ly', processed:1},
  {id:'nuoc_uong_sinh_to_chuoi', name:'Nước uống Sinh tố chuối', kcal:220, protein:5, carb:45, fat:3, fiber:0, sugar:0, qty:1, unit:'ly', processed:0},
  {id:'nuoc_uong_nuoc_mia', name:'Nước uống Nước mía', kcal:180, protein:0, carb:45, fat:0, fiber:0, sugar:0, qty:1, unit:'500ml', processed:1},
  {id:'nuoc_uong_tra_dao_cam_sa', name:'Nước uống Trà đào cam sả', kcal:180, protein:1, carb:45, fat:0, fiber:0, sugar:0, qty:1, unit:'500ml', processed:1},
  {id:'nuoc_uong_tra_tac', name:'Nước uống Trà tắc', kcal:140, protein:0, carb:35, fat:0, fiber:0, sugar:0, qty:1, unit:'500ml', processed:1},
  {id:'nuoc_uong_tra_chanh', name:'Nước uống Trà chanh', kcal:120, protein:0, carb:30, fat:0, fiber:0, sugar:0, qty:1, unit:'500ml', processed:1},
  {id:'nuoc_uong_tra_sua_tran_chau', name:'Nước uống Trà sữa trân châu', kcal:350, protein:5, carb:60, fat:10, fiber:0, sugar:0, qty:1, unit:'Size M', processed:1},
  {id:'nuoc_uong_tra_sua_tran_chau_2', name:'Nước uống Trà sữa trân châu', kcal:500, protein:7, carb:85, fat:14, fiber:0, sugar:0, qty:1, unit:'Size L', processed:1},
  {id:'nuoc_uong_ca_phe_den_da', name:'Nước uống Cà phê đen đá', kcal:5, protein:0, carb:1, fat:0, fiber:0, sugar:0, qty:1, unit:'ly', processed:0},
  {id:'nuoc_uong_ca_phe_sua_da', name:'Nước uống Cà phê sữa đá', kcal:150, protein:3, carb:25, fat:4, fiber:0, sugar:0, qty:1, unit:'ly', processed:1},
  {id:'nuoc_uong_bac_xiu', name:'Nước uống Bạc xỉu', kcal:200, protein:4, carb:30, fat:6, fiber:0, sugar:0, qty:1, unit:'ly', processed:1},
  {id:'nuoc_uong_sua_dau_nanh', name:'Nước uống Sữa đậu nành', kcal:140, protein:7, carb:18, fat:4, fiber:0, sugar:0, qty:1, unit:'300ml', processed:0},
  {id:'nuoc_uong_sua_tuoi_khong_duo', name:'Nước uống Sữa tươi không đường', kcal:110, protein:8, carb:6, fat:6, fiber:0, sugar:0, qty:1, unit:'250ml', processed:0},
  {id:'nuoc_uong_coca_cola', name:'Nước uống Coca-Cola', kcal:139, protein:0, carb:35, fat:0, fiber:0, sugar:0, qty:1, unit:'Lon 330ml', processed:1},
  {id:'nuoc_uong_pepsi', name:'Nước uống Pepsi', kcal:150, protein:0, carb:38, fat:0, fiber:0, sugar:0, qty:1, unit:'Lon 330ml', processed:1},
  {id:'nuoc_uong_sting_dau', name:'Nước uống Sting dâu', kcal:160, protein:0, carb:40, fat:0, fiber:0, sugar:0, qty:1, unit:'Lon 330ml', processed:1},
  {id:'nuoc_uong_red_bull', name:'Nước uống Red Bull', kcal:110, protein:1, carb:27, fat:0, fiber:0, sugar:0, qty:1, unit:'Lon 250ml', processed:1},
  {id:'nuoc_uong_monster_energy', name:'Nước uống Monster Energy', kcal:155, protein:0, carb:39, fat:0, fiber:0, sugar:0, qty:1, unit:'Lon 330ml', processed:1},
  {id:'sushi_ca_hoi_1_mieng', name:'Sushi Cá hồi (1 miếng)', kcal:50, protein:4, carb:7, fat:1, fiber:0, sugar:0, qty:1, unit:'miếng', processed:0},
  {id:'sushi_set_10_mieng', name:'Sushi Set 10 miếng', kcal:500, protein:35, carb:70, fat:10, fiber:0, sugar:0, qty:10, unit:'miếng', processed:0},
  {id:'sashimi_ca_hoi', name:'Sashimi Cá hồi', kcal:200, protein:22, carb:0, fat:12, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'ramen_tonkotsu', name:'Ramen Tonkotsu', kcal:700, protein:30, carb:75, fat:30, fiber:0, sugar:0, qty:1, unit:'tô', processed:1},
  {id:'ramen_shoyu', name:'Ramen Shoyu', kcal:550, protein:28, carb:70, fat:18, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'udon_bo', name:'Udon Bò', kcal:500, protein:22, carb:75, fat:12, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'com_bento_ga_teriyaki', name:'Cơm bento Gà teriyaki', kcal:650, protein:32, carb:85, fat:18, fiber:0, sugar:0, qty:1, unit:'hộp', processed:1},
  {id:'com_ca_ri_nhat_chuan', name:'Cơm cà ri Nhật Chuẩn', kcal:700, protein:25, carb:95, fat:22, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'takoyaki_6_vien', name:'Takoyaki 6 viên', kcal:350, protein:12, carb:35, fat:18, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'tonkatsu_heo', name:'Tonkatsu Heo', kcal:750, protein:35, carb:60, fat:40, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'kimbap_han', name:'Kimbap Hàn', kcal:300, protein:10, carb:50, fat:8, fiber:0, sugar:0, qty:1, unit:'cuộn', processed:0},
  {id:'bibimbap_bo', name:'Bibimbap Bò', kcal:600, protein:25, carb:80, fat:18, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'mi_cay_han_cap_3', name:'Mì cay Hàn (cấp 3)', kcal:650, protein:28, carb:75, fat:25, fiber:0, sugar:0, qty:1, unit:'tô', processed:1},
  {id:'tokbokki_chuan', name:'Tokbokki Chuẩn', kcal:450, protein:8, carb:80, fat:10, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'ga_ran_han_sot_cay', name:'Gà rán Hàn Sốt cay', kcal:600, protein:30, carb:50, fat:30, fiber:0, sugar:0, qty:5, unit:'miếng', processed:1},
  {id:'bbq_han_bo_ba_chi_200g', name:'BBQ Hàn Bò ba chỉ (200g)', kcal:720, protein:35, carb:5, fat:55, fiber:0, sugar:0, qty:1, unit:'200g', processed:1},
  {id:'pad_thai_tom', name:'Pad Thái Tôm', kcal:550, protein:22, carb:65, fat:20, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'tom_yum_tom', name:'Tom Yum Tôm', kcal:250, protein:22, carb:18, fat:8, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'com_xanh_thai_ga', name:'Cơm xanh Thái Gà', kcal:650, protein:28, carb:80, fat:22, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'pizza_pho_mai_slice', name:'Pizza Phô mai (slice)', kcal:280, protein:12, carb:35, fat:10, fiber:0, sugar:0, qty:1, unit:'miếng', processed:1},
  {id:'pizza_hai_san_slice', name:'Pizza Hải sản (slice)', kcal:300, protein:14, carb:35, fat:12, fiber:0, sugar:0, qty:1, unit:'miếng', processed:1},
  {id:'pizza_pepperoni_slice', name:'Pizza Pepperoni (slice)', kcal:320, protein:13, carb:36, fat:14, fiber:0, sugar:0, qty:1, unit:'miếng', processed:1},
  {id:'pizza_hawaiian_slice', name:'Pizza Hawaiian (slice)', kcal:290, protein:12, carb:35, fat:10, fiber:0, sugar:0, qty:1, unit:'miếng', processed:1},
  {id:'pasta_bolognese', name:'Pasta Bolognese', kcal:650, protein:25, carb:75, fat:25, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'pasta_carbonara', name:'Pasta Carbonara', kcal:750, protein:28, carb:75, fat:35, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'pasta_aglio_e_olio', name:'Pasta Aglio e Olio', kcal:520, protein:12, carb:70, fat:20, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:0},
  {id:'pasta_hai_san', name:'Pasta Hải sản', kcal:580, protein:28, carb:72, fat:18, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:0},
  {id:'burger_bo_pho_mai', name:'Burger Bò phô mai', kcal:550, protein:28, carb:45, fat:28, fiber:0, sugar:0, qty:1, unit:'cái', processed:1},
  {id:'burger_ga', name:'Burger Gà', kcal:480, protein:25, carb:50, fat:20, fiber:0, sugar:0, qty:1, unit:'cái', processed:1},
  {id:'burger_double_beef', name:'Burger Double beef', kcal:750, protein:40, carb:50, fat:42, fiber:0, sugar:0, qty:1, unit:'cái', processed:1},
  {id:'hot_dog_chuan', name:'Hot dog Chuẩn', kcal:350, protein:12, carb:25, fat:22, fiber:0, sugar:0, qty:1, unit:'cái', processed:1},
  {id:'khoai_tay_chien_size_m', name:'Khoai tây chiên Size M', kcal:350, protein:4, carb:45, fat:18, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'ga_ran_kfc_1_mieng', name:'Gà rán KFC (1 miếng)', kcal:320, protein:20, carb:12, fat:20, fiber:0, sugar:0, qty:1, unit:'miếng', processed:1},
  {id:'ga_ran_mcdonald_s_1_mieng', name:'Gà rán McDonald’s (1 miếng)', kcal:300, protein:19, carb:12, fat:18, fiber:0, sugar:0, qty:1, unit:'miếng', processed:1},
  {id:'salad_caesar', name:'Salad Caesar', kcal:350, protein:12, carb:15, fat:25, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:0},
  {id:'salad_ca_ngu', name:'Salad Cá ngừ', kcal:280, protein:22, carb:18, fat:12, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:0},
  {id:'salad_uc_ga', name:'Salad Ức gà', kcal:320, protein:28, carb:18, fat:14, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:0},
  {id:'banh_croissant_bo', name:'Bánh croissant Bơ', kcal:280, protein:6, carb:30, fat:16, fiber:0, sugar:0, qty:1, unit:'cái', processed:1},
  {id:'donut_glazed', name:'Donut Glazed', kcal:260, protein:3, carb:30, fat:14, fiber:0, sugar:0, qty:1, unit:'cái', processed:1},
  {id:'taco_bo', name:'Taco Bò', kcal:380, protein:20, carb:35, fat:18, fiber:0, sugar:0, qty:2, unit:'cái', processed:0},
  {id:'burrito_bo', name:'Burrito Bò', kcal:650, protein:30, carb:75, fat:22, fiber:0, sugar:0, qty:1, unit:'cuộn', processed:1},
  {id:'nachos_pho_mai', name:'Nachos Phô mai', kcal:450, protein:10, carb:45, fat:25, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'fish_chips_kieu_anh', name:'Fish & Chips Kiểu Anh', kcal:700, protein:30, carb:60, fat:35, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'paella_hai_san', name:'Paella Hải sản', kcal:600, protein:28, carb:75, fat:18, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'dimsum_ha_cao_xiu_mai_6_vien', name:'Dimsum Há cảo + xíu mại (6 viên)', kcal:320, protein:16, carb:42, fat:10, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'xiao_long_bao_tieu_long_bao', name:'Xiao Long Bao Tiểu long bao', kcal:360, protein:18, carb:45, fat:12, fiber:0, sugar:0, qty:6, unit:'viên', processed:0},
  {id:'com_tron_ga_han', name:'Cơm trộn Gà Hàn', kcal:550, protein:28, carb:75, fat:15, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'mi_y_sot_kem_nam', name:'Mì Ý Sốt kem nấm', kcal:680, protein:20, carb:78, fat:30, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'ga_popcorn_han_dai', name:'Gà popcorn Hàn/Đài', kcal:420, protein:22, carb:30, fat:22, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'tra_sua_matcha_nhat', name:'Trà sữa Matcha Nhật', kcal:320, protein:6, carb:55, fat:9, fiber:0, sugar:0, qty:1, unit:'500ml', processed:1},
  {id:'mochi_kem', name:'Mochi Kem', kcal:120, protein:2, carb:20, fat:4, fiber:0, sugar:0, qty:1, unit:'cái', processed:1},
  {id:'bingsu_dau_xoai', name:'Bingsu Dâu/xoài', kcal:350, protein:6, carb:65, fat:8, fiber:0, sugar:0, qty:1, unit:'tô nhỏ', processed:1},
  {id:'yogurt_greek_granola', name:'Yogurt Greek Granola', kcal:250, protein:15, carb:28, fat:8, fiber:0, sugar:0, qty:1, unit:'ly', processed:0},
  {id:'rau_muong_luoc', name:'Rau muống Luộc', kcal:25, protein:2.7, carb:4, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'rau_muong_xao_toi_2', name:'Rau muống Xào tỏi', kcal:110, protein:3, carb:10, fat:7, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'cai_thia_luoc', name:'Cải thìa Luộc', kcal:15, protein:1.5, carb:2, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'cai_ngot_luoc', name:'Cải ngọt Luộc', kcal:20, protein:2, carb:3, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'cai_xanh_luoc', name:'Cải xanh Luộc', kcal:22, protein:2, carb:4, fat:0.3, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'rau_den_luoc', name:'Rau dền Luộc', kcal:23, protein:2.5, carb:4, fat:0.3, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'mong_toi_luoc', name:'Mồng tơi Luộc', kcal:19, protein:2, carb:3, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'bap_cai_luoc', name:'Bắp cải Luộc', kcal:25, protein:1.3, carb:6, fat:0.1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'bap_cai_xao', name:'Bắp cải Xào', kcal:70, protein:2, carb:7, fat:4, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'cai_thao_luoc', name:'Cải thảo Luộc', kcal:16, protein:1.2, carb:3, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'xa_lach_song', name:'Xà lách Sống', kcal:15, protein:1.4, carb:3, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'rau_song_mixed', name:'Rau sống Mixed', kcal:20, protein:1.5, carb:4, fat:0.3, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'rau_lang_luoc', name:'Rau lang Luộc', kcal:30, protein:2, carb:6, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'dau_bap_luoc', name:'Đậu bắp Luộc', kcal:33, protein:2, carb:7, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'bi_do_luoc', name:'Bí đỏ Luộc', kcal:34, protein:1, carb:8, fat:0.1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'bi_xanh_luoc', name:'Bí xanh Luộc', kcal:13, protein:0.6, carb:3, fat:0.1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'su_su_luoc', name:'Su su Luộc', kcal:19, protein:0.8, carb:4, fat:0.1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'ca_rot_luoc', name:'Cà rốt Luộc', kcal:41, protein:1, carb:10, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'khoai_tay_luoc', name:'Khoai tây Luộc', kcal:87, protein:2, carb:20, fat:0.1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'khoai_lang_luoc', name:'Khoai lang Luộc', kcal:86, protein:1.6, carb:20, fat:0.1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'ngo_bap_luoc', name:'Ngô (bắp) Luộc', kcal:96, protein:3.4, carb:21, fat:1.5, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'cu_den_luoc', name:'Củ dền Luộc', kcal:43, protein:1.6, carb:10, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'cu_cai_trang_luoc', name:'Củ cải trắng Luộc', kcal:18, protein:0.6, carb:4, fat:0.1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'bong_cai_xanh_luoc', name:'Bông cải xanh Luộc', kcal:35, protein:2.8, carb:7, fat:0.4, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'bong_cai_xanh_xao', name:'Bông cải xanh Xào', kcal:80, protein:3, carb:8, fat:4, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'sup_lo_trang_luoc', name:'Súp lơ trắng Luộc', kcal:25, protein:2, carb:5, fat:0.3, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'mang_tay_luoc', name:'Măng tây Luộc', kcal:22, protein:2.4, carb:4, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'dau_que_luoc', name:'Đậu que Luộc', kcal:31, protein:2, carb:7, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'dau_ha_lan_luoc', name:'Đậu Hà Lan Luộc', kcal:84, protein:5, carb:15, fat:0.4, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'nam_kim_cham_luoc', name:'Nấm kim châm Luộc', kcal:37, protein:2.7, carb:7, fat:0.3, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'nam_dui_ga_ap_chao', name:'Nấm đùi gà Áp chảo', kcal:55, protein:3, carb:8, fat:2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'nam_mo_luoc', name:'Nấm mỡ Luộc', kcal:22, protein:3, carb:3, fat:0.3, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'dua_leo_song', name:'Dưa leo Sống', kcal:15, protein:0.7, carb:4, fat:0.1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'ca_chua_song', name:'Cà chua Sống', kcal:18, protein:0.9, carb:4, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'ca_tim_nuong', name:'Cà tím Nướng', kcal:35, protein:1, carb:8, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'dau_hu_trang', name:'Đậu hũ Trắng', kcal:76, protein:8, carb:2, fat:4, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'salad_rau_khong_sot', name:'Salad rau Không sốt', kcal:80, protein:3, carb:12, fat:2, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'salad_rau_sot_me_rang', name:'Salad rau Sốt mè rang', kcal:220, protein:4, carb:15, fat:15, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'trung_ga_luoc', name:'Trứng gà Luộc', kcal:78, protein:6, carb:0.6, fat:5, fiber:0, sugar:0, qty:1, unit:'quả', processed:0},
  {id:'trung_ga_op_la', name:'Trứng gà Ốp la', kcal:90, protein:6, carb:0.5, fat:7, fiber:0, sugar:0, qty:1, unit:'quả', processed:0},
  {id:'trung_vit_luoc', name:'Trứng vịt Luộc', kcal:130, protein:9, carb:1, fat:10, fiber:0, sugar:0, qty:1, unit:'quả', processed:0},
  {id:'trung_cut_luoc', name:'Trứng cút Luộc', kcal:17, protein:1.3, carb:0.1, fat:1.2, fiber:0, sugar:0, qty:1, unit:'quả', processed:0},
  {id:'trung_cut_5_qua', name:'Trứng cút 5 quả', kcal:85, protein:7, carb:0.5, fat:6, fiber:0, sugar:0, qty:5, unit:'quả', processed:0},
  {id:'cha_lua_2', name:'Chả lụa', kcal:100, protein:6, carb:2, fat:7, fiber:0, sugar:0, qty:1, unit:'50g', processed:1},
  {id:'cha_bo', name:'Chả bò', kcal:110, protein:8, carb:2, fat:7, fiber:0, sugar:0, qty:1, unit:'50g', processed:0},
  {id:'cha_ca_chien', name:'Chả cá Chiên', kcal:90, protein:7, carb:4, fat:5, fiber:0, sugar:0, qty:1, unit:'50g', processed:1},
  {id:'xuc_xich_duc_cp', name:'Xúc xích Đức/CP', kcal:140, protein:5, carb:2, fat:12, fiber:0, sugar:0, qty:1, unit:'cây', processed:1},
  {id:'thit_bo_them_pho_lau', name:'Thịt bò thêm Phở/lẩu', kcal:95, protein:11, carb:0, fat:5, fiber:0, sugar:0, qty:1, unit:'50g', processed:0},
  {id:'gau_bo_them_pho_lau', name:'Gầu bò thêm Phở/lẩu', kcal:150, protein:9, carb:0, fat:12, fiber:0, sugar:0, qty:1, unit:'50g', processed:0},
  {id:'gan_bo_them_pho_lau', name:'Gân bò thêm Phở/lẩu', kcal:80, protein:13, carb:0, fat:2, fiber:0, sugar:0, qty:1, unit:'50g', processed:0},
  {id:'bo_vien_pho', name:'Bò viên Phở', kcal:40, protein:3, carb:1, fat:3, fiber:0, sugar:0, qty:1, unit:'viên', processed:0},
  {id:'tom_them_luoc_nuong', name:'Tôm thêm Luộc/nướng', kcal:60, protein:11, carb:0, fat:1, fiber:0, sugar:0, qty:1, unit:'50g', processed:0},
  {id:'muc_them_luoc_nuong', name:'Mực thêm Luộc/nướng', kcal:70, protein:9, carb:1, fat:2, fiber:0, sugar:0, qty:1, unit:'50g', processed:0},
  {id:'ga_xe_pho_chao', name:'Gà xé Phở/cháo', kcal:85, protein:14, carb:0, fat:3, fiber:0, sugar:0, qty:1, unit:'50g', processed:0},
  {id:'da_ga_luoc_chien', name:'Da gà Luộc/chiên', kcal:135, protein:3, carb:0, fat:13, fiber:0, sugar:0, qty:1, unit:'30g', processed:1},
  {id:'heo_quay_them_50g', name:'Heo quay thêm 50g', kcal:175, protein:11, carb:0, fat:14, fiber:0, sugar:0, qty:1, unit:'50g', processed:1},
  {id:'thit_heo_luoc_50g', name:'Thịt heo luộc 50g', kcal:125, protein:10, carb:0, fat:9, fiber:0, sugar:0, qty:1, unit:'50g', processed:0},
  {id:'xiu_mai_1_vien', name:'Xíu mại 1 viên', kcal:60, protein:4, carb:2, fat:4, fiber:0, sugar:0, qty:1, unit:'viên', processed:0},
  {id:'nem_chua_1_cai', name:'Nem chua 1 cái', kcal:65, protein:4, carb:2, fat:4, fiber:0, sugar:0, qty:1, unit:'cái', processed:1},
  {id:'cha_gio_1_cuon', name:'Chả giò 1 cuốn', kcal:150, protein:5, carb:12, fat:8, fiber:0, sugar:0, qty:1, unit:'cuốn', processed:1},
  {id:'dau_hu_trang_2', name:'Đậu hũ Trắng', kcal:38, protein:4, carb:1, fat:2, fiber:0, sugar:0, qty:1, unit:'50g', processed:0},
  {id:'dau_hu_chien_2', name:'Đậu hũ Chiên', kcal:100, protein:6, carb:4, fat:7, fiber:0, sugar:0, qty:1, unit:'50g', processed:0},
  {id:'pho_mai_lat_cheddar', name:'Phô mai lát Cheddar', kcal:70, protein:4, carb:1, fat:6, fiber:0, sugar:0, qty:1, unit:'lát', processed:1},
  {id:'pho_mai_bao_mozzarella', name:'Phô mai bào Mozzarella', kcal:90, protein:7, carb:1, fat:7, fiber:0, sugar:0, qty:1, unit:'30g', processed:0},
  {id:'bo_mayonnaise', name:'Bơ Mayonnaise', kcal:100, protein:0, carb:1, fat:11, fiber:0, sugar:0, qty:1, unit:'muỗng canh', processed:1},
  {id:'bo_thuc_vat_margarine', name:'Bơ thực vật Margarine', kcal:72, protein:0, carb:0, fat:8, fiber:0, sugar:0, qty:1, unit:'muỗng', processed:1},
  {id:'hanh_phi', name:'Hành phi', kcal:55, protein:1, carb:4, fat:4, fiber:0, sugar:0, qty:1, unit:'muỗng canh', processed:1},
  {id:'top_mo', name:'Tóp mỡ', kcal:120, protein:2, carb:0, fat:12, fiber:0, sugar:0, qty:1, unit:'20g', processed:1},
  {id:'mo_hanh', name:'Mỡ hành', kcal:45, protein:0, carb:1, fat:5, fiber:0, sugar:0, qty:1, unit:'muỗng canh', processed:1},
  {id:'sa_te', name:'Sa tế', kcal:70, protein:1, carb:2, fat:7, fiber:0, sugar:0, qty:1, unit:'muỗng canh', processed:1},
  {id:'tuong_den_pho', name:'Tương đen Phở', kcal:35, protein:1, carb:8, fat:0, fiber:0, sugar:0, qty:1, unit:'muỗng canh', processed:1},
  {id:'tuong_ot', name:'Tương ớt', kcal:20, protein:0, carb:5, fat:0, fiber:0, sugar:0, qty:1, unit:'muỗng canh', processed:1},
  {id:'nuoc_mam_duong_pha', name:'Nước mắm đường Pha', kcal:25, protein:0, carb:6, fat:0, fiber:0, sugar:0, qty:1, unit:'muỗng canh', processed:1},
  {id:'sot_me_rang_salad', name:'Sốt mè rang Salad', kcal:80, protein:1, carb:3, fat:7, fiber:0, sugar:0, qty:1, unit:'muỗng canh', processed:1},
  {id:'sot_caesar_salad', name:'Sốt Caesar Salad', kcal:90, protein:1, carb:1, fat:9, fiber:0, sugar:0, qty:1, unit:'muỗng canh', processed:1},
  {id:'ketchup_tuong_ca', name:'Ketchup Tương cà', kcal:20, protein:0, carb:5, fat:0, fiber:0, sugar:0, qty:1, unit:'muỗng canh', processed:1},
  {id:'sot_pho_mai', name:'Sốt phô mai', kcal:110, protein:3, carb:4, fat:9, fiber:0, sugar:0, qty:1, unit:'30g', processed:1},
  {id:'quay_pho_chao', name:'Quẩy Phở/cháo', kcal:120, protein:2, carb:14, fat:6, fiber:0, sugar:0, qty:1, unit:'cái', processed:1},
  {id:'banh_mi_them_1_2_o', name:'Bánh mì thêm 1/2 ổ', kcal:110, protein:4, carb:22, fat:1, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'bun_them_100g', name:'Bún thêm 100g', kcal:110, protein:2, carb:25, fat:0.5, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'mi_them_100g', name:'Mì thêm 100g', kcal:140, protein:4, carb:28, fat:1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'nui_them_100g', name:'Nui thêm 100g', kcal:130, protein:4, carb:26, fat:1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'com_trang_them_1_chen_nho', name:'Cơm trắng thêm 1 chén nhỏ', kcal:130, protein:2.5, carb:28, fat:0.3, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'kimchi_han', name:'Kimchi Hàn', kcal:15, protein:1, carb:3, fat:0, fiber:0, sugar:0, qty:1, unit:'50g', processed:0},
  {id:'rong_bien_kho', name:'Rong biển Khô', kcal:25, protein:1, carb:1, fat:2, fiber:0, sugar:0, qty:1, unit:'gói nhỏ', processed:0},
  {id:'bap_my_hat', name:'Bắp Mỹ Hạt', kcal:48, protein:2, carb:11, fat:1, fiber:0, sugar:0, qty:1, unit:'50g', processed:0},
  {id:'nam_them_lau_nuong', name:'Nấm thêm Lẩu/nướng', kcal:18, protein:2, carb:3, fat:0, fiber:0, sugar:0, qty:1, unit:'50g', processed:0},
  {id:'rau_song_them_mixed', name:'Rau sống thêm Mixed', kcal:10, protein:1, carb:2, fat:0, fiber:0, sugar:0, qty:1, unit:'50g', processed:0},
  {id:'dau_phong_rang', name:'Đậu phộng Rang', kcal:115, protein:5, carb:4, fat:10, fiber:0, sugar:0, qty:1, unit:'20g', processed:0},
  {id:'me_rang', name:'Mè rang', kcal:57, protein:2, carb:2, fat:5, fiber:0, sugar:0, qty:1, unit:'10g', processed:0},
  {id:'hanh_la', name:'Hành lá', kcal:3, protein:0.2, carb:0.7, fat:0, fiber:0, sugar:0, qty:1, unit:'10g', processed:0},
  {id:'toi_phi', name:'Tỏi phi', kcal:50, protein:1, carb:4, fat:4, fiber:0, sugar:0, qty:1, unit:'10g', processed:1},
  {id:'bo_dau_phong', name:'Bơ đậu phộng', kcal:95, protein:4, carb:3, fat:8, fiber:0, sugar:0, qty:1, unit:'muỗng canh', processed:0},
  {id:'whipping_cream', name:'Whipping cream', kcal:100, protein:1, carb:2, fat:10, fiber:0, sugar:0, qty:1, unit:'30ml', processed:1},
  {id:'hu_tieu_go_thap_cam', name:'Hủ tiếu gõ Thập cẩm', kcal:420, protein:20, carb:60, fat:10, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'bo_kho_banh_mi', name:'Bò kho Bánh mì', kcal:650, protein:32, carb:60, fat:28, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'banh_mi_chao_day_du', name:'Bánh mì chảo Đầy đủ', kcal:700, protein:30, carb:50, fat:40, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'banh_uot_long_ga', name:'Bánh ướt Lòng gà', kcal:450, protein:25, carb:50, fat:15, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'banh_hoi_heo_quay', name:'Bánh hỏi Heo quay', kcal:620, protein:28, carb:60, fat:28, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'banh_can_trung_cut', name:'Bánh căn Trứng/cút', kcal:380, protein:16, carb:50, fat:12, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'bun_ca_chau_doc', name:'Bún cá Châu Đốc', kcal:480, protein:28, carb:58, fat:14, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'bun_ca_ro_dong_chuan', name:'Bún cá rô đồng Chuẩn', kcal:450, protein:26, carb:55, fat:10, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'nui_xao_bo', name:'Nui xào Bò', kcal:620, protein:28, carb:75, fat:22, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'mi_hoanh_thanh_xa_xiu', name:'Mì hoành thánh Xá xíu', kcal:520, protein:25, carb:65, fat:16, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'mi_vit_tiem_chuan', name:'Mì vịt tiềm Chuẩn', kcal:650, protein:32, carb:70, fat:25, fiber:0, sugar:0, qty:1, unit:'tô', processed:1},
  {id:'sup_cua_trung_cut', name:'Súp cua Trứng cút', kcal:180, protein:12, carb:22, fat:5, fiber:0, sugar:0, qty:1, unit:'chén', processed:0},
  {id:'sup_ga_bap', name:'Súp gà Bắp', kcal:160, protein:12, carb:18, fat:4, fiber:0, sugar:0, qty:1, unit:'chén', processed:0},
  {id:'banh_da_cua_hai_phong', name:'Bánh đa cua Hải Phòng', kcal:550, protein:28, carb:65, fat:18, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'banh_da_ca_hai_phong', name:'Bánh đa cá Hải Phòng', kcal:500, protein:30, carb:58, fat:14, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'bun_thang_ha_noi', name:'Bún thang Hà Nội', kcal:430, protein:26, carb:55, fat:10, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'bun_ngan_chuan', name:'Bún ngan Chuẩn', kcal:520, protein:28, carb:55, fat:18, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'mien_ngan_chuan', name:'Miến ngan Chuẩn', kcal:480, protein:28, carb:50, fat:15, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'chao_vit_chuan', name:'Cháo vịt Chuẩn', kcal:420, protein:22, carb:48, fat:14, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'chao_suon_quay', name:'Cháo sườn Quẩy', kcal:350, protein:12, carb:50, fat:10, fiber:0, sugar:0, qty:1, unit:'tô', processed:1},
  {id:'com_suon_trung', name:'Cơm sườn Trứng', kcal:750, protein:38, carb:82, fat:28, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'com_thit_kho', name:'Cơm Thịt kho', kcal:680, protein:28, carb:78, fat:24, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'com_ca_kho', name:'Cơm Cá kho', kcal:550, protein:30, carb:72, fat:15, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:0},
  {id:'com_ga_chien_mam', name:'Cơm Gà chiên mắm', kcal:780, protein:35, carb:75, fat:35, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'com_bo_luc_lac', name:'Cơm Bò lúc lắc', kcal:720, protein:35, carb:70, fat:28, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'com_bo_xao', name:'Cơm Bò xào', kcal:650, protein:32, carb:72, fat:20, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:0},
  {id:'com_chien_ca_man', name:'Cơm chiên Cá mặn', kcal:650, protein:22, carb:80, fat:24, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'com_trung_chien', name:'Cơm Trứng chiên', kcal:450, protein:15, carb:65, fat:12, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:0},
  {id:'com_ca_chien', name:'Cơm Cá chiên', kcal:620, protein:30, carb:70, fat:22, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'com_dui_ga_nuong', name:'Cơm Đùi gà nướng', kcal:680, protein:35, carb:75, fat:22, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:0},
  {id:'com_vit_quay', name:'Cơm Vịt quay', kcal:760, protein:32, carb:72, fat:35, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'com_xa_xiu', name:'Cơm Xá xíu', kcal:720, protein:32, carb:75, fat:28, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'com_heo_quay', name:'Cơm Heo quay', kcal:780, protein:32, carb:70, fat:38, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:1},
  {id:'com_cha_ca', name:'Cơm Chả cá', kcal:600, protein:28, carb:72, fat:18, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:0},
  {id:'com_ga_sot_tieu', name:'Cơm Gà sốt tiêu', kcal:680, protein:34, carb:72, fat:22, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:0},
  {id:'ca_vien_chien_chien', name:'Cá viên chiên Chiên', kcal:250, protein:10, carb:18, fat:15, fiber:0, sugar:0, qty:5, unit:'viên', processed:1},
  {id:'bo_vien_chien_chien', name:'Bò viên chiên Chiên', kcal:280, protein:14, carb:15, fat:18, fiber:0, sugar:0, qty:5, unit:'viên', processed:1},
  {id:'ho_lo_nuong_xuc_xich_mini', name:'Hồ lô nướng Xúc xích mini', kcal:180, protein:6, carb:8, fat:14, fiber:0, sugar:0, qty:1, unit:'cây', processed:1},
  {id:'xien_que_thap_cam', name:'Xiên que Thập cẩm', kcal:120, protein:5, carb:8, fat:8, fiber:0, sugar:0, qty:1, unit:'xiên', processed:1},
  {id:'xuc_xich_chien', name:'Xúc xích Chiên', kcal:180, protein:6, carb:5, fat:15, fiber:0, sugar:0, qty:1, unit:'cây', processed:1},
  {id:'khoai_tay_lac_pho_mai', name:'Khoai tây Lắc phô mai', kcal:420, protein:5, carb:52, fat:22, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'ga_ran_lac_pho_mai', name:'Gà rán Lắc phô mai', kcal:520, protein:28, carb:30, fat:30, fiber:0, sugar:0, qty:2, unit:'miếng', processed:1},
  {id:'pho_mai_que_chien', name:'Phô mai que Chiên', kcal:260, protein:10, carb:15, fat:18, fiber:0, sugar:0, qty:2, unit:'cây', processed:1},
  {id:'banh_gao_chien', name:'Bánh gạo Chiên', kcal:350, protein:6, carb:55, fat:12, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'trung_nuong_mo_hanh', name:'Trứng nướng Mỡ hành', kcal:180, protein:8, carb:8, fat:12, fiber:0, sugar:0, qty:1, unit:'chén', processed:1},
  {id:'banh_mi_nuong_muoi_ot', name:'Bánh mì nướng Muối ớt', kcal:320, protein:8, carb:42, fat:14, fiber:0, sugar:0, qty:1, unit:'ổ', processed:1},
  {id:'banh_trang_sa_te', name:'Bánh tráng Sa tế', kcal:280, protein:8, carb:42, fat:10, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'banh_trang_me', name:'Bánh tráng Me', kcal:260, protein:6, carb:45, fat:8, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'ba_chi_heo_nuong', name:'Ba chỉ heo Nướng', kcal:380, protein:16, carb:2, fat:34, fiber:0, sugar:0, qty:1, unit:'100g', processed:1},
  {id:'suon_heo_nuong', name:'Sườn heo Nướng', kcal:320, protein:22, carb:5, fat:24, fiber:0, sugar:0, qty:1, unit:'100g', processed:1},
  {id:'bach_tuoc_nuong_sa_te', name:'Bạch tuộc Nướng sa tế', kcal:160, protein:25, carb:3, fat:5, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'hau_nuong_mo_hanh', name:'Hàu Nướng mỡ hành', kcal:180, protein:12, carb:6, fat:12, fiber:0, sugar:0, qty:3, unit:'con', processed:0},
  {id:'hau_pho_mai', name:'Hàu Phô mai', kcal:260, protein:14, carb:6, fat:20, fiber:0, sugar:0, qty:3, unit:'con', processed:1},
  {id:'ech_nuong', name:'Ếch Nướng', kcal:140, protein:20, carb:2, fat:5, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'long_heo_nuong', name:'Lòng heo Nướng', kcal:260, protein:15, carb:2, fat:20, fiber:0, sugar:0, qty:1, unit:'100g', processed:1},
  {id:'be_thui_cuon_banh_trang', name:'Bê thui Cuốn bánh tráng', kcal:450, protein:35, carb:28, fat:18, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'de_nuong', name:'Dê Nướng', kcal:190, protein:25, carb:2, fat:9, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'bo_la_lot_nuong', name:'Bò lá lốt Nướng', kcal:320, protein:22, carb:8, fat:22, fiber:0, sugar:0, qty:5, unit:'cuốn', processed:0},
  {id:'chan_ga_nuong', name:'Chân gà Nướng', kcal:280, protein:20, carb:8, fat:18, fiber:0, sugar:0, qty:2, unit:'cái', processed:1},
  {id:'gan_bo_nuong', name:'Gân bò Nướng', kcal:170, protein:28, carb:2, fat:5, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'coc_chua', name:'Cóc Chua', kcal:44, protein:1, carb:11, fat:0.3, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'man_ha_noi', name:'Mận Hà Nội', kcal:46, protein:0.7, carb:11, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'sapoche_chin', name:'Sapoche Chín', kcal:83, protein:0.4, carb:20, fat:1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'na_mang_cau_ta', name:'Na Mãng cầu ta', kcal:94, protein:2, carb:23, fat:0.5, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'mang_cau_xiem_chin', name:'Mãng cầu xiêm Chín', kcal:66, protein:1, carb:17, fat:0.3, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'dua_non_com_dua', name:'Dừa non Cơm dừa', kcal:140, protein:1.5, carb:6, fat:13, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'kiwi_xanh', name:'Kiwi Xanh', kcal:61, protein:1.1, carb:15, fat:0.5, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'viet_quat_tuoi', name:'Việt quất Tươi', kcal:57, protein:0.7, carb:14, fat:0.3, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'cherry_tuoi', name:'Cherry Tươi', kcal:63, protein:1, carb:16, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'le_chau_a', name:'Lê Châu Á', kcal:42, protein:0.5, carb:11, fat:0.1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'coca_cola_zero', name:'Coca-Cola Zero', kcal:0, protein:0, carb:0, fat:0, fiber:0, sugar:0, qty:1, unit:'Lon 330ml', processed:0},
  {id:'pepsi_black', name:'Pepsi Black', kcal:0, protein:0, carb:0, fat:0, fiber:0, sugar:0, qty:1, unit:'Lon 330ml', processed:0},
  {id:'sprite_chuan', name:'Sprite Chuẩn', kcal:140, protein:0, carb:35, fat:0, fiber:0, sugar:0, qty:1, unit:'Lon 330ml', processed:1},
  {id:'fanta_cam', name:'Fanta Cam', kcal:150, protein:0, carb:38, fat:0, fiber:0, sugar:0, qty:1, unit:'Lon 330ml', processed:1},
  {id:'mirinda_cam', name:'Mirinda Cam', kcal:155, protein:0, carb:39, fat:0, fiber:0, sugar:0, qty:1, unit:'Lon 330ml', processed:1},
  {id:'c2_tra_xanh', name:'C2 Trà xanh', kcal:90, protein:0, carb:22, fat:0, fiber:0, sugar:0, qty:1, unit:'Chai 360ml', processed:1},
  {id:'khong_do_tra_xanh', name:'Không Độ Trà xanh', kcal:85, protein:0, carb:21, fat:0, fiber:0, sugar:0, qty:1, unit:'Chai 455ml', processed:1},
  {id:'oolong_tea_khong_duong', name:'Oolong Tea+ Không đường', kcal:0, protein:0, carb:0, fat:0, fiber:0, sugar:0, qty:1, unit:'Chai 455ml', processed:0},
  {id:'sting_gold', name:'Sting Gold', kcal:170, protein:0, carb:42, fat:0, fiber:0, sugar:0, qty:1, unit:'Lon 330ml', processed:1},
  {id:'warrior_energy_drink', name:'Warrior Energy Drink', kcal:160, protein:0, carb:40, fat:0, fiber:0, sugar:0, qty:1, unit:'Lon 330ml', processed:1},
  {id:'number_1_energy_drink', name:'Number 1 Energy Drink', kcal:150, protein:0, carb:37, fat:0, fiber:0, sugar:0, qty:1, unit:'Chai 330ml', processed:1},
  {id:'milo_hop', name:'Milo Hộp', kcal:140, protein:4, carb:22, fat:4, fiber:0, sugar:0, qty:1, unit:'180ml', processed:0},
  {id:'ensure_original', name:'Ensure Original', kcal:230, protein:9, carb:34, fat:6, fiber:0, sugar:0, qty:1, unit:'220ml', processed:0},
  {id:'mi_goi_hao_hao_tom_chua_cay', name:'Mì gói Hảo Hảo tôm chua cay', kcal:350, protein:7, carb:49, fat:14, fiber:0, sugar:0, qty:1, unit:'gói', processed:1},
  {id:'mi_goi_omachi_bo_ham', name:'Mì gói Omachi bò hầm', kcal:380, protein:8, carb:52, fat:16, fiber:0, sugar:0, qty:1, unit:'gói', processed:1},
  {id:'mi_goi_indomie_mi_goreng', name:'Mì gói Indomie Mi Goreng', kcal:390, protein:8, carb:52, fat:17, fiber:0, sugar:0, qty:1, unit:'gói', processed:1},
  {id:'banh_oreo', name:'Bánh Oreo', kcal:160, protein:2, carb:25, fat:7, fiber:0, sugar:0, qty:3, unit:'cái', processed:1},
  {id:'banh_chocopie', name:'Bánh Chocopie', kcal:170, protein:2, carb:28, fat:6, fiber:0, sugar:0, qty:1, unit:'cái', processed:1},
  {id:'chocolate_snickers', name:'Chocolate Snickers', kcal:250, protein:4, carb:33, fat:12, fiber:0, sugar:0, qty:1, unit:'thanh', processed:1},
  {id:'banh_mi_cha_ca_da_nang', name:'Bánh mì chả cá Đà Nẵng', kcal:420, protein:20, carb:48, fat:14, fiber:0, sugar:0, qty:1, unit:'ổ', processed:0},
  {id:'bun_nem_nuong_nha_trang', name:'Bún nem nướng Nha Trang', kcal:580, protein:28, carb:68, fat:18, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'com_ga_xe_tam_ky', name:'Cơm gà xé Tam Kỳ', kcal:580, protein:32, carb:75, fat:14, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:0},
  {id:'bun_cua_mien_tay', name:'Bún cua Miền Tây', kcal:500, protein:24, carb:62, fat:14, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'mi_quang_ech_quang_nam', name:'Mì quảng ếch Quảng Nam', kcal:620, protein:32, carb:60, fat:22, fiber:0, sugar:0, qty:1, unit:'tô', processed:1},
  {id:'bun_nuoc_leo_soc_trang', name:'Bún nước lèo Sóc Trăng', kcal:520, protein:26, carb:68, fat:14, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'bun_sua_nha_trang', name:'Bún sứa Nha Trang', kcal:430, protein:28, carb:55, fat:8, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'bun_ken_phu_quoc', name:'Bún kèn Phú Quốc', kcal:500, protein:24, carb:60, fat:16, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'hu_tieu_sa_te_bo', name:'Hủ tiếu sa tế Bò', kcal:620, protein:30, carb:65, fat:22, fiber:0, sugar:0, qty:1, unit:'tô', processed:1},
  {id:'pha_lau_banh_mi', name:'Phá lấu Bánh mì', kcal:550, protein:22, carb:40, fat:30, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'banh_mi_pha_lau_sai_gon', name:'Bánh mì phá lấu Sài Gòn', kcal:520, protein:20, carb:52, fat:24, fiber:0, sugar:0, qty:1, unit:'ổ', processed:1},
  {id:'banh_mi_que_hai_phong', name:'Bánh mì que Hải Phòng', kcal:220, protein:8, carb:30, fat:8, fiber:0, sugar:0, qty:1, unit:'ổ', processed:0},
  {id:'com_nieu_ca_kho', name:'Cơm niêu Cá kho', kcal:650, protein:30, carb:82, fat:18, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'com_chay_kho_quet', name:'Cơm cháy Kho quẹt', kcal:580, protein:14, carb:72, fat:24, fiber:0, sugar:0, qty:1, unit:'phần', processed:1},
  {id:'lau_bo_nhung_giam', name:'Lẩu bò Nhúng giấm', kcal:580, protein:38, carb:40, fat:18, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'lau_de_chuan', name:'Lẩu dê Chuẩn', kcal:620, protein:40, carb:38, fat:24, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'banh_dap_quang_nam', name:'Bánh đập Quảng Nam', kcal:350, protein:10, carb:58, fat:8, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'banh_uot_thit_nuong', name:'Bánh ướt Thịt nướng', kcal:520, protein:26, carb:60, fat:16, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'bun_thai_hai_san', name:'Bún thái Hải sản', kcal:480, protein:26, carb:62, fat:10, fiber:0, sugar:0, qty:1, unit:'tô', processed:0},
  {id:'mi_cay_hai_san', name:'Mì cay Hải sản', kcal:600, protein:30, carb:72, fat:20, fiber:0, sugar:0, qty:1, unit:'tô', processed:1},
  {id:'com_am_phu_hue', name:'Cơm âm phủ Huế', kcal:620, protein:28, carb:78, fat:18, fiber:0, sugar:0, qty:1, unit:'dĩa', processed:0},
  {id:'banh_mi_ga_xe', name:'Bánh mì Gà xé', kcal:430, protein:24, carb:50, fat:12, fiber:0, sugar:0, qty:1, unit:'ổ', processed:0},
  {id:'bun_thit_nuong_cha_gio', name:'Bún thịt nướng Chả giò', kcal:650, protein:30, carb:70, fat:22, fiber:0, sugar:0, qty:1, unit:'tô', processed:1},
  {id:'goi_ga_bap_cai', name:'Gỏi gà Bắp cải', kcal:280, protein:28, carb:12, fat:8, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'goi_ngo_sen_tom_thit', name:'Gỏi ngó sen Tôm thịt', kcal:260, protein:18, carb:18, fat:8, fiber:0, sugar:0, qty:1, unit:'phần', processed:0},
  {id:'bia_larue_tiger_lon_tieu_chu', name:'Bia Larue / Tiger Lon tiêu chuẩn', kcal:140, protein:1.1, carb:11, fat:0, fiber:0, sugar:0, qty:1, unit:'330ml', processed:1},
  {id:'bia_craft_ipa_ly_tieu_chuan', name:'Bia Craft (IPA) Ly tiêu chuẩn', kcal:200, protein:2, carb:18, fat:0, fiber:0, sugar:0, qty:1, unit:'330ml', processed:1},
  {id:'ruou_vang_do_ly_thuy_tinh', name:'Rượu vang đỏ Ly thủy tinh', kcal:125, protein:0.1, carb:3.8, fat:0, fiber:0, sugar:0, qty:1, unit:'150ml', processed:0},
  {id:'ruou_vang_trang_ly_thuy_tinh', name:'Rượu vang trắng Ly thủy tinh', kcal:120, protein:0.1, carb:3, fat:0, fiber:0, sugar:0, qty:1, unit:'150ml', processed:0},
  {id:'ruou_soju_chai_truyen_thong', name:'Rượu Soju Chai truyền thống', kcal:400, protein:0, carb:8, fat:0, fiber:0, sugar:0, qty:1, unit:'360ml', processed:1},
  {id:'ruou_whisky_vodka_shot_don', name:'Rượu Whisky / Vodka Shot đơn', kcal:100, protein:0, carb:0, fat:0, fiber:0, sugar:0, qty:1, unit:'45ml', processed:1},
  {id:'uc_ga_hap_ap_chao_khong_dau', name:'Ức gà Hấp/Áp chảo không dầu', kcal:165, protein:31, carb:0, fat:3.6, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'than_bo_nuong_ap_chao', name:'Thăn bò Nướng/Áp chảo', kcal:250, protein:26, carb:0, fat:15, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'ca_hoi_phi_le_tuoi', name:'Cá hồi Phi lê tươi', kcal:208, protein:20, carb:0, fat:13, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'trung_ga_luoc_chin', name:'Trứng gà Luộc chín', kcal:78, protein:6.3, carb:0.6, fat:5.3, fiber:0, sugar:0, qty:1, unit:'quả', processed:0},
  {id:'dau_hu_tuoi_luoc', name:'Đậu hũ Tươi/Luộc', kcal:76, protein:8, carb:1.9, fat:4.8, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'khoai_lang_luoc_hap', name:'Khoai lang Luộc/Hấp', kcal:86, protein:1.6, carb:20.1, fat:0.1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'gao_lut_com_nau_chin', name:'Gạo lứt Cơm nấu chín', kcal:110, protein:2.6, carb:23, fat:0.9, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'yen_mach_can_vo_nguyen_hat', name:'Yến mạch Cán vỡ/Nguyên hạt', kcal:389, protein:16.9, carb:66.3, fat:6.9, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'hat_hanh_nhan_say_kho_nguyen', name:'Hạt hạnh nhân Sấy khô nguyên vị', kcal:579, protein:21, carb:22, fat:50, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'sua_chua_hy_lap_khong_duong', name:'Sữa chua Hy Lạp Không đường', kcal:59, protein:10, carb:3.6, fat:0.4, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'bong_cai_xanh_sup_lo_luoc_ha', name:'Bông cải xanh (Súp lơ) Luộc/Hấp', kcal:34, protein:2.8, carb:7, fat:0.4, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'cai_bo_xoi_rau_chan_vit_tuoi', name:'Cải bó xôi (Rau chân vịt) Tươi sống', kcal:23, protein:2.9, carb:3.6, fat:0.4, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'xa_lach_tuoi_song', name:'Xà lách Tươi sống', kcal:15, protein:1.4, carb:2.9, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'ca_rot_luoc_hap', name:'Cà rốt Luộc/Hấp', kcal:41, protein:0.9, carb:9.6, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'ca_chua_tuoi_chin_do', name:'Cà chua Tươi chín đỏ', kcal:18, protein:0.9, carb:3.9, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'dua_leo_dua_chuot_tuoi_song_', name:'Dưa leo (Dưa chuột) Tươi sống nguyên vỏ', kcal:15, protein:0.7, carb:3.6, fat:0.1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'bi_ngoi_luoc_hap', name:'Bí ngòi Luộc/Hấp', kcal:17, protein:1.2, carb:3.1, fat:0.3, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'mang_tay_nuong_ap_chao_nhe', name:'Măng tây Nướng áp chảo nhẹ', kcal:20, protein:2.2, carb:3.9, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'nam_dui_ga_luoc_xao_moc', name:'Nấm đùi gà Luộc/Xào mộc', kcal:35, protein:3.1, carb:5.5, fat:0.3, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'bo_tuoi_nguyen_chat', name:'Bơ Tươi nguyên chất', kcal:160, protein:2, carb:8.5, fat:15, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'chuoi_gia_trai_chin', name:'Chuối già Trái chín', kcal:89, protein:1.1, carb:22.8, fat:0.3, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'tao_tay_nguyen_vo', name:'Táo tây Nguyên vỏ', kcal:52, protein:0.3, carb:13.8, fat:0.2, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'buoi_da_xanh_mui_tuoi', name:'Bưởi da xanh Múi tươi', kcal:38, protein:0.8, carb:9.6, fat:0, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'oi_bo_hat_an_ca_vo', name:'Ổi Bỏ hạt/Ăn cả vỏ', kcal:68, protein:2.6, carb:14.3, fat:1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'dau_tay_qua_tuoi_chin', name:'Dâu tây Quả tươi chín', kcal:32, protein:0.7, carb:7.7, fat:0.3, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'viet_quat_qua_tuoi', name:'Việt quất Quả tươi', kcal:57, protein:0.7, carb:14.5, fat:0.3, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'cam_mui_tuoi', name:'Cam Múi tươi', kcal:47, protein:0.9, carb:11.8, fat:0.1, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'xoai_chin_ma_xoai_tuoi', name:'Xoài chín Má xoài tươi', kcal:60, protein:0.8, carb:15, fat:0.4, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'sau_rieng_com_thit_tuoi', name:'Sầu riêng Cơm thịt tươi', kcal:147, protein:1.5, carb:27.1, fat:5.3, fiber:0, sugar:0, qty:1, unit:'100g', processed:0},
  {id:'tiec_cuoi_nhe', name:'Tiệc cưới Nhẹ', kcal:1400, protein:70, carb:105, fat:70, fiber:0, sugar:0, qty:1, unit:'lần', processed:0},
  {id:'tiec_cuoi_binh_thuong', name:'Tiệc cưới Bình thường', kcal:2000, protein:100, carb:150, fat:100, fiber:0, sugar:0, qty:1, unit:'lần', processed:1},
  {id:'tiec_cuoi_nhieu', name:'Tiệc cưới Nhiều', kcal:2600, protein:130, carb:195, fat:130, fiber:0, sugar:0, qty:1, unit:'lần', processed:1},
  {id:'tiec_cuoi_rat_nhieu', name:'Tiệc cưới Rất nhiều', kcal:3400, protein:170, carb:255, fat:170, fiber:0, sugar:0, qty:1, unit:'lần', processed:1},
  {id:'tiec_cong_ty_binh_thuong', name:'Tiệc công ty Bình thường', kcal:2200, protein:110, carb:170, fat:110, fiber:0, sugar:0, qty:1, unit:'lần', processed:1},
  {id:'buffet_trua_binh_thuong', name:'Buffet trưa Bình thường', kcal:1200, protein:60, carb:110, fat:55, fiber:0, sugar:0, qty:1, unit:'lần', processed:0},
  {id:'buffet_toi_binh_thuong', name:'Buffet tối Bình thường', kcal:1800, protein:90, carb:150, fat:90, fiber:0, sugar:0, qty:1, unit:'lần', processed:1},
  {id:'bbq_nuong_binh_thuong', name:'BBQ/Nướng Bình thường', kcal:2000, protein:130, carb:80, fat:120, fiber:0, sugar:0, qty:1, unit:'lần', processed:1},
  {id:'lau_binh_thuong', name:'Lẩu Bình thường', kcal:1500, protein:90, carb:100, fat:70, fiber:0, sugar:0, qty:1, unit:'lần', processed:0},
  {id:'sinh_nhat_nha_hang_binh_thuo', name:'Sinh nhật nhà hàng Bình thường', kcal:1500, protein:70, carb:130, fat:70, fiber:0, sugar:0, qty:1, unit:'lần', processed:0},
  {id:'nhau_bia_nhe_binh_thuong', name:'Nhậu bia nhẹ Bình thường', kcal:1800, protein:90, carb:130, fat:90, fiber:0, sugar:0, qty:1, unit:'lần', processed:1},
  {id:'nhau_bia_nhieu_binh_thuong', name:'Nhậu bia nhiều Bình thường', kcal:3000, protein:150, carb:220, fat:150, fiber:0, sugar:0, qty:1, unit:'lần', processed:1},
  {id:'tra_sua_an_vat_binh_thuong', name:'Trà sữa + ăn vặt Bình thường', kcal:800, protein:15, carb:110, fat:30, fiber:0, sugar:0, qty:1, unit:'lần', processed:1},
  {id:'xem_phim_bap_nuoc_binh_thuon', name:'Xem phim + bắp nước Bình thường', kcal:1000, protein:12, carb:150, fat:35, fiber:0, sugar:0, qty:1, unit:'lần', processed:1},
  {id:'tiec_tat_nien_binh_thuong', name:'Tiệc tất niên Bình thường', kcal:2500, protein:120, carb:180, fat:130, fiber:0, sugar:0, qty:1, unit:'lần', processed:1},
  {id:'du_lich_1_ngay', name:'Du lịch 1 ngày', kcal:2500, protein:100, carb:250, fat:100, fiber:0, sugar:0, qty:1, unit:'ngày', processed:0},
  {id:'tet_nguyen_dan_1_ngay', name:'Tết Nguyên Đán 1 ngày', kcal:3000, protein:120, carb:300, fat:130, fiber:0, sugar:0, qty:1, unit:'ngày', processed:1}
];

// ═══════════════════════════════════════════════════════════
// ACTIVITY DATABASE (213 hoạt động — calo_F.A.xlsx)
// ═══════════════════════════════════════════════════════════
var ACT_DB = [
  {id:'act_001', name:'Ngủ', met:0.95, icon:'⭐'},
  {id:'act_002', name:'Ngồi thiền hoặc tập thở sâu', met:1, icon:'·'},
  {id:'act_003', name:'Nằm nghỉ ngơi, xem TV', met:1.3, icon:'⭐'},
  {id:'act_004', name:'Ngồi đọc sách, báo', met:1.3, icon:'·'},
  {id:'act_005', name:'Ngồi viết nhật ký, ghi chép', met:1.3, icon:'·'},
  {id:'act_006', name:'Đứng xếp hàng chờ đợi', met:1.3, icon:'·'},
  {id:'act_007', name:'Ăn uống (ngồi tại bàn)', met:1.5, icon:'⭐'},
  {id:'act_008', name:'Ngồi chơi boardgame, đánh bài', met:1.5, icon:'·'},
  {id:'act_009', name:'Đứng nói chuyện, thảo luận', met:1.8, icon:'·'},
  {id:'act_010', name:'Sấy tóc, tạo kiểu tóc', met:1.8, icon:'·'},
  {id:'act_011', name:'Tắm rửa, vệ sinh cá nhân', met:2, icon:'⭐'},
  {id:'act_012', name:'Chơi đàn guitar, piano (ngồi)', met:2, icon:'·'},
  {id:'act_013', name:'Mặc quần áo, sửa soạn', met:2.5, icon:'·'},
  {id:'act_014', name:'Hát karaoke (đứng)', met:2.5, icon:'·'},
  {id:'act_015', name:'Chơi trống (ngồi chơi nhạc cụ sôi động)', met:3.8, icon:'·'},
  {id:'act_016', name:'Ngồi làm việc máy tính / Lập trình', met:1.5, icon:'⭐'},
  {id:'act_017', name:'Ngồi họp trực tiếp, thảo luận', met:1.5, icon:'⭐'},
  {id:'act_018', name:'Ngồi họp online qua Zoom, Teams', met:1.5, icon:'⭐'},
  {id:'act_019', name:'Ngồi vẽ máy tính, thiết kế đồ họa bằng wacom', met:1.5, icon:'·'},
  {id:'act_020', name:'Đứng làm việc tại bàn nâng hạ', met:1.8, icon:'·'},
  {id:'act_021', name:'Gửi nhận tài liệu, in ấn, photo văn bản', met:1.8, icon:'·'},
  {id:'act_022', name:'Đi lại nhẹ nhàng đổi phòng họp / Thư giãn Pomodoro', met:2, icon:'⭐'},
  {id:'act_023', name:'Pha cafe, trà thủ công tại góc làm việc', met:2, icon:'⭐'},
  {id:'act_024', name:'Dọn dẹp, setup bàn làm việc cá nhân', met:2, icon:'⭐'},
  {id:'act_025', name:'Sắp xếp hồ sơ, lưu trữ tủ tài liệu', met:2.3, icon:'·'},
  {id:'act_026', name:'Đứng thuyết trình, tổ chức workshop', met:2.5, icon:'·'},
  {id:'act_027', name:'Vừa đi bộ vừa nghe điện thoại trao đổi công việc', met:2.5, icon:'·'},
  {id:'act_028', name:'Ủi (là) quần áo phẳng', met:1.8, icon:'·'},
  {id:'act_029', name:'Phơi quần áo, treo đồ lên móc', met:2, icon:'⭐'},
  {id:'act_030', name:'Gấp quần áo, xếp vào tủ', met:2, icon:'⭐'},
  {id:'act_031', name:'Đổ rác, mang túi rác ra xe gom', met:2, icon:'⭐'},
  {id:'act_032', name:'Phủi bụi bàn ghế, kệ sách, tivi', met:2, icon:'⭐'},
  {id:'act_033', name:'Lau dọn bếp từ, bàn ăn sau khi ăn', met:2.3, icon:'⭐'},
  {id:'act_034', name:'Hút bụi toàn bộ căn nhà bằng máy', met:2.5, icon:'⭐'},
  {id:'act_035', name:'Rửa chén bát, dọn dẹp bồn rửa bếp', met:2.5, icon:'⭐'},
  {id:'act_036', name:'Nấu ăn, sơ chế cắt thái thực phẩm', met:2.5, icon:'⭐'},
  {id:'act_037', name:'Tưới cây, tỉa cành ban công, sân vườn', met:2.5, icon:'·'},
  {id:'act_038', name:'Quét nhà, dọn rác sàn', met:3, icon:'⭐'},
  {id:'act_039', name:'Rửa xe máy tại nhà', met:3, icon:'⭐'},
  {id:'act_040', name:'Lau cửa kính, cửa sổ ban công', met:3.2, icon:'·'},
  {id:'act_041', name:'Lau nhà bằng cây lau thông thường', met:3.5, icon:'⭐'},
  {id:'act_042', name:'Cọ rửa nhà vệ sinh, sàn phòng tắm', met:3.5, icon:'⭐'},
  {id:'act_043', name:'Sắp xếp lại đồ đạc, decor nhẹ phòng', met:3.5, icon:'·'},
  {id:'act_044', name:'Rửa xe ô tô tại nhà', met:3.5, icon:'·'},
  {id:'act_045', name:'Giặt quần áo bằng tay (chà, vắt)', met:4, icon:'·'},
  {id:'act_046', name:'Làm vườn chuyên sâu, cuốc đất, nhổ cỏ', met:4.5, icon:'·'},
  {id:'act_047', name:'Di chuyển nội thất nặng, bê vác tủ giường', met:7, icon:'·'},
  {id:'act_048', name:'Cho em bé ăn, đút bột (ngồi)', met:1.5, icon:'⭐'},
  {id:'act_049', name:'Đọc truyện tranh, sách cho con nghe', met:1.5, icon:'·'},
  {id:'act_050', name:'Tắm rửa và lau người cho em bé', met:2, icon:'⭐'},
  {id:'act_051', name:'Chơi đùa với trẻ em (ngồi xếp hình, vẽ tranh)', met:2, icon:'⭐'},
  {id:'act_052', name:'Thu gom đồ chơi của con sau khi chơi', met:2.2, icon:'⭐'},
  {id:'act_053', name:'Bế em bé, đi lại vỗ về nhẹ nhàng', met:2.5, icon:'⭐'},
  {id:'act_054', name:'Dắt xe đẩy nôi em bé đi dạo', met:2.5, icon:'⭐'},
  {id:'act_055', name:'Đi bộ dắt tay trẻ em đi dạo công viên', met:3, icon:'⭐'},
  {id:'act_056', name:'Đeo đai địu con đi lại, di chuyển', met:3.2, icon:'·'},
  {id:'act_057', name:'Chơi đùa với trẻ em tích cực (chạy nhảy, trốn tìm)', met:5, icon:'⭐'},
  {id:'act_058', name:'Đứng xếp hàng thanh toán tại quầy thu ngân', met:1.3, icon:'⭐'},
  {id:'act_059', name:'Thử đồ, thay đổi trang phục khi mua sắm', met:2, icon:'·'},
  {id:'act_060', name:'Đi siêu thị đẩy xe hàng tốc độ chậm', met:2.3, icon:'⭐'},
  {id:'act_061', name:'Đi mua sắm quần áo tại TTTM (đi bộ nhiều)', met:2.5, icon:'⭐'},
  {id:'act_062', name:'Đi chợ truyền thống, xách giỏ đồ nhẹ', met:3, icon:'⭐'},
  {id:'act_063', name:'Bốc xếp hàng hóa mua sắm lên cốp xe ô tô', met:3, icon:'·'},
  {id:'act_064', name:'Đẩy xe hàng nặng trong siêu thị lớn', met:3.5, icon:'·'},
  {id:'act_065', name:'Xách túi đồ mua sắm nặng (>5kg) đi bộ', met:4, icon:'·'},
  {id:'act_066', name:'Ngồi trên xe bus, xe khách, máy bay di chuyển', met:1.3, icon:'⭐'},
  {id:'act_067', name:'Đứng bám tay vịn trên xe bus, tàu điện ngầm', met:1.8, icon:'·'},
  {id:'act_068', name:'Lái xe máy di chuyển trong thành phố', met:2, icon:'⭐'},
  {id:'act_069', name:'Lái xe ô tô con cá nhân', met:2.5, icon:'⭐'},
  {id:'act_070', name:'Đi bộ tốc độ chậm thả lỏng (< 3 km/h)', met:2.5, icon:'⭐'},
  {id:'act_071', name:'Đi bộ ra trạm xe bus, ga tàu điện', met:3, icon:'·'},
  {id:'act_072', name:'Đi bộ tốc độ trung bình (3 - 4.5 km/h)', met:3.3, icon:'⭐'},
  {id:'act_073', name:'Đi xuống cầu thang bộ', met:3.5, icon:'·'},
  {id:'act_074', name:'Đi bộ tốc độ nhanh, vội vã (4.8 - 5.5 km/h)', met:3.8, icon:'⭐'},
  {id:'act_075', name:'Đi bộ mang balo nặng (>5kg)', met:4.5, icon:'·'},
  {id:'act_076', name:'Leo cầu thang bộ liên tục', met:8, icon:'⭐'},
  {id:'act_077', name:'Khởi động nhẹ nhàng, xoay khớp, giãn cơ', met:2.5, icon:'⭐'},
  {id:'act_078', name:'Tập các bài cốt lõi Core, bụng (Plank, Crunch)', met:2.8, icon:'⭐'},
  {id:'act_079', name:'Tập với dây kháng lực cao su (Resistance bands)', met:3, icon:'·'},
  {id:'act_080', name:'Tập tạ cô lập cơ, tạ nhẹ (Isolation/Light weights)', met:3.5, icon:'⭐'},
  {id:'act_081', name:'Tập với máy kháng lực tập trung (Machine Press)', met:3.5, icon:'⭐'},
  {id:'act_082', name:'Bắn cung thể thao', met:3.5, icon:'·'},
  {id:'act_083', name:'Tập Calisthenics cơ bản (Pushup, Pullup, Dips vừa)', met:4.5, icon:'⭐'},
  {id:'act_084', name:'Chạy phục hồi nhẹ nhàng sau race - Pace 10:00', met:4.5, icon:'·'},
  {id:'act_085', name:'Tập Thể hình phân nhóm cơ (Bodybuilding vừa)', met:5, icon:'⭐'},
  {id:'act_086', name:'Tập Cardio trên máy Elliptical tốc độ vừa', met:5, icon:'⭐'},
  {id:'act_087', name:'Trượt ván đường phố (Skateboarding)', met:5, icon:'·'},
  {id:'act_088', name:'Đấm bao cát liên tục (Heavy bag training)', met:5.5, icon:'⭐'},
  {id:'act_089', name:'Chạy thả lỏng dưỡng sinh (Jogging) - Pace 8-9', met:6, icon:'⭐'},
  {id:'act_090', name:'Chạy bộ trên máy (Treadmill) - Tốc độ 6 km/h', met:6, icon:'⭐'},
  {id:'act_091', name:'Tập tạ nặng bài phức hợp (Squat/Deadlift/Bench)', met:6, icon:'⭐'},
  {id:'act_092', name:'Thể dục nhịp điệu (Aerobics) cường độ trung bình', met:6, icon:'⭐'},
  {id:'act_093', name:'Tập với máy chèo thuyền (Rowing machine) vừa', met:6, icon:'·'},
  {id:'act_094', name:'Chèo thuyền SUP tốc độ cao, tập cardio', met:6, icon:'·'},
  {id:'act_095', name:'Trượt patin, giày trượt có bánh (Rollerblading)', met:7, icon:'·'},
  {id:'act_096', name:'Tập Calisthenics nâng cao (Muscle up, Planche)', met:7.5, icon:'·'},
  {id:'act_097', name:'Chạy bộ trên máy (Treadmill) - Tốc độ 8 km/h', met:8, icon:'⭐'},
  {id:'act_098', name:'Tập HIIT, Circuit Training cường độ cao liên tục', met:8, icon:'⭐'},
  {id:'act_099', name:'Tập Kettlebell Swing (quai tạ ấm) liên tục', met:8, icon:'·'},
  {id:'act_100', name:'Leo núi nhân tạo trong nhà (Rock climbing)', met:8, icon:'·'},
  {id:'act_101', name:'Chạy bộ ngoài trời tốc độ chậm - Pace 7:00', met:8.3, icon:'⭐'},
  {id:'act_102', name:'Tập với máy chèo thuyền cường độ cao', met:8.5, icon:'·'},
  {id:'act_103', name:'Nhảy dây tốc độ chậm (<100 cái/phút)', met:8.8, icon:'⭐'},
  {id:'act_104', name:'Tập Cardio trên máy Stairmaster tốc độ vừa', met:9, icon:'⭐'},
  {id:'act_105', name:'Chạy bộ ngoài trời tốc độ trung bình - Pace 6:00', met:9.8, icon:'⭐'},
  {id:'act_106', name:'Chạy bộ trên máy (Treadmill) - Tốc độ 10 km/h', met:10, icon:'⭐'},
  {id:'act_107', name:'Chạy địa hình băng rừng lội suối (Trail running)', met:10, icon:'·'},
  {id:'act_108', name:'Tập Battle Ropes (quật dây thừng thể hình)', met:10, icon:'·'},
  {id:'act_109', name:'Tập Tabata chu kỳ cực ngắn cường độ cao', met:11, icon:'·'},
  {id:'act_110', name:'Tập Cardio trên máy Stairmaster tốc độ cao', met:11, icon:'·'},
  {id:'act_111', name:'Chạy biến tốc ngắn (Interval training)', met:11.5, icon:'·'},
  {id:'act_112', name:'Nhảy dây tốc độ trung bình (100-120 cái/phút)', met:11.8, icon:'⭐'},
  {id:'act_113', name:'Chạy bộ ngoài trời tốc độ nhanh - Pace 5:00', met:11.8, icon:'⭐'},
  {id:'act_114', name:'Tập Crossfit cường độ thi đấu', met:12, icon:'⭐'},
  {id:'act_115', name:'Nhảy dây tốc độ nhanh (>120 cái/phút)', met:12.3, icon:'·'},
  {id:'act_116', name:'Chạy bộ ngoài trời tốc độ rất nhanh - Pace 4:30', met:12.8, icon:'·'},
  {id:'act_117', name:'Chạy cự ly dài bán marathon/marathon', met:13.3, icon:'·'},
  {id:'act_118', name:'Chạy nước rút cự ly ngắn (Sprinting liên tục)', met:14.5, icon:'·'},
  {id:'act_119', name:'Chạy leo dốc liên tục, chạy leo đồi', met:15, icon:'·'},
  {id:'act_120', name:'Thiền định tĩnh tâm kết hợp kiểm soát hơi thở', met:1.3, icon:'·'},
  {id:'act_121', name:'Yin Yoga giữ tư thế lâu sâu', met:2, icon:'·'},
  {id:'act_122', name:'Hatha Yoga, Yoga phục hồi thư giãn chậm', met:2.5, icon:'⭐'},
  {id:'act_123', name:'Pilates trên thảm cơ bản (Mat Pilates)', met:3, icon:'⭐'},
  {id:'act_124', name:'Pilates sử dụng máy chuyên dụng (Reformer)', met:3.5, icon:'⭐'},
  {id:'act_125', name:'Yoga dây, Yoga bay (Aerial Yoga)', met:3.5, icon:'·'},
  {id:'act_126', name:'Vinyasa Yoga, Power Yoga chuỗi nhanh', met:4, icon:'⭐'},
  {id:'act_127', name:'Bikram Yoga (Tập Yoga trong phòng nóng)', met:4, icon:'·'},
  {id:'act_128', name:'Pilates tăng cường với tạ nhỏ và vòng', met:4, icon:'·'},
  {id:'act_129', name:'Ashtanga Yoga cường độ cao nâng cao', met:4.5, icon:'·'},
  {id:'act_130', name:'Đạp xe đôi thư giãn công viên', met:3, icon:'·'},
  {id:'act_131', name:'Đạp xe đạp thong thả dạo phố (<15 km/h)', met:3.5, icon:'⭐'},
  {id:'act_132', name:'Đạp xe đi làm, đi học mang balo vừa', met:4, icon:'⭐'},
  {id:'act_133', name:'Đạp xe trong nhà với máy cố định - Mức nhẹ', met:4.8, icon:'⭐'},
  {id:'act_134', name:'Đạp xe đạp tốc độ chậm dưỡng sinh (15-19 km/h)', met:5.8, icon:'⭐'},
  {id:'act_135', name:'Đạp xe BMX nhào lộn nghệ thuật', met:7.5, icon:'·'},
  {id:'act_136', name:'Đạp xe đạp tốc độ trung bình thể thao (19-22 km/h)', met:8, icon:'⭐'},
  {id:'act_137', name:'Đạp xe địa hình đồi núi (Mountain biking)', met:8.5, icon:'·'},
  {id:'act_138', name:'Đạp xe trong nhà lớp Spinning - Cường độ cao', met:8.5, icon:'⭐'},
  {id:'act_139', name:'Đạp xe đạp tốc độ nhanh tính giờ (22-25 km/h)', met:10, icon:'·'},
  {id:'act_140', name:'Đạp xe trong nhà máy cố định - Cường độ cực cao', met:10.5, icon:'·'},
  {id:'act_141', name:'Đạp xe đường trường tốc độ rất nhanh (>25 km/h)', met:12, icon:'·'},
  {id:'act_142', name:'Bơi chó dạo nước vui vẻ, thả nổi', met:2.5, icon:'·'},
  {id:'act_143', name:'Bơi tự do hoặc bơi ếch thả lỏng thư giãn', met:3.5, icon:'⭐'},
  {id:'act_144', name:'Bơi lội thể dục thẩm mỹ dưới nước (Water aerobics)', met:4, icon:'·'},
  {id:'act_145', name:'Bơi ngửa kỹ thuật vừa phải', met:4.8, icon:'·'},
  {id:'act_146', name:'Bơi lặn có ống thở bề mặt (Snorkeling)', met:5, icon:'·'},
  {id:'act_147', name:'Bơi ếch tốc độ trung bình liên tục', met:5.3, icon:'⭐'},
  {id:'act_148', name:'Bơi sải (Trườn sấp) tốc độ trung bình', met:5.8, icon:'⭐'},
  {id:'act_149', name:'Bơi ngửa tốc độ nhanh liên tục', met:7, icon:'·'},
  {id:'act_150', name:'Bơi lặn sâu bình dưỡng khí (Scuba diving)', met:7, icon:'·'},
  {id:'act_151', name:'Bơi sải (Trườn sấp) tốc độ nhanh liên tục', met:9.8, icon:'⭐'},
  {id:'act_152', name:'Bơi ếch tốc độ nhanh thi đấu', met:10.3, icon:'·'},
  {id:'act_153', name:'Bơi bướm kỹ thuật tiêu chuẩn cường độ cao', met:11, icon:'·'},
  {id:'act_154', name:'Tập Thái Cực Quyền (Tai Chi) điều hòa hơi thở', met:2.5, icon:'·'},
  {id:'act_155', name:'Tập các bài quyền đơn độc (Kata/Taolu/Kiếm thuật)', met:4, icon:'·'},
  {id:'act_156', name:'Tập Aikido kỹ thuật tự vệ hóa giải', met:4.5, icon:'·'},
  {id:'act_157', name:'Tập đối luyện kỹ thuật nhẹ nhàng với bạn tập', met:6, icon:'⭐'},
  {id:'act_158', name:'Tập Vovinam / Võ cổ truyền Việt Nam', met:6, icon:'⭐'},
  {id:'act_159', name:'Tập đấu kiếm thể thao chuyên nghiệp (Fencing)', met:6, icon:'·'},
  {id:'act_160', name:'Tập võ Taekwondo / Karate đòn chân đòn tay', met:7, icon:'⭐'},
  {id:'act_161', name:'Tập Judo / Brazilian Jiu-Jitsu (BJJ) vật khóa sàn', met:7, icon:'⭐'},
  {id:'act_162', name:'Thi đấu võ thuật đối kháng (Boxing/Kickboxing)', met:10, icon:'⭐'},
  {id:'act_163', name:'Tập Tán thủ (Sanda) / Muay Thai cường độ cao', met:10.5, icon:'·'},
  {id:'act_164', name:'Bóng bàn (Đánh đôi giải trí nhẹ nhàng)', met:3, icon:'·'},
  {id:'act_165', name:'Bóng đá (Vị trí thủ môn / Tập chuyền sút nhẹ)', met:4, icon:'⭐'},
  {id:'act_166', name:'Bóng chuyền (Trong nhà thi đấu phong trào)', met:4, icon:'⭐'},
  {id:'act_167', name:'Bóng bàn (Ping pong đánh đơn phong trào)', met:4, icon:'⭐'},
  {id:'act_168', name:'Bóng chày (Các vị trí bắt bóng, chạy)', met:4, icon:'·'},
  {id:'act_169', name:'Cầu lông / Pickleball (Đánh đôi giải trí nhẹ)', met:4.5, icon:'⭐'},
  {id:'act_170', name:'Bóng rổ (Tập ném rổ, chơi nửa sân phong trào)', met:4.5, icon:'⭐'},
  {id:'act_171', name:'Tennis (Quần vợt đánh đôi phối hợp)', met:5, icon:'⭐'},
  {id:'act_172', name:'Pickleball (Chơi đơn di chuyển bao sân tích cực)', met:6, icon:'⭐'},
  {id:'act_173', name:'Bóng chày (Vị trí ném bóng Pitcher)', met:6, icon:'·'},
  {id:'act_174', name:'Bóng đá (Trận đấu phong trào sân 5 hoặc sân 7)', met:7, icon:'⭐'},
  {id:'act_175', name:'Cầu lông (Đánh đơn phong trào tích cực)', met:7, icon:'⭐'},
  {id:'act_176', name:'Tennis (Quần vợt đánh đơn di chuyển rộng)', met:7.3, icon:'⭐'},
  {id:'act_177', name:'Bóng rổ (Trận đấu thi đấu chính thức)', met:8, icon:'⭐'},
  {id:'act_178', name:'Bóng chuyền bãi biển di chuyển trên cát', met:8, icon:'·'},
  {id:'act_179', name:'Bóng ném / Bóng bầu dục thi đấu', met:8, icon:'·'},
  {id:'act_180', name:'Futsal (Bóng đá trong nhà cường độ bùng nổ)', met:9, icon:'·'},
  {id:'act_181', name:'Nhân viên bảo vệ tòa nhà (Ngồi trực camera)', met:1.3, icon:'⭐'},
  {id:'act_182', name:'Thợ làm móng, nail (Ngồi thao tác tỉ mỉ)', met:1.5, icon:'⭐'},
  {id:'act_183', name:'Tài xế taxi, xe công nghệ, xe tải (Lái xe liên tục)', met:1.5, icon:'⭐'},
  {id:'act_184', name:'Công nhân dây chuyền (Ngồi lắp ráp cơ bản)', met:1.8, icon:'·'},
  {id:'act_185', name:'Bác sĩ phẫu thuật (Đứng tập trung cao độ)', met:2, icon:'·'},
  {id:'act_186', name:'Thợ cắt tóc, tạo mẫu tóc (Đứng thao tác liên tục)', met:2, icon:'⭐'},
  {id:'act_187', name:'Nhân viên bảo vệ (Đứng gác cổng, điều phối xe)', met:2, icon:'⭐'},
  {id:'act_188', name:'Shipper xe máy (Lên xuống xe, giao hàng nhẹ)', met:2.5, icon:'⭐'},
  {id:'act_189', name:'Công nhân dây chuyền sản xuất (Đứng thao tác)', met:2.5, icon:'⭐'},
  {id:'act_190', name:'Pha chế nước, Barista, Bartender (Đứng thao tác)', met:2.5, icon:'⭐'},
  {id:'act_191', name:'Điều dưỡng, Y tá (Di chuyển hỗ trợ bệnh nhân)', met:3, icon:'⭐'},
  {id:'act_192', name:'Thợ sửa chữa xe máy, ô tô (Cúi người vặn ốc)', met:3, icon:'⭐'},
  {id:'act_193', name:'Phục vụ nhà hàng, quán cafe (Đi lại liên tục)', met:3, icon:'⭐'},
  {id:'act_194', name:'Nhân viên bảo vệ (Đi tuần tra khuôn viên rộng)', met:3, icon:'⭐'},
  {id:'act_195', name:'Thợ điện dân dụng (Đi dây, đập đục tường)', met:3.3, icon:'·'},
  {id:'act_196', name:'Sales thị trường (Đi bộ liên tục gặp khách hàng)', met:3.5, icon:'⭐'},
  {id:'act_197', name:'Shipper giao hàng đi bộ (Chặng cuối ngõ, chung cư)', met:3.5, icon:'⭐'},
  {id:'act_198', name:'Kỹ thuật viên hiện trường (Bảo trì máy công nghiệp)', met:3.5, icon:'⭐'},
  {id:'act_199', name:'Đan/Móc/May vá thủ công', met:1.5, icon:'·'},
  {id:'act_200', name:'Chơi game PC / Console (Ngồi)', met:1.3, icon:'⭐'},
  {id:'act_201', name:'Đánh golf (Ngồi xe điện di chuyển)', met:2.5, icon:'·'},
  {id:'act_202', name:'Đánh golf (Tập tại thảm Driving Range)', met:3, icon:'·'},
  {id:'act_203', name:'Đánh golf (Đi bộ tự kéo túi gậy hoặc có caddie)', met:3.8, icon:'·'},
  {id:'act_204', name:'Dọn dẹp buồng phòng khách sạn', met:4, icon:'·'},
  {id:'act_205', name:'Thợ mộc, chế tác đồ gỗ (Cưa cắt, chà nhám)', met:4, icon:'·'},
  {id:'act_206', name:'Thợ sơn nước (Lăn sơn tường, leo giàn giáo)', met:4, icon:'·'},
  {id:'act_207', name:'Nông dân làm đồng (Thu hoạch hoa màu thủ công)', met:4, icon:'·'},
  {id:'act_208', name:'Shipper xe máy (Giao hàng cồng kềnh, bê nặng)', met:4.5, icon:'·'},
  {id:'act_209', name:'Thợ xây dựng, thợ nề (Trộn vữa, khuấy hồ, xây)', met:5, icon:'⭐'},
  {id:'act_210', name:'Trò chơi thực tế ảo (VR Game bùng nổ)', met:5, icon:'·'},
  {id:'act_211', name:'Nhảy hiện đại, Kpop dance, Shuffle', met:5, icon:'⭐'},
  {id:'act_212', name:'Kỹ thuật viên viễn thông (Leo cột, kéo cáp)', met:6, icon:'·'},
  {id:'act_213', name:'Công nhân bốc xếp kho bãi (Bê vác kiện nặng)', met:6.5, icon:'⭐'}
];

// ═══════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════
function todayLocal() {
  var d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function esc(s) {
  return String(s).replace(/[<>&"']/g, function(c) {
    return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#x27;'}[c];
  });
}

function noTone(s) {
  return String(s).normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase();
}

function searchFood(q) {
  if (!q || !q.trim()) return FOOD_DB.slice(0, 10);
  var k = noTone(q.trim());
  return FOOD_DB.filter(function(f) { return noTone(f.name).includes(k); }).slice(0, 10);
}

function searchAct(q) {
  if (!q || !q.trim()) return ACT_DB.slice(0, 8);
  var k = noTone(q.trim());
  return ACT_DB.filter(function(a) { return noTone(a.name).includes(k); });
}

function fmtVN(d) {
  if (!d) return '—';
  var dt = d instanceof Date ? d : new Date(d + 'T00:00');
  return String(dt.getDate()).padStart(2, '0') + '/' + String(dt.getMonth() + 1).padStart(2, '0');
}

function addDaysStr(dateStr, n) {
  var d = new Date(dateStr + 'T00:00');
  d.setDate(d.getDate() + Math.round(n));
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

// ═══════════════════════════════════════════════════════════
// DB — localStorage
// ═══════════════════════════════════════════════════════════
// Ruột đã đổi sang SQLite-WASM (shared/vital-sqlite.js). Dữ liệu hệ Nữ = user 'anh'.
// Logs lưu dạng map { 'YYYY-MM-DD': log } đúng như code cũ kỳ vọng.
var DB = {
  loadProfile: function() {
    var r = window.VitalSQL.get("SELECT json FROM profile WHERE user='anh'");
    return r ? JSON.parse(r.json) : null;
  },
  saveProfile: function(p) {
    window.VitalSQL.run("INSERT OR REPLACE INTO profile (user,json) VALUES ('anh',?)", [JSON.stringify(p)]);
  },
  loadLogs: function() {
    var rows = window.VitalSQL.all("SELECT date,json FROM logs WHERE user='anh'");
    var map = {};
    rows.forEach(function(r) { try { map[r.date] = JSON.parse(r.json); } catch(e) {} });
    return map;
  },
  saveLogs: function(logs) {
    // Thay toàn bộ tập log của 'anh' (giống setItem cũ ghi đè cả khối).
    window.VitalSQL.run("DELETE FROM logs WHERE user='anh'");
    Object.keys(logs || {}).forEach(function(d) {
      window.VitalSQL.run("INSERT OR REPLACE INTO logs (user,date,json) VALUES ('anh',?,?)", [d, JSON.stringify(logs[d])]);
    });
  },
  today: function() { return todayLocal(); },
  newLog: function(date) {
    return { date: date || todayLocal(), foods: [], acts: [], weight: null, waist: null, hip: null };
  }
};

// ═══════════════════════════════════════════════════════════
// ENGINE 1 — Body Engine
// ═══════════════════════════════════════════════════════════
var E1 = {
  bmr: function(weight, height, age) {
    // Mifflin-St Jeor nữ
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  },
  tdee: function(bmr, actLevel) {
    return Math.round(bmr * (ACT_FACTORS[actLevel] || ACT_FACTORS.moderate));
  },
  bodyFatNavy: function(waist, hip, neck, height) {
    if (!waist || !hip || !neck || !height) return null;
    var bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
    return isNaN(bf) ? null : Math.round(bf * 10) / 10;
  },
  dayCalories: function(log) {
    if (!log || !log.foods) return 0;
    return Math.round(log.foods.reduce(function(s, f) { return s + (f.kcal || 0) * (f.qty || 1); }, 0));
  },
  dayProtein: function(log) {
    if (!log || !log.foods) return 0;
    return Math.round(log.foods.reduce(function(s, f) { return s + (f.protein || 0) * (f.qty || 1); }, 0));
  },
  adaptiveTDEE: function(logs, tdeeForClamp) {
    var valid = logs.filter(function(l) { return l.weight != null && l.date; });
    if (valid.length < 7) return null;
    var win = valid.slice(-14);
    if (win.length < 7) return null;
    var t0 = new Date(win[0].date + 'T00:00').getTime();
    var t1 = new Date(win[win.length - 1].date + 'T00:00').getTime();
    var daySpan = Math.max(1, Math.floor((t1 - t0) / 86400000));
    if (daySpan < 7) return null;
    var wDelta = win[win.length - 1].weight - win[0].weight;
    var intakes = win.map(function(l) { return E1.dayCalories(l); }).filter(function(v) { return v > 0; });
    if (intakes.length < 5) return null;
    var avgIntake = intakes.reduce(function(s, v) { return s + v; }, 0) / intakes.length;
    var kcalPerDay = (wDelta * KCAL_PER_KG) / daySpan;
    var result = Math.round(avgIntake - kcalPerDay);
    if (tdeeForClamp && (result < tdeeForClamp * 0.6 || result > tdeeForClamp * 1.4)) return null;
    return result;
  },
  compute: function(profile, logs) {
    var withW = logs.filter(function(l) { return l.weight != null; });
    var currentWeight = withW.length ? withW[withW.length - 1].weight : (profile.weight || 55);
    var bmr = E1.bmr(currentWeight, profile.height || 160, profile.age || 25);
    var tdeeFormula = E1.tdee(bmr, profile.actLevel || 'moderate');
    var tdeeAdaptive = E1.adaptiveTDEE(logs, tdeeFormula);
    var tdee = tdeeAdaptive || tdeeFormula;
    var deficit = GOAL_DEF[profile.goal] != null ? GOAL_DEF[profile.goal] : -500;
    var targetKcal = Math.max(Math.round(tdee + deficit), bmr);
    var proteinTarget = Math.round(currentWeight * PROTEIN_PER_KG);
    return {
      currentWeight: currentWeight, bmr: bmr,
      tdeeFormula: tdeeFormula, tdeeAdaptive: tdeeAdaptive,
      tdee: tdee, isAdaptive: !!tdeeAdaptive,
      targetKcal: targetKcal, proteinTarget: proteinTarget, deficit: deficit
    };
  }
};

// ═══════════════════════════════════════════════════════════
// ENGINE 2 — Menstrual Engine (LÕI)
// ═══════════════════════════════════════════════════════════
var E2 = {
  compute: function(cycle) {
    if (!cycle || !cycle.start) return null;
    var len  = +cycle.len    || 28;
    var per  = +cycle.period || 5;
    var now  = new Date(todayLocal() + 'T00:00');
    var start = new Date(cycle.start + 'T00:00');
    if (isNaN(start.getTime())) return null;

    var diffDays = Math.floor((now - start) / 86400000);
    var day = ((diffDays % len) + len) % len + 1; // 1-indexed

    // Phase theo độ dài chu kỳ cá nhân
    var ovDay  = len - 14;
    var folEnd = ovDay - 2;
    var ovEnd  = ovDay + 1;

    var phase, phaseEn;
    if (day <= per)        { phase = 'Hành kinh';  phaseEn = 'menstrual'; }
    else if (day <= folEnd){ phase = 'Nang trứng'; phaseEn = 'follicular'; }
    else if (day <= ovEnd) { phase = 'Rụng trứng'; phaseEn = 'ovulation'; }
    else                   { phase = 'Hoàng thể';  phaseEn = 'luteal'; }

    // Kỳ kinh tiếp theo
    var cyclesSince = Math.ceil((diffDays + 1) / len);
    var nextStart = new Date(start);
    nextStart.setDate(start.getDate() + cyclesSince * len);
    var toNext = Math.max(0, Math.ceil((nextStart - now) / 86400000));

    // Ngày rụng trứng chu kỳ hiện tại
    var thisCycleStart = new Date(start);
    thisCycleStart.setDate(start.getDate() + (cyclesSince - 1) * len);
    var ovDate = new Date(thisCycleStart);
    ovDate.setDate(thisCycleStart.getDate() + ovDay - 1);

    // Dự báo 7 ngày tới
    var forecast7 = [];
    for (var i = 1; i <= 7; i++) {
      var futureDay = ((day - 1 + i) % len) + 1;
      var futurePhase;
      if (futureDay <= per)        futurePhase = 'Hành kinh';
      else if (futureDay <= folEnd) futurePhase = 'Nang trứng';
      else if (futureDay <= ovEnd)  futurePhase = 'Rụng trứng';
      else                          futurePhase = 'Hoàng thể';
      forecast7.push({ daysFromNow: i, cycleDay: futureDay, phase: futurePhase });
    }

    return {
      day: day, len: len, per: per, phase: phase, phaseEn: phaseEn,
      nextStart: nextStart, toNext: toNext, ovDate: ovDate,
      cycleDay: day, cycleLen: len, forecast7: forecast7
    };
  }
};

// ═══════════════════════════════════════════════════════════
// ENGINE 3 — Hormone Impact Engine
// ═══════════════════════════════════════════════════════════
var E3 = {
  PROPS: {
    menstrual:  { waterHigh: false, cravingHigh: true,  energyLow: true,  workoutKey: 'nhẹ nhàng',  verdictTone: 'gentle',     tip: 'Bổ sung sắt (thịt đỏ, rau xanh đậm). Ưu tiên yoga và nghỉ ngơi.' },
    follicular: { waterHigh: false, cravingHigh: false, energyLow: false, workoutKey: 'tốt',         verdictTone: 'positive',   tip: 'Estrogen tăng — thời điểm vàng để tập nặng và đặt mục tiêu mới.' },
    ovulation:  { waterHigh: false, cravingHigh: false, energyLow: false, workoutKey: 'tốt nhất',    verdictTone: 'positive',   tip: 'Đỉnh cao thể lực trong chu kỳ — thích hợp cardio cường độ cao.' },
    luteal:     { waterHigh: true,  cravingHigh: true,  energyLow: false, workoutKey: 'vừa phải',   verdictTone: 'reassuring', tip: 'Progesterone tăng → thèm ăn tăng là bình thường. Ưu tiên protein & rau xanh.' }
  },

  classifyWeightChange: function(deltaKg, avgKcalSurplus, phaseEn, days) {
    if (deltaKg <= 0) return { type: 'loss', waterPct: 0 };
    var maxFatKg = Math.max(0, (avgKcalSurplus * days) / KCAL_PER_KG);
    var props = E3.PROPS[phaseEn] || E3.PROPS.follicular;
    if (props.waterHigh && deltaKg > maxFatKg + 0.2) {
      var waterKg = deltaKg - maxFatKg;
      return { type: 'water', waterPct: Math.min(Math.round(waterKg / deltaKg * 100), 90) };
    }
    return { type: 'fat', waterPct: 0 };
  },

  compute: function(e2, recentLogs, tdee) {
    if (!e2) return null;
    var props = E3.PROPS[e2.phaseEn] || E3.PROPS.follicular;
    var withW = recentLogs.filter(function(l) { return l.weight != null; }).slice(-7);
    var classification = null;
    if (withW.length >= 2) {
      var delta = withW[withW.length - 1].weight - withW[0].weight;
      var baseline = tdee || 1700;
      var avgSurplus = recentLogs.slice(-7).reduce(function(s, l) {
        var k = E1.dayCalories(l);
        return s + (k > 0 ? k - baseline : 0);
      }, 0) / 7;
      classification = E3.classifyWeightChange(delta, avgSurplus, e2.phaseEn, 7);
    }
    return Object.assign({}, props, {
      phase: e2.phase, phaseEn: e2.phaseEn, classification: classification
    });
  }
};

// ═══════════════════════════════════════════════════════════
// ENGINE 4 — Progress Engine (cycle-adjusted)
// ═══════════════════════════════════════════════════════════
var E4 = {
  ma7: function(logs) {
    var withW = logs.filter(function(l) { return l.weight != null; });
    if (!withW.length) return null;
    var last7 = withW.slice(-MA_DAYS);
    return Math.round(last7.reduce(function(s, l) { return s + l.weight; }, 0) / last7.length * 10) / 10;
  },

  slopePerDay: function(pairs) {
    // pairs: [{x: dayOffset, y: value}, ...]
    var n = pairs.length;
    if (n < 2) return 0;
    var sx = 0, sy = 0, sxy = 0, sxx = 0;
    for (var i = 0; i < n; i++) {
      sx += pairs[i].x; sy += pairs[i].y;
      sxy += pairs[i].x * pairs[i].y; sxx += pairs[i].x * pairs[i].x;
    }
    var den = n * sxx - sx * sx;
    return den ? (n * sxy - sx * sy) / den : 0;
  },

  _toPairs: function(logsWithDate) {
    if (!logsWithDate.length) return [];
    var t0 = new Date(logsWithDate[0].date + 'T00:00').getTime();
    return logsWithDate.map(function(l) {
      return { x: Math.floor((new Date(l.date + 'T00:00').getTime() - t0) / 86400000), y: l.weight };
    });
  },

  weeklyTrend: function(logs) {
    var withW = logs.filter(function(l) { return l.weight != null && l.date; });
    if (withW.length < 7) return null;
    var win = withW.slice(-14);
    return Math.round(E4.slopePerDay(E4._toPairs(win)) * 7 * 100) / 100;
  },

  // So sánh cùng ngày chu kỳ với chu kỳ trước
  cycleComparison: function(logs, cycleLen) {
    if (!cycleLen || cycleLen < 7) return null;
    var withW = logs.filter(function(l) { return l.weight != null; });
    if (withW.length < cycleLen + 3) return null;
    var currSeries = withW.slice(-7);
    var prevSeries = withW.slice(-(cycleLen + 7), -(cycleLen));
    if (!currSeries.length || !prevSeries.length) return null;
    var curr = currSeries.reduce(function(s,l){return s+l.weight;},0) / currSeries.length;
    var prev = prevSeries.reduce(function(s,l){return s+l.weight;},0) / prevSeries.length;
    return Math.round((curr - prev) * 100) / 100;
  },

  compute: function(logs, e2) {
    var withW = logs.filter(function(l) { return l.weight != null; });
    var trendWeight = E4.ma7(logs);
    var weeklyTrendVal = E4.weeklyTrend(logs);
    var enough = withW.length >= MA_DAYS;
    var cycleComparison = e2 ? E4.cycleComparison(logs, e2.cycleLen) : null;

    var withWaist = logs.filter(function(l) { return l.waist != null; });
    var waistTrend = withWaist.length >= 2
      ? Math.round((withWaist[withWaist.length - 1].waist - withWaist[0].waist) * 10) / 10
      : null;

    return {
      trendWeight: trendWeight, weeklyTrend: weeklyTrendVal,
      enough: enough, dataDays: withW.length,
      cycleComparison: cycleComparison, waistTrend: waistTrend
    };
  }
};

// ═══════════════════════════════════════════════════════════
// ENGINE 5 — Body Shape Engine
// ═══════════════════════════════════════════════════════════
var E5 = {
  compute: function(logs, e3) {
    var withWaist = logs.filter(function(l) { return l.waist != null; });
    var withHip   = logs.filter(function(l) { return l.hip   != null; });
    var withW     = logs.filter(function(l) { return l.weight != null; });

    var waistChange = withWaist.length >= 2
      ? Math.round((withWaist[withWaist.length-1].waist - withWaist[0].waist) * 10) / 10
      : null;
    var hipChange = withHip.length >= 2
      ? Math.round((withHip[withHip.length-1].hip - withHip[0].hip) * 10) / 10
      : null;
    var weightChange = withW.length >= 2
      ? Math.round((withW[withW.length-1].weight - withW[0].weight) * 10) / 10
      : null;

    // Key insight: eo giảm + cân đứng = giảm mỡ thật
    var verdict = 'neutral';
    if (waistChange !== null && waistChange < -1 && (weightChange === null || Math.abs(weightChange) < 0.5))
      verdict = 'fat_loss_real';
    else if (e3 && e3.classification && e3.classification.type === 'water')
      verdict = 'water_retention';
    else if (waistChange !== null && waistChange < -0.5)
      verdict = 'improving';

    return {
      waistChange: waistChange, hipChange: hipChange, weightChange: weightChange, verdict: verdict,
      latestWaist: withWaist.length ? withWaist[withWaist.length-1].waist : null,
      latestHip:   withHip.length   ? withHip[withHip.length-1].hip      : null
    };
  }
};

// ═══════════════════════════════════════════════════════════
// ENGINE 6 — Prediction Engine
// ═══════════════════════════════════════════════════════════
var E6 = {
  linForecast: function(vals, futureDays) {
    var n = vals.length;
    if (n < 2) return null;
    var pairs = vals.map(function(v, i) { return { x: i, y: v }; });
    var slope = E4.slopePerDay(pairs);
    var lastVal = vals[n - 1];
    return futureDays.map(function(d) {
      return Math.round((lastVal + slope * d) * 10) / 10;
    });
  },

  compute: function(profile, logs, e2, e4) {
    var weeklyRate = e4.weeklyTrend || 0;
    var current = e4.trendWeight || profile.weight || 55;
    var predict = function(days) {
      return current ? Math.round((current + weeklyRate * (days / 7)) * 10) / 10 : null;
    };

    // ETA mục tiêu
    var goal = profile.weightGoal || null;
    var daysToGoal = null, goalDate = null, goalReached = false;
    var dailyRate = weeklyRate / 7;
    if (goal !== null) {
      var remaining = current - goal;
      if (Math.abs(remaining) < 0.15) {
        goalReached = true; daysToGoal = 0; goalDate = DB.today();
      } else if (dailyRate !== 0 &&
          ((remaining > 0 && dailyRate < 0) || (remaining < 0 && dailyRate > 0))) {
        daysToGoal = Math.round(Math.abs(remaining / dailyRate));
        goalDate = addDaysStr(DB.today(), daysToGoal);
      }
    }

    // Vòng eo forecast
    var withWaist = logs.filter(function(l) { return l.waist != null; });
    var waistForecast = null;
    if (withWaist.length >= 4) {
      var wVals = withWaist.map(function(l) { return l.waist; });
      var res = E6.linForecast(wVals, [30, 90]);
      if (res) waistForecast = { d30: res[0], d90: res[1] };
    }

    return {
      d7: predict(7), d30: predict(30), d90: predict(90),
      daysToGoal: daysToGoal, goalDate: goalDate, goalReached: goalReached,
      waistForecast: waistForecast
    };
  }
};

// ═══════════════════════════════════════════════════════════
// ENGINE 7 — Symptom Engine (học pattern cá nhân)
// ═══════════════════════════════════════════════════════════
var E7 = {
  compute: function(logs, e2) {
    if (!e2) return { prediction: null, patternCount: 0 };
    var byDay = {};
    logs.forEach(function(l) {
      if (l.cycleDay == null || !l.feelings) return;
      if (!byDay[l.cycleDay]) byDay[l.cycleDay] = [];
      byDay[l.cycleDay].push(l.feelings);
    });
    var cd = e2.cycleDay;
    var hist = byDay[cd];
    var prediction = null;
    if (hist && hist.length >= 2) {
      prediction = {
        energy:  Math.round(hist.reduce(function(s,f){return s+(f.energy ||5);},0)/hist.length*10)/10,
        mood:    Math.round(hist.reduce(function(s,f){return s+(f.mood   ||5);},0)/hist.length*10)/10,
        craving: Math.round(hist.reduce(function(s,f){return s+(f.craving||5);},0)/hist.length*10)/10,
        count:   hist.length
      };
    }
    return { prediction: prediction, patternCount: Object.keys(byDay).length };
  }
};

// ═══════════════════════════════════════════════════════════
// ENGINE 8 — Goal Achievement Engine
// ═══════════════════════════════════════════════════════════
var E8 = {
  sigmoid: function(x) { return 1 / (1 + Math.exp(-4 * (x - 0.7))); },
  compute: function(profile, e4) {
    if (!profile.weightGoal || !e4.trendWeight) return { prob: null, verdict: 'no_data' };
    var current = e4.trendWeight;
    var goal    = profile.weightGoal;
    if (Math.abs(current - goal) < 0.15) return { prob: 99, verdict: 'achieved' };
    if (e4.dataDays < 3) return { prob: null, verdict: 'insufficient_data' };
    if (!e4.weeklyTrend)  return { prob: null, verdict: 'no_trend' };

    var remaining  = Math.abs(current - goal);
    var deadlineWk = profile.deadline || 12;
    var neededRate = remaining / deadlineWk;
    var actualRate = Math.abs(e4.weeklyTrend);
    var ratio      = actualRate / (neededRate || 0.01);

    var prob = Math.round(E8.sigmoid(ratio) * 100);
    if (e4.dataDays < 7) prob = Math.round(prob * 0.75);
    prob = Math.max(5, Math.min(99, prob));

    var movingRight = (current > goal && e4.weeklyTrend < 0) || (current < goal && e4.weeklyTrend > 0);
    var verdict = !movingRight ? 'wrong_direction' : ratio >= 1.1 ? 'ahead' : ratio <= 0.7 ? 'behind' : 'on_track';
    return { prob: prob, verdict: verdict, ratio: ratio };
  }
};

// ═══════════════════════════════════════════════════════════
// ENGINE 9 — Recommendation Engine (phase-aware)
// ═══════════════════════════════════════════════════════════
var E9 = {
  compute: function(e1, e2, e3, e4, e8, todayLog) {
    var recs = [];
    var phaseEn = e2 ? e2.phaseEn : 'follicular';
    var phaseVN = e2 ? e2.phase   : 'Nang trứng';
    var todayCal = E1.dayCalories(todayLog);
    var todayPro = E1.dayProtein(todayLog);
    var target   = e1.targetKcal;
    var proTgt   = e1.proteinTarget;

    // Water retention → ưu tiên cao nhất
    if (e3 && e3.classification && e3.classification.type === 'water' &&
        (phaseEn === 'luteal' || phaseEn === 'menstrual')) {
      recs.push({ icon: 'r', type: 'water',
        text: 'Cân nhỉnh do <b>giữ nước</b> trong pha ' + phaseVN.toLowerCase() + ' — không phải tăng mỡ' });
    }

    // Phase workout
    if (phaseEn === 'follicular' || phaseEn === 'ovulation') {
      recs.push({ icon: 'm', type: 'workout',
        text: 'Pha <b>' + phaseVN + '</b>: năng lượng cao — tốt để tập nặng hoặc cardio hôm nay' });
    } else if (phaseEn === 'luteal') {
      recs.push({ icon: 'r', type: 'workout',
        text: 'Pha <b>' + phaseVN + '</b>: ưu tiên yoga, đi bộ nhẹ — thèm ăn tăng là bình thường' });
    } else {
      recs.push({ icon: 'r', type: 'workout',
        text: 'Ngày kinh: ưu tiên nghỉ ngơi và giãn cơ — bổ sung sắt (thịt đỏ, rau xanh đậm)' });
    }

    // Protein
    if (todayPro < proTgt * 0.70) {
      var needed = Math.round(proTgt - todayPro);
      recs.push({ icon: 'v', type: 'protein',
        text: 'Thêm <b>' + needed + 'g protein</b> hôm nay — 2 trứng + 1 hộp sữa chua ≈ 24g' });
    }

    // Calo còn lại
    if (todayCal > 0 && target - todayCal > 80) {
      recs.push({ icon: 'a', type: 'calorie',
        text: 'Còn <b>' + (target - todayCal) + ' kcal</b> trước mục tiêu hôm nay' });
    }

    // Eo giảm
    if (e4 && e4.waistTrend !== null && e4.waistTrend < -0.5) {
      recs.push({ icon: 'm', type: 'shape',
        text: 'Eo giảm <b>' + Math.abs(e4.waistTrend) + 'cm</b> — đang giảm mỡ thật dù cân ổn định' });
    }

    return recs.slice(0, 4);
  }
};

// ═══════════════════════════════════════════════════════════
// OUTPUT BUILDER
// ═══════════════════════════════════════════════════════════
var OB = {
  build: function(profile, allLogs, todayLog) {
    if (!profile) return null;
    var logArr = Object.values(allLogs)
      .filter(function(l) { return l && l.date; })
      .sort(function(a, b) { return a.date < b.date ? -1 : 1; });

    var e1 = E1.compute(profile, logArr);
    var e2 = E2.compute(profile.cycle);
    var e3 = E3.compute(e2, logArr, e1.tdeeFormula);
    var e4 = E4.compute(logArr, e2);
    var e5 = E5.compute(logArr, e3);
    var e6 = E6.compute(profile, logArr, e2, e4);
    var e7 = E7.compute(logArr, e2);
    var e8 = E8.compute(profile, e4);
    var e9 = E9.compute(e1, e2, e3, e4, e8, todayLog || DB.newLog());

    return { e1:e1, e2:e2, e3:e3, e4:e4, e5:e5, e6:e6, e7:e7, e8:e8, e9:e9 };
  }
};

// ═══════════════════════════════════════════════════════════
// APP STATE
// ═══════════════════════════════════════════════════════════
var S = { profile: null, allLogs: {}, todayLog: null, out: null };

function loadState() {
  S.profile  = DB.loadProfile();
  S.allLogs  = DB.loadLogs();
  var today  = DB.today();
  S.todayLog = S.allLogs[today] || DB.newLog(today);
  S.allLogs[today] = S.todayLog;
}

function persist() {
  DB.saveLogs(S.allLogs);
  if (S.profile) DB.saveProfile(S.profile);
}

function refresh() {
  loadState();
  if (S.profile) {
    S.out = OB.build(S.profile, S.allLogs, S.todayLog);
    if (S.out && S.out.e2 && S.todayLog) {
      S.todayLog.cycleDay = S.out.e2.cycleDay;
      S.allLogs[S.todayLog.date] = S.todayLog;
      DB.saveLogs(S.allLogs);
    }
  }
  renderAll();
}

// ═══════════════════════════════════════════════════════════
// DOM HELPERS
// ═══════════════════════════════════════════════════════════
function $$(id) { return document.getElementById(id); }

function setRing(id, pct) {
  var el = $$(id);
  if (!el) return;
  var C = 2 * Math.PI * 34;
  el.style.strokeDasharray  = C;
  el.style.strokeDashoffset = C * (1 - Math.min(Math.max(pct || 0, 0), 1));
  el.style.transition = 'stroke-dashoffset 1s cubic-bezier(.34,1.56,.64,1)';
}

function smooth(pts) {
  if (!pts || pts.length < 2) return '';
  var d = 'M' + pts[0][0] + ',' + pts[0][1];
  for (var i = 0; i < pts.length - 1; i++) {
    var a = pts[i-1] || pts[i], b = pts[i], c = pts[i+1], e = pts[i+2] || c;
    d += ' C' + (b[0]+(c[0]-a[0])/6) + ',' + (b[1]+(c[1]-a[1])/6) +
         ' '  + (c[0]-(e[0]-b[0])/6) + ',' + (c[1]-(e[1]-b[1])/6) +
         ' '  + c[0] + ',' + c[1];
  }
  return d;
}

function drawChart() {
  var chart = $$('chart'), xEl = $$('chart-x');
  if (!chart) return;
  var logArr = Object.values(S.allLogs)
    .filter(function(l){return l&&l.date;})
    .sort(function(a,b){return a.date<b.date?-1:1;});
  var last7 = logArr.slice(-7);
  if (last7.length < 2) {
    chart.innerHTML = '<text x="200" y="75" text-anchor="middle" fill="var(--faint)" font-size="12" font-family="var(--geist)">Cần ít nhất 2 ngày dữ liệu</text>';
    return;
  }
  var n = last7.length, W = 400, H = 140, pad = 14;
  var stepX = (W - pad*2) / (n - 1);
  var bmr = S.out && S.out.e1 ? S.out.e1.bmr : 1450;

  var intakes = last7.map(function(l) { return E1.dayCalories(l); });
  var burns   = last7.map(function(l) {
    return bmr + (l.acts || []).reduce(function(s,a){return s+(a.kcal||0);},0);
  });
  var mxIB = Math.max.apply(null, intakes.concat(burns).concat([1]));
  var norm = function(arr, mx) {
    return arr.map(function(v, i) { return [pad + i*stepX, H - pad - (v/mx)*(H-pad*2)]; });
  };
  var iP = norm(intakes, mxIB), bP = norm(burns, mxIB);
  var area = function(p) {
    return smooth(p) + ' L'+p[n-1][0]+','+(H-pad)+' L'+p[0][0]+','+(H-pad)+' Z';
  };

  // Cycle progress overlay
  var cyclePathSVG = '';
  if (S.out && S.out.e2) {
    var day = S.out.e2.day, len = S.out.e2.len;
    var cVals = last7.map(function(_,i) {
      return Math.min(100, Math.max(1, day - (n-1-i)) / len * 100);
    });
    cyclePathSVG = '<path d="'+smooth(norm(cVals,100))+'" fill="none" stroke="var(--rose)" stroke-width="2.2" stroke-dasharray="3 4" stroke-linecap="round" opacity=".8"/>';
  }

  chart.innerHTML = '<defs>' +
    '<linearGradient id="fv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--violet)" stop-opacity=".22"/><stop offset="1" stop-color="var(--violet)" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="fm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--mint)" stop-opacity=".2"/><stop offset="1" stop-color="var(--mint)" stop-opacity="0"/></linearGradient>' +
    '</defs>' +
    '<path d="'+area(iP)+'" fill="url(#fv)"/>' +
    '<path d="'+area(bP)+'" fill="url(#fm)"/>' +
    cyclePathSVG +
    '<path d="'+smooth(iP)+'" fill="none" stroke="var(--violet)" stroke-width="2.6" stroke-linecap="round"/>' +
    '<path d="'+smooth(bP)+'" fill="none" stroke="var(--mint-d)" stroke-width="2.6" stroke-linecap="round"/>' +
    iP.map(function(p){ return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="2.6" fill="#fff" stroke="var(--violet)" stroke-width="1.6"/>'; }).join('');

  if (xEl) xEl.innerHTML = last7.map(function(l) {
    var d = new Date(l.date + 'T00:00');
    return '<span>'+['CN','T2','T3','T4','T5','T6','T7'][d.getDay()]+'</span>';
  }).join('');
}

function icSVG(t) {
  var m = {
    v: '<path d="M5 11a7 7 0 0114 0c0 5-7 10-7 10S5 16 5 11z"/>',
    m: '<path d="M12 3c2 3 4 4.5 4 8a4 4 0 01-8 0c0-2 1-3 1-4-2 1.5-3 3.5-3 6a6 6 0 0012 0c0-5-4-7-6-10z"/>',
    r: '<path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"/>',
    a: '<path d="M12 3l1.9 4.6L18.5 9l-4.6 1.4L12 15l-1.9-4.6L5.5 9l4.6-1.4z"/>'
  };
  return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+(m[t]||m.v)+'</svg>';
}

function buildVerdict(out) {
  var e2 = out && out.e2, e3 = out && out.e3, e8 = out && out.e8;
  if (!e2) return 'Nhập thông tin chu kỳ để hệ thống phân tích cơ thể bạn.';
  if (e3 && e3.classification && e3.classification.type === 'water' &&
      (e2.phaseEn === 'luteal' || e2.phaseEn === 'menstrual'))
    return 'Cân nhỉnh hôm nay chủ yếu do <em>giữ nước</em> — pha ' + e2.phase.toLowerCase() + ' là bình thường.';
  if (e8 && e8.verdict === 'achieved')       return 'Bạn đã đạt mục tiêu — hãy duy trì phong độ này!';
  if (e8 && e8.verdict === 'ahead')          return 'Đang đi <em>nhanh hơn kế hoạch</em> — giữ nguyên nhịp này.';
  if (e8 && e8.verdict === 'on_track')       return 'Bạn đang đi <em>đúng lộ trình</em>. Tiếp tục nhé.';
  if (e2.phaseEn === 'follicular')  return 'Pha <em>nang trứng</em> — năng lượng đang tăng dần, tốt để tập và đẩy mạnh.';
  if (e2.phaseEn === 'ovulation')   return 'Đỉnh cao <em>rụng trứng</em> — năng lượng cao nhất chu kỳ, thích hợp tập nặng.';
  if (e2.phaseEn === 'luteal')      return 'Pha <em>hoàng thể</em> — giữ nước nhẹ là bình thường, chưa phải tăng mỡ.';
  if (e2.phaseEn === 'menstrual')   return 'Ngày <em>hành kinh</em> — cơ thể thải độc, ưu tiên nghỉ ngơi và dinh dưỡng.';
  return 'Theo dõi thêm vài ngày để hệ thống phân tích chính xác hơn.';
}

function buildInsights(out, todayLog) {
  var e2 = out && out.e2, e3 = out && out.e3, e4 = out && out.e4, e9 = out && out.e9;
  var items = [];
  (e9 || []).forEach(function(r) { items.push([r.icon, r.text]); });
  if (e2 && !items.some(function(i){return i[1] && i[1].includes('kỳ kinh');})) {
    items.push(['r', 'Kỳ kinh tiếp theo: <b>' + fmtVN(e2.nextStart) + '</b> · còn <b>' + e2.toNext + ' ngày</b>']);
  }
  if (e4 && e4.waistTrend !== null && e4.waistTrend < -0.5 &&
      !items.some(function(i){return i[1]&&i[1].includes('eo');}))
    items.push(['m', 'Eo giảm <b>' + Math.abs(e4.waistTrend) + 'cm</b> — đang giảm mỡ thực sự']);
  if (e3 && e3.tip && items.length < 3)
    items.push(['a', e3.tip]);
  return items.slice(0, 4);
}

function emptyRow() {
  return '<div class="row"><span class="nme" style="font-style:italic;color:var(--faint)">Chưa có dữ liệu — bấm để nhập</span></div>';
}

// ─── RENDER ALL ────────────────────────────────────────────
function renderAll() {
  var h = new Date().getHours();
  var name = (S.profile && S.profile.name) ? S.profile.name : 'Bạn';
  var greet = $$('greet');
  if (greet) greet.textContent =
    (h<11?'Chào buổi sáng':h<14?'Chào buổi trưa':h<18?'Chào buổi chiều':'Chào buổi tối') + ', ' + name;

  var td = $$('today');
  if (td) {
    var d = new Date();
    td.textContent = ['CN','T2','T3','T4','T5','T6','T7'][d.getDay()] + ' · ' +
      String(d.getDate()).padStart(2,'0') + '.' + String(d.getMonth()+1).padStart(2,'0') + '.' + d.getFullYear();
  }

  if (!S.profile) {
    var h2a = document.querySelector('.hero h2');
    if (h2a) h2a.innerHTML = 'Nhập thông tin <em>hồ sơ & chu kỳ</em> để bắt đầu phân tích.';
    renderSheetData();
    return;
  }

  var out = S.out, e1 = out && out.e1, e2 = out && out.e2;
  var tl  = S.todayLog;

  // Rings
  var totalCal  = E1.dayCalories(tl);
  var actKcal   = (tl && tl.acts || []).reduce(function(s,a){return s+(a.kcal||0);},0);
  var burnTotal = (e1 ? e1.bmr : 1450) + actKcal;
  var goalKcal  = e1 ? e1.targetKcal : 1800;

  setRing('ring-intake', totalCal / goalKcal);
  setRing('ring-burn',   burnTotal / (e1 ? e1.tdee : 2000));

  var el;
  el = $$('c-intake'); if(el) el.textContent = totalCal;
  el = $$('u-intake'); if(el) el.textContent = '/ ' + goalKcal;
  el = $$('c-burn');   if(el) el.textContent = burnTotal;
  el = $$('u-burn');   if(el) el.textContent = 'kcal đốt';

  if (e2) {
    setRing('ring-cycle', e2.day / e2.len);
    el = $$('c-cycle');     if(el) el.textContent = 'N' + e2.day;
    el = $$('c-cycle-sub'); if(el) el.textContent = e2.phase;
    el = $$('u-cycle');     if(el) el.textContent = 'vòng ' + e2.len;
  }

  // Hero
  var h2 = document.querySelector('.hero h2');
  if (h2) h2.innerHTML = buildVerdict(out);

  var insEl = $$('insights');
  if (insEl) {
    var its = buildInsights(out, tl);
    insEl.innerHTML = its.length
      ? its.map(function(i){return '<div class="ins"><div class="ic '+i[0]+'">'+icSVG(i[0])+'</div><div class="tx">'+i[1]+'</div></div>';}).join('')
      : '<div class="ins"><div class="ic a">'+icSVG('a')+'</div><div class="tx">Thêm món ăn hôm nay để nhận phân tích cá nhân.</div></div>';
    var demoTag = document.querySelector('.demo-tag');
    if (demoTag) demoTag.style.display = 'none';
  }

  // Page 2 — Intake
  el = $$('m-intake'); if(el) el.textContent = totalCal + ' / ' + goalKcal + ' kcal hôm nay';
  el = $$('rows-intake');
  if (el) {
    el.innerHTML = (tl && tl.foods || []).map(function(f) {
      var k = Math.round((f.kcal||0) * (f.qty||1));
      return '<div class="row"><span class="nme">' + esc(f.name) + (f.qty&&f.qty!==1?' ×'+f.qty:'') + '</span><span class="amt">' + k + ' kcal</span></div>';
    }).join('') || emptyRow();
  }
  el = $$('note-intake');
  if (el) {
    var left = goalKcal - totalCal;
    el.innerHTML = left > 0
      ? '<b>Còn ' + left + ' kcal</b> trước mục tiêu.' + (e2 && e2.phaseEn==='luteal' ? ' Pha hoàng thể dễ thèm ngọt — ưu tiên protein nhé.' : '')
      : '<b>Vượt ' + (-left) + ' kcal</b> so mục tiêu — để ý bữa tiếp nhé.';
  }

  // Page 2 — Burn
  el = $$('m-burn'); if(el) el.textContent = 'Đốt ' + burnTotal + ' kcal hôm nay';
  el = $$('rows-burn');
  if (el) {
    el.innerHTML = (tl && tl.acts || []).map(function(a) {
      return '<div class="row"><span class="nme">' + esc(a.name) + '</span><span class="amt">' + (a.kcal||0) + ' kcal</span></div>';
    }).join('') || emptyRow();
  }
  el = $$('note-burn');
  if (el) {
    var net = totalCal - burnTotal;
    el.innerHTML = 'Cân bằng ròng: <b>' + (net>0?'+':'') + net + ' kcal</b>' + (net<0?' → thâm hụt, hướng giảm mỡ.':'.');
  }

  // Page 2 — Cycle
  if (e2) {
    el = $$('m-cycle'); if(el) el.textContent = 'Ngày ' + e2.day + ' · pha ' + e2.phase;
    el = $$('cycle-strip');
    if (el) {
      var ov = Math.round(e2.len/2);
      var phs = [
        ['Hành kinh',  '1–'+e2.per],
        ['Nang trứng', (e2.per+1)+'–'+(ov-2)],
        ['Rụng trứng', (ov-1)+'–'+(ov+1)],
        ['Hoàng thể',  (ov+2)+'–'+e2.len]
      ];
      el.innerHTML = phs.map(function(p) {
        return '<div class="ph '+(p[0]===e2.phase?'on':'')+'"><div class="pn">'+p[0]+'</div><div class="pd">'+p[1]+'</div></div>';
      }).join('');
    }
    el = $$('note-cycle');
    if (el) {
      el.innerHTML = 'Kỳ tiếp <b>' + fmtVN(e2.nextStart) + '</b> · còn <b>' + e2.toNext + ' ngày</b>' +
        (e2.ovDate ? ' · Rụng trứng ~<b>' + fmtVN(e2.ovDate) + '</b>' : '');
    }
  }

  drawChart();

  // Prediction + goal panel
  var predPanel = $$('pred-panel'), predContent = $$('pred-content');
  if (predPanel && predContent && out) {
    var e6 = out.e6, e8 = out.e8;
    var parts = [];
    if (e6 && e6.daysToGoal !== null && e6.goalDate)
      parts.push('<div class="row"><span class="nme">ETA mục tiêu</span><span class="amt">' + fmtVN(e6.goalDate) + ' (' + e6.daysToGoal + ' ngày)</span></div>');
    if (e6 && e6.d30)
      parts.push('<div class="row"><span class="nme">Dự báo cân 30 ngày</span><span class="amt">' + e6.d30 + ' kg</span></div>');
    if (e8 && e8.prob !== null) {
      var vMap = { achieved:'Đã đạt!', ahead:'Vượt KH', on_track:'Đúng tiến độ', behind:'Cần đẩy nhanh', wrong_direction:'Sai hướng' };
      parts.push('<div class="row"><span class="nme">Xác suất đạt mục tiêu</span><span class="amt">' + e8.prob + '% · ' + (vMap[e8.verdict] || '') + '</span></div>');
    }
    predPanel.style.display = parts.length ? '' : 'none';
    predContent.innerHTML = parts.length ? '<div class="rows">' + parts.join('') + '</div>' : '';
  }

  renderSheetData();
}

// ─── SHEET DATA ────────────────────────────────────────────
function litem(x, i, key) {
  var name = esc(x.name || '');
  var k    = Math.round((x.kcal||0) * (x.qty||1));
  var qty  = (x.qty && x.qty !== 1) ? ' ×' + x.qty : '';
  return '<div class="litem"><span class="l-n">' + name + qty + '</span>' +
    '<span class="r-side"><span class="l-c">' + k + ' kcal</span>' +
    '<button class="del" data-del="' + key + '" data-i="' + i + '">' +
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">' +
    '<path d="M6 6l12 12M18 6L6 18"/></svg></button></span></div>';
}

function renderSheetData() {
  var tl = S.todayLog;
  var el;

  el = $$('list-intake');
  if (el) el.innerHTML = (tl && tl.foods || []).map(function(x,i){return litem(x,i,'foods');}).join('') ||
    '<div class="empty">Chưa có món nào</div>';

  el = $$('list-burn');
  if (el) el.innerHTML = (tl && tl.acts || []).map(function(x,i){return litem(x,i,'acts');}).join('') ||
    '<div class="empty">Chưa có hoạt động nào</div>';

  el = $$('sum-intake'); if(el) el.textContent = E1.dayCalories(tl) + ' kcal';
  el = $$('sum-burn');
  if(el) el.textContent = (tl && tl.acts || []).reduce(function(s,a){return s+(a.kcal||0);},0) + ' kcal';

  // Cycle
  var c = S.profile && S.profile.cycle;
  if (c) {
    el = $$('in-cycle-start');  if(el) el.value = c.start  || '';
    el = $$('in-cycle-len');    if(el) el.value = c.len    || 28;
    el = $$('in-cycle-period'); if(el) el.value = c.period || 5;
  }

  // Body
  el = $$('in-body-weight'); if(el) el.value = (tl && tl.weight) || '';
  el = $$('in-body-waist');  if(el) el.value = (tl && tl.waist)  || '';
  el = $$('in-body-hip');    if(el) el.value = (tl && tl.hip)    || '';

  // Feelings sliders
  var feels = tl && tl.feelings;
  if (feels) {
    el = $$('in-feel-energy');  if(el) { el.value = feels.energy  || 5; var lb = $$('lbl-feel-energy');  if(lb) lb.textContent = el.value; }
    el = $$('in-feel-mood');    if(el) { el.value = feels.mood    || 5; var lb = $$('lbl-feel-mood');    if(lb) lb.textContent = el.value; }
    el = $$('in-feel-craving'); if(el) { el.value = feels.craving || 5; var lb = $$('lbl-feel-craving'); if(lb) lb.textContent = el.value; }
  }

  // Profile
  var p = S.profile;
  if (p) {
    ['name','age','height','weight','weightGoal','deadline'].forEach(function(f) {
      el = $$('in-p-' + f); if(el && p[f] != null) el.value = p[f];
    });
    el = $$('in-p-actLevel'); if(el) el.value = p.actLevel || 'moderate';
    el = $$('in-p-goal');     if(el) el.value = p.goal     || 'lose_fat';
  }
}

// ─── FOOD / ACT SEARCH ────────────────────────────────────
var _selFood = null;

function renderFoodSearch(q) {
  var el = $$('food-search-results');
  if (!el) return;
  if (!q || !q.trim()) {
    var top = FOOD_DB.slice(0, 10);
    el.innerHTML = top.map(function(f) {
      return '<div class="food-result" data-fid="'+f.id+'" style="padding:9px 12px;border-radius:11px;background:var(--bg-2);cursor:pointer;display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">' +
        '<span style="font-size:13px;color:var(--plum-soft)">'+esc(f.name)+'</span>' +
        '<span style="font-size:11px;color:var(--muted);font-family:var(--mono)">'+f.kcal+' kcal/'+(f.qty&&f.qty>1?f.qty:'')+f.unit+'</span>' +
        '</div>';
    }).join('');
    return;
  }
  var results = searchFood(q);
  if (!results.length) { el.innerHTML = ''; return; }
  el.innerHTML = results.map(function(f) {
    return '<div class="food-result" data-fid="'+f.id+'" style="padding:9px 12px;border-radius:11px;background:var(--bg-2);cursor:pointer;display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">' +
      '<span style="font-size:13px;color:var(--plum-soft)">'+esc(f.name)+'</span>' +
      '<span style="font-size:11px;color:var(--muted);font-family:var(--mono)">'+f.kcal+' kcal/'+(f.qty&&f.qty>1?f.qty:'')+f.unit+'</span>' +
      '</div>';
  }).join('');
}

function renderActSearch(q) {
  var el = $$('act-search-results');
  if (!el) return;
  if (!q || !q.trim()) { el.innerHTML = ''; return; }
  var results = searchAct(q);
  if (!results.length) { el.innerHTML = ''; return; }
  var weight = (S.profile && S.profile.weight) || 55;
  el.innerHTML = results.map(function(a) {
    return '<div class="act-result" data-aid="'+a.id+'" style="padding:9px 12px;border-radius:11px;background:var(--bg-2);cursor:pointer;display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">' +
      '<span style="font-size:13px;color:var(--plum-soft)">'+esc(a.name)+'</span>' +
      '<span style="font-size:11px;color:var(--muted);font-family:var(--mono)">~'+Math.round(a.met*weight*0.5)+' kcal/30min</span>' +
      '</div>';
  }).join('');
}

// ─── ADD FOOD ─────────────────────────────────────────────
function addFood() {
  if (S.todayLog && S.todayLog.date !== DB.today()) { loadState(); }
  var nameEl = $$('in-intake-name'), calEl = $$('in-intake-cal'), qtyEl = $$('in-intake-qty');
  var name = (nameEl && nameEl.value || '').trim();
  var kcal = parseInt((calEl && calEl.value) || '0', 10);
  var qty  = parseFloat(String((qtyEl && qtyEl.value) || '1').replace(',', '.')) || 1;
  if (!name) { showToast('Vui lòng nhập tên món ăn'); return; }
  if (!kcal) { showToast('Vui lòng nhập số kcal cho món'); return; }

  var food;
  if (_selFood && noTone(_selFood.name) === noTone(name)) {
    var ratio = (_selFood.kcal > 0) ? kcal / _selFood.kcal : 1;
    food = { name: _selFood.name, kcal: kcal,
             protein: Math.round((_selFood.protein || 0) * ratio * 10) / 10,
             carb:    Math.round((_selFood.carb    || 0) * ratio * 10) / 10,
             fat:     Math.round((_selFood.fat     || 0) * ratio * 10) / 10,
             fiber:   Math.round((_selFood.fiber   || 0) * ratio * 10) / 10,
             sugar:   Math.round((_selFood.sugar   || 0) * ratio * 10) / 10,
             qty: qty };
  } else {
    food = { name: name, kcal: kcal, protein: 0, carb: 0, fat: 0, fiber: 0, sugar: 0, qty: qty };
  }
  _selFood = null;

  S.todayLog.foods = S.todayLog.foods || [];
  S.todayLog.foods.push(food);
  S.allLogs[S.todayLog.date] = S.todayLog;
  persist();
  if (nameEl) nameEl.value = '';
  if (calEl)  calEl.value  = '';
  if (qtyEl)  qtyEl.value  = '1';
  var sr = $$('food-search-results'); if (sr) sr.innerHTML = '';
  updateIntakeTotal();
  S.out = OB.build(S.profile, S.allLogs, S.todayLog);
  renderAll();
}

// ─── ADD ACTIVITY ─────────────────────────────────────────
function addActivity() {
  if (S.todayLog && S.todayLog.date !== DB.today()) { loadState(); }
  var nameEl = $$('in-burn-name'), calEl = $$('in-burn-cal');
  var name = (nameEl && nameEl.value || '').trim();
  var kcal = parseInt((calEl && calEl.value) || '0', 10);
  if (!name || !kcal) return;
  S.todayLog.acts = S.todayLog.acts || [];
  S.todayLog.acts.push({ name: name, kcal: kcal });
  S.allLogs[S.todayLog.date] = S.todayLog;
  persist();
  if (nameEl) nameEl.value = '';
  if (calEl)  calEl.value  = '';
  var ar = $$('act-search-results'); if (ar) ar.innerHTML = '';
  S.out = OB.build(S.profile, S.allLogs, S.todayLog);
  renderAll();
}

// ═══════════════════════════════════════════════════════════
// PAGER
// ═══════════════════════════════════════════════════════════
var pager = $$('pager');
function goTo(i) { if (pager) pager.scrollTo({left: i * pager.clientWidth, behavior: 'smooth'}); }
function updateDots() {
  if (!pager) return;
  var i = Math.round(pager.scrollLeft / pager.clientWidth);
  document.querySelectorAll('.dot-item').forEach(function(d) {
    d.classList.toggle('on', +d.dataset.go === i);
  });
}
if (pager) pager.addEventListener('scroll', function(){ requestAnimationFrame(updateDots); }, {passive:true});
document.querySelectorAll('.dot-item').forEach(function(d) {
  d.addEventListener('click', function() { goTo(+d.dataset.go); });
});

// ═══════════════════════════════════════════════════════════
// SHEET
// ═══════════════════════════════════════════════════════════
function openSheet(tab) {
  selectTab(tab);
  renderSheetData();
  var scrim = $$('scrim'), sheet = $$('sheet');
  if (scrim) scrim.classList.add('show');
  if (sheet) sheet.classList.add('show');
}
function closeSheet() {
  var scrim = $$('scrim'), sheet = $$('sheet');
  if (scrim) scrim.classList.remove('show');
  if (sheet) sheet.classList.remove('show');
  refresh();
}
function selectTab(tab) {
  document.querySelectorAll('.tab').forEach(function(t) {
    t.classList.toggle('on', t.dataset.tab === tab);
  });
  document.querySelectorAll('.pane').forEach(function(p) {
    p.classList.toggle('on', p.dataset.pane === tab);
  });
}

document.querySelectorAll('[data-open]').forEach(function(el) {
  el.addEventListener('click', function() { openSheet(el.dataset.open); });
});
document.querySelectorAll('.tab').forEach(function(t) {
  t.addEventListener('click', function() { selectTab(t.dataset.tab); });
});
var scrimEl = $$('scrim');
if (scrimEl) scrimEl.addEventListener('click', closeSheet);
var saveSheetEl = $$('save-sheet');
if (saveSheetEl) saveSheetEl.addEventListener('click', closeSheet);

// ─── CLICK DELEGATION ─────────────────────────────────────
document.addEventListener('click', function(e) {
  // Food result
  var fr = e.target.closest('[data-fid]');
  if (fr) {
    var food = FOOD_DB.find(function(f) { return f.id === fr.dataset.fid; });
    if (food) {
      _selFood = food;
      var ni = $$('in-intake-name'), ci = $$('in-intake-cal');
      if (ni) ni.value = food.name;
      if (ci) ci.value = food.kcal;
      var sr = $$('food-search-results'); if (sr) sr.innerHTML = '';
      updateIntakeTotal();
      if (ni) ni.focus();
    }
    return;
  }
  // Act result
  var ar = e.target.closest('[data-aid]');
  if (ar) {
    var act = ACT_DB.find(function(a) { return a.id === ar.dataset.aid; });
    if (act) {
      var nb = $$('in-burn-name'), cb = $$('in-burn-cal'), mb = $$('in-burn-mins');
      var weight = (S.profile && S.profile.weight) || 55;
      var mins = mb ? (+mb.value || 30) : 30;
      if (nb) nb.value = act.name;
      if (cb) cb.value = Math.round(act.met * weight * (mins / 60));
      var asr = $$('act-search-results'); if (asr) asr.innerHTML = '';
      if (nb) nb.focus();
    }
    return;
  }
  // Delete
  var db = e.target.closest('[data-del]');
  if (db) {
    var key = db.dataset.del, idx = +db.dataset.i;
    if (key === 'foods') (S.todayLog.foods || []).splice(idx, 1);
    else if (key === 'acts') (S.todayLog.acts || []).splice(idx, 1);
    S.allLogs[S.todayLog.date] = S.todayLog;
    persist();
    S.out = OB.build(S.profile, S.allLogs, S.todayLog);
    renderAll();
  }
});

// ─── INPUT EVENTS ─────────────────────────────────────────
var intakeNameEl = $$('in-intake-name');
if (intakeNameEl) {
  intakeNameEl.addEventListener('input', function(e) { renderFoodSearch(e.target.value); });
  intakeNameEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var calEl = $$('in-intake-cal');
      if (calEl && calEl.value) addFood();
      else if (calEl) calEl.focus();
    }
  });
  intakeNameEl.addEventListener('focus', function() { if (!this.value) renderFoodSearch(''); });
}

var burnNameEl = $$('in-burn-name');
if (burnNameEl) {
  burnNameEl.addEventListener('input', function(e) { renderActSearch(e.target.value); });
  burnNameEl.addEventListener('focus', function() { if (!this.value) renderActSearch(''); });
}

var intakeCalEl = $$('in-intake-cal');
if (intakeCalEl) intakeCalEl.addEventListener('keydown', function(e) { if (e.key==='Enter') addFood(); });

var burnCalEl = $$('in-burn-cal');
if (burnCalEl) burnCalEl.addEventListener('keydown', function(e) { if (e.key==='Enter') addActivity(); });

var addIntakeEl = $$('add-intake');
if (addIntakeEl) addIntakeEl.addEventListener('click', addFood);

var addBurnEl = $$('add-burn');
if (addBurnEl) addBurnEl.addEventListener('click', addActivity);

// Auto-calc kcal từ MET khi nhập phút
var minsEl = $$('in-burn-mins');
if (minsEl) minsEl.addEventListener('input', function(e) {
  var nb = $$('in-burn-name');
  if (!nb || !nb.value) return;
  var nTone = noTone(nb.value);
  var act = ACT_DB.find(function(a) { return noTone(a.name) === nTone; });
  if (act) {
    var weight = (S.profile && S.profile.weight) || 55;
    var cb = $$('in-burn-cal');
    if (cb) cb.value = Math.round(act.met * weight * (+e.target.value / 60));
  }
});

// ─── SAVE CYCLE & BODY ────────────────────────────────────
var saveCycleEl = $$('save-cycle');
if (saveCycleEl) saveCycleEl.addEventListener('click', function() {
  if (!S.profile) {
    S.profile = { name: 'Bạn', age: 25, height: 160, weight: 55, weightGoal: 52, actLevel: 'moderate', goal: 'lose_fat' };
  }
  var cs = $$('in-cycle-start'), cl = $$('in-cycle-len'), cp = $$('in-cycle-period');
  S.profile.cycle = {
    start:  (cs && cs.value) || (S.profile.cycle && S.profile.cycle.start) || '',
    len:    +(cl && cl.value) || 28,
    period: +(cp && cp.value) || 5
  };
  saveBodyMeasurements();
  // Save feelings
  var feE = $$('in-feel-energy'), feM = $$('in-feel-mood'), feC = $$('in-feel-craving');
  if (feE || feM || feC) {
    S.todayLog.feelings = {
      energy:  feE ? +feE.value : 5,
      mood:    feM ? +feM.value : 5,
      craving: feC ? +feC.value : 5
    };
    S.allLogs[S.todayLog.date] = S.todayLog;
  }
  persist();
  closeSheet();
});

function saveBodyMeasurements() {
  var bw = $$('in-body-weight'), bwa = $$('in-body-waist'), bh = $$('in-body-hip');
  var w  = parseFloat(bw  && bw.value);
  var wa = parseFloat(bwa && bwa.value);
  var h  = parseFloat(bh  && bh.value);
  if (!isNaN(w))  S.todayLog.weight = w;
  if (!isNaN(wa)) S.todayLog.waist  = wa;
  if (!isNaN(h))  S.todayLog.hip    = h;
  S.allLogs[S.todayLog.date] = S.todayLog;
}

// ─── SAVE PROFILE ─────────────────────────────────────────
var saveProfileEl = $$('save-profile');
if (saveProfileEl) saveProfileEl.addEventListener('click', function() {
  var p = S.profile || {};
  var numFields = ['age','height','weight','weightGoal','deadline'];
  ['name','age','height','weight','weightGoal','deadline','actLevel','goal'].forEach(function(f) {
    var el = $$('in-p-' + f);
    if (!el || !el.value) return;
    p[f] = numFields.indexOf(f) >= 0 ? (parseFloat(el.value) || p[f]) : el.value;
  });
  if (!p.cycle && S.profile && S.profile.cycle) p.cycle = S.profile.cycle;
  S.profile = p;
  persist();
  closeSheet();
});

// ─── FEELINGS SLIDER LABELS ───────────────────────────────
['energy', 'mood', 'craving'].forEach(function(k) {
  var sl = $$('in-feel-' + k), lb = $$('lbl-feel-' + k);
  if (sl && lb) sl.addEventListener('input', function() { lb.textContent = sl.value; });
});

// ─── TOAST ────────────────────────────────────────────────
function showToast(msg) {
  var t = $$('vital-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'vital-toast';
    t.style.cssText = 'position:fixed;bottom:calc(80px + env(safe-area-inset-bottom));left:50%;transform:translateX(-50%) translateY(16px);background:var(--plum);color:#fff;font-size:12.5px;padding:10px 16px;border-radius:20px;z-index:200;opacity:0;transition:opacity .25s,transform .25s;white-space:nowrap;pointer-events:none;font-family:var(--geist)';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(t._tid);
  t._tid = setTimeout(function() {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(16px)';
  }, 2200);
}

// ─── TỔNG KCAl × SỐ LƯỢNG (cập nhật trực tiếp) ───────────
function updateIntakeTotal() {
  var calEl = $$('in-intake-cal'), qtyEl = $$('in-intake-qty');
  var hint = $$('intake-qty-hint');
  if (!hint) return;
  var kcalPer = parseFloat((calEl && calEl.value) || '0');
  var qty = parseFloat(String((qtyEl && qtyEl.value) || '1').replace(',', '.')) || 1;
  if (!kcalPer || qty === 1) { hint.textContent = ''; return; }
  hint.textContent = kcalPer + ' × ' + qty + ' = ' + Math.round(kcalPer * qty) + ' kcal tổng';
}

var intakeQtyEl = $$('in-intake-qty');
if (intakeQtyEl) intakeQtyEl.addEventListener('input', updateIntakeTotal);
var intakeCalEl2 = $$('in-intake-cal');
if (intakeCalEl2) intakeCalEl2.addEventListener('input', updateIntakeTotal);

// ─── SYNC (vital.sync.v1) ─────────────────────────────────
function exportSync() {
  var logs = DB.loadLogs();
  var logsArr = Object.values(logs).map(function(l) {
    return {
      date: l.date,
      weight: l.weight || null,
      foods: (l.foods || []).map(function(f) {
        return { name: f.name, kcal: f.kcal || 0, protein: f.protein || 0, carb: f.carb || 0, fat: f.fat || 0, qty: f.qty || 1 };
      }),
      acts: (l.acts || []).map(function(a) { return { name: a.name, kcal: a.kcal || 0 }; })
    };
  });
  var data = {
    schema: 'vital.sync.v1',
    owner: 'anh',
    exportedAt: new Date().toISOString(),
    profile: S.profile ? { name: S.profile.name, age: S.profile.age, height: S.profile.height, weight: S.profile.weight } : null,
    logs: logsArr
  };
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'vital-anh-' + DB.today() + '.sync.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Đã xuất ' + logsArr.length + ' ngày — gửi file cho Phúc');
}

function importSync() {
  var inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.json';
  inp.onchange = function(e) {
    var file = e.target.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      try {
        var data = JSON.parse(ev.target.result);
        if (data.schema !== 'vital.sync.v1') { showToast('File không đúng định dạng vital.sync.v1'); return; }
        if (data.owner === 'anh') { showToast('Đây là file của chính bạn — nhập file từ Phúc'); return; }
        localStorage.setItem('vital_sync_from_phuc', JSON.stringify(data));
        renderSyncView();
        showToast('Đã nhận ' + (data.logs || []).length + ' ngày từ ' + ((data.profile && data.profile.name) || 'Phúc'));
      } catch (err) { showToast('Lỗi đọc file: ' + err.message); }
    };
    reader.readAsText(file);
  };
  inp.click();
}


// ─── SYNC VIEW — Hiển thị dữ liệu Phúc ───────────────────
function renderSyncView() {
  var el = document.getElementById('sync-view-phuc');
  if (!el) return;
  try {
    var raw = localStorage.getItem('vital_sync_from_phuc');
    if (!raw) { el.style.display = 'none'; return; }
    var data = JSON.parse(raw);
    var logs = (data.logs || []).slice(-7).reverse();
    var pName = (data.profile && data.profile.name) || 'Phúc';
    var date7 = data.exportedAt ? data.exportedAt.slice(0, 10) : '';
    var rows = logs.map(function(l) {
      var totalKcal = (l.foods || []).reduce(function(s, f) { return s + (f.kcal || 0) * (f.qty || 1); }, 0);
      var w = l.weight ? (' · ' + l.weight + ' kg') : '';
      return '<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--line)">' +
        '<span style="font-size:12px;color:var(--plum-soft)">' + l.date + w + '</span>' +
        '<span style="font-size:12px;font-family:var(--mono);font-weight:600;color:var(--violet-d)">' + Math.round(totalKcal) + ' kcal</span></div>';
    }).join('');
    el.style.display = '';
    el.innerHTML =
      '<div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:600;margin-bottom:10px">' +
      'Dữ liệu của ' + esc(pName) + (date7 ? ' · ' + date7 : '') + '</div>' +
      (rows || '<div style="font-size:12px;color:var(--muted)">Chưa có log</div>');
  } catch(e) { el.style.display = 'none'; }
}

// ─── WINDOW EXPORTS (out of IIFE for onclick) ─────────────
window.exportSync = exportSync;
window.importSync = importSync;
window.renderSyncView = renderSyncView;

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
// Chờ SQLite (sql.js) nạp xong rồi mới đọc dữ liệu & render.
VitalSQL.init({ user: 'anh' }).then(function () {
  loadState();
  if (S.profile) {
    S.out = OB.build(S.profile, S.allLogs, S.todayLog);
    renderAll();
  } else {
    renderAll();
    setTimeout(function() { openSheet('profile'); }, 700);
  }
  renderSyncView();
}).catch(function (e) { console.error('Không khởi tạo được SQLite:', e); });

})();
