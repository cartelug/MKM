"""Convert the self-hosted WOFF fonts to WOFF2 (about 30% smaller).

    python scripts/assets/fonts_to_woff2.py
"""
from pathlib import Path

from fontTools.ttLib import TTFont

FONTS = Path(__file__).resolve().parents[2] / "public/assets/fonts"

for source in sorted(FONTS.glob("font-*.woff")):
    font = TTFont(source)
    font.flavor = "woff2"
    target = source.with_suffix(".woff2")
    font.save(target)
    print(f"{target.name}: {source.stat().st_size // 1024} KB -> {target.stat().st_size // 1024} KB")
