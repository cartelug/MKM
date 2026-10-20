import { shell } from '../lib/layout.mjs';
import { media, frame, button, icon, label, heading } from '../lib/html.mjs';
import { monicaWelcome, trustStrip, closing } from '../lib/sections.mjs';

// Contact-sheet montage for the hero: three columns of numbered frames drifting at different slow speeds.
// Alt text is empty because the frames are decorative; the headline carries the meaning.
const thumb = (name) => `<img src="/assets/media/thumbs/${name}.webp" alt="" width="360" height="450" decoding="async" loading="LOADING">`;
const sheetFrame = (n, room, name, eager) =>
  `<figure class="sheet-frame"><div class="sheet-frame__img">${thumb(name).replace('LOADING', eager ? 'eager' : 'lazy')}</div><figcaption><span>${String(n).padStart(2, '0')}</span>${room}</figcaption></figure>`;
const sheetColumns = [
  { depth: '0.10', frames: [['Care', 'care-portrait', true], ['Beauty', 'hair-body-wave'], ['Tax', 'tax-calc'], ['Beauty', 'hair-tight-curl']] },
  { depth: '0.18', frames: [['Beauty', 'hair-straight', true], ['Beauty', 'skincare'], ['Care', 'care-gaze'], ['Beauty', 'hair-water-wave']] },
  { depth: '0.06', frames: [['Beauty', 'decor', true], ['Beauty', 'hair-kinky-curly'], ['Beauty', 'hair-wavy'], ['Beauty', 'hair-kinky-straight']] },
];

function hero() {
  let n = 0;
  const columns = sheetColumns.map(col => `<div class="sheet-col" data-depth="${col.depth}">${col.frames.map(([room, name, eager]) => sheetFrame(++n, room, name, eager)).join('')}</div>`).join('');
  return `<section class="hero" id="top" data-world="house" data-tone="dark" data-hero>
<div class="hero__stage" aria-hidden="true"><div class="hero__sheet" data-sheet>${columns}</div><div class="hero__veil"></div><div class="hero__light"></div></div>
<div class="wrap hero__inner"><div class="hero__copy">
<div class="hero__brand" data-hero-brand><img src="/assets/brand/mkm-white-480.webp" srcset="/assets/brand/mkm-white-480.webp 480w, /assets/brand/mkm-white.webp 1072w" sizes="(min-width:900px) 160px, 112px" alt="MKM" width="1072" height="387" decoding="async"><span class="label label--light">MKM Services</span></div>
<h1 class="hero__title" data-split="late"><span class="line line--care">Care with <em>heart.</em></span> <span class="line line--beauty">Beauty with <em>presence.</em></span> <span class="line line--tax">Tax support with <em>clarity.</em></span></h1>
<p class="hero__sub">Disability and community support, beauty and home décor, and tax return help, with Monica as your warm first point of contact.</p>
<div class="hero__actions">${button('Explore MKM', '#house', { kind: 'paper' })}${button('Speak with Monica', '/contact/', { kind: 'ghost' })}</div></div></div>
<a class="hero__cue" href="#house" aria-label="Scroll to explore MKM"><span>Scroll</span><i aria-hidden="true"></i></a></section>`;
}

const house = `<section class="house" id="house" data-world="house" data-tone="light"><div class="wrap house__grid">
<div class="house__intro">${label('The House of MKM')}<p class="house__lede" data-split>Three rooms, one welcome. Whichever door you open, Monica’s personal approach comes with you.</p></div>
<ol class="house__doors" data-stagger>
<li data-reveal><a href="#care"><span class="house__num">01</span><span class="house__room">Care</span><span class="house__mood">Calm, human, considered.</span>${icon.arrow}</a></li>
<li data-reveal><a href="#beauty"><span class="house__num">02</span><span class="house__room">Beauty</span><span class="house__mood">Rich, editorial, personal.</span>${icon.arrow}</a></li>
<li data-reveal><a href="#tax"><span class="house__num">03</span><span class="house__room">Tax</span><span class="house__mood">Precise, calm, confident.</span>${icon.arrow}</a></li></ol></div></section>`;

const care = `<section class="chapter chapter--care" id="care" data-world="care" data-tone="light"><div class="chapter__grid">
<div class="chapter__media">${frame(media.care.portrait({ sizes: '(min-width:900px) 50vw, 100vw' }), { cls: 'frame--care', parallax: 6 })}<p class="chapter__caption"><span>01</span> Illustrative photography</p></div>
<div class="chapter__panel" data-reveal="panel"><p class="chapter__kicker"><span class="chapter__num">01</span>MKM Care Services</p>
${heading(2, 'Calm, considered support, <em>shaped around you.</em>', 'h-chapter')}
<p class="chapter__text">Compassionate disability and community-based support, with people at the centre. A conversation with Monica is a gentle place to begin.</p>
<ul class="quiet" data-stagger aria-label="What guides MKM Care"><li data-reveal><b>Person-led</b><span>Your needs and preferences set the direction.</span></li><li data-reveal><b>Practical support</b><span>Clear, workable next steps for everyday life.</span></li><li data-reveal><b>Community connection</b><span>Support that keeps you close to what matters.</span></li></ul>
<div class="chapter__cta">${button('Discover Care Services', '/care/', { world: 'care' })}</div></div></div></section>`;

