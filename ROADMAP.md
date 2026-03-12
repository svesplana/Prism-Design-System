# Prism Design System — Roadmap

## Next Session Priorities

### 1. Interactive Components (JS)
- [ ] Accordion — click to expand/collapse with animation
- [ ] Tabs — functional tab switching on components page
- [ ] Carousel — working prev/next with dot indicators
- [ ] Dropdown — click to open/close menu
- [ ] Modal — trigger button that opens/closes overlay
- [ ] Toast — auto-dismiss after 4s with close button

### 2. Search
- [ ] Full-text search across all pages
- [ ] Keyboard shortcut (⌘K) opens search modal
- [ ] Results show component name + page link

### 3. Component Code Snippets
- [ ] Add copy-paste HTML/CSS block under each component preview
- [ ] Syntax highlighted code tabs (HTML / CSS / Tokens)

### 4. New Pages
- [ ] `dark-mode.html` — dark mode token reference + toggle demo
- [ ] `accessibility.html` — contrast ratios, aria labels, keyboard nav guide
- [ ] `patterns.html` — common layout patterns (login form, dashboard shell, empty states)

### 5. Site Polish
- [ ] Mobile sidebar toggle (hamburger button in sidebar header now that topbar is gone)
- [ ] Sticky TOC active highlight improvement
- [ ] Smooth page transitions
- [ ] 404 page

### 6. Figma Plugin Improvements
- [ ] Add more components (Stepper, Date Picker, Tag Input)
- [ ] Swap "by Vlad" text into the Figma plugin UI as well
- [ ] Publish plugin publicly on Figma Community

### 7. GitHub Pages
- [ ] Confirm site is live at https://svesplana.github.io/Prism-Design-System/
- [ ] Add custom domain if needed
- [ ] Set up GitHub Pages from `static-website` branch (Settings → Pages)

---

## Current Branch Structure
| Branch | Purpose |
|--------|---------|
| `main` | Figma plugin source (code.js, ui.html, manifest.json) |
| `static-website` | Documentation site (HTML/CSS/JS) — deploys to GitHub Pages |

## File Structure (static-website branch)
```
/
├── index.html          — Homepage
├── get-started.html    — Designer + Developer setup guides
├── foundations.html    — Color, type, spacing, motion tokens
├── components.html     — 25+ component previews
├── resources.html      — Downloads, token JSON, icons, fonts
├── css/styles.css      — All styles
├── js/main.js          — Navigation, tabs, copy buttons, search
├── .nojekyll           — Disables Jekyll on GitHub Pages
└── ROADMAP.md          — This file
```

## Notes
- All icons are Lucide (MIT license) — no paid icon libraries
- Fonts: Inter (default) → swap to General Sans for full Meridian brand
- No build tools or dependencies — pure HTML/CSS/JS
- "by Vlad" branding is set in index.html title, code.js (x2), and navbar component in Figma
