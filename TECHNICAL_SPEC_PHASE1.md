# Technical Specification - Phase 1: PDF Integration
## 7.3 Langste zijde berekenen (Hybrid Option 3)

**Status:** Ready for Implementation  
**Timeline:** 2-3 days  
**Scope:** PDF viewer + attendance tracking only  
**Date:** 2026-05-10

---

## Overview

**Phase 1 Goal:** Get PDF slidedeck working on digibord (teacher presentation) + in-app viewing (students) with attendance tracking.

**What Gets Built:**
1. ✅ PDF viewer component (`PresentationSlide.jsx`)
2. ✅ Attendance tracking in Firebase
3. ✅ Teacher Dashboard attendance indicator
4. ✅ NO evaluation questions
5. ✅ NO real-time sync
6. ✅ NO native slide components (yet)

**What Doesn't Change:**
- Exercise slides (after presentation)
- Existing slide types
- Authentication
- Other chapters

---

## Component Architecture

### New Component: `PresentationSlide.jsx`

**Location:** `src/components/slides/PresentationSlide.jsx`

**Props:**
```javascript
{
  slide: {
    id: "p73_presentation",
    type: "presentation",
    title: "7.3 Langste zijde berekenen",
    heading: "De Bouwtekening van de Driehoek",
    pdfPath: "/boekafbeeldingen/7.3-slidedeck.pdf",
    totalPages: 14
  },
  chapterId: "para_73",
  onPageChange: (pageNumber) => {}  // For tracking progress
}
```

**Responsibilities:**
1. Render PDF using pdf.js
2. Navigation controls (prev/next/jump to page)
3. Page counter display
4. Track when user first viewed
5. Send "presentation viewed" event to Firebase

**Features:**
- Fullscreen button
- Zoom controls (optional Phase 2)
- Slide counter: "Slide 3 of 14"
- Error handling (PDF failed to load)
- Responsive (works on tablet for digibord)

**UI Pattern:**
```
┌─────────────────────────────────────────┐
│ [Fullscreen]  7.3 Presentatie  [Exit]   │
├─────────────────────────────────────────┤
│                                         │
│           [PDF Rendered]                │
│           (14 pages)                    │
│                                         │
├─────────────────────────────────────────┤
│  [← Prev]  Slide 3 of 14  [Next →]     │
│  [Zoom -] [Zoom +] [Jump to slide]     │
└─────────────────────────────────────────┘
```

---

## Data Structure Changes

### Update: `para73.js`

**Add this entry at START of `para73Slides`:**

```javascript
export const para73Slides = [
  // NEW: Presentation slides (Phase 1)
  {
    id: "p73_presentation",
    type: "presentation",
    title: "7.3 Langste zijde berekenen",
    heading: "De Bouwtekening van de Driehoek",
    subtitle: "Hoe je de langste zijde berekent met de stelling van Pythagoras",
    pdfPath: "/boekafbeeldingen/7.3-slidedeck.pdf",
    totalPages: 14,
    duration: "15-20 minuten",  // Optional: teacher notes
    notes: "Presented by NotebookLM on 2026-05-10"
  },
  
  // EXISTING: Theory/exercise slides stay exactly the same
  {
    id: "p73_01",
    type: "theory",
    heading: "7.3 Langste zijde berekenen",
    content: "**Leerdoel:**\nJe leert hoe...",
    image: "/images/p73_intro.svg"
  },
  // ... rest of existing slides
];
```

**No changes needed to existing slides.**

---

## Firebase Schema

### New Data Path: `presentationViewed`

**In Firestore `users/{uid}/`:**

```javascript
{
  // Existing fields
  role: "student",
  displayName: "...",
  
  // NEW: Presentation viewing tracking
  presentationViewed: {
    para_73: {
      hasViewed: true,
      firstViewedAt: Timestamp(2026-05-10T14:30:00Z),
      lastViewedAt: Timestamp(2026-05-10T14:45:30Z),
      totalTimeSeconds: 915,
      pagesVisited: [1, 2, 3, 4, 5],  // Optional: detailed tracking
      maxPageReached: 14
    },
    para_74: {
      hasViewed: false
    }
  }
}
```

