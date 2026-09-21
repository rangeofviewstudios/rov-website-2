"use client";

// Full-body target + floral bat, in the same hand-drawn SVG style as
// the moodboard avatars. Reuses the face/hair/glasses/jersey details
// so he's recognizable, just built out to a standing figure.

// Hair is built from removable clusters so each hit can knock one off.
// Ordered by loss: outer ringlets first, fringe next, the main mass last.
// [cx, cy, r]
const HAIR_CLUSTERS: [number, number, number][] = [
  [160, 118, 10],  // temple curls, hug the sides of the head
  [58, 120, 10],
  [166, 100, 12],
  [54, 100, 14],
  [162, 78, 14],
  [66, 70, 15],
  [146, 54, 16],
  [92, 48, 16],
  [120, 44, 17],
  [80, 96, 8],   // fringe tufts, sit on the hairline
  [106, 92, 8],
  [134, 96, 8],
];
export const HAIR_PIECES = HAIR_CLUSTERS.length + 1; // clusters + main mass

export function AyushTarget({
  width = 220,
  hits = 0,
  maxHits = 7,
  hurt = false,
}: {
  width?: number;
  /** Hits landed so far. Drives how much hair is left. */
  hits?: number;
  maxHits?: number;
  /** True for a beat after a hit: frown, pinched brows, squeezed eyes. */
  hurt?: boolean;
}) {
  // Lose everything by the final hit. Clusters go first, main mass last.
  const lost = Math.min(HAIR_PIECES, Math.round((hits / maxHits) * HAIR_PIECES));
  const clustersLeft = Math.max(0, HAIR_CLUSTERS.length - lost);
  const massGone = lost >= HAIR_PIECES;

  return (
    <svg width={width} viewBox="0 0 220 420" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="t-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D49A62" />
          <stop offset="100%" stopColor="#A96C3B" />
        </linearGradient>
      </defs>
      {/* legs */}
      <path d="M84 300C80 340 78 380 82 415" stroke="#241B2E" strokeWidth="26" strokeLinecap="round" />
      <path d="M136 300C140 340 142 380 138 415" stroke="#241B2E" strokeWidth="26" strokeLinecap="round" />
      {/* shoes */}
      <ellipse cx="80" cy="415" rx="18" ry="9" fill="#F3ECFB" />
      <ellipse cx="140" cy="415" rx="18" ry="9" fill="#F3ECFB" />
      {/* arms */}
      <path d="M62 230C44 250 36 278 42 306" stroke="#EBC53F" strokeWidth="24" strokeLinecap="round" />
      <path d="M158 230C176 250 184 278 178 306" stroke="#EBC53F" strokeWidth="24" strokeLinecap="round" />
      <circle cx="42" cy="310" r="13" fill="url(#t-skin)" />
      <circle cx="178" cy="310" r="13" fill="url(#t-skin)" />
      {/* torso — gold jersey, purple/white zigzag trim */}
      <path d="M60 200C60 180 80 168 110 168C140 168 160 180 160 200L166 300L54 300Z" fill="#EFC53E" />
      <path d="M78 172C70 182 66 200 66 220" stroke="#3B2C64" strokeWidth="10" fill="none" />
      <path d="M142 172C150 182 154 200 154 220" stroke="#3B2C64" strokeWidth="10" fill="none" />
      <path d="M86 170C96 180 124 180 134 170" stroke="#3B2C64" strokeWidth="7" fill="none" />
      <path d="M90 172C97 178 123 178 130 172" stroke="#F3ECFB" strokeWidth="1.8" fill="none" opacity="0.7" />
      <path d="M108 190C104 220 104 260 108 296" stroke="#D9A83E" strokeWidth="3" opacity="0.5" />
      {/* chain */}
      <path d="M98 180C102 194 118 194 122 180" stroke="#E6E6EC" strokeWidth="3" fill="none" />
      <circle cx="110" cy="198" r="5" fill="#E6E6EC" />
      {/* neck */}
      <rect x="98" y="150" width="24" height="24" rx="8" fill="url(#t-skin)" />
      {/* head, turned slightly */}
      <ellipse cx="108" cy="120" rx="40" ry="47" fill="url(#t-skin)" />
      <path d="M74 136C80 152 96 164 110 164C123 164 137 152 143 136" stroke="#7A4A28" strokeWidth="2" fill="none" opacity="0.3" />
      {/* scalp shine once the hair is gone */}
      {massGone && <ellipse cx="100" cy="86" rx="14" ry="6" fill="#FFFFFF" fillOpacity="0.22" />}

      {/* ringlet curly hair, swept right. Main mass hugs the crown; the
          front edge dips onto the forehead so it reads as attached. */}
      {!massGone && (
        <path
          d="M58 122C46 76 74 40 110 40C146 40 174 74 160 120C156 102 148 90 136 88C138 100 126 104 118 98C112 104 100 104 94 98C86 104 74 102 72 90C64 96 58 108 58 122Z"
          fill="#14100C"
        />
      )}
      {HAIR_CLUSTERS.slice(0, clustersLeft).map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#14100C" />
      ))}
      {clustersLeft > 5 && (
        <path d="M60 84C64 78 72 78 74 84C76 90 70 92 66 88" stroke="#2E2822" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      )}
      {clustersLeft > 8 && (
        <path d="M116 52C120 46 128 46 130 52C132 58 126 60 122 56" stroke="#2E2822" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      )}
      {clustersLeft > 6 && (
        <path d="M140 66C144 60 152 60 154 66C156 72 150 74 146 70" stroke="#2E2822" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      )}

      {/* eyebrows: soft arch normally, pinched inward when hurt */}
      {hurt ? (
        <>
          <path d="M72 104C78 106 88 108 94 112" stroke="#14100C" strokeWidth="3.4" strokeLinecap="round" fill="none" />
          <path d="M122 112C128 108 138 106 144 104" stroke="#14100C" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <path d="M72 108C78 103 88 103 94 107" stroke="#14100C" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <path d="M122 107C128 103 138 103 144 108" stroke="#14100C" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        </>
      )}
      {/* eyes: open normally, squeezed shut when hurt */}
      {hurt ? (
        <>
          <path d="M80 121C84 118 90 118 94 121" stroke="#241B2E" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <path d="M123 121C127 118 133 118 137 121" stroke="#241B2E" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <ellipse cx="87" cy="120" rx="4.5" ry="5" fill="#241B2E" />
          <ellipse cx="130" cy="120" rx="4.5" ry="5" fill="#241B2E" />
        </>
      )}
      {/* clear rounded-square frames */}
      <rect x="66" y="106" width="36" height="28" rx="12" fill="#FFFFFF" fillOpacity="0.14" stroke="#F4F0FA" strokeOpacity="0.9" strokeWidth="4" />
      <rect x="112" y="106" width="36" height="28" rx="12" fill="#FFFFFF" fillOpacity="0.14" stroke="#F4F0FA" strokeOpacity="0.9" strokeWidth="4" />
      <path d="M74 126L86 113" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M120 126L132 113" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M102 120H112" stroke="#F4F0FA" strokeOpacity="0.9" strokeWidth="4" />
      <path d="M66 114L53 110" stroke="#F4F0FA" strokeOpacity="0.9" strokeWidth="4" strokeLinecap="round" />
      <path d="M148 114L161 110" stroke="#F4F0FA" strokeOpacity="0.9" strokeWidth="4" strokeLinecap="round" />
      {/* mouth: nervous smile, or a proper frown when hurt */}
      {hurt ? (
        <path d="M94 156C100 148 116 148 122 156" stroke="#5A3420" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M94 150C100 154 116 154 122 149" stroke="#5A3420" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      )}
    </svg>
  );
}

