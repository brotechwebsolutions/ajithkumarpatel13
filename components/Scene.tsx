"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { ReactNode, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const STONE = "#d9d3c5";
const DARK = "#2a2825";
const ORANGE = "#ff6a3d";
const STEEL = "#8b9096";
const EDGE = "#0b0a09";
const CAM_Z = 8;
const FOV = 40;
const Motion = createContext(true);

type V3 = [number, number, number];

function Block({ w, h, d, color, pos = [0, 0, 0] }: { w: number; h: number; d: number; color: string; pos?: V3 }) {
  return (
    <mesh position={pos}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={color} roughness={0.85} />
      <Edges color={color === DARK ? "#6b665d" : EDGE} />
    </mesh>
  );
}

function Anchor({ id, z = 0, scale = 1, children }: { id: string; z?: number; scale?: number; children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const el = useRef<Element | null>(null);
  useFrame(({ size }) => {
    const g = group.current;
    if (!g) return;
    if (!el.current) el.current = document.querySelector(`[data-obj="${id}"]`);
    if (!el.current) { g.visible = false; return; }
    const r = el.current.getBoundingClientRect();
    if (r.bottom < -150 || r.top > size.height + 150) { g.visible = false; return; }
    g.visible = true;
    const halfH = Math.tan((FOV * Math.PI) / 360) * (CAM_Z - z);
    const halfW = (halfH * size.width) / size.height;
    g.position.set(((r.left + r.width / 2) / size.width * 2 - 1) * halfW, (1 - ((r.top + r.height / 2) / size.height) * 2) * halfH, z);
    g.scale.setScalar(Math.max(0.55, Math.min(1, size.width / 1000)) * scale);
  });
  return <group ref={group}>{children}</group>;
}

function Spin({ children, tiltX = 0.4, speed = 0.25 }: { children: ReactNode; tiltX?: number; speed?: number }) {
  const ref = useRef<THREE.Group>(null);
  const animate = useContext(Motion);
  useFrame(({ clock, pointer }) => {
    const g = ref.current;
    if (!g) return;
    const t = animate ? clock.elapsedTime : 0;
    g.rotation.y = t * speed + (animate ? pointer.x * 0.5 + window.scrollY * 0.0008 : 0.6);
    g.rotation.x = tiltX + (animate ? pointer.y * 0.2 : 0);
  });
  return <group ref={ref}>{children}</group>;
}

const LAYERS = [
  { y: -1.2, w: 3.4, d: 2.2, c: STONE },
  { y: -0.6, w: 3.0, d: 2.0, c: STONE },
  { y: 0, w: 2.6, d: 1.8, c: ORANGE },
  { y: 0.6, w: 3.0, d: 2.0, c: STONE },
  { y: 1.2, w: 2.2, d: 1.5, c: DARK },
];

function Stack() {
  const ref = useRef<THREE.Group>(null);
  const animate = useContext(Motion);
  useFrame(({ clock }) => {
    const t = animate ? clock.elapsedTime : 0;
    ref.current?.children.forEach((c, i) => { c.position.y = LAYERS[i].y * (1.15 + 0.2 * Math.sin(t * 0.8 + i)); });
  });
  return (
    <Spin tiltX={0.45}>
      <group ref={ref}>{LAYERS.map((l) => <Block key={l.y} w={l.w} h={0.12} d={l.d} color={l.c} />)}</group>
    </Spin>
  );
}

const BARS = [0.8, 1.3, 0.6, 1.7, 1.0];

function Bars() {
  const ref = useRef<THREE.Group>(null);
  const animate = useContext(Motion);
  useFrame(({ clock }) => {
    const t = animate ? clock.elapsedTime : 0;
    ref.current?.children.forEach((c, i) => {
      const h = BARS[i] * (1 + 0.25 * Math.sin(t * 1.2 + i * 1.3));
      c.scale.y = h;
      c.position.y = 0.06 + h / 2;
    });
  });
  return (
    <Spin tiltX={0.5} speed={0.18}>
      <Block w={3.4} h={0.12} d={1.3} color={DARK} pos={[0, -0.7, 0]} />
      <group position={[0, -0.7, 0]} ref={ref}>
        {BARS.map((h, i) => (
          <mesh key={i} position={[(i - 2) * 0.64, 0, 0]} scale={[0.4, h, 0.4]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={i === 3 ? ORANGE : STONE} roughness={0.85} />
            <Edges color={EDGE} />
          </mesh>
        ))}
      </group>
    </Spin>
  );
}

const SLICES = [
  { a: 2.3, c: ORANGE },
  { a: 1.7, c: STONE },
  { a: 1.3, c: STEEL },
  { a: Math.PI * 2 - 5.3, c: DARK },
];

function Donut() {
  const ref = useRef<THREE.Group>(null);
  const animate = useContext(Motion);
  const geos = useMemo(
    () => SLICES.map((s) => {
      const shape = new THREE.Shape();
      shape.absarc(0, 0, 1.3, 0, s.a, false);
      shape.absarc(0, 0, 0.62, s.a, 0, true);
      shape.closePath();
      return new THREE.ExtrudeGeometry(shape, { depth: 0.4, bevelEnabled: false, curveSegments: 28 });
    }),
    [],
  );
  const starts = SLICES.map((_, i) => SLICES.slice(0, i).reduce((n, s) => n + s.a, 0));
  useFrame(({ clock }) => {
    const t = animate ? clock.elapsedTime : 0;
    ref.current?.children.forEach((c, i) => {
      const mid = starts[i] + SLICES[i].a / 2;
      const push = 0.1 * (1 + Math.sin(t * 1.5 + i));
      c.position.set(Math.cos(mid) * push, Math.sin(mid) * push, 0);
    });
  });
  return (
    <Spin tiltX={0.9} speed={0.2}>
      <group ref={ref} position={[0, 0, -0.2]}>
        {SLICES.map((s, i) => (
          <group key={i} rotation={[0, 0, starts[i]]}>
            <mesh geometry={geos[i]}>
              <meshStandardMaterial color={s.c} roughness={0.85} />
              <Edges threshold={20} color={s.c === DARK ? "#6b665d" : EDGE} />
            </mesh>
          </group>
        ))}
      </group>
    </Spin>
  );
}

const CELLS: { p: V3; c: string }[] = [];
for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
  const i = CELLS.length;
  CELLS.push({ p: [x * 0.6, y * 0.6, z * 0.6], c: i % 9 === 4 ? ORANGE : i % 5 === 0 ? DARK : STONE });
}

function Lattice() {
  const ref = useRef<THREE.Group>(null);
  const animate = useContext(Motion);
  useFrame(({ clock }) => {
    const t = animate ? clock.elapsedTime : 0;
    ref.current?.children.forEach((c, i) => {
      const [x, y, z] = CELLS[i].p;
      c.scale.setScalar(0.62 + 0.38 * (0.5 + 0.5 * Math.sin(t * 1.4 + (x + y + z) * 2)));
    });
  });
  return (
    <Spin tiltX={0.5} speed={0.22}>
      <group ref={ref}>
        {CELLS.map((cell, i) => (
          <mesh key={i} position={cell.p}>
            <boxGeometry args={[0.42, 0.42, 0.42]} />
            <meshStandardMaterial color={cell.c} roughness={0.85} />
            <Edges color={cell.c === DARK ? "#6b665d" : EDGE} />
          </mesh>
        ))}
      </group>
    </Spin>
  );
}

function Orbit() {
  const moon = useRef<THREE.Mesh>(null);
  const animate = useContext(Motion);
  useFrame(({ clock }) => {
    const t = animate ? clock.elapsedTime : 0.8;
    moon.current?.position.set(Math.cos(t * 0.9) * 1.5, Math.sin(t * 0.9) * 1.5, 0);
  });
  return (
    <Spin tiltX={0.5} speed={0.1}>
      <mesh>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial color={STONE} flatShading roughness={0.9} />
        <Edges threshold={1} color={EDGE} />
      </mesh>
      <group rotation={[Math.PI / 2.4, 0, 0.3]}>
        <mesh>
          <torusGeometry args={[1.5, 0.04, 12, 90]} />
          <meshStandardMaterial color={ORANGE} />
        </mesh>
        <mesh ref={moon}>
          <sphereGeometry args={[0.17, 18, 18]} />
          <meshStandardMaterial color={ORANGE} />
        </mesh>
      </group>
    </Spin>
  );
}

function Redraw({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!active) return;
    const go = () => invalidate();
    window.addEventListener("scroll", go, { passive: true });
    window.addEventListener("resize", go);
    const timers = [200, 800, 2000].map((ms) => window.setTimeout(go, ms));
    go();
    return () => {
      window.removeEventListener("scroll", go);
      window.removeEventListener("resize", go);
      timers.forEach(clearTimeout);
    };
  }, [active, invalidate]);
  return null;
}

