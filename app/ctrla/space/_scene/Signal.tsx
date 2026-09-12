"use client";

// ═══════════════════════════════════════════════════════
// SPACE — DRIFT SIGNALS
//
// The three hidden beacons. Each is a slow-blinking point of light with a
// faint ring around it: visible up close, easy to miss from a cruise. The
// HUD never marks them; what it gets instead is `frame.signalNear`, the
// distance to the closest one still unfound, which it draws as a radio
// meter that fills as you close in. Found ones stop rendering for good.
//
// Proximity is checked here, in the frame loop, because this is where the
// ship position and the beacon positions already are.
// ═══════════════════════════════════════════════════════

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { SIGNALS, SIGNAL_RANGE } from "../_map/signals";
import { frame, useSpace } from "../_state/useSpace";

const GOLD = "#E3C24A";

function makeGlow() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,244,210,1)");
  g.addColorStop(0.25, "rgba(227,194,74,0.7)");
  g.addColorStop(1, "rgba(227,194,74,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export default function Signals() {
  const tex = useMemo(makeGlow, []);
  return (
    <>
      {SIGNALS.map((s, i) => (
        <Beacon key={s.id} id={s.id} x={s.pos.x} z={s.pos.z} phase={i * 2.1} tex={tex} />
      ))}
    </>
  );
}

function Beacon({ id, x, z, phase, tex }: { id: string; x: number; z: number; phase: number; tex: THREE.Texture }) {
  const group = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Sprite>(null);
  const ring = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const found = useSpace((s) => s.signals.includes(id));

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    if (found) {
      g.visible = false;
      return;
    }
    g.visible = true;
    const t = clock.elapsedTime + phase;
    // A slow, deliberate blink: two beats, then dark. Reads as a signal, not a star.
    const cycle = t % 2.6;
    const blink = cycle < 0.18 ? 1 : cycle > 0.34 && cycle < 0.52 ? 1 : 0.18;
    const s = 2.2 + blink * 1.6;
    if (glow.current) glow.current.scale.set(s, s, 1);
    if (light.current) light.current.intensity = 0.4 + blink * 2.2;
    if (ring.current) {
      ring.current.rotation.y = t * 0.6;
      ring.current.rotation.x = Math.sin(t * 0.4) * 0.5;
      (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.18 + blink * 0.32;
    }
    g.position.y = Math.sin(t * 0.9) * 0.8;

    // Proximity: report the closest unfound beacon, and trigger the find.
    const d = Math.hypot(frame.shipPosition.x - x, frame.shipPosition.z - z);
    const near = frame.signalNear;
    if (near.id === id || d < near.dist) {
      near.id = id;
      near.dist = d;
    }
    if (d < SIGNAL_RANGE && useSpace.getState().introSeen) {
      near.id = null;
      near.dist = Infinity;
      useSpace.getState().foundSignal(id);
    }
  });

  return (
    <group ref={group} position={[x, 0, z]}>
      <sprite ref={glow}>
        <spriteMaterial map={tex} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <mesh ref={ring}>
        <torusGeometry args={[2.4, 0.05, 6, 48]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial color="#F0E6E0" emissive={GOLD} emissiveIntensity={1.4} flatShading />
      </mesh>
      <pointLight ref={light} color={GOLD} intensity={1} distance={22} />
    </group>
  );
}
