import type { Metadata } from 'next';
import IknaContent from "./IknaContent";
import { CreativeWorkSchema } from "@/components/schema/CreativeWorkSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

export const metadata: Metadata = {
    title: 'Aysegul Ikna - Case Study',
    description: 'How Range of View Studios built a sophisticated digital home for Aysegul Ikna, a sustainable fashion brand at Ponce City Market. 30% sales growth achieved.',
    alternates: {
        canonical: 'https://www.rovstudios.com/casestudy/ikna',
    },
    openGraph: {
        title: 'Aysegul Ikna Case Study | Range of View Studios',
        description: 'The clothes cost what they are worth. The site did not say so. How we made the price make sense: 30% more monthly sales.',
        images: [{ url: '/og/og-ikna.webp', width: 1200, height: 630, alt: 'Aysegul Ikna website by ROV Studios' }],
        type: 'article',
        url: 'https://www.rovstudios.com/casestudy/ikna',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Aysegul Ikna Case Study | Range of View Studios',
        description: 'The clothes cost what they are worth. The site did not say so. How we made the price make sense: 30% more monthly sales.',
        images: ['/og/og-ikna.webp'],
    },
};

export default function IknaCaseStudyPage() {
    return (
        <>
            <CreativeWorkSchema
                name="Aysegul Ikna Website Design"
                description="Luxury digital transformation for Aysegul Ikna, a sustainable fashion brand at Ponce City Market. 30% increase in monthly sales achieved."
                dateCreated="2025-01-15"
                url="/casestudy/ikna"
                image="/og/og-ikna.webp"
                aboutName="Aysegul Ikna"
                lead={{ name: "Ayush Basu", role: "Founder & Creative Director" }}
                clientUrl="https://www.aysegulikna.com/"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "" },
                { name: "Case Studies", url: "/casestudy" },
                { name: "Aysegul Ikna", url: "/casestudy/ikna" },
            ]} />
            <IknaContent />
        </>
    );
}
