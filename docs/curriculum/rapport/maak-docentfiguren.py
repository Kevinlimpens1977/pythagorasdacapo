# -*- coding: utf-8 -*-
"""De twee schermafbeeldingen van het docentbeeld voor het MT-rapport.

    python docs/curriculum/rapport/maak-docentfiguren.py

Het rapport laat zien wat een docent na de nulmeting ziet. Dat zijn echte
schermen van een echte leerling, dus de naam gaat eraf voordat het beeld in een
document belandt dat buiten de school gaat. De bronbestanden staan in
exports/curriculum/bron/ (buiten git, net als de rest van exports).

Uitvoer in exports/curriculum/:
  docentprofiel-voorbeeld.png   het startprofiel zoals de docent het ziet
  nulmeting-per-vraag.png       de antwoorden per vraag van een leerling
"""
from pathlib import Path

from PIL import Image, ImageDraw

HIER = Path(__file__).resolve().parent
UIT = HIER.parents[2] / "exports" / "curriculum"
BRON = UIT / "bron"

# De naam staat achter het woord "Startprofiel" in de kop. Coordinaten in het
# bronbeeld van 1173 breed; verandert de schermafbeelding, dan verandert dit mee.
NAAMVLAK = (138, 50, 318, 77)


def docentprofiel():
    beeld = Image.open(BRON / "docentprofiel-bron.png").convert("RGB")
    teken = ImageDraw.Draw(beeld)
    teken.rectangle(NAAMVLAK, fill=(17, 24, 39))
    # Een streep eroverheen laat zien dat hier bewust iets is weggehaald.
    teken.line((NAAMVLAK[0] + 6, (NAAMVLAK[1] + NAAMVLAK[3]) // 2,
                NAAMVLAK[2] - 6, (NAAMVLAK[1] + NAAMVLAK[3]) // 2),
               fill=(255, 255, 255), width=2)
    doel = UIT / "docentprofiel-voorbeeld.png"
    beeld.save(doel)
    return doel


def pervraag():
    beeld = Image.open(BRON / "pervraag-bron.png").convert("RGB")
    doel = UIT / "nulmeting-per-vraag.png"
    beeld.save(doel)
    return doel


if __name__ == "__main__":
    for doel in (docentprofiel(), pervraag()):
        print(f"{doel} ({doel.stat().st_size // 1024} kB)")
