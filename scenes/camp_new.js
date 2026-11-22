/* Scene camp_new (homepage-v2 Campaign setup): Campaigns -> + -> Performance Max -> pick the data source -> Save & continue. */
(function () {
  const { $, lerp, prog, ease, rectOf, fitSafe, track, drawCursor } = E;
  const DUR = 4.0;
  const S1 = $('#scr-1'), S2 = $('#scr-2');
  const backdrop = $('#backdrop'), mwrap = $('#mwrap'), modal = $('#modal'), plus = $('#plus-btn'), tPmax = $('#tile-pmax');
  const card = $('#src-card'), info = $('#src-info'), save = $('#src-save');

  const only = (el) => [S1, S2].forEach((s) => { s.style.display = s === el ? '' : 'none'; });
  only(S1); mwrap.style.opacity = 1;
  const R1 = { plus: rectOf(plus), modal: rectOf(modal), tile: rectOf(tPmax) };
  only(S2);
  info.style.height = 'auto'; const infoH = info.offsetHeight; info.style.height = '0px';
  card.classList.add('on'); info.style.height = infoH + 'px';
  const R2 = { col: rectOf($('.wcol', S2)), card: rectOf(card), save: rectOf(save), foot: rectOf($('.wfoot-in', S2)) };
  card.classList.remove('on'); info.style.height = '0px';
  const uni = (a, b) => { const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y); return { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y }; };
  const CAM = {
    full: { x: 0, y: 0, w: 1600 },
    modal: fitSafe(R1.modal, 24, 0),
    col: { x: 286, y: 118, w: 1110 },   // the step, its column and the sticky footer; the wizard menu stays out
  };
  const cam = track([
    [0, CAM.full], [0.45, CAM.full], [1.0, CAM.modal, 'io'], [1.75, CAM.modal, 'io'],
    [1.76, CAM.col, 'lin'], [4.0, CAM.col, 'io'],
  ]);
  const P = (r, fx = 0.5, fy = 0.55) => [r.x + r.w * fx, r.y + r.h * fy];
  const path1 = [[0.0, 700, 500], [0.35, ...P(R1.plus)], [0.85, ...P(R1.plus)], [1.4, ...P(R1.tile, 0.3)]];
  const path2 = [[1.75, 900, 500], [2.3, ...P(R2.card, 0.3, 0.1)], [2.8, ...P(R2.card, 0.3, 0.1)], [3.35, ...P(R2.save)]];
  const clicks = [0.4, 1.5, 2.4, 3.4];

  function frame(t) {
    only(t < 1.75 ? S1 : S2);
    drawCursor(t, t < 1.75 ? path1 : path2, clicks, t < 1.75 ? [0, 1.75] : [1.75, 3.7]);
    const mk = ease.out(prog(t, 0.45, 0.75));
    backdrop.style.opacity = mk; mwrap.style.opacity = mk;
    backdrop.style.pointerEvents = mwrap.style.pointerEvents = mk > 0.5 ? '' : 'none';
    mwrap.style.transform = `translateY(${(1 - mk) * 16}px) scale(${lerp(0.98, 1, mk)})`;
    plus.style.transform = t >= 0.4 && t < 0.52 ? 'scale(0.94)' : '';
    tPmax.classList.toggle('tile-hover', t >= 1.3 && t < 1.75);

    // pick the data source: the card turns selected and opens its info box
    card.classList.toggle('on', t >= 2.4);
    const k = ease.out(prog(t, 2.45, 2.85));
    info.style.height = (k * infoH) + 'px'; info.style.opacity = k;
    save.style.transform = t >= 3.4 && t < 3.52 ? 'scale(0.96)' : '';
  }

  E.scene({ dur: DUR, frame, camera: cam, captions: [{ t0: 0.5, t1: 3.6, text: 'A new <b>Performance Max</b> campaign.' }] });
})();
