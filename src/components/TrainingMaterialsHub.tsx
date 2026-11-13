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
  Award,
  Paperclip,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { Language, TrainingMaterial, TrainingAttachment, AppUserSession } from '../types';
import { translations } from '../data/translations';
import { StorageService } from '../utils/storage';
import { OfflineSyncManager } from '../utils/offlineSync';
import { AIExamGeneratorModal } from './AIExamGeneratorModal';
import { TrainingAttachmentViewerModal } from './TrainingAttachmentViewerModal';
import { UploadTrainingAttachmentModal } from './UploadTrainingAttachmentModal';
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

  // Attachment Viewer & Uploader Modals
  const [viewerAttachment, setViewerAttachment] = useState<TrainingAttachment | null>(null);
  const [viewerMaterialTitle, setViewerMaterialTitle] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadTargetMaterialId, setUploadTargetMaterialId] = useState<string | undefined>(undefined);

  // New training dispatch form state (supports multiple subjects and multiple grade levels)
  const [newTitle, setNewTitle] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics (ሂሳብ)']);
  const [selectedGradeList, setSelectedGradeList] = useState<number[]>([9, 10]);
  const [newDepartment, setNewDepartment] = useState(
    currentLang === 'om'
      ? 'Muummee Sirna Barnootaa fi Misooma Barsiisotaa'
      : currentLang === 'en'
      ? 'Curriculum & Teacher Development Dept'
      : 'ስርዓተ-ትምህርትና የመምህራን ልማት (Curriculum Dept)'
  );
  const [newReadTime, setNewReadTime] = useState(15);
  const [newSummary, setNewSummary] = useState('');
  const [newFullContent, setNewFullContent] = useState('');
  const [dispatchSuccessToast, setDispatchSuccessToast] = useState<string | null>(null);
  const [dispatchFile, setDispatchFile] = useState<{
    name: string;
    type: 'pdf' | 'docx' | 'doc' | 'txt' | 'image' | 'other';
    size: string;
    text?: string;
    dataUrl?: string;
  } | null>(null);

  const availableSubjectsList = [
    'Mathematics (ሂሳብ)',
    'Afaan Oromoo (ኦሮሚኛ)',
    'English (እንግሊዝኛ)',
    'Physics & Chemistry (ሳይንስ)',
    'Biology (ባዮሎጂ)',
    'Citizenship & Social Studies (ስነ-ዜጋ)',
    'Assessment & Pedagogy (ምዘና እና ስነ-ዘዴ)',
    'Educational Technology & ICT (የትምህርት ቴክኖሎጂ)'
  ];

  const getSubjectLabel = (subj: string) => {
    const map: Record<string, { om: string; en: string; am: string }> = {
      'Mathematics (ሂሳብ)': { om: 'Herrega (Mathematics)', en: 'Mathematics', am: 'Mathematics (ሂሳብ)' },
      'Afaan Oromoo (ኦሮሚኛ)': { om: 'Afaan Oromoo', en: 'Afaan Oromoo', am: 'Afaan Oromoo (ኦሮሚኛ)' },
      'English (እንግሊዝኛ)': { om: 'Ingiliffa (English)', en: 'English', am: 'English (እንግሊዝኛ)' },
      'Physics & Chemistry (ሳይንስ)': { om: 'Fiiziksii fi Keemistirii (Saayinsii)', en: 'Physics & Chemistry', am: 'Physics & Chemistry (ሳይንስ)' },
      'Biology (ባዮሎጂ)': { om: 'Baayoloojii (Biology)', en: 'Biology', am: 'Biology (ባዮሎጂ)' },
      'Citizenship & Social Studies (ስነ-ዜጋ)': { om: 'Barnoota Lammummaa fi Hawaasaa', en: 'Citizenship & Social Studies', am: 'Citizenship & Social Studies (ስነ-ዜጋ)' },
      'Assessment & Pedagogy (ምዘና እና ስነ-ዘዴ)': { om: 'Madaallii fi Mala Barsiisuu', en: 'Assessment & Pedagogy', am: 'Assessment & Pedagogy (ምዘና እና ስነ-ዘዴ)' },
      'Educational Technology & ICT (የትምህርት ቴክኖሎጂ)': { om: 'Teeknooloojii Barnootaa fi ICT', en: 'Educational Technology & ICT', am: 'Educational Technology & ICT (የትምህርት ቴክኖሎጂ)' },
      'General Pedagogy & CPD (አጠቃላይ ስነ-ዘዴ)': { om: 'Mala Barsiisuu Waliigalaa & CPD', en: 'General Pedagogy & CPD', am: 'General Pedagogy & CPD (አጠቃላይ ስነ-ዘዴ)' },
      'Afaan Oromoo fi Madaallii (Pedagogy & Assessment)': { om: 'Afaan Oromoo fi Madaallii', en: 'Afaan Oromoo & Assessment', am: 'Afaan Oromoo fi Madaallii (Pedagogy & Assessment)' },
      'Ogummaa Barsiisummaa (General Pedagogy)': { om: 'Ogummaa Barsiisummaa (General Pedagogy)', en: 'General Pedagogy', am: 'Ogummaa Barsiisummaa (General Pedagogy)' }
    };
    const found = map[subj];
    if (!found) return subj;
    return currentLang === 'om' ? found.om : currentLang === 'en' ? found.en : found.am;
  };

  const availableGradesList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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

    const attachmentsList: TrainingAttachment[] = dispatchFile
      ? [
          {
            id: `att-${Date.now()}`,
            fileName: dispatchFile.name,
            fileType: dispatchFile.type,
            fileSize: dispatchFile.size,
            textContent: dispatchFile.text,
            dataUrl: dispatchFile.dataUrl,
            uploadedAt: new Date().toISOString(),
            uploadedBy: currentUser?.name || newDepartment
          }
        ]
      : [];

    const finalSubjects = selectedSubjects.length > 0 ? selectedSubjects : ['Mathematics (ሂሳብ)'];
    const finalGrades = selectedGradeList.length > 0 ? selectedGradeList : [9, 10];
    const gradeRangeStr =
      finalGrades.length === 1
        ? `Grade ${finalGrades[0]}`
        : finalGrades.length === 12
        ? 'All Grades (1 - 12)'
        : `Grades ${Math.min(...finalGrades)} - ${Math.max(...finalGrades)}`;

    const newMaterial: TrainingMaterial = {
      id: `mat-${Date.now()}`,
      title: newTitle.trim(),
      subject: finalSubjects.join(', '),
      targetSubjects: finalSubjects,
      gradeLevels: gradeRangeStr,
      targetGradeList: finalGrades,
      authorDepartment: newDepartment,
      uploadedAt: new Date().toISOString().split('T')[0],
      readTimeMinutes: Number(newReadTime),
      tags: [...finalSubjects.map((s) => s.split(' ')[0]), 'Pedagogy', 'Curriculum', 'Bureau Dispatch'],
      downloadCount: 1,
      summary: newSummary.trim(),
      fullContent: newFullContent.trim(),
      attachments: attachmentsList
    };

    const updated = StorageService.addTrainingMaterial(newMaterial);
    onMaterialsChange(updated);

    // Create a broadcast message notification for all matching teachers
    // "ትምህርት ቢሮ የጪነው ፅሁፍ የሚመለከተው ከሆነ ሜሴጅ ይደረሰዋል ፅሁፍን አውርዶ ( ዳውንሎድ ) አርጉ ያጠናል"
    StorageService.addTeacherTrainingNotification({
      id: `notif-train-${Date.now()}`,
      materialId: newMaterial.id,
      materialTitle: newMaterial.title,
      subject: newMaterial.subject,
      gradeLevels: newMaterial.gradeLevels,
      authorDepartment: newDepartment,
      uploadedAt: new Date().toISOString(),
      message:
        currentLang === 'om'
          ? `Barreeffamni leenjii idilee haaraan Biiroo Barnootaa irraa isiniif ergameera! Gosa Barnootaa: ${newMaterial.subject} · Sadarkaa Kutaa: ${newMaterial.gradeLevels}. Maaloo sanada kana buufadhaatii (Download) qo'adhaa.`
          : currentLang === 'en'
          ? `New official training material sent from the Education Bureau! Subject: ${newMaterial.subject} · Grades: ${newMaterial.gradeLevels}. Please download and study.`
          : `አዲስ ይፋዊ የስልጠና ጽሑፍ ከትምህርት ቢሮ ተልኮሎታል! የትምህርት አይነት: ${newMaterial.subject} · የክፍል ደረጃ: ${newMaterial.gradeLevels}። እባክዎ ሰነዱን አውርደው (ዳውንሎድ) ያጥኑ።`,
      isRead: false
    });

    // Enqueue training material for offline sync
    OfflineSyncManager.enqueue(
      'training_material',
      'create',
      newMaterial.id,
      newMaterial,
      {
        authorName: newDepartment,
        schoolName:
          currentLang === 'om'
            ? 'Daayirektoreetii Sirna Barnootaa Biiroo Barnootaa'
            : currentLang === 'en'
            ? 'Education Bureau Curriculum Directorate'
            : 'የትምህርት ቢሮ የስርዓተ-ትምህርት ዳይሬክቶሬት',
        description: `${currentLang === 'om' ? 'Sanada Leenjii:' : 'የስልጠና ሰነድ፡'} ${newMaterial.title} (${newMaterial.subject})`
      }
    );

    setShowDispatchModal(false);
    setDispatchSuccessToast(
      currentLang === 'om'
        ? `Barreeffamni leenjii barsiisota gosa barnootaa (${finalSubjects.join(', ')}) fi sadarkaa kutaa (${gradeRangeStr}) filatamaniif milkaa'inaan ergameera! Ergaan beeksisaa isaan gaheera.`
        : currentLang === 'en'
        ? `Training material successfully dispatched to teachers of ${finalSubjects.join(', ')} (${gradeRangeStr})! Notification sent.`
        : `የስልጠና ጽሑፉ ለተመረጡት የትምህርት አይነቶች (${finalSubjects.join(', ')}) እና የክፍል ደረጃዎች (${gradeRangeStr}) መምህራን በስኬት ተልኳል! የማሳወቂያ መልእክትም ደርሷቸዋል።`
    );

    // Reset
    setNewTitle('');
    setSelectedSubjects(['Mathematics (ሂሳብ)']);
    setSelectedGradeList([9, 10]);
    setNewSummary('');
    setNewFullContent('');
    setDispatchFile(null);

    setTimeout(() => {
      setDispatchSuccessToast(null);
    }, 6000);
  };

  return (
    <div className="space-y-6">
      {/* Toast feedback for successful dispatch */}
      {dispatchSuccessToast && (
        <div className="bg-emerald-900 text-emerald-100 p-4 rounded-2xl border border-emerald-400 flex items-center justify-between gap-3 shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <span>{dispatchSuccessToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setDispatchSuccessToast(null)}
            className="text-xs bg-emerald-800 hover:bg-emerald-700 px-3 py-1 rounded-lg cursor-pointer"
          >
            {currentLang === 'om' ? 'Cufi' : currentLang === 'en' ? 'Close' : 'ዝጋ'}
          </button>
        </div>
      )}

      {/* =========================================================================
          🌟 TRAINING TOP ACTION TOOLBAR: All actions unified at the top!
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
                  {t.train_title}
                </h2>
                <span className="text-xs text-violet-900 bg-violet-100 px-2.5 py-0.5 rounded-full border border-violet-300 font-bold">
                  {filtered.length} / {materials.length}{' '}
                  {currentLang === 'om' ? 'Mojuulota' : currentLang === 'en' ? 'Modules' : 'ሞጁሎች'}
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
                  <span>
                    {currentLang === 'om'
                      ? '✨ AI dhaan Qormaata Baasi'
                      : currentLang === 'en'
                      ? '✨ AI Exam Generator'
                      : '✨ በ AI ፈተና አውጣ (AI Exam Generator)'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUploadTargetMaterialId(undefined);
                    setShowUploadModal(true);
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md cursor-pointer border border-amber-300"
                >
                  <Upload className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>
                    {currentLang === 'om'
                      ? "+ Barreeffama Leenjii / Faayila Fe'i"
                      : currentLang === 'en'
                      ? '+ Upload Training / Attachment'
                      : '+ የስልጠና ጽሑፍ / አታችመንት ጫን'}
                  </span>
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
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setUploadTargetMaterialId(undefined);
                    setShowUploadModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md cursor-pointer border border-amber-300"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                  <span>
                    {currentLang === 'om'
                      ? "+ Barreeffama Leenjii Fe'i"
                      : currentLang === 'en'
                      ? '+ Upload Material'
                      : '+ የስልጠና ጽሑፍ ጫን'}
                  </span>
                </button>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    {currentLang === 'om'
                      ? 'Aangoon qormaata baasuu kan Biiroo Barnootaa qofa.'
                      : currentLang === 'en'
                      ? 'Only the Education Bureau has exam authority.'
                      : 'ፈተና የማውጣት ስልጣን የትምህርት ቢሮ ብቻ ነው።'}
                  </span>
                </div>
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
              placeholder={
                currentLang === 'om'
                  ? 'Mata-duree leenjii, gosa barnootaa ykn jecha ijoo barbaadi...'
                  : currentLang === 'en'
                  ? 'Search training title, subject or keyword...'
                  : 'የስልጠና ርዕስ፣ የትምህርት አይነት ወይም ቁልፍ ቃል ፈልግ...'
              }
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
                {subj === 'all' ? t.all_subjects : getSubjectLabel(subj)}
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
                    {currentLang === 'om'
                      ? 'Dirree Barnootaa fi Sadarkaa Kutaa Isiniif Ramadame'
                      : currentLang === 'en'
                      ? 'Your Assigned Subject Field & Grade Level'
                      : 'የእርስዎ የተመደበበት የትምህርት መስክና የክፍል ደረጃ'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 border border-emerald-300">
                    {currentLang === 'om'
                      ? 'Ramaddii Idilee Gingilchaame'
                      : currentLang === 'en'
                      ? 'Official Filtered Assignment'
                      : 'ይፋዊ የተጣራ ምደባ'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-0.5">
                  {currentLang === 'om'
                    ? 'Gosa barnootaa barsiistan: '
                    : currentLang === 'en'
                    ? 'Assigned Subject: '
                    : 'የሚያስተምሩት የትምህርት ዓይነት፡ '}
                  <strong className="text-emerald-900 font-bold underline">
                    {teacherAssignment.primarySubjectLabel}
                  </strong>{' '}
                  ·{' '}
                  {currentLang === 'om'
                    ? 'Sadarkaa Kutaa: '
                    : currentLang === 'en'
                    ? 'Grade Level: '
                    : 'የክፍል ደረጃ፡ '}
                  <strong className="text-amber-900 font-bold underline">
                    {teacherAssignment.primaryGradeLabel}
                  </strong>
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 text-xs font-bold shrink-0 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>
                {filtered.length}{' '}
                {currentLang === 'om'
                  ? 'Mojuulota Leenjii Ramadaman Qofa'
                  : currentLang === 'en'
                  ? 'Assigned Training Manuals Only'
                  : 'የተመደቡ የስልጠና ማንዋሎች ብቻ'}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-emerald-900/90 bg-white/70 p-2.5 rounded-xl border border-emerald-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              <strong>
                {currentLang === 'om'
                  ? 'Qajeelfama Biiroo Barnootaa: '
                  : currentLang === 'en'
                  ? 'Education Bureau Policy: '
                  : 'የትምህርት ቢሮ ደንብ፡ '}
              </strong>
              {currentLang === 'om'
                ? 'Akkaataa gosa barnootaa fi sadarkaa kutaa barsiistanitti qofa qophiiwwan leenjii fi mala barsiisuu waliigalaa gingilchaamanii isiniif ergamaniiru.'
                : currentLang === 'en'
                ? 'Only training manuals tailored to your assigned subject and grade levels, along with general pedagogy resources, are filtered for you.'
                : 'መምህሩ እንደሚያስተምረው የትምህርት ዓይነት እና የክፍል ደረጃ ብቻ የተዘጋጁ የስልጠና ማንዋሎች (ጽሑፎች) እና አጠቃላይ የክፍል ስነ-ዘዴዎች ብቻ ተጣርተው ደርሰውዎታል።'}
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
                  {getSubjectLabel(mat.subject)}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {mat.readTimeMinutes}{' '}
                    {currentLang === 'om'
                      ? 'Daqiiqaa Dubbisuu'
                      : currentLang === 'en'
                      ? 'min read'
                      : 'ደቂቃ ንባብ'}
                  </span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {mat.title}
              </h3>

              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                {mat.summary}
              </p>

              {/* Attached Documents */}
              {mat.attachments && mat.attachments.length > 0 && (
                <div className="mt-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-emerald-950">
                    <span className="flex items-center gap-1">
                      <Paperclip className="w-3 h-3 text-emerald-700" />
                      <span>
                        {currentLang === 'om'
                          ? `Sanadoota Maxxaansaman (${mat.attachments.length})`
                          : currentLang === 'en'
                          ? `Attached Documents (${mat.attachments.length})`
                          : `የተያያዙ ጽሑፎች (${mat.attachments.length})`}
                      </span>
                    </span>
                    <span className="text-emerald-700 font-normal">
                      {currentLang === 'om' ? 'Bani' : currentLang === 'en' ? 'Open' : 'ክፈት'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {mat.attachments.map((att) => (
                      <button
                        key={att.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewerAttachment(att);
                          setViewerMaterialTitle(mat.title);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-emerald-300 text-slate-800 text-[10px] font-medium hover:bg-emerald-100 hover:border-emerald-500 transition-colors cursor-pointer group shadow-2xs"
                        title={
                          currentLang === 'om'
                            ? `${att.fileName} - Dubbisuuf cuqaasi`
                            : currentLang === 'en'
                            ? `${att.fileName} - Click to read`
                            : `${att.fileName} - ለማንበብ ይጫኑ`
                        }
                      >
                        <span className="font-bold text-[8px] uppercase px-1 rounded bg-emerald-200 text-emerald-900 group-hover:bg-emerald-700 group-hover:text-white">
                          {att.fileType}
                        </span>
                        <span className="truncate max-w-[110px] font-semibold">{att.fileName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                {currentLang === 'om' ? 'Sadarkaa:' : currentLang === 'en' ? 'Grade:' : 'ደረጃ፡'}{' '}
                <strong className="text-slate-700">{mat.gradeLevels}</strong>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadTargetMaterialId(mat.id);
                    setShowUploadModal(true);
                  }}
                  className="p-1.5 text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                  title={
                    currentLang === 'om'
                      ? 'Barreeffama leenjii / faayila dabalataa maxxansi'
                      : currentLang === 'en'
                      ? 'Attach additional training document'
                      : 'ተጨማሪ የስልጠና ጽሑፍ / አታችመንት አያይዝ'
                  }
                >
                  <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMaterialForAIExam(mat.id);
                    setShowAIExamModal(true);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors text-[11px] cursor-pointer"
                  title={
                    currentLang === 'om'
                      ? 'Leenjii kana irraa AI dhaan qormaata qopheessi'
                      : currentLang === 'en'
                      ? 'Generate AI Exam from this training'
                      : 'ከዚህ ስልጠና በ AI ፈተና አዘጋጅ'
                  }
                >
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>{currentLang === 'om' ? 'Qormaata AI' : currentLang === 'en' ? 'AI Exam' : 'AI ፈተና'}</span>
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
                  {getSubjectLabel(activeReading.subject)} · {activeReading.gradeLevels}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {activeReading.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {currentLang === 'om' ? 'Qopheessaa:' : currentLang === 'en' ? 'Prepared by:' : 'አዘጋጅ፡'}{' '}
                  {activeReading.authorDepartment} ({activeReading.uploadedAt})
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
                <span className="font-bold text-emerald-950 block mb-1">
                  {currentLang === 'om'
                    ? 'Cuunfaa Ijoo:'
                    : currentLang === 'en'
                    ? 'Executive Summary:'
                    : 'ዋና ማጠቃለያ፡'}
                </span>
                <p>{activeReading.summary}</p>
              </div>

              <div className="whitespace-pre-line p-2 text-xs text-slate-800 font-sans leading-loose">
                {activeReading.fullContent}
              </div>

              {/* Official Training Attachments & Documents Section */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-emerald-700" />
                    <span>
                      {currentLang === 'om'
                        ? `Barreeffamoota & Sanadoota Leenjii Maxxaansaman (${activeReading.attachments?.length || 0})`
                        : currentLang === 'en'
                        ? `Attached Training Documents (${activeReading.attachments?.length || 0})`
                        : `የተያያዙ የስልጠና ጽሑፎችና ሰነዶች (${activeReading.attachments?.length || 0})`}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadTargetMaterialId(activeReading.id);
                      setShowUploadModal(true);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>
                      {currentLang === 'om'
                        ? '+ Sanada Maxxansi'
                        : currentLang === 'en'
                        ? '+ Attach File'
                        : '+ ሰነድ አያይዝ'}
                    </span>
                  </button>
                </div>

                {activeReading.attachments && activeReading.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {activeReading.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase">
                              {att.fileType}
                            </span>
                            <span className="font-bold text-xs text-slate-900">{att.fileName}</span>
                            {att.fileSize && (
                              <span className="text-[10px] text-slate-400">({att.fileSize})</span>
                            )}
                          </div>
                          {att.description && (
                            <p className="text-[11px] text-slate-500 line-clamp-1">{att.description}</p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setViewerAttachment(att);
                            setViewerMaterialTitle(activeReading.title);
                          }}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                        >
                          <Eye className="w-3 h-3" />
                          <span>
                            {currentLang === 'om'
                              ? 'Dubbisi / Ilaali'
                              : currentLang === 'en'
                              ? 'Read / View'
                              : 'አንብብ / ተመልከት'}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic bg-white p-2 rounded-lg border border-dashed border-slate-300 text-center">
                    {currentLang === 'om'
                      ? 'Leenjii kanaaf hanga ammaatti sanadni dabalataa hin maxxaansamne.'
                      : currentLang === 'en'
                      ? 'No additional documents attached to this training yet.'
                      : 'ለዚህ ስልጠና እስካሁን የተያያዘ ተጨማሪ ሰነድ የለም።'}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {currentLang === 'om'
                  ? `Baay'ina Dubbii: Yeroo ${activeReading.downloadCount}`
                  : currentLang === 'en'
                  ? `Read count: ${activeReading.downloadCount} times`
                  : `የተነበበበት ብዛት፡ ${activeReading.downloadCount} ጊዜ`}
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
                    <span>
                      {currentLang === 'om'
                        ? 'AI dhaan Qormaata Baasi'
                        : currentLang === 'en'
                        ? 'AI Exam Generator'
                        : 'በ AI ፈተና አውጣ'}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>
                    {currentLang === 'om' ? 'Maxxansi' : currentLang === 'en' ? 'Print' : 'አትም (Print)'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReading(null)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer"
                >
                  {currentLang === 'om' ? 'Cufi' : currentLang === 'en' ? 'Close' : 'ዝጋ'}
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
                  {currentLang === 'om'
                    ? 'Barsiisotaaf Sanada Leenjii Haaraa Ergi (Dispatch Module)'
                    : currentLang === 'en'
                    ? 'Dispatch New Training Module to Teachers'
                    : 'ለመምህራን አዲስ የስልጠና ሰነድ ላክ (Dispatch Training Module)'}
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
                  {currentLang === 'om'
                    ? 'Mata-duree Leenjii *'
                    : currentLang === 'en'
                    ? 'Training Title *'
                    : 'የስልጠናው ርዕስ *'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={
                    currentLang === 'om'
                      ? 'Fkn: Mala Barsiisuu Afaanii Ammayyaa Sadarkaa 2ffaatti'
                      : currentLang === 'en'
                      ? 'e.g., Modern Language Teaching Methods in Secondary'
                      : 'ምሳሌ፡ የቋንቋ ማስተማር ዘመናዊ ስነ-ዘዴዎች በሁለተኛ ደረጃ'
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              {/* Multiple Subjects Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    {currentLang === 'om'
                      ? 'Gosa Barnootaa Ilaallatu (Tokkoo ol filachuun ni danda’ama) *'
                      : currentLang === 'en'
                      ? 'Target Subjects (Multiple selection allowed) *'
                      : 'የዒላማ ትምህርት አይነቶች (Target Subjects - ከአንድ በላይ መምረጥ ይቻላል) *'}
                  </label>
                  <span className="text-[11px] text-emerald-700 font-bold">
                    {selectedSubjects.length}{' '}
                    {currentLang === 'om' ? 'Filatameera' : currentLang === 'en' ? 'Selected' : 'ተመርጠዋል'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 max-h-36 overflow-y-auto">
                  {availableSubjectsList.map((subj) => {
                    const isChecked = selectedSubjects.includes(subj);
                    return (
                      <label
                        key={subj}
                        className={`flex items-center gap-2 p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          isChecked ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSubjects([...selectedSubjects, subj]);
                            } else {
                              if (selectedSubjects.length > 1) {
                                setSelectedSubjects(selectedSubjects.filter((s) => s !== subj));
                              }
                            }
                          }}
                          className="rounded text-emerald-700 focus:ring-emerald-500 w-3.5 h-3.5"
                        />
                        <span className="truncate">{getSubjectLabel(subj)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Multiple Grades Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    {currentLang === 'om'
                      ? 'Sadarkaa Kutaa Ilaallatu (Tokkoo ol filachuun ni danda’ama) *'
                      : currentLang === 'en'
                      ? 'Target Grade Levels (Multiple selection allowed) *'
                      : 'የዒላማ የክፍል ደረጃዎች (Target Grade Levels - ከአንድ በላይ መምረጥ ይቻላል) *'}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedGradeList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])}
                      className="text-[10px] text-emerald-700 hover:underline font-bold"
                    >
                      {currentLang === 'om' ? 'Hunda Filadhu' : currentLang === 'en' ? 'Select All' : 'ሁሉንም ምረጥ (All)'}
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => setSelectedGradeList([9, 10, 11, 12])}
                      className="text-[10px] text-emerald-700 hover:underline font-bold"
                    >
                      {currentLang === 'om' ? 'Sad. 2ffaa (9-12)' : currentLang === 'en' ? 'Secondary (9-12)' : '2ኛ ደረጃ (9-12)'}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {availableGradesList.map((g) => {
                    const isChecked = selectedGradeList.includes(g);
                    return (
                      <label
                        key={g}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold cursor-pointer transition-colors text-center border ${
                          isChecked
                            ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedGradeList([...selectedGradeList, g].sort((a, b) => a - b));
                            } else {
                              if (selectedGradeList.length > 1) {
                                setSelectedGradeList(selectedGradeList.filter((x) => x !== g));
                              }
                            }
                          }}
                          className="sr-only"
                        />
                        <span>{currentLang === 'om' ? `Kutaa ${g}` : currentLang === 'en' ? `Grade ${g}` : `ክፍል ${g}`}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLang === 'om' ? 'Cuunfaa Gabaabaa (Summary) *' : currentLang === 'en' ? 'Short Summary *' : 'አጭር ማጠቃለያ (Summary) *'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder={currentLang === 'om' ? 'Qabxiilee ijoo leenjii kanaa...' : currentLang === 'en' ? 'Key highlights of this training...' : 'የዚህ ስልጠና ቁልፍ ነጥቦች...'}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLang === 'om' ? 'Barreeffama Leenjii Guutuu (Full Content) *' : currentLang === 'en' ? 'Full Pedagogical Content *' : 'ሙሉ የስልጠና ፅሁፍ (Full Pedagogical Content) *'}
                </label>
                <textarea
                  rows={6}
                  required
                  value={newFullContent}
                  onChange={(e) => setNewFullContent(e.target.value)}
                  placeholder={currentLang === 'om' ? 'Mala barsiisuu bal’aa fi qajeelfama hojii...' : currentLang === 'en' ? 'Detailed teaching methodologies and guidelines...' : 'ዝርዝር የማስተማሪያ ዘዴዎች፣ ደረጃ በደረጃ የሚተገበሩ መመሪያዎች...'}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-mono"
                />
              </div>

              {/* Optional Document Attachment Input */}
              <div className="bg-emerald-50/60 border border-emerald-200/90 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      {currentLang === 'om'
                        ? 'Barreeffama / Sanada Leenjii Dabalataa Maxxansi (PDF/DOCX/TXT)'
                        : currentLang === 'en'
                        ? 'Attach Additional Document (Optional - PDF/DOCX/TXT)'
                        : 'ተጨማሪ የስልጠና ጽሑፍ / ሰነድ አያይዝ (አማራጭ - PDF/DOCX/TXT)'}
                    </span>
                  </label>
                  {dispatchFile && (
                    <button
                      type="button"
                      onClick={() => setDispatchFile(null)}
                      className="text-[11px] text-red-600 hover:underline font-bold"
                    >
                      {currentLang === 'om' ? 'Haqi' : currentLang === 'en' ? 'Remove' : 'አስወግድ (Remove)'}
                    </button>
                  )}
                </div>

                {dispatchFile ? (
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-emerald-300 text-xs text-slate-800">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-black uppercase">
                        {dispatchFile.type}
                      </span>
                      <span>{dispatchFile.name}</span>
                      <span className="text-slate-400 font-normal">({dispatchFile.size})</span>
                    </span>
                    <span className="text-emerald-700 text-[11px] font-bold">
                      {currentLang === 'om' ? 'Maxxaansameera ✓' : currentLang === 'en' ? 'Attached ✓' : 'ተያይዟል ✓'}
                    </span>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const ext = file.name.split('.').pop()?.toLowerCase();
                      let fType: 'pdf' | 'docx' | 'doc' | 'txt' | 'image' | 'other' = 'pdf';
                      if (ext === 'docx') fType = 'docx';
                      else if (ext === 'doc') fType = 'doc';
                      else if (ext === 'txt') fType = 'txt';
                      else if (file.type.startsWith('image/')) fType = 'image';

                      const sizeStr = file.size > 1024 * 1024
                        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                        : `${Math.round(file.size / 1024)} KB`;

                      const reader = new FileReader();
                      reader.onload = () => {
                        const res = reader.result as string;
                        setDispatchFile({
                          name: file.name,
                          type: fType,
                          size: sizeStr,
                          dataUrl: res,
                          text: fType === 'txt' ? res : undefined
                        });
                      };
                      if (fType === 'txt') {
                        reader.readAsText(file);
                      } else {
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  {currentLang === 'om' ? 'Haqi' : currentLang === 'en' ? 'Cancel' : 'ሰርዝ'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {currentLang === 'om'
                    ? 'Barsiisota Ilaallataniif Ergi'
                    : currentLang === 'en'
                    ? 'Send to Matching Teachers'
                    : 'ለሚመለከታቸው መምህራን ላክ'}
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

      {/* Attachment Document Viewer Modal */}
      <TrainingAttachmentViewerModal
        attachment={viewerAttachment}
        materialTitle={viewerMaterialTitle}
        onClose={() => setViewerAttachment(null)}
        currentLang={currentLang}
      />

      {/* Attachment Uploader Modal */}
      <UploadTrainingAttachmentModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setUploadTargetMaterialId(undefined);
        }}
        materials={materials}
        preSelectedMaterialId={uploadTargetMaterialId}
        currentUser={currentUser}
        currentLang={currentLang}
        onAttachmentAdded={(updated) => {
          onMaterialsChange(updated);
          // If activeReading was updated, reflect new attachments
          if (activeReading) {
            const updatedActive = updated.find((m) => m.id === activeReading.id);
            if (updatedActive) {
              setActiveReading(updatedActive);
            }
          }
        }}
      />
    </div>
  );
};
