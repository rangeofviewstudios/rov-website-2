"use client";

import IknaInstagramFeature from "@/components/casestudy/IknaInstagramFeature";
import {
    Story,
    StoryHero,
    SplitReveal,
    Chapter,
    SectionHead,
    Principles,
    Frames,
    FeatureRow,
    TypeCard,
    Receipt,
    BigNumber,
    StoryQuote,
    StoryFAQ,
    ClosingCTA,
    WordMark,
} from "@/components/casestudy/story/Story";
import { makeTheme } from "@/components/casestudy/story/theme";

/** Aysegul Ikna: sustainable high fashion out of Ponce City Market. Her green, our canvas. */
const theme = makeTheme({
    accent: "#4CAF7D",
    paperAccent: "#1A4D2E",
});

const SECTIONS = [
    { id: "calls", label: "The calls" },
    { id: "show", label: "The show" },
    { id: "built", label: "What we built" },
    { id: "receipt", label: "The receipt" },
];

export default function IknaContent() {
    return (
        <Story theme={theme} sections={SECTIONS}>
            <StoryHero
                eyebrow={["Fashion e-commerce", "Aysegul Ikna"]}
                lines={["The clothes cost", "what they're worth."]}
                punch="The site didn't say so."
                note="luxury has to look like luxury before anyone pays for it"
                intro="Handcrafted, sustainable pieces sold from Citizen Supply in Ponce City Market, at prices that make sense the moment you touch them. Online, nobody could touch them. So we built the touch."
                live={{ href: "https://www.aysegulikna.com/" }}
                mark={<WordMark text="Aysegul Ikna" color="#4CAF7D" />}
            />

            <SplitReveal
                left={{
                    eyebrow: "Real life",
                    sub: "Already true before we showed up",
                    title: "She already had",
                    items: ["A runway show", "Ponce City Market", "Handmade, one at a time", "A room full of phones up"],
                }}
                right={{
                    eyebrow: "The old site",
                    sub: "What a visitor could see",
                    title: "A price with no argument.",
                    note: "beautiful pieces. zero reason on screen to pay for them.",
                }}
            />

            <Chapter id="calls">
                <SectionHead index="01" label="The calls" title="Four calls, up front" />
                <Principles
                    items={[
                        { call: "Photograph it like a gallery", aside: "white space is the luxury" },
                        { call: "Whisper the sustainability", aside: "a green accent, not a lecture" },
                        { call: "Hand-code the store", aside: "no template. Square underneath." },
                        { call: "One brand, every screen", aside: "instagram counts as the site" },
                    ]}
                />
            </Chapter>

            <Chapter id="show">
                <SectionHead index="02" label="The show" title="The proof was on the runway" note="we filmed the show before we designed a single page">
                    Aysegul put on a runway show at Ponce City Market and the whole room had their phones out. That energy was the brief. The site&apos;s job was to make a stranger feel it.
                </SectionHead>
                <Frames
                    items={[
                        {
                            title: "The room",
                            src: "/casestudy/ikna/fashion1ikna.webp",
                            tag: "the show",
                            notes: ["*every phone is up.* the audience was already doing the marketing", "this feeling needed to *exist on the website*"],
                        },
                        {
                            title: "The details",
                            src: "/casestudy/ikna/modelpics.webp",
                            notes: ["*the hat, the gloves, the ribbons.* the details are the price tag", "the old site cropped all of this into *thumbnails*"],
                        },
                        {
                            title: "The designer",
                            src: "/casestudy/ikna/ikna4.webp",
                            notes: ["Aysegul, walking her own room. *the founder is the brand*", "so the site got an about page that *actually says so*"],
                        },
                    ]}
                />
            </Chapter>

            <Chapter id="built">
                <SectionHead index="03" label="What we built" title="Then we made the price make sense" note="restraint, mostly. and a lot of details.">
                    Every touchpoint had to carry the same craftsmanship as the garments. Premium pricing, justified by a premium experience, from the first Instagram tap to the last Square receipt.
                </SectionHead>

                <div className="flex flex-col gap-20 md:gap-28">
                    <FeatureRow
                        index={1}
                        kicker="The look"
                        title="Gallery, not catalog"
                        body="Gallery-quality photography, generous white space, and a single dark green that shows up only where it matters. The sustainability is in the fabric; the site never has to shout about it."
                        src="/casestudy/ikna/fashion2.webp"
                    />
                    <FeatureRow
                        index={2}
                        kicker="The store"
                        title="Hand-coded, Square underneath"
                        body="A custom-built architecture instead of a themed template, with Square handling high-value transactions, Meta Pixel for retargeting, and automated email sequences on custom-designed templates."
                        flip
                    >
                        <TypeCard big="0" small="Templates used" note="every pixel on purpose" />
                    </FeatureRow>
                    <FeatureRow index={3} kicker="The feed" title="Instagram, made to match" body="Feed curation, bio, highlights, and a refined logo, so discovery and purchase finally look like they came from the same brain. Below: the overhaul, live.">
                        <TypeCard big="IG" small="Feed · bio · highlights · logo" note="discovery to checkout, one voice" />
                    </FeatureRow>
                </div>

                <div className="mt-20 md:mt-28">
                    <IknaInstagramFeature />
                </div>
            </Chapter>

            <Chapter id="receipt">
                <SectionHead index="04" label="The receipt" title="What shipped" />
                <Receipt
                    mark={<WordMark text="Aysegul Ikna" color="#1A4D2E" size="clamp(1.2rem, 2.6vw, 1.6rem)" />}
                    meta={["Job: store + brand", "Ponce City Market"]}
                    headline={["Seven things shipped.", "Zero templates."]}
                    note="luxury is mostly restraint. and the details."
                    items={[
                        "Hand-coded storefront",
                        "Square checkout for high-value pieces",
                        "Meta Pixel + retargeting",
                        "Automated email sequences, custom templates",
                        "Instagram feed, bio, and highlights",
                        "Logo refinement",
                        "Type system: Hornset / HellasFun / LostInSouth",
                    ]}
                />
                <BigNumber
                    stat="30%"
                    label="more monthly sales"
                    note="the price stopped needing an explanation"
                    body="Within months of launch, monthly sales were up 30% and the brand was recognized online the way it already was in the boutique. The site now commands the same respect, and the same price point, as the rack at Ponce City Market."
                />
            </Chapter>

            <StoryQuote
                quote="Everything finally looks like it came from one brain. It all tells the same story now."
                authorName="Aysegul Ikna"
                authorTitle="Owner, Designer & Founder, Aysegul Ikna"
                itemName="Aysegul Ikna Website Design"
                itemUrl="/casestudy/ikna"
            />

            <StoryFAQ
                faqs={[
                    { question: "What did Range of View Studios deliver for Aysegul Ikna?", answer: "A custom-coded luxury e-commerce website, full brand identity refinement, Square payment integration, Meta Pixel retargeting, automated email sequences, and a complete Instagram overhaul, end to end." },
                    { question: "What results did the new Aysegul Ikna website drive?", answer: "Within months of launch, Aysegul Ikna saw a 30% increase in monthly sales, with an online experience that finally matched the premium price point of her boutique at Ponce City Market." },
                    { question: "What was the Aysegul Ikna website built with?", answer: "A hand-coded architecture with Square integration for high-value transactions, rather than a templated store, so every detail reflects the craftsmanship of the garments." },
                    { question: "Who is Aysegul Ikna?", answer: "A sustainable, high-fashion brand based at Citizen Supply in Ponce City Market, Atlanta, known for handcrafted, premium pieces." },
                ]}
            />

            <ClosingCTA
                title={["Charging what it's worth,", "but the site won't back you up?"]}
                body="We build stores that make the price make sense. Photography, code, and the feed, from one brain."
                mark={<WordMark text="Aysegul Ikna" color="#1A4D2E" size="clamp(2.2rem, 6vw, 4rem)" />}
            />
        </Story>
    );
}
