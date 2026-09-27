// About, skills, contact and the accessible work index.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, disciplines, contact } from "./data";

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s)!;

export function renderSections() {
  $("[data-work-list]").innerHTML = projects
    .map((p, i) => `<li class="work-item"><a href="/work/${p.slug}" data-index="${i}" data-slug="${p.slug}">
        <img src="/work/${p.slug}-sm.webp" alt="" width="1000" height="625" loading="lazy" decoding="async">
        <b>${p.name}</b><span>${p.kind}, ${p.year}</span></a></li>`)
    .join("");

  $("[data-skills]").innerHTML = disciplines
    .map((d) => `<div class="skill">
        <button class="skill-btn" type="button" aria-expanded="false" aria-controls="skill-${d.id}" id="skill-btn-${d.id}">
          <span class="skill-word">${d.title}<i class="fc fc1"></i><i class="fc fc2"></i><i class="fc fc3"></i><i class="fc fc4"></i></span>
          <span class="skill-toggle" aria-hidden="true">Open</span>
        </button>
        <div class="skill-panel" id="skill-${d.id}" role="region" aria-labelledby="skill-btn-${d.id}"><div>
          <div class="skill-inner"><p>${d.body}</p><ul>${d.tools.map((t) => `<li>${t}</li>`).join("")}</ul></div>
        </div></div>
      </div>`)
    .join("");

  $("[data-email]").textContent = contact.email;
  $<HTMLAnchorElement>("[data-mail]").href = `mailto:${contact.email}?subject=${encodeURIComponent("Project enquiry")}`;
  $("[data-socials]").innerHTML = contact.socials
    .map((s) => `<li><a class="roll" href="${s.url}" target="_blank" rel="noopener"><span data-text="${s.label}">${s.label}</span></a></li>`)
    .join("");
}

export function initSections(opts: { reduceMotion: boolean }) {
  // Skills accordion: one row open at a time.
  const rows = Array.from(document.querySelectorAll<HTMLElement>(".skill"));
  rows.forEach((row) => {
    const btn = $<HTMLButtonElement>(".skill-btn", row);
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      rows.forEach((r) => {
        const b = $<HTMLButtonElement>(".skill-btn", r);
        const on = r === row && open;
        b.setAttribute("aria-expanded", String(on));
        $(".skill-toggle", r).textContent = on ? "Close" : "Open";
        r.classList.toggle("is-open", on);
      });
      window.setTimeout(() => ScrollTrigger.refresh(), 750);
    });
  });

  // "Say yo." The mark in the headline swaps on its own, in step with the favicon.
  const say = $(".say-logo");
  window.setInterval(() => say.classList.toggle("is-latin"), 3600);

  // Touch screens have no hover: tapping the big mark swaps it.
  const aboutLogo = $<HTMLAnchorElement>(".about-logo");
  aboutLogo.addEventListener("click", (e) => { e.preventDefault(); aboutLogo.classList.toggle("is-latin"); });

  // Copy email
  const status = $("[data-copy-status]");
  $("[data-copy]").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(contact.email); status.textContent = "Copied"; }
    catch { status.textContent = contact.email; }
    window.setTimeout(() => (status.textContent = ""), 2400);
  });

  // Nav colour follows the section under it.
  const nav = $(".nav");
  const theme = (fg: string, accent: string) => { nav.style.setProperty("--nav-fg", fg); nav.style.setProperty("--nav-accent", accent); };
  const zones: [string, string, string][] = [
    [".about", "var(--ink)", "var(--orange)"],
    [".skills", "var(--paper)", "var(--orange)"],
    [".contact", "var(--ink)", "var(--paper)"],
  ];
  zones.forEach(([sel, fg, accent]) =>
    ScrollTrigger.create({
      trigger: sel, start: "top 40px", end: "bottom 40px",
      onToggle: (self) => self.isActive && theme(fg, accent),
    }),
  );

  if (opts.reduceMotion) return;
  // Reveals: headings rise line by line; the about mark scales in with its frame.
  gsap.from(".about-logo", { scale: 0.7, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".about", start: "top 70%" } });
  gsap.from(".about-copy > *", { y: 60, opacity: 0, duration: 1.1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: ".about", start: "top 60%" } });
  gsap.from(".skill", { y: 80, opacity: 0, duration: 1.1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".skills", start: "top 70%" } });
  gsap.from(".say > *", { yPercent: 40, opacity: 0, duration: 1.2, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".contact", start: "top 70%" } });
  // The about mark drifts slower than the page: a layer behind the copy.
  gsap.fromTo(".about-mark", { yPercent: 12 }, { yPercent: -12, ease: "none", scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true } });
}
