// Hair enquiry builder (texture, length, colour preference, quantity) and the shop texture filter.
import { textures } from './data/hair.js';
import { money, normalizeSelection, quote, orderMessage, colourLabel } from './order.js';
import { $, $$, openDialog } from './core.js';
import { renderConfirm } from './enquiry.js';

export function initHairBuilder() {
  const form = $('#hair-form');
  if (!form) return;
  const image = $('#builder-image');
  const stage = $('.builder__stage');
  const zoom = $('[data-builder-zoom]');
  const other = $('[data-colour-other]');
  const params = new URLSearchParams(location.search);
  let selection = normalizeSelection({
    inches: params.get('length') ?? params.get('inches'),
    texture: params.get('texture'),
    quantity: params.has('quantity') ? params.get('quantity') : 1,
    colour: params.get('colour') ?? 'No preference',
  });
  const read = () => normalizeSelection({
    inches: new FormData(form).get('inches'),
    texture: new FormData(form).get('texture'),
    quantity: form.elements.quantity.value,
    colour: new FormData(form).get('colour') ?? 'No preference',
    colourOther: form.elements.colourOther.value,
  });
  const check = (name, value) => { const input = $$(`input[name="${name}"]`, form).find(i => i.value === String(value)); if (input) input.checked = true; };
  check('texture', selection.texture); check('inches', selection.inches); check('colour', selection.colour ?? 'No preference');
  form.elements.quantity.value = selection.quantity;

  let shown = '';
  function showImage(texture) {
    if (shown === texture.name) return;
    const first = !shown;
    shown = texture.name;
    const rendered = first && image.dataset.texture === texture.name; // server-rendered image already matches
    const set = () => {
      if (rendered) return;
      const base = texture.image.replace('.webp', '');
      image.src = `/assets/hair/${base}-640.webp`;
      image.srcset = `/assets/hair/${base}-480.webp 480w, /assets/hair/${base}-640.webp 640w, /assets/hair/${texture.image} 810w`;
      image.alt = texture.alt;
      stage.classList.remove('is-swapping');
    };
    if (first) set();
    else { stage.classList.add('is-swapping'); setTimeout(set, 220); }
    zoom.dataset.full = `/assets/hair/${texture.image}`;
    zoom.dataset.alt = texture.alt;
    zoom.dataset.caption = `${texture.name} · Style inspiration · exact product to confirm`;
    $('[data-builder-label]').textContent = `${texture.name} · style inspiration`;
  }

  function update() {
    selection = read();
    form.elements.quantity.value = selection.quantity;
    other.hidden = selection.colour !== 'Another colour';
    const priced = quote(selection);
    const colour = colourLabel(priced) || 'No preference';
    $('#unit-price').textContent = money(priced.unit);
    $('#subtotal-price').textContent = money(priced.subtotal);
    $('[data-sum-texture]').textContent = priced.texture;
    $('[data-sum-length]').textContent = `${priced.inches} inches`;
    $('[data-sum-colour]').textContent = colour;
    $('[data-sum-qty]').textContent = String(priced.quantity);
    $('#quantity-minus').disabled = priced.quantity <= 1;
    $('#quantity-plus').disabled = priced.quantity >= 10;
    showImage(textures.find(t => t.name === priced.texture));
    const query = new URLSearchParams({ texture: priced.texture, length: priced.inches, quantity: priced.quantity });
    if (priced.colour && priced.colour !== 'No preference') query.set('colour', priced.colour);
    history.replaceState(null, '', `${location.pathname}?${query}`);
  }

  form.addEventListener('change', update);
  form.elements.quantity.addEventListener('input', () => { if (form.elements.quantity.value !== '') update(); });
  form.elements.colourOther.addEventListener('input', update);
  $('#quantity-minus').addEventListener('click', () => { form.elements.quantity.value = selection.quantity - 1; update(); });
  $('#quantity-plus').addEventListener('click', () => { form.elements.quantity.value = selection.quantity + 1; update(); });
  $$('[data-pick-texture]').forEach(button => button.addEventListener('click', () => { check('texture', button.dataset.pickTexture); update(); }));

  form.addEventListener('submit', event => {
    event.preventDefault();
    update();
    const priced = quote(selection);
    const colour = colourLabel(priced);
    const message = orderMessage(selection, { name: form.elements.name.value, note: form.elements.note.value });
    const dialog = $('#enquiry-dialog');
    const title = renderConfirm($('[data-confirm-root]', dialog), {
      title: 'Your hair brief is <em>ready.</em>',
      chips: [priced.texture, `${priced.inches} inches`, colour ? `Colour: ${colour}` : '', `Qty ${priced.quantity}`, `${money(priced.subtotal)} reference`],
      message, subject: 'Hair enquiry for MKM Beauty', room: 'beauty',
    });
    openDialog(dialog);
    title.focus({ preventScroll: true });
  });
  update();
}

export function initShopFilter() {
  const filter = $('#shop-texture');
  if (!filter) return;
  const count = $('#shop-result-count');
  const apply = () => {
    let visible = 0;
    $$('[data-shop-texture]').forEach(card => {
      const show = filter.value === 'all' || card.dataset.shopTexture === filter.value;
      card.hidden = !show;
      if (show) visible++;
    });
    count.textContent = `${visible} texture enquiry option${visible === 1 ? '' : 's'}`;
  };
  const initial = new URLSearchParams(location.search).get('texture');
  if (textures.some(t => t.name === initial)) filter.value = initial;
  filter.addEventListener('change', apply);
  apply();
}
