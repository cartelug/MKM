// Browser tests. Playwright is optional (not a project dependency): install it yourself
// (`npm i -D playwright && npx playwright install chromium`) or point PLAYWRIGHT_MODULE at an existing install.
// Without it these tests are skipped. Run with:  npm run test:e2e
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { build, root } from '../helpers/build.mjs';

let playwright = null;
try { playwright = await import('playwright'); }
catch { try { playwright = await import(process.env.PLAYWRIGHT_MODULE ?? '/opt/node22/lib/node_modules/playwright/index.mjs'); } catch { /* skipped below */ } }
const skip = playwright ? false : 'Playwright is not installed (see tests/e2e/site.e2e.mjs)';

const servers = [];
function serve(dir, port) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [path.join(root, 'scripts/serve.mjs')], { env: { ...process.env, MKM_OUT: dir, PORT: String(port) } });
    servers.push(child);
    child.stdout.on('data', d => String(d).includes('local preview') && resolve(`http://localhost:${port}`));
    child.on('error', reject);
  });
}
let browser, base, liveBase;
before(async () => {
  if (skip) return;
  base = await serve(build().out, 4391);
  liveBase = await serve(build({ SITE_PREVIEW: 'false', SITE_URL: 'https://www.example.test', WHATSAPP_NUMBER: '61400000000', CONTACT_EMAIL: 'hello@example.test' }).out, 4392);
  browser = await playwright.chromium.launch();
});
after(async () => { await browser?.close(); servers.forEach(s => s.kill()); });

async function open(url, { width = 1280, height = 900, mobile = false, reduced = false, arrival = false } = {}) {
  const context = await browser.newContext({ viewport: { width, height }, hasTouch: mobile, isMobile: mobile, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  if (!arrival) await context.addInitScript(() => sessionStorage.setItem('mkm-arrival', '1'));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.goto(url, { waitUntil: 'load' });
  return { page, context, errors };
}

// Lazily loaded features mark their root with data-ready once initialised.
const ready = (page, selector) => page.waitForSelector(`${selector}[data-ready="true"]`);

const routes = ['/', '/care/', '/beauty/', '/tax/', '/beauty/hair/', '/beauty/skincare/', '/beauty/home-decor/', '/shop/', '/shop/hair-enquiry/', '/textures/', '/hair-care/', '/delivery-returns/', '/about/', '/contact/', '/privacy/'];

test('every route loads without console errors and the unknown route returns a real 404', { skip }, async () => {
  const { page, context, errors } = await open(base + '/');
  for (const route of routes) {
    const response = await page.goto(base + route);
    assert.equal(response.status(), 200, route);
    assert.equal(await page.locator('h1').count(), 1, route);
  }
  const missing = await page.goto(base + '/no-such-page/');
  assert.equal(missing.status(), 404);
  assert.match(await page.locator('h1').innerText(), /your way back/i);
  assert.deepEqual(errors.filter(e => !/404/.test(e)), []);
  await context.close();
});

test('no horizontal overflow on any route from 320px to 1440px', { skip }, async () => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    const { page, context } = await open(base + '/', { width, height: 800, mobile: width < 700 });
    for (const route of routes) {
      await page.goto(base + route);
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < total; y += 700) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(25); }
      const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      assert.ok(sw <= cw, `${width}px ${route}: scrollWidth ${sw} > ${cw}`);
    }
    await context.close();
  }
});

test('mobile menu: opens full screen, traps focus, locks scroll, closes with Escape, tap targets are 44px', { skip }, async () => {
  const { page, context } = await open(base + '/', { width: 390, height: 844, mobile: true });
  const toggle = page.locator('.menu-toggle');
  assert.ok((await toggle.boundingBox()).height >= 44);
  await toggle.click();
  await page.waitForTimeout(900);
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).overflow), 'hidden');
  assert.equal(await page.evaluate(() => document.querySelector('main').inert), true);
  const small = await page.evaluate(() => [...document.querySelectorAll('#menu a')].filter(a => a.getBoundingClientRect().height < 44).map(a => a.textContent.trim()));
  assert.deepEqual(small, []);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await page.evaluate(() => document.activeElement.classList.contains('menu-toggle')), true);
  await context.close();
});

