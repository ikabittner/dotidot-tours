/* Scene: build "Title - optimized" from two variables, preview updates live. */
(function () {
  const { $, $$, clamp, lerp, prog, ease, rectOf, fitSafe, track, drawCursor, typeText, pop } = E;
  const DUR = 7.6;
  const nameV = $('#var-name'), nameFld = nameV.closest('[data-input-root]');
  const chipType = $('#chip-type'), chipName = $('#chip-name'), sp = $('#vi-sp');
  const vi = $('#vi'), viBox = vi.firstElementChild, insertBtn = vi.querySelector('[data-icon-button]');
  const rows = $$('.pv-row'), save = $('#save-var');
  const toastWrap = $('#toast'), hero = $('#pv-102448');
  E.stage.appendChild(toastWrap);
  const R = {
    name: rectOf($('#name-card')), content: rectOf($('#content-card')), vi: rectOf(vi), ins: rectOf(insertBtn),
    pv: rectOf($('#pv')), hero: rectOf(hero), save: rectOf(save), foot: rectOf($('#vfoot')), nameFld: rectOf(nameFld),
  };
  const uni = (a, b) => { const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y); return { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y }; };
  const firstRows = uni(rectOf(rows[0]), rectOf(rows[3]));
  const CAM = {
    open: fitSafe(uni(R.name, R.content), 24, 0),
    both: fitSafe(uni(uni(R.content, R.name), { x: R.pv.x, y: R.content.y, w: R.pv.w, h: 10 }), 20, 0),
    wide: fitSafe(uni(R.content, firstRows), 14, 0),
    hero: fitSafe(uni(rectOf(rows[0]), rectOf(rows[2])), 30, 0),
    end: fitSafe(uni(uni(R.name, R.foot), { x: R.pv.x, y: R.name.y, w: R.pv.w, h: 10 }), 24, 0),
  };
  const cam = track([
    [0, CAM.open], [1.1, CAM.open], [1.7, CAM.wide, 'io'], [4.3, CAM.wide, 'io'], [5.0, CAM.hero, 'io'],
    [6.0, CAM.hero, 'io'], [6.5, CAM.end, 'io'], [7.6, CAM.end],
  ]);
  const P = (r, fx = 0.5, fy = 0.55) => [r.x + r.w * fx, r.y + r.h * fy];
  const path = [
    [0.0, ...P(R.name, 0.85, 1.2)], [0.3, ...P(R.nameFld, 0.35)], [1.2, ...P(R.nameFld, 0.35)], [1.6, ...P(R.ins)],
    [2.55, ...P(R.ins)], [2.95, ...P(R.ins)], [5.9, R.save.x + R.save.w * 0.5, R.save.y - 120], [6.35, ...P(R.save)],
  ];
  const clicks = [0.3, 1.65, 2.95, 6.4];

  function frame(t) {
    const c = cam(t);
    drawCursor(t, path, clicks, [0, 7.3]);
    nameFld.classList.toggle('in-focus', t >= 0.3 && t < 1.6);
    typeText(nameV, 'Title - optimized', t, 0.4, 26);
    viBox.classList.toggle('in-focus', t >= 1.65 && t < 4.0);

    // chips drop into the input
    const k1 = prog(t, 1.85, 2.2), k2 = prog(t, 3.15, 3.5);
    chipType.style.display = t >= 1.85 ? '' : 'none'; pop(chipType, t, 1.85, 0.35, 0.5);
    sp.textContent = t >= 2.45 ? ' ' : '';
    chipName.style.display = t >= 3.15 ? '' : 'none'; pop(chipName, t, 3.15, 0.35, 0.5);

    // preview rows follow the input
    rows.forEach((r, i) => {
      const type = r.querySelector('.pv-type'), name = r.querySelector('.pv-name'), empty = r.querySelector('.pv-empty');
      const a = ease.out(prog(t, 2.15 + i * 0.06, 2.45 + i * 0.06)), b = ease.out(prog(t, 3.45 + i * 0.06, 3.75 + i * 0.06));
      type.style.display = t >= 2.15 + i * 0.06 ? '' : 'none'; type.style.opacity = a;
      name.style.display = t >= 3.45 + i * 0.06 ? '' : 'none'; name.style.opacity = b;
      empty.style.display = t < 2.15 + i * 0.06 ? '' : 'none';
      const hl = ease.io(prog(t, 2.2, 2.5)) * (1 - ease.io(prog(t, 5.6, 6.2)));
      type.style.background = `color-mix(in oklab, var(--dds-color-positive-faint) ${hl * 100}%, transparent)`;
      type.style.color = hl > 0.5 ? 'var(--dds-color-positive-bold, var(--dds-color-positive-default))' : '';
      type.style.fontWeight = hl > 0.5 ? '600' : '';
    });
    const hf = ease.io(prog(t, 4.5, 4.9)) * (1 - ease.io(prog(t, 5.9, 6.2)));
    hero.style.background = `color-mix(in oklab, var(--dds-color-primary-faint) ${hf * 100}%, transparent)`;
    hero.style.boxShadow = hf > 0.01 ? `inset 3px 0 0 var(--dds-color-primary-default)` : '';

    save.style.transform = t >= 6.4 && t < 6.52 ? 'scale(0.96)' : '';
    const tk = ease.out(prog(t, 6.6, 6.95));
    const s = 1600 / c.w;
    toastWrap.style.left = (c.x + c.w - 20 / s - 380) + 'px';
    toastWrap.style.top = (c.y + 16 / s) + 'px';
    toastWrap.style.transformOrigin = '100% 0';
    toastWrap.style.transform = `scale(${1 / s * 1.3}) translateX(${(1 - tk) * 40}px)`;
    toastWrap.style.opacity = tk;
  }

  E.scene({
    dur: DUR, frame, camera: cam,
    captions: [
      { t0: 0.5, t1: 2.9, text: 'Better titles with <b>variables</b>.' },
      { t0: 3.2, t1: 5.8, text: 'Built once. Applied to all <b>509 products</b>.' },
    ],
  });
})();