const beauty = `<section class="chapter chapter--beauty" id="beauty" data-world="beauty" data-tone="dark"><span class="chapter__ghost" aria-hidden="true">Beauty</span>
<div class="wrap chapter__head"><div><p class="chapter__kicker"><span class="chapter__num">02</span>MKM Beauty</p>${heading(2, 'Beauty, <em>chosen your way.</em>', 'h-chapter')}</div>
<p class="chapter__text">Wigs, human hair and extensions, skincare, and home décor. Browse at your own pace, ask Monica anything, and choose with confidence.</p></div>
<div class="reel" aria-hidden="true"><div class="reel__track" data-drift="-7">
<div class="reel__item reel__item--tall" data-reveal="curtain">${media.hair.bodyWave({ alt: '', sizes: '(min-width:900px) 24vw, 56vw' })}</div>
<div class="reel__item reel__item--short" data-reveal="curtain">${media.skincare({ alt: '', sizes: '(min-width:900px) 20vw, 50vw' })}</div>
<div class="reel__item reel__item--tall" data-reveal="curtain">${media.hair.kinkyCurly({ alt: '', sizes: '(min-width:900px) 24vw, 56vw' })}</div>
<div class="reel__item reel__item--mid" data-reveal="curtain">${media.hair.waterWave({ alt: '', sizes: '(min-width:900px) 22vw, 52vw' })}</div>
<div class="reel__item reel__item--tall" data-reveal="curtain">${media.hair.straight({ alt: '', sizes: '(min-width:900px) 24vw, 56vw' })}</div>
<div class="reel__item reel__item--short" data-reveal="curtain">${media.hair.wavy({ alt: '', sizes: '(min-width:900px) 20vw, 50vw' })}</div></div></div>
<div class="wrap chapter__foot"><ul class="entries" data-stagger aria-label="Quick entry points">
<li data-reveal><a href="/beauty/hair/"><span class="entries__num">01</span><span class="entries__name">Hair</span><span class="entries__note">Wigs, human hair &amp; extensions</span><span class="entries__thumb" aria-hidden="true">${media.hair.tightCurl({ alt: '', sizes: '120px' })}</span>${icon.arrow}</a></li>
<li data-reveal><a href="/beauty/skincare/"><span class="entries__num">02</span><span class="entries__name">Skincare</span><span class="entries__note">A moment for yourself</span><span class="entries__thumb" aria-hidden="true">${media.skincare({ alt: '', sizes: '120px' })}</span>${icon.arrow}</a></li>
<li data-reveal><a href="/beauty/home-decor/"><span class="entries__num">03</span><span class="entries__name">Home décor</span><span class="entries__note">For the spaces you love</span><span class="entries__thumb" aria-hidden="true">${media.decor({ alt: '', sizes: '120px' })}</span>${icon.arrow}</a></li></ul>
<div class="chapter__cta">${button('Enter MKM Beauty', '/beauty/', { kind: 'brass' })}</div></div></section>`;

const tax = `<section class="chapter chapter--tax" id="tax" data-world="tax" data-tone="light"><div class="wrap chapter__grid">
<div class="chapter__panel"><p class="chapter__kicker"><span class="chapter__num">03</span>MKM Tax Return Services</p>
${heading(2, 'A calmer way <em>through tax time.</em>', 'h-chapter')}
<blockquote class="framed" data-reveal><span class="framed__corner framed__corner--tl"></span><span class="framed__corner framed__corner--br"></span>Practical guidance when your tax situation needs attention.</blockquote>
<ol class="rules" data-stagger><li data-reveal><span>01</span>Tax return assistance</li><li data-reveal><span>02</span>Entitlements review</li><li data-reveal><span>03</span>Tax debt support</li></ol>
<div class="chapter__cta">${button('Explore Tax Support', '/tax/', { world: 'tax' })}</div></div>
<div class="chapter__media">${frame(media.tax.calc({ sizes: '(min-width:900px) 40vw, 100vw' }), { cls: 'frame--tax', parallax: 5 })}<p class="chapter__caption"><span>03</span> Illustrative photography</p></div></div></section>`;

export function home() {
  return shell({
    title: 'MKM Services — Care, Beauty and Tax, with Monica',
    description: 'MKM Services brings together disability and community support, beauty and home décor, and tax return help. Start a conversation with Monica.',
    path: '/', world: 'house', tone: 'dark', bodyClass: 'page-home',
    content: `${hero()}${house}${care}${beauty}${tax}${monicaWelcome()}${trustStrip()}${closing()}
<nav class="side-index" aria-label="Jump to a service" data-side-index><a href="#care" data-world="care"><span>01</span>Care</a><a href="#beauty" data-world="beauty"><span>02</span>Beauty</a><a href="#tax" data-world="tax"><span>03</span>Tax</a></nav>`,
  });
}
