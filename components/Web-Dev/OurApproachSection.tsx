"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

type ApproachStep = {
  title: string;
  points: string[];
  description?: string;
  accentColor: string;
  textColor: string;
  bgColor: string;
};

const approachSteps: ApproachStep[] = [
  {
    title: "IDEATE",
    points: ["Discovery Deep Dive", "Strategic Alignment"],
    accentColor: "#FFF4E3",
    textColor: "#FFF4E3",
    bgColor: "#1A1A1A"
  },
  {
    title: "FILM",
    points: [],
    description: "Capture the essence of your vision with high-quality visuals, lighting, and direction – turning ideas into reality.",
    accentColor: "linear-gradient(135deg, #EA9A61 0%, #B16937 50%, #A64D2B 100%)",
    textColor: "#FFF4E3",
    bgColor: "#2A2420"
  },
  {
    title: "EDIT",
    points: ["Discovery Deep Dive", "Strategic Alignment"],
    accentColor: "#FFF4E3",
    textColor: "#FFF4E3",
    bgColor: "#1A1A1A"
  },
  {
    title: "POLISH",
    points: ["Discovery Deep Dive"],
    accentColor: "#FFF4E3",
    textColor: "#FFF4E3",
    bgColor: "#1A1A1A"
  }
];

export default function OurApproachSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Set up perspective on parent
    if (sectionRef.current) {
      gsap.set(sectionRef.current, {
        perspective: 2000,
        transformStyle: "preserve-3d"
      });
    }

    // Set up scroll triggers for each card
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      // Set initial 3D properties
      gsap.set(card, {
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
      });

      // Set initial text colors
      const title = card.querySelector('.step-title');
      const texts = card.querySelectorAll('.step-text');
      if (title) {
        gsap.set(title, { color: "#FFF4E3" });
      }
      if (texts) {
        gsap.set(texts, { color: "#FFF4E3" });
      }

      ScrollTrigger.create({
        trigger: card,
        start: "top center+=100",
        end: "bottom center-=100",
        onEnter: () => {
          const title = card.querySelector('.step-title');
          const texts = card.querySelectorAll('.step-text');

          // Float effect: lift the card and make it visible with new styling
          gsap.to(card, {
            z: 100,
            scale: 1.02,
            boxShadow: "0 50px 100px rgba(0, 0, 0, 0.5)",
            borderTop: "2px solid rgba(255, 255, 255, 0.14)",
            borderBottom: "2px solid rgba(255, 255, 255, 0.14)",
            borderLeft: "none",
            borderRight: "none",
            backgroundColor: "#1C1614",
            duration: 0.6,
            ease: "power2.out"
          });

          // Apply gradient to ALL titles when active
          if (title) {
            gsap.to(title, {
              duration: 0.6,
              ease: "power2.out",
              onStart: () => {
                (title as HTMLElement).style.background = "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)";
                (title as HTMLElement).style.webkitBackgroundClip = "text";
                (title as HTMLElement).style.backgroundClip = "text";
                (title as HTMLElement).style.webkitTextFillColor = "transparent";
              }
            });
          }
          if (texts) gsap.to(texts, { color: "#FFFFFF", duration: 0.6, ease: "power2.out" });
        },
        onLeave: () => {
          const title = card.querySelector('.step-title');
          const texts = card.querySelectorAll('.step-text');

          // Return to invisible state
          gsap.to(card, {
            z: 0,
            scale: 1,
            boxShadow: "none",
            borderTop: "none",
            borderBottom: "none",
            backgroundColor: "rgba(0, 0, 0, 0)",
            duration: 0.6,
            ease: "power2.out"
          });

          // Return all text colors to cream (remove gradient)
          if (title) {
            gsap.to(title, {
              color: "#FFF4E3",
              duration: 0.6,
              ease: "power2.out",
              onStart: () => {
                (title as HTMLElement).style.background = "transparent";
                (title as HTMLElement).style.webkitBackgroundClip = "unset";
                (title as HTMLElement).style.backgroundClip = "unset";
                (title as HTMLElement).style.webkitTextFillColor = "#FFF4E3";
              }
            });
          }
          if (texts) gsap.to(texts, { color: "#FFF4E3", duration: 0.6, ease: "power2.out" });
        },
        onEnterBack: () => {
          const title = card.querySelector('.step-title');
          const texts = card.querySelectorAll('.step-text');

          // Float effect when scrolling back up
          gsap.to(card, {
            z: 100,
            scale: 1.02,
            boxShadow: "0 50px 100px rgba(0, 0, 0, 0.5)",
            borderTop: "2px solid rgba(255, 255, 255, 0.14)",
            borderBottom: "2px solid rgba(255, 255, 255, 0.14)",
            borderLeft: "none",
            borderRight: "none",
            backgroundColor: "#1C1614",
            duration: 0.6,
            ease: "power2.out"
          });

          // Apply gradient to ALL titles when active
          if (title) {
            gsap.to(title, {
              duration: 0.6,
              ease: "power2.out",
              onStart: () => {
                (title as HTMLElement).style.background = "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)";
                (title as HTMLElement).style.webkitBackgroundClip = "text";
                (title as HTMLElement).style.backgroundClip = "text";
                (title as HTMLElement).style.webkitTextFillColor = "transparent";
              }
            });
          }
          if (texts) gsap.to(texts, { color: "#FFFFFF", duration: 0.6, ease: "power2.out" });
        },
        onLeaveBack: () => {
          const title = card.querySelector('.step-title');
          const texts = card.querySelectorAll('.step-text');

          // Return to invisible state when scrolling back past
          gsap.to(card, {
            z: 0,
            scale: 1,
            boxShadow: "none",
            borderTop: "none",
            borderBottom: "none",
            backgroundColor: "rgba(0, 0, 0, 0)",
            duration: 0.6,
            ease: "power2.out"
          });

          // Return all text colors to cream (remove gradient)
          if (title) {
            gsap.to(title, {
              color: "#FFF4E3",
              duration: 0.6,
              ease: "power2.out",
              onStart: () => {
                (title as HTMLElement).style.background = "transparent";
                (title as HTMLElement).style.webkitBackgroundClip = "unset";
                (title as HTMLElement).style.backgroundClip = "unset";
                (title as HTMLElement).style.webkitTextFillColor = "#FFF4E3";
              }
            });
          }
          if (texts) gsap.to(texts, { color: "#FFF4E3", duration: 0.6, ease: "power2.out" });
        }
      });
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8"
      style={{
        perspective: "2000px",
        transformStyle: "preserve-3d"
      }}
    >
      {/* Gradient Blob */}
      <div
        className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[700px] lg:h-[700px] rounded-full pointer-events-none z-0"
        style={{
          background: 'rgba(96, 62, 37, 0.60)',
          filter: 'blur(200px)',
          transform: 'translate(-20%, 20%)'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <h2
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-16 md:mb-24"
          style={{
            fontFamily: "Norwige, sans-serif",
            fontStyle: "italic",
            color: "#FFF4E3"
          }}
        >
          Our Approach
        </h2>

        {/* Stacked Cards */}
        <div className="relative space-y-6 md:space-y-8">
          {approachSteps.map((step, index) => (
            <div
              key={index}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="relative rounded-3xl overflow-hidden transition-all duration-300"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0)",
                border: "1px solid rgba(255, 244, 227, 0)",
                boxShadow: "none",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden"
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 p-8 md:p-12 lg:p-16">
                {/* Left Side - Title */}
                <div className="flex items-center">
                  <h3
                    className="step-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold leading-none"
                    style={{
                      fontFamily: "Norwige, sans-serif",
                      fontStyle: "italic"
                    }}
                  >
                    {step.title}
                  </h3>
                </div>

                {/* Right Side - Points or Description */}
                <div className="flex flex-col justify-center space-y-4 md:space-y-6">
                  {step.points.length > 0 ? (
                    step.points.map((point, pointIndex) => (
                      <p
                        key={pointIndex}
                        className="step-text text-lg md:text-xl lg:text-2xl font-medium"
                        style={{
                          fontFamily: "Roboto, sans-serif"
                        }}
                      >
                        {point}
                      </p>
                    ))
                  ) : (
                    step.description && (
                      <p
                        className="step-text text-base md:text-lg lg:text-xl leading-relaxed"
                        style={{
                          fontFamily: "Roboto, sans-serif"
                        }}
                      >
                        {step.description}
                      </p>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
