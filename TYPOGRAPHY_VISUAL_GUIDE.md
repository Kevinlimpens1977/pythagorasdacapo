# Typography Visual Reference Guide

**Visual demonstrations of typography hierarchy, scale, and usage patterns.**

---

## Typography Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              heading-display (48-64px)                      │
│              bold, tight spacing, digibord focus             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│          heading-h1 (30-48px)                          │
│          Bold black, main slide title                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│        heading-h2 (24-36px)                            │
│        Bold, section heading                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│       heading-h3 (20-30px)                            │
│       Semibold, subsection heading                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│      heading-h4 (18-24px)                            │
│      Semibold, label heading                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ body-lg (18-24px)                                      │
│ Large body text for important content and instructions.  │
│ Maintains 1.6x line-height for readability.            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ body-base (16-20px)                                    │
│ Standard paragraph text for general content.            │
│ Line-height 1.6x ensures comfortable reading.          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ body-sm (14-18px)                                      │
│ Smaller text for secondary info, captions, hints.      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Scale Reference (Pixel Sizes)

### Complete Progression by Breakpoint

```
Utility Class          Mobile    Tablet    Desktop   Ratio
─────────────────────────────────────────────────────────────
heading-display        48px  →   56px  →   64px     1.5x
heading-h1             30px  →   36px  →   48px     1.5x
heading-h2             24px  →   30px  →   36px     1.5x
heading-h3             20px  →   24px  →   30px     1.5x
heading-h4             18px  →   20px  →   24px     1.5x
───────────────────────────────────────────────────────────── 
body-lg                18px  →   20px  →   24px     1.5x
body-base              16px  →   18px  →   20px     1.5x
body-sm                14px  →   16px  →   18px     1.5x
───────────────────────────────────────────────────────────── 
label-text             14px  →   16px  →   18px     1.5x
btn-text               16px  →   18px  →   20px     1.5x
btn-text-lg            18px  →   24px  →   30px     1.5x
```

### Ratio Explanation

**1.5x multiplier** means each step is 50% larger than the previous:
- 16px × 1.5 = 24px
- 24px × 1.5 = 36px
- 36px × 1.5 = 54px (approximately)

This creates a harmonious, predictable scale that feels professional.

---

## Component Layouts

### TheorySlide (Educational Content)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  heading-h1                                              │
│  Pythagorean Theorem                                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  body-lg (line-height: 1.6x)                           │
│  In a right triangle, the square of the length of the   │
│  hypotenuse (the side opposite the right angle) equals  │
│  the sum of the squares of the lengths of the other two │
│  sides. We can call the length of the hypotenuse c, and │
│  the length of the other sides a and b.                 │
│                                                             │
│  a² + b² = c²                                           │
│                                                             │
│  [Image: Right triangle with labeled sides]             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Mobile View:
- heading-h1: 30px
- body-lg: 18px
- Image scales to fit screen width

