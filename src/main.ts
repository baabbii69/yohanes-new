import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/instrument-sans";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./styles/logo.css";
import "./styles/main.css";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { renderAll } from "./render";

gsap.registerPlugin(ScrollTrigger);
renderAll();

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const DESKTOP = "(min-width: 901px) and (prefers-reduced-motion: no-preference)";
const MOTION = "(prefers-reduced-motion: no-preference)";

/* ---------------- smooth scroll ---------------- */
let lenis: Lenis | null = null;
if (!reduceMotion) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(hash: string) {
  const target = hash === "#top" ? 0 : document.querySelector<HTMLElement>(hash);
  if (target === null) return;
  if (lenis) lenis.scrollTo(target as HTMLElement | number, { duration: 1.4 });
  else if (typeof target === "number") window.scrollTo({ top: 0 });
  else target.scrollIntoView();
}

document.addEventListener("click", (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!a || a.getAttribute("href") === "#") return;
  e.preventDefault();
  closeMenu();
  scrollToTarget(a.getAttribute("href")!);
});

/* ---------------- nav + menu ---------------- */
const nav = $(".nav");
const menu = $("#menu");
const menuBtn = $<HTMLButtonElement>(".menu-btn");
function closeMenu() {
  if (menu.hidden) return;
  menu.hidden = true;
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.textContent = "Menu";
  lenis?.start();
}
menuBtn.addEventListener("click", () => {
  if (!menu.hidden) return closeMenu();
  menu.hidden = false;
  menuBtn.setAttribute("aria-expanded", "true");
  menuBtn.textContent = "Close";
  lenis?.stop();
  if (!reduceMotion) gsap.from($$("a", menu), { yPercent: 60, opacity: 0, stagger: 0.05, duration: 0.6, ease: "expo.out" });
});
document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

ScrollTrigger.create({
  start: 80,
  end: "max",
  onToggle: (self) => nav.classList.toggle("is-scrolled", self.isActive),
});

/* ---------------- hero: live frame size ---------------- */
const sizeTag = $("[data-size]");
const updateSize = () => (sizeTag.textContent = `${window.innerWidth} × ${window.innerHeight}`);
updateSize();
window.addEventListener("resize", updateSize, { passive: true });

/* ---------------- skills tabs ---------------- */
const tabs = $$<HTMLButtonElement>(".layer");
function selectTab(tab: HTMLButtonElement, focus = false) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    const panel = document.getElementById(t.getAttribute("aria-controls")!)!;
    const wasHidden = panel.hidden;
    panel.hidden = !on;
    if (on && wasHidden && !reduceMotion) {
      gsap.fromTo(
        [...$$(".panel-copy > *", panel), $(".panel-visual", panel)],
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.7, ease: "expo.out" },
      );
    }
  });
  if (focus) tab.focus();
}
tabs.forEach((t, i) => {
  t.addEventListener("click", () => selectTab(t));
  t.addEventListener("keydown", (e) => {
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    selectTab(tabs[(i + dir + tabs.length) % tabs.length], true);
  });
});

/* ---------------- copy email ---------------- */
const copyBtn = $<HTMLButtonElement>("[data-copy]");
const copyStatus = $(".copy-status");
copyBtn.addEventListener("click", async () => {
  const email = $("[data-email]").textContent ?? "";
  try {
    await navigator.clipboard.writeText(email);
    copyStatus.textContent = "Copied";
  } catch {
    const range = document.createRange();
    range.selectNodeContents($("[data-email]"));
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    copyStatus.textContent = "Selected, press Ctrl+C";
  }
  window.setTimeout(() => (copyStatus.textContent = ""), 2400);
});

/* ---------------- hero canvas geometry ---------------- */
const hero = $(".hero");
const stage = $(".stage");
const canvas = $(".canvas");
const heroBoard = $(".board-hero");
const projBoards = $$(".board-proj");
// Direction each project frame drifts in from, for the layered depth effect.
const drift = [
  [-1, -1], [1, -1], [1, 0.4], [-1, 0.6], [0.2, 1],
];
const START_SCALE = 0.78;
// Labels, handles and the size tag keep their on-screen size while the canvas zooms.
const syncInverse = () => canvas.style.setProperty("--inv", String(1 / (gsap.getProperty(canvas, "scale") as number)));
let bbox = { cx: 0, cy: 0, w: 1, h: 1 };

