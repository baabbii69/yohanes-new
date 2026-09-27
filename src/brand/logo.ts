// Inline SVG for the Frame + ዮ mark, built from the outlined brand paths.
// Class names (.ya-c, .ya-yo, .ya-y, .ya-o, .ya-dot) are what logo.css and the scroll scene animate.
import { YO, Y, O, LABEL } from "./paths";

export const CORNERS = ["M18 32V18H32", "M88 18H102V32", "M18 88V102H32", "M88 102H102V88"];
let count = 0;

export function logoSvg(opts: { label?: boolean; corners?: boolean } = {}): string {
  const id = `ya-clip-${++count}`;
  const label = opts.label === false ? "" : `<path class="ya-label" d="${LABEL}" fill="currentColor" fill-opacity=".55"/>`;
  const corners =
    opts.corners === false
      ? ""
      : CORNERS.map((d, i) => `<path class="ya-c ya-c${i + 1}" d="${d}" fill="none" stroke="currentColor" stroke-width="3"/>`).join("");
  return (
    `<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">` +
    `<defs><clipPath id="${id}"><rect x="20" y="21" width="80" height="80"/></clipPath></defs>` +
    label +
    corners +
    `<g clip-path="url(#${id})"><path class="ya-yo" d="${YO}" fill="currentColor"/>` +
    `<path class="ya-y" d="${Y}" fill="currentColor"/><path class="ya-o" d="${O}" fill="currentColor"/></g>` +
    `<circle class="ya-dot" cx="82" cy="83" r="5" fill="var(--ya-accent, #ff5410)"/></svg>`
  );
}
