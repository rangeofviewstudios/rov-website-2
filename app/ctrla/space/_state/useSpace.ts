"use client";

// ═══════════════════════════════════════════════════════
// SPACE — STATE
//
// Two kinds of state, kept deliberately apart:
//
//   1. Reactive UI state (zustand): what the HUD and dock panel render from.
//      Changes a few times a minute.
//   2. Frame state (plain refs below): ship position, body positions, speed.
//      Changes 60 times a second and must NEVER pass through React, or the
//      whole tree re-renders at 60fps and the feel test fails on the spot.
//
// The pilot log (xp, rank, missions, signals, trim) is reactive state too:
// every mutation goes through `settle()` at the bottom, which re-checks the
// mission board and pays out, so the HUD only ever reads finished numbers.
// ═══════════════════════════════════════════════════════

import { create } from "zustand";
import type { Vector3 } from "three";
import { track } from "./track";
import { RANKS, rankFor } from "../_map/ranks";
import { MISSIONS, newlyCompleted, type MissionInputs } from "../_map/missions";
import { signalById } from "../_map/signals";

/** The pilot log on the wire: what the account stores, nothing else. */
export interface PilotWire {
  xp: number;
  boostTime: number;
  visited: string[];
  landed: string[];
  signals: string[];
  missions: string[];
  trim: string;
}

export interface Toast {
  key: number;
  kind: "mission" | "rank" | "signal";
  title: string;
  sub?: string;
}

interface SpaceState {
  /** Body the ship is close enough to dock with, or null. */
  nearId: string | null;
  /** Body the ship is docked at (panel open), or null. */
  dockedId: string | null;
  /** Body the autopilot is flying toward, or null for manual flight. */
  autopilotId: string | null;
  /** Stops the pilot has docked at this browser, persisted. */
  visited: string[];
  /** True once the intro card has been dismissed (persisted). */
  introSeen: boolean;
  /** Star-map overlay open (M key). */
  mapOpen: boolean;
  /** Rolling FPS, updated at most once a second, for the HUD meter. */
  fps: number;
  /** Current render scale (device pixel ratio the canvas draws at). */
  quality: number;
  /** Planet the ship is descending onto, or null. */
  landingId: string | null;
  /** Planet the ship is parked on the pad of, or null. */
  landedId: string | null;
  /** Body whose page is opening (colour wipe running), or null. */
  enteringId: string | null;
  /** Photo mode: HUD hidden, gold frame on. P key. */
  photo: boolean;
  /** The suggested line through the system, as body ids. */
  route: string[];
  /** Index into `route` of the next waypoint; == route.length when done. */
  step: number;
  /** Vue's bubble hidden for the session. H key. */
  guideHidden: boolean;

  // ── Pilot log: the one XP economy behind rank, missions, signals, trim ──
  /** Lifetime XP on this device, persisted. */
  xp: number;
  /** Seconds of boost held, lifetime, persisted. Feeds Full Throttle. */
  boostTime: number;
  /** Planets the ship has touched down on, persisted. */
  landed: string[];
  /** Drift signals picked up on this device, persisted. */
  signals: string[];
  /** Mission ids already paid out, persisted. */
  completedMissions: string[];
  /** Rank id whose trim colour the ship wears, persisted. */
  trim: string;
  /** Pilot log panel open (L key). */
  logOpen: boolean;
  /** Beat toasts waiting to show, head first. */
  toasts: Toast[];

