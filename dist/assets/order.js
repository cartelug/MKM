import { lengthPrices, textures } from './data/hair.js';

export const money = value => `US$${Number(value).toLocaleString('en-US')}`;

export function normalizeSelection(selection = {}) {
  const inches = Number(selection.inches);
  const quantity = Number(selection.quantity);
  return {
    inches: lengthPrices.some(p => p.inches === inches) ? inches : 20,
    texture: textures.some(t => t.name === selection.texture) ? selection.texture : 'Body Wave',
    quantity: Number.isInteger(quantity) ? Math.min(10, Math.max(1, quantity)) : 1,
  };
}

export function quote(selection) {
  const selected = normalizeSelection(selection);
  const unit = lengthPrices.find(p => p.inches === selected.inches).usd;
  return { ...selected, unit, subtotal: unit * selected.quantity };
}

export function orderMessage(selection) {
  const value = quote(selection);
  return `Hello MKM Beauty, I'd like to enquire about human hair.\nLength: ${value.inches} inches\nTexture: ${value.texture}\nQuantity: ${value.quantity}\nListed length-price reference: ${money(value.unit)}\nIndicative subtotal: ${money(value.subtotal)} (USD)\nPlease confirm the exact product, final total, availability, delivery options and payment instructions.`;
}

export function whatsappUrl(number, message) {
  // No made-up phone number or silent correction of an invalid configuration.
  if (typeof number !== 'string' || !/^[1-9]\d{6,14}$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
