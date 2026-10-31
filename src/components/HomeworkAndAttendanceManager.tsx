import React, { useState } from 'react';
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
  QrCode
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
      teacherName: currentUser?.name || 'መ/ር በፈቃዱ ጥላሁን',
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
    if (confirm('ይህን የቤት ስራ መሰረዝ ይፈልጋሉ?')) {
      StorageService.deleteHomework(id);
      setAssignments(StorageService.getHomework(school.id));
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
      recordedBy: currentUser?.name || 'መ/ር በፈቃዱ ጥላሁን'
    };

    StorageService.markAttendance(record);
    setAttendanceRecords(StorageService.getAttendance(school.id, undefined, selectedDate));

    // Enqueue attendance for offline synchronization
    OfflineSyncManager.enqueue(
      'student_performance',
      'update',
      record.id,
      record,
      {
        authorName: currentUser?.name || 'መምህር',
        schoolName: school.name,
        description: `የተማሪ ${student.fullName} የመገኘት ሁኔታ (${status === 'present' ? 'ተገኝቷል' : status === 'absent' ? 'ቀሪ' : 'ፈቃድ'})`
      }
    );

    setAttendanceSavedMessage(true);
    setTimeout(() => setAttendanceSavedMessage(false), 2000);
  };

  // Strict Work Isolation for Teachers:
  // "አንዱ የአንዱን ስራ ሳያይ ሁሉም የየራሳቸውን ስራ እንዲሰሩ"
  const isTeacherUser = currentUser?.role === 'teacher';

  const visibleAssignments = assignments.filter((hw) => {
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
              <span>የመምህራን እና የአካዳሚክ ስራ አመራር ክፍል</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              የቤት ስራ (Homework) እና ዕለታዊ መገኘት (Attendance)
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              ለመማሪያ ክፍሎች የቤት ስራ የመስጠት፣ የተማሪዎችን መልስ የማረም እና ነጥብ የመስጠት፤ እንዲሁም
              የተማሪዎችን ዕለታዊ መገኘት በቅጽበት የመመዝገቢያ ማዕከል
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddHwModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>አዲስ የቤት ስራ ስጥ (New Homework)</span>
            </button>
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
                ይፋዊ የትምህርት ቢሮ ስልጠና
              </span>
              <span className="text-[10px] text-amber-300 font-medium">
                ቀጥታ የተላከለት መምህር
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-black text-white mt-0.5">
              ለመምህር {currentUser?.name || 'በፈቃዱ ጥላሁን'} ለሚያስተምሩት{' '}
              <span className="text-amber-300 underline font-bold">[{detectedTeacherSubject}]</span>{' '}
              ትምህርት የተላኩ ይፋዊ የስልጠና ሞጁሎች
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
          <span>{activeTab === 'bureau_training' ? 'ስልጠናውን እየተመለከቱ ነው' : 'ስልጠናዎችን ተመልከት'}</span>
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
          <span>ከትምህርት ቢሮ የተላኩ ስልጠናዎች</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
            ይፋዊ ሞጁሎች
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
              ? `የእኔ የቤት ስራዎች (${visibleAssignments.length})`
              : `የቤት ስራዎች እና ምልጃዎች (${visibleAssignments.length})`}
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
          <span>የተማሪዎች ዕለታዊ መገኘት (Daily Attendance Sheet)</span>
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
                  <strong>የተከለለ የመምህር የስራ ገጽ ({currentUser?.name})፡</strong> ለእርስዎ የተመደቡ
                  የትምህርት ክፍለ ጊዜያትና የቤት ስራዎች ብቻ ተለይተዋል። ሌሎች መምህራን የእርስዎን አያዩም፤ እርስዎም የሌሎችን
                  አያዩም።
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 uppercase font-mono shrink-0">
                የተለየ የስራ ወሰን
              </span>
            </div>
          )}

          {visibleAssignments.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">ምንም የተመደበ የቤት ስራ የለም</p>
              <p className="text-[11px] text-slate-500">
                በቀኝ በኩል ያለውን "አዲስ የቤት ስራ ስጥ" ቁልፍ በመጫን ለክፍልዎ የቤት ስራ መስጠት ይችላሉ።
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleAssignments.map((hw) => {
                const hwSubs = submissions.filter((s) => s.assignmentId === hw.id);
                const gradedCount = hwSubs.filter((s) => s.status === 'graded').length;
                const canDelete = !isTeacherUser || hw.teacherName === currentUser?.name;
                return (
                  <div
                    key={hw.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          {hw.subject}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{hw.title}</h3>
                        <p className="text-[11px] text-slate-500">
                          ክፍል፡ {hw.grade}ኛ ({hw.section}) · መምህር፡ {hw.teacherName}
                        </p>
                      </div>

                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDeleteHomework(hw.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="ሰርዝ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
                    {hw.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <span className="text-slate-500 font-medium font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      የመጨረሻ ቀን፡ {hw.dueDate}
                    </span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      ከፍተኛ ነጥብ፡ {hw.maxScore}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      የገቡ መልሶች፡ <strong>{hwSubs.length}</strong> (የታረሙ፡ {gradedCount})
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedAssignmentForReview(hw)}
                      className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>የተማሪዎችን መልስ እረም ({hwSubs.length})</span>
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
                    የተማሪዎች መልሶች ማረሚያ፡ {selectedAssignmentForReview.title}
                  </h3>
                  <p className="text-xs text-slate-600">
                    የተማሪዎችን መልስ አይተው ነጥብ እና ገንቢ አስተያየት ይስጡ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAssignmentForReview(null)}
                  className="px-3 py-1 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  ዝጋ ✕
                </button>
              </div>

              {submissions.filter((s) => s.assignmentId === selectedAssignmentForReview.id).length ===
              0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-500">ለዚህ የቤት ስራ እስካሁን የገባ የተማሪ መልስ የለም።</p>
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
                              ({sub.grade}ኛ ክፍል - {sub.section})
                            </span>
                            <span
                              className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                                sub.status === 'graded'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {sub.status === 'graded' ? 'የታረመ' : 'እርማት የሚጠብቅ'}
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
                              <span>{sub.status === 'graded' ? 'ውጤት ቀይር' : 'እረም & ነጥብ ስጥ'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-800 whitespace-pre-line leading-relaxed border border-slate-200">
                          {sub.submissionText}
                        </div>

                        {sub.status === 'graded' && (
                          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                            <span className="font-bold text-emerald-950">
                              የተሰጠ ውጤት፡{' '}
                              <strong className="text-emerald-800 font-mono text-sm">
                                {sub.score} / {selectedAssignmentForReview.maxScore}
                              </strong>
                            </span>
                            <span className="text-emerald-800 italic">
                              "{sub.teacherFeedback || 'ጥሩ ስራ'}"
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
                የተማሪዎች ዕለታዊ መገኘት መመዝገቢያ ቅጽ (Daily Attendance)
              </h3>
              <p className="text-xs text-slate-500">
                በቀን፣ በክፍል እና በሴክሽን ተማሪዎች መገኘታቸውን፣ ማርፈዳቸውን ወይም መቅረታቸውን መመዝገቢያ
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-amber-300" />
                <span>በ QR መገኘት መዝግብ (QR Scan)</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-semibold">ቀን፡</span>
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
                <span className="text-slate-500 font-semibold">ክፍል፡</span>
                <select
                  value={selectedGradeFilter}
                  onChange={(e) => setSelectedGradeFilter(Number(e.target.value))}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-bold bg-white"
                >
                  <option value={9}>9ኛ ክፍል</option>
                  <option value={10}>10ኛ ክፍል</option>
                  <option value={11}>11ኛ ክፍል</option>
                  <option value={12}>12ኛ ክፍል</option>
                </select>
              </div>
            </div>
          </div>

          {attendanceSavedMessage && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 font-bold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>የተማሪው መገኘት ተመዝግቧል!</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">የተማሪ ስም</th>
                  <th className="py-3 px-3">ክፍል</th>
                  <th className="py-3 px-3">ወላጅ</th>
                  <th className="py-3 px-3">የመገኘት ሁኔታ (ጠቅ አድርገው ይምረጡ)</th>
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
                        {st.grade}ኛ ክፍል ({st.section})
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {st.parentName} ({st.parentPhone})
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleAttendance(st, 'present')}
                            className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                              currentStatus === 'present'
                                ? 'bg-emerald-700 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>ተገኝቷል (Present)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleAttendance(st, 'absent')}
                            className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                              currentStatus === 'absent'
                                ? 'bg-rose-700 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <UserX className="w-3 h-3" />
                            <span>ቀርቷል (Absent)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleAttendance(st, 'late')}
                            className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                              currentStatus === 'late'
                                ? 'bg-amber-600 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>ዘግይቷል (Late)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleAttendance(st, 'excused')}
                            className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                              currentStatus === 'excused'
                                ? 'bg-blue-700 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <span>በፈቃድ (Excused)</span>
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
                <h3 className="font-bold text-base">አዲስ የቤት ስራ (Homework Assignment) መስጫ</h3>
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
                    የትምህርት አይነት *
                  </label>
                  <select
                    value={hwSubject}
                    onChange={(e) => setHwSubject(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Physics (ፊዚክስ)">Physics (ፊዚክስ)</option>
                    <option value="Mathematics (ሒሳብ)">Mathematics (ሒሳብ)</option>
                    <option value="English (እንግሊዝኛ)">English (እንግሊዝኛ)</option>
                    <option value="Afaan Oromoo">Afaan Oromoo</option>
                    <option value="Chemistry (ኬሚስትሪ)">Chemistry (ኬሚስትሪ)</option>
                    <option value="Biology (ባዮሎጂ)">Biology (ባዮሎጂ)</option>
                    <option value="Civics (ስነ-ዜጋ)">Civics (ስነ-ዜጋ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ክፍል
                  </label>
                  <select
                    value={hwGrade}
                    onChange={(e) => setHwGrade(Number(e.target.value))}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value={9}>9ኛ ክፍል</option>
                    <option value={10}>10ኛ ክፍል</option>
                    <option value={11}>11ኛ ክፍል</option>
                    <option value={12}>12ኛ ክፍል</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ሴክሽን
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
                  የቤት ስራው ርዕስ *
                </label>
                <input
                  type="text"
                  required
                  value={hwTitle}
                  onChange={(e) => setHwTitle(e.target.value)}
                  placeholder="ምሳሌ፡ የኒውተን እንቅስቃሴ ህጎች እና የቬክተር ስሌት..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  የጥያቄዎች ወይም ስራው ዝርዝር መግለጫ *
                </label>
                <textarea
                  required
                  rows={4}
                  value={hwDescription}
                  onChange={(e) => setHwDescription(e.target.value)}
                  placeholder="ጥያቄዎችን ወይም መመሪያዎችን እዚህ ይጻፉ..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    የማስረከቢያ የመጨረሻ ቀን *
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
                    ከፍተኛ ነጥብ *
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
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-slate-950 text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>የቤት ስራውን ስጥ</span>
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
                <h3 className="font-bold text-base">የተማሪ መልስ እርማት እና ነጥብ መስጫ</h3>
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
                <span className="text-xs text-slate-500 font-semibold">የተማሪ ስም፡</span>
                <p className="text-sm font-bold text-slate-900">{selectedSubForGrading.studentName}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  የተሰጠ ነጥብ (Score) *
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
                  የመምህሩ ገንቢ አስተያየት (Teacher Feedback)
                </label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="ምሳሌ፡ በጣም ጥሩ ስራ ነው! ስሌቱ ትክክል ነው..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubForGrading(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>ውጤቱን መዝግብ</span>
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
