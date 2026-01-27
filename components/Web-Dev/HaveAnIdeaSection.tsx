"use client";

export default function HaveAnIdeaSection() {
    return (
        <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-black">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left Side - CTA Card */}
                    <div
                        className="relative rounded-3xl p-8 md:p-12 overflow-hidden"
                        style={{
                            background: "linear-gradient(135deg, #EA9A61 0%, #B16937 30%, #A64D2B 60%, #42201C 100%)",
                        }}
                    >
                        {/* Logo Icon */}
                        <div className="mb-6">
                            <div
                                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black flex items-center justify-center"
                            >
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 50 50"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <text
                                        x="50%"
                                        y="50%"
                                        dominantBaseline="middle"
                                        textAnchor="middle"
                                        fill="white"
                                        fontSize="24"
                                        fontWeight="bold"
                                        fontFamily="Roboto, sans-serif"
                                    >
                                        ROV
                                    </text>
                                </svg>
                            </div>
                        </div>

                        {/* Heading */}
                        <h2
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
                            style={{
                                fontFamily: "Roboto, sans-serif",
                            }}
                        >
                            Have an Idea?
                        </h2>

                        {/* Description */}
                        <p
                            className="text-base md:text-lg text-white/90 mb-6"
                            style={{
                                fontFamily: "Norwige, sans-serif",
                                fontStyle: "italic",
                            }}
                        >
                            Book a call to discover how we can strengthen your digital platform and bring your vision to life.
                        </p>

                        {/* Optional CTA Button */}
                        <button
                            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
                            style={{
                                fontFamily: "Roboto, sans-serif",
                            }}
                        >
                            Schedule a Call
                        </button>
                    </div>

                    {/* Right Side - Companies Section */}
                    <div className="flex flex-col items-center lg:items-start">
                        <div className="mb-6">
                            <p
                                className="text-sm md:text-base text-white/70 flex items-center gap-2"
                                style={{
                                    fontFamily: "Norwige, sans-serif",
                                    fontStyle: "italic",
                                }}
                            >
                                Companies that trusted us
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white text-xs">
                                    ?
                                </span>
                            </p>
                        </div>

                        {/* Company Logos - Placeholder Circles */}
                        <div className="flex gap-4 md:gap-6">
                            {[1, 2, 3].map((index) => (
                                <div
                                    key={index}
                                    className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-white/90 flex items-center justify-center hover:scale-105 transition-transform duration-300"
                                    style={{
                                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    {/* Placeholder for company logo */}
                                    <div className="text-black/30 text-xs font-medium">
                                        LOGO
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
