# 📚 Didactisch Content Management Platform - Implementatie Plan

**Status:** Planning (geen code geschreven)  
**Datum:** 2026-05-11  
**Target Scope:** MVP → Fase 2 over 6-9 maanden

---

## 1️⃣ PLATFORM OVERVIEW

### Visie
Van **enkelvoudige crop-tool** naar **complete Didactisch CMS** voor Wiskunde (en later meer vakken).
- **Admin-side:** Content beheren (hoofdstukken, paragrafen, vragen, crops)
- **Student-side:** Interactieve oefeningen + AI-ondersteuning

### Hiërarchie (finaal)
```
Vak (Wiskunde, Nederlands, etc.)
└── Leerjaar (1, 2, 3, 4, ...)
    └── Niveau (VMBO-B, VMBO-GL, HAVO, VWO)
        └── Hoofdstuk (7. Pythagoras, 2. Lineaire functies, etc.)
            └── Paragraaf (7.1, 7.2, 7.3, etc.)
                └── Vraag/Opgave (14a, 14b, 14c, etc.)
                    └── Crop-resources (afbeeldingen, OCR-teksten)
```

---

## 2️⃣ FASE-INDELING (MVP → Production)

### ⭐ FASE 1: Content Management Core (Maand 1-2)
**Doel:** Admin kan Vak/Leerjaar/Niveau/Hoofdstuk/Paragraaf creëren en beheren

**Features:**
- [ ] Navigation tree (links: Vak → Leerjaar → Niveau → Hoofdstuk → Paragraaf)
- [ ] Basismodellen Firestore bijwerken (zie schema hieronder)
- [ ] CRUD operaties per level
- [ ] Metadata per level (beschrijving, volgorde, zichtbaarheid)
- [ ] Bulk-delete/archive

**Output:** Admin kan structuur aanleggen

---

### 🎨 FASE 2: Vraag-Editor & Crops (Maand 2-3)
**Doel:** Admin kan vragen creëren/bewerken met crop-selectie

**Features:**
- [ ] Vraag-editor (RemirrorJS - rich text + afbeeldingen)
- [ ] Vraag-Preview (admin ziet student-view realtime)
- [ ] Crop-tool (refactor van huiendige crop-tool)
  - [ ] Rechthoeken selecteren uit afbeelding/PDF
  - [ ] Crop opslaan bij paragraaf (niet vraag!)
  - [ ] Crop-bibliotheek per paragraaf
  - [ ] Automatische OCR (Google Vision)
- [ ] Image positioning (drag + buttons)
- [ ] Vraag-typen (MVP):
  - [ ] Open vraag (textarea)
  - [ ] Meerkeuze (4 opties)
  - [ ] Numeriek antwoord (met tolerantie)
  - [ ] **Tabel-editor** (structured data invullen)
- [ ] Vraag-metadata:
  - [ ] Hints/hulpjes per vraag
  - [ ] Moeilijkheid (1-5)
  - [ ] Rekenmachine aan/uit (standaard/wetenschappelijk)
- [ ] Draft/Published status per vraag
- [ ] **Vraag-dupliceren** (copy naar ander hoofdstuk)
- [ ] **Batch-import** (CSV/Excel upload van vragen)

**Output:** Admin kan complexe oefeningen creëren met afbeeldingen/teksten/tabellen

---

### 🤖 FASE 3: AI-Ondersteuning & Rekenmachine (Maand 3-4)
**Doel:** Student krijgt intelligente hulp

**Features:**
- [ ] AI Companion (Socratisch)
  - [ ] Per paragraaf aan/uit (admin bepaalt)
  - [ ] Gaat geen antwoorden geven, alleen vragen stellen
  - [ ] "Je hebt al X stap gezet, wat is de volgende?"
  - [ ] **Integratie met OpenRouter API** (gemultiploosde AI-models, budget-aware)
  - [ ] Caching van common responses
