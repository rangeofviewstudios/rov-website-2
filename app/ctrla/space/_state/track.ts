// The events, so we know whether the game earns its keep:
//   space_open              mode: ship | map
//   space_dock              body, onRoute
//   space_enter             body, via: ship | map
//   space_charted_all       every planet docked at least once on this device
//   space_xp                amount, reason (chart | land | signal | mission), total
//   space_rank_up           rank, xp
//   space_mission_complete  mission, xp
//   space_signal_found      signal, count
//   space_trim              trim
//
// Goes to the site's GA4 tag. No-ops when gtag is missing (SSR, ad blockers,
// headless tests), so nothing here can ever throw in the render path.

type Params = Record<string, string | number | boolean>;

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  const g = (window as unknown as { gtag?: unknown }).gtag;
  if (typeof g !== "function") return;
  try {
    (g as (...args: unknown[]) => void)("event", event, params);
  } catch {
    /* analytics must never break the game */
  }
}
