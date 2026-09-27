// Builds the data-driven parts of the page from src/data.ts.
import { projects, skills, contact } from "./data";
import { logoSvg } from "./logo";
import arrowUpRight from "@phosphor-icons/core/assets/regular/arrow-up-right.svg?raw";
import copyIcon from "@phosphor-icons/core/assets/regular/copy.svg?raw";
import lockIcon from "@phosphor-icons/core/assets/regular/lock-simple.svg?raw";
import frameIcon from "@phosphor-icons/core/assets/regular/frame-corners.svg?raw";
import databaseIcon from "@phosphor-icons/core/assets/regular/database.svg?raw";
import diamondIcon from "@phosphor-icons/core/assets/regular/diamond.svg?raw";
import eyeIcon from "@phosphor-icons/core/assets/regular/eye.svg?raw";

export const icons: Record<string, string> = {
  "arrow-up-right": arrowUpRight,
  copy: copyIcon,
  "lock-simple": lockIcon,
};
const icon = (svg: string) => `<span class="icon" aria-hidden="true">${svg}</span>`;
const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel);

function logos() {
  document.querySelectorAll<HTMLElement>("[data-logo]").forEach((el) => (el.innerHTML = logoSvg()));
  const introMark = $("[data-logo-static]");
  if (introMark) introMark.innerHTML = logoSvg();
  const contactMark = $("[data-logo-contact]");
  if (contactMark) contactMark.innerHTML = `<span class="ya-logo" tabindex="-1">${logoSvg()}</span>`;
  document.querySelectorAll<HTMLElement>("[data-icon]").forEach((el) => {
    el.innerHTML = icon(icons[el.dataset.icon!] ?? "");
  });
}

function boards() {
  const wrap = $("[data-boards]");
  if (!wrap) return;
  wrap.innerHTML = projects
    .map(
      (p) => `<a class="board board-proj" href="#proj-${p.slug}" aria-label="${p.name}" tabindex="-1">
        <span class="board-label">${p.name}</span>
        <img src="${p.coverSmall}" alt="" width="800" height="500" loading="eager" decoding="async">
      </a>`,
    )
    .join("");
}

function projectCards() {
  const wrap = $("[data-projects]");
  if (!wrap) return;
  wrap.innerHTML = projects
    .map(
      (p) => `<article class="proj" id="proj-${p.slug}">
        <div class="proj-frame" style="--pc:${p.color}">
          <header class="proj-bar"><span class="sw"></span><b>${p.name}</b><span>${p.kind}</span><span class="yr">${p.year}</span></header>
          <div class="proj-body">
            <div class="proj-media"><img src="${p.cover}" alt="${p.name}, ${p.kind.toLowerCase()}" width="1600" height="1000" loading="lazy" decoding="async"></div>
            <div class="proj-info">
              <h3>${p.name}</h3>
              <span class="proj-kind">${p.kind}</span>
              <p>${p.summary}</p>
              <dl class="proj-meta">
                <dt>Role</dt><dd>${p.role}</dd>
                <dt>Tools</dt><dd>${p.stack.join(", ")}</dd>
              </dl>
              ${
                p.url
                  ? `<a class="proj-link" href="${p.url}" target="_blank" rel="noopener">Visit site ${icon(arrowUpRight)}</a>`
                  : `<span class="proj-soon">Case study coming soon</span>`
              }
            </div>
          </div>
        </div>
      </article>`,
    )
    .join("");
}

const layerIcons = { design: frameIcon, frontend: diamondIcon, backend: databaseIcon };

function skillPanels() {
  const tabs = $("[data-layers]");
  const panels = $("[data-panels]");
  if (!tabs || !panels) return;
  tabs.innerHTML =
    `<div class="layers-head">Layers</div>` +
    skills
      .map(
        (s, i) => `<button class="layer" role="tab" id="tab-${s.id}" aria-controls="panel-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
          ${icon(layerIcons[s.id])}<span>${s.layer}</span><span class="eye">${icon(eyeIcon)}</span>
        </button>
        <div class="sublayers" aria-hidden="true">${s.items.slice(0, 3).map((it) => `<span>${it}</span>`).join("")}</div>`,
      )
      .join("");

  const visuals: Record<string, string> = {
    design: `<div class="spec" aria-hidden="true">
        <div class="spec-aa">Aa<small>Bricolage Grotesque, 800</small></div>
        <div class="spec-sw"><i></i><i></i><i></i><i></i></div>
        <div class="spec-btns"><span class="btn btn-primary">Primary</span><span class="btn btn-ghost">Secondary</span></div>
      </div>`,
    frontend: `<div class="demo">
        <a class="ya-logo" href="#top" aria-label="Logo animation demo, back to top">${logoSvg()}</a>
        <p>Hover the logo. This is the real component from the nav: transforms and opacity only, 0.7 seconds.</p>
      </div>`,
    backend: `<pre class="code" aria-label="Django REST Framework serializer example"><span class="k">class</span> <span class="f">CowSerializer</span>(serializers.ModelSerializer):
    herd = serializers.SlugRelatedField(
        slug_field=<span class="s">"code"</span>, read_only=<span class="k">True</span>)
    days_to_calving = serializers.SerializerMethodField()

    <span class="k">class</span> <span class="f">Meta</span>:
        model = Cow
        fields = [<span class="s">"tag"</span>, <span class="s">"name"</span>, <span class="s">"breed"</span>,
                  <span class="s">"status"</span>, <span class="s">"herd"</span>, <span class="s">"days_to_calving"</span>]

    <span class="k">def</span> <span class="f">get_days_to_calving</span>(self, cow):
        <span class="k">return</span> cow.expected_calving.days_left()</pre>`,
  };

  panels.innerHTML = skills
    .map(
      (s, i) => `<div class="panel" role="tabpanel" id="panel-${s.id}" aria-labelledby="tab-${s.id}" ${i === 0 ? "" : "hidden"}>
        <div class="panel-copy">
          <h3>${s.title}</h3>
          <p>${s.body}</p>
          <ul class="tags">${s.items.map((it) => `<li>${it}</li>`).join("")}</ul>
        </div>
        <div class="panel-visual">${visuals[s.id]}</div>
      </div>`,
    )
    .join("");
}

