"""Maakt van een presentatie-PDF een lichte versie: elke pagina één JPEG.

Dezelfde huisregel als de browserkant in src/lib/pdfCompressie.js (schaal 1,5 en
JPEG-kwaliteit 82). Een deck dat rechtstreeks uit PowerPoint komt is vaak 15 tot
25 MB; zo'n bestand moet een leerling eerst helemaal binnenhalen voordat hij dia
1 ziet. Na deze bewerking is het meestal 3 tot 5 MB met hetzelfde beeld.

De originelen blijven staan: dit script schrijft alleen nieuwe bestanden.

Gebruik:

    python scripts/comprimeer-slidedeck.py --uit sources/slidedecks \\
        "C:/Users/kevli/Downloads/Massa.pdf" "C:/Users/kevli/Downloads/Volume.pdf"

    python scripts/comprimeer-slidedeck.py --uit sources/slidedecks --naam h3-3.1-warmte.pdf bron.pdf

Zonder --naam krijgt elk bestand zijn eigen naam in kleine letters met streepjes.
Levert per bestand een regel met het aantal pagina's en de winst.
"""

import argparse
import io
import os
import re
import sys
import time

try:
    import fitz  # PyMuPDF
    from PIL import Image
except ImportError as fout:  # pragma: no cover - afhankelijk van de werkplek
    print(f"Ontbrekend pakket: {fout}. Installeer met: pip install pymupdf pillow", file=sys.stderr)
    raise SystemExit(1)

RENDER_SCHAAL = 1.5
JPEG_KWALITEIT = 82
# Onder deze winst is het niet de moeite: dan houden we het origineel aan, zodat
# we geen kwaliteit inleveren voor een paar procent.
MINIMALE_WINST = 0.85


def nette_naam(pad: str) -> str:
    kaal = os.path.splitext(os.path.basename(pad))[0].lower()
    kaal = re.sub(r"[^a-z0-9]+", "-", kaal).strip("-")
    return f"{kaal or 'slidedeck'}.pdf"


def comprimeer(bron: str, doel: str) -> dict:
    begin = time.time()
    document = fitz.open(bron)
    uitvoer = fitz.open()
    breedte = hoogte = 0

    for pagina in document:
        pixels = pagina.get_pixmap(matrix=fitz.Matrix(RENDER_SCHAAL, RENDER_SCHAAL), alpha=False)
        breedte, hoogte = pixels.width, pixels.height
        afbeelding = Image.frombytes("RGB", (pixels.width, pixels.height), pixels.samples)
        buffer = io.BytesIO()
        afbeelding.save(buffer, format="JPEG", quality=JPEG_KWALITEIT, optimize=True, progressive=True)
        nieuw = uitvoer.new_page(width=pagina.rect.width, height=pagina.rect.height)
        nieuw.insert_image(nieuw.rect, stream=buffer.getvalue())

    uitvoer.save(doel, garbage=4, deflate=True)
    resultaat = {
        "paginas": len(document),
        "pixels": f"{breedte}x{hoogte}",
        "bron_bytes": os.path.getsize(bron),
        "doel_bytes": os.path.getsize(doel),
        "seconden": time.time() - begin,
    }
    document.close()
    uitvoer.close()
    return resultaat


def main() -> int:
    parser = argparse.ArgumentParser(description="Comprimeer presentatie-PDF's voor HELIX.")
    parser.add_argument("bestanden", nargs="+", help="de PDF's die je hebt gekregen")
    parser.add_argument("--uit", default="sources/slidedecks", help="map voor de lichte versies")
    parser.add_argument("--naam", default="", help="bestandsnaam voor de uitvoer (alleen bij één bestand)")
    argumenten = parser.parse_args()

    if argumenten.naam and len(argumenten.bestanden) > 1:
        print("--naam kan alleen bij één bestand; laat hem weg om de namen af te leiden.", file=sys.stderr)
        return 1

    os.makedirs(argumenten.uit, exist_ok=True)
    mislukt = 0

    for bron in argumenten.bestanden:
        if not os.path.exists(bron):
            print(f"FOUT  {bron}: bestaat niet", file=sys.stderr)
            mislukt += 1
            continue

        doelnaam = argumenten.naam or nette_naam(bron)
        doel = os.path.join(argumenten.uit, doelnaam)
        uitkomst = comprimeer(bron, doel)
        winst = uitkomst["doel_bytes"] / uitkomst["bron_bytes"] if uitkomst["bron_bytes"] else 1

        regel = (
            f"{doelnaam:32} {uitkomst['paginas']:3d} pagina's  {uitkomst['pixels']:>10}  "
            f"{uitkomst['bron_bytes'] / 1e6:6.1f} MB -> {uitkomst['doel_bytes'] / 1e6:5.1f} MB  "
            f"({uitkomst['seconden']:.1f}s)"
        )
        if winst > MINIMALE_WINST:
            regel += "  LET OP: nauwelijks winst, overweeg het origineel te gebruiken"
        print(regel)

    return 1 if mislukt else 0


if __name__ == "__main__":
    raise SystemExit(main())
