// Hair pages: landing, shop, enquiry builder, textures, care notes, delivery & returns.
import { shell } from '../lib/layout.mjs';
import { site } from '../config/runtime.mjs';
import { media, frame, button, icon, label, heading, textLink, img, escape } from '../lib/html.mjs';
import { steps, faq, serviceClose, plainHero } from '../lib/sections.mjs';
import { lengthPrices, textures } from '../data/hair.js';
import { money, quote, colourOptions } from '../order.js';

const fromPrice = money(Math.min(...lengthPrices.map(p => p.usd)));
const crop = (t, opts = {}) => img({ src: `/assets/media/${t.crop.file}`, alt: t.alt, width: t.crop.width, height: t.crop.height, ...opts });
const enquiryHref = t => `/shop/hair-enquiry/?texture=${encodeURIComponent(t.name)}`;
const zoomBtn = (t, group = 'hair') => `<button class="tex__zoom" type="button" data-lightbox="${group}" data-full="/assets/hair/${t.image}" data-alt="${escape(t.alt)}" data-caption="${t.name} · Style inspiration · exact product to confirm" aria-label="Enlarge ${t.name} photograph">${icon.zoom}</button>`;
const note = `<p class="image-note">${site.photoNote}</p>`;

const sendWays = [site.whatsappNumber && 'on WhatsApp', site.contactEmail && 'by email'].filter(Boolean).join(' or ');
const hairFaqs = [
  ['How do I order?', `Choose your texture, length and colour preference, then review your enquiry message. ${sendWays ? `You can send it to Monica ${sendWays}, or copy it.` : 'You can copy it and send it to Monica yourself.'} MKM confirms the details with you before any order is placed.`],
  ['Are the listed prices in US dollars?', 'Yes. All listed prices are in USD and are length references. The exact product, any texture or construction adjustments, taxes and delivery costs are confirmed with MKM.'],
  ['Is every length, texture and colour available?', 'Availability is checked directly. Choosing an option is an enquiry about your preference. It does not reserve stock, and the photographs are style inspiration until product details are confirmed.'],
  ['Can you help me choose a texture?', 'Yes. Say what you are looking for in your enquiry and ask for current photographs, specifications and advice before you decide.'],
  ['Where do you deliver, and can I return an order?', 'Please confirm delivery locations, charges, timing, cancellation and returns terms with MKM before you pay. See the delivery and returns page for what to ask.'],
];

function priceTable() {
  return `<section class="section price-guide" id="length-guide" data-world="beauty" data-tone="light"><div class="wrap price-guide__grid"><div>${label('From 16 to 32 inches')}${heading(2, 'A little length. <em>A clear starting point.</em>', 'h-section')}<p class="lede" data-reveal>Every listed price is a length reference in US dollars. Confirm the exact hair, texture, construction and final total with MKM.</p><div data-reveal>${textLink('Choose your details', '/shop/hair-enquiry/')}</div></div>
<div class="price-table" data-reveal><table><caption>Listed length-price references (USD)</caption><thead><tr><th scope="col">Length</th><th scope="col">Listed reference</th></tr></thead><tbody>${lengthPrices.map(p => `<tr><th scope="row">${p.inches}<span> inches</span></th><td>${money(p.usd)}</td></tr>`).join('')}</tbody></table><p class="image-note">Texture adjustments, taxes and shipping are to be confirmed. These references do not mean every combination is in stock.</p></div></div></section>`;
}

function textureGrid(large = false, level = 3) {
  return `<div class="texgrid${large ? ' texgrid--large' : ''}" data-stagger>${textures.map((t, i) => `<article class="texcard" data-reveal data-shop-texture="${escape(t.name)}"><div class="texcard__img" data-reveal="curtain">${crop(t, { sizes: '(min-width:960px) 28vw, 80vw' })}${zoomBtn(t)}</div><div class="texcard__meta"><span class="tex__num">0${i + 1}</span><h${level} class="texcard__name"><a href="${enquiryHref(t)}">${t.name}</a></h${level}><p class="texcard__note">${large ? t.description : t.note}</p><div class="texcard__foot"><span class="texcard__price">From ${fromPrice}</span><a class="tex__go" href="${enquiryHref(t)}"><span>Choose length &amp; enquire</span>${icon.arrow}</a></div></div></article>`).join('')}</div>`;
}

