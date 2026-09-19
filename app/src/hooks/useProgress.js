import { useCallback, useState } from "react";

const KEY = "laili-gifts-v2";

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}

export function useProgress() {
  const [saved] = useState(load);
  const [opened, setOpened] = useState(() => new Set(saved.opened || []));
  const [muted, setMuted] = useState(() => !!saved.muted);

  const persist = useCallback((o, m) => {
    try { localStorage.setItem(KEY, JSON.stringify({ opened: [...o], muted: m })); } catch {}
  }, []);

  const unlock = useCallback((i) => {
    setOpened((prev) => {
      if (prev.has(i)) return prev;
      const next = new Set(prev); next.add(i);
      persist(next, muted);
      return next;
    });
  }, [muted, persist]);

  const setMutedAndSave = useCallback((m) => {
    setMuted(m); persist(opened, m);
  }, [opened, persist]);

  const reset = useCallback(() => {
    setOpened(new Set());
    try { localStorage.removeItem(KEY); } catch {}
    persist(new Set(), muted);
  }, [muted, persist]);

  return { opened, muted, unlock, setMutedAndSave, reset };
}
