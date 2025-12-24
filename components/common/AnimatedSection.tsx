"use client";
import { ReactNode } from "react";
import { motion, MotionProps } from "framer-motion";

type AnimatedSectionProps = MotionProps & {
  children: ReactNode;
};

export default function AnimatedSection({ children, ...motionProps }: AnimatedSectionProps) {
  return (
    <div style={{ position: "relative" }}>
      <motion.div
        initial={{ opacity: 0.25, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 25 }}
        transition={{ duration: 0.45, ease: [1, 1, 1, 1] }}
        viewport={{ once: false, amount: 0.2 }}
        style={{
          position: "sticky", 
          top: 0,
          zIndex: 1,
        }}
        {...motionProps}
      >
        {children}
      </motion.div>
    </div>
  );
}