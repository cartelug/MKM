import { site } from './config/site.js';
import { textures, media } from './data/hair.js';
import { money, normalizeSelection, quote, orderMessage, whatsappUrl } from './order.js';
import { services, serviceById, serviceMessage } from './data/services.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const menu = $('.menu-toggle');
const nav = $('#main-nav');
function closeMenu(returnFocus=false) {
  menu.setAttribute('aria-expanded','false');
  menu.setAttribute('aria-label','Open navigation');
  nav.classList.remove('is-open');
  if (returnFocus) menu.focus();
}
menu.addEventListener('click',()=>{
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded',String(open));
  menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  nav.classList.toggle('is-open',open);
  if(open) nav.querySelector('a').focus();
});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true')closeMenu(true);});
document.addEventListener('click',e=>{if(!e.target.closest('.header')&&menu.getAttribute('aria-expanded')==='true')closeMenu();});
matchMedia('(min-width:901px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

let returnFocus = null;
function openDialog(dialog) {
  returnFocus = document.activeElement;
  dialog.showModal();
  document.body.classList.add('dialog-open');
}
$$('dialog').forEach(dialog=>{
  dialog.querySelectorAll('[data-close-dialog]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const box=dialog.getBoundingClientRect();
    if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();
  });
  dialog.addEventListener('close',()=>{
    document.body.classList.remove('dialog-open');
    if(returnFocus?.isConnected) returnFocus.focus();
  });
  // Native <dialog> traps focus; explicitly preserve Escape behavior.
  dialog.addEventListener('cancel',()=>{});
});

