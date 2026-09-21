import type { Metadata } from "next";
import BeatupContent from "./BeatupContent";

export const metadata: Metadata = {
  title: "beat up ayush",
  robots: { index: false, follow: false },
};

export default function BeatupPage() {
  return <BeatupContent />;
}
