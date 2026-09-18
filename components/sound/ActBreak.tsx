import SessionPhoto, { type SessionFrame } from "@/components/sound/SessionPhoto";
import { Hand, HandLink, M, PinTag, Squiggle } from "@/components/sound/musicStory";

// The music home page is built in four acts (proof, the song, the career, the
// close). ActBreak is the punctuation between them, in the Wisdom case study
// voice: one big uppercase line, a drawn underline, and a handwritten note
// where a paragraph used to be. It must never compete with the sections
// around it, so there is one line, one note, one route out, nothing else.
//
// It can carry one session photo. "bleed" puts the photo behind the line for
// the one break that deserves a full-width moment; "side" sets it beside the
// text. A handwritten tag pins to the photo like the frame tags on Wisdom.

export default function ActBreak({
    act,
    line,
    note,
    link,
    photo,
    tag,
    layout = "side",
    tilt = -1.2,
}: {
    /** e.g. "Act two · the song". Small label, sets position in the journey. */
    act: string;
    /** The one line that moves the reader on. Set uppercase, keep it short. */
    line: string;
    /** Handwritten aside in ink. The studio talking, not marketing. */
    note?: string;
    /** Route out to the proof pages, handwritten. */
    link?: { label: string; href: string };
    /** Optional session still. See SessionPhoto for the frames. */
    photo?: SessionFrame;
    /** Handwritten tag pinned on the photo. Keep it true. */
    tag?: string;
    /** How the photo sits. Only read when `photo` is set. */
    layout?: "bleed" | "side";
    /** Tilt of the note, so stacked breaks never look cloned. */
    tilt?: number;
}) {
    const copy = (
        <>
            <p
                className="text-[10px] uppercase md:text-xs"
                style={{ fontFamily: M.label, letterSpacing: "0.22em", color: M.ink }}
            >
                {act}
            </p>

            <h2
                className="mt-4 uppercase"
                style={{
                    fontFamily: M.display,
                    color: M.cream,
                    fontSize: "clamp(2.1rem, 6.5vw, 4.4rem)",
                    lineHeight: 0.95,
                }}
            >
                {line}
            </h2>

            <div className="mt-3 max-w-[260px] md:max-w-[360px]">
                <Squiggle />
            </div>

            {note && (
                <div
                    className="mt-6 inline-block max-w-md rounded-2xl px-5 py-4"
                    style={{ background: "rgba(255,244,227,0.06)", border: "1px solid rgba(255,244,227,0.1)" }}
                >
                    <Hand className="text-[1.2rem] leading-tight md:text-[1.5rem]" tilt={tilt}>
                        {note}
                    </Hand>
                </div>
            )}

            {link && (
                <div className="mt-7">
                    <HandLink href={link.href} tilt={-tilt / 2}>{link.label}</HandLink>
                </div>
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
                    <SessionPhoto frame={photo} sizes="(min-width: 768px) 70vw, 100vw" fade={false} creditClass="md:bottom-10 md:right-8" />
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
                    {tag && <PinTag tilt={-2}>{tag}</PinTag>}
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
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr] md:items-start lg:gap-16">
                        <div>{copy}</div>
                        <div
                            className="group relative aspect-[4/5] max-h-[520px] w-full overflow-hidden rounded-2xl"
                            style={{ transform: `rotate(${tilt > 0 ? -0.7 : 0.6}deg)` }}
                        >
                            <SessionPhoto frame={photo} sizes="(min-width: 768px) 40vw, 100vw" />
                            {tag && <PinTag tilt={tilt > 0 ? 2.2 : -2.5}>{tag}</PinTag>}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-black px-6 py-20 sm:py-28">
            <div className="mx-auto max-w-4xl">{copy}</div>
        </section>
    );
}
