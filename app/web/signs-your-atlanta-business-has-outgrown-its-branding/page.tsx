import type { Metadata } from "next";
import ArticleBody from "./ArticleBody";
import { FAQS } from "./content";

const URL = "https://www.rovstudios.com/web/signs-your-atlanta-business-has-outgrown-its-branding";

export const metadata: Metadata = {
  title: "Signs Your Atlanta Business Has Outgrown Its Branding | ROV Studios",
  description:
    "Six signs your branding no longer matches the business you have actually built, and what to do about each one before it starts costing you customers.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Signs Your Atlanta Business Has Outgrown Its Branding",
    description:
      "If customers are surprised by how good you actually are after they hire you, your branding is the problem. Six signs it is time for a rebrand.",
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
      headline: "Signs Your Atlanta Business Has Outgrown Its Branding",
      description:
        "Six signs your branding no longer matches the business you have actually built.",
      author: {
        "@type": "Person",
        name: "Suchet Konda",
        jobTitle: "Co-Founder and Systems Architect",
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
        { "@type": "ListItem", position: 3, name: "Signs Your Atlanta Business Has Outgrown Its Branding", item: URL },
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
