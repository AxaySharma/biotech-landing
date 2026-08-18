# Nexus Bio — Premium Biotechnology Landing Page

An animation-driven, immersive marketing site for a biotechnology R&D company, built as a
showcase of modern frontend engineering: real-time WebGL, GSAP-driven scroll storytelling,
and careful attention to accessibility and performance under heavy visual load.

**Live site:** https://biotech-company.vercel.app

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Scroll animation | GSAP + ScrollTrigger |
| Micro-interactions | Framer Motion |
| Smooth scroll | Lenis |
| 3D / WebGL | Three.js via React Three Fiber + drei, `@react-three/postprocessing` |
| Icons | Lucide React |
| Hosting | Vercel |

## Features

- **Choreographed preloader** — real asset-loading progress (fonts + 3D bundle) drives an
  SVG helix line-draw and percentage counter, wiping into the live Hero on completion.
- **Hero** — instanced-mesh 3D DNA helix (React Three Fiber) with scroll-linked rotation,
  cursor parallax, and a post-processing pipeline (bloom, chromatic aberration, vignette),
  desktop only.
- **About** — pinned, scroll-scrubbed kinetic typography reveal (GSAP ScrollTrigger),
  degrading to a simple stagger-in on mobile/tablet.
- **Technology** — interactive research-pillar tabs driving a morphing Canvas2D node network,
  with a mobile-specific compact chip selector.
- **Capabilities** — responsive card grid with magnetic-cursor-aware hover states.
- **Stats** — scroll-synchronized animated data bars and counters.
- **Final CTA** — shifting gradient background, scroll-linked page mood transition, and a
  magnetic CTA button.
- **Global systems**: custom cursor, film-grain overlay, custom scrollbar, section-progress
  indicator (IntersectionObserver-driven), and a persistent WebGL shader background whose
  color mood shifts per active section and reacts to scroll velocity + cursor position.

## Getting Started

### Prerequisites

- **Node.js** 18.18 or later (Next.js 16 requirement) — check with `node -v`
- **npm** 9+ (comes with Node) — check with `npm -v`
- **Git**
- A code editor and terminal; no other global tools required

<details>
<summary><strong>Installing Node.js — macOS</strong></summary>

