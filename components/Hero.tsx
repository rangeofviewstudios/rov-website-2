import React from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

// Global styles for custom fonts
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'FlightMaybeMaj';
    src: url('/fonts/Flight mAybe Maj.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'ProximaNovaBlack';
    src: url('/fonts/proximanova_black.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
`;

// Keyframes for animations
const slideInTop = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const typing = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const blinkCaret = keyframes`
  from, to {
    border-color: transparent;
  }
  50% {
    border-color: white;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Styled Components
const Container = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  color: white;
  font-family: 'ProximaNovaBlack', sans-serif;

  @media (max-width: 768px) {
    padding: 60px 10px;
  }
`;

const VideoBackground = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  z-index: 0;
`;

const SlideInTop = styled.div`
  animation: ${slideInTop} 1s ease-out forwards;
`;

const SlideInRight = styled.div`
  animation: ${slideInRight} 1s ease-out forwards;
`;

const TypingText = styled.div`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  letter-spacing: 0.15em;
  opacity: 0;
  font-family: 'ProximaNovaBlack', sans-serif;
  animation: 
    ${fadeIn} 0.1s 1.2s forwards,
    ${typing} 4s steps(40, end) 1s forwards,
    ${blinkCaret} 0.75s step-end 1s infinite;
  border-right: 0.15em solid white;
  font-size: 1.2rem;
  z-index: 2;

  @media (max-width: 768px) {
    font-size: 0.44rem;
    letter-spacing: 0.05em;
  }
`;

const Logo = styled(SlideInTop)`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 2;

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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const CenterImage = styled(SlideInRight)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Heading = styled(SlideInTop)`
  position: absolute;
  top: 20px;
  right: 20px;
  text-align: right;
  font-family: 'FlightMaybeMaj', sans-serif;
  z-index: 2;

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;

    div {
      font-size: 1.5rem !important;
    }
  }
`;

const TypingTextWrapper = styled.div`
  text-align: center;
  padding: 0 20px;
  margin-top: -20px;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 0 10px;
    margin-top: -10px;
  }
`;

const Hero: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Container>
        <VideoBackground
          autoPlay
          loop
          muted
          playsInline
          src="/intro.mp4"
        />
        <Logo>
          <img
            src="rov-logo.webp"
            alt="ROV Logo"
          />
        </Logo>
        {/*
        <ContentWrapper>
          <CenterImage>
            <img
              src="rov-colour.webp"
              alt="ROV"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </CenterImage>
          <TypingTextWrapper>
            <TypingText>
              Making Brands Competitive in the New Digital Era.
            </TypingText>
          </TypingTextWrapper>
        </ContentWrapper>
        */}
        <Heading>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: '1.2' }}>
            CREATIVE<br />STUDIO
          </div>
        </Heading>
      </Container>
    </>
  );
};

export default Hero;

{/*
  
import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Global styles for custom fonts
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'FlightMaybeMaj';
    src: url('/fonts/Flight mAybe Maj.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'ProximaNovaBlack';
    src: url('/fonts/proximanova_black.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
`;

// Keyframes for animations
const slideInTop = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const typing = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const blinkCaret = keyframes`
  from, to {
    border-color: transparent;
  }
  50% {
    border-color: white;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Styled Components
const Container = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  color: white;
  font-family: 'ProximaNovaBlack', sans-serif;

  @media (max-width: 768px) {
    padding: 60px 10px;
  }
`;

const CanvasWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
`;

const CanvasBackground = styled.canvas`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  z-index: 0;
`;

const SlideInTop = styled.div`
  animation: ${slideInTop} 1s ease-out forwards;
`;

const SlideInRight = styled.div`
  animation: ${slideInRight} 1s ease-out forwards;
`;

const TypingText = styled.div`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  letter-spacing: 0.15em;
  opacity: 0;
  font-family: 'ProximaNovaBlack', sans-serif;
  animation: 
    ${fadeIn} 0.1s 1.2s forwards,
    ${typing} 4s steps(40, end) 1s forwards,
    ${blinkCaret} 0.75s step-end 1s infinite;
  border-right: 0.15em solid white;
  font-size: 1.2rem;
  z-index: 2;

  @media (max-width: 768px) {
    font-size: 0.44rem;
    letter-spacing: 0.05em;
  }
`;

const Logo = styled(SlideInTop)`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 2;

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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const CenterImage = styled(SlideInRight)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Heading = styled(SlideInTop)`
  position: absolute;
  top: 20px;
  right: 20px;
  text-align: right;
  font-family: 'FlightMaybeMaj', sans-serif;
  z-index: 2;

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;

    div {
      font-size: 1.5rem !important;
    }
  }
`;

const TypingTextWrapper = styled.div`
  text-align: center;
  padding: 0 20px;
  margin-top: -20px;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 0 10px;
    margin-top: -10px;
  }
`;

function imageSequence(config) {
  let playhead = { frame: 0 };
  let ctx = gsap.utils.toArray(config.canvas)[0].getContext("2d");
  let onUpdate = config.onUpdate;
  let images;
  let canvas = config.canvas;
  let container = config.container;

  const updateImage = function() {
    const img = images[Math.round(playhead.frame)];
    if (!img) return;

    // Calculate aspect ratios
    const containerAspect = container.clientWidth / container.clientHeight;
    const imageAspect = img.width / img.height;

    let renderWidth, renderHeight, offsetX = 0, offsetY = 0;

    if (imageAspect > containerAspect) {
      // Image is wider than container - fit to height
      renderHeight = container.clientHeight;
      renderWidth = renderHeight * imageAspect;
      offsetX = (container.clientWidth - renderWidth) / 2;
    } else {
      // Image is taller than container - fit to width
      renderWidth = container.clientWidth;
      renderHeight = renderWidth / imageAspect;
      offsetY = (container.clientHeight - renderHeight) / 2;
    }

    // Clear and draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

    onUpdate && onUpdate.call(this);
  };

  images = config.urls.map((url, i) => {
    let img = new Image();
    img.src = url;
    i || (img.onload = updateImage);
    return img;
  });

  return gsap.to(playhead, {
    frame: images.length - 1,
    ease: "none",
    onUpdate: updateImage,
    scrollTrigger: config.scrollTrigger
  });
}

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !canvasWrapperRef.current) return;

    // Set canvas dimensions
    canvasRef.current.width = dimensions.width;
    canvasRef.current.height = dimensions.height;

    // Generate image URLs
    const urls = [];
    const startNum = 86504;
    const endNum = 86761;
    
    for (let i = startNum; i <= endNum; i++) {
      const numStr = String(i).padStart(8, '0');
      urls.push(`/image_sequence_horizontal/spiralShotHorizontal${numStr}.webp`);
    }

    // Initialize image sequence
    const sequence = imageSequence({
      urls,
      canvas: canvasRef.current,
      container: canvasWrapperRef.current,
      scrollTrigger: {
        trigger: canvasWrapperRef.current,
        start: "top top",
        end: "+=100%",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Additional logic during scroll if needed
        },
        onComplete: () => {
          // Sequence completed
        }
      }
    });

    return () => {
      sequence.scrollTrigger?.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [dimensions]);

  return (
    <>
      <GlobalStyle />
      <Container>
        <CanvasWrapper ref={canvasWrapperRef}>
          <CanvasBackground 
            ref={canvasRef} 
          />
        </CanvasWrapper>
        <Logo>
          <img
            src="rov-logo.webp"
            alt="ROV Logo"
          />
        </Logo>
        <Heading>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: '1.2' }}>
            CREATIVE<br />STUDIO
          </div>
        </Heading>
      </Container>
    </>
  );
};

export default Hero;

*/}