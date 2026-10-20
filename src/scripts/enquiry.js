// Shared enquiry confirmation. Nothing is sent by this website: the visitor reviews the message and
// chooses how to send it (WhatsApp or email once configured, or copy). Copy never claims it was sent.
import { site } from './config/site.js';
import { whatsappUrl, emailUrl } from './order.js';

const sendChannels = (message, subject) => ({
  whatsapp: whatsappUrl(site.whatsappNumber, message),
  email: emailUrl(site.contactEmail, subject, message),
});

export function renderConfirm(root, { title = 'Your message is <em>ready.</em>', chips = [], message, subject = 'Enquiry for MKM Services', room = 'house', showCare = false, onEdit = null }) {
  const channels = sendChannels(message, subject);
  const connected = Boolean(channels.whatsapp || channels.email);
  root.replaceChildren();
  const wrap = document.createElement('div');
  wrap.className = 'confirm';
  wrap.dataset.world = room;
  wrap.innerHTML = `
    <div class="confirm__mark" aria-hidden="true"><svg viewBox="0 0 132 132" focusable="false"><circle class="confirm__circle" cx="66" cy="66" r="62" pathLength="1"/><g transform="translate(22.2 50.2) scale(0.0817)"><use class="confirm__logo" href="#mkm-p1"/><use class="confirm__logo" href="#mkm-p2"/></g></svg></div>
    <h2 class="confirm__title" tabindex="-1">${title}</h2>
    <p class="confirm__lead"></p>
    <ul class="confirm__chips" aria-label="Your selections"></ul>
    <div><label class="label" for="confirm-message-${room}">Your message</label></div>
    <textarea id="confirm-message-${room}" class="confirm__message" readonly spellcheck="false"></textarea>
    <div class="confirm__actions"></div>
    <p class="confirm__status" role="status" aria-live="polite"></p>
    <div class="confirm__next"><h3 class="label confirm__next-title">What happens next</h3><ol></ol></div>
    <p class="confirm__note"></p>`;
  $one(wrap, '.confirm__lead').textContent = connected
    ? 'Nothing has been sent yet. Choose how you would like to send this to Monica.'
    : 'Nothing has been sent yet. Copy your message and send it to Monica in whichever way suits you.';
  const list = $one(wrap, '.confirm__chips');
  chips.filter(Boolean).forEach(text => { const li = document.createElement('li'); li.textContent = text; list.append(li); });
  $one(wrap, '.confirm__message').value = message;

  const actions = $one(wrap, '.confirm__actions');
  const make = (tag, cls, html, attrs = {}) => { const el = document.createElement(tag); el.className = cls; el.innerHTML = html; Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); return el; };
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 12h17m-6-6 6 6-6 6"/></svg>';
  const btn = (label, extra = '') => `<span class="btn__fill" aria-hidden="true"></span><span class="btn__label">${label}</span><span class="btn__icon">${arrow}</span>${extra}`;
  if (channels.whatsapp) actions.append(make('a', 'btn btn--ink', btn('Send on WhatsApp'), { href: channels.whatsapp, target: '_blank', rel: 'noopener noreferrer' }));
  if (channels.email) actions.append(make('a', 'btn btn--outline', btn('Send by email'), { href: channels.email }));
  const copy = make('button', `btn ${connected ? 'btn--outline' : 'btn--ink'}`, btn('Copy message'), { type: 'button' });
  actions.append(copy);
  if (onEdit) { const edit = make('button', 'text-link', '<span>Edit my enquiry</span>', { type: 'button' }); edit.addEventListener('click', onEdit); actions.append(edit); }

  const status = $one(wrap, '.confirm__status');
  copy.addEventListener('click', async () => {
    const field = $one(wrap, '.confirm__message');
    let copied = false;
    try { if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(message); copied = true; } } catch { /* fall back to selection */ }
    if (!copied) {
      field.focus(); field.select(); field.setSelectionRange(0, message.length);
      try { copied = document.execCommand('copy'); } catch { /* leave selected for manual copy */ }
    }
    status.textContent = copied ? 'Copied. Paste it wherever you would like to send it.' : 'Your message is selected. Use your copy shortcut, or press and hold.';
  });

  const next = $one(wrap, '.confirm__next ol');
  [
    ['01', connected ? 'Send it your way.' : 'Send it your way.', connected ? 'Use the buttons above, or copy the message and paste it anywhere.' : 'Paste your copied message into a conversation with Monica.'],
    ['02', 'Monica reads and replies.', 'She will come back to you about the options and the next steps.'],
    ['03', 'You decide.', 'Take your time. There is no pressure to go ahead.'],
  ].forEach(([n, strong, rest]) => { const li = document.createElement('li'); li.innerHTML = `<b>${n}</b><span><strong>${strong}</strong> ${rest}</span>`; next.append(li); });

  const note = $one(wrap, '.confirm__note');
  if (showCare) note.innerHTML = `Care enquiries can also be made through <a class="text-link" href="${site.careSite.url}" target="_blank" rel="noopener noreferrer"><span>${site.careSite.label}</span></a>.`;
  else if (site.previewMode && !connected) note.textContent = 'This is a client preview. Direct sending switches on once the business WhatsApp number or email is confirmed.';
  else note.remove();

  root.append(wrap);
  requestAnimationFrame(() => wrap.classList.add('is-played'));
  return $one(wrap, '.confirm__title');
}

function $one(scope, selector) { return scope.querySelector(selector); }
