---
name: "The Signal — Cryptographic Observatory"
description: "A nocturnal instrument for exploring Bhavya Jain's engineering evidence."
colors:
  bg: "#081810"
  surface: "#10241b"
  ink: "#e2eee5"
  muted: "#9fb4a6"
  mint: "#b0e9cb"
  accent: "#eaa57c"
  rule: "#30473a"
  scene-mint: "#a7edd1"
typography:
  display:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "72px"
    fontWeight: 600
    lineHeight: 0.99
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "29px"
    fontWeight: 500
    lineHeight: 1.12
  title:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "36px"
    fontWeight: 500
    lineHeight: 1.1
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "8px"
    fontWeight: 400
    letterSpacing: "0.09em"
rounded:
  panel: "4px"
  dialog: "12px"
  circular: "50%"
spacing:
  compact: "6px"
  control-gap: "8px"
  brand-gap: "14px"
  rule-gap: "20px"
  mobile-gutter: "22px"
  dossier-inset: "23px"
  desktop-gutter: "48px"
  wide-gutter: "65px"
components:
  resume-link:
    backgroundColor: "{colors.mint}"
    textColor: "#10251a"
    rounded: "{rounded.panel}"
    padding: "13px 19px"
  resume-link-hover:
    backgroundColor: "#d0ffde"
  icon-button:
    textColor: "{colors.muted}"
    rounded: "{rounded.circular}"
    size: "44px"
  icon-button-pressed:
    textColor: "{colors.accent}"
  dossier:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    width: "328px"
  dossier-copy:
    typography: "{typography.body}"
    textColor: "#bdcbbc"
  dossier-record:
    textColor: "{colors.mint}"
    padding: "12px 23px"
  station-preset:
    textColor: "{colors.ink}"
    padding: "16px 15px"
  station-preset-selected:
    backgroundColor: "#203c2a"
  frequency-input:
    height: "44px"
---

# Design System: The Signal — Cryptographic Observatory

## Overview

**Creative North Star: "Cryptographic Observatory"**

The Signal presents engineering work as connected frequencies around a suspended proof core. Deep mineral green, dark machined alloy, pale mint illumination, and copper measurement details create a nocturnal observatory. Radio roots remain in the resonator, carrier paths, tuning rail, callsigns, and signal-lock feedback.

The apparatus is the expressive artifact; surrounding typography makes the evidence easy to read. Condensed instrument lettering establishes hierarchy, while calm humanist paragraphs and ruled metrics carry the candidate's supplied record. Navigation and résumé access remain usable throughout scene loading or rendering failure.

**Key Characteristics:**

- Procedural orbital geometry, faceted core, and eight connected signal nodes.
- Mineral green surfaces with mint illumination and copper frequency feedback.
- Condensed display lettering paired with readable humanist text.
- Ruled evidence panels and restrained controls.
- Damped motion with native keyboard and touch alternatives.

Source of truth: `src/index.css`, `src/components/3d/Scene.tsx`, and implemented UI components. Frontmatter records actual reusable values; `.impeccable/design.json` carries depth, motion, responsive metadata, and component previews. The surface brief owns this page's composition.

## Colors

The palette belongs to a low-light instrument: mineral greens establish the environment, mint reveals the apparatus, and copper marks tuning and active carriers.

### Primary

- **Pale mint** (`mint`): highlighted profile lettering, résumé action, selected index rule, locked status, and dossier links.
- **Scene mint** (`scene-mint`): emissive orbital detail and inactive node illumination. Preserve its distinct material value rather than replacing it with the UI mint.

### Secondary

- **Copper** (`accent`): frequencies, tuning needle, scanning feedback, active 3D node and carrier path, and keyboard focus. It communicates measurement and interaction.

### Neutral

- **Deep mineral green** (`bg`): page environment and scene fog.
- **Instrument surface** (`surface`): dossier and native dialog.
- **Pale mineral ink** (`ink`): primary names, titles, and evidence.
- **Muted sage** (`muted`): supporting labels, dates, navigation, and unselected controls.
- **Ruled green** (`rule`): panel divisions, index boundaries, and control outlines.

