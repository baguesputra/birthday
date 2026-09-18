import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONFIG } from "../data/gifts";
import { fanfare } from "../hooks/useAudio";
import confetti from "canvas-confetti";
import { Stepper } from "./GiftGrid";

const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

function FallingHearts({ on }) {
  const hearts = useMemo(() => {
    if (!on || reduced) return [];
    const rand = (n) => (n * 9301 + 49297) % 233280 / 233280;
    return Array.from({ length: 16 }, (_, i) => ({
      left: rand(i + 1) * 100,
      delay: rand(i + 40) * 4,
      dur: 5 + rand(i + 80) * 4,
      s: 0.8 + rand(i + 120) * 1.2,
      ch: ["💖", "💕", "✨", "🤍"][i % 4],
    }));
  }, [on]);
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden="true">
      {hearts.map((h, i) => (
        <motion.span key={i} className="absolute -top-8"
          style={{ left: `${h.left}%`, fontSize: `${h.s}rem` }}
          animate={{ y: ["0vh", "115vh"], rotate: [0, 40, -30, 20, 0], opacity: [0, 1, 1, 0.9] }}
          transition={{ duration: h.dur, repeat: Infinity, delay: h.delay, ease: "linear" }}>
          {h.ch}
        </motion.span>
      ))}
    </div>
  );
}

export default function Finale({ onReplay }) {
  const full = CONFIG.letter.join("\n\n");
  const [text, setText] = useState(reduced ? full : "");
  const [sealed, setSealed] = useState(!reduced);
  const pRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    fanfare();
    if (!reduced) {
      let w = 0;
      const iv = setInterval(() => { confetti({ particleCount: 60, spread: 100, origin: { y: 0.35 }, colors: CONFIG.confettiColors }); if (++w >= 2) clearInterval(iv); }, 700);
      setTimeout(() => {
        setSealed(false);
        let i = 0;
        timer.current = setInterval(() => {
          i += 2;
          const slice = full.slice(0, i);
          if (pRef.current) pRef.current.textContent = slice;
          if (i >= full.length) { clearInterval(timer.current); setText(full); }
        }, 18);
      }, 1200);
      return () => { clearInterval(iv); clearInterval(timer.current); };
    }
  }, [full]);

  const skip = () => { clearInterval(timer.current); setSealed(false); if (pRef.current) pRef.current.textContent = full; setText(full); };
  const share = () => { location.href = `https://wa.me/?text=${encodeURIComponent(`Happy Birthday ${CONFIG.herName}! 🎂\n\n${full}`)}`; };

  return (
    <motion.section key="finale"
      initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="stage overflow-y-auto">
      <FallingHearts on={!sealed} />
      <Stepper active={3} />
      <motion.button aria-label="Ketuk untuk ledakan hati" className="text-5xl"
        initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 14 }}
        whileHover={{ scale: 1.12, rotate: -4 }} whileTap={{ scale: 1.3 }}
        onClick={(e) => {
          confetti({ particleCount: 30, spread: 60, origin: { x: e.clientX / innerWidth, y: e.clientY / innerHeight }, colors: CONFIG.confettiColors });
          setTimeout(() => confetti({ particleCount: 20, spread: 100, origin: { x: e.clientX / innerWidth, y: e.clientY / innerHeight }, colors: CONFIG.confettiColors }), 120);
        }}>🎉💖🎉</motion.button>
      <p className="eyebrow mt-3">The letter · For Laili</p>
      <h1 className="font-display font-bold text-ink leading-[1.05]" style={{ fontSize: "clamp(2rem,7vw,3.2rem)", textShadow: "0 0 34px rgba(217,79,140,.4)" }}>
        You found them <em className="text-pinky">all.</em>
      </h1>
      <AnimatePresence mode="wait">
        {sealed ? (
          <motion.div key="env" exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="glass mt-5 rounded-[24px] p-8 w-[min(92vw,400px)] flex flex-col items-center">
            <motion.div className="text-7xl"
              animate={{ y: [0, -8, 0], rotate: [0, -3, 3, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>✉️</motion.div>
            <p className="eyebrow mt-4">Unsealing your letter…</p>
            <motion.div className="mt-3 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className="w-2 h-2 rounded-full bg-pinky"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="paper"
            initial={{ opacity: 0, y: 40, rotateX: 25 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 17 }}
            onClick={skip} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") skip(); }}
            className="glass mt-5 rounded-[24px] p-7 w-[min(92vw,480px)] max-h-[44dvh] overflow-y-auto text-left shadow-[0_24px_60px_-18px_rgba(157,23,77,.4)]"
            role="button" tabIndex={0} aria-label="Ketuk untuk lewati animasi ketikan">
            <h3 className="font-hand text-pinkdeep text-3xl mb-2">{CONFIG.finaleTitle}</h3>
            <p ref={pRef} className="text-ink/80 font-semibold text-[.95rem] leading-7 whitespace-pre-wrap">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="text-plum/70 text-xs font-bold mt-2">tap the letter to skip typing ✏️</div>
      <div className="mt-4 flex gap-3 flex-wrap justify-center">
        <motion.button onClick={share} className="btn-love !mt-0 !px-7 !py-2.5 !text-base"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Share 💌</motion.button>
        <button onClick={onReplay} className="font-display font-bold px-7 py-2.5 rounded-full border-2 border-pinkdeep/20 text-pinkdeep hover:border-pinky hover:text-pinky transition-colors">Replay ♡</button>
      </div>
    </motion.section>
  );
}
