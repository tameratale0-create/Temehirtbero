import {
  School,
  BureauStaff,
  TeacherCredential,
  TeacherExam,
  ExamSubmission,
  TrainingMaterial,
  TrainingAttachment,
  StudentRecord,
  SchoolReportSubmission,
  BureauStandardCriteria,
  SchoolStakeholder,
  SchoolAnnouncement,
  HomeworkAssignment,
  HomeworkSubmission,
  StudentAttendanceRecord,
  FeePaymentRecord,
  SchoolExpenseRecord,
  DirectorAppointment,
  LibraryBookRecord,
  TeacherEvaluationRecord,
  TeacherEvaluationSummary,
  AcademicGradeWorkflowBatch,
  AcademicPeriodType,
  GradeApprovalStatus,
  StudentWorkflowGradeItem,
  StudentReportNotification,
  NightClassScheduleItem,
  NightAttendanceEntry,
  DeveloperPaymentReceipt,
  DeveloperPaymentConfig,
  DeveloperPaymentStatus,
  StudentDisciplineReport,
  TeacherTrainingNotification,
  SchoolBankAccount
} from '../types';
import {
  initialSchools,
  initialStaff,
  initialTeacherCredentials,
  initialExams,
  initialTrainingMaterials,
  initialStudentReports,
  initialBureauStandards,
  initialStudents,
  initialStakeholders,
  initialAnnouncements,
  initialHomework,
  initialHomeworkSubmissions,
  initialAttendance,
  initialFeePayments,
  initialExpenses,
  initialDirectorAppointments,
  initialSubmissions,
  initialNightClassSchedule,
  initialDeveloperConfig,
  initialDeveloperPayments,
  initialDisciplineReports,
  initialSchoolBankAccounts
} from '../data/initialData';
import { OfflineSyncManager } from './offlineSync';

const STORAGE_KEYS = {
  SCHOOLS: 'shash_edu_schools_v1',
  STAFF: 'shash_edu_staff_v1',
  CREDENTIALS: 'shash_edu_credentials_v1',
  EXAMS: 'shash_edu_exams_v1',
  SUBMISSIONS: 'shash_edu_submissions_v1',
  TRAINING: 'shash_edu_training_v1',
  REPORTS: 'shash_edu_reports_v1',
  STANDARDS: 'shash_edu_standards_v1',
  STUDENTS: 'shash_edu_students_v1',
  STAKEHOLDERS: 'shash_edu_stakeholders_v1',
  SCHOOL_CODES: 'shash_edu_school_codes_v1',
  ANNOUNCEMENTS: 'shash_edu_announcements_v1',
  HOMEWORK: 'shash_edu_homework_v1',
  HOMEWORK_SUBMISSIONS: 'shash_edu_hw_submissions_v1',
  ATTENDANCE: 'shash_edu_attendance_v1',
  FEE_PAYMENTS: 'shash_edu_fee_payments_v1',
  EXPENSES: 'shash_edu_expenses_v1',
  DIRECTOR_APPOINTMENTS: 'shash_edu_director_appts_v1',
  LIBRARY_BOOKS: 'shash_edu_library_v1',
  TEACHER_TRAINING_PROGRESS: 'shash_edu_teacher_training_progress_v1',
  TEACHER_EVALUATIONS: 'shash_edu_teacher_evaluations_v1',
  GRADE_WORKFLOW_BATCHES: 'shash_edu_grade_workflows_v1',
  STUDENT_REPORT_NOTIFICATIONS: 'shash_edu_student_report_notifications_v1',
  NIGHT_SCHEDULE: 'shash_edu_night_schedule_v1',
  NIGHT_ATTENDANCE: 'shash_edu_night_attendance_v1',
  DEVELOPER_PAYMENTS: 'shash_edu_dev_payments_v1',
  DEVELOPER_CONFIG: 'shash_edu_dev_config_v1',
  DISCIPLINE_REPORTS: 'shash_edu_discipline_reports_v1',
  TEACHER_TRAINING_NOTIFICATIONS: 'shash_edu_teacher_training_notifications_v1',
  SCHOOL_BANK_ACCOUNTS: 'shash_edu_school_bank_accounts_v1',
  LAST_SYNC: 'shash_edu_last_sync_v1'
};

export interface SchoolUserCode {
  id: string;
  schoolId: string;
  schoolName: string;
  role: 'school_director' | 'teacher' | 'student' | 'parent' | 'school_owner' | 'accountant' | 'registrar';
  fullName: string;
  accessCode: string;
  assignedClassOrSubject: string;
  createdAt: string;
}

const initialSchoolCodes: SchoolUserCode[] = [
  {
    id: 'sc-1',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    role: 'school_director',
    fullName: 'አቶ ጉተማ ዋቆ (ዳይሬክተር)',
    accessCode: 'DIR-SHAS-01',
    assignedClassOrSubject: 'አጠቃላይ ትምህርት ቤት አስተዳደር',
    createdAt: '2024-09-01'
  },
  {
    id: 'sc-2',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    role: 'teacher',
    fullName: 'መ/ር በፈቃዱ ጥላሁን (ሂሳብ)',
    accessCode: 'TCH-BEFE-01',
    assignedClassOrSubject: 'Mathematics Grade 10A, 10B',
    createdAt: '2024-09-02'
  },
  {
    id: 'sc-3',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    role: 'teacher',
    fullName: 'መ/ርት ሰላማዊት ታደሰ (Afaan Oromoo)',
    accessCode: 'TCH-SELA-02',
    assignedClassOrSubject: 'Afaan Oromoo Grade 10 & 11',
    createdAt: '2024-09-02'
  },
  {
    id: 'sc-4',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    role: 'student',
    fullName: 'ኪያር ከድር አሊ',
    accessCode: 'STU-KIYAR-01',
    assignedClassOrSubject: 'Grade 10 Section A',
    createdAt: '2024-09-05'
  },
  {
    id: 'sc-5',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    role: 'parent',
    fullName: 'አቶ ከድር አሊ (የኪያር ወላጅ)',
    accessCode: 'PAR-KIYAR-01',
    assignedClassOrSubject: 'Parent of Kiyar Kedir (10A)',
    createdAt: '2024-09-05'
  },
  {
    id: 'sc-6',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    role: 'school_owner',
    fullName: 'ዶ/ር ተስፋዬ በቀለ (የት/ቤት ቦርድ ሰብሳቢ / ባለቤት)',
    accessCode: 'OWN-SHAS-01',
    assignedClassOrSubject: 'የት/ቤት የበላይ ጠባቂ ቦርድ እና አመራር',
    createdAt: '2024-08-20'
  },
  {
    id: 'sc-7',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    role: 'accountant',
    fullName: 'ወ/ሮ ሰላማዊት አበራ (ዋና ሒሳብ ሹም)',
    accessCode: 'ACC-SHAS-01',
    assignedClassOrSubject: 'የፋይናንስና ክፍያ አስተዳደር ጽ/ቤት',
    createdAt: '2024-09-01'
  },
  {
    id: 'sc-8',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    role: 'registrar',
    fullName: 'አቶ ዳንኤል ንጉሴ (የተማሪዎች ሬጅስትራር)',
    accessCode: 'REG-SHAS-01',
    assignedClassOrSubject: 'የተማሪዎች ቅበላ እና ሰነድ አስተዳደር',
    createdAt: '2024-09-01'
  },
  {
    id: 'sc-night-1',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    role: 'student',
    fullName: 'አቶ ሁሴን አብዱላሂ ኡመር (የማታ ተማሪ)',
    accessCode: 'STU-HUSSEIN-N1',
    assignedClassOrSubject: 'Grade 10 Section N1 (ማታ)',
    createdAt: '2024-09-10'
  },
  {
    id: 'sc-night-2',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    role: 'parent',
    fullName: 'ወ/ሮ ፋጡማ ሁሴን (የሁሴን ተጠሪ)',
    accessCode: 'PAR-HUSSEIN-N1',
    assignedClassOrSubject: 'Guardian of Hussein Abdullahi (10-N1)',
    createdAt: '2024-09-10'
  },
  {
    id: 'sc-night-3',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    role: 'student',
    fullName: 'ወ/ሪት ረድኤት ተፈራ ሞገስ (የማታ ተማሪ)',
    accessCode: 'STU-REDIET-N1',
    assignedClassOrSubject: 'Grade 11 Section N1 Social (ማታ)',
    createdAt: '2024-09-10'
  },
  {
    id: 'sc-night-4',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    role: 'student',
    fullName: 'አቶ ገመቹ በቀለ ዲዳ (የማታ ተማሪ)',
    accessCode: 'STU-GEMECHU-N1',
    assignedClassOrSubject: 'Grade 12 Section N1 Natural (ማታ)',
    createdAt: '2024-09-10'
  }
];

