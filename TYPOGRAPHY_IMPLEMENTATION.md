# Typography System Implementation Guide

**Version:** 1.0  
**Status:** Ready to implement  
**Estimated Time:** 2-4 hours  
**Risk Level:** Low (CSS only, no logic changes)

---

## Quick Start: Phase 1 (30 minutes)

These are the **critical changes** that improve readability immediately.

### Step 1: Update index.css

Add typography utilities at the end of `/src/index.css`:

```css
/* Typography System */
@layer components {
  /* Heading Styles */
  .heading-display {
    @apply text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight;
  }
  
  .heading-h1 {
    @apply text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight;
  }
  
  .heading-h2 {
    @apply text-3xl md:text-4xl lg:text-5xl font-bold leading-snug tracking-tight;
  }
  
  .heading-h3 {
    @apply text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug;
  }
  
  .heading-h4 {
    @apply text-xl md:text-2xl lg:text-3xl font-semibold leading-snug;
  }
  
  /* Body Text Styles */
  .body-lg {
    @apply text-lg md:text-xl lg:text-2xl font-normal leading-relaxed;
  }
  
  .body-base {
    @apply text-base md:text-lg lg:text-xl font-normal leading-relaxed;
  }
  
  .body-sm {
    @apply text-sm md:text-base lg:text-lg font-normal leading-relaxed;
  }
  
  /* Label and Form Text */
  .label-text {
    @apply text-sm md:text-base lg:text-lg font-semibold;
  }
  
  .label-sm {
    @apply text-xs md:text-sm font-semibold;
  }
  
  /* Button Text */
  .btn-text {
    @apply text-base md:text-lg lg:text-xl font-bold;
  }
  
  .btn-text-lg {
    @apply text-lg md:text-2xl lg:text-3xl font-bold;
  }
}

/* Utility helpers */
.text-leading-relaxed {
  line-height: 1.6;
}

.text-leading-spacious {
  line-height: 1.75;
}
```

### Step 2: Update PresentationSlide.jsx (lines 150-156)

**BEFORE:**
```jsx
<nav className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-200 shadow-sm">
  <div className="flex flex-col">
    <h2 className="text-3xl md:text-4xl font-black text-slate-900">{slide.heading}</h2>
    {slide.subtitle && (
      <p className="text-lg md:text-xl text-slate-600 mt-2">{slide.subtitle}</p>
    )}
  </div>
```

**AFTER:**
```jsx
<nav className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-200 shadow-sm">
  <div className="flex flex-col">
    <h2 className="heading-h1 text-slate-900">{slide.heading}</h2>
    {slide.subtitle && (
      <p className="text-lg md:text-2xl lg:text-3xl text-slate-600 mt-2 font-medium">{slide.subtitle}</p>
    )}
  </div>
```

**Why:** Increases heading from 30-36px → 36-48px (+20-30%), better for digibord viewing distance

---

### Step 3: Update TheorySlide.jsx (lines 5-13)

**BEFORE:**
```jsx
<div className={`flex flex-col md:flex-row items-stretch justify-center min-h-[calc(100vh-160px)] w-full h-full animate-in fade-in zoom-in-95 duration-700">
  {/* Tekst Gedeelte */}
  <div className={`flex flex-col justify-center ${slide.image ? 'w-full md:w-1/2' : 'w-full text-center'} bg-white p-8 md:p-16 lg:p-24`}>
    <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-slate-900 mb-12 tracking-tighter leading-[0.8] break-words">
      <FormattedText text={slide.heading} />
    </h2>
    <div className="text-4xl md:text-5xl lg:text-7xl leading-[1.05] text-slate-700 whitespace-pre-wrap font-medium w-full">
      <FormattedText text={slide.content} />
    </div>
  </div>
