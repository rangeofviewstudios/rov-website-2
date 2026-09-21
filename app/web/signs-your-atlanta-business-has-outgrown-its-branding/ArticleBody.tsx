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
  { id: "the-signs", label: "Six signs you have outgrown your branding" },
  { id: "the-self-check", label: "A 60-second self-check" },
  { id: "what-happens-if-you-wait", label: "What happens if you wait" },
  { id: "what-a-rebrand-actually-fixes", label: "What a rebrand actually fixes" },
  { id: "faq", label: "Frequently asked questions" },
];

const STATS = [
  { number: "3 sec", label: "To form a first impression", sub: "of your business from its visuals" },
  { number: "6", label: "Signs covered here", sub: "the ones we see most often in Atlanta" },
  { number: "3–6 wks", label: "For a brand identity refresh", sub: "before a website even enters the picture" },
];

const SIGNS = [
  {
    n: "01",
    title: "Customers are surprised by how good you actually are",
    body: "This is the clearest sign of all. If people who hire you regularly say some version of \"wow, I wasn't expecting this level of quality\" after seeing your actual work, your branding set expectations too low. Good branding should make the quality of the work predictable, not a pleasant surprise.",
  },
  {
    n: "02",
    title: "Your visuals look different depending on where someone finds you",
    body: "Your website uses one color scheme, your Instagram uses another, and your business card looks like it belongs to a third company entirely. Each individual piece might look fine. Together, they tell a customer that nobody is steering the ship.",
  },
  {
    n: "03",
    title: "You have grown into a different business than the one you branded for",
    body: "A lot of branding gets built in year one, when the business looks nothing like it does by year three. If you started as a solo freelancer and now run a team, or started local and now serve a wider area, branding built for the smaller version of the business often quietly undersells the bigger one.",
  },
  {
    n: "04",
    title: "You dread sending people to your own website or profile",
    body: "If your instinct when someone asks for your website is a slight cringe, or you find yourself explaining that \"it's getting redone soon,\" that hesitation is information. Confidence in your own materials is not vanity, it directly affects how you show up in sales conversations.",
  },
  {
    n: "05",
    title: "Competitors who do worse work look more credible",
    body: "This is the one that actually costs money. If a business you know does lower-quality work than you but consistently wins the client because their branding looks more current and more trustworthy, the market is telling you something about first impressions that has nothing to do with your actual skill.",
  },
  {
    n: "06",
    title: "You built your own logo years ago and never touched it again",
    body: "Plenty of good businesses started with a founder-made logo in a free tool. That is a completely normal way to start. It becomes a problem only when the rest of the business has clearly leveled up and the logo has not moved an inch since day one.",
  },
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
            {" · "}Self-Diagnostic
          </p>

          <h1 style={{
            fontFamily: "Norwige, sans-serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: 24,
            color: "#FFFFFF",
          }}>
            Signs Your Atlanta Business Has Outgrown Its Branding
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(255,244,227,0.82)", marginBottom: 36, maxWidth: 600 }}>
            If customers are consistently surprised by how good you actually are once they hire you, that is not a compliment. It is a sign your branding stopped keeping up with your business a while ago.
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
                <Image src="/teammembers/suchettm.webp" alt="Suchet Konda" fill sizes="32px" style={{ objectFit: "cover" }} />
              </div>
              Suchet Konda · Co-Founder, <Link href="/about" style={{ color: "#90422C", textDecoration: "underline" }}>ROV Studios</Link>
            </div>
            <div style={{ color: "rgba(255,244,227,0.45)", fontSize: 13 }}>September 2026 · 6 min read</div>
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
            A contractor in Marietta does excellent work. Every client who hires him says so. But his estimate comes on a template from a free tool, his truck has no signage, and his website looks like it was built in 2016. New leads hesitate before calling him back. Not because of his work. Because of everything they saw before they experienced it.
          </p>

          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px", margin: "8px 0 32px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              Your branding has outgrown its usefulness when there is a visible gap between the quality of your actual work and the quality of what customers see before they hire you. The six signs below are the ones we see most often in Atlanta businesses that have quietly outgrown branding built for an earlier, smaller version of themselves.
            </p>
          </div>
        </section>

        {/* SECTION 2 */}
        <section id="the-signs" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            Six signs you have outgrown your branding
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 36, fontFamily: "'Neue Montreal', sans-serif" }}>
            In order of how often we hear each one from Atlanta business owners.
          </p>

          {SIGNS.map((item) => (
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
              &ldquo;If customers are surprised by how good you are, your branding already told them not to expect it.&rdquo;
            </p>
          </blockquote>
        </section>

        {/* IMAGE */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 40vw, 440px)", overflow: "hidden" }}>
          <Image src="/casestudy/bando/bando2.webp" alt="TheBando before and after its brand identity rebuild" fill sizes="(max-width: 768px) 100vw, 760px" style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            TheBando had real food and a real story. The branding just had not caught up yet.
          </div>
        </div>

        {/* SECTION 3: self check */}
        <section id="the-self-check" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            A 60-second self-check
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Pull up your website and your Instagram side by side right now. Ask yourself three honest questions: Do these look like they belong to the same business? Would a stranger guess your prices are what they actually are? Does anything here look noticeably older than the way you talk about your business out loud?
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            If you hesitated on any of the three, that hesitation is the answer. It does not mean you need to rebuild everything tomorrow. It means the gap is real, and it is worth a plan instead of another year of pretending not to notice it.
          </p>
        </section>

        {/* SECTION 4 */}
        <section id="what-happens-if-you-wait" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What happens if you wait
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Nothing dramatic happens right away, which is exactly why this problem is easy to ignore. What happens instead is quiet and compounding: a few leads a month who almost called but did not, a few proposals that lost to a competitor with weaker work but a more current look, a slow drift where your materials fall further behind your actual growth every quarter you do not touch them.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            None of that shows up as a single bad day. It shows up a year later as revenue that never had a clear reason to be missing.
          </p>
        </section>

        {/* SECTION 5 */}
        <section id="what-a-rebrand-actually-fixes" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What a rebrand actually fixes
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            A real rebrand is not about picking a trendier color. It closes the gap between the business you have actually become and the business your branding is still describing. That usually means a color palette and typography that hold up across your website and social media, a logo that reads as current, and guidelines so everything you put out looks like it came from the same place.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            If the signs above sound familiar, our <Link href="/web/how-much-does-branding-cost-in-atlanta" style={{ color: "#90422C", textDecoration: "underline" }}>branding pricing guide</Link> walks through what a refresh actually costs and what should be included at each tier.
          </p>
        </section>

        {/* RELATED READING */}
        <section style={{ marginBottom: 64, padding: "32px 0", borderTop: "1px solid rgba(59,33,20,0.12)", borderBottom: "1px solid rgba(59,33,20,0.12)" }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B16937", marginBottom: 20 }}>Related reading</p>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { href: "/web/how-much-does-branding-cost-in-atlanta", label: "How much does branding cost in Atlanta?", desc: "Real 2026 pricing for a logo, a full identity system, or identity plus a website." },
              { href: "/blog/thebando-brand-transformation", label: "TheBando's brand transformation", desc: "A real Atlanta business that went through exactly this. Every decision, every change." },
              { href: "/brand", label: "ROV Studios brand identity services", desc: "How we rebuild brand systems that hold up as a business grows." },
              { href: "/blog/creative-studio-vs-agency-vs-freelancer", label: "Studio vs. agency vs. freelancer", desc: "Cost, speed, range, and accountability compared, so you can pick the right one." },
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
              <Image src="/teammembers/suchettm.webp" alt="Suchet Konda, Co-Founder ROV Studios" fill sizes="64px" style={{ objectFit: "cover" }} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 2, color: "#FFF4E3" }}>Suchet Konda</p>
              <p style={{ color: "#EA9A61", fontSize: 13, margin: 0, fontFamily: "'Neue Montreal', sans-serif" }}>
                Co-Founder and Systems Architect, <Link href="/about" style={{ color: "#EA9A61" }}>ROV Studios</Link>
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
          source="web:signs-your-atlanta-business-has-outgrown-its-branding"
          heading="Not sure if it's your branding or something else?"
          subheading="We run free brand audits for Atlanta businesses. Tell us what feels off and we'll tell you honestly whether a rebrand is actually the fix."
          messagePlaceholder="What made you start questioning your branding?"
          secondaryHref="https://cal.com/rov-studios-imhphw/15min"
          secondaryLabel="Prefer to talk? Book a free audit call"
        />

      </div>
      <NavigationDock />
      <Footer />
    </main>
  );
}
