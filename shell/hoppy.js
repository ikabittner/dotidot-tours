/* Hoppy, the Dotidot MCP mascot, ported from dotidot-mcp-promo-v19 (same body art, voice light and regex-character eyes).
   Without a voiceover the light just breathes. Hoppy.make(parent, R) -> avatar, Hoppy.draw(A, I, t, power, eyesOn, bodyRot). */
(function () {
  const FAMILY = 'Google Sans Code', MIN_YAW = 0.45, EYE_HALF = 0.38;
  const SIZE = { '|': 1.0, '?': 1.0, '*': 1.15, '+': 1.15, '#': 1.0, '$': 1.05, '!': 1.0, '^': 1.2, '•': 1.55 };
  const ROLL = { '?': -0.14, '*': 0, '+': 0.03, '#': 0, '$': 0.05, '!': 0, '^': 0.07, '•': 0.02, '|': 0 };
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const p = (t, s, d) => clamp((t - s) / d);
  const lerp = (a, b, x) => a + (b - a) * x;
  const eOut = (x) => 1 - Math.pow(1 - x, 3);
  const eIn = (x) => x * x * x;
  const eInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const back = (x) => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const BASE = (document.currentScript && document.currentScript.dataset.assets) || '../brand/';
  let ink = null;
  function inkOf(ctx, ch) {
    if (!ink && document.fonts.check(`600 100px "${FAMILY}"`)) ink = {};
    if (ink && ink[ch]) return ink[ch];
    ctx.font = `600 100px "${FAMILY}"`;
    const m = ctx.measureText(ch), o = { cx: (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2, cy: (m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) / 2 };
    if (ink) ink[ch] = o;
    return o;
  }
  function make(parent, R) {
    const el = document.createElement('div'); el.className = 'av';
    el.innerHTML = `<img class="av__body" alt="" src="${BASE}av_body.webp"><div class="av__vw"><img alt="" src="${BASE}av_voice.webp"></div><canvas class="av__eyes"></canvas>`;
    parent.appendChild(el);
    const K = R / 243.5, body = el.querySelector('.av__body'), vw = el.querySelector('.av__vw'), cv = el.querySelector('canvas'), RI = R * 0.965;
    body.style.width = (747 * K) + 'px'; body.style.left = (-373.5 * K) + 'px'; body.style.top = (-363.5 * K) + 'px';
    body.style.transformOrigin = (373.5 * K) + 'px ' + (363.5 * K) + 'px';
    vw.style.width = vw.style.height = (2 * RI) + 'px'; vw.style.left = vw.style.top = (-RI) + 'px';
    const C = Math.ceil(R * 2.3); cv.width = cv.height = C; cv.style.width = cv.style.height = C + 'px'; cv.style.left = cv.style.top = (-C / 2) + 'px';
    return { el, R, RI, body, voice: vw.querySelector('img'), ctx: cv.getContext('2d'), C };
  }
  function gaze(I, t) {
    const G = I.gaze; let y = G[0][1], pt = G[0][2], hold = true;
    for (let i = 1; i < G.length; i++) {
      if (t < G[i][0]) break;
      const k = eOut(p(t, G[i][0], 0.17));
      y = lerp(G[i - 1][1], G[i][1], k); pt = lerp(G[i - 1][2], G[i][2], k); hold = k >= 1;
    }
    const slot = Math.floor(t / 1.1), ks = eOut(p(t, slot * 1.1, 0.12));
    let yaw = y + lerp(hash(slot - 1) - 0.5, hash(slot) - 0.5, ks) * 0.03;
    const my = lerp(hash(slot + 50) - 0.5, hash(slot + 51) - 0.5, ks) * 0.04;
    if (hold) yaw = (y < 0 ? -1 : 1) * Math.max(MIN_YAW, Math.abs(yaw));
    return { yaw, pitch: pt + my };
  }
  function eyes(I, t) {
    const E = I.eyes; let ch = E[0][1], sq = 0, pop = 0; const LE = (I.loadEnd || 0) - 1e-6;
    for (let i = 0; i < E.length; i++) if (t >= E[i][0]) ch = E[i][1];
    const marks = E.filter((e) => e[0] > 0 && e[0] >= LE).map((e) => e[0]).concat(I.blinks || []);
    marks.forEach((m) => {
      if (t >= m - 0.08 && t < m) sq = Math.max(sq, eIn(p(t, m - 0.08, 0.08)));
      else if (t >= m && t < m + 0.22) sq = Math.max(sq, 1 - back(p(t, m, 0.22)));
    });
    E.forEach((e) => { if (e[0] < LE && t >= e[0] && t < e[0] + 0.09) pop = Math.max(pop, 1 - eOut(p(t, e[0], 0.09))); });
    if (I.hideAt && t >= I.hideAt - 0.08) sq = t < I.hideAt ? Math.max(sq, eIn(p(t, I.hideAt - 0.08, 0.08))) : 1;
    let wk = { side: 0, amt: 0 };
    (I.winks || []).forEach((w) => {
      const a = t < w[0] ? 0 : t < w[0] + 0.10 ? eIn(p(t, w[0], 0.10)) : t < w[0] + 0.24 ? 1 : 1 - back(p(t, w[0] + 0.24, 0.28));
      if (a > wk.amt) wk = { side: w[1], amt: clamp(a, 0, 1.2) };
    });
    return { ch, sq, pop, wk };
  }
  function roll(I, t) {
    const E = I.eyes; let r = ROLL[E[0][1]] || 0;
    for (let i = 1; i < E.length; i++) { if (t < E[i][0]) break; r = lerp(ROLL[E[i - 1][1]] || 0, ROLL[E[i][1]] || 0, eInOut(p(t, E[i][0], 0.35))); }
    return r;
  }
  function draw(A, I, t, pw = 1, eyesOn = true, bodyRot = 0) {
    const e = 0, v = Math.max(e, 0.07 + 0.05 * (0.5 + 0.5 * Math.sin(t * 2 * Math.PI / 2.8)));
    const g = gaze(I, t), ey = eyes(I, t), R = A.R, RI = A.RI;
    const rl = roll(I, t) + 0.06 * ey.wk.amt * ey.wk.side;
    const rot = 16 * Math.sin(t * 2 * Math.PI / 9) + 8 * Math.sin(t * 0.9);
    const sz = RI * (1.95 + 0.85 * v) * (0.55 + 0.45 * pw);
    const px = Math.sin(g.yaw) * R * 0.10, py = R * 0.07 - Math.sin(g.pitch - 0.3) * R * 0.08;
    A.voice.style.width = A.voice.style.height = sz.toFixed(1) + 'px';
    A.voice.style.opacity = ((0.72 + 0.28 * v) * pw).toFixed(3);
    A.voice.style.transform = `translate(-50%,-50%) translate(${px.toFixed(1)}px,${py.toFixed(1)}px) rotate(${rot.toFixed(2)}deg)`;
    A.body.style.transform = bodyRot ? `rotate(${bodyRot.toFixed(2)}deg)` : '';
    const ctx = A.ctx, C = A.C; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, C, C);
    if (!eyesOn || ey.sq >= 0.97) return;
    const wSide = ey.wk.side, wAmt = clamp(ey.wk.amt, 0, 1);
    const FP = R * 0.56, RF = R * 0.93, k = SIZE[ey.ch] || 1, o = inkOf(ctx, ey.ch);
    ctx.font = `600 ${FP.toFixed(1)}px "${FAMILY}"`; ctx.fillStyle = '#fff'; ctx.textBaseline = 'alphabetic';
    for (let side = -1; side <= 1; side += 2) {
      const yw = g.yaw + side * EYE_HALF, x = RF * Math.sin(yw) * Math.cos(g.pitch), y = -RF * Math.sin(g.pitch);
      const cr = Math.cos(rl), sr = Math.sin(rl), X = C / 2 + x * cr - y * sr, Y = C / 2 + x * sr + y * cr;
      const sc = k * (1 + 0.16 * ey.pop), esq = side === wSide ? Math.max(ey.sq, wAmt) : ey.sq;
      const squint = side === wSide ? 1 : 1 - 0.22 * wAmt;
      if (esq >= 0.97) continue;
      ctx.save(); ctx.translate(X, Y); ctx.rotate(rl);
      ctx.scale(lerp(1, Math.max(0.3, Math.cos(yw)), 0.55) * sc * (1 + 0.12 * esq), Math.max(0.3, Math.cos(g.pitch)) * sc * squint * Math.max(0.05, 1 - esq));
      ctx.fillText(ey.ch, -o.cx * FP / 100, -o.cy * FP / 100);
      ctx.restore();
    }
  }
  window.Hoppy = { make, draw };
})();
