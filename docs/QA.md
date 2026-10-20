# Quality checks (V2)

All results below were measured on the built site in this repository, not estimated.

## Automated, run with every `npm run check`

- **47 Node tests**: 540 hair combinations; WhatsApp and email link encoding; every service, topic and general-enquiry message; preview vs live build (noindex, canonical, sitemap, robots, manifest, social image); unique titles and descriptions; JSON-LD; Content-Security-Policy header and `<meta>` copy agree and match the one inline script's hash; no inline styles; valid generated HTML (no bare ampersands, no empty `src`); older-browser fallbacks; document-relative URLs; root copy identical to `dist/`; no invented contact details or claims; the official Care website kept exactly; motion rules (reduced-motion guards, arrival 0.9-1.6s, transform and opacity only); unit tests for the minifier and build transforms.
- **Site integrity check** over all 16 documents: routes, fragments, ARIA/label references, link safety, accessible link and button names, heading order, `srcset`/`sizes`, image dimensions, scripts, dynamic imports, stylesheet assets, and that no URL is root-relative. It was mutation-tested: injected defects are all caught.

## Browser tests (`npm run test:e2e`, Chromium, 19 tests)

Every route loads cleanly and the unknown route is a real 404 · no horizontal overflow on any route at 320, 390, 768, 1024 and 1440px · mobile menu (full screen, focus trap, scroll lock, Escape, 44px targets) · arrival once per session and its reduced-motion path · contact concierge · WhatsApp and email mode with exact encoding · hair builder (texture, length, colour, quantity, bounds, summary, deep links, bad values) · lightbox · tax quick enquiry dialog · shop filter · FAQ keyboard · MKM Edit scroller · contact dock · **the real CSP enforced with zero violations** · **hosting in a sub-folder (`/MKM/`)** · **`main.js` blocked** (failsafe reveals everything and navigation works) · **JavaScript disabled** · **44px tap targets on every route**.

## Real WebKit (ad hoc, not part of the repo)

The site was driven in WebKitGTK 2.52 (the engine family behind Safari) through WebDriver under a virtual display: **28 of 28 checks passed**. That covered all 15 routes (reveals, split headings, fonts, no overflow, no broken images), the hair builder, native `<dialog>`, lightbox, contact confirmation, FAQ, and the mobile menu with `inert`. Screenshots matched Chromium. It also confirmed the `requestIdleCallback` fallback is needed (WebKit lacks it) and works.

## Accessibility

- **axe-core 4.10** (WCAG 2.0/2.1/2.2 A and AA plus best-practice rules): **no violations** on all 15 routes at 1440px and 390px, including colour contrast, re-run on the final build.
- Every interactive control is at least **44x44px** on a phone and on a touch tablet (scanned on all routes; inline links inside running text are exempt).
- Palette contrast was computed up front: ink on paper 15.9:1, paper on moss 8.2:1, paper on oxblood 11.0:1, paper on tax blue 10.0:1. Brass is used only on dark surfaces or in a deeper shade on light ones.
- Focus rings were inspected on dark and light surfaces. Reduced motion shows everything immediately and still. A forced-colors (Windows high-contrast) stylesheet keeps controls, selected states and focus visible.
- HTML was checked with html-validate: the only remaining messages are style preferences (an uppercase `DOCTYPE` and `role="region"` suggestions).

## Performance (Lighthouse 12, mobile emulation, simulated slow 4G and 4x CPU slowdown)

First visit, so the logo arrival is playing. Served compressed from `npm start`, preview mode, all 15 routes:

