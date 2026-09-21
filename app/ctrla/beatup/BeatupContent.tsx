"use client";

import Link from "next/link";
import { SimranAvatar, AyushAvatar } from "./Avatars";
import Lily from "./Lily";

const bg = "#0B0716";
const panel = "#1E1333";
const paper = "#FFFFFF";
const hot = "#FF5FA2";

const mono = "'Neue Montreal', 'Helvetica Neue', Arial, sans-serif";

const swatches = ["#F3ECFB", "#C9A6FF", "#8B4FE0", "#4E1F91", "#1C0B3D"];

export default function BeatupContent() {
  return (
    <main style={{ background: bg, minHeight: "100vh", color: paper, position: "relative", overflow: "hidden" }}>
      {/* scattered lilies */}
      <Lily size={64} style={{ position: "absolute", top: 40, left: 24, opacity: 0.7 }} />
      <Lily size={48} style={{ position: "absolute", top: 220, right: 40, opacity: 0.5, transform: "rotate(24deg)" }} />
      <Lily size={36} style={{ position: "absolute", bottom: 120, left: 80, opacity: 0.45, transform: "rotate(-16deg)" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 980, margin: "0 auto", padding: "clamp(48px,8vw,96px) clamp(20px,5vw,48px) 120px" }}>
        {/* Moodboard: avatars */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <div style={cardStyle}>
            <SimranAvatar size={200} />
            <span style={cardLabel}>simran</span>
          </div>
          <div style={cardStyle}>
            <AyushAvatar size={200} />
            <span style={cardLabel}>ayush</span>
          </div>
        </div>

        {/* Palette swatch strip */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 56 }}>
          {swatches.map((c) => (
            <div key={c} style={{ width: 44, height: 44, borderRadius: 10, background: c, boxShadow: "0 0 0 1px rgba(255,255,255,0.14)" }} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link
            href="/ctrla/beatup/game"
            style={{
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#0B0716",
              background: hot,
              padding: "16px 32px",
              borderRadius: 999,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 0 0 2px rgba(255,95,162,0.25)",
            }}
          >
            okay, keep going &rarr;
          </Link>
        </div>

      </div>
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  background: panel,
  borderRadius: 20,
  padding: "28px 20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 14,
  boxShadow: "inset 0 0 0 1.5px rgba(201,166,255,0.35)",
};

const cardLabel: React.CSSProperties = {
  fontFamily: mono,
  fontSize: 12,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: paper,
};
