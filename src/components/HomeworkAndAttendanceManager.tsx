import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  UserCheck,
  UserX,
  AlertCircle,
  FileText,
  Award,
  GraduationCap,
  Send,
  X,
  Search,
  Filter,
  Check,
  Edit,
  Trash2,
  MessageSquare,
  QrCode,
  Lock
} from 'lucide-react';
import {
  HomeworkAssignment,
  HomeworkSubmission,
  StudentAttendanceRecord,
  StudentRecord,
  School,
  Language,
  AppUserSession
} from '../types';
import { StorageService } from '../utils/storage';
import { getLocalizedHomeworkList } from '../utils/localizedData';
import { OfflineSyncManager } from '../utils/offlineSync';
import { TeacherSubjectTrainingDesk } from './TeacherSubjectTrainingDesk';
import { StudentQRAttendanceModal } from './StudentQRAttendanceModal';

interface HomeworkAndAttendanceManagerProps {
  school: School;
  students: StudentRecord[];
  currentUser: AppUserSession | null;
  currentLang: Language;
}

export const HomeworkAndAttendanceManager: React.FC<HomeworkAndAttendanceManagerProps> = ({
  school,
  students,
  currentUser,
  currentLang
}) => {
  const isOm = currentLang === 'om';
  const isEn = currentLang === 'en';
  const t3 = (om: string, en: string, am: string) => (isOm ? om : isEn ? en : am);

  const getSubjectDisplay = (subj: string) => {
    const lower = subj.toLowerCase();
    if (lower.includes('math') || lower.includes('ሂሳብ') || lower.includes('ሒሳብ')) {
      return t3('Herrega (Mathematics)', 'Mathematics', 'Mathematics (ሒሳብ)');
    }
    if (lower.includes('oromo') || lower.includes('ኦሮሚኛ')) {
      return t3('Afaan Oromoo', 'Afaan Oromoo', 'Afaan Oromoo (ኦሮሚኛ)');
    }
    if (lower.includes('english') || lower.includes('እንግሊዝኛ')) {
      return t3('Ingiliffaa (English)', 'English', 'English (እንግሊዝኛ)');
    }
    if (lower.includes('physics') && lower.includes('chemistry')) {
      return t3('Fiiziksii fi Keemistirii (Saayinsii)', 'Physics & Chemistry', 'Physics & Chemistry (ሳይንስ)');
    }
    if (lower.includes('physics') || lower.includes('ፊዚክስ')) {
      return t3('Fiiziksii (Physics)', 'Physics', 'Physics (ፊዚክስ)');
    }
    if (lower.includes('chemistry') || lower.includes('ኬሚስትሪ')) {
      return t3('Keemistirii (Chemistry)', 'Chemistry', 'Chemistry (ኬሚስትሪ)');
    }
    if (lower.includes('bio') || lower.includes('ባዮ')) {
      return t3('Baayoolojii (Biology)', 'Biology', 'Biology (ባዮሎጂ)');
    }
    if (lower.includes('civic') || lower.includes('citizen') || lower.includes('ዜጋ')) {
      return t3('Lammummaa fi Barnoota Hawaasaa', 'Citizenship & Social Studies', 'Citizenship & Social Studies (ስነ-ዜጋ)');
    }
    return subj;
  };

  const isBureauRole = currentUser?.role === 'bureau_admin' || currentUser?.role === 'bureau_staff';
  const [activeTab, setActiveTab] = useState<'bureau_training' | 'homework' | 'attendance'>('bureau_training');

  // Detect Teacher's Assigned Subject
  const detectedTeacherSubject = React.useMemo(() => {
    if (currentUser?.staffDepartment) {
      const d = currentUser.staffDepartment.toLowerCase();
      if (d.includes('math') || d.includes('ሂሳብ')) return 'Mathematics (ሂሳብ)';
      if (d.includes('oromo') || d.includes('ኦሮሚኛ')) return 'Afaan Oromoo (ኦሮሚኛ)';
      if (d.includes('english') || d.includes('እንግሊዝኛ')) return 'English (እንግሊዝኛ)';
      if (d.includes('physics') || d.includes('chemistry') || d.includes('ሳይንስ') || d.includes('science')) {
        return 'Physics & Chemistry (ሳይንስ)';
      }
      if (d.includes('bio') || d.includes('ባዮ')) return 'Biology (ባዮሎጂ)';
      if (d.includes('civic') || d.includes('ዜጋ')) return 'Citizenship & Social Studies (ስነ-ዜጋ)';
    }

    if (currentUser?.accessCode) {
      const codes = StorageService.getSchoolCodes();
      const code = codes.find((c) => c.accessCode === currentUser.accessCode);
      if (code?.assignedClassOrSubject) {
        const s = code.assignedClassOrSubject.toLowerCase();
        if (s.includes('math') || s.includes('ሂሳብ')) return 'Mathematics (ሂሳብ)';
        if (s.includes('oromo') || s.includes('ኦሮሚኛ')) return 'Afaan Oromoo (ኦሮሚኛ)';
        if (s.includes('english') || s.includes('እንግሊዝኛ')) return 'English (እንግሊዝኛ)';
        if (s.includes('physics') || s.includes('chemist') || s.includes('science') || s.includes('ሳይንስ')) {
          return 'Physics & Chemistry (ሳይንስ)';
        }
        if (s.includes('bio') || s.includes('ባዮ')) return 'Biology (ባዮሎጂ)';
      }
    }

    if (currentUser?.name) {
      const n = currentUser.name.toLowerCase();
      if (n.includes('ሂሳብ') || n.includes('math')) return 'Mathematics (ሂሳብ)';
      if (n.includes('oromo') || n.includes('ኦሮሚኛ')) return 'Afaan Oromoo (ኦሮሚኛ)';
      if (n.includes('english') || n.includes('እንግሊዝኛ')) return 'English (እንግሊዝኛ)';
      if (n.includes('ሳይንስ') || n.includes('physics')) return 'Physics & Chemistry (ሳይንስ)';
    }

    return 'Mathematics (ሂሳብ)';
  }, [currentUser]);

  // Homework state
  const [assignments, setAssignments] = useState<HomeworkAssignment[]>(() =>
    StorageService.getHomework(school.id)
  );
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(() =>
    StorageService.getHomeworkSubmissions()
  );
  const [showAddHwModal, setShowAddHwModal] = useState(false);
  const [selectedAssignmentForReview, setSelectedAssignmentForReview] = useState<HomeworkAssignment | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // New Homework Form state
  const [hwSubject, setHwSubject] = useState(detectedTeacherSubject);
  const [hwTitle, setHwTitle] = useState('');
  const [hwGrade, setHwGrade] = useState(11);
  const [hwSection, setHwSection] = useState('A');
  const [hwDescription, setHwDescription] = useState('');
  const [hwDueDate, setHwDueDate] = useState('2024-10-30');
  const [hwMaxScore, setHwMaxScore] = useState(10);

  // Grading modal state
  const [selectedSubForGrading, setSelectedSubForGrading] = useState<HomeworkSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(10);
  const [gradeFeedback, setGradeFeedback] = useState('');

  // Attendance state
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceRecords, setAttendanceRecords] = useState<StudentAttendanceRecord[]>(() =>
    StorageService.getAttendance(school.id, undefined, new Date().toISOString().split('T')[0])
  );
  const [attendanceSavedMessage, setAttendanceSavedMessage] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Filter students for attendance
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<number>(11);

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle.trim() || !hwDescription.trim()) return;

    const newHw: HomeworkAssignment = {
      id: `hw-${Date.now()}`,
      schoolId: school.id,
      schoolName: school.name,
      teacherId: currentUser?.identifier || 'tch-1',
      teacherName:
        currentUser?.name ||
        t3('Barsiisaa Bafaqaaduu Xilaahun', 'Teacher Befekadu Tilahun', 'መ/ር በፈቃዱ ጥላሁን'),
      grade: Number(hwGrade),
      section: hwSection,
      subject: hwSubject,
      title: hwTitle.trim(),
      description: hwDescription.trim(),
      dueDate: hwDueDate,
      maxScore: Number(hwMaxScore),
      createdAt: new Date().toISOString().split('T')[0]
    };

    StorageService.addHomework(newHw);
    setAssignments(StorageService.getHomework(school.id));
    setShowAddHwModal(false);
    setHwTitle('');
    setHwDescription('');
  };

  const handleDeleteHomework = (id: string) => {
    if (confirmDeleteId === id) {
      StorageService.deleteHomework(id);
      setAssignments(StorageService.getHomework(school.id));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubForGrading) return;

    StorageService.gradeHomeworkSubmission(selectedSubForGrading.id, Number(gradeScore), gradeFeedback);
    setSubmissions(StorageService.getHomeworkSubmissions());
    setSelectedSubForGrading(null);
  };

  const handleToggleAttendance = (student: StudentRecord, status: StudentAttendanceRecord['status']) => {
    const record: StudentAttendanceRecord = {
      id: `att-${student.id}-${selectedDate}`,
      schoolId: school.id,
      studentId: student.id,
      studentName: student.fullName,
      grade: student.grade,
      section: student.section,
      date: selectedDate,
      status,
      recordedBy:
        currentUser?.name ||
        t3('Barsiisaa Bafaqaaduu Xilaahun', 'Teacher Befekadu Tilahun', 'መ/ር በፈቃዱ ጥላሁን')
    };

    StorageService.markAttendance(record);
    setAttendanceRecords(StorageService.getAttendance(school.id, undefined, selectedDate));

    const statusLabel =
      status === 'present'
        ? t3('Argameera', 'Present', 'ተገኝቷል')
        : status === 'absent'
        ? t3('Hafeera', 'Absent', 'ቀሪ')
        : t3('Hayyama', 'Excused', 'ፈቃድ');

    // Enqueue attendance for offline synchronization
    OfflineSyncManager.enqueue(
      'student_performance',
      'update',
      record.id,
      record,
      {
        authorName: currentUser?.name || t3('Barsiisaa', 'Teacher', 'መምህር'),
        schoolName: school.name,
        description: t3(
          `Haala argama barataa ${student.fullName} (${statusLabel})`,
          `Attendance status for ${student.fullName} (${statusLabel})`,
          `የተማሪ ${student.fullName} የመገኘት ሁኔታ (${statusLabel})`
        )
      }
    );

    setAttendanceSavedMessage(true);
    setTimeout(() => setAttendanceSavedMessage(false), 2000);
  };

  // Strict Work Isolation for Teachers
  const isTeacherUser = currentUser?.role === 'teacher';

  const localizedAssignments = useMemo(
    () => getLocalizedHomeworkList(assignments, currentLang),
    [assignments, currentLang]
  );

  const visibleAssignments = localizedAssignments.filter((hw: HomeworkAssignment) => {
    if (!isTeacherUser) return true; // Director and Bureau admin can oversee all
    return (
      hw.teacherName === currentUser?.name ||
      hw.teacherId === currentUser?.identifier ||
      (currentUser?.name && hw.teacherName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])) ||
      (currentUser?.staffDepartment && hw.subject.toLowerCase().includes(currentUser.staffDepartment.toLowerCase()))
    );
  });

  const filteredStudentsForAttendance = students.filter(
    (s) => s.grade === selectedGradeFilter
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-teal-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-900/80 border border-amber-400/40 rounded-full text-xs font-semibold text-amber-200">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {t3(
                  'Kutaa Barsiisotaa fi Hoggansa Hojii Barnootaa',
                  'Teachers & Academic Operations Department',
                  'የመምህራን እና የአካዳሚክ ስራ አመራር ክፍል'
                )}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {t3(
                'Hojii Manaa (Homework) fi Argama Guyyaa (Attendance)',
                'Homework Assignments & Daily Attendance',
                'የቤት ስራ (Homework) እና ዕለታዊ መገኘት (Attendance)'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              {t3(
                'Dareewwaniif hojii manaa kennuu, deebii barattootaa sirreessuu fi qabxii kennuu; akkasumas argama guyyaa barattootaa battalumatti galmeessuu.',
                'Assign homework to classes, grade student submissions, and record daily student attendance in real time.',
                'ለመማሪያ ክፍሎች የቤት ስራ የመስጠት፣ የተማሪዎችን መልስ የማረም እና ነጥብ የመስጠት፤ እንዲሁም የተማሪዎችን ዕለታዊ መገኘት በቅጽበት የመመዝገቢያ ማዕከል'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isBureauRole ? (
              <button
                type="button"
                onClick={() => setShowAddHwModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{t3('Hojii Manaa Haaraa Kenni (New)', 'Assign New Homework', 'አዲስ የቤት ስራ ስጥ (New Homework)')}</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-amber-500/20 text-amber-200 border border-amber-400/40 rounded-xl text-xs font-bold">
                <Lock className="w-4 h-4 text-amber-300" />
                <span>{t3('Ilaalcha Biiroo Barnootaa (Dubbisuu Qofa)', 'Bureau View (Read-Only)', 'የትምህርት ቢሮ እይታ (ማየት ብቻ - Read-Only)')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bureau Direct Training Dispatch Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 p-4 rounded-3xl border border-emerald-500/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                {t3('Leenjii Idilee Biiroo Barnootaa', 'Official Bureau Training', 'ይፋዊ የትምህርት ቢሮ ስልጠና')}
              </span>
              <span className="text-[10px] text-amber-300 font-medium">
                {t3('Kallattiin Barsiisaa Ergamedha', 'Dispatched Directly to Teacher', 'ቀጥታ የተላከለት መምህር')}
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-black text-white mt-0.5">
              {t3('Barsiisaa/tuu', 'For Teacher', 'ለመምህር')}{' '}
              {currentUser?.name || t3('Bafaqaaduu Xilaahun', 'Befekadu Tilahun', 'በፈቃዱ ጥላሁን')}{' '}
              {t3('gosa barnootaa', 'teaching', 'ለሚያስተምሩት')}{' '}
              <span className="text-amber-300 underline font-bold">[{getSubjectDisplay(detectedTeacherSubject)}]</span>{' '}
              {t3('moojuulota leenjii idilee ergaman', 'official training modules dispatched', 'ትምህርት የተላኩ ይፋዊ የስልጠና ሞጁሎች')}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('bureau_training')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm ${
            activeTab === 'bureau_training'
              ? 'bg-amber-400 text-slate-950 ring-2 ring-white/30'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>
            {activeTab === 'bureau_training'
              ? t3('Leenjii Ilaalaa Jirtu', 'Viewing Training', 'ስልጠናውን እየተመለከቱ ነው')
              : t3('Leenjiiwwan Ilaali', 'View Trainings', 'ስልጠናዎችን ተመልከት')}
          </span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white p-2 rounded-2xl overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('bureau_training')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'bureau_training'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4 text-amber-300" />
          <span>{t3('Leenjiiwwan Biiroo Barnootaarraa Ergaman', 'Bureau Dispatched Trainings', 'ከትምህርት ቢሮ የተላኩ ስልጠናዎች')}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
            {t3('Moojuulii Idilee', 'Official Modules', 'ይፋዊ ሞጁሎች')}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('homework')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'homework'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>
            {isTeacherUser
              ? t3(`Hojii Manaa Koo (${visibleAssignments.length})`, `My Homework (${visibleAssignments.length})`, `የእኔ የቤት ስራዎች (${visibleAssignments.length})`)
              : t3(`Hojii Manaa fi Deebii (${visibleAssignments.length})`, `Homework & Submissions (${visibleAssignments.length})`, `የቤት ስራዎች እና ምልጃዎች (${visibleAssignments.length})`)}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('attendance')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'attendance'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t3('Argama Guyyaa Barattootaa (Attendance)', 'Daily Attendance Sheet', 'የተማሪዎች ዕለታዊ መገኘት (Daily Attendance Sheet)')}</span>
        </button>
      </div>

      {/* Tab 0: Bureau Subject Training */}
      {activeTab === 'bureau_training' && (
        <TeacherSubjectTrainingDesk
          school={school}
          currentUser={currentUser}
          currentLang={currentLang}
        />
      )}

      {/* Tab 1: Homework */}
      {activeTab === 'homework' && (
        <div className="space-y-4">
          {/* Work Isolation Banner */}
          {isTeacherUser && (
            <div className="p-3 bg-emerald-950/90 text-emerald-100 border border-emerald-500/50 rounded-2xl text-xs flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                  🔒
                </span>
                <span>
                  <strong>{t3(`Fuula Hojii Barsiisaa Dhuunfaa (${currentUser?.name}):`, `Isolated Teacher Workspace (${currentUser?.name}):`, `የተከለለ የመምህር የስራ ገጽ (${currentUser?.name})፡`)}</strong>{' '}
                  {t3(
                    'Wayitii barumsaa fi hojii manaa isiniif ramadaman qofatu adda ba’e. Barsiisonni biroo kan keessan hin argan; isinis kan warra kaanii hin argitan.',
                    'Only your assigned periods and homework tasks are shown. Other teachers cannot view yours, and you do not view theirs.',
                    'ለእርስዎ የተመደቡ የትምህርት ክፍለ ጊዜያትና የቤት ስራዎች ብቻ ተለይተዋል። ሌሎች መምህራን የእርስዎን አያዩም፤ እርስዎም የሌሎችን አያዩም።'
                  )}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 uppercase font-mono shrink-0">
                {t3('Daangaa Hojii Dhuunfaa', 'Private Scope', 'የተለየ የስራ ወሰን')}
              </span>
            </div>
          )}

          {visibleAssignments.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">
                {t3('Hojii manaa ramadame tokkollee hin jiru', 'No homework assignments yet', 'ምንም የተመደበ የቤት ስራ የለም')}
              </p>
              <p className="text-[11px] text-slate-500">
                {t3(
                  'Qabduu "Hojii Manaa Haaraa Kenni" isa mirgarra jiru cuqaasuun daree keessaniif hojii manaa kennuu dandeessu.',
                  'Click "Assign New Homework" above to create an assignment for your class.',
                  'በቀኝ በኩል ያለውን "አዲስ የቤት ስራ ስጥ" ቁልፍ በመጫን ለክፍልዎ የቤት ስራ መስጠት ይችላሉ።'
                )}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleAssignments.map((hw: HomeworkAssignment) => {
                const hwSubs = submissions.filter((s) => s.assignmentId === hw.id);
                const gradedCount = hwSubs.filter((s) => s.status === 'graded').length;
                const canDelete = !isBureauRole && (!isTeacherUser || hw.teacherName === currentUser?.name);
                return (
                  <div
                    key={hw.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          {getSubjectDisplay(hw.subject)}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{hw.title}</h3>
                        <p className="text-[11px] text-slate-500">
                          {t3('Kutaa:', 'Grade:', 'ክፍል፡')} {hw.grade}{t3('ffaa', '', 'ኛ')} ({hw.section}) · {t3('Barsiisaa:', 'Teacher:', 'መምህር፡')} {hw.teacherName}
                        </p>
                      </div>

                      {canDelete && (
                        <div className="flex items-center gap-1">
                          {confirmDeleteId === hw.id ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleDeleteHomework(hw.id)}
                                className="px-2 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold cursor-pointer"
                              >
                                {t3('Mirkaneessi', 'Confirm', 'አረጋግጥ')}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold cursor-pointer"
                              >
                                {t3('Dhiisi', 'Cancel', 'ተው')}
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDeleteHomework(hw.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                              title={t3('Haqi', 'Delete', 'ሰርዝ')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
                    {hw.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <span className="text-slate-500 font-medium font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {t3('Guyyaa Xumuraa:', 'Due Date:', 'የመጨረሻ ቀን፡')} {hw.dueDate}
                    </span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      {t3('Qabxii Ol’aanaa:', 'Max Score:', 'ከፍተኛ ነጥብ፡')} {hw.maxScore}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {t3('Deebiiwwan Galan:', 'Submissions:', 'የገቡ መልሶች፡')} <strong>{hwSubs.length}</strong> ({t3('Kan Sirreeffaman:', 'Graded:', 'የታረሙ፡')} {gradedCount})
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedAssignmentForReview(hw)}
                      className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{t3(`Deebii Barattootaa Sirreessi (${hwSubs.length})`, `Review Submissions (${hwSubs.length})`, `የተማሪዎችን መልስ እረም (${hwSubs.length})`)}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

          {/* Submissions Review Drawer */}
          {selectedAssignmentForReview && (
            <div className="bg-slate-900/10 p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {t3('Sirreeffama Deebii Barattootaa:', 'Submission Review:', 'የተማሪዎች መልሶች ማረሚያ፡')} {selectedAssignmentForReview.title}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {t3(
                      'Deebii barattootaa ilaaluun qabxii fi yaada ijaaraa kennaa',
                      'Review student answers and provide scores with constructive feedback',
                      'የተማሪዎችን መልስ አይተው ነጥብ እና ገንቢ አስተያየት ይስጡ'
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAssignmentForReview(null)}
                  className="px-3 py-1 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  {t3('Cufi ✕', 'Close ✕', 'ዝጋ ✕')}
                </button>
              </div>

              {submissions.filter((s) => s.assignmentId === selectedAssignmentForReview.id).length ===
              0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-500">
                    {t3(
                      'Hojii manaa kanaaf hanga ammaatti deebiin barataa hin galle.',
                      'No student submissions have been received for this assignment yet.',
                      'ለዚህ የቤት ስራ እስካሁን የገባ የተማሪ መልስ የለም።'
                    )}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions
                    .filter((s) => s.assignmentId === selectedAssignmentForReview.id)
                    .map((sub) => (
                      <div
                        key={sub.id}
                        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">
                              {sub.studentName}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              ({t3(`Kutaa ${sub.grade}ffaa`, `Grade ${sub.grade}`, `${sub.grade}ኛ ክፍል`)} - {sub.section})
                            </span>
                            <span
                              className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                                sub.status === 'graded'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {sub.status === 'graded'
                                ? t3('Kan Sirreeffame', 'Graded', 'የታረመ')
                                : t3('Sirreeffama Eegaa Jira', 'Pending Review', 'እርማት የሚጠብቅ')}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 font-mono">
                              {sub.submissionDate}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSubForGrading(sub);
                                setGradeScore(sub.score || selectedAssignmentForReview.maxScore);
                                setGradeFeedback(sub.teacherFeedback || '');
                              }}
                              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg cursor-pointer inline-flex items-center gap-1"
                            >
                              <Award className="w-3 h-3" />
                              <span>
                                {sub.status === 'graded'
                                  ? t3('Qabxii Jijjiiri', 'Edit Grade', 'ውጤት ቀይር')
                                  : t3('Sirreessi & Qabxii Kenni', 'Grade Submission', 'እረም & ነጥብ ስጥ')}
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-800 whitespace-pre-line leading-relaxed border border-slate-200">
                          {sub.submissionText}
                        </div>

                        {sub.status === 'graded' && (
                          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                            <span className="font-bold text-emerald-950">
                              {t3('Qabxii Kenname:', 'Score Awarded:', 'የተሰጠ ውጤት፡')}{' '}
                              <strong className="text-emerald-800 font-mono text-sm">
                                {sub.score} / {selectedAssignmentForReview.maxScore}
                              </strong>
                            </span>
                            <span className="text-emerald-800 italic">
                              "{sub.teacherFeedback || t3('Hojii gaarii', 'Good job', 'ጥሩ ስራ')}"
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Attendance Sheet */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {t3(
                  'Unkaa Galmee Argama Guyyaa Barattootaa (Daily Attendance)',
                  'Daily Student Attendance Sheet',
                  'የተማሪዎች ዕለታዊ መገኘት መመዝገቢያ ቅጽ (Daily Attendance)'
                )}
              </h3>
              <p className="text-xs text-slate-500">
                {t3(
                  'Guyyaa, kutaa fi dareedhaan argama, barfachuu ykn hafuu barattootaa galmeessaa',
                  'Record student presence, tardiness, or absence by date, grade, and section',
                  'በቀን፣ በክፍል እና በሴክሽን ተማሪዎች መገኘታቸውን፣ ማርፈዳቸውን ወይም መቅረታቸውን መመዝገቢያ'
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isBureauRole ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold shrink-0">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t3('Ilaalcha Biiroo Barnootaa (Dubbisuu Qofa)', 'Bureau View (Read-Only)', 'የትምህርት ቢሮ እይታ (ማየት ብቻ - Read-Only)')}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-amber-300" />
                  <span>{t3('QR tiin Argama Galmeessi (QR Scan)', 'QR Attendance Scan', 'በ QR መገኘት መዝግብ (QR Scan)')}</span>
                </button>
              )}

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-semibold">{t3('Guyyaa:', 'Date:', 'ቀን፡')}</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setAttendanceRecords(
                      StorageService.getAttendance(school.id, undefined, e.target.value)
                    );
                  }}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-semibold">{t3('Kutaa:', 'Grade:', 'ክፍል፡')}</span>
                <select
                  value={selectedGradeFilter}
                  onChange={(e) => setSelectedGradeFilter(Number(e.target.value))}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-bold bg-white"
                >
                  <option value={9}>{t3('Kutaa 9ffaa', 'Grade 9', '9ኛ ክፍል')}</option>
                  <option value={10}>{t3('Kutaa 10ffaa', 'Grade 10', '10ኛ ክፍል')}</option>
                  <option value={11}>{t3('Kutaa 11ffaa', 'Grade 11', '11ኛ ክፍል')}</option>
                  <option value={12}>{t3('Kutaa 12ffaa', 'Grade 12', '12ኛ ክፍል')}</option>
                </select>
              </div>
            </div>
          </div>

          {attendanceSavedMessage && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 font-bold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t3('Argamni barataa galmaa’eera!', 'Student attendance saved!', 'የተማሪው መገኘት ተመዝግቧል!')}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">{t3('Maqaa Barataa', 'Student Name', 'የተማሪ ስም')}</th>
                  <th className="py-3 px-3">{t3('Kutaa', 'Grade', 'ክፍል')}</th>
                  <th className="py-3 px-3">{t3('Maatii', 'Parent', 'ወላጅ')}</th>
                  <th className="py-3 px-3">
                    {isBureauRole
                      ? t3('Haala Argamaa (Dubbisuu Qofa)', 'Attendance Status (Read-Only)', 'የመገኘት ሁኔታ (ማየት ብቻ - Read-Only)')
                      : t3('Haala Argamaa (Cuqaasaa filadhaa)', 'Attendance Status (Click to select)', 'የመገኘት ሁኔታ (ጠቅ አድርገው ይምረጡ)')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudentsForAttendance.map((st) => {
                  const currentRec = attendanceRecords.find(
                    (a) => a.studentId === st.id && a.date === selectedDate
                  );
                  const currentStatus = currentRec?.status || 'present';
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">{st.fullName}</td>
                      <td className="py-3 px-3 font-medium text-slate-600">
                        {t3(`Kutaa ${st.grade}ffaa`, `Grade ${st.grade}`, `${st.grade}ኛ ክፍል`)} ({st.section})
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {st.parentName} ({st.parentPhone})
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={isBureauRole}
                            onClick={() => !isBureauRole && handleToggleAttendance(st, 'present')}
                            className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1 ${
                              isBureauRole ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                            } ${
                              currentStatus === 'present'
                                ? 'bg-emerald-700 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>{t3('Argameera (Present)', 'Present', 'ተገኝቷል (Present)')}</span>
                          </button>

                          <button
                            type="button"
                            disabled={isBureauRole}
                            onClick={() => !isBureauRole && handleToggleAttendance(st, 'absent')}
                            className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1 ${
                              isBureauRole ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                            } ${
                              currentStatus === 'absent'
                                ? 'bg-rose-700 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <UserX className="w-3 h-3" />
                            <span>{t3('Hafeera (Absent)', 'Absent', 'ቀርቷል (Absent)')}</span>
                          </button>

                          <button
                            type="button"
                            disabled={isBureauRole}
                            onClick={() => !isBureauRole && handleToggleAttendance(st, 'late')}
                            className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1 ${
                              isBureauRole ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                            } ${
                              currentStatus === 'late'
                                ? 'bg-amber-600 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>{t3('Barfateera (Late)', 'Late', 'ዘግይቷል (Late)')}</span>
                          </button>

                          <button
                            type="button"
                            disabled={isBureauRole}
                            onClick={() => !isBureauRole && handleToggleAttendance(st, 'excused')}
                            className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1 ${
                              isBureauRole ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                            } ${
                              currentStatus === 'excused'
                                ? 'bg-blue-700 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <span>{t3('Hayyamaan (Excused)', 'Excused', 'በፈቃድ (Excused)')}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: New Homework */}
      {showAddHwModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-teal-800 to-amber-950 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">
                  {t3('Hojii Manaa Haaraa (Homework) Kennuu', 'Assign New Homework', 'አዲስ የቤት ስራ (Homework Assignment) መስጫ')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddHwModal(false)}
                className="text-amber-200 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateHomework} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t3('Gosa Barnootaa *', 'Subject *', 'የትምህርት አይነት *')}
                  </label>
                  <select
                    value={hwSubject}
                    onChange={(e) => setHwSubject(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Physics (ፊዚክስ)">{getSubjectDisplay('Physics (ፊዚክስ)')}</option>
                    <option value="Mathematics (ሒሳብ)">{getSubjectDisplay('Mathematics (ሒሳብ)')}</option>
                    <option value="English (እንግሊዝኛ)">{getSubjectDisplay('English (እንግሊዝኛ)')}</option>
                    <option value="Afaan Oromoo">{getSubjectDisplay('Afaan Oromoo')}</option>
                    <option value="Chemistry (ኬሚስትሪ)">{getSubjectDisplay('Chemistry (ኬሚስትሪ)')}</option>
                    <option value="Biology (ባዮሎጂ)">{getSubjectDisplay('Biology (ባዮሎጂ)')}</option>
                    <option value="Civics (ስነ-ዜጋ)">{getSubjectDisplay('Civics (ስነ-ዜጋ)')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t3('Kutaa', 'Grade', 'ክፍል')}
                  </label>
                  <select
                    value={hwGrade}
                    onChange={(e) => setHwGrade(Number(e.target.value))}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value={9}>{t3('Kutaa 9ffaa', 'Grade 9', '9ኛ ክፍል')}</option>
                    <option value={10}>{t3('Kutaa 10ffaa', 'Grade 10', '10ኛ ክፍል')}</option>
                    <option value={11}>{t3('Kutaa 11ffaa', 'Grade 11', '11ኛ ክፍል')}</option>
                    <option value={12}>{t3('Kutaa 12ffaa', 'Grade 12', '12ኛ ክፍል')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t3('Daree', 'Section', 'ሴክሽን')}
                  </label>
                  <select
                    value={hwSection}
                    onChange={(e) => setHwSection(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t3('Mata Duree Hojii Manaa *', 'Homework Title *', 'የቤት ስራው ርዕስ *')}
                </label>
                <input
                  type="text"
                  required
                  value={hwTitle}
                  onChange={(e) => setHwTitle(e.target.value)}
                  placeholder={t3('Fakkeenyaaf: Seera Sochii Niiwutenii fi Herrega Veektarii...', 'e.g., Newton’s Laws of Motion & Vectors...', 'ምሳሌ፡ የኒውተን እንቅስቃሴ ህጎች እና የቬክተር ስሌት...')}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t3('Ibsa Bal’aa Gaaffilee ykn Hojii *', 'Questions or Assignment Instructions *', 'የጥያቄዎች ወይም ስራው ዝርዝር መግለጫ *')}
                </label>
                <textarea
                  required
                  rows={4}
                  value={hwDescription}
                  onChange={(e) => setHwDescription(e.target.value)}
                  placeholder={t3('Gaaffilee ykn qajeelfama asitti barreessaa...', 'Write questions or instructions here...', 'ጥያቄዎችን ወይም መመሪያዎችን እዚህ ይጻፉ...')}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t3('Guyyaa Xumuraa Dhiyeessii *', 'Submission Due Date *', 'የማስረከቢያ የመጨረሻ ቀን *')}
                  </label>
                  <input
                    type="date"
                    required
                    value={hwDueDate}
                    onChange={(e) => setHwDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t3('Qabxii Ol’aanaa *', 'Max Score *', 'ከፍተኛ ነጥብ *')}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    required
                    value={hwMaxScore}
                    onChange={(e) => setHwMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddHwModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {t3('Haqi', 'Cancel', 'ሰርዝ')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-slate-950 text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{t3('Hojii Manaa Kenni', 'Assign Homework', 'የቤት ስራውን ስጥ')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Grade Submission */}
      {selectedSubForGrading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-950 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">
                  {t3('Sirreeffama Deebii Barataa fi Kenninsa Qabxii', 'Grade Student Submission', 'የተማሪ መልስ እርማት እና ነጥብ መስጫ')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubForGrading(null)}
                className="text-emerald-200 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="p-6 space-y-4">
              <div>
                <span className="text-xs text-slate-500 font-semibold">
                  {t3('Maqaa Barataa:', 'Student Name:', 'የተማሪ ስም፡')}
                </span>
                <p className="text-sm font-bold text-slate-900">{selectedSubForGrading.studentName}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t3('Qabxii Kenname (Score) *', 'Score Awarded *', 'የተሰጠ ነጥብ (Score) *')}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min={0}
                  required
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono font-bold text-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t3('Yaada Ijaaraa Barsiisaa (Teacher Feedback)', 'Teacher Feedback', 'የመምህሩ ገንቢ አስተያየት (Teacher Feedback)')}
                </label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder={t3('Fakkeenyaaf: Hojii baay’ee gaariidha! Herregni isaa sirriidha...', 'e.g., Great work! Calculations are accurate...', 'ምሳሌ፡ በጣም ጥሩ ስራ ነው! ስሌቱ ትክክል ነው...')}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubForGrading(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {t3('Haqi', 'Cancel', 'ሰርዝ')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>{t3('Qabxii Galmeessi', 'Save Grade', 'ውጤቱን መዝግብ')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Attendance Scanner & Daily Code Modal */}
      <StudentQRAttendanceModal
        isOpen={showQrModal}
        onClose={() => {
          setShowQrModal(false);
          setAttendanceRecords(
            StorageService.getAttendance(school.id, undefined, selectedDate)
          );
        }}
        school={school}
        students={students}
        currentUser={currentUser}
        currentLang={currentLang}
        onAttendanceRecorded={() => {
          setAttendanceRecords(
            StorageService.getAttendance(school.id, undefined, selectedDate)
          );
        }}
      />
    </div>
  );
};
