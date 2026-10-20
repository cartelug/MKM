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
