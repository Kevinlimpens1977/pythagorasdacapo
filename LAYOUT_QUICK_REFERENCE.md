# Layout & Spacing System - Quick Reference

**For developers implementing the layout audit recommendations**

Bookmark this file. Use it daily when building components.

---

## Spacing Scale at a Glance

| Pixels | REM | Tailwind | Use Case | Example |
|--------|-----|----------|----------|---------|
| 4px | 0.25 | px-1 | Micro gaps (rare) | Icon spacing inside buttons |
| 8px | 0.5 | px-2 | Tight spacing | Between items in tight groups |
| 12px | 0.75 | px-3 | Compact spacing | Form label/input (mobile) |
| **16px** | **1** | **px-4** | **DEFAULT** | **All content padding/gaps** |
| 20px | 1.25 | px-5 | Comfortable | Between readable items |
| **24px** | **1.5** | **px-6** | **SECONDARY** | **Section spacing** |
| **32px** | **2** | **px-8** | **MAJOR** | **Main areas** |
| **40px** | **2.5** | **px-10** | **LARGE** | **Big breaks** |
| **48px** | **3** | **px-12** | **V.LARGE** | **Large sections** |
| 64px | 4 | px-16 | X.LARGE | Desktop+ padding |

**Remember:** Start with px-4 or px-6. Rarely go below px-3 or above px-16.

---

## Responsive Padding Template

Copy this pattern for any component needing responsive padding:

```jsx
// Container with responsive padding
<div className="px-4 sm:px-6 md:px-8 lg:px-12">
  {/* Content */}
</div>

// Breakdown:
// Mobile (< 640px):     px-4 (16px)
// Tablet (640px-1024px): sm:px-6 (24px)
// Desktop (1024-1440px): md:px-8 (32px)
// Large (1440px+):      lg:px-12 (48px)
```

### Vertical Padding

```jsx
<div className="py-6 md:py-8 lg:py-12">
  {/* Content */}
</div>

// Breakdown:
// Mobile:     py-6 (24px)
// Desktop:    md:py-8 (32px)
// Large:      lg:py-12 (48px)
```

### Both Axes (Symmetric)

```jsx
<div className="p-4 sm:p-6 md:p-8 lg:p-12">
  {/* Same padding on all sides */}
</div>
```

---

## Gap Progression (for flex/grid)

| Usage | Mobile | Tablet | Desktop | Digibord |
|-------|--------|--------|---------|----------|
| Tight (buttons, badges) | `gap-2` (8px) | `gap-3` (12px) | `gap-4` (16px) | `gap-4` (16px) |
| Normal (most content) | `gap-4` (16px) | `gap-6` (24px) | `gap-8` (32px) | `gap-12` (48px) |
| Loose (sections) | `gap-6` (24px) | `gap-8` (32px) | `gap-12` (48px) | `gap-16` (64px) |
| Extra (major breaks) | `gap-8` (32px) | `gap-12` (48px) | `gap-16` (64px) | `gap-20` (80px) |

### Copy-Paste Gap Patterns

```jsx
// Normal spacing (most common)
<div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12">
  {/* Items */}
</div>

// Loose spacing (section breaks)
<div className="space-y-6 md:space-y-8 lg:space-y-12">
  {/* Items */}
</div>

// Tight spacing (buttons, badges)
<div className="flex gap-2 md:gap-3">
  {/* Items */}
</div>
```

---

## Common Component Patterns

### Card/Box Container

```jsx
<div className="p-4 md:p-6 lg:p-8 rounded-xl bg-white border border-slate-200 shadow-sm">
  {/* Content */}
</div>

// Padding: 16px → 24px → 32px (responsive)
// Rounded: xl (16px)
// Shadow: subtle
// Border: subtle
```

### Form Field Group

```jsx
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end">
  <label className="sm:w-[150px] flex-shrink-0 font-bold">
    Label
  </label>
  <input className="flex-1 px-4 py-3 md:px-6 md:py-4 rounded-lg border-2 border-slate-200" />
</div>

// Mobile: Stacked vertically
// Desktop: Side-by-side with label width constraint
// Gaps: 12px → 16px responsive
```

### Button Group (Horizontal)

```jsx
<div className="flex gap-4 md:gap-6">
  <button className="px-6 py-3 md:px-8 md:py-4">Button</button>
  <button className="px-6 py-3 md:px-8 md:py-4">Button</button>
</div>

// Gap: 16px → 24px responsive
// Button padding: 24px/12px → 32px/16px responsive
// Buttons: Touch targets 48x36px minimum
```

### List with Spacing

