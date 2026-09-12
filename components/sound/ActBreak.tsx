import Link from "next/link";
import SessionPhoto, { PhotoCredit, type SessionFrame } from "@/components/sound/SessionPhoto";

// The music home page is built in four acts (proof, the song, the career, the
// close) and that structure only ever existed as comments in the JSX. On screen
// it read as fourteen dark sections of equal weight, so the journey was
// invisible: nice components, no narrative punctuation.
//
// ActBreak is the punctuation. It is deliberately quiet, a label, one line that
// carries the argument forward, and a hairline. It is not a section and must
// never compete with the sections around it.
//
// It can carry one session photo. "bleed" puts the photo behind the line for
// the one break that deserves a full-width moment; "side" sets it beside the
// text so the break still reads as a pause, not a hero.

const HEADING_FONT = "Norwige, sans-serif";
const BODY_FONT = "'Roboto', sans-serif";
const ACCENT = "#EA9A61";

export default function ActBreak({
    act,
    line,
    sub,
    link,
    photo,
    layout = "side",
}: {
    /** e.g. "Act two". Small, accent, sets position in the journey. */
    act: string;
    /** The one line that moves the reader from the act above to the one below. */
    line: string;
    /** Optional second line, for the bridge that needs a beat more. */
    sub?: string;
    /** Optional route out to the proof pages, which otherwise live only in the menu. */
    link?: { label: string; href: string };
    /** Optional session still. See SessionPhoto for the frames. */
    photo?: SessionFrame;
    /** How the photo sits. Only read when `photo` is set. */
    layout?: "bleed" | "side";
}) {
    const copy = (
        <>
            <p
                className="text-[11px] uppercase tracking-[0.3em]"
                style={{ fontFamily: BODY_FONT, color: ACCENT }}
            >
                {act}
            </p>

            <p
                className="mt-5 max-w-3xl text-white"
                style={{
                    fontFamily: HEADING_FONT,
                    fontSize: "clamp(1.75rem, 4vw, 3rem)",
                    lineHeight: 1.15,
                }}
            >
                {line}
            </p>

            {sub && (
                <p
                    className="mt-5 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg"
                    style={{ fontFamily: BODY_FONT }}
                >
                    {sub}
                </p>
            )}

            {link && (
                <Link
                    href={link.href}
                    className="mt-7 inline-block text-sm underline decoration-white/25 underline-offset-4 transition-colors hover:text-white"
                    style={{ fontFamily: BODY_FONT, color: "rgba(255,255,255,0.6)" }}
                >
                    {link.label} →
                </Link>
            )}
        </>
    );

    if (photo && layout === "bleed") {
        return (
            <section className="relative bg-black overflow-hidden">
                {/* Wide screens: the photo owns the right two thirds and the
                    copy sits in the dark left third, clear of the subject.
                    Phones: the photo stacks above the copy at its own ratio,
                    fading to black where the text begins. */}
                <div className="group relative aspect-[3/2] md:absolute md:inset-y-0 md:right-0 md:left-[30%] md:aspect-auto">
                    <SessionPhoto frame={photo} sizes="(min-width: 768px) 70vw, 100vw" fade={false} credit={false} />
                    <div
                        aria-hidden
                        className="absolute inset-0 md:hidden"
                        style={{ background: "linear-gradient(180deg, transparent 55%, #000 100%)" }}
                    />
                    <div
                        aria-hidden
                        className="absolute inset-0 hidden md:block"
                        style={{
                            background:
                                "linear-gradient(90deg, #000 0%, rgba(0,0,0,0.7) 22%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.1) 100%), linear-gradient(180deg, #000 0%, transparent 22%, transparent 70%, #000 100%)",
                        }}
                    />
                    <PhotoCredit className="md:bottom-10 md:right-6" />
                </div>
                <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-6 md:flex md:min-h-[78vh] md:items-center md:py-32">
                    <div className="max-w-xl">{copy}</div>
                </div>
            </section>
        );
    }

    if (photo) {
        return (
            <section className="bg-black px-6 py-20 sm:py-28">
                <div className="mx-auto max-w-6xl">
                    <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.12)" }} />
                    <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr] md:items-center lg:gap-16">
                        <div>{copy}</div>
                        <div className="group relative aspect-[4/5] max-h-[520px] w-full overflow-hidden rounded-2xl">
                            <SessionPhoto frame={photo} sizes="(min-width: 768px) 40vw, 100vw" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-black px-6 py-20 sm:py-28">
            <div className="mx-auto max-w-4xl">
                <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.12)" }} />
                <div className="mt-10">{copy}</div>
            </div>
        </section>
    );
}
