# Design System Visual Showcase

## Color Palette

### Primary Colors
- **Blue 600:** `#2563eb` - Primary actions, interactive elements
- **Blue 700:** `#1d4ed8` - Hover state for primary actions

### Neutral Colors  
- **Slate 900:** `#0f172a` - Headings, primary text
- **Slate 800:** `#1e293b` - Secondary text
- **Slate 600:** `#475569` - Supporting text
- **Slate 500:** `#64748b` - Tertiary/muted text
- **Slate 200:** `#e2e8f0` - Borders, dividers
- **Slate 50:** `#f8fafc` - Backgrounds, subtle highlights

### Semantic Colors
- **Green 500/600:** Success states, completed items
- **Red 500/600:** Error states, warnings
- **Amber 500/600:** Warning states, caution
- **Blue 50/100:** Informational backgrounds

---

## Buttons

### Primary Button (`.btn-primary`)
```
┌─────────────────────────────┐
│     Click me               │
└─────────────────────────────┘

Padding: px-8 py-4
Font: Bold, white text
Border radius: 8px
Shadow: hover:shadow-lg
Scale: active:scale-95
Focus ring: 4px blue-300
```

**Applied to:**
- Dialog actions
- Standard app buttons
- Secondary forms

---

### Primary Large Button (`.btn-primary-lg`)
```
┌─────────────────────────────────────────────────────┐
│  🔒  Sign In                                        │
└─────────────────────────────────────────────────────┘

Padding: w-full py-3
Font: Bold, white text
Border radius: 12px
Shadow: shadow-lg shadow-blue-200
Flex: Supports icon + text with gap-2
```

**Applied to:**
- Login/signup forms
- Authentication screens
- Modal primary actions
- Form submissions

---

### Secondary Button (`.btn-secondary`)
```
┌─────────────────────────────────────────────────────┐
│  Cancel                                             │
└─────────────────────────────────────────────────────┘

Padding: w-full py-3
Border: 2px slate-200
Font: Bold, slate-700
Hover: bg-slate-50
Border radius: 12px
```

**Applied to:**
- Back/cancel buttons
- Alternative actions
- Dialog dismissal

---

## Input Fields

### Standard Input (`.input-standard`)
```
┌────────────────────────────┐
│ Type something...       │
└────────────────────────────┘

Padding: px-4 py-3
Border: 2px slate-300
Focus border: 2px blue-500
Focus ring: 2px blue-200
Border radius: 8px
```

**Applied to:**
- Form inputs in app interface
- Text/email/number inputs
- Exercise answer fields

---

### Auth Input (`.input-auth`)
```
┌────────────────────────────────────────┐
│ Type something...                   │
└────────────────────────────────────────┘

Padding: p-3 (w-full)
Border: 1px slate-200 (subtle)
Focus ring: 2px blue-500
Border radius: 12px
```

**Applied to:**
- Login form inputs
- Signup form inputs
- Name setup modal

---

## Typography

### Extra Large Heading (`.heading-xl`)
```
Main Title
━━━━━━━━━━━━━━━━━

Size: 36px → 60px (responsive)
Weight: Black (900)
Color: Slate-900
Tracking: tight
Used for: Page titles, main headings
```

---

### Large Heading (`.heading-lg`)
```
Section Title
━━━━━━━━━━━━━━

Size: 30px → 36px (responsive)
Weight: Black (900)
Color: Slate-900
Tracking: tight
Used for: Major sections, chapter titles
```

---

### Medium Heading (`.heading-md`)
```
Subsection Title
━━━━━━━━━━━━━━━

Size: 24px → 30px (responsive)
Weight: Bold (700)
Color: Slate-900
Used for: Subsections, card titles
```

---

### Secondary Text (`.text-secondary`)
```
Supporting text in slate-600
Used for descriptions, helper text, and explanations
```

---

### Tertiary Text (`.text-tertiary`)
```
Metadata in slate-500
Used for timestamps, labels, and muted information
```

---

## Spacing

### Padding Utilities

