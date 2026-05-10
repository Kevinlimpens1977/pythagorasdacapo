# Design System - Phase 1

## Overview

The design system provides standardized, reusable utility classes for consistent UI styling across the Pythagoras learning platform. All utilities are defined in `src/index.css` using Tailwind CSS's `@apply` directive.

## Button Utilities

### `.btn-primary`
Standard primary button with blue background, shadow, and focus ring.

**Usage:**
```jsx
<button className="btn-primary">
  Click me
</button>
```

**Styles:**
- Padding: `px-8 py-4`
- Background: `bg-blue-600` → hover: `bg-blue-700`
- Text: `text-white font-bold`
- Border radius: `rounded-lg`
- Active state: `active:scale-95 active:shadow-md`
- Hover state: `hover:shadow-lg hover:-translate-y-0.5`
- Focus ring: `focus:ring-4 focus:ring-blue-300 focus:ring-offset-2`

**When to use:**
- Primary actions in dialogs and modals
- Standard app buttons
- Call-to-action buttons

---

### `.btn-primary-lg`
Full-width primary button for forms and authentication screens.

**Usage:**
```jsx
<button className="btn-primary-lg">
  <Icon size={20} />
  Sign In
</button>
```

**Styles:**
- Width: `w-full`
- Padding: `py-3`
- Background: `bg-blue-600` → hover: `bg-blue-700`
- Border radius: `rounded-xl` (more rounded than `.btn-primary`)
- Shadow: `shadow-lg shadow-blue-200`
- Supports icon + text layout with `flex items-center justify-center gap-2`

**When to use:**
- Login/signup forms
- Authentication screens
- Modal action buttons requiring full width

**Disabled state:**
```jsx
<button disabled className="btn-primary-lg">
  Submit
</button>
```
Becomes: `bg-blue-400 text-white opacity-60 cursor-not-allowed`

---

### `.btn-secondary`
Outline-style secondary button for alternative actions.

**Usage:**
```jsx
<button className="btn-secondary">
  Cancel
</button>
```

**Styles:**
- Width: `w-full`
- Padding: `py-3`
- Border: `border-2 border-slate-200`
- Text: `text-slate-700 font-bold`
- Hover: `hover:bg-slate-50`
- Border radius: `rounded-xl`

**When to use:**
- Cancel/back buttons
- Secondary options in forms
- Alternative actions alongside primary buttons

---

## Input Utilities

### `.input-standard`
Standard input field with blue focus ring.

**Usage:**
```jsx
<input type="text" className="input-standard" />
```

**Styles:**
- Padding: `px-4 py-3`
- Border: `border-2 border-slate-300`
- Background: `bg-white`
- Border radius: `rounded-lg`
- Focus: `focus:border-blue-500 focus:ring-2 focus:ring-blue-200`

**When to use:**
- General form inputs in the app interface
- Text, email, and other standard inputs
- Exercise feedback displays

---

### `.input-auth`
Auth form input with subtle border and rounded corners.

**Usage:**
```jsx
<input type="email" className="input-auth" />
```

**Styles:**
- Full width: `w-full`
- Padding: `p-3`
- Border: `border border-slate-200` (single, subtle)
- Border radius: `rounded-xl`
- Focus: `focus:ring-2 focus:ring-blue-500`

**When to use:**
- Login screen form inputs
- Signup form inputs
- Name setup modal inputs
- Any authentication-related input field

---

## Typography Utilities

### `.heading-xl`
Extra-large heading for page titles and major sections.

**Usage:**
```jsx
<h1 className="heading-xl">Main Title</h1>
```

**Styles:**
- Size: `text-4xl md:text-5xl lg:text-6xl`
- Weight: `font-black` (900)
- Color: `text-slate-900`
- Spacing: `tracking-tight`

---

### `.heading-lg`
Large heading for section titles.

**Usage:**
```jsx
<h2 className="heading-lg">Section Title</h2>
```

