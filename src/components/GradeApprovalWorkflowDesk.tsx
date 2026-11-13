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
import { getLocalizedGradeWorkflows } from '../utils/localizedData';
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

  const isOm = currentLang === 'om';
  const isEn = currentLang === 'en';
  const t3 = (om: string, en: string, am: string) => (isOm ? om : isEn ? en : am);

  const getSubjectDisplay = (subj: string) => {
    const s = subj.toLowerCase();
    if (s.includes('all subjects') || subj.includes('የተጠናቀረ')) {
      return t3('Qabxii Kutaa Walitti Qabame (Gosa Barnootaa Hunda)', 'Compiled Class Grades (All Subjects)', 'የተጠናቀረ የክፍሉ ውጤት (All Subjects)');
    }
    if (s.includes('math')) return t3('Herrega (Mathematics)', 'Mathematics', 'Mathematics (ሒሳብ)');
    if (s.includes('eng')) return t3('Afaan Ingilizii (English)', 'English', 'English (እንግሊዝኛ)');
    if (s.includes('phys')) return t3('Fiiziksii (Physics)', 'Physics', 'Physics (ፊዚክስ)');
    if (s.includes('chem')) return t3('Keemistirii (Chemistry)', 'Chemistry', 'Chemistry (ኬሚስትሪ)');
    if (s.includes('bio')) return t3('Baayoloojii (Biology)', 'Biology', 'Biology (ባዮሎጂ)');
    if (s.includes('orom')) return t3('Afaan Oromoo', 'Afaan Oromoo', 'Afaan Oromoo (ኦሮሚኛ)');
    if (s.includes('citizen')) return t3('Lammummaa (Citizenship)', 'Citizenship', 'Citizenship (ስነ-ዜጋ)');
    return subj;
  };

  // Selected batch for detailed inspection or approval modal
  const [selectedBatch, setSelectedBatch] = useState<AcademicGradeWorkflowBatch | null>(null);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [directorNotesInput, setDirectorNotesInput] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal: Create New Grade Submission
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGrade, setNewGrade] = useState<number>(10);
  const [newSection, setNewSection] = useState<string>('A');
  const [newPeriod, setNewPeriod] = useState<AcademicPeriodType>('semester_1');
  const [newSubject, setNewSubject] = useState<string>('Mathematics (ሒሳብ)');
  const [newTeacherName, setNewTeacherName] = useState<string>(
    currentUser?.name || t3('Barsiisaa Bafaqaaduu Xilaahun', 'Teacher Befekadu Tilahun', 'መ/ር በፈቃዱ ጥላሁን')
  );
  const [newHomeroomTeacherName, setNewHomeroomTeacherName] = useState<string>(() =>
    t3('Barsiistuu Salaamaawit Taaddasaa (Itti Gaafatamtuu Kutaa)', 'Teacher Selamawit Tadesse (Homeroom)', 'መ/ርት ሰላማዊት ታደሰ (የክፍል ተጠሪ)')
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
        return t3('Kurmaana 1ffaa (Quarter 1)', 'Quarter 1', '1ኛ ሩብ ዓመት (Quarter 1)');
      case 'quarter_2':
        return t3('Kurmaana 2ffaa (Quarter 2)', 'Quarter 2', '2ኛ ሩብ ዓመት (Quarter 2)');
      case 'semester_1':
        return t3('Semisteera 1ffaa (Semester 1)', 'Semester 1', '1ኛ ግማሽ ዓመት (Semester 1)');
      case 'quarter_3':
        return t3('Kurmaana 3ffaa (Quarter 3)', 'Quarter 3', '3ኛ ሩብ ዓመት (Quarter 3)');
      case 'quarter_4':
        return t3('Kurmaana 4ffaa (Quarter 4)', 'Quarter 4', '4ኛ ሩብ ዓመት (Quarter 4)');
      case 'semester_2':
        return t3('Semisteera 2ffaa (Semester 2)', 'Semester 2', '2ኛ ግማሽ ዓመት (Semester 2)');
      case 'annual':
        return t3('Waliigala Waggaa (Annual Summary)', 'Annual Summary', 'የሙሉ ዓመት ጠቅላላ (Annual Summary)');
    }
  };

  const localizedBatches = useMemo(
    () => getLocalizedGradeWorkflows(batches, currentLang),
    [batches, currentLang]
  );

  // Filtered batches
  const filteredBatches = useMemo(() => {
    return localizedBatches.filter((b) => {
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
          getSubjectDisplay(b.subject).toLowerCase().includes(q) ||
          b.teacherName.toLowerCase().includes(q) ||
          b.homeroomTeacherName.toLowerCase().includes(q) ||
          b.periodLabel.toLowerCase().includes(q) ||
          `grade ${b.grade}`.includes(q) ||
          `kutaa ${b.grade}`.includes(q) ||
          `ሴክሽን ${b.section}`.toLowerCase().includes(q);
        if (!matchTitle) return false;
      }

      return true;
    });
  }, [localizedBatches, activeRolePerspective, selectedPeriodFilter, selectedGradeFilter, selectedSectionFilter, searchQuery, currentLang]);

  // Handle Stage 1 Submission: Teacher -> Homeroom Teacher
  const handleTeacherSubmitToHomeroom = (batch: AcademicGradeWorkflowBatch) => {
    setErrorMessage(null);
    StorageService.submitGradeWorkflowToHomeroom(
      batch.id,
      newTeacherNotes ||
        batch.teacherNotes ||
        t3(
          'Qabxiin barattootaa mirkanaa\'ee itti gaafatamaa kutaatiif ergameera.',
          'Student grades verified and submitted to homeroom teacher.',
          'የተማሪዎች ውጤቶች ተረጋግጠው ለክፍል ተጠሪ ተልከዋል።'
        )
    );
    reloadBatches();
    setSuccessMessage(
      t3(
        'Qabxiin gara barsiisaa itti gaafatamaa kutaatti milkaa\'inaan ergameera!',
        'Grades successfully submitted to the Homeroom Teacher!',
        'ውጤቱ ለክፍል ተጠሪው መምህር በስኬት ተልኳል! (Submitted to Homeroom Teacher)'
      )
    );
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
    setErrorMessage(null);
    StorageService.submitGradeWorkflowToDirector(
      batch.id,
      feedbackInput ||
        batch.homeroomRemarks ||
        t3(
          'Qabxiin gosa barnootaa hundaa, naamusa fi argamuun kutaa qindaa\'ee daayirektaraaf ergameera.',
          'All subjects, conduct, and attendance compiled and forwarded to Director.',
          'የክፍሉ የሁሉም የትምህርት አይነቶች ውጤት፣ ስነ-ምግባርና መገኘት ተጠናቅሮ ለዳይሬክተር ተልኳል።'
        )
    );
    reloadBatches();
    setSuccessMessage(
      t3(
        'Qabxiin kutaa walitti qabame gara Daayirektaraatti milkaa\'inaan ergameera!',
        'Compiled class grades successfully forwarded to the Director!',
        'የክፍሉ የተጠናቀረ ውጤት ለዳይሬክተሩ በስኬት ተልኳል! (Submitted to Director)'
      )
    );
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
    setErrorMessage(null);
    const directorName = currentUser?.name || school.principalName || t3('Obbo Guttamaa Waaqoo (Daayirektara)', 'Mr. Gutema Wako (Director)', 'አቶ ጉተማ ዋቆ (ዳይሬክተር)');
    const result = StorageService.approveGradeWorkflowByDirector(
      batch.id,
      directorName,
      directorNotesInput ||
        t3(
          'Qabxiin waajjira daayirektaraatiin sakatta\'amee mirkanaa\'eera; maatiif, barattootaaf fi Biiroo Barnootaatiif ifoomera.',
          'Reviewed and approved by Director Office; published to parents, students, and Education Bureau.',
          'ውጤቱ በዳይሬክተር ጽሕፈት ቤት በጥንቃቄ ተገምግሞ ጸድቋል፤ ለወላጆች፣ ለተማሪዎች እና ለከተማው ትምህርት ቢሮ ይፋ ሆኗል።'
        )
    );

    reloadBatches();
    setSuccessMessage(
      t3(
        '✓ Qabxiin Daayirektaraan mirkanaa\'eera! Poortaala barataa/maatii irratti beeksisni bahee Biiroo Barnootaa Shaashamanneetiif ergameera!',
        '✓ Approved by Director! Student/Parent portal alerts triggered and dispatched to Shashemene Education Bureau!',
        '✓ ውጤቱ በዳይሬክተር ጸደቀ! በተማሪ/ወላጅ መግቢያ በር ላይ የእይታ ማሳወቂያ ባጅና የቶስት መልእክት በቅጽበት ተቀስቅሷል፤ ለሻሸመኔ ትምህርት ቢሮም ይፋ ተደርጓል!'
      )
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
      setErrorMessage(
        t3(
          'Maaloo sababa sirreeffamaa barreessaa.',
          'Please provide revision feedback.',
          'እባክዎ የማሻሻያ ምክንያት ይጻፉ።'
        )
      );
      return;
    }
    setErrorMessage(null);
    const requester = currentUser?.name || t3('Daayirektara / Itti Gaafatamaa Kutaa', 'Director / Homeroom Teacher', 'ዳይሬክተር / ክፍል ተጠሪ');
    StorageService.requestGradeWorkflowRevision(batch.id, requester, feedbackInput);
    reloadBatches();
    setSuccessMessage(
      t3(
        'Gaaffiin sirreeffamaa ergameera.',
        'Revision request sent.',
        'ማሻሻያ እንዲደረግበት ጥያቄው ተልኳል (Revision requested)'
      )
    );
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
      academicYear: t3('2016/2017 A.L.I', '2024/2025 AY', '2016/2017 ዓ.ም'),
      period: newPeriod,
      periodLabel: getPeriodLabel(newPeriod),
      subject: newSubject,
      isCompiledSectionRoster: false,
      teacherName: newTeacherName,
      teacherSubmittedAt: new Date().toISOString(),
      teacherNotes: newTeacherNotes || t3('Qabxii haaraa galmaa\'e', 'Newly recorded grades', 'አዲስ የተመዘገበ ውጤት'),
      homeroomTeacherName: newHomeroomTeacherName,
      status: 'submitted_to_homeroom', // Directly send to homeroom as per user workflow
      dispatchedToBureau: false,
      totalStudents,
      averageScore,
      passCount,
      failCount,
      passRate,
      topStudentName: topEntry?.studentName || t3('Barataa', 'Student', 'ተማሪ'),
      topStudentScore: topEntry?.total || 95,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      entries
    };

    StorageService.createGradeWorkflow(newBatch);
    reloadBatches();
    setShowCreateModal(false);
    setSelectedBatch(newBatch);
    setSuccessMessage(
      t3(
        `Qabxiin ${getSubjectDisplay(newSubject)} Kutaa ${newGrade}${newSection} gara barsiisaa itti gaafatamaa kutaatti milkaa'inaan ergameera!`,
        `Grade ${newGrade}${newSection} ${getSubjectDisplay(newSubject)} grades submitted to Homeroom Teacher!`,
        `የክፍል ${newGrade}${newSection} የ${newSubject} ውጤት ለክፍል ተጠሪው መምህር በስኬት ተልኳል!`
      )
    );
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
                  <span>{t3('Sirna Walitti Qabuu fi Mirkaneessa Qabxii Seeraa', 'Official Grade Collection & Approval System', 'ይፋዊ የትምህርት ውጤት መሰብሰብና ማፅደቂያ ስርዓት')}</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight mt-1">
                  {t3('Deeskii Walitti Qabuu fi Mirkaneessa Qabxii Sadarkaa-3', '3-Stage Student Grade Approval Desk', 'የተማሪዎች ውጤት መሰብሰብና ባለ 3-ደረጃ ማፅደቂያ ዴስክ')}
                </h2>
                <p className="text-xs text-emerald-100/90 mt-0.5">
                  {t3(
                    'Qabxiin Kurmaanaa (Q1-Q4), Semisteeraa (Sem 1/2) fi Waliigala Waggaa: Barsiisaa → Itti Gaafatamaa Kutaa → Daayirektara → Barataa/Maatii fi Biiroo Barnootaa',
                    'Quarter (Q1-Q4), Semester (Sem 1/2), and Annual grades flow: Subject Teacher → Homeroom Teacher → Director → Student/Parent & Education Bureau',
                    'የሩብ ዓመት (Q1/Q2/Q3/Q4)፣ የግማሽ ዓመት (Sem 1/2) እና ዓመታዊ ጠቅላላ ውጤቶች ከትምህርት መምህር → ወደ ክፍል ተጠሪ → ወደ ዳይሬክተር → ለተማሪ/ወላጅ እና ለትምህርት ቢሮ'
                  )}
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
                <span>{t3('Qabxii Haaraa Galmeessi & Ergi', 'New Grade Submission', 'አዲስ ውጤት አስገባና ላክ (New Grade Submission)')}</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-amber-500/20 text-amber-200 border border-amber-400/40 rounded-xl text-xs font-bold shrink-0">
                <Lock className="w-4 h-4 text-amber-300" />
                <span>{t3('Ilaalcha Biiroo Barnootaa (Ilaaluu Qofa)', 'Bureau View (Read-Only)', 'የትምህርት ቢሮ እይታ (ማየት ብቻ - Read-Only)')}</span>
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
                <span className="text-[10px] uppercase font-bold text-amber-300 block">{t3('Sadarkaa 1: Barsiisaa', 'Stage 1: Teacher', 'ደረጃ 1፡ መምህር')}</span>
                <strong className="text-white block truncate">{t3('Galmee Qabxii fi Erguu', 'Record & Submit Grades', 'የውጤት ምዝገባና መላክ')}</strong>
                <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                  {t3(
                    'Barsiisonni gosa barnootaa qabxii barattootaa galmeessanii itti gaafatamaa kutaatiif ergu.',
                    'Subject teachers record student scores and submit to the homeroom teacher.',
                    'የየትምህርቱ መምህራን የተማሪዎችን ውጤት መዝግበው ለክፍል ተጠሪው ይልካሉ።'
                  )}
                </p>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-400 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                2
              </div>
              <div className="text-xs min-w-0">
                <span className="text-[10px] uppercase font-bold text-sky-300 block">{t3('Sadarkaa 2: Itti Gaafatamaa Kutaa', 'Stage 2: Homeroom', 'ደረጃ 2፡ የክፍል ተጠሪ')}</span>
                <strong className="text-white block truncate">{t3('Qindeessuu fi Daayirektaraaf Erguu', 'Compile & Forward', 'ማጠናቀርና ለዳይሬክተር መላክ')}</strong>
                <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                  {t3(
                    'Itti gaafatamaan kutaa barnoota hunda, naamusa fi argamuu qindeessee daayirektaraaf dhiyeessa.',
                    'Homeroom teacher compiles all subjects, conduct, and attendance for the Director.',
                    'የክፍል ተጠሪው ሁሉንም ትምህርቶች፣ ስነ-ምግባርና መገኘት አጠናቅሮ ለዳይሬክተር ያቀርባል።'
                  )}
                </p>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-400 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                3
              </div>
              <div className="text-xs min-w-0">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">{t3('Sadarkaa 3: Daayirektara (Ifoomsa)', 'Stage 3: Director (Release)', 'ደረጃ 3፡ ዳይሬክተር (ይፋ ማድረጊያ)')}</span>
                <strong className="text-white block truncate">{t3('Mirkaneessuu fi Raabsuu', 'Approve & Dispatch', 'ማፅደቅና ማሰራጨት')}</strong>
                <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                  {isOm ? (
                    <>Daayirektarri yoo mirkaneessu battalumatti <strong>Maatii, Barataa fi Biiroo Barnootaa</strong> qaqqaba!</>
                  ) : isEn ? (
                    <>Once approved by Director, results instantly reach <strong>Parents, Students & Education Bureau</strong>!</>
                  ) : (
                    <>ዳይሬክተሩ ሲያጸድቅ በቅጽበት <strong>ለወላጅ፣ ለተማሪ እና ለትምህርት ቢሮ</strong> ይደርሳል!</>
                  )}
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

      {/* Error Notification Bar */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-center gap-3 text-rose-950 text-xs font-bold animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="flex-1">{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-700 hover:text-rose-900"
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
            <span>{t3('Gahee Ilaalchaa:', 'Role View:', 'የእይታ ድርሻ፡')}</span>
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
            {t3('Adeemsaalee Hunda', 'All Workflows', 'ሁሉም ሂደቶች')} ({batches.length})
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
            <span>{t3('1. Galmee Barsiisaa', '1. Teacher Submission', '1. የመምህር ምዝገባ')}</span>
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
            <span>{t3('2. Cuunfaa Itti Gaafatamaa Kutaa', '2. Homeroom Summary', '2. የክፍል ተጠሪ ማጠቃለያ')}</span>
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
            <span>{t3('3. Deeskii Mirkaneessa Daayirektaraa', '3. Director Approval Desk', '3. የዳይሬክተር ማፅደቂያ ዴስክ')}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-teal-950 font-black">
              {batches.filter((b) => b.status === 'submitted_to_director').length} {t3('Eegaa jiru', 'Pending', 'በመጠባበቅ ላይ')}
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
            <span>{t3('Kan Mirkanaa\'anii fi Biiroo/Maatiif Ergaman', 'Approved & Dispatched', 'የጸደቁና ለቢሮ/ወላጅ የተላኩ')} ({batches.filter((b) => b.status === 'director_approved').length})</span>
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
              placeholder={t3('Gosa barnootaa, barsiisaa ykn kutaan barbaadi...', 'Search by subject, teacher, or grade...', 'በትምህርት አይነት፣ መምህር ወይም ክፍል ፈልግ...')}
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
              <option value="all">{t3('Yeroo Qabxii Hunda (All Periods)', 'All Assessment Periods', 'ሁሉም የውጤት ወቅቶች (All Periods)')}</option>
              <option value="quarter_1">{getPeriodLabel('quarter_1')}</option>
              <option value="quarter_2">{getPeriodLabel('quarter_2')}</option>
              <option value="semester_1">{getPeriodLabel('semester_1')}</option>
              <option value="quarter_3">{getPeriodLabel('quarter_3')}</option>
              <option value="quarter_4">{getPeriodLabel('quarter_4')}</option>
              <option value="semester_2">{getPeriodLabel('semester_2')}</option>
              <option value="annual">{getPeriodLabel('annual')}</option>
            </select>
          </div>

          {/* Grade Selector */}
          <div className="relative">
            <select
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-semibold text-slate-800 focus:outline-hidden"
            >
              <option value="all">{t3('Sadarkaa Kutaa Hunda', 'All Grade Levels', 'ሁሉም የክፍል ደረጃዎች')}</option>
              <option value="9">{t3('Kutaa 9', 'Grade 9', 'Grade 9')}</option>
              <option value="10">{t3('Kutaa 10', 'Grade 10', 'Grade 10')}</option>
              <option value="11">{t3('Kutaa 11', 'Grade 11', 'Grade 11')}</option>
              <option value="12">{t3('Kutaa 12', 'Grade 12', 'Grade 12')}</option>
            </select>
          </div>

          {/* Section Selector */}
          <div className="relative">
            <select
              value={selectedSectionFilter}
              onChange={(e) => setSelectedSectionFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-semibold text-slate-800 focus:outline-hidden"
            >
              <option value="all">{t3('Gareewwan Hunda / Sections', 'All Sections', 'ሁሉም ክፍልፋዮች / Sections')}</option>
              <option value="A">{t3('Garee A (Section A)', 'Section A', 'Section A')}</option>
              <option value="B">{t3('Garee B (Section B)', 'Section B', 'Section B')}</option>
              <option value="C">{t3('Garee C (Section C)', 'Section C', 'Section C')}</option>
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
              <span>{t3('Daayirektaraan Mirkanaa\'e (Released)', 'Approved & Released', 'በዳይሬክተር የጸደቀ (Approved & Released)')}</span>
            </span>
          ) : isPendingDirector ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-950 border border-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>{t3('Mirkaneessa Daayirektaraa Eegaa jira', 'Pending Director Approval', 'ለዳይሬክተር ማፅደቂያ የቀረበ (Pending Director)')}</span>
            </span>
          ) : isPendingHomeroom ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-sky-100 text-sky-950 border border-sky-300">
              <UserCheck className="w-3.5 h-3.5 text-sky-700" />
              <span>{t3('Itti Gaafatamaa Kutaaf Ergame', 'Pending Homeroom', 'ለክፍል ተጠሪ የተላከ (Pending Homeroom)')}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-slate-100 text-slate-800 border border-slate-300">
              <span>{t3('Wixinee (Draft)', 'Draft', 'ረቂቅ (Draft)')}</span>
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
                      {batch.academicYear} · {getPeriodLabel(batch.period)}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {getSubjectDisplay(batch.subject)}
                    </h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-white text-xs font-black shrink-0">
                    {t3('Kutaa', 'Grade', 'Grade')} {batch.grade}-{batch.section}
                  </span>
                </div>

                {statusBadge}

                {/* Workflow Roles & Signatures Metadata */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">{t3('Barsiisaa:', 'Teacher:', 'መምህር፡')}</span>
                    <strong className="text-slate-900 text-[11px]">{batch.teacherName}</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                    <span className="text-slate-500 text-[11px]">{t3('Itti Gaafatamaa Kutaa:', 'Homeroom:', 'የክፍል ተጠሪ፡')}</span>
                    <strong className="text-slate-900 text-[11px]">{batch.homeroomTeacherName}</strong>
                  </div>
                  {batch.directorName && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                      <span className="text-slate-500 text-[11px]">{t3('Daayirektara:', 'Director:', 'ዳይሬክተር፡')}</span>
                      <strong className="text-emerald-950 font-bold text-[11px]">{batch.directorName}</strong>
                    </div>
                  )}
                </div>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">{t3('Barattoota', 'Students', 'ተማሪዎች')}</span>
                    <strong className="text-slate-900">{batch.totalStudents}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 block">{t3('Giddugaleessa', 'Average', 'አማካይ')}</span>
                    <strong className="text-emerald-950">{batch.averageScore}%</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-teal-50 border border-teal-200">
                    <span className="text-[10px] text-teal-800 block">{t3('Reetii Darbuu', 'Pass Rate', 'የማለፍ ምጣኔ')}</span>
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
                      {t3('Biiroo Qaqqabeera ✓', 'Sent to Bureau ✓', 'ለቢሮ ደርሷል ✓')}
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
                  <span>{t3('Bal\'ina Qabxii Ilaali', 'View Details', 'ውጤት ዝርዝር እይ (View)')}</span>
                </button>

                {/* Quick Director Approve */}
                {!isBureauRole && isPendingDirector && (
                  <button
                    type="button"
                    onClick={() => handleDirectorApprove(batch)}
                    className="py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                    title={t3('Akka Daayirektaraatti Mirkaneessii Ifoomsi', 'Approve & Release as Director', 'ዳይሬክተር ሆኖ አጽድቅና ይፋ አድርግ')}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{t3('Mirkaneessi', 'Approve', 'አጽድቅ')}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredBatches.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">{t3('Adeemsi mirkaneessa qabxii homtuu hin argamne', 'No Grade Approval Workflows Found', 'ምንም የውጤት ማፅደቂያ ሂደት አልተገኘም')}</h4>
            <p className="text-xs text-slate-500">
              {t3(
                'Calaltuu filatame jijjiiraa ykn galmee qabxii haaraa jalqabaa.',
                'Adjust your filters or start a new grade submission.',
                'የተመረጠውን ማጣሪያ ይቀይሩ ወይም አዲስ የውጤት ምዝገባ ይጀምሩ።'
              )}
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
              <span>{t3('Hunda Agarsiisi (Reset)', 'Show All (Reset)', 'ሁሉንም አሳይ (Reset)')}</span>
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
                    {selectedBatch.academicYear} · {getPeriodLabel(selectedBatch.period)}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                    {t3('Kutaa', 'Grade', 'Grade')} {selectedBatch.grade}-{selectedBatch.section} · {getSubjectDisplay(selectedBatch.subject)}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {school.name} · {t3('Bulchiinsa Magaalaa Shaashamannee', 'Shashemene City Administration', 'ሻሸመኔ ከተማ አስተዳደር')}
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
                <span className="text-xs font-bold text-slate-700">{t3('Sadarkaa Adeemsa Mirkaneessa Qabxii:', 'Grade Approval Stage:', 'የውጤት ማፅደቅ ሂደት ደረጃ፡')}</span>
                {selectedBatch.status === 'director_approved' ? (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-950 font-black text-xs rounded-full border border-emerald-300 inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>{t3('Daayirektaraan Mirkanaa\'eera · Barataa/Maatii fi Biiroof Ifoomera', 'Approved by Director · Released to Student/Parent & Bureau', 'በዳይሬክተር ጸድቋል · ለተማሪ/ወላጅ እና ለትምህርት ቢሮ ይፋ ሆኗል')}</span>
                  </span>
                ) : selectedBatch.status === 'submitted_to_director' ? (
                  <span className="px-3 py-1 bg-amber-100 text-amber-950 font-black text-xs rounded-full border border-amber-300 inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>{t3('Itti Gaafatamaa Kutaan Qindaa\'ee Daayirektaraaf Dhiyaate (Mirkaneessa Eegaa jira)', 'Compiled & Submitted to Director (Pending Approval)', 'በክፍል ተጠሪ ተጠናቅሮ ለዳይሬክተር ቀርቧል (የዳይሬክተር ማፅደቂያ በመጠባበቅ ላይ)')}</span>
                  </span>
                ) : selectedBatch.status === 'submitted_to_homeroom' ? (
                  <span className="px-3 py-1 bg-sky-100 text-sky-950 font-black text-xs rounded-full border border-sky-300 inline-flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-sky-700" />
                    <span>{t3('Barsiisaan Galmaa\'ee Itti Gaafatamaa Kutaaf Ergame (Cuunfaa Eegaa jira)', 'Submitted to Homeroom Teacher (Pending Summary)', 'በመምህሩ ተመዝግቦ ለክፍል ተጠሪ ተልኳል (የክፍል ተጠሪ ማጠቃለያ በመጠባበቅ ላይ)')}</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-200 text-slate-800 font-bold text-xs rounded-full">
                    {t3('Qabxii Wixinee', 'Draft Grades', 'ረቂቅ ውጤት')}
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
                    <span>{t3('1. Barsiisaa:', '1. Teacher:', '1. መምህር፡')} {selectedBatch.teacherName}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {selectedBatch.teacherNotes || t3('Qabxiin hojii daree fi qormaataa ergameera.', 'Classwork and exam scores submitted.', 'የክፍል ስራና ፈተና ውጤት ተልኳል።')}
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
                    <span>{t3('2. Itti Gaafatamaa Kutaa:', '2. Homeroom:', '2. ክፍል ተጠሪ፡')} {selectedBatch.homeroomTeacherName}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {selectedBatch.homeroomRemarks || t3('Cuunfaa qabxii fi madaallii naamusaa', 'Grade compilation & conduct review', 'ውጤት ማጠቃለያና ስነ-ምግባር ምዘና')}
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
                    <span>{t3('3. Mirkaneessa Daayirektaraa', '3. Director Approval', '3. ዳይሬክተር ማፅደቂያ')}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {selectedBatch.status === 'director_approved'
                      ? `${t3('Mirkanaa\'e:', 'Approved:', 'ጸድቋል፡')} ${selectedBatch.directorApprovalSealNumber || t3('Ifoomeera', 'Released', 'ይፋ ሆነ')}`
                      : t3('Mirkaneessa seeraa daayirektaraa eegaa jira', 'Awaiting official Director approval', 'የዳይሬክተር ይፋዊ ማፅደቂያ በመጠባበቅ ላይ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Student Marks Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="p-3 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  {t3('Tarree Qabxii Barattootaa', 'Student Grades Breakdown', 'የተማሪዎች ውጤት ዝርዝር')} ({selectedBatch.entries.length} {t3('Barattoota', 'Students', 'ተማሪዎች')})
                </span>
                <span className="text-slate-500">
                  {t3('Giddugaleessa:', 'Average:', 'አማካይ፡')} <strong>{selectedBatch.averageScore}%</strong> · {t3('Reetii Darbuu:', 'Pass Rate:', 'የማለፍ ምጣኔ፡')} <strong>{selectedBatch.passRate}%</strong>
                </span>
              </div>

              <div className="overflow-x-auto max-h-72">
                <table className="w-full text-xs text-left min-w-[700px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">{t3('Sadarkaa', 'Rank', 'ደረጃ')}</th>
                      <th className="py-2.5 px-3">{t3('Maqaa Barataa', 'Student Name', 'የተማሪ ስም')}</th>
                      <th className="py-2.5 px-3">{t3('Eenyummaa', 'ID', 'መለያ')}</th>
                      <th className="py-2.5 px-2">Quiz 1 (10%)</th>
                      <th className="py-2.5 px-2">Quiz 2 (10%)</th>
                      <th className="py-2.5 px-2">Mid (30%)</th>
                      <th className="py-2.5 px-2">Final (50%)</th>
                      <th className="py-2.5 px-2">{t3('Waliigala (100%)', 'Total (100%)', 'ድምር (100%)')}</th>
                      <th className="py-2.5 px-2 text-center">{t3('Qabxii', 'Grade', 'ደረጃ')}</th>
                      <th className="py-2.5 px-2 text-center">{t3('Naamusa', 'Conduct', 'ስነ-ምግባር')}</th>
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
                {t3('Tarkaanfilee Mirkaneessaa fi Dabarsuu (Workflow Actions)', 'Workflow Actions', 'የማፅደቅና የማስተላለፍ ተግባራት (Workflow Actions)')}
              </h4>

              {isBureauRole && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-950 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>
                    {t3(
                      'Ilaalcha Biiroo Barnootaa (Ilaaluu Qofa): Qabxii galmeessuun, qindeessuun fi mirkaneessuun aangoo barsiisotaa fi daayirektara mana barumsaa qofa. Biiroon qabxii ergame ilaaluu fi madaaluu qofaaf hayyama qaba.',
                      'Education Bureau View (Read-Only): Recording, compiling, and approving grades belongs exclusively to school teachers and the director. The Bureau has view-only audit access.',
                      'የትምህርት ቢሮ እይታ (ማየት ብቻ - Read-Only)፡ የውጤት ምዝገባ፣ ማጠናቀርና ማፅደቅ የትምህርት ቤቱ መምህራንና ዳይሬክተር ስልጣን ብቻ ነው። ቢሮው የተላከውን ውጤት ለማየትና ለመገምገም ብቻ ፍቃድ አለው፤ ውጤት መቀየር ወይም ማሻሻል አይቻልም።'
                    )}
                  </span>
                </div>
              )}

              {/* Stage 1 action: If Draft / Resubmit to Homeroom */}
              {!isBureauRole && selectedBatch.status === 'draft' && (
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-600">
                    {t3('Qabxiin barsiisaaf qophaa\'eera. Gara barsiisaa itti gaafatamaa kutaatti ergaa:', 'Grades are ready. Submit to Homeroom Teacher:', 'ውጤቱ ለመምህሩ ዝግጁ ሆኗል። ለክፍል ተጠሪው መምህር ይላኩ፡')}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleTeacherSubmitToHomeroom(selectedBatch)}
                    className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t3('Itti Gaafatamaa Kutaaf Ergi', 'Submit to Homeroom', 'ለክፍል ተጠሪ መምህር ላክ')}</span>
                  </button>
                </div>
              )}

              {/* Stage 2 action: Homeroom Teacher Reviews and Submits to Director */}
              {!isBureauRole && selectedBatch.status === 'submitted_to_homeroom' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">
                    {t3(
                      'Qabxiin kun itti gaafatamaa kutaatiif dhiyaateera. Yaada cuunfaa kutaa dabaluun gara Daayirektara mana barumsaatti dabarsaa:',
                      'Submitted to Homeroom Teacher. Add class summary remarks and forward to the School Director:',
                      'ይህ ውጤት ለክፍል ተጠሪው ቀርቧል። የክፍሉን ማጠቃለያ አስተያየት በማከል ለት/ቤቱ ዳይሬክተር ያስተላልፉ፡'
                    )}
                  </p>
                  <input
                    type="text"
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder={t3('Yaada cuunfaa itti gaafatamaa kutaa (Fkn: Argamuu fi naamusi barattootaa mirkanaa\'eera)...', 'Homeroom summary remarks (e.g. Attendance & conduct verified)...', 'የክፍል ተጠሪ ማጠቃለያ አስተያየት (ለምሳሌ፡ የተማሪዎች መገኘትና ስነ-ምግባር ተረጋግጧል)...')}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-hidden"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleRequestRevision(selectedBatch)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                    >
                      {t3('Sirreeffamaaf Barsiisaaf Deebisi', 'Return for Revision', 'ማሻሻያ ለመምህሩ መልስ')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHomeroomSubmitToDirector(selectedBatch)}
                      className="px-4 py-2 bg-gradient-to-r from-sky-600 to-teal-700 hover:from-sky-500 hover:to-teal-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{t3('Mirkaneessaaf Daayirektaraaf Ergi', 'Forward to Director', 'ለዳይሬክተር ማፅደቂያ ላክ (Forward to Director)')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Stage 3 action: Director Final Approval & Official Dispatch */}
              {!isBureauRole && selectedBatch.status === 'submitted_to_director' && (
                <div className="space-y-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-amber-800" />
                    <span>{t3('Mirkaneessa Seeraa Daayirektaraa (Executive Approval Desk)', 'Director Executive Approval Desk', 'የዳይሬክተር ይፋዊ ማፅደቂያ (Executive Approval Desk)')}</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {isOm ? (
                      <>Daayirektarri qabxii kana yoo mirkaneessu: <strong>Barattootaa fi Maatiif</strong> poortaala isaanii irratti ifa ta\'a; akkasumas ofumaan gara <strong>Biiroo Barnootaa Bulchiinsa Magaalaa Shaashamannee</strong> ergama.</>
                    ) : isEn ? (
                      <>Once approved by the Director, grades become visible to <strong>Students & Parents</strong> in their portals and are automatically dispatched to the <strong>Shashemene Education Bureau</strong>.</>
                    ) : (
                      <>ዳይሬክተሩ ይህንን ውጤት ሲያፀድቁ፡ <strong>ለተማሪዎች እና ለወላጆች</strong> በፖርታላቸው ይፋ ይሆናል፤ እንዲሁም ለ<strong>ሻሸመኔ ከተማ ትምህርት ቢሮ</strong> በራስ-ሰር ይላካል።</>
                    )}
                  </p>
                  <input
                    type="text"
                    value={directorNotesInput}
                    onChange={(e) => setDirectorNotesInput(e.target.value)}
                    placeholder={t3('Yaada mirkaneessaa seeraa daayirektaraa...', 'Official Director approval remarks...', 'የዳይሬክተር ይፋዊ የይሁንታ አስተያየት...')}
                    className="w-full px-3 py-2 text-xs border border-amber-300 rounded-xl bg-white focus:outline-hidden"
                  />
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleRequestRevision(selectedBatch)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                    >
                      {t3('Sirreeffama Gaafadhu', 'Request Revision', 'ማሻሻያ ጠይቅ (Request Revision)')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDirectorApprove(selectedBatch)}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black transition-all shadow-lg flex items-center gap-2 cursor-pointer hover:scale-102"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>{t3('Mirkaneessii Ifoomsi (Approve & Release)', 'Approve & Officially Release', 'አጽድቅና ይፋ አድርግ (Approve & Officially Release)')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* If Already Approved by Director: Show Proof of Propagation */}
              {selectedBatch.status === 'director_approved' && (
                <div className="p-3 bg-emerald-100/70 border border-emerald-300 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-950 font-black">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>{t3('Qabxiin Daayirektaraan mirkanaa\'ee chaappaa seeraa argateera!', 'Approved by Director with official digital seal!', 'ውጤቱ በዳይሬክተሩ ጸድቆ ህጋዊ ማህተም አግኝቷል!')}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-emerald-900 pt-1">
                    <div>
                      ✓ <strong>{t3('Maatii & Barataaf:', 'For Parents & Students:', 'ለወላጅና ተማሪ፡')}</strong> {t3('Kaardii qabxii poortaala irratti ifoomeera.', 'Published on portal report cards.', 'በፖርታል የውጤት ካርድ ላይ ይፋ ሆኗል።')}
                    </div>
                    <div>
                      ✓ <strong>{t3('Biiroo Barnootaaf:', 'For Education Bureau:', 'ለትምህርት ቢሮ፡')}</strong> {t3('Sarvara giddugaleessaa irratti galmaa\'eera', 'Synced to central server', 'በማዕከላዊ ሰርቨር ተመዝግቧል')} ({t3('Chaappaa:', 'Seal:', 'ማህተም:')} {selectedBatch.directorApprovalSealNumber}).
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
                <span>{t3('Sanada Kutaa Seeraa Maxxansi', 'Print Official Roster', 'ይፋዊ የክፍል ሰነድ አትም (Print Roster)')}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBatch(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {t3('Cufi', 'Close', 'ዝጋ (Close)')}
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
                    {t3('Galmee Qabxii Barattootaa Haaraa', 'New Student Grade Submission', 'አዲስ የተማሪዎች ውጤት መመዝገቢያ')}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {t3('Sadarkaa 1: Barsiisaan qabxii gara itti gaafatamaa kutaatti dabarsuu', 'Stage 1: Teacher submits grades to Homeroom Teacher', 'ደረጃ 1፡ መምህሩ ውጤቱን ለክፍል ተጠሪ መምህር የሚያስተላልፍበት')}
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
                  <label className="block font-bold text-slate-700 mb-1">{t3('Kutaa (Grade) *', 'Grade *', 'ክፍል (Grade) *')}</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-800"
                  >
                    <option value={9}>{t3('Kutaa 9', 'Grade 9', 'Grade 9')}</option>
                    <option value={10}>{t3('Kutaa 10', 'Grade 10', 'Grade 10')}</option>
                    <option value={11}>{t3('Kutaa 11', 'Grade 11', 'Grade 11')}</option>
                    <option value={12}>{t3('Kutaa 12', 'Grade 12', 'Grade 12')}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t3('Garee (Section) *', 'Section *', 'ክፍልፋይ (Section) *')}</label>
                  <select
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-800"
                  >
                    <option value="A">{t3('Garee A', 'Section A', 'Section A')}</option>
                    <option value="B">{t3('Garee B', 'Section B', 'Section B')}</option>
                    <option value="C">{t3('Garee C', 'Section C', 'Section C')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t3('Gosa Barnootaa (Subject) *', 'Subject *', 'የትምህርት አይነት (Subject) *')}</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-800"
                >
                  <option value="Mathematics (ሒሳብ)">{getSubjectDisplay('Mathematics (ሒሳብ)')}</option>
                  <option value="English (እንግሊዝኛ)">{getSubjectDisplay('English (እንግሊዝኛ)')}</option>
                  <option value="Physics (ፊዚክስ)">{getSubjectDisplay('Physics (ፊዚክስ)')}</option>
                  <option value="Chemistry (ኬሚስትሪ)">{getSubjectDisplay('Chemistry (ኬሚስትሪ)')}</option>
                  <option value="Biology (ባዮሎጂ)">{getSubjectDisplay('Biology (ባዮሎጂ)')}</option>
                  <option value="Afaan Oromoo (ኦሮሚኛ)">{getSubjectDisplay('Afaan Oromoo (ኦሮሚኛ)')}</option>
                  <option value="Citizenship (ስነ-ዜጋ)">{getSubjectDisplay('Citizenship (ስነ-ዜጋ)')}</option>
                  <option value="የተጠናቀረ የክፍሉ ውጤት (All Subjects)">{getSubjectDisplay('የተጠናቀረ የክፍሉ ውጤት (All Subjects)')}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t3('Yeroo Qabxii (Assessment Period) *', 'Assessment Period *', 'የውጤት ወቅት (Assessment Period) *')}</label>
                <select
                  value={newPeriod}
                  onChange={(e) => setNewPeriod(e.target.value as AcademicPeriodType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-800"
                >
                  <option value="quarter_1">{getPeriodLabel('quarter_1')}</option>
                  <option value="quarter_2">{getPeriodLabel('quarter_2')}</option>
                  <option value="semester_1">{getPeriodLabel('semester_1')}</option>
                  <option value="quarter_3">{getPeriodLabel('quarter_3')}</option>
                  <option value="quarter_4">{getPeriodLabel('quarter_4')}</option>
                  <option value="semester_2">{getPeriodLabel('semester_2')}</option>
                  <option value="annual">{getPeriodLabel('annual')}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t3('Maqaa Guutuu Barsiisaa *', 'Teacher Full Name *', 'የመምህሩ ሙሉ ስም *')}</label>
                <input
                  type="text"
                  required
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t3('Barsiisaa Itti Gaafatamaa Kutaa Qabxii Fudhatu *', 'Receiving Homeroom Teacher *', 'ውጤቱን የሚረከበው የክፍል ተጠሪ መምህር *')}</label>
                <input
                  type="text"
                  required
                  value={newHomeroomTeacherName}
                  onChange={(e) => setNewHomeroomTeacherName(e.target.value)}
                  placeholder={t3('Maqaa barsiisaa itti gaafatamaa kutaa...', 'Homeroom teacher name...', 'የክፍል ተጠሪ መምህር ስም...')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t3('Yaada / Yaadannoo Barsiisaa', 'Teacher Notes', 'የመምህሩ አስተያየት / ማስታወሻ')}</label>
                <textarea
                  rows={2}
                  value={newTeacherNotes}
                  onChange={(e) => setNewTeacherNotes(e.target.value)}
                  placeholder={t3('Yaadannoo cuunfaa waa\'ee qabxii...', 'Summary remarks on scores...', 'ስለ ውጤቱ ማጠቃለያ ማስታወሻ...')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-snug">
                {isOm ? (
                  <>Qabxiin yoo ergamu kallattiin gara <strong>Sadarkaa 2 (Barsiisaa Itti Gaafatamaa Kutaa)</strong> darba; itti gaafatamaan kutaa mirkaneessee gara <strong>Daayirektaraa</strong> erga; daayirektarri yoo mirkaneessu barataa/maatii fi Biiroo Barnootaa qaqqaba.</>
                ) : isEn ? (
                  <>Once submitted, grades flow to <strong>Stage 2 (Homeroom Teacher)</strong>, then to the <strong>Director</strong>, and upon approval to Students/Parents and the Bureau.</>
                ) : (
                  <>ውጤቱ ሲላክ በቀጥታ ወደ <strong>ደረጃ 2 (የክፍል ተጠሪ መምህር)</strong> ይተላለፋል፤ ክፍል ተጠሪው አረጋግጦ ለ<strong>ዳይሬክተር</strong> ያስተላልፋል፤ ዳይሬክተሩ ሲያፀድቅ ለተማሪ/ወላጅ እና ለትምህርት ቢሮ ይደርሳል።</>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  {t3('Haqi', 'Cancel', 'ሰርዝ')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-700 hover:to-teal-800 text-white font-black rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t3('Qabxii Itti Gaafatamaa Kutaaf Ergi', 'Submit to Homeroom Teacher', 'ውጤቱን ለክፍል ተጠሪ ላክ')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