  setNear: (id: string | null) => void;
  dock: (id: string) => void;
  undock: () => void;
  setAutopilot: (id: string | null) => void;
  dismissIntro: () => void;
  toggleMap: (open?: boolean) => void;
  setFps: (fps: number) => void;
  setQuality: (quality: number) => void;
  /** Start the descent to a planet's pad. */
  land: (id: string) => void;
  /** The ship has settled on the pad: surface panel opens. */
  touchdown: () => void;
  /** Leave the pad and hand control back. */
  liftoff: () => void;
  /** Open the body's page: wipe, then route. */
  enter: (id: string) => void;
  togglePhoto: (on?: boolean) => void;
  setRoute: (ids: string[]) => void;
  toggleGuide: (hidden?: boolean) => void;
  /** Add XP, announce a rank-up if one lands, then re-check the board. */
  addXp: (amount: number, reason: string) => void;
  /** Boost seconds this frame; batched by the ship, persisted rarely. */
  addBoostTime: (dt: number) => void;
  /** The radio caught a drift signal. Once per id. */
  foundSignal: (id: string) => void;
  setTrim: (rankId: string) => void;
  toggleLog: (open?: boolean) => void;
  /** Drop the toast at the head of the queue. */
  shiftToast: () => void;
  /** The pilot log as the account stores it. */
  pilotWire: () => PilotWire;
  /**
   * Apply the account's merged copy. Lists union, numbers take the max,
   * so this can only ever add. Then the board settles, so a mission the
   * other device earned pays out here too. Sets `hydrating` while it
   * runs so the sync hook does not push the result straight back.
   */
  hydrate: (p: PilotWire) => void;
  /** True while `hydrate` is writing; the sync hook ignores those changes. */
  hydrating: boolean;
}

const CHARTED_KEY = "ctrla-space-charted";
/** Every planet id. Docking at all of them is the one achievement. */
const PLANETS = ["music", "web-dev", "design", "video", "atl"];

const VISITED_KEY = "ctrla-space-visited";
const INTRO_KEY = "ctrla-space-intro";
const XP_KEY = "ctrla-space-xp";
const BOOST_KEY = "ctrla-space-boost";
const LANDED_KEY = "ctrla-space-landed";
const SIGNALS_KEY = "ctrla-space-signals";
const MISSIONS_KEY = "ctrla-space-missions";
const TRIM_KEY = "ctrla-space-trim";

const onClient = typeof window !== "undefined";

