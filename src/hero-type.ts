// The name reacts to the cursor: letters near the pointer turn light and wide,
// letters far away stay heavy and condensed. Uses the font's own weight and width axes.
import { gsap } from "gsap";

interface Ch { el: HTMLElement; cx: number; cy: number; t: number; cur: number; }

export function splitLetters() {
  document.querySelectorAll<HTMLElement>("[data-vtype]").forEach((row) => {
    row.innerHTML = [...row.textContent!].map((c) => `<span class="ch">${c}</span>`).join("");
  });
}

export function initHeroType(opts: { reduceMotion: boolean }) {
  const hero = document.querySelector<HTMLElement>(".hero")!;
  const chars: Ch[] = Array.from(document.querySelectorAll<HTMLElement>(".name .ch")).map((el) => ({ el, cx: 0, cy: 0, t: 0, cur: 0 }));
  const apply = (c: Ch) => {
    c.el.style.fontVariationSettings = `"wght" ${(800 - 520 * c.cur).toFixed(0)}, "wdth" ${(75 + 25 * c.cur).toFixed(1)}`;
  };

  // Intro: a wave runs through the name once, left to right.
  const intro = () => {
    if (opts.reduceMotion) return;
    const state = chars.map(() => ({ v: 0 }));
    gsap.timeline()
      .to(state, { v: 1, duration: 0.55, ease: "power2.out", stagger: 0.05, onUpdate() { state.forEach((s, i) => { chars[i].cur = s.v; apply(chars[i]); }); } })
      .to(state, { v: 0, duration: 0.8, ease: "power3.inOut", stagger: 0.05, onUpdate() { state.forEach((s, i) => { chars[i].cur = s.v; apply(chars[i]); }); } }, 0.45);
  };

  if (opts.reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return { intro };

  const measure = () => chars.forEach((c) => {
    const r = c.el.getBoundingClientRect();
    c.cx = r.left + r.width / 2;
    c.cy = r.top + r.height / 2;
  });
  let running = false, inside = false, px = 0, py = 0;
  const tick = () => {
    const R = Math.max(260, window.innerWidth * 0.26);
    let moving = false;
    for (const c of chars) {
      const d = Math.hypot(px - c.cx, py - c.cy);
      c.t = inside ? Math.max(0, 1 - d / R) ** 1.6 : 0;
      c.cur += (c.t - c.cur) * 0.14;
      if (Math.abs(c.t - c.cur) > 0.002) moving = true;
      apply(c);
    }
    if (!moving && !inside) { gsap.ticker.remove(tick); running = false; }
  };
  const start = () => { if (!running) { running = true; gsap.ticker.add(tick); } };

  hero.addEventListener("pointerenter", () => { measure(); inside = true; start(); });
  hero.addEventListener("pointermove", (e) => {
    // The name only reacts while the hero is at rest (before the scroll scene moves it).
    if (window.scrollY > 40) { inside = false; start(); return; }
    px = e.clientX; py = e.clientY; inside = true; start();
  });
  hero.addEventListener("pointerleave", () => { inside = false; start(); });
  window.addEventListener("resize", measure, { passive: true });
  return { intro };
}
