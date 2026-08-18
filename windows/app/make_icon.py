"""Regenerate prism.ico from prism-icon-256.png — the chevron-asterisk mark in
Ink on a white rounded tile (the committed master, rendered from the brand
mark SVG). Run once after the master changes; the .ico is committed."""
import os

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SIZES = [16, 24, 32, 48, 64, 128, 256]

master = Image.open(os.path.join(HERE, "prism-icon-256.png")).convert("RGBA")
imgs = [master.resize((s, s), Image.LANCZOS) for s in SIZES[:-1]] + [master]

imgs[-1].save(os.path.join(HERE, "prism.ico"),
              sizes=[(s, s) for s in SIZES], append_images=imgs[:-1])
print("wrote prism.ico")
