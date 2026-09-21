# CLAUDE.md — my-3d-portfolio

This repo is a personal portfolio website: **Vite + React 19 + JavaScript (no TypeScript)**, with a persistent full-viewport Three.js / @react-three/fiber / @react-three/drei background scene, GSAP scroll reveals, and Lenis smooth scroll.

## Project Structure

```
src/
├── main.jsx                 # React root (StrictMode)
├── App.jsx                  # Layout: Nav + lazy PageScene + sections + Footer
├── index.css                # Theme tokens (colors, fonts, resets)
├── App.css                  # All component/layout styles
├── data/
│   └── portfolio.js         # ALL text content, projects, skills, experience (rename target: content.js)
├── hooks/
│   ├── useScrollProgress.js # activeSection, scrollProgress, sectionProgress
│   └── useScrollReveal.js   # GSAP fade-in-up on scroll
└── components/
    ├── canvas/              # ALL 3D / WebGL components (PageScene, scenes, shaders, materials)
    │   └── PageScene.jsx    # Persistent full-viewport background canvas
    └── ui/                  # ALL flat HTML/CSS UI components (Nav, Hero, About, Skills, Projects, Timeline, Contact, Footer)
```

## Hard Rules

1. **Vite + React 19 + JavaScript only.** No TypeScript, no `.tsx`, no other bundlers. `type: "module"` is already set in `package.json`.
2. **3D components live in `src/components/canvas/`.** Any component that uses `@react-three/fiber`, `three`, or `@react-three/drei` must go under `src/components/canvas/`. The main export is `PageScene` — the persistent full-viewport background canvas behind all content.
3. **UI components live in `src/components/ui/`.** All flat HTML/CSS components (Nav, Hero, About, Skills, Projects, Timeline, Contact, Footer, buttons, cards, etc.) go under `src/components/ui/`.
4. **All text lives in `src/data/content.js`.** No hardcoded strings in components. Personal info, nav items, projects, skills, experience, contact copy, hero copy — everything is data. Components import from `src/data/content.js`.
5. **Colors and fonts are CSS variables** in `src/index.css` (the `:root` block). Never hardcode hex colors or font families in components or `App.css`. New colors/fonts get added there.
6. **Always run `npm run lint && npm run build` after each task and fix all errors.** Never commit with lint or build failures. ESLint is configured in `eslint.config.js`; the build output goes to `dist/`.
7. **Cap device pixel ratio at `[1, 2]`.** The `<Canvas>` `dpr` must be clamped: `dpr={Math.min(2, window.devicePixelRatio)}` and `gl.setPixelRatio(Math.min(2, window.devicePixelRatio))` in `onCreated`. Never pass a raw `window.devicePixelRatio` — it causes 3–4× render cost on retina displays.
8. **Provide a low-quality fallback for mobile.** On mobile (`window.innerWidth < 768` or a mobile UA), reduce the 3D scene: lower particle/orb counts, disable antialiasing, cap dpr at 1, and render a static CSS fallback (`.page-canvas-fallback`) when WebGL is unavailable or `prefers-reduced-motion` is set on desktop. The current `PageScene` already does this — preserve that behavior.

## Existing Conventions

- **Dark theme** (`--bg: #08080c`), monospace labels (`ui-monospace`), accent cyan `#00d9ff` and pink `#ff006e`.
- **Scroll-driven 3D:** `SceneController` in `src/components/canvas/PageScene.jsx` lerps object position/scale/color/fog between `SECTION_CONFIGS` based on `activeSection` + `scrollProgress` from `useScrollProgress()`.
- **Scroll reveals:** `useScrollReveal()` uses GSAP `fromTo` with `power3.out`. Always respect `prefers-reduced-motion`.
- **Lazy load the canvas:** `App.jsx` wraps `PageScene` in `<Suspense>` and `React.lazy()`.

## Performance Guardrails

- Memoize geometries (`useMemo`) — never create `BoxGeometry`/`SphereGeometry`/`TorusGeometry` inline in JSX.
- Cap `dpr` (see rule 7), disable `antialias` on mobile, and pause `frameloop` when the tab is hidden.
- Keep particle counts modest (≤ 800 desktop, ≤ 250 mobile).
- Avoid re-creating observer arrays / event listeners on every render or section change.

## Task Workflow

1. Read the relevant files first.
2. Make minimal, targeted edits following the structure rules above.
3. Run `npm run lint && npm run build` and fix every error before finishing.
4. If adding a new 3D component, put it in `src/components/canvas/` and import it from `PageScene.jsx`.