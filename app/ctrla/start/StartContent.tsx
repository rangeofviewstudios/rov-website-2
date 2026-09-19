"use client";

import YourPath from "../_components/YourPath";

// ═══════════════════════════════════════════════════════
// CTRL-A — START
// The intake quiz, set as part of the magazine rather than as a form.
//
// Two questions, not four: what do you make, and where did your last
// thing end up. Both questions are the same row language — a circle
// node, the issue's own cosmic mark, a label, a right-aligned status —
// so the two screens read as one system instead of two different UI
// ideas. Question 01 is multi-select with an order stamp; question 02
// is single-select. No cards, no boxes, no icon set. Layout and motion
// live in globals.css under .ctrla-craft-row and .ctrla-row; only the
// per-craft accent is passed down, as --acc.
//
// The reveal offers two equal, real doors instead of one primary door
// with secondary asides bolted on: someone who hasn't shipped anything
// gets "make something now" (the Brand Kit Generator) next to "get
// grounded first" (their craft's toolkit); someone who has shipped gets
// "show it off now" next to "get sharper first". Both a full answer, not
// a hero door with a footnote.
//
// `level`, `intent`, and `hasBrand` still exist in lib/ctrla/profile.ts
// because Space's star-map routing (app/ctrla/space) and the server path
// API read them directly, but the quiz no longer asks for them one at a
// time. `deriveFromRung` below backfills them from the single ladder
// answer instead — see its comment for the exact thresholds.
// ═══════════════════════════════════════════════════════

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ed, Bleed, Label, Kicker } from "../_components/editorial";
import {
  useCtrlAProfile,
  type CraftSlug,
  type Level,
  type Intent,
} from "@/lib/ctrla/profile";

// ── Question 01 ──────────────────────────────────────────────
// One panel per craft. The art is the issue's own cosmic kit, the same
// marks CosmicBackdrop uses, so the quiz belongs to the volume instead
// of importing a generic icon set.

type CraftOption = {
  value: CraftSlug;
  label: string;
  accent: string;
  art: string;
  /** Mono line under the name, one glance at what the panel leads to. */
  meta: string;
};

const CRAFTS: CraftOption[] = [
  { value: "music", label: "Music", accent: "#A56A67", art: "/ctrla/asset-comet.svg", meta: "12 picks" },
  { value: "design", label: "Design", accent: "#8E76B8", art: "/ctrla/asset-saturn.svg", meta: "8 picks" },
  { value: "web-dev", label: "Websites", accent: "#E3C24A", art: "/ctrla/asset-planets.svg", meta: "8 picks" },
  // The spaceship and galaxy marks only exist in the source asset folder,
  // whose name has spaces. Encoded rather than duplicated into the root.
  { value: "video", label: "Video", accent: "#7FA8A0", art: "/ctrla/Assets%20and%20Textures/CTRL%20A_spaceship.svg", meta: "8 picks" },
];

// ── Question 02 ──────────────────────────────────────────────
// Where their last thing ended up. Replaces the old "how far in" +
// "what do you want" + "do you have a look" questions: one honest rung
// on a ladder tells you nearly everything those three did, without
// asking a beginner to self-rate their own skill.

type RungOption = { rung: number; label: string; meta: string };

const RUNGS: RungOption[] = [
  { rung: 0, label: "Still just an idea", meta: "Nothing finished" },
  { rung: 1, label: "Finished it, never showed anyone", meta: "It's just sitting there" },
  { rung: 2, label: "Showed a few people", meta: "Friends, a group chat, wherever" },
  { rung: 3, label: "It's out in the world", meta: "Someone besides your friends found it" },
];

