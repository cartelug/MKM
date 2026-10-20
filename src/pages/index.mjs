// Route table: [output file, render function, URL path, sitemap priority]. Add a page here and it is built,
// added to the sitemap and covered by the route checks.
import { home } from './home.mjs';
import { care } from './care.mjs';
import { beauty, skincare, homeDecor } from './beauty.mjs';
import { tax } from './tax.mjs';
import { contact } from './contact.mjs';
import { about } from './about.mjs';
import { hairLanding, shop, enquiry, textureDetail, hairCare, delivery } from './hair.mjs';
import { privacy, notFound } from './legal.mjs';

export const pages = [
  ['index.html', home, '/', '1.0'],
  ['care/index.html', care, '/care/', '0.9'],
  ['beauty/index.html', beauty, '/beauty/', '0.9'],
  ['tax/index.html', tax, '/tax/', '0.9'],
  ['beauty/hair/index.html', hairLanding, '/beauty/hair/', '0.8'],
  ['beauty/skincare/index.html', skincare, '/beauty/skincare/', '0.7'],
  ['beauty/home-decor/index.html', homeDecor, '/beauty/home-decor/', '0.7'],
  ['shop/index.html', shop, '/shop/', '0.7'],
  ['shop/hair-enquiry/index.html', enquiry, '/shop/hair-enquiry/', '0.7'],
  ['textures/index.html', textureDetail, '/textures/', '0.6'],
  ['hair-care/index.html', hairCare, '/hair-care/', '0.5'],
  ['delivery-returns/index.html', delivery, '/delivery-returns/', '0.5'],
  ['about/index.html', about, '/about/', '0.7'],
  ['contact/index.html', contact, '/contact/', '0.9'],
  ['privacy/index.html', privacy, '/privacy/', '0.3'],
];
export const notFoundPage = notFound;