const readList = (key: string): string[] => {
  try {
    const v = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
};
const readNum = (key: string): number => {
  try {
    const n = Number(localStorage.getItem(key) || "0");
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
};
const save = (key: string, v: unknown) => {
  try {
    localStorage.setItem(key, typeof v === "string" ? v : JSON.stringify(v));
  } catch {}
};
let toastKey = 0;

const rankToasts = (beforeXp: number, afterXp: number): Toast[] =>
  RANKS.filter((r) => r.xp > beforeXp && r.xp <= afterXp).map((r) => ({
    key: ++toastKey,
    kind: "rank",
    title: `Rank up · ${r.title}`,
    sub: `${r.title} trim unlocked. Open the log to wear it.`,
  }));

export const useSpace = create<SpaceState>((set, get) => ({
  nearId: null,
  dockedId: null,
  autopilotId: null,
  visited: onClient ? readList(VISITED_KEY) : [],
  introSeen: onClient ? localStorage.getItem(INTRO_KEY) === "1" : false,
  mapOpen: false,
  fps: 0,
  quality: 1,
  landingId: null,
  landedId: null,
  enteringId: null,
  photo: false,
  route: [],
  step: 0,
  guideHidden: false,
  xp: onClient ? readNum(XP_KEY) : 0,
  boostTime: onClient ? readNum(BOOST_KEY) : 0,
  landed: onClient ? readList(LANDED_KEY) : [],
  signals: onClient ? readList(SIGNALS_KEY) : [],
  completedMissions: onClient ? readList(MISSIONS_KEY) : [],
  trim: onClient ? localStorage.getItem(TRIM_KEY) || "cadet" : "cadet",
  logOpen: false,
  toasts: [],
  hydrating: false,

  setNear: (id) => {
    if (get().nearId !== id) set({ nearId: id });
  },
  dock: (id) => {
    const fresh = !get().visited.includes(id);
    const visited = fresh ? [...get().visited, id] : get().visited;
    save(VISITED_KEY, visited);
    // Docking at the lit waypoint advances the line.
    const { route, step } = get();
    const next = route[step] === id ? step + 1 : step;
    set({ dockedId: id, autopilotId: null, visited, step: next });
    track("space_dock", { body: id, onRoute: route[step] === id });
    // Charted all five planets, once per device.
    try {
      if (PLANETS.every((p) => visited.includes(p)) && localStorage.getItem(CHARTED_KEY) !== "1") {
        localStorage.setItem(CHARTED_KEY, "1");
        track("space_charted_all");
      }
    } catch {}
    if (fresh) get().addXp(15, "chart");
    else settle(get, set);
  },
  undock: () => set({ dockedId: null }),
  setAutopilot: (id) => set({ autopilotId: id, dockedId: null }),
  dismissIntro: () => {
    save(INTRO_KEY, "1");
    set({ introSeen: true });
  },
  toggleMap: (open) => set((s) => ({ mapOpen: open ?? !s.mapOpen })),
  setFps: (fps) => set({ fps }),
  setQuality: (quality) => set({ quality }),
  land: (id) => {
    set({ landingId: id, dockedId: null, autopilotId: null, photo: false });
    track("space_land", { body: id });
  },
  touchdown: () => {
    const id = get().landingId;
    set((s) => ({ landedId: s.landingId, landingId: null }));
    if (!id || get().landed.includes(id)) return;
    const landed = [...get().landed, id];
    save(LANDED_KEY, landed);
    set({ landed });
    get().addXp(15, "land");
  },
  liftoff: () => set({ landedId: null }),
  enter: (id) => set({ enteringId: id, photo: false }),
  togglePhoto: (on) => set((s) => ({ photo: on ?? !s.photo })),
  setRoute: (ids) => {
    // Keep credit for stops already charted on this device.
    const visited = get().visited;
    let step = 0;
    while (step < ids.length && visited.includes(ids[step])) step++;
    set({ route: ids, step });
  },
  toggleGuide: (hidden) => set((s) => ({ guideHidden: hidden ?? !s.guideHidden })),

  addXp: (amount, reason) => {
    if (amount > 0) {
      const before = get().xp;
      const xp = before + amount;
      save(XP_KEY, String(xp));
      set((s) => ({ xp, toasts: [...s.toasts, ...rankToasts(before, xp)] }));
      track("space_xp", { amount, reason, total: xp });
      if (rankFor(xp).id !== rankFor(before).id) track("space_rank_up", { rank: rankFor(xp).id, xp });
    }
    settle(get, set);
  },

  addBoostTime: (dt) => {
    const before = get().boostTime;
    const boostTime = before + dt;
    set({ boostTime });
    // Persist and re-check on whole seconds, not every frame.
    if (Math.floor(boostTime) !== Math.floor(before)) {
      save(BOOST_KEY, String(boostTime));
      settle(get, set);
    }
  },

  foundSignal: (id) => {
    if (get().signals.includes(id)) return;
    const sig = signalById(id);
    if (!sig) return;
    const signals = [...get().signals, id];
    save(SIGNALS_KEY, signals);
    set((s) => ({
      signals,
      toasts: [...s.toasts, { key: ++toastKey, kind: "signal", title: `Signal detected · ${sig.label}`, sub: `${sig.lore} +${sig.xp} XP` }],
    }));
    track("space_signal_found", { signal: id, count: signals.length });
    get().addXp(sig.xp, "signal");
  },

  setTrim: (rankId) => {
    if (!RANKS.some((r) => r.id === rankId)) return;
    save(TRIM_KEY, rankId);
    set({ trim: rankId });
    track("space_trim", { trim: rankId });
  },
  toggleLog: (open) => set((s) => ({ logOpen: open ?? !s.logOpen })),
  shiftToast: () => set((s) => ({ toasts: s.toasts.slice(1) })),

  pilotWire: () => {
    const s = get();
    return { xp: Math.round(s.xp), boostTime: s.boostTime, visited: s.visited, landed: s.landed, signals: s.signals, missions: s.completedMissions, trim: s.trim };
  },

  hydrate: (p) => {
    const s = get();
    const union = (a: string[], b: string[]) => Array.from(new Set([...a, ...b]));
    const next = {
      xp: Math.max(s.xp, p.xp),
      boostTime: Math.max(s.boostTime, p.boostTime),
      visited: union(s.visited, p.visited),
      landed: union(s.landed, p.landed),
      signals: union(s.signals, p.signals),
      completedMissions: union(s.completedMissions, p.missions),
      trim: RANKS.some((r) => r.id === p.trim) ? p.trim : s.trim,
    };
    const same =
      next.xp === s.xp &&
      next.boostTime === s.boostTime &&
      next.trim === s.trim &&
      next.visited.length === s.visited.length &&
      next.landed.length === s.landed.length &&
      next.signals.length === s.signals.length &&
      next.completedMissions.length === s.completedMissions.length;
    if (same) return;
    save(XP_KEY, String(next.xp));
    save(BOOST_KEY, String(next.boostTime));
    save(VISITED_KEY, next.visited);
    save(LANDED_KEY, next.landed);
    save(SIGNALS_KEY, next.signals);
    save(MISSIONS_KEY, next.completedMissions);
    save(TRIM_KEY, next.trim);
    set({ ...next, hydrating: true });
    // Credit for stops the other device charted moves the line along.
    let step = 0;
    while (step < s.route.length && next.visited.includes(s.route[step])) step++;
    set({ step: Math.max(s.step, step) });
    settle(get, set);
    set({ hydrating: false });
  },
}));

// ── The board ──────────────────────────────────────────
// Re-checked after every progress mutation. Missions pay XP, which can
// rank the pilot up, which can complete Ace Pilot: so it loops until a pass
// changes nothing. Pure function of the store, never of the frame.
type Get = () => SpaceState;
type Set = (partial: Partial<SpaceState> | ((s: SpaceState) => Partial<SpaceState>)) => void;
function settle(get: Get, set: Set) {
  for (let guard = 0; guard <= MISSIONS.length; guard++) {
    const s = get();
    const inputs: MissionInputs = {
      visited: s.visited,
      dockedOnce: s.visited.length > 0,
      landedOnce: s.landed.length > 0,
      boostTime: s.boostTime,
      signals: s.signals,
      isAce: rankFor(s.xp).id === "ace",
    };
    const done = newlyCompleted(inputs, s.completedMissions);
    if (!done.length) return;
    const completedMissions = [...s.completedMissions, ...done.map((m) => m.id)];
    save(MISSIONS_KEY, completedMissions);
    const toasts = done.map<Toast>((m) => ({
      key: ++toastKey,
      kind: "mission",
      title: `Mission complete · ${m.title}`,
      sub: m.xp ? `+${m.xp} XP` : "Top of the board.",
    }));
    set((st) => ({ completedMissions, toasts: [...st.toasts, ...toasts] }));
    for (const m of done) track("space_mission_complete", { mission: m.id, xp: m.xp });
    const reward = done.reduce((a, m) => a + m.xp, 0);
    if (!reward) return;
    // Pay out here rather than through addXp, so this loop (not a recursion)
    // is the one thing that decides when the board is settled.
    const before = get().xp;
    const xp = before + reward;
    save(XP_KEY, String(xp));
    set((st) => ({ xp, toasts: [...st.toasts, ...rankToasts(before, xp)] }));
    track("space_xp", { amount: reward, reason: "mission", total: xp });
    if (rankFor(xp).id !== rankFor(before).id) track("space_rank_up", { rank: rankFor(xp).id, xp });
  }
}

// ── Frame state ────────────────────────────────────────
// Written by the scene every frame, read by whoever needs it, never reactive.

export const frame = {
  /** Live world position of every body, keyed by id. Bodies write, ship reads. */
  bodyPositions: new Map<string, Vector3>(),
  /** Live world position + outward normal of every planet's landing pad. */
  pads: new Map<string, { x: number; y: number; z: number; nx: number; ny: number; nz: number }>(),
  /** Ship world position, written by the flight controller. */
  shipPosition: { x: 0, y: 0, z: 0 },
  /** Current ship speed in world units/s, for the HUD and camera FOV. */
  shipSpeed: 0,
  /** Ship yaw in radians; 0 faces -z. The trail reads it to find the engine. */
  shipHeading: 0,
  /** Magnetic dock progress 0..1 while sitting still inside a ring. */
  dockFill: 0,
  /** Body whose approach envelope the ship is inside, or null. */
  approachId: null as string | null,
  /** One-shot beat flags the guide reads and clears. */
  boosted: false,
  edged: false,
  tookOver: false,
  /** Screen-space projection of the lit waypoint, written by the scene. */
  waypoint: { x: 0, y: 0, visible: false, onScreen: false, angle: 0 },
  /** Nearest undiscovered signal: distance, for the HUD's radio meter. */
  signalNear: { id: null as string | null, dist: Infinity },
  /** Touch input, written by Touch.tsx, merged with the keys by the ship. */
  touch: { yaw: 0, thrust: 0, boost: false, brake: false },
};
