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
  Sunrise,
  Lock
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
  const isOm = currentLang === 'om';
  const isEn = currentLang === 'en';
  const t3 = (om: string, en: string, am: string) => (isOm ? om : isEn ? en : am);

  const isBureauRole = currentUser?.role === 'bureau_admin' || currentUser?.role === 'bureau_staff';
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
      morning: t3(
        'Wiixata - Jimaata | Ganama 8:00 AM - 12:30 PM',
        'Mon - Fri | Morning: 8:00 AM - 12:30 PM',
        'ሰኞ - አርብ | 2:00 - 6:30 ጧት (Morning: 8:00 AM - 12:30 PM)'
      ),
      afternoon: t3(
        'Wiixata - Jimaata | Waaree Booda 12:30 PM - 5:30 PM',
        'Mon - Fri | Afternoon: 12:30 PM - 5:30 PM',
        'ሰኞ - አርብ | 6:30 - 11:30 ከሰዓት (Afternoon: 12:30 PM - 5:30 PM)'
      ),
      evening: t3(
        'Wiixata - Jimaata | Galgala 5:30 PM - 9:00 PM',
        'Mon - Fri | Evening: 5:30 PM - 9:00 PM',
        'ሰኞ - አርብ | 11:30 - 3:00 ማታ (Evening: 5:30 PM - 9:00 PM)'
      )
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
      occupation: isNight
        ? studentOccupation.trim() || t3('Hojii Dhuunfaa (Self-Employed)', 'Self-Employed', 'የግል ስራ (Self-Employed)')
        : undefined,
      workplace: isNight
        ? studentWorkplace.trim() || t3('Shaashamannee', 'Shashemene', 'ሻሸመኔ')
        : undefined,
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
        authorName: currentUser?.name || t3('Rejistraara', 'Registrar', 'ሬጅስትራር'),
        schoolName: school.name,
        description: t3(
          `Odeeffannoo galmee fi qabxii barataa ${newStudent.fullName} (Kutaa ${newStudent.grade}${newStudent.section})`,
          `Registration and score record for ${newStudent.fullName} (Grade ${newStudent.grade}${newStudent.section})`,
          `የተማሪ ${newStudent.fullName} (ክፍል ${newStudent.grade}${newStudent.section}) የውጤትና ምዝገባ መረጃ`
        )
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
              <span>
                {t3(
                  'Simannaa Barattootaa, Galmee fi Caasaa Mana Barumsaa',
                  'Student Admissions, Registration & School Structure',
                  'የተማሪዎች ቅበላ፣ ምዝገባ እና የትምህርት ቤት መዋቅር'
                )}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {t3(
                'Waajjira Rejistraaraa fi Simannaa (Registrar & Admissions Hub)',
                'Registrar & Admissions Hub',
                'የሬጅስትራር ጽሕፈት ቤት (Registrar & Admissions Hub)'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              {t3(
                'Barattoota haaraa galmeessuu, kutaa fi daree ramaduu, waraqaa eenyummaa barattootaa (Student ID Card) maxxansuu fi caasaa bulchiinsa mana barumsaa guutuu hogganuu.',
                'Register new students, assign grades and sections, print official Student ID cards, and oversee the school administrative hierarchy.',
                'አዳዲስ ተማሪዎችን የመመዝገብ፣ ክፍልና ሴክሽን የመመደብ፣ ይፋዊ የተማሪዎች መታወቂያ ካርድ (Student ID Card) የማተም እና የት/ቤቱን ሙሉ የአስተዳደር መዋቅር የማስተዳደር ስልጣን'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isBureauRole ? (
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{t3('Barataa Haaraa Galmeessi (Admit)', 'Admit New Student', 'አዲስ ተማሪ መዝግብ (Admit Student)')}</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500/20 text-amber-200 border border-amber-400/40 rounded-xl text-xs font-bold">
                <Lock className="w-4 h-4 text-amber-300" />
                <span>{t3('Ilaalcha Biiroo Barnootaa (Dubbisuu Qofa)', 'Bureau View (Read-Only)', 'የትምህርት ቢሮ እይታ (ማየት ብቻ - Read-Only)')}</span>
              </div>
            )}
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
          <span>
            {t3(
              `Galmee fi Simannaa Barattootaa (${students.length})`,
              `Student Roster & Admissions (${students.length})`,
              `የተማሪዎች መዝገብ እና ቅበላ (${students.length})`
            )}
          </span>
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
          <span>
            {t3(
              'Caasaa Mana Barumsaa fi Gahee Hojii (Hierarchy)',
              'School Structure & Job Roles (Hierarchy)',
              'የትምህርት ቤት መዋቅር እና የስራ ድርሻ (Organizational Hierarchy)'
            )}
          </span>
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
                    <h4 className="text-xs font-black text-slate-900">
                      {t3('Shifftii Ganamaa (Morning)', 'Morning Shift', 'የጧት ፈረቃ (Morning)')}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {t3('8:00 AM - 12:30 PM', '8:00 AM - 12:30 PM', '2:00 - 6:30 ቀን')}
                    </span>
                  </div>
                </div>
                <span className="text-xl font-black text-amber-950 font-mono">
                  {shiftCounts.morning}
                </span>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-amber-200/60">
                <span className="text-slate-600">
                  {t3('Barattoota Guyyaa Idilee', 'Regular Day Students', 'መደበኛ የቀን ተማሪዎች')}
                </span>
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
                    <h4 className="text-xs font-black text-slate-900">
                      {t3('Shifftii Waaree Booda (Afternoon)', 'Afternoon Shift', 'የከሰዓት ፈረቃ (Afternoon)')}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {t3('12:30 PM - 5:30 PM', '12:30 PM - 5:30 PM', '6:30 - 11:30 ቀን')}
                    </span>
                  </div>
                </div>
                <span className="text-xl font-black text-orange-950 font-mono">
                  {shiftCounts.afternoon}
                </span>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-orange-200/60">
                <span className="text-slate-600">
                  {t3('Shifftii Jijjiiramaa', 'Rotating Shift', 'ተዘዋዋሪ ፈረቃ')}
                </span>
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
                      <h4 className="text-xs font-black text-amber-300">
                        {t3('Shifftii Galgalaa (Evening)', 'Evening Shift', 'የማታ ፈረቃ (Evening)')}
                      </h4>
                      <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 text-[9px] font-black rounded-sm">
                        Night
                      </span>
                    </div>
                    <span className="text-[10px] text-indigo-200/80 font-mono">
                      {t3('5:30 PM - 9:00 PM', '5:30 PM - 9:00 PM', '11:30 - 3:00 ማታ')}
                    </span>
                  </div>
                </div>
                <span className="text-xl font-black text-white font-mono">
                  {shiftCounts.evening}
                </span>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-indigo-800/80">
                <span className="text-indigo-200">
                  {t3('Gaheessota Hojjettoota', 'Working Adults', 'የስራ ተሰማሪ አዋቂዎች')}
                </span>
                <span className="font-bold text-amber-300">
                  {students.filter((s) => resolveStudentShiftCategory(s) === 'evening' && s.occupation).length}{' '}
                  {t3('Hojjettoota', 'Workers', 'ሰራተኞች')}
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
                  placeholder={t3(
                    'Barataa maqaan, lakkoofsa eenyummaan, koodiin ykn maatiin barbaadi...',
                    'Search student by name, ID number, code, or parent...',
                    'ተማሪ በስም፣ በመለያ ቁጥር፣ በኮድ ወይም በወላጅ ፈልግ...'
                  )}
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
                  <option value="all">{t3(`Kutaalee Hunda (${students.length})`, `All Grades (${students.length})`, `ሁሉም ክፍሎች (${students.length})`)}</option>
                  {availableGrades.map((g) => (
                    <option key={g} value={g}>
                      {t3(`Kutaa ${g}ffaa`, `Grade ${g}`, `${g}ኛ ክፍል`)} ({students.filter((s) => s.grade === g).length})
                    </option>
                  ))}
                </select>

                {/* Section Filter */}
                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-700 focus:outline-hidden"
                >
                  <option value="all">{t3('Dareewwan Hunda', 'All Sections', 'ሁሉም ሴክሽኖች')}</option>
                  {availableSections.map((sec) => (
                    <option key={sec} value={sec}>
                      {t3(`Daree ${sec}`, `Section ${sec}`, `ሴክሽን ${sec}`)} ({students.filter((s) => (gradeFilter === 'all' || s.grade === gradeFilter) && s.section.toUpperCase() === sec).length})
                    </option>
                  ))}
                </select>

                {/* Shift Filter Dropdown (Morning / Afternoon / Evening) */}
                <select
                  value={shiftFilter}
                  onChange={(e) => setShiftFilter(e.target.value as any)}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-700 focus:outline-hidden"
                >
                  <option value="all">{t3(`Shifftii Hunda (${students.length})`, `All Shifts (${students.length})`, `ሁሉንም ፈረቃዎች (${students.length})`)}</option>
                  <option value="morning">🌅 {t3(`Shifftii Ganamaa (${shiftCounts.morning})`, `Morning Shift (${shiftCounts.morning})`, `የጧት ፈረቃ (${shiftCounts.morning})`)}</option>
                  <option value="afternoon">☀️ {t3(`Shifftii Waaree Booda (${shiftCounts.afternoon})`, `Afternoon Shift (${shiftCounts.afternoon})`, `የከሰዓት ፈረቃ (${shiftCounts.afternoon})`)}</option>
                  <option value="evening">🌙 {t3(`Shifftii Galgalaa (${shiftCounts.evening})`, `Evening Shift (${shiftCounts.evening})`, `የማታ ፈረቃ (${shiftCounts.evening})`)}</option>
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-700 focus:outline-hidden"
                >
                  <option value="grade_asc">{t3('Tartiiba: Kutaa (Xiqqaa → Guddaa)', 'Sort: Grade (Low → High)', 'ደርድር፡ ክፍል (ዝቅተኛ → ከፍተኛ)')}</option>
                  <option value="grade_desc">{t3('Tartiiba: Kutaa (Guddaa → Xiqqaa)', 'Sort: Grade (High → Low)', 'ደርድር፡ ክፍል (ከፍተኛ → ዝቅተኛ)')}</option>
                  <option value="section_asc">{t3('Tartiiba: Daree (A → Z)', 'Sort: Section (A → Z)', 'ደርድር፡ ሴክሽን (A → Z)')}</option>
                  <option value="section_desc">{t3('Tartiiba: Daree (Z → A)', 'Sort: Section (Z → A)', 'ደርድር፡ ሴክሽን (Z → A)')}</option>
                  <option value="name_asc">{t3('Tartiiba: Maqaa (A → Z)', 'Sort: Name (A → Z)', 'ደርድር፡ ስም (A → Z)')}</option>
                  <option value="name_desc">{t3('Tartiiba: Maqaa (Z → A)', 'Sort: Name (Z → A)', 'ደርድር፡ ስም (Z → A)')}</option>
                  <option value="id_asc">{t3('Tartiiba: Lakkoofsa Eenyummaa', 'Sort: ID Number', 'ደርድር፡ መለያ ቁጥር')}</option>
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
                    <span>{t3('Qulqulleessi', 'Reset', 'አፅዳ')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Shift Filter Pills Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-emerald-700" />
                  <span>{t3('Shifftii (Shift):', 'Shift:', 'ፈረቃ (Shift)፡')}</span>
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
                  {t3('Hunda', 'All', 'ሁሉም')} ({students.length})
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
                  <span>🌅 {t3(`Ganama (${shiftCounts.morning})`, `Morning (${shiftCounts.morning})`, `የጧት ፈረቃ (${shiftCounts.morning})`)}</span>
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
                  <span>☀️ {t3(`Waaree Booda (${shiftCounts.afternoon})`, `Afternoon (${shiftCounts.afternoon})`, `የከሰዓት ፈረቃ (${shiftCounts.afternoon})`)}</span>
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
                  <span>🌙 {t3(`Galgala (${shiftCounts.evening})`, `Evening (${shiftCounts.evening})`, `የማታ ፈረቃ (${shiftCounts.evening})`)}</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 font-semibold">
                <span>
                  {t3(
                    `Barattoonni ${filteredStudents.length} filatamaniiru (keessaa ${students.length})`,
                    `${filteredStudents.length} students filtered (of ${students.length})`,
                    `${filteredStudents.length} ተማሪዎች ተጣርተዋል (ከ ${students.length})`
                  )}
                </span>
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
                      <span>{t3('Lakkoofsa Eenyummaa Barataa', 'Student ID Number', 'የተማሪ መለያ ቁጥር')}</span>
                      {sortBy === 'id_asc' && <ArrowUp className="w-3 h-3 text-emerald-800" />}
                    </div>
                  </th>
                  <th
                    className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => setSortBy(sortBy === 'name_asc' ? 'name_desc' : 'name_asc')}
                  >
                    <div className="flex items-center gap-1">
                      <span>{t3('Maqaa Guutuu', 'Full Name', 'ሙሉ ስም')}</span>
                      {sortBy === 'name_asc' ? (
                        <ArrowUp className="w-3 h-3 text-emerald-800" />
                      ) : sortBy === 'name_desc' ? (
                        <ArrowDown className="w-3 h-3 text-emerald-800" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-3">{t3('Saala', 'Gender', 'ጾታ')}</th>
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
                      <span>{t3('Kutaa & Daree', 'Grade & Section', 'ክፍል & ሴክሽን')}</span>
                      {sortBy === 'grade_asc' || sortBy === 'section_asc' ? (
                        <ArrowUp className="w-3 h-3 text-emerald-800" />
                      ) : sortBy === 'grade_desc' || sortBy === 'section_desc' ? (
                        <ArrowDown className="w-3 h-3 text-emerald-800" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-3">{t3('Shifftii (Shift)', 'Shift', 'ፈረቃ (Shift)')}</th>
                  <th className="py-3 px-3">{t3('Maqaa Maatii', 'Parent Name', 'የወላጅ ስም')}</th>
                  <th className="py-3 px-3">{t3('Bilbila Maatii', 'Parent Phone', 'የወላጅ ስልክ')}</th>
                  <th className="py-3 px-3">{t3('Koodii Barataa', 'Student Code', 'የተማሪ ኮድ')}</th>
                  <th className="py-3 px-3 text-right">{t3('Waraqaa Eenyummaa', 'ID Card', 'የመታወቂያ ካርድ')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-500">
                      <GraduationCap className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="text-xs font-bold text-slate-700">
                        {t3(
                          'Shifftii, sadarkaa kutaa ykn daree filatameen barataan tokkollee hin argamne',
                          'No students found for the selected shift, grade, or section',
                          'በተመረጠው የፈረቃ፣ ክፍል ደረጃ ወይም ሴክሽን ምንም ተማሪ አልተገኘም'
                        )}
                      </p>
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
                        {t3('Barattoota Hunda Agarsiisi', 'Show All Students', 'ሁሉንም ተማሪዎች አሳይ')}
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
                            {st.gender === 'F'
                              ? t3('Dubara', 'Female', 'ሴት')
                              : t3('Dhiira', 'Male', 'ወንድ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700">
                          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-bold">
                            {t3(`${st.grade}ffaa`, `G${st.grade}`, `${st.grade}ኛ`)} ({st.section})
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {shiftCat === 'evening' ? (
                            <div>
                              <span className="px-2 py-0.5 bg-indigo-950 text-amber-300 rounded-md text-[10px] font-extrabold inline-flex items-center gap-1 shadow-2xs">
                                <Moon className="w-2.5 h-2.5 text-amber-300" />
                                <span>{t3('Galgala (5:30 - 9:00 PM)', 'Evening (5:30 - 9:00 PM)', 'ማታ (11:30 - 3:00)')}</span>
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
                              <span>{t3('Waaree Booda (12:30 - 5:30 PM)', 'Afternoon (12:30 - 5:30 PM)', 'ከሰዓት (6:30 - 11:30)')}</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 rounded-md text-[10px] font-bold inline-flex items-center gap-1">
                              <Sunrise className="w-2.5 h-2.5 text-amber-700" />
                              <span>{t3('Ganama (8:00 AM - 12:30 PM)', 'Morning (8:00 AM - 12:30 PM)', 'ጧት (2:00 - 6:30)')}</span>
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
                            <span>{t3('Eenyummaa Maxxansi', 'Print ID', 'መታወቂያ አትም')}</span>
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
              {t3(
                'Caasaa Bulchiinsa Mana Barumsaa Guutuu, Kutaalee Hojii fi Itti Gaafatamummaa',
                'Complete School Administrative Structure, Departments & Responsibilities',
                'የትምህርት ቤት የተሟላ የአስተዳደር መዋቅር፣ የስራ ክፍሎች እና ኃላፊነቶች'
              )}
            </h3>
            <p className="text-xs text-slate-500">
              {t3(
                'Barataa fi barsiisaa eenyutu galmeessa? Hojjettoonni akkamiihoo barbaachisu?',
                'Who registers students and teachers? What key staff roles are required?',
                'ተማሪንና መምህርን ማን ይመዘግባል? ምን ምን ሰራተኞችስ ያስፈልጋሉ?'
              )}
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
                    {t3(
                      '1. Rejistraara / Galmeessaa Barattootaa (School Registrar)',
                      '1. School Registrar & Admissions Officer',
                      '1. ሬጅስትራር / የተማሪዎች መዝጋቢ (School Registrar)'
                    )}
                  </h4>
                  <p className="text-[11px] text-blue-800 font-semibold">
                    {t3(
                      'Gaaffii "Barataa eenyutu galmeessa?" jedhuuf itti gaafatamaa kallattii',
                      'Directly responsible for student admissions and official records',
                      'ተማሪን ማን ይመዘግባል? ለሚለው ጥያቄ ቀጥተኛ ኃላፊ'
                    )}
                  </p>
                </div>
              </div>
              <ul className="text-xs text-blue-900 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>
                  {t3(
                    'Barattoota haaraa fi duraanii sirna keessatti galmeessuu fi lakkoofsa faayilaa kennuu',
                    'Register new and returning students in the system and issue file numbers',
                    'አዳዲስ እና ነባር ተማሪዎችን በሲስተም መመዝገብ እና የፋይል ቁጥር መስጠት'
                  )}
                </li>
                <li>
                  {t3(
                    'Ramaddii kutaa fi daree gaggeessuu',
                    'Manage grade level and section placements',
                    'የክፍል እና የሴክሽን ምደባዎችን ማካሄድ'
                  )}
                </li>
                <li>
                  {t3(
                    'Waraqaa eenyummaa barattootaa idilee (Student ID Card) suuraa fi baarkoodiin maxxansuu',
                    'Print official photo and barcode/QR Student ID Cards',
                    'ይፋዊ የተማሪዎች መታወቂያ ካርድ (Student ID Card) በፎቶና በባርኮድ ማተም'
                  )}
                </li>
                <li>
                  {t3(
                    'Sanadoota qabxii barnootaa, tiraanskiriippii fi jijjiirraa barataa (Transfer) qopheessuu',
                    'Prepare academic score sheets, transcripts, and student transfers',
                    'የትምህርት ውጤት ሰነዶችን፣ ትራንስክሪፕት እና የተማሪ ዝውውር (Transfer) ማዘጋጀት'
                  )}
                </li>
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
                    {t3(
                      '2. Itti Aanaa Daayirektaraa fi Humna Namaa (Vice Principal / HR)',
                      '2. Vice Principal & Human Resources (HR)',
                      '2. ምክትል ርዕሰ መምህር እና የሰው ኃይል (Vice Principal / HR)'
                    )}
                  </h4>
                  <p className="text-[11px] text-teal-800 font-semibold">
                    {t3(
                      'Gaaffii "Barsiisaa eenyutu galmeessa?" jedhuuf itti gaafatamaa kallattii',
                      'Directly responsible for teacher recruitment and onboarding',
                      'አስተማሪን ማን ይመዘግባል? ለሚለው ጥያቄ ቀጥተኛ ኃላፊ'
                    )}
                  </p>
                </div>
              </div>
              <ul className="text-xs text-teal-900 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>
                  {t3(
                    'Barsiisota haaraa qacaruu, hayyama barsiisuu (License) fi digrii isaanii mirkaneessuu',
                    'Recruit new teachers and verify teaching licenses and degrees',
                    'አዳዲስ መምህራንን መቅጠር፣ ማስተማሪያ ፈቃዳቸውን (License) እና ዲግሪያቸውን ማረጋገጥ'
                  )}
                </li>
                <li>
                  {t3(
                    'Barsiisota kutaalee fi gosa barnootaan wayitii barsiisuu ramaduu',
                    'Assign teachers to classes and subjects by teaching period',
                    'መምህራንን በየክፍሉና በየትምህርት አይነቱ ማስተማሪያ ክፍለ-ጊዜ መመደብ'
                  )}
                </li>
                <li>
                  {t3(
                    'Madaallii raawwii hojii, argama fi ga’umsa ogummaa barsiisotaa gaggeessuu',
                    'Conduct teacher performance, attendance, and competency evaluations',
                    'የመምህራን የስራ አፈጻጸም፣ መገኘት እና ሙያዊ ብቃት ምዘና ማካሄድ'
                  )}
                </li>
                <li>
                  {t3(
                    'Daayirektara waliin ta’uun barsiisotaaf koodii seensaa kennuu',
                    'Coordinate with the Director to issue teacher portal access codes',
                    'ከዳይሬክተር ጋር በመተባበር ለመምህራን የመግቢያ ኮድ መስጠት'
                  )}
                </li>
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
                    {t3(
                      '3. Ogeessa Herregaa / Faayinaansii (Accountant & Bursar)',
                      '3. Chief Accountant & Bursar (Finance)',
                      '3. ዋና ሒሳብ ሹም / ፋይናንስ (Accountant & Bursar)'
                    )}
                  </h4>
                  <p className="text-[11px] text-emerald-800 font-semibold">
                    {t3(
                      'Galii fi baasii mana barumsaa kan to’atu',
                      'Oversees all school revenue and expenditure',
                      'የትምህርት ቤቱን ገቢና ወጪ የሚቆጣጠር'
                    )}
                  </p>
                </div>
              </div>
              <ul className="text-xs text-emerald-900 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>
                  {t3(
                    'Kaffaltii ji’aa barattootaa Telebirr, CBE Birr fi maallaqa callaadhaan walitti qabuu',
                    'Collect monthly student tuition via Telebirr, CBE Birr, and cash',
                    'የተማሪዎችን ወርሃዊ ክፍያ በቴሌብር፣ በሲቢኢ ብርና በጥሬ ገንዘብ መሰብሰብ'
                  )}
                </li>
                <li>
                  {t3(
                    'Nagahee dijitaalaa idilee muruu fi maatiif erguu',
                    'Issue official digital receipts and deliver them to parents',
                    'ይፋዊ ዲጂታል ደረሰኞችን መቁረጥ እና ለወላጆች ማድረስ'
                  )}
                </li>
                <li>
                  {t3(
                    'Baasiiwwan bulchiinsaa mana barumsaa (mindaa, ibsaa, bishaan, suphaa) galmeessuu',
                    'Record administrative expenses (payroll, utilities, maintenance)',
                    'የትምህርት ቤቱን አስተዳደራዊ ወጪዎች (ደሞዝ፣ መብራት፣ ውሃ፣ ጥገና) መመዝገብ'
                  )}
                </li>
                <li>
                  {t3(
                    'Daayirektaraa fi boordiif gabaasa faayinaansii ji’aa fi waggaa dhiyeessuu',
                    'Submit monthly and annual financial reports to the Director and Board',
                    'ለዳይሬክተር እና ለቦርዱ ወርሃዊ እና ዓመታዊ የፋይናንስ ሪፖርት ማቅረብ'
                  )}
                </li>
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
                    {t3(
                      '4. Ogeessota Mana Kitaabaa fi Laabooraatoorii (Librarian & Lab IT)',
                      '4. Librarian & Laboratory / IT Specialists',
                      '4. ቤተ-መጻሕፍት እና ላብራቶሪ ባለሙያዎች (Librarian & Lab IT)'
                    )}
                  </h4>
                  <p className="text-[11px] text-amber-800 font-semibold">
                    {t3(
                      'Galteewwan barnootaa fi laabooraatoorii teeknoloojii kan hogganu',
                      'Manages learning resources and science/IT laboratories',
                      'የትምህርት ግብአቶችን እና የቴክኖሎጂ ላብራቶሪን የሚመራ'
                    )}
                  </p>
                </div>
              </div>
              <ul className="text-xs text-amber-900 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>
                  {t3(
                    'Kitaabota barnootaa sirna barnootaa qindeessuu fi barattootaaf raabsuu',
                    'Organize curriculum textbooks and distribute them to students',
                    'ስርዓተ-ትምህርታዊ መማሪያ መጻሕፍትን ማደራጀትና ለተማሪዎች ማከፋፈል'
                  )}
                </li>
                <li>
                  {t3(
                    'Yaaliiwwan laabooraatoorii kompiitaraa fi saayinsii (Fiiziksii/Keemistirii/Baayoolojii) qindeessuu',
                    'Coordinate computer and science (Physics/Chemistry/Biology) lab sessions',
                    'የኮምፒውተር እና የሳይንስ (ፊዚክስ/ኬሚስትሪ/ባዮሎጂ) ላብራቶሪ ሙከራዎችን ማስተባበር'
                  )}
                </li>
                <li>
                  {t3(
                    'Kuusaa odeeffannoo dijitaalaa mana barumsaa fi galmee eenyummaa biyyaalessaa Fayda eeguu',
                    'Maintain the school digital database and Fayda national ID records',
                    'የትምህርት ቤቱን ዲጂታል የመረጃ ቋት እና የፋይዳ ብሔራዊ መታወቂያ መዝገብ መጠበቅ'
                  )}
                </li>
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
                <h3 className="font-bold text-base">
                  {t3('Galmee Barataa Haaraa (Student Admission)', 'New Student Admission', 'አዲስ ተማሪ ምዝገባ (Student Admission)')}
                </h3>
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
                  {t3('Maqaa Guutuu Barataa (Maqaa Akaakayyuu Dabalatee) *', 'Student Full Name *', 'የተማሪው ሙሉ ስም (የአያት ስም ጨምሮ) *')}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t3('Fakkeenyaaf: Kiyaar Jamaal Huseen', 'e.g., Kiyar Jemal Hussein', 'ምሳሌ፡ ኪያር ጀማል ሁሴን')}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              {/* Shift Selector: Morning, Afternoon, Evening */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  {t3('Shifftii Barnootaa (Shift / Program) *', 'Study Shift / Program *', 'የትምህርት ፈረቃ (Shift / Program) *')}
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
                    <span>🌅 {t3('Ganama (8:00 - 12:30)', 'Morning (8:00 - 12:30)', 'የጧት (2:00 - 6:30)')}</span>
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
                    <span>☀️ {t3('Waaree Booda (12:30 - 5:30)', 'Afternoon (12:30 - 5:30)', 'የከሰዓት (6:30 - 11:30)')}</span>
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
                    <span>🌙 {t3('Galgala (5:30 - 9:00 PM)', 'Evening (5:30 - 9:00 PM)', 'የማታ (11:30 - 3:00)')}</span>
                  </button>
                </div>

                {studentShift === 'evening' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        {t3('Hojii Guyyaa / Ogummaa (Occupation)', 'Daytime Occupation', 'የቀን ስራ / ሞያ (Occupation)')}
                      </label>
                      <input
                        type="text"
                        value={studentOccupation}
                        onChange={(e) => setStudentOccupation(e.target.value)}
                        placeholder={t3('Fakkeenyaaf: Daldalaa, Hojjetaa...', 'e.g., Merchant, Employee...', 'ለምሳሌ፡ ነጋዴ፣ ሰራተኛ...')}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        {t3('Bakka Hojii (Workplace)', 'Workplace', 'የስራ ቦታ (Workplace)')}
                      </label>
                      <input
                        type="text"
                        value={studentWorkplace}
                        onChange={(e) => setStudentWorkplace(e.target.value)}
                        placeholder={t3('Fakkeenyaaf: Gabaa Shaashamannee', 'e.g., Shashemene Market', 'ለምሳሌ፡ ሻሸመኔ ገበያ')}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t3('Saala *', 'Gender *', 'ጾታ *')}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="M">{t3('Dhiira (M)', 'Male (M)', 'ወንድ (M)')}</option>
                    <option value="F">{t3('Dubara (F)', 'Female (F)', 'ሴት (F)')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t3('Sadarkaa Kutaa *', 'Grade Level *', 'የክፍል ደረጃ *')}
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
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
                    {t3('Daree *', 'Section *', 'ሴክሽን *')}
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
                    {t3('Maqaa Guutuu Maatii / Guddistuu *', 'Parent / Guardian Full Name *', 'የወላጅ / አሳዳጊ ሙሉ ስም *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder={t3('Fakkeenyaaf: Obbo Jamaal Huseen', 'e.g., Ato Jemal Hussein', 'ምሳሌ፡ አቶ ጀማል ሁሴን')}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t3('Lakkoofsa Bilbilaa Maatii *', 'Parent Phone Number *', 'የወላጅ ስልክ ቁጥር *')}
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
                {t3(
                  'ℹ️ Sirni kun barataa fi maatiif ofumaan koodii seensaa (Access Code) fi lakkoofsa eenyummaa idilee ni maddisiisa.',
                  'ℹ️ The system automatically generates an Access Code and official Student ID number for the student and parent.',
                  'ℹ️ ሲስተሙ ለተማሪው እና ለወላጁ ራስ-ሰር የመግቢያ ኮድ (Access Code) እና ይፋዊ የመታወቂያ ቁጥር ያመነጫል።'
                )}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {t3('Haqi', 'Cancel', 'ሰርዝ')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>{t3('Barataa Galmeessi & Eenyummaa Maxxansi', 'Register & Print ID', 'ተማሪውን መዝግብ እና መታወቂያ አትም')}</span>
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
