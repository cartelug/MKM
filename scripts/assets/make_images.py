"""Art-directed crops and responsive WebP derivatives for the V2 design.

Sources are the supplied hair photographs and the four licensed editorial
photographs already in public/assets. Crops only select and resize; nothing is
generated, retouched or recoloured. Full uncropped hair images remain in
public/assets/hair/ for the enlarged lightbox view.

    python scripts/assets/make_images.py
"""
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "public/assets"
OUT = ASSETS / "media"

# name: (source, (left, top, right, bottom) in source pixels, widths to export)
CROPS = {
    "care-portrait": ("editorial/care.webp", (150, 540, 1250, 2007), (480, 640, 800, 1100)),
    "care-gaze": ("editorial/care.webp", (460, 548, 1020, 1248), (480, 560)),
    "care-forest": ("editorial/care.webp", (0, 0, 1400, 540), (800, 1400)),
    "tax-calc": ("editorial/tax.webp", (585, 242, 967, 719), (382,)),
    "tax-desk": ("editorial/tax.webp", (153, 255, 917, 713), (480, 764)),
    "hair-wavy": ("hair/07-defined-wave-side.webp", (270, 190, 700, 728), (430,)),
    "hair-water-wave": ("hair/08-wet-look-curl.webp", (110, 50, 690, 775), (480, 580)),
    "hair-straight": ("hair/09-silky-straight-back.webp", (180, 80, 580, 580), (400,)),
    "hair-body-wave": ("hair/10-soft-body-wave-back.webp", (270, 100, 650, 575), (380,)),
    "hair-kinky-curly": ("hair/11-curly-texture-back.webp", (250, 80, 710, 655), (460,)),
    "hair-tight-curl": ("hair/12-tight-curl-texture.webp", (160, 100, 720, 800), (480, 560)),
    "hair-kinky-straight": ("hair/13-sleek-lace-straight.webp", (120, 140, 660, 815), (480, 540)),
}

# 480px / 810px responsive pair of the uncropped hair photographs (enquiry builder, lightbox)
FULL_HAIR = [
    "07-defined-wave-side", "08-wet-look-curl", "09-silky-straight-back", "10-soft-body-wave-back",
    "11-curly-texture-back", "12-tight-curl-texture", "13-sleek-lace-straight",
]


# Small 4:5 frames for the home hero contact sheet: name -> (source, horizontal focus, vertical focus)
THUMBS = {
    "care-portrait": ("media/care-portrait.webp", 0.5, 0.35),
    "hair-body-wave": ("media/hair-body-wave.webp", 0.5, 0.5),
    "tax-calc": ("media/tax-calc.webp", 0.5, 0.5),
    "hair-tight-curl": ("media/hair-tight-curl.webp", 0.5, 0.4),
    "hair-straight": ("media/hair-straight.webp", 0.5, 0.5),
    "skincare": ("editorial/skincare.webp", 0.5, 0.45),
    "care-gaze": ("media/care-gaze.webp", 0.5, 0.4),
    "hair-water-wave": ("media/hair-water-wave.webp", 0.5, 0.5),
    "decor": ("editorial/home-decor.webp", 0.3, 0.5),
    "hair-kinky-curly": ("media/hair-kinky-curly.webp", 0.5, 0.5),
    "hair-wavy": ("media/hair-wavy.webp", 0.5, 0.5),
    "hair-kinky-straight": ("media/hair-kinky-straight.webp", 0.5, 0.45),
}


def save(image: Image.Image, path: Path, quality: int = 82) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "WEBP", quality=quality, method=6)
    print(f"  {path.relative_to(ROOT)}  {image.width}x{image.height}  {path.stat().st_size // 1024} KB")


def main() -> None:
    for name, (source, box, widths) in CROPS.items():
        with Image.open(ASSETS / source) as src:
            crop = src.convert("RGB").crop(box)
        for width in widths:
            scaled = crop if width >= crop.width else crop.resize((width, round(crop.height * width / crop.width)), Image.LANCZOS)
            suffix = "" if width == widths[-1] else f"-{width}"
            save(scaled, OUT / f"{name}{suffix}.webp")
    for stem in FULL_HAIR:
        with Image.open(ASSETS / "hair" / f"{stem}.webp") as src:
            small = src.convert("RGB").resize((480, round(src.height * 480 / src.width)), Image.LANCZOS)
        save(small, ASSETS / "hair" / f"{stem}-480.webp", 80)
        with Image.open(ASSETS / "hair" / f"{stem}.webp") as src:
            mid = src.convert("RGB").resize((640, round(src.height * 640 / src.width)), Image.LANCZOS)
        save(mid, ASSETS / "hair" / f"{stem}-640.webp", 74)
    for name, (source, fx, fy) in THUMBS.items():
        with Image.open(ASSETS / source) as src:
            thumb = ImageOps.fit(src.convert("RGB"), (360, 450), Image.LANCZOS, centering=(fx, fy))
        save(thumb, OUT / "thumbs" / f"{name}.webp", 66)
    # Tiny swatches for the six texture pickers
    for name in ("hair-straight", "hair-body-wave", "hair-kinky-straight", "hair-water-wave", "hair-kinky-curly", "hair-wavy"):
        with Image.open(OUT / "thumbs" / f"{name}.webp") as src:
            save(src.convert("RGB").resize((120, 150), Image.LANCZOS), OUT / "swatch" / f"{name}.webp", 62)


if __name__ == "__main__":
    main()
