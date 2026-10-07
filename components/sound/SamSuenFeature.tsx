"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { LightSplash, M, Squiggle } from "@/components/sound/musicStory";


const spring = { type: "spring" as const, stiffness: 72, damping: 18 };

// In-house artist development proof. DDKFeatureTestimonial is the client
// spotlight; this is the deeper cut: an artist we develop end to end.
// Full story lives at /sound/sam-suen (rovmusic.com/sam-suen on the music host).

const STATS = [
  { value: "20k+", label: "New followers · Summer '26" },
  { value: "100k+", label: "Total streams" },
  { value: "20k", label: "Streams · Stars Collide" },
];

const PILLARS = [
  "Socials grown in-house",
  "Brand built from zero",
  "Website designed & shipped",
  "Records mixed & released",
  "Festival stage, produced",
];

export default function SamSuenFeature() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative bg-black overflow-hidden"
      style={{ padding: "clamp(24px, 4vw, 48px) clamp(16px, 5vw, 80px) clamp(80px, 12vw, 140px)" }}
    >
      {/* Splashes of brown light on black: one behind the festival photo,
          one low on the left under the headline, so the section blends into
          the page instead of sitting on a tinted panel. */}
      <LightSplash
        splashes={[
          { right: "-6%", top: "28%", size: "min(60vw, 820px)", tone: "ember", strength: 0.3 },
          { left: "-14%", bottom: "-10%", size: "min(55vw, 700px)", tone: "rust", strength: 0.34 },
          { left: "30%", top: "-18%", size: "min(35vw, 460px)", tone: "rust", strength: 0.18 },
        ]}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0 }}
          className="flex items-center gap-3 mb-14 md:mb-20"
        >
          <div
            className="w-5 h-px"
            style={{ backgroundColor: "rgba(234,154,97,0.4)" }}
          />
          <span
            className="type-eyebrow"
            style={{ color: "rgba(234,154,97,0.55)" }}
          >
            Artist Development · Built In-House
          </span>
        </motion.div>

        {/* Main grid — copy left, photo right (mirrors DDK, which is video-left) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-20 items-start">
          {/* ── LEFT — story + stats ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ ...spring, delay: 0.08 }}
            className="flex flex-col gap-8 order-2 lg:order-1"
          >
            {/* Artist identity */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0"
                style={{ border: "2px solid rgba(234,154,97,0.22)" }}
              >
                <Image
                  src="/teammembers/samsuentm.webp"
                  alt="Sam Suen"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
              <div>
                <p
                  className="type-name text-white"
                >
                  Sam Suen
                </p>
                <p
                  className="type-meta mt-0.5"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Korean-Chinese Hip-Hop · ROV Artist
                </p>
              </div>
            </div>

            {/* Headline copy */}
            <h2
              className="type-h2 text-white"
            >
              One artist. Every lane.{" "}
              <span style={{ color: "#EA9A61" }}>
                Brand, site, sound, stage.
              </span>
            </h2>
            <div className="max-w-[180px]">
              <Squiggle />
            </div>
            <p
              className="type-body -mt-3"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Sam is the proof. We grow his socials, built his brand
              from scratch, designed his website, mix and release his records,
              and put him on a festival stage. No outsourcing, no hand-offs.
              This is what artist development looks like when one team runs the
              whole pipeline.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col gap-1.5">
                  <span
                    className="type-stat"
                    style={{ color: "#EA9A61" }}
                  >
                    {s.value}
                  </span>
                  <span
                    className="type-meta"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div
              className="w-full h-px"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            />

            {/* Pillars */}
            <div className="flex flex-wrap gap-2">
              {PILLARS.map((p) => (
                <span
                  key={p}
                  className="type-tag px-3 py-1.5 rounded-full"
                  style={{
                    border: "1px solid rgba(234,154,97,0.45)",
                    color: "#FFF4E3",
                    background: "rgba(8,5,3,0.78)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {p}
                </span>
              ))}
            </div>

            {/* CTA → full case study */}
            <div>
              {/* Stays /sound/sam-suen on purpose. On the music host this 308s
                  to /sam-suen (one hop), but /sam-suen only exists there, so
                  linking direct would 404 in dev and on rovstudios. */}
              <Link
                href="/sound/sam-suen"
                className="type-btn cta-shine inline-flex items-center gap-3 px-7 py-3.5 rounded-full transition-transform duration-300 hover:scale-105"
                style={{ background: M.inkGradient, boxShadow: M.ctaShadow, color: M.cream }}
              >
                <span
                  
                >
                  See the full story
                </span>
                <span aria-hidden>
                  →
                </span>
              </Link>
            </div>
          </motion.div>

          {/* ── RIGHT — festival photo ── */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ ...spring, delay: 0.16 }}
            className="relative order-1 lg:order-2"
          >
            <div
              className="absolute -inset-6 rounded-3xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, rgba(234,154,97,0.07) 0%, transparent 68%)",
              }}
            />
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(234,154,97,0.13)",
                boxShadow:
                  "0 40px 90px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,244,227,0.04)",
              }}
            >
              <Image
                src="/ctrla/VOL1/dreamasiacover.webp"
                alt="Sam Suen headlining DreamAsia Fest"
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
                draggable={false}
              />
              {/* Caption pill */}
              <div
                className="absolute bottom-3.5 left-3.5 flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(8,8,7,0.75)",
                  border: "1px solid rgba(234,154,97,0.22)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                }}
              >
                <span
                  className="type-meta"
                  style={{ color: "#EA9A61" }}
                >
                  DreamAsia Fest · Headliner
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3.5 px-0.5">
              <span
                className="type-meta"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                Developed · ROV Studios
              </span>
              <span
                className="type-meta"
                style={{ color: "rgba(255,255,255,0.15)" }}
              >
                2026
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
