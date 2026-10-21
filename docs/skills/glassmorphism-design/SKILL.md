---
name: glassmorphism-design
description: Design and build websites and web apps using the Glassmorphism UI style — frosted glass panels, translucent layers, vibrant gradient backgrounds, and soft blur effects. Use this skill whenever the user asks to design, build, create, style, or redesign anything in a Glassmorphism style, even if phrased casually like "make it look like frosted glass", "give it that glass UI look", "Apple-style blurry panels", "Liquid Glass aesthetic", or "I want a Glassmorphism website/app/component/dashboard". Always use this skill before writing any Glassmorphism-related code or design — do NOT attempt it from memory alone.
---

# Glassmorphism Design Skill

---

## Core Philosophy — Read First

**Glass is a window, not a filter.**

The single biggest mistake in AI-generated Glassmorphism: treating the glass panel as a design element with its own color — giving it amber tints, colored glowing borders, accent halos. That is not glass. Real glass has almost no inherent color. Its color comes entirely from what sits behind it, blurred and brightened through the panel.

- A context menu over a dark mountain photo looks dark gray-blue — because the mountain is dark gray-blue
- A card over a purple gradient looks lavender — because the background is purple
- The design lives in the background. The glass reveals it, softly.

**Therefore:** Glass fills are always `rgba(255,255,255,N)` — white with low opacity. Never colored fills. Never glowing colored borders as a primary aesthetic. Never pulsing accent halos — that is an AI template tell. Make the background rich and colorful; it does the design work.

---

## Icon & Decoration Rules — No Exceptions

- **No emoji.** Use real inline SVG icons only.
- **No icon boxes.** No background circle, border container, or card wrapper around an icon. Icons sit directly inline with text as raw SVG.
- Icon style: line/stroke, not filled. Stroke width 1.5–2px. Color matches surrounding text.
- Icon size: 20–24px UI icons, 16px inline.

---

## Step 1: Ask the User (Single Message)

Tell them to skip anything and defaults will apply.

**1. Color Palette** — what sits behind the glass determines everything:
- **Ember & Slate** *(default)* — near-black charcoal base, amber + sienna blobs. Warm, editorial. Glass looks smoky.
- **Ocean Frost** — deep navy, electric teal + cyan blobs. Cold, technical. Glass looks icy.
- **Soft Bloom** — dark plum, violet + rose blobs. Rich, emotive. Glass looks lavender.
- **Warm Sunset** — deep burgundy, orange + magenta blobs. Vivid. Glass looks amber-rose.
- **Emerald Mist** — near-black, jade + gold blobs. Luxury. Glass looks mossy.
- **Liquid Glass / Light** — warm beige base, pastel blobs. Apple-style. Glass is nearly clear. Dark text.
- **Custom** — user provides hex colors.

**2. Glass Transparency:**
- Sheer — almost transparent, background clearly visible
- Frosted *(default)* — classic; background readable as color/shape, detail lost
- Heavy — mostly opaque; dramatic, very readable

**3. Mode:** Dark *(default)* / Light (Apple Liquid Glass style) / Both

**4. Background:** Animated blobs *(default)* / Static mesh gradient / Image URL / Animated gradient shift

**5. Typography:** Modern Geometric *(default)* / Editorial / Rounded / Minimal Sharp

**6. Animation:** Subtle *(default)* / Expressive / None

---

## Step 2: Defaults

| Decision | Default |
|----------|---------|
| Palette | Ember & Slate |
| Transparency | Frosted |
| Mode | Dark |
| Background | Animated blobs |
| Typography | Outfit + DM Sans |
| Animations | Subtle |

---

## Step 3: The Glass Formula

### Dark Mode
```css
.glass {
  background: rgba(255, 255, 255, 0.08);           /* white-neutral — never colored */
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 1px 0 0 rgba(255, 255, 255, 0.20) inset,    /* specular top edge — Apple signature */
    0 12px 40px rgba(0, 0, 0, 0.35);
  border-radius: 20px;
}
```

### Light Mode / Liquid Glass
```css
.glass-liquid {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.60);
  box-shadow:
    0 2px 0 0 rgba(255, 255, 255, 0.80) inset,    /* bright top edge — thicker glass feel */
    0 -1px 0 0 rgba(0, 0, 0, 0.06) inset,
    0 8px 32px rgba(0, 0, 0, 0.12);
  border-radius: 20px;
}
```

