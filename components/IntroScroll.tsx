"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function IntroScroll() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // ===============================================================
        // CONFIGURATION - 652 frames (00000 to 00651)
        // ===============================================================
        const frameCount = 652;
        const urls = new Array(frameCount).fill(0).map((_, i) => {
            const frameNumber = String(i).padStart(5, "0");
            return `/videoFrames/SpiralShotHorizontal60fpsV2_${frameNumber}.webp`;
        });

        // ===============================================================
        // RESIZE HANDLER
        // ===============================================================
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ScrollTrigger.refresh();
        };
        window.addEventListener("resize", handleResize);
        handleResize();

        // ===============================================================
        // IMAGE SEQUENCE FUNCTION
        // ===============================================================
        let playhead = { frame: 0 };
        const images: HTMLImageElement[] = [];

        const updateImage = () => {
            const img = images[Math.round(playhead.frame)];
            if (!img || !img.width || !img.height) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Scale like CSS "background-size: cover"
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);
            const centerShiftX = (canvas.width - img.width * ratio) / 2;
            const centerShiftY = (canvas.height - img.height * ratio) / 2;

            ctx.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                centerShiftX,
                centerShiftY,
                img.width * ratio,
                img.height * ratio
            );
        };

        // Preload all images
        let firstImageLoaded = false;
        urls.forEach((url, i) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                if (i === 0 && !firstImageLoaded) {
                    firstImageLoaded = true;
                    updateImage();
                    canvas.style.visibility = "visible";
                    setIsLoaded(true);
                }
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${url}`);
            };
            images.push(img);
        });

        // ===============================================================
        // GSAP SCROLL ANIMATION WITH LENIS INTEGRATION
        // ===============================================================
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                pin: canvas,
                anticipatePin: 1,
            },
        });

        // Animate through frames
        tl.to(playhead, {
            frame: frameCount - 1,
            ease: "none",
            onUpdate: updateImage,
        });

        // Fade out canvas at 90%
        tl.to(
            canvas,
            {
                opacity: 0,
                ease: "power2.inOut",
            },
            0.9
        );

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full"
            style={{ height: "300vh" }}
        >
            {/* Canvas */}
            <canvas
                ref={canvasRef}
                className="fixed top-0 left-0 w-full h-screen"
                style={{
                    visibility: isLoaded ? "visible" : "hidden",
                }}
            />

            {/* Loading indicator */}
            {!isLoaded && (
                <div className="fixed inset-0 flex items-center justify-center bg-black text-white z-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-xl">Loading experience...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
