// FAQ accordions: button-driven, smooth height (CSS grid rows), arrow/Home/End keys between questions.
import { $$ } from './core.js';

export function initAccordions() {
  $$('[data-accordion]').forEach(group => {
    const buttons = $$('.faq__q button', group);
    buttons.forEach((button, index) => {
      const item = button.closest('.faq__item');
      button.addEventListener('click', () => {
        const open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        item.classList.toggle('is-open', open);
      });
      button.addEventListener('keydown', e => {
        const move = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: buttons.length - 1 }[e.key];
        if (move === undefined) return;
        e.preventDefault();
        buttons[(move + buttons.length) % buttons.length].focus();
      });
    });
  });
}
