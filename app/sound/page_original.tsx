import MusicBanner from "@/components/sound_page/MusicBanner";
import MusicPlayer from "@/components/sound_page/MusicPlayer";
import FAQSection from "@/components/sound_page/AboutFaq";
import AgencyIntro from "@/components/sound_page/AgencyIntro";
import ArtistBreakthrough from "@/components/sound_page/ArtistBreakthrough";
import BookACall from "@/components/sound_page/BookACall";
import Gallery from "@/components/sound_page/Gallery";
import MixesSection from "@/components/sound_page/MixesSection";
import Story from "@/components/sound_page/Story";
import VisionSection from "@/components/sound_page/VisionSection";
import OverlapSection from "@/components/OverlapSection";
import Footer from "@/components/Footer";
import { NavigationDock } from "@/components/NavDoc";

export default function Page() {
  return (
    <>

      <OverlapSection index={1}>
        <MusicBanner />
      </OverlapSection>

      <OverlapSection index={2}>
        <VisionSection />
      </OverlapSection>

      <OverlapSection index={3}>
        <MusicPlayer />
      </OverlapSection>

      <OverlapSection index={4}>
        <MixesSection />
      </OverlapSection>

      <OverlapSection index={5}>
        <ArtistBreakthrough />
      </OverlapSection>

      <OverlapSection index={6}>
        <Story />
      </OverlapSection>

      <OverlapSection index={7}>
        <AgencyIntro />
      </OverlapSection>

      <OverlapSection index={8}>
        <Gallery />
      </OverlapSection>

      <OverlapSection index={9} >
        <FAQSection />
      </OverlapSection>

      <OverlapSection index={10}>
        <BookACall />
      </OverlapSection>

      <OverlapSection index={11} >
        <Footer />
      </OverlapSection>

      <NavigationDock />
    </>
  );
}