**Styles:**
- Size: `text-3xl md:text-4xl`
- Weight: `font-black` (900)
- Color: `text-slate-900`
- Spacing: `tracking-tight`

---

### `.heading-md`
Medium heading for subsections.

**Usage:**
```jsx
<h3 className="heading-md">Subsection</h3>
```

**Styles:**
- Size: `text-2xl md:text-3xl`
- Weight: `font-bold` (700)
- Color: `text-slate-900`

---

## Slide Typography Utilities

### `.slide-heading`
Proportionally-scaled heading for slide content (Theory, Exercise, Demo, Summary slides).

**Usage:**
```jsx
<h2 className="slide-heading mb-8">Slide Title</h2>
```

**Styles:**
- Mobile: `text-5xl` (48px)
- Small: `sm:text-6xl` (60px)
- Tablet: `md:text-7xl` (84px)
- Desktop: `lg:text-9xl` (128px)
- Weight: `font-black` (900)
- Color: `text-slate-900`
- Spacing: `tracking-tighter leading-[0.85]`

**When to use:**
- Main heading on Theory/Exercise/Demo/Summary slides
- Maintains consistent heading-to-content ratio across all breakpoints
- Replaces inline text-6xl/text-8xl/text-[10rem] styling

---

### `.slide-content`
Proportionally-scaled body content for slides, maintains 1.5x-1.75x ratio to heading.

**Usage:**
```jsx
<div className="slide-content whitespace-pre-wrap">
  Slide description and content text
</div>
```

**Styles:**
- Mobile: `text-2xl` (24px)
- Small: `sm:text-3xl` (30px)
- Tablet: `md:text-4xl` (36px)
- Desktop: `lg:text-6xl` (60px)
- Line height: `leading-[1.15]`
- Color: `text-slate-700`
- Weight: `font-medium` (500)

**When to use:**
- Body/descriptive text on slides
- Always pair with `.slide-heading` for visual consistency
- Replaces inline text-4xl/text-5xl/text-7xl styling

**Proportional Relationship:**
The heading-to-content size ratio is consistent across all breakpoints:
- Mobile: 48px ÷ 24px = 2.0x
- Small: 60px ÷ 30px = 2.0x
- Tablet: 84px ÷ 36px = 2.33x
- Desktop: 128px ÷ 60px = 2.13x

---

## Text Color Utilities

### `.text-secondary`
Secondary text color for descriptions and supporting text.

```jsx
<p className="text-secondary">Supporting text</p>
```

**Color:** `text-slate-600`

---

### `.text-tertiary`
Tertiary text color for less prominent information.

```jsx
<p className="text-tertiary">Metadata</p>
```

**Color:** `text-slate-500`

---

## Spacing Utilities

### `.pad-content`
Standard padding for main content sections with responsive sizing.

**Usage:**
```jsx
<div className="pad-content">
  {/* Main content */}
</div>
```

**Styles:**
- Mobile: `px-6 py-8`
- Tablet/Desktop: `sm:px-8 md:py-12`

**When to use:**
- Page wrapper padding
- Main content areas
- Table of contents sections

---

### `.pad-compact`
Compact padding for smaller sections and components.

**Usage:**
```jsx
<div className="pad-compact">
  {/* Compact content */}
</div>
```

**Styles:**
- Mobile: `px-4 py-3`
- Tablet/Desktop: `md:px-6 md:py-4`

**When to use:**
- Card interiors
- Compact sections
- Dialog padding

---

## Spacing Scale Utilities

### `.spacing-tight`
Tight spacing for dense layouts.

**Styles:** `gap-4 space-y-4`

---

### `.spacing-normal`
Normal spacing for standard layouts.

**Styles:** `gap-6 space-y-6 md:gap-8 md:space-y-8`

---

### `.spacing-loose`
Loose spacing for open, airy layouts.

