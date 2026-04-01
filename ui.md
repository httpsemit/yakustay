# Grand Haven Hotel — UI Design Documentation
> Design System v1.0 | Inspired by "The Mountain Mist" Philosophy

---

## 1. Creative North Star

**Design Philosophy: "The Mountain Mist"**

Grand Haven Hotel's UI moves away from the rigid, boxed-in layouts of traditional hospitality websites. Instead, it adopts an editorial philosophy: elements should feel as though they are floating within a landscape, defined by tonal depth rather than structural lines.

We prioritize breathing room, intentional asymmetry, and a layered hierarchy that mimics the receding ridges of the Assam-Arunachal border — the very landscape our hotel inhabits.

**Editorial Signature:**
Pair oversized, delicate Serif display text with tightly tracked, functional Sans-Serif labels. Use overlapping imagery where a `surface-container` card partially obscures a full-bleed photograph, creating a sense of physical three-dimensionality.

> Every design decision should ask: *"Does this feel organic, luxurious, and grounded in nature?"*

---

## 2. Color System

The palette is derived from the transition of dawn to dusk at high altitude — deep forest shadows, misty slate horizons, and the warm glow of timber interiors.

### 2.1 Core Palette

| Token | Hex | Name | Usage |
|-------|-----|------|-------|
| `primary` | `#061b0e` | Deep Forest | High-authority text, primary CTA backgrounds |
| `primary-container` | `#1b3022` | Forest Shadow | Hover states, dark card backgrounds |
| `secondary` | `#50606f` | Misty Slate | Secondary text, supporting icons, captions |
| `tertiary` | `#281100` | Warm Wood | Platinum tier, luxury accent moments |
| `background` | `#fbfaee` | Clean Ivory | Main canvas — the system's "breath" |
| `surface` | `#fbfaee` | Ivory Surface | Base content areas |
| `surface-container-low` | `#f5f4e8` | Warm Paper | Cards, form fields, feature sections |
| `surface-container` | `#efeee3` | Aged Linen | Hover states on containers |
| `surface-container-high` | `#e9e9dd` | Stone Wash | Subtle section dividers |
| `surface-container-highest` | `#e4e3d7` | Dry Grass | Image overlay captions |
| `surface-container-lowest` | `#ffffff` | Pure White | Interactive cards, modals |
| `surface-dim` | `#dbdbcf` | Earth Tone | Footer background |
| `on-surface` | `#1b1c15` | Near Black | Body text on light backgrounds |
| `on-surface-variant` | `#434843` | Slate Text | Supporting text |
| `outline-variant` | `#c3c8c1` | Ghost Line | Accessibility borders (15% opacity only) |

### 2.2 Semantic / Feature Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-fixed` | `#d0e9d4` | "Couple Friendly" chip, success states |
| `secondary-fixed` | `#d4e4f6` | "No ILP Required" chip, info states |
| `tertiary-fixed` | `#ffdcc4` | "Near ITBP Camp" chip, warm highlights |
| `on-primary-fixed` | `#0b2013` | Text on primary-fixed backgrounds |
| `on-secondary-fixed` | `#0d1d2a` | Text on secondary-fixed backgrounds |
| `on-tertiary-fixed` | `#2f1501` | Text on tertiary-fixed backgrounds |
| `error` | `#ba1a1a` | Error states |
| `error-container` | `#ffdad6` | Error backgrounds |

### 2.3 Loyalty Tier Colors

| Tier | Background | Text | Accent |
|------|-----------|------|--------|
| Silver | `#f5f4e8` | `#061b0e` | `#50606f` |
| Gold | `#1b3022` | `#ffffff` | `#819986` |
| Platinum | `#281100` | `#ffffff` | `#efbc98` |

### 2.4 The "No-Line" Rule

> **Explicit Instruction:** 1px solid borders are strictly prohibited for sectioning or containment. All section boundaries must be defined solely through background color shifts.

**Correct:**
```css
/* Define section boundary through color shift */
.section { background: #fbfaee; }
.section-card { background: #f5f4e8; }
```

**Wrong:**
```css
/* Never use borders for containment */
.section { border: 1px solid #c3c8c1; } /* ❌ */
.card { border-bottom: 1px solid #eee; } /* ❌ */
```

