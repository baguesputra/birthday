import { useCallback, useState } from "react";

const KEY = "laili-gifts-v2";

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}

export function useProgress() {
  const [saved] = useState(load);
  const [opened, setOpened] = useState(() => new Set(saved.opened || []));
  const [box2done, setBox2done] = useState(() => !!saved.box2done);
  const [muted, setMuted] = useState(() => !!saved.muted);

  const persist = useCallback((o, m, b) => {
    try { localStorage.setItem(KEY, JSON.stringify({ opened: [...o], muted: m, box2done: b })); } catch {}
  }, []);

  const unlock = useCallback((i) => {
    setOpened((prev) => {
      if (prev.has(i)) return prev;
      const next = new Set(prev); next.add(i);
      persist(next, muted, box2done);
      return next;
    });
  }, [muted, box2done, persist]);

  const setMutedAndSave = useCallback((m) => {
    setMuted(m); persist(opened, m, box2done);
  }, [opened, box2done, persist]);

  const setBox2AndSave = useCallback(() => {
    setBox2done(true); persist(opened, muted, true);
  }, [opened, muted, persist]);

  const reset = useCallback(() => {
    setOpened(new Set()); setBox2done(false);
    try { localStorage.removeItem(KEY); } catch {}
    persist(new Set(), muted, false);
  }, [muted, persist]);

  return { opened, box2done, muted, unlock, setMutedAndSave, setBox2AndSave, reset };
}
