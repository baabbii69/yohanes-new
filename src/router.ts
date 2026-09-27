// Case studies at /work/:slug. The image in the viewfinder grows into the case study cover.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";
import { projects, type Project } from "./data";

const home = document.getElementById("home")!;
const caseEl = document.getElementById("case")!;
const nav = document.querySelector<HTMLElement>(".nav")!;
const baseTitle = document.title;
let lenis: Lenis | null = null;
let reduce = false;
let homeScroll = 0;
let depth = 0; // case pages pushed since leaving home

const slugFromPath = () => location.pathname.match(/^\/work\/([\w-]+)\/?$/)?.[1] ?? null;
const lines = (text: string) => text.split(" ").reduce<string[]>((acc, w) => {
  // two words per line at most, so long names stack like a poster
  const last = acc[acc.length - 1];
  if (last && last.split(" ").length < 2 && (last + w).length < 14) acc[acc.length - 1] = `${last} ${w}`;
  else acc.push(w);
  return acc;
}, []);

function html(p: Project) {
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  return `
    <div class="case-top"><a class="case-back roll" href="/#work" data-back><span data-text="Back to work">Back to work</span></a><span>${p.kind}</span></div>
    <h1 class="case-title">${lines(p.name).map((l) => `<span class="line"><span>${l}</span></span>`).join("")}</h1>
    <div class="case-cover" data-cover>
      <i class="fc fc1"></i><i class="fc fc2"></i><i class="fc fc3"></i><i class="fc fc4"></i>
      <img src="/work/${p.slug}.webp" alt="${p.name} cover" width="2000" height="1250" decoding="async">
    </div>
    <dl class="case-meta" data-reveal>
      <div><dt>Role</dt><dd>${p.role}</dd></div>
      <div><dt>Year</dt><dd>${p.year}</dd></div>
      <div><dt>Tools</dt><dd>${p.tools.join(", ")}</dd></div>
      <div><dt>${p.url ? "Live site" : "Status"}</dt><dd>${p.url ? `<a href="${p.url}" target="_blank" rel="noopener">${p.url.replace(/^https?:\/\//, "")}</a>` : "Case study in progress"}</dd></div>
    </dl>
    <p class="case-lede" data-reveal>${p.summary}</p>
    <div class="case-cols" data-reveal>
      <div><h3>The problem</h3><p>${p.problem}</p></div>
      <div><h3>What I did</h3><p>${p.approach}</p></div>
      <div><h3>The result</h3><p>${p.result}</p></div>
    </div>
    <a class="case-next" href="/work/${next.slug}" data-next="${next.slug}"><small>Next project</small><b>${next.short}</b></a>`;
}

function show(p: Project, from?: HTMLElement | null) {
  if (!home.hidden) homeScroll = window.scrollY;
  let clone: HTMLElement | null = null;
  if (from && !reduce) {
    const r = from.getBoundingClientRect();
    const vis = r.width > 0 && r.height > 0;
    if (vis) {
      clone = document.createElement("div");
      clone.className = "flip-clone";
      clone.innerHTML = `<img src="/work/${p.slug}.webp" alt="">`;
      Object.assign(clone.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
      document.body.appendChild(clone);
    }
  }
  caseEl.innerHTML = html(p);
  home.hidden = true;
  caseEl.hidden = false;
  document.title = `${p.name}, ${baseTitle}`;
  nav.style.setProperty("--nav-fg", "var(--paper)");
  nav.style.setProperty("--nav-accent", "var(--orange)");
  (document.querySelector(".nav-logo") as HTMLElement).style.opacity = "";
  lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0);
  ScrollTrigger.refresh();
  caseEl.focus({ preventScroll: true });
  if (reduce) return;

  const img = caseEl.querySelector<HTMLElement>("[data-cover] img")!;
  const tl = gsap.timeline();
  tl.from(caseEl.querySelectorAll(".case-title .line > span"), { yPercent: 110, duration: 1.1, stagger: 0.08, ease: "expo.out" }, 0.15)
    .from(caseEl.querySelectorAll(".case-cover .fc"), { opacity: 0, scale: 0.4, duration: 0.8, stagger: 0.05, ease: "expo.out" }, 0.6);
  if (clone) {
    const t = img.getBoundingClientRect();
    gsap.set(img, { opacity: 0 });
    tl.to(clone, { left: t.left, top: t.top, width: t.width, height: t.height, duration: 1.05, ease: "expo.inOut" }, 0)
      .set(img, { opacity: 1 })
      .add(() => clone!.remove());
  } else {
    tl.from(img, { clipPath: "inset(100% 0 0 0)", duration: 1.2, ease: "expo.inOut" }, 0.1);
  }
  caseEl.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) =>
    gsap.from(el, { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } }),
  );
}

function showHome(hash?: string) {
  if (!home.hidden) {
    const t = hash && document.querySelector<HTMLElement>(hash);
    if (t) lenis ? lenis.scrollTo(t, { duration: 1.4 }) : t.scrollIntoView();
    else if (hash === "#top") lenis ? lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo(0, 0);
    return;
  }
  caseEl.hidden = true;
  caseEl.innerHTML = "";
  home.hidden = false;
  document.title = baseTitle;
  ScrollTrigger.refresh();
  const t = hash && hash !== "#top" ? document.querySelector<HTMLElement>(hash) : null;
  const yPos = t ? t.getBoundingClientRect().top + window.scrollY : hash === "#top" ? 0 : homeScroll;
  lenis ? lenis.scrollTo(yPos, { immediate: true, force: true }) : window.scrollTo(0, yPos);
  ScrollTrigger.update();
  if (!reduce) gsap.from(home, { opacity: 0, duration: 0.6, ease: "power2.out" });
}

export function openCase(slug: string, from?: HTMLElement | null) {
  const p = projects.find((q) => q.slug === slug);
  if (!p) return;
  depth = home.hidden ? depth + 1 : 1;
  history.pushState({ slug }, "", `/work/${slug}`);
  show(p, from);
}

export function goHome(hash?: string) {
  if (!home.hidden) return showHome(hash);
  if (depth > 0 && !hash) { history.go(-depth); depth = 0; return; }
  depth = 0;
  history.pushState({}, "", hash && hash !== "#top" ? `/${hash}` : "/");
  showHome(hash);
}

export function initRouter(opts: { lenis: Lenis | null; reduceMotion: boolean }) {
  lenis = opts.lenis;
  reduce = opts.reduceMotion;
  caseEl.addEventListener("click", (e) => {
    const t = e.target as Element;
    if (t.closest("[data-back]")) { e.preventDefault(); goHome(); return; }
    const next = t.closest<HTMLElement>("[data-next]");
    if (next) { e.preventDefault(); openCase(next.dataset.next!); }
  });
  window.addEventListener("popstate", () => {
    const slug = slugFromPath();
    const p = slug ? projects.find((q) => q.slug === slug) : undefined;
    if (p) { depth = Math.max(0, depth - 1); show(p); }
    else { depth = 0; showHome(location.hash || undefined); }
  });
  const slug = slugFromPath();
  const p = slug ? projects.find((q) => q.slug === slug) : undefined;
  if (p) show(p);
  else if (slug) history.replaceState({}, "", "/");
}

export const isCaseOpen = () => !caseEl.hidden;
