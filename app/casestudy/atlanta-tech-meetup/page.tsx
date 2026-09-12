import type { Metadata } from 'next';
import AtmContent from "./AtmContent";
import { CreativeWorkSchema } from "@/components/schema/CreativeWorkSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

export const metadata: Metadata = {
    title: 'Atlanta Tech Meetup - Case Study',
    description: "How Range of View Studios hand-built the Atlanta Tech Meetup community platform. 500+ members, 50+ events, 100% hand-coded and 0% AI-generated.",
    alternates: {
        canonical: 'https://www.rovstudios.com/casestudy/atlanta-tech-meetup',
    },
    openGraph: {
        title: 'Atlanta Tech Meetup Case Study | Range of View Studios',
        description: 'The vibe is the product. So we hand-built it. A community site for Atlanta’s monthly tech meetup: 500+ builders, 50+ events, 0% generated.',
        images: [{ url: '/casestudy/atm/atm1.webp', width: 1200, height: 630, alt: 'Atlanta Tech Meetup community platform by ROV Studios' }],
        type: 'article',
        url: 'https://www.rovstudios.com/casestudy/atlanta-tech-meetup',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Atlanta Tech Meetup Case Study | Range of View Studios',
        description: 'The vibe is the product. So we hand-built it. A community site for Atlanta’s monthly tech meetup: 500+ builders, 50+ events, 0% generated.',
        images: ['/casestudy/atm/atm1.webp'],
    },
};

export default function AtlantaTechMeetupCaseStudyPage() {
    return (
        <>
            <CreativeWorkSchema
                name="Atlanta Tech Meetup Community Platform"
                description="Hand-built community platform for Atlanta's monthly tech meetup. 500+ members and 50+ events, with a 100% hand-coded, 0% AI-generated design philosophy."
                dateCreated="2025-09-01"
                url="/casestudy/atlanta-tech-meetup"
                image="/casestudy/atm/atm1.webp"
                aboutName="Atlanta Tech Meetup"
                lead={{ name: "Ayush Basu", role: "Founder & Creative Director" }}
                clientUrl="https://www.atltechmeetup.com/"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "" },
                { name: "Case Studies", url: "/casestudy" },
                { name: "Atlanta Tech Meetup", url: "/casestudy/atlanta-tech-meetup" },
            ]} />
            <AtmContent />
        </>
    );
}
