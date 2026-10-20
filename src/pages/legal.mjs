import { shell } from '../lib/layout.mjs';
import { site } from '../config/runtime.mjs';
import { button, label } from '../lib/html.mjs';
import { plainHero } from '../lib/sections.mjs';

const items = [
  ['Selections stay in your browser', 'The hair builder and the enquiry forms put your selections and your optional notes together into a message in your browser. They are not submitted to a server by this website. It has no order database, no accounts and no payment form.'],
  ['What the browser remembers', 'For the length of your visit only, your browser session remembers that the logo introduction has played and whether you dismissed the contact prompt. No cookies are set, and nothing is kept once the session ends.'],
  ['Copying or sending an enquiry', `The copy button writes the message to your device clipboard when you choose it. ${site.whatsappNumber || site.contactEmail ? 'When WhatsApp or email is offered, the message is placed in the link and you decide whether to send it. WhatsApp and your email provider handle activity on their services under their own terms and privacy practices.' : 'In this preview no message is sent to MKM. You choose where to paste and share it.'}`],
  ['Website requests', 'The website includes no analytics, advertising trackers or marketing cookies. Fonts and images are served with the website. The hosting provider may process ordinary request information in order to deliver and secure pages.'],
  ['Keep sensitive details out of first messages', 'Please do not include your tax file number, bank details, identity numbers or medical information in an initial enquiry. Share those directly and only when you are comfortable.'],
  ...(site.previewMode ? [['Before public launch', 'MKM will need to approve its contact details, business privacy information and any arrangements for handling enquiries received outside this website.']] : []),
];

export function privacy() {
  return shell({
    title: 'Privacy | MKM Services',
    description: 'How this website handles your selections and enquiry messages: they stay in your browser, with no analytics, trackers or cookies.',
    path: '/privacy/', world: 'house', tone: 'light', crumbs: [['MKM Services', '/'], ['Privacy', '/privacy/']],
    content: `${plainHero({ kicker: 'Your information', title: 'A simple enquiry. <em>A little clarity.</em>', lede: 'How this website handles your selections and enquiry messages.' })}
<section class="section policy" data-world="house" data-tone="light"><div class="wrap policy__grid"><div class="policy__aside">${label('Privacy notes')}${site.previewMode ? '<p class="policy__flag">A final business privacy policy is awaiting approval.</p>' : ''}</div><div class="policy__list" data-stagger>${items.map(([h, p]) => `<article data-reveal><h2 class="h3">${h}</h2><p>${p}</p></article>`).join('')}</div></div></section>`,
  });
}

export function notFound() {
  return shell({
    title: 'Page not found', description: 'This page could not be found. Return to MKM Services and choose Care, Beauty or Tax.',
    path: '/404.html', world: 'house', tone: 'light', noindex: true,
    content: `${plainHero({ kicker: 'A different direction', title: 'Let’s find <em>your way back.</em>', lede: 'This page could not be found. Choose where you would like to go.', actions: `<div class="btn-row">${button('Back to home', '/', { kind: 'solid' })}${button('Care', '/care/', { kind: 'outline' })}${button('Beauty', '/beauty/', { kind: 'outline' })}${button('Tax', '/tax/', { kind: 'outline' })}</div>` })}`,
  });
}
