(function () {
const C = (typeof require !== 'undefined') ? require('../constants.js') : window.C;

const E2 = {
  totals(log) {
    const t = { kcal:0, protein:0, carb:0, fat:0, fiber:0, sugar:0, processedKcal:0 };
    if (!log || !log.foods) return t;
    for (const f of log.foods) {
      const q = f.qty || 1;
      t.kcal    += f.calories * q;
      t.protein += f.protein  * q;
      t.carb    += f.carb     * q;
      t.fat     += f.fat      * q;
      t.fiber   += (f.fiber || 0) * q;
      t.sugar   += (f.sugar || 0) * q;
      if (f.processed) t.processedKcal += f.calories * q;
    }
    for (const k in t) t[k] = Math.round(t[k] * 10) / 10;
    return t;
  },

  calorieCompliance(actualKcal, targetKcal) {
    if (!targetKcal) return 0;
    const pct = 1 - Math.abs(actualKcal - targetKcal) / targetKcal;
    return Math.max(0, Math.round(pct * 100));
  },

  proteinScore(actualProtein, proteinTarget) {
    if (!proteinTarget) return 0;
    return Math.min(100, Math.round((actualProtein / proteinTarget) * 100));
  },

  qualityScore(t) {
    if (t.kcal <= 0) return 0;

    const proteinPer1k = (t.protein / t.kcal) * 1000;
    const fiberPer1k   = (t.fiber   / t.kcal) * 1000;
    const sugarPer1k   = (t.sugar   / t.kcal) * 1000;
    const procRatio    = t.processedKcal / t.kcal;

    const sProtein = Math.min(1, proteinPer1k / 80);
    const sFiber   = Math.min(1, fiberPer1k / 14);
    const sSugar   = 1 - Math.min(1, sugarPer1k / 50);
    const sProc    = 1 - procRatio;

    const score = 100 * (0.35*sProtein + 0.20*sFiber + 0.25*sSugar + 0.20*sProc);
    return Math.round(score);
  },

  compute(log, ctx) {
    const t = E2.totals(log);
    return {
      totals: t,
      calorieCompliance: E2.calorieCompliance(t.kcal, ctx.targetKcal),
      proteinScore:      E2.proteinScore(t.protein, ctx.proteinTarget),
      qualityScore:      E2.qualityScore(t),
      calorieDelta:      Math.round(t.kcal - ctx.targetKcal),
      proteinDelta:      Math.round(t.protein - ctx.proteinTarget)
    };
  }
};

if (typeof window !== 'undefined') window.E2 = E2;
if (typeof module !== 'undefined' && module.exports) module.exports = E2;

})();
