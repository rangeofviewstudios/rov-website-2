import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin
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

const ScrollAnimation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
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
        gsap.to(animation, {
            frame: frameCount - 1,
            snap: 'frame',
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                scrub: 0.5,
                pin: canvas,
                start: 'top top',
                end: '+=500%',
            },
            onUpdate: render
        });

        // Render first frame when loaded
        images[0].onload = render;

        // Cleanup
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <AnimationSection ref={sectionRef}>
            <Canvas ref={canvasRef} />
        </AnimationSection>
    );
};

export default ScrollAnimation;
