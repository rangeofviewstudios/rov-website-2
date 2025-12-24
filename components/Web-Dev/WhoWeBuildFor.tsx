"use client";
import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

const WhoWeBuildFor: React.FC = () => {
  // Variants for container (stagger children)
  const container: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, 
      },
    },
  };

  // Variants for each letter
  const letter: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Function to split text into motion spans
  const renderLetters = (
    text: string,
    extraClass: string = "",
    style: React.CSSProperties = {}
  ) => (
    <motion.span
      className="block"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={letter}
          className={`inline-block ${extraClass}`}
          style={style}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );

  return (
    <section className="relative rounded-t-[50px] -mt-[27px] w-full md:h-[90vh] h-auto md:py-0 py-20 flex items-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/assets/images/3rdsection.gif"
        alt="Who We Build For Background"
        fill
        className="object-cover"
        priority
      />

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-20 flex flex-col justify-center h-full">
        {/* Heading */}
        <h2
          style={{ fontFamily: "anton" }}
          className="uppercase text-[55px] md:text-[125px] tracking-wider text-[#221813] leading-none"
        >
          {/* First line */}
          {renderLetters("WHO WE")}

          {/* Second line */}
          {renderLetters("BUILD FOR", "text-transparent", {
            WebkitTextStroke: "4px #978f88",
            WebkitTextFillColor: "#221813",
          })}
        </h2>

        {/* Underline */}
        <motion.div
          className="w-full h-[4px] bg-[#221813] mt-3 mb-5 origin-center"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false }}
        />

        {/* Sub Text */}
        <motion.p
          style={{ fontFamily: "Boke Rough" }}
          className="text-2xl md:text-5xl tracking-[0.03em] leading-1.2 flex justify-center text-[#221813]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          viewport={{ once: false }}
        >
        TRUSTED BY ATLANTA&apos;S <br /> GROWING BUSINESSES
        </motion.p>
      </div>
    </section>
  );
};

export default WhoWeBuildFor;