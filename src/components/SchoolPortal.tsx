import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Users,
  GraduationCap,
  KeyRound,
  Plus,
  Copy,
  Check,
  FileText,
  Printer,
  Award,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  CreditCard,
  Camera,
  Search,
  Filter,
  Phone,
  User,
  Shield,
  ShieldCheck,
  Layers,
  ChevronRight,
  BookOpen,
  Trash2,
  Megaphone,
  DollarSign,
  Briefcase,
  Crown,
  HelpCircle,
  ClipboardList,
  Maximize2,
  Minimize2,
  QrCode,
  Star,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  SlidersHorizontal,
  X,
  Hash,
  Moon,
  Lock,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import {
  Language,
  School,
  StudentRecord,
  StudentScore,
  SchoolReportSubmission,
  AppUserSession,
  SchoolStakeholder,
  DeveloperPaymentReceipt,
  StudentDisciplineReport
} from '../types';
import { translations } from '../data/translations';
import { StorageService, SchoolUserCode } from '../utils/storage';
import {
  getLocalizedStakeholders,
  getLocalizedSchoolCodes,
  getLocalizedDisciplineList,
  getLocalizedNightScheduleList,
  getLocalizedAnnouncements,
  getLocalizedHomeworkList
} from '../utils/localizedData';
import { OfflineSyncManager } from '../utils/offlineSync';
import { StudentIDCardModal } from './StudentIDCardModal';
import { SchoolLogo } from './SchoolLogo';
import { SchoolLogoModal } from './SchoolLogoModal';
import { StakeholderCertificateModal } from './StakeholderCertificateModal';
import { StakeholderFormModal } from './StakeholderFormModal';
import { SchoolOwnerBoardView } from './SchoolOwnerBoardView';
import { SchoolNoticeBoard } from './SchoolNoticeBoard';
import { HomeworkAndAttendanceManager } from './HomeworkAndAttendanceManager';
import { SchoolFinanceView } from './SchoolFinanceView';
import { SchoolRegistrarView } from './SchoolRegistrarView';
import { SchoolLibraryDesk } from './SchoolLibraryDesk';
import { TeacherSubjectTrainingDesk } from './TeacherSubjectTrainingDesk';
import { StudentQRAttendanceView } from './StudentQRAttendanceView';
import { BureauTeacherAppraisalView } from './BureauTeacherAppraisalView';
import { GradeApprovalWorkflowDesk } from './GradeApprovalWorkflowDesk';
import { NightSchoolDesk } from './NightSchoolDesk';
import { DeveloperPaymentModal } from './DeveloperPaymentModal';
import { StudentDisciplineDesk } from './StudentDisciplineDesk';

export type SchoolSubTab =
  | 'overview'
  | 'stakeholders'
  | 'owner_board'
  | 'notices'
  | 'homework_attendance'
  | 'teacher_training'
  | 'qr_attendance'
  | 'teacher_evaluations'
  | 'grade_workflow'
  | 'student_discipline'
  | 'night_school'
  | 'finance'
  | 'registrar'
  | 'roster'
  | 'codes'
  | 'submit_report'
  | 'library_desk';

export const getDeskInfo = (tab: SchoolSubTab, lang: Language = 'am') => {
  switch (tab) {
    case 'overview':
      return {
        titleAm: 'ዋናው የትምህርት ቤት ማውጫ',
        titleEn: 'School Launchpad & All Desks',
        titleOm: 'Baafata Hojii Manneen Barnootaa Hunda',
        title: lang === 'om' ? 'Baafata Hojii Manneen Barnootaa Hunda' : lang === 'en' ? 'School Launchpad & All Desks' : 'ዋናው የትምህርት ቤት ማውጫ',
        icon: '🏠',
        gradient: 'from-slate-700 to-slate-900',
        desc: lang === 'om' ? 'Baafata hojiilee fi kutaa mana barnootaa hundaa filachuu' : lang === 'en' ? 'Main school launchpad and desk navigator' : 'የትምህርት ቤቱን አጠቃላይ የስራ ክፍሎች ማውጫ እና መምረጫ'
      };
    case 'finance':
      return {
        titleAm: 'የሒሳብ ክፍል እና የወር ክፍያ',
        titleEn: 'Finance & Tuition Fees',
        titleOm: 'Kutaa Faayinaansii fi Kaffaltii Ji\'aa',
        title: lang === 'om' ? 'Kutaa Faayinaansii fi Kaffaltii Ji\'aa' : lang === 'en' ? 'Finance & Tuition Fees' : 'የሒሳብ ክፍል እና የወር ክፍያ',
        icon: '💵',
        gradient: 'from-emerald-600 to-teal-800',
        desc: lang === 'om' ? 'Kaffaltii ji\'aa barattootaa, lakkoofsa herrega baankii, mirkaneessa nagahee fi baasiiwwan' : lang === 'en' ? 'Tuition fee payments, bank accounts, receipts and school expenses' : 'የተማሪዎች ወርሃዊ ክፍያ፣ የባንክ አካውንቶች፣ ደረሰኝ ማረጋገጫ እና ወጪዎች'
      };
    case 'student_discipline':
      return {
        titleAm: 'የተማሪዎች ስነ-ምግባር ክትትልና መጠቆሚያ',
        titleEn: 'Student Conduct & Misconduct Tips',
        titleOm: 'Hordoffii Amalaa fi Qajeelfama Barattootaa',
        title: lang === 'om' ? 'Hordoffii Amalaa fi Qajeelfama Barattootaa' : lang === 'en' ? 'Student Conduct & Misconduct Tips' : 'የተማሪዎች ስነ-ምግባር ክትትልና መጠቆሚያ',
        icon: '🚨',
        gradient: 'from-rose-600 to-red-800',
        desc: lang === 'om' ? 'Gabaasa balleessaa amalaa, qajeelfama daarektaraa fi tarkaanfii fudhatame' : lang === 'en' ? 'Student misconduct tips, director decisions and disciplinary actions' : 'የስነ-ምግባር ጉድለት ጥቆማዎች፣ የዳይሬክተር ውሳኔና እርምጃ'
      };
    case 'grade_workflow':
      return {
        titleAm: 'የውጤት ማፅደቂያ ስርዓት (Grade Workflow)',
        titleEn: 'Grade Approval Workflow (Teacher -> Homeroom -> Director)',
        titleOm: 'Sirna Mirkaneessa Qabxii (Grade Approval Workflow)',
        title: lang === 'om' ? 'Sirna Mirkaneessa Qabxii (Grade Approval Workflow)' : lang === 'en' ? 'Grade Approval Workflow (Teacher -> Homeroom -> Director)' : 'የውጤት ማፅደቂያ ስርዓት (Grade Workflow)',
        icon: '📝',
        gradient: 'from-teal-600 to-cyan-800',
        desc: lang === 'om' ? 'Walitti-qabaa qabxii qormaataa, mirkaneessa barsiisaa, kutaadhaa fi chaappaa daarektaraa' : lang === 'en' ? 'Exam scores collection, teacher and homeroom verification, official director stamp' : 'የፈተና ውጤት መሰብሰቢያ፣ ማረጋገጫና ይፋዊ ማፅደቂያ ማህተም'
      };
    case 'roster':
      return {
        titleAm: 'የተማሪዎች ውጤት ዝርዝርና ካርድ',
        titleEn: 'Student Roster & Report Cards',
        titleOm: 'Tarree Barattootaa fi Kaardii Qabxii',
        title: lang === 'om' ? 'Tarree Barattootaa fi Kaardii Qabxii' : lang === 'en' ? 'Student Roster & Report Cards' : 'የተማሪዎች ውጤት ዝርዝርና ካርድ',
        icon: '👥',
        gradient: 'from-blue-600 to-indigo-800',
        desc: lang === 'om' ? 'Galmee qabxii barattoota guyyaa, sadarkaa fi maxxansa kaardii gabaasaa' : lang === 'en' ? 'Regular student score records, ranks and printable report cards' : 'የቀን ተማሪዎች ውጤት መዝገብ፣ ደረጃ፣ የውጤት ካርድ ማተሚያ'
      };
    case 'night_school':
      return {
        titleAm: 'የማታና ተከታታይ ትምህርት ፕሮግራም',
        titleEn: 'Night & Extension School Program',
        titleOm: 'Sagantaa Barnoota Galgalaa fi Dabalataa',
        title: lang === 'om' ? 'Sagantaa Barnoota Galgalaa fi Dabalataa' : lang === 'en' ? 'Night & Extension School Program' : 'የማታና ተከታታይ ትምህርት ፕሮግራም',
        icon: '🌙',
        gradient: 'from-indigo-600 to-purple-800',
        desc: lang === 'om' ? 'Galmee barattoota galgalaa, sagantaa daree fi hordoffii argamaa' : lang === 'en' ? 'Night school student admissions, timetable and attendance tracking' : 'የማታ ተማሪዎች ምዝገባ፣ የክፍለ-ጊዜ ሰሌዳና ማታ መገኘት'
      };
    case 'homework_attendance':
      return {
        titleAm: 'የቤት ስራ እና ዕለታዊ መገኘት',
        titleEn: 'Homework & Daily Attendance',
        titleOm: 'Hojii Manaa fi Argama Guyyaa',
        title: lang === 'om' ? 'Hojii Manaa fi Argama Guyyaa' : lang === 'en' ? 'Homework & Daily Attendance' : 'የቤት ስራ እና ዕለታዊ መገኘት',
        icon: '📚',
        gradient: 'from-amber-600 to-orange-800',
        desc: lang === 'om' ? 'Kenniinsa hojii manaa, deebii barattoonni erganii fi hordoffii argama daree' : lang === 'en' ? 'Class homework dispatch, student submissions and daily attendance' : 'የክፍል የቤት ስራ መስጫ፣ ተማሪዎች የላኩት መልስና ዕለታዊ መገኘት'
      };
    case 'teacher_training':
      return {
        titleAm: 'ከትምህርት ቢሮ የተላኩ ስልጠናዎች',
        titleEn: 'Bureau Subject Training Dispatches',
        titleOm: 'Leenjii Barsiisotaa Biiroo Barnootaatiin Ergame',
        title: lang === 'om' ? 'Leenjii Barsiisotaa Biiroo Barnootaatiin Ergame' : lang === 'en' ? 'Bureau Subject Training Dispatches' : 'ከትምህርት ቢሮ የተላኩ ስልጠናዎች',
        icon: '🎓',
        gradient: 'from-emerald-700 to-teal-900',
        desc: lang === 'om' ? 'Barruulee leenjii gosa barnootaa fi sadarkaa kutaatiin Biiroo Barnootaatiin ergaman' : lang === 'en' ? 'Subject and grade level training documents sent by Education Bureau' : 'በትምህርት ቢሮ የተላኩ የስልጠና ሰነዶች፣ አታችመንትና ፈተናዎች'
      };
    case 'qr_attendance':
      return {
        titleAm: 'የተማሪዎች መገኘት በ QR መዝገብ',
        titleEn: 'Student QR Attendance Check-in',
        titleOm: 'Hordoffii Argama Barattootaa QR Koodiin',
        title: lang === 'om' ? 'Hordoffii Argama Barattootaa QR Koodiin' : lang === 'en' ? 'Student QR Attendance Check-in' : 'የተማሪዎች መገኘት በ QR መዝገብ',
        icon: '📱',
        gradient: 'from-teal-600 to-emerald-800',
        desc: lang === 'om' ? 'QR koodii waraqaa eenyummaa iskaan gochuun galmee argama saffisaa' : lang === 'en' ? 'Fast daily check-in by scanning student ID badge QR codes' : 'የተማሪ መታወቂያ QR ስካን በማድረግ ፈጣን ዕለታዊ መገኘት'
      };
    case 'teacher_evaluations':
      return {
        titleAm: 'የመምህራን የማስተማር ብቃት ምዘና',
        titleEn: 'Teacher Appraisal & Student Feedback',
        titleOm: 'Madaallii Gahumsa Barsiisuu Barsiisotaa',
        title: lang === 'om' ? 'Madaallii Gahumsa Barsiisuu Barsiisotaa' : lang === 'en' ? 'Teacher Appraisal & Student Feedback' : 'የመምህራን የማስተማር ብቃት ምዘና',
        icon: '⭐',
        gradient: 'from-amber-500 to-amber-700',
        desc: lang === 'om' ? 'Madaallii barattootaa fi maatii, fi murtii hoggansa mana barnootaa' : lang === 'en' ? 'Student and parent teacher evaluations and appraisal reports' : 'የተማሪዎችና ወላጆች የመምህራን ግምገማ እና የቢሮ ውሳኔ'
      };
    case 'notices':
      return {
        titleAm: 'የትምህርት ቤት ማስታወቂያ ሰሌዳ',
        titleEn: 'School Notice Board',
        titleOm: 'Gabatee Beeksisa Mana Barnootaa',
        title: lang === 'om' ? 'Gabatee Beeksisa Mana Barnootaa' : lang === 'en' ? 'School Notice Board' : 'የትምህርት ቤት ማስታወቂያ ሰሌዳ',
        icon: '📢',
        gradient: 'from-blue-600 to-sky-800',
        desc: lang === 'om' ? 'Beeksisoota seera-qabeessa mana barnootaa, xalayaa fi waamicha maatii' : lang === 'en' ? 'Official school notices, circulars and parent assemblies' : 'የት/ቤት ይፋዊ ማስታወቂያዎች፣ ሰርኩላርና የወላጅ ጥሪ'
      };
    case 'stakeholders':
      return {
        titleAm: 'ባለድርሻ አካላት & የፋይዳ ማስረጃዎች',
        titleEn: 'Staff Credentials & Fayda National ID',
        titleOm: 'Qaamolee Qooda Fudhattootaa fi Ragaa Faayidaa',
        title: lang === 'om' ? 'Qaamolee Qooda Fudhattootaa fi Ragaa Faayidaa' : lang === 'en' ? 'Staff Credentials & Fayda National ID' : 'ባለድርሻ አካላት & የፋይዳ ማስረጃዎች',
        icon: '🎖️',
        gradient: 'from-emerald-600 to-teal-900',
        desc: lang === 'om' ? 'Waraqaa eenyummaa dijitaalaa, digirii fi eeyyama ogummaa hojjettootaa' : lang === 'en' ? 'Staff digital ID, degree credentials and professional licenses' : 'የመምህራንና ሰራተኞች ዲጂታል መታወቂያ፣ ዲግሪዎችና የሙያ ፈቃድ'
      };
    case 'registrar':
      return {
        titleAm: 'ሬጅስትራር፣ አዳዲስ ቅበላና መዋቅር',
        titleEn: 'Registrar Admissions & Org Structure',
        titleOm: 'Reejistiraara, Simannaa Haaraa fi Caasaa',
        title: lang === 'om' ? 'Reejistiraara, Simannaa Haaraa fi Caasaa' : lang === 'en' ? 'Registrar Admissions & Org Structure' : 'ሬጅስትራር፣ አዳዲስ ቅበላና መዋቅር',
        icon: '📋',
        gradient: 'from-purple-600 to-violet-800',
        desc: lang === 'om' ? 'Barattoota haaraa galmeessuu, daree ramaduu fi waraqaa eenyummaa qopheessuu' : lang === 'en' ? 'New student registration, section allocation and ID cards' : 'አዳዲስ ተማሪዎችን መመዝገብ፣ ክፍል መመደብና መታወቂያ ካርድ'
      };
    case 'codes':
      return {
        titleAm: 'የትምህርት ቤት መግቢያ ኮዶች',
        titleEn: 'School User Access Codes',
        titleOm: 'Koodii Seensaa Mana Barnootaa',
        title: lang === 'om' ? 'Koodii Seensaa Mana Barnootaa' : lang === 'en' ? 'School User Access Codes' : 'የትምህርት ቤት መግቢያ ኮዶች',
        icon: '🔑',
        gradient: 'from-amber-600 to-yellow-800',
        desc: lang === 'om' ? 'Koodii seensaa daarektaraa, barsiisaa, barataa fi maatiif maddisiisuu' : lang === 'en' ? 'Generate access codes for directors, teachers, students and parents' : 'ለዳይሬክተር፣ መምህር፣ ተማሪና ወላጅ የመግቢያ ኮዶች ማመንጫ'
      };
    case 'library_desk':
      return {
        titleAm: 'የትምህርት ቤት ቤተ-መጻሕፍት ክፍል',
        titleEn: 'School Library & Book Lending',
        titleOm: 'Kutaa Mana Dubbisaa (Library)',
        title: lang === 'om' ? 'Kutaa Mana Dubbisaa (Library)' : lang === 'en' ? 'School Library & Book Lending' : 'የትምህርት ቤት ቤተ-መጻሕፍት ክፍል',
        icon: '📖',
        gradient: 'from-blue-700 to-indigo-900',
        desc: lang === 'om' ? 'Kaataaloogii kitaabotaa, galmee ergifannaati fi hordoffii dubbisaa' : lang === 'en' ? 'Book catalog, lending records and reading engagement tracking' : 'የመጻሕፍት ካታሎግ፣ የተውሶ መዝገብና የንባብ ክትትል'
      };
    case 'submit_report':
      return {
        titleAm: 'ይፋዊ ሪፖርት ለትምህርት ቢሮ መላኪያ',
        titleEn: 'Official Report Submission to Bureau',
        titleOm: 'Gabaasa Seera-qabeessa Biiroof Erguu',
        title: lang === 'om' ? 'Gabaasa Seera-qabeessa Biiroof Erguu' : lang === 'en' ? 'Official Report Submission to Bureau' : 'ይፋዊ ሪፖርት ለትምህርት ቢሮ መላኪያ',
        icon: '📤',
        gradient: 'from-emerald-700 to-green-900',
        desc: lang === 'om' ? 'Qabxii barattootaa fi istaatiksii waggaa Biiroo Barnootaatiif erguu' : lang === 'en' ? 'Dispatch academic grades and annual school statistics to Bureau' : 'የትምህርት ዘመኑን የተማሪዎች ውጤትና ስታቲስቲክስ ለቢሮ መላኪያ'
      };
    case 'owner_board':
      return {
        titleAm: 'የትምህርት ቤት ቦርድ አመራር / ባለቤት',
        titleEn: 'School Owner & Board Governance',
        titleOm: 'Hoggansa Boordii Mana Barnootaa / Abbaa Qabeenyaa',
        title: lang === 'om' ? 'Hoggansa Boordii Mana Barnootaa / Abbaa Qabeenyaa' : lang === 'en' ? 'School Owner & Board Governance' : 'የትምህርት ቤት ቦርድ አመራር / ባለቤት',
        icon: '👑',
        gradient: 'from-amber-600 to-orange-900',
        desc: lang === 'om' ? 'Qaxara daarektaraa, murtiilee boordii fi hoggansa olaanaa' : lang === 'en' ? 'Director appointments, board decisions and executive governance' : 'የዳይሬክተር ቅጥር፣ የቦርድ ውሳኔዎችና የበላይ አመራር'
      };
    default:
      return {
        titleAm: 'የትምህርት ቤት ክፍል',
        titleEn: 'School Desk',
        titleOm: 'Kutaa Mana Barnootaa',
        title: lang === 'om' ? 'Kutaa Mana Barnootaa' : lang === 'en' ? 'School Desk' : 'የትምህርት ቤት ክፍል',
        icon: '🏫',
        gradient: 'from-slate-600 to-slate-800',
        desc: ''
      };
  }
};

interface SchoolPortalProps {
  currentLang: Language;
  school: School;
  students: StudentRecord[];
  onStudentsChange: (updated: StudentRecord[]) => void;
  currentUser: AppUserSession | null;
  onNavigateToBureauExams?: () => void;
  onNavigateToTraining?: () => void;
  onSchoolUpdate?: (updatedSchool: School) => void;
  targetSubTab?: SchoolSubTab | null;
  onTargetSubTabConsumed?: () => void;
  isFullscreen?: boolean;
}

