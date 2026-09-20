# DESIGN_GUIDE.md — Orbyt

> Implementation-focused design spec. Source of truth for colors, typography, spacing, and component patterns.
> This project uses MUI v6 exclusively — no Tailwind, no shadcn/ui, no CSS modules.
> All layout is done via MUI Box, Grid (v2), Stack, Container.
> Synced from BRAIN.md § Visual Identity (Locked).

---

## Theme

**Theme name:** Orbit Dark  
**Mode:** dark (default, no toggle — ever)  
**Motion character:** High-motion, professional. Every animation must feel earned.

---

## Color Tokens

All tokens live in `lib/theme.ts` as part of the MUI `createTheme()` call.

### Base palette

| Token | Value | MUI path | Usage |
|---|---|---|---|
| `bg` | `#0a0a0a` | `palette.background.default` | Page background |
| `surface` | `#111111` | `palette.background.paper` | Cards, panels, inputs |
| `border` | `#1e1e1e` | `palette.divider` | Default borders |
| `text.primary` | `#f5f5f5` | `palette.text.primary` | Primary text |
| `text.secondary` | `#888888` | `palette.text.secondary` | Muted / secondary text |

### Phase accent colors (technology brand colors — intentional)

| Phase | Token | Value | Technology |
|---|---|---|---|
| Phase 1 HTML + CSS | `accent.phase1` | `#E44D26` | HTML orange |
| Phase 2 Vanilla JS | `accent.phase2` | `#F7DF1E` | JS yellow |
| Phase 3 React | `accent.phase3` | `#61DAFB` | React cyan |
| Phase 4 TypeScript | `accent.phase4` | `#3178C6` | TS blue |
| Phase 5 Next.js | `accent.phase5` | `#EDEDED` | Next.js near-white |
| Phase 6 SQL | `accent.phase6` | `#336791` | PostgreSQL blue |
| Phase 7 Drizzle ORM | `accent.phase7` | `#C5F74F` | Drizzle lime |
| Phase 8 Deployment | `accent.phase8` | `#FF4500` | Fireship red-orange |

Store phase colors as a lookup array in `lib/theme.ts`:
```ts
export const PHASE_COLORS = [
  '#E44D26', // Phase 1
  '#F7DF1E', // Phase 2
  '#61DAFB', // Phase 3
  '#3178C6', // Phase 4
  '#EDEDED', // Phase 5
  '#336791', // Phase 6
  '#C5F74F', // Phase 7
  '#FF4500', // Phase 8
];
```

### Progress bar gradient

| Range | Color | Hex |
|---|---|---|
| 0–40% | Amber | `#FFA000` |
| 41–79% | Orange | `#FF6D00` |
| 80–100% | Green | `#43A047` |

Progress bar color function:
```ts
export function progressColor(pct: number): string {
  if (pct >= 80) return '#43A047';
  if (pct >= 41) return '#FF6D00';
  return '#FFA000';
}
```

---

## Typography

Font: **Inter** loaded via `@fontsource/inter` in `app/layout.tsx`. No Google Fonts CDN.

| Variant | Size | Weight | Usage |
|---|---|---|---|
| h1 | 3.5rem | 800 | Hero headline |
| h2 | 2.25rem | 700 | Section headings |
| h3 | 1.5rem | 600 | Card titles, phase names |
| body1 | 1rem | 400 | Body copy |
| caption | 0.75rem | 400 | Labels, meta, timestamps |

MUI theme typography config:
```ts
typography: {
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  h1: { fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.03em' },
  h2: { fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.02em' },
  h3: { fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.01em' },
  body1: { fontSize: '1rem', fontWeight: 400 },
  caption: { fontSize: '0.75rem', fontWeight: 400 },
}
```

---

## Spacing Scale

MUI default 8px base. Use multiples:

| Token | Value | Usage |
|---|---|---|
| 0.5 | 4px | Tight inline gaps |
| 1 | 8px | Compact padding |
| 2 | 16px | Standard padding |
| 3 | 24px | Section padding |
| 4 | 32px | Card padding, section gap |
| 6 | 48px | Large section spacing |
| 8 | 64px | Page-level vertical rhythm |

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `xs` | 6px | Chips, badges, small tags |
| `sm` | 8px | Inputs, small buttons |
| `md` | 10px | Cards, panels |
| `lg` | 14px | Modal dialogs |

MUI theme shape:
```ts
shape: { borderRadius: 10 } // card default; override per component as needed
```

---

## Shadow Tokens

No box-shadow by default. Glow effects are produced via `box-shadow` with phase accent colors at low opacity. Example for IN PROGRESS card glow:
```ts
boxShadow: `0 0 0 1px ${phaseColor}, 0 0 20px ${phaseColor}22`
```
Standard surface elevation uses only border (`1px solid #1e1e1e`), not MUI elevation shadows.

MUI theme override:
```ts
shadows: Array(25).fill('none') as any // no elevation shadows on any component
```

---

## Component Patterns

### Phase Card

```
MUI Card
  border: 1px solid #1e1e1e
  background: #111111
  border-radius: 10px
  padding: 24px

  Header row (Stack direction="row" justifyContent="space-between"):
    Typography h3 — phase name
    StatusBadge chip

  Channel row:
    Typography caption color="text.secondary" — "by [channel_name]"

  Progress section:
    Stack direction="row" justifyContent="space-between":
      Typography caption — "X of Y topics"
      Typography caption — "N%"
    ProgressBar (custom, Framer Motion animated width)

  Hover state:
    border-color: phaseColor
    box-shadow: glow (see shadow tokens)

  IN PROGRESS state:
    border-color: phaseColor (always visible, not just on hover)
    glow: persistent
```

