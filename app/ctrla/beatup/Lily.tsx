"use client";

export default function Lily({
  size = 40,
  color = "#FFFFFF",
  style,
}: {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style}>
      <g stroke={color} strokeWidth="1.6" strokeLinejoin="round" fill={color} fillOpacity="0.22">
        <path d="M32 32C32 32 22 14 8 16C8 16 14 30 32 32Z" />
        <path d="M32 32C32 32 42 14 56 16C56 16 50 30 32 32Z" />
        <path d="M32 32C32 32 14 34 10 48C10 48 26 48 32 32Z" />
        <path d="M32 32C32 32 50 34 54 48C54 48 38 48 32 32Z" />
        <path d="M32 32C32 32 24 44 32 58C32 58 40 44 32 32Z" />
      </g>
      <circle cx="32" cy="32" r="4" fill="#E3C24A" stroke="none" />
    </svg>
  );
}
