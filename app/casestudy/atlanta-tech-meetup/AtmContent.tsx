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

/** Atlanta Tech Meetup: ROV's own orange, since we are a partner on the live site. */
const theme = makeTheme({
    accent: "#EA9A61",
    paperAccent: "#90422C",
});

const SECTIONS = [
    { id: "calls", label: "The calls" },
    { id: "room", label: "The room" },
    { id: "built", label: "What we built" },
    { id: "receipt", label: "The receipt" },
];

export default function AtmContent() {
    return (
        <Story theme={theme} sections={SECTIONS}>
            <StoryHero
                eyebrow={["Community", "Atlanta Tech Meetup"]}
                lines={["The vibe is", "the product."]}
                punch="So we hand-built it."
                note="100% hand-coded. 0% generated. it says so in the footer."
                intro="A free monthly gathering for engineers, founders, and builders in Atlanta, every first Tuesday. Every event platform wanted to flatten it into a template. We built the community a home that feels like the room."
                live={{ href: "https://www.atltechmeetup.com/" }}
                mark={<WordMark text="ATL Tech Meetup" color="#EA9A61" />}
            />

            <SplitReveal
                left={{
                    eyebrow: "Real life",
                    sub: "Already true every first Tuesday",
                    title: "The community already had",
                    items: ["500+ builders", "50+ events", "Two founders with a mic", "A yellow couch"],
                }}
                right={{
                    eyebrow: "The default",
                    sub: "What an event platform shows",
                    title: "A form with a date on it.",
                    note: "Eventbrite, Meetup.com: logistics, not character",
                }}
            />

            <Chapter id="calls">
                <SectionHead index="01" label="The calls" title="Four calls, up front" />
                <Principles
                    items={[
                        { call: "Does it feel like a human made it?", aside: "the one question every screen had to pass" },
                        { call: "Founder voices first", aside: "Andrew and A.D. open the page" },
                        { call: "Real photos, never stock", aside: "the room is the brand" },
                        { call: "The next event is always the hero", aside: "first tuesday, baked into the nav" },
                    ]}
                />
            </Chapter>

            <Chapter id="room">
                <SectionHead index="02" label="The room" title="We shot the meetup first" note="you can't template this. we tried to describe it and gave up. so: photos.">
                    The site had to communicate what the meetup actually feels like. So before designing anything, we showed up on a Tuesday with a camera and let the room write the brief.
                </SectionHead>
                <Frames
                    items={[
                        {
                            title: "The bar",
                            src: "/casestudy/atm/atm1.webp",
                            tag: "6:30pm",
                            notes: ["*the marble bar and the yellow couch.* this is the homepage, basically", "nobody is looking at a screen. *that's the point*"],
                        },
                        {
                            title: "The talk",
                            src: "/casestudy/atm/atm2.webp",
                            tag: "7:15pm",
                            notes: ["*arms wide.* this is what founder voice looks like", "whiteboard, laptops, a paper cup. *zero stock photos needed*"],
                        },
                        {
                            title: "The sign-in",
                            src: "/casestudy/atm/atm3.webp",
                            tag: "the door",
                            notes: ["*a paper sheet and name tags.* the RSVP flow had to feel this simple", "the site's job: make the next sheet *longer*"],
                        },
                    ]}
                />
            </Chapter>

            <Chapter id="built">
                <SectionHead index="03" label="What we built" title="Then we built it by hand" note="no templates, no generated layouts, no stock. on purpose, and out loud.">
                    Every section was designed and coded from scratch, and the site wears that on its sleeve. Founders open the page, the community&apos;s photos carry it, and the next event is always the biggest thing on screen.
                </SectionHead>

                <div className="flex flex-col gap-20 md:gap-28">
                    <FeatureRow index={1} kicker="The stamp" title="100% hand-built. 0% generated." body="No templates, no AI-generated layouts, no stock imagery. A 'Hand-built' stamp sits in the footer because the community cares how things are made, and so do we.">
                        <TypeCard big="0%" small="Generated" note="and it says so in the footer" />
                    </FeatureRow>
                    <FeatureRow index={2} kicker="The founders" title="Andrew and A.D., front and center" body="Founder profiles for Andrew Schillinger and A.D. Slaton, a rotating gallery from past meetups, and a partner section that anchors the community's relationships. ROV is on that wall too." flip>
                        <TypeCard big="2" small="Founders, one mic" note="the voice carries the page" />
                    </FeatureRow>
                    <FeatureRow index={3} kicker="The RSVP" title="First Tuesday, every month" body="Meetup.com handles the RSVP pipeline under the hood while the brand experience stays on the custom site. The next event is always the hero, and the cadence is baked into the navigation.">
                        <TypeCard big="1st Tue" small="Meetup.com under the hood" note="rsvp goes through. the brand stays home." />
                    </FeatureRow>
                </div>
            </Chapter>

            <Chapter id="receipt">
                <SectionHead index="04" label="The receipt" title="What shipped" />
                <Receipt
                    mark={<WordMark text="ATL Tech Meetup" color="#90422C" size="clamp(1.1rem, 2.4vw, 1.5rem)" />}
                    meta={["Job: community platform", "atltechmeetup.com"]}
                    headline={["Eight things shipped.", "Zero generated."]}
                    note="we're a partner on the live site now. reciprocal."
                    items={[
                        "Hand-coded site, no template",
                        "Founder profiles, Andrew + A.D.",
                        "Rotating photo gallery from past meetups",
                        "Next-event hero, first Tuesday cadence",
                        "Meetup.com RSVP integration",
                        "Partner section (ROV included)",
                        "'Hand-built' footer stamp",
                        "Type: Norwige / Inter / mono details",
                    ]}
                />
                <BigNumber
                    stat="500+"
                    label="members across 50+ events"
                    note="every first tuesday, the hero changes"
                    body="The site now serves a 500+ member community across 50+ events and counting, with every first Tuesday anchored by the next gathering. Range of View Studios is featured as a partner on the live site, a reciprocal mark of the work we shipped together."
                />
            </Chapter>

            <StoryQuote
                quote="Off-the-shelf tools flattened our community into a template. ROV hand-built a platform with our voice baked in, and it's carried us past 500 members and 50 events without ever feeling generic."
                authorName="Andrew Schillinger & A.D. Slaton"
                authorTitle="Co-Founders, Atlanta Tech Meetup"
                itemName="Atlanta Tech Meetup Community Platform"
                itemUrl="/casestudy/atlanta-tech-meetup"
            />

            <StoryFAQ
                faqs={[
                    { question: "What did Range of View Studios build for Atlanta Tech Meetup?", answer: "A 100% hand-coded community platform with founder voices, community photography, and an integrated RSVP flow, with no off-the-shelf event template." },
                    { question: "How big is the Atlanta Tech Meetup community?", answer: "More than 500 members across 50-plus events, and growing." },
                    { question: "Why build a custom platform instead of using an existing tool?", answer: "Generic event tools flatten every community into the same template. A hand-built platform preserves the meetup's distinct voice and brand." },
                    { question: "How do RSVPs work on the custom site?", answer: "Meetup.com handles the RSVP pipeline under the hood, so the brand experience stays on atltechmeetup.com and the next event is always the hero." },
                ]}
            />

            <ClosingCTA
                title={["Got a community that", "deserves better than a template?"]}
                body="We hand-build the home. The vibe stays yours."
                mark={<WordMark text="ATL Tech Meetup" color="#90422C" size="clamp(2rem, 6vw, 4rem)" />}
            />
        </Story>
    );
}