/**
 * Backfill for the fields the quiz no longer asks directly. Space's
 * routing and the server path API still read `level`, `intent`, and
 * `hasBrand` off the stored profile, so a fresh completion needs to set
 * them from the one thing we did ask.
 *
 * Two different thresholds on purpose: "have they shipped anything" (the
 * reveal's own question, rung >= 1 counts a finished-but-hidden piece as
 * shipped) is a lower bar than "how far along are they" (rung >= 2, shown
 * to someone besides themselves) which is what should flip Space into
 * its expert routes. A rung-1 person sees "Show it" on the reveal but
 * still gets routed like a beginner in Space — intentional, since
 * finishing something privately isn't the same signal as having shown it
 * to anyone.
 */
function deriveFromRung(rung: number): { level: Level; intent: Intent; hasBrand: boolean } {
  const seasoned = rung >= 2;
  return {
    level: seasoned ? "expert" : "beginner",
    intent: rung >= 1 ? "release" : "craft",
    hasBrand: seasoned,
  };
}

// ── Where each answer sends them ─────────────────────────────

type Outcome = {
  eyebrow: string;
  label: string;
  format: string;
  lead: string;
  rest: string;
  href: string;
  emph: boolean;
};

function toolkitDoor(craft: CraftSlug): { href: string; label: string; note: string } {
  const meta: Record<CraftSlug, { label: string; note: string }> = {
    music: { label: "The Music Toolkit", note: "The chain our engineers run in real sessions, explained step by step before you touch a fader." },
    design: { label: "The Design Toolkit", note: "Interface, brand, and 3D, taught from real client work, in the order you'll actually use it." },
    "web-dev": { label: "The Development Toolkit", note: "The stack we ship on, framework to deploy, explained before you write a line." },
    video: { label: "The Video Toolkit", note: "Bodies, glass, light, and the finish room, taught in the order a real shoot runs." },
  };
  return { href: `/ctrla/toolkit/${craft}`, ...meta[craft] };
}

/**
 * Two real, equal-weight options — not a primary door with secondary
 * asides bolted on. Someone who hasn't shipped anything gets a fast win
 * (the brand kit) next to getting grounded first; someone who has
 * shipped gets to show it off next to getting sharper. Both are a full
 * answer, sized and worded the same.
 */
function outcomeFor(craft: CraftSlug, hasShipped: boolean): { headline: string; sub: string; optA: Outcome; optB: Outcome } {
  const kit = toolkitDoor(craft);
  const optB: Outcome = {
    eyebrow: "Get sharper first",
    label: kit.label,
    format: "Course · self-paced",
    lead: "A free course, read at your own pace.",
    rest: kit.note,
    href: kit.href,
    emph: false,
  };

  if (!hasShipped) {
    return {
      headline: "Where do you want to start?",
      sub: "Both are real starts. Pick whichever sounds more like you right now.",
      optA: {
        eyebrow: "Make something now",
        label: "The Brand Kit Generator",
        format: "Tool · ~10 min",
        lead: "A free tool, not a lesson.",
        rest: "Answer a few questions and walk out with a logo, palette, type, and voice, done in one sitting.",
        href: "/ctrla/brand-kit",
        emph: true,
      },
      optB,
    };
  }

  return {
    headline: "Where do you want to go next?",
    sub: "Both are real starts. Pick whichever sounds more like you right now.",
    optA: {
      eyebrow: "Show it off now",
      label: "Show it",
      format: "Submission · 5 min",
      lead: "Not a lesson, a mailbox.",
      rest: "Paste a link to what you made. If it's good, it lands on your page with your name on it.",
      href: "/ctrla/submit",
      emph: true,
    },
    optB,
  };
}

// ── Chrome ───────────────────────────────────────────────────

const STEPS = 2;

/** A hairline that fills across the top of the page as the quiz advances. */
function ProgressRule({ step }: { step: number }) {
  return (
    <div aria-hidden style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "rgba(240,230,224,0.12)", zIndex: 40 }}>
      <div
        style={{
          height: "100%",
          width: `${(Math.min(step, STEPS) / STEPS) * 100}%`,
          background: ed.gold,
          transition: "width 520ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </div>
  );
}

