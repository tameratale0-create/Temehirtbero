import React, { useState, useMemo, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Upload,
  Receipt,
  Printer,
  Copy,
  Check,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Eye,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Send,
  X,
  HelpCircle,
  Download,
  Info
} from 'lucide-react';
import {
  StudentRecord,
  School,
  FeePaymentRecord,
  SchoolBankAccount,
  Language,
  AppUserSession
} from '../types';
import { StorageService } from '../utils/storage';
import { SchoolLogo } from './SchoolLogo';

interface StudentAnnualFeeDeskProps {
  student: StudentRecord;
  school?: School;
  currentLang: Language;
  currentUser?: AppUserSession | null;
  onPaymentSubmitted?: (payment: FeePaymentRecord) => void;
}

// 10 Ethiopian Academic Months
export interface EthiopianAcademicMonth {
  key: string;
  labelAm: string;
  labelOm: string;
  labelEn: string;
  order: number;
  monthCode: string;
}

export const ETHIOPIAN_ACADEMIC_MONTHS: EthiopianAcademicMonth[] = [
  { key: 'መስከረም', labelAm: 'መስከረም (Meskerem)', labelOm: 'Fulbaana (Meskerem)', labelEn: 'September - October', order: 1, monthCode: '01' },
  { key: 'ጥቅምት', labelAm: 'ጥቅምት (Tikimt)', labelOm: 'Onkololeessa (Tikimt)', labelEn: 'October - November', order: 2, monthCode: '02' },
  { key: 'ኅዳር', labelAm: 'ኅዳር (Hidar)', labelOm: 'Sadaasa (Hidar)', labelEn: 'November - December', order: 3, monthCode: '03' },
  { key: 'ታኅሣሥ', labelAm: 'ታኅሣሥ (Tahsas)', labelOm: 'Muddee (Tahsas)', labelEn: 'December - January', order: 4, monthCode: '04' },
  { key: 'ጥር', labelAm: 'ጥር (Tir)', labelOm: 'Amajjii (Tir)', labelEn: 'January - February', order: 5, monthCode: '05' },
  { key: 'የካቲት', labelAm: 'የካቲት (Yekatit)', labelOm: 'Guraandhala (Yekatit)', labelEn: 'February - March', order: 6, monthCode: '06' },
  { key: 'መጋቢት', labelAm: 'መጋቢት (Megabit)', labelOm: 'Bitooteessa (Megabit)', labelEn: 'March - April', order: 7, monthCode: '07' },
  { key: 'ሚያዝያ', labelAm: 'ሚያዝያ (Miyazya)', labelOm: 'Ebla (Miyazya)', labelEn: 'April - May', order: 8, monthCode: '08' },
  { key: 'ግንቦት', labelAm: 'ግንቦት (Ginbot)', labelOm: 'Caamsaa (Ginbot)', labelEn: 'May - June', order: 9, monthCode: '09' },
  { key: 'ሰኔ', labelAm: 'ሰኔ (Sene)', labelOm: 'Waxabajjii (Sene)', labelEn: 'June - July', order: 10, monthCode: '10' }
];

// Current active Ethiopian academic month index (3 = ኅዳር / November, months 1 and 2 and 3 are entered/due)
export const CURRENT_ACTIVE_MONTH_ORDER = 3; // ኅዳር 2017