| Page | Perf | A11y | Best practices | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Home | 94 | 100 | 100 | 2.2 s | 110 ms | 0 |
| Care | 94 | 100 | 100 | 2.6 s | 0 ms | 0 |
| Beauty | 96 | 100 | 100 | 2.1 s | 40 ms | 0 |
| Tax | 96 | 100 | 100 | 2.3 s | 0 ms | 0 |
| Contact | 96 | 100 | 100 | 2.0 s | 0 ms | 0 |
| About | 98 | 100 | 100 | 1.9 s | 0 ms | 0 |
| Hair | 94 | 100 | 100 | 2.8 s | 0 ms | 0 |
| Skincare / Home décor | 97 / 97 | 100 | 100 | 2.3 s | 0 ms | 0 |
| Shop | 97 | 100 | 100 | 2.3 s | 0 ms | 0 |
| Hair builder | 92 | 100 | 100 | 3.0 s | 20 ms | 0 |
| Textures | 96 | 100 | 100 | 1.9 s | 0 ms | 0 |
| Hair care / Delivery / Privacy | 98 / 99 / 98 | 100 | 100 | 2.0-2.3 s | 0 ms | 0 |

Scores move by about 3 points between runs. Speed Index is the weakest metric (2-4 s) because the arrival intentionally shows a dark frame for about a second. SEO scores 66 in preview mode only because the site is deliberately `noindex`; built in live mode (`SITE_PREVIEW=false` with a domain and contact channel) it scores **100**, with performance 96 on the home page and 92 on the builder.

Weight: about 520 KB on the first home visit (HTML 8 KB brotli, CSS about 18 KB, fonts about 12 KB each, hero thumbnails 5-30 KB each). Images are WebP with responsive sizes, explicit dimensions and lazy loading below the fold.

Each page uses roughly 13-32% of the single stylesheet. Splitting it per page group would save about 10 KB per page; it was left as is because the gain (about 50 ms on slow 4G) did not justify the ordering risk.

## Hosting and security

- URLs are document-relative, so the same files work at a domain root or in a sub-folder (verified by serving the build under `/MKM/` and by viewing the repository root served that way).
- The CSP is enforced by the preview server from `_headers`, and also embedded as a `<meta>` tag for hosts that ignore `_headers`. Sweeps of every route on desktop and mobile with interactions showed **no violations**.
- If scripting is off or `main.js` fails, a failsafe makes all content visible within 5 seconds and the navigation links appear in a strip.

## Defects found and fixed in this verification

Beyond layout polish, the extra checks caught: a stylesheet that was **partly unminified** because an apostrophe in a CSS comment confused the minifier (now fixed and unit-tested); a CSP that had never been enforced in a browser; content that would have stayed invisible if `main.js` failed; a header and contact form that were unusable without scripting; an empty `src` on the lightbox image; unencoded ampersands; header, footer, breadcrumb and texture links smaller than 44px; no fallbacks for `svh`, `dvh` and `overflow: clip` on older iOS; an inconsistent voice in some copy; and a mention of a funding scheme in a contact hint, now removed.

## Not verified here

- **Firefox, real Safari and iOS.** Firefox could not be installed in this environment. WebKitGTK is the same engine family as Safari but not Safari itself, and nothing was run on an iPhone or iPad.
- **Real devices and assistive technology.** No VoiceOver, NVDA or TalkBack session was run; semantics, names, focus order and live regions are covered by axe and the tests only. Touch gestures (lightbox swipe, menu) were exercised with touch emulation.
- **Production hosting.** Compression and headers were mirrored locally. The external Care website link was not checked from here.
- **Contact delivery.** WhatsApp and email links are tested for exact encoding with fixture values only. Test them with Monica's real number before launch, without sending a message by accident.
- "Perfect" cannot be proven: this is a long list of passed checks and found-and-fixed problems, not a guarantee that none remain.

## Before launch (browser acceptance pass)

- Open the site on at least one iPhone, one Android phone and one desktop in Safari, Chrome and Firefox; check logo legibility and no overflow at 320, 390, 768, 1280 and 1440px.
- Open and close the menu, lightbox, FAQs and enquiry dialogs with touch, keyboard and Escape.
- Try the hair builder through all lengths and textures including query-linked preferences.
- Test the confirmed WhatsApp number on phone and desktop.
- Run a screen-reader pass and a Lighthouse run against the deployed preview.
