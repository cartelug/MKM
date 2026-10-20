// Page shell: document head, SEO metadata, persistent chrome (header, menu, dock, footer) and dialogs.
import { createHash } from 'node:crypto';
import { site } from '../config/runtime.mjs';
import { services } from '../data/services.js';
import { escape, icon, brandData } from './html.mjs';

export const nav = [
  { name: 'Care', path: '/care/', world: 'care', number: '01' },
  { name: 'Beauty', path: '/beauty/', world: 'beauty', number: '02' },
  { name: 'Tax', path: '/tax/', world: 'tax', number: '03' },
  { name: 'About', path: '/about/', world: 'house' },
  { name: 'Contact', path: '/contact/', world: 'house' },
];

const beautyPaths = ['/shop/', '/shop/hair-enquiry/', '/textures/', '/hair-care/', '/delivery-returns/'];
export const worldOf = path => path.startsWith('/care') ? 'care'
  : (path.startsWith('/beauty') || beautyPaths.includes(path)) ? 'beauty'
  : path.startsWith('/tax') ? 'tax' : 'house';
const isCurrent = (item, path) => path === item.path || (item.path === '/beauty/' && worldOf(path) === 'beauty');

// Smart CTA copy per service room.
export const dockCta = {
  care: { text: 'Talk through your support needs', href: '/contact/?service=care' },
  beauty: { text: 'Start a beauty enquiry', href: '/contact/?service=beauty' },
  tax: { text: 'Discuss your tax support', href: '/contact/?service=tax' },
  house: { text: 'Speak with Monica', href: '/contact/' },
};

// One tiny inline script (allowed by hash in the CSP): flags scripting, and decides whether this
// session still needs the logo arrival. The page is fully usable without it.
export const bootstrapScript = `(function(){var h=document.documentElement;h.classList.add('js');try{var s=sessionStorage;if(!s.getItem('mkm-arrival')){s.setItem('mkm-arrival','1');h.classList.add(matchMedia('(prefers-reduced-motion: reduce)').matches?'pre-static':'pre');}}catch(e){}})();`;
export const bootstrapHash = `'sha256-${createHash('sha256').update(bootstrapScript).digest('base64')}'`;

const themeColors = { house: '#171614', care: '#294E45', beauty: '#5D1E2C', tax: '#203A66' };
const absolute = path => site.siteUrl ? `${site.siteUrl}${path}` : path;

function structuredData({ path, title, description, crumbs }) {
  const org = {
    '@type': 'Organization', '@id': `${absolute('/')}#organization`, name: site.name, description: site.description,
    ...(site.siteUrl ? { url: site.siteUrl + '/', logo: absolute('/assets/brand/icon-512.png') } : {}),
    sameAs: [site.careSite.url],
    makesOffer: services.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, description: s.description } })),
  };
  const graph = [org];
  if (path === '/') graph.push({ '@type': 'WebSite', name: site.name, ...(site.siteUrl ? { url: site.siteUrl + '/' } : {}), publisher: { '@id': org['@id'] } });
  const service = services.find(s => s.path === path);
  if (service) graph.push({ '@type': 'Service', name: service.name, description, provider: { '@id': org['@id'] }, ...(site.siteUrl ? { url: absolute(path) } : {}) });
  if (crumbs?.length) graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs.map(([name, href], i) => ({ '@type': 'ListItem', position: i + 1, name, ...(site.siteUrl ? { item: absolute(href) } : {}) })) });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

function head({ title, description, path, world, noindex, crumbs, preload = [] }) {
  // The brand suffix is added only when the page title does not already name MKM.
  const full = path === '/' || /\bMKM\b/.test(title) ? title : `${title} | ${site.name}`;
  const image = absolute('/assets/brand/og-image.png');
  const canonical = site.siteUrl && !noindex ? `<link rel="canonical" href="${absolute(path)}">` : '';
  const robots = (site.previewMode || noindex) ? '<meta name="robots" content="noindex,nofollow">' : '';
  return `<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${escape(full)}</title>
<meta name="description" content="${escape(description)}"><meta name="theme-color" content="${themeColors[world] ?? themeColors.house}"><meta name="color-scheme" content="light">${robots}${canonical}
<meta property="og:site_name" content="${site.name}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(full)}"><meta property="og:description" content="${escape(description)}">${site.siteUrl ? `<meta property="og:url" content="${absolute(path)}">` : ''}<meta property="og:image" content="${image}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="MKM Services. Care. Beauty. Tax.">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(full)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${image}">
<link rel="icon" href="/assets/brand/favicon-32.png" type="image/png" sizes="32x32"><link rel="icon" href="/assets/brand/favicon.ico" sizes="any"><link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png"><link rel="manifest" href="/manifest.webmanifest">
<link rel="preload" href="/assets/fonts/font-2.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/fonts/font-4.woff2" as="font" type="font/woff2" crossorigin>${preload.join('')}
<link rel="stylesheet" href="/assets/site.css"><script>${bootstrapScript}</script><script type="module" src="/assets/js/main.js"></script>
<script type="application/ld+json">${structuredData({ path, title, description, crumbs })}</script></head>`;
}

