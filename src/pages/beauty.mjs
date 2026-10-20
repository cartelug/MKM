import { shell } from '../lib/layout.mjs';
import { media, frame, button, icon, label, heading, img } from '../lib/html.mjs';
import { serviceClose } from '../lib/sections.mjs';
import { textures, lengthPrices } from '../data/hair.js';
import { money } from '../order.js';

const cropImg = (t, opts = {}) => img({ src: `/assets/media/${t.crop.file}`, alt: t.alt, width: t.crop.width, height: t.crop.height, ...opts });
const decorative = html => html.replace(/ alt="[^"]*"/, ' alt=""');

const hero = `<section class="phero phero--beauty" data-world="beauty" data-tone="dark"><div class="phero__bg" aria-hidden="true"></div>
<div class="wrap phero__grid"><div class="phero__copy">${label('02 · MKM Beauty')}${heading(1, 'Beauty with <em>presence.</em>', 'h-hero')}
<p class="lede" data-reveal>Wigs, human hair and extensions, skincare, and home décor. Browse at your own pace, ask Monica anything, and choose with confidence.</p>
<div class="phero__actions" data-reveal>${button('Start a beauty enquiry', '/contact/?service=beauty', { kind: 'brass' })}${button('Explore hair', '/beauty/hair/', { kind: 'ghost' })}</div></div>
<div class="phero__art"><div class="beauty-collage"><div class="beauty-collage__a">${frame(media.hair.straight({ eager: true, priority: true, sizes: '(min-width:960px) 20vw, 50vw', alt: 'Smooth, straight dark hair, photographed from behind' }), { cls: 'frame--b1', parallax: 5 })}</div><div class="beauty-collage__b">${frame(media.skincare({ eager: true, sizes: '(min-width:960px) 18vw, 44vw' }), { cls: 'frame--b2', parallax: 4 })}</div><div class="beauty-collage__c">${frame(media.hair.kinkyCurly({ sizes: '(min-width:960px) 22vw, 56vw', alt: 'A full arrangement of small dark curls' }), { cls: 'frame--b3', parallax: 6 })}</div><span class="beauty-collage__tag" aria-hidden="true">Hair · Skin · Home</span></div></div></div></section>`;

const stats = `<section class="stats" data-world="beauty" data-tone="dark" aria-label="MKM Beauty at a glance"><div class="wrap"><ul class="stats__list" data-stagger>
<li data-reveal><span class="stats__n"><span data-counter="6">6</span></span><span class="stats__t">hair textures</span></li>
<li data-reveal><span class="stats__n"><span data-counter="9">9</span></span><span class="stats__t">lengths, 16 to 32 inches</span></li>
<li data-reveal><span class="stats__n"><span data-counter="3">3</span></span><span class="stats__t">beauty categories</span></li></ul></div></section>`;

const panels = `<section class="section bcats" data-world="beauty" data-tone="light"><div class="wrap"><div class="bcats__head">${label('The beauty edit')}${heading(2, 'Three ways to <em>feel like yourself.</em>', 'h-section')}</div>
<div class="bcats__grid">
<a class="bpanel bpanel--hair" href="/beauty/hair/"><div class="bpanel__layers" aria-hidden="true"><div class="bpanel__layer bpanel__layer--back">${decorative(media.hair.wavy({ sizes: '(min-width:960px) 28vw, 70vw' }))}</div><div class="bpanel__layer bpanel__layer--front">${decorative(media.hair.bodyWave({ sizes: '(min-width:960px) 26vw, 66vw' }))}</div></div><div class="bpanel__text"><span class="bpanel__num">01</span><h3 class="bpanel__title">Hair</h3><p>Wigs, human hair and extensions. Choose a texture and length, then ask Monica about the details.</p><span class="bpanel__go">Explore hair ${icon.arrow}</span><span class="bpanel__meta">Listed from ${money(lengthPrices[0].usd)} · USD</span></div></a>
<a class="bpanel bpanel--skin" href="/beauty/skincare/"><div class="bpanel__layers" aria-hidden="true"><div class="bpanel__layer bpanel__layer--single">${decorative(media.skincare({ sizes: '(min-width:960px) 30vw, 80vw' }))}</div></div><div class="bpanel__text"><span class="bpanel__num">02</span><h3 class="bpanel__title">Skincare</h3><p>A moment for yourself. Ask Monica about what is currently available.</p><span class="bpanel__go">Discover skincare ${icon.arrow}</span></div></a>
<a class="bpanel bpanel--home" href="/beauty/home-decor/"><div class="bpanel__layers" aria-hidden="true"><div class="bpanel__layer bpanel__layer--single">${decorative(media.decor({ sizes: '(min-width:960px) 60vw, 90vw' }))}</div></div><div class="bpanel__text"><span class="bpanel__num">03</span><h3 class="bpanel__title">Home décor</h3><p>For the spaces you love. Tell Monica what you have in mind.</p><span class="bpanel__go">Explore home décor ${icon.arrow}</span></div></a></div>
<p class="image-note" data-reveal>Hair imagery is supplied by MKM. Skincare and home photography is illustrative; exact products and availability are confirmed with Monica.</p></div></section>`;

