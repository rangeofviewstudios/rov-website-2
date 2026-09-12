import Image from "next/image";

// Stills from one night session, used across the music home page. They are
// imagery, not cards: no labels, no captions, no invented titles. The photo
// does the work and the section around it carries the copy.
//
// Five frames, placed where their content matches the page's argument
// (see app/sound/page.tsx). Sizes match the exports in public/soundpage.

export const SESSION = {
  /** Vocalist in a beanie, profile, singing into the mic. */
  profile: { src: "/soundpage/session-01.webp", alt: "A vocalist in a beanie, in profile, singing into a condenser microphone at night" },
  /** Same vocalist, hand on the stand, mid-phrase. */
  midPhrase: { src: "/soundpage/session-02.webp", alt: "A vocalist holding the mic stand mid-phrase, lit by warm light" },
  /** Vocalist in a knit shirt, head down, adjusting the stand. */
  knit: { src: "/soundpage/session-03.webp", alt: "A vocalist in a knit shirt adjusting a microphone stand at night" },
  /** Wide: an artist alone at a mic on a lamp-lit street at dusk. */
  street: { src: "/soundpage/session-04.webp", alt: "An artist alone at a microphone on a lamp-lit street at dusk" },
  /** Vocalist with eyes closed, hand to head. */
  eyesClosed: { src: "/soundpage/session-05.webp", alt: "A vocalist with eyes closed singing into a microphone" },
} as const;

export type SessionFrame = (typeof SESSION)[keyof typeof SESSION];

// Every frame was shot by Jess. Same treatment as the "Designed by Karina"
// pill on the flyer: a small corner credit, always on for touch, revealed on
// hover for pointers, linking out.
export const PHOTOGRAPHER = { name: "Jess", url: "https://shotbyjess.me" };

export function PhotoCredit({ className }: { className?: string }) {
  return (
    <a
      href={PHOTOGRAPHER.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Photo by ${PHOTOGRAPHER.name}, opens shotbyjess.me`}
      className={`absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-md px-3 py-1.5 text-[11px] text-white/85 shadow-lg opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-1.5 sm:scale-95 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 sm:group-hover:scale-100 transition-all duration-300 hover:border-[#EA9A61]/40 ${className ?? ""}`}
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <span>
        Shot by <span className="text-white font-semibold">{PHOTOGRAPHER.name}</span>
      </span>
      <span className="text-white/50 transition-colors group-hover:text-[#EA9A61]">&#8599;</span>
    </a>
  );
}

/**
 * A photo that fills its parent. The parent sets the shape (aspect ratio or
 * explicit height) and rounding; this only paints the image and a soft
 * bottom fade so it sits on black without a hard edge. The parent needs
 * the `group` class for the hover credit to reveal.
 */
export default function SessionPhoto({
  frame,
  sizes,
  fade = true,
  credit = true,
  priority,
  className,
}: {
  frame: SessionFrame;
  sizes: string;
  /** Bottom-to-transparent fade. Off when the parent paints its own overlay. */
  fade?: boolean;
  /** The photographer pill. Off when the parent places its own. */
  credit?: boolean;
  priority?: boolean;
  className?: string;
}) {
  return (
    <>
      <Image
        src={frame.src}
        alt={frame.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className ?? ""}`}
      />
      {fade && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-transparent"
        />
      )}
      {credit && <PhotoCredit />}
    </>
  );
}
