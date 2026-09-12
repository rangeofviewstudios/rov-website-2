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
      question: "Do you have signed split sheets for your songs?",
      short: "Split sheets",
      hint: "Who owns what, on paper, signed.",
      note: "Most artists do not. But when a song does well, the split is the first fight. It is easy to fix now.",
    },
    {
      key: "stems",
      question: "Are your stems saved somewhere you control?",
      short: "Stems backed up",
      hint: "Not only on a friend's laptop.",
      note: "Many people lose these. No stems means no remix, no re-master, and no live version later.",
    },
    {
      key: "audience",
      question: "Do you have a way to reach your fans that you own?",
      short: "Your own fan list",
      hint: "Like an email or text list.",
      note: "Followers belong to the app. A list belongs to you. Without it, every release starts from zero.",
    },
  ],
  manager: [
    {
      key: "splits",
      question: "Do all your artists have signed split sheets?",
      short: "Split sheets",
      hint: "For every song, not only the singles.",
      note: "One missing sheet can block a whole release. It is paperwork, and we can template it.",
    },
    {
      key: "metadata",
      question: "Do you keep every artist's ISRC and UPC codes in one place?",
      short: "Codes in one place",
      hint: "Plus the exact spelling of their names.",
      note: "One wrong upload sends a song to the wrong Spotify page. Fixing that takes weeks.",
    },
    {
      key: "epk",
      question: "Does each artist have an EPK you can send as one link?",
      short: "One-link EPK",
      note: "Without it, a pile of links decides the booking. One link is easy to make.",
    },
  ],
  other: [
    {
      key: "portfolio",
      question: "Do you have one link that shows your best work?",
      short: "One link for your work",
      note: "Artists choose from links. One clear page wins more work than many posts.",
    },
    {
      key: "deposit",
      question: "Do you get part of the money before you start?",
      short: "Deposit up front",
      note: "Ask for a deposit. It is normal, and it protects your time.",
    },
    {
      key: "referrals",
      question: "Do you have people you send artists to for the parts you do not do?",
      short: "People to refer to",
      note: "That is what this page is for. If an artist needs sound, we can be that for you.",
    },
  ],
};

/** Headline for the end of the quiz, by how many were missing. */
export function gateSummary(missing: number): string {
  if (missing === 0) return "You are in good shape.";
  if (missing === 1) return "One thing to fix.";
  if (missing === 2) return "Two things to fix.";
  return "Three things to fix.";
}
