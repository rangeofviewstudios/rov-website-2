// The landing quiz on rovmusic.com. Three yes/no questions per role, asked in
// the popup right after "what do you do?".
//
// Copy rules, in order of priority:
//   1. Plain English. Short words, short sentences, no idioms. A visitor whose
//      first language is not English should get every line on one read.
//   2. Polite. Each "no" gets one calm line: what it costs, then that it is
//      fixable. Never a lecture, never a scare.
//   3. Fast. Three questions, one screen each, about fifteen seconds.
//
// Artist and manager keys match READINESS_ITEMS in data/artistReadiness.ts,
// so the Act 3 audit can skip what was answered here and only ask the rest.
// Collaborator keys are their own; there is no audit for that role.

import type { Role } from "@/components/music/IntakeContext";

export interface GateQuestion {
  /** Matches a ReadinessItem key where one exists, so the audit can reuse it. */
  key: string;
  /** The question. Yes must mean "I have this". */
  question: string;
  /** Optional one-line clarifier under the question. */
  hint?: string;
  /** Two or three words for the summary list at the end. */
  short: string;
  /** Shown only on "not yet". One cost, one reassurance. */
  note: string;
}

export const GATE_QUESTIONS: Record<Role, GateQuestion[]> = {
  artist: [
    {
      key: "splits",
      question: "If this song blew up tomorrow, is it clear who gets paid?",
      short: "Who gets paid",
      note: "Most artists skip this part. It's usually the first fight when a song does well, and it only takes a few minutes to fix now.",
    },
    {
      key: "stems",
      question: "If your laptop died tonight, would you still have your stems?",
      short: "Your stems, safe",
      note: "A lot of people lose these. No stems means no remix, no remaster, and no live version later.",
    },
    {
      key: "audience",
      question: "Could you reach your fans without an app standing in the middle?",
      short: "Your own fan list",
      note: "The app can drop you any day it wants. A list you own can't be taken away.",
    },
  ],
  manager: [
    {
      key: "splits",
      question: "Across your whole roster, is it clear who gets paid for every song?",
      short: "Who gets paid",
      note: "One missing sheet can hold up an entire release. It's just paperwork, and we can template it for you.",
    },
    {
      key: "metadata",
      question: "If a song dropped tonight, would it land on the right page?",
      short: "Lands in the right place",
      note: "One wrong code sends it to the wrong page, and that can take weeks to fix.",
    },
    {
      key: "epk",
      question: "Can you send one link and let a booker say yes on the spot?",
      short: "One link to book",
      note: "A pile of links usually loses the booking to whoever sent just one.",
    },
  ],
  other: [
    {
      key: "portfolio",
      question: "Could someone see your best work in one link, right now?",
      short: "One link for your work",
      note: "People pick whatever's easiest to look at, not necessarily the best work. One clear page wins more jobs than a feed of posts.",
    },
    {
      key: "deposit",
      question: "Do you get paid before you start the work?",
      short: "Paid up front",
      note: "It's normal to ask for a deposit, and it protects your time.",
    },
    {
      key: "referrals",
      question: "When it's not your part, do you have someone you send people to?",
      short: "Someone to send them to",
      note: "That's exactly what this page is for. If an artist needs sound, send them here.",
    },
  ],
};

/** Headline for the end of the quiz, by how many were missing. */
export function gateSummary(missing: number): string {
  if (missing === 0) return "You're covered.";
  if (missing === 1) return "One thing that'll cost you later.";
  if (missing === 2) return "Two things that'll cost you later.";
  return "Three things that'll cost you later.";
}
