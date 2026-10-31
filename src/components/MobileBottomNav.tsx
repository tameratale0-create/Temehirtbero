import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  Users,
  CreditCard,
  KeyRound,
  Menu,
  X,
  Sparkles,
  Download,
  ShieldCheck,
  Award,
  BookOpen,
  DollarSign,
  ClipboardList,
  Moon,
  ChevronUp
} from 'lucide-react';
import { Language, AppUserSession } from '../types';
import { ShashemeneEducationBureauEmblem } from './ShashemeneEducationBureauEmblem';

interface MobileBottomNavProps {
  currentLang: Language;
  activeTab: string;
  onNavigate: (tab: string, subTab?: any) => void;
  currentUser: AppUserSession | null;
  onOpenRoleModal: () => void;
  onOpenDeveloperPortal: () => void;
  onOpenDeveloperPayment?: () => void;
  isSchoolView?: boolean;
  schoolName?: string;
  onOpenCodeGate?: () => void;
  onOpenBackupModal?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentLang,
  activeTab,
  onNavigate,
  currentUser,
  onOpenRoleModal,
  onOpenDeveloperPortal,
  onOpenDeveloperPayment,
  isSchoolView = false,
  schoolName,
  onOpenCodeGate,
  onOpenBackupModal
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);

  const isBureauAdmin = currentUser?.role === 'bureau_admin' || currentUser?.role === 'bureau_staff';
  const isStudentOrParent = currentUser?.role === 'student' || currentUser?.role === 'parent';

  return (
    <>
      {/* Mobile Bottom Navigation Bar (Hidden on Desktop 'sm:hidden') */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 sm:hidden shadow-2xl safe-area-bottom">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {/* Item 1: Home / Bureau Dashboard */}
          <button
            type="button"
            onClick={() => {
              setShowMoreMenu(false);
              if (isStudentOrParent) {
                onNavigate('student_portal');
              } else if (isBureauAdmin) {
                onNavigate('dashboard');
              } else {
                onNavigate('school_portal');
              }
            }}
            className={`flex flex-col items-center justify-center h-full py-1 gap-1 text-[10px] font-bold transition-colors ${
              (activeTab === 'dashboard' || activeTab === 'student_portal')
                ? 'text-emerald-800 font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${
              (activeTab === 'dashboard' || activeTab === 'student_portal')
                ? 'bg-emerald-100 text-emerald-800'
                : ''
            }`}>
              {isStudentOrParent ? (
                <GraduationCap className="w-5 h-5" />
              ) : (
                <LayoutDashboard className="w-5 h-5" />
              )}
            </div>
            <span className="truncate max-w-[58px]">
              {isStudentOrParent ? 'ፖርታል' : isBureauAdmin ? 'ዳሽቦርድ' : 'ዋና ገፅ'}
            </span>
          </button>

          {/* Item 2: School Portal or Schools Registry */}
          <button
            type="button"
            onClick={() => {
              setShowMoreMenu(false);
              if (isBureauAdmin) {
                onNavigate('schools');
              } else {
                onNavigate('school_portal');
              }
            }}
            className={`flex flex-col items-center justify-center h-full py-1 gap-1 text-[10px] font-bold transition-colors ${
              (activeTab === 'school_portal' || activeTab === 'schools')
                ? 'text-emerald-800 font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${
              (activeTab === 'school_portal' || activeTab === 'schools')
                ? 'bg-emerald-100 text-emerald-800'
                : ''
            }`}>
              <Building2 className="w-5 h-5" />
            </div>
            <span className="truncate max-w-[58px]">
              {isBureauAdmin ? 'ት/ቤቶች' : 'ትምህርት ቤት'}
            </span>
          </button>

          {/* Item 3: Quick Role Switcher (Center Highlight) */}
          <button
            type="button"
            onClick={() => {
              setShowMoreMenu(false);
              onOpenRoleModal();
            }}
            className="flex flex-col items-center justify-center h-full py-1 gap-1 text-[10px] font-bold text-amber-900 group"
          >
            <div className="w-10 h-10 -mt-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg border-2 border-white group-active:scale-95 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="truncate max-w-[58px] font-black text-amber-900">
              ሚና ቀይር
            </span>
          </button>

          {/* Item 4: Developer License / Payment */}
          <button
            type="button"
            onClick={() => {
              setShowMoreMenu(false);
              if (onOpenDeveloperPayment) {
                onOpenDeveloperPayment();
              } else {
                onOpenDeveloperPortal();
              }
            }}
            className="flex flex-col items-center justify-center h-full py-1 gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-800"
          >
            <div className="p-1 rounded-xl">
              <CreditCard className="w-5 h-5 text-indigo-700" />
            </div>
            <span className="truncate max-w-[58px]">
              ፈቃድ & ክፍያ
            </span>
          </button>

          {/* Item 5: More Actions Menu */}
          <button
            type="button"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex flex-col items-center justify-center h-full py-1 gap-1 text-[10px] font-bold transition-colors ${
              showMoreMenu ? 'text-emerald-800 font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${showMoreMenu ? 'bg-emerald-100 text-emerald-800' : ''}`}>
              {showMoreMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </div>
            <span className="truncate max-w-[58px]">
              ተጨማሪ
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile 'More' Drawer Sheet */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end sm:hidden animate-in fade-in duration-200">
          <div
            className="bg-white rounded-t-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto border-t border-slate-200 shadow-2xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-xl bg-slate-900 border border-red-500/30">
                  <ShashemeneEducationBureauEmblem size={28} showText={false} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    ፈጣን የሞባይል አገልግሎቶች (Mobile Hub)
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMoreMenu(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  onOpenRoleModal();
                }}
                className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left flex flex-col gap-1 transition"
              >
                <Users className="w-5 h-5 text-amber-700" />
                <span className="font-bold text-amber-950">ሚና መቀየሪያ</span>
                <span className="text-[10px] text-amber-800">ዳይሬክተር፣ መምህር፣ ተማሪ</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  onOpenDeveloperPortal();
                }}
                className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-left flex flex-col gap-1 transition"
              >
                <KeyRound className="w-5 h-5 text-indigo-700" />
                <span className="font-bold text-indigo-950">የአበልፃጊ ሚስጥር በር</span>
                <span className="text-[10px] text-indigo-800">ኮድ: tameratale6576</span>
              </button>

              {onOpenDeveloperPayment && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onOpenDeveloperPayment();
                  }}
                  className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left flex flex-col gap-1 transition"
                >
                  <CreditCard className="w-5 h-5 text-emerald-700" />
                  <span className="font-bold text-emerald-950">የክፍያ ደረሰኝ መላኪያ</span>
                  <span className="text-[10px] text-emerald-800">ባንክ & ቴሌብር</span>
                </button>
              )}

              {onOpenBackupModal && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onOpenBackupModal();
                  }}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex flex-col gap-1 transition"
                >
                  <Download className="w-5 h-5 text-slate-700" />
                  <span className="font-bold text-slate-900">ዳታ ምትኬ (Backup)</span>
                  <span className="text-[10px] text-slate-500">ኦፍላይን ዳታ ቅዳ</span>
                </button>
              )}

              {onOpenCodeGate && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onOpenCodeGate();
                  }}
                  className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left flex flex-col gap-1 transition"
                >
                  <ShieldCheck className="w-5 h-5 text-purple-700" />
                  <span className="font-bold text-purple-950">ኮድ ማስገቢያ በር</span>
                  <span className="text-[10px] text-purple-800">የግል ኮድ መግቢያ</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  onNavigate('exams');
                }}
                className="p-3 rounded-2xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-left flex flex-col gap-1 transition"
              >
                <Award className="w-5 h-5 text-teal-700" />
                <span className="font-bold text-teal-950">የመምህራን ፈተና</span>
                <span className="text-[10px] text-teal-800">ኦንላይን ፈተና</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowMoreMenu(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 text-center transition"
            >
              ዝጋ (Close Menu)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
