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
