import { motion } from "framer-motion";
import { popSound } from "../hooks/useAudio";
import { CONFIG } from "../data/gifts";

export default function CardIntro({ onStart }) {
  return (
    <motion.section key="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-10 flex flex-col items-center justify-center p-5 text-center max-w-[640px] mx-auto">
      <div className="text-6xl">💌</div>
      <h1 className="font-display text-[#e0559a] leading-tight mt-2" style={{ fontSize: "clamp(2.2rem,9vw,4rem)", textShadow: "0 2px 24px rgba(217,79,140,.18)" }}>
        Happy Birthday,<br />{CONFIG.herName}! 🎂
      </h1>
      <p className="text-plum font-semibold mt-2 max-w-[42ch]">I made 6 little gifts for you — scratch them all ✨</p>
      <button onClick={() => { popSound(); onStart(); }}
        className="mt-8 font-display text-xl px-9 py-3.5 rounded-full text-white bg-gradient-to-br from-[#ff85c2] to-[#ff5f9e] shadow-[0_8px_20px_rgba(255,95,158,.4)] active:scale-95 transition-transform">See my gifts 🎈</button>
    </motion.section>
  );
}
