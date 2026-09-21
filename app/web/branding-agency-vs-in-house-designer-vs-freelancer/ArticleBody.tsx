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
  { id: "the-comparison", label: "Cost, speed, and consistency compared" },
  { id: "the-freelancer-route", label: "The freelancer route" },
  { id: "the-in-house-route", label: "The in-house route" },
  { id: "the-agency-route", label: "The agency route" },
  { id: "which-one-fits", label: "Which one fits your business right now" },
  { id: "faq", label: "Frequently asked questions" },
];

const STATS = [
  { number: "3", label: "Ways to get branding done", sub: "each with a real tradeoff" },
  { number: "$300–$6k", label: "The realistic price spread", sub: "across all three options" },
  { number: "1", label: "Right answer", sub: "and it depends on your stage, not your budget alone" },
];

const COMPARISON_ROWS = [
  ["Cost", "$300 – $1,500 per project", "$50k+ salary per year", "$2,000 – $6,000 per project"],
  ["Speed", "Fast, but variable", "Immediate once hired", "Structured timeline, 3–6 weeks"],
  ["Consistency", "Depends entirely on the person", "High, if the hire is good", "High, built as a system"],
  ["Revisions", "Often limited or extra cost", "Unlimited, on payroll", "Defined rounds included"],
  ["Best for", "A single, well-defined asset", "Ongoing, high-volume design needs", "A full identity system, done once, done right"],
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
            {" · "}Comparison Guide
          </p>

          <h1 style={{
            fontFamily: "Norwige, sans-serif",
            fontSize: "clamp(34px, 6vw, 60px)",
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: 24,
            color: "#FFFFFF",
          }}>
            Branding Agency vs. In-House Designer vs. Freelancer
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(255,244,227,0.82)", marginBottom: 36, maxWidth: 600 }}>
            Three ways to get your branding done, three very different tradeoffs. Here is how cost, speed, and consistency actually compare, and which one fits an Atlanta startup at each stage.
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
            <div style={{ color: "rgba(255,244,227,0.45)", fontSize: 13 }}>September 2026 · 8 min read</div>
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
            There is no universally right answer here, only a right answer for where your business is right now. A pre-revenue startup, a growing local business, and a company with a design team already on staff are solving three different problems, even though all three might type &ldquo;need a logo&rdquo; into Google on the same day.
          </p>

          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px", margin: "8px 0 32px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              A freelancer fits a single, well-defined deliverable when you already know your direction. An in-house designer fits ongoing, high-volume design needs that justify a full-time salary. An agency fits a full brand identity system built once, done right, with accountability if something needs to change later. Most small and early-stage businesses land on an agency or a freelancer, not an in-house hire.
            </p>
          </div>
        </section>

        {/* SECTION 2: comparison table */}
        <section id="the-comparison" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            Cost, speed, and consistency compared
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 32, fontFamily: "'Neue Montreal', sans-serif" }}>
            The same five questions, answered honestly for all three routes.
          </p>

          <div style={{ overflowX: "auto", marginBottom: 32 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#3B2114" }}>
                  {["", "Freelancer", "In-house designer", "Agency"].map((h) => (
                    <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: "#FFF4E3", fontFamily: "'Neue Montreal', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(59,33,20,0.04)" : "transparent" }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding: "12px 14px",
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
            The freelancer column looks cheapest at a glance, and for a single asset it often is. The real cost difference shows up later, in consistency and in what happens when you need a revision six months after the project ends.
          </p>
        </section>

        {/* SECTION 3 */}
        <section id="the-freelancer-route" style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 400, color: "#90422C", marginBottom: 16, lineHeight: 1.2 }}>
            The freelancer route
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 16 }}>
            A freelancer, whether from Fiverr, Upwork, or a personal referral, is usually the fastest and cheapest way to get a single design asset done. It works best when you already have a clear sense of your visual direction and just need someone to execute it.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            The risk is variance. Quality ranges enormously between freelancers, there is usually little to no strategy work involved, and if you need a matching color palette or guidelines six months later, the same freelancer may not be available, and a new one will not know the reasoning behind the original choices.
          </p>
        </section>

        {/* SECTION 4 */}
        <section id="the-in-house-route" style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 400, color: "#90422C", marginBottom: 16, lineHeight: 1.2 }}>
            The in-house route
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 16 }}>
            Hiring a full-time designer makes the most sense once your design needs are frequent and ongoing enough to justify a salary: regular campaigns, a growing product, constant new materials. When that volume is real, having someone embedded in the business who understands it deeply is genuinely valuable.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            The catch for most small and early-stage businesses is that the volume is not there yet. A full-time designer between projects is an expensive way to get occasional work done, and most businesses at this stage are better served bringing that cost in only when the workload actually justifies it.
          </p>
        </section>

        {/* SECTION 5 */}
        <section id="the-agency-route" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 400, color: "#90422C", marginBottom: 16, lineHeight: 1.2 }}>
            The agency route
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 16 }}>
            An agency sits in the middle: more expensive than a single freelancer, far less expensive than a full-time hire, and built to deliver a complete system rather than one asset. The strategy work happens up front, the deliverable is a full identity you can apply consistently, and there is a defined process if something needs to change later.
          </p>

          <div style={{
            background: "#3B2114",
            borderRadius: 12,
            padding: "28px 32px",
            margin: "24px 0",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "24px",
            alignItems: "center",
          }}>
            <div style={{ fontFamily: "Norwige, sans-serif", fontSize: 48, background: "linear-gradient(135deg, #EA9A61, #90422C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1 }}>10.5hr</div>
            <div>
              <p style={{ color: "#FFF4E3", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                time-zone gap did not stop us from delivering a full brand identity and website for DKM Corp, a services company operating across four countries. Structured process, not proximity, is what makes an agency engagement reliable.
              </p>
              <p style={{ color: "rgba(255,244,227,0.8)", fontSize: 12, marginTop: 8, marginBottom: 0 }}>See the <Link href="/blog/dkm-corp-brand-identity" style={{ color: "rgba(255,244,227,0.8)" }}>DKM Corp case study</Link></p>
            </div>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            The tradeoff is cost and timeline. An agency engagement typically runs $2,000 to $6,000 and takes three to six weeks, longer than a freelancer delivering a single asset, but with a system behind it that a one-off freelance job usually does not include.
          </p>
        </section>

        {/* IMAGE */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 40vw, 440px)", overflow: "hidden" }}>
          <Image src="/casestudy/dubaiskyline.webp" alt="A brand identity system built to hold up across markets and platforms" fill sizes="(max-width: 768px) 100vw, 760px" style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            A brand identity system, built once, applied consistently across every market and platform.
          </div>
        </div>

        {/* SECTION 6: decision framework */}
        <section id="which-one-fits" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            Which one fits your business right now
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            If you need one specific, well-defined asset and you already know your direction, a freelancer is a reasonable choice. If your design needs are frequent enough to fill a full work week, every week, an in-house hire starts to pencil out. For everyone in between, which is most small and growing businesses, an agency gives you a real system without the overhead of a salary.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            If you are trying to figure out which tier of agency work actually fits your budget, our <Link href="/web/how-much-does-branding-cost-in-atlanta" style={{ color: "#90422C", textDecoration: "underline" }}>branding pricing guide</Link> breaks down exactly what each price range includes.
          </p>
        </section>

        {/* RELATED READING */}
        <section style={{ marginBottom: 64, padding: "32px 0", borderTop: "1px solid rgba(59,33,20,0.12)", borderBottom: "1px solid rgba(59,33,20,0.12)" }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B16937", marginBottom: 20 }}>Related reading</p>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { href: "/blog/creative-studio-vs-agency-vs-freelancer", label: "Creative studio vs. agency vs. freelancer", desc: "The broader version of this comparison, covering web and creative work beyond branding." },
              { href: "/web/how-much-does-branding-cost-in-atlanta", label: "How much does branding cost in Atlanta?", desc: "Real 2026 pricing for a logo, a full identity system, or identity plus a website." },
              { href: "/blog/dkm-corp-brand-identity", label: "Building a global brand identity: DKM Corp", desc: "A full agency-led brand identity and website rebuild, case study." },
              { href: "/brand", label: "ROV Studios brand identity services", desc: "How we build brand systems, our process, and what it costs." },
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
          source="web:branding-agency-vs-in-house-designer-vs-freelancer"
          heading="Not sure which route fits your stage?"
          subheading="Tell us where your business is right now and what you need done. We will tell you honestly whether a freelancer, an in-house hire, or an agency actually fits, even if the answer is not us."
          messagePlaceholder="Your business, your budget range, and what you need designed..."
          secondaryHref="https://cal.com/rov-studios-imhphw/15min"
          secondaryLabel="Prefer to talk? Book a free 15-min call"
        />

      </div>
      <NavigationDock />
      <Footer />
    </main>
  );
}
