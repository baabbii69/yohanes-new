import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./styles/logo.css";
import "./styles/main.css";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { logoSvg } from "./brand/logo";
import { startFavicon } from "./brand/favicon";
import { initScene, type SceneApi } from "./scene";
import { splitLetters, initHeroType } from "./hero-type";
import { renderSections, initSections } from "./sections";
import { initRouter, openCase, goHome, isCaseOpen } from "./router";

gsap.registerPlugin(ScrollTrigger);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s)!;

/* ---------- markup ---------- */
document.querySelectorAll<HTMLElement>("[data-logo]").forEach((el) => {
  el.innerHTML = logoSvg({ label: el.dataset.logo !== "say" });
});
splitLetters();
renderSections();
startFavicon(reduceMotion);

/* ---------- smooth scroll ---------- */
let lenis: Lenis | null = null;
if (!reduceMotion) {
  lenis = new Lenis({ lerp: 0.09 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- scene or static fallback ---------- */
let scene: SceneApi | null = null;
if (reduceMotion) {
  document.documentElement.classList.add("static");
} else {
  document.documentElement.classList.add("scene-mode");
  scene = initScene({ onOpen: (slug, from) => openCase(slug, from), lenis });
}
const heroType = initHeroType({ reduceMotion });
initSections({ reduceMotion });
initRouter({ lenis, reduceMotion });

/* ---------- links ---------- */
document.addEventListener("click", (e) => {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  const a = (e.target as Element).closest<HTMLAnchorElement>("a[href]");
  if (!a || a.target === "_blank" || a.href.startsWith("mailto:")) return;
  const href = a.getAttribute("href")!;
  if (a.dataset.slug) {
    e.preventDefault();
    openCase(a.dataset.slug, a.querySelector("img"));
  } else if (href === "/" || href === "#top") {
    e.preventDefault();
    goHome("#top");
  } else if (href === "#work") {
    e.preventDefault();
    if (isCaseOpen()) goHome();
    else scene ? scene.goTo(0) : goHome("#work");
  } else if (href.startsWith("#") || href.startsWith("/#")) {
    e.preventDefault();
    goHome(href.replace(/^\//, ""));
  }
});

// Keyboard users tabbing through the hidden work index move the viewfinder to that project.
document.querySelectorAll<HTMLAnchorElement>("[data-work-list] a").forEach((a) =>
  a.addEventListener("focus", () => scene?.goTo(Number(a.dataset.index))),
);

/* ---------- loader: the mark draws itself, then flies into the nav ---------- */
async function runLoader() {
  const loader = $(".loader");
  const mark = $(".loader-mark");
  const count = $("[data-count]");
  const navLogo = $(".nav-logo");
  let quick = false;
  try { quick = sessionStorage.getItem("ya-seen") === "1"; sessionStorage.setItem("ya-seen", "1"); } catch { /* storage blocked */ }
  if (reduceMotion || isCaseOpen()) { loader.classList.add("is-done"); return; }

  lenis?.stop();
  navLogo.style.visibility = "hidden";
  const out = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  const draw = gsap.timeline({ defaults: { ease: "expo.out" } })
    .from(mark.querySelectorAll(".ya-c"), { x: (i) => out[i][0] * 20, y: (i) => out[i][1] * 20, opacity: 0, duration: 1, stagger: 0.05 })
    .from(mark.querySelector(".ya-yo"), { y: 26, opacity: 0, duration: 1 }, 0.15)
    .from(mark.querySelector(".ya-dot"), { scale: 0, transformOrigin: "50% 50%", duration: 0.7, ease: "back.out(3)" }, 0.55)
    .from(mark.querySelector(".ya-label"), { opacity: 0, duration: 0.5 }, 0.7);
  if (quick) draw.timeScale(2.4);
  const counter = { v: 0 };
  const counting = gsap.to(counter, { v: 100, duration: quick ? 0.5 : 1.4, ease: "power2.inOut", onUpdate: () => (count.textContent = String(Math.round(counter.v))) });
  await Promise.all([document.fonts.ready, draw.then(), counting.then()]);

  const from = mark.getBoundingClientRect(), to = navLogo.getBoundingClientRect();
  await gsap.timeline()
    .to(count, { opacity: 0, duration: 0.3 }, 0)
    .to(mark, {
      x: to.left + to.width / 2 - (from.left + from.width / 2),
      y: to.top + to.height / 2 - (from.top + from.height / 2),
      scale: to.width / from.width, duration: 1.1, ease: "expo.inOut",
    }, 0)
    .to(loader, { backgroundColor: "rgba(255,84,16,0)", duration: 0.5, ease: "none" }, 0.75)
    .add(() => heroType.intro(), 0.55)
    .from(".name .row", { yPercent: 30, opacity: 0, duration: 1.2, stagger: 0.08, ease: "expo.out" }, 0.45)
    .from(".hero-meta > *", { y: 24, opacity: 0, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.7)
    .then();
  navLogo.style.visibility = "";
  loader.classList.add("is-done");
  lenis?.start();
  // A first swap in the nav so visitors discover the hover.
  window.setTimeout(() => navLogo.classList.add("is-latin"), 600);
  window.setTimeout(() => navLogo.classList.remove("is-latin"), 2000);
}

runLoader();
window.addEventListener("load", () => ScrollTrigger.refresh());
