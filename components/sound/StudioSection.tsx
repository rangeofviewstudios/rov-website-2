"use client";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import SessionPhoto, { SESSION } from "@/components/sound/SessionPhoto";
import { BOOKING_URL, CAL_LINKS } from "@/data/soundPricing";
import CalBookButton from "@/components/sound/CalBookButton";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const HEADING_FONT = "Norwige, sans-serif";
const BODY_FONT = "'Roboto', sans-serif";

const valueProps = [
  {
    label: "Professional Mixing & Mastering in Atlanta",
    detail: "Record in our Atlanta studio and leave with your labeled stems and whatever we mixed during the session. When you are ready, we finish it: vocals balanced, cleaned, and enhanced, then mastered to streaming loudness for Spotify, Apple Music, and every major platform. Mix and master from $58 a song, first one $50.",
    tag: "Record, then finish",
  },
  {
    label: "Industry-Standard Recording Equipment",
    detail: "Our Atlanta recording studio is equipped with the same tools used on records you already listen to: UAD, Waves, FabFilter, Neumann microphones, and Focusrite preamps. Whether you're tracking vocals, mixing a full trackout, or mastering for distribution, every session is powered by professional-grade plugins and hardware.",
    tag: "Pro gear",
  },
  {
    label: "Published Rates, No Quote Call",
    detail: "$80 an hour, $160 for two hours, $300 for four. Every number is on the pricing page before you book, and the mix and master is a separate line you can see in full. Same pro gear, radio-ready results, no surprise invoices.",
    tag: "No surprises",
  },
];

