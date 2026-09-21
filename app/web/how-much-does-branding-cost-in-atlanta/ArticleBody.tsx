"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import BlogLeadForm from "@/components/blog/BlogLeadForm";
import { FAQS } from "./content";

const NavigationDock = dynamic(
  () => import("@/components/sections/NavDoc").then((mod) => ({ default: mod.NavigationDock })),
  { ssr: false }
);
const Footer = dynamic(() => import("@/components/sections/Footer"), { ssr: false });

const TOC = [
  { id: "the-short-answer", label: "The short answer" },
  { id: "what-moves-the-price", label: "What actually moves the price" },
  { id: "the-three-tiers", label: "Logo, identity, or identity plus website" },
  { id: "the-real-cost-of-cheap", label: "What a cheap logo costs you later" },
  { id: "how-to-get-a-fair-quote", label: "How to know you are getting a fair quote" },
  { id: "faq", label: "Frequently asked questions" },
];

const STATS = [
  { number: "$500–$2.5k", label: "Logo only", sub: "no strategy, no system" },
  { number: "$2k–$6k", label: "Full brand identity", sub: "logo, palette, type, guidelines" },
  { number: "3 sec", label: "To form a first impression", sub: "before anyone reads a word" },
];

const FACTORS = [
  {
    n: "01",
    title: "How much strategy work is included",
    body: "A designer who jumps straight to logo concepts skipped the part that makes a brand actually work: figuring out who you are speaking to and what you want them to feel. Strategy work costs more up front, but it is the difference between a logo that looks nice and a brand identity that holds up as you grow.",
  },
  {
    n: "02",
    title: "How many deliverables you actually get",
    body: "A $500 quote might get you one logo file. A $3,000 quote might get you logo variations, a full color palette, typography choices, brand guidelines, and templates. Compare what is included, not just the total number, or you will end up paying twice once you realize the cheap version left things out.",
  },
  {
    n: "03",
    title: "Whether it is bundled with a website",
    body: "Building brand identity and a website at the same time is usually cheaper than doing them months apart, because the strategy work only has to happen once. It also means your site launches with the right colors and typography from day one instead of getting redesigned a year later once the brand actually settles.",
  },
  {
    n: "04",
    title: "The experience level of who you hire",
    body: "A freelancer just starting out might charge $300 for a logo. An established studio with a strategy process, multiple rounds of revisions, and a track record of real client results will charge more, because you are paying for judgment as much as execution.",
  },
];