```

**AFTER:**
```jsx
<div className={`flex flex-col md:flex-row items-stretch justify-center min-h-[calc(100vh-160px)] w-full h-full animate-in fade-in zoom-in-95 duration-700`}>
  {/* Tekst Gedeelte */}
  <div className={`flex flex-col justify-center ${slide.image ? 'w-full md:w-1/2' : 'w-full text-center'} bg-white p-8 md:p-16 lg:p-24`}>
    <h2 className="heading-h1 text-slate-900 mb-12 break-words">
      <FormattedText text={slide.heading} />
    </h2>
    <div className="body-lg text-slate-700 whitespace-pre-wrap w-full max-w-3xl mx-auto">
      <FormattedText text={slide.content} />
    </div>
  </div>
```

**Why:** 
- Heading: 48-160px → 30-48px (consistent system)
- Content: 36-112px → 18-24px (readable body text)
- Line-height: 0.8-1.05 → 1.6 (accessibility standard)

---

### Step 4: Update ExerciseSlide.jsx (lines 164-171)

**BEFORE:**
```jsx
<div className="flex flex-col xl:flex-row w-full h-full animate-in fade-in slide-in-from-bottom-8 duration-700 bg-white">
  <div className={`flex-1 flex flex-col justify-center ${showAITutor ? 'max-w-[70%]' : 'w-full'} p-8 lg:p-12`}>
    <div className="text-center mb-12">
      <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.85] break-words"><FormattedText text={slide.heading} /></h2>
      <div className="text-2xl md:text-3xl lg:text-5xl text-slate-700 whitespace-pre-wrap font-medium w-full leading-tight">
        <FormattedText text={slide.content} />
      </div>
    </div>
```

**AFTER:**
```jsx
<div className="flex flex-col xl:flex-row w-full h-full animate-in fade-in slide-in-from-bottom-8 duration-700 bg-white">
  <div className={`flex-1 flex flex-col justify-center ${showAITutor ? 'max-w-[70%]' : 'w-full'} p-8 lg:p-12`}>
    <div className="text-center mb-12">
      <h2 className="heading-h1 text-slate-900 mb-8 break-words"><FormattedText text={slide.heading} /></h2>
      <div className="body-lg text-slate-700 whitespace-pre-wrap w-full max-w-2xl mx-auto">
        <FormattedText text={slide.content} />
      </div>
    </div>
```

**Why:** Same as TheorySlide - consistency and readability

---

### Step 5: Test Immediately

1. Run `npm run dev`
2. Check each slide type (Theory, Exercise, Summary, etc.)
3. Verify on tablet and desktop
4. Compare with digibord at 2-3m distance if possible

---

## Phase 2: Full System Implementation (1-2 hours)

Apply consistent typography across all remaining components.

### Complete File Updates

#### SummarySlide.jsx

**BEFORE (lines 1-15):**
```jsx
<div className="flex flex-col items-center justify-center text-center w-full h-full animate-in fade-in zoom-in-95 duration-1000 bg-white p-8 lg:p-16">
  <div className="w-40 h-40 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-12 shadow-[0_30px_60px_-10px_rgba(34,197,94,0.3)] border-[8px] border-white animate-bounce">
    <CheckCircle size={100} strokeWidth={4} />
  </div>
  <h2 className="text-6xl lg:text-9xl font-black text-slate-900 mb-12 tracking-tighter leading-none break-words w-full"><FormattedText text={slide.heading} /></h2>
  <div className="text-3xl lg:text-6xl leading-tight text-slate-800 whitespace-pre-wrap text-left bg-slate-50 p-12 lg:p-24 rounded-[3.5rem] border-[10px] border-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] w-full">
    <FormattedText text={slide.content} />
  </div>
</div>
```

**AFTER:**
```jsx
<div className="flex flex-col items-center justify-center text-center w-full h-full animate-in fade-in zoom-in-95 duration-1000 bg-white p-8 lg:p-16">
  <div className="w-40 h-40 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-12 shadow-[0_30px_60px_-10px_rgba(34,197,94,0.3)] border-[8px] border-white animate-bounce">
    <CheckCircle size={100} strokeWidth={4} />
  </div>
  <h2 className="heading-h1 text-slate-900 mb-12 break-words w-full"><FormattedText text={slide.heading} /></h2>
  <div className="body-lg text-slate-800 whitespace-pre-wrap text-left bg-slate-50 p-12 lg:p-24 rounded-[3.5rem] border-[10px] border-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] w-full max-w-3xl mx-auto">
    <FormattedText text={slide.content} />
  </div>
