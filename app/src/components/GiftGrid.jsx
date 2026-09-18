import { useState } from "react";
import { motion } from "framer-motion";
import { CONFIG } from "../data/gifts";

const STEPS = ["cover", "keepsakes", "box 2", "letter"];
export function Stepper({ active }) {
  return (
    <ol className="flex items-center gap-2 mb-5" aria-label="Progress">
      {STEPS.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <motion.span
            className={`h-1.5 rounded-full ${i <= active ? "bg-pinky" : "bg-pinkdeep/20"}`}
            animate={{ width: i < active ? 32 : i === active ? 32 : 16 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
          />
          <span className="sr-only">{s}</span>
        </li>
      ))}
    </ol>
  );
}

function GiftBox({ g, i, open, onOpen }) {
  const [lid, setLid] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const revealed = open || lid;

  const click = () => {
    if (open) return;
    if (lid) { onOpen(i); return; }
    setLid(true);
    setTimeout(() => onOpen(i), 650);
  };
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top) / r.height - 0.5) * -14,
      y: ((e.clientX - r.left) / r.width - 0.5) * 14,
    });
  };

  return (
    <motion.button onClick={click} onMouseMove={move} onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      initial={{ opacity: 0, y: 14, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: i * 0.06, type: "spring", stiffness: 280, damping: 22 }}
      whileTap={open ? {} : { scale: 0.94 }}
      aria-label={open ? `Gift ${i + 1} terbuka: ${g.title}` : `Gift ${i + 1}: buka kotaknya`}
      className={`glass relative rounded-[22px] flex flex-col items-center gap-1 p-3 pt-4 text-center min-h-[190px]
        ${open ? "!bg-[#FFFBEB] border-[#ffd479]/70 cursor-default" : "cursor-pointer"}`}>
      <span className="eyebrow !text-[9px] self-start">No. {i + 1}</span>
      {open && <span className="absolute top-2 right-2.5" aria-hidden="true">✅</span>}
      <div className={`gift3d ${revealed ? "is-open" : ""}`} style={{ "--rx": `${tilt.x}deg`, "--ry": `${tilt.y}deg` }} aria-hidden="true">
        <div className="gift3d-scene">
          <div className="gift3d-glow" />
          <div className="gift3d-body" />
          <div className="gift3d-lid"><span className="gift3d-knot">🎀</span></div>
          <motion.div className="gift3d-pop"
            initial={false}
            animate={revealed ? { scale: 1, y: -6, opacity: 1 } : { scale: 0.4, y: 14, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 17 }}>
            {g.emoji}
          </motion.div>
        </div>
      </div>
      <div className="font-display font-bold text-ink text-[1.02rem] leading-tight mt-1">{revealed ? g.title : "Sealed keepsake"}</div>
      <div className="text-[.68rem] font-bold tracking-[0.18em] text-pinkdeep/70">{open ? "OPENED" : "🎁 BUKA"}</div>
    </motion.button>
  );
}

export default function GiftGrid({ opened, onOpen }) {
  const pct = (opened.size / CONFIG.gifts.length) * 100;
  return (
    <motion.section key="grid"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="stage overflow-y-auto">
      <Stepper active={1} />
      <p className="eyebrow">Keepsakes · {opened.size} of {CONFIG.gifts.length}</p>
      <h2 className="font-display font-bold text-ink text-3xl mt-2">Six things, <em className="text-pinky">six reasons.</em></h2>
      <div className="w-[min(300px,80vw)] h-2 bg-pinkdeep/10 rounded-full overflow-hidden mt-4 mb-6" role="progressbar" aria-valuenow={opened.size} aria-valuemin={0} aria-valuemax={6}>
        <motion.div className="h-full rounded-full bg-gradient-to-r from-[#ff85c2] to-pinky progress-shimmer"
          animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
      </div>
      <div className="grid grid-cols-2 min-[480px]:grid-cols-3 gap-4 pb-3 w-full max-w-[480px]">
        {CONFIG.gifts.map((g, i) => (
          <GiftBox key={i} g={g} i={i} open={opened.has(i)} onOpen={onOpen} />
        ))}
      </div>
    </motion.section>
  );
}
