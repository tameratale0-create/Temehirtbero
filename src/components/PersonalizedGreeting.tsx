import React, { useState } from 'react';
import {
  Sparkles,
  Crown,
  Award,
  GraduationCap,
  Users,
  DollarSign,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  FileText,
  Send,
  Plus,
  CreditCard,
  Building2,
  Clock,
  Zap,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  KeyRound
} from 'lucide-react';
import { AppUserSession, Language, School } from '../types';
import { SchoolSubTab } from './SchoolPortal';

export type NavTab =
  | 'dashboard'
  | 'schools'
  | 'staff'
  | 'reports'
  | 'credentials'
  | 'exams'
  | 'training'
  | 'standards'
  | 'school_portal'
  | 'student_portal';

interface PersonalizedGreetingProps {
  currentUser: AppUserSession | null;
  activeSchool?: School;
  currentLang: Language;
  onNavigateTab: (tab: NavTab) => void;
  onNavigateSchoolSubTab?: (subTab: SchoolSubTab) => void;
  onOpenQuickRoleModal?: () => void;
}

interface QuickAction {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  badge?: string;
  onClick: () => void;
}

export const PersonalizedGreeting: React.FC<PersonalizedGreetingProps> = ({
  currentUser,
  activeSchool,
  currentLang,
  onNavigateTab,
  onNavigateSchoolSubTab,
  onOpenQuickRoleModal
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!currentUser) return null;

  // Determine time of day in Ethiopian local context
  const currentHour = new Date().getHours();
  const getTimeGreeting = () => {
    if (currentLang === 'en') {
      if (currentHour < 12) return 'Good morning';
      if (currentHour < 17) return 'Good afternoon';
      return 'Good evening';
    }
    if (currentLang === 'om') {
      if (currentHour < 12) return 'Akkam bultan';
      if (currentHour < 17) return 'Akkam ooltan';
      return 'Akkam galtan';
    }
    // Amharic (default)
    if (currentHour < 12) return 'እንደምን አደሩ';
    if (currentHour < 17) return 'እንደምን ዋሉ';
    return 'እንደምን አመሹ';
  };

  const isLibrarian =
    currentUser.staffDepartment?.toLowerCase().includes('library') ||
    currentUser.staffDepartment?.toLowerCase().includes('መጻሕፍት') ||
    currentUser.name?.toLowerCase().includes('library') ||
    currentUser.name?.toLowerCase().includes('ቤተ-መጻሕፍት') ||
    currentUser.accessCode?.toUpperCase().startsWith('LIB-') ||
    currentUser.accessCode?.toUpperCase().includes('LIB');

  // Role Configuration: Titles, Badges, Contextual Advice, and Quick-Start Actions
  const getRoleConfig = () => {
    if (isLibrarian) {
      return {
        roleTitle:
          currentLang === 'om'
            ? 'Itti-Gaafatamaa Mana Kitaabaa'
            : currentLang === 'en'
            ? 'Head Librarian'
            : 'የቤተ-መጻሕፍት ኃላፊ',
        salutation:
          currentLang === 'om'
            ? 'Baga nagaan dhuftan, Itti-Gaafatamaa Mana Kitaabaa'
            : currentLang === 'en'
            ? 'Welcome, Head Librarian'
            : 'እንኳን ደህና መጡ፣ የቤተ-መጻሕፍት ኃላፊ',
        roleBadge:
          currentLang === 'om'
            ? '📚 Mana Kitaabaa (Librarian)'
            : currentLang === 'en'
            ? '📚 Librarian'
            : '📚 ቤተ-መጻሕፍት (Librarian)',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
        cardBg: 'from-slate-900 via-indigo-950 to-slate-900',
        borderGlow: 'border-indigo-500/40',
        summaryText:
          currentLang === 'om'
            ? 'Kuusaa kitaaba barnootaa, galmee liqaa barattootaa fi guyyaa deebisii kutaa hojii qophaa\'aa keessan keessatti to\'adhaa.'
            : currentLang === 'en'
            ? 'Manage textbook inventory, student borrowing records, and return deadlines with complete isolation.'
            : 'የትምህርት መጻሕፍትን ማውጫ፣ የተማሪዎችን የብድር መዝገብ እና የመመለሻ ቀናትን በተከለለ የስራ ገጽዎ ያስተዳድሩ።',
        actions: [
          {
            id: 'lib-catalog',
            label:
              currentLang === 'om'
                ? 'Kutaa Mana Kitaabaa'
                : currentLang === 'en'
                ? 'Library Desk'
                : 'የቤተ-መጻሕፍት ጽ/ቤት',
            desc:
              currentLang === 'om'
                ? 'Tarree kitaabotaa fi liqaa barattootaa'
                : currentLang === 'en'
                ? 'View books catalog & lend'
                : 'የመጻሕፍት ዝርዝርና የተማሪ ብድር',
            icon: <BookOpen className="w-4 h-4 text-indigo-300" />,
            bgGradient: 'from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900',
            borderColor: 'border-indigo-400/40',
            textColor: 'text-white',
            onClick: () => {
              onNavigateTab('school_portal');
              if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('library_desk');
            }
          },
          {
            id: 'lib-notices',
            label:
              currentLang === 'om'
                ? 'Beeksisoota M/B'
                : currentLang === 'en'
                ? 'Announcements'
                : 'የት/ቤት ማስታወቂያዎች',
            desc:
              currentLang === 'om'
                ? 'Ergaawwan seera-qabeessa hordofaa'
                : currentLang === 'en'
                ? 'Read official school updates'
                : 'አዳዲስ ይፋዊ መልዕክቶችን ይከታተሉ',
            icon: <Award className="w-4 h-4 text-amber-300" />,
            bgGradient: 'from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900',
            borderColor: 'border-amber-400/40',
            textColor: 'text-white',
            onClick: () => {
              onNavigateTab('school_portal');
              if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('notices');
            }
          },
          {
            id: 'lib-profile',
            label:
              currentLang === 'om'
                ? 'Ragaalee Dhuunfaa Koo'
                : currentLang === 'en'
                ? 'My Credentials'
                : 'የግል መገለጫዬ & ማስረጃዎች',
            desc:
              currentLang === 'om'
                ? 'Faydaa mirkanaa\'ee fi waraqaa eebbaa'
                : currentLang === 'en'
                ? 'View verified Fayda & documents'
                : 'የተረጋገጠ ፋይዳና የተመረቁበት ምስክር',
            icon: <ShieldCheck className="w-4 h-4 text-emerald-300" />,
            bgGradient: 'from-emerald-700 to-teal-900 hover:from-emerald-800 hover:to-teal-950',
            borderColor: 'border-emerald-400/40',
            textColor: 'text-white',
            onClick: () => {
              onNavigateTab('school_portal');
              if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('stakeholders');
            }
          }
        ] as QuickAction[]
      };
    }

    switch (currentUser.role) {
      case 'school_owner':
        return {
          roleTitle:
            currentLang === 'om'
              ? 'Abbaa Qabeenyaa fi Walitti-Qabaa Boordii'
              : currentLang === 'en'
              ? 'School Owner & Board Chair'
              : 'የት/ቤት ባለቤትና የቦርድ ሰብሳቢ',
          salutation:
            currentLang === 'om'
              ? 'Baga nagaan dhuftan, Kabajamoo Abbaa Qabeenyaa / Walitti-Qabaa Boordii'
              : currentLang === 'en'
              ? 'Welcome, School Owner & Board Chair'
              : 'እንኳን ደህና መጡ፣ ክቡር የቦርድ ሰብሳቢ / ባለቤት',
          roleBadge:
            currentLang === 'om'
              ? '👑 Abbaa Qabeenyaa (Board Chair)'
              : currentLang === 'en'
              ? '👑 Owner (Board Chair)'
              : '👑 ባለቤት (Board Chair)',
          badgeColor: 'bg-amber-400 text-slate-950 border-amber-300',
          cardBg: 'from-slate-900 via-amber-950 to-slate-900',
          borderGlow: 'border-amber-500/40',
          summaryText:
            currentLang === 'om'
              ? 'Hoggansa olaanaa mana barnootaa, muudamaa fi koodii daarektaraa, madaallii faayinaansii waggaa fi murteewwan boordii to\'adhaa.'
              : currentLang === 'en'
              ? 'Executive governance desk: Oversee principal appointments, strategic school performance, and official notices.'
              : 'የትምህርት ቤቱን የበላይ አመራር፣ የዋና ዳይሬክተር ሹመትና ኮድ፣ ዓመታዊ የፋይናንስ ሚዛን እና የቦርድ ውሳኔዎችን ያስተዳድሩ።',
          actions: [
            {
              id: 'owner-board',
              label:
                currentLang === 'om'
                  ? 'Hoggansa fi To\'annoo Boordii'
                  : currentLang === 'en'
                  ? 'Board Governance'
                  : 'የቦርድ አመራርና ቁጥጥር',
              desc:
                currentLang === 'om'
                  ? 'Muudama daarektaraa, koodii fi madaallii m/b'
                  : currentLang === 'en'
                  ? 'Director appointments & metrics'
                  : 'ዳይሬክተር ሹመት፣ ኮድና የት/ቤት ሚዛን',
              icon: <Crown className="w-4 h-4 text-amber-300" />,
              bgGradient: 'from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900',
              borderColor: 'border-amber-400/40',
              textColor: 'text-white',
              badge: currentLang === 'om' ? 'Hojii Guddaa' : currentLang === 'en' ? 'Main' : 'ዋና ስራ',
              onClick: () => {
                onNavigateTab('school_portal');
                if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('owner_board');
              }
            },
            {
              id: 'owner-finance',
              label:
                currentLang === 'om'
                  ? 'Madaallii Faayinaansii Waliigalaa'
                  : currentLang === 'en'
                  ? 'Financial Overview'
                  : 'አጠቃላይ የፋይናንስ ሚዛን',
              desc:
                currentLang === 'om'
                  ? 'Kaffaltii walitti-qabame fi baasii bahe'
                  : currentLang === 'en'
                  ? 'Revenues, expenses & balance'
                  : 'የተሰበሰበ ክፍያና የወጣ ወጪ',
              icon: <DollarSign className="w-4 h-4 text-green-300" />,
              bgGradient: 'from-emerald-700 to-teal-900 hover:from-emerald-800 hover:to-teal-950',
              borderColor: 'border-emerald-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('school_portal');
                if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('finance');
              }
            },
            {
              id: 'owner-codes',
              label:
                currentLang === 'om'
                  ? 'Wiirtuu Koodiiwwan Seensaa'
                  : currentLang === 'en'
                  ? 'User Access Codes'
                  : 'የመግቢያ ኮዶች ማዕከል',
              desc:
                currentLang === 'om'
                  ? 'Daarektara fi hojjettootaaf koodii baasuu'
                  : currentLang === 'en'
                  ? 'Manage staff access codes'
                  : 'ለዳይሬክተርና ሰራተኞች ኮድ ማውጣት',
              icon: <KeyRound className="w-4 h-4 text-teal-300" />,
              bgGradient: 'from-teal-700 to-cyan-900 hover:from-teal-800 hover:to-cyan-950',
              borderColor: 'border-teal-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('school_portal');
                if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('codes');
              }
            },
            {
              id: 'owner-notice',
              label:
                currentLang === 'om'
                  ? 'Beeksisa Boordii Maxxansi'
                  : currentLang === 'en'
                  ? 'Post Board Notice'
                  : 'የቦርድ ማስታወቂያ ለጥፍ',
              desc:
                currentLang === 'om'
                  ? 'Hawaasa fi maatiif qajeelfama dabarsaa'
                  : currentLang === 'en'
                  ? 'Announce to community'
                  : 'ለማህበረሰቡና ወላጆች መመሪያ አስተላልፍ',
              icon: <Award className="w-4 h-4 text-purple-300" />,
              bgGradient: 'from-purple-700 to-indigo-900 hover:from-purple-800 hover:to-indigo-950',
              borderColor: 'border-purple-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('school_portal');
                if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('notices');
              }
            }
          ] as QuickAction[]
        };

      case 'school_director':
      case 'school_admin':
        return {
          roleTitle:
            currentLang === 'om'
              ? 'Daarektara Olaanaa / Hogganaa M/B'
              : currentLang === 'en'
              ? 'Principal / School Director'
              : 'ዋና ዳይሬክተር / ርዕሰ መምህር',
          salutation:
            currentLang === 'om'
              ? 'Baga nagaan dhuftan, Kabajamoo Daarektara Olaanaa'
              : currentLang === 'en'
              ? 'Welcome, Principal'
              : 'እንኳን ደህና መጡ፣ ክቡር ዋና ዳይሬክተር',
          roleBadge:
            currentLang === 'om'
              ? '🏫 Daarektara Olaanaa (Principal)'
              : currentLang === 'en'
              ? '🏫 Principal'
              : '🏫 ዋና ዳይሬክተር (Principal)',
          badgeColor: 'bg-teal-400 text-slate-950 border-teal-300',
          cardBg: 'from-slate-900 via-teal-950 to-slate-900',
          borderGlow: 'border-teal-500/40',
          summaryText:
            currentLang === 'om'
              ? 'Hojiiwwan barnootaa fi bulchiinsaa mana barnootaa olaantummaan to\'adhaa, gabaasa qabxii barattootaa Biiroo Barnootaaf ergaa.'
              : currentLang === 'en'
              ? 'Complete operational oversight: Supervise academic rosters, staff credentials, send bureau semester reports, and manage daily school routines.'
              : 'የትምህርት ቤቱን አጠቃላይ አካዳሚክ እና አስተዳደራዊ ስራዎች በበላይነት ይቆጣጠሩ፣ የተማሪዎች ውጤት ሪፖርት ለትምህርት ቢሮ ይላኩ።',
          actions: [
            {
              id: 'dir-roster',
              label:
                currentLang === 'om'
                  ? 'Qabxii Barattootaa fi Kaardii'
                  : currentLang === 'en'
                  ? 'Student Roster & Cards'
                  : 'የተማሪዎች ውጤትና ካርድ',
              desc:
                currentLang === 'om'
                  ? 'Qabxii, sadarkaa fi kaardii maxxansuu'
                  : currentLang === 'en'
                  ? 'View all grades & rankings'
                  : 'የተማሪዎች ውጤት፣ ደረጃና ካርድ ማተም',
              icon: <GraduationCap className="w-4 h-4 text-emerald-300" />,
              bgGradient: 'from-emerald-700 to-teal-900 hover:from-emerald-800 hover:to-teal-950',
              borderColor: 'border-emerald-400/40',
              textColor: 'text-white',
              badge: currentLang === 'om' ? 'Hojii Saffisaa' : currentLang === 'en' ? 'Quick' : 'ፈጣን ስራ',
              onClick: () => {
                onNavigateTab('school_portal');
                if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('roster');
              }
            },
            {
              id: 'dir-report',
              label:
                currentLang === 'om'
                  ? 'Gabaasa Biiroo Barnootaatti Ergi'
                  : currentLang === 'en'
                  ? 'Submit Report to Bureau'
                  : 'ሪፖርት ለትምህርት ቢሮ ላክ',
              desc:
                currentLang === 'om'
                  ? 'Cuunfaa qormaata semisteeraa Biiroo Shaashamanneetti'
                  : currentLang === 'en'
                  ? 'Send semester exam results'
                  : 'የሴሚስተር ፈተና ማጠቃለያ ለሻሸመኔ ቢሮ',
              icon: <Send className="w-4 h-4 text-amber-300" />,
              bgGradient: 'from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900',
              borderColor: 'border-amber-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('school_portal');
                if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('submit_report');
              }
            },
            {
              id: 'dir-stakeholders',
              label:
                currentLang === 'om'
                  ? 'Qooda-Fudhattoota & Faydaa'
                  : currentLang === 'en'
                  ? 'Staff Directory & Fayda'
                  : 'ባለድርሻ አካላት & ፋይዳ',
              desc:
                currentLang === 'om'
                  ? 'Waraqaa eenyummaa Faydaa fi ragaalee barsiisotaa'
                  : currentLang === 'en'
                  ? 'Teachers, library & credentials'
                  : 'የመምህራን ፋይዳ መታወቂያና ማስረጃዎች',
              icon: <Users className="w-4 h-4 text-cyan-300" />,
              bgGradient: 'from-cyan-700 to-blue-900 hover:from-cyan-800 hover:to-blue-950',
              borderColor: 'border-cyan-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('school_portal');
                if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('stakeholders');
              }
            },
            {
              id: 'dir-notice',
              label:
                currentLang === 'om'
                  ? 'Beeksisa Haaraa Maxxansi'
                  : currentLang === 'en'
                  ? 'Post Announcement'
                  : 'አዲስ ማስታወቂያ ለጥፍ',
              desc:
                currentLang === 'om'
                  ? 'Hawaasa mana barnootaa maraaf ergaa dabarsaa'
                  : currentLang === 'en'
                  ? 'School news & alerts'
                  : 'ለመላው ት/ቤት ማህበረሰብ መልዕክት',
              icon: <Award className="w-4 h-4 text-purple-300" />,
              bgGradient: 'from-purple-700 to-indigo-900 hover:from-purple-800 hover:to-indigo-950',
              borderColor: 'border-purple-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('school_portal');
                if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('notices');
              }
            }
          ] as QuickAction[]
        };

      case 'teacher':
        return {
          roleTitle:
            currentLang === 'om'
              ? 'Barsiisaa Kutaa / Gosa Barnootaa'
              : currentLang === 'en'
              ? 'Subject Teacher'
              : 'የክፍል / የትምህርት ዓይነት መምህር',
          salutation:
            currentLang === 'om'
              ? 'Baga nagaan dhuftan, Kabajamoo Barsiisaa'
              : currentLang === 'en'
              ? 'Welcome, Esteemed Teacher'
              : 'እንኳን ደህና መጡ፣ የተከበሩ መምህር',
          roleBadge:
            currentLang === 'om'
              ? '👨‍🏫 Barsiisaa (Teacher)'
              : currentLang === 'en'
              ? '👨‍🏫 Teacher'
              : '👨‍🏫 መምህር (Teacher)',
          badgeColor: 'bg-emerald-400 text-slate-950 border-emerald-300',
          cardBg: 'from-slate-900 via-emerald-950 to-slate-900',
          borderGlow: 'border-emerald-500/40',
          summaryText:
            currentLang === 'om'
              ? 'Kutaa hojii barsiisummaa keessan: Kutaa keessaniif hojii manaa kennaa, deebii barattootaa sirreessaa, hirmaannaa guyyaa galmeessaa fi qormaata ogummaa leenji\'aa.'
              : currentLang === 'en'
              ? 'Your isolated teaching desk: Create homework for your classes, grade submissions, take daily student attendance, and prepare for competency exams.'
              : 'የተከለለ የመምህርነት የስራ ገጽዎ፡ ለክፍልዎ የቤት ስራ ይስጡ፣ የተማሪዎችዎን መልስ ያርሙ፣ ዕለታዊ መገኘት ይመዝግቡ እና የሙያ ፈተና ይለማመዱ።',
          actions: [
            {
              id: 'tch-hw',
              label:
                currentLang === 'om'
                  ? 'Hojii Manaa fi Hirmaannaa Guyyaa'
                  : currentLang === 'en'
                  ? 'Homework & Attendance'
                  : 'የቤት ስራ እና ዕለታዊ መገኘት',
              desc:
                currentLang === 'om'
                  ? 'Hojii manaa kennuu fi deebii barataa sirreessuu'
                  : currentLang === 'en'
                  ? 'Give tasks & review submissions'
                  : 'የቤት ስራ መስጠትና የተማሪ መልስ ማረም',
              icon: <BookOpen className="w-4 h-4 text-amber-300" />,
              bgGradient: 'from-emerald-700 to-teal-900 hover:from-emerald-800 hover:to-teal-950',
              borderColor: 'border-emerald-400/40',
              textColor: 'text-white',
              badge: currentLang === 'om' ? 'Hojii Guyyaa' : currentLang === 'en' ? 'Daily' : 'የዕለት ስራ',
              onClick: () => {
                onNavigateTab('school_portal');
                if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('homework_attendance');
              }
            },
            {
              id: 'tch-roster',
              label:
                currentLang === 'om'
                  ? 'Galmee Qabxii Barattootaa'
                  : currentLang === 'en'
                  ? 'Student Scores Roster'
                  : 'የተማሪዎች ውጤት መዝገብ',
              desc:
                currentLang === 'om'
                  ? 'Qabxii qormaataa fi bu\'aa kaardii guutuu'
                  : currentLang === 'en'
                  ? 'Input mid/final marks'
                  : 'የፈተና ነጥቦችንና የካርድ ውጤት መሙላት',
              icon: <GraduationCap className="w-4 h-4 text-teal-300" />,
              bgGradient: 'from-teal-700 to-cyan-900 hover:from-teal-800 hover:to-cyan-950',
              borderColor: 'border-teal-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('school_portal');
                if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('roster');
              }
            },
            {
              id: 'tch-exam',
              label:
                currentLang === 'om'
                  ? 'Qormaata Gahumsa Barsiisotaa'
                  : currentLang === 'en'
                  ? 'Teacher Competency Exam'
                  : 'የመምህራን ብቃት ፈተናዎች',
              desc:
                currentLang === 'om'
                  ? 'Qormaatilee ogummaa Biiroo Barnootaan qophaa\'an'
                  : currentLang === 'en'
                  ? 'Take online bureau exams'
                  : 'በትምህርት ቢሮ የተዘጋጁ የሙያ ፈተናዎች',
              icon: <Award className="w-4 h-4 text-amber-300" />,
              bgGradient: 'from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900',
              borderColor: 'border-amber-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('exams');
              }
            },
            {
              id: 'tch-training',
              label:
                currentLang === 'om'
                  ? 'Wiirtuu Leenjii Barsiisummaa'
                  : currentLang === 'en'
                  ? 'Teacher Training Hub'
                  : 'የማስተማሪያ ስልጠና ሞጁሎች',
              desc:
                currentLang === 'om'
                  ? 'Kitaabota sirna-barnootaa fi qajeelfamoota'
                  : currentLang === 'en'
                  ? 'Curriculum guides & materials'
                  : 'የስርዓተ-ትምህርት መጽሐፍትና መመሪያዎች',
              icon: <BookOpen className="w-4 h-4 text-purple-300" />,
              bgGradient: 'from-purple-700 to-indigo-900 hover:from-purple-800 hover:to-indigo-950',
              borderColor: 'border-purple-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('training');
              }
            }
          ] as QuickAction[]
        };

      case 'student':
        return {
          roleTitle:
            currentLang === 'om'
              ? 'Barataa / Barattuu'
              : currentLang === 'en'
              ? 'Active Student'
              : 'ተማሪ',
          salutation:
            currentLang === 'om'
              ? 'Baga nagaan dhufte, Barataa Jaallatamaa'
              : currentLang === 'en'
              ? 'Welcome, Dear Student'
              : 'እንኳን ደህና መጣህ/ሽ፣ ውድ ተማሪ',
          roleBadge:
            currentLang === 'om'
              ? '🎓 Barataa (Student)'
              : currentLang === 'en'
              ? '🎓 Student'
              : '🎓 ተማሪ (Student)',
          badgeColor: 'bg-violet-400 text-slate-950 border-violet-300',
          cardBg: 'from-slate-900 via-violet-950 to-slate-900',
          borderGlow: 'border-violet-500/40',
          summaryText:
            currentLang === 'om'
              ? 'Wiirtuu barataa keessan: Kaardii qabxii keessan, sadarkaa, hojii manaa, hirmaannaa guyyaa fi waraqaa eenyummaa dijitaalaa yeroodhuma san hordofaa.'
              : currentLang === 'en'
              ? 'Your personal student dashboard: View your official report card, track subject ranks, complete homework assignments, and download your student ID.'
              : 'የግል የተማሪ ማዕከልዎ፡ ይፋዊ የውጤት ካርድዎን፣ የደረጃ ምደባዎን፣ የቤት ስራዎን፣ ዕለታዊ መገኘትዎን እና ዲጂታል የተማሪ መታወቂያዎን በቅጽበት ይከታተሉ።',
          actions: [
            {
              id: 'stu-card',
              label:
                currentLang === 'om'
                  ? 'Kaardii Qabxii Koo'
                  : currentLang === 'en'
                  ? 'My Academic Report Card'
                  : 'ይፋዊ የውጤት ካርዴ',
              desc:
                currentLang === 'om'
                  ? 'Qabxii qormaataa, giddu-galeessaa fi sadarkaa'
                  : currentLang === 'en'
                  ? 'Review all subject scores'
                  : 'የፈተና ነጥቦች፣ አማካይና የክፍል ደረጃ',
              icon: <GraduationCap className="w-4 h-4 text-violet-300" />,
              bgGradient: 'from-violet-700 to-purple-900 hover:from-violet-800 hover:to-purple-950',
              borderColor: 'border-violet-400/40',
              textColor: 'text-white',
              badge: currentLang === 'om' ? 'Fuula Guddaa' : currentLang === 'en' ? 'Main' : 'ዋና ገጽ',
              onClick: () => {
                onNavigateTab('student_portal');
              }
            },
            {
              id: 'stu-hw',
              label:
                currentLang === 'om'
                  ? 'Hojiiwwan Manaa Kennaman'
                  : currentLang === 'en'
                  ? 'Assigned Homework'
                  : 'የተሰጡ የቤት ስራዎች',
              desc:
                currentLang === 'om'
                  ? 'Deebii kennuu fi qabxii hordofuu'
                  : currentLang === 'en'
                  ? 'Submit answers to teachers'
                  : 'መልስ ማስገቢያና ነጥብ መከታተያ',
              icon: <BookOpen className="w-4 h-4 text-emerald-300" />,
              bgGradient: 'from-emerald-700 to-teal-900 hover:from-emerald-800 hover:to-teal-950',
              borderColor: 'border-emerald-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('student_portal');
              }
            },
            {
              id: 'stu-id',
              label:
                currentLang === 'om'
                  ? 'Waraqaa Eenyummaa Barataa'
                  : currentLang === 'en'
                  ? 'Student ID Card'
                  : 'የተማሪ መታወቂያ ካርድ',
              desc:
                currentLang === 'om'
                  ? 'Waraqaa eenyummaa dijitaalaa M/B Shaashamannee'
                  : currentLang === 'en'
                  ? 'Print or view digital card'
                  : 'የሻሸመኔ ት/ቤት ዲጂታል መታወቂያ',
              icon: <CreditCard className="w-4 h-4 text-amber-300" />,
              bgGradient: 'from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900',
              borderColor: 'border-amber-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('student_portal');
              }
            },
            {
              id: 'stu-fees',
              label:
                currentLang === 'om'
                  ? 'Seenaa Kaffaltii Ji\'aa'
                  : currentLang === 'en'
                  ? 'Fee Payment History'
                  : 'የወር ክፍያ ደረሰኞች',
              desc:
                currentLang === 'om'
                  ? 'Nagaheewwan kaffaltii Telebirr/Baankii'
                  : currentLang === 'en'
                  ? 'Electronic payment receipts'
                  : 'የቴሌብር/ባንክ የተከፈሉ ደረሰኞች',
              icon: <DollarSign className="w-4 h-4 text-cyan-300" />,
              bgGradient: 'from-teal-700 to-cyan-900 hover:from-teal-800 hover:to-cyan-950',
              borderColor: 'border-teal-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('student_portal');
              }
            }
          ] as QuickAction[]
        };

      case 'parent':
        return {
          roleTitle:
            currentLang === 'om'
              ? 'Maatii / Guddiftuu Barataa'
              : currentLang === 'en'
              ? 'Parent / Guardian'
              : 'የተማሪ ወላጅ / አሳዳጊ',
          salutation:
            currentLang === 'om'
              ? 'Baga nagaan dhuftan, Kabajamoo Maatii'
              : currentLang === 'en'
              ? 'Welcome, Respected Parent'
              : 'እንኳን ደህና መጡ፣ የተከበሩ ወላጅ',
          roleBadge:
            currentLang === 'om'
              ? '👨‍👩‍👧 Maatii (Parent)'
              : currentLang === 'en'
              ? '👨‍👩‍👧 Parent'
              : '👨‍👩‍👧 ወላጅ (Parent)',
          badgeColor: 'bg-rose-400 text-slate-950 border-rose-300',
          cardBg: 'from-slate-900 via-rose-950 to-slate-900',
          borderGlow: 'border-rose-500/40',
          summaryText:
            currentLang === 'om'
              ? 'Wiirtuu hordoffii maatii: Qabxii barnootaa ijoollee keessanii, hirmaannaa kutaa, nagahee kaffaltii fi beeksisoota mana barnootaa kallattiin mana ta\'aatii hordofaa.'
              : currentLang === 'en'
              ? 'Parental tracking portal: Monitor your child academic progress, daily classroom attendance, tuition payments, and school announcements directly from home.'
              : 'የወላጅ መከታተያ ማዕከል፡ የልጅዎን የትምህርት ውጤት፣ ዕለታዊ የክፍል መገኘት፣ የወር ክፍያ ደረሰኞችና የት/ቤት ማስታወቂያዎችን በቀጥታ ይከታተሉ።',
          actions: [
            {
              id: 'par-report',
              label:
                currentLang === 'om'
                  ? 'Kaardii Qabxii Ijoollee Keessanii'
                  : currentLang === 'en'
                  ? 'Child Academic Report'
                  : 'የልጅዎ የውጤት ካርድ',
              desc:
                currentLang === 'om'
                  ? 'Qabxii waliigalaa, sadarkaa fi naamusa'
                  : currentLang === 'en'
                  ? 'Scores, ranks & conduct'
                  : 'አጠቃላይ ነጥብ፣ የደረጃ ምደባና ስነ-ምግባር',
              icon: <GraduationCap className="w-4 h-4 text-rose-300" />,
              bgGradient: 'from-rose-700 to-pink-900 hover:from-rose-800 hover:to-pink-950',
              borderColor: 'border-rose-400/40',
              textColor: 'text-white',
              badge: currentLang === 'om' ? 'Hordoffii Guddaa' : currentLang === 'en' ? 'Core' : 'ዋና ክትትል',
              onClick: () => {
                onNavigateTab('student_portal');
              }
            },
            {
              id: 'par-attendance',
              label:
                currentLang === 'om'
                  ? 'Hordoffii Hirmaannaa Guyyaa'
                  : currentLang === 'en'
                  ? 'Attendance Tracking'
                  : 'ዕለታዊ መገኘት ክትትል',
              desc:
                currentLang === 'om'
                  ? 'Haala kutaa keessatti argamuu ykn barfachuu'
                  : currentLang === 'en'
                  ? 'Check daily classroom presence'
                  : 'በክፍል ውስጥ የመገኘት/የማርፈድ ሁኔታ',
              icon: <Clock className="w-4 h-4 text-emerald-300" />,
              bgGradient: 'from-emerald-700 to-teal-900 hover:from-emerald-800 hover:to-teal-950',
              borderColor: 'border-emerald-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('student_portal');
              }
            },
            {
              id: 'par-pay',
              label:
                currentLang === 'om'
                  ? 'Galmee Kaffaltii Barnootaa'
                  : currentLang === 'en'
                  ? 'Tuition Payment Receipts'
                  : 'የትምህርት ክፍያ መዝገብ',
              desc:
                currentLang === 'om'
                  ? 'Kaffaltiiwwan ji\'aa kaffalaman fi nagaheewwan'
                  : currentLang === 'en'
                  ? 'View collected fee receipts'
                  : 'የተከፈሉ ወርሃዊ ክፍያዎችና ደረሰኞች',
              icon: <DollarSign className="w-4 h-4 text-amber-300" />,
              bgGradient: 'from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900',
              borderColor: 'border-amber-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('student_portal');
              }
            },
            {
              id: 'par-notices',
              label:
                currentLang === 'om'
                  ? 'Beeksisoota M/B'
                  : currentLang === 'en'
                  ? 'School Announcements'
                  : 'የት/ቤት ማስታወቂያዎች',
              desc:
                currentLang === 'om'
                  ? 'Walgahii maatii fi sagantaa guyyoota qormaataa'
                  : currentLang === 'en'
                  ? 'PTA meetings & notices'
                  : 'የወላጆች ስብሰባና የፈተና ቀናት መርሃ-ግብር',
              icon: <Award className="w-4 h-4 text-purple-300" />,
              bgGradient: 'from-purple-700 to-indigo-900 hover:from-purple-800 hover:to-indigo-950',
              borderColor: 'border-purple-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('student_portal');
              }
            }
          ] as QuickAction[]
        };

      case 'accountant':
        return {
          roleTitle:
            currentLang === 'om'
              ? 'Itti-Gaafatamaa Faayinaansii / Qabaa Herregaa'
              : currentLang === 'en'
              ? 'School Accountant & Cashier'
              : 'ዋና ሒሳብ ሹም / ፋይናንስ ኃላፊ',
          salutation:
            currentLang === 'om'
              ? 'Baga nagaan dhuftan, Hogganaa Faayinaansii'
              : currentLang === 'en'
              ? 'Welcome, Finance Officer'
              : 'እንኳን ደህና መጡ፣ ዋና ሒሳብ ሹም',
          roleBadge:
            currentLang === 'om'
              ? '💵 Faayinaansii (Finance)'
              : currentLang === 'en'
              ? '💵 Finance'
              : '💵 ፋይናንስ (Finance)',
          badgeColor: 'bg-green-400 text-slate-950 border-green-300',
          cardBg: 'from-slate-900 via-green-950 to-slate-900',
          borderGlow: 'border-green-500/40',
          summaryText:
            currentLang === 'om'
              ? 'Kutaa faayinaansii keessan: Kaffaltii ji\'aa barattootaa sassaabaa, nagahee seera-qabeessa maxxansaa, baasiiwwan bulchiinsaa galmeessaa fi madaallii baajataa baasaa.'
              : currentLang === 'en'
              ? 'Your isolated school finance desk: Collect monthly tuition fees, print electronic official receipts, record operating expenses, and balance school books.'
              : 'የተከለለ የፋይናንስ ጽ/ቤትዎ፡ የተማሪዎች ወርሃዊ የትምህርት ክፍያ ይሰብስቡ፣ ይፋዊ ደረሰኝ ያትሙ፣ አስተዳደራዊ ወጪዎችን ይመዝግቡና የበጀት ሚዛን ያውጡ።',
          actions: [
            {
              id: 'acc-fees',
              label:
                currentLang === 'om'
                  ? 'Kutaa Kaffaltii Ji\'aa Sassaabuu'
                  : currentLang === 'en'
                  ? 'Tuition Collection Desk'
                  : 'የወር ክፍያ መሰብሰቢያ ጽ/ቤት',
              desc:
                currentLang === 'om'
                  ? 'Kaffaltii fuudhuu fi nagahee seera-qabeessa baasuu'
                  : currentLang === 'en'
                  ? 'Collect fee & print receipts'
                  : 'ክፍያ መቀበልና ይፋዊ ደረሰኝ ማውጣት',
              icon: <DollarSign className="w-4 h-4 text-emerald-300" />,
              bgGradient: 'from-emerald-700 to-teal-900 hover:from-emerald-800 hover:to-teal-950',
              borderColor: 'border-emerald-400/40',
              textColor: 'text-white',
              badge: currentLang === 'om' ? 'Hojii Guddaa' : currentLang === 'en' ? 'Main' : 'ዋና ስራ',
              onClick: () => {
                onNavigateTab('school_portal');
                if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('finance');
              }
            },
            {
              id: 'acc-expenses',
              label:
                currentLang === 'om'
                  ? 'Galmee Baasiiwwan Bulchiinsaa'
                  : currentLang === 'en'
                  ? 'School Expenses Desk'
                  : 'አስተዳደራዊ ወጪዎች መመዝገቢያ',
              desc:
                currentLang === 'om'
                  ? 'Mindaa, ibsaa fi bishaanii, baasii suphaa'
                  : currentLang === 'en'
                  ? 'Salaries, utilities & supplies'
                  : 'የደመወዝ፣ መብራትና ውሃ፣ የጥገና ወጪዎች',
              icon: <FileText className="w-4 h-4 text-amber-300" />,
              bgGradient: 'from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900',
              borderColor: 'border-amber-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('school_portal');
                if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('finance');
              }
            },
            {
              id: 'acc-balance',
              label:
                currentLang === 'om'
                  ? 'Ibsa Madaallii Galii fi Baasii'
                  : currentLang === 'en'
                  ? 'Statement & Net Balance'
                  : 'የገቢና ወጪ ሚዛን መግለጫ',
              desc:
                currentLang === 'om'
                  ? 'Galii waliigalaa, baasii fi madaallii kaazinaa'
                  : currentLang === 'en'
                  ? 'Real-time financial status'
                  : 'ጠቅላላ ገቢ፣ ወጪና የካዝና ሚዛን',
              icon: <CreditCard className="w-4 h-4 text-cyan-300" />,
              bgGradient: 'from-teal-700 to-cyan-900 hover:from-teal-800 hover:to-cyan-950',
              borderColor: 'border-teal-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('school_portal');
                if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('finance');
              }
            },
            {
              id: 'acc-notices',
              label:
                currentLang === 'om'
                  ? 'Gabatee Beeksisa Faayinaansii'
                  : currentLang === 'en'
                  ? 'Finance Notices'
                  : 'የፋይናንስ ማስታወቂያ ሰሌዳ',
              desc:
                currentLang === 'om'
                  ? 'Yaadachiisa kaffaltii fi ergaawwan bulchiinsaa'
                  : currentLang === 'en'
                  ? 'Payment deadline announcements'
                  : 'የክፍያ ማሳሰቢያና አስተዳደራዊ መልዕክቶች',
              icon: <Award className="w-4 h-4 text-purple-300" />,
              bgGradient: 'from-purple-700 to-indigo-900 hover:from-purple-800 hover:to-indigo-950',
              borderColor: 'border-purple-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('school_portal');
                if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('notices');
              }
            }
          ] as QuickAction[]
        };

      case 'registrar':
        return {
          roleTitle:
            currentLang === 'om'
              ? 'Reejistiraara / Kutaa Simannaa Barattootaa'
              : currentLang === 'en'
              ? 'Registrar & Admissions Officer'
              : 'ሬጅስትራር / የተማሪዎች ቅበላ ክፍል',
          salutation:
            currentLang === 'om'
              ? 'Baga nagaan dhuftan, Hogganaa Reejistiraaraa'
              : currentLang === 'en'
              ? 'Welcome, Registrar'
              : 'እንኳን ደህና መጡ፣ የሬጅስትራር ኃላፊ',
          roleBadge:
            currentLang === 'om'
              ? '📋 Reejistiraara (Registrar)'
              : currentLang === 'en'
              ? '📋 Registrar'
              : '📋 ሬጅስትራር (Registrar)',
          badgeColor: 'bg-blue-400 text-slate-950 border-blue-300',
          cardBg: 'from-slate-900 via-blue-950 to-slate-900',
          borderGlow: 'border-blue-500/40',
          summaryText:
            currentLang === 'om'
              ? 'Kutaa simannaa barattootaa keessan: Barattoota haaraa galmeessaa, kutaa fi sekshiniitti ramadaa, waraqaa eenyummaa qopheessaa fi galmee to\'adhaa.'
              : currentLang === 'en'
              ? 'Your isolated student admissions desk: Register new students, assign classroom sections, issue official photo ID cards, and manage the student master register.'
              : 'የተከለለ የተማሪዎች ቅበላ ጽ/ቤትዎ፡ አዳዲስ ተማሪዎችን ይመዝግቡ፣ በክፍል እና በሴክሽን ይመድቡ፣ የተማሪ መታወቂያ ካርድ ያዘጋጁና መዝገብ ይያዙ።',
          actions: [
            {
              id: 'reg-enroll',
              label:
                currentLang === 'om'
                  ? 'Galmee Barataa Haaraa & Koodii'
                  : currentLang === 'en'
                  ? 'New Student Enrollment'
                  : 'አዲስ ተማሪ ምዝገባ & ኮድ',
              desc:
                currentLang === 'om'
                  ? 'Barataa haaraa galmeessee koodii seensaa kennuu'
                  : currentLang === 'en'
                  ? 'Enroll & generate student/parent codes'
                  : 'አዲስ ተማሪ መዝግቦ መግቢያ ኮድ መስጠት',
              icon: <Plus className="w-4 h-4 text-blue-300" />,
              bgGradient: 'from-blue-700 to-indigo-900 hover:from-blue-800 hover:to-indigo-950',
              borderColor: 'border-blue-400/40',
              textColor: 'text-white',
              badge: currentLang === 'om' ? 'Hojii Guddaa' : currentLang === 'en' ? 'Core' : 'ዋና ስራ',
              onClick: () => {
                onNavigateTab('school_portal');
                if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('registrar');
              }
            },
            {
              id: 'reg-id',
              label:
                currentLang === 'om'
                  ? 'Waraqaa Eenyummaa Barataa Maxxansuu'
                  : currentLang === 'en'
                  ? 'Issue Student ID Cards'
                  : 'የተማሪ መታወቂያ ካርድ ማተሚያ',
              desc:
                currentLang === 'om'
                  ? 'Asxaa mana barnootaa qabuun kaardii eenyummaa qopheessuu'
                  : currentLang === 'en'
                  ? 'Print official cards with school logo'
                  : 'የት/ቤቱ አርማ ያለበት መታወቂያ ካርድ ማዘጋጀት',
              icon: <CreditCard className="w-4 h-4 text-teal-300" />,
              bgGradient: 'from-teal-700 to-emerald-900 hover:from-teal-800 hover:to-emerald-950',
              borderColor: 'border-teal-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('school_portal');
                if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('registrar');
              }
            },
            {
              id: 'reg-roster',
              label:
                currentLang === 'om'
                  ? 'Galmee Barattootaa Waliigalaa'
                  : currentLang === 'en'
                  ? 'Student Master Roster'
                  : 'የተማሪዎች አጠቃላይ መዝገብ',
              desc:
                currentLang === 'om'
                  ? 'Barattoota kutaalee hundaafi bilbila maatii'
                  : currentLang === 'en'
                  ? 'View all grades, sections & info'
                  : 'የሁሉም ክፍሎች ተማሪዎችና የወላጅ ስልክ',
              icon: <GraduationCap className="w-4 h-4 text-amber-300" />,
              bgGradient: 'from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900',
              borderColor: 'border-amber-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('school_portal');
                if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('roster');
              }
            },
            {
              id: 'reg-notices',
              label:
                currentLang === 'om'
                  ? 'Beeksisoota Galmee'
                  : currentLang === 'en'
                  ? 'Admissions Notices'
                  : 'የምዝገባ ማስታወቂያዎች',
              desc:
                currentLang === 'om'
                  ? 'Guyyoota simannaa fi jijjiirraa barattoota haaraa'
                  : currentLang === 'en'
                  ? 'New semester admissions alerts'
                  : 'የአዲስ ተማሪዎች ቅበላና የዝውውር ቀናት',
              icon: <Award className="w-4 h-4 text-purple-300" />,
              bgGradient: 'from-purple-700 to-indigo-900 hover:from-purple-800 hover:to-indigo-950',
              borderColor: 'border-purple-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('school_portal');
                if (onNavigateSchoolSubTab) onNavigateSchoolSubTab('notices');
              }
            }
          ] as QuickAction[]
        };

      case 'bureau_admin':
      case 'bureau_staff':
      default:
        return {
          roleTitle:
            currentLang === 'om'
              ? 'Bulchiinsa fi To\'ataa Biiroo Barnootaa'
              : currentLang === 'en'
              ? 'City Education Bureau Admin'
              : 'የትምህርት ቢሮ አመራርና ተቆጣጣሪ',
          salutation:
            currentLang === 'om'
              ? 'Baga nagaan dhuftan, Kabajamoo Hogganaa Biiroo Barnootaa'
              : currentLang === 'en'
              ? 'Welcome, Education Bureau Leader'
              : 'እንኳን ደህና መጡ፣ ክቡር የትምህርት ቢሮ አመራር',
          roleBadge:
            currentLang === 'om'
              ? '🏛️ Biiroo Barnootaa (Bureau Admin)'
              : currentLang === 'en'
              ? '🏛️ Bureau Admin'
              : '🏛️ የትምህርት ቢሮ (Bureau Admin)',
          badgeColor: 'bg-emerald-400 text-slate-950 border-emerald-300',
          cardBg: 'from-slate-900 via-emerald-950 to-slate-900',
          borderGlow: 'border-emerald-500/40',
          summaryText:
            currentLang === 'om'
              ? 'Wiirtuu to\'annoo ol-aanaa Biiroo Barnootaa Magaalaa: Qabxii waliigalaa manneen barnootaa hordofaa, ragaalee barsiisotaa mirkaneessaa fi wiirtuu qormaataa to\'adhaa.'
              : currentLang === 'en'
              ? 'Regional regulatory command center: Monitor citywide school performance, audit teacher credentials, oversee online exams, and review semester submissions.'
              : 'የከተማው የትምህርት ቢሮ የበላይ መቆጣጠሪያ፡ የትምህርት ቤቶችን አጠቃላይ ውጤት ይከታተሉ፣ የመምህራን ማስረጃዎችን ያረጋግጡና የፈተና ማዕከሉን ያስተዳድሩ።',
          actions: [
            {
              id: 'bur-schools',
              label:
                currentLang === 'om'
                  ? 'Dhaabbilee Manneen Barnootaa'
                  : currentLang === 'en'
                  ? 'School Institutions'
                  : 'የትምህርት ቤቶች ተቋማት',
              desc:
                currentLang === 'om'
                  ? 'Tarree manneen barnootaa Magaalaa Shaashamannee'
                  : currentLang === 'en'
                  ? 'All schools across Shashemene'
                  : 'በሻሸመኔ ከተማ ያሉ ት/ቤቶች ዝርዝር',
              icon: <Building2 className="w-4 h-4 text-emerald-300" />,
              bgGradient: 'from-emerald-700 to-teal-900 hover:from-emerald-800 hover:to-teal-950',
              borderColor: 'border-emerald-400/40',
              textColor: 'text-white',
              badge: currentLang === 'om' ? 'Daashboordii Guddaa' : currentLang === 'en' ? 'Main' : 'ዋና ዳሽቦርድ',
              onClick: () => {
                onNavigateTab('schools');
              }
            },
            {
              id: 'bur-reports',
              label:
                currentLang === 'om'
                  ? 'Gabaasawwan Bu\'aa M/Barnootaa'
                  : currentLang === 'en'
                  ? 'Semester Reports'
                  : 'የት/ቤቶች ውጤት ሪፖርቶች',
              desc:
                currentLang === 'om'
                  ? 'Gabaasa qabxii m/b irraa ergame gamaaggamuu'
                  : currentLang === 'en'
                  ? 'Audit student grade submissions'
                  : 'ከት/ቤቶች የተላኩ የውጤት ሪፖርቶች መገምገሚያ',
              icon: <FileText className="w-4 h-4 text-amber-300" />,
              bgGradient: 'from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900',
              borderColor: 'border-amber-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('reports');
              }
            },
            {
              id: 'bur-credentials',
              label:
                currentLang === 'om'
                  ? 'Ooditii Gahumsa Barsiisotaa'
                  : currentLang === 'en'
                  ? 'Teacher Credentials Audit'
                  : 'የመምህራን ብቃት ኦዲት',
              desc:
                currentLang === 'om'
                  ? 'Diploomaa, digirii fi eeyyama ogummaa mirkaneessuu'
                  : currentLang === 'en'
                  ? 'Verify diplomas, degrees & licenses'
                  : 'ዲፕሎማ፣ ዲግሪ እና የሙያ ፈቃድ ማረጋገጫ',
              icon: <ShieldCheck className="w-4 h-4 text-cyan-300" />,
              bgGradient: 'from-teal-700 to-cyan-900 hover:from-teal-800 hover:to-cyan-950',
              borderColor: 'border-teal-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('credentials');
              }
            },
            {
              id: 'bur-exams',
              label:
                currentLang === 'om'
                  ? 'Wiirtuu Qormaata Toora Irraa'
                  : currentLang === 'en'
                  ? 'Online Exams Center'
                  : 'ኦንላይን የፈተና ማዕከል',
              desc:
                currentLang === 'om'
                  ? 'Baankii gaaffilee qormaata gahumsa barsiisotaa'
                  : currentLang === 'en'
                  ? 'Teacher competency assessment'
                  : 'የመምህራን ብቃት ፈተና ጥያቄዎች ባንክ',
              icon: <Award className="w-4 h-4 text-purple-300" />,
              bgGradient: 'from-purple-700 to-indigo-900 hover:from-purple-800 hover:to-indigo-950',
              borderColor: 'border-purple-400/40',
              textColor: 'text-white',
              onClick: () => {
                onNavigateTab('exams');
              }
            }
          ] as QuickAction[]
        };
    }
  };

  const config = getRoleConfig();

  return (
    <div
      className={`bg-gradient-to-br ${config.cardBg} text-white rounded-3xl border ${config.borderGlow} shadow-xl relative overflow-hidden transition-all duration-300`}
    >
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Greeting Banner */}
      <div className="p-4 sm:p-6 relative z-10 space-y-4">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            {/* Salutation pill & time badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/10 text-emerald-200 border border-white/15 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{getTimeGreeting()}</span>
              </span>

              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider border shadow-xs ${config.badgeColor}`}
              >
                {config.roleBadge}
              </span>

              {activeSchool && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800/80 text-slate-300 border border-slate-700">
                  <Building2 className="w-3 h-3 text-emerald-400" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{activeSchool.name}</span>
                </span>
              )}
            </div>

            {/* Dynamic Personalized Name Heading */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2 flex-wrap pt-1">
              <span>{config.salutation}{currentLang === 'am' ? '፣' : ','}</span>
              <span className="text-amber-300 underline decoration-amber-400/50 underline-offset-4">
                {currentUser.name}
              </span>
            </h2>

            {/* Subtitle brief */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {config.summaryText}
            </p>
          </div>

          {/* Quick Role Switcher Button & Collapse Button */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            {onOpenQuickRoleModal && (
              <button
                type="button"
                onClick={onOpenQuickRoleModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 hover:text-white border border-amber-400/40 transition-all cursor-pointer shadow-xs"
                title={
                  currentLang === 'om'
                    ? 'Gahee Hojii Jijjiiri'
                    : currentLang === 'en'
                    ? 'Switch Role'
                    : 'የስራ ሚና ቀይር'
                }
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="hidden sm:inline">
                  {currentLang === 'om'
                    ? 'Gahee Hojii Jijjiiri'
                    : currentLang === 'en'
                    ? 'Switch Role'
                    : 'የስራ ሚና ቀይር'}
                </span>
                <span className="sm:hidden">
                  {currentLang === 'om' ? 'Jijjiiri' : currentLang === 'en' ? 'Switch' : 'ቀይር'}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title={
                isCollapsed
                  ? currentLang === 'om'
                    ? 'Bani (Expand)'
                    : currentLang === 'en'
                    ? 'Expand'
                    : 'አሳይ'
                  : currentLang === 'om'
                  ? 'Dheksi (Collapse)'
                  : currentLang === 'en'
                  ? 'Collapse'
                  : 'ደብቅ'
              }
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quick-Start Actions Section */}
        {!isCollapsed && (
          <div className="pt-2 border-t border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5 uppercase tracking-wider">
                <BookmarkCheck className="w-4 h-4 text-amber-400" />
                <span>
                  {currentLang === 'om'
                    ? 'Qabduuwwan Hojii Saffisaa (Quick-Start Desk)'
                    : currentLang === 'en'
                    ? 'Quick-Start Actions (Direct Access)'
                    : 'በቀጥታ ወደ ስራ መግቢያ ፈጣን ቁልፎች (Quick-Start Desk)'}
                </span>
              </span>
              <span className="text-[11px] text-slate-400">
                {currentLang === 'om'
                  ? 'Fuula barbaadame dafanii banuuf cuqaasaa'
                  : currentLang === 'en'
                  ? 'Click to navigate immediately'
                  : 'ወደ ተፈለገው ገፅ በቅጽበት ይሂዱ'}
              </span>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
              {config.actions.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={act.onClick}
                  className={`p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r ${act.bgGradient} border ${act.borderColor} ${act.textColor} text-left transition-all duration-200 hover:scale-102 hover:shadow-lg flex flex-col justify-between group cursor-pointer relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center border border-white/20 shrink-0">
                      {act.icon}
                    </div>

                    {act.badge ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                        {act.badge}
                      </span>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-black leading-snug tracking-tight">
                      {act.label}
                    </h4>
                    <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5 font-medium">
                      {act.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
