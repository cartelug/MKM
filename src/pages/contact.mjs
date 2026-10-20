import { shell } from '../lib/layout.mjs';
import { site } from '../config/runtime.mjs';
import { icon, label, brandData } from '../lib/html.mjs';
import { contactReasons } from '../data/services.js';

const reasonChips = contactReasons.map((r, i) => `<label class="chip chip--${r.theme}"><input type="radio" name="service" value="${r.id}"${i === 0 ? ' checked' : ''}><span>${r.id === 'general' ? 'General' : r.short}</span></label>`).join('');
const { width, height } = brandData;

export function contact() {
  return shell({
    title: 'Speak with Monica — Contact MKM Services',
    description: 'Choose Care, Beauty, Tax or a general enquiry and prepare a message for Monica at MKM Services. Review it, then send or copy it yourself.',
    path: '/contact/', world: 'house', tone: 'light', crumbs: [['MKM Services', '/'], ['Contact', '/contact/']],
    content: `<section class="contact" data-world="house" data-tone="light"><div class="contact__grid">
<aside class="contact__side" data-contact-side data-world="care" aria-label="About your enquiry"><div class="contact__atmosphere" aria-hidden="true"></div><svg class="contact__mark" viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false"><use href="#mkm-p1"/><use href="#mkm-p2"/></svg>
<div class="contact__side-inner">${label('Speak with Monica')}<p class="contact__title h-section" data-side-title>Let’s talk about <em>support.</em></p>
<div class="contact__details"><p data-side-detail="care">Care enquiries can also be made through the official MKM Care website.</p><p data-side-detail="beauty" hidden>Looking for hair? You can also build a ready-made hair enquiry.</p><p data-side-detail="tax" hidden>Prefer to look first? See what a conversation with MKM Tax Return Services involves.</p><p data-side-detail="general" hidden>Not sure where to start? That is fine. Tell Monica what is on your mind.</p>
<a class="text-link text-link--light" data-side-detail="care" href="${site.careSite.url}" target="_blank" rel="noopener noreferrer"><span>${site.careSite.label}</span>${icon.diagonal}</a><a class="text-link text-link--light" data-side-detail="beauty" href="/shop/hair-enquiry/" hidden><span>Build a hair enquiry</span>${icon.arrow}</a><a class="text-link text-link--light" data-side-detail="tax" href="/tax/#what-to-expect" hidden><span>What you can expect</span>${icon.arrow}</a></div>
<p class="contact__tag">Care. Beauty. Tax.</p></div></aside>
<div class="contact__panel" data-contact-panel data-world="care"><div class="contact__panel-inner">
<form id="contact-form" novalidate><header class="contact__head"><h1 class="h-section">Hello, <em>I’m Monica.</em></h1><p class="lede">Thank you for reaching out. Tell me a little about what you need, and we will prepare your message together.</p></header>
<fieldset class="fieldset"><legend class="label">What can I help with?</legend><div class="chips chips--reasons">${reasonChips}</div></fieldset>
<div class="field"><label for="c-name">Your first name</label><input id="c-name" name="name" type="text" maxlength="60" autocomplete="given-name" required aria-describedby="c-name-error"><p class="field__error" id="c-name-error">Please add your first name so Monica knows who she is speaking with.</p></div>
<div class="field" id="c-topic-field"><label for="c-topic">What are you interested in?</label><select id="c-topic" name="topic"></select></div>
<div data-extra-host></div>
<div class="field"><label for="c-note">A little more detail <small>(optional)</small></label><textarea id="c-note" name="note" rows="4" maxlength="600" aria-describedby="c-note-hint c-note-count"></textarea><p class="field__hint" id="c-note-hint" data-privacy-hint></p><p class="field__count" id="c-note-count">0 / 600</p></div>
<p class="form__status" role="status" aria-live="polite" data-form-status></p>
<button class="btn btn--solid btn--wide" type="submit" data-magnetic><span class="btn__fill" aria-hidden="true"></span><span class="btn__label">Prepare my enquiry</span><span class="btn__icon">${icon.arrow}</span></button>
<p class="form__fine">Nothing is sent from this page. You will review your message, then send or copy it yourself.</p></form>
<div id="contact-result" hidden tabindex="-1" data-confirm-root aria-live="polite"></div>
<p class="contact__noscript">The enquiry form needs JavaScript, which is not running. You can still reach the Care team through <a href="${site.careSite.url}" target="_blank" rel="noopener noreferrer">${site.careSite.label}</a>, or reload this page.</p></div></div></div></section>`,
  });
}
