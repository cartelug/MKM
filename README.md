# MKM Services

A complete, fifteen-page website for MKM Care Services, MKM Beauty and MKM Tax Return Services, using the client's approved MKM lettermark, real photographs, and exact USD length-price references. Built with semantic HTML, CSS and small JavaScript modules; no third-party runtime dependencies.

## Run

Requires Node 20+ and Python 3 for the source checks. No package installation is required.

```sh
npm run build
npm test
npm start
```

Open `http://localhost:4173`. Build output is in `dist/`, ready for static hosting that supports directory index pages. The source uses root-relative URLs, so deploy at the domain root rather than a GitHub Pages repository subpath.

## Pages

`/`, `/care/`, `/beauty/`, `/tax/`, `/beauty/skincare/`, `/beauty/home-decor/`, `/beauty/hair/`, `/shop/`, `/shop/hair-enquiry/`, `/textures/`, `/about/`, `/hair-care/`, `/delivery-returns/`, `/contact/`, `/privacy/`. Each route has its own HTML, title and description. Includes a custom 404.

## Connect WhatsApp

1. Edit `src/config/site.js`.
2. Set `whatsappNumber` to Monica's confirmed number with country code, digits only (no `+`, spaces or punctuation).
3. Run `npm run check` and deploy the new `dist/`.

With an empty or invalid number, the action opens a fully working preview with the selected details and a copyable message. A valid number switches the label and opens WhatsApp with an encoded draft. The visitor must send it. The website never sends messages or takes payment.

## Change content without redesigning

| File | What to edit |
| --- | --- |
| `src/config/site.js` | WhatsApp, preview mode, logo paths and shared brand settings |
| `src/data/hair.js` | Single runtime price list, texture labels, photo mapping, descriptions and gallery |
| `src/data/client-source.json` | Original supplied data retained for comparison |
| `src/templates.mjs` | Hair pages, policy wording, global navigation and footer |
| `src/service-pages.mjs` | Home, Care, Beauty, Tax, skincare, décor, About and Contact |
| `src/data/services.js` | Service descriptions, enquiry topics and message composition |
| `src/group.css` | Umbrella identity, division colours and redesigned layouts |
| `src/styles.css` | Design tokens, typography, desktop and mobile layouts |
| `public/assets/` | Real media, exact logo variants and self-hosted fonts |

After prices are approved or revised, update the runtime data and corresponding client source so the comparison test documents the new agreed references. Product photos are intentionally described as inspiration until Monica approves associations.

## Approval before public launch

See `docs/CLIENT-APPROVAL.md`. Keep the preview private. Once all details are approved, update the relevant content and set `previewMode: false`; rebuild to remove the client-preview label and search-engine block. This setting does not change hosting access or make a site public by itself.

## Verification

`npm test` checks all 540 combinations of nine lengths, six textures and quantities 1–10, original data agreement, WhatsApp number validation and exact message encoding. Service-topic message tests also cover all three divisions and bounded optional notes. It also checks every generated route, fragment, image, local asset, page title, main heading and duplicate ID.

Browser and assistive-technology testing remains necessary before public launch. See `docs/QA.md` for completed checks and the environment limitations.

## Media and fonts

Client hair images are copied unchanged from the supplied kit. The four real editorial stock photographs have responsive WebP derivatives; see `docs/PHOTO-CREDITS.md`. Confirm their public-use rights before launch. The original lettermark proportions are preserved. Fonts are self-hosted Cormorant Garamond and DM Sans, with Georgia/Arial fallbacks and license notices in `public/assets/fonts/`.

Service enquiries use a topic selector and optional browser-local message. No data is submitted to a backend; the visitor previews or copies the message. The Care link leads to the official client-supplied website.

No accounts, analytics, tracking cookies, payment processor, order database or invented contact details are included. Deployment-specific access and hosting settings are in `.openai/hosting.json`.
