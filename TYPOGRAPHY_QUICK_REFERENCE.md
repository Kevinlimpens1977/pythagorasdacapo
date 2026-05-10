# Typography Quick Reference Card

**Quick lookup for using the typography system in your components.**

---

## Heading Styles (Use these in h1, h2, h3 tags)

```jsx
// Display heading (largest, rarely used)
<h1 className="heading-display">Main Title</h1>
// → text-5xl md:text-6xl lg:text-7xl, font-black, tracking-tight

// Page/Slide Heading (most common)
<h2 className="heading-h1">Section Title</h2>
// → text-4xl md:text-5xl lg:text-6xl, font-black, tracking-tight

// Subsection Heading
<h3 className="heading-h2">Subsection Title</h3>
// → text-3xl md:text-4xl lg:text-5xl, font-bold, tracking-tight

// Small Heading
<h4 className="heading-h3">Small Title</h4>
// → text-2xl md:text-3xl lg:text-4xl, font-semibold

// Mini Heading (labels)
<h5 className="heading-h4">Label Text</h5>
// → text-xl md:text-2xl lg:text-3xl, font-semibold
```

---

## Body Text Styles

```jsx
// Large body text (exercise instructions, important content)
<p className="body-lg">
  This is large body text for important paragraphs or instructions.
</p>
// → text-lg md:text-xl lg:text-2xl, leading-relaxed (1.6x)

// Regular body text (default for most paragraphs)
<p className="body-base">
  Standard paragraph text for general content.
</p>
// → text-base md:text-lg lg:text-xl, leading-relaxed (1.6x)

// Small body text (captions, secondary info)
<p className="body-sm">
  This is smaller text for secondary information.
</p>
// → text-sm md:text-base lg:text-lg, leading-relaxed (1.6x)
```

---

## Form & Label Text

```jsx
// Form label
<label className="label-text">
  Your Name
</label>
// → text-sm md:text-base lg:text-lg, font-semibold

// Small label (hints, metadata)
<label className="label-sm">
  Optional field
</label>
// → text-xs md:text-sm, font-semibold

// Form input text (inside the input)
<input className="body-base font-medium" />
// → text-base md:text-lg lg:text-xl

// Help text under form
<p className="body-sm text-slate-500">
  We'll never share your email.
</p>
// → text-sm md:text-base lg:text-lg, text-slate-500
```

---

## Button Text

```jsx
// Standard button
<button className="btn-text bg-blue-600 text-white">
  Click me
</button>
// → text-base md:text-lg lg:text-xl, font-bold

// Large button (prominent actions)
<button className="btn-text-lg bg-blue-600 text-white">
  Check Answer
</button>
// → text-lg md:text-2xl lg:text-3xl, font-bold
```

---

## Component Examples

### TheorySlide
```jsx
<h2 className="heading-h1">Pythagorean Theorem</h2>
<p className="body-lg">
  In a right triangle, the square of the hypotenuse equals...
</p>
```

### ExerciseSlide
```jsx
<h2 className="heading-h1">Calculate the Hypotenuse</h2>
<p className="body-lg">Find the missing side:</p>

<label className="label-text">Side A (cm):</label>
<input className="body-base" type="text" />

<button className="btn-text-lg">Check Answer</button>
```

### Form
```jsx
<label className="label-text">Email Address</label>
<input className="body-base" />
<p className="body-sm text-slate-500">We'll never share this.</p>
```

### Table
```jsx
<th className="btn-text text-left">Name</th>
<td className="body-base">John Doe</td>
```

---

## DO's ✅

```jsx
// DO: Use utility classes
<h1 className="heading-h1">Title</h1>
<p className="body-lg">Content</p>

// DO: Mix with color/spacing utilities as needed
<p className="body-base text-slate-600 mb-4">Muted text</p>

// DO: Respond to breakpoints
<h2 className="heading-h2 md:heading-h1">Responsive</h2>

// DO: Use semantic HTML
<h1>H1 for main title</h1>
<h2>H2 for subtitles</h2>
<p>P for paragraphs</p>
```

---

## DON'Ts ❌

```jsx
// DON'T: Use individual text sizes
<h1 className="text-6xl md:text-8xl">Title</h1>  // ❌ TOO LARGE

// DON'T: Mix font weights in text-* utilities
<p className="text-2xl font-black">Content</p>  // ❌ INCONSISTENT

// DON'T: Use text sizes for non-text elements
<div className="text-5xl">Layout</div>  // ❌ USE UTILITY CLASS

// DON'T: Skip responsive sizes
<p className="text-2xl">Mobile? Desktop?</p>  // ❌ NO BREAKPOINTS

// DON'T: Use h1, h2, h3 without classes
<h1>Title</h1>  // ❌ UNSTYLED - Add className="heading-h1"
```

---

## Responsive Behavior

All typography utilities include three breakpoints:

```
Default (Mobile):        Smallest sizes
  ↓
md: (768px+):           Medium sizes (tablets)
  ↓
lg: (1024px+):          Largest sizes (desktop/digibord)
```

**Example:**
```jsx
<p className="body-lg">
  Mobile: 18px | Tablet (md:): 20px | Desktop (lg:): 24px
</p>
```

---

## Accessibility Notes

- ✅ Minimum font size: 14px (body-sm on mobile)
- ✅ Line-height: 1.6x for all body text (dyslexia-friendly)
- ✅ Heading hierarchy: Always use h1-h5 in semantic order
- ✅ Color contrast: All text meets WCAG AA (7:1 ratio)
- ✅ No all-caps: Use font-bold instead for emphasis

---

## Sizes at a Glance

| Class | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| heading-display | 48px | 56px | 64px |
| heading-h1 | 30px | 36px | 48px |
| heading-h2 | 24px | 30px | 36px |
| heading-h3 | 20px | 24px | 30px |
| heading-h4 | 18px | 20px | 24px |
| body-lg | 18px | 20px | 24px |
| body-base | 16px | 18px | 20px |
| body-sm | 14px | 16px | 18px |
| label-text | 14px | 16px | 18px |
| btn-text | 16px | 18px | 20px |
| btn-text-lg | 18px | 24px | 30px |

---

## Import & Usage

These utilities are defined in `/src/index.css` and available globally.

No imports needed—just use them directly:

```jsx
import React from 'react';

export default function MyComponent() {
  return (
    <div>
      <h1 className="heading-h1">Title</h1>
      <p className="body-base">Content</p>
    </div>
  );
}
```

---

## Questions?

See `TYPOGRAPHY_AUDIT.md` (detailed analysis) or `TYPOGRAPHY_IMPLEMENTATION.md` (implementation guide).

---

**Last Updated:** 2026-05-10  
**Maintenance:** Keep this reference current when adding new typography utilities.
