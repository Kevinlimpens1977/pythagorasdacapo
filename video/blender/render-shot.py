"""Rendert één shot zonder scherm.

  blender -b --factory-startup -P video/blender/render-shot.py -- \
    --hoofdstuk hoofdstuk-binask-eoa-1-h2 --shot opening-blokjes

Met --alleen 1,15,90 rendert hij alleen die frames, om snel te controleren.
"""
import importlib.util
import os
import sys

import bpy

HIER = os.path.dirname(os.path.abspath(__file__))
# Geen __pycache__ in de repo.
sys.dont_write_bytecode = True
sys.path.insert(0, HIER)
import renderrecept  # noqa: E402

args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def optie(naam):
    return args[args.index(naam) + 1] if naam in args else ''


hoofdstuk = optie('--hoofdstuk')
shot = optie('--shot')
if not hoofdstuk or not shot:
    raise SystemExit('Gebruik: -- --hoofdstuk <id> --shot <naam>')

spec = importlib.util.spec_from_file_location('shots', os.path.join(HIER, 'shots', f'{hoofdstuk}.py'))
shots = importlib.util.module_from_spec(spec)
spec.loader.exec_module(shots)
if shot not in shots.SHOTS:
    raise SystemExit(f'Shot {shot} bestaat niet. Kies uit: {", ".join(shots.SHOTS)}')

scene = renderrecept.leeg_scene()
formaat = shots.SHOTS[shot](scene)
renderrecept.zet_render(scene, formaat['breedte'], formaat['hoogte'], formaat['frames'])
uit = os.path.join(HIER, '..', 'public', 'hoofdstukken', hoofdstuk, 'shots', shot)
os.makedirs(uit, exist_ok=True)
alleen = [int(f) for f in optie('--alleen').split(',') if f.strip()]
if alleen:
    for nummer in alleen:
        scene.frame_set(nummer)
        scene.render.filepath = os.path.join(os.path.abspath(uit), f'{nummer:04d}')
        bpy.ops.render.render(write_still=True)
    print(f'KLAAR {shot}: frames {alleen} in {os.path.abspath(uit)}')
else:
    scene.render.filepath = os.path.join(os.path.abspath(uit), '####')
    bpy.ops.render.render(animation=True)
    print(f'KLAAR {shot}: {formaat["frames"]} frame(s) in {os.path.abspath(uit)}')
