import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  CheckCircle2,
  XCircle,
  Eye,
  Building2,
  DollarSign,
  CreditCard,
  FileText,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Phone,
  Search,
  Filter,
  Check,
  X,
  Plus,
  Trash2,
  Copy,
  Landmark,
  Mail,
  HelpCircle,
  Power
} from 'lucide-react';
import {
  School,
  DeveloperPaymentReceipt,
  DeveloperPaymentConfig,
  DeveloperPaymentStatus,
  DeveloperCustomBankAccount
} from '../types';
import { StorageService } from '../utils/storage';
import { ShashemeneEducationBureauEmblem } from './ShashemeneEducationBureauEmblem';

interface SecretDeveloperPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchoolStatusChanged?: () => void;
}

export const SecretDeveloperPortalModal: React.FC<SecretDeveloperPortalModalProps> = ({
  isOpen,
  onClose,
  onSchoolStatusChanged
}) => {
  const SECRET_PASSWORD = 'tameratale6576';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'schools' | 'receipts' | 'settings'>('schools');

  const [schools, setSchools] = useState<School[]>([]);
  const [receipts, setReceipts] = useState<DeveloperPaymentReceipt[]>([]);
  const [config, setConfig] = useState<DeveloperPaymentConfig>(StorageService.getDeveloperConfig());

  // Search and filter
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<DeveloperPaymentStatus | 'all'>('all');

  // Selected receipt for detailed preview
  const [selectedReceipt, setSelectedReceipt] = useState<DeveloperPaymentReceipt | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [isRejectingId, setIsRejectingId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');

  // Editable config state
  const [editFee, setEditFee] = useState<number>(config.feeAmount);
  const [editCbe, setEditCbe] = useState<string>(config.cbeAccount);
  const [editTelebirr, setEditTelebirr] = useState<string>(config.telebirrNumber);
  const [editAwash, setEditAwash] = useState<string>(config.awashAccount);
  const [editDashen, setEditDashen] = useState<string>(config.dashenAccount);
  const [editHolder, setEditHolder] = useState<string>(config.accountHolder);
  const [editPhone, setEditPhone] = useState<string>(config.developerPhone || '+251 91 102 9070');
  const [editSecondaryPhone, setEditSecondaryPhone] = useState<string>(config.secondaryPhone || '+251 70 137 0299');
  const [editEmail, setEditEmail] = useState<string>(config.developerEmail || 'tameratale09@gmail.com');
  const [editInstructions, setEditInstructions] = useState<string>(config.instructionsAm || '');
  const [configSavedToast, setConfigSavedToast] = useState<boolean>(false);

  // Bank Accounts Management State
  const [bankAccountsList, setBankAccountsList] = useState<DeveloperCustomBankAccount[]>(config.bankAccounts || []);
  const [newBankName, setNewBankName] = useState<string>('የኢትዮጵያ ንግድ ባንክ (CBE)');
  const [customBankNameInput, setCustomBankNameInput] = useState<string>('');
  const [newAccountNumber, setNewAccountNumber] = useState<string>('');
  const [newAccountHolder, setNewAccountHolder] = useState<string>(config.accountHolder || 'ታምራት አሌ (Tamerat Ale)');
  const [newBranchOrPhone, setNewBranchOrPhone] = useState<string>('ሻሸመኔ ቅርንጫፍ');
  const [newAccountNotes, setNewAccountNotes] = useState<string>('ዋና የክፍያ መቀበያ ሂሳብ');
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);
  const [bankAddSuccessToast, setBankAddSuccessToast] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    const loadedSchools = StorageService.getSchools();
    const loadedReceipts = StorageService.getDeveloperPayments();
    const loadedConfig = StorageService.getDeveloperConfig();

    setSchools(loadedSchools);
    setReceipts(loadedReceipts);
    setConfig(loadedConfig);
    setEditFee(loadedConfig.feeAmount);
    setEditCbe(loadedConfig.cbeAccount);
    setEditTelebirr(loadedConfig.telebirrNumber);
    setEditAwash(loadedConfig.awashAccount);
    setEditDashen(loadedConfig.dashenAccount);
    setEditHolder(loadedConfig.accountHolder);
    setEditPhone(loadedConfig.developerPhone || '+251 91 102 9070');
    setEditSecondaryPhone(loadedConfig.secondaryPhone || '+251 70 137 0299');
    setEditEmail(loadedConfig.developerEmail || 'tameratale09@gmail.com');
    setEditInstructions(loadedConfig.instructionsAm || '');
    setBankAccountsList(loadedConfig.bankAccounts || []);
    setNewAccountHolder(loadedConfig.accountHolder || 'ታምራት አሌ (Tamerat Ale)');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === SECRET_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
      loadData();
    } else {
      setAuthError('የተሳሳተ የይለፍ ቃል ነው! እባክዎ ትክክለኛውን የአበልፃጊ ሚስጥር ቃል ያስገቡ።');
    }
  };

  const handleApproveSchool = (schoolId: string, receiptId?: string) => {
    const success = StorageService.approveDeveloperPayment(receiptId || schoolId, 'ታምራት ዓለ (Developer)');
    if (success) {
      loadData();
      setActionSuccessMsg('✅ የትምህርት ቤቱ ክፍያ ፀድቋል! አሁን ከትምህርት ቢሮ ጋር ሙሉ ግንኙነት ማድረግ ይችላል።');
      setTimeout(() => setActionSuccessMsg(''), 4000);
      if (onSchoolStatusChanged) onSchoolStatusChanged();
    }
  };

  const handleRejectSchool = (schoolId: string, receiptId: string) => {
    if (!rejectReason.trim()) {
      alert('እባክዎ ደረሰኙ ውድቅ የተደረገበትን ምክንያት ያስገቡ።');
      return;
    }
    const success = StorageService.rejectDeveloperPayment(receiptId || schoolId, rejectReason, 'ታምራት ዓለ (Developer)');
    if (success) {
      setIsRejectingId(null);
      setRejectReason('');
      loadData();
      setActionSuccessMsg('❌ ደረሰኙ ውድቅ ተደርጓል፤ ትምህርት ቤቱ ደግሞ እንዲያስገባ ተመልሷል።');
      setTimeout(() => setActionSuccessMsg(''), 4000);
      if (onSchoolStatusChanged) onSchoolStatusChanged();
    }
  };

  const handleRevokeSchool = (schoolId: string) => {
    if (window.confirm('የትምህርት ቤቱን የቢሮ ግንኙነት ፈቃድ ማገድ (መቆለፍ) ይፈልጋሉ? ደግመው እስኪያፀድቁ ድረስ ከትምህርት ቢሮ ጋር መገናኘት አይችሉም።')) {
      const success = StorageService.revokeDeveloperPayment(schoolId, 'ታምራት ዓለ (Developer)');
      if (success) {
        loadData();
        setActionSuccessMsg('🔒 የትምህርት ቤቱ ግንኙነት ታግዷል (ተቆልፏል)።');
        setTimeout(() => setActionSuccessMsg(''), 4000);
        if (onSchoolStatusChanged) onSchoolStatusChanged();
      }
    }
  };

  // Add a new custom or preset bank account
  const handleAddNewBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBankName = newBankName === 'ሌላ (Custom Bank)' ? customBankNameInput.trim() : newBankName;
    if (!finalBankName || !newAccountNumber.trim()) {
      alert('እባክዎ የባንክ ስም እና የሂሳብ ቁጥር ያስገቡ');
      return;
    }

    const newAcc: DeveloperCustomBankAccount = {
      id: `bank-${Date.now()}`,
      bankName: finalBankName,
      accountNumber: newAccountNumber.trim(),
      accountHolder: newAccountHolder.trim() || editHolder || 'ታምራት ዓለ (Tamerat Ale)',
      branchOrPhone: newBranchOrPhone.trim() || undefined,
      notes: newAccountNotes.trim() || undefined,
      isActive: true
    };

    const updatedList = [newAcc, ...bankAccountsList];
    setBankAccountsList(updatedList);
    setNewAccountNumber('');
    setNewAccountNotes('');
    if (newBankName === 'ሌላ (Custom Bank)') {
      setCustomBankNameInput('');
      setNewBankName('የኢትዮጵያ ንግድ ባንክ (CBE)');
    }

    const updatedConfig: DeveloperPaymentConfig = {
      ...config,
      bankAccounts: updatedList
    };
    StorageService.saveDeveloperConfig(updatedConfig);
    setConfig(updatedConfig);
    setBankAddSuccessToast(true);
    setTimeout(() => setBankAddSuccessToast(false), 3500);
  };

  const handleDeleteBankAccount = (id: string, bankName: string) => {
    if (window.confirm(`የ"${bankName}" የባንክ ሂሳብን ከመዝገብ ላይ መሰረዝ ይፈልጋሉ?`)) {
      const updatedList = bankAccountsList.filter((b) => b.id !== id);
      setBankAccountsList(updatedList);
      const updatedConfig: DeveloperPaymentConfig = {
        ...config,
        bankAccounts: updatedList
      };
      StorageService.saveDeveloperConfig(updatedConfig);
      setConfig(updatedConfig);
    }
  };

  const handleToggleBankAccountActive = (id: string) => {
    const updatedList = bankAccountsList.map((b) =>
      b.id === id ? { ...b, isActive: !b.isActive } : b
    );
    setBankAccountsList(updatedList);
    const updatedConfig: DeveloperPaymentConfig = {
      ...config,
      bankAccounts: updatedList
    };
    StorageService.saveDeveloperConfig(updatedConfig);
    setConfig(updatedConfig);
  };

  const handleCopyBankAccount = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBankId(id);
    setTimeout(() => setCopiedBankId(null), 2000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: DeveloperPaymentConfig = {
      ...config,
      feeAmount: Number(editFee) || 5000,
      cbeAccount: editCbe.trim(),
      telebirrNumber: editTelebirr.trim(),
      awashAccount: editAwash.trim(),
      dashenAccount: editDashen.trim(),
      accountHolder: editHolder.trim(),
      developerPhone: editPhone.trim(),
      secondaryPhone: editSecondaryPhone.trim(),
      developerEmail: editEmail.trim(),
      instructionsAm: editInstructions.trim(),
      bankAccounts: bankAccountsList
    };
    StorageService.saveDeveloperConfig(updated);
    setConfig(updated);
    setConfigSavedToast(true);
    setTimeout(() => setConfigSavedToast(false), 3000);
  };

  if (!isOpen) return null;

  // Filtered schools
  const filteredSchools = schools.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.subcity && s.subcity.toLowerCase().includes(searchTerm.toLowerCase()));

    const status = s.developerPaymentStatus || 'pending_payment';
    const matchesStatus = statusFilter === 'all' || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalApproved = schools.filter(s => s.developerPaymentStatus === 'approved').length;
  const totalSubmitted = schools.filter(s => s.developerPaymentStatus === 'receipt_submitted').length;
  const totalPending = schools.filter(s => !s.developerPaymentStatus || s.developerPaymentStatus === 'pending_payment').length;
  const totalRevenue = totalApproved * config.feeAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex justify-center items-start sm:items-center p-0 sm:p-4 md:p-6">
      <div className="bg-slate-900 border-0 sm:border border-amber-500/30 rounded-none sm:rounded-2xl w-full max-w-5xl shadow-2xl text-slate-100 flex flex-col min-h-screen sm:min-h-0 sm:max-h-[92vh] sm:overflow-hidden">

        {/* 1. PASSWORD GATE (If not authenticated) */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-12 max-w-md mx-auto w-full text-center my-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-600/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-lg">
              <KeyRound className="w-8 h-8" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-bold text-amber-300 mb-2">
              ታሜና ሥራው ኃ/የተ/የግ/ማ · ውሽዬ ሶፍትዌር ሶሉሽን
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-1">
              የሲስተም አበልፃጊ ሚስጥራዊ በር
            </h2>
            <p className="text-xs text-amber-200/90 font-semibold mb-3">
              ዋና ቀዳሚ ፕሮግራመር፡ ታምራት አሌ | ሻሸመኔ
            </p>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              ይህ ገፅ ለሲስተም አበልፃጊ (Developer) ብቻ የተፈቀደ ሚስጥራዊ መቆጣጠሪያ ነው። የትምህርት ቤቶችን የክፍያ ደረሰኝ ለማረጋገጥ፣ የባንክ ሂሳቦችን ለማስተዳደር እና ወደ ትምህርት ቢሮ የመገናኘት ፈቃድ ለመስጠት የይለፍ ቃል ያስገቡ።
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="የይለፍ ቃል ያስገቡ..."
                    autoFocus
                    className="w-full pl-11 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
                  />
                </div>
                {authError && (
                  <p className="mt-2 text-xs text-rose-400 flex items-center justify-center gap-1.5 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {authError}
                  </p>
                )}
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition cursor-pointer"
                >
                  ሰርዝ (ውጣ)
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-sm font-bold shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  ግባ (ክፈት)
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
              የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ የትምህርት መረጃ አያያዝ ቴክኖሎጂ
            </div>
          </div>
        ) : (
          /* 2. AUTHENTICATED DEVELOPER PORTAL */
          <>
            {/* Top Bar Header */}
            <div className="px-4 py-3.5 sm:px-5 sm:py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between sm:shrink-0 sticky top-0 z-30 sm:static">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      የሲስተም አበልፃጊ መቆጣጠሪያ ማዕከል
                    </h2>
                    <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md">
                      Developer Mode
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    <span className="text-amber-300 font-bold">ታሜና ሥራው ኃ/የተ/የግ/ማ</span> ስር <span className="text-amber-200 font-semibold">ውሽዬ ሶፍትዌር ሶሉሽን</span> | ዋና ፕሮግራመር፡ <strong className="text-white">ታምራት አሌ</strong> (ሻሸመኔ)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => {
                    loadData();
                    setActionSuccessMsg('ዳታው በድጋሚ ተነቧል');
                    setTimeout(() => setActionSuccessMsg(''), 2000);
                  }}
                  title="ዳታ አድስ"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-200 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Success toast notification */}
            {actionSuccessMsg && (
              <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-4 py-2 text-xs text-emerald-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {actionSuccessMsg}
              </div>
            )}

            {/* KPI Cards Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 p-3 sm:p-4 bg-slate-950/60 border-b border-slate-800 sm:shrink-0">
              <div className="p-2.5 sm:p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span className="text-[11px] sm:text-xs">ጠቅላላ ት/ቤቶች</span>
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="text-base sm:text-lg font-black text-white">{schools.length}</div>
              </div>

              <div className="p-2.5 sm:p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl">
                <div className="flex items-center justify-between text-emerald-300 text-xs mb-1">
                  <span className="text-[11px] sm:text-xs">የተፈቀደላቸው (የተገናኙ)</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-base sm:text-lg font-black text-emerald-400">{totalApproved}</div>
              </div>

              <div className="p-2.5 sm:p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl">
                <div className="flex items-center justify-between text-amber-300 text-xs mb-1">
                  <span className="text-[11px] sm:text-xs">ደረሰኝ የቀረበላቸው</span>
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-base sm:text-lg font-black text-amber-400">{totalSubmitted}</div>
              </div>

              <div className="p-2.5 sm:p-3 bg-sky-950/20 border border-sky-800/40 rounded-xl">
                <div className="flex items-center justify-between text-sky-300 text-xs mb-1">
                  <span className="text-[11px] sm:text-xs">የተሰበሰበ ገቢ</span>
                  <DollarSign className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-base sm:text-lg font-black text-sky-300">
                  {totalRevenue.toLocaleString()} <span className="text-[11px] font-normal text-slate-400">ብር</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Sticky on mobile for instant access) */}
            <div className="flex items-center gap-1 px-3 sm:px-5 border-b border-slate-800 bg-slate-900/95 sm:shrink-0 overflow-x-auto sticky top-[57px] sm:static z-20 scrollbar-none">
              <button
                onClick={() => setActiveTab('schools')}
                className={`py-3 px-3 sm:px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 sm:gap-2 transition shrink-0 cursor-pointer ${
                  activeTab === 'schools'
                    ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>ትምህርት ቤቶች & ፈቃድ ({schools.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('receipts')}
                className={`py-3 px-3 sm:px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 sm:gap-2 transition shrink-0 cursor-pointer ${
                  activeTab === 'receipts'
                    ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>የክፍያ ደረሰኞች</span>
                {totalSubmitted > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                    {totalSubmitted} አዲስ
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3 px-3 sm:px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 sm:gap-2 transition shrink-0 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>የባንክ አኮውንቶች ማስገቢያ & ቅንብር</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  {bankAccountsList.filter((b) => b.isActive).length} ባንኮች
                </span>
              </button>
            </div>

            {/* Tab Contents (Scrollable & connected seamlessly on mobile) */}
            <div className="p-3.5 sm:p-5 sm:overflow-y-auto flex-1 pb-32 sm:pb-6 space-y-4">

              {/* TAB 1: SCHOOLS & BUREAU CONNECTION */}
              {activeTab === 'schools' && (
                <div className="space-y-4">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="ትምህርት ቤት ወይም ኮድ ፈልግ..."
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                      <span className="text-xs text-slate-400 shrink-0">ሁኔታ፡</span>
                      {(['all', 'receipt_submitted', 'pending_payment', 'approved', 'rejected'] as const).map(st => (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`px-2.5 py-1 text-xs rounded-lg transition font-medium shrink-0 ${
                            statusFilter === st
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {st === 'all' && 'ሁሉም'}
                          {st === 'receipt_submitted' && 'ደረሰኝ የቀረበ'}
                          {st === 'pending_payment' && 'ያልከፈሉ'}
                          {st === 'approved' && 'የተገናኙ'}
                          {st === 'rejected' && 'ውድቅ'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Desktop Schools Table (Visible on sm screens and larger) */}
                  <div className="hidden sm:block overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/50">
                    <table className="w-full text-left text-xs min-w-[620px]">
                      <thead className="bg-slate-800/70 text-slate-400 border-b border-slate-800 uppercase font-semibold">
                        <tr>
                          <th className="py-3 px-3">ትምህርት ቤት</th>
                          <th className="py-3 px-2">ክፍለ ከተማ / ደረጃ</th>
                          <th className="py-3 px-2 text-center">የትምህርት ቢሮ ግንኙነት ሁኔታ</th>
                          <th className="py-3 px-3 text-right">እርምጃዎች</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {filteredSchools.map((sch) => {
                          const status = sch.developerPaymentStatus || 'pending_payment';
                          const receipt = receipts.find(r => r.schoolId === sch.id);

                          return (
                            <tr key={sch.id} className="hover:bg-slate-800/40 transition">
                              <td className="py-3 px-3">
                                <div className="font-bold text-white">{sch.name}</div>
                                <div className="text-[11px] text-slate-500 font-mono">
                                  ኮድ፡ {sch.code} · ተማሪ፡ {sch.totalStudents || 0}
                                </div>
                              </td>

                              <td className="py-3 px-2">
                                <div className="text-slate-300">{sch.subcity || 'ሻሸመኔ'}</div>
                                <div className="text-[11px] text-slate-500">
                                  {sch.level === 'primary' && 'አንደኛ ደረጃ (1-8)'}
                                  {sch.level === 'middle' && 'መካከለኛ ደረጃ (7-8)'}
                                  {sch.level === 'secondary' && 'ሁለተኛ ደረጃ (9-10)'}
                                  {sch.level === 'preparatory' && 'መሰናዶ (11-12)'}
                                  {sch.level === 'complete' && 'አጠቃላይ (1-12)'}
                                </div>
                              </td>

                              <td className="py-3 px-2 text-center">
                                {status === 'approved' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    የተገናኘ (ክፍት)
                                  </span>
                                )}

                                {status === 'receipt_submitted' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-400 border border-amber-500/40 animate-pulse">
                                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                                    ደረሰኝ ቀርቧል
                                  </span>
                                )}

                                {status === 'pending_payment' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                                    <Lock className="w-3.5 h-3.5 text-rose-400" />
                                    የተቆለፈ (ያልከፈለ)
                                  </span>
                                )}

                                {status === 'rejected' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950/80 text-rose-400 border border-rose-500/40">
                                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                    ውድቅ ተደርጓል
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                  {/* View Receipt button if available */}
                                  {receipt && (
                                    <button
                                      onClick={() => setSelectedReceipt(receipt)}
                                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition cursor-pointer"
                                      title="ደረሰኝ ተመልከት"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                      ደረሰኝ
                                    </button>
                                  )}

                                  {/* Approve Button */}
                                  {status !== 'approved' && (
                                    <button
                                      onClick={() => handleApproveSchool(sch.id, receipt?.id)}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer"
                                      title="ክፍያውን አፅድቅ እና ከቢሮ ጋር አገናኝ"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      አፅድቅ
                                    </button>
                                  )}

                                  {/* Reject Button (if submitted) */}
                                  {status === 'receipt_submitted' && receipt && (
                                    <button
                                      onClick={() => setIsRejectingId(sch.id)}
                                      className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                                      title="ደረሰኙን ውድቅ አድርግ"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                      ውድቅ
                                    </button>
                                  )}

                                  {/* Lock / Revoke if currently approved */}
                                  {status === 'approved' && (
                                    <button
                                      onClick={() => handleRevokeSchool(sch.id)}
                                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-800 text-slate-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                                      title="የቢሮ ግንኙነትን እገድ (ቆልፍ)"
                                    >
                                      <Lock className="w-3.5 h-3.5" />
                                      እገድ
                                    </button>
                                  )}
                                </div>

                                {/* Rejection reason input form inline */}
                                {isRejectingId === sch.id && receipt && (
                                  <div className="mt-2 p-2 bg-rose-950/40 border border-rose-800/60 rounded-lg text-left">
                                    <p className="text-[11px] text-rose-300 font-semibold mb-1">
                                      የውድቅ ምክንያት አስገባ፡
                                    </p>
                                    <input
                                      type="text"
                                      value={rejectReason}
                                      onChange={(e) => setRejectReason(e.target.value)}
                                      placeholder="ለምሳሌ፡ የግብይት ቁጥር አልተገኘም / ያልተሟላ ደረሰኝ"
                                      className="w-full px-2 py-1 bg-slate-900 border border-rose-700 rounded text-xs text-white placeholder-slate-500 mb-2 focus:outline-none"
                                    />
                                    <div className="flex justify-end gap-1.5">
                                      <button
                                        onClick={() => {
                                          setIsRejectingId(null);
                                          setRejectReason('');
                                        }}
                                        className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 cursor-pointer"
                                      >
                                        ሰርዝ
                                      </button>
                                      <button
                                        onClick={() => handleRejectSchool(sch.id, receipt.id)}
                                        className="px-2 py-0.5 rounded text-[11px] bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
                                      >
                                        አረጋግጥና ውድቅ አድርግ
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}

                        {filteredSchools.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-slate-500">
                              ምንም የተገኘ ትምህርት ቤት የለም።
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile School Cards List (Visible on smartphone screens < 640px) */}
                  <div className="block sm:hidden space-y-3">
                    {filteredSchools.map((sch) => {
                      const status = sch.developerPaymentStatus || 'pending_payment';
                      const receipt = receipts.find(r => r.schoolId === sch.id);

                      return (
                        <div
                          key={`mobile-${sch.id}`}
                          className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-3 shadow-sm"
                        >
                          {/* Header row: Name + Status */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-white text-sm">{sch.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                ኮድ፡ <span className="text-amber-400">{sch.code}</span> · {sch.subcity || 'ሻሸመኔ'}
                              </div>
                            </div>

                            {status === 'approved' && (
                              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                የተገናኘ
                              </span>
                            )}
                            {status === 'receipt_submitted' && (
                              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-500/40 animate-pulse">
                                <FileText className="w-3 h-3 text-amber-400" />
                                ደረሰኝ ቀርቧል
                              </span>
                            )}
                            {status === 'pending_payment' && (
                              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                                <Lock className="w-3 h-3 text-rose-400" />
                                ያልከፈለ
                              </span>
                            )}
                            {status === 'rejected' && (
                              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 text-rose-400 border border-rose-500/40">
                                <XCircle className="w-3 h-3 text-rose-400" />
                                ውድቅ
                              </span>
                            )}
                          </div>

                          {/* Level and student count */}
                          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800/80">
                            <span>
                              {sch.level === 'primary' && 'አንደኛ ደረጃ (1-8)'}
                              {sch.level === 'middle' && 'መካከለኛ ደረጃ (7-8)'}
                              {sch.level === 'secondary' && 'ሁለተኛ ደረጃ (9-10)'}
                              {sch.level === 'preparatory' && 'መሰናዶ (11-12)'}
                              {sch.level === 'complete' && 'አጠቃላይ (1-12)'}
                            </span>
                            <span className="font-semibold text-slate-300">
                              {sch.totalStudents || 0} ተማሪዎች
                            </span>
                          </div>

                          {/* Action Buttons for Mobile Touch */}
                          <div className="flex items-center gap-2 pt-1 border-t border-slate-700/60 flex-wrap">
                            {receipt && (
                              <button
                                onClick={() => setSelectedReceipt(receipt)}
                                className="flex-1 py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-sky-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition touch-manipulation cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                ደረሰኝ እይ
                              </button>
                            )}

                            {status !== 'approved' && (
                              <button
                                onClick={() => handleApproveSchool(sch.id, receipt?.id)}
                                className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition touch-manipulation cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                አፅድቅና ፍቀድ
                              </button>
                            )}

                            {status === 'receipt_submitted' && receipt && (
                              <button
                                onClick={() => setIsRejectingId(sch.id)}
                                className="py-2 px-3 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1 transition touch-manipulation cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                ውድቅ
                              </button>
                            )}

                            {status === 'approved' && (
                              <button
                                onClick={() => handleRevokeSchool(sch.id)}
                                className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-800 text-slate-300 hover:text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition touch-manipulation cursor-pointer"
                              >
                                <Lock className="w-3.5 h-3.5" />
                                የቢሮ ግንኙነትን እገድ
                              </button>
                            )}
                          </div>

                          {/* Rejection input inline on mobile */}
                          {isRejectingId === sch.id && receipt && (
                            <div className="p-2.5 bg-rose-950/50 border border-rose-800/80 rounded-lg text-left space-y-2">
                              <p className="text-[11px] text-rose-300 font-semibold">
                                የውድቅ ምክንያት አስገባ፡
                              </p>
                              <input
                                type="text"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="ለምሳሌ፡ የግብይት ቁጥር አልተገኘም..."
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-rose-700 rounded text-xs text-white placeholder-slate-500 focus:outline-none"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setIsRejectingId(null);
                                    setRejectReason('');
                                  }}
                                  className="px-3 py-1 rounded text-xs bg-slate-800 text-slate-300 cursor-pointer"
                                >
                                  ሰርዝ
                                </button>
                                <button
                                  onClick={() => handleRejectSchool(sch.id, receipt.id)}
                                  className="px-3 py-1 rounded text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
                                >
                                  አረጋግጥና ውድቅ
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {filteredSchools.length === 0 && (
                      <div className="py-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        ምንም የተገኘ ትምህርት ቤት የለም።
                      </div>
                    )}
                  </div>

                  {/* Informational Callout */}
                  <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300">የአበልፃጊ ጥበቃ ደንብ፡ </span>
                      ትምህርት ቤቱ ደረሰኝ እስካላስገባ እና በአበልፃጊው (ታምራት ዓለ) እስካልፀደቀ ድረስ ወደ ሻሸመኔ ከተማ ትምህርት ቢሮ ምንም አይነት ሪፖርት መላክ፣ የተማሪ ውጤት ማስተላለፍ ወይም ኦፊሴላዊ መረጃ መለዋወጥ አይችልም።
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RECEIPTS VAULT */}
              {activeTab === 'receipts' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">የባንክ ደረሰኞች መዝገብ</h3>
                      <p className="text-xs text-slate-400">የትምህርት ቤቶች የገቢ ማረጋገጫዎች ዝርዝር</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {receipts.map((rec) => {
                      const sch = schools.find(s => s.id === rec.schoolId);

                      return (
                        <div
                          key={rec.id}
                          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <h4 className="font-bold text-white text-sm">
                                  {rec.schoolName || sch?.name}
                                </h4>
                                <div className="text-[11px] text-slate-400">
                                  የተከፈለበት ባንክ፡ <span className="text-amber-300 font-bold">{rec.bankName}</span>
                                </div>
                              </div>

                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                  rec.status === 'approved'
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                                    : rec.status === 'rejected'
                                    ? 'bg-rose-950 text-rose-400 border border-rose-700'
                                    : 'bg-amber-950 text-amber-400 border border-amber-700 animate-pulse'
                                }`}
                              >
                                {rec.status === 'approved' ? 'የፀደቀ' : rec.status === 'rejected' ? 'ውድቅ' : 'ያልተረጋገጠ'}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 mb-3 font-mono">
                              <div>
                                <span className="text-slate-500 block text-[10px]">የግብይት ቁጥር (Ref)</span>
                                <span className="text-slate-200 font-semibold">{rec.transactionRef}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[10px]">መጠን (Amount)</span>
                                <span className="text-emerald-400 font-bold">{rec.amount.toLocaleString()} ብር</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[10px]">ከፋይ (Depositor)</span>
                                <span className="text-slate-300">{rec.payerName}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[10px]">ቀን</span>
                                <span className="text-slate-400">{rec.submittedAt?.split('T')[0] || rec.submittedAt}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800 gap-2">
                            <button
                              onClick={() => setSelectedReceipt(rec)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-300 flex items-center gap-1.5 transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              ደረሰኙን እይ
                            </button>

                            {rec.status !== 'approved' && (
                              <button
                                onClick={() => handleApproveSchool(rec.schoolId, rec.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm transition"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                አፅድቅና ፍቀድ
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {receipts.length === 0 && (
                      <div className="col-span-2 py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        እስካሁን የቀረበ ደረሰኝ የለም።
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: BANK ACCOUNTS ENTRY & FEE SETTINGS */}
              {activeTab === 'settings' && (
                <div className="max-w-4xl mx-auto space-y-5">
                  {/* Top Notice Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-indigo-950/40 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 mt-0.5">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>የአበልፃጊው ይፋዊ የባንክ አኮውንት ማስገቢያ እና ማስተዳደሪያ</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                            {bankAccountsList.filter((b) => b.isActive).length} ንቁ ባንኮች
                          </span>
                        </h3>
                        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                          ትምህርት ቤቶች ሲመዘገቡ በክፍያ ገፃቸው ላይ የሚታዩላቸውን ማንኛውንም የባንክ ሂሳቦች እዚህ ያስገቡ፣ ያሻሽሉ፣ ወይም አዲስ ይጨምሩ።
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-right">
                        <span className="text-[10px] text-slate-400 block font-sans">የፈቃድ ክፍያ ታሪፍ</span>
                        <span className="text-xs font-black text-emerald-400 font-mono">
                          {editFee.toLocaleString()} {config.currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 1. BANK ACCOUNT ENTRY FORM (አዲስ የባንክ ሂሳብ ማስገቢያ ቦታ) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                          <Plus className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-white">
                            አዲስ የባንክ ሂሳብ ማስገቢያ ቦታ (Add Bank Account)
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            የባንክ ስም፣ የሂሳብ ቁጥር እና የባለቤት ስም በማስገባት ለት/ቤቶች ይፋ ያድርጉ
                          </span>
                        </div>
                      </div>

                      {bankAddSuccessToast && (
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>አዲሱ የባንክ ሂሳብ ተመዝግቧል!</span>
                        </span>
                      )}
                    </div>

                    <form onSubmit={handleAddNewBankAccount} className="space-y-4">
                      {/* Fast Bank Presets Chips */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-2">
                          1. ባንክ ይምረጡ (ወይም ፈጣን ምርጫን ይጫኑ)፡
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'የኢትዮጵያ ንግድ ባንክ (CBE)',
                            'ቴሌብር (Telebirr)',
                            'አዋሽ ባንክ (Awash Bank)',
                            'ዳሸን ባንክ (Dashen Bank)',
                            'አቢሲንያ ባንክ (Bank of Abyssinia)',
                            'ኦሮሚያ ህብረት ስራ ባንክ (Coop Bank)',
                            'ወጋገን ባንክ (Wegagen Bank)',
                            'ህብረት ባንክ (Hibret Bank)',
                            'ዘመን ባንክ (Zemen Bank)',
                            'ሲንቄ ባንክ (Siinqee Bank)',
                            'ንብ ባንክ (Nib Bank)',
                            'ብርሃን ባንክ (Berhan Bank)',
                            'አንበሳ ባንክ (Lion Bank)',
                            'ሌላ (Custom Bank)'
                          ].map((bName) => (
                            <button
                              key={bName}
                              type="button"
                              onClick={() => {
                                setNewBankName(bName);
                                if (bName !== 'ሌላ (Custom Bank)') {
                                  setCustomBankNameInput('');
                                }
                              }}
                              className={`px-2.5 py-1 text-xs rounded-lg transition font-medium cursor-pointer ${
                                newBankName === bName
                                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm ring-2 ring-amber-400'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/80'
                              }`}
                            >
                              {bName}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Bank Name input if "ሌላ" is selected */}
                      {newBankName === 'ሌላ (Custom Bank)' && (
                        <div>
                          <label className="block text-xs font-semibold text-amber-300 mb-1">
                            የባንኩን ትክክለኛ ስም ይፃፉ፡
                          </label>
                          <input
                            type="text"
                            value={customBankNameInput}
                            onChange={(e) => setCustomBankNameInput(e.target.value)}
                            placeholder="ለምሳሌ፡ ጋዳ ባንክ (Gadaa Bank) / ፀደይ ባንክ (Tsedey Bank)"
                            className="w-full px-3 py-2 bg-slate-800/90 border border-amber-500/50 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                            required
                          />
                        </div>
                      )}

                      {/* Fields: Account Number + Holder + Branch */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-1">
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            የባንክ ሂሳብ ቁጥር (Account Number) *
                          </label>
                          <input
                            type="text"
                            value={newAccountNumber}
                            onChange={(e) => setNewAccountNumber(e.target.value)}
                            placeholder="ለምሳሌ፡ 1000293847561"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            የሂሳቡ ባለቤት ስም (Account Holder)
                          </label>
                          <input
                            type="text"
                            value={newAccountHolder}
                            onChange={(e) => setNewAccountHolder(e.target.value)}
                            placeholder="ታምራት ዓለ (Tamerat Ale)"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            ቅርንጫፍ ወይም ስልክ (Branch/Phone)
                          </label>
                          <input
                            type="text"
                            value={newBranchOrPhone}
                            onChange={(e) => setNewBranchOrPhone(e.target.value)}
                            placeholder="ሻሸመኔ ቅርንጫፍ / +251 9..."
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      {/* Notes and Submit button */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={newAccountNotes}
                            onChange={(e) => setNewAccountNotes(e.target.value)}
                            placeholder="ተጨማሪ ማስታወሻ (ለምሳሌ፡ ለሞባይል ባንኪንግ ወይም ለቅርንጫፍ ተቀማጭ)..."
                            className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black rounded-xl shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                          <span>አዲሱን የባንክ ሂሳብ መዝግብ</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* 2. REGISTERED BANK ACCOUNTS LIST (የተመዘገቡ የባንክ ሂሳቦች ዝርዝር) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-amber-400" />
                        <span>በትምህርት ቤቶች ክፍያ ገጽ ላይ የሚታዩ የባንክ ሂሳቦች ({bankAccountsList.length})</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {bankAccountsList.filter((b) => b.isActive).length} ንቁ መቀበያዎች
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {bankAccountsList.map((acc) => (
                        <div
                          key={acc.id}
                          className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                            acc.isActive
                              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                              : 'bg-slate-950/60 border-slate-900 opacity-60'
                          }`}
                        >
                          <div>
                            {/* Card Top Row */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                                  <Landmark className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-white leading-tight">
                                    {acc.bankName}
                                  </h5>
                                  <span className="text-[10px] text-slate-400">
                                    ባለቤት፡ <strong className="text-slate-200">{acc.accountHolder}</strong>
                                  </span>
                                </div>
                              </div>

                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  acc.isActive
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                                }`}
                              >
                                {acc.isActive ? 'ንቁ (Active)' : 'የተዘጋ'}
                              </span>
                            </div>

                            {/* Account Number Box */}
                            <div className="mt-2.5 p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-slate-500 block">የሂሳብ ቁጥር</span>
                                <span className="text-sm font-black font-mono text-amber-300">
                                  {acc.accountNumber}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleCopyBankAccount(acc.accountNumber, acc.id)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                              >
                                {copiedBankId === acc.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">ተቀድቷል!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>ቅዳ</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Subtitle / Notes */}
                            {(acc.branchOrPhone || acc.notes) && (
                              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                                {acc.branchOrPhone && <span>📍 {acc.branchOrPhone}</span>}
                                {acc.notes && <span className="text-amber-200/80">ℹ️ {acc.notes}</span>}
                              </div>
                            )}
                          </div>

                          {/* Card Action Row */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                            <button
                              type="button"
                              onClick={() => handleToggleBankAccountActive(acc.id)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                                acc.isActive
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                  : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300'
                              }`}
                            >
                              <Power className="w-3 h-3" />
                              <span>{acc.isActive ? 'አጥፋ (Disable)' : 'አብራ (Enable)'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteBankAccount(acc.id, acc.bankName)}
                              className="px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>ሰርዝ</span>
                            </button>
                          </div>
                        </div>
                      ))}

                      {bankAccountsList.length === 0 && (
                        <div className="col-span-2 py-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                          ምንም የተመዘገበ የባንክ ሂሳብ የለም። እባክዎ ከላይ ባለው ቅጽ አዲስ የባንክ ሂሳብ ያስገቡ።
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. GENERAL FEE & CONTACT SETTINGS FORM */}
                  <form onSubmit={handleSaveConfig} className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
                    <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>አጠቃላይ የታሪፍ እና የአበልፃጊ መረጃ ቅንብሮች</span>
                    </h4>

                    {/* Corporate Pedigree & Engineering Team Card */}
                    <div className="p-3.5 bg-slate-950/80 rounded-xl border border-amber-500/30 text-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div>
                          <span className="text-[10px] text-amber-400 uppercase font-black">
                            የድርጅት መዋቅር (Company Structure)
                          </span>
                          <h5 className="font-bold text-white text-xs sm:text-sm">
                            ታሜና ሥራው ኃ/የተ/የግ/ማ (Tame & Seraw PLC)
                          </h5>
                          <p className="text-[11px] text-amber-200">
                            እህት ድርጅት፡ ውሽዬ ሶፍትዌር ሶሉሽን (Wushiye Software Solution)
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                          ሻሸመኔ፣ ኢትዮጵያ
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                        <div className="p-2 bg-slate-900 rounded-lg">
                          <span className="text-[9px] text-slate-400 block">ዋና ቀዳሚ ፕሮግራመር፡</span>
                          <strong className="text-white">ታምራት አሌ</strong>
                        </div>
                        <div className="p-2 bg-slate-900 rounded-lg">
                          <span className="text-[9px] text-slate-400 block">ባክኢንድ ኢንጅነር፡</span>
                          <strong className="text-white">ታምራት አሌ</strong>
                        </div>
                        <div className="p-2 bg-slate-900 rounded-lg">
                          <span className="text-[9px] text-slate-400 block">ፍሮንትኢንድ ኢንጅነር፡</span>
                          <strong className="text-white">ታምራት አሌ</strong>
                        </div>
                        <div className="p-2 bg-slate-900 rounded-lg">
                          <span className="text-[9px] text-slate-400 block">ዲዛይነር (UI/UX)፡</span>
                          <strong className="text-white">ታምራት አሌ</strong>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          የአመታዊ ፈቃድ ክፍያ መጠን (በብር) *
                        </label>
                        <input
                          type="number"
                          value={editFee}
                          onChange={(e) => setEditFee(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold text-emerald-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          ነባሪ የሂሳብ ባለቤት ስም (Default Account Holder)
                        </label>
                        <input
                          type="text"
                          value={editHolder}
                          onChange={(e) => setEditHolder(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-amber-400" />
                          <span>ዋና ስልክ ቁጥር (Primary Phone / ቴሌብር)</span>
                        </label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-sky-400" />
                          <span>ሁለተኛ ስልክ ቁጥር (Secondary Phone / ድጋፍ)</span>
                        </label>
                        <input
                          type="text"
                          value={editSecondaryPhone}
                          onChange={(e) => setEditSecondaryPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-amber-400" />
                          <span>የአበልፃጊ ኢሜይል (Developer Email)</span>
                        </label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        ለትምህርት ቤቶች የሚታይ የክፍያ መመሪያ ፅሁፍ (Instructions to Schools)
                      </label>
                      <textarea
                        rows={2}
                        value={editInstructions}
                        onChange={(e) => setEditInstructions(e.target.value)}
                        placeholder="ክፍያውን በንግድ ባንክ ወይም በቴሌብር ከፈጸሙ በኋላ..."
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      {configSavedToast ? (
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>ቅንብሩ በተሳካ ሁኔታ ተቀምጧል!</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          የተቀመጡ ለውጦች ወዲያውኑ ለት/ቤቶች ይተገበራሉ።
                        </span>
                      )}

                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>ቅንብሩን መዝግብ (Save Settings)</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Bottom Footer */}
            <div className="px-4 py-3 sm:px-5 sm:py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 sm:shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>ሲስተም ጥበቃ፡ ንቁ (Active Protection)</span>
              </div>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPasswordInput('');
                }}
                className="hover:text-rose-400 transition"
              >
                ይቆልፉና ይውጡ (Lock & Exit)
              </button>
            </div>
          </>
        )}

      </div>

      {/* MODAL: Full Receipt Inspection Popup */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-5 py-3.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-white text-sm">የባንክ ደረሰኝ ምርመራ</h4>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Slip Visual / Document */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  የተላከው የባንክ ደረሰኝ ቅጅ (Deposit Slip)
                </div>
                {selectedReceipt.receiptImageUrl ? (
                  <img
                    src={selectedReceipt.receiptImageUrl}
                    alt="Receipt Slip"
                    className="max-h-60 mx-auto rounded-lg border border-slate-800 object-contain shadow-md"
                  />
                ) : (
                  <div className="py-10 text-slate-500 text-xs font-mono">
                    የደረሰኝ ምስል አልተያያዘም
                  </div>
                )}
              </div>

              {/* Receipt Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60 font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">ትምህርት ቤት</span>
                  <span className="text-white font-bold">{selectedReceipt.schoolName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ባንክ</span>
                  <span className="text-amber-300 font-bold">{selectedReceipt.bankName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">የግብይት ቁጥር (FT / Ref)</span>
                  <span className="text-emerald-400 font-bold">{selectedReceipt.transactionRef}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">የተከፈለ ገንዘብ</span>
                  <span className="text-emerald-300 font-bold">{selectedReceipt.amount.toLocaleString()} ብር</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ከፋይ ግለሰብ</span>
                  <span className="text-slate-200">{selectedReceipt.payerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">የተከፈለበት ቀን</span>
                  <span className="text-slate-400">{selectedReceipt.submittedAt?.split('T')[0] || selectedReceipt.submittedAt}</span>
                </div>
                {selectedReceipt.notes && (
                  <div className="col-span-2 pt-1 border-t border-slate-700/60 text-slate-300 font-sans">
                    <span className="text-slate-400 block text-[10px]">ተጨማሪ ማስታወሻ፡</span>
                    {selectedReceipt.notes}
                  </div>
                )}
              </div>

              {/* Direct Actions on Receipt */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  ዝጋ
                </button>
                <button
                  onClick={() => {
                    handleApproveSchool(selectedReceipt.schoolId, selectedReceipt.id);
                    setSelectedReceipt(null);
                  }}
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  ይህን ደረሰኝ አፅድቅ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
