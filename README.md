# The Signal — 3D Vintage Radio Portfolio for Bhavya Jain

An interactive, diegetic 3D vintage radio-tuning portfolio for **Bhavya Jain**, a backend and blockchain engineer specializing in applied cryptography, zero-knowledge proofs (ZKP), and peer-to-peer (P2P) systems.

The experience is centered around a handcrafted 1940s Art Deco tabletop tube radio resting on a workbench. Across the dark night horizon stand 8 broadcast transmission towers, each radiating radio signal waves and obstacle beacons. Turning the large knurled brass tuning knob or selecting station presets sweeps the illuminated dial needle, closes the phosphor-green Magic Eye (6E5) tuning tube, and locks onto project dossiers with authentic procedural analog audio.

---

## Non-Negotiable Accessibility: Plain Resume

A persistent, one-click **"VIEW RESUME"** button is visible in the header from the very first frame. It links to a standalone, semantic, printer-friendly HTML resume (`/resume.html`) that works with zero JavaScript and requires zero 3D navigation.

---

## Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **3D Engine**: Three.js (`three` ^0.170.0) + React Three Fiber (`@react-three/fiber`) + Drei (`@react-three/drei`)
- **Post-Processing**: `@react-three/postprocessing` (warm bloom, vintage vignette)
- **State Management**: Zustand (`src/store/useSignalStore.ts`)
- **Animation & Transitions**: GSAP for project card unfurl and needle damping
- **Audio Engine**: 100% procedural Web Audio API synthesis (`src/audio/soundManager.ts`) — zero pre-rendered audio files, authentic heterodyne hum, carrier locks, and frequency tones
- **Styling**: Tailwind CSS v4 + custom vintage radio typography (Special Elite + IBM Plex Mono)
- **Icons**: Lucide React

---

## Quick Start (Local Run)

### Prerequisites
- Node.js (v18+, v20+, or v22+)
- npm

### Installation & Development
```bash
# Clone the repository
git clone https://github.com/jbhavya876/portfolio.git
cd portfolio

# Install dependencies (use --legacy-peer-deps for React 18 / Three.js tree)
npm install --legacy-peer-deps

# Start Vite local development server
npm run dev
```
Open `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
```
Generates an optimized static production bundle in `dist/`, ready for zero-config deployment on Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

---

## How to Add or Edit a Station (Career Data)

All portfolio data lives in a single, clearly commented file:
`src/data/stations.ts`

You do not need to touch any 3D scene code, shaders, or math to update projects or career details.

### Station Data Schema
```typescript
{
  id: 'kambria',                                  // Unique alphanumeric ID
  frequency: 88.5,                               // Station frequency in MHz (88.0 to 108.0)
  callsign: 'KMBR-DAO',                          // Callsign / radio tag
  title: 'Kambria — KAT Tokenomics',             // Full project or role headline
  role: 'Backend Developer',                     // Role title
  organization: 'System Prototyping DAO',        // Company / DAO / Project entity
  period: 'May 2026 – Present',                  // Date range
  location: 'Remote',                            // Location / work model
  category: 'experience',                        // 'experience' | 'project' | 'research' | 'origin'
  accentColor: '#d4a853',                        // Warm retro accent hex color
  position3D: [-14, 2.5, -20],                   // [X, Y, Z] placement in 3D landscape
  towerScale: 1.1,                               // Visual scale factor
  description: 'Your verified description text', // Exact career or project summary
  tech: ['NestJS', 'Node.js', 'MySQL'],          // Array of technology badges
  metrics: [                                     // Up to 3 key metric highlights
    { label: 'Ledger', value: 'Immutable Credit' },
    { label: 'Settlement', value: '3-Tier Cap Cascade' }
  ]
}
```

### Steps to Edit Existing Content:
1. Open `src/data/stations.ts` in any text editor.
2. Locate the station by its `title` or `frequency`.
3. Update `description`, `period`, `tech`, or `metrics` as desired.
4. Save the file. Vite automatically hot-reloads the changes in real time.

---

## Interaction Guide & Sound Design

- **Dial Tuning**: Click and drag horizontally across the large brass knob to spin the dial smoothly with inertial momentum. You can also scroll the mouse wheel anywhere over the radio.
- **Direct Dial Click**: Click anywhere directly on the illuminated dial glass to jump the needle to that frequency.
- **Magic Eye Indicator**: 6E5 cathode ray tube dynamically narrows its green wedge and illuminates as you approach an active carrier frequency.
- **Continuous Heterodyne Audio**: Dual detuned oscillators synthesize authentic vintage radio whistle and hiss that clears as you tune into a carrier.
- **Volume / Power Knob**: Click the volume knob on the left side of the radio to toggle mute/unmute (with a live red pilot lamp indicator).
- **Quick-Jump Presets**: Tap any station preset button in the bottom dock to smoothly glide the radio dial and needle to that project.
- **3D Tower Clicking**: Click directly on any transmission tower in the 3D horizon to tune to it.
- **2D Mode**: Responsive fallback mode for mobile devices or users who prefer a direct 2D list, toggleable anytime via the header.

---

## License & Attribution

All custom software, 3D procedural components, and procedural audio code are open-source under the MIT License.
Attribution for 3D design references is visible in the in-app Credits modal (`(i)` icon in the header) and in `resume.html`.
