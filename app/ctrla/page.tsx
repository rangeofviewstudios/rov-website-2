import BentoFlipGallery from "@/components/ctrla/BentoFlipGallery";
import { NavigationDock } from "@/components/NavDoc";

export default function Page() {
  return (
    <main className="bg-[#0a0a0a]">
      <BentoFlipGallery />
      <NavigationDock />
    </main>
  );
}