import { motion } from "framer-motion";
import { popSound } from "../hooks/useAudio";
import confetti from "canvas-confetti";
import { GiftIcon } from "@heroicons/react/24/solid";
import { CONFIG } from "../data/gifts";

function GlowWord({ text, delay, className = "" }) {
  return (
    <span className="inline-block" aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span key={i} className={`inline-block ${className}`}
          initial={{ opacity: 0, y: 26, rotateX: -60 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: delay + i * 0.035, type: "spring", stiffness: 220, damping: 18 }}
          style={{ textShadow: "0 0 28px rgba(217,79,140,.45)" }}>
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function Cover({ onOpen, musicStart }) {
  const motionSupported = typeof window !== "undefined" && window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission === "function";
  const enableMotion = () => {
    try { if (window.__enableGyroParallax) window.__enableGyroParallax(); } catch {}
  };
  const open = () => {
    enableMotion();
    musicStart(); popSound();
    confetti({ particleCount: 90, spread: 100, origin: { y: 0.35 }, colors: CONFIG.confettiColors });
    setTimeout(() => confetti({ particleCount: 40, angle: 60, spread: 60, origin: { x: 0, y: 0.6 }, colors: CONFIG.confettiColors }), 150);
    setTimeout(() => confetti({ particleCount: 40, angle: 120, spread: 60, origin: { x: 1, y: 0.6 }, colors: CONFIG.confettiColors }), 300);
    setTimeout(onOpen, 450);
  };
  return (
    <motion.section key="cover"
      initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className="stage">
      <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}
        className="eyebrow">01 · A sealed letter for Laili</motion.p>
      <h1 className="font-display font-bold text-ink mt-4 leading-[1.05]" style={{ fontSize: "clamp(2.4rem,9vw,4.2rem)" }}>
        <GlowWord text="Something" delay={0.55} /><br />
        <GlowWord text="small," delay={0.85} /> <GlowWord text="kept" delay={1.0} className="text-pinky" /> <GlowWord text="with" delay={1.1} className="text-pinky" /> <GlowWord text="care." delay={1.2} className="text-pinky" />
      </h1>
      <motion.div className="relative mt-8"
        initial={{ scale: 0.5, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 1.1, type: "spring", stiffness: 200, damping: 16 }}>
        <motion.button onClick={open} aria-label="Ketuk kado untuk membuka kejutan"
          animate={{ y: [0, -12, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.08, rotate: -3 }} whileTap={{ scale: 0.9 }}
          className="relative min-w-[88px] min-h-[88px] drop-shadow-[0_16px_30px_rgba(157,23,77,.3)] flex items-center justify-center">
          <GiftIcon className="text-[5.5rem] text-pinky" />
        </motion.button>
        <motion.div className="absolute inset-[-18px] rounded-full border-2 border-pinky/40 pointer-events-none"
          animate={{ scale: [1, 1.35], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
        <motion.div className="absolute inset-[-18px] rounded-full border border-lilac/40 pointer-events-none"
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }} />
        <motion.div className="absolute inset-0 -z-10 blur-2xl rounded-full bg-pinky/30"
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity }} />
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} transition={{ delay: 1.5, duration: 0.5 }}
        className="mt-5 text-pinkdeep font-bold">Break the seal — tap the gift ✨</motion.p>
      {motionSupported && (
        <motion.button onClick={enableMotion} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }}
          className="mt-3 text-xs font-bold tracking-wide text-plum/70 underline decoration-dotted underline-offset-4">
          Enable tilt ✨
        </motion.button>
      )}
    </motion.section>
  );
}
