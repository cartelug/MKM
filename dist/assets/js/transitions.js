// Page transitions. Browsers with cross-document View Transitions are handled in CSS.
// Others get a short exit fade before navigating. Never blocks modified clicks or new tabs.
import { doc, reduce } from './core.js';

export function initTransitions() {
  if (reduce.matches || 'CSSViewTransitionRule' in window) return;
  document.addEventListener('click', e => {
    const link = e.target.closest?.('a[href]');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (link.target && link.target !== '_self') return;
    if (link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
    e.preventDefault();
    doc.classList.add('is-leaving');
    setTimeout(() => { location.href = url.href; }, 240);
  });
  addEventListener('pageshow', e => { if (e.persisted) doc.classList.remove('is-leaving'); });
}
