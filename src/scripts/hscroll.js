// Pinned horizontal gallery: vertical scroll glides image strips sideways (desktop, fine pointer, motion allowed).
// Everywhere else the strip is a normal swipeable, snap-scrolling row, so nothing depends on this module.
import { $, $$, clamp, frameThrottle, reduce, finePointer, lite } from './core.js';

export function initHscroll() {
  $$('[data-hscroll]').forEach(root => {
    const track = $('[data-hscroll-track]', root);
    const sticky = $('[data-hscroll-sticky]', root);
    if (!track || !sticky) return;
    const query = matchMedia('(min-width: 960px)');
    let pinned = false;
    let travel = 0;

    const enable = () => {
      pinned = query.matches && finePointer.matches && !reduce.matches && !lite;
      root.classList.toggle('is-pinned', pinned);
      track.style.transform = '';
      root.style.height = '';
      if (!pinned) return;
      travel = Math.max(0, track.scrollWidth - sticky.clientWidth);
      root.style.height = `${travel + innerHeight}px`;
      update();
    };
    const update = frameThrottle(() => {
      if (!pinned) return;
      const rect = root.getBoundingClientRect();
      const p = clamp(-rect.top / (root.offsetHeight - innerHeight), 0, 1);
      track.style.transform = `translate3d(${(-travel * p).toFixed(1)}px, 0, 0)`;
    });
    // Keyboard focus on an off-screen strip scrolls the page to bring it into view.
    track.addEventListener('focusin', e => {
      if (!pinned) return;
      const item = e.target.closest('[data-hscroll-item]');
      if (!item) return;
      const left = item.offsetLeft - (sticky.clientWidth - item.offsetWidth) / 2;
      const p = clamp(left / travel, 0, 1);
      scrollTo({ top: root.offsetTop + p * (root.offsetHeight - innerHeight), behavior: 'auto' });
    });
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', frameThrottle(enable));
    addEventListener('load', enable);
    query.addEventListener('change', enable);
    enable();
  });
}
