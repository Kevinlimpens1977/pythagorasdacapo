"""Bouwt het MT-rapport digitale geletterdheid als HTML en PDF.

De tabellen met cijfers komen rechtstreeks uit de curriculumbestanden, zodat
het rapport niet uit de pas loopt met fase 2 en 3:
  dv-klas1-curriculum.json, dv-scenarios.json, genereer-fase2.mjs,
  genereer-fase3.mjs en de docentkaarten uit dv-leerlijn-fase4-klas1-4.md.

    python docs/curriculum/rapport/bouw-rapport.py

Uitvoer in exports/curriculum/ (staat buiten git).
"""
import json
import re
import subprocess
import tempfile
from pathlib import Path

import markdown

HIER = Path(__file__).resolve().parent
CURR = HIER.parent
REPO = CURR.parent.parent
UIT = REPO / "exports" / "curriculum"
NAAM = "Digitale-geletterdheid-vmbo-rapport-MT"
BROWSERS = [
    Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
]


def node_uitvoer(script):
    with tempfile.TemporaryDirectory() as tmp:
        doel = Path(tmp) / "uit.md"
        subprocess.run(["node", str(CURR / script), str(doel)], check=True, cwd=REPO, capture_output=True)
        return doel.read_text(encoding="utf-8")


def tabel_na(tekst, kop):
    """De eerste markdown-tabel na een regel die met kop begint."""
    regels = tekst.splitlines()
    start = next(i for i, r in enumerate(regels) if r.startswith(kop))
    tabel = []
    for r in regels[start + 1:]:
        if r.startswith("|"):
            tabel.append(r)
        elif tabel:
            break
    return "\n".join(tabel)


def eerste_tabel(tekst):
    tabel = []
    for r in tekst.splitlines():
        if r.startswith("|"):
            tabel.append(r)
        elif tabel:
            break
    return "\n".join(tabel)


def lessenoverzicht(c):
    rij = ["| Les | Titel | Kerndoel | Leerdoelen | Evidence |", "| --- | --- | --- | --- | --- |"]
    for l in c["lessen"]:
        doelen = "<br>".join(l["leerdoelen"])
        rij.append(f"| {l['nr']} | {l['titel']} | {l['primair']} | {doelen} | {l['evidence']} |")
    return "\n".join(rij)


def vakmomenten(s):
    rij = ["| Vak | Periode | Moment | Routine |", "| --- | --- | --- | --- |"]
    for v in s["vakmomenten"]:
        rij.append(f"| {v['vak']} | {v['periode']} | {v['titel']} | {v['routine'] or '-'} |")
    return "\n".join(rij)


def docentkaarten():
    tekst = (CURR / "dv-leerlijn-fase4-klas1-4.md").read_text(encoding="utf-8")
    deel = tekst[tekst.index("### 6.3"):tekst.index("### 6.4")]
    kaarten, huidige = [], []
    for r in deel.splitlines():
        if r.startswith(">"):
            regel = r[1:].lstrip() if r != ">" else ""
            # Een lijst heeft in markdown een lege regel ervoor nodig.
            if re.match(r"\d+\. ", regel) and huidige and huidige[-1] and not re.match(r"\d+\. ", huidige[-1]):
                huidige.append("")
            # Vervolgregels van een lijstitem inspringen, anders worden ze een losse alinea.
            if r.startswith(">    ") and not re.match(r"\d+\. ", regel):
                regel = "   " + regel
            huidige.append(regel)
        elif huidige:
            kaarten.append("\n".join(huidige))
            huidige = []
    if huidige:
        kaarten.append("\n".join(huidige))
    return "\n\n".join(f'<div class="kaart" markdown="1">\n\n{k}\n\n</div>' for k in kaarten)


