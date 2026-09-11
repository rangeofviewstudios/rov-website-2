import type { Metadata } from "next";
import WisdomAtlContent from "./WisdomAtlContent";
import { CreativeWorkSchema } from "@/components/schema/CreativeWorkSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

export const metadata: Metadata = {
    title: "Wisdom ATL - Case Study",
    description:
        "How Range of View Studios audited and rebuilt wisdomatl.com, a fun eyewear lifestyle brand in Atlanta, into a stronger sales engine without losing its creative edge.",
    alternates: { canonical: "https://www.rovstudios.com/casestudy/wisdom-atl" },
    openGraph: {
        title: "Wisdom ATL Case Study | Range of View Studios",
        description: "A frame-by-frame e-commerce masterclass: turning Wisdom ATL into a money-making machine without losing the creativity that makes it Wisdom.",
        url: "https://www.rovstudios.com/casestudy/wisdom-atl",
        images: [{ url: "/og/og-wisdom-atl.webp", width: 1200, height: 630, alt: "Wisdom ATL case study by ROV Studios" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Wisdom ATL Case Study | Range of View Studios",
        description: "A frame-by-frame e-commerce masterclass: turning Wisdom ATL into a money-making machine without losing the creativity that makes it Wisdom.",
        images: ["/og/og-wisdom-atl.webp"],
    },
};

export default function WisdomAtlCaseStudyPage() {
    return (
        <>
            <CreativeWorkSchema
                name="Wisdom ATL Website Relaunch"
                description="Audit and rebuild of wisdomatl.com, a fun eyewear lifestyle brand based in Atlanta. A frame-by-frame e-commerce masterclass in turning the site into a money-making machine without losing its creative edge."
                dateCreated="2026-09-01"
                url="/casestudy/wisdom-atl"
                image="/og/og-wisdom-atl.webp"
                aboutName="Wisdom ATL"
                lead={{ name: "Ayush Basu", role: "Founder & Creative Director" }}
                clientUrl="https://wisdomatl.com/"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "" },
                { name: "Case Studies", url: "/casestudy" },
                { name: "Wisdom ATL", url: "/casestudy/wisdom-atl" },
            ]} />
            <WisdomAtlContent />
        </>
    );
}
