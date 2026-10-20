// Logo arrival: the CSS timeline runs on its own (it can never trap a visitor behind the overlay).
// This module reveals the hero as the wipe begins, removes the element, and allows skipping.
// It reports three moments: `covered` (page still hidden behind the overlay), `ready` (wipe starts,
// hero may animate in) and `done` (overlay removed).
import { doc } from './core.js';

export function arrival() {
  const el = document.getElementById('preloader');
  const playing = doc.classList.contains('pre');
  const stat = doc.classList.contains('pre-static');
  let coveredNow; let readyNow; let doneNow;
  const covered = new Promise(r => { coveredNow = r; });
  const ready = new Promise(r => { readyNow = r; });
  const done = new Promise(r => { doneNow = r; });
  const result = { covered, ready, done, playing };
  if (!el || !(playing || stat)) {
    doc.classList.add('is-ready');
    readyNow(); doneNow();
    return result;
  }
  let finished = false;
  const timers = [];
  const finish = () => {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    coveredNow();
    el.remove();
    doc.classList.remove('pre', 'pre-static');
    doc.classList.add('is-ready');
    readyNow(); doneNow();
  };
  timers.push(setTimeout(coveredNow, stat ? 0 : 560));
  // The hero begins settling as the wipe starts.
  timers.push(setTimeout(() => { doc.classList.add('is-ready'); readyNow(); }, stat ? 0 : 780));
  timers.push(setTimeout(finish, stat ? 950 : 1300));
  addEventListener('keydown', finish, { once: true });
  el.addEventListener('pointerdown', finish, { once: true });
  return result;
}