export const SchoolPortal: React.FC<SchoolPortalProps> = ({
  currentLang,
  school,
  students,
  onStudentsChange,
  currentUser,
  onNavigateToBureauExams,
  onNavigateToTraining,
  onSchoolUpdate,
  targetSubTab,
  onTargetSubTabConsumed,
  isFullscreen = false
}) => {
  const t = translations[currentLang];

  const [currentSchool, setCurrentSchool] = useState<School>(school);
  // Developer Payment & Bureau Connection Lock State
  const [showDeveloperPaymentModal, setShowDeveloperPaymentModal] = useState<boolean>(false);
  const isBureauConnected = StorageService.isSchoolBureauConnected(currentSchool.id);

  const handleDeveloperPaymentSuccess = (receipt: DeveloperPaymentReceipt) => {
    const allSchools = StorageService.getSchools();
    const updated = allSchools.find((s) => s.id === currentSchool.id);
    if (updated) {
      setCurrentSchool(updated);
      if (onSchoolUpdate) onSchoolUpdate(updated);
    }
  };

  // Desk-only mode: When true or isFullscreen is true, hides bulky headers and shows ONLY the clicked desk/subtab activity!
  const [isDeskOnly, setIsDeskOnly] = useState<boolean>(false);
  useEffect(() => {
    setCurrentSchool(school);
  }, [school]);

  // Strict Role Compartmentalization & Isolation
  // "አንዱ የአንዱን ስራ ሳያይ ሁሉም የየራሳቸውን ስራ እንዲሰሩ"
  const isBureauRole =
    currentUser?.role === 'bureau_admin' || currentUser?.role === 'bureau_staff';

  const isLibrarian =
    currentUser?.staffDepartment?.toLowerCase().includes('library') ||
    currentUser?.staffDepartment?.toLowerCase().includes('መጻሕፍት') ||
    currentUser?.name?.toLowerCase().includes('library') ||
    currentUser?.name?.toLowerCase().includes('ቤተ-መጻሕፍት') ||
    currentUser?.accessCode?.toUpperCase().startsWith('LIB-') ||
    currentUser?.accessCode?.toUpperCase().includes('LIB');

  const getAllowedTabs = (): SchoolSubTab[] => {
    // 1. Librarian: Sees Library Desk, Notice Board, and their own Stakeholder Credentials
    // STRICTLY FORBIDDEN from viewing student marks, finances, registrar admissions, or codes!
    if (isLibrarian) {
      return ['library_desk', 'notices', 'stakeholders'];
    }

    switch (currentUser?.role) {
      case 'school_owner':
        // 2. School Owner / Board Member: Executive Governance, Director Appointments, Notices, Stakeholders, Codes, Bureau Report
        return ['owner_board', 'grade_workflow', 'night_school', 'student_discipline', 'notices', 'stakeholders', 'teacher_evaluations', 'qr_attendance', 'finance', 'codes', 'submit_report'];

      case 'school_director':
        // 3. School Principal / Director: Full Supervisory Authority over all school branches
        return [
          'stakeholders',
          'student_discipline',
          'grade_workflow',
          'night_school',
          'notices',
          'roster',
          'homework_attendance',
          'teacher_training',
          'teacher_evaluations',
          'qr_attendance',
          'finance',
          'registrar',
          'codes',
          'submit_report'
        ];

      case 'teacher':
        // 4. Teacher: Grade Workflow Submission to Homeroom, Homework, Bureau Subject Training, Student Roster (Marking), Notices, Credentials, QR Attendance, Teacher Evaluations, Discipline Tips
        return ['grade_workflow', 'student_discipline', 'night_school', 'homework_attendance', 'teacher_training', 'teacher_evaluations', 'qr_attendance', 'roster', 'notices', 'stakeholders'];

      case 'accountant':
        // 5. Accountant: ONLY Tuition Fee Collection, School Expenses, Financial Balance, Notices
        return ['finance', 'notices'];

      case 'registrar':
        // 6. Registrar: Student Admissions, Student ID Cards, Student Roster, QR Attendance, Notices, Night School Desk
        return ['registrar', 'night_school', 'student_discipline', 'roster', 'qr_attendance', 'notices'];

      case 'student':
        return ['roster', 'student_discipline', 'night_school', 'homework_attendance', 'qr_attendance', 'notices'];

      case 'parent':
        return ['roster', 'student_discipline', 'night_school', 'homework_attendance', 'qr_attendance', 'notices', 'finance'];

      case 'bureau_admin':
      case 'bureau_staff':
        return [
          'stakeholders',
          'owner_board',
          'student_discipline',
          'grade_workflow',
          'night_school',
          'notices',
          'homework_attendance',
          'teacher_training',
          'teacher_evaluations',
          'qr_attendance',
          'finance',
          'registrar',
          'roster',
          'codes',
          'submit_report'
        ];

      default:
        return [
          'stakeholders',
          'student_discipline',
          'grade_workflow',
          'night_school',
          'notices',
          'roster',
          'homework_attendance',
          'teacher_evaluations',
          'qr_attendance',
          'finance',
          'registrar',
          'codes',
          'submit_report'
        ];
    }
  };

  const allowedTabs = getAllowedTabs();

  const getInitialTab = (): SchoolSubTab => {
    if (targetSubTab && (targetSubTab === 'overview' || allowedTabs.includes(targetSubTab))) {
      return targetSubTab;
    }
    return 'overview';
  };

  const [activeSubTab, setActiveSubTab] = useState<SchoolSubTab>(getInitialTab);

  // When role changes, ensure active tab is valid or return to overview
  useEffect(() => {
    if (activeSubTab !== 'overview' && !allowedTabs.includes(activeSubTab)) {
      setActiveSubTab('overview');
    }
  }, [currentUser?.role, currentUser?.accessCode, isLibrarian]);

  useEffect(() => {
    if (targetSubTab && allowedTabs.includes(targetSubTab)) {
      setActiveSubTab(targetSubTab);
      if (onTargetSubTabConsumed) onTargetSubTabConsumed();
    }
  }, [targetSubTab]);

  const [showRoleGuideModal, setShowRoleGuideModal] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Logo upload modal state
  const [showLogoModal, setShowLogoModal] = useState(false);

  // Stakeholders State (School Staff, Library, Leadership, Credentials & Fayda IDs)
  const [stakeholders, setStakeholders] = useState<SchoolStakeholder[]>(() =>
    StorageService.getStakeholders(school.id, school.name)
  );

  useEffect(() => {
    setStakeholders(StorageService.getStakeholders(currentSchool.id, currentSchool.name));
  }, [currentSchool.id, currentSchool.name]);

  const [selectedStakeholderForCert, setSelectedStakeholderForCert] = useState<SchoolStakeholder | null>(null);
  const [editingStakeholder, setEditingStakeholder] = useState<SchoolStakeholder | null>(null);
  const [showStakeholderForm, setShowStakeholderForm] = useState(false);
  const [stakeholderSearchQuery, setStakeholderSearchQuery] = useState('');
  const [stakeholderRoleFilter, setStakeholderRoleFilter] = useState<string>('all');

  const handleSaveStakeholder = (item: SchoolStakeholder) => {
    if (editingStakeholder) {
      StorageService.updateStakeholder(item);
    } else {
      StorageService.addStakeholder(item);
    }
    const updated = StorageService.getStakeholders(currentSchool.id, currentSchool.name);
    setStakeholders(updated);
    setEditingStakeholder(null);

    // Enqueue Teacher Credential for Offline Sync with Education Bureau
    OfflineSyncManager.enqueue(
      'teacher_credential',
      editingStakeholder ? 'update' : 'create',
      item.id,
      item,
      {
        authorName:
          currentUser?.name ||
          (currentLang === 'om'
            ? 'Bulchaa Mana Barumsaa'
            : currentLang === 'en'
            ? 'School Administrator'
            : 'የትምህርት ቤት አስተዳዳሪ'),
        schoolName: currentSchool.name,
        role: item.role,
        description:
          currentLang === 'om'
            ? `Ragaa fi Eenyummaa Fayda kan ${item.fullName} (${item.role})`
            : currentLang === 'en'
            ? `Credentials & Fayda ID record for ${item.fullName} (${item.role})`
            : `የ${item.fullName} (${item.role}) የማስረጃና ፋይዳ ID መረጃ`
      }
    );
  };

  const [confirmDeleteStakeholderId, setConfirmDeleteStakeholderId] = useState<string | null>(null);

  const handleDeleteStakeholder = (id: string) => {
    StorageService.deleteStakeholder(id);
    const updated = StorageService.getStakeholders(currentSchool.id, currentSchool.name);
    setStakeholders(updated);
    setConfirmDeleteStakeholderId(null);
  };

  // User Codes state
  const [schoolCodes, setSchoolCodes] = useState<SchoolUserCode[]>(StorageService.getSchoolCodes());
  const [showAddCodeModal, setShowAddCodeModal] = useState(false);
  const [targetRole, setTargetRole] = useState<
    'school_director' | 'teacher' | 'student' | 'parent' | 'school_owner' | 'accountant' | 'registrar'
  >('teacher');
  const [targetFullName, setTargetFullName] = useState('');
  const [targetAssignment, setTargetAssignment] = useState('');
  const [codeSearchQuery, setCodeSearchQuery] = useState('');
  const [codeRoleFilter, setCodeRoleFilter] = useState<string>('all');

  // Student Search, Grade/Section Filter & Sorting
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentGradeFilter, setStudentGradeFilter] = useState<string>('all');
  const [studentSectionFilter, setStudentSectionFilter] = useState<string>('all');
  const [studentShiftFilter, setStudentShiftFilter] = useState<'all' | 'regular_day' | 'night_shift'>('all');
  const [studentSortBy, setStudentSortBy] = useState<
    | 'rank_asc'
    | 'rank_desc'
    | 'grade_asc'
    | 'grade_desc'
    | 'section_asc'
    | 'section_desc'
    | 'name_asc'
    | 'name_desc'
    | 'score_desc'
    | 'score_asc'
  >('rank_asc');

  // Report Card Modal State
  const [selectedStudentForCard, setSelectedStudentForCard] = useState<StudentRecord | null>(null);
  const [selectedStudentForIdCard, setSelectedStudentForIdCard] = useState<StudentRecord | null>(null);

  // New Student State
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'M' | 'F'>('M');
  const [newStudentGrade, setNewStudentGrade] = useState(10);
  const [newStudentSection, setNewStudentSection] = useState('A');
  const [newStudentShift, setNewStudentShift] = useState<'regular_day' | 'night_shift'>('regular_day');
  const [newStudentOccupation, setNewStudentOccupation] = useState('');
  const [newStudentWorkplace, setNewStudentWorkplace] = useState('');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('+251 9');

  // Submit Report to Bureau State
  const [reportAcademicYear, setReportAcademicYear] = useState('2016 E.C. (2024)');
  const [reportSemester, setReportSemester] = useState<'Semester 1' | 'Semester 2' | 'Annual'>('Semester 1');
  const [reportGradeLevel, setReportGradeLevel] = useState('Grade 10 & 12');
  const [reportSubmittedSuccess, setReportSubmittedSuccess] = useState(false);

  // Copy code helper with visual feedback
  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Handle Logo Save
  const handleSaveLogo = (newLogoUrl: string | undefined) => {
    const updated: School = {
      ...currentSchool,
      logoUrl: newLogoUrl
    };
    setCurrentSchool(updated);
    StorageService.updateSchool(updated);
    if (onSchoolUpdate) {
      onSchoolUpdate(updated);
    }
  };

  // Generate unique access code for school user
  const handleGenerateUserCode = (e: React.FormEvent) => {
    e.preventDefault();

    let prefix = 'TCH';
    if (targetRole === 'school_owner') prefix = 'OWN';
    if (targetRole === 'school_director') prefix = 'DIR';
    if (targetRole === 'accountant') prefix = 'ACC';
    if (targetRole === 'registrar') prefix = 'REG';
    if (targetRole === 'student') prefix = 'STU';
    if (targetRole === 'parent') prefix = 'PAR';

    const rand = Math.floor(100 + Math.random() * 900);
    const shortName = targetFullName.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, 'USR');
    const generated = `${prefix}-${shortName}-${rand}`;

    const newCodeItem: SchoolUserCode = {
      id: `sc-${Date.now()}`,
      schoolId: currentSchool.id,
      schoolName: currentSchool.name,
      role: targetRole,
      fullName: targetFullName,
      accessCode: generated,
      assignedClassOrSubject: targetAssignment,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = StorageService.addSchoolCode(newCodeItem);
    setSchoolCodes(updated);
    setShowAddCodeModal(false);

    // Reset
    setTargetFullName('');
    setTargetAssignment('');
  };

  // Add new student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();

    const short = newStudentName.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, 'STU');
    const rand = Math.floor(10 + Math.random() * 90);
    const studentCode = `STU-${short}-${rand}`;
    const parentCode = `PAR-${short}-${rand}`;

    const defaultScores: StudentScore[] = [
      { subject: 'Mathematics (ሂሳብ)', quiz1: 9, quiz2: 9, midExam: 27, finalExam: 47, total: 92, gradeLetter: 'A' },
      { subject: 'English (እንግሊዝኛ)', quiz1: 9, quiz2: 9, midExam: 26, finalExam: 46, total: 90, gradeLetter: 'A' },
      { subject: 'Afaan Oromoo (ኦሮሚኛ)', quiz1: 10, quiz2: 10, midExam: 28, finalExam: 48, total: 96, gradeLetter: 'A' },
      { subject: 'Physics (ፊዚክስ)', quiz1: 8, quiz2: 9, midExam: 25, finalExam: 43, total: 85, gradeLetter: 'A' },
      { subject: 'Chemistry (ኬሚስትሪ)', quiz1: 9, quiz2: 8, midExam: 26, finalExam: 44, total: 87, gradeLetter: 'A' },
      { subject: 'Biology (ባዮሎጂ)', quiz1: 9, quiz2: 9, midExam: 27, finalExam: 45, total: 90, gradeLetter: 'A' },
      { subject: 'Citizenship (ስነ-ዜጋ)', quiz1: 10, quiz2: 9, midExam: 28, finalExam: 47, total: 94, gradeLetter: 'A' }
    ];

    const isNight = newStudentShift === 'night_shift';
    const assignedSection = isNight && !newStudentSection.toUpperCase().startsWith('N') ? `N${newStudentSection}` : newStudentSection;
    const studentIdNum = isNight
      ? `SHAS-NG${newStudentGrade}-${Math.floor(100 + Math.random() * 900)}`
      : `SHAS-ST-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newRec: StudentRecord = {
      id: `stu-${Date.now()}`,
      schoolId: currentSchool.id,
      schoolName: currentSchool.name,
      studentIdNumber: studentIdNum,
      fullName: newStudentName,
      gender: newStudentGender,
      grade: Number(newStudentGrade),
      section: assignedSection,
      accessCode: studentCode,
      parentName: newParentName,
      parentPhone: newParentPhone,
      parentAccessCode: parentCode,
      attendanceRate: 95,
      conduct: 'A',
      rank: students.length + 1,
      shift: newStudentShift,
      nightProgramType: isNight ? 'secondary_night' : undefined,
      occupation: isNight
        ? newStudentOccupation.trim() ||
          (currentLang === 'om'
            ? 'Hojii Dhuunfaa (Self-Employed)'
            : currentLang === 'en'
            ? 'Self-Employed'
            : 'የግል ስራ (Self-Employed)')
        : undefined,
      workplace: isNight
        ? newStudentWorkplace.trim() ||
          (currentLang === 'om' || currentLang === 'en' ? 'Shashemene' : 'ሻሸመኔ')
        : undefined,
      shiftSchedule: isNight
        ? currentLang === 'om'
          ? 'Wiixata - Jimaata | 11:30 - 3:00 Galgala'
          : currentLang === 'en'
          ? 'Mon - Fri | 5:30 - 9:00 PM (Night)'
          : 'ሰኞ - አርብ | 11:30 - 3:00 ማታ'
        : currentLang === 'om'
        ? 'Wiixata - Jimaata | 2:00 - 9:00 Guyyaa'
        : currentLang === 'en'
        ? 'Mon - Fri | 8:00 AM - 3:00 PM (Day)'
        : 'ሰኞ - አርብ | 2:00 - 9:00 ቀን',
      emergencyContact: newParentPhone.trim(),
      scores: defaultScores
    };

    const updated = StorageService.addStudent(newRec);
    onStudentsChange(updated);
    setShowAddStudentModal(false);
    setNewStudentName('');
    setNewStudentOccupation('');
    setNewStudentWorkplace('');
    setNewParentName('');

    // Enqueue Student Performance for Offline Sync
    OfflineSyncManager.enqueue(
      'student_performance',
      'create',
      newRec.id,
      newRec,
      {
        authorName:
          currentUser?.name ||
          (currentLang === 'om'
            ? 'Bulchaa Mana Barumsaa'
            : currentLang === 'en'
            ? 'School Administrator'
            : 'የትምህርት ቤት አስተዳዳሪ'),
        schoolName: currentSchool.name,
        description:
          currentLang === 'om'
            ? `Odeeffannoo galmee fi qabxii barataa ${newRec.fullName} (Kutaa ${newRec.grade}${newRec.section})`
            : currentLang === 'en'
            ? `Enrollment and grade record for ${newRec.fullName} (Grade ${newRec.grade}${newRec.section})`
            : `የተማሪ ${newRec.fullName} (ክፍል ${newRec.grade}${newRec.section}) የውጤትና ምዝገባ መረጃ`
      }
    );

    // Also add access code entries to schoolCodes for instant login
    StorageService.addSchoolCode({
      id: `sc-stu-${Date.now()}`,
      schoolId: currentSchool.id,
      schoolName: currentSchool.name,
      role: 'student',
      fullName: newStudentName,
      accessCode: studentCode,
      assignedClassOrSubject: `Grade ${newStudentGrade}${newStudentSection}`,
      createdAt: new Date().toISOString().split('T')[0]
    });

    StorageService.addSchoolCode({
      id: `sc-par-${Date.now()}`,
      schoolId: currentSchool.id,
      schoolName: currentSchool.name,
      role: 'parent',
      fullName: newParentName,
      accessCode: parentCode,
      assignedClassOrSubject: `Parent of ${newStudentName}`,
      createdAt: new Date().toISOString().split('T')[0]
    });

    setSchoolCodes(StorageService.getSchoolCodes());
    setNewStudentName('');
    setNewParentName('');
  };

  // Submit official report to Bureau
  const handleSubmitReportToBureau = (e: React.FormEvent) => {
    e.preventDefault();

    if (!StorageService.isSchoolBureauConnected(currentSchool.id)) {
      setShowDeveloperPaymentModal(true);
      return;
    }

    const totalStudents = students.length;
    const avgScore =
      students.length > 0
        ? Math.round(
            students.reduce((acc, s) => {
              const avg = s.scores.reduce((a, b) => a + b.total, 0) / Math.max(s.scores.length, 1);
              return acc + avg;
            }, 0) / students.length
          )
        : 85;

    const newReport: SchoolReportSubmission = {
      id: `rep-${Date.now()}`,
      schoolId: currentSchool.id,
      schoolName: currentSchool.name,
      academicYear: reportAcademicYear,
      semester: reportSemester,
      gradeLevel: reportGradeLevel,
      totalStudents: totalStudents || currentSchool.totalStudents,
      malePassed: Math.round((totalStudents || currentSchool.totalStudents) * 0.48),
      femalePassed: Math.round((totalStudents || currentSchool.totalStudents) * 0.46),
      promotedPercentage: 94.2,
      averageScore: avgScore,
      topStudentName:
        students[0]?.fullName ||
        (currentLang === 'om'
          ? 'Kiyaar Kadir Alii'
          : currentLang === 'en'
          ? 'Kiyar Kedir Ali'
          : 'ኪያር ከድር አሊ'),
      topStudentScore: 98.4,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'submitted'
    };

    StorageService.addReport(newReport);
    setReportSubmittedSuccess(true);
    setTimeout(() => setReportSubmittedSuccess(false), 4000);
  };

  const localizedSchoolCodes = useMemo(
    () => getLocalizedSchoolCodes(schoolCodes, currentLang),
    [schoolCodes, currentLang]
  );

  // Filter school codes for this school
  const currentSchoolCodes = localizedSchoolCodes.filter(
    (c) => c.schoolId === currentSchool.id || c.schoolName === currentSchool.name
  );

  const filteredSchoolCodes = currentSchoolCodes.filter((item) => {
    const matchSearch =
      codeSearchQuery.trim() === '' ||
      item.fullName.toLowerCase().includes(codeSearchQuery.toLowerCase()) ||
      item.accessCode.toLowerCase().includes(codeSearchQuery.toLowerCase()) ||
      item.assignedClassOrSubject.toLowerCase().includes(codeSearchQuery.toLowerCase());

    const matchRole = codeRoleFilter === 'all' || item.role === codeRoleFilter;
    return matchSearch && matchRole;
  });

  // Distinct available grades across students in this school
  const availableGrades = useMemo(() => {
    const gradesSet = new Set<number>();
    students.forEach((s) => {
      if (s.grade) gradesSet.add(s.grade);
    });
    return Array.from(gradesSet).sort((a, b) => a - b);
  }, [students]);

  // Distinct available sections (either within selected grade or across all)
  const availableSections = useMemo(() => {
    const sectionsSet = new Set<string>();
    students.forEach((s) => {
      if (studentGradeFilter === 'all' || s.grade.toString() === studentGradeFilter) {
        if (s.section && s.section.trim()) {
          sectionsSet.add(s.section.trim().toUpperCase());
        }
      }
    });
    return Array.from(sectionsSet).sort();
  }, [students, studentGradeFilter]);

  // Student counts per grade
  const studentCountsByGrade = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach((s) => {
      const g = s.grade.toString();
      counts[g] = (counts[g] || 0) + 1;
    });
    return counts;
  }, [students]);

  // Student counts per section
  const studentCountsBySection = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach((s) => {
      if (studentGradeFilter === 'all' || s.grade.toString() === studentGradeFilter) {
        const sec = s.section ? s.section.trim().toUpperCase() : '';
        if (sec) {
          counts[sec] = (counts[sec] || 0) + 1;
        }
      }
    });
    return counts;
  }, [students, studentGradeFilter]);

  // Night and Day student counts
  const nightStudentsCount = useMemo(() => {
    return students.filter(
      (s) =>
        s.shift === 'night_shift' ||
        s.section?.toUpperCase().startsWith('N') ||
        s.nightProgramType !== undefined
    ).length;
  }, [students]);

  const dayStudentsCount = useMemo(() => {
    return students.filter(
      (s) =>
        s.shift !== 'night_shift' &&
        !s.section?.toUpperCase().startsWith('N')
    ).length;
  }, [students]);

  // Filter and sort students with Grade, Section, Search & Sort
  const filteredStudents = useMemo(() => {
    const q = studentSearchQuery.trim().toLowerCase();
    const result = students.filter((st) => {
      const matchSearch =
        q === '' ||
        st.fullName.toLowerCase().includes(q) ||
        st.accessCode.toLowerCase().includes(q) ||
        st.parentName.toLowerCase().includes(q) ||
        st.studentIdNumber.toLowerCase().includes(q) ||
        st.section.toLowerCase().includes(q) ||
        `grade ${st.grade}`.includes(q) ||
        `ክፍል ${st.grade}`.includes(q);

      const matchGrade =
        studentGradeFilter === 'all' || st.grade.toString() === studentGradeFilter;

      const matchSection =
        studentSectionFilter === 'all' ||
        (st.section && st.section.trim().toUpperCase() === studentSectionFilter.toUpperCase());

      const matchShift =
        studentShiftFilter === 'all' ||
        (studentShiftFilter === 'night_shift'
          ? st.shift === 'night_shift' || st.section?.toUpperCase().startsWith('N')
          : st.shift !== 'night_shift' && !st.section?.toUpperCase().startsWith('N'));

      return matchSearch && matchGrade && matchSection && matchShift;
    });

    const getAvg = (s: StudentRecord) =>
      s.scores.length > 0 ? s.scores.reduce((a, b) => a + b.total, 0) / s.scores.length : 0;

    return [...result].sort((a, b) => {
      switch (studentSortBy) {
        case 'rank_asc':
          return a.rank - b.rank;
        case 'rank_desc':
          return b.rank - a.rank;
        case 'grade_asc': {
          const diff = a.grade - b.grade;
          if (diff !== 0) return diff;
          const sDiff = a.section.localeCompare(b.section);
          return sDiff !== 0 ? sDiff : a.rank - b.rank;
        }
        case 'grade_desc': {
          const diff = b.grade - a.grade;
          if (diff !== 0) return diff;
          const sDiff = a.section.localeCompare(b.section);
          return sDiff !== 0 ? sDiff : a.rank - b.rank;
        }
        case 'section_asc': {
          const sDiff = a.section.localeCompare(b.section);
          if (sDiff !== 0) return sDiff;
          const diff = a.grade - b.grade;
          return diff !== 0 ? diff : a.rank - b.rank;
        }
        case 'section_desc': {
          const sDiff = b.section.localeCompare(a.section);
          if (sDiff !== 0) return sDiff;
          const diff = a.grade - b.grade;
          return diff !== 0 ? diff : a.rank - b.rank;
        }
        case 'name_asc':
          return a.fullName.localeCompare(b.fullName);
        case 'name_desc':
          return b.fullName.localeCompare(a.fullName);
        case 'score_desc':
          return getAvg(b) - getAvg(a);
        case 'score_asc':
          return getAvg(a) - getAvg(b);
        default:
          return a.rank - b.rank;
      }
    });
  }, [students, studentSearchQuery, studentGradeFilter, studentSectionFilter, studentShiftFilter, studentSortBy]);

  const resetStudentFilters = () => {
    setStudentSearchQuery('');
    setStudentGradeFilter('all');
    setStudentSectionFilter('all');
    setStudentShiftFilter('all');
    setStudentSortBy('rank_asc');
  };

  // Filter stakeholders with Strict Role Isolation
  // "አንዱ የአንዱን ስራ ሳያይ ሁሉም የየራሳቸውን ስራ እንዲሰሩ"
  const isTeacherUser = currentUser?.role === 'teacher';
  const isLibrarianUser = isLibrarian;
  // Bureau role has strictly read-only inspection authority: "ትምህርት ቢሮ ከትምህርት ቤት የሚላኩ ማንኛውም መረጃወች ማየት ብቻ ማሻሻል ማስተካከል አይቻልም"
  const canManageStaff =
    !isBureauRole &&
    (currentUser?.role === 'school_owner' ||
      currentUser?.role === 'school_director' ||
      currentUser?.role === 'school_admin');

  const localizedStakeholders = useMemo(
    () => getLocalizedStakeholders(stakeholders, currentLang),
    [stakeholders, currentLang]
  );

  const currentSchoolStakeholders = localizedStakeholders.filter(
    (s) => s.schoolId === currentSchool.id || s.schoolName === currentSchool.name
  );

  const roleScopedStakeholders = currentSchoolStakeholders.filter((s) => {
    if (isTeacherUser) {
      return (
        (currentUser?.accessCode && s.accessCode?.trim().toUpperCase() === currentUser.accessCode.trim().toUpperCase()) ||
        (currentUser?.identifier && s.id === currentUser.identifier) ||
        (currentUser?.name && s.fullName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0]))
      );
    }
    if (isLibrarianUser) {
      return (
        (currentUser?.accessCode && s.accessCode?.trim().toUpperCase() === currentUser.accessCode.trim().toUpperCase()) ||
        (currentUser?.identifier && s.id === currentUser.identifier) ||
        (currentUser?.name && s.fullName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])) ||
        s.role === 'head_librarian' ||
        s.officeOrDepartment.includes('ቤተ-መጻሕፍት')
      );
    }
    return true;
  });

  const filteredStakeholders = roleScopedStakeholders.filter((item) => {
    const q = stakeholderSearchQuery.trim().toLowerCase();
    const matchSearch =
      q === '' ||
      item.fullName.toLowerCase().includes(q) ||
      item.officeOrDepartment.toLowerCase().includes(q) ||
      item.faydaNumber.toLowerCase().includes(q) ||
      (item.roleCustomTitle && item.roleCustomTitle.toLowerCase().includes(q)) ||
      (item.credentials &&
        item.credentials.some(
          (c) =>
            c.fieldOfStudy.toLowerCase().includes(q) ||
            c.institution.toLowerCase().includes(q) ||
            c.level.toLowerCase().includes(q)
        ));

    if (!matchSearch) return false;

    if (stakeholderRoleFilter === 'all') return true;
    if (stakeholderRoleFilter === 'library') {
      return (
        item.role === 'head_librarian' ||
        item.officeOrDepartment.includes('ቤተ-መጻሕፍት') ||
        item.officeOrDepartment.includes('Library')
      );
    }
    if (stakeholderRoleFilter === 'leadership') {
      return (
        item.role === 'principal' ||
        item.role === 'vice_principal_academic' ||
        item.role === 'vice_principal_admin' ||
        item.role === 'school_owner_board'
      );
    }
    if (stakeholderRoleFilter === 'academic') {
      return (
        item.role === 'teacher' ||
        item.role === 'department_head' ||
        item.role === 'lab_technician'
      );
    }
    if (stakeholderRoleFilter === 'support') {
      return (
        item.role === 'registrar_finance' ||
        item.role === 'guidance_counselor' ||
        item.role === 'pta_chair' ||
        item.role === 'student_council_leader'
      );
    }
    return item.role === stakeholderRoleFilter;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* =========================================================================
          🌟 BUREAU READ-ONLY INSPECTION BANNER:
          "ትምህርት ቢሮ ከትምህርት ቤት የሚላኩ ማንኛውም መረጃወች ማየት ብቻ ማሻሻል ማስተካከል አይቻልም"
         ========================================================================= */}
      {isBureauRole && (
        <div className="bg-amber-50/95 border-2 border-amber-400 rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-amber-950 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <div className="p-2.5 rounded-2xl bg-amber-200 text-amber-950 shrink-0 shadow-xs border border-amber-300">
              <Eye className="w-6 h-6 text-amber-950" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-amber-950 tracking-tight">
                  {currentLang === 'om'
                    ? '🏛️ Mul’ata To’annoo Biiroo Barnootaa Shaashamannee (Bureau Read-Only Mode)'
                    : currentLang === 'en'
                    ? '🏛️ Shashemene Education Bureau Supervisory View (Read-Only Mode)'
                    : '🏛️ የሻሸመኔ ከተማ ትምህርት ቢሮ የቁጥጥር እይታ (Bureau Read-Only Mode)'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-amber-300 text-amber-950 border border-amber-500 font-black uppercase tracking-wider">
                  {currentLang === 'om'
                    ? 'Ilaaluu Qofa · Read-Only'
                    : currentLang === 'en'
                    ? 'Read-Only View'
                    : 'ማየት ብቻ · Read-Only'}
                </span>
              </div>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                {currentLang === 'om' ? (
                  <>
                    Biiroon Barnootaa odeeffannoo manneen barnootaa irraa ergamu (barattoota, hojjettoota, qabxii, faayinaansii fi bulchiinsa) <strong>ilaaluu qofa</strong> danda’a. Odeeffannoo jijjiiruun, sirreessuun, galmeessuun ykn haquun dhorkaa dha; aangoon sun bulchitoota mana barumsaa qofaaf kennameera.
                  </>
                ) : currentLang === 'en' ? (
                  <>
                    The Education Bureau has <strong>read-only access</strong> to all school records (students, staff, grades, finance, and administration). Modifying, editing, registering, or deleting records is restricted exclusively to authorized school administrators.
                  </>
                ) : (
                  <>
                    የትምህርት ቢሮ ከትምህርት ቤት የሚላኩ ማንኛውንም መረጃዎች (የተማሪዎች፣ የሰራተኞች፣ የውጤት፣ የፋይናንስና አስተዳደራዊ መረጃዎች) <strong>ማየት ብቻ</strong> ይችላል። መረጃዎችን ማሻሻል፣ ማስተካከል፣ መመዝገብ ወይም መሰረዝ በጥብቅ የተከለከለ ሲሆን ስልጣኑ የትምህርት ቤቱ አስተዳዳሪዎች ብቻ ነው።
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-200/90 rounded-xl text-xs font-black text-amber-950 border border-amber-400/80 shrink-0 self-start md:self-auto shadow-2xs">
            <Lock className="w-4 h-4 text-amber-900" />
            <span>
              {currentLang === 'om'
                ? 'Odeeffannoo Jijjiiruun Hin Danda’amu'
                : currentLang === 'en'
                ? 'Editing Restricted'
                : 'መረጃ መቀየር አይቻልም'}
            </span>
          </div>
        </div>
      )}

      {/* =========================================================================
          FOCUSED DESK MODE:
          "የትምህርት ቤት ገፅ ላይ ማንኛውም በተን ሲነካ የተነካው በተን የሚሰራውን ሥራ ብቻ እስክሪን ላይ እንዲታይ አርገው"
          When activeSubTab !== 'overview', display ONLY the Focused Desk Header Bar.
          The clicked desk takes 100% of the screen ("የተነካው በተን የሚሰራውን ስራ ብቻ").
          When activeSubTab === 'overview', display the School Profile Hero, License,
          Role matrix, and the Department Launchpad Grid of all available buttons.
         ========================================================================= */}
      {activeSubTab !== 'overview' ? (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-3 sm:p-4 shadow-lg border border-slate-700/80 flex flex-wrap items-center justify-between gap-3 sticky top-1 z-30 backdrop-blur-md">
          {/* Left: Back Button & Desk Indicator */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0">
            <button
              type="button"
              onClick={() => setActiveSubTab('overview')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 shrink-0"
              title={
                currentLang === 'om'
                  ? 'Gara Baafataatti Deebi’i'
                  : currentLang === 'en'
                  ? 'Back to Launchpad'
                  : 'ወደ ዋናው ማውጫ ተመለስ'
              }
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                {currentLang === 'om'
                  ? '« Gara Baafataatti Deebi’i'
                  : currentLang === 'en'
                  ? '« Back to Launchpad'
                  : '« ወደ ዋናው ማውጫ ተመለስ'}
              </span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-emerald-500/30">
              <span className="text-lg sm:text-xl shrink-0">
                {getDeskInfo(activeSubTab, currentLang).icon}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    {currentLang === 'om'
                      ? 'Hojii Filatame፦'
                      : currentLang === 'en'
                      ? 'Active Desk:'
                      : 'የተከፈተው ስራ፦'}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white truncate">
                    {getDeskInfo(activeSubTab, currentLang).title}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 hidden md:block truncate max-w-md">
                  {getDeskInfo(activeSubTab, currentLang).desc}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Quick Switcher Dropdown, School Mini Badge & Controls */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {/* Quick Switcher Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1">
              <span className="text-[11px] font-semibold text-slate-400 hidden lg:inline">
                {currentLang === 'om'
                  ? 'Kutaa Jijjiiri:'
                  : currentLang === 'en'
                  ? 'Switch Desk:'
                  : 'ክፍል ቀይር:'}
              </span>
              <select
                value={activeSubTab}
                onChange={(e) => setActiveSubTab(e.target.value as SchoolSubTab)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer py-1 max-w-[150px] sm:max-w-[200px] truncate"
              >
                <option value="overview" className="bg-slate-900 text-emerald-300 font-bold">
                  🏠{' '}
                  {currentLang === 'om'
                    ? 'Baafata Olaanaa (Launchpad)'
                    : currentLang === 'en'
                    ? 'Main Launchpad'
                    : 'ዋናው ማውጫ (Launchpad)'}
                </option>
                {allowedTabs.map((tab) => {
                  const desk = getDeskInfo(tab, currentLang);
                  return (
                    <option key={tab} value={tab} className="bg-slate-900 text-white">
                      {desk.icon} {desk.title}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* School Mini Logo & Name */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-800/60 border border-slate-700/80">
              <SchoolLogo
                logoUrl={currentSchool.logoUrl}
                schoolName={currentSchool.name}
                size={26}
                shape="rounded"
                className="shrink-0"
              />
              <span className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">{currentSchool.name}</span>
            </div>

            {/* Desk Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsDeskOnly(!isDeskOnly)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
              title={
                isDeskOnly
                  ? currentLang === 'om'
                    ? 'Mul’ata Idilee'
                    : currentLang === 'en'
                    ? 'Standard View'
                    : 'መደበኛ እይታ'
                  : currentLang === 'om'
                  ? 'Kutaa Guddisi'
                  : currentLang === 'en'
                  ? 'Expand Desk'
                  : 'ክፍሉን አጉላ'
              }
            >
              {isDeskOnly ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* =========================================================================
              1. School Profile Hero Banner (Responsive Mobile & Desktop, With Logo)
             ========================================================================= */}
          <div className="bg-gradient-to-br from-teal-950 via-emerald-900 to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden border border-emerald-500/30">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          {/* Logo + Identity */}
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            {/* School Profile Logo with Click-to-Upload Overlay */}
            <div className="relative group shrink-0">
              <SchoolLogo
                logoUrl={currentSchool.logoUrl}
                schoolName={currentSchool.name}
                size={70}
                shape="rounded"
                className="ring-3 ring-amber-400/80 shadow-xl cursor-pointer"
              />
              {!isBureauRole && (
                <button
                  type="button"
                  onClick={() => setShowLogoModal(true)}
                  className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold cursor-pointer"
                  title={currentLang === 'om' ? 'Asxaa Jijjiiri / Fe\'i' : currentLang === 'en' ? 'Change / Upload Logo' : 'አርማ ቀይር / ጫን'}
                >
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span>{currentLang === 'om' ? 'Jijjiiri' : currentLang === 'en' ? 'Change' : 'ቀይር'}</span>
                </button>
              )}
            </div>

            {/* School Meta Info */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="text-[10px] font-bold uppercase bg-emerald-700/70 text-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  {currentSchool.type} · {currentSchool.level}
                </span>
                <span className="text-[10px] font-medium text-emerald-200 bg-white/10 px-2 py-0.5 rounded-full">
                  {currentSchool.subcity}
                </span>
                {currentSchool.inspectionLevel && (
                  <span className="text-[10px] font-bold text-amber-200 bg-amber-900/60 px-2 py-0.5 rounded-full border border-amber-400/40">
                    {currentSchool.inspectionLevel.replace('_', ' ').toUpperCase()}
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-white leading-tight">
                {currentSchool.name}
              </h2>

              {currentSchool.nameOm && (
                <p className="text-[11px] sm:text-xs text-emerald-200/90 font-medium italic truncate mt-0.5">
                  {currentSchool.nameOm}
                </p>
              )}

              {/* School Details Bar */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-emerald-100 mt-2">
                <span>
                  {currentLang === 'om' ? 'Daarektara:' : currentLang === 'en' ? 'Principal:' : 'ርዕሰ መምህር፡'}{' '}
                  <strong className="text-white">{currentSchool.principalName}</strong>
                </span>
                <span>·</span>
                <span>
                  {currentLang === 'om' ? 'Bilbila:' : currentLang === 'en' ? 'Phone:' : 'ስልክ፡'}{' '}
                  <strong className="text-white font-mono">{currentSchool.phone}</strong>
                </span>
                <span>·</span>
                <div className="inline-flex items-center gap-1">
                  <span>{currentLang === 'om' ? 'Koodii:' : currentLang === 'en' ? 'Code:' : 'ኮድ፡'}</span>
                  <button
                    type="button"
                    onClick={() => copyCode(currentSchool.accessCode, 'school-access-code')}
                    className="font-mono bg-black/40 hover:bg-black/60 px-2 py-0.5 rounded font-bold text-amber-300 border border-amber-400/40 inline-flex items-center gap-1 transition-colors cursor-pointer"
                    title={currentLang === 'om' ? 'Koodii waraabi' : currentLang === 'en' ? 'Copy code' : 'ኮድ ቅዳ'}
                  >
                    <span>{currentSchool.accessCode}</span>
                    {copiedCodeId === 'school-access-code' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-start sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-800/60">
            {/* Upload Logo Button - School Admin Only */}
            {!isBureauRole && (
              <button
                type="button"
                onClick={() => setShowLogoModal(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold rounded-xl border border-amber-400/40 transition-colors shadow-xs cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>
                  {currentLang === 'om' ? 'Asxaa Fe\'i' : currentLang === 'en' ? 'Upload Logo' : 'አርማ ጫን'}
                </span>
              </button>
            )}

            {onNavigateToBureauExams && (
              <button
                type="button"
                onClick={onNavigateToBureauExams}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-emerald-700/70 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl border border-emerald-500/40 transition-colors cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>
                  {currentLang === 'om'
                    ? 'Qormaata Barsiisotaa'
                    : currentLang === 'en'
                    ? 'Teacher Exams'
                    : 'የመምህራን ፈተና'}
                </span>
              </button>
            )}

            {onNavigateToTraining && (
              <button
                type="button"
                onClick={onNavigateToTraining}
                className="hidden xs:inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-teal-800/80 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl border border-teal-600/30 transition-colors cursor-pointer"
              >
                <span>
                  {currentLang === 'om'
                    ? 'Sanadoota Leenjii'
                    : currentLang === 'en'
                    ? 'Training Docs'
                    : 'የስልጠና ሰነዶች'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          1b. Developer License & City Education Bureau Connection Gate Banner
         ========================================================================= */}
      <div
        className={`rounded-2xl p-3.5 sm:p-4 border transition-all ${
          isBureauConnected
            ? 'bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border-emerald-500/50 text-emerald-100 shadow-sm'
            : currentSchool.developerPaymentStatus === 'receipt_submitted'
            ? 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-amber-500/60 text-amber-100 shadow-md animate-pulse'
            : currentSchool.developerPaymentStatus === 'rejected'
            ? 'bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80 border-rose-500/60 text-rose-100 shadow-md'
            : 'bg-gradient-to-r from-amber-950/90 via-slate-900 to-rose-950/90 border-amber-500/60 text-white shadow-md'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                isBureauConnected
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : currentSchool.developerPaymentStatus === 'receipt_submitted'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {isBureauConnected ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : (
                <Lock className="w-5 h-5 text-amber-300" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-white">
                  {isBureauConnected
                    ? currentLang === 'om'
                      ? '✅ Biiroo Barnootaa Bulchiinsa Magaalaa Shaashamannee wajjin walqabateera (Eeyyama Seera-qabeessa)'
                      : currentLang === 'en'
                      ? '✅ Connected to Shashemene City Education Bureau (Official License)'
                      : '✅ ከሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ ጋር የተገናኘ (ኦፊሴላዊ ፈቃድ)'
                    : currentSchool.developerPaymentStatus === 'receipt_submitted'
                    ? currentLang === 'om'
                      ? '📩 Nagaheen kaffaltii dhiyaateera (Mirkaneessa Misoosituu eeggataa jira)'
                      : currentLang === 'en'
                      ? '📩 Payment Receipt Submitted (Pending Developer Verification)'
                      : '📩 የክፍያ ደረሰኝ ቀርቧል (የአበልፃጊ ማረጋገጫ በመጠባበቅ ላይ)'
                    : currentSchool.developerPaymentStatus === 'rejected'
                    ? currentLang === 'om'
                      ? '❌ Nagaheen baankii fudhatama hin arganne (Maaloo irra-deebi\'aa ergaa)'
                      : currentLang === 'en'
                      ? '❌ Bank Receipt Rejected (Please Resubmit)'
                      : '❌ የባንክ ደረሰኝ ውድቅ ተደርጓል (እባክዎ ደግመው ይላኩ)'
                    : currentLang === 'om'
                    ? '🔒 Walitti-dhufeenyi Biiroo Barnootaa hin banamne (Eeyyama hin mirkanoofne)'
                    : currentLang === 'en'
                    ? '🔒 Bureau Connection Locked (Unverified License)'
                    : '🔒 የትምህርት ቢሮ ግንኙነት አልተከፈተም (ያልተረጋገጠ ፈቃድ)'}
                </span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider ${
                    isBureauConnected
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : currentSchool.developerPaymentStatus === 'receipt_submitted'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : currentSchool.developerPaymentStatus === 'rejected'
                      ? 'bg-rose-500 text-white font-bold'
                      : 'bg-rose-600 text-white font-bold'
                  }`}
                >
                  {isBureauConnected ? 'Bureau Connected' : 'Bureau Locked'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {isBureauConnected
                  ? currentLang === 'om'
                    ? 'Manni barnootaa eeyyama misoosituu sirnichaa waan guuteef gabaasa barattootaa, mirkaneessa qabxii fi ragaalee seera-qabeessa gara Biiroo Barnootaa Shaashamanneetti kallattiin erguu danda\'a.'
                    : currentLang === 'en'
                    ? 'School is fully licensed; official report dispatch and exam synchronizations to City Education Bureau are fully active.'
                    : 'ትምህርት ቤቱ የሲስተም አበልፃጊውን ፈቃድ በማሟላቱ ወደ ሻሸመኔ ትምህርት ቢሮ የተማሪዎች ሪፖርት፣ የውጤት ይሁንታና ኦፊሴላዊ መረጃዎችን በቀጥታ መለዋወጥ ይችላል።'
                  : currentLang === 'om'
                  ? 'Manni barnootaa galmee barattootaa fi qooda-fudhattootaa erga xumuree booda beekamtii argachuuf baankii kaffaltee nagahee ergaa.'
                  : currentLang === 'en'
                  ? 'After completing registrations, submit banking payment receipt for developer license activation to connect with the City Education Bureau.'
                  : 'ትምህርት ቤቱ የተማሪዎችን እና የባለድርሻ አካላትን ምዝገባ ካጠናቀቀ በኋላ ለእውቅና ወደ ትምህርት ቢሮ መረጃ ለመላክ ለሲስተም አበልፃጊ (ታምራት ዓለ) በባንክ ፈጽመው ደረሰኝ ይላኩ። በአበልፃጊው ሲረጋገጥ ግንኙነቱ በራስ-ሰር ይከፈታል።'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDeveloperPaymentModal(true)}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
              isBureauConnected
                ? 'bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600/40'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>
              {isBureauConnected
                ? currentLang === 'om'
                  ? 'Nagahee Eeyyamaa fi Kaffaltii'
                  : currentLang === 'en'
                  ? 'License & Payment Receipt'
                  : 'የፈቃድ እና ክፍያ ደረሰኝ'
                : currentLang === 'om'
                ? '💳 Kaffaltii Raawwadhaatii Nagahee Ergaa'
                : currentLang === 'en'
                ? '💳 Pay & Submit Receipt'
                : '💳 ክፍያ ፈፅመው ደረሰኝ ይላኩ'}
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. Active User Role Banner with Strict Role-Based Compartmentalization
         ========================================================================= */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-2xl p-3 sm:p-4 text-white shadow-md border border-emerald-700/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
            {isLibrarian ? (
              <BookOpen className="w-5 h-5 text-blue-300" />
            ) : currentUser?.role === 'school_owner' ? (
              <Crown className="w-5 h-5 text-amber-300" />
            ) : currentUser?.role === 'school_director' ? (
              <Building2 className="w-5 h-5 text-teal-300" />
            ) : currentUser?.role === 'teacher' ? (
              <GraduationCap className="w-5 h-5 text-emerald-300" />
            ) : currentUser?.role === 'accountant' ? (
              <DollarSign className="w-5 h-5 text-amber-300" />
            ) : currentUser?.role === 'registrar' ? (
              <ClipboardList className="w-5 h-5 text-blue-300" />
            ) : (
              <Shield className="w-5 h-5 text-amber-300" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white truncate">
                {currentUser?.name ||
                  (currentLang === 'om'
                    ? 'Bulchaa M/Barnootaa (School Admin)'
                    : currentLang === 'en'
                    ? 'School Admin'
                    : 'የትምህርት ቤት አስተዳዳሪ (School Admin)')}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                {isLibrarian
                  ? currentLang === 'om'
                    ? '📚 Mana Kitaabaa'
                    : currentLang === 'en'
                    ? '📚 Librarian'
                    : '📚 የቤተ-መጻሕፍት ኃላፊ'
                  : currentUser?.role === 'school_owner'
                  ? currentLang === 'om'
                    ? '👑 Abbaa Qabeenyaa / Boordii'
                    : currentLang === 'en'
                    ? '👑 Owner / Board'
                    : '👑 ባለቤት / የቦርድ ሰብሳቢ'
                  : currentUser?.role === 'school_director'
                  ? currentLang === 'om'
                    ? '🏫 Daarektara Olaanaa'
                    : currentLang === 'en'
                    ? '🏫 Principal'
                    : '🏫 ዋና ዳይሬክተር'
                  : currentUser?.role === 'teacher'
                  ? currentLang === 'om'
                    ? '👨‍🏫 Barsiisaa'
                    : currentLang === 'en'
                    ? '👨‍🏫 Teacher'
                    : '👨‍🏫 መምህር'
                  : currentUser?.role === 'accountant'
                  ? currentLang === 'om'
                    ? '💵 Faayinaansii'
                    : currentLang === 'en'
                    ? '💵 Accountant'
                    : '💵 ሒሳብ ሰራተኛ'
                  : currentUser?.role === 'registrar'
                  ? currentLang === 'om'
                    ? '📋 Reejistiraara'
                    : currentLang === 'en'
                    ? '📋 Registrar'
                    : '📋 ሬጅስትራር'
                  : currentUser?.role === 'bureau_admin'
                  ? currentLang === 'om'
                    ? '🏛️ To\'ataa Biiroo'
                    : currentLang === 'en'
                    ? '🏛️ Bureau Inspector'
                    : '🏛️ የቢሮ ተቆጣጣሪ'
                  : currentLang === 'om'
                  ? '🏫 Hojjetaa M/B'
                  : currentLang === 'en'
                  ? '🏫 School Staff'
                  : '🏫 የት/ቤት ሰራተኛ'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>
                  {currentLang === 'om'
                    ? 'Daangaa Hojii Eegame (Role Isolated)'
                    : currentLang === 'en'
                    ? 'Role Isolated'
                    : 'የተጠበቀ የስራ ወሰን (Role Isolated)'}
                </span>
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/90 truncate mt-0.5">
              {isLibrarian
                ? currentLang === 'om'
                  ? 'Daangaa heyyamame: Kaataloogii kitaabaa, tajaajila dubbisa barattootaa fi galmee liqaa qofa'
                  : currentLang === 'en'
                  ? 'Permitted scope: Book catalog, student reading desk & lending registers only'
                  : 'የተፈቀደ የስራ ወሰን፡ የመጻሕፍት ካታሎግ፣ የተማሪዎች ንባብ አገልግሎትና የተውሶ መዝገብ ብቻ (የሌሎች ክፍሎች ስራ ተደብቋል)'
                : currentUser?.role === 'school_owner'
                ? currentLang === 'om'
                  ? 'Aangoo guutuu: Daarektara qacaruu, koodii kennuu, m/b to\'achuu fi beeksisa maxxansuu'
                  : currentLang === 'en'
                  ? 'Executive governance: appoint directors, issue codes, manage school & post board notices'
                  : 'ሙሉ ስልጣን፡ ዳይሬክተር መቅጠር፣ ኮድ መስጠት፣ ት/ቤቱን መቆጣጠርና ማስታወቂያ መለጠፍ'
                : currentUser?.role === 'school_director'
                ? currentLang === 'om'
                  ? 'Aangoo guutuu: Hojjettoota fi barattoota to\'achuu, gabaasota fuudhuu fi beeksisa tamsaasu'
                  : currentLang === 'en'
                  ? 'Operational oversight: supervise staff, students, review submissions & dispatch alerts'
                  : 'ሙሉ ስልጣን፡ ሰራተኞችንና ተማሪዎችን መቆጣጠር፣ ሪፖርቶች መቀበልና ማስታወቂያ ማሰራጨት'
                : currentUser?.role === 'teacher'
                ? currentLang === 'om'
                  ? 'Daangaa heyyamame: Barataa barsiisuu, qabxii fi hirmaannaa galmeessuu, hojii manaa kennuu'
                  : currentLang === 'en'
                  ? 'Permitted scope: Teach, score rosters, mark attendance & assign homework'
                  : 'የተፈቀደ የስራ ወሰን፡ ተማሪ ማስተማር፣ ውጤትና መገኘት መመዝገብ፣ የቤት ስራ መስጠትና ማረም (የፋይናንስና አስተዳደር መረጃ ተደብቋል)'
                : currentUser?.role === 'accountant'
                ? currentLang === 'om'
                  ? 'Daangaa heyyamame: Kaffaltii ji\'aa sassaabuu, nagahee, baasii m/b fi madaallii herregaa'
                  : currentLang === 'en'
                  ? 'Permitted scope: Tuition fee collection, receipts, operating expenses & ledger balance'
                  : 'የተፈቀደ የስራ ወሰን፡ የተማሪዎች የወር ክፍያ መሰብሰብ፣ ደረሰኝ፣ የት/ቤት ወጪዎችና ሚዛን (የተማሪዎች ፈተና ውጤት ተደብቋል)'
                : currentUser?.role === 'registrar'
                ? currentLang === 'om'
                  ? 'Daangaa heyyamame: Barattoota haaraa galmeessuu, daree ramaduu fi waraqaa eenyummaa qopheessuu'
                  : currentLang === 'en'
                  ? 'Permitted scope: Student enrollment, section allocation & official student ID cards'
                  : 'የተፈቀደ የስራ ወሰን፡ አዳዲስ ተማሪዎችን መመዝገብ፣ ክፍል መመደብና መታወቂያ ካርድ ማዘጋጀት (የፋይናንስ ወጪ ተደብቋል)'
                : currentLang === 'om'
                ? 'Hojiiwwan bulchiinsaa, humna namaa fi faayinaansii mana barnootaa guutuu'
                : currentLang === 'en'
                ? 'Complete school administrative, human resources and financial operations'
                : 'የትምህርት ቤቱን የተሟላ አስተዳደራዊ፣ የሰው ኃይል እና የፋይናንስ ተግባራት'}
            </p>
          </div>
        </div>

        {/* School Roles & Structure Guide Modal Opener */}
        <button
          type="button"
          onClick={() => setShowRoleGuideModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white rounded-xl text-xs font-semibold border border-white/20 transition-all cursor-pointer shrink-0"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
          <span>
            {currentLang === 'om'
              ? 'Qajeelfama Gahee fi Caasaa Hojii (Role Matrix)'
              : currentLang === 'en'
              ? 'Role Matrix & Structure Guide'
              : 'የስራ ድርሻና መዋቅር መመሪያ (Role Matrix)'}
          </span>
        </button>
      </div>

      {/* =========================================================================
          Department Launchpad Grid (Shown on Overview):
          "የትምህርት ቤት ገፅ ላይ ማንኛውም በተን ሲነካ የተነካው በተን የሚሰራውን ሥራ ብቻ እስክሪን ላይ እንዲታይ አርገው"
         ========================================================================= */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl text-lg">🎯</span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {currentLang === 'om'
                  ? 'Kutaalee Hojii Mana Barumsaa (Department Work Desks)'
                  : currentLang === 'en'
                  ? 'School Department Work Desks'
                  : 'የትምህርት ቤቱ የስራ ክፍሎች ማውጫ (Department Work Desks)'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {currentLang === 'om'
                ? 'Kutaalee hojii armaan gadii keessaa kamiyyuu cuqaasuun hojii san qofa ifatti hojjedhaa.'
                : currentLang === 'en'
                ? 'Click any department button to work exclusively on that desk.'
                : 'ከታች ካሉት የስራ ክፍሎች ማንኛውንም በተን ሲነኩ፣ የተነካው የስራ ክፍል ብቻ እስክሪን ላይ ይቀርብልዎታል።'}
            </p>
          </div>
          <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto border border-slate-200">
            {currentLang === 'om'
              ? 'Kutaalee Eeyyamaman፦ '
              : currentLang === 'en'
              ? 'Allowed Desks: '
              : 'የተፈቀዱ ክፍሎች፦ '}
            <span className="text-emerald-700 font-black">{allowedTabs.length}</span>
          </div>
        </div>

        {/* Department Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allowedTabs.map((tab) => {
            const info = getDeskInfo(tab, currentLang);
            let badgeText = '';
            if (tab === 'roster') {
              badgeText =
                currentLang === 'om'
                  ? `${students.length} barattoota`
                  : currentLang === 'en'
                  ? `${students.length} students`
                  : `${students.length} ተማሪዎች`;
            } else if (tab === 'finance') {
              const count = StorageService.getSchoolBankAccounts(currentSchool.id).length;
              badgeText =
                currentLang === 'om'
                  ? `${count} herreega baankii`
                  : currentLang === 'en'
                  ? `${count} bank accounts`
                  : `${count} የባንክ አካውንቶች`;
            } else if (tab === 'student_discipline') {
              const pendingCount = StorageService.getDisciplineReports(currentSchool.id).filter(
                (r) => r.status === 'pending_review'
              ).length;
              const totalCount = StorageService.getDisciplineReports(currentSchool.id).length;
              badgeText =
                pendingCount > 0
                  ? currentLang === 'om'
                    ? `${pendingCount} himannaa haaraa`
                    : currentLang === 'en'
                    ? `${pendingCount} new incidents`
                    : `${pendingCount} አዲስ ጥቆማ`
                  : currentLang === 'om'
                  ? `${totalCount} galmeewwan`
                  : currentLang === 'en'
                  ? `${totalCount} records`
                  : `${totalCount} መዛግብት`;
            } else if (tab === 'night_school') {
              badgeText =
                currentLang === 'om'
                  ? `${nightStudentsCount} barattoota galgalaa`
                  : currentLang === 'en'
                  ? `${nightStudentsCount} night students`
                  : `${nightStudentsCount} የማታ ተማሪዎች`;
            } else if (tab === 'notices') {
              const count = StorageService.getAnnouncements(currentSchool.id).length;
              badgeText =
                currentLang === 'om'
                  ? `${count} beeksisoota`
                  : currentLang === 'en'
                  ? `${count} notices`
                  : `${count} ማስታወቂያዎች`;
            } else if (tab === 'stakeholders') {
              badgeText =
                currentLang === 'om'
                  ? `${stakeholders.length} hojjettoota`
                  : currentLang === 'en'
                  ? `${stakeholders.length} staff members`
                  : `${stakeholders.length} ሰራተኞች`;
            } else if (tab === 'codes') {
              badgeText =
                currentLang === 'om'
                  ? `${currentSchoolCodes.length} koodii seensaa`
                  : currentLang === 'en'
                  ? `${currentSchoolCodes.length} access codes`
                  : `${currentSchoolCodes.length} የመግቢያ ኮዶች`;
            } else if (tab === 'grade_workflow') {
              const count = StorageService.getGradeWorkflows(currentSchool.id).length;
              badgeText =
                currentLang === 'om'
                  ? `${count} galmee qabxii`
                  : currentLang === 'en'
                  ? `${count} grade workflows`
                  : `${count} የውጤት ፋይሎች`;
            } else if (tab === 'teacher_training') {
              const count = StorageService.getTrainingMaterials().length;
              badgeText =
                currentLang === 'om'
                  ? `${count} moojuloota leenjii`
                  : currentLang === 'en'
                  ? `${count} training modules`
                  : `${count} የስልጠና ሞጁሎች`;
            } else if (tab === 'homework_attendance') {
              const count = StorageService.getHomework(currentSchool.id).length;
              badgeText =
                currentLang === 'om'
                  ? `${count} hojii manaa`
                  : currentLang === 'en'
                  ? `${count} homework tasks`
                  : `${count} የቤት ስራዎች`;
            } else if (tab === 'qr_attendance') {
              badgeText =
                currentLang === 'om'
                  ? 'Galmee QR'
                  : currentLang === 'en'
                  ? 'QR Records'
                  : 'የ QR መዝገብ';
            } else if (tab === 'teacher_evaluations') {
              badgeText =
                currentLang === 'om'
                  ? 'Madaallii Barsiisotaa'
                  : currentLang === 'en'
                  ? 'Teacher Evals'
                  : 'የመምህራን ምዘና';
            } else if (tab === 'registrar') {
              badgeText =
                currentLang === 'om'
                  ? 'Simannaa & Caasaa'
                  : currentLang === 'en'
                  ? 'Admissions'
                  : 'ቅበላ & መዋቅር';
            } else if (tab === 'library_desk') {
              const count = StorageService.getLibraryBooks(currentSchool.id).length;
              badgeText =
                currentLang === 'om'
                  ? `${count} kitaabota`
                  : currentLang === 'en'
                  ? `${count} books`
                  : `${count} መጻሕፍት`;
            } else if (tab === 'submit_report') {
              badgeText =
                currentLang === 'om'
                  ? 'Gabaasa Seera-qabeessa'
                  : currentLang === 'en'
                  ? 'Official Report'
                  : 'ይፋዊ ሪፖርት';
            } else if (tab === 'owner_board') {
              badgeText =
                currentLang === 'om'
                  ? 'Hoggansa Boordii'
                  : currentLang === 'en'
                  ? 'Board Leadership'
                  : 'የቦርድ አመራር';
            }

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveSubTab(tab)}
                className="group text-left p-4 sm:p-5 rounded-2xl border-2 border-slate-200/90 hover:border-emerald-600 bg-white hover:bg-emerald-50/30 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-2xl sm:text-3xl p-2.5 rounded-2xl bg-slate-100 group-hover:bg-white group-hover:scale-110 transition-transform shadow-2xs border border-slate-200/60">
                      {info.icon}
                    </span>
                    {badgeText && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 group-hover:bg-emerald-100 text-slate-700 group-hover:text-emerald-900 border border-slate-200 group-hover:border-emerald-300">
                        {badgeText}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-emerald-950 transition-colors">
                      {info.title}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-400 group-hover:text-slate-600 mt-0.5 truncate">
                      {info.titleEn}
                    </p>
                    <p className="text-xs text-slate-600 group-hover:text-slate-700 mt-2 line-clamp-2 leading-relaxed">
                      {info.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 group-hover:border-emerald-200 flex items-center justify-between text-xs font-black text-emerald-700 group-hover:text-emerald-800">
                  <span>
                    {currentLang === 'om'
                      ? 'Hojicha Bani'
                      : currentLang === 'en'
                      ? 'Open Desk'
                      : 'የክፍሉን ስራ ክፈት'}
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
        </>
      )}

      {/* Legacy sub-tabs bar hidden in favor of Focused Desk Bar and Launchpad Grid */}
      {false && (
      <>
      {/* Mobile-Only Desk Quick Selector Dropdown (sm:hidden) */}
      <div className="sm:hidden bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 shrink-0">
          <span>📱 ክፍል / ዴስክ፡</span>
        </span>
        <select
          value={activeSubTab}
          onChange={(e) => setActiveSubTab(e.target.value as SchoolSubTab)}
          className="flex-1 px-3 py-2 text-xs font-bold bg-slate-100 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 truncate"
        >
          {allowedTabs.includes('stakeholders') && (
            <option value="stakeholders">ባለድርሻ አካላት & ማስረጃዎች ({stakeholders.length})</option>
          )}
          {allowedTabs.includes('owner_board') && (
            <option value="owner_board">የቦርድ ሰብሳቢ / ባለቤት</option>
          )}
          {allowedTabs.includes('notices') && (
            <option value="notices">ማስታወቂያ ሰሌዳ ({StorageService.getAnnouncements(currentSchool.id).length})</option>
          )}
          {allowedTabs.includes('homework_attendance') && (
            <option value="homework_attendance">የቤት ስራ & መገኘት</option>
          )}
          {allowedTabs.includes('teacher_training') && (
            <option value="teacher_training">ከትምህርት ቢሮ የተላኩ ስልጠናዎች</option>
          )}
          {allowedTabs.includes('qr_attendance') && (
            <option value="qr_attendance">የተማሪዎች መገኘት በ QR</option>
          )}
          {allowedTabs.includes('teacher_evaluations') && (
            <option value="teacher_evaluations">የመምህራን ምዘና (Appraisal)</option>
          )}
          {allowedTabs.includes('finance') && (
            <option value="finance">ሒሳብና ክፍያ (Finance)</option>
          )}
          {allowedTabs.includes('registrar') && (
            <option value="registrar">ሬጅስትራር & መዋቅር (ምዝገባ)</option>
          )}
          {allowedTabs.includes('grade_workflow') && (
            <option value="grade_workflow">የውጤት ማፅደቂያ ዴስክ (Grade Workflow)</option>
          )}
          {allowedTabs.includes('night_school') && (
            <option value="night_school">የማታ ተማሪዎች ({nightStudentsCount})</option>
          )}
          {allowedTabs.includes('roster') && (
            <option value="roster">ተማሪዎች & ውጤት ({students.length})</option>
          )}
          {allowedTabs.includes('codes') && (
            <option value="codes">የመግቢያ ኮዶች ({currentSchoolCodes.length})</option>
          )}
          {allowedTabs.includes('submit_report') && (
            <option value="submit_report">ሪፖርት ለቢሮ</option>
          )}
          {allowedTabs.includes('library_desk') && (
            <option value="library_desk">የቤተ-መጻሕፍት ክፍል</option>
          )}
        </select>
      </div>

      <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-x-auto scrollbar-none text-xs font-bold">
        {/* Tab: Library Desk (Isolated for Librarian) */}
        {allowedTabs.includes('library_desk') && (
          <button
            type="button"
            onClick={() => setActiveSubTab('library_desk')}
            className={`shrink-0 py-2 sm:py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'library_desk'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0 text-blue-300" />
            <span className="truncate">የቤተ-መጻሕፍት ክፍል (Library Desk)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === 'library_desk' ? 'bg-blue-950 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {StorageService.getLibraryBooks(currentSchool.id).length}
            </span>
          </button>
        )}

        {/* Tab 1: Stakeholders & Fayda Credentials */}
        {allowedTabs.includes('stakeholders') && (
          <button
            type="button"
            onClick={() => setActiveSubTab('stakeholders')}
            className={`shrink-0 py-2 sm:py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'stakeholders'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4 shrink-0 text-amber-300" />
            <span className="truncate">
              {currentUser?.role === 'teacher' ? 'የግል መረጃ & ማስረጃ' : 'ባለድርሻ አካላት & ማስረጃዎች'}
            </span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === 'stakeholders' ? 'bg-emerald-950 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {stakeholders.length}
            </span>
          </button>
        )}

        {/* Tab 2: Owner & Board Chair Oversight */}
        {allowedTabs.includes('owner_board') && (
          <button
            type="button"
            onClick={() => setActiveSubTab('owner_board')}
            className={`shrink-0 py-2 sm:py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'owner_board'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Crown className="w-4 h-4 shrink-0 text-amber-300" />
            <span className="truncate">የቦርድ ሰብሳቢ / ባለቤት</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === 'owner_board' ? 'bg-emerald-950 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              አመራር
            </span>
          </button>
        )}

        {/* Tab 3: Notice Board & Announcements */}
        {allowedTabs.includes('notices') && (
          <button
            type="button"
            onClick={() => setActiveSubTab('notices')}
            className={`shrink-0 py-2 sm:py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'notices'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Megaphone className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="truncate">ማስታወቂያ ሰሌዳ</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === 'notices' ? 'bg-emerald-950 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {StorageService.getAnnouncements(currentSchool.id).length}
            </span>
          </button>
        )}

        {/* Tab 4: Homework & Daily Attendance */}
        {allowedTabs.includes('homework_attendance') && (
          <button
            type="button"
            onClick={() => setActiveSubTab('homework_attendance')}
            className={`shrink-0 py-2 sm:py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'homework_attendance'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0 text-teal-300" />
            <span className="truncate">የቤት ስራ & መገኘት</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === 'homework_attendance' ? 'bg-emerald-950 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {StorageService.getHomework(currentSchool.id).length}
            </span>
          </button>
        )}

        {/* Tab 4b: Official Bureau Training Dispatches for Teachers */}
        {allowedTabs.includes('teacher_training') && (
          <button
            type="button"
            onClick={() => setActiveSubTab('teacher_training')}
            className={`shrink-0 py-2 sm:py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'teacher_training'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0 text-amber-300" />
            <span className="truncate">ከትምህርት ቢሮ የተላኩ ስልጠናዎች</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === 'teacher_training'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-emerald-100 text-emerald-950'
              }`}
            >
              {StorageService.getTrainingMaterials().length} ሞጁሎች
            </span>
          </button>
        )}

        {/* Tab 4c: Student QR Attendance Desk (Direct Check-in, Kiosk & Display) */}
        {allowedTabs.includes('qr_attendance') && (
          <button
            type="button"
            onClick={() => setActiveSubTab('qr_attendance')}
            className={`shrink-0 py-2 sm:py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'qr_attendance'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <QrCode className="w-4 h-4 shrink-0 text-amber-300" />
            <span className="truncate">የተማሪዎች መገኘት በ QR (QR Attendance)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === 'qr_attendance' ? 'bg-teal-950 text-white' : 'bg-teal-100 text-teal-800'
              }`}
            >
              QR 📷
            </span>
          </button>
        )}

        {/* Tab 4d: Teacher Appraisal & Ratings (የመምህራን ግምገማና ምዘና) */}
        {allowedTabs.includes('teacher_evaluations') && (
          <button
            type="button"
            onClick={() => setActiveSubTab('teacher_evaluations')}
            className={`shrink-0 py-2 sm:py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'teacher_evaluations'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Star className="w-4 h-4 shrink-0 fill-current text-slate-950" />
            <span className="truncate">የመምህራን ምዘና (Appraisal)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === 'teacher_evaluations' ? 'bg-slate-950 text-white' : 'bg-amber-100 text-amber-900'
              }`}
            >
              ⭐ 60 ማርክ
            </span>
          </button>
        )}

        {/* Tab 5: School Finance & Tuition Fees */}
        {allowedTabs.includes('finance') && (
          <button
            type="button"
            onClick={() => setActiveSubTab('finance')}
            className={`shrink-0 py-2 sm:py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'finance'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="truncate">ሒሳብና ክፍያ (Finance)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === 'finance' ? 'bg-emerald-950 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              ፋይናንስ
            </span>
          </button>
        )}

        {/* Tab 6: Registrar & School Organization Structure */}
        {allowedTabs.includes('registrar') && (
          <button
            type="button"
            onClick={() => setActiveSubTab('registrar')}
            className={`shrink-0 py-2 sm:py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'registrar'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ClipboardList className="w-4 h-4 shrink-0 text-blue-400" />
            <span className="truncate">ሬጅስትራር & መዋቅር</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === 'registrar' ? 'bg-emerald-950 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              ምዝገባ
            </span>
          </button>
        )}

        {/* Tab: Academic Grade Collection & Multi-Tier Approval Workflow Desk */}
        {allowedTabs.includes('grade_workflow') && (
          <button
            type="button"
            onClick={() => setActiveSubTab('grade_workflow')}
            className={`shrink-0 py-2 sm:py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'grade_workflow'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-300" />
            <span className="truncate">የውጤት ማፅደቂያ ዴስክ (Grade Workflow)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === 'grade_workflow' ? 'bg-emerald-950 text-white' : 'bg-emerald-100 text-emerald-900'
              }`}
            >
              {StorageService.getGradeWorkflows(currentSchool.id).length}
            </span>
          </button>
        )}

        {/* Tab: Student Misconduct Tip-off & Discipline Desk (የስነ-ምግባር ጥቆማ & ዲሲፕሊን) */}
        {allowedTabs.includes('student_discipline') && (
          <button
            type="button"
            onClick={() => setActiveSubTab('student_discipline')}
            className={`shrink-0 py-2 sm:py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'student_discipline'
                ? 'bg-rose-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="truncate">
              {currentUser?.role === 'school_director' || currentUser?.role === 'school_owner'
                ? 'ስነ-ምግባር & ባህሪ መዝገብ (Conduct Log)'
                : currentUser?.role === 'teacher'
                ? 'የስነ-ምግባር ክስተት መዝገብ (Conduct Log)'
                : 'የስነ-ምግባር ጥቆማ (ለዳይሬክተር)'}
            </span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === 'student_discipline' ? 'bg-rose-950 text-white' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {StorageService.getDisciplineReports(currentSchool.id).filter((r) => r.status === 'pending_review').length > 0
                ? `${StorageService.getDisciplineReports(currentSchool.id).filter((r) => r.status === 'pending_review').length} አዲስ`
                : StorageService.getDisciplineReports(currentSchool.id).length}
            </span>
          </button>
        )}

        {/* Tab: Night Extension School Desk (የማታ ትምህርት ፕሮግራም ዴስክ) */}
        {allowedTabs.includes('night_school') && (
          <button
            type="button"
            onClick={() => setActiveSubTab('night_school')}
            className={`shrink-0 py-2 sm:py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'night_school'
                ? 'bg-indigo-950 text-indigo-100 shadow-xs ring-1 ring-indigo-500'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Moon className="w-4 h-4 shrink-0 text-indigo-400" />
            <span className="truncate">የማታ ተማሪዎች (Night Shift)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === 'night_school'
                  ? 'bg-indigo-800 text-white'
                  : 'bg-indigo-100 text-indigo-900'
              }`}
            >
              {nightStudentsCount}
            </span>
          </button>
        )}

        {/* Tab 7: Students Roster & Report Cards */}
        {allowedTabs.includes('roster') && (
          <button
            type="button"
            onClick={() => setActiveSubTab('roster')}
            className={`shrink-0 py-2 sm:py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'roster'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {currentUser?.role === 'teacher' ? 'የተማሪዎች ውጤት መመዝገቢያ' : 'ተማሪዎች & ውጤት'}
            </span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === 'roster' ? 'bg-emerald-950 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {students.length}
            </span>
          </button>
        )}

        {/* Tab 8: Access Codes */}
        {allowedTabs.includes('codes') && (
          <button
            type="button"
            onClick={() => setActiveSubTab('codes')}
            className={`shrink-0 py-2 sm:py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'codes'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <KeyRound className="w-4 h-4 shrink-0" />
            <span className="truncate">የመግቢያ ኮዶች</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === 'codes' ? 'bg-emerald-950 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {currentSchoolCodes.length}
            </span>
          </button>
        )}

        {/* Tab 9: Report Submission to Bureau */}
        {allowedTabs.includes('submit_report') && (
          <button
            type="button"
            onClick={() => setActiveSubTab('submit_report')}
            className={`shrink-0 py-2 sm:py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'submit_report'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Send className="w-4 h-4 shrink-0" />
            <span className="truncate">ሪፖርት ለቢሮ</span>
          </button>
        )}

        {/* Toggle Desk Fullscreen Button */}
        <button
          type="button"
          onClick={() => setIsDeskOnly(!isDeskOnly)}
          className="ml-auto shrink-0 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl inline-flex items-center gap-1.5 text-xs font-bold transition-all bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/60 shadow-2xs cursor-pointer"
          title={isDeskOnly ? 'መደበኛ እይታ አሳይ' : 'ይህንን ክፍል ብቻ ሙሉ እስክሪን አድርግ'}
        >
          {isDeskOnly ? <Minimize2 className="w-3.5 h-3.5 text-amber-600" /> : <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />}
          <span className="hidden sm:inline">{isDeskOnly ? 'መደበኛ እይታ' : 'የክፍሉ ሙሉ እስክሪን'}</span>
        </button>
      </div>
      </>
      )}

      {/* =========================================================================
          3. Sub-Tab 1: Student Roster (Mobile Cards + Desktop Table)
         ========================================================================= */}
      {activeSubTab === 'roster' && (
        <div className="space-y-4">
          {/* Action Header + Search/Filter */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {currentLang === 'om'
                      ? 'Tarree Qabxii Barattootaa fi Kaardii Qabxii'
                      : currentLang === 'en'
                      ? 'Student Grades Roster & Report Cards'
                      : 'የተማሪዎች ውጤት ዝርዝር እና የውጤት ካርድ ማውጫ'}
                  </h3>
                  <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    {filteredStudents.length} {currentLang === 'om' ? 'barattoota' : currentLang === 'en' ? 'students' : 'ተማሪዎች'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentLang === 'om'
                    ? 'Qabxii qormaataa, sadarkaa, naamusa fi koodii seensaa barattootaa/maatii (kutaa fi dareedhaan calalamuu danda\'a)'
                    : currentLang === 'en'
                    ? 'Student exam scores, rank, conduct, and student/parent access codes (filter by grade & section)'
                    : 'የተማሪዎች ፈተና ውጤት፣ ደረጃ፣ ስነ-ምግባር እና የተማሪ/ወላጅ መግቢያ ኮዶች (በክፍል ደረጃና በሴክሽን ማጣሪያና ማደራጃ)'}
                </p>
              </div>

              {!isBureauRole ? (
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{currentLang === 'om' ? 'Barataa Haaraa Galmeessi' : currentLang === 'en' ? 'Register Student' : 'አዲስ ተማሪ መዝግብ'}</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-100 text-amber-950 border border-amber-300 rounded-xl text-xs font-bold shrink-0">
                  <Lock className="w-3.5 h-3.5 text-amber-800" />
                  <span>
                    {currentLang === 'om' ? 'Ilaalcha Qofa (Read-Only)' : currentLang === 'en' ? 'View Only (Read-Only)' : 'ተማሪዎች ማየት ብቻ (Read-Only)'}
                  </span>
                </div>
              )}
            </div>

            {/* Filter Controls Grid: Search + Grade Select + Section Select + Sort Select */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  placeholder={
                    currentLang === 'om'
                      ? 'Maqaa, ID ykn koodiin barbaadi...'
                      : currentLang === 'en'
                      ? 'Search student by name, ID or code...'
                      : 'ተማሪ በስም፣ በመታወቂያ ወይም በኮድ ፈልግ...'
                  }
                  className="w-full pl-9 pr-8 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden transition-all"
                />
                {studentSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setStudentSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    title={currentLang === 'om' ? 'Barbaacha qulqulleessi' : currentLang === 'en' ? 'Clear search' : 'ፍለጋ አጽዳ'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Grade Level Filter */}
              <div className="relative">
                <select
                  value={studentGradeFilter}
                  onChange={(e) => {
                    const nextGrade = e.target.value;
                    setStudentGradeFilter(nextGrade);
                    if (nextGrade !== 'all' && studentSectionFilter !== 'all') {
                      const sectionsInNewGrade = students
                        .filter((s) => s.grade.toString() === nextGrade)
                        .map((s) => s.section.toUpperCase());
                      if (!sectionsInNewGrade.includes(studentSectionFilter.toUpperCase())) {
                        setStudentSectionFilter('all');
                      }
                    }
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                >
                  <option value="all">
                    {currentLang === 'om'
                      ? `Sadarkaa Kutaa Hunda (${students.length})`
                      : currentLang === 'en'
                      ? `All Grade Levels (${students.length})`
                      : `ሁሉም የክፍል ደረጃዎች (${students.length})`}
                  </option>
                  {availableGrades.map((g) => (
                    <option key={g} value={g.toString()}>
                      {currentLang === 'om'
                        ? `Kutaa ${g} (Barattoota ${studentCountsByGrade[g.toString()] || 0})`
                        : currentLang === 'en'
                        ? `Grade ${g} (${studentCountsByGrade[g.toString()] || 0} students)`
                        : `Grade ${g} (${studentCountsByGrade[g.toString()] || 0} ተማሪዎች)`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Filter */}
              <div className="relative">
                <select
                  value={studentSectionFilter}
                  onChange={(e) => setStudentSectionFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                >
                  <option value="all">
                    {currentLang === 'om'
                      ? 'Dareewwan Hunda (All Sections)'
                      : currentLang === 'en'
                      ? 'All Sections'
                      : 'ሁሉም ክፍልፋዮች / Sections (All)'}
                  </option>
                  {availableSections.map((sec) => (
                    <option key={sec} value={sec}>
                      {currentLang === 'om'
                        ? `Daree ${sec} (Barattoota ${studentCountsBySection[sec] || 0})`
                        : currentLang === 'en'
                        ? `Section ${sec} (${studentCountsBySection[sec] || 0} students)`
                        : `ክፍልፋይ (Section) ${sec} (${studentCountsBySection[sec] || 0} ተማሪዎች)`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Selector */}
              <div className="relative">
                <select
                  value={studentSortBy}
                  onChange={(e) => setStudentSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                >
                  <option value="rank_asc">{currentLang === 'om' ? 'Tartiiba: Sadarkaa (#1 jalqaba)' : currentLang === 'en' ? 'Sort: Rank (#1 first)' : 'ደርድር፡ ደረጃ (#1 መጀመሪያ)'}</option>
                  <option value="rank_desc">{currentLang === 'om' ? 'Tartiiba: Sadarkaa (gadi-aanaa)' : currentLang === 'en' ? 'Sort: Rank (lowest first)' : 'ደርድር፡ ደረጃ (ከታች ወደ ላይ)'}</option>
                  <option value="grade_asc">{currentLang === 'om' ? 'Tartiiba: Kutaa (Xiqqaa → Guddaa)' : currentLang === 'en' ? 'Sort: Grade (Low → High)' : 'ደርድር፡ ክፍል ደረጃ (ዝቅተኛ → ከፍተኛ)'}</option>
                  <option value="grade_desc">{currentLang === 'om' ? 'Tartiiba: Kutaa (Guddaa → Xiqqaa)' : currentLang === 'en' ? 'Sort: Grade (High → Low)' : 'ደርድር፡ ክፍል ደረጃ (ከፍተኛ → ዝቅተኛ)'}</option>
                  <option value="section_asc">{currentLang === 'om' ? 'Tartiiba: Daree (A → Z)' : currentLang === 'en' ? 'Sort: Section (A → Z)' : 'ደርድር፡ ክፍልፋይ (Section A → Z)'}</option>
                  <option value="section_desc">{currentLang === 'om' ? 'Tartiiba: Daree (Z → A)' : currentLang === 'en' ? 'Sort: Section (Z → A)' : 'ደርድር፡ ክፍልፋይ (Section Z → A)'}</option>
                  <option value="name_asc">{currentLang === 'om' ? 'Tartiiba: Maqaa (A → Z)' : currentLang === 'en' ? 'Sort: Name (A → Z)' : 'ደርድር፡ የተማሪ ስም (A → Z)'}</option>
                  <option value="name_desc">{currentLang === 'om' ? 'Tartiiba: Maqaa (Z → A)' : currentLang === 'en' ? 'Sort: Name (Z → A)' : 'ደርድር፡ የተማሪ ስም (Z → A)'}</option>
                  <option value="score_desc">{currentLang === 'om' ? 'Tartiiba: Giddugaleessa (Olaanaa)' : currentLang === 'en' ? 'Sort: Average (High → Low)' : 'ደርድር፡ አማካይ ውጤት (ከፍተኛ መጀመሪያ)'}</option>
                  <option value="score_asc">{currentLang === 'om' ? 'Tartiiba: Giddugaleessa (Gadi-aanaa)' : currentLang === 'en' ? 'Sort: Average (Low → High)' : 'ደርድር፡ አማካይ ውጤት (ዝቅተኛ መጀመሪያ)'}</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Badges Row: Grade Badges + Section Badges + Clear Button */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-emerald-700" />
                  <span>{currentLang === 'om' ? 'Kutaa:' : currentLang === 'en' ? 'Grade:' : 'ክፍል፡'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setStudentGradeFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    studentGradeFilter === 'all'
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {currentLang === 'om' ? 'Hunda' : currentLang === 'en' ? 'All' : 'ሁሉም'} ({students.length})
                </button>
                {availableGrades.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setStudentGradeFilter(g.toString())}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      studentGradeFilter === g.toString()
                        ? 'bg-emerald-800 text-white shadow-2xs ring-1 ring-emerald-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {currentLang === 'om' ? `Kutaa ${g}` : `Grade ${g}`} ({studentCountsByGrade[g.toString()] || 0})
                  </button>
                ))}

                {/* Section Quick Pills */}
                {availableSections.length > 0 && (
                  <>
                    <span className="text-slate-300 mx-1">|</span>
                    <span className="text-[11px] font-bold text-slate-500 mr-1">
                      {currentLang === 'om' ? 'Daree:' : currentLang === 'en' ? 'Section:' : 'ሴክሽን፡'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setStudentSectionFilter('all')}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        studentSectionFilter === 'all'
                          ? 'bg-teal-800 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {currentLang === 'om' ? 'Hunda' : currentLang === 'en' ? 'All' : 'ሁሉም'}
                    </button>
                    {availableSections.map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setStudentSectionFilter(sec)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          studentSectionFilter === sec
                            ? 'bg-teal-800 text-white shadow-2xs ring-1 ring-teal-600'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {sec} ({studentCountsBySection[sec] || 0})
                      </button>
                    ))}
                  </>
                )}

                {/* Shift Quick Pills: All, Day, Night */}
                <span className="text-slate-300 mx-1">|</span>
                <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <span>{currentLang === 'om' ? 'Yeroo:' : currentLang === 'en' ? 'Shift:' : 'ፈረቃ፡'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setStudentShiftFilter('all')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    studentShiftFilter === 'all'
                      ? 'bg-slate-800 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {currentLang === 'om' ? 'Hunda' : currentLang === 'en' ? 'All' : 'ሁሉም'} ({students.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStudentShiftFilter('regular_day')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    studentShiftFilter === 'regular_day'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  ☀️ {currentLang === 'om' ? 'Guyyaa' : currentLang === 'en' ? 'Day' : 'ቀን'} ({dayStudentsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStudentShiftFilter('night_shift')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    studentShiftFilter === 'night_shift'
                      ? 'bg-indigo-950 text-indigo-100 font-black shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🌙 {currentLang === 'om' ? 'Galgala' : currentLang === 'en' ? 'Night' : 'ማታ'} ({nightStudentsCount})
                </button>
              </div>

              {/* Reset Filters Button */}
              {(studentGradeFilter !== 'all' ||
                studentSectionFilter !== 'all' ||
                studentShiftFilter !== 'all' ||
                studentSearchQuery.trim() !== '' ||
                studentSortBy !== 'rank_asc') && (
                <button
                  type="button"
                  onClick={resetStudentFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-[11px] font-bold border border-rose-200 transition-colors cursor-pointer shrink-0 ml-auto"
                >
                  <RotateCcw className="w-3 h-3 text-rose-600" />
                  <span>{currentLang === 'om' ? 'Calallii Haqi (Reset)' : currentLang === 'en' ? 'Reset Filters' : 'ማጣሪያዎችን አፅዳ (Reset)'}</span>
                </button>
              )}
            </div>
          </div>

          {/* 3A. Mobile View: Responsive Student Cards (Hidden on Desktop) */}
          <div className="block md:hidden space-y-3">
            {filteredStudents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {currentLang === 'om' ? 'Barataan hin argamne' : currentLang === 'en' ? 'No students found' : 'ምንም ተማሪ አልተገኘም'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {currentLang === 'om'
                      ? 'Kutaa ykn daree filatame keessatti barataan galmaa\'e hin jiru.'
                      : currentLang === 'en'
                      ? 'No students matched the selected grade or section.'
                      : 'በተመረጠው የክፍል ደረጃ ወይም ክፍልፋይ የተመዘገበ ተማሪ የለም።'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetStudentFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{currentLang === 'om' ? 'Barattoota Hunda Agarsiisi' : currentLang === 'en' ? 'Show All Students' : 'ሁሉንም ተማሪዎች አሳይ (Reset Filters)'}</span>
                </button>
              </div>
            ) : (
              filteredStudents.map((st) => {
                const avg =
                  st.scores.length > 0
                    ? (st.scores.reduce((a, b) => a + b.total, 0) / st.scores.length).toFixed(1)
                    : '0';

                const numAvg = parseFloat(avg);
                const scoreBadgeClass =
                  numAvg >= 80
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : numAvg >= 60
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-rose-100 text-rose-900 border-rose-300';

                return (
                  <div
                    key={st.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3"
                  >
                    {/* Top Row: Rank, Name, Grade */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center shrink-0 border border-emerald-300">
                          #{st.rank}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-900 leading-tight">
                              {st.fullName}
                            </h4>
                            {st.shift === 'night_shift' && (
                              <span className="text-[9px] font-extrabold bg-indigo-950 text-indigo-100 px-1.5 py-0.2 rounded inline-flex items-center gap-0.5">
                                <Moon className="w-2.5 h-2.5 text-indigo-300" />
                                <span>{currentLang === 'om' ? 'Galgala' : currentLang === 'en' ? 'Night' : 'ማታ'}</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            ID: {st.studentIdNumber} · {currentLang === 'om' ? 'Saala:' : currentLang === 'en' ? 'Gender:' : 'ፆታ፡'}{' '}
                            {st.gender === 'M'
                              ? currentLang === 'om'
                                ? 'Dhiira'
                                : currentLang === 'en'
                                ? 'Male'
                                : 'ወንድ'
                              : currentLang === 'om'
                              ? 'Dubartii'
                              : currentLang === 'en'
                              ? 'Female'
                              : 'ሴት'}
                            {st.occupation ? ` · 💼 ${st.occupation}` : ''}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full shrink-0">
                        {currentLang === 'om' ? 'Kutaa' : 'Grade'} {st.grade}-{st.section}
                      </span>
                    </div>

                    {/* Middle Info: Access Codes */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-medium">
                          {currentLang === 'om' ? 'Koodii Barataa:' : currentLang === 'en' ? 'Student Code:' : 'የተማሪ ኮድ፡'}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyCode(st.accessCode, `stu-code-${st.id}`)}
                          className="font-mono font-bold text-emerald-950 bg-white px-2 py-0.5 rounded border border-emerald-300 inline-flex items-center gap-1 text-[11px]"
                        >
                          <span>{st.accessCode}</span>
                          {copiedCodeId === `stu-code-${st.id}` ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-400" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                        <div>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {currentLang === 'om' ? 'Maatii: ' : currentLang === 'en' ? 'Parent: ' : 'ወላጅ፡ '}
                          </span>
                          <strong className="text-slate-800 text-[11px]">{st.parentName}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyCode(st.parentAccessCode, `par-code-${st.id}`)}
                          className="font-mono text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-300 inline-flex items-center gap-1 text-[10px]"
                          title={currentLang === 'om' ? 'Koodii maatii waraabi' : currentLang === 'en' ? 'Copy parent code' : 'የወላጅ ኮድ ቅዳ'}
                        >
                          <span>{st.parentAccessCode}</span>
                          {copiedCodeId === `par-code-${st.id}` ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Scores & Badges */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-black border ${scoreBadgeClass}`}>
                          {avg}% {currentLang === 'om' ? 'Giddugaleessa' : currentLang === 'en' ? 'Avg' : 'አማካይ'}
                        </span>
                        <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                          {currentLang === 'om' ? 'Naamusa:' : currentLang === 'en' ? 'Conduct:' : 'ባህሪ:'} {st.conduct}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForIdCard(st)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-300 transition-colors"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                          <span>{currentLang === 'om' ? 'Eenyummaa' : currentLang === 'en' ? 'ID Card' : 'መታወቂያ'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedStudentForCard(st)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-300 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{currentLang === 'om' ? 'Kaardii' : currentLang === 'en' ? 'Card' : 'ካርድ'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 3B. Desktop View: High-density Data Table (Hidden on Mobile) */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th
                      className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      onClick={() => setStudentSortBy(studentSortBy === 'rank_asc' ? 'rank_desc' : 'rank_asc')}
                      title={currentLang === 'om' ? 'Sadarkaan tartiibessuuf cuqaasi' : currentLang === 'en' ? 'Sort by rank' : 'በደረጃ ለመደርደር ይጫኑ'}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{currentLang === 'om' ? 'Sadarkaa (Rank)' : currentLang === 'en' ? 'Rank' : 'ደረጃ (Rank)'}</span>
                        {studentSortBy === 'rank_asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-emerald-800" />
                        ) : studentSortBy === 'rank_desc' ? (
                          <ArrowDown className="w-3.5 h-3.5 text-emerald-800" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      onClick={() => setStudentSortBy(studentSortBy === 'name_asc' ? 'name_desc' : 'name_asc')}
                      title={currentLang === 'om' ? 'Maqaan tartiibessuuf cuqaasi' : currentLang === 'en' ? 'Sort by student name' : 'በተማሪ ስም ለመደርደር ይጫኑ'}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{currentLang === 'om' ? 'Maqaa Barataa' : currentLang === 'en' ? 'Student Name' : 'የተማሪ ስም'}</span>
                        {studentSortBy === 'name_asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-emerald-800" />
                        ) : studentSortBy === 'name_desc' ? (
                          <ArrowDown className="w-3.5 h-3.5 text-emerald-800" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      onClick={() => {
                        if (studentSortBy === 'grade_asc') setStudentSortBy('grade_desc');
                        else if (studentSortBy === 'grade_desc') setStudentSortBy('section_asc');
                        else if (studentSortBy === 'section_asc') setStudentSortBy('section_desc');
                        else setStudentSortBy('grade_asc');
                      }}
                      title={currentLang === 'om' ? 'Kutaa fi dareedhaan tartiibessuuf cuqaasi' : currentLang === 'en' ? 'Sort by grade and section' : 'በክፍል ደረጃ እና ክፍልፋይ ለመደርደር ይጫኑ'}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{currentLang === 'om' ? 'Kutaa / Daree' : currentLang === 'en' ? 'Grade / Section' : 'ክፍል / ክፍልፋይ'}</span>
                        {studentSortBy === 'grade_asc' || studentSortBy === 'section_asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-emerald-800" />
                        ) : studentSortBy === 'grade_desc' || studentSortBy === 'section_desc' ? (
                          <ArrowDown className="w-3.5 h-3.5 text-emerald-800" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        )}
                        <span className="text-[9px] lowercase text-slate-400 font-normal">
                          {studentSortBy.startsWith('grade') ? '(grade)' : studentSortBy.startsWith('section') ? '(sec)' : ''}
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-3.5">{currentLang === 'om' ? 'Koodii Barataa' : currentLang === 'en' ? 'Access Code' : 'የተማሪ መግቢያ ኮድ'}</th>
                    <th className="px-4 py-3.5">{currentLang === 'om' ? 'Maatii & Bilbila' : currentLang === 'en' ? 'Parent & Phone' : 'ወላጅ እና ስልክ'}</th>
                    <th
                      className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      onClick={() => setStudentSortBy(studentSortBy === 'score_desc' ? 'score_asc' : 'score_desc')}
                      title={currentLang === 'om' ? 'Giddugaleessaan tartiibessuuf cuqaasi' : currentLang === 'en' ? 'Sort by average score' : 'በአማካይ ውጤት ለመደርደር ይጫኑ'}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{currentLang === 'om' ? 'Qabxii Giddugaleessaa' : currentLang === 'en' ? 'Average Score' : 'አማካይ ውጤት'}</span>
                        {studentSortBy === 'score_desc' ? (
                          <ArrowDown className="w-3.5 h-3.5 text-emerald-800" />
                        ) : studentSortBy === 'score_asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-emerald-800" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3.5">{currentLang === 'om' ? 'Naamusa' : currentLang === 'en' ? 'Conduct' : 'ስነ-ምግባር'}</th>
                    <th className="px-4 py-3.5 text-right">{currentLang === 'om' ? 'Gochaalee' : currentLang === 'en' ? 'Actions' : 'ተግባራት'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 px-4 text-center">
                        <div className="max-w-sm mx-auto space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                            <GraduationCap className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">
                              {currentLang === 'om' ? 'Calallii filatameen barataan hin argamne' : currentLang === 'en' ? 'No students matched the current filter' : 'በተመረጠው ማጣሪያ ምንም ተማሪ አልተገኘም'}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">
                              {studentGradeFilter !== 'all' && `${currentLang === 'om' ? 'Kutaa:' : currentLang === 'en' ? 'Grade:' : 'ክፍል፡'} ${studentGradeFilter} `}
                              {studentSectionFilter !== 'all' && `${currentLang === 'om' ? 'Daree:' : currentLang === 'en' ? 'Section:' : 'ሴክሽን፡'} ${studentSectionFilter} `}
                              {studentSearchQuery && `${currentLang === 'om' ? 'Barbaacha:' : currentLang === 'en' ? 'Search:' : 'ፍለጋ፡'} "${studentSearchQuery}"`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={resetStudentFilters}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors cursor-pointer shadow-xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{currentLang === 'om' ? 'Barattoota Hunda Agarsiisi' : currentLang === 'en' ? 'Show All Students' : 'ሁሉንም ተማሪዎች አሳይ (Reset Filters)'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => {
                      const avg =
                        st.scores.length > 0
                          ? (st.scores.reduce((a, b) => a + b.total, 0) / st.scores.length).toFixed(1)
                          : '0';

                      return (
                        <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3.5 font-black text-emerald-900">
                            #{st.rank}
                          </td>
                          <td className="px-4 py-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span>{st.fullName}</span>
                              {st.shift === 'night_shift' && (
                                <span className="text-[9px] font-extrabold bg-indigo-950 text-indigo-100 px-1.5 py-0.2 rounded inline-flex items-center gap-0.5">
                                  <Moon className="w-2.5 h-2.5 text-indigo-300" />
                                  <span>{currentLang === 'om' ? 'Galgala' : currentLang === 'en' ? 'Night' : 'ማታ'}</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block font-normal">
                              {currentLang === 'om' ? 'Eenyummaa:' : currentLang === 'en' ? 'ID:' : 'መታወቂያ:'} {st.studentIdNumber} {st.occupation ? `· 💼 ${st.occupation}` : ''}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-slate-800">
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-bold">
                              {currentLang === 'om' ? 'Kutaa' : 'Grade'} {st.grade} - {st.section}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <button
                              type="button"
                              onClick={() => copyCode(st.accessCode, `tbl-stu-${st.id}`)}
                              className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200 inline-flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                              title={currentLang === 'om' ? 'Koodii waraabi' : currentLang === 'en' ? 'Copy code' : 'ኮድ ቅዳ'}
                            >
                              <span>{st.accessCode}</span>
                              {copiedCodeId === `tbl-stu-${st.id}` ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3 text-slate-400" />
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-medium text-slate-900 block">{st.parentName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {st.parentPhone} ({currentLang === 'om' ? 'Koodii:' : currentLang === 'en' ? 'Code:' : 'ኮድ:'} {st.parentAccessCode})
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-extrabold text-slate-900">
                            {avg}%
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                              {st.conduct}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedStudentForIdCard(st)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-300 transition-colors"
                                title={currentLang === 'om' ? 'Waraqaa Eenyummaa Barataa' : currentLang === 'en' ? 'Student ID Card' : 'የተማሪ መታወቂያ ካርድ (Student ID Card)'}
                              >
                                <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                                <span>{currentLang === 'om' ? 'Eenyummaa' : currentLang === 'en' ? 'ID Card' : 'መታወቂያ'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedStudentForCard(st)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>{currentLang === 'om' ? 'Kaardii' : currentLang === 'en' ? 'Card' : 'ካርድ'}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. Sub-Tab: School Stakeholders, Library & Offices (Fayda & Credentials)
         ========================================================================= */}
      {activeSubTab === 'stakeholders' && (
        <div className="space-y-4">
          {/* Header Action Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-700">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                      {currentLang === 'om'
                        ? 'Qooda-fudhattoota Mana Barumsaa, Mana Kitaabaa fi Waajjiraalee'
                        : currentLang === 'en'
                        ? 'School Stakeholders, Library & Offices'
                        : 'የትምህርት ቤት ባለድርሻ አካላት፣ ቤተ-መጻሕፍት እና የስራ ጽሕፈት ቤቶች'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {currentLang === 'om'
                        ? 'Itti-gaafatamaa Mana Kitaabaa, Daarektaroota, Barsiisota, Eenyummaa Dijitaalaa Faayidaa fi Ragaalee Barnootaa'
                        : currentLang === 'en'
                        ? 'Head Librarian, Principals, Teachers, Fayda Digital ID & Verified Graduation Credentials'
                        : 'የትምህርት ቤተ-መጻሕፍት ኃላፊ፣ ርዕሰ መምህራን፣ መምህራን፣ የፋይዳ ዲጂታል መታወቂያ እና የተረጋገጡ የተመረቁባቸው ማስረጃዎች'}
                    </p>
                  </div>
                </div>
              </div>

              {canManageStaff && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingStakeholder(null);
                    setShowStakeholderForm(true);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {currentLang === 'om'
                      ? '+ Qooda-fudhaa Haaraa Galmeessi'
                      : currentLang === 'en'
                      ? '+ Register Stakeholder'
                      : '+ አዲስ ባለድርሻ አካል መዝግብ'}
                  </span>
                </button>
              )}
              {isBureauRole && (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-100 text-amber-950 border border-amber-300 rounded-xl text-xs font-bold shrink-0">
                  <Lock className="w-3.5 h-3.5 text-amber-800" />
                  <span>
                    {currentLang === 'om'
                      ? 'Ilaalcha Qofa (Read-Only)'
                      : currentLang === 'en'
                      ? 'View Only (Read-Only)'
                      : 'ባለድርሻ አካላት ማየት ብቻ (Read-Only)'}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-emerald-900">
                  {currentLang === 'om' ? 'Qooda-fudhattoota Waliigalaa' : currentLang === 'en' ? 'Total Stakeholders' : 'አጠቃላይ ባለድርሻ አካላት'}
                </span>
                <span className="text-lg font-black text-emerald-950 mt-1">
                  {currentSchoolStakeholders.length} {currentLang === 'om' ? 'namoota' : currentLang === 'en' ? 'people' : 'ሰዎች'}
                </span>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-amber-900">
                  {currentLang === 'om' ? 'Eenyummaa Faayidaa Mirkanaa\'an' : currentLang === 'en' ? 'Verified Fayda IDs' : 'የተረጋገጡ የፋይዳ መታወቂያዎች'}
                </span>
                <span className="text-lg font-black text-amber-950 mt-1">
                  {currentSchoolStakeholders.filter((s) => s.faydaVerified).length}{' '}
                  {currentLang === 'om' ? 'mirkanaa\'e' : currentLang === 'en' ? 'verified' : 'የተረጋገጡ'}
                </span>
              </div>

              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-blue-900">
                  {currentLang === 'om' ? 'Waajjira Mana Kitaabaa M/B' : currentLang === 'en' ? 'School Library Office' : 'የት/ቤት ቤተ-መጻሕፍት ጽ/ቤት'}
                </span>
                <span className="text-lg font-black text-blue-950 mt-1">
                  {
                    currentSchoolStakeholders.filter(
                      (s) =>
                        s.role === 'head_librarian' ||
                        s.officeOrDepartment.includes('ቤተ-መጻሕፍት') ||
                        s.officeOrDepartment.includes('Library')
                    ).length
                  }{' '}
                  {currentLang === 'om' ? 'ogeeyyii' : currentLang === 'en' ? 'specialists' : 'ባለሙያዎች'}
                </span>
              </div>

              <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-purple-900">
                  {currentLang === 'om' ? 'Ragaalee Eebbaa' : currentLang === 'en' ? 'Graduation Credentials' : 'የተመረቁባቸው ማስረጃዎች'}
                </span>
                <span className="text-lg font-black text-purple-950 mt-1">
                  {currentSchoolStakeholders.reduce(
                    (acc, s) => acc + (s.credentials?.length || 0),
                    0
                  )}{' '}
                  {currentLang === 'om' ? 'sanadoota' : currentLang === 'en' ? 'documents' : 'ሰነዶች'}
                </span>
              </div>
            </div>

            {/* Search and Category Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-slate-100">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={stakeholderSearchQuery}
                  onChange={(e) => setStakeholderSearchQuery(e.target.value)}
                  placeholder={
                    currentLang === 'om'
                      ? 'Maqaa, lakkoofsa Faayidaa, waajjira ykn gosa barnootaatiin barbaadi...'
                      : currentLang === 'en'
                      ? 'Search by name, Fayda ID, office or field of study...'
                      : 'ባለድርሻ አካል በስም፣ በፋይዳ ቁጥር፣ በጽሕፈት ቤት ወይም በትምህርት መስክ ፈልግ...'
                  }
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setStakeholderRoleFilter('all')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    stakeholderRoleFilter === 'all'
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {currentLang === 'om' ? 'Hunda' : currentLang === 'en' ? 'All' : 'ሁሉም'} ({currentSchoolStakeholders.length})
                </button>

                <button
                  type="button"
                  onClick={() => setStakeholderRoleFilter('library')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1 ${
                    stakeholderRoleFilter === 'library'
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{currentLang === 'om' ? 'Mana Kitaabaa' : currentLang === 'en' ? 'Library' : 'ቤተ-መጻሕፍት (Library)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStakeholderRoleFilter('leadership')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    stakeholderRoleFilter === 'leadership'
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {currentLang === 'om' ? 'Daarektaroota & Hoggansa' : currentLang === 'en' ? 'Principals & Leadership' : 'ርዕሰ መምህራን & አመራር'}
                </button>

                <button
                  type="button"
                  onClick={() => setStakeholderRoleFilter('academic')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    stakeholderRoleFilter === 'academic'
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {currentLang === 'om' ? 'Barsiisota & Laaboraatoorii' : currentLang === 'en' ? 'Teachers & Lab' : 'መምህራን & ላብራቶሪ'}
                </button>

                <button
                  type="button"
                  onClick={() => setStakeholderRoleFilter('support')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    stakeholderRoleFilter === 'support'
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {currentLang === 'om' ? 'Bulchiinsa & PTA' : currentLang === 'en' ? 'Admin & PTA' : 'አስተዳደር & PTA'}
                </button>
              </div>
            </div>
          </div>

          {/* Work Isolation Banner for Non-Admin Staff */}
          {!canManageStaff && (
            <div className="p-3 bg-emerald-950/90 text-emerald-100 border border-emerald-500/50 rounded-2xl text-xs flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                  🔒
                </span>
                <span>
                  {currentLang === 'om' ? (
                    <><strong>Fuula Profaayilii Daangeffame ({currentUser?.name}):</strong> Odeeffannoo seera-qabeessa keessan, Eenyummaa Faayidaa fi ragaaleen eebbaa keessan qofti adda baafameera.</>
                  ) : currentLang === 'en' ? (
                    <><strong>Isolated Staff Profile ({currentUser?.name}):</strong> Only your official profile, Fayda ID, and credentials are visible here.</>
                  ) : (
                    <><strong>የተከለለ የባለሙያ መገለጫ ገጽ ({currentUser?.name})፡</strong> የእርስዎ ይፋዊ መረጃ፣ የፋይዳ ብሔራዊ መታወቂያ እና የተመረቁባቸው ማስረጃዎች ብቻ ተለይተዋል (ሌሎች ሰራተኞች የእርስዎን አያዩም፤ እርስዎም የሌሎችን አያዩም)።</>
                  )}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 uppercase font-mono shrink-0">
                {currentLang === 'om' ? 'Daangaa Hojii Eegame' : currentLang === 'en' ? 'Isolated Scope' : 'የተከለለ የስራ ወሰን'}
              </span>
            </div>
          )}

          {/* Stakeholders Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStakeholders.length > 0 ? (
              filteredStakeholders.map((stk) => (
                <div
                  key={stk.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:border-emerald-500/60 transition-all flex flex-col justify-between space-y-4"
                >
                  {/* Top Details */}
                  <div className="space-y-3">
                    {/* Header: Photo, Name, Verified status */}
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        {stk.photoUrl ? (
                          <img
                            src={stk.photoUrl}
                            alt={stk.fullName}
                            className="w-13 h-15 object-cover rounded-xl border border-slate-300 shadow-xs"
                          />
                        ) : (
                          <div className="w-13 h-15 rounded-xl bg-emerald-900 text-white font-black text-lg flex items-center justify-center shadow-xs">
                            {stk.fullName.charAt(0)}
                          </div>
                        )}
                        {stk.faydaVerified && (
                          <div
                            className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full shadow-xs"
                            title={currentLang === 'om' ? 'Sirna Biyyaalessaa Faayidaatiin mirkanaa\'e' : currentLang === 'en' ? 'Verified by Fayda National ID' : 'በፋይዳ ብሔራዊ ስርዓት የተረጋገጠ'}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300">
                            {stk.roleCustomTitle || stk.role}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 leading-tight truncate">
                          {stk.fullName}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {stk.phone} · {stk.email || (currentLang === 'om' ? 'Odeeffannoo Seeraa' : currentLang === 'en' ? 'Official Info' : 'ይፋዊ መረጃ')}
                        </p>
                      </div>
                    </div>

                    {/* Profile Office / Department (ጽሕፈት ቤት) */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-900 font-bold mb-0.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                          {currentLang === 'om' ? 'Waajjira Profaayilii:' : currentLang === 'en' ? 'Office / Department:' : 'የፕሮፋይል ጽሕፈት ቤት:'}
                        </span>
                      </div>
                      <p className="font-extrabold text-slate-900 pl-5 leading-snug">
                        {stk.officeOrDepartment}
                      </p>
                    </div>

                    {/* Fayda ID Bar */}
                    <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-amber-800 block">
                          {currentLang === 'om' ? 'Eenyummaa Dijitaalaa Faayidaa:' : currentLang === 'en' ? 'Fayda National Digital ID:' : 'ፋይዳ ብሔራዊ ዲጂታል መታወቂያ:'}
                        </span>
                        <span className="font-mono font-black text-slate-900 text-xs">
                          {stk.faydaNumber}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyCode(stk.faydaNumber, `fayda-${stk.id}`)}
                        className="p-1 hover:bg-amber-100 rounded-lg text-amber-900 transition-colors"
                        title={currentLang === 'om' ? 'Lakkoofsa Faayidaa waraabi' : currentLang === 'en' ? 'Copy Fayda ID' : 'የፋይዳ ቁጥር ቅዳ'}
                      >
                        {copiedCodeId === `fayda-${stk.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-amber-800" />
                        )}
                      </button>
                    </div>

                    {/* Graduation Credentials List */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{currentLang === 'om' ? 'Ragaalee Eebbaa:' : currentLang === 'en' ? 'Credentials:' : 'የተመረቁባቸው ማስረጃዎች:'}</span>
                        </span>
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {stk.credentials?.length || 0} {currentLang === 'om' ? 'ragaalee' : currentLang === 'en' ? 'docs' : 'ማስረጃዎች'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {stk.credentials && stk.credentials.length > 0 ? (
                          stk.credentials.map((c, i) => (
                            <div
                              key={c.id || i}
                              className="text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-start justify-between gap-1.5"
                            >
                              <div className="min-w-0 flex-1">
                                <span className="font-bold text-emerald-950 inline-block mr-1">
                                  [{c.level}]
                                </span>
                                <span className="text-slate-800 font-semibold">{c.fieldOfStudy}</span>
                                <span className="text-slate-500 block text-[10px] truncate">
                                  {c.institution} ({c.graduationYear} {currentLang === 'om' ? 'A.L.I' : currentLang === 'en' ? 'E.C.' : 'ዓ.ም'})
                                </span>
                              </div>
                              {c.documentFileUrl && (
                                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                                  {currentLang === 'om' ? 'Sanadni Jira' : currentLang === 'en' ? 'Has File' : 'ሰነድ አለ'}
                                </span>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-[11px] text-slate-400 italic">
                            {currentLang === 'om' ? 'Ragaan hin maxxanfamne' : currentLang === 'en' ? 'No credentials attached' : 'ምንም ማስረጃ አልተያያዘም'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    {/* View Certificate Button (High priority) */}
                    <button
                      type="button"
                      onClick={() => setSelectedStakeholderForCert(stk)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-900 hover:to-teal-950 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                    >
                      <Award className="w-4 h-4 text-amber-300" />
                      <span>
                        {currentLang === 'om'
                          ? 'Waraqaa Ragaa Profaayilii Ilaali (Certificate)'
                          : currentLang === 'en'
                          ? 'View Official Profile Certificate'
                          : 'ይፋዊ የፕሮፋይል ምስክር ወረቀት እይ (Certificate)'}
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      {!isBureauRole && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingStakeholder(stk);
                            setShowStakeholderForm(true);
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <span>{currentLang === 'om' ? 'Sirreessi / Sanada Dabali' : currentLang === 'en' ? 'Edit / Add Doc' : 'አስተካክል / ሰነድ አክል'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => copyCode(stk.accessCode, `stk-code-${stk.id}`)}
                        className="inline-flex items-center gap-1 py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg text-xs font-mono font-bold border border-emerald-200 transition-colors"
                        title={currentLang === 'om' ? 'Koodii seensaa waraabi' : currentLang === 'en' ? 'Copy access code' : 'የመግቢያ ኮድ ቅዳ'}
                      >
                        <span>{currentLang === 'om' ? 'Koodii' : currentLang === 'en' ? 'Code' : 'ኮድ'}</span>
                        {copiedCodeId === `stk-code-${stk.id}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                      </button>

                      {canManageStaff && (
                        confirmDeleteStakeholderId === stk.id ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDeleteStakeholder(stk.id)}
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg transition-colors"
                            >
                              {currentLang === 'om' ? 'Mirkaneessi' : currentLang === 'en' ? 'Confirm' : 'አረጋግጥ'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteStakeholderId(null)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg transition-colors"
                            >
                              {currentLang === 'om' ? 'Dhiisi' : currentLang === 'en' ? 'Cancel' : 'ተወው'}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteStakeholderId(stk.id)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                            title={currentLang === 'om' ? 'Haqi' : currentLang === 'en' ? 'Delete' : 'ሰርዝ'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500 space-y-2">
                <Award className="w-10 h-10 mx-auto text-slate-300" />
                <h4 className="text-sm font-bold text-slate-800">
                  {currentLang === 'om' ? 'Qooda-fudhaan hin argamne' : currentLang === 'en' ? 'No stakeholders found' : 'ምንም ባለድርሻ አካል አልተገኘም'}
                </h4>
                <p className="text-xs text-slate-500">
                  {currentLang === 'om'
                    ? 'Jecha barbaachaa jijjiiraa ykn qooda-fudhaa haaraa galmeessaa'
                    : currentLang === 'en'
                    ? 'Try a different search term or register a new stakeholder'
                    : 'የፍለጋ ቃሉን ይቀይሩ ወይም አዲስ ባለድርሻ አካል ይመዝግቡ'}
                </p>
                {!isBureauRole && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStakeholder(null);
                      setShowStakeholderForm(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors mt-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{currentLang === 'om' ? 'Qooda-fudhaa Haaraa Galmeessi' : currentLang === 'en' ? 'Register Stakeholder' : 'አዲስ ባለድርሻ አካል መዝግብ'}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          5. Sub-Tab 2: User Access Codes for Director, Teacher, Student, Parent
         ========================================================================= */}
      {activeSubTab === 'codes' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-emerald-800" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {t.code_generation_title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{t.code_generation_desc}</p>
              </div>

              {!isBureauRole ? (
                <button
                  type="button"
                  onClick={() => setShowAddCodeModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.btn_generate_user_code}</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-100 text-amber-950 border border-amber-300 rounded-xl text-xs font-bold shrink-0">
                  <Lock className="w-3.5 h-3.5 text-amber-800" />
                  <span>
                    {currentLang === 'om'
                      ? 'Koodii Ilaaluu Qofa (Read-Only)'
                      : currentLang === 'en'
                      ? 'Read-Only Access'
                      : 'ኮዶች ማየት ብቻ (Read-Only)'}
                  </span>
                </div>
              )}
            </div>

            {/* Filter and Search Bar for Codes */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-slate-100">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={codeSearchQuery}
                  onChange={(e) => setCodeSearchQuery(e.target.value)}
                  placeholder={
                    currentLang === 'om'
                      ? 'Fayyadamaa maqaa ykn koodiidhaan barbaadi...'
                      : currentLang === 'en'
                      ? 'Search user by name or code...'
                      : 'ተጠቃሚ በስም ወይም በኮድ ፈልግ...'
                  }
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <select
                value={codeRoleFilter}
                onChange={(e) => setCodeRoleFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:outline-hidden"
              >
                <option value="all">
                  {currentLang === 'om' ? 'Gahee Hunda (All Roles)' : currentLang === 'en' ? 'All Roles' : 'ሁሉም ሚናዎች (All Roles)'}
                </option>
                <option value="school_director">
                  {currentLang === 'om' ? 'Daarektara (Director)' : currentLang === 'en' ? 'Director' : 'ዳይሬክተር (Director)'}
                </option>
                <option value="teacher">
                  {currentLang === 'om' ? 'Barsiisaa (Teacher)' : currentLang === 'en' ? 'Teacher' : 'መምህር (Teacher)'}
                </option>
                <option value="student">
                  {currentLang === 'om' ? 'Barataa (Student)' : currentLang === 'en' ? 'Student' : 'ተማሪ (Student)'}
                </option>
                <option value="parent">
                  {currentLang === 'om' ? 'Maatii (Parent)' : currentLang === 'en' ? 'Parent' : 'ወላጅ (Parent)'}
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredSchoolCodes.map((item) => {
              const roleLabel =
                item.role === 'school_director'
                  ? currentLang === 'om'
                    ? 'Daarektara (Director)'
                    : currentLang === 'en'
                    ? 'Director'
                    : 'ዳይሬክተር (Director)'
                  : item.role === 'teacher'
                  ? currentLang === 'om'
                    ? 'Barsiisaa (Teacher)'
                    : currentLang === 'en'
                    ? 'Teacher'
                    : 'መምህር (Teacher)'
                  : item.role === 'student'
                  ? currentLang === 'om'
                    ? 'Barataa (Student)'
                    : currentLang === 'en'
                    ? 'Student'
                    : 'ተማሪ (Student)'
                  : currentLang === 'om'
                  ? 'Maatii (Parent)'
                  : currentLang === 'en'
                  ? 'Parent'
                  : 'ወላጅ (Parent)';

              const rolePillClass =
                item.role === 'school_director'
                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                  : item.role === 'teacher'
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : item.role === 'student'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200';

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${rolePillClass}`}>
                        {roleLabel}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.createdAt}</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {item.fullName}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {currentLang === 'om'
                        ? 'Itti-gaafatamummaa / Kutaa:'
                        : currentLang === 'en'
                        ? 'Role / Class:'
                        : 'ኃላፊነት / ክፍል፡'}{' '}
                      <strong>{item.assignedClassOrSubject}</strong>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">
                        {currentLang === 'om' ? 'Koodii Seensaa' : currentLang === 'en' ? 'Access Code' : 'የመግቢያ ኮድ'}
                      </span>
                      <span className="font-mono font-bold text-emerald-950 text-xs sm:text-sm">
                        {item.accessCode}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyCode(item.accessCode, item.id)}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedCodeId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">
                            {currentLang === 'om' ? 'Garagalfameera' : currentLang === 'en' ? 'Copied' : 'ተቀድቷል'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>
                            {currentLang === 'om' ? 'Koodii Garagalchi' : currentLang === 'en' ? 'Copy Code' : 'ኮድ ቅዳ'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          5. Sub-Tab 3: Submit Semester Report to City Education Bureau
         ========================================================================= */}
      {activeSubTab === 'submit_report' && (
        !isBureauConnected ? (
          <div className="bg-white rounded-2xl border border-amber-300/80 p-6 sm:p-10 shadow-xs max-w-2xl mx-auto text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                {currentLang === 'om'
                  ? '🔒 Walqunnamtiin Biiroo Barnootaa Cufameera (Bureau Locked)'
                  : currentLang === 'en'
                  ? '🔒 Education Bureau Connection Locked'
                  : '🔒 የትምህርት ቢሮ ግንኙነት ተዘግቷል (Bureau Locked)'}
              </span>
              <h3 className="text-base sm:text-xl font-black text-slate-900">
                {currentLang === 'om'
                  ? 'Gara Biiroo Barnootaa Bulchiinsa Magaalaa Shaashamanneetti Gabaasa Erguun Hin Hayyamamne'
                  : currentLang === 'en'
                  ? 'Sending Reports to Shashemene City Education Bureau is Currently Restricted'
                  : 'ለሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ ሪፖርት መላክ አልተፈቀደም'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                {currentLang === 'om'
                  ? 'Odeeffannoo qooda-fudhattootaa fi barattoota mana barumsaa erga guuttanii booda beekamtiif gara Biiroo Barnootaatti gabaasa erguuf kaffaltii hayyamaa misoomsaa siistemaa (Taamraat Allee) baankiin raawwattanii nagahee erguu qabdu. Yeroo misoomsaan mirkaneessu walqunnamtiin battalumatti banama.'
                  : currentLang === 'en'
                  ? 'After registering your school stakeholders and students, pay the developer license fee (Tamerat Ale) via bank and upload the receipt to send official reports to the Bureau. Connection unlocks immediately upon approval.'
                  : 'የትምህርት ቤቱን ባለድርሻ አካላትና ተማሪዎችን መረጃ ካጠናቀቁ በኋላ ለእውቅና ወደ ትምህርት ቢሮ ሪፖርት ለመላክ ለሲስተም አበልፃጊ (ታምራት ዓለ) የፈቃድ ክፍያ በባንክ ፈጽመው ደረሰኝ መላክ አለብዎት። በአበልፃጊው ሲረጋገጥ ግንኙነቱ ወዲያውኑ ይከፈታል።'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2 font-mono text-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">
                  {currentLang === 'om' ? 'Maqaa Mana Barnootaa:' : currentLang === 'en' ? 'School Name:' : 'የትምህርት ቤት ስም፡'}
                </span>
                <span className="font-bold text-slate-900 font-sans">{currentSchool.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">
                  {currentLang === 'om' ? 'Haala Kaffaltii Hayyama Misoomsaa:' : currentLang === 'en' ? 'Developer License Status:' : 'የአበልፃጊ ፈቃድ ክፍያ ሁኔታ፡'}
                </span>
                <span className="font-bold text-amber-600 font-sans">
                  {currentSchool.developerPaymentStatus === 'receipt_submitted'
                    ? currentLang === 'om'
                      ? '📩 Nagaheen Dhiyaateera (Eegamaa jira)'
                      : currentLang === 'en'
                      ? '📩 Receipt Submitted (Pending)'
                      : '📩 ደረሰኝ ቀርቧል (በመጠባበቅ ላይ)'
                    : currentSchool.developerPaymentStatus === 'rejected'
                    ? currentLang === 'om'
                      ? '❌ Nagaheen Kufaa Ta\'eera'
                      : currentLang === 'en'
                      ? '❌ Receipt Rejected'
                      : '❌ ደረሰኝ ውድቅ ተደርጓል'
                    : currentLang === 'om'
                    ? 'Hin Kaffalamne (Pending Payment)'
                    : currentLang === 'en'
                    ? 'Pending Payment'
                    : 'ያልከፈለ (Pending Payment)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">
                  {currentLang === 'om' ? 'Hanga Kaffaltii:' : currentLang === 'en' ? 'Fee Amount:' : 'የክፍያ መጠን፡'}
                </span>
                <span className="font-bold text-emerald-700">
                  {currentLang === 'om' ? 'Qarshii 5,000 (ETB)' : currentLang === 'en' ? '5,000 ETB' : '5,000 ብር (ETB)'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeveloperPaymentModal(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  {currentSchool.developerPaymentStatus === 'receipt_submitted'
                    ? currentLang === 'om'
                      ? 'Haala Nagahee Ergamee Ilaali'
                      : currentLang === 'en'
                      ? 'View Submitted Receipt Status'
                      : 'የተላከውን ደረሰኝ ሁኔታ ተመልከት'
                    : currentLang === 'om'
                    ? '💳 Baankiin Kaffalaatii Nagahee Ergaa'
                    : currentLang === 'en'
                    ? '💳 Pay via Bank & Upload Receipt'
                    : '💳 በባንክ ከፍለው ደረሰኝ ይላኩ'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs max-w-2xl mx-auto space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {currentLang === 'om'
                    ? 'Ergii Gabaasa Qabxii Barattootaa Gara Biiroo Barnootaa Shaashamannee'
                    : currentLang === 'en'
                    ? 'Submit Student Results Report to Shashemene Education Bureau'
                    : 'የትምህርት ቤት የተማሪዎች ውጤት ሪፖርት ለሻሸመኔ ትምህርት ቢሮ ማስገቢያ'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentLang === 'om'
                    ? 'Cuunfaa qabxii qormaataa, hamma darbinsaa fi qabxii olaanaa gara Biiroo Barnootaa magaalaatti ergaa.'
                    : currentLang === 'en'
                    ? 'Send exam summary, pass rates, and top student scores to the City Education Bureau.'
                    : 'የፈተና ውጤት ማጠቃለያ፣ የማለፍ ምጣኔ እና ከፍተኛ ውጤቶችን ለከተማው ትምህርት ቢሮ ይላኩ።'}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {currentLang === 'om' ? 'Biiroo Waliin Walqunnameera' : currentLang === 'en' ? 'Bureau Connected' : 'ቢሮ የተገናኘ'}
              </span>
            </div>

            {reportSubmittedSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  {currentLang === 'om'
                    ? 'Gabaasni qabxii gara Biiroo Barnootaa Bulchiinsa Magaalaa Shaashamanneetti milkaa\'inaan ergameera! Biiroon qoratamee mirkanaa\'a.'
                    : currentLang === 'en'
                    ? 'Results report submitted successfully to Shashemene City Education Bureau for review and approval.'
                    : 'የውጤት ሪፖርቱ ለሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ በተሳካ ሁኔታ ተልኳል! በቢሮው ተገምግሞ ይጸድቃል።'}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmitReportToBureau} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Bara Barnootaa (Academic Year)' : currentLang === 'en' ? 'Academic Year' : 'የትምህርት ዘመን (Academic Year)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={reportAcademicYear}
                    onChange={(e) => setReportAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Yeroo Seemisteeraa' : currentLang === 'en' ? 'Semester Term' : 'የሴሚስተር ወቅት'}
                  </label>
                  <select
                    value={reportSemester}
                    onChange={(e) =>
                      setReportSemester(e.target.value as 'Semester 1' | 'Semester 2' | 'Annual')
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden"
                  >
                    <option value="Semester 1">
                      {currentLang === 'om' ? 'Seemisteera 1 (Semester 1)' : currentLang === 'en' ? 'Semester 1' : 'ሴሚስተር 1 (Semester 1)'}
                    </option>
                    <option value="Semester 2">
                      {currentLang === 'om' ? 'Seemisteera 2 (Semester 2)' : currentLang === 'en' ? 'Semester 2' : 'ሴሚስተር 2 (Semester 2)'}
                    </option>
                    <option value="Annual">
                      {currentLang === 'om' ? 'Waliigala Waggaa (Annual)' : currentLang === 'en' ? 'Annual Summary' : 'ዓመታዊ ጠቅላላ (Annual)'}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLang === 'om' ? 'Sadarkaa Kutaalee' : currentLang === 'en' ? 'Grade Levels' : 'የክፍል ደረጃዎች'}
                </label>
                <input
                  type="text"
                  required
                  value={reportGradeLevel}
                  onChange={(e) => setReportGradeLevel(e.target.value)}
                  placeholder={
                    currentLang === 'om'
                      ? 'Fakkeenyaaf: Kutaa 9 - 12 ykn Kutaalee Hunda'
                      : currentLang === 'en'
                      ? 'e.g. Grades 9 - 12 or All Grades'
                      : 'ምሳሌ፡ Grades 9 - 12 ወይም All Grades'
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-slate-800 block">
                  {currentLang === 'om'
                    ? 'Istaatistiksii Siistemichaan Ofumaan Herregame:'
                    : currentLang === 'en'
                    ? 'Auto-Calculated System Statistics:'
                    : 'ከሲስተሙ በራስ-ሰር የተሰላ ስታትስቲክስ፡'}
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <span>
                    {currentLang === 'om' ? 'Qoramtoota Waliigalaa:' : currentLang === 'en' ? 'Total Examinees:' : 'አጠቃላይ ተፈታኞች:'}{' '}
                    <strong>
                      {students.length} {currentLang === 'om' ? 'Barattoota' : currentLang === 'en' ? 'Students' : 'ተማሪዎች'}
                    </strong>
                  </span>
                  <span>
                    {currentLang === 'om' ? 'Hamma Darbinsaa:' : currentLang === 'en' ? 'Pass Rate:' : 'የማለፍ ምጣኔ:'}{' '}
                    <strong className="text-emerald-800">94.2%</strong>
                  </span>
                  <span>
                    {currentLang === 'om' ? 'Giddugaleessa Qabxii:' : currentLang === 'en' ? 'Average Score:' : 'አማካይ ውጤት:'}{' '}
                    <strong>85.4 / 100</strong>
                  </span>
                  <span>
                    {currentLang === 'om' ? 'Qabxii Olaanaa:' : currentLang === 'en' ? 'Top Score:' : 'ከፍተኛ ውጤት:'}{' '}
                    <strong>98.6% ({currentLang === 'om' ? 'Kiyaar Kadiir' : currentLang === 'en' ? 'Kiyar Kedir' : 'ኪያር ከድር'})</strong>
                  </span>
                </div>
              </div>

              {!isBureauRole ? (
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {currentLang === 'om'
                      ? 'Gabaasa Gara Biiroo Barnootaa Magaalaatti Ergi'
                      : currentLang === 'en'
                      ? 'Send Report to City Education Bureau'
                      : 'ሪፖርቱን ለከተማ ትምህርት ቢሮ ላክ'}
                  </span>
                </button>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-center text-xs font-bold text-amber-950 flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4 text-amber-800" />
                  <span>
                    {currentLang === 'om'
                      ? 'Ilaalcha Biiroo Barnootaa: Gabaasa kan ergu Daarektara Mana Barumsaa qofa (Ilaaluu Qofa)'
                      : currentLang === 'en'
                      ? 'Bureau View: Only the School Director can submit reports (Read-Only)'
                      : 'የትምህርት ቢሮ እይታ፡ ሪፖርት የሚልኩት የትምህርት ቤቱ ዳይሬክተር ብቻ ናቸው (ማየት ብቻ)'}
                  </span>
                </div>
              )}
            </form>
          </div>
        )
      )}

      {/* =========================================================================
          5b. Sub-Tab: School Owner & Board Governance
         ========================================================================= */}
      {activeSubTab === 'owner_board' && (
        <SchoolOwnerBoardView
          school={currentSchool}
          currentLang={currentLang}
          onSchoolUpdate={(updated) => {
            setCurrentSchool(updated);
            StorageService.updateSchool(updated);
            if (onSchoolUpdate) onSchoolUpdate(updated);
          }}
          onNavigateToTab={(tab) => {
            if (
              tab === 'stakeholders' ||
              tab === 'owner_board' ||
              tab === 'notices' ||
              tab === 'homework_attendance' ||
              tab === 'finance' ||
              tab === 'registrar' ||
              tab === 'roster' ||
              tab === 'codes' ||
              tab === 'submit_report'
            ) {
              setActiveSubTab(tab);
            }
          }}
        />
      )}

      {/* =========================================================================
          5c. Sub-Tab: Notice Board & Announcements
         ========================================================================= */}
      {activeSubTab === 'notices' && (
        <SchoolNoticeBoard
          schoolId={currentSchool.id}
          schoolName={currentSchool.name}
          currentUser={currentUser}
          currentLang={currentLang}
        />
      )}

      {/* =========================================================================
          5d. Sub-Tab: Homework & Daily Attendance
         ========================================================================= */}
      {activeSubTab === 'homework_attendance' && (
        <HomeworkAndAttendanceManager
          school={currentSchool}
          students={students}
          currentUser={currentUser}
          currentLang={currentLang}
        />
      )}

      {/* =========================================================================
          5d-2. Sub-Tab: Official Bureau Subject Training Dispatches
         ========================================================================= */}
      {activeSubTab === 'teacher_training' && (
        <TeacherSubjectTrainingDesk
          school={currentSchool}
          currentUser={currentUser}
          currentLang={currentLang}
        />
      )}

      {/* =========================================================================
          5d-3. Sub-Tab: Student QR Attendance Desk (Direct Check-in, Kiosk & Display)
         ========================================================================= */}
      {activeSubTab === 'qr_attendance' && (
        <StudentQRAttendanceView
          school={currentSchool}
          students={students}
          currentUser={currentUser}
          currentLang={currentLang}
        />
      )}

      {/* =========================================================================
          5d-4. Sub-Tab: Teacher Appraisal & Student/Parent Feedback Desk
         ========================================================================= */}
      {activeSubTab === 'teacher_evaluations' && (
        <BureauTeacherAppraisalView
          currentLang={currentLang}
          currentUser={currentUser}
          schools={[currentSchool]}
          initialSchoolFilter={currentSchool.id}
          isEmbeddedInSchool={true}
        />
      )}

      {/* =========================================================================
          5e. Sub-Tab: School Finance & Tuition Fees
         ========================================================================= */}
      {activeSubTab === 'finance' && (
        <SchoolFinanceView
          school={currentSchool}
          students={students}
          currentUser={currentUser}
          currentLang={currentLang}
        />
      )}

      {/* =========================================================================
          5f. Sub-Tab: Registrar, Admissions & Org Structure ("ተማሪን ማን ይመዘግባል? መምህርን ማን ይመዘገባል?")
         ========================================================================= */}
      {activeSubTab === 'registrar' && (
        <SchoolRegistrarView
          school={currentSchool}
          students={students}
          onStudentsChange={onStudentsChange}
          currentUser={currentUser}
          currentLang={currentLang}
        />
      )}

      {/* =========================================================================
          5g. Sub-Tab: School Library Desk (Isolated for Librarian)
         ========================================================================= */}
      {activeSubTab === 'library_desk' && (
        <SchoolLibraryDesk
          school={currentSchool}
          currentUser={currentUser}
          currentLang={currentLang}
        />
      )}

      {/* =========================================================================
          5h. Sub-Tab: Academic Grade Collection & Multi-Tier Approval Workflow Desk
          መምህራን ለክፍል ተጠሪ -> ክፍል ተጠሪ ለዳይሬክተር -> ዳይሬክተር አጽድቆ ለተማሪ፣ ወላጅና ትምህርት ቢሮ
         ========================================================================= */}
      {activeSubTab === 'grade_workflow' && (
        <GradeApprovalWorkflowDesk
          school={currentSchool}
          students={students}
          currentUser={currentUser}
          currentLang={currentLang}
          onRefreshParentState={() => {
            const refreshed = StorageService.getStudents(currentSchool.id);
            onStudentsChange(refreshed);
          }}
        />
      )}

      {/* =========================================================================
          5i. Sub-Tab: Night School Extension Program Desk (የማታ ትምህርት ፕሮግራም ዴስክ)
         ========================================================================= */}
      {activeSubTab === 'night_school' && (
        <NightSchoolDesk
          school={currentSchool}
          students={students}
          onStudentsChange={onStudentsChange}
          currentUser={currentUser}
          currentLang={currentLang}
          onOpenReportCard={(st) => setSelectedStudentForCard(st)}
        />
      )}

      {/* =========================================================================
          5j. Sub-Tab: Student Misconduct Tip-off & Director Discipline Desk
          ተማሪዎች እና ወላጆች ስነ ምግባር ችግር ያለባቸውን ተማሪዎች ለዳይሬክተር መጠቆሚያ + የክፍል ተማሪዎች ዝርዝር
         ========================================================================= */}
      {activeSubTab === 'student_discipline' && (
        <StudentDisciplineDesk
          school={currentSchool}
          students={students}
          currentUser={currentUser}
          currentLang={currentLang}
        />
      )}

      {/* =========================================================================
          6. Official Student Report Card (ካርድ) Modal
         ========================================================================= */}
      {selectedStudentForCard && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-slate-100 space-y-4 my-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header featuring School Logo */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <SchoolLogo
                  logoUrl={currentSchool.logoUrl}
                  schoolName={currentSchool.name}
                  size={52}
                  shape="rounded"
                />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {currentSchool.name}
                  </h3>
                  <p className="text-xs text-emerald-800 font-semibold">
                    {currentLang === 'om'
                      ? 'Kaardii Qabxii Seera-Qabeessa Barataa (Official Report Card)'
                      : currentLang === 'en'
                      ? 'Official Student Academic Report Card'
                      : 'የተማሪ ይፋዊ የውጤት ካርድ (Official Student Academic Report Card)'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {currentSchool.subcity} ·{' '}
                    {currentLang === 'om'
                      ? 'Magaalaa Shaashamannee'
                      : currentLang === 'en'
                      ? 'Shashemene City'
                      : 'ሻሸመኔ ከተማ'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudentForCard(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Student metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 block">
                  {currentLang === 'om' ? 'Maqaa Barataa' : currentLang === 'en' ? 'Student Name' : 'የተማሪው ስም'}
                </span>
                <strong className="text-slate-900">{selectedStudentForCard.fullName}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">
                  {currentLang === 'om' ? 'Kutaa fi Daree' : currentLang === 'en' ? 'Grade & Section' : 'ክፍል እና ክፍልፋይ'}
                </span>
                <strong className="text-slate-900">
                  {currentLang === 'om' ? 'Kutaa' : 'Grade'} {selectedStudentForCard.grade} - {selectedStudentForCard.section}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">
                  {currentLang === 'om' ? 'Sadarkaa Daree (Rank)' : currentLang === 'en' ? 'Class Rank' : 'የክፍል ደረጃ (Rank)'}
                </span>
                <strong className="text-emerald-900 font-extrabold text-sm">
                  #{selectedStudentForCard.rank}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">
                  {currentLang === 'om' ? 'Qabxii Naamusaa' : currentLang === 'en' ? 'Conduct Grade' : 'የስነ-ምግባር ውጤት'}
                </span>
                <strong className="text-emerald-800 font-bold">{selectedStudentForCard.conduct}</strong>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
                  <tr>
                    <th className="px-3 py-2">
                      {currentLang === 'om' ? 'Gosa Barnootaa' : currentLang === 'en' ? 'Subject' : 'የትምህርት አይነት'}
                    </th>
                    <th className="px-2 py-2">
                      {currentLang === 'om' ? 'Hojii (20%)' : currentLang === 'en' ? 'Work (20%)' : 'ስራ (20%)'}
                    </th>
                    <th className="px-2 py-2">
                      {currentLang === 'om' ? 'Walakkaa (30%)' : currentLang === 'en' ? 'Mid (30%)' : 'ግማሽ (30%)'}
                    </th>
                    <th className="px-2 py-2">
                      {currentLang === 'om' ? 'Xumuraa (50%)' : currentLang === 'en' ? 'Final (50%)' : 'መጨረሻ (50%)'}
                    </th>
                    <th className="px-2 py-2">
                      {currentLang === 'om' ? 'Ida\'ama (100%)' : currentLang === 'en' ? 'Total (100%)' : 'ድምር (100%)'}
                    </th>
                    <th className="px-2 py-2 text-center">
                      {currentLang === 'om' ? 'Qubee' : currentLang === 'en' ? 'Grade' : 'ፊደል'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {selectedStudentForCard.scores.map((sc, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-3 py-1.5 font-semibold text-slate-900">
                        {sc.subject}
                      </td>
                      <td className="px-2 py-1.5">{sc.quiz1 + sc.quiz2}</td>
                      <td className="px-2 py-1.5">{sc.midExam}</td>
                      <td className="px-2 py-1.5">{sc.finalExam}</td>
                      <td className="px-2 py-1.5 font-bold text-slate-900">{sc.total}</td>
                      <td className="px-2 py-1.5 text-center font-bold text-emerald-800">
                        {sc.gradeLetter}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary statistics */}
            <div className="flex flex-wrap items-center justify-between text-xs bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 gap-2">
              <div>
                <span className="text-slate-500">
                  {currentLang === 'om' ? 'Ida\'ama Waliigalaa: ' : currentLang === 'en' ? 'Total Score: ' : 'አጠቃላይ ድምር: '}
                </span>
                <strong className="text-emerald-950 font-extrabold text-sm">
                  {selectedStudentForCard.scores.reduce((a, b) => a + b.total, 0)}
                </strong>
                <span className="text-slate-400 ml-1">
                  / {selectedStudentForCard.scores.length * 100}
                </span>
              </div>
              <div>
                <span className="text-slate-500">
                  {currentLang === 'om' ? 'Giddugaleessa: ' : currentLang === 'en' ? 'Average: ' : 'አማካይ: '}
                </span>
                <strong className="text-emerald-950 font-extrabold text-sm">
                  {(
                    selectedStudentForCard.scores.reduce((a, b) => a + b.total, 0) /
                    Math.max(selectedStudentForCard.scores.length, 1)
                  ).toFixed(1)}
                  %
                </strong>
              </div>
              <div>
                <span className="text-slate-500">
                  {currentLang === 'om' ? 'Hirmaannaa Argamuu: ' : currentLang === 'en' ? 'Attendance Rate: ' : 'የመገኘት ምጣኔ: '}
                </span>
                <strong className="text-slate-900 font-bold">
                  {selectedStudentForCard.attendanceRate}%
                </strong>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t.btn_print_card}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStudentForCard(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                {currentLang === 'om' ? 'Cufi' : currentLang === 'en' ? 'Close' : 'ዝጋ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          7. Add New User Code Modal
         ========================================================================= */}
      {showAddCodeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">{t.btn_generate_user_code}</h3>
              <button
                type="button"
                onClick={() => setShowAddCodeModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateUserCode} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.select_role} *
                </label>
                <select
                  value={targetRole}
                  onChange={(e) =>
                    setTargetRole(
                      e.target.value as 'school_director' | 'teacher' | 'student' | 'parent'
                    )
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden"
                >
                  <option value="school_director">
                    {currentLang === 'om' ? 'Daarektara / Durabu\'aa (Director)' : currentLang === 'en' ? 'Director / Principal' : 'ዳይሬክተር / ርዕሰ መምህር (Director)'}
                  </option>
                  <option value="teacher">
                    {currentLang === 'om' ? 'Barsiisaa (Teacher)' : currentLang === 'en' ? 'Teacher' : 'መምህር (Teacher)'}
                  </option>
                  <option value="student">
                    {currentLang === 'om' ? 'Barataa (Student)' : currentLang === 'en' ? 'Student' : 'ተማሪ (Student)'}
                  </option>
                  <option value="parent">
                    {currentLang === 'om' ? 'Maatii (Parent)' : currentLang === 'en' ? 'Parent' : 'ወላጅ (Parent)'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.user_full_name} *
                </label>
                <input
                  type="text"
                  required
                  value={targetFullName}
                  onChange={(e) => setTargetFullName(e.target.value)}
                  placeholder={currentLang === 'om' ? 'Maqaa galchi...' : currentLang === 'en' ? 'Enter full name...' : 'ስም አስገባ...'}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.assigned_section} *
                </label>
                <input
                  type="text"
                  required
                  value={targetAssignment}
                  onChange={(e) => setTargetAssignment(e.target.value)}
                  placeholder={
                    currentLang === 'om'
                      ? 'Fakkeenyaaf: Herrega 10A fi 10B ykn Kutaa 10 Daree A'
                      : currentLang === 'en'
                      ? 'e.g. Math 10A & 10B or Grade 10 Section A'
                      : 'ምሳሌ፡ ሂሳብ 10A እና 10B ወይም Grade 10 Section A'
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900">
                {currentLang === 'om'
                  ? 'Koodiin addaa fayyadamaan kun ittiin gara siistemichaa seenu ofumaan uumama.'
                  : currentLang === 'en'
                  ? 'A unique access code for this user to log into the system will be generated automatically.'
                  : 'ይህ ተጠቃሚ ወደ ሲስተሙ የሚገባበት ልዩ የይለፍ ኮድ በራስ-ሰር ይፈጠራል።'}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCodeModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {currentLang === 'om' ? 'Haqi' : currentLang === 'en' ? 'Cancel' : 'ሰርዝ'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs"
                >
                  {currentLang === 'om' ? 'Koodii Uumi' : currentLang === 'en' ? 'Generate Code' : 'ኮድ ፍጠር'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          8. Add Student Modal
         ========================================================================= */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {currentLang === 'om' ? 'Barataa Haaraa Galmeessi' : currentLang === 'en' ? 'Register New Student' : 'አዲስ ተማሪ መዝግብ'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddStudentModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLang === 'om' ? 'Maqaa Guutuu Barataa *' : currentLang === 'en' ? 'Student Full Name *' : 'የተማሪው ሙሉ ስም *'}
                </label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder={currentLang === 'om' ? 'Maqaa...' : currentLang === 'en' ? 'Name...' : 'ስም...'}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLang === 'om' ? 'Gosa Shifitii (Shift) *' : currentLang === 'en' ? 'Shift Type *' : 'የፈረቃ ዓይነት (Shift) *'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewStudentShift('regular_day');
                      if (newStudentSection.startsWith('N')) {
                        setNewStudentSection(newStudentSection.replace(/^N/, '') || 'A');
                      }
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      newStudentShift === 'regular_day'
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs font-black'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>
                      {currentLang === 'om' ? '☀️ Barataa Guyyaa' : currentLang === 'en' ? '☀️ Day Student' : '☀️ የቀን ተማሪ'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewStudentShift('night_shift');
                      if (!newStudentSection.startsWith('N')) {
                        setNewStudentSection(`N${newStudentSection}`);
                      }
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      newStudentShift === 'night_shift'
                        ? 'bg-indigo-950 text-indigo-100 border-indigo-800 shadow-2xs font-black'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-300" />
                    <span>
                      {currentLang === 'om' ? '🌙 Barataa Galgalaa' : currentLang === 'en' ? '🌙 Night Student' : '🌙 የማታ ተማሪ'}
                    </span>
                  </button>
                </div>
              </div>

              {newStudentShift === 'night_shift' && (
                <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-200 space-y-2.5">
                  <div className="text-[11px] font-bold text-indigo-900 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-700" />
                    <span>
                      {currentLang === 'om'
                        ? 'Odeeffannoo Hojii Guyyaa fi Bakka Hojii Barataa Galgalaa'
                        : currentLang === 'en'
                        ? 'Night Student Daytime Occupation & Workplace'
                        : 'የማታ ተማሪ የቀን ስራና የስራ ቦታ መረጃ'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-indigo-900 mb-0.5">
                        {currentLang === 'om' ? 'Ogummaa / Hojii Guyyaa' : currentLang === 'en' ? 'Daytime Occupation' : 'የቀን ሙያ / ስራ'}
                      </label>
                      <input
                        type="text"
                        value={newStudentOccupation}
                        onChange={(e) => setNewStudentOccupation(e.target.value)}
                        placeholder={
                          currentLang === 'om'
                            ? 'Fakkeenyaaf: Hojjetaa Mootummaa, Daldalaa...'
                            : currentLang === 'en'
                            ? 'e.g. Civil Servant, Merchant...'
                            : 'ምሳሌ፡ የመንግስት ሰራተኛ፣ ነጋዴ...'
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-indigo-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-indigo-900 mb-0.5">
                        {currentLang === 'om' ? 'Bakka Hojii / Dhaabbata' : currentLang === 'en' ? 'Workplace / Organization' : 'የመስሪያ ቦታ / ድርጅት'}
                      </label>
                      <input
                        type="text"
                        value={newStudentWorkplace}
                        onChange={(e) => setNewStudentWorkplace(e.target.value)}
                        placeholder={
                          currentLang === 'om'
                            ? 'Fakkeenyaaf: Buufata Fayyaa Shaashamannee...'
                            : currentLang === 'en'
                            ? 'e.g. Shashemene Health Center...'
                            : 'ምሳሌ፡ ሻሸመኔ ጤና ጣቢያ...'
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-indigo-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Saala' : currentLang === 'en' ? 'Gender' : 'ፆታ'}
                  </label>
                  <select
                    value={newStudentGender}
                    onChange={(e) => setNewStudentGender(e.target.value as 'M' | 'F')}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="M">
                      {currentLang === 'om' ? 'Dhiira (M)' : currentLang === 'en' ? 'Male (M)' : 'ወንድ (M)'}
                    </option>
                    <option value="F">
                      {currentLang === 'om' ? 'Dubara (F)' : currentLang === 'en' ? 'Female (F)' : 'ሴት (F)'}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Kutaa' : currentLang === 'en' ? 'Grade' : 'ክፍል'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={newStudentGrade}
                    onChange={(e) => setNewStudentGrade(Number(e.target.value))}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Daree' : currentLang === 'en' ? 'Section' : 'ክፍልፋይ'}
                  </label>
                  <input
                    type="text"
                    value={newStudentSection}
                    onChange={(e) => setNewStudentSection(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLang === 'om' ? 'Maqaa Guutuu Maatii *' : currentLang === 'en' ? 'Parent Full Name *' : 'የወላጅ ሙሉ ስም *'}
                </label>
                <input
                  type="text"
                  required
                  value={newParentName}
                  onChange={(e) => setNewParentName(e.target.value)}
                  placeholder={currentLang === 'om' ? 'Obbo / Aadde...' : currentLang === 'en' ? 'Mr./Ms....' : 'አቶ/ወ/ሮ...'}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLang === 'om' ? 'Lakkoofsa Bilbilaa Maatii *' : currentLang === 'en' ? 'Parent Phone Number *' : 'የወላጅ ስልክ ቁጥር *'}
                </label>
                <input
                  type="tel"
                  required
                  value={newParentPhone}
                  onChange={(e) => setNewParentPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {currentLang === 'om' ? 'Haqi' : currentLang === 'en' ? 'Cancel' : 'ሰርዝ'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs"
                >
                  {currentLang === 'om' ? 'Galmeessiitii Koodii Uumi' : currentLang === 'en' ? 'Register & Generate Code' : 'መዝግብ እና ኮድ አፍልቅ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          9. Student ID Card Modal (Updated with School Logo)
         ========================================================================= */}
      {selectedStudentForIdCard && (
        <StudentIDCardModal
          isOpen={!!selectedStudentForIdCard}
          onClose={() => setSelectedStudentForIdCard(null)}
          currentLang={currentLang}
          student={selectedStudentForIdCard}
          schoolName={currentSchool.name}
          school={currentSchool}
        />
      )}

      {/* =========================================================================
          10. School Profile Logo Setup Modal
         ========================================================================= */}
      <SchoolLogoModal
        isOpen={showLogoModal}
        onClose={() => setShowLogoModal(false)}
        currentLang={currentLang}
        school={currentSchool}
        onSaveLogo={handleSaveLogo}
      />

      {/* =========================================================================
          11. Stakeholder Official Profile Certificate Modal
         ========================================================================= */}
      {selectedStakeholderForCert && (
        <StakeholderCertificateModal
          stakeholder={selectedStakeholderForCert}
          school={currentSchool}
          currentLang={currentLang}
          onClose={() => setSelectedStakeholderForCert(null)}
        />
      )}

      {/* =========================================================================
          12. Stakeholder Registration & Credential Edit Modal
         ========================================================================= */}
      {showStakeholderForm && (
        <StakeholderFormModal
          isOpen={showStakeholderForm}
          onClose={() => {
            setShowStakeholderForm(false);
            setEditingStakeholder(null);
          }}
          onSave={handleSaveStakeholder}
          currentLang={currentLang}
          school={currentSchool}
          editingStakeholder={editingStakeholder}
        />
      )}

      {/* =========================================================================
          13. School Roles & Organizational Structure Guide Modal
              (ባለቤት፣ ዳይሬክተር፣ መምህር፣ ተማሪ፣ ወላጅ፣ ሒሳብ ሰራተኛ፣ ሬጅስትራር፣ የሰው ኃይል)
         ========================================================================= */}
      {showRoleGuideModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-slate-100 space-y-4 my-6 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {currentLang === 'om'
                      ? 'Qajeelfama Caasaa, Gahee Hojii fi Aangoo Mana Barnootaa'
                      : currentLang === 'en'
                      ? 'School Roles, Organizational Responsibilities & Authority Matrix'
                      : 'የትምህርት ቤት መዋቅር፣ የስራ ድርሻና ስልጣን መመሪያ'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentLang === 'om'
                      ? 'Gahee Hojii Mana Barumsaa, Itti-Gaafatamummaa fi Matrix Aangoo'
                      : currentLang === 'en'
                      ? 'Complete Digital Governance & Role Breakdown'
                      : 'School Roles, Organizational Responsibilities & Authority Matrix'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRoleGuideModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Quick overview alert banner */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>
                  {currentLang === 'om'
                    ? 'Qajeelfama Hojii Seera-Qabeessa Siistema Mana Barumsaa:'
                    : currentLang === 'en'
                    ? 'Official School System Workflow Guide:'
                    : 'ይፋዊ የትምህርት ቤት ሲስተም አሰራር መመሪያ፡'}
                </strong>{' '}
                {currentLang === 'om'
                  ? 'Siistemni kun qooda-fudhattoota mana barumsaa hunda walqunnamsiisuun abbaa mana barumsaa, daarektara, barsiisota, barattoota, maatii, hojjetaa herregaa fi reejistiraarri gahee isaanii bifa dijitaalaatiin akka bahatan taasisa.'
                  : currentLang === 'en'
                  ? 'This system connects every school stakeholder—Owner, Principal, Teachers, Students, Parents, Finance Officer, and Registrar—so each role performs its duties digitally.'
                  : 'ይህ ሲስተም በአንድ ትምህርት ቤት ውስጥ የሚገኙትን ባለድርሻ አካላት በሙሉ በማስተሳሰር ባለቤቱ፣ ዳይሬክተሩ፣ መምህራን፣ ተማሪዎች፣ ወላጆች፣ ሒሳብ ሰራተኛ እና ሬጅስትራር የየራሳቸውን ተግባር በዲጂታል መንገድ እንዲወጡ ያስችላል።'}
              </div>
            </div>

            {/* Grid of the 7 Key Roles & Responsibilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* 1. Owner / Board Member */}
              <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-amber-500 text-white rounded-lg">
                      <Crown className="w-4 h-4" />
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">
                      {currentLang === 'om'
                        ? '1. Abbaa Mana Barumsaa / Dura-Taa\'aa Boordii (Owner / Board)'
                        : currentLang === 'en'
                        ? '1. Owner / Board Member'
                        : '1. ባለቤት / የቦርድ ሰብሳቢ (Owner / Board Member)'}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full">
                    {currentLang === 'om' ? 'Hoggansa Olaanaa' : currentLang === 'en' ? 'Executive' : 'ከፍተኛ አመራር'}
                  </span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                  <li>
                    <strong>{currentLang === 'om' ? 'Mana barumsaa ni hundeessa:' : currentLang === 'en' ? 'Establishes the school:' : 'ትምህርት ቤት ይከፍታል / ያቋቁማል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Hayyama waliigalaa, asxaa fi odeeffannoo dhaabbatichaa galmeessa.' : currentLang === 'en' ? 'Registers institutional licenses, logo, and details.' : 'የተቋሙን አጠቃላይ ፈቃድ፣ አርማ እና ዝርዝር መረጃ ይመዘግባል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Daarektara ni qacara:' : currentLang === 'en' ? 'Appoints Principal:' : 'ዳይሬክተር ይቀጥራል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Daarektara olaanaa mana barumsaa filatee aangoo fi itti-gaafatamummaa kenna.' : currentLang === 'en' ? 'Selects the School Principal and delegates authority.' : 'የትምህርት ቤቱን ዋና ዳይሬክተር ይመርጣል፣ የስልጣንና ኃላፊነት ስምምነት ይሰጣል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Koodii seensaa ni kenna:' : currentLang === 'en' ? 'Issues access codes:' : 'የመግቢያ ኮድ ይሰጣል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Daarektara fi hojjettoota ijoodhaaf koodii seensaa maddisiisa.' : currentLang === 'en' ? 'Generates system access codes for Principal and key staff.' : 'ለዳይሬክተርና ለቁልፍ ሰራተኞች በሲስተም ውስጥ መግባት የሚያስችል ኮድ ያመነጫል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Mana barumsaa guutummaatti ni to\'ata:' : currentLang === 'en' ? 'Full school oversight:' : 'ት/ቤቱን ሙሉ በሙሉ ይቆጣጠራል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Baay\'ina barattootaa, tarree hojjettootaa, sadarkaa inspeekshinii fi qabxii ni ilaala.' : currentLang === 'en' ? 'Monitors student counts, staff roster, inspection level, and exam performance.' : 'የተማሪዎች ቁጥር፣ የሰራተኞች ዝርዝር፣ የኢንስፔክሽን ደረጃ እና የፈተና ውጤት ያያል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Beeksisa ni maxxansa:' : currentLang === 'en' ? 'Posts announcements:' : 'ማስታወቂያ ይለጥፋል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Hawaasa hundaaf, miseensota boordii ykn hojjettootaaf ibsa seera-qabeessa dabarsa.' : currentLang === 'en' ? 'Broadcasts official announcements to the board or community.' : 'ለመላው ማህበረሰብ፣ ለቦርድ አባላት ወይም ለሰራተኞች ይፋዊ መግለጫ ያስተላልፋል።'}
                  </li>
                </ul>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('owner_board');
                      setShowRoleGuideModal(false);
                    }}
                    className="text-xs text-amber-800 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>
                      {currentLang === 'om'
                        ? 'Gara Fuula Bulchiinsa Boordii Deemi →'
                        : currentLang === 'en'
                        ? 'Go to Board Governance Page →'
                        : 'ወደ ቦርድ አስተዳደር ገፅ ሂድ →'}
                    </span>
                  </button>
                </div>
              </div>

              {/* 2. Director */}
              <div className="p-4 rounded-xl border-2 border-teal-200 bg-teal-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-teal-600 text-white rounded-lg">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">
                      {currentLang === 'om'
                        ? '2. Daarektara Olaanaa / Durabu\'aa (Principal / Director)'
                        : currentLang === 'en'
                        ? '2. Principal / Director'
                        : '2. ዋና ዳይሬክተር / ርዕሰ መምህር (Principal / Director)'}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-200 text-teal-900 rounded-full">
                    {currentLang === 'om' ? 'Hojii-Gaggeessaa' : currentLang === 'en' ? 'Manager' : 'ስራ አስኪያጅ'}
                  </span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                  <li>
                    <strong>{currentLang === 'om' ? 'Hojjettoota hunda ni to\'ata:' : currentLang === 'en' ? 'Supervises all staff:' : 'ሰራተኞችን በሙሉ ይቆጣጠራል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Barsiisota, reejistiraara, hojjetaa herregaa, mana kitaabaa fi deeggartoota bulcha.' : currentLang === 'en' ? 'Manages teachers, registrar, accountant, library, and support staff.' : 'መምህራንን፣ ሬጅስትራርን፣ ሒሳብ ሰራተኛን፣ ቤተ-መጻሕፍትና ድጋፍ ሰጪዎችን ያስተዳድራል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Aangoo ilaaluu fi mirkaneessuu:' : currentLang === 'en' ? 'Review & approval authority:' : 'የማየትና የማፅደቅ ስልጣን፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Qabxii barattootaa, simannaa barattootaa, baasii fi ragaa barnootaa mirkaneessa.' : currentLang === 'en' ? 'Approves grades, admissions, expenditures, and academic credentials.' : 'የተማሪዎች ውጤት፣ የተማሪ ቅበላ፣ የወጪ ማረጋገጫ እና የትምህርት ማስረጃዎችን ያፀድቃል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Gabaasa ni fudhata ni ergas:' : currentLang === 'en' ? 'Receives & sends reports:' : 'ሪፖርቶች ይቀበላል እና ይልካል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Kutaa irraa gabaasa fudhatee gara Biiroo Barnootaa Shaashamanneetti gabaasa seera-qabeessa erga.' : currentLang === 'en' ? 'Collects department reports and submits official reports to Shashemene Education Bureau.' : 'ከክፍሎች ሪፖርት ተቀብሎ ለሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ ይፋዊ ሪፖርት ይልካል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Waraqaa eenyummaa fi ragaa mirkaneessa:' : currentLang === 'en' ? 'Verifies IDs & credentials:' : 'የዲጂታል መታወቂያ እና ማስረጃ ያረጋግጣል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Waraqaa Eenyummaa Fayda fi ragaa barnoota hojjettootaa qorata.' : currentLang === 'en' ? 'Verifies staff Fayda IDs and academic certificates.' : 'የሰራተኞችን የፋይዳ (Fayda ID) እና የትምህርት ምስክር ወረቀቶች ይመረምራል።'}
                  </li>
                </ul>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('stakeholders');
                      setShowRoleGuideModal(false);
                    }}
                    className="text-xs text-teal-800 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>
                      {currentLang === 'om'
                        ? 'Gara Qooda-Fudhattootaa & Ragaa Deemi →'
                        : currentLang === 'en'
                        ? 'Go to Stakeholders & Credentials →'
                        : 'ወደ ባለድርሻ አካላት & ማስረጃዎች ሂድ →'}
                    </span>
                  </button>
                </div>
              </div>

              {/* 3. Teacher */}
              <div className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-emerald-600 text-white rounded-lg">
                      <GraduationCap className="w-4 h-4" />
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">
                      {currentLang === 'om' ? '3. Barsiisaa (Teacher)' : currentLang === 'en' ? '3. Teacher' : '3. መምህር (Teacher)'}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full">
                    {currentLang === 'om' ? 'Barsiisaa' : currentLang === 'en' ? 'Educator' : 'አስተማሪ'}
                  </span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                  <li>
                    <strong>{currentLang === 'om' ? 'Barataa ni barsiisa:' : currentLang === 'en' ? 'Teaches students:' : 'ተማሪ ያስተምራል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Karoora barnootaa, qabiyyee fi meeshaalee barsiisuu dhiyeessa.' : currentLang === 'en' ? 'Prepares lesson plans, materials, and instruction.' : 'የትምህርት እቅድ፣ ይዘት እና የማስተማሪያ ግብአቶችን ያቀርባል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Qabxii ni galmeessa:' : currentLang === 'en' ? 'Records grades:' : 'ውጤት ይመዘግባል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Qabxii qormaataa, Quiz, Mid fi Final siistematti galcha.' : currentLang === 'en' ? 'Enters Quiz, Mid, and Final exam scores in the system.' : 'የፈተና፣ የፈተሽ (Quiz)፣ የከፊል (Mid) እና የፍፃሜ (Final) ውጤቶችን በሲስተሙ ያስገባል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Hojii manaa ni kenna ni soroorsas:' : currentLang === 'en' ? 'Assigns & grades homework:' : 'የቤት ስራ ይሰጣል እና ያርማል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Dareedhaaf hojii manaa kennee deebii barattootaa soroorsuun yaada kenna.' : currentLang === 'en' ? 'Assigns class homework and grades student submissions.' : 'ለክፍሉ የቤት ስራ ይሰጣል፤ ተማሪዎች የላኩትን መልስ አርሞ ማርክና አስተያየት ይሰጣል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Hirmaannaa guyyaa ni qabata:' : currentLang === 'en' ? 'Takes daily attendance:' : 'ዕለታዊ መገኘት ይይዛል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Argamuu (Present), hafuu (Absent) fi barfachuu (Late) guyyaa guyyaan galmeessa.' : currentLang === 'en' ? 'Tracks daily Present, Absent, and Late records.' : 'የተማሪዎችን መገኘት (Present)፣ አለመገኘት (Absent)፣ ማርፈድ (Late) በየቀኑ ይመዘግባል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Fooyya\'insa ogummaa:' : currentLang === 'en' ? 'Professional development:' : 'የሙያ ማሻሻያ፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Qormaata Biiroo toora interneetiin fudhata; sanadoota leenjii qo\'ata.' : currentLang === 'en' ? 'Takes Bureau online exams and downloads training materials.' : 'የቢሮውን የመምህራን ፈተና (Online Exam) ይወስዳል፤ የስልጠና ሰነዶችን ያጠናል።'}
                  </li>
                </ul>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('homework_attendance');
                      setShowRoleGuideModal(false);
                    }}
                    className="text-xs text-emerald-800 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>
                      {currentLang === 'om'
                        ? 'Gara Fuula Hojii Manaa fi Hirmaannaa Deemi →'
                        : currentLang === 'en'
                        ? 'Go to Homework & Attendance →'
                        : 'ወደ የቤት ስራ እና መገኘት ገፅ ሂድ →'}
                    </span>
                  </button>
                </div>
              </div>

              {/* 4. Student */}
              <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-blue-600 text-white rounded-lg">
                      <User className="w-4 h-4" />
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">
                      {currentLang === 'om' ? '4. Barataa (Student)' : currentLang === 'en' ? '4. Student' : '4. ተማሪ (Student)'}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-200 text-blue-900 rounded-full">
                    {currentLang === 'om' ? 'Barataa' : currentLang === 'en' ? 'Student' : 'ተማሪ'}
                  </span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                  <li>
                    <strong>{currentLang === 'om' ? 'Qabxii ofii ni ilaala:' : currentLang === 'en' ? 'Views own grades:' : 'የራሱን ውጤት ያያል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Qabxii qormaataa, sadarkaa daree fi kaardii qabxii seera-qabeessa ilaala.' : currentLang === 'en' ? 'Checks exam marks, class rank, and official report card.' : 'የፈተና ውጤቶችን፣ ደረጃውን (Rank) እና ይፋዊ የውጤት ካርዱን ይመለከታል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Hojii manaa ni hojjeta:' : currentLang === 'en' ? 'Completes homework:' : 'የቤት ስራ ይሰራል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Hojii manaa kenname ilaalee deebii kallattiin siistamaan erga.' : currentLang === 'en' ? 'Views assigned homework and submits answers online.' : 'የተሰጠውን የቤት ስራ አይቶ መልሱን በሲስተሙ በቀጥታ ይልካል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Kaardii eenyummaa ni argata:' : currentLang === 'en' ? 'Gets Student ID Card:' : 'መታወቂያ ካርድ ያገኛል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Waraqaa eenyummaa barataa dijitaalaa (Student ID Card) maxxanfata.' : currentLang === 'en' ? 'Downloads or prints official Digital Student ID Card.' : 'ይፋዊ የተማሪዎች ዲጂታል መታወቂያ ካርድ (Student ID Card) ያትማል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Kaffaltii ni raawwata:' : currentLang === 'en' ? 'Manages tuition fee:' : 'ክፍያ ይከፍላል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Haala kaffaltii ji\'aa ilaalee Telebirr ykn Baankiin kaffalee nagahee erga.' : currentLang === 'en' ? 'Checks monthly fee schedule and uploads payment receipts.' : 'የትምህርት ቤት ክፍያ ሁኔታውን አይቶ በቴሌብር ወይም በባንክ እንዲከፈል ያደርጋል።'}
                  </li>
                </ul>
              </div>

              {/* 5. Parent */}
              <div className="p-4 rounded-xl border-2 border-purple-200 bg-purple-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-purple-600 text-white rounded-lg">
                      <Users className="w-4 h-4" />
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">
                      {currentLang === 'om' ? '5. Maatii / Guddistuu (Parent / Guardian)' : currentLang === 'en' ? '5. Parent / Guardian' : '5. ወላጅ / አሳዳጊ (Parent / Guardian)'}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-200 text-purple-900 rounded-full">
                    {currentLang === 'om' ? 'Maatii' : currentLang === 'en' ? 'Parent' : 'ወላጅ'}
                  </span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                  <li>
                    <strong>{currentLang === 'om' ? 'Qabxii ilma/intala isaa ni hordofa:' : currentLang === 'en' ? 'Monitors child\'s grades:' : 'የልጁን ውጤት ያያል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Qabxii barnootaa, bal\'ina maarkii fi sadarkaa daree dhiyeenyatti hordofa.' : currentLang === 'en' ? 'Follows detailed subject scores and class ranking closely.' : 'የልጁን የትምህርት ውጤት፣ ዝርዝር ማርክ እና የክፍል ደረጃ በቅርበት ይከታተላል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Hirmaannaa guyyaa ni to\'ata:' : currentLang === 'en' ? 'Tracks daily attendance:' : 'ዕለታዊ መገኘት ይቆጣጠራል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Ilmi/intalli isaa har\'a argamuu, barfachuu ykn hafuu battalumatti beeka.' : currentLang === 'en' ? 'Knows immediately if child is present, late, or absent.' : 'ልጁ ዛሬ ትምህርት ቤት መገኘቱን፣ ማርፈዱን ወይም መቅረቱን ወዲያውኑ ያውቃል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Kaffaltii ji\'aa ni kaffala:' : currentLang === 'en' ? 'Pays monthly tuition:' : 'የወር ክፍያ ይከፍላል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Kaffaltii ji\'aa Telebirr ykn Baankiin raawwatee nagahee erga.' : currentLang === 'en' ? 'Pays tuition via Telebirr or Bank and attaches receipts.' : 'የትምህርት ክፍያዎችን በቴሌብር (Telebirr)፣ በሲቢኢ ብር (CBE Birr) በቀጥታ ይከፍላል፤ ደረሰኝ ያገኛል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Barsiisota waliin ni qunnama:' : currentLang === 'en' ? 'Communicates with teachers:' : 'ከመምህራን ጋር ግንኙነት ያደርጋል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Naamusaa fi hordoffii barataa barsiisota waliin gamaaggama.' : currentLang === 'en' ? 'Coordinates student conduct and academic progress with teachers.' : 'የልጁን ስነ-ምግባር እና ክትትል ከመምህራን ጋር ይገመግማል።'}
                  </li>
                </ul>
              </div>

              {/* 6. Accountant / Cashier */}
              <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-green-600 text-white rounded-lg">
                      <DollarSign className="w-4 h-4" />
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">
                      {currentLang === 'om' ? '6. Hojjetaa Herregaa / Kaashiyara (Accountant / Cashier)' : currentLang === 'en' ? '6. Accountant / Cashier' : '6. የሒሳብ ሰራተኛ / ፋይናንስ ሹም (Accountant / Cashier)'}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-green-200 text-green-900 rounded-full">
                    {currentLang === 'om' ? 'Faayinaansii' : currentLang === 'en' ? 'Finance' : 'ፋይናንስ'}
                  </span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                  <li>
                    <strong>{currentLang === 'om' ? 'Kaffaltii ji\'aa ni sassaaba:' : currentLang === 'en' ? 'Collects tuition fees:' : 'የወር ክፍያ ይሰበስባል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Kaffaltii barattootaa ji\'aa fuudhee nagahee elektirooniksii maxxansa.' : currentLang === 'en' ? 'Receives monthly tuition payments and issues electronic receipts.' : 'የተማሪዎችን ወርሃዊ የትምህርት ክፍያ ተቀብሎ ይፋዊ የኤሌክትሮኒክ ደረሰኝ ያትማል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Kanneen hin kaffalin ni adda baasa:' : currentLang === 'en' ? 'Tracks unpaid accounts:' : 'ያልከፈሉትን ይለያል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Tarree barattoota yeroon hin kaffalin baasee daarektaraa fi maatiif beeksisa.' : currentLang === 'en' ? 'Identifies overdue student balances and notifies parents.' : 'በወቅቱ ያልከፈሉ ተማሪዎችን ዝርዝር በማውጣት ለዳይሬክተር እና ለወላጆች ያሳውቃል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Baasii bulchiinsaa ni galmeessa:' : currentLang === 'en' ? 'Records expenses:' : 'አስተዳደራዊ ወጪ ያወጣል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Mindaa hojjettootaa, ifaa, bishaanii fi bittaa meeshaalee galmeessa.' : currentLang === 'en' ? 'Logs staff payroll, utilities, maintenance, and supply expenses.' : 'የሰራተኞች ደመወዝ፣ የመብራትና ውሃ፣ የጥገና፣ የማስተማሪያ ቁሳቁስ ግዥ ወጪዎችን ይመዘግባል።'}
                  </li>
                  <li>
                    <strong>{currentLang === 'om' ? 'Ibsa faayinaansii ni qopheessa:' : currentLang === 'en' ? 'Prepares financial statements:' : 'የፋይናንስ መግለጫ ያዘጋጃል፡'}</strong>{' '}
                    {currentLang === 'om' ? 'Gabaasa madaallii galii fi baasii ji\'aa fi waggaa dhiyeessa.' : currentLang === 'en' ? 'Delivers monthly and annual balance reports to leadership.' : 'ወርሃዊና ዓመታዊ የገቢና ወጪ ሚዛን ሪፖርት ለዳይሬክተሩና ለቦርዱ ያቀርባል።'}
                  </li>
                </ul>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('finance');
                      setShowRoleGuideModal(false);
                    }}
                    className="text-xs text-green-800 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>
                      {currentLang === 'om'
                        ? 'Gara Fuula Herregaa fi Kaffaltii Deemi →'
                        : currentLang === 'en'
                        ? 'Go to Finance & Tuition Page →'
                        : 'ወደ ሒሳብና ክፍያ ገፅ ሂድ →'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* 7. Org Structure */}
            <div className="p-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50/60 space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-indigo-700 text-white rounded-lg">
                  <Briefcase className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {currentLang === 'om'
                    ? '7. Caasaa Mana Barnootaa: Barataa eenyutu galmeessa? Barsiisaa eenyutu galmeessa? Hojjetaan akkamii barbaachisa?'
                    : currentLang === 'en'
                    ? '7. Organizational Structure: Who enrolls students? Who hires staff? What staff are needed?'
                    : '7. የትምህርት ቤት መዋቅር፡ ተማሪን ማን ይመዘግባል? መምህርን ማን ይመዘግባል? ምን ሰራተኛ ያስፈልጋል?'}
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-xs space-y-1.5">
                  <span className="font-bold text-indigo-950 block text-xs">
                    {currentLang === 'om'
                      ? '👉 Barataa eenyutu galmeessa? (Who Enrolls Students?)'
                      : currentLang === 'en'
                      ? '👉 Who Enrolls Students?'
                      : '👉 ተማሪን ማን ይመዘግባል? (Who Enrolls Students?)'}
                  </span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    <strong>
                      {currentLang === 'om'
                        ? 'Reejistiraara / Kutaa Simannaa fi Odeeffannoo Barattootaa (School Registrar)'
                        : currentLang === 'en'
                        ? 'School Registrar & Admissions Officer'
                        : 'ሬጅስትራር / የተማሪዎች ቅበላና መረጃ ክፍል (School Registrar & Admissions Officer)'}
                    </strong>
                  </p>
                  <ul className="text-slate-600 text-[11px] space-y-1 list-disc pl-4">
                    <li>
                      {currentLang === 'om'
                        ? 'Barattoota haaraa galmeessa; ragaa dhalootaa fi jijjiirraa mirkaneessa.'
                        : currentLang === 'en'
                        ? 'Registers new students and verifies birth & transfer records.'
                        : 'አዳዲስ ተማሪዎችን ይመዘግባል፣ የልደትና የዝውውር ሰነዶችን ያረጋግጣል።'}
                    </li>
                    <li>
                      {currentLang === 'om'
                        ? 'Barattoota kutaa fi dareedhaan (Section A, B, C...) ramada.'
                        : currentLang === 'en'
                        ? 'Assigns students into grades and sections (A, B, C...).'
                        : 'ተማሪዎችን በክፍል እና በክፍልፋይ (Section A, B, C...) ይመድባል።'}
                    </li>
                    <li>
                      {currentLang === 'om'
                        ? 'Kaardii eenyummaa barataa maxxansa; tiraanskiriippii qopheessa.'
                        : currentLang === 'en'
                        ? 'Prints Student ID Cards and prepares transcripts.'
                        : 'የተማሪ መታወቂያ ካርድ (Student ID Card) ያትማል፤ ትራንስክሪፕት ያዘጋጃል።'}
                    </li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('registrar');
                      setShowRoleGuideModal(false);
                    }}
                    className="mt-1 text-[11px] text-indigo-700 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>
                      {currentLang === 'om'
                        ? 'Gara Reejistiraaraa & Galmee Barattootaa Deemi →'
                        : currentLang === 'en'
                        ? 'Go to Registrar & Student Admissions →'
                        : 'ወደ ሬጅስትራር & ተማሪ ምዝገባ ሂድ →'}
                    </span>
                  </button>
                </div>

                <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-xs space-y-1.5">
                  <span className="font-bold text-indigo-950 block text-xs">
                    {currentLang === 'om'
                      ? '👉 Barsiisaa fi hojjettoota eenyutu galmeessa? (Who Hires Staff?)'
                      : currentLang === 'en'
                      ? '👉 Who Hires & Registers Staff?'
                      : '👉 መምህርን እና ሰራተኛን ማን ይመዘግባል? (Who Hires & Registers Staff?)'}
                  </span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    <strong>
                      {currentLang === 'om'
                        ? 'Kutaa Bulchiinsa Qabeenya Namaa / Daarektara (HR & School Director)'
                        : currentLang === 'en'
                        ? 'HR Department & School Director'
                        : 'የሰው ኃይል አስተዳደር ክፍል / ዳይሬክተር (HR & School Director)'}
                    </strong>
                  </p>
                  <ul className="text-slate-600 text-[11px] space-y-1 list-disc pl-4">
                    <li>
                      {currentLang === 'om'
                        ? 'Barsiisota haaraa fi hojjettoota deeggarsa kennan siistematti galmeessa.'
                        : currentLang === 'en'
                        ? 'Registers new teachers and support personnel in the system.'
                        : 'አዳዲስ መምህራንን እና ድጋፍ ሰጪ ሰራተኞችን በሲስተሙ ይመዘግባል።'}
                    </li>
                    <li>
                      {currentLang === 'om'
                        ? 'Lakkoofsa Eenyummaa Biyyaalessaa Fayda fi sanadoota mirkaneessa.'
                        : currentLang === 'en'
                        ? 'Verifies Fayda Digital National ID and supporting documents.'
                        : 'የፋይዳ ዲጂታል ብሔራዊ መታወቂያ ቁጥር (Fayda ID) እና ሰነድ ያረጋግጣል።'}
                    </li>
                    <li>
                      {currentLang === 'om'
                        ? 'Odeeffannoo dippiloomaa, digirii, maastarsii fi hayyama ogummaa galcha.'
                        : currentLang === 'en'
                        ? 'Records Diploma, Degree, Masters, and professional licenses.'
                        : 'የተመረቀበትን ዲፕሎማ፣ ዲግሪ፣ ማስተርስ እና የሙያ ፈቃድ መረጃ ያስገባል።'}
                    </li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('stakeholders');
                      setShowRoleGuideModal(false);
                    }}
                    className="mt-1 text-[11px] text-indigo-700 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>
                      {currentLang === 'om'
                        ? 'Gara Galmee Qooda-Fudhattootaa Deemi →'
                        : currentLang === 'en'
                        ? 'Go to Stakeholder Registration →'
                        : 'ወደ ባለድርሻ አካላት ምዝገባ ሂድ →'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Additional support staff */}
              <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-xs space-y-2">
                <span className="font-bold text-indigo-950 block text-xs">
                  {currentLang === 'om'
                    ? '👉 Qooda-fudhattoonni fi hojjettoonni deeggarsaa mana barnootaa tokkoof barbaachisan hundi:'
                    : currentLang === 'en'
                    ? '👉 Essential Support Staff & Stakeholders Required for a School:'
                    : '👉 ለአንድ ትምህርት ቤት የሚያስፈልጉ ባለድርሻ አካላትና ድጋፍ ሰጪ ሰራተኞች በሙሉ፡'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-700">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <strong className="block text-slate-900">
                      {currentLang === 'om' ? '1. Ogeessa Mana Kitaabaa' : currentLang === 'en' ? '1. School Librarian' : '1. የቤተ-መጻሕፍት ባለሙያ'}
                    </strong>
                    <span>
                      {currentLang === 'om' ? 'Tarree kitaabotaa fi tajaajila dubbisaa' : currentLang === 'en' ? 'Book catalog & student reading service' : 'Librarian - የመጻሕፍት ዝርዝርና የተማሪ ንባብ አገልግሎት'}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <strong className="block text-slate-900">
                      {currentLang === 'om' ? '2. Ogeessa Gorsaa' : currentLang === 'en' ? '2. Guidance Counselor' : '2. የምክር አገልግሎት ባለሙያ'}
                    </strong>
                    <span>
                      {currentLang === 'om' ? 'Xiin-sammuu fi gorsa barattootaa' : currentLang === 'en' ? 'Student psychology & counseling' : 'Guidance Counselor - የተማሪዎች ስነ-ልቦናና ምክር'}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <strong className="block text-slate-900">
                      {currentLang === 'om' ? '3. Teeknishaanii Laaboraatoorii' : currentLang === 'en' ? '3. Lab Technician' : '3. የላብራቶሪ ቴክኒሻን'}
                    </strong>
                    <span>
                      {currentLang === 'om' ? 'Laaboraatoorii saayinsii fi teeknooloojii' : currentLang === 'en' ? 'Science & technology laboratories' : 'Lab Technician - የሳይንስና ቴክኖሎጂ ላብራቶሪ'}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <strong className="block text-slate-900">
                      {currentLang === 'om' ? '4. Narsii Mana Barumsaa / Kilinika' : currentLang === 'en' ? '4. School Nurse / Clinic' : '4. የትምህርት ቤት ነርስ / ክሊኒክ'}
                    </strong>
                    <span>
                      {currentLang === 'om' ? 'Gargaarsa fayyaa jalqabaa fi fayyaa' : currentLang === 'en' ? 'First aid & campus health' : 'School Nurse - የመጀመሪያ ደረጃ ህክምናና ጤና'}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <strong className="block text-slate-900">
                      {currentLang === 'om' ? '5. Deeggarsa IT / Siistemaa' : currentLang === 'en' ? '5. IT Specialist' : '5. አይቲ / ሲስተም ድጋፍ'}
                    </strong>
                    <span>
                      {currentLang === 'om' ? 'Laaboraatoorii kompiitaraa fi siistema' : currentLang === 'en' ? 'Computer lab & digital systems' : 'IT Specialist - ኮምፒውተር ላብራቶሪና ሲስተም'}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <strong className="block text-slate-900">
                      {currentLang === 'om' ? '6. Kutaa Qabeenyaa fi Bittaa' : currentLang === 'en' ? '6. Storekeeper & Procurement' : '6. የንብረትና ግዥ ክፍል'}
                    </strong>
                    <span>
                      {currentLang === 'om' ? 'Kuusaa meeshaalee barnootaa fi qabeenyaa' : currentLang === 'en' ? 'Instructional supplies & inventory' : 'Storekeeper - የትምህርት ቁሳቁስና እቃዎች ክምችት'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowRoleGuideModal(false)}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                {currentLang === 'om' ? 'Hubadheera (Qajeelfama Cufi)' : currentLang === 'en' ? 'Got It (Close Guide)' : 'ተረድቻለሁ (Close Guide)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Developer License Payment & Deposit Slip Modal */}
      <DeveloperPaymentModal
        isOpen={showDeveloperPaymentModal}
        onClose={() => setShowDeveloperPaymentModal(false)}
        school={currentSchool}
        currentLang={currentLang}
        onSuccess={handleDeveloperPaymentSuccess}
      />
    </div>
  );
};
