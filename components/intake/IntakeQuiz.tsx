"use client";

// The intake quiz, shared by every service.
//
// Three beats:
//   1. Five questions, one screen, yes/no, straight in with no warm-up field.
//      Every "no" is a leak.
//   2. The reveal. Leaks lit, count stated, tier and real price shown. This is
//      the beat the whole thing exists for, and it happens BEFORE the gate:
//      they get the answer whether or not they hand over an email.
//   3. The gate. Name and email for the written breakdown.
//
// Prices come from lib/pricing.ts and questions from lib/intake.ts, so nothing
// here can drift from /pricing or from the service pages.

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  MOMENTS,
  tierForMoments,
  fmt,
  OVER_CEILING_NOTE,
  type MomentKey,
} from "@/lib/pricing";
import { leakHeadline, type IntakeService } from "@/lib/intake";
import {
  attributionPayload,
  captureAttribution,
  trackBookingClick,
  trackFormError,
  trackFormStart,
  trackFormStep,
  trackFormSubmit,
  trackLead,
} from "@/lib/lead-analytics";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const ORANGE = "#EA9A61";
const GRADIENT =
  "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)";
const GRADIENT_SHADOW =
  "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)";
const CAL_URL = "https://cal.com/rov-studios-imhphw/15min";

/**
 * The raw choice is kept, not just a boolean, so "no" and "not sure" can both
 * count as leaking while still lighting the button the visitor actually
 * pressed. Collapsing them to a boolean loses that and makes the UI lie.
 */
type Choice = "yes" | "no" | "unsure";
type Answers = Partial<Record<MomentKey, Choice>>;

/** Anything that is not a confident yes is treated as a leak. */
const leaks = (c: Choice | undefined) => c !== undefined && c !== "yes";

type Phase = "questions" | "reveal" | "gate" | "done";

