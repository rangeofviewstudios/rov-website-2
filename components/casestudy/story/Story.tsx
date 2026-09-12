"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Caveat } from "next/font/google";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { NavigationDock } from "@/components/sections/NavDoc";
import Footer from "@/components/sections/Footer";
import { CaseStudyFAQ } from "@/components/casestudy/CaseStudyFAQ";
import { HAND_FONT, tint, type StoryTheme } from "./theme";

/**
 * The storytelling case study format, generalized from the Wisdom ATL page.
 * Every study is a bespoke narrative built from these parts, on ROV's dark
 * canvas, in the client's color. Hand-written notes (Caveat) are the voice
 * of the studio talking over the frames.
 */

const caveat = Caveat({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-caveat" });

const EASE = [0.22, 1, 0.36, 1] as const;

const ThemeContext = createContext<StoryTheme | null>(null);

export function useStoryTheme(): StoryTheme {
    const t = useContext(ThemeContext);
    if (!t) throw new Error("Story parts must be rendered inside <Story>");
    return t;
}

/* ------------------------------------------------------------------ */
/* Motion                                                              */
/* ------------------------------------------------------------------ */

function useRise(delay = 0) {
    const reduced = useReducedMotion();
    return {
        initial: { opacity: 0, y: reduced ? 0 : 26 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: reduced ? 0.2 : 0.6, delay, ease: EASE },
    };
}

export function Rise({
    delay = 0,
    className,
    style,
    children,
    as = "div",
}: {
    delay?: number;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
    as?: "div" | "header" | "section" | "li" | "figure";
}) {
    const rise = useRise(delay);
    const Tag = motion[as];
    return (
        <Tag {...rise} className={className} style={style}>
            {children}
        </Tag>
    );
}

/* ------------------------------------------------------------------ */
/* Ink                                                                 */
/* ------------------------------------------------------------------ */

/** Hand-inked squiggle that stretches to whatever width it is given. */
export function InkRule({ color, height = 16 }: { color?: string; height?: number }) {
    const t = useStoryTheme();
    return (
        <svg viewBox="0 0 240 18" preserveAspectRatio="none" aria-hidden fill="none" style={{ width: "100%", height }}>
            <path d="M2,11 C42,3 78,16 118,8 C158,1 198,15 238,6" stroke={color ?? t.ink} strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

export function HandNote({
    children,
    color,
    tilt = -1.4,
    className = "",
}: {
    children: React.ReactNode;
    color?: string;
    tilt?: number;
    className?: string;
}) {
    const t = useStoryTheme();
    return (
        <span className={`block ${className}`} style={{ fontFamily: HAND_FONT, fontWeight: 600, color: color ?? t.ink, transform: `rotate(${tilt}deg)` }}>
            {children}
        </span>
    );
}

function InkCheck({ color }: { color: string }) {
    return (
        <svg viewBox="0 0 40 40" aria-hidden fill="none" className="h-7 w-7 md:h-9 md:w-9">
            <path d="M6,22 C12,25 15,30 17,33 C21,24 28,13 36,7" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function InkCross({ color }: { color: string }) {
    return (
        <svg viewBox="0 0 40 40" aria-hidden fill="none" className="h-14 w-14 md:h-20 md:w-20">
            <path d="M8,8 C16,15 24,26 32,33" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
            <path d="M32,8 C25,16 16,25 8,32" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
        </svg>
    );
}

// Three drawn-by-hand arrows so stacked notes never look cloned.
const ARROW_PATHS = [
    "M118,16 C94,11 74,27 57,31 C42,35 26,27 11,31",
    "M118,48 C97,52 88,30 70,23 C53,17 29,27 11,31",
    "M119,20 C102,12 87,21 81,33 C75,45 89,52 95,44 C101,35 83,25 63,28 C45,31 27,27 11,31",
];
const ARROW_HEAD = "M11,31 L28,21 M11,31 L28,41";
const NOTE_TILTS = [-1.6, 1.1, -0.7, 1.7, -1.2];

function SquigglyArrow({ variant, color }: { variant: number; color: string }) {
    return (
        <svg viewBox="0 0 130 62" aria-hidden fill="none" className="shrink-0 w-[74px] h-[36px] -rotate-90 md:w-[108px] md:h-[52px] md:rotate-0">
            <path d={ARROW_PATHS[variant % ARROW_PATHS.length]} stroke={color} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d={ARROW_HEAD} stroke={color} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// *word* inside a note renders in ink, the rest in the text color.
function inkWords(text: string, ink: string) {
    return text
        .split(/(\*[^*]+\*)/g)
        .filter(Boolean)
        .map((part, i) =>
            part.startsWith("*") && part.endsWith("*") ? (
                <span key={i} style={{ color: ink }}>
                    {part.slice(1, -1)}
                </span>
            ) : (
                <React.Fragment key={i}>{part}</React.Fragment>
            ),
        );
}

/* ------------------------------------------------------------------ */
/* Chrome                                                              */
/* ------------------------------------------------------------------ */

function ScrollRail() {
    const t = useStoryTheme();
    const { scrollYProgress } = useScroll();
    const width = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
    return <motion.div aria-hidden className="fixed top-0 left-0 right-0 z-50 origin-left" style={{ height: 3, background: t.accent, scaleX: width }} />;
}

/** Desktop-only sticky index. Lights whichever section owns the middle of the screen. */
function SectionIndex({ items }: { items: { id: string; label: string }[] }) {
    const t = useStoryTheme();
    const [active, setActive] = useState(items[0]?.id);

    useEffect(() => {
        const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
        if (!els.length) return;
        const pick = () => {
            const mid = window.innerHeight * 0.45;
            let current = items[0].id;
            for (const el of els) {
                if (el.getBoundingClientRect().top <= mid) current = el.id;
            }
            setActive(current);
        };
        pick();
        window.addEventListener("scroll", pick, { passive: true });
        return () => window.removeEventListener("scroll", pick);
    }, [items]);

    return (
        <nav aria-label="Sections" className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 2xl:flex">
            {items.map((item, i) => {
                const on = item.id === active;
                return (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="group flex items-center gap-3 text-[10px] uppercase transition-opacity"
                        style={{ fontFamily: t.label, letterSpacing: "0.2em", color: on ? t.accent : t.text, opacity: on ? 1 : 0.4 }}
                    >
                        <span className="w-6 text-right tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                        <span className="h-px transition-all" style={{ width: on ? 28 : 12, backgroundColor: on ? t.accent : t.text }} />
                        <span className="opacity-0 transition-opacity group-hover:opacity-100" style={{ opacity: on ? 1 : undefined }}>
                            {item.label}
                        </span>
                    </a>
                );
            })}
        </nav>
    );
}

export function Story({
    theme,
    sections,
    children,
}: {
    theme: StoryTheme;
    sections: { id: string; label: string }[];
    children: React.ReactNode;
}) {
    return (
        <ThemeContext.Provider value={theme}>
            <main className={`relative min-h-screen ${caveat.variable}`} style={{ backgroundColor: theme.bg, color: theme.text }}>
                <ScrollRail />
                <SectionIndex items={sections} />
                <NavigationDock />
                {children}
                <Footer />
            </main>
        </ThemeContext.Provider>
    );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

/**
 * The live-site link. With a `preview` capture it grows a browser window on
 * hover, breathing slowly so it reads as the site rather than a thumbnail.
 * Pointer devices only; touch just follows the link.
 */
function LiveLink({ href, label, preview, previewAspect = "16 / 9" }: { href: string; label: string; preview?: string; previewAspect?: string }) {
    const t = useStoryTheme();
    const [open, setOpen] = useState(false);
    const reduced = useReducedMotion();
    const host = label.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return (
        <span className="relative inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <AnimatePresence>
                {open && preview && (
                    <motion.span
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: EASE }}
                        className="pointer-events-none absolute bottom-full left-0 z-30 mb-4 hidden w-[380px] overflow-hidden rounded-xl md:block"
                        style={{ border: `1px solid ${tint(t.text, 0.16)}`, backgroundColor: "#111", boxShadow: "0 24px 60px rgba(0,0,0,0.65)" }}
                    >
                        <span className="flex items-center gap-2 px-3 py-2" style={{ backgroundColor: "#1a1a1a", borderBottom: `1px solid ${tint(t.text, 0.1)}` }}>
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.accent }} />
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tint(t.text, 0.25) }} />
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tint(t.text, 0.25) }} />
                            <span className="ml-2 flex-1 rounded-md px-2 py-0.5 text-[10px]" style={{ fontFamily: t.label, letterSpacing: "0.08em", color: t.text, opacity: 0.7, backgroundColor: tint(t.text, 0.06) }}>
                                {host}
                            </span>
                        </span>
                        <span className="relative block overflow-hidden" style={{ aspectRatio: previewAspect }}>
                            <motion.span
                                className="absolute inset-0 block origin-center"
                                initial={{ scale: 1 }}
                                animate={reduced ? { scale: 1 } : { scale: [1, 1.08, 1] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Image src={preview} alt={`${host} homepage`} fill sizes="380px" style={{ objectFit: "cover", objectPosition: "top" }} />
                            </motion.span>
                        </span>
                        <span className="absolute bottom-3 right-3 rounded-full px-2.5 py-1 text-[10px] uppercase" style={{ fontFamily: t.label, letterSpacing: "0.16em", color: t.text, backgroundColor: "rgba(0,0,0,0.7)" }}>
                            Live site
                        </span>
                    </motion.span>
                )}
            </AnimatePresence>

            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                className="group inline-flex w-fit items-center gap-3 rounded-full px-6 py-3 transition-colors duration-300"
                style={{ border: `1px solid ${t.accent}`, backgroundColor: tint(t.accent, open ? 0.18 : 0.1) }}
            >
                <span className="text-[11px] uppercase md:text-xs" style={{ fontFamily: t.label, letterSpacing: "0.18em", color: t.text }}>
                    Visit {host}
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: t.accent }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={t.bg} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                </span>
            </a>
        </span>
    );
}

export function StoryHero({
    eyebrow,
    lines,
    punch,
    note,
    intro,
    live,
    mark,
    glow,
}: {
    /** Crumb trail under the mark: ["E-commerce", "Wisdom ATL"]. */
    eyebrow: string[];
    /** Headline lines in the text color. */
    lines: string[];
    /** The last line, in the accent. */
    punch: string;
    /** Handwritten aside under the headline. */
    note: string;
    intro: string;
    live?: { href: string; preview?: string; previewAspect?: string };
    /** Optional client mark rendered above the crumb. */
    mark?: React.ReactNode;
    /** Blur color for the hero glow. Defaults to the accent. */
    glow?: string;
}) {
    const t = useStoryTheme();
    return (
        <section className="relative overflow-hidden" style={{ backgroundColor: t.bg }}>
            <div
                aria-hidden
                className="pointer-events-none absolute -top-1/3 left-1/2 -translate-x-1/2 rounded-full"
                style={{ width: "min(120vw, 1100px)", height: "min(120vw, 1100px)", background: glow ?? t.accent, filter: "blur(190px)", opacity: 0.22 }}
            />

            <div className="relative mx-auto w-full max-w-6xl px-5 pt-28 pb-14 md:px-10 md:pt-32 md:pb-20">
                {mark && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-7">
                        {mark}
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase md:text-xs"
                    style={{ fontFamily: t.label, letterSpacing: "0.22em", color: t.text }}
                >
                    <span style={{ color: t.accent }}>Case Study</span>
                    {eyebrow.map((e) => (
                        <React.Fragment key={e}>
                            <span style={{ opacity: 0.4 }}>·</span>
                            <span style={{ opacity: 0.7 }}>{e}</span>
                        </React.Fragment>
                    ))}
                </motion.div>

                <h1 className="uppercase" style={{ fontFamily: t.display, color: t.text, fontSize: "clamp(2.75rem, 11vw, 8.5rem)", lineHeight: 0.92, letterSpacing: "-0.01em" }}>
                    {lines.map((line, i) => (
                        <motion.span key={line} className="block" initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: i * 0.09, ease: EASE }}>
                            {line}
                        </motion.span>
                    ))}
                    <motion.span className="block" style={{ color: t.accent }} initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: lines.length * 0.09, ease: EASE }}>
                        {punch}
                    </motion.span>
                </h1>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-6 md:mt-8">
                    <HandNote className="text-[1.6rem] leading-tight md:text-[2.1rem]" tilt={-1.8}>
                        {note}
                    </HandNote>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-12 flex flex-col gap-7 md:mt-16 md:flex-row md:items-end md:justify-between md:gap-10"
                >
                    <p className="max-w-md text-base leading-relaxed md:text-lg" style={{ fontFamily: t.body, color: t.text, opacity: 0.75 }}>
                        {intro}
                    </p>
                    {live && <LiveLink href={live.href} label={live.href} preview={live.preview} previewAspect={live.previewAspect} />}
                </motion.div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Split: what was already true, and what a visitor could see          */
/* ------------------------------------------------------------------ */

export function SplitReveal({
    left,
    right,
}: {
    left: { eyebrow: string; sub: string; title: string; items: string[] };
    right: { eyebrow: string; sub: string; title: string; note: string; image?: { src: string; alt: string } };
}) {
    const t = useStoryTheme();
    const line = tint(t.text, 0.14);
    const eyebrow = { fontFamily: t.label, letterSpacing: "0.22em", color: t.text } as const;
    const h2 = { fontFamily: t.display, color: t.text, fontSize: "clamp(1.5rem, 3.4vw, 2.4rem)", lineHeight: 0.98 } as const;
    return (
        <section className="mx-auto w-full max-w-6xl px-5 pt-10 pb-4 md:px-10 md:pt-14 md:pb-6">
            <Rise className="grid grid-cols-1 md:grid-cols-2" style={{ border: `1px solid ${line}` }}>
                <div className="p-6 md:p-9" style={{ borderBottom: `1px solid ${line}` }}>
                    <div className="mb-4 flex items-center gap-3 text-[10px] uppercase md:text-xs" style={eyebrow}>
                        <span style={{ color: t.accent }}>{left.eyebrow}</span>
                        <span style={{ opacity: 0.55 }}>{left.sub}</span>
                    </div>
                    <h2 className="uppercase" style={h2}>
                        {left.title}
                    </h2>
                    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                        {left.items.map((item) => (
                            <li key={item} className="flex items-center gap-1.5">
                                <span className="inline-flex">
                                    <InkCheck color={t.ink} />
                                </span>
                                <span className="uppercase" style={{ fontFamily: t.display, color: t.text, fontSize: "clamp(1.1rem, 2.4vw, 1.6rem)", lineHeight: 1 }}>
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative p-6 md:p-9 md:border-l" style={{ borderColor: line }}>
                    <div className="mb-4 flex items-center gap-3 text-[10px] uppercase md:text-xs" style={eyebrow}>
                        <span style={{ color: t.accent }}>{right.eyebrow}</span>
                        <span style={{ opacity: 0.55 }}>{right.sub}</span>
                    </div>
                    <h2 className="uppercase" style={h2}>
                        {right.title}
                    </h2>
                    <div className="mt-5 flex items-center gap-4">
                        {right.image ? (
                            <span className="relative block w-[42%] shrink-0 overflow-hidden rounded-md" style={{ border: `1px solid ${line}` }}>
                                <Image src={right.image.src} alt={right.image.alt} width={0} height={0} sizes="240px" style={{ width: "100%", height: "auto", display: "block", opacity: 0.55 }} />
                                <span className="absolute inset-0 flex items-center justify-center">
                                    <InkCross color={t.ink} />
                                </span>
                            </span>
                        ) : (
                            <span className="relative flex w-[30%] shrink-0 items-center justify-center rounded-md" style={{ border: `1px dashed ${line}`, aspectRatio: "4 / 3" }}>
                                <InkCross color={t.ink} />
                            </span>
                        )}
                        <HandNote className="text-[1.2rem] leading-tight md:text-[1.45rem]" tilt={1.2}>
                            {right.note}
                        </HandNote>
                    </div>
                </div>
            </Rise>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Chapters                                                            */
/* ------------------------------------------------------------------ */

export function Chapter({ id, children }: { id: string; children: React.ReactNode }) {
    return (
        <section id={id} className="mx-auto w-full max-w-6xl scroll-mt-16 px-5 py-16 md:px-10 md:py-24">
            {children}
        </section>
    );
}

export function SectionHead({ index, label, title, note, children }: { index: string; label: string; title: string; note?: string; children?: React.ReactNode }) {
    const t = useStoryTheme();
    return (
        <Rise as="header" className="mb-12 md:mb-16">
            <div className="mb-5 flex items-center gap-3 text-[10px] uppercase md:text-xs" style={{ fontFamily: t.label, letterSpacing: "0.22em", color: t.text }}>
                <span style={{ color: t.accent }}>{index}</span>
                <span style={{ opacity: 0.55 }}>{label}</span>
            </div>

            <h2 className="uppercase" style={{ fontFamily: t.display, color: t.text, fontSize: "clamp(2rem, 7vw, 4.5rem)", lineHeight: 0.95 }}>
                {title}
            </h2>

            <div className="mt-3 max-w-[280px] md:max-w-[380px]">
                <InkRule />
            </div>

            {note && (
                <div className="mt-6">
                    <HandNote className="text-[1.3rem] leading-tight md:text-[1.7rem]">{note}</HandNote>
                </div>
            )}

            {children && (
                <p className="mt-6 max-w-2xl text-base leading-relaxed md:text-lg" style={{ fontFamily: t.body, color: t.text, opacity: 0.78 }}>
                    {children}
                </p>
            )}
        </Rise>
    );
}

/** The calls, up front: one giant line each. Optional aside in the margin. */
export function Principles({ items }: { items: (string | { call: string; aside: string })[] }) {
    const t = useStoryTheme();
    return (
        <div className="flex flex-col">
            {items.map((raw, i) => {
                const item = typeof raw === "string" ? { call: raw, aside: undefined } : raw;
                return (
                    <Rise key={item.call} delay={(i % 2) * 0.06} className="grid grid-cols-1 items-end gap-3 border-t py-7 md:grid-cols-[1fr_auto] md:gap-10 md:py-9" style={{ borderColor: tint(t.text, 0.14) }}>
                        <h3 className="uppercase" style={{ fontFamily: t.display, color: t.text, fontSize: "clamp(1.7rem, 5vw, 3.6rem)", lineHeight: 0.98 }}>
                            {item.call}
                        </h3>
                        {item.aside && (
                            <HandNote className="text-[1.15rem] leading-tight md:max-w-[260px] md:text-right md:text-[1.4rem]" tilt={i % 2 ? 1.2 : -1.2}>
                                {item.aside}
                            </HandNote>
                        )}
                    </Rise>
                );
            })}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Frames: pinned up and marked in the margin by hand                  */
/* ------------------------------------------------------------------ */

export type Frame = {
    title: string;
    src?: string;
    videoSrc?: string;
    /** Handwritten margin notes. *word* renders in ink. */
    notes: string[];
    /** Small handwritten tag on the frame itself ("before", "the room", "day one"). */
    tag?: string;
    /** Optional plain caption under the frame. */
    caption?: string;
};

export function Frames({ items }: { items: Frame[] }) {
    const t = useStoryTheme();
    const line = tint(t.text, 0.14);
    return (
        <div className="flex flex-col gap-20 md:gap-28">
            {items.map((item, index) => (
                <Rise key={item.title} delay={0.05}>
                    <div className="mb-7 flex items-baseline gap-4">
                        <span className="text-xs" style={{ fontFamily: t.label, letterSpacing: "0.18em", color: t.accent }}>
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <h4 className="uppercase" style={{ fontFamily: t.display, color: t.text, fontSize: "clamp(1.3rem, 3vw, 2rem)", lineHeight: 1 }}>
                            {item.title}
                        </h4>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
                        <div className="w-full shrink-0 md:w-[60%]">
                            <div
                                className="relative w-full overflow-hidden rounded-xl"
                                style={{
                                    border: `1px solid ${line}`,
                                    backgroundColor: tint(t.text, 0.03),
                                    transform: `rotate(${index % 2 ? 0.6 : -0.7}deg)`,
                                    boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
                                }}
                            >
                                {item.videoSrc ? (
                                    <video src={item.videoSrc} autoPlay muted loop playsInline className="block h-auto w-full" />
                                ) : item.src ? (
                                    <Image src={item.src} alt={item.title} width={0} height={0} sizes="(max-width: 768px) 100vw, 60vw" style={{ width: "100%", height: "auto", display: "block" }} />
                                ) : null}
                                {item.tag && (
                                    <span className="absolute top-3 right-3 rounded-full px-3 py-0.5 text-xl leading-tight" style={{ backgroundColor: "rgba(0,0,0,0.72)", color: t.ink, fontFamily: HAND_FONT, fontWeight: 600, transform: "rotate(-2.5deg)" }}>
                                        {item.tag}
                                    </span>
                                )}
                            </div>
                            {item.caption && (
                                <p className="mt-3 text-sm leading-relaxed" style={{ fontFamily: t.body, color: t.text, opacity: 0.7 }}>
                                    {item.caption}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-5 md:flex-1 md:gap-8 md:pt-8">
                            {item.notes.map((note, noteIndex) => (
                                <div key={noteIndex} className="flex flex-col items-center gap-0 md:flex-row md:items-center md:gap-2">
                                    {/* Below md the notes stack under the frame, so only the first arrow still points at anything. */}
                                    <div className={noteIndex === 0 ? "contents" : "hidden md:contents"}>
                                        <SquigglyArrow variant={noteIndex} color={t.ink} />
                                    </div>
                                    <span
                                        className="block text-center text-[1.45rem] leading-[1.2] md:text-left md:text-[1.8rem]"
                                        style={{ fontFamily: HAND_FONT, fontWeight: 600, color: t.text, transform: `rotate(${NOTE_TILTS[noteIndex % NOTE_TILTS.length]}deg)` }}
                                    >
                                        {inkWords(note, t.ink)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Rise>
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Features                                                            */
/* ------------------------------------------------------------------ */

/** Full-bleed highlight: one big frame and a short claim, alternating sides. */
export function FeatureRow({
    kicker,
    title,
    body,
    src,
    videoSrc,
    flip = false,
    index,
    children,
}: {
    kicker: string;
    title: string;
    body: string;
    src?: string;
    videoSrc?: string;
    flip?: boolean;
    index: number;
    /** Rendered in the media slot when there is no frame. */
    children?: React.ReactNode;
}) {
    const t = useStoryTheme();
    return (
        <Rise delay={0.05} className={`grid grid-cols-1 items-center gap-6 md:gap-12 lg:grid-cols-[1.35fr_1fr] ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div className="relative overflow-hidden rounded-xl" style={{ border: `1px solid ${tint(t.text, 0.14)}`, backgroundColor: tint(t.text, 0.03) }}>
                {videoSrc ? (
                    <video src={videoSrc} autoPlay muted loop playsInline className="block h-auto w-full" />
                ) : src ? (
                    <Image src={src} alt={title} width={0} height={0} sizes="(max-width: 1024px) 100vw, 60vw" style={{ width: "100%", height: "auto", display: "block" }} />
                ) : (
                    children
                )}
            </div>
            <div>
                <div className="mb-4 flex items-center gap-3 text-[10px] uppercase md:text-xs" style={{ fontFamily: t.label, letterSpacing: "0.22em", color: t.text }}>
                    <span style={{ color: t.accent }}>{String(index).padStart(2, "0")}</span>
                    <span style={{ opacity: 0.55 }}>{kicker}</span>
                </div>
                <h3 className="uppercase" style={{ fontFamily: t.display, color: t.text, fontSize: "clamp(1.7rem, 4.5vw, 3rem)", lineHeight: 0.98 }}>
                    {title}
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed md:text-lg" style={{ fontFamily: t.body, color: t.text, opacity: 0.78 }}>
                    {body}
                </p>
            </div>
        </Rise>
    );
}

/**
 * A typographic "frame" for studies without a screenshot to show: a big
 * word or number on a tinted card, with a handwritten aside. Fills the
 * media slot of a FeatureRow.
 */
export function TypeCard({ big, small, note }: { big: string; small?: string; note?: string }) {
    const t = useStoryTheme();
    return (
        <div className="flex flex-col justify-between p-7 md:p-10" style={{ aspectRatio: "16 / 10", background: `linear-gradient(135deg, ${tint(t.accent, 0.16)}, ${tint(t.accent, 0.02)})` }}>
            <span className="uppercase" style={{ fontFamily: t.display, color: t.accent, fontSize: "clamp(3rem, 9vw, 7rem)", lineHeight: 0.9 }}>
                {big}
            </span>
            <div className="flex items-end justify-between gap-4">
                {small && (
                    <span className="text-[10px] uppercase md:text-xs" style={{ fontFamily: t.label, letterSpacing: "0.22em", color: t.text, opacity: 0.6 }}>
                        {small}
                    </span>
                )}
                {note && (
                    <HandNote className="text-right text-[1.2rem] leading-tight md:text-[1.5rem]" tilt={1.6}>
                        {note}
                    </HandNote>
                )}
            </div>
        </div>
    );
}

/** The "also new" strip: smaller frames in a grid, after the big three. */
export function AlsoNew({ label = "Also new", items }: { label?: string; items: { title: string; caption: string; src?: string; videoSrc?: string }[] }) {
    const t = useStoryTheme();
    return (
        <div className="mt-20 md:mt-28">
            <div className="mb-8">
                <span className="text-[10px] uppercase md:text-xs" style={{ fontFamily: t.label, letterSpacing: "0.22em", color: t.text, opacity: 0.55 }}>
                    {label}
                </span>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item, i) => (
                    <Rise key={item.title} delay={(i % 3) * 0.06}>
                        <div className="relative mb-4 w-full overflow-hidden rounded-xl" style={{ aspectRatio: "16 / 10", border: `1px solid ${tint(t.text, 0.14)}`, backgroundColor: tint(t.text, 0.03) }}>
                            {item.videoSrc ? (
                                <video src={item.videoSrc} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
                            ) : item.src ? (
                                <Image src={item.src} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                            ) : null}
                        </div>
                        <h4 className="text-lg font-semibold" style={{ fontFamily: t.heading, color: t.text }}>
                            {item.title}
                        </h4>
                        <p className="mt-1.5 text-sm leading-relaxed" style={{ fontFamily: t.body, color: t.text, opacity: 0.6 }}>
                            {item.caption}
                        </p>
                    </Rise>
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* The receipt                                                         */
/* ------------------------------------------------------------------ */

export function Receipt({
    items,
    note,
    headline,
    meta,
    mark,
    stamp = "shipped",
}: {
    items: string[];
    note: string;
    /** Two lines beside the ticket. */
    headline: [string, string];
    /** Right-aligned mono lines at the top of the ticket. */
    meta: string[];
    /** Client mark printed on the ticket. Falls back to the client name. */
    mark?: React.ReactNode;
    stamp?: string;
}) {
    const t = useStoryTheme();
    const zig = (dir: "top" | "bottom") => ({
        height: 12,
        backgroundColor: "transparent",
        backgroundImage:
            dir === "top"
                ? `linear-gradient(135deg, transparent 6px, ${t.paper} 6px), linear-gradient(225deg, transparent 6px, ${t.paper} 6px)`
                : `linear-gradient(45deg, transparent 6px, ${t.paper} 6px), linear-gradient(315deg, transparent 6px, ${t.paper} 6px)`,
        backgroundPosition: "left top",
        backgroundSize: "12px 12px",
        backgroundRepeat: "repeat-x",
    });
    const mono = { fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace" } as const;
    const dashed = tint(t.paperInk, 0.35);

    return (
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,480px)_1fr] lg:gap-16">
            <Rise className="w-full max-w-[480px]">
                <div style={zig("top")} />
                <div className="px-6 py-6 md:px-8 md:py-7" style={{ backgroundColor: t.paper, color: t.paperInk }}>
                    <div className="flex items-start justify-between gap-6">
                        <div className="w-[120px] md:w-[140px]">{mark}</div>
                        <div className="text-right text-[10px] uppercase leading-relaxed" style={{ ...mono, letterSpacing: "0.12em", opacity: 0.7 }}>
                            Range of View
                            {meta.map((m) => (
                                <React.Fragment key={m}>
                                    <br />
                                    {m}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="my-5 border-t border-dashed" style={{ borderColor: dashed }} />

                    <ul className="flex flex-col gap-2.5">
                        {items.map((item) => (
                            <li key={item} className="flex items-baseline gap-2 text-[13px] leading-snug md:text-sm" style={mono}>
                                <span className="min-w-0">{item}</span>
                                <span className="mx-1 flex-1 border-b border-dotted" style={{ borderColor: tint(t.paperInk, 0.45), transform: "translateY(-4px)" }} />
                                <span style={{ fontFamily: HAND_FONT, fontWeight: 600, color: t.paperAccent, fontSize: "1.25rem", lineHeight: 1 }}>✓</span>
                            </li>
                        ))}
                    </ul>

                    <div className="my-5 border-t border-dashed" style={{ borderColor: dashed }} />

                    <div className="relative flex items-center justify-between">
                        <span className="text-xs uppercase" style={{ ...mono, letterSpacing: "0.14em" }}>
                            Items: {items.length}
                        </span>
                        <span className="rounded-sm border-2 px-3 py-1 text-[1.35rem] leading-none md:text-[1.6rem]" style={{ fontFamily: HAND_FONT, fontWeight: 700, color: t.paperAccent, borderColor: t.paperAccent, transform: "rotate(-7deg)", opacity: 0.9 }}>
                            {stamp}
                        </span>
                    </div>
                </div>
                <div style={zig("bottom")} />
            </Rise>

            <Rise delay={0.08} className="lg:pt-6">
                <h3 className="uppercase" style={{ fontFamily: t.display, color: t.text, fontSize: "clamp(1.8rem, 4.6vw, 3.4rem)", lineHeight: 0.98 }}>
                    {headline[0]}
                    <br />
                    {headline[1]}
                </h3>
                <div className="mt-6">
                    <HandNote className="text-[1.35rem] leading-tight md:text-[1.7rem]">{note}</HandNote>
                </div>
            </Rise>
        </div>
    );
}

/** The one real number, written large, with the studio's aside next to it. */
export function BigNumber({ stat, label, body, note }: { stat: string; label: string; body: string; note: string }) {
    const t = useStoryTheme();
    return (
        <Rise className="mt-16 grid grid-cols-1 items-center gap-8 border-t pt-12 md:mt-24 md:grid-cols-[auto_1fr] md:gap-14 md:pt-16" style={{ borderColor: tint(t.text, 0.14) }}>
            <div>
                <span className="block uppercase" style={{ fontFamily: t.display, color: t.accent, fontSize: "clamp(5rem, 16vw, 12rem)", lineHeight: 0.85, letterSpacing: "-0.02em" }}>
                    {stat}
                </span>
                <span className="mt-3 block text-[10px] uppercase md:text-xs" style={{ fontFamily: t.label, letterSpacing: "0.22em", color: t.text, opacity: 0.6 }}>
                    {label}
                </span>
            </div>
            <div>
                <HandNote className="text-[1.4rem] leading-tight md:text-[1.8rem]" tilt={-1}>
                    {note}
                </HandNote>
                <p className="mt-5 max-w-xl text-base leading-relaxed md:text-lg" style={{ fontFamily: t.body, color: t.text, opacity: 0.78 }}>
                    {body}
                </p>
            </div>
        </Rise>
    );
}

/* ------------------------------------------------------------------ */
/* Quote, FAQ, closer                                                  */
/* ------------------------------------------------------------------ */

/**
 * The client, in their own words, plus the Review structured data for it.
 * First-party testimonials are valid structured data but not eligible for
 * star rich results, so no reviewRating is emitted.
 */
export function StoryQuote({ quote, authorName, authorTitle, itemName, itemUrl }: { quote: string; authorName: string; authorTitle: string; itemName: string; itemUrl: string }) {
    const t = useStoryTheme();
    const schema = {
        "@context": "https://schema.org",
        "@type": "Review",
        reviewBody: quote,
        author: { "@type": "Person", name: authorName },
        itemReviewed: { "@type": "CreativeWork", name: itemName, url: `https://www.rovstudios.com${itemUrl}` },
        publisher: { "@type": "Organization", name: "Range of View Studios", url: "https://www.rovstudios.com" },
    };
    return (
        <section className="mx-auto w-full max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            <Rise as="figure" className="m-0 border-t pt-12 md:pt-16" style={{ borderColor: tint(t.text, 0.14) }}>
                <div className="mb-8 flex items-center gap-3 text-[10px] uppercase md:text-xs" style={{ fontFamily: t.label, letterSpacing: "0.22em", color: t.text }}>
                    <span style={{ color: t.accent }}>In their words</span>
                </div>
                <blockquote className="m-0 max-w-4xl">
                    <p style={{ fontFamily: t.heading, color: t.text, fontSize: "clamp(1.5rem, 3.6vw, 2.6rem)", lineHeight: 1.2 }}>{quote}</p>
                </blockquote>
                <figcaption className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span aria-hidden className="h-px w-8" style={{ backgroundColor: t.accent }} />
                    <span className="text-base md:text-lg" style={{ fontFamily: HAND_FONT, fontWeight: 600, color: t.ink, fontSize: "1.5rem" }}>
                        {authorName}
                    </span>
                    <span className="text-sm md:text-base" style={{ fontFamily: t.body, color: t.text, opacity: 0.6 }}>
                        {authorTitle}
                    </span>
                </figcaption>
            </Rise>
        </section>
    );
}

export function StoryFAQ({ faqs }: { faqs: { question: string; answer: string }[] }) {
    const t = useStoryTheme();
    return <CaseStudyFAQ accentColor={t.accent} leadName="Ayush Basu" leadRole="Founder & Creative Director" faqs={faqs} />;
}

/** The one light ground on the page, so the client's color lands as ink. */
export function ClosingCTA({ title, body, cta = "Start a project", mark }: { title: [string, string]; body: string; cta?: string; mark?: React.ReactNode }) {
    const t = useStoryTheme();
    return (
        <Rise as="section" className="relative overflow-hidden" style={{ backgroundColor: t.paper }}>
            <div className="mx-auto w-full max-w-5xl px-5 py-16 md:px-10 md:py-24">
                {mark && <div className="mx-auto mb-10 flex justify-center md:mb-14">{mark}</div>}

                <h2 className="text-center uppercase" style={{ fontFamily: t.display, color: t.paperAccent, fontSize: "clamp(1.9rem, 6.5vw, 4rem)", lineHeight: 0.98 }}>
                    {title[0]}
                    <br />
                    {title[1]}
                </h2>

                <p className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed md:text-lg" style={{ fontFamily: t.body, color: t.paperInk }}>
                    {body}
                </p>

                <div className="mt-9 flex flex-col items-center gap-5">
                    <a href="/#contact" className="inline-flex items-center gap-3 rounded-full px-8 py-4 transition-transform duration-300 hover:scale-[1.03]" style={{ backgroundColor: t.paperAccent }}>
                        <span className="text-xs uppercase md:text-sm" style={{ fontFamily: t.label, letterSpacing: "0.16em", color: t.paper, fontWeight: 600 }}>
                            {cta}
                        </span>
                    </a>
                    <a href="/casestudy" className="text-[11px] uppercase underline-offset-4 hover:underline md:text-xs" style={{ fontFamily: t.label, letterSpacing: "0.18em", color: t.paperInk, opacity: 0.7 }}>
                        Or read another story first
                    </a>
                </div>
            </div>
        </Rise>
    );
}

/** A client's name set as a mark, for clients whose logo file we do not have. */
export function WordMark({ text, color, size = "clamp(1.4rem, 3vw, 2rem)" }: { text: string; color: string; size?: string }) {
    const t = useStoryTheme();
    return (
        <span className="block uppercase" style={{ fontFamily: t.display, color, fontSize: size, lineHeight: 0.95 }}>
            {text}
        </span>
    );
}
