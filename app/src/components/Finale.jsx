import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CONFIG } from "../data/gifts";
import { fanfare } from "../hooks/useAudio";
import confetti from "canvas-confetti";

const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Finale({ onReplay }) {
  const full = CONFIG.letter.join("\n\n");
  const [text, setText] = useState(reduced ? full : "");
  const timer = useRef(null);

  useEffect(() => {
    fanfare();
    if (!reduced) {
      let w = 0;
      const iv = setInterval(() => { confetti({ particleCount: 60, spread: 100, origin: { y: 0.35 }, colors: CONFIG.confettiColors }); if (++w >= 2) clearInterval(iv); }, 700);
      let i = 0;
      timer.current = setInterval(() => {
        i += 2; setText(full.slice(0, i));
        if (i >= full.length) clearInterval(timer.current);
      }, 18);
      return () => { clearInterval(iv); clearInterval(timer.current); };
    }
  }, [full]);

  const skip = () => { clearInterval(timer.current); setText(full); };
  const share = () => { location.href = `https://wa.me/?text=${encodeURIComponent(`Happy Birthday ${CONFIG.herName}! 🎂\n\n${full}`)}`; };

  return (
    <motion.section key="finale" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-10 flex flex-col items-center justify-center p-5 text-center max-w-[640px] mx-auto overflow-y-auto">
      <button aria-label="Ketuk untuk ledakan hati" className="text-5xl mb-2"
        onClick={(e) => confetti({ particleCount: 30, spread: 60, origin: { x: e.clientX / innerWidth, y: e.clientY / innerHeight }, colors: CONFIG.confettiColors })}>🎉💖🎉</button>
      <h1 className="font-display text-[#e0559a]" style={{ fontSize: "clamp(1.8rem,7vw,3rem)" }}>You found them ALL!</h1>
      <div onClick={skip} className="mt-4 bg-white rounded-[22px] p-6 w-[min(92vw,480px)] max-h-[44dvh] overflow-y-auto text-left shadow-[0_10px_30px_rgba(224,85,154,.18)] border-[3px] border-[#ffc7e0]" role="button" tabIndex={0} aria-label="Ketuk untuk lewati animasi ketikan">
        <h3 className="font-hand text-pinkdeep text-3xl mb-2">{CONFIG.finaleTitle}</h3>
        <p className="text-plum font-semibold text-[.95rem] leading-7 whitespace-pre-wrap">{text}</p>
      </div>
      <div className="text-[#b98aa3] text-xs font-bold mt-2 opacity-70">tap the letter to skip typing ✏️</div>
      <div className="mt-4 flex gap-2">
        <button onClick={share} className="font-display px-6 py-2 rounded-full text-white bg-gradient-to-br from-[#ff85c2] to-[#ff5f9e]">Share 💌</button>
        <button onClick={onReplay} className="font-display px-6 py-2 rounded-full text-white bg-gradient-to-br from-[#ff85c2] to-[#ff5f9e]">Replay ♡</button>
      </div>
    </motion.section>
  );
}
