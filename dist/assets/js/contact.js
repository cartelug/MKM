// Contact concierge: pick a reason, the form adapts, then a calm confirmation sequence.
import { contactReasons, reasonById, extraFields, serviceMessage } from './data/services.js';
import { $, $$ } from './core.js';
import { renderConfirm } from './enquiry.js';

const privacy = {
  care: 'Please keep medical details, NDIS or identity numbers and other sensitive information out of this first message.',
  beauty: 'Tell Monica what you are looking for. Final products, prices and availability are confirmed with you directly.',
  tax: 'Please keep your tax file number, bank details and other identity information out of this first message.',
  general: 'Share as much or as little as you like. Please keep sensitive personal information out of this first message.',
};
const sideTitle = { care: 'Let’s talk about <em>support.</em>', beauty: 'Let’s talk <em>beauty.</em>', tax: 'Let’s talk <em>tax.</em>', general: 'Let’s <em>talk.</em>' };

export function initContact() {
  const form = $('#contact-form');
  const result = $('#contact-result');
  const side = $('[data-contact-side]');
  const panel = $('[data-contact-panel]');
  if (!form || !result) return;
  const topic = $('#c-topic');
  const extraHost = $('[data-extra-host]');
  const hint = $('[data-privacy-hint]');
  const note = $('#c-note');
  const count = $('#c-note-count');
  const name = $('#c-name');
  const status = $('[data-form-status]');
  const submit = $('[type="submit"]', form);
  const params = new URLSearchParams(location.search);
  let current = 'care';

  function setReason(id, focus = false) {
    const reason = reasonById(id);
    current = reason.id;
    $$('input[name="service"]', form).forEach(input => { input.checked = input.value === reason.id; });
    topic.replaceChildren(...reason.topics.map(text => { const o = document.createElement('option'); o.value = o.textContent = text; return o; }));
    $('#c-topic-field').hidden = reason.id === 'general';
    // Service-specific extra detail
    extraHost.replaceChildren();
    const field = extraFields[reason.id];
    if (field) {
      const wrapper = document.createElement('div');
      wrapper.className = 'field';
      const label = document.createElement('label');
      label.htmlFor = 'c-extra';
      label.textContent = field.label;
      let control;
      if (field.options) {
        control = document.createElement('select');
        field.options.forEach(text => { const o = document.createElement('option'); o.value = o.textContent = text; control.append(o); });
      } else {
        control = document.createElement('input');
        control.type = 'text'; control.maxLength = 40; control.placeholder = field.placeholder || '';
        control.autocomplete = 'off';
      }
      control.id = 'c-extra'; control.name = 'extra';
      wrapper.append(label, control);
      extraHost.append(wrapper);
    }
    hint.textContent = privacy[reason.id];
    submit.querySelector('.btn__label').textContent = 'Prepare my enquiry';
    for (const el of [panel, side].filter(Boolean)) el.dataset.world = reason.id === 'general' ? 'house' : reason.id;
    if (side) $('[data-side-title]', side).innerHTML = sideTitle[reason.id];
    $$('[data-side-detail]', side).forEach(el => { el.hidden = el.dataset.sideDetail !== reason.id; });
    if (focus) name.focus({ preventScroll: true });
  }

  const fromQuery = params.get('service');
  setReason(contactReasons.some(r => r.id === fromQuery) ? fromQuery : 'care');
  const wantedTopic = params.get('topic');
  if (wantedTopic && reasonById(current).topics.includes(wantedTopic)) topic.value = wantedTopic;

  $$('input[name="service"]', form).forEach(input => input.addEventListener('change', () => setReason(input.value)));
  note.addEventListener('input', () => { count.textContent = `${note.value.length} / ${note.maxLength}`; });

  const fieldFor = el => el.closest('.field');
  const clearError = () => { const f = fieldFor(name); f.classList.remove('has-error'); name.removeAttribute('aria-invalid'); status.textContent = ''; };
  name.addEventListener('input', clearError);

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!name.value.trim()) {
      const f = fieldFor(name);
      f.classList.add('has-error');
      name.setAttribute('aria-invalid', 'true');
      status.textContent = 'Please add your first name so Monica knows who she is speaking with.';
      name.focus();
      return;
    }
    clearError();
    const reason = reasonById(current);
    const extra = $('#c-extra')?.value ?? '';
    const message = serviceMessage(reason.id, topic.value, note.value, { name: name.value, extra });
    const chips = [reason.id === 'general' ? 'General enquiry' : reason.name, reason.id === 'general' ? '' : topic.value, extra && extraFields[reason.id] ? `${extraFields[reason.id].line}: ${extra}` : ''];
    form.hidden = true;
    result.hidden = false;
    const title = renderConfirm(result, {
      title: `Thank you, ${escapeHtml(name.value.trim().split(' ')[0])}. Your message is <em>ready.</em>`,
      chips, message, subject: `${reason.id === 'general' ? 'General enquiry' : reason.name} enquiry`,
      room: reason.id === 'general' ? 'house' : reason.id, showCare: reason.id === 'care',
      onEdit: () => { result.hidden = true; form.hidden = false; name.focus(); },
    });
    result.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    title.focus({ preventScroll: true });
  });
}

const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
