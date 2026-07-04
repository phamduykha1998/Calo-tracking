/* ===== VITAL app — nối UI với Engine 1..7 ===== */
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtK = n => Math.round(n).toLocaleString('en-US');
const MEALS = ['Sáng', 'Trưa', 'Tối', 'Phụ'];

let PROFILE = null, LOG = null, OUT = null, E3X = null;

/* ===== HABIT FLAME — Ngọn lửa thói quen =====
   Input: số ngày streak liên tục. Tiến hóa Xám (#787878, 0 ngày) → Tím phát quang (#B450FF, 200 ngày).
   progress = min(streak/200, 1); màu = nội suy tuyến tính; sáng = 50%+p*50%; glow theo mốc. */
const FLAME_GRAY = [120, 120, 120];     // #787878
const FLAME_PURPLE = [180, 80, 255];    // #B450FF
const FLAME_MAX = 200;
const FLAME_TIERS = [
  { d: 0, label: 'Xám' }, { d: 3, label: 'Xám sáng' }, { d: 10, label: 'Tím nhạt' },
  { d: 20, label: 'Tím nhạt hơn' }, { d: 30, label: 'Tím' }, { d: 50, label: 'Tím đậm' },
  { d: 75, label: 'Tím phát sáng nhẹ' }, { d: 100, label: 'Tím phát sáng' },
  { d: 150, label: 'Tím phát sáng mạnh' }, { d: 200, label: 'Tím phát quang cực đại' }
];
const FLAME_MS = FLAME_TIERS.map(t => t.d).filter(d => d > 0); // mốc tiến hóa: 3,10,20,...,200
const FLAME_PATH = 'M12 3c2 3 4 4.5 4 8a4 4 0 01-8 0c0-2 1-3 1-4-2 1.5-3 3.5-3 6a6 6 0 0012 0c0-5-4-7-6-10z';

function flameColor(streak) {
  const p = Math.min(Math.max(streak, 0) / FLAME_MAX, 1);
  const r = Math.round(FLAME_GRAY[0] + p * (FLAME_PURPLE[0] - FLAME_GRAY[0]));
  const g = Math.round(FLAME_GRAY[1] + p * (FLAME_PURPLE[1] - FLAME_GRAY[1]));
  const b = Math.round(FLAME_GRAY[2] + p * (FLAME_PURPLE[2] - FLAME_GRAY[2]));
  return { p, rgb: `rgb(${r},${g},${b})`, brightness: Math.round(50 + p * 50) };
}
function flameGlow(streak) {
  if (streak < 30) return { blur: 0, opacity: 0, pulse: false };          // 0–30: không glow
  if (streak < 100) return { blur: 10, opacity: 0.20, pulse: false };      // 30–100: glow nhẹ
  if (streak < 200) { const t = (streak - 100) / 100; return { blur: 20 + t * 20, opacity: 0.30 + t * 0.40, pulse: false }; } // 100–200: mạnh dần
  return { blur: 50, opacity: 1, pulse: true };                            // 200: aura + pulse
}
function flameTier(streak) {
  let t = FLAME_TIERS[0];
  for (const x of FLAME_TIERS) if (streak >= x.d) t = x;
  return t;
}
function flameIcStyle(streak) {
  const fg = flameGlow(streak);
  if (fg.blur === 0) return '';
  return `filter:drop-shadow(0 0 ${fg.blur.toFixed(0)}px rgba(180,80,255,${fg.opacity.toFixed(2)}))`;
}

function isoAddDays(iso, n) {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function fmtDM(iso) {
  if (!iso) return '—';
  const d = new Date(iso.slice(0, 10) + 'T00:00:00');
  return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0');
}
function daysBetween(a, b) { return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000); }

function toast(m) {
  const t = $('toast');
  t.textContent = m; t.classList.add('show');
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 1800);
}

/* ---------- vòng đời ---------- */
function ro() { return !!window.VITAL_READONLY; }

function refresh() {
  PROFILE = DB.getProfile();
  // Hồ sơ do trigger đăng ký tạo sẵn CHỈ có tên + giới tính — chưa có cân
  // nặng/mục tiêu thì vẫn phải qua màn nhập thông tin lần đầu (nếu không,
  // render sẽ crash vì thiếu số → màn hình trống).
  var incomplete = !PROFILE || PROFILE.weight_start == null || PROFILE.weight_goal == null;
  if (incomplete) {
    if (ro()) { $('ob').style.display = 'none'; $('p1').innerHTML = '<div style="padding:60px 20px;text-align:center;color:var(--t3)">Đối tác chưa có dữ liệu.</div>'; $('p2').innerHTML = ''; return; }
    if (PROFILE && PROFILE.name) { var nEl = $('obName'); if (nEl) nEl.value = PROFILE.name; }
    $('ob').style.display = 'flex'; return;
  }
  $('ob').style.display = 'none';
  LOG = DB.getTodayLog();
  OUT = OutputBuilder.build();
  E3X = E3.compute(PROFILE, DB.getLogs());
  renderP1();
  renderP2();
  checkFlameMilestone(calcStreak());
}

function persist() { DB.upsertLog(LOG); }
function actBurnToday() { return (LOG.acts || []).reduce((s, a) => s + (a.kcal || 0), 0); }
function todayMins() { return (LOG.acts || []).reduce((s, a) => s + (a.minutes || 0), 0); }

function macroTargets() {
  const tk = OUT.targetKcal, pt = OUT.proteinTarget;
  const ft = Math.round(tk * 0.30 / 9);
  const ct = Math.max(0, Math.round((tk - pt * 4 - ft * 9) / 4));
  return { pt, ft, ct };
}

function calcStreak() {
  const set = new Set(DB.getLogs().filter(l => l.foods && l.foods.length).map(l => l.date));
  let d = DB.today(), n = 0;
  if (!set.has(d)) d = isoAddDays(d, -1);
  while (set.has(d)) { n++; d = isoAddDays(d, -1); }
  return n;
}

function unitLabel(f) {
  return f.unit === 'g' ? Math.round((f.serving || 100) * (f.qty || 1)) + 'g' : (f.qty || 1) + ' ' + f.unit;
}
function ring(p, r, color, sw, size) {
  const dash = 2 * Math.PI * r;
  const off = dash * (1 - Math.min(1, Math.max(0, p)));
  const c = size / 2;
  return `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="${sw}"/>
    <circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-dasharray="${dash.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" stroke-linecap="round" transform="rotate(-90 ${c} ${c})"/>`;
}

