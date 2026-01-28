import MusicPlayer from "@/components/sound_page/MusicPlayer";
import Footer from "@/components/Footer";
import { NavigationDock } from "@/components/NavDoc";
import FAQBottomSection from "@/components/Web-Dev/FAQBottomSection";

export default function Page() {
    return (
        <>
            {/* Top Hero Section with Toggle */}
            <section className="flex items-center justify-center relative bg-black px-6 md:px-12 py-16 md:py-20">
                <div className="max-w-7xl w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-6">
                        {/* Left side - Toggle and tagline */}
                        <div className="flex flex-col gap-4">
                            {/* RAW/REFINED Toggle */}
                            <div className="flex items-center gap-4">
                                <span className="text-white text-2xl md:text-3xl lg:text-4xl font-bold italic" style={{ fontFamily: 'Norwige, sans-serif' }}>
                                    RAW.
                                </span>
                                <div className="relative inline-flex items-center">
                                    {/* Toggle pill background */}
                                    <div className="w-24 h-12 bg-gradient-to-r from-amber-700 to-amber-600 rounded-full shadow-lg flex items-center justify-between px-1.5">
                                        {/* Toggle circle */}
                                        <div className="w-9 h-9 bg-white rounded-full shadow-md"></div>
                                    </div>
                                </div>
                                <span className="text-white text-2xl md:text-3xl lg:text-4xl font-bold italic" style={{ fontFamily: 'Norwige, sans-serif' }}>
                                    REFINED.
                                </span>
                            </div>

                            {/* RELEASED text */}
                            <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold italic" style={{ fontFamily: 'Norwige, sans-serif' }}>
                                RELEASED.
                            </h1>
                        </div>

                        {/* Right side - Description */}
                        <div className="max-w-md">
                            <p className="text-white text-base md:text-lg italic leading-relaxed" style={{ fontFamily: 'Norwige, sans-serif' }}>
                                From bedroom demos to radio-ready hits, your sound unleashed in just 48 hours.
                            </p>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-12 md:mt-16">
                        <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold italic leading-tight" style={{ fontFamily: 'Norwige, sans-serif' }}>
                            Don't Believe Us.<br />
                            Hear the Difference.
                        </h2>
                    </div>
                </div>
            </section>

            {/* Music Player Section */}
            <section className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
                <div className="absolute inset-0 bg-[url('/assets/background/music_player_bg.png')] bg-cover bg-center opacity-20" />
                <div className="relative z-10 w-full">
                    <MusicPlayer />
                </div>
            </section>

            {/* Promotional CTA Strip */}
            <section className="relative bg-black px-6 md:px-12 py-8">
                <div className="max-w-7xl mx-auto">
                    <div
                        className="relative rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
                        style={{
                            borderRadius: '15px',
                            border: '1px solid #999288',
                            background: 'linear-gradient(111deg, #EA9A61 -1.34%, #B16937 25.87%, #A64D2B 59.87%, #42201C 93.39%)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                        }}
                    >
                        {/* Left side - Logo and Text */}
                        <div className="flex items-center gap-6">
                            {/* Logo Circle */}
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                <img
                                    src="/rov-logo.webp"
                                    alt="ROV Logo"
                                    className="w-12 h-12 md:w-14 md:h-14 object-contain"
                                />
                            </div>

                            {/* Text Content */}
                            <div>
                                <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: 'Norwige, sans-serif' }}>
                                    First Time Working With Us?
                                </h3>
                                <p className="text-white text-sm md:text-base opacity-90" style={{ fontFamily: 'Norwige, sans-serif' }}>
                                    Demo snippets are free. No Strings. No Proof.
                                </p>
                            </div>
                        </div>

                        {/* Right side - Buttons */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                            {/* Arrow Button */}
                            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* LET'S CREATE Button */}
                            <button
                                className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition-colors uppercase tracking-wide text-sm md:text-base font-bold"
                                style={{ fontFamily: 'Norwige, sans-serif' }}
                            >
                                LET'S CREATE!
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <FAQBottomSection />

            {/* Footer */}
            <Footer />

            {/* Navigation Dock */}
            <NavigationDock />
        </>
    );
}
