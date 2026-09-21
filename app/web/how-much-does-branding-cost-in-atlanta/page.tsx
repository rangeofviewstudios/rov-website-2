import type { Metadata } from "next";
import ArticleBody from "./ArticleBody";
import { FAQS } from "./content";

const URL = "https://www.rovstudios.com/web/how-much-does-branding-cost-in-atlanta";

export const metadata: Metadata = {
  title: "How Much Does Branding Cost in Atlanta? (2026 Pricing Guide) | ROV Studios",
  description:
    "A logo alone runs $500 to $2,500 in Atlanta. A full brand identity system typically costs $2,000 to $6,000. Here is what actually moves the price and what a cheap logo costs you later.",
  alternates: { canonical: URL },
  openGraph: {
    title: "How Much Does Branding Cost in Atlanta? (2026 Pricing Guide)",
    description:
      "Real 2026 branding prices in Atlanta: logo only, full identity system, or identity plus website. What moves the number and how to know you are getting a fair quote.",
    url: URL,
    type: "article",
    images: ["/og/og-web.webp"],
  },
};

// Structured data for GEO/AEO: FAQPage powers featured-snippet and AI-citation
// pulls, Article carries author/date E-E-A-T, BreadcrumbList mirrors the nav.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "Article",
      headline: "How Much Does Branding Cost in Atlanta? (2026 Pricing Guide)",
      description:
        "Real 2026 branding prices in Atlanta, what moves the cost, and what a cheap logo costs you later.",
      author: {
        "@type": "Person",
        name: "Ayush Basu",
        jobTitle: "Founder and Creative Director",
        url: "https://www.rovstudios.com/about",
      },
      publisher: {
        "@type": "Organization",
        name: "ROV Studios",
        logo: {
          "@type": "ImageObject",
          url: "https://www.rovstudios.com/brand/rov-logo.webp",
        },
      },
      datePublished: "2026-09-21",
      dateModified: "2026-09-21",
      mainEntityOfPage: URL,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ROV Studios", item: "https://www.rovstudios.com" },
        { "@type": "ListItem", position: 2, name: "Web Design", item: "https://www.rovstudios.com/web" },
        { "@type": "ListItem", position: 3, name: "How Much Does Branding Cost in Atlanta?", item: URL },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleBody />
    </>
  );
}
