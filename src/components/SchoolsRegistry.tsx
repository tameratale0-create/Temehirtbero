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
                  {t.tab_schools} (Schools Registry)
                </h2>
                <span className="text-xs text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 font-bold">
                  {filteredSchools.length} / {schools.length} ተቋማት
                </span>
                <span className="text-xs text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 font-bold hidden sm:inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>ደረጃ 4 ሞዴል፡ {level4Count}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                በሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ እውቅና የተሰጣቸው የመንግስት፣ የግል እና የሚሽን ትምህርት ቤቶች
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold">
              <Eye className="w-4 h-4 text-emerald-700" />
              <span>ከትምህርት ቤቶች የተላኩ (ማየት ብቻ - Read-Only)</span>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="የትምህርት ቤቶችን ዝርዝር አትም"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>ዝርዝር አትም</span>
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
              placeholder="የትምህርት ቤት ስም፣ ርዕሰ መምህር ወይም መለያ ኮድ ፈልግ..."
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
              <option value="all">ሁሉም ክፍለ ከተሞች (All Subcities)</option>
              <option value="አቦስቶ">አቦስቶ (Abosto)</option>
              <option value="ቡልቻና">ቡልቻና (Bulchana)</option>
              <option value="አዋሾ">አዋሾ (Awasho)</option>
              <option value="ቁዬራ">ቁዬራ (Kuyera)</option>
              <option value="አለሉ">አለሉ (Alelu)</option>
              <option value="ዲዳ ቦቄ">ዲዳ ቦቄ (Dida Boke)</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              <option value="all">ሁሉም አይነት (All Types)</option>
              <option value="government">የመንግስት (Government)</option>
              <option value="private">የግል (Private)</option>
              <option value="mission">የሚሽን / የህዝብ (Mission)</option>
            </select>
          </div>
        </div>

        {/* Row 3: Level Quick Filter Action Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
          <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-emerald-800" />
            <span>ደረጃ፡</span>
          </span>
          {[
            { id: 'all', label: 'ሁሉም ደረጃዎች' },
            { id: 'level_4', label: 'ደረጃ 4 (ሞዴል)' },
            { id: 'level_3', label: 'ደረጃ 3 (ጥሩ)' },
            { id: 'level_2', label: 'ደረጃ 2 (መካከለኛ)' },
            { id: 'level_1', label: 'ደረጃ 1 (ማሻሻያ የሚሻ)' }
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
              <span>ማጣሪያ አጽዳ</span>
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
                      ኮድ: {school.accessCode}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  ዓ.ም: {school.establishedYear}
                </span>
                <button
                  onClick={() => setSelectedSchool(school)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>ሙሉ ዝርዝር</span>
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
                <h3 className="text-base font-bold text-slate-900">{selectedSchool.name}</h3>
                <p className="text-xs text-slate-500">{selectedSchool.nameOm || selectedSchool.subcity}</p>
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
                <span className="text-slate-400 block text-[10px]">የት/ቤት መለያ ኮድ</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {selectedSchool.accessCode}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ተቋም አይነት</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {selectedSchool.type}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ደረጃ</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {selectedSchool.level}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">አጠቃላይ ተማሪዎች</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedSchool.totalStudents.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">አጠቃላይ መምህራን</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedSchool.totalTeachers}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">የክፍሎች ብዛት</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedSchool.classroomsCount} ክፍሎች
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">የላብራቶሪ ብዛት</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedSchool.labsCount} ላቦራቶሪ
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">የቤተ-መጽሐፍት አቅም</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedSchool.libraryCapacity} መቀመጫ
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">የተመሰረተበት ዓ.ም</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedSchool.establishedYear}
                </span>
              </div>
            </div>

            {/* Principal & Communication */}
            <div className="border border-slate-200 rounded-xl p-3.5 text-xs space-y-1.5">
              <p className="font-bold text-slate-800">የርዕሰ መምህሩ / የዳይሬክተሩ መረጃ፡</p>
              <div className="flex flex-wrap items-center gap-4 text-slate-600">
                <span>ስም: <strong>{selectedSchool.principalName}</strong></span>
                <span>ስልክ: <strong>{selectedSchool.phone}</strong></span>
                <span>ኢሜይል: <strong>{selectedSchool.email}</strong></span>
              </div>
            </div>

            {/* Change Inspection Rating */}
            <div className="border border-slate-200 rounded-xl p-3.5 text-xs">
              <label className="block font-bold text-slate-800 mb-1.5">
                የትምህርት ቢሮ የጥራት ደረጃ ምዘና ቀይር (Update Inspection Rating)፡
              </label>
              <div className="flex flex-wrap gap-2">
                {(['level_1', 'level_2', 'level_3', 'level_4'] as InspectionLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => updateSchoolInspection(selectedSchool.id, lvl)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                      selectedSchool.inspectionLevel === lvl
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
                    }`}
                  >
                    {lvl === 'level_4'
                      ? 'ደረጃ 4 (ሞዴል)'
                      : lvl === 'level_3'
                      ? 'ደረጃ 3 (ጥሩ)'
                      : lvl === 'level_2'
                      ? 'ደረጃ 2 (መካከለኛ)'
                      : 'ደረጃ 1'}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSchool(null)}
                className="px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                ዝጋ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
