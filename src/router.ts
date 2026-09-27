// Case study pages at /work/:slug. The clicked image grows into the case study hero (shared-element transition).
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";
import { projects, type Project } from "./data";
import { icon, img } from "./render";

const home = document.getElementById("home")!;
const caseEl = document.getElementById("case")!;
const baseTitle = document.title;
let homeScroll = 0;
let lenis: Lenis | null = null;
let reduce = false;
// How many case pages were pushed since leaving the home page (0 = landed directly on a case URL).
let depth = 0;

const slugFromPath = (path = location.pathname) => path.match(/^\/work\/([\w-]+)\/?$/)?.[1] ?? null;

function caseHtml(p: Project) {
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];
  const [hero, ...rest] = p.images;
  return `
    <div class="case-top">
      <a class="back" href="/#work" data-back>${icon("arrow-left")}All work</a>
      <span class="case-crumb">Work / ${p.name}</span>
    </div>
    <h1 class="case-title">${p.name}</h1>
    <div class="case-hero ph" data-case-hero>${img(hero, `${p.name}, ${p.kind.toLowerCase()}`, "lg", true)}</div>
    <dl class="case-meta" data-reveal>
      <div><dt>Project</dt><dd>${p.kind}</dd></div>
      <div><dt>Role</dt><dd>${p.role}</dd></div>
      <div><dt>Year</dt><dd>${p.year}</dd></div>
      <div><dt>${p.url ? "Live site" : "Services"}</dt><dd>${
        p.url ? `<a href="${p.url}" target="_blank" rel="noopener">${p.url.replace(/^https?:\/\//, "")}</a>` : p.services.join(", ")
      }</dd></div>
    </dl>
    <div class="case-body" data-reveal>
      <p class="case-lede">${p.summary}</p>
      <div class="case-block"><h3>The problem</h3><p>${p.challenge}</p></div>
      <div class="case-block"><h3>What I did</h3><p>${p.approach}</p><p>${p.outcome}</p></div>
    </div>
    ${rest.length ? `<div class="case-gallery" data-reveal>${rest.map((b) => `<div class="ph">${img(b, `${p.name}, detail`)}</div>`).join("")}</div>` : ""}
    ${p.imageNote ? `<p class="case-note">${p.imageNote}</p>` : ""}
    <a class="case-next" href="/work/${next.slug}" data-next="${next.slug}">
      <div><span>Next project</span><b>${next.name}</b></div>
      <div class="ph">${img(next.images[0], next.name, "sm")}</div>
    </a>`;
}

function showCase(p: Project, from?: HTMLElement) {
  if (!home.hidden) homeScroll = window.scrollY;
  caseEl.innerHTML = caseHtml(p);
  document.title = `${p.name}, ${baseTitle}`;
  const heroEl = caseEl.querySelector<HTMLElement>("[data-case-hero]")!;

  // Start the clone before swapping views so it covers the change.
  let clone: HTMLElement | null = null;
  if (from && !reduce) {
    const r = from.getBoundingClientRect();
    const src = from.querySelector("img")?.getAttribute("src") ?? `/work/${p.images[0]}-sm.webp`;
    clone = document.createElement("div");
    clone.className = "flip-clone";
    clone.innerHTML = `<img src="${src}" alt="">`;
    Object.assign(clone.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    document.body.appendChild(clone);
  }

  home.hidden = true;
  caseEl.hidden = false;
  lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0);
  ScrollTrigger.refresh();
  caseEl.focus({ preventScroll: true });

  if (reduce) return;
  const tl = gsap.timeline();
  tl.from(caseEl.querySelectorAll(".case-top, .case-title"), { y: 40, opacity: 0, duration: 0.9, stagger: 0.06, ease: "expo.out" }, 0.1);
  if (clone) {
    const t = heroEl.getBoundingClientRect();
    gsap.set(heroEl, { opacity: 0 });
    tl.to(clone, { left: t.left, top: t.top, width: t.width, height: t.height, duration: 0.95, ease: "expo.inOut" }, 0)
      .set(heroEl, { opacity: 1 })
      .add(() => clone!.remove());
  } else {
    tl.from(heroEl, { opacity: 0, y: 40, duration: 0.9, ease: "expo.out" }, 0.15);
  }
  caseEl.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) =>
    gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } }),
  );
}

function showHome(scrollTo?: string) {
  if (home.hidden) {
    caseEl.hidden = true;
    caseEl.innerHTML = "";
    home.hidden = false;
    document.title = baseTitle;
    ScrollTrigger.refresh();
    const y = scrollTo ? document.querySelector<HTMLElement>(scrollTo) : homeScroll;
    if (lenis) lenis.scrollTo(y ?? 0, { immediate: true, force: true });
    else if (typeof y === "number") window.scrollTo(0, y);
    else y?.scrollIntoView();
    if (!reduce) gsap.from(home, { opacity: 0, duration: 0.5, ease: "power2.out" });
  } else if (scrollTo) {
    const t = document.querySelector<HTMLElement>(scrollTo);
    if (t) lenis ? lenis.scrollTo(t, { duration: 1.3 }) : t.scrollIntoView();
  }
}

export function openCase(slug: string, from?: HTMLElement) {
  const p = projects.find((q) => q.slug === slug);
  if (!p) return;
  depth = home.hidden ? (depth ? depth + 1 : 0) : 1;
  history.pushState({ slug }, "", `/work/${slug}`);
  showCase(p, from);
}

export function goHome(hash?: string) {
  if (!home.hidden) return showHome(hash);
  depth = 0;
  history.pushState({}, "", hash ? `/${hash}` : "/");
  showHome(hash);
}

export function initRouter(opts: { lenis: Lenis | null; reduceMotion: boolean }) {
  lenis = opts.lenis;
  reduce = opts.reduceMotion;

  caseEl.addEventListener("click", (e) => {
    const t = e.target as Element;
    const back = t.closest("[data-back]");
    if (back) {
      e.preventDefault();
      if (depth > 0) history.go(-depth);
      else goHome("#work");
      depth = 0;
      return;
    }
    const next = t.closest<HTMLElement>("[data-next]");
    if (next) {
      e.preventDefault();
      openCase(next.dataset.next!, next.querySelector<HTMLElement>(".ph")!);
    }
  });

  window.addEventListener("popstate", () => {
    const slug = slugFromPath();
    const p = slug && projects.find((q) => q.slug === slug);
    if (p) { depth = Math.max(0, depth - 1); showCase(p); }
    else { depth = 0; showHome(location.hash || undefined); }
  });

  const initial = slugFromPath();
  const p = initial && projects.find((q) => q.slug === initial);
  if (p) showCase(p);
  else if (initial) history.replaceState({}, "", "/");
}
