"use client";

// First-visit popup for rovmusic.com. Two steps, one card:
//
//   1. "What do you do?"  artist / manager / behind the scenes
//   2. Three yes/no questions for that role (data/gateQuestions.ts). "Yes"
//      moves on at once. "Not yet" holds the screen for one polite line, then
//      a Next button. A short summary, then they land on the page.
//
// The answers are saved to the intake profile so the Act 3 audit can skip
// what was already asked, and the page copy swaps by role.
//
// Deliberate restraint: it waits ~700ms so it doesn't fight the hero video,
// it can be closed at any step without answering, and closing stores nothing
// (the page falls back to artist copy). Copy is plain English on purpose: a
// visitor whose first language is not English should get every line.

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic2, Users, Palette, X, Check } from "lucide-react";
import {
  OPEN_GATE_EVENT,
  type Role,
  useIntake,
} from "@/components/music/IntakeContext";
import { ROLE_CHOSEN_EVENT } from "@/components/music/RoleToast";
import { GATE_QUESTIONS, gateSummary } from "@/data/gateQuestions";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const GRADIENT =
  "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)";

const OPTIONS: {
  role: Role;
  icon: typeof Mic2;
  label: string;
  sub: string;
}[] = [
  { role: "artist", icon: Mic2, label: "I make music", sub: "Artist, producer, writer" },
  { role: "manager", icon: Users, label: "I manage artists", sub: "Manager, label, team" },
  { role: "other", icon: Palette, label: "I work behind the scenes", sub: "Engineer, designer, video, venue" },
];

const REVEAL_DELAY_MS = 700;

type Step = { kind: "role" } | { kind: "question"; index: number } | { kind: "done" };

