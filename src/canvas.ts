// Hero: a draggable design canvas. Frames sit on depth layers that move at different
// rates when you drag, move the mouse or scroll, so the canvas reads as stacked layers.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "./data";
import { img } from "./render";

interface Item { base?: string; slug?: string; note?: string; title?: string; x: number; y: number; w: number; d: number; }

// x, y, w in vw units relative to the canvas centre (scaled by --u on small screens). d = depth (lower = further away).
const items: Item[] = [
  // visible on load (the intro panel covers the lower left)
  { base: "hawi-1", slug: "hawi", x: 6, y: -27, w: 27, d: 1 },
  { base: "auction-1", slug: "auction", x: 35, y: -19, w: 15, d: 0.8 },
  { base: "cows-1", slug: "cowsville", x: 12, y: 3, w: 18, d: 0.55 },
  { base: "harambee-1", slug: "harambee", x: 34, y: 6, w: 14, d: 1 },
  { base: "fiker-1", slug: "fiker", x: -44, y: -31, w: 15, d: 0.8 },
  { base: "opsa-1", slug: "opsa", x: -24, y: -30, w: 11, d: 0.55 },
  // further out, found by dragging
  { base: "hawi-2", slug: "hawi", x: -84, y: -4, w: 24, d: 1 },
  { base: "auction-2", slug: "auction", x: 60, y: 24, w: 18, d: 0.55 },
  { base: "harambee-2", slug: "harambee", x: 58, y: -44, w: 20, d: 1 },
  { base: "opsa-2", slug: "opsa", x: -70, y: 34, w: 18, d: 0.8 },
  { base: "fiker-2", slug: "fiker", x: -34, y: -66, w: 18, d: 1 },
  { base: "cows-2", slug: "cowsville", x: 18, y: -66, w: 20, d: 0.8 },
  { base: "hawi-3", slug: "hawi", x: -100, y: -52, w: 22, d: 0.8 },
  { note: "Auction Ethiopia: the countdown and current bid stay visible on every lot.", title: "Comment", x: 53, y: -8, w: 0, d: 1.2 },
  { note: "Cowsville: vets and inseminators share one timeline per cow.", title: "Comment", x: 16, y: 18, w: 0, d: 1.2 },
];