const form=$('#hair-form');
let selection=normalizeSelection();
if(form){
  const params=new URLSearchParams(location.search);
  selection=normalizeSelection({inches:params.get('length')??params.get('inches'),texture:params.get('texture'),quantity:params.has('quantity')?params.get('quantity'):1});
  form.elements.inches.value=selection.inches;
  form.elements.texture.value=selection.texture;
  form.elements.quantity.value=selection.quantity;
  function setPhoto(filename,alt){
    const image=$('#selected-hair-image');
    image.src=media.hairRoot+filename;
    image.alt=alt;
    $$('[data-thumbnail]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.thumbnail===filename)));
  }
  function update(){
    const previous=selection.texture;
    selection=normalizeSelection({inches:form.elements.inches.value,texture:form.elements.texture.value,quantity:form.elements.quantity.value});
    form.elements.quantity.value=selection.quantity;
    const priced=quote(selection);
    $('#unit-price').textContent=money(priced.unit);
    $('#subtotal-price').textContent=money(priced.subtotal);
    $('#selection-summary').textContent=`${selection.inches} inches / ${selection.texture} / Qty ${selection.quantity}`;
    $('#quantity-minus').disabled=selection.quantity<=1;
    $('#quantity-plus').disabled=selection.quantity>=10;
    if(previous!==selection.texture){const texture=textures.find(t=>t.name===selection.texture);setPhoto(texture.image,texture.alt);}
  }
  // Apply query-selected imagery before the first interaction.
  const initialTexture=textures.find(t=>t.name===selection.texture);
  setPhoto(initialTexture.image,initialTexture.alt);
  form.addEventListener('change',update);
  form.elements.quantity.addEventListener('input',()=>{if(form.elements.quantity.value!=='')update();});
  $('#quantity-minus').addEventListener('click',()=>{form.elements.quantity.value=selection.quantity-1;update();});
  $('#quantity-plus').addEventListener('click',()=>{form.elements.quantity.value=selection.quantity+1;update();});
  form.addEventListener('submit',event=>{event.preventDefault();update();previewOrder(selection);});
  $$('[data-thumbnail]').forEach(b=>b.addEventListener('click',()=>setPhoto(b.dataset.thumbnail,b.dataset.alt)));
  update();
}

function previewOrder(value){
  const message=orderMessage(value);
  $('#order-dialog-title').textContent='Your hair enquiry.';
  $('#order-dialog-intro').textContent="The details you'd like MKM Beauty to confirm.";
  const url=whatsappUrl(site.whatsappNumber,message);
  if(url){
    // Direct visitor action; no message is sent by the website.
    window.location.assign(url);
    return;
  }
  const selected=quote(value);
  $('#order-message').value=message;
  const summary=$('#dialog-selection');
  summary.replaceChildren(...[`${selected.inches} inches`,selected.texture,`Qty ${selected.quantity}`,`${money(selected.subtotal)} reference`].map(text=>{const span=document.createElement('span');span.textContent=text;return span;}));
  $('#copy-feedback').textContent='';
  $('#copy-message').disabled=false;
  openDialog($('#order-dialog'));
}
function previewService(id,topic='',note=''){
  const service=serviceById(id);
  const message=serviceMessage(id,topic,note);
  const url=whatsappUrl(site.whatsappNumber,message);
  if(url){window.location.assign(url);return;}
  $('#order-dialog-title').textContent=`Let's talk ${service.short.toLowerCase()}.`;
  $('#order-dialog-intro').textContent='Your message to Monica, ready to review.';
  $('#order-message').value=message;
  const summary=$('#dialog-selection');summary.replaceChildren();
  for(const text of [service.name,service.topics.includes(topic)?topic:service.topics[0]]){
    const span=document.createElement('span');span.textContent=text;summary.append(span);
  }
  $('#copy-feedback').textContent='';
  openDialog($('#order-dialog'));
}
$$('[data-service-enquiry]').forEach(button=>button.addEventListener('click',()=>previewService(button.dataset.serviceEnquiry,button.dataset.topic)));
const serviceForm=$('#service-form');
if(serviceForm){
  const serviceSelect=$('#enquiry-service'),topicSelect=$('#enquiry-topic');
  function selectService(id,moveFocus=false){
    const service=serviceById(id);serviceSelect.value=service.id;
    topicSelect.replaceChildren(...service.topics.map(topic=>{const option=document.createElement('option');option.value=topic;option.textContent=topic;return option;}));
    $$('[data-select-service]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.selectService===service.id)));
    $('.service-enquiry-panel').dataset.theme=service.id;
    if(moveFocus)serviceSelect.focus({preventScroll:true});
  }
  serviceSelect.addEventListener('change',()=>selectService(serviceSelect.value));
  $$('[data-select-service]').forEach(b=>b.addEventListener('click',()=>selectService(b.dataset.selectService,true)));
  selectService(new URLSearchParams(location.search).get('service'));
  serviceForm.addEventListener('submit',e=>{e.preventDefault();previewService(serviceSelect.value,topicSelect.value,$('#enquiry-note').value);});
}
$$('[data-general-enquiry]').forEach(b=>b.addEventListener('click',()=>previewOrder(selection)));
$('#copy-message').addEventListener('click',async()=>{
  const message=$('#order-message');
  const feedback=$('#copy-feedback');
  let copied=false;
  try{
    if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(message.value);copied=true;}
  }catch{/* A denied clipboard permission uses the local selection fallback. */}
  if(!copied){
    message.focus();message.select();message.setSelectionRange(0,message.value.length);
    try{copied=document.execCommand('copy');}catch{/* Keep the message selected for manual copying. */}
  }
  feedback.textContent=copied?'Enquiry copied. Paste it wherever you would like.':'Message selected. Press and hold, or use your copy shortcut.';
});

function zoom(filename,alt,caption='Style inspiration · exact product to confirm'){
  const image=$('#lightbox-image');image.src=media.hairRoot+filename;image.alt=alt;
  $('#image-dialog-title').textContent=caption;
  openDialog($('#image-dialog'));
}
$$('[data-zoom]').forEach(b=>b.addEventListener('click',()=>zoom(b.dataset.zoom,b.dataset.alt,`${b.dataset.caption} · Style inspiration`)));
const zoomCurrent=$('[data-zoom-current]');
if(zoomCurrent)zoomCurrent.addEventListener('click',()=>{const img=$('#selected-hair-image');zoom(img.src.split('/').pop(),img.alt);});

const filter=$('#shop-texture');
if(filter){
  const applyFilter=()=>{
    let count=0;
    $$('[data-shop-texture]').forEach(card=>{const visible=filter.value==='all'||card.dataset.shopTexture===filter.value;card.hidden=!visible;if(visible)count++;});
    $('#shop-result-count').textContent=`${count} texture enquiry option${count===1?'':'s'}`;
  };
  filter.addEventListener('change',applyFilter);
  const initial=new URLSearchParams(location.search).get('texture');
  if(textures.some(t=>t.name===initial))filter.value=initial;
  applyFilter();
}
