import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

const PALETTE = ["#ff85c2", "#ffb1d4", "#b57bee", "#ffd479", "#7ed6df", "#ff5f9e"];
const NEAR = 150;
const MID = 140;
const FAR = 110;

const TINTS = { cover: "#ff85c2", card: "#ff85c2", grid: "#ff85c2", box2: "#b57bee", finale: "#ffd479" };

function seeded(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SHAPES = [
  { p: [-3.4, 1.6, -1.5], c: "#ff85c2", s: 1.5, k: "rock" },
  { p: [3.2, 1.2, -2], c: "#b57bee", s: 1.1, k: "crystal" },
  { p: [-2.8, -1.8, -1], c: "#ffd479", s: 1.8, k: "donut" },
  { p: [2.9, -1.5, -0.5], c: "#7ed6df", s: 1.3, k: "rock" },
  { p: [0.2, 2.4, -2.5], c: "#ffb1d4", s: 1.4, k: "crystal" },
  { p: [-1.2, 0.4, -3], c: "#ff5f9e", s: 0.9, k: "moon" },
  { p: [1.6, -2.4, -2.2], c: "#b57bee", s: 1.2, k: "donut" },
  { p: [-4.2, -0.4, -2.6], c: "#7ed6df", s: 1.0, k: "star" },
  { p: [4.1, 2.3, -3], c: "#ffd479", s: 1.3, k: "star" },
];

function ShapeMesh({ sh, i }) {
  const geo =
    sh.k === "donut" ? <torusGeometry args={[0.3 * sh.s, 0.11 * sh.s, 12, 28]} /> :
    sh.k === "crystal" ? <octahedronGeometry args={[0.34 * sh.s, 0]} /> :
    sh.k === "moon" ? <sphereGeometry args={[0.32 * sh.s, 20, 20]} /> :
    sh.k === "star" ? <tetrahedronGeometry args={[0.4 * sh.s, 0]} /> :
      <icosahedronGeometry args={[0.32 * sh.s, 0]} />;
  return (
    <Float key={i} speed={1.9} rotationIntensity={0.7} floatIntensity={1.6}>
      <mesh position={sh.p}>
        {geo}
        <meshStandardMaterial
          color={sh.c} transparent opacity={0.55} roughness={0.25}
          emissive={sh.c} emissiveIntensity={sh.k === "moon" ? 0.55 : 0.25}
        />
      </mesh>
    </Float>
  );
}

function makeCloud(n, seed, spreadX, spreadY, zMin, zMax) {
  const rand = seeded(seed);
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    positions[i * 3] = (rand() - 0.5) * spreadX;
    positions[i * 3 + 1] = (rand() - 0.5) * spreadY;
    positions[i * 3 + 2] = zMin + rand() * (zMax - zMin);
    c.set(PALETTE[Math.floor(rand() * PALETTE.length)]);
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return g;
}

function Fireflies({ count = 30 }) {
  const refs = useRef([]);
  const data = useMemo(() => {
    const rand = seeded(99);
    return Array.from({ length: count }, () => ({
      x: (rand() - 0.5) * 11,
      y: (rand() - 0.5) * 7,
      z: -2 + rand() * 3,
      sp: 0.4 + rand() * 0.9,
      ph: rand() * Math.PI * 2,
      am: 0.3 + rand() * 0.5,
    }));
  }, [count]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    data.forEach((f, i) => {
      const m = refs.current[i];
      if (!m) return;
      m.position.set(
        f.x + Math.sin(t * f.sp + f.ph) * f.am,
        f.y + Math.cos(t * f.sp * 0.8 + f.ph) * f.am,
        f.z
      );
    });
  });
  return (
    <group>
      {data.map((f, i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }} position={[f.x, f.y, f.z]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshBasicMaterial color="#ffe9a8" transparent opacity={0.95} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function ShootingStar() {
  const ref = useRef(null);
  const st = useRef({ next: 2.5, x: 0, y: 0, vx: 0, vy: 0, life: 0 });
  useFrame(({ clock }, d) => {
    const t = clock.elapsedTime;
    const s = st.current;
    const m = ref.current;
    if (!m) return;
    if (s.life <= 0) {
      m.visible = false;
      if (t > s.next) {
        s.x = 2 + Math.random() * 3;
        s.y = 2 + Math.random() * 2;
        s.vx = -(6 + Math.random() * 3);
        s.vy = -(2.5 + Math.random() * 1.5);
        s.life = 0.9;
        m.visible = true;
      }
      return;
    }
    s.life -= d;
    s.x += s.vx * d;
    s.y += s.vy * d;
    m.position.set(s.x, s.y, -1);
    m.material.opacity = Math.max(0, Math.min(1, s.life * 2));
    if (s.life <= 0) s.next = t + 4 + Math.random() * 3;
  });
  return (
    <mesh ref={ref} visible={false}>
      <sphereGeometry args={[0.09, 10, 10]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0} />
    </mesh>
  );
}

function FogBanks() {
  const f1 = useRef(null);
  const f2 = useRef(null);
  const f3 = useRef(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (f1.current) f1.current.position.x = Math.sin(t * 0.07) * 2.2;
    if (f2.current) f2.current.position.x = Math.cos(t * 0.05) * 2.6;
    if (f3.current) f3.current.position.x = Math.sin(t * 0.04 + 2) * 3;
  });
  const mat = (o) => (
    <meshBasicMaterial color="#ffc7e3" transparent opacity={o} depthWrite={false} />
  );
  return (
    <group>
      <mesh ref={f1} position={[0, 1.4, -6]}>{<planeGeometry args={[22, 7]} />}{mat(0.10)}</mesh>
      <mesh ref={f2} position={[0, -1.6, -7]}>{<planeGeometry args={[24, 8]} />}{mat(0.08)}</mesh>
      <mesh ref={f3} position={[0, 0.2, -8]}>{<planeGeometry args={[26, 10]} />}{mat(0.06)}</mesh>
    </group>
  );
}

function Scene() {
  const group = useRef(null);
  const near = useRef(null);
  const mid = useRef(null);
  const far = useRef(null);
  const ring = useRef(null);
  const key = useRef(null);
  const rim = useRef(null);
  const burst = useRef(0);
  const px = useRef(0);
  const py = useRef(0);

  useEffect(() => {
    const fire = () => { burst.current = 1; };
    const move = (e) => {
      px.current = (e.clientX / innerWidth) * 2 - 1;
      py.current = -((e.clientY / innerHeight) * 2 - 1);
    };
    addEventListener("pointerdown", fire);
    addEventListener("pointermove", move, { passive: true });
    return () => { removeEventListener("pointerdown", fire); removeEventListener("pointermove", move); };
  }, []);

  const geoNear = useMemo(() => makeCloud(NEAR, 7, 12, 8, -4, 2), []);
  const geoMid = useMemo(() => makeCloud(MID, 13, 14, 9, -6, -1), []);
  const geoFar = useMemo(() => makeCloud(FAR, 21, 16, 11, -8, -3), []);

  useEffect(() => () => { geoNear.dispose(); geoMid.dispose(); geoFar.dispose(); }, [geoNear, geoMid, geoFar]);

  useFrame(({ camera, clock }, rawDt) => {
    const d = Math.min(rawDt, 0.05);
    const t = clock.elapsedTime;
    const damp = (cur, target, smooth) => THREE.MathUtils.damp(cur, target, smooth, d);
    group.current.rotation.y = damp(group.current.rotation.y, t * 0.05 + px.current * 0.45, 4);
    group.current.rotation.x = damp(group.current.rotation.x, py.current * 0.3, 4);
    group.current.position.y = Math.sin(t * 0.4) * 0.15;
    if (burst.current > 0) burst.current = Math.max(0, burst.current - d * 1.5);
    group.current.scale.setScalar(damp(group.current.scale.x, 1 + burst.current * 0.35, 6));
    near.current.rotation.z = t * 0.03;
    mid.current.rotation.z = -t * 0.02;
    far.current.rotation.z = -t * 0.012;
    const beat = (t * 90 / 60) % 1;
    const pulse = Math.pow(1 - beat, 2.2);
    if (key.current) key.current.intensity = 8 + pulse * 9;
    if (rim.current) rim.current.intensity = 7 + pulse * 6;
    if (ring.current) {
      const r = 1 + (1 - burst.current) * 5;
      ring.current.scale.setScalar(r);
      ring.current.material.opacity = burst.current * 0.7;
    }
    const p = Math.min(t / 1.4, 1);
    const e = 1 - Math.pow(1 - p, 3);
    const zt = 8 - (8 - 3.5) * e;
    camera.position.z = damp(camera.position.z, zt, 4);
    camera.position.x = damp(camera.position.x, px.current * 0.9, 3);
    camera.position.y = damp(camera.position.y, py.current * 0.6, 3);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight ref={key} position={[4, 3, 4]} intensity={8} color="#ff85c2" />
      <pointLight ref={rim} position={[-4, -2, 3]} intensity={7} color="#b57bee" />
      <group ref={group}>
      <points ref={far} geometry={geoFar}>
        <pointsMaterial size={0.09} vertexColors transparent opacity={0.5} sizeAttenuation depthWrite={false} />
      </points>
      <points ref={mid} geometry={geoMid}>
        <pointsMaterial size={0.12} vertexColors transparent opacity={0.7} sizeAttenuation depthWrite={false} />
      </points>
      <points ref={near} geometry={geoNear}>
        <pointsMaterial size={0.16} vertexColors transparent opacity={0.9} sizeAttenuation depthWrite={false} />
      </points>
      <Sparkles count={80} scale={[14, 9, 6]} size={3} speed={0.4} color="#ffd479" opacity={0.6} />
      <Fireflies count={30} />
      <ShootingStar />
      {SHAPES.map((sh, i) => (
        <ShapeMesh key={i} sh={sh} i={i} />
      ))}
      <mesh ref={ring} position={[0, 0, 0.5]}>
        <ringGeometry args={[0.9, 1, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      </group>
    </>
  );
}

export default function Background3D({ theme = "grid" }) {
  const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tint = TINTS[theme] || TINTS.grid;

  if (reduced) {
    return (
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(560px 420px at 50% 0%,#ffe3f1 0%,transparent 70%),radial-gradient(640px 480px at 50% 110%,#ece4ff 0%,transparent 70%),radial-gradient(400px 300px at 85% 15%,#ffd47933 0%,transparent 70%),radial-gradient(420px 320px at 12% 82%,#ff85c233 0%,transparent 70%),radial-gradient(ellipse at center, transparent 55%, rgba(157,23,77,.12) 100%),#fff5f9",
      }} aria-hidden="true">
        <div className="absolute rounded-full" style={{ left: "8%", top: "18%", width: 16, height: 16, background: "#ff85c2", opacity: 0.45 }} />
        <div className="absolute rounded-full" style={{ left: "82%", top: "14%", width: 20, height: 20, background: "#b57bee", opacity: 0.4 }} />
        <div className="absolute rounded-full" style={{ left: "12%", top: "78%", width: 14, height: 14, background: "#ffd479", opacity: 0.5 }} />
        <div className="absolute rounded-full" style={{ left: "86%", top: "72%", width: 18, height: 18, background: "#ffb1d4", opacity: 0.45 }} />
        <div className="absolute rounded-full" style={{ left: "45%", top: "8%", width: 12, height: 12, background: "#7ed6df", opacity: 0.4 }} />
        <div className="absolute rounded-full" style={{ left: "60%", top: "88%", width: 15, height: 15, background: "#ff5f9e", opacity: 0.35 }} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0" style={{ background: "#fff5f9" }} aria-hidden="true">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(560px 420px at 50% 0%,#ffe3f1 0%,transparent 70%),radial-gradient(640px 480px at 50% 110%,#ece4ff 0%,transparent 70%)",
      }} />
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 60 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <fog attach="fog" args={["#fff5f9", 9, 17]} />
        <Scene />
        <FogBanks />
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.85} luminanceThreshold={0.55} luminanceSmoothing={0.25} mipmapBlur />
          <Vignette eskil={false} offset={0.22} darkness={0.55} />
        </EffectComposer>
      </Canvas>
      <div className="absolute inset-0 pointer-events-none transition-all duration-1000" style={{
        background: `radial-gradient(600px 400px at 50% 20%, ${tint}26, transparent 70%)`,
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 58%, rgba(157,23,77,.10) 100%)",
      }} />
    </div>
  );
}

