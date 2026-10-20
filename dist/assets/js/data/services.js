// Service scope supplied by Monica. No registration, availability or outcome claims.
export const services = Object.freeze([
  { id:'care', name:'MKM Care Services', short:'Care', number:'01', theme:'care', path:'/care/', image:'care.webp', alt:'A woman using a wheelchair beside a misty lake in a wooded park', line:'Support for your everyday.', description:'Compassionate disability and community-based support, with people at the centre.', topics:['Disability support','Community-based support','A general care enquiry'], cta:'Talk through your support needs', hint:'Disability & community support' },
  { id:'beauty', name:'MKM Beauty', short:'Beauty', number:'02', theme:'beauty', path:'/beauty/', image:'skincare.webp', alt:'An amber skincare bottle displayed in natural sunlight', line:'A little more you.', description:'Human hair, wigs, extensions, skincare and home décor. Beautiful details, chosen your way.', topics:['Wigs, human hair & extensions','Skincare','Home décor'], cta:'Start a beauty enquiry', hint:'Hair, skincare & home décor' },
  { id:'tax', name:'MKM Tax Return Services', short:'Tax', number:'03', theme:'tax', path:'/tax/', image:'tax.webp', alt:'Hands arranging financial paperwork beside a calculator', line:'A clearer next step.', description:'Tax return assistance, help with eligible claims, and support to reduce and manage tax debts.', topics:['Tax return assistance','Help with eligible claims','Tax debt support'], cta:'Discuss your tax support', hint:'Tax returns, claims & tax debts' },
].map(Object.freeze));

// The contact page also accepts a general enquiry that is not tied to one service.
export const generalReason = Object.freeze({ id:'general', name:'MKM Services', short:'General', number:'04', theme:'house', path:'/contact/', topics:['A general enquiry'], cta:'Speak with Monica', hint:'Something else, or not sure yet' });
export const contactReasons = Object.freeze([...services, generalReason]);

export const serviceById = id => services.find(s=>s.id===id) ?? services[0];
export const reasonById = id => contactReasons.find(s=>s.id===id) ?? generalReason;

// Optional, service-specific details gathered by the contact form.
export const extraFields = Object.freeze({
  care: { id:'support-for', label:'This support is for', options:['Myself','Someone I care for','Not sure yet'], line:'Support is for' },
  beauty: { id:'beauty-interest', label:'I would like to', options:['Browse what is available','Ask about a specific item','Get styling or care advice'], line:'I would like to' },
  tax: { id:'tax-year', label:'Tax year (if you know it)', text:true, placeholder:'For example, 2024–25', line:'Tax year' },
});

const clean = (value, limit) => String(value ?? '').trim().replace(/\s+/g,' ').slice(0, limit);

export function serviceMessage(id, topic='', note='', extras={}) {
  const detail=String(note).trim().slice(0,600);
  const name=clean(extras.name, 60);
  const field=extraFields[id];
  const extra=field ? clean(extras.extra, 80) : '';
  if (id==='general') {
    return 'Hello Monica, I\'d like to make a general enquiry.'+
      (name?`\nMy name is ${name}.`:'')+
      (detail?`\nA little more detail: ${detail}`:'')+
      '\nPlease let me know how you can help and what the next steps are. Thank you.';
  }
  const service=serviceById(id);
  const chosen=service.topics.includes(topic)?topic:service.topics[0];
  return `Hello Monica, I'd like to enquire about ${service.name}.`+
    (name?`\nMy name is ${name}.`:'')+
    `\nI'm interested in: ${chosen}.`+
    (extra?`\n${field.line}: ${extra}`:'')+
    (detail?`\nA little more detail: ${detail}`:'')+
    '\nPlease let me know the available options and next steps. Thank you.';
}