### Update Logic (in `PresentationSlide.jsx`)

**On component mount:**
```javascript
// Check if already viewed, set initial time
if (!userData.presentationViewed?.[chapterId]) {
  await updateDoc(userRef, {
    [`presentationViewed.${chapterId}.firstViewedAt`]: serverTimestamp(),
    [`presentationViewed.${chapterId}.hasViewed`]: true
  });
}

// Update on each page change (debounced)
await updateDoc(userRef, {
  [`presentationViewed.${chapterId}.lastViewedAt`]: serverTimestamp(),
  [`presentationViewed.${chapterId}.currentPage`]: pageNumber
});
```

---

## SlideRenderer Changes

### Update: `src/components/slides/SlideRenderer.jsx`

**Add PresentationSlide to imports:**
```javascript
import PresentationSlide from './PresentationSlide';
```

**Add to switch statement (render logic):**
```javascript
const renderSlide = () => {
  switch (currentSlide.type) {
    case 'presentation':
      return <PresentationSlide slide={currentSlide} chapterId={chapterId} />;
    case 'theory':
      return <TheorySlide slide={currentSlide} />;
    case 'exercise':
      return <ExerciseSlide slide={currentSlide} chapterId={chapterId} onVerified={handleVerified} />;
    // ... other types
  }
};
```

**No changes to progress tracking** (presentation viewed ≠ chapter completion).

---

## Teacher Dashboard Changes

### Update: `src/components/dashboard/ClassOverview.jsx`

**Add new column in student table:**

| Naam | Progress | 7.3 Presentatie | Laatste Actief |
|------|----------|-----------------|----------------|
| Anna | 45% | ✓ 14:30 | 10 min |
| Bob | 30% | ✗ | 2 uur |
| Cecilia | 60% | ✓ 14:28 | 5 min |

**Code implementation:**

```javascript
// New helper function
function hasViewedPresentation(student, chapterId) {
  return student.presentationViewed?.[chapterId]?.hasViewed || false;
}

function getViewedTime(student, chapterId) {
  const viewed = student.presentationViewed?.[chapterId];
  if (!viewed?.firstViewedAt) return null;
  return viewed.firstViewedAt.toDate 
    ? viewed.firstViewedAt.toDate()
    : new Date(viewed.firstViewedAt);
}

// In render: Add column
<td className="p-4 text-center">
  {hasViewedPresentation(student, 'para_73') ? (
    <div className="flex items-center justify-center gap-2">
      <CheckCircle className="text-green-500" size={20} />
      <span className="text-sm text-slate-600">
        {getRelativeTime(getViewedTime(student, 'para_73'))}
      </span>
    </div>
  ) : (
    <div className="flex items-center justify-center gap-2">
      <Circle className="text-slate-300" size={20} />
      <span className="text-sm text-slate-400">Nog niet</span>
    </div>
  )}
</td>
```

**Optional Phase 2 enhancement:**
- Add column per chapter (7.3, 7.4, 7.5, 7.6)
- Add filter: "Show only students who haven't viewed 7.3"
- Add sorting: "Sort by presentation viewed"

---

## PDF Viewer Implementation

### Library Choice: `pdf.js`

**Why:** Industry standard, works in browser, no backend needed.

**Installation:**
```bash
npm install pdfjs-dist
```

**Basic Implementation Pattern:**

