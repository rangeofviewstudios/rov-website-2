/* eslint-disable @next/next/no-img-element */
export default function Gallery() {
  return (
    <section
      className="relative bg-cover pb-12 pt-8 md:pb-20 md:pt-10 bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/background/12.jpg')" }}
    >
      <div className="mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-stretch">
          {/* Left Column (col-7) */}
          <div className="col-span-12 md:col-span-7 space-y-4 md:space-y-6">
            {/* First Row: Two Images (col-6 + col-6) */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <img
                src="/assets/images/gallery11.webp"
                alt="Image 1"
                className="w-full h-[160px] sm:h-[200px] md:h-[260px] 
                 object-cover rounded-xl md:rounded-2xl 
                 transition-transform duration-500 ease-in-out transform 
                hover:scale-98 hover:rotate-2"
              />
              <img
                src="/assets/images/gallery12.webp"
                alt="Image 2"
                className="w-full h-[160px] sm:h-[200px] md:h-[260px] 
                  object-cover rounded-xl md:rounded-2xl 
                  transition-transform duration-500 ease-in-out transform 
                  hover:scale-98 hover:rotate-2"
              />
            </div>

            {/* Second Row: One Image Full Width */}
            <div>
              <img
                src="/assets/images/gallery13.webp"
                alt="Image 3"
                className="w-full h-[180px] sm:h-[220px] md:h-[260px] 
                object-cover rounded-xl md:rounded-2xl 
                 transition-transform duration-500 ease-in-out transform 
                 hover:scale-98 hover:rotate-2"
              />
            </div>
          </div>

          {/* Right Column (col-5) */}
          <div className="col-span-12 md:col-span-5 mt-4 md:mt-0">
            <img
              src="/assets/images/gallery14.webp"
              alt="Right Side Image"
              className="w-full h-[220px] sm:h-[300px] md:h-[540px] 
                         object-cover rounded-xl md:rounded-2xl 
                         transition-transform duration-500 ease-in-out transform 
                         hover:scale-98 hover:rotate-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}