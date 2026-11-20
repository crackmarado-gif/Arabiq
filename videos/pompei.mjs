// Pompéi, 5 secondes, format TikTok (1080x1920). Rendu pixel art avec pixelfx, encodé par ffmpeg.
// Usage : node videos/pompei.mjs   ->   videos/pompei.mp4
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createFrame, clearFrame, createFx, composite, painterFor, hex } from "../vendor/pixelfx/src/core/index.js";
import * as bigExplosion from "../vendor/pixelfx/src/fx/explosions/big-explosion.js";
import * as meteor from "../vendor/pixelfx/src/fx/fire/meteor.js";

const W = 180, H = 320, SCALE = 6, FPS = 30, SECONDS = 5;
const GROUND = 252, ERUPT = 2.0;
const out = fileURLToPath(new URL("./pompei.mp4", import.meta.url));

const C = {
  skyTop: hex("#2b2d6e"), skyLow: hex("#f39a6b"), skyRedTop: hex("#1a0d14"), skyRedLow: hex("#7a2416"),
  mountain: hex("#4a3a4f"), mountainHi: hex("#5e4a5c"), ground: hex("#3b2f2a"), road: hex("#5a4636"),
  wall: hex("#e6c9a0"), roof: hex("#b4472f"), white: hex("#ffffff"), ink: hex("#141020"),
  yellow: hex("#ffd166"), band: hex("#0f0f1a"), smoke: hex("#9a8f9e"),
};
const mix = (a, b, k) => {
  const ch = (s) => Math.round(((a >> s) & 255) * (1 - k) + ((b >> s) & 255) * k);
  return (255 << 24 | ch(16) << 16 | ch(8) << 8 | ch(0)) >>> 0;
};
const clamp01 = (x) => Math.max(0, Math.min(1, x));

// a Roman in a toga: calm, then very much not calm
const ROMAN = [
  "...hhh...", "..hhhhh..", "..sesse..", "..sssss..", "..ssmss..", "...sss...", "..wwwww..",
  ".swwrwws.", ".swwwrws.", "..wwwwr..", "..wwwww..", "..wwwww..", "...s.s...", "..bb.bb..",
];
const ROMAN_SHOCK = [
  "s..hhh..s", "s.hhhhh.s", "s.eesee.s", ".ssssss..", "..sooss..", "..wsss...", "..wwwww..",
  "..wwrww..", "..wwwrw..", "..wwwwr..", "..wwwww..", "..wwwww..", "...s.s...", "..bb.bb..",
];
const PAL = { h: "#2a1a10", s: "#f0b88a", e: "#141020", m: "#9a4a3a", o: "#141020", w: "#f4f1e8", r: "#c0392b", b: "#6b4226" };

const HOUSES = [[62, 14, 12], [80, 18, 16], [104, 12, 10], [120, 20, 14], [146, 14, 12], [164, 16, 10]];

function background(p, t) {
  const red = clamp01((t - ERUPT) / 1.2);
  for (let y = 0; y < GROUND; y++) {
    const k = y / GROUND;
    const c = mix(mix(C.skyTop, C.skyLow, k), mix(C.skyRedTop, C.skyRedLow, k), red);
    p.rect(0, y, W, 1, c);
  }
  // Vesuvius
  p.poly([[30, GROUND], [108, 168], [134, 168], [180, GROUND]], C.mountain);
  p.poly([[108, 168], [118, 168], [70, 220], [58, 220]], C.mountainHi);
  // town
  p.rect(0, GROUND, W, H - GROUND, C.ground);
  p.rect(0, GROUND + 6, W, 4, C.road);
  for (const [x, w, h] of HOUSES) {
    p.rect(x, GROUND - h, w, h, C.wall);
    p.rect(x - 1, GROUND - h - 3, w + 2, 3, C.roof);
    p.rect(x + w / 2 - 1, GROUND - 5, 3, 5, C.ink);
  }
  // a lazy little smoke wisp before it all goes wrong
  if (t < ERUPT + 0.3) {
    for (let i = 0; i < 4; i++) {
      const age = (t * 0.6 + i / 4) % 1;
      p.disc(121 + Math.sin(age * 6 + i) * 3, 166 - age * 30, 2 + age * 4, C.smoke, 0.55 * (1 - age));
    }
  }
}

