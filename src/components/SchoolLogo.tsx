import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  Sparkles,
  Sun,
  Flame,
  Shield,
  Compass
} from 'lucide-react';

export interface SchoolLogoProps {
  logoUrl?: string;
  schoolName: string;
  size?: number;
  className?: string;
  shape?: 'circle' | 'rounded';
}

export const SCHOOL_LOGO_PRESETS = [
  {
    id: 'preset:torch',
    labelAm: 'የእውቀት ችቦ እና መጽሐፍ',
    labelOm: 'Goba Beekumsaa fi Kitaaba',
    labelEn: 'Torch of Knowledge & Book',
    bgColor: 'from-amber-600 via-amber-500 to-yellow-500',
    borderColor: 'border-amber-400',
    iconColor: 'text-amber-100',
    type: 'flame'
  },
  {
    id: 'preset:star',
    labelAm: 'የጥበብ ኮከብ እና ጋሻ',
    labelOm: 'Urjii fi Gaachana Ogummaa',
    labelEn: 'Star of Wisdom & Shield',
    bgColor: 'from-emerald-700 via-emerald-600 to-teal-500',
    borderColor: 'border-emerald-300',
    iconColor: 'text-emerald-100',
    type: 'award'
  },
  {
    id: 'preset:book',
    labelAm: 'ክፍት መጽሐፍ እና ብዕር',
    labelOm: 'Kitaaba Banaa fi Qalama',
    labelEn: 'Open Book & Quill',
    bgColor: 'from-blue-700 via-indigo-600 to-cyan-500',
    borderColor: 'border-cyan-300',
    iconColor: 'text-cyan-100',
    type: 'book'
  },
  {
    id: 'preset:sun',
    labelAm: 'የተስፋ ፀሐይ እና አድማስ',
    labelOm: 'Aduu Abdii fi Samii',
    labelEn: 'Rising Sun of Hope',
    bgColor: 'from-orange-600 via-amber-500 to-yellow-400',
    borderColor: 'border-yellow-300',
    iconColor: 'text-yellow-100',
    type: 'sun'
  },
  {
    id: 'preset:cap',
    labelAm: 'የምረቃ ቆብ እና የላቀ ውጤት',
    labelOm: 'Guffee Eebbaa fi Qabxii Olaanaa',
    labelEn: 'Graduation Cap & Excellence',
    bgColor: 'from-purple-800 via-violet-700 to-indigo-600',
    borderColor: 'border-purple-300',
    iconColor: 'text-purple-100',
    type: 'cap'
  },
  {
    id: 'preset:shield',
    labelAm: 'የአካዳሚ ጥበቃ እና ታማኝነት',
    labelOm: 'Gaachana Barnootaa fi Amanamummaa',
    labelEn: 'Academy Shield & Honor',
    bgColor: 'from-slate-800 via-teal-900 to-emerald-900',
    borderColor: 'border-emerald-400',
    iconColor: 'text-teal-200',
    type: 'shield'
  }
];

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  logoUrl,
  schoolName,
  size = 48,
  className = '',
  shape = 'circle'
}) => {
  const roundedClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  // 1. If it's a custom uploaded image (base64 or URL)
  if (logoUrl && (logoUrl.startsWith('data:image') || logoUrl.startsWith('http') || logoUrl.startsWith('/'))) {
    return (
      <div
        className={`relative overflow-hidden shrink-0 border-2 border-white/90 shadow-md ${roundedClass} ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={logoUrl}
          alt={schoolName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  // 2. If it's one of the curated presets
  const preset = SCHOOL_LOGO_PRESETS.find((p) => p.id === logoUrl);
  if (preset) {
    const iconSize = Math.max(Math.round(size * 0.52), 16);
    return (
      <div
        className={`relative shrink-0 flex items-center justify-center bg-gradient-to-br ${preset.bgColor} border-2 ${preset.borderColor} shadow-md overflow-hidden ${roundedClass} ${className}`}
        style={{ width: size, height: size }}
        title={`${schoolName} - ${preset.labelAm}`}
      >
        {preset.type === 'flame' && <Flame style={{ width: iconSize, height: iconSize }} className={preset.iconColor} />}
        {preset.type === 'award' && <Award style={{ width: iconSize, height: iconSize }} className={preset.iconColor} />}
        {preset.type === 'book' && <BookOpen style={{ width: iconSize, height: iconSize }} className={preset.iconColor} />}
        {preset.type === 'sun' && <Sun style={{ width: iconSize, height: iconSize }} className={preset.iconColor} />}
        {preset.type === 'cap' && <GraduationCap style={{ width: iconSize, height: iconSize }} className={preset.iconColor} />}
        {preset.type === 'shield' && <Shield style={{ width: iconSize, height: iconSize }} className={preset.iconColor} />}

        {/* Subtle decorative glow ring */}
        <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
      </div>
    );
  }

  // 3. Default fallback: Clean high-fidelity vector seal using initial letter of school
  const initialChar = (schoolName.trim().charAt(0) || 'ት').toUpperCase();
  const iconSize = Math.max(Math.round(size * 0.45), 14);

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 border-2 border-amber-400/80 shadow-md overflow-hidden ${roundedClass} ${className}`}
      style={{ width: size, height: size }}
      title={schoolName}
    >
      <div className="flex flex-col items-center justify-center text-white">
        <span
          className="font-black tracking-tight leading-none text-amber-300 drop-shadow-xs"
          style={{ fontSize: iconSize }}
        >
          {initialChar}
        </span>
      </div>

      {/* Decorative ring */}
      <div className="absolute inset-0 rounded-full border border-amber-300/30 pointer-events-none" />
    </div>
  );
};