/* ---------- biểu đồ ---------- */
function projSvg() {
  const ddl = PROFILE.deadline_days || 90, ws = PROFILE.weight_start, wg = PROFILE.weight_goal;
  const logsW = DB.getLogs().filter(l => l.weight_morning != null);
  const ma = E3X.maSeries;
  const actual = logsW.map((l, i) => ({
    x: Math.min(ddl, Math.max(0, daysBetween(PROFILE.start_date, l.date))),
    y: ma[i]
  }));
  let lo = Math.min(wg, ws), hi = Math.max(wg, ws);
  actual.forEach(p => { lo = Math.min(lo, p.y); hi = Math.max(hi, p.y); });
  lo -= 0.3; hi += 0.3;
  const W = 300, H = 56, pad = 4;
  const X = d => pad + (d / ddl) * (W - 2 * pad);
  const Y = v => pad + (1 - (v - lo) / (hi - lo)) * (H - 2 * pad);

  const planPts = `${X(0)},${Y(ws)} ${X(ddl)},${Y(wg)}`;
  const actPts = actual.map(p => `${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join(' ');

  let projPts = '', endDot = '';
  if (actual.length) {
    const lp = actual[actual.length - 1];
    const dr = OUT.weeklyTrend / 7;
    if (dr !== 0 && lp.x < ddl) {
      let px = ddl, py = lp.y + dr * (ddl - lp.x);
      const losing = ws >= wg;
      if (losing && py < wg) { px = lp.x + (lp.y - wg) / -dr; py = wg; }
      if (!losing && py > wg) { px = lp.x + (wg - lp.y) / dr; py = wg; }
      px = Math.min(ddl, px);
      py = Math.max(lo, Math.min(hi, py));
      projPts = `${X(lp.x).toFixed(1)},${Y(lp.y).toFixed(1)} ${X(px).toFixed(1)},${Y(py).toFixed(1)}`;
    }
    endDot = `<circle cx="${X(lp.x).toFixed(1)}" cy="${Y(lp.y).toFixed(1)}" r="3" fill="#06101D" stroke="#38EF7D" stroke-width="2"/>`;
  }
  return `<polyline points="${planPts}" fill="none" stroke="#3A567A" stroke-width="1.4" stroke-dasharray="3 3"/>` +
    (projPts ? `<polyline points="${projPts}" fill="none" stroke="rgba(0,212,255,.65)" stroke-width="1.4" stroke-dasharray="2 4"/>` : '') +
    (actual.length >= 2 ? `<polyline points="${actPts}" fill="none" stroke="#38EF7D" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>` : '') +
    endDot +
    `<circle cx="${X(ddl)}" cy="${Y(wg)}" r="2.4" fill="#00D4FF"/>`;
}

function last7Intakes() {
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const l = DB.getLog(isoAddDays(DB.today(), -i));
    out.push(l ? E1.dayCalories(l) : 0);
  }
  return out;
}
function sparkSvg(vals) {
  const max = Math.max(1, ...vals);
  const pts = vals.map((v, i) => `${(i * 100 / (vals.length - 1)).toFixed(1)},${(42 - (v / max) * 36).toFixed(1)}`);
  const last = pts[pts.length - 1].split(',');
  return `<polyline points="${pts.join(' ')}" fill="none" stroke="#3B82F6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="0,44 ${pts.join(' ')} 100,44" fill="rgba(59,130,246,.12)" stroke="none"/>
    <circle cx="${last[0]}" cy="${last[1]}" r="2.6" fill="#00D4FF"/>`;
}

/* ---------- celebration ngọn lửa khi đạt mốc ---------- */
function celebrateFlame(days) {
  const fc = flameColor(days), tier = flameTier(days);
  const el = $('flameCele');
  if (!el) return;
  el.style.setProperty('--flame', fc.rgb);
  el.querySelector('.fc-flame path').style.fill = fc.rgb;
  const d = el.querySelector('.fc-days'); d.textContent = days; d.style.color = fc.rgb;
  const t = el.querySelector('.fc-tier'); t.textContent = tier.label; t.style.color = fc.rgb;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2800);
}
function closeCele() { const el = $('flameCele'); if (el) { clearTimeout(el._t); el.classList.remove('show'); } }

function checkFlameMilestone(streak) {
  const seen = parseInt(localStorage.getItem('vt_flame_seen') || '0', 10);
  let reached = 0;
  for (const m of FLAME_MS) if (streak >= m) reached = m;
  if (reached > seen) {
    localStorage.setItem('vt_flame_seen', reached);
    celebrateFlame(reached);
  } else if (reached < seen) {
    localStorage.setItem('vt_flame_seen', reached); // streak reset → cho phép ăn mừng lại
  }
}

/* ---------- Engine 7 phụ trợ: nguồn ảnh hưởng lớn nhất ---------- */
function culpritsHtml() {
  const rows = (LOG.foods || []).map(f => {
    const q = f.qty || 1, k = f.calories * q, s = (f.sugar || 0) * q;
    return { n: f.name, k, score: k * (f.processed ? 1.3 : 1) + s * 4, bad: !!f.processed || s >= 15 || k >= 500 };
  }).filter(x => x.bad).sort((a, b) => b.score - a.score).slice(0, 4);
  if (!rows.length) return '';
  const top = rows[0].score;
  return `<div class="culp"><div class="culp-l">Nguồn ảnh hưởng lớn nhất hôm nay</div>` +
    rows.map(r => `<div class="cu"><span class="cu-n">${esc(r.n)}</span><span class="cu-b"><i style="width:${Math.round(r.score / top * 100)}%"></i></span><span class="cu-v">${fmtK(r.k)} kcal</span></div>`).join('') +
    `</div>`;
}

/* ---------- PAGE 1 ---------- */
function renderP1() {
  const o = OUT, t = o.todayTotals;
  const burn = o.bmr + actBurnToday();
  const remain = Math.max(0, o.targetKcal - t.kcal);
  const bal = Math.round(burn - t.kcal);
  const mt = macroTargets();
  const wd = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][new Date().getDay()];
  const dnow = new Date();
  const dateStr = wd + ', ' + String(dnow.getDate()).padStart(2, '0') + '/' + String(dnow.getMonth() + 1).padStart(2, '0') + '/' + dnow.getFullYear();
  const streak = calcStreak();
  const fc = flameColor(streak);
  const fg = flameGlow(streak);

  // KPI hạn chót
  const dlDate = isoAddDays(PROFILE.start_date, PROFILE.deadline_days || 90);
  let etaTxt = 'Chưa đủ dữ liệu chiều hướng', etaCls = '', etaSub = '';
  if (o.willReach && o.goalDate) {
    etaTxt = `Dự kiến đạt <b>${fmtDM(o.goalDate)}</b> · ${o.daysToGoal} ngày nữa`;
    if (o.dataDays >= 3) {
      const diff = daysBetween(o.goalDate.slice(0, 10), dlDate);
      etaSub = diff >= 0 ? `↑ sớm hơn hạn ${diff} ngày` : `↓ trễ hạn ${-diff} ngày`;
      etaCls = diff >= 0 ? '' : 'bad';
    } else {
      etaSub = 'cân mỗi sáng để chính xác hóa dự báo';
    }
  } else if (o.dataDays >= 3) {
    etaTxt = 'Chiều hướng hiện tại <b>chưa tiến về mục tiêu</b>';
    etaSub = '↓ cần tăng thâm hụt calo'; etaCls = 'bad';
  }

  const planWeekly = Math.abs(PROFILE.weight_start - PROFILE.weight_goal) / ((PROFILE.deadline_days || 90) / 7);
  const actWeekly = Math.abs(o.weeklyTrend);
  const paceMax = Math.max(planWeekly, actWeekly, 0.01);
  const sign = PROFILE.weight_start >= PROFILE.weight_goal ? '−' : '+';

  const daysRemain = Math.max(1, (PROFILE.deadline_days || 90) - o.elapsed);
  const reqWeekly = (o.remainingKg / daysRemain) * 7;

  const probKnown = o.dataDays >= 3;
  const probC = !probKnown ? 'var(--t4)' : o.successProbability >= 70 ? 'var(--gr)' : o.successProbability >= 40 ? 'var(--am)' : 'var(--rd)';
  const preds = [['30 ngày', o.predictions.d30], ['60 ngày', o.predictions.d60], ['90 ngày', o.predictions.d90]];
  const goalLabel = (C.GOAL[PROFILE.goal_type] || {}).label || 'Mục tiêu';

  const risksHtml = (o.risks || []).length
    ? o.risks.map(r => `<div class="w ${r.severity === 'high' ? 'bad' : 'amb'}" style="font-size:11px"><span><b>${esc(r.title)}</b> · ${esc(r.detail)}</span></div>`).join('')
    : '<div class="w good" style="font-size:11px">Không phát hiện rủi ro nào — giữ phong độ 🔥</div>';

  const recoHtml = (o.recommendations || []).map(r =>
    `<div class="reco-row"><span class="reco-ic">${r.icon}</span><div><div class="reco-t">${esc(r.text)}</div><div class="reco-w">${esc(r.why)}</div></div></div>`).join('');

  const verdictSub = probKnown
    ? `Engine 5 · Xác suất đạt mục tiêu ${o.successProbability}% · còn ${fmtK(remain)} kcal trước mục tiêu nạp`
    : `Còn ${fmtK(remain)} kcal trước mục tiêu nạp · cân mỗi sáng để mở khóa dự báo`;
  const balTxt = bal >= 0
    ? `Đốt nhiều hơn nạp <em>+${fmtK(bal)} kcal</em> — đúng hướng ${goalLabel.toLowerCase()}.`
    : `Nạp vượt đốt <em class="bad">+${fmtK(-bal)} kcal</em> — cần siết lại hôm nay.`;

  const spark = last7Intakes();
  const sparkAvg = (() => { const v = spark.filter(x => x > 0); return v.length ? Math.round(v.reduce((s, x) => s + x, 0) / v.length) : 0; })();

  $('p1').innerHTML = `
    <div class="hd">
      <div><div class="date">${dateStr}</div><div class="name" style="--flame:${fc.rgb}">Chào, <b style="color:var(--flame)">${esc(PROFILE.name || 'bạn')}</b></div></div>
      <div class="streak ${fg.pulse ? 'pulse' : ''}" style="--flame:${fc.rgb}" title="${esc(flameTier(streak).label)} · ${streak}/${FLAME_MAX} ngày">
        <svg class="flame-ic" viewBox="0 0 24 24" style="${flameIcStyle(streak)}"><path d="${FLAME_PATH}"/></svg>${streak} ngày
      </div>
    </div>

    <div class="verdict">
      <div class="vt">${esc(o.verdict)}. ${balTxt}</div>
      <div class="vs">${verdictSub}</div>
    </div>

    <div class="card ring-block">
      <div class="ring-rel">
        <svg width="86" height="86" viewBox="0 0 86 86">
          ${ring(t.kcal / Math.max(1, o.targetKcal), 35, '#00D4FF', 8, 86)}
          ${ring(burn / Math.max(1, o.tdee), 25, '#38EF7D', 6, 86)}
        </svg>
        <div class="ring-mid"><div class="big">${fmtK(remain)}</div></div>
      </div>
      <div class="ring-stats">
        <div><div class="rs"><span class="rs-l">Nạp vào</span><span class="rs-v" style="color:var(--cy)">${fmtK(t.kcal)}</span></div><div class="barline"><i style="width:${Math.min(100, Math.round(t.kcal / Math.max(1, o.targetKcal) * 100))}%;background:var(--cy)"></i></div></div>
        <div><div class="rs"><span class="rs-l">Đốt cháy</span><span class="rs-v" style="color:var(--gr)">${fmtK(burn)}</span></div><div class="barline"><i style="width:${Math.min(100, Math.round(burn / Math.max(1, o.tdee) * 100))}%;background:var(--gr)"></i></div></div>
        <div class="rs"><span class="rs-l">Mục tiêu nạp</span><span class="rs-v" style="color:var(--t2)">${fmtK(o.targetKcal)}</span></div>
        <div class="rs"><span class="rs-l">BMR ${o.tdeeIsAdaptive ? '· TDEE thực đo' : ''}</span><span class="rs-v" style="color:var(--t3)">${fmtK(o.bmr)}</span></div>
      </div>
    </div>

    <div class="mac-row">
      <div class="mac"><div class="mac-l">Protein</div><div class="mac-v" style="color:var(--cy)">${Math.round(t.protein)}<s>g</s></div><div class="mac-b"><div class="mac-bf" style="width:${Math.min(100, Math.round(t.protein / mt.pt * 100))}%;background:var(--cy)"></div></div><div class="mac-tgt">/ ${mt.pt}g</div></div>
      <div class="mac"><div class="mac-l">Chất béo</div><div class="mac-v" style="color:var(--am)">${Math.round(t.fat)}<s>g</s></div><div class="mac-b"><div class="mac-bf" style="width:${Math.min(100, Math.round(t.fat / Math.max(1, mt.ft) * 100))}%;background:var(--am)"></div></div><div class="mac-tgt">/ ${mt.ft}g</div></div>
      <div class="mac"><div class="mac-l">Carb</div><div class="mac-v" style="color:var(--gr)">${Math.round(t.carb)}<s>g</s></div><div class="mac-b"><div class="mac-bf" style="width:${Math.min(100, Math.round(t.carb / Math.max(1, mt.ct) * 100))}%;background:var(--gr)"></div></div><div class="mac-tgt">/ ${mt.ct}g</div></div>
    </div>

    <!-- MỤC TIÊU -->
    <div class="goal">
      <div class="goal-hd">
        <div class="gt"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/></svg>Mục tiêu</div>
        <span class="goal-tag">${esc(goalLabel)} · ${PROFILE.deadline_days || 90} ngày</span>
      </div>
      <div class="goal-wt">
        <span class="goal-cur">${o.trendWeight.toFixed(1)}<s>kg</s></span>
        <span class="goal-arrow">→</span>
        <span class="goal-tgt">${PROFILE.weight_goal.toFixed(1)} kg</span>
        <span class="goal-rem">còn ${o.remainingKg.toFixed(1)} kg</span>
      </div>
      <div class="goal-prog"><i style="width:${o.progressPercent}%"></i></div>
      <div class="goal-prog-l"><span>Bắt đầu ${PROFILE.weight_start.toFixed(1)}</span><span>${o.progressPercent}% chặng đường</span><span>Đích ${PROFILE.weight_goal.toFixed(1)}</span></div>

      <div class="pace">
        <div class="pr you"><span class="pk">Thực tế</span><span class="pb"><i style="width:${Math.round(actWeekly / paceMax * 100)}%"></i></span><span class="pv" style="color:var(--gr)">${o.weeklyTrend ? (o.weeklyTrend > 0 ? '+' : '−') + Math.abs(o.weeklyTrend).toFixed(2) : '0.00'} kg/t</span></div>
        <div class="pr plan"><span class="pk">Kế hoạch</span><span class="pb"><i style="width:${Math.round(planWeekly / paceMax * 100)}%"></i></span><span class="pv" style="color:var(--t3)">${sign}${planWeekly.toFixed(2)} kg/t</span></div>
      </div>

      <div class="proj">
        <svg class="proj-svg" viewBox="0 0 300 56" preserveAspectRatio="none">${projSvg()}</svg>
        <div class="proj-eta">
          <div class="e1">${etaTxt}</div>
          <div class="e2 ${etaCls}">${etaSub}</div>
        </div>
      </div>
    </div>

    <!-- KPI / DỰ BÁO -->
    <div class="card kpi">
      <div class="kpi-hd"><svg viewBox="0 0 24 24"><path d="M3 17l5-5 4 3 6-7 3 3"/><path d="M3 21h18"/></svg>Dự báo · Engine 4</div>
      <div class="preds">
        ${preds.map(p => `<div class="pred"><div class="pd">${p[0]}</div><div class="pw">${p[1] != null ? p[1].toFixed(1) : '—'}<s>kg</s></div><div class="px">${p[1] != null ? 'Δ ' + (p[1] - o.trendWeight > 0 ? '+' : '') + (p[1] - o.trendWeight).toFixed(1) : ''}</div></div>`).join('')}
      </div>
      <div class="prob-row">
        <div class="prob-don">
          <svg width="62" height="62" viewBox="0 0 62 62">${ring(probKnown ? o.successProbability / 100 : 0, 25, probC, 7, 62)}</svg>
          <div class="dl"><div class="dv" style="color:${probKnown ? probC : 'var(--t3)'}">${probKnown ? o.successProbability + '%' : '—'}</div><div class="du">đạt</div></div>
        </div>
        <div class="prob-info">
          <div class="prob-t">Khả năng đạt mục tiêu</div>
          <div class="prob-s">${probKnown
            ? `Cần <b>${sign}${Math.abs(reqWeekly).toFixed(2)} kg/tuần</b> trong ${daysRemain} ngày còn lại · hiện tại ${o.weeklyTrend > 0 ? '+' : '−'}${Math.abs(o.weeklyTrend).toFixed(2)} kg/tuần${o.confident ? '' : ' · cần thêm dữ liệu cân'}`
            : `Cân mỗi sáng và ghi nhật ký — sau <b>3 ngày</b> hệ thống bắt đầu tính xác suất, sau <b>7 ngày</b> dự báo chuẩn.`}</div>
        </div>
      </div>
    </div>

    <!-- RỦI RO -->
    <div class="card" style="padding:13px 14px">
      <div class="kpi-hd" style="color:var(--rd)"><svg viewBox="0 0 24 24" style="stroke:var(--rd)"><path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18.5v.5"/></svg>Rủi ro · Engine 6</div>
      ${risksHtml}
    </div>

    <!-- KHUYẾN NGHỊ -->
    <div class="card" style="padding:13px 14px">
      <div class="kpi-hd" style="color:var(--gr)"><svg viewBox="0 0 24 24" style="stroke:var(--gr)"><path d="M9 18h6M10 21h4M12 3a6 6 0 014 10.5c-.8.7-1 1.5-1 2.5h-6c0-1-.2-1.8-1-2.5A6 6 0 0112 3z"/></svg>Hành động hôm nay · Engine 7</div>
      ${recoHtml}
      ${culpritsHtml()}
    </div>

    <div class="sec-h">Phân tích nhanh</div>
    <div class="charts">
      <div class="cbox">
        <div class="cbox-l">Nạp vs Đốt</div>
        <div class="mbw">
          <div class="mb"><span class="mb-k" style="color:var(--cy)">Nạp</span><div class="mb-t"><div class="mb-f" style="width:${Math.min(100, Math.round(t.kcal / Math.max(1, o.tdee) * 100))}%;background:var(--cy)"></div></div><span class="mb-v" style="color:var(--cy)">${Math.round(t.kcal)}</span></div>
          <div class="mb"><span class="mb-k" style="color:var(--gr)">Đốt</span><div class="mb-t"><div class="mb-f" style="width:${Math.min(100, Math.round(burn / Math.max(1, o.tdee) * 100))}%;background:var(--gr)"></div></div><span class="mb-v" style="color:var(--gr)">${fmtK(burn)}</span></div>
          <div class="mb"><span class="mb-k" style="color:var(--t3)">MT</span><div class="mb-t"><div class="mb-f" style="width:100%;background:var(--s3)"></div></div><span class="mb-v" style="color:var(--t3)">${fmtK(o.targetKcal)}</span></div>
        </div>
        <div class="cnote" style="color:${bal >= 0 ? 'var(--gr)' : 'var(--rd)'}">${bal >= 0 ? '+' : '−'}${fmtK(Math.abs(bal))} ${bal >= 0 ? 'thặng dư đốt' : 'vượt nạp'}</div>
      </div>
      <div class="cbox">
        <div class="cbox-l">7 ngày · kcal</div>
        <svg width="100%" height="44" viewBox="0 0 100 44" preserveAspectRatio="none">${sparkSvg(spark)}</svg>
        <div class="cnote">TB ${fmtK(sparkAvg)}/ngày</div>
      </div>
      <div class="cbox">
        <div class="cbox-l">Chất lượng ăn</div>
        <div class="donut">
          <svg width="50" height="50" viewBox="0 0 50 50">${ring(o.qualityScore / 100, 19, o.qualityScore >= 60 ? '#38EF7D' : '#FFB547', 7, 50)}</svg>
          <div class="dl"><div class="dv" style="color:${o.qualityScore >= 60 ? 'var(--gr)' : 'var(--am)'}">${o.qualityScore}</div><div class="du">/100</div></div>
        </div>
        <div class="dleg"><span style="color:var(--gr)">●Engine 2</span></div>
      </div>
    </div>`;
}

/* ---------- PAGE 2 ---------- */
function foodWarns(t) {
  const ws = [];
  const pGap = Math.round(OUT.proteinTarget - t.protein);
  if (t.kcal === 0) { ws.push(['amb', 'Chưa ghi món nào hôm nay — bấm để thêm']); return ws; }
  if (pGap > 0) ws.push([pGap > OUT.proteinTarget * 0.3 ? 'bad' : 'amb', `Protein thiếu ${pGap}g so với mục tiêu ${OUT.proteinTarget}g`]);
  else ws.push(['good', 'Đủ protein hôm nay']);
  if (t.sugar >= 50) ws.push(['bad', `Đường cao: ${Math.round(t.sugar)}g (nên < 50g)`]);
  if (t.processedKcal / Math.max(1, t.kcal) > 0.35) ws.push(['bad', `Đồ chế biến sẵn chiếm ${Math.round(t.processedKcal / t.kcal * 100)}% calo`]);
  if (t.fiber >= 18) ws.push(['good', `Chất xơ tốt: ${Math.round(t.fiber)}g`]);
  else if (t.kcal > 800) ws.push(['amb', `Chất xơ thấp: ${Math.round(t.fiber)}g (nên ≥ 18g)`]);
  const over = Math.round(t.kcal - OUT.targetKcal);
  if (over > 150) ws.push(['bad', `Vượt mục tiêu nạp ${fmtK(over)} kcal`]);
  const hasDinner = (LOG.foods || []).some(f => f.meal === 'Tối');
  const remain = Math.max(0, OUT.targetKcal - t.kcal);
  if (!hasDinner && remain > 0) ws.push(['amb', `Chưa có bữa tối — còn ${fmtK(remain)} kcal`]);
  return ws;
}

function burnNotes(bal) {
  const ws = [];
  ws.push([bal >= 0 ? 'good' : 'bad', bal >= 0 ? `Đốt nhiều hơn nạp +${fmtK(bal)} kcal` : `Nạp vượt đốt ${fmtK(-bal)} kcal`]);
  const mins = todayMins();
  ws.push([mins >= 30 ? 'good' : 'amb', mins >= 30 ? `Vận động ${mins} phút hôm nay` : `Mới vận động ${mins} phút (nên ≥ 30)`]);
  const steps = (LOG.activity && LOG.activity.steps) || 0;
  ws.push([steps >= 6000 ? 'good' : 'amb', `${fmtK(steps)} bước · mục tiêu 6,000`]);
  const slp = LOG.recovery ? LOG.recovery.sleep_hours : null;
  if (slp != null) ws.push([slp >= 7 ? 'good' : slp >= 6 ? 'amb' : 'bad', `Ngủ ${slp}h đêm qua`]);
  else ws.push(['amb', 'Chưa ghi giấc ngủ đêm qua']);
  return ws;
}

function renderP2() {
  const o = OUT, t = o.todayTotals;
  const actK = actBurnToday();
  const burn = o.bmr + actK;
  const bal = Math.round(burn - t.kcal);
  const remain = Math.max(0, o.targetKcal - t.kcal);
  const intakePct = Math.min(100, Math.round(t.kcal / Math.max(1, o.targetKcal) * 100));
  const burnPct = Math.min(100, Math.round(burn / Math.max(1, o.tdee) * 100));
  const mealCount = new Set((LOG.foods || []).map(f => f.meal)).size;

  const foodRows = (LOG.foods || []).length
    ? LOG.foods.map((f, i) => {
      const q = f.qty || 1;
      const tag = f.processed || (f.sugar || 0) * q >= 20 ? 'Không tốt' : 'Lành mạnh';
      return `<div class="li" ${ro() ? 'style="cursor:default"' : `onclick="openFoodEdit(${i})"`}>
        <div><div class="li-n">${esc(f.name)}</div><div class="li-p">${esc(f.meal || '')} · ${esc(unitLabel(f))} · ${tag}</div></div>
        <div style="text-align:right"><div class="li-c" style="color:var(--cy)">${fmtK(f.calories * q)}</div>
        <div class="mpills"><span class="mp p">P${Math.round(f.protein * q)}</span><span class="mp f">F${Math.round(f.fat * q)}</span><span class="mp c">C${Math.round(f.carb * q)}</span></div></div>
      </div>`;
    }).join('')
    : '<div class="empty">Chưa có món nào — bấm tiêu đề để thêm</div>';

  const actRows = (LOG.acts || []).length
    ? LOG.acts.map((a, i) => `<div class="li" style="cursor:default">
        <div><div class="li-n">${a.icon || '🏃'} ${esc(a.name)}</div><div class="li-p">${a.minutes} phút · MET ${a.met}</div></div>
        <div style="display:flex;align-items:center;gap:8px"><span class="li-c" style="color:var(--gr)">−${fmtK(a.kcal)}</span>${ro() ? '' : `<span class="li-x" onclick="removeAct(${i});event.stopPropagation()">✕</span>`}</div>
      </div>`).join('')
    : '<div class="empty">Chưa có hoạt động — bấm tiêu đề để thêm</div>';

  const wv = LOG.weight_morning != null ? LOG.weight_morning : '';
  const sv = LOG.recovery && LOG.recovery.sleep_hours != null ? LOG.recovery.sleep_hours : '';
  const stv = (LOG.activity && LOG.activity.steps) || '';

  $('p2').innerHTML = `
    <div class="hd">
      <div><div class="date">Dữ liệu chi tiết · ${fmtDM(DB.today())}</div><div class="name" style="font-size:17px"><b>Nạp & Đốt</b></div></div>
      <button class="dot-i on" style="cursor:pointer" onclick="goTo(0)"><span class="dd"></span>← Tổng quan</button>
    </div>

    <!-- NẠP -->
    <div class="card p2-card">
      <div class="p2-head" ${ro() ? 'style="cursor:default"' : 'onclick="openFood()"'}>
        <div style="flex:1;min-width:0">
          <div class="p2-type" style="color:var(--cy)"><span style="width:6px;height:6px;border-radius:50%;background:var(--cy);display:inline-block"></span>Nạp vào
            <span class="p2-edit"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></span></div>
          <div class="p2-big">${fmtK(t.kcal)} <s>kcal</s></div>
          <div class="p2-sub">${intakePct}% mục tiêu ${fmtK(o.targetKcal)} · còn ${fmtK(remain)} kcal</div>
        </div>
        <div class="p2-ringbox">
          <svg width="54" height="54" viewBox="0 0 54 54">${ring(t.kcal / Math.max(1, o.targetKcal), 21, '#00D4FF', 6, 54)}</svg>
          <div class="p2-ringp" style="color:var(--cy)">${intakePct}%</div>
        </div>
      </div>
      <div class="p2-body">
        <div class="p2-left">
          <div class="p2-warns">
            <div class="p2-wl">Cảnh báo · Engine 2</div>
            <div class="scrollbox warn-scroll">${foodWarns(t).map(w => `<div class="w ${w[0]}">${esc(w[1])}</div>`).join('')}</div>
          </div>
          <div>
            <div class="p2-lh">Chi tiết · ${mealCount} bữa · ${(LOG.foods || []).length} món (chạm món để sửa)</div>
            <div class="scrollbox li-scroll">${foodRows}</div>
          </div>
        </div>
        <div class="p2-right">
          <div class="p2-stat"><div class="p2-sv" style="color:var(--cy)">${fmtK(t.kcal)}</div><div class="p2-sl">Đã nạp</div></div>
          <div class="p2-stat"><div class="p2-sv">${fmtK(remain)}</div><div class="p2-sl">Còn lại</div></div>
          <div class="p2-stat"><div class="p2-sv" style="color:var(--cy)">${intakePct}%</div><div class="p2-sl">Hoàn thành</div></div>
          <div class="p2-stat"><div class="p2-sv">${Math.round(t.protein)}g</div><div class="p2-sl">Protein</div></div>
        </div>
      </div>
    </div>

    <!-- ĐỐT -->
    <div class="card p2-card">
      <div class="p2-head" ${ro() ? 'style="cursor:default"' : 'onclick="openAct()"'}>
        <div style="flex:1;min-width:0">
          <div class="p2-type" style="color:var(--gr)"><span style="width:6px;height:6px;border-radius:50%;background:var(--gr);display:inline-block"></span>Đốt cháy
            <span class="p2-edit"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></span></div>
          <div class="p2-big">${fmtK(burn)} <s>kcal</s></div>
          <div class="p2-sub">BMR ${fmtK(o.bmr)} + vận động ${fmtK(actK)} · ${bal >= 0 ? 'thặng dư +' + fmtK(bal) : 'thiếu ' + fmtK(-bal)}</div>
        </div>
        <div class="p2-ringbox">
          <svg width="54" height="54" viewBox="0 0 54 54">${ring(burn / Math.max(1, o.tdee), 21, '#38EF7D', 6, 54)}</svg>
          <div class="p2-ringp" style="color:var(--gr)">${burnPct}%</div>
        </div>
      </div>
      <div class="p2-body">
        <div class="p2-left">
          <div>
            <div class="p2-lh">Hoạt động · ${(LOG.acts || []).length} mục</div>
            <div class="scrollbox li-scroll">${actRows}</div>
          </div>
          <div class="p2-warns">
            <div class="p2-wl">Nhận xét</div>
            <div class="scrollbox warn-scroll">${burnNotes(bal).map(w => `<div class="w ${w[0]}">${esc(w[1])}</div>`).join('')}</div>
          </div>
        </div>
        <div class="p2-right">
          <div class="p2-stat"><div class="p2-sv">${fmtK(o.bmr)}</div><div class="p2-sl">BMR</div></div>
          <div class="p2-stat"><div class="p2-sv" style="color:var(--gr)">+${fmtK(actK)}</div><div class="p2-sl">Vận động</div></div>
          <div class="p2-stat"><div class="p2-sv" style="color:${bal >= 0 ? 'var(--gr)' : 'var(--rd)'}">${bal >= 0 ? '+' : ''}${fmtK(bal)}</div><div class="p2-sl">Cân bằng</div></div>
          <div class="p2-stat"><div class="p2-sv" style="color:var(--gr)">${burnPct}%</div><div class="p2-sl">% TDEE</div></div>
        </div>
      </div>
    </div>

    <!-- CƠ THỂ -->
    <div class="card p2-card">
      <div class="p2-head" style="cursor:default;padding-bottom:10px">
        <div style="flex:1">
          <div class="p2-type" style="color:var(--indigo)"><span style="width:6px;height:6px;border-radius:50%;background:var(--indigo);display:inline-block"></span>Cơ thể hôm nay</div>
          <div class="p2-sub" style="margin-top:2px">Cân buổi sáng giúp Engine 3 tính trend chuẩn (MA 7 ngày: ${o.trendWeight.toFixed(1)} kg)</div>
        </div>
      </div>
      <div class="bd-grid">
        <div class="fi"><label>Cân sáng (kg)</label><input id="bdW" type="number" step="0.1" value="${wv}" placeholder="${o.trendWeight.toFixed(1)}" ${ro() ? 'disabled' : ''}></div>
        <div class="fi"><label>Ngủ (giờ)</label><input id="bdS" type="number" step="0.5" value="${sv}" placeholder="7" ${ro() ? 'disabled' : ''}></div>
        <div class="fi"><label>Số bước</label><input id="bdSt" type="number" step="100" value="${stv}" placeholder="6000" ${ro() ? 'disabled' : ''}></div>
      </div>
      ${ro() ? '' : '<div style="padding:0 14px 14px"><button class="btn-pri" onclick="saveBody()">Lưu chỉ số hôm nay</button></div>'}
    </div>

    ${ro() ? '' : `
    <div style="padding:0 14px 4px">
      <a class="btn-ghost" style="display:block;text-align:center;text-decoration:none" href="../N.Anh/Anh_calo.html?view=partner">Xem trang của Ngọc Anh (chỉ xem)</a>
    </div>`}
    ${ro() ? '' : '<div class="reset-link" onclick="resetAll()">Đặt lại toàn bộ dữ liệu</div>'}`;
}

/* ---------- FOOD MODAL ---------- */
let fmMeal = 'Sáng', fmSel = null, fmIdx = null;

function suggestMeal() {
  const h = new Date().getHours();
  return h < 10 ? 'Sáng' : h < 14 ? 'Trưa' : h < 21 ? 'Tối' : 'Phụ';
}
function openFood() {
  if (ro()) return;
  fmMeal = suggestMeal(); fmSel = null; fmIdx = null;
  $('fmTitle').textContent = 'Thêm món ăn';
  $('fmListView').style.display = 'flex';
  $('fmEditView').style.display = 'none';
  renderMealTabs();
  $('fSearch').value = '';
  renderFoods('');
  $('foodModal').classList.add('open');
}
function closeFood() { $('foodModal').classList.remove('open'); }
function renderMealTabs() {
  $('fmMeals').innerHTML = MEALS.map(m => `<div class="mtab ${m === fmMeal ? 'on' : ''}" onclick="setMeal('${m}')">${m}</div>`).join('');
}
function setMeal(m) { fmMeal = m; if (fmSel) fmSel.meal = m; renderMealTabs(); if ($('fmEditView').style.display !== 'none') renderFoodEditor(); }

function renderFoods(q) {
  const list = searchFood(q);
  const term = (q || '').trim();
  // Nút "tự thêm món" — luôn hiện khi đang gõ (để tạo món chưa có trong danh mục).
  const addBtn = term
    ? `<div class="qi qi-add" onclick="createFood($('fSearch').value)">
        <div><div class="qi-n">➕ Tự thêm món “${esc(term)}”</div><div class="qi-p">Nhập số liệu của bạn — hệ thống sẽ nhớ cho lần sau</div></div>
        <div class="qi-c" style="color:var(--lime)">Tạo</div>
      </div>`
    : '';
  const rows = list.map(f =>
    `<div class="qi" onclick="pickFood('${f.id}')">
      <div><div class="qi-n">${esc(f.name)}${CustomFoods && CustomFoods.isCustom(f) ? ' <span style="color:var(--lime);font-size:9px;font-weight:800">CỦA BẠN</span>' : ''}</div><div class="qi-p">${f.serving === 1 ? '1 ' + f.unit : f.serving + f.unit} · P${f.protein} F${f.fat} C${f.carb}${f.processed ? ' · chế biến sẵn' : ''}</div></div>
      <div class="qi-c" style="color:var(--cy)">${f.kcal} kcal</div>
    </div>`).join('');
  $('fList').innerHTML = addBtn + (rows || (term ? '' : '<div class="empty">Gõ tên món để tìm hoặc tự thêm</div>'));
}

/* Tạo món MỚI do người dùng tự nhập (khi tìm không thấy). */
function createFood(name) {
  fmSel = {
    id: CustomFoods.newId(), name: (name || '').trim() || 'Món mới',
    unit: 'phần', serving: 1, qty: 1, meal: fmMeal,
    calories: 0, protein: 0, carb: 0, fat: 0, fiber: 0, sugar: 0, processed: 0
  };
  fmIdx = null;
  renderFoodEditor();
}

function pickFood(id) {
  const f = getFood(id);
  if (!f) return;
  fmSel = { id: f.id, name: f.name, unit: f.unit, serving: f.serving, qty: 1, meal: fmMeal, calories: f.kcal, protein: f.protein, carb: f.carb, fat: f.fat, fiber: f.fiber, sugar: f.sugar, processed: f.processed };
  fmIdx = null;
  renderFoodEditor();
}
function openFoodEdit(i) {
  const f = LOG.foods[i];
  if (!f) return;
  fmSel = JSON.parse(JSON.stringify(f));
  fmIdx = i; fmMeal = f.meal || 'Sáng';
  $('fmTitle').textContent = 'Sửa món ăn';
  $('foodModal').classList.add('open');
  renderFoodEditor();
}

function renderFoodEditor() {
  $('fmListView').style.display = 'none';
  const v = $('fmEditView');
  v.style.display = 'block';
  const f = fmSel, q = f.qty || 1;
  const per = f.unit === 'g' ? `${f.serving}g` : `1 ${f.unit}`;
  const isCustom = CustomFoods && CustomFoods.isCustom(f);
  const nameBlock = isCustom
    ? `<div class="ed-grid" style="grid-template-columns:2fr 1fr;margin-bottom:8px">
        <div class="fi"><label>Tên món</label><input type="text" value="${esc(f.name)}" oninput="fmName(this.value)"></div>
        <div class="fi"><label>Đơn vị</label><input type="text" value="${esc(f.unit)}" oninput="fmUnit(this.value)"></div>
      </div>`
    : `<div class="ed-name">${esc(f.name)} <span class="ed-sub">· giá trị cho ${per}</span></div>`;
  v.innerHTML = `
    ${nameBlock}
    <div class="ed-note">${isCustom ? 'Món của bạn — nhập số liệu cho <b>1 ' + esc(f.unit) + '</b>. Hệ thống sẽ nhớ để lần sau tìm lại được.' : 'Thông số lấy từ dữ liệu định sẵn — bạn có thể sửa từng ô cho đúng phần ăn thật.'}</div>
    <div class="mtabs">${MEALS.map(m => `<div class="mtab ${m === f.meal ? 'on' : ''}" onclick="setMeal('${m}')">${m}</div>`).join('')}</div>
    <div class="qty">
      <button class="qb" onclick="fmQty(-0.5)">−</button>
      <div class="qv">${q} <s>× ${per}</s></div>
      <button class="qb" onclick="fmQty(0.5)">+</button>
    </div>
    <div class="ed-grid">
      <div class="fi"><label>Kcal</label><input type="number" value="${f.calories}" oninput="fmField('calories',this.value)"></div>
      <div class="fi"><label>Protein (g)</label><input type="number" value="${f.protein}" oninput="fmField('protein',this.value)"></div>
      <div class="fi"><label>Béo (g)</label><input type="number" value="${f.fat}" oninput="fmField('fat',this.value)"></div>
      <div class="fi"><label>Carb (g)</label><input type="number" value="${f.carb}" oninput="fmField('carb',this.value)"></div>
      <div class="fi"><label>Xơ (g)</label><input type="number" value="${f.fiber}" oninput="fmField('fiber',this.value)"></div>
      <div class="fi"><label>Đường (g)</label><input type="number" value="${f.sugar}" oninput="fmField('sugar',this.value)"></div>
    </div>
    <div class="ed-total">
      <div><div class="tt">Tổng cộng (× ${q})</div><div class="tm" id="fmTotM">P${Math.round(f.protein * q)} · F${Math.round(f.fat * q)} · C${Math.round(f.carb * q)} · đường ${Math.round((f.sugar || 0) * q)}g</div></div>
      <div class="tv" id="fmTotK">${fmtK(f.calories * q)} kcal</div>
    </div>
    ${fmIdx == null
      ? `<div class="btn-row"><button class="btn-ghost" onclick="backToList()">← Danh sách</button><button class="btn-pri" onclick="fmApply()">Thêm vào ${esc(f.meal)}</button></div>`
      : `<div class="btn-row"><button class="btn-danger" onclick="fmRemove()">Xóa món</button><button class="btn-pri" onclick="fmApply()">Cập nhật</button></div>`}`;
}
function backToList() {
  $('fmEditView').style.display = 'none';
  $('fmListView').style.display = 'flex';
  fmSel = null;
}
function fmQty(d) {
  fmSel.qty = Math.max(0.5, Math.round(((fmSel.qty || 1) + d) * 10) / 10);
  renderFoodEditor();
}
function fmField(k, val) {
  fmSel[k] = parseFloat(val) || 0;
  const q = fmSel.qty || 1;
  $('fmTotK').textContent = fmtK(fmSel.calories * q) + ' kcal';
  $('fmTotM').textContent = `P${Math.round(fmSel.protein * q)} · F${Math.round(fmSel.fat * q)} · C${Math.round(fmSel.carb * q)} · đường ${Math.round((fmSel.sugar || 0) * q)}g`;
}
function fmName(val) { fmSel.name = String(val || '').trim(); }
function fmUnit(val) { fmSel.unit = String(val || '').trim() || 'phần'; }

/* Lưu / cập nhật món tự thêm vào danh mục (để nhớ cho lần sau). */
function rememberCustomFood(f) {
  if (!window.CustomFoods || !CustomFoods.isCustom(f)) return;
  const cat = {
    id: f.id, name: f.name || 'Món mới', unit: f.unit || 'phần', serving: f.serving || 1,
    kcal: f.calories || 0, protein: f.protein || 0, carb: f.carb || 0, fat: f.fat || 0,
    fiber: f.fiber || 0, sugar: f.sugar || 0, processed: f.processed || 0
  };
  CustomFoods.save(cat);
  const i = window.FOOD_DB.findIndex(x => x.id === cat.id);
  if (i >= 0) window.FOOD_DB[i] = cat; else window.FOOD_DB.push(cat);
}
function fmApply() {
  if (ro() || !fmSel) return;
  rememberCustomFood(fmSel);          // món tự thêm → lưu vào danh mục để nhớ
  if (!LOG.foods) LOG.foods = [];
  if (fmIdx != null) LOG.foods[fmIdx] = fmSel;
  else LOG.foods.push(fmSel);
  persist();
  closeFood();
  refresh();
  toast((fmIdx != null ? 'Đã cập nhật ' : 'Đã thêm ') + fmSel.name + ' · ' + fmtK(fmSel.calories * (fmSel.qty || 1)) + ' kcal');
}
function fmRemove() {
  if (ro() || fmIdx == null) return;
  const n = LOG.foods[fmIdx].name;
  LOG.foods.splice(fmIdx, 1);
  persist(); closeFood(); refresh();
  toast('Đã xóa ' + n);
}

/* ---------- ACT MODAL ---------- */
let amSel = null;

function openAct() {
  if (ro()) return;
  amSel = null;
  $('amListView').style.display = 'flex';
  $('amEditView').style.display = 'none';
  $('aSearch').value = '';
  renderActs('');
  $('actModal').classList.add('open');
}
function closeAct() { $('actModal').classList.remove('open'); }

function curWeight() { return (LOG.weight_morning != null ? LOG.weight_morning : OUT.currentWeight) || 70; }

function renderActs(q) {
  const w = curWeight();
  $('aList').innerHTML = searchAct(q).map(a =>
    `<div class="qi" onclick="pickAct('${a.id}')">
      <div><div class="qi-n">${a.icon} ${esc(a.name)}</div><div class="qi-p">MET ${a.met} · ~${actKcal(a.met, w, 30)} kcal / 30 phút</div></div>
      <div class="qi-c" style="color:var(--gr)">chọn ›</div>
    </div>`).join('') || '<div class="empty">Không tìm thấy</div>';
}
function pickAct(id) {
  const a = ACT_DB.find(x => x.id === id);
  if (!a) return;
  amSel = { id: a.id, name: a.name, icon: a.icon, met: a.met, minutes: 30, kcal: actKcal(a.met, curWeight(), 30) };
  renderActEditor();
}
function renderActEditor() {
  $('amListView').style.display = 'none';
  const v = $('amEditView');
  v.style.display = 'block';
  const a = amSel;
  v.innerHTML = `
    <div class="ed-name">${a.icon} ${esc(a.name)} <span class="ed-sub">· MET ${a.met}</span></div>
    <div class="ed-note">Kcal tự tính theo MET × ${curWeight()}kg × thời gian — sửa được nếu đồng hồ đo khác.</div>
    <div class="ed-grid" style="grid-template-columns:1fr 1fr">
      <div class="fi"><label>Thời gian (phút)</label><input id="amMin" type="number" value="${a.minutes}" oninput="amMinChange(this.value)"></div>
      <div class="fi"><label>Kcal đốt</label><input id="amKcal" type="number" value="${a.kcal}" oninput="amSel.kcal=parseFloat(this.value)||0"></div>
    </div>
    <div class="btn-row"><button class="btn-ghost" onclick="amBack()">← Danh sách</button><button class="btn-pri" onclick="amApply()">Thêm hoạt động</button></div>`;
}
function amBack() { $('amEditView').style.display = 'none'; $('amListView').style.display = 'flex'; amSel = null; }
function amMinChange(val) {
  amSel.minutes = Math.max(0, parseInt(val) || 0);
  amSel.kcal = actKcal(amSel.met, curWeight(), amSel.minutes);
  $('amKcal').value = amSel.kcal;
}
function amApply() {
  if (ro()) return;
  if (!amSel || !amSel.minutes) { toast('Nhập thời gian đã nhé'); return; }
  if (!LOG.acts) LOG.acts = [];
  LOG.acts.push(amSel);
  if (!LOG.activity) LOG.activity = { steps: 0, minutes: 0, type: '' };
  LOG.activity.minutes = todayMins();
  persist(); closeAct(); refresh();
  toast('Đã thêm ' + amSel.name + ' · −' + fmtK(amSel.kcal) + ' kcal');
}
function removeAct(i) {
  if (ro()) return;
  const n = LOG.acts[i].name;
  LOG.acts.splice(i, 1);
  persist(); refresh();
  toast('Đã xóa ' + n);
}

/* ---------- CƠ THỂ ---------- */
function saveBody() {
  if (ro()) return;
  const w = parseFloat($('bdW').value);
  const s = parseFloat($('bdS').value);
  const st = parseInt($('bdSt').value);
  LOG.weight_morning = isNaN(w) ? null : Math.round(w * 10) / 10;
  if (!LOG.recovery) LOG.recovery = { sleep_hours: null, water_ml: 0 };
  LOG.recovery.sleep_hours = isNaN(s) ? null : s;
  if (!LOG.activity) LOG.activity = { steps: 0, minutes: 0, type: '' };
  LOG.activity.steps = isNaN(st) ? 0 : st;
  persist(); refresh();
  toast('Đã lưu chỉ số hôm nay');
}

function resetAll() {
  if (ro()) return;
  if (confirm('Xóa toàn bộ dữ liệu (hồ sơ + nhật ký)?')) {
    DB.clearAll().then(() => location.reload());
  }
}

/* ---------- ONBOARDING ---------- */
function chipVal(boxId) {
  const el = document.querySelector('#' + boxId + ' .chip.sel');
  return el ? el.dataset.v : null;
}
['obAct', 'obGoal', 'obDl'].forEach(boxId => {
  document.addEventListener('click', e => {
    const chip = e.target.closest('#' + boxId + ' .chip');
    if (!chip) return;
    document.querySelectorAll('#' + boxId + ' .chip').forEach(c => c.classList.remove('sel'));
    chip.classList.add('sel');
    obDelta();
  });
});
function obDelta() {
  const ws = parseFloat($('obWs').value), wg = parseFloat($('obWg').value);
  const dl = parseInt(chipVal('obDl')) || 90;
  const el = $('obDeltaTxt');
  if (!isNaN(ws) && !isNaN(wg) && ws !== wg) {
    const d = Math.abs(ws - wg);
    el.innerHTML = `Cần ${ws > wg ? 'giảm' : 'tăng'} <b>${d.toFixed(1)} kg</b> trong ${dl} ngày ≈ ${(d / (dl / 7)).toFixed(2)} kg/tuần`;
  } else el.textContent = '';
}
function obStart() {
  if (ro()) return;
  const ws = parseFloat($('obWs').value), wg = parseFloat($('obWg').value);
  if (isNaN(ws) || isNaN(wg) || ws < 30 || wg < 30) { toast('Nhập cân nặng hiện tại và mục tiêu nhé'); return; }
  const p = {
    name: $('obName').value.trim() || 'Bạn',
    age: parseInt($('obAge').value) || 25,
    height: parseFloat($('obH').value) || 170,
    gender: 'male',
    weight_start: ws,
    weight_goal: wg,
    activity_level: chipVal('obAct') || 'light',
    goal_type: chipVal('obGoal') || 'lose_fat',
    deadline_days: parseInt(chipVal('obDl')) || 90,
    start_date: DB.today()
  };
  DB.saveProfile(p);
  const log = DB.getTodayLog();
  log.weight_morning = ws;
  DB.upsertLog(log);
  refresh();
  toast('Bắt đầu! Mục tiêu ' + wg + ' kg trong ' + p.deadline_days + ' ngày 💪');
}

/* ---------- DỮ LIỆU MẪU 14 NGÀY ---------- */
function mkFood(id, meal, qty) {
  const f = getFood(id);
  if (!f) return null; // id mẫu không có trong DB → bỏ qua, không crash
  return { id: f.id, name: f.name, unit: f.unit, serving: f.serving, qty: qty || 1, meal, calories: f.kcal, protein: f.protein, carb: f.carb, fat: f.fat, fiber: f.fiber, sugar: f.sugar, processed: f.processed };
}
function mkAct(id, min, w) {
  const a = ACT_DB.find(x => x.id === id);
  if (!a) return null;
  return { id: a.id, name: a.name, icon: a.icon, met: a.met, minutes: min, kcal: actKcal(a.met, w, min) };
}
async function obDemo() {
  if (ro()) return;
  await DB.clearAll();
  const today = DB.today();
  const start = isoAddDays(today, -13);
  const prof = { name: 'Hồng Phúc', age: 29, height: 175, gender: 'male', weight_start: 80.0, weight_goal: 75.0, activity_level: 'light', goal_type: 'lose_fat', deadline_days: 90, start_date: start };

  // thực đơn: H = đủ protein, B/C = thiếu protein (5 ngày cuối → Engine 6 bắt rủi ro)
  const H = [['pho_bo_tai', 'Sáng'], ['ca_phe_den_da', 'Sáng'], ['com_ga_hai_nam', 'Trưa'], ['uc_ga_hap_ap_chao_khong_dau', 'Tối'], ['com_trang', 'Tối'], ['salad_uc_ga', 'Tối'], ['trung_chien_op_la', 'Phụ']];
  const B = [['banh_mi_trung', 'Sáng'], ['com_tam_suon', 'Trưa'], ['canh_chua_ca', 'Trưa'], ['mien_ga_chuan', 'Tối'], ['salad_caesar', 'Tối']];
  const Cm = [['xoi_man_day_du', 'Sáng'], ['bun_bo_hue_chuan', 'Trưa'], ['tra_sua_tran_chau_size_m', 'Phụ'], ['com_chien_duong_chau', 'Tối']];

  const noise = [0.05, -0.03, 0.08, 0, -0.06, 0.04, -0.02, 0.07, -0.05, 0.02, -0.04, 0.03, 0.01];
  const logs = [];
  for (let i = 13; i >= 1; i--) {
    const idx = 13 - i;
    const w = Math.round((80 - 0.082 * idx + noise[idx]) * 10) / 10;
    const menu = idx < 9 ? H : (idx % 2 ? Cm : B);
    const log = {
      date: isoAddDays(today, -i),
      weight_morning: w,
      foods: menu.map(m => mkFood(m[0], m[1])).filter(Boolean),
      acts: [],
      activity: { steps: 4500 + (idx % 4) * 1500, minutes: 0, type: '' },
      recovery: { sleep_hours: [7, 6.5, 7.5, 6][idx % 4], water_ml: 2000 }
    };
    if (idx % 2 === 0) { const a = mkAct('act_055', 30, w); if (a) log.acts.push(a); }   // đi bộ
    if (idx % 3 === 0) { const a = mkAct('act_169', 45, w); if (a) log.acts.push(a); }   // cầu lông
    log.activity.minutes = log.acts.reduce((s, a) => s + a.minutes, 0);
    logs.push(log);
  }
  const tw = Math.round((80 - 0.082 * 13 - 0.02) * 10) / 10;
  logs.push({
    date: today,
    weight_morning: tw,
    foods: [mkFood('pho_bo_tai', 'Sáng'), mkFood('ca_phe_sua_da_chuan', 'Sáng'), mkFood('com_tam_suon', 'Trưa'), mkFood('goi_cuon_tom_thit', 'Phụ', 2)].filter(Boolean),
    acts: [mkAct('act_055', 30, tw)].filter(Boolean),
    activity: { steps: 5200, minutes: 30, type: '' },
    recovery: { sleep_hours: 6.5, water_ml: 1500 }
  });
  DB.seed(prof, logs);
  refresh();
  toast('Đã nạp dữ liệu mẫu 14 ngày — khám phá đi!');
}

/* ---------- PAGER ---------- */
const pager = $('pager');
function goTo(i) { pager.scrollTo({ left: i * pager.clientWidth, behavior: 'smooth' }); }
function updateDots() {
  const i = Math.round(pager.scrollLeft / pager.clientWidth);
  document.querySelectorAll('.dots .dot-i[data-go]').forEach(d => d.classList.toggle('on', +d.dataset.go === i));
}
pager.addEventListener('scroll', () => requestAnimationFrame(updateDots), { passive: true });
document.querySelectorAll('.dots .dot-i[data-go]').forEach(d => d.addEventListener('click', () => goTo(+d.dataset.go)));

/* Nạp món TỰ THÊM (đã lưu) vào danh mục trong RAM để tìm lại được. */
function loadCustomFoods() {
  if (!window.CustomFoods || !window.FOOD_DB) return;
  const have = new Set(window.FOOD_DB.map(f => f.id));
  CustomFoods.load().forEach(f => { if (f && f.id && !have.has(f.id)) window.FOOD_DB.push(f); });
}

/* boot — xác thực phiên đăng nhập (Supabase), xác định đang xem dữ liệu của
   CHÍNH MÌNH hay của ĐỐI TÁC (chế độ chỉ-xem, qua ?view=partner), rồi nạp
   dữ liệu thật từ Supabase vào bộ nhớ trước khi render lần đầu. */
(async function boot() {
  const ctx = await VitalAuth.resolveViewContext('../index.html');
  if (!ctx) return;
  if (!ctx.readOnly && ctx.me.gender !== 'male') { window.location.href = '../N.Anh/Anh_calo.html'; return; }
  window.VITAL_READONLY = ctx.readOnly;
  if (ctx.readOnly) VitalAuth.mountReadOnlyBanner(ctx.ownerProfile ? ctx.ownerProfile.name : 'đối tác');
  try {
    await Promise.all([DB._boot(ctx.ownerId), CustomFoods._boot(ctx.ownerId)]);
    loadCustomFoods();
  } catch (e) {
    console.error('VITAL: lỗi nạp dữ liệu từ Supabase', e);
  }
  refresh();
})();
