# Blender: renderrecept en labbibliotheek

- `video/blender/renderrecept.py`: EEVEE, cel-shading (Shader to RGB met drie
  harde banden: teal schaduw, neutraal, warm licht), zwarte contour met een
  omgekeerde schil (Solidify, `use_flip_normals`, zwart materiaal met backface
  culling), warm hooglicht en teal invullicht, transparante achtergrond,
  view transform Standard.
- `video/blender/bouw_lab.py`: de vaste voorwerpen als code (labtafel, blokje,
  maatcilinder met water, steen, weegschaal, pak rijst, doos).
- `video/blender/shots/<hoofdstukId>.py`: per hoofdstuk een `SHOTS`-dict van
  shotnaam naar functie die de scène bouwt en `{ breedte, hoogte, frames }`
  teruggeeft. Paneel in SPLIT: 1240 × 1320. Breed in FOCUS: 1728 × 660.
- `video/blender/render-shot.py`: rendert één shot zonder scherm naar
  `video/public/hoofdstukken/<id>/shots/<naam>/####.png`.

## Renderen

Git Bash:

```bash
"/c/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --factory-startup -P video/blender/render-shot.py -- --hoofdstuk <id> --shot <naam>
```

PowerShell:

```powershell
& "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b --factory-startup -P video/blender/render-shot.py -- --hoofdstuk <id> --shot <naam>
```

- `--alleen 1,45,90` rendert alleen die frames (`0001.png`, `0045.png`, ...), voor
  een snelle proef vóór de hele reeks.
- Een onbekende `--shot` stopt met de lijst van shotnamen uit `SHOTS`.

## Een voorwerp toevoegen

1. Schrijf een functie in `bouw_lab.py` met `_maak(...)` en `geef_materiaal(...)`.
2. Kies een kleur als hex; gebruik geen tekst of getallen op het voorwerp.
3. Render een proefshot en bekijk het.

## Regels

- Geen tekst, geen getallen, geen schaalverdeling in een render.
- Camera recht voor of iets van boven, lens 50 mm als uitgangspunt (de H2-shots
  gebruiken 65 tot 70 mm, dus weinig vertekening).
- Aantallen en verhoudingen controleren: twee "even grote" blokjes zijn echt even
  groot.
- Water in een shot stijgt natuurkundig: de stijging volgt uit het volume van het
  voorwerp (zie `onderdompel_steen` in het H2-shotbestand). Het beeld toont dus
  dat het water stijgt; de getallen (15 naar 25 ml) staan alleen in de getekende
  maatcilinder. Laat het shot niet "kloppen" met die getallen en schrijf ze er
  niet in.
- Beweging in een shot moet hetzelfde tempo hebben als de getekende laag in
  Remotion (H2: de steen valt in 14 frames, het water stijgt van frame 13 tot
  58). Een reeks start bij `shot.startBij` in het draaiboek.
- Blender 5.2: `action.fcurves` bestaat niet meer; haal curven op via de
  channelbag (helper `_curven` in het H2-shotbestand).
- Live meekijken kan met de Blender-MCP (`blender-lab`, poort 9876) als Kevin de
  add-on aan zet. Renderen werkt ook zonder.
