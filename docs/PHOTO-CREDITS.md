# Photography

The hair photographs and the MKM lettermark come from the client's supplied handoff. Their public-use approval and the exact photo-to-product mapping remain with Monica.

## Editorial stock (illustration only)

These are used as visual illustration, not as MKM staff, clients or confirmed merchandise. Source files are kept in `public/assets/editorial/`.

| Asset | Source |
| --- | --- |
| `editorial/care.webp` | Zachary Kyra-Derksen, "Woman riding wheelchair near trees", Unsplash: https://unsplash.com/photos/0bDd5rZlZmk |
| `editorial/skincare.webp` | Unsplash image source: https://images.unsplash.com/photo-1608571423902-eed4a5ad8108 |
| `editorial/home-decor.webp` | Unsplash image source: https://images.unsplash.com/photo-1600607687920-4e2a09cf159d |
| `editorial/tax.webp` | Unsplash image source: https://images.unsplash.com/photo-1554224155-6726b3ff858f |

The Care source page states free use under the Unsplash License. Review media use and replace illustrative stock with approved MKM assets when finalising. The tax photograph contains US-style forms; the V2 crop keeps the calculator and pen and avoids the flag graphic, but an Australian-context photograph is recommended.

## V2 crops and derivatives

`public/assets/media/` holds art-directed crops and responsive WebP sizes of the photographs above (portrait, face and torso, forest, calculator, six hair textures), plus small hero thumbnails (`thumbs/`) and texture swatches (`swatch/`). They are produced by `scripts/assets/make_images.py`, which **only crops and resizes**. Nothing is generated, retouched or recoloured. Full uncropped hair photographs (`hair/07` to `hair/13`, with `-480` and `-640` sizes) are what the lightbox and the hair builder show.

Hair collages `hair/00`, `01`, `02`, `04`, `05`, `06`, `14` to `17` carry text labels, faces or watermarks and are not used by the V2 design. They are retained in the repository from the supplied kit.

No generated people or generated product photographs are used.

Official Care website supplied by the client: https://www.mkmcareservices.com.au/