// Persistent SVG sprite. The traced contours are mechanical vectors of the supplied lettermark and are
// only used for line-draw moments; the genuine PNG is always the visible logo.
function sprite() {
  const [first, second] = brandData.contours;
  return `<svg class="sprite" aria-hidden="true" focusable="false" width="0" height="0"><defs><path id="mkm-p1" pathLength="1" d="${first.d}"/><path id="mkm-p2" pathLength="1" d="${second.d}"/><clipPath id="mkm-clip"><use href="#mkm-p1"/><use href="#mkm-p2"/></clipPath>
<linearGradient id="pulse-care" x1="0" x2="1"><stop offset="0" stop-color="#294E45" stop-opacity="0"/><stop offset=".5" stop-color="#4C8A7A"/><stop offset="1" stop-color="#294E45" stop-opacity="0"/></linearGradient>
<linearGradient id="pulse-beauty" x1="0" x2="1"><stop offset="0" stop-color="#5D1E2C" stop-opacity="0"/><stop offset=".5" stop-color="#A5384F"/><stop offset="1" stop-color="#5D1E2C" stop-opacity="0"/></linearGradient>
<linearGradient id="pulse-tax" x1="0" x2="1"><stop offset="0" stop-color="#203A66" stop-opacity="0"/><stop offset=".5" stop-color="#4A72B8"/><stop offset="1" stop-color="#203A66" stop-opacity="0"/></linearGradient>
<linearGradient id="sweep" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs></svg>`;
}

function preloader() {
  const { width, height } = brandData;
  return `<div class="preloader" id="preloader" aria-hidden="true"><div class="preloader__stage"><div class="preloader__mark">
<svg class="preloader__svg" viewBox="0 0 ${width} ${height}" focusable="false">
<use href="#mkm-p1" class="pre-fill pre-fill--1"/><use href="#mkm-p2" class="pre-fill pre-fill--2"/>
<g clip-path="url(#mkm-clip)"><rect class="pre-sweep" x="-420" y="-20" width="420" height="${height + 40}" fill="url(#sweep)"/><rect class="pre-pulse pre-pulse--care" x="-380" y="-20" width="380" height="${height + 40}" fill="url(#pulse-care)"/><rect class="pre-pulse pre-pulse--beauty" x="-380" y="-20" width="380" height="${height + 40}" fill="url(#pulse-beauty)"/><rect class="pre-pulse pre-pulse--tax" x="-380" y="-20" width="380" height="${height + 40}" fill="url(#pulse-tax)"/></g>
<use href="#mkm-p1" class="pre-stroke pre-stroke--1"/><use href="#mkm-p2" class="pre-stroke pre-stroke--2"/></svg>
<img class="preloader__final" src="/assets/brand/mkm-white.webp" alt="" width="1072" height="387" decoding="async" fetchpriority="low"></div>
<p class="preloader__line"><span>Care.</span> <span>Beauty.</span> <span>Tax.</span></p></div></div>`;
}

