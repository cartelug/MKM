// The only runtime price list. Matches docs/length-pricing-USD.csv exactly.
export const lengthPrices = Object.freeze([
  { inches: 16, usd: 200 }, { inches: 18, usd: 250 },
  { inches: 20, usd: 320 }, { inches: 22, usd: 370 },
  { inches: 24, usd: 420 }, { inches: 26, usd: 470 },
  { inches: 28, usd: 520 }, { inches: 30, usd: 600 },
  { inches: 32, usd: 670 },
].map(Object.freeze));

export const textures = Object.freeze([
  { name: 'Straight', image: '09-silky-straight-back.webp', alt: 'Smooth, straight dark hair draped down the back of a display mannequin', description: 'A clean, understated direction. Ask us about a straight finish for your preferred length.', note: 'Sleek lines. A simple statement.' },
  { name: 'Body Wave', image: '10-soft-body-wave-back.webp', alt: 'Long dark hair in large, soft waves on a display mannequin', description: 'Prefer a little movement? Explore a body-wave enquiry and confirm the exact wave pattern with MKM.', note: 'Soft movement. Easy presence.' },
  { name: 'Kinky Straight', image: '13-sleek-lace-straight.webp', alt: 'Side view of a mannequin wearing a smooth dark wig, shown as visual inspiration', description: 'Ask about a kinky-straight finish. MKM will share the relevant product photos and specifications before you decide.', note: 'Your texture, your expression.' },
  { name: 'Water Wave', image: '08-wet-look-curl.webp', alt: 'Long dark hair with closely defined waves on a mannequin', description: 'An enquiry for more defined movement. Confirm the available pattern, construction and final price directly.', note: 'Waves with a little character.' },
  { name: 'Kinky Curly', image: '11-curly-texture-back.webp', alt: 'A full arrangement of small dark curls on a display mannequin', description: 'Explore a curl-focused look. Ask for current images to help compare curl size and shape.', note: 'Full of shape. Full of you.' },
  { name: 'Wavy', image: '07-defined-wave-side.webp', alt: 'Side view of long dark hair with distinct, flowing waves on a mannequin', description: 'Find your preferred balance of shape and movement. MKM can help confirm the exact wavy style.', note: 'A softer way to make waves.' },
].map(Object.freeze));

export const gallery = Object.freeze([
  { image: '09-silky-straight-back.webp', alt: 'A back view of long, sleek dark hair on a mannequin', title: 'The straight edit' },
  { image: '07-defined-wave-side.webp', alt: 'Long, defined dark waves photographed from the side', title: 'A little movement' },
  { image: '11-curly-texture-back.webp', alt: 'Small dark curls cascading over a mannequin', title: 'Curls, up close' },
  { image: '13-sleek-lace-straight.webp', alt: 'Dark hair on a mannequin in profile against a light wall', title: 'A different angle' },
  { image: '10-soft-body-wave-back.webp', alt: 'Soft, broad waves on a long dark wig', title: 'Softly defined' },
]);

export const media = Object.freeze({
  hairRoot: '/assets/hair/',
  hero: '09-silky-straight-back.webp',
  heroAlt: 'Long, smooth dark hair photographed from behind on a display mannequin',
  heroAccent: '10-soft-body-wave-back.webp',
  heroAccentAlt: 'Broad, soft waves in long dark hair on a mannequin',
  editorial: '11-curly-texture-back.webp',
});
