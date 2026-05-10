# Layout & Spacing - Visual Mockups

**Visual representations of current state and recommended improvements**

---

## 1. SPACING SCALE COMPARISON

### Current Scale (Inconsistent Rhythm)

```
0px ├─── 4px ├─── 8px ├─────── 12px ├─────── 16px ├────────────── 24px ├─────────────────────────────── 32px
    │        │        │             │             │              │      │
    │ (rare) │ rare   │ occasional  │ common      │ common       │ common
    │        │        │             │             │              │
    4px      8px      12px          16px          24px           32px

32px ├─────────────────────────────── 48px ├────────────────────────────────── 64px ├───────── 96px (cap)
     │                                 │      │                                  │      │
     very common (jump 50%)           very   very common (jump 50%)            occasional (too large)
                                      common

Scale Problems:
• 32px → 48px jump: 50% increase (too large)
• 64px → 96px jump: 50% increase (inconsistent)
• No standard 40px option
• No proportional harmony in larger values
```

### Recommended Scale (Harmonious)

```
Progression: 1x → 1.5x → 2x → 2.5x → 3x → 4x → 5x → 6x

0px ├── 4px ├── 8px ├─── 12px ├─── 16px ├─── 20px ├─── 24px ├─── 32px ├─── 40px ├─── 48px ├─── 64px
    │micro │ tight │ compact  │ normal  │ comfort │breathing│ major   │ large  │ v.large │ x.large
    │      │       │          │         │         │ room    │ spacing │ spacing│ spacing │ spacing

Pattern Recognition:
• 4px base (micro)
• 8px = 2x base (tight)
• 12px = 1.5x tight (compact)
• 16px = 2x tight (normal) ← STANDARD
• 20px = 1.25x normal (comfort)
• 24px = 1.5x normal (breathing)
• 32px = 2x normal (major) ← BIG STEP
• 40px = 1.25x major (large)
• 48px = 1.5x major (v. large)
• 64px = 2x major (x. large)

This is:
✓ Proportional (recognizable rhythm)
✓ Industry standard (8px base)
✓ Easy to remember
✓ Works at any screen size
✓ Accessible (scales with content)
```

---

## 2. COMPONENT SPACING BEFORE/AFTER

### TheorySlide Layout

#### BEFORE (Current)
```
Laptop Screen (1024px):
┌──────────────────────────────────────────────────────────────────────────────┐
│ PADDING: p-8 md:p-16 lg:p-24                                                │
│ ┌──────────────────────────────────────────────────────────────────────────┐│
│ │ LEFT (50%): md:w-1/2                                                    ││
│ │  ┌─────────────────────────────────────────────────────────────────┐   ││
│ │  │ HEADING PADDING: p-8 md:p-16 lg:p-24 (32px → 96px)            │   ││
│ │  │                                                                 │   ││
│ │  │ ╔════════════════════════════════════════════════════════════╗ │   ││
│ │  │ ║ Stelling van Pythagoras                        (160px bold) ║ │   ││
│ │  │ ║ (text wrapping at 50% container width)                      ║ │   ││
│ │  │ ╚════════════════════════════════════════════════════════════╝ │   ││
│ │  │ GAP: mb-12 (48px)                                             │   ││
│ │  │ ╔════════════════════════════════════════════════════════════╗ │   ││
│ │  │ ║ a² + b² = c²                            (56px bold, loose) ║ │   ││
│ │  │ ║ Lorem ipsum dolor sit amet...        (no max-width: wide)  ║ │   ││
│ │  │ ║ ...                                                         ║ │   ││
│ │  │ ╚════════════════════════════════════════════════════════════╝ │   ││
│ │  └─────────────────────────────────────────────────────────────────┘   ││
│ │                                                                          ││
│ │ RIGHT (50%): md:w-1/2                                                   ││
│ │ PADDING: p-8 lg:p-16 (32px → 64px, different scale!)                   ││
│ │  ┌─────────────────────────────────────────────────────────────────┐   ││
│ │  │  ╔════════════════════════════════════════════════════════╗    │   ││
│ │  │  ║                                                        ║    │   ││
│ │  │  ║           [RIGHT TRIANGLE IMAGE]                      ║    │   ││
│ │  │  ║           max-h-[75vh]                                ║    │   ││
│ │  │  ║           border-[8px] rounded-[3rem]                ║    │   ││
│ │  │  ║                                                        ║    │   ││
│ │  │  ║           background: slate-50/30                    ║    │   ││
│ │  │  ║                                                        ║    │   ││
│ │  │  ╚════════════════════════════════════════════════════════╝    │   ││
│ │  └─────────────────────────────────────────────────────────────────┘   ││
│ │                                                                          ││
│ │ NO GAP BETWEEN LEFT AND RIGHT (items touching on desktop!)              ││
│ │                                                                          ││
│ └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ Issues Visible:
│ • Left padding (96px) vs right padding (64px) = ASYMMETRICAL
│ • Heading is HUGE (160px) compared to content (56px)
│ • Content text is very wide (50% of container) = HARD TO READ
│ • No gap between sections on desktop = CRAMPED
│ • No max-width on text = LONG LINES (70+ chars)
│ • Image height undefined = UNPREDICTABLE
│ • Mobile: Single column with 32px padding = REASONABLE
│ • Mobile→Desktop scaling is abrupt (p-16 at md, p-24 at lg)
└──────────────────────────────────────────────────────────────────────────────┘
```

