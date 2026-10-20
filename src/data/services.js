// Service scope supplied by Monica. No registration, availability or outcome claims.
export const services = Object.freeze([
  { id:'care', name:'MKM Care Services', short:'Care', number:'01', theme:'care', path:'/care/', image:'care.webp', alt:'A woman using a wheelchair beside a lake in a wooded park', line:'Support for your everyday.', description:'Compassionate disability and community-based support, with people at the centre.', topics:['Disability support','Community-based support','A general care enquiry'] },
  { id:'beauty', name:'MKM Beauty', short:'Beauty', number:'02', theme:'beauty', path:'/beauty/', image:'skincare.webp', alt:'An amber skincare bottle displayed in natural sunlight', line:'A little more you.', description:'Human hair, wigs, extensions, skincare and home décor. Beautiful details, chosen your way.', topics:['Wigs, human hair & extensions','Skincare','Home décor'] },
  { id:'tax', name:'MKM Tax Return Services', short:'Tax', number:'03', theme:'tax', path:'/tax/', image:'tax.webp', alt:'Hands arranging financial paperwork beside a calculator', line:'A clearer next step.', description:'Tax return assistance, help with eligible claims, and support to reduce and manage tax debts.', topics:['Tax return assistance','Help with eligible claims','Tax debt support'] },
].map(Object.freeze));

export const serviceById = id => services.find(s=>s.id===id) ?? services[0];

export function serviceMessage(id, topic='', note='') {
  const service=serviceById(id);
  const chosen=service.topics.includes(topic)?topic:service.topics[0];
  const detail=String(note).trim().slice(0,600);
  return `Hello Monica, I'd like to enquire about ${service.name}.\nI'm interested in: ${chosen}.`+
    (detail?`\nA little more detail: ${detail}`:'')+
    '\nPlease let me know the available options and next steps. Thank you.';
}
