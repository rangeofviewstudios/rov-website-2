"use client";

// Flat cartoon portraits, hand-drawn in SVG — sketched closely off the
// reference photos (hair volume/part, exact glasses shapes, jersey trim,
// expression) rather than a generic "person with glasses" stand-in.
//
// Layer order matters: hair back → face → features → glasses → hair front →
// neck → shoulders → draped hair. The neck sits between chin (~y165) and
// shoulders (y168+) so clothing never covers the jaw.

// Clear acetate frames, shared by both. Faint white lens tint plus a soft
// highlight streak reads as glass rather than a black or gold outline.
function ClearGlasses({ left, right, y = 104, bridge, temples }: {
  left: number; right: number; y?: number; bridge: [number, number]; temples: [[number, number, number, number], [number, number, number, number]];
}) {
  const w = 38;
  const h = 30;
  const mid = y + h / 2;
  return (
    <g>
      <rect x={left} y={y} width={w} height={h} rx="13" fill="#FFFFFF" fillOpacity="0.14" stroke="#F4F0FA" strokeOpacity="0.9" strokeWidth="4.2" />
      <rect x={right} y={y} width={w} height={h} rx="13" fill="#FFFFFF" fillOpacity="0.14" stroke="#F4F0FA" strokeOpacity="0.9" strokeWidth="4.2" />
      {/* inner edge, gives the frame thickness */}
      <rect x={left + 2.5} y={y + 2.5} width={w - 5} height={h - 5} rx="11" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />
      <rect x={right + 2.5} y={y + 2.5} width={w - 5} height={h - 5} rx="11" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />
      {/* lens highlight streaks */}
      <path d={`M${left + 8} ${y + 22}L${left + 22} ${y + 7}`} stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="2.4" strokeLinecap="round" />
      <path d={`M${right + 8} ${y + 22}L${right + 22} ${y + 7}`} stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="2.4" strokeLinecap="round" />
      <path d={`M${bridge[0]} ${mid}H${bridge[1]}`} stroke="#F4F0FA" strokeOpacity="0.9" strokeWidth="4.2" />
      <path d={`M${temples[0][0]} ${temples[0][1]}L${temples[0][2]} ${temples[0][3]}`} stroke="#F4F0FA" strokeOpacity="0.9" strokeWidth="4.2" strokeLinecap="round" />
      <path d={`M${temples[1][0]} ${temples[1][1]}L${temples[1][2]} ${temples[1][3]}`} stroke="#F4F0FA" strokeOpacity="0.9" strokeWidth="4.2" strokeLinecap="round" />
    </g>
  );
}

