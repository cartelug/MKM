"""Favicon, touch icon and web-manifest icons built from the supplied lettermark.

The lettermark is only scaled and placed (never redrawn or recoloured beyond the
supplied black/white variants). Icons use MKM Ink with the white mark.

    python scripts/assets/make_icons.py
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
BRAND = ROOT / "public/assets/brand"
INK = (23, 22, 20, 255)
PAPER = (245, 240, 232, 255)


def icon(size: int, fill: float, background=INK, logo="mkm-white.png", radius: float = 0) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), background)
    mark = Image.open(BRAND / logo).convert("RGBA")
    width = round(size * fill)
    mark = mark.resize((width, round(mark.height * width / mark.width)), Image.LANCZOS)
    canvas.alpha_composite(mark, ((size - mark.width) // 2, (size - mark.height) // 2))
    return canvas


def main() -> None:
    outputs = {
        "favicon-32.png": icon(32, 0.84),
        "favicon-light-32.png": icon(32, 0.84, PAPER, "mkm-black.png"),
        "apple-touch-icon.png": icon(180, 0.74),
        "icon-192.png": icon(192, 0.74),
        "icon-512.png": icon(512, 0.74),
        "icon-maskable-512.png": icon(512, 0.56),  # inside the maskable safe zone
    }
    for name, image in outputs.items():
        path = BRAND / name
        image.convert("RGBA").save(path, optimize=True)
        print(f"  {path.relative_to(ROOT)} {path.stat().st_size // 1024 or '<1'} KB")
    outputs["favicon-32.png"].convert("RGBA").save(BRAND / "favicon.ico", sizes=[(32, 32)])
    # Smaller copies of the genuine lettermark for the header and footer (resized only).
    for name in ("mkm-black", "mkm-white"):
        mark = Image.open(BRAND / f"{name}.png").convert("RGBA")
        small = mark.resize((480, round(mark.height * 480 / mark.width)), Image.LANCZOS)
        small.save(BRAND / f"{name}-480.png", optimize=True)
        print(f"  assets/brand/{name}-480.png {(BRAND / f'{name}-480.png').stat().st_size // 1024} KB")
    # Lossless WebP copies of the same artwork for on-page use (identical pixels, smaller files).
    for name in ("mkm-black", "mkm-white", "mkm-black-480", "mkm-white-480"):
        Image.open(BRAND / f"{name}.png").convert("RGBA").save(BRAND / f"{name}.webp", "WEBP", lossless=True, quality=100, method=6)


if __name__ == "__main__":
    main()