const orderSteps = steps([
  ['Select your hair', 'Explore the textures. Choose a preferred length, colour and quantity.'],
  ['Review your enquiry', 'See the listed length-price reference in US dollars and a ready-to-send message.'],
  ['Confirm with Monica', 'Check the exact product, availability, final total and delivery before ordering.'],
], { id: 'how-to-order', kicker: 'A little guidance', title: 'Good hair starts with <em>the right details.</em>', world: 'beauty' });

export function hairLanding() {
  return shell({
    title: 'Hair — Wigs, Human Hair & Extensions | MKM Beauty',
    description: 'Explore six hair textures and nine lengths from 16 to 32 inches with MKM Beauty. Build a hair enquiry and ask Monica about the details.',
    path: '/beauty/hair/', world: 'beauty', tone: 'dark', features: ['lightbox', 'enquiry'], crumbs: [['MKM Services', '/'], ['MKM Beauty', '/beauty/'], ['Hair', '/beauty/hair/']],
    content: `<section class="phero phero--beauty phero--category" data-world="beauty" data-tone="dark"><div class="phero__bg" aria-hidden="true"></div><div class="wrap phero__grid"><div class="phero__copy"><nav class="crumbs" aria-label="Breadcrumb"><a href="/beauty/">MKM Beauty</a><span aria-hidden="true">/</span><span>Hair</span></nav>${label('02 · MKM Beauty · Hair')}${heading(1, 'Hair that feels <em>like you.</em>', 'h-hero')}<p class="lede" data-reveal>Human hair, wigs and extensions. Choose a texture, pick a length and ask Monica about the details.</p><div class="phero__actions" data-reveal>${button('Build your hair enquiry', '/shop/hair-enquiry/', { kind: 'brass' })}${button('Meet the six textures', '/textures/', { kind: 'ghost' })}</div><p class="phero__meta" data-reveal>16 to 32 inches · Listed from ${fromPrice} USD</p></div>
<div class="phero__art"><div class="hair-hero-art"><div class="hair-hero-art__a">${frame(media.hair.waterWave({ eager: true, priority: true, sizes: '(min-width:960px) 26vw, 64vw' }), { cls: 'frame--b1', parallax: 5 })}</div><div class="hair-hero-art__b">${frame(media.hair.straight({ eager: true, sizes: '(min-width:960px) 18vw, 44vw', alt: 'Smooth, straight dark hair, photographed from behind' }), { cls: 'frame--b2', parallax: 4 })}</div></div></div></div></section>
<section class="section hair-textures" data-world="beauty" data-tone="light"><div class="wrap"><div class="hair-textures__head">${label('Six ways to express yourself')}${heading(2, 'Find your <em>texture.</em>', 'h-section')}</div>${textureGrid()}${note}</div></section>${priceTable()}${orderSteps}${faq(hairFaqs, { id: 'hair-faq', title: 'A few things <em>you might ask.</em>', world: 'beauty', cta: textLink('Ask Monica directly', '/contact/?service=beauty') })}${serviceClose({ world: 'beauty', title: 'A length you love. <em>A texture that feels like you.</em>', text: 'Put your details into a clear enquiry and send it to Monica when you are ready.', cta: button('Build your hair enquiry', '/shop/hair-enquiry/', { kind: 'brass' }), kicker: 'Your next hair enquiry' })}`,
  });
}

