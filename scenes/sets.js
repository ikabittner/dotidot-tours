/* Scene: build the Zombies product set. */
(function () {
  const { $, $$, clamp, lerp, prog, ease, rectOf, fit, fitSafe, track, drawCursor, typeText, count, pop, rise, focus, dimLayer } = E;
  const DUR = 8.6;
  const nameV = $('#set-name'), nameFld = nameV.closest('[data-input-root]');
  const c1 = $('#c1'), c2 = $('#c2'), andor = $('#andor');
  const v1 = $('#c1-var'), v2 = $('#c2-var'), val1 = $('#c1-val'), val2 = $('#c2-val');
  const n1 = $('#c1-n'), n2 = $('#c2-n'), sumN = $('#sum-n');
  const ring = (id) => $(id + ' [data-minichart-arc]');
  const r1 = ring('#c1-ring'), r2 = ring('#c2-ring'), rs = ring('#sum-ring');
  const sel1 = v1.closest('[data-select-trigger]'), sel2 = v2.closest('[data-select-trigger]');
  const op1 = val1.closest('[data-number-input-root]'), op2 = val2.closest('[data-number-input-root]');
  const addBtn = $('#where-add button'), save = $('#save-btn');
  const toastWrap = $('#toast'), toastCard = $('#toast-card');
  const hero = $('#row-102448'), rows = $$('#prev-table tbody tr');
  const dim = dimLayer();
  E.stage.appendChild(toastWrap);   // position the toast in stage coordinates

  // final layout for measuring
  const c2H = c2.offsetHeight + 14;
  const R = {
    name: rectOf($('#name-card')), where: rectOf($('#where')), summary: rectOf($('#summary')),
    sel1: rectOf(sel1), op1: rectOf(op1), sel2: rectOf(sel2), op2: rectOf(op2), add: rectOf(addBtn),
    preview: rectOf($('#preview')), hero: rectOf(hero), save: rectOf(save), foot: rectOf($('#foot')),
    title: rectOf($('.page-title')),
  };
  const union = (a, b) => { const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y); return { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y }; };
  const CAM = {
    open: fitSafe(union(R.title, R.where), 30, 0),
    where: fitSafe(union(R.where, R.summary), 30, 0),
    whereTight: fitSafe({ x: R.where.x, y: R.where.y, w: R.where.w, h: R.summary.y + R.summary.h - R.where.y }, 16, 0),
    preview: fitSafe(R.preview, 30, 0),
    hero: fitSafe({ x: R.preview.x, y: R.hero.y - 70, w: R.preview.w * 0.62, h: 150 }, 16, 0),
    end: fitSafe({ x: R.foot.x, y: R.hero.y - 40, w: 980, h: R.foot.y + R.foot.h - R.hero.y + 40 }, 16, 0),
  };
  const cam = track([
    [0.0, CAM.open], [1.2, CAM.open, 'io'], [1.9, CAM.where, 'io'], [4.9, CAM.whereTight, 'io'],
    [5.5, CAM.whereTight, 'io'], [6.3, CAM.hero, 'io'], [7.0, CAM.hero, 'io'], [7.6, CAM.end, 'io'], [8.6, CAM.end, 'io'],
  ]);
  const P = (r, fx = 0.5, fy = 0.55) => [r.x + r.w * fx, r.y + r.h * fy];
  const path = [
    [0.0, ...P(R.name, 0.75, 0.9)], [0.3, ...P(rectOf(nameFld), 0.3, 0.6)],
    [1.1, ...P(rectOf(nameFld), 0.3, 0.6)], [1.45, ...P(R.sel1, 0.45)],
    [2.1, ...P(R.sel1, 0.45)], [2.35, ...P(R.op1, 0.6)],
    [3.0, ...P(R.op1, 0.6)], [3.5, ...P(R.add, 0.5)],
    [3.95, ...P(R.add, 0.5)], [4.15, ...P(R.sel2, 0.45)],
    [4.6, ...P(R.sel2, 0.45)], [4.8, ...P(R.op2, 0.45)],
    [5.3, ...P(R.op2, 0.45)], [7.0, ...P(R.foot, 0.5, 0.2)], [7.45, ...P(R.save, 0.5)],
  ];
  const clicks = [0.3, 1.45, 2.35, 3.5, 4.15, 4.8, 7.5];

  function setRing(arc, pct) { arc.style.strokeDashoffset = 100 - pct; }

  function frame(t) {
    const c = cam(t);
    drawCursor(t, path, clicks, [0.0, 8.4]);

    // name
    nameFld.classList.toggle('in-focus', t >= 0.3 && t < 1.45);
    typeText(nameV, 'Zombies', t, 0.45, 14);

    // condition 1
    sel1.classList.toggle('in-focus', t >= 1.45 && t < 2.35);
    typeText(v1, 'ads_last_60d_clicks', t, 1.55, 34);
    op1.classList.toggle('in-focus', t >= 2.35 && t < 3.0);
    typeText(val1, '0', t, 2.5, 10);
    const k1 = ease.out(prog(t, 2.6, 2.95));
    count(n1, 0, 334, t, 2.6, 2.95);
    setRing(r1, k1 * 334 / 509 * 100);

    // condition 2 grows in after "Add condition"
    const g = ease.out(prog(t, 3.55, 3.95));
    c2.style.height = (g * c2H) + 'px'; c2.style.marginBottom = '0px'; c2.style.overflow = 'hidden';
    c2.style.opacity = prog(t, 3.65, 3.95);
    andor.style.opacity = prog(t, 3.65, 3.95);
    sel2.classList.toggle('in-focus', t >= 4.15 && t < 4.8);
    typeText(v2, 'first_seen_on', t, 4.22, 34);
    op2.classList.toggle('in-focus', t >= 4.8 && t < 5.4);
    typeText(val2, '7', t, 4.9, 10);
    count(n2, 0, 487, t, 5.0, 5.35);
    setRing(r2, ease.out(prog(t, 5.0, 5.35)) * 487 / 509 * 100);

    // summary: 509 -> 334 -> 312
    const s1 = ease.out(prog(t, 2.6, 2.95)), s2 = ease.out(prog(t, 5.0, 5.4));
    const sum = lerp(lerp(509, 334, s1), 312, s2);
    sumN.textContent = Math.round(sum).toLocaleString('en-US');
    setRing(rs, sum / 509 * 100);
    const sp = ease.back(prog(t, 5.55, 5.9)) * (1 - prog(t, 6.0, 6.3));
    $('#summary').style.transform = `scale(${1 + 0.03 * sp})`;
    $('#summary').style.boxShadow = sp > 0.01 ? `0 0 0 ${2 * sp}px var(--dds-color-positive-default)` : '';

    // preview rows refresh, hero row focus
    rows.forEach((r, i) => { const k = ease.out(prog(t, 5.6 + i * 0.05, 5.95 + i * 0.05)); r.style.opacity = 0.25 + 0.75 * k; });
    const hf = ease.io(prog(t, 6.3, 6.6)) * (1 - ease.io(prog(t, 7.2, 7.5)));
    hero.querySelectorAll('td').forEach((td) => { td.style.background = `color-mix(in oklab, var(--dds-color-primary-faint) ${hf * 100}%, var(--dds-color-surface-lowest))`; });
    hero.style.outline = hf > 0.01 ? `${2 * hf}px solid var(--dds-color-primary-subtle)` : 'none';
    hero.style.outlineOffset = '-2px';

    // save + toast (toast placed at the top-right of the current camera frame)
    save.style.transform = t >= 7.5 && t < 7.62 ? 'scale(0.96)' : '';
    const tk = ease.out(prog(t, 7.7, 8.05));
    const s = 1600 / c.w;
    toastWrap.style.left = (c.x + c.w - 20 / s - 380) + 'px';
    toastWrap.style.top = (c.y + 16 / s) + 'px';
    toastWrap.style.transformOrigin = '100% 0';
    toastWrap.style.transform = `scale(${1 / s * 1.4}) translateX(${(1 - tk) * 40}px)`;
    toastWrap.style.opacity = tk;
  }

  E.scene({
    dur: DUR, frame, camera: cam,
    captions: [
      { t0: 0.6, t1: 3.3, text: 'One product set catches every <b>zombie</b>.' },
      { t0: 3.7, t1: 6.1, text: 'Zero clicks. Live for 7+ days.' },
      { t0: 6.2, t1: 7.25, text: '<b>312 products</b> nobody has seen. Yet.' },
    ],
  });
})();
