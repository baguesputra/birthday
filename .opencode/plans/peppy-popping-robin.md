# Responsive + Gyro Parallax — Plan

## Context
- User: make the page fully responsive on mobile & tablet, and have the 3D background that currently follows desktop mouse also follow phone/tablet tilt/movement.
- Current `Background3D.jsx:Scene` drives parallax only from `pointermove` → `px/py` (lines ~180-188) then damped in `useFrame` (201-224). `lite` flag gated on `matchMedia("(pointer: coarse)")`, and `reduced` path already returns a static gradient. No gyro/touch handling.
- CSS `index.css:.stage` is `fixed inset-0 max-w-[640px] p-5` with `clamp()` typography already present; `index.html` already has `viewport-fit=cover`, `GiftGrid` has `grid-cols-2 → min-[480px]:grid-cols-3`, but outer stage needs real fluid padding + safe-area handling. `vite.config.js` base `/birthday/` unchanged.

## What TO do
1. **CSS (.stage) patch `index.css`**
   - `inset` with `env(safe-area-inset-*)`, `padding: clamp(16px,4vw,32px)`, `max-width` responsive (`min(640px,92vw)` mobile, `720px` on tablet), ensure `overflow-y:auto` + `-webkit-overflow-scrolling:touch`, and `min-height:100dvh` so finale letter box never collapses.
2. **Hook `useParallaxTarget()` (new `hooks/useParallax.js` or inline in `Background3D.jsx`)**
   - Single `{px,py}` ref in `[-1,1]`, merged from:
     - mouse `pointermove` (existing normalization)
     - touch `touchmove` (normalize to viewport center)
     - gyro `DeviceOrientationEvent` → `gamma/45` → px, `beta/45` → py, clamped, with `DeviceMotion` fallback
     - scroll position → subtle vertical nudge
   - Damping handled already in `useFrame` via `THREE.MathUtils.damp(..., 4)` — keep it, just feed unified refs at 60fps with `requestAnimationFrame` throttling.
3. **Patch `Scene` in `Background3D.jsx`**
   - Replace `addEventListener("pointermove"...)` block with: `pointerdown` (burst), `touchmove` (passive), `deviceorientation`/`devicemotion` (passive, feature-detected), and window `scroll`.
   - Wire capability detection: `matchMedia("(pointer: coarse)")`, `matchMedia("(prefers-reduced-motion)")`, WebGL available → set `lite` flags to tone down `Bloom`/`Sparkles`/`Fireflies` density on low-end tablets.
   - `deviceorientation` on iOS requires `DeviceOrientationEvent.requestPermission()` on user gesture — add a small "Enable motion ✨" chip in `Cover.jsx` or `CardIntro.jsx` that calls it on first tap; on deny, fall back to touch-drag parallax.
4. **QA**
   - Test portrait/landscape on phone + tablet, safe-area top/bottom, gyro permission granted/denied, scroll jank at 60fps, reduced-motion still static.

## What NOT to do / Invariants
- Don't add new UI framework or change existing route flow (`cover → card → grid → finale` stays).
- Don't break desktop mouse parallax; mouse remains highest priority, gyro is additive with a max contribution cap.
- Don't touch `userProgress` storage or business logic.
- Respect `prefers-reduced-motion: reduce` → no motion at all (existing early return stays).

## Key files
- `app/src/components/Background3D.jsx` (Scene + useFrame)
- `app/src/index.css` (.stage)
- `app/src/components/Cover.jsx` or `CardIntro.jsx` (permission prompt chip)
- `app/src/hooks/useParallax.js` (new, if not inlined)
- Config touched before: `app/vite.config.js`, `app/index.html`

## Risks & mitigations
- **iOS permission gate**: user must tap → use existing Cover gift tap as the gesture; handle promise rejection gracefully.
- **Sensor noise / jitter**: clamp to [-1,1], low-pass `damp`, cap gyro contribution to ~0.6 so mouse still dominates on hybrid devices.
- **Battery/CPU on low-end tablets**: keep `lite` path (fewer clouds, no postprocessing) when `pointer:coarse` + `deviceMemory ≤ 4`.
- **SSR / undefined window**: guard `typeof window !== "undefined"` and `matchMedia` existence.

## Verification
- `python3 -m http.server` + Chrome devtools device toolbar (iPhone SE, iPad, landscape), and real device gyro check; `npm run build` still passes (1639 modules previously).
