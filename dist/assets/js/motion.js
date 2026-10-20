// Motion engine. Animates transform and opacity only. Every effect is skipped under
// prefers-reduced-motion, and the heavier ones are skipped on low-power devices.
import { $, $$, doc, reduce, finePointer, lite, clamp, lerp, frameThrottle } from './core.js';

// Word-by-word masked heading reveal. Accessible text is preserved in a visually hidden copy.
function split(el) {
  const text = el.textContent.replace(/\s+/g, ' ').trim();
  let index = 0;
  const walk = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { fragment.append(' '); return; }
          const word = document.createElement('span');
          word.className = 'w';
          const inner = document.createElement('span');
          inner.className = 'wi';
          inner.textContent = part;
          inner.style.setProperty('--i', String(Math.min(index++, 22)));
          word.append(inner);
          fragment.append(word);
        });
        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') walk(child);
    });
  };
  const visual = document.createElement('span');
  visual.setAttribute('aria-hidden', 'true');
  visual.append(...el.childNodes);
  el.append(visual);
  walk(visual);
  const spoken = document.createElement('span');
  spoken.className = 'visually-hidden';
  spoken.textContent = text;
  el.prepend(spoken);
  el.classList.add('is-split');
}

export function initMotion(arrived) {
  if (reduce.matches) return;
  const ready = arrived.ready;
  $$('[data-stagger]').forEach(group => $$(':scope > [data-reveal]', group).forEach((child, i) => child.style.setProperty('--i', String(i))));

  // Reveal on entry (held until the logo arrival has finished).
  const targets = $$('[data-reveal], [data-split]:not([data-split="late"])');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  // Headings are split only as they approach the viewport, keeping startup work small.
  const splitter = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      splitter.unobserve(entry.target);
      split(entry.target);
      ready.then(() => io.observe(entry.target));
    });
  }, { rootMargin: '0px 0px 150% 0px' });
  // Hero headline: stays visible (and paintable) until the arrival overlay covers it, then rises as the wipe begins.
  const late = $$('[data-split="late"]');
  if (arrived.playing) {
    late.forEach(el => {
      arrived.covered.then(() => split(el));
      ready.then(() => requestAnimationFrame(() => el.classList.add('is-in')));
    });
  } else late.forEach(el => el.classList.add('is-in'));
  $$('[data-split]:not([data-split="late"])').forEach(el => splitter.observe(el));
  ready.then(() => $$('[data-reveal]').forEach(el => io.observe(el)));
  addEventListener('beforeprint', () => { $$('[data-split]').forEach(el => !el.classList.contains('is-split') && split(el)); targets.forEach(el => el.classList.add('is-in')); });

  if (!lite) { parallax(); heroDepth(); drift(); }
  if (finePointer.matches) { magnetic(); if (!lite) cursor(); }
}

// Image drift inside masked frames: 3-6% of the frame height at most.
function parallax() {
  const items = $$('[data-parallax]').map(inner => ({ inner, frame: inner.parentElement, amount: clamp(parseFloat(inner.dataset.parallax) || 5, 0, 6), visible: false }));
  if (!items.length) return;
  const io = new IntersectionObserver(entries => entries.forEach(e => { items.find(i => i.frame === e.target).visible = e.isIntersecting; }), { rootMargin: '10% 0px' });
  items.forEach(i => io.observe(i.frame));
  const update = frameThrottle(() => {
    const vh = innerHeight;
    items.forEach(item => {
      if (!item.visible) return;
      const rect = item.frame.getBoundingClientRect();
      const progress = clamp((rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2), -1, 1);
      item.inner.style.transform = `translate3d(0, ${(-progress * item.amount / 100 * rect.height).toFixed(1)}px, 0)`;
    });
  });
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
}

