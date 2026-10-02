"""Vast renderrecept voor de HELIX-comicshots (designsysteem p.14):
cel-shading, zwarte contouren met een omgekeerde schil, warm licht met een
koele teal schaduwtint, camera recht voor of iets van boven. Geen tekst.

Glas en water krijgen geen schil: door een doorzichtig voorwerp heen zie je
de binnenkant van de schil, en dan wordt het glas grijs. Die voorwerpen
krijgen een Freestyle-lijn (zie tekenlijn)."""
import math
import bpy
from mathutils import Vector

INK = '#0B0D0F'
PAPER = '#FFF7E8'
# Drie harde lichtbanden. De tint vermenigvuldigt de basiskleur (lineair).
SCHADUW_TINT = (0.31, 0.36, 0.40, 1.0)
# Lichtere schaduw voor de slagschaduw op de tafel: zacht, niet zwaar.
TAFELSCHADUW_TINT = (0.48, 0.56, 0.60, 1.0)
MIDDEN_TINT = (0.70, 0.69, 0.68, 1.0)
LICHT_TINT = (1.04, 1.0, 0.90, 1.0)
# Grenzen op de lichtsterkte. Het hooglicht is zo afgesteld dat een vlak dat
# recht naar het licht kijkt 1,0 krijgt; de wereld voegt overal ongeveer 0,09
# toe. Gemeten: bovenvlak ~0,93, vlak naar links ~0,69, vlak van het licht af
# ~0,25, slagschaduw ~0,19.
GRENS_SCHADUW = 0.30
GRENS_LICHT = 0.80
# Richting waar het licht vandaan komt: linksboven, iets van voren.
HOOGLICHT_RICHTING = (-0.55, -0.3, 0.78)
INVULLICHT_RICHTING = (0.6, -0.6, 0.5)
# Collecties voor Freestyle-lijnen op doorzichtige voorwerpen.
GLASLIJNEN = 'helix-glaslijnen'
RANDLIJNEN = 'helix-randlijnen'
# Lijndikte van Freestyle in pixels op een paneel van 660 hoog.
LIJN_PX = 3.0


def lineair(hexkleur):
    h = hexkleur.lstrip('#')

    def kanaal(c):
        c = int(c, 16) / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    return (kanaal(h[0:2]), kanaal(h[2:4]), kanaal(h[4:6]), 1.0)


def leeg_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    return bpy.context.scene


def kies_engine(scene):
    namen = [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items]
    for naam in ('BLENDER_EEVEE_NEXT', 'BLENDER_EEVEE'):
        if naam in namen:
            scene.render.engine = naam
            return naam
    raise RuntimeError(f'Geen EEVEE in {namen}')


def zet_render(scene, breedte, hoogte, frames=1):
    kies_engine(scene)
    scene.render.resolution_x = breedte
    scene.render.resolution_y = hoogte
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.view_settings.view_transform = 'Standard'
    scene.render.fps = 30
    scene.frame_start = 1
    scene.frame_end = frames
    if hasattr(scene, 'eevee') and hasattr(scene.eevee, 'taa_render_samples'):
        scene.eevee.taa_render_samples = 32
    wereld = bpy.data.worlds.new('helix-wereld')
    wereld.use_nodes = True
    achtergrond = wereld.node_tree.nodes.get('Background')
    achtergrond.inputs['Color'].default_value = lineair(PAPER)
    # Laag houden: de wereld licht elk vlak gelijk bij en drukt dan alles in
    # de lichtste band. Bij 0,5 kwam er ~0,47 bij en verdween de schaduwband.
    achtergrond.inputs['Strength'].default_value = 0.1
    scene.world = wereld
    _zet_lijnen(scene, hoogte)


def _transparant(mat):
    if 'surface_render_method' in bpy.types.Material.bl_rna.properties:
        mat.surface_render_method = 'BLENDED'
    else:
        mat.blend_method = 'BLEND'


