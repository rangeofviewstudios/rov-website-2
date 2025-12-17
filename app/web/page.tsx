import DigitalStage from "@/components/Web-Dev/DigitalStage";
import HomeBanner from "@/components/Web-Dev/HomeBanner";
import WhoWeBuildFor from "@/components/Web-Dev/WhoWeBuildFor";
import ShowcaseSection from "@/components/Web-Dev/ShowcaseSection";
import HowWeWorkSection from "@/components/Web-Dev/HowWeWorkSection";
import FAQSection from "@/components/Web-Dev/FAQSection";
import WhatMakesUsDifferent from "@/components/Web-Dev/WhatMakesUsDifferent";
import HustleSection from "@/components/Web-Dev/HustleSection";
import AnimatedSection from "@/components/common/AnimatedSection";
import BookACall from "@/components/Web-Dev/BookACall";
import { NavigationDock } from "@/components/NavDoc";

export default function Page() {
  return (
    <>
      {/* Added id="home" for the NavDoc link */}
      <div id="home">
        <HomeBanner />
      </div>

      <AnimatedSection>
        <DigitalStage />
      </AnimatedSection>

      {/* Added id="gallery" for the NavDoc link */}
      <div id="gallery">
        <AnimatedSection>
          <ShowcaseSection />
        </AnimatedSection>
      </div>

      <AnimatedSection>
        <WhoWeBuildFor />
      </AnimatedSection>

      <AnimatedSection>
        <HowWeWorkSection />
      </AnimatedSection>

      <AnimatedSection>
        <FAQSection />
      </AnimatedSection>

      <AnimatedSection>
        <WhatMakesUsDifferent />
      </AnimatedSection>

      <AnimatedSection>
        <HustleSection />
      </AnimatedSection>

      <AnimatedSection>
        <BookACall />
      </AnimatedSection>

      {/* Add the NavigationDock component here */}
      <NavigationDock />
    </>
  );
}