const TIERS = [
  ["Logo only", "$500 – $2,500", "A mark and maybe a couple of color variations. No strategy, no guidelines, no system.", "A side project or very early-stage test"],
  ["Full brand identity", "$2,000 – $6,000", "Logo, color palette, typography, brand guidelines, often templates for social or business cards.", "A business ready to look consistent everywhere it shows up"],
  ["Brand identity + website", "$4,500 – $12,000", "Everything above, plus a website built to match from the first page, not retrofitted later.", "A business about to invest seriously in growth"],
];

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="faq" style={{ background: "#FFF4E3", padding: "0 24px 64px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ paddingTop: 48, borderTop: "1px solid rgba(59,33,20,0.12)" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#B16937", marginBottom: 32, fontFamily: "'Neue Montreal', sans-serif", fontWeight: 700 }}>
            Frequently asked
          </p>
          <dl style={{ margin: 0 }}>
            {FAQS.map((f, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={f.q} style={{ borderBottom: "1px solid rgba(59,33,20,0.1)" }}>
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", gap: 24, padding: "20px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                    >
                      <span style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(17px, 2.5vw, 22px)", lineHeight: 1.3, color: isOpen ? "#90422C" : "#3B2114", transition: "color 0.15s", fontWeight: 700 }}>
                        {f.q}
                      </span>
                      <ChevronDown
                        style={{ width: 20, height: 20, flexShrink: 0, color: "#EA9A61", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                      />
                    </button>
                  </dt>
                  <dd style={{ margin: 0, display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.3s ease-out" }}>
                    <div style={{ overflow: "hidden" }}>
                      <p style={{ paddingBottom: 20, paddingRight: 32, fontSize: 16, lineHeight: 1.75, color: "rgba(59,33,20,0.7)", fontFamily: "Inter, -apple-system, sans-serif", margin: 0 }}>
                        {f.a}
                      </p>
                    </div>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default function ArticleBody() {
  return (
    <main style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#FFF4E3", color: "#3B2114" }}>

      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(160deg, #3B2114 0%, #603E25 55%, #90422C 100%)",
        padding: "80px 24px 64px",
        color: "#FFF4E3",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          <div style={{ marginBottom: 32 }}>
            <Link href="/">
              <Image src="/brand/rov-logo.webp" alt="ROV Studios" width={48} height={48} style={{ objectFit: "contain" }} />
            </Link>
          </div>

          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,244,227,0.55)", marginBottom: 28, fontFamily: "'Neue Montreal', sans-serif" }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>ROV Studios</Link>
            {" · "}
            <Link href="/brand" style={{ color: "inherit", textDecoration: "none" }}>Brand Identity</Link>
            {" · "}Pricing Guide
          </p>

          <h1 style={{
            fontFamily: "Norwige, sans-serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: 24,
            color: "#FFFFFF",
          }}>
            How Much Does Branding Cost in Atlanta?
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(255,244,227,0.82)", marginBottom: 36, maxWidth: 600 }}>
            A logo alone runs $500 to $2,500. A full brand identity system usually costs more, and for good reason. Here is what actually moves the number, and what the cheap option costs you once customers start judging your business by it.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{
              background: "#FFF4E3",
              border: "1px solid rgba(59,33,20,0.15)",
              borderRadius: 100,
              padding: "5px 14px 5px 5px",
              fontSize: 13,
              color: "#3B2114",
              fontFamily: "'Neue Montreal', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <div style={{ position: "relative", width: 32, height: 32, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                <Image src="/teammembers/basutm2.webp" alt="Ayush Basu" fill sizes="32px" style={{ objectFit: "cover" }} />
              </div>
              Ayush Basu · Founder &amp; Creative Director, <Link href="/about" style={{ color: "#90422C", textDecoration: "underline" }}>ROV Studios</Link>
            </div>
            <div style={{ color: "rgba(255,244,227,0.45)", fontSize: 13 }}>September 2026 · 7 min read</div>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section style={{ background: "#3B2114", padding: "0 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, borderTop: "1px solid rgba(255,244,227,0.08)" }}>
          {STATS.map((s) => (
            <div key={s.number} style={{ padding: "28px 20px", textAlign: "center" }}>
              <div style={{
                fontFamily: "Norwige, sans-serif",
                fontSize: "clamp(28px, 5vw, 44px)",
                background: "linear-gradient(135deg, #EA9A61 0%, #90422C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1,
                marginBottom: 8,
              }}>{s.number}</div>
              <div style={{ color: "#FFF4E3", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
              <div style={{ color: "rgba(255,244,227,0.85)", fontSize: 12 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>

        <nav style={{
          background: "rgba(144,66,44,0.07)",
          border: "1.5px solid rgba(144,66,44,0.25)",
          borderRadius: 12,
          padding: "24px 28px",
          marginBottom: 56,
        }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#90422C", fontWeight: 700, marginBottom: 16 }}>
            In this article
          </p>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {TOC.map((item, i) => (
              <li key={item.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#EA9A61", fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, minWidth: 20 }}>{String(i + 1).padStart(2, "0")}</span>
                <a href={`#${item.id}`} style={{ color: "#3B2114", textDecoration: "none", fontSize: 15, borderBottom: "1px solid rgba(59,33,20,0.15)", lineHeight: 1.4 }}>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* SECTION 1 */}
        <section id="the-short-answer" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            The short answer
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            You searched this because you got a few quotes back and they were nowhere near each other. One designer on a freelance site quoted $150. A studio quoted $4,000 for what looks like the same thing: a logo. Both numbers are real. They are just not pricing the same product.
          </p>

          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px", margin: "8px 0 32px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              A logo alone runs $500 to $2,500 in Atlanta. A full brand identity system, the logo plus a color palette, typography, and guidelines for using them consistently, typically costs $2,000 to $6,000. Bundle that with a new website and the range moves to roughly $4,500 to $12,000, depending on how many pages and features you need.
            </p>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            The gap between $150 and $4,000 is not a scam on one end. It is two different products wearing the same name. The rest of this guide is about telling them apart before you sign anything.
          </p>
        </section>

        {/* SECTION 2 */}
        <section id="what-moves-the-price" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            What actually moves the price
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 36, fontFamily: "'Neue Montreal', sans-serif" }}>
            Four factors, in order of how much they change the number.
          </p>

          {FACTORS.map((item) => (
            <div key={item.n} style={{
              display: "grid",
              gridTemplateColumns: "48px 1fr",
              gap: 20,
              marginBottom: 36,
              paddingBottom: 36,
              borderBottom: "1px solid rgba(59,33,20,0.1)",
            }}>
              <div style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#EA9A61", paddingTop: 4, letterSpacing: "0.05em" }}>{item.n}</div>
              <div>
                <h3 style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 18, fontWeight: 700, color: "#B16937", marginBottom: 12 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "#3B2114", margin: 0 }}>{item.body}</p>
              </div>
            </div>
          ))}

          <blockquote style={{
            margin: "32px 0 0",
            padding: "24px 28px",
            borderLeft: "4px solid #EA9A61",
            background: "rgba(234,154,97,0.08)",
            borderRadius: "0 8px 8px 0",
          }}>
            <p style={{ fontFamily: "Norwige, sans-serif", fontSize: 22, lineHeight: 1.5, color: "#3B2114", margin: 0, fontStyle: "italic" }}>
              &ldquo;A brand is not a logo. It is a system. That is what you are actually paying for.&rdquo;
            </p>
          </blockquote>
        </section>

        {/* SECTION 3: comparison table */}
        <section id="the-three-tiers" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            Logo, identity, or identity plus website
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 32, fontFamily: "'Neue Montreal', sans-serif" }}>
            Three tiers, and which one actually fits where your business is right now.
          </p>

          <div style={{ overflowX: "auto", marginBottom: 32 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
              <thead>
                <tr style={{ background: "#3B2114" }}>
                  {["Tier", "Typical price", "What you get", "Best for"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#FFF4E3", fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIERS.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(59,33,20,0.04)" : "transparent" }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid rgba(59,33,20,0.08)",
                        color: j === 0 ? "#90422C" : "#3B2114",
                        fontWeight: j === 0 ? 700 : 400,
                        fontFamily: j === 0 ? "'Neue Montreal', sans-serif" : "inherit",
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            Most businesses that come to us undervalue how much the third tier saves them. Building the website after the brand identity is already locked in means the strategy work happens once, not twice, and the site launches looking like it was designed on purpose instead of retrofitted around a logo that arrived later.
          </p>
        </section>

        {/* IMAGE */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 40vw, 440px)", overflow: "hidden" }}>
          <Image src="/casestudy/bando/bando2.webp" alt="TheBando, an Atlanta brand ROV rebuilt from the identity up" fill sizes="(max-width: 768px) 100vw, 760px" style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            TheBando, Atlanta&apos;s Westside. A full identity rebuild that carried through to the website and the ordering page.
          </div>
        </div>

        {/* SECTION 4 */}
        <section id="the-real-cost-of-cheap" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What a cheap logo costs you later
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            A $150 logo is not free money saved. It is a cost deferred. Without a real color palette, typography system, and usage guidelines behind it, every new thing you make, a flyer, a social post, a sign for the front door, ends up looking like it came from a slightly different company. Customers notice inconsistency even when they cannot name what feels off.
          </p>

          <div style={{
            background: "#3B2114",
            borderRadius: 12,
            padding: "28px 32px",
            margin: "32px 0",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "24px",
            alignItems: "center",
          }}>
            <div style={{ fontFamily: "Norwige, sans-serif", fontSize: 56, background: "linear-gradient(135deg, #EA9A61, #90422C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1 }}>3 sec</div>
            <div>
              <p style={{ color: "#FFF4E3", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                is roughly how long it takes someone to form a first impression of a business from its visual identity. An inconsistent brand does not get a second chance to make a different one.
              </p>
              <p style={{ color: "rgba(255,244,227,0.8)", fontSize: 12, marginTop: 8, marginBottom: 0 }}>Source: research on first-impression formation</p>
            </div>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            Most businesses that skip a real brand identity end up paying for one anyway, just later, and usually at a worse rate, because now the rebrand has to fix years of inconsistent materials instead of starting clean.
          </p>
        </section>

        {/* SECTION 5 */}
        <section id="how-to-get-a-fair-quote" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            How to know you are getting a fair quote
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Ask exactly what is included before comparing the total number. A quote that includes strategy sessions, multiple concepts, revision rounds, and full brand guidelines is a better deal at $3,000 than a $1,200 quote that hands you a single logo file and nothing else.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            Ask to see real client work, ideally with a result attached, not just a portfolio of nice-looking logos. If you want to build brand identity and a website together, our <Link href="/brand" style={{ color: "#90422C", textDecoration: "underline" }}>brand identity process</Link> and <Link href="/web" style={{ color: "#90422C", textDecoration: "underline" }}>web design process</Link> are built to run in parallel, so you are not paying for the same strategy work twice.
          </p>
        </section>

        {/* RELATED READING */}
        <section style={{ marginBottom: 64, padding: "32px 0", borderTop: "1px solid rgba(59,33,20,0.12)", borderBottom: "1px solid rgba(59,33,20,0.12)" }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B16937", marginBottom: 20 }}>Related reading</p>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { href: "/web/how-much-does-a-website-cost-in-atlanta", label: "How much does a website cost in Atlanta?", desc: "Real 2026 prices, what moves them, and what a cheap site really costs you later." },
              { href: "/blog/creative-studio-vs-agency-vs-freelancer", label: "Studio vs. agency vs. freelancer", desc: "Cost, speed, range, and accountability compared, so you can pick the right one." },
              { href: "/blog/dkm-corp-brand-identity", label: "Building a global brand identity: DKM Corp", desc: "A full brand identity and website rebuild, case study, across a 10.5-hour time gap." },
              { href: "/brand", label: "ROV Studios brand identity services", desc: "How we build brand systems that hold up everywhere your business shows up." },
              { href: "/about", label: "About ROV Studios", desc: "The Atlanta studio behind the work." },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "start", textDecoration: "none", padding: "16px 0", borderBottom: "1px solid rgba(59,33,20,0.07)" }}>
                <span style={{ color: "#EA9A61", fontSize: 16, marginTop: 2 }}>→</span>
                <span>
                  <span style={{ display: "block", color: "#90422C", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{link.label}</span>
                  <span style={{ color: "rgba(59,33,20,0.6)", fontSize: 14, lineHeight: 1.5 }}>{link.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

      </div>

      <FaqAccordion />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 80px" }}>

        <section style={{ marginBottom: 64, padding: "28px 32px", background: "#3B2114", borderRadius: 16, color: "#FFF4E3" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ position: "relative", width: 64, height: 64, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(234,154,97,0.4)" }}>
              <Image src="/teammembers/basutm2.webp" alt="Ayush Basu, Founder and Creative Director ROV Studios" fill sizes="64px" style={{ objectFit: "cover" }} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 2, color: "#FFF4E3" }}>Ayush Basu</p>
              <p style={{ color: "#EA9A61", fontSize: 13, margin: 0, fontFamily: "'Neue Montreal', sans-serif" }}>
                Founder &amp; Creative Director, <Link href="/about" style={{ color: "#EA9A61" }}>ROV Studios</Link>
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,244,227,0.1)" }}>
            <span style={{ display: "inline-block", width: 24, height: 2, background: "#EA9A61", flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: "#FFF4E3", margin: 0, fontFamily: "'Neue Montreal', sans-serif" }}>
              Last updated &nbsp; September 21, 2026
            </p>
          </div>
        </section>

        <BlogLeadForm
          source="web:how-much-does-branding-cost-in-atlanta"
          heading="Not sure which tier fits your business?"
          subheading="Tell us where your business is right now and what you are trying to build toward. We will tell you honestly whether you need a logo, a full identity system, or identity plus a website, and what that actually costs."
          messagePlaceholder="Your business, what you have now, and what's prompting the change..."
          secondaryHref="https://cal.com/rov-studios-imhphw/15min"
          secondaryLabel="Prefer to talk? Book a free 15-min call"
        />

      </div>
      <NavigationDock />
      <Footer />
    </main>
  );
}
