# Yohanes Alemu portfolio

Vite + TypeScript, GSAP ScrollTrigger for scroll choreography, Lenis for smooth scroll. No framework, no WebGL.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build into dist/
```

## Where things live

| What | Where |
|---|---|
| All text content, projects, skills, contact links | `src/data.ts` |
| Project cover images (1600x1000 + 800x500 `-sm`) | `public/work/` |
| Page structure | `index.html` |
| Scroll choreography, loader, nav, tabs | `src/main.ts` |
| Rendering of data-driven sections | `src/render.ts` |
| Styles | `src/styles/main.css`, `src/styles/logo.css` |
| Logo kit (SVGs, favicon, animated mark) | `brand/` |

`src/logo.ts` and `src/styles/logo.css` are generated from the brand kit; don't edit the SVG paths by hand.

## Before launch (placeholders to replace)

- [ ] Project covers in `public/work/` are temporary title cards. Replace with real screenshots, same file names.
- [ ] Project summaries, roles and years in `src/data.ts` are drafts.
- [ ] Email and social links in `src/data.ts` are dummies.
- [ ] Cowsville demo data in `src/render.ts` is sample data.

## Motion rules

- Only `transform` and `opacity` are animated.
- Desktop (> 900px) gets the canvas zoom, docking logo, sticky project stack and backend peel.
- Phones get the same content without pinned sections.
- `prefers-reduced-motion: reduce` turns off smooth scroll, pins, the loader and all scrubbed animation.