export default function RoleGate() {
  const { role, ready, setRole, setGate } = useIntake();
  const [open, setOpen] = useState(false);
  // Set when reopened from an inline switcher rather than on first visit.
  const [forced, setForced] = useState(false);
  const [step, setStep] = useState<Step>({ kind: "role" });
  const [picked, setPicked] = useState<Role | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  // First visit only: no stored role, and only after the hero has settled.
  useEffect(() => {
    if (!ready || role) return;
    const t = setTimeout(() => setOpen(true), REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, [ready, role]);

  // Reopening from RoleInline or the footer.
  useEffect(() => {
    const reopen = () => {
      setForced(true);
      setStep({ kind: "role" });
      setAnswers({});
      setOpen(true);
    };
    window.addEventListener(OPEN_GATE_EVENT, reopen);
    return () => window.removeEventListener(OPEN_GATE_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => {
    setOpen(false);
    setForced(false);
    // Reset after the exit animation so the card doesn't flash step one.
    window.setTimeout(() => {
      setStep({ kind: "role" });
      setPicked(null);
      setAnswers({});
    }, 300);
  };

  const questions = picked ? GATE_QUESTIONS[picked] : [];

  const chooseRole = (next: Role) => {
    setPicked(next);
    setAnswers({});
    setStep({ kind: "question", index: 0 });
  };

  const answerQuestion = (index: number, hasIt: boolean) => {
    const q = questions[index];
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.key]: hasIt }));
    // "Yes" has nothing to say, so it moves on at once. "Not yet" stays so
    // the note gets read, and the Next button below advances.
    if (hasIt) advance(index);
  };

  const advance = (index: number) => {
    if (index + 1 >= questions.length) setStep({ kind: "done" });
    else setStep({ kind: "question", index: index + 1 });
  };

  const finish = () => {
    if (!picked) return;
    setRole(picked);
    setGate({ answers });
    setOpen(false);
    setForced(false);
    // Brief confirmation, then it leaves. There is no persistent role badge.
    window.dispatchEvent(new CustomEvent(ROLE_CHOSEN_EVENT, { detail: picked }));
    // Drop them at the fork, which opens the song funnel. Collaborators get
    // their own section rather than the song funnel.
    const target = picked === "other" ? "collaborate" : "start";
    window.setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 380);
    window.setTimeout(() => {
      setStep({ kind: "role" });
      setPicked(null);
      setAnswers({});
    }, 300);
  };

  const missingCount = questions.filter((q) => answers[q.key] === false).length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.78)", backdropFilter: "blur(6px)" }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Quick questions before you scroll"
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 190, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-[1.75rem] border border-white/10 p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            style={{
              background: "linear-gradient(160deg, rgba(26,21,18,1) 0%, rgba(11,9,8,1) 100%)",
              boxShadow: "0 40px 90px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,244,227,0.07)",
            }}
          >
            {/* Warm bloom, top left, matching the page's accent language */}
            <div
              aria-hidden
              className="absolute -top-16 -left-10 w-64 h-64 rounded-full pointer-events-none blur-[70px]"
              style={{ background: "radial-gradient(circle, rgba(234,154,97,0.16) 0%, transparent 70%)" }}
            />

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative">
              <AnimatePresence mode="wait" initial={false}>
                {/* ── Step 1: role ── */}
                {step.kind === "role" && (
                  <motion.div key="role" {...fade}>
                    <Eyebrow>{forced ? "Switch view" : "Quick question"}</Eyebrow>
                    <Title>What do you do?</Title>
                    <Lead>One tap and we&apos;ll show you the page that fits you.</Lead>

                    <div className="flex flex-col gap-2.5">
                      {OPTIONS.map((o) => {
                        const Icon = o.icon;
                        const isCurrent = role === o.role;
                        return (
                          <button
                            key={o.role}
                            type="button"
                            onClick={() => chooseRole(o.role)}
                            className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                              isCurrent
                                ? "border-[#EA9A61]/50 bg-[#EA9A61]/[0.07]"
                                : "border-white/[0.08] bg-white/[0.02] hover:border-[#EA9A61]/40 hover:bg-[#EA9A61]/[0.04]"
                            }`}
                          >
                            <span
                              className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border border-[#EA9A61]/35"
                              style={{
                                background: "linear-gradient(160deg, rgba(234,154,97,0.2) 0%, rgba(144,66,44,0.12) 100%)",
                                boxShadow: "inset 0 1px 0 rgba(255,244,227,0.14), 0 6px 14px -6px rgba(0,0,0,0.55)",
                              }}
                            >
                              <Icon className="w-5 h-5 text-[#F4B37A]" strokeWidth={1.5} />
                            </span>
                            <span className="flex-1 min-w-0">
                              <span
                                className="block text-white text-base md:text-lg font-semibold"
                                style={{ fontFamily: BODY }}
                              >
                                {o.label}
                              </span>
                              <span
                                className="block text-white/40 text-xs mt-0.5"
                                style={{ fontFamily: BODY }}
                              >
                                {o.sub}
                              </span>
                            </span>
                            <span className="shrink-0 text-white/25 group-hover:text-[#EA9A61] group-hover:translate-x-0.5 transition-all duration-300">
                              &rarr;
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <SkipButton onClick={close}>Just looking</SkipButton>
                  </motion.div>
                )}

                {/* ── Step 2: three questions ── */}
                {step.kind === "question" && questions[step.index] && (
                  <motion.div key={`q-${step.index}`} {...fade}>
                    <Progress count={questions.length} index={step.index} />
                    <Eyebrow>
                      {step.index + 1} of {questions.length}
                    </Eyebrow>
                    <Title>{questions[step.index].question}</Title>
                    {questions[step.index].hint && <Lead>{questions[step.index].hint}</Lead>}

                    <div className="grid grid-cols-2 gap-3">
                      <Choice
                        tone="yes"
                        selected={answers[questions[step.index].key] === true}
                        onClick={() => answerQuestion(step.index, true)}
                      >
                        Yes
                      </Choice>
                      <Choice
                        tone="no"
                        selected={answers[questions[step.index].key] === false}
                        onClick={() => answerQuestion(step.index, false)}
                      >
                        Not yet
                      </Choice>
                    </div>

                    {/* The note. Only on "not yet", and it holds the screen. */}
                    <AnimatePresence>
                      {answers[questions[step.index].key] === false && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          {/* The box carries the warning in red border/wash; the
                              text itself stays neutral cream, not red, since
                              red-on-red-tinted repeats the same low-contrast
                              mistake orange-on-orange-tinted made before it. */}
                          <div className="mt-4 rounded-xl border border-[#FF3B30]/80 bg-[#FF3B30]/[0.2] p-4">
                            <p
                              className="text-[#FBE9D6] text-sm md:text-base leading-relaxed"
                              style={{ fontFamily: BODY }}
                            >
                              {questions[step.index].note}
                            </p>
                          </div>
                          <PrimaryButton onClick={() => advance(step.index)}>
                            {step.index + 1 >= questions.length ? "See the result" : "Next"} &rarr;
                          </PrimaryButton>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <SkipButton
                      onClick={() =>
                        step.index === 0
                          ? setStep({ kind: "role" })
                          : setStep({ kind: "question", index: step.index - 1 })
                      }
                    >
                      &larr; Back
                    </SkipButton>
                  </motion.div>
                )}

                {/* ── Step 3: summary, then land ── */}
                {step.kind === "done" && (
                  <motion.div key="done" {...fade}>
                    <Eyebrow>Done</Eyebrow>
                    <Title>{gateSummary(missingCount)}</Title>
                    <Lead>
                      {missingCount === 0
                        ? "That's rare. We'll show you the page built for you."
                        : picked === "other"
                          ? "None of it is hard. We'll show you the page built for you."
                          : "None of it is hard, and we can help close every gap. There's a full breakdown further down the page."}
                    </Lead>

                    <ul className="flex flex-col gap-2 mb-2">
                      {questions.map((q) => {
                        const ok = answers[q.key] === true;
                        return (
                          <li
                            key={q.key}
                            className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3"
                          >
                            <span
                              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{
                                background: ok ? "rgba(234,154,97,0.18)" : "rgba(255,255,255,0.06)",
                                color: ok ? "#EA9A61" : "rgba(255,255,255,0.4)",
                              }}
                            >
                              {ok ? "✓" : "–"}
                            </span>
                            <span
                              className="text-sm"
                              style={{ fontFamily: BODY, color: ok ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.45)" }}
                            >
                              {q.short}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    <p
                      className="text-white/30 text-[11px] leading-relaxed mb-1"
                      style={{ fontFamily: BODY }}
                    >
                      Nothing here is sent anywhere. It just decides what this page shows you next.
                    </p>

                    <PrimaryButton onClick={finish}>Show me the page &rarr;</PrimaryButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const fade = {
  initial: { opacity: 0, x: 14 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -14 },
  transition: { duration: 0.22 },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block text-[11px] uppercase tracking-[0.3em] text-[#EA9A61] mb-3"
      style={{ fontFamily: BODY }}
    >
      {children}
    </span>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-white text-2xl md:text-3xl font-bold italic leading-tight mb-2"
      style={{ fontFamily: HEADING }}
    >
      {children}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-white/45 text-sm leading-relaxed mb-6 max-w-sm"
      style={{ fontFamily: BODY }}
    >
      {children}
    </p>
  );
}

function Progress({ count, index }: { count: number; index: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-6">
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

function Choice({
  tone,
  selected,
  onClick,
  children,
}: {
  tone: "yes" | "no";
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  // Yes leans green, Not yet leans red, on hover as well as once picked, so
  // the color itself nudges toward the answer before the note text does.
  // Classes are full literal strings (not interpolated) so Tailwind's JIT
  // scanner can still find and generate them.
  const tint = tone === "yes" ? "#3DAE5F" : "#FF3B30";
  const on =
    tone === "yes"
      ? "border-[#3DAE5F]/70 bg-[#3DAE5F]/[0.18]"
      : "border-[#FF3B30] bg-[#FF3B30]/[0.32]";
  const hover =
    tone === "yes"
      ? "hover:border-[#3DAE5F]/45 hover:bg-[#3DAE5F]/[0.08]"
      : "hover:border-[#FF3B30]/70 hover:bg-[#FF3B30]/[0.16]";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-2xl border p-4 md:p-5 text-center transition-all duration-150 active:scale-[0.97] cursor-pointer text-white text-base md:text-lg font-semibold ${
        selected ? on : `border-white/[0.08] bg-white/[0.02] ${hover}`
      }`}
      style={{ fontFamily: BODY }}
    >
      {selected && (
        <span
          className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: tint }}
        >
          <Check className="w-2.5 h-2.5 text-[#1A1210]" strokeWidth={3} />
        </span>
      )}
      {children}
    </button>
  );
}

function PrimaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cta-shine mt-4 block w-full text-center text-white font-semibold rounded-full transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
      style={{
        fontFamily: BODY,
        padding: "13px",
        fontSize: "13px",
        letterSpacing: "0.05em",
        background: GRADIENT,
        boxShadow: "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
      }}
    >
      {children}
    </button>
  );
}

function SkipButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-5 w-full text-center text-white/30 hover:text-white/60 text-xs transition-colors cursor-pointer"
      style={{ fontFamily: BODY }}
    >
      {children}
    </button>
  );
}
