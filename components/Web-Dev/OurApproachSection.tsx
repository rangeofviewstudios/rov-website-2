import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.1,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Help with sync
    ScrollTrigger.normalizeScroll(true);
    ScrollTrigger.config({ limitCallbacks: true });

    const panels = gsap.utils.toArray<HTMLElement>(".card-panel");
    const lastPanel = panels[panels.length - 1];

    panels.forEach((panel, index) => {
      const isLast = index === panels.length - 1;
      if (isLast) return;

      const inner = panel.querySelector<HTMLElement>(".card-inner");
      if (!inner) return;

      const calculateLayout = () => {
        const panelHeight = inner.offsetHeight;
        const windowHeight = window.innerHeight;
        const difference = panelHeight - windowHeight;
        const fakeScrollRatio = difference > 0 ? difference / (difference + windowHeight) : 0;

        if (fakeScrollRatio) {
          panel.style.marginBottom = `${panelHeight * fakeScrollRatio}px`;
        } else {
          panel.style.marginBottom = "0px";
        }
        return { fakeScrollRatio, innerHeight: inner.offsetHeight, windowHeight };
      };

      const { fakeScrollRatio, windowHeight: wh } = calculateLayout();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "bottom bottom",
          end: fakeScrollRatio ? `+=${inner.offsetHeight}` : "bottom top",
          pin: true,
          pinSpacing: false,
          scrub: 1,
          anticipatePin: 1,
          fastScrollEnd: true,
          preventOverlaps: true,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            if (self.isActive) {
              setActiveCardIndex(index);
            }
          }
        },
      });

      if (fakeScrollRatio) {
        tl.to(inner, {
          yPercent: -100,
          y: wh,
          duration: 1 / (1 - fakeScrollRatio) - 1,
          ease: "none",
        });
      }

      tl.fromTo(
        panel,
        { scale: 1, opacity: 1 },
        {
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut"
        }
      );
    });

    // Special trigger for the last card to become active
    ScrollTrigger.create({
      trigger: lastPanel,
      start: "top 80%",
      end: "bottom center",
      onToggle: (self) => {
        if (self.isActive) {
          setActiveCardIndex(panels.length - 1);
        }
      }
    });

    return () => {
      ScrollTrigger.normalizeScroll(false);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, { scope: containerRef }); // Removed dependencies to avoid re-creating triggers

  useEffect(() => {
    // When active card index changes, the layout might shift after transition
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 700);
    return () => clearTimeout(timer);
  }, [activeCardIndex]);

  useEffect(() => {
    if (modalIndex !== null) {
      document.documentElement.classList.add("lenis-stopped");
      document.body.classList.add("lenis-stopped");
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      lenisRef.current?.stop();
    } else {
      document.documentElement.classList.remove("lenis-stopped");
      document.body.classList.remove("lenis-stopped");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      lenisRef.current?.start();
    }
  }, [modalIndex]);

  const toggleCard = (index: number) => {
    openModal(index);
  };

  const openModal = (index: number) => {
    setModalIndex(index);

    gsap.fromTo(
      modalRef.current,
      { opacity: 0, visibility: "hidden" },
      { opacity: 1, visibility: "visible", duration: 0.4, ease: "power2.out" }
    );

    gsap.fromTo(
      modalContentRef.current,
      { scale: 0.9, y: 40, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.6, delay: 0.1, ease: "power3.out" }
    );
  };

  const closeModal = () => {
    gsap.to(modalContentRef.current, {
      scale: 0.9,
      y: 40,
      opacity: 0,
      duration: 0.4,
      ease: "power3.in",
    });

    gsap.to(modalRef.current, {
      opacity: 0,
      visibility: "hidden",
      duration: 0.4,
      delay: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setModalIndex(null);
      },
    });
  };

  return (
    <section
      className="relative w-full bg-black py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8"
    >
      {/* Gradient Blobs */}
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(234, 154, 97, 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div
        className="absolute top-1/4 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(177, 105, 55, 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10" ref={containerRef}>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24">
          <h2
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold"
            style={{
              fontFamily: "Norwige, sans-serif",
              fontStyle: "italic",
              color: "#FFF4E3",
            }}
          >
            Our Approach
          </h2>
          <p className="text-[#FFF4E3]/40 font-mono text-sm tracking-widest mt-4 md:mt-0 md:mb-4">
            PHASE [01-04]
          </p>
        </div>

        {/* Stacked Cards */}
        <div className="relative flex flex-col items-center w-full">
          {approachSteps.map((step, index) => (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              onClick={() => toggleCard(index)}
              className="card-panel relative w-full rounded-[2.5rem] overflow-hidden cursor-pointer group mb-12"
              style={{
                backgroundColor: activeCardIndex === index ? "#1E1A17" : "#111111",
                border: activeCardIndex === index
                  ? "1px solid rgba(234, 154, 97, 0.3)"
                  : "1px solid rgba(255, 255, 255, 0.08)",
                minHeight: "calc(100vh - 120px)",
                display: "flex",
                flexDirection: "column",
                transition: "background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
                zIndex: activeCardIndex === index ? 40 : 10 + index,
                boxShadow: activeCardIndex === index
                  ? "0 40px 100px -20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(234, 154, 97, 0.1)"
                  : "none",
              }}
            >
              <div className="card-inner w-full flex flex-col justify-center min-h-[calc(100vh-120px)] p-8 md:p-12 lg:p-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                  {/* Left Side - Title */}
                  <div className="flex items-center">
                    <div className="relative">
                      <span className="absolute -top-8 -left-2 text-[#EA9A61] font-mono text-lg opacity-50">
                        0{index + 1}
                      </span>
                      <h3
                        className="step-title text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-bold leading-none tracking-tighter"
                        style={{
                          fontFamily: "Norwige, sans-serif",
                          fontStyle: "italic",
                          color: activeCardIndex === index ? "#EA9A61" : "#FFF4E3",
                          transition: "color 0.6s ease",
                        }}
                      >
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  {/* Right Side - Content */}
                  <div className="flex flex-col justify-center h-full lg:items-end">
                    <div
                      className={`transition-all duration-700 cubic-bezier(0.23, 1, 0.32, 1) ${activeCardIndex === index
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12 pointer-events-none"
                        }`}
                    >
                      <div className="space-y-6 md:space-y-8 lg:text-right">
                        {step.points.length > 0 ? (
                          step.points.map((point, pointIndex) => (
                            <div
                              key={pointIndex}
                              className="flex items-start space-x-6 lg:space-x-reverse lg:flex-row-reverse group/item"
                            >
                              <div className="relative mt-3">
                                <span className="block w-2.5 h-2.5 rounded-full bg-[#EA9A61] transition-transform duration-300 group-hover/item:scale-125" />
                                <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#EA9A61] animate-ping opacity-20" />
                              </div>
                              <p
                                className="step-text text-xl md:text-2xl lg:text-3xl font-light tracking-tight"
                                style={{
                                  fontFamily: "Roboto, sans-serif",
                                  color: "#FFFFFF",
                                  lineHeight: "1.2"
                                }}
                              >
                                {point}
                              </p>
                            </div>
                          ))
                        ) : (
                          step.description && (
                            <p
                              className="step-text text-lg md:text-xl lg:text-2xl leading-relaxed font-light opacity-90"
                              style={{
                                fontFamily: "Roboto, sans-serif",
                                color: "#FFFFFF",
                              }}
                            >
                              {step.description}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interaction Hint */}
              <div className="absolute bottom-10 right-10 flex items-center space-x-3 text-[#FFF4E3]/30 font-mono text-[10px] tracking-[0.3em] uppercase">
                <span className={`w-12 h-[1px] bg-[#FFF4E3]/20 transition-all duration-500 ${activeCardIndex === index ? "w-20 bg-[#EA9A61]" : "w-12"}`} />
                <span>{activeCardIndex === index ? "MINIMIZE" : "EXPLORE"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Overlay */}
      <div
        ref={modalRef}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl invisible opacity-0"
        onClick={closeModal}
        data-lenis-prevent
      >
        {modalIndex !== null && (
          <div
            ref={modalContentRef}
            className="relative w-full max-w-5xl rounded-[3rem] p-8 md:p-16 lg:p-24 overflow-y-auto max-h-[90vh]"
            style={{
              backgroundColor: "#1E1A17",
              border: "1px solid rgba(234, 154, 97, 0.3)",
              boxShadow: "0 40px 100px rgba(0, 0, 0, 1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-8 right-8 text-[#FFF4E3]/40 hover:text-[#EA9A61] transition-colors font-mono text-sm tracking-widest flex items-center space-x-2 group/close"
            >
              <span>CLOSE</span>
              <span className="w-10 h-[1px] bg-[#FFF4E3]/20 group-hover/close:w-16 group-hover/close:bg-[#EA9A61] transition-all duration-300" />
            </button>

            <div className="relative mb-12">
              <span className="absolute -top-12 left-0 text-[#EA9A61] font-mono text-xl opacity-50">
                0{modalIndex + 1}
              </span>
              <h2
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold italic"
                style={{
                  fontFamily: "Norwige, sans-serif",
                  color: "#EA9A61",
                }}
              >
                {approachSteps[modalIndex].title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
              <div className="space-y-8">
                <p className="text-[#FFF4E3] text-lg md:text-xl leading-relaxed font-light opacity-95">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-[#FFF4E3]/70 text-base leading-relaxed font-light">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>

              <div className="space-y-8">
                <h4 className="text-[#EA9A61] font-mono text-sm tracking-[0.3em] uppercase opacity-50">Key Objectives</h4>
                <ul className="space-y-6">
                  {["Phase 01 Strategy", "Visual Identity Audit", "Creative Direction"].map((item, i) => (
                    <li key={i} className="flex items-center space-x-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EA9A61]" />
                      <span className="text-[#FFF4E3] text-lg font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}