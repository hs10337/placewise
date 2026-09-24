"""Assemble the editable scene into a standalone preview and an inline fragment."""
from pathlib import Path
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--fragment', type=Path)
args = parser.parse_args()
folder = Path(__file__).resolve().parent
fragment = (folder / 'viewer.html').read_text()
fragment = fragment.replace('/* BILLBOARD_TEXTURES */', (folder / 'billboards.js').read_text())
fragment = fragment.replace('/* SCENE_CODE */', (folder / 'scene.js').read_text())
preview = (folder / 'preview-shell.html').read_text().replace('<!-- TIMES_SQUARE_FRAGMENT -->', fragment)
(folder / 'model.html').write_text(preview)
if args.fragment:
    args.fragment.write_text(fragment)
print(f'Built {folder / "model.html"}')
