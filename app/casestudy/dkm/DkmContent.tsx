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
    HandNote,
    Rise,
    useStoryTheme,
} from "@/components/casestudy/story/Story";
import { makeTheme, tint } from "@/components/casestudy/story/theme";

/** DKM Corp: growth and operations across four countries. Action gold on true black. */
const theme = makeTheme({
    accent: "#C9A96E",
    paper: "#F5F0EB",
    paperInk: "#1C1D21",
    paperAccent: "#8B6914",
});

const SECTIONS = [
    { id: "calls", label: "The calls" },
    { id: "map", label: "The map" },
    { id: "built", label: "What we built" },
    { id: "receipt", label: "The receipt" },
];

const MARKETS = [
    { city: "Mumbai", country: "India", utc: "UTC +5:30" },
    { city: "Sydney", country: "Australia", utc: "UTC +10" },
    { city: "Atlanta", country: "United States", utc: "UTC -5" },
    { city: "Dubai", country: "UAE", utc: "UTC +4" },
];

/** Four markets, four clocks. Somebody at DKM is always awake. */
function Markets() {
    const t = useStoryTheme();
    const line = tint(t.text, 0.14);
    return (
        <div className="mt-16 md:mt-24">
            <div className="grid grid-cols-2 lg:grid-cols-4" style={{ border: `1px solid ${line}` }}>
                {MARKETS.map((m, i) => (
                    <Rise key={m.city} delay={i * 0.06} className="flex flex-col gap-6 p-5 md:p-7" style={{ borderLeft: i ? `1px solid ${line}` : undefined, borderTop: i >= 2 ? `1px solid ${line}` : undefined }}>
                        <span className="text-[10px] uppercase md:text-xs" style={{ fontFamily: t.label, letterSpacing: "0.22em", color: t.accent }}>
                            {String(i + 1).padStart(2, "0")} · {m.country}
                        </span>
                        <span className="uppercase" style={{ fontFamily: t.display, color: t.text, fontSize: "clamp(1.6rem, 3.6vw, 2.8rem)", lineHeight: 0.95 }}>
                            {m.city}
                        </span>
                        <span className="text-xs" style={{ fontFamily: "ui-monospace, Menlo, Consolas, monospace", letterSpacing: "0.1em", color: t.text, opacity: 0.55 }}>
                            {m.utc}
                        </span>
                    </Rise>
                ))}
            </div>
            <div className="mt-6">
                <HandNote className="text-[1.3rem] leading-tight md:text-[1.6rem]" tilt={-1}>
                    somebody at DKM is always awake. the site had to say that in one glance.
                </HandNote>
            </div>
        </div>
    );
}

