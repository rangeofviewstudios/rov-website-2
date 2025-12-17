"use client";
import React, { useState } from "react";
import { motion, Variants } from "framer-motion";

const FlightProcess = () => {
  interface Step {
    title: string;
    description: string;
  }

  const steps: Step[] = [
    {
      title: "IDEATE",
      description:
        "Brainstorm creative concepts and develop unique ideas that bring stories to life. This is where imagination meets intent.",
    },
    {
      title: "FILM",
      description:
        "Capture the essence of your vision with high-quality visuals, lighting, and direction — turning ideas into reality.",
    },
    {
      title: "EDIT",
      description:
        "Refine and craft your story through editing, pacing, and flow. Every cut defines the emotion and energy.",
    },
    {
      title: "POLISH",
      description:
        "Add the final touches — color, sound, and motion — to make the piece shine with perfection.",
    },
  ];

  const text: string[] = ["OUR FLIGHT PROCESS"];
  const [activeStep, setActiveStep] = useState<Step | null>(null);

  // parent animation
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        ease: "easeInOut",
        duration: 0.6,
      },
    },
  };

  // letter animation
  const letter: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section
      onMouseLeave={() => setActiveStep(null)}
      className="relative md:rounded-t-[50px] md:-mt-[28px] w-full md:pt-16 md:pb-20 py-5 bg-[#ccc4bd] bg-cover bg-center text-[rgb(56, 42, 33)]"
      style={{
        backgroundImage: "url('/assets/background/new3.jpg')",
        color: "rgb(56, 42, 33)",
      }}
    >
      <div className="relative z-10 px-6 lg:px-20">
        {/* Animated Heading */}
        <motion.div
          className="text-center mb-8"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
        >
          {text.map((line, lineIndex) => (
            <div key={lineIndex} className="flex justify-center">
              {line.split("").map((char, i) => (
                <motion.span
                  key={i}
                  variants={letter}
                  className="text-4xl md:text-7xl lg:text-9xl text-[#1e0202]"
                  style={{
                    fontFamily: "anton",
                    textShadow: "6px 6px 9px rgba(0,0,0,0.3)",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </div>
          ))}
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col space-y-4 text-7xl tracking-wider  uppercase text-[#302218]">
          {steps.map((step) => (
            <span
              key={step.title}
              onMouseEnter={() => setActiveStep(step)}
              className="cursor-pointer anton  w-[200px]  transition-transform duration-200 hover:scale-105"
            >
              {step.title}
            </span>
          ))}

          {/* Modal */}
          {activeStep && (
            <div
              className="fixed  inset-0 z-50 flex items-center justify-center "
              onMouseLeave={() => setActiveStep(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative w-[500px] h-[370px] text-center bg-cover bg-center "
                style={{
                  backgroundImage: `url(/assets/images/commentbg.webp)`,
                }}
                onMouseLeave={() => setActiveStep(null)}
              >
                {/* Modal Content */}
                <div className="relative pt-14 text-[#302218]">
                  <h2 className="text-5xl anton uppercase mb-2">
                    {activeStep.title}
                  </h2>

                  <p className="text-lg font-normal  px-4 text-[#302218]">
                    {activeStep.description}
                  </p>

                  {/* Close Button */}
                  <button
                    onClick={() => setActiveStep(null)}
                    className="mt-4 px-6 py-2 text-sm cursor-pointer uppercase bg-[#302218] text-[#f8f2e5] rounded hover:opacity-80 transition"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}


        </div>
      </div>
    </section>
  );
};

export default FlightProcess;