- [ ] Embedded Rekenmachine
  - [ ] Standaard (+ - × ÷) modus
  - [ ] Wetenschappelijk (power, root, sin/cos/tan) modus
  - [ ] Per vraag selecteerbaar
  - [ ] UI: klein paneel rechts in vraag

**Output:** Student heeft intelligent tutoring system met budget-beheer

---

### 📊 FASE 4: Student Analytics & Docent-Dashboard (Maand 4-5)
**Doel:** Inzicht in leerling-voortgang

**Features:**
- [ ] Student-antwoorden opslaan + timestamps
- [ ] Voortgang tracking per student/paragraaf
- [ ] Docent-dashboard:
  - [ ] Welke leerlingen zitten vast op welke vragen?
  - [ ] Gemiddelde tijd per vraag
  - [ ] Welke vragen zijn lastig? (% correct)
- [ ] Aanbevelingen voor docent ("Vraag 14b is lastig, misschien hint toevoegen?")

**Output:** Data-driven onderwijs

---

### 🚀 FASE 5: Extra Vraagtypen (Maand 5-6)
**Doel:** Meer interactieve vraagtypen

**Features:**
- [ ] Drag & Drop (items naar juiste plek)
- [ ] Koppelen (links-rechts matchen)
- [ ] Sorteren (items in juiste volgorde)
- [ ] Hotspot (klik correct deel van afbeelding)
- [ ] Cloze/Invultabel (blanco's in tekst)

**Output:** Veel meer mogelijkheden voor interactieve vragen

---

### 🔄 FASE 6: Multi-Vak/Leerjaar Rollout (Maand 6-9)
**Doel:** Platform op school-schaal

**Features:**
- [ ] 2e vak toevoegen (Nederlands, Scheikunde, etc.)
- [ ] Content-kopiëren tussen vak/jaar/niveau
- [ ] Versioning/archiving van oude paragrafen
- [ ] Template-systeem (standaard paragrafen-templates)
- [ ] Import/export (voor backup, sharing)

**Output:** Multi-vak school-platform

---

## 3️⃣ DATABASE SCHEMA (Firestore)

### Collections Overzicht

```
firestore/
├── vak/                          # Alle vakken
│   └── {vakId}/
│       ├── name: "Wiskunde"
│       ├── code: "WIS"
│       ├── createdAt: timestamp
│       └── leerjaren[]           # refs naar leerjaar docs
│
├── leerjaar/                     # Per vak/jaar combo
│   └── {leerjaarId}/
│       ├── vakId: ref
│       ├── year: 1               # VMBO1, HAVO2, etc
│       ├── niveaus[]             # [VMBO-B, VMBO-GL, HAVO, VWO]
│       └── createdAt: timestamp
│
├── niveau/                       # Per vak/jaar/niveau
│   └── {niveauId}/
│       ├── vakId: ref
│       ├── leerjaarId: ref
│       ├── label: "VMBO-B"
│       └── createdAt: timestamp
│
├── hoofdstuk/                    # Bijvoorbeeld "7. Pythagoras"
│   └── {hoofdstukId}/
│       ├── niveauId: ref
│       ├── vakId: ref
│       ├── leerjaarId: ref
│       ├── number: 7
│       ├── title: "Pythagoras"
│       ├── beschrijving: "..."
│       ├── order: 1
│       ├── published: true
│       └── createdAt: timestamp
│
├── paragraaf/                    # Bijvoorbeeld "7.3 Langste zijde"
│   └── {paragraafId}/
│       ├── hoofdstukId: ref
│       ├── vakId: ref
│       ├── leerjaarId: ref
│       ├── niveauId: ref
│       ├── code: "7.3"
│       ├── title: "Langste zijde berekenen"
│       ├── beschrijving: "..."
│       ├── order: 3
│       ├── published: true
│       ├── pdfPath: "/boekafbeeldingen/7.3.pdf"  # Optional source PDF
│       ├── aiCompanionEnabled: true              # Socratische hulp aan/uit
│       ├── aiCompanionPrompt: "Jij helpt met..."  # System prompt
│       └── createdAt: timestamp
│
├── vraag/                        # Exerciseop/vraag
│   └── {vraagId}/
│       ├── paragraafId: ref
│       ├── hoofdstukId: ref
│       ├── vakId: ref
│       ├── leerjaarId: ref
│       ├── niveauId: ref
│       ├── number: "14a"
│       ├── title: "Vierkanten berekenen"
│       ├── vraagtype: "meerkeuze"        # open, meerkeuze, numeriek
│       ├── content: {
│       │   ├── text: "<p>Bereken...</p>"   # Rich text HTML
│       │   ├── images: [
│       │   │   ├── cropId: "crop_XXX"
│       │   │   ├── position: "above"       # above, below, left, right
│       │   │   └── width: 200
│       │   └── ]
│       │ }
│       ├── vraagMetadata: {
│       │   ├── difficulty: 3               # 1-5 sterren
│       │   ├── hints: ["Hint 1", "Hint 2"]
│       │   ├── showCalculator: true
│       │   ├── calculatorMode: "standard"  # standard, scientific
│       │ }
│       ├── antwoord: {
│       │   ├── type: "choice"              # choice, text, numeric
│       │   ├── options: [                  # for meerkeuze
│       │   │   ├── text: "16 cm²"
│       │   │   ├── correct: true
│       │   │   └── explanation: "4 × 4 = 16"
│       │   ]
│       │   ├── correctValue: 16            # for numeriek
│       │   ├── tolerance: 0.5              # ±0.5
│       │ }
│       ├── order: 1
│       ├── status: "published"             # draft, published, archived
│       └── createdAt: timestamp
│
├── crop/                         # Opgeslagen crop-selecties (BIJLAGE!)
│   └── {paragraafId}/crops/
│       └── {cropId}/
│           ├── paragraafId: ref
│           ├── sourceImageId: ref
│           ├── label: "Figuur 1"           # Docent gave it a name
│           ├── coordinates: { x, y, w, h }
│           ├── storagePath: "crops/7.3/crop_XXX.jpg"
│           ├── downloadURL: "https://..."
│           ├── ocrText: "De stelling van..."  # Automatische OCR
│           └── createdAt: timestamp
│
├── sourceImage/                  # Upload PDF/JPG per paragraaf
│   └── {paragraafId}/images/
│       └── {imageId}/
│           ├── paragraafId: ref
│           ├── originalName: "pythagoras-book-ch7.pdf"
│           ├── format: "pdf"                # pdf, jpg, png
│           ├── storagePath: "source-images/7.3/xxxxx"
│           ├── downloadURL: "https://..."
│           ├── pageCount: 14                # for PDFs
│           └── createdAt: timestamp
│
└── userAnswers/ (voor fase 4)   # Student-antwoorden (analytics)
    └── {studentId}/
        └── {vraagId}/
            ├── answer: "16"
            ├── correct: true
            ├── timestamp: timestamp
            ├── timeSpent: 45                # seconden
            └── hintCount: 1
```

---

## 4️⃣ UI/UX LAYOUT

### Admin CMS Main View

```
┌─────────────────────────────────────────────────────────────┐
│  WISKUNDE CMS  │ Vak: Wiskunde  │ Leerjaar: 1  │ Niveau: VMBO-B
├─────────────────────────────────────────────────────────────┤
│ 📁 Vak              │                                         │
│ ├─📂 Leerjaar 1     │  [Hoofdstuk 7: PYTHAGORAS]             │
│ │ ├─🎯 VMBO-B       │  ────────────────────────────────────   │
│ │ │ ├─📖 Hst 7: Pythagoras  │  7.1 Schuine zijde              │
│ │ │ │ ├─ 7.1 Schuine zijde  │  7.2 Midden-zijde              │
│ │ │ │ ├─ 7.2 Midden-zijde   │  7.3 Langste zijde   ← EDIT    │
│ │ │ │ └─ 7.3 Langste zijde  │                                 │
│ │ │ └─📖 Hst 8: Getallen     │  📝 Paragraaf: 7.3              │
│ │ └─🎯 VMBO-GL                Title: Langste zijde...         │
│ │ └─🎯 HAVO                   PDF: [Upload] [crop tool] ▶     │
│ └─📂 Leerjaar 2               AI Companion: [x] Enabled       │
│                               ────────────────────────────────
│ [+ Vak] [+ Leerjaar]          Vragen in deze paragraaf:      │
│ [+ Niveau] [+ Hoofdstuk]      ────────────────────────────────
│ [+ Paragraaf] [+ Vraag]       14a [ EDIT ] [ COPY ] [ ⋮ ]    │
│                               14b [ EDIT ] [ COPY ] [ ⋮ ]    │
│ 🔍 Zoeken op tag/title        14c [ EDIT ] [ COPY ] [ ⋮ ]    │
│                               ────────────────────────────────
│                               [+ Vraag] [↑] [↓]              │
└─────────────────────────────────────────────────────────────┘
```

### Vraag-Editor View

```
┌─────────────────────────────────────────────────────────────┐
│  VRAAG EDITOR: 7.3 - 14a (Vierkanten berekenen)             │
├─────────────────────────────────────────────────────────────┤
│ 📝 Titel: [Vierkanten berekenen          ]                  │
│ 🔢 Vraag-nummer: [14a]                                      │
│ 🏷️  Vraagtype: [Meerkeuze▼]                                │
│ ⭐ Moeilijkheid: ☆☆☆☆☆ (3 sterren)                        │
│                                                              │
│ ────────────────────────────────────────────────────────────│
│ ✏️ VRAAG-INHOUD                                             │
│ ────────────────────────────────────────────────────────────│
│ | Bereken de oppervlakte van de drie vierkan... | B I U     │
│ |                                                 | [ img ]  │
│ | [+ Afbeelding uit crop-bibliotheek]                       │
│ | [Drag to position image]                                  │
│                                                              │
│ ────────────────────────────────────────────────────────────│
│ ✅ ANTWOORD                                                 │
│ ────────────────────────────────────────────────────────────│
│ Opties:  (● = correct)                                      │
│ ( ) A. 16 cm²        [●] (dit is het juiste antwoord)      │
│ ( ) B. 25 cm²        Uitleg: 4 × 4 = 16                    │
│ ( ) C. 34 cm²        [Hint toevoegen]                       │
│ ( ) D. 49 cm²                                              │
│                                                              │
│ [+ Optie toevoegen]                                         │
│                                                              │
│ ────────────────────────────────────────────────────────────│
│ 🛠️ HULPMIDDELEN                                             │
│ ────────────────────────────────────────────────────────────│
│ [x] Hint beschikbaar                                        │
│     → "Bedenk: zijde × zijde"                              │
│     [+ Hint toevoegen]                                      │
│                                                              │
│ [x] Rekenmachine                                            │
│     Mode: [Standaard▼] (standaard/wetenschappelijk)         │
│                                                              │
│ ────────────────────────────────────────────────────────────│
│ 📊 STATUS & PREVIEW                                         │
│ ────────────────────────────────────────────────────────────│
│ Status: [Draft▼]  [Preview ▶]  [✓ Save]  [⋮ More]         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Crop-Tool (Refactored)

```
┌──────────────────────────────────────────────────┐
│  🖼️ CROP TOOL - Paragraaf 7.3                    │
├──────────────────────────────────────────────────┤
│ [Upload PDF/JPG]  [Existing images ▼]            │
│                                                   │
│ 🎯 Je bewerkt crops voor: 7.3 Langste zijde   │
│                                                   │
│  [PDF/JPG preview]                               │
│  Teken rechthoeken, dan geef ze een naam:        │
│                                                   │
│  Rechthoek 1: [Figuur 1       ] [📄 OCR]        │
│               [x: 100, y: 50]   [⚙️ Options]     │
│                                                   │
│  Rechthoek 2: [Driehoek ABC    ] [📄 OCR]        │
│               [x: 300, y: 100]   [⚙️ Options]     │
│                                                   │
│  [+ Nog een rechthoek]                           │
│                                                   │
│  [✓ Save Crops] [Cancel]                        │
│                                                   │
│  💡 Crop-bibliotheek (7.3):                      │
│  ├─ Figuur 1 (image)                             │
│  ├─ Driehoek ABC (image)                         │
│  └─ "De stelling van Pythagoras" (OCR-text)     │
└──────────────────────────────────────────────────┘
```

---

## 5️⃣ DIDACTISCHE OVERWEGINGEN

### AI Companion (Socratisch Model)
**Doel:** Student zelf tot antwoord brengen, niet antwoord geven

**Implementatie:**
```javascript
// System prompt (admin configurable per paragraaf):
"You are a Socratic tutor helping VMBO students understand Pythagoras.
- Do NOT give answers directly
- Ask guiding questions instead
- Example: Student says '16', you ask 'Can you show me how you got 16?'
- When student gets stuck, ask 'What would happen if we...?'
- Keep language simple (Dutch, VMBO level)"

// Prompt hierarchy:
1. Student asks question
2. Claude returns Socratic response
3. Student rethinks, tries again
4. Loop until correct or student gives up
```

### Moeilijkheidsgraad Integratie
**1 ster:** Basisoefening (werkstuk ingevuld, alleen invullen)  
**2 sterren:** Begeleiding nodig (hints beschikbaar)  
**3 sterren:** Zelfstandig (geen hints, wel calculator)  
**4-5 sterren:** Uitdaging (verdiepingsvragen, geen hulpmiddelen)

### Calculator Intelligentie
- **Standaard:** +, -, ×, ÷, % (voor basis rekenen)
- **Wetenschappelijk:** x², √, ^, sin/cos/tan (voor goniometrie)
- Per vraag bepaald → Docent stuurt differentiatie

---

## 6️⃣ TECHNISCHE STACK & CHOICES

### Frontend
- **Framework:** React (al in gebruik)
- **State:** Context API (relatief simpel CMS)
- **Rich Text Editor:** 
  - Option A: Slate.js (open-source, flexibel)
  - Option B: TipTap (based on Prosemirror, minder steil)
  - Option C: RemirrorJS (enterprise-grade)
  - **Aanbeveling:** Slate.js (gratis, goed voor afbeeldingen)

### Backend & AI
- **Database:** Firestore (al in gebruik)
- **Storage:** Firebase Storage (al in gebruik)
- **OCR:** 
  - Option A: Google Vision API (payed, maar accurate)
  - Option B: Tesseract.js (free, browser-based, minder nauwkeurig)
  - **Aanbeveling:** Google Vision (betere kwaliteit voor technische teksten)
- **AI Companion:** Claude API (jouw API key)

### DevOps
- **Hosting:** Firebase Hosting (al in gebruik)
- **Analytics:** Firebase Analytics + Google Analytics
- **Logging:** Firebase Cloud Logging
- **Backup:** Firestore export (Google Cloud)

---

## 7️⃣ IMPLEMENTATION RISKS & MITIGATION

### Risk 1: OCR Quality
**Problem:** Handgeschreven notities, formules slecht herkend  
**Mitigation:**
- Voeg review-stap in (admin accepteert/corrigeert OCR)
- Fallback: admin tikt tekst handmatig in
- Start met printed/typed content (makkelijker)

### Risk 2: Crop Library Explosion
**Problem:** Veel crops, moeilijk te vinden welke je nodig hebt  
**Mitigation:**
- Tagging-systeem (per crop: "formule", "diagram", "figuur")
- Thumbnails met preview
- Zoeken op naam

### Risk 3: Performance (1000+ vragen)
**Problem:** Firestore queries worden traag, navigation tree explosief  
**Mitigation:**
- Cache navigation tree in React Context
- Pagination bij veel vragen
- Indexing op vakId + leerjaarId

### Risk 4: AI Cost Blowout
**Problem:** Veel students gebruiken AI companion, API-costs hoog  
**Mitigation:**
- Rate limiting (max 3 hints per vraag)
- Caching van common responses
- AI optional (admin kan uitzetten per paragraaf)
- Monitor costs weekly

### Risk 5: Admin UX Overload
**Problem:** Zoveel opties dat admin verdwaalt  
**Mitigation:**
- Stap-voor-stap wizard voor nieuwe paragraaf
- Defaults voor alles (docent hoeft niet alles in te stellen)
- "Quick start" templates

---

## 8️⃣ SUCCESS CRITERIA

### MVP Success (Einde Fase 2)
- [ ] Admin kan volledige hiërarchie creëren (Vak → Vraag)
- [ ] Admin kan 5+ vragen maken met afbeeldingen/OCR
- [ ] Student ziet vragen in leerpflattform
- [ ] Student kan antwoord geven en feedback krijgen
- [ ] Alle antwoorden opgeslagen in Firestore

### Fase 3 Success
- [ ] AI Companion geeft Socratische hints (testen met 3 students)
- [ ] Calculator werkt in vraag
- [ ] Admin rapporteert "feels like complete tool now"

### Fase 6 Success (Production)
- [ ] 2-3 vakken operationeel
- [ ] 300+ vragen live
- [ ] 50+ students actief
- [ ] Docent ziet analytics (welke vragen lastig zijn)
- [ ] NPS score van docenten ≥ 8/10

---

## 9️⃣ TIMELINE ESTIMATE

| Fase | Omschrijving | Weeks | FTE | Start |
|------|-------------|-------|-----|-------|
| 1 | Navigation + CRUD | 2-3 | 1 | Week 1 |
| 2 | Editor + Crops + OCR | 3-4 | 1.5 | Week 3 |
| 3 | AI + Calculator | 2 | 1 | Week 7 |
| 4 | Analytics | 2 | 0.5 | Week 9 |
| 5 | Extra vraagtypen | 2-3 | 1 | Week 11 |
| 6 | Multi-vak rollout | 2-4 | 1 | Week 14 |
| **TOTAAL** | | **13-20 wks** | **~1 FTE** | **5-6 maanden** |

---

## 🔟 JOUW FINAAL ANTWOORDEN (Vastgesteld)

✅ **OCR-workflow:** Automatisch (crop → OCR direct in editor)  
✅ **Crops hergebruik:** Fase 1 eigendom per vraag, globaal later  
✅ **Templates:** JA (standaard 5-vraag layout)  
✅ **Audit trail:** Nee (simpel, lastchanged timestamp)  
✅ **AI Budget:** OpenRouter (gemultiploosde, budget ingebouwd)  
✅ **CMS Responsive:** Nee, desktop-only (sneller)  
✅ **Student feedback:** Later (fase na MVP)  
✅ **Editor:** RemirrorJS  
✅ **Extra features:** Preview + Batch-import + Dupliceren + Tabel-editor  
✅ **Start:** DEZE WEEK

---

## 📋 CHECKLIST VAN HIER NAAR IMPLEMENTATIE

- [ ] Jij geeft GO op dit plan (aanpassingen?)
- [ ] Wij definiëren database schema exacter (Firebase composite indexes nodig?)
- [ ] Wij kiezen rich-text editor (Slate.js of ander?)
- [ ] Wij kiezen OCR provider (Google Vision budget check?)
- [ ] Wij definiëren exact API-budget voor Claude
- [ ] Wij maken wireframes voor CMS UI
- [ ] Wij maken sample data (test-vak met test-vragen)
- [ ] **→ DAN PAS: Code schrijven**

---

**Volgende stap:** Jij geeft feedback op dit plan, wij passen aan, dan geven jij GO. Pas daarna beginnen we te bouwen! 🚀

