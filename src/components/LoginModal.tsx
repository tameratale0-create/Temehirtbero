import React, { useState } from 'react';
import {
  ShieldCheck,
  Building,
  GraduationCap,
  Users,
  KeyRound,
  AlertCircle,
  X,
  CheckCircle2,
  Lock,
  Building2,
  Sparkles,
  ArrowRight,
  School as SchoolIcon,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Camera,
  Upload,
  Zap,
  UserCheck,
  Copy,
  Check
} from 'lucide-react';
import { SchoolLogo, SCHOOL_LOGO_PRESETS } from './SchoolLogo';
import {
  Language,
  AppUserSession,
  School,
  SchoolType,
  SchoolLevel,
  InspectionLevel,
  UserRole
} from '../types';
import { translations } from '../data/translations';
import { StorageService } from '../utils/storage';
import { getLocalizedSchool, getLocalizedSchoolCode } from '../utils/localizedData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onLoginSuccess: (session: AppUserSession) => void;
  onSchoolRegistered?: (newSchool: School) => void;
  initialTab?: 'bureau' | 'school_reg' | 'school_login';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onLoginSuccess,
  onSchoolRegistered,
  initialTab = 'bureau'
}) => {
  const t = translations[currentLang];

  // 3 Distinct Sections as explicitly requested:
  // 1: የትምህርት ቢሮ መግቢያ (Bureau Login)
  // 2: ትምህርት ቤቶች በራሳቸው ፎርም ሞልተው የሚመዘገቡበት (School Self-Registration Form)
  // 3: ትምህርት ቤቶች የሚገቡበት (Schools Login)
  const [activeTab, setActiveTab] = useState<'bureau' | 'school_reg' | 'school_login'>(
    initialTab || 'bureau'
  );

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Tab 1 (Bureau) state
  const [bureauAdminPassword, setBureauAdminPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Tab 3 (School Login) state
  const [schoolAccessCode, setSchoolAccessCode] = useState('');

  // Tab 2 (School Self-Registration Form) state
  const [name, setName] = useState('');
  const [nameOm, setNameOm] = useState('');
  const [type, setType] = useState<SchoolType>('government');
  const [level, setLevel] = useState<SchoolLevel>('secondary');
  const [subcity, setSubcity] = useState('አቦስቶ (Abosto)');
  const [principalName, setPrincipalName] = useState('');
  const [phone, setPhone] = useState('+251 ');
  const [email, setEmail] = useState('');
  const [establishedYear, setEstablishedYear] = useState(2000);
  const [maleStudents, setMaleStudents] = useState<number>(350);
  const [femaleStudents, setFemaleStudents] = useState<number>(350);
  const [maleTeachers, setMaleTeachers] = useState<number>(18);
  const [femaleTeachers, setFemaleTeachers] = useState<number>(14);
  const [classroomsCount, setClassroomsCount] = useState<number>(20);
  const [labsCount, setLabsCount] = useState<number>(2);
  const [libraryCapacity, setLibraryCapacity] = useState<number>(100);
  const [inspectionLevel, setInspectionLevel] = useState<InspectionLevel>('level_2');
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);

  const [registeredSchoolCode, setRegisteredSchoolCode] = useState<string | null>(null);
  const [newlyRegisteredSchool, setNewlyRegisteredSchool] = useState<School | null>(null);
  const [showDemoTray, setShowDemoTray] = useState(true);
  const [copiedDemoCode, setCopiedDemoCode] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Logo Upload for New Registration
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 260;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            setLogoUrl(canvas.toDataURL('image/jpeg', 0.85));
          } else {
            setLogoUrl(dataUrl);
          }
        } catch {
          setLogoUrl(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // 1. Bureau Login Handler
  const handleBureauLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Master password 123456 requested explicitly:
    // "ሎጊን የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ አስተዳደሪ የመግብያ የይለፍ ቃል 123456 አርገው"
    if (bureauAdminPassword === '123456') {
      onLoginSuccess({
        role: 'bureau_admin',
        name: 'የሻሸመኔ ትምህርት ቢሮ አስተዳዳሪ (Bureau Admin)',
        identifier: 'admin',
        accessCode: '123456'
      });
      onClose();
      return;
    }

    // Also check if entered code matches a registered Bureau Staff officer
    const staffList = StorageService.getStaff();
    const matchedStaff = staffList.find(
      (s) => s.accessCode.trim().toUpperCase() === bureauAdminPassword.trim().toUpperCase()
    );
    if (matchedStaff) {
      onLoginSuccess({
        role: 'bureau_staff',
        name: matchedStaff.fullName,
        staffDepartment: matchedStaff.department,
        identifier: matchedStaff.id,
        accessCode: matchedStaff.accessCode
      });
      onClose();
      return;
    }

    setErrorMessage(t.login_err_pwd);
  };

  // 2. School Self-Registration Form Handler
  const handleSelfRegisterSchool = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const codePrefix = name.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'SCH');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const generatedCode = `${codePrefix}-${level === 'secondary' ? 'SEC' : 'PRI'}-${randomSuffix}`;

    const totalStudents = Number(maleStudents) + Number(femaleStudents);
    const totalTeachers = Number(maleTeachers) + Number(femaleTeachers);

    const newSchool: School = {
      id: `sch-${Date.now()}`,
      name,
      nameOm: nameOm || undefined,
      code: generatedCode,
      type,
      level,
      subcity,
      principalName,
      phone,
      email: email || `${generatedCode.toLowerCase()}@education.gov.et`,
      establishedYear: Number(establishedYear),
      totalStudents,
      maleStudents: Number(maleStudents),
      femaleStudents: Number(femaleStudents),
      totalTeachers,
      maleTeachers: Number(maleTeachers),
      femaleTeachers: Number(femaleTeachers),
      classroomsCount: Number(classroomsCount),
      labsCount: Number(labsCount),
      libraryCapacity: Number(libraryCapacity),
      inspectionLevel,
      status: 'active',
      accessCode: generatedCode,
      createdAt: new Date().toISOString().split('T')[0],
      logoUrl: logoUrl || undefined
    };

    StorageService.addSchool(newSchool);
    if (onSchoolRegistered) {
      onSchoolRegistered(newSchool);
    }
    setRegisteredSchoolCode(generatedCode);
    setNewlyRegisteredSchool(newSchool);
  };

  // Instant login right after self-registration
  const handleLoginImmediatelyWithNewSchool = () => {
    if (!newlyRegisteredSchool) return;
    onLoginSuccess({
      role: 'school_admin',
      name: `${newlyRegisteredSchool.principalName} (${newlyRegisteredSchool.name})`,
      schoolId: newlyRegisteredSchool.id,
      schoolName: newlyRegisteredSchool.name,
      schoolLogoUrl: newlyRegisteredSchool.logoUrl,
      identifier: newlyRegisteredSchool.id,
      accessCode: newlyRegisteredSchool.accessCode
    });
    onClose();
  };

  // 3. School Login Handler
  const handleSchoolLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanCode = schoolAccessCode.trim().toUpperCase();

    // 3a. Check School access code (Principals / Owners)
    const schools = StorageService.getSchools();
    const matchedSchool = schools.find((s) => s.accessCode.toUpperCase() === cleanCode);

    if (matchedSchool) {
      const locSchool = getLocalizedSchool(matchedSchool, currentLang);
      onLoginSuccess({
        role: 'school_admin',
        name: `${locSchool.principalName} (${locSchool.name})`,
        schoolId: locSchool.id,
        schoolName: locSchool.name,
        identifier: locSchool.id,
        accessCode: locSchool.accessCode
      });
      onClose();
      return;
    }

    // 3b. Check School internal generated codes (Director, Teacher, Student, Parent)
    const schoolCodes = StorageService.getSchoolCodes();
    const matchedCode = schoolCodes.find((c) => c.accessCode.toUpperCase() === cleanCode);
    if (matchedCode) {
      const locCode = getLocalizedSchoolCode(matchedCode, currentLang);
      onLoginSuccess({
        role: locCode.role,
        name: locCode.fullName,
        schoolId: locCode.schoolId,
        schoolName: locCode.schoolName,
        identifier: locCode.id,
        accessCode: locCode.accessCode
      });
      onClose();
      return;
    }

    // 3c. Check Student and Parent roster codes
    const students = StorageService.getStudents();
    const matchedStudent = students.find((s) => s.accessCode.toUpperCase() === cleanCode);
    if (matchedStudent) {
      onLoginSuccess({
        role: 'student',
        name: matchedStudent.fullName,
        schoolId: matchedStudent.schoolId,
        schoolName: matchedStudent.schoolName,
        identifier: matchedStudent.id,
        accessCode: matchedStudent.accessCode
      });
      onClose();
      return;
    }

    const matchedParent = students.find((s) => s.parentAccessCode.toUpperCase() === cleanCode);
    if (matchedParent) {
      onLoginSuccess({
        role: 'parent',
        name: `${matchedParent.parentName} (${matchedParent.fullName} ወላጅ)`,
        schoolId: matchedParent.schoolId,
        schoolName: matchedParent.schoolName,
        identifier: matchedParent.id,
        accessCode: matchedParent.parentAccessCode
      });
      onClose();
      return;
    }

    // 3d. Check Teacher license number
    const creds = StorageService.getCredentials();
    const matchedTeacher = creds.find(
      (c) => c.licenseNumber.toUpperCase() === cleanCode
    );
    if (matchedTeacher) {
      onLoginSuccess({
        role: 'teacher',
        name: matchedTeacher.teacherName,
        schoolId: matchedTeacher.schoolId,
        schoolName: matchedTeacher.schoolName,
        identifier: matchedTeacher.id,
        accessCode: matchedTeacher.licenseNumber
      });
      onClose();
      return;
    }

    // 3e. Check School Stakeholders (Librarian, Counselor, Vice Principal, IT, etc.)
    const stakeholders = StorageService.getStakeholders();
    const matchedStakeholder = stakeholders.find(
      (s) =>
        (s.accessCode && s.accessCode.trim().toUpperCase() === cleanCode) ||
        s.faydaNumber.trim().toUpperCase() === cleanCode
    );
    if (matchedStakeholder) {
      let resolvedRole: UserRole = 'school_admin';
      if (
        matchedStakeholder.role === 'principal' ||
        matchedStakeholder.role === 'vice_principal_academic' ||
        matchedStakeholder.role === 'vice_principal_admin'
      ) {
        resolvedRole = 'school_director';
      } else if (matchedStakeholder.role === 'school_owner_board') {
        resolvedRole = 'school_owner';
      } else if (matchedStakeholder.role === 'teacher' || matchedStakeholder.role === 'department_head') {
        resolvedRole = 'teacher';
      } else if (matchedStakeholder.role === 'registrar_finance') {
        resolvedRole = 'registrar';
      }

      onLoginSuccess({
        role: resolvedRole,
        name: `${matchedStakeholder.fullName} (${matchedStakeholder.roleCustomTitle || matchedStakeholder.officeOrDepartment})`,
        schoolId: matchedStakeholder.schoolId,
        schoolName: matchedStakeholder.schoolName,
        identifier: matchedStakeholder.id,
        accessCode: matchedStakeholder.accessCode || matchedStakeholder.faydaNumber,
        staffDepartment: matchedStakeholder.officeOrDepartment
      });
      onClose();
      return;
    }

    setErrorMessage(t.login_err_code);
  };

  // Quick Demo Testing Accounts - 1-Click Fast Login for Every Isolated Role
  const quickDemoAccounts = [
    {
      id: 'demo-bureau-admin',
      role: 'bureau_admin' as const,
      roleTitle: 'የትምህርት ቢሮ አስተዳዳሪ',
      personName: 'የሻሸመኔ ትምህርት ቢሮ አስተዳዳሪ',
      code: '123456',
      badge: 'Master Admin',
      badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-700" />,
      desc: 'የከተማው ትምህርት ቢሮ አስተዳደር'
    },
    {
      id: 'demo-school-owner',
      role: 'school_owner' as const,
      roleTitle: 'የት/ቤት ባለቤት (የቦርድ ሰብሳቢ)',
      personName: 'ዶ/ር ተስፋዬ በቀለ (ባለቤት/ቦርድ)',
      code: 'OWN-SHAS-01',
      schoolId: 'sch-1',
      schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
      badge: 'Owner / Board',
      badgeStyle: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: <Building2 className="w-4 h-4 text-amber-700" />,
      desc: 'ዳይሬክተር ቅጥር፣ ኮዶችና የበላይ ቁጥጥር'
    },
    {
      id: 'demo-school-principal',
      role: 'school_director' as const,
      roleTitle: 'ዋና ዳይሬክተር / ርዕሰ መምህር',
      personName: 'አቶ ጉተማ ዋቆ (ዳይሬክተር)',
      code: 'DIR-SHAS-01',
      schoolId: 'sch-1',
      schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
      badge: 'Director',
      badgeStyle: 'bg-teal-100 text-teal-800 border-teal-300',
      icon: <SchoolIcon className="w-4 h-4 text-teal-700" />,
      desc: 'ሰራተኞችንና ተማሪዎችን መቆጣጠር'
    },
    {
      id: 'demo-teacher',
      role: 'teacher' as const,
      roleTitle: 'መምህር (ሂሳብ/ፊዚክስ)',
      personName: 'መ/ር በፈቃዱ ጥላሁን (መምህር)',
      code: 'TCH-BEFE-01',
      schoolId: 'sch-1',
      schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
      badge: 'Teacher',
      badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: <Award className="w-4 h-4 text-emerald-700" />,
      desc: 'የቤት ስራ፣ መገኘትና ውጤት መመዝገቢያ'
    },
    {
      id: 'demo-accountant',
      role: 'accountant' as const,
      roleTitle: 'የሒሳብ ሰራተኛ (Finance)',
      personName: 'ወ/ሮ ሰላማዊት አበራ (ሒሳብ ሹም)',
      code: 'ACC-SHAS-01',
      schoolId: 'sch-1',
      schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
      badge: 'Accountant',
      badgeStyle: 'bg-green-100 text-green-800 border-green-300',
      icon: <CheckCircle2 className="w-4 h-4 text-green-700" />,
      desc: 'የወር ክፍያ፣ ደረሰኝና የት/ቤት ወጪ'
    },
    {
      id: 'demo-registrar',
      role: 'registrar' as const,
      roleTitle: 'ሬጅስትራር (ተማሪ መዝጋቢ)',
      personName: 'አቶ ዳንኤል ንጉሴ (ሬጅስትራር)',
      code: 'REG-SHAS-01',
      schoolId: 'sch-1',
      schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
      badge: 'Registrar',
      badgeStyle: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: <Users className="w-4 h-4 text-blue-700" />,
      desc: 'የተማሪ ቅበላ፣ ምዝገባና መታወቂያ ካርድ'
    },
    {
      id: 'demo-school-librarian',
      role: 'school_admin' as const,
      roleTitle: 'የት/ቤት ቤተ-መጻሕፍት ኃላፊ',
      personName: 'ወ/ሮ ሙሉእመቤት ደረሰ (ቤተ-መጻሕፍት)',
      code: 'LIB-MULU-02',
      schoolId: 'sch-1',
      schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
      staffDepartment: 'library',
      badge: 'Library Desk',
      badgeStyle: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      icon: <BookOpen className="w-4 h-4 text-indigo-700" />,
      desc: 'የመጻሕፍት ካታሎግና የተውሶ መዝገብ'
    },
    {
      id: 'demo-student',
      role: 'student' as const,
      roleTitle: 'ተማሪ (10ኛ ክፍል)',
      personName: 'ኪያር ከድር አሊ (ተማሪ)',
      code: 'STU-KIYAR-01',
      schoolId: 'sch-1',
      schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
      badge: 'Student',
      badgeStyle: 'bg-violet-100 text-violet-800 border-violet-300',
      icon: <GraduationCap className="w-4 h-4 text-violet-700" />,
      desc: 'የተማሪ ፖርታል፣ ውጤትና የቤት ስራ'
    },
    {
      id: 'demo-parent',
      role: 'parent' as const,
      roleTitle: 'የተማሪ ወላጅ',
      personName: 'አቶ ከድር አሊ (ወላጅ)',
      code: 'PAR-KIYAR-01',
      schoolId: 'sch-1',
      schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
      badge: 'Parent',
      badgeStyle: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: <Users className="w-4 h-4 text-rose-700" />,
      desc: 'የልጆች ክትትል፣ መገኘትና ክፍያ'
    }
  ];

  const handleQuickDemoLogin = (account: typeof quickDemoAccounts[number]) => {
    onLoginSuccess({
      role: account.role,
      name: account.personName,
      schoolId: account.schoolId,
      schoolName: account.schoolName,
      staffDepartment: account.staffDepartment,
      identifier: account.id,
      accessCode: account.code
    });
    onClose();
  };

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedDemoCode(code);
    setTimeout(() => setCopiedDemoCode(null), 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div
        className={`bg-white rounded-2xl w-full my-6 overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 transition-all ${
          activeTab === 'school_reg' ? 'max-w-2xl' : 'max-w-xl'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5 mb-1">
            <Lock className="w-5 h-5 text-emerald-300" />
            <h2 className="text-lg font-bold">{t.login_title}</h2>
          </div>
          <p className="text-xs text-emerald-100">{t.login_desc}</p>
        </div>

        {/* =========================================================================
            ⚡ QUICK 1-CLICK DEMO LOGIN (ሲስተሙን ለመሞከር ፈጣን መግቢያ)
           ========================================================================= */}
        <div className="bg-gradient-to-r from-amber-50 via-emerald-50/50 to-teal-50 border-b border-amber-200/80 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-900 shrink-0">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-700 animate-pulse" />
              </span>
              <div>
                <h3 className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>{t.quick_demo_login_title}</span>
                  <span className="bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                    1-Click
                  </span>
                </h3>
                <p className="text-[11px] text-slate-600">
                  {t.quick_demo_login_sub}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowDemoTray(!showDemoTray)}
              className="text-[11px] text-emerald-900 font-bold hover:underline shrink-0 bg-white/90 px-2 py-1 rounded-md border border-emerald-300 shadow-2xs"
            >
              {showDemoTray ? 'ሰብስብ ▲' : 'ሁሉንም አሳይ ▼'}
            </button>
          </div>

          {showDemoTray && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 max-h-56 overflow-y-auto pr-1">
              {quickDemoAccounts.map((acc) => (
                <div
                  key={acc.id}
                  onClick={() => handleQuickDemoLogin(acc)}
                  className="group flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/60 shadow-2xs transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-white flex items-center justify-center shrink-0 border border-slate-200 group-hover:border-emerald-300 transition-colors">
                      {acc.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-900">
                          {acc.roleTitle}
                        </span>
                        <span className={`text-[9px] font-bold px-1 py-0.2 rounded border ${acc.badgeStyle}`}>
                          {acc.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">
                        {acc.personName} · <span className="font-mono text-slate-700 font-semibold">{acc.code}</span>
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1 pl-1">
                    <button
                      type="button"
                      title="ኮድ ቅዳ"
                      onClick={(e) => handleCopyCode(acc.code, e)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                    >
                      {copiedDemoCode === acc.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="px-2 py-1 rounded-lg bg-emerald-800 text-white text-[10px] font-bold group-hover:bg-emerald-700 flex items-center gap-0.5 shadow-2xs">
                      <span>ግባ</span>
                      <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3 Distinct Tabs as explicitly requested */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          {/* Tab 1: Bureau Login */}
          <button
            onClick={() => {
              setActiveTab('bureau');
              setErrorMessage('');
            }}
            className={`py-3.5 px-2 text-center transition-all border-b-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeTab === 'bureau'
                ? 'border-emerald-700 text-emerald-900 bg-white font-bold shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span className="text-[11px] sm:text-xs">{t.login_tab_bureau}</span>
          </button>

          {/* Tab 2: Schools Self-Registration Form */}
          <button
            onClick={() => {
              setActiveTab('school_reg');
              setErrorMessage('');
            }}
            className={`py-3.5 px-2 text-center transition-all border-b-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeTab === 'school_reg'
                ? 'border-emerald-700 text-emerald-900 bg-white font-bold shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4 text-teal-700" />
            <span className="text-[11px] sm:text-xs">{t.login_tab_school_reg}</span>
          </button>

          {/* Tab 3: Schools Login */}
          <button
            onClick={() => {
              setActiveTab('school_login');
              setErrorMessage('');
            }}
            className={`py-3.5 px-2 text-center transition-all border-b-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeTab === 'school_login'
                ? 'border-emerald-700 text-emerald-900 bg-white font-bold shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <SchoolIcon className="w-4 h-4 text-emerald-700" />
            <span className="text-[11px] sm:text-xs">{t.login_tab_school_login}</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab 1 Content: Education Bureau Login */}
        {activeTab === 'bureau' && (
          <div className="p-6 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                ክፍል 1፡ የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ መግቢያ
              </h3>
              <p className="text-[11px] text-slate-500">
                ለቢሮው አስተዳዳሪ (Master Admin) እና ለትምህርት ቢሮ ሰራተኞች
              </p>
            </div>

            <form onSubmit={handleBureauLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.password_label} (ወይም የቢሮ ሰራተኛ መለያ ኮድ)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={bureauAdminPassword}
                    onChange={(e) => setBureauAdminPassword(e.target.value)}
                    placeholder={t.enter_pwd_placeholder}
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    required
                  />
                </div>
                <div className="mt-2.5 p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-[11px] text-emerald-950 leading-relaxed space-y-1">
                  <p>
                    🔑 <strong>የቢሮ አስተዳዳሪ ይለፍ ቃል፡</strong> <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono font-bold text-emerald-900">123456</code>
                  </p>
                  <p className="text-emerald-800">
                    ወይም የተመዘገቡ የቢሮ ሰራተኞች ኮድ፡ <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono">BUR-INSP-02</code>, <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono">BUR-CURR-03</code>
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>ወደ ትምህርት ቢሮ ገጽ ግባ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    onLoginSuccess({
                      role: 'bureau_admin',
                      name: 'የሻሸመኔ ትምህርት ቢሮ አስተዳዳሪ (Bureau Admin)',
                      identifier: 'admin',
                      accessCode: '123456'
                    });
                    onClose();
                  }}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{t.quick_demo_bureau_btn} (1-Click)</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2 Content: Schools Self-Registration Form */}
        {activeTab === 'school_reg' && (
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-teal-700" />
                <span>ክፍል 2፡ የትምህርት ቤቶች ራስ-አገዝ ይፋዊ ምዝገባ (School Self-Registration)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                በትምህርት ቢሮ መስፈርት መሰረት ትምህርት ቤቶች በራሳቸው ፎርሙን ሞልተው የሚመዘገቡበት እና የመግቢያ ኮድ የሚያገኙበት
              </p>
            </div>

            {registeredSchoolCode ? (
              <div className="p-6 text-center space-y-4 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">{t.reg_success}</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  ትምህርት ቤትዎ በሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ ስርዓት ውስጥ በተሳካ ሁኔታ ተመዝግቧል። ወደ ሲስተሙ ለመግባት የሚከተለውን ልዩ የመግቢያ ኮድ ይጠቀሙ፡
                </p>

                <div className="bg-white border-2 border-dashed border-emerald-400 p-4 rounded-xl max-w-sm mx-auto shadow-xs">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">
                    የትምህርት ቤቱ መግቢያ ኮድ (Access Code)
                  </span>
                  <span className="text-2xl font-mono font-extrabold text-emerald-950 tracking-wider my-1 block">
                    {registeredSchoolCode}
                  </span>
                  <p className="text-[10px] text-emerald-700">
                    በዚህ ኮድ አሁን በቀጥታ ወደ ትምህርት ቤትዎ ፖርታል መግባት ይችላሉ።
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleLoginImmediatelyWithNewSchool}
                    className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <span>ወዲያው ወደ ት/ቤቱ ገጽ ግባ (Open School Portal)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRegisteredSchoolCode(null);
                      setActiveTab('school_login');
                      setSchoolAccessCode(registeredSchoolCode);
                    }}
                    className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    ወደ መግቢያ ገጽ ተመለስ
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSelfRegisterSchool} className="space-y-4">
                {/* 1. General Info */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-slate-800 block border-b border-slate-100 pb-1">
                    1. አጠቃላይ መረጃ (Institutional Profile)
                  </span>

                  {/* School Profile Logo Upload & Presets */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-emerald-700" />
                        <span>የትምህርት ቤት ፕሮፋይል አርማ (School Profile Logo)</span>
                      </span>
                      {logoUrl && (
                        <button
                          type="button"
                          onClick={() => setLogoUrl(undefined)}
                          className="text-[10px] text-rose-600 hover:underline"
                        >
                          አርማ አስወግድ
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <SchoolLogo
                        logoUrl={logoUrl}
                        schoolName={name || 'ትምህርት ቤት'}
                        size={52}
                        shape="rounded"
                        className="shadow-xs shrink-0"
                      />

                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold rounded-lg cursor-pointer transition-colors shadow-xs">
                            <Upload className="w-3 h-3" />
                            <span>ከስልክ/ኮምፒተር ፎቶ ጫን</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoFileChange}
                              className="hidden"
                            />
                          </label>
                          <span className="text-[10px] text-slate-400">ወይም ይፋዊ አርማ ምረጥ፡</span>
                        </div>

                        {/* Presets Row */}
                        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                          {SCHOOL_LOGO_PRESETS.map((pr) => (
                            <button
                              key={pr.id}
                              type="button"
                              onClick={() => setLogoUrl(pr.id)}
                              className={`p-1 rounded-lg border transition-all ${
                                logoUrl === pr.id
                                  ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                              title={pr.labelAm}
                            >
                              <SchoolLogo
                                logoUrl={pr.id}
                                schoolName=""
                                size={26}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.school_name_label} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="ምሳሌ፡ አዋሾ አዲስ አካዳሚ"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Maqaa Afaan Oromootiin (Oromo Name)
                      </label>
                      <input
                        type="text"
                        value={nameOm}
                        onChange={(e) => setNameOm(e.target.value)}
                        placeholder="M/B Sadarkaa..."
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.school_type_label} *
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as SchoolType)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="government">የመንግስት (Government)</option>
                        <option value="private">የግል (Private Academy)</option>
                        <option value="mission">የሚሽን / የህዝብ (Mission / Public)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.school_level_label} *
                      </label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value as SchoolLevel)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="primary">1ኛ ደረጃ (Primary 1-8)</option>
                        <option value="middle">መካከለኛ ደረጃ (Middle 7-8)</option>
                        <option value="secondary">2ኛ ደረጃ (Secondary 9-12)</option>
                        <option value="complete">የተሟላ 1-12 (Complete 1-12)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.subcity_label} *
                      </label>
                      <select
                        value={subcity}
                        onChange={(e) => setSubcity(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="አቦስቶ (Abosto)">አቦስቶ (Abosto)</option>
                        <option value="ቡልቻና (Bulchana)">ቡልቻና (Bulchana)</option>
                        <option value="አዋሾ (Awasho)">አዋሾ (Awasho)</option>
                        <option value="ቁዬራ (Kuyera)">ቁዬራ (Kuyera)</option>
                        <option value="አለሉ (Alelu)">አለሉ (Alelu)</option>
                        <option value="ዲዳ ቦቄ (Dida Boke)">ዲዳ ቦቄ (Dida Boke)</option>
                        <option value="አራዳ (Arada)">አራዳ (Arada)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.established_label}
                      </label>
                      <input
                        type="number"
                        value={establishedYear}
                        onChange={(e) => setEstablishedYear(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Principal & Contact */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-bold text-slate-800 block border-b border-slate-100 pb-1">
                    2. ርዕሰ መምህር እና አድራሻ (Principal & Contacts)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.principal_name_label} *
                      </label>
                      <input
                        type="text"
                        required
                        value={principalName}
                        onChange={(e) => setPrincipalName(e.target.value)}
                        placeholder="ስም..."
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.phone_label} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+251 9..."
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.email_label}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="school@example.com"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Enrollment & Facilities */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-bold text-slate-800 block border-b border-slate-100 pb-1">
                    3. የተማሪዎች፣ መምህራን እና የመማሪያ ግብአቶች ስታቲስቲክስ
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        ወንድ ተማሪዎች
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={maleStudents}
                        onChange={(e) => setMaleStudents(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        ሴት ተማሪዎች
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={femaleStudents}
                        onChange={(e) => setFemaleStudents(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        መምህራን (ወንድ)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={maleTeachers}
                        onChange={(e) => setMaleTeachers(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        መምህራን (ሴት)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={femaleTeachers}
                        onChange={(e) => setFemaleTeachers(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        የመማሪያ ክፍሎች
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={classroomsCount}
                        onChange={(e) => setClassroomsCount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        የላብራቶሪ ብዛት
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={labsCount}
                        onChange={(e) => setLabsCount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        የትምህርት ቢሮ ምዘና
                      </label>
                      <select
                        value={inspectionLevel}
                        onChange={(e) => setInspectionLevel(e.target.value as InspectionLevel)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="level_1">ደረጃ 1 (Level 1)</option>
                        <option value="level_2">ደረጃ 2 (Level 2)</option>
                        <option value="level_3">ደረጃ 3 (Level 3 - Good)</option>
                        <option value="level_4">ደረጃ 4 (Level 4 - Model)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('school_login')}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    ቀደም ሲል ተመዝግበናል? ግባ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                  >
                    {t.btn_register_school}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 3 Content: Schools Login */}
        {activeTab === 'school_login' && (
          <div className="p-6 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <SchoolIcon className="w-4 h-4 text-emerald-700" />
                <span>ክፍል 3፡ የትምህርት ቤቶች መግቢያ (Schools Login)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                የትምህርት ቤት ባለቤት፣ ዳይሬክተር፣ መምህራን፣ ተማሪዎች እና ወላጆች በኮዳቸው የሚገቡበት
              </p>
            </div>

            <form onSubmit={handleSchoolLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  የት/ቤት ወይም የተጠቃሚ መለያ ኮድ (Access Code)
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={schoolAccessCode}
                    onChange={(e) => setSchoolAccessCode(e.target.value)}
                    placeholder="ምሳሌ፡ SHAS-SEC-01, DIR-SHAS-01, TCH-BEFE-01, STU-KIYAR-01"
                    className="w-full pl-9 pr-3 py-2.5 text-xs uppercase font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    required
                  />
                </div>
                <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-800 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      <span>ፈጣን የመግቢያ ኮዶች (ጠቅ ሲያደርጉ ወዲያውኑ ይሞላል)፡</span>
                    </p>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Quick Auto-Fill
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'ዳይሬክተር (SHAS-SEC-01)', code: 'SHAS-SEC-01' },
                      { label: 'ቤተ-መጻሕፍት (STK-LIB-02)', code: 'STK-LIB-02' },
                      { label: 'መምህር (TCH-BEFE-01)', code: 'TCH-BEFE-01' },
                      { label: 'ተማሪ (STU-KIYAR-01)', code: 'STU-KIYAR-01' },
                      { label: 'ወላጅ (PAR-KIYAR-01)', code: 'PAR-KIYAR-01' },
                      { label: 'ቡልቡላ ት/ቤት (BUL-MID-02)', code: 'BUL-MID-02' }
                    ].map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setSchoolAccessCode(item.code);
                          setErrorMessage('');
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-300 hover:border-emerald-500 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer shadow-2xs hover:scale-102"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>ግባ (Login)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('school_reg');
                    setErrorMessage('');
                  }}
                  className="text-xs text-emerald-700 font-semibold hover:underline"
                >
                  ትምህርት ቤትዎ ገና አልተመዘገበም? እዚህ በራስዎ ይመዝገቡ →
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
