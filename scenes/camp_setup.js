/* Scene camp_setup (homepage-v2 Campaign setup): name the draft PMax - Zombies -> Product selection: add the Zombies set
   (312 of 509) -> Save & continue -> Google Merchant Center Data Feed mapping, all required attributes filled. */
(function () {
  const { $, $$, lerp, prog, ease, rectOf, fitSafe, track, drawCursor, pop, rise } = E;
  const DUR = 6.6;
  const S1 = $('#scr-1'), S2 = $('#scr-2'), S3 = $('#scr-3');
  const q = (s, r) => (r || document).querySelector(s);
  const nameV = $('#cs-name-v'), adsV = $('#cs-ads-v'), nameFld = $('#cs-name').closest('[data-input-root]'), csSave = $('#cs-save');
  const aName = $('#a-name'), aCrumb = $('#a-crumb');
  const row = $('#ps-row'), chip = $('#ps-chip'), add = $('#ps-addset'), psSave = $('#ps-save');
  const n = $('#ps-n'), sum = $('#ps-sum'), use = $('#ps-use'), bCount = $('#b-count');
  const ringA = q('#ps-ring [data-minichart-arc]'), ringS = q('#ps-sring [data-minichart-arc]');
  const prows = $$('#ps-ptable tbody tr');
  const mpRows = $$('.mp-row', S3), mpArc = q('#mp-ring [data-minichart-arc]'), mpPct = $('#mp-pct'), mpOk = q('.mp-ok', S3);
  const OLD = 'Performance Max #14', NEW = 'PMax - Zombies';

  // measure each screen alone
  const only = (el) => [S1, S2, S3].forEach((s) => { s.style.display = s === el ? '' : 'none'; });
  only(S1);
  const R1 = { card: rectOf($('#cs-card')), name: rectOf(nameFld), save: rectOf(csSave), foot: rectOf(q('.wfoot-in', S1)) };
  only(S2);
  const rowH = row.offsetHeight;
  row.style.height = '0px'; row.style.overflow = 'hidden';
  const R2 = { add: rectOf(add), filter: rectOf($('#ps-filter')), foot: rectOf($('#ps-foot')), save: rectOf(psSave) };
  row.style.height = '';
  only(S3);
  const R3 = { card: rectOf($('#mp-card')), req: rectOf($('#mp-req')) };
  const uni = (a, b) => { const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y); return { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y }; };
  const CAM = {
    s1: { x: 286, y: 118, w: 1110 },
    s2: fitSafe({ x: 292, y: 120, w: R2.filter.x + R2.filter.w + 20 - 292, h: R2.foot.y + R2.foot.h + 10 - 120 }, 10, 0),
    s3: fitSafe({ x: 292, y: 120, w: R3.card.x + R3.card.w + 20 - 292, h: R3.card.y + R3.card.h + 10 - 120 }, 10, 0),
  };
  CAM.s2.x = Math.max(CAM.s2.x, 286); CAM.s3.x = Math.max(CAM.s3.x, 286);
  const cam = track([
    [0, CAM.s1], [1.95, CAM.s1], [1.96, CAM.s2, 'lin'], [4.55, CAM.s2], [4.56, CAM.s3, 'lin'], [6.6, CAM.s3],
  ]);
  const P = (r, fx = 0.5, fy = 0.55) => [r.x + r.w * fx, r.y + r.h * fy];
  const path = [[0, 700, 600], [0.3, ...P(R1.name, 0.4)], [1.3, ...P(R1.name, 0.4)], [1.7, ...P(R1.save)],
    [2.0, 800, 600], [2.6, ...P(R2.add)], [3.4, ...P(R2.add)], [4.3, ...P(R2.save)]];
  const clicks = [0.3, 1.7, 2.6, 4.3];
  const setRing = (arc, pct) => { if (arc) arc.style.strokeDashoffset = 100 - pct; };
  const fmt = (v) => Math.round(v).toLocaleString('en-US');

  function frame(t) {
    only(t < 1.95 ? S1 : t < 4.55 ? S2 : S3);
    drawCursor(t, path, clicks, [0, 4.5]);

    // screen 1: rename the draft (both names follow)
    nameFld.classList.toggle('in-focus', t >= 0.3 && t < 1.7);
    const sel = t >= 0.3 && t < 0.42;
    const typed = t < 0.42 ? OLD : NEW.slice(0, Math.floor(Math.max(0, t - 0.42) * 22));
    nameV.textContent = typed; adsV.textContent = typed;
    nameV.classList.toggle('sel-all', sel);
    nameV.classList.toggle('typing', t >= 0.42 && t < 1.3);
    csSave.style.transform = t >= 1.7 && t < 1.82 ? 'scale(0.96)' : '';
    const nm = t >= 1.8 ? NEW : OLD;
    aName.textContent = nm; aCrumb.textContent = nm;

    // screen 2: include the Zombies set
    const g = ease.out(prog(t, 2.7, 3.05));
    row.style.height = (g * rowH) + 'px'; row.style.overflow = 'hidden'; row.style.opacity = prog(t, 2.75, 3.0);
    pop(chip, t, 2.82, 0.4, 0.85);
    const k = ease.out(prog(t, 3.1, 3.75));
    n.textContent = fmt(312 * k); sum.textContent = fmt(lerp(509, 312, k)); use.textContent = `${fmt(lerp(509, 312, k))}/509`;
    setRing(ringA, 312 * k / 509 * 100); setRing(ringS, lerp(509, 312, k) / 509 * 100);
    prows.forEach((r, i) => { r.style.opacity = t < 3.1 ? 0.35 : lerp(0.35, 1, ease.out(prog(t, 3.1 + i * 0.06, 3.5 + i * 0.06))); });
    psSave.style.transform = t >= 4.3 && t < 4.42 ? 'scale(0.96)' : '';
    bCount.textContent = t >= 4.4 ? '312 products' : '509 products';

    // screen 3: data mapping fills up
    const m = ease.out(prog(t, 4.75, 5.55));
    setRing(mpArc, 100 * m); mpPct.textContent = Math.round(100 * m) + '%';
    mpOk.style.opacity = prog(t, 5.4, 5.6);
    mpRows.forEach((r, i) => rise(r, t, 4.65 + i * 0.07, 0.35, 10));
  }

  E.scene({
    dur: DUR, frame, camera: cam,
    captions: [
      { t0: 0.3, t1: 1.9, text: 'Name it <b>PMax - Zombies</b>.' },
      { t0: 2.2, t1: 4.4, text: 'Only the <b>312 zombies</b> go in.' },
      { t0: 4.7, t1: 6.4, text: 'Google Merchant Center fields: <b>done</b>.' },
    ],
  });
})();