**Ghost Border Exception (accessibility only):**
```css
/* Only when legally required for contrast */
.accessible-card {
  border: 1px solid rgba(195, 200, 193, 0.15); /* outline-variant at 15% */
}
```

### 2.5 Glass & Gradient Signature

**Frosted Glass Navigation:**
```css
header {
  background: rgba(251, 250, 238, 0.82); /* surface at 82% */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

**Hero Gradient Overlay:**
```css
.hero-overlay {
  background: linear-gradient(
    to bottom,
    rgba(6, 27, 14, 0.2) 0%,
    rgba(6, 27, 14, 0.78) 100%
  );
}
```

**Dark Mode Glass (Modals):**
```css
.modal-glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
}
```

---

## 3. Typography

The typographic rhythm is the "voice" of the boutique experience — authoritative yet serene.

### 3.1 Font Families

| Family | Font | Role |
|--------|------|------|
| `font-headline` | Noto Serif | All headings, display text, room names |
| `font-body` | Inter | Body text, labels, navigation, buttons |
| `font-label` | Inter | Overlines, chips, uppercase labels |

**Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,300;0,400;0,700;1,300&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"/>
```

### 3.2 Type Scale

| Level | Token | Family | Size | Weight | Letter Spacing | Usage |
|-------|-------|--------|------|--------|----------------|-------|
| Display LG | `display-lg` | Noto Serif | 3.5rem | 400 | -0.02em | Hero title only |
| Display MD | `display-md` | Noto Serif | 2.5rem | 300 | -0.01em | Page hero subtitles |
| Headline MD | `headline-md` | Noto Serif | 1.75rem | 400 | Normal | Section headings |
| Headline SM | `headline-sm` | Noto Serif | 1.25rem | 400 | Normal | Card headings |
| Title SM | `title-sm` | Inter | 1rem | 500 | 0.05em | Sub-headings (all caps) |
| Body LG | `body-lg` | Inter | 1rem | 300 | Normal | Main body text |
| Body SM | `body-sm` | Inter | 0.875rem | 300 | Normal | Supporting text |
| Label MD | `label-md` | Inter | 0.75rem | 700 | 0.08em | Overlines, chips (uppercase) |
| Label SM | `label-sm` | Inter | 0.625rem | 700 | 0.15em | Micro labels (uppercase) |

### 3.3 Typography Rules

**Display text — hero statements only:**
```css
.hero-title {
  font-family: 'Noto Serif', serif;
  font-size: 3.5rem;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.05;
  color: #ffffff; /* Always white on hero */
}

.hero-title em {
  font-style: italic;
  font-weight: 300;
  opacity: 0.9;
}
```

**Overlines — section category labels:**
```css
.overline {
  font-family: 'Inter', sans-serif;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #50606f; /* Always secondary/misty slate */
  margin-bottom: 0.5rem;
}
```

**Never use:**
- Pure black `#000000` — always use `#061b0e` (Deep Forest) for dark text
- Font weight 600 or 700 for body text — use 300 or 400 only
- Mixed serif and sans-serif within a single sentence

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Icon internal gaps |
| `space-2` | 8px | Chip padding, tight gaps |
| `space-3` | 12px | Component internal gaps |
| `space-4` | 16px | Card padding (small), grid gaps |
| `space-5` | 20px | Card padding (default) |
| `space-6` | 24px | Section sub-gaps |
| `space-8` | 32px | Card padding (large), section padding (horizontal) |
| `space-12` | 48px | Section spacing (vertical) |
| `space-16` | 64px | Major section spacing |
| `space-24` | 96px | Hero padding bottom |

> **Whitespace Rule:** If a section feels crowded, double the spacing token. Go from `space-8` to `space-16`. Breathing room is a luxury signal.

### 4.2 Grid System

**Desktop (12 columns):**
- Use asymmetrical column starts — main content can begin at column 3 while images bleed to column 12
- Max content width: `1280px` centered

**Bento Grid (Features Section):**
```css
.bento-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
/* Large feature: spans full left column at 320px height */
/* Right column: 3 stacked small cards */
```

**Room Scroller:**
```css
.heritage-scroller {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-left: 32px; /* Asymmetric — bleeds left */
  /* Right side has NO padding — cards bleed to edge */
}
```