**The Signal Feedback Rule.** Mint communicates illumination and locked UI state; copper communicates frequency and the active carrier. Keep these assignments legible in both the scene and the surrounding controls.

## Typography

**Display Font:** Barlow Condensed, with sans-serif fallback. Self-hosted weights: 500, 600, and 700.

**Body Font:** Manrope, with sans-serif fallback. Self-hosted weights: 400, 500, 600, and 700.

The narrow display face has the character of instrument lettering. Manrope gives the evidence a calm reading voice. Frequencies use tabular numerals; scene callsign textures use a generic monospace face, rather than a third web font.

### Hierarchy

- **Display:** the profile statement uses the frontmatter display role. It changes to 62px on intermediate screens, 66px on mobile, 58px below 370px, and 88px on wide screens. Mobile line-height is .98.
- **Headline:** dossier titles use the headline role, increasing to 32px on mobile. Receiver headings use Barlow Condensed at 24px and weight 500.
- **Title / measurement:** the receiver frequency uses the title role with tabular numerals; it becomes 30px on mobile. Dossier frequency uses 28px and weight 500.
- **Body:** dossier descriptions use the body role at every breakpoint. Profile descriptions use 12px on regular desktop and 13px on mobile, intermediate, and wide layouts.
- **Labels:** receiving status uses the frontmatter label role. Other measurement labels range from 6–12px according to context; uppercase, restrained tracking, and small status dots distinguish telemetry from prose.

**The Evidence Reading Rule.** Keep dossier paragraphs at 14px with 1.8 line-height across all breakpoints. Condensed type belongs to titles and measurements, not long descriptions.

## Layout

The observatory shell is centered with a 2000px maximum width. Regular desktop uses 48px outer gutters and a 100px header. The experience is a 650px-tall spatial field, with a central WebGL stage and an inset, 328px-wide dossier. The receiver and signal index share ruled horizontal boundaries; the index has eight equal columns.

- **Intermediate, 761–1200px:** gutters reduce to 28px, the dossier becomes 290px wide, and the signal index becomes four columns. The receiver retains a single horizontal grid with narrower heading and readout tracks.
- **Mobile, up to 760px:** gutters are 22px. The 114px header keeps the signal-index link, audio and motion buttons, and résumé action visible. Profile, real 3D stage, caption, instruction, and dossier flow vertically. The scene is 400px tall and bleeds to the viewport edges; the dossier uses natural content height. The receiver becomes two columns and the index becomes two columns. Selecting a station brings its dossier into view; the selected-signal link reconnects the lower tuner to the dossier.
- **Narrow mobile, up to 370px:** the profile and scene use 18px side insets, the header uses 15px, and the scene becomes 350px tall.
- **Wide, from 1600px:** gutters increase to 65px, the experience to 720px, and the dossier to 360px.

The spacing vocabulary is compact within controls and generous around reading blocks. Dossier content uses 23px horizontal padding on regular desktop, 20px on intermediate screens, and 21px on mobile. Status, reading area, persistent record, and next transmission form distinct stacked zones.

## Elevation & Depth

Depth combines real WebGL lighting and material response with quiet tonal layering in the UI. Metallic orbital rings, a clear-coated faceted core, additive mint or copper glow, and restrained bloom establish the apparatus. Dossier and dialog shadows support spatial separation without turning the interface into a collection of floating cards.

### Shadow Vocabulary

- **Dossier:** `0 16px 40px #020b0638`, a low-contrast structural shadow.
- **Dialog:** `0 30px 100px #0009`, paired with a dark native backdrop.
- **Frequency needle:** `0 3px 9px #eaa57c40` on the WebKit thumb, a localized copper glow.

Scene bloom uses intensity .32 and luminance threshold 1.6. Keep light tied to nodes, ring traces, and carrier feedback; the evidence panel remains calm.

## Shapes

Panels and résumé links use the small panel radius. The native about dialog uses the larger dialog radius. Icon controls and status dots are circular; frequency needles, ruled grids, and selected-station rules remain crisp and straight.