```javascript
import * as pdfjsLib from 'pdfjs-dist';

export default function PresentationSlide({ slide, chapterId }) {
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdf, setPdf] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef(null);

  // Load PDF on mount
  useEffect(() => {
    pdfjsLib.getDocument(slide.pdfPath).promise.then(pdf => {
      setPdf(pdf);
      setTotalPages(pdf.numPages);
      setIsLoading(false);
    });
  }, [slide.pdfPath]);

  // Render current page
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    pdf.getPage(pageNum).then(page => {
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      const context = canvasRef.current.getContext('2d');
      
      canvasRef.current.width = viewport.width;
      canvasRef.current.height = viewport.height;

      page.render({
        canvasContext: context,
        viewport: viewport
      });
    });
  }, [pdf, pageNum]);

  // Track viewing in Firebase
  useEffect(() => {
    if (pageNum > 1 || !slideFirstViewed) {
      trackPresentation(chapterId);
    }
  }, [pageNum]);

  const handlePrevious = () => {
    if (pageNum > 1) setPageNum(pageNum - 1);
  };

  const handleNext = () => {
    if (pageNum < totalPages) setPageNum(pageNum + 1);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Controls */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-800">
        <h2 className="text-white text-lg font-bold">{slide.heading}</h2>
        <span className="text-white text-sm">
          Slide {pageNum} of {totalPages}
        </span>
      </div>

      {/* PDF Canvas */}
      <div className="flex-1 flex items-center justify-center overflow-auto bg-slate-900 p-4">
        {isLoading ? (
          <div className="text-white">PDF wordt geladen...</div>
        ) : (
          <canvas ref={canvasRef} className="max-w-full max-h-full" />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-6 px-6 py-4 bg-slate-800">
        <button onClick={handlePrevious} disabled={pageNum === 1} className="px-4 py-2 rounded bg-blue-600 text-white">
          ← Vorige
        </button>
        <span className="text-white">{pageNum} / {totalPages}</span>
        <button onClick={handleNext} disabled={pageNum === totalPages} className="px-4 py-2 rounded bg-blue-600 text-white">
          Volgende →
        </button>
      </div>
    </div>
  );
}
```

---

## Dependencies to Install

```bash
npm install pdfjs-dist
```

**Versions:**
- pdfjs-dist: ^4.0.0 or latest

---

## File Changes Summary

| File | Change | Type |
|------|--------|------|
| `src/components/slides/PresentationSlide.jsx` | NEW | Component |
| `src/components/slides/SlideRenderer.jsx` | EDIT | Add case for "presentation" type |
| `src/components/dashboard/ClassOverview.jsx` | EDIT | Add attendance column |
| `src/data/para73.js` | EDIT | Add 1 presentation slide entry |
| `package.json` | EDIT | Add pdfjs-dist dependency |

---

## Testing Checklist (Phase 1)

### Functionality
- [ ] PDF loads correctly in presentation view
- [ ] Page navigation works (prev/next buttons)
- [ ] Page counter updates
- [ ] Zoom/scale works on different screen sizes
- [ ] Error handling if PDF fails to load

### Firebase
- [ ] First view recorded (hasViewed = true, firstViewedAt set)
- [ ] Subsequent views update lastViewedAt
- [ ] Data appears in correct user document
- [ ] Works for both admin and student roles

### Teacher Dashboard
- [ ] Attendance column shows correctly
- [ ] ✓/✗ indicators display properly
- [ ] Time shown is accurate
- [ ] Works with multiple students

### UX
- [ ] Layout responsive on desktop/tablet
- [ ] Fullscreen works
- [ ] Navigation intuitive
- [ ] Student can move to next section (exercises)

---

## Rollout Plan

### Day 1: Setup & Component
1. Install pdfjs-dist
2. Create PresentationSlide component
3. Wire into SlideRenderer
4. Test basic PDF rendering

### Day 2: Firebase Integration
1. Add presentationViewed schema
2. Implement tracking logic
3. Test data persistence
4. Verify for both admin/student roles

### Day 3: Dashboard & Polish
1. Update ClassOverview with attendance column
2. Test dashboard display
3. Styling/UX refinements
4. Full end-to-end testing
5. Deploy

---

## Notes for Phase 2

**For future enhancement (not Phase 1):**
- Extract images from PDF pages (one per slide)
- Create native slide components with same visuals
- Add optional evaluation questions (conditional on !isAdmin)
- Add time-on-slide metrics (currentPage, totalTime)
- Add zoom/annotation tools

**But Phase 1 is COMPLETE without these.**

---

## Success Criteria

✅ **Phase 1 is done when:**
1. PDF displays correctly on teacher's presentation
2. Students can view PDF in-app at home
3. Teacher dashboard shows attendance
4. All tests pass
5. No critical bugs

**Not required for Phase 1:**
- Perfect styling (good enough works)
- Advanced features (zoom, annotations)
- Multiple PDF support
- Evaluation questions

---

**Ready for implementation. Awaiting your GO signal.**
