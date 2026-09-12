// app/api/ctrla/space/route.ts
// ─────────────────────────────────────────────────────────────
// The account copy of a person's pilot log from /ctrla/space.
//
//   POST    merge the browser's copy in, return the merged result
//   GET     return the account copy
//   DELETE  forget it (wired into the "forget my path" control)
//
// Runs as the signed-in user, so RLS does the authorisation. Merge rules:
// lists are unioned, xp and boost time take the larger value, the trim
// the browser sent wins because it is a choice, not progress. Nothing
// here can take XP or a mission away.
// ─────────────────────────────────────────────────────────────

import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 15;

const id = z.string().min(1).max(40).regex(/^[a-z0-9-]+$/);
const ids = z.array(id).max(64);

const pilotSchema = z.object({
  xp: z.number().int().min(0).max(1_000_000),
  boostTime: z.number().min(0).max(1_000_000),
  visited: ids,
  landed: ids,
  signals: ids,
  missions: ids,
  trim: id,
});
export type Pilot = z.infer<typeof pilotSchema>;

const EMPTY: Pilot = { xp: 0, boostTime: 0, visited: [], landed: [], signals: [], missions: [], trim: "cadet" };

const union = (a: string[], b: string[]) => Array.from(new Set([...a, ...b]));

interface Row {
  xp: number;
  boost_time: number;
  visited: string[];
  landed: string[];
  signals: string[];
  missions: string[];
  trim: string;
}

const fromRow = (r: Row | null): Pilot | null =>
  r ? { xp: r.xp, boostTime: r.boost_time, visited: r.visited ?? [], landed: r.landed ?? [], signals: r.signals ?? [], missions: r.missions ?? [], trim: r.trim } : null;

async function readAccount(supabase: ReturnType<typeof createClient>, userId: string): Promise<Pilot | null> {
  const { data } = await supabase
    .from("ctrla_space_pilots")
    .select("xp, boost_time, visited, landed, signals, missions, trim")
    .eq("user_id", userId)
    .maybeSingle();
  return fromRow((data as Row | null) ?? null);
}

async function user(supabase: ReturnType<typeof createClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  const supabase = createClient(await cookies());
  const u = await user(supabase);
  if (!u) return NextResponse.json({ ok: false, code: "unauthenticated" }, { status: 401 });
  const pilot = await readAccount(supabase, u.id);
  return NextResponse.json({ ok: true, pilot });
}

export async function POST(req: NextRequest) {
  let incoming: Pilot;
  try {
    incoming = pilotSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const supabase = createClient(await cookies());
  const u = await user(supabase);
  if (!u) return NextResponse.json({ ok: false, code: "unauthenticated" }, { status: 401 });

  const account = (await readAccount(supabase, u.id)) ?? EMPTY;
  const merged: Pilot = {
    xp: Math.max(account.xp, incoming.xp),
    boostTime: Math.max(account.boostTime, incoming.boostTime),
    visited: union(account.visited, incoming.visited),
    landed: union(account.landed, incoming.landed),
    signals: union(account.signals, incoming.signals),
    missions: union(account.missions, incoming.missions),
    trim: incoming.trim,
  };

  const { error } = await supabase.from("ctrla_space_pilots").upsert(
    {
      user_id: u.id,
      xp: merged.xp,
      boost_time: merged.boostTime,
      visited: merged.visited,
      landed: merged.landed,
      signals: merged.signals,
      missions: merged.missions,
      trim: merged.trim,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) {
    console.error("ctrla_space_pilots upsert error:", error.message);
    return NextResponse.json({ ok: false, error: "Could not save." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, pilot: merged });
}

export async function DELETE() {
  const supabase = createClient(await cookies());
  const u = await user(supabase);
  if (!u) return NextResponse.json({ ok: false, code: "unauthenticated" }, { status: 401 });
  await supabase.from("ctrla_space_pilots").delete().eq("user_id", u.id);
  return NextResponse.json({ ok: true });
}
