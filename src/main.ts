import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/instrument-sans";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./styles/logo.css";
import "./styles/main.css";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import Lenis from "lenis";
import { renderAll } from "./render";
import { initCanvas } from "./canvas";
import { initPlayground } from "./playground";
import { initApi } from "./api";
import { initBrief } from "./brief";
import { initRouter, openCase, goHome } from "./router";

gsap.registerPlugin(ScrollTrigger, Flip);

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

renderAll();

/* ---------------- smooth scroll ---------------- */
let lenis: Lenis | null = null;
if (!reduceMotion) {
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------------- interactive sections ---------------- */
initCanvas({ reduceMotion, onOpen: (slug, from) => openCase(slug, from) });
initPlayground();
initApi(reduceMotion);
initBrief();
initRouter({ lenis, reduceMotion });

/* ---------------- links: sections, case studies, home ---------------- */
document.addEventListener("click", (e) => {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  const a = (e.target as Element).closest<HTMLAnchorElement>("a[href]");
  if (!a || a.target === "_blank") return;
  const href = a.getAttribute("href")!;
  if (href.startsWith("#") || href.startsWith("/#")) {
    e.preventDefault();
    closeMenu();
    goHome(href.replace(/^\//, ""));
  } else if (href === "/") {
    e.preventDefault();
    closeMenu();
    goHome("#top");
  } else if (href.startsWith("/work/") && a.classList.contains("tile")) {
    e.preventDefault();
    openCase(a.dataset.slug!, $(".ph", a));
  }
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
ScrollTrigger.create({ start: 60, end: "max", onToggle: (self) => nav.classList.toggle("is-scrolled", self.isActive) });

/* ---------------- Outline view: press O or use the nav toggle ---------------- */
const outlineBtn = $<HTMLButtonElement>("[data-outline]");
function setOutline(on: boolean) {
  document.documentElement.classList.toggle("outline", on);
  outlineBtn.setAttribute("aria-pressed", String(on));
}
outlineBtn.addEventListener("click", () => setOutline(!document.documentElement.classList.contains("outline")));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeMenu(); setOutline(false); }
  const typing = (e.target as Element).closest("input, textarea, select, [contenteditable]");
  if (!typing && !e.metaKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === "o") setOutline(!document.documentElement.classList.contains("outline"));
});

/* ---------------- work filters (Flip between layouts) ---------------- */
const tiles = $$(".tile");
$$<HTMLButtonElement>("[data-filter]").forEach((btn) =>
  btn.addEventListener("click", () => {
    const f = btn.dataset.filter!;
    $$<HTMLButtonElement>("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    const state = Flip.getState(tiles);
    tiles.forEach((t) => t.classList.toggle("is-hidden", f !== "all" && !t.dataset.cats!.split(" ").includes(f)));
    if (reduceMotion) return;
    Flip.from(state, {
      duration: 0.7, ease: "expo.inOut", absolute: true, scale: false,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.2 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.3 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }),
);

/* ---------------- scroll motion (lightweight: reveals only) ---------------- */
function setupScroll() {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // The hero panel slides away as the canvas scrolls out.
    gsap.to(".hero-panel", { yPercent: 18, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    $$(".sec-head, .work-head, .contact-head").forEach((el) =>
      gsap.from(el.children, { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%" } }),
    );
    ScrollTrigger.batch(".tile", {
      start: "top 90%",
      once: true,
      onEnter: (els) => gsap.from(els, { y: 60, opacity: 0, stagger: 0.08, duration: 1, ease: "expo.out" }),
    });
    $$(".play-ui, .api-ui, .brief").forEach((el) =>
      gsap.from(el, { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } }),
    );
  });

  // Desktop: the logo leaves the nav and docks on the left edge, with a scroll progress rail.
  mm.add("(min-width: 1181px) and (prefers-reduced-motion: no-preference)", () => {
    const logo = $(".nav-logo");
    const rail = $(".rail");
    const dock = ScrollTrigger.create({
      trigger: "#work", start: "top 70%", endTrigger: "#home", end: "bottom top",
      onToggle: (self) => {
        if (self.isActive && !$("#home").hidden) {
          const r = logo.getBoundingClientRect();
          const left = r.left - (gsap.getProperty(logo, "x") as number);
          const top = r.top - (gsap.getProperty(logo, "y") as number);
          gsap.to(logo, { x: 14 - left, y: window.innerHeight / 2 - top - 60, scale: 0.8, transformOrigin: "0 0", duration: 1, ease: "expo.inOut", overwrite: true });
          rail.classList.add("is-on");
        } else {
          gsap.to(logo, { x: 0, y: 0, scale: 1, duration: 0.9, ease: "expo.inOut", overwrite: true });
          rail.classList.remove("is-on");
        }
      },
    });
    gsap.to(".rail-fill", { scaleY: 1, ease: "none", scrollTrigger: { trigger: "#home", start: "top top", end: "bottom bottom", scrub: true } });
    return () => { dock.kill(); gsap.set(logo, { clearProps: "transform" }); rail.classList.remove("is-on"); };
  });
}

/* ---------------- loader, then hero intro ---------------- */
function heroIntro() {
  if (reduceMotion) return;
  gsap.timeline({ defaults: { ease: "expo.out" } })
    .from(".hero-title .line > span", { yPercent: 115, duration: 1.2, stagger: 0.1 })
    .from(".hero-sub, .hero-ctas, .toolbar", { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.2)
    .from(".layer-d > *", { opacity: 0, scale: 0.92, duration: 1.2, stagger: { each: 0.04, from: "random" } }, 0);
}

async function runLoader() {
  const loader = $(".loader");
  const mark = $(".loader-mark");
  const count = $("[data-count]");
  const navLogo = $(".nav-logo");
  let quick = false;
  try { quick = sessionStorage.getItem("ya-seen") === "1"; sessionStorage.setItem("ya-seen", "1"); } catch { /* storage blocked */ }
  if (reduceMotion || !$("#case").hidden) { loader.classList.add("is-done"); return; }

  lenis?.stop();
  gsap.set(navLogo, { opacity: 0 });
  const out = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  const intro = gsap.timeline({ defaults: { ease: "expo.out" } })
    .from($$(".ya-c", mark), { x: (i) => out[i][0] * 18, y: (i) => out[i][1] * 18, opacity: 0, duration: 0.9, stagger: 0.04 })
    .from($(".ya-yo", mark), { y: 22, opacity: 0, duration: 0.9 }, 0.15)
    .from($(".ya-dot", mark), { scale: 0, transformOrigin: "50% 50%", duration: 0.6, ease: "back.out(3)" }, 0.5);
  if (quick) intro.timeScale(2.2);
  const counter = { v: 0 };
  const countTween = gsap.to(counter, { v: 100, duration: quick ? 0.5 : 1.3, ease: "power2.inOut", onUpdate: () => (count.textContent = String(Math.round(counter.v))) });
  await Promise.all([document.fonts.ready, intro.then(), countTween.then()]);

  const from = mark.getBoundingClientRect();
  const to = navLogo.getBoundingClientRect();
  await gsap.timeline()
    .to(mark, { x: to.left + to.width / 2 - (from.left + from.width / 2), y: to.top + to.height / 2 - (from.top + from.height / 2), scale: to.width / from.width, duration: 1, ease: "expo.inOut" })
    .to(loader, { backgroundColor: "rgba(236,235,231,0)", duration: 0.7, ease: "power2.inOut" }, 0.25)
    .to(".loader-count", { opacity: 0, duration: 0.3 }, 0)
    .add(heroIntro, 0.3)
    .then();
  gsap.set(navLogo, { opacity: 1 });
  loader.classList.add("is-done");
  lenis?.start();
  window.setTimeout(() => navLogo.classList.add("is-latin"), 500);
  window.setTimeout(() => navLogo.classList.remove("is-latin"), 1900);
}

setupScroll();
runLoader();
window.addEventListener("load", () => ScrollTrigger.refresh());
