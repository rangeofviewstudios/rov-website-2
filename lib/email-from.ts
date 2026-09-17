// lib/email-from.ts
// ─────────────────────────────────────────────────────────────
// Default "From" identities for every Resend send in the codebase.
//
// rovmusic.com is the verified sending domain in Resend. Every route below
// used to fall back to onboarding@resend.dev (Resend's shared sandbox
// address) because rovstudios.com wasn't verified yet; now that rovmusic.com
// is, these are the real defaults. Each route can still override with its
// own env var (LEAD_FROM_EMAIL, SUB_FROM_EMAIL, ...), so nothing here is
// hardcoded past a sane default.
//
// Pick by what the email is:
//   HELLO    — a business notification or a reply a human might read and
//              answer (lead notifications, the intake auto-reply).
//   SUPPORT  — a quote, inquiry, or audit result, i.e. "we looked at your
//              thing and here's what we found".
//   NOREPLY  — a purely automated confirmation nobody is meant to reply to.
// ─────────────────────────────────────────────────────────────

export const HELLO_FROM = "Range of View <hello@rovmusic.com>";
export const SUPPORT_FROM = "Range of View <support@rovmusic.com>";
export const NOREPLY_FROM = "Range of View <noreply@rovmusic.com>";
