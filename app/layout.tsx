// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

// Dynamically import the chat widget (client-only)
const ChatWidget = dynamic(() => import("@/components/ChatWidget"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Range of View Studios",
  description: "Official website of Range of View Studios.",
  icons: {
    icon: "/rov-logo.png", // Replace with your favicon URL
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Footer />
        {/* Floating chatbot */}
        <ChatWidget />
      </body>
    </html>
  );
}
