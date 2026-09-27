// The pinned opening scene. One scroll timeline, measured in "units" of scroll:
//   0.0 - 1.0  the logo leaves the nav and grows into the centre; orange turns to ink
//   1.0 - 1.7  ዮ rolls out and "yo." rolls in
//   1.7 - 2.5  the letters leave; the frame widens into a viewfinder and the first project appears
//   2.5 - end  each project slides through the viewfinder; the logo's dot tracks progress
// Everything is drawn from one number (P) in render(), so scrubbing backwards is exact.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "./data";

interface Box { x: number; y: number; w: number; h: number; }
type RGB = [number, number, number];

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const eio = (t: number) => { t = clamp01(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpBox = (a: Box, b: Box, t: number): Box => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) });
const mix = (a: RGB, b: RGB, t: number) => `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))})`;

const ORANGE: RGB = [255, 84, 16], INK: RGB = [12, 11, 10], PAPER: RGB = [241, 239, 234];
const PER = 0.9; // scroll units per project
const START_D = 2.5;
const n = projects.length;
const U = START_D + (n - 1) * PER + 0.35;

export interface SceneApi { goTo(index: number): void; currentImage(): HTMLElement | null; }

export function initScene(opts: { onOpen: (slug: string, from: HTMLElement) => void; lenis: { scrollTo: (y: number, o?: object) => void } | null }): SceneApi {
  const scene = document.querySelector<HTMLElement>(".scene")!;
  const pin = scene.querySelector<HTMLElement>(".scene-pin")!;
  const nav = document.querySelector<HTMLElement>(".nav")!;
  const navLogo = document.querySelector<HTMLElement>(".nav-logo")!;
  const r1 = pin.querySelector<HTMLElement>(".r1")!;
  const r2 = pin.querySelector<HTMLElement>(".r2")!;
  const meta = pin.querySelector<HTMLElement>(".hero-meta")!;
  const glyph = pin.querySelector<HTMLElement>(".scene-glyph")!;
  const yo = glyph.querySelector<SVGElement>(".ya-yo")!;
  const y = glyph.querySelector<SVGElement>(".ya-y")!;
  const o = glyph.querySelector<SVGElement>(".ya-o")!;
  const dot = pin.querySelector<HTMLElement>(".scene-dot")!;
  const frame = pin.querySelector<HTMLButtonElement>("[data-frame]")!;
  const label = pin.querySelector<HTMLElement>("[data-frame-label]")!;
  const names = pin.querySelector<HTMLElement>("[data-vf-names]")!;
  const media = pin.querySelector<HTMLElement>("[data-vf-media]")!;
  const vfMeta = pin.querySelector<HTMLElement>("[data-vf-meta]")!;

  names.innerHTML = projects.map((p) => `<div class="vf-name"><span>${p.short}</span></div>`).join("");
  media.innerHTML = projects
    .map((p, i) => `<img src="/work/${p.slug}.webp" srcset="/work/${p.slug}-sm.webp 1000w, /work/${p.slug}.webp 2000w" sizes="64vw" alt="" width="2000" height="1250" decoding="async" ${i < 2 ? 'fetchpriority="high"' : ""}>`)
    .join("");
  const nameEls = Array.from(names.children) as HTMLElement[];
  gsap.set(nameEls.map((el) => el.firstElementChild), { yPercent: 105 });
  const imgs = Array.from(media.children) as HTMLElement[];

  let B0: Box, B1: Box, B2: Box, W = 0, H = 0;
  const layout = () => {
    W = window.innerWidth;
    H = pin.clientHeight;
    const r = navLogo.getBoundingClientRect();
    B0 = { x: r.left + (r.width * 18) / 120, y: r.top + (r.height * 18) / 120, w: (r.width * 84) / 120, h: (r.height * 84) / 120 };
    const s = Math.min(H * 0.56, W * 0.66);
    B1 = { x: (W - s) / 2, y: (H - s) / 2, w: s, h: s };
    const narrow = W < 820;
    const vw = narrow ? W - 36 : Math.min(W * 0.6, H * 0.6 * 1.6);
    const vh = vw / 1.6;
    B2 = { x: (W - vw) / 2, y: (H - vh) / 2 - (narrow ? 30 : H * 0.02), w: vw, h: vh };
    Object.assign(media.style, { left: `${B2.x}px`, top: `${B2.y}px`, width: `${B2.w}px`, height: `${B2.h}px` });
    // project names straddle the bottom edge of the viewfinder
    names.style.transform = `translate3d(0,${Math.round((B2.y + B2.h - H / 2) * 0.9)}px,0)`;
  };

  /* ---------- discrete project changes: names, meta, label ---------- */
  let active = -2;
  const setActive = (i: number) => {
    if (i === active) return;
    const prev = active;
    active = i;
    if (prev >= 0) gsap.to(nameEls[prev].firstElementChild, { yPercent: i > prev ? -105 : 105, duration: 0.7, ease: "expo.inOut", overwrite: true });
    if (i >= 0) {
      gsap.fromTo(nameEls[i].firstElementChild, { yPercent: prev > i ? -105 : 105 }, { yPercent: 0, duration: 0.8, ease: "expo.out", delay: 0.1, overwrite: true });
      const p = projects[i];
      label.textContent = `${p.name}   ${Math.round(B2.w)} × ${Math.round(B2.h)}`;
      vfMeta.innerHTML = `
        <div class="vf-info"><span class="vf-line"><b>${p.name}</b></span><span class="vf-line"><span>${p.kind}, ${p.year}</span></span></div>
        <button class="vf-open" type="button" data-open="${p.slug}"><span class="roll"><span data-text="View case">View case</span></span></button>`;
      gsap.from(vfMeta.querySelectorAll(".vf-line > *, .vf-open"), { yPercent: 110, opacity: 0, duration: 0.7, stagger: 0.05, ease: "expo.out" });
    } else {
      label.textContent = "Frame 01";
    }
  };

  const open = () => {
    if (active < 0) return;
    opts.onOpen(projects[active].slug, imgs[active]);
  };
  frame.addEventListener("click", () => frame.classList.contains("is-live") && open());
  vfMeta.addEventListener("click", (e) => (e.target as Element).closest("[data-open]") && open());

  /* ---------- the render function ---------- */
  let navHidden = false;
  const home = document.getElementById("home")!;
  const render = (P: number) => {
    // A case study is open: the scene is hidden and must not touch the nav.
    if (home.hidden) { navHidden = false; navLogo.style.opacity = ""; return; }
    const a = eio(P);
    const sw = eio((P - 1.02) / 0.6);
    const c = eio((P - 1.7) / 0.8);
    const box = P < 1.7 ? lerpBox(B0, B1, a) : lerpBox(B1, B2, c);

    // background, nav colours
    pin.style.backgroundColor = P < 1.7 ? mix(ORANGE, INK, a) : "rgb(12,11,10)";
    const darkNav = a > 0.5;
    nav.style.setProperty("--nav-fg", darkNav ? "var(--paper)" : "var(--ink)");
    nav.style.setProperty("--nav-accent", darkNav ? "var(--orange)" : "var(--paper)");

    // the name splits apart and leaves
    r1.style.transform = `translate3d(${(-a * 60).toFixed(2)}vw,0,0)`;
    r2.style.transform = `translate3d(${(a * 60).toFixed(2)}vw,0,0)`;
    meta.style.opacity = String(clamp01(1 - a * 2.4));

    // hand-over between the nav logo and the scene logo
    const takeover = clamp01(P / 0.015);
    const hideNav = takeover > 0 && P < U - 0.001;
    if (hideNav !== navHidden) { navHidden = hideNav; navLogo.style.opacity = hideNav ? "0" : ""; }

    // glyph: sits exactly inside the frame while it is square
    const k = (P < 1.7 ? box.h : B1.h) / 84;
    const gx = box.x + box.w / 2 - 60 * k;
    const gy = box.y + box.h / 2 - 60 * k;
    glyph.style.opacity = String(takeover * (1 - clamp01((c - 0.55) / 0.3)));
    glyph.style.transform = `translate3d(${gx.toFixed(1)}px,${gy.toFixed(1)}px,0) scale(${k.toFixed(4)})`;
    glyph.style.color = mix(INK, PAPER, a);
    const iny = eio(sw * 1.25 - 0.1), ino = eio(sw * 1.25 - 0.25);
    yo.style.transform = `translateY(${(-80 * sw).toFixed(2)}px)`;
    y.style.transform = `translateY(${(62 * (1 - iny) - 80 * c).toFixed(2)}px)`;
    o.style.transform = `translateY(${(62 * (1 - ino) - 80 * eio(c * 1.15 - 0.1)).toFixed(2)}px)`;

    // project index inside the viewfinder
    const q = Math.max(0, Math.min(n - 1, (P - START_D) / PER));
    const i = Math.floor(q);
    const f = i >= n - 1 ? 0 : eio(q - i);
    setActive(P > START_D - 0.25 ? Math.round(q) : -1);

    // frame corners: logo-sized strokes early, fine viewfinder strokes later; they breathe between projects
    const breathe = Math.sin(Math.PI * f) * 10;
    const fx = box.x + breathe, fy = box.y + breathe, fw = box.w - breathe * 2, fh = box.h - breathe * 2;
    frame.style.transform = `translate3d(${fx.toFixed(1)}px,${fy.toFixed(1)}px,0)`;
    frame.style.width = `${fw.toFixed(1)}px`;
    frame.style.height = `${fh.toFixed(1)}px`;
    const arm = P < 1.7 ? Math.max(8, (box.h * 14) / 84) : lerp((B1.h * 14) / 84, 40, c);
    const stroke = P < 1.7 ? Math.max(2, (box.h * 3) / 84) : lerp((B1.h * 3) / 84, 3, c);
    frame.style.setProperty("--arm", `${arm.toFixed(1)}px`);
    frame.style.setProperty("--sw", `${stroke.toFixed(2)}px`);
    frame.style.color = P < 1.7 ? mix(INK, PAPER, a) : mix(PAPER, ORANGE, c);
    frame.style.opacity = String(takeover);
    frame.classList.toggle("is-live", c > 0.95);
    label.style.opacity = String(clamp01((a - 0.5) * 3));

    // the dot: logo position, then the full stop of "yo.", then a progress marker under the viewfinder
    const dl = eio(sw * 1.2 - 0.2);
    const lx = lerp(82, 86, dl), ly = lerp(83, 70, dl);
    const logoDot = { x: gx + lx * k, y: gy + ly * k, r: 5 * k };
    const edgeDot = { x: box.x + box.w * (n > 1 ? q / (n - 1) : 0), y: box.y + box.h + 22, r: 6 };
    const dx = lerp(logoDot.x, edgeDot.x, c), dy = lerp(logoDot.y, edgeDot.y, c), dr = lerp(logoDot.r, edgeDot.r, c);
    dot.style.transform = `translate3d(${dx.toFixed(1)}px,${dy.toFixed(1)}px,0) scale(${(dr / 10).toFixed(3)})`;
    dot.style.opacity = String(takeover);
    dot.style.backgroundColor = mix(PAPER, ORANGE, c);

    // viewfinder media: clipped to the frame; images slide through it
    if (c <= 0) {
      media.style.clipPath = "inset(50%)";
    } else {
      const t = Math.max(0, box.y - B2.y), l = Math.max(0, box.x - B2.x);
      const r = Math.max(0, B2.x + B2.w - (box.x + box.w)), b = Math.max(0, B2.y + B2.h - (box.y + box.h));
      media.style.clipPath = `inset(${t.toFixed(1)}px ${r.toFixed(1)}px ${b.toFixed(1)}px ${l.toFixed(1)}px)`;
    }
    imgs.forEach((img, j) => {
      let clip = 100, ty = 0, sc = 1.2;
      if (j < i) { clip = 0; ty = -12; sc = 1; }
      else if (j === i) { clip = i === 0 ? (1 - c) * 100 : 0; ty = -12 * f; sc = i === 0 ? lerp(1.25, 1, c) : 1; }
      else if (j === i + 1) { clip = (1 - f) * 100; sc = lerp(1.2, 1, f); }
      img.style.clipPath = `inset(${clip.toFixed(2)}% 0 0 0)`;
      img.style.transform = `translate3d(0,${ty.toFixed(2)}%,0) scale(${sc.toFixed(4)})`;
      img.style.visibility = j < i - 1 || j > i + 1 ? "hidden" : "visible";
    });
    names.style.opacity = String(c);
    vfMeta.style.opacity = String(clamp01((c - 0.4) / 0.6));
    vfMeta.classList.toggle("is-live", c > 0.9);
  };

  /* ---------- scroll wiring ---------- */
  const proxy = { p: 0 };
  let st: ScrollTrigger;
  const tween = gsap.to(proxy, {
    p: 1,
    ease: "none",
    onUpdate: () => render(proxy.p * U),
    scrollTrigger: {
      trigger: scene,
      pin,
      start: "top top",
      end: () => `+=${Math.round(U * window.innerHeight)}`,
      scrub: 0.7,
      invalidateOnRefresh: true,
      onRefreshInit: layout,
      onRefresh: () => render(proxy.p * U),
      snap: {
        snapTo: (v) => {
          const P = v * U;
          if (P < START_D - 0.3) return v;
          const idx = Math.max(0, Math.min(n - 1, Math.round((P - START_D) / PER)));
          return (START_D + idx * PER) / U;
        },
        duration: { min: 0.25, max: 0.7 },
        delay: 0.08,
        ease: "power2.inOut",
      },
    },
  });
  st = tween.scrollTrigger!;
  layout();
  render(0);

  const scrollFor = (index: number) => st.start + ((START_D + index * PER) / U) * (st.end - st.start);
  return {
    goTo(index: number) {
      const yPos = scrollFor(index);
      opts.lenis ? opts.lenis.scrollTo(yPos, { duration: 1.6 }) : window.scrollTo({ top: yPos });
    },
    currentImage: () => (active >= 0 ? imgs[active] : null),
  };
}
