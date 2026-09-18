import { motion } from "framer-motion";
import { popSound } from "../hooks/useAudio";
import { CONFIG } from "../data/gifts";

const ORBITS = [
  { s: 110, d: 9, delay: 0, ch: "✨" },
  { s: 140, d: 12, delay: -4, ch: "💖" },
  { s: 170, d: 15, delay: -8, ch: "✦" },
];

export default function CardIntro({ onStart }) {
  return (
    <motion.section key="card"
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="stage">
      <motion.div className="relative"
        initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}>
        <motion.div className="glass rounded-full w-20 h-20 flex items-center justify-center text-4xl relative z-10"
          animate={{ y: [0, -8, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}>💌</motion.div>
        {ORBITS.map((o, i) => (
          <motion.span key={i} className="absolute left-1/2 top-1/2 text-lg pointer-events-none"
            style={{ width: o.s, height: o.s, x: "-50%", y: "-50%" }}
            animate={{ rotate: 360 }} transition={{ duration: o.d, repeat: Infinity, ease: "linear", delay: o.delay }}>
            <span className="absolute -top-2 left-1/2">{o.ch}</span>
          </motion.span>
        ))}
        <motion.div className="absolute inset-[-14px] -z-10 blur-xl rounded-full bg-pinky/25"
          animate={{ opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <p className="eyebrow mt-6">02 · Six keepsakes</p>
        <h1 className="font-display font-bold text-ink leading-[1.05] mt-3" style={{ fontSize: "clamp(2.2rem,8vw,3.6rem)", textShadow: "0 0 34px rgba(217,79,140,.35)" }}>
          Happy birthday,<br /><em className="text-pinky">{CONFIG.herName}.</em>
        </h1>
        <p className="text-plum font-semibold mt-3 max-w-[40ch]">Six small things I chose for you — scratch each seal to reveal why it&apos;s yours.</p>
        <motion.button onClick={() => { popSound(); onStart(); }} className="btn-love mt-8 relative overflow-hidden"
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <motion.span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ["-120%", "120%"] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} />
          <span className="relative">See my gifts 🎈</span>
        </motion.button>
      </motion.div>
    </motion.section>
  );
}
