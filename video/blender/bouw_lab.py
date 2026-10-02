"""De vaste labspullen voor HELIX-explainers, als code. Een nieuw voorwerp
voeg je hier toe en gebruik je daarna in elk hoofdstuk opnieuw. Geen tekst,
geen getallen en geen schaalverdeling op een voorwerp.

Een voorwerp dat ergens op staat, staat 1,05 x contour hoger dan het
oppervlak. De onderkant van de zwarte schil zweeft dan net boven het oppervlak
en vult de spleet: zo krijgt elk voorwerp een contactlijn met de tafel. Bij
precies 1,0 vechten schil en oppervlak om dezelfde pixels; onder 1,0 zakt de
schil weg in het tafelblad en verdwijnt de lijn."""
import math

import bmesh
import bpy
from renderrecept import geef_materiaal, tekenlijn, toon_materiaal, vlak_materiaal

CONTOUR = 0.016
ZAK = 1.05


def _maak(primitief, naam, locatie, schaal=(1, 1, 1), **opties):
    primitief(location=locatie, **opties)
    obj = bpy.context.active_object
    obj.name = naam
    obj.scale = schaal
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return obj


def _glad(obj, hoek=40):
    """Gladde schaduw, maar scherpe randen blijven scherp."""
    if hasattr(obj.data, 'shade_smooth'):
        obj.data.shade_smooth()
    else:
        for vlak in obj.data.polygons:
            vlak.use_smooth = True
    if hasattr(obj.data, 'set_sharp_from_angle'):
        obj.data.set_sharp_from_angle(angle=math.radians(hoek))


def _afronden(obj, breedte, segmenten=2):
    """Afgeronde randen. Met harden_normals en gladde schaduw blijven de
    vlakken vlak en loopt de rand netjes rond; zonder gaf de hoek een donker
    puntje in een andere lichtband."""
    afronding = obj.modifiers.new('afronding', 'BEVEL')
    afronding.width = breedte
    afronding.segments = segmenten
    afronding.limit_method = 'ANGLE'
    afronding.harden_normals = True
    if hasattr(obj.data, 'shade_smooth'):
        obj.data.shade_smooth()
    return afronding


def _halve_schijf(naam, midden, straal, platheid, onder_helft=True, dikte=0.004):
    """Halve ellips als plaatje op een voorkant (kijkt naar -y)."""
    mesh = bpy.data.meshes.new(naam)
    bm = bmesh.new()
    stappen = 24
    hoeken = [math.pi + math.pi * i / stappen for i in range(stappen + 1)] if onder_helft \
        else [math.pi * i / stappen for i in range(stappen + 1)]
    punten = [bm.verts.new((straal * math.cos(a), 0.0, straal * platheid * math.sin(a))) for a in hoeken]
    vlak = bm.faces.new(punten)
    vlak.normal_update()
    if vlak.normal.y > 0:
        bmesh.ops.reverse_faces(bm, faces=[vlak])
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(naam, mesh)
    obj.location = midden
    bpy.context.scene.collection.objects.link(obj)
    dik = obj.modifiers.new('dikte', 'SOLIDIFY')
    dik.thickness = dikte
    return obj


def _markeer_bovenrand(obj):
    """Markeer de randen van het bovenvlak voor een Freestyle-lijn."""
    mesh = obj.data
    hoogste = max(v.co.z for v in mesh.vertices)
    boven = [all(abs(mesh.vertices[i].co.z - hoogste) < 1e-4 for i in rand.vertices) for rand in mesh.edges]
    if mesh.edges and hasattr(mesh.edges[0], 'use_freestyle_mark'):
        for rand, markeer in zip(mesh.edges, boven):
            rand.use_freestyle_mark = markeer
    else:
        attribuut = mesh.attributes.get('freestyle_edge') or mesh.attributes.new('freestyle_edge', 'BOOLEAN', 'EDGE')
        attribuut.data.foreach_set('value', boven)