#### AFTER (Recommended)
```
Laptop Screen (1024px):
┌──────────────────────────────────────────────────────────────────────────────┐
│ PADDING: px-4 sm:px-6 md:px-8 lg:px-12 (responsive & rational)              │
│ ┌──────────────────────────────────────────────────────────────────────────┐│
│ │ LAYOUT: flex gap-6 md:gap-8 lg:gap-12 (proper spacing!)                ││
│ │                                                                          ││
│ │ LEFT (100% md:w-1/2): flex flex-col justify-center (no extra padding)   ││
│ │  ┌──────────────────────────────────┐  GAP: 8 md:12 (24px → 32px)   ││
│ │  │ HEADING (no p-8 wrapper)         │  ├─→ gap-8 md:gap-12             ││
│ │  │ ╔════════════════════════════════╗│                                  ││
│ │  │ ║ Stelling van Pythagoras        ║│  (48px bold, consistent)        ││
│ │  │ ║ (shorter text, max-w-3xl)      ║│                                  ││
│ │  │ ║ ~65 chars per line = readable  ║│                                  ││
│ │  │ ╚════════════════════════════════╝│                                  ││
│ │  │ GAP: mb-8 md:mb-12 (32px → 48px) │                                  ││
│ │  │ ╔════════════════════════════════╗│                                  ││
│ │  │ ║ a² + b² = c²                   ║│  (24px body, optimized)        ││
│ │  │ ║ Lorem ipsum...                 ║│  max-w-3xl = proper line length ││
│ │  │ ║ (shorter content, easier read) ║│                                  ││
│ │  │ ╚════════════════════════════════╝│                                  ││
│ │  └──────────────────────────────────┘  ← NO EXTRA PADDING (cleaner)    ││
│ │                                                                          ││
│ │ RIGHT (100% md:w-1/2): flex items-center justify-center                ││
│ │ PADDING: none (image handles its own spacing)                           ││
│ │  ┌──────────────────────────────────┐                                  ││
│ │  │  ╔════════════════════════════════╗                                 ││
│ │  │  ║   [RIGHT TRIANGLE IMAGE]       ║  height: 400px → 500px → 600px ││
│ │  │  ║   Specific sizes (not %)       ║  responsive scaling             ││
│ │  │  ║   border-[8px] rounded-[3rem]  ║  scaled to screen size          ││
│ │  │  ║   shadow-lg                    ║                                 ││
│ │  │  ║   bg-slate-50/30               ║                                 ││
│ │  │  ╚════════════════════════════════╝                                 ││
│ │  └──────────────────────────────────┘                                  ││
│ │                                                                          ││
│ │ GAP BETWEEN LEFT AND RIGHT: lg:gap-12 (48px) = BALANCED                ││
│ │                                                                          ││
│ └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ Improvements:
│ ✓ Padding responsive & consistent (4→6→8→12)
│ ✓ Proper gap between sections (8→12)
│ ✓ Text has max-width (readable line length)
│ ✓ Image height specified (consistent)
│ ✓ Asymmetrical padding removed
│ ✓ Heading/content sizing balanced
│ ✓ Mobile view still single column (good)
│ ✓ Scales smoothly: mobile→tablet→desktop
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### ExerciseSlide Layout

#### BEFORE (Current)
```
Laptop Screen (1024px):
┌──────────────────────────────────────────────────────────────────────────┐
│ OUTER: p-8 lg:p-12 (32px → 48px, OK)                                   │
│ ┌────────────────────────────────────────────────────────────────────┐  │
│ │ HEADING AREA: mb-12 (48px gap below)                             │  │
│ │  ┌──────────────────────────────────────────────────────────────┐ │  │
│ │  │ Title (9xl = 144px)                                         │ │  │
│ │  │ Heading gap: mb-8 (32px)                                    │ │  │
│ │  │ Instructions (5xl = 48px)                                  │ │  │
│ │  └──────────────────────────────────────────────────────────────┘ │  │
│ │                                                                    │  │
│ │ MAIN LAYOUT: flex gap-16 lg:gap-32 items-center                 │  │
│ │ (PROBLEM: gap-32 = 128px!!!)                                     │  │
│ │                                                                    │  │
│ │ LEFT (lg:w-1/2): Image container                                 │  │
│ │  ┌──────────────────────┐  GAP: 128px        (way too much!)     │  │
│ │  │ ╔══════════════════╗ │  ├─→ lg:gap-32                        │  │
│ │  │ ║  [IMAGE]         ║ │  └─→ Creates huge space               │  │
│ │  │ ║  max-h-[50vh]    ║ │  └─→ Breaks visual flow               │  │
│ │  │ ║                  ║ │                                        │  │
│ │  │ ╚══════════════════╝ │                                        │  │
│ │  └──────────────────────┘                                        │  │
│ │                          │                                        │  │
│ │                          ▼                                        │  │
│ │                                                                   │  │
│ │ RIGHT (lg:w-1/2): Form container                                │  │
│ │ PADDING: p-4 (16px, too small!)                                 │  │
│ │  ┌──────────────────────────────────────────────────────────┐   │  │
│ │  │ FORM FIELDS: grid gap-8 (32px between fields)            │   │  │
│ │  │  ┌──────────────────────────────────────────────────────┐│   │  │
│ │  │  │ FIELD 1:  flex gap-4 items-center                   ││   │  │
│ │  │  │  ┌─────────────────────┬──────────────────────────┐ ││   │  │
│ │  │  │  │ Label               │ Input (px-6 py-4)       │ ││   │  │
│ │  │  │  │ text-right          │ flex-1                  │ ││   │  │
│ │  │  │  │ min-w-[100px]       │ border-4                │ ││   │  │
│ │  │  │  │ (tight: 16px gap)   │                         │ ││   │  │
│ │  │  │  └─────────────────────┴──────────────────────────┘ ││   │  │
│ │  │  │                                                      ││   │  │
│ │  │  │ REVEAL (if answered):                              ││   │  │
│ │  │  │  ┌──────────────────────────────────────────────┐  ││   │  │
│ │  │  │  │ Correct answer: [value]   p-4 ml-[130px]   │  ││   │  │
│ │  │  │  │ (hardcoded offset - brittle!)              │  ││   │  │
│ │  │  │  └──────────────────────────────────────────────┘  ││   │  │
│ │  │  │                                                      ││   │  │
│ │  │  │ HINT (if wrong):                                    ││   │  │
│ │  │  │  ┌──────────────────────────────────────────────┐  ││   │  │
│ │  │  │  │ Hint text   p-4 ml-[130px]                 │  ││   │  │
│ │  │  │  │ (also hardcoded offset!)                    │  ││   │  │
│ │  │  │  └──────────────────────────────────────────────┘  ││   │  │
│ │  │  │                                                      ││   │  │
│ │  │  └──────────────────────────────────────────────────────┘│   │  │
│ │  │                                                          │   │  │
│ │  │ (More fields with same pattern...)                     │   │  │
│ │  │                                                          │   │  │
│ │  │ BUTTONS: mt-8 flex gap-10 (40px gap, inconsistent!)     │   │  │
│ │  │  ┌──────────────────────┐      ┌────────────────────┐  │   │  │
│ │  │  │ Kijk na              │  ←→  │ AI Hulp (hidden)   │  │   │  │
│ │  │  │ px-12 py-6           │      │ px-10 py-6         │  │   │  │
│ │  │  └──────────────────────┘      └────────────────────┘  │   │  │
│ │  └──────────────────────────────────────────────────────────┘   │  │
│ │                                                                    │  │
│ └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│ Issues Visible:
│ • Gap between image/form: 128px (excessive, breaks visual connection)
│ • Form padding: only 16px (too tight for 1024px screen)
│ • Label/input gap: 16px (tight, feels cramped)
│ • Hardcoded ml-[130px] on reveals/hints (brittle, not responsive)
│ • Button gap: 40px (inconsistent with rest, should be 24px)
│ • Asymmetrical padding in sub-elements
│ • Mobile: Single column, easier to follow (but p-8 is still generous)
└──────────────────────────────────────────────────────────────────────────┘
```

#### AFTER (Recommended)
```
Laptop Screen (1024px):
┌──────────────────────────────────────────────────────────────────────────┐
│ OUTER: p-4 sm:p-6 md:p-8 lg:p-12 (responsive, rational)                │
│ ┌────────────────────────────────────────────────────────────────────┐  │
│ │ HEADING AREA: mb-12 (48px gap, good)                             │  │
│ │  ┌──────────────────────────────────────────────────────────────┐ │  │
│ │  │ Title (8xl = 96px, proportional)                            │ │  │
│ │  │ Gap: mb-8 md:mb-12 (32px → 48px)                           │ │  │
│ │  │ Instructions (4xl = 36px, readable)                         │ │  │
│ │  └──────────────────────────────────────────────────────────────┘ │  │
│ │                                                                    │  │
│ │ MAIN LAYOUT: flex gap-8 lg:gap-12 items-start lg:items-center    │  │
│ │ (gap-8 = 32px, lg:gap-12 = 48px, RATIONAL progression)           │  │
│ │                                                                    │  │
│ │ LEFT (lg:w-[45%]): Image container                               │  │
│ │  ┌──────────────────────┐  GAP: 48px        (proportional)       │  │
│ │  │ ╔══════════════════╗ │  ├─→ gap-8 lg:gap-12                  │  │
│ │  │ ║  [IMAGE]         ║ │  ├─→ Clear visual separation           │  │
│ │  │ ║ 350px→450px      ║ │  └─→ Maintains flow                   │  │
│ │  │ ║                  ║ │                                        │  │
│ │  │ ╚══════════════════╝ │                                        │  │
│ │  └──────────────────────┘                                        │  │
│ │                          │                                        │  │
│ │                          ▼ (proper spacing)                       │  │
│ │                                                                   │  │
│ │ RIGHT (lg:w-[55%]): Form container                              │  │
│ │ PADDING: p-6 md:p-8 (24px → 32px, generous)                    │  │
│ │ max-w-3xl (width constraint)                                    │  │
│ │  ┌──────────────────────────────────────────────────────────┐   │  │
│ │  │ FORM FIELDS: space-y-6 (24px between fields, breathable) │   │  │
│ │  │  ┌──────────────────────────────────────────────────────┐│   │  │
│ │  │  │ FIELD 1:  flex flex-col sm:flex-row gap-3 sm:gap-4  ││   │  │
│ │  │  │           items-end (align baselines)               ││   │  │
│ │  │  │                                                      ││   │  │
│ │  │  │  Mobile (flex-col):        Desktop (flex-row):      ││   │  │
│ │  │  │  ┌──────────────────────┐  ┌─────────┬─────────┐  ││   │  │
│ │  │  │  │ Label                │  │ Label   │ Input   │  ││   │  │
│ │  │  │  │ (flex-col width)     │  │ (150px) │ (flex) │  ││   │  │
│ │  │  │  │                      │  │ gap-4   │        │  ││   │  │
│ │  │  │  │ Input                │  └─────────┴─────────┘  ││   │  │
│ │  │  │  │ (100% width)         │  (responsive, clean)   ││   │  │
│ │  │  │  │ px-6 py-4            │  px-6 py-4             ││   │  │
│ │  │  │  └──────────────────────┘                        ││   │  │
│ │  │  │                                                      ││   │  │
│ │  │  │ REVEAL (if answered): p-6 rounded-xl              ││   │  │
│ │  │  │  ┌──────────────────────────────────────────────┐  ││   │  │
│ │  │  │  │ Correct answer: [value]                     │  ││   │  │
│ │  │  │  │ (no hardcoded offset - uses padding!)       │  ││   │  │
│ │  │  │  │ bg-slate-50 border-2                        │  ││   │  │
│ │  │  │  └──────────────────────────────────────────────┘  ││   │  │
│ │  │  │                                                      ││   │  │
│ │  │  │ HINT (if wrong): p-6 rounded-xl                    ││   │  │
│ │  │  │  ┌──────────────────────────────────────────────┐  ││   │  │
│ │  │  │  │ 💡 Hint text                               │  ││   │  │
│ │  │  │  │ (proper padding, responsive!)              │  ││   │  │
│ │  │  │  │ bg-amber-50 border-2                       │  ││   │  │
│ │  │  │  └──────────────────────────────────────────────┘  ││   │  │
│ │  │  │                                                      ││   │  │
│ │  │  └──────────────────────────────────────────────────────┘│   │  │
│ │  │                                                          │   │  │
│ │  │ (More fields with same pattern...)                     │   │  │
│ │  │                                                          │   │  │
│ │  │ BUTTONS: mt-12 flex gap-6 (24px gap, consistent!)      │   │  │
│ │  │  ┌──────────────────────┐      ┌────────────────────┐  │   │  │
│ │  │  │ Kijk na              │  ←→  │ AI Hulp            │  │   │  │
│ │  │  │ px-12 py-6           │      │ px-10 py-6         │  │   │  │
│ │  │  └──────────────────────┘      └────────────────────┘  │   │  │
│ │  └──────────────────────────────────────────────────────────┘   │  │
│ │                                                                    │  │
│ └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│ Improvements:
│ ✓ Gap between image/form: 48px (proportional, maintains flow)
│ ✓ Form padding: 24px-32px (comfortable, not cramped)
│ ✓ Label/input gap: 12px-16px (responsive, better spacing)
│ ✓ No hardcoded offsets (uses padding + responsive layout)
│ ✓ Button gap: 24px (consistent with spacing scale)
│ ✓ Mobile: Stacking layout responsive (flex-col → flex-row)
│ ✓ Reveals/hints: Proper padding-based layout
│ ✓ Form constraints: max-w-3xl (prevents too-wide layout)
└──────────────────────────────────────────────────────────────────────────┘
```

---

### PresentationSlide Layout

#### BEFORE (Current)
```
Digibord Screen (1920px):
┌─────────────────────────────────────────────────────────────────────────────┐
│ HEADER: px-8 py-6 (no responsive adjustment)                                │
│ ├─────────────────────────────────────────────────────────────────────────┤│
│ │ TITLE & SUBTITLE:                                                       ││
│ │ ╔═══════════════════════════════════════════════════════════════════╗  ││
│ │ ║ Presentation Slide                      (36px)                   ║  ││
│ │ ║ Subtitle text                           (mt-2 = 8px gap)        ║  ││
│ │ ║ (too much space between if not visible)                         ║  ││
│ │ ╚═══════════════════════════════════════════════════════════════════╝  ││
│ │                                            PAGE COUNTER & FULLSCREEN    ││
│ │                                            ┌─────────────────────┐     ││
│ │                                            │ Dia 5 / 10  [⊡] │  ││
│ │                                            └─────────────────────┘     ││
│ │ (gap-6 = 24px between left/right items)                                ││
│ └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ MAIN AREA: p-8 (32px on 1920px screen - WASTES SPACE)                      │
│ ├─────────────────────────────────────────────────────────────────────────┤│
│ │                                                                          ││
│ │            ╔═══════════════════════════════════════════════════╗       ││
│ │            ║                                                   ║       ││
│ │            ║                [PDF CANVAS]                      ║       ││
│ │            ║                                                   ║       ││
│ │            ║  max-w-[calc(100vw-128px)]                      ║       ││
│ │            ║  max-h-[calc(100vh-280px)]                      ║       ││
│ │            ║                                                   ║       ││
│ │            ║  (Uses CSS calc to fit space)                   ║       ││
│ │            ║                                                   ║       ││
│ │            ╚═══════════════════════════════════════════════════╝       ││
│ │                                                                          ││
│ │ (No constraint on canvas size - full-width)                            ││
│ └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ FOOTER: px-8 py-8 gap-8 (32px horiz/vert, 24px buttons gap)                │
│ ├─────────────────────────────────────────────────────────────────────────┤│
│ │ [◄ Vorige] [Pagina: 5 / 10] [Volgende ►]                              ││
│ │ (buttons: min-h-[3rem] min-w-[10rem])                                  ││
│ │ (input inside nav: px-3 py-2 - different from button padding!)         ││
│ │ (gap-4 = 16px between inputs/span)                                     ││
│ └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ KEYBOARD HINT: px-8 py-4 (32px horiz, 16px vert - CRAMPED!)                │
│ ├─────────────────────────────────────────────────────────────────────────┤│
│ │ 💡 [← Vorige] | [Volgende →] | [F] Volledig scherm                    ││
│ │ (py-4 = 16px vertical padding makes this line feel tight)             ││
│ │ (Not responsive - same on mobile and digibord!)                        ││
│ └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ Issues Visible:
│ • Header padding same everywhere (px-8 = 32px on 1920px = wastes space)
│ • Subtitle spacing too small (mt-2 = 8px)
│ • Main area padding not responsive (32px on all sizes)
│ • Canvas has no max-width constraint (very wide)
│ • Input padding different from button padding (inconsistent)
│ • Keyboard hint py-4 is cramped (hard to read at digibord distance)
│ • Footer gap inconsistencies (gap-8 overall, gap-4 inside nav, gap-3 elsewhere)
│ • Mobile (375px): Exact same spacing as digibord (should be different!)
└─────────────────────────────────────────────────────────────────────────────┘
```

#### AFTER (Recommended)
```
Digibord Screen (1920px):
┌─────────────────────────────────────────────────────────────────────────────┐
│ HEADER: px-6 md:px-8 lg:px-12 py-4 md:py-6 (RESPONSIVE!)                   │
│ ├─────────────────────────────────────────────────────────────────────────┤│
│ │ TITLE & SUBTITLE (flex flex-col gap-1):                                ││
│ │ ╔═══════════════════════════════════════════════════════════════════╗  ││
│ │ ║ Presentation Slide                      (48px, optimal size)      ║  ││
│ │ ║ Subtitle text                           (gap-1 = 4px, tight ok) ║  ││
│ │ ║ (clear relationship between title/subtitle)                     ║  ││
│ │ ╚═══════════════════════════════════════════════════════════════════╝  ││
│ │                                            PAGE COUNTER & FULLSCREEN    ││
│ │                                            ┌─────────────────────┐     ││
│ │                                            │ Dia 5 / 10  [⊡] │  ││
│ │                                            └─────────────────────┘     ││
│ │ (gap-4 = 16px, consistent)                                             ││
│ └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ MAIN AREA: p-6 md:p-8 lg:p-12 xl:p-16 (RESPONSIVE, scales up on digibord)  │
│ ├─────────────────────────────────────────────────────────────────────────┤│
│ │                                                                          ││
│ │     (on 1920px: p-16 = 64px padding, better use of space!)            ││
│ │                                                                          ││
│ │            ╔════════════════════════════════════════════════════╗      ││
│ │            ║                                                    ║      ││
│ │            ║              [PDF CANVAS]                         ║      ││
│ │            ║                                                    ║      ││
│ │            ║  max-w-6xl mx-auto (constrained width)           ║      ││
│ │            ║  max-h-[calc(100vh-200px)] (better calc)        ║      ││
│ │            ║  90vw constraint (responsive)                    ║      ││
│ │            ║                                                    ║      ││
│ │            ║  (Canvas centered, not stretched to edges)       ║      ││
│ │            ║                                                    ║      ║      ║
│ │            ╚════════════════════════════════════════════════════╝      ││
│ │                                                                          ││
│ │ (Better space utilization with constraints)                            ││
│ └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ FOOTER: px-6 md:px-8 lg:px-12 py-6 md:py-8 gap-4 md:gap-6 lg:gap-8         │
│ ├─────────────────────────────────────────────────────────────────────────┤│
│ │ [◄ Vorige]    [Pagina: 5 / 10]    [Volgende ►]                        ││
│ │ (buttons: responsive padding px-6 md:px-8 py-3 md:py-4)               ││
│ │ (input: px-2 md:px-3 py-2 md:py-3 - consistent with buttons!)         ││
│ │ (gap-3 md:gap-6 = 12px → 24px responsive)                             ││
│ │ (No arbitrary min-h/min-w - uses flex sizing)                         ││
│ └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ KEYBOARD HINT: px-6 md:px-8 lg:px-12 py-4 md:py-6 xl:py-8 (VISIBLE!)       │
│ ├─────────────────────────────────────────────────────────────────────────┤│
│ │ 💡 [← Vorige] | [Volgende →] | [F] Volledig scherm                    ││
│ │ (py-4 md:py-6 xl:py-8 = 16px → 24px → 32px, gets more visible!)       ││
│ │ (Responsive - scales up on digibord for better visibility!)            ││
│ └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ Improvements:
│ ✓ Header padding responsive (32px on mobile, 48px on digibord)
│ ✓ Subtitle spacing proper (gap-1 instead of mt-2)
│ ✓ Main area padding responsive (up to 64px on digibord)
│ ✓ Canvas has max-width constraint (not stretched)
│ ✓ Input padding consistent with buttons
│ ✓ Footer padding responsive (increases on large screens)
│ ✓ Keyboard hint visibility improved (16px → 32px on digibord)
│ ✓ All gaps responsive and proportional
│ ✓ No arbitrary min-h/min-w constraints
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. RESPONSIVE SPACING PROGRESSION