// Hero depth: image columns, headline and index move at different slow speeds; pointer adds a faint parallax.
function heroDepth() {
  const hero = $('[data-hero]');
  const columns = $$('.sheet-col[data-depth]');
  if (!hero || !columns.length) return;
  const copy = $('.hero__copy', hero);
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let running = false;
  const render = () => {
    const y = scrollY;
    if (y > hero.offsetHeight * 1.1) { running = false; return; }
    pointer.x = lerp(pointer.x, pointer.tx, 0.06);
    pointer.y = lerp(pointer.y, pointer.ty, 0.06);
    columns.forEach((col, i) => {
      const depth = parseFloat(col.dataset.depth);
      const dir = i === 1 ? -1 : 1;
      col.style.transform = `translate3d(${(pointer.x * depth * 80).toFixed(1)}px, ${(y * depth + pointer.y * depth * 80 * dir).toFixed(1)}px, 0)`;
    });
    if (copy) copy.style.transform = `translate3d(0, ${(y * 0.045).toFixed(1)}px, 0)`;
    running = Math.abs(pointer.x - pointer.tx) > 0.01 || Math.abs(pointer.y - pointer.ty) > 0.01;
    if (running) requestAnimationFrame(render);
  };
  const kick = () => { if (!running) { running = true; requestAnimationFrame(render); } };
  addEventListener('scroll', frameThrottle(() => { if (scrollY < hero.offsetHeight * 1.1) { running = false; render(); } }), { passive: true });
  if (finePointer.matches) {
    hero.addEventListener('pointermove', e => {
      const rect = hero.getBoundingClientRect();
      pointer.tx = (e.clientX - rect.left) / rect.width - 0.5;
      pointer.ty = (e.clientY - rect.top) / rect.height - 0.5;
      kick();
    });
  }
  render();
}

// Slow horizontal glide of an image reel as its section passes through the viewport.
function drift() {
  const tracks = $$('[data-drift]');
  if (!tracks.length) return;
  const update = frameThrottle(() => {
    tracks.forEach(track => {
      const section = track.closest('section');
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > innerHeight + 200) return;
      const overflow = Math.max(0, track.scrollWidth - doc.clientWidth);
      const p = clamp((innerHeight - rect.top) / (innerHeight + rect.height), 0, 1);
      track.style.setProperty('--dx', `${(-overflow * p).toFixed(1)}px`);
    });
  });
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
}

// Magnetic buttons: a small pull toward the pointer, desktop only.
function magnetic() {
  let active = null;
  const reset = el => { el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px'); };
  document.addEventListener('pointermove', e => {
    const el = e.target.closest?.('[data-magnetic]') ?? null;
    if (active && active !== el) reset(active);
    active = el;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    el.style.setProperty('--mx', `${clamp(dx * 0.1, -6, 6).toFixed(1)}px`);
    el.style.setProperty('--my', `${clamp(dy * 0.18, -5, 5).toFixed(1)}px`);
  });
  document.addEventListener('pointerleave', () => active && reset(active));
}

// Fine-dot cursor with a trailing ring (fine pointers only; the native cursor returns on any doubt).
function cursor() {
  const root = $('.cursor');
  if (!root) return;
  const dot = $('i', root);
  const ring = $('b', root);
  const pos = { x: -100, y: -100, rx: -100, ry: -100 };
  let seen = false;
  const loop = () => {
    pos.rx = lerp(pos.rx, pos.x, 0.18);
    pos.ry = lerp(pos.ry, pos.y, 0.18);
    dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    ring.style.transform = `translate3d(${pos.rx}px, ${pos.ry}px, 0)`;
    requestAnimationFrame(loop);
  };
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    pos.x = e.clientX; pos.y = e.clientY;
    if (!seen) { seen = true; pos.rx = pos.x; pos.ry = pos.y; doc.classList.add('has-cursor'); requestAnimationFrame(loop); }
    root.classList.remove('is-hidden');
    root.classList.toggle('is-active', Boolean(e.target.closest?.('a, button, label, [data-magnetic], summary')));
  }, { passive: true });
  document.addEventListener('pointerleave', () => root.classList.add('is-hidden'));
}