function backend() {
  const surface = $("[data-surface]");
  const code = $("[data-code]");
  if (surface) {
    // Sample herd data for the Cowsville demo screen.
    const rows = [
      ["ET-0412", "Bereket", "Boran", `<span class="chip preg">Pregnant</span>`, "Calving 14 Nov"],
      ["ET-0388", "Almaz", "Holstein cross", `<span class="chip heat">In heat</span>`, "AI visit today"],
      ["ET-0431", "Chaltu", "Boran", `<span class="chip">Healthy</span>`, "Weighed 2 Oct"],
      ["ET-0405", "Genet", "Fogera", `<span class="chip">Vet check</span>`, "Dr. Tigist, Thu"],
    ];
    surface.innerHTML = `
      <div class="sf-top"><h3>Bishoftu Dairy, Herd A</h3><span>Cowsville</span></div>
      <div class="sf-stats"><div><b>46</b><span>Cows</span></div><div><b>9</b><span>Pregnant</span></div><div><b>3</b><span>Visits this week</span></div></div>
      <table class="sf-table"><thead><tr><th>Tag</th><th>Name</th><th>Breed</th><th>Status</th><th>Next</th></tr></thead>
      <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>
      <div class="sf-foot">Sample data</div>`;
  }
  if (code) {
    const lines = [
      `<span class="k">class</span> <span class="f">CowViewSet</span>(viewsets.ModelViewSet):`,
      `    serializer_class = CowSerializer`,
      `    permission_classes = [IsFarmMember]`,
      `    filterset_fields = [<span class="s">"status"</span>, <span class="s">"breed"</span>, <span class="s">"herd"</span>]`,
      ``,
      `    <span class="k">def</span> <span class="f">get_queryset</span>(self):`,
      `        <span class="k">return</span> (Cow.objects`,
      `            .filter(herd__farm=self.request.user.farm)`,
      `            .select_related(<span class="s">"herd"</span>, <span class="s">"assigned_vet"</span>)`,
      `            .prefetch_related(<span class="s">"inseminations"</span>))`,
      ``,
      `<span class="c"># GET /api/cows/?status=pregnant</span>`,
      `{ <span class="s">"tag"</span>: <span class="s">"ET-0412"</span>, <span class="s">"name"</span>: <span class="s">"Bereket"</span>, <span class="s">"breed"</span>: <span class="s">"Boran"</span>,`,
      `  <span class="s">"status"</span>: <span class="s">"pregnant"</span>, <span class="s">"expected_calving"</span>: <span class="s">"2026-11-14"</span> }`,
    ];
    code.innerHTML = `<div class="code-file">cows/views.py</div>
      <pre class="code" aria-label="Cowsville API code">${lines.map((l) => `<span class="ln">${l || " "}</span>`).join("")}</pre>`;
  }
}

function contactBlock() {
  const email = contact.email;
  const mail = $<HTMLAnchorElement>("[data-mailto]");
  if (mail) mail.href = `mailto:${email}?subject=${encodeURIComponent("New project")}`;
  const e = $("[data-email]");
  if (e) e.textContent = email;
  const soc = $("[data-socials]");
  if (soc)
    soc.innerHTML = contact.socials
      .map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label} ${icon(arrowUpRight)}</a></li>`)
      .join("");
}

function introWords() {
  const p = $("[data-words]");
  if (!p) return;
  const highlight = new Set(["Figma,", "motion", "Django"]);
  p.innerHTML = p.textContent!
    .trim()
    .split(/\s+/)
    .map((w) => `<span class="w${highlight.has(w) ? " hl" : ""}">${w}</span>`)
    .join(" ");
}

export function renderAll() {
  logos();
  boards();
  projectCards();
  skillPanels();
  backend();
  contactBlock();
  introWords();
}
