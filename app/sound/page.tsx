import MusicBanner from "@/components/sound_page/MusicBanner";
import MixesSection from "@/components/sound_page/MixesSection";
import Gallery from "@/components/sound_page/Gallery";
import AboutFaq from "@/components/sound_page/AboutFaq";
import AgencyIntro from "@/components/sound_page/AgencyIntro";
import ArtistBreakthrough from "@/components/sound_page/ArtistBreakthrough";
import BookACall from "@/components/sound_page/BookACall";
import Story from "@/components/sound_page/Story";
import VisionSection from "@/components/sound_page/VisionSection";

export default function SoundPage() {
  return (
    <main>
      <MusicBanner />
      <MixesSection />
      <Gallery />
      <AboutFaq />
      <AgencyIntro />
      <ArtistBreakthrough />
      <BookACall />
      <Story />
      <VisionSection />
    </main>
  );
}
