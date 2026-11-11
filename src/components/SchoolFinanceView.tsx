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
  const [expenseApprovedBy, setExpenseApprovedBy] = useState('አቶ ጉተማ ዋቆ (ዋና ዳይሬክተር)');
  const [expenseNotes, setExpenseNotes] = useState('');

  // Bank Account Modal state
  const [showBankModal, setShowBankModal] = useState(false);
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [bankNameInput, setBankNameInput] = useState('የኢትዮጵያ ንግድ ባንክ (CBE)');
  const [accountNumberInput, setAccountNumberInput] = useState('');
  const [accountHolderInput, setAccountHolderInput] = useState(school.name);
  const [branchInput, setBranchInput] = useState('ሻሸመኔ ቅርንጫፍ');
  const [instructionsInput, setInstructionsInput] = useState('በክፍያ ወቅት የተማሪውን ሙሉ ስም እና ክፍል ይጥቀሱ');
  const [isBankActive, setIsBankActive] = useState(true);

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
      collectedBy: currentUser?.name || 'ወ/ሮ ሰላማዊት አበራ (ሒሳብ ሹም)',
      notes: paymentNotes
    };

    StorageService.addFeePayment(newPayment);
    const updated = StorageService.getFeePayments(school.id);
    setPayments(updated);
    setShowCollectModal(false);
    setSelectedReceipt(newPayment);
    setSelectedStudentId('');
    setPaymentNotes('');
    setToastMessage(`የ${student.fullName} የ${feeMonth} ክፍያ ተመዝግቧል!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Action: Cashier Approves Submitted Receipt
  const handleApproveReceipt = (payment: FeePaymentRecord) => {
    const accountantName = currentUser?.name || 'ወ/ሮ ሰላማዊት አበራ (ዋና ሒሳብ ሹም)';
    StorageService.verifyFeePayment(payment.id, accountantName);
    const updated = StorageService.getFeePayments(school.id);
    setPayments(updated);
    setPreviewReceiptPayment(null);
    setToastMessage(`የ${payment.studentName} የ${payment.month} ደረሰኝ ጸድቋል! የተማሪው ዓመታዊ ሰንጠረዥ ወደ አረንጓዴ ተቀይሯል።`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Action: Cashier Rejects Submitted Receipt
  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModalPayment) return;
    const reason = rejectionReasonText.trim() || 'የተላከው ደረሰኝ ወይም የባንክ ግብይት ቁጥር ግልጽ አይደለም';
    const accountantName = currentUser?.name || 'ወ/ሮ ሰላማዊት አበራ (ዋና ሒሳብ ሹም)';

    StorageService.rejectFeePayment(rejectionModalPayment.id, reason, accountantName);
    setPayments(StorageService.getFeePayments(school.id));
    setRejectionModalPayment(null);
    setPreviewReceiptPayment(null);
    setRejectionReasonText('');
    setToastMessage(`የደረሰኝ ማረጋገጫው ውድቅ ተደርጓል፤ ለተማሪው/ወላጁ ማሳሰቢያ ተልኳል።`);
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
        postedBy: currentUser?.name || 'ወ/ሮ ሰላማዊት አበራ (ዋና ገንዘብ ያዥ / ሒሳብ ሹም)',
        postedAt: new Date().toISOString().split('T')[0]
      };
      StorageService.addSchoolBankAccount(newAcc);
    }

    setBankAccounts(StorageService.getSchoolBankAccounts(school.id));
    setShowBankModal(false);
    setEditingBankId(null);
    setAccountNumberInput('');
    setToastMessage('የትምህርት ቤቱ የባንክ አካውንት በተሳካ ሁኔታ ተለጥፏል!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Delete Bank Account
  const handleDeleteBankAccount = (id: string) => {
    if (confirm('እርግጠኛ ኖት ይህንን የባንክ አካውንት ከፖርታሉ መሰረዝ ይፈልጋሉ?')) {
      StorageService.deleteSchoolBankAccount(id);
      setBankAccounts(StorageService.getSchoolBankAccounts(school.id));
      setToastMessage('የባንክ አካውንቱ ተሰርዟል');
      setTimeout(() => setToastMessage(null), 3000);
    }
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
      paidTo: expensePaidTo || 'አቅራቢ ድርጅት',
      recordedBy: currentUser?.name || 'ወ/ሮ ሰላማዊት አበራ (ሒሳብ ሹም)',
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
              <span>የትምህርት ቤት ፋይናንስ፣ የወር ክፍያ ሰንጠረዥ እና ደረሰኝ ማረጋገጫ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              የሒሳብ ክፍል እና ክፍያ አስተዳደር (Finance & Cashier Hub)
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              የትምህርት ቤቱን ይፋዊ የባንክ አካውንቶች ለተማሪዎችና ወላጆች የመለጠፍ፣ የተላኩ ደረሰኞችን የማረጋገጥ፣
              እና የ10 ወራት ዓመታዊ የክፍያ ሰንጠረዥ (አረንጓዴ/ቀይ) የመቆጣጠሪያ ማዕከል
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
                  <span>+ አዲስ የባንክ አካውንት ለጥፍ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCollectModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>ክፍያ ተቀበል / ደረሰኝ ቁረጥ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowExpenseModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-700/80 hover:bg-rose-700 text-white text-xs font-bold rounded-xl border border-rose-500/40 transition-colors cursor-pointer"
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>ወጪ መዝግብ</span>
                </button>
              </>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-amber-500/20 text-amber-200 border border-amber-400/40 rounded-xl text-xs font-bold">
                <Lock className="w-4 h-4 text-amber-300" />
                <span>የትምህርት ቢሮ እይታ (ማየት ብቻ - Read-Only)</span>
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
              ጠቅላላ የተሰበሰበ ገቢ (Revenue)
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-700 font-mono">
                {totalRevenue.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-600">ETB</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
              {verifiedReceipts.length} የተረጋገጡ ደረሰኞች
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">
              በማረጋገጥ ላይ ያሉ ደረሰኞች (Pending)
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-600 font-mono">
                {pendingReceipts.length}
              </span>
              <span className="text-xs font-bold text-slate-600">ደረሰኞች</span>
            </div>
            <button
              onClick={() => setActiveTab('receipts_queue')}
              className="text-[11px] text-amber-700 font-bold hover:underline mt-1 block"
            >
              አሁን አረጋግጥ →
            </button>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">
              የተለጠፉ የባንክ አካውንቶች (Accounts)
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-indigo-700 font-mono">
                {bankAccounts.filter((b) => b.isActive).length}
              </span>
              <span className="text-xs font-bold text-slate-600">ይፋዊ አካውንቶች</span>
            </div>
            <button
              onClick={() => setActiveTab('bank_accounts')}
              className="text-[11px] text-indigo-600 font-semibold hover:underline mt-1 block"
            >
              አካውንቶችን አስተዳድር →
            </button>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">
              አጠቃላይ አስተዳደራዊ ወጪ (Expenses)
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-rose-700 font-mono">
                {totalExpense.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-600">ETB</span>
            </div>
            <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
              ቀሪ ካዝና፡ {netBalance.toLocaleString()} ብር
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
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'fees'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>የወር ክፍያዎችና ደረሰኞች ({payments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('receipts_queue')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 relative ${
            activeTab === 'receipts_queue'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>ከተማሪዎች/ወላጆች የተላኩ ደረሰኞች</span>
          {pendingReceipts.length > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded-full animate-pulse">
              {pendingReceipts.length} አዲስ
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bank_accounts')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'bank_accounts'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>የት/ቤቱ ይፋዊ የባንክ አካውንቶች ({bankAccounts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('annual_matrix')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'annual_matrix'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>የተማሪዎች ዓመታዊ የክፍያ ሰንጠረዥ (10 ወራት)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('expenses')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'expenses'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>የትምህርት ቤት ወጪዎች ({expenses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('statement')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'statement'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>ያልከፈሉ ተማሪዎችና ማሳሰቢያ</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: COLLECTED FEES & RECEIPTS
          ========================================================================= */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">የተሰበሰቡ ወርሃዊ ክፍያዎች ዝርዝር</h3>
              <p className="text-xs text-slate-500">በሲስተም የተመዘገቡ የክፍያ ደረሰኞች</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchStudentQuery}
                onChange={(e) => setSearchStudentQuery(e.target.value)}
                placeholder="ተማሪ፣ ወላጅ ወይም ደረሰኝ ፈልግ..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">የደረሰኝ ቁጥር</th>
                  <th className="py-3 px-3">የተማሪ ስም</th>
                  <th className="py-3 px-3">ክፍል</th>
                  <th className="py-3 px-3">የክፍያ ወር</th>
                  <th className="py-3 px-3">መጠን (ETB)</th>
                  <th className="py-3 px-3">የክፍያ ዘዴ</th>
                  <th className="py-3 px-3">ሁኔታ</th>
                  <th className="py-3 px-3">ቀን</th>
                  <th className="py-3 px-3 text-right">እርምጃ</th>
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
                      <td className="py-3 px-3 font-medium text-slate-700">{p.month}</td>
                      <td className="py-3 px-3 font-bold font-mono text-emerald-800">
                        {p.amount.toLocaleString()} ብር
                      </td>
                      <td className="py-3 px-3 uppercase text-slate-600">
                        {p.bankName || p.paymentMethod}
                      </td>
                      <td className="py-3 px-3">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ተከፍሏል
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                            <Clock className="w-3 h-3 text-amber-600" />
                            በማረጋገጥ ላይ
                          </span>
                        ) : isRejected ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            ውድቅ የተደረገ
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">ያልተከፈለ</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-500">{p.paymentDate}</td>
                      <td className="py-3 px-3 text-right">
                        {isPaid ? (
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>ደረሰኝ እይ</span>
                          </button>
                        ) : isPending ? (
                          <button
                            type="button"
                            onClick={() => setPreviewReceiptPayment(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white hover:bg-amber-600 rounded-lg text-xs font-bold shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>አረጋግጥ</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt(p)}
                            className="text-xs text-slate-500 hover:underline"
                          >
                            ዝርዝር
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
          TAB 2: SUBMITTED RECEIPTS QUEUE (ከተማሪዎችና ወላጆች የተላኩ ደረሰኞች ማረጋገጫ)
          ========================================================================= */}
      {activeTab === 'receipts_queue' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  ከተማሪዎችና ወላጆች የተላኩ ደረሰኞች ማረጋገጫ (Receipt Verification Queue)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ተማሪዎችና ወላጆች የከፈሉበትን ደረሰኝ አያይዘው የላኩት እዚህ ይደርሳል። ካረጋገጡ በኋላ «አጽድቅ» ሲጫኑ የተማሪው የወር ክፍያ ሰንጠረዥ ወዲያውኑ አረንጓዴ ይሆናል።
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 font-extrabold text-xs rounded-full border border-amber-300">
              {pendingReceipts.length} ደረሰኞች በማረጋገጥ ላይ
            </span>
          </div>

          {pendingReceipts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500/50" />
              <p className="text-sm font-bold text-slate-600">
                ምንም አዲስ ያልተረጋገጠ ደረሰኝ የለም!
              </p>
              <p className="text-xs text-slate-400">
                ተማሪዎችና ወላጆች በፖርታላቸው ደረሰኝ ሲያያይዙ ወዲያውኑ እዚህ ይታያል።
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
                        {rec.month}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 mt-1">
                        {rec.studentName}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        ክፍል {rec.grade} ({rec.section}) · ወላጅ: {rec.parentName}
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
                        <span>ሙሉ ፎቶ እይ</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-white/70 rounded-xl border border-slate-200 text-xs text-slate-400 text-center italic">
                      ፎቶ አልተያያዘም (የግብይት ቁጥር ብቻ)
                    </div>
                  )}

                  <div className="space-y-1 text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                    <p>
                      <strong>ባንክ፡</strong> {rec.bankName || rec.paymentMethod}
                    </p>
                    <p className="font-mono">
                      <strong>የግብይት ቁጥር (Ref):</strong> {rec.transactionRef || 'አልተጠቀሰም'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      የተላከበት ቀን፡ {rec.submittedAt?.split('T')[0] || rec.paymentDate}
                    </p>
                    {rec.notes && (
                      <p className="text-[11px] text-slate-500 italic">ማስታወሻ: {rec.notes}</p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleApproveReceipt(rec)}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1 transition"
                    >
                      <Check className="w-4 h-4" />
                      <span>አጽድቅና ቁረጥ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRejectionModalPayment(rec);
                        setRejectionReasonText('');
                      }}
                      className="py-2 px-3 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition"
                    >
                      <X className="w-4 h-4" />
                      <span>ውድቅ አድርግ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: SCHOOL OFFICIAL BANK ACCOUNTS (የትምህርት ቤቱ ገንዘብ ያዥ የሚለጥፋቸው የባንክ አካውንቶች)
          ========================================================================= */}
      {activeTab === 'bank_accounts' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  የትምህርት ቤቱ ይፋዊ የባንክ አካውንቶች ማኔጀር (Cashier's Official Bank Accounts)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                እዚህ የተለጠፉት አካውንቶች በቀጥታ በተማሪውና በወላጅ ገፅ ላይ ይታያሉ። ወላጆች ወደ እነዚህ አካውንቶች ከፍለው ደረሰኝ ያያይዛሉ።
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
              <span>+ አዲስ የባንክ አካውንት ለጥፍ</span>
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
                      {acc.bankName}
                    </span>
                    <button
                      onClick={() => handleToggleBankActive(acc)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        acc.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {acc.isActive ? 'ይፋዊ / ይታያል' : 'የተዘጋ'}
                    </button>
                  </div>

                  <div className="my-3 space-y-1">
                    <p className="text-[11px] text-slate-400 font-medium">የሂሳብ ቁጥር፡</p>
                    <div className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <span className="font-mono font-black text-slate-900 text-sm select-all">
                        {acc.accountNumber}
                      </span>
                      <button
                        onClick={() => handleCopyAccount(acc.accountNumber, acc.id)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-600 text-xs"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 mb-4">
                    <p className="font-semibold text-slate-800">{acc.accountHolder}</p>
                    {acc.branch && <p className="text-[11px] text-slate-400">ቅርንጫፍ፡ {acc.branch}</p>}
                    {acc.instructions && (
                      <p className="text-[11px] text-slate-500 italic">"{acc.instructions}"</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">{acc.postedBy}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditBank(acc)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                        title="አስተካክል"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBankAccount(acc.id)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600"
                        title="ሰርዝ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: ANNUAL 10-MONTH FEE SCHEDULE MATRIX (የተማሪዎች ዓመታዊ ሰንጠረዥ)
          - መከፈሉ ሲረጋገጥ: አረንጓዴ ቀለም (GREEN)
          - ወሩ ገብቶ ያልተከፈለ ከሆነ: ቀይ ቀለም (RED)
          ========================================================================= */}
      {activeTab === 'annual_matrix' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                የተማሪዎች የ10 ወራት ዓመታዊ የክፍያ ሰንጠረዥ ማትሪክስ (Annual 10-Month Matrix)
              </h3>
              <p className="text-xs text-slate-500">
                የእያንዳንዱን ተማሪ የ10ሩም ወራት ክፍያ ሁኔታ በሰንጠረዡ ላይ ይመልከቱ። አረንጓዴ (ተከፍሏል)፣ ቀይ (ወሩ ገብቶ ያልተከፈለ)።
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> ተከፍሏል (አረንጓዴ)
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-rose-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> ያልተከፈለ (ቀይ)
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">ተማሪ</th>
                  <th className="py-3 px-2">ክፍል</th>
                  {ETHIOPIAN_ACADEMIC_MONTHS.map((m) => (
                    <th key={m.key} className="py-3 px-2 text-center whitespace-nowrap">
                      {m.key}
                    </th>
                  ))}
                  <th className="py-3 px-3 text-right">የተከፈለው / ጠቅላላ</th>
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
                                ✓ ተከፍሏል
                              </span>
                            ) : isPending ? (
                              <span className="inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-slate-900">
                                በማረጋገጥ ላይ
                              </span>
                            ) : isOverdue ? (
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-xs">
                                ✕ ያልተከፈለ
                              </span>
                            ) : (
                              <span className="inline-block px-1.5 py-0.5 rounded-full text-[9px] text-slate-400 bg-slate-100">
                                ገና ነው
                              </span>
                            )}
                          </td>
                        );
                      })}
                      <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                        {paidCount} / 10 ወር ({paidCount * 850} ብር)
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
                  የተማሪ {selectedStudentForAnnual.fullName} የግል ዓመታዊ የክፍያ ሰንጠረዥና ደረሰኝ
                </h4>
                <button
                  onClick={() => setSelectedStudentForAnnual(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  ዝጋ
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
              <h3 className="text-sm font-bold text-slate-900">የትምህርት ቤት አስተዳደራዊ ወጪዎች</h3>
              <p className="text-xs text-slate-500">ለዕቃዎች፣ ለጥገና እና ለአገልግሎቶች የወጡ ወጪዎች</p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              ጠቅላላ ወጪ፡ <strong className="text-rose-700">{totalExpense.toLocaleString()} ETB</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">የወጪ ርዕስ</th>
                  <th className="py-3 px-3">ምድብ</th>
                  <th className="py-3 px-3">መጠን (ETB)</th>
                  <th className="py-3 px-3">የተከፈለለት</th>
                  <th className="py-3 px-3">ያጸደቀው</th>
                  <th className="py-3 px-3">ቀን</th>
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
                      {e.amount.toLocaleString()} ብር
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
          TAB 6: OVERDUE NOTICES (ያልከፈሉ ተማሪዎች)
          ========================================================================= */}
      {activeTab === 'statement' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">ያልከፈሉ ተማሪዎችና የወላጅ ማሳሰቢያ</h3>
            <p className="text-xs text-slate-500">
              የያዝነውን ወር ክፍያ ያልፈጸሙ ተማሪዎች ዝርዝርና ለወላጅ ማሳሰቢያ መላኪያ
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">የተማሪ ስም</th>
                  <th className="py-3 px-3">ክፍል</th>
                  <th className="py-3 px-3">የወላጅ ስም</th>
                  <th className="py-3 px-3">ስልክ</th>
                  <th className="py-3 px-3">ያልተከፈለ ወር</th>
                  <th className="py-3 px-3">ያልተከፈለ መጠን</th>
                  <th className="py-3 px-3 text-right">ማሳሰቢያ ላክ</th>
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
                          ኅዳር 2017 (ያልተከፈለ)
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-rose-700">850 ብር</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setReminderSentId(stu.id);
                            setTimeout(() => setReminderSentId(null), 3000);
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ml-auto ${
                            reminderSentId === stu.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {reminderSentId === stu.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>ተልኳል!</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>ማሳሰቢያ ላክ</span>
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
                  {editingBankId ? 'የባንክ አካውንት ማስተካከያ' : 'አዲስ ይፋዊ የባንክ አካውንት ለጥፍ'}
                </h3>
              </div>
              <button
                onClick={() => setShowBankModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBankAccount} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  የባንኩ ስም (Bank Name) *
                </label>
                <select
                  value={bankNameInput}
                  onChange={(e) => setBankNameInput(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                >
                  <option value="የኢትዮጵያ ንግድ ባንክ (CBE)">የኢትዮጵያ ንግድ ባንክ (CBE)</option>
                  <option value="ቴሌብር (Telebirr)">ቴሌብር (Telebirr)</option>
                  <option value="አዋሽ ባንክ (Awash Bank)">አዋሽ ባንክ (Awash Bank)</option>
                  <option value="ዳሽን ባንክ (Dashen Bank)">ዳሽን ባንክ (Dashen Bank)</option>
                  <option value="ወጋገን ባንክ (Wegagen Bank)">ወጋገን ባንክ (Wegagen Bank)</option>
                  <option value="ሕብረት ባንክ (Hibret Bank)">ሕብረት ባንክ (Hibret Bank)</option>
                  <option value="ኦሮሚያ ባንክ (Oromia Bank)">ኦሮሚያ ባንክ (Oromia Bank)</option>
                  <option value="አቢሲንያ ባንክ (Bank of Abyssinia)">አቢሲንያ ባንክ (Bank of Abyssinia)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  የሂሳብ ቁጥር / አካውንት ቁጥር *
                </label>
                <input
                  type="text"
                  value={accountNumberInput}
                  onChange={(e) => setAccountNumberInput(e.target.value)}
                  placeholder="ለምሳሌ፡ 1000123456789"
                  className="w-full p-2.5 font-mono font-bold bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  የአካውንቱ ስም (Account Holder) *
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">ቅርንጫፍ</label>
                  <input
                    type="text"
                    value={branchInput}
                    onChange={(e) => setBranchInput(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ሁኔታ</label>
                  <select
                    value={isBankActive ? 'active' : 'inactive'}
                    onChange={(e) => setIsBankActive(e.target.value === 'active')}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="active">ይፋዊ / ይታያል</option>
                    <option value="inactive">ዝግ ነው</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ለተማሪዎችና ወላጆች መመሪያ (Instructions)
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
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  {editingBankId ? 'አዘምን' : 'ለጥፍ'}
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
                  የተያያዘ ደረሰኝ ማረጋገጫ (Verify Submitted Receipt)
                </h3>
              </div>
              <button
                onClick={() => setPreviewReceiptPayment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">ተማሪ፡</span>
                  <span className="font-bold text-slate-900">{previewReceiptPayment.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ክፍል፡</span>
                  <span className="font-bold text-slate-900">
                    {previewReceiptPayment.grade} ({previewReceiptPayment.section})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ወር፡</span>
                  <span className="font-bold text-emerald-800">{previewReceiptPayment.month}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">መጠን፡</span>
                  <span className="font-bold font-mono text-emerald-800 text-sm">
                    {previewReceiptPayment.amount} ETB
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ባንክ፡</span>
                  <span className="font-medium text-slate-800">
                    {previewReceiptPayment.bankName || previewReceiptPayment.paymentMethod}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">የግብይት ቁጥር (Ref):</span>
                  <span className="font-mono font-bold text-slate-900">
                    {previewReceiptPayment.transactionRef || 'አልተጠቀሰም'}
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
                  className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl text-xs flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span>ውድቅ አድርግ</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveReceipt(previewReceiptPayment)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>አጽድቅና ደረሰኝ ቁረጥ</span>
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
              ደረሰኙን ውድቅ የማድረጊያ ምክንያት
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              ተማሪውና ወላጁ የተሳሳተውን አስተካክለው እንደገና እንዲልኩ ምክንያቱን ይጥቀሱ።
            </p>
            <form onSubmit={handleConfirmReject} className="space-y-3">
              <textarea
                value={rejectionReasonText}
                onChange={(e) => setRejectionReasonText(e.target.value)}
                placeholder="ለምሳሌ፡ የባንክ ግብይት ቁጥሩ በባንክ ገቢ ውስጥ አልተገኘም ወይም ደረሰኙ ግልጽ አይደለም"
                rows={3}
                required
                className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectionModalPayment(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  ውድቅ መሆኑን አረጋግጥ
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
                የወር ክፍያ መሰብሰቢያና ደረሰኝ መቁረጫ
              </h3>
              <button
                onClick={() => setShowCollectModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCollectFee} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ተማሪ ምረጥ *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                >
                  <option value="">-- ተማሪ ይምረጡ --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} - {s.grade}{s.section} ({s.studentIdNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">የክፍያ ወር *</label>
                <select
                  value={feeMonth}
                  onChange={(e) => setFeeMonth(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                >
                  {ETHIOPIAN_ACADEMIC_MONTHS.map((m) => (
                    <option key={m.key} value={`${m.key} 2017`}>
                      {currentLang === 'om' ? (m.labelOm || m.labelAm) : currentLang === 'en' ? (m.labelEn || m.labelAm) : m.labelAm}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">መጠን (ብር) *</label>
                  <input
                    type="number"
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(Number(e.target.value))}
                    className="w-full p-2.5 font-mono font-bold bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">የክፍያ መንገድ *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="telebirr">ቴሌብር (Telebirr)</option>
                    <option value="cbe_birr">ሲቢኢ ብር (CBE Birr)</option>
                    <option value="bank_transfer">የባንክ ዝውውር</option>
                    <option value="cash">ጥሬ ገንዘብ (Cash)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ተጨማሪ ማስታወሻ</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="አስፈላጊ ከሆነ..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCollectModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  ክፍያውን መዝግብና ደረሰኝ ቁረጥ
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
              <h3 className="font-bold text-base text-slate-900">የትምህርት ቤት ወጪ መዝግብ</h3>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">የወጪው ርዕስ *</label>
                <input
                  type="text"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="ለምሳሌ፡ የላብራቶሪ ኬሚካሎች ግዢ..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ምድብ *</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-500 outline-none"
                  >
                    <option value="supplies">የትምህርት ግብአቶች</option>
                    <option value="utilities">መብራትና ውሃ</option>
                    <option value="maintenance">ጥገና እና እድሳት</option>
                    <option value="salary">ደሞዝ / አበል</option>
                    <option value="events">ሁነቶች</option>
                    <option value="other">ሌሎች</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">መጠን (ብር) *</label>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">የተከፈለለት አካል</label>
                <input
                  type="text"
                  value={expensePaidTo}
                  onChange={(e) => setExpensePaidTo(e.target.value)}
                  placeholder="አቅራቢ ድርጅት ወይም ግለሰብ..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ያጸደቀው ኃላፊ</label>
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
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  ወጪውን መዝግብ
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
                  ይፋዊ የትምህርት ቤት የክፍያ ደረሰኝ
                </span>
                <h3 className="text-base font-black text-slate-900">{school.name}</h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  የደረሰኝ ቁጥር፡ <strong>{selectedReceipt.receiptNumber}</strong>
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  ቀን፡ {selectedReceipt.paymentDate}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">የተማሪ ስም፡</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.studentName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">ክፍል፡</span>
                  <span className="font-bold text-slate-800">
                    {selectedReceipt.grade}ኛ ክፍል ({selectedReceipt.section})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">የተከፋይ ወላጅ፡</span>
                  <span className="font-bold text-slate-800">{selectedReceipt.parentName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">የክፍያ ወር፡</span>
                  <span className="font-bold text-emerald-900">{selectedReceipt.month}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">የክፍያ ዘዴ፡</span>
                  <span className="font-mono font-bold uppercase text-slate-800">
                    {selectedReceipt.bankName || selectedReceipt.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between py-2.5 bg-emerald-50/80 px-3 rounded-xl border border-emerald-200 text-sm">
                  <span className="font-black text-emerald-950">የተከፈለ ጠቅላላ ድምር፡</span>
                  <span className="font-black text-emerald-900 font-mono">
                    {selectedReceipt.amount.toLocaleString()} ETB (ብር)
                  </span>
                </div>
              </div>

              {selectedReceipt.receiptImageUrl && (
                <div className="pt-2 border-t border-dashed border-slate-200">
                  <span className="text-[10px] text-slate-400 block mb-1">የተያያዘ የባንክ ደረሰኝ ፎቶ፡</span>
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
                <p>ክፍያውን ያረጋገጠው ሒሳብ ሹም፡ {selectedReceipt.collectedBy}</p>
                <p className="font-medium text-emerald-800">
                  ስለፈጸሙት ክፍያ እናመሰግናለን! ይህ ደረሰኝ በሲስተም የተረጋገጠ ነው።
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
              >
                ዝጋ
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>ደረሰኙን አትም (Print Receipt)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