export default function Scene() {
  const [reduce, setReduce] = useState(false);
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreferences = () => {
      setReduce(motionPreference.matches);
      setSmall(window.innerWidth < 860);
    };

    updatePreferences();
    window.addEventListener("resize", updatePreferences);
    motionPreference.addEventListener("change", updatePreferences);

    return () => {
      window.removeEventListener("resize", updatePreferences);
      motionPreference.removeEventListener("change", updatePreferences);
    };
  }, []);

  const animate = !reduce && !small;
  return (
    <Canvas
      frameloop={animate ? "always" : "demand"}
      camera={{ position: [0, 0, CAM_Z], fov: FOV }}
      dpr={small ? 1 : [1, 1.5]}
      gl={{ alpha: true, antialias: !small }}
    >
      <Motion.Provider value={animate}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 5]} intensity={2.2} />
        <directionalLight position={[-5, -2, 3]} intensity={0.8} />
        <Redraw active={!animate} />
        <Anchor id="stack"><Stack /></Anchor>
        <Anchor id="bars"><Bars /></Anchor>
        <Anchor id="donut"><Donut /></Anchor>
        <Anchor id="lattice"><Lattice /></Anchor>
        <Anchor id="orbit"><Orbit /></Anchor>
        <Anchor id="education"><Stack /></Anchor>
        <Anchor id="certifications"><Orbit /></Anchor>
        <Anchor id="stack-end" scale={0.7}><Stack /></Anchor>
      </Motion.Provider>
    </Canvas>
  );
}