### 4.3 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 0.25rem | Chips, small tags |
| `radius-md` | 0.5rem | Form fields, small cards |
| `radius-lg` | 0.75rem | Main cards, buttons, bento tiles |
| `radius-full` | 9999px | Pill chips, avatar circles, FABs |

---

## 5. Elevation & Depth

We convey luxury through **Tonal Layering** — not drop shadows.

### 5.1 The Layering Principle

Think of the UI as stacked sheets of fine, heavy-weight paper:

```
Level 0 — Page background:      surface         #fbfaee  (ivory)
Level 1 — Nested content:       surface-low     #f5f4e8  (warm paper)
Level 2 — Interactive cards:    surface-lowest  #ffffff  (pure white)
Level 3 — Overlays / modals:    surface-lowest  #ffffff + blur
```

**Implementation:**
```css
/* Page background */
body { background: #fbfaee; }

/* Feature section / form area */
.section-card { background: #f5f4e8; }

/* Interactive booking card on top of feature section */
.booking-card {
  background: #ffffff;
  border-radius: 0.75rem;
  /* No box-shadow needed — white on #f5f4e8 creates natural lift */
}
```

### 5.2 Ambient Shadows

Only for **floating elements** (FABs, modals, sticky bars):

```css
.fab {
  box-shadow: 0 0 48px rgba(27, 28, 21, 0.06);
  /* on-surface at 6% opacity, large blur, 0 offset */
}

.sticky-header {
  box-shadow: 0 0 32px rgba(27, 28, 21, 0.06);
}
```

> **Never use:** `box-shadow: 2px 4px 8px rgba(0,0,0,0.3)` — this reads as cheap and digital.

---

## 6. Components

### 6.1 Navigation (Glass Header)

```css
header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(251, 250, 238, 0.82);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}

.nav-logo {
  font-family: 'Noto Serif', serif;
  font-style: italic;
  font-weight: 300;
  font-size: 1.2rem;
  color: #061b0e;
  letter-spacing: -0.01em;
}

.nav-link {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #50606f;
}
```

### 6.2 Buttons ("Tactile Timber")

**Primary Button:**
```css
.btn-primary {
  background: #061b0e;
  color: #ffffff;
  border: none;
  border-radius: 0.75rem;
  padding: 12px 24px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 200ms ease-out, transform 200ms ease-out;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-primary:hover {
  background: #1b3022; /* primary-container */
  transform: translateY(-2px);
}
```

**Secondary Button (Ghost):**
```css
.btn-secondary {
  background: transparent;
  color: #061b0e;
  border: 1px solid rgba(195, 200, 193, 0.2); /* outline-variant at 20% */
  border-radius: 0.75rem;
  padding: 10px 20px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 200ms ease-out;
}

.btn-secondary:hover {
  background: #f5f4e8;
}
```

**Full-Width CTA (Search/Book):**
```css
.btn-cta {
  width: 100%;
  background: #061b0e;
  color: #ffffff;
  border: none;
  border-radius: 0.75rem;
  padding: 14px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
```

### 6.3 Chips & Tags

**Feature Chip (Room attributes):**
```css
.chip {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: 9999px;
}

.chip-info    { background: #d4e4f6; color: #0d1d2a; } /* secondary-fixed */
.chip-success { background: #d0e9d4; color: #0b2013; } /* primary-fixed */
.chip-warm    { background: #ffdcc4; color: #2f1501; } /* tertiary-fixed */
```

### 6.4 Form Fields ("Filled" Style)

```css
.form-field {
  background: #f5f4e8; /* surface-container-low */
  border-radius: 0.5rem;
  padding: 12px 14px;
  border: none;
  border-bottom: 2px solid transparent;
  transition: border-color 200ms ease-out;
}

.form-field:focus-within {
  border-bottom-color: #061b0e; /* primary — only on focus */
  outline: none;
}

.field-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #50606f;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.field-value {
  font-size: 14px;
  color: #1b1c15;
  font-weight: 400;
  background: none;
  border: none;
  outline: none;
  width: 100%;
}
```

### 6.5 Cards

**Feature Card (Bento Large):**
```css
.bento-large {
  background: #f5f4e8;
  border-radius: 0.75rem;
  padding: 32px;
  height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* No border — depth from color shift */
}
```

**Feature Card (Bento Small — Light):**
```css
.bento-small-light {
  background: #e9e9dd; /* surface-container-high */
  border-radius: 0.75rem;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 18px;
}
```

