// Node-only view of the site settings used by the page templates and the build.
// Defaults live in site.js (shared with the browser). A deploy can override them without editing code:
//   SITE_URL=https://www.example.com  SITE_PREVIEW=false  WHATSAPP_NUMBER=61400000000  CONTACT_EMAIL=name@example.com
import { site as defaults } from './site.js';

const env = process.env;
export const site = Object.freeze({
  ...defaults,
  ...(env.SITE_URL !== undefined ? { siteUrl: env.SITE_URL.replace(/\/+$/, '') } : {}),
  ...(env.SITE_PREVIEW !== undefined ? { previewMode: env.SITE_PREVIEW !== 'false' } : {}),
  ...(env.WHATSAPP_NUMBER !== undefined ? { whatsappNumber: env.WHATSAPP_NUMBER } : {}),
  ...(env.CONTACT_EMAIL !== undefined ? { contactEmail: env.CONTACT_EMAIL } : {}),
});