export function shop() {
  return shell({
    title: 'Shop Hair — Textures & Lengths | MKM Beauty',
    description: 'Browse six hair textures and nine lengths. Choose a texture to start an enquiry with MKM Beauty and confirm details with Monica.',
    path: '/shop/', world: 'beauty', tone: 'light', features: ['lightbox'], crumbs: [['MKM Services', '/'], ['MKM Beauty', '/beauty/'], ['Shop hair', '/shop/']],
    content: `${plainHero({ kicker: 'The collection', title: 'Hair, <em>how you like it.</em>', lede: 'Six textures. Nine lengths. Start with what feels right for you, and confirm the details with Monica.', world: 'beauty', actions: textLink('See the length &amp; price guide', '#length-guide') })}
<section class="section shop" data-world="beauty" data-tone="light"><div class="wrap"><div class="shop__bar"><span class="label">Explore your options</span><div class="shop__filter"><label for="shop-texture">Texture</label><select id="shop-texture"><option value="all">All textures</option>${textures.map(t => `<option>${t.name}</option>`).join('')}</select></div></div><p class="shop__count" id="shop-result-count" role="status" aria-live="polite">6 texture enquiry options</p>${textureGrid(true, 2)}${note}</div></section>${priceTable()}${orderSteps}`,
  });
}

export function enquiry() {
  const initial = quote({ inches: 20, texture: 'Body Wave', quantity: 1 });
  const body = textures.find(t => t.name === 'Body Wave');
  return shell({
    title: 'Build Your Hair Enquiry | MKM Beauty',
    description: 'Choose a texture, length, colour preference and quantity, then review a ready-to-send hair enquiry for Monica at MKM Beauty.',
    path: '/shop/hair-enquiry/', world: 'beauty', tone: 'light', features: ['lightbox', 'enquiry'], crumbs: [['MKM Services', '/'], ['MKM Beauty', '/beauty/'], ['Hair enquiry', '/shop/hair-enquiry/']],
    content: `<section class="builder-section" data-world="beauty" data-tone="light"><div class="wrap builder">
<div class="builder__media"><div class="builder__stage"><img id="builder-image" data-texture="Body Wave" src="/assets/hair/${body.image.replace('.webp', '-640.webp')}" srcset="/assets/hair/${body.image.replace('.webp', '-480.webp')} 480w, /assets/hair/${body.image.replace('.webp', '-640.webp')} 640w, /assets/hair/${body.image} 810w" sizes="(min-width:960px) 40vw, 88vw" alt="${escape(body.alt)}" width="810" height="1080" fetchpriority="high" decoding="async"><button type="button" class="builder__zoom" data-builder-zoom data-lightbox="builder" data-full="/assets/hair/${body.image}" data-alt="${escape(body.alt)}" data-caption="Body Wave · Style inspiration · exact product to confirm" aria-label="Enlarge this photograph">${icon.zoom}</button><span class="builder__label" data-builder-label>Body Wave · style inspiration</span></div><p class="image-note">Visual inspiration only. Your selection does not confirm the hair shown or available stock.</p></div>
<form class="builder__form" id="hair-form" novalidate><header class="builder__head">${label('Make it yours')}<h1 class="h-section" data-split>Your hair. <em>Your way.</em></h1><p class="lede">A texture you love, a length that suits you. Let’s start with the details.</p></header>
<fieldset class="fieldset"><legend class="step-legend"><b>01</b> Texture</legend><div class="tex-options">${textures.map(t => `<label class="tex-option"><input type="radio" name="texture" value="${t.name}"${t.name === 'Body Wave' ? ' checked' : ''}><span class="tex-option__img"><img src="/assets/media/swatch/${t.crop.file}" alt="" width="120" height="150" loading="lazy" decoding="async"></span><span class="tex-option__name">${t.name}</span></label>`).join('')}</div></fieldset>
<fieldset class="fieldset"><legend class="step-legend"><b>02</b> Length</legend><div class="len-options">${lengthPrices.map(p => `<label class="len-option"><input type="radio" name="inches" value="${p.inches}"${p.inches === 20 ? ' checked' : ''}><span><b>${p.inches}</b><small>${money(p.usd)}</small></span></label>`).join('')}</div><p class="field__hint">Inches, with the listed length-price reference in USD.</p></fieldset>
<fieldset class="fieldset"><legend class="step-legend"><b>03</b> Colour preference <small>(availability confirmed by MKM)</small></legend><div class="chips">${colourOptions.map((c, i) => `<label class="chip"><input type="radio" name="colour" value="${c}"${i === 0 ? ' checked' : ''}><span>${c}</span></label>`).join('')}</div><div class="field builder__other" data-colour-other hidden><label for="colour-other">Describe the colour</label><input id="colour-other" name="colourOther" type="text" maxlength="40" autocomplete="off"></div></fieldset>
<div class="field"><span class="step-legend" id="qty-label"><b>04</b> Quantity</span><div class="stepper" role="group" aria-labelledby="qty-label"><button type="button" id="quantity-minus" aria-label="Decrease quantity">−</button><input id="hair-quantity" name="quantity" type="number" min="1" max="10" step="1" value="1" inputmode="numeric" aria-label="Quantity"><button type="button" id="quantity-plus" aria-label="Increase quantity">+</button></div></div>
<div class="field"><label for="hair-name">Your first name <small>(optional)</small></label><input id="hair-name" name="name" type="text" maxlength="60" autocomplete="given-name"></div>
<div class="field"><label for="hair-note">Anything else Monica should know <small>(optional)</small></label><textarea id="hair-note" name="note" rows="2" maxlength="400"></textarea></div>
<aside class="brief" aria-live="polite" aria-atomic="true" aria-label="Your hair brief"><p class="label">Your hair brief</p><dl class="brief__rows"><div><dt>Texture</dt><dd data-sum-texture>Body Wave</dd></div><div><dt>Length</dt><dd data-sum-length>20 inches</dd></div><div><dt>Colour</dt><dd data-sum-colour>No preference</dd></div><div><dt>Quantity</dt><dd data-sum-qty>1</dd></div></dl><div class="brief__price"><div><span>Listed length-price reference</span><strong id="unit-price">${money(initial.unit)}</strong></div><div><span>Indicative subtotal <small>USD</small></span><strong id="subtotal-price">${money(initial.subtotal)}</strong></div></div><p class="brief__note">Final specification, price, availability and delivery are confirmed with Monica. No payment is taken here.</p></aside>
<button class="btn btn--beauty btn--wide" type="submit" data-magnetic><span class="btn__fill" aria-hidden="true"></span><span class="btn__label">Review &amp; send my enquiry</span><span class="btn__icon">${icon.arrow}</span></button></form></div></section>${priceTable()}${faq(hairFaqs, { id: 'hair-faq', title: 'A few things <em>you might ask.</em>', world: 'beauty' })}`,
  });
}

