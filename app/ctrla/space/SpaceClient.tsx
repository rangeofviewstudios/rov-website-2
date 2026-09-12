"use client";

// ═══════════════════════════════════════════════════════
// SPACE — THE GATE
//
// Decides, before a single byte of three.js is requested, whether this
// visitor gets the ship or the map:
//
//   ship  WebGL available, no reduced-motion (phones included: Touch.tsx
//         gives them a stick, Scene.tsx drops the render cost)
//   map   no WebGL, reduced motion, or ?map
//
// The 3D scene is a dynamic ssr:false import behind that decision, so
// fallbacks never download it, and the magazine bundle never contains it.
// ═══════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ed } from "../_components/editorial";
import StarMap from "./StarMap";
import Hud from "./Hud";
import { track } from "./_state/track";
import { useSpaceSync } from "./_state/sync";

const Scene = dynamic(() => import("./_scene/Scene"), {
  ssr: false,
  loading: () => (
    <div style={{ position: "fixed", inset: 0, background: ed.void, display: "grid", placeItems: "center" }}>
      <span className="ctrla-space-kicker">Loading</span>
    </div>
  ),
});

type Mode = "deciding" | "ship" | "map";

function canFly(): boolean {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).has("map")) return false;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let gl = false;
  try {
    const c = document.createElement("canvas");
    gl = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {}
  return gl && !still;
}

export default function SpaceClient() {
  const [mode, setMode] = useState<Mode>("deciding");
  // The pilot log follows the account in both modes: the star map counts
  // a click-through as a visit too.
  useSpaceSync();
  useEffect(() => {
    const next = canFly() ? "ship" : "map";
    setMode(next);
    track("space_open", { mode: next });
  }, []);

  if (mode === "deciding") return <div style={{ minHeight: "100vh", background: ed.void }} />;

  if (mode === "map") {
    return (
      <main style={{ background: ed.void, minHeight: "100vh", color: ed.ink }}>
        <StarMap mode="page" />
      </main>
    );
  }

  return (
    <div className="ctrla-space" style={{ position: "fixed", inset: 0, background: ed.void }}>
      <Scene />
      <Hud />
    </div>
  );
}
