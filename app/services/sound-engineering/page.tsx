"use client";

import React from "react";
import MusicBanner from "../../../components/sound_page/MusicBanner";
import AgencyIntro from "../../../components/sound_page/AgencyIntro";
import ArtistBreakthrough from "../../../components/sound_page/ArtistBreakthrough";
import Story from "../../../components/sound_page/Story";
import VisionSection from "../../../components/sound_page/VisionSection";
import MixesSection from "../../../components/sound_page/MixesSection";
import Gallery from "../../../components/sound_page/Gallery";
import AboutFaq from "../../../components/sound_page/AboutFaq";
import BookACall from "../../../components/sound_page/BookACall";
import { NavigationDock } from "@/components/NavDoc";

export default function SoundEngineeringPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <MusicBanner />
            <AgencyIntro />
            <ArtistBreakthrough />
            <Story />
            <VisionSection />
            <MixesSection />
            <Gallery />
            <AboutFaq />
            <BookACall />
            <NavigationDock />
        </main>
    );
}
