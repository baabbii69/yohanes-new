# Yohanes Alemu portfolio (v2, "Canvas")

Vite + TypeScript, GSAP (ScrollTrigger, Flip), Lenis. No framework, no WebGL.
Branch `main` holds v1 (dark, scroll-driven). This branch is v2 (light, interaction-driven).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build into dist/
```

## What visitors can do

| Interaction | Where | Code |
|---|---|---|
| Drag a Figma-like canvas of project frames (inertia, depth layers, mouse parallax) | Hero | `src/canvas.ts` |
| Press **O** (or the nav button) to see the whole site as a wireframe | Everywhere | `main.ts`, `.outline` in CSS |
| Filter work by type, with layout animation | Work | `main.ts` (GSAP Flip) |
| Open a case study: the image grows into the page (`/work/:slug`) | Work, hero frames | `src/router.ts` |
| Change design tokens and watch the component and CSS update | Playground | `src/playground.ts` |
| Filter a herd and see the API request, JSON and screen | API demo | `src/api.ts` |
| Build a project brief that becomes a ready-to-send email | Contact | `src/brief.ts` |

## Content

All copy, projects, case studies and links live in `src/data.ts`.
Images live in `public/work/` as `name.webp` (1600x1000) and `name-sm.webp` (800x500).

## Before launch

- [ ] Hawi Software images are real screenshots of hawisoftware.com. Every other project uses openly licensed stand-in photos from Wikimedia Commons (credited in the footer). Replace them with real screens, then remove their entries from `credits` in `src/data.ts`.
- [ ] Case study text, years and budgets are drafts (`src/data.ts`, `src/brief.ts`).
- [ ] Email and social links are placeholders.
- [ ] Case study URLs (`/work/hawi`) need an SPA fallback on the host: every path should serve `index.html`. On Netlify add `/* /index.html 200` to `public/_redirects`; on Vercel add a rewrite.

## Motion rules

- Only `transform` and `opacity` animate. The canvas loop stops when the hero is off screen.
- `prefers-reduced-motion: reduce` turns off smooth scroll, parallax, inertia, the loader and reveals. Every interaction still works.
