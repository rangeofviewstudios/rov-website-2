"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AyushTarget, FloralBat } from "./Sprites";
import Scenery from "./Scenery";
import { SimranAvatar, AyushAvatar } from "../Avatars";

const HITS_TO_WIN = 7;

const CAPTIONS = [
  "THWACK!",
  "there it is.",
  "again?",
  "okay, fair.",
  "keep going.",
  "one more.",
  "still standing (barely).",
  "you're getting good at this.",
];

type Petal = { id: number; left: number; delay: number; duration: number; rotate: number };
// A tuft of hair knocked loose by a hit. Spawns at the head, tumbles off.
type Tuft = { id: number; dx: number; size: number };

export default function GameContent() {
  const [started, setStarted] = useState(false);
  const [hits, setHits] = useState(0);
  const [swinging, setSwinging] = useState(false);
  const [shake, setShake] = useState(false);
  const [hurt, setHurt] = useState(false);
  const [tufts, setTufts] = useState<Tuft[]>([]);
  const [caption, setCaption] = useState("swing at me. (press B, or tap the bat)");
  const [won, setWon] = useState(false);

  const petals: Petal[] = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        duration: 2.6 + Math.random() * 2,
        rotate: Math.random() * 360,
      })),
    []
  );

  const swing = useCallback(() => {
    if (!started || swinging || won) return;
    setSwinging(true);
    window.setTimeout(() => {
      setHits((h) => {
        const next = h + 1;
        if (next >= HITS_TO_WIN) {
          setCaption("okay okay, forgiven.");
          setWon(true);
        } else {
          setCaption(CAPTIONS[Math.floor(Math.random() * CAPTIONS.length)]);
        }
        return next;
      });
      setShake(true);
      setHurt(true);
      window.setTimeout(() => setShake(false), 260);
      window.setTimeout(() => setHurt(false), 700);
      // Knock a tuft loose, tumbling toward the bat side.
      const tuft: Tuft = { id: Date.now(), dx: 20 + Math.random() * 60, size: 14 + Math.random() * 12 };
      setTufts((t) => [...t, tuft]);
      window.setTimeout(() => setTufts((t) => t.filter((x) => x.id !== tuft.id)), 1100);
    }, 180);
    window.setTimeout(() => setSwinging(false), 420);
  }, [started, swinging, won]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      if (!started) {
        if (key === "b" || key === "enter") setStarted(true);
        return;
      }
      if (key === "b") swing();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, swing]);

  if (!started) {
    return (
      <main
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(28px,5vw,44px)",
          background: "#071433",
          fontFamily: "'Neue Montreal', 'Helvetica Neue', Arial, sans-serif",
          padding: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px,4vw,40px)" }}>
          <SimranAvatar size={160} />
          <AyushAvatar size={160} />
        </div>

        <p
          style={{
            fontWeight: 700,
            fontSize: "clamp(14px,2.2vw,18px)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#fff",
            textAlign: "center",
            margin: 0,
          }}
        >
          press b to beat up ayush
        </p>

        <button
          onClick={() => setStarted(true)}
          style={{
            fontFamily: "'Neue Montreal', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#071433",
            background: "#FF5FA2",
            padding: "16px 40px",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 0 0 2px rgba(255,95,162,0.25)",
          }}
        >
          enter
        </button>
      </main>
    );
  }

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#071C55",
        fontFamily: "'Neue Montreal', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <Scenery />

      {/* hit caption */}
      <div
        style={{
          position: "absolute",
          top: "6%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 5,
        }}
      >
        <div
          style={{
            fontFamily: "'Neue Montreal', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(22px,4vw,34px)",
            color: "#fff",
            textShadow: "0 2px 12px rgba(0,0,0,0.35)",
          }}
        >
          {caption}
        </div>
        <div style={{ marginTop: 8, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>
          hits: {hits} / {HITS_TO_WIN}
        </div>
      </div>

      {/* target + bat. The bat is anchored to Ayush's head, not the page
          corner, so the swing lands on the head at every viewport size.
          Target is 200px wide, 420 units tall → 1 unit ≈ 0.909px. Head
          centre sits at (108,120) units → (98px, 109px). */}
      {!won && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "10%",
            width: 200,
            transform: `translateX(-50%) ${shake ? "translateX(-6px)" : ""}`,
            zIndex: 3,
          }}
        >
          <div
            style={{
              filter: shake ? "brightness(1.4) saturate(1.4)" : "none",
              transform: shake ? "rotate(-4deg) translateY(-6px)" : "rotate(0deg)",
              transition: "transform 120ms ease-out, filter 120ms ease-out",
            }}
          >
            <AyushTarget width={200} hits={hits} maxHits={HITS_TO_WIN} hurt={hurt} />
          </div>

          {/* impact burst at the temple */}
          {shake && (
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              style={{ position: "absolute", left: 118, top: 60, width: 90, height: 90, pointerEvents: "none" }}
            >
              <path
                d="M50 4L58 34L88 22L66 46L96 58L64 60L74 92L50 70L26 92L36 60L4 58L34 46L12 22L42 34Z"
                fill="#FFD54F"
                stroke="#FF5FA2"
                strokeWidth="4"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {/* hair tufts knocked loose */}
          {tufts.map((t) => (
            <span
              key={t.id}
              aria-hidden
              style={{
                position: "absolute",
                left: 80 + t.dx * 0.4,
                top: 70,
                width: t.size,
                height: t.size,
                borderRadius: "50%",
                background: "#14100C",
                animation: "beatup-tuft 1s ease-in forwards",
                pointerEvents: "none",
              }}
            />
          ))}

          {/* bat. Handle is the pivot, parked to the right of the head at
              head height. Resting: barrel up. Swing: barrel horizontal,
              tip landing on the right side of the head. */}
          <button
            onClick={swing}
            aria-label="Swing the floral bat"
            style={{
              position: "absolute",
              left: 330,
              top: 109 - 32,
              width: 260,
              height: 65,
              zIndex: 4,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transform: swinging ? "rotate(178deg)" : "rotate(238deg)",
              transformOrigin: "0% 50%",
              transition: "transform 180ms cubic-bezier(.2,.8,.3,1.4)",
            }}
          >
            <FloralBat width={260} />
          </button>
        </div>
      )}

      {!won && (
        <p
          style={{
            position: "absolute",
            bottom: "2%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 12,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.75)",
            zIndex: 5,
          }}
        >
          press B or tap the bat
        </p>
      )}

      {/* ending state */}
      {won && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            zIndex: 6,
          }}
        >
          <h1
            style={{
              fontFamily: "'Neue Montreal', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(36px,7vw,64px)",
              color: "#fff",
              textShadow: "0 4px 20px rgba(0,0,0,0.35)",
              margin: 0,
              textAlign: "center",
            }}
          >
            forgiven. (for now.)
          </h1>
          <Link
            href="/ctrla/beatup"
            style={{
              fontFamily: "'Neue Montreal', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#0B0716",
              background: "#F3ECFB",
              padding: "16px 32px",
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            back
          </Link>

          {/* lily petal confetti */}
          {petals.map((p) => (
            <span
              key={p.id}
              style={{
                position: "absolute",
                top: -20,
                left: `${p.left}%`,
                width: 14,
                height: 14,
                borderRadius: "60% 40% 60% 40%",
                background: "#F3ECFB",
                boxShadow: "0 0 0 3px rgba(227,194,74,0.9) inset",
                animation: `beatup-fall ${p.duration}s linear ${p.delay}s infinite`,
                transform: `rotate(${p.rotate}deg)`,
                pointerEvents: "none",
              }}
            />
          ))}
        </div>
      )}

      <style jsx global>{`
        @keyframes beatup-tuft {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(70px, 220px) rotate(300deg);
            opacity: 0;
          }
        }
        @keyframes beatup-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0.6;
          }
        }
      `}</style>
    </main>
  );
}