### Mobile → Tablet → Desktop → Digibord

```
Scale Comparison (4 screen sizes):

Mobile (375px)      Tablet (768px)       Desktop (1024px)     Digibord (1920px)
─────────────────   ──────────────────   ──────────────────   ───────────────────
px-4 (16px)         px-6 (24px)          px-8 (32px)          px-12 (48px)
gap-4 (16px)        gap-6 (24px)         gap-8 (32px)         gap-12 (48px)
py-4 (16px)         py-6 (24px)          py-8 (32px)          py-12 (48px)

Current Issue (PresentationSlide):
───────────────────────────────────────────────────────────────────────────────
Mobile (375px)      Tablet (768px)       Desktop (1024px)     Digibord (1920px)
─────────────────   ──────────────────   ──────────────────   ───────────────────
px-8 (32px)         px-8 (32px)          px-8 (32px)          px-8 (32px)
py-6 (24px)         py-6 (24px)          py-6 (24px)          py-6 (24px)
                    ❌ NO CHANGE at any breakpoint ❌

Result: Wastes space on large screens, cramped on small screens


Recommended Pattern:
───────────────────────────────────────────────────────────────────────────────

<!-- Base (mobile) -->
<div className="
  px-4 py-4 gap-4
  sm:px-6 sm:py-6 sm:gap-6
  md:px-8 md:py-8 md:gap-8
  lg:px-12 lg:py-12 lg:gap-12
  xl:px-16 xl:py-16 xl:gap-16
  2xl:px-20 2xl:py-20 2xl:gap-20
">
  {/* Content scales proportionally at every breakpoint */}
</div>

Visual progression:
┌─────────────────────────────┐ Mobile: 16px padding
│  Content                    │ Tight but functional
│  Box-in-box design         │
└─────────────────────────────┘

┌───────────────────────────────────────────┐ Tablet: 24px padding
│  Content                                  │ Better breathing room
│  Box-in-box design                       │
└───────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐ Desktop: 32px
│  Content                                                            │ Comfortable
│  Box-in-box design                                                  │
└─────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────────────────────┐ Digibord: 48px
│  Content                                                                                  │ Spacious
│  Box-in-box design                                                                        │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. DENSITY HEATMAP

### Information Density by Component (Current State)

```
LOW DENSITY (Lots of white space):
┌────────────────────────────────────┐
│ 🟢 TheorySlide                      │
│    p-8 md:p-16 lg:p-24 (too much)  │
│    Heading: 160px text              │
│    Content: 56px text               │
│    Image: Full container            │
│    Gap: 0 between L/R               │
│                                    │
│    Feeling: Airy (but wastes space)│
└────────────────────────────────────┘

