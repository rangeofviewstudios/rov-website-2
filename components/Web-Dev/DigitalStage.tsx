"use client";
import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion, Variants, easeOut } from "framer-motion";

const DigitalStage = () => {

  const text: string = `“ FROM STATIC TO CINEMATIC. ”`;

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const word: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
  };

  return (
    <section className="relative w-full lg:h-[80vh] h-[75vh] rounded-t-[50px] -mt-[27px] flex md:pt-10 pt-8 md:px-10 px-0 overflow-hidden">
      {/* Background Image */}
      <Image
        src="/assets/images/4.gif"
        alt="Digital Stage Background"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Left Side Text */}
      <div className="relative z-10 w-[500px] md:ml-16 ml-5 !md:text-left">
        <motion.p
          style={{ fontFamily: "sink" }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-tight text-[#2d2d2d] w-full"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
        >
          {text.split(" ").map((wordText, i) => (
            <motion.span
              key={i}
              variants={word}
              className="inline-block mr-2"
            >
              {wordText}
            </motion.span>
          ))}
        </motion.p>
        <p
          style={{ fontFamily: "palmore" }}
          className="mt-4 sm:mt-6 text-4xl ml-16 md:text-5xl lg:text-6xl text-[#b52422]"
        >
          <TypeAnimation
            sequence={["lets build your digital stage.", 2000, "", 500]}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
            style={{ display: "inline-block" }}
          />
        </p>
      </div>

      {/* Laptop Positioned Bottom-Right */}
      <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 right-2 sm:right-6 md:right-9 w-[220px] sm:w-[260px] md:w-[350px] lg:w-[450px] rotate-[-8deg]">
        <Image
          src="/assets/images/laptop.gif"
          alt="Laptop"
          width={350}
          height={400}
          className="object-contain animate-[float_3s_ease-in-out_infinite]"
        />
      </div>
    </section>
  );
};

export default DigitalStage;