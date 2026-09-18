import { motion } from "framer-motion";
import { popSound } from "../hooks/useAudio";
import confetti from "canvas-confetti";
import { CONFIG } from "../data/gifts";

export default function Cover({ onOpen, musicStart }) {
  const open = () => {
    musicStart(); popSound();
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.35 }, colors: CONFIG.confettiColors });
    setTimeout(onOpen, 450);
  };
  return (
    <motion.section key="cover"
      initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className="stage">
      <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}
        className="eyebrow">01 · A sealed letter for Laili</motion.p>
      <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
        className="font-display font-bold text-ink mt-4 leading-[1.05]" style={{ fontSize: "clamp(2.4rem,9vw,4.2rem)" }}>
        Something small,<br /><em className="text-pinky">kept with care.</em>
      </motion.h1>
      <motion.button onClick={open} aria-label="Ketuk kado untuk membuka kejutan"
        initial={{ scale: 0.5, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ scale: 1.06, rotate: -2 }} whileTap={{ scale: 0.94 }}
        transition={{ delay: 0.95, type: "spring", stiffness: 200, damping: 16 }}
        className="mt-8 text-[5.5rem] min-w-[88px] min-h-[88px] drop-shadow-[0_16px_30px_rgba(157,23,77,.3)]">🎁</motion.button>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-5 text-pinkdeep font-bold">Break the seal — tap the gift</motion.p>
    </motion.section>
  );
}