NORMAL DENSITY (Good balance):
┌────────────────────────────────────┐
│ 🟡 ExerciseSlide (mostly)           │
│    p-8 lg:p-12 (reasonable)        │
│    Form: gap-8 (good spacing)      │
│    BUT: gap-32 between image/form  │
│         (breaks the balance!)      │
│                                    │
│    Feeling: Mixed (good + bad)     │
└────────────────────────────────────┘

HIGH DENSITY (Cramped):
┌────────────────────────────────────┐
│ 🔴 TableOfContents                  │
│    p-2 sm:p-4 (way too tight!)    │
│    space-y-2 (8px gaps)            │
│    Items: p-4 (small padding)      │
│    Testing: space-y-2 (cramped)    │
│                                    │
│    Feeling: Cramped, unprofessional│
└────────────────────────────────────┘

VARIABLE DENSITY (Inconsistent):
┌────────────────────────────────────┐
│ 🟠 PresentationSlide                │
│    Header: py-6 (24px)             │
│    Main: p-8 (32px, no responsive) │
│    Footer: py-8 (32px)             │
│    Hint: py-4 (16px, cramped!)     │
│                                    │
│    Feeling: Scattered, uncertain   │
└────────────────────────────────────┘

Recommended:
BALANCED DENSITY (Professional)
┌────────────────────────────────────┐
│ All components:                    │
│ • p-6 md:p-8 lg:p-12 (responsive) │
│ • space-y-4 md:space-y-6 (breathe) │
│ • gap-6 lg:gap-8 (consistent)     │
│                                    │
│ Feeling: Professional, intentional │
└────────────────────────────────────┘
```

---

## 5. Whitespace Distribution

### Current vs. Recommended

```
CURRENT (Unbalanced):

