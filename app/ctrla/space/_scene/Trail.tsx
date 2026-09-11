"use client";

// ═══════════════════════════════════════════════════════
// SPACE — ENGINE TRAILS
//
// Ribbons of additive gold behind the ship: a comet from the engine and two
// fine threads from the wing tips. Each is a ring buffer of the last N
// emitter positions turned into a triangle strip in the flight plane, wide
// and bright at the head, thin and gone at the tail. Opacity follows speed,
// so a parked ship has no trail and a boosting one draws a comet. Ribbons
// taper in world space, so a tail passing under the chase camera stays a
// thread instead of a billboarded slab. One mesh each, updated in place.
// ═══════════════════════════════════════════════════════

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { frame, useSpace } from "../_state/useSpace";
import { FLIGHT } from "../_map/flight";

const N = 28;
const ENGINE_BACK = 2.9; // engine sprite sits this far behind the ship origin
const WING_X = 2.4; // wing tip, either side of the hull
const WING_BACK = 2.2;

interface RibbonProps {
  /** Emitter offset in ship space: +x is starboard, +z is behind. */
  offset: [number, number, number];
  /** Head half-width at rest and the extra it gains at full boost. */
  width: [number, number];
  /** Peak opacity at full boost. */
  peak: number;
  /** Colour at the head and at the tail. */
  hot: [number, number, number];
  cool: [number, number, number];
}

export default function Trail() {
  return (
    <>
      <Ribbon offset={[0, 0, ENGINE_BACK]} width={[0.08, 0.18]} peak={0.6} hot={[1.0, 0.92, 0.62]} cool={[0.76, 0.6, 0.31]} />
      <Ribbon offset={[-WING_X, -0.15, WING_BACK]} width={[0.035, 0.05]} peak={0.5} hot={[0.89, 0.76, 0.29]} cool={[0.89, 0.76, 0.29]} />
      <Ribbon offset={[WING_X, -0.15, WING_BACK]} width={[0.035, 0.05]} peak={0.5} hot={[0.89, 0.76, 0.29]} cool={[0.89, 0.76, 0.29]} />
    </>
  );
}

function Ribbon({ offset, width, peak, hot, cool }: RibbonProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const points = useRef(Array.from({ length: N }, () => new THREE.Vector3(0, 0, 44 + offset[2])));
  const lastPerp = useRef(new THREE.Vector3(1, 0, 0));
  const opacity = useRef(0);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 2 * 3), 3));
    const alpha = new Float32Array(N * 2);
    for (let i = 0; i < N; i++) {
      const a = Math.pow(1 - i / (N - 1), 1.6);
      alpha[i * 2] = a;
      alpha[i * 2 + 1] = a;
    }
    geo.setAttribute("aAlpha", new THREE.BufferAttribute(alpha, 1));
    const index: number[] = [];
    for (let i = 0; i < N - 1; i++) {
      const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
      index.push(a, b, c, b, d, c);
    }
    geo.setIndex(index);
    // The strip moves every frame; a generous static bound skips culling math.
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), FLIGHT.WORLD_RADIUS * 2);
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uOpacity: { value: 0 },
          uHot: { value: new THREE.Vector3(...hot) },
          uCool: { value: new THREE.Vector3(...cool) },
        },
        vertexShader: /* glsl */ `
          attribute float aAlpha;
          varying float vAlpha;
          void main() {
            vAlpha = aAlpha;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uOpacity;
          uniform vec3 uHot;
          uniform vec3 uCool;
          varying float vAlpha;
          void main() {
            // Hot at the head, cooling toward the tail.
            vec3 col = mix(uCool, uHot, vAlpha);
            gl_FragColor = vec4(col, vAlpha * uOpacity);
          }
        `,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const engine = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const perp = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const h = frame.shipHeading;
    const c = Math.cos(h), sn = Math.sin(h);
    const [ox, oy, oz] = offset;
    // Ship space → world: rotate the offset by the heading (ship faces -z).
    engine.set(frame.shipPosition.x + ox * c + oz * sn, frame.shipPosition.y + oy, frame.shipPosition.z - ox * sn + oz * c);

    // Advance the ring buffer only once the engine has moved a little, so a
    // slow ship draws a short trail rather than a bunched-up bright blob.
    const pts = points.current;
    if (pts[0].distanceToSquared(engine) > 0.36) {
      const tail = pts.pop()!;
      tail.copy(engine);
      pts.unshift(tail);
    } else {
      pts[0].copy(engine);
    }

    const speedNorm = Math.min(frame.shipSpeed / FLIGHT.MAX_SPEED_BOOST, 1);
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < N; i++) {
      const p = pts[i];
      const q = pts[Math.min(i + 1, N - 1)];
      dir.subVectors(p, q);
      if (dir.lengthSq() > 1e-6) {
        perp.set(-dir.z, 0, dir.x).normalize();
        lastPerp.current.copy(perp);
      } else {
        perp.copy(lastPerp.current);
      }
      const w = (width[0] + speedNorm * width[1]) * (1 - i / N);
      pos.setXYZ(i * 2, p.x + perp.x * w, p.y, p.z + perp.z * w);
      pos.setXYZ(i * 2 + 1, p.x - perp.x * w, p.y, p.z - perp.z * w);
    }
    pos.needsUpdate = true;

    // Fade with speed, eased so the trail blooms on boost instead of popping.
    // Nothing while descending or parked on a pad.
    const s = useSpace.getState();
    const grounded = !!(s.landingId || s.landedId);
    if (grounded) for (const pt of pts) pt.copy(engine);
    const want = grounded ? 0 : Math.pow(speedNorm, 1.4) * peak;
    opacity.current = THREE.MathUtils.lerp(opacity.current, want, 1 - Math.exp(-5 * dt));
    material.uniforms.uOpacity.value = opacity.current;
  });

  return <mesh ref={mesh} geometry={geometry} material={material} frustumCulled={false} />;
}