function ValueAccordion() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="max-w-7xl mx-auto mb-16 md:mb-24 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-10 lg:gap-16 items-start">
      {/* The room, in use. Replaces the old b-roll strip; one real frame
          beside the list says more than three loops of an empty desk did. */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={spring}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl lg:order-2 lg:sticky lg:top-24"
      >
        <SessionPhoto frame={SESSION.midPhrase} sizes="(min-width: 1024px) 40vw, 100vw" />
      </motion.div>

      <div className="lg:order-1">
      {/* Section label */}
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={spring}
        className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-10 md:mb-14"
        style={{ fontFamily: BODY_FONT }}
      >
        What You Get
      </motion.span>

      <div>
        {valueProps.map((prop, i) => {
          const isActive = active === i;
          const idx = String(i + 1).padStart(2, "0");

          return (
            <motion.div
              key={prop.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...spring, delay: i * 0.08 }}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive((prev) => (prev === i ? -1 : i))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive((prev) => (prev === i ? -1 : i));
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              className="cursor-pointer border-t border-white/[0.07] last:border-b focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EA9A61]/40 rounded-sm"
            >
              <div className="py-6 md:py-8 flex items-start md:items-center gap-4 md:gap-8">
                {/* Index number */}
                <span
                  className="text-3xl md:text-5xl font-bold italic shrink-0 w-12 md:w-16 transition-colors duration-500"
                  style={{
                    fontFamily: HEADING_FONT,
                    color: isActive ? "#EA9A61" : "rgba(255,255,255,0.12)",
                  }}
                >
                  {idx}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                    <h3
                      className="text-xl md:text-3xl lg:text-4xl font-bold italic transition-colors duration-500"
                      style={{
                        fontFamily: HEADING_FONT,
                        color: isActive ? "#fff" : "rgba(255,255,255,0.35)",
                      }}
                    >
                      {prop.label}
                    </h3>
                    <motion.span
                      animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="text-[clamp(0.7rem,1.5vw,0.75rem)] md:text-xs uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-[#EA9A61]/30 text-[#EA9A61] shrink-0"
                      style={{ fontFamily: BODY_FONT }}
                    >
                      {prop.tag}
                    </motion.span>
                  </div>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <p
                          className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl pt-3"
                          style={{ fontFamily: BODY_FONT }}
                        >
                          {prop.detail}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Expand indicator */}
                <motion.div
                  animate={{ rotate: isActive ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-colors duration-500"
                  style={{
                    borderColor: isActive ? "rgba(234,154,97,0.4)" : "rgba(255,255,255,0.08)",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ stroke: isActive ? "#EA9A61" : "rgba(255,255,255,0.25)" }}
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
    </div>
  );
}

const recordingFeatures = [
  "A real engineer in the room, not a rented room",
  "UAD, Waves, FabFilter, Neumann mics, Focusrite pres",
  "Walk out with your labeled stems, same day",
  "Mix and master available that week, from $100",
];

function RecordingRates() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} id="record" className="scroll-mt-24 max-w-7xl mx-auto mb-16 md:mb-24">
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={spring}
        className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-3"
        style={{ fontFamily: BODY_FONT }}
      >
        Recording Rates
      </motion.span>
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ ...spring, delay: 0.1 }}
        className="text-white text-3xl md:text-4xl lg:text-5xl font-bold italic mb-3"
        style={{ fontFamily: HEADING_FONT }}
      >
        Published rates, stems in hand.
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ ...spring, delay: 0.15 }}
        className="text-white/40 text-sm md:text-base mb-10 max-w-xl"
        style={{ fontFamily: BODY_FONT }}
      >
        You book the hour and leave with your files and whatever we mixed. The full mix and master is a separate line, and both numbers are on this page.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* Hourly */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.2 }}
          className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8 flex flex-col"
        >
          <span className="text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-white/40 mb-4" style={{ fontFamily: BODY_FONT }}>
            Studio Time
          </span>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-white text-4xl md:text-5xl font-bold italic" style={{ fontFamily: HEADING_FONT }}>$80</span>
            <span className="text-white/30 text-sm" style={{ fontFamily: BODY_FONT }}>/hr</span>
          </div>
          <span className="text-[#EA9A61] text-xs uppercase tracking-[0.15em] mb-6" style={{ fontFamily: BODY_FONT }}>
            Stems included
          </span>
          <ul className="flex-1 space-y-2 mb-6">
            {recordingFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2 text-white/50 text-sm" style={{ fontFamily: BODY_FONT }}>
                <span className="text-[#EA9A61] mt-0.5 shrink-0">&#10003;</span>
                {f}
              </li>
            ))}
          </ul>
          <p className="text-white/55 text-xs italic mb-6 leading-relaxed" style={{ fontFamily: BODY_FONT }}>
            Comparable Atlanta rooms run <span className="text-white/70 not-italic line-through">$75&ndash;120/hr</span>. You leave with your labeled stems the same day.
          </p>
          <CalBookButton
            calLink={CAL_LINKS.hourlySession}
            fallbackHref={BOOKING_URL}
            className="block w-full text-center text-white font-semibold rounded-full border border-white/10 hover:border-white/25 transition-all duration-300 hover:scale-[1.03]"
            style={{ fontFamily: HEADING_FONT, padding: "14px", fontSize: "13px", letterSpacing: "0.05em", background: "rgba(255,255,255,0.03)" }}
          >
            Book a session &rarr;
          </CalBookButton>
        </motion.div>

        {/* 4-hour block — featured */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.3 }}
          className="relative rounded-2xl border border-[#EA9A61]/30 bg-[#EA9A61]/[0.04] p-6 md:p-8 flex flex-col"
        >
          <span
            className="absolute -top-3 left-6 rounded-full border border-[#EA9A61]/40 bg-[#EA9A61]/15 px-3 py-0.5 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-[#EA9A61]"
            style={{ fontFamily: BODY_FONT }}
          >
            Best Deal
          </span>
          <span className="text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-white/40 mb-4" style={{ fontFamily: BODY_FONT }}>
            4-Hour Block
          </span>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-white text-4xl md:text-5xl font-bold italic" style={{ fontFamily: HEADING_FONT }}>$300</span>
            <span className="text-white/30 text-sm line-through" style={{ fontFamily: BODY_FONT }}>$320</span>
          </div>
          <span className="text-[#EA9A61] text-xs uppercase tracking-[0.15em] mb-6" style={{ fontFamily: BODY_FONT }}>
            $75/hr, stems included
          </span>
          <ul className="flex-1 space-y-2 mb-6">
            {["Four hours in the room, your lowest rate", "Your stems plus whatever we mixed in the session", "48-hour turnaround", "Usually two to three songs tracked"].map((f) => (
              <li key={f} className="flex items-start gap-2 text-white/50 text-sm" style={{ fontFamily: BODY_FONT }}>
                <span className="text-[#EA9A61] mt-0.5 shrink-0">&#10003;</span>
                {f}
              </li>
            ))}
          </ul>
          <p className="text-white/55 text-xs italic mb-6 leading-relaxed" style={{ fontFamily: BODY_FONT }}>
            Atlanta rooms average around <span className="text-white/70 not-italic">$102 an hour</span> on rental marketplaces, so four hours elsewhere usually runs <span className="text-white/70 not-italic">$400+</span> before anyone touches a mix.
          </p>
          <CalBookButton
            calLink={CAL_LINKS.finishedSingle}
            fallbackHref={BOOKING_URL}
            className="cta-shine block w-full text-center text-white font-semibold rounded-full transition-all duration-300 hover:scale-[1.03]"
            style={{
              fontFamily: HEADING_FONT,
              padding: "14px",
              fontSize: "13px",
              letterSpacing: "0.05em",
              background: "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
              boxShadow: "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
            }}
          >
            Book your session &rarr;
          </CalBookButton>
        </motion.div>
      </div>

      <p className="text-white/40 text-xs md:text-sm mt-6" style={{ fontFamily: BODY_FONT }}>
        Students may be eligible for additional discounts. <span className="text-[#EA9A61]">Get in touch.</span>
      </p>
    </div>
  );
}

