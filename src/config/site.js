// Central public settings. Use an international WhatsApp number, digits only,
// after Monica confirms it. Never put credentials or private notes here.
export const site = Object.freeze({
  name: 'MKM Services',
  parentBusiness: 'MKM Services',
  // While true the site is noindex, robots blocks everything and a discreet preview label shows.
  previewMode: true,
  // Final public origin with no trailing slash, e.g. 'https://www.example.com'. Enables canonical
  // URLs, sitemap.xml and absolute social-image URLs. Leave empty until the domain is approved.
  siteUrl: '',
  whatsappNumber: '',
  contactEmail: '',
  careSite: Object.freeze({ label: 'www.mkmcareservices.com.au', url: 'https://www.mkmcareservices.com.au/' }),
  logo: '/assets/brand/mkm-black.png',
  logoWhite: '/assets/brand/mkm-white.png',
  description: 'MKM Services brings together compassionate disability and community support, beauty and home décor, and tax return assistance, with Monica as your personal point of contact.',
  photoNote: 'Images are style inspiration. Exact product, texture and availability are confirmed with MKM.',
});