Using [Homebrew](https://brew.sh/) (recommended):

```bash
brew install node
```

Or download the macOS installer directly from [nodejs.org](https://nodejs.org/).

</details>

<details>
<summary><strong>Installing Node.js — Windows</strong></summary>

Using [winget](https://learn.microsoft.com/windows/package-manager/winget/) (Windows 10/11, recommended):

```powershell
winget install OpenJS.NodeJS.LTS
```

Or download the Windows installer directly from [nodejs.org](https://nodejs.org/).

Commands below are shown for **PowerShell**. If you're using **Git Bash** on Windows instead,
use the macOS/Linux commands — Git Bash provides a Unix-like shell.

</details>

<details>
<summary><strong>Installing Node.js — Linux</strong></summary>

Using [nvm](https://github.com/nvm-sh/nvm) (recommended, avoids permission issues):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install --lts
```

Or via your distro's package manager, e.g. Debian/Ubuntu:

```bash
sudo apt update && sudo apt install nodejs npm
```

</details>

---

### 1. Clone the repository

Same on all platforms:

```bash
git clone https://github.com/<your-username>/biotech-landing.git
cd biotech-landing
```

### 2. Install dependencies

Same on all platforms:

```bash
npm install
```

### 3. Run the development server

Same on all platforms:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The dev server uses
Turbopack and should be ready in a few seconds; the first full page compile (which includes
the Three.js/WebGL bundle) may take longer than subsequent ones.

### 4. Build for production (optional, to test locally)

Same on all platforms:

```bash
npm run build
npm run start
```

This produces an optimized production build and serves it locally at
[http://localhost:3000](http://localhost:3000), which is useful for checking real bundle
sizes, load performance, and the preloader's real (non-dev-mode) asset loading behavior
before deploying.

### Troubleshooting

**Stuck on `○ Compiling /`** — stop the server, clear the Turbopack cache, and restart:

| Platform | Command |
|---|---|
| macOS / Linux | `rm -rf .next && npm run dev` |
| Windows (PowerShell) | `Remove-Item -Recurse -Force .next; npm run dev` |
| Windows (Git Bash) | `rm -rf .next && npm run dev` |

**Full clean reinstall** (if the above doesn't help):

| Platform | Command |
|---|---|
| macOS / Linux | `rm -rf .next node_modules package-lock.json && npm install` |
| Windows (PowerShell) | `Remove-Item -Recurse -Force .next, node_modules, package-lock.json; npm install` |
| Windows (Git Bash) | `rm -rf .next node_modules package-lock.json && npm install` |

**Type errors before running** — verify types independently of the dev server (same on all
platforms):

```bash
npx tsc --noEmit
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build locally |
| `npx tsc --noEmit` | Type-check without emitting files |

## Environment Variables

No environment variables are required to run the project locally — it works out of the box.

| Variable | Purpose | Required? |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Used for `metadataBase` (OG/Twitter image resolution). Falls back to a hardcoded production URL if unset. | Optional — only needed if you want OG/Twitter previews to resolve against a different domain locally or in a specific deploy environment. |

## Project Structure

```
src/
  app/                  layout.tsx, page.tsx, globals.css, icon.svg, opengraph-image.tsx
  components/
    layout/             Navbar, Footer, SmoothScrollProvider, Preloader, CustomCursor,
                         GrainOverlay, ScrollProgress
    sections/            Hero, Partners, About, Technology, Capabilities, Stats, FinalCTA
    visuals/              DnaHelix (R3F), MoleculeNetwork (Canvas2D), ShaderBackground (R3F)
  data/                  sections.ts (shared section metadata for nav + scroll indicator)
  hooks/                  useLenis and related
  lib/                    gsap.ts (ScrollTrigger registration), motion-variants.ts
```

## Browser Support

Targets modern evergreen browsers only (see `browserslist` in `package.json`) — no
IE11/legacy polyfill overhead. WebGL2-capable browser required for the 3D hero visual and
shader background; both degrade gracefully (static fallbacks) below the `lg` breakpoint and
in reduced-motion contexts.

## Accessibility

- Full keyboard navigation with visible focus states across all interactive elements.
- Verified WCAG AA contrast (4.5:1+) across all text, including the About section's
  scroll-scrubbed kinetic typography.
- `prefers-reduced-motion` respected across every animation system (preloader, GSAP
  ScrollTriggers, Framer Motion, custom cursor, shader background, 3D post-processing).
- Decorative visuals (`DnaHelix`, `ShaderBackground`, `MoleculeNetwork`, grain overlay) are
  `aria-hidden`; surrounding text carries full meaning independently.

## Known Follow-Ups

- Mobile Lighthouse Performance sits at ~83 (desktop also dipped to ~83 after the last
  dependency-import refactor) — worth a dedicated profiling pass if further optimization is
  needed. Accessibility sits at 96; re-run Lighthouse's expanded audit list to identify the
  remaining flagged item(s).

## Deployment

Connected to Vercel; pushes to `main` trigger an automatic production deploy. Release tags
follow semver (`v1.0.0`, `v1.0.1`, ...).

## Design & Animation Approach

**Visual identity.** Rather than reaching for the bright, clinical-white aesthetic common to
biotech sites, Nexus Bio is built around a near-black background with two accent colors — a
bioluminescent teal and a violet — meant to evoke a lab environment at night: instruments lit
up, data glowing in the dark. Typography pairs a geometric grotesk (headings) with a neutral
sans (body), and copy across the site is written in a deliberately clinical, understated
register — no marketing adjectives like "revolutionary" or "cutting-edge" — so the page reads
like it came from an actual R&D company's technical team, not a design portfolio.

**Animation philosophy: a few signature moments, not constant motion.** The biggest
differentiator between a good site and a forgettable one usually isn't animation quantity,
it's restraint. Most sections use a single, simple entrance animation and otherwise stay
still — the Technology and Capabilities sections in particular were deliberately kept calm,
since their job is to build credibility through clarity, not to compete for attention. Motion
budget is instead concentrated in three deliberate "moments": the preloader (which turns
waiting into anticipation via an asset-synced SVG helix draw-in), the About section's pinned,
scroll-scrubbed kinetic typography reveal, and the Hero's 3D DNA helix with real-time
post-processing. Each tool was chosen for what it's actually good at: GSAP ScrollTrigger for
scroll-position-driven storytelling (pinning, scrubbing), Framer Motion for state-driven UI
micro-interactions (hover, tap, enter/exit), and React Three Fiber for anything genuinely
three-dimensional.

**A connective, adaptive system rather than isolated sections.** To make the page feel like
one considered space rather than six stacked sections, a persistent WebGL shader background
runs behind all content, its color mood gradually shifting to match whichever section is
active and reacting subtly to scroll velocity and cursor position — the same technique used
for the custom cursor, film grain, and section-progress indicator, all built as global,
lightweight overlays rather than per-section features.

**Performance and accessibility as constraints, not afterthoughts.** Running three
simultaneous canvas/WebGL systems (Hero, Technology's node network, the global shader) only
works if it's disciplined: all heavy visuals are code-split via `next/dynamic`, capped in
resolution, paused when the tab is inactive, and stripped down or replaced with static
fallbacks below the `lg` breakpoint. Every animation system independently checks and respects
`prefers-reduced-motion`, decorative visuals are marked `aria-hidden`, and text contrast —
including the About section's scroll-scrubbed reveal, which starts dim by design — was
verified to meet WCAG AA at its dimmest state, not just at rest.