</div>
```

---

#### DemoSlide.jsx

**BEFORE (lines 15-22):**
```jsx
<div className="flex flex-col w-full h-full animate-in fade-in slide-in-from-right-8 duration-700 bg-white">
  <div className="text-center py-12 px-8 lg:py-16 lg:px-12 bg-slate-50 border-b border-slate-100">
    <h2 className="text-6xl lg:text-8xl font-black text-slate-900 mb-4 tracking-tighter leading-none"><FormattedText text={slide.heading} /></h2>
    <div className="text-2xl lg:text-4xl text-slate-700 whitespace-pre-wrap font-medium max-w-[90%] mx-auto leading-tight">
      <FormattedText text={slide.content} />
    </div>
  </div>
```

**AFTER:**
```jsx
<div className="flex flex-col w-full h-full animate-in fade-in slide-in-from-right-8 duration-700 bg-white">
  <div className="text-center py-12 px-8 lg:py-16 lg:px-12 bg-slate-50 border-b border-slate-100">
    <h2 className="heading-h1 text-slate-900 mb-4"><FormattedText text={slide.heading} /></h2>
    <div className="body-lg text-slate-700 whitespace-pre-wrap max-w-2xl mx-auto">
      <FormattedText text={slide.content} />
    </div>
  </div>
```

---

#### ExerciseSlide.jsx - Input Fields (lines 213-254)

**BEFORE (sample):**
```jsx
<label className="text-2xl font-black text-slate-800 min-w-[100px] text-right">
  {f.label}
</label>
<div className="relative flex-1">
  <input 
    type="text"
    value={isRevealed ? f.answer : (answers[f.id] || '')}
    onChange={(e) => handleChange(f.id, e.target.value)}
    className={`w-full text-2xl font-bold px-6 py-4...`}
  />
```

**AFTER:**
```jsx
<label className="label-text text-slate-800 min-w-[100px] text-right">
  {f.label}
</label>
<div className="relative flex-1">
  <input 
    type="text"
    value={isRevealed ? f.answer : (answers[f.id] || '')}
    onChange={(e) => handleChange(f.id, e.target.value)}
    className={`w-full body-base font-medium px-6 py-4...`}
  />
```

---

#### WelcomeSlide.jsx

**BEFORE (lines 8-18):**
```jsx
<div className="max-w-4xl w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
  <div className="text-center mb-16">
    <div className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-wider mb-6">
      Welkom! 👋
    </div>
    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-6 tracking-tighter">
      Stelling van Pythagoras
    </h1>
    <p className="text-2xl md:text-3xl text-slate-600 font-medium">
      Leer de beroemdste stelling uit de wiskunde
    </p>
  </div>
```

**AFTER:**
```jsx
<div className="max-w-4xl w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
  <div className="text-center mb-16">
    <div className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-wider mb-6">
      Welkom! 👋
    </div>
    <h1 className="heading-display text-slate-900 mb-6">
      Stelling van Pythagoras
    </h1>
    <p className="text-lg md:text-2xl lg:text-3xl text-slate-600 font-medium">
      Leer de beroemdste stelling uit de wiskunde
    </p>
  </div>
```

---

### Form Components (General Guidelines)

Apply to LoginScreen.jsx, NameSetupModal.jsx, etc.:

```jsx
// Form labels
<label className="label-text text-slate-700 mb-2">
  Voornaam
</label>

// Form inputs
<input
  className="body-base px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
/>

// Button text
<button className="btn-text bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all">
  Inloggen
</button>

// Help text
<p className="body-sm text-slate-500">
  Gebruik je schoolemail
