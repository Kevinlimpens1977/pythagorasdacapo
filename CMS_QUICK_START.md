# 🚀 CMS Quick Start Guide

**Your go-to reference for this week!**

---

## 📍 Where Are We?

```
WEEK 1 (NOW)         → Foundations (types, services, navigation)
├─ Database schema created
├─ Read/write services created
└─ Navigation tree UI

WEEK 2              → Fase 1 CRUD (full structure editing)
└─ Paragraphs & vragen create/edit/delete/copy/reorder

WEEK 3-4            → Fase 2 Editor (rich text + crops)
├─ Vraag-editor (RemirrorJS)
├─ Crop-tool refactored
└─ OCR integration

WEEK 5              → Fase 3 AI + Calculator
├─ AI Companion (Socratic)
└─ Embedded calculator

WEEK 6+             → Fase 4+ Polish & Scaling
└─ Analytics, extra question types, multi-vak rollout
```

---

## 📚 Key Docs (Read These First!)

1. **PLATFORM_ARCHITECTURE_PLAN.md** ← Big picture vision
2. **FIRESTORE_SCHEMA.md** ← Exact data structure
3. **WEEK1_ROADMAP.md** ← This week's tasks (READ THIS DAILY)
4. **This file** ← Quick reference

---

## 🗂️ Folder Structure (New)

```
src/
├── services/
│   ├── cmsService.js              ← READ/WRITE CRUD ops
│   ├── firestoreService.js        ← Expand existing
│   └── storageService.js          ← Expand existing
│
├── components/cms/                ← NEW FOLDER
│   ├── CmsShell.jsx               ← Main layout
│   ├── NavigationTree.jsx         ← Vak → Leerjaar → ... tree
│   ├── VakSelector.jsx            ← Dropdown for vak
│   ├── HoofdstukForm.jsx          ← Create/edit hoofdstuk
│   ├── ParagraafForm.jsx          ← Create/edit paragraaf
│   ├── VraagEditor.jsx            ← Create/edit vraag (later)
│   └── CropTool.jsx               ← Refactored crop tool
│
├── hooks/
│   └── useCms.js                  ← State management for CMS
│
├── types/
│   ├── cms.types.js               ← Type definitions (JSDoc)
│   └── firestore.types.ts         ← TypeScript types
│
└── pages/
    └── AdminCmsPage.jsx           ← Main CMS page
```

---

## 💾 Firestore Collections (Copy This!)

```
firestore/
├── vak/                           ← Wiskunde, Nederlands, ...
├── leerjaar/                      ← VMBO 1, VMBO 2, ...
├── niveau/                        ← VMBO-B, HAVO, VWO
├── hoofdstuk/                     ← 7. Pythagoras, 2. Getallen
├── paragraaf/                     ← 7.1, 7.2, 7.3, ...
├── vraag/                         ← 14a, 14b, 14c, ...
├── crop/                          ← Opgeslagen crops
├── sourceImage/                   ← PDF/JPG per paragraaf
└── userAnswers/                   ← Student antwoorden (analytics)
```

---

## 🔑 Key IDs (Naming Convention)

```javascript
// ID Format Examples:
vakId:         "wiskunde-2024" or "wis-vmbo-2024"
leerjaarId:    "vmbo1-2024" or "havo2-2024"
niveauId:      "vmbo-b-2024"
hoofdstukId:   "pythagoras-ch7-2024" or "wis-ch7-2024"
paragraafId:   "python-71-2024" or "wis-ch7-para1-2024"
vraagId:       "wis-73-14a-2024"
cropId:        "crop_abc123_timestamp"
imageId:       "img_xyz789_timestamp"

// Convention:
// {descriptive}_{year}
// OR
// {code}_{sequential}
// Keep it URL-safe (no spaces, special chars)
```

---

## 🛠️ Service Methods (This Week)

### Reading Data
```javascript
// src/services/cmsService.js

// Vak
getVakken()                          → Promise<Vak[]>
getVak(vakId)                        → Promise<Vak>

// Leerjaar
getLeerjaren(vakId)                  → Promise<Leerjaar[]>
getLeerjaar(leerjaarId)              → Promise<Leerjaar>

// Niveau
getNiveaus(leerjaarId)               → Promise<Niveau[]>
getNiveau(niveauId)                  → Promise<Niveau>

// Hoofdstuk
getHoofdstukken(niveauId)            → Promise<Hoofdstuk[]>
getHoofdstuk(hoofdstukId)            → Promise<Hoofdstuk>

// Paragraaf
getParagrafen(hoofdstukId)           → Promise<Paragraaf[]>
getParagraaf(paragraafId)            → Promise<Paragraaf>

// Vraag
getVragen(paragraafId)               → Promise<Vraag[]>
getVraag(vraagId)                    → Promise<Vraag>
```