```jsx
<div className="space-y-3 md:space-y-4">
  {items.map(item => (
    <div key={item.id} className="p-4 md:p-6 rounded-lg bg-slate-50">
      {/* Item content */}
    </div>
  ))}
</div>

// Gap between items: 12px → 16px responsive
// Item padding: 16px → 24px responsive
```

### Heading + Content

```jsx
<div>
  <h2 className="mb-3 md:mb-4 lg:mb-6 text-2xl font-black">
    Heading
  </h2>
  <p className="text-base md:text-lg text-slate-600">
    Body text here
  </p>
</div>

// Gap: 12px → 16px → 24px responsive
// Creates visual hierarchy
```

### Section Dividers

```jsx
<div className="space-y-8 md:space-y-12">
  <div>
    {/* Section 1 */}
  </div>
  
  <div className="border-t border-slate-200 pt-8 md:pt-12">
    {/* Section 2 */}
  </div>
</div>

// Space between: 32px → 48px responsive
// Border with padding: creates clear separation
```

---

## DO's and DON'Ts

### DO

✅ **Use responsive classes**
```jsx
<div className="px-4 sm:px-6 md:px-8 lg:px-12">Good</div>
```

✅ **Use consistent spacing**
```jsx
<div className="gap-4 sm:gap-6 md:gap-8">
  <div className="p-4">Item</div>
  <div className="p-4">Item</div>
</div>
```

✅ **Stack at mobile, spread at desktop**
```jsx
<div className="flex flex-col md:flex-row gap-4 md:gap-8">
  <div className="w-full md:w-1/2">Left</div>
  <div className="w-full md:w-1/2">Right</div>
</div>
```

✅ **Use flex for alignment**
```jsx
<div className="flex items-center justify-between gap-4">
  {/* Aligns and spaces automatically */}
</div>
```

✅ **Add max-width for readability**
```jsx
<div className="max-w-3xl mx-auto">
  {/* Content constrained to readable width */}
</div>
```

### DON'T

❌ **Don't use arbitrary spacing**
```jsx
<div className="gap-[27px]">❌ Not aligned to scale</div>
```

❌ **Don't hardcode offsets**
```jsx
<div className="ml-[130px]">❌ Breaks on mobile</div>
```

❌ **Don't mix responsive and static**
```jsx
<div className="p-8">❌ Same on all screens</div>
```

❌ **Don't use negative margins**
```jsx
<div className="-ml-4">❌ Creates alignment chaos</div>
```

❌ **Don't nest excessive padding**
```jsx
<div className="p-8">
  <div className="p-8">
    <div className="p-8">❌ Too much nesting</div>
  </div>
</div>
```

---

## Specific Component Guidelines

### TheorySlide

**Correct Pattern:**
```jsx
<div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-12 p-4 sm:p-6 md:p-8 lg:p-12">
  {/* Left: text (no extra padding) */}
  <div className="w-full md:w-1/2 flex flex-col justify-center">
    <h2 className="mb-8 md:mb-12 text-6xl font-black">Heading</h2>
    <div className="text-2xl text-slate-700">Content</div>
  </div>
  
  {/* Right: image (no extra padding) */}
  {slide.image && (
    <div className="w-full md:w-1/2 flex items-center justify-center">
      <img className="max-h-[400px] md:max-h-[500px] lg:max-h-[600px]" />
    </div>
  )}
</div>
```

**Key Points:**
- No nested padding inside flex children
- Gap: 4→8→12 (16→32→48px)
- Image heights: specific (400-600px), not percentages
- Heading gap: 8→12 (32→48px)

---

### ExerciseSlide

**Correct Pattern:**
```jsx
<div className="p-4 sm:p-6 md:p-8 lg:p-12">
  {/* Heading section */}
  <div className="text-center mb-12">
    <h2 className="text-6xl md:text-8xl font-black mb-8 md:mb-12">Title</h2>
    <p className="text-2xl md:text-3xl text-slate-700">Instructions</p>
  </div>
  
  {/* Main layout */}
  <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center">
    {/* Image */}
    {slide.image && (
      <div className="w-full lg:w-[45%]">
        <img className="max-h-[350px] md:max-h-[450px]" />
      </div>
    )}
    
    {/* Form */}
    <div className="w-full lg:w-[55%] max-w-3xl p-6 md:p-8">
      <div className="space-y-6">
        {/* Fields here */}
      </div>
      
      {/* Buttons */}
      <div className="mt-12 flex gap-6 justify-center">
        <button>Button</button>
      </div>
    </div>
  </div>
</div>
```

**Key Points:**
- Container padding: 4→6→8→12 (responsive)
- Gap between image/form: 8→12 (32→48px), not 32!
- Form padding: 6→8 (24→32px)
- Form max-width: 3xl (768px) to prevent stretching
- Field spacing: space-y-6 (24px)

