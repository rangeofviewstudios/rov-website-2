"use client";

import BottomBar from "./BottomBar";

export default function HeroSection() {
  return (
    <section className="relative pt-6 sm:pt-8 px-4 sm:px-8 lg:px-14 min-h-screen bg-black text-[#ffffff] overflow-hidden font-['Poppins']">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 text-lg sm:text-xl md:text-2xl py-4">
        {/* Left */}
        <div className="leading-none text-center md:text-left">
          Made in <br /> atlanta
        </div>

        {/* Middle */}
        <div className="text-center md:text-right leading-tight md:ml-10 lg:ml-28">
          <p>Local Time: 8:18 PM, Atlanta</p>
          <p>Curated in the southeast</p>
        </div>

         <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-center md:text-left">
          <h2>CREATIVE</h2>
          <span className="block md:inline md:pl-24">studio</span>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-10 mt-10 sm:mt-14 md:mt-18">
        {/* Left Text */}
        <div className="md:w-1/2 px-2 sm:px-4 md:px-7">
          <h1
            style={{ fontFamily: "futura" }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide leading-snug"
          >
            We’re R.O.V. <br /> Your brand&apos;s next chapter <br /> starts here.
          </h1>
        </div>

        {/* Right Text */}
        <div className="md:w-1/2 text-left md:text-right px-2 sm:px-4 mt-16">
          <p
            style={{ fontFamily: "futura" }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed"
          >
            Not just deliverables — complete <br /> brand transformations. Where
            every <br /> detail dances together.
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-4 sm:px-6 pb-6 sm:pb-8 flex flex-col items-center gap-6 mt-12">
        <p
          style={{ fontFamily: "futura" }}
          className="text-xl sm:text-2xl md:text-4xl lg:text-5xl text-center leading-snug"
        >
          Want to see what &apos;complete&apos; really means?
        </p>

        {/* Bottom bar */}
        <BottomBar />
      </div>
    </section>
  );
}