export const initialTeacherEvaluations: TeacherEvaluationRecord[] = [
  {
    id: 'te-1',
    teacherId: 'tc-1',
    teacherName: 'መ/ር በፈቃዱ ጥላሁን (Befekadu Tilahun)',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    subject: 'Mathematics (ሂሳብ)',
    gradeLevel: 11,
    section: 'A',
    academicYear: '2016/2017 ዓ.ም',
    semester: '1',
    scores: {
      teaching_competence: 10,
      pedagogical_delivery: 9,
      teaching_motivation: 10,
      student_support: 9,
      classroom_management: 10,
      timely_assessment: 9
    },
    totalScore: 57,
    percentage: 95.0,
    ratingTier: 'outstanding',
    strengthsFeedback: 'የካልኩለስ እና ትሪጎኖሜትሪ ስሌቶችን በጣም ግልጽና ቀላል በሆነ ምሳሌ ያስረዳል፤ ለተማሪዎች ጥያቄ ከፍተኛ ትዕግስት አለው።',
    improvementAreas: 'ተጨማሪ የቡድን ስራዎች ቢያበዛ ይበልጥ ይጠቅማል።',
    recommendations: 'ይህ መምህር የላቀ የማስተማር ፍቅር ስላለው ለትምህርት ቢሮ የምስጋናና የደረጃ እድገት እጩ እንዲሆን እንጠቁማለን።',
    evaluatorRole: 'student',
    isAnonymous: false,
    evaluatorName: 'ኪያር ከድር አሊ',
    evaluatorStudentId: 'st-01',
    submittedAt: '2024-10-20T10:15:00Z',
    bureauSyncStatus: 'synced',
    bureauDecisionNotes: 'ለትምህርት ቢሮ የመምህራን ማበረታቻና የላቀ ውጤት እጩነት ተይዟል።',
    usedForAppraisal: true
  },
  {
    id: 'te-2',
    teacherId: 'tc-1',
    teacherName: 'መ/ር በፈቃዱ ጥላሁን (Befekadu Tilahun)',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    subject: 'Mathematics (ሂሳብ)',
    gradeLevel: 11,
    section: 'B',
    academicYear: '2016/2017 ዓ.ም',
    semester: '1',
    scores: {
      teaching_competence: 9,
      pedagogical_delivery: 9,
      teaching_motivation: 9,
      student_support: 9,
      classroom_management: 9,
      timely_assessment: 8
    },
    totalScore: 53,
    percentage: 88.3,
    ratingTier: 'very_good',
    strengthsFeedback: 'ልጄ ቀደም ሲል ለሂሳብ የነበረውን ፍርሃት አስወግዶታል፤ የቤት ስራዎችን ያለማቋረጥ ይሰጣል።',
    improvementAreas: 'የቤት ስራ ማረሚያውን ፈተና ከመድረሱ በፊት ቀደም ብሎ ቢመልስ መልካም ነው።',
    recommendations: 'ትጉህ መምህር ነው።',
    evaluatorRole: 'parent',
    isAnonymous: true,
    evaluatorParentName: 'የተማሪ ወላጅ',
    submittedAt: '2024-10-22T14:30:00Z',
    bureauSyncStatus: 'synced',
    bureauDecisionNotes: 'የማስተማር ፈቃድ እድሳት ማረጋገጫ ፋይል ውስጥ ተካቷል።',
    usedForAppraisal: true
  },
  {
    id: 'te-3',
    teacherId: 'tc-2',
    teacherName: 'መ/ርት ሰላማዊት ታደሰ (Selamawit Tadese)',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    subject: 'Afaan Oromoo (ኦሮሚኛ)',
    gradeLevel: 10,
    section: 'C',
    academicYear: '2016/2017 ዓ.ም',
    semester: '1',
    scores: {
      teaching_competence: 10,
      pedagogical_delivery: 10,
      teaching_motivation: 10,
      student_support: 10,
      classroom_management: 9,
      timely_assessment: 10
    },
    totalScore: 59,
    percentage: 98.3,
    ratingTier: 'outstanding',
    strengthsFeedback: 'Barsiistuun kun ogummaa fi beekumsa Afaan Oromoo olaanaa qabdi. Barattoota hunda wal-qixa jajjabeessiti.',
    improvementAreas: 'Barsiisa gaariidha, rakkoo hin qabdu.',
    recommendations: 'Biiroon Barnootaa badhaasa barsiistuu fakkeenyaa akka kennuuf gaafanna.',
    evaluatorRole: 'student',
    isAnonymous: false,
    evaluatorName: 'ጫልቱ ጉተማ',
    evaluatorStudentId: 'st-04',
    submittedAt: '2024-10-24T09:45:00Z',
    bureauSyncStatus: 'synced',
    bureauDecisionNotes: 'ለአመቱ ምርጥ መምህር እጩ ሆና ተመዝግባለች።',
    usedForAppraisal: true
  },
  {
    id: 'te-4',
    teacherId: 'tc-3',
    teacherName: 'መ/ር ቶሎሳ ጉተማ (Tolosa Gutema)',
    schoolId: 'sch-4',
    schoolName: 'ቁዬራ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    subject: 'Physics (ፊዚክስ)',
    gradeLevel: 12,
    section: 'A',
    academicYear: '2016/2017 ዓ.ም',
    semester: '1',
    scores: {
      teaching_competence: 9,
      pedagogical_delivery: 8,
      teaching_motivation: 9,
      student_support: 8,
      classroom_management: 9,
      timely_assessment: 8
    },
    totalScore: 51,
    percentage: 85.0,
    ratingTier: 'very_good',
    strengthsFeedback: 'የፊዚክስ ቤተ-ሙከራ ሙከራዎችን በተግባር ያሳያል፤ የማስተማር ጥልቅ እውቀት አለው።',
    improvementAreas: 'አንዳንድ ጊዜ ፈጣን ተማሪዎችን ብቻ በማየት ቀስ ብለው የሚረዱትን ሊያስታውሳቸው ይገባል።',
    recommendations: 'ደረጃ እድገት ይገባዋል።',
    evaluatorRole: 'student',
    isAnonymous: false,
    evaluatorName: 'ገመቹ ታዬ',
    evaluatorStudentId: 'st-07',
    submittedAt: '2024-10-25T11:20:00Z',
    bureauSyncStatus: 'synced',
    bureauDecisionNotes: 'በቢሮው የደረጃ ማረጋገጫ ወቅት ግምት ውስጥ እንዲገባ ተደርጓል።',
    usedForAppraisal: false
  }
];

export const initialGradeWorkflows: AcademicGradeWorkflowBatch[] = [
  {
    id: 'gw-1',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    grade: 10,
    section: 'A',
    academicYear: '2016/2017 ዓ.ም',
    period: 'semester_1',
    periodLabel: '1ኛ ግማሽ ዓመት (Semester 1)',
    subject: 'የተጠናቀረ የሁሉም የትምህርት አይነቶች ውጤት (All Subjects Compiled)',
    isCompiledSectionRoster: true,
    teacherName: 'መ/ር በፈቃዱ ጥላሁን (ሒሳብ)',
    teacherSubmittedAt: '2024-10-18T10:00:00Z',
    teacherNotes: 'የ 10A የሂሳብ፣ እንግሊዝኛ እና የሳይንስ ውጤቶች ተካተዋል።',
    homeroomTeacherName: 'መ/ርት ሰላማዊት ታደሰ (የክፍል ተጠሪ)',
    homeroomSubmittedAt: '2024-10-21T14:30:00Z',
    homeroomRemarks: 'የ 10A ክፍል ተማሪዎች በሙሉ ውጤታቸው ተጠናቅሯል፤ የሁሉንም ተማሪዎች ስነ-ምግባርና መገኘት አረጋግጫለሁ።',
    homeroomConductDefault: 'A',
    directorName: 'አቶ ጉተማ ዋቆ (ዳይሬክተር)',
    directorApprovedAt: '2024-10-24T16:00:00Z',
    directorFeedback: 'ውጤቱ በዳይሬክተር ጽሕፈት ቤት በጥንቃቄ ተገምግሞ ጸድቋል፤ ለወላጆች፣ ለተማሪዎች እና ለከተማው ትምህርት ቢሮ ይፋ ሆኗል።',
    directorApprovalSealNumber: 'SHAS-SEC10A-DIR-APPR-2024-001',
    status: 'director_approved',
    dispatchedToBureau: true,
    dispatchedToBureauAt: '2024-10-24T16:00:00Z',
    totalStudents: 4,
    averageScore: 91.2,
    passCount: 4,
    failCount: 0,
    passRate: 100,
    topStudentName: 'ኪያር ከድር አሊ',
    topStudentScore: 98.4,
    createdAt: '2024-10-18T10:00:00Z',
    updatedAt: '2024-10-24T16:00:00Z',
    entries: [
      {
        studentId: 'st-01',
        studentName: 'ኪያር ከድር አሊ',
        studentIdNumber: 'SHAS-10A-001',
        gender: 'M',
        quiz1: 10,
        quiz2: 10,
        midExam: 29,
        finalExam: 49,
        total: 98,
        gradeLetter: 'A',
        conduct: 'A',
        attendanceRate: 98,
        rank: 1,
        remarks: 'እጅግ የላቀ የትምህርት ብቃትና ስነ-ምግባር አለው።'
      },
      {
        studentId: 'st-04',
        studentName: 'ጫልቱ ጉተማ ዋቆ',
        studentIdNumber: 'SHAS-10A-004',
        gender: 'F',
        quiz1: 10,
        quiz2: 9,
        midExam: 28,
        finalExam: 48,
        total: 95,
        gradeLetter: 'A',
        conduct: 'A',
        attendanceRate: 96,
        rank: 2,
        remarks: 'ንቁ ተሳታፊና አርዓያ ተማሪ ናት።'
      },
      {
        studentId: 'st-03',
        studentName: 'ሀናን ረሺድ ዑመር',
        studentIdNumber: 'SHAS-10A-003',
        gender: 'F',
        quiz1: 9,
        quiz2: 9,
        midExam: 26,
        finalExam: 45,
        total: 89,
        gradeLetter: 'A',
        conduct: 'A',
        attendanceRate: 94,
        rank: 3,
        remarks: 'በጣም ጥሩ ውጤት አስመዝግባለች።'
      },
      {
        studentId: 'st-05',
        studentName: 'ቶሎሳ ጉተማ በቀለ',
        studentIdNumber: 'SHAS-10A-005',
        gender: 'M',
        quiz1: 8,
        quiz2: 9,
        midExam: 25,
        finalExam: 41,
        total: 83,
        gradeLetter: 'B',
        conduct: 'B',
        attendanceRate: 92,
        rank: 4,
        remarks: 'ጥሩ ተሳትፎ አለው።'
      }
    ]
  },
  {
    id: 'gw-2',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    grade: 10,
    section: 'B',
    academicYear: '2016/2017 ዓ.ም',
    period: 'semester_1',
    periodLabel: '1ኛ ግማሽ ዓመት (Semester 1)',
    subject: 'የተጠናቀረ የ 10B የክፍል ውጤት',
    isCompiledSectionRoster: true,
    teacherName: 'መ/ር ቶሎሳ ጉተማ (ፊዚክስ)',
    teacherSubmittedAt: '2024-10-22T08:30:00Z',
    homeroomTeacherName: 'መ/ር ዳርቤ ገለታ (የክፍል ተጠሪ)',
    homeroomSubmittedAt: '2024-10-26T11:00:00Z',
    homeroomRemarks: 'የ 10B ተማሪዎች ውጤቶች በሙሉ ተሰብስበው ተጠናቅረዋል፤ ዳይሬክተሩ እንዲያጸድቅ በትህትና ቀርቧል።',
    homeroomConductDefault: 'A',
    status: 'submitted_to_director',
    dispatchedToBureau: false,
    totalStudents: 3,
    averageScore: 84.7,
    passCount: 3,
    failCount: 0,
    passRate: 100,
    topStudentName: 'ዮናስ ጥላሁን',
    topStudentScore: 91.0,
    createdAt: '2024-10-22T08:30:00Z',
    updatedAt: '2024-10-26T11:00:00Z',
    entries: [
      {
        studentId: 'st-02',
        studentName: 'ዮናስ ጥላሁን ተሾመ',
        studentIdNumber: 'SHAS-10B-002',
        gender: 'M',
        quiz1: 9,
        quiz2: 9,
        midExam: 27,
        finalExam: 46,
        total: 91,
        gradeLetter: 'A',
        conduct: 'A',
        attendanceRate: 95,
        rank: 1
      },
      {
        studentId: 'st-06',
        studentName: 'አሚና ኑሪ ሀሰን',
        studentIdNumber: 'SHAS-10B-006',
        gender: 'F',
        quiz1: 8,
        quiz2: 8,
        midExam: 25,
        finalExam: 43,
        total: 84,
        gradeLetter: 'B',
        conduct: 'A',
        attendanceRate: 92,
        rank: 2
      },
      {
        studentId: 'st-07',
        studentName: 'ገመቹ ታዬ አየለ',
        studentIdNumber: 'SHAS-10B-007',
        gender: 'M',
        quiz1: 8,
        quiz2: 8,
        midExam: 23,
        finalExam: 40,
        total: 79,
        gradeLetter: 'B',
        conduct: 'B',
        attendanceRate: 90,
        rank: 3
      }
    ]
  },
  {
    id: 'gw-3',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    grade: 10,
    section: 'A',
    academicYear: '2016/2017 ዓ.ም',
    period: 'quarter_2',
    periodLabel: '2ኛ ሩብ ዓመት (Quarter 2)',
    subject: 'Mathematics (ሒሳብ)',
    isCompiledSectionRoster: false,
    teacherName: 'መ/ር በፈቃዱ ጥላሁን',
    teacherSubmittedAt: '2024-11-03T10:00:00Z',
    teacherNotes: 'የ 2ኛ ሩብ ዓመት Quiz 1 (10%) እና Quiz 2 (10%) ለክፍል ተጠሪዋ መ/ርት ሰላማዊት ታደሰ ተልኳል።',
    homeroomTeacherName: 'መ/ርት ሰላማዊት ታደሰ (የክፍል ተጠሪ)',
    status: 'submitted_to_homeroom',
    dispatchedToBureau: false,
    totalStudents: 4,
    averageScore: 88.5,
    passCount: 4,
    failCount: 0,
    passRate: 100,
    topStudentName: 'ኪያር ከድር አሊ',
    topStudentScore: 97.0,
    createdAt: '2024-11-03T10:00:00Z',
    updatedAt: '2024-11-03T10:00:00Z',
    entries: [
      {
        studentId: 'st-01',
        studentName: 'ኪያር ከድር አሊ',
        studentIdNumber: 'SHAS-10A-001',
        gender: 'M',
        quiz1: 10,
        quiz2: 10,
        midExam: 29,
        finalExam: 48,
        total: 97,
        gradeLetter: 'A'
      },
      {
        studentId: 'st-04',
        studentName: 'ጫልቱ ጉተማ ዋቆ',
        studentIdNumber: 'SHAS-10A-004',
        gender: 'F',
        quiz1: 9,
        quiz2: 9,
        midExam: 27,
        finalExam: 47,
        total: 92,
        gradeLetter: 'A'
      },
      {
        studentId: 'st-03',
        studentName: 'ሀናን ረሺድ ዑመር',
        studentIdNumber: 'SHAS-10A-003',
        gender: 'F',
        quiz1: 9,
        quiz2: 8,
        midExam: 25,
        finalExam: 43,
        total: 85,
        gradeLetter: 'A'
      },
      {
        studentId: 'st-05',
        studentName: 'ቶሎሳ ጉተማ በቀለ',
        studentIdNumber: 'SHAS-10A-005',
        gender: 'M',
        quiz1: 8,
        quiz2: 8,
        midExam: 24,
        finalExam: 40,
        total: 80,
        gradeLetter: 'B'
      }
    ]
  }
];

