/* Scene camp_ads (homepage-v2 Campaign setup): asset group with one ad per product in the preview -> Save draft ->
   Google Ads: daily budget 50, Maximize conversions value with Target ROAS 400 % -> Save. */
(function () {
  const { $, $$, prog, ease, rectOf, fitSafe, track, drawCursor, rise } = E;
  const DUR = 4.1;
  const S1 = $('#scr-1'), S2 = $('#scr-2');
  const agSave = $('#ag-save'), ads = $$('.ad', S1);
  const bV = $('#ga-b-v'), rV = $('#ga-r-v'), bFld = $('#ga-b').closest('[data-input-root]'), rFld = $('#ga-r').closest('[data-input-root]');
  const gaSave = $('#ga-save'), wzGa = $('#g-wz-ga');

  const only = (el) => [S1, S2].forEach((s) => { s.style.display = s === el ? '' : 'none'; });
  only(S1);
  const R1 = { save: rectOf(agSave), prev: rectOf($('#ag-prev')) };
  only(S2);
  const R2 = { b: rectOf(bFld), r: rectOf(rFld), save: rectOf(gaSave), col: rectOf($('.wcol', S2)), foot: rectOf($('.wfoot-in', S2)) };
  const CAM = {
    s1: { x: 0, y: 0, w: 1600 },        // whole screen: Save draft stays clear of Hoppy
    s2: { x: 286, y: 118, w: 1110 },
  };
  const cam = track([[0, CAM.s1], [0.95, CAM.s1], [0.96, CAM.s2, 'lin'], [4.1, CAM.s2]]);
  const P = (r, fx = 0.5, fy = 0.55) => [r.x + r.w * fx, r.y + r.h * fy];
  const path = [[0, 900, 500], [0.45, ...P(R1.save)], [0.8, ...P(R1.save)], [1.0, 900, 500], [1.4, ...P(R2.b, 0.6)], [2.0, ...P(R2.b, 0.6)],
    [2.4, ...P(R2.r, 0.6)], [2.95, ...P(R2.r, 0.6)], [3.3, ...P(R2.save)]];
  const clicks = [0.5, 1.4, 2.4, 3.3];

  function frame(t) {
    only(t < 0.95 ? S1 : S2);
    drawCursor(t, path, clicks, [0, 3.6]);
    ads.forEach((a, i) => rise(a, t, -0.6 + i * 0.1, 0.3, 8));   // already in place at t = 0, settle in a scrub back
    agSave.style.transform = t >= 0.5 && t < 0.62 ? 'scale(0.96)' : '';

    bFld.classList.toggle('in-focus', t >= 1.4 && t < 2.4);
    bV.textContent = t < 1.48 ? '' : '50'.slice(0, Math.floor((t - 1.48) * 14) + 1);
    rFld.classList.toggle('in-focus', t >= 2.4 && t < 3.3);
    rV.textContent = t < 2.48 ? '' : '400'.slice(0, Math.floor((t - 2.48) * 14) + 1);
    gaSave.style.transform = t >= 3.3 && t < 3.42 ? 'scale(0.96)' : '';
    wzGa.classList.toggle('cur', t < 3.45);
    wzGa.classList.toggle('done', t >= 3.45);
  }

  E.scene({
    dur: DUR, frame, camera: cam,
    captions: [
      { t0: 0.1, t1: 0.9, text: 'One ad for <b>every product</b>.' },
      { t0: 1.2, t1: 3.9, text: 'Budget and <b>Target ROAS</b>. Done.' },
    ],
  });
})();