### Transparency Scale

| Level | fill opacity | blur | saturate | border opacity |
|-------|-------------|------|----------|----------------|
| Sheer | 0.04–0.06 | 24px | 200% | 0.08 |
| Frosted | 0.08–0.12 | 20px | 180% | 0.12 |
| Heavy | 0.18–0.28 | 14px | 160% | 0.20 |

---

## Step 4: CSS Token System

```css
/* DARK MODE (Ember & Slate default) */
:root {
  --bg-primary: #100d0a;
  --bg-secondary: #1c1510;

  --glass-bg: rgba(255, 255, 255, 0.08);
  --glass-bg-hover: rgba(255, 255, 255, 0.13);
  --glass-border: rgba(255, 255, 255, 0.12);
  --glass-border-hover: rgba(255, 255, 255, 0.22);
  --glass-blur: blur(20px) saturate(180%);
  --glass-specular: 0 1px 0 0 rgba(255, 255, 255, 0.20) inset;
  --glass-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
  --glass-shadow-hover: 0 20px 60px rgba(0, 0, 0, 0.50);

  --accent-primary: #f59e0b;
  --accent-secondary: #c2410c;
  --blob-1: #f59e0b;
  --blob-2: #c2410c;
  --blob-3: #78350f;

  --text-primary: rgba(255, 248, 240, 0.95);
  --text-secondary: rgba(255, 235, 210, 0.60);
  --text-muted: rgba(255, 220, 180, 0.35);

  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  --radius-pill: 999px;
}

/* LIGHT MODE — swap these in */
/* --bg-primary: #f0ebe3; --glass-bg: rgba(255,255,255,0.45);
   --glass-border: rgba(255,255,255,0.65); --glass-specular: 0 2px 0 rgba(255,255,255,0.80) inset;
   --text-primary: rgba(20,16,12,0.90); --text-secondary: rgba(20,16,12,0.55);
   --blob-1: #a78bfa; --blob-2: #5eead4; --blob-3: #fb923c; */
```

---

## Step 5: Component Patterns

### Glass Card
```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--glass-specular), var(--glass-shadow);
  padding: 2rem;
  position: relative;
  overflow: hidden;
  transition: background .25s ease, border-color .25s ease,
              box-shadow .25s ease, transform .25s cubic-bezier(.34,1.56,.64,1);
  will-change: transform;
}
.glass-card:hover {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
  box-shadow: var(--glass-specular), var(--glass-shadow-hover);
  transform: translateY(-4px);
}
```

### Specular Gradient Border (Premium cards)
```css
.glass-card-premium { border: none; }
.glass-card-premium::before {
  content: ''; position: absolute; inset: 0;
  border-radius: inherit; padding: 1px;
  background: linear-gradient(135deg,
    rgba(255,255,255,0.30) 0%,
    rgba(255,255,255,0.08) 40%,
    rgba(255,255,255,0) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out; mask-composite: exclude;
  pointer-events: none;
}
```

### Buttons — Solid primary, glass secondary
```css
/* Primary CTA — solid, not glass */
.btn-primary {
  background: var(--accent-primary); color: #fff; border: none;
  border-radius: var(--radius-pill); padding: .8rem 2rem;
  font-weight: 600; cursor: pointer;
  box-shadow: 0 4px 20px rgba(0,0,0,0.25);
  transition: transform .18s cubic-bezier(.34,1.56,.64,1), filter .18s ease, box-shadow .18s ease;
}
.btn-primary:hover { transform: translateY(-2px); filter: brightness(1.1); }
.btn-primary:active { transform: translateY(1px) scale(.97); transition-duration: .08s; }

/* Secondary — glass pill */
.btn-glass {
  background: var(--glass-bg);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border); border-radius: var(--radius-pill);
  padding: .75rem 1.75rem; color: var(--text-primary); font-weight: 500; cursor: pointer;
  box-shadow: var(--glass-specular);
  transition: background .2s ease, border-color .2s ease,
              transform .18s cubic-bezier(.34,1.56,.64,1);
}
.btn-glass:hover { background: var(--glass-bg-hover); border-color: var(--glass-border-hover); transform: translateY(-2px); }
.btn-glass:active { transform: translateY(1px) scale(.97); transition-duration: .08s; }
```

