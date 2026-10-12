# CLAUDE.md — my-3d-portfolio

This repository is a personal portfolio built with Vite, React 19, JavaScript,
Three.js, React Three Fiber, Drei, and GSAP.

## Non-negotiable project rules

1. Use Vite + React 19 + JavaScript only. Do not add TypeScript, `.tsx`, or
   another bundler.
2. Put every Three.js, `@react-three/fiber`, or `@react-three/drei` component
   under `src/components/canvas/`.
3. Put flat HTML/CSS UI under `src/components/ui/`.
4. Keep all user-facing text in `src/data/content.js`. The current legacy data
   file is `src/data/portfolio.js` and should be migrated deliberately.
5. Keep colors and fonts in CSS variables in `src/index.css`.
6. Run `npm run lint && npm run build` after every implementation task and fix
   errors caused by that task before committing.
7. Clamp renderer DPR to the `[1, 2]` range. Never pass an unrestricted
   `window.devicePixelRatio`.
8. Provide a low-quality mobile fallback: fewer objects/particles, antialiasing
   disabled, DPR capped at 1, and a static fallback when WebGL is unavailable
   or reduced motion requires it.
9. Preserve reduced-motion support and keep heavy scene work lazy-loaded.
10. Commit each completed implementation step as a small, reviewable commit.

## Current architecture

- `src/App.jsx` renders navigation, a lazy persistent canvas, and flat sections.
- `src/components/canvas/PageScene.jsx` owns the fixed Canvas wrapper.
- `SceneController.jsx` owns scroll-driven object, camera, and fog updates.
- `ParticleField.jsx` and `SecondaryRing.jsx` are scene primitives.
- `src/components/ui/` contains the flat Nav, Hero, About, Skills, Projects,
  Timeline, Contact, and Footer components.
- `src/hooks/useScrollReveal.js` uses GSAP `fromTo` for fade-in-up reveals.
- `src/hooks/useScrollProgress.js` tracks active section and page progress.
- `src/data/portfolio.js` currently holds portfolio content; the target name is
  `src/data/content.js`.

## Performance guardrails

- Do not create geometries or materials inside `useFrame`.
- Memoize reusable buffers, geometries, materials, and observer configuration.
- Keep particle counts modest and reduce them on mobile or low-quality mode.
- Use `Suspense` around lazy or asynchronous scene resources.
- Pause or reduce rendering when the document is hidden where practical.

## Workflow

Read the relevant files before editing, make surgical changes, run the required
lint/build checks, and update [PROJECT-ROADMAP.md](./PROJECT-ROADMAP.md) after
each completed step.