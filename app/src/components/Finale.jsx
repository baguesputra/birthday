import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CONFIG } from "../data/gifts";
import { fanfare } from "../hooks/useAudio";
import confetti from "canvas-confetti";
import { Stepper } from "./GiftGrid";

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
    <motion.section key="finale"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="stage overflow-y-auto">
      <Stepper active={3} />
      <motion.button aria-label="Ketuk untuk ledakan hati" className="text-5xl"
        initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 14 }}
        whileTap={{ scale: 1.25 }}
        onClick={(e) => confetti({ particleCount: 30, spread: 60, origin: { x: e.clientX / innerWidth, y: e.clientY / innerHeight }, colors: CONFIG.confettiColors })}>🎉💖🎉</motion.button>
      <p className="eyebrow mt-3">The letter · For Laili</p>
      <h1 className="font-display font-bold text-ink leading-[1.05]" style={{ fontSize: "clamp(2rem,7vw,3.2rem)" }}>
        You found them <em className="text-pinky">all.</em>
      </h1>
      <div onClick={skip} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") skip(); }}
        className="glass mt-5 rounded-[24px] p-7 w-[min(92vw,480px)] max-h-[44dvh] overflow-y-auto text-left" role="button" tabIndex={0} aria-label="Ketuk untuk lewati animasi ketikan">
        <h3 className="font-hand text-pinkdeep text-3xl mb-2">{CONFIG.finaleTitle}</h3>
        <p className="text-ink/80 font-semibold text-[.95rem] leading-7 whitespace-pre-wrap">{text}</p>
      </div>
      <div className="text-plum/70 text-xs font-bold mt-2">tap the letter to skip typing ✏️</div>
      <div className="mt-4 flex gap-3 flex-wrap justify-center">
        <button onClick={share} className="btn-love !mt-0 !px-7 !py-2.5 !text-base">Share 💌</button>
        <button onClick={onReplay} className="font-display font-bold px-7 py-2.5 rounded-full border-2 border-pinkdeep/20 text-pinkdeep hover:border-pinky hover:text-pinky transition-colors">Replay ♡</button>
      </div>
    </motion.section>
  );
}
