
---

#### 1. Palette – core colors

| Token | HEX | Intended use |
|-------|------|-------------|
| `duo‑green` | #58CC02 | Primary CTAs, headers |
| `duo‑green‑light` | #89E219 | Hover / pressed states |
| `duo‑blue` | #1CB0F6 | Secondary actions, links |
| `duo‑red` | #FF4B4B | Errors / negative feedback |
| `duo‑yellow` | #FFC800 | Celebrations (confetti, highlights) |
| Greys | #4B4B4B / #F0F0F0 | Text & surfaces |

```js
// tailwind.config.js  (extend)
colors: {
  duo: {
    green:  '#58cc02',
    greenL: '#89e219',
    blue:   '#1cb0f6',
    red:    '#ff4b4b',
    yellow: '#ffc800',
    grayD:  '#4b4b4b',
    grayL:  '#f0f0f0',
  }
}
```

---

#### 2. Typography

| Role | Font (face) | Free fallback |
|------|-------------|---------------|
| Display / h1‑h2 | **Feather Bold** | `Baloo 2 800` |
| Body / UI | DIN Next Rounded | `Nunito Sans 400/600` |

```js
fontFamily: {
  display: ['"Baloo 2"', 'ui-rounded', 'sans-serif'],
  body:    ['"Nunito Sans"', 'ui-sans-serif'],
}
```

*Tip :* keep line‑height ~1.05 on display text; use sentence case.

---

#### 3. Shape & Layout

* **Border radius** : `1rem` on cards / inputs, `9999px` on pills  
* **Shadow** : `0 2px 4px rgb(0 0 0 / 6%)`  
* **Spacing scale** : 16 px grid, multiples of 8 px

---

#### 4. Motion

* 200 ms ease‑out for hover & chip‑select  
* “Pop” animation on correct answer → `scale(1.05 → 1)` over 120 ms  
* Use Tailwind `transition` utilities or Framer Motion

---

#### 5. Icon Set (lucide‑react)

| Need | Icon |
|------|------|
| Replay audio | `Volume2` |
| Validate answer | `CheckCircle2` / `XCircle` |
| Next | `ArrowRight` |
| Hard‑mode toggle | `Flame` |

Set `strokeWidth={2.2}` for Duolingo‑style weight.

---

#### 6. Component mapping (shadcn → Duolingo)

| shadcn/ui | Tweaked class |
|-----------|---------------|
| `<Button>` | `rounded-full bg-duo-green text-white hover:bg-duo-greenL` |
| `<Badge>` / word pill | `rounded-full bg-white shadow px-3 py-1 text-duo-grayD` |
| `<Card>` | `rounded-2xl shadow bg-white p-6` |

---
