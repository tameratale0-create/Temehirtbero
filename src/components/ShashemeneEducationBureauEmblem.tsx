import React from 'react';

interface ShashemeneEducationBureauEmblemProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const ShashemeneEducationBureauEmblem: React.FC<ShashemeneEducationBureauEmblemProps> = ({
  size = 180,
  className = '',
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
        <linearGradient id="shashGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="25%" stopColor="#facc15" />
          <stop offset="65%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>

        {/* Oromia Sky / Background Gradient */}
        <radialGradient id="shashSkyBg" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="25%" stopColor="#86efac" />
          <stop offset="60%" stopColor="#065f46" />
          <stop offset="100%" stopColor="#022c22" />
        </radialGradient>

        {/* Lush Odaa Tree Green Gradient */}
        <linearGradient id="odaaFoliage" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="50%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>

        {/* Tree Trunk Wood Gradient */}
        <linearGradient id="odaaTrunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="50%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>

        {/* Flame gradient */}
        <linearGradient id="shashTorch" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#facc15" />
        </linearGradient>

        {/* Circular Text Paths */}
        <path id="shashCircleTop" d="M 32 120 A 88 88 0 0 1 208 120" />
        <path id="shashCircleBottom" d="M 208 120 A 88 88 0 0 1 32 120" />

        {/* Golden Typography Gradients (ወርቃማ የፅሁፍ ቀለም) */}
        <linearGradient id="shashGoldText" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="25%" stopColor="#fef08a" />
          <stop offset="55%" stopColor="#facc15" />
          <stop offset="85%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>

        <linearGradient id="shashCurvedGoldText" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#facc15" />
          <stop offset="70%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>

      {/* Outer Golden Border with Beaded Rim */}
      <circle cx="120" cy="120" r="116" fill="url(#shashGoldRim)" stroke="#78350f" strokeWidth="2.5" />
      <circle cx="120" cy="120" r="111" fill="#09090b" stroke="url(#shashGoldRim)" strokeWidth="1.5" />

      {/* Oromia Gadaa Flag Ring: Black (Gurraacha), Red (Diimaa), White (Adii) */}
      {/* Top 120 deg: Black (Gurraacha) */}
      <path
        d="M 120 12 A 108 108 0 0 1 213.5 174 L 195.4 163.5 A 87 87 0 0 0 120 33 Z"
        fill="#09090b"
      />
      {/* Bottom 120 deg: Red (Diimaa) */}
      <path
        d="M 213.5 174 A 108 108 0 0 1 26.5 174 L 44.6 163.5 A 87 87 0 0 0 195.4 163.5 Z"
        fill="#dc2626"
      />
      {/* Left 120 deg: White (Adii) */}
      <path
        d="M 26.5 174 A 108 108 0 0 1 120 12 L 120 33 A 87 87 0 0 0 44.6 163.5 Z"
        fill="#ffffff"
      />

      {/* Golden Separator Ring */}
      <circle cx="120" cy="120" r="86" fill="none" stroke="url(#shashGoldRim)" strokeWidth="3" />

      {/* Inner Central Shield */}
      <circle cx="120" cy="120" r="84" fill="url(#shashSkyBg)" />

      {/* Golden Sun behind Odaa Tree with Radiating Rays */}
      <circle cx="120" cy="95" r="32" fill="#fef08a" opacity="0.35" />
      <g stroke="#facc15" strokeWidth="1.2" opacity="0.6">
        <line x1="120" y1="56" x2="120" y2="44" />
        <line x1="86" y1="68" x2="76" y2="58" />
        <line x1="154" y1="68" x2="164" y2="58" />
        <line x1="68" y1="95" x2="54" y2="95" />
        <line x1="172" y1="95" x2="186" y2="95" />
      </g>

      {/* Iconic Sacred Odaa Tree of Oromia / Shashemene (Muka Odaa) */}
      {/* Odaa Canopy (Rich rounded interconnected leaf clusters) */}
      <g fill="url(#odaaFoliage)" stroke="#064e3b" strokeWidth="1">
        {/* Main central canopy cloud */}
        <circle cx="120" cy="86" r="22" />
        {/* Left canopy clusters */}
        <circle cx="102" cy="88" r="17" />
        <circle cx="88" cy="94" r="14" />
        <circle cx="108" cy="74" r="16" />
        {/* Right canopy clusters */}
        <circle cx="138" cy="88" r="17" />
        <circle cx="152" cy="94" r="14" />
        <circle cx="132" cy="74" r="16" />
        {/* Top canopy crown */}
        <circle cx="120" cy="68" r="15" />
      </g>

      {/* Odaa Tree Trunk & Sturdy Spreading Branches */}
      <g fill="url(#odaaTrunk)" stroke="#291201" strokeWidth="0.8">
        {/* Central sturdy trunk */}
        <path d="M 115 138 L 117 106 L 123 106 L 125 138 Z" />
        {/* Left spreading branch */}
        <path d="M 117 112 Q 106 104 94 100 Q 104 108 116 116 Z" />
        {/* Right spreading branch */}
        <path d="M 123 112 Q 134 104 146 100 Q 136 108 124 116 Z" />
        {/* Root base flair */}
        <path d="M 112 138 Q 120 134 128 138 L 126 142 L 114 142 Z" />
      </g>

      {/* Open Book of Education in front of Odaa tree base */}
      <g transform="translate(120, 146)">
        <path
          d="M 0 -8 C -18 -16 -40 -16 -50 -12 L -50 14 C -40 10 -18 10 0 18 C 18 10 40 10 50 14 L 50 -12 C 40 -16 18 -16 0 -8 Z"
          fill="#f8fafc"
          stroke="url(#shashGoldRim)"
          strokeWidth="2"
        />
        <line x1="0" y1="-8" x2="0" y2="18" stroke="#78350f" strokeWidth="2.5" />
        {/* Lines */}
        <line x1="-42" y1="-4" x2="-8" y2="-2" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="-42" y1="2" x2="-8" y2="4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="-42" y1="8" x2="-14" y2="10" stroke="#09090b" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="-2" x2="42" y2="-4" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="4" x2="42" y2="2" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14" y1="10" x2="42" y2="8" stroke="#09090b" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Torch of Knowledge (Centered above book) */}
      <g transform="translate(120, 126)">
        <path d="M -3 10 L 3 10 L 2 2 L -2 2 Z" fill="url(#shashGoldRim)" stroke="#78350f" strokeWidth="0.8" />
        <path d="M 0 -10 C 4 -6 6 -3 3 0 C 7 -3 5 -8 0 -10 Z" fill="url(#shashTorch)" />
        <path d="M 0 -10 C -4 -6 -6 -3 -3 0 C -7 -3 -5 -8 0 -10 Z" fill="url(#shashTorch)" />
        <circle cx="0" cy="-2" r="2.5" fill="#fef08a" />
      </g>

      {/* Bottom Ribbon / Banner */}
      <g transform="translate(120, 186)">
        <rect x="-44" y="-7" width="88" height="15" rx="7.5" fill="#09090b" stroke="url(#shashGoldRim)" strokeWidth="1.5" />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fill="url(#shashGoldText)"
          stroke="#78350f"
          strokeWidth="0.3"
          fontSize="8.2"
          fontWeight="900"
          letterSpacing="1"
          fontFamily="system-ui, sans-serif"
        >
          SHASHEMENE
        </text>
      </g>

      {/* Circular Afaan Oromoo & Amharic Typography (ወርቃማ የፅሁፍ ቀለም) */}
      {showText && (
        <>
          <text
            fill="url(#shashCurvedGoldText)"
            stroke="#451a03"
            strokeWidth="0.35"
            fontSize="7.4"
            fontWeight="900"
            letterSpacing="0.6"
          >
            <textPath href="#shashCircleTop" startOffset="50%" textAnchor="middle">
              BIIROO BARNOOTAA BULCHIINSA MAGAALAA SHASHAMANNEE
            </textPath>
          </text>
          <text
            fill="url(#shashCurvedGoldText)"
            stroke="#451a03"
            strokeWidth="0.35"
            fontSize="8"
            fontWeight="900"
            letterSpacing="0.5"
          >
            <textPath href="#shashCircleBottom" startOffset="50%" textAnchor="middle">
              የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ
            </textPath>
          </text>
        </>
      )}
    </svg>
  );
};