export default function IntakeQuiz({ service }: { service: IntakeService }) {
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("questions");
  const [answers, setAnswers] = useState<Answers>({});
  // Which of the five moments is on screen. One question at a time, not all
  // five stacked at once — a visitor should never have to read more than one
  // question, its hint, and (on a leak) one note before deciding anything.
  const [qIndex, setQIndex] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  const headingRef = useRef<HTMLHeadingElement>(null);
  const didMount = useRef(false);

  useEffect(() => {
    captureAttribution();
    trackFormStart(service.source);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Move focus to the new heading on each beat so keyboard and screen reader
  // users are not stranded at the top of the document.
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [phase, qIndex]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const leaking = useMemo(
    () => service.questions.filter((q) => leaks(answers[q.key])),
    [answers, service.questions]
  );
  const tier = tierForMoments(leaking.length);

  function scrollToTop() {
    const el = document.getElementById("intake-card");
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
  }

  function go(next: Phase, step: number, label: string) {
    trackFormStep(service.source, step, label);
    setPhase(next);
    scrollToTop();
  }

  // ── Beat 1 ──────────────────────────────────────────────────
  function answer(key: MomentKey, choice: Choice) {
    setAnswers((p) => ({ ...p, [key]: choice }));
  }

  // "Yes" has nothing to explain, so it moves on by itself. "No" and "Not
  // sure" hold the screen so the note underneath gets read, and this is what
  // the resulting Next button calls.
  function nextQuestion(index: number) {
    if (index + 1 >= service.questions.length) {
      go("reveal", 2, `answered-${leaking.length}-leaking`);
    } else {
      trackFormStep(service.source, 1, `q${index + 1}-answered`);
      setQIndex(index + 1);
      scrollToTop();
    }
  }

  // ── Beat 4 ──────────────────────────────────────────────────
  async function submit() {
    if (!name.trim() || !emailValid) {
      setTouched(true);
      return;
    }
    if (status === "sending") return;
    trackFormSubmit(service.source);
    setStatus("sending");
    setError("");

    const leakLines = leaking.map((q) => `· ${MOMENTS.find((m) => m.key === q.key)?.label}: ${q.leak}`);
    const message = [
      `Service: ${service.parentLabel}`,
      "",
      `Moments leaking: ${leaking.length} of ${service.questions.length}`,
      ...leakLines,
      "",
      `Tier indicated: ${tier.name} (${fmt(tier.priceFrom)} to ${fmt(tier.priceTo)})`,
      notes.trim() ? `\nWhat they said:\n${notes.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n")
      .trim();

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company,
          message,
          source: `${service.source}:${leaking.length}-leaking`,
          page: typeof window !== "undefined" ? window.location.pathname : "",
          intake: {
            leaking: leaking.map((q) => ({
              label: MOMENTS.find((m) => m.key === q.key)?.label ?? q.key,
              leak: q.leak,
            })),
            tierName: tier.name,
            tierPriceFrom: tier.priceFrom,
            tierPriceTo: tier.priceTo,
          },
          ...attributionPayload(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        trackLead(service.source, { leaking: leaking.length, tier: tier.id });
        setPhase("done");
        scrollToTop();
        return;
      }
      trackFormError(service.source, data.code || `http_${res.status}`);
      setStatus("error");
      setError(data.error || "That didn't send. Please try again, or email us directly.");
    } catch {
      trackFormError(service.source, "network");
      setStatus("error");
      setError("Network error. Please try again, or email us directly.");
    }
  }

  const slide = reduce
    ? {}
    : { initial: { opacity: 0, x: 18 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -18 } };

  return (
    <div
      id="intake-card"
      className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-9"
    >
      <AnimatePresence mode="wait">
        {/* ══ 1 · QUESTIONS ══ */}
        {phase === "questions" && (() => {
          const q = service.questions[qIndex];
          const v = answers[q.key];
          const isLeak = leaks(v);
          return (
            <motion.div key={`q-${qIndex}`} {...slide} transition={{ duration: reduce ? 0 : 0.22 }}>
              <Progress count={service.questions.length} index={qIndex} />
              <span className="mb-3 block text-[0.7rem] tracking-[0.2em] text-white/50" style={{ fontFamily: BODY }}>
                {qIndex + 1} OF {service.questions.length}
              </span>
              <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold italic text-white outline-none md:text-3xl" style={{ fontFamily: HEADING }}>
                {q.question}
              </h2>
              <p className="mb-7 mt-1.5 text-sm text-white/75" style={{ fontFamily: BODY }}>
                {q.hint}
              </p>

              <div className="flex gap-2" role="radiogroup" aria-label={q.question}>
                <PillChoice tone="yes" selected={v === "yes"} onClick={() => { answer(q.key, "yes"); nextQuestion(qIndex); }}>
                  Yes
                </PillChoice>
                <PillChoice tone="no" selected={v === "no"} onClick={() => answer(q.key, "no")}>
                  No
                </PillChoice>
                <PillChoice tone="unsure" selected={v === "unsure"} onClick={() => answer(q.key, "unsure")}>
                  Not sure
                </PillChoice>
              </div>

              {/* One line, only on a leak: what it costs, then that it's
                  fixable. Neutral cream text on a tone-tinted box, not
                  tone-colored text, so it doesn't repeat the low-contrast
                  mistake a color-matched warning box made elsewhere. Holds
                  the screen here, same as RoleGate's "Not yet", so the note
                  gets read before advancing. */}
              <AnimatePresence>
                {isLeak && q.note && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p
                      className="mt-4 rounded-lg border border-[#EA9A61]/25 bg-[#EA9A61]/[0.06] p-4 text-sm leading-relaxed text-white/70"
                      style={{ fontFamily: BODY }}
                    >
                      {q.note}
                    </p>
                    <button
                      type="button"
                      onClick={() => nextQuestion(qIndex)}
                      className="cta-shine mt-4 block w-full rounded-full text-center font-semibold text-white transition-transform duration-300 hover:scale-[1.02]"
                      style={{ fontFamily: BODY, padding: "13px", fontSize: "13px", letterSpacing: "0.05em", background: GRADIENT, boxShadow: GRADIENT_SHADOW }}
                    >
                      {qIndex + 1 >= service.questions.length ? "See what this means →" : "Next →"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-6">
                {qIndex > 0 ? (
                  <button
                    type="button"
                    onClick={() => setQIndex(qIndex - 1)}
                    className="text-sm text-white/45 transition-colors hover:text-white"
                    style={{ fontFamily: BODY }}
                  >
                    ← Back
                  </button>
                ) : (
                  <span />
                )}
                <span className="text-xs text-white/45" style={{ fontFamily: BODY }}>
                  {isLeak ? "Read the note, then Next" : "Pick one to continue"}
                </span>
              </div>
            </motion.div>
          );
        })()}

        {/* ══ 3 · REVEAL ══ */}
        {phase === "reveal" && (
          <motion.div key="reveal" {...slide} transition={{ duration: reduce ? 0 : 0.22 }}>
            <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold italic text-white outline-none md:text-3xl lg:text-4xl" style={{ fontFamily: HEADING }}>
              {leakHeadline(leaking.length, service.questions.length)}
            </h2>

            {leaking.length > 0 ? (
              <ul className="mt-7 space-y-3">
                {leaking.map((q) => (
                  <li key={q.key} className="flex gap-3">
                    <span aria-hidden className="mt-[3px] shrink-0" style={{ color: ORANGE }}>
                      !
                    </span>
                    <span>
                      <span className="block text-[0.9375rem] font-semibold text-white" style={{ fontFamily: BODY }}>
                        {MOMENTS.find((m) => m.key === q.key)?.label}
                      </span>
                      <span className="block text-sm leading-relaxed text-white/55" style={{ fontFamily: BODY }}>
                        {q.leak}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-7 text-sm leading-relaxed text-white/60" style={{ fontFamily: BODY }}>
                Genuinely rare, and it means you probably do not need us yet. If you want a second pair
                of eyes on it anyway, we will tell you honestly what we would and would not change.
              </p>
            )}

            {/* The number. Published pricing means we can show it here instead of
                making them book a call to find out, which is the whole point. */}
            {leaking.length > 0 && (
              <div className="mt-8 rounded-xl border p-5 md:p-6" style={{ borderColor: "rgba(234,154,97,0.25)", background: "rgba(234,154,97,0.05)" }}>
                <span className="mb-2 block text-[11px] uppercase tracking-[0.25em]" style={{ fontFamily: BODY, color: ORANGE }}>
                  Fixing this usually costs
                </span>
                <p className="text-3xl font-bold italic text-white md:text-4xl" style={{ fontFamily: HEADING }}>
                  {fmt(tier.priceFrom)}{" "}
                  <span className="text-xl text-white/55">to {fmt(tier.priceTo)}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/70" style={{ fontFamily: BODY }}>
                  {tier.tagline}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.15em] text-white/40" style={{ fontFamily: BODY }}>
                  We call this {tier.name} — {tier.kicker.toLowerCase()}
                </p>
                {leaking.length >= 4 && (
                  <p className="mt-3 border-t border-[#EA9A61]/15 pt-3 text-xs leading-relaxed text-white/55" style={{ fontFamily: BODY }}>
                    {OVER_CEILING_NOTE}
                  </p>
                )}
                <Link href="/pricing" className="mt-3 inline-block text-xs underline underline-offset-4" style={{ fontFamily: BODY, color: ORANGE }}>
                  See the full price list
                </Link>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick(service.source)}
                className="text-center text-sm text-white/50 underline underline-offset-4 transition-colors hover:text-white"
                style={{ fontFamily: BODY }}
              >
                Rather just talk it through?
              </a>
              <button
                type="button"
                onClick={() => go("gate", 3, "reveal-accepted")}
                className="cta-shine rounded-full text-center font-semibold text-white transition-transform duration-300 hover:scale-[1.03]"
                style={{ fontFamily: BODY, padding: "13px 34px", fontSize: "13px", letterSpacing: "0.05em", background: GRADIENT, boxShadow: GRADIENT_SHADOW }}
              >
                Send me the breakdown →
              </button>
            </div>
          </motion.div>
        )}

        {/* ══ 4 · GATE ══ */}
        {phase === "gate" && (
          <motion.div key="gate" {...slide} transition={{ duration: reduce ? 0 : 0.22 }}>
            <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold italic text-white outline-none md:text-3xl" style={{ fontFamily: HEADING }}>
              Where do we send it?
            </h2>
            <p className="mb-7 mt-1.5 text-sm text-white/60" style={{ fontFamily: BODY }}>
              A written breakdown of the {leaking.length === 1 ? "moment" : `${leaking.length} moments`} above,
              what each one is costing, and what we would fix first. One business day.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-white/75" style={{ fontFamily: BODY }}>
                  Your name <span style={{ color: ORANGE }}>*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First and last"
                  autoComplete="name"
                  maxLength={120}
                  aria-invalid={touched && !name.trim() ? true : undefined}
                  className={`w-full rounded-lg border bg-white/[0.04] px-3.5 py-3 text-base text-white placeholder-white/25 outline-none transition-colors focus:border-[#EA9A61]/60 ${
                    touched && !name.trim() ? "border-[#ff8b6b]/60" : "border-white/10"
                  }`}
                  style={{ fontFamily: BODY }}
                />
                {touched && !name.trim() && (
                  <p className="mt-1.5 text-xs text-[#ff8b6b]" style={{ fontFamily: BODY }}>Who are we replying to?</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm text-white/75" style={{ fontFamily: BODY }}>
                  Email <span style={{ color: ORANGE }}>*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={254}
                  aria-invalid={touched && !emailValid ? true : undefined}
                  className={`w-full rounded-lg border bg-white/[0.04] px-3.5 py-3 text-base text-white placeholder-white/25 outline-none transition-colors focus:border-[#EA9A61]/60 ${
                    touched && !emailValid ? "border-[#ff8b6b]/60" : "border-white/10"
                  }`}
                  style={{ fontFamily: BODY }}
                />
                {touched && !emailValid && (
                  <p className="mt-1.5 text-xs text-[#ff8b6b]" style={{ fontFamily: BODY }}>That email doesn&apos;t look right.</p>
                )}
              </div>
            </div>

            <label className="mb-1 mt-4 block text-sm text-white/75" style={{ fontFamily: BODY }}>
              Anything else? <span className="text-white/45">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={1500}
              placeholder={service.notesPlaceholder}
              className="w-full resize-y rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-3 text-base leading-relaxed text-white placeholder-white/25 outline-none transition-colors focus:border-[#EA9A61]/60"
              style={{ fontFamily: BODY }}
            />

            {/* Honeypot */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="intake-company">Company</label>
              <input id="intake-company" name="company" type="text" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>

            {status === "error" && (
              <p role="alert" className="mt-4 text-sm text-[#ff8b6b]" style={{ fontFamily: BODY }}>{error}</p>
            )}

            <p className="mt-4 text-xs leading-relaxed text-white/50" style={{ fontFamily: BODY }}>
              We use this to send your breakdown and reply. No lists you didn&apos;t ask for.
            </p>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-6">
              <button type="button" onClick={() => setPhase("reveal")} className="text-sm text-white/45 transition-colors hover:text-white" style={{ fontFamily: BODY }}>
                ← Back
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={status === "sending"}
                className="cta-shine rounded-full text-center font-semibold text-white transition-transform duration-300 hover:scale-[1.03] disabled:opacity-70"
                style={{ fontFamily: BODY, padding: "13px 34px", fontSize: "13px", letterSpacing: "0.05em", background: GRADIENT, boxShadow: GRADIENT_SHADOW }}
              >
                {status === "sending" ? "Sending…" : "Send it over →"}
              </button>
            </div>
          </motion.div>
        )}

        {/* ══ DONE ══ */}
        {phase === "done" && (
          <motion.div key="done" role="status" aria-live="polite" initial={reduce ? false : { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduce ? 0 : 0.3 }}>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "rgba(234,154,97,0.12)", border: `1.5px solid ${ORANGE}` }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold italic text-white outline-none md:text-3xl" style={{ fontFamily: HEADING }}>
              Got it, {name.split(" ")[0] || "thanks"}.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55" style={{ fontFamily: BODY }}>
              Your breakdown is being written by a person, not generated. It lands within one business
              day and covers the {leaking.length === 1 ? "moment" : `${leaking.length} moments`} you
              flagged, what each is costing, and where we would start.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick(service.source)}
                className="flex-1 rounded-full border border-white/12 text-center font-semibold text-white/70 transition-all duration-300 hover:border-[#EA9A61]/50 hover:text-white"
                style={{ fontFamily: BODY, padding: "14px", fontSize: "13px", letterSpacing: "0.05em", background: "rgba(255,255,255,0.03)" }}
              >
                Book a call while you wait
              </a>
              <Link
                href="/works"
                className="flex-1 rounded-full border border-white/12 text-center font-semibold text-white/70 transition-all duration-300 hover:border-[#EA9A61]/50 hover:text-white"
                style={{ fontFamily: BODY, padding: "14px", fontSize: "13px", letterSpacing: "0.05em", background: "rgba(255,255,255,0.03)" }}
              >
                See recent work
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Segmented progress bar for the one-question-at-a-time screen, same shape
 * as RoleGate's. */
function Progress({ count, index }: { count: number; index: number }) {
  return (
    <div className="mb-4 flex items-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-1 flex-1 rounded-full transition-colors duration-300"
          style={{ background: i <= index ? "#EA9A61" : "rgba(255,255,255,0.1)" }}
        />
      ))}
    </div>
  );
}

/**
 * One answer pill. Yes leans green, No leans red, Not sure leans the brand
 * orange, so the color itself says something before the note text does, the
 * same framing used on rovmusic's landing quiz. A selected pill gets a
 * checkmark and a slight press on tap; classes are full literal strings (not
 * built from a variable) so Tailwind's JIT scanner can still find them.
 */
function PillChoice({
  tone,
  selected,
  onClick,
  children,
}: {
  tone: "yes" | "no" | "unsure";
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const tint = tone === "yes" ? "#3DAE5F" : tone === "no" ? "#FF3B30" : "#EA9A61";
  const on =
    tone === "yes"
      ? "border-[#3DAE5F] bg-[#3DAE5F]/[0.2] text-white"
      : tone === "no"
        ? "border-[#FF3B30] bg-[#FF3B30]/[0.28] text-white"
        : "border-[#EA9A61] bg-[#EA9A61]/[0.22] text-white";
  const hover =
    tone === "yes"
      ? "hover:border-[#3DAE5F]/50 hover:bg-[#3DAE5F]/[0.08]"
      : tone === "no"
        ? "hover:border-[#FF3B30]/60 hover:bg-[#FF3B30]/[0.1]"
        : "hover:border-[#EA9A61]/50 hover:bg-[#EA9A61]/[0.08]";
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`relative rounded-full border px-4 py-2 text-sm transition-all duration-150 active:scale-[0.96] cursor-pointer ${
        selected ? on : `border-white/[0.1] bg-white/[0.02] text-white/55 ${hover} hover:text-white/85`
      }`}
      style={{ fontFamily: BODY }}
    >
      {selected && (
        <span
          className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full"
          style={{ background: tint }}
        >
          <Check className="h-2.5 w-2.5 text-[#1A1210]" strokeWidth={3} />
        </span>
      )}
      {children}
    </button>
  );
}
