# Yohanes Alemu portfolio (v3, "Frame")

The Frame + ዮ logo is the protagonist. It leaves the nav, takes the centre of the screen,
swaps ዮ for "yo.", then opens up into the viewfinder the work is seen through.

Vite + TypeScript, GSAP ScrollTrigger, Lenis. No framework, no WebGL.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build into dist/
```

Branches: `main` = v1 (dark), `v2-canvas` = v2 (light canvas), `v3-frame` = this one.

## The experience

| Moment | What happens | Code |
|---|---|---|
| Loader | The mark draws itself on orange and flies into the nav | `src/main.ts` |
| Hero | Giant name; letters near the cursor turn light and wide (weight and width axes) | `src/hero-type.ts` |
| Scroll 1 | Logo leaves the nav, grows to the centre, orange turns to ink, the name splits away | `src/scene.ts` |
| Scroll 2 | ዮ rolls out, "yo." rolls in | `src/scene.ts` |
| Scroll 3 | The frame widens into a viewfinder; projects slide through it, snapping one at a time; the logo's dot tracks progress | `src/scene.ts` |
| Case study | The image in the viewfinder grows into the case study page (`/work/:slug`) | `src/router.ts` |
| About | The story of the mark; hover or tap it to swap alphabets | `src/sections.ts` |
| What I do | Giant rows; hover widens the word and the logo's corners select it | `src/sections.ts` |
| Contact | "Say yo." with the mark swapping on its own | `src/sections.ts` |
| Favicon | Rolls between ዮ and yo. every 4 seconds | `src/brand/favicon.ts` |

## Content and images

- Copy, projects and links: `src/data.ts`.
- Covers: `public/work/<slug>.webp` (2000x1250) and `<slug>-sm.webp` (1000x625).
  Hawi uses a real screenshot of hawisoftware.com. The others are art-directed brand covers
  generated from each project's idea (biscuit perforations, auction countdown, timetable,
  school network, herd in a field). Replace any of them with real screens, same file names.
- Logo paths are generated from the brand kit (`src/brand/paths.ts`); don't hand-edit them.

## Before launch

- [ ] Case study text and years in `src/data.ts` are drafts.
- [ ] Email and social links are placeholders.
- [ ] Hosting needs an SPA fallback for `/work/*` (`public/_redirects` for Netlify, `vercel.json` for Vercel are included).

## Performance and accessibility

- Only transforms, opacity and one clip-path animate. The whole scene is drawn from one scroll value.
- `prefers-reduced-motion: reduce` gives a static page: no pinning, no smooth scroll, a plain list of work. The favicon swaps without animating.
- Keyboard: a visually hidden work index moves the viewfinder to the focused project.
