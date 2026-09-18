import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { CONFIG } from "../data/gifts";
import { winSound } from "../hooks/useAudio";
import confetti from "canvas-confetti";

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
    <motion.section key="box2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-10 flex flex-col items-center justify-center p-5 text-center max-w-[640px] mx-auto overflow-y-auto">
      <div className="text-6xl">🎁</div>
      <h1 className="font-display text-[#e0559a] mt-1" style={{ fontSize: "clamp(1.8rem,7vw,2.8rem)" }}>Box 2</h1>
      <p className="text-plum font-semibold mt-2 max-w-[42ch]">Kali ini bukan sekadar membuka hadiah.<br /><br />Di dalam box ini ada beberapa snack. Coba perhatikan satu per satu.<br /><br /><b>Jangan langsung dimakan.</b> 😄<br /><br />Susun snack-snack tersebut berdasarkan <b>huruf pertama dari namanya</b>.<br /><br />Kalau sudah tersusun, ambil fotonya menggunakan tombol di bawah.</p>
      <p className="text-plum font-semibold mt-3 text-sm opacity-85 max-w-[42ch]">Petunjuk: yang dicari bukan nama snack-nya secara keseluruhan, tapi <b>huruf pertama</b> dari setiap snack.<br /><br /><b>Susun → Foto → Scan → Temukan jawabannya</b></p>
      <input ref={file} type="file" accept="image/*" capture="environment" hidden onChange={pick} />
      <button disabled={busy} onClick={() => file.current.click()}
        className="mt-6 font-display text-xl px-9 py-3.5 rounded-full text-white bg-gradient-to-br from-[#ff85c2] to-[#ff5f9e] shadow-[0_8px_20px_rgba(255,95,158,.4)] disabled:opacity-50">
        {busy ? "⏳ Membaca susunan…" : "📷 Scan Susunan Snack"}
      </button>
      {result && <div className="text-pinkdeep font-bold mt-4 text-xl tracking-widest" role="status">{result}</div>}
    </motion.section>
  );
}
