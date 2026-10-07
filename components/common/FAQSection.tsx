"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export type FaqItem = {
    question: string;
    answer: string;
};

interface FAQSectionProps {
    items: FaqItem[];
}

export default function FAQSection({ items }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="relative w-full bg-black py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
            {/* Gradient Blob - Top Right */}
            <div
                className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[700px] lg:h-[700px] rounded-full pointer-events-none"
                style={{
                    background: 'rgba(96, 62, 37, 0.60)',
                    filter: 'blur(200px)',
                    transform: 'translate(20%, -20%)'
                }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Side - FAQ Title and CTA Card */}
                    <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-8">
                        <h2
                            className="type-mega"
                            style={{
                                color: "#FFF4E3"
                            }}
                        >
                            FAQ
                        </h2>

                        {/* Still Have Questions Card */}
                        <div
                            className="rounded-3xl p-6 md:p-8 space-y-6"
                            style={{ background: "#7F5230" }}
                        >
                            <div>
                                <h3
                                    className="type-h3 mb-3"
                                    style={{ color: "#FFF4E3" }}
                                >
                                    Still have questions?
                                </h3>
                                <p
                                    className="type-body"
                                    style={{ color: "#FFF4E3", opacity: 0.9 }}
                                >
                                    Let&apos;s discuss your project and bring your vision to life.
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center flex-shrink-0 -space-x-4">
                                    <div
                                        className="w-12 h-12 md:w-14 md:h-14 rounded-full"
                                        style={{
                                            border: "2px solid rgba(255, 244, 227, 0.4)",
                                            background: "transparent"
                                        }}
                                    />
                                    <a
                                        href="https://cal.com/rov-studios-imhphw/15min"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-full bg-[#FFF4E3] flex items-center justify-center hover:scale-110 transition-transform relative z-10"
                                        aria-label="Get started"
                                    >
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5 md:w-6 md:h-6"
                                        >
                                            <path
                                                d="M5 12H19M19 12L12 5M19 12L12 19"
                                                stroke="#000"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </a>
                                    <div
                                        className="w-12 h-12 md:w-14 md:h-14 rounded-full"
                                        style={{
                                            border: "2px solid rgba(255, 244, 227, 0.4)",
                                            background: "transparent"
                                        }}
                                    />
                                </div>

                                <a
                                    href="https://cal.com/rov-studios-imhphw/15min"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="type-btn cta-shine flex-1 px-6 py-3.5 md:px-8 md:py-4 rounded-full hover:scale-[1.02] transition-transform flex items-center justify-center"
                                    style={{
                                        background: "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
                                        boxShadow: "3px 4px 4px 0 rgba(255,244,227,0.15) inset, 0 4px 14px rgba(0,0,0,0.3)",
                                        color: "#FFF4E3"
                                    }}
                                >
                                    LET&apos;S CREATE!
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - FAQ Items */}
                    <div className="lg:col-span-7 space-y-4">
                        {items.map((item, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <div
                                    key={index}
                                    className="border overflow-hidden transition-all duration-300"
                                    style={{
                                        borderRadius: "20px",
                                        borderColor: "rgba(255, 255, 255, 0.15)",
                                        background: "rgba(59, 33, 20, 0.35)",
                                    }}
                                >
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex justify-between items-center text-left px-6 md:px-8 py-5 md:py-6 cursor-pointer group"
                                    >
                                        <span
                                            className="type-h4 normal-case pr-4"
                                            style={{ color: "#FFF4E3" }}
                                        >
                                            {item.question}
                                        </span>
                                        <motion.div
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="flex-shrink-0"
                                        >
                                            <ChevronDown
                                                className="w-6 h-6 md:w-7 md:h-7"
                                                style={{ color: isOpen ? "#957E5E" : "#FFF4E3" }}
                                            />
                                        </motion.div>
                                    </button>

                                    {/* Answer is ALWAYS rendered (collapsed with a CSS grid-rows
                                        transition, not unmounted) so the text is in the
                                        server-rendered DOM for crawlers and AI answer engines.
                                        Pure CSS = no client-measured styles, so no hydration
                                        mismatch. */}
                                    <div
                                        className="grid transition-[grid-template-rows] duration-300 ease-out"
                                        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                                                <p
                                                    className="type-lead"
                                                    style={{ color: "#FFF4E3", opacity: 0.85 }}
                                                >
                                                    {item.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
