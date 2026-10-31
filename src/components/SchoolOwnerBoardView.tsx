import React, { useState } from 'react';
import {
  Building2,
  UserCheck,
  Shield,
  KeyRound,
  Award,
  Users,
  GraduationCap,
  TrendingUp,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Plus,
  Edit,
  ExternalLink,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Lock,
  Megaphone
} from 'lucide-react';
import { School, DirectorAppointment, SchoolStakeholder, Language } from '../types';
import { StorageService, SchoolUserCode } from '../utils/storage';

interface SchoolOwnerBoardViewProps {
  school: School;
  currentLang: Language;
  onSchoolUpdate: (updatedSchool: School) => void;
  onNavigateToTab?: (tabName: string) => void;
}

export const SchoolOwnerBoardView: React.FC<SchoolOwnerBoardViewProps> = ({
  school,
  currentLang,
  onSchoolUpdate,
  onNavigateToTab
}) => {
  const [appointments, setAppointments] = useState<DirectorAppointment[]>(() =>
    StorageService.getDirectorAppointments(school.id)
  );

  const [showAppointModal, setShowAppointModal] = useState(false);
  const [principalName, setPrincipalName] = useState(school.principalName || '');
  const [qualification, setQualification] = useState('MEd in Educational Leadership (የትምህርት አመራር ማስተርስ)');
  const [phone, setPhone] = useState(school.phone || '+251 9');
  const [email, setEmail] = useState(school.email || '');
  const [assignedCode, setAssignedCode] = useState(school.accessCode || 'DIR-SHAS-01');
  const [copiedCode, setCopiedCode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Finance statistics
  const feePayments = StorageService.getFeePayments(school.id);
  const expenses = StorageService.getExpenses(school.id);
  const totalRevenue = feePayments
    .filter((f) => f.status === 'paid')
    .reduce((sum, f) => sum + f.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalRevenue - totalExpenses;

  // Stakeholders summary
  const stakeholders = StorageService.getStakeholders(school.id, school.name);

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!principalName.trim()) return;

    const newAppt: DirectorAppointment = {
      id: `apt-${Date.now()}`,
      schoolId: school.id,
      schoolName: school.name,
      principalName: principalName.trim(),
      qualification: qualification.trim(),
      phone: phone.trim(),
      email: email.trim(),
      appointedDate: new Date().toISOString().split('T')[0],
      appointedBy: 'ዶ/ር ተስፋዬ በቀለ (የት/ቤት የበላይ ጠባቂ ቦርድ ሰብሳቢ / ባለቤት)',
      accessCode: assignedCode.trim().toUpperCase(),
      status: 'active',
      dutiesAndPowers: [
        'የትምህርት ቤቱን አጠቃላይ አስተዳደራዊ እና አካዳሚክ ስራዎች በበላይነት መምራት',
        'መምህራን እና ድጋፍ ሰጪ ሰራተኞችን መመደብ፣ መቆጣጠር እና የሲስተም ኮድ መስጠት',
        'የትምህርት ውጤትና የተማሪዎች ሪፖርት ለትምህርት ቢሮ ማቅረብ',
        'የትምህርት ቤቱን በጀት በሒሳብ ሰራተኛ በኩል ማስተዳደር እና ወጪ ማጽደቅ',
        'ለማህበረሰቡ፣ ለመምህራንና ለወላጆች ማስታወቂያዎችን ማስተላለፍ'
      ]
    };

    StorageService.saveDirectorAppointment(newAppt);
    setAppointments(StorageService.getDirectorAppointments(school.id));

    // Update the school's principal name and access code
    const updatedSchool: School = {
      ...school,
      principalName: principalName.trim(),
      accessCode: assignedCode.trim().toUpperCase()
    };
    StorageService.updateSchool(updatedSchool);
    onSchoolUpdate(updatedSchool);

    // Also update or add school code in user codes table
    const existingCodes = StorageService.getSchoolCodes();
    const existingDirectorCode = existingCodes.find(
      (c) => c.schoolId === school.id && c.role === 'school_director'
    );
    if (existingDirectorCode) {
      existingDirectorCode.fullName = `${principalName.trim()} (ዳይሬክተር)`;
      existingDirectorCode.accessCode = assignedCode.trim().toUpperCase();
      StorageService.saveSchoolCodes(existingCodes);
    } else {
      StorageService.addSchoolCode({
        id: `sc-dir-${Date.now()}`,
        schoolId: school.id,
        schoolName: school.name,
        role: 'school_director',
        fullName: `${principalName.trim()} (ዳይሬክተር)`,
        accessCode: assignedCode.trim().toUpperCase(),
        assignedClassOrSubject: 'አጠቃላይ ትምህርት ቤት አስተዳደር',
        createdAt: new Date().toISOString().split('T')[0]
      });
    }

    setSuccessMessage(`አዲሱ ርዕሰ መምህር ${principalName} በተሳካ ሁኔታ ተሹመዋል! የመግቢያ ኮድ: ${assignedCode}`);
    setShowAppointModal(false);
    setTimeout(() => setSuccessMessage(''), 4500);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-900/80 border border-purple-400/40 rounded-full text-xs font-semibold text-purple-200">
              <Building2 className="w-3.5 h-3.5 text-purple-300" />
              <span>የትምህርት ቤት ባለቤት እና የበላይ ጠባቂ ቦርድ መድረክ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              የቦርድ አመራር እና የዳይሬክተር ቅጥር (Board & Governance Hub)
            </h2>
            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
              የትምህርት ቤቱን ዳይሬክተር የመሾም፣ የመግቢያ ኮድ የመስጠት፣ የትምህርት ቤቱን አጠቃላይ
              እንቅስቃሴና በጀት በሲስተም የመቆጣጠር እና የቦርድ ውሳኔዎችን የማስተላለፍ ስልጣን
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAppointModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 stroke-[2.5]" />
              <span>ዳይሬክተር ሹም / ኮድ ስጥ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-950 font-bold flex items-center gap-2.5 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* High-Level Institutional Governance KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            ጠቅላላ የተማሪዎች ቁጥር
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900 font-mono">
              {school.totalStudents.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500">
              ({school.maleStudents} ወ / {school.femaleStudents} ሴ)
            </span>
          </div>
          <span className="text-[10px] text-emerald-700 font-medium mt-1 block">
            የተማሪዎች ምዝገባ የተሟላ
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            የመምህራን እና ሰራተኞች ብዛት
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900 font-mono">
              {school.totalTeachers + stakeholders.length}
            </span>
            <span className="text-[10px] text-slate-500">
              ({school.totalTeachers} መምህራን + {stakeholders.length} ባለድርሻ)
            </span>
          </div>
          <span className="text-[10px] text-teal-700 font-medium mt-1 block">
            የተሟላ የት/ቤት መዋቅር
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            የትምህርት ቤት ወርሃዊ ገቢ
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-emerald-700 font-mono">
              {totalRevenue.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 font-bold">ብር</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">
            የተሰበሰበ የወር ክፍያ
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            የትምህርት ቢሮ ምዘና ደረጃ
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black text-purple-900 uppercase">
              {school.inspectionLevel.replace('_', ' ')}
            </span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-purple-100 text-purple-800">
              ደረጃ {school.inspectionLevel.slice(-1)}
            </span>
          </div>
          <span className="text-[10px] text-purple-700 font-medium mt-1 block">
            በሻሸመኔ ትምህርት ቢሮ እውቅና
          </span>
        </div>
      </div>

      {/* Active Appointed Director Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xl border border-teal-300">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                የተሾሙ ዋና ዳይሬክተር / ርዕሰ መምህር
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {school.principalName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">የመግቢያ ኮድ፡</span>
            <div className="flex items-center gap-1 bg-slate-900 text-amber-300 px-3 py-1.5 rounded-xl font-mono font-black text-xs border border-amber-400/40">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>{school.accessCode}</span>
              <button
                type="button"
                onClick={() => handleCopyCode(school.accessCode)}
                className="ml-1 text-slate-400 hover:text-white transition-colors"
                title="ኮድ ቅዳ"
              >
                {copiedCode ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowAppointModal(true)}
              className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="ዳይሬክተር ቀይር / አሻሽል"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Powers and Scope delegated by Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-teal-700" />
              <span>በቦርዱ ለዳይሬክተሩ የተሰጡ ዋና ዋና ስልጣኖች እና ኃላፊነቶች፡</span>
            </span>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>የትምህርት ቤቱን ሰራተኞች በሙሉ (መምህራን፣ ሬጅስትራር፣ ሒሳብ፣ ላብራቶሪ) በበላይነት መቆጣጠር</li>
              <li>የተማሪዎች ውጤት ሪፖርቶችን መቀበል እና ለትምህርት ቢሮ ማጽደቅ</li>
              <li>ለመምህራን፣ ለተማሪዎች እና ለወላጆች ማስታወቂያዎችን ማስተላለፍ</li>
              <li>የተጠቃሚ መለያ ኮዶችን ለሰራተኞች ማመንጨት እና ማስተዳደር</li>
              <li>የትምህርት ቤቱን በጀትና አስተዳደራዊ ወጪዎች በሒሳብ ሰራተኛ በኩል ማጽደቅ</li>
            </ul>
          </div>

          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200/80 space-y-2">
            <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-purple-700" />
              <span>የበላይ ጠባቂ ቦርድ / ባለቤት ቋሚ ስልጣን፡</span>
            </span>
            <ul className="text-xs text-purple-900 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>የትምህርት ቤቱን አጠቃላይ የስትራቴጂ ፖሊሲና አቅጣጫ መወሰን</li>
              <li>ዋና ርዕሰ መምህር የመቅጠር፣ የመገምገም እና የመተካት ስልጣን</li>
              <li>ዓመታዊ የበጀት እቅድ እና የትምህርት ጥራት ኦዲት ማጽደቅ</li>
              <li>ለትምህርት ቤቱ ማህበረሰብ የበላይ የቦርድ ውሳኔ ማስታወቂያዎችን መለጠፍ</li>
              <li>ከሻሸመኔ ከተማ አስተዳደርና ትምህርት ቢሮ ጋር ተቋማዊ ግንኙነቶችን ማጽናት</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal: Appoint / Hire Director */}
      {showAppointModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-purple-900 to-slate-950 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">የትምህርት ቤት ዳይሬክተር ቅጥር እና ኮድ መስጫ</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAppointModal(false)}
                className="text-purple-200 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAppointment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  የዳይሬክተር ሙሉ ስም *
                </label>
                <input
                  type="text"
                  required
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  placeholder="ምሳሌ፡ አቶ ጉተማ ዋቆ"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  የትምህርት ደረጃ እና ሙያዊ ብቃት (Qualification)
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="ምሳሌ፡ MA/MEd in Educational Leadership"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ስልክ ቁጥር
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ኢሜይል
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ለዳይሬክተሩ የሚሰጠው ሲስተም መግቢያ ኮድ (System Access Code) *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-purple-600 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={assignedCode}
                    onChange={(e) => setAssignedCode(e.target.value.toUpperCase())}
                    placeholder="DIR-SHAS-01"
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-mono font-bold uppercase border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-hidden bg-purple-50/50"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  ይህ ኮድ ዳይሬክተሩ ወደ ሲስተሙ በመግባት ሰራተኞችን፣ ተማሪዎችንና ሪፖርቶችን ለመቆጣጠር ይጠቀምበታል።
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAppointModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>ዳይሬክተሩን ሹም እና ኮድ አስረክብ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