### Navigation Bar
```css
.glass-nav {
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset;
  position: sticky; top: 0; z-index: 100; padding: 1rem 2rem;
}
```

### Context Menu / Dropdown
```css
.glass-menu {
  background: rgba(255,255,255,0.10);
  backdrop-filter: blur(28px) saturate(200%); -webkit-backdrop-filter: blur(28px) saturate(200%);
  border: 1px solid rgba(255,255,255,0.14); border-radius: var(--radius-lg);
  box-shadow: 0 1px 0 rgba(255,255,255,0.18) inset, 0 20px 60px rgba(0,0,0,0.40);
  overflow: hidden; min-width: 220px;
}
.glass-menu-item {
  display: flex; align-items: center; gap: .875rem;
  padding: .85rem 1.25rem; color: var(--text-primary); cursor: pointer;
  transition: background .15s ease;
}
.glass-menu-item:hover { background: rgba(255,255,255,0.08); }
.glass-menu-item svg { width: 20px; height: 20px; stroke: currentColor; stroke-width: 1.5; fill: none; }
.glass-menu-divider { height: 1px; background: rgba(255,255,255,0.10); }
```

### Input
```css
.glass-input {
  background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.12); border-radius: var(--radius-pill);
  color: var(--text-primary); padding: .75rem 1.25rem; outline: none;
  transition: background .2s, border-color .2s, box-shadow .2s;
}
.glass-input::placeholder { color: var(--text-muted); }
.glass-input:focus {
  background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.30);
  box-shadow: 0 0 0 3px rgba(255,255,255,0.06), var(--glass-specular);
}
```

### Animated Blob Background
```css
.bg-scene { position: fixed; inset: 0; background: var(--bg-primary); overflow: hidden; z-index: 0; }
.blob {
  position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.55;
  animation: blob-float 10s ease-in-out infinite; will-change: transform;
}
.blob-1 { width: 650px; height: 650px; background: var(--blob-1); top: -180px; left: -180px; }
.blob-2 { width: 450px; height: 450px; background: var(--blob-2); bottom: -120px; right: -120px; animation-delay: -4s; }
.blob-3 { width: 350px; height: 350px; background: var(--blob-3); top: 45%; left: 45%; animation-delay: -7s; }
@keyframes blob-float {
  0%,100% { transform: translate(0,0) scale(1); }
  33%      { transform: translate(40px,-40px) scale(1.06); }
  66%      { transform: translate(-25px,25px) scale(.95); }
}
```

---

## Step 6: Micro-Animations

**Rules:** Animate `transform` and `opacity` only — never `backdrop-filter`, layout properties, or dimensions. Use `cubic-bezier(.34,1.56,.64,1)` for spring feel on lifts/reveals. Always include `prefers-reduced-motion` fallback.

### Scroll Reveal (blur-in from below)
```css
.reveal { opacity: 0; transform: translateY(24px); filter: blur(8px);
  transition: opacity .7s cubic-bezier(.34,1.56,.64,1), transform .7s cubic-bezier(.34,1.56,.64,1), filter .6s ease; }
.reveal.visible { opacity: 1; transform: none; filter: none; }
.reveal:nth-child(2) { transition-delay: .08s; }
.reveal:nth-child(3) { transition-delay: .16s; }
.reveal:nth-child(4) { transition-delay: .24s; }
```
```js
const io = new IntersectionObserver(entries => entries.forEach(el => {
  if (el.isIntersecting) { el.target.classList.add('visible'); io.unobserve(el.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
```

### Shimmer Sweep (light ray on hover)
```css
.glass-card::after {
  content: ''; position: absolute; top: 0; left: 0; width: 50%; height: 100%; z-index: 1; pointer-events: none;
  background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,.07) 50%, rgba(255,255,255,0) 100%);
  transform: skewX(-18deg) translateX(-200%); transition: transform .65s ease;
}
.glass-card:hover::after { transform: skewX(-18deg) translateX(500%); }
```

### 3D Tilt on Mouse Move (Expressive — max 3 cards per page)
```js
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(900px) rotateX(${y*-9}deg) rotateY(${x*9}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
    card.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
    setTimeout(() => card.style.transition = '', 500);
  });
});
```

