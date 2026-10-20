# MKM Services · V2 "The House of MKM"

A premium, editorial website for **MKM Care Services**, **MKM Beauty** and **MKM Tax Return Services**, with Monica as the warm, founder-led face. It uses the client's approved lettermark, real photography and the exact USD length-price references. Built with semantic HTML, one stylesheet and small ES modules. No runtime dependencies, no tracking.

Each division is its own colour "room" (Care moss, Beauty oxblood, Tax ink blue) inside one shared grid, type system and level of craft.

## Run

Requires Node 20+ and Python 3 (for the source checks). No package installation is needed.

```sh
npm run build   # writes dist/
npm test        # node tests + dist integrity check
npm start       # preview at http://localhost:4173 (gzip/brotli, real 404s, cache headers)
npm run check   # build + test
npm run publish:root   # build, then copy the site into the repository root (see Hosting)
npm run test:e2e   # optional browser tests (needs Playwright, see below)
```

## Hosting

The built site is committed in two places that always match:

* **`dist/`** is the build output (used by `.openai/hosting.json`).
* **The repository root** (`index.html`, `assets/`, `care/`, `beauty/`, ...) is the same site, so a host that serves the repo root, such as GitHub Pages with "Deploy from a branch: main / (root)", finds `index.html` there. `.nojekyll` makes it serve files exactly as they are.

After any change, run `npm run publish:root` (it builds, refreshes `dist/` and the root copy, and records what it published in `.root-publish.json`), then commit. A test fails if the root copy and `dist/` drift apart.

All URLs in the pages are document-relative, so the site works at a domain root and in a sub-folder such as `https://user.github.io/MKM/`. The one exception is `404.html`, which hosts serve for URLs at any depth, so it uses root-relative URLs and is only fully styled when the site sits at a domain root. To preview a sub-folder deployment locally: `MKM_PREFIX=/MKM npm start` and open `http://localhost:4173/MKM/`.

## Pages

`/`, `/care/`, `/beauty/`, `/tax/`, `/beauty/hair/`, `/beauty/skincare/`, `/beauty/home-decor/`, `/shop/`, `/shop/hair-enquiry/`, `/textures/`, `/hair-care/`, `/delivery-returns/`, `/about/`, `/contact/`, `/privacy/`, plus a custom 404. Every route has its own title, description, social tags, canonical URL (once the domain is set) and structured data.

## Source layout

| Path | What lives there |
| --- | --- |
| `src/config/site.js` | Public settings: preview mode, domain, WhatsApp number, email, Care website, descriptions |
| `src/config/runtime.mjs` | Node-only view of those settings, with deploy-time environment overrides |
| `src/data/hair.js` | The single price list, texture labels, photo mapping and art-directed crops |
| `src/data/services.js` | Services, topics, smart call-to-action copy, enquiry message composition |
| `src/order.js` | Hair enquiry maths and messages, WhatsApp and email link builders |
| `src/data/logo-paths.json` | Vector trace of the real lettermark (for line-draw moments only) |
| `src/lib/` | `layout.mjs` (document shell, header, menu, dock, footer, preloader), `sections.mjs` (shared editorial sections), `html.mjs` (helpers, image sets) |
| `src/pages/` | One file per area: `home`, `care`, `beauty`, `tax`, `contact`, `about`, `hair`, `legal`; `index.mjs` is the route table |
| `src/styles/` | Ordered CSS: tokens, chrome, components, home, pages, motion. Concatenated and minified into `assets/site.css` |
| `src/scripts/` | ES modules: `main.js` entry, `motion.js`, `header.js`, `preloader.js`, plus lazily loaded features (`contact`, `hair`, `lightbox`, `hscroll`, ...) |
| `public/assets/` | Brand marks, photography, responsive derivatives, fonts |
| `scripts/publish-root.mjs` | Builds and copies the site into the repository root |
| `scripts/assets/` | One-off Python/Node scripts that produced the generated assets (see its README) |

To change copy, edit the page file. To change colours, type or spacing, edit `src/styles/00-tokens.css`.

## Connect real contact channels

