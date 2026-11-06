import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Copy,
  Check,
  Phone,
  User,
  FileText,
  X,
  Sparkles,
  Lock,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Eye,
  Landmark
} from 'lucide-react';
import { School, DeveloperPaymentReceipt, DeveloperPaymentConfig } from '../types';
import { StorageService } from '../utils/storage';

interface DeveloperPaymentModalProps {
  school: School;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSubmitted?: (updatedSchools: School[]) => void;
  onSuccess?: (receipt: DeveloperPaymentReceipt) => void;
}

export const DeveloperPaymentModal: React.FC<DeveloperPaymentModalProps> = ({
  school,
  isOpen,
  onClose,
  onPaymentSubmitted,
  onSuccess
}) => {
  const config: DeveloperPaymentConfig = StorageService.getDeveloperConfig();
  const existingReceipt = StorageService.getDeveloperPaymentBySchoolId(school?.id || '');

  const activeBankAccounts = useMemo(() => {
    if (config.bankAccounts && config.bankAccounts.length > 0) {
      return config.bankAccounts.filter((b) => b.isActive !== false);
    }
    return [
      {
        id: 'cbe',
        bankName: 'የኢትዮጵያ ንግድ ባንክ (Commercial Bank of Ethiopia - CBE)',
        accountNumber: config.cbeAccount,
        accountHolder: config.accountHolder,
        branchOrPhone: 'ሻሸመኔ ቅርንጫፍ',
        isActive: true
      },
      {
        id: 'telebirr',
        bankName: 'ቴሌብር (Telebirr)',
        accountNumber: config.telebirrNumber,
        accountHolder: config.accountHolder,
        branchOrPhone: '+251 91 188 4590',
        isActive: true
      },
      {
        id: 'awash',
        bankName: 'አዋሽ ባንክ (Awash Bank)',
        accountNumber: config.awashAccount,
        accountHolder: config.accountHolder,
        branchOrPhone: 'ሻሸመኔ ቅርንጫፍ',
        isActive: true
      },
      {
        id: 'dashen',
        bankName: 'ዳሸን ባንክ (Dashen Bank)',
        accountNumber: config.dashenAccount,
        accountHolder: config.accountHolder,
        branchOrPhone: 'ሻሸመኔ ቅርንጫፍ',
        isActive: true
      }
    ];
  }, [config]);

  const [selectedBank, setSelectedBank] = useState<string>(() => {
    if (config.bankAccounts && config.bankAccounts.length > 0) {
      return config.bankAccounts[0].id;
    }
    return 'cbe';
  });
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [payerName, setPayerName] = useState<string>(school?.principalName || '');
  const [payerPhone, setPayerPhone] = useState<string>(school?.phone || '+251 9');
  const [receiptImage, setReceiptImage] = useState<string>(existingReceipt?.receiptImageUrl || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showSlipViewer, setShowSlipViewer] = useState<boolean>(false);

  if (!isOpen || !school) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setReceiptImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Demo receipt generator for instant testing
  const handleUseDemoReceipt = () => {
    const randomRef = `FT${Math.floor(10000000000 + Math.random() * 90000000000)}`;
    setTransactionRef(randomRef);
    setReceiptImage(
      selectedBank.includes('telebirr') || selectedBank === 'telebirr'
        ? 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80'
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim() || !payerName.trim() || !payerPhone.trim()) {
      alert('እባክዎ የትራንዛክሽን ቁጥር፣ የከፋይ ስም እና ስልክ በትክክል ያስገቡ');
      return;
    }

    setIsSubmitting(true);

    const matchedBank = activeBankAccounts.find(
      (b) => b.id === selectedBank || b.accountNumber === selectedBank || b.bankName === selectedBank
    );
    const bankNameFormatted = matchedBank ? matchedBank.bankName : selectedBank;

    const newReceipt: DeveloperPaymentReceipt = {
      id: existingReceipt?.id || `dev-rec-${Date.now()}`,
      schoolId: school.id,
      schoolName: school.name,
      amount: config.feeAmount,
      currency: config.currency,
      bankName: bankNameFormatted,
      transactionRef: transactionRef.trim().toUpperCase(),
      receiptImageUrl:
        receiptImage ||
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      payerName: payerName.trim(),
      payerPhone: payerPhone.trim(),
      submittedAt: new Date().toISOString(),
      status: 'receipt_submitted',
      notes: `ለትምህርት ቢሮ እውቅና ማረጋገጫ የተላከ የ${config.feeAmount} ${config.currency} ደረሰኝ`
    };

    setTimeout(() => {
      const res = StorageService.submitDeveloperPayment(newReceipt);
      setIsSubmitting(false);
      if (onPaymentSubmitted) onPaymentSubmitted(res.schools);
      if (onSuccess) onSuccess(newReceipt);
    }, 600);
  };

  const status = school.developerPaymentStatus || 'pending_payment';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 max-h-[94vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-amber-300 flex items-center justify-center shadow-md">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  የሲስተም አበልፃጊ ፈቃድና የቢሮ ግንኙነት ክፍያ
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Developer License
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {school.name} · የትምህርት ቢሮ ይፋዊ እውቅና እና የዳታ ልውውጥ ማስፈጸሚያ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Callout Banner */}
        {status === 'approved' ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                ክፍያዎ ፀድቋል! ትምህርት ቤቱ ከትምህርት ቢሮ ጋር ሙሉ በሙሉ ተገናኝቷል
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                ይህ ትምህርት ቤት የሲስተም አበልፃጊውን ክፍያ ፈጽሞ በአበልፃጊው ታምራት ዓለ ፀድቋል። ሴሚስተር ሪፖርቶች፣
                የተማሪዎች ውጤት፣ እና የትምህርት ቢሮ ስልጠናዎችን ያለምንም እክል ማስተላለፍ ይችላሉ።
              </p>
              {existingReceipt && (
                <div className="mt-2 text-[11px] text-emerald-900 font-mono flex items-center gap-2">
                  <span>ትራንዛክሽን፡ {existingReceipt.transactionRef}</span>
                  <span>·</span>
                  <span>ባንክ፡ {existingReceipt.bankName}</span>
                </div>
              )}
            </div>
          </div>
        ) : status === 'receipt_submitted' ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                የባንክ ደረሰኝ ተልኳል — በአበልፃጊው ማረጋገጫ በመጠባበቅ ላይ ነው
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                ትምህርት ቤቱ የከፈለበትን ደረሰኝ በተሳካ ሁኔታ አስገብቷል። ሲስተም አበልፃጊው ደረሰኙን መርምሮ ሲያፀድቅ
                ከሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ ጋር ያለው ግንኙነት በራስ-ሰር ይከፈታል!
              </p>
              {existingReceipt && (
                <div className="mt-2 text-[11px] text-amber-900 font-mono flex items-center gap-3">
                  <span>TXN: {existingReceipt.transactionRef}</span>
                  <span>መጠን፡ {existingReceipt.amount} {existingReceipt.currency}</span>
                  <button
                    type="button"
                    onClick={() => setShowSlipViewer(!showSlipViewer)}
                    className="underline text-amber-950 font-bold hover:text-black cursor-pointer flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>ደረሰኝ እይ</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : status === 'rejected' ? (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-rose-950 uppercase tracking-wider">
                የቀረበው ደረሰኝ በአበልፃጊው ውድቅ ተደርጓል — እባክዎ እንደገና ይላኩ
              </h4>
              <p className="text-xs text-rose-800 mt-0.5">
                ምክንያት፡ {existingReceipt?.rejectionReason || 'የቀረበው የባንክ ደረሰኝ ግልጽ አይደለም ወይም የትራንዛክሽን ቁጥሩ አልተገኘም።'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-blue-950 uppercase tracking-wider">
                የትምህርት ቢሮ ግንኙነት እና እውቅና ማረጋገጫ ለጊዜው ተቆልፏል
              </h4>
              <p className="text-xs text-blue-900 mt-0.5 leading-relaxed">
                ትምህርት ቤቱ የተማሪዎችንና የባለድርሻ አካላትን መረጃ መዝግቧል። ወደ ሻሸመኔ ትምህርት ቢሮ ሪፖርትና የእውቅና
                ጥያቄ ለመላክ ከዚህ በታች በተዘረዘሩት የባንክ ሂሳቦች የፈቃድ ክፍያ ፈጽመው ደረሰኝ ይላኩ።
              </p>
            </div>
          </div>
        )}

        {/* Developer Enterprise & Creator Card */}
        <div className="p-3.5 bg-gradient-to-r from-slate-900 to-amber-950 rounded-2xl text-white border border-amber-500/30 shadow-xs space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 block">
                የሲስተም አበልፃጊ እና የቴክኖሎጂ ባለቤት (Software Creator)
              </span>
              <h4 className="text-xs sm:text-sm font-black text-white">
                ታሜና ሥራው ኃ/የተ/የግ/ማ (Tame & Seraw PLC)
              </h4>
              <p className="text-[11px] text-amber-200/90 font-medium">
                እህት ድርጅት፡ <strong>ውሽዬ ሶፍትዌር ሶሉሽን (Wushiye Software Solution)</strong>
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-300 block">ዋና ቀዳሚ ፕሮግራመር / ዲዛይነር፡</span>
              <span className="text-xs font-black text-amber-300">ታምራት አሌ (Tamerat Ale)</span>
              <span className="text-[10px] text-slate-400 block">📍 ሻሸመኔ (Shashemene)</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
            <div className="flex items-center gap-3">
              <span className="text-slate-300">ቀጥታ ስልኮች፡</span>
              <a href="tel:+251911029070" className="font-mono font-bold text-emerald-300 hover:underline">
                +251 91 102 9070
              </a>
              <span className="text-slate-500">/</span>
              <a href="tel:+251701370299" className="font-mono font-bold text-sky-300 hover:underline">
                +251 70 137 0299
              </a>
            </div>
            <span className="text-[10px] font-mono text-amber-300/80">tameratale09@gmail.com</span>
          </div>
        </div>

        {/* Developer Bank Accounts Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>የአበልፃጊው ይፋዊ የክፍያ መቀበያ የባንክ ሂሳቦች</span>
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              የክፍያ መጠን፡ {config.feeAmount.toLocaleString()} {config.currency}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeBankAccounts.map((acc) => {
              const isSelected = selectedBank === acc.id || selectedBank === acc.accountNumber;
              return (
                <div
                  key={acc.id}
                  onClick={() => setSelectedBank(acc.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-900 truncate">
                      {acc.bankName}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(acc.accountNumber, acc.id);
                      }}
                      className="text-[10px] text-amber-700 hover:text-amber-950 flex items-center gap-0.5 font-bold cursor-pointer shrink-0 ml-1"
                    >
                      {copiedKey === acc.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === acc.id ? 'ተቀድቷል' : 'ቅዳ'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs font-black text-slate-900 mt-1">
                    {acc.accountNumber}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-between">
                    <span>ስም፡ <strong className="text-slate-700">{acc.accountHolder}</strong></span>
                    {acc.branchOrPhone && <span className="text-slate-400">📍 {acc.branchOrPhone}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Receipt Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              የተከፈለበትን ደረሰኝ / ስሊፕ ማረጋገጫ ማስገቢያ
            </h4>
            <button
              type="button"
              onClick={handleUseDemoReceipt}
              className="text-[11px] font-bold text-indigo-700 hover:text-indigo-950 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
            >
              ✨ የሙከራ ደረሰኝ ሙላ (Auto-fill Demo Slip)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                የባንክ ትራንዛክሽን ቁጥር (Transaction Ref / TXN ID) *
              </label>
              <input
                type="text"
                required
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="ምሳሌ፡ FT24255019882 ወይም TB99201948529"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono uppercase focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                የከፋይ ሙሉ ስም (Payer Name) *
              </label>
              <input
                type="text"
                required
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder="ምሳሌ፡ አቶ ጉተማ ዋቆ"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                የከፋይ ስልክ ቁጥር *
              </label>
              <input
                type="tel"
                required
                value={payerPhone}
                onChange={(e) => setPayerPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                የባንክ ደረሰኝ / ስሊፕ ፎቶ ወይም ስክሪንሾት
              </label>
              <label className="flex items-center justify-between px-3 py-1.5 border border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs">
                <span className="text-slate-600 truncate max-w-[180px]">
                  {receiptImage ? '✅ ፎቶ ተመርጧል' : 'የስሊፕ ፎቶ ይጫኑ...'}
                </span>
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Receipt Preview */}
          {receiptImage && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={receiptImage}
                  alt="Receipt Preview"
                  className="w-14 h-14 object-cover rounded-xl border border-slate-300"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">የተያያዘ የባንክ ደረሰኝ</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ክፍያ መጠን፡ {config.feeAmount} {config.currency}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReceiptImage('')}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold"
              >
                አስወግድ
              </button>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="text-[11px] text-slate-500">
              አበልፃጊ እገዛ (ውሽዬ ሶፍትዌር)፡{' '}
              <strong className="font-mono text-slate-800">
                {config.developerPhone} / {config.secondaryPhone || '+251 70 137 0299'}
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                ዝጋ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'በመላክ ላይ...' : 'ደረሰኝ ላክና ማረጋገጫ ጠይቅ'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