Desktop View:
- heading-h1: 48px
- body-lg: 24px
- Image positioned beside text (50/50 split)
```

---

### ExerciseSlide (Interactive Practice)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  heading-h1 (30-48px)                                   │
│  Find the Missing Side                                   │
│                                                             │
│  body-lg (18-24px)                                      │
│  In a right triangle, if a = 3 and b = 4, what is c?    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  label-text                                              │
│  Side A:                      [input - body-base]        │
│                                                             │
│  label-text                                              │
│  Side B:                      [input - body-base]        │
│                                                             │
│  label-text                                              │
│  Hypotenuse (C):              [input - body-base]        │
│                                                             │
│                   [btn-text-lg: Check Answer]            │
│                                                             │
│  body-sm (feedback)                                      │
│  ✓ Correct! Well done!                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### PresentationSlide (PDF Navigation)

```
┌──────────────────────────────────────────────────────────────┐
│  heading-h1              [blue box: Slide 3/12]    [icon]    │
│  Chapter 7.2             body-sm text              fullscreen │
│  [small: body text]                                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                     [Large PDF Slide Content]               │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  [btn: Previous] [input: page #] [btn: Next]                │
│  label-text      body-base       label-text                 │
└──────────────────────────────────────────────────────────────┘

Digibord Optimization:
- heading-h1: 48px at 3m = readable from back of classroom
- Content fills 75-80% of screen
- Navigation buttons large enough for touch at distance
```

---

### Form / Authentication

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│               heading-h1 or heading-h2                      │
│               Create Account                                │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  label-text                                                 │
│  First Name *                                               │
│  ┌────────────────────────────────────────────────────────┐│
│  │ [body-base input text]                                 ││
│  └────────────────────────────────────────────────────────┘│
│  body-sm text-slate-500                                     │
│  Required field                                             │
│                                                              │
│  label-text                                                 │
│  Email Address *                                            │
│  ┌────────────────────────────────────────────────────────┐│
│  │ [body-base input text]                                 ││
│  └────────────────────────────────────────────────────────┘│
│  body-sm text-slate-500                                     │
│  Use your school email                                      │
│                                                              │
│                  [btn-text: Create Account]                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Before & After Comparison

### BEFORE (Problematic)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  HEADING: 48px → 64px → 160px                   │
│  (varies wildly, inconsistent)                  │
│                                                 │
│  CONTENT: 36px → 48px → 112px                   │
│  (body text oversized, hard to read)            │
│                                                 │
│  Line-height: 0.8-1.2x                          │
│  (too tight, poor readability)                  │
│                                                 │
│  MOBILE: 48px heading is TOO LARGE              │
│  (text fills entire phone screen)               │
│                                                 │
│  INCONSISTENCY: Each slide different            │
│  (learning curve for users)                     │
│                                                 │
└─────────────────────────────────────────────────┘

Visual Result:
████████████████████████  [Huge heading, chaotic]
██████                      [Inconsistent body]
█████████████               [No clear hierarchy]
```

### AFTER (Recommended)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  HEADING: 30px → 36px → 48px                    │
│  (consistent scale, professional)               │
│                                                 │
│  CONTENT: 18px → 20px → 24px                    │
│  (proper body text size, readable)              │
│                                                 │
│  Line-height: 1.6x                              │
│  (optimized for readability + accessibility)    │
│                                                 │
│  MOBILE: 30px heading is comfortable            │
│  (readable without oversizing)                  │
│                                                 │
│  CONSISTENCY: All slides follow same system     │
│  (predictable, professional appearance)         │
│                                                 │
└─────────────────────────────────────────────────┘

Visual Result:
████████████        [Clear heading, 30px]
████                 [Readable body, 18px]
███████████          [Proper hierarchy]
```

---

## Font Weight Reference

```
Regular (400)        text-normal font-normal
  "The quick brown fox jumps over the lazy dog."

Medium (500)         font-medium
  "The quick brown fox jumps over the lazy dog."

Semibold (600)       font-semibold
  "The quick brown fox jumps over the lazy dog."

Bold (700)           font-bold
  "The quick brown fox jumps over the lazy dog."

Black (900)          font-black
  "The quick brown fox jumps over the lazy dog."

Usage by element:
─────────────────────────────────────────────────
heading-h1    → 900 black (highest emphasis)
heading-h2    → 700 bold
heading-h3-h4 → 600 semibold
label-text    → 600 semibold
body text     → 400 normal (easy to read)
button text   → 700 bold (call to action)
link text     → 600 semibold
```

---

## Line-Height Visual Impact

```
line-height: 1.0  (tight - readability: POOR)
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.

line-height: 1.2  (snug - readability: OK)
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.

line-height: 1.5  (normal - readability: GOOD)
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.

line-height: 1.6  (relaxed - readability: EXCELLENT) ← RECOMMENDED
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.

line-height: 2.0  (spacious - readability: TOO MUCH)
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.

Applied in utilities:
────────────────────────────────────
Headings (h1-h5)      → line-height: 1.1-1.25 (tight is OK for headings)
Body text             → line-height: 1.6 (leading-relaxed)
Dyslexia-friendly     → line-height: 1.75 (even more spacious)
```

---

## Letter-Spacing Reference

```
No letter-spacing (0px) - normal
The quick brown fox jumps over the lazy dog.

tracking-tighter (-1.5px) - headings
The quick brown fox jumps over the lazy dog.

tracking-tight (-1px) - large headings
The quick brown fox jumps over the lazy dog.

tracking-normal (0px) - default
The quick brown fox jumps over the lazy dog.

tracking-wide (0.5px) - subtle
The quick brown fox jumps over the lazy dog.

tracking-widest (2px) - labels
THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.

Applied in utilities:
────────────────────────────────────
heading-display → tracking-tighter (-1.5px)
heading-h1/h2   → tracking-tight (-1px)
Headings h3+    → tracking-normal
Body text       → tracking-normal
All-caps labels → tracking-widest
```

---

## Digibord Viewing Distance Optimization

```
Classroom Setup:
                         Front Row (1.5m)
                               ▲
                               │
                    ╱───────────┼───────────╲
                   ╱            │            ╲
                  ╱             │             ╲
     Left Side  │              │              │  Right Side
   (harder to   │    Digibord   │              │
   read)        │   55-75"      │      (harder │
                 │   4K Display  │      to read)
                  ╲             │             ╱
                   ╲            │            ╱
                    ╲───────────┼───────────╱
                               │
                               ▼
                    Back Row (3m) ← CRITICAL TEST POINT


Text Size Readability at 3 meters:
─────────────────────────────────────────────────
24px    ❌ Too small (fingernail size)
30px    ⚠️  Barely readable (strain)
36px    🟡 Adequate (OK, but borders)
48px    ✅ Good (recommended minimum)
60px+   ✅ Excellent (very safe)

