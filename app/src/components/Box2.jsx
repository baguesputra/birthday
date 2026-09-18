import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { CONFIG } from "../data/gifts";
import { winSound } from "../hooks/useAudio";
import confetti from "canvas-confetti";
import { Stepper } from "./GiftGrid";

export default function Box2({ onDone }) {
  const file = useRef(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState("");

  const pick = (e) => {
    if (!e.target.files.length) return;
    setBusy(true); setResult("");
    setTimeout(() => {
      setBusy(false);
      winSound();
      try { if (navigator.vibrate) navigator.vibrate(20); } catch { /* noop */ }
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.4 }, colors: CONFIG.confettiColors });
      setResult(`${CONFIG.box2.answer.split("").join(" ")} 🤍`);
      setTimeout(onDone, 1800);
    }, 1200);
  };

  return (
    <motion.section key="box2"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="stage overflow-y-auto">
      <Stepper active={2} />
      <p className="eyebrow">Box 2 · A hidden name</p>
      <h1 className="font-display font-bold text-ink mt-2 leading-[1.05]" style={{ fontSize: "clamp(2rem,7vw,3rem)" }}>
        Not just snacks —<br /><em className="text-pinky">a name in disguise.</em>
      </h1>
      <div className="glass rounded-[24px] p-6 mt-5 max-w-[46ch] text-left">
        <p className="text-plum font-semibold leading-relaxed">Inside this box are a few snacks. Look at each one, one by one.<br /><br /><b className="text-ink">Don&apos;t eat them yet.</b> 😄<br /><br />Arrange them by the <b className="text-ink">first letter of each name</b>, then photograph the arrangement below.</p>
        <p className="text-plum font-semibold mt-3 text-sm opacity-85">Hint: not the whole name — just the <b className="text-ink">first letter</b> of each snack.<br /><b className="text-ink">Arrange → Photo → Scan → Find the answer</b></p>
      </div>
      <input ref={file} type="file" accept="image/*" capture="environment" hidden onChange={pick} />
      <button disabled={busy} onClick={() => file.current.click()} className="btn-love mt-6">
        {busy ? "⏳ Reading the arrangement…" : "📷 Scan Susunan Snack"}
      </button>
      {result && <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="font-display font-bold text-pinkdeep mt-5 text-2xl tracking-[0.3em]" role="status">{result}</motion.div>}
    </motion.section>
  );
}