### Skeleton Loader
```css
.skeleton { background: var(--glass-bg); border-radius: var(--radius-md); position: relative; overflow: hidden; }
.skeleton::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(100deg, rgba(255,255,255,0) 20%, rgba(255,255,255,.07) 50%, rgba(255,255,255,0) 80%);
  background-size: 200% 100%; animation: skeleton-sweep 1.8s linear infinite;
}
@keyframes skeleton-sweep { from { background-position: 200% 0; } to { background-position: -200% 0; } }
```

### Reduced-Motion Fallback (Required)
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  .reveal { opacity: 1; transform: none; filter: none; }
  .blob { animation: none; }
}
```

### Animation Decision Map

| Element | Subtle (default) | Expressive only |
|---------|-----------------|-----------------|
| Cards | Hover lift + shimmer sweep | 3D tilt |
| Buttons | Press feedback | — |
| Inputs | Focus glow | — |
| Sections | Scroll reveal | — |
| Background | Blob float | — |
| Loading | Skeleton shimmer | — |

---

## Step 7: Palette & Typography Reference

### Color Palettes

| Palette | BG Base | Blob Colors | Mode |
|---------|---------|-------------|------|
| Ember & Slate | `#100d0a` | `#f59e0b` / `#c2410c` / `#78350f` | Dark |
| Ocean Frost | `#030d1a` | `#06b6d4` / `#0ea5e9` / `#6366f1` | Dark |
| Soft Bloom | `#1a0e1c` | `#c084fc` / `#f472b6` / `#818cf8` | Dark |
| Warm Sunset | `#1a0a0a` | `#f97316` / `#ec4899` / `#f59e0b` | Dark |
| Emerald Mist | `#051a0a` | `#10b981` / `#d4af37` / `#065f46` | Dark |
| Liquid Glass | `#f0ebe3` | `#a78bfa` / `#5eead4` / `#fb923c` | Light |

Glass tint is always white-neutral across all palettes. Blob colors define the mood through the glass.

### Typography

| Style | Heading | Body | Google Fonts import |
|-------|---------|------|---------------------|
| Modern Geometric | Outfit 700/800 | DM Sans 400/500 | `Outfit:wght@700;800&family=DM+Sans:wght@400;500` |
| Editorial | Playfair Display 700 | Inter 300/400 | `Playfair+Display:wght@700&family=Inter:wght@300;400` |
| Rounded | Nunito 700/800 | Poppins 400 | `Nunito:wght@700;800&family=Poppins:wght@400` |
| Minimal Sharp | Barlow Condensed 700 | Barlow 400 | `Barlow+Condensed:wght@700&family=Barlow:wght@400` |

```css
h1 { font-size: clamp(2.5rem,5vw,4.5rem); font-weight: 800; letter-spacing: -0.02em; }
h2 { font-size: clamp(1.8rem,3vw,3rem); font-weight: 700; letter-spacing: -0.01em; }
p  { font-size: 1rem; line-height: 1.75; color: var(--text-secondary); }
```

---

## Step 8: Accessibility & Output Standards

### Accessibility
```css
@supports not (backdrop-filter: blur(1px)) {
  .glass-card, .glass-nav, .glass-menu, .btn-glass { background: rgba(20,16,12,0.90); }
}
@media (prefers-reduced-transparency: reduce) {
  .glass-card, .glass-nav, .glass-menu, .btn-glass { background: rgba(20,16,12,0.94); backdrop-filter: none; }
}
```
Always verify text contrast against the blurred background — WCAG AA minimum (≥ 4.5:1 for normal text).

### Output Standards
- Complete, runnable code only. No stubs.
- Single-file HTML unless framework specified. Embed all CSS, JS, and inline SVG.
- No emoji. No icon containers. SVG paths directly in markup.
- Responsive by default — CSS Grid/Flexbox, `clamp()` for type.
- Animated blob background included by default.
- Micro-animations included by default — minimum: scroll reveal, hover lift, shimmer sweep, button press.
- CSS variables throughout — no hardcoded values outside `:root`.
- No pulsing glow as a default — it is an AI-template tell. Reserve for explicit Expressive requests, one element maximum.
