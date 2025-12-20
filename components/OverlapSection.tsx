"use client";

import { ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

interface Props {
  children: ReactNode;
  index?: number;          // future use ke liye
  disableSticky?: boolean;
  isBook?: boolean;
}

export default function OverlapSection({
  children,
  disableSticky = false,
  isBook = false,
}: Props) {
  const { scrollYProgress } = useScroll();

  // For string-based transforms (percentages), we need to handle it differently
  const rawY: MotionValue<string> = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", isBook ? "-10%" : "0%"]
  );

  // For spring animation, we need to work with numeric values
  // Convert percentage strings to numeric progress values
  const rawProgress = useTransform(
    scrollYProgress,
    [0, 1],
    [0, isBook ? -10 : 0]
  );

  // Apply spring animation to numeric values
  const smoothProgress: MotionValue<number> = useSpring(rawProgress, {
    stiffness: 80,
    damping: 20,
  });

  // Convert numeric progress back to percentage string
  const smoothY: MotionValue<string> = useTransform(
    smoothProgress,
    (value) => `${value}%`
  );

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