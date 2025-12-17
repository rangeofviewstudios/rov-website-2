import HeroSection from "@/components/aerielPage/HeroSection";
import WhoWeFlyWith from "@/components/aerielPage/WhoWeFlyWith";
import FlightProcess from "@/components/aerielPage/FlightProcess";
import TakeWork from "@/components/aerielPage/TakeWork";
import VisionMixing from "@/components/aerielPage/VisionMixing";
import ContactSection from "@/components/aerielPage/ContactSection";
import TestimonialSection from "@/components/aerielPage/TestimonialSection";
import VisionFaq from "@/components/aerielPage/VisionFaq";

export default function AerielPage() {
  return (
    <main>
      <HeroSection />
      <WhoWeFlyWith />
      <FlightProcess />
      <TakeWork />
      <VisionMixing />
      <ContactSection />
      <TestimonialSection />
      <VisionFaq />
    </main>
  );
}
