import { motion } from "framer-motion";
import { CONFIG } from "../data/gifts";

export default function GiftGrid({ opened, onOpen }) {
  const pct = (opened.size / CONFIG.gifts.length) * 100;
  return (
    <motion.section key="grid" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-10 flex flex-col items-center justify-center p-5 text-center max-w-[640px] mx-auto overflow-y-auto">
      <h2 className="font-display text-pinkdeep text-2xl">Your 6 Gifts 🎀</h2>
      <p className="text-plum font-semibold mb-3 text-sm">Gosok tiap box buat buka kadonya 👆</p>
      <div className="text-pinkdeep font-bold mb-1" role="status">{opened.size} / {CONFIG.gifts.length} found</div>
      <div className="w-[min(300px,80vw)] h-3 bg-[#ffd3e8] rounded-full overflow-hidden mb-5">
        <div className="h-full rounded-full bg-gradient-to-r from-[#ff85c2] to-[#ff5f9e] transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="grid grid-cols-2 min-[480px]:grid-cols-3 gap-4 pb-3">
        {CONFIG.gifts.map((g, i) => {
          const open = opened.has(i);
          return (
            <motion.button key={i} onClick={() => onOpen(i)}
              initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.045, type: "spring", stiffness: 300, damping: 22 }}
              whileTap={open ? {} : { scale: 0.94 }}
              aria-label={open ? `Gift ${i + 1} terbuka: ${g.title}` : `Gift ${i + 1}`}
              className={`relative aspect-square rounded-[22px] min-w-[120px] min-h-[120px] flex flex-col items-center justify-center gap-0.5 border-[3px] transition-shadow
                ${open ? "bg-gradient-to-br from-[#fffbe6] to-[#fff0c9] border-[#ffd479] cursor-default" : "bg-gradient-to-br from-white to-[#ffeef7] border-[#ffc7e0] shadow-[0_6px_14px_rgba(224,85,154,.15)]"}`}>
              {open && <span className="absolute top-2 right-2.5">✅</span>}
              <div className="text-3xl">{open ? g.emoji : "🎁"}</div>
              <div className={`font-display text-3xl leading-none ${open ? "text-[#a16207]" : "text-[#e0559a]"}`}>{i + 1}</div>
              <div className="text-[.72rem] font-bold text-[#b06a8d] tracking-wide">{open ? "OPENED" : "GIFT BOX"}</div>
              {!open && <div className="text-[.62rem] font-bold text-[#c9a0b5] tracking-widest">👆 GOSOK</div>}
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}
