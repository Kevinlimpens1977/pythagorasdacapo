# Slidedeck Preferences

**Created:** 2026-05-10  
**Owner:** Jouw Naam (VMBO Teacher)  
**Project:** Stelling van Pythagoras - Digital Learning Platform

---

## Profiling

| Aspect | Setting | Notes |
|--------|---------|-------|
| **Standaard doelgroep** | VMBO 1-2 | Jongere leerlingen, meer ondersteuning |
| **Standaard slidecount** | 15-20 slides | Klassieke lesstructuur (inclusief inleiding + afsluiting) |
| **Toon / Taal** | Laagdrempelig Nederlands | Eenvoudige woorden, dagelijks leven, toegankelijk |
| **Theorie-omvang per slide** | Flexibel (1-3 tot 8+ regels) | Bepaal per slide op basis van complexiteit |
| **Standaard inoefenvragen** | 3-5 vragen | Normaal niveau: basisbegrip + toepassingen |
| **Output-formaten** | PDF + JSON + HTML | Altijd alle drie exporteren |
| **JSON-export** | Altijd | Klaar voor direct leerplatform-upload |
| **Brontrouw** | Flexibel per slidedeck | Vraag per project of gebruik SOURCE_BASED/AI_SUGGESTION tags |

---

## Slide Composition (15-20 standaard)

**Recommended distribution:**

```
Slide 1:    Titelpagina (naam, level, datum)
Slides 2-3: Inleiding & waarom is dit belangrijk?
Slides 4-6: Theorie 1 (def., voorbeelden, illustratie)
Slides 7-8: Inoefenvraag 1-2 (met antwoorden)
Slides 9-11: Theorie 2 (uitbreiding, meer voorbeelden)
Slide 12:  Inoefenvraag 3 (moeilijker)
Slides 13-15: Praktijktoepassing (echte voorbeelden VMBO-level)
Slide 16:  Inoefenvraag 4-5 (toets-voorbereiding)
Slide 17-18: Samenvatting + huiswerk
Slide 19-20: (Optioneel) Diepgang / Bonus / Herhaling
```

---

## Visual Preferences

### PDF (Digibord)
- **Lettertype:** Sans-serif (Helvetica, Arial, OpenDyslexic)
- **Schriftgrootte titel:** 44-52pt
- **Schriftgrootte body:** 18-24pt
- **Kleurenschema:** Heldere kleuren, hoog contrast (WCAG AA minimum)
- **Whitespace:** 70-75% lege ruimte op veel slides
- **Afbeeldingen:** 60% van slide (diagram > foto > icon)
- **Bullets:** Max 3 per slide, 1 zin per bullet
- **Animations:** Geen: statie slides voor digibord-compat

### HTML Preview
- Clean, minimaal design
- Interactieve buttons (vraag → antwoord toggle)
- Dark mode option
- Mobile-responsive

### JSON (Leerplatform)
- Inclusief alle metadata (bronnen, niveau, tags)
- Antwoorden **gescheiden** van zichtbare slide
- Teacher notes optioneel
- Timestamp & version tracking

---

## Content Quality Standards

