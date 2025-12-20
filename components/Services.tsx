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
  const isAnyExpanded = expandedCard !== null;
  const isCollapsed = isAnyExpanded && !isExpanded;

  return (
    <div
      className={`relative group ${isExpanded ? "expanded-card" : isCollapsed ? "collapsed-card" : "normal-card"
        }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {!isExpanded && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ borderRadius: '24px' }}>
          <StarBorder
            as="div"
            color="#d4af37"
            speed="4s"
            thickness={2}
            className="w-full h-full"
          >
            <div className="w-full h-full" />
          </StarBorder>
        </div>
      )}

      {/* Glass container */}
      <div
        className={`relative bg-black/50 backdrop-blur-md border-2 rounded-3xl overflow-hidden h-full ${isExpanded ? "p-6 md:p-8" : "p-4 md:p-6"
          } cursor-pointer transition-all duration-300 ${isExpanded
            ? "border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            : "border-white/10"
          }`}
      >
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
          <div className="shimmer-effect"></div>
        </div>

        {isExpanded ? (
          /* Expanded content */
          <div className="relative z-10 flex flex-col md:flex-row gap-6 h-full opacity-0 animate-fadeIn">
            {/* Left side - Text content */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3
                  className="text-white/90 text-2xl md:text-3xl lg:text-5xl font-medium uppercase tracking-wider mb-4"
                  style={{ fontFamily: "Futura, sans-serif" }}
                >
                  {title}
                </h3>
                <p className="text-white/70 text-base md:text-lg mb-4">
                  {description}
                </p>
                <p className="text-white/50 text-sm md:text-base uppercase tracking-wide">
                  Projects starting $1000
                </p>
              </div>

              <Link href={link}>
                <button className="bg-white/90 text-black px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-full font-semibold hover:bg-white transition-colors duration-300 w-fit">
                  Learn More
                </button>
              </Link>
            </div>

            {/* Right side - Image/Icon placeholder */}
            <div className="w-full md:w-96 h-full min-h-[250px] bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-center">
              <div className="text-white/30">{icon}</div>
            </div>
          </div>
        ) : (
          /* Collapsed content - matching expanded style */
          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4">
            {/* Icon */}
            <div className="text-white/80">
              {icon}
            </div>

            {/* Service title */}
            <h3
              className="text-white/90 font-medium text-center uppercase tracking-wider text-base md:text-lg"
              style={{ fontFamily: "Futura, sans-serif" }}
            >
              {title}
            </h3>

            {/* Pricing text */}
            <p
              className="text-white/50 text-xs md:text-sm uppercase tracking-wide"
              style={{ fontFamily: "Futura, sans-serif" }}
            >
              Projects starting from
            </p>
          </div>
        )}
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-150%) rotate(15deg);
          }
          100% {
            transform: translateX(250%) rotate(15deg);
          }
        }

        .shimmer-effect {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 60%;
          height: 200%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          filter: blur(10px);
          animation: shimmer 2.5s ease-in-out infinite;
        }

        /* 3D Flip Animation Styles */
        .flip-container {
          perspective: 1000px;
        }

        .flip-card {
          position: relative;
          transition: transform 0.8s;
          transform-style: preserve-3d;
        }

        .group-folder:hover .flip-card {
          transform: rotateX(180deg);
        }

        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          top: 0;
          left: 0;
        }

        .flip-card-back {
          transform: rotateX(180deg);
        }
      `}</style>
    </div>
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
    <section className="min-h-screen bg-black py-20 px-6 relative flex items-center">
      {/* Decorative stars */}
      <img
        src="/star.svg"
        alt="Star"
        className="hidden md:block absolute top-16 right-5 md:right-20 w-16 h-16 md:w-32 md:h-32 opacity-90 z-50 pointer-events-none"
        style={{
          animation: "float 6s ease-in-out infinite",
        }}
      />

      <img
        src="/star2.svg"
        alt="Star"
        className={`hidden md:block absolute top-[40%] left-1/2 -translate-x-1/2 w-16 h-16 md:w-28 md:h-28 z-50 pointer-events-none transition-opacity duration-500 ${expandedCard ? "opacity-0" : "opacity-85"
          }`}
        style={{
          animation: "float 7s ease-in-out infinite",
        }}
      />

      <img
        src="/ques.svg"
        alt="Question"
        className="absolute bottom-28 left-5 md:left-16 w-16 h-16 md:w-28 md:h-28 opacity-90 z-50 pointer-events-none"
        style={{
          animation: "float 8s ease-in-out infinite",
        }}
      />

      <img
        src="/star3.svg"
        alt="Star"
        className="absolute bottom-10 md:bottom-20 right-5 md:right-16 w-16 h-16 md:w-32 md:h-32 opacity-85 z-50 pointer-events-none"
        style={{
          animation: "float 6.5s ease-in-out infinite",
        }}
      />

      <div className="max-w-7xl mx-auto relative w-full">
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
              grid-template-rows: repeat(2, 1fr);
              height: 800px;
              max-height: 85vh;
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

        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-6xl lg:text-[10rem] text-white/90 uppercase tracking-wider mb-4"
            style={{ fontFamily: "Sink, sans-serif" }}
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
