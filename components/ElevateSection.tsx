"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SectionContainer = styled.section`
  width: 100%;
  padding: 80px 120px;
  background-color: #d3d3d3;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 120px;
  
  @media (max-width: 768px) {
    padding: 60px 40px;
    flex-direction: column;
    gap: 40px;
  }
`;

const LeftContent = styled.div`
  flex: 0 1 45%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 5.5rem;
  font-weight: 900;
  line-height: 1.1;
  color: #000;
  margin: 0;
  font-family: 'Anton', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const RightContent = styled.div`
  flex: 0 1 45%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 30px;
  
  @media (max-width: 768px) {
    align-items: center;
  }
`;

const Description = styled.p`
  font-size: 1.35rem;
  line-height: 1.8;
  color: #333;
  text-align: right;
  max-width: 500px;
  margin: 0;
  
  @media (max-width: 768px) {
    text-align: center;
    font-size: 1rem;
  }
`;

const CTA = styled(motion.a)`
  display: inline-block;
  text-decoration: none;
  padding: 18px 36px;
  border: none;
  border-radius: 50px;
  background-color: #000;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    align-self: center;
  }
`;

const ElevateSection: React.FC = () => {
  return (
    <SectionContainer>
      <LeftContent>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <Title>Elevate Your<br />Brand Today</Title>
        </motion.div>
      </LeftContent>

      <RightContent>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <Description>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
          </Description>
        </motion.div>

        <CTA
          href="https://calendly.com/rangeofviewmusic/30min"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          viewport={{ once: true, margin: '-100px' }}
          whileHover={{ scale: 1.05 }}
        >
          Tell Us About Your Project
        </CTA>
      </RightContent>
    </SectionContainer>
  );
};

export default ElevateSection;
