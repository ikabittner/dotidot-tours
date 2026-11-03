/* Shared deterministic timeline engine for all scenes.
   A scene calls E.scene({dur, frame}) and the renderer drives window.setTime(t).
   Nothing depends on wall-clock time, so every frame is reproducible. */
(function () {
  const VW = 1600, VH = 900;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const ease = {
    lin: (k) => k,
    io: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
    out: (k) => 1 - Math.pow(1 - k, 3),
    in: (k) => k * k * k,
    back: (k) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
    soft: (k) => 1 - Math.pow(1 - k, 4),
  };
  const Q = new URLSearchParams(location.search);
  const stage = $('#stage');

  function rectOf(el) {          // element rect in stage coordinates (stage untransformed)
    const prev = stage.style.transform; stage.style.transform = 'none';
    const r = el.getBoundingClientRect();
    stage.style.transform = prev;
    return { x: r.left, y: r.top, w: r.width, h: r.height, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
  }
  // camera = visible rect in stage coords (x, y, w); height follows the 16:9 viewport
  function fit(r, pad = 24, minW = 0, bias = 0.5) {
    const w = Math.max(minW, r.w + pad * 2, (r.h + pad * 2) * VW / VH);
    return { x: r.x + r.w / 2 - w / 2, y: r.y + r.h * bias - (w * VH / VW) * bias, w };
  }
  // like fit(), but keeps the bottom part of the frame free for captions
  function fitSafe(r, pad = 24, minW = 0, safe = 0.2) {
    if (Q.has('nocap')) safe = 0.08;   // inside the tour frame the captions live outside the app window
    const w = Math.max(minW, r.w + pad * 2, (r.h + pad * 2) / (1 - safe) * VW / VH);
    const fh = w * VH / VW, top = fh * (1 - safe);
    return { x: r.x + r.w / 2 - w / 2, y: r.y + r.h / 2 - top / 2, w };
  }
  const FULL = { x: 0, y: 0, w: VW };
  function clampCam(c, maxW = VW, maxH = 99999) {
    c.w = Math.min(c.w, maxW);
    c.x = clamp(c.x, 0, Math.max(0, maxW - c.w));
    c.y = clamp(c.y, 0, Math.max(0, maxH - c.w * VH / VW));
    return c;
  }
  // keyframes: [[t, value, easeName], ...]; value is a number or an object of numbers
  function track(keys) {
    return function (t) {
      if (t <= keys[0][0]) return keys[0][1];
      let i = 0; while (i < keys.length - 1 && t > keys[i + 1][0]) i++;
      if (i >= keys.length - 1) return keys[keys.length - 1][1];
      const [t0, a] = keys[i], [t1, b, e] = keys[i + 1];
      const k = (ease[e || 'io'])(prog(t, t0, t1));
      if (typeof a === 'number') return lerp(a, b, k);
      const o = {}; for (const key in a) o[key] = lerp(a[key], b[key], k); return o;
    };
  }
  function setCam(c) {
    const s = VW / c.w;
    stage.style.transform = `scale(${s}) translate(${-c.x}px, ${-c.y}px)`;
  }

  // ---------- cursor ----------
  const cursor = $('#cursor'), ripple = cursor && cursor.querySelector('.ripple');
  /* path: [[t, x, y], ...] moves with io ease and a small arc; clicks: [t, ...]; show: [tIn, tOut] */
  function drawCursor(t, path, clicks = [], show = null) {
    if (!cursor) return;
    const tin = show ? show[0] : path[0][0] - 0.25, tout = show ? show[1] : 1e9;
    cursor.style.opacity = Math.min(prog(t, tin, tin + 0.25), 1 - prog(t, tout, tout + 0.25));
    let x = path[0][1], y = path[0][2];
    for (let i = 0; i < path.length - 1; i++) {
      const [t0, x0, y0] = path[i], [t1, x1, y1] = path[i + 1];
      if (t >= t0) {
        const k = ease.io(prog(t, t0, t1));
        x = lerp(x0, x1, k); y = lerp(y0, y1, k) - Math.sin(k * Math.PI) * Math.min(40, Math.hypot(x1 - x0, y1 - y0) * 0.08);
      }
    }
    let press = 1, rp = 1, rOn = false;
    clicks.forEach((c) => {
      if (t >= c && t < c + 0.14) press = 0.86;
      if (t >= c && t < c + 0.5) { rOn = true; rp = prog(t, c, c + 0.45); }
    });
    cursor.style.transform = `translate(${x}px, ${y}px) scale(${press})`;
    ripple.style.opacity = rOn ? 0.35 * (1 - rp) : 0;
    ripple.style.transform = `scale(${0.4 + rp * 1.4})`;
  }
  const clicked = (t, c) => t >= c;

  // ---------- text helpers ----------
  function typeText(el, text, t, t0, cps = 22, caret = true) {
    const n = Math.floor(clamp((t - t0) * cps, 0, text.length));
    el.textContent = t < t0 ? '' : text.slice(0, n);
    const ph = el.parentElement && el.parentElement.querySelector('.in-ph');
    if (ph) ph.style.display = el.textContent ? 'none' : '';
    el.classList.toggle('typing', caret && t >= t0 && n < text.length + 4 && t < t0 + text.length / cps + 0.6);
    return n >= text.length;
  }
  const fmtInt = (v) => Math.round(v).toLocaleString('en-US');
  function count(el, from, to, t, t0, t1, fmt = fmtInt, e = 'out') {
    el.textContent = fmt(lerp(from, to, ease[e](prog(t, t0, t1))));
  }
  function pop(el, t, t0, dur = 0.35, from = 0.6) {
    const k = ease.back(prog(t, t0, t0 + dur));
    el.style.opacity = clamp(prog(t, t0, t0 + dur * 0.5));
    el.style.transform = `scale(${lerp(from, 1, k)})`;
  }
  function rise(el, t, t0, dur = 0.45, dy = 16) {
    const k = ease.out(prog(t, t0, t0 + dur));
    el.style.opacity = k;
    el.style.transform = `translateY(${(1 - k) * dy}px)`;
  }
  function show(el, on) { el.style.display = on ? '' : 'none'; }

  function syncAnims(t) {
    document.getAnimations().forEach((a) => { if (window.CSSTransition && a instanceof CSSTransition) return; a.pause(); a.currentTime = (t * 1000) % 100000; });
  }

  // ---------- dim + focus ----------
  let dim = null;
  function dimLayer() {
    if (!dim) { dim = document.createElement('div'); dim.id = 'dim'; stage.appendChild(dim); }
    return dim;
  }
  function focus(el, k, ring = 'var(--dds-color-primary-default)') {
    el.style.position = el.style.position || 'relative';
    el.style.zIndex = k > 0.001 ? 30 : '';
    el.style.boxShadow = k > 0.001 ? `0 0 0 ${2 * k}px ${ring}, 0 ${12 * k}px ${30 * k}px rgba(27,34,48,${0.18 * k})` : '';
  }

  // ---------- captions (outside the camera, in viewport space) ----------
  const capRoot = $('#captions');
  let capEls = [];
  function setupCaptions(list) {
    if (!capRoot) return;
    capRoot.innerHTML = '';
    capEls = list.map((c) => {
      const box = document.createElement('div');
      box.className = 'cap ' + (c.pos || 'bl');
      const txt = c.text.replace(/<b>(.*?)<\/b>/g, (m, inner) => inner.split(/\s+/).map((w) => `<b>${w}</b>`).join(' '));
      const words = txt.split(/\s+/).filter(Boolean);
      box.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ');
      capRoot.appendChild(box);
      return { c, box, words: [...box.querySelectorAll('.w')] };
    });
  }
  function drawCaptions(t) {
    if (Q.has('nocap')) { if (capRoot) capRoot.style.display = 'none'; return; }
    capEls.forEach(({ c, box, words }) => {
      const on = t >= c.t0 - 0.05 && t <= c.t1 + 0.4;
      box.style.display = on ? '' : 'none';
      if (!on) return;
      const kin = ease.out(prog(t, c.t0, c.t0 + 0.35));
      const kout = ease.in(prog(t, c.t1, c.t1 + 0.3));
      box.style.opacity = kin * (1 - kout);
      box.style.transform = `translateY(${(1 - kin) * 18 + kout * 10}px)`;
      words.forEach((w, i) => {
        const k = ease.out(prog(t, c.t0 + 0.05 + i * 0.045, c.t0 + 0.3 + i * 0.045));
        w.style.opacity = k;
        w.style.transform = `translateY(${(1 - k) * 10}px)`;
      });
    });
  }

  function scene({ dur, frame, captions = [], camera = null }) {
    setupCaptions(captions);
    window.DUR = dur;
    window.setTime = function (t) {
      syncAnims(t);
      frame(t);
      drawCaptions(t);
      if (Q.has('cam')) { const [x, y, w] = Q.get('cam').split(',').map(Number); setCam({ x, y, w }); }
      else if (camera) setCam(camera(t));
    };
    // interactive tour: content time and camera time can differ (camera arrives before the click it waits for)
    window.setSplit = function (tc, tcam) {
      syncAnims(tc);
      frame(tc);
      drawCaptions(tc);
      if (tcam && typeof tcam === 'object') setCam(tcam);      // an explicit camera rect, e.g. the whole screen
      else if (camera) setCam(camera(tcam));
    };
    window.camAt = (t) => (camera ? camera(t) : { x: 0, y: 0, w: VW });
    window.setTime(Q.has('t') ? parseFloat(Q.get('t')) : 0);
  }

  window.E = {
    VW, VH, $, $$, clamp, lerp, prog, ease, rectOf, fit, fitSafe, FULL, clampCam, track, setCam,
    drawCursor, clicked, typeText, count, fmtInt, pop, rise, show, syncAnims, dimLayer, focus,
    setupCaptions, drawCaptions, scene, stage, Q,
  };
})();
