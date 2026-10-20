// Quick enquiry panels (for example on the Tax page): pick what you need, review a ready message in a sheet.
import { services, serviceMessage } from './data/services.js';
import { $, $$, openDialog } from './core.js';
import { renderConfirm } from './enquiry.js';

export function initQuick() {
  const dialog = $('#enquiry-dialog');
  const root = dialog && $('[data-confirm-root]', dialog);
  $$('[data-quick-enquiry]').forEach(form => {
    const service = services.find(s => s.id === form.dataset.quickEnquiry) ?? services[0];
    form.addEventListener('submit', event => {
      event.preventDefault();
      const chosen = new FormData(form).get('topic') || service.topics[0];
      const note = form.elements.note?.value ?? '';
      const message = serviceMessage(service.id, chosen, note);
      const title = renderConfirm(root, { chips: [service.name, chosen], message, subject: `${service.name} enquiry`, room: service.id, showCare: service.id === 'care' });
      openDialog(dialog);
      title.focus({ preventScroll: true });
    });
  });
}
