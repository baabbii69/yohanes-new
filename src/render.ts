// Static, data-driven markup: logos, icons, work grid, filters, footer.
import { projects, categoryLabels, contact, credits, type Category } from "./data";
import { logoSvg } from "./logo";
import arrowUpRight from "@phosphor-icons/core/assets/regular/arrow-up-right.svg?raw";
import arrowLeft from "@phosphor-icons/core/assets/regular/arrow-left.svg?raw";
import arrowRight from "@phosphor-icons/core/assets/regular/arrow-right.svg?raw";
import lockIcon from "@phosphor-icons/core/assets/regular/lock-simple.svg?raw";
import frameIcon from "@phosphor-icons/core/assets/regular/frame-corners.svg?raw";
import handIcon from "@phosphor-icons/core/assets/regular/hand-grabbing.svg?raw";
import arrowsIn from "@phosphor-icons/core/assets/regular/arrows-in.svg?raw";
import sendIcon from "@phosphor-icons/core/assets/regular/paper-plane-tilt.svg?raw";

export const icons: Record<string, string> = {
  "arrow-up-right": arrowUpRight,
  "arrow-left": arrowLeft,
  "arrow-right": arrowRight,
  "lock-simple": lockIcon,
  "frame-corners": frameIcon,
  "hand-grabbing": handIcon,
  "arrows-in": arrowsIn,
  send: sendIcon,
};
export const icon = (name: string) => `<span class="icon" aria-hidden="true">${icons[name] ?? ""}</span>`;
export const img = (base: string, alt: string, size: "sm" | "lg" = "lg", eager = false) =>
  `<img src="/work/${base}${size === "sm" ? "-sm" : ""}.webp" alt="${alt}" width="${size === "sm" ? 800 : 1600}" height="${size === "sm" ? 500 : 1000}" loading="${eager ? "eager" : "lazy"}" decoding="async">`;

const $ = (sel: string) => document.querySelector<HTMLElement>(sel);

function logos() {
  document.querySelectorAll<HTMLElement>("[data-logo]").forEach((el) => (el.innerHTML = logoSvg()));
  document.querySelectorAll<HTMLElement>("[data-icon]").forEach((el) => (el.innerHTML = icon(el.dataset.icon!)));
}

// Grid spans give the index an uneven rhythm: 7/5, 5/7, 6/6.
const spans = ["w7", "w5", "w5", "w7", "", ""];

function grid() {
  const g = $("[data-grid]");
  if (!g) return;
  g.innerHTML = projects
    .map(
      (p, i) => `<a class="tile ${spans[i] ?? ""}" href="/work/${p.slug}" data-slug="${p.slug}" data-cats="${p.categories.join(" ")}" data-layer="Card / ${p.name}">
        <div class="ph">${img(p.images[0], p.name, "lg")}<span class="tile-open">View case ${icon("arrow-right")}</span></div>
        <div class="tile-meta"><h3>${p.name}</h3><span class="yr">${p.year}</span><p>${p.kind}</p></div>
      </a>`,
    )
    .join("");

  const f = $("[data-filters]");
  if (!f) return;
  const cats: (Category | "all")[] = ["all", "web", "mobile", "dashboard", "backend"];
  f.innerHTML = cats
    .map((c) => {
      const n = c === "all" ? projects.length : projects.filter((p) => p.categories.includes(c)).length;
      return `<button type="button" class="chip-btn" data-filter="${c}" aria-pressed="${c === "all"}">${categoryLabels[c]}<span>${n}</span></button>`;
    })
    .join("");
}

function footer() {
  const soc = $("[data-socials]");
  if (soc)
    soc.innerHTML = contact.socials
      .map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label} ${icon("arrow-up-right")}</a></li>`)
      .join("");
  const cr = $("[data-credits]");
  if (cr)
    cr.innerHTML = Object.entries(credits)
      .map(([k, c]) => `<li>${k.replace(/-\d$/, "")}: photo by ${c.author}, <a href="${c.source}" target="_blank" rel="noopener">${c.license}</a>, cropped</li>`)
      .join("");
}

export function renderAll() {
  logos();
  grid();
  footer();
}