Edit `src/config/site.js` (or set environment variables at deploy time) and rebuild:

| Setting | Effect |
| --- | --- |
| `whatsappNumber` | Digits only with country code, no `+` (for example `61400000000`). Shows "Send on WhatsApp" in every enquiry confirmation |
| `contactEmail` | Shows "Send by email" with the message prefilled |

With neither set, confirmations offer **Copy message** only, and say so honestly. The website never sends anything itself: the visitor reviews the message and sends or copies it. No invented phone numbers, addresses or payment badges exist anywhere.

## Going public

The site is a private **client preview**: `previewMode: true` adds `noindex`, blocks crawlers in `robots.txt` and shows a small preview label. To launch:

1. Set `siteUrl` (final origin, for example `https://www.example.com`), a contact channel, and `previewMode: false`.
2. Run `npm run check`. The build refuses to go public without a domain and a real contact channel. Going public also switches on canonical URLs, `sitemap.xml`, the sitemap line in `robots.txt` and absolute social-image URLs.
3. Work through `docs/CLIENT-APPROVAL.md`.

The same can be done without editing files: `SITE_URL=https://www.example.com SITE_PREVIEW=false WHATSAPP_NUMBER=... npm run build`.

## Motion, performance and accessibility

* **Arrival (logo pre-loader):** about 1.2 seconds, once per browser session. Hairline strokes trace the real lettermark, a light sweep and three soft colour pulses pass through it, then the genuine logo settles and the page wipes upward. Click or any key skips it. It finishes by CSS alone if scripting fails, and under `prefers-reduced-motion` it becomes a brief static splash.
* **Motion language:** only transform and opacity are animated, with refined easing, 2-4px depth, 3-6% image drift, word-by-word headings, curtain image reveals, a pinned horizontal hair gallery, magnetic buttons, a fine cursor and cross-document page transitions. Everything sits behind `prefers-reduced-motion`; low-power or data-saver devices drop the heavier effects.
* **Accessibility:** skip link, landmarks, one H1 per page, labelled forms with live-region errors, visible focus, 44px tap targets, keyboard-operable menus, accordions, scrollers and lightbox, focus restored after dialogs, inert background while the menu is open. axe-core reports no WCAG 2.2 AA violations on any route (see `docs/QA.md`).
* **Security:** strict Content-Security-Policy in `_headers` (`script-src 'self'` plus the hash of one tiny inline bootstrap script, no inline styles).

## Verification

`npm test` runs 33 Node tests and the integrity check:

* all 540 hair combinations, original data agreement, WhatsApp and email link encoding, colour preference messages;
* every service, topic and general enquiry message, including bounds and cleaning;
* a full build in preview and live mode (noindex, canonical, sitemap, robots, manifest, social image, unique titles and descriptions, JSON-LD, CSP hash, no inline styles, no invented claims, the official Care website kept exactly);
* the motion rules (every hidden start state sits behind a reduced-motion guard, arrival length and skip, transform and opacity only);
* every route, fragment, ARIA reference, image, script and stylesheet in `dist/`.

`npm run test:e2e` drives a real browser through the contact concierge, WhatsApp mode, hair builder (including deep links), lightbox, tax quick enquiry, shop filter, accordions, scroller, dock, mobile menu, arrival and reduced motion, and checks every route from 320 to 1440px for overflow. Playwright is optional and not a dependency: `npm i -D playwright && npx playwright install chromium`, or set `PLAYWRIGHT_MODULE`. Without it the tests skip.

## Media and fonts

Client hair images and the lettermark come from the supplied kit and are only cropped and resized (`scripts/assets/`). Full uncropped photographs open in the lightbox. Four editorial stock photographs are used as illustration (`docs/PHOTO-CREDITS.md`); confirm public-use rights and replace them with approved MKM photography when available. Fonts are self-hosted Cormorant Garamond and DM Sans (WOFF2, licences alongside). The logo trace is mechanical (under 1% pixel difference from the supplied PNG) and is never shown as the logo itself.

No accounts, analytics, tracking cookies, payment processor, order database or invented contact details are included. Deployment settings are in `.openai/hosting.json`.
