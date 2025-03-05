"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import TrueFocus from "./TrueFocus";
import TiltedCard from "./TitledCard";

const DigiMag = () => {
  return (  
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4" id="digi-mag">
      {/* Header */}
      <div className="flex justify-start items-center gap-2 sm:gap-4 mb-8 sm:mb-2 md:mb-4 pl-4 sm:pl-0">
        <TrueFocus
          sentence="DIGITAL MAGAZINE"
          manualMode={false}
          blurAmount={5}
          borderColor="rgba(6, 247, 255, 0.7)"
          glowColor="rgba(255, 255, 255, 0.6)"
          animationDuration={0.3}
          pauseBetweenAnimations={1.5}
        />
        <div className="relative flex-shrink-0">
          <Image
            src="/rov-logo.png" // Replace with your actual image name
            alt="Magazine Logo"
            width={80} // Base width for mobile
            height={80} // Base height for mobile
            className="w-[40px] h-[40px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] object-contain"
          />
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-4 gap-1 sm:gap-4 auto-rows-[120px] sm:auto-rows-[150px] md:auto-rows-[300px]">
        {/* Large Feature Image */}
        <div className="relative col-span-2 row-span-2 group overflow-visible">
          <TiltedCard
            imageSrc="/ctltrackprint.jpg"
            altText="Change My Mind"
            captionText="Short Project by Basu and James Esemu. Appearances from Overpade, AVGUST"
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
            imageSrc="/ddk_1.png"
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
              imageSrc="/ddk_vid_1.mp4"
              altText="Video 1"
              captionText="DDK music video for up late, up early, mixed/mastered by R.O.V."
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

        <div className="relative col-span-1 row-span-2 group overflow-visible">
          <TiltedCard
            imageSrc="/woman2.png"
            altText="Beautiful Woman"
            captionText="Timeless Elegance"
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

        {/* Filling the middle gap */}
        <div className="relative col-span-1 row-span-1 group overflow-visible">
          <TiltedCard
            imageSrc="/ddk_2.png"
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

        {/* Bottom Row Fix */}
        <div className="relative col-span-1 row-span-1 group overflow-visible">
          <TiltedCard
            imageSrc="/cover7.png"
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

        <div className="relative col-span-1 row-span-1 group overflow-visible">
          <TiltedCard
            imageSrc="/art showcase.png"
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

        <div className="relative col-span-2 row-span-1 group overflow-visible">
          <TiltedCard
            imageSrc="/event_3.jpg"
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

        {/* Video 3 */}
        <div className="relative col-span-1 row-span-1 group overflow-visible">
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
      </div>
    </div>
  );
};

export default DigiMag;