import React, { useState, useMemo } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Send,
  Building2,
  Users,
  ShieldCheck,
  Award,
  Filter,
  Search,
  Plus,
  Printer,
  X,
  ChevronRight,
  TrendingUp,
  Sparkles,
  RotateCcw,
  UserCheck,
  Check,
  GraduationCap,
  Lock
} from 'lucide-react';
import {
  Language,
  School,
  StudentRecord,
  AppUserSession,
  AcademicGradeWorkflowBatch,
  AcademicPeriodType,
  GradeApprovalStatus,
  StudentWorkflowGradeItem
} from '../types';
import { translations } from '../data/translations';
import { StorageService } from '../utils/storage';
import { SchoolLogo } from './SchoolLogo';

interface GradeApprovalWorkflowDeskProps {
  currentLang: Language;
  school: School;
  students: StudentRecord[];
  currentUser: AppUserSession | null;
  onRefreshParentState?: () => void;
}

export const GradeApprovalWorkflowDesk: React.FC<GradeApprovalWorkflowDeskProps> = ({
  currentLang,
  school,
  students,
  currentUser,
  onRefreshParentState
}) => {
  const isBureauRole = currentUser?.role === 'bureau_admin' || currentUser?.role === 'bureau_staff';
  const [batches, setBatches] = useState<AcademicGradeWorkflowBatch[]>(() => {
    const all = StorageService.getGradeWorkflows();
    const schoolBatches = all.filter((b) => b.schoolId === school.id || b.schoolName === school.name);
    return schoolBatches.length > 0 ? schoolBatches : all;
  });

  // Filters
  const [activeRolePerspective, setActiveRolePerspective] = useState<
    'all' | 'teacher' | 'homeroom' | 'director' | 'dispatched'
  >(() => {
    if (currentUser?.role === 'school_director') return 'director';
    if (currentUser?.role === 'teacher') return 'teacher';
    return 'all';
  });

  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState<AcademicPeriodType | 'all'>('all');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected batch for detailed inspection or approval modal
  const [selectedBatch, setSelectedBatch] = useState<AcademicGradeWorkflowBatch | null>(null);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [directorNotesInput, setDirectorNotesInput] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal: Create New Grade Submission
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGrade, setNewGrade] = useState<number>(10);
  const [newSection, setNewSection] = useState<string>('A');
  const [newPeriod, setNewPeriod] = useState<AcademicPeriodType>('semester_1');
  const [newSubject, setNewSubject] = useState<string>('Mathematics (ሒሳብ)');
  const [newTeacherName, setNewTeacherName] = useState<string>(
    currentUser?.name || 'መ/ር በፈቃዱ ጥላሁን'
  );
  const [newHomeroomTeacherName, setNewHomeroomTeacherName] = useState<string>(
    'መ/ርት ሰላማዊት ታደሰ (የክፍል ተጠሪ)'
  );
  const [newTeacherNotes, setNewTeacherNotes] = useState<string>('');

  // Refresh batches helper
  const reloadBatches = () => {
    const all = StorageService.getGradeWorkflows();
    const schoolBatches = all.filter((b) => b.schoolId === school.id || b.schoolName === school.name);
    setBatches(schoolBatches.length > 0 ? schoolBatches : all);
    if (onRefreshParentState) onRefreshParentState();
  };

  const getPeriodLabel = (period: AcademicPeriodType): string => {
    switch (period) {
      case 'quarter_1':
        return '1ኛ ሩብ ዓመት (Quarter 1)';
      case 'quarter_2':
        return '2ኛ ሩብ ዓመት (Quarter 2)';
      case 'semester_1':
        return '1ኛ ግማሽ ዓመት (Semester 1)';
      case 'quarter_3':
        return '3ኛ ሩብ ዓመት (Quarter 3)';
      case 'quarter_4':
        return '4ኛ ሩብ ዓመት (Quarter 4)';
      case 'semester_2':
        return '2ኛ ግማሽ ዓመት (Semester 2)';
      case 'annual':
        return 'የሙሉ ዓመት ጠቅላላ (Annual Summary)';
    }
  };

  // Filtered batches
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      // Role Perspective
      if (activeRolePerspective === 'teacher') {
        if (b.status !== 'draft' && b.status !== 'submitted_to_homeroom') return false;
      } else if (activeRolePerspective === 'homeroom') {
        if (b.status !== 'submitted_to_homeroom' && b.status !== 'submitted_to_director') return false;
      } else if (activeRolePerspective === 'director') {
        if (b.status !== 'submitted_to_director' && b.status !== 'director_approved') return false;
      } else if (activeRolePerspective === 'dispatched') {
        if (!b.dispatchedToBureau || b.status !== 'director_approved') return false;
      }

      // Period Filter
      if (selectedPeriodFilter !== 'all' && b.period !== selectedPeriodFilter) return false;

      // Grade Filter
      if (selectedGradeFilter !== 'all' && b.grade.toString() !== selectedGradeFilter) return false;

      // Section Filter
      if (selectedSectionFilter !== 'all' && b.section.toUpperCase() !== selectedSectionFilter.toUpperCase()) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle =
          b.subject.toLowerCase().includes(q) ||
          b.teacherName.toLowerCase().includes(q) ||
          b.homeroomTeacherName.toLowerCase().includes(q) ||
          b.periodLabel.toLowerCase().includes(q) ||
          `grade ${b.grade}`.includes(q) ||
          `ሴክሽን ${b.section}`.includes(q);
        if (!matchTitle) return false;
      }

      return true;
    });
  }, [batches, activeRolePerspective, selectedPeriodFilter, selectedGradeFilter, selectedSectionFilter, searchQuery]);

  // Handle Stage 1 Submission: Teacher -> Homeroom Teacher
  const handleTeacherSubmitToHomeroom = (batch: AcademicGradeWorkflowBatch) => {
    StorageService.submitGradeWorkflowToHomeroom(
      batch.id,
      newTeacherNotes || batch.teacherNotes || 'የተማሪዎች ውጤቶች ተረጋግጠው ለክፍል ተጠሪ ተልከዋል።'
    );
    reloadBatches();
    setSuccessMessage('ውጤቱ ለክፍል ተጠሪው መምህር በስኬት ተልኳል! (Submitted to Homeroom Teacher)');
    setTimeout(() => setSuccessMessage(null), 4000);
    if (selectedBatch?.id === batch.id) {
      setSelectedBatch({
        ...batch,
        status: 'submitted_to_homeroom',
        teacherSubmittedAt: new Date().toISOString()
      });
    }
  };

  // Handle Stage 2 Submission: Homeroom Teacher -> Director
  const handleHomeroomSubmitToDirector = (batch: AcademicGradeWorkflowBatch) => {
    StorageService.submitGradeWorkflowToDirector(
      batch.id,
      feedbackInput || batch.homeroomRemarks || 'የክፍሉ የሁሉም የትምህርት አይነቶች ውጤት፣ ስነ-ምግባርና መገኘት ተጠናቅሮ ለዳይሬክተር ተልኳል።'
    );
    reloadBatches();
    setSuccessMessage('የክፍሉ የተጠናቀረ ውጤት ለዳይሬክተሩ በስኬት ተልኳል! (Submitted to Director)');
    setTimeout(() => setSuccessMessage(null), 4000);
    if (selectedBatch?.id === batch.id) {
      setSelectedBatch({
        ...batch,
        status: 'submitted_to_director',
        homeroomSubmittedAt: new Date().toISOString(),
        homeroomRemarks: feedbackInput || batch.homeroomRemarks
      });
    }
    setFeedbackInput('');
  };

  // Handle Stage 3 Approval: School Director -> Dispatches to Students, Parents, Education Bureau!
  const handleDirectorApprove = (batch: AcademicGradeWorkflowBatch) => {
    const directorName = currentUser?.name || school.principalName || 'አቶ ጉተማ ዋቆ (ዳይሬክተር)';
    const result = StorageService.approveGradeWorkflowByDirector(
      batch.id,
      directorName,
      directorNotesInput || 'ውጤቱ በዳይሬክተር ጽሕፈት ቤት በጥንቃቄ ተገምግሞ ጸድቋል፤ ለወላጆች፣ ለተማሪዎች እና ለከተማው ትምህርት ቢሮ ይፋ ሆኗል።'
    );

    reloadBatches();
    setSuccessMessage(
      `✓ ውጤቱ በዳይሬክተር ጸደቀ! በተማሪ/ወላጅ መግቢያ በር ላይ የእይታ ማሳወቂያ ባጅና የቶስት መልእክት በቅጽበት ተቀስቅሷል፤ ለሻሸመኔ ትምህርት ቢሮም ይፋ ተደርጓል!`
    );
    setTimeout(() => setSuccessMessage(null), 5000);

    if (result.approvedBatch) {
      setSelectedBatch(result.approvedBatch);
    }
    setDirectorNotesInput('');
  };

  // Handle Revision Request
  const handleRequestRevision = (batch: AcademicGradeWorkflowBatch) => {
    if (!feedbackInput.trim()) {
      alert('እባክዎ የማሻሻያ ምክንያት ይጻፉ (Please provide revision feedback)');
      return;
    }
    const requester = currentUser?.name || 'ዳይሬክተር / ክፍል ተጠሪ';
    StorageService.requestGradeWorkflowRevision(batch.id, requester, feedbackInput);
    reloadBatches();
    setSuccessMessage('ማሻሻያ እንዲደረግበት ጥያቄው ተልኳል (Revision requested)');
    setTimeout(() => setSuccessMessage(null), 4000);
    setSelectedBatch(null);
    setFeedbackInput('');
  };

  // Create new batch from student list
  const handleCreateNewBatch = (e: React.FormEvent) => {
    e.preventDefault();

    const targetStudents = students.filter(
      (s) => s.grade === newGrade && s.section.toUpperCase() === newSection.toUpperCase()
    );

    const entries: StudentWorkflowGradeItem[] = targetStudents.map((s, idx) => {
      const matchScore = s.scores.find((sc) => sc.subject.toLowerCase().includes(newSubject.toLowerCase())) || s.scores[0];
      const q1 = matchScore ? matchScore.quiz1 : 9;
      const q2 = matchScore ? matchScore.quiz2 : 9;
      const mid = matchScore ? matchScore.midExam : 26;
      const final = matchScore ? matchScore.finalExam : 44;
      const total = Math.min(100, Math.round(q1 + q2 + mid + final));
      const letter = total >= 90 ? 'A' : total >= 80 ? 'B' : total >= 65 ? 'C' : total >= 50 ? 'D' : 'F';

      return {
        studentId: s.id,
        studentName: s.fullName,
        studentIdNumber: s.studentIdNumber,
        gender: s.gender,
        quiz1: q1,
        quiz2: q2,
        midExam: mid,
        finalExam: final,
        total,
        gradeLetter: letter,
        conduct: s.conduct || 'A',
        attendanceRate: s.attendanceRate || 95,
        rank: idx + 1
      };
    });

    const totalStudents = entries.length;
    const averageScore =
      totalStudents > 0
        ? Number((entries.reduce((a, b) => a + b.total, 0) / totalStudents).toFixed(1))
        : 85;
    const passCount = entries.filter((e) => e.total >= 50).length;
    const failCount = totalStudents - passCount;
    const passRate = totalStudents > 0 ? Number(((passCount / totalStudents) * 100).toFixed(1)) : 100;
    const topEntry = [...entries].sort((a, b) => b.total - a.total)[0];

    const newBatch: AcademicGradeWorkflowBatch = {
      id: `gw-${Date.now()}`,
      schoolId: school.id,
      schoolName: school.name,
      grade: newGrade,
      section: newSection.toUpperCase(),
      academicYear: '2016/2017 ዓ.ም',
      period: newPeriod,
      periodLabel: getPeriodLabel(newPeriod),
      subject: newSubject,
      isCompiledSectionRoster: false,
      teacherName: newTeacherName,
      teacherSubmittedAt: new Date().toISOString(),
      teacherNotes: newTeacherNotes || 'አዲስ የተመዘገበ ውጤት',
      homeroomTeacherName: newHomeroomTeacherName,
      status: 'submitted_to_homeroom', // Directly send to homeroom as per user workflow
      dispatchedToBureau: false,
      totalStudents,
      averageScore,
      passCount,
      failCount,
      passRate,
      topStudentName: topEntry?.studentName || 'ተማሪ',
      topStudentScore: topEntry?.total || 95,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      entries
    };

    StorageService.createGradeWorkflow(newBatch);
    reloadBatches();
    setShowCreateModal(false);
    setSelectedBatch(newBatch);
    setSuccessMessage(`የክፍል ${newGrade}${newSection} የ${newSubject} ውጤት ለክፍል ተጠሪው መምህር በስኬት ተልኳል!`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          1. TOP WELCOME & 3-STAGE WORKFLOW PIPELINE BANNER
         ========================================================================= */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SchoolLogo
                logoUrl={school.logoUrl}
                schoolName={school.name}
                size={52}
                shape="rounded"
                className="ring-2 ring-emerald-400/50 shadow-md"
              />
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[11px] font-bold text-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>ይፋዊ የትምህርት ውጤት መሰብሰብና ማፅደቂያ ስርዓት</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight mt-1">
                  የተማሪዎች ውጤት መሰብሰብና ባለ 3-ደረጃ ማፅደቂያ ዴስክ
                </h2>
                <p className="text-xs text-emerald-100/90 mt-0.5">
                  የሩብ ዓመት (Q1/Q2/Q3/Q4)፣ የግማሽ ዓመት (Sem 1/2) እና ዓመታዊ ጠቅላላ ውጤቶች ከትምህርት መምህር → ወደ ክፍል ተጠሪ → ወደ ዳይሬክተር → ለተማሪ/ወላጅ እና ለትምህርት ቢሮ
                </p>
              </div>
            </div>

            {!isBureauRole ? (
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-lg hover:scale-102 cursor-pointer flex items-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>አዲስ ውጤት አስገባና ላክ (New Grade Submission)</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-amber-500/20 text-amber-200 border border-amber-400/40 rounded-xl text-xs font-bold shrink-0">
                <Lock className="w-4 h-4 text-amber-300" />
                <span>የትምህርት ቢሮ እይታ (ማየት ብቻ - Read-Only)</span>
              </div>
            )}
          </div>

          {/* 3-Stage Progress Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-white/10">
            {/* Stage 1 */}
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                1
              </div>
              <div className="text-xs min-w-0">
                <span className="text-[10px] uppercase font-bold text-amber-300 block">ደረጃ 1፡ መምህር</span>
                <strong className="text-white block truncate">የውጤት ምዝገባና መላክ</strong>
                <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                  የየትምህርቱ መምህራን የተማሪዎችን ውጤት መዝግበው ለክፍል ተጠሪው ይልካሉ።
                </p>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-400 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                2
              </div>
              <div className="text-xs min-w-0">
                <span className="text-[10px] uppercase font-bold text-sky-300 block">ደረጃ 2፡ የክፍል ተጠሪ</span>
                <strong className="text-white block truncate">ማጠናቀርና ለዳይሬክተር መላክ</strong>
                <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                  የክፍል ተጠሪው ሁሉንም ትምህርቶች፣ ስነ-ምግባርና መገኘት አጠናቅሮ ለዳይሬክተር ያቀርባል።
                </p>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-400 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                3
              </div>
              <div className="text-xs min-w-0">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">ደረጃ 3፡ ዳይሬክተር (ይፋ ማድረጊያ)</span>
                <strong className="text-white block truncate">ማፅደቅና ማሰራጨት</strong>
                <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                  ዳይሬክተሩ ሲያጸድቅ በቅጽበት <strong>ለወላጅ፣ ለተማሪ እና ለትምህርት ቢሮ</strong> ይደርሳል!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Bar */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex items-center gap-3 text-emerald-950 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="flex-1">{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
          2. WORKFLOW ROLE PERSPECTIVE & SEARCH CONTROLS
         ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Top Perspective Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>የእይታ ድርሻ፡</span>
          </span>

          <button
            type="button"
            onClick={() => setActiveRolePerspective('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeRolePerspective === 'all'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ሁሉም ሂደቶች ({batches.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveRolePerspective('teacher')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeRolePerspective === 'teacher'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span>1. የመምህር ምዝገባ</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/80 text-slate-900 font-black">
              {batches.filter((b) => b.status === 'draft' || b.status === 'submitted_to_homeroom').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRolePerspective('homeroom')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeRolePerspective === 'homeroom'
                ? 'bg-sky-600 text-white font-black shadow-xs'
                : 'bg-sky-50 text-sky-900 hover:bg-sky-100 border border-sky-200'
            }`}
          >
            <span>2. የክፍል ተጠሪ ማጠቃለያ</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-sky-950 font-black">
              {batches.filter((b) => b.status === 'submitted_to_homeroom' || b.status === 'submitted_to_director').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRolePerspective('director')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeRolePerspective === 'director'
                ? 'bg-teal-700 text-white font-black shadow-xs'
                : 'bg-teal-50 text-teal-900 hover:bg-teal-100 border border-teal-200'
            }`}
          >
            <span>3. የዳይሬክተር ማፅደቂያ ዴስክ</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-teal-950 font-black">
              {batches.filter((b) => b.status === 'submitted_to_director').length} በመጠባበቅ ላይ
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRolePerspective('dispatched')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeRolePerspective === 'dispatched'
                ? 'bg-emerald-700 text-white font-black shadow-xs'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>የጸደቁና ለቢሮ/ወላጅ የተላኩ ({batches.filter((b) => b.status === 'director_approved').length})</span>
          </button>
        </div>

        {/* Filter Controls Bar: Search + Period + Grade + Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="በትምህርት አይነት፣ መምህር ወይም ክፍል ፈልግ..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Period Selector */}
          <div className="relative">
            <select
              value={selectedPeriodFilter}
              onChange={(e) => setSelectedPeriodFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-semibold text-slate-800 focus:outline-hidden"
            >
              <option value="all">ሁሉም የውጤት ወቅቶች (All Periods)</option>
              <option value="quarter_1">1ኛ ሩብ ዓመት (Quarter 1)</option>
              <option value="quarter_2">2ኛ ሩብ ዓመት (Quarter 2)</option>
              <option value="semester_1">1ኛ ግማሽ ዓመት (Semester 1)</option>
              <option value="quarter_3">3ኛ ሩብ ዓመት (Quarter 3)</option>
              <option value="quarter_4">4ኛ ሩብ ዓመት (Quarter 4)</option>
              <option value="semester_2">2ኛ ግማሽ ዓመት (Semester 2)</option>
              <option value="annual">የሙሉ ዓመት ጠቅላላ (Annual)</option>
            </select>
          </div>

          {/* Grade Selector */}
          <div className="relative">
            <select
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-semibold text-slate-800 focus:outline-hidden"
            >
              <option value="all">ሁሉም የክፍል ደረጃዎች</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>

          {/* Section Selector */}
          <div className="relative">
            <select
              value={selectedSectionFilter}
              onChange={(e) => setSelectedSectionFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-semibold text-slate-800 focus:outline-hidden"
            >
              <option value="all">ሁሉም ክፍልፋዮች / Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. BATCHES ROSTER LISTING
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBatches.map((batch) => {
          const isApproved = batch.status === 'director_approved';
          const isPendingDirector = batch.status === 'submitted_to_director';
          const isPendingHomeroom = batch.status === 'submitted_to_homeroom';

          const statusBadge = isApproved ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>በዳይሬክተር የጸደቀ (Approved & Released)</span>
            </span>
          ) : isPendingDirector ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-950 border border-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>ለዳይሬክተር ማፅደቂያ የቀረበ (Pending Director)</span>
            </span>
          ) : isPendingHomeroom ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-sky-100 text-sky-950 border border-sky-300">
              <UserCheck className="w-3.5 h-3.5 text-sky-700" />
              <span>ለክፍል ተጠሪ የተላከ (Pending Homeroom)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-slate-100 text-slate-800 border border-slate-300">
              <span>ረቂቅ (Draft)</span>
            </span>
          );

          return (
            <div
              key={batch.id}
              className={`bg-white rounded-2xl border transition-all shadow-xs p-5 flex flex-col justify-between space-y-4 hover:shadow-md ${
                isApproved
                  ? 'border-emerald-300 ring-1 ring-emerald-200'
                  : isPendingDirector
                  ? 'border-amber-300 ring-1 ring-amber-200'
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Status and Grade/Section */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {batch.academicYear} · {batch.periodLabel}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {batch.subject}
                    </h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-white text-xs font-black shrink-0">
                    Grade {batch.grade}-{batch.section}
                  </span>
                </div>

                {statusBadge}

                {/* Workflow Roles & Signatures Metadata */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">መምህር፡</span>
                    <strong className="text-slate-900 text-[11px]">{batch.teacherName}</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                    <span className="text-slate-500 text-[11px]">የክፍል ተጠሪ፡</span>
                    <strong className="text-slate-900 text-[11px]">{batch.homeroomTeacherName}</strong>
                  </div>
                  {batch.directorName && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                      <span className="text-slate-500 text-[11px]">ዳይሬክተር፡</span>
                      <strong className="text-emerald-950 font-bold text-[11px]">{batch.directorName}</strong>
                    </div>
                  )}
                </div>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">ተማሪዎች</span>
                    <strong className="text-slate-900">{batch.totalStudents}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 block">አማካይ</span>
                    <strong className="text-emerald-950">{batch.averageScore}%</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-teal-50 border border-teal-200">
                    <span className="text-[10px] text-teal-800 block">የማለፍ ምጣኔ</span>
                    <strong className="text-teal-950">{batch.passRate}%</strong>
                  </div>
                </div>

                {/* Digital Seal info if approved */}
                {isApproved && batch.directorApprovalSealNumber && (
                  <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-300 text-[11px] text-emerald-950 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span className="font-mono font-bold text-[10px]">{batch.directorApprovalSealNumber}</span>
                    </div>
                    <span className="text-[9px] font-bold bg-emerald-200/80 px-2 py-0.5 rounded text-emerald-950">
                      ለቢሮ ደርሷል ✓
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBatch(batch)}
                  className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>ውጤት ዝርዝር እይ (View)</span>
                </button>

                {/* Quick Director Approve */}
                {isPendingDirector && (
                  <button
                    type="button"
                    onClick={() => handleDirectorApprove(batch)}
                    className="py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                    title="ዳይሬክተር ሆኖ አጽድቅና ይፋ አድርግ"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>አጽድቅ</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredBatches.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">ምንም የውጤት ማፅደቂያ ሂደት አልተገኘም</h4>
            <p className="text-xs text-slate-500">
              የተመረጠውን ማጣሪያ ይቀይሩ ወይም አዲስ የውጤት ምዝገባ ይጀምሩ።
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveRolePerspective('all');
                setSelectedPeriodFilter('all');
                setSelectedGradeFilter('all');
                setSelectedSectionFilter('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ሁሉንም አሳይ (Reset)</span>
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          4. MODAL: DETAILED ROSTER AUDIT & 3-STAGE APPROVAL DESK
         ========================================================================= */}
      {selectedBatch && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border border-slate-100 space-y-5 my-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <SchoolLogo
                  logoUrl={school.logoUrl}
                  schoolName={school.name}
                  size={52}
                  shape="rounded"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedBatch.academicYear} · {selectedBatch.periodLabel}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                    Grade {selectedBatch.grade}-{selectedBatch.section} · {selectedBatch.subject}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {school.name} · ሻሸመኔ ከተማ አስተዳደር
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBatch(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Workflow Stage Progress Status Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-700">የውጤት ማፅደቅ ሂደት ደረጃ፡</span>
                {selectedBatch.status === 'director_approved' ? (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-950 font-black text-xs rounded-full border border-emerald-300 inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>በዳይሬክተር ጸድቋል · ለተማሪ/ወላጅ እና ለትምህርት ቢሮ ይፋ ሆኗል</span>
                  </span>
                ) : selectedBatch.status === 'submitted_to_director' ? (
                  <span className="px-3 py-1 bg-amber-100 text-amber-950 font-black text-xs rounded-full border border-amber-300 inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>በክፍል ተጠሪ ተጠናቅሮ ለዳይሬክተር ቀርቧል (የዳይሬክተር ማፅደቂያ በመጠባበቅ ላይ)</span>
                  </span>
                ) : selectedBatch.status === 'submitted_to_homeroom' ? (
                  <span className="px-3 py-1 bg-sky-100 text-sky-950 font-black text-xs rounded-full border border-sky-300 inline-flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-sky-700" />
                    <span>በመምህሩ ተመዝግቦ ለክፍል ተጠሪ ተልኳል (የክፍል ተጠሪ ማጠቃለያ በመጠባበቅ ላይ)</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-200 text-slate-800 font-bold text-xs rounded-full">
                    ረቂቅ ውጤት
                  </span>
                )}
              </div>

              {/* 3 Steps Visual Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {/* Step 1 Box */}
                <div className={`p-3 rounded-xl border ${
                  selectedBatch.teacherSubmittedAt
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>1. መምህር፡ {selectedBatch.teacherName}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {selectedBatch.teacherNotes || 'የክፍል ስራና ፈተና ውጤት ተልኳል።'}
                  </p>
                </div>

                {/* Step 2 Box */}
                <div className={`p-3 rounded-xl border ${
                  selectedBatch.homeroomSubmittedAt
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : selectedBatch.status === 'submitted_to_homeroom'
                    ? 'bg-sky-50 border-sky-300 text-sky-950 font-medium'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {selectedBatch.homeroomSubmittedAt ? (
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-sky-700" />
                    )}
                    <span>2. ክፍል ተጠሪ፡ {selectedBatch.homeroomTeacherName}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {selectedBatch.homeroomRemarks || 'ውጤት ማጠቃለያና ስነ-ምግባር ምዘና'}
                  </p>
                </div>

                {/* Step 3 Box */}
                <div className={`p-3 rounded-xl border ${
                  selectedBatch.status === 'director_approved'
                    ? 'bg-emerald-100/90 border-emerald-300 text-emerald-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {selectedBatch.status === 'director_approved' ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-800" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>3. ዳይሬክተር ማፅደቂያ</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {selectedBatch.status === 'director_approved'
                      ? `ጸድቋል፡ ${selectedBatch.directorApprovalSealNumber || 'ይፋ ሆነ'}`
                      : 'የዳይሬክተር ይፋዊ ማፅደቂያ በመጠባበቅ ላይ'}
                  </p>
                </div>
              </div>
            </div>

            {/* Student Marks Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="p-3 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  የተማሪዎች ውጤት ዝርዝር ({selectedBatch.entries.length} ተማሪዎች)
                </span>
                <span className="text-slate-500">
                  አማካይ፡ <strong>{selectedBatch.averageScore}%</strong> · የማለፍ ምጣኔ፡ <strong>{selectedBatch.passRate}%</strong>
                </span>
              </div>

              <div className="overflow-x-auto max-h-72">
                <table className="w-full text-xs text-left min-w-[700px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">ደረጃ</th>
                      <th className="py-2.5 px-3">የተማሪ ስም</th>
                      <th className="py-2.5 px-3">መለያ</th>
                      <th className="py-2.5 px-2">Quiz 1 (10%)</th>
                      <th className="py-2.5 px-2">Quiz 2 (10%)</th>
                      <th className="py-2.5 px-2">Mid (30%)</th>
                      <th className="py-2.5 px-2">Final (50%)</th>
                      <th className="py-2.5 px-2">ድምር (100%)</th>
                      <th className="py-2.5 px-2 text-center">ደረጃ</th>
                      <th className="py-2.5 px-2 text-center">ስነ-ምግባር</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedBatch.entries.map((st, i) => (
                      <tr key={st.studentId || i} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-black text-emerald-900">
                          #{st.rank || i + 1}
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-900">
                          {st.studentName}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-500 text-[10px]">
                          {st.studentIdNumber}
                        </td>
                        <td className="py-2 px-2">{st.quiz1}</td>
                        <td className="py-2 px-2">{st.quiz2}</td>
                        <td className="py-2 px-2">{st.midExam}</td>
                        <td className="py-2 px-2">{st.finalExam}</td>
                        <td className="py-2 px-2 font-black text-slate-900">{st.total}</td>
                        <td className="py-2 px-2 text-center font-bold text-emerald-800">
                          {st.gradeLetter}
                        </td>
                        <td className="py-2 px-2 text-center font-bold text-slate-700">
                          {st.conduct || 'A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Workflow Actions Section: Depending on Current Stage */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                የማፅደቅና የማስተላለፍ ተግባራት (Workflow Actions)
              </h4>

              {isBureauRole && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-950 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>
                    የትምህርት ቢሮ እይታ (ማየት ብቻ - Read-Only)፡ የውጤት ምዝገባ፣ ማጠናቀርና ማፅደቅ የትምህርት ቤቱ መምህራንና ዳይሬክተር ስልጣን ብቻ ነው። ቢሮው የተላከውን ውጤት ለማየትና ለመገምገም ብቻ ፍቃድ አለው፤ ውጤት መቀየር ወይም ማሻሻል አይቻልም።
                  </span>
                </div>
              )}

              {/* Stage 1 action: If Draft / Resubmit to Homeroom */}
              {!isBureauRole && selectedBatch.status === 'draft' && (
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-600">
                    ውጤቱ ለመምህሩ ዝግጁ ሆኗል። ለክፍል ተጠሪው መምህር ይላኩ፡
                  </p>
                  <button
                    type="button"
                    onClick={() => handleTeacherSubmitToHomeroom(selectedBatch)}
                    className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ለክፍል ተጠሪ መምህር ላክ</span>
                  </button>
                </div>
              )}

              {/* Stage 2 action: Homeroom Teacher Reviews and Submits to Director */}
              {!isBureauRole && selectedBatch.status === 'submitted_to_homeroom' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">
                    ይህ ውጤት ለክፍል ተጠሪው ቀርቧል። የክፍሉን ማጠቃለያ አስተያየት በማከል ለት/ቤቱ ዳይሬክተር ያስተላልፉ፡
                  </p>
                  <input
                    type="text"
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="የክፍል ተጠሪ ማጠቃለያ አስተያየት (ለምሳሌ፡ የተማሪዎች መገኘትና ስነ-ምግባር ተረጋግጧል)..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-hidden"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleRequestRevision(selectedBatch)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                    >
                      ማሻሻያ ለመምህሩ መልስ
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHomeroomSubmitToDirector(selectedBatch)}
                      className="px-4 py-2 bg-gradient-to-r from-sky-600 to-teal-700 hover:from-sky-500 hover:to-teal-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>ለዳይሬክተር ማፅደቂያ ላክ (Forward to Director)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Stage 3 action: Director Final Approval & Official Dispatch */}
              {!isBureauRole && selectedBatch.status === 'submitted_to_director' && (
                <div className="space-y-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-amber-800" />
                    <span>የዳይሬክተር ይፋዊ ማፅደቂያ (Executive Approval Desk)</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    ዳይሬክተሩ ይህንን ውጤት ሲያፀድቁ፡ <strong>ለተማሪዎች እና ለወላጆች</strong> በፖርታላቸው ይፋ ይሆናል፤ እንዲሁም ለ<strong>ሻሸመኔ ከተማ ትምህርት ቢሮ</strong> በራስ-ሰር ይላካል።
                  </p>
                  <input
                    type="text"
                    value={directorNotesInput}
                    onChange={(e) => setDirectorNotesInput(e.target.value)}
                    placeholder="የዳይሬክተር ይፋዊ የይሁንታ አስተያየት..."
                    className="w-full px-3 py-2 text-xs border border-amber-300 rounded-xl bg-white focus:outline-hidden"
                  />
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleRequestRevision(selectedBatch)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                    >
                      ማሻሻያ ጠይቅ (Request Revision)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDirectorApprove(selectedBatch)}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black transition-all shadow-lg flex items-center gap-2 cursor-pointer hover:scale-102"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>አጽድቅና ይፋ አድርግ (Approve & Officially Release)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* If Already Approved by Director: Show Proof of Propagation */}
              {selectedBatch.status === 'director_approved' && (
                <div className="p-3 bg-emerald-100/70 border border-emerald-300 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-950 font-black">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>ውጤቱ በዳይሬክተሩ ጸድቆ ህጋዊ ማህተም አግኝቷል!</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-emerald-900 pt-1">
                    <div>
                      ✓ <strong>ለወላጅና ተማሪ፡</strong> በፖርታል የውጤት ካርድ ላይ ይፋ ሆኗል።
                    </div>
                    <div>
                      ✓ <strong>ለትምህርት ቢሮ፡</strong> በማዕከላዊ ሰርቨር ተመዝግቧል (ማህተም: {selectedBatch.directorApprovalSealNumber})።
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>ይፋዊ የክፍል ሰነድ አትም (Print Roster)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBatch(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                ዝጋ (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. MODAL: CREATE NEW GRADE SUBMISSION (TEACHER ENTRY)
         ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 my-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    አዲስ የተማሪዎች ውጤት መመዝገቢያ
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    ደረጃ 1፡ መምህሩ ውጤቱን ለክፍል ተጠሪ መምህር የሚያስተላልፍበት
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewBatch} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ክፍል (Grade) *</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-800"
                  >
                    <option value={9}>Grade 9</option>
                    <option value={10}>Grade 10</option>
                    <option value={11}>Grade 11</option>
                    <option value={12}>Grade 12</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ክፍልፋይ (Section) *</label>
                  <select
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-800"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">የትምህርት አይነት (Subject) *</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-800"
                >
                  <option value="Mathematics (ሒሳብ)">Mathematics (ሒሳብ)</option>
                  <option value="English (እንግሊዝኛ)">English (እንግሊዝኛ)</option>
                  <option value="Physics (ፊዚክስ)">Physics (ፊዚክስ)</option>
                  <option value="Chemistry (ኬሚስትሪ)">Chemistry (ኬሚስትሪ)</option>
                  <option value="Biology (ባዮሎጂ)">Biology (ባዮሎጂ)</option>
                  <option value="Afaan Oromoo (ኦሮሚኛ)">Afaan Oromoo (ኦሮሚኛ)</option>
                  <option value="Citizenship (ስነ-ዜጋ)">Citizenship (ስነ-ዜጋ)</option>
                  <option value="የተጠናቀረ የክፍሉ ውጤት (All Subjects)">የተጠናቀረ የክፍሉ ውጤት (All Subjects)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">የውጤት ወቅት (Assessment Period) *</label>
                <select
                  value={newPeriod}
                  onChange={(e) => setNewPeriod(e.target.value as AcademicPeriodType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-800"
                >
                  <option value="quarter_1">1ኛ ሩብ ዓመት (Quarter 1)</option>
                  <option value="quarter_2">2ኛ ሩብ ዓመት (Quarter 2)</option>
                  <option value="semester_1">1ኛ ግማሽ ዓመት (Semester 1)</option>
                  <option value="quarter_3">3ኛ ሩብ ዓመት (Quarter 3)</option>
                  <option value="quarter_4">4ኛ ሩብ ዓመት (Quarter 4)</option>
                  <option value="semester_2">2ኛ ግማሽ ዓመት (Semester 2)</option>
                  <option value="annual">የሙሉ ዓመት ጠቅላላ (Annual Summary)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">የመምህሩ ሙሉ ስም *</label>
                <input
                  type="text"
                  required
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ውጤቱን የሚረከበው የክፍል ተጠሪ መምህር *</label>
                <input
                  type="text"
                  required
                  value={newHomeroomTeacherName}
                  onChange={(e) => setNewHomeroomTeacherName(e.target.value)}
                  placeholder="የክፍል ተጠሪ መምህር ስም..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">የመምህሩ አስተያየት / ማስታወሻ</label>
                <textarea
                  rows={2}
                  value={newTeacherNotes}
                  onChange={(e) => setNewTeacherNotes(e.target.value)}
                  placeholder="ስለ ውጤቱ ማጠቃለያ ማስታወሻ..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-snug">
                ውጤቱ ሲላክ በቀጥታ ወደ <strong>ደረጃ 2 (የክፍል ተጠሪ መምህር)</strong> ይተላለፋል፤ ክፍል ተጠሪው አረጋግጦ ለ<strong>ዳይሬክተር</strong> ያስተላልፋል፤ ዳይሬክተሩ ሲያፀድቅ ለተማሪ/ወላጅ እና ለትምህርት ቢሮ ይደርሳል።
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-700 hover:to-teal-800 text-white font-black rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ውጤቱን ለክፍል ተጠሪ ላክ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