The 3D vocabulary combines faceted polyhedra, concentric and tilted orbital rings, thin curved connections, and measured radial ticks. These forms carry the chosen observatory identity. The replaced vintage cabinet, wood grain, cloth grille, vacuum tubes, and typewriter typography are obsolete.

## Components

### Résumé and Icon Controls

The mint résumé action stays visible from the first frame and opens the standalone HTML record. Its hover state lightens the surface and lifts it by 2px; its arrow shifts diagonally. Circular icon controls use ruled outlines, muted sage at rest, and mint with a darker green surface on hover. Pressed audio or motion state uses copper. Audio starts muted, and the motion button exposes pause and resume.

Icon controls and the range input have 44px interaction dimensions. Mobile résumé and persistent record actions provide at least 44px height. Keyboard focus uses a 2px copper outline with 6px offset. Keep clear accessible labels and native link, button, and input semantics.

### Frequency Tuner and Signal Index

The native range input tunes from 88.0 to 108.0 MHz in .1 MHz steps. A narrow copper needle overlays the ruled scale; decorative stops do not intercept pointer events. Previous and next buttons cycle through the supplied signals. Native keyboard input remains available when the WebGL scene is paused or unavailable.

Index presets use an outlined shared grid, frequency above title, and category with ordinal below. Hover adds a dark green fill. Selection adds a stronger green fill, a 2px mint top rule, and a mint indicator; `aria-pressed` exposes the state.

### Signal Dossier

The dossier is a quiet, ruled evidence reader. Its hierarchy is receiving status, frequency and category, title, role, period and location, original description, metrics, technologies, and supplied destinations. Technology names are light text separated by slashes, not filled badges.

Desktop content scrolls within the panel and displays the cue “Scroll for technologies and details.” The full engineering record link stays outside that scroll area, above next transmission. Mobile expands the reading area naturally and hides the unnecessary scroll cue. Keep the status announcement and persistent record access when station content changes.

Receiving a different signal introduces the article over .42s with opacity, an 8px rise, and a small blur, using `cubic-bezier(.16,1,.3,1)`. This feedback never delays navigation or record access.

### Procedural Resonator

Eight selectable nodes connect to a suspended proof core through curved carrier paths. Frequency changes damp the core and orbital rings into new positions; a locked node turns copper and its carrier carries a moving packet. Pointer drag orbits the camera, and pointer parallax stays restrained.

Core tuning uses damping 4, orbital tuning 3.4, and camera orbit 5. Continuous rotation and drift accumulate a delta capped at .04s. Rendering changes from continuous to demand when the scene is hidden, offscreen, motion-paused, or reduced-motion. Reduced motion keeps a static 3D apparatus and immediate frequency state changes, removes the receive animation, and disables smooth scrolling. Store updates invalidate demand rendering so navigation remains independent of the render loop.

### About Dialog and Scene States

The about panel uses a native modal dialog with the surface palette, generous padding, a circular close control, and a dark backdrop. Loading and WebGL-unavailable states retain the surrounding profile, dossier, tuner, index, and résumé access. The loading mark gently breathes; the system reduced-motion preference suppresses decorative animation.

## Do's and Don'ts

### Do:

- **Do** preserve the mineral green, mint, copper, and machined-alloy observatory identity.
- **Do** keep frequency and carrier feedback consistent between WebGL and native controls.
- **Do** keep dossier paragraphs at 14px and primary touch controls at least 44px.
- **Do** keep the résumé visible from the first frame and the engineering record outside the desktop scroll area.
- **Do** preserve native keyboard navigation, reduced-motion behavior, and hidden or offscreen rendering pauses.
- **Do** retain supplied evidence and render optional destinations only when supplied.

### Don't:

- **Don't** reintroduce the replaced vintage radio cabinet, wood, grille cloth, vacuum tubes, or typewriter fonts.
- **Don't** make evidence or résumé access depend on WebGL, sound, or animation completion.
- **Don't** shrink dossier reading copy to the telemetry label scale.
- **Don't** invent employers, metrics, credentials, project destinations, or a new tonal token scale.
