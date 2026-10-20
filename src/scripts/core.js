// Shared helpers for the interaction layer.
export const $ = (selector, scope = document) => scope.querySelector(selector);
export const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
export const doc = document.documentElement;
export const reduce = matchMedia('(prefers-reduced-motion: reduce)');
export const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const lerp = (a, b, t) => a + (b - a) * t;

// Low-power hint: lighter motion, no custom cursor, no parallax.
export const lite = Boolean(navigator.connection?.saveData) || (navigator.hardwareConcurrency || 8) <= 2 || (navigator.deviceMemory || 8) <= 2;
if (lite) doc.classList.add('lite');

// Run a callback at most once per animation frame.
export function frameThrottle(fn) {
  let queued = false;
  return (...args) => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; fn(...args); });
  };
}

export function safeSession(key, value) {
  try {
    if (value === undefined) return sessionStorage.getItem(key);
    sessionStorage.setItem(key, value);
  } catch { /* Storage can be unavailable (private modes); the page works without it. */ }
  return null;
}

// Modal helper shared by the enquiry sheet and the lightbox.
let lastFocus = null;
export function openDialog(dialog) {
  lastFocus = document.activeElement;
  dialog.showModal();
  document.body.classList.add('dialog-open');
  doc.classList.add('dialog-open');
}
export function wireDialogs() {
  document.addEventListener('click', e => {
    const dialog = e.target.closest?.('dialog');
    if (e.target.closest?.('[data-close-dialog]') && dialog) { dialog.close(); return; }
    // A click on the backdrop lands on the dialog element itself.
    if (e.target instanceof HTMLDialogElement && e.target.classList.contains('sheet')) e.target.close();
  });
  document.addEventListener('close', e => {
    if (!(e.target instanceof HTMLDialogElement)) return;
    if (!document.querySelector('dialog[open]')) { document.body.classList.remove('dialog-open'); doc.classList.remove('dialog-open'); }
    if (lastFocus?.isConnected) lastFocus.focus({ preventScroll: true });
  }, true);
}
