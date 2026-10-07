import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MusicMenu } from "@/components/music/MusicMenu";
import MusicFooter from "@/components/music/MusicFooter";
import { IntakeProvider } from "@/components/music/IntakeContext";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { FAQPageSchema } from "@/components/schema/FAQPageSchema";
import { HowToSchema } from "@/components/schema/HowToSchema";
import SessionPhoto, { SESSION } from "@/components/sound/SessionPhoto";
import { HandLink, LightSplash, M, Squiggle } from "@/components/sound/musicStory";
import { processStages, kitCovers, toolkitFaqs, type ProcessStage } from "./rig";
import StageNav from "./StageNav";
import CalBookButton from "@/components/sound/CalBookButton";
import { CONSULT_BOOKING_URL, checkoutHref } from "@/data/soundPricing";

// rovmusic.com/toolkit, served here via the host rewrite in middleware.ts.
//
// "How we make records": the actual path a song takes with us, mix to release
// and every round after. NOT a mirror of the CTRL A music toolkit, which stays
// self-canonical on rovstudios. Type comes from the type-* roles in globals.css.
const MUSIC_URL = "https://www.rovmusic.com";

export const metadata: Metadata = {
    title: { absolute: "How We Make and Release Records | ROV Music Atlanta" },
    description:
        "Mix, master, shoot, test, release, pitch, repeat. The process an Atlanta studio runs on every record, from the first mix to the round after release day.",
    alternates: { canonical: `${MUSIC_URL}/toolkit` },
    openGraph: {
        title: "How We Make and Release Records | ROV Music Atlanta",
        description: "Mix, master, shoot, test, release, pitch, repeat. The whole path, start to streams.",
        url: `${MUSIC_URL}/toolkit`,
        images: [{ url: `${MUSIC_URL}/og/og-sound.webp`, width: 1200, height: 630, alt: "ROV Music, how we make records" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "How We Make and Release Records | ROV Music Atlanta",
        description: "Mix, master, shoot, test, release, pitch, repeat.",
        images: [`${MUSIC_URL}/og/og-sound.webp`],
    },
};

/* ── Stage visuals ─────────────────────────────────────────────── */

function StageVisual({ stage }: { stage: ProcessStage }) {
    const v = stage.visual;

    if (v.kind === "photo") {
        return (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10">
                {v.session ? (
                    <SessionPhoto frame={SESSION[v.session]} sizes="(min-width: 1024px) 50vw, 100vw" />
                ) : (
                    <Image src={v.src} alt={v.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                )}
            </div>
        );
    }

    if (v.kind === "grid") {
        // Three phone-shaped frames: what testing looks like before release.
        return (
            <div className="grid grid-cols-3 gap-3 md:gap-4">
                {v.items.map((item, i) => {
                    const kept = item.tag === "Main grid";
                    return (
                        <div
                            key={item.alt}
                            className={`relative aspect-[9/16] overflow-hidden rounded-2xl border ${kept ? "border-[#EA9A61]/70" : "border-white/10"} ${i === 1 ? "md:-translate-y-6" : ""}`}
                        >
                            <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 16vw, 33vw" className={`object-cover ${kept ? "" : "opacity-60"}`} />
                            <span
                                className="type-tag absolute left-2 top-2 rounded-full px-2.5 py-1.5"
                                style={{
                                    color: kept ? "#0B0603" : M.cream,
                                    background: kept ? M.ink : "rgba(8,5,3,0.78)",
                                    border: kept ? "none" : "1px solid rgba(255,244,227,0.2)",
                                }}
                            >
                                {item.tag}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    }

    if (v.kind === "kit") {
        // Covers plus the site, everything that exists before release day.
        return (
            <div className="grid grid-cols-3 gap-3">
                {kitCovers.map((c) => (
                    <div key={c.src} className="relative aspect-square overflow-hidden rounded-xl border border-white/10">
                        <Image src={c.src} alt={c.alt} fill sizes="(min-width: 1024px) 16vw, 33vw" className="object-cover" />
                    </div>
                ))}
                <div className="relative col-span-3 aspect-[16/8] overflow-hidden rounded-xl border border-white/10">
                    <Image src="/heroassets/samwebfolder2.webp" alt="Sam Suen's artist website, built and updated before release" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-left" />
                    <span className="type-tag absolute left-3 top-3 rounded-full px-2.5 py-1.5" style={{ color: M.cream, background: "rgba(8,5,3,0.78)", border: "1px solid rgba(234,154,97,0.45)" }}>
                        Site updated
                    </span>
                </div>
            </div>
        );
    }

    // kind === "email": a drafted pitch, ready to send on release day.
    return (
        <div className="relative">
            <div className="absolute -right-2 -top-3 h-full w-full rotate-[2.5deg] rounded-3xl border border-white/10 bg-[#120c08]" aria-hidden />
            <div className="relative rounded-3xl border border-white/10 bg-[#0d0a08] p-6 md:p-8">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <span className="type-meta text-[#FFF4E3]/75">Draft · ready to send</span>
                    <span className="type-tag rounded-full px-2.5 py-1.5" style={{ color: "#0B0603", background: M.ink }}>
                        Release day
                    </span>
                </div>
                <dl className="type-small mt-5 space-y-2 text-[#FFF4E3]/70">
                    <div className="flex gap-3"><dt className="w-16 shrink-0">To</dt><dd className="text-white/80">Playlist curator</dd></div>
                    <div className="flex gap-3"><dt className="w-16 shrink-0">Subject</dt><dd className="text-white/90">New single from [artist], out Friday</dd></div>
                </dl>
                <div className="type-body mt-6 space-y-3 text-[#FFF4E3]/90">
                    <p>Hey [name],</p>
                    <p>
                        You added [last single] last spring, so you&apos;re the first person we wanted to send this to.
                        [Song] is out Friday. Private link below, plus the lyric video if it helps.
                    </p>
                    <p className="text-[#EA9A61]">[link] · [lyric video] · [press photo]</p>
                </div>
            </div>
        </div>
    );
}

/* ── One stage ─────────────────────────────────────────────────── */

function StageRow({ stage, flip }: { stage: ProcessStage; flip: boolean }) {
    return (
        <article
            id={`stage-${stage.step}`}
            className="grid scroll-mt-28 items-start gap-8 border-t border-white/10 py-14 md:py-20 lg:grid-cols-2 lg:gap-16"
        >
            <div className={flip ? "lg:order-2" : ""}>
                <div className="flex items-baseline gap-4">
                    <span className="type-stat text-[#EA9A61]">{stage.step}</span>
                    <span className="type-eyebrow" style={{ color: M.cream }}>{stage.name}</span>
                </div>
                <h2 className="type-h3 mt-4 max-w-md text-white">{stage.title}</h2>
                <ul className="mt-5 max-w-md space-y-3">
                    {stage.points.map((p) => (
                        <li key={p} className="type-lead flex gap-3 text-[#FFF4E3]/90">
                            <span aria-hidden className="mt-[0.8em] h-px w-4 shrink-0 bg-[#EA9A61]" />
                            {p}
                        </li>
                    ))}
                </ul>
                <p className="type-h4 mt-6 max-w-md border-l-2 border-[#EA9A61] pl-4 text-[#EA9A61]">{stage.outcome}</p>
                {stage.tags && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {stage.tags.map((t) => (
                            <span
                                key={t}
                                className="type-tag rounded-full px-3 py-1.5"
                                style={{ color: M.cream, background: "rgba(8,5,3,0.78)", border: "1px solid rgba(234,154,97,0.45)" }}
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                )}
                {stage.proof && (
                    <Link
                        href={stage.proof.href}
                        className="type-link group mt-7 inline-flex items-center gap-2 text-[#EA9A61] transition-colors hover:text-[#FFF4E3]"
                    >
                        {stage.proof.label}
                        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                    </Link>
                )}
            </div>
            <div className={flip ? "lg:order-1" : ""}>
                <StageVisual stage={stage} />
            </div>
        </article>
    );
}

/** Part header. The page is two acts: the record, then the rollout. */
function PartHeader({ part, title, note }: { part: string; title: string; note: string }) {
    return (
        <header className="pt-16 pb-6 md:pt-24">
            <span className="type-eyebrow text-[#EA9A61]">{part}</span>
            <h2 className="type-h2 mt-3 text-white">{title}</h2>
            <p className="type-lead mt-3 max-w-xl text-[#FFF4E3]/85">{note}</p>
        </header>
    );
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function MusicToolkitPage() {
    return (
        <IntakeProvider>
            <BreadcrumbSchema
                baseUrl={MUSIC_URL}
                items={[
                    { name: "Home", url: "" },
                    { name: "How we make records", url: "/toolkit" },
                ]}
            />
            <FAQPageSchema faqs={toolkitFaqs} />
            <HowToSchema
                baseUrl={MUSIC_URL}
                url="/toolkit"
                name="How we make and release a record"
                description="The process ROV Music runs on a record, from the first mix to the rounds after release day."
                steps={processStages.map((s) => ({ name: `${s.name}: ${s.title}`, text: [...s.points, s.outcome].join(" ") }))}
            />

            <main className="relative overflow-clip bg-black" style={{ minHeight: "100vh" }}>
                {/* Hero */}
                <section className="relative px-6 pt-28 pb-12 sm:pt-36">
                    <LightSplash
                        splashes={[
                            { right: "-10%", top: "-10%", size: "min(60vw, 820px)", tone: "ember", strength: 0.26 },
                            { left: "-15%", bottom: "-30%", size: "min(50vw, 640px)", tone: "rust", strength: 0.3 },
                        ]}
                    />
                    <div className="relative mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[1.15fr_1fr]">
                        <div>
                            <span className="type-eyebrow text-[#EA9A61]">How we make records</span>
                            <h1 className="type-h2 mt-5 text-white">Finishing the song is half the job.</h1>
                            <div className="mt-4 max-w-[220px]">
                                <Squiggle />
                            </div>
                            <p className="type-lead mt-6 max-w-xl text-[#FFF4E3]/90">
                                Most studios hand you a WAV and wish you luck. We stay on it: the mix, the content,
                                the rollout, and every round after, until the numbers move.
                            </p>
                            <p className="type-caption mt-6 text-[#FFF4E3]/75">
                                Ayush Basu, founder and engineer · with Sam Suen, artist and engineer
                            </p>
                        </div>
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 lg:aspect-[4/4.4]">
                            <SessionPhoto frame={SESSION.street} sizes="(min-width: 1024px) 45vw, 100vw" priority />
                        </div>
                    </div>

                </section>

                {/* The process, in two parts, under a sticky step bar. */}
                <section className="relative px-6 pb-8">
                    <LightSplash
                        splashes={[
                            { left: "-12%", top: "14%", size: "min(55vw, 760px)", tone: "rust", strength: 0.24 },
                            { right: "-14%", top: "46%", size: "min(55vw, 760px)", tone: "ember", strength: 0.22 },
                            { left: "-10%", bottom: "2%", size: "min(50vw, 680px)", tone: "rust", strength: 0.22 },
                        ]}
                    />
                    <StageNav stages={processStages.map(({ step, name }) => ({ step, name }))} />
                    <div className="relative mx-auto max-w-6xl">
                        <PartHeader
                            part="Part one"
                            title="The record."
                            note="Where every studio starts. Get this wrong and nothing after it matters."
                        />
                        {processStages.slice(0, 2).map((stage, i) => (
                            <StageRow key={stage.step} stage={stage} flip={i % 2 === 1} />
                        ))}

                        {/* The turn. Most studios hand over the WAV here. */}
                        <div className="relative my-6 overflow-hidden rounded-3xl border border-[#EA9A61]/40 px-6 py-10 md:px-12 md:py-14" style={{ background: "linear-gradient(112deg, rgba(66,32,28,0.55) 0%, rgba(8,5,3,0.9) 60%)" }}>
                            <p className="type-display text-[#FFF4E3]">Most studios stop here.</p>
                            <p className="type-h3 mt-3 text-[#EA9A61]">This is where we keep going.</p>
                        </div>

                        <PartHeader
                            part="Part two"
                            title="The rollout."
                            note="Content, release, pitch, and as many rounds as it takes for the song to get heard."
                        />
                        {processStages.slice(2).map((stage, i) => (
                            <StageRow key={stage.step} stage={stage} flip={i % 2 === 1} />
                        ))}
                    </div>
                </section>

                {/* FAQ. <details> keeps this a server component with no JS cost. */}
                <section className="relative border-t border-white/10 px-6 py-20">
                    <div className="mx-auto max-w-6xl">
                        <span className="type-eyebrow text-[#EA9A61]">Questions</span>
                        <h2 className="type-h2 mt-4 text-white">What artists ask us first.</h2>
                        <div className="mt-3 max-w-[200px]">
                            <Squiggle />
                        </div>
                        <div className="mt-10 max-w-3xl">
                            {toolkitFaqs.map((faq) => (
                                <details key={faq.question} className="group border-b border-white/10 py-5">
                                    <summary className="type-h4 flex cursor-pointer list-none items-center justify-between gap-4 text-white marker:content-none">
                                        {faq.question}
                                        <span aria-hidden className="text-[#EA9A61] transition-transform duration-300 group-open:rotate-45">+</span>
                                    </summary>
                                    <p className="type-body mt-4 max-w-2xl text-[#FFF4E3]/85">{faq.answer}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA. Same primary action as the home page: send a song. */}
                <section className="relative border-t border-white/10 px-6 py-24">
                    <LightSplash splashes={[{ left: "20%", top: "-20%", size: "min(60vw, 760px)", tone: "ember", strength: 0.24 }]} />
                    <div className="relative mx-auto max-w-6xl">
                        <h2 className="type-h2 text-white">Start with one song.</h2>
                        <div className="mt-4 max-w-[200px]">
                            <Squiggle />
                        </div>
                        <p className="type-lead mt-5 max-w-xl text-[#FFF4E3]/90">
                            Your first mix is $50. We&apos;ll tell you honestly what the song needs, and if the answer
                            is a re-record, we&apos;ll say so before you pay for anything.
                        </p>
                        <div className="mt-9 flex flex-wrap items-center gap-4">
                            <HandLink href={checkoutHref("mix_first")}>Send your stems</HandLink>
                            <CalBookButton
                                calLink={CONSULT_BOOKING_URL}
                                className="type-btn inline-flex items-center rounded-full border border-white/20 px-6 py-3.5 text-white/85 transition-colors hover:border-[#EA9A61]/60 hover:text-white"
                            >
                                Talk through the rollout
                            </CalBookButton>
                        </div>
                        <p className="type-small mt-8 text-[#FFF4E3]/80">
                            <Link href="/pricing" className="text-[#EA9A61] underline decoration-[#EA9A61]/40 underline-offset-4 hover:decoration-[#EA9A61]">Every rate</Link>
                            {" · "}
                            <Link href="/credits" className="text-[#EA9A61] underline decoration-[#EA9A61]/40 underline-offset-4 hover:decoration-[#EA9A61]">Hear the records</Link>
                        </p>
                        <p className="type-small mt-14 max-w-xl text-[#FFF4E3]/75">
                            Want the gear and the history of recorded sound? That lives in{" "}
                            <a
                                href="https://www.rovstudios.com/ctrla/toolkit/music"
                                className="text-[#EA9A61] underline decoration-[#EA9A61]/40 underline-offset-4 hover:decoration-[#EA9A61]"
                            >
                                the CTRL·A toolkit
                            </a>
                            , our open creative library.
                        </p>
                    </div>
                </section>
            </main>

            <MusicFooter />
            <MusicMenu />
        </IntakeProvider>
    );
}
