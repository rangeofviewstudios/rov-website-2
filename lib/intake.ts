// lib/intake.ts
// ─────────────────────────────────────────────────────────────
// Config for the intake quiz, one entry per service.
//
// The quiz is the Full View. Five moments, five plain questions, one screen
// each, straight in with no opening field first. Every "no" is a leak, the
// leak count picks the tier (lib/pricing.ts tierForMoments), and the reveal
// shows both before we ask for an email.
//
// Why this shape:
//   · Short. Five taps is short enough that finishing feels free, which is
//     what earns the contact details at the end.
//   · No warm-up question. Asking for a website or business name before the
//     real questions is one more thing to type before the value shows up;
//     cut it and the quiz starts on the first question instead.
//   · Loss-framed. "Three of your five moments are leaking" is the same fact
//     as "we can help with three things" and lands considerably harder.
//
// Adding a service is one entry in SERVICES. No new components, no new route
// handler, no new analytics wiring.
// ─────────────────────────────────────────────────────────────

import type { MomentKey } from "./pricing";

export type MomentQuestion = {
  key: MomentKey;
  /** Asked as a plain yes/no. "No" means the moment leaks. */
  question: string;
  /** Shown under the question, one line, concrete. */
  hint: string;
  /** What we say on the reveal when this one is leaking. */
  leak: string;
  /**
   * Shown immediately under the question on "no" or "not sure", same spot
   * RoleGate uses on rovmusic. One cost, one reassurance, so a leak reads as
   * fixable in the moment rather than only landing later at the reveal.
   */
  note: string;
};

export type IntakeService = {
  slug: string;
  /** Service page this brief belongs to, for the back link and breadcrumb. */
  parentHref: string;
  parentLabel: string;
  /** Source tag on the lead, e.g. "web:brief". */
  source: string;
  eyebrow: string;
  title: string;
  intro: string;
  questions: MomentQuestion[];
  /** Placeholder on the free-text box at the gate. */
  notesPlaceholder: string;
};

// The five questions, in Full View order. Shared defaults; a service overrides
// only what genuinely differs, so the vocabulary stays consistent between pages.
const BASE: MomentQuestion[] = [
  {
    key: "found",
    question: "Can people find you without already knowing your name?",
    hint: "Search, maps, or an AI assistant recommending you.",
    leak: "People who are ready to buy what you sell are not finding you.",
    note: "Most businesses lose this one to a page that never got the basics done. It's usually a day of work, not a rebuild.",
  },
  {
    key: "captured",
    question: "Does what they land on turn them into an enquiry?",
    hint: "A clear next step, and a form or number that actually works.",
    leak: "You are paying for attention and letting it leave without a name.",
    note: "That's traffic you already paid for, gone. One clear next step usually fixes it.",
  },
  {
    key: "answered",
    question: "Does every enquiry get a reply within the hour?",
    hint: "Including evenings and weekends, when most of them come in.",
    leak: "The ones you do catch are going cold before you get back to them.",
    note: "Every hour that passes cuts your odds of a reply landing. A fast auto-response buys you the time to catch up.",
  },
  {
    key: "nurtured",
    question: "Do the ones who are not ready yet hear from you again?",
    hint: "Anything deliberate, not just remembering to follow up.",
    leak: "Most of them were going to buy eventually, from whoever stayed in touch.",
    note: "Most people buy later, from whoever stayed in front of them. A simple follow-up sequence closes that gap on its own.",
  },
  {
    key: "kept",
    question: "After someone buys, does anything reach them?",
    hint: "Receipts, check-ins, a reason to come back.",
    leak: "You are buying every customer twice because the first one never comes back.",
    note: "The first sale costs the most to win and the least to keep. A decent receipt and one check-in usually does it.",
  },
];

function withOverrides(over: Partial<Record<MomentKey, Partial<MomentQuestion>>>): MomentQuestion[] {
  return BASE.map((q) => ({ ...q, ...(over[q.key] || {}) }));
}