Layout A (TheorySlide):
┌──────────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← 96px top padding
│░░░░  [TEXT] (50%)  ░░░░ [IMAGE] (50%) ░░░░░░░░░░│ 96px side padding
│░░░░  48px header   ░░░░                ░░░░░░░░░░│ = EXCESSIVE whitespace
│░░░░                ░░░░                ░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← 96px bottom padding
└──────────────────────────────────────────────────┘

Layout B (TableOfContents):
┌──────────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← 96px top padding (too much on mobile!)
│░ [CHAPTERS] ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ only 16px side padding
│░ space-y-2  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ = CRAMPED items
│░            ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← 96px bottom padding (wastes space)
└──────────────────────────────────────────────────┘

Result: Inconsistent - too much outside, too little inside!


RECOMMENDED (Balanced):

Layout A (TheorySlide):
┌──────────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← 32-48px top padding (responsive)
│░ [TEXT] (40%) ░░░░ [IMAGE] (55%) ░░░░░░░░░░░░░░░│ 32-48px side padding (responsive)
│░             ░░░░                ░░░░░░░░░░░░░░░│ = PROFESSIONAL whitespace
│░  32-48px gap ░░░░  gap: 32-48px  ░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← 32-48px bottom padding (responsive)
└──────────────────────────────────────────────────┘

