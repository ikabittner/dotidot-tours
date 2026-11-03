/* Captions for the Product Analytics scene (anim.js keeps its own timeline). */
(function () {
  const base = window.setTime;
  E.setupCaptions([
    { t0: 2.7, t1: 5.3, text: '<b>AI Insights</b> tells you what changed.' },
    { t0: 5.7, t1: 8.0, text: 'The camera went from <b>zero</b> to <b>742% ROAS</b>.' },
    { t0: 8.4, t1: 10.4, text: 'Revived zombie. Now a top mover.' },
  ]);
  window.setTime = function (t) { base(t); E.drawCaptions(t); };
  window.setTime(E.Q.has('t') ? parseFloat(E.Q.get('t')) : 0);
})();