export const SERVICES: Record<string, IntakeService> = {
  web: {
    slug: "web",
    parentHref: "/web",
    parentLabel: "Web development",
    source: "web:brief",
    eyebrow: "Project brief",
    title: "Find out what's actually leaking",
    intro:
      "Answer five questions. We'll show you which moments are losing people, and tell you what fixing them costs. About a minute, and you keep the answer either way.",
    questions: withOverrides({}),
    notesPlaceholder:
      "We're rebranding in the spring, and whatever we build has to survive that.",
  },

  brand: {
    slug: "brand",
    parentHref: "/brand",
    parentLabel: "Brand",
    source: "brand:brief",
    eyebrow: "Brand brief",
    title: "See where your brand stops",
    intro:
      "Most identities cover the logo and the website, then stop. Answer five questions, and we'll show you which surfaces your brand never reached, and what it takes to finish the job.",
    questions: withOverrides({
      found: {
        question: "Does what people find look like the real thing?",
        hint: "The first impression, before they read a word.",
        leak: "You are being judged on presentation before anyone hears the pitch.",
        note: "First impressions happen before anyone reads a word. Usually it's one pass to bring everything in line.",
      },
      kept: {
        question: "Do your receipts and confirmations look like your website?",
        hint: "The automated ones nobody has looked at in two years.",
        leak: "Your brand ends at checkout, and that is the moment people remember.",
        note: "Nobody thinks about the receipt until it's the thing someone remembers. Quick fix once you've seen it.",
      },
    }),
    notesPlaceholder:
      "Our logo is fine, but everything we send out looks like it came from a different company.",
  },

  "ai-automation": {
    slug: "ai-automation",
    parentHref: "/ai-automation",
    parentLabel: "AI automation",
    source: "ai:brief",
    eyebrow: "Automation brief",
    title: "Find out what the manual work is costing you",
    intro:
      "Five questions about what happens after someone reaches out. We'll show you which parts are running on somebody remembering, and what it takes to make them run on their own.",
    questions: withOverrides({
      answered: {
        question: "Does every enquiry get a reply within the hour, without you doing it?",
        hint: "Automatically, at 2pm and at 2am.",
        leak: "Speed is the whole game, and right now it depends on somebody being free.",
        note: "Speed is the whole game and it shouldn't depend on someone being free. A simple auto-reply covers the gap.",
      },
      nurtured: {
        question: "Does follow-up happen without anyone remembering to?",
        hint: "A real sequence, not a note to call them back.",
        leak: "Your pipeline is leaking through the gap between busy weeks.",
        note: "Busy weeks are when the most people fall through. Automating the follow-up takes memory out of it.",
      },
    }),
    notesPlaceholder:
      "Everything goes through one inbox and my ops manager is the only one who knows how it works.",
  },

  "video-production": {
    slug: "video-production",
    parentHref: "/video-production",
    parentLabel: "Video production",
    source: "video:brief",
    eyebrow: "Production brief",
    title: "Tell us what you need shot",
    intro:
      "Five questions about how people meet your business, so the footage does a job instead of sitting in a folder. We come back with a scope and what it costs.",
    questions: withOverrides({
      found: {
        question: "When people find you, is there anything to watch?",
        hint: "Something that shows the place, the work, or the people.",
        leak: "You are asking people to imagine what you are like instead of showing them.",
        note: "People decide from what they can see. One good video usually does more than another paragraph of text.",
      },
      captured: {
        question: "Does that footage lead anywhere?",
        hint: "A next step attached, not just a nice video.",
        leak: "The views are not turning into anything you can count.",
        note: "A video with nowhere to go is just entertainment. One clear next step turns a view into an enquiry.",
      },
    }),
    notesPlaceholder: "We need something for the new location opening in the spring.",
  },
};

export const SERVICE_SLUGS = Object.keys(SERVICES);

export function getIntakeService(slug: string): IntakeService | null {
  return SERVICES[slug] ?? null;
}

/** Reveal headline. Loss-framed on purpose; see the note at the top. */
export function leakHeadline(leaking: number, total: number): string {
  if (leaking === 0) return "All five moments are covered. That's rare.";
  if (leaking === 1) return `One of your five moments is leaking.`;
  if (leaking === total) return "All five moments are leaking.";
  return `${leaking} of your five moments are leaking.`;
}
