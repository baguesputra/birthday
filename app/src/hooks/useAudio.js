import { useEffect, useRef } from "react";
import { CONFIG } from "../data/gifts";

let ctx = null;
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

let musicBus = null;
function bus(c) {
  if (!musicBus) {
    musicBus = c.createGain();
    musicBus.gain.value = 1;
    musicBus.connect(c.destination);
  }
  return musicBus;
}
export const setMusicDuck = (d) => {
  try { if (ctx && musicBus) musicBus.gain.setTargetAtTime(d ? 0.25 : 1, ctx.currentTime, 0.2); } catch {}
};

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

const D3 = 146.83, F3 = 174.61, A3 = 220.0, C4 = 261.63;
const Bb2 = 116.54, Bb3 = 233.08;
const F2 = 87.31, C3 = 130.81;
const G3 = 196.0, E4 = 329.63;
const D4 = 293.66, E4m = 329.63, F4 = 349.23, G4 = 392.0, A4 = 440.0, Bb4 = 466.16, C5 = 523.25;
const D5 = 587.33;

const CHORDS = [
  [D3, F3, A3, C4],
  [Bb2, D3, F3, Bb3],
  [F2, C3, F3, A3],
  [C3, G3, C4, E4],
];
const MELODY = [F4, G4, A4, C5, Bb4, A4, G4, F4, G4, A4, Bb4, C5, D5, C5, Bb4, A4, G4, F4, E4m, F4, D4, E4m, F4, 0];
const BEAT = 60 / 90 / 2;
const BAR = BEAT * 8;

function pad(c, out, freqs, t, dur, vol = 0.03) {
  freqs.forEach((f) => {
    const o = c.createOscillator(), g = c.createGain(), fl = c.createBiquadFilter();
    o.type = "sawtooth"; o.frequency.value = f;
    fl.type = "lowpass"; fl.frequency.value = 900; fl.Q.value = 0.4;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.3);
    g.gain.setValueAtTime(vol, t + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(fl); fl.connect(g); g.connect(out);
    o.start(t); o.stop(t + dur + 0.05);
  });
}
function pluck(c, out, freq, t, dur = 1.1, vol = 0.075) {
  if (!freq) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = "triangle"; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(out);
  o.start(t); o.stop(t + dur + 0.05);
}
function shimmer(c, out, freq, t, dur = 1.4, vol = 0.014) {
  const o = c.createOscillator(), g = c.createGain();
  o.type = "sine"; o.frequency.value = freq * 2;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.4);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(out);
  o.start(t); o.stop(t + dur + 0.05);
}

export function useMusic(muted, setMuted) {
  const timer = useRef(null);

  const stop = () => { clearTimeout(timer.current); timer.current = null; };
  const start = () => {
    if (timer.current || muted) return;
    if (CONFIG.musicUrl) { const a = new Audio(CONFIG.musicUrl); a.loop = true; a.volume = 0.5; a.play().catch(() => {}); return; }
    const c = ac();
    const out = bus(c);
    let bar = 0;
    let beat = 0;
    const tickBeat = () => {
      if (!timer.current) return;
      const t = c.currentTime + 0.08;
      if (beat % 8 === 0) {
        const b = bar % 4;
        const chord = CHORDS[b];
        pad(c, out, chord, t, BAR + 0.5);
        if (b % 2 === 0) shimmer(c, out, chord[3] * 2, t + BAR * 0.25, BAR * 0.5);
      }
      const seq = MELODY[(bar * 8 + beat) % MELODY.length];
      pluck(c, out, seq, t);
      beat++;
      if (beat % 8 === 0) bar++;
      timer.current = setTimeout(tickBeat, BEAT * 1000);
    };
    timer.current = setTimeout(tickBeat, 120);
  };

  useEffect(() => () => clearTimeout(timer.current), []);
  const toggle = () => { if (muted) { setMuted(false); } else { stop(); setMuted(true); } };

  return { start, stop, toggle };
}
