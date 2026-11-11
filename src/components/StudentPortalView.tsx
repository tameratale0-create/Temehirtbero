import React, { useState, useMemo, useEffect } from 'react';
import {
  GraduationCap,
  Award,
  FileText,
  Printer,
  CheckCircle2,
  Calendar,
  Building2,
  BookOpen,
  Users,
  CreditCard,
  QrCode,
  BarChart3,
  TrendingUp,
  Sparkles,
  Layers,
  Clock,
  Filter,
  Send,
  DollarSign,
  Megaphone,
  UserCheck,
  UserX,
  AlertTriangle,
  Receipt,
  Download,
  Star,
  ShieldCheck,
  FileCheck,
  Check,
  Bell,
  BellRing,
  X,
  ChevronRight,
  Eye,
  Volume2,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  Cell
} from 'recharts';
import {
  Language,
  StudentRecord,
  School,
  HomeworkAssignment,
  HomeworkSubmission,
  FeePaymentRecord,
  StudentAttendanceRecord,
  SchoolAnnouncement,
  AcademicPeriodType,
  AcademicGradeWorkflowBatch,
  StudentReportNotification,
  AppUserSession
} from '../types';
import { translations } from '../data/translations';
import { StorageService } from '../utils/storage';
import { getLocalizedSchool, getLocalizedStudents } from '../utils/localizedData';
import { StudentIDCardModal } from './StudentIDCardModal';
import { StudentQRAttendanceModal } from './StudentQRAttendanceModal';
import { TeacherEvaluationModal } from './TeacherEvaluationModal';
import { StudentDisciplineDesk } from './StudentDisciplineDesk';
import { StudentAnnualFeeDesk } from './StudentAnnualFeeDesk';
import { AudioTranscriber } from './AudioTranscriber';
import { SchoolLogo } from './SchoolLogo';

interface StudentPortalViewProps {
  currentLang: Language;
  student: StudentRecord;
  school?: School;
}

