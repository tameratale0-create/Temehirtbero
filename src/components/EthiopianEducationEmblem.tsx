import React from 'react';

interface EthiopianEducationEmblemProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const EthiopianEducationEmblem: React.FC<EthiopianEducationEmblemProps> = ({
  className = '',
  size = 180,
  showText = true
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      className={`select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Golden outer rim gradient */}
        <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="30%" stopColor="#eab308" />
          <stop offset="70%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>

        {/* Deep emerald inner badge background */}
        <radialGradient id="emeraldShield" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#065f46" />
          <stop offset="65%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#022c22" />
        </radialGradient>

        {/* Golden book and torch gradient */}
        <linearGradient id="goldInsignia" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* Flame gradient */}
        <linearGradient id="torchFlame" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="40%" stopColor="#f97316" />
          <stop offset="80%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>

        {/* Ethiopian Flag circular paths */}
        <path id="textCircleTop" d="M 32 120 A 88 88 0 0 1 208 120" />
        <path id="textCircleBottom" d="M 208 120 A 88 88 0 0 1 32 120" />
      </defs>

      {/* Outer Golden Border with Beaded Edge */}
      <circle cx="120" cy="120" r="116" fill="url(#goldRim)" stroke="#78350f" strokeWidth="2" />
      <circle cx="120" cy="120" r="112" fill="#022c22" stroke="url(#goldRim)" strokeWidth="1.5" />

      {/* Ethiopian National Tricolor Ring (Green, Yellow, Red) */}
      {/* Top 120 deg: Emerald Green */}
      <path
        d="M 120 12 A 108 108 0 0 1 213.5 174 L 195.4 163.5 A 87 87 0 0 0 120 33 Z"
        fill="#15803d"
      />
      {/* Right/Bottom 120 deg: Crimson Red */}
      <path
        d="M 213.5 174 A 108 108 0 0 1 26.5 174 L 44.6 163.5 A 87 87 0 0 0 195.4 163.5 Z"
        fill="#dc2626"
      />
      {/* Left/Top 120 deg: Bright Gold Yellow */}
      <path
        d="M 26.5 174 A 108 108 0 0 1 120 12 L 120 33 A 87 87 0 0 0 44.6 163.5 Z"
        fill="#eab308"
      />

      {/* Golden Separator Ring */}
      <circle cx="120" cy="120" r="86" fill="none" stroke="url(#goldRim)" strokeWidth="3" />

      {/* Inner Central Emblem Disc (Deep Emerald Green) */}
      <circle cx="120" cy="120" r="84" fill="url(#emeraldShield)" />

      {/* Radiating Sunburst / Golden Rays of Wisdom */}
      <g stroke="#facc15" strokeWidth="1.5" opacity="0.45">
        <line x1="120" y1="42" x2="120" y2="60" />
        <line x1="120" y1="198" x2="120" y2="180" />
        <line x1="42" y1="120" x2="60" y2="120" />
        <line x1="198" y1="120" x2="180" y2="120" />
        <line x1="65" y1="65" x2="78" y2="78" />
        <line x1="175" y1="175" x2="162" y2="162" />
        <line x1="65" y1="175" x2="78" y2="162" />
        <line x1="175" y1="65" x2="162" y2="78" />
        <line x1="120" y1="120" x2="90" y2="52" strokeDasharray="2 3" />
        <line x1="120" y1="120" x2="150" y2="52" strokeDasharray="2 3" />
      </g>

      {/* Golden Wheat / Laurel Ears on Left and Right Sides */}
      <g fill="url(#goldInsignia)" opacity="0.85">
        {/* Left Laurel */}
        <path d="M 54 120 C 50 100 58 80 72 68 C 68 76 66 86 67 96 C 63 94 60 90 58 84 C 58 92 62 102 68 108 C 62 108 58 112 54 120 Z" />
        <path d="M 54 120 C 50 140 58 160 72 172 C 68 164 66 154 67 144 C 63 146 60 150 58 156 C 58 148 62 138 68 132 C 62 132 58 128 54 120 Z" />
        {/* Right Laurel */}
        <path d="M 186 120 C 190 100 182 80 168 68 C 172 76 174 86 173 96 C 177 94 180 90 182 84 C 182 92 178 102 172 108 C 178 108 182 112 186 120 Z" />
        <path d="M 186 120 C 190 140 182 160 168 172 C 172 164 174 154 173 144 C 177 146 180 150 182 156 C 182 148 178 138 172 132 C 178 132 182 128 186 120 Z" />
      </g>

      {/* Official Ethiopian Blue Emblem Disc with Yellow Star (Top of Crest) */}
      <circle cx="120" cy="74" r="15" fill="#2563eb" stroke="url(#goldRim)" strokeWidth="1.5" />
      {/* 5-Pointed Star of Ethiopia with Rays */}
      <polygon
        points="120,63 123.5,71.5 132.5,71.5 125,77 128,85 120,80 112,85 115,77 107.5,71.5 116.5,71.5"
        fill="#facc15"
      />

      {/* Open Book of Knowledge (መጽሐፍ) */}
      <g transform="translate(120, 142)">
        {/* Book Pages Base */}
        <path
          d="M 0 -8 C -18 -16 -40 -16 -50 -12 L -50 14 C -40 10 -18 10 0 18 C 18 10 40 10 50 14 L 50 -12 C 40 -16 18 -16 0 -8 Z"
          fill="#f8fafc"
          stroke="url(#goldRim)"
          strokeWidth="2"
        />
        {/* Spine */}
        <line x1="0" y1="-8" x2="0" y2="18" stroke="#78350f" strokeWidth="2.5" />
        {/* Left page lines */}
        <line x1="-42" y1="-4" x2="-8" y2="-2" stroke="#065f46" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="-42" y1="2" x2="-8" y2="4" stroke="#065f46" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="-42" y1="8" x2="-14" y2="10" stroke="#065f46" strokeWidth="1.5" strokeLinecap="round" />
        {/* Right page lines */}
        <line x1="8" y1="-2" x2="42" y2="-4" stroke="#065f46" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="4" x2="42" y2="2" stroke="#065f46" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14" y1="10" x2="42" y2="8" stroke="#065f46" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Flaming Torch of Enlightenment (ችቦ / ፋና) positioned between book and star */}
      <g transform="translate(120, 108)">
        {/* Torch Handle */}
        <path d="M -3 16 L 3 16 L 2 4 L -2 4 Z" fill="url(#goldInsignia)" stroke="#78350f" strokeWidth="0.8" />
        {/* Torch Bowl */}
        <path d="M -7 4 L 7 4 L 5 -2 L -5 -2 Z" fill="url(#goldRim)" stroke="#78350f" strokeWidth="0.8" />
        {/* Golden Flame */}
        <path
          d="M 0 -18 C 5 -12 7 -8 4 -4 C 8 -8 6 -14 0 -18 Z"
          fill="url(#torchFlame)"
        />
        <path
          d="M 0 -18 C -5 -12 -7 -8 -4 -4 C -8 -8 -6 -14 0 -18 Z"
          fill="url(#torchFlame)"
        />
        <circle cx="0" cy="-6" r="3.5" fill="#fef08a" />
      </g>

      {/* Bottom Year / Ribbon Ribbon Text */}
      <g transform="translate(120, 184)">
        <rect x="-38" y="-7" width="76" height="14" rx="7" fill="#022c22" stroke="url(#goldRim)" strokeWidth="1.2" />
        <text
          x="0"
          y="3"
          textAnchor="middle"
          fill="#fef08a"
          fontSize="8"
          fontWeight="bold"
          letterSpacing="1"
          fontFamily="system-ui, sans-serif"
        >
          1968 E.C.
        </text>
      </g>

      {/* Circular Amharic / Bilingual Typography on the Ring */}
      {showText && (
        <>
          <text fill="#ffffff" fontSize="8.2" fontWeight="bold" letterSpacing="0.8">
            <textPath href="#textCircleTop" startOffset="50%" textAnchor="middle">
              የኢትዮጵያ ትምህርት ቢሮ · SHASHEMENE
            </textPath>
          </text>
          <text fill="#fef08a" fontSize="7.8" fontWeight="bold" letterSpacing="0.6">
            <textPath href="#textCircleBottom" startOffset="50%" textAnchor="middle">
              የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ
            </textPath>
          </text>
        </>
      )}
    </svg>
  );
};
