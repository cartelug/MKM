import { lengthPrices, textures } from './data/hair.js';

export const money = value => `US$${Number(value).toLocaleString('en-US')}`;

// Colour is a preference only. MKM confirms which colours exist before anything is agreed.
export const colourOptions = Object.freeze(['No preference','Natural black','Dark brown','Another colour']);
const cleanText = (value, limit) => String(value ?? '').trim().replace(/\s+/g,' ').slice(0, limit);

export function normalizeSelection(selection = {}) {
  const inches = Number(selection.inches);
  const quantity = Number(selection.quantity);
  const result = {
    inches: lengthPrices.some(p => p.inches === inches) ? inches : 20,
    texture: textures.some(t => t.name === selection.texture) ? selection.texture : 'Body Wave',
    quantity: Number.isInteger(quantity) ? Math.min(10, Math.max(1, quantity)) : 1,
  };
  // Optional keys appear only when supplied, so existing callers keep the original shape.
  if (selection.colour !== undefined && selection.colour !== null && selection.colour !== '') {
    result.colour = colourOptions.includes(selection.colour) ? selection.colour : colourOptions[0];
  }
  const other = cleanText(selection.colourOther, 40);
  if (result.colour === 'Another colour' && other) result.colourOther = other;
  return result;
}

export function quote(selection) {
  const selected = normalizeSelection(selection);
  const unit = lengthPrices.find(p => p.inches === selected.inches).usd;
  return { ...selected, unit, subtotal: unit * selected.quantity };
}

export function colourLabel(value) {
  if (!value.colour || value.colour === 'No preference') return '';
  return value.colour === 'Another colour' && value.colourOther ? value.colourOther : value.colour;
}

export function orderMessage(selection, extras = {}) {
  const value = quote(selection);
  const colour = colourLabel(value);
  const name = cleanText(extras.name, 60);
  const note = cleanText(extras.note, 400);
  return `Hello MKM Beauty, I'd like to enquire about human hair.`+
    (name?`\nMy name is ${name}.`:'')+
    `\nLength: ${value.inches} inches\nTexture: ${value.texture}`+
    (colour?`\nColour preference: ${colour}`:'')+
    `\nQuantity: ${value.quantity}\nListed length-price reference: ${money(value.unit)}\nIndicative subtotal: ${money(value.subtotal)} (USD)`+
    (note?`\nA little more detail: ${note}`:'')+
    `\nPlease confirm the exact product, final total, availability, delivery options and payment instructions.`;
}

export function whatsappUrl(number, message) {
  // No made-up phone number or silent correction of an invalid configuration.
  if (typeof number !== 'string' || !/^[1-9]\d{6,14}$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function emailUrl(address, subject, message) {
  if (typeof address !== 'string' || !/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/.test(address)) return null;
  return `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}
