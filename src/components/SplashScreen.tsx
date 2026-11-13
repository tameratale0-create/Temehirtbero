import React, { useEffect } from 'react';
import { Language } from '../types';
import { ShashemeneEducationBureauEmblem } from './ShashemeneEducationBureauEmblem';

interface SplashScreenProps {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ currentLang = 'om', onComplete }) => {
  useEffect(() => {
    // 10-second timer: automatically transitions to code gate after 10 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center select-none overflow-hidden cursor-pointer"
      title={
        currentLang === 'om'
          ? 'Itti fufuuf cuqaasaa (Click to continue)'
          : currentLang === 'en'
          ? 'Click to continue'
          : 'ጠቅ በማድረግ ማለፍ ይቻላል (Click to continue)'
      }
    >
      {/* Background ambient lighting around the emblem */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Ambient rotating light halo behind the emblem */}
        <div
          className="w-80 h-80 sm:w-96 sm:h-96 rounded-full opacity-60 blur-3xl animate-spin pointer-events-none"
          style={{
            animationDuration: '7s',
            background:
              'conic-gradient(from 0deg, #dc2626 0deg 90deg, #ffffff 90deg 180deg, #09090b 180deg 270deg, #16a34a 270deg 360deg)'
          }}
        />

        {/* Soft centered amber/emerald glow */}
        <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />
      </div>

      {/* ONLY the official Emblem: completely free of all text, buttons, header, footer or bars */}
      <div className="relative z-10 flex items-center justify-center drop-shadow-[0_0_40px_rgba(234,179,8,0.35)] transition-transform duration-700 hover:scale-105">
        <ShashemeneEducationBureauEmblem size={280} showText={true} />
      </div>
    </div>
  );
};
