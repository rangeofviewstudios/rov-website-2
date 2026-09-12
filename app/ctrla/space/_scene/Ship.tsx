"use client";

// ═══════════════════════════════════════════════════════
// SPACE — THE SHIP
//
// Flight model, chase camera, docking, landing, liftoff, FPS meter. Deliberately
// no physics engine: a ship in empty space is thrust, damping, and a
// heading. Flight is planar (the ecliptic), which is what makes it
// navigable instead of nauseating, and the camera lag + FOV stretch is what
// makes it feel fast.
//
// The parking problem is solved in three layers:
//   envelope   inside 4× dock range the speed cap falls with distance, so
//              the ship settles toward a body instead of overshooting it
//   magnetic   sit still inside the ring for a second and it docks itself;
//              E docks now, W waves off
//   no-clip    bodies push the ship out; you cannot fly through the sun
//
// Landing is its own mode: from the dock panel, "Land" hands the ship to a
// scripted descent. It slides around the planet to sit above the pad, drops
// through the atmosphere (heat, shake, retro burn), and settles on the pad
// with its belly to the surface. Liftoff kicks it back into free flight.
//
// Everything per-frame lives in refs. React only hears about it when the
// near/docked body changes.
// ═══════════════════════════════════════════════════════

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { BODIES, bodyById, restPosition, type CelestialBody } from "../_map/map";
import { FLIGHT, dockRange } from "../_map/flight";
import { PAD_REST } from "../_map/pads";
import { RANKS } from "../_map/ranks";
import { frame, useSpace } from "../_state/useSpace";

export { dockRange };

const { ACCEL, ACCEL_BOOST, MAX_SPEED, MAX_SPEED_BOOST, WORLD_RADIUS } = FLIGHT;
const TURN_SLOW = 2.8; // rad/s when parked
const TURN_FAST = 1.6; // rad/s at full boost
const ENVELOPE = 4; // × dock range
const PARK_SPEED = 8; // cap at the ring
const MAGNET_SPEED = 6; // must be under this to start the fill
const MAGNET_TIME = 1.0; // seconds inside the ring before auto-dock
const DESCENT_TIME = 4.6; // seconds from "Land" to touchdown
const ASCEND_TIME = 1.4; // seconds of scripted climb after liftoff

const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** Spawn beside a `?at=` stop, facing it, or at the default pad if none. */
function spawn(): { pos: THREE.Vector3; heading: number } {
  const fallback = { pos: new THREE.Vector3(0, 0, 44), heading: 0 };
  if (typeof window === "undefined") return fallback;
  const at = new URLSearchParams(window.location.search).get("at");
  const body = at ? bodyById(at) : null;
  if (!body) return fallback;
  const rest = restPosition(body.id);
  // Park just outside the dock ring, on the side away from the sun, so the
  // first thing in view is the stop and the sun is behind it. The sun sits
  // at the origin, so "away" is undefined there; park on +z like the pad.
  const len = Math.hypot(rest.x, rest.z);
  const out = dockRange(body.size) + 9;
  const ux = len > 1e-3 ? rest.x / len : 0;
  const uz = len > 1e-3 ? rest.z / len : 1;
  const pos = new THREE.Vector3(rest.x + ux * out, 0, rest.z + uz * out);
  const heading = Math.atan2(-(rest.x - pos.x), -(rest.z - pos.z));
  return { pos, heading };
}

/** Ship-space engine offset, shared with the trail so the ribbon starts at the nozzles. */
export const ENGINE_Z = 3.5;