test('arrival plays once per session, finishes quickly, and the reduced-motion path is static and brief', { skip }, async () => {
  const first = await open(base + '/', { arrival: true });
  assert.equal(await first.page.evaluate(() => document.documentElement.classList.contains('pre')), true);
  await first.page.waitForFunction(() => !document.getElementById('preloader'), null, { timeout: 3000 });
  await first.page.goto(base + '/care/');
  assert.equal(await first.page.evaluate(() => document.documentElement.classList.contains('pre')), false);
  await first.context.close();
  const reduced = await open(base + '/', { reduced: true, arrival: true });
  assert.equal(await reduced.page.evaluate(() => document.documentElement.classList.contains('pre-static')), true);
  await reduced.page.waitForFunction(() => !document.getElementById('preloader'), null, { timeout: 3000 });
  assert.equal(await reduced.page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter(e => getComputedStyle(e).opacity === '0').length), 0);
  assert.equal(await reduced.page.evaluate(() => document.querySelectorAll('.wi').length), 0);
  await reduced.context.close();
});

test('contact concierge adapts to the reason, validates, and ends in an honest confirmation', { skip }, async () => {
  const { page, context, errors } = await open(base + '/contact/?service=tax&topic=Tax%20debt%20support');
  await ready(page, '#contact-form');
  assert.equal(await page.locator('#c-topic').inputValue(), 'Tax debt support');
  assert.equal(await page.locator('#c-extra').count(), 1);
  await page.locator('input[name=service][value=care]').check({ force: true });
  assert.equal(await page.locator('#c-extra').evaluate(e => e.tagName), 'SELECT');
  await page.locator('button[type=submit]').click();
  assert.equal(await page.locator('#c-name').getAttribute('aria-invalid'), 'true');
  assert.match(await page.locator('[data-form-status]').innerText(), /first name/);
  await page.fill('#c-name', 'Amara');
  await page.locator('button[type=submit]').click();
  await page.waitForSelector('.confirm.is-played');
  const message = await page.locator('.confirm__message').inputValue();
  assert.match(message, /MKM Care Services/);
  assert.match(message, /Amara/);
  assert.match(await page.locator('.confirm__lead').innerText(), /Nothing has been sent yet/);
  assert.equal(await page.locator('.confirm a[href^="https://wa.me"], .confirm a[href^="mailto:"]').count(), 0);
  assert.match(await page.locator('.confirm__note').innerText(), /official MKM Care website|mkmcareservices/);
  assert.equal(await page.locator('.confirm__next li').count(), 3);
  assert.deepEqual(errors, []);
  await context.close();
});

test('with WhatsApp and email configured, the confirmation offers real, correctly encoded send links', { skip }, async () => {
  const { page, context } = await open(liveBase + '/contact/?service=beauty');
  await ready(page, '#contact-form');
  await page.fill('#c-name', 'Zawadi');
  await page.fill('#c-note', 'A 24 inch wave & some colour advice?');
  await page.locator('button[type=submit]').click();
  await page.waitForSelector('.confirm');
  const wa = await page.locator('.confirm a[href^="https://wa.me/61400000000"]').getAttribute('href');
  const decoded = new URL(wa).searchParams.get('text');
  assert.equal(decoded, await page.locator('.confirm__message').inputValue());
  assert.match(decoded, /24 inch wave & some colour advice\?/);
  assert.equal(await page.locator('.confirm a[href^="https://wa.me"]').getAttribute('target'), '_blank');
  const mail = await page.locator('.confirm a[href^="mailto:hello@example.test"]').getAttribute('href');
  assert.ok(new URLSearchParams(mail.split('?')[1]).get('body').includes('Zawadi'));
  await context.close();
});

