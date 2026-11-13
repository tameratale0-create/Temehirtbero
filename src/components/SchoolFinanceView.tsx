import React, { useState, useMemo, useEffect } from 'react';
import {
  DollarSign,
  Plus,
  Receipt,
  Search,
  CheckCircle2,
  AlertCircle,
  Calendar,
  CreditCard,
  Building2,
  TrendingUp,
  TrendingDown,
  Printer,
  Download,
  Users,
  Clock,
  Check,
  Send,
  X,
  FileText,
  Filter,
  Lock,
  Upload,
  Eye,
  Copy,
  Edit2,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import {
  FeePaymentRecord,
  SchoolExpenseRecord,
  StudentRecord,
  School,
  Language,
  AppUserSession,
  SchoolBankAccount
} from '../types';
import { StorageService } from '../utils/storage';
import {
  StudentAnnualFeeDesk,
  ETHIOPIAN_ACADEMIC_MONTHS,
  CURRENT_ACTIVE_MONTH_ORDER
} from './StudentAnnualFeeDesk';

interface SchoolFinanceViewProps {
  school: School;
  students: StudentRecord[];
  currentUser: AppUserSession | null;
  currentLang: Language;
}

export const SchoolFinanceView: React.FC<SchoolFinanceViewProps> = ({
  school,
  students,
  currentUser,
  currentLang
}) => {
  const isBureauRole = currentUser?.role === 'bureau_admin' || currentUser?.role === 'bureau_staff';
  const isStudentOrParent = currentUser?.role === 'student' || currentUser?.role === 'parent';

  // Live state
  const [payments, setPayments] = useState<FeePaymentRecord[]>(() =>
    StorageService.getFeePayments(school.id)
  );
  const [expenses, setExpenses] = useState<SchoolExpenseRecord[]>(() =>
    StorageService.getExpenses(school.id)
  );
  const [bankAccounts, setBankAccounts] = useState<SchoolBankAccount[]>(() =>
    StorageService.getSchoolBankAccounts(school.id)
  );

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'fees' | 'receipts_queue' | 'bank_accounts' | 'annual_matrix' | 'expenses' | 'statement'
  >('fees');

  // Selected student for student/parent view or matrix detail
  const [selectedStudentForAnnual, setSelectedStudentForAnnual] = useState<StudentRecord | null>(() => {
    if (currentUser?.role === 'student') {
      return (
        students.find((s) => s.studentIdNumber === currentUser.identifier || s.id === currentUser.identifier) ||
        students[0] ||
        null
      );
    }
    if (currentUser?.role === 'parent') {
      return (
        students.find((s) => s.parentAccessCode === currentUser.accessCode || s.parentName.toLowerCase().includes(currentUser.name.toLowerCase())) ||
        students[0] ||
        null
      );
    }
    return students[0] || null;
  });

  // Modal states for Cashier Fee collection
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [feeMonth, setFeeMonth] = useState('ኅዳር 2017');
  const [feeAmount, setFeeAmount] = useState(850);
  const [paymentMethod, setPaymentMethod] = useState<FeePaymentRecord['paymentMethod']>('telebirr');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Expense modal state
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<SchoolExpenseRecord['category']>('supplies');
  const [expenseAmount, setExpenseAmount] = useState(3500);
  const [expensePaidTo, setExpensePaidTo] = useState('');
  const [expenseApprovedBy, setExpenseApprovedBy] = useState(
    currentLang === 'om'
      ? 'Obbo Guutamaa Waaqoo (Daayirektara Olaanaa)'
      : currentLang === 'en'
      ? 'Mr. Gutema Wako (Principal)'
      : 'አቶ ጉተማ ዋቆ (ዋና ዳይሬክተር)'
  );
  const [expenseNotes, setExpenseNotes] = useState('');

  // Bank Account Modal state
  const [showBankModal, setShowBankModal] = useState(false);
  const [confirmDeleteBankId, setConfirmDeleteBankId] = useState<string | null>(null);
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [bankNameInput, setBankNameInput] = useState('የኢትዮጵያ ንግድ ባንክ (CBE)');
  const [accountNumberInput, setAccountNumberInput] = useState('');
  const [accountHolderInput, setAccountHolderInput] = useState(school.name);
  const [branchInput, setBranchInput] = useState(
    currentLang === 'om' ? 'Damee Shaashamannee' : currentLang === 'en' ? 'Shashemene Branch' : 'ሻሸመኔ ቅርንጫፍ'
  );
  const [instructionsInput, setInstructionsInput] = useState(
    currentLang === 'om'
      ? 'Yeroo kaffaltii maqaa guutuu barataa fi kutaa isaa barreessaa'
      : currentLang === 'en'
      ? 'Please include the student full name and grade when paying'
      : 'በክፍያ ወቅት የተማሪውን ሙሉ ስም እና ክፍል ይጥቀሱ'
  );
  const [isBankActive, setIsBankActive] = useState(true);

  const getMonthDisplay = (rawMonth: string) => {
    const found = ETHIOPIAN_ACADEMIC_MONTHS.find((m) => rawMonth.toLowerCase().includes(m.key.toLowerCase()));
    if (!found) return rawMonth;
    const yearMatch = rawMonth.match(/\d{4}/);
    const yr = yearMatch ? ` ${yearMatch[0]}` : '';
    const base =
      currentLang === 'om'
        ? found.labelOm || found.labelAm
        : currentLang === 'en'
        ? found.labelEn || found.labelAm
        : found.labelAm;
    return `${base}${yr}`;
  };

  const getBankDisplay = (rawBank?: string) => {
    if (!rawBank) return '-';
    const map: Record<string, { om: string; en: string; am: string }> = {
      'የኢትዮጵያ ንግድ ባንክ (CBE)': { om: 'Baankii Daldala Itoophiyaa (CBE)', en: 'Commercial Bank of Ethiopia (CBE)', am: 'የኢትዮጵያ ንግድ ባንክ (CBE)' },
      'ቴሌብር (Telebirr)': { om: 'Telebirr', en: 'Telebirr', am: 'ቴሌብር (Telebirr)' },
      'አዋሽ ባንክ (Awash Bank)': { om: 'Baankii Awaash (Awash Bank)', en: 'Awash Bank', am: 'አዋሽ ባንክ (Awash Bank)' },
      'ዳሽን ባንክ (Dashen Bank)': { om: 'Baankii Daashin (Dashen Bank)', en: 'Dashen Bank', am: 'ዳሽን ባንክ (Dashen Bank)' },
      'ወጋገን ባንክ (Wegagen Bank)': { om: 'Baankii Wagaagan (Wegagen Bank)', en: 'Wegagen Bank', am: 'ወጋገን ባንክ (Wegagen Bank)' },
      'ሕብረት ባንክ (Hibret Bank)': { om: 'Baankii Hibrat (Hibret Bank)', en: 'Hibret Bank', am: 'ሕብረት ባንክ (Hibret Bank)' },
      'ኦሮሚያ ባንክ (Oromia Bank)': { om: 'Baankii Oromiyaa (Oromia Bank)', en: 'Oromia Bank', am: 'ኦሮሚያ ባንክ (Oromia Bank)' },
      'አቢሲንያ ባንክ (Bank of Abyssinia)': { om: 'Baankii Abisiiniyaa (Bank of Abyssinia)', en: 'Bank of Abyssinia', am: 'አቢሲንያ ባንክ (Bank of Abyssinia)' }
    };
    const found = map[rawBank];
    if (!found) return rawBank;
    return currentLang === 'om' ? found.om : currentLang === 'en' ? found.en : found.am;
  };

  // Receipt Verification & Image Preview Modal state
  const [previewReceiptPayment, setPreviewReceiptPayment] = useState<FeePaymentRecord | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<FeePaymentRecord | null>(null);
  const [rejectionModalPayment, setRejectionModalPayment] = useState<FeePaymentRecord | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');

  // Filters & search
  const [searchStudentQuery, setSearchStudentQuery] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [reminderSentId, setReminderSentId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);

  // Sync with storage events
  useEffect(() => {
    const handleFeeUpdates = () => setPayments(StorageService.getFeePayments(school.id));
    const handleBankUpdates = () => setBankAccounts(StorageService.getSchoolBankAccounts(school.id));

    window.addEventListener('fee_payments_updated', handleFeeUpdates);
    window.addEventListener('school_bank_accounts_updated', handleBankUpdates);
    window.addEventListener('storage', handleFeeUpdates);

    return () => {
      window.removeEventListener('fee_payments_updated', handleFeeUpdates);
      window.removeEventListener('school_bank_accounts_updated', handleBankUpdates);
      window.removeEventListener('storage', handleFeeUpdates);
    };
  }, [school.id]);

  // Derived calculations
  const pendingReceipts = useMemo(() => {
    return payments.filter((p) => p.status === 'pending');
  }, [payments]);

  const verifiedReceipts = useMemo(() => {
    return payments.filter((p) => p.status === 'paid');
  }, [payments]);

  const totalRevenue = verifiedReceipts.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netBalance = totalRevenue - totalExpense;

  // Filtered Payments for table
  const filteredPayments = payments.filter((p) => {
    if (!searchStudentQuery.trim()) return true;
    const q = searchStudentQuery.toLowerCase();
    return (
      p.studentName.toLowerCase().includes(q) ||
      p.receiptNumber.toLowerCase().includes(q) ||
      p.parentName.toLowerCase().includes(q) ||
      p.month.toLowerCase().includes(q) ||
      (p.transactionRef && p.transactionRef.toLowerCase().includes(q))
    );
  });

  // Action: Cashier Collects Fee in Cash or Manual
  const handleCollectFee = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) return;

    const defaultCollector =
      currentLang === 'om'
        ? 'Adde Salaamaawit Abarraa (Qabduu Maallaqaa)'
        : currentLang === 'en'
        ? 'Ms. Selamawit Abera (Cashier)'
        : 'ወ/ሮ ሰላማዊት አበራ (ሒሳብ ሹም)';

    const receiptNumber = `SHAS-REC-${Date.now().toString().slice(-6)}`;
    const newPayment: FeePaymentRecord = {
      id: `fee-${Date.now()}`,
      schoolId: school.id,
      studentId: student.id,
      studentName: student.fullName,
      grade: student.grade,
      section: student.section,
      parentName: student.parentName,
      month: feeMonth,
      amount: Number(feeAmount),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod,
      receiptNumber,
      status: 'paid',
      collectedBy: currentUser?.name || defaultCollector,
      notes: paymentNotes
    };

    StorageService.addFeePayment(newPayment);
    const updated = StorageService.getFeePayments(school.id);
    setPayments(updated);
    setShowCollectModal(false);
    setSelectedReceipt(newPayment);
    setSelectedStudentId('');
    setPaymentNotes('');
    setToastMessage(
      currentLang === 'om'
        ? `Kaffaltiin ji'aa (${getMonthDisplay(feeMonth)}) kan barataa ${student.fullName} galmaa'eera!`
        : currentLang === 'en'
        ? `Fee payment for ${student.fullName} (${getMonthDisplay(feeMonth)}) recorded!`
        : `የ${student.fullName} የ${feeMonth} ክፍያ ተመዝግቧል!`
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Action: Cashier Approves Submitted Receipt
  const handleApproveReceipt = (payment: FeePaymentRecord) => {
    const accountantName =
      currentUser?.name ||
      (currentLang === 'om'
        ? 'Adde Salaamaawit Abarraa (Qabduu Maallaqaa)'
        : currentLang === 'en'
        ? 'Ms. Selamawit Abera (Head Accountant)'
        : 'ወ/ሮ ሰላማዊት አበራ (ዋና ሒሳብ ሹም)');
    StorageService.verifyFeePayment(payment.id, accountantName);
    const updated = StorageService.getFeePayments(school.id);
    setPayments(updated);
    setPreviewReceiptPayment(null);
    setToastMessage(
      currentLang === 'om'
        ? `Nagaheen ji'aa (${getMonthDisplay(payment.month)}) kan ${payment.studentName} mirkanaa'eera! Gabateen waggaa gara magariisaatti jijjiirameera.`
        : currentLang === 'en'
        ? `Receipt for ${payment.studentName} (${getMonthDisplay(payment.month)}) approved! Annual schedule turned green.`
        : `የ${payment.studentName} የ${payment.month} ደረሰኝ ጸድቋል! የተማሪው ዓመታዊ ሰንጠረዥ ወደ አረንጓዴ ተቀይሯል።`
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Action: Cashier Rejects Submitted Receipt
  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModalPayment) return;
    const reason =
      rejectionReasonText.trim() ||
      (currentLang === 'om'
        ? 'Nagaheen ykn lakkoofsi daldalaa baankii ergame ifa miti'
        : currentLang === 'en'
        ? 'Submitted receipt or bank transaction reference is unclear'
        : 'የተላከው ደረሰኝ ወይም የባንክ ግብይት ቁጥር ግልጽ አይደለም');
    const accountantName =
      currentUser?.name ||
      (currentLang === 'om'
        ? 'Adde Salaamaawit Abarraa (Qabduu Maallaqaa)'
        : currentLang === 'en'
        ? 'Ms. Selamawit Abera (Head Accountant)'
        : 'ወ/ሮ ሰላማዊት አበራ (ዋና ሒሳብ ሹም)');

    StorageService.rejectFeePayment(rejectionModalPayment.id, reason, accountantName);
    setPayments(StorageService.getFeePayments(school.id));
    setRejectionModalPayment(null);
    setPreviewReceiptPayment(null);
    setRejectionReasonText('');
    setToastMessage(
      currentLang === 'om'
        ? 'Mirkaneessi nagahee kufaa ta’eera; beeksisni gara barataa/maatiitti ergameera.'
        : currentLang === 'en'
        ? 'Receipt verification rejected; notification sent to student/parent.'
        : `የደረሰኝ ማረጋገጫው ውድቅ ተደርጓል፤ ለተማሪው/ወላጁ ማሳሰቢያ ተልኳል።`
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Action: Add / Update School Bank Account
  const handleSaveBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumberInput.trim()) return;

    if (editingBankId) {
      const existing = bankAccounts.find((b) => b.id === editingBankId);
      if (existing) {
        const updated: SchoolBankAccount = {
          ...existing,
          bankName: bankNameInput,
          accountNumber: accountNumberInput.trim(),
          accountHolder: accountHolderInput.trim(),
          branch: branchInput.trim(),
          instructions: instructionsInput.trim(),
          isActive: isBankActive
        };
        StorageService.updateSchoolBankAccount(updated);
      }
    } else {
      const newAcc: SchoolBankAccount = {
        id: `bank-acc-${Date.now()}`,
        schoolId: school.id,
        bankName: bankNameInput,
        accountNumber: accountNumberInput.trim(),
        accountHolder: accountHolderInput.trim() || school.name,
        branch: branchInput.trim(),
        instructions: instructionsInput.trim(),
        isActive: isBankActive,
        postedBy:
          currentUser?.name ||
          (currentLang === 'om'
            ? 'Adde Salaamaawit Abarraa (Qabduu Maallaqaa)'
            : currentLang === 'en'
            ? 'Ms. Selamawit Abera (Cashier)'
            : 'ወ/ሮ ሰላማዊት አበራ (ዋና ገንዘብ ያዥ / ሒሳብ ሹም)'),
        postedAt: new Date().toISOString().split('T')[0]
      };
      StorageService.addSchoolBankAccount(newAcc);
    }

    setBankAccounts(StorageService.getSchoolBankAccounts(school.id));
    setShowBankModal(false);
    setEditingBankId(null);
    setAccountNumberInput('');
    setToastMessage(
      currentLang === 'om'
        ? 'Herregni baankii mana barumsaa milkaa’inaan maxxanfameera!'
        : currentLang === 'en'
        ? 'School bank account posted successfully!'
        : 'የትምህርት ቤቱ የባንክ አካውንት በተሳካ ሁኔታ ተለጥፏል!'
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Delete Bank Account
  const handleDeleteBankAccount = (id: string) => {
    StorageService.deleteSchoolBankAccount(id);
    setBankAccounts(StorageService.getSchoolBankAccounts(school.id));
    setConfirmDeleteBankId(null);
    setToastMessage(
      currentLang === 'om'
        ? 'Herregni baankii haqameera'
        : currentLang === 'en'
        ? 'Bank account deleted'
        : 'የባንክ አካውንቱ ተሰርዟል'
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Bank Active
  const handleToggleBankActive = (acc: SchoolBankAccount) => {
    StorageService.updateSchoolBankAccount({ ...acc, isActive: !acc.isActive });
    setBankAccounts(StorageService.getSchoolBankAccounts(school.id));
  };

  // Open Edit Bank
  const handleOpenEditBank = (acc: SchoolBankAccount) => {
    setEditingBankId(acc.id);
    setBankNameInput(acc.bankName);
    setAccountNumberInput(acc.accountNumber);
    setAccountHolderInput(acc.accountHolder);
    setBranchInput(acc.branch || '');
    setInstructionsInput(acc.instructions || '');
    setIsBankActive(acc.isActive);
    setShowBankModal(true);
  };

  // Add Expense Action
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim()) return;

    const newExpense: SchoolExpenseRecord = {
      id: `exp-${Date.now()}`,
      schoolId: school.id,
      title: expenseTitle.trim(),
      category: expenseCategory,
      amount: Number(expenseAmount),
      date: new Date().toISOString().split('T')[0],
      approvedBy: expenseApprovedBy,
      paidTo:
        expensePaidTo ||
        (currentLang === 'om' ? 'Dhaabbata Dhiyeessaa' : currentLang === 'en' ? 'Supplier' : 'አቅራቢ ድርጅት'),
      recordedBy:
        currentUser?.name ||
        (currentLang === 'om'
          ? 'Adde Salaamaawit Abarraa (Qabduu Maallaqaa)'
          : currentLang === 'en'
          ? 'Ms. Selamawit Abera (Cashier)'
          : 'ወ/ሮ ሰላማዊት አበራ (ሒሳብ ሹም)'),
      receiptDocNumber: `EXP-REC-${Date.now().toString().slice(-4)}`,
      notes: expenseNotes
    };

    StorageService.addExpense(newExpense);
    setExpenses(StorageService.getExpenses(school.id));
    setShowExpenseModal(false);
    setExpenseTitle('');
    setExpensePaidTo('');
    setExpenseNotes('');
  };

  // Copy Bank Account Number
  const handleCopyAccount = (num: string, id: string) => {
    navigator.clipboard.writeText(num);
    setCopiedBankId(id);
    setTimeout(() => setCopiedBankId(null), 2500);
  };

  // If the logged-in user is a student or parent, show the direct Annual Fee Desk & bank accounts view!
  if (isStudentOrParent && selectedStudentForAnnual) {
    return (
      <div className="space-y-6">
        <StudentAnnualFeeDesk
          student={selectedStudentForAnnual}
          school={school}
          currentLang={currentLang}
          currentUser={currentUser}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-100" />
            <p className="font-bold text-sm">{toastMessage}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-emerald-700 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/80 border border-emerald-400/40 rounded-full text-xs font-semibold text-emerald-200">
              <DollarSign className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {currentLang === 'om'
                  ? "Faayinaansii Mana Barumsaa, Gabatee Kaffaltii Ji'aa fi Mirkaneessa Nagahee"
                  : currentLang === 'en'
                  ? 'School Finance, Monthly Fee Schedule & Receipt Verification'
                  : 'የትምህርት ቤት ፋይናንስ፣ የወር ክፍያ ሰንጠረዥ እና ደረሰኝ ማረጋገጫ'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {currentLang === 'om'
                ? 'Kutaa Herregaa fi Bulchiinsa Kaffaltii (Finance & Cashier Hub)'
                : currentLang === 'en'
                ? 'Finance & Cashier Management Hub'
                : 'የሒሳብ ክፍል እና ክፍያ አስተዳደር (Finance & Cashier Hub)'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {currentLang === 'om'
                ? 'Wiirtuu herrega baankii mana barumsaa barattootaa fi maatiif maxxansuu, nagaheewwan ergaman mirkaneessuu fi gabatee kaffaltii waggaa ji’oota 10 (Magariisa/Diimaa) to’achuu.'
                : currentLang === 'en'
                ? 'Central hub to post official school bank accounts for students and parents, verify submitted receipts, and monitor the 10-month annual fee schedule (Green/Red).'
                : 'የትምህርት ቤቱን ይፋዊ የባንክ አካውንቶች ለተማሪዎችና ወላጆች የመለጠፍ፣ የተላኩ ደረሰኞችን የማረጋገጥ፣ እና የ10 ወራት ዓመታዊ የክፍያ ሰንጠረዥ (አረንጓዴ/ቀይ) የመቆጣጠሪያ ማዕከል'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isBureauRole ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setEditingBankId(null);
                    setAccountNumberInput('');
                    setShowBankModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-transform hover:scale-102 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>
                    {currentLang === 'om'
                      ? '+ Herrega Baankii Haaraa Maxxansi'
                      : currentLang === 'en'
                      ? '+ Post New Bank Account'
                      : '+ አዲስ የባንክ አካውንት ለጥፍ'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCollectModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>
                    {currentLang === 'om'
                      ? 'Kaffaltii Fuudhi / Nagahee Kuti'
                      : currentLang === 'en'
                      ? 'Collect Fee / Issue Receipt'
                      : 'ክፍያ ተቀበል / ደረሰኝ ቁረጥ'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowExpenseModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-700/80 hover:bg-rose-700 text-white text-xs font-bold rounded-xl border border-rose-500/40 transition-colors cursor-pointer"
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>
                    {currentLang === 'om' ? 'Baasii Galmeessi' : currentLang === 'en' ? 'Record Expense' : 'ወጪ መዝግብ'}
                  </span>
                </button>
              </>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-amber-500/20 text-amber-200 border border-amber-400/40 rounded-xl text-xs font-bold">
                <Lock className="w-4 h-4 text-amber-300" />
                <span>
                  {currentLang === 'om'
                    ? 'Ilaalcha Biiroo Barnootaa (Ilaaluu Qofa)'
                    : currentLang === 'en'
                    ? 'Education Bureau View (Read-Only)'
                    : 'የትምህርት ቢሮ እይታ (ማየት ብቻ - Read-Only)'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">
              {currentLang === 'om'
                ? 'Galii Waliigalaa Sassaabame'
                : currentLang === 'en'
                ? 'Total Collected Revenue'
                : 'ጠቅላላ የተሰበሰበ ገቢ (Revenue)'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-700 font-mono">
                {totalRevenue.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-600">ETB</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
              {verifiedReceipts.length}{' '}
              {currentLang === 'om'
                ? 'nagaheewwan mirkanaa’an'
                : currentLang === 'en'
                ? 'verified receipts'
                : 'የተረጋገጡ ደረሰኞች'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">
              {currentLang === 'om'
                ? 'Nagaheewwan Mirkaneessa Eegan'
                : currentLang === 'en'
                ? 'Pending Receipts'
                : 'በማረጋገጥ ላይ ያሉ ደረሰኞች (Pending)'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-600 font-mono">
                {pendingReceipts.length}
              </span>
              <span className="text-xs font-bold text-slate-600">
                {currentLang === 'om' ? 'nagahee' : currentLang === 'en' ? 'receipts' : 'ደረሰኞች'}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('receipts_queue')}
              className="text-[11px] text-amber-700 font-bold hover:underline mt-1 block cursor-pointer"
            >
              {currentLang === 'om'
                ? 'Amma Mirkaneessi →'
                : currentLang === 'en'
                ? 'Verify Now →'
                : 'አሁን አረጋግጥ →'}
            </button>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">
              {currentLang === 'om'
                ? 'Herregota Baankii Maxxanfaman'
                : currentLang === 'en'
                ? 'Posted Bank Accounts'
                : 'የተለጠፉ የባንክ አካውንቶች (Accounts)'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-indigo-700 font-mono">
                {bankAccounts.filter((b) => b.isActive).length}
              </span>
              <span className="text-xs font-bold text-slate-600">
                {currentLang === 'om'
                  ? 'herrega idilee'
                  : currentLang === 'en'
                  ? 'official accounts'
                  : 'ይፋዊ አካውንቶች'}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('bank_accounts')}
              className="text-[11px] text-indigo-600 font-semibold hover:underline mt-1 block cursor-pointer"
            >
              {currentLang === 'om'
                ? 'Herregota Bulchi →'
                : currentLang === 'en'
                ? 'Manage Accounts →'
                : 'አካውንቶችን አስተዳድር →'}
            </button>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">
              {currentLang === 'om'
                ? 'Baasii Bulchiinsaa Waliigalaa'
                : currentLang === 'en'
                ? 'Total Operational Expenses'
                : 'አጠቃላይ አስተዳደራዊ ወጪ (Expenses)'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-rose-700 font-mono">
                {totalExpense.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-600">ETB</span>
            </div>
            <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
              {currentLang === 'om'
                ? `Haftee Kaaznaa: ${netBalance.toLocaleString()} ETB`
                : currentLang === 'en'
                ? `Net Balance: ${netBalance.toLocaleString()} ETB`
                : `ቀሪ ካዝና፡ ${netBalance.toLocaleString()} ብር`}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200 shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sub Tabs navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white p-2 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('fees')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'fees'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>
            {currentLang === 'om'
              ? `Kaffaltii Ji'aa fi Nagahee (${payments.length})`
              : currentLang === 'en'
              ? `Monthly Fees & Receipts (${payments.length})`
              : `የወር ክፍያዎችና ደረሰኞች (${payments.length})`}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('receipts_queue')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 relative cursor-pointer ${
            activeTab === 'receipts_queue'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>
            {currentLang === 'om'
              ? 'Nagaheewwan Barattoota/Maatii Irraa Ergamani'
              : currentLang === 'en'
              ? 'Submitted Receipts Queue'
              : 'ከተማሪዎች/ወላጆች የተላኩ ደረሰኞች'}
          </span>
          {pendingReceipts.length > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded-full animate-pulse">
              {pendingReceipts.length}{' '}
              {currentLang === 'om' ? 'Haaraa' : currentLang === 'en' ? 'New' : 'አዲስ'}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bank_accounts')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'bank_accounts'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>
            {currentLang === 'om'
              ? `Herregota Baankii Idilee (${bankAccounts.length})`
              : currentLang === 'en'
              ? `School Official Bank Accounts (${bankAccounts.length})`
              : `የት/ቤቱ ይፋዊ የባንክ አካውንቶች (${bankAccounts.length})`}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('annual_matrix')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'annual_matrix'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>
            {currentLang === 'om'
              ? "Gabatee Kaffaltii Waggaa Barattootaa (Ji'a 10)"
              : currentLang === 'en'
              ? 'Annual 10-Month Fee Matrix'
              : 'የተማሪዎች ዓመታዊ የክፍያ ሰንጠረዥ (10 ወራት)'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('expenses')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'expenses'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>
            {currentLang === 'om'
              ? `Baasiiwwan Mana Barumsaa (${expenses.length})`
              : currentLang === 'en'
              ? `School Expenses (${expenses.length})`
              : `የትምህርት ቤት ወጪዎች (${expenses.length})`}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('statement')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'statement'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>
            {currentLang === 'om'
              ? 'Barattoota Hin Kaffallee fi Akeekkachiisa'
              : currentLang === 'en'
              ? 'Unpaid Students & Reminders'
              : 'ያልከፈሉ ተማሪዎችና ማሳሰቢያ'}
          </span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: COLLECTED FEES & RECEIPTS
          ========================================================================= */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {currentLang === 'om'
                  ? "Tarree Kaffaltii Ji'aa Sassaabame"
                  : currentLang === 'en'
                  ? 'Collected Monthly Fees List'
                  : 'የተሰበሰቡ ወርሃዊ ክፍያዎች ዝርዝር'}
              </h3>
              <p className="text-xs text-slate-500">
                {currentLang === 'om'
                  ? 'Nagaheewwan kaffaltii sirna keessatti galmaa’an'
                  : currentLang === 'en'
                  ? 'Fee receipts registered in the system'
                  : 'በሲስተም የተመዘገቡ የክፍያ ደረሰኞች'}
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchStudentQuery}
                onChange={(e) => setSearchStudentQuery(e.target.value)}
                placeholder={
                  currentLang === 'om'
                    ? 'Barataa, maatii ykn nagahee barbaadi...'
                    : currentLang === 'en'
                    ? 'Search student, parent or receipt...'
                    : 'ተማሪ፣ ወላጅ ወይም ደረሰኝ ፈልግ...'
                }
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Lakk. Nagahee' : currentLang === 'en' ? 'Receipt No.' : 'የደረሰኝ ቁጥር'}
                  </th>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Maqaa Barataa' : currentLang === 'en' ? 'Student Name' : 'የተማሪ ስም'}
                  </th>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Kutaa' : currentLang === 'en' ? 'Grade' : 'ክፍል'}
                  </th>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? "Ji'a Kaffaltii" : currentLang === 'en' ? 'Fee Month' : 'የክፍያ ወር'}
                  </th>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Hanga (ETB)' : currentLang === 'en' ? 'Amount (ETB)' : 'መጠን (ETB)'}
                  </th>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Mala Kaffaltii' : currentLang === 'en' ? 'Method' : 'የክፍያ ዘዴ'}
                  </th>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Haala' : currentLang === 'en' ? 'Status' : 'ሁኔታ'}
                  </th>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Guyyaa' : currentLang === 'en' ? 'Date' : 'ቀን'}
                  </th>
                  <th className="py-3 px-3 text-right">
                    {currentLang === 'om' ? 'Tarkaanfii' : currentLang === 'en' ? 'Action' : 'እርምጃ'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => {
                  const isPaid = p.status === 'paid';
                  const isPending = p.status === 'pending';
                  const isRejected = p.status === 'rejected';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {p.receiptNumber}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{p.studentName}</td>
                      <td className="py-3 px-3 text-slate-500">
                        {p.grade} ({p.section})
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">{getMonthDisplay(p.month)}</td>
                      <td className="py-3 px-3 font-bold font-mono text-emerald-800">
                        {p.amount.toLocaleString()}{' '}
                        {currentLang === 'om' ? 'ETB' : currentLang === 'en' ? 'ETB' : 'ብር'}
                      </td>
                      <td className="py-3 px-3 uppercase text-slate-600">
                        {getBankDisplay(p.bankName) !== '-' ? getBankDisplay(p.bankName) : p.paymentMethod}
                      </td>
                      <td className="py-3 px-3">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {currentLang === 'om' ? 'Kaffalameera' : currentLang === 'en' ? 'Paid' : 'ተከፍሏል'}
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                            <Clock className="w-3 h-3 text-amber-600" />
                            {currentLang === 'om' ? 'Mirkaneessarratti' : currentLang === 'en' ? 'Pending' : 'በማረጋገጥ ላይ'}
                          </span>
                        ) : isRejected ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            {currentLang === 'om' ? 'Kufaa Ta’e' : currentLang === 'en' ? 'Rejected' : 'ውድቅ የተደረገ'}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">
                            {currentLang === 'om' ? 'Hin Kaffalamne' : currentLang === 'en' ? 'Unpaid' : 'ያልተከፈለ'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-500">{p.paymentDate}</td>
                      <td className="py-3 px-3 text-right">
                        {isPaid ? (
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>
                              {currentLang === 'om' ? 'Nagahee Ilaali' : currentLang === 'en' ? 'View Receipt' : 'ደረሰኝ እይ'}
                            </span>
                          </button>
                        ) : isPending ? (
                          <button
                            type="button"
                            onClick={() => setPreviewReceiptPayment(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white hover:bg-amber-600 rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>
                              {currentLang === 'om' ? 'Mirkaneessi' : currentLang === 'en' ? 'Verify' : 'አረጋግጥ'}
                            </span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt(p)}
                            className="text-xs text-slate-500 hover:underline cursor-pointer"
                          >
                            {currentLang === 'om' ? 'Bal’ina' : currentLang === 'en' ? 'Details' : 'ዝርዝር'}
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
      )}

      {/* =========================================================================
          TAB 2: SUBMITTED RECEIPTS QUEUE
          ========================================================================= */}
      {activeTab === 'receipts_queue' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {currentLang === 'om'
                    ? 'Mirkaneessa Nagaheewwan Barattootaa fi Maatii Irraa Ergamani'
                    : currentLang === 'en'
                    ? 'Submitted Receipts Verification Queue'
                    : 'ከተማሪዎችና ወላጆች የተላኩ ደረሰኞች ማረጋገጫ (Receipt Verification Queue)'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentLang === 'om'
                  ? 'Nagaheewwan barattoonni fi maatiin maxxaansanii ergan asitti dhufu. Erga mirkaneessitanii "Mirkaneessi" cuqaastanii gabateen kaffaltii barataa battalumatti gara magariisaatti jijjiirama.'
                  : currentLang === 'en'
                  ? 'Receipts attached by students and parents appear here. Once you verify and click "Approve", the student schedule immediately turns green.'
                  : 'ተማሪዎችና ወላጆች የከፈሉበትን ደረሰኝ አያይዘው የላኩት እዚህ ይደርሳል። ካረጋገጡ በኋላ «አጽድቅ» ሲጫኑ የተማሪው የወር ክፍያ ሰንጠረዥ ወዲያውኑ አረንጓዴ ይሆናል።'}
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 font-extrabold text-xs rounded-full border border-amber-300">
              {pendingReceipts.length}{' '}
              {currentLang === 'om'
                ? 'nagahee mirkaneessa eegaa jira'
                : currentLang === 'en'
                ? 'receipts pending verification'
                : 'ደረሰኞች በማረጋገጥ ላይ'}
            </span>
          </div>

          {pendingReceipts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500/50" />
              <p className="text-sm font-bold text-slate-600">
                {currentLang === 'om'
                  ? 'Nagaheen haaraan hin mirkanoofne hin jiru!'
                  : currentLang === 'en'
                  ? 'No pending unverified receipts!'
                  : 'ምንም አዲስ ያልተረጋገጠ ደረሰኝ የለም!'}
              </p>
              <p className="text-xs text-slate-400">
                {currentLang === 'om'
                  ? 'Yeroo barattoonni fi maatiin poortaala isaanii irraa nagahee maxxaansan battalumatti asitti mul’ata.'
                  : currentLang === 'en'
                  ? 'When students and parents attach receipts from their portal, they appear here immediately.'
                  : 'ተማሪዎችና ወላጆች በፖርታላቸው ደረሰኝ ሲያያይዙ ወዲያውኑ እዚህ ይታያል።'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingReceipts.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-2xl border-2 border-amber-300 bg-amber-50/40 p-5 space-y-3 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-200 text-amber-900 rounded-md">
                        {getMonthDisplay(rec.month)}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 mt-1">
                        {rec.studentName}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {currentLang === 'om'
                          ? `Kutaa ${rec.grade} (${rec.section}) · Maatii: ${rec.parentName}`
                          : currentLang === 'en'
                          ? `Grade ${rec.grade} (${rec.section}) · Parent: ${rec.parentName}`
                          : `ክፍል ${rec.grade} (${rec.section}) · ወላጅ: ${rec.parentName}`}
                      </p>
                    </div>
                    <span className="text-lg font-black font-mono text-emerald-800">
                      {rec.amount} ETB
                    </span>
                  </div>

                  {/* Attached receipt photo preview */}
                  {rec.receiptImageUrl ? (
                    <div
                      onClick={() => setPreviewReceiptPayment(rec)}
                      className="border border-slate-300 rounded-xl overflow-hidden bg-white max-h-40 cursor-pointer group relative"
                    >
                      <img
                        src={rec.receiptImageUrl}
                        alt="Attached receipt"
                        className="w-full h-36 object-contain p-1 group-hover:scale-105 transition"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                        <Eye className="w-4 h-4" />
                        <span>
                          {currentLang === 'om'
                            ? 'Suuraa Guutuu Ilaali'
                            : currentLang === 'en'
                            ? 'View Full Image'
                            : 'ሙሉ ፎቶ እይ'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-white/70 rounded-xl border border-slate-200 text-xs text-slate-400 text-center italic">
                      {currentLang === 'om'
                        ? 'Suuraan hin maxxaansamne (Lakkoofsa daldalaa qofa)'
                        : currentLang === 'en'
                        ? 'No photo attached (Transaction ref only)'
                        : 'ፎቶ አልተያያዘም (የግብይት ቁጥር ብቻ)'}
                    </div>
                  )}

                  <div className="space-y-1 text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                    <p>
                      <strong>
                        {currentLang === 'om' ? 'Baankii:' : currentLang === 'en' ? 'Bank:' : 'ባንክ፡'}
                      </strong>{' '}
                      {getBankDisplay(rec.bankName) !== '-' ? getBankDisplay(rec.bankName) : rec.paymentMethod}
                    </p>
                    <p className="font-mono">
                      <strong>
                        {currentLang === 'om'
                          ? 'Lakkoofsa Daldalaa (Ref):'
                          : currentLang === 'en'
                          ? 'Transaction Ref:'
                          : 'የግብይት ቁጥር (Ref):'}
                      </strong>{' '}
                      {rec.transactionRef ||
                        (currentLang === 'om' ? 'Hin ibsamne' : currentLang === 'en' ? 'Not specified' : 'አልተጠቀሰም')}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {currentLang === 'om'
                        ? 'Guyyaa ergame: '
                        : currentLang === 'en'
                        ? 'Submitted on: '
                        : 'የተላከበት ቀን፡ '}
                      {rec.submittedAt?.split('T')[0] || rec.paymentDate}
                    </p>
                    {rec.notes && (
                      <p className="text-[11px] text-slate-500 italic">
                        {currentLang === 'om' ? 'Yaadannoo: ' : currentLang === 'en' ? 'Notes: ' : 'ማስታወሻ: '}
                        {rec.notes}
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleApproveReceipt(rec)}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>
                        {currentLang === 'om'
                          ? 'Mirkaneessi & Nagahee Kuti'
                          : currentLang === 'en'
                          ? 'Approve & Issue Receipt'
                          : 'አጽድቅና ቁረጥ'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRejectionModalPayment(rec);
                        setRejectionReasonText('');
                      }}
                      className="py-2 px-3 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>
                        {currentLang === 'om' ? 'Kuffisi' : currentLang === 'en' ? 'Reject' : 'ውድቅ አድርግ'}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: SCHOOL OFFICIAL BANK ACCOUNTS
          ========================================================================= */}
      {activeTab === 'bank_accounts' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {currentLang === 'om'
                    ? "Bulchaa Herregota Baankii Idilee Mana Barumsaa (Cashier's Bank Accounts)"
                    : currentLang === 'en'
                    ? "Cashier's Official Bank Accounts Manager"
                    : "የትምህርት ቤቱ ይፋዊ የባንክ አካውንቶች ማኔጀር (Cashier's Official Bank Accounts)"}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentLang === 'om'
                  ? 'Herregni asitti maxxanfaman kallattiin fuula barataa fi maatii irratti mul’atu. Maatiin herrega kanaatti kaffalanii nagahee maxxaansu.'
                  : currentLang === 'en'
                  ? 'Accounts posted here appear directly on the Student & Parent portals. Parents pay to these accounts and attach receipts.'
                  : 'እዚህ የተለጠፉት አካውንቶች በቀጥታ በተማሪውና በወላጅ ገፅ ላይ ይታያሉ። ወላጆች ወደ እነዚህ አካውንቶች ከፍለው ደረሰኝ ያያይዛሉ።'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingBankId(null);
                setAccountNumberInput('');
                setBankNameInput('የኢትዮጵያ ንግድ ባንክ (CBE)');
                setShowBankModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>
                {currentLang === 'om'
                  ? '+ Herrega Baankii Haaraa Maxxansi'
                  : currentLang === 'en'
                  ? '+ Post New Bank Account'
                  : '+ አዲስ የባንክ አካውንት ለጥፍ'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bankAccounts.map((acc) => {
              const isCopied = copiedBankId === acc.id;
              return (
                <div
                  key={acc.id}
                  className={`rounded-2xl p-5 border-2 transition ${
                    acc.isActive ? 'border-slate-300 bg-white' : 'border-slate-200 bg-slate-50 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-black uppercase text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      {getBankDisplay(acc.bankName)}
                    </span>
                    <button
                      onClick={() => handleToggleBankActive(acc)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                        acc.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {acc.isActive
                        ? currentLang === 'om'
                          ? 'Idilee / Ni Mul’ata'
                          : currentLang === 'en'
                          ? 'Active / Visible'
                          : 'ይፋዊ / ይታያል'
                        : currentLang === 'om'
                        ? 'Cufaa'
                        : currentLang === 'en'
                        ? 'Closed'
                        : 'የተዘጋ'}
                    </button>
                  </div>

                  <div className="my-3 space-y-1">
                    <p className="text-[11px] text-slate-400 font-medium">
                      {currentLang === 'om'
                        ? 'Lakkoofsa Herregaa:'
                        : currentLang === 'en'
                        ? 'Account Number:'
                        : 'የሂሳብ ቁጥር፡'}
                    </p>
                    <div className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <span className="font-mono font-black text-slate-900 text-sm select-all">
                        {acc.accountNumber}
                      </span>
                      <button
                        onClick={() => handleCopyAccount(acc.accountNumber, acc.id)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-600 text-xs cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 mb-4">
                    <p className="font-semibold text-slate-800">{acc.accountHolder}</p>
                    {acc.branch && (
                      <p className="text-[11px] text-slate-400">
                        {currentLang === 'om' ? 'Damee: ' : currentLang === 'en' ? 'Branch: ' : 'ቅርንጫፍ፡ '}
                        {acc.branch}
                      </p>
                    )}
                    {acc.instructions && (
                      <p className="text-[11px] text-slate-500 italic">"{acc.instructions}"</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">{acc.postedBy}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditBank(acc)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                        title={currentLang === 'om' ? 'Gulaali' : currentLang === 'en' ? 'Edit' : 'አስተካክል'}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {confirmDeleteBankId === acc.id ? (
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDeleteBankAccount(acc.id)}
                            className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                          >
                            {currentLang === 'om' ? 'Mirkaneessi' : currentLang === 'en' ? 'Confirm' : 'አረጋግጥ'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteBankId(null)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg cursor-pointer"
                          >
                            {currentLang === 'om' ? 'Dhiisi' : currentLang === 'en' ? 'Cancel' : 'ተወው'}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteBankId(acc.id)}
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 cursor-pointer"
                          title={currentLang === 'om' ? 'Haqi' : currentLang === 'en' ? 'Delete' : 'ሰርዝ'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: ANNUAL 10-MONTH FEE SCHEDULE MATRIX
          ========================================================================= */}
      {activeTab === 'annual_matrix' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                {currentLang === 'om'
                  ? "Maatriiksii Gabatee Kaffaltii Waggaa (Ji'oota 10)"
                  : currentLang === 'en'
                  ? 'Annual 10-Month Fee Matrix'
                  : 'የተማሪዎች የ10 ወራት ዓመታዊ የክፍያ ሰንጠረዥ ማትሪክስ (Annual 10-Month Matrix)'}
              </h3>
              <p className="text-xs text-slate-500">
                {currentLang === 'om'
                  ? "Haala kaffaltii ji'oota 10 barataa tokkoon tokkoon gabatee irratti ilaalaa. Magariisa (Kaffalameera), Diimaa (Ji'i seenee hin kaffalamne)."
                  : currentLang === 'en'
                  ? 'Inspect each student 10-month payment status on the matrix. Green (Paid), Red (Due & Unpaid).'
                  : 'የእያንዳንዱን ተማሪ የ10ሩም ወራት ክፍያ ሁኔታ በሰንጠረዡ ላይ ይመልከቱ። አረንጓዴ (ተከፍሏል)፣ ቀይ (ወሩ ገብቶ ያልተከፈለ)።'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />{' '}
                  {currentLang === 'om'
                    ? 'Kaffalameera (Magariisa)'
                    : currentLang === 'en'
                    ? 'Paid (Green)'
                    : 'ተከፍሏል (አረንጓዴ)'}
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-rose-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />{' '}
                  {currentLang === 'om'
                    ? 'Hin Kaffalamne (Diimaa)'
                    : currentLang === 'en'
                    ? 'Unpaid (Red)'
                    : 'ያልተከፈለ (ቀይ)'}
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Barataa' : currentLang === 'en' ? 'Student' : 'ተማሪ'}
                  </th>
                  <th className="py-3 px-2">
                    {currentLang === 'om' ? 'Kutaa' : currentLang === 'en' ? 'Grade' : 'ክፍል'}
                  </th>
                  {ETHIOPIAN_ACADEMIC_MONTHS.map((m) => (
                    <th key={m.key} className="py-3 px-2 text-center whitespace-nowrap">
                      {currentLang === 'om' ? m.labelOm || m.key : currentLang === 'en' ? m.labelEn || m.key : m.key}
                    </th>
                  ))}
                  <th className="py-3 px-3 text-right">
                    {currentLang === 'om'
                      ? 'Kan Kaffalame / Waliigala'
                      : currentLang === 'en'
                      ? 'Paid / Total'
                      : 'የተከፈለው / ጠቅላላ'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((stu) => {
                  const studentPayments = payments.filter((p) => p.studentId === stu.id);
                  const paidCount = ETHIOPIAN_ACADEMIC_MONTHS.filter((m) =>
                    studentPayments.some(
                      (p) => p.status === 'paid' && p.month.toLowerCase().includes(m.key.toLowerCase())
                    )
                  ).length;

                  return (
                    <tr
                      key={stu.id}
                      onClick={() => setSelectedStudentForAnnual(stu)}
                      className="hover:bg-slate-50 transition cursor-pointer"
                    >
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {stu.fullName}
                      </td>
                      <td className="py-2.5 px-2 text-slate-500 font-mono">
                        {stu.grade}{stu.section}
                      </td>
                      {ETHIOPIAN_ACADEMIC_MONTHS.map((m) => {
                        const rec = studentPayments.find((p) =>
                          p.month.toLowerCase().includes(m.key.toLowerCase())
                        );
                        const isPaid = rec?.status === 'paid';
                        const isPending = rec?.status === 'pending';
                        const isOverdue = !isPaid && !isPending && m.order <= CURRENT_ACTIVE_MONTH_ORDER;

                        return (
                          <td key={m.key} className="py-2.5 px-1 text-center">
                            {isPaid ? (
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-xs">
                                ✓ {currentLang === 'om' ? 'Kaffalame' : currentLang === 'en' ? 'Paid' : 'ተከፍሏል'}
                              </span>
                            ) : isPending ? (
                              <span className="inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-slate-900">
                                {currentLang === 'om' ? 'Eegamaa' : currentLang === 'en' ? 'Pending' : 'በማረጋገጥ ላይ'}
                              </span>
                            ) : isOverdue ? (
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-xs">
                                ✕ {currentLang === 'om' ? 'Hin Kaffalle' : currentLang === 'en' ? 'Unpaid' : 'ያልተከፈለ'}
                              </span>
                            ) : (
                              <span className="inline-block px-1.5 py-0.5 rounded-full text-[9px] text-slate-400 bg-slate-100">
                                {currentLang === 'om' ? 'Hin Geenyee' : currentLang === 'en' ? 'Upcoming' : 'ገና ነው'}
                              </span>
                            )}
                          </td>
                        );
                      })}
                      <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                        {paidCount} / 10 {currentLang === 'om' ? "Ji'a" : currentLang === 'en' ? 'Mo' : 'ወር'} ({paidCount * 850}{' '}
                        {currentLang === 'om' || currentLang === 'en' ? 'ETB' : 'ብር'})
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* If a student is clicked in matrix, show their full individual schedule desk */}
          {selectedStudentForAnnual && (
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-base text-slate-900">
                  {currentLang === 'om'
                    ? `Gabatee Kaffaltii Waggaa Dhuunfaa fi Nagahee Barataa ${selectedStudentForAnnual.fullName}`
                    : currentLang === 'en'
                    ? `Individual Annual Fee Schedule & Receipts for ${selectedStudentForAnnual.fullName}`
                    : `የተማሪ ${selectedStudentForAnnual.fullName} የግል ዓመታዊ የክፍያ ሰንጠረዥና ደረሰኝ`}
                </h4>
                <button
                  onClick={() => setSelectedStudentForAnnual(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  {currentLang === 'om' ? 'Cufi' : currentLang === 'en' ? 'Close' : 'ዝጋ'}
                </button>
              </div>
              <StudentAnnualFeeDesk
                student={selectedStudentForAnnual}
                school={school}
                currentLang={currentLang}
                currentUser={currentUser}
              />
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 5: OPERATIONAL EXPENSES
          ========================================================================= */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {currentLang === 'om'
                  ? 'Baasiiwwan Bulchiinsa Mana Barumsaa'
                  : currentLang === 'en'
                  ? 'School Operational Expenses'
                  : 'የትምህርት ቤት አስተዳደራዊ ወጪዎች'}
              </h3>
              <p className="text-xs text-slate-500">
                {currentLang === 'om'
                  ? 'Baasiiwwan meeshaalee, suphaa fi tajaajilaaf bahan'
                  : currentLang === 'en'
                  ? 'Expenses for supplies, maintenance, and services'
                  : 'ለዕቃዎች፣ ለጥገና እና ለአገልግሎቶች የወጡ ወጪዎች'}
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {currentLang === 'om'
                ? 'Baasii Waliigalaa: '
                : currentLang === 'en'
                ? 'Total Expenses: '
                : 'ጠቅላላ ወጪ፡ '}
              <strong className="text-rose-700">{totalExpense.toLocaleString()} ETB</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Mata-duree Baasii' : currentLang === 'en' ? 'Expense Title' : 'የወጪ ርዕስ'}
                  </th>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Ramaddii' : currentLang === 'en' ? 'Category' : 'ምድብ'}
                  </th>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Hanga (ETB)' : currentLang === 'en' ? 'Amount (ETB)' : 'መጠን (ETB)'}
                  </th>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Kan Kaffalameef' : currentLang === 'en' ? 'Paid To' : 'የተከፈለለት'}
                  </th>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Kan Mirkaneesse' : currentLang === 'en' ? 'Approved By' : 'ያጸደቀው'}
                  </th>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Guyyaa' : currentLang === 'en' ? 'Date' : 'ቀን'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900">{e.title}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-mono text-[10px]">
                        {e.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold font-mono text-rose-700">
                      {e.amount.toLocaleString()}{' '}
                      {currentLang === 'om' || currentLang === 'en' ? 'ETB' : 'ብር'}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{e.paidTo}</td>
                    <td className="py-3 px-3 text-slate-600">{e.approvedBy}</td>
                    <td className="py-3 px-3 text-slate-500">{e.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: OVERDUE NOTICES
          ========================================================================= */}
      {activeTab === 'statement' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {currentLang === 'om'
                ? 'Barattoota Hin Kaffallee fi Akeekkachiisa Maatii'
                : currentLang === 'en'
                ? 'Unpaid Students & Parent Reminders'
                : 'ያልከፈሉ ተማሪዎችና የወላጅ ማሳሰቢያ'}
            </h3>
            <p className="text-xs text-slate-500">
              {currentLang === 'om'
                ? "Tarree barattoota kaffaltii ji'a kanaa hin raawwannee fi ergaa yaadachiisaa maatiif erguu"
                : currentLang === 'en'
                ? 'List of students with overdue fees for the current month and parent reminder dispatch'
                : 'የያዝነውን ወር ክፍያ ያልፈጸሙ ተማሪዎች ዝርዝርና ለወላጅ ማሳሰቢያ መላኪያ'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Maqaa Barataa' : currentLang === 'en' ? 'Student Name' : 'የተማሪ ስም'}
                  </th>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Kutaa' : currentLang === 'en' ? 'Grade' : 'ክፍል'}
                  </th>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Maqaa Maatii' : currentLang === 'en' ? 'Parent Name' : 'የወላጅ ስም'}
                  </th>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Bilbila' : currentLang === 'en' ? 'Phone' : 'ስልክ'}
                  </th>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? "Ji'a Hin Kaffalamne" : currentLang === 'en' ? 'Unpaid Month' : 'ያልተከፈለ ወር'}
                  </th>
                  <th className="py-3 px-3">
                    {currentLang === 'om' ? 'Hanga Hin Kaffalamne' : currentLang === 'en' ? 'Amount Due' : 'ያልተከፈለ መጠን'}
                  </th>
                  <th className="py-3 px-3 text-right">
                    {currentLang === 'om' ? 'Yaadachiisa Ergi' : currentLang === 'en' ? 'Send Reminder' : 'ማሳሰቢያ ላክ'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((stu) => {
                  const hasPaidCurrent = payments.some(
                    (p) =>
                      p.studentId === stu.id &&
                      p.status === 'paid' &&
                      p.month.includes('ኅዳር')
                  );
                  if (hasPaidCurrent) return null;

                  return (
                    <tr key={stu.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 font-semibold text-slate-900">{stu.fullName}</td>
                      <td className="py-3 px-3 text-slate-500">
                        {stu.grade} ({stu.section})
                      </td>
                      <td className="py-3 px-3 text-slate-700">{stu.parentName}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{stu.parentPhone}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md font-bold text-[10px]">
                          {currentLang === 'om'
                            ? 'Sadaasa 2017 (Hin Kaffalamne)'
                            : currentLang === 'en'
                            ? 'Hidar 2017 (Unpaid)'
                            : 'ኅዳር 2017 (ያልተከፈለ)'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-rose-700">
                        850 {currentLang === 'om' || currentLang === 'en' ? 'ETB' : 'ብር'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setReminderSentId(stu.id);
                            setTimeout(() => setReminderSentId(null), 3000);
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ml-auto cursor-pointer ${
                            reminderSentId === stu.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {reminderSentId === stu.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>
                                {currentLang === 'om' ? 'Ergameera!' : currentLang === 'en' ? 'Sent!' : 'ተልኳል!'}
                              </span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>
                                {currentLang === 'om'
                                  ? 'Yaadachiisa Ergi'
                                  : currentLang === 'en'
                                  ? 'Send Reminder'
                                  : 'ማሳሰቢያ ላክ'}
                              </span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT BANK ACCOUNT
          ========================================================================= */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">
                  {editingBankId
                    ? currentLang === 'om'
                      ? 'Gulaala Herrega Baankii'
                      : currentLang === 'en'
                      ? 'Edit Bank Account'
                      : 'የባንክ አካውንት ማስተካከያ'
                    : currentLang === 'om'
                    ? 'Herrega Baankii Idilee Haaraa Maxxansi'
                    : currentLang === 'en'
                    ? 'Post New Official Bank Account'
                    : 'አዲስ ይፋዊ የባንክ አካውንት ለጥፍ'}
                </h3>
              </div>
              <button
                onClick={() => setShowBankModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBankAccount} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLang === 'om'
                    ? 'Maqaa Baankii (Bank Name) *'
                    : currentLang === 'en'
                    ? 'Bank Name *'
                    : 'የባንኩ ስም (Bank Name) *'}
                </label>
                <select
                  value={bankNameInput}
                  onChange={(e) => setBankNameInput(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                >
                  <option value="የኢትዮጵያ ንግድ ባንክ (CBE)">
                    {getBankDisplay('የኢትዮጵያ ንግድ ባንክ (CBE)')}
                  </option>
                  <option value="ቴሌብር (Telebirr)">{getBankDisplay('ቴሌብር (Telebirr)')}</option>
                  <option value="አዋሽ ባንክ (Awash Bank)">{getBankDisplay('አዋሽ ባንክ (Awash Bank)')}</option>
                  <option value="ዳሽን ባንክ (Dashen Bank)">{getBankDisplay('ዳሽን ባንክ (Dashen Bank)')}</option>
                  <option value="ወጋገን ባንክ (Wegagen Bank)">{getBankDisplay('ወጋገን ባንክ (Wegagen Bank)')}</option>
                  <option value="ሕብረት ባንክ (Hibret Bank)">{getBankDisplay('ሕብረት ባንክ (Hibret Bank)')}</option>
                  <option value="ኦሮሚያ ባንክ (Oromia Bank)">{getBankDisplay('ኦሮሚያ ባንክ (Oromia Bank)')}</option>
                  <option value="አቢሲንያ ባንክ (Bank of Abyssinia)">
                    {getBankDisplay('አቢሲንያ ባንክ (Bank of Abyssinia)')}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLang === 'om'
                    ? 'Lakkoofsa Herregaa / Account Number *'
                    : currentLang === 'en'
                    ? 'Account Number *'
                    : 'የሂሳብ ቁጥር / አካውንት ቁጥር *'}
                </label>
                <input
                  type="text"
                  value={accountNumberInput}
                  onChange={(e) => setAccountNumberInput(e.target.value)}
                  placeholder={
                    currentLang === 'om'
                      ? 'Fkn: 1000123456789'
                      : currentLang === 'en'
                      ? 'e.g., 1000123456789'
                      : 'ለምሳሌ፡ 1000123456789'
                  }
                  className="w-full p-2.5 font-mono font-bold bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLang === 'om'
                    ? 'Maqaa Abbaa Herregaa (Account Holder) *'
                    : currentLang === 'en'
                    ? 'Account Holder Name *'
                    : 'የአካውንቱ ስም (Account Holder) *'}
                </label>
                <input
                  type="text"
                  value={accountHolderInput}
                  onChange={(e) => setAccountHolderInput(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Damee' : currentLang === 'en' ? 'Branch' : 'ቅርንጫፍ'}
                  </label>
                  <input
                    type="text"
                    value={branchInput}
                    onChange={(e) => setBranchInput(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Haala' : currentLang === 'en' ? 'Status' : 'ሁኔታ'}
                  </label>
                  <select
                    value={isBankActive ? 'active' : 'inactive'}
                    onChange={(e) => setIsBankActive(e.target.value === 'active')}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="active">
                      {currentLang === 'om'
                        ? 'Idilee / Ni Mul’ata'
                        : currentLang === 'en'
                        ? 'Active / Visible'
                        : 'ይፋዊ / ይታያል'}
                    </option>
                    <option value="inactive">
                      {currentLang === 'om' ? 'Cufaa dha' : currentLang === 'en' ? 'Closed' : 'ዝግ ነው'}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLang === 'om'
                    ? 'Qajeelfama Barattootaa fi Maatiif (Instructions)'
                    : currentLang === 'en'
                    ? 'Instructions for Students & Parents'
                    : 'ለተማሪዎችና ወላጆች መመሪያ (Instructions)'}
                </label>
                <textarea
                  value={instructionsInput}
                  onChange={(e) => setInstructionsInput(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBankModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  {currentLang === 'om' ? 'Haqi' : currentLang === 'en' ? 'Cancel' : 'ሰርዝ'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {editingBankId
                    ? currentLang === 'om'
                      ? 'Haaromsi'
                      : currentLang === 'en'
                      ? 'Update'
                      : 'አዘምን'
                    : currentLang === 'om'
                    ? 'Maxxansi'
                    : currentLang === 'en'
                    ? 'Post Account'
                    : 'ለጥፍ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: PREVIEW ATTACHED RECEIPT FOR APPROVAL
          ========================================================================= */}
      {previewReceiptPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-slate-900">
                  {currentLang === 'om'
                    ? 'Mirkaneessa Nagahee Maxxaansame (Verify Submitted Receipt)'
                    : currentLang === 'en'
                    ? 'Verify Submitted Receipt'
                    : 'የተያያዘ ደረሰኝ ማረጋገጫ (Verify Submitted Receipt)'}
                </h3>
              </div>
              <button
                onClick={() => setPreviewReceiptPayment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {currentLang === 'om' ? 'Barataa:' : currentLang === 'en' ? 'Student:' : 'ተማሪ፡'}
                  </span>
                  <span className="font-bold text-slate-900">{previewReceiptPayment.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {currentLang === 'om' ? 'Kutaa:' : currentLang === 'en' ? 'Grade:' : 'ክፍል፡'}
                  </span>
                  <span className="font-bold text-slate-900">
                    {previewReceiptPayment.grade} ({previewReceiptPayment.section})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {currentLang === 'om' ? "Ji'a:" : currentLang === 'en' ? 'Month:' : 'ወር፡'}
                  </span>
                  <span className="font-bold text-emerald-800">
                    {getMonthDisplay(previewReceiptPayment.month)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {currentLang === 'om' ? 'Hanga:' : currentLang === 'en' ? 'Amount:' : 'መጠን፡'}
                  </span>
                  <span className="font-bold font-mono text-emerald-800 text-sm">
                    {previewReceiptPayment.amount} ETB
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {currentLang === 'om' ? 'Baankii:' : currentLang === 'en' ? 'Bank:' : 'ባንክ፡'}
                  </span>
                  <span className="font-medium text-slate-800">
                    {getBankDisplay(previewReceiptPayment.bankName) !== '-'
                      ? getBankDisplay(previewReceiptPayment.bankName)
                      : previewReceiptPayment.paymentMethod}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {currentLang === 'om'
                      ? 'Lakkoofsa Daldalaa (Ref):'
                      : currentLang === 'en'
                      ? 'Transaction Ref:'
                      : 'የግብይት ቁጥር (Ref):'}
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {previewReceiptPayment.transactionRef ||
                      (currentLang === 'om' ? 'Hin ibsamne' : currentLang === 'en' ? 'Not specified' : 'አልተጠቀሰም')}
                  </span>
                </div>
              </div>

              {/* Full Image Preview */}
              {previewReceiptPayment.receiptImageUrl && (
                <div className="border-2 border-slate-300 rounded-2xl overflow-hidden bg-slate-900/5 max-h-80 flex items-center justify-center p-2">
                  <img
                    src={previewReceiptPayment.receiptImageUrl}
                    alt="Submitted Receipt Full"
                    className="max-h-72 object-contain mx-auto rounded-lg shadow-sm"
                  />
                </div>
              )}

              {/* Approval Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setRejectionModalPayment(previewReceiptPayment);
                    setRejectionReasonText('');
                  }}
                  className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>
                    {currentLang === 'om' ? 'Kuffisi' : currentLang === 'en' ? 'Reject' : 'ውድቅ አድርግ'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveReceipt(previewReceiptPayment)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {currentLang === 'om'
                      ? 'Mirkaneessi & Nagahee Kuti'
                      : currentLang === 'en'
                      ? 'Approve & Issue Receipt'
                      : 'አጽድቅና ደረሰኝ ቁረጥ'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: REJECT REASON DIALOG
          ========================================================================= */}
      {rejectionModalPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <h4 className="font-bold text-sm text-slate-900 mb-1">
              {currentLang === 'om'
                ? 'Sababa Nagahee Kuffisuu'
                : currentLang === 'en'
                ? 'Receipt Rejection Reason'
                : 'ደረሰኙን ውድቅ የማድረጊያ ምክንያት'}
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              {currentLang === 'om'
                ? 'Barataanii fi maatiin dogoggora sirreessanii irra deebi’anii akka ergan sababa isaa ibsaa.'
                : currentLang === 'en'
                ? 'Specify the reason so the student and parent can correct and resubmit.'
                : 'ተማሪውና ወላጁ የተሳሳተውን አስተካክለው እንደገና እንዲልኩ ምክንያቱን ይጥቀሱ።'}
            </p>
            <form onSubmit={handleConfirmReject} className="space-y-3">
              <textarea
                value={rejectionReasonText}
                onChange={(e) => setRejectionReasonText(e.target.value)}
                placeholder={
                  currentLang === 'om'
                    ? 'Fkn: Lakkoofsi daldalaa baankii hin argamne ykn suuraan nagahee ifa miti'
                    : currentLang === 'en'
                    ? 'e.g., Bank transaction reference not found or receipt image unclear'
                    : 'ለምሳሌ፡ የባንክ ግብይት ቁጥሩ በባንክ ገቢ ውስጥ አልተገኘም ወይም ደረሰኙ ግልጽ አይደለም'
                }
                rows={3}
                required
                className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectionModalPayment(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  {currentLang === 'om' ? 'Haqi' : currentLang === 'en' ? 'Cancel' : 'ሰርዝ'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  {currentLang === 'om'
                    ? 'Kufaa Ta’uu Mirkaneessi'
                    : currentLang === 'en'
                    ? 'Confirm Rejection'
                    : 'ውድቅ መሆኑን አረጋግጥ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CASHIER COLLECT FEE FORM
          ========================================================================= */}
      {showCollectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {currentLang === 'om'
                  ? "Sassaabbii Kaffaltii Ji'aa fi Kutaa Nagahee"
                  : currentLang === 'en'
                  ? 'Collect Monthly Fee & Issue Receipt'
                  : 'የወር ክፍያ መሰብሰቢያና ደረሰኝ መቁረጫ'}
              </h3>
              <button
                onClick={() => setShowCollectModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCollectFee} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLang === 'om' ? 'Barataa Filadhu *' : currentLang === 'en' ? 'Select Student *' : 'ተማሪ ምረጥ *'}
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                >
                  <option value="">
                    {currentLang === 'om'
                      ? '-- Barataa Filadhu --'
                      : currentLang === 'en'
                      ? '-- Select Student --'
                      : '-- ተማሪ ይምረጡ --'}
                  </option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} - {s.grade}{s.section} ({s.studentIdNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLang === 'om' ? "Ji'a Kaffaltii *" : currentLang === 'en' ? 'Fee Month *' : 'የክፍያ ወር *'}
                </label>
                <select
                  value={feeMonth}
                  onChange={(e) => setFeeMonth(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                >
                  {ETHIOPIAN_ACADEMIC_MONTHS.map((m) => (
                    <option key={m.key} value={`${m.key} 2017`}>
                      {currentLang === 'om' ? m.labelOm || m.labelAm : currentLang === 'en' ? m.labelEn || m.labelAm : m.labelAm}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Hanga (ETB) *' : currentLang === 'en' ? 'Amount (ETB) *' : 'መጠን (ብር) *'}
                  </label>
                  <input
                    type="number"
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(Number(e.target.value))}
                    className="w-full p-2.5 font-mono font-bold bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Mala Kaffaltii *' : currentLang === 'en' ? 'Payment Method *' : 'የክፍያ መንገድ *'}
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="telebirr">
                      {currentLang === 'om' ? 'Telebirr' : currentLang === 'en' ? 'Telebirr' : 'ቴሌብር (Telebirr)'}
                    </option>
                    <option value="cbe_birr">
                      {currentLang === 'om' ? 'CBE Birr' : currentLang === 'en' ? 'CBE Birr' : 'ሲቢኢ ብር (CBE Birr)'}
                    </option>
                    <option value="bank_transfer">
                      {currentLang === 'om'
                        ? 'Jijjiirraa Baankii'
                        : currentLang === 'en'
                        ? 'Bank Transfer'
                        : 'የባንክ ዝውውር'}
                    </option>
                    <option value="cash">
                      {currentLang === 'om'
                        ? 'Maallaqa Callaa (Cash)'
                        : currentLang === 'en'
                        ? 'Cash'
                        : 'ጥሬ ገንዘብ (Cash)'}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLang === 'om' ? 'Yaadannoo Dabalataa' : currentLang === 'en' ? 'Additional Notes' : 'ተጨማሪ ማስታወሻ'}
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder={
                    currentLang === 'om'
                      ? 'Yoo barbaachise...'
                      : currentLang === 'en'
                      ? 'If needed...'
                      : 'አስፈላጊ ከሆነ...'
                  }
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCollectModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  {currentLang === 'om' ? 'Haqi' : currentLang === 'en' ? 'Cancel' : 'ሰርዝ'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {currentLang === 'om'
                    ? 'Kaffaltii Galmeessi & Nagahee Kuti'
                    : currentLang === 'en'
                    ? 'Record Fee & Issue Receipt'
                    : 'ክፍያውን መዝግብና ደረሰኝ ቁረጥ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD EXPENSE FORM
          ========================================================================= */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {currentLang === 'om'
                  ? 'Baasii Mana Barumsaa Galmeessi'
                  : currentLang === 'en'
                  ? 'Record School Expense'
                  : 'የትምህርት ቤት ወጪ መዝግብ'}
              </h3>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLang === 'om' ? 'Mata-duree Baasii *' : currentLang === 'en' ? 'Expense Title *' : 'የወጪው ርዕስ *'}
                </label>
                <input
                  type="text"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder={
                    currentLang === 'om'
                      ? 'Fkn: Bittaa keemikaala laaboraatoorii...'
                      : currentLang === 'en'
                      ? 'e.g., Laboratory chemicals purchase...'
                      : 'ለምሳሌ፡ የላብራቶሪ ኬሚካሎች ግዢ...'
                  }
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Ramaddii *' : currentLang === 'en' ? 'Category *' : 'ምድብ *'}
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-500 outline-none"
                  >
                    <option value="supplies">
                      {currentLang === 'om'
                        ? 'Meeshaalee Barnootaa'
                        : currentLang === 'en'
                        ? 'Educational Supplies'
                        : 'የትምህርት ግብአቶች'}
                    </option>
                    <option value="utilities">
                      {currentLang === 'om' ? 'Ibsaa fi Bishaan' : currentLang === 'en' ? 'Utilities' : 'መብራትና ውሃ'}
                    </option>
                    <option value="maintenance">
                      {currentLang === 'om' ? 'Suphaa fi Haaromsa' : currentLang === 'en' ? 'Maintenance' : 'ጥገና እና እድሳት'}
                    </option>
                    <option value="salary">
                      {currentLang === 'om' ? 'Miindaa / Durgoo' : currentLang === 'en' ? 'Salary / Allowance' : 'ደሞዝ / አበል'}
                    </option>
                    <option value="events">
                      {currentLang === 'om' ? 'Qophiiwwan' : currentLang === 'en' ? 'Events' : 'ሁነቶች'}
                    </option>
                    <option value="other">
                      {currentLang === 'om' ? 'Kan Biroo' : currentLang === 'en' ? 'Other' : 'ሌሎች'}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Hanga (ETB) *' : currentLang === 'en' ? 'Amount (ETB) *' : 'መጠን (ብር) *'}
                  </label>
                  <input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    className="w-full p-2.5 font-mono font-bold bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLang === 'om' ? 'Qaama Kaffalameef' : currentLang === 'en' ? 'Paid To' : 'የተከፈለለት አካል'}
                </label>
                <input
                  type="text"
                  value={expensePaidTo}
                  onChange={(e) => setExpensePaidTo(e.target.value)}
                  placeholder={
                    currentLang === 'om'
                      ? 'Dhaabbata dhiyeessaa ykn nama dhuunfaa...'
                      : currentLang === 'en'
                      ? 'Supplier organization or person...'
                      : 'አቅራቢ ድርጅት ወይም ግለሰብ...'
                  }
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLang === 'om' ? 'Itti Gaafatamaa Mirkaneesse' : currentLang === 'en' ? 'Approved By' : 'ያጸደቀው ኃላፊ'}
                </label>
                <input
                  type="text"
                  value={expenseApprovedBy}
                  onChange={(e) => setExpenseApprovedBy(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  {currentLang === 'om' ? 'Haqi' : currentLang === 'en' ? 'Cancel' : 'ሰርዝ'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {currentLang === 'om'
                    ? 'Baasii Galmeessi'
                    : currentLang === 'en'
                    ? 'Record Expense'
                    : 'ወጪውን መዝግብ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: OFFICIAL PRINTABLE RECEIPT
          ========================================================================= */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 space-y-4 print:p-8" id="printable-fee-receipt">
              <div className="text-center border-b-2 border-dashed border-slate-200 pb-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  {currentLang === 'om'
                    ? 'Nagahee Kaffaltii Idilee Mana Barumsaa'
                    : currentLang === 'en'
                    ? 'Official School Payment Receipt'
                    : 'ይፋዊ የትምህርት ቤት የክፍያ ደረሰኝ'}
                </span>
                <h3 className="text-base font-black text-slate-900">{school.name}</h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  {currentLang === 'om'
                    ? 'Lakk. Nagahee: '
                    : currentLang === 'en'
                    ? 'Receipt No.: '
                    : 'የደረሰኝ ቁጥር፡ '}
                  <strong>{selectedReceipt.receiptNumber}</strong>
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {currentLang === 'om' ? 'Guyyaa: ' : currentLang === 'en' ? 'Date: ' : 'ቀን፡ '}
                  {selectedReceipt.paymentDate}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">
                    {currentLang === 'om' ? 'Maqaa Barataa:' : currentLang === 'en' ? 'Student Name:' : 'የተማሪ ስም፡'}
                  </span>
                  <span className="font-bold text-slate-900">{selectedReceipt.studentName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">
                    {currentLang === 'om' ? 'Kutaa:' : currentLang === 'en' ? 'Grade:' : 'ክፍል፡'}
                  </span>
                  <span className="font-bold text-slate-800">
                    {currentLang === 'om'
                      ? `Kutaa ${selectedReceipt.grade} (${selectedReceipt.section})`
                      : currentLang === 'en'
                      ? `Grade ${selectedReceipt.grade} (${selectedReceipt.section})`
                      : `${selectedReceipt.grade}ኛ ክፍል (${selectedReceipt.section})`}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">
                    {currentLang === 'om' ? 'Maatii Kaffale:' : currentLang === 'en' ? 'Paid By Parent:' : 'የተከፋይ ወላጅ፡'}
                  </span>
                  <span className="font-bold text-slate-800">{selectedReceipt.parentName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">
                    {currentLang === 'om' ? "Ji'a Kaffaltii:" : currentLang === 'en' ? 'Fee Month:' : 'የክፍያ ወር፡'}
                  </span>
                  <span className="font-bold text-emerald-900">{getMonthDisplay(selectedReceipt.month)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">
                    {currentLang === 'om' ? 'Mala Kaffaltii:' : currentLang === 'en' ? 'Method:' : 'የክፍያ ዘዴ፡'}
                  </span>
                  <span className="font-mono font-bold uppercase text-slate-800">
                    {getBankDisplay(selectedReceipt.bankName) !== '-'
                      ? getBankDisplay(selectedReceipt.bankName)
                      : selectedReceipt.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between py-2.5 bg-emerald-50/80 px-3 rounded-xl border border-emerald-200 text-sm">
                  <span className="font-black text-emerald-950">
                    {currentLang === 'om'
                      ? 'Ida’ama Waliigalaa Kaffalame:'
                      : currentLang === 'en'
                      ? 'Total Amount Paid:'
                      : 'የተከፈለ ጠቅላላ ድምር፡'}
                  </span>
                  <span className="font-black text-emerald-900 font-mono">
                    {selectedReceipt.amount.toLocaleString()} {currentLang === 'om' || currentLang === 'en' ? 'ETB' : 'ETB (ብር)'}
                  </span>
                </div>
              </div>

              {selectedReceipt.receiptImageUrl && (
                <div className="pt-2 border-t border-dashed border-slate-200">
                  <span className="text-[10px] text-slate-400 block mb-1">
                    {currentLang === 'om'
                      ? 'Suuraa Nagahee Baankii Maxxaansame:'
                      : currentLang === 'en'
                      ? 'Attached Bank Receipt Image:'
                      : 'የተያያዘ የባንክ ደረሰኝ ፎቶ፡'}
                  </span>
                  <div className="max-h-40 overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={selectedReceipt.receiptImageUrl}
                      alt="Receipt attached"
                      className="max-h-36 w-full object-contain mx-auto"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 text-center text-[10px] text-slate-400 space-y-1">
                <p>
                  {currentLang === 'om'
                    ? 'Qabduu Maallaqaa Mirkaneesse: '
                    : currentLang === 'en'
                    ? 'Verified by Cashier: '
                    : 'ክፍያውን ያረጋገጠው ሒሳብ ሹም፡ '}
                  {selectedReceipt.collectedBy}
                </p>
                <p className="font-medium text-emerald-800">
                  {currentLang === 'om'
                    ? 'Kaffaltii keessaniif galatoomaa! Nagaheen kun sirnaan mirkanaa’eera.'
                    : currentLang === 'en'
                    ? 'Thank you for your payment! This receipt is system verified.'
                    : 'ስለፈጸሙት ክፍያ እናመሰግናለን! ይህ ደረሰኝ በሲስተም የተረጋገጠ ነው።'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                {currentLang === 'om' ? 'Cufi' : currentLang === 'en' ? 'Close' : 'ዝጋ'}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>
                  {currentLang === 'om'
                    ? 'Nagahee Maxxansi'
                    : currentLang === 'en'
                    ? 'Print Receipt'
                    : 'ደረሰኙን አትም (Print Receipt)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