</p>
```

---

## Phase 3: Advanced Enhancements (1-2 hours)

### Option A: Add Tailwind Theme Configuration

If you want to make the system truly maintainable, add custom theme in a `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      fontSize: {
        'heading-display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-1.5px', fontWeight: '900' }],
        'heading-h1': ['3rem', { lineHeight: '1.15', letterSpacing: '-1px', fontWeight: '900' }],
        'heading-h2': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-h3': ['1.5rem', { lineHeight: '1.25', fontWeight: '600' }],
        'body-lg': ['1.25rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
      },
      lineHeight: {
        'heading': '1.2',
        'body': '1.6',
        'accessible': '1.75',
      },
    }
  }
}
```

Then update index.css to use it:

```css
@layer components {
  .heading-display {
    @apply text-heading-display;
  }
  .heading-h1 {
    @apply text-heading-h1;
  }
  /* etc */
}
```

### Option B: Dark Mode Typography (Future)

Add to index.css:

```css
@layer components {
  .dark {
    .heading-h1 {
      @apply text-slate-50;
    }
    .body-lg {
      @apply text-slate-200;
    }
  }
}
```

---

## Validation Checklist

After implementing Phase 1 and 2:

### Visual Inspection
- [ ] All headings use one of: heading-display, heading-h1, heading-h2, heading-h3
- [ ] All body text uses one of: body-lg, body-base, body-sm
- [ ] No inline text size classes (text-3xl, text-4xl, etc.) outside utilities
- [ ] Headings have consistent leading/tracking

### Responsive Testing
- [ ] **Mobile (375px):** Text readable, no oversizing
- [ ] **Tablet (768px):** Good balance of size and readability
- [ ] **Desktop (1024px):** Professional appearance
- [ ] **Large display (1920px+):** Suitable for digibord

### Accessibility Testing
```bash
# Install axe DevTools Chrome extension and run:
# Tools > More Tools > Developer Tools > axe DevTools
# Look for: Text contrast, font sizes, heading hierarchy
```

### Print Testing
```bash
# Check PDF export of each slide type
# Verify fonts render correctly at different zoom levels
```

---

## Before & After Comparison

### TheorySlide Example

**BEFORE (Visual Comparison)**
```
HEADING: █████████████████████████████  [48-160px, varies wildly]
CONTENT: ████████████  [36-112px, too large]
RESULT: Chaotic, doesn't feel like one system
```

**AFTER (Visual Comparison)**
```
HEADING: █████████  [30-48px, consistent]
CONTENT: ████      [18-24px, readable body text]
RESULT: Professional, accessible, consistent
```

---

## Troubleshooting

### "Utilities not showing up"
- Make sure `@layer components` is in index.css
- Restart dev server (`npm run dev`)
- Clear Tailwind cache: `rm -rf node_modules/.cache`

### "Text is now too small on mobile"
- This is expected - you're now using a proper responsive scale
- Test on actual phone (not Chrome DevTools mobile emulation)
- If truly too small, adjust the `md:` and `lg:` breakpoint rules

### "Some components have conflicting classes"
- Search for inline Tailwind classes that conflict with utilities
- Example: `text-4xl` conflicts with `heading-h3`
- Replace with the utility class

---

## Rollback Plan

If you need to revert:

1. Comment out the `@layer components` section in index.css
2. Revert individual file changes using git
3. Restart dev server

All changes are CSS-only, so no risk to application logic.

---

## Next Steps

1. ✅ Implement Phase 1 (30 min) - See immediate improvements
2. ✅ Test on actual digibord or large display
3. ✅ Get feedback from teachers/students
4. ✅ Implement Phase 2 (1-2 hours) - Full system consistency
5. ✅ Consider Phase 3 (Theme config) - For future maintenance
6. ✅ Document final system in team wiki

---

## Questions?

Refer back to `TYPOGRAPHY_AUDIT.md` for:
- Design rationale (Section 3-5)
- Accessibility guidelines (Section 6)
- WCAG compliance details (Section 2)
- Complete size specifications (Section 4)