function layoutCanvas() {
  const W = window.innerWidth;
  const H = stage.clientHeight;
  Object.assign(heroBoard.style, { left: `${-W / 2}px`, top: `${-H / 2}px`, width: `${W}px`, height: `${H}px` });
  const g = W * 0.04;
  const w = W * 0.62;
  const h = w * 0.625;
  const yA = -H / 2 - h * 0.35;
  const yB = -H / 2 - h * 0.6;
  const spots = [
    [-W / 2 - g - w, yA],
    [W / 2 + g, yB],
    [W / 2 + g, yB + h + g],
    [-W / 2 - g - w, yA + h + g],
    [-w / 2 + W * 0.1, H / 2 + g],
  ];
  let minX = -W / 2, maxX = W / 2, minY = -H / 2, maxY = H / 2;
  projBoards.forEach((b, i) => {
    const [x, y] = spots[i % spots.length];
    Object.assign(b.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
    minX = Math.min(minX, x); maxX = Math.max(maxX, x + w);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y + h);
  });
  bbox = { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, w: maxX - minX, h: maxY - minY + 60 };
}
const endScale = () => Math.min((0.92 * window.innerWidth) / bbox.w, (0.84 * stage.clientHeight) / bbox.h);

/* ---------------- scroll choreography ---------------- */
function setupMotion() {
  const mm = gsap.matchMedia();

  // Desktop: the full canvas zoom, docking logo, sticky stack, backend peel.
  mm.add(DESKTOP, () => {
    hero.classList.remove("static-hero");
    layoutCanvas();
    ScrollTrigger.addEventListener("refreshInit", layoutCanvas);

    // Zoom out of the selected home frame to reveal the rest of the canvas.
    const zoom = gsap.timeline({
      scrollTrigger: { trigger: hero, start: "top top", end: "+=170%", pin: true, scrub: 0.8, invalidateOnRefresh: true },
      onUpdate: syncInverse,
    });
    zoom
      .fromTo(canvas, { scale: START_SCALE, x: 0, y: 0 }, {
        scale: endScale,
        x: () => -bbox.cx * endScale(),
        y: () => -bbox.cy * endScale(),
        ease: "power2.inOut",
      }, 0)
      .fromTo(projBoards, {
        x: (i) => drift[i][0] * 60,
        y: (i) => drift[i][1] * 50,
      }, { x: 0, y: 0, ease: "power2.out" }, 0)
      .to(".hero-copy", { yPercent: -8, ease: "none" }, 0)
      .to(".board-hero .handle, .size-tag", { opacity: 0, duration: 0.15 }, 0.3);
    syncInverse();

    // The logo leaves the nav and docks on the left rail for the rest of the page.
    const logo = $(".nav-logo");
    const rail = $(".rail");
    const dockY = () => window.innerHeight / 2 - (logo.getBoundingClientRect().top - (gsap.getProperty(logo, "y") as number)) - 60;
    const dock = ScrollTrigger.create({
      trigger: ".intro",
      start: "top 70%",
      onEnter: () => {
        if (window.innerWidth <= 1100) return;
        const left = logo.getBoundingClientRect().left - (gsap.getProperty(logo, "x") as number);
        gsap.to(logo, { x: 14 - left, y: dockY(), scale: 0.8, transformOrigin: "0 0", duration: 1, ease: "expo.inOut", overwrite: true });
        rail.classList.add("is-on");
      },
      onLeaveBack: () => {
        gsap.to(logo, { x: 0, y: 0, scale: 1, duration: 0.9, ease: "expo.inOut", overwrite: true });
        rail.classList.remove("is-on");
      },
    });
    gsap.to(".rail-fill", { scaleY: 1, ease: "none", scrollTrigger: { trigger: "main", start: "top top", end: "bottom bottom", scrub: true } });

    // Sticky stack: each project frame sinks back as the next one slides over it.
    const cards = $$(".proj");
    cards.forEach((card, i) => {
      const img = $("img", card);
      gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
      if (i === cards.length - 1) return;
      gsap.to($(".proj-frame", card), {
        scale: 0.9, opacity: 0.3, ease: "none",
        scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top top", scrub: true },
      });
    });

    // Backend: the interface layer lifts away and the code underneath lights up line by line.
    const peel = gsap.timeline({
      scrollTrigger: { trigger: ".backend", start: "top top", end: "+=140%", pin: true, scrub: 0.8 },
    });
    peel
      .fromTo(".surface-layer", { y: 0, rotateX: 0, scale: 1 }, { yPercent: -86, rotateX: 24, scale: 0.84, opacity: 0, ease: "power2.in", duration: 1 })
      .fromTo(".code-layer .ln", { opacity: 0.25 }, { opacity: 1, stagger: 0.06, duration: 0.3, ease: "none" }, 0.45)
      .from(".nda", { y: 30, opacity: 0, duration: 0.4 }, 0.8);

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", layoutCanvas);
      dock.kill();
      gsap.set(logo, { clearProps: "transform" });
      rail.classList.remove("is-on");
      hero.classList.add("static-hero");
    };
  });

  // Any size with motion allowed: statement reveal and ambient parallax.
  mm.add(MOTION, () => {
    const words = $$(".intro-text .w");
    gsap.to(words, {
      opacity: 1, stagger: 0.1, ease: "none",
      scrollTrigger: { trigger: ".intro-text", start: "top 82%", end: "bottom 50%", scrub: true },
    });
    gsap.fromTo(".intro-mark", { yPercent: -10, rotate: -8 }, {
      yPercent: 10, rotate: 4, ease: "none",
      scrollTrigger: { trigger: ".intro", start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.fromTo(".contact-mark", { yPercent: 18 }, {
      yPercent: -6, ease: "none",
      scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom bottom", scrub: true },
    });
    gsap.from(".contact-title, .contact-sub, .contact-actions, .socials", {
      y: 50, opacity: 0, stagger: 0.08, duration: 1, ease: "expo.out",
      scrollTrigger: { trigger: ".contact", start: "top 70%" },
    });
    gsap.from(".work-head > *, .skills-title", {
      y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: "expo.out",
      scrollTrigger: { trigger: ".work-head", start: "top 85%" },
    });
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    document.documentElement.classList.add("no-motion");
    return () => document.documentElement.classList.remove("no-motion");
  });
}

/* ---------------- loader, then hero intro ---------------- */
function heroIntro() {
  if (reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.from(".hero-title .line > span", { yPercent: 115, duration: 1.2, stagger: 0.1 })
    .from(".hero-sub, .hero-ctas", { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.25)
    .from(".board-hero .handle, .size-tag, .board-hero .board-label", { opacity: 0, scale: 0.4, duration: 0.6, stagger: 0.04 }, 0.35)
    .from(".board-proj", { opacity: 0, duration: 1.2, stagger: 0.08, ease: "power2.out" }, 0.2);
}

function teachLogoSwap() {
  // Play the ዮ → yo. swap once so visitors discover the hover.
  const logo = $(".nav-logo");
  window.setTimeout(() => logo.classList.add("is-latin"), 500);
  window.setTimeout(() => logo.classList.remove("is-latin"), 1900);
}

async function runLoader() {
  const loader = $(".loader");
  const mark = $(".loader-mark");
  const count = $("[data-count]");
  const navLogo = $(".nav-logo");
  const quick = sessionStorage.getItem("ya-seen") === "1";
  try { sessionStorage.setItem("ya-seen", "1"); } catch { /* storage blocked: always play the full intro */ }

  if (reduceMotion) {
    loader.classList.add("is-done");
    return;
  }

  lenis?.stop();
  gsap.set(navLogo, { opacity: 0 });
  const corners = $$(".ya-c", mark);
  const out = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
  intro
    .from(corners, { x: (i) => out[i][0] * 18, y: (i) => out[i][1] * 18, opacity: 0, duration: 0.9, stagger: 0.04 })
    .from($(".ya-yo", mark), { y: 22, opacity: 0, duration: 0.9 }, 0.15)
    .from($(".ya-dot", mark), { scale: 0, transformOrigin: "50% 50%", duration: 0.6, ease: "back.out(3)" }, 0.5);
  if (quick) intro.timeScale(2.2);

  const counter = { v: 0 };
  const countTween = gsap.to(counter, {
    v: 100, duration: quick ? 0.5 : 1.3, ease: "power2.inOut",
    onUpdate: () => (count.textContent = String(Math.round(counter.v))),
  });

  await Promise.all([document.fonts.ready, intro.then(), countTween.then()]);

  // Fly the loader mark into the nav slot, then hand over to the real logo.
  const from = mark.getBoundingClientRect();
  const to = navLogo.getBoundingClientRect();
  await gsap
    .timeline()
    .to(mark, {
      x: to.left + to.width / 2 - (from.left + from.width / 2),
      y: to.top + to.height / 2 - (from.top + from.height / 2),
      scale: to.width / from.width,
      duration: 1,
      ease: "expo.inOut",
    })
    .to(loader, { backgroundColor: "rgba(20,18,16,0)", duration: 0.7, ease: "power2.inOut" }, 0.25)
    .to(".loader-count", { opacity: 0, duration: 0.3 }, 0)
    .add(heroIntro, 0.35)
    .then();

  gsap.set(navLogo, { opacity: 1 });
  loader.classList.add("is-done");
  lenis?.start();
  teachLogoSwap();
}

hero.classList.add("static-hero");
setupMotion();
runLoader();
window.addEventListener("load", () => ScrollTrigger.refresh());
