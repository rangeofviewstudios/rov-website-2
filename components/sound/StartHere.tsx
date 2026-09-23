"use client";

import { checkoutHref } from "@/data/soundPricing";
import { useIntake } from "@/components/music/IntakeContext";
import { SESSION } from "@/components/sound/SessionPhoto";
import OfferCard from "@/components/sound/OfferCard";

const BODY = "'Roboto', sans-serif";

// Replaces PathFork + IntroOffer, which back-to-back said "your first mix is
// $50" twice in one scroll with no way for a newcomer to tell the second
// one wasn't a new offer. One offer, in the split-screen card: price and
// deliverables on the left, the guarantee on the right.
//
// The Artist/Manager split used to be silent: RoleGate (the landing popup)
// set it, and copy downstream just reflected whatever was answered there
// with no visible control. This toggle is the first place on the page you
// can actually see and flip it.

const COPY = {
  artist: {
    tag: "Start here",
    headline: "Your first mix. No commitment.",
    features: ["Full mix & master, not just mastering", "48-hour turnaround", "2 revisions included", "Nothing else to buy first"],
    cta: "Send your stems",
    guaranteeHeadline: "Hear it before you commit to anything.",
    guaranteeBody:
      "This is the only tier you can buy once. If the mix doesn't hold up, you're out fifty dollars and two days, not a catalogue. Every tier after this one exists because people heard this one first.",
    stats: ["48 HRS", "2 REVISIONS", "NO SUBSCRIPTION"],
  },
  manager: {
    tag: "Start here",
    headline: "Your first artist's first mix. No roster commitment.",
    features: ["Full mix & master, not just mastering", "48-hour turnaround", "2 revisions included", "Same offer, per artist"],
    cta: "Send their stems",
    guaranteeHeadline: "Hear the work before you commit the roster.",
    guaranteeBody:
      "One artist, one song, the same $50 you'd pay for any single mix. If it holds up, Foundation covers the backend the same way for everyone else on the roster.",
    stats: ["48 HRS", "2 REVISIONS", "PER ARTIST"],
  },
} as const;

export default function StartHere() {
  const { role, setRole } = useIntake();
  const isManager = role === "manager";
  const copy = COPY[isManager ? "manager" : "artist"];

  return (
    <section
      id="start"
      className="scroll-mt-24 relative bg-black overflow-hidden"
      style={{ padding: "clamp(60px, 10vw, 120px) clamp(16px, 5vw, 60px)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Artist / Manager toggle — visible and immediate, not a popup */}
        <div className="flex justify-center mb-10 md:mb-14">
          <div
            role="group"
            aria-label="Answering as"
            className="inline-flex p-1 rounded-full border border-white/[0.1] bg-white/[0.02]"
          >
            <button
              type="button"
              onClick={() => setRole("artist")}
              aria-pressed={!isManager}
              className="rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-300"
              style={{
                fontFamily: BODY,
                background: !isManager ? "#EA9A61" : "transparent",
                color: !isManager ? "#0B0603" : "rgba(255,244,227,0.55)",
              }}
            >
              Artist
            </button>
            <button
              type="button"
              onClick={() => setRole("manager")}
              aria-pressed={isManager}
              className="rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-300"
              style={{
                fontFamily: BODY,
                background: isManager ? "#EA9A61" : "transparent",
                color: isManager ? "#0B0603" : "rgba(255,244,227,0.55)",
              }}
            >
              Manager
            </button>
          </div>
        </div>

        <OfferCard
          numeral="01"
          tag={copy.tag}
          headline={copy.headline}
          price="$50"
          priceUnit="/song"
          priceNote="one song, once per artist"
          features={[...copy.features]}
          cta={{ label: copy.cta, href: checkoutHref("mix_first") }}
          guaranteeTag="The guarantee"
          guaranteeHeadline={copy.guaranteeHeadline}
          guaranteeBody={copy.guaranteeBody}
          stats={[...copy.stats]}
          photo={SESSION.midPhrase}
        />

        <p className="text-white/40 text-[clamp(0.7rem,1.5vw,0.75rem)] mt-6 text-center leading-relaxed" style={{ fontFamily: BODY }}>
          See every rate, mixing pack, and the Foundation offer on{" "}
          <a href="/pricing" className="text-[#EA9A61]/85 hover:text-[#EA9A61] underline underline-offset-2 decoration-[#EA9A61]/30">
            the pricing page
          </a>.
        </p>
      </div>
    </section>
  );
}
