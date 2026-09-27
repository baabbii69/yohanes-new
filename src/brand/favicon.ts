// Animated favicon: the tab icon rolls from ዮ to "yo." and back every few seconds.
// Drawn on a small canvas with the same outlined paths as the logo.
import { FAV_YO, FAV_Y, FAV_O, FAV_LATIN_DOT } from "./paths";

const HOLD = 4000; // ms each state stays still
const DURATION = 700; // ms per transition
const SIZE = 64;

const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function startFavicon(reduceMotion: boolean) {
  const link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const g = canvas.getContext("2d");
  if (!link || !g || typeof Path2D === "undefined") return;

  const yo = new Path2D(FAV_YO), y = new Path2D(FAV_Y), o = new Path2D(FAV_O);
  const dark = window.matchMedia("(prefers-color-scheme: dark)");
  const draw = (t: number) => {
    const ink = dark.matches ? "#f1efea" : "#0c0b0a";
    g.setTransform(SIZE / 120, 0, 0, SIZE / 120, 0, 0);
    g.clearRect(0, 0, 120, 120);
    // corners pull in slightly mid-transition, like the hover animation
    const pull = Math.sin(Math.PI * Math.min(1, Math.max(0, t))) * 5;
    g.strokeStyle = ink; g.lineWidth = 9; g.lineCap = "butt";
    g.beginPath();
    g.moveTo(8 + pull, 30 + pull); g.lineTo(8 + pull, 8 + pull); g.lineTo(30 + pull, 8 + pull);
    g.moveTo(90 - pull, 8 + pull); g.lineTo(112 - pull, 8 + pull); g.lineTo(112 - pull, 30 + pull);
    g.moveTo(8 + pull, 90 - pull); g.lineTo(8 + pull, 112 - pull); g.lineTo(30 + pull, 112 - pull);
    g.moveTo(90 - pull, 112 - pull); g.lineTo(112 - pull, 112 - pull); g.lineTo(112 - pull, 90 - pull);
    g.stroke();
    g.save();
    g.beginPath(); g.rect(13, 13, 94, 94); g.clip();
    g.fillStyle = ink;
    const out = ease(t * 1.3), iny = ease(t * 1.3 - 0.15), ino = ease(t * 1.3 - 0.3);
    g.save(); g.translate(0, -100 * out); g.fill(yo); g.restore();
    g.save(); g.translate(0, 100 * (1 - iny)); g.fill(y); g.restore();
    g.save(); g.translate(0, 100 * (1 - ino)); g.fill(o); g.restore();
    g.restore();
    const d = ease(t * 1.2 - 0.2);
    const dx = 93 + (FAV_LATIN_DOT[0] - 93) * d, dy = 89 + (FAV_LATIN_DOT[1] - 89) * d;
    g.fillStyle = dark.matches ? "#ff7a3d" : "#ff5410";
    g.beginPath(); g.arc(dx, dy, 8, 0, Math.PI * 2); g.fill();
    link.href = canvas.toDataURL("image/png");
  };

  let latin = false;
  draw(0);
  const cycle = () => {
    const from = latin ? 1 : 0, to = latin ? 0 : 1;
    latin = !latin;
    if (reduceMotion) { draw(to); window.setTimeout(cycle, HOLD + 1000); return; }
    const start = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - start) / DURATION);
      draw(from + (to - from) * k);
      if (k < 1) window.setTimeout(step, 33);
      else window.setTimeout(cycle, HOLD);
    };
    step();
  };
  window.setTimeout(cycle, HOLD);
  dark.addEventListener?.("change", () => draw(latin ? 1 : 0));
}
