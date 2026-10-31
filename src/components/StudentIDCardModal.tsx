import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Printer,
  Download,
  X,
  Building2,
  ShieldCheck,
  QrCode,
  User,
  Phone,
  Calendar,
  Sparkles,
  Award,
  CheckCircle2,
  RotateCw,
  Moon,
  Clock,
  Briefcase
} from 'lucide-react';
import { Language, StudentRecord, School } from '../types';
import { translations } from '../data/translations';
import { SchoolLogo } from './SchoolLogo';

interface StudentIDCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  student: StudentRecord;
  schoolName?: string;
  school?: School;
}

export const StudentIDCardModal: React.FC<StudentIDCardModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  student,
  schoolName,
  school
}) => {
  const t = translations[currentLang];
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [cardSide, setCardSide] = useState<'both' | 'front' | 'back'>('both');

  const resolvedSchoolName =
    schoolName || student.schoolName || school?.name || 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት';

  useEffect(() => {
    if (!student) return;

    // Real verification payload encoded into the QR code
    const qrPayload = JSON.stringify({
      bureau: 'Shashemene City Administration Education Office',
      studentId: student.studentIdNumber,
      name: student.fullName,
      school: resolvedSchoolName,
      grade: `Grade ${student.grade} - ${student.section}`,
      accessCode: student.accessCode,
      parentContact: student.parentPhone,
      academicYear: '2016-2017 E.C. (2024-2025)',
      validUntil: 'July 2025',
      verificationUrl: `https://shasheducation.gov.et/verify?id=${encodeURIComponent(
        student.studentIdNumber
      )}&code=${encodeURIComponent(student.accessCode)}`
    });

    QRCode.toDataURL(
      qrPayload,
      {
        width: 320,
        margin: 1,
        color: {
          dark: '#064e3b', // Deep emerald green
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [student, resolvedSchoolName]);

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 my-6 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-800" />
              <h3 className="text-base font-bold text-slate-900">
                {t.id_card_title}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.id_card_subtitle} · PDF-Ready Identification Card
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.print_id_card}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Toggle (Both / Front / Back) */}
        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
          <span className="font-semibold text-slate-600 pl-2">
            የእይታ አማራጭ (Card View):
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCardSide('both')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                cardSide === 'both'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              ሁለቱም (Front & Back)
            </button>
            <button
              type="button"
              onClick={() => setCardSide('front')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                cardSide === 'front'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t.id_card_front}
            </button>
            <button
              type="button"
              onClick={() => setCardSide('back')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                cardSide === 'back'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t.id_card_back}
            </button>
          </div>
        </div>

        {/* Printable Card Container */}
        <div
          id="printable-id-card-wrapper"
          className="p-4 bg-slate-100/70 border border-dashed border-slate-300 rounded-2xl flex flex-wrap items-center justify-center gap-6"
        >
          {/* =================== FRONT CARD =================== */}
          {(cardSide === 'both' || cardSide === 'front') && (
            <div
              id="student-id-card-front"
              className="w-[330px] sm:w-[350px] bg-white rounded-2xl shadow-xl border-2 border-emerald-800 overflow-hidden relative flex flex-col justify-between text-slate-900 transition-transform duration-200"
              style={{ minHeight: '490px' }}
            >
              {/* Lanyard punch hole representation */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-slate-200 rounded-full border border-slate-300 z-20"></div>

              {/* Card Header */}
              {student.shift === 'night_shift' || student.section?.toUpperCase().startsWith('N') ? (
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white pt-6 pb-3 px-4 text-center relative border-b-2 border-amber-400">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                      <Moon className="w-3 h-3 text-amber-300" />
                      <span>የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ · የማታ ፕሮግራም</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-0.5">
                    <SchoolLogo
                      logoUrl={school?.logoUrl}
                      schoolName={resolvedSchoolName}
                      size={28}
                      shape="rounded"
                    />
                    <h4 className="text-xs sm:text-sm font-extrabold tracking-tight text-white leading-snug">
                      {resolvedSchoolName}
                    </h4>
                  </div>
                  <p className="text-[9px] text-amber-200 font-semibold uppercase tracking-wider mt-0.5">
                    🌙 የማታ ተማሪ ይፋዊ መታወቂያ · Night Extension Student ID
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white pt-6 pb-3 px-4 text-center relative border-b-2 border-amber-400">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">
                      የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-0.5">
                    <SchoolLogo
                      logoUrl={school?.logoUrl}
                      schoolName={resolvedSchoolName}
                      size={28}
                      shape="rounded"
                    />
                    <h4 className="text-xs sm:text-sm font-extrabold tracking-tight text-white leading-snug">
                      {resolvedSchoolName}
                    </h4>
                  </div>
                  <p className="text-[9px] text-amber-200 font-semibold uppercase tracking-wider mt-0.5">
                    የተማሪ ይፋዊ መታወቂያ ካርድ · Student ID Card
                  </p>
                </div>
              )}

              {/* Card Body */}
              <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                {/* Photo & QR / Core Info */}
                <div className="flex gap-3.5 items-center">
                  {/* Photo Box */}
                  <div className="w-24 h-28 rounded-xl bg-gradient-to-b from-slate-100 to-slate-200 border-2 border-emerald-700/60 shadow-xs flex flex-col items-center justify-center shrink-0 relative overflow-hidden">
                    <User className="w-12 h-12 text-slate-400 mb-1" />
                    <span className="text-[9px] font-bold text-emerald-900 bg-emerald-100/90 w-full text-center py-0.5 absolute bottom-0">
                      PHOTO
                    </span>
                  </div>

                  {/* Student Details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div>
                      <span className="text-[9px] text-slate-400 font-semibold block uppercase">
                        የተማሪ ስም / Full Name
                      </span>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
                        {student.fullName}
                      </h5>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div>
                        <span className="text-slate-400 block text-[9px]">መታወቂያ ቁጥር</span>
                        <span className="font-mono font-bold text-emerald-950">
                          {student.studentIdNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">ክፍል / Section</span>
                        <span className="font-bold text-slate-800">
                          {student.grade} - {student.section}
                          {student.shift === 'night_shift' && ' (ማታ)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">ፆታ (Gender)</span>
                        <span className="font-semibold text-slate-800">
                          {student.gender === 'M' ? 'ወንድ (Male)' : 'ሴት (Female)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">ደረጃ (Rank)</span>
                        <span className="font-bold text-emerald-800">
                          #{student.rank}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info Strip */}
                {student.shift === 'night_shift' || student.occupation ? (
                  <div className="bg-indigo-50/80 border border-indigo-200 p-2.5 rounded-xl grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-[9px] text-indigo-700 font-bold block">የቀን ስራ / ሞያ:</span>
                      <strong className="text-slate-900 block truncate">{student.occupation || 'የግል ስራ'}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-indigo-700 font-bold block">የማታ ሰዓት:</span>
                      <strong className="text-slate-900 font-mono">11:30 - 3:00 ማታ</strong>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50/70 border border-emerald-200 p-2.5 rounded-xl grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-[9px] text-slate-500 block">የወላጅ ስም / Parent:</span>
                      <strong className="text-slate-900 block truncate">{student.parentName}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block">ስልክ / Phone:</span>
                      <strong className="text-slate-900 font-mono">{student.parentPhone}</strong>
                    </div>
                  </div>
                )}

                {/* Bottom Bar: Access Code, Validity & Seal */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                  <div>
                    <span className="text-[9px] text-slate-400 block">የትምህርት ዘመን (A.Y)</span>
                    <strong className="text-slate-800 font-mono">2016-2017 ዓ.ም</strong>
                  </div>

                  <div className="text-center">
                    <span className="text-[9px] text-slate-400 block">የመግቢያ ኮድ</span>
                    <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-emerald-900 text-[10px]">
                      {student.accessCode}
                    </code>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 block">የሚያበቃበት</span>
                    <strong className="text-emerald-800 font-semibold">ሐምሌ 2017</strong>
                  </div>
                </div>
              </div>

              {/* Front Footer Color Band */}
              <div className={`py-1 px-3 text-center text-[9px] font-medium tracking-wider flex items-center justify-between ${
                student.shift === 'night_shift' ? 'bg-slate-950 text-indigo-200' : 'bg-emerald-800 text-emerald-100'
              }`}>
                <span>{student.shift === 'night_shift' ? '🌙 SHASHEMENE NIGHT SCHOOL' : 'SHASHEMENE EDUCATION'}</span>
                <span className="font-mono text-amber-300">VALID STUDENT ID</span>
              </div>
            </div>
          )}

          {/* =================== BACK CARD =================== */}
          {(cardSide === 'both' || cardSide === 'back') && (
            <div
              id="student-id-card-back"
              className="w-[330px] sm:w-[350px] bg-white rounded-2xl shadow-xl border-2 border-emerald-800 overflow-hidden relative flex flex-col justify-between text-slate-900 transition-transform duration-200"
              style={{ minHeight: '490px' }}
            >
              {/* Lanyard punch hole representation */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-slate-200 rounded-full border border-slate-300 z-20"></div>

              {/* Back Header */}
              <div className="bg-slate-900 text-white pt-6 pb-2.5 px-4 text-center border-b-2 border-amber-400">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200">
                    ትክክለኛነት ማረጋገጫ · SECURITY VERIFICATION
                  </span>
                </div>
                <p className="text-[9px] text-slate-400">
                  {resolvedSchoolName} · Shashemene, Oromia
                </p>
              </div>

              {/* Back Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between items-center text-center">
                {/* QR Code Container */}
                <div className="flex flex-col items-center space-y-1">
                  <div className="p-2 bg-white rounded-xl border-2 border-emerald-800 shadow-md">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Student QR Code"
                        className="w-36 h-36 object-contain"
                      />
                    ) : (
                      <div className="w-36 h-36 flex items-center justify-center bg-slate-100 text-slate-400">
                        <QrCode className="w-12 h-12 animate-pulse" />
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-bold text-emerald-900 tracking-wider font-mono">
                    {student.studentIdNumber}
                  </span>
                  <p className="text-[9px] text-slate-500 max-w-[240px]">
                    {t.id_card_qr_scan}
                  </p>
                </div>

                {/* Instructions Text */}
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[10px] text-slate-600 text-left leading-relaxed space-y-1">
                  <p className="font-semibold text-slate-800">ደንብ እና መመሪያ (Regulations):</p>
                  <p>{t.id_card_instructions}</p>
                  <p className="text-slate-500">
                    ለጥያቄዎች ወይም መረጃ፡ <strong className="text-slate-800">{school?.phone || '+251 46 110 2420'}</strong>
                  </p>
                </div>

                {/* Principal Signature & Stamp */}
                <div className="w-full pt-2 border-t border-slate-200 flex items-center justify-between text-xs px-2">
                  <div className="text-left">
                    <span className="text-[9px] text-slate-400 block">{t.id_card_emergency}</span>
                    <strong className="text-emerald-950 text-[10px] font-mono">
                      {student.parentPhone}
                    </strong>
                  </div>

                  <div className="text-right">
                    <div className="font-serif italic text-emerald-800 font-bold text-xs">
                      Gutema Wako
                    </div>
                    <span className="text-[9px] text-slate-400 block border-t border-slate-400/80 pt-0.5">
                      {t.id_card_principal_sign}
                    </span>
                  </div>
                </div>
              </div>

              {/* Back Footer Color Band */}
              <div className="bg-slate-900 py-1 px-3 text-center text-[9px] text-slate-400 font-medium tracking-wider flex items-center justify-between">
                <span>OFFICIAL PROPERTY</span>
                <span className="text-emerald-400 font-mono">2016-2017 E.C.</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls & Printing Note */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
          <p className="text-[11px] text-slate-500">
            💡 <strong>ማስታወሻ፡</strong> ይህ መታወቂያ ለፕሪንት ዝግጁ ሆኖ የተዘጋጀ ነው። &quot;መታወቂያውን አትም&quot; የሚለውን ቁልፍ ሲጫኑ በቀጥታ በA4 ወረቀት ወይም በፕላስቲክ ካርድ ፕሪንተር ማተም ወይም በPDF ማስቀመጥ ይችላሉ።
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              ዝጋ
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>{t.print_id_card}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
