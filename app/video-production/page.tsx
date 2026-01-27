"use client";

import { NavigationDock } from "@/components/NavDoc";
import Footer from "@/components/Footer";
import OurApproachSection from "@/components/Web-Dev/OurApproachSection";
import FAQBottomSection from "@/components/Web-Dev/FAQBottomSection";
import ProjectStrip from "@/components/ProjectStrip";
import { useState } from "react";

export default function VideoProductionPage() {
    const [activeCategory, setActiveCategory] = useState<string>("real-estate");

    const categories = [
        { id: "real-estate", label: "REAL ESTATE" },
        { id: "misc", label: "MISC" },
        { id: "creative", label: "CREATIVE PROJECTS" },
        { id: "events", label: "EVENT PLANNING", loading: true },
    ];

    return (
        <main className="relative min-h-screen bg-black text-white">
            <NavigationDock />

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col justify-between px-6 md:px-12 lg:px-16 py-20 pt-32">
                {/* Top Section - Headline and Tagline */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start gap-8 mb-20">
                    {/* Left - Main Headline */}
                    <div className="flex-1">
                        <h1
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight"
                            style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic' }}
                        >
                            Turn moments into{" "}
                            <span className="relative inline-flex items-center gap-3">
                                <span
                                    className="px-5 py-1 rounded-full font-medium"
                                    style={{
                                        background: 'linear-gradient(135deg, #8B6F47 0%, #6B5437 100%)',
                                        fontFamily: 'Norwige, sans-serif',
                                        fontStyle: 'normal'
                                    }}
                                >
                                    powerful
                                </span>
                                {/* Decorative Circle */}
                                <span
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] border-white/80 inline-flex"
                                    style={{ background: 'transparent' }}
                                />
                            </span>
                            <br />
                            visuals
                        </h1>
                    </div>

                    {/* Right - Tagline */}
                    <div className="lg:max-w-md">
                        <p
                            className="text-sm md:text-base leading-relaxed"
                            style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic' }}
                        >
                            We craft cinematic video content that brings stories to life and leaves a lasting impression.
                        </p>
                    </div>
                </div>

                {/* Bottom Section - What We Capture */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Left - Categories */}
                    <div>
                        <h2
                            className="text-5xl md:text-6xl lg:text-7xl font-light mb-12 leading-tight"
                            style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic' }}
                        >
                            What We
                            <br />
                            Capture
                        </h2>

                        {/* Category Pills - Custom Layout */}
                        <div className="flex flex-col gap-4 max-w-lg">
                            {/* First Row - REAL ESTATE and MISC */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setActiveCategory("real-estate")}
                                    className={`
                                        px-6 py-4 font-medium text-sm md:text-base
                                        transition-all duration-300 ease-out
                                        ${activeCategory === "real-estate"
                                            ? 'bg-[#8B6F47] text-white opacity-100'
                                            : 'text-gray-400'
                                        }
                                    `}
                                    style={{
                                        fontFamily: 'Norwige, sans-serif',
                                        borderRadius: '40px',
                                        opacity: activeCategory === "real-estate" ? 1 : 0.6,
                                        background: activeCategory === "real-estate" ? '#8B6F47' : 'rgba(59, 33, 20, 0.30)'
                                    }}
                                >
                                    REAL ESTATE
                                </button>
                                <button
                                    onClick={() => setActiveCategory("misc")}
                                    className={`
                                        px-6 py-4 font-medium text-sm md:text-base
                                        transition-all duration-300 ease-out
                                        ${activeCategory === "misc"
                                            ? 'bg-[#8B6F47] text-white opacity-100'
                                            : 'text-gray-400'
                                        }
                                    `}
                                    style={{
                                        fontFamily: 'Norwige, sans-serif',
                                        borderRadius: '40px',
                                        opacity: activeCategory === "misc" ? 1 : 0.6,
                                        background: activeCategory === "misc" ? '#8B6F47' : 'rgba(59, 33, 20, 0.30)'
                                    }}
                                >
                                    MISC
                                </button>
                            </div>

                            {/* Second Row - CREATIVE PROJECTS */}
                            <button
                                onClick={() => setActiveCategory("creative")}
                                className={`
                                    px-6 py-4 font-medium text-sm md:text-base text-left
                                    transition-all duration-300 ease-out
                                    ${activeCategory === "creative"
                                        ? 'bg-[#8B6F47] text-white opacity-100'
                                        : 'text-gray-400'
                                    }
                                `}
                                style={{
                                    fontFamily: 'Norwige, sans-serif',
                                    borderRadius: '40px',
                                    opacity: activeCategory === "creative" ? 1 : 0.6,
                                    background: activeCategory === "creative" ? '#8B6F47' : 'rgba(59, 33, 20, 0.30)'
                                }}
                            >
                                CREATIVE PROJECTS
                            </button>

                            {/* Third Row - EVENT PLANNING with loading icon */}
                            <button
                                onClick={() => setActiveCategory("events")}
                                className={`
                                    px-6 py-4 font-medium text-sm md:text-base text-left
                                    transition-all duration-300 ease-out
                                    ${activeCategory === "events"
                                        ? 'bg-[#8B6F47] text-white opacity-100'
                                        : 'text-gray-400'
                                    }
                                `}
                                style={{
                                    fontFamily: 'Norwige, sans-serif',
                                    borderRadius: '40px',
                                    opacity: activeCategory === "events" ? 1 : 0.6,
                                    background: activeCategory === "events" ? '#8B6F47' : 'rgba(59, 33, 20, 0.30)'
                                }}
                            >
                                <span className="flex items-center gap-3">
                                    <span className="relative flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full border-2 border-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 border-2 border-white"></span>
                                    </span>
                                    EVENT PLANNING
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Right - Video Showcase */}
                    <div className="relative">
                        <div
                            className="relative w-full aspect-video rounded-3xl overflow-hidden group cursor-pointer"
                            style={{
                                background: 'linear-gradient(135deg, #4A4A4A 0%, #3A3A3A 100%)',
                            }}
                        >
                            {/* Placeholder - Empty for now */}
                            <div className="absolute inset-0" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Project Strip CTA */}
            <ProjectStrip />

            {/* Our Approach Section */}
            <OurApproachSection />

            {/* FAQ Section */}
            <FAQBottomSection />

            <Footer />
        </main>
    );
}
