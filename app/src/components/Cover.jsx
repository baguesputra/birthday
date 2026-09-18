import { motion } from "framer-motion";
import { popSound } from "../hooks/useAudio";
import confetti from "canvas-confetti";
import { CONFIG } from "../data/gifts";

export default function Cover({ onOpen, musicStart }) {
  const open = () => {
    musicStart(); popSound();
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.35 }, colors: CONFIG.confettiColors });
    setTimeout(onOpen, 450);
  };
  return (
    <motion.section key="cover" initial={{ opacity: 0, scale: 1.15 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-10 flex flex-col items-center justify-center p-5 text-center max-w-[640px] mx-auto">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
        className="font-display text-pinkdeep text-xl mb-7 tracking-wide">A little surprise is waiting…</motion.h1>
      <motion.button onClick={open} aria-label="Ketuk kado untuk membuka kejutan"
        initial={{ scale: 0.5, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ scale: 1.06, rotate: -2 }} whileTap={{ scale: 0.94 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 16 }}
        className="text-[5.5rem] min-w-[88px] min-h-[88px] drop-shadow-[0_10px_22px_rgba(217,79,140,.28)]">🎁</motion.button>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} transition={{ delay: 1.1, duration: 0.5 }}
        className="mt-[18px] text-pinkdeep font-bold">tap the gift to open</motion.div>
    </motion.section>
  );
}