### Laagdrempeligheid (VMBO 1-2)
- ✅ Eenvoudige woordenkeuze (Flesh Reading Ease > 60)
- ✅ Korte zinnen (< 15 woorden)
- ✅ Veel voorbeelden uit dagelijks leven
- ✅ Stap-voor-stap uitleg (Bloom's L1-3: onthouden → begrijpen → toepassen)
- ✅ Geen jargon zonder uitleg
- ✗ Geen college-niveau abstracties

### Inoefenvragen (3-5 standaard)
- **Vraag 1-2:** Basisbegrip (herkennen, onthouden)
- **Vraag 3:** Toepassing (berekening, probleem oplossen)
- **Vraag 4-5:** (Optioneel) Diepgang of toets-voorbereiding
- Format: **Meerkeuze** OR **Open vraag** (jij bepaalt per vraag)
- Antwoorden: Altijd volledig met uitleg/stappen

### Bronnen & Sourcing
- Tag elk slide-element met `SOURCE_BASED`, `AI_SUGGESTION`, `NEEDS_REVIEW`, of `TEACHER_DECISION`
- Bij PDF/methodeparagraaf: vertrouwen SOURCE_BASED waar mogelijk
- Bij NotebookLM: mix (AI mag aanpassen voor didactiek, markeer duidelijk)
- Altijd: `Metadata.md` met volledig bronnenlijst

---

## Practical Examples

### Good Slide (Laagdrempelig)
```
TITLE: Rechthoekige driehoeken herkennen
CONTENT: 
  - Driehoek met één hoek van 90°
  - De langste zijde: de SCHUINE zijde (hypotenusa)
  - De twee korte zijden: rechthoekszijden

ILLUSTRATION: Diagram met labels (groot, kleurig)

QUESTION (slide after): 
  Welke zijde is de schuine zijde? 
  [Radio buttons: a) linkerkant, b) bovenkant, c) langste zijde]
```

### Bad Slide (Te moeilijk)
```
TITLE: Hypotenusa determinatie in orthogonal triangles
CONTENT: 
  [Long paragraph of theory with no breaks]
  
ILLUSTRATION: Tiny generic triangle
```

---

## Special Cases

### Mathematica/Grafieken
- Altijd screenshot uit Python/Desmos (NIET hand-drawn)
- Groot, labelenduidelijk
- Source-tag: `SOURCE_BASED` als uit bron, anders `AI_SUGGESTION`

### Historische context (bijv. Pythagoras zelf)
- Korte anekdote OK (max 2 zinnen)
- Relevantie expliciet maken: "Dit helpt je begrijpen waarom..."
- Tag: `AI_SUGGESTION`

### Moeilijke concepten (bijv. bewijs)
- Breek in stappen: **1) Gegeven → 2) Te bewijzen → 3) Bewijs → 4) Conclusie**
- Veel afbeeldingen/diagrammen
- Optioneel: aparte "verdieping" slide (voor sterke leerlingen)
- Tag: `TEACHER_DECISION`

---

## Platform Integration (JSON)

**Standaard JSON-output geschikt voor:**
- Firebase Firestore (lesson uploads)
- Custom LMS (structuur: title, slides[], metadata)
- Markdown export (for backup)

**Upload procedure (na goedkeuring):**
```bash
python notebooklm_cli.py upload-json ./exports/slug_slidedeck.json \
  --lesson-id="7.2" \
  --draft=true  # Optional: start as draft
```

---

## File Naming Convention

```
./exports/
├── slug_slidedeck.pdf          (Digibord-gereed)
├── slug_slidedeck.json         (Platform-upload)
├── slug_slidedeck.html         (Web-preview)
├── slug_metadata.md            (Bronnen + structuur)
├── slug_teacher-notes.md       (Optioneel: jouw aantekeningen)
└── slug_answer-key.pdf         (Optioneel: antwoordsleutel)
```

**Slug example:** `7-2-pythagoras`, `voorkennis-getallen`, `examen-2024`

---

## Review Checklist (Voor jezelf)

- [ ] Alle 15-20 slides aanwezig?
- [ ] Laagdrempelig Nederlands (geen jargon)?
- [ ] 3-5 inoefenvragen met antwoorden?
- [ ] Source-tags compleet (SOURCE_BASED/AI_SUGGESTION)?
- [ ] Afbeeldingen groot genoeg (>40% slide)?
- [ ] Geen animations (digibord-compat)?
- [ ] JSON metadata valid?
- [ ] PDF klaar voor digibord (test op Smart Board / digitaal)?

---

## Overrides per Project

Zet hier afwijkingen van je standaard:

```markdown
### Project: Examen 2024 Voorbereiding
- Level: VMBO 3-4 (ipv 1-2)
- Slidecount: 25 (ipv 15-20)
- Questions: 8 (moeilijker)
- Theory: Volledig (meer detail)
- Sources: Examen vragen leading

### Project: Inleiding Meetkunde
- Slidecount: 12 (compacter)
- Theory: Minimaal (veel illustraties)
- Interactive: Desmos embedded (where safe)
```

---

**Last reviewed:** 2026-05-10  
**Next review:** Na eerste 3 slidedecks  
**Contact/Questions:** zie CLAUDE.md
