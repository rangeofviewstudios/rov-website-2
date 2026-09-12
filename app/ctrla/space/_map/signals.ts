// ═══════════════════════════════════════════════════════
// SPACE — SIGNALS
//
// Three fixed beacons tucked into corners of the system nothing else
// points you at: not on the star map, not a HUD chip, not a route stop.
// Fly close enough and the ship's radio picks it up. Found once per
// device, same pattern as `visited`.
//
// Positions are hand-picked to sit clear of every orbit ring so a signal
// never reads as "just another body passing by." Fixed in world space:
// signals do not orbit.
// ═══════════════════════════════════════════════════════

export interface Signal {
  id: string;
  label: string;
  lore: string;
  pos: { x: number; z: number };
  xp: number;
}

export const SIGNALS: Signal[] = [
  {
    id: "drift-01",
    label: "Drift Signal · Alpha",
    lore: "A loop of static with a chord buried in it. Somebody's demo, sent nowhere in particular.",
    pos: { x: 250, z: -70 },
    xp: 40,
  },
  {
    id: "drift-02",
    label: "Drift Signal · Beta",
    lore: "A single frame, repeating. Whatever it was a still of, the compression ate it years ago.",
    pos: { x: -55, z: 40 },
    xp: 40,
  },
  {
    id: "drift-03",
    label: "Drift Signal · Gamma",
    lore: "A line of code with no file around it anymore. It still compiles. Nobody knows to what.",
    pos: { x: 70, z: 268 },
    xp: 40,
  },
];

export const SIGNAL_RANGE = 9;

export const signalById = (id: string) => SIGNALS.find((s) => s.id === id);
