"use client";
import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";

const HomeBanner = () => {
  return (
    <div className="relative w-full lg:h-[100vh] md:h-[60vh] h-[60vh]">
      <Image
        src="/assets/background/1.webp"
        alt="Banner Background"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 flex flex-col justify-end lg:ml-8 md:ml-0 lg:text-left text-center px-6 md:px-12 pb-8">
        <h1
          style={{ fontFamily: "anton" }}
          className="banner-text text-[#e3dfd8] uppercase md:mb-0 mb-20"
        >
          <TypeAnimation
            sequence={["YOUR SITE REIMAGINED", 2000, "", 500]}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
            style={{ display: "inline-block" }}
          />
        </h1>
      </div>

      {/* Inline CSS */}
      <style jsx>{`
        .banner-text {
          font-size: 10vw; 
          white-space: nowrap; 
          line-height: 1;
        }
      `}</style>
    </div>
  );
};

export default HomeBanner;