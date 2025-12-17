"use client";

import React from "react";
import HeroSection from "../../../components/aerielPage/HeroSection";
import WhoWeFlyWith from "../../../components/aerielPage/WhoWeFlyWith";
import VisionMixing from "../../../components/aerielPage/VisionMixing";
import FlightProcess from "../../../components/aerielPage/FlightProcess";
import TakeWork from "../../../components/aerielPage/TakeWork";
import TestimonialSection from "../../../components/aerielPage/TestimonialSection";
import VisionFaq from "../../../components/aerielPage/VisionFaq.tsx";
import ContactSection from "../../../components/aerielPage/ContactSection";
import BookCall from "../../../components/aerielPage/BookCall";

export default function VideoProductionPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <HeroSection />
            <WhoWeFlyWith />
            <VisionMixing />
            <FlightProcess />
            <TakeWork />
            <TestimonialSection />
            <VisionFaq />
            <ContactSection />
            <BookCall />
        </main>
    );
}
