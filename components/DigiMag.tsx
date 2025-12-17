"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import TrueFocus from "./TrueFocus";
import TiltedCard from "./TitledCard";

const DigiMag = () => {
  return (
    <div className="w-full p-2 sm:p-4 px-6 sm:px-12 md:px-16 mt-8 sm:mt-12 md:mt-16 mb-16 sm:mb-20 md:mb-24" id="digi-mag">
      {/* Header */}
      <div className="w-full flex justify-center md:justify-start items-center gap-2 sm:gap-4 mb-8 sm:mb-2 md:mb-4 pl-0 md:pl-4">
        {/* Desktop View: Hover enabled, smaller fit */}
        <div className="hidden md:block w-full">
          <TrueFocus
            sentence="DIGITAL MAGAZINE"
            manualMode={true}
            blurAmount={5}
            borderColor="rgba(6, 247, 255, 0.7)"
            glowColor="rgba(255, 255, 255, 0.6)"
            animationDuration={0.15}
            pauseBetweenAnimations={1.5}
            fontSize="clamp(4rem, 10.5vw, 14rem)"
            fontFamily="Sink"
            letterSpacing="0.05em"
          />
        </div>

        {/* Mobile View: Auto animation, large font to stack */}
        <div className="md:hidden w-full flex justify-center px-4">
          <TrueFocus
            sentence="DIGITAL MAGAZINE"
            manualMode={false}
            blurAmount={5}
            borderColor="rgba(6, 247, 255, 0.7)"
            glowColor="rgba(255, 255, 255, 0.6)"
            animationDuration={0.15}
            pauseBetweenAnimations={1.5}
            fontSize={["19vw", "15vw"]}
            fontFamily="Sink"
            letterSpacing="0.05em"
          />
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-4 gap-1 sm:gap-4 auto-rows-[135px] sm:auto-rows-[169px] md:auto-rows-[270px]">
        {/* Large Feature Image */}
        <div className="relative col-span-2 row-span-2 group overflow-visible">
          <TiltedCard
            imageSrc="/video/starscollidemv.mp4"
            altText="Stars Collide MV"
            captionText="Stars Collide Music Video by RangeofView"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            scaleOnHover={1}
            rotateAmplitude={15}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          />
        </div>

        {/* Filling Smaller Images */}
        <div className="relative col-span-1 row-span-1 group overflow-visible">
          <TiltedCard
            imageSrc="/ddk_1.webp"
            altText="DDK Album"
            captionText="Ebro Radio placement, Martyr, mixed/mastered by R.O.V."
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            scaleOnHover={1}
            rotateAmplitude={15}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          />
        </div>

        {/* Video 1 */}
        <div className="relative col-span-1 row-span-1 group overflow-visible">
          <a href="https://youtu.be/qcIkMitGIbc" target="_blank" rel="noopener noreferrer">
            <TiltedCard
              imageSrc="/video/starboymv.mp4"
              altText="StrangeLoots x RangeofView MV"
              captionText="StrangeLoots x RangeofView MV"
              containerHeight="100%"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              scaleOnHover={1}
              rotateAmplitude={15}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={true}
            />
          </a>
        </div>

        {/* Filling the middle gap */}
        <div className="relative col-span-1 row-span-1 group overflow-visible" style={{ gridColumn: '3', gridRow: '2' }}>
          <TiltedCard
            imageSrc="/ddk_2.webp"
            altText="DDK Song of the Day"
            captionText="SoundCloud song of the day mixed/mastered by R.O.V."
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            scaleOnHover={1}
            rotateAmplitude={15}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          />
        </div>

        {/* Video 2 */}
        <div className="relative col-span-2 row-span-1 group overflow-visible">
          <a href="https://www.youtube.com/watch?v=gu43a-83-4c" target="_blank" rel="noopener noreferrer">
            <TiltedCard
              imageSrc="/james.mp4"
              altText="Video 2"
              captionText="Open verse challenge by James Esemu"
              containerHeight="100%"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              scaleOnHover={1}
              rotateAmplitude={15}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={true}
            />
          </a>
        </div>

        <div className="relative col-span-1 row-span-2 group overflow-visible" style={{ gridColumn: '4', gridRow: '2 / 4' }}>
          <TiltedCard
            imageSrc="/woman2.webp"
            altText="Beautiful Woman"
            captionText="Vices By Basu & Sophie Said"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            scaleOnHover={1}
            rotateAmplitude={15}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          />
        </div>

        {/* Bottom Row - Event 3 on left */}
        <div className="relative col-span-2 row-span-2 group overflow-visible">
          <TiltedCard
            imageSrc="/event_3.webp"
            altText="Live Performance"
            captionText="Performance in Believe Music Hall ATL by Basu and Sam Suen"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            scaleOnHover={1}
            rotateAmplitude={15}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          />
        </div>

        {/* Bottom Row - Art showcase */}
        <div className="relative col-span-1 row-span-1 group overflow-visible">
          <TiltedCard
            imageSrc="/art showcase.webp"
            altText="Art"
            captionText="R.O.V. Art: A fusion of color and conscious, by YDXX"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            scaleOnHover={1}
            rotateAmplitude={15}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          />
        </div>

        {/* Video 3 - fills column 4 */}
        <div className="relative col-span-1 row-span-2 group overflow-visible">
          <a href="https://www.youtube.com/watch?v=fZQ8AywmXrI&ab_channel=OnTheRadarRadio" target="_blank" rel="noopener noreferrer">
            <TiltedCard
              imageSrc="/ddk_vid_2.mp4"
              altText="Video 3"
              captionText="DDK On the Radar, mixed/mastered by R.O.V."
              containerHeight="100%"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              scaleOnHover={1}
              rotateAmplitude={15}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={true}
            />
          </a>
        </div>

        {/* Bottom Row - Catch the light */}
        <div className="relative col-span-1 row-span-1 group overflow-visible">
          <TiltedCard
            imageSrc="/catchthelight.webp"
            altText="Catch The Light"
            captionText="Catch The Light - RangeofView"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            scaleOnHover={1}
            rotateAmplitude={15}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          />
        </div>
      </div>
    </div>
  );
};

export default DigiMag;