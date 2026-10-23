"use client";

// "Whatever's missing." The full-service claim, framed as a career gap rather
// than a product menu.
//
// This replaced the old add-on pricing grid. A price menu asks you to pick a
// product; this asks what's missing and says we fill it, which is the business
// the strategy doc actually describes.
//
// Pricing lives on /pricing, linked from the header, so no stray numbers float
// around after the visuals.

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import Gallery from "@/components/sections/Gallery";
import VideoShowcaseSection from "@/components/sound/VideoShowcaseSection";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const GAPS = [
  { label: "Record", note: "Tracked in our Atlanta room, stems the same day." },
  { label: "Mix", note: "By the engineer who was in the session." },
  { label: "Master", note: "Ready for Spotify, Apple Music, and the rest." },
  { label: "Artwork", note: "Cover art that looks like the record sounds." },
  { label: "Video", note: "Visuals and motion shot with the release in mind." },
];

export default function CareerGaps() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="whatever-is-missing"
      className="scroll-mt-24 relative bg-black overflow-hidden"
      style={{ padding: "clamp(70px, 11vw, 130px) 0" }}
    >
      {/* Warm bloom behind the type, so the marquee sits on something */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[1100px] h-[460px] rounded-full pointer-events-none blur-[150px]"
        style={{ background: "radial-gradient(ellipse, rgba(234,154,97,0.09) 0%, transparent 70%)" }}
      />

      <div
        className="relative z-10 max-w-7xl mx-auto"
        style={{ padding: "0 clamp(16px, 5vw, 60px)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-start">
          <div className="md:col-span-7">
            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={spring}
              className="type-eyebrow block text-[#EA9A61] mb-5"
            >
              Whatever&apos;s missing
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...spring, delay: 0.08 }}
              className="type-h2 text-white"
            >
              A record needs more than a mix.
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(112deg, #EA9A61 6.46%, #B16937 50%, #A64D2B 97.63%)" }}
              >
                One room covers the rest.
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.14 }}
            className="md:col-span-5 md:pt-8"
          >
            <p className="type-lead text-white/70 mb-7">
              Most artists hire five people for one release and spend the whole rollout
              translating between them. Tell us what&apos;s missing and we make that part
              too, in the same room as the record.
            </p>
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-3 type-link text-[#EA9A61]/85 hover:text-[#EA9A61] transition-colors whitespace-nowrap"
              style={{ letterSpacing: "0.03em" }}
            >
              See what it costs
              <span className="inline-block w-8 h-px bg-[#EA9A61]/70 transition-all duration-300 group-hover:w-12" />
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </motion.div>
        </div>

        {/* The five hires, collapsed into one: a ledger of what the room makes */}
        <ol className="mt-14 md:mt-20 grid grid-cols-2 md:grid-cols-5 border-t border-white/15 mb-14 md:mb-20">
          {GAPS.map((g, i) => (
            <motion.li
              key={g.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...spring, delay: 0.2 + i * 0.07 }}
              className="relative pt-5 pb-7 pr-4 md:pr-6 md:pl-6 md:first:pl-0 md:border-l md:border-white/10 md:first:border-l-0"
            >
              <span className="type-eyebrow block text-[#EA9A61] mb-3">0{i + 1}</span>
              <span className="block text-white text-2xl md:text-3xl leading-none mb-3">{g.label}</span>
              <span className="block text-white/55 text-sm leading-relaxed">{g.note}</span>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* ── The evidence ── */}
      <div className="relative z-10 mt-10 md:mt-14">
        <Gallery />
        <VideoShowcaseSection />
      </div>
    </section>
  );
}