function bubble(p, lines, x, y, w) {
  const h = lines.length * 10 + 6;
  p.rect(x - 1, y - 1, w + 2, h + 2, C.ink);
  p.rect(x, y, w, h, C.white);
  p.tri(x + 8, y + h, x + 16, y + h, x + 6, y + h + 7, C.white);
  lines.forEach((s, i) => p.text(s, x + w / 2, y + 4 + i * 10, C.ink, { font: "big", align: "center" }));
}

function overlay(p, t) {
  p.text("POMPEI", W / 2, 18, C.yellow, { font: "big", scale: 3, align: "center", shadow: C.ink });
  p.text("AN 79", W / 2, 46, C.white, { font: "big", scale: 2, align: "center", shadow: C.ink });

  const shocked = t > ERUPT + 0.25;
  const jump = shocked && t < ERUPT + 0.6 ? -4 : 0;
  p.sprite(shocked ? ROMAN_SHOCK : ROMAN, PAL, 16, GROUND - 28 + jump, { scale: 2 });

  if (t > 0.35 && t < ERUPT) bubble(p, ["T'INQUIETE,", "IL DORT."], 8, 182, 82);
  if (shocked && t < 3.6 && Math.floor(t * 8) % 2 === 0) p.text("!!", 25, GROUND - 42, C.white, { font: "big", scale: 2, align: "center", outline: C.ink });

  if (t > 3.4) {
    const k = clamp01((t - 3.4) / 0.25);
    p.rect(0, 266, W, 50, C.band, 0.85 * k);
    p.text("SPOILER :", W / 2, 272, C.yellow, { font: "big", scale: 2, align: "center", a: k });
    p.text("IL DORMAIT PAS.", W / 2, 294, C.white, { font: "big", scale: 2, align: "center", a: k });
  }
}

const frame = createFrame(W, H);
const rgba = new Uint8ClampedArray(W * H * 4), shaken = Buffer.alloc(W * H * 4);
const p = painterFor(frame);
const fxs = [
  { start: ERUPT, fx: createFx(bigExplosion, { x: 121, y: 172, seed: 79 }) },
  { start: 2.7, fx: createFx(meteor, { x: 96, y: GROUND, flip: true, seed: 3 }) },
  { start: 3.1, fx: createFx(meteor, { x: 150, y: GROUND, flip: true, seed: 8 }) },
];

const ff = spawn("ffmpeg", [
  "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${W}x${H}`, "-r", String(FPS), "-i", "-",
  "-vf", `scale=${W * SCALE}:${H * SCALE}:flags=neighbor`, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16",
  "-movflags", "+faststart", out,
], { stdio: ["pipe", "inherit", "inherit"] });

for (let i = 0; i < FPS * SECONDS; i++) {
  const t = i / FPS;
  clearFrame(frame);
  p.reset?.();
  p.place(0, 0);
  background(p, t);
  for (const f of fxs) if (t >= f.start) { f.fx.update(1 / FPS); f.fx.draw(frame); }
  p.place(0, 0);
  p.fade = 1;
  overlay(p, t);
  composite(frame, rgba, null);

  // the ground shakes when it blows
  const s = t > ERUPT && t < ERUPT + 0.9 ? Math.round(3 * (1 - (t - ERUPT) / 0.9)) : 0;
  const dx = s ? (i % 2 ? s : -s) : 0, dy = s ? (i % 3) - 1 : 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const sx = Math.min(W - 1, Math.max(0, x - dx)), sy = Math.min(H - 1, Math.max(0, y - dy));
      const a = (y * W + x) * 4, b = (sy * W + sx) * 4;
      shaken[a] = rgba[b]; shaken[a + 1] = rgba[b + 1]; shaken[a + 2] = rgba[b + 2]; shaken[a + 3] = 255;
    }
  if (!ff.stdin.write(shaken)) await new Promise((r) => ff.stdin.once("drain", r));
}
ff.stdin.end();
ff.on("close", (code) => console.log(code === 0 ? `ok: ${out}` : `ffmpeg failed (${code})`));
