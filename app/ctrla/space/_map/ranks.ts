// ═══════════════════════════════════════════════════════
// SPACE — RANKS
//
// One XP number drives everything: a title, a trim color unlocked on the
// ship, and how full the HUD's rank bar reads. Pure data, no three, so the
// HUD chunk reads it directly.
// ═══════════════════════════════════════════════════════

export interface Rank {
  id: string;
  title: string;
  xp: number;
  /** Hex accent unlocked at this rank: wing edge, tail fin, engine glow. */
  trim: string;
}

export const RANKS: Rank[] = [
  { id: "cadet", title: "Cadet", xp: 0, trim: "#E3C24A" },
  { id: "pilot", title: "Pilot", xp: 150, trim: "#6FE3D9" },
  { id: "voyager", title: "Voyager", xp: 400, trim: "#D96FE0" },
  { id: "navigator", title: "Navigator", xp: 800, trim: "#C7CDD6" },
  { id: "ace", title: "Ace", xp: 1500, trim: "#FF5A3C" },
];

/** The highest rank reached at this xp total. */
export function rankFor(xp: number): Rank {
  let r = RANKS[0];
  for (const rank of RANKS) if (xp >= rank.xp) r = rank;
  return r;
}

/** The next rank up, or null at the top. */
export function nextRank(xp: number): Rank | null {
  return RANKS.find((r) => r.xp > xp) ?? null;
}

/** Every trim unlocked at this xp total, cadet gold first. */
export function unlockedTrims(xp: number): Rank[] {
  return RANKS.filter((r) => xp >= r.xp);
}
