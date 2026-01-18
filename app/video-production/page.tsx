"use client";
import { NavigationDock } from "@/components/NavDoc";
import Footer from "@/components/Footer";


export default function VideoProductionPage() {
    return (
        <main className="relative min-h-screen bg-black">
            <NavigationDock />

            {/* Hero Section with Background Image */}
            <section
                className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
                style={{
                    backgroundImage: `url('/casestudyheroimg.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60" />

                {/* Content */}
                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-tight">
                        <span
                            className="block"
                            style={{
                                fontFamily: "Sedgwick Ave Display, sans-serif",
                                color: "#C90000",
                                textShadow: "4px 4px 8px rgba(0, 0, 0, 0.8)"
                            }}
                        >
                            Crafting The
                        </span>
                        <span
                            className="block"
                            style={{
                                fontFamily: "Sedgwick Ave Display, sans-serif",
                                color: "#FFD600",
                                textShadow: "4px 4px 8px rgba(0, 0, 0, 0.8)"
                            }}
                        >
                            Bando's
                        </span>
                        <span
                            className="block"
                            style={{
                                fontFamily: "Sedgwick Ave Display, sans-serif",
                                color: "#C90000",
                                textShadow: "4px 4px 8px rgba(0, 0, 0, 0.8)"
                            }}
                        >
                            Online
                        </span>
                        <span
                            className="block"
                            style={{
                                fontFamily: "Sedgwick Ave Display, sans-serif",
                                color: "#C90000",
                                textShadow: "4px 4px 8px rgba(0, 0, 0, 0.8)"
                            }}
                        >
                            Experience
                        </span>
                    </h1>
                    {/* Arrow */}
                    <div className="mt-8">
                        <svg
                            width="60"
                            height="80"
                            viewBox="0 0 60 80"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-auto"
                        >
                            <path
                                d="M30 0 L30 60 M10 40 L30 60 L50 40"
                                stroke="#FF4444"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </section>

            {/* Case Study Section */}
            <section className="relative bg-black text-white py-16 px-6 md:px-12 lg:px-16">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="lg:sticky lg:top-24 lg:self-start w-full lg:w-48 flex-shrink-0">
                        <nav className="bg-[#2A2A2A] rounded-2xl p-4 space-y-2">
                            <button className="w-full text-left px-4 py-3 rounded-lg bg-[#C90000] text-white font-medium transition-all">
                                Overview
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#3A3A3A] text-gray-300 transition-all">
                                Research
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#3A3A3A] text-gray-300 transition-all">
                                Design System
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#3A3A3A] text-gray-300 transition-all">
                                Approach
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#3A3A3A] text-gray-300 transition-all">
                                Result
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 space-y-12">
                        {/* Overview Section */}
                        <div>
                            <h2
                                className="text-4xl md:text-5xl font-bold mb-6"
                                style={{
                                    fontFamily: 'Brush Script MT, cursive',
                                    color: '#C90000'
                                }}
                            >
                                Overview
                            </h2>
                            <p className="text-lg text-white leading-relaxed">
                                A digital redesign project for The Bando, a bold Black history museum and fried chicken restaurant in West Atlanta, bringing their unapologetic brand energy into an online experience.
                            </p>
                        </div>

                        {/* The Challenge Section */}
                        <div className="border border-gray-700 rounded-3xl p-8 md:p-10 bg-black/60">
                            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                                <h3
                                    className="text-4xl md:text-5xl font-bold whitespace-nowrap flex-shrink-0"
                                    style={{
                                        background: 'linear-gradient(180deg, rgba(215, 108, 0, 1) 0%, rgba(149, 50, 0, 1) 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}
                                >
                                    The Challenge
                                </h3>
                                <p
                                    className="text-base md:text-lg leading-relaxed"
                                    style={{
                                        background: 'linear-gradient(180deg, rgba(215, 108, 0, 1) 0%, rgba(149, 50, 0, 1) 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}
                                >
                                    The Bando's identity was powerful in person, but muted online. The site processed orders, but failed to capture the culture or keep people coming back.
                                </p>
                            </div>
                        </div>

                        {/* Competitor Analysis Section */}
                        <div>
                            <h3
                                className="text-4xl md:text-5xl font-bold mb-4"
                                style={{
                                    fontFamily: 'Brush Script MT, cursive',
                                    color: '#C90000'
                                }}
                            >
                                Competitor Analysis
                            </h3>
                            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                                To define The Bando's digital direction, we studied two Atlanta brands known for loud, fast-selling experiences. But was that enough?
                            </p>

                            {/* Competitor Logos */}
                            <div className="flex flex-wrap gap-6 mb-8 justify-start">
                                <div className="bg-white rounded-lg px-6 py-4 flex items-center justify-center min-w-[140px]">
                                    <span className="text-black font-bold italic text-xl" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                                        Slutty Vegan
                                    </span>
                                </div>
                                <div className="bg-white rounded-lg px-6 py-4 flex items-center justify-center min-w-[140px]">
                                    <span className="text-black font-bold text-sm tracking-wider">
                                        URBAN WINGS
                                    </span>
                                </div>
                                <div className="bg-white rounded-lg px-6 py-4 flex items-center justify-center min-w-[140px]">
                                    <span className="text-red-600 font-bold text-xl" style={{ fontFamily: 'Impact, sans-serif' }}>
                                        THE BANDO
                                    </span>
                                </div>
                            </div>

                            {/* Comparison Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="text-left py-4 px-4 text-gray-400 font-normal"></th>
                                            <th className="text-center py-4 px-4"></th>
                                            <th className="text-center py-4 px-4"></th>
                                            <th className="text-center py-4 px-4 bg-[#3A1A1A] rounded-t-lg"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-300">
                                        <tr className="border-b border-gray-800">
                                            <td className="py-4 px-4">Speed & Conversion</td>
                                            <td className="text-center py-4 px-4">
                                                <div className="w-3 h-3 bg-white rounded-full mx-auto"></div>
                                            </td>
                                            <td className="text-center py-4 px-4">
                                                <div className="w-3 h-3 bg-white rounded-full mx-auto"></div>
                                            </td>
                                            <td className="text-center py-4 px-4 bg-[#3A1A1A]">
                                                <div className="w-3 h-3 bg-[#C90000] rounded-full mx-auto"></div>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-800">
                                            <td className="py-4 px-4">Visual Boldness</td>
                                            <td className="text-center py-4 px-4">
                                                <div className="w-3 h-3 bg-white rounded-full mx-auto"></div>
                                            </td>
                                            <td className="text-center py-4 px-4 text-2xl">×</td>
                                            <td className="text-center py-4 px-4 bg-[#3A1A1A]">
                                                <div className="w-3 h-3 bg-[#C90000] rounded-full mx-auto"></div>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-800">
                                            <td className="py-4 px-4">Brand Voice</td>
                                            <td className="text-center py-4 px-4 text-2xl">×</td>
                                            <td className="text-center py-4 px-4 text-2xl">×</td>
                                            <td className="text-center py-4 px-4 bg-[#3A1A1A]">
                                                <div className="w-3 h-3 bg-[#C90000] rounded-full mx-auto"></div>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-800">
                                            <td className="py-4 px-4">Cultural Identity</td>
                                            <td className="text-center py-4 px-4 text-2xl">×</td>
                                            <td className="text-center py-4 px-4 text-2xl">×</td>
                                            <td className="text-center py-4 px-4 bg-[#3A1A1A]">
                                                <div className="w-3 h-3 bg-[#C90000] rounded-full mx-auto"></div>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-800">
                                            <td className="py-4 px-4">Community Feel</td>
                                            <td className="text-center py-4 px-4 text-2xl">×</td>
                                            <td className="text-center py-4 px-4 text-2xl">×</td>
                                            <td className="text-center py-4 px-4 bg-[#3A1A1A]">
                                                <div className="w-3 h-3 bg-[#C90000] rounded-full mx-auto"></div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-4 px-4">Memorability</td>
                                            <td className="text-center py-4 px-4 text-2xl">×</td>
                                            <td className="text-center py-4 px-4 text-2xl">×</td>
                                            <td className="text-center py-4 px-4 bg-[#3A1A1A] rounded-b-lg">
                                                <div className="w-3 h-3 bg-[#C90000] rounded-full mx-auto"></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Arrow Indicator */}
                            <div className="flex justify-center my-8">
                                <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 0 L20 45 M5 30 L20 45 L35 30" stroke="#C90000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            {/* Insight Box */}
                            <div className="border-2 border-gray-700 rounded-2xl p-6 bg-black/40">
                                <div className="flex items-start gap-4">
                                    <span
                                        className="px-4 py-2 rounded-full text-sm font-bold text-white whitespace-nowrap"
                                        style={{ backgroundColor: '#8B4513' }}
                                    >
                                        INSIGHT
                                    </span>
                                    <p className="text-gray-300 leading-relaxed">
                                        Speed and usability are table stakes. Culture and personality are what make brands memorable.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <Footer />
        </main>
    );
}
