# STILL — pocket camera concept

STILL is a one-page product concept about making photographs without leaving the moment to check a phone or feed. It is an editorial exploration, not a launched product. The working name, story, interaction, and product imagery are intentionally easy to replace as the concept develops.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Run `npm run typecheck` for the TypeScript check and `npm run build` for a production build.

## Structure

```text
app/
  globals.css       Brand tokens, responsive layout, and motion rules
  layout.tsx        Metadata and root document
  page.tsx          One-page story and section structure
components/
  CameraHeroMedia.tsx Shows the single hero video with a poster fallback
  FrameStudy.tsx    Small interactive concept study
  ImageFrame.tsx    Responsive remote image and loading state
  ScrollProgress.tsx Scroll-linked page progress indicator
  ScrollReveal.tsx  Reversible, reduced-motion-aware section reveals
  SiteHeader.tsx   In-page navigation
lib/
  content.ts        Editable copy, concept states, and media sources
```

## Concept and media notes

- “STILL” is a working identity only. No camera specifications, pricing, or product availability are claimed.
- The imagery currently loads from Unsplash’s image CDN. Source links and image credits are listed in `lib/content.ts`; replace those entries with approved local campaign assets when they exist.
- The hero is a single continuous media panel. To use the intended camera video, add an approved, optimized MP4 at `public/media/camera-hero.mp4` and set `media.cameraVideo` in `lib/content.ts` to `/media/camera-hero.mp4`. Until then, the hero uses its still poster with the same layout.
- The visual system uses a white canvas, black editorial contrast, restrained brown accents, and a cinematic serif fallback stack. Motion is scroll-responsive and respects reduced-motion preferences.
- The interaction selector is an illustrative concept study. It does not imply a finished camera interface or confirmed product behavior.
- There are no accounts, forms, payments, or third-party service credentials to configure.
