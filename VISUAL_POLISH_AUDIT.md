# Visual Polish Audit: Stelling van Pythagoras Platform

**Audit Date:** 2026-05-10  
**Focus:** Design consistency, intentionality, and refinement details  
**Status:** Comprehensive analysis of typography, layout, and visual polish systems

---

## EXECUTIVE SUMMARY

The platform demonstrates **strong foundational design** with clear intentionality in typography and layout. However, there are **inconsistencies in visual details** (border radius, shadows, borders) that create a "handcrafted" feel rather than a polished system. The design would benefit from **standardization** of micro-details while preserving the intentional hierarchy.

**Key Finding:** Most inconsistencies are *not* broken—they're just not *systematic*. This is medium priority but high-impact for perceived polish.

---

## 1. BORDER RADIUS CONSISTENCY AUDIT

### Current Usage Analysis

| Element Type | Current | Frequency | Pattern |
|---|---|---|---|
| **Buttons (Primary)** | `rounded-lg` (0.5rem) | 12x | Navigation buttons, CTAs |
| **Buttons (Secondary)** | `rounded-xl` (0.75rem) | 8x | Toggle buttons, form buttons |
| **Input Fields** | `rounded-xl` (0.75rem) | 4x | Text inputs |
| **Cards/Containers** | Mixed: `rounded-xl`, `rounded-2xl`, `rounded-3xl` | 30x | High variation |
| **Tables** | `rounded-3xl` (1.875rem) | 1x | Exercise tables |
| **Images** | `rounded-[3rem]` (3rem) | 3x | Large content images |
| **Dividers/Lines** | `rounded-full` (50%) | 32x | Progress bars, badges |
| **Modals/Large Boxes** | `rounded-[3rem]` to `rounded-3xl` | 5x | Welcome slide, errors |

### Problems Identified

1. **No clear hierarchy:** Why are primary buttons `rounded-lg` but secondary buttons `rounded-xl`? This inverts expected behavior (smaller = simpler, should be less rounded).

2. **Card inconsistency:** Same element type (cards) uses 3+ different radii (`rounded-xl`, `rounded-2xl`, `rounded-3xl`).

3. **Large images:** `rounded-[3rem]` (3rem) is very generous—this looks different from button radii, creating disconnect.

4. **Intentional or accidental?** No clear pattern distinguishes intentional variation (semantic meaning) from inconsistency.

### Recommendations

**Priority: HIGH** (visual cohesion)

#### Option A: Strict Consistency System (Recommended)
```
rounded-lg  (0.5rem)  → Buttons, form inputs, small UI
rounded-xl  (0.75rem) → Cards, smaller modals, badges  
rounded-2xl (1rem)    → Medium containers, expanded cards
rounded-3xl (1.875rem)→ Large modals, major sections
rounded-full (50%)    → Circular elements only (avatars, progress indicators)
rounded-[custom]      → Images ONLY (justify with specific aspect ratio needs)
```

**Action Items:**
- [ ] Map all buttons to `rounded-lg` (currently mixed `lg`/`xl`)
- [ ] Standardize cards to `rounded-xl` (currently 3 sizes)
- [ ] Reduce image border-radius to `rounded-2xl` (from `rounded-[3rem]`)
- [ ] Keep `rounded-full` only for inherently circular elements

**Impact:**
- Reduced cognitive load—users see consistent "button-ness," "card-ness"
- Medical/educational tone → slightly sharper edges signal precision (avoid overly rounded)
- Time to implement: ~2 hours across 30+ components

---

## 2. SHADOW USAGE CONSISTENCY

### Current Usage Analysis

| Shadow Type | Frequency | Usage | Consistency |
|---|---|---|---|
| `shadow-sm` | 21x | Subtle dividers, cards | ✓ Consistent |
| `shadow-md` | 4x | Active button state | ✗ Inconsistent (some use `shadow-md`, some omit) |
| `shadow-lg` | 13x | Hover states, emphasis | ✗ Mixed: sometimes `shadow-lg`, sometimes none |
| `shadow-xl` | 6x | Strong emphasis (buttons, modals) | ~ Sometimes `shadow-2xl` instead |
| `shadow-2xl` | 8x | Maximum emphasis (PDF canvas, welcome) | ✓ Clear max-depth use |
| `shadow-[custom]` | 9x | Color-specific shadows | ✗ Mixes standard + custom |
| `shadow-inner` | 4x | Inset shadows (inputs) | ✓ Clear semantic meaning |
| `shadow-none` | 2x | Disabled states | ✓ Clear |

### Problems Identified

1. **No shadow strategy:** It's unclear when shadows warrant use. Why does PDF canvas get `shadow-2xl` but input fields only `shadow-inner`?

2. **Hover feedback inconsistent:** Some buttons add `shadow-lg` on hover; others don't shadow at all, using only translation (`hover:-translate-y-2`).

3. **Custom shadows mixed with standard:** Components use both `shadow-lg` and `shadow-[0_30px_60px_-10px_...]`, making it hard to maintain.

4. **No progression system:** There's no clear visual language for "which shadow means what?"

### Recommended Shadow System

**Priority: HIGH** (interaction clarity)

