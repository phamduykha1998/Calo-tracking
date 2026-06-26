(function () {
const C  = (typeof require !== 'undefined') ? require('../constants.js') : window.C;
const E1 = (typeof require !== 'undefined') ? require('./e1_body.js')    : window.E1;

const E6 = {
  _trailingStreak(arr, fn) {
    let n = 0;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (fn(arr[i])) n++; else break;
    }
    return n;
  },

  compute(profile, logs, e1, e3) {
    const risks = [];
    const proteinTarget = e1.proteinTarget;

    const lowProteinStreak = E6._trailingStreak(logs, l => {
      const p = (l.foods || []).reduce((s, f) => s + f.protein * (f.qty || 1), 0);
      const hasFood = (l.foods || []).length > 0;
      return hasFood && p < proteinTarget * 0.70;
    });
    if (lowProteinStreak >= 3) {
      risks.push({
        type: 'low_protein', severity: 'high',
        title: `Protein thấp ${lowProteinStreak} ngày liên tục`,
        detail: 'Nguy cơ mất cơ tăng khi đang giảm mỡ.',
        metric: { streak: lowProteinStreak, target: proteinTarget }
      });
    }

    if (e3.enough && e3.weeklyTrend < 0) {
      const lossPct = (Math.abs(e3.weeklyTrend) / e3.trendWeight) * 100;
      if (lossPct > C.MAX_LOSS_PCT) {
        risks.push({
          type: 'too_fast', severity: 'high',
          title: 'Giảm cân quá nhanh',
          detail: `Đang giảm ${lossPct.toFixed(1)}%/tuần (an toàn < ${C.MAX_LOSS_PCT}%).`,
          metric: { lossPct: Math.round(lossPct * 10) / 10 }
        });
      }
    }

    const sleepStreak = E6._trailingStreak(logs, l =>
      l.recovery && l.recovery.sleep_hours != null && l.recovery.sleep_hours < C.MIN_SLEEP_H
    );
    if (sleepStreak >= 5) {
      risks.push({
        type: 'sleep_debt', severity: 'med',
        title: `Thiếu ngủ ${sleepStreak} ngày liên tục`,
        detail: 'Thiếu ngủ làm tăng cortisol, giữ mỡ và phá vỡ phục hồi.',
        metric: { streak: sleepStreak }
      });
    }

    const surplusStreak = E6._trailingStreak(logs, l => {
      const k = E1.dayCalories(l);
      return k > 0 && (k - e1.tdee) > C.SURPLUS_ALERT;
    });
    if (surplusStreak >= 7) {
      risks.push({
        type: 'surplus', severity: 'high',
        title: `Thừa calo ${surplusStreak} ngày liên tục`,
        detail: `Vượt TDEE > ${C.SURPLUS_ALERT} kcal/ngày.`,
        metric: { streak: surplusStreak }
      });
    }

    return risks;
  }
};

if (typeof window !== 'undefined') window.E6 = E6;
if (typeof module !== 'undefined' && module.exports) module.exports = E6;

})();
