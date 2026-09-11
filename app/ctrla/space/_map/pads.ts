// ═══════════════════════════════════════════════════════
// SPACE — LANDING PADS
//
// Every planet carries one pad: a flattened plateau with a gold ring you can
// spot from orbit. Its spot is fixed in the planet's own frame (a latitude
// and a seed-picked longitude) so it turns with the planet. Bodies.tsx
// flattens the terrain around it and writes its live world position into
// `frame.pads`; Ship.tsx descends onto it. Plain math only, no three, so the
// HUD chunk can import it too.
// ═══════════════════════════════════════════════════════

import type { CelestialBody } from "./map";

/** Pads sit a little north of the equator so the chase camera sees them. */
const PAD_LAT = 0.5;
/** Angular radius (radians) of the flattened plateau around the pad. */
export const PAD_FLAT = 0.22;
/** How far above the pad surface the ship's belly rests when landed. */
export const PAD_REST = 0.95;

export const hasPad = (b: CelestialBody) => b.kind === "planet";

/** Unit direction of the pad in the planet's local (unrotated) frame. */
export function padDir(b: CelestialBody): { x: number; y: number; z: number } {
  const lon = (b.look.seed * 2.399) % (Math.PI * 2); // golden-angle spread by seed
  const c = Math.cos(PAD_LAT);
  return { x: c * Math.cos(lon), y: Math.sin(PAD_LAT), z: c * Math.sin(lon) };
}
