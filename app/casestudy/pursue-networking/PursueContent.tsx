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

/** Pursue Networking: signal gold on midnight. The copilot is called ANDI. */
const theme = makeTheme({
    accent: "#F5C842",
    paperAccent: "#7C5E0B",
});

const SECTIONS = [
    { id: "calls", label: "The calls" },
    { id: "screens", label: "The screens" },
    { id: "built", label: "What we built" },
    { id: "receipt", label: "The receipt" },
];

export default function PursueContent() {
    return (
        <Story theme={theme} sections={SECTIONS}>
            <StoryHero
                eyebrow={["AI product", "Pursue Networking"]}
                lines={["LinkedIn outreach", "was busywork."]}
                punch="We gave it a copilot."
                note="not automation. a very good assistant named ANDI."
                intro="Sales teams burn hours a week prospecting, following up, and managing connections by hand. The tools that promised to help got people flagged. Pursue had to feel human, stay inside LinkedIn's rules, and turn connections into pipeline. We built it from zero: product, brand, and go-to-market."
                live={{ href: "https://pursuenetworking.com/", preview: "/casestudy/Pursue/pursue3.webp", previewAspect: "2559 / 1177" }}
                mark={<WordMark text="Pursue" color="#F5C842" />}
            />

            <SplitReveal
                left={{
                    eyebrow: "Real life",
                    sub: "Already true before we showed up",
                    title: "Kolin already had",
                    items: ["Tactics that convert", "A network that answers", "500 people waiting", "A name: ANDI"],
                }}
                right={{
                    eyebrow: "The category",
                    sub: "What everyone else shipped",
                    title: "Spam bots in a trench coat.",
                    note: "volume games, flagged accounts, templates that sound like nobody",
                }}
            />

            <Chapter id="calls">
                <SectionHead index="01" label="The calls" title="Four calls, up front" />
                <Principles
                    items={[
                        { call: "Augment the human, never replace", aside: "every draft keeps your voice" },
                        { call: "LinkedIn-safe or it doesn't ship", aside: "policy-aware by design" },
                        { call: "Pipeline you can actually see", aside: "one table. no tab-hopping." },
                        { call: "No fluff, just tactics", aside: "the brand promise and the UI rule" },
                    ]}
                />
            </Chapter>

            <Chapter id="screens">
                <SectionHead index="02" label="The screens" title="Three screens, marked up" note="these are the calls, on the actual product">
                    A copilot lives or dies on the first thirty seconds. So the home screen, the pipeline, and the front door each had one job, and we wrote it on the frame.
                </SectionHead>
                <Frames
                    items={[
                        {
                            title: "Day one",
                            src: "/casestudy/Pursue/pursue1.webp",
                            tag: "home",
                            notes: ["*'Good afternoon, Ayush.'* it knows you before you type", "four things you can do, *zero menus to dig through*", "teach ANDI *how you sound.* the voice stays yours"],
                        },
                        {
                            title: "The pipeline",
                            src: "/casestudy/Pursue/pursue2.webp",
                            tag: "pipeline",
                            notes: ["every prospect, *one table*", "HubSpot syncing in the same view. *no tab-hopping*", "list, kanban, gallery. *pick how you think*"],
                        },
                        {
                            title: "The front door",
                            src: "/casestudy/Pursue/pursue3.webp",
                            tag: "landing",
                            notes: ["*'from connections to relationships.'* that's the whole pitch", "Outlook, LinkedIn, HubSpot, Calendar, *orbiting the assistant*", "gold means go. *one button.*"],
                        },
                    ]}
                />
            </Chapter>

            <Chapter id="built">
                <SectionHead index="03" label="What we built" title="Under the screens" note="the part the screenshots can't show">
                    Product, brand, and go-to-market shipped as one funnel. The copilot, the safety layer it runs behind, and the visual system that makes &ldquo;no fluff&rdquo; a rule instead of a slogan.
                </SectionHead>

                <div className="flex flex-col gap-20 md:gap-28">
                    <FeatureRow index={1} kicker="The copilot" title="Drafts that sound like you" body="Every suggestion is LinkedIn-policy aware, every outreach template preserves the sender's voice, and every tactic is pulled from patterns that actually convert. ANDI augments the human. It never replaces them.">
                        <TypeCard big="ANDI" small="Voice-trained copilot" note="augment, never replace" />
                    </FeatureRow>
                    <FeatureRow index={2} kicker="The stack" title="Next.js, Supabase, and a safety layer" body="Real-time pipeline tracking, newsletter subscription, and content delivery on infrastructure tuned for speed. In between the product and LinkedIn sits an automation layer built to keep accounts safe." flip>
                        <TypeCard big="0" small="Accounts flagged" note="the safety layer is the product" />
                    </FeatureRow>
                    <FeatureRow index={3} kicker="The brand" title="Signal gold on midnight" body="Gold signals value, blue drives action, monospace earns credibility. The voice is equal parts tactical operator and sales coach, and the visual system enforces the promise: no fluff, just tactics.">
                        <TypeCard big="Aa" small="Norwige · Inter · JetBrains Mono" note="dense, confident, data-forward" />
                    </FeatureRow>
                </div>
            </Chapter>

            <Chapter id="receipt">
                <SectionHead index="04" label="The receipt" title="What shipped" />
                <Receipt
                    mark={<WordMark text="Pursue" color="#7C5E0B" size="clamp(1.4rem, 3vw, 1.9rem)" />}
                    meta={["Job: product + brand", "pursuenetworking.com"]}
                    headline={["Nine things shipped.", "One funnel."]}
                    note="product, brand, and go-to-market in the same launch window"
                    items={[
                        "Platform on Next.js + Supabase",
                        "ANDI, the AI copilot",
                        "LinkedIn-safe automation layer",
                        "Real-time pipeline tracking",
                        "HubSpot sync",
                        "Onboarding flow",
                        "Newsletter capture + content delivery",
                        "Pricing page + founder story",
                        "Full brand system",
                    ]}
                />
                <BigNumber
                    stat="500+"
                    label="active sales professionals"
                    note="onboarding stopped being the bottleneck"
                    body="The community started growing the week the platform launched. Pursue now serves 500+ active sales professionals, with the content engine, onboarding flow, and copilot all running on what we built. It finally feels like the product it actually is."
                />
            </Chapter>

            <StoryQuote
                quote="ROV translated a complicated AI product into something people instantly get. The platform scales with us, and onboarding 500-plus sales professionals stopped being a bottleneck."
                authorName="Kolin Simon"
                authorTitle="Founder, Pursue Networking"
                itemName="Pursue Networking Platform"
                itemUrl="/casestudy/pursue-networking"
            />

            <StoryFAQ
                faqs={[
                    { question: "What is Pursue Networking?", answer: "An AI-powered LinkedIn copilot that turns B2B networking into revenue for more than 500 sales professionals." },
                    { question: "What did Range of View Studios build for Pursue Networking?", answer: "A custom platform built from the ground up, including the product experience, brand, and pipeline, that translates a complex AI tool into something intuitive and scales onboarding for 500-plus sales professionals." },
                    { question: "Who is Pursue Networking for?", answer: "B2B sales professionals and teams who want to turn LinkedIn networking into pipeline and revenue." },
                    { question: "What is Pursue Networking built on?", answer: "Next.js and Supabase, with a LinkedIn-safe automation layer, real-time pipeline tracking, HubSpot sync, and the ANDI copilot on top." },
                ]}
            />

            <ClosingCTA
                title={["Have a product that's", "smarter than it looks?"]}
                body="We build the product surface, the brand, and the pipeline that carries it. All three, in the same launch window."
                mark={<WordMark text="Pursue" color="#7C5E0B" size="clamp(2.4rem, 7vw, 4.5rem)" />}
            />
        </Story>
    );
}
