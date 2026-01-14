# BRAND_IDENTITY.md
# UrbanEstate - Design System

---

## BRAND PERSONALITY

**What UrbanEstate Is:**
- Institutional and modern
- Trustworthy and accessible
- Calm and professional
- Like a government system (but modern)
- Like a banking app (but accessible)

**What UrbanEstate Is NOT:**
- Trendy or "startup-ish"
- Loud or salesy
- Playful or casual
- Aggressive or pushy

---

## COLOR SYSTEM

### Primary Colors

**Civic Blue:**
```
Hex: #0B1F33
Usage: Header text, primary buttons, icons, navigation
```

**Verification Green:**
```
Hex: #1E7F4B
Usage: Verified badges ONLY, success states, trust confirmations
```

**Authority Amber:**
```
Hex: #C28F2C
Usage: Warnings, important notices (USE SPARINGLY)
```

### Neutral Colors

**Institutional White:**
```
Hex: #F8F9FA
Usage: Page backgrounds, card backgrounds
```

**Deep Charcoal:**
```
Hex: #1A1A1A
Usage: Primary text (never pure black #000000)
```

**Subtle Border:**
```
Hex: #E3E6E8
Usage: Card borders, dividers
```

### Dark Mode Colors

**Dark Background:** #0E141B

**Card Background:** #151C24

**Primary Text:** #E6E6E6

**Secondary Text:** #AAB0B6

---

## TYPOGRAPHY

**Font Family:** Inter (Google Font)

**Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold)

**Scale:**
- Hero: 36px / 600 weight
- Headline: 24px / 600 weight
- Section: 20px / 600 weight
- Body: 16px / 400 weight
- Small: 14px / 400 weight

**Rules:**
- Always sentence case
- Never ALL CAPS
- Line height ≥ 1.5
- Never pure black text

---

## BUTTONS

**Primary Button:**
```typescript
<button className="
  bg-civic-blue 
  text-white 
  px-6 py-3 
  rounded-lg 
  font-medium
  hover:bg-opacity-90
  transition-colors
">
  View Properties
</button>
```

**Dimensions:**
- Height: 48px (mobile), 44px (desktop)
- Padding: 24px horizontal, 12px vertical
- Border radius: 8px

**Button Copy:**
- Action-oriented: "View properties", "Create listing"
- Never urgent: "BUY NOW!!!", "LIMITED TIME!!!"

---

## CARDS

```typescript
<div className="
  bg-white 
  border border-subtle-border 
  rounded-xl 
  p-4
  hover:shadow-md
  transition-shadow
">
  {/* Content */}
</div>
```

**Rules:**
- Subtle borders only
- Generous padding (16px minimum)
- Rounded corners (12px)
- Hover elevation (subtle shadow)
- No heavy shadows
- No gradients

---

## FORM INPUTS

```typescript
<input 
  type="text"
  className="
    w-full
    px-4 py-3
    border border-gray-300
    rounded-lg
    text-base
    focus:outline-none
    focus:border-civic-blue
    focus:ring-2
    focus:ring-civic-blue/20
  "
  placeholder="Enter location"
/>
```

**Rules:**
- Height: 48px minimum
- Border radius: 8px
- Focus: 2px ring, civic blue
- Clear placeholder text

---

## BADGES

**Verified Badge:**
```typescript
<span className="
  inline-flex items-center gap-1
  px-3 py-1
  bg-verification-green/10
  text-verification-green
  text-sm font-medium
  rounded-full
">
  ✓ Verified
</span>
```

**Unverified Badge:**
```typescript
<span className="
  inline-flex items-center gap-1
  px-3 py-1
  bg-gray-100
  text-gray-600
  text-sm font-medium
  rounded-full
">
  Unverified
</span>
```

---

## SPACING SCALE

```
xs:   4px   (tight spacing)
sm:   8px   (badges, inline)
md:   16px  (cards, sections)
lg:   24px  (comfortable)
xl:   32px  (section breaks)
2xl:  48px  (major sections)
```

