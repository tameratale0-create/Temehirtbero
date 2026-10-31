import React, { useState, useMemo, useEffect } from 'react';
import {
  Moon,
  Clock,
  Users,
  GraduationCap,
  Plus,
  Search,
  Filter,
  Briefcase,
  Phone,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  FileText,
  Printer,
  Sparkles,
  BookOpen,
  Award,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  UserX,
  X,
  RotateCcw,
  Coffee,
  Check,
  Eye
} from 'lucide-react';
import {
  School,
  StudentRecord,
  StudentScore,
  Language,
  AppUserSession,
  NightClassScheduleItem,
  NightAttendanceEntry,
  NightProgramType
} from '../types';
import { StorageService } from '../utils/storage';
import { OfflineSyncManager } from '../utils/offlineSync';
import { StudentIDCardModal } from './StudentIDCardModal';

interface NightSchoolDeskProps {
  school: School;
  students: StudentRecord[];
  onStudentsChange: (updated: StudentRecord[]) => void;
  currentUser: AppUserSession | null;
  currentLang: Language;
  onOpenReportCard?: (student: StudentRecord) => void;
}

export const NightSchoolDesk: React.FC<NightSchoolDeskProps> = ({
  school,
  students,
  onStudentsChange,
  currentUser,
  currentLang,
  onOpenReportCard
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'timetable' | 'attendance' | 'bureau_report'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<number | 'all'>('all');
  const [programFilter, setProgramFilter] = useState<string>('all');
  const [selectedStudentForIdCard, setSelectedStudentForIdCard] = useState<StudentRecord | null>(null);

  // Timetable State
  const [scheduleItems, setScheduleItems] = useState<NightClassScheduleItem[]>(() =>
    StorageService.getNightClassSchedule()
  );
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [newPeriodNumber, setNewPeriodNumber] = useState<number>(1);
  const [newPeriodGrade, setNewPeriodGrade] = useState<number>(10);
  const [newPeriodSection, setNewPeriodSection] = useState<string>('N1');
  const [newPeriodSubject, setNewPeriodSubject] = useState<string>('Mathematics (ሂሳብ)');
  const [newPeriodTeacher, setNewPeriodTeacher] = useState<string>('መ/ር በፈቃዱ ጥላሁን');
  const [newPeriodRoom, setNewPeriodRoom] = useState<string>('ክፍል 14 (ማታ)');
  const [newPeriodDays, setNewPeriodDays] = useState<string>('ሰኞ፣ ረቡዕ፣ አርብ');

  // New Night Student Admission Form state
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [grade, setGrade] = useState(10);
  const [section, setSection] = useState('N1');
  const [stream, setStream] = useState<'Natural' | 'Social' | 'General'>('General');
  const [programType, setProgramType] = useState<NightProgramType>('secondary_night');
  const [occupation, setOccupation] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('+251 9');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Night Attendance State
  const todayStr = new Date().toISOString().split('T')[0];
  const [attendanceDate, setAttendanceDate] = useState<string>(todayStr);
  const [attendanceLogs, setAttendanceLogs] = useState<Record<string, { status: 'present' | 'late' | 'absent' | 'excused'; lateReason?: string }>>({});
  const [attendanceSavedToast, setAttendanceSavedToast] = useState(false);

  // Filter only Night Students
  const nightStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.shift === 'night_shift' ||
        s.section?.toUpperCase().startsWith('N') ||
        s.section?.toUpperCase().includes('NIGHT') ||
        s.nightProgramType !== undefined
    );
  }, [students]);

  // Derived filter roster
  const filteredNightStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return nightStudents.filter((st) => {
      const matchSearch =
        q === '' ||
        st.fullName.toLowerCase().includes(q) ||
        st.studentIdNumber.toLowerCase().includes(q) ||
        st.accessCode.toLowerCase().includes(q) ||
        (st.occupation && st.occupation.toLowerCase().includes(q)) ||
        (st.workplace && st.workplace.toLowerCase().includes(q)) ||
        st.parentPhone.includes(q);

      const matchGrade = gradeFilter === 'all' || st.grade === gradeFilter;

      const matchProgram =
        programFilter === 'all' ||
        (programFilter === 'secondary' && st.nightProgramType === 'secondary_night') ||
        (programFilter === 'remedial' && st.nightProgramType === 'remedial') ||
        (programFilter === 'adult' && st.nightProgramType === 'adult_education');

      return matchSearch && matchGrade && matchProgram;
    });
  }, [nightStudents, searchQuery, gradeFilter, programFilter]);

  // Key KPI Metrics
  const metrics = useMemo(() => {
    const total = nightStudents.length;
    const maleCount = nightStudents.filter((s) => s.gender === 'M').length;
    const femaleCount = nightStudents.filter((s) => s.gender === 'F').length;
    const workingAdultsCount = nightStudents.filter((s) => s.occupation && s.occupation.trim().length > 0).length;
    const avgAttendance =
      total > 0
        ? Math.round(nightStudents.reduce((acc, s) => acc + (s.attendanceRate || 90), 0) / total)
        : 92;
    const avgScore =
      total > 0
        ? (
            nightStudents.reduce((acc, s) => {
              const studentAvg =
                s.scores && s.scores.length > 0
                  ? s.scores.reduce((sum, sc) => sum + sc.total, 0) / s.scores.length
                  : 80;
              return acc + studentAvg;
            }, 0) / total
          ).toFixed(1)
        : '0';

    return { total, maleCount, femaleCount, workingAdultsCount, avgAttendance, avgScore };
  }, [nightStudents]);

  // Handle Register Night Student
  const handleRegisterNightStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const randNum = Math.floor(100 + Math.random() * 900);
    const idNumber = `SHAS-NG${grade}-${randNum}`;
    const cleanShort = fullName.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, 'NGT');
    const studentAccessCode = `STU-${cleanShort}-N${Math.floor(10 + Math.random() * 90)}`;
    const parentAccessCode = `PAR-${cleanShort}-N${Math.floor(10 + Math.random() * 90)}`;

    const defaultScores: StudentScore[] = [
      { subject: 'Mathematics (ሂሳብ)', quiz1: 9, quiz2: 9, midExam: 27, finalExam: 46, total: 91, gradeLetter: 'A' },
      { subject: 'English (እንግሊዝኛ)', quiz1: 9, quiz2: 9, midExam: 26, finalExam: 45, total: 89, gradeLetter: 'A' },
      { subject: 'Afaan Oromoo (ኦሮሚኛ)', quiz1: 10, quiz2: 10, midExam: 28, finalExam: 48, total: 96, gradeLetter: 'A' },
      { subject: 'Physics (ፊዚክስ)', quiz1: 8, quiz2: 9, midExam: 25, finalExam: 43, total: 85, gradeLetter: 'A' },
      { subject: 'Chemistry (ኬሚስትሪ)', quiz1: 9, quiz2: 8, midExam: 25, finalExam: 44, total: 86, gradeLetter: 'A' },
      { subject: 'Biology (ባዮሎጂ)', quiz1: 9, quiz2: 9, midExam: 27, finalExam: 46, total: 91, gradeLetter: 'A' },
      { subject: 'Citizenship (ስነ-ዜጋ)', quiz1: 10, quiz2: 10, midExam: 29, finalExam: 48, total: 97, gradeLetter: 'A' }
    ];

    const newStudent: StudentRecord = {
      id: `stu-night-${Date.now()}`,
      schoolId: school.id,
      schoolName: school.name,
      studentIdNumber: idNumber,
      fullName: fullName.trim(),
      gender,
      grade,
      section: section.trim().toUpperCase(),
      accessCode: studentAccessCode,
      parentName: parentName.trim() || 'ተጠሪ (Guardian)',
      parentPhone: parentPhone.trim(),
      parentAccessCode: parentAccessCode,
      scores: defaultScores,
      attendanceRate: 95,
      conduct: 'A',
      rank: nightStudents.length + 1,
      shift: 'night_shift',
      nightProgramType: programType,
      occupation: occupation.trim() || 'የግል ስራ (Self-Employed)',
      workplace: workplace.trim() || 'ሻሸመኔ (Shashemene)',
      stream: grade >= 11 ? stream : undefined,
      shiftSchedule: 'ሰኞ - አርብ | 11:30 - 3:00 ማታ (5:30 - 9:00 PM)',
      emergencyContact: emergencyContact.trim() || parentPhone.trim(),
      enrollmentYear: '2016/2017 ዓ.ም'
    };

    StorageService.addStudent(newStudent);
    const updated = StorageService.getStudents();
    onStudentsChange(updated);

    // Enqueue for offline sync
    OfflineSyncManager.enqueue(
      'student_performance',
      'create',
      newStudent.id,
      newStudent,
      {
        authorName: currentUser?.name || 'የማታ ትምህርት አስተባባሪ',
        schoolName: school.name,
        description: `የማታ ተማሪ ምዝገባ፡ ${newStudent.fullName} (ክፍል ${newStudent.grade}${newStudent.section}) - ${newStudent.occupation}`
      }
    );

    // Also register access code for immediate login
    StorageService.addSchoolCode({
      id: `sc-night-${Date.now()}`,
      schoolId: school.id,
      schoolName: school.name,
      role: 'student',
      fullName: `${newStudent.fullName} (የማታ ተማሪ)`,
      accessCode: studentAccessCode,
      assignedClassOrSubject: `Grade ${newStudent.grade}${newStudent.section} (ማታ)`,
      createdAt: new Date().toISOString().split('T')[0]
    });

    // Reset Form
    setShowAddStudentModal(false);
    setFullName('');
    setOccupation('');
    setWorkplace('');
    setParentName('');
    setSelectedStudentForIdCard(newStudent);
  };

  // Add Class Schedule Period
  const handleAddSchedulePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    const timesMap: Record<number, { start: string; end: string; std: string }> = {
      1: { start: '11:30 ማታ', end: '12:15 ማታ', std: '5:30 PM - 6:15 PM' },
      2: { start: '12:20 ማታ', end: '1:05 ማታ', std: '6:20 PM - 7:05 PM' },
      3: { start: '1:25 ማታ', end: '2:10 ማታ', std: '7:25 PM - 8:10 PM' },
      4: { start: '2:15 ማታ', end: '3:00 ማታ', std: '8:15 PM - 9:00 PM' }
    };

    const chosen = timesMap[newPeriodNumber] || timesMap[1];

    const newItem: NightClassScheduleItem = {
      id: `ncs-${Date.now()}`,
      periodNumber: newPeriodNumber,
      startTime: chosen.start,
      endTime: chosen.end,
      standardTime: chosen.std,
      grade: newPeriodGrade,
      section: newPeriodSection,
      subject: newPeriodSubject,
      teacherName: newPeriodTeacher,
      classroomNumber: newPeriodRoom,
      daysOfWeek: newPeriodDays
    };

    const updated = StorageService.addNightClassScheduleItem(newItem);
    setScheduleItems(updated);
    setShowAddScheduleModal(false);
  };

  // Save Night Attendance
  const handleSaveNightAttendance = () => {
    const entries: NightAttendanceEntry[] = nightStudents.map((st) => {
      const log = attendanceLogs[st.id] || { status: 'present' };
      return {
        id: `att-ng-${attendanceDate}-${st.id}`,
        studentId: st.id,
        studentName: st.fullName,
        grade: st.grade,
        section: st.section,
        date: attendanceDate,
        status: log.status,
        arrivalTime: log.status === 'late' ? '11:50 ማታ' : '11:25 ማታ',
        lateReason: log.lateReason,
        recordedBy: currentUser?.name || 'የማታ ክፍለ-ጊዜ ተረኛ መምህር'
      };
    });

    StorageService.recordNightAttendance(entries);
    setAttendanceSavedToast(true);
    setTimeout(() => setAttendanceSavedToast(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          1. Hero Header Banner (Night School Theme)
         ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/40">
        {/* Glow ambient circle */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-amber-300" />
                <span>የማታ ትምህርት ፕሮግራም (Evening Extension Program)</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-300" />
                <span>11:30 - 3:00 ማታ (5:30 PM - 9:00 PM)</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>በሻሸመኔ ትምህርት ቢሮ እውቅና ያለው</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              የማታ ተማሪዎች አስተዳደር እና ክፍለ-ጊዜ ማዕከል
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              በቀን ስራና ንግድ ላይ ለተሰማሩ ወጣቶችና ጎልማሶች የተመቻቸ የ 2ኛ ደረጃ፣ የመሰናዶና የማካካሻ ትምህርት ፕሮግራም። 
              የተማሪዎች ምዝገባ፣ የፈረቃ መታወቂያ ካርድ፣ የማታ ክፍለ-ጊዜ ሰሌዳ እና የዕለት መገኘት ቁጥጥር።
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowAddStudentModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer transform active:scale-95"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>አዲስ የማታ ተማሪ መዝግብ</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>ይፋዊ ሪፖርት አትም</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. High-Density KPI Cards (Night Statistics)
           ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold">ጠቅላላ ተማሪዎች</span>
              <Users className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-xl font-black text-white">{metrics.total}</div>
            <div className="text-[10px] text-indigo-300 mt-0.5">የማታ ፈረቃ ተመዝጋቢዎች</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold">ወንድ / ሴት ተሳትፎ</span>
              <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="text-xl font-black text-white">
              {metrics.maleCount} <span className="text-xs font-normal text-slate-400">/</span> {metrics.femaleCount}
            </div>
            <div className="text-[10px] text-teal-300 mt-0.5">
              {metrics.total > 0 ? Math.round((metrics.femaleCount / metrics.total) * 100) : 0}% ሴቶች
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold">የቀን ሰራተኛ / ነጋዴ</span>
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-black text-amber-300">{metrics.workingAdultsCount}</div>
            <div className="text-[10px] text-amber-400 mt-0.5">የስራ ዘርፍ የተመዘገበላቸው</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold">የማታ መገኘት ምጣኔ</span>
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-emerald-400">{metrics.avgAttendance}%</div>
            <div className="text-[10px] text-emerald-300 mt-0.5">አማካይ የሰዓት አከባበር</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold">አማካይ ውጤት</span>
              <Award className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-xl font-black text-white">{metrics.avgScore}%</div>
            <div className="text-[10px] text-indigo-300 mt-0.5">የሴሚስተር ፈተናዎች</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold">የማታ ክፍሎች</span>
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="text-xl font-black text-white">4 ክፍሎች</div>
            <div className="text-[10px] text-teal-300 mt-0.5">Grades 9N, 10N, 11N, 12N</div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. Sub-Tab Switcher
         ========================================================================= */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-x-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('roster')}
          className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === 'roster'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-400" />
          <span>የማታ ተማሪዎች መዝገብ ({nightStudents.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('timetable')}
          className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === 'timetable'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>የማታ ክፍለ-ጊዜ ሰሌዳ (Timetable)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('attendance')}
          className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === 'attendance'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>የማታ መገኘት ቁጥጥር (Attendance)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bureau_report')}
          className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === 'bureau_report'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-teal-400" />
          <span>ይፋዊ የቢሮ ማረጋገጫ ሪፖርት</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: NIGHT STUDENTS ROSTER
         ========================================================================= */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="የማታ ተማሪ በስም፣ መታወቂያ፣ የቀን ስራ/ሞያ ወይም ስልክ ፈልግ..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Grade Filter */}
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                <option value="all">ሁሉም የክፍል ደረጃዎች</option>
                <option value="9">9ኛ ክፍል (Grade 9N)</option>
                <option value="10">10ኛ ክፍል (Grade 10N)</option>
                <option value="11">11ኛ ክፍል (Grade 11N)</option>
                <option value="12">12ኛ ክፍል (Grade 12N)</option>
              </select>

              {/* Program Filter */}
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                <option value="all">ሁሉም ፕሮግራሞች</option>
                <option value="secondary">አጠቃላይ 2ኛ ደረጃ (Secondary)</option>
                <option value="remedial">የማካካሻ ትምህርት (Remedial)</option>
                <option value="adult">የአዋቂዎች ትምህርት (Adult)</option>
              </select>

              {(searchQuery || gradeFilter !== 'all' || programFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setGradeFilter('all');
                    setProgramFilter('all');
                  }}
                  className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>አጽዳ</span>
                </button>
              )}
            </div>
          </div>

          {/* Roster Cards Grid */}
          {filteredNightStudents.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
                <Moon className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">ምንም የማታ ተማሪ አልተገኘም</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                በተመረጠው ማጣሪያ ምንም ተማሪ የለም ወይም እስካሁን የማታ ተማሪ አልተመዘገበም።
              </p>
              <button
                type="button"
                onClick={() => setShowAddStudentModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-950 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>አዲስ የማታ ተማሪ አስገባ</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNightStudents.map((st) => {
                const avg =
                  st.scores.length > 0
                    ? (st.scores.reduce((a, b) => a + b.total, 0) / st.scores.length).toFixed(1)
                    : '0';

                return (
                  <div
                    key={st.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between space-y-3 relative group"
                  >
                    {/* Card Top */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-xl bg-slate-900 text-amber-300 font-black text-xs flex items-center justify-center shrink-0 border border-amber-400/30">
                            #{st.rank}
                          </span>
                          <div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-900 border border-indigo-200 inline-flex items-center gap-1">
                              <Moon className="w-2.5 h-2.5 text-indigo-700" />
                              <span>ክፍል {st.grade} - {st.section} (ማታ)</span>
                            </span>
                            {st.stream && (
                              <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                {st.stream}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                          {st.studentIdNumber}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900 leading-snug">
                        {st.fullName}
                      </h4>

                      {/* Working Adult Details */}
                      <div className="mt-2.5 space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                          <Briefcase className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate">{st.occupation || 'የግል ስራ (Self-Employed)'}</span>
                        </div>
                        {st.workplace && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pl-5">
                            <span className="truncate">🏢 {st.workplace}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{st.shiftSchedule || '11:30 - 3:00 ማታ'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span className="font-mono">{st.parentPhone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Bottom: Scores & Actions */}
                    <div className="pt-2 border-t border-slate-100 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-black border border-emerald-200 text-xs">
                            {avg}% አማካይ
                          </span>
                          <span className="text-[11px] text-slate-500">
                            መገኘት፡ <strong className="text-slate-800">{st.attendanceRate}%</strong>
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          ኮድ: {st.accessCode}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForIdCard(st)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                          <span>የማታ መታወቂያ</span>
                        </button>

                        {onOpenReportCard && (
                          <button
                            type="button"
                            onClick={() => onOpenReportCard(st)}
                            className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-700" />
                            <span>ካርድ</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: NIGHT TIMETABLE & CLASS SCHEDULE
         ========================================================================= */}
      {activeTab === 'timetable' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>የማታ ክፍለ-ጊዜ ሰሌዳ (Evening Shift Timetable)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ከሰኞ እስከ አርብ · ከ 11:30 - 3:00 ማታ (5:30 PM - 9:00 PM)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddScheduleModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span>ክፍለ-ጊዜ ጨምር</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>ሰሌዳውን አትም</span>
              </button>
            </div>
          </div>

          {/* Time breakdown visual indicator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-3.5 rounded-2xl border border-indigo-900/60 shadow-xs">
              <div className="flex items-center justify-between text-indigo-200 text-xs font-bold mb-1">
                <span>1ኛ ክፍለ-ጊዜ</span>
                <span className="text-[10px] bg-indigo-500/30 px-2 py-0.5 rounded-full font-mono">45 ደቂቃ</span>
              </div>
              <div className="text-base font-black text-amber-300">11:30 - 12:15 ማታ</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">5:30 PM - 6:15 PM</div>
            </div>

            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-3.5 rounded-2xl border border-indigo-900/60 shadow-xs">
              <div className="flex items-center justify-between text-indigo-200 text-xs font-bold mb-1">
                <span>2ኛ ክፍለ-ጊዜ</span>
                <span className="text-[10px] bg-indigo-500/30 px-2 py-0.5 rounded-full font-mono">45 ደቂቃ</span>
              </div>
              <div className="text-base font-black text-amber-300">12:20 - 1:05 ማታ</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">6:20 PM - 7:05 PM</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-amber-900">
              <div className="flex items-center justify-between text-amber-800 text-xs font-bold mb-1">
                <span className="flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5 text-amber-600" />
                  <span>የሻይና እረፍት ሰዓት</span>
                </span>
                <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded-full font-mono">20 ደቂቃ</span>
              </div>
              <div className="text-base font-black text-amber-950">1:05 - 1:25 ማታ</div>
              <div className="text-[11px] text-amber-700 mt-0.5">ለሰራተኛና ተማሪዎች እረፍት</div>
            </div>

            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-3.5 rounded-2xl border border-indigo-900/60 shadow-xs">
              <div className="flex items-center justify-between text-indigo-200 text-xs font-bold mb-1">
                <span>3ኛ እና 4ኛ ክፍለ-ጊዜ</span>
                <span className="text-[10px] bg-indigo-500/30 px-2 py-0.5 rounded-full font-mono">90 ደቂቃ</span>
              </div>
              <div className="text-base font-black text-amber-300">1:25 - 3:00 ማታ</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">7:25 PM - 9:00 PM</div>
            </div>
          </div>

          {/* Schedule Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">ክፍለ-ጊዜ</th>
                    <th className="px-4 py-3">የሰዓት እርከን (ማታ)</th>
                    <th className="px-4 py-3">ክፍል እና ሴክሽን</th>
                    <th className="px-4 py-3">የትምህርት አይነት</th>
                    <th className="px-4 py-3">ተረኛ መምህር</th>
                    <th className="px-4 py-3">የመማሪያ ክፍል</th>
                    <th className="px-4 py-3">የሚሰጥባቸው ቀናት</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {scheduleItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-black text-slate-900">
                        <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-950 flex items-center justify-center text-xs font-mono">
                          {item.periodNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{item.startTime} - {item.endTime}</div>
                        <div className="text-[10px] font-mono text-slate-400">{item.standardTime}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-amber-300">
                          Grade {item.grade} - {item.section}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {item.subject}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {item.teacherName}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-600">
                        {item.classroomNumber}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-medium">
                        {item.daysOfWeek}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: NIGHT ATTENDANCE TRACKING
         ========================================================================= */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>የማታ ተማሪዎች የዕለት መገኘትና የበር መግቢያ ቁጥጥር</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ከስራ ዘግይተው የሚመጡ አዋቂዎችንና ቋሚ ተማሪዎችን የሰዓት መከታተያ
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => {
                  const bulk: Record<string, { status: 'present' }> = {};
                  nightStudents.forEach((s) => {
                    bulk[s.id] = { status: 'present' };
                  });
                  setAttendanceLogs(bulk);
                }}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                ሁሉንም በጊዜ ገብተዋል አድርግ
              </button>

              <button
                type="button"
                onClick={handleSaveNightAttendance}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-amber-300" />
                <span>የዛሬውን መገኘት መዝግብ</span>
              </button>
            </div>
          </div>

          {attendanceSavedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>የዛሬ የማታ ክፍለ-ጊዜ መገኘት በስኬት ተመዝግቧል!</span>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">የተማሪ ስም</th>
                    <th className="px-4 py-3">ክፍል</th>
                    <th className="px-4 py-3">የቀን ስራ / መስሪያ ቤት</th>
                    <th className="px-4 py-3">የዛሬ መገኘት ሁኔታ</th>
                    <th className="px-4 py-3">የመዘግየት ምክንያት (ካለ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {nightStudents.map((st) => {
                    const currentLog = attendanceLogs[st.id] || { status: 'present' };
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">
                          {st.fullName}
                          <div className="text-[10px] font-mono font-normal text-slate-400">{st.studentIdNumber}</div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-700">
                          {st.grade} - {st.section}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          <div className="font-medium text-slate-800">{st.occupation}</div>
                          {st.workplace && <div className="text-[10px] text-slate-400">{st.workplace}</div>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                setAttendanceLogs((prev) => ({
                                  ...prev,
                                  [st.id]: { ...prev[st.id], status: 'present' }
                                }))
                              }
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                currentLog.status === 'present'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              ተገኝቷል (11:25)
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setAttendanceLogs((prev) => ({
                                  ...prev,
                                  [st.id]: { ...prev[st.id], status: 'late', lateReason: prev[st.id]?.lateReason || 'ከስራ መዘግየት' }
                                }))
                              }
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                currentLog.status === 'late'
                                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              ዘግይቷል (11:50)
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setAttendanceLogs((prev) => ({
                                  ...prev,
                                  [st.id]: { ...prev[st.id], status: 'absent' }
                                }))
                              }
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                currentLog.status === 'absent'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              ቀረ
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {currentLog.status === 'late' && (
                            <input
                              type="text"
                              value={currentLog.lateReason || ''}
                              onChange={(e) =>
                                setAttendanceLogs((prev) => ({
                                  ...prev,
                                  [st.id]: { ...prev[st.id], lateReason: e.target.value }
                                }))
                              }
                              placeholder="ለምሳሌ፡ ከስራ መዘግየት..."
                              className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: OFFICIAL BUREAU ACCREDITATION REPORT
         ========================================================================= */}
      {activeTab === 'bureau_report' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {/* Header Seal */}
          <div className="text-center pb-6 border-b-2 border-slate-900 space-y-1.5">
            <div className="text-xs font-extrabold uppercase tracking-widest text-emerald-900">
              የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ · SHASHEMENE EDUCATION BUREAU
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              የማታ እና የተከታታይ ትምህርት ፕሮግራም ይፋዊ የተማሪዎች ምዝገባ ሪፖርት
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              የትምህርት ቤት ስም፡ <strong className="text-slate-900">{school.name}</strong> · የትምህርት ዘመን፡ 2016/2017 ዓ.ም
            </p>
          </div>

          {/* Statistical Breakdown Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-xs text-slate-500 font-bold block mb-1">ተመዝጋቢዎች ድምር</span>
              <span className="text-2xl font-black text-slate-900">{metrics.total}</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-xs text-slate-500 font-bold block mb-1">ወንድ ተማሪዎች</span>
              <span className="text-2xl font-black text-indigo-900">{metrics.maleCount}</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-xs text-slate-500 font-bold block mb-1">ሴት ተማሪዎች</span>
              <span className="text-2xl font-black text-teal-900">{metrics.femaleCount}</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-xs text-slate-500 font-bold block mb-1">አማካይ የፈተና ውጤት</span>
              <span className="text-2xl font-black text-emerald-800">{metrics.avgScore}%</span>
            </div>
          </div>

          {/* Student Roster Print List */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-3.5 py-2.5">ተ.ቁ</th>
                  <th className="px-3.5 py-2.5">የተማሪ ስም</th>
                  <th className="px-3.5 py-2.5">መታወቂያ ቁጥር</th>
                  <th className="px-3.5 py-2.5">ክፍል</th>
                  <th className="px-3.5 py-2.5">ፆታ</th>
                  <th className="px-3.5 py-2.5">የቀን ስራ / ሞያ</th>
                  <th className="px-3.5 py-2.5">ስልክ ቁጥር</th>
                  <th className="px-3.5 py-2.5">ውጤት</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {nightStudents.map((st, idx) => (
                  <tr key={st.id}>
                    <td className="px-3.5 py-2 font-mono">{idx + 1}</td>
                    <td className="px-3.5 py-2 font-bold text-slate-900">{st.fullName}</td>
                    <td className="px-3.5 py-2 font-mono">{st.studentIdNumber}</td>
                    <td className="px-3.5 py-2 font-semibold">Grade {st.grade}-{st.section}</td>
                    <td className="px-3.5 py-2">{st.gender === 'M' ? 'ወንድ' : 'ሴት'}</td>
                    <td className="px-3.5 py-2">{st.occupation}</td>
                    <td className="px-3.5 py-2 font-mono">{st.parentPhone}</td>
                    <td className="px-3.5 py-2 font-black text-emerald-800">
                      {st.scores && st.scores.length > 0
                        ? (st.scores.reduce((a, b) => a + b.total, 0) / st.scores.length).toFixed(1)
                        : '85'}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures & Seal Block */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-700">
            <div>
              <span className="block text-slate-400 text-[10px] uppercase">የማታ ፕሮግራም አስተባባሪ</span>
              <div className="font-bold text-slate-900 mt-1">አቶ ዳንኤል ንጉሴ</div>
              <div className="text-[11px] text-slate-500">ፊርማ፡ _____________________</div>
            </div>
            <div>
              <span className="block text-slate-400 text-[10px] uppercase">የትምህርት ቤቱ ዋና ዳይሬክተር</span>
              <div className="font-bold text-slate-900 mt-1">{school.principalName}</div>
              <div className="text-[11px] text-slate-500">ፊርማና ማህተም፡ _______________</div>
            </div>
            <div>
              <span className="block text-slate-400 text-[10px] uppercase">የትምህርት ቢሮ ማረጋገጫ ቁጥር</span>
              <div className="font-mono font-bold text-emerald-950 mt-1">SHAS-NGT-ACCRED-2024</div>
              <div className="text-[11px] text-emerald-800 font-semibold">✓ በቢሮው ማህደር የጸደቀ</div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADMISSION OF NEW NIGHT STUDENT
         ========================================================================= */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-300 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">አዲስ የማታ ተማሪ ምዝገባ</h3>
                  <p className="text-xs text-slate-500">የ 2016/2017 ዓ.ም የማታ ትምህርት ፕሮግራም ቅበላ</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStudentModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterNightStudent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">የተማሪው ሙሉ ስም (Full Name) *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ለምሳሌ፡ አቶ ከድር አህመድ ሁሴን"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">ፆታ (Gender)</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="M">ወንድ (Male)</option>
                    <option value="F">ሴት (Female)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">የክፍል ደረጃ (Grade)</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value={9}>9ኛ ክፍል (Grade 9)</option>
                    <option value={10}>10ኛ ክፍል (Grade 10)</option>
                    <option value={11}>11ኛ ክፍል (Grade 11)</option>
                    <option value={12}>12ኛ ክፍል (Grade 12)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">የማታ ሴክሽን</label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="ለምሳሌ፡ N1, N2"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                {grade >= 11 && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">የትምህርት መስክ (Stream)</label>
                    <select
                      value={stream}
                      onChange={(e) => setStream(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    >
                      <option value="Natural">የተፈጥሮ ሳይንስ (Natural)</option>
                      <option value="Social">ማህበራዊ ሳይንስ (Social)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Working Adult Details */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                  <span>የስራና የሙያ መረጃ (Adult Employment Details)</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">የቀን ስራ / ሞያ (Occupation)</label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="ለምሳሌ፡ ነጋዴ፣ ጤና ባለሙያ፣ ሰራተኛ..."
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">የስራ ቦታ / መስሪያ ቤት</label>
                    <input
                      type="text"
                      value={workplace}
                      onChange={(e) => setWorkplace(e.target.value)}
                      placeholder="ለምሳሌ፡ ሻሸመኔ አውቶቡስ ተራ"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Contacts */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">ስልክ ቁጥር (Phone)</label>
                  <input
                    type="text"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="+251 9..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">ተጠሪ / ባለቤት ስም (Contact Person)</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="ተጠሪ ወይም ወላጅ"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-xl"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all shadow-md"
                >
                  ተማሪውን መዝግብ እና መታወቂያ አዘጋጅ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD SCHEDULE PERIOD
         ========================================================================= */}
      {showAddScheduleModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-700" />
                <span>አዲስ የማታ ክፍለ-ጊዜ ሰሌዳ</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddScheduleModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSchedulePeriod} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">ክፍለ-ጊዜ</label>
                <select
                  value={newPeriodNumber}
                  onChange={(e) => setNewPeriodNumber(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value={1}>1ኛ ክፍለ-ጊዜ (11:30 - 12:15 ማታ)</option>
                  <option value={2}>2ኛ ክፍለ-ጊዜ (12:20 - 1:05 ማታ)</option>
                  <option value={3}>3ኛ ክፍለ-ጊዜ (1:25 - 2:10 ማታ)</option>
                  <option value={4}>4ኛ ክፍለ-ጊዜ (2:15 - 3:00 ማታ)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ክፍል</label>
                  <select
                    value={newPeriodGrade}
                    onChange={(e) => setNewPeriodGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value={9}>Grade 9</option>
                    <option value={10}>Grade 10</option>
                    <option value={11}>Grade 11</option>
                    <option value={12}>Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ሴክሽን</label>
                  <input
                    type="text"
                    value={newPeriodSection}
                    onChange={(e) => setNewPeriodSection(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">የትምህርት አይነት</label>
                <input
                  type="text"
                  required
                  value={newPeriodSubject}
                  onChange={(e) => setNewPeriodSubject(e.target.value)}
                  placeholder="ለምሳሌ፡ Mathematics"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ተረኛ መምህር</label>
                <input
                  type="text"
                  required
                  value={newPeriodTeacher}
                  onChange={(e) => setNewPeriodTeacher(e.target.value)}
                  placeholder="ለምሳሌ፡ መ/ር በፈቃዱ ጥላሁን"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">የክፍል ቁጥር</label>
                  <input
                    type="text"
                    value={newPeriodRoom}
                    onChange={(e) => setNewPeriodRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">የሚሰጥባቸው ቀናት</label>
                  <input
                    type="text"
                    value={newPeriodDays}
                    onChange={(e) => setNewPeriodDays(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddScheduleModal(false)}
                  className="px-3 py-1.5 bg-slate-100 rounded-xl font-bold text-slate-700"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-900 text-white rounded-xl font-bold"
                >
                  መዝግብ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          STUDENT ID CARD MODAL
         ========================================================================= */}
      {selectedStudentForIdCard && (
        <StudentIDCardModal
          isOpen={true}
          onClose={() => setSelectedStudentForIdCard(null)}
          currentLang={currentLang}
          student={selectedStudentForIdCard}
          school={school}
        />
      )}
    </div>
  );
};