export const initialStudentReportNotifications: StudentReportNotification[] = [
  {
    id: 'notif-init-1',
    batchId: 'gw-1',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    grade: 10,
    section: 'A',
    academicYear: '2016/2017 ዓ.ም',
    period: 'semester_1',
    periodLabel: '1ኛ ሴሚስተር (Semester 1)',
    directorName: 'አቶ ጉተማ ዋቆ (ዳይሬክተር)',
    sealNumber: 'SHAS-DIR-APPR-2024-8842',
    approvedAt: '2024-11-04T14:30:00Z',
    message: 'የ 1ኛ ሴሚስተር የክፍል 10A ይፋዊ የተማሪዎች ውጤት ሪፖርት በዋና ዳይሬክተር አቶ ጉተማ ዋቆ ጸድቆ ዲጂታል ማህተም ተሰጥቶታል! አሁን በፖርታልዎ ገብተው ካርዱን መመልከትና ማተም ይችላሉ።',
    isRead: false
  }
];

function loadItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
  }
  return defaultValue;
}

function saveItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  } catch (e) {
    console.warn(`Error saving ${key} to localStorage:`, e);
  }
}

export const StorageService = {
  // Schools
  getSchools: (): School[] => {
    const list = loadItem<School[]>(STORAGE_KEYS.SCHOOLS, initialSchools);
    return list.map((s) => {
      let devStatus = s.developerPaymentStatus;
      if (!devStatus) {
        if (s.id === 'sch-1') devStatus = 'approved';
        else if (s.id === 'sch-2') devStatus = 'receipt_submitted';
        else devStatus = 'pending_payment';
      }
      return {
        ...s,
        developerPaymentStatus: devStatus,
        developerPaymentApprovedAt: s.developerPaymentApprovedAt || (devStatus === 'approved' ? '2024-09-02T11:30:00' : undefined)
      };
    });
  },
  saveSchools: (schools: School[]) => saveItem(STORAGE_KEYS.SCHOOLS, schools),
  addSchool: (school: School) => {
    const list = StorageService.getSchools();
    const schoolWithPayment: School = {
      ...school,
      developerPaymentStatus: school.developerPaymentStatus || 'pending_payment'
    };
    const updated = [schoolWithPayment, ...list];
    StorageService.saveSchools(updated);
    return updated;
  },
  updateSchool: (school: School) => {
    const list = StorageService.getSchools();
    const updated = list.map((s) => (s.id === school.id ? school : s));
    StorageService.saveSchools(updated);
    return updated;
  },

  // Bureau Staff
  getStaff: (): BureauStaff[] => loadItem(STORAGE_KEYS.STAFF, initialStaff),
  saveStaff: (staff: BureauStaff[]) => saveItem(STORAGE_KEYS.STAFF, staff),
  addStaff: (staff: BureauStaff) => {
    const list = StorageService.getStaff();
    const updated = [staff, ...list];
    StorageService.saveStaff(updated);
    return updated;
  },

  // Teacher Credentials
  getCredentials: (): TeacherCredential[] => loadItem(STORAGE_KEYS.CREDENTIALS, initialTeacherCredentials),
  saveCredentials: (creds: TeacherCredential[]) => saveItem(STORAGE_KEYS.CREDENTIALS, creds),
  updateCredentialStatus: (id: string, status: 'verified' | 'pending' | 'flagged', verifiedBy?: string, notes?: string) => {
    const list = StorageService.getCredentials();
    const updated = list.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          verificationStatus: status,
          verifiedBy: verifiedBy || c.verifiedBy,
          verificationDate: new Date().toISOString().split('T')[0],
          notes: notes !== undefined ? notes : c.notes
        };
      }
      return c;
    });
    StorageService.saveCredentials(updated);
    return updated;
  },
  addCredential: (credential: TeacherCredential) => {
    const list = StorageService.getCredentials();
    const updated = [credential, ...list];
    StorageService.saveCredentials(updated);
    return updated;
  },

  // Exams
  getExams: (): TeacherExam[] => loadItem(STORAGE_KEYS.EXAMS, initialExams),
  saveExams: (exams: TeacherExam[]) => saveItem(STORAGE_KEYS.EXAMS, exams),
  addExam: (exam: TeacherExam) => {
    const list = StorageService.getExams();
    const updated = [exam, ...list];
    StorageService.saveExams(updated);
    return updated;
  },

  // Exam Submissions
  getSubmissions: (): ExamSubmission[] => {
    const stored = loadItem<ExamSubmission[]>(STORAGE_KEYS.SUBMISSIONS, initialSubmissions);
    return stored.map((s) => ({
      ...s,
      reviewStatus: s.reviewStatus || 'pending_bureau_review'
    }));
  },
  saveSubmissions: (subs: ExamSubmission[]) => saveItem(STORAGE_KEYS.SUBMISSIONS, subs),
  addSubmission: (submission: ExamSubmission) => {
    const list = StorageService.getSubmissions();
    const updated = [submission, ...list];
    StorageService.saveSubmissions(updated);
    return updated;
  },
  updateSubmissionReview: (
    submissionId: string,
    reviewStatus: 'pending_bureau_review' | 'released_to_teacher',
    reviewedBy?: string,
    bureauNotes?: string
  ): ExamSubmission[] => {
    const list = StorageService.getSubmissions();
    const updated = list.map((sub) =>
      sub.id === submissionId
        ? {
            ...sub,
            reviewStatus,
            reviewedBy: reviewedBy || sub.reviewedBy || 'የትምህርት ቢሮ ምዘና ባለሙያ',
            reviewedAt: new Date().toISOString(),
            bureauNotes: bureauNotes !== undefined ? bureauNotes : sub.bureauNotes
          }
        : sub
    );
    StorageService.saveSubmissions(updated);
    return updated;
  },
  batchReleaseSubmissions: (reviewedBy?: string): ExamSubmission[] => {
    const list = StorageService.getSubmissions();
    const updated = list.map((sub) =>
      sub.reviewStatus === 'pending_bureau_review'
        ? {
            ...sub,
            reviewStatus: 'released_to_teacher' as const,
            reviewedBy: reviewedBy || 'የትምህርት ቢሮ ምዘና ዳይሬክቶሬት',
            reviewedAt: new Date().toISOString()
          }
        : sub
    );
    StorageService.saveSubmissions(updated);
    return updated;
  },

  // Training Materials
  getTrainingMaterials: (): TrainingMaterial[] => {
    const stored = loadItem<TrainingMaterial[]>(STORAGE_KEYS.TRAINING, initialTrainingMaterials);
    const storedIds = new Set(stored.map((m) => m.id));
    const missing = initialTrainingMaterials.filter((m) => !storedIds.has(m.id));
    let result = missing.length > 0 ? [...stored, ...missing] : stored;

    let needsResave = missing.length > 0;
    result = result.map((m) => {
      if (!m.attachments || m.attachments.length === 0) {
        const init = initialTrainingMaterials.find((im) => im.id === m.id);
        if (init && init.attachments && init.attachments.length > 0) {
          needsResave = true;
          return { ...m, attachments: init.attachments };
        }
      }
      return m;
    });

    if (needsResave) {
      saveItem(STORAGE_KEYS.TRAINING, result);
    }
    return result;
  },
  saveTrainingMaterials: (materials: TrainingMaterial[]) => saveItem(STORAGE_KEYS.TRAINING, materials),
  addTrainingMaterial: (material: TrainingMaterial) => {
    const list = StorageService.getTrainingMaterials();
    const updated = [material, ...list];
    StorageService.saveTrainingMaterials(updated);
    return updated;
  },
  incrementDownload: (id: string) => {
    const list = StorageService.getTrainingMaterials();
    const updated = list.map((m) => (m.id === id ? { ...m, downloadCount: m.downloadCount + 1 } : m));
    StorageService.saveTrainingMaterials(updated);
    return updated;
  },
  addTrainingAttachment: (materialId: string, attachment: TrainingAttachment): TrainingMaterial[] => {
    const list = StorageService.getTrainingMaterials();
    const updated = list.map((m) => {
      if (m.id === materialId) {
        const existing = m.attachments || [];
        return {
          ...m,
          attachments: [attachment, ...existing.filter((a) => a.id !== attachment.id)]
        };
      }
      return m;
    });
    StorageService.saveTrainingMaterials(updated);
    return updated;
  },
  deleteTrainingAttachment: (materialId: string, attachmentId: string): TrainingMaterial[] => {
    const list = StorageService.getTrainingMaterials();
    const updated = list.map((m) => {
      if (m.id === materialId) {
        return {
          ...m,
          attachments: (m.attachments || []).filter((a) => a.id !== attachmentId)
        };
      }
      return m;
    });
    StorageService.saveTrainingMaterials(updated);
    return updated;
  },
  getCompletedTrainings: (teacherId: string): string[] => {
    const map = loadItem<Record<string, string[]>>(STORAGE_KEYS.TEACHER_TRAINING_PROGRESS, {});
    return map[teacherId] || [];
  },
  toggleTrainingCompleted: (teacherId: string, materialId: string): { completed: boolean; allCompleted: string[] } => {
    const map = loadItem<Record<string, string[]>>(STORAGE_KEYS.TEACHER_TRAINING_PROGRESS, {});
    const current = map[teacherId] || [];
    let updated: string[];
    let completed = false;
    if (current.includes(materialId)) {
      updated = current.filter((id) => id !== materialId);
      completed = false;
    } else {
      updated = [...current, materialId];
      completed = true;
    }
    map[teacherId] = updated;
    saveItem(STORAGE_KEYS.TEACHER_TRAINING_PROGRESS, map);
    return { completed, allCompleted: updated };
  },

  // Teacher Training Dispatch Notifications
  getTeacherTrainingNotifications: (teacherId?: string): TeacherTrainingNotification[] => {
    const list = loadItem<TeacherTrainingNotification[]>(STORAGE_KEYS.TEACHER_TRAINING_NOTIFICATIONS, []);
    if (!teacherId) return list;
    return list.filter((n) => !n.teacherId || n.teacherId === teacherId);
  },
  addTeacherTrainingNotification: (notif: TeacherTrainingNotification): TeacherTrainingNotification[] => {
    const list = loadItem<TeacherTrainingNotification[]>(STORAGE_KEYS.TEACHER_TRAINING_NOTIFICATIONS, []);
    const updated = [notif, ...list.filter((n) => n.id !== notif.id)];
    saveItem(STORAGE_KEYS.TEACHER_TRAINING_NOTIFICATIONS, updated);
    window.dispatchEvent(new CustomEvent('teacher_training_dispatched', { detail: notif }));
    return updated;
  },
  markTeacherTrainingNotificationAsRead: (notifId: string): TeacherTrainingNotification[] => {
    const list = loadItem<TeacherTrainingNotification[]>(STORAGE_KEYS.TEACHER_TRAINING_NOTIFICATIONS, []);
    const updated = list.map((n) => (n.id === notifId ? { ...n, isRead: true } : n));
    saveItem(STORAGE_KEYS.TEACHER_TRAINING_NOTIFICATIONS, updated);
    return updated;
  },
  markAllTeacherTrainingNotificationsAsRead: (teacherId?: string): TeacherTrainingNotification[] => {
    const list = loadItem<TeacherTrainingNotification[]>(STORAGE_KEYS.TEACHER_TRAINING_NOTIFICATIONS, []);
    const updated = list.map((n) => (!teacherId || !n.teacherId || n.teacherId === teacherId ? { ...n, isRead: true } : n));
    saveItem(STORAGE_KEYS.TEACHER_TRAINING_NOTIFICATIONS, updated);
    return updated;
  },

  // Student Reports
  getReports: (): SchoolReportSubmission[] => loadItem(STORAGE_KEYS.REPORTS, initialStudentReports),
  saveReports: (reports: SchoolReportSubmission[]) => saveItem(STORAGE_KEYS.REPORTS, reports),
  addReport: (report: SchoolReportSubmission) => {
    const list = StorageService.getReports();
    const updated = [report, ...list];
    StorageService.saveReports(updated);
    return updated;
  },
  updateReportStatus: (id: string, status: 'approved' | 'requires_revision', reviewedBy: string, feedback?: string) => {
    const list = StorageService.getReports();
    const updated = list.map((r) =>
      r.id === id ? { ...r, status, reviewedBy, feedback: feedback || r.feedback } : r
    );
    StorageService.saveReports(updated);
    return updated;
  },

  // Bureau Standards
  getStandards: (): BureauStandardCriteria[] => loadItem(STORAGE_KEYS.STANDARDS, initialBureauStandards),
  saveStandards: (standards: BureauStandardCriteria[]) => saveItem(STORAGE_KEYS.STANDARDS, standards),

  // Students & Marks
  getStudents: (schoolId?: string): StudentRecord[] => {
    let list = loadItem<StudentRecord[]>(STORAGE_KEYS.STUDENTS, initialStudents);
    // Ensure newly introduced initial students (such as Night Students) are merged
    const existingIds = new Set(list.map((s) => s.id));
    const missing = initialStudents.filter((s) => !existingIds.has(s.id));
    if (missing.length > 0) {
      list = [...list, ...missing];
      saveItem(STORAGE_KEYS.STUDENTS, list);
    }
    if (schoolId) list = list.filter((s) => s.schoolId === schoolId);
    return list;
  },
  saveStudents: (students: StudentRecord[]) => saveItem(STORAGE_KEYS.STUDENTS, students),
  addStudent: (student: StudentRecord) => {
    const list = StorageService.getStudents();
    const updated = [student, ...list];
    StorageService.saveStudents(updated);
    return updated;
  },
  updateStudent: (student: StudentRecord) => {
    const list = StorageService.getStudents();
    const updated = list.map((s) => (s.id === student.id ? student : s));
    StorageService.saveStudents(updated);
    return updated;
  },
  getNightStudents: (schoolId?: string): StudentRecord[] => {
    const all = StorageService.getStudents(schoolId);
    return all.filter((s) => s.shift === 'night_shift' || s.section?.toUpperCase().startsWith('N'));
  },
  getDayStudents: (schoolId?: string): StudentRecord[] => {
    const all = StorageService.getStudents(schoolId);
    return all.filter((s) => s.shift !== 'night_shift' && !s.section?.toUpperCase().startsWith('N'));
  },

  // Night Class Schedule & Timetable
  getNightClassSchedule: (): NightClassScheduleItem[] => {
    return loadItem<NightClassScheduleItem[]>(STORAGE_KEYS.NIGHT_SCHEDULE, initialNightClassSchedule);
  },
  saveNightClassSchedule: (items: NightClassScheduleItem[]) => {
    saveItem(STORAGE_KEYS.NIGHT_SCHEDULE, items);
  },
  addNightClassScheduleItem: (item: NightClassScheduleItem): NightClassScheduleItem[] => {
    const list = StorageService.getNightClassSchedule();
    const updated = [...list, item];
    StorageService.saveNightClassSchedule(updated);
    return updated;
  },

  // Night Attendance Tracking
  getNightAttendance: (date?: string): NightAttendanceEntry[] => {
    const all = loadItem<NightAttendanceEntry[]>(STORAGE_KEYS.NIGHT_ATTENDANCE, []);
    if (date) {
      return all.filter((a) => a.date === date);
    }
    return all;
  },
  recordNightAttendance: (entries: NightAttendanceEntry[]): NightAttendanceEntry[] => {
    const current = StorageService.getNightAttendance();
    const entryIds = new Set(entries.map((e) => e.id));
    const filtered = current.filter((c) => !entryIds.has(c.id));
    const updated = [...entries, ...filtered];
    saveItem(STORAGE_KEYS.NIGHT_ATTENDANCE, updated);
    return updated;
  },

  // School Stakeholders
  getStakeholders: (schoolId?: string, schoolName?: string): SchoolStakeholder[] => {
    let all = loadItem<SchoolStakeholder[]>(STORAGE_KEYS.STAKEHOLDERS, initialStakeholders);
    if (schoolId) {
      const schoolStakeholders = all.filter((s) => s.schoolId === schoolId);
      if (schoolStakeholders.length > 0) {
        return schoolStakeholders;
      }
      // Seed required essential stakeholders for this school so every school has complete profile certificates
      const targetName = schoolName || 'የትምህርት ተቋም';
      const cloned: SchoolStakeholder[] = initialStakeholders.map((s, idx) => ({
        ...s,
        id: `stk-${schoolId}-${idx + 1}`,
        schoolId: schoolId,
        schoolName: targetName,
        certificateNumber: `SHAS-STK-${schoolId.toUpperCase()}-${idx + 1}`
      }));
      all = [...cloned, ...all];
      StorageService.saveStakeholders(all);
      return cloned;
    }
    return all;
  },
  saveStakeholders: (list: SchoolStakeholder[]) => saveItem(STORAGE_KEYS.STAKEHOLDERS, list),
  addStakeholder: (stakeholder: SchoolStakeholder) => {
    const list = StorageService.getStakeholders();
    const updated = [stakeholder, ...list];
    StorageService.saveStakeholders(updated);
    return updated;
  },
  updateStakeholder: (stakeholder: SchoolStakeholder) => {
    const list = StorageService.getStakeholders();
    const updated = list.map((s) => (s.id === stakeholder.id ? stakeholder : s));
    StorageService.saveStakeholders(updated);
    return updated;
  },
  deleteStakeholder: (id: string) => {
    const list = StorageService.getStakeholders();
    const updated = list.filter((s) => s.id !== id);
    StorageService.saveStakeholders(updated);
    return updated;
  },

  // School User Codes
  getSchoolCodes: (): SchoolUserCode[] => loadItem(STORAGE_KEYS.SCHOOL_CODES, initialSchoolCodes),
  saveSchoolCodes: (codes: SchoolUserCode[]) => saveItem(STORAGE_KEYS.SCHOOL_CODES, codes),
  addSchoolCode: (code: SchoolUserCode) => {
    const list = StorageService.getSchoolCodes();
    const updated = [code, ...list];
    StorageService.saveSchoolCodes(updated);
    return updated;
  },

  // 1. Announcements (ማስታወቂያዎች)
  getAnnouncements: (schoolId?: string): SchoolAnnouncement[] => {
    const all = loadItem<SchoolAnnouncement[]>(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements);
    if (schoolId) {
      return all.filter((a) => a.schoolId === schoolId || a.authorRole === 'bureau');
    }
    return all;
  },
  saveAnnouncements: (list: SchoolAnnouncement[]) => saveItem(STORAGE_KEYS.ANNOUNCEMENTS, list),
  addAnnouncement: (announcement: SchoolAnnouncement) => {
    const list = StorageService.getAnnouncements();
    const updated = [announcement, ...list];
    StorageService.saveAnnouncements(updated);
    return updated;
  },
  deleteAnnouncement: (id: string) => {
    const list = StorageService.getAnnouncements();
    const updated = list.filter((a) => a.id !== id);
    StorageService.saveAnnouncements(updated);
    return updated;
  },

  // 2. Homework (የቤት ስራ)
  getHomework: (schoolId?: string, grade?: number): HomeworkAssignment[] => {
    let all = loadItem<HomeworkAssignment[]>(STORAGE_KEYS.HOMEWORK, initialHomework);
    if (schoolId) all = all.filter((h) => h.schoolId === schoolId);
    if (grade) all = all.filter((h) => h.grade === grade);
    return all;
  },
  saveHomework: (list: HomeworkAssignment[]) => saveItem(STORAGE_KEYS.HOMEWORK, list),
  addHomework: (item: HomeworkAssignment) => {
    const list = StorageService.getHomework();
    const updated = [item, ...list];
    StorageService.saveHomework(updated);
    return updated;
  },
  deleteHomework: (id: string) => {
    const list = StorageService.getHomework();
    const updated = list.filter((h) => h.id !== id);
    StorageService.saveHomework(updated);
    return updated;
  },

  // Homework Submissions
  getHomeworkSubmissions: (assignmentId?: string, studentId?: string): HomeworkSubmission[] => {
    let all = loadItem<HomeworkSubmission[]>(STORAGE_KEYS.HOMEWORK_SUBMISSIONS, initialHomeworkSubmissions);
    if (assignmentId) all = all.filter((s) => s.assignmentId === assignmentId);
    if (studentId) all = all.filter((s) => s.studentId === studentId);
    return all;
  },
  saveHomeworkSubmissions: (list: HomeworkSubmission[]) => saveItem(STORAGE_KEYS.HOMEWORK_SUBMISSIONS, list),
  addHomeworkSubmission: (sub: HomeworkSubmission) => {
    const list = StorageService.getHomeworkSubmissions();
    const updated = [sub, ...list.filter((s) => !(s.assignmentId === sub.assignmentId && s.studentId === sub.studentId))];
    StorageService.saveHomeworkSubmissions(updated);
    return updated;
  },
  gradeHomeworkSubmission: (id: string, score: number, teacherFeedback?: string) => {
    const list = StorageService.getHomeworkSubmissions();
    const updated = list.map((s) => (s.id === id ? { ...s, score, teacherFeedback, status: 'graded' as const } : s));
    StorageService.saveHomeworkSubmissions(updated);
    return updated;
  },

  // 3. Attendance (የተማሪዎች ዕለታዊ መገኘት)
  getAttendance: (schoolId?: string, studentId?: string, date?: string): StudentAttendanceRecord[] => {
    let all = loadItem<StudentAttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, initialAttendance);
    if (schoolId) all = all.filter((a) => a.schoolId === schoolId);
    if (studentId) all = all.filter((a) => a.studentId === studentId);
    if (date) all = all.filter((a) => a.date === date);
    return all;
  },
  saveAttendance: (list: StudentAttendanceRecord[]) => saveItem(STORAGE_KEYS.ATTENDANCE, list),
  markAttendance: (record: StudentAttendanceRecord) => {
    const list = StorageService.getAttendance();
    const exists = list.findIndex(
      (a) => a.studentId === record.studentId && a.date === record.date
    );
    let updated: StudentAttendanceRecord[];
    if (exists >= 0) {
      updated = [...list];
      updated[exists] = record;
    } else {
      updated = [record, ...list];
    }
    StorageService.saveAttendance(updated);
    return updated;
  },

  // 4. Monthly Fee Payments (የወር ክፍያ)
  getFeePayments: (schoolId?: string, studentId?: string): FeePaymentRecord[] => {
    let all = loadItem<FeePaymentRecord[]>(STORAGE_KEYS.FEE_PAYMENTS, initialFeePayments);
    if (schoolId) all = all.filter((f) => f.schoolId === schoolId);
    if (studentId) all = all.filter((f) => f.studentId === studentId);
    return all;
  },
  saveFeePayments: (list: FeePaymentRecord[]) => {
    saveItem(STORAGE_KEYS.FEE_PAYMENTS, list);
    try {
      window.dispatchEvent(new CustomEvent('fee_payments_updated', { detail: list }));
    } catch {
      // ignore
    }
  },
  addFeePayment: (payment: FeePaymentRecord) => {
    const list = StorageService.getFeePayments();
    const updated = [payment, ...list];
    StorageService.saveFeePayments(updated);
    return updated;
  },
  updateFeePayment: (payment: FeePaymentRecord) => {
    const list = StorageService.getFeePayments();
    const index = list.findIndex((f) => f.id === payment.id);
    let updated: FeePaymentRecord[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = payment;
    } else {
      updated = [payment, ...list];
    }
    StorageService.saveFeePayments(updated);
    return updated;
  },
  submitFeePaymentReceipt: (payment: FeePaymentRecord) => {
    const list = StorageService.getFeePayments();
    // Check if an existing record for the same student & month exists
    const existingIndex = list.findIndex(
      (f) =>
        f.studentId === payment.studentId &&
        f.month.trim().toLowerCase() === payment.month.trim().toLowerCase()
    );
    let updated: FeePaymentRecord[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...payment,
        status: 'pending' as const,
        submittedAt: payment.submittedAt || new Date().toISOString()
      };
    } else {
      updated = [payment, ...list];
    }
    StorageService.saveFeePayments(updated);
    return updated;
  },
  verifyFeePayment: (id: string, accountantName: string, notes?: string) => {
    const list = StorageService.getFeePayments();
    const nowIso = new Date().toISOString();
    const updated = list.map((f) => {
      if (f.id === id) {
        const receiptNumber = f.receiptNumber && f.receiptNumber !== 'PENDING'
          ? f.receiptNumber
          : `SHAS-REC-${Date.now().toString().slice(-6)}`;
        return {
          ...f,
          status: 'paid' as const,
          receiptNumber,
          paymentDate: f.paymentDate || nowIso.split('T')[0],
          collectedBy: accountantName,
          verifiedBy: accountantName,
          verifiedAt: nowIso,
          notes: notes !== undefined ? notes : f.notes,
          rejectionReason: undefined
        };
      }
      return f;
    });
    StorageService.saveFeePayments(updated);
    return updated;
  },
  rejectFeePayment: (id: string, reason: string, accountantName: string) => {
    const list = StorageService.getFeePayments();
    const nowIso = new Date().toISOString();
    const updated = list.map((f) => {
      if (f.id === id) {
        return {
          ...f,
          status: 'rejected' as const,
          rejectionReason: reason,
          verifiedBy: accountantName,
          verifiedAt: nowIso
        };
      }
      return f;
    });
    StorageService.saveFeePayments(updated);
    return updated;
  },

  // School Official Bank Accounts posted by Cashier (የትምህርት ቤቱ ገንዘብ ያዥ የሚለጥፋቸው ይፋዊ የባንክ አካውንቶች)
  getSchoolBankAccounts: (schoolId?: string): SchoolBankAccount[] => {
    let all = loadItem<SchoolBankAccount[]>(STORAGE_KEYS.SCHOOL_BANK_ACCOUNTS, initialSchoolBankAccounts);
    if (schoolId) all = all.filter((a) => a.schoolId === schoolId);
    return all;
  },
  saveSchoolBankAccounts: (list: SchoolBankAccount[]) => {
    saveItem(STORAGE_KEYS.SCHOOL_BANK_ACCOUNTS, list);
    try {
      window.dispatchEvent(new CustomEvent('school_bank_accounts_updated', { detail: list }));
    } catch {
      // ignore
    }
  },
  addSchoolBankAccount: (acc: SchoolBankAccount) => {
    const list = StorageService.getSchoolBankAccounts();
    const updated = [acc, ...list];
    StorageService.saveSchoolBankAccounts(updated);
    return updated;
  },
  updateSchoolBankAccount: (acc: SchoolBankAccount) => {
    const list = StorageService.getSchoolBankAccounts();
    const index = list.findIndex((a) => a.id === acc.id);
    let updated: SchoolBankAccount[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = acc;
    } else {
      updated = [acc, ...list];
    }
    StorageService.saveSchoolBankAccounts(updated);
    return updated;
  },
  deleteSchoolBankAccount: (id: string) => {
    const list = StorageService.getSchoolBankAccounts();
    const updated = list.filter((a) => a.id !== id);
    StorageService.saveSchoolBankAccounts(updated);
    return updated;
  },

  // 5. School Operational Expenses (አስተዳደራዊ ወጪዎች)
  getExpenses: (schoolId?: string): SchoolExpenseRecord[] => {
    const all = loadItem<SchoolExpenseRecord[]>(STORAGE_KEYS.EXPENSES, initialExpenses);
    if (schoolId) return all.filter((e) => e.schoolId === schoolId);
    return all;
  },
  saveExpenses: (list: SchoolExpenseRecord[]) => saveItem(STORAGE_KEYS.EXPENSES, list),
  addExpense: (expense: SchoolExpenseRecord) => {
    const list = StorageService.getExpenses();
    const updated = [expense, ...list];
    StorageService.saveExpenses(updated);
    return updated;
  },

  // 6. Director Appointments (የዳይሬክተር ቅጥር)
  getDirectorAppointments: (schoolId?: string): DirectorAppointment[] => {
    const all = loadItem<DirectorAppointment[]>(STORAGE_KEYS.DIRECTOR_APPOINTMENTS, initialDirectorAppointments);
    if (schoolId) return all.filter((d) => d.schoolId === schoolId);
    return all;
  },
  saveDirectorAppointment: (appt: DirectorAppointment) => {
    const list = StorageService.getDirectorAppointments();
    const exists = list.findIndex((a) => a.schoolId === appt.schoolId);
    let updated: DirectorAppointment[];
    if (exists >= 0) {
      updated = [...list];
      updated[exists] = appt;
    } else {
      updated = [appt, ...list];
    }
    saveItem(STORAGE_KEYS.DIRECTOR_APPOINTMENTS, updated);
    return updated;
  },

  // 7. Library Books & Lending Service (የቤተ-መጻሕፍት ክፍል)
  getLibraryBooks: (schoolId?: string): LibraryBookRecord[] => {
    const defaultBooks: LibraryBookRecord[] = [
      {
        id: 'bk-1',
        schoolId: 'sch-1',
        title: 'የ10ኛ ክፍል የሂሳብ መማሪያ መጽሐፍ (Grade 10 Mathematics)',
        author: 'የትምህርት ሚኒስቴር (MoE Ethiopia)',
        category: 'Mathematics (ሂሳብ)',
        shelfCode: 'SH-MATH-01',
        totalCopies: 120,
        availableCopies: 115,
        status: 'available'
      },
      {
        id: 'bk-2',
        schoolId: 'sch-1',
        title: 'የ11ኛ ክፍል ፊዚክስ አጋዥ መጽሐፍ (Fundamentals of Physics)',
        author: 'David Halliday & MoE',
        category: 'Physics (ፊዚክስ)',
        shelfCode: 'SH-PHY-04',
        totalCopies: 45,
        availableCopies: 42,
        borrowerName: 'ኪያር ከድር',
        borrowerGrade: 'Grade 10A',
        borrowDate: '2024-10-14',
        returnDueDate: '2024-10-28',
        status: 'borrowed'
      },
      {
        id: 'bk-3',
        schoolId: 'sch-1',
        title: 'Afaan Oromoo Kitaaba Barataa Kutaa 10ffaa',
        author: 'Biiroo Barnootaa Oromiyaa',
        category: 'Language & Literature',
        shelfCode: 'SH-AF-02',
        totalCopies: 80,
        availableCopies: 78,
        status: 'available'
      },
      {
        id: 'bk-4',
        schoolId: 'sch-1',
        title: 'የኬሚስትሪ ላብራቶሪ መመሪያ እና ደህንነት (Chemistry Lab Safety)',
        author: 'Dr. Mengistu Worku',
        category: 'Chemistry (ኬሚስትሪ)',
        shelfCode: 'SH-CHM-03',
        totalCopies: 30,
        availableCopies: 28,
        status: 'available'
      },
      {
        id: 'bk-5',
        schoolId: 'sch-1',
        title: 'የኢትዮጵያ ታሪክ እና ቅርስ (Ethiopian History & Heritage)',
        author: 'ፕ/ር ባህሩ ዘውዴ (Bahru Zewde)',
        category: 'History & Social Science',
        shelfCode: 'SH-HIST-08',
        totalCopies: 25,
        availableCopies: 24,
        status: 'available'
      }
    ];

    const all = loadItem<LibraryBookRecord[]>(STORAGE_KEYS.LIBRARY_BOOKS, defaultBooks);
    if (schoolId) return all.filter((b) => b.schoolId === schoolId);
    return all;
  },
  saveLibraryBooks: (books: LibraryBookRecord[]) => saveItem(STORAGE_KEYS.LIBRARY_BOOKS, books),
  addLibraryBook: (book: LibraryBookRecord) => {
    const list = StorageService.getLibraryBooks();
    const updated = [book, ...list];
    StorageService.saveLibraryBooks(updated);
    return updated;
  },
  borrowBook: (id: string, borrowerName: string, borrowerGrade: string, returnDueDate: string) => {
    const list = StorageService.getLibraryBooks();
    const updated = list.map((b) =>
      b.id === id
        ? {
            ...b,
            availableCopies: Math.max(0, b.availableCopies - 1),
            borrowerName,
            borrowerGrade,
            borrowDate: new Date().toISOString().split('T')[0],
            returnDueDate,
            status: 'borrowed' as const
          }
        : b
    );
    StorageService.saveLibraryBooks(updated);
    return updated;
  },
  returnBook: (id: string) => {
    const list = StorageService.getLibraryBooks();
    const updated = list.map((b) =>
      b.id === id
        ? {
            ...b,
            availableCopies: Math.min(b.totalCopies, b.availableCopies + 1),
            borrowerName: undefined,
            borrowerGrade: undefined,
            borrowDate: undefined,
            returnDueDate: undefined,
            status: 'available' as const
          }
        : b
    );
    StorageService.saveLibraryBooks(updated);
    return updated;
  },

  // Teacher Evaluations by Students and Parents (የመምህራን ግምገማና መመዘኛ ግብዓት)
  getTeacherEvaluations: (schoolId?: string, teacherId?: string): TeacherEvaluationRecord[] => {
    const list = loadItem<TeacherEvaluationRecord[]>(
      STORAGE_KEYS.TEACHER_EVALUATIONS,
      initialTeacherEvaluations
    );
    return list.filter((item) => {
      if (schoolId && item.schoolId !== schoolId) return false;
      if (teacherId && item.teacherId !== teacherId) return false;
      return true;
    });
  },

  saveTeacherEvaluations: (evaluations: TeacherEvaluationRecord[]) => {
    saveItem(STORAGE_KEYS.TEACHER_EVALUATIONS, evaluations);
  },

  addTeacherEvaluation: (evaluation: TeacherEvaluationRecord) => {
    const list = StorageService.getTeacherEvaluations();
    const updated = [evaluation, ...list];
    StorageService.saveTeacherEvaluations(updated);
    return updated;
  },

  updateTeacherEvaluationAppraisal: (
    id: string,
    notes: string,
    usedForAppraisal?: boolean
  ): TeacherEvaluationRecord[] => {
    const list = StorageService.getTeacherEvaluations();
    const updated = list.map((ev) =>
      ev.id === id
        ? {
            ...ev,
            bureauDecisionNotes: notes,
            usedForAppraisal: usedForAppraisal !== undefined ? usedForAppraisal : ev.usedForAppraisal
          }
        : ev
    );
    StorageService.saveTeacherEvaluations(updated);
    return updated;
  },

  getTeacherEvaluationSummary: (teacherId: string): TeacherEvaluationSummary | null => {
    const all = StorageService.getTeacherEvaluations(undefined, teacherId);
    if (all.length === 0) return null;

    const teacherName = all[0].teacherName;
    const schoolName = all[0].schoolName;
    const subject = all[0].subject;

    let totalComp = 0;
    let totalPedagogy = 0;
    let totalMotiv = 0;
    let totalSupport = 0;
    let totalMgmt = 0;
    let totalAssess = 0;
    let sumOverallScore = 0;

    let studentCount = 0;
    let parentCount = 0;
    const strengths: string[] = [];
    const improvements: string[] = [];

    all.forEach((rec) => {
      totalComp += rec.scores.teaching_competence;
      totalPedagogy += rec.scores.pedagogical_delivery;
      totalMotiv += rec.scores.teaching_motivation;
      totalSupport += rec.scores.student_support;
      totalMgmt += rec.scores.classroom_management;
      totalAssess += rec.scores.timely_assessment;
      sumOverallScore += rec.totalScore;

      if (rec.evaluatorRole === 'student') studentCount++;
      if (rec.evaluatorRole === 'parent') parentCount++;

      if (rec.strengthsFeedback) strengths.push(rec.strengthsFeedback);
      if (rec.improvementAreas) improvements.push(rec.improvementAreas);
    });

    const count = all.length;
    const avgComp = Number((totalComp / count).toFixed(1));
    const avgPed = Number((totalPedagogy / count).toFixed(1));
    const avgMot = Number((totalMotiv / count).toFixed(1));
    const avgSup = Number((totalSupport / count).toFixed(1));
    const avgMgmt = Number((totalMgmt / count).toFixed(1));
    const avgAssess = Number((totalAssess / count).toFixed(1));

    const overallAvgScore = Number((sumOverallScore / count).toFixed(1)); // out of 60
    const overallPercentage = Number(((overallAvgScore / 60) * 100).toFixed(1));

    let ratingTier: 'outstanding' | 'very_good' | 'satisfactory' | 'needs_improvement' = 'satisfactory';
    if (overallPercentage >= 90) ratingTier = 'outstanding';
    else if (overallPercentage >= 75) ratingTier = 'very_good';
    else if (overallPercentage >= 60) ratingTier = 'satisfactory';
    else ratingTier = 'needs_improvement';

    return {
      teacherId,
      teacherName,
      schoolName,
      subject,
      totalEvaluations: count,
      studentEvaluationsCount: studentCount,
      parentEvaluationsCount: parentCount,
      averageScores: {
        teaching_competence: avgComp,
        pedagogical_delivery: avgPed,
        teaching_motivation: avgMot,
        student_support: avgSup,
        classroom_management: avgMgmt,
        timely_assessment: avgAssess
      },
      overallAverageScore: overallAvgScore,
      overallPercentage,
      ratingTier,
      strengthsSummary: strengths.slice(0, 5),
      improvementsSummary: improvements.slice(0, 5)
    };
  },

  getAllTeacherSummaries: (schoolId?: string): TeacherEvaluationSummary[] => {
    const credentials = StorageService.getCredentials();
    const teachers = schoolId
      ? credentials.filter((c) => c.schoolId === schoolId)
      : credentials;

    const summaries: TeacherEvaluationSummary[] = [];
    teachers.forEach((tch) => {
      const summary = StorageService.getTeacherEvaluationSummary(tch.id);
      if (summary) {
        summaries.push(summary);
      } else {
        summaries.push({
          teacherId: tch.id,
          teacherName: tch.teacherName,
          schoolName: tch.schoolName,
          subject: tch.subject,
          totalEvaluations: 0,
          studentEvaluationsCount: 0,
          parentEvaluationsCount: 0,
          averageScores: {
            teaching_competence: 0,
            pedagogical_delivery: 0,
            teaching_motivation: 0,
            student_support: 0,
            classroom_management: 0,
            timely_assessment: 0
          },
          overallAverageScore: 0,
          overallPercentage: 0,
          ratingTier: 'satisfactory',
          strengthsSummary: [],
          improvementsSummary: []
        });
      }
    });

    return summaries.sort((a, b) => b.overallPercentage - a.overallPercentage);
  },

  // Academic Grade Collection & Multi-Tier Approval Workflow
  getGradeWorkflows: (schoolId?: string): AcademicGradeWorkflowBatch[] => {
    let list = loadItem<AcademicGradeWorkflowBatch[]>(STORAGE_KEYS.GRADE_WORKFLOW_BATCHES, initialGradeWorkflows);
    if (schoolId) list = list.filter((b) => b.schoolId === schoolId);
    return list;
  },

  saveGradeWorkflows: (batches: AcademicGradeWorkflowBatch[]) =>
    saveItem(STORAGE_KEYS.GRADE_WORKFLOW_BATCHES, batches),

  createGradeWorkflow: (batch: AcademicGradeWorkflowBatch): AcademicGradeWorkflowBatch[] => {
    const list = StorageService.getGradeWorkflows();
    const updated = [batch, ...list];
    StorageService.saveGradeWorkflows(updated);
    return updated;
  },

  updateGradeWorkflow: (batch: AcademicGradeWorkflowBatch): AcademicGradeWorkflowBatch[] => {
    const list = StorageService.getGradeWorkflows();
    const updated = list.map((b) => (b.id === batch.id ? { ...batch, updatedAt: new Date().toISOString() } : b));
    StorageService.saveGradeWorkflows(updated);
    return updated;
  },

  submitGradeWorkflowToHomeroom: (
    batchId: string,
    notes?: string
  ): AcademicGradeWorkflowBatch[] => {
    const list = StorageService.getGradeWorkflows();
    const updated = list.map((b) => {
      if (b.id === batchId) {
        return {
          ...b,
          status: 'submitted_to_homeroom' as const,
          teacherSubmittedAt: new Date().toISOString(),
          teacherNotes: notes !== undefined ? notes : b.teacherNotes,
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    });
    StorageService.saveGradeWorkflows(updated);
    return updated;
  },

  submitGradeWorkflowToDirector: (
    batchId: string,
    remarks?: string
  ): AcademicGradeWorkflowBatch[] => {
    const list = StorageService.getGradeWorkflows();
    const updated = list.map((b) => {
      if (b.id === batchId) {
        return {
          ...b,
          status: 'submitted_to_director' as const,
          homeroomSubmittedAt: new Date().toISOString(),
          homeroomRemarks: remarks !== undefined ? remarks : b.homeroomRemarks,
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    });
    StorageService.saveGradeWorkflows(updated);
    return updated;
  },

  approveGradeWorkflowByDirector: (
    batchId: string,
    directorName: string,
    feedback?: string
  ): { updatedBatches: AcademicGradeWorkflowBatch[]; approvedBatch?: AcademicGradeWorkflowBatch } => {
    const list = StorageService.getGradeWorkflows();
    let approvedBatch: AcademicGradeWorkflowBatch | undefined;
    const approvalTimestamp = new Date().toISOString();
    const sealNumber = `SHAS-DIR-APPR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const updated = list.map((b) => {
      if (b.id === batchId) {
        const canDispatchToBureau = StorageService.isSchoolBureauConnected(b.schoolId);
        const item: AcademicGradeWorkflowBatch = {
          ...b,
          status: 'director_approved' as const,
          directorName: directorName || b.directorName || 'አቶ ጉተማ ዋቆ (ዳይሬክተር)',
          directorApprovedAt: approvalTimestamp,
          directorFeedback: feedback || (canDispatchToBureau ? 'ውጤቱ በዳይሬክተር ጽሕፈት ቤት ጸድቆ ለተማሪ/ወላጅ እና ለትምህርት ቢሮ ይፋ ተደርጓል።' : 'ውጤቱ በዳይሬክተር ጽሕፈት ቤት ጸድቆ ለተማሪ/ወላጅ ይፋ ተደርጓል (የትምህርት ቢሮ ግንኙነት ፈቃድ በመጠባበቅ ላይ)።'),
          directorApprovalSealNumber: sealNumber,
          dispatchedToBureau: canDispatchToBureau,
          dispatchedToBureauAt: canDispatchToBureau ? approvalTimestamp : undefined,
          updatedAt: approvalTimestamp
        };
        approvedBatch = item;
        return item;
      }
      return b;
    });

    StorageService.saveGradeWorkflows(updated);

    if (approvedBatch) {
      const canDispatch = StorageService.isSchoolBureauConnected(approvedBatch.schoolId);
      // 1. Dispatch official report submission to Shashemene City Administration Education Bureau ONLY if developer payment is approved!
      if (canDispatch) {
        const reportSemester =
          approvedBatch.period === 'semester_2' || approvedBatch.period === 'quarter_3' || approvedBatch.period === 'quarter_4'
            ? 'Semester 2'
            : approvedBatch.period === 'annual'
            ? 'Annual'
            : 'Semester 1';

        StorageService.addReport({
          id: `rep-${Date.now()}`,
          schoolId: approvedBatch.schoolId,
          schoolName: approvedBatch.schoolName,
          academicYear: approvedBatch.academicYear,
          semester: reportSemester,
          gradeLevel: `Grade ${approvedBatch.grade} (ሴክሽን ${approvedBatch.section})`,
          totalStudents: approvedBatch.totalStudents,
          malePassed: Math.round(approvedBatch.passCount * 0.52),
          femalePassed: Math.round(approvedBatch.passCount * 0.48),
          promotedPercentage: approvedBatch.passRate,
          averageScore: approvedBatch.averageScore,
          topStudentName: approvedBatch.topStudentName,
          topStudentScore: approvedBatch.topStudentScore,
          submittedDate: approvalTimestamp.split('T')[0],
          status: 'submitted',
          feedback: `በ${directorName || 'ዳይሬክተር'} የጸደቀ ይፋዊ የውጤት ሰነድ (ማህተም፡ ${sealNumber})`
        });
      }

      // 2. Enqueue for offline sync
      OfflineSyncManager.enqueue('grade_workflow', 'update', approvedBatch.id, approvedBatch, {
        authorName: directorName || 'ዳይሬክተር',
        schoolName: approvedBatch.schoolName,
        role: 'school_director',
        description: `የGrade ${approvedBatch.grade}${approvedBatch.section} ${approvedBatch.periodLabel} በዳይሬክተር የጸደቀ ውጤት`
      });

      // 3. Automated Status Update Flow: Trigger student/parent notification
      const notif: StudentReportNotification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        batchId: approvedBatch.id,
        schoolId: approvedBatch.schoolId,
        schoolName: approvedBatch.schoolName,
        grade: approvedBatch.grade,
        section: approvedBatch.section,
        academicYear: approvedBatch.academicYear,
        period: approvedBatch.period,
        periodLabel: approvedBatch.periodLabel,
        directorName: directorName || approvedBatch.directorName || 'ዋና ዳይሬክተር',
        sealNumber: sealNumber,
        approvedAt: approvalTimestamp,
        message: `የ${approvedBatch.academicYear} ${approvedBatch.periodLabel} የክፍል ${approvedBatch.grade}${approvedBatch.section} ይፋዊ የተማሪዎች ውጤት ሪፖርት በዋና ዳይሬክተር ${directorName || approvedBatch.directorName || 'ዳይሬክተር'} ጸድቆ ለእይታ ዝግጁ ሆኗል! (ማህተም፡ ${sealNumber})`,
        isRead: false
      };
      StorageService.addStudentReportNotification(notif);

      // 4. Also post official announcement to School Notice Board
      StorageService.addAnnouncement({
        id: `ann-grade-${Date.now()}`,
        schoolId: approvedBatch.schoolId,
        schoolName: approvedBatch.schoolName,
        title: `📢 የ${approvedBatch.periodLabel} ይፋዊ ውጤት ጸድቆ ተለቋል (Grade ${approvedBatch.grade}${approvedBatch.section})`,
        content: `የትምህርት ቤቱ ዋና ዳይሬክተር ${directorName || 'ዳይሬክተር'} የGrade ${approvedBatch.grade}${approvedBatch.section} የ${approvedBatch.periodLabel} የተማሪዎች ውጤት ሪፖርት መርምረው አጽድቀዋል። ወላጆችና ተማሪዎች በፖርታላቸው በመግባት የተረጋገጠውን ውጤት ካርድ ማየትና ማተም ይችላሉ። ዲጂታል ማህተም፡ ${sealNumber}።`,
        authorRole: 'director',
        authorName: directorName || 'ዳይሬክተር',
        targetAudience: 'all',
        priority: 'urgent',
        createdAt: approvalTimestamp.split('T')[0],
        category: 'exam'
      });
    }

    return { updatedBatches: updated, approvedBatch };
  },

  requestGradeWorkflowRevision: (
    batchId: string,
    requestedBy: string,
    feedback: string
  ): AcademicGradeWorkflowBatch[] => {
    const list = StorageService.getGradeWorkflows();
    const updated = list.map((b) => {
      if (b.id === batchId) {
        return {
          ...b,
          status: 'revision_requested' as const,
          directorFeedback: `${requestedBy}፡ ${feedback}`,
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    });
    StorageService.saveGradeWorkflows(updated);
    return updated;
  },

  // Student & Parent Report Approval Notifications
  getStudentReportNotifications: (filter?: {
    schoolId?: string;
    grade?: number;
    section?: string;
    studentId?: string;
  }): StudentReportNotification[] => {
    let list = loadItem<StudentReportNotification[]>(
      STORAGE_KEYS.STUDENT_REPORT_NOTIFICATIONS,
      initialStudentReportNotifications
    );
    if (filter?.schoolId) {
      list = list.filter((n) => n.schoolId === filter.schoolId);
    }
    if (filter?.grade) {
      list = list.filter((n) => n.grade === filter.grade);
    }
    if (filter?.section && filter.section !== 'all' && filter.section !== 'All') {
      list = list.filter((n) => !n.section || n.section === filter.section || n.section === 'all' || n.section === 'All');
    }
    if (filter?.studentId) {
      list = list.filter((n) => !n.studentId || n.studentId === filter.studentId);
    }
    return list.sort((a, b) => new Date(b.approvedAt).getTime() - new Date(a.approvedAt).getTime());
  },

  saveStudentReportNotifications: (list: StudentReportNotification[]) =>
    saveItem(STORAGE_KEYS.STUDENT_REPORT_NOTIFICATIONS, list),

  addStudentReportNotification: (notif: StudentReportNotification): StudentReportNotification[] => {
    const list = StorageService.getStudentReportNotifications();
    const updated = [notif, ...list.filter((n) => n.id !== notif.id)];
    StorageService.saveStudentReportNotifications(updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('director_report_approved', { detail: notif }));
      window.dispatchEvent(new CustomEvent('director_report_notification_updated'));
    }
    return updated;
  },

  markNotificationAsRead: (id: string): StudentReportNotification[] => {
    const list = StorageService.getStudentReportNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    StorageService.saveStudentReportNotifications(updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('director_report_notification_updated'));
    }
    return updated;
  },

  markAllNotificationsAsRead: (filter?: {
    schoolId?: string;
    grade?: number;
    section?: string;
  }): StudentReportNotification[] => {
    const list = StorageService.getStudentReportNotifications();
    const updated = list.map((n) => {
      const matchSchool = !filter?.schoolId || n.schoolId === filter.schoolId;
      const matchGrade = !filter?.grade || n.grade === filter.grade;
      const matchSection = !filter?.section || n.section === filter.section || filter.section === 'all' || filter.section === 'All';
      if (matchSchool && matchGrade && matchSection) {
        return { ...n, isRead: true };
      }
      return n;
    });
    StorageService.saveStudentReportNotifications(updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('director_report_notification_updated'));
    }
    return updated;
  },

  deleteStudentReportNotification: (id: string): StudentReportNotification[] => {
    const list = StorageService.getStudentReportNotifications();
    const updated = list.filter((n) => n.id !== id);
    StorageService.saveStudentReportNotifications(updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('director_report_notification_updated'));
    }
    return updated;
  },

  // Last Sync
  getLastSync: (): string => loadItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString()),

  // Export full backup for offline portability
  exportAllDataAsJSON: (): string => {
    const bundle = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      bureau: 'Shashemene City Administration Education Bureau',
      schools: StorageService.getSchools(),
      staff: StorageService.getStaff(),
      credentials: StorageService.getCredentials(),
      exams: StorageService.getExams(),
      submissions: StorageService.getSubmissions(),
      trainingMaterials: StorageService.getTrainingMaterials(),
      reports: StorageService.getReports(),
      standards: StorageService.getStandards(),
      students: StorageService.getStudents(),
      schoolCodes: StorageService.getSchoolCodes(),
      teacherEvaluations: StorageService.getTeacherEvaluations(),
      gradeWorkflows: StorageService.getGradeWorkflows(),
      studentReportNotifications: StorageService.getStudentReportNotifications()
    };
    return JSON.stringify(bundle, null, 2);
  },

  // Import backup data
  importBackupData: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.schools) StorageService.saveSchools(data.schools);
      if (data.staff) StorageService.saveStaff(data.staff);
      if (data.credentials) StorageService.saveCredentials(data.credentials);
      if (data.exams) StorageService.saveExams(data.exams);
      if (data.submissions) StorageService.saveSubmissions(data.submissions);
      if (data.trainingMaterials) StorageService.saveTrainingMaterials(data.trainingMaterials);
      if (data.reports) StorageService.saveReports(data.reports);
      if (data.standards) StorageService.saveStandards(data.standards);
      if (data.students) StorageService.saveStudents(data.students);
      if (data.schoolCodes) StorageService.saveSchoolCodes(data.schoolCodes);
      if (data.teacherEvaluations) StorageService.saveTeacherEvaluations(data.teacherEvaluations);
      if (data.gradeWorkflows) StorageService.saveGradeWorkflows(data.gradeWorkflows);
      if (data.studentReportNotifications) StorageService.saveStudentReportNotifications(data.studentReportNotifications);
      return true;
    } catch (e) {
      console.error('Failed to import backup:', e);
      return false;
    }
  },

  // Developer License Payments & Bureau Connection Access
  getDeveloperPayments: (): DeveloperPaymentReceipt[] => {
    return loadItem(STORAGE_KEYS.DEVELOPER_PAYMENTS, initialDeveloperPayments);
  },
  saveDeveloperPayments: (payments: DeveloperPaymentReceipt[]) => {
    saveItem(STORAGE_KEYS.DEVELOPER_PAYMENTS, payments);
  },
  getDeveloperPaymentBySchoolId: (schoolId: string): DeveloperPaymentReceipt | undefined => {
    const list = StorageService.getDeveloperPayments();
    return list.find((p) => p.schoolId === schoolId);
  },
  submitDeveloperPayment: (payment: DeveloperPaymentReceipt): { payments: DeveloperPaymentReceipt[]; schools: School[] } => {
    const payments = StorageService.getDeveloperPayments();
    const existingIndex = payments.findIndex((p) => p.schoolId === payment.schoolId || p.id === payment.id);
    let updatedPayments: DeveloperPaymentReceipt[];
    if (existingIndex >= 0) {
      updatedPayments = [...payments];
      updatedPayments[existingIndex] = payment;
    } else {
      updatedPayments = [payment, ...payments];
    }
    StorageService.saveDeveloperPayments(updatedPayments);

    // Update School status to receipt_submitted
    const schools = StorageService.getSchools();
    const updatedSchools = schools.map((s) =>
      s.id === payment.schoolId
        ? {
            ...s,
            developerPaymentStatus: payment.status,
            developerPaymentReceiptId: payment.id
          }
        : s
    );
    StorageService.saveSchools(updatedSchools);
    return { payments: updatedPayments, schools: updatedSchools };
  },
  approveDeveloperPayment: (
    receiptId: string,
    reviewerName: string = 'ታምራት ዓለ (Tamerat Ale - System Developer)'
  ): { payments: DeveloperPaymentReceipt[]; schools: School[] } => {
    const payments = StorageService.getDeveloperPayments();
    let targetSchoolId = '';
    const updatedPayments = payments.map((p) => {
      if (p.id === receiptId || p.schoolId === receiptId) {
        targetSchoolId = p.schoolId;
        return {
          ...p,
          status: 'approved' as const,
          reviewedAt: new Date().toISOString(),
          reviewedBy: reviewerName,
          rejectionReason: undefined
        };
      }
      return p;
    });
    StorageService.saveDeveloperPayments(updatedPayments);

    const schools = StorageService.getSchools();
    const updatedSchools = schools.map((s) =>
      s.id === targetSchoolId || s.id === receiptId
        ? {
            ...s,
            developerPaymentStatus: 'approved' as const,
            developerPaymentApprovedAt: new Date().toISOString()
          }
        : s
    );
    StorageService.saveSchools(updatedSchools);
    return { payments: updatedPayments, schools: updatedSchools };
  },
  rejectDeveloperPayment: (
    receiptId: string,
    reason: string,
    reviewerName: string = 'ታምራት ዓለ (Tamerat Ale - System Developer)'
  ): { payments: DeveloperPaymentReceipt[]; schools: School[] } => {
    const payments = StorageService.getDeveloperPayments();
    let targetSchoolId = '';
    const updatedPayments = payments.map((p) => {
      if (p.id === receiptId || p.schoolId === receiptId) {
        targetSchoolId = p.schoolId;
        return {
          ...p,
          status: 'rejected' as const,
          reviewedAt: new Date().toISOString(),
          reviewedBy: reviewerName,
          rejectionReason: reason
        };
      }
      return p;
    });
    StorageService.saveDeveloperPayments(updatedPayments);

    const schools = StorageService.getSchools();
    const updatedSchools = schools.map((s) =>
      s.id === targetSchoolId || s.id === receiptId
        ? {
            ...s,
            developerPaymentStatus: 'rejected' as const
          }
        : s
    );
    StorageService.saveSchools(updatedSchools);
    return { payments: updatedPayments, schools: updatedSchools };
  },
  revokeDeveloperPayment: (
    schoolId: string,
    reviewerName: string = 'ታምራት ዓለ (Tamerat Ale - System Developer)'
  ): { payments: DeveloperPaymentReceipt[]; schools: School[] } => {
    const payments = StorageService.getDeveloperPayments();
    const updatedPayments = payments.map((p) => {
      if (p.schoolId === schoolId) {
        return {
          ...p,
          status: 'pending_payment' as const,
          reviewedAt: new Date().toISOString(),
          reviewedBy: reviewerName,
          rejectionReason: 'የሲስተም አበልፃጊው ፈቃዱን ለጊዜው አግዶታል'
        };
      }
      return p;
    });
    StorageService.saveDeveloperPayments(updatedPayments);

    const schools = StorageService.getSchools();
    const updatedSchools = schools.map((s) =>
      s.id === schoolId
        ? {
            ...s,
            developerPaymentStatus: 'pending_payment' as const
          }
        : s
    );
    StorageService.saveSchools(updatedSchools);
    return { payments: updatedPayments, schools: updatedSchools };
  },
  getDeveloperConfig: (): DeveloperPaymentConfig => {
    const cfg = loadItem<DeveloperPaymentConfig>(STORAGE_KEYS.DEVELOPER_CONFIG, initialDeveloperConfig);
    if (!cfg.bankAccounts || cfg.bankAccounts.length === 0) {
      cfg.bankAccounts = initialDeveloperConfig.bankAccounts || [];
    }
    if (!cfg.abyssiniaAccount) cfg.abyssiniaAccount = initialDeveloperConfig.abyssiniaAccount;
    if (!cfg.coopAccount) cfg.coopAccount = initialDeveloperConfig.coopAccount;
    if (!cfg.parentCompany) cfg.parentCompany = initialDeveloperConfig.parentCompany;
    if (!cfg.sisterCompany) cfg.sisterCompany = initialDeveloperConfig.sisterCompany;
    if (!cfg.leadProgrammer) cfg.leadProgrammer = initialDeveloperConfig.leadProgrammer;
    if (!cfg.backendEngineer) cfg.backendEngineer = initialDeveloperConfig.backendEngineer;
    if (!cfg.frontendEngineer) cfg.frontendEngineer = initialDeveloperConfig.frontendEngineer;
    if (!cfg.designer) cfg.designer = initialDeveloperConfig.designer;
    if (!cfg.address) cfg.address = initialDeveloperConfig.address;
    if (!cfg.websiteUrl) cfg.websiteUrl = initialDeveloperConfig.websiteUrl;
    if (!cfg.secondaryPhone || cfg.developerPhone === '+251 91 188 4590') {
      cfg.developerPhone = initialDeveloperConfig.developerPhone;
      cfg.secondaryPhone = initialDeveloperConfig.secondaryPhone;
    }
    return cfg;
  },
  saveDeveloperConfig: (config: DeveloperPaymentConfig): DeveloperPaymentConfig => {
    saveItem(STORAGE_KEYS.DEVELOPER_CONFIG, config);
    return config;
  },
  isSchoolBureauConnected: (schoolId: string): boolean => {
    const schools = StorageService.getSchools();
    const target = schools.find((s) => s.id === schoolId);
    return target?.developerPaymentStatus === 'approved';
  },

  // ==========================================================================
  // Student Discipline & Misconduct Tip-off Reports (የተማሪዎች ስነ-ምግባር ክትትልና ጥቆማ)
  // ==========================================================================
  getDisciplineReports: (schoolId?: string): StudentDisciplineReport[] => {
    const list = loadItem<StudentDisciplineReport[]>(STORAGE_KEYS.DISCIPLINE_REPORTS, initialDisciplineReports);
    if (!schoolId) return list;
    return list.filter((r) => r.schoolId === schoolId);
  },

  addDisciplineReport: (report: StudentDisciplineReport): StudentDisciplineReport[] => {
    const list = loadItem<StudentDisciplineReport[]>(STORAGE_KEYS.DISCIPLINE_REPORTS, initialDisciplineReports);
    const updated = [report, ...list.filter((r) => r.id !== report.id)];
    saveItem(STORAGE_KEYS.DISCIPLINE_REPORTS, updated);
    return updated;
  },

  updateDisciplineReport: (report: StudentDisciplineReport): StudentDisciplineReport[] => {
    const list = loadItem<StudentDisciplineReport[]>(STORAGE_KEYS.DISCIPLINE_REPORTS, initialDisciplineReports);
    const updated = list.map((r) => (r.id === report.id ? report : r));
    saveItem(STORAGE_KEYS.DISCIPLINE_REPORTS, updated);
    return updated;
  },

  acknowledgeDisciplineReport: (
    id: string,
    directorName: string,
    remarks?: string
  ): StudentDisciplineReport[] => {
    const list = loadItem<StudentDisciplineReport[]>(STORAGE_KEYS.DISCIPLINE_REPORTS, initialDisciplineReports);
    const nowIso = new Date().toISOString();
    const updated = list.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          isAcknowledged: true,
          acknowledgedByDirectorName: directorName,
          directorAcknowledgedAt: nowIso,
          directorRemarks: remarks || r.directorRemarks,
          status: r.status === 'pending_review' ? 'under_investigation' : r.status,
          updatedAt: nowIso
        };
      }
      return r;
    });
    saveItem(STORAGE_KEYS.DISCIPLINE_REPORTS, updated);
    return updated;
  },

  deleteDisciplineReport: (id: string): StudentDisciplineReport[] => {
    const list = loadItem<StudentDisciplineReport[]>(STORAGE_KEYS.DISCIPLINE_REPORTS, initialDisciplineReports);
    const updated = list.filter((r) => r.id !== id);
    saveItem(STORAGE_KEYS.DISCIPLINE_REPORTS, updated);
    return updated;
  },

  // Reset to default
  resetToDefaults: () => {
    localStorage.clear();
    saveItem(STORAGE_KEYS.SCHOOLS, initialSchools);
    saveItem(STORAGE_KEYS.STAFF, initialStaff);
    saveItem(STORAGE_KEYS.CREDENTIALS, initialTeacherCredentials);
    saveItem(STORAGE_KEYS.EXAMS, initialExams);
    saveItem(STORAGE_KEYS.TRAINING, initialTrainingMaterials);
    saveItem(STORAGE_KEYS.REPORTS, initialStudentReports);
    saveItem(STORAGE_KEYS.STANDARDS, initialBureauStandards);
    saveItem(STORAGE_KEYS.STUDENTS, initialStudents);
    saveItem(STORAGE_KEYS.SCHOOL_CODES, initialSchoolCodes);
    saveItem(STORAGE_KEYS.TEACHER_EVALUATIONS, initialTeacherEvaluations);
    saveItem(STORAGE_KEYS.GRADE_WORKFLOW_BATCHES, initialGradeWorkflows);
    saveItem(STORAGE_KEYS.DEVELOPER_PAYMENTS, initialDeveloperPayments);
    saveItem(STORAGE_KEYS.DEVELOPER_CONFIG, initialDeveloperConfig);
    saveItem(STORAGE_KEYS.DISCIPLINE_REPORTS, initialDisciplineReports);
  }
};
