(function () {
const C = (typeof require !== 'undefined') ? require('../constants.js') : window.C;

const E3 = {
  movingAverage(values, win) {
    win = win || C.MA_DAYS;
    const out = [];
    for (let i = 0; i < values.length; i++) {
      const from = Math.max(0, i - win + 1);
      const slice = values.slice(from, i + 1);
      const avg = slice.reduce((s, v) => s + v, 0) / slice.length;
      out.push(Math.round(avg * 100) / 100);
    }
    return out;
  },

  _slopePerDay(series) {
    const n = series.length;
    if (n < 2) return 0;
    let sx=0, sy=0, sxy=0, sxx=0;
    for (let i = 0; i < n; i++) {
      sx += i; sy += series[i]; sxy += i * series[i]; sxx += i * i;
    }
    const denom = n * sxx - sx * sx;
    if (denom === 0) return 0;
    return (n * sxy - sx * sy) / denom;
  },

  compute(profile, logs) {
    const withW = logs.filter(l => l.weight_morning != null);
    const weights = withW.map(l => l.weight_morning);
    const dataDays = weights.length;

    if (dataDays === 0) {
      return {
        dataDays: 0,
        trendWeight: profile.weight_start,
        weeklyTrend: 0,
        progressPercent: 0,
        maSeries: [],
        enough: false
      };
    }

    const maSeries = E3.movingAverage(weights, C.MA_DAYS);
    const trendWeight = maSeries[maSeries.length - 1];

    const recent = maSeries.slice(-14);
    const slopeDay = E3._slopePerDay(recent);
    const weeklyTrend = Math.round(slopeDay * 7 * 100) / 100;

    const totalChange = profile.weight_start - profile.weight_goal;
    let progressPercent = 0;
    if (totalChange !== 0) {
      const done = profile.weight_start - trendWeight;
      progressPercent = Math.round((done / totalChange) * 100);
    }
    progressPercent = Math.max(0, Math.min(100, progressPercent));

    return {
      dataDays,
      trendWeight,
      weeklyTrend,
      slopeDay,
      progressPercent,
      maSeries,
      enough: dataDays >= C.MA_DAYS
    };
  }
};

if (typeof window !== 'undefined') window.E3 = E3;
if (typeof module !== 'undefined' && module.exports) module.exports = E3;

})();
