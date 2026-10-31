import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Download,
  Eye,
  FileText,
  Tag,
  Clock,
  Printer,
  Sparkles,
  Send,
  Building,
  ShieldCheck,
  Info,
  Award
} from 'lucide-react';
import { Language, TrainingMaterial, AppUserSession } from '../types';
import { translations } from '../data/translations';
import { StorageService } from '../utils/storage';
import { OfflineSyncManager } from '../utils/offlineSync';
import { AIExamGeneratorModal } from './AIExamGeneratorModal';
import { getTeacherAssignment, isTrainingMaterialForTeacher } from '../utils/teacherAssignment';

interface TrainingMaterialsHubProps {
  currentLang: Language;
  materials: TrainingMaterial[];
  onMaterialsChange: (updated: TrainingMaterial[]) => void;
  isBureauOfficer?: boolean;
  currentUser?: AppUserSession | null;
}

export const TrainingMaterialsHub: React.FC<TrainingMaterialsHubProps> = ({
  currentLang,
  materials,
  onMaterialsChange,
  isBureauOfficer = true,
  currentUser = null
}) => {
  const t = translations[currentLang];

  const teacherAssignment = React.useMemo(() => {
    return getTeacherAssignment(currentUser);
  }, [currentUser]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [activeReading, setActiveReading] = useState<TrainingMaterial | null>(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);

  // AI Exam Generator Modal
  const [showAIExamModal, setShowAIExamModal] = useState(false);
  const [selectedMaterialForAIExam, setSelectedMaterialForAIExam] = useState<string | undefined>(undefined);

  // New training dispatch form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Mathematics (ሂሳብ)');
  const [newGradeLevels, setNewGradeLevels] = useState('Grades 7 - 12');
  const [newDepartment, setNewDepartment] = useState('ስርዓተ-ትምህርትና የመምህራን ልማት (Curriculum Dept)');
  const [newReadTime, setNewReadTime] = useState(15);
  const [newSummary, setNewSummary] = useState('');
  const [newFullContent, setNewFullContent] = useState('');

  const subjectsList = [
    'all',
    'Assessment & Pedagogy (ምዘና እና ስነ-ዘዴ)',
    'Afaan Oromoo fi Madaallii (Pedagogy & Assessment)',
    'Educational Technology & ICT (የትምህርት ቴክኖሎጂ)',
    'Ogummaa Barsiisummaa (General Pedagogy)',
    'Mathematics (ሂሳብ)',
    'Afaan Oromoo (ኦሮሚኛ)',
    'English (እንግሊዝኛ)',
    'Physics & Chemistry (ሳይንስ)',
    'Biology (ባዮሎጂ)',
    'Citizenship & Social Studies (ስነ-ዜጋ)',
    'General Pedagogy & CPD (አጠቃላይ ስነ-ዘዴ)'
  ];

  const filtered = materials.filter((m) => {
    // If not bureau officer (i.e. teacher), filter strictly by their assigned subject AND grade level
    // "መምህሩ እንደሚያስተምረው የትምህርት አይነቶች እና የ ክፍል ደረጃ ብቻ የስልጠና ማንዋል (ጽሑፍ) እንዲደርሰው አድርጉ"
    if (!isBureauOfficer) {
      if (!isTrainingMaterialForTeacher(m, teacherAssignment)) {
        return false;
      }
    }

    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = selectedSubject === 'all' || m.subject.includes(selectedSubject);
    return matchesSearch && matchesSubject;
  });

  const handleRead = (item: TrainingMaterial) => {
    const updated = StorageService.incrementDownload(item.id);
    onMaterialsChange(updated);
    setActiveReading(item);
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();

    const newMaterial: TrainingMaterial = {
      id: `mat-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      gradeLevels: newGradeLevels,
      authorDepartment: newDepartment,
      uploadedAt: new Date().toISOString().split('T')[0],
      readTimeMinutes: Number(newReadTime),
      tags: [newSubject.split(' ')[0], 'Pedagogy', 'Curriculum'],
      downloadCount: 1,
      summary: newSummary,
      fullContent: newFullContent
    };

    const updated = StorageService.addTrainingMaterial(newMaterial);
    onMaterialsChange(updated);

    // Enqueue training material for offline sync
    OfflineSyncManager.enqueue(
      'training_material',
      'create',
      newMaterial.id,
      newMaterial,
      {
        authorName: newDepartment,
        schoolName: 'የትምህርት ቢሮ የስርዓተ-ትምህርት ዳይሬክቶሬት',
        description: `የስልጠና ሰነድ፡ ${newMaterial.title} (${newMaterial.subject})`
      }
    );

    setShowDispatchModal(false);

    // Reset
    setNewTitle('');
    setNewSummary('');
    setNewFullContent('');
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          🌟 TRAINING TOP ACTION TOOLBAR: All actions unified at the top!
          "ሁሉም በየራሱ ገፅ ላይ ያሉ በተን ሳይዘበራረቅ ከላይ እንዲቀመጥ"
         ========================================================================= */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-violet-100 text-violet-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {t.train_title} (Training Hub)
                </h2>
                <span className="text-xs text-violet-900 bg-violet-100 px-2.5 py-0.5 rounded-full border border-violet-300 font-bold">
                  {filtered.length} / {materials.length} ሞጁሎች
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{t.train_desc}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
            {isBureauOfficer ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMaterialForAIExam(undefined);
                    setShowAIExamModal(true);
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 hover:from-emerald-700 hover:to-indigo-800 text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer border border-emerald-400/30 hover:scale-102"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>✨ በ AI ፈተና አውጣ (AI Exam Generator)</span>
                </button>

                <button
                  onClick={() => setShowDispatchModal(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.btn_send_material}</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>ፈተና የማውጣት ስልጣን የትምህርት ቢሮ ብቻ ነው።</span>
              </div>
            )}
          </div>
        </div>

        {/* Search & Subject Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="የስልጠና ርዕስ፣ የትምህርት አይነት ወይም ቁልፍ ቃል ፈልግ..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-violet-600 focus:outline-hidden font-medium"
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

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            {subjectsList.map((subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => setSelectedSubject(subj)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSubject === subj
                    ? 'bg-violet-800 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {subj === 'all' ? t.all_subjects : subj}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Personalized Teacher Assignment Banner for Non-Bureau Teachers */}
      {!isBureauOfficer && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border-2 border-emerald-300/80 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                <BookOpen className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-emerald-950">
                    የእርስዎ የተመደበበት የትምህርት መስክና የክፍል ደረጃ
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 border border-emerald-300">
                    ይፋዊ የተጣራ ምደባ
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-0.5">
                  የሚያስተምሩት የትምህርት ዓይነት፡{' '}
                  <strong className="text-emerald-900 font-bold underline">
                    {teacherAssignment.primarySubjectLabel}
                  </strong>{' '}
                  · የክፍል ደረጃ፡{' '}
                  <strong className="text-amber-900 font-bold underline">
                    {teacherAssignment.primaryGradeLabel}
                  </strong>
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 text-xs font-bold shrink-0 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{filtered.length} የተመደቡ የስልጠና ማንዋሎች ብቻ</span>
            </div>
          </div>

          <div className="text-[11px] text-emerald-900/90 bg-white/70 p-2.5 rounded-xl border border-emerald-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              <strong>የትምህርት ቢሮ ደንብ፡</strong> መምህሩ እንደሚያስተምረው የትምህርት ዓይነት እና የክፍል ደረጃ ብቻ የተዘጋጁ የስልጠና ማንዋሎች (ጽሑፎች) እና አጠቃላይ የክፍል ስነ-ዘዴዎች ብቻ ተጣርተው ደርሰውዎታል።
            </span>
          </div>
        </div>
      )}

      {/* Materials Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((mat) => (
          <div
            key={mat.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {mat.subject}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{mat.readTimeMinutes} ደቂቃ ንባብ</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {mat.title}
              </h3>

              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                {mat.summary}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {mat.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                ደረጃ፡ <strong className="text-slate-700">{mat.gradeLevels}</strong>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMaterialForAIExam(mat.id);
                    setShowAIExamModal(true);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors text-[11px] cursor-pointer"
                  title="ከዚህ ስልጠና በ AI ፈተና አዘጋጅ"
                >
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>AI ፈተና</span>
                </button>

                <button
                  onClick={() => handleRead(mat)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t.train_read}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {activeReading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-8 max-h-[85vh] flex flex-col justify-between">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {activeReading.subject} · {activeReading.gradeLevels}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {activeReading.title}
                </h3>
                <p className="text-xs text-slate-500">
                  አዘጋጅ፡ {activeReading.authorDepartment} ({activeReading.uploadedAt})
                </p>
              </div>
              <button
                onClick={() => setActiveReading(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 text-xs text-slate-800 leading-relaxed">
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
                <span className="font-bold text-emerald-950 block mb-1">ዋና ማጠቃለያ፡</span>
                <p>{activeReading.summary}</p>
              </div>

              <div className="whitespace-pre-line p-2 text-xs text-slate-800 font-sans leading-loose">
                {activeReading.fullContent}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                የተነበበበት ብዛት፡ {activeReading.downloadCount} ጊዜ
              </span>
              <div className="flex items-center gap-2">
                {isBureauOfficer && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMaterialForAIExam(activeReading.id);
                      setShowAIExamModal(true);
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-800 to-indigo-900 hover:from-emerald-700 hover:to-indigo-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>በ AI ፈተና አውጣ</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>አትም (Print)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReading(null)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer"
                >
                  ዝጋ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-800" />
                <h3 className="text-sm font-bold text-slate-900">
                  ለመምህራን አዲስ የስልጠና ሰነድ ላክ (Dispatch Training Module)
                </h3>
              </div>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDispatch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  የስልጠናው ርዕስ *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ምሳሌ፡ የቋንቋ ማስተማር ዘመናዊ ስነ-ዘዴዎች በሁለተኛ ደረጃ"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    የትምህርት አይነት *
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden"
                  >
                    <option value="Mathematics (ሂሳብ)">Mathematics (ሂሳብ)</option>
                    <option value="Afaan Oromoo (ኦሮሚኛ)">Afaan Oromoo (ኦሮሚኛ)</option>
                    <option value="English (እንግሊዝኛ)">English (እንግሊዝኛ)</option>
                    <option value="Physics & Chemistry (ሳይንስ)">Physics & Chemistry (ሳይንስ)</option>
                    <option value="Biology (ባዮሎጂ)">Biology (ባዮሎጂ)</option>
                    <option value="Pedagogy & Classroom Mgmt">Pedagogy & Classroom Mgmt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    የዒላማ ክፍል ደረጃ
                  </label>
                  <input
                    type="text"
                    required
                    value={newGradeLevels}
                    onChange={(e) => setNewGradeLevels(e.target.value)}
                    placeholder="Grades 7 - 12"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  አጭር ማጠቃለያ (Summary) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="የዚህ ስልጠና ቁልፍ ነጥቦች..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ሙሉ የስልጠና ፅሁፍ (Full Pedagogical Content) *
                </label>
                <textarea
                  rows={6}
                  required
                  value={newFullContent}
                  onChange={(e) => setNewFullContent(e.target.value)}
                  placeholder="ዝርዝር የማስተማሪያ ዘዴዎች፣ ደረጃ በደረጃ የሚተገበሩ መመሪያዎች..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs"
                >
                  ለሚመለከታቸው መምህራን ላክ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Exam Generator Modal */}
      <AIExamGeneratorModal
        isOpen={showAIExamModal}
        onClose={() => setShowAIExamModal(false)}
        initialMaterialId={selectedMaterialForAIExam}
        currentLang={currentLang}
        onExamCreated={(newExam) => {
          // New exam registered into StorageService
        }}
      />
    </div>
  );
};
