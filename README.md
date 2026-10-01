# The Signal — Cryptographic Observatory

Bhavya Jain’s interactive 3D engineering portfolio. Ten connected signals represent his backend, blockchain, applied cryptography, zero-knowledge, and peer-to-peer work.

A procedural resonator brings the radio roots into a new visual world: a suspended proof core, machined orbital rings, a frequency rail, and connected project nodes. Selecting a signal updates its lighting, carrier path, tuning readout, and original engineering dossier. Desktop and mobile both render real WebGL.

## Run locally

```sh
npm ci
npm run dev
```

Open the local address printed by Vite.

```sh
npm run build
npm run preview
npm test
```

The production build is written to `dist`. The Playwright checks cover all ten signals, keyboard tuning, narrow layouts, sound and motion controls, dialog behavior, the résumé, reduced motion, and WebGL fallback. Install Chromium with `npx playwright install chromium` if it is not already available.

## Interactions

- Drag the 3D exhibit to orbit freely through unlimited 360° rotations in either direction; select a project node to tune to it.
- Select a station in the signal index or use the frequency slider, including keyboard arrow, Home, and End controls.
- Use previous/next to move through all ten signals.
- Sound is muted initially; enable it in the header.
- Pause motion in the header. System reduced-motion preferences are respected.
- The résumé is always accessible at `/resume.html`, without JavaScript or WebGL.

## Content and rendering

`src/data/stations.ts` holds the original career evidence, metrics, technologies, and optional case-study/source URLs. Edit that data to update the portfolio. Do not invent endpoints, metrics, or claims.

The navigation state is independent of the WebGL render loop. If rendering fails or the context is lost, the tuner, signal index, and dossier remain usable. The 3D bundle loads separately from the interface, pixel ratio is capped, and animation pauses offscreen or when the page is hidden. Fonts are self-hosted, with licenses under `public/fonts`.

React 18, TypeScript, Vite, React Three Fiber, Three.js, Drei, React Three Postprocessing, Zustand, Lucide, Web Audio, and CSS provide the experience. All exhibit geometry is procedural; no external model downloads are needed.

The visual system and surface contract are documented in `DESIGN.md` and `.impeccable/surfaces/src-app-tsx.md`.
