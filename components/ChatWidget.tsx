// components/ChatWidget.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";

type Role = "user" | "assistant";
type Msg = { id: string; role: Role; text: string };

export default function ChatWidget() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, open]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Chat error");

      const reply =
        typeof data?.output === "string"
          ? data.output
          : JSON.stringify(data, null, 2);

      const botMsg: Msg = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: reply,
      };
      setMessages((m) => [...m, botMsg]);
    } catch {
      const botErr: Msg = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "Sorry, I couldn’t reach the assistant right now. Please try again.",
      };
      setMessages((m) => [...m, botErr]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Toggle Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700"
          aria-label="Open chat"
        >
          <MessageCircle className="h-7 w-7" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-[340px] max-w-[92vw] max-h-[70vh] rounded-2xl shadow-2xl border border-gray-700 bg-gray-900 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800 text-white">
            <span className="font-semibold">Range of View Studios</span>
            <button
              onClick={() => setOpen(false)}
              className="hover:text-red-400"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900"
          >
            {messages.length === 0 && (
              <div className="text-sm text-gray-400">
                Hi! Ask me about our products, services, or support.
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`whitespace-pre-wrap rounded-lg px-3 py-2 text-sm max-w-[80%] ${
                  m.role === "user"
                    ? "ml-auto bg-indigo-600 text-white"
                    : "mr-auto bg-gray-800 text-gray-100 border border-gray-700"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="text-xs text-gray-400">Thinking…</div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-700 bg-gray-800">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type your message…"
                rows={2}
                className="flex-1 resize-none rounded-lg border border-gray-600 bg-gray-900 text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white text-sm disabled:opacity-60 hover:bg-indigo-700"
              >
                Send
              </button>
            </div>
            <div className="mt-1 text-[11px] text-gray-500">
              Enter to send • Shift+Enter for a new line
            </div>
          </div>
        </div>
      )}
    </>
  );
}
