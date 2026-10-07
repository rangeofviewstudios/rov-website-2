"use client";

import { useEffect, useState } from "react";

// Sticky step bar for /toolkit. Seven stages over ~6000px is long enough that
// people lose their place, so this stays pinned under the top of the viewport
// and highlights the stage currently on screen. Pure anchors underneath, so it
// still works as plain jump links with JS off.

export default function StageNav({ stages }: { stages: { step: string; name: string }[] }) {
    const [active, setActive] = useState<string | null>(null);

    useEffect(() => {
        const els = stages
            .map((s) => document.getElementById(`stage-${s.step}`))
            .filter((el): el is HTMLElement => !!el);
        if (!els.length) return;

        // A stage counts as current once its top passes ~40% down the screen.
        const io = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting);
                if (visible.length) {
                    const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
                    setActive(top.target.id.replace("stage-", ""));
                }
            },
            { rootMargin: "-40% 0px -55% 0px" },
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [stages]);

    return (
        <nav aria-label="Process stages" className="sticky top-0 z-30 -mx-6 border-b border-white/10 bg-black/80 px-6 backdrop-blur-md">
            <ol className="mx-auto flex max-w-6xl gap-2 overflow-x-auto py-3 pr-28 [scrollbar-width:none] md:pr-36">
                {stages.map((s) => {
                    const on = s.step === active;
                    return (
                        <li key={s.step} className="shrink-0">
                            <a
                                href={`#stage-${s.step}`}
                                aria-current={on ? "step" : undefined}
                                className="type-tag inline-flex items-center gap-2 rounded-full px-3.5 py-2 transition-colors duration-300"
                                style={{
                                    color: on ? "#0B0603" : "#FFF4E3",
                                    background: on ? "#EA9A61" : "rgba(8,5,3,0.78)",
                                    border: `1px solid ${on ? "#EA9A61" : "rgba(234,154,97,0.35)"}`,
                                }}
                            >
                                <span style={{ color: on ? "#0B0603" : "#EA9A61" }}>{s.step}</span>
                                {s.name}
                            </a>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
