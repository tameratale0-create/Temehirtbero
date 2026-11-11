import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
  Search,
  Filter,
  Award,
  Layers,
  GraduationCap,
  Building2,
  Calendar,
  Check,
  ChevronRight,
  ExternalLink,
  Info,
  ShieldCheck,
  FileCheck,
  Tag,
  Share2,
  Paperclip,
  Upload,
  Download,
  Eye,
  FileText,
  Bell,
  BellRing
} from 'lucide-react';
import { TrainingMaterial, TrainingAttachment, School, AppUserSession, Language, TeacherExam, TeacherTrainingNotification } from '../types';
import { StorageService } from '../utils/storage';
import { OfflineSyncManager } from '../utils/offlineSync';
import { getTeacherAssignment, isTrainingMaterialForTeacher, parseGradeRange } from '../utils/teacherAssignment';
import { TrainingAttachmentViewerModal } from './TrainingAttachmentViewerModal';
import { UploadTrainingAttachmentModal } from './UploadTrainingAttachmentModal';

interface TeacherSubjectTrainingDeskProps {
  school: School;
  currentUser: AppUserSession | null;
  currentLang: Language;
  onMaterialsUpdated?: (updated: TrainingMaterial[]) => void;
  compactMode?: boolean;
}

export const TeacherSubjectTrainingDesk: React.FC<TeacherSubjectTrainingDeskProps> = ({
  school,
  currentUser,
  currentLang,
  onMaterialsUpdated,
  compactMode = false
}) => {
  const [materials, setMaterials] = useState<TrainingMaterial[]>(() =>
    StorageService.getTrainingMaterials()
  );

  const teacherIdentifier = currentUser?.identifier || currentUser?.accessCode || 'teacher-default';

  // Completed training module IDs for this teacher
  const [completedIds, setCompletedIds] = useState<string[]>(() =>
    StorageService.getCompletedTrainings(teacherIdentifier)
  );

  // Active reading modal
  const [activeReading, setActiveReading] = useState<TrainingMaterial | null>(null);
  const [completionNotice, setCompletionNotice] = useState<string | null>(null);

  // Training Attachment Viewer & Uploader Modals
  const [viewerAttachment, setViewerAttachment] = useState<TrainingAttachment | null>(null);
  const [viewerMaterialTitle, setViewerMaterialTitle] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadTargetMaterialId, setUploadTargetMaterialId] = useState<string | undefined>(undefined);


  // Search & tab filter
  const [searchQuery, setSearchQuery] = useState('');
  const [scopeFilter, setScopeFilter] = useState<'my_subject' | 'pedagogy' | 'all'>('my_subject');

  // Detect teacher subject & grade levels based on session, school code, or stakeholders
  const teacherAssignment = useMemo(() => {
    return getTeacherAssignment(currentUser);
  }, [currentUser]);

  // Teacher notifications state from Bureau Dispatches
  const [trainingNotifs, setTrainingNotifs] = useState<TeacherTrainingNotification[]>(() =>
    StorageService.getTeacherTrainingNotifications(teacherIdentifier)
  );
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [activeToast, setActiveToast] = useState<TeacherTrainingNotification | null>(null);

  // Play gentle notification sound
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // autoplay fallback
    }
  };

  // Listen for live dispatch events from Education Bureau
  React.useEffect(() => {
    const handleDispatched = (e: any) => {
      const notif: TeacherTrainingNotification = e.detail;
      const refreshed = StorageService.getTeacherTrainingNotifications(teacherIdentifier);
      setTrainingNotifs(refreshed);

      // Check if this newly dispatched material is intended for this teacher
      const allMats = StorageService.getTrainingMaterials();
      setMaterials(allMats);
      const targetMat = allMats.find((m) => m.id === notif.materialId);
      if (targetMat && isTrainingMaterialForTeacher(targetMat, teacherAssignment)) {
        setActiveToast(notif);
        playChime();
      }
    };

    window.addEventListener('teacher_training_dispatched', handleDispatched);
    return () => window.removeEventListener('teacher_training_dispatched', handleDispatched);
  }, [teacherIdentifier, teacherAssignment]);

  const unreadNotifsCount = useMemo(() => {
    return trainingNotifs.filter((n) => !n.isRead).length;
  }, [trainingNotifs]);

  // Current active subject (defaults to teacher's primary subject, allows switching if teaching multiple)
  const [selectedSubject, setSelectedSubject] = useState<string>(teacherAssignment.primarySubject);

  React.useEffect(() => {
    setSelectedSubject(teacherAssignment.primarySubject);
  }, [teacherAssignment]);

  // Available subjects in system
  const availableSubjects = [
    'Mathematics (ሂሳብ)',
    'Afaan Oromoo (ኦሮሚኛ)',
    'English (እንግሊዝኛ)',
    'Physics & Chemistry (ሳይንስ)',
    'Biology (ባዮሎጂ)',
    'Citizenship & Social Studies (ስነ-ዜጋ)',
    'General Pedagogy & CPD (አጠቃላይ ስነ-ዘዴ)'
  ];

  // Filter materials based on current scope, subject, grade level, and search query
  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      // Search matching
      const matchesSearch =
        searchQuery.trim() === '' ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Scope matching
      if (scopeFilter === 'my_subject') {
        // Strict Subject AND Grade Level matching:
        // "መምህሩ እንደሚያስተምረው የትምህርት አይነቶች እና የ ክፍል ደረጃ ብቻ የስልጠና ማንዋል (ጽሑፍ) እንዲደርሰው አድርጉ"
        return isTrainingMaterialForTeacher(m, {
          ...teacherAssignment,
          primarySubject: selectedSubject,
          subjects: [selectedSubject]
        });
      }

      if (scopeFilter === 'pedagogy') {
        const isPedagogy =
          m.subject.includes('Pedagogy') ||
          m.subject.includes('CPD') ||
          m.subject.includes('ስነ-ዘዴ') ||
          m.tags.includes('Pedagogy');
        if (!isPedagogy) return false;
        const matGrades = parseGradeRange(m.gradeLevels);
        return teacherAssignment.grades.some((g) => matGrades.includes(g));
      }

      // 'all' scope
      return true;
    });
  }, [materials, searchQuery, scopeFilter, selectedSubject, teacherAssignment]);

  // Counts
  const mySubjectCount = useMemo(() => {
    return materials.filter((m) =>
      isTrainingMaterialForTeacher(m, {
        ...teacherAssignment,
        primarySubject: selectedSubject,
        subjects: [selectedSubject]
      })
    ).length;
  }, [materials, teacherAssignment, selectedSubject]);

  const pedagogyCount = useMemo(() => {
    return materials.filter((m) => {
      const isPedagogy =
        m.subject.includes('Pedagogy') ||
        m.subject.includes('CPD') ||
        m.subject.includes('ስነ-ዘዴ') ||
        m.tags.includes('Pedagogy');
      if (!isPedagogy) return false;
      const matGrades = parseGradeRange(m.gradeLevels);
      return teacherAssignment.grades.some((g) => matGrades.includes(g));
    }).length;
  }, [materials, teacherAssignment]);

  // Handle open reading modal
  const handleOpenReading = (mat: TrainingMaterial) => {
    const updated = StorageService.incrementDownload(mat.id);
    setMaterials(updated);
    if (onMaterialsUpdated) onMaterialsUpdated(updated);
    setActiveReading(mat);
  };

  // Toggle module completion
  const handleToggleComplete = (matId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const result = StorageService.toggleTrainingCompleted(teacherIdentifier, matId);
    setCompletedIds(result.allCompleted);

    // Enqueue training material completion for offline sync
    OfflineSyncManager.enqueue(
      'training_material',
      'update',
      matId,
      { materialId: matId, teacherIdentifier, completed: result.completed, completedAt: new Date().toISOString() },
      {
        authorName: currentUser?.name || teacherIdentifier,
        schoolName: school.name,
        description: `የመምህር ${currentUser?.name || 'መምህር'} የCPD ስልጠና ማጠናቀቂያ ምዝገባ`
      }
    );

    if (result.completed) {
      setCompletionNotice('ስልጠናውን በተሳካ ሁኔታ አጠናቀዋል! የCPD የሙያ ማሻሻያ ነጥብዎ ተመዝግቧል።');
      setTimeout(() => setCompletionNotice(null), 3500);
    }
  };

  // Direct file download for offline study: "ፅሁፍን አውርዶ ( ዳውንሎድ ) አርጉ ያጠናል"
  const handleDownloadDocument = (mat: TrainingMaterial, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Increment download count
    const updated = StorageService.incrementDownload(mat.id);
    setMaterials(updated);
    if (onMaterialsUpdated) onMaterialsUpdated(updated);

    // If material has an attached file with dataUrl, trigger download
    const firstAttWithUrl = mat.attachments?.find((a) => a.dataUrl);
    if (firstAttWithUrl && firstAttWithUrl.dataUrl) {
      const link = document.createElement('a');
      link.href = firstAttWithUrl.dataUrl;
      link.download = firstAttWithUrl.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setCompletionNotice(`"${firstAttWithUrl.fileName}" በተሳካ ሁኔታ ወርዷል (Downloaded)! አሁን ማጥናት ይችላሉ።`);
      setTimeout(() => setCompletionNotice(null), 4000);
      return;
    }

    // Otherwise create a formatted study document text file (.doc / .txt)
    const contentToDownload = `========================================================================
የኦሮሚያ ብሔራዊ ክልላዊ መንግሥት · የሻሸመኔ ከተማ አስተዳደር ትምህርት ጽሕፈት ቤት
የስርዓተ-ትምህርትና መምህራን ቀጣይነት ያለው የሙያ ማሻሻያ (CPD) ይፋዊ የስልጠና ሰነድ
========================================================================

ርዕስ (Title): ${mat.title}
የትምህርት አይነት (Subject): ${mat.subject}
የክፍል ደረጃ (Grade Level): ${mat.gradeLevels}
የላከው ክፍል (Author): ${mat.authorDepartment}
የተላከበት ቀን (Date): ${mat.uploadedAt}
የተላከለት መምህር: ${currentUser?.name || 'መምህር'}

------------------------------------------------------------------------
አጠቃላይ ማጠቃለያ (Summary):
------------------------------------------------------------------------
${mat.summary}

------------------------------------------------------------------------
ሙሉ የስልጠና ጽሑፍና መመሪያ (Full Pedagogical Content):
------------------------------------------------------------------------
${mat.fullContent}

========================================================================
ይህ ሰነድ ከሻሸመኔ ከተማ ትምህርት ቢሮ ዲጂታል ፖርታል በቀጥታ ለመምህሩ የወረደ ይፋዊ የስልጠና ማስተማሪያ ማንዋል ነው።
የወረደበት ቀንና ሰዓት: ${new Date().toLocaleString('am-ET')}
========================================================================
`;

    const blob = new Blob([contentToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanTitle = mat.title.replace(/[^a-zA-Z0-9\u1200-\u137F]/g, '_').substring(0, 40);
    link.download = `${cleanTitle}_የስልጠና_ሰነድ.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCompletionNotice(`"${mat.title}" የስልጠና ሰነድ በተሳካ ሁኔታ ወርዷል (Downloaded)! አሁን አውርደው ማጥናት ይችላሉ።`);
    setTimeout(() => setCompletionNotice(null), 4000);
  };

  const handlePrint = (mat: TrainingMaterial) => {
    // Avoid window.open in iframe environments by using a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${mat.title} - የሻሸመኔ ትምህርት ቢሮ ስልጠና</title>
          <style>
            body { font-family: sans-serif; padding: 30px; line-height: 1.6; color: #1e293b; }
            .header { border-bottom: 3px double #0f766e; padding-bottom: 15px; margin-bottom: 25px; text-align: center; }
            .bureau-title { font-size: 20px; font-weight: 800; color: #134e4a; text-transform: uppercase; }
            .sub-title { font-size: 13px; color: #047857; margin-top: 4px; font-weight: 600; }
            .meta-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; font-size: 12px; }
            .title { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
            .summary { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px; font-size: 14px; font-style: italic; margin-bottom: 20px; }
            .content { white-space: pre-line; font-size: 14px; }
            .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; text-align: center; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="bureau-title">የኦሮሚያ ብሔራዊ ክልላዊ መንግሥት · የሻሸመኔ ከተማ አስተዳደር ትምህርት ጽሕፈት ቤት</div>
            <div class="sub-title">የስርዓተ-ትምህርትና መምህራን ቀጣይነት ያለው የሙያ ማሻሻያ (CPD) ይፋዊ የስልጠና ሰነድ</div>
          </div>

          <div class="meta-box">
            <div><strong>የትምህርት አይነት:</strong> ${mat.subject}</div>
            <div><strong>የክፍል ደረጃ:</strong> ${mat.gradeLevels}</div>
            <div><strong>የላከው ክፍል:</strong> ${mat.authorDepartment}</div>
            <div><strong>የተላከለት መምህር:</strong> ${currentUser?.name || 'መምህር'}</div>
          </div>

          <div class="title">${mat.title}</div>
          <div class="summary"><strong>አጠቃላይ ማጠቃለያ፡</strong> ${mat.summary}</div>

          <div class="content">${mat.fullContent}</div>

          <div class="footer">
            ይህ ሰነድ ከሻሸመኔ ከተማ ትምህርት ቢሮ ዲጂታል ፖርታል በቀጥታ ለመምህሩ ገጽ የተላከ ይፋዊ የማስተማሪያ መመሪያ ነው።<br/>
            የወረደበት ቀን፡ ${new Date().toLocaleDateString('am-ET')} · የሰነድ መለያ ቁጥር፡ ${mat.id}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2000);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Real-time Bureau Training Dispatch Toast Alert */}
      {activeToast && (
        <aside aria-label="አዲስ የስልጠና ማሳወቂያ" className="fixed top-4 right-4 left-4 sm:left-auto z-50 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 text-white rounded-2xl p-4 sm:p-4.5 shadow-2xl border-2 border-amber-400 ring-4 ring-amber-500/20 space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
                  <BellRing className="w-5 h-5 text-slate-950 animate-bounce" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                    አዲስ የስልጠና ጽሑፍ ከትምህርት ቢሮ
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-white mt-1 leading-snug">
                    {activeToast.materialTitle}
                  </h4>
                  <p className="text-[11px] text-amber-200 mt-0.5">
                    የትምህርት አይነት፡ {activeToast.subject} · ደረጃ፡ {activeToast.gradeLevels}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveToast(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-emerald-100 bg-white/10 p-2.5 rounded-xl border border-white/10 leading-relaxed">
              {activeToast.message}
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const targetMat = materials.find((m) => m.id === activeToast.materialId);
                  setActiveToast(null);
                  if (targetMat) handleOpenReading(targetMat);
                }}
                className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>አውርድና አጥና (Download & Study)</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 1. Bureau Training Direct Dispatch Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-emerald-700/40 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/80 border border-emerald-400/40 rounded-full text-xs font-semibold text-emerald-200">
              <Building2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>የሻሸመኔ ከተማ ትምህርት ቢሮ ይፋዊ የስልጠና ማስተላለፊያ</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
              ከትምህርት ቢሮ ለርሶ የተላኩ ይፋዊ የስልጠና ሞጁሎች
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              የትምህርት ቢሮው እንደሚያስተምሩት የትምህርት አይነት{' '}
              <strong className="text-amber-300 font-bold underline underline-offset-2">
                [{selectedSubject}]
              </strong>{' '}
              እና የክፍል ደረጃ{' '}
              <strong className="text-emerald-300 font-bold underline underline-offset-2">
                [{teacherAssignment.primaryGradeLabel}]
              </strong>{' '}
              ብቻ ለይቶ ያዘጋጃቸው የሙያ ማሻሻያ (CPD) እና የስርዓተ-ትምህርት ማስተማሪያ ማንዋሎች (ጽሑፎች) በቀጥታ እዚህ ደርሰውዎታል!
            </p>

            {/* Teacher Details Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-900/60 border border-emerald-600/40 text-emerald-100 flex items-center gap-1.5 font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                <span>መምህር፡ <strong>{currentUser?.name || 'መ/ር በፈቃዱ ጥላሁን'}</strong></span>
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-emerald-900/60 border border-emerald-600/40 text-emerald-100 flex items-center gap-1.5 font-medium">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>የተመደቡበት ክፍል፡ <strong>{teacherAssignment.primaryGradeLabel}</strong></span>
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-emerald-900/60 border border-emerald-600/40 text-emerald-100 flex items-center gap-1.5 font-medium">
                <Building2 className="w-3.5 h-3.5 text-teal-300" />
                <span>ት/ቤት፡ <strong>{school.name}</strong></span>
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 border border-amber-300/40 text-amber-200 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>የተጠናቀቁ ስልጠናዎች፡ {completedIds.length}</span>
              </span>

              {/* Bureau Messages & Dispatch Notifications Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifDrawer(!showNotifDrawer)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                    unreadNotifsCount > 0
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black ring-2 ring-amber-300'
                      : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-500/40'
                  }`}
                  title="ከትምህርት ቢሮ የተላኩ የስልጠና መልእክቶች"
                >
                  <Bell className={`w-3.5 h-3.5 ${unreadNotifsCount > 0 ? 'fill-slate-950 text-slate-950' : 'text-amber-300'}`} />
                  <span>የቢሮ መልእክቶች</span>
                  {unreadNotifsCount > 0 ? (
                    <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                      {unreadNotifsCount} አዲስ
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-300 font-mono">
                      ({trainingNotifs.length})
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Drawer */}
                {showNotifDrawer && (
                  <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-3.5 bg-gradient-to-r from-emerald-950 to-teal-900 text-white flex items-center justify-between border-b border-emerald-800">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-amber-300" />
                        <h4 className="text-xs font-bold">ከትምህርት ቢሮ የተላኩ ይፋዊ የስልጠና ማሳወቂያዎች</h4>
                      </div>
                      {unreadNotifsCount > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = StorageService.markAllTeacherTrainingNotificationsAsRead(teacherIdentifier);
                            setTrainingNotifs(updated);
                          }}
                          className="text-[10px] text-amber-300 hover:underline cursor-pointer"
                        >
                          ሁሉንም አንብብ
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1">
                      {trainingNotifs.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-500">
                          እስካሁን ምንም አዲስ የስልጠና ማሳወቂያ የለም
                        </div>
                      ) : (
                        trainingNotifs.map((notif) => {
                          const targetMat = materials.find((m) => m.id === notif.materialId);
                          return (
                            <div
                              key={notif.id}
                              className={`p-3 rounded-xl transition-all ${
                                !notif.isRead
                                  ? 'bg-amber-50/90 border-l-4 border-amber-500'
                                  : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  {notif.subject}
                                </span>
                                <span className="text-[9px] text-slate-400">
                                  {notif.uploadedAt ? notif.uploadedAt.split('T')[0] : ''}
                                </span>
                              </div>
                              <h5 className="text-xs font-black text-slate-900 mt-1 leading-tight">
                                {notif.materialTitle}
                              </h5>
                              <p className="text-[11px] text-slate-700 mt-1 leading-snug">
                                {notif.message}
                              </p>
                              <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-100 text-[10px]">
                                <span className="text-slate-500">{notif.gradeLevels}</span>
                                {targetMat && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      StorageService.markTeacherTrainingNotificationAsRead(notif.id);
                                      setTrainingNotifs(StorageService.getTeacherTrainingNotifications(teacherIdentifier));
                                      setShowNotifDrawer(false);
                                      handleOpenReading(targetMat);
                                    }}
                                    className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                                  >
                                    <span>አውርድና አንብብ</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setUploadTargetMaterialId(undefined);
                  setShowUploadModal(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black flex items-center gap-2 shadow-md transition-all cursor-pointer text-xs"
              >
                <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+ የስልጠና ጽሑፍ / አታችመንት ጫን</span>
              </button>
            </div>
          </div>

          {/* Quick Subject Switcher */}
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/30 space-y-2.5 shrink-0 min-w-[260px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>የሚያስተምሩት የትምህርት መስክ:</span>
              </span>
              <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-500/30">
                ቀጥታ የተጣመረ
              </span>
            </div>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-950 text-white border border-emerald-500/50 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-emerald-400 focus:outline-hidden cursor-pointer"
            >
              {availableSubjects.map((sub) => (
                <option key={sub} value={sub} className="bg-slate-900 text-white">
                  {sub}
                </option>
              ))}
            </select>

            <p className="text-[10px] text-slate-400 leading-tight">
              * በርካታ የትምህርት ክፍሎችን ወይም ተጨማሪ የትምህርት አይነት የሚያስተምሩ ከሆነ ከላይ በመቀያየር ተዛማጅ ስልጠናዎችን መመልከት ይችላሉ።
            </p>
          </div>
        </div>
      </div>

      {/* Completion Toast Notification */}
      {completionNotice && (
        <div className="bg-emerald-900 text-emerald-100 p-3.5 rounded-2xl border border-emerald-500 flex items-center justify-between gap-3 shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <span>{completionNotice}</span>
          </div>
          <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full font-mono font-bold">
            CPD VERIFIED
          </span>
        </div>
      )}

      {/* 2. Filter & Navigation Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Scopes Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setScopeFilter('my_subject')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              scopeFilter === 'my_subject'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>ለኔ ትምህርት የተላኩ ({mySubjectCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setScopeFilter('pedagogy')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              scopeFilter === 'pedagogy'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
            <span>አጠቃላይ ስነ-ዘዴ & CPD ({pedagogyCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setScopeFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              scopeFilter === 'all'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ሁሉንም ስልጠናዎች ({materials.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ስልጠና በቁልፍ ቃል ፈልግ..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
          />
        </div>
      </div>

      {/* 3. Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">ምንም የተገኘ የስልጠና ሰነድ የለም</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            ለዚህ የትምህርት አይነት ወይም የፍለጋ ቃል የተመዘገበ ሰነድ የለም። ከላይ ያለውን "ሁሉንም ስልጠናዎች" በመምረጥ የሌሎች ትምህርቶችን ሰነዶች መመልከት ይችላሉ።
          </p>
          <button
            type="button"
            onClick={() => {
              setScopeFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900 transition-colors"
          >
            ሁሉንም ሰነዶች አሳይ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map((mat) => {
            const isCompleted = completedIds.includes(mat.id);
            const isDirectSubject =
              mat.subject.toLowerCase().includes(selectedSubject.toLowerCase().split(' ')[0]);

            return (
              <div
                key={mat.id}
                onClick={() => handleOpenReading(mat)}
                className={`bg-white rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between cursor-pointer hover:shadow-lg ${
                  isCompleted
                    ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                    : isDirectSubject
                    ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-xs'
                    : 'border-slate-200 shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                        isDirectSubject
                          ? 'bg-amber-100 text-amber-950 border-amber-300'
                          : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                      }`}
                    >
                      {mat.subject}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>ተጠናቋል (Completed)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>አዲስ ሞጁል</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Bureau Authority */}
                  <div>
                    <h3 className="text-sm font-black text-slate-900 leading-snug hover:text-emerald-800 transition-colors">
                      {mat.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{mat.authorDepartment}</span>
                    </p>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200/80 line-clamp-3">
                    {mat.summary}
                  </p>

                  {/* Attached Documents List */}
                  {mat.attachments && mat.attachments.length > 0 && (
                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-2.5 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-950">
                        <span className="flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
                          <span>የተያያዙ የስልጠና ጽሑፎች ({mat.attachments.length})</span>
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium">ለማንበብ ይጫኑ</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {mat.attachments.map((att) => (
                          <button
                            key={att.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewerAttachment(att);
                              setViewerMaterialTitle(mat.title);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-emerald-300 text-slate-800 text-[11px] font-medium hover:bg-emerald-100 hover:border-emerald-500 transition-colors cursor-pointer group shadow-2xs"
                            title={`${att.fileName} - ለማንበብ ይጫኑ`}
                          >
                            <span className="font-bold text-[9px] uppercase px-1 py-0.5 rounded bg-emerald-200 text-emerald-900 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                              {att.fileType}
                            </span>
                            <span className="truncate max-w-[130px] font-semibold">{att.fileName}</span>
                            {att.fileSize && <span className="text-[10px] text-slate-400">({att.fileSize})</span>}
                            <Eye className="w-3 h-3 text-emerald-700 ml-0.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{mat.readTimeMinutes} ደቂቃ ንባብ</span>
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {mat.gradeLevels}
                    </span>
                    {mat.tags?.slice(0, 2).map((t, i) => (
                      <span key={i} className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions Bottom */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleToggleComplete(mat.id, e)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        isCompleted ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    />
                    <span>{isCompleted ? 'ማጠናቀቁን ሰርዝ' : 'አንብቤ ጨርሻለሁ'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadTargetMaterialId(mat.id);
                        setShowUploadModal(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="ተጨማሪ የስልጠና ጽሑፍ / አታችመንት አያይዝ"
                    >
                      <Paperclip className="w-4 h-4 text-emerald-700" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDownloadDocument(mat, e)}
                      className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-1 shadow-xs cursor-pointer border border-amber-600/30"
                      title="የስልጠናውን ጽሑፍ አውርድና አጥና (Download & Study Document)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>አውርድ (Download)</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrint(mat);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="አትም / PDF አውርድ"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenReading(mat)}
                      className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>ስልጠናውን አንብብ</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Full Reading Modal */}
      {activeReading && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header with Bureau Embellishment */}
            <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 p-5 sm:p-6 text-white shrink-0 relative">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-800/80 border border-emerald-400/40 text-[10px] font-bold text-emerald-200">
                    <Building2 className="w-3 h-3 text-emerald-300" />
                    <span>የሻሸመኔ ትምህርት ቢሮ ይፋዊ የስልጠና ሰነድ · {activeReading.authorDepartment}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                    {activeReading.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-200 pt-1 font-medium">
                    <span className="font-bold text-amber-300">የትምህርት አይነት፡ {activeReading.subject}</span>
                    <span>·</span>
                    <span>ደረጃ፡ {activeReading.gradeLevels}</span>
                    <span>·</span>
                    <span>የንባብ ጊዜ፡ {activeReading.readTimeMinutes} ደቂቃ</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveReading(null)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-slate-200 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800 text-xs sm:text-sm leading-relaxed">
              {/* Summary Callout */}
              <div className="bg-amber-50/90 border-l-4 border-amber-500 p-4 rounded-r-2xl">
                <h4 className="font-black text-amber-950 text-xs uppercase tracking-wider mb-1">
                  የስልጠናው ዋና ዓላማና ማጠቃለያ
                </h4>
                <p className="text-amber-900 text-xs sm:text-sm">{activeReading.summary}</p>
              </div>

              {/* Main Content Body */}
              <div className="space-y-3">
                <h4 className="font-black text-slate-900 text-sm border-b border-slate-200 pb-2 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-700" />
                  <span>ተግባራዊ የማስተማሪያ መመሪያና የስልጠና ዝርዝር</span>
                </h4>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 whitespace-pre-line font-normal text-slate-800 leading-loose">
                  {activeReading.fullContent}
                </div>
              </div>

              {/* Key Practical Takeaways Box */}
              <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl space-y-2">
                <h5 className="font-black text-emerald-950 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>በክፍል ውስጥ የሚተገበሩ ተግባራት (Classroom Action Points)</span>
                </h5>
                <ul className="list-disc list-inside space-y-1 text-emerald-900 text-xs">
                  <li>የተማሩትን አዲስ ስነ-ዘዴ በሳምንቱ የመጀመሪያ ክፍለ-ጊዜ ላይ በተግባር መሞከር።</li>
                  <li>የተማሪዎችን አቀባበልና ተሳትፎ በየቀኑ በቤት ስራና በፈተና መለካት።</li>
                  <li>በትምህርት ክፍሉ ሳምንታዊ ስብሰባ (Department Meeting) ላይ ለባልደረቦች ማካፈል።</li>
                </ul>
              </div>

              {/* Official Training Attachments & Documents Section */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-black text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-emerald-700" />
                    <span>የተያያዙ ይፋዊ የስልጠና ጽሑፎችና ሰነዶች (Attachments)</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {activeReading.attachments?.length || 0} ሰነዶች
                    </span>
                  </h5>

                  <button
                    type="button"
                    onClick={() => {
                      setUploadTargetMaterialId(activeReading.id);
                      setShowUploadModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>+ ሰነድ / ጽሑፍ አያይዝ</span>
                  </button>
                </div>

                {activeReading.attachments && activeReading.attachments.length > 0 ? (
                  <div className="space-y-2.5">
                    {activeReading.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="bg-white p-3 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                              {att.fileType}
                            </span>
                            <span className="font-bold text-xs text-slate-900">{att.fileName}</span>
                            {att.fileSize && (
                              <span className="text-[10px] text-slate-400">({att.fileSize})</span>
                            )}
                          </div>
                          {att.description && (
                            <p className="text-[11px] text-slate-600 line-clamp-1">{att.description}</p>
                          )}
                          {att.uploadedAt && (
                            <p className="text-[10px] text-slate-400">
                              የተያያዘበት ቀን፡ {new Date(att.uploadedAt).toLocaleDateString('am-ET')}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setViewerAttachment(att);
                              setViewerMaterialTitle(activeReading.title);
                            }}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>ጽሑፉን አንብብ / ተመልከት</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic bg-white p-3 rounded-xl border border-dashed border-slate-300 text-center">
                    ለዚህ ስልጠና እስካሁን የተያያዘ ተጨማሪ ሰነድ የለም። ከላይ ያለውን "+ ሰነድ / ጽሑፍ አያይዝ" በመጫን አዲስ አታችመንት ማያያዝ ይችላሉ።
                  </p>
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>ፈተና የማውጣት ስልጣን የትምህርት ቢሮ ብቻ ነው።</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleComplete(activeReading.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                    completedIds.includes(activeReading.id)
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-md'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>
                    {completedIds.includes(activeReading.id)
                      ? '✅ ስልጠናው ተጠናቋል (ተመዝግቧል)'
                      : 'ስልጠናውን አንብቤ ጨርሻለሁ / የቢሮ ማረጋገጫ ተቀበል'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadDocument(activeReading)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer border border-amber-600/30"
                  title="የስልጠናውን ጽሑፍ አውርድ (Download Document)"
                >
                  <Download className="w-4 h-4" />
                  <span>ፅሁፉን አውርድ (Download)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePrint(activeReading)}
                  className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>ይህን ሰነድ አትም / PDF</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveReading(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                ዝጋ (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Document Viewer Modal */}
      <TrainingAttachmentViewerModal
        attachment={viewerAttachment}
        materialTitle={viewerMaterialTitle}
        onClose={() => setViewerAttachment(null)}
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
        onAttachmentAdded={(updated) => {
          setMaterials(updated);
          onMaterialsUpdated?.(updated);
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
