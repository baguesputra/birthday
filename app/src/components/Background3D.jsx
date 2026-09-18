import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const PALETTE = ["#ff85c2", "#ffb1d4", "#b57bee", "#ffd479", "#7ed6df", "#ff5f9e"];
const NEAR = 110;
const FAR = 150;

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
  { p: [-3.4, 1.6, -1.5], c: "#ff85c2", s: 1.5 },
  { p: [3.2, 1.2, -2], c: "#b57bee", s: 1.1 },
  { p: [-2.8, -1.8, -1], c: "#ffd479", s: 1.8 },
  { p: [2.9, -1.5, -0.5], c: "#7ed6df", s: 1.3 },
  { p: [0.2, 2.4, -2.5], c: "#ffb1d4", s: 1.4 },
  { p: [-1.2, 0.4, -3], c: "#ff5f9e", s: 0.9 },
  { p: [1.6, -2.4, -2.2], c: "#b57bee", s: 1.2 },
];

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

function Scene() {
  const group = useRef(null);
  const near = useRef(null);
  const far = useRef(null);
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
  const geoFar = useMemo(() => makeCloud(FAR, 21, 16, 11, -8, -3), []);

  useEffect(() => () => { geoNear.dispose(); geoFar.dispose(); }, [geoNear, geoFar]);

  useFrame(({ camera, clock }, d) => {
    const t = clock.elapsedTime;
    group.current.rotation.y = t * 0.05 + px.current * 0.45;
    group.current.rotation.x = py.current * 0.3;
    group.current.position.y = Math.sin(t * 0.4) * 0.15;
    if (burst.current > 0) burst.current = Math.max(0, burst.current - d * 1.5);
    group.current.scale.setScalar(1 + burst.current * 0.35);
    near.current.rotation.z = t * 0.03;
    far.current.rotation.z = -t * 0.015;
    const p = Math.min(t / 1.4, 1);
    const e = 1 - Math.pow(1 - p, 3);
    camera.position.z += ((8 - (8 - 3.5) * e) - camera.position.z) * 0.2;
    camera.position.x += (px.current * 0.9 - camera.position.x) * 0.05;
    camera.position.y += (py.current * 0.6 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      <points ref={far} geometry={geoFar}>
        <pointsMaterial size={0.09} vertexColors transparent opacity={0.5} sizeAttenuation depthWrite={false} />
      </points>
      <points ref={near} geometry={geoNear}>
        <pointsMaterial size={0.16} vertexColors transparent opacity={0.9} sizeAttenuation depthWrite={false} />
      </points>
      {SHAPES.map((sh, i) => (
        <Float key={i} speed={1.6} rotationIntensity={0.5} floatIntensity={1.4}>
          <mesh position={sh.p}>
            <icosahedronGeometry args={[0.32 * sh.s, 0]} />
            <meshStandardMaterial color={sh.c} transparent opacity={0.5} roughness={0.3} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function Background3D({ theme = "grid" }) {
  const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tint = TINTS[theme] || TINTS.grid;

  if (reduced) {
    return (
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(560px 420px at 50% 0%,#ffe3f1 0%,transparent 70%),radial-gradient(640px 480px at 50% 110%,#ece4ff 0%,transparent 70%),#fff5f9",
      }} aria-hidden="true" />
    );
  }

  return (
    <div className="fixed inset-0" style={{ background: "#fff5f9" }} aria-hidden="true">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(560px 420px at 50% 0%,#ffe3f1 0%,transparent 70%),radial-gradient(640px 480px at 50% 110%,#ece4ff 0%,transparent 70%)",
      }} />
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <fog attach="fog" args={["#fff5f9", 9, 17]} />
        <ambientLight intensity={0.7} />
        <pointLight position={[4, 3, 4]} intensity={8} color="#ff85c2" />
        <pointLight position={[-4, -2, 3]} intensity={7} color="#b57bee" />
        <Scene />
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
