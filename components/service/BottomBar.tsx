import Link from "next/link";

export default function BottomBar() {
  return (
    <div className="flex items-center justify-center my-6 sm:my-10 px-2">
      {/* Nav */}
      <nav className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 py-4 px-4 sm:px-8 bg-[#3a3b3a] rounded-full text-[#a0a3a5] text-sm sm:text-base">
        <Link href="/" className="hover:text-white">
          HOME
        </Link>

        <span className="hidden sm:inline">|</span>

        <Link href="/service" className="hover:text-white">
          SERVICES
        </Link>

        <span className="hidden sm:inline">|</span>

        <Link href="/ctrla" className="hover:text-white">
          CTRL A
        </Link>

        <span className="hidden sm:inline">|</span>

        <Link href="/about" className="hover:text-white">
          ABOUT US
        </Link>

        <span className="hidden sm:inline">|</span>

        <Link href="/vision" className="hover:text-white">
          VISION
        </Link>
      </nav>
    </div>
  );
}