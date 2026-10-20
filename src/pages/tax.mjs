import { shell } from '../lib/layout.mjs';
import { button, icon, label, heading, escape } from '../lib/html.mjs';
import { faq, serviceClose } from '../lib/sections.mjs';
import { services } from '../data/services.js';

const topics = services.find(s => s.id === 'tax').topics;
const paths = [
  ['Tax return assistance', topics[0], 'Understand the steps for your return and where you would like a little help. Talk through what you need with Monica.'],
  ['Entitlements review', topics[1], 'Ask for help reviewing claims that may apply to your own circumstances, and the details that matter for them.'],
  ['Tax debt support', topics[2], 'Start a conversation about support to reduce and manage tax debts, and what the available next steps could be.'],
];

const hero = `<section class="phero phero--tax" data-world="tax" data-tone="dark"><div class="phero__bg" aria-hidden="true"></div>
<div class="wrap phero__grid"><div class="phero__copy">${label('03 · MKM Tax Return Services')}${heading(1, 'A clearer <em>next step.</em>', 'h-hero')}
<p class="lede" data-reveal>Personal assistance with tax returns, eligible claims, and support to reduce and manage tax debts. Plain language, at your pace.</p>
<div class="phero__actions" data-reveal>${button('Discuss your tax support', '/contact/?service=tax', { kind: 'paper' })}${button('What to expect', '#what-to-expect', { kind: 'ghost' })}</div></div>
<div class="phero__art"><dl class="infogrid" data-stagger>
${[['Tax return assistance', 'Understand the steps for your return.'], ['Entitlements review', 'Look at claims that may apply to you.'], ['Tax debt support', 'Reduce and manage what you owe.'], ['Plain language', 'No jargon, one step at a time.'], ['Your pace', 'No pressure to proceed.'], ['A short first message', 'Tell Monica what you need.']].map(([t, d], i) => `<div class="infogrid__cell" data-reveal><dt><span>0${i + 1}</span>${t}</dt><dd>${d}</dd></div>`).join('')}</dl></div></div></section>`;

const pathsSection = `<section class="section tax-paths" data-world="tax" data-tone="light"><div class="wrap"><div class="tax-paths__head">${label('Three support paths')}${heading(2, 'Where would you like <em>a hand?</em>', 'h-section')}</div>
<ol class="paths" data-stagger>${paths.map(([title, topic, text], i) => `<li class="path" data-reveal><span class="path__num">0${i + 1}</span><div class="path__body"><h3 class="path__title">${title}</h3><p>${text}</p></div><a class="path__go" href="/contact/?service=tax&amp;topic=${encodeURIComponent(topic)}" aria-label="Enquire about ${escape(title.toLowerCase())}">${icon.diagonal}</a></li>`).join('')}</ol>
<p class="tax-note" data-reveal>Every situation is different. Nothing on this website guarantees a refund, an outcome or a timeframe, and it is general information rather than tax or legal advice.</p></div></section>`;

const expect = `<section class="section expect" id="what-to-expect" data-world="tax" data-tone="dark"><div class="wrap expect__grid"><div class="expect__intro">${label('What you can expect')}${heading(2, 'A calm, <em>step-by-step</em> process.', 'h-section')}<p class="lede" data-reveal>From a short message to an agreed next step, here is how a conversation with MKM Tax Return Services usually unfolds.</p></div>
<ol class="timeline" data-stagger>${[['Tell us what you need', 'Choose the area you would like help with and send Monica a short message. Please keep your tax file number and bank details out of it.'], ['A first conversation', 'Monica reads your message and gets back to you to talk about your situation and what could help.'], ['Gather what is relevant', 'You are guided on the information that is relevant to your own circumstances, in plain language.'], ['Agree the next steps', 'The scope of help and the next steps are confirmed with you, so you know where things stand.']].map(([t, p], i) => `<li class="timeline__item" data-reveal><span class="timeline__dot" aria-hidden="true"></span><span class="timeline__num">0${i + 1}</span><h3 class="h3">${t}</h3><p>${p}</p></li>`).join('')}</ol></div></section>`;

const quick = `<section class="section quick" data-world="tax" data-tone="light"><div class="wrap quick__grid"><div class="quick__copy">${label('Quick enquiry')}${heading(2, 'What would you like <em>help with?</em>', 'h-section')}<p class="lede" data-reveal>Choose an area and add a few words. We will prepare a message for you to review and send to Monica.</p></div>
<form class="quick__form" data-quick-enquiry="tax" novalidate data-reveal><fieldset class="fieldset"><legend class="label">I would like help with</legend><div class="chips">${topics.map((t, i) => `<label class="chip"><input type="radio" name="topic" value="${escape(t)}"${i === 0 ? ' checked' : ''}><span>${t}</span></label>`).join('')}</div></fieldset>
<div class="field"><label for="quick-note">A few words about your situation <small>(optional)</small></label><textarea id="quick-note" name="note" rows="3" maxlength="600" aria-describedby="quick-hint"></textarea><p class="field__hint" id="quick-hint">Please keep your tax file number, bank details and other identity information out of this message.</p></div>
<button class="btn btn--tax" type="submit" data-magnetic><span class="btn__fill" aria-hidden="true"></span><span class="btn__label">Prepare my enquiry</span><span class="btn__icon">${icon.arrow}</span></button></form></div></section>`;

const questions = faq([
  ['What should I put in my first message?', 'Tell Monica which area you would like help with and, in a few words, what is on your mind. Please leave out your tax file number, bank details and other identity information.'],
  ['Can you promise a refund or a particular result?', 'No. Every situation is different and outcomes depend on your individual circumstances and records. MKM Tax Return Services does not guarantee a refund, an outcome or a timeframe.'],
  ['What if I owe tax?', 'Support to reduce and manage tax debts is one of the areas MKM Tax Return Services can talk through with you. Start with a short message and take it from there.'],
  ['What is an entitlements review?', 'It is a conversation about claims that may apply to your circumstances, and what is needed to look at them properly. What applies depends on your own situation.'],
  ['Is my information stored when I use this website?', 'No. The enquiry form builds a message in your browser for you to review, copy or send yourself. This website does not collect, store or submit what you type.'],
], { id: 'tax-faq', title: 'Questions, <em>answered plainly.</em>', world: 'tax' });

export function tax() {
  return shell({
    title: 'MKM Tax Return Services — Calm, Clear Tax Support',
    description: 'MKM Tax Return Services offers tax return assistance, entitlements review and support with tax debts in plain language. Discuss your tax support with Monica.',
    path: '/tax/', world: 'tax', tone: 'dark', features: ['enquiry'], crumbs: [['MKM Services', '/'], ['MKM Tax Return Services', '/tax/']],
    content: `${hero}${pathsSection}${expect}${quick}${questions}${serviceClose({ world: 'tax', title: 'Let’s start with <em>where you are.</em>', text: 'Tell Monica which area you would like help with. The scope of help and the next steps are confirmed with you directly.', cta: button('Discuss your tax support', '/contact/?service=tax', { kind: 'paper' }) })}`,
  });
}
