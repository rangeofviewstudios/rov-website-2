// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";   // ⬅️ Opt out of static rendering for this route
// Alternatively: export const revalidate = 0;

function getOrCreateSessionId(req: NextRequest) {
  const existing = req.cookies.get("chat_session_id")?.value;
  return existing ?? crypto.randomUUID();
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json().catch(() => ({} as any));
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const sessionId = getOrCreateSessionId(req);
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nUrl) {
      return NextResponse.json({ error: "N8N_WEBHOOK_URL is not configured" }, { status: 500 });
    }

    const n8nRes = await fetch(n8nUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shared-Secret": process.env.N8N_SHARED_SECRET ?? "",
      },
      body: JSON.stringify({
        chatInput: message, // matches AI Agent's {{$json.chatInput}}
        sessionId,
      }),
      cache: "no-store",
    });

    let payload: any;
    try {
      payload = await n8nRes.json();
    } catch {
      const text = await n8nRes.text();
      payload = { reply: text };
    }

    if (!n8nRes.ok) {
      const errorMsg = payload?.error || "Chatbot upstream error";
      return NextResponse.json({ error: errorMsg }, { status: n8nRes.status });
    }

    const res = NextResponse.json({ ok: true, ...payload });
    res.cookies.set("chat_session_id", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Failed to contact chatbot" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Use POST with { message }" }, { status: 405 });
}
