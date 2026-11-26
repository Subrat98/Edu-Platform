import os
from PIL import Image

BASE = os.path.dirname(__file__)
LOGO = os.path.join(BASE, '..', 'public', 'logo.png')
out_icons = os.path.join(BASE, '..', 'public', 'icons')
out_root = os.path.join(BASE, '..', 'public')
os.makedirs(out_icons, exist_ok=True)

logo = Image.open(LOGO).convert('RGBA')


def make_icon(size, bg, scale=1.0):
    """Flatten the (transparent) logo onto an opaque square background, since
    iOS/Android app icons must not be transparent."""
    canvas = Image.new('RGB', (size, size), bg)
    inner = int(size * scale)
    resized = logo.resize((inner, inner), Image.LANCZOS)
    offset = ((size - inner) // 2, (size - inner) // 2)
    canvas.paste(resized, offset, resized)
    return canvas


WHITE = (255, 255, 255)

make_icon(192, WHITE, 0.94).save(os.path.join(out_icons, 'icon-192.png'))
make_icon(512, WHITE, 0.94).save(os.path.join(out_icons, 'icon-512.png'))
# Maskable needs extra inset so Android's adaptive-icon mask doesn't clip the badge.
make_icon(512, WHITE, 0.68).save(os.path.join(out_icons, 'icon-maskable-512.png'))
make_icon(180, WHITE, 0.94).save(os.path.join(out_root, 'apple-touch-icon.png'))
make_icon(32, WHITE, 1.0).save(os.path.join(out_root, 'favicon.png'))

print('Generated icons from logo.png in', out_icons, 'and', out_root)
