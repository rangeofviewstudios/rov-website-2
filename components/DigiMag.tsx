"use client";

import { ArrowUpRight } from "lucide-react";
import TrueFocus from "./TrueFocus";
import TiltedCard from "./TitledCard";

const DigiMag = () => {
  return (
    <div
      id="digi-mag"
      className="w-full px-6 sm:px-12 md:px-16 mt-16 mb-24"
    >
      {/* Header */}
      <div className="w-full flex justify-center md:justify-start mb-10">
        <div className="hidden md:block w-full">
          <TrueFocus
            sentence="DIGITAL MAGAZINE"
            manualMode
            blurAmount={5}
            borderColor="rgba(6,247,255,0.7)"
            glowColor="rgba(255,255,255,0.6)"
            animationDuration={0.15}
            pauseBetweenAnimations={1.5}
            fontSize="clamp(4rem, 10vw, 14rem)"
            fontFamily="Sink"
            letterSpacing="0.05em"
          />
        </div>
      </div>

      {/* CREATIVE BENTO GRID - REORGANIZED FOR BETTER VISUAL FLOW */}
      <div
        className="
          grid grid-cols-4
          auto-rows-[140px] sm:auto-rows-[180px] md:auto-rows-[260px]
          gap-3 sm:gap-4
          [grid-auto-flow:dense]
        "
      >
        {/* TOP LEFT - Large Feature */}
        <div className="col-span-2 row-span-2">
          <TiltedCard
            imageSrc="/video/starscollidemv.mp4"
            altText="Stars Collide MV"
            captionText="Stars Collide Music Video by Range of View Studios "
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            displayOverlayContent
          />
        </div>

        {/* TOP RIGHT 1 */}
        <div>
          <TiltedCard
            imageSrc="/chain.webp"
            altText="ROV Chain"
            captionText="Chain at R.O.V. HQ"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            displayOverlayContent
          />
        </div>

        {/* TOP RIGHT 2 - Vertical */}
        <div className="row-span-2">
          <TiltedCard
            imageSrc="/woman2.webp"
            altText="Vices"
            captionText="Vices by Basu & Sophie Said"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            displayOverlayContent
          />
        </div>

        {/* MIDDLE LEFT 1 */}
        <div>
          <TiltedCard
            imageSrc="/ddk_1.webp"
            altText="DDK Album"
            captionText="Ebro Radio placement, mixed/mastered by R.O.V."
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            displayOverlayContent
          />
        </div>

        {/* MIDDLE LEFT 2 */}
        <div>
          <TiltedCard
            imageSrc="/ddk_2.webp"
            altText="Song of the Day"
            captionText="SoundCloud Song of the Day"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            displayOverlayContent
          />
        </div>

        {/* CENTER - Large Horizontal */}
        <div className="col-span-2">
          <TiltedCard
            imageSrc="/james.mp4"
            altText="Open Verse"
            captionText="Open Verse Challenge by James Esemu"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            displayOverlayContent
          />
        </div>

        {/* BOTTOM LEFT - Large Feature */}
        <div className="col-span-2 row-span-2">
          <TiltedCard
            imageSrc="/event_3.webp"
            altText="Live Performance"
            captionText="Believe Music Hall ATL performance"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            displayOverlayContent
          />
        </div>

        {/* BOTTOM MIDDLE */}
        <div>
          <TiltedCard
            imageSrc="/catchthelight.webp"
            altText="Catch The Light"
            captionText="Catch The Light — RangeofView"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            displayOverlayContent
          />
        </div>

        {/* BOTTOM RIGHT - Vertical */}
        <div className="row-span-2">
          <TiltedCard
            imageSrc="/ddk_vid_2.mp4"
            altText="On The Radar"
            captionText="DDK On The Radar, mixed/mastered by R.O.V."
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            displayOverlayContent
          />
        </div>

        {/* BOTTOM SMALL */}
        <div>
          <TiltedCard
            imageSrc="/art showcase.webp"
            altText="Art Showcase"
            captionText="R.O.V. Art by YDXX"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            displayOverlayContent
          />
        </div>

        {/* FINAL TILE - Placed strategically */}
        <div>
          <TiltedCard
            imageSrc="/video/starboymv.mp4"
            altText="StrangeLoots MV"
            captionText="StrangeLoots x RangeofView MV"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            displayOverlayContent
          />
        </div>
      </div>
    </div>
  );
};

export default DigiMag;