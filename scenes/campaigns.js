/* Scene: Zombies campaign -> switch to PMax - ROAS in the breadcrumbs -> Exclude Zombies -> after the next
   data update the Canon kit (first click) shows up in the ROAS campaign. Real screens only. */
(function () {
  const { $, $$, lerp, prog, ease, rectOf, fitSafe, track, drawCursor, pop } = E;
  const DUR = 11.0;
  const A = $('#scr-a'), B = $('#scr-b'), ddWrap = $('#ddWrap'), ddRoas = $('#dd-roas');
  const q = (s, r) => (r || document).querySelector(s);
  const crumbA = q('header nav ol > li:last-child button', A);
  const firstCrumb = q('header nav ol > li:first-child button', A);
  const el = (p) => ({
    row: $(`#${p}-row`), chip: $(`#${p}-chip`), n: $(`#${p}-n`), sum: $(`#${p}-sum`), use: $(`#${p}-use`),
    ring: q(`#${p}-ring [data-minichart-arc]`), sring: q(`#${p}-sring [data-minichart-arc]`),
    save: $(`#${p}-save`), add: $(`#${p}-addset`), count: $(`#${p}-count`), status: $(`#${p}-status`),
    seg: $$(`#${p}-seg button`), filter: $(`#${p}-filter`), foot: $(`#${p}-foot`), summary: $(`#${p}-summary`),
  });
  const a = el('cz'), b = el('cr');
  const hero = $('#cr-pr-102448'), heroClk = hero.querySelector('.clk');
  const rest = $$('#cr-ptable tbody tr').filter((r) => r !== hero);
  const rowH = a.row.offsetHeight;

  // ---- measure: dropdown under the campaign crumb; buttons with the product set row collapsed and expanded
  const cr = rectOf(crumbA);
  ddWrap.style.left = cr.x + 'px'; ddWrap.style.top = (cr.y + cr.h + 6) + 'px';
  const collapse = (on) => [a.row, b.row].forEach((r) => { r.style.height = on ? '0px' : ''; r.style.overflow = 'hidden'; });
  collapse(true);
  const R0 = { aAdd: rectOf(a.add), bAdd: rectOf(b.add) };
  collapse(false);
  const R = {
    aFilter: rectOf(a.filter), aFoot: rectOf(a.foot), aSave: rectOf(a.save), crumb: cr, first: rectOf(firstCrumb),
    dd: rectOf(ddWrap), ddRoas: rectOf(ddRoas), bExcl: rectOf(b.seg[1]), bSave: rectOf(b.save), bSummary: rectOf(b.summary),
  };
  const prevBox = rectOf($('#cr-preview')), heroR = rectOf(hero), heroH = heroR.h;
  const uni = (p, r) => { const x = Math.min(p.x, r.x), y = Math.min(p.y, r.y); return { x, y, w: Math.max(p.x + p.w, r.x + r.w) - x, h: Math.max(p.y + p.h, r.y + r.h) - y }; };

  const selRect = { x: 286, y: R.aFilter.y - 52, w: R.aFilter.x + R.aFilter.w + 30 - 286, h: R.aFoot.y + R.aFoot.h + 14 - (R.aFilter.y - 52) };
  const CAM = {
    a0: { x: 0, y: 0, w: 1600 },
    sel: fitSafe(selRect, 0, 0),
    crumbs: fitSafe(uni(uni(R.first, R.crumb), R.dd), 30, 0),
    prev: fitSafe(uni(R.bSummary, { x: prevBox.x, y: prevBox.y, w: prevBox.w, h: heroR.y + heroH * 3.4 - prevBox.y }), 18, 0),
  };
  CAM.sel.x = Math.max(CAM.sel.x, 286);
  const push = (c, k) => ({ x: c.x + c.w * k / 2, y: c.y + c.w * 9 / 16 * k / 2, w: c.w * (1 - k) });
  const cam = track([
    [0, CAM.a0], [0.3, CAM.a0], [0.95, CAM.sel, 'io'], [2.65, push(CAM.sel, 0.03), 'lin'],
    [3.2, CAM.crumbs, 'io'], [4.45, push(CAM.crumbs, 0.03), 'lin'],
    [5.0, CAM.sel, 'io'], [6.75, push(CAM.sel, 0.03), 'lin'],
    [7.3, CAM.prev, 'io'], [11, push(CAM.prev, 0.06), 'lin'],
  ]);
  const P = (r, fx = 0.5, fy = 0.55) => [r.x + r.w * fx, r.y + r.h * fy];
  const path = [
    [0.0, 1050, 620], [0.55, ...P(R0.aAdd)], [1.9, ...P(R0.aAdd)], [2.3, ...P(R.aSave)], [2.85, ...P(R.aSave)],
    [3.35, ...P(R.crumb, 0.6)], [3.6, ...P(R.crumb, 0.6)], [3.98, ...P(R.ddRoas, 0.35)], [4.5, ...P(R.ddRoas, 0.35)],
    [5.02, ...P(R0.bAdd)], [5.6, ...P(R0.bAdd)], [5.95, ...P(R.bExcl)], [6.25, ...P(R.bExcl)], [6.6, ...P(R.bSave)],
  ];
  const clicks = [0.6, 2.35, 3.4, 4.05, 5.08, 6.0, 6.65];

  const setRing = (arc, pct) => { arc.style.strokeDashoffset = 100 - pct; };
  const segOn = (btns, idx) => {
    const wrap = btns[0].parentElement, on = wrap.dataset.segOn.split(' '), off = wrap.dataset.segOff.split(' ');
    btns.forEach((x, i) => { on.forEach((c) => x.classList.toggle(c, i === idx)); off.forEach((c) => x.classList.toggle(c, i !== idx)); });
  };
  const fmt = (v) => Math.round(v).toLocaleString('en-US');
  function counts(s, rowN, sum) {
    s.n.textContent = fmt(rowN); s.sum.textContent = fmt(sum); s.use.textContent = `${fmt(sum)}/509`; s.count.textContent = `${fmt(sum)} products`;
    setRing(s.ring, rowN / 509 * 100); setRing(s.sring, sum / 509 * 100);
  }
  function grow(s, t, t0) {
    const g = ease.out(prog(t, t0, t0 + 0.35));
    s.row.style.height = (g * rowH) + 'px'; s.row.style.overflow = 'hidden';
    s.row.style.opacity = prog(t, t0 + 0.05, t0 + 0.3);
    pop(s.chip, t, t0 + 0.12, 0.4, 0.85);
  }

  function frame(t) {
    // screens: A until the campaign switch, B after it (same layout, the crumb and the name change)
    const ab = ease.io(prog(t, 4.15, 4.27));
    A.style.display = t < 4.3 ? '' : 'none'; A.style.opacity = 1 - ab;
    B.style.display = t >= 4.15 ? '' : 'none'; B.style.opacity = ab;
    drawCursor(t, path, clicks, [0.0, 6.95]);

    // A: PMax - Zombies includes the Zombies set
    grow(a, t, 0.7);
    const ka = ease.out(prog(t, 1.1, 1.75));
    counts(a, 312 * ka, lerp(509, 312, ka));
    a.save.style.transform = t >= 2.35 && t < 2.47 ? 'scale(0.96)' : '';
    const sp = ease.back(prog(t, 2.5, 2.8)) * (1 - prog(t, 2.95, 3.2));
    a.status.style.display = 'inline-flex'; a.status.style.transform = `scale(${1 + 0.12 * sp})`;

    // campaign switcher in the breadcrumbs
    crumbA.classList.toggle('crumb-open', t >= 3.4 && t < 4.15);
    const dOpen = ease.out(prog(t, 3.45, 3.62)), dClose = prog(t, 4.1, 4.2);
    ddWrap.style.display = t >= 3.4 && t < 4.25 ? '' : 'none';
    ddWrap.style.opacity = dOpen * (1 - dClose);
    ddWrap.style.transform = `translateY(${(1 - dOpen) * -6}px) scale(${lerp(0.96, 1, dOpen)})`;
    ddRoas.classList.toggle('dd-hl', t >= 3.92 && t < 4.15);

    // B: PMax - ROAS excludes the set, Canon arrives after the next data update
    grow(b, t, 5.12);
    const kb1 = ease.out(prog(t, 5.3, 5.6)), kb2 = ease.out(prog(t, 6.05, 6.4)), kb3 = ease.out(prog(t, 7.55, 7.85));
    const excl = t >= 6.0;
    segOn(b.seg, excl ? 1 : 0);
    const rowN = !excl ? 312 * kb1 : lerp(312, 197, kb2) + kb3;
    const sum = !excl ? lerp(509, 312, kb1) : lerp(312, 197, kb2) + kb3;
    counts(b, rowN, sum);
    b.save.style.transform = t >= 6.65 && t < 6.77 ? 'scale(0.96)' : '';
    const pulse = ease.back(prog(t, 7.55, 7.85)) * (1 - prog(t, 8.6, 9.0));
    b.summary.style.boxShadow = pulse > 0.01 ? `0 0 0 ${2 * pulse}px var(--dds-color-positive-default)` : '';

    // the new row arrives at the top of the preview, the rows below slide down to make room
    const hk = ease.out(prog(t, 7.45, 7.85));
    hero.style.display = t >= 7.45 ? '' : 'none';
    hero.style.opacity = prog(t, 7.55, 7.85);
    rest.forEach((r) => {
      r.style.transform = t >= 7.45 ? `translateY(${-(1 - hk) * heroH}px)` : '';
      r.style.position = 'relative'; r.style.zIndex = 1;
      r.querySelectorAll('td').forEach((td) => { td.style.background = 'var(--dds-color-surface-lowest)'; });
    });
    const fade = 1 - 0.35 * prog(t, 9.6, 10.6);
    hero.querySelectorAll('td').forEach((td) => {
      td.style.background = `color-mix(in oklab, var(--dds-color-primary-faint) ${Math.round(100 * fade)}%, var(--dds-color-surface-lowest))`;
    });
    hero.style.outline = hk > 0.01 ? `${2 * hk}px solid var(--dds-color-primary-subtle)` : 'none'; hero.style.outlineOffset = '-2px';
    heroClk.classList.toggle('clk-new', t >= 7.6);
  }

  E.scene({
    dur: DUR, frame, camera: cam,
    captions: [
      { t0: 0.5, t1: 3.2, text: 'Zombies get their <b>own campaign</b>.' },
      { t0: 3.5, t1: 6.6, text: 'Your main campaign skips them.' },
      { t0: 7.0, t1: 10.7, text: 'First click? It <b>graduates</b> on its own.' },
    ],
  });
})();
