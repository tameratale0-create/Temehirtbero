import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Building2,
  Users,
  ShieldCheck,
  HelpCircle,
  Printer,
  Search,
  Filter,
  X
} from 'lucide-react';
import { Language, BureauStandardCriteria } from '../types';
import { translations } from '../data/translations';

interface BureauStandardsProps {
  currentLang: Language;
  standards: BureauStandardCriteria[];
}

export const BureauStandards: React.FC<BureauStandardsProps> = ({
  currentLang,
  standards
}) => {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredStandards = standards.filter((std) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      std.criterionTitle.toLowerCase().includes(q) ||
      std.description.toLowerCase().includes(q) ||
      std.category.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'all' || std.category.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* =========================================================================
          🌟 STANDARDS TOP ACTION TOOLBAR: All actions unified at the top!
         ========================================================================= */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {t.standards_title} (MoE Quality Standards)
                </h2>
                <span className="text-xs text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 font-bold">
                  {filteredStandards.length} / {standards.length}{' '}
                  {currentLang === 'om' ? 'Ulaagaalee' : currentLang === 'en' ? 'Criteria' : 'መስፈርቶች'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{t.standards_desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title={currentLang === 'om' ? 'Ulaagaalee Qulqullina Barnootaa Maxxansi' : currentLang === 'en' ? 'Print Education Quality Standards' : 'የትምህርት ጥራት መስፈርቶችን አትም'}
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>{currentLang === 'om' ? 'Ulaagaa Maxxansi' : currentLang === 'en' ? 'Print Standards' : 'መስፈርቱን አትም'}</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                currentLang === 'om'
                  ? 'Ulaagaa qulqullinaa ykn qajeelfama barbaadi...'
                  : currentLang === 'en'
                  ? 'Search quality standard or guideline...'
                  : 'የጥራት መስፈርት ወይም መመሪያ ፈልግ...'
              }
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            {[
              {
                id: 'all',
                label: currentLang === 'om' ? 'Ulaagaalee Hunda' : currentLang === 'en' ? 'All Criteria' : 'ሁሉም መስፈርቶች'
              },
              {
                id: 'ግብአት',
                label: currentLang === 'om' ? 'Galtee (Input)' : currentLang === 'en' ? 'Input' : 'ግብአት (Input)'
              },
              {
                id: 'ሂደት',
                label: currentLang === 'om' ? 'Adeemsa (Process)' : currentLang === 'en' ? 'Process' : 'ሂደት (Process)'
              },
              {
                id: 'ውጤት',
                label: currentLang === 'om' ? 'Bu’aa (Output)' : currentLang === 'en' ? 'Output' : 'ውጤት (Output)'
              }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Levels of School Accreditation in Ethiopia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level 1 */}
        <div className="bg-white p-5 rounded-2xl border-2 border-rose-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Level 1 (&lt; 50%)
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            {t.std_level1}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {currentLang === 'om'
              ? 'Ulaagaalee qulqullinaa gadi aanaa hin guutne; hanqina daree barnootaa, barsiisota leenjii hin qabnee fi to’annoo cimaa barbaadu.'
              : currentLang === 'en'
              ? 'Does not meet minimum quality standards; lacks classrooms and trained teachers, requiring strict supervision.'
              : 'ዝቅተኛ የጥራት መስፈርቶችን ያላሟላ፤ የመማሪያ ክፍሎች እጥረት፣ ያልሰለጠኑ መምህራን እና ከፍተኛ ቁጥጥር የሚሻ ተቋም።'}
          </p>
        </div>

        {/* Level 2 */}
        <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Level 2 (50% - 69%)
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            {t.std_level2}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {currentLang === 'om'
              ? 'Guddina irra kan jiru; galteewwan bu’uuraa qabaatus laabooraatoorii, kitaabotaa fi leenjii barsiisotaatiin fooyya’insa barbaada.'
              : currentLang === 'en'
              ? 'Developing institution; has basic inputs but needs improvement in laboratories, books, and teacher training.'
              : 'በማደግ ላይ ያለ፤ መሰረታዊ ግብአቶች ቢኖሩትም በላብራቶሪ፣ በመጽሐፍት እና በመምህራን ስልጠና ማሻሻያ የሚሻ።'}
          </p>
        </div>

        {/* Level 3 */}
        <div className="bg-white p-5 rounded-2xl border-2 border-teal-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Level 3 (70% - 84%)
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            {t.std_level3}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {currentLang === 'om'
              ? 'Hayyama qulqullina barnootaa guutuu (Accredited); barsiisota guutuu, qabxii barattootaa gaarii fi naannoo barnootaa sadarkaa eeggate.'
              : currentLang === 'en'
              ? 'Fully Accredited; qualified teaching staff, good student performance, and standard learning environment.'
              : 'የተሟላ የትምህርት ጥራት ፍቃድ (Accredited)፤ የተሟሉ መምህራን፣ ጥሩ የተማሪ ውጤት እና ደረጃውን የጠበቀ የመማሪያ አካባቢ።'}
          </p>
        </div>

        {/* Level 4 */}
        <div className="bg-white p-5 rounded-2xl border-2 border-emerald-300 shadow-xs bg-emerald-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
              Level 4 (≥ 85%)
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            {t.std_level4}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {currentLang === 'om'
              ? 'Mana barumsaa olaanaa fi moodeela; laabooraatoorii saayinsii ammayyaa, barsiisota 100% hayyama qaban fi harka darbinsaa olaanaa.'
              : currentLang === 'en'
              ? 'Exemplary & model school; modern science labs, 100% licensed teachers, and high pass rates.'
              : 'የላቀ እና ለሌሎች ሞዴል የሆነ ትምህርት ቤት፤ ዘመናዊ ሳይንስ ላቦራቶሪ፣ 100% ፈቃድ ያላቸው መምህራን እና ከፍተኛ የማለፍ ምጣኔ።'}
          </p>
        </div>
      </div>

      {/* Standards Evaluation Criteria Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          {currentLang === 'om'
            ? 'Ulaagaalee Qulqullinaa fi Giddugaleessa Magaalaa Shaashamannee (City Benchmarks)'
            : currentLang === 'en'
            ? 'Shashemene City Quality Standards & Current City Benchmarks'
            : 'የሻሸመኔ ከተማ አስተዳደር የጥራት መስፈርቶች እና የአሁን አማካይ (City Benchmarks)'}
        </h3>

        <div className="divide-y divide-slate-100">
          {filteredStandards.map((std) => (
            <div key={std.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {std.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">
                    {std.criterionTitle}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {std.description}
                </p>
              </div>

              <div className="flex items-center gap-6 shrink-0 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">{t.std_requirement}</span>
                  <strong className="text-slate-800">{std.targetStandard}</strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">{t.std_city_avg}</span>
                  <strong className="text-emerald-900">{std.currentCityAverage}</strong>
                </div>

                <div>
                  {std.status === 'on_track' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{currentLang === 'om' ? 'Guutameera' : currentLang === 'en' ? 'On Track' : 'ተሟልቷል'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{currentLang === 'om' ? 'Xiyyeeffannoo Barbaada' : currentLang === 'en' ? 'Needs Attention' : 'ትኩረት የሚሻ'}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
