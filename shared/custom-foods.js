// ============================================================================
//  custom-foods.js — Danh mục MÓN TỰ THÊM của người dùng (Supabase, bảng
//  custom_foods). Khi tìm không thấy món, người dùng tự nhập tên + số liệu →
//  lưu vào đây → lần sau vẫn tìm lại được. Mỗi tài khoản có danh mục riêng.
//
//  Dùng chung cho cả 2 trang. Gọi CustomFoods._boot(ownerId) SAU khi biết
//  đang xem dữ liệu của ai (chính mình hay đối tác), rồi mới gọi .load().
//    CustomFoods._boot(ownerId)  // nạp 1 lần lúc boot (giống DB._boot)
//    CustomFoods.load()          // → mảng món đã lưu (để nạp vào FOOD_DB)
//    CustomFoods.save(food)      // lưu / cập nhật 1 món (khớp theo food.id)
//    CustomFoods.remove(id)      // xoá 1 món khỏi danh mục
//    CustomFoods.isCustom(food)  // true nếu là món tự thêm (id bắt đầu 'custom_')
//    CustomFoods.newId()         // sinh id mới cho món tự thêm
// ============================================================================
(function () {
  'use strict';

  var _ownerId = null;
  var _items = [];

  function sb() { return window.supabaseClient; }
  function readOnly() { return !!window.VITAL_READONLY; }

  window.CustomFoods = {
    isCustom: function (f) {
      var id = f && (f.id != null ? String(f.id) : '');
      return id.indexOf('custom_') === 0;
    },
    newId: function () {
      return 'custom_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    },

    async _boot(ownerId) {
      _ownerId = ownerId;
      try {
        var r = await sb().from('custom_foods').select('id,data').eq('owner_id', ownerId);
        if (r.error) throw r.error;
        _items = (r.data || []).map(function (row) { return row.data; }).filter(Boolean);
      } catch (e) {
        console.error('VITAL: lỗi tải món tự thêm', e);
        _items = [];
      }
    },

    load: function () { return _items.slice(); },

    save: function (food) {
      if (!food || food.id == null) return;
      var i = _items.findIndex(function (f) { return f.id === food.id; });
      if (i >= 0) _items[i] = food; else _items.push(food);
      if (readOnly()) return;
      sb().from('custom_foods').upsert({ owner_id: _ownerId, id: String(food.id), data: food })
        .then(function (r) { if (r.error) console.error('VITAL: lỗi lưu món tự thêm', r.error); });
    },

    remove: function (id) {
      _items = _items.filter(function (f) { return String(f.id) !== String(id); });
      if (readOnly()) return;
      sb().from('custom_foods').delete().eq('owner_id', _ownerId).eq('id', String(id))
        .then(function (r) { if (r.error) console.error('VITAL: lỗi xoá món tự thêm', r.error); });
    }
  };
})();
