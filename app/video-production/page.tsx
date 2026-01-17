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
                    backgroundImage: "url('/casestudy/casestudyherobando.png')",
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

            {/* Add more sections here */}

            <Footer />
        </main>
    );
}
