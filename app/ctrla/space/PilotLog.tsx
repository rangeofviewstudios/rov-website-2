"use client";

// ═══════════════════════════════════════════════════════
// SPACE — THE PILOT LOG
//
// The one panel behind the rank badge (L key): where you stand, what is
// left on the board, which signals you have pulled in, and the trim the
// ship wears. Same editorial shell as the dock panel, deliberately: a
// kicker, a big number, rows. Nothing here imports from _scene.
// ═══════════════════════════════════════════════════════

import { ed } from "../_components/editorial";
import { MISSIONS, missionDone, type MissionInputs } from "./_map/missions";
import { RANKS, nextRank, rankFor } from "./_map/ranks";
import { SIGNALS } from "./_map/signals";
import { useSpace } from "./_state/useSpace";

export default function PilotLog({ onClose }: { onClose: () => void }) {
  const xp = useSpace((s) => s.xp);
  const visited = useSpace((s) => s.visited);
  const landed = useSpace((s) => s.landed);
  const boostTime = useSpace((s) => s.boostTime);
  const signals = useSpace((s) => s.signals);
  const completed = useSpace((s) => s.completedMissions);
  const trim = useSpace((s) => s.trim);

  const rank = rankFor(xp);
  const next = nextRank(xp);
  const span = next ? next.xp - rank.xp : 1;
  const into = next ? xp - rank.xp : 1;
  const pct = next ? Math.round((into / span) * 100) : 100;

  const inputs: MissionInputs = {
    visited,
    dockedOnce: visited.length > 0,
    landedOnce: landed.length > 0,
    boostTime,
    signals,
    isAce: rank.id === "ace",
  };

  // A short live readout for the missions that have a number to show.
  const progress = (id: string): string | null => {
    switch (id) {
      case "full-throttle":
        return `${Math.min(20, Math.floor(boostTime))} / 20s`;
      case "chart-system":
        return `${["music", "web-dev", "design", "video", "atl"].filter((p) => visited.includes(p)).length} / 5`;
      case "signal-hunter":
        return `${signals.length} / ${SIGNALS.length}`;
      default:
        return null;
    }
  };

  const doneCount = MISSIONS.filter((m) => completed.includes(m.id) || missionDone(m.id, inputs)).length;

  return (
    <div className="ctrla-space-dock" role="dialog" aria-label="Pilot log" onClick={onClose}>
      <div className="ctrla-space-dock-inner ctrla-space-log" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <span className="ctrla-space-kicker">Pilot log · {doneCount} / {MISSIONS.length} missions</span>
          <button type="button" className="ctrla-space-ghost" onClick={onClose}>
            Close <kbd>L</kbd>
          </button>
        </div>

        {/* Rank */}
        <div className="ctrla-space-log-rank">
          <h2
            style={{
              fontFamily: ed.grotesque,
              fontWeight: 800,
              fontSize: "clamp(34px,4.6vw,64px)",
              letterSpacing: "-0.03em",
              lineHeight: 0.92,
              color: ed.ink,
              margin: "14px 0 6px",
            }}
          >
            {rank.title}
          </h2>
          <p className="ctrla-space-kicker" style={{ margin: 0, opacity: 0.85 }}>
            {xp} XP{next ? ` · ${next.xp - xp} to ${next.title}` : " · top rank"}
          </p>
          <span className="ctrla-space-xpbar" aria-hidden>
            <i style={{ width: `${pct}%`, background: rank.trim }} />
          </span>
        </div>

        <div className="ctrla-space-log-grid">
          {/* Missions */}
          <section>
            <span className="ctrla-space-kicker">The board</span>
            <ul className="ctrla-space-missions">
              {MISSIONS.map((m) => {
                const done = completed.includes(m.id) || missionDone(m.id, inputs);
                const p = progress(m.id);
                return (
                  <li key={m.id} data-done={done}>
                    <span className="ctrla-space-mission-tick" aria-hidden>
                      {done ? "✓" : ""}
                    </span>
                    <span className="ctrla-space-mission-body">
                      <strong>{m.title}</strong>
                      <em>{m.brief}</em>
                    </span>
                    <span className="ctrla-space-mission-meta">{done ? (m.xp ? `+${m.xp}` : "★") : p ?? (m.xp ? `${m.xp} XP` : "")}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            {/* Signals */}
            <span className="ctrla-space-kicker">Drift signals · {signals.length} / {SIGNALS.length}</span>
            <ul className="ctrla-space-signals">
              {SIGNALS.map((s) => {
                const got = signals.includes(s.id);
                return (
                  <li key={s.id} data-done={got}>
                    <strong>{got ? s.label : "Unknown signal"}</strong>
                    <em>{got ? s.lore : "Follow the radio bars."}</em>
                  </li>
                );
              })}
            </ul>

            {/* Trim */}
            <span className="ctrla-space-kicker" style={{ marginTop: 22, display: "block" }}>
              Trim
            </span>
            <div className="ctrla-space-trims">
              {RANKS.map((r) => {
                const open = xp >= r.xp;
                return (
                  <button
                    key={r.id}
                    type="button"
                    className="ctrla-space-trim"
                    data-on={trim === r.id}
                    disabled={!open}
                    onClick={() => useSpace.getState().setTrim(r.id)}
                    aria-label={open ? `Wear ${r.title} trim` : `${r.title} trim, locked`}
                    title={open ? r.title : `${r.title} · ${r.xp} XP`}
                  >
                    <i style={{ background: open ? r.trim : "transparent", borderColor: r.trim }} />
                    <span>{open ? r.title : `${r.xp} XP`}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
