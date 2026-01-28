// app/api/chat/proxy/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const n8nUrl = "https://rangeofviewstudios.app.n8n.cloud/webhook/16706b5d-2ad3-4c5e-bb89-6a573883b89f/chat";

        // Build the payload
        const payload: any = {
            chatInput: body.message || body.chatInput || "",
        };
        if (body.sessionId) {
            payload.sessionId = body.sessionId;
        }

        console.log("Proxying to N8N:", { url: n8nUrl, payload });

        const n8nRes = await fetch(n8nUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shared-Secret": process.env.N8N_SHARED_SECRET ?? "",
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        });

        if (!n8nRes.ok) {
            const text = await n8nRes.text();
            console.error("N8N Proxy Error Status:", n8nRes.status, "Response:", text);
            return NextResponse.json({ error: "N8N Error: " + text }, { status: n8nRes.status });
        }

        const data = await n8nRes.json();
        console.log("N8N Success Response:", data);
        return NextResponse.json(data);
    } catch (err) {
        console.error("Chat Proxy Exception:", err);
        return NextResponse.json({ error: "Failed to contact chatbot" }, { status: 500 });
    }
}
