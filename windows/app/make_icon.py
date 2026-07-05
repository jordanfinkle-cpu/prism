"""Generate prism.ico — the site's favicon mark (dark rounded square, white
triangle) at standard Windows icon sizes. Run once; the .ico is committed."""
import os

from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
S = 256

img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.rounded_rectangle([0, 0, S - 1, S - 1], radius=S * 8 // 32, fill=(26, 26, 25, 255))
# triangle matching the favicon path: (16,9.5) (24.5,23) (7.5,23) in a 32-grid,
# drawn with a chunky rounded joint via a wide outline
pts = [(S * 16 // 32, S * 95 // 320), (S * 245 // 320, S * 23 // 32),
       (S * 75 // 320, S * 23 // 32)]
d.polygon(pts, fill=(255, 255, 255, 255))
d.line(pts + [pts[0]], fill=(255, 255, 255, 255), width=S * 3 // 32, joint="curve")

img.save(os.path.join(HERE, "prism.ico"),
         sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
print("wrote prism.ico")
