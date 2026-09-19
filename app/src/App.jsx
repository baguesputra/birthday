import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SpeakerXMarkIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import Cover from "./components/Cover";
import CardIntro from "./components/CardIntro";
import GiftGrid from "./components/GiftGrid";
import ScratchModal from "./components/ScratchModal";
import Finale from "./components/Finale";
import { useProgress } from "./hooks/useProgress";
import { useMusic, popSound } from "./hooks/useAudio";
import { CONFIG } from "./data/gifts";

const Background3D = lazy(() => import("./components/Background3D"));

export default function App() {
  const { opened, muted, unlock, setMutedAndSave, reset } = useProgress();
  const { start, toggle } = useMusic(muted, setMutedAndSave);
  const [screen, setScreen] = useState("cover");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");

  const toastTimer = useRef(0);

  const showToast = useCallback((m) => {
    setToast(m);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  }, []);

  useEffect(() => {
    if (opened.size === CONFIG.gifts.length && screen === "grid") {
      const t = setTimeout(() => setScreen("finale"), 900);
      return () => clearTimeout(t);
    }
  }, [opened.size, screen]);

  const openBox = (i) => {
    if (opened.has(i)) { showToast("Sudah terbuka 💕"); return; }
    setModal(i); popSound();
  };

  const replay = () => {
    if (!confirm("Ulangi dari awal? Progres terhapus.")) return;
    reset(); setScreen("grid");
  };

  const fullscreen = () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    } catch { /* noop */ }
  };

  return (
    <div className="min-h-dvh">
      <Suspense fallback={<div className="fixed inset-0" style={{ background: "#fff5f9" }} aria-hidden="true" />}>
        <Background3D theme={screen} />
      </Suspense>
      <AnimatePresence mode="wait">
        {screen === "cover" && <Cover key="c" onOpen={() => setScreen("card")} musicStart={start} />}
        {screen === "card" && <CardIntro key="i" onStart={() => setScreen("grid")} />}
        {screen === "grid" && <GiftGrid key="g" opened={opened} onOpen={openBox} />}
        {screen === "finale" && <Finale key="f" onReplay={replay} />}
      </AnimatePresence>
      <AnimatePresence>
        {modal !== null && (
          <ScratchModal key="m" index={modal}
            onClose={() => { setModal(null); showToast(`💕 ${opened.size} / ${CONFIG.gifts.length} found!`); }}
            onUnlock={unlock} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="fixed left-1/2 bottom-6 -translate-x-1/2 z-[60] glass !rounded-full text-ink font-bold px-5 py-3 max-w-[90vw]" role="status">{toast}</motion.div>
        )}
      </AnimatePresence>
      <button onClick={toggle} aria-label="Musik on/off" aria-pressed={String(!muted)}
        className="glass fixed top-[14px] right-[70px] z-50 w-12 h-12 !rounded-full flex items-center justify-center text-xl active:scale-90">
        {muted ? <SpeakerXMarkIcon className="h-5 w-5" /> : <SpeakerWaveIcon className="h-5 w-5" />}
      </button>
      <button onClick={fullscreen} aria-label="Layar penuh"
        className="glass fixed top-[14px] right-[14px] z-50 w-12 h-12 !rounded-full flex items-center justify-center text-xl active:scale-90">
        <ArrowsPointingOutIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