export default function DkmContent() {
    return (
        <Story theme={theme} sections={SECTIONS}>
            <StoryHero
                eyebrow={["Brand + infrastructure", "DKM Corp"]}
                lines={["Four countries.", "One firm."]}
                punch="No site that said so."
                note="execution-first on paper. online, it read like a brochure."
                intro="DKM Corp runs growth and operations for companies across India, Australia, the US, and Dubai. Boots on the ground in four time zones, and a web presence that could have belonged to anyone."
                live={{ href: "https://www.dkmcorp.in/" }}
                mark={<WordMark text="DKM Corp" color="#C9A96E" />}
            />

            <SplitReveal
                left={{
                    eyebrow: "Real life",
                    sub: "Already true before we showed up",
                    title: "Already operating in",
                    items: ["India", "Australia", "United States", "Dubai"],
                }}
                right={{
                    eyebrow: "The old site",
                    sub: "What a partner could see",
                    title: "Could've been any consultancy.",
                    note: "no scale, no proof, no 'we actually do the work'",
                }}
            />

            <Chapter id="calls">
                <SectionHead index="01" label="The calls" title="Four calls, up front" />
                <Principles
                    items={[
                        { call: "Command center, not brochure", aside: "grids, data, outcomes" },
                        { call: "Say 'execution' out loud", aside: "strategy is cheap. doing it isn't." },
                        { call: "Three doors: Design, Market, Operate", aside: "one click to the right expert" },
                        { call: "Build it to take new verticals", aside: "healthcare today, real estate tomorrow" },
                    ]}
                />
            </Chapter>

            <Chapter id="map">
                <SectionHead index="02" label="The map" title="The footprint was the story" note="most firms this size have a bigger website. DKM had a bigger map.">
                    We looked at the traditional consultancies and the venture studios DKM gets compared to. The first group felt corporate and stagnant, the second felt like an agency with no operational depth. The gap was a brand that looked like a high-performance engine.
                </SectionHead>
                <Frames
                    items={[
                        {
                            title: "The brief, in one frame",
                            src: "/casestudy/dubaiskyline.webp",
                            tag: "the mood",
                            notes: ["*scale, glass, night.* this is what four markets should feel like", "the old site had *stock handshake photos*", "so: true black, steel grey, and *one gold*"],
                        },
                    ]}
                />
                <Markets />
            </Chapter>

            <Chapter id="built">
                <SectionHead index="03" label="What we built" title="Then we built the engine" note="structured, efficient, ready to scale. the brand had to behave like the firm.">
                    A brand identity and a digital hub built at the same time, so the positioning and the plumbing agree with each other. Every page moves a partner from a high-level promise to a specific person who can deliver it.
                </SectionHead>

                <div className="flex flex-col gap-20 md:gap-28">
                    <FeatureRow index={1} kicker="The pillars" title="Design. Market. Operate." body="Three service pillars, three clear doors, and a direct-to-expert inquiry flow behind each one. It mirrors how DKM actually engages: no fluff, straight to the person doing the work.">
                        <TypeCard big="3" small="Pillars, three doors" note="no-fluff engagement, mirrored on screen" />
                    </FeatureRow>
                    <FeatureRow index={2} kicker="The engine" title="Leads land in the CRM before the page reloads" body="Custom lead capture wired into the CRM so an inquiry from Dubai gets an operational response, not an autoreply. Built on an architecture that takes a new vertical without a rebuild." flip>
                        <TypeCard big="CRM" small="Custom lead capture" note="an inquiry is an operation, not a form" />
                    </FeatureRow>
                    <FeatureRow index={3} kicker="The type" title="Gold on steel" body="True black, steel grey, off white, one action gold. Norwige for authority, Inter for clarity across markets, and JetBrains Mono as a nod to the automation and systems underneath the operation.">
                        <TypeCard big="Aa 01" small="Norwige · Inter · JetBrains Mono" note="the mono is for the systems people" />
                    </FeatureRow>
                </div>
            </Chapter>

            <Chapter id="receipt">
                <SectionHead index="04" label="The receipt" title="What shipped" />
                <Receipt
                    mark={<WordMark text="DKM Corp" color="#8B6914" size="clamp(1.3rem, 2.8vw, 1.8rem)" />}
                    meta={["Job: brand + web", "IN · AU · US · AE"]}
                    headline={["Eight things shipped.", "Four markets, one hub."]}
                    note="serious enough that partners take the call"
                    items={[
                        "Full brand identity",
                        "Palette: true black / steel / off white / action gold",
                        "Type: Norwige, Inter, JetBrains Mono",
                        "Service pillars: Design, Market, Operate",
                        "Direct-to-expert inquiry flow",
                        "Market case studies (IN, AU, US, AE)",
                        "CRM-integrated lead capture",
                        "Architecture that takes new verticals",
                    ]}
                />
                <BigNumber
                    stat="100%"
                    label="execution across four markets"
                    note="healthcare, real estate, asset management: they all took the call"
                    body="Since the rollout, DKM Corp operates at full execution across all four primary markets from a single hub. The sharper positioning has brought in high-value partners in healthcare, real estate, and asset management, and cemented DKM as a serious global growth partner."
                />
            </Chapter>

            <StoryQuote
                quote="We operate across four countries and needed a digital home as serious as the work. ROV delivered infrastructure that matches our global footprint, partners take us more seriously the moment they land on the site."
                authorName="Dheeraj"
                authorTitle="Founder, DKM Corp"
                itemName="DKM Corp Global Digital Infrastructure"
                itemUrl="/casestudy/dkm"
            />

            <StoryFAQ
                faqs={[
                    { question: "What did Range of View Studios deliver for DKM Corp?", answer: "A global digital infrastructure and brand identity rebuild for DKM Corp, a private growth partner operating across India, Australia, the US, and Dubai." },
                    { question: "Why did DKM Corp need a new digital presence?", answer: "Their previous presence didn't reflect the scale or seriousness of a multi-country growth firm. The new build matches their global footprint and earns partner trust on first impression." },
                    { question: "Where does DKM Corp operate?", answer: "Across four primary markets, India, Australia, the United States, and Dubai." },
                    { question: "What is on the DKM Corp site now?", answer: "Three service pillars (Design, Market, Operate) with direct-to-expert inquiry flows, case studies from each market, and CRM-integrated lead capture, on an architecture built to add new verticals." },
                ]}
            />

            <ClosingCTA
                title={["Bigger than your", "website lets on?"]}
                body="We build the hub that matches the footprint. Brand and infrastructure, at the same time, so they agree."
                mark={<WordMark text="DKM Corp" color="#8B6914" size="clamp(2.4rem, 7vw, 4.5rem)" />}
            />
        </Story>
    );
}
