import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Laptop,
  CheckCircle2,
  X,
  Share2,
  PlusSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';
import { translations } from '../data/translations';

interface PWAInstallButtonProps {
  currentLang: Language;
  variant?: 'header' | 'hero' | 'floating' | 'card';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  currentLang,
  variant = 'header',
  className = ''
}) => {
  const { isInstallable, isInstalled, isIOS, isMobile, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'mobile' | 'pc'>(isMobile ? 'mobile' : 'pc');
  const [installedNotice, setInstalledNotice] = useState(false);

  const t = translations[currentLang] || translations.am;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstalledNotice(true);
        setTimeout(() => setInstalledNotice(false), 5000);
        return;
      }
    }
    // If not direct or iOS or fallback, show guided visual installation instructions
    setShowModal(true);
  };

  // If already installed and variant is header, show sleek installed badge or button
  if (isInstalled && variant === 'header') {
    return (
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/50 transition-colors ${className}`}
        title={t.install_app_success}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">{currentLang === 'am' ? 'ተጭኗል' : currentLang === 'om' ? 'Fe\'ameera' : 'Installed'}</span>
      </button>
    );
  }

  return (
    <>
      {/* Variant-based trigger button */}
      {variant === 'header' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-95 ${
            isInstallable
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/30 ring-2 ring-emerald-400/40 animate-pulse'
              : 'bg-emerald-800/90 hover:bg-emerald-700/90 border border-emerald-500/40 text-emerald-100'
          } ${className}`}
          title={t.install_app_btn}
        >
          <Download className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden md:inline">{t.install_app_btn}</span>
          <span className="md:hidden">{currentLang === 'am' ? 'ጫን' : currentLang === 'om' ? 'Fe\'i' : 'Install'}</span>
          <span className="flex items-center gap-0.5 text-[10px] bg-black/30 px-1.5 py-0.5 rounded-md font-mono text-emerald-200">
            <Smartphone className="w-2.5 h-2.5" />
            <Laptop className="w-2.5 h-2.5" />
          </span>
        </button>
      )}

      {variant === 'card' && (
        <div className={`p-4 rounded-2xl bg-gradient-to-br from-emerald-900/80 via-slate-900 to-teal-950 border border-emerald-500/40 text-white shadow-xl ${className}`}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Download className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  {t.install_app_title}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-medium">PWA</span>
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {t.install_app_desc}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-emerald-800/50">
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-md transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>{t.btn_install_now}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/15 text-slate-200 transition-colors"
            >
              {currentLang === 'am' ? 'የአጫጫን መመሪያ' : currentLang === 'om' ? 'Qajeelfama Fe\'iinsaa' : 'Install Guide'}
            </button>
          </div>
        </div>
      )}

      {variant === 'hero' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 shadow-xl shadow-amber-900/20 transition-all hover:scale-[1.02] active:scale-95 ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>{t.btn_install_now}</span>
          <div className="flex items-center gap-1 text-[11px] bg-slate-950/20 px-2 py-0.5 rounded-lg font-mono">
            <span>Android</span>
            <span>•</span>
            <span>PC</span>
            <span>•</span>
            <span>iOS</span>
          </div>
        </button>
      )}

      {/* Success Banner if installed */}
      {installedNotice && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-emerald-600 text-white shadow-2xl flex items-center gap-3 border border-emerald-300 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-xs font-bold">{t.install_app_success}</span>
        </div>
      )}

      {/* Guided Installation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-emerald-500/40 text-slate-100 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40 border border-emerald-400/30">
                <Download className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {t.install_app_title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.install_app_desc}
                </p>
              </div>
            </div>

            {/* If direct browser prompt is available, highlight big action button */}
            {isInstallable && (
              <div className="mb-5 p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 animate-spin" />
                  <div>
                    <div className="text-xs font-bold text-emerald-200">
                      {currentLang === 'am' ? 'ቀጥታ መጫኛ ዝግጁ ነው!' : currentLang === 'om' ? 'Kallattiin fe\'uun qophiidha!' : 'Direct Install Ready!'}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {currentLang === 'am' ? 'አንድ ጊዜ በመጫን ወዲያውኑ በስልክዎ ወይም በኮምፒተርዎ ላይ ያዋህዱ' : currentLang === 'om' ? 'Cuqaasii tokkoon mobaayila ykn PC keessan irratti fe\'aa' : 'One click to install directly onto your device'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await install();
                    if (ok) setShowModal(false);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  {t.btn_install_now}
                </button>
              </div>
            )}

            {/* Platform Selection Tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-800/80 rounded-xl mb-5 border border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('mobile')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'mobile'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>{currentLang === 'am' ? 'ሞባይል ስልክ (Android / iPhone)' : currentLang === 'om' ? 'Bilbila Mobaayilaa' : 'Mobile Phone'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pc')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'pc'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span>{currentLang === 'am' ? 'ኮምፒተር (Desktop / Laptop)' : currentLang === 'om' ? 'Kompiitara (PC / Laptop)' : 'Computer / PC'}</span>
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'mobile' ? (
              <div className="space-y-4">
                {/* Android Steps */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                    <Smartphone className="w-4 h-4" />
                    <span>{t.install_android_title}</span>
                  </div>
                  <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside pl-1">
                    <li>{t.install_android_step1}</li>
                    <li>
                      {currentLang === 'am'
                        ? 'ከዚያ "Install" ወይም "አክል" የሚለውን ያረጋግጡ'
                        : currentLang === 'om'
                        ? '"Install" ykn "Ida\'i" kan jedhu mirkaneessaa'
                        : 'Confirm by tapping "Install" or "Add"'}
                    </li>
                    <li className="text-emerald-300 font-medium">
                      {currentLang === 'am'
                        ? 'የመተግበሪያው አርማ በመነሻ ስክሪን ላይ ይቀመጣል፣ ያለ ኢንተርኔት ይሰራል!'
                        : currentLang === 'om'
                        ? 'Asxaan appii fuula jalqabaa irratti argama, tooraan ala hojjeta!'
                        : 'The app icon appears on your home screen and launches full-screen offline!'}
                    </li>
                  </ol>
                </div>

                {/* iPhone / iOS Steps */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
                    <Share2 className="w-4 h-4" />
                    <span>{t.install_ios_title}</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-2">
                    <p className="flex items-start gap-2">
                      <span className="font-bold text-amber-400">1.</span>
                      <span>{t.install_ios_step1}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="font-bold text-amber-400">2.</span>
                      <span>
                        {currentLang === 'am'
                          ? 'ከላይ በስተቀኝ ያለውን "Add" (አክል) የሚለውን ይጫኑ።'
                          : currentLang === 'om'
                          ? 'Mirga gubbaatti "Add" kan jedhu cuqaasaa.'
                          : 'Tap "Add" in the top-right corner to place on Home Screen.'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* PC / Desktop Steps */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                    <Laptop className="w-4 h-4" />
                    <span>{t.install_pc_title}</span>
                  </div>
                  <ol className="text-xs text-slate-300 space-y-2.5 list-decimal list-inside pl-1">
                    <li>{t.install_pc_step1}</li>
                    <li>
                      {currentLang === 'am'
                        ? 'ወይም በብሮውዘርዎ ከላይ ቀኝ ያለውን ሜኑ (፧ ወይም ...) ከፍተው "Save and share" ➔ "Install Shashemene Education Bureau" የሚለውን ይጫኑ።'
                        : currentLang === 'om'
                        ? 'Ykn qabduu baafata Chrome/Edge (፧) banuun "Install app" filadhaa.'
                        : 'Or open browser menu (⋮) -> "Save and share" -> "Install application".'}
                    </li>
                    <li className="text-emerald-300 font-medium">
                      {currentLang === 'am'
                        ? 'በኮምፒተርዎ Desktop እና Start Menu ላይ እንደ ተናጠል የዊንዶውስ/ማክ አፕ ይቀመጣል!'
                        : currentLang === 'om'
                        ? 'Desktop fi Start Menu kompiitara keessanii irratti akkuma appii idilee ni ta\'a!'
                        : 'App installs to Windows Desktop / Start Menu or Mac Applications as a standalone app!'}
                    </li>
                  </ol>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-600/30 text-xs text-emerald-200 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    {currentLang === 'am'
                      ? 'ከተጫነ በኋላ ያለ ብሮውዘር አድራሻ አሞሌ ራሱን ችሎ በሙሉ ስክሪን ይሰራል፤ ዳታውም በኮምፒተርዎ ላይ ይቆጠባል።'
                      : currentLang === 'om'
                      ? 'Erga fe\'amee booda adda ba\'ee guutummaatti hojjeta, daataaniis kompiitara keessan irratti kuufama.'
                      : 'Runs in standalone mode without browser bars, caching all data locally on your computer.'}
                  </span>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                PWA • Shashemene Education Bureau
              </span>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                {currentLang === 'am' ? 'ዝጋ' : currentLang === 'om' ? 'Cufi' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
