"use client";

import React, { useState } from "react";
import { User, Video, Headphones, Cpu, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StarBorder from "./StarBorder";
import Image from "next/image";

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split('')
      .map(c => c + c)
      .join('');
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const InteractiveFolderIcon: React.FC = () => {
  const color = '#7F5230'; // Main folder color
  const maxItems = 3;
  const [open, setOpen] = useState(false);
  const [paperOffsets, setPaperOffsets] = useState<{ x: number; y: number }[]>(
    Array.from({ length: maxItems }, () => ({ x: 0, y: 0 }))
  );

  const folderBackColor = '#3B2114'; // Darker back color

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
    setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
  };

  const handlePaperMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    if (!open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.15;
    const offsetY = (e.clientY - centerY) * 0.15;
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: offsetX, y: offsetY };
      return newOffsets;
    });
  };

  const handlePaperMouseLeave = (index: number) => {
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: 0, y: 0 };
      return newOffsets;
    });
  };

  const getOpenTransform = (index: number) => {
    if (index === 0) return 'translate(-120%, -70%) rotate(-15deg)';
    if (index === 1) return 'translate(10%, -70%) rotate(15deg)';
    if (index === 2) return 'translate(-50%, -100%) rotate(5deg)';
    return '';
  };

  const images = ['/rov_album_1.webp', '/rov_album_2.webp', '/rov_album_3.webp'];

  return (
    <div className="relative mb-12" style={{ transform: 'scale(2.5)' }}>
      <div
        className="group relative transition-all duration-200 ease-in cursor-pointer"
        style={{
          transform: open ? 'translateY(-8px)' : undefined
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="relative w-[100px] h-[80px] rounded-tl-0 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]"
          style={{ backgroundColor: folderBackColor }}
        >
          <span
            className="absolute z-0 bottom-[98%] left-0 w-[30px] h-[10px] rounded-tl-[5px] rounded-tr-[5px] rounded-bl-0 rounded-br-0"
            style={{ background: 'linear-gradient(179deg, #3B2114 -9.53%, #7F5230 92.5%)' }}
          ></span>

          {images.map((src, i) => {
            let sizeClasses = '';
            if (i === 0) sizeClasses = 'w-[70%] h-[60%]';
            if (i === 1) sizeClasses = 'w-[80%] h-[65%]';
            if (i === 2) sizeClasses = 'w-[90%] h-[70%]';

            const closedTransform = 'translate(-50%, 0%)';
            const openTransform = open
              ? `${getOpenTransform(i)} translate(${paperOffsets[i].x}px, ${paperOffsets[i].y}px)`
              : closedTransform;

            return (
              <div
                key={i}
                onMouseMove={e => handlePaperMouseMove(e, i)}
                onMouseLeave={() => handlePaperMouseLeave(i)}
                className={`absolute bottom-[15%] left-1/2 transition-all duration-300 ease-in-out overflow-hidden ${!open ? 'opacity-80' : 'opacity-100 hover:scale-105'
                  } ${sizeClasses}`}
                style={{
                  transform: openTransform,
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  zIndex: open ? 20 + i : 20 - i,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
              >
                <Image
                  src={src}
                  alt={`ROV Album ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            );
          })}

          <div
            className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${!open ? 'group-hover:[transform:skew(15deg)_scaleY(0.6)]' : ''
              }`}
            style={{
              backgroundColor: color,
              borderRadius: '5px 10px 10px 10px',
              ...(open && { transform: 'skew(15deg) scaleY(0.6)' })
            }}
          ></div>
          <div
            className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${!open ? 'group-hover:[transform:skew(-15deg)_scaleY(0.6)]' : ''
              }`}
            style={{
              backgroundColor: color,
              borderRadius: '5px 10px 10px 10px',
              ...(open && { transform: 'skew(-15deg) scaleY(0.6)' })
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

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
          {/* Interactive Folder Component */}
          <InteractiveFolderIcon />

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