**Feature Card (Bento Small — Dark):**
```css
.bento-small-dark {
  background: #1b3022; /* primary-container */
  border-radius: 0.75rem;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 18px;
}
```

**Room Image Card (Heritage Scroller):**
```css
.room-card {
  flex-shrink: 0;
  width: 280px;
}

.room-card-image {
  height: 340px;
  border-radius: 0.75rem;
  overflow: hidden;
  position: relative;
}

.room-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 500ms ease;
}

.room-card-image:hover img {
  transform: scale(1.05);
}

.room-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%);
}

.room-card-label {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #ffffff;
}

.room-card-name {
  font-family: 'Noto Serif', serif;
  font-size: 1.1rem;
  font-weight: 400;
}

.room-card-price {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.8;
  margin-top: 4px;
}
```

**Stat / Metric Card:**
```css
.stat-card {
  background: #f5f4e8;
  border-radius: 0.75rem;
  padding: 24px;
}

.stat-value {
  font-family: 'Noto Serif', serif;
  font-size: 2.2rem;
  color: #061b0e;
  font-weight: 300;
}

.stat-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #50606f;
  margin-top: 6px;
}
```

**Booking Summary Card:**
```css
.booking-summary {
  background: #f5f4e8;
  border-radius: 0.75rem;
  padding: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #50606f;
  margin-bottom: 6px;
}

.summary-divider {
  height: 1px;
  background: rgba(195, 200, 193, 0.3);
  margin: 10px 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  color: #061b0e;
}
```

### 6.6 Icon Usage

Icons use **Material Symbols Outlined** with thin stroke settings:

```css
.icon {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
  font-size: 22px;
}

.icon-filled {
  font-variation-settings: 'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
```

**Icon sizing rules:**
- Navigation icons: `22px`
- Feature card icons: `28px`
- Hero/decorative icons: `40px`
- Inline with text: `16px`

> **Rule:** Never use icons purely decoratively. Every icon must serve a clear navigational or informational purpose. Thin-stroke (wght 300) only — matches Serif elegance.

### 6.7 Icon Circles (Feature Cards)

```css
.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-circle-light { background: #ffffff; }
.icon-circle-dark  { background: rgba(255, 255, 255, 0.1); }
```

### 6.8 Bottom Navigation Bar

```css
nav.bottom-nav {
  width: 100%;
  background: #ffffff;
  border-top: 1px solid rgba(195, 200, 193, 0.15);
  box-shadow: 0 -4px 24px rgba(27, 48, 34, 0.06);
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px 16px 20px;
  position: fixed;
  bottom: 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 0.75rem;
  cursor: pointer;
}

.nav-item.active { background: #f5f4e8; }

.nav-item-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
```

**Bottom Nav Items (in order):**
1. Home (`home` icon)
2. Search (`search` icon)
3. Bookings (`bed` icon)
4. Loyalty (`stars` icon)
5. Profile (`person` icon)

### 6.9 Floating Action Button (WhatsApp)

```css
.fab-whatsapp {
  position: fixed;
  right: 24px;
  bottom: 90px; /* above bottom nav */
  z-index: 40;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #25D366;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(27, 48, 34, 0.2);
  transition: transform 200ms ease-out;
}

.fab-whatsapp:hover { transform: scale(1.1); }
```

### 6.10 Loyalty Tier Cards

```css
/* Silver */
.tier-silver {
  background: #f5f4e8;
  border-radius: 0.75rem;
  padding: 24px;
  color: #061b0e;
}

/* Gold */
.tier-gold {
  background: #1b3022;
  border-radius: 0.75rem;
  padding: 24px;
  color: #ffffff;
}

/* Platinum */
.tier-platinum {
  background: #281100;
  border-radius: 0.75rem;
  padding: 24px;
  color: #ffffff;
}

.tier-name {
  font-family: 'Noto Serif', serif;
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 6px;
}

.tier-benefit {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
```

---

## 7. Page-by-Page Guidelines

### 7.1 Homepage

