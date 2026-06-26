(function () {
const C  = (typeof require !== 'undefined') ? require('../constants.js') : window.C;
const E1 = (typeof require !== 'undefined') ? require('./e1_body.js')    : window.E1;
const DB = (typeof require !== 'undefined') ? require('../db.js')        : window.DB;

const E4 = {
  avgIntake(logs, n) {
    const vals = logs.map(l => E1.dayCalories(l)).filter(v => v > 0).slice(-(n || 7));
    if (!vals.length) return null;
    return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
  },

  _addDays(baseDate, days) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + Math.round(days));
    return d.toISOString().slice(0, 10);
  },

  compute(profile, logs, e1, e3) {
    const today = DB.today();

    const intake = E4.avgIntake(logs, 7);

    // Dùng burn thực tế (BMR + tb kcal hoạt động đã log) thay vì TDEE công thức tĩnh
    const avgLoggedActKcal = (() => {
      const last7 = logs.slice(-7);
      if (!last7.length) return 0;
      const total = last7.reduce((s, l) => s + (l.acts || []).reduce((ss, a) => ss + (a.kcal || 0), 0), 0);
      return Math.round(total / last7.length);
    })();
    const avgActualBurn = Math.max(e1.bmr + avgLoggedActKcal, e1.tdee);
    const dailyDeficit = (intake != null) ? Math.round(avgActualBurn - intake) : null;

    let weeklyRate;
    let rateSource;
    if (e3.enough) {
      weeklyRate = e3.weeklyTrend;
      rateSource = 'measured';
    } else if (dailyDeficit != null) {
      weeklyRate = -(dailyDeficit * 7) / C.KCAL_PER_KG;
      weeklyRate = Math.round(weeklyRate * 100) / 100;
      rateSource = 'theoretical';
    } else {
      weeklyRate = 0;
      rateSource = 'none';
    }

    const current = e3.trendWeight;
    const dailyRate = weeklyRate / 7;

    const predict = (days) => Math.round((current + weeklyRate * (days / 7)) * 10) / 10;
    const predictions = {
      d30: predict(30),
      d60: predict(60),
      d90: predict(90)
    };

    const remaining = current - profile.weight_goal;
    let daysToGoal = null, goalDate = null, willReach = false;
    const movingTowardGoal = (remaining > 0 && dailyRate < 0) || (remaining < 0 && dailyRate > 0);
    if (Math.abs(remaining) < 0.05) {
      willReach = true; daysToGoal = 0; goalDate = today;
    } else if (movingTowardGoal && dailyRate !== 0) {
      daysToGoal = Math.round(Math.abs(remaining / dailyRate));
      goalDate = E4._addDays(today, daysToGoal);
      willReach = true;
    }

    const dir = (profile.weight_start - profile.weight_goal) >= 0 ? 1 : -1;
    const totalChange = Math.abs(profile.weight_start - profile.weight_goal);
    const planDailyRate = profile.deadline_days ? totalChange / profile.deadline_days : 0;
    const elapsed = DB.daysElapsed();

    let daysAheadBehind = 0;
    if (planDailyRate > 0) {
      const plannedProgress = planDailyRate * elapsed;
      const actualProgress  = (profile.weight_start - current) * dir;
      const aheadKg = actualProgress - plannedProgress;
      daysAheadBehind = Math.round(aheadKg / planDailyRate);
    }

    return {
      intake,
      dailyDeficit,
      weeklyRate,
      rateSource,
      predictions,
      willReach,
      daysToGoal,
      goalDate,
      daysAheadBehind,
      planDailyRate,
      elapsed
    };
  }
};

if (typeof window !== 'undefined') window.E4 = E4;
if (typeof module !== 'undefined' && module.exports) module.exports = E4;

})();
