/* Deterministic timeline for the Product Analytics pilot scene.
   window.setTime(t) renders the frame at t seconds; nothing depends on wall-clock time. */
(function () {
  const VW = 1600, VH = 900;          // CSS viewport (rendered at 1.2x = 1920x1080)
  const DUR = 10.5;
  const $ = (s) => document.querySelector(s);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const ease = {
    io: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
    out: (k) => 1 - Math.pow(1 - k, 3),
    back: (k) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
  };

  const stage = $('#stage'), cursor = $('#cursor'), ripple = cursor.querySelector('.ripple');
  const panel = $('#ai-panel'), aiBtn = $('#ai-btn'), thinking = $('#thinking');
  const bars = [...document.querySelectorAll('.ph-chart .bar')];
  const line = $('.ph-chart .roas'), dots = [...document.querySelectorAll('.ph-chart circle')];
  const cards = ['summary', 'risk', 'opportunity', 'waste', 'next'].map((k) => $('#card-' + k));
  const opp = $('#card-opportunity'), mark = $('mark.hl');
  const heroRow = $('#hero-row'), heroBadge = heroRow && heroRow.querySelector('.mv-badge');
  const AI_W = 344;
  const dim = document.createElement('div'); dim.id = 'dim';
  stage.appendChild(dim);
  const moversCard = document.querySelector('.movers');

  // ---------- layout states we need to measure ----------
  function applyPanel(w) { panel.style.width = w + 'px'; }
  function rectOf(el) {          // element rect in stage coordinates (stage untransformed)
    const prev = stage.style.transform; stage.style.transform = 'none';
    const r = el.getBoundingClientRect();
    stage.style.transform = prev;
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  }
  applyPanel(0);
  const chartClosed = rectOf(document.querySelector('.chart-card'));
  applyPanel(AI_W);
  const R = {
    btn: rectOf(aiBtn),
    opp: rectOf(opp),
    movers: rectOf(document.querySelector('.movers')),
    hero: heroRow ? rectOf(heroRow) : null,
  };
  applyPanel(0);
  const lineLen = line.getTotalLength();

  // camera = visible rect in stage coords (x, y, width); height follows the 16:9 viewport
  const fit = (r, pad, minW) => {
    const w = Math.max(minW || 0, (r.w + pad * 2), (r.h + pad * 2) * VW / VH);
    return { x: r.x + r.w / 2 - w / 2, y: r.y + r.h / 2 - (w * VH / VW) / 2, w };
  };
  const chartCam = fit({ x: chartClosed.x, y: chartClosed.y - 70, w: chartClosed.w, h: chartClosed.h + 70 }, 24, 0);
  const CAM = {
    chart: chartCam,
    chartIn: { x: chartCam.x + chartCam.w * 0.04, y: chartCam.y + chartCam.w * 0.04 * VH / VW, w: chartCam.w * 0.92 },
    wide: { x: 0, y: 0, w: 1600 },
    opp: fit(R.opp, 40, 720),
    movers: R.hero ? fit({ x: R.movers.x, y: R.hero.y - 120, w: R.movers.w, h: 260 }, 30, 1040) : { x: 0, y: 900, w: 1600 },
  };
  // keep the camera inside the page horizontally
  for (const k in CAM) { const c = CAM[k]; c.x = clamp(c.x, 0, 1600 - c.w); c.y = Math.max(0, c.y); }

  const camKeys = [  // [time, camera, ease into this key]
    [0.0, CAM.chart],
    [1.5, CAM.chart, 'io'],
    [2.3, CAM.wide, 'io'],
    [4.6, CAM.wide, 'io'],
    [5.9, CAM.opp, 'io'],
    [7.4, CAM.opp, 'io'],
    [8.6, CAM.movers, 'io'],
    [10.5, { x: CAM.movers.x + 20, y: CAM.movers.y + 10, w: CAM.movers.w - 40 }, 'io'],
  ];
  function camAt(t) {
    let i = 0; while (i < camKeys.length - 1 && t > camKeys[i + 1][0]) i++;
    const [t0, c0] = camKeys[i], [t1, c1, e] = camKeys[Math.min(i + 1, camKeys.length - 1)];
    const k = t1 === t0 ? 1 : (ease[e || 'io'])(prog(t, t0, t1));
    return { x: lerp(c0.x, c1.x, k), y: lerp(c0.y, c1.y, k), w: lerp(c0.w, c1.w, k) };
  }

  // cursor path: appears, travels to the AI Insights button, clicks
  const bx = R.btn.x + R.btn.w * 0.5, by = R.btn.y + R.btn.h * 0.55;
  const cur0 = { x: 1080, y: 520 };
  const CLICK = 2.45;

  function render(t, camOverride) {
    // CSS animations from the design system follow the timeline too (hover transitions stay live for the interactive tour)
    document.getAnimations().forEach((a) => { if (window.CSSTransition && a instanceof CSSTransition) return; a.pause(); a.currentTime = (t * 1000) % 100000; });

    // chart intro
    bars.forEach((b, i) => {
      const k = ease.out(prog(t, 0.05 + i * 0.025, 0.55 + i * 0.025));
      b.style.transform = `scaleY(${k})`;
    });
    const lk = ease.io(prog(t, 0.6, 1.7));
    line.style.strokeDasharray = lineLen; line.style.strokeDashoffset = lineLen * (1 - lk);
    dots.forEach((d, i) => { const k = ease.back(prog(t, 1.55 + i * 0.12, 1.85 + i * 0.12)); d.style.transformBox = 'fill-box'; d.style.transformOrigin = 'center'; d.style.transform = `scale(${k})`; });

    // cursor
    const ca = prog(t, 1.3, 1.6), cm = ease.io(prog(t, 1.5, CLICK - 0.05)), co = 1 - prog(t, 3.2, 3.5);
    cursor.style.opacity = Math.min(ca, co);
    const cx = lerp(cur0.x, bx, cm), cy = lerp(cur0.y, by, cm) + Math.sin(cm * Math.PI) * -40;
    const press = t >= CLICK && t < CLICK + 0.14 ? 0.86 : 1;
    cursor.style.transform = `translate(${cx}px, ${cy}px) scale(${press})`;
    const rp = prog(t, CLICK, CLICK + 0.45);
    ripple.style.opacity = t >= CLICK ? 0.35 * (1 - rp) : 0;
    ripple.style.transform = `scale(${0.4 + rp * 1.4})`;

    // button state
    if (t >= CLICK) aiBtn.setAttribute('data-active', 'true'); else aiBtn.removeAttribute('data-active');
    aiBtn.style.transform = t >= CLICK && t < CLICK + 0.12 ? 'scale(0.96)' : '';

    // panel slides in
    applyPanel(Math.round(AI_W * ease.out(prog(t, CLICK + 0.08, CLICK + 0.7))));

    // thinking state, then cards
    const th = prog(t, 2.9, 3.05) * (1 - prog(t, 3.55, 3.7));
    thinking.style.height = (th * 34) + 'px'; thinking.style.opacity = th;
    cards.forEach((c, i) => {
      const k = ease.out(prog(t, 3.65 + i * 0.22, 4.15 + i * 0.22));
      c.style.opacity = k; c.style.transform = `translateY(${(1 - k) * 14}px)`;
    });

    // focus on the Opportunity card
    const f = ease.io(prog(t, 5.4, 6.0)) * (1 - ease.io(prog(t, 7.6, 8.1)));
    opp.style.boxShadow = `0 0 0 ${2 * f}px var(--dds-color-positive-default), 0 ${10 * f}px ${28 * f}px rgba(51,62,71,${0.16 * f})`;
    opp.style.transform = (opp.style.transform || '') + ` scale(${1 + 0.02 * f})`;
    const mfocus = ease.io(prog(t, 8.2, 8.7));
    dim.style.opacity = Math.max(f, mfocus) * 0.32;
    opp.style.position = 'relative'; opp.style.zIndex = f > 0 ? 30 : '';
    moversCard.style.position = 'relative'; moversCard.style.zIndex = mfocus > 0 ? 30 : '';
    if (mark) mark.style.backgroundSize = `${ease.io(prog(t, 6.1, 6.7)) * 100}% 100%`;

    // revenue movers: hero row
    if (heroRow) {
      const hk = ease.io(prog(t, 8.3, 8.8));
      heroRow.querySelectorAll('td').forEach((td) => {
        td.style.background = `color-mix(in oklab, var(--dds-color-primary-faint) ${hk * 100}%, transparent)`;
      });
      heroRow.style.outline = hk > 0 ? `${2 * hk}px solid var(--dds-color-primary-subtle)` : 'none';
      if (heroBadge) { const bk = ease.back(prog(t, 8.7, 9.1)); heroBadge.style.transform = `scale(${bk})`; heroBadge.style.opacity = clamp(bk); }
    }

    // camera
    const camQ = new URLSearchParams(location.search).get('cam');
    const c = camOverride || (camQ ? (([x, y, w]) => ({ x, y, w }))(camQ.split(',').map(Number)) : camAt(t));
    const s = VW / c.w;
    stage.style.transform = `scale(${s}) translate(${-c.x}px, ${-c.y}px)`;
  }

  const setTime = (t) => render(t);
  window.DUR = DUR;
  window.setTime = setTime;
  // interactive tour: content time and camera (a time on the camera track, or an explicit rect) apart
  window.setSplit = (tc, tcam) => render(tc, tcam && typeof tcam === 'object' ? tcam : camAt(tcam));
  window.camAt = camAt;
  const q = new URLSearchParams(location.search);
  setTime(q.has('t') ? parseFloat(q.get('t')) : 0);
})();
