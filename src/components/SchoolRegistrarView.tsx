import React, { useState, useMemo } from 'react';
import {
  Users,
  GraduationCap,
  Plus,
  Search,
  Printer,
  Shield,
  CreditCard,
  Building2,
  CheckCircle2,
  Award,
  BookOpen,
  UserCheck,
  FileCheck,
  ArrowRight,
  Filter,
  Eye,
  IdCard,
  HelpCircle,
  Briefcase,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  X,
  Moon,
  Clock,
  Sun,
  Sunrise
} from 'lucide-react';
import {
  StudentRecord,
  School,
  Language,
  AppUserSession,
  StudentShift,
  ShiftCategory,
  resolveStudentShiftCategory
} from '../types';
import { StorageService } from '../utils/storage';
import { OfflineSyncManager } from '../utils/offlineSync';
import { StudentIDCardModal } from './StudentIDCardModal';

interface SchoolRegistrarViewProps {
  school: School;
  students: StudentRecord[];
  onStudentsChange: (students: StudentRecord[]) => void;
  currentUser: AppUserSession | null;
  currentLang: Language;
}

export const SchoolRegistrarView: React.FC<SchoolRegistrarViewProps> = ({
  school,
  students,
  onStudentsChange,
  currentUser,
  currentLang
}) => {
  const [activeTab, setActiveTab] = useState<'admissions' | 'structure' | 'id_cards'>('admissions');
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<number | 'all'>('all');
  const [sectionFilter, setSectionFilter] = useState<string | 'all'>('all');
  const [shiftFilter, setShiftFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [sortBy, setSortBy] = useState<
    'grade_asc' | 'grade_desc' | 'section_asc' | 'section_desc' | 'name_asc' | 'name_desc' | 'id_asc'
  >('grade_asc');
  const [selectedStudentForIdCard, setSelectedStudentForIdCard] = useState<StudentRecord | null>(null);

  // Real-time student counts per shift
  const shiftCounts = useMemo(() => {
    let morning = 0;
    let afternoon = 0;
    let evening = 0;
    students.forEach((s) => {
      const cat = resolveStudentShiftCategory(s);
      if (cat === 'morning') morning++;
      else if (cat === 'afternoon') afternoon++;
      else if (cat === 'evening') evening++;
    });
    return { morning, afternoon, evening };
  }, [students]);

  // New Student Admission Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [grade, setGrade] = useState(10);
  const [section, setSection] = useState('A');
  const [studentShift, setStudentShift] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [studentOccupation, setStudentOccupation] = useState('');
  const [studentWorkplace, setStudentWorkplace] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('+251 9');

  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !parentName.trim()) return;

    const isNight = studentShift === 'evening';
    const assignedSection = isNight && !section.toUpperCase().startsWith('N') ? `N${section}` : section;
    const idNumber = isNight
      ? `SHAS-NG${grade}-${Math.floor(100 + Math.random() * 900)}`
      : `SHAS-${grade}${assignedSection}-${Math.floor(100 + Math.random() * 900)}`;
    const studentAccessCode = `STU-${fullName.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, 'STU')}-${Math.floor(10 + Math.random() * 90)}`;
    const parentAccessCode = `PAR-${fullName.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, 'PAR')}-${Math.floor(10 + Math.random() * 90)}`;

    const shiftSchedules: Record<'morning' | 'afternoon' | 'evening', string> = {
      morning: 'ሰኞ - አርብ | 2:00 - 6:30 ጧት (Morning: 8:00 AM - 12:30 PM)',
      afternoon: 'ሰኞ - አርብ | 6:30 - 11:30 ከሰዓት (Afternoon: 12:30 PM - 5:30 PM)',
      evening: 'ሰኞ - አርብ | 11:30 - 3:00 ማታ (Evening: 5:30 PM - 9:00 PM)'
    };

    const newStudent: StudentRecord = {
      id: `stu-${Date.now()}`,
      schoolId: school.id,
      schoolName: school.name,
      studentIdNumber: idNumber,
      fullName: fullName.trim(),
      gender,
      grade,
      section: assignedSection,
      accessCode: studentAccessCode,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentAccessCode: parentAccessCode,
      shift: studentShift,
      nightProgramType: isNight ? 'secondary_night' : undefined,
      occupation: isNight ? (studentOccupation.trim() || 'የግል ስራ (Self-Employed)') : undefined,
      workplace: isNight ? (studentWorkplace.trim() || 'ሻሸመኔ') : undefined,
      shiftSchedule: shiftSchedules[studentShift],
      emergencyContact: parentPhone.trim(),
      scores: [
        { subject: 'Mathematics (ሒሳብ)', quiz1: 9, quiz2: 9, midExam: 27, finalExam: 45, total: 90, gradeLetter: 'A' },
        { subject: 'English (እንግሊዝኛ)', quiz1: 8, quiz2: 9, midExam: 25, finalExam: 44, total: 86, gradeLetter: 'A' },
        { subject: 'Physics (ፊዚክስ)', quiz1: 8.5, quiz2: 8, midExam: 26, finalExam: 43, total: 85.5, gradeLetter: 'A' },
        { subject: 'Chemistry (ኬሚስትሪ)', quiz1: 8, quiz2: 8.5, midExam: 24, finalExam: 41, total: 81.5, gradeLetter: 'B' },
        { subject: 'Biology (ባዮሎጂ)', quiz1: 9, quiz2: 9, midExam: 26, finalExam: 44, total: 88, gradeLetter: 'A' },
        { subject: 'Afaan Oromoo', quiz1: 9.5, quiz2: 9, midExam: 28, finalExam: 47, total: 93.5, gradeLetter: 'A' },
        { subject: 'Citizenship (ስነ-ዜጋ)', quiz1: 9, quiz2: 9, midExam: 27, finalExam: 46, total: 91, gradeLetter: 'A' }
      ],
      attendanceRate: 98,
      conduct: 'A',
      rank: students.length + 1
    };

    StorageService.addStudent(newStudent);
    const updated = StorageService.getStudents();
    onStudentsChange(updated);

    // Enqueue student performance for offline sync
    OfflineSyncManager.enqueue(
      'student_performance',
      'create',
      newStudent.id,
      newStudent,
      {
        authorName: currentUser?.name || 'ሬጅስትራር',
        schoolName: school.name,
        description: `የተማሪ ${newStudent.fullName} (ክፍል ${newStudent.grade}${newStudent.section}) የውጤትና ምዝገባ መረጃ`
      }
    );

    setShowAddModal(false);
    setFullName('');
    setParentName('');
    setStudentOccupation('');
    setStudentWorkplace('');
    setSelectedStudentForIdCard(newStudent);
  };

  const availableGrades = useMemo(() => {
    const gradesSet = new Set<number>();
    students.forEach((s) => gradesSet.add(s.grade));
    return Array.from(gradesSet).sort((a, b) => a - b);
  }, [students]);

  const availableSections = useMemo(() => {
    const sectionsSet = new Set<string>();
    students.forEach((s) => {
      if (gradeFilter === 'all' || s.grade === gradeFilter) {
        if (s.section && s.section.trim()) {
          sectionsSet.add(s.section.trim().toUpperCase());
        }
      }
    });
    return Array.from(sectionsSet).sort();
  }, [students, gradeFilter]);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const result = students.filter((s) => {
      const matchSearch =
        q === '' ||
        s.fullName.toLowerCase().includes(q) ||
        s.studentIdNumber.toLowerCase().includes(q) ||
        s.parentName.toLowerCase().includes(q) ||
        s.accessCode.toLowerCase().includes(q) ||
        (s.occupation && s.occupation.toLowerCase().includes(q)) ||
        (s.section && s.section.toLowerCase().includes(q));
      const matchGrade = gradeFilter === 'all' || s.grade === gradeFilter;
      const matchSection =
        sectionFilter === 'all' ||
        (s.section && s.section.trim().toUpperCase() === sectionFilter.toUpperCase());
      const studentShiftCategory = resolveStudentShiftCategory(s);
      const matchShift =
        shiftFilter === 'all' || studentShiftCategory === shiftFilter;
      return matchSearch && matchGrade && matchSection && matchShift;
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'grade_asc': {
          const diff = a.grade - b.grade;
          if (diff !== 0) return diff;
          return a.section.localeCompare(b.section);
        }
        case 'grade_desc': {
          const diff = b.grade - a.grade;
          if (diff !== 0) return diff;
          return a.section.localeCompare(b.section);
        }
        case 'section_asc': {
          const sDiff = a.section.localeCompare(b.section);
          if (sDiff !== 0) return sDiff;
          return a.grade - b.grade;
        }
        case 'section_desc': {
          const sDiff = b.section.localeCompare(a.section);
          if (sDiff !== 0) return sDiff;
          return a.grade - b.grade;
        }
        case 'name_asc':
          return a.fullName.localeCompare(b.fullName);
        case 'name_desc':
          return b.fullName.localeCompare(a.fullName);
        case 'id_asc':
          return a.studentIdNumber.localeCompare(b.studentIdNumber);
        default:
          return a.grade - b.grade;
      }
    });
  }, [students, searchQuery, gradeFilter, sectionFilter, shiftFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900/80 border border-blue-400/40 rounded-full text-xs font-semibold text-blue-200">
              <Users className="w-3.5 h-3.5 text-blue-300" />
              <span>የተማሪዎች ቅበላ፣ ምዝገባ እና የትምህርት ቤት መዋቅር</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              የሬጅስትራር ጽሕፈት ቤት (Registrar & Admissions Hub)
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              አዳዲስ ተማሪዎችን የመመዝገብ፣ ክፍልና ሴክሽን የመመደብ፣ ይፋዊ የተማሪዎች መታወቂያ ካርድ (Student ID
              Card) የማተም እና የት/ቤቱን ሙሉ የአስተዳደር መዋቅር የማስተዳደር ስልጣን
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>አዲስ ተማሪ መዝግብ (Admit Student)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white p-2 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('admissions')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'admissions'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>የተማሪዎች መዝገብ እና ቅበላ ({students.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('structure')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'structure'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>የትምህርት ቤት መዋቅር እና የስራ ድርሻ (Organizational Hierarchy)</span>
        </button>
      </div>

      {/* Tab 1: Admissions & Student Roster */}
      {activeTab === 'admissions' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          {/* Shift Distribution & Capacity KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Morning Shift Card */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setShiftFilter(shiftFilter === 'morning' ? 'all' : 'morning')}
              className={`p-4 rounded-2xl border transition-all text-left cursor-pointer ${
                shiftFilter === 'morning'
                  ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500 shadow-xs'
                  : 'bg-gradient-to-br from-amber-50/70 to-white border-amber-200/80 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    <Sunrise className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">የጧት ፈረቃ (Morning)</h4>
                    <span className="text-[10px] text-slate-500 font-mono">2:00 - 6:30 ቀን</span>
                  </div>
                </div>
                <span className="text-xl font-black text-amber-950 font-mono">
                  {shiftCounts.morning}
                </span>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-amber-200/60">
                <span className="text-slate-600">መደበኛ የቀን ተማሪዎች</span>
                <span className="font-bold text-amber-800">
                  {students.length > 0 ? Math.round((shiftCounts.morning / students.length) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* Afternoon Shift Card */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setShiftFilter(shiftFilter === 'afternoon' ? 'all' : 'afternoon')}
              className={`p-4 rounded-2xl border transition-all text-left cursor-pointer ${
                shiftFilter === 'afternoon'
                  ? 'bg-orange-500/10 border-orange-500 ring-2 ring-orange-500 shadow-xs'
                  : 'bg-gradient-to-br from-orange-50/70 to-white border-orange-200/80 hover:border-orange-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-900 flex items-center justify-center font-bold">
                    <Sun className="w-4 h-4 text-orange-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">የከሰዓት ፈረቃ (Afternoon)</h4>
                    <span className="text-[10px] text-slate-500 font-mono">6:30 - 11:30 ቀን</span>
                  </div>
                </div>
                <span className="text-xl font-black text-orange-950 font-mono">
                  {shiftCounts.afternoon}
                </span>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-orange-200/60">
                <span className="text-slate-600">ተዘዋዋሪ ፈረቃ</span>
                <span className="font-bold text-orange-800">
                  {students.length > 0 ? Math.round((shiftCounts.afternoon / students.length) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* Evening / Night Shift Card */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setShiftFilter(shiftFilter === 'evening' ? 'all' : 'evening')}
              className={`p-4 rounded-2xl border transition-all text-left cursor-pointer ${
                shiftFilter === 'evening'
                  ? 'bg-indigo-950 text-indigo-100 border-indigo-600 ring-2 ring-indigo-500 shadow-md'
                  : 'bg-gradient-to-br from-indigo-950 to-slate-900 text-white border-indigo-900 hover:border-indigo-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-900/80 text-amber-300 flex items-center justify-center font-bold border border-indigo-700/60">
                    <Moon className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-amber-300">የማታ ፈረቃ (Evening)</h4>
                      <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 text-[9px] font-black rounded-sm">
                        Night
                      </span>
                    </div>
                    <span className="text-[10px] text-indigo-200/80 font-mono">11:30 - 3:00 ማታ</span>
                  </div>
                </div>
                <span className="text-xl font-black text-white font-mono">
                  {shiftCounts.evening}
                </span>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-indigo-800/80">
                <span className="text-indigo-200">የስራ ተሰማሪ አዋቂዎች</span>
                <span className="font-bold text-amber-300">
                  {students.filter((s) => resolveStudentShiftCategory(s) === 'evening' && s.occupation).length} ሰራተኞች
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ተማሪ በስም፣ በመለያ ቁጥር፣ በኮድ ወይም በወላጅ ፈልግ..."
                  className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Grade Filter */}
                <select
                  value={gradeFilter}
                  onChange={(e) => {
                    const nextVal = e.target.value === 'all' ? 'all' : Number(e.target.value);
                    setGradeFilter(nextVal);
                    if (nextVal !== 'all' && sectionFilter !== 'all') {
                      const sectionsInGrade = students
                        .filter((s) => s.grade === nextVal)
                        .map((s) => s.section.toUpperCase());
                      if (!sectionsInGrade.includes(sectionFilter.toUpperCase())) {
                        setSectionFilter('all');
                      }
                    }
                  }}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-700 focus:outline-hidden"
                >
                  <option value="all">ሁሉም ክፍሎች ({students.length})</option>
                  {availableGrades.map((g) => (
                    <option key={g} value={g}>
                      {g}ኛ ክፍል ({students.filter((s) => s.grade === g).length})
                    </option>
                  ))}
                </select>

                {/* Section Filter */}
                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-700 focus:outline-hidden"
                >
                  <option value="all">ሁሉም ሴክሽኖች</option>
                  {availableSections.map((sec) => (
                    <option key={sec} value={sec}>
                      ሴክሽን {sec} ({students.filter((s) => (gradeFilter === 'all' || s.grade === gradeFilter) && s.section.toUpperCase() === sec).length})
                    </option>
                  ))}
                </select>

                {/* Shift Filter Dropdown (Morning / Afternoon / Evening) */}
                <select
                  value={shiftFilter}
                  onChange={(e) => setShiftFilter(e.target.value as any)}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-700 focus:outline-hidden"
                >
                  <option value="all">ሁሉንም ፈረቃዎች ({students.length})</option>
                  <option value="morning">🌅 የጧት ፈረቃ ({shiftCounts.morning})</option>
                  <option value="afternoon">☀️ የከሰዓት ፈረቃ ({shiftCounts.afternoon})</option>
                  <option value="evening">🌙 የማታ ፈረቃ ({shiftCounts.evening})</option>
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-700 focus:outline-hidden"
                >
                  <option value="grade_asc">ደርድር፡ ክፍል (ዝቅተኛ → ከፍተኛ)</option>
                  <option value="grade_desc">ደርድር፡ ክፍል (ከፍተኛ → ዝቅተኛ)</option>
                  <option value="section_asc">ደርድር፡ ሴክሽን (A → Z)</option>
                  <option value="section_desc">ደርድር፡ ሴክሽን (Z → A)</option>
                  <option value="name_asc">ደርድር፡ ስም (A → Z)</option>
                  <option value="name_desc">ደርድር፡ ስም (Z → A)</option>
                  <option value="id_asc">ደርድር፡ መለያ ቁጥር</option>
                </select>

                {/* Reset Filters */}
                {(gradeFilter !== 'all' || sectionFilter !== 'all' || shiftFilter !== 'all' || searchQuery.trim() !== '' || sortBy !== 'grade_asc') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setGradeFilter('all');
                      setSectionFilter('all');
                      setShiftFilter('all');
                      setSortBy('grade_asc');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                    <span>አፅዳ</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Shift Filter Pills Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-emerald-700" />
                  <span>ፈረቃ (Shift)፡</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShiftFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    shiftFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  ሁሉም ({students.length})
                </button>
                <button
                  type="button"
                  onClick={() => setShiftFilter('morning')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    shiftFilter === 'morning'
                      ? 'bg-amber-600 text-white shadow-2xs ring-1 ring-amber-700'
                      : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/60'
                  }`}
                >
                  <Sunrise className="w-3 h-3" />
                  <span>🌅 የጧት ፈረቃ ({shiftCounts.morning})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShiftFilter('afternoon')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    shiftFilter === 'afternoon'
                      ? 'bg-orange-600 text-white shadow-2xs ring-1 ring-orange-700'
                      : 'bg-orange-50 text-orange-900 hover:bg-orange-100 border border-orange-200/60'
                  }`}
                >
                  <Sun className="w-3 h-3" />
                  <span>☀️ የከሰዓት ፈረቃ ({shiftCounts.afternoon})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShiftFilter('evening')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    shiftFilter === 'evening'
                      ? 'bg-indigo-950 text-amber-300 font-black shadow-2xs ring-1 ring-indigo-700'
                      : 'bg-indigo-50 text-indigo-950 hover:bg-indigo-100 border border-indigo-200/70'
                  }`}
                >
                  <Moon className="w-3 h-3 text-amber-400" />
                  <span>🌙 የማታ ፈረቃ ({shiftCounts.evening})</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 font-semibold">
                <span>{filteredStudents.length} ተማሪዎች ተጣርተዋል (ከ {students.length})</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[700px]">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th
                    className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => setSortBy(sortBy === 'id_asc' ? 'grade_asc' : 'id_asc')}
                  >
                    <div className="flex items-center gap-1">
                      <span>የተማሪ መለያ ቁጥር</span>
                      {sortBy === 'id_asc' && <ArrowUp className="w-3 h-3 text-emerald-800" />}
                    </div>
                  </th>
                  <th
                    className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => setSortBy(sortBy === 'name_asc' ? 'name_desc' : 'name_asc')}
                  >
                    <div className="flex items-center gap-1">
                      <span>ሙሉ ስም</span>
                      {sortBy === 'name_asc' ? (
                        <ArrowUp className="w-3 h-3 text-emerald-800" />
                      ) : sortBy === 'name_desc' ? (
                        <ArrowDown className="w-3 h-3 text-emerald-800" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-3">ጾታ</th>
                  <th
                    className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => {
                      if (sortBy === 'grade_asc') setSortBy('grade_desc');
                      else if (sortBy === 'grade_desc') setSortBy('section_asc');
                      else if (sortBy === 'section_asc') setSortBy('section_desc');
                      else setSortBy('grade_asc');
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>ክፍል & ሴክሽን</span>
                      {sortBy === 'grade_asc' || sortBy === 'section_asc' ? (
                        <ArrowUp className="w-3 h-3 text-emerald-800" />
                      ) : sortBy === 'grade_desc' || sortBy === 'section_desc' ? (
                        <ArrowDown className="w-3 h-3 text-emerald-800" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-3">ፈረቃ (Shift)</th>
                  <th className="py-3 px-3">የወላጅ ስም</th>
                  <th className="py-3 px-3">የወላጅ ስልክ</th>
                  <th className="py-3 px-3">የተማሪ ኮድ</th>
                  <th className="py-3 px-3 text-right">የመታወቂያ ካርድ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-500">
                      <GraduationCap className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="text-xs font-bold text-slate-700">በተመረጠው የፈረቃ፣ ክፍል ደረጃ ወይም ሴክሽን ምንም ተማሪ አልተገኘም</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setGradeFilter('all');
                          setSectionFilter('all');
                          setShiftFilter('all');
                          setSortBy('grade_asc');
                        }}
                        className="mt-2 text-xs text-emerald-800 font-bold hover:underline cursor-pointer"
                      >
                        ሁሉንም ተማሪዎች አሳይ
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st) => {
                    const shiftCat = resolveStudentShiftCategory(st);
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-teal-800">
                          {st.studentIdNumber}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">{st.fullName}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              st.gender === 'F'
                                ? 'bg-pink-100 text-pink-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {st.gender === 'F' ? 'ሴት' : 'ወንድ'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700">
                          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-bold">
                            {st.grade}ኛ ({st.section})
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {shiftCat === 'evening' ? (
                            <div>
                              <span className="px-2 py-0.5 bg-indigo-950 text-amber-300 rounded-md text-[10px] font-extrabold inline-flex items-center gap-1 shadow-2xs">
                                <Moon className="w-2.5 h-2.5 text-amber-300" />
                                <span>ማታ (11:30 - 3:00)</span>
                              </span>
                              {st.occupation && (
                                <div
                                  className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[150px]"
                                  title={`${st.occupation} ${st.workplace ? `(${st.workplace})` : ''}`}
                                >
                                  💼 {st.occupation}
                                </div>
                              )}
                            </div>
                          ) : shiftCat === 'afternoon' ? (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-900 border border-orange-200 rounded-md text-[10px] font-bold inline-flex items-center gap-1">
                              <Sun className="w-2.5 h-2.5 text-orange-700" />
                              <span>ከሰዓት (6:30 - 11:30)</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 rounded-md text-[10px] font-bold inline-flex items-center gap-1">
                              <Sunrise className="w-2.5 h-2.5 text-amber-700" />
                              <span>ጧት (2:00 - 6:30)</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-700">{st.parentName}</td>
                        <td className="py-3 px-3 font-mono text-slate-500">{st.parentPhone}</td>
                        <td className="py-3 px-3 font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {st.accessCode}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedStudentForIdCard(st)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Printer className="w-3 h-3" />
                            <span>መታወቂያ አትም</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: School Organizational Structure & Job Descriptions */}
      {activeTab === 'structure' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">
              የትምህርት ቤት የተሟላ የአስተዳደር መዋቅር፣ የስራ ክፍሎች እና ኃላፊነቶች
            </h3>
            <p className="text-xs text-slate-500">
              ተማሪንና መምህርን ማን ይመዘግባል? ምን ምን ሰራተኞችስ ያስፈልጋሉ?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Registrar */}
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-blue-950 uppercase tracking-wider">
                    1. ሬጅስትራር / የተማሪዎች መዝጋቢ (School Registrar)
                  </h4>
                  <p className="text-[11px] text-blue-800 font-semibold">
                    ተማሪን ማን ይመዘግባል? ለሚለው ጥያቄ ቀጥተኛ ኃላፊ
                  </p>
                </div>
              </div>
              <ul className="text-xs text-blue-900 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>አዳዲስ እና ነባር ተማሪዎችን በሲስተም መመዝገብ እና የፋይል ቁጥር መስጠት</li>
                <li>የክፍል እና የሴክሽን ምደባዎችን ማካሄድ</li>
                <li>ይፋዊ የተማሪዎች መታወቂያ ካርድ (Student ID Card) በፎቶና በባርኮድ ማተም</li>
                <li>የትምህርት ውጤት ሰነዶችን፣ ትራንስክሪፕት እና የተማሪ ዝውውር (Transfer) ማዘጋጀት</li>
              </ul>
            </div>

            {/* Box 2: Vice Principal & HR */}
            <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-teal-950 uppercase tracking-wider">
                    2. ምክትል ርዕሰ መምህር እና የሰው ኃይል (Vice Principal / HR)
                  </h4>
                  <p className="text-[11px] text-teal-800 font-semibold">
                    አስተማሪን ማን ይመዘግባል? ለሚለው ጥያቄ ቀጥተኛ ኃላፊ
                  </p>
                </div>
              </div>
              <ul className="text-xs text-teal-900 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>አዳዲስ መምህራንን መቅጠር፣ ማስተማሪያ ፈቃዳቸውን (License) እና ዲግሪያቸውን ማረጋገጥ</li>
                <li>መምህራንን በየክፍሉና በየትምህርት አይነቱ ማስተማሪያ ክፍለ-ጊዜ መመደብ</li>
                <li>የመምህራን የስራ አፈጻጸም፣ መገኘት እና ሙያዊ ብቃት ምዘና ማካሄድ</li>
                <li>ከዳይሬክተር ጋር በመተባበር ለመምህራን የመግቢያ ኮድ መስጠት</li>
              </ul>
            </div>

            {/* Box 3: Accountant */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                    3. ዋና ሒሳብ ሹም / ፋይናንስ (Accountant & Bursar)
                  </h4>
                  <p className="text-[11px] text-emerald-800 font-semibold">
                    የትምህርት ቤቱን ገቢና ወጪ የሚቆጣጠር
                  </p>
                </div>
              </div>
              <ul className="text-xs text-emerald-900 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>የተማሪዎችን ወርሃዊ ክፍያ በቴሌብር፣ በሲቢኢ ብርና በጥሬ ገንዘብ መሰብሰብ</li>
                <li>ይፋዊ ዲጂታል ደረሰኞችን መቁረጥ እና ለወላጆች ማድረስ</li>
                <li>የትምህርት ቤቱን አስተዳደራዊ ወጪዎች (ደሞዝ፣ መብራት፣ ውሃ፣ ጥገና) መመዝገብ</li>
                <li>ለዳይሬክተር እና ለቦርዱ ወርሃዊ እና ዓመታዊ የፋይናንስ ሪፖርት ማቅረብ</li>
              </ul>
            </div>

            {/* Box 4: Librarian & IT Specialist */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-700 text-white flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                    4. ቤተ-መጻሕፍት እና ላብራቶሪ ባለሙያዎች (Librarian & Lab IT)
                  </h4>
                  <p className="text-[11px] text-amber-800 font-semibold">
                    የትምህርት ግብአቶችን እና የቴክኖሎጂ ላብራቶሪን የሚመራ
                  </p>
                </div>
              </div>
              <ul className="text-xs text-amber-900 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>ስርዓተ-ትምህርታዊ መማሪያ መጻሕፍትን ማደራጀትና ለተማሪዎች ማከፋፈል</li>
                <li>የኮምፒውተር እና የሳይንስ (ፊዚክስ/ኬሚስትሪ/ባዮሎጂ) ላብራቶሪ ሙከራዎችን ማስተባበር</li>
                <li>የትምህርት ቤቱን ዲጂታል የመረጃ ቋት እና የፋይዳ ብሔራዊ መታወቂያ መዝገብ መጠበቅ</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Student */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-blue-900 to-teal-950 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">አዲስ ተማሪ ምዝገባ (Student Admission)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-blue-200 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  የተማሪው ሙሉ ስም (የአያት ስም ጨምሮ) *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ምሳሌ፡ ኪያር ጀማል ሁሴን"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              {/* Shift Selector: Morning, Afternoon, Evening */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  የትምህርት ፈረቃ (Shift / Program) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStudentShift('morning');
                      if (section.startsWith('N')) setSection(section.replace(/^N/, '') || 'A');
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                      studentShift === 'morning'
                        ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Sunrise className="w-3.5 h-3.5" />
                    <span>🌅 የጧት (2:00 - 6:30)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStudentShift('afternoon');
                      if (section.startsWith('N')) setSection(section.replace(/^N/, '') || 'A');
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                      studentShift === 'afternoon'
                        ? 'bg-orange-600 text-white border-orange-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>☀️ የከሰዓት (6:30 - 11:30)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStudentShift('evening');
                      if (!section.startsWith('N')) setSection('N1');
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                      studentShift === 'evening'
                        ? 'bg-slate-950 text-amber-300 border-slate-950 shadow-xs font-black'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-amber-300" />
                    <span>🌙 የማታ (11:30 - 3:00)</span>
                  </button>
                </div>

                {studentShift === 'evening' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        የቀን ስራ / ሞያ (Occupation)
                      </label>
                      <input
                        type="text"
                        value={studentOccupation}
                        onChange={(e) => setStudentOccupation(e.target.value)}
                        placeholder="ለምሳሌ፡ ነጋዴ፣ ሰራተኛ..."
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        የስራ ቦታ (Workplace)
                      </label>
                      <input
                        type="text"
                        value={studentWorkplace}
                        onChange={(e) => setStudentWorkplace(e.target.value)}
                        placeholder="ለምሳሌ፡ ሻሸመኔ ገበያ"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ጾታ *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="M">ወንድ (M)</option>
                    <option value="F">ሴት (F)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    የክፍል ደረጃ *
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
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
                    ሴክሽን *
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    የወላጅ / አሳዳጊ ሙሉ ስም *
                  </label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="ምሳሌ፡ አቶ ጀማል ሁሴን"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    የወላጅ ስልክ ቁጥር *
                  </label>
                  <input
                    type="tel"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="+251 91 1..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                ℹ️ ሲስተሙ ለተማሪው እና ለወላጁ ራስ-ሰር የመግቢያ ኮድ (Access Code) እና ይፋዊ የመታወቂያ ቁጥር ያመነጫል።
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>ተማሪውን መዝግብ እና መታወቂያ አትም</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student ID Card Modal */}
      {selectedStudentForIdCard && (
        <StudentIDCardModal
          isOpen={true}
          onClose={() => setSelectedStudentForIdCard(null)}
          student={selectedStudentForIdCard}
          school={school}
          currentLang={currentLang}
        />
      )}
    </div>
  );
};
