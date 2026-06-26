const C = {
  KCAL_PER_KG: 7700,
  PROTEIN_PER_KG: 1.8,
  MIN_SLEEP_H: 6,
  SURPLUS_ALERT: 300,
  MA_DAYS: 7,
  MAX_LOSS_PCT: 1.0,

  ACTIVITY: {
    sedentary:   { label: 'Ít vận động',         factor: 1.20 },
    light:       { label: 'Vận động nhẹ',       factor: 1.375 },
    moderate:    { label: 'Vận động trung bình',factor: 1.55 },
    active:      { label: 'Vận động cao',       factor: 1.725 },
    very_active: { label: 'Vận động rất cao',   factor: 1.90 }
  },

  GOAL: {
    lose_fat:    { label: 'Giảm mỡ',    deficit: -500 },
    lose_weight: { label: 'Giảm cân',   deficit: -600 },
    gain_muscle: { label: 'Tăng cơ',    deficit: +300 },
    recomp:      { label: 'Recomposition', deficit: 0 },
    maintain:    { label: 'Duy trì',    deficit: 0 }
  },

  DEADLINE: [30, 60, 90, 180],

  STORAGE: {
    PROFILE:   'vt_profile',
    LOGS:      'vt_logs',
    SNAPS:     'vt_snaps'
  }
};

if (typeof window !== 'undefined') window.C = C;
if (typeof module !== 'undefined' && module.exports) module.exports = C;
