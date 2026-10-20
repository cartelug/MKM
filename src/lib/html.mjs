// Small, dependency-free HTML helpers shared by every page template.
import { readFileSync } from 'node:fs';

export const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

const stroke = (d, width = 1.4) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="square" aria-hidden="true" focusable="false">${d}</svg>`;
export const icon = {
  arrow: stroke('<path d="M3 12h17m-6-6 6 6-6 6"/>'),
  diagonal: stroke('<path d="M6 18 18 6M7 6h11v11"/>'),
  close: stroke('<path d="m6 6 12 12M6 18 18 6"/>', 1.5),
  plus: stroke('<path d="M12 5v14M5 12h14"/>', 1.5),
  prev: stroke('<path d="M20 12H4m6-6-6 6 6 6"/>'),
  next: stroke('<path d="M4 12h16m-6-6 6 6-6 6"/>'),
  down: stroke('<path d="M12 3v17m-6-6 6 6 6-6"/>'),
  zoom: stroke('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2M11 8.5v5M8.5 11h5"/>', 1.4),
  copy: stroke('<rect x="8" y="8" width="11" height="12"/><path d="M5 16V4h11"/>', 1.4),
  chat: stroke('<path d="M4 5h16v11H10l-5 4v-4H4z"/>', 1.4),
  mail: stroke('<path d="M3 6h18v12H3zM3 7l9 7 9-7"/>', 1.4),
};

export const brandData = JSON.parse(readFileSync(new URL('../data/logo-paths.json', import.meta.url), 'utf8'));

// A link styled as a button. `kind` selects the visual treatment, `world` an optional colour room.
export const button = (label, href, { kind = 'solid', world = '', external = false, attrs = '' } = {}) =>
  `<a class="btn btn--${kind}${world ? ` btn--${world}` : ''}" href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}${attrs ? ' ' + attrs : ''} data-magnetic><span class="btn__fill" aria-hidden="true"></span><span class="btn__label">${label}</span><span class="btn__icon">${external ? icon.diagonal : icon.arrow}</span></a>`;

export const textLink = (label, href, { external = false, attrs = '' } = {}) =>
  `<a class="text-link" href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}${attrs ? ' ' + attrs : ''}><span>${label}</span>${external ? icon.diagonal : icon.arrow}</a>`;

export const label = (text, extra = '') => `<span class="label${extra ? ' ' + extra : ''}">${text}</span>`;

// Responsive image. `sources` is [[path, width], ...]; width/height reserve space to prevent layout shift.
export function img({ src, alt, width, height, sources = [], sizes = '100vw', eager = false, priority = false, cls = '', attrs = '' }) {
  const srcset = sources.length ? ` srcset="${sources.map(([p, w]) => `${p} ${w}w`).join(', ')}" sizes="${sizes}"` : '';
  return `<img${cls ? ` class="${cls}"` : ''} src="${src}"${srcset} alt="${escape(alt)}" width="${width}" height="${height}" decoding="async" loading="${eager ? 'eager' : 'lazy'}"${priority ? ' fetchpriority="high"' : ''}${attrs ? ' ' + attrs : ''}>`;
}

// Image wrapped in a masked-reveal frame (curtain + slow scroll parallax).
export const frame = (image, { cls = '', parallax = 6, ratio = '' } = {}) =>
  `<div class="frame ${cls}${ratio ? ' ' + ratio : ''}" data-reveal="curtain"><div class="frame__inner"${parallax ? ` data-parallax="${parallax}"` : ''}>${image}</div></div>`;

// Heading that the motion engine reveals word by word. Markup stays readable without scripting.
export const heading = (level, html, cls = '') => `<h${level} class="${cls}" data-split>${html}</h${level}>`;

export const media = {
  care: {
    portrait: (opts = {}) => img({ src: '/assets/media/care-portrait-800.webp', alt: 'A woman using a wheelchair beside a misty lake, looking toward the light', width: 800, height: 1067, sources: [['/assets/media/care-portrait-480.webp', 480], ['/assets/media/care-portrait-640.webp', 640], ['/assets/media/care-portrait-800.webp', 800], ['/assets/media/care-portrait.webp', 1100]], ...opts }),
    gaze: (opts = {}) => img({ src: '/assets/media/care-gaze.webp', alt: 'A smiling woman in a white top, her hair lit by soft morning light, with pine trees behind her', width: 560, height: 700, sources: [['/assets/media/care-gaze-480.webp', 480], ['/assets/media/care-gaze.webp', 560]], ...opts }),
    forest: (opts = {}) => img({ src: '/assets/media/care-forest.webp', alt: 'Mist-covered fir trees along a quiet lake', width: 1400, height: 540, sources: [['/assets/media/care-forest-800.webp', 800], ['/assets/media/care-forest.webp', 1400]], ...opts }),
  },
  skincare: (opts = {}) => img({ src: '/assets/editorial/skincare-960.webp', alt: 'An amber dropper bottle on a wooden pedestal, with palm shadows across a warm wall', width: 960, height: 1440, sources: [['/assets/editorial/skincare-480.webp', 480], ['/assets/editorial/skincare-960.webp', 960], ['/assets/editorial/skincare.webp', 1200]], ...opts }),
  decor: (opts = {}) => img({ src: '/assets/editorial/home-decor-960.webp', alt: 'A bright open-plan home with a dark dining table, soft grey chairs and warm timber floors', width: 960, height: 640, sources: [['/assets/editorial/home-decor-480.webp', 480], ['/assets/editorial/home-decor-960.webp', 960], ['/assets/editorial/home-decor.webp', 1400]], ...opts }),
  tax: {
    calc: (opts = {}) => img({ src: '/assets/media/tax-calc.webp', alt: 'A calculator and pen resting on paperwork on a white wooden table', width: 382, height: 477, ...opts }),
    desk: (opts = {}) => img({ src: '/assets/media/tax-desk.webp', alt: 'Hands sorting tax paperwork beside a calculator on a white wooden table', width: 764, height: 458, sources: [['/assets/media/tax-desk-480.webp', 480], ['/assets/media/tax-desk.webp', 764]], ...opts }),
  },
  hair: {
    straight: (opts = {}) => img({ src: '/assets/media/hair-straight.webp', alt: 'Smooth, straight dark hair falling down a mannequin’s back', width: 400, height: 500, ...opts }),
    bodyWave: (opts = {}) => img({ src: '/assets/media/hair-body-wave.webp', alt: 'Long dark hair in soft, broad waves', width: 380, height: 475, ...opts }),
    wavy: (opts = {}) => img({ src: '/assets/media/hair-wavy.webp', alt: 'Long dark hair with distinct, flowing waves, seen from the side', width: 430, height: 538, ...opts }),
    waterWave: (opts = {}) => img({ src: '/assets/media/hair-water-wave.webp', alt: 'Dark hair with closely defined waves', width: 580, height: 725, sources: [['/assets/media/hair-water-wave-480.webp', 480], ['/assets/media/hair-water-wave.webp', 580]], ...opts }),
    kinkyCurly: (opts = {}) => img({ src: '/assets/media/hair-kinky-curly.webp', alt: 'A full arrangement of small dark curls', width: 460, height: 575, ...opts }),
    tightCurl: (opts = {}) => img({ src: '/assets/media/hair-tight-curl.webp', alt: 'Tight, defined dark curls in close detail', width: 560, height: 700, sources: [['/assets/media/hair-tight-curl-480.webp', 480], ['/assets/media/hair-tight-curl.webp', 560]], ...opts }),
    kinkyStraight: (opts = {}) => img({ src: '/assets/media/hair-kinky-straight.webp', alt: 'A smooth dark wig in profile on a display mannequin', width: 540, height: 675, sources: [['/assets/media/hair-kinky-straight-480.webp', 480], ['/assets/media/hair-kinky-straight.webp', 540]], ...opts }),
  },
};
