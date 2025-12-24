"use client";

import BottomBar from "./BottomBar";

export default function BrandIdentity() {
  return (
    <section className="relative px-4 sm:px-8 md:px-14 min-h-screen bg-black text-[#ffffff] overflow-hidden font-['Poppins']">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start text-lg sm:text-xl md:text-2xl py-4 gap-6">
        {/* Left */}
        <div className="leading-none text-center md:text-left">
          Made in <br /> atlanta
        </div>

        {/* Middle */}
        <div className="text-center md:text-right leading-tight lg:ml-28">
          <p>Local Time: 8:18 PM, Atlanta</p>
        </div>

        {/* Right */}
        <div className="text-center md:text-right text-3xl sm:text-4xl font-bold">
          <h2>Brand Identity</h2>
          <span className="block md:pl-24">Architechts</span>
        </div>
      </div>

      {/* Center Section */}
      <div className="mt-10 space-y-10">
        {/* Left Text */}
        <div className="px-2 sm:px-4">
          <h1
            style={{ fontFamily: "futura" }}
            className="text-2xl sm:text-4xl md:text-5xl tracking-wide leading-snug md:leading-[1.2]"
          >
            Okay, but seriously — web dev, mixing music, <br /> drone footage,
            design... you actually do all <br />
            this?
          </h1>
        </div>

        {/* Right Text */}
        <div className="text-center md:text-right px-2 sm:px-6">
          <p
            style={{ fontFamily: "futura" }}
            className="text-lg sm:text-2xl md:text-3xl leading-relaxed"
          >
            We do, and we do it in one seamless <br />
            experience. <br />
            Every service working together, every detail <br /> in harmony.
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-4 sm:px-6 pb-6 flex flex-col items-center text-center">
        <p
          style={{ fontFamily: "futura" }}
          className="text-3xl sm:text-5xl md:text-7xl tracking-wider"
        >
          Show me how...
        </p>

        {/* Bottom bar */}
        <BottomBar />
      </div>
    </section>
  );
}