function Question({ children }: { children: React.ReactNode }) {
  return (
    <h1
      tabIndex={-1}
      style={{
        fontFamily: ed.grotesque,
        fontWeight: 800,
        fontSize: "clamp(34px, 6.4vw, 88px)",
        lineHeight: 0.92,
        letterSpacing: "-0.035em",
        color: ed.ink,
        margin: "clamp(14px,1.8vw,22px) 0 0",
        maxWidth: 960,
        outline: "none",
      }}
    >
      {children}
    </h1>
  );
}

/** The serif italic subline the rest of the issue uses under a headline. */
function Sub({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: ed.serif,
        fontStyle: "italic",
        fontSize: "clamp(17px,2.2vw,28px)",
        lineHeight: 1.24,
        color: ed.gold,
        margin: "clamp(12px,1.5vw,18px) 0 0",
        maxWidth: 640,
      }}
    >
      {children}
    </p>
  );
}

/**
 * Question 01's row. Same row language as the ladder question right
 * after it (`Row`, below) — a circle node, the craft's own cosmic mark,
 * a label, a right-aligned status — so the two screens read as one
 * system instead of two different UI ideas. Multi-select and an order
 * stamp ("Picked · 01") are the only differences from the single-select
 * version.
 */
function CraftRow({
  option,
  order,
  onClick,
}: {
  option: CraftOption;
  order: number | null;
  onClick: () => void;
}) {
  const selected = order !== null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="ctrla-craft-row"
      style={{ ["--acc" as string]: option.accent }}
    >
      <span aria-hidden className="ctrla-craft-row-node" />
      <Image src={option.art} alt="" width={36} height={36} unoptimized className="ctrla-craft-row-art" />
      <span style={{ minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontFamily: ed.grotesque,
            fontWeight: 800,
            fontSize: "clamp(26px,4.4vw,58px)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: ed.ink,
          }}
        >
          {option.label}
        </span>
        <span style={{ display: "block", marginTop: 10 }}>
          <Label color={option.accent}>{option.meta}</Label>
        </span>
      </span>
      <span className="ctrla-craft-row-cta">
        <Label color={option.accent}>{selected ? `Picked · ${String(order + 1).padStart(2, "0")}` : "Select"} →</Label>
      </span>
    </button>
  );
}

/** Every answer after question 01. A row, not a card. */
function Row({
  label,
  meta,
  selected,
  onClick,
}: {
  label: string;
  meta: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="ctrla-row"
      style={{ color: ed.gold }}
    >
      <span aria-hidden className="ctrla-row-node" />
      <span style={{ minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontFamily: ed.grotesque,
            fontWeight: 800,
            fontSize: "clamp(26px,4.4vw,58px)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: ed.ink,
          }}
        >
          {label}
        </span>
        <span style={{ display: "block", marginTop: 10 }}>
          <Label color={ed.gold}>{meta}</Label>
        </span>
      </span>
      <span className="ctrla-row-cta" style={{ justifySelf: "end", whiteSpace: "nowrap" }}>
        <Label color={ed.gold}>{selected ? "Picked" : "Select"} →</Label>
      </span>
    </button>
  );
}

/**
 * A door on the reveal. Two of these render, equal size — neither is a
 * hero over the other. `emph` only changes the accent colour and the top
 * hairline, never the type scale, so both read as a full answer.
 */
