"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SectionContainer = styled.section`
  width: 100%;
  padding: 60px 64px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 40px 24px;
  }
`;

const BannerCard = styled.div`
  display: flex;
  width: 100%;
  max-width: 100%;
  min-height: 280px;
  padding: 60px 60px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 15px;
  position: relative;
  z-index: 10;
  border: 1px solid #F99288;
  background: linear-gradient(111deg, rgba(234, 154, 97, 1) 0%, rgba(177, 105, 55, 1) 50%, rgba(166, 77, 43, 1) 75%, rgba(66, 32, 28, 1) 100%);
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  
  @media (max-width: 968px) {
    padding: 40px;
    gap: 30px;
    min-height: auto;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  gap: 60px;
  position: relative;
  
  @media (max-width: 968px) {
    flex-direction: column;
    gap: 30px;
    align-items: center;
  }
`;

const LeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  flex: 1;
  
  @media (max-width: 968px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const LogoCircle = styled.div`
  width: 120px;
  height: 120px;
  background-color: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  img {
    width: 70px;
    height: auto;
  }
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    
    img {
      width: 60px;
    }
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: #FFF;
  margin: 0;
  font-family: 'Norwige', sans-serif;
  
  @media (max-width: 968px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #FFF;
  margin: 0;
  font-family: 'Norwige Light', sans-serif;
  
  @media (max-width: 968px) {
    font-size: 1rem;
  }
`;

const RightContent = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  position: absolute;
  bottom: 30px;
  right: 80px;
  
  @media (max-width: 968px) {
    position: relative;
    justify-content: center;
    bottom: 0;
    right: 0;
  }
`;

const ArrowButton = styled(motion.button)`
  width: 80px;
  height: 80px;
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
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  svg {
    width: 28px;
    height: 28px;
    stroke: #000;
  }
  
  &::before {
    content: '';
    position: absolute;
    width: 80px;
    height: 80px;
    left: -50px;
    border-radius: 50%;
    border: 2px solid #FFF4E3;
    background: transparent;
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 80px;
    height: 80px;
    right: -50px;
    border-radius: 50%;
    border: 2px solid #FFF4E3;
    background: transparent;
    z-index: -1;
  }
`;

const CTAButton = styled(motion.a)`
  display: inline-block;
  text-decoration: none;
  padding: 22px 50px;
  border: none;
  border-radius: 50px;
  background-color: #000;
  color: #FFF;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-family: 'Norwige', sans-serif;
  position: relative;
  z-index: 1;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 15px 30px;
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
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          background: 'rgba(96, 62, 37, 0.60)',
          filter: 'blur(200px)',
          transform: 'translate(-30%, -30%)'
        }}
      />
      {/* Bottom Right Gradient Blob */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          background: 'rgba(96, 62, 37, 0.60)',
          filter: 'blur(200px)',
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
