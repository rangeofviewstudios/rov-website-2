// ═══════════════════════════════════════════════════════
// SPACE — MISSIONS
//
// A fixed contract board, six deep, checked against whatever the pilot has
// already done rather than run on a timer. Nothing here resets: dock a
// planet before ever opening the log and the mission is already ticked
// next time it's checked. Pure data + one pure evaluator, no store import,
// so `useSpace.ts` can call it without a cycle.
// ═══════════════════════════════════════════════════════

const PLANETS = ["music", "web-dev", "design", "video", "atl"];

export interface Mission {
  id: string;
  title: string;
  brief: string;
  xp: number;
}

export const MISSIONS: Mission[] = [
  { id: "first-contact", title: "First Contact", brief: "Dock at anything.", xp: 20 },
  { id: "full-throttle", title: "Full Throttle", brief: "Hold the boost for 20 seconds, total.", xp: 30 },
  { id: "touchdown", title: "Touchdown", brief: "Land the ship on a planet's pad.", xp: 25 },
  { id: "chart-system", title: "Chart the System", brief: "Dock at all five planets.", xp: 60 },
  { id: "signal-hunter", title: "Signal Hunter", brief: "Find all three drift signals.", xp: 80 },
  { id: "ace-pilot", title: "Ace Pilot", brief: "Reach the top rank.", xp: 0 },
];

export interface MissionInputs {
  visited: string[];
  dockedOnce: boolean;
  landedOnce: boolean;
  boostTime: number;
  signals: string[];
  isAce: boolean;
}

/** True if the given mission's requirement already holds. Order matches MISSIONS above. */
export function missionDone(id: string, s: MissionInputs): boolean {
  switch (id) {
    case "first-contact":
      return s.dockedOnce;
    case "full-throttle":
      return s.boostTime >= 20;
    case "touchdown":
      return s.landedOnce;
    case "chart-system":
      return PLANETS.every((p) => s.visited.includes(p));
    case "signal-hunter":
      return s.signals.length >= 3;
    case "ace-pilot":
      return s.isAce;
    default:
      return false;
  }
}

/** Every mission id newly satisfied by `s` that isn't already in `completed`. */
export function newlyCompleted(s: MissionInputs, completed: string[]): Mission[] {
  return MISSIONS.filter((m) => !completed.includes(m.id) && missionDone(m.id, s));
}