function header(path, tone) {
  const links = nav.map(item => `<a href="${item.path}"${isCurrent(item, path) ? ' aria-current="page"' : ''} data-world="${item.world}"><span>${item.name}</span></a>`).join('');
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-tone="${tone}" data-header><div class="site-header__bar">
<a class="brand" href="/" aria-label="MKM Services, home"><img class="brand__logo brand__logo--light" src="/assets/brand/mkm-white-480.webp" alt="" width="480" height="173"><img class="brand__logo brand__logo--dark" src="/assets/brand/mkm-black-480.webp" alt="" width="480" height="173"><span class="brand__sub">Services</span></a>
<nav class="site-nav" aria-label="Main">${links}</nav>
<a class="header-cta" href="/contact/"><span>Speak with Monica</span>${icon.arrow}</a>
<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span class="menu-toggle__lines" aria-hidden="true"><i></i><i></i></span><span class="menu-toggle__text" aria-hidden="true">Menu</span></button>
</div><div class="site-progress" aria-hidden="true"><span></span></div></header>`;
}

function menuPanel(path) {
  const rooms = services.map(s => `<a class="menu__room menu__room--${s.theme}" href="${s.path}"${isCurrent({ path: s.path }, path) ? ' aria-current="page"' : ''}><span class="menu__num">${s.number}</span><span class="menu__name">${s.short}</span><span class="menu__hint">${s.hint}</span>${icon.diagonal}</a>`).join('');
  return `<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" inert><svg class="menu__mark" viewBox="0 0 ${brandData.width} ${brandData.height}" aria-hidden="true" focusable="false"><use href="#mkm-p1"/><use href="#mkm-p2"/></svg>
<nav class="menu__nav" aria-label="Mobile"><div class="menu__rooms">${rooms}</div><div class="menu__more"><a href="/"${path === '/' ? ' aria-current="page"' : ''}>Home</a><a href="/about/"${path === '/about/' ? ' aria-current="page"' : ''}>About</a><a href="/contact/"${path === '/contact/' ? ' aria-current="page"' : ''}>Contact</a></div></nav>
<div class="menu__foot"><a class="menu__cta" href="/contact/"><span>Speak with Monica</span>${icon.arrow}</a><a class="menu__care" href="${site.careSite.url}" target="_blank" rel="noopener noreferrer">${site.careSite.label}${icon.diagonal}</a></div></div>`;
}

function dock(path) {
  if (path === '/contact/' || path === '/shop/hair-enquiry/' || path === '/privacy/') return '';
  const world = worldOf(path);
  const cta = path.startsWith('/shop') || path === '/beauty/hair/' ? { text: dockCta.beauty.text, href: '/shop/hair-enquiry/' } : dockCta[world];
  return `<aside class="dock" aria-label="Contact Monica" data-dock data-world="${world}"><a class="dock__main" href="${cta.href}"><span class="dock__text"><small>${world === 'house' && cta.text === 'Speak with Monica' ? 'Questions?' : 'Speak with Monica'}</small><strong>${cta.text}</strong></span><span class="dock__icon">${icon.arrow}</span></a><button class="dock__close" type="button" aria-label="Dismiss contact prompt">${icon.close}</button></aside>`;
}

function footer(path) {
  const { width, height } = brandData;
  const col = (cls, num, title, links) => `<div class="footer-col footer-col--${cls}"><p class="footer-col__title"><span>${num}</span>${title}</p><ul>${links.map(([t, h, ext]) => `<li><a href="${h}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${t}${ext ? icon.diagonal : ''}</a></li>`).join('')}</ul></div>`;
  return `<footer class="site-footer" data-tone="dark" data-header-tone="dark"><div class="wrap">
<div class="footer-top"><a class="footer-logo" href="/" aria-label="MKM Services, home" data-logo-replay><img src="/assets/brand/mkm-white.webp" alt="" width="1072" height="387" loading="lazy" decoding="async"><svg viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false"><use href="#mkm-p1" class="replay replay--1"/><use href="#mkm-p2" class="replay replay--2"/></svg></a>
<p class="footer-statement">Care with heart.<br>Beauty with presence.<br>Tax support with clarity.</p></div>
<div class="footer-cols">${col('care', '01', 'Care', [['MKM Care Services', '/care/'], ['How support begins', '/care/#how-support-begins'], [site.careSite.label, site.careSite.url, true]])}${col('beauty', '02', 'Beauty', [['MKM Beauty', '/beauty/'], ['Hair & textures', '/beauty/hair/'], ['Skincare', '/beauty/skincare/'], ['Home décor', '/beauty/home-decor/'], ['The MKM Edit', '/hair-care/']])}${col('tax', '03', 'Tax', [['MKM Tax Return Services', '/tax/'], ['What you can expect', '/tax/#what-to-expect'], ['Tax questions', '/tax/#tax-faq']])}
<div class="footer-col footer-col--house"><p class="footer-col__title"><span>04</span>MKM</p><ul><li><a href="/about/">About MKM Services</a></li><li><a href="/contact/">Speak with Monica</a></li><li><a href="/delivery-returns/">Delivery &amp; returns</a></li><li><a href="/privacy/">Privacy</a></li></ul></div></div>
<div class="footer-bottom"><span>© ${new Date().getFullYear()} ${site.name}</span><span class="footer-bottom__tag">Care. Beauty. Tax.</span>${site.previewMode ? '<span class="preview-label">Client preview · details awaiting approval</span>' : ''}</div></div></footer>`;
}

const dialogs = {
  enquiry: `<dialog id="enquiry-dialog" class="sheet" aria-label="Your enquiry"><button class="sheet__close" type="button" data-close-dialog aria-label="Close">${icon.close}</button><div class="sheet__body" data-confirm-root></div></dialog>`,
  lightbox: `<dialog id="lightbox" class="lightbox" aria-label="Image viewer"><button class="lightbox__close" type="button" data-close-dialog aria-label="Close image viewer">${icon.close}</button><figure class="lightbox__figure"><div class="lightbox__stage" data-lightbox-stage><img id="lightbox-image" src="" alt="" width="810" height="1080"></div><figcaption><span id="lightbox-caption"></span><span class="lightbox__hint">Tap or click the image to zoom</span></figcaption></figure><button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous image" data-lightbox-prev>${icon.prev}</button><button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next image" data-lightbox-next>${icon.next}</button><p class="lightbox__count" aria-live="polite" id="lightbox-count"></p></dialog>`,
};

export function shell({ title, description = site.description, path = '/', content, tone = 'dark', world, noindex = false, crumbs, features = [], preload = [], bodyClass = '' }) {
  const room = world ?? worldOf(path);
  return `<!doctype html><html lang="en-AU" data-world="${room}">${head({ title, description, path, world: room, noindex, crumbs, preload })}
<body class="${bodyClass}" data-world="${room}">${sprite()}${preloader()}${header(path, tone)}${menuPanel(path)}<div class="cursor" aria-hidden="true"><i></i><b></b></div>
<main id="main" tabindex="-1">${content}</main>${footer(path)}${dock(path)}${features.map(f => dialogs[f]).join('')}
<noscript><p class="noscript-note">Some interactive features need JavaScript. You can still explore every page, and Care enquiries can be made through ${site.careSite.label}.</p></noscript></body></html>`;
}