def toon_materiaal(naam, hexkleur, alpha=1.0, zacht=False, nerf=False):
    """Cel-shading: de lichtsterkte gaat door een kleurband met harde stappen.
    zacht=True geeft een vloeiende overgang, voor de tafel: dan krijgt de
    slagschaduw een zachte rand. nerf=True legt een rustige houtnerf over de
    kleur (planken van links naar rechts)."""
    bestaand = bpy.data.materials.get(naam)
    if bestaand:
        return bestaand
    mat = bpy.data.materials.new(naam)
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    nodes.clear()
    uit = nodes.new('ShaderNodeOutputMaterial')
    diffuus = nodes.new('ShaderNodeBsdfDiffuse')
    diffuus.inputs['Color'].default_value = (1.0, 1.0, 1.0, 1.0)
    naar_rgb = nodes.new('ShaderNodeShaderToRGB')
    banden = nodes.new('ShaderNodeValToRGB')
    elementen = banden.color_ramp.elements
    if zacht:
        banden.color_ramp.interpolation = 'LINEAR'
        elementen[0].position = 0.0
        elementen[0].color = TAFELSCHADUW_TINT
        elementen[1].position = 0.22
        elementen[1].color = TAFELSCHADUW_TINT
        licht = elementen.new(0.75)
        licht.color = LICHT_TINT
    else:
        banden.color_ramp.interpolation = 'CONSTANT'
        elementen[0].position = 0.0
        elementen[0].color = SCHADUW_TINT
        elementen[1].position = GRENS_SCHADUW
        elementen[1].color = MIDDEN_TINT
        licht = elementen.new(GRENS_LICHT)
        licht.color = LICHT_TINT
    basis = nodes.new('ShaderNodeRGB')
    basis.outputs[0].default_value = lineair(hexkleur)
    maal = nodes.new('ShaderNodeVectorMath')
    maal.operation = 'MULTIPLY'
    emissie = nodes.new('ShaderNodeEmission')
    links.new(diffuus.outputs[0], naar_rgb.inputs[0])
    links.new(naar_rgb.outputs[0], banden.inputs[0])
    links.new(banden.outputs[0], maal.inputs[0])
    if nerf:
        coordinaten = nodes.new('ShaderNodeTexCoord')
        golf = nodes.new('ShaderNodeTexWave')
        golf.wave_type = 'BANDS'
        golf.bands_direction = 'Y'
        golf.inputs['Scale'].default_value = 1.3
        golf.inputs['Distortion'].default_value = 1.6
        golf.inputs['Detail'].default_value = 0.5
        zacht_aan = nodes.new('ShaderNodeMapRange')
        zacht_aan.inputs['To Min'].default_value = 0.93
        zacht_aan.inputs['To Max'].default_value = 1.0
        kleur = nodes.new('ShaderNodeVectorMath')
        kleur.operation = 'SCALE'
        links.new(coordinaten.outputs['Object'], golf.inputs['Vector'])
        links.new(golf.outputs['Fac'], zacht_aan.inputs['Value'])
        links.new(basis.outputs[0], kleur.inputs[0])
        links.new(zacht_aan.outputs[0], kleur.inputs['Scale'])
        links.new(kleur.outputs[0], maal.inputs[1])
    else:
        links.new(basis.outputs[0], maal.inputs[1])
    links.new(maal.outputs[0], emissie.inputs[0])
    if alpha >= 1.0:
        links.new(emissie.outputs[0], uit.inputs[0])
    else:
        doorzichtig = nodes.new('ShaderNodeBsdfTransparent')
        meng = nodes.new('ShaderNodeMixShader')
        meng.inputs[0].default_value = alpha
        links.new(doorzichtig.outputs[0], meng.inputs[1])
        links.new(emissie.outputs[0], meng.inputs[2])
        links.new(meng.outputs[0], uit.inputs[0])
        _transparant(mat)
    return mat


def vlak_materiaal(naam, hexkleur, alpha=1.0, filter=None):
    """Egale kleur zonder licht, voor glas, water en glans.
    filter: wat erachter ligt kleurt mee (gekleurde doorlaat), in plaats van
    alleen lichter te worden. Zo blijft een steen onder water donker genoeg."""
    bestaand = bpy.data.materials.get(naam)
    if bestaand:
        return bestaand
    mat = bpy.data.materials.new(naam)
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    nodes.clear()
    uit = nodes.new('ShaderNodeOutputMaterial')
    emissie = nodes.new('ShaderNodeEmission')
    emissie.inputs[0].default_value = lineair(hexkleur)
    if alpha >= 1.0:
        links.new(emissie.outputs[0], uit.inputs[0])
    else:
        doorzichtig = nodes.new('ShaderNodeBsdfTransparent')
        if filter:
            doorzichtig.inputs['Color'].default_value = lineair(filter)
        meng = nodes.new('ShaderNodeMixShader')
        meng.inputs[0].default_value = alpha
        links.new(doorzichtig.outputs[0], meng.inputs[1])
        links.new(emissie.outputs[0], meng.inputs[2])
        links.new(meng.outputs[0], uit.inputs[0])
        _transparant(mat)
    return mat


def contour_materiaal():
    mat = bpy.data.materials.get('helix-contour')
    if mat:
        return mat
    mat = bpy.data.materials.new('helix-contour')
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    uit = nodes.new('ShaderNodeOutputMaterial')
    emissie = nodes.new('ShaderNodeEmission')
    emissie.inputs[0].default_value = lineair(INK)
    mat.node_tree.links.new(emissie.outputs[0], uit.inputs[0])
    mat.use_backface_culling = True
    # De schil omsluit het voorwerp. Zonder dit werpt hij schaduw op het
    # voorwerp zelf en wordt alles donker.
    if 'use_backface_culling_shadow' in mat.bl_rna.properties:
        mat.use_backface_culling_shadow = True
    return mat