function OutcomeRow({ opt, accent }: { opt: Outcome; accent: string }) {
  return (
    <a
      href={opt.href}
      className="ctrla-start-door"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "end",
        gap: "clamp(12px,2vw,28px)",
        textDecoration: "none",
        padding: "clamp(20px,2.8vw,34px) 0",
        borderBottom: `1px solid ${ed.hair}`,
        borderTop: opt.emph ? `2px solid ${accent}` : "none",
      }}
    >
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", marginBottom: 12 }}>
          <Kicker color={opt.emph ? accent : ed.gold}>{opt.eyebrow}</Kicker>
        </span>
        <span style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: ed.grotesque,
              fontWeight: 800,
              fontSize: "clamp(28px,4.6vw,60px)",
              letterSpacing: "-0.03em",
              lineHeight: 0.98,
              color: opt.emph ? accent : ed.ink,
            }}
          >
            {opt.label}
          </span>
          <span
            style={{
              fontFamily: ed.mono,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "4px 10px",
              borderRadius: 999,
              border: `1px solid ${opt.emph ? accent : ed.hair}`,
              color: opt.emph ? ed.ground : ed.inkFaint,
              background: opt.emph ? accent : "transparent",
              whiteSpace: "nowrap",
            }}
          >
            {opt.format}
          </span>
        </span>
        <span
          style={{
            display: "block",
            marginTop: 10,
            fontFamily: ed.body,
            fontSize: "clamp(13px,1.5vw,16px)",
            lineHeight: 1.5,
            color: ed.inkSoft,
            maxWidth: 600,
          }}
        >
          <b style={{ color: ed.ink }}>{opt.lead}</b> {opt.rest}
        </span>
      </span>
      <span style={{ justifySelf: "end", whiteSpace: "nowrap", paddingBottom: 4 }}>
        <Label color={opt.emph ? accent : ed.gold}>
          Enter <span aria-hidden className="ctrla-start-door-arrow">→</span>
        </Label>
      </span>
    </a>
  );
}

// ── The quiz ─────────────────────────────────────────────────

