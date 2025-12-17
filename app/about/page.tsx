import MusicBanner from "@/components/sound_page/MusicBanner";
import FAQSection from "@/components/sound_page/AboutFaq";
import AgencyIntro from "@/components/sound_page/AgencyIntro";
import ArtistBreakthrough from "@/components/sound_page/ArtistBreakthrough";
import BookACall from "@/components/sound_page/BookACall";
import Gallery from "@/components/sound_page/Gallery";
import CarouselGallery from "@/components/Gallery";
import MixesSection from "@/components/sound_page/MixesSection";
import Story from "@/components/sound_page/Story";
import VisionSection from "@/components/sound_page/VisionSection";
import AnimatedSection from "@/components/common/AnimatedSection";
// Import NavigationDock from the file you provided (NavDoc.tsx)
// Adjust this import path if NavDoc.tsx is located elsewhere
import { NavigationDock } from "@/components/NavDoc";

export default function Page() {
  return (
    <>
      {/* Add id="hero" wrapper for NavigationDock visibility logic */}
      <div id="hero">
        <MusicBanner />
      </div>

      <AnimatedSection>
        <VisionSection />
      </AnimatedSection>

      {/* Add id="latest-album" wrapper for the "mixes" link */}
      <div id="latest-album">
        <AnimatedSection>
          <MixesSection />
        </AnimatedSection>
      </div>

      <AnimatedSection>
        <ArtistBreakthrough />
      </AnimatedSection>

      <AnimatedSection>
        <Story />
      </AnimatedSection>

      <CarouselGallery />

      <AnimatedSection>
        <AgencyIntro />
      </AnimatedSection>

      {/* Add id="gallery" wrapper for the "gallery" link */}
      <div id="gallery">
        <AnimatedSection>
          <Gallery />
        </AnimatedSection>
      </div>

      <AnimatedSection>
        <BookACall />
      </AnimatedSection>

      <AnimatedSection>
        <FAQSection />
      </AnimatedSection>

      {/* Add the NavigationDock component here */}
      <NavigationDock />
    </>
  );
}
