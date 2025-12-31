"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SectionContainer = styled.section`
  width: 100%;
  padding: clamp(2.5rem, 5vw, 3.75rem) clamp(1.5rem, 5vw, 4rem);
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  @media (max-width: 768px) {
    padding: clamp(2rem, 4vw, 2.5rem) clamp(1rem, 4vw, 1.5rem);
  }
`;

const BannerCard = styled.div`
  display: flex;
  width: 100%;
  max-width: 100%;
  min-height: clamp(16rem, 20vw, 17.5rem);
  padding: clamp(2.5rem, 4vw, 3.75rem) clamp(2rem, 4vw, 3.75rem);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: clamp(0.75rem, 1.5vw, 0.9375rem);
  position: relative;
  z-index: 10;
  border: 1px solid #F99288;
  background: linear-gradient(111deg, rgba(234, 154, 97, 1) 0%, rgba(177, 105, 55, 1) 50%, rgba(166, 77, 43, 1) 75%, rgba(66, 32, 28, 1) 100%);
  box-shadow: 0 0.25rem 0.25rem 0 rgba(0, 0, 0, 0.25);
  
  @media (max-width: 968px) {
    padding: clamp(2rem, 5vw, 2.5rem);
    gap: clamp(1.5rem, 4vw, 1.875rem);
    min-height: auto;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  gap: clamp(2rem, 5vw, 3.75rem);
  position: relative;
  
  @media (max-width: 968px) {
    flex-direction: column;
    gap: clamp(1.5rem, 4vw, 1.875rem);
    align-items: center;
  }
`;

const LeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  flex: 1;
  
  @media (max-width: 968px) {
    flex-direction: column;
    gap: clamp(1rem, 3vw, 1.25rem);
  }
`;

const LogoCircle = styled.div`
  width: clamp(5rem, 8vw, 7.5rem);
  height: clamp(5rem, 8vw, 7.5rem);
  background-color: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  img {
    width: 58%;
    height: auto;
  }
  
  @media (max-width: 768px) {
    width: clamp(4rem, 12vw, 6.25rem);
    height: clamp(4rem, 12vw, 6.25rem);
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1vw, 0.75rem);
`;

const Title = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 700;
  line-height: 1.2;
  color: #FFF;
  margin: 0;
  font-family: 'Norwige', sans-serif;
  
  @media (max-width: 968px) {
    font-size: clamp(1.25rem, 4vw, 2rem);
  }
  
  @media (max-width: 480px) {
    font-size: clamp(1.125rem, 5vw, 1.5rem);
  }
`;

const Description = styled.p`
  font-size: clamp(0.875rem, 1.5vw, 1.1rem);
  line-height: 1.6;
  color: #FFF;
  margin: 0;
  font-family: 'Norwige Light', sans-serif;
  
  @media (max-width: 968px) {
    font-size: clamp(0.8125rem, 2vw, 1rem);
  }
`;

const RightContent = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 1.5vw, 0.9375rem);
  position: absolute;
  bottom: 8%;
  right: 5%;
  
  @media (max-width: 968px) {
    position: relative;
    justify-content: center;
    bottom: 0;
    right: 0;
  }
`;

const ArrowButton = styled(motion.button)`
  width: clamp(3.75rem, 6vw, 5rem);
  height: clamp(3.75rem, 6vw, 5rem);
  border-radius: 50%;
  background-color: #FFF4E3;
  border: 2px solid #FFF4E3;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.15);
  }
  
  svg {
    width: 35%;
    height: 35%;
    stroke: #000;
  }
  
  @media (min-width: 969px) {
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      left: -62.5%;
      border-radius: 50%;
      border: 2px solid #FFF4E3;
      background: transparent;
      z-index: -1;
    }
    
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      right: -62.5%;
      border-radius: 50%;
      border: 2px solid #FFF4E3;
      background: transparent;
      z-index: -1;
    }
  }

  @media (max-width: 968px) {
    width: clamp(3rem, 10vw, 3.75rem);
    height: clamp(3rem, 10vw, 3.75rem);
  }
`;

const CTAButton = styled(motion.a)`
  display: inline-block;
  text-decoration: none;
  padding: clamp(0.9375rem, 2vw, 1.375rem) clamp(1.875rem, 4vw, 3.125rem);
  border: none;
  border-radius: 3.125rem;
  background-color: #000;
  color: #FFF;
  font-size: clamp(0.875rem, 1.5vw, 1.2rem);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-family: 'Norwige', sans-serif;
  position: relative;
  z-index: 1;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 480px) {
    font-size: clamp(0.75rem, 3vw, 1rem);
    padding: clamp(0.75rem, 3vw, 0.9375rem) clamp(1.25rem, 5vw, 1.875rem);
  }
`;

const ElevateSection: React.FC = () => {
  return (
    <SectionContainer>
      {/* Top Left Gradient Blob */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 'clamp(25rem, 50vw, 50rem)',
          height: 'clamp(25rem, 50vw, 50rem)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          background: 'rgba(96, 62, 37, 0.60)',
          filter: 'blur(clamp(6.25rem, 12.5vw, 12.5rem))',
          transform: 'translate(-30%, -30%)'
        }}
      />
      {/* Bottom Right Gradient Blob */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 'clamp(25rem, 50vw, 50rem)',
          height: 'clamp(25rem, 50vw, 50rem)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          background: 'rgba(96, 62, 37, 0.60)',
          filter: 'blur(clamp(6.25rem, 12.5vw, 12.5rem))',
          transform: 'translate(30%, 30%)'
        }}
      />
      <BannerCard>
        <ContentWrapper>
          <LeftContent>
            <LogoCircle>
              <img src="/rov-logo.webp" alt="ROV Logo" />
            </LogoCircle>

            <TextContent>
              <Title>Got a project in mind?</Title>
              <Description>
                From web and video to sound and AI,<br />
                we shape ideas into experiences that connect.
              </Description>
            </TextContent>
          </LeftContent>

          <RightContent>
            <ArrowButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('https://calendly.com/rangeofviewmusic/30min', '_blank')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </ArrowButton>

            <CTAButton
              href="https://calendly.com/rangeofviewmusic/30min"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              LET'S CREATE!
            </CTAButton>
          </RightContent>
        </ContentWrapper>
      </BannerCard>
    </SectionContainer>
  );
};

export default ElevateSection;