---

### PresentationSlide

**Correct Pattern:**
```jsx
<div className="flex flex-col h-screen">
  {/* Header */}
  <nav className="px-6 md:px-8 lg:px-12 py-4 md:py-6 border-b">
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl md:text-4xl font-black">Title</h2>
        {subtitle && <p className="text-slate-600">{subtitle}</p>}
      </div>
      <div className="flex gap-4">
        {/* Controls */}
      </div>
    </div>
  </nav>
  
  {/* Main */}
  <main className="flex-1 p-6 md:p-8 lg:p-12 xl:p-16 flex items-center justify-center bg-slate-50">
    <canvas style={{ maxWidth: '90vw', maxHeight: 'calc(100vh - 200px)' }} />
  </main>
  
  {/* Footer */}
  <div className="px-6 md:px-8 lg:px-12 py-6 md:py-8 border-t flex gap-4 md:gap-6 lg:gap-8">
    {/* Buttons */}
  </div>
  
  {/* Hint */}
  <div className="px-6 md:px-8 lg:px-12 py-4 md:py-6 xl:py-8 bg-blue-50">
    {/* Keyboard help */}
  </div>
</div>
```

**Key Points:**
- Header/footer padding: 6→8→12 responsive
- Main area padding: 6→8→12→16 (responsive up to xl:)
- Hint visibility: py-4→6→8 (gets visible on large screens)
- No hardcoded min-h/min-w on buttons (use flex + gap)

---

### TableOfContents

**Correct Pattern:**
```jsx
<div className="w-full max-w-5xl mx-auto py-8 md:py-12 px-4 sm:px-6 md:px-8">
  {/* Admin section - generous density */}
  {isAdmin && (
    <div className="mb-12 p-6 md:p-8 rounded-2xl bg-gradient-to-br">
      <div className="space-y-6">
        {/* Items with space-y-6 */}
      </div>
    </div>
  )}
  
  {/* Chapters - normal density */}
  <div className="bg-white rounded-2xl p-4 md:p-6 lg:p-8">
    <div className="space-y-3 md:space-y-4">
      {chapters.map(ch => (
        <div key={ch.id} className="p-4 md:p-6 rounded-lg">
          {/* Chapter item */}
        </div>
      ))}
    </div>
  </div>
</div>
```

**Key Points:**
- Outer padding: 8→12 (32→48px), not 96px!
- Container padding: 4→6→8 responsive
- Chapter gap: 3→4 (12→16px), not 2!
- Admin section: p-6→8 (generous)
- Items: p-4→6 (consistent)
- Progress bar: h-3 (12px, visible)

---

## Breakpoint Reference

```
/* Tailwind Defaults */
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### Common Breakpoint Pattern

```jsx
{/* Mobile-first approach */}
<div className="
  text-base md:text-lg lg:text-xl
  p-4 md:p-6 lg:p-8
  gap-4 md:gap-6 lg:gap-8
">
  {/* Automatically optimized at each breakpoint */}
</div>
```

---

## Max-Width Utility Classes (Create in index.css)

```css
@layer components {
  /* Text reading (optimal line length) */
  .text-column { @apply max-w-2xl mx-auto; }    /* 640px */
  
  /* Content areas (forms, exercises) */
  .content-column { @apply max-w-3xl mx-auto; }  /* 768px */
  
  /* Layout containers (lists, grids) */
  .layout-column { @apply max-w-5xl mx-auto; }   /* 896px */
  
  /* Full page layouts */
  .page-column { @apply max-w-6xl mx-auto; }     /* 1152px */
}
```

**Usage:**
```jsx
<div className="text-column">
  {/* Text content constrained to readable width */}
</div>

<div className="content-column">
  {/* Form content */}
</div>

<div className="layout-column">
  {/* List of chapters */}
</div>
```

---

## Centering Patterns

### Center Content Horizontally

```jsx
{/* Method 1: flex justify-center */}
<div className="flex justify-center">
  <div className="max-w-3xl">Content</div>
</div>

{/* Method 2: mx-auto */}
<div className="max-w-3xl mx-auto">
  Content
</div>

{/* Method 3: grid (for more control) */}
<div className="grid place-items-center">
  Content
</div>
```

### Center Content Both Ways

```jsx
<div className="flex items-center justify-center">
  Content
</div>
```

### Space Items Evenly

```jsx
<div className="flex items-center justify-between gap-4">
  <div>Left</div>
  <div>Center</div>
  <div>Right</div>