export function FloralBat({ width = 260 }: { width?: number }) {
  return (
    <svg width={width} viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* handle, with a knob so it reads as a bat grip */}
      <rect x="6" y="40" width="90" height="20" rx="10" fill="#6B4A2F" stroke="#4A311D" strokeWidth="2" />
      <ellipse cx="8" cy="50" rx="8" ry="13" fill="#6B4A2F" stroke="#4A311D" strokeWidth="2" />
      {/* barrel: gentle taper into a fully rounded end, no point */}
      <path
        d="M90 34C180 28 280 26 350 28C374 28 394 38 394 50C394 62 374 72 350 72C280 74 180 72 90 66Z"
        fill="#C9A6FF"
        stroke="#8B4FE0"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* highlight along the top of the barrel */}
      <path d="M120 38C200 33 300 32 356 36" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* lily wraps */}
      {[110, 165, 220, 275, 330].map((x, i) => (
        <g key={x} transform={`translate(${x} ${i % 2 === 0 ? 34 : 60})`}>
          <circle r="4" fill="#E3C24A" />
          <path d="M0 0C0 0 -10 -8 -16 -2C-16 -2 -10 4 0 0Z" fill="#FFFFFF" />
          <path d="M0 0C0 0 10 -8 16 -2C16 -2 10 4 0 0Z" fill="#FFFFFF" />
          <path d="M0 0C0 0 -8 8 -2 16C-2 16 6 10 0 0Z" fill="#FFFFFF" />
          <path d="M0 0C0 0 8 8 2 16C2 16 -6 10 0 0Z" fill="#FFFFFF" />
        </g>
      ))}
    </svg>
  );
}
