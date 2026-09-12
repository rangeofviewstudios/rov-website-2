"use client";

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

/**
 * The Bando: a Black history museum and fried chicken spot in West Atlanta.
 * Wears its own hand-painted red and yellow, and its own display face
 * (Pearl Jean), because the walls are the brand guide.
 */
const theme = makeTheme({
    accent: "#C90000",
    ink: "#FFD600",
    paperAccent: "#C90000",
    display: "'Pearl Jean', 'NorwigeExtraBoldItalic_Hero', sans-serif",
});

const SECTIONS = [
    { id: "calls", label: "The calls" },
    { id: "room", label: "The room" },
    { id: "built", label: "What we built" },
    { id: "receipt", label: "The receipt" },
];

export default function BandoContent() {
    return (
        <Story theme={theme} sections={SECTIONS}>
            <StoryHero
                eyebrow={["Restaurant + museum", "The Bando"]}
                lines={["The Bando is loud", "in person."]}
                punch="Online, it whispered."
                note="so we turned the website up to match the walls"
                intro="A Black history museum and fried chicken spot in West Atlanta. Every wall is graffiti, sitcom stills, and Freaknik '94. The website processed orders and did nothing else."
                live={{ href: "https://www.thebandoatl.com/", preview: "/casestudy/bando/bandocrackpic.webp", previewAspect: "1800 / 820" }}
                mark={<WordMark text="The Bando" color="#C90000" />}
            />

            <SplitReveal
                left={{
                    eyebrow: "Real life",
                    sub: "Already true before we showed up",
                    title: "The room was already the brand",
                    items: ["Graffiti walls", "The sitcom shrine", "Freaknik '94", "Ever tried crack?", "Roller skates"],
                }}
                right={{
                    eyebrow: "The old site",
                    sub: "What a visitor could see",
                    title: "A menu and a checkout.",
                    note: "you could order. you couldn't feel any of it.",
                }}
            />

            <Chapter id="calls">
                <SectionHead index="01" label="The calls" title="Four calls, up front" />
                <Principles
                    items={[
                        { call: "Make it look like the walls", aside: "hand-drawn type. no clean grids." },
                        { call: "Order in three taps", aside: "phone first, always" },
                        { call: "Let the museum talk", aside: "the history is the second product" },
                        { call: "Keep them coming back", aside: "SMS that sounds like Terry, not a bot" },
                    ]}
                />
            </Chapter>

            <Chapter id="room">
                <SectionHead index="02" label="The room" title="We started with the walls" note="the brand guide was already painted. we just had to read it.">
                    Before touching a screen we walked the restaurant with a camera. Every decision on the site points back to one of these frames.
                </SectionHead>
                <Frames
                    items={[
                        {
                            title: "The logo wall",
                            src: "/casestudy/bando/bando1.webp",
                            tag: "the brand guide",
                            notes: ["the logo is *painted on 70s wallpaper*. that's the type system.", "*roller skates on the wall.* we didn't need a hero image, we needed this energy"],
                        },
                        {
                            title: "The sitcom shrine",
                            src: "/casestudy/bando/bando2.webp",
                            notes: ["*a whole wall of 90s sitcoms.* this is the museum half of the business", "the old site *never mentioned any of it*"],
                        },
                        {
                            title: "Freaknik '94",
                            src: "/casestudy/bando/bando5.webp",
                            notes: ["*'I freaked at Freaknik 94'*, framed in gold", "Atlanta history on a brick wall. this became the *story section*"],
                        },
                        {
                            title: "The headline",
                            src: "/casestudy/bando/bandocrackpic.webp",
                            tag: "the new hero",
                            notes: ["*'Ever tried crack?'* on a vintage scale. that's the homepage now", "we kept the joke *exactly as loud* as it is in the room"],
                        },
                    ]}
                />
            </Chapter>

            <Chapter id="built">
                <SectionHead index="03" label="What we built" title="Then we built the room online" note="bold type, fast orders, and a museum that finally gets a page">
                    The site had to do two jobs at once: sell chicken in three taps, and make you want to stay and read the walls. So it does both, in that order.
                </SectionHead>

                <div className="flex flex-col gap-20 md:gap-28">
                    <FeatureRow index={1} kicker="The order flow" title="Cart to confirmation, three taps" body="Mobile first, every page. No account wall, no app download, no detours. You land, you see the food, you order. The bold type does the selling on the way through.">
                        <TypeCard big="3 taps" small="Landing to confirmed" note="phone first, always" />
                    </FeatureRow>
                    <FeatureRow
                        index={2}
                        kicker="The museum"
                        title="The history has a page now"
                        body="The murals, the sitcom stills, the Freaknik wall. The Bando is a museum that happens to fry chicken, and the site finally says so. This is the part that makes people stay."
                        src="/casestudy/bando/bando4.webp"
                        flip
                    />
                    <FeatureRow index={3} kicker="Text club" title="SMS that sounds like the room" body="SMS marketing wired straight into the order system, with smart order controls so the kitchen never gets buried. Texts read like Terry wrote them, because the voice is the brand.">
                        <TypeCard big="SMS" small="Marketing + smart order controls" note="not spam. the bando, texting you." />
                    </FeatureRow>
                </div>
            </Chapter>

            <Chapter id="receipt">
                <SectionHead index="04" label="The receipt" title="What shipped" />
                <Receipt
                    mark={<WordMark text="The Bando" color="#C90000" size="clamp(1.4rem, 3vw, 1.9rem)" />}
                    meta={["Job: full redesign", "West Atlanta"]}
                    headline={["Seven things shipped.", "One volume: loud."]}
                    note="the site finally sounds like the room"
                    items={[
                        "Hand-drawn type system (Pearl Jean, Chelsea Market)",
                        "Black, red, yellow, straight off the walls",
                        "Ordering flow, cart to confirmation",
                        "Mobile first, every page",
                        "Museum and history pages",
                        "SMS marketing + smart order controls",
                        "Photography from the room, never stock",
                    ]}
                />
                <BigNumber
                    stat="60%"
                    label="less bounce, three months in"
                    note="people stopped leaving. then they ordered."
                    body="Within three months of launch, bounce rate fell by 60%. Visitors who used to hit the menu and leave started reading the walls, then ordering. Online orders went from a trickle to a flood."
                />
            </Chapter>

            <StoryQuote
                quote="ROV understood what we're about, the food and the history, and built a site that finally moves like we do. Online orders went from a trickle to a flood, and people actually stay to read our story now."
                authorName="Terry"
                authorTitle="Owner, The Bando"
                itemName="The Bando Website Redesign"
                itemUrl="/casestudy/bando"
            />

            <StoryFAQ
                faqs={[
                    { question: "What did Range of View Studios build for The Bando?", answer: "A full website redesign for The Bando, a Black history museum and fried-chicken restaurant in Atlanta, rebuilding the brand experience and the online ordering flow into one cohesive identity." },
                    { question: "What results did The Bando redesign achieve?", answer: "The redesigned site cut bounce rate by 60% within three months, turning curiosity into orders and repeat visits, and drove a dramatic increase in online ordering." },
                    { question: "What makes The Bando project unique?", answer: "It blends two identities, a museum and a restaurant, into a single, unapologetically Atlanta digital experience that reflects the brand's bold personality." },
                    { question: "What was actually wrong with the old site?", answer: "It processed orders and nothing else. None of the graffiti, the sitcom wall, the Freaknik history, or the voice of the place made it online, so visitors had no reason to stay or come back." },
                ]}
            />

            <ClosingCTA
                title={["Loud in person,", "quiet online?"]}
                body="We'll bring the room to the site. We walk it with a camera first, then build around what already works."
                mark={<WordMark text="The Bando" color="#C90000" size="clamp(2.4rem, 7vw, 4.5rem)" />}
            />
        </Story>
    );
}
