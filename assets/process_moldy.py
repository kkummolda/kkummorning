"""One-off asset pipeline: convert raw character/*.png (opaque white bg) into
trimmed, transparent PNGs in assets/moldy/. Not wired into the app; run manually
whenever new mascot source art is dropped into character/."""
import os
from PIL import Image

SRC_DIR = os.path.join(os.path.dirname(__file__), '..', 'character')
OUT_DIR = os.path.dirname(__file__) + '/moldy'

# suffix -> output name (matches the expression catalogue in the redesign plan)
MAPPING = {
    '': 'moldy-idle',
    '_01': 'moldy-cheer',
    '_02': 'moldy-focus',
    '_05': 'moldy-angry',
    '_07': 'moldy-shock',
    '_08': 'moldy-surprised',
    '_09': 'moldy-content',
    '_10': 'moldy-joy',
    '_11': 'moldy-sad',
    '_12': 'moldy-wink',
}

WHITE_THRESHOLD = 245
PAD = 24  # px of transparent margin to keep around the trimmed character


def process(src_path, out_path):
    import numpy as np
    im = Image.open(src_path).convert('RGBA')
    arr = np.array(im)
    is_white = (arr[:, :, 0] >= WHITE_THRESHOLD) & (arr[:, :, 1] >= WHITE_THRESHOLD) & (arr[:, :, 2] >= WHITE_THRESHOLD)
    arr[:, :, 3] = np.where(is_white, 0, 255)
    im = Image.fromarray(arr, 'RGBA')

    bbox = im.getbbox()
    if bbox:
        left, top, right, bottom = bbox
        left = max(0, left - PAD)
        top = max(0, top - PAD)
        right = min(im.width, right + PAD)
        bottom = min(im.height, bottom + PAD)
        im = im.crop((left, top, right, bottom))

    im.save(out_path)
    print(f'{os.path.basename(src_path)} -> {os.path.basename(out_path)} {im.size}')


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    base = 'KakaoTalk_20260819_184555538'
    for suffix, out_name in MAPPING.items():
        src = os.path.join(SRC_DIR, f'{base}{suffix}.png')
        if not os.path.exists(src):
            print(f'MISSING: {src}')
            continue
        process(src, os.path.join(OUT_DIR, f'{out_name}.png'))


if __name__ == '__main__':
    main()