const gallery = `<section class="hscroll" data-hscroll data-world="beauty" data-tone="dark" aria-labelledby="textures-title"><div class="hscroll__sticky" data-hscroll-sticky><div class="hscroll__track" data-hscroll-track tabindex="-1">
<div class="hscroll__intro" data-hscroll-item>${label('Hair textures')}<h2 class="h-section" id="textures-title">Six textures, <em>seen up close.</em></h2><p class="lede">Scroll through the textures, tap any photograph to enlarge it, and choose one to start your enquiry.</p><span class="hscroll__hint" aria-hidden="true">Scroll ${icon.arrow}</span></div>
${textures.map((t, i) => `<article class="tex" data-hscroll-item><div class="tex__img">${cropImg(t, { sizes: '(min-width:960px) 24vw, 70vw' })}<button class="tex__zoom" type="button" data-lightbox="textures" data-full="/assets/hair/${t.image}" data-alt="${t.alt.replace(/"/g, '&quot;')}" data-caption="${t.name} · Style inspiration · exact product to confirm" aria-label="Enlarge ${t.name} photograph">${icon.zoom}</button></div>
<div class="tex__meta"><span class="tex__num">0${i + 1}</span><h3 class="tex__name"><a href="/shop/hair-enquiry/?texture=${encodeURIComponent(t.name)}">${t.name}</a></h3><p class="tex__note">${t.note}</p><a class="tex__go" href="/shop/hair-enquiry/?texture=${encodeURIComponent(t.name)}"><span>Enquire about ${t.name}</span>${icon.arrow}</a></div></article>`).join('')}
</div></div></section>`;

const editItems = [
  ['Detangle with care', 'Work from the ends upward, holding the hair as you go.', '/hair-care/#detangle'],
  ['Keep washing gentle', 'Lukewarm water, gentle handling and the right products.', '/hair-care/#washing'],
  ['Be mindful with heat', 'Check whether your hair can be heat-styled before you start.', '/hair-care/#heat'],
  ['Store it thoughtfully', 'Dry fully, keep away from heat and give wigs good support.', '/hair-care/#storage'],
  ['Colour, with advice', 'Ask MKM and a qualified stylist before colouring or bleaching.', '/hair-care/#colour'],
  ['Delivery & returns', 'What to confirm with MKM before you order and pay.', '/delivery-returns/'],
];
const edit = `<section class="section edit" data-world="beauty" data-tone="light" data-scroller><div class="wrap"><div class="edit__head"><div>${label('The MKM Edit')}${heading(2, 'Advice worth <em>keeping close.</em>', 'h-section')}</div>
<div class="edit__controls"><button type="button" class="round-btn" data-scroller-prev aria-label="Previous">${icon.prev}</button><button type="button" class="round-btn" data-scroller-next aria-label="Next">${icon.next}</button></div></div></div>
<div class="edit__scroll" data-scroller-track role="region" aria-label="The MKM Edit, scrollable" tabindex="0"><ul class="edit__list">${editItems.map(([t, p, href], i) => `<li class="edcard"><a href="${href}"><span class="edcard__num">0${i + 1}</span><h3 class="edcard__title">${t}</h3><p>${p}</p><span class="edcard__go">${i === 5 ? 'Read the details' : 'Read the note'} ${icon.arrow}</span></a></li>`).join('')}</ul></div>
<div class="wrap"><div class="edit__bar" aria-hidden="true"><span data-scroller-bar></span></div></div></section>`;