export default function Ship() {
  const group = useRef<THREE.Group>(null);
  const engine = useRef<THREE.Sprite>(null);
  const hullRef = useRef<THREE.Mesh>(null);
  const navL = useRef<THREE.Mesh>(null);
  const navR = useRef<THREE.Mesh>(null);
  const beacon = useRef<THREE.Mesh>(null);
  const coreL = useRef<THREE.Mesh>(null);
  const coreR = useRef<THREE.Mesh>(null);
  const boostAcc = useRef(0);
  const { camera } = useThree();
  // The trim colour is the one piece of React state the ship reads: it
  // changes when the pilot picks a new one in the log, which is rare, and
  // R3F pushes the new colour into the materials on that render.
  const trimId = useSpace((s) => s.trim);
  const trim = RANKS.find((r) => r.id === trimId)?.trim ?? RANKS[0].trim;

  // ── frame state ──
  // The ship manages its own physics state locally. It only writes out to
  // the global frame state so the HUD can read it without tearing.
  const start = useMemo(spawn, []);
  const pos = useRef(start.pos.clone());
  const vel = useRef(new THREE.Vector3());
  const heading = useRef(start.heading);
  const pitch = useRef(0);
  const roll = useRef(0);
  const camRoll = useRef(0);
  const keys = useRef(new Set<string>());
  const fpsAcc = useRef({ frames: 0, t: 0 });
  const shake = useRef(0);
  const fill = useRef(0);
  const magnetArmed = useRef(true);
  const wasDocked = useRef(false);
  const parkAngle = useRef(0);
  const parkRadius = useRef(0);
  // ── landing state ──
  const descent = useRef(0); // 0..1 progress from "Land" to touchdown
  const descentR = useRef(0); // radius from the planet centre when descent began
  const ascend = useRef(0); // seconds of scripted climb left after liftoff
  const wasLanded = useRef(false);
  const surfUp = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const surfFwd = useMemo(() => new THREE.Vector3(0, 0, -1), []);
  const surfRight = useMemo(() => new THREE.Vector3(), []);
  const padN = useMemo(() => new THREE.Vector3(), []);
  const qTarget = useMemo(() => new THREE.Quaternion(), []);
  const mBasis = useMemo(() => new THREE.Matrix4(), []);
  const eul = useMemo(() => new THREE.Euler(), []);
  const camUp = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const camTarget = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const fwd = useMemo(() => new THREE.Vector3(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  // Engine glow texture: a soft radial white dot, drawn once. White so the
  // sprite's colour (the trim) is what tints it.
  const glowTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);

  // Put the camera on the ship before the first frame so a deep-link spawn
  // does not swoop in from the default pad.
  useEffect(() => {
    fwd.set(-Math.sin(heading.current), 0, -Math.cos(heading.current));
    camera.position.copy(pos.current).addScaledVector(fwd, -19).setY(9.5);
    lookTarget.copy(pos.current).addScaledVector(fwd, 11);
    camera.lookAt(lookTarget);
    frame.shipPosition.x = pos.current.x;
    frame.shipPosition.z = pos.current.z;
    frame.shipHeading = heading.current;
  }, [camera, fwd, lookTarget]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys.current.add(k);
      // Any flight input hands control back from the autopilot.
      if (["w", "a", "s", "d", " ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
        if (useSpace.getState().autopilotId) {
          useSpace.getState().setAutopilot(null);
          frame.tookOver = true;
        }
        if (k.startsWith("arrow") || k === " ") e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const blur = () => keys.current.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt, 0.05); // never let a hitch teleport the ship
    const g = group.current;
    if (!g) return;
    const state = useSpace.getState();
    const k = keys.current;
    const docked = !!state.dockedId;
    const groundId = state.landingId ?? state.landedId;
    const padRec = groundId ? frame.pads.get(groundId) : null;
    const groundCenter = groundId ? frame.bodyPositions.get(groundId) : null;
    // Grounded: the scripted descent or parked on the pad. Flight input,
    // the envelope, and no-clip all stand down.
    const grounded = !!(groundId && padRec && groundCenter);
    // Diving straight into a page from a dock ring (moons, the sun, the
    // station): the old camera dive, kept for bodies without a pad.
    const dive = state.enteringId && !state.landedId ? frame.bodyPositions.get(state.enteringId) : null;

    // ── nearest body, once, for the envelope, the ring, and no-clip ──
    let nearest: CelestialBody | null = null;
    let nearestD = Infinity;
    for (const b of BODIES) {
      const p = frame.bodyPositions.get(b.id);
      if (!p) continue;
      const d = Math.hypot(p.x - pos.current.x, p.z - pos.current.z);
      if (d < nearestD) {
        nearestD = d;
        nearest = b;
      }
    }

    // ── input ──
    // WASD = forward / brake / turn left / turn right
    // Up/Down arrows = gentle vertical rise/descend
    let thrust = k.has("w") ? 1 : 0;
    const brakeInput = k.has("s") || k.has(" ");
    let yaw = (k.has("a") ? 1 : 0) - (k.has("d") ? 1 : 0);
    const verticalInput = (k.has("arrowup") ? 1 : 0) - (k.has("arrowdown") ? 1 : 0);
    let boost = k.has("shift");
    const manualYaw = yaw !== 0;

    // ── autopilot: steer toward the target, dock on arrival ──
    const ap = state.autopilotId;
    if (ap && !docked && !grounded) {
      const target = frame.bodyPositions.get(ap);
      const body = bodyById(ap);
      if (target && body) {
        const dx = target.x - pos.current.x;
        const dz = target.z - pos.current.z;
        const dist = Math.hypot(dx, dz);
        const want = Math.atan2(-dx, -dz);
        const diff = wrapAngle(want - heading.current);
        yaw = THREE.MathUtils.clamp(diff * 3, -1, 1);
        thrust = Math.abs(diff) < 0.5 ? THREE.MathUtils.clamp((dist - dockRange(body.size)) / 40, 0.15, 1) : 0;
        boost = false;
        if (dist < dockRange(body.size) * 0.95) {
          vel.current.set(0, 0, 0);
          state.dock(ap);
        }
      } else {
        state.setAutopilot(null);
      }
    }

    // ── approach envelope: the speed cap falls as a body gets close ──
    let cap: number = boost ? MAX_SPEED_BOOST : MAX_SPEED;
    let inEnvelope = false;
    let heat = 0;
    if (nearest && !docked && !grounded) {
      const dr = dockRange(nearest.size);
      const env = dr * ENVELOPE;
      const np = frame.bodyPositions.get(nearest.id)!;
      const nx = (pos.current.x - np.x) / (nearestD || 1);
      const nz = (pos.current.z - np.z) / (nearestD || 1);
      const closing = -(vel.current.x * nx + vel.current.z * nz) > 0.5 || vel.current.lengthSq() < 1;
      if (nearestD < env && closing) {
        inEnvelope = true;
        const t = THREE.MathUtils.clamp((nearestD - dr) / (env - dr), 0, 1);
        cap = THREE.MathUtils.lerp(PARK_SPEED, MAX_SPEED, t * t);
        boost = false;
        if (nearest.kind === 'planet') {
           const currentSpeed = vel.current.length();
           heat = THREE.MathUtils.clamp((currentSpeed - PARK_SPEED) / (MAX_SPEED - PARK_SPEED), 0, 1) * Math.sin(t * Math.PI);
        }
      }
    }
    frame.approachId = inEnvelope && nearest ? nearest.id : null;

    // ── flight model (planar + gentle vertical) ──
    if (docked || grounded) {
      thrust = 0;
      yaw = 0;
      boost = false;
    }
    // Liftoff climb: the ship throttles itself up and away from the pad.
    if (ascend.current > 0) {
      ascend.current -= dt;
      thrust = 1;
      yaw = 0;
    }
    const speedNow = vel.current.length();
    const turnRate = THREE.MathUtils.lerp(TURN_SLOW, TURN_FAST, speedNow / MAX_SPEED_BOOST);
    heading.current += yaw * turnRate * dt;
    // Forward vector stays on the XZ plane
    fwd.set(-Math.sin(heading.current), 0, -Math.cos(heading.current));

    const boosting = boost && thrust > 0 && !docked;
    if (boosting) frame.boosted = true;
    const accel = boost ? ACCEL_BOOST : ACCEL;
    if (thrust > 0) vel.current.addScaledVector(fwd, accel * thrust * dt);

    // Gentle vertical movement via arrow keys (much slower than horizontal)
    const VERTICAL_SPEED = 12;
    if (verticalInput !== 0 && !docked) {
      vel.current.y += verticalInput * VERTICAL_SPEED * dt;
    }
    // Vertical damping — always ease back toward Y=0 plane gently
    vel.current.y *= Math.exp(-2.0 * dt);

    // Coasting bleeds speed slowly; braking bleeds it fast.
    const horizSpeed = Math.hypot(vel.current.x, vel.current.z);
    if (horizSpeed > 0) {
      const damp = Math.exp(-(brakeInput ? 4.5 : 0.9) * dt);
      vel.current.x *= damp;
      vel.current.z *= damp;
    }
    
    // Anti-drift: lock horizontal velocity to face direction
    let speed = Math.hypot(vel.current.x, vel.current.z);
    if (speed > 0 && !docked) {
      vel.current.x = fwd.x * speed;
      vel.current.z = fwd.z * speed;
    }

    if (speed > cap) {
      const eased = THREE.MathUtils.lerp(speed, cap, 1 - Math.exp(-6 * dt));
      vel.current.x *= eased / speed;
      vel.current.z *= eased / speed;
      speed = eased;
    }

    if (grounded && padRec && groundCenter && groundId) {
      const body = bodyById(groundId)!;
      padN.set(padRec.nx, padRec.ny, padRec.nz);
      const padR = Math.hypot(padRec.x - groundCenter.x, padRec.y - groundCenter.y, padRec.z - groundCenter.z);
      // Where the ship is, as a direction + radius from the planet's centre.
      tmp.copy(pos.current).sub(groundCenter);
      const rNow = Math.max(tmp.length(), 1e-3);
      tmp.divideScalar(rNow);
      if (state.landingId) {
        if (descent.current === 0) {
          descentR.current = rNow;
          surfUp.copy(tmp);
          surfFwd.copy(fwd);
        }
        descent.current = Math.min(1, descent.current + dt / DESCENT_TIME);
        const u = descent.current;
        // Slide around the globe to sit over the pad, then sink onto it.
        // Direction converges fast; radius follows a fixed ease so touchdown
        // lands exactly on time.
        if (tmp.dot(padN) < -0.985) tmp.y += 0.1; // antipodal: pick a way round
        tmp.lerp(padN, 1 - Math.exp(-2.6 * dt)).normalize();
        const ease = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
        const rGoal = THREE.MathUtils.lerp(Math.max(descentR.current, padR + body.size * 0.9), padR + PAD_REST, ease);
        pos.current.copy(groundCenter).addScaledVector(tmp, rGoal);
        // Atmosphere: heat peaks mid-descent, then the retro burn takes over.
        heat = Math.sin(THREE.MathUtils.clamp(u / 0.75, 0, 1) * Math.PI) * 0.9;
        if (u >= 1) {
          descent.current = 0;
          state.touchdown();
        }
      } else {
        // Parked on the pad: ride the planet's rotation.
        pos.current.copy(groundCenter).addScaledVector(padN, padR + PAD_REST);
        tmp.copy(padN);
      }
      // Belly to the surface, nose along the last direction of travel.
      surfUp.lerp(tmp, 1 - Math.exp(-4 * dt)).normalize();
      surfFwd.addScaledVector(surfUp, -surfFwd.dot(surfUp));
      if (surfFwd.lengthSq() < 1e-4) surfFwd.set(1, 0, 0).addScaledVector(surfUp, -surfUp.x);
      surfFwd.normalize();
      surfRight.crossVectors(surfUp, surfFwd).normalize();
      // Ship model faces -z, so the basis z is -forward.
      mBasis.makeBasis(surfRight, surfUp, tmp.copy(surfFwd).negate());
      qTarget.setFromRotationMatrix(mBasis);
      g.quaternion.slerp(qTarget, 1 - Math.exp(-5 * dt));
      vel.current.set(0, 0, 0);
      speed = 0;
      heading.current = Math.atan2(-surfFwd.x, -surfFwd.z);
      fwd.copy(surfFwd);
      parkRadius.current = 0;
    } else if (docked && state.dockedId) {
      // Parked orbit: circle the body slowly so the panel sits over a
      // moving planet, and hand control back cleanly on undock.
      const body = bodyById(state.dockedId)!;
      const p = frame.bodyPositions.get(state.dockedId)!;
      if (parkRadius.current === 0) {
        parkAngle.current = Math.atan2(pos.current.z - p.z, pos.current.x - p.x);
        parkRadius.current = Math.max(Math.hypot(pos.current.x - p.x, pos.current.z - p.z), body.size * 1.5);
      }
      parkAngle.current += dt * 0.22;
      parkRadius.current = THREE.MathUtils.lerp(parkRadius.current, dockRange(body.size) * 0.8, 1 - Math.exp(-1.5 * dt));
      pos.current.set(p.x + Math.cos(parkAngle.current) * parkRadius.current, 0, p.z + Math.sin(parkAngle.current) * parkRadius.current);
      // Face along the orbit.
      const wantHeading = -parkAngle.current;
      heading.current += wrapAngle(wantHeading - heading.current) * (1 - Math.exp(-3 * dt));
      fwd.set(-Math.sin(heading.current), 0, -Math.cos(heading.current));
      vel.current.set(0, 0, 0);
      speed = 0;
    } else {
      parkRadius.current = 0;
      pos.current.addScaledVector(vel.current, dt);
    }

    // ── no-clip: bodies push the ship out ──
    if (!docked && !grounded && ascend.current <= 0) {
      for (const b of BODIES) {
        const p = frame.bodyPositions.get(b.id);
        if (!p) continue;
        const min = b.size * 1.35 + 1.2;
        const dx = pos.current.x - p.x;
        const dy = pos.current.y - (p.y || 0);
        const dz = pos.current.z - p.z;
        const d = Math.hypot(dx, dy, dz);
        if (d < min && d > 1e-4) {
          const nx = dx / d;
          const ny = dy / d;
          const nz = dz / d;
          pos.current.x = p.x + nx * min;
          pos.current.y = (p.y || 0) + ny * min;
          pos.current.z = p.z + nz * min;
          const inward = vel.current.x * nx + vel.current.y * ny + vel.current.z * nz;
          if (inward < 0) {
            vel.current.x -= nx * inward * 1.4;
            vel.current.y -= ny * inward * 1.4;
            vel.current.z -= nz * inward * 1.4;
          }
        }
      }
    }

    // Soft edge of the world: past the last orbit, space gently pushes back.
    const r = Math.hypot(pos.current.x, pos.current.z);
    if (r > WORLD_RADIUS) {
      frame.edged = true;
      const push = (r - WORLD_RADIUS) * 0.8;
      vel.current.x -= (pos.current.x / r) * push * dt;
      vel.current.z -= (pos.current.z / r) * push * dt;
    }
    
    // Ceiling/Floor
    const CEILING = 200;
    if (Math.abs(pos.current.y) > CEILING) {
      const push = (Math.abs(pos.current.y) - CEILING) * 0.8;
      vel.current.y -= Math.sign(pos.current.y) * push * dt;
    }

    // Bank into turns, and a touch more when fast.
    roll.current = THREE.MathUtils.lerp(roll.current, -yaw * (0.5 + (speed / MAX_SPEED_BOOST) * 0.25), 1 - Math.exp(-6 * dt));

    g.position.copy(pos.current);
    if (!grounded) {
      if (ascend.current > 0) {
        // Climbing out: roll from belly-down to level flight.
        eul.set(0, heading.current, roll.current);
        qTarget.setFromEuler(eul);
        g.quaternion.slerp(qTarget, 1 - Math.exp(-3 * dt));
      } else {
        g.rotation.set(0, heading.current, roll.current);
      }
    }

    // ── liftoff: the moment the pad lets go ──
    if (wasLanded.current && !grounded) {
      ascend.current = ASCEND_TIME;
      vel.current.copy(surfUp).multiplyScalar(15).addScaledVector(surfFwd, 6);
      magnetArmed.current = false;
      descent.current = 0;
    }
    wasLanded.current = grounded;
    frame.shipPosition.x = pos.current.x;
    frame.shipPosition.y = pos.current.y;
    frame.shipPosition.z = pos.current.z;
    frame.shipSpeed = speed;
    frame.shipHeading = heading.current;

    const burn = state.landingId ? 0.9 * (1 - descent.current) : state.landedId ? 0 : thrust;
    if (engine.current) {
      const s = 0.9 + burn * (boost ? 2.2 : 1.4) + speed / (MAX_SPEED * 1.5);
      engine.current.scale.set(s, s, 1);
    }
    // Nozzle cores brighten with the burn; boost pushes them past white.
    const coreGlow = 0.6 + burn * (boosting ? 3.2 : 1.6);
    for (const c of [coreL.current, coreR.current]) {
      if (c) (c.material as THREE.MeshStandardMaterial).emissiveIntensity = coreGlow;
    }
    // Nav lights: aviation convention, red port / green starboard, a slow
    // double-blink. The beacon on the fin strobes faster.
    {
      const t = clock.elapsedTime;
      const cyc = t % 2.0;
      const nav = cyc < 0.12 || (cyc > 0.3 && cyc < 0.42) ? 3.5 : 0.35;
      if (navL.current) (navL.current.material as THREE.MeshStandardMaterial).emissiveIntensity = nav;
      if (navR.current) (navR.current.material as THREE.MeshStandardMaterial).emissiveIntensity = nav;
      const strobe = (t * 1.6) % 1 < 0.08 ? 4 : 0.5;
      if (beacon.current) (beacon.current.material as THREE.MeshStandardMaterial).emissiveIntensity = strobe;
    }
    // Boost time feeds Full Throttle. Batched to the store twice a second so
    // the 60Hz path never touches React.
    if (boosting) boostAcc.current += dt;
    if (boostAcc.current > 0 && (!boosting || boostAcc.current >= 0.5)) {
      state.addBoostTime(boostAcc.current);
      boostAcc.current = 0;
    }

    // ── docking: the ring, and the magnetic fill ──
    if (wasDocked.current && !docked) magnetArmed.current = false; // just undocked: leave the ring first
    wasDocked.current = docked;
    if (grounded) {
      state.setNear(null);
      fill.current = 0;
    } else if (!docked) {
      const inRing = nearest && nearestD < dockRange(nearest.size) ? nearest.id : null;
      state.setNear(inRing);
      if (!inRing) magnetArmed.current = true;
      if (inRing && magnetArmed.current && state.introSeen && speed < MAGNET_SPEED && thrust === 0 && !ap) {
        fill.current += dt / MAGNET_TIME;
        if (fill.current >= 1) {
          fill.current = 0;
          vel.current.set(0, 0, 0);
          state.dock(inRing);
        }
      } else {
        fill.current = Math.max(0, fill.current - dt * 3);
      }
    } else {
      fill.current = 0;
    }
    frame.dockFill = fill.current;

    // ── camera ──
    const cam = camera as THREE.PerspectiveCamera;
    let wantFov: number;
    if (grounded) {
      // Surface camera: behind and above the ship in the pad's own frame,
      // so the terrain rises into view as the ship sinks. Once parked it
      // drifts slowly round the ship.
      if (state.landedId) {
        const a = clock.elapsedTime * 0.12;
        camTarget.copy(pos.current).addScaledVector(surfUp, 4.2).addScaledVector(surfFwd, -Math.cos(a) * 12).addScaledVector(surfRight, Math.sin(a) * 12);
        wantFov = 44;
      } else {
        const u = descent.current;
        camTarget.copy(pos.current).addScaledVector(surfUp, 5.5 + (1 - u) * 3).addScaledVector(surfFwd, -(13 + (1 - u) * 6));
        wantFov = 50;
      }
      camera.position.lerp(camTarget, 1 - Math.exp(-3.2 * dt));
      shake.current = THREE.MathUtils.lerp(shake.current, heat * 2.5, 1 - Math.exp(-9 * dt));
      if (shake.current > 0.01) {
        const t = clock.elapsedTime;
        const a = shake.current * 0.16;
        camera.position.addScaledVector(surfRight, Math.sin(t * 41) * a).addScaledVector(surfUp, Math.sin(t * 53 + 1.3) * a * 0.7);
      }
      camUp.lerp(surfUp, 1 - Math.exp(-4 * dt)).normalize();
      camera.up.copy(camUp);
      lookTarget.copy(pos.current).addScaledVector(surfUp, 0.8);
      camera.lookAt(lookTarget);
    } else if (dive && state.enteringId) {
      // Page dive for pad-less stops: fall toward the body from wherever the
      // camera is, tightening the lens, until the HUD's colour wipe takes over.
      const body = bodyById(state.enteringId)!;
      tmp.copy(camera.position).sub(dive).setY(0);
      if (tmp.lengthSq() < 1e-4) tmp.set(0, 0, 1);
      tmp.normalize();
      camTarget.copy(dive).addScaledVector(tmp, body.size * 2.2).setY(body.size * 0.9);
      camera.position.lerp(camTarget, 1 - Math.exp(-2.4 * dt));
      camera.lookAt(dive);
      wantFov = 36;
    } else {
      // Chase: lag behind, pull back and widen with speed.
      const speedNorm = speed / MAX_SPEED_BOOST;
      const dist = 19 + speedNorm * 9;
      const height = 9.5 + speedNorm * 3;
      camTarget.copy(pos.current).addScaledVector(fwd, -dist).setY(height);
      camera.position.lerp(camTarget, 1 - Math.exp(-4.5 * dt));
      // Boost shake: a small, fast wobble that rises with the boost and
      // settles as soon as Shift lifts. Plus reentry heat shake.
      shake.current = THREE.MathUtils.lerp(shake.current, boosting ? 1 : (heat * 2.5), 1 - Math.exp(-(boosting ? 5 : 9) * dt));
      if (shake.current > 0.01) {
        const t = clock.elapsedTime;
        const a = shake.current * 0.16;
        camera.position.x += Math.sin(t * 41) * a;
        camera.position.y += Math.sin(t * 53 + 1.3) * a * 0.7;
      }
      lookTarget.copy(pos.current).addScaledVector(fwd, 11);
      // The camera rolls a beat behind the ship, so turns feel physical.
      camRoll.current = THREE.MathUtils.lerp(camRoll.current, roll.current * 0.35, 1 - Math.exp(-3.5 * dt));
      up.set(Math.sin(camRoll.current), Math.cos(camRoll.current), 0);
      camUp.lerp(up, 1 - Math.exp(-(ascend.current > 0 ? 2.5 : 12) * dt)).normalize();
      camera.up.copy(camUp);
      camera.lookAt(lookTarget);
      wantFov = 55 + speedNorm * 17 + shake.current * 4;
    }
    if (Math.abs(cam.fov - wantFov) > 0.05) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, wantFov, 1 - Math.exp(-3 * dt));
      cam.updateProjectionMatrix();
    }

    // ── fps meter, once a second ──
    fpsAcc.current.frames++;
    fpsAcc.current.t += rawDt;
    if (fpsAcc.current.t >= 1) {
      state.setFps(Math.round(fpsAcc.current.frames / fpsAcc.current.t));
      fpsAcc.current.frames = 0;
      fpsAcc.current.t = 0;
    }

    if (hullRef.current) {
      const mat = hullRef.current.material as THREE.MeshStandardMaterial;
      mat.emissive.setHex(0xff3300);
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, heat * 2.5, 0.1);
    }
  });

  // ── the ship ──
  // Nose toward -z. Three-part fuselage (paper-white nose and body, night
  // tail) with a glass canopy, a dorsal fin, swept wings with winglets, and
  // twin nozzles. Every accent (spine stripe, wing edges, fin tip, nozzle
  // cores, engine glow) wears the trim colour, so a rank-up reads on the
  // ship itself and not just in the log. Still low-poly and flat-shaded on
  // purpose: it has to sit in the same world as the procedural planets.
  const PAPER = "#F0E6E0";
  const NIGHT = "#24123A";
  const STEEL = "#3A2A4A";
  return (
    <group ref={group}>
      {/* Nose cone */}
      <mesh position={[0, 0, -2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.92, 2.6, 8]} />
        <meshStandardMaterial color={PAPER} flatShading roughness={0.55} />
      </mesh>
      {/* Mid fuselage: the piece that glows on reentry */}
      <mesh ref={hullRef} position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.92, 1.06, 2.6, 8]} />
        <meshStandardMaterial color={PAPER} flatShading roughness={0.55} />
      </mesh>
      {/* Tail taper, night, into the nozzle block */}
      <mesh position={[0, 0, 2.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.06, 0.62, 1.5, 8]} />
        <meshStandardMaterial color={NIGHT} flatShading roughness={0.65} />
      </mesh>
      {/* Spine stripe, trim */}
      <mesh position={[0, 0.98, 0.35]}>
        <boxGeometry args={[0.16, 0.05, 3.6]} />
        <meshStandardMaterial color={trim} emissive={trim} emissiveIntensity={0.7} />
      </mesh>
      {/* Canopy: dark glass with a paper frame line */}
      <mesh position={[0, 0.72, -0.85]} scale={[0.52, 0.42, 1.15]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color="#1A0F2E" roughness={0.15} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.66, -0.85]} rotation={[Math.PI / 2, 0, 0]} scale={[0.56, 1.2, 1]}>
        <torusGeometry args={[1, 0.04, 6, 24]} />
        <meshStandardMaterial color={PAPER} roughness={0.5} />
      </mesh>
      {/* Dorsal fin with a trim tip and the strobe beacon */}
      <group position={[0, 0.95, 2.05]} rotation={[0.18, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 1.1, 1.3]} />
          <meshStandardMaterial color={NIGHT} flatShading roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.58, -0.1]}>
          <boxGeometry args={[0.13, 0.14, 1.0]} />
          <meshStandardMaterial color={trim} emissive={trim} emissiveIntensity={0.7} />
        </mesh>
        <mesh ref={beacon} position={[0, 0.7, -0.45]}>
          <sphereGeometry args={[0.1, 8, 6]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
        </mesh>
      </group>
      {/* Wings: swept, night, trim leading edge, winglet, nav light */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 1.15, -0.12, 1.0]} rotation={[0, side * -0.38, side * 0.1]}>
          <mesh>
            <boxGeometry args={[2.9, 0.14, 1.7]} />
            <meshStandardMaterial color={NIGHT} flatShading roughness={0.7} />
          </mesh>
          {/* Paper panel on the wing root so it reads as the same craft as the hull */}
          <mesh position={[side * -0.6, 0.08, 0.15]}>
            <boxGeometry args={[1.2, 0.02, 1.1]} />
            <meshStandardMaterial color={PAPER} flatShading roughness={0.55} />
          </mesh>
          {/* Leading edge, trim */}
          <mesh position={[0, 0, -0.84]}>
            <boxGeometry args={[2.9, 0.16, 0.08]} />
            <meshStandardMaterial color={trim} emissive={trim} emissiveIntensity={0.55} />
          </mesh>
          {/* Wingtip edge, trim */}
          <mesh position={[side * 1.47, 0, 0]}>
            <boxGeometry args={[0.12, 0.2, 1.7]} />
            <meshStandardMaterial color={trim} emissive={trim} emissiveIntensity={0.6} />
          </mesh>
          {/* Winglet */}
          <mesh position={[side * 1.42, 0.32, 0.25]} rotation={[0, 0, side * 0.15]}>
            <boxGeometry args={[0.08, 0.55, 1.0]} />
            <meshStandardMaterial color={NIGHT} flatShading roughness={0.7} />
          </mesh>
          {/* Nav light: red port, green starboard */}
          <mesh ref={side < 0 ? navL : navR} position={[side * 1.5, 0.62, 0.0]}>
            <sphereGeometry args={[0.11, 8, 6]} />
            <meshStandardMaterial color={side < 0 ? "#FF3B3B" : "#3BFF7A"} emissive={side < 0 ? "#FF3B3B" : "#3BFF7A"} emissiveIntensity={0.4} />
          </mesh>
        </group>
      ))}
      {/* Twin nozzles with trim-lit cores */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.42, -0.05, 3.05]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.38, 0.8, 10]} />
            <meshStandardMaterial color={STEEL} roughness={0.4} metalness={0.7} flatShading />
          </mesh>
          <mesh ref={side < 0 ? coreL : coreR} position={[0, 0, 0.41]}>
            <circleGeometry args={[0.24, 12]} />
            <meshStandardMaterial color={trim} emissive={trim} emissiveIntensity={0.8} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
      {/* Engine glow, trim-tinted */}
      <sprite ref={engine} position={[0, 0, ENGINE_Z]}>
        <spriteMaterial map={glowTex} color={trim} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      {/* A small local light so the hull reads even far from the sun. */}
      <pointLight position={[0, 2, 1]} intensity={0.6} distance={14} color={trim} />
    </group>
  );
}
