// The Wisdom case study voice, on rovmusic. Big uppercase display lines,
// Caveat handwriting in orange ink for the studio talking over the page,
// squiggly rules instead of hairlines. Same tokens as components/casestudy/
// story/theme.ts, wearing the music orange.
//
// No "use client": every export here (M, caveat, and the components below)
// is a plain value or a hookless component, and app/sound/page.tsx and
// ActBreak.tsx consume M and caveat directly on the server. A "use client"
// directive turns those into opaque client references there and breaks the
// build ("Cannot access M.label on the server") even though nothing in this
// file actually needs the client boundary.
//
// Load `caveat.variable` once on the page wrapper; HAND falls back to system
// script faces if it is missing, so nothing breaks on a page that forgets.

import { Caveat } from "next/font/google";
import { HAND_FONT, ROV_TYPE } from "@/components/casestudy/story/theme";

export const caveat = Caveat({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-caveat" });

export const M = {
  ink: "#EA9A61",
  cream: "#FFF4E3",
  display: ROV_TYPE.display,
  label: ROV_TYPE.label,
  body: ROV_TYPE.body,
  hand: HAND_FONT,
} as const;

/** Handwriting in ink. `tilt` in degrees; small and alternating reads best. */
export function Hand({
  children,
  tilt = -1.4,
  color = M.ink,
  className = "",
  style,
}: {
  children: React.ReactNode;
  tilt?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`block ${className}`}
      style={{ fontFamily: M.hand, fontWeight: 600, color, transform: `rotate(${tilt}deg)`, ...style }}
    >
      {children}
    </span>
  );
}

/** A drawn underline. Width comes from the parent. */
export function Squiggle({ color = M.ink, height = 14 }: { color?: string; height?: number }) {
  return (
    <svg viewBox="0 0 240 18" preserveAspectRatio="none" aria-hidden fill="none" style={{ width: "100%", height }}>
      <path d="M2,11 C42,3 78,16 118,8 C158,1 198,15 238,6" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** A handwritten tag pinned to a photo corner, like the Frames tags on Wisdom. */
export function PinTag({ children, tilt = -2.5 }: { children: React.ReactNode; tilt?: number }) {
  return (
    <span
      className="absolute top-3 left-3 z-10 rounded-full px-3 py-0.5 text-xl leading-tight md:text-2xl"
      style={{ backgroundColor: "rgba(0,0,0,0.72)", color: M.ink, fontFamily: M.hand, fontWeight: 600, transform: `rotate(${tilt}deg)` }}
    >
      {children}
    </span>
  );
}

/** Route-out CTA. Was hand-lettered like the note above it, which read as
 * one more scribble instead of the one thing on the page you can click.
 * Now it's a solid pill in ink orange, still set in the hand font for
 * voice, so it stands apart from both the note and the display headline. */
export function HandLink({ href, children, tilt = 0.8 }: { href: string; children: React.ReactNode; tilt?: number }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2.5 rounded-full pl-5 pr-4 py-2.5 text-[1.15rem] leading-none transition-transform duration-300 hover:scale-105 md:text-[1.3rem]"
      style={{
        fontFamily: M.hand,
        fontWeight: 700,
        color: "#0B0603",
        background: M.ink,
        transform: `rotate(${tilt}deg)`,
      }}
    >
      {children}
      <svg viewBox="0 0 60 30" aria-hidden fill="none" className="h-4 w-8 shrink-0 transition-transform duration-300 group-hover:translate-x-1" stroke="#0B0603" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4,17 C18,10 30,22 54,14" />
        <path d="M54,14 L44,7 M54,14 L45,23" />
      </svg>
    </a>
  );
}
