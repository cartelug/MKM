// Count-up for factual numbers only (such as six textures, nine lengths). Final value is always in the markup.
import { $$, reduce } from './core.js';

export function initCounters() {
  if (reduce.matches) return;
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    io.unobserve(entry.target);
    const el = entry.target;
    const end = Number(el.dataset.counter);
    const start = performance.now();
    const tick = now => {
      const t = Math.min(1, (now - start) / 1400);
      el.textContent = String(Math.round(end * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: 0.6 });
  $$('[data-counter]').forEach(el => io.observe(el));
}
