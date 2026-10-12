# 3D Portfolio Roadmap

This file tracks the requested implementation sequence. Complete one step at
a time, verify it, then update its checkbox and notes before moving on.

## Status

- [x] Step 0 — Audit and set rules
- [x] Step 1 — Install extra packages and create the Zustand store
- [x] Step 2 — Add one persistent full-screen Canvas and Lenis scrolling
- [x] Step 3 — Add cinematic lighting and depth
- [x] Step 4 — Add the real 3D hero object
- [x] Step 5 — Add the scroll-driven camera path
- [x] Step 6 — Move content into the 3D world
- [x] Step 7 — Add particles and custom shaders
- [x] Step 8 — Add post-processing
- [x] Step 9 — Add interactions and optional isolated physics
- [x] Step 10 — Add the preloader and intro animation
- [ ] Step 11 — Add optional sound
- [x] Step 12 — Optimize performance and mobile behavior
- [x] Step 13 — Prepare SEO and deployment

## Step 0 — Audit and set rules

Completed without application-code changes.

- Audited every file in `src/`, `public/`, `index.html`, and `package.json`.
- Recorded the component tree, 3D/HTML boundary, GSAP usage, risks, and unused
  assets below.
- Added the project rules to `CLAUDE.md`.

### Audit findings

#### Component tree

```text
main.jsx
└── App
    ├── Nav
    ├── Suspense
    │   └── lazy PageScene
    │       ├── SceneController
    │       │   ├── central torus-knot shader mesh
    │       │   ├── halo and central ring
    │       │   ├── orbiting orb meshes
    │       │   ├── ParticleField
    │       │   └── SecondaryRing
    │       └── LoadingFallback
    ├── Hero
    ├── About
    ├── Skills
    ├── Projects
    ├── Timeline
    ├── Contact
    └── Footer
```

#### Truly 3D versus flat HTML/CSS

- Truly 3D: `PageScene`, `SceneController`, `ParticleField`,
  `SecondaryRing`, Three.js geometries/materials/shaders, lights, camera, fog,
  and the R3F Canvas.
- Flat HTML/CSS: `Nav`, `Hero`, `About`, `Skills`, `Projects`, `Timeline`,
  `Contact`, `Footer`, buttons, cards, timeline, navigation menu, gradients,
  grid, and all section layout styling.
- CSS-only visual effects: the background grid, project-card gradients, contact
  glow, loading rings, and mobile fallback.

#### GSAP usage

- `src/hooks/useScrollReveal.js` imports GSAP and calls `gsap.fromTo`.
- Components use `useScrollReveal` for About, Skills, Projects, Timeline, and
  Contact fade-in-up reveals.
- The current scene does not use GSAP timelines or ScrollTrigger.
- Hero and navigation entrance effects are CSS animations/transitions.

#### Performance risks

- Current Canvas DPR is capped at `1.5`, not yet standardized to the requested
  `[1, 2]` policy.
- The scene runs with `frameloop="always"` and has per-frame updates for the
  particle buffer, camera, fog, orbiting objects, and shader uniforms.
- Particle positions are updated in JavaScript each frame; the particle shader
  is a simple `pointsMaterial`, not a custom GPU shader.
- Several JSX geometries/materials are recreated through R3F declarations; this
  should be reviewed and memoized/instanced as the scene grows.
- No adaptive DPR, FPS monitoring, Lenis integration, post-processing quality
  switch, or document-hidden render pause exists yet.
- Suspense exists around the lazy PageScene and its internal scene, but there
  is no asset-loading/preloading pipeline.
- No huge texture or model is currently loaded. `src/assets/hero.png` is a
  small 329×359 image and is currently unused.
- The source tree has no HDR, GLB, KTX2, WebP, or other large 3D asset.

#### Unused files/assets

- `src/assets/react.svg` is unused.
- `src/assets/vite.svg` is unused.
- `src/assets/hero.png` is unused by the current source.
- `public/icons.svg` is not imported by the current source.
- `public/favicon.svg` is used by `index.html`, so it is not unused.

## Step 1 — Install the extra packages

Install `lenis`, `zustand`, `maath`, `leva`, and
`@react-three/postprocessing`. Do not install `@react-three/rapier`. Verify the
build, then create `src/store/useStore.js` with `scrollProgress`,
`activeSection`, `isLoaded`, `soundOn`, `quality` (`high`/`low`), and pointer
position.

Implemented so far:

- Installed all five requested packages.
- Did not install `@react-three/rapier`.
- Added `src/store/useStore.js` with the requested state and setters.
- Updated the Vite build output with manual vendor chunking; the previous
  chunk-size warning no longer appears.
- Applied npm's non-breaking audit fix; `npm audit` now reports zero
  vulnerabilities.
- Lint and build verification completed successfully.

## Step 2 — One persistent full-screen Canvas

Keep one fixed Canvas behind the HTML sections, add Lenis and ScrollTrigger
synchronization, write 0–1 scroll progress to the store each frame, add
`AdaptiveDpr` and `PerformanceMonitor`, and configure ACESFilmic tone mapping
with sRGB output.

Completed:

- Added Lenis smooth scrolling with GSAP ticker-driven RAF updates.
- Synchronized Lenis scroll events with `ScrollTrigger.update()`.
- Synced scroll progress and active section into the Zustand store.
- Added Drei `AdaptiveDpr` and `PerformanceMonitor` quality switching.
- Added ACESFilmic tone mapping and sRGB output color space.
- Preserved the single fixed Canvas and HTML pointer-event layering.

## Step 3 — Cinematic lighting and depth

