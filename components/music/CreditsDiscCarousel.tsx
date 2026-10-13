"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import DiscCascadeCarousel, {
    type DiscCascadeHandle,
    type DiscCascadeItem,
} from "@/components/ui/disc-cascade-carousel";

// rovmusic.com/credits: the discography as a sticky scroll carousel. The
// section is tall, the stage inside it is pinned, and vertical scroll drives
// the carousel. Dragging, arrows and the Records menu drive it too, and move
// the page to match, so scroll position and chosen disc never disagree.
//
// Smoothness: scroll sets a fractional position straight on the carousel's
// springs (no React render per frame), and when scrolling stops the page
// settles onto the nearest disc.

type CreditInput = {
    title: string;
    artist: string;
    role: string;
    cover: string;
    spotifyUrl: string;
};

// Scroll distance per disc, in viewport heights.
const VH_PER_DISC = 0.6;
// Quiet time after the last scroll event before the page settles on a disc.
const SETTLE_MS = 140;

// "Artist development, produced, written, composed, mixed and mastered" reads
// better stacked than as one long line in the narrow credits column.
function roleLines(role: string): string[] {
    const parts = role
        .replace(/ and /g, ", ")
        .split(",")
        .map((p) => p.trim().toLowerCase())
        .filter(Boolean);
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const make = parts.filter((p) => ["produced", "written", "composed"].includes(p));
    const finish = parts.filter((p) => ["mixed", "mastered"].includes(p));
    const rest = parts.filter((p) => !make.includes(p) && !finish.includes(p));
    return [
        ...rest.map(cap),
        ...(make.length ? [make.map(cap).join(" · ")] : []),
        ...(finish.length ? [finish.map(cap).join(" · ")] : []),
    ];
}

export default function CreditsDiscCarousel({ credits }: { credits: CreditInput[] }) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const carousel = useRef<DiscCascadeHandle | null>(null);
    // The disc the scroll position currently means, so a change that came from
    // the scroll isn't echoed back as a scroll.
    const fromScroll = useRef(0);
    const n = credits.length;

    const items: DiscCascadeItem[] = useMemo(
        () =>
            credits.map((c) => ({
                title: c.title,
                src: c.cover,
                alt: `${c.title} by ${c.artist}`,
                // Real cover art carries its own type, so the disc prints nothing over it.
                label: "",
                fine: "",
                credits: [
                    { label: "Artist", value: c.artist },
                    { label: "Credit", value: roleLines(c.role) },
                    { label: "Listen", value: "Spotify" },
                ],
            })),
        [credits],
    );

    // Page scroll Y at which disc i is centred.
    const topFor = useCallback(
        (i: number) => {
            const el = sectionRef.current;
            if (!el || n < 2) return 0;
            const span = el.offsetHeight - window.innerHeight;
            return el.getBoundingClientRect().top + window.scrollY + (i / (n - 1)) * span;
        },
        [n],
    );

    useEffect(() => {
        if (n < 2) return;
        let raf = 0;
        let settle = 0;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

        const progress = () => {
            const el = sectionRef.current;
            if (!el) return null;
            const rect = el.getBoundingClientRect();
            const span = rect.height - window.innerHeight;
            if (span <= 0) return null;
            return { p: Math.min(Math.max(-rect.top / span, 0), 1), inside: rect.top <= 0 && rect.bottom >= window.innerHeight };
        };

        const measure = () => {
            raf = 0;
            const m = progress();
            if (!m) return;
            const pos = m.p * (n - 1);
            fromScroll.current = Math.round(pos);
            carousel.current?.moveTo(pos);
        };

        const settleOnDisc = () => {
            const m = progress();
            if (!m || !m.inside) return;
            const target = topFor(Math.round(m.p * (n - 1)));
            if (Math.abs(target - window.scrollY) > 2) {
                window.scrollTo({ top: target, behavior: reduce.matches ? "auto" : "smooth" });
            }
        };

        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(measure);
            window.clearTimeout(settle);
            settle = window.setTimeout(settleOnDisc, SETTLE_MS);
        };

        measure();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (raf) cancelAnimationFrame(raf);
            window.clearTimeout(settle);
        };
    }, [n, topFor]);

    // A drag, arrow or menu pick: bring the page to that disc's scroll position.
    const onIndexChange = useCallback(
        (i: number) => {
            if (i === fromScroll.current || n < 2) return;
            fromScroll.current = i;
            window.scrollTo({ top: topFor(i), behavior: "auto" });
        },
        [n, topFor],
    );

    return (
        <section
            ref={sectionRef}
            aria-label="Discography"
            style={{ height: `calc(100svh + ${Math.max(n - 1, 0) * VH_PER_DISC * 100}svh)` }}
            className="relative"
        >
            <div className="sticky top-0 h-[100svh]">
                <DiscCascadeCarousel
                    ref={carousel}
                    items={items}
                    defaultIndex={0}
                    onIndexChange={onIndexChange}
                    onSelect={(_, i) => window.open(credits[i].spotifyUrl, "_blank", "noopener,noreferrer")}
                    height="100svh"
                    indexLabel="Records"
                    reviews={false}
                    hint="Scroll or drag · click a disc to listen"
                    background="#000"
                    color="#ffffff"
                    serif="Norwige, sans-serif"
                    sans="'Roboto', sans-serif"
                    display="Norwige, sans-serif"
                    ariaLabel="Records mixed and mastered at Range of View Music"
                />
            </div>
            {/* Crawlable, keyboard-reachable links to every release. */}
            <ul className="sr-only">
                {credits.map((c) => (
                    <li key={c.spotifyUrl}>
                        <a href={c.spotifyUrl} target="_blank" rel="noopener noreferrer">
                            {c.title} by {c.artist}, {c.role}
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
}
