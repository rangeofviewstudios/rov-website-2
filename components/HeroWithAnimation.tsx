import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const AnimationSection = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
`;

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

const DimOverlay = styled.div<{ $opacity: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: ${props => props.$opacity};
  z-index: 5;
  pointer-events: none;
  transition: opacity 0.1s linear;
`;

const HeroOverlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: white;
  font-family: 'ProximaNovaBlack', sans-serif;
  pointer-events: none;
  z-index: 10;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.5s ease-out;

  @media (min-width: 768px) {
    padding: 80px 20px;
  }
`;

const TextOverlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 3;
  display: ${props => props.$isVisible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0 1rem;

  @media (min-width: 768px) {
    gap: 10rem;
    padding: 0 5%;
  }
`;

const CreativeText = styled.div`
  color: white;
  font-family: 'sink', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-align: right;
  flex: 1;
  max-width: 50%;
  
  @media (min-width: 768px) {
    font-size: 7rem;
  }
`;

const ChangingWord = styled.div`
  color: white;
  font-family: 'Norwige Light', sans-serif;
  font-size: 2.2rem;
  font-weight: 300;
  letter-spacing: 0.05em;
  text-align: left;
  flex: 1;
  max-width: 50%;
  
  @media (min-width: 768px) {
    font-size: 6rem;
  }
  @media (min-width: 768px) {
    font-size: 6rem;
  }
`;



const Logo = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 20;
  pointer-events: auto;

  img {
    width: 100px;
    height: auto;
  }

  @media (max-width: 768px) {
    top: 10px;
    left: 10px;

    img {
      width: 60px;
    }
  }
`;

const Heading = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  text-align: right;
  font-family: 'Norwige Light', sans-serif;
  letter-spacing: 0.1em;
  z-index: 20;
  pointer-events: auto;

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;

    div {
      font-size: 1.5rem !important;
    }
  }
`;

const HeroWithAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const creativeRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);
  const [showHero, setShowHero] = useState(true);
  const [currentWord, setCurrentWord] = useState("Identity");
  const [dimOpacity, setDimOpacity] = useState(0);

  useEffect(() => {
    // Reset scroll position and ScrollTrigger on mount
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    ScrollTrigger.refresh();

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions
    canvas.width = 1920;
    canvas.height = 1080;

    const frameCount = 652;
    const currentFrame = (index: number) => {
      return `/assets/SpiralShotHorizontalV2Frames/SpiralShotHorizontal60fpsV2_${index.toString().padStart(5, '0')}.webp`;
    };

    const images: HTMLImageElement[] = [];
    const animation = {
      frame: 0
    };

    // Preload all images
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    // Render function
    function render() {
      if (!context || !canvas) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (images[animation.frame] && images[animation.frame].complete) {
        context.drawImage(images[animation.frame], 0, 0, canvas.width, canvas.height);
      }
    }

    // GSAP scroll animation with pinning
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        scrub: 0.5,
        pin: true,
        start: 'top top',
        end: '+=500%',
        onUpdate: (self) => {
          const progress = self.progress;

          // Determine which word to show based on scroll progress
          // 0-30%: "Identity", 30-65%: "Systems", 65-95%: "Strategy", 95-100%: fade out
          if (progress < 0.3) {
            setCurrentWord("Identity");
            setDimOpacity(0);
          } else if (progress < 0.65) {
            setCurrentWord("Systems");
            setDimOpacity(0);
          } else if (progress < 0.95) {
            setCurrentWord("Strategy");
            setDimOpacity(0);
          } else {
            // Fade out from progress 0.95 to 1.0
            const fadeProgress = (progress - 0.95) / 0.05;
            setDimOpacity(fadeProgress);
          }
        },
        onLeave: () => {
          setShowHero(false);
        },
        onEnterBack: () => {
          setShowHero(true);
        }
      }
    });

    tl.to(animation, {
      frame: frameCount - 1,
      snap: 'frame',
      ease: 'none',
      onUpdate: render
    });

    // Render first frame when loaded
    images[0].onload = render;

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Animate the changing word
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    if (wordRef.current) {
      // Fade from bottom to up
      gsap.fromTo(wordRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );

      // Shine animation (background gradient movement)
      gsap.fromTo(wordRef.current,
        { backgroundPosition: "200% center" },
        { backgroundPosition: "-200% center", duration: 1, ease: "power2.inOut" }
      );
    }
  }, [currentWord]);

  return (
    <AnimationSection ref={sectionRef}>
      <Canvas ref={canvasRef} />
      <DimOverlay $opacity={dimOpacity} />
      <HeroOverlay $isVisible={showHero}>
        <Logo>
          <img
            src="rov-logo.webp"
            alt="ROV Logo"
          />
        </Logo>
        <Heading>
          <div className="text-3xl md:text-5xl font-bold leading-tight md:leading-[1.2]">
            CREATIVE<br />STUDIO
          </div>
        </Heading>
      </HeroOverlay>

      <TextOverlay $isVisible={dimOpacity < 1}>
        <CreativeText ref={creativeRef}>Creative</CreativeText>
        <ChangingWord ref={wordRef}>{currentWord}</ChangingWord>
      </TextOverlay>
    </AnimationSection>
  );
};

export default HeroWithAnimation;
