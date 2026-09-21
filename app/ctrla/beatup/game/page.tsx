import type { Metadata } from "next";
import GameContent from "./GameContent";

export const metadata: Metadata = {
  title: "for simran",
  robots: { index: false, follow: false },
};

export default function BeatupGamePage() {
  return <GameContent />;
}
