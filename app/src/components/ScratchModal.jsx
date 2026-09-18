import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CONFIG } from "../data/gifts";
import { winSound } from "../hooks/useAudio";
import confetti from "canvas-confetti";

export default function ScratchModal({ index, onClose, onUnlock }) {
  const g = CONFIG.gifts[index];
  const cvRef = useRef(null);
  const [done, setDone] = useState(false);
  const st = useRef({ scratching: false, last: null, moves: 0, unlocked: false });

  const finish = () => {
    if (st.current.unlocked) return;
    st.current.unlocked = true;
    const cv = cvRef.current;
    if (cv) { cv.style.transition = "opacity .5s"; cv.style.opacity = "0"; }
    setDone(true);
    winSound();
    try { if (navigator.vibrate) navigator.vibrate(20); } catch { /* noop */ }
    confetti({ particleCount: 50, spread: 75, origin: { y: 0.4 }, colors: CONFIG.confettiColors });
    onUnlock(index);
  };

  useEffect(() => {
    const cv = cvRef.current, ctx = cv.getContext("2d");
    st.current = { scratching: false, last: null, moves: 0, unlocked: false };
    setDone(false);
    requestAnimationFrame(() => {
      const r = cv.getBoundingClientRect(), dpr = devicePixelRatio || 1;
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
        if (clear / n > 0.45) finish();
      } catch {}
    };
    const pos = (e) => { const r = cv.getBoundingClientRect(), p = e.touches ? e.touches[0] : e; return { x: p.clientX - r.left, y: p.clientY - r.top }; };
    const draw = (e) => {
      const s = st.current;
      if (!s.scratching || s.unlocked) return;
      e.preventDefault();
      const p = pos(e);
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 34; ctx.lineCap = ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(s.last ? s.last.x : p.x, s.last ? s.last.y : p.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      s.last = p;
      if (++s.moves % 6 === 0) check();
    };
    const down = (e) => { st.current.scratching = true; st.current.last = null; draw(e); };
    const up = () => { st.current.scratching = false; st.current.last = null; };
    cv.addEventListener("mousedown", down);
    cv.addEventListener("touchstart", draw, { passive: false });
    cv.addEventListener("touchmove", draw, { passive: false });
    cv.addEventListener("touchend", up);
    addEventListener("mousemove", (e) => { if (st.current.scratching) draw(e); });
    addEventListener("mouseup", up);
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    addEventListener("keydown", esc);
    return () => { removeEventListener("mouseup", up); removeEventListener("keydown", esc); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-20 flex items-center justify-center p-4 bg-[rgba(90,40,70,.45)] backdrop-blur-md" role="dialog" aria-modal="true">
      <motion.div initial={{ scale: 0.96, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
        className="bg-white/95 rounded-[28px] p-[22px] w-[min(94vw,400px)] max-h-[92dvh] overflow-y-auto shadow-2xl relative border border-white/60">
        <button onClick={onClose} aria-label="Tutup"
          className="absolute top-2.5 right-3.5 w-11 h-11 rounded-full bg-[#ffeef7] text-pinkdeep font-bold">✕</button>
        <h3 className="font-display text-xl text-pinkdeep mb-1 pr-10">Gift #{index + 1} — {g.title}</h3>
        <p className="text-plum font-semibold text-sm mb-3">{done ? `Yay! Gift #${index + 1} unlocked! 🎉` : "Gosok panel silver dengan jarimu 👆"}</p>
        <div className="relative w-full aspect-[1/1.05] rounded-[20px] overflow-hidden bg-gradient-to-br from-[#fff6fb] to-[#ffeef8] border-[3px] border-dashed border-[#ffb1d4]">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-[18px] text-center gap-2">
            <div className="text-6xl">{g.emoji}</div>
            <div className="font-display text-xl text-[#e0559a]">{g.title}</div>
            <div className="text-[.92rem] text-plum font-semibold">{g.reason}</div>
          </div>
          <canvas ref={cvRef} className="absolute inset-0 w-full h-full touch-none cursor-grab z-[2]" style={{ opacity: done ? 0 : 1 }} />
        </div>
        <div className="text-center mt-2 flex gap-2 justify-center">
          {!done && <button onClick={finish} className="underline text-pinkdeep font-bold min-h-[44px] px-4">Buka langsung</button>}
          <button onClick={onClose} disabled={!done}
            className="font-display px-6 py-2 rounded-full text-white bg-gradient-to-br from-[#ff85c2] to-[#ff5f9e] disabled:opacity-50">Yay! ✓</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
