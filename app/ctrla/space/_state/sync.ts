"use client";

// ═══════════════════════════════════════════════════════
// SPACE — ACCOUNT SYNC
//
// The pilot log follows the person once they sign in. Same rules as the
// path sync in lib/ctrla/sync.ts:
//
//   - Signed out, everything lives in localStorage and just works.
//   - On sign-in, and on every visit while signed in, the device copy is
//     pushed to /api/ctrla/space, merged with the account copy (lists
//     union, numbers take the max), and the merged copy is hydrated back.
//   - Every later change to the log pushes again, debounced. Best-effort:
//     the network never blocks the game, and a failed push is retried on
//     the next change.
//
// Mount useSpaceSync() once, in SpaceClient. Nothing here imports three.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSpace, type PilotWire } from "./useSpace";

const DEBOUNCE_MS = 1200;

// The store fields that make up the log. `pilotWire()` reads the live
// store, so the subscriber compares snapshots field by field instead.
type Log = { xp: number; boostTime: number; trim: string; visited: string[]; landed: string[]; signals: string[]; completedMissions: string[] };
const sameLog = (a: Log, b: Log) =>
  a.xp === b.xp &&
  a.boostTime === b.boostTime &&
  a.trim === b.trim &&
  a.visited === b.visited &&
  a.landed === b.landed &&
  a.signals === b.signals &&
  a.completedMissions === b.completedMissions;

async function push(): Promise<PilotWire | null> {
  const res = await fetch("/api/ctrla/space", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(useSpace.getState().pilotWire()),
  });
  if (!res.ok) return null;
  const data = (await res.json().catch(() => null)) as { ok: boolean; pilot: PilotWire } | null;
  return data?.ok && data.pilot ? data.pilot : null;
}

export function useSpaceSync() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const signedIn = useRef(false);
  const inFlight = useRef(false);
  const dirty = useRef(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const run = async () => {
      if (!signedIn.current || cancelled) return;
      if (inFlight.current) {
        dirty.current = true;
        return;
      }
      inFlight.current = true;
      try {
        const merged = await push();
        if (merged && !cancelled) {
          const before = useSpace.getState().pilotWire();
          useSpace.getState().hydrate(merged);
          // Hydrating can settle a mission the other device set up, which
          // pays XP the account does not have yet. Push once more.
          if (useSpace.getState().pilotWire().xp !== before.xp) dirty.current = true;
        }
      } catch {
        /* best-effort */
      } finally {
        inFlight.current = false;
        if (dirty.current && !cancelled) {
          dirty.current = false;
          void run();
        }
      }
    };

    // Any change to the log (and only the log) schedules a push, unless
    // the change is the account copy being hydrated in.
    const unsub = useSpace.subscribe((s, prev) => {
      if (s.hydrating) return;
      if (sameLog(s, prev)) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(run, DEBOUNCE_MS);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      signedIn.current = !!session?.user;
      void run();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      signedIn.current = !!session?.user;
      if (event === "SIGNED_IN") void run();
    });

    return () => {
      cancelled = true;
      unsub();
      sub.subscription.unsubscribe();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
}
