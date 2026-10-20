// Header behaviour: compress and solidify on scroll, follow the tone and colour room under it,
// reading progress, full-screen menu, and the discreet contact dock.
import { $, $$, doc, frameThrottle, clamp, safeSession } from './core.js';

const themeColors = { house: '#171614', care: '#294E45', beauty: '#5D1E2C', tax: '#203A66' };

export function initHeader() {
  const header = $('[data-header]');
  if (!header) return;
  const progress = $('.site-progress span', header);
  const heroBrand = $('[data-hero-brand]');
  const sections = $$('main [data-tone], footer[data-tone]');
  const rooms = $$('main [data-world]');
  const dock = $('[data-dock]');
  const footer = $('.site-footer');
  const sideIndex = $('[data-side-index]');
  const themeMeta = $('meta[name="theme-color"]');
  const dockDismissed = safeSession('mkm-dock') === 'x';
  let hdrH = 80;
  let map = [];
  let roomMap = [];
  const hideZones = $$('[data-dock-hide]');
  let hideMap = [];
  let heroBottom = 0;
  let footerTop = Infinity;
  let docHeight = 1;

  const measure = () => {
    const top = el => el.getBoundingClientRect().top + scrollY;
    map = sections.map(el => ({ el, top: top(el), bottom: top(el) + el.offsetHeight, tone: el.dataset.tone }));
    roomMap = rooms.map(el => ({ el, top: top(el), bottom: top(el) + el.offsetHeight, world: el.dataset.world }));
    hideMap = hideZones.map(el => top(el));
    heroBottom = heroBrand ? top(heroBrand) + heroBrand.offsetHeight : 0;
    footerTop = footer ? top(footer) : Infinity;
    docHeight = Math.max(1, doc.scrollHeight - innerHeight);
    hdrH = header.offsetHeight;
  };

  let lastTone = '';
  let lastRoom = '';
  const update = frameThrottle(() => {
    const y = scrollY;
    const probe = y + Math.min(48, hdrH / 2);
    header.classList.toggle('is-solid', y > 24);
    if (progress) progress.style.transform = `scaleX(${clamp(y / docHeight, 0, 1)})`;

    const current = map.find(s => probe >= s.top && probe < s.bottom);
    const tone = current?.tone ?? header.dataset.tone;
    if (tone !== lastTone) { lastTone = tone; header.dataset.tone = tone; if (sideIndex) sideIndex.dataset.tone = tone; }

    const roomProbe = y + innerHeight * 0.5;
    const room = (roomMap.find(r => roomProbe >= r.top && roomProbe < r.bottom)?.world) ?? 'house';
    if (room !== lastRoom) {
      lastRoom = room;
      doc.dataset.world = room;
      document.body.dataset.world = room;
      header.dataset.room = room;
      if (themeMeta && !doc.classList.contains('menu-open')) themeMeta.content = themeColors[room] ?? themeColors.house;
      $$('a', sideIndex || document.createElement('div')).forEach(a => a.classList.toggle('is-active', a.dataset.world === room));
    }
    if (heroBrand) header.classList.toggle('is-over-hero', y < heroBottom - hdrH * 0.6);
    if (sideIndex) sideIndex.classList.toggle('is-visible', y > innerHeight * 0.6 && y + innerHeight < footerTop + 40);

    if (dock && !dockDismissed) {
      const inClosing = hideMap.some(t => y + innerHeight > t + 80);
      const read = y > Math.max(500, docHeight * 0.38) && y + innerHeight < footerTop && !inClosing;
      dock.classList.toggle('is-visible', read);
    }
  });

  // Measure once layout has settled (not during startup), then whenever the page size changes.
  const remeasure = frameThrottle(() => { measure(); update(); });
  const idle = window.requestIdleCallback || (cb => setTimeout(cb, 120));
  idle(remeasure);
  update();
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', remeasure);
  addEventListener('load', remeasure);
  if ('ResizeObserver' in window) new ResizeObserver(remeasure).observe(document.body);

  if (dock) {
    $('.dock__close', dock)?.addEventListener('click', () => { dock.classList.remove('is-visible'); safeSession('mkm-dock', 'x'); });
  }
  initMenu(header);
}

function initMenu(header) {
  const toggle = $('.menu-toggle', header);
  const menu = $('#menu');
  if (!toggle || !menu) return;
  const background = () => [$('main'), $('.site-footer'), $('[data-dock]')].filter(Boolean);
  const focusables = () => [toggle, ...$$('a[href], button:not([disabled])', menu)];
  const setOpen = (open, { restore = true } = {}) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    $('.menu-toggle__text', toggle).textContent = open ? 'Close' : 'Menu';
    menu.classList.toggle('is-open', open);
    menu.inert = !open;
    doc.classList.toggle('menu-open', open);
    document.body.classList.toggle('is-locked', open);
    background().forEach(el => { el.inert = open; });
    if (open) $('a', menu)?.focus({ preventScroll: true });
    else if (restore) toggle.focus({ preventScroll: true });
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false, { restore: false }); });
  document.addEventListener('keydown', e => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
    if (e.key !== 'Tab') return;
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  matchMedia('(min-width: 961px)').addEventListener('change', e => { if (e.matches && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, { restore: false }); });
  addEventListener('pageshow', e => { if (e.persisted) setOpen(false, { restore: false }); });
}
