import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { build, read, exists, htmlFiles } from './helpers/build.mjs';

let preview, live;
before(() => {
  preview = build();
  live = build({ SITE_PREVIEW: 'false', SITE_URL: 'https://www.example.test/', WHATSAPP_NUMBER: '61400000000' });
});

const meta = (html, re) => (html.match(re) || [])[1];
const titleOf = html => meta(html, /<title>([^<]*)<\/title>/);
const descOf = html => meta(html, /<meta name="description" content="([^"]*)"/);

test('every route and the custom 404 are built', () => {
  assert.equal(preview.error, null);
  const files = htmlFiles(preview.out);
  assert.equal(files.length, 16);
  for (const f of ['index.html', '404.html', 'care/index.html', 'beauty/index.html', 'tax/index.html', 'contact/index.html', 'about/index.html', 'shop/hair-enquiry/index.html', 'beauty/hair/index.html', 'beauty/skincare/index.html', 'beauty/home-decor/index.html', 'textures/index.html', 'hair-care/index.html', 'delivery-returns/index.html', 'privacy/index.html', 'shop/index.html']) assert.ok(files.includes(f), `missing ${f}`);
});

test('preview mode keeps the site private: noindex, robots disallow, no canonical, no sitemap', () => {
  const home = read(preview.out, 'index.html');
  assert.match(home, /<meta name="robots" content="noindex,nofollow">/);
  assert.doesNotMatch(home, /rel="canonical"/);
  assert.match(read(preview.out, 'robots.txt'), /Disallow: \//);
  assert.ok(!exists(preview.out, 'sitemap.xml'));
});

test('live mode gives canonical URLs, absolute social image, sitemap and an open robots file', () => {
  assert.equal(live.error, null);
  for (const file of htmlFiles(live.out).filter(f => f !== '404.html')) {
    const html = read(live.out, file);
    assert.doesNotMatch(html, /name="robots"/, file);
    assert.match(html, /<link rel="canonical" href="https:\/\/www\.example\.test\/[^"]*">/, file);
    assert.match(html, /<meta property="og:image" content="https:\/\/www\.example\.test\/assets\/brand\/og-image\.png">/, file);
  }
  assert.match(read(live.out, 'robots.txt'), /Allow: \/\nSitemap: https:\/\/www\.example\.test\/sitemap\.xml/);
  const sitemap = read(live.out, 'sitemap.xml');
  assert.equal((sitemap.match(/<loc>/g) || []).length, 15);
  assert.match(sitemap, /<loc>https:\/\/www\.example\.test\/care\/<\/loc>/);
  assert.doesNotMatch(sitemap, /404/);
  assert.match(read(live.out, '404.html'), /noindex/);
  // the browser copy of the settings carries the contact channel, never the origin
  const browserSite = read(live.out, 'assets/js/config/site.js');
  assert.match(browserSite, /"whatsappNumber": "61400000000"/);
  assert.doesNotMatch(browserSite, /siteUrl/);
});

test('going public is refused until a domain and a real contact channel exist', () => {
  assert.match(build({ SITE_PREVIEW: 'false' }).error, /siteUrl is empty/);
  assert.match(build({ SITE_PREVIEW: 'false', SITE_URL: 'https://www.example.test' }).error, /neither whatsappNumber nor contactEmail/);
  assert.equal(build({ SITE_PREVIEW: 'false', SITE_URL: 'https://www.example.test', CONTACT_EMAIL: 'hello@example.test' }).error, null);
});

test('every page has a unique title (65 chars max) and a unique description (70 to 160 chars)', () => {
  const titles = new Map(), descriptions = new Map();
  for (const file of htmlFiles(preview.out)) {
    const html = read(preview.out, file);
    const title = titleOf(html), description = descOf(html);
    assert.ok(title && title.length <= 65, `${file} title "${title}" (${title?.length})`);
    assert.ok(description && description.length >= 70 && description.length <= 160, `${file} description length ${description?.length}`);
    if (file !== '404.html') {
      assert.ok(!titles.has(title), `duplicate title ${title} on ${file} and ${titles.get(title)}`); titles.set(title, file);
      assert.ok(!descriptions.has(description), `duplicate description on ${file}`); descriptions.set(description, file);
    }
    assert.match(html, /<html lang="en-AU"/, file);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${file} needs exactly one h1`);
    assert.match(html, /<a class="skip-link" href="#main">/, file);
    assert.match(html, /<main id="main"/, file);
  }
});

test('structured data is valid JSON and describes the organisation without invented contact details', () => {
  for (const file of htmlFiles(preview.out)) {
    const html = read(preview.out, file);
    const json = JSON.parse(meta(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/));
    const graph = json['@graph'];
    const org = graph.find(n => n['@type'] === 'Organization');
    assert.equal(org.name, 'MKM Services');
    assert.ok(!('telephone' in org) && !('address' in org) && !('aggregateRating' in org) && !('review' in org), file);
    assert.deepEqual(org.sameAs, ['https://www.mkmcareservices.com.au/']);
  }
  const care = JSON.parse(meta(read(preview.out, 'care/index.html'), /ld\+json">([\s\S]*?)<\/script>/));
  assert.ok(care['@graph'].some(n => n['@type'] === 'Service' && n.name === 'MKM Care Services'));
  assert.ok(care['@graph'].some(n => n['@type'] === 'BreadcrumbList'));
});

test('the Content-Security-Policy allows exactly the one inline bootstrap script and no inline styles anywhere', () => {
  const headers = read(preview.out, '_headers');
  const csp = meta(headers, /Content-Security-Policy: (.*)/);
  assert.match(csp, /style-src 'self';/);
  assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval/);
  for (const file of htmlFiles(preview.out)) {
    const html = read(preview.out, file);
    const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
    assert.equal(inline.length, 1, `${file}: expected one inline script`);
    const hash = `'sha256-${createHash('sha256').update(inline[0]).digest('base64')}'`;
    assert.ok(csp.includes(hash), `${file}: CSP does not include the inline script hash`);
    assert.doesNotMatch(html, /\sstyle="/, `${file}: inline style attribute would be blocked by the CSP`);
    assert.doesNotMatch(html, /<style[ >]/, file);
    assert.doesNotMatch(html, /\son[a-z]+="/, `${file}: inline event handler`);
  }
});

test('web manifest, icons and social image exist and are referenced', () => {
  const manifest = JSON.parse(read(preview.out, 'manifest.webmanifest'));
  assert.equal(manifest.name, 'MKM Services');
  assert.equal(manifest.start_url, './');
  for (const icon of manifest.icons) assert.ok(exists(preview.out, icon.src), icon.src);
  for (const file of ['assets/brand/og-image.png', 'assets/brand/favicon-32.png', 'assets/brand/apple-touch-icon.png', 'assets/brand/favicon.ico']) assert.ok(exists(preview.out, file), file);
  assert.match(read(preview.out, 'index.html'), /<link rel="manifest" href="\.\/manifest\.webmanifest">/);
});

test('no unverified contact details, currencies or invented claims appear on any page', () => {
  const forbidden = [/wa\.me\//, /href="tel:/, /href="mailto:/, /\bAUD\b/, /\bUGX\b/, /lorem ipsum/i, /★|⭐|\d+\s*(?:\+\s*)?(?:happy|satisfied) (?:clients|customers)/i, /\b5[- ]star\b/i, /guaranteed (?:refund|result|outcome)/i, /\b(?:visa|mastercard|paypal)\b/i];
  for (const file of htmlFiles(preview.out)) {
    const text = read(preview.out, file);
    for (const pattern of forbidden) assert.doesNotMatch(text, pattern, `${file}: ${pattern}`);
  }
});

test('the official Care website reference is kept exactly and opens safely', () => {
  for (const file of ['index.html', 'care/index.html', 'contact/index.html']) {
    const html = read(preview.out, file);
    assert.match(html, /www\.mkmcareservices\.com\.au/, file);
    for (const [tag] of html.matchAll(/<a [^>]*href="https:\/\/www\.mkmcareservices\.com\.au\/"[^>]*>/g)) assert.match(tag, /rel="noopener noreferrer"/, tag);
  }
});

test('each service world uses its own smart call to action', () => {
  const expect = { 'care/index.html': 'Talk through your support needs', 'beauty/index.html': 'Start a beauty enquiry', 'tax/index.html': 'Discuss your tax support', 'index.html': 'Speak with Monica' };
  for (const [file, cta] of Object.entries(expect)) assert.match(read(preview.out, file), new RegExp(`dock__text"><small>[^<]*</small><strong>${cta}</strong>`), file);
});

test('every URL is document-relative so the site works at a domain root or in any sub-folder (except the 404, which is served at any depth)', () => {
  const rootRelative = /\s(?:href|src|data-full|poster)="\/(?!\/)/;
  for (const file of htmlFiles(preview.out)) {
    const html = read(preview.out, file);
    if (file === '404.html') { assert.match(html, /href="\/assets\/site\.css"/); continue; }
    assert.doesNotMatch(html, rootRelative, `${file} has a root-relative URL`);
    assert.doesNotMatch(html, /srcset="[^"]*(?:^|, )\/assets/, `${file} has a root-relative srcset`);
  }
  const home = read(preview.out, 'index.html');
  assert.match(home, /<link rel="stylesheet" href="\.\/assets\/site\.css">/);
  assert.match(home, /<a class="[^"]*" href="\.\/care\/"/);
  assert.match(read(preview.out, 'care/index.html'), /<link rel="stylesheet" href="\.\.\/assets\/site\.css">/);
  assert.match(read(preview.out, 'care/index.html'), /href="\.\.\/beauty\/"/);
  assert.match(read(preview.out, 'beauty/hair/index.html'), /<link rel="stylesheet" href="\.\.\/\.\.\/assets\/site\.css">/);
  assert.match(read(preview.out, 'beauty/hair/index.html'), /src="\.\.\/\.\.\/assets\/media\//);
  assert.doesNotMatch(read(preview.out, 'assets/site.css'), /url\(\s*\//);
  assert.match(read(preview.out, 'assets/site.css'), /url\(fonts\/font-2\.woff2\)/);
  assert.doesNotMatch(read(preview.out, 'assets/js/hair.js'), /[`'"]\/assets\//);
});