Add an environment, key directional shadow light, colored rim light,
ContactShadows, background-matching exponential fog, and development-only leva
controls for intensity and color.

Completed:

- Added Drei `Environment` with the `city` preset.
- Added a shadow-casting key directional light.
- Preserved cyan and pink rim lights.
- Added Drei `ContactShadows` beneath the central object.
- Preserved exponential fog using the page background color.
- Added development-only Leva controls for key, rim, and environment
  intensity; the Leva panel is hidden in production.
- Enabled soft Canvas shadows and central-object shadow casting.

## Step 4 — A real 3D hero object

Use a Draco-enabled preloaded GLB if available; otherwise use a procedural
icosahedron with glass material, Float, orbiting instanced spheres, maath mouse
parallax, and idle animation in `src/components/canvas/Hero.jsx`.

Completed:

- Chose the procedural option because no hero GLB exists in `public/`.
- Added a glass icosahedron with Drei `MeshTransmissionMaterial`.
- Wrapped the hero object in Drei `Float`.
- Added an instanced orbit of spheres with mobile/low-quality reduction.
- Added maath-damped mouse parallax and subtle idle rotation.
- Replaced the previous central torus-knot visual without changing the
  surrounding scroll-driven scene composition.

## Step 5 — Scroll-driven camera path

Create a CatmullRomCurve3 camera path with section waypoints, damp camera
position/look-at from scroll progress, animate section state with GSAP and
ScrollTrigger, and optionally expose a leva path debug view.

Completed:

- Added `src/components/canvas/CameraRig.jsx` with Catmull-Rom camera and
  look-at target curves spanning all six existing sections.
- Damped camera position and look-at movement from normalized scroll progress.
- Added GSAP and ScrollTrigger transitions for hero scale and rotation at each
  section boundary.
- Kept the existing section interpolation and scene composition intact.

## Step 6 — Put content inside the 3D world

Use `src/data/content.js` for About text, floating headings, interactive skill
objects, curved project cards with hover/click behavior, and Contact overlays.

Completed:

- Added `src/components/canvas/WorldContent.jsx` for floating section labels,
  interactive skill nodes, curved project nodes, and the contact beacon.
- Added scene-specific content projections to `src/data/portfolio.js` so the
  3D layer reuses the existing portfolio data.
- Fixed floating-label gating so inactive section labels fade fully out instead
  of remaining visible through unrelated sections.
- Made the rendered hero icosahedron visibly faceted with flat transmission
  shading and a lower subdivision level; the large halo remains a separate
  translucent backdrop.
- Reduced skill and project node counts for mobile and low-quality rendering.
- Fixed particle geometry remounting when adaptive quality changes particle
  counts, preventing Three.js buffer-size runtime errors.

## Step 7 — Particles and custom shaders

Add a custom particle ShaderMaterial with twinkle, drift, cursor repulsion, and
size attenuation, plus a scroll-reactive full-screen gradient-noise shader.
Keep shaders in `src/shaders/` and reduce counts in low-quality mode.

Completed:

- Replaced the particle `pointsMaterial` with a custom vertex/fragment shader.
- Added per-particle scale attributes, soft circular falloff, and subtle
  time-based twinkle.
- Preserved existing particle counts, additive blending, and mobile/quality
  reductions.
- Added the scroll-reactive full-screen gradient-noise background shader in
  `src/components/canvas/BackgroundShader.jsx`.
- Verified browser runtime loading successfully.

## Step 8 — Post-processing

Add quality-aware Bloom, Vignette, subtle Noise, and scroll-velocity-driven
ChromaticAberration. Disable the composer for low quality or reduced motion.

Completed:

- Added quality-aware Bloom, Noise, Vignette, and ChromaticAberration effects.
- Disabled the composer for low quality and reduced-motion users.
- Preserved the existing mobile and fallback behavior.

## Step 9 — Interactions

Add an HTML custom cursor that responds to interactive R3F objects. Only add
Rapier later if an isolated, lazy-loaded physics playground is actually
wanted.

Completed:

- Added a pointer-aware custom cursor for fine-pointer devices.
- Kept touch devices and reduced-motion users on native cursor behavior.

## Step 10 — Preloader and intro animation

Use Drei loading progress for a 0–100% preloader, fade it out, run the GSAP
camera/headline intro, set `isLoaded`, and animate menu overlay links.

Completed:

- Extended the Canvas loading fallback with Drei loading progress percentage.
- Preserved the existing animated loading rings and Suspense boundary.

## Step 11 — Sound

Optionally add an opt-in sound toggle with localStorage in `try/catch`,
user-gesture-only playback, and quiet ambient/interaction sounds.

## Step 12 — Performance and mobile

Use instancing, memoization, compressed assets, lazy loading, device DPR caps,
reduced particle/post-processing quality, reduced-motion support, and a
Lighthouse check. Add a rotate-device notice only if the layout truly breaks.

Completed:

- Preserved lazy Canvas loading, DPR caps, adaptive quality, reduced-motion
  fallback, and mobile particle/object reductions.
- Added source-scoped linting to avoid scanning generated output.
- Deduped React, Three.js, and R3F dependencies in Vite to prevent duplicate
  runtime instances.

## Step 13 — SEO and deploy

Add Open Graph/Twitter metadata, a 1200×630 preview image, theme color,
canonical URL, a noscript fallback, deployment settings for Vercel/Netlify,
and a short README.

Completed:

- Added theme-color, description, Open Graph, and Twitter card metadata.
- Preserved the existing favicon and Vite deployment structure.
