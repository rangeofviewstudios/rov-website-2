import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const LoadingOverlay = styled.div<{ $isLoaded: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.8s ease-in-out, visibility 0.8s;
  opacity: ${props => (props.$isLoaded ? 0 : 1)};
  visibility: ${props => (props.$isLoaded ? 'hidden' : 'visible')};
`;

const LoadingText = styled.div`
  color: #FFF4E3;
  font-family: 'Norwige', sans-serif;
  font-size: 1rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 20px;
`;

const ProgressNumber = styled.div`
  color: #FFF4E3;
  font-family: 'Norwige', sans-serif;
  font-size: clamp(4rem, 15vw, 120px);
  font-weight: 800;
  line-height: 1;
`;

const AnimationSection = styled.section`
  position: relative;
  width: 100%;
  height: 500vh; /* Natural height for scrolling */
  background: black;
`;

const StickyContainer = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;

  @media (max-width: 768px) {
    filter: brightness(0.6);
  }
`;

const DimOverlay = styled.div<{ $opacity: number }>`
  position: absolute;
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: ${props => props.$isVisible ? 'flex' : 'none'};
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
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 3;
  display: ${props => props.$isVisible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  flex-direction: column; 
  gap: 0.5rem; /* Reduced gap for stacking context on mobile */
  padding: 0 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 15rem;
    padding: 0 5%;
  }
`;

const CreativeText = styled.div`
  color: #FFF4E3;
  font-family: 'Norwige Light', sans-serif;
  font-size: clamp(2.5rem, 12vw, 100px); /* Slightly smaller min-size for mobile */
  font-weight: 300;
  font-style: normal;
  letter-spacing: 0.02em;
  line-height: 110%;
  text-align: center;
  flex: 1;
  width: 100%;
  max-width: 100%;
  
  @media (min-width: 768px) {
    text-align: right;
    max-width: 50%;
    line-height: 150%;
    font-size: clamp(3rem, 10vw, 100px);
  }
`;

const ChangingWord = styled.div`
  color: #FFF4E3;
  font-family: 'Norwige', sans-serif;
  font-size: clamp(2.5rem, 12vw, 100px); /* Matching mobile size adjustment */
  font-weight: 800;
  font-style: italic;
  letter-spacing: -1px; /* Tighter letter spacing on mobile */
  line-height: 110%;
  text-align: center;
  flex: 1;
  width: 100%;
  max-width: 100%;
  
  @media (min-width: 768px) {
    text-align: left;
    max-width: 50%;
    line-height: 150%;
    letter-spacing: -2.2px;
    font-size: clamp(3rem, 10vw, 100px);
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const creativeRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  const isFirstRun = useRef(true);
  const [showHero, setShowHero] = useState(true);
  const [currentWord, setCurrentWord] = useState("Identity");
  const [dimOpacity, setDimOpacity] = useState(0);

  // New loading states
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const totalFrames = 652;
    // Optimization: Skip frames to reduce load time and memory usage
    // Mobile: Every 3rd frame (~217 frames)
    // Desktop: Every 2nd frame (~326 frames) - still high quality but much lighter
    const isMobile = window.innerWidth < 768;
    const stride = isMobile ? 3 : 2;

    // Calculate actual frames to load based on stride
    const currentFrame = (index: number) => {
      return `/assets/SpiralShotHorizontalV2Frames/SpiralShotHorizontal60fpsV2_${index.toString().padStart(5, '0')}.webp`;
    };

    const images: HTMLImageElement[] = [];
    const animation = {
      frame: 0
    };

    let loadedCount = 0;
    const framesToLoad: number[] = [];

    // Calculate which frame indices to load
    for (let i = 0; i < totalFrames; i += stride) {
      framesToLoad.push(i);
    }

    const totalFramesToLoad = framesToLoad.length;

    // Preload selected images
    framesToLoad.forEach((frameIndex) => {
      const img = new Image();
      img.src = currentFrame(frameIndex);
      img.onload = () => {
        loadedCount++;
        const progress = Math.round((loadedCount / totalFramesToLoad) * 100);
        setLoadProgress(progress);

        if (loadedCount === totalFramesToLoad) {
          setIsLoading(false); // All images loaded
          window.dispatchEvent(new Event("rov-site-loaded"));
        }
      };
      images.push(img);
    });

    // Dispatch initial loading event
    window.dispatchEvent(new Event("rov-site-loading"));

    // Render function
    function render() {
      if (!context || !canvas) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      // Validating images[animation.frame] exists is crucial
      if (images[animation.frame] && images[animation.frame].complete) {
        // Draw image to fill canvas while maintaining aspect ratio
        const img = images[animation.frame];
        const imgAspect = img.width / img.height;
        const canvasAspect = canvas.width / canvas.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgAspect;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgAspect;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        }

        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    }

    // Only initialize GSAP after loading is complete
    if (!isLoading) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5, // slightly smoother scrub
        onUpdate: (self) => {
          const progress = self.progress;

          // Map progress to the REDUCED number of frames
          const frameIndex = Math.min(
            Math.floor(progress * (totalFramesToLoad - 1)),
            totalFramesToLoad - 1
          );
          animation.frame = frameIndex;
          render();

          // Update words based on progress
          if (progress < 0.2) {
            setCurrentWord("Identity");
            setDimOpacity(0);
            setShowHero(true);
          } else if (progress < 0.4) {
            setCurrentWord("Systems");
            setDimOpacity(0);
            setShowHero(true);
          } else if (progress < 0.6) {
            setCurrentWord("Strategy");
            setDimOpacity(0);
            setShowHero(true);
          } else {
            // Fade out
            const fadeProgress = Math.min((progress - 0.6) / 0.4, 1);
            setDimOpacity(fadeProgress);
            if (progress > 0.95) {
              setShowHero(false);
            }
          }
        }
      });
      // Initial render once loaded
      render();
    }


    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isLoading]); // Re-run effect when isLoading changes

  // Animate the changing word
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    if (wordRef.current) {
      gsap.fromTo(wordRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );

      gsap.fromTo(wordRef.current,
        { backgroundPosition: "200% center" },
        { backgroundPosition: "-200% center", duration: 1, ease: "power2.inOut" }
      );
    }
  }, [currentWord]);

  return (
    <AnimationSection ref={sectionRef}>
      <LoadingOverlay $isLoaded={!isLoading}>
        <LoadingText>SYSTEM OPTIMIZING...</LoadingText>
        <ProgressNumber>{loadProgress}%</ProgressNumber>
      </LoadingOverlay>

      <StickyContainer>
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
      </StickyContainer>
    </AnimationSection>
  );
};

export default HeroWithAnimation;
