/* Scene: ask the AI assistant (Dotidot MCP) about the zombies, get an answer from real data, confirm one change.
   Timeline from the video's MCP scene, re-timed so every click has its own moment (the tour stops before each). */
(function () {
  const { $, $$, clamp, lerp, prog, ease } = E;
  const PROMPT = 'Are my zombie products selling yet?';
  const TYPE0 = 1.5, SEND = 3.75, CONF = SEND + 4.55, DUR = CONF + 1.6;
  const steps = { bubble: $('#stBubble'), tools: $('#stTools'), answer: $('#stAnswer'), rows: $('#stRows'), plan: $('#stPlan') };
  const tools = $$('[data-tool]'), rows = $$('[data-row]');
  const pulse = (t, s, up, down) => clamp(prog(t, s, s + up) - prog(t, s + up, s + up + down));
  const blink = (t, s) => Math.floor((t - s) / 0.5) % 2 === 0;
  const typeAt = (() => { const out = []; let tt = TYPE0; for (let i = 0; i < PROMPT.length; i++) { tt += (PROMPT[i] === ' ' ? 0.082 : 0.048) + Math.sin(i * 12.9898) * 0.012; out.push(tt); } return out; })();
  const typed = (t) => { let n = 0; while (n < typeAt.length && typeAt[n] <= t) n++; return n; };
  const nat = {};
  Object.keys(steps).forEach((k) => { const el = steps[k]; el.style.display = ''; el.style.height = 'auto'; nat[k] = el.offsetHeight; });
  function grow(el, h, x) { el.style.display = x > 0 ? '' : 'none'; el.style.height = (h * x) + 'px'; el.style.marginTop = (12 * x) + 'px'; el.style.opacity = clamp(x * 1.4); }

  function frame(u) {
    const ch = prog(u, 0.4, 0.8), chip = $('#chip');
    chip.style.opacity = clamp(ch * 5); chip.style.transform = `scale(${lerp(0.75, 1, ease.back(ch))})`;
    const n = typed(u), sending = u >= SEND + 0.1;
    const txt = u >= TYPE0 && !sending ? PROMPT.slice(0, n) : '';
    $('#cText').textContent = txt;
    const focused = u >= 1.1 && !sending;
    $('#cPh').style.display = focused ? 'none' : ''; $('#cCaret').style.display = focused ? '' : 'none';
    $('#cCaret').style.visibility = focused && ((u >= TYPE0 && n < PROMPT.length) || blink(u, 1.1)) ? 'visible' : 'hidden';
    $('#composer').style.borderColor = focused ? '#BDBDBD' : '';
    $('#cSend').style.background = txt.length ? '#1F1F1F' : '#D6D6D6';
    $('#cSend').style.transform = `scale(${1 - 0.15 * pulse(u, SEND - 0.05, 0.08, 0.15)})`;
    grow(steps.bubble, nat.bubble, ease.out(prog(u, SEND + 0.05, SEND + 0.45)) * (1 - ease.io(prog(u, SEND + 3.65, SEND + 4.25))));
    grow(steps.tools, nat.tools, ease.out(prog(u, SEND + 0.45, SEND + 0.8)));
    tools.forEach((el, i) => {
      const done = u >= SEND + 0.9 + i * 0.5;
      el.classList.toggle('is-done', done);
      el.querySelector('.i-spin').style.display = done ? 'none' : '';
      el.querySelector('.i-ok').style.display = done ? '' : 'none';
      el.querySelector('.i-spin').style.transform = `rotate(${u * 450 % 360}deg)`; el.querySelector('.i-spin').style.transformOrigin = '6px 6px';
    });
    $('#toolsLbl').textContent = u >= SEND + 1.5 ? 'Used Dotidot MCP' : 'Using Dotidot MCP';
    grow(steps.answer, nat.answer, ease.out(prog(u, SEND + 1.65, SEND + 2.1)));
    $('#hl').style.backgroundSize = `${100 * ease.io(prog(u, SEND + 2.4, SEND + 3.0))}% 70%`;
    grow(steps.rows, nat.rows, ease.out(prog(u, SEND + 2.1, SEND + 2.55)));
    rows.forEach((r, i) => { const a = ease.out(prog(u, SEND + 2.25 + i * 0.18, SEND + 2.65 + i * 0.18)); r.style.opacity = a; r.style.transform = `translateX(${(1 - a) * -24}px)`; });
    grow(steps.plan, nat.plan, ease.out(prog(u, SEND + 3.7, SEND + 4.25)));
    const confirmed = u >= CONF + 0.15;
    $('#planTitle').textContent = confirmed ? '1 change applied' : 'Apply 1 change?';
    $('#planNote').textContent = confirmed ? 'Saved in Dotidot' : 'Nothing changes until you confirm';
    $('#btnCancel').style.display = confirmed ? 'none' : '';
    const bc = $('#btnConfirm');
    bc.className = 'btn ' + (confirmed ? 'btn--done' : 'btn--primary');
    bc.innerHTML = confirmed ? '<svg><use href="#ic-ok"/></svg>Applied' : 'Confirm';
    bc.style.transform = `scale(${1 - 0.08 * pulse(u, CONF, 0.08, 0.15)})`;
  }

  E.scene({ dur: DUR, frame, camera: () => ({ x: 0, y: 0, w: 1600 }) });
})();
