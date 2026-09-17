// app/api/sound/readiness/route.ts
// ─────────────────────────────────────────────────────────────
// Lead capture for the Artist Readiness Audit on rovmusic.com.
//
// The value here is the tagging: a lead arrives already carrying their role,
// their score, and the exact list of what they're missing. That's a lead you
// can answer in one paragraph instead of one call.
//
// Delivery is env-driven and identical to app/api/sound/quote-inquiry:
//   1. SUB_WEBHOOK_URL   — if set, POST the JSON to it.
//   2. RESEND_API_KEY    — else, if set, email via Resend to SUB_TO_EMAIL
//      (default stems@rovstudios.com).
//   3. neither set       — 503 { ok:false, code:"not_configured" } so the form
//      is testable before wiring and fails honestly.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subscribeToKlaviyo } from "@/utils/klaviyo";

export const runtime = "nodejs";
export const maxDuration = 15;

const DEFAULT_TO_EMAIL = "stems@rovstudios.com";
// Resend refuses senders on unverified domains. Until rovstudios.com is
// verified, send from their sandbox address; override with SUB_FROM_EMAIL.
const DEFAULT_FROM_EMAIL = "onboarding@resend.dev";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  artist: z.string().trim().max(200).optional().or(z.literal("")),
  // Audit context. All optional so a partial submit still reaches the inbox.
  role: z.string().trim().max(40).optional().or(z.literal("")),
  score: z.string().trim().max(20).optional().or(z.literal("")),
  tier: z.string().trim().max(120).optional().or(z.literal("")),
  have: z.string().trim().max(1200).optional().or(z.literal("")),
  missing: z.string().trim().max(1200).optional().or(z.literal("")),
  // Raw gap keys (e.g. "splits", "stems"), separate from the joined labels
  // above: the Klaviyo plan email conditionally renders one block per gap,
  // which needs its own boolean property per key, not a joined string.
  haveKeys: z.array(z.string().trim().max(40)).max(20).optional(),
  missingKeys: z.array(z.string().trim().max(40)).max(20).optional(),
  piecemeal: z.string().trim().max(60).optional().or(z.literal("")),
  roster: z.string().trim().max(40).optional().or(z.literal("")),
  // Honeypot — real users never fill this. Bots do.
  company: z.string().max(0).optional(),
});

type Submission = z.infer<typeof bodySchema>;

async function timedFetch(url: string, init: RequestInit, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(id);
  }
}

async function deliverWebhook(url: string, sub: Submission) {
  const res = await timedFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source: "readiness-audit", ...sub }),
  });
  return res.ok;
}

async function deliverResend(apiKey: string, sub: Submission) {
  const to = process.env.SUB_TO_EMAIL || DEFAULT_TO_EMAIL;
  const from = process.env.SUB_FROM_EMAIL || DEFAULT_FROM_EMAIL;

  // Missing items are listed first: that's the reply you have to write.
  const lines = [
    `Name: ${sub.name}`,
    `Email: ${sub.email}`,
    `Artist: ${sub.artist || "—"}`,
    `Role: ${sub.role || "—"}${sub.roster ? ` (roster: ${sub.roster})` : ""}`,
    "",
    `Score: ${sub.score || "—"}  ·  ${sub.tier || "—"}`,
    `Piecemeal cost of gaps: ${sub.piecemeal || "—"}`,
    "",
    "MISSING:",
    ...(sub.missing ? sub.missing.split("; ").map((m) => `  - ${m}`) : ["  (none)"]),
    "",
    "Already has:",
    ...(sub.have ? sub.have.split("; ").map((h) => `  - ${h}`) : ["  (none)"]),
  ].join("\n");

  const res = await timedFetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: sub.email,
      subject: `Readiness audit: ${sub.name}${sub.score ? ` (${sub.score})` : ""}${
        sub.role === "manager" ? " · MANAGER" : ""
      }`,
      text: lines,
    }),
  });
  return res.ok;
}

export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = bodySchema.safeParse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!parsed.success) {
    // Honeypot trip (company field non-empty) → answer OK, do nothing.
    const honeypotTripped = parsed.error.issues.some((i) => i.path[0] === "company");
    if (honeypotTripped) return NextResponse.json({ ok: true });
    return NextResponse.json(
      { ok: false, error: "Please fill in your name and a valid email." },
      { status: 400 }
    );
  }

  const sub = parsed.data;

  const webhookUrl = process.env.SUB_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;

  if (!webhookUrl && !resendKey) {
    console.error("Readiness route not configured: set SUB_WEBHOOK_URL or RESEND_API_KEY.");
    return NextResponse.json(
      {
        ok: false,
        code: "not_configured",
        error: "This isn't wired up yet. Please email stems@rovstudios.com directly.",
      },
      { status: 503 }
    );
  }

  // Fire-and-forget: a lead who doesn't reach the flow is worse than a lead
  // who reaches Andi's inbox without it, so this never blocks or fails the
  // response below. Properties carry the audit's own tagging (role, score,
  // the exact gaps) so the 14-day activation flow can branch and personalize
  // on them without a second data source.
  const listId = process.env.KLAVIYO_MUSIC_LIST_ID || process.env.KLAVIYO_LIST_ID;
  if (listId) {
    // One boolean per gap key (gap_splits, gap_stems, ...) so the plan email
    // can do a plain {% if profile.gap_splits %} per block instead of parsing
    // a joined string. missingKeys wins over haveKeys if a key somehow lands
    // in both (shouldn't happen, but "it's a gap" is the safer default).
    //
    // Also send a per-key display number (gap_splits_num, ...) equal to the
    // key's position within missingKeys, not its fixed position in the full
    // item list: the template's badges must read 1, 2, 3 for whichever gaps
    // actually show, not 1, 3, 5 because "stems" happens to be third overall.
    // missingKeys already arrives in the same pillar/importance order the
    // email's blocks are written in (both trace back to READINESS_ITEMS), so
    // index position here is exactly the badge number.
    const gapProperties: Record<string, string> = {};
    for (const key of sub.haveKeys || []) gapProperties[`gap_${key}`] = "false";
    (sub.missingKeys || []).forEach((key, i) => {
      gapProperties[`gap_${key}`] = "true";
      gapProperties[`gap_${key}_num`] = String(i + 1);
    });

    subscribeToKlaviyo({
      listId,
      email: sub.email,
      name: sub.name,
      source: "rovmusic-readiness-audit",
      properties: {
        role: sub.role || "",
        score: sub.score || "",
        tier: sub.tier || "",
        missing: sub.missing || "",
        have: sub.have || "",
        roster: sub.roster || "",
        artist: sub.artist || "",
        ...gapProperties,
      },
    }).catch(() => {});
  }

  try {
    const delivered = webhookUrl
      ? await deliverWebhook(webhookUrl, sub)
      : await deliverResend(resendKey as string, sub);

    if (delivered) return NextResponse.json({ ok: true });

    console.error("Readiness delivery failed (non-2xx from provider).");
    return NextResponse.json(
      { ok: false, error: "We could not send that right now. Please try again in a moment." },
      { status: 502 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("Readiness exception:", msg);
    const isTimeout = msg.toLowerCase().includes("abort");
    return NextResponse.json(
      {
        ok: false,
        error: isTimeout ? "That took too long. Please try again." : "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
