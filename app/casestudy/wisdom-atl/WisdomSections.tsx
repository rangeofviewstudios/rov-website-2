"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * Bespoke sections for the Wisdom ATL study. ROV's dark canvas and type
 * system, wearing Wisdm's red. Two reds by ground, picked off the proof
 * board: crimson on cream, the logo file's own red on black.
 */
export const W = {
    black: "#000000",
    cream: "#FFF4E3",
    red: "#C8102E",
    ink: "#E83830",
    pop: "#F84820",
    display: "'NorwigeExtraBoldItalic_Hero', 'Norwige', sans-serif",
    heading: "'Norwige', sans-serif",
    body: "'Inter', sans-serif",
    label: "'Neue Montreal', 'Inter', sans-serif",
    hand: 'var(--font-caveat), "Segoe Script", "Bradley Hand", cursive',
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

/** Rise-on-enter props that collapse to a plain fade when the OS asks for less motion. */
function useRise(delay = 0) {
    const reduced = useReducedMotion();
    return {
        initial: { opacity: 0, y: reduced ? 0 : 26 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: reduced ? 0.2 : 0.6, delay, ease: EASE },
    };
}

function Rise({ delay = 0, className, style, children, as = "div" }: { delay?: number; className?: string; style?: React.CSSProperties; children: React.ReactNode; as?: "div" | "header" | "section" | "li" }) {
    const rise = useRise(delay);
    const Tag = motion[as];
    return (
        <Tag {...rise} className={className} style={style}>
            {children}
        </Tag>
    );
}

const LOGO_MASK = "url(/casestudy/wisdom-atl/w-logo-mask.png)";

/** The Wisdm wordmark, recolored through its alpha mask. */
export function WisdmLogo({ color, className = "" }: { color: string; className?: string }) {
    return (
        <span
            role="img"
            aria-label="Wisdom"
            className={`block ${className}`}
            style={{
                aspectRatio: "2017 / 1109",
                backgroundColor: color,
                WebkitMaskImage: LOGO_MASK,
                maskImage: LOGO_MASK,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
            }}
        />
    );
}

/** Hand-inked squiggle that stretches to whatever width it is given. */
export function InkRule({ color = W.ink, height = 16 }: { color?: string; height?: number }) {
    return (
        <svg viewBox="0 0 240 18" preserveAspectRatio="none" aria-hidden fill="none" style={{ width: "100%", height }}>
            <path d="M2,11 C42,3 78,16 118,8 C158,1 198,15 238,6" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

export function HandNote({
    children,
    color = W.ink,
    tilt = -1.4,
    className = "",
}: {
    children: React.ReactNode;
    color?: string;
    tilt?: number;
    className?: string;
}) {
    return (
        <span
            className={`block ${className}`}
            style={{ fontFamily: W.hand, fontWeight: 600, color, transform: `rotate(${tilt}deg)` }}
        >
            {children}
        </span>
    );
}

export function ScrollRail() {
    const { scrollYProgress } = useScroll();
    const width = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
    return (
        <motion.div
            aria-hidden
            className="fixed top-0 left-0 right-0 z-50 origin-left"
            style={{ height: 3, background: W.ink, scaleX: width }}
        />
    );
}

/**
 * The live-site link, with a browser-window preview on hover. wisdomatl.com
 * sends frame-ancestors 'none', so a real iframe would render blank; this is
 * the homepage capture with a slow breathing zoom so it reads as the site
 * rather than a thumbnail. Pointer devices only; touch just follows the link.
 */
function LiveLink() {
    const [open, setOpen] = useState(false);
    const reduced = useReducedMotion();
    return (
        <span className="relative inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <AnimatePresence>
                {open && (
                    <motion.span
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: EASE }}
                        className="pointer-events-none absolute bottom-full left-0 z-30 mb-4 hidden w-[380px] overflow-hidden rounded-xl md:block"
                        style={{ border: "1px solid rgba(255,244,227,0.16)", backgroundColor: "#111", boxShadow: "0 24px 60px rgba(0,0,0,0.65)" }}
                    >
                        <span className="flex items-center gap-2 px-3 py-2" style={{ backgroundColor: "#1a1a1a", borderBottom: "1px solid rgba(255,244,227,0.1)" }}>
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: W.ink }} />
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "rgba(255,244,227,0.25)" }} />
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "rgba(255,244,227,0.25)" }} />
                            <span
                                className="ml-2 flex-1 rounded-md px-2 py-0.5 text-[10px]"
                                style={{ fontFamily: W.label, letterSpacing: "0.08em", color: W.cream, opacity: 0.7, backgroundColor: "rgba(255,244,227,0.06)" }}
                            >
                                wisdomatl.com
                            </span>
                        </span>
                        <span className="relative block overflow-hidden" style={{ aspectRatio: "2508 / 1296" }}>
                            <motion.span
                                className="absolute inset-0 block origin-center"
                                initial={{ scale: 1 }}
                                animate={reduced ? { scale: 1 } : { scale: [1, 1.08, 1] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Image
                                    src="/casestudy/wisdom-atl/build/wisdmnewhero.png"
                                    alt="wisdomatl.com homepage"
                                    width={0}
                                    height={0}
                                    sizes="380px"
                                    style={{ width: "100%", height: "auto", display: "block" }}
                                />
                            </motion.span>
                        </span>
                        <span
                            className="absolute bottom-3 right-3 rounded-full px-2.5 py-1 text-[10px] uppercase"
                            style={{ fontFamily: W.label, letterSpacing: "0.16em", color: W.cream, backgroundColor: "rgba(0,0,0,0.7)" }}
                        >
                            Live site
                        </span>
                    </motion.span>
                )}
            </AnimatePresence>

            <a
                href="https://wisdomatl.com/"
                target="_blank"
                rel="noopener noreferrer"
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                className="group inline-flex w-fit items-center gap-3 rounded-full px-6 py-3 transition-colors duration-300"
                style={{ border: `1px solid ${W.ink}`, backgroundColor: open ? "rgba(232,56,48,0.18)" : "rgba(232,56,48,0.10)" }}
            >
                <span className="text-[11px] uppercase md:text-xs" style={{ fontFamily: W.label, letterSpacing: "0.18em", color: W.cream }}>
                    Visit wisdomatl.com
                </span>
                <span
                    className="flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: W.ink }}
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={W.cream} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                </span>
            </a>
        </span>
    );
}

