import React, { useState } from 'react';
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
  Lock
} from 'lucide-react';
import { FeePaymentRecord, SchoolExpenseRecord, StudentRecord, School, Language, AppUserSession } from '../types';
import { StorageService } from '../utils/storage';

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
  const [payments, setPayments] = useState<FeePaymentRecord[]>(() =>
    StorageService.getFeePayments(school.id)
  );
  const [expenses, setExpenses] = useState<SchoolExpenseRecord[]>(() =>
    StorageService.getExpenses(school.id)
  );

  const [activeTab, setActiveTab] = useState<'fees' | 'expenses' | 'statement'>('fees');

  // Fee collection modal state
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [feeMonth, setFeeMonth] = useState('ጥቅምት 2017');
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

  // Receipt modal state
  const [selectedReceipt, setSelectedReceipt] = useState<FeePaymentRecord | null>(null);
  const [searchStudentQuery, setSearchStudentQuery] = useState('');
  const [reminderSentId, setReminderSentId] = useState<string | null>(null);

  // Financial summary
  const totalRevenue = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalRevenue - totalExpense;

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
  };

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

  const handleSendReminder = (studentId: string) => {
    setReminderSentId(studentId);
    setTimeout(() => setReminderSentId(null), 3000);
  };

  const filteredPayments = payments.filter((p) => {
    if (!searchStudentQuery.trim()) return true;
    const q = searchStudentQuery.toLowerCase();
    return (
      p.studentName.toLowerCase().includes(q) ||
      p.receiptNumber.toLowerCase().includes(q) ||
      p.parentName.toLowerCase().includes(q) ||
      p.month.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/80 border border-emerald-400/40 rounded-full text-xs font-semibold text-emerald-200">
              <DollarSign className="w-3.5 h-3.5 text-amber-300" />
              <span>የትምህርት ቤት ፋይናንስ፣ የወር ክፍያ እና ወጪ መቆጣጠሪያ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              የሒሳብ ክፍል እና ክፍያ አስተዳደር (Finance & Bursar Hub)
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              የተማሪዎችን ወርሃዊ ክፍያ በቴሌብር፣ በሲቢኢ ብርና በጥሬ ገንዘብ የመሰብሰብ፣ ይፋዊ ደረሰኝ የመቁረጥ
              እና የት/ቤቱን አስተዳደራዊ ወጪዎች በሙሉ የመመዝገቢያ ክፍል
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isBureauRole ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowCollectModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>የወር ክፍያ ተቀበል (Collect Fee)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowExpenseModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-700/80 hover:bg-rose-700 text-white text-xs font-bold rounded-xl border border-rose-500/40 transition-colors cursor-pointer"
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>ወጪ መዝግብ (Expense)</span>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">
              ጠቅላላ የተሰበሰበ ገቢ (Revenue)
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-700 font-mono">
                {totalRevenue.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-600">ETB (ብር)</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
              {payments.filter((p) => p.status === 'paid').length} ደረሰኞች ተቆርጠዋል
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
            <TrendingUp className="w-6 h-6" />
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
              <span className="text-xs font-bold text-slate-600">ETB (ብር)</span>
            </div>
            <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
              {expenses.length} የወጪ መደቦች
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200 shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">
              የተጣራ የካዝና ቀሪ (Net Balance)
            </span>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-2xl font-black font-mono ${
                  netBalance >= 0 ? 'text-teal-700' : 'text-rose-700'
                }`}
              >
                {netBalance.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-600">ETB (ብር)</span>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
              የትምህርት ቤት የተጣራ ሂሳብ
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sub Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white p-2 rounded-2xl">
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

      {/* Tab 1: Collected Fees */}
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
                  <th className="py-3 px-3">ቀን</th>
                  <th className="py-3 px-3">ተቀባይ</th>
                  <th className="py-3 px-3 text-right">ደረሰኝ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-emerald-800">
                      {p.receiptNumber}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">{p.studentName}</td>
                    <td className="py-3 px-3 font-semibold text-slate-600">
                      {p.grade}ኛ ክፍል ({p.section})
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">{p.month}</td>
                    <td className="py-3 px-3 font-black text-slate-900 font-mono">
                      {p.amount.toLocaleString()} ብር
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono">{p.paymentDate}</td>
                    <td className="py-3 px-3 text-slate-600">{p.collectedBy}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedReceipt(p)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[11px] inline-flex items-center gap-1 border border-emerald-200 cursor-pointer"
                      >
                        <Printer className="w-3 h-3" />
                        <span>አትም</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Expenses */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">የትምህርት ቤት አስተዳደራዊ ወጪዎች መዝገብ</h3>
              <p className="text-xs text-slate-500">ለስራ ማስኬጃ፣ ደሞዝ፣ ጥገና እና ግብአቶች የወጡ ወጪዎች</p>
            </div>
            <button
              type="button"
              onClick={() => setShowExpenseModal(true)}
              className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>አዲስ ወጪ መዝግብ</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">የወጪ ርዕስ</th>
                  <th className="py-3 px-3">ምድብ (Category)</th>
                  <th className="py-3 px-3">የወጪ መጠን</th>
                  <th className="py-3 px-3">የተከፈለለት አካል</th>
                  <th className="py-3 px-3">ያጸደቀው ኃላፊ</th>
                  <th className="py-3 px-3">ቀን</th>
                  <th className="py-3 px-3">የሰነድ ቁጥር</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{e.title}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                        {e.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-black text-rose-700 font-mono">
                      -{e.amount.toLocaleString()} ብር
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{e.paidTo}</td>
                    <td className="py-3 px-3 text-slate-600">{e.approvedBy}</td>
                    <td className="py-3 px-3 text-slate-500 font-mono">{e.date}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {e.receiptDocNumber || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Unpaid Students & Reminders */}
      {activeTab === 'statement' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              የጥቅምት ወር ክፍያ ያልከፈሉ ተማሪዎች እና ማሳሰቢያ መላኪያ
            </h3>
            <p className="text-xs text-slate-500">ለተማሪዎችና ወላጆች ፈጣን የስልክ እና የሲስተም ማሳሰቢያ</p>
          </div>

          <div className="space-y-3">
            {students.map((st) => {
              const paid = payments.some(
                (p) => p.studentId === st.id && p.month.includes('ጥቅምት') && p.status === 'paid'
              );
              return (
                <div
                  key={st.id}
                  className="p-4 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        paid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {paid ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{st.fullName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ({st.grade}ኛ ክፍል - {st.section})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        ወላጅ፡ {st.parentName} · ስልክ፡{' '}
                        <span className="font-mono">{st.parentPhone}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {paid ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        የጥቅምት ወር ተከፍሏል (850 ብር)
                      </span>
                    ) : (
                      <>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          ያልተከፈለ ቀሪ፡ 850 ብር
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSendReminder(st.id)}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>
                            {reminderSentId === st.id ? 'ማሳሰቢያ ተልኳል!' : 'ማሳሰቢያ ላክ'}
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Collect Fee Form */}
      {showCollectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-950 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">የወር ክፍያ መሰብሰቢያ እና ደረሰኝ መቁረጫ</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCollectModal(false)}
                className="text-emerald-200 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCollectFee} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  የተማሪ ስም ይምረጡ *
                </label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                >
                  <option value="">-- ተማሪ ይምረጡ --</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} - {st.grade}ኛ ክፍል ({st.section}) - ወላጅ: {st.parentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    የክፍያ ወር *
                  </label>
                  <select
                    value={feeMonth}
                    onChange={(e) => setFeeMonth(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="መስከረም 2017">መስከረም 2017</option>
                    <option value="ጥቅምት 2017">ጥቅምት 2017</option>
                    <option value="ህዳር 2017">ህዳር 2017</option>
                    <option value="ታህሳስ 2017">ታህሳስ 2017</option>
                    <option value="ጥር 2017">ጥር 2017</option>
                    <option value="የካቲት 2017">የካቲት 2017</option>
                    <option value="መጋቢት 2017">መጋቢት 2017</option>
                    <option value="ሚያዝያ 2017">ሚያዝያ 2017</option>
                    <option value="ግንቦት 2017">ግንቦት 2017</option>
                    <option value="ሰኔ 2017">ሰኔ 2017</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    የክፍያ መጠን (ETB ብር) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  የክፍያ ዘዴ (Payment Channel) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                  {[
                    { id: 'telebirr', label: 'ቴሌብር (Telebirr)' },
                    { id: 'cbe_birr', label: 'CBE Birr' },
                    { id: 'cash', label: 'በጥሬ ገንዘብ (Cash)' },
                    { id: 'bank_transfer', label: 'የባንክ ዝውውር' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as FeePaymentRecord['paymentMethod'])}
                      className={`py-2 px-2 rounded-xl border text-center transition-all ${
                        paymentMethod === m.id
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ተጨማሪ ማስታወሻ (አማራጭ)
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="የግብይት ማረጋገጫ ቁጥር ወይም ሌላ ማስታወሻ..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCollectModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>ክፍያውን ተቀበል እና ደረሰኝ ቁረጥ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Expense */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-rose-800 to-slate-950 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <TrendingDown className="w-5 h-5 text-rose-300" />
                <h3 className="font-bold text-base">የትምህርት ቤት አስተዳደራዊ ወጪ መመዝገቢያ</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExpenseModal(false)}
                className="text-rose-200 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  የወጪ ርዕስ / ምክንያት *
                </label>
                <input
                  type="text"
                  required
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="ምሳሌ፡ የመማሪያ ክፍሎች ጥገና፣ የላብራቶሪ ዕቃዎች..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    የወጪ ምድብ (Category) *
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) =>
                      setExpenseCategory(e.target.value as SchoolExpenseRecord['category'])
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="salary">የሰራተኞች ደሞዝ</option>
                    <option value="supplies">የትምህርት ግብአቶችና ዕቃዎች</option>
                    <option value="utilities">መብራት፣ ውሃ እና ኢንተርኔት</option>
                    <option value="maintenance">ጥገና እና እድሳት</option>
                    <option value="events">ስፖርት እና ሁነቶች</option>
                    <option value="other">ሌሎች ወጪዎች</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    የወጪ መጠን (ETB ብር) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    የተከፈለለት አካል / ድርጅት
                  </label>
                  <input
                    type="text"
                    value={expensePaidTo}
                    onChange={(e) => setExpensePaidTo(e.target.value)}
                    placeholder="አቅራቢ ድርጅት ወይም ግለሰብ..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ያጸደቀው ኃላፊ
                  </label>
                  <input
                    type="text"
                    value={expenseApprovedBy}
                    onChange={(e) => setExpenseApprovedBy(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-800 hover:bg-rose-900 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>ወጪውን መዝግብ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Printable Digital Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Printable Receipt Body */}
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
                    {selectedReceipt.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between py-2.5 bg-emerald-50/80 px-3 rounded-xl border border-emerald-200 text-sm">
                  <span className="font-black text-emerald-950">የተከፈለ ጠቅላላ ድምር፡</span>
                  <span className="font-black text-emerald-900 font-mono">
                    {selectedReceipt.amount.toLocaleString()} ETB (ብር)
                  </span>
                </div>
              </div>

              <div className="pt-2 text-center text-[10px] text-slate-400 space-y-1">
                <p>ክፍያውን የተቀበለው ሒሳብ ሹም፡ {selectedReceipt.collectedBy}</p>
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