export default function StartContent() {
  const reduce = useReducedMotion();
  const { profile, save, clear, ready } = useCtrlAProfile();

  // 0 and 1 are the questions, 2 (STEPS) is the reveal.
  const [step, setStep] = useState(0);
  const [crafts, setCrafts] = useState<CraftSlug[]>([]);
  const [rung, setRung] = useState<number | null>(null);

  const headingRef = useRef<HTMLDivElement>(null);
  const didMount = useRef(false);
  const saved = useRef(false);
  /**
   * Owned by the resume effect alone. It cannot share `didMount` with the
   * focus effect below: the profile hook hydrates a tick after mount, so by
   * the time `ready` flips true the focus effect has already set that flag
   * and resume would silently never run.
   */
  const restored = useRef(false);

  // Someone who already answered lands straight on their reveal, so the
  // permanent door in the hero is a way back to your result, not a
  // second interrogation. "Start over" clears it.
  const [resuming, setResuming] = useState(false);
  useEffect(() => {
    // `saved` is already true when the profile we are seeing is the one this
    // session just wrote, which is a finished quiz, not a return visit.
    if (!ready || restored.current || saved.current || !profile) return;
    restored.current = true;
    setCrafts(profile.crafts);
    setStep(STEPS);
    setResuming(true);
    saved.current = true;
  }, [ready, profile]);

  useEffect(() => {
    document.body.style.backgroundColor = ed.ground;
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  // Move focus to each new screen so keyboard and screen reader users are
  // not left at the top of the document on every advance.
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const h = headingRef.current?.querySelector<HTMLElement>("h1");
    h?.focus();
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [step, reduce]);

  // A resumed visit already has a saved profile; a fresh completion has to
  // derive one from the rung they just picked. Either way this is the one
  // thing persisted and read back on the reveal.
  const answers = useMemo(() => {
    if (resuming && profile) return { crafts: profile.crafts, level: profile.level, intent: profile.intent, hasBrand: profile.hasBrand };
    return crafts.length > 0 && rung !== null ? { crafts, ...deriveFromRung(rung) } : null;
  }, [resuming, profile, crafts, rung]);

  const hasShipped = resuming && profile ? profile.intent === "release" : rung !== null ? rung >= 1 : false;

  // Persist once, on arrival at the reveal.
  useEffect(() => {
    if (step !== STEPS || saved.current || !answers) return;
    save(answers);
    saved.current = true;
  }, [step, answers, save]);

  function toggleCraft(c: CraftSlug) {
    setCrafts((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  function restart() {
    clear();
    saved.current = false;
    restored.current = false;
    setCrafts([]);
    setRung(null);
    setResuming(false);
    setStep(0);
  }

  const accent = crafts[0] ? CRAFTS.find((c) => c.value === crafts[0])!.accent : ed.gold;
  const outcome = answers ? outcomeFor(answers.crafts[0], hasShipped) : null;

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0, pointerEvents: "auto" as const },
        // AnimatePresence mode="wait" keeps the outgoing screen mounted until
        // its exit finishes, so without this a fast second tap lands on the
        // question that is already fading out and re-answers it.
        exit: { opacity: 0, y: -12, pointerEvents: "none" as const },
        transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div style={{ minHeight: "100vh", background: ed.ground, position: "relative", overflowX: "clip" }}>
      <div aria-hidden className="ctrla-page-grain" />
      <ProgressRule step={step} />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Masthead — the issue's own, not a nav.
            `width: 100%` is required on any Bleed that is a direct child of
            this column flex container: Bleed centres itself with `margin: 0
            auto`, and auto cross-axis margins beat align-items: stretch, so
            without it the masthead shrinks to fit its contents. */}
        <Bleed style={{ width: "100%", padding: "clamp(16px,2.2vw,26px) clamp(18px,5vw,64px) 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <a href="/ctrla" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }} aria-label="CTRL-A home">
              <Image
                src="/ctrla/ctrla-flat-logo-white.svg"
                alt="CTRL-A"
                width={48}
                height={35}
                priority
                unoptimized
                style={{ height: "clamp(20px, 2.4vw, 28px)", width: "auto" }}
              />
            </a>
            <Label color={ed.inkFaint}>
              {step < STEPS ? `${String(step + 1).padStart(2, "0")} / ${String(STEPS).padStart(2, "0")}` : "Your route"}
            </Label>
          </div>
        </Bleed>

        <div ref={headingRef} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(20px,3vw,40px) 0" }}>
          <AnimatePresence mode="wait">
            {/* ── 01 · Craft ───────────────────────────────── */}
            {step === 0 && (
              <motion.div key="q0" {...fade}>
                <Bleed style={{ padding: "0 clamp(18px,5vw,64px) clamp(20px,2.6vw,32px)" }}>
                  <Kicker color={ed.gold}>Two questions, twenty seconds</Kicker>
                  <Question>What do you make?</Question>
                  <Sub>Tap all that apply. The first one leads.</Sub>
                </Bleed>

                <div className="ctrla-craft-rows">
                  {CRAFTS.map((c) => {
                    const i = crafts.indexOf(c.value);
                    return <CraftRow key={c.value} option={c} order={i === -1 ? null : i} onClick={() => toggleCraft(c.value)} />;
                  })}
                </div>
              </motion.div>
            )}

            {/* ── 02 · The ladder ──────────────────────────── */}
            {step === 1 && (
              <motion.div key="q1" {...fade}>
                <Bleed style={{ padding: "0 clamp(18px,5vw,64px)" }}>
                  <Kicker color={ed.gold}>One more question</Kicker>
                  <Question>{"Where'd your last thing end up?"}</Question>
                  <Sub>No wrong answer.</Sub>
                  <div style={{ marginTop: "clamp(22px,3vw,40px)" }}>
                    {RUNGS.map((r) => (
                      <Row
                        key={r.rung}
                        label={r.label}
                        meta={r.meta}
                        selected={rung === r.rung}
                        onClick={() => {
                          setRung(r.rung);
                          setStep(STEPS);
                        }}
                      />
                    ))}
                  </div>
                </Bleed>
              </motion.div>
            )}

            {/* ── Reveal ───────────────────────────────────── */}
            {step === STEPS && answers && outcome && (
              <motion.div key="reveal" {...fade}>
                <Bleed style={{ padding: "0 clamp(18px,5vw,64px)" }}>
                  <Kicker color={accent}>{resuming ? "Where you left off" : "Two ways in"}</Kicker>
                  <h1
                    tabIndex={-1}
                    style={{
                      fontFamily: ed.grotesque,
                      fontWeight: 800,
                      fontSize: "clamp(30px, 5.4vw, 76px)",
                      lineHeight: 0.94,
                      letterSpacing: "-0.035em",
                      color: ed.ink,
                      margin: "clamp(14px,1.8vw,22px) 0 0",
                      maxWidth: 1040,
                      outline: "none",
                    }}
                  >
                    {outcome.headline}
                  </h1>
                  <Sub>{outcome.sub}</Sub>

                  <div style={{ marginTop: "clamp(26px,3.4vw,46px)" }}>
                    <OutcomeRow opt={outcome.optA} accent={accent} />
                    <OutcomeRow opt={outcome.optB} accent={accent} />
                  </div>

                  <div style={{ marginTop: "clamp(26px,3.4vw,46px)" }}>
                    <YourPath variant="strip" />
                  </div>

                  <p
                    style={{
                      fontFamily: ed.mono,
                      fontSize: "clamp(11px,1.2vw,13px)",
                      letterSpacing: "0.08em",
                      lineHeight: 1.7,
                      color: ed.inkFaint,
                      margin: "clamp(20px,2.6vw,30px) 0 0",
                    }}
                  >
                    Saved on this device. Sign in and it follows you.{" "}
                    <button
                      type="button"
                      onClick={restart}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        font: "inherit",
                        color: ed.gold,
                        textDecoration: "underline",
                        textUnderlineOffset: 3,
                      }}
                    >
                      Start over
                    </button>
                  </p>
                </Bleed>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer controls */}
        <Bleed style={{ width: "100%", padding: "0 clamp(18px,5vw,64px) clamp(24px,3.4vw,44px)" }}>
          <div style={{ borderTop: `1px solid ${ed.hair}`, paddingTop: "clamp(14px,1.8vw,22px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(14px,2.4vw,28px)" }}>
              {step > 0 && step < STEPS && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="ctrla-start-text-btn"
                  style={{ background: "none", border: "none", padding: "6px 0", cursor: "pointer" }}
                >
                  <Label color={ed.inkFaint}>← Back</Label>
                </button>
              )}
              {step < STEPS ? (
                <a href="/ctrla" className="ctrla-start-text-btn" style={{ textDecoration: "none", padding: "6px 0" }}>
                  <Label color={ed.inkFaint}>Just let me look around</Label>
                </a>
              ) : (
                <a href="/ctrla" className="ctrla-start-text-btn" style={{ textDecoration: "none", padding: "6px 0" }}>
                  <Label color={ed.inkFaint}>← Back to CTRL-A</Label>
                </a>
              )}
            </div>

            {/* Only the multi-select question needs an explicit Next; the
                single-answer screen advances on tap. */}
            {step === 0 && (
              <button
                type="button"
                disabled={crafts.length === 0}
                onClick={() => setStep(1)}
                className="ctrla-cover-cta"
                style={{
                  fontFamily: ed.mono,
                  fontSize: "clamp(12px,1.4vw,15px)",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: crafts.length ? ed.ground : "rgba(240,230,224,0.35)",
                  background: crafts.length ? ed.gold : "transparent",
                  border: crafts.length ? "none" : `1px solid ${ed.hair}`,
                  padding: "15px 32px",
                  borderRadius: 2,
                  cursor: crafts.length ? "pointer" : "not-allowed",
                }}
              >
                Next →
              </button>
            )}
          </div>
        </Bleed>
      </div>
    </div>
  );
}
