import React, { useState } from 'react';
import {
  X,
  Printer,
  Award,
  CheckCircle2,
  Building2,
  FileCheck,
  Calendar,
  Phone,
  Mail,
  Shield,
  QrCode,
  BookOpen,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Eye,
  CreditCard,
  UserCheck
} from 'lucide-react';
import { SchoolStakeholder, Language, School } from '../types';
import { SchoolLogo } from './SchoolLogo';

interface StakeholderCertificateModalProps {
  stakeholder: SchoolStakeholder | null;
  school: School;
  currentLang: Language;
  onClose: () => void;
}

export const StakeholderCertificateModal: React.FC<StakeholderCertificateModalProps> = ({
  stakeholder,
  school,
  currentLang,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'certificate' | 'credentials' | 'fayda'>('certificate');
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);

  if (!stakeholder) return null;

  const handlePrint = () => {
    window.print();
  };

  const roleLabels: Record<string, string> = {
    principal: 'ዋና ርዕሰ መምህር / ዳይሬክተር (Head Principal)',
    vice_principal_academic: 'ምክትል ርዕሰ መምህር - አካዳሚክ (Vice Principal Academic)',
    vice_principal_admin: 'ምክትል ርዕሰ መምህር - አስተዳደር (Vice Principal Admin)',
    head_librarian: 'የትምህርት ቤተ-መጻሕፍት ኃላፊ እና የመረጃ ባለሙያ (Chief School Librarian)',
    lab_technician: 'የሳይንስ እና ቴክኖሎጂ ላብራቶሪ ባለሙያ (Science Lab Specialist)',
    department_head: 'የትምህርት ክፍል ኃላፊ (Department Head)',
    teacher: 'ከፍተኛ መምህር (Teacher)',
    guidance_counselor: 'የስነ-ልቦና እና የተማሪዎች ምክር ባለሙያ (Guidance Counselor)',
    school_owner_board: 'የትምህርት ቤት ባለቤት / የቦርድ ሰብሳቢ (School Owner / Board Chair)',
    pta_chair: 'የወላጅ መምህራን ህብረት (PTA) ሰብሳቢ (PTA Chair)',
    registrar_finance: 'ሬጅስትራር እና ፋይናንስ ሹም (Registrar & Finance Officer)',
    student_council_leader: 'የተማሪዎች መማክርት ተወካይ (Student Council Leader)'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[96vh] flex flex-col border border-slate-200 overflow-hidden my-auto">
        {/* Modal Top Bar (Hidden during printing) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white leading-tight">
                የትምህርት ቤት ባለድርሻ አካል ይፋዊ የፕሮፋይል ምስክር ወረቀት
              </h3>
              <p className="text-[11px] text-slate-300">
                {stakeholder.fullName} · {stakeholder.officeOrDepartment}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ምስክር ወረቀቱን አትም (Print / PDF)</span>
              <span className="sm:hidden">አትም</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Hidden during print) */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 border-b border-slate-200 shrink-0 print:hidden text-xs font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('certificate')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'certificate'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>ይፋዊ ምስክር ወረቀት (Certificate)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'credentials'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>የተመረቀባቸው ማስረጃዎች ({stakeholder.credentials?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fayda')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'fayda'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>የፋይዳ ዲጂታል መታወቂያ ({stakeholder.faydaNumber})</span>
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50">
          {/* TAB 1: OFFICIAL PROFILE CERTIFICATE */}
          {activeTab === 'certificate' && (
            <div className="max-w-3xl mx-auto bg-white border-8 border-double border-emerald-900 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden text-slate-900 print:border-4 print:p-6 print:shadow-none print:m-0">
              {/* Decorative Corner Ornaments */}
              <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 border-amber-500 rounded-tl-xl pointer-events-none" />
              <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 border-amber-500 rounded-tr-xl pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 border-amber-500 rounded-bl-xl pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 border-amber-500 rounded-br-xl pointer-events-none" />

              {/* Watermark Logo in background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
                <SchoolLogo logoUrl={school.logoUrl} schoolName={school.name} size={380} />
              </div>

              {/* Certificate Header */}
              <div className="relative z-10 text-center border-b-2 border-emerald-800/40 pb-5 mb-6">
                <div className="flex items-center justify-between gap-4 mb-3">
                  {/* Left: School Logo */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                    <SchoolLogo
                      logoUrl={school.logoUrl}
                      schoolName={school.name}
                      size={76}
                      shape="rounded"
                      className="shadow-md ring-2 ring-emerald-800/30"
                    />
                  </div>

                  {/* Center: Official Title */}
                  <div className="flex-1">
                    <p className="text-[11px] sm:text-xs font-bold text-emerald-900 uppercase tracking-widest">
                      የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ የትምህርት ዘርፍ
                    </p>
                    <h1 className="text-base sm:text-2xl font-black text-slate-900 leading-tight">
                      {school.name}
                    </h1>
                    <p className="text-xs sm:text-sm font-semibold text-emerald-800">
                      የሻሸመኔ ከተማ አስተዳደር · {school.subcity}
                    </p>
                    <div className="inline-block mt-1 px-3 py-0.5 bg-amber-50 border border-amber-400 rounded-full">
                      <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider">
                        የባለድርሻ አካል ይፋዊ የሙያና የስራ ማረጋገጫ ምስክር ወረቀት
                      </span>
                    </div>
                  </div>

                  {/* Right: QR Code for Verification */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex flex-col items-center justify-center bg-slate-50 border border-slate-300 rounded-xl p-1 text-center">
                    <QrCode className="w-10 h-10 sm:w-12 sm:h-12 text-slate-800" />
                    <span className="text-[8px] font-bold text-slate-600 mt-0.5">VERIFIED</span>
                  </div>
                </div>

                {/* Certificate Number & Date Bar */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                  <span>
                    የሰነድ ቁጥር (Cert No):{' '}
                    <strong className="text-emerald-950 font-mono font-bold">
                      {stakeholder.certificateNumber || `SHAS-STK-${stakeholder.id.toUpperCase()}`}
                    </strong>
                  </span>
                  <span>
                    የተመዘገበበት ቀን:{' '}
                    <strong className="text-slate-800 font-medium">
                      {stakeholder.registeredDate}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Stakeholder Identity Card Section */}
              <div className="relative z-10 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 mb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Photo */}
                  <div className="relative shrink-0">
                    {stakeholder.photoUrl ? (
                      <img
                        src={stakeholder.photoUrl}
                        alt={stakeholder.fullName}
                        className="w-24 h-28 object-cover rounded-xl shadow-md border-2 border-emerald-800"
                      />
                    ) : (
                      <div className="w-24 h-28 rounded-xl bg-emerald-900 text-white flex flex-col items-center justify-center font-bold text-2xl border-2 border-emerald-700 shadow-md">
                        <span>{stakeholder.fullName.charAt(0)}</span>
                        <span className="text-[10px] tracking-normal font-normal opacity-80 mt-1">
                          {stakeholder.gender === 'F' ? 'ሴት' : 'ወንድ'}
                        </span>
                      </div>
                    )}

                    {stakeholder.faydaVerified && (
                      <div
                        className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1 rounded-full shadow-md"
                        title="የፋይዳ ብሔራዊ መታወቂያ የተረጋገጠ"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Info details */}
                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-800 text-white">
                        {stakeholder.roleCustomTitle || roleLabels[stakeholder.role] || stakeholder.role}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 border border-emerald-300">
                        {stakeholder.status === 'active' ? 'በስራ ላይ ያለ (Active)' : stakeholder.status}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                      {stakeholder.fullName}
                    </h2>

                    {/* Profile Office / Department */}
                    <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-200/90 text-xs font-bold text-emerald-950 flex items-center justify-center sm:justify-start gap-2">
                      <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>የፕሮፋይል ጽሕፈት ቤት: {stakeholder.officeOrDepartment}</span>
                    </div>

                    {/* National Fayda ID Display */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-700 pt-1">
                      <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300 font-mono font-bold text-amber-950">
                        <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                        <span>ፋይዳ ቁጥር: {stakeholder.faydaNumber}</span>
                        {stakeholder.faydaVerified && (
                          <span className="text-[10px] text-emerald-700 font-sans font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> የተረጋገጠ
                          </span>
                        )}
                      </div>

                      {stakeholder.professionalLicenseNumber && (
                        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                          <Shield className="w-3.5 h-3.5 text-slate-500" />
                          <span>የሙያ ፈቃድ: {stakeholder.professionalLicenseNumber}</span>
                        </div>
                      )}

                      <div className="text-[11px] text-slate-600">
                        <span>የስራ ልምድ: <strong>{stakeholder.experienceYears} ዓመታት</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graduation & Educational Credentials Table */}
              <div className="relative z-10 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-1.5 uppercase tracking-wide">
                    <GraduationCap className="w-4 h-4 text-emerald-700" />
                    <span>የተረጋገጡ የተመረቀባቸው ማስረጃዎች እና የትምህርት ደረጃዎች (Educational Credentials)</span>
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {stakeholder.credentials?.length || 0} የተመረቀ ማስረጃዎች
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-emerald-900 text-white font-bold">
                      <tr>
                        <th className="py-2.5 px-3">ተ.ቁ</th>
                        <th className="py-2.5 px-3">የትምህርት ደረጃ</th>
                        <th className="py-2.5 px-3">የትምህርት መስክ (Field)</th>
                        <th className="py-2.5 px-3">የተመረቀበት ተቋም / ዩኒቨርሲቲ</th>
                        <th className="py-2.5 px-3">የምረቃ ዓ.ም</th>
                        <th className="py-2.5 px-3">የሰነድ ቁጥር</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white font-medium">
                      {stakeholder.credentials && stakeholder.credentials.length > 0 ? (
                        stakeholder.credentials.map((cred, idx) => (
                          <tr key={cred.id || idx} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-slate-500">{idx + 1}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-emerald-100 text-emerald-900 border border-emerald-300">
                                {cred.level}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-800">
                              {cred.fieldOfStudy}
                            </td>
                            <td className="py-2.5 px-3 text-slate-700">{cred.institution}</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                              {cred.graduationYear}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                              {cred.credentialDocNumber}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-4 text-center text-slate-500 italic">
                            ምንም የተመዘገበ የትምህርት ማስረጃ የለም
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Certificate Attestation Text */}
              <div className="relative z-10 text-[11px] leading-relaxed text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-8 italic">
                <p>
                  ይህ ይፋዊ የፕሮፋይል ምስክር ወረቀት ከላይ ስማቸውና የፋይዳ ዲጂታል መታወቂያቸው ለተገለጸው ባለድርሻ አካል፣ በ
                  <strong>{school.name}</strong> ውስጥ በይፋ ተመዝግበው የተመረቁባቸውን ማስረጃዎች እና የሙያ ፈቃዳቸውን በትምህርት ቢሮ
                  ስርዓት በማረጋገጥ የተሰጠ ህጋዊ ምስክር ወረቀት መሆኑን እናረጋግጣለን።
                </p>
              </div>

              {/* Official Signatures & Seals */}
              <div className="relative z-10 grid grid-cols-3 gap-4 pt-4 border-t-2 border-slate-300 text-center text-xs">
                {/* 1. School Principal / Director */}
                <div className="space-y-1">
                  <div className="h-12 flex items-end justify-center">
                    <span className="font-serif italic text-emerald-950 font-bold border-b border-dashed border-slate-400 pb-1 px-4">
                      {school.principalName || 'አቶ ጉተማ ዋቆ'}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">የርዕሰ መምህር ፊርማ</p>
                  <p className="text-[10px] text-slate-500">የትምህርት ቤቱ ዋና ዳይሬክተር</p>
                </div>

                {/* 2. Official Seal Stamp */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-800/80 flex flex-col items-center justify-center text-[9px] font-bold text-emerald-900 p-1 text-center bg-emerald-50">
                    <span>ይፋዊ ማህተም</span>
                    <span className="text-[8px] text-amber-700 font-extrabold uppercase">OFFICIAL SEAL</span>
                  </div>
                </div>

                {/* 3. Education Bureau Officer */}
                <div className="space-y-1">
                  <div className="h-12 flex items-end justify-center">
                    <span className="font-serif italic text-emerald-950 font-bold border-b border-dashed border-slate-400 pb-1 px-4">
                      ሻሸመኔ ትምህርት ቢሮ
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">የትምህርት ቢሮ ማረጋገጫ</p>
                  <p className="text-[10px] text-slate-500">የሰው ኃይል እና ስታንዳርድ መምሪያ</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ATTACHED GRADUATION CREDENTIAL DOCUMENTS GALLERY */}
          {activeTab === 'credentials' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-700" />
                    <span>የተመረቀባቸው ማስረጃዎች ዝርዝር ሰነዶች</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    ባለድርሻ አካሉ ያቀረቧቸው የዲግሪ፣ የማስተርስ፣ የዲፕሎማ እና የሙያ ፈቃድ ማስረጃዎች
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl border border-emerald-300 w-fit">
                  {stakeholder.credentials?.length || 0} ሰነዶች ተያይዘዋል
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stakeholder.credentials && stakeholder.credentials.length > 0 ? (
                  stakeholder.credentials.map((cred, idx) => (
                    <div
                      key={cred.id || idx}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500 transition-colors flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-emerald-800 text-white">
                            {cred.level}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-500">
                            ዓ.ም: {cred.graduationYear}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {cred.fieldOfStudy}
                        </h4>

                        <div className="text-xs text-slate-600 space-y-0.5">
                          <p className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{cred.institution}</span>
                          </p>
                          <p className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                            <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                            <span>ቁጥር: {cred.credentialDocNumber}</span>
                          </p>
                        </div>
                      </div>

                      {/* File attachment preview or placeholder */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        {cred.documentFileUrl ? (
                          <div className="space-y-2">
                            <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-32 flex items-center justify-center">
                              <img
                                src={cred.documentFileUrl}
                                alt={cred.fieldOfStudy}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => setPreviewDocUrl(cred.documentFileUrl || null)}
                                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                              >
                                <Eye className="w-4 h-4" />
                                <span>ትልቅ አድርገህ እይ</span>
                              </button>
                            </div>
                            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> ይፋዊ ሰነድ ተያይዟል (Attached)
                            </span>
                          </div>
                        ) : (
                          <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                            <FileCheck className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                            <p className="font-semibold text-slate-700">ዲጂታል ፋይል መረጃ</p>
                            <p className="text-[10px] text-slate-500">
                              መለያ: {cred.credentialDocNumber}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500">
                    <GraduationCap className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                    <p className="font-bold">ምንም የተመረቀ ማስረጃ አልተያያዘም</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: FAYDA DIGITAL ID CARD VIEW */}
          {activeTab === 'fayda' && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border-2 border-amber-400/40">
                {/* Background decorative watermark */}
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                {/* Fayda Top Header */}
                <div className="flex items-center justify-between border-b border-amber-400/40 pb-3 mb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
                      የኢትዮጵያ ብሔራዊ ዲጂታል መታወቂያ ስርዓት
                    </p>
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                      FAYDA NATIONAL DIGITAL ID
                    </h3>
                  </div>
                  <div className="px-2.5 py-1 bg-white/20 rounded-full border border-white/30 text-[10px] font-bold text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>VERIFIED</span>
                  </div>
                </div>

                {/* Fayda Card Body */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Photo */}
                  <div className="w-20 h-24 rounded-xl bg-slate-900 border-2 border-white/60 overflow-hidden shrink-0 flex items-center justify-center shadow-md">
                    {stakeholder.photoUrl ? (
                      <img
                        src={stakeholder.photoUrl}
                        alt={stakeholder.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-black text-white">
                        {stakeholder.fullName.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* ID Details */}
                  <div className="flex-1 space-y-1">
                    <p className="text-[10px] text-amber-200 font-semibold uppercase">ሙሉ ስም (Full Name)</p>
                    <h4 className="text-base font-black text-white leading-tight">
                      {stakeholder.fullName}
                    </h4>

                    <p className="text-[10px] text-amber-200 font-semibold uppercase mt-1">
                      የስራ ሚና እና ጽ/ቤት (Role & Office)
                    </p>
                    <p className="text-xs font-bold text-amber-100">
                      {stakeholder.officeOrDepartment}
                    </p>
                    <p className="text-[11px] text-amber-200/90 font-medium">
                      {school.name}
                    </p>
                  </div>
                </div>

                {/* Fayda Number Bar */}
                <div className="bg-black/40 rounded-2xl p-3 border border-amber-300/30 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-amber-200">
                      የፋይዳ ዲጂታል መለያ ቁጥር (FIN / FAN)
                    </span>
                    <p className="font-mono text-base sm:text-lg font-black tracking-wider text-amber-300">
                      {stakeholder.faydaNumber}
                    </p>
                  </div>
                  <QrCode className="w-10 h-10 text-white shrink-0" />
                </div>
              </div>

              {/* Uploaded Fayda Scan Document if available */}
              {stakeholder.faydaDocUrl && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <span>የተያያዘ የፋይዳ መታወቂያ ካርድ ሰነድ</span>
                  </h4>
                  <div className="rounded-xl overflow-hidden border border-slate-200 max-h-72">
                    <img
                      src={stakeholder.faydaDocUrl}
                      alt="Fayda Document"
                      className="w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer (Hidden during print) */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0 print:hidden">
          <span className="text-xs text-slate-500">
            {school.name} · {stakeholder.officeOrDepartment}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>ምስክር ወረቀቱን አትም (Print)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              ዝጋ
            </button>
          </div>
        </div>
      </div>

      {/* Image Preview Overlay Modal */}
      {previewDocUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreviewDocUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              type="button"
              onClick={() => setPreviewDocUrl(null)}
              className="absolute top-2 right-2 p-2 bg-black/70 text-white rounded-full hover:bg-black"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewDocUrl}
              alt="Enlarged Document"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
