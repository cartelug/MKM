import { shell } from '../lib/layout.mjs';
import { site } from '../config/runtime.mjs';
import { media, frame, button, icon, label, heading } from '../lib/html.mjs';
import { steps, faq, manifest, serviceClose } from '../lib/sections.mjs';

const careUrl = site.careSite.url;
const hero = `<section class="phero phero--care" data-world="care" data-tone="dark"><div class="phero__bg" aria-hidden="true"></div>
<div class="wrap phero__grid"><div class="phero__copy">${label('01 · MKM Care Services')}${heading(1, 'People first. <em>Always.</em>', 'h-hero')}
<p class="lede" data-reveal>Compassionate disability and community-based support, with a personal approach to the support you need. Everything begins with a conversation, at your pace.</p>
<div class="phero__actions" data-reveal>${button('Talk through your support needs', '/contact/?service=care', { kind: 'paper' })}${button(site.careSite.label, careUrl, { kind: 'ghost', external: true })}</div></div>
<div class="phero__art phero__art--care"><div class="care-hero-frame"><div class="care-hero-img">${frame(media.care.portrait({ eager: true, priority: true, sizes: '(min-width:960px) 34vw, 86vw' }), { cls: 'frame--hero', parallax: 5 })}</div><p class="care-hero-note"><span>Disability &amp; community support</span><i aria-hidden="true"></i><span>Illustrative photography</span></p></div></div></div></section>`;

const support = `<section class="section care-support" data-world="care" data-tone="light"><div class="wrap care-support__grid">
<div class="care-support__media">${frame(media.care.gaze({ sizes: '(min-width:960px) 32vw, 86vw' }), { cls: 'frame--gaze', parallax: 6 })}</div>
<div class="care-support__copy">${label('Support, in plain words')}${heading(2, 'Support that fits <em>your</em> life.', 'h-section')}
<p class="lede" data-reveal>MKM Care Services offers compassionate disability and community-based support, with people at the centre. Here is what that can look like.</p>
<div class="support-items" data-stagger>
<article class="support-item" data-reveal><span class="support-item__num">01</span><div><h3 class="h3">Disability support</h3><p>Support shaped around your needs, goals and preferences. Talk with Monica about what you are looking for and which services may suit your circumstances.</p></div></article>
<article class="support-item" data-reveal><span class="support-item__num">02</span><div><h3 class="h3">Community-based support</h3><p>Connection in everyday life. Ask about community-based support and the options available through MKM Care Services.</p></div></article></div>
<div data-reveal>${textLinkContact()}</div></div></div></section>`;
function textLinkContact() { return `<a class="text-link" href="/contact/?service=care"><span>Start with a message to Monica</span>${icon.arrow}</a>`; }

const banner = `<section class="care-banner" data-world="care" data-tone="dark" aria-label="Quiet moment">${frame(media.care.forest({ sizes: '100vw', alt: '' }), { cls: 'frame--banner', parallax: 6 })}<div class="care-banner__veil" aria-hidden="true"></div><div class="wrap care-banner__text">${heading(2, 'Time, space and <em>a steady hand.</em>', 'h-section')}</div></section>`;

const how = steps([
  ['Say hello', 'Send a short message to Monica, or begin on the MKM Care website. You do not need the right words.'],
  ['Share what matters', 'Tell Monica what you are looking for, in your own words. Please keep sensitive medical details for later.'],
  ['Talk through the options', 'Monica gets back to you to talk about what support could look like and what the next steps are.'],
  ['Take the next step, together', 'Decide what feels right, at your own pace. There is no pressure to go ahead.'],
], { id: 'how-support-begins', kicker: 'How support begins', title: 'Four calm steps, <em>one conversation at a time.</em>', world: 'care' });

const official = `<section class="section care-official" data-world="care" data-tone="dark"><div class="wrap care-official__grid"><div>${label('The dedicated MKM Care website')}${heading(2, 'Find more, <em>and get in touch.</em>', 'h-section')}</div>
<div><p class="lede" data-reveal>The official MKM Care Services website has service information and the care enquiry process.</p>
<a class="big-link" href="${careUrl}" target="_blank" rel="noopener noreferrer" data-reveal><span>${site.careSite.label}</span>${icon.diagonal}</a></div></div></section>`;

const questions = faq([
  ['Who should I contact first?', 'Start wherever feels easiest. You can send Monica a short message through this website, or visit the MKM Care website for service information and the care enquiry process.'],
  ['Do I need to share personal details in my first message?', 'No. Share only what you are comfortable with. Please keep medical details, identity numbers and other sensitive information out of this first message; you can talk through the detail directly later.'],
  ['What happens after I reach out?', 'Monica reads your message and gets back to you to talk about the options and next steps. You decide what feels right, and there is no pressure to proceed.'],
  ['Is this form sending my message to MKM?', 'This website builds a message for you to review and then send or copy yourself. It does not store or submit your details anywhere.'],
], { id: 'care-faq', title: 'A few things <em>you might ask.</em>', world: 'care' });

export function care() {
  return shell({
    title: 'MKM Care Services — Disability & Community Support',
    description: 'MKM Care Services offers compassionate disability and community-based support with a personal approach. Talk through your support needs with Monica.',
    path: '/care/', world: 'care', tone: 'dark', crumbs: [['MKM Services', '/'], ['MKM Care Services', '/care/']],
    content: `${hero}${support}${manifest([['People first.', 'Every conversation begins with you.'], ['Plain words.', 'Clear, jargon-free and kind.'], ['Practical steps.', 'One workable next step at a time.'], ['Your pace.', 'No pressure, ever.']])}${banner}${how}${official}${questions}${serviceClose({ world: 'care', title: 'Let’s talk through <em>what you need.</em>', text: 'Send Monica a short message, and she will take it from there. Or visit the official Care website.', cta: button('Talk through your support needs', '/contact/?service=care', { kind: 'paper' }), secondary: button(site.careSite.label, careUrl, { kind: 'ghost', external: true }) })}`,
  });
}