CURRENT SIZING:
TheorySlide heading: 48-160px ← INCONSISTENT
                     Safe at 1.5m, WAY too large at close distance

RECOMMENDED:
All headings: 36-48px ← CONSISTENT
              Readable at 3m without oversizing at 1.5m
```

---

## Color Contrast Verification

```
Text Color                Background      Contrast Ratio
────────────────────────────────────────────────────────
slate-900 (dark)          white           21:1 ✅ AAA
slate-900 (dark)          slate-50        16:1 ✅ AAA
slate-700 (medium)        white           12:1 ✅ AAA
slate-600 (light)         white            8:1 ✅ AAA
slate-500 (lighter)       white            5:1 ✅ AA

blue-600 (accent)         white           8.5:1 ✅ AAA
blue-600 (accent)         blue-50         6:1 ✅ AA

green-600 (success)       white            7:1 ✅ AAA
red-600 (error)           white            5:1 ✅ AA

All combinations meet WCAG AA minimum (4.5:1) ✅
Most combinations meet WCAG AAA (7:1) ✅
```

---

## Responsive Breakpoint Overview

```
Mobile (Default)          Tablet (768px+)       Desktop (1024px+)
────────────────────────────────────────────────────────────────

heading-h1                heading-h1            heading-h1
text-4xl                  text-5xl              text-6xl
30px                      36px                  48px
[Full width]              [Full width]          [Full width or 70%]
Line-height: 1.15         Line-height: 1.15     Line-height: 1.15


body-lg                   body-lg               body-lg
text-lg                   text-xl               text-2xl
18px                      20px                  24px
line-height: 1.6          line-height: 1.6      line-height: 1.6
width: full               width: full           max-width: 600px


[Small touch target]      [Medium touch]        [Comfortable]
button                    button                button
text-base                 text-lg               text-xl
16px                      18px                  20px
padding: 12px             padding: 16px         padding: 20px
```

---

## Testing Checklist (Visual Inspection)

```
HEADING CONSISTENCY:
☐ All h1 elements use heading-h1
☐ All h2 elements use heading-h2
☐ Progression h1 > h2 > h3 > h4 > h5 is visible
☐ No heading skips levels (e.g., h1 → h3)

BODY TEXT READABILITY:
☐ Paragraphs use body-lg or body-base
☐ Line-height is generous (1.6x), not tight
☐ Max line length ~60-75 characters
☐ No text is all-caps without good reason

RESPONSIVE BEHAVIOR:
☐ Mobile (375px): Text readable, no overflow
☐ Tablet (768px): Good balance, larger text
☐ Desktop (1024px): Professional look
☐ Large (1920px): Suitable for display

DIGIBORD OPTIMIZATION:
☐ Test heading at 2-3m distance
☐ Heading is 48px (36-48 range at 3m)
☐ Content is readable without eye strain
☐ Navigation buttons are touchable

ACCESSIBILITY:
☐ Color contrast ≥ 4.5:1 (AA minimum)
☐ Text passes readability test
☐ Font size ≥ 14px minimum
☐ No reliance on color alone
```

---

## Migration Checklist (Implementation)

```
PHASE 1 - CRITICAL (30 min):
☐ Add utilities to index.css
☐ Update PresentationSlide heading (text-3xl/4xl → heading-h1)
☐ Update TheorySlide heading/content
☐ Update ExerciseSlide heading/content
☐ Test on mobile, tablet, digibord

PHASE 2 - COMPLETE (1-2 hours):
☐ Apply to SummarySlide
☐ Apply to DemoSlide
☐ Apply to WelcomeSlide
☐ Update all forms (LoginScreen, etc.)
☐ Update tables and special components
☐ Full accessibility audit

PHASE 3 - ENHANCE (1-2 hours):
☐ Add Tailwind theme configuration
☐ Implement dark mode typography
☐ Create component library documentation
☐ Add print stylesheet
```

---

## Quick Troubleshooting

```
Problem: Text is too large on mobile
Solution: Check breakpoints (md: lg:) - they're working as intended
          Mobile defaults are 30-18px (good for phone)

Problem: Utilities not showing up
Solution: Restart dev server (npm run dev)
          Check @layer components is in index.css
          Clear Tailwind cache

Problem: Inconsistent sizing on different slides
Solution: Find all inline text-* classes
          Replace with utility classes (heading-h1, body-lg, etc.)

Problem: Text looks too spaced
Solution: This is line-height: 1.6 (working correctly)
          It improves readability—keep it

Problem: Can't read from back of classroom
Solution: Increase heading size (check digibord is using lg: sizes)
          36-48px headings should be readable at 3m
```

---

**Visual Guide Version:** 1.0  
**Last Updated:** 2026-05-10  
**Purpose:** Quick visual reference for typography implementation
