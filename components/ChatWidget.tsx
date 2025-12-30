// components/ChatWidget.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";

type Role = "user" | "assistant";
type Msg = { id: string; role: Role; text: string };

export default function ChatWidget() {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname === "/") {
      setIsVisible(false);
      const onLoaded = () => setIsVisible(true);
      const onLoading = () => setIsVisible(false);

      window.addEventListener("rov-home-loaded", onLoaded);
      window.addEventListener("rov-site-loaded", onLoaded);
      window.addEventListener("rov-site-loading", onLoading);

      return () => {
        window.removeEventListener("rov-home-loaded", onLoaded);
        window.removeEventListener("rov-site-loaded", onLoaded);
        window.removeEventListener("rov-site-loading", onLoading);
      };
    } else {
      setIsVisible(true);
    }
  }, [pathname]);

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
          className={`fixed bottom-28 md:bottom-6 right-6 h-14 w-14 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center shadow-lg hover:bg-black/70 overflow-hidden group z-[9999] transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
          aria-label="Open chat"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
            <div className="shimmer-effect"></div>
          </div>
          <MessageCircle className="h-7 w-7 relative z-10" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-[450px] max-w-[92vw] h-[600px] max-h-[80vh] rounded-3xl shadow-2xl border border-white/10 bg-black/50 backdrop-blur-md flex flex-col overflow-hidden z-[9999]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/30 backdrop-blur-sm text-white">
            <span className="font-semibold text-white/90" style={{ fontFamily: "Futura, sans-serif" }}>
              Range of View Studios
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-6 space-y-3 bg-transparent"
          >
            {messages.length === 0 && (
              <div className="text-sm text-white/60" style={{ fontFamily: "Futura, sans-serif" }}>
                Hi! Ask me about our products, services, or support.
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm max-w-[80%] ${m.role === "user"
                  ? "ml-auto bg-white/10 backdrop-blur-sm text-white border border-white/20"
                  : "mr-auto bg-white/5 backdrop-blur-sm text-white/90 border border-white/10"
                  }`}
                style={{ fontFamily: "Futura, sans-serif" }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="text-xs text-white/60" style={{ fontFamily: "Futura, sans-serif" }}>
                Thinking…
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-black/30 backdrop-blur-sm">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type your message…"
                rows={2}
                className="flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-white placeholder:text-white/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                style={{ fontFamily: "Futura, sans-serif" }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-3 text-white text-sm disabled:opacity-40 hover:bg-white/20 transition-all"
                style={{ fontFamily: "Futura, sans-serif" }}
              >
                Send
              </button>
            </div>
            <div className="mt-2 text-[11px] text-white/50" style={{ fontFamily: "Futura, sans-serif" }}>
              Enter to send • Shift+Enter for a new line
            </div>
          </div>
        </div>
      )}

      {/* Shimmer effect styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-150%) rotate(15deg);
          }
          100% {
            transform: translateX(250%) rotate(15deg);
          }
        }

        .shimmer-effect {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 60%;
          height: 200%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          filter: blur(10px);
          animation: shimmer 2.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