```
shadow-none          → Disabled, inactive, flat elements
shadow-sm            → Subtle separation (1px dividers, flat cards)
shadow-md            → Active/pressed state (button pressed, input focused)
shadow-lg            → Hover/interactive (buttons hovering, cards interactive)
shadow-xl            → Modal/overlay elevation (modals, important cards)
shadow-2xl           → Maximum depth (floating elements, canvas, hero sections)
shadow-inner         → Inset effect ONLY (input wells, contained areas)
```

**Shadow Progression for Interactive Elements:**

```
REST → shadow-sm + regular position
HOVER → shadow-lg + translate-up
ACTIVE → shadow-md + translate-none
```

**Action Items:**
- [ ] Audit all buttons: ensure `shadow-sm` (rest) → `shadow-lg` (hover) → `shadow-md` (active)
- [ ] Standardize card shadows: `shadow-sm` for flat cards, `shadow-md` for interactive cards
- [ ] Remove custom shadows; replace with standard scale
- [ ] Document shadow meaning in design tokens

**Current vs Proposed:**

PresentationSlide buttons:
```jsx
// CURRENT: Mixed system
className="...shadow-md hover:shadow-lg active:shadow-md..."

// PROPOSED: Clearer progression
className="...shadow-sm hover:shadow-lg active:shadow-md..."
```

---

## 3. STROKE/BORDER THICKNESS CONSISTENCY

### Current Usage Analysis

| Border Width | Frequency | Usage | Context |
|---|---|---|---|
| `border` (1px) | ~35x | Subtle separation | ✓ Consistent |
| `border-2` (2px) | 14x | Input focus, badges | ✗ Mixed with `border` |
| `border-4` | 15x | Table cells, input highlights | ✗ No clear threshold |
| `border-[8px]` | 3x | Image frames | ✗ Custom variant |
| `border-[10px]` | 1x | Summary slide frame | ✗ Custom variant |
| No border | ~40% | Cards, containers | ✗ Inconsistent decision |

### Problems Identified

1. **No decision rule:** When should a card have a border? Why do some inputs have `border-2` and others `border`?

2. **Dividers unclear:** All horizontal dividers are `border-slate-200`, but weight varies (1px vs 2px).

3. **Interaction borders unconnected:** Input focus states use `border-4` or custom `border-[8px]`, but there's no system relating input size to border weight.

4. **Custom borders justify image "frames" but inconsistent:** `[8px]` on PresentationSlide images vs `[10px]` on SummarySlide.

### Recommended Border System

**Priority: MEDIUM** (not broken, but unprofessional)

```
border-1 (1px)   → Subtle dividers, separations, low hierarchy
border-2 (2px)   → Form inputs, interactive elements, medium hierarchy  
border-4 (4px)   → Input FOCUS states, error/success highlights
border-8 (8px)   → Image frames ONLY (decorative border for hero images)

No border         → Use strategically; shadow provides sufficient separation
```

**Decision Tree:**

```
Is it a divider?          → border-1 (color: slate-200)
Is it an input?           → border-2 (color: slate-300 default, blue-500 focus)
Is it an input error?     → border-4 (color: red-400)
Is it an input success?   → border-4 (color: green-400)
Is it a table cell?       → border-4 (color: slate-100)
Is it an image frame?     → border-[8px] (color: white)
Otherwise?                → No border (rely on shadow for separation)
```

**Action Items:**
- [ ] Standardize all horizontal/vertical dividers to `border-1 border-slate-200`
- [ ] Inputs: `border-2 border-slate-300` (default), `border-2 border-blue-500` (focus), `border-4 border-red-400` (error)
- [ ] Tables: `border-4 border-slate-100`
- [ ] Images: `border-[8px] border-white`
- [ ] Remove inconsistent custom borders (`[10px]` → `[8px]`)

**Current Examples:**

ExerciseSlide input:
```jsx
// CURRENT: Inconsistent
className="...border-4 outline-none transition-all duration-300 ${
  isRevealed ? 'border-amber-400 bg-amber-50...' :
  status[f.id] === 'correct' ? 'border-green-400...' :
  status[f.id] === 'incorrect' ? 'border-red-400...' :
  'border-slate-100 focus:border-blue-500...'
}"

// PROPOSED: Clarify the hierarchy
className="...border-2 outline-none transition-all duration-300 ${
  isRevealed ? 'border-4 border-amber-400 bg-amber-50...' :  // highlight state
  status[f.id] === 'correct' ? 'border-4 border-green-400...' :
  status[f.id] === 'incorrect' ? 'border-4 border-red-400...' :
  'border-2 border-slate-300 focus:border-blue-500 focus:ring-4...'  // standard + focus
}"
```

---

## 4. COLOR USAGE & HIERARCHY

### Current Palette Analysis

**Primary Colors:**
- `blue-600` — Primary action, accents (buttons, highlights)
- `blue-500`, `blue-700` — Variations (hover, alternative)

**Semantic Colors:**
- `green-500`/`green-400` — Success, correct answers
- `red-600`/`red-400` — Errors, incorrect
- `amber/yellow-500` — Warnings, revealed answers
- `slate-*` — Neutral spectrum

**Text Hierarchy (3-tier system):**
- Tier 1 (Dark): `text-slate-900` — Primary text, headings
- Tier 2 (Medium): `text-slate-600` — Secondary text, subtitles
- Tier 3 (Light): `text-slate-400`, `text-slate-500` — Tertiary, disabled

### Analysis

