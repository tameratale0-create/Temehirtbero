import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Building2,
  School as SchoolIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Globe,
  RotateCcw,
  BookOpen,
  Zap,
  Award,
  Users,
  GraduationCap
} from 'lucide-react';
import { Language, AppUserSession, School, UserRole } from '../types';
import { translations } from '../data/translations';
import { StorageService } from '../utils/storage';
import { ShashemeneEducationBureauEmblem } from './ShashemeneEducationBureauEmblem';
import { PWAInstallButton } from './PWAInstallButton';

interface AccessCodeGateProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigateBureau: () => void;
  onNavigateSchoolRegister: () => void;
  onNavigateSchoolLogin: () => void;
  onLoginSession: (session: AppUserSession) => void;
  onReplaySplash: () => void;
}

export const AccessCodeGate: React.FC<AccessCodeGateProps> = ({
  currentLang,
  onLanguageChange,
  onNavigateBureau,
  onNavigateSchoolRegister,
  onNavigateSchoolLogin,
  onLoginSession,
  onReplaySplash
}) => {
  const t = translations[currentLang];
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [showCode, setShowCode] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const processCode = (rawCode: string) => {
    const code = rawCode.trim();
    setErrorMsg('');
    setSuccessMsg('');

    // Rule 1: 123456 -> Direct into Education Bureau Page
    // "123456 ሲያስገቡ ቀጥታ ወድ ትምህርት ቢሮ ገፅ ያስገባል"
    if (code === '123456') {
      setSuccessMsg('የትምህርት ቢሮ አስተዳዳሪ ተረጋግጧል! ወደ ቢሮ ገጽ እየገባ ነው...');
      setTimeout(() => {
        onNavigateBureau();
      }, 350);
      return;
    }

    // Rule 2: 2222 -> Direct into Schools Registration Form
    // "2222 ሲያስገቡ ወደ ትምህርት ቤቶች ምዝገባ ያስገባል"
    if (code === '2222') {
      setSuccessMsg('የትምህርት ቤቶች ምዝገባ ተመርጧል! የምዝገባ ፎርሙ እየተከፈተ ነው...');
      setTimeout(() => {
        onNavigateSchoolRegister();
      }, 350);
      return;
    }

    // Rule 3: 3333 -> Direct into Schools Login
    // "3333 ሲያስገቡ ወደ ትምህርት ቤቶች መግብያ ያስገባል"
    if (code === '3333') {
      setSuccessMsg('የትምህርት ቤቶች መግቢያ ተመርጧል! እየተከፈተ ነው...');
      setTimeout(() => {
        onNavigateSchoolLogin();
      }, 350);
      return;
    }

    // Also support any other registered database access code (staff, teacher, school, student)
    const upperCode = code.toUpperCase();

    // Check Bureau Staff
    const staffList = StorageService.getStaff();
    const matchedStaff = staffList.find(
      (s) => s.accessCode.trim().toUpperCase() === upperCode
    );
    if (matchedStaff) {
      setSuccessMsg(`የቢሮ ሰራተኛ: ${matchedStaff.fullName} ተረጋግጧል!`);
      setTimeout(() => {
        onLoginSession({
          role: 'bureau_staff',
          name: matchedStaff.fullName,
          staffDepartment: matchedStaff.department,
          identifier: matchedStaff.id,
          accessCode: matchedStaff.accessCode
        });
      }, 350);
      return;
    }

    // Check Schools (principals / school owners)
    const schoolsList = StorageService.getSchools();
    const matchedSchool = schoolsList.find(
      (s) => s.accessCode.trim().toUpperCase() === upperCode || s.code.toUpperCase() === upperCode
    );
    if (matchedSchool) {
      setSuccessMsg(`የትምህርት ቤት: ${matchedSchool.name} ተረጋግጧል!`);
      setTimeout(() => {
        onLoginSession({
          role: 'school_admin',
          name: `${matchedSchool.principalName} (${matchedSchool.name})`,
          schoolId: matchedSchool.id,
          schoolName: matchedSchool.name,
          identifier: matchedSchool.id,
          accessCode: matchedSchool.accessCode
        });
      }, 350);
      return;
    }

    // Check Students / Parents
    const studentsList = StorageService.getStudents();
    const matchedStudent = studentsList.find(
      (s) =>
        s.accessCode.trim().toUpperCase() === upperCode ||
        s.parentAccessCode?.trim().toUpperCase() === upperCode
    );
    if (matchedStudent) {
      const isParent = matchedStudent.parentAccessCode?.trim().toUpperCase() === upperCode;
      setSuccessMsg(
        isParent
          ? `የተማሪ ${matchedStudent.fullName} ወላጅ ተረጋግጧል!`
          : `ተማሪ ${matchedStudent.fullName} ተረጋግጧል!`
      );
      setTimeout(() => {
        onLoginSession({
          role: isParent ? 'parent' : 'student',
          name: isParent ? `የ${matchedStudent.fullName} ወላጅ` : matchedStudent.fullName,
          schoolId: matchedStudent.schoolId,
          identifier: matchedStudent.id,
          accessCode: upperCode
        });
      }, 350);
      return;
    }

    // Check Teachers
    const credsList = StorageService.getCredentials();
    const matchedTeacher = credsList.find(
      (c) => c.licenseNumber.trim().toUpperCase() === upperCode
    );
    if (matchedTeacher) {
      setSuccessMsg(`መምህር: ${matchedTeacher.teacherName} ተረጋግጧል!`);
      setTimeout(() => {
        onLoginSession({
          role: 'teacher',
          name: matchedTeacher.teacherName,
          schoolId: matchedTeacher.schoolId,
          schoolName: matchedTeacher.schoolName,
          identifier: matchedTeacher.id,
          accessCode: matchedTeacher.licenseNumber
        });
      }, 350);
      return;
    }

    // Check School Generated User Codes (Owner, Director, Teacher, Accountant, Registrar, Student, Parent)
    const schoolCodesList = StorageService.getSchoolCodes();
    const matchedSchoolCode = schoolCodesList.find(
      (c) => c.accessCode.trim().toUpperCase() === upperCode
    );
    if (matchedSchoolCode) {
      let resolvedRole: UserRole = 'school_admin';
      if (matchedSchoolCode.role === 'school_owner') resolvedRole = 'school_owner';
      else if (matchedSchoolCode.role === 'school_director') resolvedRole = 'school_director';
      else if (matchedSchoolCode.role === 'accountant') resolvedRole = 'accountant';
      else if (matchedSchoolCode.role === 'registrar') resolvedRole = 'registrar';
      else if (matchedSchoolCode.role === 'teacher') resolvedRole = 'teacher';
      else if (matchedSchoolCode.role === 'student') resolvedRole = 'student';
      else if (matchedSchoolCode.role === 'parent') resolvedRole = 'parent';

      const roleAmharicTitle =
        resolvedRole === 'school_owner'
          ? 'የት/ቤት ባለቤት (የቦርድ ሰብሳቢ)'
          : resolvedRole === 'school_director'
          ? 'ዋና ዳይሬክተር'
          : resolvedRole === 'accountant'
          ? 'የሒሳብ ሰራተኛ (Finance)'
          : resolvedRole === 'registrar'
          ? 'ሬጅስትራር (የተማሪዎች ምዝገባ)'
          : resolvedRole === 'teacher'
          ? 'መምህር'
          : resolvedRole === 'student'
          ? 'ተማሪ'
          : 'ወላጅ';

      setSuccessMsg(`${roleAmharicTitle}: ${matchedSchoolCode.fullName} ተረጋግጧል! ወደ ተፈቀደው የስራ ገፅ በመግባት ላይ...`);
      setTimeout(() => {
        onLoginSession({
          role: resolvedRole,
          name: matchedSchoolCode.fullName,
          schoolId: matchedSchoolCode.schoolId,
          schoolName: matchedSchoolCode.schoolName,
          staffDepartment: matchedSchoolCode.assignedClassOrSubject,
          identifier: matchedSchoolCode.id,
          accessCode: matchedSchoolCode.accessCode
        });
      }, 350);
      return;
    }

    // Check School Stakeholders (Board, Director, Accountant, Registrar, Librarian, Counselor, IT, etc.)
    const stakeholdersList = StorageService.getStakeholders();
    const matchedStakeholder = stakeholdersList.find(
      (s) =>
        (s.accessCode && s.accessCode.trim().toUpperCase() === upperCode) ||
        s.faydaNumber.trim().toUpperCase() === upperCode
    );
    if (matchedStakeholder) {
      let resolvedRole: UserRole = 'school_admin';
      const roleText = (matchedStakeholder.roleCustomTitle || matchedStakeholder.officeOrDepartment || '').toLowerCase();
      
      if (
        matchedStakeholder.role === 'principal' ||
        matchedStakeholder.role === 'vice_principal_academic' ||
        matchedStakeholder.role === 'vice_principal_admin'
      ) {
        resolvedRole = 'school_director';
      } else if (matchedStakeholder.role === 'school_owner_board') {
        resolvedRole = 'school_owner';
      } else if (
        matchedStakeholder.role === 'registrar_finance' &&
        (roleText.includes('ሒሳብ') || roleText.includes('ፋይናንስ') || roleText.includes('finance') || roleText.includes('accountant'))
      ) {
        resolvedRole = 'accountant';
      } else if (
        matchedStakeholder.role === 'registrar_finance' ||
        roleText.includes('ሬጅስትራር') ||
        roleText.includes('registrar')
      ) {
        resolvedRole = 'registrar';
      } else if (matchedStakeholder.role === 'teacher' || matchedStakeholder.role === 'department_head') {
        resolvedRole = 'teacher';
      } else if (matchedStakeholder.role === 'pta_chair') {
        resolvedRole = 'parent';
      }

      setSuccessMsg(`የ${matchedStakeholder.officeOrDepartment} ባለሙያ፡ ${matchedStakeholder.fullName} ተረጋግጧል!`);
      setTimeout(() => {
        onLoginSession({
          role: resolvedRole,
          name: `${matchedStakeholder.fullName} (${matchedStakeholder.roleCustomTitle || matchedStakeholder.officeOrDepartment})`,
          schoolId: matchedStakeholder.schoolId,
          schoolName: matchedStakeholder.schoolName,
          staffDepartment: matchedStakeholder.officeOrDepartment,
          identifier: matchedStakeholder.id,
          accessCode: matchedStakeholder.accessCode || upperCode
        });
      }, 350);
      return;
    }

    // Invalid Code Error
    setErrorMsg(
      currentLang === 'am'
        ? 'የተሳሳተ ኮድ! እባክዎ 123456 (የትምህርት ቢሮ)፣ 2222 (የት/ቤቶች ምዝገባ) ወይም 3333 (የት/ቤቶች መግቢያ) ያስገቡ።'
        : currentLang === 'om'
        ? 'Koodiin dogoggora! Maaloo 123456 (Biiroo), 2222 (Galmee Mana Barnootaa) ykn 3333 (Seensa Mana Barnootaa) galchaa.'
        : 'Invalid code! Please enter 123456 (Education Bureau), 2222 (School Registration), or 3333 (School Login).'
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredCode) {
      setErrorMsg(
        currentLang === 'am'
          ? 'እባክዎ የመግቢያ ኮድ ያስገቡ'
          : currentLang === 'om'
          ? 'Maaloo koodii galchaa'
          : 'Please enter access code'
      );
      return;
    }
    processCode(enteredCode);
  };

  const handleKeypadPress = (val: string) => {
    setErrorMsg('');
    setSuccessMsg('');
    const newCode = enteredCode + val;
    setEnteredCode(newCode);

    // Auto-trigger if matching exact master codes
    if (newCode === '123456' || newCode === '2222' || newCode === '3333') {
      processCode(newCode);
    }
  };

  const handleBackspace = () => {
    setEnteredCode((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setEnteredCode('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col justify-between p-4 sm:p-6 text-slate-100 select-none">
      {/* Top Header Bar */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-full bg-slate-900 border border-red-500/50 shadow-md">
            <ShashemeneEducationBureauEmblem size={44} showText={false} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
              {t.bureau_full_name}
            </h2>
            <p className="text-xs text-emerald-400 font-medium">
              {t.city_name} · ኦንላይን/ኦፍላይን ሲስተም
            </p>
          </div>
        </div>

        {/* Language Switcher & Replay Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReplaySplash}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900/60 rounded-xl border border-amber-500/30 transition-all cursor-pointer"
            title="Replay 10-second logo & colorful light animation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.replay_splash_btn}</span>
          </button>

          <div className="flex items-center bg-slate-900/90 border border-slate-700 p-1 rounded-xl">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            {(['am', 'om', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={`px-2 py-0.5 text-xs font-semibold rounded-lg transition-all ${
                  currentLang === lang
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'am' ? 'አማ' : lang === 'om' ? 'Oro' : 'Eng'}
              </button>
            ))}
          </div>

          {/* In-app Install Button for Phone / PC */}
          <PWAInstallButton currentLang={currentLang} variant="header" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-md w-full mx-auto my-6 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Shashemene Bureau Emblem Centered */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center">
            {/* Shashemene Bureau: Rotating Red, White, Black, Green */}
            <div className="relative flex items-center justify-center">
              <div
                className="absolute w-24 h-24 rounded-full opacity-85 blur-md animate-spin pointer-events-none"
                style={{
                  animationDuration: '4s',
                  background:
                    'conic-gradient(from 0deg, #dc2626, #ffffff, #09090b, #16a34a, #dc2626)'
                }}
              />
              <div
                className="absolute w-[84px] h-[84px] rounded-full p-[2.5px] animate-spin pointer-events-none shadow-[0_0_14px_rgba(220,38,38,0.4)]"
                style={{
                  animationDuration: '3.5s',
                  background:
                    'conic-gradient(from 0deg, #dc2626, #ffffff, #09090b, #16a34a, #dc2626)'
                }}
              >
                <div className="w-full h-full rounded-full bg-slate-950" />
              </div>
              <div className="relative z-10 p-1.5 rounded-full bg-slate-950 border border-amber-400/80 shadow-lg">
                <ShashemeneEducationBureauEmblem size={76} showText={false} />
              </div>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {t.code_gate_title}
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            {t.code_gate_sub}
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 text-center uppercase tracking-wider">
              {t.code_input_label}
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
                <KeyRound className="w-5 h-5" />
              </div>

              <input
                type={showCode ? 'text' : 'password'}
                value={enteredCode}
                onChange={(e) => {
                  setEnteredCode(e.target.value);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                placeholder="123456 / 2222 / 3333..."
                autoFocus
                className="w-full pl-11 pr-12 py-3.5 bg-slate-950/80 border-2 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-2xl text-center text-xl font-mono font-bold tracking-widest text-amber-300 placeholder:text-slate-600 outline-none transition-all"
              />

              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title={showCode ? 'Hide' : 'Show'}
              >
                {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {/* Virtual Keypad for Easy Touch / Quick Entry */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeypadPress(digit)}
                className="py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-lg font-bold font-mono text-white transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="py-2.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/50 border border-rose-700/40 text-xs font-bold text-rose-300 transition-all active:scale-95 cursor-pointer"
            >
              አጽዳ (C)
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-lg font-bold font-mono text-white transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-sm font-bold text-slate-300 transition-all active:scale-95 cursor-pointer"
            >
              ⌫ ደምስስ
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-500 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/30"
          >
            <span>{t.btn_verify_enter}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 3 Explicit Quick Access Cards */}
        {/* "123456 ሲያስገቡ ቀጥታ ወድ ትምህርት ቢሮ ገፅ ያስገባል 2222 ሲያስገቡ ወደ ትምህርት ቤቶች ምዝገባ ያስገባል 3333 ሲያስገቡ ወደ ትምህርት ቤቶች መግብያ ያስገባል" */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider mb-2">
            ፈጣን መግቢያ ምርጫዎች (Quick Shortcuts)
          </p>

          {/* Card 1: 123456 Bureau */}
          <button
            type="button"
            onClick={() => {
              setEnteredCode('123456');
              processCode('123456');
            }}
            className="w-full text-left p-3 rounded-2xl bg-slate-950/60 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/50 transition-all group cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-amber-300 text-sm bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">
                    123456
                  </span>
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {t.code_bureau_card}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t.code_bureau_desc}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Card 2: 2222 School Self Registration */}
          <button
            type="button"
            onClick={() => {
              setEnteredCode('2222');
              processCode('2222');
            }}
            className="w-full text-left p-3 rounded-2xl bg-slate-950/60 hover:bg-amber-950/50 border border-slate-800 hover:border-amber-500/50 transition-all group cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-900/60 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-amber-300 text-sm bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">
                    2222
                  </span>
                  <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    {t.code_school_reg_card}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t.code_school_reg_desc}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Card 3: 3333 School Login */}
          <button
            type="button"
            onClick={() => {
              setEnteredCode('3333');
              processCode('3333');
            }}
            className="w-full text-left p-3 rounded-2xl bg-slate-950/60 hover:bg-teal-950/50 border border-slate-800 hover:border-teal-500/50 transition-all group cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-900/60 border border-teal-500/40 flex items-center justify-center text-teal-300">
                <SchoolIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-amber-300 text-sm bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">
                    3333
                  </span>
                  <span className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                    {t.code_school_login_card}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t.code_school_login_desc}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-transform group-hover:translate-x-1" />
          </button>

          {/* =========================================================================
              ⚡ QUICK 1-CLICK DEMO LOGIN BUTTONS (ሲስተሙን ለመሞከር ፈጣን መግቢያ)
             ========================================================================= */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                <span>{t.quick_demo_login_title} (1-Click)</span>
              </span>
              <span className="text-[10px] text-slate-400">
                ያለ ኮድ በቀጥታ ግባ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {[
                {
                  role: 'bureau_admin' as const,
                  name: 'የሻሸመኔ ትምህርት ቢሮ አስተዳዳሪ (Bureau Admin)',
                  title: 'የትምህርት ቢሮ አስተዳዳሪ',
                  code: '123456',
                  icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
                  color: 'hover:bg-emerald-950/60 hover:border-emerald-500/60'
                },
                {
                  role: 'school_owner' as const,
                  name: 'ዶ/ር ተስፋዬ በቀለ (ባለቤት / ቦርድ ሰብሳቢ)',
                  title: 'የት/ቤት ባለቤት (የቦርድ ሰብሳቢ)',
                  schoolId: 'sch-1',
                  schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
                  code: 'OWN-SHAS-01',
                  icon: <Building2 className="w-3.5 h-3.5 text-amber-400" />,
                  color: 'hover:bg-amber-950/60 hover:border-amber-500/60'
                },
                {
                  role: 'school_director' as const,
                  name: 'አቶ ጉተማ ዋቆ (ዋና ዳይሬክተር)',
                  title: 'ዋና ዳይሬክተር / ርዕሰ መምህር',
                  schoolId: 'sch-1',
                  schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
                  code: 'DIR-SHAS-01',
                  icon: <SchoolIcon className="w-3.5 h-3.5 text-teal-400" />,
                  color: 'hover:bg-teal-950/60 hover:border-teal-500/60'
                },
                {
                  role: 'teacher' as const,
                  name: 'መ/ር በፈቃዱ ጥላሁን (ሂሳብ/ፊዚክስ)',
                  title: 'መምህር (የቤት ስራና ውጤት)',
                  schoolId: 'sch-1',
                  schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
                  code: 'TCH-BEFE-01',
                  icon: <Award className="w-3.5 h-3.5 text-emerald-400" />,
                  color: 'hover:bg-emerald-950/60 hover:border-emerald-500/60'
                },
                {
                  role: 'accountant' as const,
                  name: 'ወ/ሮ ሰላማዊት አበራ (ዋና ሒሳብ ሹም)',
                  title: 'የሒሳብ ሰራተኛ (Finance)',
                  schoolId: 'sch-1',
                  schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
                  code: 'ACC-SHAS-01',
                  icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />,
                  color: 'hover:bg-green-950/60 hover:border-green-500/60'
                },
                {
                  role: 'registrar' as const,
                  name: 'አቶ ዳንኤል ንጉሴ (ተማሪ መዝጋቢ)',
                  title: 'ሬጅስትራር (ተማሪ ቅበላ & መታወቂያ)',
                  schoolId: 'sch-1',
                  schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
                  code: 'REG-SHAS-01',
                  icon: <Users className="w-3.5 h-3.5 text-blue-400" />,
                  color: 'hover:bg-blue-950/60 hover:border-blue-500/60'
                },
                {
                  role: 'school_admin' as const,
                  name: 'ወ/ሮ ሙሉእመቤት ደረሰ (ቤተ-መጻሕፍት)',
                  title: 'የቤተ-መጻሕፍት ኃላፊ (Library)',
                  schoolId: 'sch-1',
                  schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
                  staffDepartment: 'library',
                  code: 'LIB-MULU-02',
                  icon: <BookOpen className="w-3.5 h-3.5 text-indigo-400" />,
                  color: 'hover:bg-indigo-950/60 hover:border-indigo-500/60'
                },
                {
                  role: 'student' as const,
                  name: 'ኪያር ከድር አሊ (ተማሪ)',
                  title: 'ተማሪ (10ኛ ክፍል)',
                  schoolId: 'sch-1',
                  schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
                  code: 'STU-KIYAR-01',
                  icon: <GraduationCap className="w-3.5 h-3.5 text-violet-400" />,
                  color: 'hover:bg-violet-950/60 hover:border-violet-500/60'
                },
                {
                  role: 'parent' as const,
                  name: 'አቶ ከድር አሊ (የተማሪ ወላጅ)',
                  title: 'የተማሪ ወላጅ (ክትትል & ክፍያ)',
                  schoolId: 'sch-1',
                  schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
                  code: 'PAR-KIYAR-01',
                  icon: <Users className="w-3.5 h-3.5 text-rose-400" />,
                  color: 'hover:bg-rose-950/60 hover:border-rose-500/60'
                }
              ].map((acc) => (
                <button
                  key={acc.code}
                  type="button"
                  onClick={() => {
                    setSuccessMsg(`${acc.title} ተመርጧል! በመግባት ላይ...`);
                    setTimeout(() => {
                      onLoginSession({
                        role: acc.role,
                        name: acc.name,
                        schoolId: acc.schoolId,
                        schoolName: acc.schoolName,
                        staffDepartment: acc.staffDepartment,
                        identifier: acc.code,
                        accessCode: acc.code
                      });
                    }, 250);
                  }}
                  className={`p-2 rounded-xl bg-slate-900/80 border border-slate-800 transition-all text-left flex items-center justify-between group cursor-pointer ${acc.color}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-slate-700 shrink-0">
                      {acc.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                        {acc.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {acc.name} · <span className="font-mono text-amber-300/80">{acc.code}</span>
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Direct Install PWA Card for Mobile Phone and PC */}
          <PWAInstallButton currentLang={currentLang} variant="card" className="mt-4" />
        </div>

        {/* Mobile replay button */}
        <div className="sm:hidden text-center pt-2">
          <button
            type="button"
            onClick={onReplaySplash}
            className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.replay_splash_btn}</span>
          </button>
        </div>
      </div>

      {/* Bottom Footer Credits */}
      <div className="max-w-5xl mx-auto w-full text-center text-xs text-slate-500 py-2 border-t border-slate-800">
        <span>© 2016-2017 ዓ.ም የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ</span>
        <span className="mx-2">·</span>
        <span>የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ የትምህርት ሚኒስቴር እውቅና የተሰጠው</span>
      </div>
    </div>
  );
};
