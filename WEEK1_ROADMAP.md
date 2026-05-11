# 📅 Week 1 Roadmap (11-15 Mei 2026)

**Goal:** Foundation setup + Database preparation + UI structure  
**No code written yet** - Planning & Setup week

---

## 📋 CHECKLIST DEZE WEEK

### 🟢 Maandag 11 Mei - Setup & Architecture

#### Morning (2-3 uur)
- [ ] **Review** het PLATFORM_ARCHITECTURE_PLAN.md nogmaals
- [ ] **Review** FIRESTORE_SCHEMA.md
- [ ] **Create** branch `feature/cms-platform` in git
- [ ] **Create** folder structure:
  ```
  src/
  ├── services/
  │   ├── cmsService.js      (new)
  │   ├── firestoreService.js (expand existing)
  │   └── storageService.js   (expand)
  ├── components/cms/         (new folder)
  │   ├── CmsShell.jsx
  │   ├── NavigationTree.jsx
  │   ├── VakSelector.jsx
  │   ├── HoofdstukForm.jsx
  │   ├── ParagraafForm.jsx
  │   ├── VraagEditor.jsx
  │   └── CropTool.jsx
  ├── types/
  │   ├── cms.types.js        (new)
  │   └── firestore.types.ts  (new)
  ├── pages/
  │   └── AdminCmsPage.jsx    (new - replaces AdminCropToolPage)
  └── hooks/
      └── useCms.js           (new - custom hook)
  ```

#### Afternoon (2-3 uur)
- [ ] **Create** TypeScript type definitions (`src/types/cms.types.js`)
  - Vak, Leerjaar, Niveau, Hoofdstuk, Paragraaf, Vraag types
  - Copy from FIRESTORE_SCHEMA.md as comments
- [ ] **Create** Firestore type definitions (`src/types/firestore.types.ts`)
  - Type-safe database models
- [ ] **Document** naming conventions (IDs, collections, etc.)

---

### 🟢 Dinsdag 12 Mei - Firestore Schema Setup

#### Morning (2-3 uur)
- [ ] **Manual setup** in Firebase Console (or via script):
  - Create collections: `vak`, `leerjaar`, `niveau`, `hoofdstuk`, `paragraaf`, `vraag`, `crop`, `sourceImage`, `userAnswers`
  - Set Firestore rules (read-only for now)
  - Create test data:
    - 1 Vak: "Wiskunde"
    - 1 Leerjaar: "VMBO 1"
    - 1 Niveau: "VMBO-B"
    - 1 Hoofdstuk: "7. Pythagoras"
    - 3 Paragrafen: "7.1", "7.2", "7.3"
    - 2 Vragen per paragraaf (minimal)

#### Afternoon (2-3 uur)
- [ ] **Write** Firestore initialization script (`scripts/initializeFirestore.js`)
  - Auto-create test data structure
  - Validate schema
- [ ] **Test** Firestore read access
- [ ] **Create** composite indexes (if needed for queries)

---

### 🟢 Woensdag 13 Mei - CMS Service Layer

#### Morning (2-3 uur)
- [ ] **Create** `cmsService.js` met read-only methods:
  ```javascript
  // Vak operations
  export const getVakken = async () → []
  export const getVak = async (vakId) → {}
  
  // Leerjaar operations
  export const getLeerjaren = async (vakId) → []
  
  // Niveau operations
  export const getNiveaus = async (leerjaarId) → []
  
  // Hoofdstuk operations
  export const getHoofdstukken = async (niveauId) → []
  
  // Paragraaf operations
  export const getParagrafen = async (hoofdstukId) → []
  export const getParagraaf = async (paragraafId) → {}
  
  // Vraag operations
  export const getVragen = async (paragraafId) → []
  export const getVraag = async (vraagId) → {}
  ```