export function beauty() {
  return shell({
    title: 'MKM Beauty — Hair, Skincare & Home Décor',
    description: 'MKM Beauty brings together wigs, human hair and extensions, skincare and home décor. Explore six textures and start a beauty enquiry with Monica.',
    path: '/beauty/', world: 'beauty', tone: 'dark', features: ['lightbox'], crumbs: [['MKM Services', '/'], ['MKM Beauty', '/beauty/']],
    content: `${hero}${stats}${panels}${gallery}${edit}${serviceClose({ world: 'beauty', title: 'Not sure where to <em>start?</em>', text: 'Ask Monica for a beauty consultation. Tell her what you have in mind and she will help you take it from there.', cta: button('Start a beauty enquiry', '/contact/?service=beauty', { kind: 'brass' }), secondary: button('Build a hair enquiry', '/shop/hair-enquiry/', { kind: 'ghost' }), kicker: 'A conversation, not a hard sell' })}`,
  });
}

function categoryPage(type) {
  const skin = type === 'skincare';
  const name = skin ? 'Skincare' : 'Home décor';
  const topic = skin ? 'Skincare' : 'Home décor';
  const image = skin ? media.skincare({ eager: true, priority: true, sizes: '(min-width:960px) 34vw, 86vw' }) : media.decor({ eager: true, priority: true, sizes: '(min-width:960px) 44vw, 90vw' });
  return shell({
    title: `${name} — MKM Beauty`,
    description: skin ? 'Explore skincare with MKM Beauty. Tell Monica what you are looking for and ask about what is currently available.' : 'Home décor for the spaces you love. Share what you have in mind and ask Monica about the available options with MKM Beauty.',
    path: `/beauty/${type}/`, world: 'beauty', tone: 'dark', crumbs: [['MKM Services', '/'], ['MKM Beauty', '/beauty/'], [name, `/beauty/${type}/`]],
    content: `<section class="phero phero--beauty phero--category" data-world="beauty" data-tone="dark"><div class="phero__bg" aria-hidden="true"></div><div class="wrap phero__grid"><div class="phero__copy"><nav class="crumbs" aria-label="Breadcrumb"><a href="/beauty/">MKM Beauty</a><span aria-hidden="true">/</span><span>${name}</span></nav>${label(`02 · MKM Beauty · ${name}`)}${heading(1, skin ? 'A moment <em>for yourself.</em>' : 'For the spaces <em>you love.</em>', 'h-hero')}
<p class="lede" data-reveal>${skin ? 'Explore skincare with MKM Beauty. Tell Monica what you are looking for and ask about what is currently available.' : 'Home décor for your kind of space. Share what you have in mind and ask Monica about the available options.'}</p>
<div class="phero__actions" data-reveal>${button(`Start a beauty enquiry`, `/contact/?service=beauty&amp;topic=${encodeURIComponent(topic)}`, { kind: 'brass' })}${button('Back to MKM Beauty', '/beauty/', { kind: 'ghost' })}</div></div>
<div class="phero__art">${frame(image, { cls: skin ? 'frame--skin' : 'frame--decor', parallax: 5 })}<p class="image-note image-note--light">Illustrative photography · exact products to confirm</p></div></div></section>
<section class="section cat-detail" data-world="beauty" data-tone="light"><div class="wrap"><ol class="cat-steps" data-stagger><li data-reveal><span>01</span><b>Tell us what you like.</b><p>${skin ? 'Skin type, favourite products or what you would like to try.' : 'The room, the style and any sizes or colours you have in mind.'}</p></li><li data-reveal><span>02</span><b>Ask about the options.</b><p>${skin ? 'Ask for the product name, ingredients and usage guidance.' : 'Ask for current photos, dimensions, materials and delivery details.'}</p></li><li data-reveal><span>03</span><b>Confirm with Monica.</b><p>Products, prices and availability are confirmed with you directly before anything is agreed.</p></li></ol>
<p class="lede cat-detail__note" data-reveal>Specific products, prices and availability are confirmed directly with MKM Beauty. The photography here sets a visual direction and does not represent confirmed stock.</p></div></section>
${serviceClose({ world: 'beauty', title: skin ? 'Ask about <em>skincare.</em>' : 'Tell Monica about <em>your space.</em>', text: 'A short message is all it takes. Monica will get back to you about the options and next steps.', cta: button('Start a beauty enquiry', `/contact/?service=beauty&amp;topic=${encodeURIComponent(topic)}`, { kind: 'brass' }), kicker: 'A conversation, not a hard sell' })}`,
  });
}
export const skincare = () => categoryPage('skincare');
export const homeDecor = () => categoryPage('home-decor');