test('hair builder: texture, length, colour and quantity update the brief, price, photo and a ready-to-send message', { skip }, async () => {
  const { page, context, errors } = await open(base + '/shop/hair-enquiry/');
  await ready(page, '#hair-form');
  assert.match(await page.locator('#subtotal-price').innerText(), /US\$320/);
  await page.locator('label.tex-option:has-text("Water Wave")').click();
  await page.locator('label.len-option:has(input[value="28"])').click();
  await page.locator('label.chip:has-text("Another colour")').click();
  await page.fill('#colour-other', 'Burgundy');
  await page.locator('#quantity-plus').click();
  await page.waitForTimeout(400);
  assert.match(await page.locator('#subtotal-price').innerText(), /US\$1,040/);
  assert.equal(await page.locator('[data-sum-texture]').innerText(), 'Water Wave');
  assert.equal(await page.locator('[data-sum-colour]').innerText(), 'Burgundy');
  assert.match(await page.locator('#builder-image').getAttribute('src'), /08-wet-look-curl/);
  assert.match(page.url(), /texture=Water\+Wave.*length=28.*quantity=2|texture=Water%20Wave/);
  await page.locator('#quantity-minus').click();
  assert.equal(await page.locator('#quantity-minus').isDisabled(), true);
  assert.equal(await page.locator('#hair-quantity').inputValue(), '1');
  await page.fill('#hair-quantity', '99'); await page.locator('#hair-quantity').dispatchEvent('input');
  assert.equal(await page.locator('#hair-quantity').inputValue(), '10');
  assert.equal(await page.locator('#quantity-plus').isDisabled(), true);
  await page.fill('#hair-quantity', '2'); await page.locator('#hair-quantity').dispatchEvent('input');
  await page.fill('#hair-name', 'Nia');
  await page.locator('button[type=submit]').click();
  await page.waitForSelector('#enquiry-dialog[open] .confirm');
  const message = await page.locator('.confirm__message').inputValue();
  for (const part of ['My name is Nia', 'Length: 28 inches', 'Texture: Water Wave', 'Colour preference: Burgundy', 'Quantity: 2', 'US$1,040 (USD)', 'confirm the exact product']) assert.ok(message.includes(part), part);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#enquiry-dialog').evaluate(d => d.open), false);
  assert.equal(await page.evaluate(() => document.activeElement.type), 'submit');
  assert.deepEqual(errors, []);
  await context.close();
});

test('hair builder honours a deep link and falls back safely on bad values', { skip }, async () => {
  const { page, context } = await open(base + '/shop/hair-enquiry/?texture=Kinky%20Curly&length=32&quantity=3&colour=Dark%20brown');
  await ready(page, '#hair-form');
  assert.equal(await page.locator('input[name=texture]:checked').inputValue(), 'Kinky Curly');
  assert.equal(await page.locator('input[name=inches]:checked').inputValue(), '32');
  assert.match(await page.locator('#subtotal-price').innerText(), /US\$2,010/);
  await page.goto(base + '/shop/hair-enquiry/?texture=Nonsense&length=17&quantity=banana&colour=Fuchsia');
  await ready(page, '#hair-form');
  assert.equal(await page.locator('input[name=texture]:checked').inputValue(), 'Body Wave');
  assert.equal(await page.locator('input[name=inches]:checked').inputValue(), '20');
  assert.equal(await page.locator('#hair-quantity').inputValue(), '1');
  assert.equal(await page.locator('input[name=colour]:checked').inputValue(), 'No preference');
  await context.close();
});

test('lightbox: opens fast, shows the full photograph, navigates by keyboard, zooms, closes and restores focus', { skip }, async () => {
  const { page, context } = await open(base + '/beauty/');
  await ready(page, '[data-lightbox]');
  const trigger = page.locator('.tex__zoom').first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.locator('#lightbox');
  await dialog.waitFor({ state: 'visible' });
  assert.match(await page.locator('#lightbox-image').getAttribute('src'), /\/assets\/hair\/09-silky-straight-back\.webp/);
  assert.match(await page.locator('#lightbox-caption').innerText(), /Straight/);
  assert.equal(await page.locator('#lightbox-count').innerText(), '01 / 06');
  await page.keyboard.press('ArrowRight');
  assert.match(await page.locator('#lightbox-caption').innerText(), /Body Wave/);
  await page.locator('[data-lightbox-stage]').click();
  assert.equal(await page.locator('[data-lightbox-stage]').evaluate(e => e.classList.contains('is-zoomed')), true);
  await page.keyboard.press('Escape');
  assert.equal(await dialog.evaluate(d => d.open), false);
  assert.equal(await page.evaluate(() => document.activeElement.classList.contains('tex__zoom')), true);
  await context.close();
});

