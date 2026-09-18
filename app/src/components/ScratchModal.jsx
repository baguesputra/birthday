import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CONFIG } from "../data/gifts";
import { winSound, startScratch, setScratchIntensity, stopScratch, scratchTick, revealSting, setMusicDuck } from "../hooks/useAudio";
import confetti from "canvas-confetti";

export default function ScratchModal({ index, onClose, onUnlock }) {
  const g = CONFIG.gifts[index];
  const cvRef = useRef(null);
  const trailEl = useRef(null);
  const progEl = useRef(null);
  const [done, setDone] = useState(false);
  const st = useRef({ scratching: false, last: null, moves: 0, unlocked: false, band: 0 });

  const finish = () => {
    if (st.current.unlocked) return;
    st.current.unlocked = true;
    stopScratch(); setMusicDuck(false);
    if (progEl.current) progEl.current.style.width = "100%";
    const cv = cvRef.current;
    if (cv) { cv.style.transition = "opacity .5s"; cv.style.opacity = "0"; }
    setDone(true);
    revealSting(); winSound();
    try { if (navigator.vibrate) navigator.vibrate(20); } catch { /* noop */ }
    confetti({ particleCount: 50, spread: 75, origin: { y: 0.4 }, colors: CONFIG.confettiColors });
    onUnlock(index);
  };

  useEffect(() => {
    const cv = cvRef.current, ctx = cv.getContext("2d");
    st.current = { scratching: false, last: null, moves: 0, unlocked: false, band: 0, lastT: 0 };
    setDone(false);
    setMusicDuck(true);
    startScratch();
    requestAnimationFrame(() => {
      const r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 1.5);
      cv.width = r.width * dpr; cv.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gr = ctx.createLinearGradient(0, 0, r.width, r.height);
      ["#e8e8ee", "#cfcfda", "#f5f5fa", "#c4c4d0", "#e8e8ee"].forEach((c, k) => gr.addColorStop(k / 4, c));
      ctx.fillStyle = gr; ctx.fillRect(0, 0, r.width, r.height);
      ctx.fillStyle = "rgba(255,255,255,.8)";
      for (let k = 0; k < 40; k++) { ctx.beginPath(); ctx.arc(Math.random() * r.width, Math.random() * r.height, Math.random() * 2.2 + 0.6, 0, 7); ctx.fill(); }
      ctx.fillStyle = "rgba(120,100,130,.4)"; ctx.font = "700 13px Quicksand,sans-serif"; ctx.textAlign = "center";
      ctx.fillText("✦ use your finger ✦", r.width / 2, r.height - 14);
    });
    const check = () => {
      try {
        const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
        let clear = 0, n = 0;
        for (let k = 3; k < d.length; k += 400 * 4) { n++; if (d[k] === 0) clear++; }
        const frac = clear / n;
        if (progEl.current) progEl.current.style.width = `${Math.round(frac * 100)}%`;
        const band = Math.floor(frac * 10);
        if (band > st.current.band) { st.current.band = band; scratchTick(); }
        if (frac > 0.45) finish();
      } catch {}
    };
    const pos = (e) => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const draw = (e) => {
      const s = st.current;
      if (!s.scratching || s.unlocked) return;
      e.preventDefault();
      const now = performance.now();
      const p = pos(e);
      const dist = s.last ? Math.hypot(p.x - s.last.x, p.y - s.last.y) : 0;
      const dt = Math.max(1, now - (s.lastT || now));
      setScratchIntensity(Math.min(1, dist / dt / 1.5));
      s.lastT = now;
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 34; ctx.lineCap = ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(s.last ? s.last.x : p.x, s.last ? s.last.y : p.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      s.last = p;
      s.moves++;
      const el = trailEl.current;
      if (el) {
        el.style.left = `${p.x - 10}px`;
        el.style.top = `${p.y - 10}px`;
        el.style.opacity = "0.9";
        el.style.transform = "scale(.6)";
        requestAnimationFrame(() => {
          el.style.transition = "opacity .45s, transform .45s";
          el.style.opacity = "0";
          el.style.transform = "scale(1.6) translateY(-14px)";
        });
      }
      if (s.moves % 12 === 0) check();
    };
    const down = (e) => {
      e.preventDefault();
      st.current.scratching = true; st.current.last = null;
      try { cv.setPointerCapture(e.pointerId); } catch { /* noop */ }
      draw(e);
    };
    const up = () => { st.current.scratching = false; st.current.last = null; };
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointermove", draw, { passive: false });
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    addEventListener("keydown", esc);
    return () => { stopScratch(); setMusicDuck(false); removeEventListener("keydown", esc); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-20 flex items-center justify-center p-4 bg-[#2B2135]/45 backdrop-blur-md" role="dialog" aria-modal="true">
      <motion.div initial={{ scale: 0.94, y: 16, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="glass rounded-[28px] p-6 w-[min(94vw,400px)] max-h-[92dvh] overflow-y-auto relative">
        <button onClick={onClose} aria-label="Tutup"
          className="absolute top-3 right-3 w-11 h-11 rounded-full bg-pinkdeep/5 text-pinkdeep font-bold hover:bg-pinkdeep/10">✕</button>
        <p className="eyebrow">Keepsake No. {index + 1}</p>
        <h3 className="font-display font-bold text-ink text-2xl mt-1 pr-10">{g.title}</h3>
        <p className="text-plum font-semibold text-sm mt-1 mb-2">{done ? `Seal broken — this one is yours. 🎉` : "Scratch the silver seal with your finger 👆"}</p>
        {!done && (
          <div className="h-1.5 bg-pinkdeep/10 rounded-full overflow-hidden mb-3" aria-hidden="true">
            <div ref={progEl} className="h-full rounded-full bg-gradient-to-r from-[#ffd479] to-pinky" style={{ width: "0%" }} />
          </div>
        )}
        <div className="relative w-full aspect-[1/1.05] rounded-[20px] overflow-hidden bg-gradient-to-br from-[#fff6fb] to-[#ffeef8] border-2 border-dashed border-pinky/40">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center gap-2">
            <div className="text-6xl">{g.emoji}</div>
            <div className="font-display font-bold text-xl text-pinky">{g.title}</div>
            <div className="text-[.92rem] text-plum font-semibold leading-relaxed">{g.reason}</div>
          </div>
          <canvas ref={cvRef} className="absolute inset-0 w-full h-full touch-none cursor-grab z-[2]" style={{ opacity: done ? 0 : 1 }} />
          {!done && (
            <span ref={trailEl} className="absolute z-[3] pointer-events-none text-lg" style={{ left: -30, top: -30, opacity: 0 }}>✨</span>
          )}
          {done && (
            <motion.div className="absolute inset-0 z-[3] bg-white pointer-events-none"
              initial={{ opacity: 0.85 }} animate={{ opacity: 0 }} transition={{ duration: 0.6 }} />
          )}
        </div>
        <div className="text-center mt-3 flex gap-2 justify-center items-center">
          {!done && <button onClick={finish} className="btn-ghost">Open directly</button>}
          <button onClick={onClose} disabled={!done} className="btn-love !mt-0 !px-7 !py-2.5 !text-base">Keep it ✓</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