| Section | Background | Notes |
|---------|-----------|-------|
| Glass Nav | `#fbfaee` at 82% + blur | Sticky, frosted |
| Hero | Full-bleed image + gradient overlay | Mountain illustration or photo |
| Chips | `primary-fixed`, `secondary-fixed`, `tertiary-fixed` | Max 3 chips |
| Search Card | `#ffffff` on hero | Floating over gradient |
| Stats Row | `#f5f4e8` | 3 cols: rooms, rating, price |
| Bento Features | `#f5f4e8`, `#e9e9dd`, `#1b3022` | Asymmetric 2-col grid |
| Heritage Scroller | `transparent` | Bleeds left edge, no right padding |
| Loyalty Tiers | `#f5f4e8`, `#1b3022`, `#281100` | 3-col grid |
| Footer | `#dbdbcf` (surface-dim) | Earthy, grounding |

### 7.2 Room Detail Page

- Full-bleed hero image (no overlay — let the room speak)
- Chips for room features (Mountain View, King Bed, etc.)
- Price in `display-md` Noto Serif
- Amenities list: no dividers, use `1.4rem` vertical spacing
- Booking panel: white card `surface-container-lowest` on `surface-container-low` bg

### 7.3 Booking Form Page

- Split layout: form left, summary card right
- All inputs use filled style (`surface-container-low` background)
- Focus state: only bottom border appears in `primary`
- No progress bar — use a simple overline ("Step 1 of 3")
- Payment section: slightly elevated white card

### 7.4 Admin Dashboard

