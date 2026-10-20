// Lightbox: opens fast, preloads neighbours, arrow keys and swipe, tap to zoom with pointer pan.
import { $, $$, openDialog } from './core.js';

export function initLightbox() {
  const dialog = $('#lightbox');
  if (!dialog) return;
  const image = $('#lightbox-image', dialog);
  const caption = $('#lightbox-caption', dialog);
  const count = $('#lightbox-count', dialog);
  const stage = $('[data-lightbox-stage]', dialog);
  const prev = $('[data-lightbox-prev]', dialog);
  const next = $('[data-lightbox-next]', dialog);
  let group = [];
  let index = 0;

  const items = () => $$('[data-lightbox]');
  const preload = i => { const item = group[(i + group.length) % group.length]; if (item) new Image().src = item.dataset.full; };
  const show = i => {
    index = (i + group.length) % group.length;
    const item = group[index];
    stage.classList.remove('is-zoomed');
    image.style.transformOrigin = '50% 50%';
    image.src = item.dataset.full;
    image.alt = item.dataset.alt || '';
    caption.textContent = item.dataset.caption || '';
    count.textContent = group.length > 1 ? `${String(index + 1).padStart(2, '0')} / ${String(group.length).padStart(2, '0')}` : '';
    prev.hidden = next.hidden = group.length < 2;
    preload(index + 1); preload(index - 1);
  };
  const open = trigger => {
    const name = trigger.dataset.lightbox || 'default';
    group = items().filter(el => (el.dataset.lightbox || 'default') === name);
    openDialog(dialog);
    show(Math.max(0, group.indexOf(trigger)));
  };
  document.addEventListener('click', e => {
    const trigger = e.target.closest?.('[data-lightbox]');
    if (!trigger) return;
    e.preventDefault();
    open(trigger);
  });
  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  dialog.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
  // Tap or click to zoom; while zoomed, the pointer pans.
  let startX = null;
  let moved = false;
  stage.addEventListener('pointerdown', e => { startX = e.clientX; moved = false; });
  stage.addEventListener('pointermove', e => {
    if (startX !== null && Math.abs(e.clientX - startX) > 8) moved = true;
    if (!stage.classList.contains('is-zoomed')) return;
    const rect = stage.getBoundingClientRect();
    image.style.transformOrigin = `${((e.clientX - rect.left) / rect.width) * 100}% ${((e.clientY - rect.top) / rect.height) * 100}%`;
  });
  stage.addEventListener('pointerup', e => {
    const dx = e.clientX - (startX ?? e.clientX);
    startX = null;
    if (!stage.classList.contains('is-zoomed') && Math.abs(dx) > 56 && group.length > 1) { show(index + (dx < 0 ? 1 : -1)); return; }
    if (!moved) stage.classList.toggle("is-zoomed");
  });
}