test('tax quick enquiry opens a reviewable message in a dialog and Escape returns focus', { skip }, async () => {
  const { page, context } = await open(base + '/tax/');
  await ready(page, '[data-quick-enquiry]');
  await page.locator('.chip:has-text("Help with eligible claims")').scrollIntoViewIfNeeded();
  await page.locator('.chip:has-text("Help with eligible claims")').click();
  await page.fill('#quick-note', 'I changed jobs this year.');
  await page.locator('[data-quick-enquiry] button[type=submit]').click();
  await page.waitForSelector('#enquiry-dialog[open] .confirm');
  const message = await page.locator('.confirm__message').inputValue();
  assert.match(message, /MKM Tax Return Services/);
  assert.match(message, /Help with eligible claims/);
  assert.match(message, /I changed jobs this year\./);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#enquiry-dialog').evaluate(d => d.open), false);
  await context.close();
});

test('shop filter narrows the textures and announces the count', { skip }, async () => {
  const { page, context } = await open(base + '/shop/');
  await ready(page, '#shop-texture');
  await page.selectOption('#shop-texture', 'Wavy');
  assert.equal(await page.locator('.texcard:visible').count(), 1);
  assert.equal(await page.locator('#shop-result-count').innerText(), '1 texture enquiry option');
  await page.selectOption('#shop-texture', 'all');
  assert.equal(await page.locator('.texcard:visible').count(), 6);
  await context.close();
});

test('FAQ accordions open and close by keyboard and hide closed answers from assistive technology', { skip }, async () => {
  const { page, context } = await open(base + '/tax/#tax-faq');
  const first = page.locator('.faq__q button').first();
  await first.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(700);
  assert.equal(await first.getAttribute('aria-expanded'), 'true');
  assert.equal(await page.locator('.faq__a').first().isVisible(), true);
  assert.equal(await page.locator('.faq__a').nth(1).isVisible(), false);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(700);
  assert.equal(await page.locator('.faq__a').first().isVisible(), false);
  await context.close();
});

test('The MKM Edit scroller moves with its buttons and stays reachable by keyboard', { skip }, async () => {
  const { page, context } = await open(base + '/beauty/', { width: 1280 });
  await ready(page, '[data-scroller]');
  const track = page.locator('[data-scroller-track]');
  await track.scrollIntoViewIfNeeded();
  assert.equal(await track.evaluate(e => e.scrollLeft), 0, 'starts at the first card, not offset by padding');
  assert.equal(await page.locator('[data-scroller-prev]').isDisabled(), true);
  await page.locator('[data-scroller-next]').click();
  await page.waitForTimeout(800);
  assert.ok(await track.evaluate(e => e.scrollLeft) > 100);

  assert.equal(await track.getAttribute('tabindex'), '0');
  assert.equal(await track.getAttribute('role'), 'region');
  await context.close();
});

test('the contact dock is discreet: hidden at the top, shown after reading, dismissible, absent on the contact page', { skip }, async () => {
  const { page, context } = await open(base + '/care/');
  assert.equal(await page.locator('[data-dock]').evaluate(e => e.classList.contains('is-visible')), false);
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight * 0.4));
  await page.waitForTimeout(900);
  assert.equal(await page.locator('[data-dock]').evaluate(e => e.classList.contains('is-visible')), true);
  assert.match(await page.locator('.dock__main strong').innerText(), /Talk through your support needs/);
  await page.locator('.dock__close').click();
  await page.waitForTimeout(500);
  assert.equal(await page.locator('[data-dock]').evaluate(e => e.classList.contains('is-visible')), false);
  await page.goto(base + '/contact/');
  assert.equal(await page.locator('[data-dock]').count(), 0);
  await context.close();
});
