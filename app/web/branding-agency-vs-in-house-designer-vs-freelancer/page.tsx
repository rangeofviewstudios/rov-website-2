import type { Metadata } from "next";
import ArticleBody from "./ArticleBody";
import { FAQS } from "./content";

const URL = "https://www.rovstudios.com/web/branding-agency-vs-in-house-designer-vs-freelancer";

export const metadata: Metadata = {
  title: "Branding Agency vs. In-House Designer vs. Freelancer | ROV Studios",
  description:
    "Cost, speed, consistency, and accountability compared across a branding agency, an in-house designer, and a Fiverr freelancer, so you can pick the right one for where your business is right now.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Branding Agency vs. In-House Designer vs. Freelancer",
    description:
      "Which one actually fits an Atlanta startup: an agency, an in-house hire, or a freelancer? Cost, speed, and consistency compared.",
    url: URL,
    type: "article",
    images: ["/og/og-web.webp"],
  },
};

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
      headline: "Branding Agency vs. In-House Designer vs. Freelancer",
      description:
        "Cost, speed, consistency, and accountability compared, so you can pick the right one.",
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
        { "@type": "ListItem", position: 3, name: "Branding Agency vs. In-House Designer vs. Freelancer", item: URL },
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
