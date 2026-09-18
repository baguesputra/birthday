import { useEffect, useRef } from "react";
import { CONFIG } from "../data/gifts";

let ctx = null;
function beep(freq = 600, dur = 0.08, type = "sine", vol = 0.12) {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur);
  } catch {}
}

export const popSound = () => { beep(500, 0.07, "triangle"); setTimeout(() => beep(750, 0.09, "triangle"), 70); };
export const winSound = () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.14, "sine", 0.14), i * 110)); };
export const fanfare = () => { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => setTimeout(() => beep(f, 0.18, "triangle", 0.13), i * 150)); };

export function useMusic(muted, setMuted) {
  const timer = useRef(null);
  const step = useRef(0);

  const stop = () => { clearTimeout(timer.current); timer.current = null; };
  const start = () => {
    if (timer.current || muted) return;
    if (CONFIG.musicUrl) { const a = new Audio(CONFIG.musicUrl); a.loop = true; a.volume = 0.5; a.play().catch(() => {}); return; }
    const tick = () => {
      const f = CONFIG.musicNotes[step.current % CONFIG.musicNotes.length]; step.current++;
      if (f) beep(f, 0.32, "sine", 0.05);
      timer.current = setTimeout(tick, 300);
    };
    tick();
  };

  useEffect(() => () => clearTimeout(timer.current), []);
  const toggle = () => { if (muted) { setMuted(false); } else { stop(); setMuted(true); } };

  return { start, stop, toggle };
}