def volume(obj):
    """Inhoud van de vorm zonder contourschil (in Blender-eenheden kubiek)."""
    schil = obj.modifiers.get('contour')
    if schil:
        schil.show_viewport = False
    bpy.context.view_layer.update()
    diepte = bpy.context.evaluated_depsgraph_get()
    vorm = obj.evaluated_get(diepte).to_mesh()
    bm = bmesh.new()
    bm.from_mesh(vorm)
    inhoud = abs(bm.calc_volume())
    # Hoogte en onderkant in de stand van het object (met zijn draaiing).
    draai = obj.matrix_world.to_3x3()
    punten = [draai @ v.co for v in bm.verts]
    hoogtes = [p.z for p in punten]
    hoogte = max(hoogtes) - min(hoogtes)
    onder = min(hoogtes)
    obj['breedte'] = max((p.x ** 2 + p.y ** 2) ** 0.5 for p in punten) + (schil.thickness if schil else 0)
    bm.free()
    obj.evaluated_get(diepte).to_mesh_clear()
    if schil:
        schil.show_viewport = True
    bpy.context.view_layer.update()
    obj['hoogte'] = hoogte
    obj['onderkant'] = onder
    return inhoud


def labtafel(breedte=3.4, diepte=1.6):
    blad = _maak(bpy.ops.mesh.primitive_cube_add, 'labtafel', (0, 0, -0.05), (breedte / 2, diepte / 2, 0.05))
    geef_materiaal(blad, toon_materiaal('hout', '#BC8A5F', zacht=True, nerf=True), contour=0.012)
    return blad


def blokje(naam, hexkleur, x, y=0.0, grootte=0.42, z=0.0, draai=0.0, contour=CONTOUR):
    obj = _maak(bpy.ops.mesh.primitive_cube_add, naam, (x, y, z + contour * ZAK + grootte / 2), (grootte / 2, grootte / 2, grootte / 2))
    obj.rotation_euler.z = math.radians(draai)
    _afronden(obj, 0.02, 2)
    geef_materiaal(obj, toon_materiaal(f'{naam}-materiaal', hexkleur), contour=contour)
    return obj


def maatcilinder(x=0.0, hoogte=0.72, straal=0.2, waterhoogte=0.3, contour=0.012):
    """Maatcilinder zonder streepjes: de schaal tekent Remotion. Geeft ook de
    bodemhoogte en de straal van het water terug, om een stijging te rekenen."""
    voet_hoogte = 0.06
    voet = _maak(bpy.ops.mesh.primitive_cylinder_add, 'cilindervoet', (x, 0, contour * ZAK + voet_hoogte / 2), (1, 1, 1),
                 vertices=6, radius=straal * 1.75, depth=voet_hoogte)
    _afronden(voet, 0.01, 2)
    geef_materiaal(voet, toon_materiaal('donker', '#2E3238'), contour=contour)
    onder = contour * ZAK + voet_hoogte
    wand = 0.012
    glas = _maak(bpy.ops.mesh.primitive_cylinder_add, 'cilinderglas', (x, 0, onder + hoogte / 2), (1, 1, 1),
                 vertices=64, radius=straal, depth=hoogte)
    bm = bmesh.new()
    bm.from_mesh(glas.data)
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.normal.z > 0.5], context='FACES')
    bm.to_mesh(glas.data)
    bm.free()
    dikte = glas.modifiers.new('wand', 'SOLIDIFY')
    dikte.thickness = wand
    dikte.offset = -1.0
    dikte.use_even_offset = True
    _glad(glas)
    # Glas zonder cel-shading: de lichtbanden gaven vage driehoeken.
    # Alleen voorvlakken en heel licht: mengen gebeurt lineair, dus 13 % wit
    # over een zwarte lijn oogt al als 40 % grijs. Het glas leest vooral via
    # de lijnen en de glansstrepen.
    glasmateriaal = vlak_materiaal('glas', '#F4FBFC', alpha=0.05)
    glasmateriaal.use_backface_culling = True
    geef_materiaal(glas, glasmateriaal, contour=0)
    tekenlijn(glas, 'glas')
    # Twee glansstrepen linksvoor, zodat je ziet dat het glas is.
    for nummer, (hoek, breedte) in enumerate(((236, 0.026), (251, 0.011))):
        a = math.radians(hoek)
        streep = _maak(bpy.ops.mesh.primitive_cube_add, f'glans-{nummer}',
                       (x + (straal + 0.004) * math.cos(a), (straal + 0.004) * math.sin(a), onder + hoogte * 0.52),
                       (breedte / 2, 0.002, hoogte * 0.34))
        streep.rotation_euler.z = a + math.pi / 2
        geef_materiaal(streep, vlak_materiaal('glans', '#FFFFFF', alpha=0.75), contour=0)
    bodem = onder + wand
    straal_water = straal - wand - 0.003
    bpy.context.scene.cursor.location = (x, 0, bodem)
    water = _maak(bpy.ops.mesh.primitive_cylinder_add, 'water', (x, 0, bodem + 0.5), (1, 1, 1),
                  vertices=64, radius=straal_water, depth=1.0)
    bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
    _markeer_bovenrand(water)
    _glad(water)
    water.scale = (1, 1, waterhoogte)
    # Water egaal blauw, het oppervlak lichter. Met cel-shading werd het grijs.
    # Het water filtert wat erachter ligt, zodat de steen erin goed zichtbaar blijft.
    geef_materiaal(water, vlak_materiaal('water', '#8ACBE7', alpha=0.36, filter='#D8EFF8'), contour=0)
    water.data.materials.append(vlak_materiaal('wateroppervlak', '#D3EEF8', alpha=0.75))
    for vlak in water.data.polygons:
        if vlak.normal.z > 0.5:
            vlak.material_index = 1
    tekenlijn(water, 'rand')
    return {'voet': voet, 'glas': glas, 'water': water, 'bodem': bodem, 'straal_water': straal_water,
            'rand': onder + hoogte}