### Status Badge

```
MUI Chip
  size: small
  variant: outlined

  NOT STARTED → color: #888888, border: #888888
  IN PROGRESS  → color: phaseColor, border: phaseColor
  COMPLETED    → color: #43A047, border: #43A047
```

### Topic Checkbox

```
Custom MUI ButtonBase or Box (not MUI Checkbox — needs SVG animation)
  SVG checkmark: pathLength 0 → 1 on complete (Framer Motion)
  Label text: strikethrough width 0 → 100% on complete
  Background flash: phaseColor at 10% opacity, fades to transparent
  State: completed = strikethrough + muted color
```

### Progress Bar

```
Box (outer) — background: #1e1e1e, border-radius: 100px, height: 6px
  motion.div (inner) — initial width: 0, animate to pct%, duration: 0.8s, cubic-bezier(0.16, 1, 0.3, 1)
  background: progressColor(pct)
```

### Chip (Resource Link)

```
MUI Chip
  icon: ExternalLink (lucide-react, 14px)
  variant: outlined
  size: small
  border-color: #1e1e1e
  hover: border-color: #888888
```

### Button Variants

```
Primary action (CTA):
  MUI Button variant="contained"
  background: #f5f5f5, color: #0a0a0a
  hover: background: #e0e0e0

Secondary:
  MUI Button variant="outlined"
  border: #1e1e1e, color: #f5f5f5
  hover: border: #888888, background: rgba(255,255,255,0.04)

Danger:
  MUI Button variant="outlined" color="error"
  border: #E53935 at 40% opacity
  hover: border: #E53935, background: rgba(229,57,53,0.08)
```

All interactive elements (buttons, chips, checkboxes, cards) must handle 5 states:
**default / hover / active / focus / disabled**

---

## Animation Defaults

### Page transitions (AnimatePresence in root layout)
```ts
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
exit:    { opacity: 0, y: -20 }
transition: { duration: 0.4, ease: 'easeOut' }
```

### Phase cards (stagger)
```ts
container: staggerChildren: 0.06
card: { hover: { scale: 1.02 }, tap: { scale: 0.98 } }
```

### Progress bar (mount)
```ts
initial: { width: '0%' }
animate: { width: `${pct}%` }
transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
```

### Topic checkbox completion
```ts
svg pathLength: 0 → 1 (duration: 0.35s)
label text strikethrough: width '0%' → '100%' (duration: 0.3s, delay: 0.1s)
background: brief flash at phaseColor 10% opacity → transparent (duration: 0.4s)
```

### Topic list (AnimatePresence)
```ts
add:    { initial: { opacity: 0, height: 0, y: -10 }, animate: { opacity: 1, height: 'auto', y: 0 } }
delete: { exit: { opacity: 0, height: 0, y: 10 } }
```

### Settings tabs
```ts
AnimatePresence mode="wait"
tab content: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
transition: { duration: 0.2 }
```

### Globe canvas
```ts
// Framer Motion only handles the canvas opacity fade on mount
canvas: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1.2 } }
// Globe Y-axis rotation: native Three.js requestAnimationFrame — 0.0008 radians per frame
```

---

## Three.js Globe Spec

Component: `components/globe/GlobeCanvas.tsx` — `"use client"` + dynamic import `ssr: false`

```
SphereGeometry: radius 6, widthSegments 24, heightSegments 18
WireframeGeometry wrapping the sphere
LineSegments + LineDashedMaterial
  color: rgba(255,255,255,0.15) → hex #ffffff, opacity 0.15
  dashSize: 0.08, gapSize: 0.04
  linewidth: 1
Globe center Y position: -6 (only top hemisphere visible above fold)
PerspectiveCamera: fov 60, looking slightly downward
Rotation: Y-axis auto-rotation 0.0008 radians per frame (requestAnimationFrame loop)
Canvas: position absolute, bottom 0, full width, height 70% of hero section
Hero section: overflow hidden (clips bottom half of globe naturally)
Cleanup: renderer.dispose() + cancelAnimationFrame on unmount
```

---

## MUI Theme Object Structure

All of the above compiles into `lib/theme.ts`:

```ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0a0a0a', paper: '#111111' },
    divider: '#1e1e1e',
    text: { primary: '#f5f5f5', secondary: '#888888' },
    primary: { main: '#f5f5f5' },   // default action color
    error: { main: '#E53935' },
    success: { main: '#43A047' },
    warning: { main: '#FF6D00' },
  },
  typography: { /* see Typography section */ },
  shape: { borderRadius: 10 },
  shadows: Array(25).fill('none') as any,
  components: {
    MuiCard: {
      styleOverrides: {
        root: { border: '1px solid #1e1e1e', backgroundImage: 'none' },
      },
    },
    MuiButton: { /* see Button Variants */ },
    MuiInputBase: {
      styleOverrides: {
        root: { backgroundColor: '#111111' },
      },
    },
  },
});
```

---

## Dark Mode Notes

- Dark-first, no light mode, no toggle, no `prefers-color-scheme` override
- `backgroundImage: 'none'` on MuiPaper — removes MUI's default dark-mode gradient overlay
- All custom surfaces use `background: #111111` — never `background: 'paper'` without verification
- Transparent backgrounds must use `transparent`, not `rgba(0,0,0,0)` which can cause MUI theming edge cases