#### Afternoon (2-3 uur)
- [ ] **Create** `useCms.js` custom hook:
  ```javascript
  // State management for CMS navigation
  export const useCms = () => {
    const [selectedVak, setSelectedVak] = useState(null)
    const [selectedLeerjaar, setSelectedLeerjaar] = useState(null)
    const [selectedNiveau, setSelectedNiveau] = useState(null)
    const [selectedHoofdstuk, setSelectedHoofdstuk] = useState(null)
    const [selectedParagraaf, setSelectedParagraaf] = useState(null)
    
    // Fetch methods
    // ...
    
    return { selectedVak, selectedLeerjaar, ... }
  }
  ```
- [ ] **Test** all read operations with test data

---

### 🟢 Donderdag 14 Mei - Navigation Tree UI

#### Morning (2-3 uur)
- [ ] **Create** `NavigationTree.jsx` component
  - Expandable tree (Vak → Leerjaar → Niveau → Hoofdstuk → Paragraaf)
  - Click to select, visual feedback
  - Styling (simple, functional)

#### Afternoon (2-3 uur)
- [ ] **Create** `CmsShell.jsx` (main layout)
  - Left sidebar: NavigationTree
  - Right panel: Content editor placeholder
  - Top bar: Breadcrumb (Wiskunde > VMBO 1 > 7. Pythagoras > 7.3)
- [ ] **Test** navigation (click items, tree expands/collapses)

---

### 🟢 Vrijdag 15 Mei - Write Operations & Commit

#### Morning (2-3 uur)
- [ ] **Add** write methods to `cmsService.js`:
  ```javascript
  // Create operations
  export const createParagraaf = async (hoofdstukId, data, userId) → paragraafId
  export const createVraag = async (paragraafId, data, userId) → vraagId
  
  // Update operations
  export const updateParagraaf = async (paragraafId, data) → void
  export const updateVraag = async (vraagId, data) → void
  
  // Delete operations
  export const archiveParagraaf = async (paragraafId) → void
  export const archiveVraag = async (vraagId) → void
  ```

#### Afternoon (2-3 uur)
- [ ] **Test** all operations with test data
- [ ] **Create** git commit: "WIP: CMS foundation - navigation tree, services, types"
- [ ] **Update** CLAUDE.md with new CMS structure docs
- [ ] **Create** checklist for next week (Fase 1 completion)

---

## 📊 Week 1 Deliverables

✅ **Database:**
- Firestore collections created
- Test data seeded
- Composite indexes created

✅ **Code Structure:**
- Folder hierarchy created
- Type definitions written
- CMS service layer started
- Custom hook implemented

✅ **UI (Wireframe):**
- Navigation tree component
- CMS shell layout
- Breadcrumb navigation

✅ **Documentation:**
- Architecture plan finalized
- Schema documented
- Week 1 roadmap completed
- Next week roadmap created

---

## 🚀 Next: Week 2 Roadmap (18-22 Mei)

**Goal:** Complete Fase 1 - Full CRUD for structure

### Week 2 Preview:
- [ ] Full paragraaf/vraag CRUD UI
- [ ] Volgorde aanpassen (drag & drop)
- [ ] Copy/duplicate vraag
- [ ] Archiving UI
- [ ] Batch-import CSV skeleton

### End of Week 2:
- Admin kan volledige hiërarchie creëren/bewerken
- Fase 1 COMPLETE ✅

---

## 📞 Questions/Blockers This Week

Wanneer je vastzit:
1. **Database query issues:** Check Firestore console, enable logging
2. **Component structure:** Refer to existing components (ClassOverview.jsx)
3. **Types:** Check FIRESTORE_SCHEMA.md for exact field names
4. **UI:** Keep it simple/functional, pretty later

---

## ⏰ Time Estimate

| Activity | Hours |
|----------|-------|
| Setup & Planning | 2 |
| Type Definitions | 3 |
| Firestore Setup | 2 |
| CMS Service Layer | 3 |
| Navigation Tree UI | 3 |
| Write Operations | 2 |
| **TOTAL** | **15 hours** |

**Spread over:** 5 days = ~3 hrs/day ✅

---

**Status:** Ready to code on Monday! 🚀