export const StudentAnnualFeeDesk: React.FC<StudentAnnualFeeDeskProps> = ({
  student,
  school,
  currentLang,
  currentUser,
  onPaymentSubmitted
}) => {
  const [feePayments, setFeePayments] = useState<FeePaymentRecord[]>(() =>
    StorageService.getFeePayments(student.schoolId, student.id)
  );
  const [bankAccounts, setBankAccounts] = useState<SchoolBankAccount[]>(() =>
    StorageService.getSchoolBankAccounts(student.schoolId).filter((a) => a.isActive)
  );

  // Modal states
  const [showAttachReceiptModal, setShowAttachReceiptModal] = useState(false);
  const [selectedMonthForPayment, setSelectedMonthForPayment] = useState<string>('ኅዳር 2017');
  const [targetPaymentRecord, setTargetPaymentRecord] = useState<FeePaymentRecord | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<FeePaymentRecord | null>(null);
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [receiptFormError, setReceiptFormError] = useState<string | null>(null);

  // Form states for receipt attachment
  const [paymentAmount, setPaymentAmount] = useState<number>(850);
  const [selectedBankName, setSelectedBankName] = useState<string>('የኢትዮጵያ ንግድ ባንክ (CBE)');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [receiptImagePreview, setReceiptImagePreview] = useState<string | null>(null);
  const [receiptImageName, setReceiptImageName] = useState<string>('');
  const [payerName, setPayerName] = useState<string>(student.parentName || student.fullName);
  const [payerPhone, setPayerPhone] = useState<string>(student.parentPhone || '+251 91 100 0000');
  const [submissionNotes, setSubmissionNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Listen to live storage updates
  useEffect(() => {
    const handleFeeUpdates = () => {
      setFeePayments(StorageService.getFeePayments(student.schoolId, student.id));
    };
    const handleBankUpdates = () => {
      setBankAccounts(
        StorageService.getSchoolBankAccounts(student.schoolId).filter((a) => a.isActive)
      );
    };

    window.addEventListener('fee_payments_updated', handleFeeUpdates);
    window.addEventListener('school_bank_accounts_updated', handleBankUpdates);
    window.addEventListener('storage', handleFeeUpdates);

    return () => {
      window.removeEventListener('fee_payments_updated', handleFeeUpdates);
      window.removeEventListener('school_bank_accounts_updated', handleBankUpdates);
      window.removeEventListener('storage', handleFeeUpdates);
    };
  }, [student.schoolId, student.id]);

  // Match each Ethiopian month to payment record
  const annualSchedule = useMemo(() => {
    return ETHIOPIAN_ACADEMIC_MONTHS.map((m) => {
      // Find matching payment record for this month
      const record = feePayments.find((f) => {
        const norm = f.month.toLowerCase();
        return norm.includes(m.key.toLowerCase());
      });

      // Status determination
      let status: 'paid' | 'pending' | 'overdue' | 'upcoming' | 'rejected' = 'upcoming';
      if (record) {
        if (record.status === 'paid') status = 'paid';
        else if (record.status === 'pending') status = 'pending';
        else if (record.status === 'rejected') status = 'rejected';
        else if (record.status === 'overdue') status = 'overdue';
      } else {
        // If no payment record exists:
        // If month order <= current active month order, it has entered and is UNPAID (RED!)
        if (m.order <= CURRENT_ACTIVE_MONTH_ORDER) {
          status = 'overdue';
        } else {
          status = 'upcoming';
        }
      }

      return {
        month: m,
        fullMonthName: `${m.key} 2017`,
        status,
        record
      };
    });
  }, [feePayments]);

  // Summary counts
  const paidMonthsCount = annualSchedule.filter((s) => s.status === 'paid').length;
  const overdueMonthsCount = annualSchedule.filter((s) => s.status === 'overdue' || s.status === 'rejected').length;
  const pendingMonthsCount = annualSchedule.filter((s) => s.status === 'pending').length;
  const totalPaidAmount = feePayments
    .filter((f) => f.status === 'paid')
    .reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalOutstandingAmount = overdueMonthsCount * 850;

  // Handle Copy Bank Account
  const handleCopyAccount = (accNum: string, id: string) => {
    navigator.clipboard.writeText(accNum);
    setCopiedBankId(id);
    setTimeout(() => setCopiedBankId(null), 2500);
  };

  // Open modal with pre-selected month
  const handleOpenAttachModal = (fullMonthName: string, existingRecord?: FeePaymentRecord) => {
    setSelectedMonthForPayment(fullMonthName);
    setTargetPaymentRecord(existingRecord || null);
    if (existingRecord) {
      setPaymentAmount(existingRecord.amount || 850);
      setSelectedBankName(existingRecord.bankName || 'የኢትዮጵያ ንግድ ባንክ (CBE)');
      setTransactionRef(existingRecord.transactionRef || '');
      setReceiptImagePreview(existingRecord.receiptImageUrl || null);
    } else {
      setPaymentAmount(850);
      setTransactionRef('');
      setReceiptImagePreview(null);
      setReceiptImageName('');
    }
    setShowAttachReceiptModal(true);
  };

  // Handle Receipt File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptImageName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit Receipt to Cashier
  const handleSubmitReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    setReceiptFormError(null);
    if (!receiptImagePreview && !transactionRef.trim()) {
      setReceiptFormError(
        currentLang === 'om'
          ? 'Maaloo suuraa nagahee kaffaltii qabsiisaa yookaan lakkoofsa Transaction Ref galchaa!'
          : currentLang === 'en'
          ? 'Please attach a receipt photo or enter a Transaction Reference number!'
          : 'እባክዎ የከፈሉበትን ደረሰኝ ፎቶ ያያይዙ ወይም የባንክ ግብይት ቁጥር (Transaction Ref) ያስገቡ!'
      );
      return;
    }

    setIsSubmitting(true);

    const submissionDate = new Date().toISOString();
    const newPaymentRecord: FeePaymentRecord = {
      id: targetPaymentRecord?.id || `fee-receipt-${Date.now()}`,
      schoolId: student.schoolId,
      studentId: student.id,
      studentName: student.fullName,
      grade: student.grade,
      section: student.section,
      parentName: student.parentName,
      month: selectedMonthForPayment,
      amount: Number(paymentAmount),
      paymentDate: submissionDate.split('T')[0],
      paymentMethod: selectedBankName.includes('ቴሌብር') || selectedBankName.includes('Telebirr')
        ? 'telebirr'
        : selectedBankName.includes('ንግድ ባንክ') || selectedBankName.includes('CBE')
        ? 'cbe_birr'
        : 'bank_transfer',
      receiptNumber:
        targetPaymentRecord?.receiptNumber ||
        (currentLang === 'om'
          ? 'MIRKANEESSARRA (PENDING)'
          : currentLang === 'en'
          ? 'PENDING VERIFICATION'
          : 'በማረጋገጥ ላይ (PENDING)'),
      status: 'pending',
      collectedBy: currentLang === 'om' ? 'Mirkaneessa qabaataa maallaqaa irratti' : currentLang === 'en' ? 'Pending Cashier Verification' : 'በገንዘብ ያዥ ማረጋገጫ ላይ',
      receiptImageUrl: receiptImagePreview || undefined,
      transactionRef: transactionRef.trim() || undefined,
      bankName: selectedBankName,
      submittedByRole: (currentUser?.role === 'parent' ? 'parent' : 'student') as 'student' | 'parent',
      submittedByName: payerName.trim() || student.fullName,
      submittedAt: submissionDate,
      notes: submissionNotes.trim() ? `${submissionNotes.trim()} | Tel: ${payerPhone}` : `Tel: ${payerPhone}`
    };

    StorageService.submitFeePaymentReceipt(newPaymentRecord);
    setFeePayments(StorageService.getFeePayments(student.schoolId, student.id));

    if (onPaymentSubmitted) {
      onPaymentSubmitted(newPaymentRecord);
    }

    setIsSubmitting(false);
    setShowAttachReceiptModal(false);
    setSuccessToast(
      currentLang === 'om'
        ? `Nagaheen kaffaltii ${selectedMonthForPayment} milkaa'inaan qabaataa maallaqaa mana barumsaatiif ergameera! Yeroo mirkanaa'u gabateen magariisa ta'a.`
        : currentLang === 'en'
        ? `Receipt for ${selectedMonthForPayment} sent to the school cashier! The schedule will turn green once verified.`
        : `የ${selectedMonthForPayment} ክፍያ ደረሰኝ በተሳካ ሁኔታ ለትምህርት ቤቱ ገንዘብ ያዥ ተልኳል! ገንዘብ ያዡ ሲያረጋግጥ ሰንጠረዡ አረንጓዴ ይሆናል።`
    );
    setTimeout(() => setSuccessToast(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Success Toast */}
      {successToast && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-700/60 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <p className="font-bold text-sm">
                {currentLang === 'om'
                  ? 'Nagaheen milkaa\'inaan ergameera!'
                  : currentLang === 'en'
                  ? 'Receipt submitted successfully!'
                  : 'ደረሰኙ በተሳካ ሁኔታ ተልኳል!'}
              </p>
              <p className="text-xs text-emerald-100">{successToast}</p>
            </div>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="p-1 hover:bg-emerald-700 rounded-lg text-emerald-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Hero Financial Status Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold">
              <CreditCard className="w-3.5 h-3.5" />
              {currentLang === 'om'
                ? 'Wiirtuu Kaffaltii Waggaa Barataa fi Maatii'
                : currentLang === 'en'
                ? 'Student & Parent Annual Tuition Fee Center'
                : 'የተማሪና የወላጅ ዓመታዊ የክፍያ ማዕከል (Annual Tuition Fee Schedule)'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentLang === 'om'
                ? 'Gabatee Hordoffii Kaffaltii Ji\'aa Bara 2017'
                : currentLang === 'en'
                ? '2017 E.C. Monthly Tuition Fee Tracking Schedule'
                : 'የ2017 ዓ.ም የተማሪ የወር ክፍያ መከታተያ ሰንጠረዥ'}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {currentLang === 'om' ? 'Barataa:' : currentLang === 'en' ? 'Student:' : 'ተማሪ፡'}{' '}
              <span className="font-bold text-white">{student.fullName}</span> |{' '}
              {currentLang === 'om' ? 'Kutaa:' : currentLang === 'en' ? 'Grade:' : 'ክፍል፡'}{' '}
              <span className="font-bold text-white">{student.grade}{student.section}</span> |{' '}
              {currentLang === 'om' ? 'Maatii:' : currentLang === 'en' ? 'Parent:' : 'ወላጅ፡'}{' '}
              <span className="font-bold text-white">{student.parentName}</span>
            </p>
          </div>

          {/* Quick Action Button to Attach Receipt */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => handleOpenAttachModal('ኅዳር 2017')}
              className="px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2.5 transition active:scale-95 text-sm cursor-pointer"
            >
              <Upload className="w-5 h-5" />
              <span>
                {currentLang === 'om'
                  ? 'Nagahee Kaffaltii Qabsiisi (Attach Receipt)'
                  : currentLang === 'en'
                  ? 'Attach Payment Receipt'
                  : 'የከፈሉበትን ደረሰኝ ያያይዙ (Attach Receipt)'}
              </span>
            </button>
          </div>
        </div>

        {/* 3 Metric Summary Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/60 backdrop-blur rounded-2xl p-4 border border-slate-700/50">
            <p className="text-xs text-slate-400 font-medium">
              {currentLang === 'om'
                ? 'Ji\'oota Kaffalaman (Confirmed Paid)'
                : currentLang === 'en'
                ? 'Confirmed Paid Months'
                : 'የተከፈለባቸው ወራት (Confirmed Paid)'}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-400">{paidMonthsCount}</span>
              <span className="text-xs text-slate-400">
                / 10 {currentLang === 'om' ? 'Ji\'a' : currentLang === 'en' ? 'Months' : 'ወራት'}
              </span>
            </div>
            <span className="inline-block mt-2 text-[11px] font-semibold text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              {currentLang === 'om' ? 'Ida\'ama:' : currentLang === 'en' ? 'Total:' : 'ድምር፡'}{' '}
              {totalPaidAmount.toLocaleString()} {currentLang === 'om' ? 'ETB' : 'ብር'}
            </span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur rounded-2xl p-4 border border-slate-700/50">
            <p className="text-xs text-slate-400 font-medium">
              {currentLang === 'om'
                ? 'Kan Hin Kaffalamne (Overdue / Unpaid)'
                : currentLang === 'en'
                ? 'Overdue / Unpaid Months'
                : 'ወሩ ገብቶ ያልተከፈለ (Overdue / Unpaid)'}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-rose-400">{overdueMonthsCount}</span>
              <span className="text-xs text-slate-400">
                {currentLang === 'om' ? 'Ji\'a Kuufame' : currentLang === 'en' ? 'Overdue' : 'ወር ውዝፍ'}
              </span>
            </div>
            <span className="inline-block mt-2 text-[11px] font-semibold text-rose-400/90 bg-rose-500/10 px-2 py-0.5 rounded-md">
              {currentLang === 'om' ? 'Kan Hafe:' : currentLang === 'en' ? 'Unpaid:' : 'ያልተከፈለ፡'}{' '}
              {totalOutstandingAmount.toLocaleString()} {currentLang === 'om' ? 'ETB' : 'ብር'}
            </span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur rounded-2xl p-4 border border-slate-700/50">
            <p className="text-xs text-slate-400 font-medium">
              {currentLang === 'om'
                ? 'Nagahee Mirkaneessarra Jiru (Pending)'
                : currentLang === 'en'
                ? 'Pending Verification'
                : 'በማረጋገጥ ላይ ያለ ደረሰኝ (Pending)'}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-400">{pendingMonthsCount}</span>
              <span className="text-xs text-slate-400">
                {currentLang === 'om' ? 'Nagahee' : currentLang === 'en' ? 'Receipt' : 'ደረሰኝ'}
              </span>
            </div>
            <span className="inline-block mt-2 text-[11px] font-semibold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-md">
              {currentLang === 'om'
                ? 'Gamaaggama Qabaataa Maallaqaarra'
                : currentLang === 'en'
                ? 'Under Cashier Review'
                : 'በገንዘብ ያዥ ግምገማ ላይ'}
            </span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur rounded-2xl p-4 border border-slate-700/50">
            <p className="text-xs text-slate-400 font-medium">
              {currentLang === 'om'
                ? 'Kaffaltii Idilee Ji\'aa (Monthly Rate)'
                : currentLang === 'en'
                ? 'Standard Monthly Rate'
                : 'መደበኛ የወር ክፍያ (Monthly Rate)'}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">850</span>
              <span className="text-xs text-slate-400">
                {currentLang === 'om' ? 'ETB / Ji\'a' : currentLang === 'en' ? 'ETB / Month' : 'ብር / ወር'}
              </span>
            </div>
            <span className="inline-block mt-2 text-[11px] font-semibold text-slate-300 bg-slate-700 px-2 py-0.5 rounded-md">
              {currentLang === 'om'
                ? 'Ji\'a Ji\'aan Hanga Guyyaa 30tti'
                : currentLang === 'en'
                ? 'Due by the 30th monthly'
                : 'በየወሩ እስከ 30 ቀን'}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: CASHIER'S PUBLISHED BANK ACCOUNTS
          ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {currentLang === 'om'
                  ? 'Herregaalee Baankii Seera-qabeessa Mana Barumsaa'
                  : currentLang === 'en'
                  ? 'Official School Bank Accounts'
                  : 'የትምህርት ቤቱ ይፋዊ የባንክ ሂሳቦች (School Bank Accounts)'}
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              {currentLang === 'om'
                ? 'Lakkoofsota herrega baankii qabaataan maallaqaa mana barumsaa maxxanse. Kaffaltii keessan herregaalee kanaan raawwadhaatii nagahee qabsiisaa.'
                : currentLang === 'en'
                ? 'Official bank accounts posted by the school cashier. Complete payment using these accounts and attach your receipt.'
                : 'የትምህርት ቤቱ ገንዘብ ያዥ የለጠፋቸው ይፋዊ የባንክ ሂሳብ ቁጥሮች። ክፍያዎን በእነዚህ አካውንቶች ፈጽመው ደረሰኝ ያያይዙ።'}
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {currentLang === 'om'
                ? 'Qabaataa Maallaqaatiin Kan Mirkanaa\'e'
                : currentLang === 'en'
                ? 'Verified by School Cashier'
                : 'በገንዘብ ያዥ የተረጋገጠ'}
            </span>
          </div>
        </div>

        {/* Bank Account Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bankAccounts.map((account) => {
            const isCopied = copiedBankId === account.id;
            const isTelebirr = account.bankName.toLowerCase().includes('telebirr') || account.bankName.includes('ቴሌብር');
            const isCBE = account.bankName.toLowerCase().includes('cbe') || account.bankName.includes('ንግድ ባንክ');
            const isAwash = account.bankName.toLowerCase().includes('awash') || account.bankName.includes('አዋሽ');

            return (
              <div
                key={account.id}
                className={`relative rounded-2xl p-5 border transition hover:shadow-md ${
                  isTelebirr
                    ? 'bg-gradient-to-b from-sky-50/70 to-white border-sky-200'
                    : isCBE
                    ? 'bg-gradient-to-b from-purple-50/70 to-white border-purple-200'
                    : isAwash
                    ? 'bg-gradient-to-b from-amber-50/70 to-white border-amber-200'
                    : 'bg-gradient-to-b from-slate-50 to-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isTelebirr
                          ? 'bg-sky-100 text-sky-800'
                          : isCBE
                          ? 'bg-purple-100 text-purple-800'
                          : isAwash
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {account.bankName}
                    </span>
                    {account.branch && (
                      <p className="text-[11px] text-slate-400 mt-1">{account.branch}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  <p className="text-xs text-slate-500 font-medium">
                    {currentLang === 'om' ? 'Lakkoofsa Herregaa:' : currentLang === 'en' ? 'Account Number:' : 'የሂሳብ ቁጥር / Account Number:'}
                  </p>
                  <div className="flex items-center justify-between gap-2 bg-white/90 p-2.5 rounded-xl border border-slate-200/80 shadow-inner">
                    <span className="font-mono font-extrabold text-slate-900 tracking-wider text-sm select-all">
                      {account.accountNumber}
                    </span>
                    <button
                      onClick={() => handleCopyAccount(account.accountNumber, account.id)}
                      className={`p-1.5 rounded-lg transition text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title={currentLang === 'om' ? 'Garagalchi' : 'ኮፒ አድርግ'}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{currentLang === 'om' ? 'Garagalfame!' : currentLang === 'en' ? 'Copied!' : 'ተቀድቷል!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{currentLang === 'om' ? 'Garagalchi' : currentLang === 'en' ? 'Copy' : 'ኮፒ'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800 line-clamp-1">{account.accountHolder}</p>
                  {account.instructions && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                      "{account.instructions}"
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {currentLang === 'om' ? 'Maxxansaa:' : currentLang === 'en' ? 'Posted by:' : 'የለጠፈው፡'}{' '}
                    {account.postedBy || (currentLang === 'om' ? 'Qabaataa Maallaqaa' : 'ገንዘብ ያዥ')}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedBankName(account.bankName);
                      handleOpenAttachModal('ኅዳር 2017');
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{currentLang === 'om' ? 'Kana Kaffali' : currentLang === 'en' ? 'Pay Now' : 'ክፈሉበት'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: ANNUAL TUITION TABLE
          ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              {currentLang === 'om'
                ? 'Gabatee Kaffaltii Ji\'aa Waggaa Guutuu Bara 2017 (Ji\'oota 10)'
                : currentLang === 'en'
                ? '2017 E.C. Annual Monthly Tuition Table (10 Months)'
                : 'የ2017 የትምህርት ዘመን የሙሉ ዓመት የወር ክፍያ ሰንጠረዥ (10 ወራት)'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {currentLang === 'om'
                ? 'Haalli kaffaltii ji\'oota barnootaa 10n asitti mul\'ata. Kan kaffalame (Magariisa), ji\'a seenee hin kaffalamin (Diimaa).'
                : currentLang === 'en'
                ? 'Payment status for all 10 academic months: Paid (Green), Overdue / Unpaid (Red).'
                : 'የ10ሩም የትምህርት ወራት ክፍያ ሁኔታ እዚህ ይታያል። የተከፈለ (አረንጓዴ)፣ ወሩ ገብቶ ያልተከፈለ (ቀይ)።'}
            </p>
          </div>

          {/* Color Legend (ቀለማት መፍቻ) */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-600 shadow-sm" />
              <span className="font-bold text-emerald-800">
                {currentLang === 'om' ? 'Kaffalameera (Magariisa)' : currentLang === 'en' ? 'Paid (Green)' : 'ተከፍሏል (አረንጓዴ)'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-rose-600 shadow-sm" />
              <span className="font-bold text-rose-800">
                {currentLang === 'om' ? 'Hin Kaffalamne (Diimaa)' : currentLang === 'en' ? 'Unpaid / Overdue (Red)' : 'ያልተከፈለ / ወሩ የገባ (ቀይ)'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-500 shadow-sm" />
              <span className="font-bold text-amber-800">
                {currentLang === 'om' ? 'Mirkaneessarra (Keelloo)' : currentLang === 'en' ? 'Pending (Yellow)' : 'በማረጋገጥ ላይ (ቢጫ)'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-300 border border-slate-400 shadow-sm" />
              <span className="text-slate-500">
                {currentLang === 'om' ? 'Ji\'a Dhufu' : currentLang === 'en' ? 'Upcoming' : 'የመጪው ወር'}
              </span>
            </div>
          </div>
        </div>

        {/* Visual 10-Month Annual Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
          {annualSchedule.map((item) => {
            const isPaid = item.status === 'paid';
            const isOverdue = item.status === 'overdue' || item.status === 'rejected';
            const isPending = item.status === 'pending';
            const isUpcoming = item.status === 'upcoming';

            return (
              <div
                key={item.month.key}
                className={`rounded-2xl p-4 border-2 transition-all flex flex-col justify-between relative overflow-hidden ${
                  isPaid
                    ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 shadow-sm'
                    : isOverdue
                    ? 'bg-rose-50/90 border-rose-500 text-rose-950 shadow-sm'
                    : isPending
                    ? 'bg-amber-50/90 border-amber-400 text-amber-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {/* Status Color Badge Banner */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {currentLang === 'om' ? `Ji'a ${item.month.order}` : currentLang === 'en' ? `Month ${item.month.order}` : `ወር ${item.month.order}`}
                    </span>
                    <h4 className="text-base font-black text-slate-900 mt-0.5">
                      {currentLang === 'om' ? item.month.labelOm.split(' ')[0] : item.month.key}
                    </h4>
                    <p className="text-[11px] text-slate-500">{item.month.labelEn}</p>
                  </div>

                  {/* Status Indicator Pill */}
                  {isPaid ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white rounded-full text-[11px] font-black shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{currentLang === 'om' ? 'Kaffalameera' : currentLang === 'en' ? 'Paid' : 'ተከፍሏል'}</span>
                    </span>
                  ) : isOverdue ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-600 text-white rounded-full text-[11px] font-black shadow-sm animate-pulse">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{currentLang === 'om' ? 'Hin Kaffalamne' : currentLang === 'en' ? 'Unpaid' : 'ያልተከፈለ'}</span>
                    </span>
                  ) : isPending ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                      <Clock className="w-3 h-3" />
                      <span>{currentLang === 'om' ? 'Mirkaneessarra' : currentLang === 'en' ? 'Pending' : 'በማረጋገጥ ላይ'}</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full text-[10px] font-semibold">
                      {currentLang === 'om' ? 'Hin Geenye' : currentLang === 'en' ? 'Upcoming' : 'ገና አልደረሰም'}
                    </span>
                  )}
                </div>

                {/* Amount and Details Body */}
                <div className="my-3 py-2 border-y border-dashed border-slate-200/80 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500">
                      {currentLang === 'om' ? 'Gatii Kaffaltii:' : currentLang === 'en' ? 'Amount:' : 'የክፍያ መጠን፡'}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {item.record?.amount || 850} {currentLang === 'om' ? 'ETB' : 'ብር'}
                    </span>
                  </div>

                  {isPaid && item.record && (
                    <div className="space-y-0.5 text-[11px] text-emerald-800">
                      <p className="truncate font-mono">
                        {currentLang === 'om' ? 'Nagahee:' : currentLang === 'en' ? 'Receipt:' : 'ደረሰኝ፡'} {item.record.receiptNumber}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {currentLang === 'om' ? 'Guyyaa:' : currentLang === 'en' ? 'Date:' : 'ቀን፡'} {item.record.paymentDate}
                      </p>
                    </div>
                  )}

                  {isOverdue && (
                    <div className="text-[11px] text-rose-700 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>
                        {currentLang === 'om'
                          ? 'Ji\'i seeneera maaloo kaffalaa!'
                          : currentLang === 'en'
                          ? 'Month due, please make payment!'
                          : 'ወሩ ገብቷል እባክዎ ይክፈሉ!'}
                      </span>
                    </div>
                  )}

                  {isPending && item.record && (
                    <div className="text-[11px] text-amber-800 space-y-0.5">
                      <p className="truncate">
                        {currentLang === 'om' ? 'Nagaheen ergameera' : currentLang === 'en' ? 'Receipt submitted' : 'ደረሰኝ ተልኳል'}
                      </p>
                      {item.record.transactionRef && (
                        <p className="font-mono text-[10px] truncate">Ref: {item.record.transactionRef}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Footer */}
                <div className="pt-1">
                  {isPaid && item.record ? (
                    <button
                      onClick={() => setViewingReceipt(item.record!)}
                      className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>
                        {currentLang === 'om'
                          ? 'Nagahee Ilaali / Maxxansi'
                          : currentLang === 'en'
                          ? 'View / Print Receipt'
                          : 'ደረሰኝ እይ / አትም'}
                      </span>
                    </button>
                  ) : isOverdue ? (
                    <button
                      onClick={() => handleOpenAttachModal(item.fullMonthName, item.record)}
                      className="w-full py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-500/20 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        {currentLang === 'om'
                          ? 'Nagahee Qabsiisi'
                          : currentLang === 'en'
                          ? 'Attach Receipt'
                          : 'ደረሰኝ አታች አድርግ'}
                      </span>
                    </button>
                  ) : isPending && item.record ? (
                    <button
                      onClick={() => setViewingReceipt(item.record!)}
                      className="w-full py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>
                        {currentLang === 'om'
                          ? 'Nagahee Ergame Ilaali'
                          : currentLang === 'en'
                          ? 'View Sent Receipt'
                          : 'የተላከውን ደረሰኝ እይ'}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenAttachModal(item.fullMonthName)}
                      className="w-full py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        {currentLang === 'om'
                          ? 'Dursanii Kaffalaa'
                          : currentLang === 'en'
                          ? 'Pay Ahead'
                          : 'ቀድመው ይክፈሉ'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Full Table View */}
        <div className="mt-8 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-800">
              {currentLang === 'om'
                ? 'Gabatee Tarreeffama Galmee Kaffaltii (Detailed Tabular View)'
                : currentLang === 'en'
                ? 'Detailed Payment Ledger Table'
                : 'የክፍያ ዝርዝር መዝገብ ሰንጠረዥ (Detailed Tabular View)'}
            </h4>
            <span className="text-xs text-slate-500">
              {currentLang === 'om'
                ? 'Istaandardii Kaffaltii Mana Barumsaa Shaashamannee 2017'
                : currentLang === 'en'
                ? '2017 E.C. Shashemene School Fee Standard'
                : 'የ2017 ዓ.ም የሻሸመኔ ትምህርት ቤት የክፍያ ስታንዳርድ'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">
                    {currentLang === 'om' ? 'Ji\'a Barnootaa' : currentLang === 'en' ? 'Academic Month' : 'የትምህርት ወር'}
                  </th>
                  <th className="py-3 px-4">
                    {currentLang === 'om' ? 'Haala Kaffaltii' : currentLang === 'en' ? 'Status' : 'የክፍያ ሁኔታ (Status)'}
                  </th>
                  <th className="py-3 px-4">
                    {currentLang === 'om' ? 'Hanga (ETB)' : currentLang === 'en' ? 'Amount (ETB)' : 'መጠን (ብር)'}
                  </th>
                  <th className="py-3 px-4">
                    {currentLang === 'om' ? 'Baankii / Karaa' : currentLang === 'en' ? 'Bank / Method' : 'የተከፈለበት ባንክ/መንገድ'}
                  </th>
                  <th className="py-3 px-4">
                    {currentLang === 'om' ? 'Lakkoofsa Nagahee / Ref' : currentLang === 'en' ? 'Receipt / Ref No.' : 'የደረሰኝ / ግብይት ቁጥር'}
                  </th>
                  <th className="py-3 px-4">
                    {currentLang === 'om' ? 'Guyyaa Kaffaltii' : currentLang === 'en' ? 'Payment Date' : 'የተከፈለበት ቀን'}
                  </th>
                  <th className="py-3 px-4 text-right">
                    {currentLang === 'om' ? 'Tarkaanfii' : currentLang === 'en' ? 'Action' : 'እርምጃ (Action)'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {annualSchedule.map((item, idx) => {
                  const isPaid = item.status === 'paid';
                  const isOverdue = item.status === 'overdue' || item.status === 'rejected';
                  const isPending = item.status === 'pending';

                  return (
                    <tr
                      key={item.month.key}
                      className={`hover:bg-slate-50/80 transition ${
                        isPaid
                          ? 'bg-emerald-50/30'
                          : isOverdue
                          ? 'bg-rose-50/30'
                          : isPending
                          ? 'bg-amber-50/30'
                          : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">
                          {currentLang === 'om' ? item.month.labelOm.split(' ')[0] : item.month.key} 2017
                        </span>
                        <span className="block text-[10px] text-slate-400">{item.month.labelEn}</span>
                      </td>
                      <td className="py-3 px-4">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-[11px] border border-emerald-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                            {currentLang === 'om' ? 'KAFFALAMEERA (PAID)' : currentLang === 'en' ? 'PAID' : 'ተከፍሏል (PAID)'}
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 rounded-full font-black text-[11px] border border-rose-300">
                            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                            {currentLang === 'om'
                              ? 'HIN KAFFALAMNE (OVERDUE)'
                              : currentLang === 'en'
                              ? 'OVERDUE / UNPAID'
                              : 'ወሩ ገብቷል ያልተከፈለ (OVERDUE)'}
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[11px] border border-amber-300">
                            <Clock className="w-3 h-3 text-amber-600" />
                            {currentLang === 'om'
                              ? 'MIRKANEESSARRA (PENDING)'
                              : currentLang === 'en'
                              ? 'PENDING'
                              : 'በማረጋገጥ ላይ (PENDING)'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[11px]">
                            {currentLang === 'om'
                              ? 'JI\'A DHUFU (UPCOMING)'
                              : currentLang === 'en'
                              ? 'UPCOMING'
                              : 'የመጪው ወር (UPCOMING)'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">
                        {item.record?.amount || 850} ETB
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {item.record?.bankName || item.record?.paymentMethod || '-'}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-800">
                        {item.record?.receiptNumber || item.record?.transactionRef || '-'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.record?.paymentDate || item.record?.submittedAt?.split('T')[0] || '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isPaid && item.record ? (
                          <button
                            onClick={() => setViewingReceipt(item.record!)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-sm cursor-pointer"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>
                              {currentLang === 'om' ? 'Nagahee Maxxansi' : currentLang === 'en' ? 'Print Receipt' : 'ደረሰኝ አትም'}
                            </span>
                          </button>
                        ) : isOverdue ? (
                          <button
                            onClick={() => handleOpenAttachModal(item.fullMonthName, item.record)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 shadow-sm cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>
                              {currentLang === 'om' ? 'Nagahee Ergi' : currentLang === 'en' ? 'Send Receipt' : 'ደረሰኝ ላክ'}
                            </span>
                          </button>
                        ) : isPending && item.record ? (
                          <button
                            onClick={() => setViewingReceipt(item.record!)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>
                              {currentLang === 'om' ? 'Nagahee Ilaali' : currentLang === 'en' ? 'View Receipt' : 'ደረሰኝ እይ'}
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenAttachModal(item.fullMonthName)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-200 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>
                              {currentLang === 'om' ? 'Kaffalaa' : currentLang === 'en' ? 'Pay' : 'ክፈሉ'}
                            </span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: RECEIPT ATTACHMENT MODAL
          ========================================================================= */}
      {showAttachReceiptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {currentLang === 'om'
                      ? 'Nagahee Kaffaltii Qabsiisaatii Qabaataa Maallaqaaf Ergaa'
                      : currentLang === 'en'
                      ? 'Attach Payment Receipt & Send to Cashier'
                      : 'የከፈሉበትን ደረሰኝ ያያይዙና ለገንዘብ ያዥ ይላኩ'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentLang === 'om'
                      ? 'Suuraa nagahee baankii ykn Telebirr kaasaa asirratti fe\'aa'
                      : currentLang === 'en'
                      ? 'Upload a photo or screenshot of your bank or Telebirr payment receipt'
                      : 'የባንክ ወይም የቴሌብር ክፍያ ማረጋገጫ ደረሰኝ ፎቶ አንስተው እዚህ ይጫኑ'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAttachReceiptModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReceipt} className="space-y-4 mt-5">
              {receiptFormError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{receiptFormError}</span>
                </div>
              )}
              {/* Target Student Info Card */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 font-medium">
                    {currentLang === 'om' ? 'Maqaa Barataa:' : currentLang === 'en' ? 'Student:' : 'የተማሪ ስም፡'}
                  </span>
                  <span className="font-bold text-slate-900 ml-1">{student.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">
                    {currentLang === 'om' ? 'Kutaa:' : currentLang === 'en' ? 'Grade:' : 'ክፍል፡'}
                  </span>
                  <span className="font-bold text-slate-900 ml-1">{student.grade}{student.section}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">
                    {currentLang === 'om' ? 'Lakk. Eenyummaa:' : currentLang === 'en' ? 'ID:' : 'መለያ ቁጥር፡'}
                  </span>
                  <span className="font-mono font-bold text-slate-900 ml-1">{student.studentIdNumber}</span>
                </div>
              </div>

              {/* Month Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLang === 'om'
                    ? 'Ji\'a Kaffaltii (Payment Month) *'
                    : currentLang === 'en'
                    ? 'Payment Month *'
                    : 'የሚከፈልበት የትምህርት ወር (Payment Month) *'}
                </label>
                <select
                  value={selectedMonthForPayment}
                  onChange={(e) => setSelectedMonthForPayment(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                >
                  {ETHIOPIAN_ACADEMIC_MONTHS.map((m) => (
                    <option key={m.key} value={`${m.key} 2017`}>
                      {currentLang === 'om' ? m.labelOm : currentLang === 'en' ? m.labelEn : m.labelAm} - 2017
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount & Bank Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Hanga Kaffaltii (ETB) *' : currentLang === 'en' ? 'Amount (ETB) *' : 'የክፍያ መጠን (ETB) *'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      className="w-full p-3 pl-8 bg-white border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                      required
                    />
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-2.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Baankii / Karaa Kaffaltii *' : currentLang === 'en' ? 'Bank / Payment Method *' : 'የከፈሉበት ባንክ / ዘዴ *'}
                  </label>
                  <select
                    value={selectedBankName}
                    onChange={(e) => setSelectedBankName(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  >
                    {bankAccounts.map((acc) => (
                      <option key={acc.id} value={acc.bankName}>
                        {acc.bankName} - ({acc.accountNumber})
                      </option>
                    ))}
                    <option value="የኢትዮጵያ ንግድ ባንክ (CBE)">
                      {currentLang === 'om' ? 'Baankii Daldala Itoophiyaa (CBE)' : 'የኢትዮጵያ ንግድ ባንክ (CBE)'}
                    </option>
                    <option value="ቴሌብር (Telebirr)">
                      {currentLang === 'om' ? 'Telebirr' : 'ቴሌብር (Telebirr)'}
                    </option>
                    <option value="አዋሽ ባንክ (Awash Bank)">
                      {currentLang === 'om' ? 'Baankii Awaash (Awash Bank)' : 'አዋሽ ባንክ (Awash Bank)'}
                    </option>
                    <option value="ዳሽን ባንክ (Dashen Bank)">
                      {currentLang === 'om' ? 'Baankii Daashin (Dashen Bank)' : 'ዳሽን ባንክ (Dashen Bank)'}
                    </option>
                    <option value="ሌላ ባንክ / በጥሬ ገንዘብ">
                      {currentLang === 'om' ? 'Baankii Biroo / Maallaqa Callaan' : currentLang === 'en' ? 'Other Bank / Cash' : 'ሌላ ባንክ / በጥሬ ገንዘብ'}
                    </option>
                  </select>
                </div>
              </div>

              {/* Bank Transaction Reference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLang === 'om'
                    ? 'Lakkoofsa Daldala Baankii (Transaction Ref / FT / SMS)'
                    : currentLang === 'en'
                    ? 'Bank Transaction Reference (FT / SMS Code)'
                    : 'የባንክ ግብይት ቁጥር (Transaction Reference / FT / SMS Code)'}
                </label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder={currentLang === 'om' ? 'Fkn: FT2410190284 ykn TT982101928' : 'ለምሳሌ፡ FT2410190284 ወይም TT982101928'}
                  className="w-full p-3 font-mono uppercase bg-white border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {currentLang === 'om'
                    ? 'Lakkoofsa addaa ergaa mirkaneessa baankii irratti argamu'
                    : currentLang === 'en'
                    ? 'Unique transaction code found on your bank confirmation SMS'
                    : 'የባንክ ማረጋገጫ መልእክት ላይ የሚገኘው ልዩ የግብይት ቁጥር'}
                </p>
              </div>

              {/* Receipt File Attachment Upload Area */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLang === 'om'
                    ? 'Suuraa Nagahee / Iskiriinshootii Qabsiisi *'
                    : currentLang === 'en'
                    ? 'Attach Receipt Image / PDF *'
                    : 'የደረሰኝ ፎቶ / ስክሪንሾት ማያያዣ (Attach Receipt Image / PDF) *'}
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center bg-slate-50 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {receiptImagePreview ? (
                    <div className="space-y-2">
                      <div className="max-h-48 overflow-hidden rounded-xl border border-slate-200 inline-block bg-white shadow-inner">
                        <img
                          src={receiptImagePreview}
                          alt="Receipt Preview"
                          className="max-h-44 object-contain mx-auto"
                        />
                      </div>
                      <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {currentLang === 'om'
                            ? `Nagaheen qabsiifameera (${receiptImageName || 'Suuraa'})`
                            : currentLang === 'en'
                            ? `Receipt attached (${receiptImageName || 'Image'})`
                            : `ደረሰኙ በተሳካ ሁኔታ ተያይዟል (${receiptImageName || 'ፎቶ'})`}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {currentLang === 'om' ? 'Jijjiiruuf suuraa biraa cuqaasaa' : currentLang === 'en' ? 'Click to upload another image' : 'ለመቀየር ሌላ ፎቶ ይጫኑ'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-2">
                      <div className="w-12 h-12 mx-auto bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-800">
                        {currentLang === 'om'
                          ? 'Suuraa nagahee asirratti cuqaasaa (Click to Browse)'
                          : currentLang === 'en'
                          ? 'Click to Browse / Upload Receipt Photo'
                          : 'የደረሰኙን ፎቶ እዚህ ይጫኑ (Click to Browse / Take Photo)'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {currentLang === 'om'
                          ? 'Faayila PNG, JPG, JPEG ykn PDF qabsiisuun ni danda\'ama'
                          : currentLang === 'en'
                          ? 'PNG, JPG, JPEG or PDF files supported'
                          : 'PNG, JPG, JPEG ወይም PDF ፋይል ማያያዝ ይቻላል'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payer Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Maqaa Kaffalaa (Payer Name)' : currentLang === 'en' ? 'Payer Name' : 'የከፋዩ ስም (Payer Name)'}
                  </label>
                  <input
                    type="text"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Bilbila Kaffalaa (Phone)' : currentLang === 'en' ? 'Payer Phone' : 'የከፋዩ ስልክ ቁጥር (Phone)'}
                  </label>
                  <input
                    type="tel"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLang === 'om' ? 'Yaadannoo Dabalataa Qabaataa Maallaqaaf' : currentLang === 'en' ? 'Additional Notes for Cashier' : 'ተጨማሪ ማስታወሻ ለገንዘብ ያዥ (Notes)'}
                </label>
                <input
                  type="text"
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder={currentLang === 'om' ? 'Yoo barbaachise ibsa dabalataa barreessaa' : currentLang === 'en' ? 'Optional note for the cashier' : 'አስፈላጊ ከሆነ ተጨማሪ መግለጫ ይጻፉ'}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAttachReceiptModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  {currentLang === 'om' ? 'Dhiisi (Cancel)' : currentLang === 'en' ? 'Cancel' : 'ይቅር (Cancel)'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? currentLang === 'om'
                        ? 'Ergaa jira...'
                        : currentLang === 'en'
                        ? 'Submitting...'
                        : 'በመላክ ላይ...'
                      : currentLang === 'om'
                      ? 'Nagahee Ergi (Submit Receipt)'
                      : currentLang === 'en'
                      ? 'Submit Receipt'
                      : 'ደረሰኙን ላክ (Submit Receipt)'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 4: OFFICIAL PRINTABLE RECEIPT MODAL
          ========================================================================= */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {viewingReceipt.status === 'paid'
                    ? currentLang === 'om'
                      ? 'Nagahee Kaffaltii Seera-qabeessa (Official Receipt)'
                      : currentLang === 'en'
                      ? 'Official Payment Receipt'
                      : 'ይፋዊ የክፍያ ደረሰኝ (Official Receipt)'
                    : currentLang === 'om'
                    ? 'Ilaalcha Duraa Nagahee Ergamee'
                    : currentLang === 'en'
                    ? 'Submitted Receipt Preview'
                    : 'የተላከ ደረሰኝ ቅድመ-እይታ'}
                </h3>
              </div>
              <button
                onClick={() => setViewingReceipt(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Receipt Paper */}
            <div className="mt-4 p-6 bg-slate-50 border-2 border-slate-300 rounded-2xl space-y-4 print:p-0 print:border-none print:bg-white">
              {/* Header */}
              <div className="text-center pb-3 border-b border-dashed border-slate-300">
                <div className="flex justify-center mb-2">
                  <SchoolLogo
                    schoolName={school?.name || student.schoolName}
                    logoUrl={school?.logoUrl}
                    size={52}
                  />
                </div>
                <h4 className="font-extrabold text-base text-slate-900">
                  {school?.name || (currentLang === 'om' ? 'Mana Barumsaa Sad. 2ffaa Shaashamannee' : 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት')}
                </h4>
                <p className="text-xs text-slate-500">
                  {currentLang === 'om'
                    ? 'Waajjira Faayinaansii fi Herregaa | Nagahee Kaffaltii Ji\'aa Mana Barumsaa'
                    : currentLang === 'en'
                    ? 'Finance & Accounts Office | Monthly Tuition Receipt'
                    : 'የፋይናንስና ሂሳብ ሹም ጽ/ቤት | የትምህርት ቤት ወርሃዊ ክፍያ ደረሰኝ'}
                </p>
                <div className="mt-2 inline-block px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-xs font-mono font-bold">
                  {currentLang === 'om' ? 'Lakkoofsa:' : currentLang === 'en' ? 'No:' : 'ቁጥር፡'} {viewingReceipt.receiptNumber}
                </div>
              </div>

              {/* Receipt Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {currentLang === 'om' ? 'Maqaa Barataa:' : currentLang === 'en' ? 'Student Name:' : 'የተማሪ ስም፡'}
                  </span>
                  <span className="font-bold text-slate-900">{viewingReceipt.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {currentLang === 'om' ? 'Kutaa fi Daree:' : currentLang === 'en' ? 'Grade & Section:' : 'ክፍል እና ተራ፡'}
                  </span>
                  <span className="font-bold text-slate-900">{viewingReceipt.grade} - {viewingReceipt.section}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {currentLang === 'om' ? 'Maqaa Maatii:' : currentLang === 'en' ? 'Parent Name:' : 'የወላጅ ስም፡'}
                  </span>
                  <span className="font-bold text-slate-900">{viewingReceipt.parentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {currentLang === 'om' ? 'Ji\'a Kaffalame:' : currentLang === 'en' ? 'Paid Month:' : 'የተከፈለበት ወር፡'}
                  </span>
                  <span className="font-bold text-emerald-800">{viewingReceipt.month}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {currentLang === 'om' ? 'Baankii / Karaa:' : currentLang === 'en' ? 'Bank / Method:' : 'የተከፈለበት ባንክ/መንገድ፡'}
                  </span>
                  <span className="font-semibold text-slate-900">{viewingReceipt.bankName || viewingReceipt.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {currentLang === 'om' ? 'Lakk. Daldalaa (Ref):' : currentLang === 'en' ? 'Transaction Ref:' : 'የግብይት ቁጥር (Ref):'}
                  </span>
                  <span className="font-mono font-bold text-slate-900">{viewingReceipt.transactionRef || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {currentLang === 'om' ? 'Guyyaa Kaffaltii:' : currentLang === 'en' ? 'Payment Date:' : 'የተከፈለበት ቀን፡'}
                  </span>
                  <span className="font-medium text-slate-900">{viewingReceipt.paymentDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {currentLang === 'om' ? 'Qabaataa Mirkaneesse:' : currentLang === 'en' ? 'Verified By:' : 'ያረጋገጠው ገንዘብ ያዥ፡'}
                  </span>
                  <span className="font-semibold text-slate-900">{viewingReceipt.collectedBy}</span>
                </div>
              </div>

              {/* Attached Image Preview if exists */}
              {viewingReceipt.receiptImageUrl && (
                <div className="pt-2 border-t border-dashed border-slate-300">
                  <p className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {currentLang === 'om'
                      ? 'Suuraa nagahee baankii qabsiifame:'
                      : currentLang === 'en'
                      ? 'Attached Bank Receipt Photo:'
                      : 'የተያያዘው የባንክ ደረሰኝ ፎቶ፡'}
                  </p>
                  <div className="max-h-56 overflow-hidden rounded-xl border border-slate-300 bg-white p-1">
                    <img
                      src={viewingReceipt.receiptImageUrl}
                      alt="Bank receipt proof"
                      className="max-h-52 w-full object-contain mx-auto"
                    />
                  </div>
                </div>
              )}

              {/* Amount Box */}
              <div className="bg-emerald-600 text-white p-3.5 rounded-xl flex items-center justify-between font-bold">
                <span className="text-xs uppercase tracking-wider text-emerald-100">
                  {currentLang === 'om'
                    ? 'Ida\'ama Waliigalaa Kaffalame (Total Paid):'
                    : currentLang === 'en'
                    ? 'Total Paid:'
                    : 'የተከፈለው ጠቅላላ ድምር (Total Paid):'}
                </span>
                <span className="text-lg font-black">{viewingReceipt.amount} ETB</span>
              </div>

              {/* Seal and Signature */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-[10px] text-slate-500">
                <div>
                  <p>
                    {currentLang === 'om'
                      ? 'Chaappaa fi Mallattoo Qabaataa Maallaqaa'
                      : currentLang === 'en'
                      ? 'Cashier Stamp & Signature'
                      : 'የገንዘብ ያዥ ማህተም እና ፊርማ'}
                  </p>
                  <p className="font-bold text-slate-800 mt-1">
                    {currentLang === 'om' ? 'Aaddee Salaamaawiit Abbarraa (Ogeessa Herregaa)' : 'ወ/ሮ ሰላማዊት አበራ (ሒሳብ ሹም)'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                    {currentLang === 'om'
                      ? 'Chaappaa Seera-qabeessa Mana Barumsaa'
                      : currentLang === 'en'
                      ? 'Official School Stamp'
                      : 'ይፋዊ የት/ቤት ማህተም ያረፈበት'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 mt-5">
              <button
                onClick={() => setViewingReceipt(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                {currentLang === 'om' ? 'Cufi (Close)' : currentLang === 'en' ? 'Close' : 'ዝጋ (Close)'}
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>
                  {currentLang === 'om' ? 'Nagahee Maxxansi (Print)' : currentLang === 'en' ? 'Print Receipt' : 'ደረሰኝ አትም (Print Receipt)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
