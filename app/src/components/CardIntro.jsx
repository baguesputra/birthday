import { motion } from "framer-motion";
import { popSound } from "../hooks/useAudio";
import { CONFIG } from "../data/gifts";

export default function CardIntro({ onStart }) {
  return (
    <motion.section key="card"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="stage">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        className="glass rounded-full w-20 h-20 flex items-center justify-center text-4xl">💌</motion.div>
      <p className="eyebrow mt-6">02 · Six keepsakes</p>
      <h1 className="font-display font-bold text-ink leading-[1.05] mt-3" style={{ fontSize: "clamp(2.2rem,8vw,3.6rem)" }}>
        Happy birthday,<br /><em className="text-pinky">{CONFIG.herName}.</em>
      </h1>
      <p className="text-plum font-semibold mt-3 max-w-[40ch]">Six small things I chose for you — scratch each seal to reveal why it&apos;s yours.</p>
      <button onClick={() => { popSound(); onStart(); }} className="btn-love mt-8">See my gifts 🎈</button>
    </motion.section>
  );
}
