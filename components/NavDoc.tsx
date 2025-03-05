"use client";

import { useEffect, useState } from "react";
import { Mail, Instagram, Linkedin } from "lucide-react";

interface NavigationDockProps {
  className?: string;
}

export function NavigationDock({ className }: NavigationDockProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const links = [
    { title: "home", to: "hero" },
    { title: "mixes", to: "latest-album" },
    { title: "services", to: "services" },
    { title: "gallery", to: "digi-mag" },
    { title: "contact us", to: null },
  ];

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        if (heroRect.bottom <= 0) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }

      const footer = document.querySelector("footer");
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        if (footerRect.top <= window.innerHeight) {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 z-50 max-w-[90%] md:max-w-none transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"} ${className || ""}`}
      >
        <nav className="flex items-center space-x-2 justify-center">
          {links.map((link, index) => (
            <div key={link.title} className="flex items-center">
              <button
                onClick={() => link.to ? scrollToSection(link.to) : setModalOpen(true)}
                className="px-2 py-1 text-white/80 hover:text-white transition-colors cursor-pointer text-[10px] md:text-sm uppercase tracking-wide"
                style={{ fontFamily: "Flight Maybe Maj, sans-serif" }}
              >
                {link.title}
              </button>
              {index < links.length - 1 && (
                <span className="text-white/30 hidden md:inline">|</span>
              )}
            </div>
          ))}
        </nav>

        {/* Custom CSS for the font */}
        <style jsx>{`
          @font-face {
            font-family: "Flight Maybe Maj";
            src: url("/fonts/Flight Maybe Maj.ttf") format("truetype");
            font-weight: normal;
            font-style: normal;
          }
        `}</style>
      </div>

      {/* Modal with consistent font */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div
            className="bg-black text-white p-8 rounded-lg shadow-lg text-center w-96 relative border border-gray-700 md:w-96 sm:w-full sm:p-6"
            style={{ fontFamily: "Flight Maybe Maj, sans-serif" }} // Apply font here
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="flex flex-col gap-4">
              <a
                href="mailto:rangeofview@rovstudios.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <Mail className="w-5 h-5 text-white" />
                Email
              </a>
              <a
                href="https://www.instagram.com/rangeofviewstudios/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <Instagram className="w-5 h-5 text-pink-500" />
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/range-of-view-studios/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <Linkedin className="w-5 h-5 text-blue-500" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}