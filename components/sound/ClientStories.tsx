"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { ClientStory, Testimonial } from "@/data/testimonials";
import { M } from "@/components/sound/musicStory";


type Card = { name: string; role: string; work?: string; quote: string; image?: string; href?: string };

// The carousel above shows one quote at a time. This is the button under it
// that opens every client story at once, as a grid of small cards: named
// stories first, then the short carousel quotes so nothing is lost.
export default function ClientStories({
  stories,
  extra = [],
}: {
  stories: ClientStory[];
  extra?: Testimonial[];
}) {
  const [open, setOpen] = useState(false);

  const cards: Card[] = [
    ...stories.filter((s) => s.quote.trim()),
    ...extra.map((t) => ({ name: t.name, role: t.role, work: t.impactStat, quote: t.quote, image: t.image })),
  ];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!cards.length) return null;

  return (
    <>
      <div className="relative z-10 mt-12 flex justify-center md:mt-16">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="type-btn cta-shine group inline-flex items-center gap-2.5 rounded-full py-3.5 pl-6 pr-5 transition-transform duration-300 hover:scale-105"
          style={{ color: M.cream, background: M.inkGradient, boxShadow: M.ctaShadow }}
        >
          See every client story
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Client stories"
            className="fixed inset-0 z-[100] overflow-y-auto bg-black/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-10 flex items-end justify-between gap-6">
                <div>
                  <p className="type-eyebrow text-[#EA9A61]">
                    In their words
                  </p>
                  <h2 className="type-h2 mt-3 text-white">
                    Every client story
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-[#EA9A61] hover:text-[#EA9A61]"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                    <path d="M3 3l10 10M13 3L3 13" />
                  </svg>
                </button>
              </div>

              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((c) => (
                  <li
                    key={c.name}
                    className="flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-[#0d0b09] p-6"
                  >
                    <p className="type-body text-white/85">
                      &ldquo;{c.quote}&rdquo;
                    </p>
                    <div className="mt-auto flex items-center gap-3 border-t border-white/[0.07] pt-5">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#EA9A61]/25 bg-[#EA9A61]/10 type-tag text-[#EA9A61]"
                      >
                        {c.image ? (
                          <Image src={c.image} alt={c.name} width={44} height={44} className="h-full w-full object-cover" />
                        ) : (
                          c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="type-name text-white">{c.name}</p>
                        <p className="type-meta mt-0.5 text-white/45">
                          {c.role}
                        </p>
                      </div>
                    </div>
                    {(c.work || c.href) && (
                      <div className="type-caption -mt-1 flex flex-wrap items-center justify-between gap-2">
                        {c.work && <span className="text-white/50">{c.work}</span>}
                        {c.href && (
                          <a
                            href={c.href}
                            className="text-[#EA9A61] underline decoration-[#EA9A61]/40 underline-offset-2 hover:decoration-[#EA9A61]"
                          >
                            Read the case study &rarr;
                          </a>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
