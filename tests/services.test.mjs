import test from 'node:test';
import assert from 'node:assert/strict';
import { services,serviceById,serviceMessage } from '../src/data/services.js';

test('every service and topic makes the correct, separate enquiry',()=>{
 for(const service of services)for(const topic of service.topics){
  const text=serviceMessage(service.id,topic);
  assert.ok(text.includes(service.name));assert.ok(text.includes(topic));
  assert.ok(!text.includes('Listed length-price reference'));
 }
});
test('invalid service and topic safely default without fabricating a service',()=>{
 assert.equal(serviceById('unknown').id,'care');
 assert.ok(serviceMessage('tax','bad topic').includes('Tax return assistance'));
});
test('a personal enquiry note stays bounded and does not become markup',()=>{
 const text=serviceMessage('beauty','Skincare','A'.repeat(700));
 assert.ok(text.includes('A'.repeat(600)));assert.ok(!text.includes('A'.repeat(601)));
 assert.ok(text.startsWith('Hello Monica'));
});

// --- V2: general enquiry, name and service-specific details ---
import { contactReasons,reasonById,generalReason,extraFields } from '../src/data/services.js';

test('contact reasons are the three services plus a general enquiry, each with smart call-to-action copy',()=>{
 assert.deepEqual(contactReasons.map(r=>r.id),['care','beauty','tax','general']);
 assert.equal(reasonById('nope').id,'general');
 const copy=Object.fromEntries(services.map(s=>[s.id,s.cta]));
 assert.deepEqual(copy,{care:'Talk through your support needs',beauty:'Start a beauty enquiry',tax:'Discuss your tax support'});
 assert.equal(generalReason.cta,'Speak with Monica');
});
test('general enquiries never claim a service and stay polite and bounded',()=>{
 const text=serviceMessage('general','anything','x'.repeat(900),{name:'Sam'});
 assert.ok(text.startsWith("Hello Monica, I'd like to make a general enquiry."));
 assert.ok(text.includes('My name is Sam.'));assert.ok(!text.includes('MKM Care')&&!text.includes('MKM Beauty')&&!text.includes('MKM Tax'));
 assert.ok(text.includes('x'.repeat(600))&&!text.includes('x'.repeat(601)));
});
test('name and service-specific details are cleaned, optional and only used for the matching service',()=>{
 const care=serviceMessage('care','Disability support','',{name:'  Jo   Lee ',extra:'Someone I care for'});
 assert.ok(care.includes('My name is Jo Lee.'));assert.ok(care.includes('Support is for: Someone I care for'));
 const tax=serviceMessage('tax','Tax debt support','',{extra:'2024–25'});
 assert.ok(tax.includes('Tax year: 2024–25'));assert.ok(!tax.includes('My name is'));
 assert.ok(!serviceMessage('beauty','Skincare','',{extra:''}).includes('I would like to:'));
 assert.ok(!serviceMessage('general','x','',{extra:'ignored'}).includes('ignored'));
 assert.ok(Object.keys(extraFields).every(id=>services.some(s=>s.id===id)));
});
