"use client";

import React, { useState } from "react";
import { User, Video, Headphones, Cpu, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StarBorder from "./StarBorder";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  isExpanded: boolean;
  expandedCard: string | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  link?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  position,
  isExpanded,
  expandedCard,
  onMouseEnter,
  onMouseLeave,
  link = "#",
}) => {
  return (
    <Link href={link}>
      <div className="relative group cursor-pointer">
        {/* Main Card */}
        <div
          className="flex flex-col items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-lg p-8 md:py-[60px] md:px-[80px]"
          style={{
            borderRadius: '28px',
            border: '1px solid #D0BEA5',
            background: '#110C09',
            boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
            minHeight: '500px'
          }}
        >
          {/* Folder Icon with overlaid button */}
          <div className="relative mb-12 transform scale-100 md:scale-150">
            <svg width="280" height="200" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="folderGradient" x1="140" y1="12" x2="140" y2="188" gradientUnits="userSpaceOnUse">
                  <stop offset="-9.53%" stopColor="#3B2114" />
                  <stop offset="92.5%" stopColor="#7F5230" />
                </linearGradient>
              </defs>
              {/* Folder back tab - Gradient Fill */}
              <path d="M20 40 L20 20 C20 15 23 12 28 12 L100 12 L120 32 L252 32 C257 32 260 35 260 40 L260 180 C260 185 257 188 252 188 L28 188 C23 188 20 185 20 180 Z" fill="url(#folderGradient)" />
              {/* Folder main body - Solid Fill #7F5230 */}
              <path d="M20 60 L20 180 C20 185 23 188 28 188 L252 188 C257 188 260 185 260 180 L260 70 C260 65 257 62 252 62 L120 62 L100 42 L28 42 C23 42 20 45 20 50 Z" fill="#7F5230" />
            </svg>

            {/* View More Button - Overlaid on folder */}
            <div className="absolute top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <button
                className="px-6 py-2 rounded-full text-white/90 text-sm font-normal transition-all duration-300 whitespace-nowrap hover:bg-white/10 hover:border-white/50"
                style={{
                  fontFamily: 'Roboto, sans-serif',
                  background: 'rgba(255, 244, 227, 0.10)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '30px'
                }}
              >
                View More
              </button>
            </div>
          </div>

          {/* Service Title - Inside the card */}
          <h3
            className="text-2xl md:text-3xl text-center font-normal"
            style={{ fontFamily: 'Roboto, sans-serif', color: '#FFF4E3' }}
          >
            {title}
          </h3>
        </div>


      </div>
    </Link>
  );
};

export default function Services() {
  const router = useRouter();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleCardHover = (id: string) => {
    setExpandedCard(id);
  };

  const handleMouseLeave = () => {
    setExpandedCard(null);
  };

  const services = [
    {
      id: "web",
      title: "Web Optimization",
      icon: <User className="w-16 h-16 text-white/80" />,
      description: "Turning clicks into connections with seamless and high impact designs.",
      position: "top-left" as const,
      link: "/web",
    },
    {
      id: "sound",
      title: "Sound Engineering",
      icon: <Headphones className="w-16 h-16 text-white/80" />,
      description: "Audio production & mixing that brings your content to life with crystal-clear quality.",
      position: "top-right" as const,
      link: "/sound",
    },
    {
      id: "video",
      title: "Video Production",
      icon: <Video className="w-16 h-16 text-white/80" />,
      description: "Cinematic content & aerial media that captures attention and delivers your message.",
      position: "bottom-left" as const,
      link: "/aeriel",
    },
    {
      id: "ai",
      title: "AI Integration",
      icon: <Cpu className="w-16 h-16 text-white/80" />,
      description: "Custom automation solutions powered by AI to streamline your business processes.",
      position: "bottom-right" as const,
      link: "/ai-automation",
    },
  ];

  return (
    <section className="min-h-screen bg-black py-20 w-full px-6 sm:px-12 md:px-16 relative flex flex-col justify-center">
      {/* Top Left Gradient Blob */}
      <div
        className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full pointer-events-none z-0"
        style={{
          background: 'rgba(96, 62, 37, 0.60)',
          filter: 'blur(200px)',
          transform: 'translate(-30%, -30%)'
        }}
      />
      {/* Bottom Right Gradient Blob */}
      <div
        className="absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full pointer-events-none z-0"
        style={{
          background: 'rgba(96, 62, 37, 0.60)',
          filter: 'blur(200px)',
          transform: 'translate(30%, 30%)'
        }}
      />

      {/* Decorative stars - REMOVED */}

      <div className="w-full relative z-10">
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translate(-50%, 0px);
            }
            50% {
              transform: translate(-50%, -20px);
            }
          }

          .services-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
            min-height: auto;
          }

          @media (min-width: 768px) {
            .services-grid {
              grid-template-columns: repeat(2, 1fr);
              grid-template-rows: auto;
              height: auto;
              gap: 2rem;
            }
          }

          .services-grid.has-expanded {
             /* Mobile behavior when expanded: Expanded card takes order -1 to go top, others show below or hide? 
                Actually, simpler to just stack them on mobile and expand in place. 
                The 'grid-column' logic below is desktop specific.
             */
             grid-template-columns: 1fr;
             grid-template-rows: auto;
          }

          @media (min-width: 768px) {
            .services-grid.has-expanded {
              grid-template-columns: 2fr 1fr;
              grid-template-rows: repeat(3, 1fr);
              height: 800px;
              max-height: 85vh;
            }

            .expanded-card {
              grid-column: 1 / 2;
              grid-row: 1 / 4;
            }

            .collapsed-card {
              grid-column: 2 / 3;
            }
          }

          .normal-card {
            /* Default positioning in 2x2 grid */
          }

          @font-face {
            font-family: "Flight Maybe Maj";
            src: url("/fonts/Flight Maybe Maj.ttf") format("truetype");
            font-weight: normal;
            font-style: normal;
          }

          @font-face {
            font-family: "ZRTW Bokerough";
            src: url("/fonts/ZRTW-BokeRoughPersonalUse.otf") format("opentype");
            font-weight: normal;
            font-style: normal;
          }
        `}</style>

        <div className="mb-12">
          <h2
            className="text-4xl md:text-6xl lg:text-[10rem] text-white/90 uppercase tracking-wider mb-4 text-left"
            style={{ fontFamily: "Norwige, sans-serif" }}
          >
            SERVICES
          </h2>
        </div>

        {/* Dynamic grid */}
        <div className={`services-grid ${expandedCard ? "has-expanded" : ""}`}>
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              position={service.position}
              isExpanded={expandedCard === service.id}
              expandedCard={expandedCard}
              onMouseEnter={() => handleCardHover(service.id)}
              onMouseLeave={handleMouseLeave}
              link={service.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
