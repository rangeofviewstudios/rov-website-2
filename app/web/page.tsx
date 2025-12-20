import Footer from "@/components/Footer";
import OverlapSection from "@/components/OverlapSection";
import BookACall from "@/components/Web-Dev/BookACall";
import DigitalStage from "@/components/Web-Dev/DigitalStage";
import FAQSection from "@/components/Web-Dev/FAQSection";
import HomeBanner from "@/components/Web-Dev/HomeBanner";
import { default as HowWeWorkSection, default as WorkSection } from "@/components/Web-Dev/HowWeWorkSection";
import HustleSection from "@/components/Web-Dev/HustleSection";
import WhatMakesUsDifferent from "@/components/Web-Dev/WhatMakesUsDifferent";
import WhoWeBuildFor from "@/components/Web-Dev/WhoWeBuildFor";
import { NavigationDock } from "@/components/NavDoc";

export default function Page() {
  return (
    <>
      <OverlapSection index={1}>
        <HomeBanner />
      </OverlapSection>

      <OverlapSection index={2}>
        <DigitalStage />
      </OverlapSection>

      <OverlapSection index={3}>
        <WorkSection />
      </OverlapSection>

      <OverlapSection index={4}>
        <WhoWeBuildFor />
      </OverlapSection>

      <OverlapSection index={5}>
        <HowWeWorkSection />
      </OverlapSection>

      <OverlapSection index={6}>
        <FAQSection />
      </OverlapSection>

      <OverlapSection index={7}>
        <WhatMakesUsDifferent />
      </OverlapSection>

      <OverlapSection index={8}>
        <HustleSection />
      </OverlapSection>

      {/* LAST SECTION */}
      <OverlapSection index={9} >
        <BookACall />
      </OverlapSection>
      
       <OverlapSection index={10} >
        <Footer/>
      </OverlapSection>

      <NavigationDock />
    </>
  );
}