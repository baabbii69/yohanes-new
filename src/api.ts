// Cowsville API demo: filters build a real-looking request, the JSON it returns and the screen it feeds.
// All data here is sample data, filtered in the browser.
import { gsap } from "gsap";

type Status = "pregnant" | "in_heat" | "healthy" | "vet_check";
interface Cow { tag: string; name: string; breed: string; herd: "A" | "B"; status: Status; next: string; }

const cows: Cow[] = [
  { tag: "ET-0412", name: "Bereket", breed: "Boran", herd: "A", status: "pregnant", next: "Calving 14 Nov" },
  { tag: "ET-0388", name: "Almaz", breed: "Holstein cross", herd: "A", status: "in_heat", next: "AI visit today" },
  { tag: "ET-0431", name: "Chaltu", breed: "Boran", herd: "A", status: "healthy", next: "Weighing 2 Oct" },
  { tag: "ET-0405", name: "Genet", breed: "Fogera", herd: "A", status: "vet_check", next: "Dr. Tigist, Thu" },
  { tag: "ET-0457", name: "Ayantu", breed: "Boran", herd: "B", status: "pregnant", next: "Calving 3 Dec" },
  { tag: "ET-0460", name: "Tsion", breed: "Holstein cross", herd: "B", status: "healthy", next: "Milk test Fri" },
  { tag: "ET-0472", name: "Hawi", breed: "Arsi", herd: "B", status: "in_heat", next: "AI visit tomorrow" },
  { tag: "ET-0479", name: "Meron", breed: "Fogera", herd: "B", status: "pregnant", next: "Scan 20 Oct" },
];

const statusLabel: Record<Status, string> = { pregnant: "Pregnant", in_heat: "In heat", healthy: "Healthy", vet_check: "Vet check" };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const k = (s: string) => `<span class="s">"${esc(s)}"</span>`;

function jsonHtml(list: Cow[]) {
  const rows = list.map(
    (c) => `    {\n      ${k("tag")}: ${k(c.tag)},\n      ${k("name")}: ${k(c.name)},\n      ${k("breed")}: ${k(c.breed)},\n      ${k("herd")}: ${k(c.herd)},\n      ${k("status")}: ${k(c.status)}\n    }`,
  );
  return `{\n  ${k("count")}: <span class="k">${list.length}</span>,\n  ${k("results")}: [${rows.length ? "\n" + rows.join(",\n") + "\n  " : ""}]\n}`;
}

export function initApi(reduceMotion: boolean) {
  const root = document.querySelector<HTMLElement>("[data-api]");
  if (!root) return;
  const state = { status: "all" as Status | "all", herd: "all" as "all" | "A" | "B" };

  const seg = (name: string, opts: [string, string][], checked: string) =>
    `<div class="seg">${opts
      .map(([v, l]) => `<label><input type="radio" name="${name}" value="${v}" ${v === checked ? "checked" : ""}>${l}</label>`)
      .join("")}</div>`;

  root.innerHTML = `
    <form class="api-bar" data-layer="Filters">
      <fieldset class="ctrl" style="border:0;padding:0;margin:0"><legend>status</legend>${seg("status", [["all", "All"], ["pregnant", "Pregnant"], ["in_heat", "In heat"], ["vet_check", "Vet check"]], "all")}</fieldset>
      <fieldset class="ctrl" style="border:0;padding:0;margin:0"><legend>herd</legend>${seg("herd", [["all", "All"], ["A", "A"], ["B", "B"]], "all")}</fieldset>
      <div class="req" aria-live="polite"><b>GET</b><span data-url></span><span class="ms" data-ms></span></div>
    </form>
    <div class="api-json" data-layer="Response"><pre class="code" data-json></pre></div>
    <div class="api-screen" data-layer="Screen / Herd">
      <h3>Bishoftu Dairy</h3>
      <table class="herd"><thead><tr><th>Tag</th><th>Name</th><th>Breed</th><th>Status</th><th>Next</th></tr></thead><tbody data-rows></tbody></table>
      <p class="empty" data-empty hidden>No cows match this filter.</p>
    </div>`;

  const form = root.querySelector<HTMLFormElement>("form")!;
  const url = root.querySelector<HTMLElement>("[data-url]")!;
  const ms = root.querySelector<HTMLElement>("[data-ms]")!;
  const json = root.querySelector<HTMLElement>("[data-json]")!;
  const rows = root.querySelector<HTMLElement>("[data-rows]")!;
  const empty = root.querySelector<HTMLElement>("[data-empty]")!;

  const render = () => {
    const list = cows.filter((c) => (state.status === "all" || c.status === state.status) && (state.herd === "all" || c.herd === state.herd));
    const q = [state.status !== "all" && `status=${state.status}`, state.herd !== "all" && `herd=${state.herd}`].filter(Boolean).join("&");
    url.textContent = `/api/cows/${q ? "?" + q : ""}`;
    ms.textContent = `200 OK, ${Math.round(38 + Math.random() * 40)} ms (simulated)`;
    json.innerHTML = jsonHtml(list);
    rows.innerHTML = list
      .map((c) => `<tr><td>${c.tag}</td><td>${c.name}</td><td>${c.breed}</td><td><span class="status ${c.status}">${statusLabel[c.status]}</span></td><td>${c.next}</td></tr>`)
      .join("");
    empty.hidden = list.length > 0;
    if (!reduceMotion) {
      gsap.fromTo(rows.children, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: "power3.out" });
      gsap.fromTo(json, { opacity: 0.2 }, { opacity: 1, duration: 0.4 });
    }
  };

  form.addEventListener("submit", (e) => e.preventDefault());
  form.addEventListener("input", (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name === "status") state.status = t.value as Status | "all";
    if (t.name === "herd") state.herd = t.value as "all" | "A" | "B";
    render();
  });
  render();
}
