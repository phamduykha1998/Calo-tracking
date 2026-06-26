(function () {
const C = (typeof require !== 'undefined') ? require('../constants.js') : window.C;

const E1 = {
  bmr(weight, height, age, gender) {
    const base = 10 * weight + 6.25 * height - 5 * age;
    return Math.round(base + (gender === 'female' ? -161 : 5));
  },

  tdee(bmr, activityLevel) {
    const a = C.ACTIVITY[activityLevel] || C.ACTIVITY.moderate;
    return Math.round(bmr * a.factor);
  },

  bodyFatNavy(profile) {
    const { waist, neck, hip, height, gender } = profile;
    if (!waist || !neck || !height) return null;
    const log = Math.log10;
    let bf;
    if (gender === 'female') {
      if (!hip) return null;
      bf = 495 / (1.29579 - 0.35004 * log(waist + hip - neck) + 0.22100 * log(height)) - 450;
    } else {
      bf = 495 / (1.0324 - 0.19077 * log(waist - neck) + 0.15456 * log(height)) - 450;
    }
    return Math.round(bf * 10) / 10;
  },

  adaptiveTDEE(logs, tdeeForClamp) {
    const valid = logs.filter(l => l.weight_morning != null);
    if (valid.length < 7) return null;

    const win = valid.slice(-14);
    if (win.length < 7) return null;

    const t0 = new Date(win[0].date + 'T00:00').getTime();
    const t1 = new Date(win[win.length - 1].date + 'T00:00').getTime();
    const daySpan = Math.max(1, Math.floor((t1 - t0) / 86400000));
    if (daySpan < 7) return null;

    const wStart = win[0].weight_morning;
    const wEnd   = win[win.length - 1].weight_morning;
    const weightDelta = wEnd - wStart;

    const intakes = win.map(l => E1.dayCalories(l)).filter(v => v > 0);
    if (intakes.length < 5) return null;
    const avgIntake = intakes.reduce((s, v) => s + v, 0) / intakes.length;

    const kcalFromBody = (weightDelta * C.KCAL_PER_KG) / daySpan;
    const tdeeReal = Math.round(avgIntake - kcalFromBody);

    if (tdeeForClamp && (tdeeReal < tdeeForClamp * 0.6 || tdeeReal > tdeeForClamp * 1.4)) return null;
    return tdeeReal;
  },

  dayCalories(log) {
    if (!log || !log.foods) return 0;
    return Math.round(log.foods.reduce((s, f) => s + f.calories * (f.qty || 1), 0));
  },

  compute(profile, logs) {
    const withW = logs.filter(l => l.weight_morning != null);
    const currentWeight = withW.length
      ? withW[withW.length - 1].weight_morning
      : profile.weight_start;

    const bmr = E1.bmr(currentWeight, profile.height, profile.age, profile.gender);
    const tdeeFormula = E1.tdee(bmr, profile.activity_level);

    const tdeeAdaptive = E1.adaptiveTDEE(logs, tdeeFormula);
    const tdee = tdeeAdaptive || tdeeFormula;

    const goal = C.GOAL[profile.goal_type] || C.GOAL.lose_fat;
    const targetKcal = Math.round(tdee + goal.deficit);

    const bodyFat = (profile.body_fat != null)
      ? profile.body_fat
      : E1.bodyFatNavy(profile);

    const proteinTarget = Math.round(currentWeight * C.PROTEIN_PER_KG);

    return {
      currentWeight,
      bmr,
      tdeeFormula,
      tdeeAdaptive,
      tdee,
      isAdaptive: !!tdeeAdaptive,
      targetKcal,
      goalDeficit: goal.deficit,
      bodyFat,
      proteinTarget
    };
  }
};

if (typeof window !== 'undefined') window.E1 = E1;
if (typeof module !== 'undefined' && module.exports) module.exports = E1;

})();
