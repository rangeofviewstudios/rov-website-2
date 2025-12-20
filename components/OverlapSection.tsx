"use client";

import { ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

interface Props {
  children: ReactNode;
  index: number;          // future use ke liye
  disableSticky?: boolean;
  isBook?: boolean;
}

export default function OverlapSection({
  children,
  disableSticky = false,
  isBook = false,
}: Props) {
  const { scrollYProgress } = useScroll();

  // useTransform always call (hooks order safe)
  const rawY: MotionValue<string> = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", isBook ? "-10%" : "0%"]
  );

  // Smooth spring animation
  const smoothY: MotionValue<string> = useSpring(rawY, {
    stiffness: 80,
    damping: 20,
  });

  // Sticky disable hone par y=0, nahi to smoothY
  const finalY = disableSticky ? "0%" : smoothY;

  return (
    <motion.section
      style={{ y: finalY }}
      className={`${disableSticky ? "" : "sticky top-0"} w-full z-[100]`}
    >
      <div className="w-full">{children}</div>
    </motion.section>
  );
}