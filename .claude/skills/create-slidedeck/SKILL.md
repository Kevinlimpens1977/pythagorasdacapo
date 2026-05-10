# Create Slidedeck from NotebookLM

Generate a professional Dutch VMBO-level educational slide deck from:
- **NotebookLM notebook** (by name or ID)
- **PDF/JPG/screenshot** (upload directly)
- **Method paragraph** (copy-paste text)

Claude uses NotebookLM for source analysis, then structures content as:
- **15-20 slides** (standaard), laagdrempelig Nederlands
- **3-5 inoefenvragen** verspreid door de slidedeck
- **Flexibele theorie-kaders** (1-3 tot 8+ regels per slide)
- **Duidelijke bronlabels**: `SOURCE_BASED` | `AI_SUGGESTION` | `NEEDS_REVIEW` | `TEACHER_DECISION`

## Usage

```bash
/create-slidedeck <source> [options]
```

### Sources

**1. NotebookLM notebook (naam of ID)**
```bash
/create-slidedeck "stelling van pythagoras"
/create-slidedeck "d6bcaa5e-63a1-48be-b8b4-f55a8996b544" "Include interactive proofs"
```

**2. PDF/JPG/Screenshot (via file upload)**
```bash
/create-slidedeck @file.pdf "Add practical examples for VMBO 1"
/create-slidedeck @screenshot.jpg
```

**3. Method paragraph (copy-paste)**
```bash
/create-slidedeck "Pythagoras' stelling zegt dat: a² + b² = c² in rechthoekige driehoeken..."
```

## Options

- `--slides=12` → Forceer 12 slides (default: 15-20)
- `--questions=5` → Standaard 5 inoefenvragen
- `--tone=formeel` → Formeel ipv laagdrempelig
- `--theory=minimal` → 1-3 regels theorie per slide
- `--format=pdf,json,html` → Selecteer outputs (default: alle drie)
- `--source-strict=true` → 100% brongetrouw (SOURCE_BASED-tagged)
- `--level=vmbo-2` → Target niveau (default: VMBO 1-2)

## What It Does

1. ✅ **Analyseert bron** via NotebookLM (notebook/PDF/JPG) of structureert methodeparagraaf
2. ✅ **Genereert slidedeck** met laagdrempelige uitleg (Blooms-level 1-3: onthouden, begrijpen, toepassen)
3. ✅ **Voegt inoefenvragen toe** (3-5 verspreid, antwoorden incl.)
4. ✅ **Voegt praktijkvoorbeelden toe** (dagelijks leven, VMBO-relevant)
5. ✅ **Markeert al bronnen** met tags (`SOURCE_BASED`, `AI_SUGGESTION`, etc.)
6. ✅ **Exporteert** als PDF (digibord), JSON (leerplatform), HTML (preview)

## Output Structure

**Standaard bestandsnamen:**
```
./exports/<slug>_slidedeck.pdf          # Digibord/print
./exports/<slug>_slidedeck.json         # Leerplatform-integratie
./exports/<slug>_slidedeck.html         # Web-preview
./exports/<slug>_metadata.md            # Bronnen + structuur
```

### PDF Layout (Digibord)
- Grote titels (14-18pt)
- Veel whitespace (75% empty space op veel slides)
- Maximaal 2-3 regels tekst per slide
- Illustraties/voorbeelden dominant
- Buttons/klikbaarheden waar mogelijk

### JSON Format (Leerplatform)
```json
{
  "title": "Stelling van Pythagoras",
  "level": "vmbo-1-2",
  "slides": [
    {
      "number": 1,
      "title": "Wat is de stelling van Pythagoras?",
      "content": "In een rechthoekige driehoek: a² + b² = c²",
      "type": "theory",
      "source_tag": "SOURCE_BASED",
      "illustration": "right-triangle.jpg"
    },
    {
      "number": 3,
      "title": "Oefening 1",
      "content": "Rechthoek met zijden 3 en 4. Wat is de diagonaal?",
      "type": "question",
      "answer": "5 cm",
      "explanation": "3² + 4² = 9 + 16 = 25 → √25 = 5"
    }
  ],
  "metadata": {
    "questions_count": 4,
    "theory_slides": 12,
    "practice_slides": 4,
    "sources": ["method_paragraph", "notebooklm"],
    "source_tags": {
      "SOURCE_BASED": 8,
      "AI_SUGGESTION": 4,
      "NEEDS_REVIEW": 1
    }
  }
}
```

### Markdown Format (Editabel)
```markdown
# Stelling van Pythagoras

## Slide 1: Inleiding
[SOURCE_BASED] In een rechthoekige driehoek geldt: a² + b² = c²

**Illustratie:** Right-triangle with sides labeled a, b, c

---

## Slide 3: Oefening 1
[QUESTION] Rechthoek met zijden 3 en 4. Wat is de diagonaal?

**Antwoord:** 5 cm  
**Uitleg:** 3² + 4² = 9 + 16 = 25 → √25 = 5

---
```

## Source Tags

| Tag | Betekenis | Handeling |
|-----|-----------|-----------|
| `SOURCE_BASED` | Rechtstreeks uit bron-PDF/methodeparagraaf | Gebruik als-is |
| `AI_SUGGESTION` | Claude structureert/vult aan | Review voordatje het deelt |
| `NEEDS_REVIEW` | Onduidelijk of conflicterende info | Vraag expert of herstructureer |
| `TEACHER_DECISION` | Didactische keuze (level, orde, toetsvraag) | Beslis per geval |

## Workflow

### 1. **Notebook source**
```bash
/create-slidedeck "stelling van pythagoras"
```
→ Claude gebruikt NotebookLM om je notebook te analyseren → structureert slides

### 2. **PDF/JPG source**
```bash
/create-slidedeck @boek-pagina-28.pdf
```
→ Claude uploadt naar NotebookLM → analyseert inhoud → genereert slides

### 3. **Text source**
```bash
/create-slidedeck "Pythagoras zei dat in rechthoekige driehoeken a² + b² = c²..."
```
→ Claude structureert direct → genereert slides

## Integration with Learning Platform

**JSON export** is klaar voor Firebase upload:
```bash
python notebooklm_cli.py upload-json ./exports/pythagoras_slidedeck.json --lesson-id="7.2"
```

## Troubleshooting

| Probleem | Oplossing |
|----------|-----------|
| "Notebook not found" | Controleer naam in `/create-slidedeck list` |
| "PDF empty" | Zorg dat PDF selecteerbaar tekst bevat |
| Too many/few questions | Gebruik `--questions=3` of `--questions=8` |
| JSON upload fails | Check Firebase rules en API endpoint |
| PDF not VMBO-friendly | Gebruik `--theory=minimal --slides=12` |

## Examples

**Basis**
```bash
/create-slidedeck "stelling van pythagoras"
```

**Met opties**
```bash
/create-slidedeck @examen-2024.pdf \
  --slides=18 \
  --questions=5 \
  --tone=laagdrempelig \
  --format=pdf,html
```

**Streng brongetrouw**
```bash
/create-slidedeck "methodeboek-paragraaf-7.3" \
  --source-strict=true \
  --theory=volledig \
  --level=vmbo-4
```

---

**Last updated:** 2026-05-10  
**Version:** 1.0  
**Created by:** Claude Code + NotebookLM Integration
