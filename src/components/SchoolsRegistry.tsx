import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  Filter,
  GraduationCap,
  Users,
  Award,
  Phone,
  Mail,
  MapPin,
  Eye,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Printer,
  X,
  Sparkles
} from 'lucide-react';
import { Language, School, SchoolType, SchoolLevel, InspectionLevel } from '../types';
import { translations } from '../data/translations';
import { StorageService } from '../utils/storage';
import { SchoolLogo } from './SchoolLogo';

interface SchoolsRegistryProps {
  currentLang: Language;
  schools: School[];
  onSchoolsChange: (updated: School[]) => void;
}

export const SchoolsRegistry: React.FC<SchoolsRegistryProps> = ({
  currentLang,
  schools,
  onSchoolsChange
}) => {
  const t = translations[currentLang];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubcity, setSelectedSubcity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const filteredSchools = schools.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.nameOm && s.nameOm.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.principalName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubcity = selectedSubcity === 'all' || s.subcity.includes(selectedSubcity);
    const matchesType = selectedType === 'all' || s.type === selectedType;
    const matchesLevel = selectedLevel === 'all' || s.inspectionLevel === selectedLevel;

    return matchesSearch && matchesSubcity && matchesType && matchesLevel;
  });

  const getInspectionBadge = (lvl: InspectionLevel) => {
    switch (lvl) {
      case 'level_4':
        return {
          label:
            currentLang === 'om'
              ? 'Sadarkaa 4 (Moodeela)'
              : currentLang === 'en'
              ? 'Level 4 (Model)'
              : 'ደረጃ 4 (ሞዴል)',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300'
        };
      case 'level_3':
        return {
          label:
            currentLang === 'om'
              ? 'Sadarkaa 3 (Sadarkaa Gaarii)'
              : currentLang === 'en'
              ? 'Level 3 (Good)'
              : 'ደረጃ 3 (ጥሩ ደረጃ)',
          bg: 'bg-teal-100 text-teal-800 border-teal-300'
        };
      case 'level_2':
        return {
          label:
            currentLang === 'om'
              ? 'Sadarkaa 2 (Giddu-galeessa)'
              : currentLang === 'en'
              ? 'Level 2 (Average)'
              : 'ደረጃ 2 (መካከለኛ)',
          bg: 'bg-amber-100 text-amber-800 border-amber-300'
        };
      case 'level_1':
      default:
        return {
          label:
            currentLang === 'om'
              ? "Sadarkaa 1 (Fooyya'iinsa Barbaada)"
              : currentLang === 'en'
              ? 'Level 1 (Needs Improvement)'
              : 'ደረጃ 1 (ማሻሻያ የሚሻ)',
          bg: 'bg-rose-100 text-rose-800 border-rose-300'
        };
    }
  };

  const updateSchoolInspection = (schoolId: string, newLevel: InspectionLevel) => {
    const target = schools.find((s) => s.id === schoolId);
    if (!target) return;
    const updated = { ...target, inspectionLevel: newLevel };
    const list = StorageService.updateSchool(updated);
    onSchoolsChange(list);
    setSelectedSchool(updated);
  };

  const level4Count = schools.filter((s) => s.inspectionLevel === 'level_4').length;
  const level3Count = schools.filter((s) => s.inspectionLevel === 'level_3').length;

  return (
    <div className="space-y-6">
      {/* =========================================================================
          🌟 SCHOOLS REGISTRY TOP ACTION TOOLBAR: All actions unified at the top!
          "ሁሉም በየራሱ ገፅ ላይ ያሉ በተን ሳይዘበራረቅ ከላይ እንዲቀመጥ"
         ========================================================================= */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Row 1: Title, Quick Badges & Utility Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {t.tab_schools}
                </h2>
                <span className="text-xs text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 font-bold">
                  {filteredSchools.length} / {schools.length}{' '}
                  {currentLang === 'om' ? 'Dhaabbilee' : currentLang === 'en' ? 'Institutions' : 'ተቋማት'}
                </span>
                <span className="text-xs text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 font-bold hidden sm:inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>
                    {currentLang === 'om'
                      ? `Sadarkaa 4 Moodeela: ${level4Count}`
                      : currentLang === 'en'
                      ? `Level 4 Model: ${level4Count}`
                      : `ደረጃ 4 ሞዴል፡ ${level4Count}`}
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentLang === 'om'
                  ? 'Manneen barnootaa mootummaa, dhuunfaa fi mishinii Biiroo Barnootaa Bulchiinsa Magaalaa Shaashamanneetiin beekamtii argatan'
                  : currentLang === 'en'
                  ? 'Government, Private, and Mission schools accredited by Shashemene City Education Bureau'
                  : 'በሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ እውቅና የተሰጣቸው የመንግስት፣ የግል እና የሚሽን ትምህርት ቤቶች'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold">
              <Eye className="w-4 h-4 text-emerald-700" />
              <span>
                {currentLang === 'om'
                  ? 'Manneen barnootaa irraa kan ergame (Ilaaluu Qofa)'
                  : currentLang === 'en'
                  ? 'Submitted by Schools (Read-Only)'
                  : 'ከትምህርት ቤቶች የተላኩ (ማየት ብቻ - Read-Only)'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title={
                currentLang === 'om'
                  ? 'Tarree manneen barnootaa maxxansi'
                  : currentLang === 'en'
                  ? 'Print schools registry'
                  : 'የትምህርት ቤቶችን ዝርዝር አትም'
              }
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>
                {currentLang === 'om'
                  ? 'Tarree Maxxansi'
                  : currentLang === 'en'
                  ? 'Print List'
                  : 'ዝርዝር አትም'}
              </span>
            </button>
          </div>
        </div>

        {/* Row 2: Search Input & Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                currentLang === 'om'
                  ? 'Maqaa mana barumsaa, daarektaraa ykn koodii addaa barbaadi...'
                  : currentLang === 'en'
                  ? 'Search school name, principal or access code...'
                  : 'የትምህርት ቤት ስም፣ ርዕሰ መምህር ወይም መለያ ኮድ ፈልግ...'
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

          <div className="sm:col-span-3">
            <select
              value={selectedSubcity}
              onChange={(e) => setSelectedSubcity(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              <option value="all">
                {currentLang === 'om'
                  ? 'Kutaalee Magaalaa Hunda'
                  : currentLang === 'en'
                  ? 'All Subcities'
                  : 'ሁሉም ክፍለ ከተሞች (All Subcities)'}
              </option>
              <option value="አቦስቶ">{currentLang === 'om' ? 'Abosto' : currentLang === 'en' ? 'Abosto' : 'አቦስቶ (Abosto)'}</option>
              <option value="ቡልቻና">{currentLang === 'om' ? 'Bulchaanaa' : currentLang === 'en' ? 'Bulchana' : 'ቡልቻና (Bulchana)'}</option>
              <option value="አዋሾ">{currentLang === 'om' ? 'Awaashoo' : currentLang === 'en' ? 'Awasho' : 'አዋሾ (Awasho)'}</option>
              <option value="ቁዬራ">{currentLang === 'om' ? 'Kuyyeraa' : currentLang === 'en' ? 'Kuyera' : 'ቁዬራ (Kuyera)'}</option>
              <option value="አለሉ">{currentLang === 'om' ? 'Aleeluu' : currentLang === 'en' ? 'Alelu' : 'አለሉ (Alelu)'}</option>
              <option value="ዲዳ ቦቄ">{currentLang === 'om' ? 'Diida Boqee' : currentLang === 'en' ? 'Dida Boke' : 'ዲዳ ቦቄ (Dida Boke)'}</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              <option value="all">
                {currentLang === 'om'
                  ? 'Gosa Hunda'
                  : currentLang === 'en'
                  ? 'All Types'
                  : 'ሁሉም አይነት (All Types)'}
              </option>
              <option value="government">
                {currentLang === 'om'
                  ? 'Kan Mootummaa'
                  : currentLang === 'en'
                  ? 'Government'
                  : 'የመንግስት (Government)'}
              </option>
              <option value="private">
                {currentLang === 'om'
                  ? 'Kan Dhuunfaa'
                  : currentLang === 'en'
                  ? 'Private'
                  : 'የግል (Private)'}
              </option>
              <option value="mission">
                {currentLang === 'om'
                  ? 'Kan Mishinii / Hawaasaa'
                  : currentLang === 'en'
                  ? 'Mission / Public'
                  : 'የሚሽን / የህዝብ (Mission)'}
              </option>
            </select>
          </div>
        </div>

        {/* Row 3: Level Quick Filter Action Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
          <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-emerald-800" />
            <span>{currentLang === 'om' ? 'Sadarkaa:' : currentLang === 'en' ? 'Level:' : 'ደረጃ፡'}</span>
          </span>
          {[
            {
              id: 'all',
              label:
                currentLang === 'om'
                  ? 'Sadarkaa Hunda'
                  : currentLang === 'en'
                  ? 'All Levels'
                  : 'ሁሉም ደረጃዎች'
            },
            {
              id: 'level_4',
              label:
                currentLang === 'om'
                  ? 'Sadarkaa 4 (Moodeela)'
                  : currentLang === 'en'
                  ? 'Level 4 (Model)'
                  : 'ደረጃ 4 (ሞዴል)'
            },
            {
              id: 'level_3',
              label:
                currentLang === 'om'
                  ? 'Sadarkaa 3 (Gaarii)'
                  : currentLang === 'en'
                  ? 'Level 3 (Good)'
                  : 'ደረጃ 3 (ጥሩ)'
            },
            {
              id: 'level_2',
              label:
                currentLang === 'om'
                  ? 'Sadarkaa 2 (Giddu-galeessa)'
                  : currentLang === 'en'
                  ? 'Level 2 (Average)'
                  : 'ደረጃ 2 (መካከለኛ)'
            },
            {
              id: 'level_1',
              label:
                currentLang === 'om'
                  ? "Sadarkaa 1 (Fooyya'iinsa Barbaada)"
                  : currentLang === 'en'
                  ? 'Level 1 (Needs Improvement)'
                  : 'ደረጃ 1 (ማሻሻያ የሚሻ)'
            }
          ].map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setSelectedLevel(lvl.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedLevel === lvl.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {lvl.label}
            </button>
          ))}

          {(searchTerm || selectedSubcity !== 'all' || selectedType !== 'all' || selectedLevel !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedSubcity('all');
                setSelectedType('all');
                setSelectedLevel('all');
              }}
              className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>
                {currentLang === 'om'
                  ? 'Gingilchaa Haqi'
                  : currentLang === 'en'
                  ? 'Clear Filters'
                  : 'ማጣሪያ አጽዳ'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Schools Cards / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchools.map((school) => {
          const badge = getInspectionBadge(school.inspectionLevel);
          return (
            <div
              key={school.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <SchoolLogo
                      logoUrl={school.logoUrl}
                      schoolName={school.name}
                      size={40}
                      shape="rounded"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 leading-snug">
                        {currentLang === 'om' ? (school.nameOm || school.name) : school.name}
                      </h3>
                      {currentLang === 'om' ? (
                        <p className="text-[11px] text-slate-500 line-clamp-1">{school.name}</p>
                      ) : (
                        school.nameOm && (
                          <p className="text-[11px] text-slate-500 line-clamp-1">{school.nameOm}</p>
                        )
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${badge.bg}`}
                  >
                    {badge.label}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">
                      {currentLang === 'om'
                        ? "Ida'ama Barattootaa"
                        : currentLang === 'en'
                        ? 'Total Students'
                        : 'አጠቃላይ ተማሪ'}
                    </span>
                    <strong className="text-slate-800 text-sm">
                      {school.totalStudents.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-slate-500 block">
                      ({currentLang === 'om' ? 'Dhi: ' : 'ወ: '}
                      {school.maleStudents} · {currentLang === 'om' ? 'Dub: ' : 'ሴ: '}
                      {school.femaleStudents})
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">
                      {currentLang === 'om'
                        ? 'Barsiisota'
                        : currentLang === 'en'
                        ? 'Teachers'
                        : 'መምህራን'}
                    </span>
                    <strong className="text-slate-800 text-sm">{school.totalTeachers}</strong>
                    <span className="text-[10px] text-slate-500 block">
                      ({currentLang === 'om' ? 'Dhi: ' : 'ወ: '}
                      {school.maleTeachers} · {currentLang === 'om' ? 'Dub: ' : 'ሴ: '}
                      {school.femaleTeachers})
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block">
                      {currentLang === 'om'
                        ? 'Kutaalee / Laab'
                        : currentLang === 'en'
                        ? 'Classrooms / Labs'
                        : 'ክፍሎች / ላብራቶሪ'}
                    </span>
                    <span className="font-semibold text-slate-700">
                      {school.classroomsCount} {currentLang === 'om' ? 'Kutaa' : 'ክፍል'} /{' '}
                      {school.labsCount} {currentLang === 'om' ? 'Laab' : 'ላብ'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block">
                      {currentLang === 'om'
                        ? 'Kifle Ketemaa'
                        : currentLang === 'en'
                        ? 'Subcity'
                        : 'ክፍለ ከተማ'}
                    </span>
                    <span className="font-semibold text-slate-700">{school.subcity}</span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{school.phone}</span>
                    <span>·</span>
                    <span>{school.principalName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-1 rounded">
                      {currentLang === 'om' ? 'Koodii:' : currentLang === 'en' ? 'Code:' : 'ኮድ:'} {school.accessCode}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {currentLang === 'om' ? 'Bara Hundeeffamaa:' : currentLang === 'en' ? 'Est:' : 'ዓ.ም:'} {school.establishedYear}
                </span>
                <button
                  onClick={() => setSelectedSchool(school)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>
                    {currentLang === 'om'
                      ? 'Bal’ina Guutuu'
                      : currentLang === 'en'
                      ? 'Full Details'
                      : 'ሙሉ ዝርዝር'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* School Detail Modal */}
      {selectedSchool && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {currentLang === 'om' ? (selectedSchool.nameOm || selectedSchool.name) : selectedSchool.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {currentLang === 'om' ? selectedSchool.name : (selectedSchool.nameOm || selectedSchool.subcity)}
                </p>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                  getInspectionBadge(selectedSchool.inspectionLevel).bg
                }`}
              >
                {getInspectionBadge(selectedSchool.inspectionLevel).label}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px]">
                  {currentLang === 'om'
                    ? 'Koodii Seensaa Mana Barumsaa'
                    : currentLang === 'en'
                    ? 'School Access Code'
                    : 'የት/ቤት መለያ ኮድ'}
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {selectedSchool.accessCode}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">
                  {currentLang === 'om'
                    ? 'Gosa Dhaabbataa'
                    : currentLang === 'en'
                    ? 'Institution Type'
                    : 'ተቋም አይነት'}
                </span>
                <span className="font-semibold text-slate-800 capitalize">
                  {selectedSchool.type}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">
                  {currentLang === 'om' ? 'Sadarkaa' : currentLang === 'en' ? 'Level' : 'ደረጃ'}
                </span>
                <span className="font-semibold text-slate-800 capitalize">
                  {selectedSchool.level}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">
                  {currentLang === 'om'
                    ? "Ida'ama Barattootaa"
                    : currentLang === 'en'
                    ? 'Total Students'
                    : 'አጠቃላይ ተማሪዎች'}
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedSchool.totalStudents.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">
                  {currentLang === 'om'
                    ? "Ida'ama Barsiisotaa"
                    : currentLang === 'en'
                    ? 'Total Teachers'
                    : 'አጠቃላይ መምህራን'}
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedSchool.totalTeachers}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">
                  {currentLang === 'om'
                    ? 'Baay’ina Kutaalee'
                    : currentLang === 'en'
                    ? 'Classrooms'
                    : 'የክፍሎች ብዛት'}
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedSchool.classroomsCount} {currentLang === 'om' ? 'Kutaalee' : currentLang === 'en' ? 'Rooms' : 'ክፍሎች'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">
                  {currentLang === 'om'
                    ? 'Baay’ina Laaboraatoorii'
                    : currentLang === 'en'
                    ? 'Laboratories'
                    : 'የላብራቶሪ ብዛት'}
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedSchool.labsCount} {currentLang === 'om' ? 'Laab' : currentLang === 'en' ? 'Labs' : 'ላቦራቶሪ'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">
                  {currentLang === 'om'
                    ? 'Dandeettii Mana Kitaabaa'
                    : currentLang === 'en'
                    ? 'Library Capacity'
                    : 'የቤተ-መጽሐፍት አቅም'}
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedSchool.libraryCapacity} {currentLang === 'om' ? 'Teessoo' : currentLang === 'en' ? 'Seats' : 'መቀመጫ'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">
                  {currentLang === 'om'
                    ? 'Bara Hundeeffamaa'
                    : currentLang === 'en'
                    ? 'Established Year'
                    : 'የተመሰረተበት ዓ.ም'}
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedSchool.establishedYear}
                </span>
              </div>
            </div>

            {/* Principal & Communication */}
            <div className="border border-slate-200 rounded-xl p-3.5 text-xs space-y-1.5">
              <p className="font-bold text-slate-800">
                {currentLang === 'om'
                  ? 'Odeeffannoo Daarektaraa:'
                  : currentLang === 'en'
                  ? 'Principal / Director Information:'
                  : 'የርዕሰ መምህሩ / የዳይሬክተሩ መረጃ፡'}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-slate-600">
                <span>
                  {currentLang === 'om' ? 'Maqaa:' : currentLang === 'en' ? 'Name:' : 'ስም:'}{' '}
                  <strong>{selectedSchool.principalName}</strong>
                </span>
                <span>
                  {currentLang === 'om' ? 'Bilbila:' : currentLang === 'en' ? 'Phone:' : 'ስልክ:'}{' '}
                  <strong>{selectedSchool.phone}</strong>
                </span>
                <span>
                  {currentLang === 'om' ? 'Imeeyilii:' : currentLang === 'en' ? 'Email:' : 'ኢሜይል:'}{' '}
                  <strong>{selectedSchool.email}</strong>
                </span>
              </div>
            </div>

            {/* Change Inspection Rating */}
            <div className="border border-slate-200 rounded-xl p-3.5 text-xs">
              <label className="block font-bold text-slate-800 mb-1.5">
                {currentLang === 'om'
                  ? 'Madaallii Sadarkaa Qulqullinaa Biiroo Barnootaa Jijjiiri (Update Inspection Rating):'
                  : currentLang === 'en'
                  ? 'Update Bureau Inspection Quality Rating:'
                  : 'የትምህርት ቢሮ የጥራት ደረጃ ምዘና ቀይር (Update Inspection Rating)፡'}
              </label>
              <div className="flex flex-wrap gap-2">
                {(['level_1', 'level_2', 'level_3', 'level_4'] as InspectionLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => updateSchoolInspection(selectedSchool.id, lvl)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border cursor-pointer ${
                      selectedSchool.inspectionLevel === lvl
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
                    }`}
                  >
                    {lvl === 'level_4'
                      ? currentLang === 'om'
                        ? 'Sadarkaa 4 (Moodeela)'
                        : currentLang === 'en'
                        ? 'Level 4 (Model)'
                        : 'ደረጃ 4 (ሞዴል)'
                      : lvl === 'level_3'
                      ? currentLang === 'om'
                        ? 'Sadarkaa 3 (Gaarii)'
                        : currentLang === 'en'
                        ? 'Level 3 (Good)'
                        : 'ደረጃ 3 (ጥሩ)'
                      : lvl === 'level_2'
                      ? currentLang === 'om'
                        ? 'Sadarkaa 2 (Giddu-galeessa)'
                        : currentLang === 'en'
                        ? 'Level 2 (Average)'
                        : 'ደረጃ 2 (መካከለኛ)'
                      : currentLang === 'om'
                      ? 'Sadarkaa 1'
                      : currentLang === 'en'
                      ? 'Level 1'
                      : 'ደረጃ 1'}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSchool(null)}
                className="px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                {currentLang === 'om' ? 'Cufi' : currentLang === 'en' ? 'Close' : 'ዝጋ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