export default function StudioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative bg-black overflow-hidden"
      style={{ padding: "clamp(60px, 10vw, 120px) clamp(16px, 5vw, 60px) clamp(20px, 4vw, 40px)" }}
    >
      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto mb-16 md:mb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end">
          {/* Left — headline */}
          <div className="md:col-span-7">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={headerInView ? { opacity: 1, x: 0 } : {}}
              transition={spring}
              className="inline-block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-4"
              style={{ fontFamily: BODY_FONT }}
            >
              In-House Recording
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...spring, delay: 0.1 }}
              className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight"
              style={{ fontFamily: HEADING_FONT }}
            >
              <span className="font-bold">Real</span>{" "}
              <span className="italic">Studio.</span>
              <br />
              <span className="font-bold">Real</span>{" "}
              <span className="italic">Engineers.</span>
              <br />
              <span
                className="font-bold italic bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(112deg, #EA9A61 6.46%, #B16937 34.96%, #A64D2B 63.88%, #42201C 97.63%)" }}
              >Real Sound.</span>
            </motion.h2>
          </div>

          {/* Right — supporting text */}
          <motion.div
            className="md:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.2 }}
          >
            <p
              className="text-white/50 text-base md:text-lg leading-relaxed mb-6"
              style={{ fontFamily: BODY_FONT }}
            >
              We don&apos;t just mix files from a laptop. Artists record in our Atlanta studio, stand behind real mics,
              and walk out with their stems the same day. Add the mix and master and the record is ready for Spotify, Apple Music, and every streaming platform.
            </p>
            <CalBookButton
              calLink={CAL_LINKS.hourlySession}
              fallbackHref={BOOKING_URL}
              className="inline-flex items-center gap-3 group"
            >
              <span
                className="text-[#EA9A61] text-sm uppercase tracking-[0.15em] group-hover:tracking-[0.25em] transition-all duration-500"
                style={{ fontFamily: BODY_FONT }}
              >
                Book a Session
              </span>
              <motion.span
                className="inline-block w-8 h-px bg-[#EA9A61]"
                whileHover={{ width: 48 }}
                transition={spring}
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#EA9A61"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-1 transition-transform duration-300"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </CalBookButton>
          </motion.div>
        </div>
      </div>

      {/* ── Recording Rates ── */}
      <RecordingRates />

      {/* ── Value Props Accordion ── */}
      <ValueAccordion />

      {/* ── Student Rates Callout ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={spring}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 py-8 md:py-10 px-6 md:px-10 rounded-2xl border border-[#EA9A61]/15"
          style={{ background: "linear-gradient(135deg, rgba(234,154,97,0.06) 0%, transparent 60%)" }}
        >
          <div className="shrink-0">
            <span
              className="text-[#EA9A61] text-5xl md:text-6xl font-bold italic"
              style={{ fontFamily: HEADING_FONT }}
            >
              Students
            </span>
          </div>
          <div className="h-px md:h-12 md:w-px w-full bg-white/[0.08] shrink-0" />
          <div className="flex-1">
            <p
              className="text-white/60 text-sm md:text-base leading-relaxed"
              style={{ fontFamily: BODY_FONT }}
            >
              Students may be eligible for additional discounts. Get in touch.
            </p>
          </div>
          <CalBookButton
            calLink={CAL_LINKS.hourlySession}
            fallbackHref={BOOKING_URL}
            className="shrink-0 text-[#EA9A61] text-sm uppercase tracking-[0.15em] hover:tracking-[0.25em] transition-all duration-500"
            style={{ fontFamily: BODY_FONT }}
          >
            Inquire &rarr;
          </CalBookButton>
        </div>
      </motion.div>
    </section>
  );
}
