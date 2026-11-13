import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Paperclip,
  CheckCircle2,
  X,
  FileUp,
  Sparkles,
  BookOpen,
  Layers,
  GraduationCap,
  Building2,
  AlertCircle
} from 'lucide-react';
import { TrainingMaterial, TrainingAttachment, AppUserSession, Language } from '../types';
import { StorageService } from '../utils/storage';
import { OfflineSyncManager } from '../utils/offlineSync';

interface UploadTrainingAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: TrainingMaterial[];
  preSelectedMaterialId?: string;
  currentUser?: AppUserSession | null;
  currentLang?: Language;
  onAttachmentAdded: (updatedMaterials: TrainingMaterial[]) => void;
}

export const UploadTrainingAttachmentModal: React.FC<UploadTrainingAttachmentModalProps> = ({
  isOpen,
  onClose,
  materials,
  preSelectedMaterialId,
  currentUser,
  currentLang = 'om',
  onAttachmentAdded
}) => {
  const [targetMaterialId, setTargetMaterialId] = useState<string>(
    preSelectedMaterialId || materials[0]?.id || ''
  );
  const [createAsNewModule, setCreateAsNewModule] = useState<boolean>(false);

  // New module fields (if createAsNewModule is true)
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleSubject, setNewModuleSubject] = useState('Mathematics (ሂሳብ)');
  const [newModuleGrade, setNewModuleGrade] = useState('Grades 9 - 12');

  // Attachment fields
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'docx' | 'doc' | 'txt' | 'image' | 'other'>('pdf');
  const [fileSize, setFileSize] = useState('');
  const [textContent, setTextContent] = useState('');
  const [description, setDescription] = useState('');
  const [dataUrl, setDataUrl] = useState<string>('');
  const [isReadingFile, setIsReadingFile] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsReadingFile(true);
    const name = file.name;
    const ext = name.split('.').pop()?.toLowerCase() || '';

    let type: 'pdf' | 'docx' | 'doc' | 'txt' | 'image' | 'other' = 'other';
    if (ext === 'pdf') type = 'pdf';
    else if (ext === 'docx') type = 'docx';
    else if (ext === 'doc') type = 'doc';
    else if (ext === 'txt') type = 'txt';
    else if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) type = 'image';

    setFileName(name);
    setFileType(type);

    const sizeInKb = file.size / 1024;
    const formattedSize =
      sizeInKb > 1024
        ? `${(sizeInKb / 1024).toFixed(1)} MB`
        : `${Math.round(sizeInKb)} KB`;
    setFileSize(formattedSize);

    if (ext === 'txt' || file.type.startsWith('text/')) {
      const textReader = new FileReader();
      textReader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) {
          setTextContent(result);
        }
      };
      textReader.readAsText(file);
    }

    const dataReader = new FileReader();
    dataReader.onload = (ev) => {
      if (ev.target?.result) {
        setDataUrl(ev.target.result as string);
      }
      setIsReadingFile(false);
    };
    dataReader.readAsDataURL(file);
  };

  const handleUseDemoAttachment = () => {
    if (currentLang === 'om') {
      setFileName('Qajeelfama Mala Barsiisuu Kutaa fi Madaallii Barattootaa (Pedagogy Guide).pdf');
      setFileType('pdf');
      setFileSize('1.4 MB');
      setDescription('Maloota barsiisuu kutaa keessaa, qoodinsa wayitii fi gabatee ulaagaa madaallii barattootaa manneen barnootaa Magaalaa Shaashamannee keessatti hojiirra oolu.');
      setTextContent(`Biiroo Barnootaa Bulchiinsa Magaalaa Shaashamannee
Daayirektoreetii Sirna Barnootaa fi Misooma Barsiisotaa
Sanada Dabalataa Leenjii Ifaa

Mata-duree: Qajeelfama Mala Barsiisuu Kutaa fi Madaallii Barattootaa
Bara Barnootaa: 2016/2017 A.L.I

1. Tooftaalee Hirmaannaa Barattootaa Guddisan (Active Learning Strategies):
- Think-Pair-Share: Barsiisaan gaaffii yoo dhiyeessu barattoonni daqiiqaa 1 kophaa isaanii yaadanii, daqiiqaa 2 cimdii waliin mari'atanii, dhuma irratti kutaaf qooduu.
- Jigsaw Cooperative Learning: Kutaa garee miseensota 4 qabutti qooduun gareen tokko mata-duree tokko gadi fageenyaan baratee garee biraaf barsiisuu.
- Exit Ticket (Daqiiqaa 5): Xumura wayitiitti barataan tokko tokko qabxii ijoo baratee fi waan hin hubatin waraqaa irratti barreessee barsiisaaf kennuu.

2. Ulaagaa Madaallii Walitti Fufaa (Formative Assessment Rubrics):
- Hirmaannaa fi hojii garee: 20%
- Hojii manaa fi hojii kutaa guyyaa guyyaa: 30%
- Gaaffilee ariifataa torbanii (Quizzes): 20%
- Qormaata walakkaa seemeestaraa (Mid Exam): 30%

3. Deeggarsa Barattoota Xiyyeeffannoo Addaa Barbaadaniif (Inclusive Education):
- Barattoota suuta baratan dursanii adda baasuun wayitii ibsa dabalataa kennuu.
- Yeroo qormaataa yeroo dabalataa kennuu.
- Cimina barattootaa jajjabeessuun ofitti amanamummaa isaanii ijaaruu.

Qopheessaa: Garee Sirna Barnootaa Biiroo Barnootaa Shaashamannee`);
    } else if (currentLang === 'en') {
      setFileName('Classroom Pedagogy and Student Assessment Guide.pdf');
      setFileType('pdf');
      setFileSize('1.4 MB');
      setDescription('Teaching methodologies, lesson pacing, and student assessment rubrics implemented across Shashemene City schools.');
      setTextContent(`Shashemene City Administration Education Bureau
Curriculum & Teacher Development Directorate
Official Training Attachment Document

Title: Classroom Pedagogy and Student Assessment Guide
Academic Year: 2024/2025

1. Active Learning Strategies:
- Think-Pair-Share: After a question is posed, students think individually for 1 minute, discuss in pairs for 2 minutes, then share with the class.
- Jigsaw Cooperative Learning: Divide the class into 4-member groups so each group masters one subtopic and teaches the others.
- 5-Minute Exit Ticket: At the end of each lesson, students write one key takeaway and one unclear point.

2. Formative Assessment Rubrics:
- Participation & Group Work: 20%
- Daily Homework & Classwork: 30%
- Weekly Quizzes: 20%
- Mid-Semester Exam: 30%

3. Inclusive Education Support:
- Identify struggling learners early and offer targeted remediation sessions.
- Provide extended time accommodations during exams where needed.

Prepared by: Shashemene Education Bureau Curriculum Team`);
    } else {
      setFileName('የክፍል ውስጥ ስነ-ዘዴ እና የተማሪዎች ምዘና ዝርዝር መመሪያ (Pedagogy & Classroom Guide).pdf');
      setFileType('pdf');
      setFileSize('1.4 MB');
      setDescription('በሻሸመኔ ከተማ ትምህርት ቤቶች ውስጥ በክፍል ደረጃ የሚተገበሩ የማስተማሪያ ስነ-ዘዴዎች፣ የክፍለ-ጊዜ አከፋፈል እና የተማሪዎች መገምገሚያ ዝርዝር ሠንጠረዥ።');
      setTextContent(`የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ
የስርዓተ-ትምህርትና የመምህራን ልማት ዳይሬክቶሬት
ይፋዊ የስልጠና አታችመንት ሰነድ

ርዕስ፡ የክፍል ውስጥ ስነ-ዘዴ እና የተማሪዎች ምዘና ዝርዝር መመሪያ
የትምህርት ዘመን፡ 2016/2017 ዓ.ም

1. የተማሪዎች ተሳትፎ ማሳደጊያ ስልቶች (Active Learning Strategies):
- የጥንድ ውይይት (Think-Pair-Share): መምህሩ ጥያቄ ሲያቀርቡ ተማሪዎች 1 ደቂቃ ብቻቸውን እንዲያስቡ፣ ከዛ ከጎናቸው ካለ ተማሪ ጋር 2 ደቂቃ እንዲወያዩ፣ በመጨረሻም ለክፍሉ እንዲያካፍሉ ማድረግ።
- ጂግሶው (Jigsaw Cooperative Learning): ክፍሉን በ 4 አባላት ባላቸው ቡድኖች በመክፈል እያንዳንዱ ቡድን አንዱን ርዕስ በጥልቀት ተምሮ ለሌላው ቡድን እንዲያስተምር ማድረግ።
- የ 5 ደቂቃ ማጠቃለያ (Exit Ticket): በክፍለ-ጊዜው መጨረሻ እያንዳንዱ ተማሪ የተማረውን ዋና ቁምነገር እና ያልገባውን አንድ ነጥብ በወረቀት ጽፎ ለመምህሩ እንዲሰጥ ማድረግ።

2. የተግባር ምዘና መስፈርቶች (Formative Assessment Rubrics):
- ተሳትፎ እና የቡድን ስራ፡ 20%
- የዕለታዊ የቤት ስራና የክፍል ስራ፡ 30%
- ሳምንታዊ ፈጣን ጥያቄዎች (Quizzes): 20%
- የሴሚስተር አጋማሽ ፈተና (Mid Exam): 30%

3. ልዩ ድጋፍ ለሚሹ ተማሪዎች የሚደረግ እገዛ (Inclusive Education):
- በቀስታ የሚማሩ ተማሪዎችን ቀድሞ ለይቶ ተጨማሪ የማብራሪያ ክፍለ-ጊዜ መስጠት።
- በፈተና ወቅት ተጨማሪ ጊዜ መስጠት።
- የተማሪዎችን ጥንካሬ በማበረታታት በራስ መተማመናቸውን መገንባት።

አዘጋጅ፡ የሻሸመኔ ትምህርት ቢሮ ስርዓተ-ትምህርት ቡድን`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fileName.trim()) {
      return;
    }

    const defaultUploader =
      currentUser?.name ||
      (currentLang === 'om'
        ? 'Barsiisaa / Leenjisaa'
        : currentLang === 'en'
        ? 'Teacher / Trainer'
        : 'መምህር / አሰልጣኝ');

    const newAttachment: TrainingAttachment = {
      id: `att-${Date.now()}`,
      fileName: fileName.trim(),
      fileType,
      fileSize: fileSize || '500 KB',
      dataUrl: dataUrl || undefined,
      textContent: textContent.trim(),
      description: description.trim(),
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: defaultUploader
    };

    if (createAsNewModule) {
      const newModule: TrainingMaterial = {
        id: `mat-${Date.now()}`,
        title: newModuleTitle.trim() || fileName.replace(/\.[^/.]+$/, ''),
        subject: newModuleSubject,
        gradeLevels: newModuleGrade,
        authorDepartment: `${defaultUploader} (${
          currentLang === 'om'
            ? 'Sanada Leenjii Dabalataa M/B'
            : currentLang === 'en'
            ? 'School Additional Training Document'
            : 'የት/ቤት ተጨማሪ የስልጠና ሰነድ'
        })`,
        uploadedAt: new Date().toISOString().split('T')[0],
        readTimeMinutes: 15,
        downloadCount: 1,
        tags: [newModuleSubject.split(' ')[0], 'Teacher Material', 'Attachment'],
        summary:
          description.trim() ||
          (currentLang === 'om'
            ? 'Barreeffamaa fi sanada leenjii dabalataa barsiisotaaf qophaa\'e.'
            : currentLang === 'en'
            ? 'Supplementary training text and teaching guide for teachers.'
            : 'ለመምህራን የተዘጋጀ ተጨማሪ የስልጠና ጽሑፍና የማስተማሪያ ሰነድ።'),
        fullContent:
          textContent.trim() ||
          (currentLang === 'om'
            ? 'Guutuun barreeffama leenjii kanaa sanada walqabate keessa jira. Maaloo maxxansa armaan gadii ilaalaa.'
            : currentLang === 'en'
            ? 'The full text of this training is in the attached document below.'
            : 'የዚህ ስልጠና ሙሉ ጽሑፍ ከተያያዘው ሰነድ ውስጥ ይገኛል። እባክዎ ከታች ያለውን አታችመንት ይመልከቱ።'),
        attachments: [newAttachment]
      };

      const updated = StorageService.addTrainingMaterial(newModule);
      onAttachmentAdded(updated);

      StorageService.addTeacherTrainingNotification({
        id: `notif-train-${Date.now()}`,
        materialId: newModule.id,
        materialTitle: newModule.title,
        subject: newModule.subject,
        gradeLevels: newModule.gradeLevels,
        authorDepartment: newModule.authorDepartment,
        uploadedAt: new Date().toISOString(),
        message:
          currentLang === 'om'
            ? `Barreeffamni leenjii / faayilli haaraan fe'ameera! Gosa Barnootaa: ${newModule.subject} · Sadarkaa Kutaa: ${newModule.gradeLevels}. Maaloo buufadhaatii qo'adhaa.`
            : currentLang === 'en'
            ? `New training document uploaded! Subject: ${newModule.subject} · Grades: ${newModule.gradeLevels}. Please download and study.`
            : `አዲስ የስልጠና ጽሑፍ/አታችመንት ተጭኗል! የትምህርት አይነት: ${newModule.subject} · የክፍል ደረጃ: ${newModule.gradeLevels}። እባክዎ ሰነዱን አውርደው (ዳውንሎድ) ያጥኑ።`,
        isRead: false
      });

      OfflineSyncManager.enqueue(
        'training_material',
        'create',
        newModule.id,
        newModule,
        {
          authorName: defaultUploader,
          schoolName: currentUser?.schoolName || 'Shashemene',
          description: `${
            currentLang === 'om'
              ? 'Sanada leenjii haaraa:'
              : currentLang === 'en'
              ? 'New training attachment:'
              : 'አዲስ የስልጠና አታችመንት ሰነድ፡'
          } ${newModule.title}`
        }
      );
    } else {
      if (!targetMaterialId) {
        return;
      }

      const updated = StorageService.addTrainingAttachment(targetMaterialId, newAttachment);
      onAttachmentAdded(updated);

      OfflineSyncManager.enqueue(
        'training_attachment',
        'create',
        newAttachment.id,
        { materialId: targetMaterialId, attachment: newAttachment },
        {
          authorName: defaultUploader,
          schoolName: currentUser?.schoolName || 'Shashemene',
          description: `${
            currentLang === 'om'
              ? 'Faayilli leenjii dabalameera:'
              : currentLang === 'en'
              ? 'Training attachment added:'
              : 'የስልጠና አታችመንት ተጨምሯል፡'
          } ${newAttachment.fileName}`
        }
      );
    }

    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 1200);
  };

  const selectedTargetMat = materials.find((m) => m.id === targetMaterialId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 p-5 sm:p-6 text-white shrink-0 relative">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/80 border border-emerald-400/40 text-[10px] font-bold text-emerald-200">
                <Paperclip className="w-3 h-3 text-amber-300" />
                <span>
                  {currentLang === 'om'
                    ? 'Fe\'aa Barreeffamaa fi Sanada Leenjii'
                    : currentLang === 'en'
                    ? 'Training Document & Attachment Uploader'
                    : 'የስልጠና ጽሑፍና ሰነድ አታችመንት መጫኛ'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {currentLang === 'om'
                  ? 'Barsiisotaaf Sanada / Barreeffama Leenjii Maxxansi'
                  : currentLang === 'en'
                  ? 'Attach Training Document / Manual for Teachers'
                  : 'ለመምህራን የስልጠና ሰነድ / ጽሑፍ አያይዝ'}
              </h3>
              <p className="text-xs text-emerald-200/90">
                {currentLang === 'om'
                  ? 'Sanada PDF, Word (DOCX) ykn Barreeffama (TXT) fe\'uun barsiisotaaf qoodaa'
                  : currentLang === 'en'
                  ? 'Upload PDF, Word (DOCX), or Text (TXT) files to share with teachers'
                  : 'የፒዲኤፍ (PDF)፣ የዎርድ (DOCX) ወይም የጽሑፍ (TXT) ሰነድ በመጫን ለመምህራን አጋራ'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-slate-200 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {successToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                {currentLang === 'om'
                  ? 'Sanadni leenjii milkaa\'inaan fe\'ameera!'
                  : currentLang === 'en'
                  ? 'Training attachment uploaded successfully!'
                  : 'የስልጠና አታችመንቱ በተሳካ ሁኔታ ተጭኗል!'}
              </span>
            </div>
          )}

          {/* Target Mode Toggle */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              {currentLang === 'om'
                ? 'Faayila kana eessatti maxxansuu barbaaddu?'
                : currentLang === 'en'
                ? 'Where would you like to attach this file?'
                : 'አታችመንቱን የት ጋር ማያያዝ ይፈልጋሉ?'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCreateAsNewModule(false)}
                className={`p-2.5 rounded-xl border text-left transition font-semibold flex items-center gap-2 ${
                  !createAsNewModule
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <Paperclip className="w-4 h-4 text-emerald-700" />
                <span>
                  {currentLang === 'om'
                    ? `Leenjii jirutti maxxansi (${materials.length})`
                    : currentLang === 'en'
                    ? `Attach to Existing Module (${materials.length})`
                    : `ነባር ስልጠና ላይ አያይዝ (${materials.length})`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCreateAsNewModule(true)}
                className={`p-2.5 rounded-xl border text-left transition font-semibold flex items-center gap-2 ${
                  createAsNewModule
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>
                  {currentLang === 'om'
                    ? 'Akka Mooduula Leenjii Haaraatti Fe\'i'
                    : currentLang === 'en'
                    ? 'Upload as New Training Module'
                    : 'እንደ አዲስ የስልጠና ሞጁል ጫን'}
                </span>
              </button>
            </div>
          </div>

          {!createAsNewModule ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {currentLang === 'om'
                  ? 'Mooduula Leenjii itti hidhamu *'
                  : currentLang === 'en'
                  ? 'Target Training Module *'
                  : 'አታችመንቱ የሚጣመርበት የስልጠና ሞጁል *'}
              </label>
              <select
                value={targetMaterialId}
                onChange={(e) => setTargetMaterialId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.subject})
                  </option>
                ))}
              </select>
              {selectedTargetMat && (
                <p className="text-[11px] text-slate-500 mt-1">
                  {currentLang === 'om'
                    ? 'Kan filatame:'
                    : currentLang === 'en'
                    ? 'Selected:'
                    : 'የተመረጠው፡'}{' '}
                  <strong className="text-slate-800">{selectedTargetMat.title}</strong> ·{' '}
                  {currentLang === 'om'
                    ? 'Baay\'ina faayiloota jiranii:'
                    : currentLang === 'en'
                    ? 'Existing attachments:'
                    : 'የነባር አታችመንቶች ብዛት፡'}{' '}
                  <strong className="text-emerald-800">{selectedTargetMat.attachments?.length || 0}</strong>
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-emerald-50/40 border border-emerald-200 rounded-2xl">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLang === 'om'
                    ? 'Mata-duree Leenjii Haaraa *'
                    : currentLang === 'en'
                    ? 'New Training Title *'
                    : 'የአዲሱ ስልጠና ርዕስ *'}
                </label>
                <input
                  type="text"
                  required
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  placeholder={
                    currentLang === 'om'
                      ? 'Fkn: Qajeelfama Mala Barsiisuu Kutaa fi Madaallii Barattootaa'
                      : currentLang === 'en'
                      ? 'e.g., Classroom Pedagogy and Assessment Guide'
                      : 'ለምሳሌ፡ የክፍል ውስጥ ስነ-ዘዴ እና የተማሪዎች ምዘና ዝርዝር መመሪያ'
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLang === 'om'
                    ? 'Gosa Barnootaa (Subject)'
                    : currentLang === 'en'
                    ? 'Subject'
                    : 'የትምህርት አይነት (Subject)'}
                </label>
                <select
                  value={newModuleSubject}
                  onChange={(e) => setNewModuleSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                >
                  <option value="Mathematics (ሂሳብ)">
                    {currentLang === 'om' ? 'Herrega (Mathematics)' : currentLang === 'en' ? 'Mathematics' : 'Mathematics (ሂሳብ)'}
                  </option>
                  <option value="Afaan Oromoo (ኦሮሚኛ)">
                    {currentLang === 'om' ? 'Afaan Oromoo' : currentLang === 'en' ? 'Afaan Oromoo' : 'Afaan Oromoo (ኦሮሚኛ)'}
                  </option>
                  <option value="English (እንግሊዝኛ)">
                    {currentLang === 'om' ? 'Ingiliffa (English)' : currentLang === 'en' ? 'English' : 'English (እንግሊዝኛ)'}
                  </option>
                  <option value="Physics & Chemistry (ሳይንስ)">
                    {currentLang === 'om' ? 'Fiiziksii fi Keemistirii' : currentLang === 'en' ? 'Physics & Chemistry' : 'Physics & Chemistry (ሳይንስ)'}
                  </option>
                  <option value="Biology (ባዮሎጂ)">
                    {currentLang === 'om' ? 'Baayoloojii (Biology)' : currentLang === 'en' ? 'Biology' : 'Biology (ባዮሎጂ)'}
                  </option>
                  <option value="Citizenship & Social Studies (ስነ-ዜጋ)">
                    {currentLang === 'om' ? 'Barnoota Lammummaa fi Hawaasaa' : currentLang === 'en' ? 'Citizenship & Social Studies' : 'Citizenship & Social Studies (ስነ-ዜጋ)'}
                  </option>
                  <option value="General Pedagogy & CPD (አጠቃላይ ስነ-ዘዴ)">
                    {currentLang === 'om' ? 'Mala Barsiisuu Waliigalaa fi CPD' : currentLang === 'en' ? 'General Pedagogy & CPD' : 'General Pedagogy & CPD (አጠቃላይ ስነ-ዘዴ)'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLang === 'om'
                    ? 'Sadarkaa Kutaa (Grade Levels)'
                    : currentLang === 'en'
                    ? 'Grade Levels'
                    : 'የክፍል ደረጃ (Grade Levels)'}
                </label>
                <input
                  type="text"
                  value={newModuleGrade}
                  onChange={(e) => setNewModuleGrade(e.target.value)}
                  placeholder={currentLang === 'om' ? 'Fkn: Grades 9 - 12' : currentLang === 'en' ? 'e.g., Grades 9 - 12' : 'ለምሳሌ፡ Grades 9 - 12'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* File Upload Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                {currentLang === 'om'
                  ? 'Faayila Sanadaa Fe\'i (PDF, DOCX, TXT, Image)'
                  : currentLang === 'en'
                  ? 'Upload Document File (PDF, DOCX, TXT, Image)'
                  : 'የሰነድ ፋይል ይጫኑ (PDF, DOCX, TXT, Image)'}
              </label>
              <button
                type="button"
                onClick={handleUseDemoAttachment}
                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200 transition flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {currentLang === 'om'
                    ? '✨ Sanada Leenjii Qophaa\'e Guuti (Demo)'
                    : currentLang === 'en'
                    ? '✨ Fill Sample Document (Demo)'
                    : '✨ ዝግጁ የስልጠና ሰነድ ሙላ (Demo Document)'}
                </span>
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 sm:p-5 text-center bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <FileUp className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">
                {currentLang === 'om'
                  ? 'Faayila asitti harkisi ykn filachuuf cuqaasi'
                  : currentLang === 'en'
                  ? 'Drag and drop file here or click to select'
                  : 'ፋይሉን እዚህ ይጎትቱ ወይም ለመምረጥ ይጫኑ'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {currentLang === 'om'
                  ? 'PDF, Word (.docx), Text (.txt), Suuraa (hanga 25 MB)'
                  : currentLang === 'en'
                  ? 'PDF, Word (.docx), Text (.txt), Image (up to 25 MB)'
                  : 'PDF, Word (.docx), Text (.txt), ምስል (እስከ 25 MB)'}
              </p>
              {isReadingFile && (
                <p className="text-xs text-emerald-800 font-bold mt-2 animate-pulse">
                  {currentLang === 'om'
                    ? 'Faayila dubbisaa jira...'
                    : currentLang === 'en'
                    ? 'Reading file...'
                    : 'ፋይሉን በማንበብ ላይ...'}
                </p>
              )}
            </div>
          </div>

          {/* File Name & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {currentLang === 'om'
                  ? 'Maqaa Sanadaa (Attachment File Name) *'
                  : currentLang === 'en'
                  ? 'Attachment File Name *'
                  : 'የሰነዱ ስም (Attachment File Name) *'}
              </label>
              <input
                type="text"
                required
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder={
                  currentLang === 'om'
                    ? 'Fkn: Maanuwaala Mala Barsiisuu Herregaa.pdf'
                    : currentLang === 'en'
                    ? 'e.g., Mathematics Teaching Guide.pdf'
                    : 'ምሳሌ፡ የሂሳብ ማስተማሪያ ስነ-ዘዴ ዝርዝር ማንዋል.pdf'
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {currentLang === 'om'
                  ? 'Gosa Faayilaa'
                  : currentLang === 'en'
                  ? 'File Type'
                  : 'የፋይል አይነት'}
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden uppercase"
              >
                <option value="pdf">{currentLang === 'om' ? 'Sanada PDF' : currentLang === 'en' ? 'PDF Document' : 'PDF ሰነድ'}</option>
                <option value="docx">Word (.docx)</option>
                <option value="doc">Word (.doc)</option>
                <option value="txt">{currentLang === 'om' ? 'Barreeffama (.txt)' : currentLang === 'en' ? 'Text (.txt)' : 'ፅሁፍ (.txt)'}</option>
                <option value="image">{currentLang === 'om' ? 'Suuraa (Image)' : currentLang === 'en' ? 'Image' : 'ምስል (Image)'}</option>
                <option value="other">{currentLang === 'om' ? 'Sanada Biraa' : currentLang === 'en' ? 'Other Document' : 'ሌላ ሰነድ'}</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {currentLang === 'om'
                ? 'Ibsa Gabaabaa Sanadaa (Description / Note)'
                : currentLang === 'en'
                ? 'Short Description / Note'
                : 'የሰነዱ አጭር ማብራሪያ (Description / Note)'}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                currentLang === 'om'
                  ? 'Fkn: Tarree hojiiwwan qabatamaa barsiisonni kutaa keessatti raawwatan'
                  : currentLang === 'en'
                  ? 'e.g., Practical classroom activities list for teachers'
                  : 'ለምሳሌ፡ ለመምህራን በክፍል ውስጥ የሚተገበር የተግባር ስራዎች ዝርዝር'
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
            />
          </div>

          {/* Text Content TextArea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                {currentLang === 'om'
                  ? 'Qabiyyee Barreeffamaa Sanadaa (Attached Text Content)'
                  : currentLang === 'en'
                  ? 'Attached Text Content'
                  : 'የሰነዱ ዝርዝር ጽሑፍ (Attached Text Content)'}
              </label>
              <span className="text-[10px] text-slate-400">
                {currentLang === 'om'
                  ? 'Barsiisonni kallattiin poortaala irratti akka dubbisaniif'
                  : currentLang === 'en'
                  ? 'For teachers to read directly inside the training portal'
                  : 'መምህራን በቀጥታ በስልጠና ፖርታሉ ላይ እንዲያነቡት'}
              </span>
            </div>
            <textarea
              rows={6}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder={
                currentLang === 'om'
                  ? 'Barreeffama guutuu sanada leenjii asitti barreessaa ykn isa faayila irraa dubbifame sirreessaa...'
                  : currentLang === 'en'
                  ? 'Enter full training text here or edit text extracted from file...'
                  : 'የስልጠናውን አታችመንት ሙሉ ጽሑፍ እዚህ ይጻፉ ወይም ከፋይሉ የተነበበውን ያርትዑ...'
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-sans leading-relaxed focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
            />
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">
              {currentLang === 'om'
                ? 'Sanadni fe\'ame barsiisota hunda battalumatti ni gaha.'
                : currentLang === 'en'
                ? 'Uploaded document reaches target teachers immediately.'
                : 'የተጫነው ሰነድ ለሁሉም መምህራን ወዲያውኑ ይደርሳል።'}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                {currentLang === 'om' ? 'Haqi (Cancel)' : currentLang === 'en' ? 'Cancel' : 'ሰርዝ (Cancel)'}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>
                  {currentLang === 'om'
                    ? 'Sanada Fe\'iitii Maxxansi'
                    : currentLang === 'en'
                    ? 'Upload & Attach'
                    : 'ሰነዱን ጫንና አያይዝ'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