export function textureDetail() {
  return shell({
    title: 'Our Hair Textures | MKM Beauty',
    description: 'A closer look at six hair textures: straight, body wave, kinky straight, water wave, kinky curly and wavy. Ask MKM for the exact pattern and product details.',
    path: '/textures/', world: 'beauty', tone: 'light', features: ['lightbox'], crumbs: [['MKM Services', '/'], ['MKM Beauty', '/beauty/'], ['Textures', '/textures/']],
    content: `${plainHero({ kicker: 'The texture edit', title: 'A texture for <em>your kind of beautiful.</em>', lede: 'A starting point for your next look. Browse the six texture labels, then ask Monica for the exact pattern and product details.', world: 'beauty' })}
<section class="section" data-world="beauty" data-tone="light"><div class="wrap">${textureGrid(true, 2)}${note}</div></section>${orderSteps}${serviceClose({ world: 'beauty', title: 'Find the look you love. <em>Then let’s talk details.</em>', text: 'A texture name is just the beginning. Ask for current product photographs and confirm your finish, length and availability before ordering.', cta: button('Create your hair enquiry', '/shop/hair-enquiry/', { kind: 'brass' }) })}`,
  });
}

const careNotes = [
  ['detangle', 'Detangle with care', 'Gently work through tangles from the ends upward, holding the hair as you detangle to limit pulling. Ask MKM which comb or brush suits the exact texture and construction.'],
  ['washing', 'Keep washing gentle', 'Follow the guidance supplied with your specific hair. Use lukewarm water and gentle handling, and ask for suitable products and how often to wash before you start.'],
  ['heat', 'Be mindful with heat', 'Confirm whether your particular hair and wig construction can be heat-styled. If it can, ask for an appropriate temperature and a protectant. Do not assume every item tolerates the same heat.'],
  ['storage', 'Dry and store thoughtfully', 'Let hair dry fully according to its care instructions. Store it away from excessive heat and moisture, with suitable support for wigs where recommended.'],
  ['curls', 'Give curls a little attention', 'Detangling and styling vary by texture. Ask how to preserve the pattern of your chosen hair, and avoid vigorous brushing unless the supplier recommends it.'],
  ['colour', 'Ask before changing the colour', 'Colouring, bleaching and chemical treatments can change the hair. Confirm suitability with MKM and seek advice from a qualified stylist before applying them.'],
];
export function hairCare() {
  return shell({
    title: 'The MKM Edit — Hair Care Notes | MKM Beauty',
    description: 'General guidance for looking after hair: detangling, washing, heat, storage and colour. Ask MKM for care instructions for your exact item.',
    path: '/hair-care/', world: 'beauty', tone: 'light', crumbs: [['MKM Services', '/'], ['MKM Beauty', '/beauty/'], ['The MKM Edit', '/hair-care/']],
    content: `${plainHero({ kicker: 'The MKM Edit · Care notes', title: 'A little care. <em>A lovely routine.</em>', lede: 'General guidance for looking after hair. The right routine depends on the exact product, texture and construction you choose.', world: 'beauty' })}
<section class="section care-notes" data-world="beauty" data-tone="light"><div class="wrap care-notes__grid"><div class="care-notes__aside">${frame(media.hair.bodyWave({ sizes: '(min-width:960px) 30vw, 80vw', alt: 'Long dark hair in soft, broad waves' }), { cls: 'frame--note', parallax: 5 })}<p class="image-note">Ask MKM for care instructions for your exact item.</p></div><div class="care-notes__list" data-stagger>${careNotes.map(([id, h, p], i) => `<article class="cnote" id="${id}" data-reveal><span class="cnote__num">0${i + 1}</span><div><h2 class="h3">${h}</h2><p>${p}</p></div></article>`).join('')}</div></div></section>
${serviceClose({ world: 'beauty', title: 'A question about <em>your hair?</em>', text: 'Include your care questions in an enquiry and confirm the routine for your chosen item.', cta: button('Ask Monica', '/contact/?service=beauty', { kind: 'brass' }), kicker: 'Always happy to help' })}`,
  });
}

