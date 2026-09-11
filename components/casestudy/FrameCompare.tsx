'use client';

import React from 'react';
import Image from 'next/image';
import { Caveat } from 'next/font/google';

const caveat = Caveat({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-caveat' });

// Inline style beats the parent page's `#id p` font rule, so notes keep their hand.
const HAND_STACK = 'var(--font-caveat), "Segoe Script", "Bradley Hand", cursive';

// Three drawn-by-hand paths so stacked notes never look cloned.
const ARROW_PATHS = [
    'M118,16 C94,11 74,27 57,31 C42,35 26,27 11,31',
    'M118,48 C97,52 88,30 70,23 C53,17 29,27 11,31',
    'M119,20 C102,12 87,21 81,33 C75,45 89,52 95,44 C101,35 83,25 63,28 C45,31 27,27 11,31',
];
const ARROW_HEAD = 'M11,31 L28,21 M11,31 L28,41';
const NOTE_TILTS = [-1.6, 1.1, -0.7, 1.7, -1.2];

// *word* inside a note renders in the ink color, the rest in the text color.
function inkWords(text: string, ink: string) {
    return text.split(/(\*[^*]+\*)/g).filter(Boolean).map((part, i) =>
        part.startsWith('*') && part.endsWith('*')
            ? <span key={i} style={{ color: ink }}>{part.slice(1, -1)}</span>
            : <React.Fragment key={i}>{part}</React.Fragment>
    );
}

function SquigglyArrow({ variant, color }: { variant: number; color: string }) {
    return (
        <svg
            viewBox="0 0 130 62"
            aria-hidden
            fill="none"
            className="shrink-0 w-[74px] h-[36px] -rotate-90 md:w-[108px] md:h-[52px] md:rotate-0"
        >
            <path d={ARROW_PATHS[variant % ARROW_PATHS.length]} stroke={color} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d={ARROW_HEAD} stroke={color} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function SquigglyDownArrow({ color }: { color: string }) {
    return (
        <svg viewBox="0 0 60 130" aria-hidden fill="none" className="w-[38px] h-[84px] md:w-[46px] md:h-[100px]">
            <path d="M30,6 C21,26 40,40 30,60 C21,78 39,92 30,110" stroke={color} strokeWidth="2.7" strokeLinecap="round" />
            <path d="M30,116 L19,97 M30,116 L41,97" stroke={color} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

interface FrameSide {
    src?: string;
    videoSrc?: string;
    caption?: string;
}

interface FrameStep {
    title: string;
    /** The old frame, marked up in the margin with handwritten notes. */
    before: FrameSide & { notes: string[] };
    /** The rebuild. Left clean on purpose: the contrast is the argument. */
    after: FrameSide & { caption: string };
}

interface FrameCompareProps {
    title?: string;
    description?: string;
    items: FrameStep[];
    titleColor?: string;
    titleFont?: string;
    titleItalic?: boolean;
    textColor?: string;
    bodyFont?: string;
    labelColor?: string;
    secondaryColor?: string;
    borderColor?: string;
    cardBgColor?: string;
    accentColor?: string;
    handColor?: string;
}

function FrameMedia({
    side,
    alt,
    sizes,
    borderColor,
    cardBgColor,
    secondaryColor,
    bodyFont,
}: {
    side: FrameSide;
    alt: string;
    sizes: string;
    borderColor: string;
    cardBgColor: string;
    secondaryColor: string;
    bodyFont: string;
}) {
    // Frames render at their own aspect ratio so nothing gets cropped out of
    // the shot the note is pointing at.
    if (side.videoSrc) {
        return <video src={side.videoSrc} autoPlay muted loop playsInline className="block w-full h-auto" />;
    }
    if (side.src) {
        return <Image src={side.src} alt={alt} width={0} height={0} sizes={sizes} style={{ width: '100%', height: 'auto', display: 'block' }} />;
    }
    return (
        <div className="flex items-center justify-center text-center px-6" style={{ aspectRatio: '16 / 10', border: `1px dashed ${borderColor}`, backgroundColor: cardBgColor }}>
            <span className="text-xs" style={{ color: secondaryColor, fontFamily: bodyFont }}>
                Drop frame here
            </span>
        </div>
    );
}

/**
 * Each step reads top to bottom: the old frame pinned up and marked in the
 * margin by hand, a squiggle down, then the rebuild sitting clean in the
 * same slot.
 */
export const FrameCompare: React.FC<FrameCompareProps> = ({
    title,
    description,
    items,
    titleColor = '#C90000',
    titleFont = 'Norwige, sans-serif',
    titleItalic = false,
    textColor = '#d1d5db',
    bodyFont = "'Roboto', sans-serif",
    labelColor = 'white',
    secondaryColor = '#9ca3af',
    borderColor = 'rgba(255,255,255,0.12)',
    cardBgColor = 'rgba(255,255,255,0.03)',
    accentColor = '#C90000',
    handColor,
}) => {
    const ink = handColor || accentColor;

    return (
        <div className={caveat.variable}>
            {title && (
                <h3
                    className="text-5xl md:text-6xl font-bold mb-4 uppercase tracking-tight"
                    style={{ color: titleColor, fontFamily: titleFont, letterSpacing: '0.1em', fontStyle: titleItalic ? 'italic' : undefined }}
                >
                    {title}
                </h3>
            )}
            {description && (
                <p className="text-lg mb-16 leading-relaxed max-w-3xl" style={{ fontFamily: bodyFont, color: textColor }}>
                    {description}
                </p>
            )}

            <div className="flex flex-col gap-24 md:gap-32">
                {items.map((item, index) => (
                    <div key={index}>
                        <div className="flex items-baseline gap-4 mb-7">
                            <span className="text-xs font-mono" style={{ color: secondaryColor }}>
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <h4 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: titleFont, letterSpacing: '0.05em', color: labelColor }}>
                                {item.title}
                            </h4>
                        </div>

                        {/* The old frame, pinned up and marked in the margin */}
                        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                            <div className="w-full md:w-[60%] shrink-0">
                                <div
                                    className="relative w-full overflow-hidden rounded-xl"
                                    style={{
                                        border: `1px solid ${borderColor}`,
                                        backgroundColor: cardBgColor,
                                        transform: 'rotate(-0.7deg)',
                                        boxShadow: '0 18px 50px rgba(0,0,0,0.55)',
                                    }}
                                >
                                    <FrameMedia
                                        side={item.before}
                                        alt={`${item.title}, before`}
                                        sizes="(max-width: 768px) 100vw, 60vw"
                                        borderColor={borderColor}
                                        cardBgColor={cardBgColor}
                                        secondaryColor={secondaryColor}
                                        bodyFont={bodyFont}
                                    />
                                    <span
                                        className="absolute top-3 right-3 px-3 py-0.5 rounded-full text-xl leading-tight"
                                        style={{ backgroundColor: 'rgba(0,0,0,0.72)', color: ink, fontFamily: HAND_STACK, fontWeight: 600, transform: 'rotate(-2.5deg)' }}
                                    >
                                        before
                                    </span>
                                </div>
                                {item.before.caption && (
                                    <p className="mt-3 text-sm leading-relaxed" style={{ fontFamily: bodyFont, color: textColor }}>
                                        {item.before.caption}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-5 md:gap-8 md:pt-8 md:flex-1">
                                {item.before.notes.map((note, noteIndex) => (
                                    <div key={noteIndex} className="flex flex-col items-center gap-0 md:flex-row md:items-center md:gap-2">
                                        {/* Below md the notes stack under the frame, so only the first
                                            arrow still has something to point at. */}
                                        <div className={noteIndex === 0 ? 'contents' : 'hidden md:contents'}>
                                            <SquigglyArrow variant={noteIndex} color={ink} />
                                        </div>
                                        <span
                                            className="block text-center md:text-left text-[1.45rem] md:text-[1.8rem] leading-[1.2]"
                                            style={{
                                                fontFamily: HAND_STACK,
                                                fontWeight: 600,
                                                color: textColor,
                                                transform: `rotate(${NOTE_TILTS[noteIndex % NOTE_TILTS.length]}deg)`,
                                            }}
                                        >
                                            {inkWords(note, ink)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex py-2">
                            <div className="w-full md:w-[60%] flex justify-center">
                                <SquigglyDownArrow color={ink} />
                            </div>
                        </div>

                        {/* The rebuild, left clean */}
                        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                            <div className="w-full md:w-[60%] shrink-0">
                                <div
                                    className="relative w-full overflow-hidden rounded-xl"
                                    style={{ border: `1px solid ${borderColor}`, backgroundColor: cardBgColor }}
                                >
                                    <FrameMedia
                                        side={item.after}
                                        alt={`${item.title}, after`}
                                        sizes="(max-width: 768px) 100vw, 60vw"
                                        borderColor={borderColor}
                                        cardBgColor={cardBgColor}
                                        secondaryColor={secondaryColor}
                                        bodyFont={bodyFont}
                                    />
                                    <span
                                        className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em]"
                                        style={{ backgroundColor: accentColor, color: '#141414', fontFamily: bodyFont }}
                                    >
                                        after
                                    </span>
                                </div>
                            </div>
                            {/* Same hand as the critique, but the fix is written in white with the red arrow. */}
                            <div className="flex flex-col items-center gap-0 md:flex-1 md:flex-row md:items-center md:gap-2 md:pt-8">
                                <SquigglyArrow variant={2} color={ink} />
                                <span
                                    className="block text-center md:text-left text-[1.45rem] md:text-[1.8rem] leading-[1.2]"
                                    style={{ fontFamily: HAND_STACK, fontWeight: 600, color: textColor, transform: 'rotate(0.9deg)' }}
                                >
                                    {item.after.caption}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