export function WisdomHero() {
    return (
        <section className="relative overflow-hidden" style={{ backgroundColor: W.black }}>
            <div
                aria-hidden
                className="pointer-events-none absolute -top-1/3 left-1/2 -translate-x-1/2 rounded-full"
                style={{ width: "min(120vw, 1100px)", height: "min(120vw, 1100px)", background: W.red, filter: "blur(190px)", opacity: 0.22 }}
            />

            <div className="relative mx-auto w-full max-w-6xl px-5 pt-28 pb-14 md:px-10 md:pt-32 md:pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-7 w-[124px] md:w-[168px]"
                >
                    <WisdmLogo color={W.ink} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase md:text-xs"
                    style={{ fontFamily: W.label, letterSpacing: "0.22em", color: W.cream }}
                >
                    <span style={{ color: W.ink }}>Case Study</span>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span style={{ opacity: 0.7 }}>E-commerce</span>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span style={{ opacity: 0.7 }}>Wisdom ATL</span>
                </motion.div>

                <h1
                    className="uppercase"
                    style={{
                        fontFamily: W.display,
                        color: W.cream,
                        fontSize: "clamp(2.75rem, 11vw, 8.5rem)",
                        lineHeight: 0.92,
                        letterSpacing: "-0.01em",
                    }}
                >
                    {["We turned", "Wisdom into"].map((line, i) => (
                        <motion.span
                            key={line}
                            className="block"
                            initial={{ opacity: 0, y: 34 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {line}
                        </motion.span>
                    ))}
                    <motion.span
                        className="block"
                        style={{ color: W.ink }}
                        initial={{ opacity: 0, y: 34 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    >
                        a machine.
                    </motion.span>
                </h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-6 md:mt-8"
                >
                    <HandNote className="text-[1.6rem] leading-tight md:text-[2.1rem]" tilt={-1.8}>
                        and made it weirder on purpose
                    </HandNote>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-12 flex flex-col gap-7 md:mt-16 md:flex-row md:items-end md:justify-between md:gap-10"
                >
                    <p className="max-w-md text-base leading-relaxed md:text-lg" style={{ fontFamily: W.body, color: W.cream, opacity: 0.75 }}>
                        A fun eyewear lifestyle brand out of Atlanta with Nike, SCAD and Nordstrom in its history, and a
                        website that showed none of it. We rebuilt the whole thing, frame by frame.
                    </p>

                    <LiveLink />
                </motion.div>
            </div>
        </section>
    );
}

function InkCheck({ color }: { color: string }) {
    return (
        <svg viewBox="0 0 40 40" aria-hidden fill="none" className="h-7 w-7 md:h-9 md:w-9">
            <path d="M6,22 C12,25 15,30 17,33 C21,24 28,13 36,7" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/** Split screen: what already existed on the left, what the old site showed on the right. */
export function CollabSplit({ items, oldFrame }: { items: string[]; oldFrame: string }) {
    const eyebrow = { fontFamily: W.label, letterSpacing: "0.22em", color: W.cream } as const;
    return (
        <section className="mx-auto w-full max-w-6xl px-5 pt-10 pb-4 md:px-10 md:pt-14 md:pb-6">
            <Rise className="grid grid-cols-1 md:grid-cols-2" style={{ border: "1px solid rgba(255,244,227,0.14)" }}>
                <div className="p-6 md:p-9" style={{ borderBottom: "1px solid rgba(255,244,227,0.14)" }}>
                    <div className="mb-4 flex items-center gap-3 text-[10px] uppercase md:text-xs" style={eyebrow}>
                        <span style={{ color: W.ink }}>Real life</span>
                        <span style={{ opacity: 0.55 }}>Already true before we showed up</span>
                    </div>
                    <h2 className="uppercase" style={{ fontFamily: W.display, color: W.cream, fontSize: "clamp(1.5rem, 3.4vw, 2.4rem)", lineHeight: 0.98 }}>
                        He had already collabed with
                    </h2>
                    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                        {items.map((item) => (
                            <li key={item} className="flex items-center gap-1.5">
                                <span className="inline-flex"><InkCheck color={W.ink} /></span>
                                <span className="uppercase" style={{ fontFamily: W.display, color: W.cream, fontSize: "clamp(1.1rem, 2.4vw, 1.6rem)", lineHeight: 1 }}>
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative p-6 md:p-9 md:border-l" style={{ borderColor: "rgba(255,244,227,0.14)" }}>
                    <div className="mb-4 flex items-center gap-3 text-[10px] uppercase md:text-xs" style={eyebrow}>
                        <span style={{ color: W.ink }}>The old site</span>
                        <span style={{ opacity: 0.55 }}>What a visitor could see</span>
                    </div>
                    <h2 className="uppercase" style={{ fontFamily: W.display, color: W.cream, fontSize: "clamp(1.5rem, 3.4vw, 2.4rem)", lineHeight: 0.98 }}>
                        None of it.
                    </h2>
                    <div className="mt-5 flex items-center gap-4">
                        <span className="relative block w-[42%] shrink-0 overflow-hidden rounded-md" style={{ border: "1px solid rgba(255,244,227,0.14)" }}>
                            <Image src={oldFrame} alt="The old site's lookbook page" width={0} height={0} sizes="240px" style={{ width: "100%", height: "auto", display: "block", opacity: 0.55 }} />
                            <span className="absolute inset-0 flex items-center justify-center">
                                <svg viewBox="0 0 40 40" aria-hidden fill="none" className="h-14 w-14 md:h-20 md:w-20">
                                    <path d="M8,8 C16,15 24,26 32,33" stroke={W.ink} strokeWidth="3.4" strokeLinecap="round" />
                                    <path d="M32,8 C25,16 16,25 8,32" stroke={W.ink} strokeWidth="3.4" strokeLinecap="round" />
                                </svg>
                            </span>
                        </span>
                        <HandNote className="text-[1.2rem] leading-tight md:text-[1.45rem]" tilt={1.2}>
                            not one logo. not one story. just a flat gallery.
                        </HandNote>
                    </div>
                </div>
            </Rise>
        </section>
    );
}

export function SectionHead({
    index,
    label,
    title,
    note,
    children,
}: {
    index: string;
    label: string;
    title: string;
    note?: string;
    children?: React.ReactNode;
}) {
    return (
        <Rise as="header" className="mb-12 md:mb-16">
            <div
                className="mb-5 flex items-center gap-3 text-[10px] uppercase md:text-xs"
                style={{ fontFamily: W.label, letterSpacing: "0.22em", color: W.cream }}
            >
                <span style={{ color: W.ink }}>{index}</span>
                <span style={{ opacity: 0.55 }}>{label}</span>
            </div>

            <h2
                className="uppercase"
                style={{
                    fontFamily: W.display,
                    color: W.cream,
                    fontSize: "clamp(2rem, 7vw, 4.5rem)",
                    lineHeight: 0.95,
                }}
            >
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
                <p className="mt-6 max-w-2xl text-base leading-relaxed md:text-lg" style={{ fontFamily: W.body, color: W.cream, opacity: 0.78 }}>
                    {children}
                </p>
            )}
        </Rise>
    );
}

export function Principles({ items }: { items: string[] }) {
    return (
        <div className="flex flex-col">
            {items.map((item, i) => (
                <Rise
                    key={item}
                    delay={(i % 2) * 0.06}
                    className="border-t py-7 md:py-9"
                    style={{ borderColor: "rgba(255,244,227,0.14)" }}
                >
                    <h3
                        className="uppercase"
                        style={{ fontFamily: W.display, color: W.cream, fontSize: "clamp(1.7rem, 5vw, 3.6rem)", lineHeight: 0.98 }}
                    >
                        {item}
                    </h3>
                </Rise>
            ))}
        </div>
    );
}

/** Section 04, literally: a cream ticket itemizing what shipped. */
export function Receipt({ items, note }: { items: string[]; note: string }) {
    const zig = (dir: "top" | "bottom") => ({
        height: 12,
        backgroundColor: "transparent",
        backgroundImage:
            dir === "top"
                ? `linear-gradient(135deg, transparent 6px, ${W.cream} 6px), linear-gradient(225deg, transparent 6px, ${W.cream} 6px)`
                : `linear-gradient(45deg, transparent 6px, ${W.cream} 6px), linear-gradient(315deg, transparent 6px, ${W.cream} 6px)`,
        backgroundPosition: "left top",
        backgroundSize: "12px 12px",
        backgroundRepeat: "repeat-x",
    });
    const mono = { fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace" } as const;

    return (
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,480px)_1fr] lg:gap-16">
            <Rise className="w-full max-w-[480px]">
                <div style={zig("top")} />
                <div className="px-6 py-6 md:px-8 md:py-7" style={{ backgroundColor: W.cream, color: "#3B2114" }}>
                    <div className="flex items-start justify-between gap-6">
                        <div className="w-[96px] md:w-[112px]">
                            <WisdmLogo color={W.red} />
                        </div>
                        <div className="text-right text-[10px] uppercase leading-relaxed" style={{ ...mono, letterSpacing: "0.12em", opacity: 0.7 }}>
                            Range of View
                            <br />
                            Job: full rebuild
                            <br />
                            Platform: Shopify
                        </div>
                    </div>

                    <div className="my-5 border-t border-dashed" style={{ borderColor: "rgba(59,33,20,0.35)" }} />

                    <ul className="flex flex-col gap-2.5">
                        {items.map((item) => (
                            <li key={item} className="flex items-baseline gap-2 text-[13px] leading-snug md:text-sm" style={mono}>
                                <span className="min-w-0">{item}</span>
                                <span className="mx-1 flex-1 border-b border-dotted" style={{ borderColor: "rgba(59,33,20,0.45)", transform: "translateY(-4px)" }} />
                                <span style={{ fontFamily: W.hand, fontWeight: 600, color: W.red, fontSize: "1.25rem", lineHeight: 1 }}>✓</span>
                            </li>
                        ))}
                    </ul>

                    <div className="my-5 border-t border-dashed" style={{ borderColor: "rgba(59,33,20,0.35)" }} />

                    <div className="relative flex items-center justify-between">
                        <span className="text-xs uppercase" style={{ ...mono, letterSpacing: "0.14em" }}>
                            Items: {items.length}
                        </span>
                        <span
                            className="rounded-sm border-2 px-3 py-1 text-[1.35rem] leading-none md:text-[1.6rem]"
                            style={{ fontFamily: W.hand, fontWeight: 700, color: W.red, borderColor: W.red, transform: "rotate(-7deg)", opacity: 0.9 }}
                        >
                            shipped
                        </span>
                    </div>
                </div>
                <div style={zig("bottom")} />
            </Rise>

            <Rise delay={0.08} className="lg:pt-6">
                <h3 className="uppercase" style={{ fontFamily: W.display, color: W.cream, fontSize: "clamp(1.8rem, 4.6vw, 3.4rem)", lineHeight: 0.98 }}>
                    Eight things shipped.
                    <br />
                    Zero templates.
                </h3>
                <div className="mt-6">
                    <HandNote className="text-[1.35rem] leading-tight md:text-[1.7rem]">{note}</HandNote>
                </div>
            </Rise>
        </div>
    );
}

/** The one cream ground on the page, so the crimson logo lands as ink. */
export function ClosingCTA() {
    return (
        <Rise as="section" className="relative overflow-hidden" style={{ backgroundColor: W.cream }}>
            <div className="mx-auto w-full max-w-5xl px-5 py-16 md:px-10 md:py-24">
                <div className="mx-auto mb-10 w-[min(78vw,420px)] md:mb-14 md:w-[520px]">
                    <WisdmLogo color={W.red} />
                </div>

                <h2
                    className="text-center uppercase"
                    style={{ fontFamily: W.display, color: W.red, fontSize: "clamp(1.9rem, 6.5vw, 4rem)", lineHeight: 0.98 }}
                >
                    Got a store that sells
                    <br />
                    less than it should?
                </h2>

                <p className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed md:text-lg" style={{ fontFamily: W.body, color: "#3B2114" }}>
                    We audit the whole thing frame by frame, then rebuild it so it sells without going quiet.
                </p>

                <div className="mt-9 flex flex-col items-center gap-5">
                    <a
                        href="/#contact"
                        className="inline-flex items-center gap-3 rounded-full px-8 py-4 transition-transform duration-300 hover:scale-[1.03]"
                        style={{ backgroundColor: W.red }}
                    >
                        <span className="text-xs uppercase md:text-sm" style={{ fontFamily: W.label, letterSpacing: "0.16em", color: W.cream, fontWeight: 600 }}>
                            Start a project
                        </span>
                    </a>
                    <a
                        href="/works"
                        className="text-[11px] uppercase underline-offset-4 hover:underline md:text-xs"
                        style={{ fontFamily: W.label, letterSpacing: "0.18em", color: "#3B2114", opacity: 0.7 }}
                    >
                        Or see more work first
                    </a>
                </div>
            </div>
        </Rise>
    );
}

/** Full-bleed highlight: one big frame and a short claim, alternating sides. */
export function FeatureRow({
    kicker,
    title,
    body,
    src,
    flip = false,
    index,
}: {
    kicker: string;
    title: string;
    body: string;
    src: string;
    flip?: boolean;
    index: number;
}) {
    return (
        <Rise delay={0.05} className={`grid grid-cols-1 items-center gap-6 md:gap-12 lg:grid-cols-[1.35fr_1fr] ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div
                className="relative overflow-hidden rounded-xl"
                style={{ border: "1px solid rgba(255,244,227,0.14)", backgroundColor: "rgba(255,244,227,0.03)" }}
            >
                <Image src={src} alt={title} width={0} height={0} sizes="(max-width: 1024px) 100vw, 60vw" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
            <div>
                <div
                    className="mb-4 flex items-center gap-3 text-[10px] uppercase md:text-xs"
                    style={{ fontFamily: W.label, letterSpacing: "0.22em", color: W.cream }}
                >
                    <span style={{ color: W.ink }}>{String(index).padStart(2, "0")}</span>
                    <span style={{ opacity: 0.55 }}>{kicker}</span>
                </div>
                <h3
                    className="uppercase"
                    style={{ fontFamily: W.display, color: W.cream, fontSize: "clamp(1.7rem, 4.5vw, 3rem)", lineHeight: 0.98 }}
                >
                    {title}
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed md:text-lg" style={{ fontFamily: W.body, color: W.cream, opacity: 0.78 }}>
                    {body}
                </p>
            </div>
        </Rise>
    );
}

type ArchNode = { id: string; label: string; desc: string };

const ARCH_HUB: ArchNode = {
    id: "shop",
    label: "Home + Shop",
    desc: "Landing and the product grid merged into one scroll. Every other page on the site branches out from here, and every branch leads back.",
};

const ARCH_SPOKES: ArchNode[] = [
    { id: "story", label: "Story", desc: "The collab timeline. Nike, SCAD, Drake, Nordstrom, in order, revealed on scroll instead of flattened into one gallery." },
    { id: "iwecs", label: "I Wish Everybody Could See", desc: "Fans submit their own photos in the frames and get tagged, like a real social feed. The community runs the lookbook now." },
    { id: "arcade", label: "The Arcade", desc: "Pop a balloon, win 15% off. A custom minigame standing in for a coupon field." },
    { id: "info", label: "Info", desc: "FAQs, contact, and the brand films leading the hero, instead of filed away behind a tab." },
    { id: "press", label: "Press", desc: "Every article and mention in one place, built for SEO and backlinks." },
    { id: "cart", label: "Checkout", desc: "Native Shopify checkout. However someone arrives, the cart in the corner funnels them here." },
];

const ARCH_ALL = [ARCH_HUB, ...ARCH_SPOKES];

/**
 * Section 04's showcase: the new sitemap as a hub-and-spoke diagram instead
 * of a static list. Home+Shop sits in the center since the rebuild's whole
 * point was merging those two into one flow; everything else branches out
 * and funnels back to Checkout. Autoplays through the spokes, pauses on
 * hover, and mobile gets a stacked accordion instead of the radial layout.
 */
export function SiteArchitecture() {
    const [active, setActive] = useState<string>(ARCH_SPOKES[0].id);
    const [paused, setPaused] = useState(false);
    const [mobileOpen, setMobileOpen] = useState<string>(ARCH_SPOKES[0].id);
    const reduced = useReducedMotion();

    useEffect(() => {
        if (paused || reduced) return;
        const id = setInterval(() => {
            setActive((cur) => {
                const i = ARCH_SPOKES.findIndex((n) => n.id === cur);
                return ARCH_SPOKES[(i + 1) % ARCH_SPOKES.length].id;
            });
        }, 2600);
        return () => clearInterval(id);
    }, [paused, reduced]);

    const activeNode = ARCH_ALL.find((n) => n.id === active) ?? ARCH_HUB;
    const radius = 38;
    const positions = ARCH_SPOKES.map((n, i) => {
        const angle = (-90 + (360 / ARCH_SPOKES.length) * i) * (Math.PI / 180);
        return { id: n.id, x: 50 + radius * Math.cos(angle), y: 50 + radius * Math.sin(angle) };
    });

    return (
        <Rise className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
            {/* Desktop radial map */}
            <div
                className="relative mx-auto hidden aspect-square w-full max-w-[520px] md:block"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
                    {positions.map((p) => {
                        const isActive = p.id === active;
                        return (
                            <line
                                key={p.id}
                                x1={50}
                                y1={50}
                                x2={p.x}
                                y2={p.y}
                                stroke={isActive ? W.ink : "rgba(255,244,227,0.18)"}
                                strokeWidth={isActive ? 0.6 : 0.35}
                                vectorEffect="non-scaling-stroke"
                            />
                        );
                    })}
                    {!reduced &&
                        positions
                            .filter((p) => p.id === active)
                            .map((p) => (
                                <motion.circle
                                    key={`pulse-${p.id}`}
                                    r={1.5}
                                    fill={W.ink}
                                    initial={{ opacity: 0 }}
                                    animate={{ cx: [50, p.x], cy: [50, p.y], opacity: [0, 1, 0] }}
                                    transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut" }}
                                />
                            ))}
                </svg>

                <button
                    type="button"
                    onClick={() => setActive("shop")}
                    className="absolute flex flex-col items-center justify-center rounded-full text-center transition-shadow duration-300"
                    style={{
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "27%",
                        aspectRatio: "1 / 1",
                        backgroundColor: W.ink,
                        boxShadow: active === "shop" ? "0 0 0 8px rgba(232,56,48,0.2)" : "0 0 0 6px rgba(232,56,48,0.12)",
                    }}
                >
                    <span
                        className="px-2 text-[10px] uppercase leading-tight md:text-xs"
                        style={{ fontFamily: W.label, letterSpacing: "0.08em", color: W.cream, fontWeight: 600 }}
                    >
                        Home + Shop
                    </span>
                </button>

                {positions.map((p, i) => {
                    const node = ARCH_SPOKES[i];
                    const isActive = p.id === active;
                    return (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => setActive(p.id)}
                            onFocus={() => setActive(p.id)}
                            className="absolute flex items-center justify-center rounded-full px-3 py-2 text-center transition-all duration-300"
                            style={{
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                transform: "translate(-50%, -50%)",
                                minWidth: 100,
                                backgroundColor: isActive ? W.ink : "rgba(255,244,227,0.06)",
                                border: `1px solid ${isActive ? W.ink : "rgba(255,244,227,0.18)"}`,
                            }}
                        >
                            <span
                                className="text-[10px] uppercase leading-tight md:text-[11px]"
                                style={{ fontFamily: W.label, letterSpacing: "0.08em", color: W.cream, opacity: isActive ? 1 : 0.75 }}
                            >
                                {node.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Mobile stacked accordion */}
            <div className="flex flex-col gap-2 md:hidden">
                {ARCH_ALL.map((node) => {
                    const isOpen = node.id === mobileOpen;
                    const isHub = node.id === "shop";
                    return (
                        <button
                            key={node.id}
                            type="button"
                            onClick={() => setMobileOpen(isOpen ? "" : node.id)}
                            className="flex flex-col rounded-lg px-4 py-3 text-left transition-colors"
                            style={{
                                border: `1px solid ${isOpen ? W.ink : "rgba(255,244,227,0.14)"}`,
                                backgroundColor: isOpen ? "rgba(232,56,48,0.10)" : isHub ? "rgba(232,56,48,0.06)" : "rgba(255,244,227,0.03)",
                            }}
                        >
                            <span className="flex items-center gap-2 text-xs uppercase" style={{ fontFamily: W.label, letterSpacing: "0.12em", color: W.cream }}>
                                {isHub && <span style={{ color: W.ink }}>Hub</span>}
                                {node.label}
                            </span>
                            {isOpen && (
                                <span className="mt-2 text-sm leading-relaxed" style={{ fontFamily: W.body, color: W.cream, opacity: 0.78 }}>
                                    {node.desc}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Description panel, desktop only, the map speaks for itself on mobile */}
            <div className="hidden md:block">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeNode.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="mb-3 flex items-center gap-3 text-[10px] uppercase md:text-xs" style={{ fontFamily: W.label, letterSpacing: "0.22em", color: W.cream }}>
                            <span style={{ color: W.ink }}>{activeNode.id === "shop" ? "The hub" : "Now viewing"}</span>
                        </div>
                        <h3 className="uppercase" style={{ fontFamily: W.display, color: W.cream, fontSize: "clamp(1.6rem, 3.6vw, 2.6rem)", lineHeight: 1 }}>
                            {activeNode.label}
                        </h3>
                        <p className="mt-4 max-w-md text-base leading-relaxed md:text-lg" style={{ fontFamily: W.body, color: W.cream, opacity: 0.78 }}>
                            {activeNode.desc}
                        </p>
                    </motion.div>
                </AnimatePresence>
                <p className="mt-8 text-[11px] uppercase" style={{ fontFamily: W.label, letterSpacing: "0.16em", color: W.cream, opacity: 0.4 }}>
                    Click any page, or let it cycle
                </p>
            </div>
        </Rise>
    );
}

/** Desktop-only sticky index. Lights whichever section owns the middle of the screen. */
export function SectionIndex({ items }: { items: { id: string; label: string }[] }) {
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
        <nav
            aria-label="Sections"
            className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 2xl:flex"
        >
            {items.map((item, i) => {
                const on = item.id === active;
                return (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="group flex items-center gap-3 text-[10px] uppercase transition-opacity"
                        style={{ fontFamily: W.label, letterSpacing: "0.2em", color: on ? W.ink : W.cream, opacity: on ? 1 : 0.4 }}
                    >
                        <span className="w-6 text-right tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                        <span
                            className="h-px transition-all"
                            style={{ width: on ? 28 : 12, backgroundColor: on ? W.ink : W.cream }}
                        />
                        <span className="opacity-0 transition-opacity group-hover:opacity-100" style={{ opacity: on ? 1 : undefined }}>
                            {item.label}
                        </span>
                    </a>
                );
            })}
        </nav>
    );
}