**Styles:** `gap-8 space-y-8 md:gap-12 md:space-y-12`

---

## Card Utilities

### `.card-base`
Standard card styling with subtle shadow and border.

**Usage:**
```jsx
<div className="card-base">
  {/* Card content */}
</div>
```

**Styles:**
- Border radius: `rounded-lg`
- Border: `border border-slate-200`
- Shadow: `shadow-sm`
- Hover: `hover:shadow-md`
- Transition: `transition-shadow`

---

## Responsive Design

All utilities support Tailwind's responsive prefixes:
- `sm:` - Small screens (640px+)
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)
- `xl:` - Extra-large screens (1280px+)

### Example:
```jsx
<div className="px-4 md:px-8 lg:px-12">
  Responsive padding
</div>
```

---

## Implementation Guidelines

### 1. Component Styling Hierarchy
1. **Utility classes first** - Use provided utility classes for consistency
2. **Tailwind utilities second** - Use standard Tailwind for one-off styles
3. **Component-specific styles** - Only add custom styles when utilities don't apply

### 2. Color Consistency
- Primary actions: `bg-blue-600/700`
- Secondary actions: `border-slate-200` with `text-slate-700`
- Success: `bg-green-500/600` or `text-green-600`
- Error: `bg-red-500/600` or `text-red-600`
- Warning: `bg-amber-500/600` or `text-amber-600`

### 3. Spacing Consistency
- Use `.pad-content` for main sections
- Use `.pad-compact` for cards and modals
- Use spacing utilities (`.spacing-tight/normal/loose`) for lists and grids
- Maintain consistent gaps between elements (multiples of 4px)

### 4. Typography Guidelines
- Use appropriate heading levels (`.heading-xl/lg/md`)
- Use `.text-secondary` for descriptions
- Use `.text-tertiary` for metadata and timestamps
- Maintain consistent font weights: black (900), bold (700), medium (500), normal (400)

### 5. Focus and Accessibility
- All interactive elements must have visible focus states
- Use `focus:ring-4 focus:ring-blue-300 focus:ring-offset-2` for buttons
- Use `focus:ring-2 focus:ring-blue-500` for inputs
- Test keyboard navigation on all components

---

## Component Examples

### Login Form
```jsx
<form className="space-y-4 mb-6">
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1">
      Email
    </label>
    <input
      type="email"
      className="input-auth"
      placeholder="name@school.nl"
    />
  </div>
  
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1">
      Password
    </label>
    <input
      type="password"
      className="input-auth"
      placeholder="••••••••"
    />
  </div>
  
  <button type="submit" className="btn-primary-lg">
    Sign In
  </button>
</form>
```

### Card Layout
```jsx
<div className="card-base pad-compact">
  <h3 className="heading-md mb-4">Card Title</h3>
  <p className="text-secondary mb-6">Card description</p>
  <button className="btn-primary">Action</button>
</div>
```

### Modal
```jsx
<div className="fixed inset-0 flex items-center justify-center bg-slate-900/50">
  <div className="bg-white rounded-2xl pad-compact max-w-md w-full">
    <h2 className="heading-lg mb-4">Modal Title</h2>
    <p className="text-secondary mb-6">Modal content</p>
    <button className="btn-primary-lg">Confirm</button>
  </div>
</div>
```

---

## Future Extensions (Phase 2+)

- Button variants for different sizes and colors
- Form validation state styling
- Toast/notification utilities
- Data table utilities
- Modal and overlay utilities
- Animation utilities

---

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires CSS that supports:
  - CSS Grid
  - CSS Flexbox
  - CSS Custom Properties (where applicable)
  - CSS Focus Visible

---

## Maintenance

When updating the design system:
1. Update all related utilities in `src/index.css`
2. Document changes in this file
3. Test across all component types that use the utility
4. Verify responsive behavior on mobile, tablet, and desktop
5. Check accessibility (focus states, color contrast, keyboard navigation)