</div>
```

---

## Visual Separators

### Divider with Spacing

```jsx
{/* Section 1 */}
<div className="pb-8 md:pb-12 border-b border-slate-200">
  {/* Content */}
</div>

{/* Section 2 */}
<div className="pt-8 md:pt-12">
  {/* Content */}
</div>

{/* Creates: 32px → 48px padding + border */}
```

### Grouped Content

```jsx
<div className="p-6 md:p-8 rounded-xl bg-slate-50 border border-slate-200">
  <div className="space-y-4 md:space-y-6">
    {/* Items with internal spacing */}
  </div>
</div>
```

---

## Touch Target Sizing

**WCAG AAA Minimum:** 44px × 44px  
**Recommended:** 48px × 48px  
**Preferred:** 56px × 56px

### Button Sizing

```jsx
{/* Small button (48×36px) */}
<button className="px-4 py-2 text-sm">
  Small
</button>

{/* Normal button (56×44px) */}
<button className="px-6 py-3 text-base md:px-8 md:py-4">
  Normal
</button>

{/* Large button (64×48px) */}
<button className="px-8 py-4 md:px-12 md:py-6 text-lg">
  Large
</button>
```

### Input Sizing

```jsx
{/* Form input */}
<input className="px-4 py-3 md:px-6 md:py-4 text-base border-2" />
{/* Minimum height 44px, scales to 48px on desktop */}
```

---

## Troubleshooting

### Problem: Spacing looks wrong on mobile
**Solution:** Check responsive classes. Add mobile-first base class:
```jsx
<div className="p-4 sm:p-6 md:p-8">
  {/* Starts at p-4 on mobile */}
</div>
```

### Problem: Elements crowded together
**Solution:** Add gap/space utilities:
```jsx
<div className="space-y-4 md:space-y-6">
  {/* 16px → 24px spacing between items */}
</div>
```

### Problem: Content too wide on large screens
**Solution:** Add max-width:
```jsx
<div className="max-w-3xl mx-auto">
  {/* Constrained width, centered */}
</div>
```

### Problem: Buttons hard to click on mobile
**Solution:** Increase padding:
```jsx
<button className="px-4 py-3 md:px-6 md:py-4">
  {/* Minimum 44×36px, scales up */}
</button>
```

### Problem: Text line length too long
**Solution:** Add max-width to text container:
```jsx
<p className="max-w-2xl">
  {/* ~65 chars per line */}
</p>
```

---

## Implementation Checklist

Before committing spacing changes:

- [ ] Mobile view (375px) looks good
- [ ] Tablet view (768px) looks good
- [ ] Desktop view (1024px) looks good
- [ ] Large view (1920px) looks good
- [ ] No horizontal scrolling on mobile
- [ ] Buttons are clickable (48px+ on each axis)
- [ ] Text line-length is reasonable (< 80 chars)
- [ ] Spacing is consistent with scale (multiples of 4-8)
- [ ] No hardcoded pixel values (use Tailwind)
- [ ] No nested excessive padding
- [ ] Responsive classes used (sm:, md:, lg:)
- [ ] Visual separators are clear
- [ ] Whitespace feels intentional

---

## Quick Copy-Paste Boilerplate

### Full Page Layout

```jsx
export default function MyPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <nav className="px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 border-b">
        {/* Nav content */}
      </nav>
      
      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <div className="space-y-8 md:space-y-12">
          {/* Sections with spacing */}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12 border-t bg-slate-50">
        {/* Footer content */}
      </footer>
    </div>
  );
}
```

### Card Grid

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
  {items.map(item => (
    <div key={item.id} className="p-6 md:p-8 rounded-xl bg-white border shadow-sm">
      <h3 className="text-lg font-black mb-3">{item.title}</h3>
      <p className="text-slate-600">{item.description}</p>
    </div>
  ))}
</div>
```

### Form Section

```jsx
<form className="max-w-2xl mx-auto space-y-6 md:space-y-8">
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end">
    <label className="sm:w-[120px] flex-shrink-0 font-bold">Label</label>
    <input className="flex-1 px-4 py-3 md:px-6 md:py-4 border-2 rounded-lg" />
  </div>
  
  <div className="flex gap-4 pt-4 md:pt-6">
    <button className="px-6 py-3 md:px-8 md:py-4 bg-blue-600 text-white rounded-lg font-bold">
      Submit
    </button>
    <button className="px-6 py-3 md:px-8 md:py-4 border-2 rounded-lg font-bold">
      Cancel
    </button>
  </div>
</form>
```

---

**Last Updated:** 2026-05-10  
**Status:** Reference Document  
**Related:** LAYOUT_SPACING_AUDIT.md, LAYOUT_VISUAL_MOCKUPS.md
