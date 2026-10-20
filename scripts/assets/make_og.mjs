// Renders the 1200x630 social-sharing image from the genuine lettermark and the site fonts.
// Asset-time only (needs Playwright), not part of the build:  node scripts/assets/make_og.mjs
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';

const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const asset = file => pathToFileURL(path.join(root, 'public/assets', file)).href;
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? '/opt/node22/lib/node_modules/playwright/index.mjs')); }

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'Cormorant Garamond';font-style:italic;font-weight:400;src:url(${asset('fonts/font-0.woff2')})}
@font-face{font-family:'Cormorant Garamond';font-weight:400;src:url(${asset('fonts/font-2.woff2')})}
@font-face{font-family:'DM Sans';font-weight:600;src:url(${asset('fonts/font-6.woff2')})}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#171614;color:#f5f0e8;position:relative;overflow:hidden;font-family:'DM Sans',sans-serif}
.glow{position:absolute;inset:0;background:radial-gradient(520px 380px at 12% 8%,rgba(41,78,69,.9),transparent 70%),radial-gradient(520px 380px at 96% 92%,rgba(93,30,44,.95),transparent 70%),radial-gradient(420px 320px at 96% 6%,rgba(32,58,102,.9),transparent 70%)}
.frame{position:absolute;inset:34px;border:1px solid rgba(214,182,127,.45)}
.logo{position:absolute;left:96px;top:150px;width:470px}
.tag{position:absolute;left:96px;top:410px;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:54px;line-height:1.08;color:#f5f0e8}
.tag span:nth-child(1){color:#dce5dd}.tag span:nth-child(2){color:#e0a08c}.tag span:nth-child(3){color:#d9e2f2}
.label{position:absolute;left:96px;top:96px;font-size:15px;font-weight:600;letter-spacing:.28em;text-transform:uppercase;color:#d6b67f}
.bars{position:absolute;right:96px;bottom:96px;display:flex;gap:10px}.bars i{display:block;width:70px;height:4px}
.bars i:nth-child(1){background:#8dbcab}.bars i:nth-child(2){background:#e0a08c}.bars i:nth-child(3){background:#8fb0e6}
</style><div class="glow"></div><div class="frame"></div><div class="label">MKM Services</div><img class="logo" src="${asset('brand/mkm-white.png')}"><p class="tag"><span>Care.</span> <span>Beauty.</span> <span>Tax.</span></p><div class="bars"><i></i><i></i><i></i></div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
// file:// assets only load from a file page, not about:blank
const dir = await mkdtemp(path.join(os.tmpdir(), 'mkm-og-'));
const file = path.join(dir, 'og.html');
await writeFile(file, html);
await page.goto(pathToFileURL(file).href);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(root, 'public/assets/brand/og-image.png') });
await browser.close();
await rm(dir, { recursive: true, force: true });
console.log('Wrote public/assets/brand/og-image.png');
