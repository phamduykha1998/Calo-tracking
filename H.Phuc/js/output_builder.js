(function () {
const _req = (typeof require !== 'undefined');
const C  = _req ? require('./constants.js')          : window.C;
const DB = _req ? require('./db.js')                 : window.DB;
const E1 = _req ? require('./engines/e1_body.js')    : window.E1;
const E2 = _req ? require('./engines/e2_nutrition.js'): window.E2;
const E3 = _req ? require('./engines/e3_progress.js'): window.E3;
const E4 = _req ? require('./engines/e4_prediction.js'): window.E4;
const E5 = _req ? require('./engines/e5_goal.js')    : window.E5;
const E6 = _req ? require('./engines/e6_risk.js')    : window.E6;
const E7 = _req ? require('./engines/e7_reco.js')    : window.E7;

const OutputBuilder = {
  build() {
    const profile = DB.getProfile();
    if (!profile) return { error: 'NO_PROFILE' };

    const logs = DB.getLogs();
    const today = DB.getTodayLog();

    const e1 = E1.compute(profile, logs);
    const e2 = E2.compute(today, { targetKcal: e1.targetKcal, proteinTarget: e1.proteinTarget });
    const e3 = E3.compute(profile, logs);
    const e4 = E4.compute(profile, logs, e1, e3);
    const e5 = E5.compute(profile, e3, e4);
    const e6 = E6.compute(profile, logs, e1, e3);
    const e7 = E7.compute({ log: today, e1, e2, e4, e6 });

    const status = {
      calories: e2.calorieCompliance >= 90 ? 'ok' : (e2.calorieDelta > 0 ? 'over' : 'under'),
      protein:  e2.proteinScore >= 90 ? 'ok' : 'low',
      activity: ((today.activity && today.activity.steps) || 0) >= 6000 ? 'ok' : 'low',
      sleep:    (today.recovery && today.recovery.sleep_hours >= 7) ? 'ok' : 'low'
    };

    const out = {
      generatedAt: new Date().toISOString(),
      profile: { name: profile.name, goalLabel: (C.GOAL[profile.goal_type] || {}).label },

      verdict: e5.verdict,
      daysAheadBehind: e4.daysAheadBehind,

      weightStart: profile.weight_start,
      weightGoal:  profile.weight_goal,
      currentWeight: e1.currentWeight,
      trendWeight: e3.trendWeight,
      remainingKg: Math.round(Math.abs(e3.trendWeight - profile.weight_goal) * 10) / 10,
      progressPercent: e3.progressPercent,

      targetKcal: e1.targetKcal,
      todayTotals: e2.totals,
      calorieCompliance: e2.calorieCompliance,
      proteinScore: e2.proteinScore,
      proteinTarget: e1.proteinTarget,
      qualityScore: e2.qualityScore,
      status,

      bmr: e1.bmr,
      tdee: e1.tdee,
      tdeeIsAdaptive: e1.isAdaptive,
      bodyFat: e1.bodyFat,

      weeklyTrend: e3.weeklyTrend,
      rateSource: e4.rateSource,
      predictions: e4.predictions,
      willReach: e4.willReach,
      daysToGoal: e4.daysToGoal,
      goalDate: e4.goalDate,

      successProbability: e5.successProbability,

      risks: e6,
      recommendations: e7,

      dataDays: e3.dataDays,
      confident: e3.enough,

      elapsed: e4.elapsed,
      deadline: profile.deadline_days
    };

    DB.saveSnap({
      date: DB.today(),
      verdict: out.verdict,
      trendWeight: out.trendWeight,
      successProbability: out.successProbability,
      predictions: out.predictions,
      risks: out.risks,
      recommendations: out.recommendations
    });

    return out;
  }
};

if (typeof window !== 'undefined') window.OutputBuilder = OutputBuilder;
if (typeof module !== 'undefined' && module.exports) module.exports = OutputBuilder;

})();
