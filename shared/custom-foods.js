// ============================================================================
//  custom-foods.js — Danh mục MÓN TỰ THÊM của người dùng (lưu bền trong SQLite).
//  Khi tìm không thấy món, người dùng tự nhập tên + số liệu → lưu vào đây →
//  lần sau vẫn tìm lại được. Mỗi hồ sơ ('phuc' / 'anh') có danh mục riêng.
//
//  Dùng chung cho cả 2 trang. Gọi SAU khi VitalSQL.init() xong.
//    CustomFoods.load('phuc')        // → mảng món đã lưu (để nạp vào FOOD_DB)
//    CustomFoods.save('phuc', food)  // lưu / cập nhật 1 món (khớp theo food.id)
//    CustomFoods.remove('phuc', id)  // xoá 1 món khỏi danh mục
//    CustomFoods.isCustom(food)      // true nếu là món tự thêm (id bắt đầu 'custom_')
//    CustomFoods.newId()             // sinh id mới cho món tự thêm
// ============================================================================
(function () {
  'use strict';

  function Q() { return window.VitalSQL; }

  window.CustomFoods = {
    isCustom: function (f) {
      var id = f && (f.id != null ? String(f.id) : '');
      return id.indexOf('custom_') === 0;
    },
    newId: function () {
      return 'custom_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    },
    load: function (user) {
      try {
        var rows = Q().all('SELECT json FROM custom_foods WHERE user=?', [user]);
        return rows.map(function (r) {
          try { return JSON.parse(r.json); } catch (e) { return null; }
        }).filter(Boolean);
      } catch (e) { return []; }
    },
    save: function (user, food) {
      if (!food || food.id == null) return;
      try {
        Q().run('INSERT OR REPLACE INTO custom_foods (user,id,json) VALUES (?,?,?)',
          [user, String(food.id), JSON.stringify(food)]);
      } catch (e) { /* im lặng — không chặn thao tác của người dùng */ }
    },
    remove: function (user, id) {
      try { Q().run('DELETE FROM custom_foods WHERE user=? AND id=?', [user, String(id)]); }
      catch (e) {}
    }
  };
})();