def geef_materiaal(obj, mat, contour=0.018):
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    if contour > 0:
        obj.data.materials.append(contour_materiaal())
        schil = obj.modifiers.new('contour', 'SOLIDIFY')
        schil.thickness = contour
        schil.offset = 1.0
        schil.use_even_offset = True
        schil.use_flip_normals = True
        schil.use_rim = False
        schil.material_offset = 1


def tekenlijn(obj, soort='glas'):
    """Freestyle-lijn voor een doorzichtig voorwerp.
    soort='glas': omtrek, open randen en scherpe hoeken, alleen zichtbaar.
    soort='rand': alleen gemarkeerde randen (use_freestyle_mark), ook achter
    een glaswand. Zo krijgt het wateroppervlak een lijn."""
    naam = GLASLIJNEN if soort == 'glas' else RANDLIJNEN
    collectie = bpy.data.collections.get(naam) or bpy.data.collections.new(naam)
    if obj.name not in collectie.objects:
        collectie.objects.link(obj)
    return obj


def _zet_lijnen(scene, hoogte):
    sets = []
    for naam in (GLASLIJNEN, RANDLIJNEN):
        collectie = bpy.data.collections.get(naam)
        if collectie and len(collectie.objects):
            sets.append((naam, collectie))
    if not sets:
        return
    scene.render.use_freestyle = True
    scene.render.line_thickness_mode = 'ABSOLUTE'
    scene.render.line_thickness = 1.0
    instellingen = scene.view_layers[0].freestyle_settings
    for bestaand in instellingen.linesets:
        bestaand.show_render = False
    stijl = bpy.data.linestyles.new('helix-inkt')
    stijl.color = lineair(INK)[:3]
    stijl.thickness = LIJN_PX * hoogte / 660
    stijl.caps = 'ROUND'
    for naam, collectie in sets:
        lijnen = instellingen.linesets.new(naam)
        lijnen.linestyle = stijl
        lijnen.select_by_collection = True
        lijnen.collection = collectie
        lijnen.select_by_edge_types = True
        lijnen.select_by_visibility = True
        for veld in ('select_silhouette', 'select_border', 'select_crease', 'select_edge_mark',
                     'select_contour', 'select_external_contour', 'select_material_boundary',
                     'select_suggestive_contour', 'select_ridge_valley'):
            setattr(lijnen, veld, False)
        if naam == GLASLIJNEN:
            lijnen.visibility = 'VISIBLE'
            lijnen.select_silhouette = True
            lijnen.select_border = True
            lijnen.select_crease = True
        else:
            # Tot twee lagen ervoor: de voor- en binnenkant van de glaswand.
            # Ligt er meer voor (de steen), dan verdwijnt de lijn, zoals het hoort.
            lijnen.visibility = 'RANGE'
            lijnen.qi_start = 0
            lijnen.qi_end = 2
            lijnen.select_edge_mark = True


def _richt(obj, naar_licht):
    """Draai een zon zo dat zijn licht uit de richting naar_licht komt."""
    obj.rotation_euler = Vector(naar_licht).normalized().to_track_quat('Z', 'Y').to_euler()


def licht_en_camera(locatie, doel, lens=50):
    # Een zon met sterkte pi geeft een vlak dat er recht naar kijkt lichtsterkte 1.
    zon = bpy.data.objects.new('hooglicht', bpy.data.lights.new('hooglicht', 'SUN'))
    zon.data.energy = math.pi
    zon.data.color = (1.0, 0.95, 0.86)
    zon.data.angle = math.radians(3)
    _richt(zon, HOOGLICHT_RICHTING)
    invul = bpy.data.objects.new('invullicht', bpy.data.lights.new('invullicht', 'SUN'))
    invul.data.energy = math.pi * 0.22
    invul.data.color = (0.7, 0.9, 0.92)
    invul.data.use_shadow = False
    _richt(invul, INVULLICHT_RICHTING)
    richtpunt = bpy.data.objects.new('richtpunt', None)
    richtpunt.location = doel
    camera = bpy.data.objects.new('camera', bpy.data.cameras.new('camera'))
    camera.location = locatie
    camera.data.lens = lens
    camera.data.clip_start = 0.05
    camera.data.clip_end = 100
    volg = camera.constraints.new('TRACK_TO')
    volg.target = richtpunt
    volg.track_axis = 'TRACK_NEGATIVE_Z'
    volg.up_axis = 'UP_Y'
    scene = bpy.context.scene
    for obj in (zon, invul, richtpunt, camera):
        scene.collection.objects.link(obj)
    scene.camera = camera
    return camera
