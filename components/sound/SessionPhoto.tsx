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

/**
 * A photo that fills its parent. The parent sets the shape (aspect ratio or
 * explicit height) and rounding; this only paints the image and a soft
 * bottom fade so it sits on black without a hard edge.
 */
export default function SessionPhoto({
  frame,
  sizes,
  fade = true,
  priority,
  className,
}: {
  frame: SessionFrame;
  sizes: string;
  /** Bottom-to-transparent fade. Off when the parent paints its own overlay. */
  fade?: boolean;
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
    </>
  );
}
