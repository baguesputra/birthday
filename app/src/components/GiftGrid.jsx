import { motion } from "framer-motion";
import { CONFIG } from "../data/gifts";

const STEPS = ["cover", "keepsakes", "box 2", "letter"];
export function Stepper({ active }) {
  return (
    <ol className="flex items-center gap-2 mb-5" aria-label="Progress">
      {STEPS.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span className={`h-1.5 rounded-full transition-all ${i < active ? "w-8 bg-pinky" : i === active ? "w-8 bg-pinkdeep" : "w-4 bg-pinkdeep/20"}`} />
          <span className="sr-only">{s}</span>
        </li>
      ))}
    </ol>
  );
}

export default function GiftGrid({ opened, onOpen }) {
  const pct = (opened.size / CONFIG.gifts.length) * 100;
  return (
    <motion.section key="grid"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="stage overflow-y-auto">
      <Stepper active={1} />
      <p className="eyebrow">Keepsakes · {opened.size} of {CONFIG.gifts.length}</p>
      <h2 className="font-display font-bold text-ink text-3xl mt-2">Six things, <em className="text-pinky">six reasons.</em></h2>
      <div className="w-[min(300px,80vw)] h-2 bg-pinkdeep/10 rounded-full overflow-hidden mt-4 mb-6" role="progressbar" aria-valuenow={opened.size} aria-valuemin={0} aria-valuemax={6}>
        <motion.div className="h-full rounded-full bg-gradient-to-r from-[#ff85c2] to-pinky"
          animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
      </div>
      <div className="grid grid-cols-2 min-[480px]:grid-cols-3 gap-4 pb-3 w-full max-w-[480px]">
        {CONFIG.gifts.map((g, i) => {
          const open = opened.has(i);
          return (
            <motion.button key={i} onClick={() => onOpen(i)}
              initial={{ opacity: 0, y: 14, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 280, damping: 22 }}
              whileHover={open ? {} : { y: -4 }} whileTap={open ? {} : { scale: 0.94 }}
              aria-label={open ? `Gift ${i + 1} terbuka: ${g.title}` : `Gift ${i + 1}: gosok untuk membuka`}
              className={`glass relative aspect-square rounded-[22px] flex flex-col items-center justify-center gap-1 p-3 text-left
                ${open ? "!bg-[#FFFBEB] border-[#ffd479]/70 cursor-default" : "cursor-pointer"}`}>
              <span className="eyebrow !text-[9px] self-start">No. {i + 1}</span>
              {open && <span className="absolute top-2 right-2.5" aria-hidden="true">✅</span>}
              <div className="text-4xl mt-1" aria-hidden="true">{open ? g.emoji : "🎁"}</div>
              <div className="font-display font-bold text-ink text-[1.05rem] leading-tight">{open ? g.title : "Sealed keepsake"}</div>
              <div className="text-[.68rem] font-bold tracking-[0.18em] text-pinkdeep/70">{open ? "OPENED" : "👆 GOSOK"}</div>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}
