// Design-token playground: controls change a live component and the CSS that describes it.

const radii = { sharp: 0, soft: 14, round: 28 } as const;
type Radius = keyof typeof radii;

interface State { radius: Radius; space: number; theme: "light" | "dark"; motion: "on" | "off"; }

function tokenLines(s: State): { key: string; html: string }[] {
  const surface = s.theme === "light" ? "#f7f6f3" : "#1f1d1a";
  const text = s.theme === "light" ? "#151412" : "#f1efec";
  const sel = (t: string) => `<span class="f">${t}</span>`;
  const v = (t: string) => `<span class="s">${t}</span>`;
  return [
    { key: "c", html: `<span class="c">/* generated from the design file */</span>` },
    { key: "root", html: `${sel(":root")} {` },
    { key: "radius", html: `  --radius: ${v(`${radii[s.radius]}px`)};` },
    { key: "space", html: `  --space: ${v(`${s.space}px`)};` },
    { key: "theme", html: `  --surface: ${v(surface)};` },
    { key: "theme2", html: `  --text: ${v(text)};` },
    { key: "accent", html: `  --accent: ${v("#ff5b14")};` },
    { key: "motion", html: `  --motion: ${v(s.motion === "on" ? "200ms" : "0ms")};` },
    { key: "close1", html: `}` },
    { key: "b1", html: `` },
    { key: "card", html: `${sel(".card")} {` },
    { key: "card2", html: `  border-radius: var(--radius);` },
    { key: "card3", html: `  padding: var(--space);` },
    { key: "card4", html: `  background: var(--surface);` },
    { key: "close2", html: `}` },
    { key: "b2", html: `` },
    { key: "btn", html: `${sel(".button:hover")} {` },
    { key: "btn2", html: `  transform: translateY(${s.motion === "on" ? v("-2px") : v("0")});` },
    { key: "btn3", html: `  transition: transform var(--motion);` },
    { key: "close3", html: `}` },
  ];
}

const changedKeys: Record<keyof State, string[]> = {
  radius: ["radius"],
  space: ["space"],
  theme: ["theme", "theme2"],
  motion: ["motion", "btn2"],
};

export function initPlayground() {
  const root = document.querySelector<HTMLElement>("[data-play]");
  if (!root) return;
  const state: State = { radius: "sharp", space: 20, theme: "light", motion: "on" };

  const seg = (name: string, opts: [string, string][], checked: string) =>
    `<div class="seg">${opts
      .map(([val, label]) => `<label><input type="radio" name="${name}" value="${val}" ${val === checked ? "checked" : ""}>${label}</label>`)
      .join("")}</div>`;

  root.innerHTML = `
    <form class="controls" data-layer="Panel / Tokens">
      <fieldset class="ctrl"><legend>Corner radius</legend>${seg("radius", [["sharp", "Sharp"], ["soft", "Soft"], ["round", "Round"]], state.radius)}</fieldset>
      <div class="ctrl">
        <label for="pg-space">Spacing</label>
        <input class="range" id="pg-space" name="space" type="range" min="12" max="32" step="2" value="${state.space}">
        <div class="range-row"><span>Compact</span><span data-space-out>${state.space}px</span><span>Roomy</span></div>
      </div>
      <fieldset class="ctrl"><legend>Theme</legend>${seg("theme", [["light", "Light"], ["dark", "Dark"]], state.theme)}</fieldset>
      <fieldset class="ctrl"><legend>Hover motion</legend>${seg("motion", [["on", "On"], ["off", "Off"]], state.motion)}</fieldset>
    </form>
    <div class="preview" data-layer="Preview">
      <div class="kit" aria-label="Example payment card">
        <div class="kit-top"><b>Semester fee</b><span>Due 12 Oct</span></div>
        <div class="kit-amount">12,850<small>ETB</small></div>
        <div class="kit-field">Student ID<span>HU/2291/24</span></div>
        <div class="kit-row">Harambee University<b>Year 2</b></div>
        <button type="button" class="kit-btn">Pay with telebirr</button>
      </div>
    </div>
    <div class="code-out" data-layer="Code"><span class="file">tokens.css</span><pre class="code" aria-live="polite"></pre></div>`;

  const form = root.querySelector<HTMLFormElement>(".controls")!;
  const kit = root.querySelector<HTMLElement>(".kit")!;
  const preview = root.querySelector<HTMLElement>(".preview")!;
  const pre = root.querySelector<HTMLElement>(".code")!;
  const spaceOut = root.querySelector<HTMLElement>("[data-space-out]")!;

  const render = (flash: string[] = []) => {
    kit.style.setProperty("--k-radius", `${radii[state.radius]}px`);
    kit.style.setProperty("--k-pad", `${state.space}px`);
    kit.dataset.theme = state.theme;
    kit.dataset.motion = state.motion;
    preview.dataset.theme = state.theme === "dark" ? "dark" : "light";
    spaceOut.textContent = `${state.space}px`;
    pre.innerHTML = tokenLines(state)
      .map((l) => `<span class="ln${flash.includes(l.key) ? " flash" : ""}">${l.html}</span>`)
      .join("\n");
  };

  form.addEventListener("submit", (e) => e.preventDefault());
  form.addEventListener("input", (e) => {
    const t = e.target as HTMLInputElement;
    const key = t.name as keyof State;
    if (key === "space") state.space = Number(t.value);
    else (state as unknown as Record<string, string>)[key] = t.value;
    render(changedKeys[key]);
  });
  render();
}
