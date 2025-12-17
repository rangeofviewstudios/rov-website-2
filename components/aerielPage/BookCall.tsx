"use client";
import { motion, Variants } from "framer-motion";
import { ArrowUpRight, Earth } from "lucide-react";
// import { useState } from "react";
// import BookingModal from "../home/BookingModal";

const BookCall = () => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const text: string[] = ["Don’t keep waiting", "happen"];

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        ease: "easeInOut",
        duration: 0.6,
      },
    },
  };

  const letter: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section
      className="relative text-center py-16 md:py-24 px-4 md:px-6 md:rounded-t-[50px] md:-mt-[32px]"
      style={{
        backgroundImage: "url('/assets/images/Untitled-6.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Top small text */}
      <motion.p
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false }}
        style={{ fontFamily: "serif" }}
        className="italic font-semibold tracking-wider text-2xl uppercase md:text-3xl text-[#2c2420] mb-4"
      >
        Join us for takeoff
      </motion.p>

      {/* Letter by letter animation */}
      <motion.h2
        className="text-3xl md:text-[120px] tracking-wider sink text-[#2c2420] mb-12 leading-none text-center"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        {text.map((line, lineIndex) => (
          <div key={lineIndex} className="flex justify-center flex-wrap">
            {line.split("").map((char, i) => (
              <motion.span key={i} variants={letter}>
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>
        ))}
      </motion.h2>

      <motion.p
        style={{ fontFamily: "serif" }}
        className="italic font-semibold tracking-wider text-2xl uppercase md:text-3xl text-[#2c2420] my-5"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false }}
      >
        You&rsquo;re one upload away from your best version
      </motion.p>

      <div className="flex justify-center mt-10">
        <a
          href="https://calendly.com/rangeofviewmusic/30min"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            className="
        relative overflow-hidden bg-[#393632] futura flex items-center justify-center 
        cursor-pointer text-white md:py-12 py-6 md:px-16 px-10 text-3xl font-semibold tracking-wide group 
        transition-all duration-700 ease-in-out 
        rounded-[40px_40px_120px_120px] md:hover:rounded-[20px]
      "
          >
            <span
              className="
          absolute top-3 right-4
          transition-transform duration-500 ease-in-out
          md:group-hover:translate-x-2 md:group-hover:-translate-y-1
        "
            >
              <ArrowUpRight size={28} strokeWidth={2.5} />
            </span>

            {/* Button Text */}
            <span className="relative overflow-hidden flex items-center leading-none h-[1.2em]">
              Book a call
            </span>
          </button>
        </a>
      </div>

      <div className="mt-12 flex flex-col md:flex-row justify-between items-center text-[#2c2420] font-semibold gap-4">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <div className="text-2xl flex items-center justify-center rounded-full border border-[#cfcfcf]">
            <Earth size={30} />
          </div>
          <div className="flex flex-col md:text-2xl text-lg">
            <span>Working Globally</span>
            <span className="h-1 border bg-[#2c2420]"></span>
            <span>Available July 25</span>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <div className="flex flex-col md:text-2xl text-lg">
            <span>FOR FURTHER INQUIRIES</span>
            <span>
              <a
                href="mailto:@rangeofviewstudios"
                className="hover:text-[#2c2420]/40 transition-colors duration-300"
              >
                ↳ @rangeofviewstudios
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> */}
    </section>
  );
};

export default BookCall;