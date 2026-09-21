"use client";

// The backdrop for the beat-up game: a blue-hour coastline with a low yellow
// sun and a magenta band where the light hits the haze. Built as stacked
// layers, back to front: stars → clouds → sun → far and near headlands →
// sea with a sun path → foreground cliff with grass and wildflowers.
//
// Two SVGs on purpose. The sky/sea layer keeps its aspect (xMidYMid slice)
// so the sun and clouds never squash; the cliff stretches (none) so the
// silhouette always spans the full width regardless of viewport shape.

const STARS: [number, number, number][] = [
  [60, 40, 1.6], [140, 90, 1.2], [230, 30, 1.8], [320, 110, 1.1], [410, 60, 1.5],
  [500, 25, 1.3], [590, 95, 1.7], [680, 45, 1.2], [760, 120, 1.4], [850, 35, 1.8],
  [930, 85, 1.2], [180, 160, 1.1], [720, 170, 1.3], [880, 150, 1.0], [40, 130, 1.3],
  [460, 150, 1.0], [610, 200, 1.1], [300, 210, 1.2],
];

export default function Scenery() {
  return (
    <>
      {/* sky + sea */}
      <svg
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#071C55" />
            <stop offset="34%" stopColor="#1E56C4" />
            <stop offset="56%" stopColor="#C748A8" />
            <stop offset="70%" stopColor="#FF9A5C" />
            <stop offset="78%" stopColor="#FFD54F" />
          </linearGradient>
          <linearGradient id="sc-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2B8BD8" />
            <stop offset="45%" stopColor="#1560A8" />
            <stop offset="100%" stopColor="#082B58" />
          </linearGradient>
          <radialGradient id="sc-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF6C8" />
            <stop offset="55%" stopColor="#FFD84A" />
            <stop offset="100%" stopColor="#FFB13B" />
          </radialGradient>
          <radialGradient id="sc-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD54F" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FF7BB0" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF7BB0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sc-sunpath" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE27A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFE27A" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="1000" height="700" fill="url(#sc-sky)" />

        {/* stars, only in the deep blue */}
        {STARS.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#FFFFFF" fillOpacity="0.85" />
        ))}
        <circle cx="760" cy="60" r="3.2" fill="#FFF3B0" />

        {/* thin cloud bands catching the magenta */}
        <g fill="#FF8FD0" fillOpacity="0.55">
          <ellipse cx="180" cy="330" rx="150" ry="14" />
          <ellipse cx="240" cy="318" rx="80" ry="10" />
          <ellipse cx="820" cy="300" rx="170" ry="16" />
          <ellipse cx="760" cy="286" rx="90" ry="11" />
        </g>
        <g fill="#FFC1E6" fillOpacity="0.45">
          <ellipse cx="520" cy="372" rx="120" ry="9" />
          <ellipse cx="80" cy="392" rx="90" ry="8" />
        </g>

        {/* sun glow, then the sun, sitting just above the water line */}
        <circle cx="500" cy="500" r="260" fill="url(#sc-glow)" />
        <circle cx="500" cy="500" r="82" fill="url(#sc-sun)" />

        {/* far headland, backlit blue */}
        <path d="M0 540L120 470C170 450 210 468 260 452C320 432 360 458 420 446C440 442 460 448 480 470L520 540Z" fill="#2E5FB8" fillOpacity="0.9" />
        <path d="M560 540C620 470 700 430 780 452C830 466 870 440 930 452L1000 500V540Z" fill="#2E5FB8" fillOpacity="0.9" />
        {/* nearer headland, deeper */}
        <path d="M0 560L90 512C140 490 200 500 250 486C300 472 330 490 380 500L420 540H0Z" fill="#183D8C" />
        <path d="M640 540C700 500 760 486 830 494C890 500 930 486 1000 520V560H640Z" fill="#183D8C" />

        {/* sea */}
        <rect x="0" y="540" width="1000" height="160" fill="url(#sc-sea)" />
        {/* sun path on the water */}
        <path d="M470 540L530 540L600 700L400 700Z" fill="url(#sc-sunpath)" />
        {/* wave lines, denser near the horizon */}
        <g stroke="#9ED2FF" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M40 556H180M240 556H340M700 556H820M880 556H960" />
          <path d="M120 572H260M420 572H520M600 572H760" />
          <path d="M60 594H150M300 594H430M560 594H640M800 594H920" />
          <path d="M200 622H330M480 622H560M700 622H860" />
        </g>
        <g stroke="#FFE27A" strokeOpacity="0.8" strokeWidth="2.6" strokeLinecap="round" fill="none">
          <path d="M470 566H530M455 590H545M440 618H560M425 650H575" />
        </g>

        {/* birds heading home */}
        <g stroke="#0A1A44" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M300 250C306 244 312 244 318 250M318 250C324 244 330 244 336 250" />
          <path d="M340 236C345 231 350 231 355 236M355 236C360 231 365 231 370 236" />
          <path d="M270 268C274 264 278 264 282 268M282 268C286 264 290 264 294 268" />
        </g>
      </svg>

      {/* foreground cliff, stretches to the width */}
      <svg
        viewBox="0 0 1000 400"
        preserveAspectRatio="none"
        aria-hidden
        style={{ position: "absolute", left: 0, right: 0, bottom: 0, width: "100%", height: "46%" }}
      >
        <path d="M0 400V120C120 90 200 180 340 150C480 120 520 40 680 70C820 96 880 160 1000 130V400Z" fill="#12315F" />
        <path d="M0 400V150C120 122 200 200 340 176C480 150 520 78 680 104C820 128 880 182 1000 156V400Z" fill="#0A1F42" />
        {/* lit rim on the cliff edge */}
        <path d="M0 122C120 92 200 182 340 152C480 122 520 42 680 72C820 98 880 162 1000 132" stroke="#FFD54F" strokeOpacity="0.35" strokeWidth="3" fill="none" />
      </svg>

      {/* grass + wildflowers, keep their shape */}
      <svg
        viewBox="0 0 1000 400"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden
        style={{ position: "absolute", left: 0, right: 0, bottom: 0, width: "100%", height: "46%", overflow: "visible" }}
      >
        {[40, 110, 190, 270, 380, 460, 540, 640, 730, 810, 900, 960].map((x, i) => {
          const y = 128 + ((i * 37) % 60);
          return (
            <g key={x} transform={`translate(${x} ${y})`}>
              <path d="M0 22C-3 12 -2 0 0 -12C2 0 3 12 0 22Z" fill="#7FB04A" />
              <path d="M9 24C7 14 9 4 14 -6C16 4 15 15 9 24Z" fill="#8FC157" />
              <path d="M-9 24C-7 14 -9 4 -14 -6C-16 4 -15 15 -9 24Z" fill="#6A9C3E" />
              {i % 3 === 0 && <circle cx="4" cy="-14" r="4" fill="#FFD54F" />}
              {i % 3 === 1 && <circle cx="-5" cy="-10" r="3.6" fill="#FF5FA2" />}
            </g>
          );
        })}
      </svg>
    </>
  );
}
