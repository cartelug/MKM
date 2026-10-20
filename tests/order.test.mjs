import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { lengthPrices, textures } from '../src/data/hair.js';
import { normalizeSelection, quote, orderMessage, whatsappUrl } from '../src/order.js';

test('all nine length references match the supplied client data',()=>{
 const original=JSON.parse(readFileSync(new URL('../src/data/client-source.json',import.meta.url),'utf8'));
 assert.deepEqual(lengthPrices.map(p=>({inches:p.inches,listed_usd:p.usd})),original.length_prices);
 assert.deepEqual(textures.map(t=>t.name),original.available_texture_labels);
});
test('every length, texture and quantity uses exact USD reference arithmetic',()=>{
 let combinations=0;
 for(const price of lengthPrices)for(const texture of textures)for(let quantity=1;quantity<=10;quantity++){
  const result=quote({inches:price.inches,texture:texture.name,quantity});
  assert.equal(result.unit,price.usd);
  assert.equal(result.subtotal,price.usd*quantity);
  assert.equal(result.texture,texture.name);combinations++;
 }
 assert.equal(combinations,540);
});
test('quantity is bounded and malformed selections fall back safely',()=>{
 assert.equal(quote({quantity:999}).quantity,10);
 assert.equal(quote({quantity:-3}).quantity,1);
 assert.equal(quote({quantity:1.5}).quantity,1);
 assert.deepEqual(normalizeSelection({inches:17,texture:'unknown',quantity:'bad'}),{inches:20,texture:'Body Wave',quantity:1});
});
test('enquiry message accurately describes selection and qualifies final price',()=>{
 const message=orderMessage({inches:32,texture:'Kinky Curly',quantity:2});
 assert.match(message,/Length: 32 inches/);assert.match(message,/Texture: Kinky Curly/);
 assert.match(message,/Quantity: 2/);assert.match(message,/US\$670/);assert.match(message,/US\$1,340 \(USD\)/);
 assert.match(message,/final total, availability, delivery options and payment instructions/);
});
test('missing or invalid WhatsApp number never creates a bogus URL',()=>{
 for(const value of ['',null,undefined,'+256 700000000','0123456789','https://example.com','123','1234567890123456'])assert.equal(whatsappUrl(value,'hello'),null);
});
test('valid international WhatsApp links encode the entire message exactly',()=>{
 // Reserved test fixture, never included in the website configuration.
 const message=orderMessage({inches:20,texture:'Body Wave',quantity:3});
 const url=new URL(whatsappUrl('15555550123',message));
 assert.equal(url.origin,'https://wa.me');assert.equal(url.searchParams.get('text'),message);
 assert.equal(url.pathname,'/15555550123');
});

// --- V2: colour preference, optional contact details, email links ---
import { colourOptions, colourLabel, emailUrl } from '../src/order.js';

test('colour is a preference only and never changes the original selection shape unless supplied',()=>{
 assert.deepEqual(Object.keys(normalizeSelection({inches:20,texture:'Wavy',quantity:2})).sort(),['inches','quantity','texture']);
 assert.equal(normalizeSelection({colour:'Dark brown'}).colour,'Dark brown');
 assert.equal(normalizeSelection({colour:'Fuchsia'}).colour,colourOptions[0]);
 const other=normalizeSelection({colour:'Another colour',colourOther:'  Honey   blonde  '});
 assert.equal(other.colourOther,'Honey blonde');assert.equal(colourLabel(other),'Honey blonde');
 assert.equal(colourLabel(normalizeSelection({colour:'No preference'})),'');
 assert.equal(normalizeSelection({colour:'Natural black',colourOther:'ignored'}).colourOther,undefined);
});
test('enquiry message includes colour, name and notes only when given, and never invents availability',()=>{
 const bare=orderMessage({inches:24,texture:'Straight',quantity:1});
 assert.ok(!/Colour preference/.test(bare));assert.ok(!/My name is/.test(bare));
 const full=orderMessage({inches:24,texture:'Straight',quantity:2,colour:'Another colour',colourOther:'Burgundy'},{name:'Amara',note:'  For   a   wedding '});
 assert.match(full,/My name is Amara/);assert.match(full,/Colour preference: Burgundy/);assert.match(full,/A little more detail: For a wedding/);
 assert.match(full,/US\$840 \(USD\)/);assert.match(full,/confirm the exact product, final total, availability/);
 assert.ok(full.split('\n').length<=11);
});
test('email links are only built for a plausible address and encode the whole message',()=>{
 for(const value of ['',null,undefined,'no-at-sign','a@b','two words@example.com','<x@example.com>'])assert.equal(emailUrl(value,'s','m'),null);
 const url=emailUrl('hello@example.com','Hair enquiry','Line one\nLine two & more');
 assert.ok(url.startsWith('mailto:hello@example.com?'));
 const params=new URLSearchParams(url.split('?')[1]);
 assert.equal(params.get('subject'),'Hair enquiry');assert.equal(params.get('body'),'Line one\nLine two & more');
});
