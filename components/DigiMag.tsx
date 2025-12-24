"use client";

import TrueFocus from "./TrueFocus";
import TiltedCard from "./TiltedCard";

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

      {/* CREATIVE BENTO GRID */}
      <div
        className="
          grid grid-cols-4
          auto-rows-[140px] sm:auto-rows-[180px] md:auto-rows-[260px]
          gap-3 sm:gap-4
          [grid-auto-flow:dense]
        "
      >
        {/* All cards updated with showTooltip={false} and empty captions */}
        <div className="col-span-2 row-span-2">
          <TiltedCard
            imageSrc="/video/starscollidemv.mp4"
            altText="Stars Collide MV"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            showTooltip={false}
          />
        </div>

        <div>
          <TiltedCard
            imageSrc="/chain.webp"
            altText="ROV Chain"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            showTooltip={false}
          />
        </div>

        <div className="row-span-2">
          <TiltedCard
            imageSrc="/woman2.webp"
            altText="Vices"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            showTooltip={false}
          />
        </div>

        <div>
          <TiltedCard
            imageSrc="/ddk_1.webp"
            altText="DDK Album"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            showTooltip={false}
          />
        </div>

        <div>
          <TiltedCard
            imageSrc="/ddk_2.webp"
            altText="Song of the Day"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            showTooltip={false}
          />
        </div>

        <div className="col-span-2">
          <TiltedCard
            imageSrc="/james.mp4"
            altText="Open Verse"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            showTooltip={false}
          />
        </div>

        <div className="col-span-2 row-span-2">
          <TiltedCard
            imageSrc="/event_3.webp"
            altText="Live Performance"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            showTooltip={false}
          />
        </div>

        <div>
          <TiltedCard
            imageSrc="/catchthelight.webp"
            altText="Catch The Light"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            showTooltip={false}
          />
        </div>

        <div className="row-span-2">
          <TiltedCard
            imageSrc="/ddk_vid_2.mp4"
            altText="On The Radar"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            showTooltip={false}
          />
        </div>

        <div>
          <TiltedCard
            imageSrc="/art showcase.webp"
            altText="Art Showcase"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            showTooltip={false}
          />
        </div>

        <div>
          <TiltedCard
            imageSrc="/video/starboymv.mp4"
            altText="StrangeLoots MV"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={15}
            showTooltip={false}
          />
        </div>
      </div>
    </div>
  );
};

export default DigiMag;