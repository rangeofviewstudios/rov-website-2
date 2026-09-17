"use client";

import { Caveat } from "next/font/google";
import { NavigationDock } from "@/components/sections/NavDoc";
import Footer from "@/components/sections/Footer";
import { CaseStudyFAQ } from "@/components/casestudy/CaseStudyFAQ";
import { FrameCompare } from "@/components/casestudy/FrameCompare";
import { Highlights } from "@/components/casestudy/Highlights";
import {
    W,
    WisdomHero,
    CollabSplit,
    SectionHead,
    SectionIndex,
    Principles,
    FeatureRow,
    SiteArchitecture,
    Receipt,
    ClosingCTA,
    ScrollRail,
} from "./WisdomSections";

const caveat = Caveat({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-caveat" });

const dim = "rgba(255,244,227,0.55)";

const SECTIONS = [
    { id: "thinking", label: "The calls" },
    { id: "frames", label: "Frame by frame" },
    { id: "world", label: "The new world" },
    { id: "map", label: "The site map" },
    { id: "shipped", label: "What shipped" },
];

/**
 * Bespoke format, not the shared case study template. Still missing: real
 * post launch numbers (a Result section goes between shipped and the CTA
 * once they exist) and a client quote.
 */
export default function WisdomAtlContent() {
    return (
        <main className={`relative min-h-screen ${caveat.variable}`} style={{ backgroundColor: W.black }}>
            <ScrollRail />
            <SectionIndex items={SECTIONS} />
            <NavigationDock />

            <WisdomHero />

            <CollabSplit items={["Nike", "SCAD", "Drake", "KingBach", "Nordstrom"]} oldFrame="/casestudy/wisdom-atl/audit/wisdmoldlookbook.png" />

            {/* 01, the lens before the evidence */}
            <section id="thinking" className="mx-auto w-full max-w-6xl scroll-mt-16 px-5 py-16 md:px-10 md:py-24">
                <SectionHead index="01" label="The calls" title="Four calls, up front" />
                <Principles
                    items={[
                        "Keep the rotating glasses",
                        "Merge landing and shop",
                        "Let the grid breathe",
                        "Give the brand world a home",
                    ]}
                />
            </section>

            {/* 02, the evidence */}
            <section id="frames" className="mx-auto w-full max-w-6xl scroll-mt-16 px-5 py-16 md:px-10 md:py-24">
                <SectionHead
                    index="02"
                    label="The audit"
                    title="Frame by frame"
                    note="every note here is one we actually wrote on the recording"
                >
                    We recorded the old site and walked it end to end before touching a pixel. These are the four
                    moments where the most money was leaking, each paired with the same moment on the rebuild.
                </SectionHead>

                <FrameCompare
                    titleFont={W.heading}
                    bodyFont={W.body}
                    textColor={W.cream}
                    labelColor={W.cream}
                    secondaryColor={dim}
                    borderColor="rgba(255,244,227,0.14)"
                    cardBgColor="rgba(255,244,227,0.03)"
                    accentColor={W.ink}
                    handColor={W.ink}
                    items={[
                        {
                            title: "Landing into Shop",
                            before: {
                                src: "/casestudy/wisdom-atl/audit/wisdmoldshophero.png",
                                notes: ["the shop is a *whole separate page* from here", "you get hyped, then have to *go find the store yourself*"],
                            },
                            after: {
                                src: "/casestudy/wisdom-atl/build/wisdmnewhero.png",
                                caption: "New custom illustrated shop button and rotating glasses, one unified shop with home to lessen touchpoints.",
                            },
                        },
                        {
                            title: "Product Grid",
                            before: {
                                src: "/casestudy/wisdom-atl/audit/wisdmoldshoplayout.png",
                                notes: ["*only 2 across.* the lineup takes forever to get through", "sorting is the *only way* to explore", "and *no footer at all.* the page just stops."],
                            },
                            after: {
                                src: "/casestudy/wisdom-atl/build/wisdmnewshop2.png",
                                caption: "4x1, broken up, linked out below. Scrolling keeps discovering instead of just listing product.",
                            },
                        },
                        {
                            title: "Lookbook into Story",
                            before: {
                                src: "/casestudy/wisdom-atl/audit/wisdmoldlookbook.png",
                                notes: ["*Nike, SCAD, Drake, Nordstrom,* all flattened into one gallery", "no story, no context, *no reason to care*"],
                            },
                            after: {
                                src: "/casestudy/wisdom-atl/build/newcollectionshowcase.png",
                                caption: "A real Story page, with scroll triggered collections and a proper collab timeline.",
                            },
                        },
                        {
                            title: "Brand Films",
                            before: {
                                src: "/casestudy/wisdom-atl/audit/wisdmoldvideos.png",
                                notes: ["*real commercials,* filed away behind a tab", "this should be *leading the page*"],
                            },
                            after: {
                                videoSrc: "/casestudy/wisdom-atl/build/newinfopagehero-web.mp4",
                                caption: "The films now lead the new Info page hero directly.",
                            },
                        },
                    ]}
                />
            </section>

            {/* 03, the fun part, tiered */}
            <section id="world" className="mx-auto w-full max-w-6xl scroll-mt-16 px-5 py-16 md:px-10 md:py-24">
                <SectionHead
                    index="03"
                    label="The new world"
                    title="Where the fun went"
                    note="this is the part most e-commerce sites never get"
                >
                    The site did not just get faster to shop. It got four new destinations that let the real world
                    creativity actually show up online. Three of them deserve the full frame.
                </SectionHead>

                <div className="flex flex-col gap-20 md:gap-28">
                    <FeatureRow
                        index={1}
                        kicker="The Arcade"
                        title="Pop a balloon, get 15% off"
                        body="A custom Wisdm minigame instead of a coupon field. Discounts became something you win, which is the first time a promo has ever felt on brand for them."
                        src="/casestudy/wisdom-atl/build/newarcadepage.png"
                    />
                    <FeatureRow
                        index={2}
                        kicker="I Wish Everybody Could See"
                        title="Fans submit. Fans get featured."
                        body="A social media style feed where customers post themselves in the frames. The community does the lookbook now, and it never goes stale."
                        src="/casestudy/wisdom-atl/build/newiwecspage.png"
                        flip
                    />
                    <FeatureRow
                        index={3}
                        kicker="The Story page"
                        title="Nike through Nordstrom, in order"
                        body="We told the story of all his collections from the top. A detailed timeline of how each collaboration actually happened, the proof most eyewear brands do not have, finally on display."
                        src="/casestudy/wisdom-atl/build/storypage2.png"
                    />
                </div>

                <div className="mt-20 md:mt-28">
                    <div className="mb-8">
                        <span
                            className="text-[10px] uppercase md:text-xs"
                            style={{ fontFamily: W.label, letterSpacing: "0.22em", color: W.cream, opacity: 0.55 }}
                        >
                            Also new
                        </span>
                    </div>
                    <Highlights
                        bodyFont={W.body}
                        textColor={W.cream}
                        labelColor={W.cream}
                        secondaryColor={dim}
                        borderColor="rgba(255,244,227,0.14)"
                        cardBgColor="rgba(255,244,227,0.03)"
                        items={[
                            {
                                title: "Story hero + custom loader",
                                src: "/casestudy/wisdom-atl/build/newstoryheropage.png",
                                caption: "Wisdm's commercials as the hero, behind a loader built for the page.",
                            },
                            {
                                title: "Scroll triggered collections",
                                src: "/casestudy/wisdom-atl/build/newcollectionshowcase.png",
                                caption: "Collections reveal on scroll instead of sitting in a static gallery.",
                            },
                            {
                                title: "The collab lineup",
                                src: "/casestudy/wisdom-atl/build/newlineupcomponent.png",
                                caption: "Every partner on one wall, above the fold of the Story page.",
                            },
                            {
                                title: "IWECS hero",
                                src: "/casestudy/wisdom-atl/build/newiwecspage.png",
                                caption: "Built around a graphic Wisdm already had. The world building, distilled.",
                            },
                            {
                                title: "Press page",
                                src: "/casestudy/wisdom-atl/build/newpresspage.png",
                                caption: "Every article and mention in one place, for SEO, backlinks, and proof of reach.",
                            },
                            {
                                title: "A footer, at last",
                                src: "/casestudy/wisdom-atl/build/newfooterwisdm.png",
                                caption: "The old site had none. This one is clean, branded, and does real navigational work.",
                            },
                        ]}
                    />
                </div>
            </section>

            {/* 04, how it all connects now */}
            <section id="map" className="mx-auto w-full max-w-6xl scroll-mt-16 px-5 py-16 md:px-10 md:py-24">
                <SectionHead
                    index="04"
                    label="The architecture"
                    title="How it all connects"
                    note="one hub, everything funnels back to it"
                >
                    Home and Shop merged into a single hub. Every new destination, the Story page, the fan feed, the
                    Arcade, Info, Press, branches off it, and every branch still funnels back to checkout.
                </SectionHead>
                <SiteArchitecture />
            </section>

            {/* 05, the receipt. A Result section with real numbers slots in after this. */}
            <section id="shipped" className="mx-auto w-full max-w-6xl scroll-mt-16 px-5 py-16 md:px-10 md:py-24">
                <SectionHead index="05" label="The receipt" title="What shipped" />
                <Receipt
                    note="no numbers on this page yet. we only put up the real ones."
                    items={[
                        "Landing and shop merged into one flow",
                        "Product grid, 2x1 to 4x1",
                        "A real footer",
                        "Story page + collab timeline + loader",
                        "I Wish Everybody Could See + fan feed",
                        "The Arcade, balloon pop for 15% off",
                        "Press page for SEO and backlinks",
                        "Info, FAQs, and contact rebuilt in brand",
                    ]}
                />
            </section>

            <CaseStudyFAQ
                accentColor={W.ink}
                leadName="Ayush Basu"
                leadRole="Founder & Creative Director"
                faqs={[
                    { question: "Is wisdomatl.com built on Shopify?", answer: "Yes. The rebuild runs on Shopify, so Wisdom keeps its checkout, inventory, and apps, while the storefront, the Story page, the fan feed, the Arcade, and the Press page are all custom on top of it." },
                    { question: "Can you do this for my store?", answer: "If you sell something people care about and your site does not show it, yes. We start with a recorded frame by frame audit of what you have now, then rebuild around what is already working instead of starting from a template." },
                    { question: "What was actually wrong with the old site?", answer: "The landing page and shop were disconnected, the product grid was a cramped 2x1 with nowhere else to go, there was no footer, and the brand's biggest asset, collabs with Nike, SCAD, Drake, KingBach, and Nordstrom, had nowhere to live." },
                    { question: "What did the rebuild include?", answer: "A merged landing to shop flow, a 4x1 product grid that links out to the rest of the site, a real footer, a Story page with scroll triggered collections and a collab timeline, an 'I Wish Everybody Could See' community page with a fan submission feed, a custom balloon pop arcade game worth 15% off, and a Press page for SEO and backlinks." },
                ]}
            />

            <ClosingCTA />

            <Footer />
        </main>
    );
}
