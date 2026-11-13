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
  Power,
  Globe
} from 'lucide-react';
import {
  Language,
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
  currentLang?: Language;
}

export const SecretDeveloperPortalModal: React.FC<SecretDeveloperPortalModalProps> = ({
  isOpen,
  onClose,
  onSchoolStatusChanged,
  currentLang = 'om'
}) => {
  const SECRET_PASSWORD = 'tameratale6576';
  const isOm = currentLang === 'om';
  const isEn = currentLang === 'en';
  const t3 = (om: string, en: string, am: string) => (isOm ? om : isEn ? en : am);

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
  const [rejectError, setRejectError] = useState<string>('');
  const [isRejectingId, setIsRejectingId] = useState<string | null>(null);
  const [confirmRevokeSchoolId, setConfirmRevokeSchoolId] = useState<string | null>(null);
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
  const [editWebsiteUrl, setEditWebsiteUrl] = useState<string>(config.websiteUrl || 'https://weshya-sofetyer-solshene.netlify.app/#deployment-modes');
  const [editInstructions, setEditInstructions] = useState<string>(config.instructionsAm || '');
  const [configSavedToast, setConfigSavedToast] = useState<boolean>(false);

  // Bank Accounts Management State
  const [bankAccountsList, setBankAccountsList] = useState<DeveloperCustomBankAccount[]>(config.bankAccounts || []);
  const [newBankName, setNewBankName] = useState<string>('Commercial Bank of Ethiopia (CBE)');
  const [customBankNameInput, setCustomBankNameInput] = useState<string>('');
  const [newAccountNumber, setNewAccountNumber] = useState<string>('');
  const [newAccountHolder, setNewAccountHolder] = useState<string>(config.accountHolder || 'Tamrat Ale (Tamerat Ale)');
  const [newBranchOrPhone, setNewBranchOrPhone] = useState<string>('Shashemene Branch');
  const [newAccountNotes, setNewAccountNotes] = useState<string>('');
  const [bankFormError, setBankFormError] = useState<string>('');
  const [confirmDeleteBankId, setConfirmDeleteBankId] = useState<string | null>(null);
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
    setEditWebsiteUrl(loadedConfig.websiteUrl || 'https://weshya-sofetyer-solshene.netlify.app/#deployment-modes');
    setEditInstructions(loadedConfig.instructionsAm || '');
    setBankAccountsList(loadedConfig.bankAccounts || []);
    setNewAccountHolder(loadedConfig.accountHolder || 'Tamerat Ale');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === SECRET_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
      loadData();
    } else {
      setAuthError(t3(
        'Jecha iccitii dogoggoraa! Maaloo jecha iccitii misoomsaa sirrii ta\'e galchaa.',
        'Incorrect password! Please enter the valid developer secret key.',
        'የተሳሳተ የይለፍ ቃል ነው! እባክዎ ትክክለኛውን የአበልፃጊ ሚስጥር ቃል ያስገቡ።'
      ));
    }
  };

  const handleApproveSchool = (schoolId: string, receiptId?: string) => {
    const success = StorageService.approveDeveloperPayment(receiptId || schoolId, 'Tamerat Ale (Developer)');
    if (success) {
      loadData();
      setActionSuccessMsg(t3(
        'Kaffaltiin mana barumsaa mirkanaa\'eera! Amma Biiroo Barnootaa waliin qunnamtii guutuu gochuu danda\'a.',
        'School payment approved! Full connection with the Education Bureau is now enabled.',
        'የትምህርት ቤቱ ክፍያ ፀድቋል! አሁን ከትምህርት ቢሮ ጋር ሙሉ ግንኙነት ማድረግ ይችላል።'
      ));
      setTimeout(() => setActionSuccessMsg(''), 4000);
      if (onSchoolStatusChanged) onSchoolStatusChanged();
    }
  };

  const handleRejectSchool = (schoolId: string, receiptId: string) => {
    if (!rejectReason.trim()) {
      setRejectError(t3(
        'Maaloo sababa nagaheen itti kufee galchaa.',
        'Please enter a rejection reason for the receipt.',
        'እባክዎ ደረሰኙ ውድቅ የተደረገበትን ምክንያት ያስገቡ።'
      ));
      return;
    }
    setRejectError('');
    const success = StorageService.rejectDeveloperPayment(receiptId || schoolId, rejectReason, 'Tamerat Ale (Developer)');
    if (success) {
      setIsRejectingId(null);
      setRejectReason('');
      loadData();
      setActionSuccessMsg(t3(
        'Nagaheen kufaa ta\'eera; manni barumsaa irra deebi\'ee akka galchu deebifameera.',
        'Receipt rejected; returned to the school for resubmission.',
        'ደረሰኙ ውድቅ ተደርጓል፤ ትምህርት ቤቱ ደግሞ እንዲያስገባ ተመልሷል።'
      ));
      setTimeout(() => setActionSuccessMsg(''), 4000);
      if (onSchoolStatusChanged) onSchoolStatusChanged();
    }
  };

  const handleRevokeSchool = (schoolId: string) => {
    const success = StorageService.revokeDeveloperPayment(schoolId, 'Tamerat Ale (Developer)');
    if (success) {
      setConfirmRevokeSchoolId(null);
      loadData();
      setActionSuccessMsg(t3(
        'Qunnamtiin mana barumsaa daangeffameera (cufameera).',
        'School Bureau connection has been suspended (locked).',
        'የትምህርት ቤቱ ግንኙነት ታግዷል (ተቆልፏል)።'
      ));
      setTimeout(() => setActionSuccessMsg(''), 4000);
      if (onSchoolStatusChanged) onSchoolStatusChanged();
    }
  };

  // Add a new custom or preset bank account
  const handleAddNewBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBankName = newBankName === '__custom__' ? customBankNameInput.trim() : newBankName;
    if (!finalBankName || !newAccountNumber.trim()) {
      setBankFormError(t3(
        'Maaloo maqaa baankii fi lakkoofsa herregaa galchaa.',
        'Please enter both the bank name and account number.',
        'እባክዎ የባንክ ስም እና የሂሳብ ቁጥር ያስገቡ።'
      ));
      return;
    }
    setBankFormError('');

    const newAcc: DeveloperCustomBankAccount = {
      id: `bank-${Date.now()}`,
      bankName: finalBankName,
      accountNumber: newAccountNumber.trim(),
      accountHolder: newAccountHolder.trim() || editHolder || 'Tamerat Ale',
      branchOrPhone: newBranchOrPhone.trim() || undefined,
      notes: newAccountNotes.trim() || undefined,
      isActive: true
    };

    const updatedList = [newAcc, ...bankAccountsList];
    setBankAccountsList(updatedList);
    setNewAccountNumber('');
    setNewAccountNotes('');
    if (newBankName === '__custom__') {
      setCustomBankNameInput('');
      setNewBankName('Commercial Bank of Ethiopia (CBE)');
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

  const handleDeleteBankAccount = (id: string) => {
    const updatedList = bankAccountsList.filter((b) => b.id !== id);
    setBankAccountsList(updatedList);
    setConfirmDeleteBankId(null);
    const updatedConfig: DeveloperPaymentConfig = {
      ...config,
      bankAccounts: updatedList
    };
    StorageService.saveDeveloperConfig(updatedConfig);
    setConfig(updatedConfig);
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
      websiteUrl: editWebsiteUrl.trim(),
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
              {t3('Tame & Seraw PLC · Wushiye Software Solution', 'Tame & Seraw PLC · Wushiye Software Solution', 'ታሜና ሥራው ኃ/የተ/የግ/ማ · ውሽዬ ሶፍትዌር ሶሉሽን')}
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-1">
              {t3('Karra Iccitii Misoomsaa Sirnaa', 'Secret Developer Portal', 'የሲስተም አበልፃጊ ሚስጥራዊ በር')}
            </h2>
            <p className="text-xs text-amber-200/90 font-semibold mb-3">
              {t3('Piroogiraamara Duraa: Tamerat Ale | Shashamane', 'Lead Programmer: Tamerat Ale | Shashemene', 'ዋና ቀዳሚ ፕሮግራመር፡ ታምራት አሌ | ሻሸመኔ')}
            </p>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              {t3(
                'Fuulli kun too\'annoo iccitii misoomsaa sirnaaf qofa eeyyamameedha. Nagahee kaffaltii manneen barnootaa mirkaneessuu, herrega baankii bulchuu fi eeyyama qunnamtii Biiroo kennuuf jecha iccitii galchaa.',
                'This portal is restricted to the System Developer. Enter your secret password to verify school payment receipts, manage bank accounts, and authorize Bureau connections.',
                'ይህ ገፅ ለሲስተም አበልፃጊ (Developer) ብቻ የተፈቀደ ሚስጥራዊ መቆጣጠሪያ ነው። የትምህርት ቤቶችን የክፍያ ደረሰኝ ለማረጋገጥ፣ የባንክ ሂሳቦችን ለማስተዳደር እና ወደ ትምህርት ቢሮ የመገናኘት ፈቃድ ለመስጠት የይለፍ ቃል ያስገቡ።'
              )}
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
                    placeholder={t3('Jecha iccitii galchaa...', 'Enter secret password...', 'የይለፍ ቃል ያስገቡ...')}
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
                  {t3('Haqi (Bahi)', 'Cancel', 'ሰርዝ (ውጣ)')}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-sm font-bold shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  {t3('Seeni (Bani)', 'Unlock', 'ግባ (ክፈት)')}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
              {t3('Teeknooloojii Qabinsa Odeeffannoo Biiroo Barnootaa Bulchiinsa Magaalaa Shashamannee', 'Shashemene City Administration Education Bureau Information Technology', 'የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ የትምህርት መረጃ አያያዝ ቴክኖሎጂ')}
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
                      {t3('Giddugala Too\'annoo Misoomsaa Sirnaa', 'System Developer Control Center', 'የሲስተም አበልፃጊ መቆጣጠሪያ ማዕከል')}
                    </h2>
                    <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md">
                      Developer Mode
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    <span className="text-amber-300 font-bold">{t3('Tame & Seraw PLC', 'Tame & Seraw PLC', 'ታሜና ሥራው ኃ/የተ/የግ/ማ')}</span> · <span className="text-amber-200 font-semibold">Wushiye Software Solution</span> | {t3('Piroogiraamara Duraa:', 'Lead Programmer:', 'ዋና ፕሮግራመር፡')} <strong className="text-white">Tamerat Ale</strong> ({t3('Shashamannee', 'Shashemene', 'ሻሸመኔ')})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => {
                    loadData();
                    setActionSuccessMsg(t3('Daataan irra deebi\'amee dubbifameera', 'Data refreshed', 'ዳታው በድጋሚ ተነቧል'));
                    setTimeout(() => setActionSuccessMsg(''), 2000);
                  }}
                  title={t3('Daataa haaromsi', 'Refresh data', 'ዳታ አድስ')}
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
                  <span className="text-[11px] sm:text-xs">{t3('Manneen Barnootaa Waliigalaa', 'Total Schools', 'ጠቅላላ ት/ቤቶች')}</span>
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="text-base sm:text-lg font-black text-white">{schools.length}</div>
              </div>

              <div className="p-2.5 sm:p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl">
                <div className="flex items-center justify-between text-emerald-300 text-xs mb-1">
                  <span className="text-[11px] sm:text-xs">{t3('Eeyyamaman (Kan Walqunnaman)', 'Approved (Connected)', 'የተፈቀደላቸው (የተገናኙ)')}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-base sm:text-lg font-black text-emerald-400">{totalApproved}</div>
              </div>

              <div className="p-2.5 sm:p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl">
                <div className="flex items-center justify-between text-amber-300 text-xs mb-1">
                  <span className="text-[11px] sm:text-xs">{t3('Nagahee Dhiheessan', 'Receipts Submitted', 'ደረሰኝ የቀረበላቸው')}</span>
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-base sm:text-lg font-black text-amber-400">{totalSubmitted}</div>
              </div>

              <div className="p-2.5 sm:p-3 bg-sky-950/20 border border-sky-800/40 rounded-xl">
                <div className="flex items-center justify-between text-sky-300 text-xs mb-1">
                  <span className="text-[11px] sm:text-xs">{t3('Galii Walitti Qabame', 'Collected Revenue', 'የተሰበሰበ ገቢ')}</span>
                  <DollarSign className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-base sm:text-lg font-black text-sky-300">
                  {totalRevenue.toLocaleString()} <span className="text-[11px] font-normal text-slate-400">{t3('ETB', 'ETB', 'ብር')}</span>
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
                <span>{t3(`Manneen Barnootaa & Eeyyama (${schools.length})`, `Schools & Licenses (${schools.length})`, `ትምህርት ቤቶች & ፈቃድ (${schools.length})`)}</span>
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
                <span>{t3('Nagaheewwan Kaffaltii', 'Payment Receipts', 'የክፍያ ደረሰኞች')}</span>
                {totalSubmitted > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                    {totalSubmitted} {t3('Haaraa', 'New', 'አዲስ')}
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
                <span>{t3('Galmee Herrega Baankii & Qindaa\'ina', 'Bank Accounts & Settings', 'የባንክ አኮውንቶች ማስገቢያ & ቅንብር')}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  {bankAccountsList.filter((b) => b.isActive).length} {t3('Baankiiwwan', 'Banks', 'ባንኮች')}
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
                        placeholder={t3('Mana barumsaa ykn koodii barbaadi...', 'Search school or code...', 'ትምህርት ቤት ወይም ኮድ ፈልግ...')}
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                      <span className="text-xs text-slate-400 shrink-0">{t3('Haala:', 'Status:', 'ሁኔታ፡')}</span>
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
                          {st === 'all' && t3('Hunda', 'All', 'ሁሉም')}
                          {st === 'receipt_submitted' && t3('Nagaheen Dhiyaate', 'Submitted', 'ደረሰኝ የቀረበ')}
                          {st === 'pending_payment' && t3('Kan Hin Kaffalle', 'Unpaid', 'ያልከፈሉ')}
                          {st === 'approved' && t3('Kan Walqunnaman', 'Connected', 'የተገናኙ')}
                          {st === 'rejected' && t3('Kufaa', 'Rejected', 'ውድቅ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Desktop Schools Table (Visible on sm screens and larger) */}
                  <div className="hidden sm:block overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/50">
                    <table className="w-full text-left text-xs min-w-[620px]">
                      <thead className="bg-slate-800/70 text-slate-400 border-b border-slate-800 uppercase font-semibold">
                        <tr>
                          <th className="py-3 px-3">{t3('Mana Barumsaa', 'School', 'ትምህርት ቤት')}</th>
                          <th className="py-3 px-2">{t3('Kutaa Magaalaa / Sadarkaa', 'Subcity / Level', 'ክፍለ ከተማ / ደረጃ')}</th>
                          <th className="py-3 px-2 text-center">{t3('Haala Qunnamtii Biiroo', 'Bureau Connection Status', 'የትምህርት ቢሮ ግንኙነት ሁኔታ')}</th>
                          <th className="py-3 px-3 text-right">{t3('Tarkaanfii', 'Actions', 'እርምጃዎች')}</th>
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
                                  {t3('Koodii:', 'Code:', 'ኮድ፡')} {sch.code} · {t3('Barataa:', 'Students:', 'ተማሪ፡')} {sch.totalStudents || 0}
                                </div>
                              </td>

                              <td className="py-3 px-2">
                                <div className="text-slate-300">{sch.subcity || t3('Shashamannee', 'Shashemene', 'ሻሸመኔ')}</div>
                                <div className="text-[11px] text-slate-500">
                                  {sch.level === 'primary' && t3('Sadarkaa 1ffaa (1-8)', 'Primary (1-8)', 'አንደኛ ደረጃ (1-8)')}
                                  {sch.level === 'middle' && t3('Sadarkaa Giddugaleessaa (7-8)', 'Middle (7-8)', 'መካከለኛ ደረጃ (7-8)')}
                                  {sch.level === 'secondary' && t3('Sadarkaa 2ffaa (9-10)', 'Secondary (9-10)', 'ሁለተኛ ደረጃ (9-10)')}
                                  {sch.level === 'preparatory' && t3('Qophaa\'ina (11-12)', 'Preparatory (11-12)', 'መሰናዶ (11-12)')}
                                  {sch.level === 'complete' && t3('Waliigalaa (1-12)', 'Complete (1-12)', 'አጠቃላይ (1-12)')}
                                </div>
                              </td>

                              <td className="py-3 px-2 text-center">
                                {status === 'approved' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    {t3('Walqunnameera (Banaa)', 'Connected (Open)', 'የተገናኘ (ክፍት)')}
                                  </span>
                                )}

                                {status === 'receipt_submitted' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-400 border border-amber-500/40 animate-pulse">
                                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                                    {t3('Nagaheen Dhiyaateera', 'Receipt Submitted', 'ደረሰኝ ቀርቧል')}
                                  </span>
                                )}

                                {status === 'pending_payment' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                                    <Lock className="w-3.5 h-3.5 text-rose-400" />
                                    {t3('Cufameera (Hin Kaffalle)', 'Locked (Unpaid)', 'የተቆለፈ (ያልከፈለ)')}
                                  </span>
                                )}

                                {status === 'rejected' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950/80 text-rose-400 border border-rose-500/40">
                                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                    {t3('Kufaa Ta\'eera', 'Rejected', 'ውድቅ ተደርጓል')}
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
                                      title={t3('Nagahee ilaali', 'View receipt', 'ደረሰኝ ተመልከት')}
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                      {t3('Nagahee', 'Receipt', 'ደረሰኝ')}
                                    </button>
                                  )}

                                  {/* Approve Button */}
                                  {status !== 'approved' && (
                                    <button
                                      onClick={() => handleApproveSchool(sch.id, receipt?.id)}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer"
                                      title={t3('Kaffaltii mirkaneessiitii Biiroo waliin walqunnamsiisi', 'Approve payment & connect to Bureau', 'ክፍያውን አፅድቅ እና ከቢሮ ጋር አገናኝ')}
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      {t3('Mirkaneessi', 'Approve', 'አፅድቅ')}
                                    </button>
                                  )}

                                  {/* Reject Button (if submitted) */}
                                  {status === 'receipt_submitted' && receipt && (
                                    <button
                                      onClick={() => {
                                        setIsRejectingId(sch.id);
                                        setRejectError('');
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                                      title={t3('Nagahee kufaa godhi', 'Reject receipt', 'ደረሰኙን ውድቅ አድርግ')}
                                    >
                                      <X className="w-3.5 h-3.5" />
                                      {t3('Kuffisi', 'Reject', 'ውድቅ')}
                                    </button>
                                  )}

                                  {/* Lock / Revoke if currently approved */}
                                  {status === 'approved' && (
                                    confirmRevokeSchoolId === sch.id ? (
                                      <div className="flex items-center gap-1 bg-rose-950/70 border border-rose-800 rounded-lg px-2 py-1">
                                        <span className="text-[10px] text-rose-200 font-semibold">{t3('Cufuu?', 'Suspend?', 'ይታገድ?')}</span>
                                        <button
                                          onClick={() => handleRevokeSchool(sch.id)}
                                          className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold cursor-pointer"
                                        >
                                          {t3('Eeyyee', 'Yes', 'አዎ')}
                                        </button>
                                        <button
                                          onClick={() => setConfirmRevokeSchoolId(null)}
                                          className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] cursor-pointer"
                                        >
                                          {t3('Lakki', 'No', 'አይ')}
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => setConfirmRevokeSchoolId(sch.id)}
                                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-800 text-slate-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                                        title={t3('Qunnamtii Biiroo daangessi (cufi)', 'Suspend Bureau connection (lock)', 'የቢሮ ግንኙነትን እገድ (ቆልፍ)')}
                                      >
                                        <Lock className="w-3.5 h-3.5" />
                                        {t3('Daangessi', 'Suspend', 'እገድ')}
                                      </button>
                                    )
                                  )}
                                </div>

                                {/* Rejection reason input form inline */}
                                {isRejectingId === sch.id && receipt && (
                                  <div className="mt-2 p-2 bg-rose-950/40 border border-rose-800/60 rounded-lg text-left">
                                    <p className="text-[11px] text-rose-300 font-semibold mb-1">
                                      {t3('Sababa kufaa ta\'uu galchi:', 'Enter rejection reason:', 'የውድቅ ምክንያት አስገባ፡')}
                                    </p>
                                    <input
                                      type="text"
                                      value={rejectReason}
                                      onChange={(e) => {
                                        setRejectReason(e.target.value);
                                        setRejectError('');
                                      }}
                                      placeholder={t3('Fkn: Lakkoofsi jijjiirraa hin argamne / Nagaheen guutuu miti', 'e.g., Transaction ref not found / Incomplete slip', 'ለምሳሌ፡ የግብይት ቁጥር አልተገኘም / ያልተሟላ ደረሰኝ')}
                                      className="w-full px-2 py-1 bg-slate-900 border border-rose-700 rounded text-xs text-white placeholder-slate-500 mb-1.5 focus:outline-none"
                                    />
                                    {rejectError && (
                                      <p className="text-[11px] text-rose-300 mb-1.5">{rejectError}</p>
                                    )}
                                    <div className="flex justify-end gap-1.5">
                                      <button
                                        onClick={() => {
                                          setIsRejectingId(null);
                                          setRejectReason('');
                                          setRejectError('');
                                        }}
                                        className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 cursor-pointer"
                                      >
                                        {t3('Haqi', 'Cancel', 'ሰርዝ')}
                                      </button>
                                      <button
                                        onClick={() => handleRejectSchool(sch.id, receipt.id)}
                                        className="px-2 py-0.5 rounded text-[11px] bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
                                      >
                                        {t3('Mirkaneessiitii Kuffisi', 'Confirm Reject', 'አረጋግጥና ውድቅ አድርግ')}
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
                              {t3('Manni barumsaa argame hin jiru.', 'No matching schools found.', 'ምንም የተገኘ ትምህርት ቤት የለም።')}
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
                                {t3('Koodii:', 'Code:', 'ኮድ፡')} <span className="text-amber-400">{sch.code}</span> · {sch.subcity || t3('Shashamannee', 'Shashemene', 'ሻሸመኔ')}
                              </div>
                            </div>

                            {status === 'approved' && (
                              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                {t3('Walqunnameera', 'Connected', 'የተገናኘ')}
                              </span>
                            )}
                            {status === 'receipt_submitted' && (
                              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-500/40 animate-pulse">
                                <FileText className="w-3 h-3 text-amber-400" />
                                {t3('Nagaheen Dhiyaate', 'Submitted', 'ደረሰኝ ቀርቧል')}
                              </span>
                            )}
                            {status === 'pending_payment' && (
                              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                                <Lock className="w-3 h-3 text-rose-400" />
                                {t3('Hin Kaffalle', 'Unpaid', 'ያልከፈለ')}
                              </span>
                            )}
                            {status === 'rejected' && (
                              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 text-rose-400 border border-rose-500/40">
                                <XCircle className="w-3 h-3 text-rose-400" />
                                {t3('Kufaa', 'Rejected', 'ውድቅ')}
                              </span>
                            )}
                          </div>

                          {/* Level and student count */}
                          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800/80">
                            <span>
                              {sch.level === 'primary' && t3('Sadarkaa 1ffaa (1-8)', 'Primary (1-8)', 'አንደኛ ደረጃ (1-8)')}
                              {sch.level === 'middle' && t3('Sadarkaa Giddugaleessaa (7-8)', 'Middle (7-8)', 'መካከለኛ ደረጃ (7-8)')}
                              {sch.level === 'secondary' && t3('Sadarkaa 2ffaa (9-10)', 'Secondary (9-10)', 'ሁለተኛ ደረጃ (9-10)')}
                              {sch.level === 'preparatory' && t3('Qophaa\'ina (11-12)', 'Preparatory (11-12)', 'መሰናዶ (11-12)')}
                              {sch.level === 'complete' && t3('Waliigalaa (1-12)', 'Complete (1-12)', 'አጠቃላይ (1-12)')}
                            </span>
                            <span className="font-semibold text-slate-300">
                              {sch.totalStudents || 0} {t3('Barattoota', 'Students', 'ተማሪዎች')}
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
                                {t3('Nagahee Ilaali', 'View Receipt', 'ደረሰኝ እይ')}
                              </button>
                            )}

                            {status !== 'approved' && (
                              <button
                                onClick={() => handleApproveSchool(sch.id, receipt?.id)}
                                className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition touch-manipulation cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                {t3('Mirkaneessi & Eeyyami', 'Approve & Allow', 'አፅድቅና ፍቀድ')}
                              </button>
                            )}

                            {status === 'receipt_submitted' && receipt && (
                              <button
                                onClick={() => {
                                  setIsRejectingId(sch.id);
                                  setRejectError('');
                                }}
                                className="py-2 px-3 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1 transition touch-manipulation cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                {t3('Kuffisi', 'Reject', 'ውድቅ')}
                              </button>
                            )}

                            {status === 'approved' && (
                              confirmRevokeSchoolId === sch.id ? (
                                <div className="flex-1 flex items-center justify-between gap-2 bg-rose-950/70 border border-rose-800 rounded-lg px-3 py-1.5">
                                  <span className="text-[11px] text-rose-200 font-semibold">{t3('Qunnamtii Biiroo cufuu?', 'Suspend connection?', 'ግንኙነቱ ይታገድ?')}</span>
                                  <div className="flex gap-1.5">
                                    <button
                                      onClick={() => handleRevokeSchool(sch.id)}
                                      className="px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-bold cursor-pointer"
                                    >
                                      {t3('Eeyyee', 'Yes', 'አዎ')}
                                    </button>
                                    <button
                                      onClick={() => setConfirmRevokeSchoolId(null)}
                                      className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs cursor-pointer"
                                    >
                                      {t3('Lakki', 'No', 'አይ')}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmRevokeSchoolId(sch.id)}
                                  className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-800 text-slate-300 hover:text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition touch-manipulation cursor-pointer"
                                >
                                  <Lock className="w-3.5 h-3.5" />
                                  {t3('Qunnamtii Biiroo Daangessi', 'Suspend Connection', 'የቢሮ ግንኙነትን እገድ')}
                                </button>
                              )
                            )}
                          </div>

                          {/* Rejection input inline on mobile */}
                          {isRejectingId === sch.id && receipt && (
                            <div className="p-2.5 bg-rose-950/50 border border-rose-800/80 rounded-lg text-left space-y-2">
                              <p className="text-[11px] text-rose-300 font-semibold">
                                {t3('Sababa kufaa ta\'uu galchi:', 'Enter rejection reason:', 'የውድቅ ምክንያት አስገባ፡')}
                              </p>
                              <input
                                type="text"
                                value={rejectReason}
                                onChange={(e) => {
                                  setRejectReason(e.target.value);
                                  setRejectError('');
                                }}
                                placeholder={t3('Fkn: Lakkoofsi jijjiirraa hin argamne...', 'e.g., Transaction ref not found...', 'ለምሳሌ፡ የግብይት ቁጥር አልተገኘም...')}
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-rose-700 rounded text-xs text-white placeholder-slate-500 focus:outline-none"
                              />
                              {rejectError && (
                                <p className="text-[11px] text-rose-300">{rejectError}</p>
                              )}
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setIsRejectingId(null);
                                    setRejectReason('');
                                    setRejectError('');
                                  }}
                                  className="px-3 py-1 rounded text-xs bg-slate-800 text-slate-300 cursor-pointer"
                                >
                                  {t3('Haqi', 'Cancel', 'ሰርዝ')}
                                </button>
                                <button
                                  onClick={() => handleRejectSchool(sch.id, receipt.id)}
                                  className="px-3 py-1 rounded text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
                                >
                                  {t3('Mirkaneessi & Kuffisi', 'Confirm Reject', 'አረጋግጥና ውድቅ')}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {filteredSchools.length === 0 && (
                      <div className="py-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        {t3('Manni barumsaa argame hin jiru.', 'No matching schools found.', 'ምንም የተገኘ ትምህርት ቤት የለም።')}
                      </div>
                    )}
                  </div>

                  {/* Informational Callout */}
                  <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300">{t3('Seera Eegumsaa Misoomsaa: ', 'Developer Protection Rule: ', 'የአበልፃጊ ጥበቃ ደንብ፡ ')}</span>
                      {t3(
                        'Manni barumsaa tokko hanga nagahee kaffaltii hin galchinee fi misoomsaan (Tamerat Ale) hin mirkaneessinetti gabaasa kamiyyuu gara Biiroo Barnootaa Magaalaa Shashamanneetti erguu, qabxii barattootaa dabarsuu ykn odeeffannoo ofiseelaawaa jijjiiruu hin danda\'u.',
                        'Until a school submits a payment receipt and receives developer approval (Tamerat Ale), it cannot send reports, transfer student results, or exchange official records with Shashemene City Education Bureau.',
                        'ትምህርት ቤቱ ደረሰኝ እስካላስገባ እና በአበልፃጊው (ታምራት ዓለ) እስካልፀደቀ ድረስ ወደ ሻሸመኔ ከተማ ትምህርት ቢሮ ምንም አይነት ሪፖርት መላክ፣ የተማሪ ውጤት ማስተላለፍ ወይም ኦፊሴላዊ መረጃ መለዋወጥ አይችልም።'
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RECEIPTS VAULT */}
              {activeTab === 'receipts' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">{t3('Galmee Nagaheewwan Baankii', 'Bank Receipts Registry', 'የባንክ ደረሰኞች መዝገብ')}</h3>
                      <p className="text-xs text-slate-400">{t3('Tarree mirkaneessa galii manneen barnootaa', 'School fee payment verification records', 'የትምህርት ቤቶች የገቢ ማረጋገጫዎች ዝርዝር')}</p>
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
                                  {t3('Baankii Kaffaltii:', 'Paid Bank:', 'የተከፈለበት ባንክ፡')} <span className="text-amber-300 font-bold">{rec.bankName}</span>
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
                                {rec.status === 'approved'
                                  ? t3('Mirkanaa\'eera', 'Approved', 'የፀደቀ')
                                  : rec.status === 'rejected'
                                  ? t3('Kufaa', 'Rejected', 'ውድቅ')
                                  : t3('Kan Hin Mirkanaa\'in', 'Pending', 'ያልተረጋገጠ')}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 mb-3 font-mono">
                              <div>
                                <span className="text-slate-500 block text-[10px]">{t3('Lakkoofsa Jijjiirraa (Ref)', 'Transaction Ref', 'የግብይት ቁጥር (Ref)')}</span>
                                <span className="text-slate-200 font-semibold">{rec.transactionRef}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[10px]">{t3('Hanga (Amount)', 'Amount', 'መጠን (Amount)')}</span>
                                <span className="text-emerald-400 font-bold">{rec.amount.toLocaleString()} {t3('ETB', 'ETB', 'ብር')}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[10px]">{t3('Kaffalaa (Depositor)', 'Depositor', 'ከፋይ (Depositor)')}</span>
                                <span className="text-slate-300">{rec.payerName}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[10px]">{t3('Guyyaa', 'Date', 'ቀን')}</span>
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
                              {t3('Nagahee Ilaali', 'View Receipt', 'ደረሰኙን እይ')}
                            </button>

                            {rec.status !== 'approved' && (
                              <button
                                onClick={() => handleApproveSchool(rec.schoolId, rec.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm transition"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {t3('Mirkaneessi & Eeyyami', 'Approve & Allow', 'አፅድቅና ፍቀድ')}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {receipts.length === 0 && (
                      <div className="col-span-2 py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        {t3('Hanga ammaatti nagaheen dhiyaate hin jiru.', 'No payment receipts submitted yet.', 'እስካሁን የቀረበ ደረሰኝ የለም።')}
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
                          <span>{t3('Galmee fi Bulchiinsa Herrega Baankii Misoomsaa', 'Developer Official Bank Accounts Entry & Management', 'የአበልፃጊው ይፋዊ የባንክ አኮውንት ማስገቢያ እና ማስተዳደሪያ')}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                            {bankAccountsList.filter((b) => b.isActive).length} {t3('Baankiiwwan Si\'aawoo', 'Active Banks', 'ንቁ ባንኮች')}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                          {t3(
                            'Herrega baankii kamiyyuu kan manneen barnootaa yeroo galmaa\'an fuula kaffaltii isaanii irratti mul\'atan asitti galchaa, fooyyessaa ykn haaraa dabalaa.',
                            'Add, update, or enable any bank accounts that will appear on schools\' payment portals during registration.',
                            'ትምህርት ቤቶች ሲመዘገቡ በክፍያ ገፃቸው ላይ የሚታዩላቸውን ማንኛውንም የባንክ ሂሳቦች እዚህ ያስገቡ፣ ያሻሽሉ፣ ወይም አዲስ ይጨምሩ።'
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-right">
                        <span className="text-[10px] text-slate-400 block font-sans">{t3('Tariffii Eeyyamaa', 'License Fee Rate', 'የፈቃድ ክፍያ ታሪፍ')}</span>
                        <span className="text-xs font-black text-emerald-400 font-mono">
                          {editFee.toLocaleString()} {config.currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 1. BANK ACCOUNT ENTRY FORM */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                          <Plus className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-white">
                            {t3('Iddoo Galmee Herrega Baankii Haaraa', 'Add New Bank Account', 'አዲስ የባንክ ሂሳብ ማስገቢያ ቦታ (Add Bank Account)')}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            {t3(
                              'Maqaa baankii, lakkoofsa herregaa fi maqaa abbaa herregaa galchuun manneen barnootaaf ifa godhaa',
                              'Enter bank name, account number, and holder name to publish for schools',
                              'የባንክ ስም፣ የሂሳብ ቁጥር እና የባለቤት ስም በማስገባት ለት/ቤቶች ይፋ ያድርጉ'
                            )}
                          </span>
                        </div>
                      </div>

                      {bankAddSuccessToast && (
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t3('Herregni baankii haaraan galmaa\'eera!', 'New bank account registered!', 'አዲሱ የባንክ ሂሳብ ተመዝግቧል!')}</span>
                        </span>
                      )}
                    </div>

                    <form onSubmit={handleAddNewBankAccount} className="space-y-4">
                      {bankFormError && (
                        <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-700 text-xs text-rose-300 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{bankFormError}</span>
                        </div>
                      )}

                      {/* Fast Bank Presets Chips */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-2">
                          {t3('1. Baankii filadhaa (ykn filannoo saffisaa cuqaasaa):', '1. Select a Bank (or click a quick preset):', '1. ባንክ ይምረጡ (ወይም ፈጣን ምርጫን ይጫኑ)፡')}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { value: 'Commercial Bank of Ethiopia (CBE)', label: t3('Baankii Daldalaa Itoophiyaa (CBE)', 'Commercial Bank of Ethiopia (CBE)', 'የኢትዮጵያ ንግድ ባንክ (CBE)') },
                            { value: 'Telebirr', label: t3('Telebirr', 'Telebirr', 'ቴሌብር (Telebirr)') },
                            { value: 'Awash Bank', label: t3('Baankii Awaash (Awash Bank)', 'Awash Bank', 'አዋሽ ባንክ (Awash Bank)') },
                            { value: 'Dashen Bank', label: t3('Baankii Daashin (Dashen Bank)', 'Dashen Bank', 'ዳሸን ባንክ (Dashen Bank)') },
                            { value: 'Bank of Abyssinia', label: t3('Baankii Abisiiniyaa (Bank of Abyssinia)', 'Bank of Abyssinia', 'አቢሲንያ ባንክ (Bank of Abyssinia)') },
                            { value: 'Coop Bank of Oromia', label: t3('Baankii Hojii Gamtaa Oromiyaa (Coop)', 'Cooperative Bank of Oromia (Coop)', 'ኦሮሚያ ህብረት ስራ ባንክ (Coop Bank)') },
                            { value: 'Wegagen Bank', label: t3('Baankii Wagaagan (Wegagen Bank)', 'Wegagen Bank', 'ወጋገን ባንክ (Wegagen Bank)') },
                            { value: 'Hibret Bank', label: t3('Baankii Hibret (Hibret Bank)', 'Hibret Bank', 'ህብረት ባንክ (Hibret Bank)') },
                            { value: 'Zemen Bank', label: t3('Baankii Zemen (Zemen Bank)', 'Zemen Bank', 'ዘመን ባንክ (Zemen Bank)') },
                            { value: 'Siinqee Bank', label: t3('Baankii Siinqee (Siinqee Bank)', 'Siinqee Bank', 'ሲንቄ ባንክ (Siinqee Bank)') },
                            { value: 'Nib Bank', label: t3('Baankii Nibb (Nib Bank)', 'Nib Bank', 'ንብ ባንክ (Nib Bank)') },
                            { value: 'Berhan Bank', label: t3('Baankii Birhaan (Berhan Bank)', 'Berhan Bank', 'ብርሃን ባንክ (Berhan Bank)') },
                            { value: 'Lion Bank', label: t3('Baankii Anbassaa (Lion Bank)', 'Lion International Bank', 'አንበሳ ባንክ (Lion Bank)') },
                            { value: '__custom__', label: t3('Kan Biraa (Custom Bank)', 'Other (Custom Bank)', 'ሌላ (Custom Bank)') }
                          ].map((bItem) => (
                            <button
                              key={bItem.value}
                              type="button"
                              onClick={() => {
                                setNewBankName(bItem.value);
                                setBankFormError('');
                                if (bItem.value !== '__custom__') {
                                  setCustomBankNameInput('');
                                }
                              }}
                              className={`px-2.5 py-1 text-xs rounded-lg transition font-medium cursor-pointer ${
                                newBankName === bItem.value
                                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm ring-2 ring-amber-400'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/80'
                              }`}
                            >
                              {bItem.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Bank Name input if Custom is selected */}
                      {newBankName === '__custom__' && (
                        <div>
                          <label className="block text-xs font-semibold text-amber-300 mb-1">
                            {t3('Maqaa sirrii baankichaa barreessaa:', 'Enter exact bank name:', 'የባንኩን ትክክለኛ ስም ይፃፉ፡')}
                          </label>
                          <input
                            type="text"
                            value={customBankNameInput}
                            onChange={(e) => setCustomBankNameInput(e.target.value)}
                            placeholder={t3('Fkn: Baankii Gadaa (Gadaa Bank) / Baankii Tsaday', 'e.g., Gadaa Bank / Tsedey Bank', 'ለምሳሌ፡ ጋዳ ባንክ (Gadaa Bank) / ፀደይ ባንክ (Tsedey Bank)')}
                            className="w-full px-3 py-2 bg-slate-800/90 border border-amber-500/50 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                            required
                          />
                        </div>
                      )}

                      {/* Fields: Account Number + Holder + Branch */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-1">
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            {t3('Lakkoofsa Herrega Baankii (Account Number) *', 'Bank Account Number *', 'የባንክ ሂሳብ ቁጥር (Account Number) *')}
                          </label>
                          <input
                            type="text"
                            value={newAccountNumber}
                            onChange={(e) => setNewAccountNumber(e.target.value)}
                            placeholder={t3('Fkn: 1000293847561', 'e.g., 1000293847561', 'ለምሳሌ፡ 1000293847561')}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            {t3('Maqaa Abbaa Herregaa (Account Holder)', 'Account Holder Name', 'የሂሳቡ ባለቤት ስም (Account Holder)')}
                          </label>
                          <input
                            type="text"
                            value={newAccountHolder}
                            onChange={(e) => setNewAccountHolder(e.target.value)}
                            placeholder="Tamerat Ale"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            {t3('Damee ykn Bilbila (Branch/Phone)', 'Branch or Phone', 'ቅርንጫፍ ወይም ስልክ (Branch/Phone)')}
                          </label>
                          <input
                            type="text"
                            value={newBranchOrPhone}
                            onChange={(e) => setNewBranchOrPhone(e.target.value)}
                            placeholder={t3('Damee Shashamannee / +251 9...', 'Shashemene Branch / +251 9...', 'ሻሸመኔ ቅርንጫፍ / +251 9...')}
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
                            placeholder={t3('Yaadannoo dabalataa (Fkn: Baankii moobaayilaa ykn dameedhaan galchuuf)...', 'Additional notes (e.g., for mobile banking or branch deposit)...', 'ተጨማሪ ማስታወሻ (ለምሳሌ፡ ለሞባይል ባንኪንግ ወይም ለቅርንጫፍ ተቀማጭ)...')}
                            className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black rounded-xl shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                          <span>{t3('Herrega Baankii Haaraa Galmeessi', 'Register New Bank Account', 'አዲሱን የባንክ ሂሳብ መዝግብ')}</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* 2. REGISTERED BANK ACCOUNTS LIST */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-amber-400" />
                        <span>{t3(`Herrega Baankii Fuula Kaffaltii Manneen Barnootaa Irratti Mul'atan (${bankAccountsList.length})`, `Bank Accounts Visible on School Payment Portals (${bankAccountsList.length})`, `በትምህርት ቤቶች ክፍያ ገጽ ላይ የሚታዩ የባንክ ሂሳቦች (${bankAccountsList.length})`)}</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {bankAccountsList.filter((b) => b.isActive).length} {t3('Fudhattoota Si\'aawoo', 'Active Accounts', 'ንቁ መቀበያዎች')}
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
                                    {t3('Abbaa Herregaa:', 'Holder:', 'ባለቤት፡')} <strong className="text-slate-200">{acc.accountHolder}</strong>
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
                                {acc.isActive ? t3('Si\'aawaa (Active)', 'Active', 'ንቁ (Active)') : t3('Cufaa', 'Disabled', 'የተዘጋ')}
                              </span>
                            </div>

                            {/* Account Number Box */}
                            <div className="mt-2.5 p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-slate-500 block">{t3('Lakkoofsa Herregaa', 'Account Number', 'የሂሳብ ቁጥር')}</span>
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
                                    <span className="text-emerald-400">{t3('Garagalfameera!', 'Copied!', 'ተቀድቷል!')}</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>{t3('Garagalchi', 'Copy', 'ቅዳ')}</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Subtitle / Notes */}
                            {(acc.branchOrPhone || acc.notes) && (
                              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                                {acc.branchOrPhone && <span>{acc.branchOrPhone}</span>}
                                {acc.notes && <span className="text-amber-200/80">{acc.notes}</span>}
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
                              <span>{acc.isActive ? t3('Dhaamsi (Disable)', 'Disable', 'አጥፋ (Disable)') : t3('Bani (Enable)', 'Enable', 'አብራ (Enable)')}</span>
                            </button>

                            {confirmDeleteBankId === acc.id ? (
                              <div className="flex items-center gap-1.5 bg-rose-950/70 border border-rose-800 rounded-lg px-2 py-0.5">
                                <span className="text-[10px] text-rose-200">{t3('Haquu?', 'Delete?', 'ይሰረዝ?')}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBankAccount(acc.id)}
                                  className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold cursor-pointer"
                                >
                                  {t3('Eeyyee', 'Yes', 'አዎ')}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteBankId(null)}
                                  className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] cursor-pointer"
                                >
                                  {t3('Lakki', 'No', 'አይ')}
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteBankId(acc.id)}
                                className="px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>{t3('Haqi', 'Delete', 'ሰርዝ')}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {bankAccountsList.length === 0 && (
                        <div className="col-span-2 py-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                          {t3('Herregni baankii galmaa\'e hin jiru. Maaloo gubbaatti herrega haaraa galchaa.', 'No bank accounts registered yet. Please add one above.', 'ምንም የተመዘገበ የባንክ ሂሳብ የለም። እባክዎ ከላይ ባለው ቅጽ አዲስ የባንክ ሂሳብ ያስገቡ።')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. GENERAL FEE & CONTACT SETTINGS FORM */}
                  <form onSubmit={handleSaveConfig} className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
                    <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>{t3('Qindaa\'ina Waliigalaa Tariffii fi Odeeffannoo Misoomsaa', 'General Fee & Developer Contact Settings', 'አጠቃላይ የታሪፍ እና የአበልፃጊ መረጃ ቅንብሮች')}</span>
                    </h4>

                    {/* Corporate Pedigree & Engineering Team Card */}
                    <div className="p-3.5 bg-slate-950/80 rounded-xl border border-amber-500/30 text-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div>
                          <span className="text-[10px] text-amber-400 uppercase font-black">
                            {t3('Caasaa Dhaabbataa (Company Structure)', 'Company Structure', 'የድርጅት መዋቅር (Company Structure)')}
                          </span>
                          <h5 className="font-bold text-white text-xs sm:text-sm">
                            {t3('Tame & Seraw PLC', 'Tame & Seraw PLC', 'ታሜና ሥራው ኃ/የተ/የግ/ማ (Tame & Seraw PLC)')}
                          </h5>
                          <p className="text-[11px] text-amber-200">
                            {t3('Dhaabbata Obbolaa: Wushiye Software Solution', 'Sister Company: Wushiye Software Solution', 'እህት ድርጅት፡ ውሽዬ ሶፍትዌር ሶሉሽን (Wushiye Software Solution)')}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                          {t3('Shashamannee, Itoophiyaa', 'Shashemene, Ethiopia', 'ሻሸመኔ፣ ኢትዮጵያ')}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                        <div className="p-2 bg-slate-900 rounded-lg">
                          <span className="text-[9px] text-slate-400 block">{t3('Piroogiraamara Duraa:', 'Lead Programmer:', 'ዋና ቀዳሚ ፕሮግራመር፡')}</span>
                          <strong className="text-white">Tamerat Ale</strong>
                        </div>
                        <div className="p-2 bg-slate-900 rounded-lg">
                          <span className="text-[9px] text-slate-400 block">{t3('Injiinara Baak-Endii:', 'Backend Engineer:', 'ባክኢንድ ኢንጅነር፡')}</span>
                          <strong className="text-white">Tamerat Ale</strong>
                        </div>
                        <div className="p-2 bg-slate-900 rounded-lg">
                          <span className="text-[9px] text-slate-400 block">{t3('Injiinara Firoont-Endii:', 'Frontend Engineer:', 'ፍሮንትኢንድ ኢንጅነር፡')}</span>
                          <strong className="text-white">Tamerat Ale</strong>
                        </div>
                        <div className="p-2 bg-slate-900 rounded-lg">
                          <span className="text-[9px] text-slate-400 block">{t3('Dizaayinara (UI/UX):', 'UI/UX Designer:', 'ዲዛይነር (UI/UX)፡')}</span>
                          <strong className="text-white">Tamerat Ale</strong>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          {t3('Hanga Kaffaltii Eeyyama Waggaa (ETB) *', 'Annual License Fee Amount (ETB) *', 'የአመታዊ ፈቃድ ክፍያ መጠን (በብር) *')}
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
                          {t3('Maqaa Abbaa Herregaa Durtii (Default Holder)', 'Default Account Holder', 'ነባሪ የሂሳብ ባለቤት ስም (Default Account Holder)')}
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
                          <span>{t3('Lakkoofsa Bilbila Duraa (Primary / Telebirr)', 'Primary Phone / Telebirr', 'ዋና ስልክ ቁጥር (Primary Phone / ቴሌብር)')}</span>
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
                          <span>{t3('Lakkoofsa Bilbila Lammaffaa (Deeggarsa)', 'Secondary Phone / Support', 'ሁለተኛ ስልክ ቁጥር (Secondary Phone / ድጋፍ)')}</span>
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
                          <span>{t3('Imeelii Misoomsaa (Developer Email)', 'Developer Email', 'የአበልፃጊ ኢሜይል (Developer Email)')}</span>
                        </label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5 text-amber-400" />
                            <span>{t3('Weebsaayitii Ofiseelaawaa / Haalawwan Diriirsaa', 'Official Website / Deployment Modes', 'ይፋዊ ዌብ ገፅ / የዝርጋታ ሞዶች (Official Website / Deployment Modes)')}</span>
                          </span>
                          {editWebsiteUrl && (
                            <a
                              href={editWebsiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-amber-300 hover:underline inline-flex items-center gap-1"
                            >
                              <span>{t3('Weebsaayitii Bani', 'Open Website', 'ዌብ ገፅ ክፈት')}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </label>
                        <input
                          type="url"
                          value={editWebsiteUrl}
                          onChange={(e) => setEditWebsiteUrl(e.target.value)}
                          placeholder="https://weshya-sofetyer-solshene.netlify.app/#deployment-modes"
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t3('Barreeffama Qajeelfama Kaffaltii Manneen Barnootaatiif Mul\'atu', 'Payment Instructions Displayed to Schools', 'ለትምህርት ቤቶች የሚታይ የክፍያ መመሪያ ፅሁፍ (Instructions to Schools)')}
                      </label>
                      <textarea
                        rows={2}
                        value={editInstructions}
                        onChange={(e) => setEditInstructions(e.target.value)}
                        placeholder={t3('Kaffaltii Baankii Daldalaa ykn Telebirriin erga raawwattanii booda...', 'After paying via CBE or Telebirr...', 'ክፍያውን በንግድ ባንክ ወይም በቴሌብር ከፈጸሙ በኋላ...')}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      {configSavedToast ? (
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t3('Qindaa\'inni milkaa\'inaan olkaa\'ameera!', 'Settings saved successfully!', 'ቅንብሩ በተሳካ ሁኔታ ተቀምጧል!')}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          {t3('Jijjiiramni olkaa\'ame battalumatti manneen barnootaa irratti hojiirra oola.', 'Saved changes apply immediately to all schools.', 'የተቀመጡ ለውጦች ወዲያውኑ ለት/ቤቶች ይተገበራሉ።')}
                        </span>
                      )}

                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>{t3('Qindaa\'ina Olkaa\'i', 'Save Settings', 'ቅንብሩን መዝግብ (Save Settings)')}</span>
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
                <span>{t3('Eegumsa Sirnaa: Si\'aawaa (Active Protection)', 'System Protection: Active', 'ሲስተም ጥበቃ፡ ንቁ (Active Protection)')}</span>
              </div>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPasswordInput('');
                }}
                className="hover:text-rose-400 transition"
              >
                {t3('Cufii Bahi (Lock & Exit)', 'Lock & Exit', 'ይቆልፉና ይውጡ (Lock & Exit)')}
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
                <h4 className="font-bold text-white text-sm">{t3('Qorannoo Nagahee Baankii', 'Bank Receipt Inspection', 'የባንክ ደረሰኝ ምርመራ')}</h4>
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
                  {t3('Garagalcha Nagahee Baankii Ergame (Deposit Slip)', 'Submitted Bank Deposit Slip', 'የተላከው የባንክ ደረሰኝ ቅጅ (Deposit Slip)')}
                </div>
                {selectedReceipt.receiptImageUrl ? (
                  <img
                    src={selectedReceipt.receiptImageUrl}
                    alt="Receipt Slip"
                    className="max-h-60 mx-auto rounded-lg border border-slate-800 object-contain shadow-md"
                  />
                ) : (
                  <div className="py-10 text-slate-500 text-xs font-mono">
                    {t3('Suuraan nagahee hin qabsiifamne', 'No receipt image attached', 'የደረሰኝ ምስል አልተያያዘም')}
                  </div>
                )}
              </div>

              {/* Receipt Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60 font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">{t3('Mana Barumsaa', 'School', 'ትምህርት ቤት')}</span>
                  <span className="text-white font-bold">{selectedReceipt.schoolName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{t3('Baankii', 'Bank', 'ባንክ')}</span>
                  <span className="text-amber-300 font-bold">{selectedReceipt.bankName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{t3('Lakkoofsa Jijjiirraa (FT / Ref)', 'Transaction Ref (FT)', 'የግብይት ቁጥር (FT / Ref)')}</span>
                  <span className="text-emerald-400 font-bold">{selectedReceipt.transactionRef}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{t3('Maallaqa Kaffalame', 'Amount Paid', 'የተከፈለ ገንዘብ')}</span>
                  <span className="text-emerald-300 font-bold">{selectedReceipt.amount.toLocaleString()} {t3('ETB', 'ETB', 'ብር')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{t3('Nama Kaffale', 'Payer', 'ከፋይ ግለሰብ')}</span>
                  <span className="text-slate-200">{selectedReceipt.payerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{t3('Guyyaa Kaffaltii', 'Payment Date', 'የተከፈለበት ቀን')}</span>
                  <span className="text-slate-400">{selectedReceipt.submittedAt?.split('T')[0] || selectedReceipt.submittedAt}</span>
                </div>
                {selectedReceipt.notes && (
                  <div className="col-span-2 pt-1 border-t border-slate-700/60 text-slate-300 font-sans">
                    <span className="text-slate-400 block text-[10px]">{t3('Yaadannoo Dabalataa:', 'Additional Notes:', 'ተጨማሪ ማስታወሻ፡')}</span>
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
                  {t3('Cufi', 'Close', 'ዝጋ')}
                </button>
                <button
                  onClick={() => {
                    handleApproveSchool(selectedReceipt.schoolId, selectedReceipt.id);
                    setSelectedReceipt(null);
                  }}
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {t3('Nagahee Kana Mirkaneessi', 'Approve Receipt', 'ይህን ደረሰኝ አፅድቅ')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
