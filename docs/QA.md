# Quality checks (V2)

All results below were measured on the built site in this repository, not estimated.

## Automated, run with every `npm run check`

- **33 Node tests**: 540 hair combinations; WhatsApp and email link encoding; every service, topic and general-enquiry message; preview vs live build (noindex, canonical, sitemap, robots, manifest, social image); unique titles and descriptions; JSON-LD; Content-Security-Policy hash matches the one inline script; no inline styles; no invented contact details or claims; official Care website kept exactly; motion rules (reduced-motion guards, arrival 0.9-1.6s, transform and opacity only).
- **Site integrity check** over all 16 documents: routes, fragments, ARIA/label references, link safety, accessible link and button names, heading order, `srcset`/`sizes`, image dimensions, scripts, dynamic imports, stylesheet assets. It was mutation-tested: nine injected defects were all caught.

## Browser tests (`npm run test:e2e`, Chromium, 14 tests)

Every route loads cleanly and the unknown route is a real 404 · no horizontal overflow on any route at 320, 390, 768, 1024 and 1440px · mobile menu (full screen, focus trap, scroll lock, Escape, 44px targets) · arrival once per session and its reduced-motion path · contact concierge (adapts per reason, validation, honest confirmation) · WhatsApp and email mode with exact encoding · hair builder (texture, length, colour, quantity, bounds, summary, deep links, bad values) · lightbox (keyboard, zoom, focus restore) · tax quick enquiry dialog · shop filter · FAQ keyboard · MKM Edit scroller · contact dock.

## Accessibility

- **axe-core 4.10** (WCAG 2.0/2.1/2.2 A and AA plus best-practice rules): **no violations** on all 15 routes at 1440px and 390px, including colour contrast.
- Palette contrast was computed up front: ink on paper 15.9:1, paper on moss 8.2:1, paper on oxblood 11.0:1, paper on tax blue 10.0:1. Brass is used only on dark surfaces or in a deeper shade on light ones (plain brass on paper is 2.8:1 and is never used for text).
- Focus rings were inspected on dark and light surfaces. Reduced motion shows everything immediately and still.

## Performance (Lighthouse 12, mobile emulation, simulated slow 4G and 4x CPU slowdown)

First visit, so the logo arrival is playing. Preview mode, served compressed from `npm start`.

| Page | Performance | Accessibility | Best practices | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Home | 94 | 100 | 100 | 2.4 s | 110 ms | 0 |
| Care | 93 | 100 | 100 | 2.7 s | 0 ms | 0 |
| Beauty | 95 | 100 | 100 | 2.4 s | 20 ms | 0 |
| Tax | 95 | 100 | 100 | 2.2 s | 0 ms | 0 |
| Hair builder | 91 | 100 | 100 | 3.0 s | 40 ms | 0 |
| About | 98 | 100 | 100 | 2.1 s | 0 ms | 0 |
| Contact | 99 | 100 | 100 | 1.9 s | 0 ms | 0 |

Scores move by about 3 points between runs. Speed Index is the weakest metric (3-4 s) because the arrival intentionally shows a dark frame for about a second. SEO scores 66 in preview mode only because the site is deliberately `noindex`; built in live mode (`SITE_PREVIEW=false` with a domain and contact channel) it scores **100**.

Weight: about 520 KB on the first home visit (HTML 8 KB brotli, CSS 18 KB, fonts about 12 KB each, hero thumbnails 5-30 KB each). Images are WebP with responsive sizes, explicit dimensions and lazy loading below the fold. Fonts and the logo are WOFF2 and lossless WebP.

## Visual review

Desktop (1440px) and mobile (320, 390px) screenshots of every page were reviewed section by section during the build. Issues found and fixed from that review included a collapsed chapter grid, a missing banner image, a muddy colour seam between rooms, a scroller offset by its padding, a footer link colliding with its neighbour at 390px, and a dock that repeated its own label.

## Not verified here

- **Real devices and other browsers.** Everything above ran in headless Chromium. Safari and Firefox were not tested. Features that depend on newer browser support degrade by design (cross-document view transitions fall back to a short fade; the pinned gallery falls back to a swipeable row; the fine cursor only appears for mouse pointers), but this fallback behaviour has not been seen in those browsers.
- **Assistive technology.** No screen reader session (VoiceOver, NVDA, TalkBack) was run. Semantics, names, focus order and live regions are covered by axe and the tests only.
- **Touch gestures.** Lightbox swipe and menu touch behaviour were exercised with touch emulation, not on a phone.
- **Production hosting.** Compression and headers were mirrored locally; the `_headers` file only applies on hosts that read it.
- **Contact delivery.** WhatsApp and email links are tested for exact encoding with fixture values only. Test them with Monica's real number before launch, without sending a message by accident.

## Before launch (browser acceptance pass)

- Open 320, 390, 768, 1280 and 1440px layouts on at least one iPhone, one Android phone and one desktop; check logo legibility and no overflow.
- Open and close the menu, lightbox, FAQs and enquiry dialogs with touch, keyboard and Escape.
- Try the hair builder through all lengths and textures including query-linked preferences.
- Test the confirmed WhatsApp number on phone and desktop.
- Run a screen-reader pass and a Lighthouse run against the deployed preview.