CSS = """
@page { size: A4; margin: 22mm 20mm 20mm 20mm;
  @bottom-right { content: counter(page); font: 9pt 'Segoe UI', sans-serif; color: #6b7280; }
  @bottom-left { content: 'Digitale geletterdheid vmbo · DaCapo College · concept september 2026'; font: 8pt 'Segoe UI', sans-serif; color: #9ca3af; } }
@page :first { @bottom-right { content: none; } @bottom-left { content: none; } }
:root { --inkt: #1f2937; --accent: #0f4c81; --zacht: #eef4fa; --lijn: #d1d5db; }
body { font-family: 'Segoe UI', Calibri, sans-serif; font-size: 10.5pt; line-height: 1.5; color: var(--inkt); }
h1 { font-size: 30pt; color: var(--accent); margin: 0 0 6pt; line-height: 1.15; }
h2 { font-size: 16pt; color: var(--accent); border-bottom: 2px solid var(--accent); padding-bottom: 3pt; margin: 22pt 0 8pt; break-after: avoid; }
h3 { font-size: 12pt; color: var(--accent); margin: 14pt 0 6pt; break-after: avoid; }
p, li { orphans: 3; widows: 3; }
table { border-collapse: collapse; width: 100%; margin: 8pt 0 12pt; font-size: 9pt; break-inside: auto; }
th { background: var(--accent); color: #fff; text-align: left; font-weight: 600; }
th, td { border: 1px solid var(--lijn); padding: 4pt 6pt; vertical-align: top; }
tr { break-inside: avoid; }
tbody tr:nth-child(even) td { background: #f9fafb; }
strong { color: #111827; }
.titelpagina { height: 240mm; display: flex; flex-direction: column; justify-content: center; break-after: page; }
.bovenschrift { text-transform: uppercase; letter-spacing: 2pt; color: #6b7280; font-size: 10pt; }
.ondertitel { font-size: 17pt; color: #374151; margin: 0 0 30pt; }
.meta { font-size: 11pt; color: #374151; border-left: 4px solid var(--accent); padding-left: 10pt; }
.leeswijzer { margin-top: 40pt; font-size: 9.5pt; color: #4b5563; background: var(--zacht); padding: 10pt 12pt; }
.inhoud { break-after: page; }
.inhoud ol { columns: 2; column-gap: 20pt; }
.bijlage { break-before: page; }
.kaart { border: 1px solid var(--lijn); border-left: 4px solid var(--accent); padding: 4pt 12pt; margin: 0 0 12pt; break-inside: avoid; background: #fbfdff; }
.matrix table { font-size: 8pt; }
"""


def main():
    c = json.loads((CURR / "dv-klas1-curriculum.json").read_text(encoding="utf-8"))
    s = json.loads((CURR / "dv-scenarios.json").read_text(encoding="utf-8"))
    fase2 = node_uitvoer("genereer-fase2.mjs")
    fase3 = node_uitvoer("genereer-fase3.mjs")

    bron = (HIER / "rapport-dv-mt.md").read_text(encoding="utf-8")
    vervang = {
        "{{DEKKINGSMATRIX}}": '<div class="matrix" markdown="1">\n\n' + tabel_na(fase2, "## 4.") + "\n\n</div>",
        "{{SCENARIOCIJFERS}}": eerste_tabel(fase3),
        "{{VAKMOMENTEN}}": vakmomenten(s),
        "{{LESSENOVERZICHT}}": lessenoverzicht(c),
        "{{DOCENTKAARTEN}}": docentkaarten(),
    }
    for sleutel, waarde in vervang.items():
        if sleutel not in bron:
            raise SystemExit(f"Plaatshouder {sleutel} ontbreekt in de bron.")
        bron = bron.replace(sleutel, waarde)
    bron = re.sub(r'<div class="([^"]+)">', r'<div class="\1" markdown="1">', bron)

    body = markdown.markdown(bron, extensions=["tables", "md_in_html", "sane_lists"])
    html = f"""<!doctype html>
<html lang="nl"><head><meta charset="utf-8">
<title>Digitale geletterdheid vmbo - rapport voor het MT</title>
<style>{CSS}</style></head><body>{body}</body></html>"""

    UIT.mkdir(parents=True, exist_ok=True)
    html_pad = UIT / f"{NAAM}.html"
    pdf_pad = UIT / f"{NAAM}.pdf"
    html_pad.write_text(html, encoding="utf-8")

    browser = next((b for b in BROWSERS if b.exists()), None)
    if not browser:
        raise SystemExit("Geen Edge of Chrome gevonden; HTML staat klaar in " + str(html_pad))
    subprocess.run([
        str(browser), "--headless", "--disable-gpu", "--no-pdf-header-footer",
        "--print-to-pdf-no-header", f"--print-to-pdf={pdf_pad}", html_pad.as_uri(),
    ], check=True, capture_output=True)
    print(f"HTML: {html_pad}\nPDF:  {pdf_pad}")


if __name__ == "__main__":
    main()
