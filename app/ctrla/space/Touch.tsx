"use client";

// ═══════════════════════════════════════════════════════
// SPACE — TOUCH CONTROLS
//
// Phones and tablets fly the same ship. A thumb stick bottom-left (drag
// up to thrust, sideways to turn) and two hold-buttons bottom-right
// (Boost, and Dock when a ring is in range). Input goes straight into
// `frame.touch`, which the ship merges with the keyboard every frame, so
// nothing here passes through React at 60Hz. Renders only on coarse
// pointers. Nothing here imports from _scene.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import { frame, useSpace } from "./_state/useSpace";

const RADIUS = 44; // px the knob can travel
const DEAD = 0.12;

export default function Touch() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => setCoarse(window.matchMedia("(pointer: coarse)").matches), []);
  const introSeen = useSpace((s) => s.introSeen);
  const nearId = useSpace((s) => s.nearId);
  const docked = useSpace((s) => s.dockedId);
  const landed = useSpace((s) => s.landedId);
  const landing = useSpace((s) => s.landingId);
  const mapOpen = useSpace((s) => s.mapOpen);
  const logOpen = useSpace((s) => s.logOpen);
  const photo = useSpace((s) => s.photo);

  const pad = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const origin = useRef<{ x: number; y: number; id: number } | null>(null);

  // Always let go when the controls unmount or the page hides.
  useEffect(() => {
    const clear = () => {
      frame.touch.yaw = 0;
      frame.touch.thrust = 0;
      frame.touch.boost = false;
    };
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("blur", clear);
      clear();
    };
  }, []);

  if (!coarse || !introSeen || photo) return null;
  const busy = !!(docked || landed || landing || mapOpen || logOpen);

  const takeOver = () => {
    const s = useSpace.getState();
    if (s.autopilotId) {
      s.setAutopilot(null);
      frame.tookOver = true;
    }
  };

  const onDown = (e: React.PointerEvent) => {
    if (busy) return;
    origin.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    takeOver();
  };
  const onMove = (e: React.PointerEvent) => {
    const o = origin.current;
    if (!o || o.id !== e.pointerId) return;
    let dx = e.clientX - o.x;
    let dy = e.clientY - o.y;
    const len = Math.hypot(dx, dy);
    if (len > RADIUS) {
      dx = (dx / len) * RADIUS;
      dy = (dy / len) * RADIUS;
    }
    const nx = dx / RADIUS;
    const ny = dy / RADIUS;
    // Right on the stick is a right turn (the keyboard's D, which is yaw -1).
    frame.touch.yaw = Math.abs(nx) < DEAD ? 0 : -nx;
    frame.touch.thrust = ny < -DEAD ? Math.min(1, (-ny - DEAD) / (1 - DEAD)) : 0;
    frame.touch.brake = ny > 0.5;
    if (knob.current) knob.current.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  const onUp = (e: React.PointerEvent) => {
    if (origin.current?.id !== e.pointerId) return;
    origin.current = null;
    frame.touch.yaw = 0;
    frame.touch.thrust = 0;
    frame.touch.brake = false;
    if (knob.current) knob.current.style.transform = "";
  };

  const hold = (on: boolean) => () => {
    if (on) takeOver();
    frame.touch.boost = on && !busy;
  };

  return (
    <div className="ctrla-space-touch" aria-hidden={busy}>
      <div ref={pad} className="ctrla-space-stick" data-busy={busy} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <div ref={knob} className="ctrla-space-knob" />
      </div>
      <div className="ctrla-space-touch-btns">
        {nearId && !docked ? (
          <button type="button" className="ctrla-space-touch-btn" data-primary onClick={() => useSpace.getState().dock(nearId)}>
            Dock
          </button>
        ) : (
          <button type="button" className="ctrla-space-touch-btn" onPointerDown={hold(true)} onPointerUp={hold(false)} onPointerCancel={hold(false)} onPointerLeave={hold(false)}>
            Boost
          </button>
        )}
      </div>
    </div>
  );
}
