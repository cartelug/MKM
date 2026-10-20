// Native horizontal scrollers (The MKM Edit): arrow buttons, progress, keyboard-focusable region.
import { $, $$, clamp } from './core.js';

export function initScrollers() {
  $$('[data-scroller]').forEach(root => {
    const track = $('[data-scroller-track]', root);
    const prev = $('[data-scroller-prev]', root);
    const next = $('[data-scroller-next]', root);
    const bar = $('[data-scroller-bar]', root);
    if (!track) return;
    const step = () => Math.max(260, track.querySelector(':scope > *')?.getBoundingClientRect().width ?? 320) + 20;
    const sync = () => {
      const max = track.scrollWidth - track.clientWidth;
      const p = max > 0 ? clamp(track.scrollLeft / max, 0, 1) : 1;
      if (bar) bar.style.transform = `scaleX(${(0.18 + p * 0.82).toFixed(3)})`;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
    };
    const go = dir => track.scrollBy({ left: dir * step(), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    prev?.addEventListener('click', () => go(-1));
    next?.addEventListener('click', () => go(1));
    track.addEventListener('scroll', sync, { passive: true });
    addEventListener('resize', sync);
    sync();
  });
}