def steen(locatie=(0, 0, 0.13), straal=0.13, contour=0.012):
    """Grillige steen: hobbelig en een beetje scheef, geen nette vorm."""
    obj = _maak(bpy.ops.mesh.primitive_ico_sphere_add, 'steen', locatie, (1.14, 1.08, 0.88), subdivisions=2, radius=straal)
    obj.rotation_euler = (math.radians(9), math.radians(-14), math.radians(25))
    textuur = bpy.data.textures.new('steenruis', 'CLOUDS')
    textuur.noise_scale = 0.22
    ruw = obj.modifiers.new('ruw', 'DISPLACE')
    ruw.texture = textuur
    ruw.strength = 0.06
    _glad(obj, hoek=38)
    geef_materiaal(obj, toon_materiaal('steen', '#8C8577'), contour=contour)
    # Geen slagschaduw: een losse vlek op de tafel ver van de steen verwart.
    obj.visible_shadow = False
    return obj


def weegschaal(x, y=0.0, breedte=0.9, contour=CONTOUR):
    """Digitale weegschaal met een leeg schermpje. De bovenkant van de
    weegplaat staat in romp['bovenkant']."""
    diepte = 0.6
    romp_hoogte = 0.15
    romp = _maak(bpy.ops.mesh.primitive_cube_add, f'weegschaal-{x}', (x, y, contour * ZAK + romp_hoogte / 2),
                 (breedte / 2, diepte / 2, romp_hoogte / 2))
    _afronden(romp, 0.03, 3)
    geef_materiaal(romp, toon_materiaal('weegschaal', '#33373E'), contour=contour)
    plaat_contour = 0.01
    plaat_onder = contour * ZAK + romp_hoogte + plaat_contour * ZAK
    plaat = _maak(bpy.ops.mesh.primitive_cube_add, f'weegplaat-{x}', (x, y + 0.03, plaat_onder + 0.0125),
                  (breedte * 0.43, diepte * 0.4, 0.0125))
    _afronden(plaat, 0.008, 2)
    geef_materiaal(plaat, toon_materiaal('metaal', '#D5DAE0'), contour=plaat_contour)
    voorkant = y - diepte / 2
    scherm = _maak(bpy.ops.mesh.primitive_cube_add, f'weegscherm-{x}', (x - breedte * 0.1, voorkant - 0.004, contour * ZAK + romp_hoogte * 0.5),
                   (breedte * 0.17, 0.006, romp_hoogte * 0.26))
    geef_materiaal(scherm, toon_materiaal('lcd', '#4C7262'), contour=0.006)
    for nummer in range(2):
        knop = _maak(bpy.ops.mesh.primitive_cylinder_add, f'weegknop-{x}-{nummer}',
                     (x + breedte * 0.2 + nummer * breedte * 0.11, voorkant - 0.006, contour * ZAK + romp_hoogte * 0.5), (1, 1, 1),
                     vertices=24, radius=0.022, depth=0.012, rotation=(math.pi / 2, 0, 0))
        geef_materiaal(knop, toon_materiaal('knop', '#E7E2D6'), contour=0.006)
    romp['bovenkant'] = plaat_onder + 0.025
    return romp


