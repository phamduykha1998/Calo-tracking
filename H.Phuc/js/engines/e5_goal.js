(function () {
const C = (typeof require !== 'undefined') ? require('../constants.js') : window.C;

const E5 = {
  _sigmoid(ratio) {
    const p = 1 / (1 + Math.exp(-4 * (ratio - 0.7)));
    return p;
  },

  compute(profile, e3, e4) {
    const dir = (profile.weight_start - profile.weight_goal) >= 0 ? 1 : -1;
    const current = e3.trendWeight;
    const remaining = (current - profile.weight_goal) * dir;

    if (remaining <= 0.05) {
      return { successProbability: 99, verdict: E5.verdict(e4, true), reached: true };
    }

    const daysRemaining = Math.max(1, (profile.deadline_days || 90) - e4.elapsed);
    const requiredDaily = remaining / daysRemaining;
    const actualDaily   = (-(e3.weeklyTrend) / 7) * dir;

    let prob;
    if (actualDaily <= 0) {
      prob = 8;
    } else {
      const ratio = actualDaily / requiredDaily;
      prob = Math.round(E5._sigmoid(ratio) * 100);
    }

    if (!e3.enough) prob = Math.round(prob * 0.75);

    prob = Math.max(5, Math.min(99, prob));

    return {
      successProbability: prob,
      verdict: E5.verdict(e4, false),
      reached: false,
      requiredWeeklyRate: Math.round(requiredDaily * 7 * 100) / 100,
      actualWeeklyRate: e3.weeklyTrend
    };
  },

  verdict(e4, reached) {
    if (reached) return 'Bạn đã chạm mục tiêu — giữ phong độ!';
    const d = e4.daysAheadBehind;
    if (d > 0)  return `Bạn đang nhanh hơn kế hoạch ${d} ngày`;
    if (d < 0)  return `Bạn đang chậm hơn mục tiêu ${Math.abs(d)} ngày`;
    return 'Bạn đang đúng nhịp kế hoạch';
  }
};

if (typeof window !== 'undefined') window.E5 = E5;
if (typeof module !== 'undefined' && module.exports) module.exports = E5;

})();
