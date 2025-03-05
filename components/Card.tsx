import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'ProximaNovaBlack';
    src: url('/fonts/proximanova_black.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  body {
    font-family: 'ProximaNovaBlack', sans-serif;
  }
`;

const cards = [
  {
    id: 1,
    description:
      "What’s the biggest obstacle stopping creatives and brands from reaching their full potential? \n\nFriction.\n\n Whether you're an artist struggling with mixing and mastering or a brand in need of standout visuals, the creative process can feel overwhelming without the right support. \n\nUntil now.",
    image: "/R.png",
    color: "#FF916E",
  },
  {
    id: 2,
    description:
      "Clean, professional sound shouldn’t be out of your financial grasp.\n\nToo many artists struggle to find high-quality mixing at a fair price, forced to choose between expensive studios or cheap, unreliable work. \n\nWe make top-tier mixing affordable.",
    image: "/O.png",
    color: "#ffc672",
  },
  {
    id: 3,
    description:
      "A brand without strong visuals is a story left untold.\n\nIf it's a flyer, album cover, or full branding package, design should amplify your message, not get lost in the noise. \n\nWe turn ideas into the story you tell.",
    image: "/V.png",
    color: "#90d0e3",
  },
  {
    id: 4,
    description:
      "A slow, outdated, or confusing website is a lost opportunity. \n\nYour website isn’t just a digital space—it’s your brand’s first handshake. It should engage, convert, and retain visitors effortlessly. \n\nWe help you set the scene you want to stage",
    image: "/ROV.png",
    color: "linear-gradient(to right, #FF916E, #ffc672, #90d0e3)",
  },
];

export function Card({
  card,
  progress,
  index,
  totalCards,
}: {
  card: typeof cards[number];
  progress: any;
  index: number;
  totalCards: number;
}) {
  const segment = 1 / totalCards;
  const start = segment * index;
  const end = start + segment;

  const opacity = useTransform(
    progress,
    [Math.max(0, start - segment / 2), start, end, Math.min(1, end + segment / 2)],
    [0, 1, 1, 0]
  );

  const y = useTransform(progress, [start, end], ["0%", "-100%"]);

  const headings: { [key: number]: string } = {
    1: "FRICTION: THE HIDDEN BARRIER",
    2: "MIXING & MASTERING: ELIMINATING THE NOISE",
    3: "GRAPHIC DESIGN: BRINGING VISIONS TO LIFE",
    4: "YOUR VISION, OUR MISSION",
  };

  const imageBackground = card.id === 4 
    ? { background: card.color }
    : { backgroundColor: card.color };

  return (
    <motion.div
      style={{ opacity, y, position: "absolute", width: "100%", height: "100%" }}
      className="flex items-center justify-center p-4 sm:p-6 md:p-8"
    >
      <div className="bg-white rounded-1xl w-full max-w-[98%] md:max-w-[84rem] min-h-[70vh] md:h-[80vh] p-8 sm:p-12 md:p-16 overflow-y-hidden">
        {/* Mobile and Tablet layout */}
        <div className="md:hidden flex flex-col h-full">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter text-left w-full">
            <span style={card.id === 4 ? { backgroundImage: card.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: card.color }}>
              {headings[card.id]}
            </span>
          </h2>
          <div className="flex flex-col items-center flex-grow justify-center">
            <div className="w-full max-w-[200px] aspect-square mb-6">
              <img
                src={card.image}
                alt={`Illustration ${card.id}`}
                className="w-full h-full object-cover rounded-xl"
                style={imageBackground}
              />
            </div>
            <div 
              className="text-gray-600 text-base sm:text-lg leading-relaxed whitespace-pre-line w-full"
              style={{ fontFamily: 'ProximaNovaBlack, sans-serif' }}
            >
              {card.description}
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:flex flex-col h-full">
          <h2 className="text-4xl font-bold uppercase tracking-tighter leading-tight mb-8">
            <span style={card.id === 4 ? { backgroundImage: card.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: card.color }}>
              {headings[card.id]}
            </span>
          </h2>
          <div className="flex-grow" /> {/* Spacer */}
          <div className="flex items-end justify-between">
            <div className="w-[150px] aspect-square">
              <img
                src={card.image}
                alt={`Illustration ${card.id}`}
                className="w-full h-full object-cover rounded-xl"
                style={imageBackground}
              />
            </div>
            <div 
              className="text-gray-600 text-lg leading-relaxed whitespace-pre-line max-w-[70%]"
              style={{ fontFamily: 'ProximaNovaBlack, sans-serif' }}
            >
              {card.description.split('\n\n').map((paragraph, idx) => (
                <div key={idx} className="mb-4">
                  {paragraph}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CardList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  return (
    <main>
      <GlobalStyle />
      <div
        ref={containerRef}
        className="relative min-h-[400vh] bg-[#0]" 
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {cards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              progress={scrollYProgress}
              index={index}
              totalCards={cards.length}
            />
          ))}
        </div>
      </div>
    </main>
  );
}