type ChartViewMode = 'stacked' | 'grouped' | 'total' | 'timeline';

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  currentLang,
  student,
  school
}) => {
  const t = translations[currentLang];
  const [portalTab, setPortalTab] = useState<'report_card' | 'tuition_fee'>('report_card');
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [showQrAttendanceModal, setShowQrAttendanceModal] = useState(false);
  const [showTeacherEvaluationModal, setShowTeacherEvaluationModal] = useState(false);
  const [showDisciplineModal, setShowDisciplineModal] = useState(false);
  const [chartMode, setChartMode] = useState<ChartViewMode>('stacked');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<AcademicPeriodType>('semester_1');

  // Student Fee records for badge status
  const studentFeePayments = useMemo(() => {
    return StorageService.getFeePayments(student.schoolId, student.id);
  }, [student.schoolId, student.id]);

  // Academic Grade Workflows for Period Tracking & Official Approval Seal
  const schoolGradeWorkflows = useMemo(() => {
    return StorageService.getGradeWorkflows(student.schoolId);
  }, [student.schoolId]);

  const activePeriodWorkflows = useMemo(() => {
    return schoolGradeWorkflows.filter(
      (w) =>
        w.grade === student.grade &&
        (w.section === student.section || w.section === 'All' || !w.section) &&
        w.period === selectedPeriod
    );
  }, [schoolGradeWorkflows, student.grade, student.section, selectedPeriod]);

  const approvedBatch = useMemo(() => {
    return activePeriodWorkflows.find((w) => w.status === 'director_approved');
  }, [activePeriodWorkflows]);

  const pendingBatch = useMemo(() => {
    return activePeriodWorkflows.find((w) => w.status !== 'director_approved');
  }, [activePeriodWorkflows]);

  // Check if student has specific entry in the approved batch
  const studentBatchEntry = useMemo(() => {
    if (!approvedBatch) return null;
    return approvedBatch.entries.find(
      (s) =>
        s.studentId === student.id ||
        s.studentIdNumber === student.studentIdNumber ||
        s.studentName.trim().toLowerCase() === student.fullName.trim().toLowerCase()
    );
  }, [approvedBatch, student.id, student.studentIdNumber, student.fullName]);

  const getPeriodLabel = (p: AcademicPeriodType) => {
    switch (p) {
      case 'quarter_1':
        return '1ኛ ሩብ ዓመት (Quarter 1)';
      case 'quarter_2':
        return '2ኛ ሩብ ዓመት (Quarter 2)';
      case 'semester_1':
        return '1ኛ ሴሚስተር (Semester 1)';
      case 'quarter_3':
        return '3ኛ ሩብ ዓመት (Quarter 3)';
      case 'quarter_4':
        return '4ኛ ሩብ ዓመት (Quarter 4)';
      case 'semester_2':
        return '2ኛ ሴሚስተር (Semester 2)';
      case 'annual':
        return 'የሙሉ ዓመት ማጠቃለያ (Annual)';
      default:
        return p;
    }
  };

  // Automated Status Update Flow: Notifications & Toasts
  const [notifications, setNotifications] = useState<StudentReportNotification[]>(() =>
    StorageService.getStudentReportNotifications({
      schoolId: student.schoolId,
      grade: student.grade,
      section: student.section,
      studentId: student.id
    })
  );

  const [activeToast, setActiveToast] = useState<StudentReportNotification | null>(null);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState<boolean>(false);
  const [hasShownInitialToast, setHasShownInitialToast] = useState<boolean>(false);

  // Sound chime synthesizer for live approval notification
  const playApprovalChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Note 1: E5 (659.25Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.45);

      // Note 2: G#5 (830.61Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(830.61, now + 0.12);
      gain2.gain.setValueAtTime(0.15, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.6);

      // Note 3: B5 (987.77Hz)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(987.77, now + 0.24);
      gain3.gain.setValueAtTime(0.18, now + 0.24);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now + 0.24);
      osc3.stop(now + 0.85);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const unreadNotifications = useMemo(() => {
    return notifications.filter((n) => !n.isRead);
  }, [notifications]);

  // Real-time Automated Status Update Listener:
  // When director approves in the School Portal, student/parent portal reacts immediately!
  useEffect(() => {
    const handleApprovalEvent = (e: any) => {
      const notif: StudentReportNotification = e.detail;
      const refreshed = StorageService.getStudentReportNotifications({
        schoolId: student.schoolId,
        grade: student.grade,
        section: student.section,
        studentId: student.id
      });
      setNotifications(refreshed);

      // Trigger interactive visual toast if this belongs to student's school/grade
      if (notif && (!notif.grade || notif.grade === student.grade)) {
        setActiveToast(notif);
        playApprovalChime();
      }
    };

    const handleUpdateEvent = () => {
      const refreshed = StorageService.getStudentReportNotifications({
        schoolId: student.schoolId,
        grade: student.grade,
        section: student.section,
        studentId: student.id
      });
      setNotifications(refreshed);
    };

    window.addEventListener('director_report_approved', handleApprovalEvent);
    window.addEventListener('director_report_notification_updated', handleUpdateEvent);
    window.addEventListener('storage', handleUpdateEvent);

    return () => {
      window.removeEventListener('director_report_approved', handleApprovalEvent);
      window.removeEventListener('director_report_notification_updated', handleUpdateEvent);
      window.removeEventListener('storage', handleUpdateEvent);
    };
  }, [student.schoolId, student.grade, student.section, student.id]);

  // Show toast on first entry if there are unread approvals ready for viewing
  useEffect(() => {
    if (!hasShownInitialToast && unreadNotifications.length > 0) {
      setActiveToast(unreadNotifications[0]);
      setHasShownInitialToast(true);
    }
  }, [hasShownInitialToast, unreadNotifications]);

  const handleViewReportFromNotification = (notif: StudentReportNotification) => {
    setSelectedPeriod(notif.period);
    StorageService.markNotificationAsRead(notif.id);
    setActiveToast(null);
    setShowNotificationDrawer(false);

    setTimeout(() => {
      const el = document.getElementById('report-card-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  const totalPossible = student.scores.length * 100;
  const totalEarned = student.scores.reduce((a, b) => a + b.total, 0);
  const averagePercentage =
    student.scores.length > 0 ? (totalEarned / student.scores.length).toFixed(1) : '0';

  // Format short label for XAxis
  const formatShortSubject = (name: string) => {
    if (name.includes('Mathematics') || name.includes('ሂሳብ')) return 'ሂሳብ (Math)';
    if (name.includes('English') || name.includes('እንግሊዝኛ')) return 'እንግሊዝኛ (Eng)';
    if (name.includes('Afaan Oromoo') || name.includes('ኦሮሚኛ')) return 'Afaan Oromoo';
    if (name.includes('Physics') || name.includes('ፊዚክስ')) return 'ፊዚክስ (Phys)';
    if (name.includes('Chemistry') || name.includes('ኬሚስትሪ')) return 'ኬሚስትሪ (Chem)';
    if (name.includes('Biology') || name.includes('ባዮሎጂ')) return 'ባዮሎጂ (Bio)';
    if (name.includes('Citizenship') || name.includes('ስነ-ዜጋ')) return 'ስነ-ዜጋ (Civics)';
    return name.split(' ')[0];
  };

  // Prepare data for subject comparative bar chart
  const subjectChartData = useMemo(() => {
    return student.scores.map((sc) => ({
      name: formatShortSubject(sc.subject),
      fullName: sc.subject,
      quizzes: sc.quiz1 + sc.quiz2, // out of 20
      midExam: sc.midExam, // out of 30
      finalExam: sc.finalExam, // out of 50
      total: sc.total, // out of 100
      gradeLetter: sc.gradeLetter
    }));
  }, [student.scores]);

  // Prepare data for assessment timeline progression over time
  const timelineData = useMemo(() => {
    if (selectedSubjectFilter !== 'all') {
      const target = student.scores.find((s) => s.subject === selectedSubjectFilter);
      if (target) {
        return [
          {
            stage: 'ፈተና 1 (Quiz 1)',
            earned: target.quiz1,
            max: 10,
            percentage: (target.quiz1 / 10) * 100
          },
          {
            stage: 'ፈተና 2 (Quiz 2)',
            earned: target.quiz2,
            max: 10,
            percentage: (target.quiz2 / 10) * 100
          },
          {
            stage: 'ግማሽ ዓመት (Mid-Exam)',
            earned: target.midExam,
            max: 30,
            percentage: Math.round((target.midExam / 30) * 100)
          },
          {
            stage: 'ማጠቃለያ (Final Exam)',
            earned: target.finalExam,
            max: 50,
            percentage: Math.round((target.finalExam / 50) * 100)
          }
        ];
      }
    }

    // Default average progress across all subjects over the academic term
    const count = student.scores.length || 1;
    const avgQuiz1 = student.scores.reduce((a, b) => a + b.quiz1, 0) / count;
    const avgQuiz2 = student.scores.reduce((a, b) => a + b.quiz2, 0) / count;
    const avgMid = student.scores.reduce((a, b) => a + b.midExam, 0) / count;
    const avgFinal = student.scores.reduce((a, b) => a + b.finalExam, 0) / count;

    return [
      {
        stage: '1. ፈተና 1 (Quiz 1)',
        earned: Number(avgQuiz1.toFixed(1)),
        max: 10,
        percentage: Number(((avgQuiz1 / 10) * 100).toFixed(1))
      },
      {
        stage: '2. ፈተና 2 (Quiz 2)',
        earned: Number(avgQuiz2.toFixed(1)),
        max: 10,
        percentage: Number(((avgQuiz2 / 10) * 100).toFixed(1))
      },
      {
        stage: '3. ግማሽ ዓመት (Mid-Exam)',
        earned: Number(avgMid.toFixed(1)),
        max: 30,
        percentage: Number(((avgMid / 30) * 100).toFixed(1))
      },
      {
        stage: '4. የማጠቃለያ ፈተና (Final)',
        earned: Number(avgFinal.toFixed(1)),
        max: 50,
        percentage: Number(((avgFinal / 50) * 100).toFixed(1))
      }
    ];
  }, [student.scores, selectedSubjectFilter]);

  // Custom Recharts Tooltip
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 space-y-1">
          <p className="font-bold text-amber-300">{data.fullName || label}</p>
          <div className="divide-y divide-slate-800 text-[11px] pt-1">
            <p className="flex justify-between gap-4 py-0.5 text-sky-300">
              <span>የክፍል ስራ (Quizzes):</span>
              <strong>{data.quizzes} / 20</strong>
            </p>
            <p className="flex justify-between gap-4 py-0.5 text-amber-300">
              <span>የግማሽ ዓመት (Mid):</span>
              <strong>{data.midExam} / 30</strong>
            </p>
            <p className="flex justify-between gap-4 py-0.5 text-emerald-300">
              <span>የማጠቃለያ ፈተና (Final):</span>
              <strong>{data.finalExam} / 50</strong>
            </p>
            <p className="flex justify-between gap-4 py-0.5 font-bold text-white">
              <span>አጠቃላይ ድምር (Total):</span>
              <span>{data.total} / 100 ({data.gradeLetter})</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Top and Lowest Performing subjects
  const sortedScores = [...student.scores].sort((a, b) => b.total - a.total);
  const topSubject = sortedScores[0];
  const lowestSubject = sortedScores[sortedScores.length - 1];

  const resolvedSchool = useMemo(() => {
    if (school) return getLocalizedSchool(school, currentLang);
    const allSchools = StorageService.getSchools();
    const found =
      allSchools.find((s) => s.id === student.schoolId || s.name === student.schoolName) ||
      allSchools[0];
    return getLocalizedSchool(found, currentLang);
  }, [school, student.schoolId, student.schoolName, currentLang]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto relative">
      {/* =========================================================================
          🔔 AUTOMATED TOAST ALERT: Live Director Approval Notification Toast
         ========================================================================= */}
      {activeToast && (
        <aside aria-label="ይፋዊ የውጤት ማሳወቂያ" className="fixed top-4 right-4 left-4 sm:left-auto z-50 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 text-white rounded-2xl p-4 sm:p-4.5 shadow-2xl border-2 border-emerald-400/80 ring-4 ring-emerald-500/20 space-y-3 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-36 h-36 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0 ring-2 ring-amber-300">
                  <ShieldCheck className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                      የዳይሬክተር ይፋዊ ማረጋገጫ (Approved)
                    </span>
                    <span className="text-[10px] font-bold text-amber-300 font-mono">
                      {activeToast.periodLabel}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white mt-0.5 leading-snug">
                    የተማሪ የውጤት ሪፖርት ለእይታ ዝግጁ ሆኗል!
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  StorageService.markNotificationAsRead(activeToast.id);
                  setActiveToast(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="ዝጋ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-emerald-100/95 leading-relaxed relative z-10 pl-1">
              {activeToast.message}
            </p>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-emerald-700/60 relative z-10">
              <span className="text-[10px] font-mono text-emerald-300 truncate">
                ማህተም፡ {activeToast.sealNumber}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    StorageService.markNotificationAsRead(activeToast.id);
                    setActiveToast(null);
                  }}
                  className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white font-medium rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  አውቄያለሁ
                </button>
                <button
                  type="button"
                  onClick={() => handleViewReportFromNotification(activeToast)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md inline-flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>ካርዱን ተመልከት</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Student Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <SchoolLogo
              logoUrl={school?.logoUrl}
              schoolName={student.schoolName}
              size={52}
              shape="rounded"
              className="ring-2 ring-emerald-400/40 shadow-md shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
                የተማሪ እና ወላጅ ፖርታል (Student & Parent Hub)
              </span>
              <h2 className="text-xl font-bold tracking-tight">{student.fullName}</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {student.schoolName} · ክፍል {student.grade} ክፍልፋይ {student.section} · መታወቂያ: {student.studentIdNumber}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Visual Notification Badge Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md ${
                  unreadNotifications.length > 0
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black ring-2 ring-amber-300'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
                title="የዳይሬክተር የውጤት ማሳወቂያዎች"
              >
                <div className="relative">
                  <Bell className={`w-4 h-4 ${unreadNotifications.length > 0 ? 'fill-slate-950 text-slate-950' : 'text-amber-300'}`} />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  )}
                </div>
                <span>ማሳወቂያዎች</span>
                {unreadNotifications.length > 0 ? (
                  <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                    {unreadNotifications.length} አዲስ
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-300 font-mono">
                    ({notifications.length})
                  </span>
                )}
              </button>

              {/* Notification Center Dropdown */}
              {showNotificationDrawer && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-3.5 bg-gradient-to-r from-emerald-950 to-teal-900 text-white flex items-center justify-between border-b border-emerald-800">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                      <h4 className="text-xs font-bold">የዳይሬክተር ይፋዊ የውጤት ማሳወቂያዎች</h4>
                    </div>
                    {unreadNotifications.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          StorageService.markAllNotificationsAsRead({
                            schoolId: student.schoolId,
                            grade: student.grade,
                            section: student.section
                          })
                        }
                        className="text-[10px] text-amber-300 hover:underline cursor-pointer"
                      >
                        ሁሉንም አንብብ
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        እስካሁን ምንም የዳይሬክተር ማሳወቂያ የለም
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-xl transition-all ${
                            !notif.isRead
                              ? 'bg-amber-50/80 border-l-4 border-amber-500'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              {notif.periodLabel}
                            </span>
                            <span className="text-[9px] text-slate-400">
                              {notif.approvedAt ? notif.approvedAt.split('T')[0] : 'ቀን'}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-900 mt-1.5 leading-snug">
                            {notif.message}
                          </p>
                          <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-100 text-[10px]">
                            <span className="font-mono text-slate-500">{notif.sealNumber}</span>
                            <button
                              type="button"
                              onClick={() => handleViewReportFromNotification(notif)}
                              className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <span>ካርዱን ተመልከት</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowDisciplineModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-black rounded-xl transition-all shadow-md hover:scale-102 cursor-pointer border border-rose-400/50"
              title="ስነ-ምግባር ችግር ያለባቸውን ተማሪዎች ለትምህርት ቤት ዳይሬክተር በምስጢር ወይም በግልጽ መጠቆሚያ"
            >
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              <span>🚨 የስነ-ምግባር ጥቆማ ለዳይሬክተር (Report Misconduct)</span>
            </button>
            <button
              type="button"
              onClick={() => setShowTeacherEvaluationModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md hover:scale-102 cursor-pointer"
            >
              <Star className="w-4 h-4 fill-slate-950" />
              <span>መምህራንን ገምግም (Rate Teachers)</span>
            </button>
            <button
              type="button"
              onClick={() => setShowQrAttendanceModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md hover:scale-102 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-slate-950" />
              <span>መገኘት በ QR መዝግብ (Check-in)</span>
            </button>
            <button
              onClick={() => setShowIdCardModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-amber-300" />
              <span>{t.btn_student_id_card}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t.btn_print_card}</span>
            </button>
            <button
              type="button"
              onClick={() => setPortalTab(portalTab === 'tuition_fee' ? 'report_card' : 'tuition_fee')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl transition-all shadow-md hover:scale-102 cursor-pointer ${
                portalTab === 'tuition_fee'
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white'
              }`}
            >
              <Receipt className="w-4 h-4 text-white" />
              <span>የወር ክፍያና ደረሰኝ (Tuition Fees)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Main Navigation Tabs: Report Card vs Annual Tuition Fees */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/90 rounded-2xl border border-slate-300">
        <button
          type="button"
          onClick={() => setPortalTab('report_card')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            portalTab === 'report_card'
              ? 'bg-white text-emerald-950 shadow-md ring-1 ring-slate-200'
              : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-emerald-700" />
          <span>የተማሪ የውጤት ካርድና ትምህርታዊ ትንታኔ (Report Card)</span>
        </button>

        <button
          type="button"
          onClick={() => setPortalTab('tuition_fee')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            portalTab === 'tuition_fee'
              ? 'bg-emerald-900 text-white shadow-md ring-2 ring-emerald-500/50'
              : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
          }`}
        >
          <Receipt className="w-4 h-4 text-emerald-300" />
          <span>የአመቱ ሙሉ የወር ክፍያ ሰንጠረዥና ደረሰኝ (Annual Tuition Fees)</span>
        </button>
      </div>

      {portalTab === 'tuition_fee' ? (
        <StudentAnnualFeeDesk
          student={student}
          school={resolvedSchool}
          currentLang={currentLang}
        />
      ) : (
        <>
          {/* Automated Status Update Alert Callout Banner */}
          {unreadNotifications.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white rounded-2xl p-4 sm:p-4.5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-2 border-emerald-400/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  አዲስ የጸደቀ ሪፖርት
                </span>
                <span className="text-xs font-bold text-emerald-100">
                  {unreadNotifications[0].periodLabel}
                </span>
              </div>
              <h4 className="text-sm font-black text-white mt-0.5">
                {unreadNotifications[0].message}
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleViewReportFromNotification(unreadNotifications[0])}
            className="w-full sm:w-auto px-4 py-2 bg-white text-emerald-950 font-black text-xs rounded-xl shadow-md hover:bg-emerald-50 transition-all shrink-0 inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-emerald-800" />
            <span>ካርዱን ወዲያውኑ አሳይ</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Teacher Evaluation & Feedback Callout Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-teal-500/15 border-2 border-amber-400/40 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
            <Star className="w-6 h-6 fill-slate-950 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                የትምህርት ቢሮ ይፋዊ የተማሪ/ወላጅ ግብዓት
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
              መምህራንዎ እንዴት እያስተማሩ ነው? የማስተማር ብቃታቸውን ይመዝኑ
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              የማስተማር ብቃታቸው፣ የትምህርት አሰጣጡ እና ተነሳሽነታቸው ለእያንዳንዳቸው ከ 10 ነጥብ በመመዘን ወደ ሻሸመኔ ትምህርት ቢሮ ይላኩ።
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTeacherEvaluationModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md hover:scale-102 cursor-pointer flex items-center gap-2 shrink-0"
        >
          <Star className="w-4 h-4 fill-slate-950" />
          <span>መምህራንን ገምግም (Rate Teachers)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block mb-1">የክፍል ደረጃ (Rank)</span>
          <span className="text-2xl font-extrabold text-emerald-800">
            #{student.rank}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">በክፍሉ ውስጥ</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block mb-1">አማካይ ውጤት</span>
          <span className="text-2xl font-extrabold text-slate-900">
            {averagePercentage}%
          </span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">የላቀ ውጤት</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block mb-1">የስነ-ምግባር ውጤት</span>
          <span className="text-2xl font-extrabold text-emerald-800">
            {student.conduct}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">ምርጥ ስነ-ምግባር</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block mb-1">የመገኘት ምጣኔ</span>
          <span className="text-2xl font-extrabold text-slate-900">
            {student.attendanceRate}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">መደበኛ ተሳትፎ</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RECHARTS BAR CHART VISUALIZATION SECTION                 */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                የትምህርት አይነቶች ውጤት እና የምዘና ሂደት ግራፍ (Subject Grades Visualization)
              </h3>
              <p className="text-[11px] text-slate-500">
                የክፍል ፈተናዎች፣ የግማሽ ዓመት (Mid) እና የማጠቃለያ ፈተናዎችን በግራፍ ተመልከት
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setChartMode('stacked')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                chartMode === 'stacked'
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              የውጤት ክፍፍል (Stacked)
            </button>
            <button
              onClick={() => setChartMode('grouped')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                chartMode === 'grouped'
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              የምዘና ንጽጽር (Grouped)
            </button>
            <button
              onClick={() => setChartMode('total')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                chartMode === 'total'
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              አጠቃላይ (Total)
            </button>
            <button
              onClick={() => setChartMode('timeline')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                chartMode === 'timeline'
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              በጊዜ ሂደት (Timeline)
            </button>
          </div>
        </div>

        {/* Timeline specific filter if in timeline mode */}
        {chartMode === 'timeline' && (
          <div className="flex items-center gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600">የትምህርት አይነት ምረጥ፡</span>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-800 focus:outline-hidden"
            >
              <option value="all">ሁሉም የትምህርት አይነቶች አማካይ (All Subjects Average)</option>
              {student.scores.map((sc, idx) => (
                <option key={idx} value={sc.subject}>
                  {sc.subject} (ድምር፡ {sc.total}%)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Recharts Bar Chart Container */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'timeline' ? (
              /* Timeline Bar Chart: Stage 1 Quiz 1 -> Stage 2 Quiz 2 -> Stage 3 Mid -> Stage 4 Final */
              <BarChart
                data={timelineData}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="stage"
                  tick={{ fontSize: 11, fill: '#475569' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  unit="%"
                  tick={{ fontSize: 11, fill: '#475569' }}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${value}% (${item.payload.earned} / ${item.payload.max} ነጥብ)`,
                    'የተመዘገበ ምጣኔ'
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '11px'
                  }}
                />
                <ReferenceLine
                  y={50}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{ value: 'የማለፊያ መስመር (50%)', fill: '#ef4444', fontSize: 10, position: 'insideTopLeft' }}
                />
                <ReferenceLine
                  y={85}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  label={{ value: 'የላቀ ደረጃ (85%)', fill: '#059669', fontSize: 10, position: 'insideTopLeft' }}
                />
                <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                  {timelineData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? '#0284c7'
                          : index === 1
                          ? '#38bdf8'
                          : index === 2
                          ? '#f59e0b'
                          : '#10b981'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : chartMode === 'stacked' ? (
              /* Stacked Bar Chart: Quizzes (20) + Mid (30) + Final (50) = Total 100 */
              <BarChart
                data={subjectChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#334155' }}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  domain={[0, 100]}
                  unit="%"
                  tick={{ fontSize: 11, fill: '#475569' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '15px', fontSize: '11px' }}
                />
                <ReferenceLine
                  y={50}
                  stroke="#f43f5e"
                  strokeDasharray="4 4"
                  label={{ value: 'ማለፊያ (50%)', fill: '#f43f5e', fontSize: 10, position: 'insideTopLeft' }}
                />
                <ReferenceLine
                  y={85}
                  stroke="#059669"
                  strokeDasharray="4 4"
                  label={{ value: 'የላቀ ውጤት (85%)', fill: '#059669', fontSize: 10, position: 'insideTopLeft' }}
                />
                <Bar
                  dataKey="quizzes"
                  name="የክፍል ፈተናዎች (20%)"
                  stackId="a"
                  fill="#0284c7"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="midExam"
                  name="የግማሽ ዓመት ፈተና (30%)"
                  stackId="a"
                  fill="#f59e0b"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="finalExam"
                  name="የማጠቃለያ ፈተና (50%)"
                  stackId="a"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            ) : chartMode === 'grouped' ? (
              /* Grouped Side-by-Side Comparison */
              <BarChart
                data={subjectChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#334155' }}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  domain={[0, 60]}
                  tick={{ fontSize: 11, fill: '#475569' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '11px' }} />
                <Bar
                  dataKey="quizzes"
                  name="የክፍል ፈተናዎች (ከ 20)"
                  fill="#0284c7"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="midExam"
                  name="የግማሽ ዓመት (ከ 30)"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="finalExam"
                  name="የማጠቃለያ ፈተና (ከ 50)"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : (
              /* Total Score Out of 100 with Color Code */
              <BarChart
                data={subjectChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#334155' }}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  domain={[0, 100]}
                  unit="%"
                  tick={{ fontSize: 11, fill: '#475569' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <ReferenceLine
                  y={85}
                  stroke="#059669"
                  strokeDasharray="4 4"
                  label={{ value: '85%+', fill: '#059669', fontSize: 10, position: 'insideTopLeft' }}
                />
                <Bar dataKey="total" name="አጠቃላይ ውጤት (100%)" radius={[6, 6, 0, 0]}>
                  {subjectChartData.map((entry, index) => (
                    <Cell
                      key={`cell-total-${index}`}
                      fill={
                        entry.total >= 90
                          ? '#047857' // deep emerald
                          : entry.total >= 80
                          ? '#10b981' // emerald
                          : entry.total >= 70
                          ? '#f59e0b' // amber
                          : '#ef4444' // red
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Quick Analytical Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
            <span className="text-[10px] text-emerald-800 font-bold block uppercase">
              ከፍተኛ ውጤት የተመዘገበበት ትምህርት
            </span>
            <p className="font-extrabold text-emerald-950 text-sm mt-0.5">
              {topSubject?.subject}
            </p>
            <span className="text-[10px] text-emerald-700">
              ውጤት: {topSubject?.total}% ({topSubject?.gradeLetter})
            </span>
          </div>

          <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl">
            <span className="text-[10px] text-sky-800 font-bold block uppercase">
              የማጠቃለያ ፈተና አማካይ (Final Exam)
            </span>
            <p className="font-extrabold text-sky-950 text-sm mt-0.5">
              {(
                student.scores.reduce((a, b) => a + b.finalExam, 0) /
                Math.max(student.scores.length, 1)
              ).toFixed(1)}{' '}
              / 50
            </p>
            <span className="text-[10px] text-sky-700">የ 50% ፈተናዎች አማካይ</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
            <span className="text-[10px] text-slate-500 font-bold block uppercase">
              ተጨማሪ ትኩረት የሚሻ ትምህርት
            </span>
            <p className="font-bold text-slate-800 text-sm mt-0.5">
              {lowestSubject?.subject}
            </p>
            <span className="text-[10px] text-slate-500">
              ውጤት: {lowestSubject?.total}% ({lowestSubject?.gradeLetter})
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VOICE TRANSCRIPTION PANEL WITH GEMINI-3.5-TRANSCRIBE      */}
      {/* ========================================================= */}
      <AudioTranscriber
        currentLang={currentLang}
        title="የተማሪ/ወላጅ የድምጽ አስተያየት እና ግብረ-መልስ (Voice Note Transcription)"
        placeholder="በማይክሮፎን የተናገሩት ድምጽ (በአማርኛ፣ በኦሮሚኛ ወይም በእንግሊዝኛ) በGemini 3.5 Transcribe ተተርጉሞ እዚህ ይቀመጣል..."
      />

      {/* ========================================================= */}
      {/* ACADEMIC PERIOD SELECTOR & MULTI-TIER APPROVAL BANNER     */}
      {/* መምህራን -> ክፍል ተጠሪ -> ዳይሬክተር ሲያጸድቅ ለተማሪ/ወላጅ እና ለትምህርት ቢሮ */}
      {/* ========================================================= */}
      <div id="report-card-section" className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5 scroll-mt-6">
        {/* Header & Period Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-800" />
              <h3 className="text-base font-bold text-slate-900">
                የተማሪ የውጤት ካርድ እና ይፋዊ የውጤት ማረጋገጫ
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              የሩብ ዓመት (Quarter)፣ የግማሽ ዓመት (Semester) እና የሙሉ ዓመት (Annual) ይፋዊ ውጤት
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              2016 ዓ.ም (2024/2025)
            </span>
          </div>
        </div>

        {/* Academic Period Tabs Bar with Live Approval Indicators */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              የትምህርት ወቅት ይምረጡ (Select Academic Period):
            </label>
            <span className="text-[10px] text-slate-400">
              ✓ = በዳይሬክተር የጸደቀ ይፋዊ ውጤት
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-xs font-bold">
            {(
              [
                { id: 'quarter_1', label: '1ኛ ሩብ (Q1)' },
                { id: 'quarter_2', label: '2ኛ ሩብ (Q2)' },
                { id: 'semester_1', label: '1ኛ ሴሚስተር (Sem 1)' },
                { id: 'quarter_3', label: '3ኛ ሩብ (Q3)' },
                { id: 'quarter_4', label: '4ኛ ሩብ (Q4)' },
                { id: 'semester_2', label: '2ኛ ሴሚስተር (Sem 2)' },
                { id: 'annual', label: 'የሙሉ ዓመት (Annual)' }
              ] as { id: AcademicPeriodType; label: string }[]
            ).map((item) => {
              const isPeriodApproved = schoolGradeWorkflows.some(
                (w) =>
                  w.grade === student.grade &&
                  (w.section === student.section || w.section === 'All' || !w.section) &&
                  w.period === item.id &&
                  w.status === 'director_approved'
              );
              const hasUnreadForPeriod = notifications.some(
                (n) => !n.isRead && n.period === item.id
              );

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedPeriod(item.id);
                    // Mark any unread notifications for this period as read
                    notifications
                      .filter((n) => n.period === item.id && !n.isRead)
                      .forEach((n) => StorageService.markNotificationAsRead(n.id));
                  }}
                  className={`relative shrink-0 px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedPeriod === item.id
                      ? 'bg-emerald-800 text-white shadow-xs font-black'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{item.label}</span>
                  {isPeriodApproved && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                        selectedPeriod === item.id
                          ? 'bg-emerald-950 text-emerald-200 border border-emerald-500/50'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                      title="በዳይሬክተር የጸደቀ"
                    >
                      ✓ ጸድቋል
                    </span>
                  )}
                  {hasUnreadForPeriod && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            3-TIER APPROVAL WORKFLOW STATUS BANNER
            - Director Approved (Green & Gold Seal)
            - Pending Workflow (Amber In-Progress Pipeline)
            - Unscheduled (Slate Info)
           ========================================================================= */}
        {approvedBatch ? (
          <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border-2 border-emerald-400/50 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
                  <ShieldCheck className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/30 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                      በዳይሬክተር የጸደቀ እና ይፋ የተደረገ (Director Approved)
                    </span>
                    <span className="text-[10px] font-bold text-amber-300 font-mono">
                      {getPeriodLabel(selectedPeriod)}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black tracking-tight text-white mt-0.5">
                    ይፋዊ የትምህርት ቤት ማህተም እና የዳይሬክተር ማረጋገጫ የተሰጠው ውጤት
                  </h4>
                  <p className="text-xs text-emerald-100/90 mt-0.5">
                    በመምህራን ተመዝግቦ፣ በክፍል ተጠሪው መምህር ተጣርቶ፣ በትምህርት ቤቱ ዳይሬክተር ጸድቆ ለወላጅ/ተማሪ እና ለሻሸመኔ ትምህርት ቢሮ ደርሷል።
                  </p>
                </div>
              </div>

              {/* Digital Seal Code Badge */}
              <div className="bg-black/40 border border-amber-400/50 p-2.5 rounded-xl text-right sm:text-center shrink-0 w-full sm:w-auto">
                <span className="text-[9px] text-amber-300 font-mono block uppercase">
                  ይፋዊ የዲጂታል ማህተም ቁጥር
                </span>
                <span className="text-xs font-mono font-black text-white">
                  {approvedBatch.directorApprovalSealNumber || 'SHAS-DIR-SEAL-VERIFIED'}
                </span>
                <span className="text-[9px] text-emerald-300 block mt-0.5">
                  የጸደቀበት ቀን፡ {approvedBatch.directorApprovedAt ? approvedBatch.directorApprovedAt.split('T')[0] : '2024-02-04'}
                </span>
              </div>
            </div>

            {/* 3-Tier Pipeline Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-700/60 text-xs">
              <div className="p-2.5 rounded-xl bg-white/10 flex items-center gap-2 border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-emerald-200 block">1. መምህራን (Subject Teachers)</span>
                  <strong className="text-white text-[11px]">ውጤት አስረክበዋል ✅</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/10 flex items-center gap-2 border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-emerald-200 block">2. የክፍል ተጠሪ (Homeroom)</span>
                  <strong className="text-white text-[11px]">አጣርተው አስተላልፈዋል ✅</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-400/20 flex items-center gap-2 border border-amber-400/40">
                <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                <div>
                  <span className="text-[10px] text-amber-200 block">3. ዳይሬክተር (School Director)</span>
                  <strong className="text-amber-100 text-[11px]">በይፋ አፅድቀዋል 🏛️</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-teal-500/20 flex items-center gap-2 border border-teal-400/30">
                <Send className="w-4 h-4 text-teal-300 shrink-0" />
                <div>
                  <span className="text-[10px] text-teal-200 block">4. ትምህርት ቢሮ (Bureau)</span>
                  <strong className="text-teal-100 text-[11px]">በማዕከላዊ ደርሷል 🌐</strong>
                </div>
              </div>
            </div>

            {/* Director Notes */}
            {approvedBatch.directorFeedback && (
              <div className="bg-black/30 p-2.5 rounded-xl text-xs text-emerald-100 italic border border-white/10">
                💬 <strong>የዳይሬክተር ማጠቃለያ አስተያየት፡</strong> "{approvedBatch.directorFeedback}" — {approvedBatch.directorName || 'ዋና ዳይሬክተር'}
              </div>
            )}
          </div>
        ) : pendingBatch ? (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 text-amber-950 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                    በማፅደቅ ሂደት ላይ (Approval In Progress)
                  </span>
                  <span className="text-xs font-bold text-amber-800">
                    {getPeriodLabel(selectedPeriod)}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-amber-950 mt-1">
                  ይህ ውጤት በዳይሬክተር ይፋዊ የማፅደቂያ ሰንሰለት ውስጥ ይገኛል
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  {pendingBatch.status === 'submitted_to_homeroom'
                    ? 'መምህራን ውጤቱን ለክፍል ተጠሪው መምህር ልከዋል፤ በክፍል ተጠሪው ምርመራ እና ስነ-ምግባር ማጣሪያ ላይ ይገኛል።'
                    : pendingBatch.status === 'submitted_to_director'
                    ? 'የክፍል ተጠሪው መምህር ውጤቱን ወደ ትምህርት ቤቱ ዋና ዳይሬክተር አስተላልፏል፤ በዳይሬክተር ይፋዊ ማፅደቂያ ላይ ይገኛል።'
                    : pendingBatch.status === 'revision_requested'
                    ? 'በዳይሬክተር የማስተካከያ ጥያቄ የቀረበበት ሲሆን በመምህሩና በክፍል ተጠሪው እየተጣራ ነው።'
                    : 'ውጤቱ በመዘጋጀት ላይ ይገኛል።'}
                </p>
              </div>
            </div>

            {/* Pipeline progress visualization */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-amber-200 text-xs">
              <div
                className={`p-2 rounded-xl flex items-center gap-2 border ${
                  pendingBatch.status !== 'draft'
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                <Check className="w-4 h-4 text-emerald-700" />
                <span>1. መምህራን አስረክበዋል</span>
              </div>
              <div
                className={`p-2 rounded-xl flex items-center gap-2 border ${
                  pendingBatch.status === 'submitted_to_director'
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-bold'
                    : pendingBatch.status === 'submitted_to_homeroom'
                    ? 'bg-amber-200 border-amber-400 text-amber-950 font-extrabold animate-pulse'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-800" />
                <span>2. ክፍል ተጠሪ (በሂደት)</span>
              </div>
              <div
                className={`p-2 rounded-xl flex items-center gap-2 border ${
                  pendingBatch.status === 'submitted_to_director'
                    ? 'bg-amber-200 border-amber-400 text-amber-950 font-extrabold animate-pulse'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-800" />
                <span>3. ዋና ዳይሬክተር (በጥበቃ)</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                ለ <strong>{getPeriodLabel(selectedPeriod)}</strong> የትምህርት ቤት ውጤት ባች በይፋ እስኪከፈት ድረስ ከታች የ 1ኛ ሴሚስተር አጠቃላይ ውጤት ይታያል።
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 uppercase shrink-0">
              ቅድመ-ዕይታ
            </span>
          </div>
        )}

        {/* Detailed Scores Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">{t.subject}</th>
                <th className="px-4 py-3">ፈተና 1 (10%)</th>
                <th className="px-4 py-3">ፈተና 2 (10%)</th>
                <th className="px-4 py-3">{t.mid_score} (30%)</th>
                <th className="px-4 py-3">{t.final_score} (50%)</th>
                <th className="px-4 py-3">{t.total_score}</th>
                <th className="px-4 py-3 text-center">የፊደል ደረጃ</th>
                <th className="px-4 py-3 text-center">ሁኔታ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {student.scores.map((sc, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {sc.subject}
                  </td>
                  <td className="px-4 py-3">{sc.quiz1}</td>
                  <td className="px-4 py-3">{sc.quiz2}</td>
                  <td className="px-4 py-3">{sc.midExam}</td>
                  <td className="px-4 py-3">{sc.finalExam}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{sc.total}</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-800">
                    {sc.gradeLetter}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {approvedBatch ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        የጸደቀ ✅
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                        መደበኛ
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Meta & Official Seal Print */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-slate-50 p-4 rounded-xl">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <span className="text-slate-500">የተማሪ መግቢያ ኮድ: </span>
              <code className="font-mono font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {student.accessCode}
              </code>
            </div>
            <div>
              <span className="text-slate-500">የወላጅ መግቢያ ኮድ: </span>
              <code className="font-mono font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {student.parentAccessCode}
              </code>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>ይህንን ካርድ አትም (Print Card)</span>
            </button>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Student ID Card Modal */}
      <StudentIDCardModal
        isOpen={showIdCardModal}
        onClose={() => setShowIdCardModal(false)}
        currentLang={currentLang}
        student={student}
        schoolName={student.schoolName || school?.name}
        school={school}
      />

      {/* Student QR Attendance Check-in Modal */}
      <StudentQRAttendanceModal
        isOpen={showQrAttendanceModal}
        onClose={() => setShowQrAttendanceModal(false)}
        school={resolvedSchool}
        students={[student]}
        currentUser={null}
        currentLang={currentLang}
        preSelectedStudentId={student.id}
      />

      {/* Teacher Appraisal & Evaluation Modal by Student / Parent */}
      <TeacherEvaluationModal
        isOpen={showTeacherEvaluationModal}
        onClose={() => setShowTeacherEvaluationModal(false)}
        currentLang={currentLang}
        school={resolvedSchool}
        student={student}
      />

      {/* Student Misconduct Tip-off Modal for Students / Parents */}
      {showDisciplineModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 my-4 max-h-[94vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-800 text-white flex items-center justify-center shadow-md">
                  <ShieldAlert className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    የስነ-ምግባር ችግር ጥቆማ ለትምህርት ቤት ዳይሬክተር
                  </h3>
                  <p className="text-xs text-slate-500">
                    {student.fullName} · ክፍል {student.grade} ክፍልፋይ {student.section} · {resolvedSchool.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDisciplineModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <StudentDisciplineDesk
              school={resolvedSchool}
              students={getLocalizedStudents(
                StorageService.getStudents(resolvedSchool.id),
                currentLang
              )}
              currentUser={{
                name: student.fullName,
                role: 'student',
                schoolId: resolvedSchool.id,
                schoolName: resolvedSchool.name,
                identifier: student.studentIdNumber,
                accessCode: student.accessCode
              }}
              currentLang={currentLang}
              preSelectedGrade={student.grade}
              preSelectedSection={student.section}
              onCloseModal={() => setShowDisciplineModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
