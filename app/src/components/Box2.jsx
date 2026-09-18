import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONFIG } from "../data/gifts";
import { winSound } from "../hooks/useAudio";
import confetti from "canvas-confetti";
import { Stepper } from "./GiftGrid";

export default function Box2({ onDone }) {
  const file = useRef(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(false);
  const letters = CONFIG.box2.answer.split("");

  const pick = (e) => {
    if (!e.target.files.length) return;
    setBusy(true); setResult(false);
    setTimeout(() => {
      setBusy(false);
      winSound();
      try { if (navigator.vibrate) navigator.vibrate(20); } catch { /* noop */ }
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.4 }, colors: CONFIG.confettiColors });
      setResult(true);
      setTimeout(onDone, 2400);
    }, 1200);
  };

  return (
    <motion.section key="box2"
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="stage overflow-y-auto">
      <Stepper active={2} />
      <p className="eyebrow">Box 2 · A hidden name</p>
      <h1 className="font-display font-bold text-ink mt-2 leading-[1.05]" style={{ fontSize: "clamp(2rem,7vw,3rem)", textShadow: "0 0 30px rgba(181,123,238,.35)" }}>
        Not just snacks —<br /><em className="text-pinky">a name in disguise.</em>
      </h1>
      <div className="glass rounded-[24px] p-6 mt-5 max-w-[46ch] text-left relative overflow-hidden">
        <p className="text-plum font-semibold leading-relaxed">Inside this box are a few snacks. Look at each one, one by one.<br /><br /><b className="text-ink">Don&apos;t eat them yet.</b> 😄<br /><br />Arrange them by the <b className="text-ink">first letter of each name</b>, then photograph the arrangement below.</p>
        <p className="text-plum font-semibold mt-3 text-sm opacity-85">Hint: not the whole name — just the <b className="text-ink">first letter</b> of each snack.<br /><b className="text-ink">Arrange → Photo → Scan → Find the answer</b></p>
        {busy && (
          <>
            <motion.div className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent via-lilac/30 to-transparent pointer-events-none"
              initial={{ top: "-20%" }} animate={{ top: "110%" }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }} />
            {[0, 1, 2].map((i) => (
              <motion.div key={i} className="absolute left-1/2 top-1/2 rounded-full border-2 border-lilac/50 pointer-events-none"
                style={{ width: 20, height: 20, x: "-50%", y: "-50%" }}
                animate={{ scale: [1, 6], opacity: [0.7, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }} />
            ))}
          </>
        )}
      </div>
      <input ref={file} type="file" accept="image/*" capture="environment" hidden onChange={pick} />
      <motion.button disabled={busy} onClick={() => file.current.click()} className="btn-love mt-6 relative overflow-hidden"
        whileHover={busy ? {} : { scale: 1.04 }} whileTap={busy ? {} : { scale: 0.96 }}
        animate={busy ? { scale: [1, 1.03, 1] } : {}} transition={busy ? { duration: 0.8, repeat: Infinity } : {}}>
        <motion.span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ["-120%", "120%"] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
        <span className="relative">{busy ? "⏳ Reading the arrangement…" : "📷 Scan Susunan Snack"}</span>
      </motion.button>
      <AnimatePresence>
        {result && (
          <motion.div className="mt-6 flex items-center justify-center gap-2" role="status" exit={{ opacity: 0 }}>
            {letters.map((ch, i) => (
              <motion.span key={i}
                initial={{ opacity: 0, y: 30, scale: 0.5, rotateX: -80 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                transition={{ delay: 0.15 + i * 0.14, type: "spring", stiffness: 260, damping: 16 }}
                className="glass rounded-2xl w-12 h-14 flex items-center justify-center font-display font-bold text-2xl text-pinkdeep"
                style={{ textShadow: "0 0 18px rgba(217,79,140,.4)" }}>
                {ch}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + letters.length * 0.14, type: "spring", stiffness: 300, damping: 12 }}
              className="text-2xl">🤍</motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
