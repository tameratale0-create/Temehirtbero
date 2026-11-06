import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  GraduationCap,
  Award,
  FileText,
  FileCheck,
  BookOpen,
  LayoutDashboard,
  ShieldCheck,
  School as SchoolIcon,
  Sparkles,
  Wifi,
  WifiOff,
  Crown,
  DollarSign,
  ClipboardList,
  CheckCircle2,
  Lock,
  Zap,
  ArrowRight,
  ShieldAlert,
  KeyRound,
  X,
  Maximize2,
  Minimize2,
  ArrowLeft
} from 'lucide-react';
import {
  Language,
  UserRole,
  AppUserSession,
  School,
  BureauStaff,
  TeacherCredential,
  TeacherExam,
  TrainingMaterial,
  SchoolReportSubmission,
  BureauStandardCriteria,
  StudentRecord
} from './types';
import { translations } from './data/translations';
import { StorageService } from './utils/storage';
import { Header } from './components/Header';
import { BureauDashboard } from './components/BureauDashboard';
import { SchoolsRegistry } from './components/SchoolsRegistry';
import { StaffManagement } from './components/StaffManagement';
import { TeacherCredentialsAudit } from './components/TeacherCredentialsAudit';
import { StudentReportsReception } from './components/StudentReportsReception';
import { TeacherOnlineExams } from './components/TeacherOnlineExams';
import { TrainingMaterialsHub } from './components/TrainingMaterialsHub';
import { BureauStandards } from './components/BureauStandards';
import { SchoolPortal, SchoolSubTab } from './components/SchoolPortal';
import { PersonalizedGreeting } from './components/PersonalizedGreeting';
import { StudentPortalView } from './components/StudentPortalView';
import { LoginModal } from './components/LoginModal';
import { SplashScreen } from './components/SplashScreen';
import { AccessCodeGate } from './components/AccessCodeGate';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SecretDeveloperPortalModal } from './components/SecretDeveloperPortalModal';
import { SystemDeveloperProfileModal } from './components/SystemDeveloperProfileModal';
import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  // Trilingual state: Default to Amharic (or check localStorage)
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    return (localStorage.getItem('shash_edu_lang') as Language) || 'am';
  });

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('shash_edu_lang', lang);
  };

  const t = translations[currentLang];

  // Active User Session: Default to Bureau Admin (with master password 123456)
  const [currentUser, setCurrentUser] = useState<AppUserSession | null>({
    role: 'bureau_admin',
    name: 'የሻሸመኔ ትምህርት ቢሮ አስተዳዳሪ (Bureau Admin)',
    identifier: 'admin',
    accessCode: '123456'
  });

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Entities state loaded from StorageService (with offline persistence)
  const [schools, setSchools] = useState<School[]>(() => StorageService.getSchools());
  const [staff, setStaff] = useState<BureauStaff[]>(() => StorageService.getStaff());
  const [credentials, setCredentials] = useState<TeacherCredential[]>(() =>
    StorageService.getCredentials()
  );
  const [reports, setReports] = useState<SchoolReportSubmission[]>(() =>
    StorageService.getReports()
  );
  const [exams, setExams] = useState<TeacherExam[]>(() => StorageService.getExams());
  const [trainingMaterials, setTrainingMaterials] = useState<TrainingMaterial[]>(() =>
    StorageService.getTrainingMaterials()
  );
  const [standards, setStandards] = useState<BureauStandardCriteria[]>(() =>
    StorageService.getStandards()
  );
  const [students, setStudents] = useState<StudentRecord[]>(() =>
    StorageService.getStudents()
  );

  // Modals & Gateway State
  // "መጀመርያ ሲስተሙ ሲከፈት የኢትዮጵያ ትምህርተ ቢሮ አርማ ለ 10 ሰከንድ ይቆያል ከአርማው ጀርባ የተለያዩ ቀለማት ያሉት ላይት በአርማው ዙርያ ይበራል ከዛ ኮድ ማስገበያ ይከፈታል"
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showCodeGate, setShowCodeGate] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginModalTab, setLoginModalTab] = useState<'bureau' | 'school_reg' | 'school_login'>('bureau');
  const [showDeveloperPortalModal, setShowDeveloperPortalModal] = useState<boolean>(false);
  const [showDeveloperProfileModal, setShowDeveloperProfileModal] = useState<boolean>(false);

  // Active School selection for School Portal
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(
    schools[0]?.id || 'sch-1'
  );

  const activeSchool =
    schools.find((s) => s.id === selectedSchoolId) || schools[0];

  // When user logs in with role
  const handleLoginSuccess = (session: AppUserSession) => {
    setCurrentUser(session);
    if (session.schoolId) {
      setSelectedSchoolId(session.schoolId);
    }

    // Set appropriate landing tab
    if (session.role === 'bureau_admin' || session.role === 'bureau_staff') {
      setActiveTab('dashboard');
    } else if (
      session.role === 'school_admin' ||
      session.role === 'school_director' ||
      session.role === 'school_owner' ||
      session.role === 'accountant' ||
      session.role === 'registrar'
    ) {
      setActiveTab('school_portal');
    } else if (session.role === 'teacher') {
      setActiveTab('school_portal');
    } else if (session.role === 'student' || session.role === 'parent') {
      setActiveTab('student_portal');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowCodeGate(true);
  };

  const handleNewSchoolRegistered = (newSchool: School) => {
    const updated = StorageService.getSchools();
    setSchools(updated);
    setSelectedSchoolId(newSchool.id);
  };

  // Student matching current student session if logged in as student or parent
  const activeStudent =
    students.find(
      (s) =>
        s.accessCode === currentUser?.accessCode ||
        s.parentAccessCode === currentUser?.accessCode ||
        s.id === currentUser?.identifier
    ) || students[0];

  // Navigation Items depending on active role
  const isBureauRole =
    currentUser?.role === 'bureau_admin' || currentUser?.role === 'bureau_staff';
  const isSchoolRole =
    currentUser?.role === 'school_admin' ||
    currentUser?.role === 'school_director' ||
    currentUser?.role === 'school_owner' ||
    currentUser?.role === 'teacher' ||
    currentUser?.role === 'accountant' ||
    currentUser?.role === 'registrar';
  const isSchoolView = activeTab === 'school_portal' || isSchoolRole;

  const [showQuickRoleModal, setShowQuickRoleModal] = useState(false);
  const [targetSchoolSubTab, setTargetSchoolSubTab] = useState<SchoolSubTab | null>(null);

  // Fullscreen Activity State: When any button is clicked, its activity occupies full screen!
  // "አንድ በተን ሲነካ የተነካው በተን አክቲቪቲ ሙሉ እስክሪን የተነካው በተን ብቻ እንዲሆን አርገው"
  const [isFullscreenActivity, setIsFullscreenActivity] = useState<boolean>(false);

  // Helper to navigate to an activity and maximize it to full screen
  const navigateToActivity = (tab: string, subTab?: SchoolSubTab) => {
    setActiveTab(tab);
    if (subTab) {
      setTargetSchoolSubTab(subTab);
    }
    setIsFullscreenActivity(true);
  };

  // Keyboard shortcut: Escape to exit fullscreen activity mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreenActivity) {
        setIsFullscreenActivity(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenActivity]);

  const getActivityTitle = (tab: string): string => {
    switch (tab) {
      case 'dashboard':
        return currentLang === 'en' ? 'Executive Dashboard' : 'ዋናው ዳሽቦርድ እና የትምህርት ጥራት ማጠቃለያ';
      case 'schools':
        return currentLang === 'en' ? 'Schools Registry' : 'የትምህርት ቤቶች ይፋዊ ምዝገባ እና ካታሎግ';
      case 'staff':
        return currentLang === 'en' ? 'Staff Management' : 'የትምህርት ቢሮ ሰራተኞች እና አመራር መዝገብ';
      case 'reports':
        return currentLang === 'en' ? 'Semester Reports' : 'የትምህርት ቤቶች ሴሚስተር ሪፖርት መቀበያ እና ኦዲት';
      case 'credentials':
        return currentLang === 'en' ? 'Credentials Audit' : 'የመምህራን ብቃትና የትምህርት ማስረጃዎች ኦዲት (Fayda)';
      case 'exams':
        return currentLang === 'en' ? 'Teacher Exams' : 'የመምህራን ኦንላይን ብቃት መመዘኛ ፈተና ክፍል';
      case 'training':
        return currentLang === 'en' ? 'Training Hub' : 'የስልጠና ሞጁሎች እና ዲጂታል ሰነዶች ማዕከል';
      case 'standards':
        return currentLang === 'en' ? 'Quality Standards' : 'የትምህርት ጥራት መስፈርቶችና መመሪያዎች (Standards)';
      case 'school_portal':
        return activeSchool ? `${activeSchool.name} · የት/ቤት አስተዳደር ፖርታል` : (currentLang === 'en' ? 'School Portal' : 'የትምህርት ቤት ፖርታል');
      case 'student_portal':
        return currentLang === 'en' ? 'Student & Parent Portal' : 'የተማሪ እና ወላጅ የግል ገጽ';
      default:
        return 'አክቲቪቲ';
    }
  };

  const getActivityIcon = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return <LayoutDashboard className="w-5 h-5 text-emerald-400" />;
      case 'schools':
        return <Building2 className="w-5 h-5 text-emerald-400" />;
      case 'staff':
        return <Users className="w-5 h-5 text-emerald-400" />;
      case 'reports':
        return <FileText className="w-5 h-5 text-emerald-400" />;
      case 'credentials':
        return <FileCheck className="w-5 h-5 text-emerald-400" />;
      case 'exams':
        return <Award className="w-5 h-5 text-amber-400" />;
      case 'training':
        return <BookOpen className="w-5 h-5 text-cyan-400" />;
      case 'standards':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'school_portal':
        return <SchoolIcon className="w-5 h-5 text-teal-400" />;
      case 'student_portal':
        return <GraduationCap className="w-5 h-5 text-violet-400" />;
      default:
        return <Zap className="w-5 h-5 text-amber-400" />;
    }
  };

  const getAllowedTabOptions = () => {
    if (currentUser?.role === 'student' || currentUser?.role === 'parent') {
      return [{ id: 'student_portal', label: 'የተማሪ/ወላጅ ገጽ (Student Portal)' }];
    }
    if (currentUser?.role === 'accountant') {
      return [{ id: 'school_portal', label: 'የፋይናንስና ክፍያ ጽ/ቤት (Finance Desk)' }];
    }
    if (currentUser?.role === 'registrar') {
      return [{ id: 'school_portal', label: 'ሬጅስትራር (Registrar Desk)' }];
    }
    if (currentUser?.role === 'school_owner') {
      return [{ id: 'school_portal', label: 'የቦርድ አመራር (Board Governance)' }];
    }
    if (currentUser?.role === 'teacher') {
      return [
        { id: 'school_portal', label: 'የመምህር ገፅ (Teacher Desk)' },
        { id: 'exams', label: 'የብቃት ፈተና (Exams)' },
        { id: 'training', label: 'ስልጠና (Training)' }
      ];
    }
    if (currentUser?.role === 'school_director') {
      return [
        { id: 'school_portal', label: 'የት/ቤት አስተዳደር (School Portal)' },
        { id: 'exams', label: 'የመምህራን ፈተና (Exams)' },
        { id: 'training', label: 'ስልጠና (Training Hub)' }
      ];
    }
    return [
      { id: 'dashboard', label: 'ዋናው ዳሽቦርድ (Dashboard)' },
      { id: 'schools', label: 'ት/ቤቶች (Schools)' },
      { id: 'staff', label: 'ሰራተኞች (Staff)' },
      { id: 'reports', label: 'ሪፖርቶች (Reports)' },
      { id: 'credentials', label: 'ማስረጃዎች (Credentials)' },
      { id: 'exams', label: 'ፈተናዎች (Exams)' },
      { id: 'training', label: 'ስልጠና (Training)' },
      { id: 'standards', label: 'ስታንዳርድ (Standards)' },
      { id: 'school_portal', label: 'የት/ቤት ፖርታል (School Portal)' },
      { id: 'student_portal', label: 'የተማሪ ገጽ (Student Portal)' }
    ];
  };

  // Strict Role Compartmentalization & Isolation Enforcer:
  // "አንዱ የአንዱን ስራ ሳያይ ሁሉም የየራሳቸውን ስራ እንዲሰሩ"
  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.role === 'student' || currentUser.role === 'parent') {
      if (activeTab !== 'student_portal') {
        setActiveTab('student_portal');
      }
    } else if (
      currentUser.role === 'accountant' ||
      currentUser.role === 'registrar' ||
      currentUser.role === 'school_owner'
    ) {
      if (activeTab !== 'school_portal') {
        setActiveTab('school_portal');
      }
    } else if (currentUser.role === 'teacher') {
      if (activeTab !== 'school_portal' && activeTab !== 'exams' && activeTab !== 'training') {
        setActiveTab('school_portal');
      }
    } else if (currentUser.role === 'school_director' || currentUser.role === 'school_admin') {
      if (activeTab !== 'school_portal' && activeTab !== 'exams' && activeTab !== 'training') {
        setActiveTab('school_portal');
      }
    }
  }, [currentUser?.role, activeTab]);

  // 1. Initial 10-Second Splash Screen with Ethiopian Education Bureau Emblem & Colorful Lights
  if (showSplash) {
    return (
      <SplashScreen
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onComplete={() => {
          setShowSplash(false);
          setShowCodeGate(true);
        }}
      />
    );
  }

  // 2. Access Code Gateway Screen:
  // "ከዛ ኮድ ማስገበያ ይከፈታል 123456 ሲያስገቡ ቀጥታ ወድ ትምህርት ቢሮ ገፅ ያስገባል 2222 ሲያስገቡ ወደ ትምህርት ቤቶች ምዝገባ ያስገባል 3333 ሲያስገቡ ወደ ትምህርት ቤቶች መግብያ ያስገባል"
  if (showCodeGate) {
    return (
      <>
        <AccessCodeGate
          currentLang={currentLang}
          onLanguageChange={handleLanguageChange}
          onNavigateBureau={() => {
            handleLoginSuccess({
              role: 'bureau_admin',
              name: 'የሻሸመኔ ትምህርት ቢሮ አስተዳዳሪ (Bureau Admin)',
              identifier: 'admin',
              accessCode: '123456'
            });
            setShowCodeGate(false);
          }}
          onNavigateSchoolRegister={() => {
            setShowCodeGate(false);
            setLoginModalTab('school_reg');
            setIsLoginOpen(true);
          }}
          onNavigateSchoolLogin={() => {
            setShowCodeGate(false);
            setLoginModalTab('school_login');
            setIsLoginOpen(true);
          }}
          onLoginSession={(session) => {
            handleLoginSuccess(session);
            setShowCodeGate(false);
          }}
          onReplaySplash={() => {
            setShowCodeGate(false);
            setShowSplash(true);
          }}
        />

        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => {
            setIsLoginOpen(false);
            if (!currentUser) {
              setShowCodeGate(true);
            }
          }}
          currentLang={currentLang}
          onLoginSuccess={(session) => {
            handleLoginSuccess(session);
            setShowCodeGate(false);
          }}
          onSchoolRegistered={handleNewSchoolRegistered}
          initialTab={loginModalTab}
        />
      </>
    );
  }

  // Helper to render the currently active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <BureauDashboard
            currentLang={currentLang}
            schools={schools}
            staff={staff}
            credentials={credentials}
            reports={reports}
            exams={exams}
            onNavigateTab={(tab) => navigateToActivity(tab)}
            onNavigateSchoolSubTab={(subTab) => navigateToActivity('school_portal', subTab)}
            currentUser={currentUser}
            activeSchool={activeSchool}
            onOpenQuickRoleModal={() => setShowQuickRoleModal(true)}
            onOpenRegisterSchool={() => {
              setLoginModalTab('school_reg');
              setIsLoginOpen(true);
            }}
            onToggleFullscreen={() => setIsFullscreenActivity(true)}
          />
        );
      case 'schools':
        return (
          <SchoolsRegistry
            currentLang={currentLang}
            schools={schools}
            onSchoolsChange={(updated) => setSchools(updated)}
          />
        );
      case 'staff':
        return (
          <StaffManagement
            currentLang={currentLang}
            staff={staff}
            onStaffChange={(updated) => setStaff(updated)}
          />
        );
      case 'reports':
        return (
          <StudentReportsReception
            currentLang={currentLang}
            reports={reports}
            onReportsChange={(updated) => setReports(updated)}
            currentOfficerName={currentUser?.name}
          />
        );
      case 'credentials':
        return (
          <TeacherCredentialsAudit
            currentLang={currentLang}
            credentials={credentials}
            onCredentialsChange={(updated) => setCredentials(updated)}
            currentOfficerName={currentUser?.name}
          />
        );
      case 'exams':
        return (
          <TeacherOnlineExams
            currentLang={currentLang}
            exams={exams}
            onExamsChange={(updated) => setExams(updated)}
            currentTeacherName={currentUser?.name || 'መ/ር በፈቃዱ ጥላሁን'}
            currentSchoolName={activeSchool?.name}
            isBureauOfficer={isBureauRole}
            currentUser={currentUser}
          />
        );
      case 'training':
        return (
          <TrainingMaterialsHub
            currentLang={currentLang}
            materials={trainingMaterials}
            onMaterialsChange={(updated) => setTrainingMaterials(updated)}
            isBureauOfficer={isBureauRole}
            currentUser={currentUser}
          />
        );
      case 'standards':
        return (
          <BureauStandards currentLang={currentLang} standards={standards} />
        );
      case 'school_portal':
        return (
          <div className="space-y-4">
            {/* School Switcher: Only shown for Bureau Admin/Staff to inspect various schools */}
            {isBureauRole && (
              <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>የትምህርት ቤት ተቋም ምረጥ (Switch School Institution):</span>
                </span>
                <select
                  value={selectedSchoolId}
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                  className="w-full sm:w-auto px-3 py-1.5 border border-slate-300 rounded-xl bg-white font-medium text-slate-800 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code}) - {s.subcity}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <SchoolPortal
              currentLang={currentLang}
              school={activeSchool}
              students={students.filter((s) => s.schoolId === activeSchool.id || true)}
              onStudentsChange={(updated) => setStudents(updated)}
              currentUser={currentUser}
              onNavigateToBureauExams={() => navigateToActivity('exams')}
              onNavigateToTraining={() => navigateToActivity('training')}
              onSchoolUpdate={(updatedSchool) => {
                const updated = StorageService.getSchools();
                setSchools(updated);
                setSelectedSchoolId(updatedSchool.id);
              }}
              targetSubTab={targetSchoolSubTab}
              onTargetSubTabConsumed={() => setTargetSchoolSubTab(null)}
              isFullscreen={isFullscreenActivity}
            />
          </div>
        );
      case 'student_portal':
        return (
          <StudentPortalView
            currentLang={currentLang}
            student={activeStudent}
            school={activeSchool}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Top Header - In School View, Bureau/Ministry emblems are completely removed and School Logo is shown */}
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        currentUser={currentUser}
        onLogout={handleLogout}
        onQuickRoleSelect={handleLoginSuccess}
        onOpenLogin={() => {
          setLoginModalTab('bureau');
          setIsLoginOpen(true);
        }}
        onOpenRegisterSchool={() => {
          setLoginModalTab('school_reg');
          setIsLoginOpen(true);
        }}
        onOpenCodeGate={() => setShowCodeGate(true)}
        onReplaySplash={() => setShowSplash(true)}
        isSchoolView={isSchoolView}
        activeSchool={activeSchool}
        onNavigateToBureau={() => {
          navigateToActivity('dashboard');
        }}
        onOpenDeveloperPortal={() => setShowDeveloperPortalModal(true)}
        onOpenDeveloperProfile={() => setShowDeveloperProfileModal(true)}
      />

      {/* Main Container - Responsive padding for mobile & desktop */}
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col space-y-4 sm:space-y-5 pb-24 sm:pb-6">
        {/* =========================================================================
            ✨ PERSONALIZED WELCOME GREETING & ROLE QUICK-START ACTIONS
            "Create a personalized welcome greeting component that displays dynamic
             messages based on the logged-in user's role with quick-start action buttons"
           ========================================================================= */}
        {currentUser && (
          <PersonalizedGreeting
            currentUser={currentUser}
            activeSchool={activeSchool}
            currentLang={currentLang}
            onNavigateTab={(tab) => navigateToActivity(tab)}
            onNavigateSchoolSubTab={(subTab) => {
              navigateToActivity('school_portal', subTab);
            }}
            onOpenQuickRoleModal={() => setShowQuickRoleModal(true)}
          />
        )}

        {/* =========================================================================
            NAVIGATION BAR - STRICTLY FILTERED BY LOGGED-IN ROLE
            "አንዱ የአንዱን ስራ ሳያይ ሁሉም የየራሳቸውን ስራ እንዲሰሩ"
           ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-1.5 sm:p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {/* 1. If logged in as Student or Parent: ONLY SHOW Student/Parent Portal */}
          {(currentUser?.role === 'student' || currentUser?.role === 'parent') && (
            <button
              onClick={() => navigateToActivity('student_portal')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors bg-violet-900 text-white shadow-xs cursor-pointer`}
            >
              <GraduationCap className="w-4 h-4 text-violet-300" />
              <span>
                {currentUser?.role === 'student'
                  ? 'የተማሪ የግል ገጽ (Student Portal)'
                  : 'የወላጅ መከታተያ ገጽ (Parent Portal)'}
              </span>
            </button>
          )}

          {/* 2. If logged in as Accountant: ONLY SHOW Finance Desk inside School Portal */}
          {currentUser?.role === 'accountant' && (
            <button
              onClick={() => navigateToActivity('school_portal', 'finance')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors bg-emerald-800 text-white shadow-xs cursor-pointer`}
            >
              <DollarSign className="w-4 h-4 text-emerald-300" />
              <span>የፋይናንስና ክፍያ ጽ/ቤት (Finance Desk)</span>
            </button>
          )}

          {/* 3. If logged in as Registrar: ONLY SHOW Registrar Desk inside School Portal */}
          {currentUser?.role === 'registrar' && (
            <button
              onClick={() => navigateToActivity('school_portal', 'registrar')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors bg-blue-800 text-white shadow-xs cursor-pointer`}
            >
              <ClipboardList className="w-4 h-4 text-blue-300" />
              <span>ሬጅስትራር እና የተማሪዎች ምዝገባ (Registrar Desk)</span>
            </button>
          )}

          {/* 4. If logged in as School Owner: ONLY SHOW Board Desk inside School Portal */}
          {currentUser?.role === 'school_owner' && (
            <button
              onClick={() => navigateToActivity('school_portal', 'owner_board')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors bg-emerald-800 text-white shadow-xs cursor-pointer`}
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>የቦርድ አመራርና ቁጥጥር (Owner & Board Governance)</span>
            </button>
          )}

          {/* 5. If logged in as Teacher: SHOW Teacher Desk + Competency Exams + Training Hub */}
          {currentUser?.role === 'teacher' && (
            <>
              <button
                onClick={() => navigateToActivity('school_portal', 'homework_attendance')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'school_portal' && targetSchoolSubTab !== 'teacher_training'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100'
                }`}
              >
                <Award className="w-4 h-4 text-emerald-300" />
                <span>የመምህር ገፅ (የቤት ስራና ውጤት)</span>
              </button>

              <button
                onClick={() => navigateToActivity('school_portal', 'teacher_training')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'school_portal' && targetSchoolSubTab === 'teacher_training'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-amber-950 bg-amber-100/90 hover:bg-amber-200 border border-amber-300/60 font-bold'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>የትምህርት ቢሮ ስልጠናዎች (Subject Training)</span>
              </button>

              <button
                onClick={() => navigateToActivity('exams')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'exams'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>{t.tab_exams}</span>
              </button>

              <button
                onClick={() => navigateToActivity('training')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'training'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{t.tab_training}</span>
              </button>
            </>
          )}

          {/* 6. If logged in as Director / School Admin: SHOW School Portal + Exams + Training */}
          {(currentUser?.role === 'school_director' ||
            (currentUser?.role === 'school_admin' && !isBureauRole)) && (
            <>
              <button
                onClick={() => navigateToActivity('school_portal')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'school_portal'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100'
                }`}
              >
                <SchoolIcon className="w-4 h-4" />
                <span>የትምህርት ቤት አስተዳደር (Principal Portal)</span>
              </button>

              <button
                onClick={() => navigateToActivity('exams')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'exams'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>{t.tab_exams}</span>
              </button>

              <button
                onClick={() => navigateToActivity('training')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'training'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{t.tab_training}</span>
              </button>
            </>
          )}

          {/* 7. Bureau Admins and Bureau Staff: Full Supervisory Control */}
          {isBureauRole && (
            <>
              <button
                onClick={() => navigateToActivity('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{t.tab_dashboard}</span>
              </button>

              <button
                onClick={() => navigateToActivity('schools')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'schools'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{t.tab_schools}</span>
              </button>

              <button
                onClick={() => navigateToActivity('staff')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'staff'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{t.tab_staff}</span>
              </button>

              <button
                onClick={() => navigateToActivity('reports')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'reports'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{t.tab_reports}</span>
              </button>

              <button
                onClick={() => navigateToActivity('credentials')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'credentials'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                <span>{t.tab_credentials}</span>
              </button>

              <button
                onClick={() => navigateToActivity('exams')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'exams'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>{t.tab_exams}</span>
              </button>

              <button
                onClick={() => navigateToActivity('training')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'training'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{t.tab_training}</span>
              </button>

              <button
                onClick={() => navigateToActivity('standards')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'standards'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.tab_standards}</span>
              </button>

              <button
                onClick={() => navigateToActivity('school_portal')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'school_portal'
                    ? 'bg-teal-900 text-white shadow-xs font-bold'
                    : 'text-teal-900 bg-teal-50 hover:bg-teal-100'
                }`}
              >
                <SchoolIcon className="w-4 h-4" />
                <span>{t.tab_school_portal}</span>
              </button>

              <button
                onClick={() => navigateToActivity('student_portal')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'student_portal'
                    ? 'bg-violet-900 text-white shadow-xs font-bold'
                    : 'text-violet-900 bg-violet-50 hover:bg-violet-100'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>{t.tab_student_portal}</span>
              </button>
            </>
          )}

          {/* 8. If nobody is logged in (Public View) */}
          {!currentUser && (
            <>
              <button
                onClick={() => navigateToActivity('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{t.tab_dashboard}</span>
              </button>
              <button
                onClick={() => navigateToActivity('school_portal')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'school_portal'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100'
                }`}
              >
                <SchoolIcon className="w-4 h-4" />
                <span>{t.tab_school_portal}</span>
              </button>
              <button
                onClick={() => navigateToActivity('student_portal')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'student_portal'
                    ? 'bg-violet-900 text-white shadow-xs font-bold'
                    : 'text-violet-900 bg-violet-50 hover:bg-violet-100'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>{t.tab_student_portal}</span>
              </button>
            </>
          )}

          {/* Fullscreen Mode Trigger Button */}
          <button
            type="button"
            onClick={() => setIsFullscreenActivity(true)}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all bg-emerald-800 hover:bg-emerald-700 text-white shadow-xs shrink-0 cursor-pointer"
            title="ይህንን አክቲቪቲ ሙሉ እስክሪን አድርግ (Fullscreen Activity Mode)"
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">ሙሉ እስክሪን (Fullscreen)</span>
          </button>
        </div>

        {/* On non-dashboard pages: Return to Dashboard Launcher Banner so buttons are never scattered */}
        {activeTab !== 'dashboard' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 px-3.5 sm:px-4 py-2.5 shadow-xs flex flex-wrap items-center justify-between gap-2.5 text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigateToActivity('dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs cursor-pointer"
                title="ወደ ዳሽቦርድ ማዕከላዊ በተኖች መቆጣጠሪያ ተመለስ"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-300" />
                <span>⌂ ወደ ዳሽቦርድ መቆጣጠሪያ (All Buttons Launcher)</span>
              </button>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <span className="text-slate-600 hidden sm:inline font-medium">
                የአሁኑ ገጽ: <strong className="text-slate-900">{getActivityTitle(activeTab)}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={() => navigateToActivity('school_portal')}
                className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 font-semibold transition-colors cursor-pointer"
                title="የት/ቤት ፖርታል"
              >
                🏫 ት/ቤት
              </button>
              <button
                type="button"
                onClick={() => navigateToActivity('student_portal')}
                className="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-800 hover:bg-violet-100 font-semibold transition-colors cursor-pointer"
                title="የተማሪ እና ወላጅ ገጽ"
              >
                🎓 ተማሪ/ወላጅ
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreenActivity(true)}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                title="ሙሉ እስክሪን አድርግ"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">ሙሉ ስክሪን</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Content Rendering */}
        <main className="flex-1">
          {renderActiveTabContent()}
        </main>
      </div>

      {/* =========================================================================
          FULLSCREEN ACTIVITY OVERLAY: "አንድ በተን ሲነካ የተነካው በተን አክቲቪቲ ሙሉ እስክሪን የተነካው በተን ብቻ እንዲሆን አርገው"
         ========================================================================= */}
      {isFullscreenActivity && (
        <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col w-screen h-screen overflow-hidden">
          {/* Sticky Activity Control Bar */}
          <header className="bg-slate-900 text-white px-3 sm:px-6 py-2.5 flex items-center justify-between border-b border-slate-800 shadow-md shrink-0 gap-2">
            {/* Left: Back to Normal View Button + Activity Icon & Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setIsFullscreenActivity(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white text-xs font-bold transition-all border border-slate-700 shadow-xs cursor-pointer group shrink-0"
                title="ከሙሉ እስክሪን ውጣ (ወደ ዋናው ገጽ ተመለስ - Esc)"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">ወደ መደበኛ እይታ ተመለስ</span>
                <span className="sm:hidden">ተመለስ</span>
              </button>

              <div className="h-6 w-px bg-slate-800 hidden sm:block" />

              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 shrink-0">
                  {getActivityIcon(activeTab)}
                </div>
                <div className="min-w-0">
                  <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate max-w-[140px] xs:max-w-[200px] sm:max-w-xs md:max-w-md">
                    {getActivityTitle(activeTab)}
                  </h2>
                  <p className="text-[10px] text-emerald-400 font-medium truncate hidden sm:block">
                    {activeTab === 'school_portal' ? activeSchool.name : t.bureau_full_name} · ሙሉ እስክሪን (የተመረጠ ስራ ብቻ)
                  </p>
                </div>
              </div>
            </div>

            {/* Center: Fullscreen Indicator */}
            <div className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>ሙሉ እስክሪን ሁነታ · የተነካው በተን አክቲቪቲ ብቻ</span>
            </div>

            {/* Right: Quick Switcher Dropdown + Minimize Button */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative hidden xs:block">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {getAllowedTabOptions().map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setIsFullscreenActivity(false)}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 inline-flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
                title="አሳንስ (መደበኛ እይታ)"
              >
                <Minimize2 className="w-4 h-4" />
                <span className="hidden md:inline">አሳንስ (መደበኛ)</span>
              </button>
            </div>
          </header>

          {/* Fullscreen Body: 100% focused on ONLY the clicked button's activity */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-5 lg:p-6">
            <div className="max-w-7xl mx-auto w-full">
              {renderActiveTabContent()}
            </div>
          </div>
        </div>
      )}

      {/* Footer & System Builder Pedigree */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-12 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Builder Profile Callout Strip */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-black text-amber-300">
                  ሲስተሙን ማን ገነባው? (SYSTEM BUILDER)
                </span>
                <span className="text-[11px] text-slate-400">· ሻሸመኔ፣ ኢትዮጵያ</span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-white">
                ታሜና ሥራው ኃ/የተ/የግ/ማ (Tame & Seraw PLC)
              </h4>
              <p className="text-xs text-amber-200/90 font-medium">
                እህት ድርጅት፡ <strong>ውሽዬ ሶፍትዌር ሶሉሽን (Wushiye Software Solution)</strong>
              </p>
              <p className="text-[11px] text-slate-300 pt-0.5">
                ዋና ቀዳሚ ፕሮግራመር፣ ባክኢንድ፣ ፍሮንትኢንድ እና ዲዛይነር፡ <strong className="text-white">ታምራት አሌ (Tamerat Ale)</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
              <div className="text-left sm:text-right text-[11px] space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">ቀጥታ ስልኮች፡</span>
                  <a href="tel:+251911029070" className="font-mono font-bold text-emerald-400 hover:underline">
                    +251 91 102 9070
                  </a>
                  <span className="text-slate-600">/</span>
                  <a href="tel:+251701370299" className="font-mono font-bold text-sky-400 hover:underline">
                    +251 70 137 0299
                  </a>
                </div>
                <div className="font-mono text-slate-400">tameratale09@gmail.com</div>
              </div>

              <button
                type="button"
                onClick={() => setShowDeveloperProfileModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>ሙሉ የአበልፃጊ መረጃ</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800/80 text-[11px]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-slate-300">{t.bureau_full_name}</span>
              <span>·</span>
              <span>{t.city_name}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="text-emerald-400 font-semibold">
                ኦንላይን እና ኦፍላይን ይፋዊ ስርዓት (Online & Offline Ready)
              </span>
              <span>© 2016-2017 ዓ.ም</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal (Section 1: Bureau Login, Section 2: School Self-Registration, Section 3: School Login) */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentLang={currentLang}
        onLoginSuccess={handleLoginSuccess}
        onSchoolRegistered={handleNewSchoolRegistered}
        initialTab={loginModalTab}
      />

      {/* Quick Role Switcher Modal to demonstrate & test all 9 roles and their strict isolation */}
      {showQuickRoleModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    የስራ ሚና እና የመግቢያ ኮድ ምረጥ (Role Isolation Tester)
                  </h3>
                  <p className="text-xs text-slate-500">
                    አንዱ የአንዱን ስራ ሳያይ እያንዳንዱ ሰራተኛ የተፈቀደለትን ብቻ እንዲሰራ በሲስተሙ የተወሰነ ነው
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQuickRoleModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>የስራ ወሰን ጥበቃ (Role Isolation Rules):</strong> ከስር ካሉት 9 የስራ ሚናዎች አንዱን ሲመርጡ
                ወይም ኮዳቸውን ሲያስገቡ ሲስተሙ ለዚያ ሚና የተፈቀደውን ክፍል ብቻ ያሳያል፤ ሌሎች ሚስጥራዊ ወይም ያልተፈቀዱ ክፍሎች ሙሉ በሙሉ ይከለከላሉ።
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  role: 'school_owner' as const,
                  title: '1. ባለቤት / የቦርድ ሰብሳቢ',
                  name: 'ዶ/ር ተስፋዬ በቀለ',
                  code: 'OWN-SHAS-01',
                  color: 'border-amber-300 bg-amber-50/50 hover:bg-amber-100/60',
                  icon: <Crown className="w-4 h-4 text-amber-600" />,
                  desc: 'ዳይሬክተር መቅጠር፣ ኮድ መስጠት፣ የበላይ ቁጥጥር፣ የቦርድ ማስታወቂያ'
                },
                {
                  role: 'school_director' as const,
                  title: '2. ዋና ዳይሬክተር / ርዕሰ መምህር',
                  name: 'አቶ ጉተማ ዋቆ',
                  code: 'DIR-SHAS-01',
                  color: 'border-teal-300 bg-teal-50/50 hover:bg-teal-100/60',
                  icon: <SchoolIcon className="w-4 h-4 text-teal-600" />,
                  desc: 'ሰራተኞችንና ክፍሎችን መቆጣጠር፣ ሪፖርቶች መቀበል፣ ማስታወቂያ'
                },
                {
                  role: 'teacher' as const,
                  title: '3. መምህር',
                  name: 'መ/ር በፈቃዱ ጥላሁን',
                  code: 'TCH-BEFE-01',
                  color: 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100/60',
                  icon: <Award className="w-4 h-4 text-emerald-600" />,
                  desc: 'ተማሪ ማስተማር፣ የቤት ስራ መስጠትና ማረም፣ ውጤት መመዝገብ'
                },
                {
                  role: 'student' as const,
                  title: '4. ተማሪ',
                  name: 'ኪያር ከድር አሊ',
                  code: 'STU-KIYAR-01',
                  color: 'border-violet-300 bg-violet-50/50 hover:bg-violet-100/60',
                  icon: <GraduationCap className="w-4 h-4 text-violet-600" />,
                  desc: 'የራስን ውጤት ማየት፣ የቤት ስራ መስራት፣ ማስታወቂያ፣ መታወቂያ'
                },
                {
                  role: 'parent' as const,
                  title: '5. ወላጅ / አሳዳጊ',
                  name: 'አቶ ከድር አሊ',
                  code: 'PAR-KIYAR-01',
                  color: 'border-rose-300 bg-rose-50/50 hover:bg-rose-100/60',
                  icon: <Users className="w-4 h-4 text-rose-600" />,
                  desc: 'የልጅን ውጤትና ዕለታዊ መገኘት ማየት፣ የወር ክፍያ መክፈል'
                },
                {
                  role: 'accountant' as const,
                  title: '6. የሒሳብ ሰራተኛ (Finance)',
                  name: 'ወ/ሮ ሰላማዊት አበራ',
                  code: 'ACC-SHAS-01',
                  color: 'border-green-300 bg-green-50/50 hover:bg-green-100/60',
                  icon: <DollarSign className="w-4 h-4 text-green-600" />,
                  desc: 'የወር ክፍያ መሰብሰብ፣ ደረሰኝ፣ አስተዳደራዊ ወጪና ሚዛን'
                },
                {
                  role: 'registrar' as const,
                  title: '7. ሬጅስትራር (ቅበላ & መዝገብ)',
                  name: 'አቶ ዳንኤል ንጉሴ',
                  code: 'REG-SHAS-01',
                  color: 'border-blue-300 bg-blue-50/50 hover:bg-blue-100/60',
                  icon: <ClipboardList className="w-4 h-4 text-blue-600" />,
                  desc: 'አዳዲስ ተማሪዎችን መመዝገብ፣ ክፍል መመደብ፣ መታወቂያ ካርድ'
                },
                {
                  role: 'teacher' as const,
                  staffDepartment: 'library',
                  title: '8. የቤተ-መጻሕፍት ኃላፊ',
                  name: 'ወ/ሮ ሙሉእመቤት ደረሰ',
                  code: 'LIB-MULU-02',
                  color: 'border-indigo-300 bg-indigo-50/50 hover:bg-indigo-100/60',
                  icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
                  desc: 'የመጻሕፍት ካታሎግ፣ የተማሪዎች ንባብ አገልግሎትና የተውሶ መዝገብ'
                },
                {
                  role: 'bureau_admin' as const,
                  title: '9. የከተማ ትምህርት ቢሮ አስተዳዳሪ',
                  name: 'የሻሸመኔ ትምህርት ቢሮ',
                  code: '123456',
                  color: 'border-slate-400 bg-slate-100 hover:bg-slate-200/80 sm:col-span-2',
                  icon: <ShieldCheck className="w-4 h-4 text-slate-800" />,
                  desc: 'የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ የበላይ ቁጥጥርና ኢንስፔክሽን'
                }
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    handleLoginSuccess({
                      role: item.role,
                      name: item.name,
                      schoolId: activeSchool.id,
                      schoolName: activeSchool.name,
                      staffDepartment: (item as any).staffDepartment,
                      identifier: item.code,
                      accessCode: item.code
                    });
                    setShowQuickRoleModal(false);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-1.5 cursor-pointer ${item.color}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-white shadow-2xs">
                        {item.icon}
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        {item.title}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-amber-300">
                      {item.code}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700">
                    <strong>{item.name}</strong>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowQuickRoleModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                ዝጋ (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secret Developer Portal Modal (5 taps on Bureau Logo + Password: tameratale6576) */}
      <SecretDeveloperPortalModal
        isOpen={showDeveloperPortalModal}
        onClose={() => setShowDeveloperPortalModal(false)}
        onSchoolStatusChanged={() => {
          const freshSchools = StorageService.getSchools();
          setSchools(freshSchools);
        }}
      />

      {/* System Developer Profile Modal ("ሲስተሙን ማን ገነባው?") */}
      <SystemDeveloperProfileModal
        isOpen={showDeveloperProfileModal}
        onClose={() => setShowDeveloperProfileModal(false)}
        onOpenDeveloperPortal={() => setShowDeveloperPortalModal(true)}
      />

      {/* Offline Connectivity Indicator */}
      <OfflineIndicator currentLang={currentLang} />

      {/* Mobile Phone Bottom Navigation Bar (sm:hidden) */}
      <MobileBottomNav
        currentLang={currentLang}
        activeTab={activeTab}
        onNavigate={(tab, subTab) => navigateToActivity(tab, subTab)}
        currentUser={currentUser}
        onOpenRoleModal={() => setShowQuickRoleModal(true)}
        onOpenDeveloperPortal={() => setShowDeveloperPortalModal(true)}
        isSchoolView={isSchoolView}
        schoolName={activeSchool?.name}
        onOpenCodeGate={() => setShowCodeGate(true)}
        onOpenDeveloperProfile={() => setShowDeveloperProfileModal(true)}
      />
    </div>
  );
}