Layout B (TableOfContents):
┌──────────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← 32-48px top padding (responsive, not 96px)
│░ [CHAPTERS] ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ 24-32px side padding
│░ space-y-4  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ = BREATHING ROOM
│░            ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← 32-48px bottom padding (responsive)
└──────────────────────────────────────────────────┘

Result: Consistent - balanced outside and inside!
```

---

## 6. Grid Alignment Comparison

### Current vs. Recommended

```
CURRENT (Unaligned):

TheorySlide (md:flex-row):
┌────────────────────────────────────────────────────┐
│ w-full md:w-1/2      │   w-full md:w-1/2          │
│ (50% on md)          │   (50% on md)              │
│                      │                            │
│ p-8 md:p-16 lg:p-24  │   p-8 lg:p-16             │
│ (32→64→96px)         │   (32→64px)               │
│                      │                            │
│ Gap: 0 between them!  │   ← Items touching        │
│ ├──────────────────┤ │ ├──────────────────┤     │
│ │ Text area        │ │ │ Image area       │     │
│ │ (padded)         │ │ │ (different pad)  │     │
│ └──────────────────┘ │ └──────────────────┘     │
│                      │                            │
└────────────────────────────────────────────────────┘

Issues: Different padding, no gap, asymmetrical


RECOMMENDED (Aligned Grid):

