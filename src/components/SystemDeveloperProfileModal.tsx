import React, { useState } from 'react';
import {
  Code2,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  Cpu,
  Layers,
  Palette,
  Server,
  UserCheck,
  Award,
  X,
  CreditCard,
  Globe
} from 'lucide-react';
import { DeveloperPaymentConfig } from '../types';
import { StorageService } from '../utils/storage';

interface SystemDeveloperProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeveloperPortal?: () => void;
  onOpenPaymentModal?: () => void;
}

export const SystemDeveloperProfileModal: React.FC<SystemDeveloperProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenDeveloperPortal,
  onOpenPaymentModal
}) => {
  const config: DeveloperPaymentConfig = StorageService.getDeveloperConfig();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const primaryPhone = config.developerPhone || '+251 91 102 9070';
  const secondaryPhone = config.secondaryPhone || '+251 70 137 0299';
  const parentCompany = config.parentCompany || 'ታሜና ሥራው ኃ/የተ/የግ/ማ (Tame & Seraw PLC)';
  const sisterCompany = config.sisterCompany || 'ውሽዬ ሶፍትዌር ሶሉሽን (Wushiye Software Solution)';
  const creatorName = config.leadProgrammer || 'ታምራት አሌ (Tamerat Ale)';
  const location = config.address || 'ሻሸመኔ፣ ኢትዮጵያ (Shashemene, Ethiopia)';
  const email = config.developerEmail || 'tameratale09@gmail.com';
  const websiteUrl = config.websiteUrl || 'https://weshya-sofetyer-solshene.netlify.app/#deployment-modes';

  const roles = [
    {
      title: 'ዋና ቀዳሚ ፕሮግራመር (Lead / Chief Programmer)',
      name: creatorName,
      icon: <Code2 className="w-4 h-4 text-amber-400" />,
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-200',
      badge: 'Architecture & Lead'
    },
    {
      title: 'የባክኢንድ ኢንጅነር (Backend Systems)',
      name: creatorName,
      icon: <Server className="w-4 h-4 text-emerald-400" />,
      color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-200',
      badge: 'Database & Security'
    },
    {
      title: 'የፍሮንትኢንድ ኢንጅነር (Frontend Interface)',
      name: creatorName,
      icon: <Layers className="w-4 h-4 text-sky-400" />,
      color: 'from-sky-500/20 to-sky-600/10 border-sky-500/30 text-sky-200',
      badge: 'Mobile & Web PWA'
    },
    {
      title: 'የዩአይ/ዩኤክስ ዲዛይነር (UI/UX & Product Design)',
      name: creatorName,
      icon: <Palette className="w-4 h-4 text-purple-400" />,
      color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-200',
      badge: 'Visual Experience'
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto text-white flex flex-col max-h-[92vh]">
        {/* Header Hero Banner */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/60 border-b border-slate-800 overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-400 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                  <Cpu className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[11px] font-black text-amber-300 mb-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>ሲስተሙን ማን ገነባው? (Who Built The System?)</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  የሲስተም አበልፃጊ እና የቴክኖሎጂ ባለቤት
                </h2>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ ዲጂታል መረጃ አያያዝ ቴክኖሎጂ
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
              title="ዝጋ (Close)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-300 divide-y divide-slate-800/80">
          {/* Section 1: Corporate Pedigree Card */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>የድርጅቱ ህጋዊ መዋቅር (Company & Enterprise Structure)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Parent Company */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl relative overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  እናት ኩባንያ (Parent Company)
                </span>
                <h4 className="text-sm font-black text-white leading-snug">
                  {parentCompany}
                </h4>
                <p className="text-[11px] text-amber-300/90 font-medium mt-1">
                  ታሜና ሥራው ኃ/የተ/የግ/ማ (Tame & Seraw PLC)
                </p>
              </div>

              {/* Sister Enterprise */}
              <div className="p-3.5 bg-gradient-to-br from-amber-950/30 to-slate-950/80 border border-amber-500/30 rounded-2xl relative overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                  እህት ድርጅት / ሶፍትዌር ዲቪዥን (Sister Enterprise)
                </span>
                <h4 className="text-sm font-black text-amber-200 leading-snug">
                  {sisterCompany}
                </h4>
                <p className="text-[11px] text-slate-300 mt-1">
                  ውሽዬ ሶፍትዌር ሶሉሽን (Wushiye Software Solution)
                </p>
                <div className="mt-2 pt-2 border-t border-amber-500/20 flex items-center justify-between">
                  <span className="text-[10px] text-amber-300/80">ይፋዊ ዌብ ገፅ፡</span>
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-white underline underline-offset-2"
                  >
                    <span>weshya-sofetyer-solshene.netlify.app</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Creator & Roles Breakdown */}
          <div className="pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>የምህንድስና እና የሙያ ድርሻ (Engineering Leadership)</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[10px]">
                Full-Stack Creator
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {roles.map((r, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border bg-gradient-to-br ${r.color} flex flex-col justify-between space-y-1.5`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-900/80 shadow-xs">
                        {r.icon}
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">
                        {r.title}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/10">
                    <span className="text-xs font-black text-white">{r.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-300">
                      {r.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Official Address & Direct Contact Numbers */}
          <div className="pt-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>ይፋዊ አድራሻ እና ቀጥታ ስልኮች (Official Contacts)</span>
            </h3>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
              {/* Location */}
              <div className="flex items-center gap-3 text-slate-200">
                <div className="p-2 rounded-xl bg-slate-800 text-amber-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    ዋና አድራሻ (Location)
                  </span>
                  <span className="text-xs font-bold text-white">{location}</span>
                </div>
              </div>

              {/* Phone 1 */}
              <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">ዋና ስልክ / ቴሌብር (Primary Phone):</span>
                    <a
                      href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                      className="font-mono text-sm font-black text-emerald-300 hover:underline"
                    >
                      {primaryPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                  >
                    <span>ደውል</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(primaryPhone, 'p1')}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                    title="ስልክ ቁጥር ቅዳ"
                  >
                    {copiedKey === 'p1' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Phone 2 */}
              <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">ሁለተኛ ስልክ / ድጋፍ (Secondary Support):</span>
                    <a
                      href={`tel:${secondaryPhone.replace(/\s+/g, '')}`}
                      className="font-mono text-sm font-black text-sky-300 hover:underline"
                    >
                      {secondaryPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${secondaryPhone.replace(/\s+/g, '')}`}
                    className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                  >
                    <span>ደውል</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(secondaryPhone, 'p2')}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                    title="ስልክ ቁጥር ቅዳ"
                  >
                    {copiedKey === 'p2' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">ይፋዊ ኢሜይል (Official Email):</span>
                    <a
                      href={`mailto:${email}`}
                      className="font-mono text-xs font-bold text-amber-200 hover:underline"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(email, 'email')}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                  title="ኢሜይል ቅዳ"
                >
                  {copiedKey === 'email' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Official Website & Deployment Modes (ይፋዊ ዌብ ገፅ) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/30 rounded-xl border-2 border-amber-500/40 shadow-md">
                <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shrink-0 shadow-md">
                    <Globe className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-amber-300 font-black uppercase tracking-wider">
                        ይፋዊ ዌብ ገፅ (Official Website)
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-[9px] font-mono font-bold border border-amber-400/40">
                        #DEPLOYMENT-MODES
                      </span>
                    </div>
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs font-black text-amber-200 hover:text-white hover:underline flex items-center gap-1.5 mt-0.5 break-all"
                    >
                      <span className="truncate max-w-[280px] sm:max-w-md">{websiteUrl}</span>
                      <ExternalLink className="w-3 h-3 text-amber-400 shrink-0 inline" />
                    </a>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      ውሽዬ ሶፍትዌር ሶሉሽን - የሲስተም ዝርጋታ አማራጮች፣ ዶክመንቴሽን እና አገልግሎቶች
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md hover:scale-102"
                  >
                    <span>ዌብ ገፅ ክፈት</span>
                    <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(websiteUrl, 'web')}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
                    title="የዌብ ገፅ ሊንኩን ቅዳ"
                  >
                    {copiedKey === 'web' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-400 text-center sm:text-left">
            © 2016-2017 ዓ.ም | <span className="text-amber-300 font-semibold">{sisterCompany}</span> · {location}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>ይፋዊ ዌብሳይት</span>
              <ExternalLink className="w-3 h-3 text-amber-400" />
            </a>

            {onOpenPaymentModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPaymentModal();
                }}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>የፈቃድ ክፍያ መረጃ</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md cursor-pointer text-center"
            >
              ተረድቻለሁ (እሺ)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
