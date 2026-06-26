(function () {
const C = (typeof require !== 'undefined') ? require('../constants.js') : window.C;

const E7 = {
  _topCulprit(log) {
    if (!log || !log.foods || !log.foods.length) return null;
    let worst = null, worstScore = 0;
    for (const f of log.foods) {
      const q = f.qty || 1;
      const kcal = f.calories * q;
      const sugar = (f.sugar || 0) * q;
      const score = kcal + sugar * 4 + (f.processed ? 150 : 0);
      if (score > worstScore) { worstScore = score; worst = { f, kcal, sugar }; }
    }
    return worst;
  },

  compute(ctx) {
    const { log, e1, e2, e4, e6 } = ctx;
    const recos = [];

    const highRisk = e6.find(r => r.severity === 'high');

    if (highRisk && highRisk.type === 'low_protein') {
      const gap = Math.max(0, e1.proteinTarget - e2.totals.protein);
      recos.push({
        icon: '🥚', priority: 1,
        text: `Bù ${Math.round(gap)}g protein hôm nay`,
        why: '2 quả trứng + 1 hộp sữa chua ≈ 18g'
      });
    }

    if (e2.calorieDelta > 150) {
      const c = E7._topCulprit(log);
      if (c && (c.f.processed || c.sugar >= 20)) {
        recos.push({
          icon: '✂️', priority: 1,
          text: `Bỏ ${c.f.name}`,
          why: `Riêng món này ${Math.round(c.kcal)} kcal`
        });
      } else {
        recos.push({
          icon: '🍽️', priority: 2,
          text: `Giảm ~${e2.calorieDelta} kcal bữa tối`,
          why: 'Đang vượt mục tiêu calo'
        });
      }
    }

    if (e6.find(r => r.type === 'sleep_debt')) {
      recos.push({
        icon: '😴', priority: 2,
        text: 'Ngủ trước 23h tối nay',
        why: 'Cắt chuỗi thiếu ngủ'
      });
    }

    const steps = (log.activity && log.activity.steps) || 0;
    if (recos.length < 3 && steps < 6000) {
      recos.push({
        icon: '🚶', priority: 3,
        text: `Đi thêm ${6000 - steps} bước`,
        why: 'Tăng tiêu hao mà không cần cắt ăn'
      });
    }

    if (recos.length === 0) {
      recos.push({
        icon: '🔥', priority: 3,
        text: 'Giữ nguyên nhịp hôm nay',
        why: e4.daysAheadBehind > 0 ? `Đang nhanh hơn ${e4.daysAheadBehind} ngày` : 'Các chỉ số tốt'
      });
    }

    return recos.sort((a, b) => a.priority - b.priority).slice(0, 3);
  }
};

if (typeof window !== 'undefined') window.E7 = E7;
if (typeof module !== 'undefined' && module.exports) module.exports = E7;

})();