def pak_rijst(x, y=0.0, z=0.19, draai=0.0, contour=CONTOUR):
    breedte, diepte, hoogte = 0.30, 0.14, 0.44
    onder = z + contour * ZAK
    pak = _maak(bpy.ops.mesh.primitive_cube_add, 'pak-rijst', (x, y, onder + hoogte / 2), (breedte / 2, diepte / 2, hoogte / 2))
    _afronden(pak, 0.012, 2)
    geef_materiaal(pak, toon_materiaal('rijstpak', '#F4E9CF'), contour=contour)
    band = _maak(bpy.ops.mesh.primitive_cube_add, 'rijstband', (x, y, onder + hoogte * 0.6),
                 (breedte / 2 + 0.004, diepte / 2 + 0.004, hoogte * 0.12))
    geef_materiaal(band, toon_materiaal('rijstband', '#D9A441'), contour=0.008)
    # Plaatje op de voorkant: een kom met een berg witte rijst. Geen tekst.
    voor = y - diepte / 2 - 0.004
    midden = onder + hoogte * 0.25
    kom = _halve_schijf('rijstkom', (x, voor, midden), 0.095, 0.7, onder_helft=True)
    geef_materiaal(kom, toon_materiaal('rijstkom', '#C8553D'), contour=0.005)
    berg = _halve_schijf('rijstberg', (x, voor + 0.001, midden), 0.078, 0.8, onder_helft=False)
    geef_materiaal(berg, toon_materiaal('rijstkorrels', '#FFFBF0'), contour=0.005)
    # De dichte vouw bovenop.
    vouw = _maak(bpy.ops.mesh.primitive_cube_add, 'rijstvouw', (x, y, onder + hoogte + 0.018), (breedte / 2 - 0.006, 0.01, 0.018))
    geef_materiaal(vouw, toon_materiaal('rijstpak', '#F4E9CF'), contour=0.008)
    # Alles draait mee met het pak.
    bpy.context.view_layer.update()
    for deel in (band, kom, berg, vouw):
        deel.parent = pak
        deel.matrix_parent_inverse = pak.matrix_world.inverted()
    pak.rotation_euler.z = math.radians(draai)
    return pak


def doos(naam, x, grootte, y=0.0, draai=0.0, contour=CONTOUR):
    obj = _maak(bpy.ops.mesh.primitive_cube_add, naam, (x, y, contour * ZAK + grootte / 2), (grootte / 2, grootte / 2, grootte / 2))
    _afronden(obj, grootte * 0.025, 2)
    geef_materiaal(obj, toon_materiaal('karton', '#D9AC6E'), contour=contour)
    # Plakband over de naad: bovenop en een stuk langs de voorkant.
    band = grootte * 0.2
    boven = _maak(bpy.ops.mesh.primitive_cube_add, f'{naam}-band-boven', (0, 0, grootte / 2 + 0.002),
                  (band / 2, grootte / 2 + 0.002, 0.002))
    voor = _maak(bpy.ops.mesh.primitive_cube_add, f'{naam}-band-voor', (0, -grootte / 2 - 0.002, grootte / 2 - grootte * 0.17),
                 (band / 2, 0.002, grootte * 0.17))
    for stuk in (boven, voor):
        stuk.parent = obj
        geef_materiaal(stuk, toon_materiaal('plakband', '#EBD39A'), contour=0.005)
    obj.rotation_euler.z = math.radians(draai)
    return obj
