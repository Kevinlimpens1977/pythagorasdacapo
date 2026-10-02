"""Shots voor Binask H2. Elke functie bouwt een scène en geeft het formaat terug."""
import math

import bpy
from bouw_lab import ZAK, blokje, doos, labtafel, maatcilinder, pak_rijst, steen, volume, weegschaal
from renderrecept import licht_en_camera

PANEEL = (1240, 1320)
BREED = (1728, 660)
# Beide blokjes en dozen staan even schuin, zodat je drie vlakken ziet. Het
# grote vlak naar links kijkt naar het licht; de schaduwband valt op de smalle kant.
DRAAI = -28


def _standpunt(doel, afstand, graden):
    """Camerapositie recht voor het doel, graden boven de horizon."""
    hoek = math.radians(graden)
    return (doel[0], doel[1] - afstand * math.cos(hoek), doel[2] + afstand * math.sin(hoek))


def _curven(obj):
    """Animatiecurven van een object. Blender 5 bewaart ze per slot in een
    channelbag; action.fcurves bestaat daar niet meer."""
    actie = obj.animation_data.action
    if hasattr(actie, 'fcurves'):
        return list(actie.fcurves)
    from bpy_extras import anim_utils
    return list(anim_utils.action_get_channelbag_for_slot(actie, obj.animation_data.action_slot).fcurves)


def opening_blokjes(scene):
    labtafel(7.0, 2.2)
    # Links van het midden: rechts onder komt Sami groot in beeld.
    blokje('aluminium', '#C9CED6', -0.78, draai=DRAAI)
    blokje('ijzer', '#5D6168', 0.02, draai=DRAAI)
    doel = (0, 0, 0.26)
    licht_en_camera(_standpunt(doel, 5.6, 15), doel, lens=65)
    return {'breedte': BREED[0], 'hoogte': BREED[1], 'frames': 1}


def massa_rijst(scene):
    labtafel(3.0, 3.2)
    romp = weegschaal(0)
    pak_rijst(0, y=0.03, z=romp['bovenkant'], draai=-18)
    doel = (0, 0, 0.32)
    licht_en_camera(_standpunt(doel, 2.6, 20), doel, lens=70)
    return {'breedte': PANEEL[0], 'hoogte': PANEEL[1], 'frames': 1}


def volume_dozen(scene):
    labtafel(3.4, 3.2)
    doos('grote-doos', -0.3, 0.7, draai=DRAAI)
    doos('kleine-doos', 0.5, 0.3, y=-0.12, draai=DRAAI)
    doel = (-0.05, 0, 0.36)
    licht_en_camera(_standpunt(doel, 4.0, 20), doel, lens=70)
    return {'breedte': PANEEL[0], 'hoogte': PANEEL[1], 'frames': 1}


def onderdompel_steen(scene):
    labtafel(3.0, 3.2)
    onderdelen = maatcilinder(0)
    water = onderdelen['water']
    stuk = steen((0, 0, 2.0), straal=0.136)
    # Natuurkundig kloppend: het water stijgt precies met de inhoud van de
    # steen. Bij de start staat het water al boven de steen, zodat hij
    # helemaal onder water ligt zodra hij landt.
    inhoud = volume(stuk)
    stijging = inhoud / (math.pi * onderdelen['straal_water'] ** 2)
    begin = stuk['hoogte'] + 0.06
    rust = onderdelen['bodem'] + 0.012 * ZAK - stuk['onderkant']
    print(f'STEEN inhoud {inhoud:.5f}, hoogte {stuk["hoogte"]:.3f}, breedte {stuk["breedte"]:.3f}'
          f' (water {onderdelen["straal_water"]:.3f}), water {begin:.3f} -> {begin + stijging:.3f}')
    if stuk['breedte'] > onderdelen['straal_water']:
        raise SystemExit('De steen past niet in de maatcilinder.')
    # Zelfde tempo als de getekende maatcilinder in Remotion: de steen valt in
    # 14 frames (versnellend), het water stijgt van frame 13 tot 58.
    stuk.location = (0, 0, onderdelen['rand'] + 0.09 - stuk['onderkant'])
    stuk.keyframe_insert('location', frame=1)
    stuk.location = (0, 0, rust)
    stuk.keyframe_insert('location', frame=15)
    for sleutel in _curven(stuk):
        for punt in sleutel.keyframe_points:
            punt.interpolation = 'QUAD'
            punt.easing = 'EASE_IN'
    water.scale = (1, 1, begin)
    water.keyframe_insert('scale', frame=13)
    water.scale = (1, 1, begin + stijging)
    water.keyframe_insert('scale', frame=58)
    doel = (0, 0, 0.55)
    licht_en_camera(_standpunt(doel, 2.95, 14), doel, lens=70)
    return {'breedte': PANEEL[0], 'hoogte': PANEEL[1], 'frames': 90}


def dichtheid_weegschalen(scene):
    labtafel(3.4, 3.2)
    links = weegschaal(-0.36, breedte=0.62)
    rechts = weegschaal(0.36, breedte=0.62)
    # Even grote blokjes: allebei 10 cm³. Symmetrisch voor de camera, zodat
    # het perspectief geen van beide groter maakt.
    blokje('aluminium', '#C9CED6', -0.36, y=0.03, grootte=0.3, z=links['bovenkant'], draai=DRAAI)
    blokje('ijzer', '#5D6168', 0.36, y=0.03, grootte=0.3, z=rechts['bovenkant'], draai=DRAAI)
    doel = (0, 0, 0.24)
    licht_en_camera(_standpunt(doel, 3.6, 28), doel, lens=70)
    return {'breedte': PANEEL[0], 'hoogte': PANEEL[1], 'frames': 1}


SHOTS = {
    'opening-blokjes': opening_blokjes,
    'massa-rijst': massa_rijst,
    'volume-dozen': volume_dozen,
    'onderdompel-steen': onderdompel_steen,
    'dichtheid-weegschalen': dichtheid_weegschalen,
}