- Sidebar: `primary` (#061b0e) background
- Sidebar text: `on-primary` (#ffffff) and `on-primary-container` (#819986)
- Metric cards: `surface-container-low` with Noto Serif stat values
- Tables: NO horizontal dividers — use alternating row bg (`surface` / `surface-container-low`)
- Charts: use `primary-fixed-dim` (#b4cdb8) and `secondary-fixed-dim` (#b8c8da)

### 7.5 Loyalty Dashboard

- Hero strip: `primary-container` (#1b3022) background
- Points balance: `display-md` Noto Serif, white
- Tier badge: pill chip with tier color
- Progress bar: `primary-fixed` fill on `surface-container-high` track
- Transaction history: no dividers, `1.4rem` spacing between items

### 7.6 Contact Page

- Split layout: form left, info cards right
- Info cards: `surface-container-low` background, icon circles
- Map placeholder: `surface-container-high` with rounded corners
- No explicit borders anywhere

---

## 8. Motion & Animation

### 8.1 Transition Defaults

```css
/* Standard interaction */
transition: all 200ms ease-out;

/* Image hover zoom */
transition: transform 500ms ease;

/* Page transitions */
transition: opacity 300ms ease, transform 300ms ease;
```

### 8.2 Hover States

| Element | Hover Effect |
|---------|-------------|
| Primary button | `primary-container` bg + `translateY(-2px)` |
| Secondary button | `surface-container-low` bg |
| Room card image | `scale(1.05)` |
| Nav link | `opacity: 0.7` |
| Scroll arrow button | `surface-container` bg |
| WhatsApp FAB | `scale(1.1)` |
| Icon only | `opacity: 0.7` |

### 8.3 Scroll Behavior

```css
html { scroll-behavior: smooth; }

/* Heritage scroller — hide scrollbar */
.scroller { scrollbar-width: none; }
.scroller::-webkit-scrollbar { display: none; }
```

---

## 9. Imagery Guidelines

### 9.1 Photography Style

- **Hero:** Cinematic wide shots — misty mountain ridges, dawn light, soft ethereal atmosphere
- **Room cards:** Warm interior light, wood textures, mountain views through windows
- **Feature sections:** Abstract nature textures — mist, water, stone

### 9.2 Image Treatment

```css
/* All images use object-fit cover */
img { width: 100%; height: 100%; object-fit: cover; }

/* Room cards — hover zoom */
.room-img:hover { transform: scale(1.05); transition: transform 500ms ease; }

/* Text overlay on images — gradient, not solid color */
.img-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%);
}
```

### 9.3 Aspect Ratios

| Context | Ratio |
|---------|-------|
| Hero | 16:9 or full viewport height |
| Room card (scroller) | ~280×340px (portrait) |
| Room detail hero | 3:2 |
| About / gallery | 4:3 |
| Admin thumbnails | 1:1 |

---

## 10. Do's and Don'ts

### Do ✅

- Use asymmetrical layouts — main text at col 3, image bleeding to col 12
- Use `surface-dim` (#dbdbcf) for footer to "ground" the page
- Double the spacing token when a section feels crowded
- Use Noto Serif italic for hero subtitles — feels editorial and luxurious
- Use overlines (10px uppercase, 0.2em tracking) before every section title
- Use thin-stroke Material Icons (wght 300) throughout
- Use `primary-container` (#1b3022) for dark CTA hover states
- Separate list items with `1.4rem` whitespace — no dividers ever
- Use `surface-container-lowest` (#ffffff) cards on `surface-container-low` (#f5f4e8) backgrounds for natural lift

### Don't ❌

- Never use pure black `#000000` — use `#061b0e` (Deep Forest) for all dark text
- Never use 1px borders for containment — color shifts only
- Never use high-opacity drop shadows — ambient only, 6% opacity max
- Never use icons without clear purpose
- Never use font weights 600 or 700 for body text
- Never use more than 3 chips in a hero section
- Never center-align body text — left-align only
- Never use more than 2 font families on any single page
- Never use colored backgrounds on the outer page container

---

## 11. Tailwind Config Reference

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        "primary":                    "#061b0e",
        "primary-container":          "#1b3022",
        "primary-fixed":              "#d0e9d4",
        "primary-fixed-dim":          "#b4cdb8",
        "on-primary":                 "#ffffff",
        "on-primary-container":       "#819986",
        "on-primary-fixed":           "#0b2013",
        "secondary":                  "#50606f",
        "secondary-fixed":            "#d4e4f6",
        "secondary-fixed-dim":        "#b8c8da",
        "on-secondary":               "#ffffff",
        "on-secondary-fixed":         "#0d1d2a",
        "tertiary":                   "#281100",
        "tertiary-container":         "#42240b",
        "tertiary-fixed":             "#ffdcc4",
        "tertiary-fixed-dim":         "#efbc98",
        "on-tertiary":                "#ffffff",
        "on-tertiary-fixed":          "#2f1501",
        "surface":                    "#fbfaee",
        "surface-dim":                "#dbdbcf",
        "surface-bright":             "#fbfaee",
        "surface-container-lowest":   "#ffffff",
        "surface-container-low":      "#f5f4e8",
        "surface-container":          "#efeee3",
        "surface-container-high":     "#e9e9dd",
        "surface-container-highest":  "#e4e3d7",
        "on-surface":                 "#1b1c15",
        "on-surface-variant":         "#434843",
        "outline-variant":            "#c3c8c1",
        "outline":                    "#737973",
        "background":                 "#fbfaee",
        "on-background":              "#1b1c15",
        "error":                      "#ba1a1a",
        "error-container":            "#ffdad6",
      },
      fontFamily: {
        "headline": ["Noto Serif", "serif"],
        "body":     ["Inter", "sans-serif"],
        "label":    ["Inter", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "md":      "0.5rem",
        "lg":      "0.75rem",
        "xl":      "1rem",
        "full":    "9999px",
      },
    },
  },
}
```

---

## 12. CSS Custom Properties (Non-Tailwind Projects)

```css
:root {
  /* Core */
  --primary:                  #061b0e;
  --primary-container:        #1b3022;
  --primary-fixed:            #d0e9d4;
  --secondary:                #50606f;
  --tertiary:                 #281100;
  --background:               #fbfaee;

  /* Surfaces */
  --surface:                  #fbfaee;
  --surface-dim:              #dbdbcf;
  --surface-container-lowest: #ffffff;
  --surface-container-low:    #f5f4e8;
  --surface-container:        #efeee3;
  --surface-container-high:   #e9e9dd;
  --surface-container-highest:#e4e3d7;

  /* Text */
  --on-surface:               #1b1c15;
  --on-surface-variant:       #434843;
  --on-primary:               #ffffff;
  --on-secondary:             #ffffff;

  /* Borders */
  --outline:                  #737973;
  --outline-variant:          #c3c8c1;

  /* Typography */
  --font-serif:               'Noto Serif', serif;
  --font-sans:                'Inter', sans-serif;

  /* Radius */
  --radius-sm:   0.25rem;
  --radius-md:   0.5rem;
  --radius-lg:   0.75rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-ambient: 0 0 48px rgba(27, 28, 21, 0.06);
  --shadow-float:   0 8px 32px rgba(27, 48, 34, 0.2);
}
```

---

*Grand Haven Hotel UI Design Documentation v1.0 — Antigravity Workflow*