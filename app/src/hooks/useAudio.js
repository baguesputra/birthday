import { useEffect, useRef } from "react";
import { CONFIG } from "../data/gifts";

let ctx = null;
let musicDuck = 1;
function ac() {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}
function beep(freq = 600, dur = 0.08, type = "sine", vol = 0.12) {
  try {
    const c = ac();
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + dur);
  } catch {}
}

export const popSound = () => { beep(500, 0.07, "triangle"); setTimeout(() => beep(750, 0.09, "triangle"), 70); };
export const winSound = () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.14, "sine", 0.14), i * 110)); };
export const fanfare = () => { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => setTimeout(() => beep(f, 0.18, "triangle", 0.13), i * 150)); };

export const setMusicDuck = (d) => { musicDuck = d ? 0.25 : 1; };

function noiseBuffer(c) {
  const b = c.createBuffer(1, c.sampleRate, c.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}

let scratch = null;
export function startScratch() {
  try {
    const c = ac();
    if (scratch) return;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c); src.loop = true;
    const bp = c.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = 1200; bp.Q.value = 0.8;
    const g = c.createGain();
    g.gain.value = 0;
    src.connect(bp); bp.connect(g); g.connect(c.destination);
    src.start();
    g.gain.linearRampToValueAtTime(0.06, c.currentTime + 0.15);
    scratch = { src, bp, g };
  } catch {}
}
export function setScratchIntensity(v) {
  try {
    if (!scratch) return;
    const x = Math.min(1, Math.max(0, v));
    scratch.bp.frequency.setTargetAtTime(800 + x * 2600, ctx.currentTime, 0.05);
    scratch.g.gain.setTargetAtTime(0.03 + x * 0.08, ctx.currentTime, 0.05);
  } catch {}
}
export function stopScratch() {
  try {
    if (!scratch) return;
    const s = scratch; scratch = null;
    s.g.gain.setTargetAtTime(0, ctx.currentTime, 0.06);
    setTimeout(() => { try { s.src.stop(); } catch {} }, 250);
  } catch {}
}
export const scratchTick = () => beep(1250, 0.05, "sine", 0.05);
export function revealSting() {
  try {
    const c = ac(), t = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c);
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(400, t);
    lp.frequency.exponentialRampToValueAtTime(6000, t + 0.35);
    const g = c.createGain();
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    src.connect(lp); lp.connect(g); g.connect(c.destination);
    src.start(t); src.stop(t + 0.45);
    [880, 1174.66, 1567.98].forEach((f, i) => {
      const o = c.createOscillator(), gg = c.createGain();
      o.type = "sine"; o.frequency.value = f;
      const st = t + 0.15 + i * 0.12;
      gg.gain.setValueAtTime(0.0001, st);
      gg.gain.exponentialRampToValueAtTime(0.14, st + 0.03);
      gg.gain.exponentialRampToValueAtTime(0.001, st + 0.5);
      o.connect(gg); gg.connect(c.destination);
      o.start(st); o.stop(st + 0.55);
    });
  } catch {}
}

export function useMusic(muted, setMuted) {
  const timer = useRef(null);
  const step = useRef(0);

  const stop = () => { clearTimeout(timer.current); timer.current = null; };
  const start = () => {
    if (timer.current || muted) return;
    if (CONFIG.musicUrl) { const a = new Audio(CONFIG.musicUrl); a.loop = true; a.volume = 0.5; a.play().catch(() => {}); return; }
    const tick = () => {
      const f = CONFIG.musicNotes[step.current % CONFIG.musicNotes.length]; step.current++;
      if (f) beep(f, 0.32, "sine", 0.05 * musicDuck);
      timer.current = setTimeout(tick, 300);
    };
    tick();
  };

  useEffect(() => () => clearTimeout(timer.current), []);
  const toggle = () => { if (muted) { setMuted(false); } else { stop(); setMuted(true); } };

  return { start, stop, toggle };
}