✓ **STRENGTHS:**
- 3-color text hierarchy IS consistently applied
- Semantic colors (green/red/amber) used meaningfully
- Primary color (blue-600) dominates CTAs
- Contrast ratios appear to meet WCAG AAA

✗ **WEAKNESSES:**
- `slate-700` sometimes used instead of `slate-600` (breaks tier-2 consistency)
- Background colors: white, slate-50, blue-50, slate-50/30, indigo-50 → **5 backgrounds inconsistently applied**
- `indigo-*` appears in WelcomeSlide but nowhere else (orphaned color)
- `orange-*`, `yellow-*`, `purple-*` scattered in secondary elements (unused in design system)

### Recommendations

**Priority: MEDIUM** (color doesn't break anything, but could be simplified)

#### Standardize Color Palette

**Primaries:**
```
Blue-600    → Main CTAs, primary interactive elements
Blue-500    → Alternative interactive states
Blue-700    → Hover/active states
```

**Semantic:**
```
Green-500   → Success, correct answers, positive feedback
Red-600     → Errors, incorrect answers, warnings
Amber-500   → Neutral highlights, revealed answers, caution
```

**Neutral:**
```
Slate-900   → Primary text
Slate-700   → (REMOVE: merge into slate-600)
Slate-600   → Secondary text
Slate-500   → Tertiary text
Slate-400   → Disabled, very light
```

**Backgrounds:**
```
White       → Primary content areas
Slate-50    → Subtle backgrounds, alternating rows
Blue-50     → Contextual highlights (keyboard hints, info boxes)
--- REMOVE ---
Indigo-50, Orange-*, Purple-*, Yellow-*
```

**Action Items:**
- [ ] Replace all `text-slate-700` with `text-slate-600`
- [ ] Consolidate background variants: use only white, slate-50, blue-50
- [ ] Remove orphaned colors (indigo, orange, purple, yellow)
- [ ] Document final palette in `index.css` with comments

---

## 5. HOVER/FOCUS/ACTIVE STATES

### Current State Implementation

**Button Pattern (PresentationSlide):**
```jsx
className="...bg-blue-600 
  hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 
  active:translate-y-0 active:shadow-md 
  disabled:bg-slate-200 disabled:opacity-60 
  focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
```

**Pattern Analysis:**

| State | Visual | Implementation | Consistency |
|---|---|---|---|
| **Rest** | Solid color, shadow-sm | Color only | ✗ Shadow omitted on rest |
| **Hover** | Color + lift + shadow | `hover:bg-700 hover:shadow-lg hover:-translate-y-0.5` | ✓ Consistent on CTAs |
| **Active** | Color + pressed + shadow-md | `active:shadow-md active:translate-y-0` | ✓ Consistent |
| **Focus** | Ring visible | `focus:ring-4 focus:ring-blue-300 focus:ring-offset-2` | ✗ Inconsistent (some have ring-offset, some don't) |
| **Disabled** | Faded, not clickable | `disabled:opacity-60 disabled:cursor-not-allowed` | ✓ Clear |

### Problems Identified

1. **Resting shadow missing:** Buttons don't have `shadow-sm` on rest, making them feel flat before hover.

2. **Focus ring inconsistency:** Some inputs use `focus:ring-2 focus:ring-blue-500`, others use `focus:ring-4 focus:ring-blue-300 focus:ring-offset-2`. No consistent spacing.

3. **Hover not universal:** Form inputs, cards, and other interactive elements don't have consistent hover states.

4. **Translation distance inconsistent:** `hover:-translate-y-0.5` (2px) on buttons, but some use `hover:-translate-y-2` (8px) for larger emphasis.

5. **Active state unclear:** Does `active:translate-y-0` mean "return to rest position" or "move down"? (It returns to rest, but naming is ambiguous.)

### Recommended State System

**Priority: HIGH** (interaction clarity)

#### Standardized Interactive Element States

```jsx
// BUTTON PATTERN (Primary CTAs)
className="
  px-8 py-4 rounded-lg 
  bg-blue-600 shadow-sm
  hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1
  active:bg-blue-800 active:translate-y-0 active:shadow-md
  focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2
  disabled:bg-slate-300 disabled:text-slate-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none
  transition-all duration-200"

// SECONDARY BUTTON PATTERN
className="
  px-8 py-4 rounded-lg 
  bg-slate-100 text-slate-700 shadow-sm
  hover:bg-slate-200 hover:shadow-md hover:-translate-y-0.5
  active:bg-slate-300 active:translate-y-0 active:shadow-sm
  focus:outline-none focus:ring-4 focus:ring-slate-300
  disabled:opacity-60 disabled:cursor-not-allowed
  transition-all duration-200"

// FORM INPUT PATTERN
className="
  px-6 py-3 rounded-xl
  border-2 border-slate-300 bg-white
  focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none
  hover:border-slate-400
  disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
  transition-all duration-200"

// CARD/INTERACTIVE CONTAINER PATTERN
className="
  p-6 rounded-xl border border-slate-200 bg-white shadow-sm
  hover:border-blue-200 hover:shadow-md hover:bg-blue-50/30
  active:shadow-sm
  focus:outline-none focus:ring-2 focus:ring-blue-300
  transition-all duration-200 cursor-pointer"
```

**State Color Changes (not just movement):**

```
REST    → Normal color
HOVER   → +1 shade darker (blue-600 → blue-700)
ACTIVE  → +2 shades darker (blue-600 → blue-800)
FOCUS   → Ring color (blue-300)
DISABLED→ Muted (slate-300/400) + opacity-60
```

**Action Items:**
- [ ] Apply button pattern to ALL CTAs (currently some missing shadow-sm on rest)
- [ ] Standardize focus ring: `focus:ring-4 focus:ring-{color}-300 focus:ring-offset-2` (consistent offset)
- [ ] Add hover states to ALL interactive cards (currently some have none)
- [ ] Consistent translation: `-translate-y-1` (4px) for hover on all elements
- [ ] Replace ambiguous `active:translate-y-0` with clearer pattern

---

## 6. VISUAL WEIGHT DISTRIBUTION

### Slide Type Analysis

#### TheorySlide
```
Layout: 50/50 text | image split
Issue: Text (left) feels heavier due to larger font
Verdict: ✓ Intentional—image is *visual* anchor, text is *cognitive* anchor
```

#### ExerciseSlide
```
Layout: Large heading + image (optional) + input fields
Issues: 
- Heading too large (text-9xl) dominates
- Input fields feel small/secondary despite being main task
- AI tutor sidebar collapses on small screens
Verdict: ✗ Hierarchy inverted—instructions should be more prominent
```

#### PresentationSlide
```
Layout: Header (heading + nav) | Canvas | Footer (nav buttons)
Issues:
- Canvas justified (flexbox center) → feels balanced
- Footer shadow-lg competes with header shadow-sm
- Too much navigation real estate (header + footer)
Verdict: ~ Balanced but could streamline
```

#### WelcomeSlide
```
Layout: Centered gradient background + instruction box + button
Issues: None—very clean weight distribution
Verdict: ✓ Excellent hierarchy
```

#### SummarySlide
```
Layout: Icon circle + heading + content box
Issues:
- Icon circle (w-40 h-40) very large
- Heading (text-9xl) very large
- Content box has border-[10px]—over-emphasized
Verdict: ✗ Too much visual weight on "done" state
```

### Recommendations

**Priority: MEDIUM** (hierarchy is clear, but could be refined)

#### ExerciseSlide Rebalancing
- Reduce heading from `text-9xl` → `text-8xl` (less dominant)
- Increase input field padding/size slightly (more prominence)
- Make instructions text larger (currently secondary size)

#### SummarySlide Simplification
- Reduce icon circle from `w-40` → `w-32` (still prominent)
- Reduce border from `[10px]` → `[8px]` (consistent with images)
- Move heading down in visual hierarchy (slightly smaller)

---

## 7. CONSISTENCY CHECK

### Inventory of Inconsistencies

| Element | Current | Standard | Issue |
|---|---|---|---|
| **Heading Size** | text-6xl to text-9xl | Varies by context | ✗ No system |
| **Body Text** | text-lg to text-4xl | Varies | ✗ No system |
| **Icon Size** | 16px to 100px | Varies | ✗ Inconsistent scale |
| **Padding** | p-4 to p-24 | Varies | ✓ Justified by context |
| **Gap/Margin** | gap-2 to gap-32 | Varies | ✗ No consistent spacing scale |
| **Button Size** | px-8 py-4 to px-12 py-6 | Varies | ~ Some variation needed |
| **Form Input Size** | w-24 to w-full | Varies | ✓ Contextual |
| **List Items** | space-y-3 to space-y-8 | Varies | ✗ No clear pattern |
| **Border Color** | slate-200, slate-100, blue-200 | Inconsistent | ✗ Use slate-200 everywhere |
| **Focus Ring Color** | blue-300, blue-500, blue-200 | Mixed | ✗ Standardize to blue-300 |

### Action Items for Consistency

**CRITICAL (breaking consistency):**
- [ ] Standardize all border colors to `border-slate-200` (or `slate-100` for subtle)
- [ ] Standardize focus rings to `focus:ring-4 focus:ring-blue-300`
- [ ] Consolidate form input border colors (currently `slate-300` default, should all be same)

**HIGH:**
- [ ] Create spacing scale: define when to use gap-4, gap-6, gap-8, gap-12 (currently random)
- [ ] Create icon size scale: sm (16px), md (24px), lg (32px), xl (48px)
- [ ] Standardize list spacing: `space-y-4` for all lists (currently varies)

**MEDIUM:**
- [ ] Document heading sizes for each context (no system currently)
- [ ] Ensure all buttons follow same padding pattern

---

## 8. ANIMATION & TRANSITION CONSISTENCY

### Current Implementation

| Animation | Usage | Consistency |
|---|---|---|
| `animate-in fade-in duration-500` | Page loads | ✓ Consistent |
| `animate-in zoom-in-95 duration-500` | Success states | ✓ Clear |
| `animate-in slide-in-from-*` | Entrance animations | ✓ Directional |
| `transition-colors` | Color changes | ✓ Standard |
| `transition-all` | Mixed properties | ✗ Overkill (overly broad) |
| `hover:-translate-y-2` | Interactive feedback | ✓ Consistent |
| `animate-spin` | Loading spinners | ✓ Standard |
| `animate-bounce` | Success icon | ✓ Celebratory |

### Analysis

✓ **STRENGTHS:**
- Entrance animations consistent
- Duration standardized (500ms / 700ms)
- Easing feels natural

✗ **WEAKNESSES:**
- `transition-all` used too broadly (should use `transition-colors`, `transition-transform`, etc.)
- No standardized duration—some 300ms, some 500ms, some 700ms
- Loading states could be more prominent

### Recommendations

**Priority: LOW** (animations aren't broken, but could be optimized)

#### Standardize Animation Durations

```
Focus/quick-feedback  → 200ms (fast)
Page transition       → 500ms (medium)
Entrance animation    → 700ms (slow, celebratory)
Loading state         → 2s (clearly loading)
```

#### Simplify Transitions

```jsx
// CURRENT: Overkill
className="transition-all"

// PROPOSED: Specific
className="transition-colors duration-200"  // for color changes only
className="transition-transform duration-200" // for movement
className="transition-shadow duration-200"    // for shadow
```

**Action Items:**
- [ ] Replace `transition-all` with specific properties
- [ ] Standardize durations to 200ms (quick), 300ms (interaction), 500ms (page), 700ms (entrance)
- [ ] Ensure all hover states have consistent duration (currently mixed)

---

## 9. ACCESSIBILITY POLISH

### Current State

| Aspect | Current | Status |
|---|---|---|
| **Focus Rings** | `focus:ring-4 focus:ring-blue-300 focus:ring-offset-2` | ✓ Visible and attractive |
| **Touch Targets** | Min 3rem (48px) on buttons | ✓ WCAG AAA |
| **Color Contrast** | Black text on white, blue buttons on white | ✓ Likely AAA |
| **Color Blindness** | Not relying on red/green alone (using borders + text) | ✓ Good |
| **Disabled States** | `opacity-60` + `cursor-not-allowed` | ✓ Clear |
| **Error Messages** | Red background + text + icon | ✓ Redundant coding |
| **Success Feedback** | Green border + check icon + text | ✓ Redundant coding |
| **Keyboard Navigation** | All buttons have `focus:ring` | ✓ Implemented |

### Issues

1. Focus ring offset (`focus:ring-offset-2`) inconsistent—some inputs omit offset
2. Disabled states could be clearer (opacity alone can be subtle)
3. No loading accessibility states (spinner needs `aria-busy`)
4. Alert messages need proper `role="alert"`

### Recommendations

**Priority: MEDIUM** (already good, minor improvements)

**Action Items:**
- [ ] Standardize focus ring offset across all interactive elements
- [ ] Add `aria-busy="true"` to loading spinners
- [ ] Add `role="alert"` to error/success messages
- [ ] Test color contrast with WCAG checker (verify AAA compliance)
- [ ] Increase disabled state opacity to `opacity-50` (currently 60% is subtle)

---

## 10. MICRO-DETAILS & POLISH

### Input Placeholders
- ✓ Good: "Antwoord..." on exercise inputs
- ✗ Bad: "..." on table inputs (not helpful)
- Recommendation: Replace with meaningful placeholders

### Button Icons
- ✓ Consistent: All icons 20-24px on standard buttons
- ✗ Large buttons (exercise): Icons 36-40px (inconsistent with small buttons)
- Recommendation: Define icon size relative to button size

### Checkbox/Radio Styles
- Status: Not defined anywhere
- Recommendation: Define if used

### Error Message Styling
- ✓ Good: Red background + border + clear text
- Missing: Error icon in PresentationSlide error modal
- Recommendation: Add icon for visual recognition

### Success Messages
- ✓ Good: Green background + check icon + text
- ✓ Good: Bounce animation on SummarySlide
- ✓ Good: Toast notifications styled consistently

### Loading States
- ✓ Spinner with progress bar on PresentationSlide
- ✓ Loader2 icon with "Denken..." text on AITutor
- Missing: Skeleton screens (N/A for current design)
- Recommendation: Ensure all async operations show loading state

---

## VISUAL CONSISTENCY AUDIT TABLE

| Element | Current | Standard | Recommendation |
|---|---|---|---|
| **BORDER RADIUS** | | | |
| Primary Buttons | rounded-lg | rounded-lg | ✓ Keep |
| Secondary Buttons | rounded-xl | rounded-lg | → Change to rounded-lg |
| Form Inputs | rounded-xl | rounded-lg | → Change to rounded-lg |
| Cards | Varied (xl/2xl/3xl) | rounded-xl | → Standardize |
| Images | rounded-[3rem] | rounded-2xl | → Reduce |
| Tables | rounded-3xl | rounded-xl | → Standardize |
| Modals | rounded-3xl | rounded-2xl | → Consistent large |
| **SHADOWS** | | | |
| Button Rest | None | shadow-sm | → Add |
| Button Hover | shadow-lg | shadow-lg | ✓ Keep |
| Button Active | shadow-md | shadow-md | ✓ Keep |
| Cards (flat) | shadow-sm | shadow-sm | ✓ Keep |
| Cards (interactive) | Varied | shadow-md | → Standardize |
| Modals | shadow-2xl | shadow-xl | ~ Reduce slightly |
| Images | shadow-2xl | shadow-2xl | ✓ Keep |
| **BORDERS** | | | |
| Dividers | border-1 | border-1 | ✓ Keep |
| Inputs (default) | Varies | border-2 | → Standardize |
| Inputs (focus) | border-4 | border-2 + ring-4 | ~ Refine |
| Tables | border-4 | border-4 | ✓ Keep |
| Image Frame | [8px]/[10px] | border-[8px] | → Standardize |
| Cards | Varies | border-1 optional | → Decide if cards need borders |
| **COLORS** | | | |
| Primary CTA | blue-600 | blue-600 | ✓ Keep |
| Text (Primary) | slate-900 | slate-900 | ✓ Keep |
| Text (Secondary) | slate-600/700 | slate-600 | → Standardize |
| Text (Tertiary) | slate-400/500 | slate-500 | → Standardize |
| Backgrounds | White/slate-50/blue-50/others | White/slate-50/blue-50 | → Simplify |
| Success | green-500 | green-500 | ✓ Keep |
| Error | red-600/400 | red-600 | ~ Standardize |
| Warning | amber-500 | amber-500 | ✓ Keep |
| **STATES** | | | |
| Button Hover | color + shadow + translate | color + shadow + translate | ✓ Keep |
| Focus Ring | ring-4 ring-blue-300 offset-2 | ring-4 ring-blue-300 offset-2 | ~ Inconsistent offset |
| Disabled | opacity-60 | opacity-50 | → Increase contrast |
| Active Input | border-4 + bg color | border-2 + ring-4 | ~ More sophisticated |

---

## POLISH RECOMMENDATIONS (Priority-Ordered)

### CRITICAL (Visual Breaks)
1. **Standardize border radius scale** — Reduces cognitive load, improves cohesion
   - Implement standard sizes (lg/xl/2xl/3xl)
   - Impact: High / Effort: 2 hours

2. **Fix button styling inconsistencies** — Currently Primary button < Secondary button visual weight
   - Primary buttons `rounded-lg` should be slightly more prominent than secondary
   - Impact: High / Effort: 1 hour

### HIGH (Significant Visual Improvement)
3. **Implement shadow progression system** — Currently ad-hoc, hard to maintain
   - Buttons: rest=shadow-sm, hover=shadow-lg, active=shadow-md
   - Cards: consistent shadow-sm baseline
   - Impact: High / Effort: 3 hours

4. **Standardize focus ring behavior** — Inconsistent ring-offset, missing in some places
   - All interactive: `focus:ring-4 focus:ring-blue-300 focus:ring-offset-2`
   - Impact: Medium / Effort: 1 hour

5. **Consolidate input border strategy** — Currently mixed 1px/2px/4px
   - Default: `border-2 border-slate-300`
   - Focus: Add `focus:ring-4` (not just border change)
   - Error/Success: `border-4 border-red/green-400`
   - Impact: High / Effort: 2 hours

### MEDIUM (Nice-to-Have Refinements)
6. **Simplify background colors** — Currently 5+ variants, reduce to 3
   - White (content) / Slate-50 (subtle) / Blue-50 (contextual)
   - Impact: Medium / Effort: 1.5 hours

7. **Standardize spacing scale** — Currently random gaps, no system
   - Define: gap-4 (small), gap-6 (medium), gap-8 (large), gap-12 (section)
   - Impact: Medium / Effort: 2 hours

8. **Standardize icon sizes** — Currently 16-100px with no pattern
   - Define: sm (16px), md (24px), lg (32px), xl (48px)
   - Impact: Low / Effort: 1.5 hours

### LOW (Optional Enhancements)
9. **Simplify transitions** — Replace `transition-all` with specific properties
   - Impact: Low / Effort: 1 hour

10. **Add loading state refinements** — Already good, minor aria improvements
    - Impact: Low / Effort: 0.5 hours

---

## DESIGN PATTERNS TO STANDARDIZE

### 1. BUTTON PATTERN

**Primary CTA Button:**
```jsx
className="
  flex items-center gap-3 px-8 py-4 min-h-[3rem]
  rounded-lg bg-blue-600 text-white text-base font-bold
  shadow-sm
  hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1
  active:bg-blue-800 active:translate-y-0 active:shadow-md
  disabled:bg-slate-300 disabled:text-slate-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none
  focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2
  transition-all duration-200"
```

**Secondary Button:**
```jsx
className="
  flex items-center gap-3 px-8 py-4 min-h-[3rem]
  rounded-lg bg-slate-100 text-slate-700 text-base font-bold
  shadow-sm
  hover:bg-slate-200 hover:shadow-md hover:-translate-y-0.5
  active:bg-slate-300 active:translate-y-0 active:shadow-sm
  disabled:opacity-60 disabled:cursor-not-allowed
  focus:outline-none focus:ring-4 focus:ring-slate-300
  transition-all duration-200"
```

### 2. FORM INPUT PATTERN

```jsx
className="
  w-full px-6 py-3 rounded-lg
  border-2 border-slate-300 bg-white text-slate-900
  placeholder:text-slate-400
  hover:border-slate-400
  focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none
  disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
  transition-all duration-200"
```

**Form Input (Error State):**
```jsx
className="...border-4 border-red-400 focus:ring-red-200..."
```

**Form Input (Success State):**
```jsx
className="...border-4 border-green-400 focus:ring-green-200..."
```

### 3. CARD PATTERN

**Flat Card:**
```jsx
className="
  p-6 rounded-xl border border-slate-200 bg-white
  shadow-sm
  transition-all duration-200"
```

**Interactive Card:**
```jsx
className="
  p-6 rounded-xl border border-slate-200 bg-white
  shadow-sm
  hover:border-blue-200 hover:shadow-md hover:bg-blue-50/20
  focus:outline-none focus:ring-2 focus:ring-blue-300
  active:shadow-sm
  cursor-pointer
  transition-all duration-200"
```

### 4. TEXT PATTERN

**Primary Text:**
```jsx
className="text-slate-900 font-[weight] text-[size]"
```

**Secondary Text:**
```jsx
className="text-slate-600 font-[weight] text-[size]"
```

**Tertiary Text:**
```jsx
className="text-slate-500 font-[weight] text-[size]"
```

**Disabled Text:**
```jsx
className="text-slate-400"
```

### 5. FEEDBACK MESSAGE PATTERN

**Error Message:**
```jsx
className="
  bg-red-50 border-4 border-red-400 text-red-800
  rounded-xl px-6 py-4
  flex gap-3 items-start
  animate-shake"
```

**Success Message:**
```jsx
className="
  bg-green-50 border-4 border-green-400 text-green-800
  rounded-xl px-6 py-4
  flex gap-3 items-start
  animate-in zoom-in"
```

**Warning Message:**
```jsx
className="
  bg-amber-50 border-2 border-amber-200 text-amber-800
  rounded-xl px-6 py-4
  flex gap-3 items-start"
```

---

## IMPLEMENTATION ROADMAP

### Phase 1: Foundations (Day 1)
1. Standardize border-radius scale
2. Fix button styling (rounded-lg consistency)
3. Implement shadow progression system
4. Estimated effort: 4 hours

### Phase 2: Polish (Day 2)
5. Standardize input borders and focus rings
6. Consolidate colors (remove orphaned colors)
7. Standardize spacing scale
8. Estimated effort: 4 hours

### Phase 3: Refinement (Day 3)
9. Simplify transitions
10. Add accessibility improvements
11. Icon size standardization
12. Estimated effort: 3 hours

**Total Effort:** ~11 hours  
**Risk:** Low—mostly CSS changes, no logic changes  
**Testing Strategy:** Visual regression testing + manual QA across all slide types

---

## BEFORE/AFTER EXAMPLES

### Example 1: Button Consistency

**BEFORE:**
```jsx
// Navigation button (rounded-lg)
<button className="px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 hover:shadow-lg...">
  Vorige
</button>

// Form submit button (rounded-xl)
<button className="px-12 py-6 rounded-xl bg-blue-600 shadow-[0_20px_40px...]...">
  Kijk na
</button>

// Secondary action (rounded-2xl)
<button className="px-10 py-6 rounded-2xl bg-indigo-50...">
  AI Hulp
</button>
```

**AFTER:**
```jsx
// Primary CTA (consistent rounded-lg)
<button className="px-8 py-4 rounded-lg bg-blue-600 shadow-sm hover:shadow-lg...">
  Vorige
</button>

// Primary CTA, larger (same rounded-lg, larger padding)
<button className="px-12 py-6 rounded-lg bg-blue-600 shadow-sm hover:shadow-lg...">
  Kijk na
</button>

// Secondary action (rounded-lg, different color)
<button className="px-10 py-6 rounded-lg bg-slate-100 text-slate-700 shadow-sm...">
  AI Hulp
</button>
```

### Example 2: Shadow Progression

**BEFORE:**
```jsx
// No shadow on rest, only on hover
<button className="bg-blue-600 hover:shadow-lg...">Rest state has no shadow</button>

// Some buttons with different shadows
<button className="shadow-md active:shadow-lg...">Inconsistent</button>
```

**AFTER:**
```jsx
// Shadow on all states: light → heavier → medium (pressed)
<button className="shadow-sm hover:shadow-lg active:shadow-md...">
  Rest: shadow-sm → Hover: shadow-lg → Active: shadow-md
</button>
```

### Example 3: Input Border Strategy

**BEFORE:**
```jsx
<input className="border-2 border-slate-300 focus:border-blue-500 focus:ring-2..." />
<input className="border-4 border-slate-100..." /> {/* different input, different border */}
```

**AFTER:**
```jsx
{/* All inputs: 2px default border */}
<input className="border-2 border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200..." />

{/* Error state: 4px red border for emphasis */}
<input className="border-4 border-red-400 focus:ring-4 focus:ring-red-200..." />

{/* Success state: 4px green border */}
<input className="border-4 border-green-400 focus:ring-4 focus:ring-green-200..." />
```

---

## DESIGN SYSTEM RECOMMENDATIONS

### Should We Define Formal Design Tokens?

**Current State:** No design tokens—styles scattered in component classNames

**Recommendation:** YES, establish token hierarchy

**Minimal Design Token File Structure:**

```js
// design-tokens.js
export const tokens = {
  // Border Radius Scale
  radius: {
    sm: '0.375rem',    // rounded-sm (rarely used)
    md: '0.5rem',      // rounded-lg
    lg: '0.75rem',     // rounded-xl
    xl: '1rem',        // rounded-2xl
    '2xl': '1.875rem', // rounded-3xl
    full: '9999px',    // rounded-full
  },
  
  // Shadow Scale
  shadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  
  // Spacing Scale
  space: {
    2: '0.5rem',   // gap-2
    4: '1rem',     // gap-4
    6: '1.5rem',   // gap-6
    8: '2rem',     // gap-8
    12: '3rem',    // gap-12
  },
  
  // Color Palette
  colors: {
    primary: '#2563eb',     // blue-600
    success: '#22c55e',     // green-500
    error: '#dc2626',       // red-600
    warning: '#f59e0b',     // amber-500
  },
  
  // Transition
  transition: {
    fast: '200ms',
    normal: '300ms',
    slow: '500ms',
    slowest: '700ms',
  }
};
```

**Benefit:** Easier to update entire design system (one file vs. search-replace)

### Should We Create a Component Library?

**Current State:** Components scattered, styling in classNames

**Recommendation:** YES, but start small

**Minimum Viable Component Library:**

```jsx
// Button.jsx - single source of truth
export function Button({ variant = 'primary', size = 'md', ...props }) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-lg',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-8 py-4 text-base rounded-lg',
    lg: 'px-12 py-6 text-lg rounded-lg',
  };
  
  return (
    <button 
      className={`${variants[variant]} ${sizes[size]} focus:ring-4 focus:ring-blue-300...`}
      {...props}
    />
  );
}

// Input.jsx
export function Input({ error, disabled, ...props }) {
  return (
    <input 
      className={`border-2 rounded-lg px-6 py-3 ${
        error ? 'border-4 border-red-400' : 'border-slate-300'
      }...`}
      disabled={disabled}
      {...props}
    />
  );
}

// Card.jsx
export function Card({ interactive, ...props }) {
  return (
    <div 
      className={`p-6 rounded-xl border border-slate-200 shadow-sm ${
        interactive ? 'hover:shadow-md hover:border-blue-200 cursor-pointer' : ''
      }...`}
      {...props}
    />
  );
}
```

**Benefits:**
- Single source of truth for styling
- Easier to update globally
- Reduces component code duplication
- Enforces consistency

**Effort:** ~3 hours to extract core components (Button, Input, Card, Modal)

### Minimum Viable Design System

**Phase 1 (Essential):** Design tokens file + component library
**Phase 2 (Nice):** Storybook for documentation
**Phase 3 (Future):** Figma design system (sync with code)

---

## SUMMARY TABLE: What to Change First

| Priority | Item | Why | Effort | Impact |
|---|---|---|---|---|
| 🔴 CRITICAL | Standardize border-radius | Currently 7 different values (lg/xl/2xl/3xl/custom/full) | 2h | High |
| 🔴 CRITICAL | Add shadow-sm to button rest state | Currently only on hover—breaks visual hierarchy | 1h | High |
| 🟠 HIGH | Standardize input borders (2px default, 4px error) | Currently mixed 1px/2px/4px with no logic | 2h | High |
| 🟠 HIGH | Fix focus ring consistency (all ring-4 ring-blue-300 offset-2) | Currently some missing offset, inconsistent values | 1h | Medium |
| 🟠 HIGH | Implement shadow progression (sm → lg → md) | Currently ad-hoc, hard to maintain | 3h | High |
| 🟡 MEDIUM | Consolidate background colors (remove indigo/orange/purple) | Currently 5+ variants, confusing | 1.5h | Medium |
| 🟡 MEDIUM | Standardize spacing scale (define when to use gap-4/6/8/12) | Currently random, no system | 2h | Medium |
| 🟢 LOW | Simplify transitions (replace transition-all) | Not broken, just inelegant | 1h | Low |

---

## FINAL RECOMMENDATIONS SUMMARY

### Immediate Actions (Day 1—4 hours)
1. Create `design-tokens.js` with border-radius, shadow, spacing scales
2. Standardize all buttons to `rounded-lg` (add `rounded-lg` to secondary buttons currently `rounded-xl/2xl`)
3. Add `shadow-sm` to all button rest states (currently missing)
4. Standardize all input borders: `border-2` default, `border-4` for error/success/focus

### Follow-Up Actions (Day 2—4 hours)
5. Implement shadow progression system: `shadow-sm` (rest) → `shadow-lg` (hover) → `shadow-md` (active)
6. Standardize focus rings: ALL interactive elements → `focus:ring-4 focus:ring-blue-300 focus:ring-offset-2`
7. Remove orphaned colors (indigo, orange, purple) from codebase
8. Consolidate backgrounds to white / slate-50 / blue-50

### Refinement Actions (Day 3—3 hours)
9. Create component library (Button, Input, Card, Modal) to enforce patterns
10. Standardize spacing scale documentation
11. Add accessibility improvements (aria-busy, role="alert")

### Design System Establishment (Optional—2 hours)
12. Document all patterns in component library README
13. Consider Storybook for future component documentation

---

## CONCLUSION

The Pythagoras platform has **strong foundational design** with clear hierarchy and good UX. The visual inconsistencies identified are **not critical bugs** but rather **polish opportunities** that would elevate the perceived quality from "functional" to "intentional and professional."

**Key Insight:** Most variation is not wrong—it's just not *systematic*. By establishing clear rules for when to use what (border-radius scale, shadow progression, spacing scale), the entire platform will feel more cohesive and maintainable.

**Recommended Approach:**
1. Don't redesign—refine
2. Standardize the edges (borders, radius, shadows)
3. Create component patterns to enforce consistency
4. Document decisions for future maintainers

**Expected Outcome:** Platform moves from "hand-crafted feel" (good but inconsistent) to "designed system feel" (professional and maintainable).

