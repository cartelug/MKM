// MKM Services V2 entry point. Core behaviour runs everywhere; page features load only when present.
import { $, $$, wireDialogs } from './core.js';
import { arrival } from './preloader.js';
import { initHeader } from './header.js';
import { initMotion } from './motion.js';
import { initAccordions } from './accordion.js';
import { initTransitions } from './transitions.js';

const arrived = arrival();
initHeader();
initMotion(arrived);
initAccordions();
initTransitions();
wireDialogs();

const features = [
  ['[data-lightbox]', './lightbox.js', 'initLightbox'],
  ['#contact-form', './contact.js', 'initContact'],
  ['[data-quick-enquiry]', './quick.js', 'initQuick'],
  ['#hair-form', './hair.js', 'initHairBuilder'],
  ['#shop-texture', './hair.js', 'initShopFilter'],
  ['[data-scroller]', './scroller.js', 'initScrollers'],
  ['[data-hscroll]', './hscroll.js', 'initHscroll'],
  ['[data-counter]', './counters.js', 'initCounters'],
];
for (const [selector, module, init] of features) {
  if ($(selector)) import(module).then(m => { m[init](); $$(selector).forEach(el => { el.dataset.ready = 'true'; }); }).catch(error => console.error(`MKM: ${init} failed`, error));
}
