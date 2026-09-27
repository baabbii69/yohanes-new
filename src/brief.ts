// Contact: a small brief builder that writes the email for the visitor.
import { contact } from "./data";
import { icon } from "./render";

const needs = ["Website", "Mobile app", "Dashboard", "Backend or API", "Logo and branding"];
const budgets = ["Under $1k", "$1k to $5k", "$5k and up", "Not sure yet"]; // TODO: set your own ranges
const timelines = ["As soon as possible", "1 to 3 months", "Flexible"];

const list = (items: string[]) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

export function initBrief() {
  const form = document.querySelector<HTMLFormElement>("[data-brief]");
  if (!form) return;
  const pick = (type: "checkbox" | "radio", name: string, values: string[], checked?: string) =>
    `<div class="picks">${values
      .map((v) => `<label class="pick"><input type="${type}" name="${name}" value="${v}" ${v === checked ? "checked" : ""}><span>${v}</span></label>`)
      .join("")}</div>`;

  form.innerHTML = `
    <fieldset aria-describedby="need-error"><legend>What do you need?</legend>${pick("checkbox", "need", needs)}
      <p class="help" id="need-error" data-need-error hidden>Pick at least one thing so I know where to start.</p>
    </fieldset>
    <fieldset><legend>Budget</legend>${pick("radio", "budget", budgets, "Not sure yet")}</fieldset>
    <fieldset><legend>Timeline</legend>${pick("radio", "timeline", timelines, "Flexible")}</fieldset>
    <div class="field">
      <label class="lbl" for="brief-name">Your name</label>
      <input type="text" id="brief-name" name="name" autocomplete="name" placeholder="Selam Tesfaye">
    </div>
    <div class="field">
      <label class="lbl" for="brief-msg">About the project</label>
      <textarea id="brief-msg" name="message" rows="4" placeholder="What are you building, and who is it for?"></textarea>
      <p class="help">Optional. A few sentences is plenty.</p>
    </div>
    <div class="brief-out">
      <p class="brief-summary" data-summary aria-live="polite"></p>
      <button class="btn btn-primary" type="submit">Start a project ${icon("send")}</button>
      <p class="brief-alt">
        <span data-sent>Prefer your own email app? Write to ${contact.email}</span>
        <button class="copy" type="button" data-copy>Copy address</button>
        <span class="copy-status" role="status" data-copy-status></span>
      </p>
    </div>`;

  const summary = form.querySelector<HTMLElement>("[data-summary]")!;
  const needError = form.querySelector<HTMLElement>("[data-need-error]")!;
  const read = () => {
    const fd = new FormData(form);
    return {
      needs: fd.getAll("need") as string[],
      budget: String(fd.get("budget") ?? ""),
      timeline: String(fd.get("timeline") ?? ""),
      name: String(fd.get("name") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };
  };
  const update = () => {
    const b = read();
    if (b.needs.length) needError.hidden = true;
    summary.innerHTML = b.needs.length
      ? `Your brief: <b>${list(b.needs).toLowerCase()}</b>, budget <b>${b.budget.toLowerCase()}</b>, timeline <b>${b.timeline.toLowerCase()}</b>.`
      : "Pick what you need and your brief appears here.";
  };
  form.addEventListener("input", update);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const b = read();
    if (!b.needs.length) {
      needError.hidden = false;
      form.querySelector<HTMLInputElement>('input[name="need"]')?.focus();
      return;
    }
    const body = [
      `Hi Yohanes,`,
      ``,
      `I need: ${list(b.needs)}`,
      `Budget: ${b.budget}`,
      `Timeline: ${b.timeline}`,
      ``,
      b.message || "(Tell me a bit about the project here.)",
      ``,
      b.name ? `Thanks,\n${b.name}` : `Thanks`,
    ].join("\n");
    const subject = `New project: ${list(b.needs)}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    form.querySelector<HTMLElement>("[data-sent]")!.textContent = `Your email app should open with the brief. If it didn't, write to ${contact.email}`;
  });

  const status = form.querySelector<HTMLElement>("[data-copy-status]")!;
  form.querySelector("[data-copy]")!.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      status.textContent = "Copied";
    } catch {
      status.textContent = contact.email;
    }
    window.setTimeout(() => (status.textContent = ""), 2400);
  });
  update();
}
