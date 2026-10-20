// Reusable editorial sections. Every page composes these so the House of MKM reads as one build.
import { icon, button, textLink, label, heading, escape, brandData } from './html.mjs';

export const monicaQuote = 'I’m Monica. I believe every person deserves to feel supported, seen, and confident about the next step.';

// Numbered step sequence (01 / 02 / 03 ...). `cls` picks the room colours.
export function steps(items, { id = '', title = '', kicker = '', world = 'house', intro = '' } = {}) {
  return `<section class="section steps steps--${world}"${id ? ` id="${id}"` : ''} data-world="${world}" data-tone="light"><div class="wrap">
<div class="steps__head">${kicker ? label(kicker) : ''}${title ? heading(2, title, 'h-section') : ''}${intro ? `<p class="lede" data-reveal>${intro}</p>` : ''}</div>
<ol class="steps__list${items.length === 3 ? ' is-three' : ''}" data-stagger>${items.map(([t, p], i) => `<li class="step" data-reveal><span class="step__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><div><h3 class="step__title">${t}</h3><p>${p}</p></div></li>`).join('')}</ol></div></section>`;
}

let faqCounter = 0;
export function faq(items, { id = '', title = '', kicker = 'Good to know', world = 'house', cta = '' } = {}) {
  const group = ++faqCounter;
  return `<section class="section faq faq--${world}"${id ? ` id="${id}"` : ''} data-world="${world}" data-tone="light"><div class="wrap faq__layout"><div class="faq__intro">${label(kicker)}${heading(2, title, 'h-section')}${cta}</div>
<div class="faq__list" data-accordion>${items.map(([q, a], i) => `<div class="faq__item" data-reveal><h3 class="faq__q"><button type="button" id="faq${group}-q${i}" aria-expanded="false" aria-controls="faq${group}-a${i}"><span>${q}</span><i aria-hidden="true">${icon.plus}</i></button></h3><div class="faq__a" id="faq${group}-a${i}" role="region" aria-labelledby="faq${group}-q${i}"><div class="faq__a-inner"><p>${a}</p></div></div></div>`).join('')}</div></div></section>`;
}

// The three trust statements. Deliberately no invented numbers, ratings or client logos.
export function trustStrip() {
  const items = [
    ['Personal attention', 'Every enquiry begins with a real conversation with Monica.'],
    ['Practical next steps', 'Plain language, clear options and no pressure to proceed.'],
    ['Easy ways to enquire', 'Message Monica, copy your enquiry, or visit the Care website.'],
  ];
  return `<section class="trust" data-world="house" data-tone="dark" aria-label="How MKM works"><div class="wrap"><ul class="trust__list" data-stagger>${items.map(([t, p], i) => `<li data-reveal><span class="trust__num" aria-hidden="true">0${i + 1}</span><h2 class="trust__title">${t}</h2><p>${p}</p></li>`).join('')}</ul></div></section>`;
}

// Monica's welcome. No portrait has been supplied, so the arch is an abstract composition of grain,
// the lettermark in tone and a brass hairline. Swap `.welcome__arch` for a portrait when available.
export function monicaWelcome({ cta = true } = {}) {
  const { width, height } = brandData;
  return `<section class="section welcome" data-world="house" data-tone="light"><div class="wrap welcome__layout">
<div class="welcome__art" data-reveal="curtain" aria-hidden="true"><div class="welcome__arch"><svg class="welcome__mark" viewBox="0 0 ${width} ${height}" focusable="false"><use href="#mkm-p1"/><use href="#mkm-p2"/></svg><span class="welcome__sig">Monica</span></div><span class="welcome__line"></span></div>
<div class="welcome__copy">${label('A personal welcome')}<blockquote class="welcome__quote" data-split>${monicaQuote}</blockquote>
<ul class="welcome__tags"><li class="tag tag--care">Care enquiries welcome</li><li class="tag tag--beauty">Beauty enquiries welcome</li><li class="tag tag--tax">Tax enquiries welcome</li></ul>
${cta ? `<div class="welcome__cta" data-reveal>${button('Message Monica', '/contact/', { kind: 'ink' })}</div>` : ''}</div></div></section>`;
}

// Closing editorial call to action with a door for each room plus a general enquiry.
export function closing({ title = 'Let’s make the next step feel simpler.', kicker = 'Whenever you’re ready' } = {}) {
  const doors = [['Care', 'care', '/contact/?service=care'], ['Beauty', 'beauty', '/contact/?service=beauty'], ['Tax', 'tax', '/contact/?service=tax'], ['General enquiry', 'house', '/contact/?service=general']];
  return `<section class="section closing" data-world="house" data-tone="light" data-dock-hide><div class="wrap">${label(kicker)}${heading(2, title, 'closing__title')}
<ul class="doors" data-stagger>${doors.map(([name, world, href], i) => `<li data-reveal><a class="door door--${world}" href="${href}"><span class="door__num" aria-hidden="true">0${i + 1}</span><span class="door__name">${name}</span><span class="door__go">${icon.arrow}</span></a></li>`).join('')}</ul></div></section>`;
}

// Division page hero. `art` is raw HTML placed in the media column.
export function pageHero({ world, kicker, title, lede, actions = '', art = '', cls = '', meta = '' }) {
  return `<section class="phero phero--${world} ${cls}" data-world="${world}" data-tone="dark"><div class="phero__bg" aria-hidden="true"></div><div class="wrap phero__grid"><div class="phero__copy">${label(kicker)}${heading(1, title, 'h-hero')}<p class="lede" data-reveal>${lede}</p>${actions ? `<div class="phero__actions" data-reveal>${actions}</div>` : ''}${meta}</div>${art ? `<div class="phero__art">${art}</div>` : ''}</div></section>`;
}

// Text-led hero for utility pages (policy, hair care, delivery, 404).
export function plainHero({ kicker, title, lede, world = 'house', actions = '' }) {
  return `<section class="phero phero--plain phero--${world}" data-world="${world}" data-tone="light"><div class="wrap phero__grid phero__grid--plain"><div class="phero__copy">${label(kicker)}${heading(1, title, 'h-hero')}<p class="lede" data-reveal>${lede}</p>${actions ? `<div class="phero__actions" data-reveal>${actions}</div>` : ''}</div></div></section>`;
}

export { button, textLink, label, heading, escape, icon };

// Colour-room closing band for division pages.
export function serviceClose({ world, title, text, cta, kicker = 'Whenever you’re ready', secondary = '' }) {
  return `<section class="section sclose sclose--${world}" data-world="${world}" data-tone="dark" data-dock-hide><div class="wrap sclose__grid"><div>${label(kicker)}${heading(2, title, 'h-section')}</div><div class="sclose__side"><p class="lede" data-reveal>${text}</p><div class="btn-row" data-reveal>${cta}${secondary}</div></div></div></section>`;
}

// Large typographic manifest: each line brightens as it enters, with a short plain-language note.
export function manifest(lines, { kicker = 'What matters to us', world = 'care' } = {}) {
  return `<section class="section manifest manifest--${world}" data-world="${world}" data-tone="dark"><div class="wrap">${label(kicker)}<ol class="manifest__list">${lines.map(([big, small]) => `<li class="manifest__line" data-reveal="line"><span class="manifest__big">${big}</span><span class="manifest__small">${small}</span></li>`).join('')}</ol></div></section>`;
}