export function delivery() {
  const approval = site.previewMode ? '<p class="policy__flag">These terms are awaiting Monica’s approval before launch.</p>' : '';
  return shell({
    title: 'Delivery & Returns | MKM Beauty',
    description: 'What to confirm with MKM Beauty about delivery, payment, availability, returns, refunds and cancellations before you order.',
    path: '/delivery-returns/', world: 'beauty', tone: 'light', crumbs: [['MKM Services', '/'], ['MKM Beauty', '/beauty/'], ['Delivery & returns', '/delivery-returns/']],
    content: `${plainHero({ kicker: 'Before you order', title: 'The details <em>that matter.</em>', lede: 'Delivery, payment and returns terms should be clear before you decide. Please confirm them directly with Monica.', world: 'beauty' })}
<section class="section policy" data-world="beauty" data-tone="light"><div class="wrap policy__grid"><div class="policy__aside">${label('Delivery &amp; returns')}${approval}<div data-reveal>${button('Make an enquiry', '/shop/hair-enquiry/', { kind: 'solid' })}</div></div>
<div class="policy__list" data-stagger>
<article data-reveal><h2 class="h3">Delivery</h2><p>Ask MKM to confirm whether delivery is available to your location, the applicable charge, the expected timing and how dispatch will be arranged. No shipping regions or delivery times are confirmed on this website.</p></article>
<article data-reveal><h2 class="h3">Your final total</h2><p>Listed USD prices are length references. Confirm the exact product, any texture or construction adjustments, taxes, delivery costs and payment instructions before you make a payment.</p></article>
<article data-reveal><h2 class="h3">Returns, refunds &amp; cancellations</h2><p>Request the applicable written terms from MKM before ordering. Eligibility, conditions and timeframes are not published on this website. Nothing here sets or limits any statutory rights.</p></article>
<article data-reveal><h2 class="h3">Availability</h2><p>Choosing a length and texture creates an enquiry. It does not reserve hair, confirm stock, accept an order or take payment.</p></article></div></div></section>`,
  });
}
