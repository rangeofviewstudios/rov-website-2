import type { Metadata } from 'next';
import PursueContent from "./PursueContent";
import { CreativeWorkSchema } from "@/components/schema/CreativeWorkSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

export const metadata: Metadata = {
    title: 'Pursue Networking - Case Study',
    description: 'How Range of View Studios built Pursue Networking, an AI-powered LinkedIn copilot turning B2B networking into revenue for 500+ sales professionals.',
    alternates: {
        canonical: 'https://www.rovstudios.com/casestudy/pursue-networking',
    },
    openGraph: {
        title: 'Pursue Networking Case Study | Range of View Studios',
        description: 'LinkedIn outreach was busywork. We gave it a copilot. Product, brand, and pipeline built from zero, now serving 500+ sales professionals.',
        images: [{ url: '/casestudy/Pursue/pursue1.webp', width: 1200, height: 630, alt: 'Pursue Networking platform by ROV Studios' }],
        type: 'article',
        url: 'https://www.rovstudios.com/casestudy/pursue-networking',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pursue Networking Case Study | Range of View Studios',
        description: 'LinkedIn outreach was busywork. We gave it a copilot. Product, brand, and pipeline built from zero, now serving 500+ sales professionals.',
        images: ['/casestudy/Pursue/pursue1.webp'],
    },
};

export default function PursueNetworkingCaseStudyPage() {
    return (
        <>
            <CreativeWorkSchema
                name="Pursue Networking Platform"
                description="AI-powered LinkedIn copilot built from the ground up. Platform, brand, and pipeline serving 500+ B2B sales professionals."
                dateCreated="2025-06-01"
                url="/casestudy/pursue-networking"
                image="/casestudy/Pursue/pursue1.webp"
                aboutName="Pursue Networking"
                lead={{ name: "Ayush Basu", role: "Founder & Creative Director" }}
                clientUrl="https://pursuenetworking.com/"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "" },
                { name: "Case Studies", url: "/casestudy" },
                { name: "Pursue Networking", url: "/casestudy/pursue-networking" },
            ]} />
            <PursueContent />
        </>
    );
}
