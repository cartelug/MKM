# Asset scripts

One-off scripts that produced the generated files committed under `public/assets/` and `src/data/logo-paths.json`.
They are **not** part of `npm run build`, so the site build stays dependency-free. Re-run them only when a source
image, the logo or the fonts change.

```sh
python3 -m venv /tmp/mkm-assets && /tmp/mkm-assets/bin/pip install pillow numpy potracer fonttools brotli
/tmp/mkm-assets/bin/python scripts/assets/trace_logo.py      # src/data/logo-paths.json (vector contours of the real logo)
/tmp/mkm-assets/bin/python scripts/assets/make_images.py     # public/assets/media/*.webp and hair/*-480.webp
/tmp/mkm-assets/bin/python scripts/assets/make_icons.py      # favicon, touch/manifest icons, 480px logo copies
/tmp/mkm-assets/bin/python scripts/assets/fonts_to_woff2.py  # WOFF -> WOFF2
node scripts/assets/make_og.mjs                              # public/assets/brand/og-image.png (needs Playwright + a built dist/)
```

* `trace_logo.py` traces the alpha channel of `mkm-black.png`. The trace is used only for line-draw animations;
  the genuine PNG is the visible logo everywhere else. The trace differs from the PNG by under 1% of ink pixels.
* `make_images.py` only crops and resizes; nothing is retouched or generated.
