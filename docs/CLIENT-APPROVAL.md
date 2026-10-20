# Monica's approval before public launch

The V2 site presents all three services (MKM Care Services, MKM Beauty, MKM Tax Return Services) using the descriptions Monica provided. It stays a private preview until each item below is confirmed. Nothing here is invented: where a detail is unknown the site says so or leaves it out.

## Brand and presentation
- Approve the House of MKM presentation: three colour rooms, the animated logo arrival, and the way the supplied lettermark is used.
- Approve Monica's welcome line: "I'm Monica. I believe every person deserves to feel supported, seen, and confident about the next step." The welcome currently uses an abstract arch composition because no portrait was supplied. **A portrait of Monica would be the single biggest upgrade**; the arch in `src/lib/sections.mjs` (`monicaWelcome`) is built to be swapped for a photograph.

## Contact and launch
- Confirm the business **WhatsApp number** (and optionally an **email**) and set them in `src/config/site.js`. Until then enquiries offer "Copy message" only.
- Confirm the **domain**, then set `siteUrl` and `previewMode: false`. This turns on canonical URLs, sitemap and the social-sharing image.
- Check the sharing card (`public/assets/brand/og-image.png`) looks right when a link is pasted into WhatsApp or Facebook.

## Wording to review
- **Care:** the "How support begins" steps, the manifest ("People first. Plain words. Practical steps. Your pace.") and the FAQ. Confirm who replies to Care enquiries. No registration, qualification or funding claims have been made; add any required ones.
- **Tax:** the three support paths (Tax return assistance, Entitlements review, Tax debt support), the "What you can expect" timeline and the FAQ. The site states plainly that no refund, outcome or timeframe is guaranteed and that it is general information, not tax or legal advice. Confirm this suits Monica's professional obligations and add any required registration details.
- **Beauty:** hair care notes, delivery and returns wording, and the category copy for skincare and home décor.

## Hair enquiry
- Confirm the nine USD length references and which products, constructions and textures they apply to.
- **Colour preference** is new in V2. It offers "No preference", "Natural black", "Dark brown" and "Another colour (describe it)" as a preference only. Confirm which colours MKM actually offers, then edit `colourOptions` in `src/order.js`.
- Approve which photograph represents which texture. Photos are labelled as style inspiration until then.
- Approve delivery locations, charges, timing, payment instructions, cancellation, returns and refunds terms (`/delivery-returns/`).

## Photography
- Replace illustrative stock (Care, skincare, home décor, tax) with approved MKM photography where possible. See `docs/PHOTO-CREDITS.md`. The tax photograph shows US-style paperwork; an Australian-context image would suit better.
- Confirm public-use rights for the supplied hair photographs.

## Privacy
- Review the privacy page and add the business's own privacy information. The site itself collects nothing: messages are built in the browser and sent or copied by the visitor.

After approval, update the central files listed in `README.md`. The design does not need to be rebuilt.
