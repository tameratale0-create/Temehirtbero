import React, { useState, useMemo } from 'react';
import {
  Building2,
  Users,
  GraduationCap,
  Award,
  FileCheck,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  DollarSign,
  ClipboardList,
  Crown,
  FileText,
  PlusCircle,
  KeyRound,
  Maximize2,
  Search,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
  Megaphone,
  HelpCircle,
  Layers,
  SlidersHorizontal,
  ArrowRight,
  Compass,
  Grid
} from 'lucide-react';
import { Language, School, BureauStaff, TeacherCredential, SchoolReportSubmission, TeacherExam, AppUserSession } from '../types';
import { translations } from '../data/translations';
import { SchoolSubTab } from './SchoolPortal';

interface BureauDashboardProps {
  currentLang: Language;
  schools: School[];
  staff: BureauStaff[];
  credentials: TeacherCredential[];
  reports: SchoolReportSubmission[];
  exams: TeacherExam[];
  onNavigateTab: (tabId: string) => void;
  onNavigateSchoolSubTab?: (subTab: SchoolSubTab) => void;
  currentUser?: AppUserSession | null;
  activeSchool?: School;
  onOpenQuickRoleModal?: () => void;
  onOpenRegisterSchool?: () => void;
  onToggleFullscreen?: () => void;
}