export function SimranAvatar({ size = 260 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="simran-bg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#D9C2F7" />
          <stop offset="100%" stopColor="#8B6FC2" />
        </radialGradient>
        <linearGradient id="simran-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0AA7E" />
          <stop offset="100%" stopColor="#C68955" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="98" fill="url(#simran-bg)" />

      {/* hair back — big wavy volume past the shoulders, center part */}
      <path
        d="M34 128C24 84 46 30 100 28C154 30 176 84 166 128C166 156 160 186 150 200L50 200C40 186 34 156 34 128Z"
        fill="#191118"
      />
      {/* curl bumps along the silhouette */}
      <circle cx="30" cy="96" r="10" fill="#191118" />
      <circle cx="34" cy="72" r="9" fill="#191118" />
      <circle cx="28" cy="120" r="9" fill="#191118" />
      <circle cx="32" cy="144" r="8" fill="#191118" />
      <circle cx="170" cy="96" r="10" fill="#191118" />
      <circle cx="166" cy="72" r="9" fill="#191118" />
      <circle cx="172" cy="120" r="9" fill="#191118" />
      <circle cx="168" cy="144" r="8" fill="#191118" />
      {/* wave texture: S-curves down both sides */}
      <path d="M34 112C42 122 30 134 38 146C46 158 34 170 42 182" stroke="#2E2330" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M166 112C158 122 170 134 162 146C154 158 166 170 158 182" stroke="#2E2330" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M48 130C54 140 46 150 52 160" stroke="#2E2330" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M152 130C146 140 154 150 148 160" stroke="#2E2330" strokeWidth="2.4" strokeLinecap="round" fill="none" />

      {/* face */}
      <ellipse cx="100" cy="116" rx="43" ry="49" fill="url(#simran-skin)" />
      {/* blush */}
      <ellipse cx="71" cy="136" rx="7" ry="4.5" fill="#E8875C" fillOpacity="0.3" />
      <ellipse cx="129" cy="136" rx="7" ry="4.5" fill="#E8875C" fillOpacity="0.3" />

      {/* ears + tiny stud */}
      <circle cx="56" cy="120" r="6.5" fill="#CE9367" />
      <circle cx="144" cy="120" r="6.5" fill="#CE9367" />
      <circle cx="56" cy="120" r="2" fill="#E3C24A" />

      {/* eyebrows — soft arch */}
      <path d="M66 100C72 95 81 95 87 99" stroke="#191118" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M113 99C119 95 128 95 134 100" stroke="#191118" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      {/* eyes, warm and soft */}
      <ellipse cx="80" cy="116" rx="4.6" ry="5.4" fill="#241B2E" />
      <ellipse cx="120" cy="116" rx="4.6" ry="5.4" fill="#241B2E" />
      <circle cx="81.5" cy="113.5" r="1.4" fill="#fff" />
      <circle cx="121.5" cy="113.5" r="1.4" fill="#fff" />
      {/* nose */}
      <path d="M99 119C97 125 96 128 100 131" stroke="#A66B41" strokeWidth="2.3" strokeLinecap="round" fill="none" />

      {/* clear rounded frames */}
      <ClearGlasses left={58} right={104} y={103} bridge={[96, 104]} temples={[[58, 110, 45, 107], [142, 110, 155, 107]]} />

      {/* hair front — center part, loose waves framing the face */}
      <path
        d="M38 108C40 62 64 30 100 30C136 30 160 62 162 108C152 82 138 64 118 58C116 74 104 82 90 76C80 86 66 90 54 84C46 92 40 100 38 108Z"
        fill="#191118"
      />
      {/* wavy face-framing strands */}
      <path d="M46 64C40 76 46 88 40 100C36 108 42 114 40 120" stroke="#191118" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M154 64C160 76 154 88 160 100C164 108 158 114 160 120" stroke="#191118" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M60 60C54 70 60 80 56 90" stroke="#2E2330" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M140 60C146 70 140 80 144 90" stroke="#2E2330" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M96 32C98 40 98 48 96 54" stroke="#100B12" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* soft closed smile */}
      <path d="M84 146C90 152 110 152 116 146" stroke="#7A4426" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* neck, sits under the chin and behind the collar */}
      <rect x="86" y="150" width="28" height="26" rx="7" fill="#C07F4E" />

      {/* shoulders — brick/maroon waffle top, faint graphic */}
      <path d="M26 200C26 180 56 168 100 168C144 168 174 180 174 200Z" fill="#7A2530" />
      <path d="M80 170C88 180 112 180 120 170" stroke="#5C1B24" strokeWidth="4" fill="none" />
      <path d="M100 172C100 182 100 192 100 200" stroke="#5C1B24" strokeWidth="2" opacity="0.5" />
      <ellipse cx="100" cy="190" rx="14" ry="7" fill="#C77A7A" fillOpacity="0.25" />
      <path d="M60 176C54 184 51 192 51 200" stroke="#5C1B24" strokeWidth="2.4" fill="none" opacity="0.5" />
      <path d="M140 176C146 184 149 192 149 200" stroke="#5C1B24" strokeWidth="2.4" fill="none" opacity="0.5" />

      {/* long waves draping over the shoulders */}
      <path d="M44 128C36 146 48 160 40 176C34 186 44 194 42 200" stroke="#191118" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M156 128C164 146 152 160 160 176C166 186 156 194 158 200" stroke="#191118" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M44 132C38 146 48 158 42 172" stroke="#2E2330" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M156 132C162 146 152 158 158 172" stroke="#2E2330" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function AyushAvatar({ size = 260 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ayush-bg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#F7E9B8" />
          <stop offset="100%" stopColor="#B7924A" />
        </radialGradient>
        <linearGradient id="ayush-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C6905E" />
          <stop offset="100%" stopColor="#9C6738" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="98" fill="url(#ayush-bg)" />

      {/* face, turned slightly toward his left (3/4 look) */}
      <ellipse cx="98" cy="118" rx="42" ry="49" fill="url(#ayush-skin)" />
      <path d="M62 134C68 150 84 162 99 162C113 162 128 150 134 134" stroke="#7A4A28" strokeWidth="2" fill="none" opacity="0.35" />

      {/* voluminous curly hair, swept to his right, ringlet clusters */}
      <path
        d="M46 104C36 60 62 24 100 24C138 24 162 58 154 102C150 84 142 70 128 64C130 78 118 84 108 76C102 88 90 88 84 76C74 84 62 80 60 66C50 72 44 86 46 104Z"
        fill="#14100C"
      />
      <circle cx="46" cy="80" r="15" fill="#14100C" />
      <circle cx="58" cy="54" r="15" fill="#14100C" />
      <circle cx="82" cy="38" r="16" fill="#14100C" />
      <circle cx="110" cy="34" r="17" fill="#14100C" />
      <circle cx="136" cy="44" r="16" fill="#14100C" />
      <circle cx="152" cy="68" r="14" fill="#14100C" />
      <circle cx="156" cy="92" r="11" fill="#14100C" />
      <circle cx="42" cy="100" r="9" fill="#14100C" />
      {/* ringlet swirls for curl texture */}
      <path d="M52 68C56 62 64 62 66 68C68 74 62 76 58 72" stroke="#2E2822" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M78 46C82 40 90 40 92 46C94 52 88 54 84 50" stroke="#2E2822" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M108 40C112 34 120 34 122 40C124 46 118 48 114 44" stroke="#2E2822" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M134 56C138 50 146 50 148 56C150 62 144 64 140 60" stroke="#2E2822" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M40 90C44 84 52 84 54 90C56 96 50 98 46 94" stroke="#2E2822" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M150 84C154 78 162 78 164 84C166 90 160 92 156 88" stroke="#2E2822" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M66 36C70 30 78 30 80 36" stroke="#2E2822" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M122 30C126 24 134 24 136 30" stroke="#2E2822" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* curl fringe dipping onto the forehead */}
      <circle cx="70" cy="70" r="7" fill="#14100C" />
      <circle cx="96" cy="66" r="7" fill="#14100C" />
      <circle cx="124" cy="70" r="7" fill="#14100C" />

      {/* ears */}
      <circle cx="56" cy="122" r="6.5" fill="#B87C4E" />
      <circle cx="140" cy="122" r="6.5" fill="#B87C4E" />

      {/* eyebrows */}
      <path d="M62 106C68 101 78 101 84 105" stroke="#14100C" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M112 105C118 101 128 101 134 106" stroke="#14100C" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      {/* eyes, looking slightly to the side */}
      <ellipse cx="77" cy="118" rx="4.6" ry="5.2" fill="#241B2E" />
      <ellipse cx="120" cy="118" rx="4.6" ry="5.2" fill="#241B2E" />
      <circle cx="75.5" cy="115.5" r="1.4" fill="#fff" />
      <circle cx="118.5" cy="115.5" r="1.4" fill="#fff" />
      {/* nose */}
      <path d="M97 121C95 127 94 131 98 133" stroke="#7E5030" strokeWidth="2.3" strokeLinecap="round" fill="none" />

      {/* clear rounded-square frames */}
      <ClearGlasses left={56} right={102} y={104} bridge={[94, 102]} temples={[[56, 112, 43, 108], [140, 112, 153, 108]]} />

      {/* light jaw stubble */}
      <path d="M66 142C74 152 122 152 130 142" stroke="#5A3A22" strokeWidth="7" strokeLinecap="round" opacity="0.14" fill="none" />
      {/* closed, slightly smirked mouth */}
      <path d="M84 150C90 154 104 155 112 149" stroke="#5A3420" strokeWidth="3.6" strokeLinecap="round" fill="none" />

      {/* neck */}
      <rect x="84" y="152" width="28" height="26" rx="7" fill="#A06A3C" />

      {/* shoulders — gold jersey, purple/white zigzag trim */}
      <path d="M26 200C26 182 56 170 100 170C144 170 174 182 174 200Z" fill="#EFC53E" />
      <path d="M62 174C56 182 52 192 52 200" stroke="#3B2C64" strokeWidth="10" fill="none" />
      <path d="M138 174C144 182 148 192 148 200" stroke="#3B2C64" strokeWidth="10" fill="none" />
      {/* zigzag accent on the trim */}
      <path d="M56 178L60 182L56 186L60 190L56 194" stroke="#F3ECFB" strokeWidth="2" fill="none" opacity="0.85" />
      <path d="M144 178L140 182L144 186L140 190L144 194" stroke="#F3ECFB" strokeWidth="2" fill="none" opacity="0.85" />
      <path d="M72 174C86 185 114 185 128 174" stroke="#3B2C64" strokeWidth="6" fill="none" />
      <path d="M76 176C87 183 113 183 124 176" stroke="#F3ECFB" strokeWidth="1.6" fill="none" opacity="0.7" />
      {/* silver chain + pendant */}
      <path d="M88 178C92 190 108 190 112 178" stroke="#E6E6EC" strokeWidth="3" fill="none" />
      <circle cx="100" cy="193" r="5" fill="#E6E6EC" />
      <circle cx="100" cy="193" r="2" fill="#3B2C64" />
    </svg>
  );
}