---

## ICONS

**Style:** Outline/line icons (Lucide React)

**Stroke:** 2px consistent

**Sizes:** 20px (body), 24px (headings), 16px (small)

**Rules:**
- Neutral, not playful
- Aligned to text baseline
- No emoji in UI

---

## ANIMATION PRINCIPLES

**Subtle, functional animations only**

```css
/* Good uses */
- Button hover states (150ms)
- Focus rings (200ms)
- Modal fade-in (200ms)
- Dropdown expand (200ms)

/* Never use */
- Flashy entrance animations
- Continuous looping
- Parallax scrolling
- Attention-grabbing effects
```

---

## LOADING STATES

**Use skeleton loaders, never spinners:**
```typescript
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

---

## LOGO SYSTEM

**Official Logo:**
- Geometric buildings with grid windows
- White buildings + amber windows
- Civic Blue background
- Square format (1024x1024 for app icon)
- Horizontal format (logo + "UrbanEstate" text)

**Logo Usage:**
- Maintain clear space
- Use on white or civic blue only
- Never stretch or rotate
- Never add effects

**Logo Files Location:**
```
frontend/public/logo/
├── app-icon.png (1024x1024)
└── logo-horizontal.png
```

---

## COPYWRITING TONE

**Voice:**
- Clear and direct
- Helpful and respectful
- Calm and professional
- Honest about delays

**Writing Rules:**
```
✅ "Your property is being reviewed"
❌ "Processing your request"

✅ "We verify listings to protect both landlords and tenants"
❌ "Verification required"

✅ "Review usually takes 24 hours"
❌ "Instant approval!"
```

---

## ACCESSIBILITY

**WCAG AA Minimum:**
- Color contrast ≥ 4.5:1 (text)
- Color contrast ≥ 3:1 (UI elements)
- All images have alt text
- Keyboard navigation works
- Focus indicators visible

---

## RESPONSIVE DESIGN

**Mobile-First Breakpoints:**
```
Base: 375px (iPhone SE)
Tablet: 768px
Desktop: 1024px
Large: 1280px
```

**Rules:**
- Design for mobile first
- Thumb-reachable tap targets (44px minimum)
- Single-column layouts default
- No hover-only interactions

---

## TAILWIND CONFIG

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'civic-blue': '#0B1F33',
        'verification-green': '#1E7F4B',
        'authority-amber': '#C28F2C',
        'institutional-white': '#F8F9FA',
        'deep-charcoal': '#1A1A1A',
        'subtle-border': '#E3E6E8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

---

## COMPONENT EXAMPLES

**Header:**
```typescript
<header className="bg-white border-b border-subtle-border">
  <nav className="container mx-auto px-4 py-4">
    <Image src="/logo/logo-horizontal.png" alt="UrbanEstate" />
  </nav>
</header>
```

**Property Card:**
```typescript
<div className="bg-white border border-subtle-border rounded-xl p-4">
  <Image src={image} className="rounded-lg mb-4" />
  <h3 className="text-lg font-semibold text-deep-charcoal">
    {title}
  </h3>
  <p className="text-civic-blue font-semibold">
    KSh {price.toLocaleString()}
  </p>
</div>
```

---

## DESIGN CHECKLIST

Before shipping any page:
- [ ] Uses brand colors only
- [ ] Typography scale followed
- [ ] Spacing consistent
- [ ] Mobile-first design
- [ ] Buttons have hover states
- [ ] Loading states exist
- [ ] Error states handled
- [ ] Empty states designed
- [ ] Color contrast passes WCAG AA
- [ ] Keyboard navigation works

---

## CRITICAL PRINCIPLES

**Space > Decoration:**
White space is not wasted space

**Clarity > Creativity:**
Users need answers, not art

**Trust > Trends:**
Design for 10 years, not 10 months

**Function > Flash:**
Every element must serve a purpose

**Mobile > Desktop:**
Design for phones first, always