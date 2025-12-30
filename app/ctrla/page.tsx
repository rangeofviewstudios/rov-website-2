import BookACall from "@/components/ctrla/BookACall";
import CardTemplate from "@/components/ctrla/CardTemplate";
import CreativeFriction from "@/components/ctrla/CreativeFriction";
import Culture from "@/components/ctrla/Culture";
import HeroSection from "@/components/ctrla/HeroSection";
import ToolkitSection from "@/components/ctrla/ToolkitSection";
import { NavigationDock } from "@/components/NavDoc";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main >
      <HeroSection />
      <ToolkitSection />
      <Culture />
      <CardTemplate
        heading="CTRL A DIGITAL MAGAZINE"
        para1={`In a city obsessed with hot takes and hotter plates, The Bando doesn’t care to impress—it just feeds you right. 
        Tucked off MLK, just inside the 285 loop, this wing spot is more than a carryout window. 
        It’s a cornerstone of South Atlanta’s flavor memory. No dining room, no frills—just a line wrapped out the door 
        and people eating in the parking lot like it’s church.`}
        para2={`You can smell the truth before you taste it. Founded in 2019 by ATL-native Terry Bartholomew and Detroit’s own 
        Rico Terry, The Bando started as both a wing shack and a cultural nod—part restaurant, part street-level food museum. 
        They served coney dogs at first, but eventually let the wings take the lead. Now, it’s legend.`}
      />
      <CardTemplate
        heading="THE BANDO: AN ATL CORNERSTONE"
        para1={`Ask any local: it’s the crack wings that define the myth. Double-fried, dusted in a sweet-salty powder that shouldn’t make sense—but does. That’s the southside alchemy. But if they’re out (and they often are), there’s still a full lineup of flavors: strawberry hot, lemon pepper, ranch, spicy BBQ. Every box comes with fries that might be overcooked but still get devoured. Like the shop itself—imperfect, but iconic.`}
        para2={`Don’t expect gimmicks. Expect lines. Expect community. Expect to hear someone in front of you say, “You ain’t been here before?” and then nod like you just leveled up.
        Because you did.
        The Bando is ATL soul in wing form.
        Crispy, unpolished, unforgettable.
        And if you leave without licking your fingers, you did it wrong.`}
      />
      <BookACall />
      <CreativeFriction />
      <section
        className="h-screen"
        style={{
          backgroundImage: "url('/assets/background/building.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></section>

      <Footer />

      <NavigationDock />
    </main>
  );
}