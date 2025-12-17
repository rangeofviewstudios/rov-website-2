"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";

const TestimonialsSection = () => {
  return (
    <div className="responsive-box mx-auto text-[#382a21] lg:h-[285px] xl:h-[280px]  w-[215px] lg:w-[500px] xl:w-[600px]  md:w-[400px] bg-[#ccc4bd] xl:mt-28 xl:ml-[430px] md:mt-24 lg:mt-24 md:ml-[250px] lg:ml-[330px] mt-14 ml-[128px]">
      <Swiper
        modules={[Pagination, Navigation]}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        autoplay={{ delay: 5000 }}
        loop
        spaceBetween={50}
        className="w-full relative"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="text-center cursor-pointer  flex flex-col md:px-5 md:py-5 py-2 px-3 justify-center ">
            <div className="underline text-left leading-tight text-sm md:text-2xl lg:text-5xl italic decoration-2 futura font-extrabold tracking-wider">
              “they are so cool <br /> and awesome”
            </div>

            <p className="lg:mt-6 italic text-sm md:text-2xl lg:text-5xl flex justify-end futura font-extrabold tracking-wider underline">
              -this client
            </p>

            <Link
              href={"#"}
              className="lg:mt-6 mb-5  text-left text-sm md:text-2xl italic underline hover:opacity-70 transition"
            >
              click here for vid
            </Link>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="text-center cursor-pointer flex flex-col md:px-5 md:py-5 py-2 px-3 justify-center ">
            <div className="underline text-left leading-tight text-sm md:text-2xl lg:text-5xl italic decoration-2 futura font-extrabold tracking-wider">
              “they are so cool <br /> and awesome”
            </div>

            <p className="lg:mt-6 italic text-sm md:text-2xl lg:text-5xl flex justify-end futura font-extrabold tracking-wider underline">
              -this client
            </p>

            <Link
              href={"#"}
              className="lg:mt-6 mb-5  text-left text-sm md:text-2xl italic underline hover:opacity-70 transition"
            >
              click here for vid
            </Link>
          </div>
        </SwiperSlide>

        {/* Custom Navigation Buttons */}
        <div className="custom-prev absolute left-0 top-1/2 -translate-y-1/2 text-[#382a21] lg:text-3xl text-lg  cursor-pointer select-none z-50 hover:opacity-70 transition">
          ❮
        </div>
        <div className="custom-next absolute right-0 top-1/2 -translate-y-1/2 text-[#382a21] lg:text-3xl text-lg  cursor-pointer select-none z-50 hover:opacity-70 transition">
          ❯
        </div>
      </Swiper>
    </div>
  );
};

export default TestimonialsSection;