### Writing Data (Friday)
```javascript
// Create
createParagraaf(hoofdstukId, data, userId)  → Promise<string> (paragraafId)
createVraag(paragraafId, data, userId)      → Promise<string> (vraagId)

// Update
updateParagraaf(paragraafId, data)          → Promise<void>
updateVraag(vraagId, data)                  → Promise<void>

// Delete/Archive
archiveParagraaf(paragraafId)               → Promise<void>
archiveVraag(vraagId)                       → Promise<void>
```

---

## 🎣 Custom Hook (useCms.js)

```javascript
// Usage in components:
const {
  selectedVak,
  selectedLeerjaar,
  selectedNiveau,
  selectedHoofdstuk,
  selectedParagraaf,
  
  setSelectedVak,
  setSelectedLeerjaar,
  // ... etc
  
  vakken,          // fetched
  leerjaren,       // fetched
  niveaus,         // fetched
  hoofdstukken,    // fetched
  paragrafen,      // fetched
  vragen,          // fetched
  
  loading,
  error
} = useCms()

// Then in JSX:
{vakken.map(v => <option value={v.id}>{v.name}</option>)}
```

---

## 📝 Test Data (Monday Setup)

Create this manually in Firestore:

```json
{
  "vak": {
    "wiskunde-2024": {
      "name": "Wiskunde",
      "code": "WIS",
      "icon": "📐",
      "order": 1
    }
  },
  "leerjaar": {
    "vmbo1-2024": {
      "vakId": "wiskunde-2024",
      "year": 1,
      "label": "VMBO Jaar 1",
      "niveaus": ["VMBO-B", "VMBO-GL"]
    }
  },
  "niveau": {
    "vmbo-b-2024": {
      "vakId": "wiskunde-2024",
      "leerjaarId": "vmbo1-2024",
      "label": "VMBO-B",
      "order": 1
    }
  },
  "hoofdstuk": {
    "pythagoras-ch7-2024": {
      "vakId": "wiskunde-2024",
      "leerjaarId": "vmbo1-2024",
      "niveauId": "vmbo-b-2024",
      "number": 7,
      "title": "Pythagoras",
      "order": 1,
      "published": true
    }
  },
  "paragraaf": {
    "python-73-2024": {
      "vakId": "wiskunde-2024",
      "leerjaarId": "vmbo1-2024",
      "niveauId": "vmbo-b-2024",
      "hoofdstukId": "pythagoras-ch7-2024",
      "code": "7.3",
      "title": "Langste zijde berekenen",
      "order": 3,
      "published": true,
      "aiCompanionEnabled": true
    }
  },
  "vraag": {
    "wis-73-14a-2024": {
      "vakId": "wiskunde-2024",
      "paragraafId": "python-73-2024",
      "number": "14a",
      "title": "Vierkanten berekenen",
      "vraagtype": "meerkeuze",
      "order": 1,
      "published": true,
      "content": {
        "text": "<p>Bereken oppervlakte</p>"
      }
    }
  }
}
```

---

## 🔗 References This Week

| When You Need | Go To |
|---------------|-------|
| Database field names | FIRESTORE_SCHEMA.md |
| Type definitions | src/types/cms.types.js |
| Daily tasks | WEEK1_ROADMAP.md (scroll to day) |
| Service methods | this file + FIRESTORE_SCHEMA.md |
| UI components reference | src/components/ (existing code) |
| State management | useCms.js |

---

## ⚠️ Common Pitfalls (Avoid These!)

❌ **Don't:**
- Create document IDs without year/version suffix (will conflict later)
- Store passwords or sensitive data in Firestore
- Forget `isArchived` / `published` fields
- Use complex nested structures (Firestore has depth limits)
- Write `userAnswers` without `timestamp` (analytics broken)

✅ **Do:**
- Use references (documentReference) instead of duplicating data
- Add `createdAt`, `updatedAt`, `createdBy` to everything
- Keep documents < 1MB
- Use composite indexes for complex queries
- Test read/write permissions early

---

## 🎯 Success Criteria (End of Week 1)

- [ ] All test data in Firestore
- [ ] All service methods working (read + write)
- [ ] useCms hook functional
- [ ] NavigationTree component shows data
- [ ] CmsShell layout looks good
- [ ] No console errors
- [ ] Git commit ready

---

## 📱 Keyboard Shortcuts (Optional, add later)

```
Ctrl+S       Save current form
Escape       Close modal
Alt+N        New paragraaf
Alt+Q        New vraag
Ctrl+/       Toggle AI companion on/off
```

---

## 🆘 Getting Help

1. **Error in service?** Check Firestore permissions in console
2. **Component not showing data?** Log `selectedVak` in useCms hook
3. **Type error?** Add JSDoc comments to cms.types.js
4. **Performance slow?** Check Firestore query indexes

---

## 📍 This Week's Endpoint

After Friday:
- Git branch: `feature/cms-platform` with all foundation code
- Ready to start **Fase 1 CRUD UI** next Monday

---

**Status: Ready to Start!** 🚀  
**Next: Read WEEK1_ROADMAP.md for detailed daily tasks**