#### `.pad-content` (Main content padding)
```
┌─────────────────────────────┐
│ px-6 sm:px-8              │
│ py-8 md:py-12             │
│ ┌───────────────────────┐  │
│ │  Main content area    │  │
│ └───────────────────────┘  │
└─────────────────────────────┘

Used for: Page wrappers, main sections, content areas
Mobile: 24px left/right, 32px top/bottom
Tablet+: 32px left/right, 48px top/bottom
```

---

#### `.pad-compact` (Compact padding)
```
┌──────────────────────────┐
│ px-4 py-3              │
│ md:px-6 md:py-4        │
│ ┌────────────────────┐  │
│ │ Compact content    │  │
│ └────────────────────┘  │
└──────────────────────────┘

Used for: Cards, modals, compact sections
Mobile: 16px left/right, 12px top/bottom
Tablet+: 24px left/right, 16px top/bottom
```

---

### Spacing Scale Utilities

#### `.spacing-tight` (Dense layouts)
```
Item 1
▼ gap-4
Item 2
▼ gap-4
Item 3

Gap between items: 16px
Used for: Dense lists, compact grids, sidebar items
```

#### `.spacing-normal` (Standard layouts)
```
Item 1
▼ gap-6 (md: gap-8)
Item 2
▼ gap-6 (md: gap-8)
Item 3

Gap between items: 24px (32px on tablet+)
Used for: Standard lists, forms, content grids
```

#### `.spacing-loose` (Open layouts)
```
Item 1
▼ gap-8 (md: gap-12)
Item 2
▼ gap-8 (md: gap-12)
Item 3

Gap between items: 32px (48px on tablet+)
Used for: Section layouts, feature grids, hero sections
```

---

## Cards

### Card Base (`.card-base`)
```
┌────────────────────────────────┐
│                              │
│  Card content area           │
│                              │
└────────────────────────────────┘

Border radius: 8px
Border: 1px slate-200
Shadow: shadow-sm
Hover shadow: shadow-md
Used for: Feature cards, content containers
```

---

## Responsive Behavior

### Mobile-First Approach
All utilities are designed mobile-first and scale up:

```
┌──────────────────────────────────────────────────────┐
│ Mobile (< 640px)                                     │
│                                                      │
│ px-6  py-8                                          │
│                                                      │
│ [Larger gap/spacing on tablet+]                     │
└──────────────────────────────────────────────────────┘
```

---

## Implementation Checklist

✓ Button utilities defined (.btn-primary, .btn-primary-lg, .btn-secondary)
✓ Input utilities defined (.input-standard, .input-auth)
✓ Typography utilities defined (.heading-xl/lg/md, .text-secondary/tertiary)
✓ Spacing utilities defined (.pad-content, .pad-compact, .spacing-*)
✓ Card utilities defined (.card-base)
✓ Applied to LoginScreen component
✓ Applied to NameSetupModal component
✓ Applied to TableOfContents component
✓ Applied to PresentationSlide component
□ Applied to ExerciseSlide component
□ Applied to ClassOverview dashboard
□ Applied to remaining slide components
□ Visual testing across screen sizes
□ Accessibility testing (focus states, contrast)

---

## Testing Recommendations

### Visual Testing Checklist
- [ ] Desktop (1920px+): Verify button sizes, text scaling, spacing
- [ ] Tablet (768px-1024px): Verify responsive padding, grid layouts
- [ ] Mobile (375px-480px): Verify readable text, button sizes, spacing
- [ ] Light mode: Verify all colors are legible (WCAG AA minimum)

### Accessibility Testing
- [ ] Tab through all buttons - verify visible focus state
- [ ] Tab through all inputs - verify visible focus state
- [ ] Check color contrast - minimum 4.5:1 for text
- [ ] Test keyboard navigation on forms
- [ ] Verify focus indicators are clearly visible

### Component Testing
- [ ] Test hover states on buttons
- [ ] Test active states on buttons
- [ ] Test disabled states on buttons
- [ ] Test focus states on inputs
- [ ] Test form submission with validation
- [ ] Test error states and messaging