export const BureauDashboard: React.FC<BureauDashboardProps> = ({
  currentLang,
  schools,
  staff,
  credentials,
  reports,
  exams,
  onNavigateTab,
  onToggleFullscreen
}) => {
  const t = translations[currentLang];

  const totalStudents = schools.reduce((acc, s) => acc + s.totalStudents, 0);
  const maleStudents = schools.reduce((acc, s) => acc + s.maleStudents, 0);
  const femaleStudents = schools.reduce((acc, s) => acc + s.femaleStudents, 0);

  const totalTeachers = schools.reduce((acc, s) => acc + s.totalTeachers, 0);
  const verifiedTeachersCount = credentials.filter((c) => c.verificationStatus === 'verified').length;
  const pendingTeachersCount = credentials.filter((c) => c.verificationStatus === 'pending').length;
  const flaggedTeachersCount = credentials.filter((c) => c.verificationStatus === 'flagged').length;

  const level3And4Schools = schools.filter(
    (s) => s.inspectionLevel === 'level_3' || s.inspectionLevel === 'level_4'
  ).length;

  const pendingReportsCount = reports.filter((r) => r.status === 'submitted').length;

  return (
    <div className="space-y-6">
      {/* =========================================================================
          🌟 DASHBOARD TOP ACTION BAR: All Dashboard-specific buttons neatly placed at the top!
          "ሁሉም በየራሱ ገፅ ላይ ያሉ በተን ሳይዘበራረቅ ከላይ እንዲቀመጥ"
         ========================================================================= */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-3 sm:p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {currentLang === 'om'
                  ? 'Qabduuwwan To\'annoo Saffisaa Daashboordii (Top Actions)'
                  : currentLang === 'en'
                  ? 'Dashboard Top Quick-Action Controls'
                  : 'የዳሽቦርድ ፈጣን መቆጣጠሪያ በተኖች (Dashboard Top Actions)'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {currentLang === 'om'
                  ? 'Kutaalee hojii ijoo Biiroo Barnootaa Magaalaa fi qabduuwwan gabaasa hordofuu'
                  : currentLang === 'en'
                  ? 'Education bureau departments, key metrics, and reporting shortcuts'
                  : 'የከተማው ትምህርት ቢሮ ቁልፍ የስራ ክፍሎችና ሪፖርቶች መከታተያ በተኖች'}
              </p>
            </div>
          </div>

          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              title={
                currentLang === 'om'
                  ? 'Daashboordii Iskiriinii Guutuu Taasisi'
                  : currentLang === 'en'
                  ? 'Fullscreen Dashboard'
                  : 'ዳሽቦርዱን ሙሉ እስክሪን አድርግ'
              }
            >
              <Maximize2 className="w-3.5 h-3.5 text-emerald-800" />
              <span>
                {currentLang === 'om' ? 'Iskiriinii Guutuu' : currentLang === 'en' ? 'Fullscreen' : 'ሙሉ እስክሪን'}
              </span>
            </button>
          )}
        </div>

        {/* Dashboard Actions Buttons Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 pt-3">
          <button
            type="button"
            onClick={() => onNavigateTab('schools')}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/60 text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs"
          >
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 w-fit mb-1.5 group-hover:scale-105 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                {currentLang === 'om' ? 'M/Barnootaa' : currentLang === 'en' ? 'Schools' : 'ት/ቤቶች'} ({schools.length})
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {currentLang === 'om' ? 'Kaataloogii Seera-qabeessa' : currentLang === 'en' ? 'Official Catalog' : 'ይፋዊ ካታሎግ'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('reports')}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/60 text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs"
          >
            <div className="p-1.5 rounded-lg bg-teal-100 text-teal-800 w-fit mb-1.5 group-hover:scale-105 transition-transform">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                {currentLang === 'om' ? 'Gabaasota' : currentLang === 'en' ? 'Reports' : 'ሪፖርቶች'} ({reports.length})
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {currentLang === 'om' ? 'Qabxii Semisteeraa' : currentLang === 'en' ? 'Semester Marks' : 'ሴሚስተር ውጤት'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('exams')}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/60 text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs"
          >
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 w-fit mb-1.5 group-hover:scale-105 transition-transform">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                {currentLang === 'om' ? 'Qormaata' : currentLang === 'en' ? 'Exams' : 'ፈተናዎች'} ({exams.length})
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {currentLang === 'om' ? 'Gahumsa Toora Irraa' : currentLang === 'en' ? 'Online Competency' : 'ኦንላይን ብቃት'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('credentials')}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-500 bg-slate-50 hover:bg-sky-50/60 text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs"
          >
            <div className="p-1.5 rounded-lg bg-sky-100 text-sky-800 w-fit mb-1.5 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-sky-800 transition-colors">
                {currentLang === 'om' ? 'Ragaa & Madaallii' : currentLang === 'en' ? 'Credentials & Audit' : 'ማስረጃ & ግምገማ'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {currentLang === 'om' ? 'Ooditii & Qabxii 60' : currentLang === 'en' ? 'Audit & 60 Marks' : 'ኦዲት & 60 ማርክ'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('training')}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-violet-500 bg-slate-50 hover:bg-violet-50/60 text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs"
          >
            <div className="p-1.5 rounded-lg bg-violet-100 text-violet-800 w-fit mb-1.5 group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-violet-800 transition-colors">
                {currentLang === 'om' ? 'Leenjii' : currentLang === 'en' ? 'Training' : 'ስልጠና'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {currentLang === 'om' ? 'Moojuloota & Sanada' : currentLang === 'en' ? 'Modules & Docs' : 'ሞጁሎች & ሰነድ'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('staff')}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-500 bg-slate-50 hover:bg-slate-100 text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs"
          >
            <div className="p-1.5 rounded-lg bg-slate-200 text-slate-800 w-fit mb-1.5 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                {currentLang === 'om' ? 'Hojjettoota' : currentLang === 'en' ? 'Staff' : 'ሰራተኞች'} ({staff.length})
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {currentLang === 'om' ? 'Koodii fi Gahee' : currentLang === 'en' ? 'Codes & Roles' : 'ኮዶችና ድርሻ'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('standards')}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/60 text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs"
          >
            <div className="p-1.5 rounded-lg bg-emerald-200 text-emerald-900 w-fit mb-1.5 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                {currentLang === 'om' ? 'Ulaagaalee' : currentLang === 'en' ? 'Standards' : 'ስታንዳርድ'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {currentLang === 'om' ? 'Ulaagaa Sad. 1-4' : currentLang === 'en' ? 'Level 1-4 Criteria' : 'ደረጃ 1-4 መስፈርት'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Building2 className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/50 border border-emerald-500/30 text-emerald-200 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {currentLang === 'om'
                ? 'Sirna Seera-qabeessa Bulchiinsa Magaalaa Shaashamannee (Official Portal)'
                : currentLang === 'en'
                ? 'Shashemene City Administration Official Portal'
                : 'የሻሸመኔ ከተማ አስተዳደር ይፋዊ ስርዓት (Official Portal)'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            {t.bureau_full_name}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {currentLang === 'om'
              ? 'Wiirtuu manneen barnootaa mootummaa fi dhuunfaa Magaalaa Shaashamannee, ragaa barnootaa barsiisotaa, qormaata intarneetii, gabaasa bu\'aa barattootaa fi ulaagaalee qulqullina barnootaa ittiin bulfamuu dha.'
              : currentLang === 'en'
              ? 'Central management platform for public and private schools in Shashemene City, teacher credential verification, online competency exams, student score reports, and education quality standards.'
              : 'በሻሸመኔ ከተማ የሚገኙ የመንግስት እና የግል ትምህርት ቤቶችን፣ የመምህራን የትምህርት ማስረጃዎች፣ ኦንላይን ፈተናዎችን፣ የተማሪዎች ውጤት ሪፖርቶችን እና የትምህርት ጥራት መስፈርቶችን ማስተዳደሪያ ማዕከል።'}
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateTab('schools')}
              className="px-4 py-2 bg-white text-emerald-950 font-bold text-xs rounded-xl hover:bg-emerald-50 transition-colors shadow-xs cursor-pointer"
            >
              {currentLang === 'om' ? `${t.tab_schools} Ilaali` : currentLang === 'en' ? `View ${t.tab_schools}` : `${t.tab_schools} ተመልከት`}
            </button>
            <button
              onClick={() => onNavigateTab('exams')}
              className="px-4 py-2 bg-emerald-700/60 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl border border-emerald-500/40 transition-colors cursor-pointer"
            >
              {t.tab_exams}
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="px-4 py-2 bg-teal-800/80 hover:bg-teal-700 text-emerald-100 font-semibold text-xs rounded-xl border border-teal-600/40 transition-colors cursor-pointer"
            >
              {t.tab_reports}
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Schools */}
        <div
          onClick={() => onNavigateTab('schools')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.stat_total_schools}</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {schools.length}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">
              {currentLang === 'om' ? 'Dhaabbilee' : currentLang === 'en' ? 'Institutions' : 'ተቋማት'}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5 border-t border-slate-100 pt-2.5">
            <span className="text-emerald-700 font-bold">{level3And4Schools}</span>
            <span>
              {currentLang === 'om' ? 'Sadarkaa 3 fi 4 kan gahan' : currentLang === 'en' ? 'Level 3 & 4 Accredited' : 'ደረጃ 3 እና 4 የደረሱ'}
            </span>
          </div>
        </div>

        {/* KPI 2: Students */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.stat_total_students}</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalStudents.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">
              {currentLang === 'om' ? 'Barattoota' : currentLang === 'en' ? 'Students' : 'ተማሪዎች'}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-2 border-t border-slate-100 pt-2.5">
            <span>
              {currentLang === 'om' ? 'Dhiira:' : currentLang === 'en' ? 'Male:' : 'ወንድ:'}{' '}
              <strong>{maleStudents.toLocaleString()}</strong>
            </span>
            <span>·</span>
            <span>
              {currentLang === 'om' ? 'Dubara:' : currentLang === 'en' ? 'Female:' : 'ሴት:'}{' '}
              <strong>{femaleStudents.toLocaleString()}</strong>
            </span>
          </div>
        </div>

        {/* KPI 3: Teachers */}
        <div
          onClick={() => onNavigateTab('credentials')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.stat_total_teachers}</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalTeachers}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">
              {currentLang === 'om' ? 'Barsiisota' : currentLang === 'en' ? 'Teachers' : 'መምህራን'}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5 border-t border-slate-100 pt-2.5">
            <span className="text-emerald-700 font-bold">{verifiedTeachersCount}</span>
            <span>
              {currentLang === 'om'
                ? `Ragaan kan mirkanaa'e (${Math.round((verifiedTeachersCount / Math.max(credentials.length, 1)) * 100)}%)`
                : currentLang === 'en'
                ? `Credentials verified (${Math.round((verifiedTeachersCount / Math.max(credentials.length, 1)) * 100)}%)`
                : `ማስረጃቸው የተረጋገጠ (${Math.round((verifiedTeachersCount / Math.max(credentials.length, 1)) * 100)}%)`}
            </span>
          </div>
        </div>

        {/* KPI 4: Active Exams & Reports */}
        <div
          onClick={() => onNavigateTab('exams')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.stat_active_exams}</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {exams.length}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">
              {currentLang === 'om' ? 'Qormaata Toora Irraa' : currentLang === 'en' ? 'Online Exams' : 'ኦንላይን ፈተናዎች'}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5 border-t border-slate-100 pt-2.5">
            <span className="text-amber-700 font-bold">{pendingReportsCount}</span>
            <span>
              {currentLang === 'om'
                ? 'Gabaasota bu\'aa hin gamaaggamamne'
                : currentLang === 'en'
                ? 'Unreviewed score reports'
                : 'ያልተገመገሙ የውጤት ሪፖርቶች'}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Row: Priority Attention & Subcity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Actions & Verification Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {currentLang === 'om'
                  ? 'Hojiiwwan Dursa Biiroo Barnootaa (Priority Bureau Actions)'
                  : currentLang === 'en'
                  ? 'Priority Bureau Actions'
                  : 'የትምህርት ቢሮ ቅድሚያ የሚሰጣቸው ተግባራት (Priority Bureau Actions)'}
              </h3>
              <p className="text-xs text-slate-500">
                {currentLang === 'om'
                  ? 'Mirkaneessa ragaa barsiisotaa, gabaasa bu\'aa barattootaa fi koodiiwwan hojjettootaa'
                  : currentLang === 'en'
                  ? 'Teacher credential audits, student semester returns & staff credentials'
                  : 'የመምህራን ማስረጃ ማረጋገጫዎች፣ የተማሪዎች ውጤት መቀበያ እና የሰራተኛ ኮዶች'}
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {currentLang === 'om' ? 'Yeroo Ammaa' : currentLang === 'en' ? 'Active' : 'ወቅታዊ'}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {/* Action 1 */}
            <div className="p-3.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {currentLang === 'om'
                      ? `Ragaan diploomaa/digirii barsiisotaa ${pendingTeachersCount} mirkaneessa eeggataa jira`
                      : currentLang === 'en'
                      ? `${pendingTeachersCount} teacher degree/diploma submissions pending verification`
                      : `${pendingTeachersCount} የመምህራን ዲፕሎማ/ዲግሪ ማስረጃዎች ማረጋገጫ በመጠባበቅ ላይ ናቸው`}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {currentLang === 'om'
                      ? 'Yunivarsiitii Haramayaa fi Hawaasaa dabalatee barsiisota haaraa'
                      : currentLang === 'en'
                      ? 'Newly registered teachers including Haramaya & Hawassa graduates'
                      : 'ሀረማያ እና ሀዋሳ ዩኒቨርሲቲ ጨምሮ አዳዲስ የተመዘገቡ መምህራን'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('credentials')}
                className="px-3 py-1.5 text-xs font-bold text-sky-800 bg-white border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors cursor-pointer"
              >
                {currentLang === 'om' ? 'Mirkaneessi' : currentLang === 'en' ? 'Verify' : 'አረጋግጥ'}
              </button>
            </div>

            {/* Action 2 */}
            <div className="p-3.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {currentLang === 'om'
                      ? `Gabaasni qabxii semisteeraa manneen barnootaa ${reports.length} dhiyaateera`
                      : currentLang === 'en'
                      ? `${reports.length} school semester score reports submitted`
                      : `${reports.length} የትምህርት ቤቶች የተማሪዎች ሴሚስተር ውጤት ሪፖርቶች ደርሰዋል`}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {currentLang === 'om'
                      ? 'Reeshiyoo darbiinsaa, baay\'ina barattootaa fi qaaccessa qabxii olaanaa'
                      : currentLang === 'en'
                      ? 'Passing rates, student counts & top academic performer analytics'
                      : 'የማለፍ ምጣኔ፣ የተማሪዎች ብዛትና ከፍተኛ ውጤቶች ትንተና'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('reports')}
                className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                {currentLang === 'om' ? 'Gamaaggami' : currentLang === 'en' ? 'Review' : 'ገምግም'}
              </button>
            </div>

            {/* Action 3 */}
            <div className="p-3.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {currentLang === 'om'
                      ? 'Hojjettoota Biiroo fi Koodiiwwan Seensaa (Staff Access Codes)'
                      : currentLang === 'en'
                      ? 'Bureau Staff & Access Codes'
                      : 'የትምህርት ቢሮ ሰራተኞች እና የመግቢያ ኮዶች (Staff Access Codes)'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {currentLang === 'om'
                      ? 'Bulchaan ogeessotaaf gahee hojii ramaduun koodii seensaa kenna'
                      : currentLang === 'en'
                      ? 'Administrator assigns roles and distributes login credentials'
                      : 'አስተዳዳሪው ለባለሙያዎች የስራ ድርሻቸውን በመመደብ የመግቢያ ኮድ ይሰጣል'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('staff')}
                className="px-3 py-1.5 text-xs font-bold text-amber-800 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
              >
                {currentLang === 'om' ? 'Koodii Kenni' : currentLang === 'en' ? 'Issue Code' : 'ኮድ ስጥ'}
              </button>
            </div>

            {/* Action 4 */}
            <div className="p-3.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {currentLang === 'om'
                      ? 'Barreeffamoota leenjii akka gosa barnootaatti erguu'
                      : currentLang === 'en'
                      ? 'Targeted Teacher Training Materials Hub'
                      : 'እንደሚያስተማሩት የትምህርት አይነት የስልጠና ፁሁፎች መላኪያ'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {currentLang === 'om'
                      ? 'Herrega, Afaan Oromoo, Ingiliffa, Saayinsii fi Pedaagoojii'
                      : currentLang === 'en'
                      ? 'Mathematics, Afaan Oromoo, English, General Science & Pedagogy'
                      : 'ሂሳብ፣ አፋን ኦሮሞ፣ እንግሊዝኛ፣ ሳይንስ እና ስነ-ማስተማር (Pedagogy)'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('training')}
                className="px-3 py-1.5 text-xs font-bold text-purple-800 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
              >
                {currentLang === 'om' ? 'Leenjii Ergi' : currentLang === 'en' ? 'Send Training' : 'ስልጠና ላክ'}
              </button>
            </div>
          </div>
        </div>

        {/* Sub-city Schools Distribution in Shashemene */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              {currentLang === 'om'
                ? 'Raabsa Manneen Barnootaa Kutaa Magaalaa Shaashamannee'
                : currentLang === 'en'
                ? 'Shashemene Sub-city Schools Distribution'
                : 'የሻሸመኔ ክፍለ-ከተሞች የት/ቤት ስርጭት'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {currentLang === 'om'
                ? 'Manneen barnootaa fi baay\'ina barattootaa kutaa magaalaatiin galmaa\'an'
                : currentLang === 'en'
                ? 'Registered schools and student enrollment by sub-city'
                : 'በየክፍለ ከተማው የተመዘገቡ ትምህርት ቤቶች እና የተማሪ ቁጥር'}
            </p>

            <div className="space-y-3">
              {[
                { nameOm: 'Abosto', nameAm: 'አቦስቶ (Abosto)', count: 2, students: 3790 },
                { nameOm: 'Bulchaanaa', nameAm: 'ቡልቻና (Bulchana)', count: 1, students: 1820 },
                { nameOm: 'Kuyyeraa', nameAm: 'ቁዬራ (Kuyera)', count: 1, students: 1980 },
                { nameOm: 'Awaashoo', nameAm: 'አዋሾ (Awasho)', count: 2, students: 2060 },
                { nameOm: 'Aleeluu', nameAm: 'አለሉ (Alelu)', count: 1, students: 980 },
                { nameOm: 'Diida Boqee', nameAm: 'ዲዳ ቦቄ (Dida Boke)', count: 1, students: 820 }
              ].map((sub) => (
                <div key={sub.nameAm} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    {currentLang === 'om' || currentLang === 'en' ? sub.nameOm : sub.nameAm}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">
                      {sub.students.toLocaleString()} {currentLang === 'om' ? 'Barataa' : currentLang === 'en' ? 'Students' : 'ተማሪ'}
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                      {sub.count} {currentLang === 'om' ? 'M/B' : currentLang === 'en' ? 'Sch' : 'ት/ቤት'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">
                {currentLang === 'om' ? 'Sadarkaa Madaallii Biiroo:' : currentLang === 'en' ? 'Bureau Evaluation Standard:' : 'የትምህርት ቢሮ ምዘና ደረጃ:'}
              </span>
              <span className="text-emerald-700 font-bold">MoE Standard Level 1-4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
