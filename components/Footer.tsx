"use client";
import { useEffect, useState } from "react";
import { Github, Instagram, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const [isIndia, setIsIndia] = useState<boolean>(false);
  const [localTime, setLocalTime] = useState<string>("");

  const getTime = (zone: string): string => {
    return new Date().toLocaleTimeString("en-US", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const updateTime = () => {
      const zone = isIndia ? "Asia/Kolkata" : "America/New_York";
      setLocalTime(getTime(zone));
    };

    updateTime(); // Update immediately on change
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [isIndia]);

  const handleToggle = (): void => {
    setIsIndia((prev) => !prev);
  };



  return (
    <>
      <div
        className="relative grid w-full grid-cols-1 md:grid-cols-12 bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/assets/images/footerbg.png')",
          backgroundSize: "100% 100%",
        }}
      >
        {/* Overlay for subtle dark tone */}
        <div className="absolute inset-0 bg-black/30 "></div>

        {/* Footer content wrapper */}
        <div className="relative z-10 col-span-12 grid grid-cols-1 md:grid-cols-12">
          {/* === COLUMN 1: Services === */}
          <div className="relative py-16 flex flex-col items-center justify-between overflow-hidden col-span-12 md:col-span-3">
            <div className="relative z-10 flex flex-col items-center justify-between text-center px-4">
              <p
                className="uppercase tracking-[4px] text-4xl text-[#f8f2e5] pt-5"
                style={{ fontFamily: 'Norwige Light, sans-serif' }}
              >
                ELEVATE YOUR <br /> BRAND TODAY.
              </p>


              {/* Replace ring image with video */}
              <video
                src="/video/ring_footer.webm"
                autoPlay
                loop
                muted
                playsInline
                className="h-[120px] md:h-[200px] w-auto object-contain"
              />

              <h2
                className="uppercase text-5xl text-[#f8f2e5] mb-6 tracking-widest"
                style={{ fontFamily: 'sink, sans-serif' }}
              >
                SERVICES
              </h2>

              <ul
                className="flex flex-col items-center gap-2 md:text-2xl text-lg tracking-[2px] text-[#f8f2e5]"
                style={{ fontFamily: 'Norwige Light, sans-serif' }}
              >
                <li>
                  <a href="/sound" className="hover:text-white transition-colors duration-300">SOUND</a>
                </li>
                <li>
                  <a href="/web" className="hover:text-white transition-colors duration-300">WEB-SOLUTIONS</a>
                </li>
                <li>
                  <a href="/aeriel" className="hover:text-white transition-colors duration-300">DRONE FOOTAGE</a>
                </li>
                <li>
                  <a href="/ai-automation" className="hover:text-white transition-colors duration-300">AI SOLUTIONS</a>
                </li>
              </ul>
            </div>
          </div>

          {/* === COLUMN 2: Follow Us === */}
          <div
            className="relative flex flex-col items-center py-16 px-6 col-span-12 md:col-span-6 bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/images/footercenterbg.png')",
            }}
          >
            <div className="relative z-10 flex flex-col items-center">
              <h3
                className="text-[#d0cdbc] text-5xl tracking-[3px] uppercase mb-5"
                style={{ fontFamily: 'Norwige Light, sans-serif' }}
              >
                FOLLOW US
              </h3>
              <div className="flex items-center justify-center md:gap-10 gap-4 mt-4 text-white">
                <a href="https://www.instagram.com/rangeofviewstudios/" target="_blank" rel="noopener noreferrer" className="transition hover:scale-110">
                  <Instagram size={40} />
                </a>
                <a href="https://www.linkedin.com/company/105545910/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="transition hover:scale-110">
                  <Linkedin size={40} />
                </a>
                <a href="https://open.spotify.com/user/31uh2vy4lgdzfrp47tudxzn7bhuq" target="_blank" rel="noopener noreferrer" className="transition hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 496 512"
                    className="w-10 h-10"
                  >
                    <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm113.7 364.7c-4.1 6.6-12.8 8.6-19.4 4.5-53.1-32.3-119.8-39.6-198.4-21.6-7.5 1.7-15-3.1-16.7-10.6-1.7-7.5 3.1-15 10.6-16.7 84.5-19.2 158.1-10.8 217.8 25.3 6.6 4.1 8.6 12.8 4.5 19.4zm26.6-58.6c-5.1 8.3-16 10.9-24.3 5.8-60.8-37.2-153.8-48-224.7-26.2-9.1 2.7-18.6-2.5-21.3-11.6-2.7-9.1 2.5-18.6 11.6-21.3 79.6-23.8 181.4-11.7 249.7 30.1 8.3 5.1 10.9 16 5.8 24.3z" />
                  </svg>
                </a>
                <a href="https://discord.gg/GfzXdmu" target="_blank" rel="noopener noreferrer" className="transition hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 640 512"
                    className="w-10 h-10"
                  >
                    <path d="M524.5 69.5A1.5 1.5 0 0 0 523.7 69a485 485 0 0 0-120.4-37.2 1.8 1.8 0 0 0-1.9 1 337.2 337.2 0 0 0-15.1 31.2 447.4 447.4 0 0 0-134 0A309.4 309.4 0 0 0 237.2 33a1.9 1.9 0 0 0-1.9-1A483.6 483.6 0 0 0 116.4 69a1.7 1.7 0 0 0-.8.7C39.1 183.6 18.1 294.4 28.5 404.3a2.1 2.1 0 0 0 .8 1.3A487 487 0 0 0 177.2 480a1.9 1.9 0 0 0 2.1-.7 348.2 348.2 0 0 0 30-48.9 1.9 1.9 0 0 0-1-2.6 321.8 321.8 0 0 1-46-21.9 1.9 1.9 0 0 1-.2-3.2 251.7 251.7 0 0 0 9.1-7.1 1.9 1.9 0 0 1 2-.3c96.1 43.9 200.4 43.9 296 0a1.9 1.9 0 0 1 2 .3 235.5 235.5 0 0 0 9.1 7.1 1.9 1.9 0 0 1-.2 3.2 301 301 0 0 1-46 21.9 1.9 1.9 0 0 0-1 2.6 347.9 347.9 0 0 0 30 48.9 1.9 1.9 0 0 0 2.1.7A486.8 486.8 0 0 0 610.7 405a2 2 0 0 0 .8-1.3c10.4-109.8-10.6-220.6-87-334.2zM222.2 338.1c-23.4 0-42.6-21.5-42.6-47.8s18.9-47.8 42.6-47.8c23.7 0 42.9 21.5 42.6 47.8s-18.9 47.8-42.6 47.8zm195.6 0c-23.4 0-42.6-21.5-42.6-47.8s18.9-47.8 42.6-47.8 42.9 21.5 42.6 47.8-18.9 47.8-42.6 47.8z" />
                  </svg>
                </a>
                <a href="https://github.com/rangeofviewstudios" target="_blank" rel="noopener noreferrer" className="transition hover:scale-110">
                  <Github size={40} />
                </a>
              </div>

              <div className="w-full h-[160px] mt-14">
                <Link
                  href="/"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full h-full block cursor-pointer"
                >
                  <Image
                    src="/assets/images/logokalam.png"
                    alt="Logo"
                    width={500}
                    height={100}
                    className="w-full h-full object-contain"
                  />
                </Link>
              </div>
              <div className="w-full mt-6 text-center">
                <h2
                  className="text-[#f8f2e5] text-7xl md:text-8xl tracking-widest uppercase"
                  style={{ fontFamily: 'sink, sans-serif' }}
                >
                  STUDIOS
                </h2>
              </div>
            </div>
          </div>

          {/* === COLUMN 3: Local Time === */}
          <div className="relative py-16 flex flex-col items-center justify-between overflow-hidden col-span-12 md:col-span-3">
            <div
              onClick={handleToggle}
              className="cursor-pointer text-center text-3xl leading-tight text-[#f8f2e5] px-4 md:px-0 select-none"
              style={{ fontFamily: 'Norwige Light, sans-serif' }}
            >
              <p className="tracking-wide">LOCAL TIME</p>
              <div className="min-w-[200px] relative overflow-hidden"> {/* Container to prevent layout shift */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isIndia ? "india" : "usa"}
                    className="relative"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <p className="tracking-wide">
                      {localTime}, {isIndia ? "HYD" : "ATL"}
                    </p>
                    <p className="tracking-wide">{isIndia ? "IST" : "EST"}</p>
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                      initial={{ x: "-150%" }}
                      animate={{ x: "150%" }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col items-center text-center justify-center flex-grow px-4 md:pt-0 pt-14">
              <h2
                className="text-[#f8f2e5] text-7xl md:text-8xl tracking-widest uppercase"
                style={{ fontFamily: 'sink, sans-serif' }}
              >
                <a href="ctrla">Ctrl A\</a>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Footer;