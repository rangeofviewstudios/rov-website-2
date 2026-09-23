"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import SessionPhoto, { type SessionFrame } from "@/components/sound/SessionPhoto";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

// The split-screen "lead offer" card: price and deliverables on the left,
// the reason to trust the number on the right. One card, one offer — this
// is what a section leads with instead of a wall of price tiers, which now
// lives on /pricing for anyone who wants the full rate card.

export default function OfferCard({
  numeral,
  tag,
  headline,
  price,
  priceUnit,
  priceNote,
  features,
  cta,
  ctaSlot,
  guaranteeTag,
  guaranteeHeadline,
  guaranteeBody,
  stats,
  photo,
}: {
  /** Ghost numeral in the corner, e.g. "01". */
  numeral: string;
  /** Small pill above the headline, e.g. "Start here". */
  tag: string;
  headline: string;
  price: string;
  priceUnit?: string;
  priceNote?: string;
  features: string[];
  /** Rendered as the primary CTA button when ctaSlot isn't given. */
  cta?: { label: string; href: string };
  /** Overrides `cta` — for a booking flow that needs CalBookButton, not a plain link. */
  ctaSlot?: ReactNode;
  guaranteeTag: string;
  guaranteeHeadline: string;
  guaranteeBody: ReactNode;
  stats?: string[];
  photo?: SessionFrame;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={spring}
      className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#050403] grid grid-cols-1 md:grid-cols-2"
    >
      {/* ── Left: the offer ── */}
      <div className="relative p-8 md:p-12 flex flex-col">
        <span
          aria-hidden
          className="absolute -top-2 right-4 text-[6.5rem] md:text-[8.5rem] font-bold italic leading-none pointer-events-none select-none"
          style={{ fontFamily: HEADING, color: "rgba(255,255,255,0.05)" }}
        >
          {numeral}
        </span>

        <span
          className="relative inline-flex self-start rounded-full border border-[#EA9A61]/30 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#EA9A61] mb-6"
          style={{ fontFamily: BODY }}
        >
          {tag}
        </span>

        <h3
          className="relative text-white text-2xl md:text-3xl font-bold uppercase mb-5 leading-tight"
          style={{ fontFamily: HEADING }}
        >
          {headline}
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="text-white text-5xl md:text-6xl font-bold italic" style={{ fontFamily: HEADING }}>
            {price}
          </span>
          {priceUnit && (
            <span className="text-white/40 text-base" style={{ fontFamily: BODY }}>
              {priceUnit}
            </span>
          )}
        </div>
        {priceNote && (
          <p className="text-white/45 text-sm mt-1 mb-6" style={{ fontFamily: BODY }}>
            {priceNote}
          </p>
        )}

        <ul className={`space-y-2.5 mb-8 ${priceNote ? "" : "mt-6"}`}>
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-white/75 text-sm" style={{ fontFamily: BODY }}>
              <span className="text-[#EA9A61] shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          {ctaSlot ?? (
            cta && (
              <a
                href={cta.href}
                className="cta-shine inline-flex w-full items-center justify-center gap-2 text-white font-semibold transition-all duration-300 hover:scale-[1.02]"
                style={{
                  fontFamily: HEADING,
                  borderRadius: "9999px",
                  background: "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
                  boxShadow: "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
                  padding: "14px",
                  fontSize: "14px",
                  letterSpacing: "0.05em",
                }}
              >
                {cta.label} &rarr;
              </a>
            )
          )}
        </div>
      </div>

      {/* ── Right: why the number holds ── */}
      <div className="relative p-8 md:p-12 flex flex-col justify-center bg-black/30 border-t md:border-t-0 md:border-l border-white/[0.06]">
        {photo && (
          <div className="absolute inset-0 opacity-[0.14]">
            <SessionPhoto frame={photo} sizes="50vw" fade={false} credit={false} />
          </div>
        )}
        <div className="relative">
          <span
            className="block text-[11px] uppercase tracking-[0.2em] text-[#EA9A61] mb-4"
            style={{ fontFamily: BODY }}
          >
            {guaranteeTag}
          </span>
          <h4 className="text-white text-xl md:text-2xl font-semibold mb-4 leading-snug" style={{ fontFamily: BODY }}>
            {guaranteeHeadline}
          </h4>
          <p className="text-white/60 text-sm md:text-base leading-relaxed mb-6" style={{ fontFamily: BODY }}>
            {guaranteeBody}
          </p>
          {stats && stats.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-white/40 text-xs uppercase tracking-[0.15em]" style={{ fontFamily: BODY }}>
              {stats.map((s, i) => (
                <span key={s} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden>&middot;</span>}
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
