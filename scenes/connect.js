/* Scene: connect the feed, products import, enrichments. */
(function () {
  const { $, $$, clamp, lerp, prog, ease, rectOf, fitSafe, track, drawCursor, typeText, count, pop, rise } = E;
  const DUR = 9.6;
  const S1 = $('#scr-1'), S2 = $('#scr-2'), S3 = $('#scr-3');
  const backdrop = $('#backdrop'), mwrap = $('#mwrap'), modal = $('#modal'), tileFeed = $('#tile-feed'), plus = $('#plus-btn');
  const fname = $('#feed-name'), furl = $('#feed-url');
  const fnameFld = fname.closest('[data-input-root]'), furlFld = furl.closest('[data-input-root]'), addDs = $('#add-ds');
  const rows = $$('#imp-table tbody tr'), dsCount = $('#ds-count'), busy = $('#ds-status-busy'), done = $('#ds-status');
  const enrPanel = $('#en-panel'), enr = [0, 1, 2].map((i) => $('#en-' + i)), cells = $$('.enr');
  const URL = 'https://demoshop.dotidot.io/real-demo/products.csv';

  // measure each screen with only that screen displayed
  const only = (el) => [S1, S2, S3].forEach((s) => { s.style.display = s === el ? '' : 'none'; });
  only(S1); mwrap.style.opacity = 1;
  const R1 = { plus: rectOf(plus), tile: rectOf(tileFeed), modal: rectOf(modal) };
  only(S2);
  const R2 = { name: rectOf(fnameFld), url: rectOf(furlFld), add: rectOf(addDs), col: rectOf($('.vcol', S2)), card: rectOf($('#f-url')) };
  only(S3);
  const R3 = { table: rectOf($('#imp-card')), panel: rectOf(enrPanel), title: rectOf($('.page-title', S3)), head: rectOf($('header', S3)) };
  const uni = (a, b) => { const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y); return { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y }; };
  const CAM = {
    s1: { x: 0, y: 0, w: 1600 },
    s1m: fitSafe({ x: R1.modal.x, y: R1.modal.y, w: R1.modal.w, h: 560 }, 10, 0),
    s1t: fitSafe(uni(R1.tile, { x: R1.tile.x, y: R1.tile.y - 60, w: R1.tile.w, h: 220 }), 40, 0),
    s2: fitSafe(uni(R2.name, R2.card), 40, 0),
    s2u: fitSafe(R2.card, 50, 0),
    s3: fitSafe({ x: 292, y: 64, w: 1308, h: R3.table.y + R3.table.h - 64 }, 0, 0),
    s3e: fitSafe(uni(R3.panel, { x: R3.panel.x - 420, y: R3.panel.y, w: 10, h: 10 }), 24, 0),
  };
  CAM.s3 = { x: 286, y: 58, w: 1314 };
  if (CAM.s3e.x + CAM.s3e.w > 1600) CAM.s3e.x = 1600 - CAM.s3e.w;
  const cam = track([
    [0, CAM.s1], [0.45, CAM.s1], [0.95, CAM.s1m, 'io'], [1.3, CAM.s1t, 'io'], [1.75, CAM.s1t, 'io'],
    [1.76, CAM.s2, 'lin'], [2.5, CAM.s2, 'io'], [2.9, CAM.s2u, 'io'], [4.1, { x: CAM.s2u.x + 8, y: CAM.s2u.y + 5, w: CAM.s2u.w - 16 }, 'io'],
    [4.62, CAM.s2, 'io'], [4.63, CAM.s3, 'lin'], [6.3, { x: CAM.s3.x + 10, y: CAM.s3.y + 6, w: CAM.s3.w - 20 }, 'io'],
    [6.9, CAM.s3e, 'io'], [8.6, { x: CAM.s3e.x + 8, y: CAM.s3e.y + 5, w: CAM.s3e.w - 16 }, 'io'], [9.6, CAM.s3, 'io'],
  ]);
  const P = (r, fx = 0.5, fy = 0.55) => [r.x + r.w * fx, r.y + r.h * fy];
  const path1 = [[0.0, 700, 500], [0.35, ...P(R1.plus)], [0.85, ...P(R1.plus)], [1.4, ...P(R1.tile, 0.3)]];
  const path2 = [[1.75, R2.name.x + 120, R2.name.y + 60], [1.95, ...P(R2.name, 0.3)], [2.6, ...P(R2.name, 0.3)], [2.85, ...P(R2.url, 0.2)],
    [4.0, ...P(R2.url, 0.75)], [4.35, ...P(R2.add)]];
  const clicks = [0.4, 1.5, 1.98, 2.9, 4.4];

  function frame(t) {
    const s = t < 1.75 ? 1 : t < 4.62 ? 2 : 3;
    only(s === 1 ? S1 : s === 2 ? S2 : S3);
    drawCursor(t, s === 1 ? path1 : path2, clicks, s === 1 ? [0, 1.75] : s === 2 ? [1.75, 4.5] : [99, 99]);

    // screen 1: modal pops
    const mk = ease.out(prog(t, 0.45, 0.75));
    backdrop.style.opacity = mk; mwrap.style.opacity = mk;
    backdrop.style.pointerEvents = mwrap.style.pointerEvents = mk > 0.5 ? '' : 'none';   // a closed modal must not catch the pointer
    mwrap.style.transform = `translateY(${(1 - mk) * 16}px) scale(${lerp(0.98, 1, mk)})`;
    tileFeed.classList.toggle('tile-hover', t >= 1.3);
    plus.style.transform = t >= 0.4 && t < 0.52 ? 'scale(0.94)' : '';

    // screen 2: type name + URL
    fnameFld.classList.toggle('in-focus', t >= 1.98 && t < 2.9);
    typeText(fname, 'Demo Shop feed', t, 2.05, 26);
    furlFld.classList.toggle('in-focus', t >= 2.9 && t < 4.4);
    typeText(furl, URL, t, 2.95, 46);
    addDs.style.transform = t >= 4.4 && t < 4.52 ? 'scale(0.96)' : '';

    // screen 3: rows stream in, counter, status
    rows.forEach((r, i) => rise(r, t, 4.75 + i * 0.09, 0.35, 10));
    count(dsCount, 0, 509, t, 4.75, 5.9, (v) => `${Math.round(v)} products`);
    const upd = t >= 6.0;
    busy.style.display = upd ? 'none' : ''; done.style.display = upd ? '' : 'none';
    if (upd) pop(done, t, 6.0, 0.35, 0.7);

    // enrichments
    rise(enrPanel, t, 6.35, 0.45, 24);
    enr.forEach((row, i) => {
      const t0 = 7.0 + i * 0.45;
      const btn = row.querySelector('.en-btn'), ok = row.querySelector('.en-ok');
      btn.style.opacity = 1 - prog(t, t0, t0 + 0.15);
      const k = ease.back(prog(t, t0 + 0.05, t0 + 0.4));
      ok.style.opacity = clamp(prog(t, t0 + 0.05, t0 + 0.2)); ok.style.transform = `scale(${lerp(0.6, 1, k)})`;
    });
    cells.forEach((c, i) => {
      const v = +c.dataset.v, t0 = 7.6 + i * 0.05;
      if (t < t0) { c.textContent = '—'; c.classList.remove('zero'); }
      else { c.textContent = v === 0 ? '0' : String(Math.round(lerp(0, v, ease.out(prog(t, t0, t0 + 0.5))))); c.classList.toggle('zero', v === 0); }
    });
  }

  E.scene({
    dur: DUR, frame, camera: cam,
    captions: [
      { t0: 0.5, t1: 4.3, text: 'Plug in your <b>product feed</b>.' },
      { t0: 4.9, t1: 6.3, text: 'All <b>509 products</b> in.' },
      { t0: 6.6, t1: 9.3, text: '<b>Merchant Center</b>, <b>Google Ads</b>, <b>Meta</b>. Done.' },
    ],
  });
})();
