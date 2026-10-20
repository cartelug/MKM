"""Trace the supplied MKM lettermark into vector contours.

The artwork is not redrawn: each contour is produced mechanically from the
alpha channel of the original PNG (public/assets/brand/mkm-black.png). The
vector is used only for the draw-on animations; the genuine PNG remains the
settled, visible logo everywhere else.

Run with the asset virtualenv (see scripts/assets/README.md):
    python scripts/assets/trace_logo.py
"""
import json
from pathlib import Path

import numpy as np
import potrace
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "public/assets/brand/mkm-black.png"
OUTPUT = ROOT / "src/data/logo-paths.json"
SCALE = 2  # trace at 2x so curve fitting follows the antialiased edge closely


def fmt(value: float) -> str:
    text = f"{value / SCALE:.1f}"
    return text[:-2] if text.endswith(".0") else text


def curve_to_path(curve) -> tuple[str, float, float]:
    start = curve.start_point
    parts = [f"M{fmt(start.x)} {fmt(start.y)}"]
    xs = [start.x / SCALE]
    for segment in curve.segments:
        if segment.is_corner:
            parts.append(f"L{fmt(segment.c.x)} {fmt(segment.c.y)}L{fmt(segment.end_point.x)} {fmt(segment.end_point.y)}")
            xs += [segment.c.x / SCALE, segment.end_point.x / SCALE]
        else:
            parts.append(
                f"C{fmt(segment.c1.x)} {fmt(segment.c1.y)} {fmt(segment.c2.x)} {fmt(segment.c2.y)} {fmt(segment.end_point.x)} {fmt(segment.end_point.y)}"
            )
            xs.append(segment.end_point.x / SCALE)
    return "".join(parts) + "Z", min(xs), max(xs)


def main() -> None:
    image = Image.open(SOURCE).convert("RGBA")
    width, height = image.size
    alpha = np.asarray(image)[:, :, 3]
    big = Image.fromarray(alpha).resize((width * SCALE, height * SCALE), Image.LANCZOS)
    bitmap = potrace.Bitmap(np.asarray(big) <= 127)  # potracer traces the False pixels, so invert the ink mask
    plist = bitmap.trace(turdsize=40, alphamax=1.1, opticurve=True, opttolerance=0.6)

    contours = []

    def collect(curve, depth=0):
        d, left, right = curve_to_path(curve)
        contours.append({"d": d, "left": round(left, 1), "right": round(right, 1), "hole": depth % 2 == 1})
        for child in (curve.children or []):
            collect(child, depth + 1)

    for curve in plist:
        collect(curve)
    contours.sort(key=lambda item: (item["hole"], item["left"]))

    OUTPUT.write_text(json.dumps({"width": width, "height": height, "contours": contours}, separators=(",", ":")))
    total = sum(len(c["d"]) for c in contours)
    print(f"{len(contours)} contours, {total} path characters -> {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