TheorySlide (flex gap-6 md:gap-8 lg:gap-12):
┌────────────────────────────────────────────────────┐
│ w-full md:w-1/2      │ GAP │   w-full md:w-1/2    │
│ (50% on md)          │(24) │   (50% on md)        │
│                      │ px  │                      │
│ (no extra padding)   │     │   (no extra padding)  │
│                      │     │                      │
│ ├──────────────────┤ │     │ ├──────────────────┤ │
│ │ Text area        │ │  ▼  │ │ Image area       │ │
│ │ (padding inside) │ │     │ │ (padding inside) │ │
│ │ (responsive gap) │ │ 32  │ │ (same as left)   │ │
│ │                  │ │ px  │ │                  │ │
│ │ (md:gap-8 = 32)  │ │     │ │ (lg:gap-12 = 48) │ │
│ │ (lg:gap-12 = 48) │ │ 48  │ │                  │ │
│ │                  │ │ px  │ │                  │ │
│ └──────────────────┘ │     │ └──────────────────┘ │
│                      │     │                      │
└────────────────────────────────────────────────────┘

Improvements: Same padding, proper gap, symmetrical
```

---

## 7. Touch Target Analysis

### Button/Input Sizing Recommendations

```
Current Inconsistencies:
┌────────────────────────────────────────────────┐
│ PresentationSlide button:                      │
│ ┌──────────────────────────────────┐           │
│ │ [◄ Vorige]                       │           │
│ │ px-8 py-4 min-h-[3rem]          │  48×48px  │
│ │ (arbitrary constraints!)        │  OK       │
│ └──────────────────────────────────┘           │
│                                                 │
│ ExerciseSlide button:                          │
│ ┌──────────────────────────────────┐           │
│ │ [Kijk na]                        │           │
│ │ px-12 py-6                       │  56×56px  │
│ │ (good size, no constraints)      │  Better   │
│ └──────────────────────────────────┘           │
│                                                 │
│ PresentationSlide page input:                  │
│ ┌─────────────────────────────────────────┐    │
│ │ [    5    ]                             │    │
│ │ px-3 py-2 (only 12px horiz, 8px vert) │    │
│ │ (too small! hard to tap on mobile!)    │    │
│ └─────────────────────────────────────────┘    │
│                                                 │
│ Recommendation (WCAG AAA):                     │
│ ├─ Minimum touch target: 48×48px              │
│ ├─ Preferred: 56×56px                         │
│ └─ Maximum: 64×64px (unless in groups)        │
└────────────────────────────────────────────────┘

Standardized Sizing (px-6 py-4 = 48×48px minimum):
┌────────────────────────────────────────────────┐
│ Button: px-6 py-4                              │
│ ┌──────────────────────────────────┐           │
│ │ [◄ Vorige]                       │           │
│ │ px-6 py-4 md:px-8 md:py-5        │  48-56px  │
│ │ (scales up on tablet/desktop)    │  WCAG AAA │
│ └──────────────────────────────────┘           │
│                                                 │
│ Input: px-4 py-3                               │
│ ┌─────────────────────────────────────────┐    │
│ │ [    5    ]                             │    │
│ │ px-4 py-3 md:px-6 md:py-4               │    │
│ │ (minimum 44px height, scales up)        │    │
│ └─────────────────────────────────────────┘    │
└────────────────────────────────────────────────┘
```

---

**Summary:** These visual mockups demonstrate the clear benefits of implementing the recommended spacing system. Phase 1 implementation should focus on the highest-impact changes (TableOfContents, PresentationSlide, ExerciseSlide) to see immediate improvements in professionalism and usability.
