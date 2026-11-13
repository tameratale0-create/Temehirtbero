import React, { useState, useEffect } from 'react';
import {
  Globe,
  Wifi,
  WifiOff,
  Download,
  Upload,
  LogOut,
  UserCheck,
  Building2,
  GraduationCap,
  Sparkles,
  BookOpen,
  KeyRound,
  Code2
} from 'lucide-react';
import { Language, AppUserSession } from '../types';
import { translations } from '../data/translations';
import { StorageService } from '../utils/storage';
import { ShashemeneEducationBureauEmblem } from './ShashemeneEducationBureauEmblem';
import { PWAInstallButton } from './PWAInstallButton';
import { OfflineSyncPill } from './OfflineSyncPill';
import { SchoolLogo } from './SchoolLogo';
import { School } from '../types';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: AppUserSession | null;
  onLogout: () => void;
  onQuickRoleSelect: (role: AppUserSession) => void;
  onOpenLogin: () => void;
  onOpenRegisterSchool: () => void;
  onOpenCodeGate?: () => void;
  onReplaySplash?: () => void;
  isSchoolView?: boolean;
  activeSchool?: School;
  onNavigateToBureau?: () => void;
  onOpenDeveloperPortal?: () => void;
  onOpenDeveloperProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  currentUser,
  onLogout,
  onQuickRoleSelect,
  onOpenLogin,
  onOpenRegisterSchool,
  onOpenCodeGate,
  onReplaySplash,
  isSchoolView = false,
  activeSchool,
  onNavigateToBureau,
  onOpenDeveloperPortal,
  onOpenDeveloperProfile
}) => {
  const t = translations[currentLang];
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showBackupModal, setShowBackupModal] = useState<boolean>(false);
  const [confirmResetDefaults, setConfirmResetDefaults] = useState<boolean>(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<string>('');

  // 5-tap detection on Education Bureau Emblem for Secret Developer Portal
  const [bureauLogoTaps, setBureauLogoTaps] = useState<number>(0);
  const [tapResetTimer, setTapResetTimer] = useState<NodeJS.Timeout | null>(null);

  const handleBureauLogoTap = () => {
    const nextTaps = bureauLogoTaps + 1;
    setBureauLogoTaps(nextTaps);

    if (tapResetTimer) {
      clearTimeout(tapResetTimer);
    }

    if (nextTaps >= 5) {
      setBureauLogoTaps(0);
      if (onOpenDeveloperPortal) {
        onOpenDeveloperPortal();
      }
    } else {
      const timer = setTimeout(() => {
        setBureauLogoTaps(0);
      }, 2500);
      setTapResetTimer(timer);
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleExportData = () => {
    const jsonStr = StorageService.exportAllDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shashemene_edu_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = StorageService.importBackupData(content);
      if (success) {
        setImportStatus('success');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setImportStatus('error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Offline Status Ribbon if offline */}
      {!isOnline && (
        <div className="bg-amber-600 text-white px-4 py-1.5 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span>{t.offline_notice}</span>
          </div>
          <span className="bg-amber-800/60 px-2 py-0.5 rounded text-[11px]">
            {t.offline_mode}
          </span>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo & Identity: On School View, show School's Logo & Identity + miniature Bureau emblem for 5-tap access */}
          {isSchoolView ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <SchoolLogo
                logoUrl={activeSchool?.logoUrl}
                schoolName={activeSchool?.name || t.school_portal_title}
                size={42}
                shape="rounded"
                className="ring-2 ring-emerald-600/40 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xs sm:text-base font-bold tracking-tight text-slate-900 leading-tight truncate max-w-[140px] xs:max-w-[200px] sm:max-w-[340px]">
                    {activeSchool?.name || t.school_portal_title}
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 shrink-0">
                    {t.school_portal_badge}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate max-w-[160px] xs:max-w-[220px] sm:max-w-none">
                    {activeSchool?.subcity ? `${activeSchool.subcity} · ` : ''}
                    <span className="text-emerald-700 font-semibold">{activeSchool?.principalName || t.city_name}</span>
                  </p>
                  {/* Subtle 5-tap Bureau Emblem in School view */}
                  <button
                    type="button"
                    onClick={handleBureauLogoTap}
                    title={
                      currentLang === 'om'
                        ? 'Asxaa Biiroo Barnootaa (Seensa Misoomsaa: Tuqaa 5)'
                        : currentLang === 'en'
                        ? 'Education Bureau Emblem (Developer Access: 5 Taps)'
                        : 'የትምህርት ቢሮ አርማ (Developer Access: 5 Taps)'
                    }
                    className="relative inline-flex items-center p-0.5 rounded bg-slate-900 border border-red-500/40 text-white shrink-0 hover:border-red-400 active:scale-95 transition cursor-pointer"
                  >
                    <ShashemeneEducationBureauEmblem size={16} showText={false} />
                    {bureauLogoTaps > 1 && (
                      <span className="absolute -top-2 -right-2 px-1 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black shadow-xs">
                        {bureauLogoTaps}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={handleBureauLogoTap}
                className="relative p-1 rounded-xl bg-slate-900 border border-red-500/40 shadow-sm shrink-0 cursor-pointer active:scale-95 transition-transform"
                title={
                  currentLang === 'om'
                    ? 'Biiroo Barnootaa Bulchiinsa Magaalaa Shashamannee (Seensa Misoomsaa: Tuqaa 5)'
                    : currentLang === 'en'
                    ? 'Shashemene City Administration Education Bureau (Developer Access: 5 Taps)'
                    : 'የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ (Developer Access: 5 Taps)'
                }
              >
                <ShashemeneEducationBureauEmblem size={40} showText={false} />
                {bureauLogoTaps > 1 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shadow-md animate-bounce">
                    {bureauLogoTaps}/5
                  </span>
                )}
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-xs sm:text-lg md:text-xl font-bold tracking-tight text-slate-900 leading-tight truncate max-w-[140px] xs:max-w-[220px] sm:max-w-none">
                    {t.app_title}
                  </h1>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                  {t.city_name} · <span className="text-emerald-700 font-semibold">{t.app_subtitle}</span>
                </p>
              </div>
            </div>
          )}

          {/* Right actions: Online indicator, Lang Switcher, Backup, Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Online / Offline status indicator */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>{isOnline ? t.online_mode : t.offline_mode}</span>
            </div>

            {/* Language Switcher - Responsive compact labels on mobile */}
            <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-lg border border-slate-200 shrink-0">
              <button
                onClick={() => onLanguageChange('am')}
                className={`px-1.5 sm:px-2.5 py-1 text-xs font-medium rounded transition-all touch-manipulation ${
                  currentLang === 'am'
                    ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="አማርኛ"
              >
                <span className="xs:hidden">አማ</span>
                <span className="hidden xs:inline">አማርኛ</span>
              </button>
              <button
                onClick={() => onLanguageChange('om')}
                className={`px-1.5 sm:px-2.5 py-1 text-xs font-medium rounded transition-all touch-manipulation ${
                  currentLang === 'om'
                    ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Afaan Oromoo"
              >
                <span className="xs:hidden">ORO</span>
                <span className="hidden xs:inline">Afaan Oromoo</span>
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-1.5 sm:px-2.5 py-1 text-xs font-medium rounded transition-all touch-manipulation ${
                  currentLang === 'en'
                    ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Offline Data Backup / Sync button */}
            <button
              onClick={() => setShowBackupModal(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
              title="Backup and Sync"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.backup_data}</span>
            </button>

            {/* Quick Demo Selector */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">{t.quick_demo}</span>
              </button>

              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-semibold text-slate-800">
                      {currentLang === 'om'
                        ? 'Gahee Hojii Qormaataa Filadhaa (Quick Test Roles)'
                        : currentLang === 'en'
                        ? 'Select Quick Test Roles'
                        : 'የሙከራ መለያዎችን ይምረጡ (Quick Test Roles)'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {currentLang === 'om'
                        ? 'Cuqaasa tokkoon gaheewwan garaagaraatiin seenaa'
                        : currentLang === 'en'
                        ? 'Log in with different roles in 1 click'
                        : 'በአንድ ጠቅታ በተለያዩ ሚናዎች መግባት ይችላሉ'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onQuickRoleSelect({
                        role: 'bureau_admin',
                        name:
                          currentLang === 'om'
                            ? 'Bulchaa Biiroo Barnootaa Shaashamannee (Admin)'
                            : currentLang === 'en'
                            ? 'Shashemene Education Bureau Admin'
                            : 'የሻሸመኔ ትምህርት ቢሮ አስተዳዳሪ (Admin)',
                        identifier: 'admin',
                        accessCode: '123456'
                      });
                      setShowRoleSwitcher(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 rounded-lg flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-emerald-950">
                        {currentLang === 'om'
                          ? '1. Bulchaa Biiroo (Bureau Admin)'
                          : currentLang === 'en'
                          ? '1. Bureau Admin'
                          : '1. የቢሮ አስተዳዳሪ (Bureau Admin)'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {currentLang === 'om' ? 'Koodii: 123456' : currentLang === 'en' ? 'Code: 123456' : 'ይለፍ ቃል: 123456'}
                      </p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                      Master
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      onQuickRoleSelect({
                        role: 'bureau_staff',
                        name:
                          currentLang === 'om'
                            ? 'Aaddee Caaltuu Darrajjee (Daarektara Inispeekshinii)'
                            : currentLang === 'en'
                            ? 'W/ro Chaltu Dereje (Inspection Director)'
                            : 'ወ/ሮ ጫልቱ ደረጀ (ኢንስፔክሽን ዳይሬክተር)',
                        staffDepartment:
                          currentLang === 'om'
                            ? 'Inispeekshinii fi Madaallii Sadarkaa'
                            : currentLang === 'en'
                            ? 'Inspection & Standards'
                            : 'ኢንስፔክሽንና ደረጃ ምዘና',
                        identifier: 'chaltu',
                        accessCode: 'BUR-INSP-02'
                      });
                      setShowRoleSwitcher(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 rounded-lg flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">
                        {currentLang === 'om'
                          ? '2. Hojjetaa Biiroo (Quality Inspector)'
                          : currentLang === 'en'
                          ? '2. Bureau Staff (Inspector)'
                          : '2. የቢሮ ሰራተኛ (Quality Inspector)'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {currentLang === 'om' ? 'Koodii: BUR-INSP-02' : currentLang === 'en' ? 'Code: BUR-INSP-02' : 'ኮድ: BUR-INSP-02'}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onQuickRoleSelect({
                        role: 'school_admin',
                        name:
                          currentLang === 'om'
                            ? 'Obbo Gutamaa Waaqoo (Daarektara / Abbaa Qabeenyaa)'
                            : currentLang === 'en'
                            ? 'Ato Gutema Wako (Director/Owner)'
                            : 'አቶ ጉተማ ዋቆ (ዳይሬክተር/ባለቤት)',
                        schoolId: 'sch-1',
                        schoolName:
                          currentLang === 'om'
                            ? 'M/B Sad. 2ffaa Waliigalaa Shaashamannee'
                            : currentLang === 'en'
                            ? 'Shashemene General Secondary School'
                            : 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
                        identifier: 'principal',
                        accessCode: 'SHAS-SEC-01'
                      });
                      setShowRoleSwitcher(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-teal-50 rounded-lg flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-teal-950">
                        {currentLang === 'om'
                          ? '3. Abbaa Qabeenyaa/Daarektara (School Admin)'
                          : currentLang === 'en'
                          ? '3. School Owner/Principal'
                          : '3. የት/ቤት ባለቤት/ዳይሬክተር (School Admin)'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {currentLang === 'om'
                          ? 'M/B Sad. 2ffaa (SHAS-SEC-01)'
                          : currentLang === 'en'
                          ? 'Shashemene Sec (SHAS-SEC-01)'
                          : 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ (SHAS-SEC-01)'}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onQuickRoleSelect({
                        role: 'teacher',
                        name:
                          currentLang === 'om'
                            ? 'B/saa Bafqaaduu Xilahun (Herrega)'
                            : currentLang === 'en'
                            ? 'Tr. Befekadu Tilahun (Math)'
                            : 'መ/ር በፈቃዱ ጥላሁን (ሂሳብ)',
                        schoolId: 'sch-1',
                        schoolName:
                          currentLang === 'om'
                            ? 'M/B Sad. 2ffaa Waliigalaa Shaashamannee'
                            : currentLang === 'en'
                            ? 'Shashemene General Secondary School'
                            : 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
                        identifier: 'teacher',
                        accessCode: 'TCH-BEFE-01'
                      });
                      setShowRoleSwitcher(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-sky-50 rounded-lg flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-sky-950">
                        {currentLang === 'om'
                          ? '4. Barsiisaa (Teacher - Math)'
                          : currentLang === 'en'
                          ? '4. Teacher (Math)'
                          : '4. መምህር (Teacher - Math)'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {currentLang === 'om' ? 'Koodii: TCH-BEFE-01' : currentLang === 'en' ? 'Code: TCH-BEFE-01' : 'ኮድ: TCH-BEFE-01'}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onQuickRoleSelect({
                        role: 'student',
                        name:
                          currentLang === 'om'
                            ? 'Kiyaar Kadir Alii (Barataa - 10A)'
                            : currentLang === 'en'
                            ? 'Kiyar Kedir Ali (Student - 10A)'
                            : 'ኪያር ከድር አሊ (ተማሪ - 10A)',
                        schoolId: 'sch-1',
                        schoolName:
                          currentLang === 'om'
                            ? 'M/B Sad. 2ffaa Waliigalaa Shaashamannee'
                            : currentLang === 'en'
                            ? 'Shashemene General Secondary School'
                            : 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
                        identifier: 'student',
                        accessCode: 'STU-KIYAR-01'
                      });
                      setShowRoleSwitcher(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-violet-50 rounded-lg flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-violet-950">
                        {currentLang === 'om'
                          ? '5. Barataa / Maatii (Student / Parent)'
                          : currentLang === 'en'
                          ? '5. Student / Parent'
                          : '5. ተማሪ / ወላጅ (Student / Parent)'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {currentLang === 'om'
                          ? 'Koodii: STU-KIYAR-01 / PAR-KIYAR-01'
                          : currentLang === 'en'
                          ? 'Code: STU-KIYAR-01 / PAR-KIYAR-01'
                          : 'ኮድ: STU-KIYAR-01 / PAR-KIYAR-01'}
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Back to Bureau button when in School View */}
            {isSchoolView && onNavigateToBureau && (
              <button
                type="button"
                onClick={onNavigateToBureau}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer shrink-0"
                title={
                  currentLang === 'om'
                    ? 'Gara Biiroo Barnootaatti Deebi\'aa'
                    : currentLang === 'en'
                    ? 'Back to Education Bureau'
                    : 'ወደ ትምህርት ቢሮ ገጽ ተመለስ'
                }
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">
                  {currentLang === 'om' ? 'Gara Biirootti' : currentLang === 'en' ? 'To Bureau' : 'ወደ ቢሮ'}
                </span>
              </button>
            )}

            {/* Access Code Gateway Shortcut */}
            {onOpenCodeGate && (
              <button
                type="button"
                onClick={onOpenCodeGate}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors cursor-pointer"
                title={
                  currentLang === 'om'
                    ? 'Koodii Seensaa Seera-qabeessa (123456 / 2222 / 3333)'
                    : currentLang === 'en'
                    ? 'Official Access Code Gate (123456 / 2222 / 3333)'
                    : 'ይፋዊ ኮድ ማስገቢያ (123456 / 2222 / 3333)'
                }
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden md:inline">
                  {currentLang === 'om' ? 'Koodii Seensaa' : currentLang === 'en' ? 'Access Code' : 'ኮድ ማስገቢያ'}
                </span>
              </button>
            )}

            {/* Developer / Builder Profile Button ("ሲስተሙን ማን ገነባው?") */}
            {onOpenDeveloperProfile && (
              <button
                type="button"
                onClick={onOpenDeveloperProfile}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 border border-amber-400/80 rounded-xl transition-all cursor-pointer shadow-2xs shrink-0"
                title={
                  currentLang === 'om'
                    ? 'Sirnicha Eenyutu Ijaare? (Taameenaa fi Hojiisaa PLC · Weshya Software Solutions)'
                    : currentLang === 'en'
                    ? 'Who Built the System? (Tamena & Co PLC · Weshya Software Solution)'
                    : 'ሲስተሙን ማን ገነባው? (ታሜና ሥራው ኃ/የተ/የግ/ማ · ውሽዬ ሶፍትዌር ሶሉሽን)'
                }
              >
                <Code2 className="w-3.5 h-3.5 text-amber-900" />
                <span className="hidden sm:inline">
                  {currentLang === 'om'
                    ? 'Sirnicha Eenyutu Ijaare?'
                    : currentLang === 'en'
                    ? 'Who Built the System?'
                    : 'ሲስተሙን ማን ገነባው?'}
                </span>
                <span className="sm:hidden text-[10px]">
                  {currentLang === 'om' ? 'Misoosituu' : currentLang === 'en' ? 'Dev' : 'አበልፃጊ'}
                </span>
              </button>
            )}

            {/* Replay 10-sec Splash Screen Button */}
            {onReplaySplash && (
              <button
                type="button"
                onClick={onReplaySplash}
                className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-emerald-200"
                title={
                  currentLang === 'om'
                    ? 'Seensa asxaa sekondii 10 irra deebi\'ii agarsiisi'
                    : currentLang === 'en'
                    ? 'Replay 10-second splash emblem'
                    : 'የ10 ሰከንድ መክፈቻ አርማ እና ላይት አሳይ'
                }
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
              </button>
            )}

            {/* PWA Install Button for Mobile & PC */}
            <PWAInstallButton currentLang={currentLang} variant="header" />

            {/* Offline Data Synchronization Status & Hub Pill */}
            <OfflineSyncPill currentLang={currentLang} />

            {/* Current user session or Login buttons */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-medium">
                    {currentUser.role === 'bureau_admin'
                      ? currentLang === 'om'
                        ? 'Bulchaa Biiroo Barnootaa'
                        : currentLang === 'en'
                        ? 'Bureau Admin'
                        : 'የትምህርት ቢሮ አስተዳዳሪ'
                      : currentUser.role === 'bureau_staff'
                      ? currentLang === 'om'
                        ? 'Ogeessa Biiroo'
                        : currentLang === 'en'
                        ? 'Bureau Staff'
                        : 'የቢሮ ባለሙያ'
                      : currentUser.role === 'school_admin'
                      ? currentLang === 'om'
                        ? 'Hogganaa M/B'
                        : currentLang === 'en'
                        ? 'School Admin'
                        : 'የት/ቤት ኃላፊ'
                      : currentUser.role === 'teacher'
                      ? currentLang === 'om'
                        ? 'Barsiisaa'
                        : currentLang === 'en'
                        ? 'Teacher'
                        : 'መምህር'
                      : currentLang === 'om'
                      ? 'Barataa / Maatii'
                      : currentLang === 'en'
                      ? 'Student / Parent'
                      : 'ተማሪ / ወላጅ'}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenRegisterSchool}
                  className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-100 rounded-lg border border-emerald-300 transition-colors"
                >
                  {t.register_school_btn}
                </button>
                <button
                  onClick={onOpenLogin}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors"
                >
                  {t.btn_login}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Offline Backup & Restore Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {currentLang === 'om'
                ? 'To\'annoo fi Baafata Ragaa Sarara-malee (Offline Backup)'
                : currentLang === 'en'
                ? 'Offline Data & Backup Management'
                : 'ኦፍላይን የመረጃ አያያዝ እና ቅጂ (Offline Data & Backup)'}
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              {currentLang === 'om'
                ? 'Applikeeshiniin kun intarneetii malee (offline) guutummaatti ni hojjeta; ragaan keessan kompitara ykn bilbila keessan irratti nageenyaan kuufama. Ragaalee gara kompitara biraatti dabarsuuf ykn akka hin banneef faayilaan olkaawachuuf filannoowwan armaan gadii fayyadamaa.'
                : currentLang === 'en'
                ? 'This application works completely offline; your data is securely stored locally. Use the options below to export or import your database.'
                : 'ይህ መተግበሪያ ያለ ኢንተርኔት (ኦፍላይን) ሙሉ ለሙሉ ይሰራል፤ መረጃዎችዎ በኮምፒውተርዎ ወይም በስልክዎ ላይ በደህንነት ይቀመጣሉ። መረጃዎችን ወደ ሌላ ኮምፒውተር ለመውሰድ ወይም እንዳይጠፉ በፋይል ለማስቀመጥ ከታች ያሉትን አማራጮች ይጠቀሙ።'}
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    {currentLang === 'om'
                      ? 'Koppii Ragaa Baasi (Export JSON)'
                      : currentLang === 'en'
                      ? 'Export Backup (JSON)'
                      : 'የመረጃ ቅጂ ማውረድ (Export JSON)'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {currentLang === 'om'
                      ? 'Manneen barnootaa, barsiisota, qormaata fi bu\'aawwan hunda qabata'
                      : currentLang === 'en'
                      ? 'Includes all schools, teachers, exams, and results'
                      : 'ሁሉንም ት/ቤቶች፣ መምህራን፣ ፈተናዎች እና ውጤቶች ያጠቃልላል'}
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {currentLang === 'om' ? 'Baasi (Download)' : currentLang === 'en' ? 'Download' : 'አውርድ'}
                  </span>
                </button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    {currentLang === 'om'
                      ? 'Koppii Ragaa Galchi (Import JSON)'
                      : currentLang === 'en'
                      ? 'Import Backup (JSON)'
                      : 'የመረጃ ቅጂ ማስገባት (Import JSON)'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {currentLang === 'om'
                      ? 'Faayila JSON kanaan dura baafattan deebisaatii galchaa'
                      : currentLang === 'en'
                      ? 'Restore previously downloaded JSON backup file'
                      : 'ቀደም ሲል ያወረዱትን የJSON ፋይል መልሰው ያስገቡ'}
                  </p>
                </div>
                <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {currentLang === 'om' ? 'Faayila Filadhu' : currentLang === 'en' ? 'Select File' : 'ፋይል ምረጥ'}
                  </span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>

              {importStatus === 'success' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-medium">
                  {currentLang === 'om'
                    ? '✓ Ragaan milkaa\'inaan deebi\'eera! Fuulli haaromaa jira...'
                    : currentLang === 'en'
                    ? '✓ Data successfully imported! Reloading...'
                    : '✓ መረጃው በተሳካ ሁኔታ ተመልሷል! ገጹ እየታደሰ ነው...'}
                </div>
              )}
              {importStatus === 'error' && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg font-medium">
                  {currentLang === 'om'
                    ? '✗ Bifa faayilaa sirrii miti. Maaloo faayila JSON sirrii filadhaa.'
                    : currentLang === 'en'
                    ? '✗ Invalid file format. Please select a valid JSON backup file.'
                    : '✗ የተሳሳተ የፋይል ቅርጸት ነው። እባክዎ ትክክለኛውን JSON ይምረጡ።'}
                </div>
              )}

              <div className="pt-2 flex flex-wrap justify-between items-center gap-2">
                {confirmResetDefaults ? (
                  <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1.5 text-xs">
                    <span className="text-rose-800 font-semibold">
                      {currentLang === 'om'
                        ? 'Ragaa gara duraatti deebisuu?'
                        : currentLang === 'en'
                        ? 'Reset all data?'
                        : 'ወደ ነባሪ ይመለስ?'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        StorageService.resetToDefaults();
                        window.location.reload();
                      }}
                      className="px-2 py-0.5 bg-rose-600 text-white rounded font-bold cursor-pointer"
                    >
                      {currentLang === 'om' ? 'Eeyyee' : currentLang === 'en' ? 'Yes' : 'አዎ'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmResetDefaults(false)}
                      className="px-2 py-0.5 bg-white text-slate-700 border border-slate-300 rounded font-medium cursor-pointer"
                    >
                      {currentLang === 'om' ? 'Lakki' : currentLang === 'en' ? 'No' : 'አይ'}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmResetDefaults(true)}
                    className="text-xs text-rose-600 hover:underline cursor-pointer"
                  >
                    {currentLang === 'om'
                      ? 'Ragaa gara duriitti deebisi (Reset Defaults)'
                      : currentLang === 'en'
                      ? 'Reset to Defaults'
                      : 'መረጃውን ወደ ነባሪ መልስ (Reset Defaults)'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setConfirmResetDefaults(false);
                    setShowBackupModal(false);
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  {currentLang === 'om' ? 'Cufi' : currentLang === 'en' ? 'Close' : 'ዝጋ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
