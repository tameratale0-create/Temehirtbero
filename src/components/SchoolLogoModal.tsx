import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Sparkles,
  Trash2,
  Camera,
  Layers,
  Link as LinkIcon
} from 'lucide-react';
import { School, Language } from '../types';
import { SchoolLogo, SCHOOL_LOGO_PRESETS } from './SchoolLogo';

interface SchoolLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  school: School;
  onSaveLogo: (logoUrl: string | undefined) => void;
}

export const SchoolLogoModal: React.FC<SchoolLogoModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  school,
  onSaveLogo
}) => {
  const isOm = currentLang === 'om';
  const isEn = currentLang === 'en';
  const t3 = (om: string, en: string, am: string) => (isOm ? om : isEn ? en : am);

  const [selectedLogo, setSelectedLogo] = useState<string | undefined>(school.logoUrl);
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local file upload (images from camera or gallery or filesystem)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage(
        t3(
          'Mee faayilii fakkii (PNG, JPG, WebP) qofa filadhaa.',
          'Please select a valid image file (PNG, JPG, WebP).',
          'እባክዎ ትክክለኛ የፎቶ ፋይል (PNG, JPG, WebP) ይምረጡ።'
        )
      );
      return;
    }

    // Max 4MB raw file size check
    if (file.size > 4 * 1024 * 1024) {
      setErrorMessage(
        t3(
          'Hangi fakkii 4MB ol ta’uu hin danda’u.',
          'Image size must not exceed 4MB.',
          'የፎቶው መጠን ከ 4MB መብለጥ የለበትም።'
        )
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;

      // Optimize image size using canvas so it fits smoothly in localStorage
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 320;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimized = canvas.toDataURL('image/jpeg', 0.85);
            setSelectedLogo(optimized);
          } else {
            setSelectedLogo(dataUrl);
          }
        } catch {
          setSelectedLogo(dataUrl);
        } finally {
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setIsProcessing(false);
        setSelectedLogo(dataUrl);
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      setIsProcessing(false);
      setErrorMessage(
        t3('Dogoggorri dubbisuu faayilaa uumameera.', 'Error reading the selected file.', 'የፋይል ንባብ ስህተት አጋጥሟል።')
      );
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setSelectedLogo(urlInput.trim());
  };

  const handleSave = () => {
    onSaveLogo(selectedLogo);
    onClose();
  };

  const handleRemove = () => {
    setSelectedLogo(undefined);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full my-6 shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-5 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Camera className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold leading-tight">
                {t3(
                  'Galmee Asxaa Piroofaayilii Mana Barumsaa',
                  'School Profile Logo Manager',
                  'የትምህርት ቤት ፕሮፋይል አርማ ማስገቢያ'
                )}
              </h3>
              <p className="text-[11px] text-emerald-200">
                {school.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Live Preview Box */}
          <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 p-4 rounded-xl text-white flex items-center justify-between gap-4 border border-emerald-500/30">
            <div className="flex items-center gap-3">
              <SchoolLogo
                logoUrl={selectedLogo}
                schoolName={school.name}
                size={64}
                className="shadow-lg ring-2 ring-emerald-400/50"
              />
              <div>
                <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
                  {t3('Ilaalcha Kallattii (Live Preview)', 'Live Preview', 'የቀጥታ እይታ (Live Preview)')}
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-1">
                  {school.name}
                </h4>
                <p className="text-[11px] text-slate-300">
                  {selectedLogo
                    ? t3('Asxaan filatameera', 'Logo selected', 'አርማ ተመርጧል')
                    : t3('Chaappaa Seeraa Idilee', 'Default Official Emblem', 'መደበኛ ይፋዊ ማኅተም')}
                </p>
              </div>
            </div>

            {selectedLogo && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-2.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg border border-red-500/40 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                title={t3('Asxaa haqi', 'Remove logo', 'አርማውን አስወግድ')}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t3('Haqi', 'Remove', 'አስወግድ')}</span>
              </button>
            )}
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'upload'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t3('Suuraa Fe\'i', 'Upload Photo', 'ፎቶ ጫን')}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preset')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'preset'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t3('Asxaawwan Qophaa\'an', 'Preset Logos', 'የተዘጋጁ አርማዎች')}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'url'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>{t3('Liinkii Suuraa (URL)', 'Image URL', 'የፎቶ ሊንክ (URL)')}</span>
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Tab 1: Local File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-2"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-xs sm:text-sm">
                    {t3(
                      'Asxaa mana barumsaa fe\'uuf asitti cuqaasaa',
                      'Click here to upload school logo image',
                      'የትምህርት ቤት አርማ ፎቶ ለመጫን እዚህ ይጫኑ'
                    )}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {t3(
                      'Gaalarii bilbilaa, kaameeraa ykn kompiitara irraa (PNG, JPG, WebP)',
                      'From phone gallery, camera, or computer (PNG, JPG, WebP)',
                      'ከሞባይል ስልክ ጋለሪ፣ ካሜራ ወይም ኮምፒተር (PNG, JPG, WebP)'
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{t3('Suuraa Filadhu', 'Select Photo', 'ፎቶ ምረጥ')}</span>
                </button>
              </div>

              {isProcessing && (
                <div className="text-center text-xs text-emerald-700 font-semibold py-2">
                  {t3('Suuraan qophaa\'aa jira...', 'Processing image...', 'ፎቶው እየተዘጋጀ ነው...')}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Curated Educational Emblem Presets */}
          {activeTab === 'preset' && (
            <div className="space-y-2.5">
              <p className="text-slate-600 text-[11px]">
                {t3(
                  'Asxaa seeraa mana barumsaa keessan bakka bu\'u filadhaa:',
                  'Select an official emblem representing your school:',
                  'የትምህርት ቤትዎን መገለጫ የሚወክል ይፋዊ አርማ ይምረጡ፡'
                )}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SCHOOL_LOGO_PRESETS.map((preset) => {
                  const isSelected = selectedLogo === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedLogo(preset.id)}
                      className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-2 transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/30'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <SchoolLogo
                        logoUrl={preset.id}
                        schoolName={school.name}
                        size={48}
                      />
                      <span className="text-[11px] font-bold text-slate-800 leading-tight">
                        {isOm ? preset.labelOm : isEn ? preset.labelEn : preset.labelAm}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Image URL */}
          {activeTab === 'url' && (
            <form onSubmit={handleApplyUrl} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t3('Teessoo Suuraa Toora Irraa (Direct Image URL)', 'Direct Image URL', 'የኦንላይን ፎቶ አድራሻ (Direct Image URL)')}
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/school-logo.png"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl transition-colors"
              >
                {t3('Suuraa Hojiirra Oolchi', 'Apply Photo', 'ፎቶውን ተግብር')}
              </button>
            </form>
          )}

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
            {t3(
              'ℹ️ Asxaan filatame fuula duraa mana barumsaa, kaardii eenyummaa barattootaa fi kaardii qabxii irratti kallattiin ni mul\'ata.',
              'ℹ️ The selected logo appears directly on the school portal home page, student ID cards, and report cards.',
              'ℹ️ የተመረጠው አርማ በትምህርት ቤቱ መነሻ ገጽ፣ በተማሪዎች መታወቂያ ካርድ እና በውጤት ካርዶች ላይ በቀጥታ ይታያል።'
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            {t3('Dhiisi', 'Cancel', 'ሰርዝ')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t3('Asxaa Galmeessi', 'Save Logo', 'አርማውን መዝግብ')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
