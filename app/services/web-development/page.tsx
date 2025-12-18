"use client";

import React from "react";
import HomeBanner from "../../../components/Web-Dev/HomeBanner";
import DigitalStage from "../../../components/Web-Dev/DigitalStage";
import WhatMakesUsDifferent from "../../../components/Web-Dev/WhatMakesUsDifferent";
import HowWeWorkSection from "../../../components/Web-Dev/HowWeWorkSection";
import HustleSection from "../../../components/Web-Dev/HustleSection";
import ShowcaseSection from "../../../components/Web-Dev/ShowcaseSection";
import WhoWeBuildFor from "../../../components/Web-Dev/WhoWeBuildFor";
import FAQSection from "../../../components/Web-Dev/FAQSection";
import BookACall from "../../../components/Web-Dev/BookACall";
import { NavigationDock } from "@/components/NavDoc";

export default function WebDevelopmentPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <HomeBanner />
            <DigitalStage />
            <WhatMakesUsDifferent />
            <HowWeWorkSection />
            <HustleSection />
            <ShowcaseSection />
            <WhoWeBuildFor />
            <FAQSection />
            <BookACall />
            <NavigationDock />
        </main>
    );
}