export function initCanvas(opts: { reduceMotion: boolean; onOpen: (slug: string, from: HTMLElement) => void }) {
  const viewport = document.querySelector<HTMLElement>("[data-viewport]")!;
  const world = document.querySelector<HTMLElement>("[data-world]")!;
  const depths = [...new Set(items.map((i) => i.d))].sort();
  const layers = new Map<number, HTMLElement>();
  depths.forEach((d) => {
    const el = document.createElement("div");
    el.className = "layer-d";
    world.appendChild(el);
    layers.set(d, el);
  });

  items.forEach((it) => {
    const layer = layers.get(it.d)!;
    if (it.note) {
      const n = document.createElement("div");
      n.className = "frame-note";
      n.dataset.layer = "Comment";
      n.innerHTML = `<b>${it.title}</b>${it.note}`;
      Object.assign(n.style, { left: `calc(${it.x}vw * var(--u))`, top: `calc(${it.y + 4}vw * var(--u))` });
      layer.appendChild(n);
      return;
    }
    const p = projects.find((q) => q.slug === it.slug)!;
    const a = document.createElement("a");
    a.className = "frame";
    a.href = `/work/${p.slug}`;
    a.dataset.slug = p.slug;
    a.draggable = false;
    a.innerHTML = `<span class="frame-label">${p.name}</span><div class="ph">${img(it.base!, p.name, "sm", it.d >= 1)}</div>`;
    Object.assign(a.style, {
      left: `calc(${it.x}vw * var(--u))`, top: `calc(${it.y + 4}vw * var(--u))`,
      width: `calc(${it.w}vw * var(--u))`, height: `calc(${it.w * 0.625}vw * var(--u))`,
    });
    layer.appendChild(a);
  });

  // pan = where the user dragged to; cur = eased value actually rendered
  const pan = { x: 0, y: 0 }, cur = { x: 0, y: 0 }, vel = { x: 0, y: 0 };
  const mouse = { x: 0, y: 0 }, mcur = { x: 0, y: 0 };
  let scrollOff = 0;
  let dragging = false, moved = 0, last = { x: 0, y: 0, t: 0 };
  let downFrame: HTMLElement | null = null;
  const limit = () => ({ x: window.innerWidth * 0.9, y: window.innerHeight * 0.75 });
  const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

  viewport.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    dragging = true; moved = 0;
    downFrame = (e.target as Element).closest<HTMLElement>(".frame");
    last = { x: e.clientX, y: e.clientY, t: performance.now() };
    vel.x = vel.y = 0;
    viewport.setPointerCapture(e.pointerId);
    viewport.classList.add("is-dragging");
  });
  viewport.addEventListener("pointermove", (e) => {
    const r = viewport.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) / r.width - 0.5;
    mouse.y = (e.clientY - r.top) / r.height - 0.5;
    if (!dragging) return;
    const now = performance.now();
    const dx = e.clientX - last.x, dy = e.clientY - last.y;
    moved += Math.abs(dx) + Math.abs(dy);
    const L = limit();
    pan.x = clamp(pan.x + dx, L.x);
    pan.y = clamp(pan.y + dy, L.y);
    const dt = Math.max(1, now - last.t);
    vel.x = (dx / dt) * 16; vel.y = (dy / dt) * 16;
    last = { x: e.clientX, y: e.clientY, t: now };
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove("is-dragging");
  };
  viewport.addEventListener("pointerup", () => {
    // Pointer capture retargets the click, so a tap on a frame is detected here.
    if (dragging && downFrame && moved <= 6) opts.onOpen(downFrame.dataset.slug!, downFrame.querySelector(".ph")!);
    downFrame = null;
    end();
  });
  viewport.addEventListener("pointercancel", end);

  // Mouse and touch open frames on pointerup; this handles keyboard activation (Enter).
  world.addEventListener("click", (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>(".frame");
    if (!a) return;
    e.preventDefault();
    if (e.detail === 0) opts.onOpen(a.dataset.slug!, a.querySelector(".ph")!);
  });
  // Keyboard users: bring a focused frame to the middle of the screen.
  world.addEventListener("focusin", (e) => {
    const a = (e.target as Element).closest<HTMLElement>(".frame");
    if (!a) return;
    const r = a.getBoundingClientRect(), v = viewport.getBoundingClientRect();
    const L = limit();
    pan.x = clamp(pan.x + (v.left + v.width / 2 - (r.left + r.width / 2)), L.x);
    pan.y = clamp(pan.y + (v.top + v.height / 2 - (r.top + r.height / 2)), L.y);
  });

  document.querySelector("[data-reset]")?.addEventListener("click", () => {
    pan.x = pan.y = 0; vel.x = vel.y = 0;
  });

  ScrollTrigger.create({
    trigger: ".hero", start: "top top", end: "bottom top",
    onUpdate: (self) => (scrollOff = self.progress * window.innerHeight),
  });

  const ease = opts.reduceMotion ? 1 : 0.12;
  const layerEls = [...layers.entries()];
  const tick = () => {
    if (!dragging && !opts.reduceMotion) {
      // inertia after release
      const L = limit();
      pan.x = clamp(pan.x + vel.x, L.x); pan.y = clamp(pan.y + vel.y, L.y);
      vel.x *= 0.92; vel.y *= 0.92;
    }
    cur.x += (pan.x - cur.x) * ease; cur.y += (pan.y - cur.y) * ease;
    mcur.x += (mouse.x - mcur.x) * 0.06; mcur.y += (mouse.y - mcur.y) * 0.06;
    for (const [d, el] of layerEls) {
      const par = opts.reduceMotion ? 0 : (d - 0.8) * 60;
      const x = cur.x * d - mcur.x * par;
      const y = cur.y * d - mcur.y * par - scrollOff * (d - 0.35);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
    viewport.style.backgroundPosition = `${(cur.x * 0.8).toFixed(1)}px ${(cur.y * 0.8 - scrollOff * 0.45).toFixed(1)}px`;
  };

  // Only animate while the hero is on screen.
  let running = false;
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !running) { gsap.ticker.add(tick); running = true; }
    else if (!entry.isIntersecting && running) { gsap.ticker.remove(tick); running = false; }
  });
  io.observe(viewport);
}
