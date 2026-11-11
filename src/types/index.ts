export type Language = 'am' | 'om' | 'en';

export type UserRole =
  | 'bureau_admin'
  | 'bureau_staff'
  | 'school_admin'
  | 'school_director'
  | 'school_owner'
  | 'teacher'
  | 'student'
  | 'parent'
  | 'accountant'
  | 'registrar';

export type SchoolType = 'government' | 'private' | 'mission' | 'public';
export type SchoolLevel = 'primary' | 'middle' | 'secondary' | 'preparatory' | 'complete';
export type InspectionLevel = 'level_1' | 'level_2' | 'level_3' | 'level_4'; // MoE Ethiopia Inspection rating

export interface School {
  id: string;
  name: string;
  nameOm?: string;
  code: string;
  type: SchoolType;
  level: SchoolLevel;
  subcity: string; // Kifle Ketema / Kebele in Shashemene
  principalName: string;
  phone: string;
  email: string;
  establishedYear: number;
  totalStudents: number;
  maleStudents: number;
  femaleStudents: number;
  totalTeachers: number;
  maleTeachers: number;
  femaleTeachers: number;
  classroomsCount: number;
  labsCount: number;
  libraryCapacity: number;
  inspectionLevel: InspectionLevel;
  status: 'active' | 'pending_approval' | 'needs_inspection';
  accessCode: string;
  createdAt: string;
  logoUrl?: string; // Custom uploaded image (base64 data URL) or preset identifier
  // System Developer License & Accreditation Integration
  developerPaymentStatus?: 'pending_payment' | 'receipt_submitted' | 'approved' | 'rejected';
  developerPaymentApprovedAt?: string;
  developerPaymentReceiptId?: string;
}

export interface BureauStaff {
  id: string;
  fullName: string;
  roleTitle: string;
  department: string;
  accessCode: string;
  phone: string;
  email: string;
  permissions: string[];
  status: 'active' | 'inactive';
  joinedDate: string;
}

export interface TeacherCredential {
  id: string;
  teacherName: string;
  gender: 'M' | 'F';
  schoolId: string;
  schoolName: string;
  subject: string;
  qualification: 'Diploma' | 'Degree' | 'Masters' | 'PhD';
  institution: string;
  graduationYear: number;
  licenseNumber: string;
  experienceYears: number;
  verificationStatus: 'verified' | 'pending' | 'flagged';
  notes?: string;
  verifiedBy?: string;
  verificationDate?: string;
}

export interface ExamQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TeacherExam {
  id: string;
  title: string;
  subject: string;
  targetCategory: string; // 'all' | 'primary' | 'middle' | 'secondary' | 'preparatory'
  /** ፈተናው የተዘጋጀበት የክፍል ደረጃ (Target Grade Levels, e.g. 'Grade 10', 'Grades 9 - 10', 'Grades 11 - 12', 'All Grades (1 - 12)') */
  targetGradeLevels?: string;
  durationMinutes: number;
  /** አንድ ጥያቄ ስንት ደቂቃ ይቆይ (Time limit per question in minutes, e.g. 1, 2, 3... or 0 for total exam timer only) */
  timePerQuestionMinutes?: number;
  /** የጥያቄዎች አቀራረብ፡ 'all_at_once' = ሙሉ ጥያቄ በአንድ ጊዜ, 'one_by_one' = አንድ ጥያቄ ሰርቶ ሲጨርስ ቀጣይ ጥያቄ */
  deliveryMode?: 'all_at_once' | 'one_by_one';
  totalMarks: number;
  passingScore: number;
  questions: ExamQuestion[];
  instructions: string;
  status: 'active' | 'draft' | 'closed';
  createdAt: string;
  deadline: string;
  sourceTrainingMaterialId?: string;
  sourceTrainingTitle?: string;
  generatedByAI?: boolean;
}

export interface SubmissionAnswer {
  questionId: string;
  questionText?: string;
  selectedOption: number;
  selectedOptionText?: string;
  correctOption?: number;
  correctOptionText?: string;
  isCorrect?: boolean;
  explanation?: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  examTitle?: string;
  teacherId: string;
  teacherName: string;
  schoolName: string;
  subject: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
  certificateNumber?: string;
  /** የትምህርት ቢሮ ውጤት ግምገማ እና መልቀቂያ ሁኔታ፡ 'pending_bureau_review' = በትምህርት ቢሮ ግምገማ ላይ, 'released_to_teacher' = ለመምህሩ ተለቋል */
  reviewStatus: 'pending_bureau_review' | 'released_to_teacher';
  reviewedBy?: string;
  reviewedAt?: string;
  bureauNotes?: string;
  answers: SubmissionAnswer[];
}

export interface TrainingAttachment {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'doc' | 'txt' | 'image' | 'other';
  fileSize: string; // e.g. "1.2 MB"
  dataUrl?: string; // base64 or file URL for downloading
  textContent?: string; // full text content of the attached training document
  description?: string;
  uploadedAt: string;
  uploadedBy?: string;
}

export interface TrainingMaterial {
  id: string;
  title: string;
  subject: string; // primary subject label
  targetSubjects?: string[]; // multiple selected subjects e.g. ['Mathematics (ሂሳብ)', 'Physics (ፊዚክስ)']
  gradeLevels: string; // grade range string e.g. "Grades 9 - 10"
  targetGradeList?: number[]; // multiple selected grades e.g. [9, 10, 11]
  authorDepartment: string;
  uploadedAt: string;
  summary: string;
  fullContent: string;
  readTimeMinutes: number;
  tags: string[];
  downloadCount: number;
  attachments?: TrainingAttachment[];
}

export interface TeacherTrainingNotification {
  id: string;
  materialId: string;
  materialTitle: string;
  subject: string;
  gradeLevels: string;
  authorDepartment: string;
  uploadedAt: string;
  message: string;
  isRead: boolean;
  schoolId?: string;
  teacherId?: string;
}

export interface StudentScore {
  subject: string;
  quiz1: number;
  quiz2: number;
  midExam: number;
  finalExam: number;
  total: number;
  gradeLetter: string;
}

export type StudentShift = 'morning' | 'afternoon' | 'evening' | 'regular_day' | 'night_shift';
export type ShiftCategory = 'morning' | 'afternoon' | 'evening';

export const resolveStudentShiftCategory = (s: {
  shift?: StudentShift;
  section?: string;
  shiftSchedule?: string;
  nightProgramType?: string;
}): ShiftCategory => {
  if (
    s.shift === 'evening' ||
    s.shift === 'night_shift' ||
    s.section?.toUpperCase().startsWith('N') ||
    s.nightProgramType !== undefined
  ) {
    return 'evening';
  }
  if (s.shift === 'afternoon') {
    return 'afternoon';
  }
  if (s.shift === 'morning') {
    return 'morning';
  }
  const sched = (s.shiftSchedule || '').toLowerCase();
  if (
    sched.includes('ከሰዓት') ||
    sched.includes('afternoon') ||
    s.section?.toUpperCase().endsWith('B') ||
    s.section?.toUpperCase().endsWith('D')
  ) {
    return 'afternoon';
  }
  return 'morning';
};

export type NightProgramType = 'secondary_night' | 'remedial' | 'adult_education';

export interface StudentRecord {
  id: string;
  schoolId: string;
  schoolName: string;
  studentIdNumber: string;
  fullName: string;
  gender: 'M' | 'F';
  grade: number;
  section: string;
  accessCode: string;
  parentName: string;
  parentPhone: string;
  parentAccessCode: string;
  scores: StudentScore[];
  attendanceRate: number;
  conduct: 'A' | 'B' | 'C';
  rank: number;
  // Night shift / Evening Extension Program additions
  shift?: StudentShift; // 'regular_day' | 'night_shift'
  nightProgramType?: NightProgramType; // 'secondary_night' | 'remedial' | 'adult_education'
  occupation?: string; // ሞያ / የቀን ስራ (e.g. 'ነጋዴ', 'የመንግስት ሰራተኛ', 'የጤና ባለሙያ')
  shiftSchedule?: string; // e.g. 'ሰኞ - አርብ | 11:30 - 3:00 ማታ (5:30 - 9:00 PM)'
  workplace?: string; // የስራ ቦታ / ተቋም
  stream?: 'Natural' | 'Social' | 'General'; // የትምህርት መስክ (ለ 11 እና 12)
  emergencyContact?: string; // ድንገተኛ አደጋ ተጠሪ
  enrollmentYear?: string; // የተመዘገበበት ዓመት
}

export interface NightClassScheduleItem {
  id: string;
  periodNumber: number; // 1, 2, 3, 4
  startTime: string; // e.g. "11:30 ማታ"
  endTime: string; // e.g. "12:15 ማታ"
  standardTime: string; // e.g. "5:30 PM - 6:15 PM"
  grade: number; // 9, 10, 11, 12
  section: string; // 'N1', 'N2'
  subject: string;
  teacherName: string;
  classroomNumber: string;
  daysOfWeek: string; // e.g. 'ሰኞ - አርብ'
}

export interface NightAttendanceEntry {
  id: string;
  studentId: string;
  studentName: string;
  grade: number;
  section: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'late' | 'absent' | 'excused';
  arrivalTime?: string; // e.g. "11:45 ማታ"
  lateReason?: string; // e.g. "ከስራ መዘግየት"
  recordedBy: string;
}

export interface SchoolReportSubmission {
  id: string;
  schoolId: string;
  schoolName: string;
  academicYear: string;
  semester: 'Semester 1' | 'Semester 2' | 'Annual';
  gradeLevel: string;
  totalStudents: number;
  malePassed: number;
  femalePassed: number;
  promotedPercentage: number;
  averageScore: number;
  topStudentName: string;
  topStudentScore: number;
  submittedDate: string;
  reviewedBy?: string;
  status: 'approved' | 'submitted' | 'requires_revision';
  feedback?: string;
}

export interface BureauStandardCriteria {
  id: string;
  category: string;
  criterionTitle: string;
  description: string;
  targetStandard: string;
  currentCityAverage: string;
  status: 'on_track' | 'attention_needed' | 'critical';
}

export interface AppUserSession {
  role: UserRole;
  name: string;
  schoolId?: string;
  schoolName?: string;
  schoolLogoUrl?: string;
  staffDepartment?: string;
  identifier: string;
  accessCode?: string;
}

export type StakeholderRole =
  | 'principal' // ርዕሰ መምህር / ዋና ዳይሬክተር
  | 'vice_principal_academic' // ምክትል ርዕሰ መምህር (አካዳሚክ)
  | 'vice_principal_admin' // ምክትል ርዕሰ መምህር (አስተዳደር)
  | 'head_librarian' // የትምህርት ቤት ቤተ-መጻሕፍት ኃላፊ / ባለሙያ
  | 'lab_technician' // የሳይንስና ቴክኖሎጂ ላብራቶሪ ባለሙያ
  | 'department_head' // የትምህርት ክፍል ኃላፊ
  | 'teacher' // መምህር
  | 'guidance_counselor' // የስነ-ልቦና እና የምክር አገልግሎት ባለሙያ
  | 'school_owner_board' // የትምህርት ቤት ባለቤት / የቦርድ ሰብሳቢ
  | 'pta_chair' // የወላጅ መምህራን ህብረት (PTA) ሰብሳቢ
  | 'registrar_finance' // ሬጅስትራር እና ፋይናንስ ሹም
  | 'student_council_leader'; // የተማሪዎች መማክርት መሪ

export interface GraduationCredentialDoc {
  id: string;
  level: 'Certificate' | 'Diploma' | 'Degree' | 'Masters' | 'PhD' | 'License';
  fieldOfStudy: string;
  institution: string;
  graduationYear: number;
  credentialDocNumber: string;
  documentFileUrl?: string;
}

export interface SchoolStakeholder {
  id: string;
  schoolId: string;
  schoolName: string;
  fullName: string;
  gender: 'M' | 'F';
  role: StakeholderRole;
  roleCustomTitle?: string;
  officeOrDepartment: string;
  phone: string;
  email: string;
  photoUrl?: string;
  
  // Fayda Digital National ID
  faydaNumber: string; // e.g. FAYDA-4829-1029-4820
  faydaDocUrl?: string;
  faydaVerified: boolean;
  
  // Multiple Graduation & Educational Credentials
  credentials: GraduationCredentialDoc[];
  
  // Professional License
  professionalLicenseNumber: string;
  experienceYears: number;
  
  // Status and Certificate
  accessCode: string;
  certificateNumber: string;
  status: 'active' | 'on_leave' | 'transferred';
  registeredDate: string;
}

// 1. School Announcements & Notice Board (ማስታወቂያዎች)
export interface SchoolAnnouncement {
  id: string;
  schoolId: string;
  schoolName: string;
  title: string;
  content: string;
  authorRole: 'owner_board' | 'director' | 'teacher' | 'bureau' | 'accountant';
  authorName: string;
  targetAudience: 'all' | 'teachers' | 'students' | 'parents' | 'staff';
  priority: 'normal' | 'important' | 'urgent';
  createdAt: string;
  category?: 'academic' | 'administrative' | 'finance' | 'holiday' | 'exam' | 'pta';
}

// 2. Homework & Assignments (የቤት ስራ እና ምልጃ)
export interface HomeworkAssignment {
  id: string;
  schoolId: string;
  schoolName: string;
  teacherId: string;
  teacherName: string;
  grade: number;
  section: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  createdAt: string;
}

export interface HomeworkSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  grade: number;
  section: string;
  submissionText: string;
  submissionDate: string;
  score?: number;
  teacherFeedback?: string;
  status: 'submitted' | 'graded';
}

// 3. Student Daily Attendance (የተማሪዎች ዕለታዊ መገኘት)
export interface StudentAttendanceRecord {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  grade: number;
  section: string;
  date: string;
  time?: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  reason?: string;
  recordedBy: string;
  method?: 'manual' | 'qr_scan';
  qrVerificationToken?: string;
}

// 4. Monthly Tuition Fee & Payments (የወር ክፍያ)
export interface FeePaymentRecord {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  grade: number;
  section: string;
  parentName: string;
  month: string; // e.g. "ጥቅምት 2017"
  amount: number;
  paymentDate: string;
  paymentMethod: 'telebirr' | 'cbe_birr' | 'cash' | 'bank_transfer';
  receiptNumber: string;
  status: 'paid' | 'pending' | 'overdue' | 'rejected';
  collectedBy: string; // Accountant name
  notes?: string;

  // Receipt Attachment & Online Submission
  receiptImageUrl?: string; // base64 / file URL of the attached bank deposit receipt
  transactionRef?: string; // Bank transaction reference / FT code / Telebirr transaction ID
  bankName?: string; // Bank where payment was made
  submittedByRole?: 'student' | 'parent' | 'accountant';
  submittedByName?: string;
  submittedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

// School Official Bank Accounts posted by Cashier (የትምህርት ቤቱ ገንዘብ ያዥ የሚለጥፋቸው ይፋዊ የባንክ አካውንቶች)
export interface SchoolBankAccount {
  id: string;
  schoolId: string;
  bankName: string; // e.g. 'የኢትዮጵያ ንግድ ባንክ (CBE)', 'ቴሌብር (Telebirr)', 'አዋሽ ባንክ (Awash Bank)'
  accountNumber: string;
  accountHolder: string; // e.g. 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት'
  telebirrNumber?: string;
  branch?: string;
  instructions?: string;
  isActive: boolean;
  postedBy?: string; // e.g. 'ወ/ሮ ሰላማዊት አበራ (ሒሳብ ሹም)'
  postedAt?: string;
}


// 5. School Operational Expenses (የትምህርት ቤት አስተዳደራዊ ወጪ)
export interface SchoolExpenseRecord {
  id: string;
  schoolId: string;
  title: string;
  category: 'salary' | 'utilities' | 'maintenance' | 'supplies' | 'events' | 'other';
  amount: number;
  date: string;
  approvedBy: string; // Director / Board
  paidTo: string;
  recordedBy: string; // Accountant name
  receiptDocNumber?: string;
  notes?: string;
}

// 6. Director Appointment by Board / Owner (የዳይሬክተር ቅጥር)
export interface DirectorAppointment {
  id: string;
  schoolId: string;
  schoolName: string;
  principalName: string;
  qualification: string;
  phone: string;
  email: string;
  appointedDate: string;
  appointedBy: string; // Owner / Board Chair
  accessCode: string;
  status: 'active' | 'retired' | 'transferred';
  dutiesAndPowers: string[];
}

// 7. School Library & Resource Center (የቤተ-መጻሕፍት መዝገብ)
export interface LibraryBookRecord {
  id: string;
  schoolId: string;
  title: string;
  author: string;
  category: string;
  shelfCode: string;
  totalCopies: number;
  availableCopies: number;
  borrowerName?: string;
  borrowerGrade?: string;
  borrowDate?: string;
  returnDueDate?: string;
  status: 'available' | 'borrowed' | 'reserved';
}

// 8. Teacher Evaluation & Appraisal by Students/Parents (የመምህራን ግምገማና መመዘኛ ግብዓት)
export type EvaluationCriterionKey =
  | 'teaching_competence'     // 1. የማስተማር ብቃቱ (Subject Mastery)
  | 'pedagogical_delivery'    // 2. የትምህርት አሰጣጡ (Pedagogical Delivery & Clarity)
  | 'teaching_motivation'     // 3. ለማስተማር ያለው ተነሳሽነት (Motivation & Dedication)
  | 'student_support'         // 4. የተማሪ ጥያቄን ማዳመጥና መደገፍ (Student Support & Fairness)
  | 'classroom_management'   // 5. የክፍል ስነ-ስርዓትና የጊዜ አጠቃቀም (Classroom Discipline & Time Management)
  | 'timely_assessment';      // 6. የቤት ስራና ፈተናን በወቅቱ ማረምና ግብረ-መልስ (Assessment & Feedback)

export interface TeacherEvaluationRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  schoolId: string;
  schoolName: string;
  subject: string;
  gradeLevel?: number;
  section?: string;
  academicYear: string;
  semester: '1' | '2';
  
  // Scores for each criterion (each 0 - 10):
  scores: {
    teaching_competence: number;     // max 10: የማስተማር ብቃቱ
    pedagogical_delivery: number;    // max 10: የትምህርት አሰጣጡ
    teaching_motivation: number;     // max 10: ለማስተማር ያለው ተነሳሽነት
    student_support: number;         // max 10: የተማሪ ጥያቄን ማዳመጥና መደገፍ
    classroom_management: number;   // max 10: የክፍል ስነ-ስርዓትና የጊዜ አጠቃቀም
    timely_assessment: number;       // max 10: የቤት ስራና ፈተናን በወቅቱ ማረምና ግብረ-መልስ
  };
  totalScore: number; // sum out of 60
  percentage: number; // (totalScore / 60) * 100
  ratingTier: 'outstanding' | 'very_good' | 'satisfactory' | 'needs_improvement';

  // Qualitative Feedback
  strengthsFeedback?: string;     // ጥንካሬዎች
  improvementAreas?: string;      // መሻሻል ያለባቸው ነጥቦች
  recommendations?: string;       // ምክረ-ሀሳብ ለትምህርት ቢሮ

  // Evaluator Info (supports anonymous / confidential)
  evaluatorRole: 'student' | 'parent';
  isAnonymous: boolean;
  evaluatorName?: string;
  evaluatorStudentId?: string;
  evaluatorParentName?: string;

  // Bureau Sync & Appraisal Status
  submittedAt: string;
  bureauSyncStatus: 'synced' | 'pending';
  bureauDecisionNotes?: string;
  usedForAppraisal?: boolean;
}

export interface TeacherEvaluationSummary {
  teacherId: string;
  teacherName: string;
  schoolName: string;
  subject: string;
  totalEvaluations: number;
  studentEvaluationsCount: number;
  parentEvaluationsCount: number;
  averageScores: {
    teaching_competence: number;
    pedagogical_delivery: number;
    teaching_motivation: number;
    student_support: number;
    classroom_management: number;
    timely_assessment: number;
  };
  overallAverageScore: number; // out of 60
  overallPercentage: number;   // out of 100
  ratingTier: 'outstanding' | 'very_good' | 'satisfactory' | 'needs_improvement';
  strengthsSummary: string[];
  improvementsSummary: string[];
}

// 9. Academic Grade Collection & Approval Workflow (የተማሪ ውጤት መሰብሰብና ባለ 3-ደረጃ ማፅደቂያ ስርዓት)
// መምህር -> የክፍል ተጠሪ -> ዳይሬክተር (ሲያጸድቅ ለተማሪ/ወላጅ እና ለትምህርት ቢሮ ይደርሳል)
export type AcademicPeriodType =
  | 'quarter_1'   // 1ኛ ሩብ ዓመት (Quarter 1)
  | 'quarter_2'   // 2ኛ ሩብ ዓመት (Quarter 2)
  | 'semester_1'  // 1ኛ ግማሽ ዓመት (Semester 1)
  | 'quarter_3'   // 3ኛ ሩብ ዓመት (Quarter 3)
  | 'quarter_4'   // 4ኛ ሩብ ዓመት (Quarter 4)
  | 'semester_2'  // 2ኛ ግማሽ ዓመት (Semester 2)
  | 'annual';     // የሙሉ ዓመት ጠቅላላ (Annual Summary)

export type GradeApprovalStatus =
  | 'draft'                  // መምህሩ ገና በማዘጋጀት ላይ
  | 'submitted_to_homeroom'  // መምህሩ ለክፍል ተጠሪ መምህር ልኳል
  | 'submitted_to_director'  // የክፍል ተጠሪው አጠናቅሮ ለዳይሬክተር ልኳል
  | 'director_approved'      // ዳይሬክተሩ አጽድቆ ይፋ አድርጓል (ለተማሪ/ወላጅ እና ለትምህርት ቢሮ ደርሷል)
  | 'revision_requested';    // ማሻሻያ እንዲደረግበት ተመልሷል

export interface StudentWorkflowGradeItem {
  studentId: string;
  studentName: string;
  studentIdNumber: string;
  gender: 'M' | 'F';
  quiz1: number;       // 10%
  quiz2: number;       // 10%
  midExam: number;     // 30%
  finalExam: number;   // 50%
  total: number;       // 100%
  gradeLetter: string; // A, B, C, D, F
  conduct?: 'A' | 'B' | 'C';
  attendanceRate?: number;
  rank?: number;
  remarks?: string;
}

export interface AcademicGradeWorkflowBatch {
  id: string;
  schoolId: string;
  schoolName: string;
  grade: number;
  section: string;
  academicYear: string;
  period: AcademicPeriodType;
  periodLabel: string;
  subject: string;
  isCompiledSectionRoster: boolean; // true if compiled by homeroom teacher for all subjects

  // Stage 1: Subject Teacher
  teacherId?: string;
  teacherName: string;
  teacherSubmittedAt?: string;
  teacherNotes?: string;

  // Stage 2: Homeroom Teacher (የክፍል ተጠሪ)
  homeroomTeacherId?: string;
  homeroomTeacherName: string;
  homeroomSubmittedAt?: string;
  homeroomRemarks?: string;
  homeroomConductDefault?: 'A' | 'B' | 'C';

  // Stage 3: School Director (ዳይሬክተር)
  directorId?: string;
  directorName?: string;
  directorApprovedAt?: string;
  directorFeedback?: string;
  directorApprovalSealNumber?: string;

  // Status & Propagation
  status: GradeApprovalStatus;
  
  // Education Bureau Dispatch
  dispatchedToBureau: boolean;
  dispatchedToBureauAt?: string;
  bureauReportId?: string;

  // Student Entries & Summary Metrics
  entries: StudentWorkflowGradeItem[];
  totalStudents: number;
  averageScore: number;
  passCount: number;
  failCount: number;
  passRate: number;
  topStudentName: string;
  topStudentScore: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface StudentReportNotification {
  id: string;
  batchId?: string;
  reportId?: string;
  schoolId: string;
  schoolName: string;
  grade: number;
  section: string;
  studentId?: string;
  academicYear: string;
  period: AcademicPeriodType;
  periodLabel: string;
  directorName: string;
  sealNumber: string;
  approvedAt: string;
  message: string;
  isRead: boolean;
}

export type DeveloperPaymentStatus = 'pending_payment' | 'receipt_submitted' | 'approved' | 'rejected';

export interface DeveloperPaymentReceipt {
  id: string;
  schoolId: string;
  schoolName: string;
  amount: number;
  currency: string;
  bankName: string;
  transactionRef: string;
  receiptImageUrl?: string;
  payerName: string;
  payerPhone: string;
  submittedAt: string;
  status: DeveloperPaymentStatus;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface DeveloperCustomBankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branchOrPhone?: string;
  isActive: boolean;
  notes?: string;
}

export interface DeveloperPaymentConfig {
  feeAmount: number;
  currency: string;
  accountHolder: string;
  cbeAccount: string;
  telebirrNumber: string;
  awashAccount: string;
  dashenAccount: string;
  abyssiniaAccount?: string;
  coopAccount?: string;
  developerPhone: string;
  secondaryPhone?: string;
  developerEmail: string;
  instructionsAm: string;
  bankAccounts?: DeveloperCustomBankAccount[];
  parentCompany?: string;
  sisterCompany?: string;
  leadProgrammer?: string;
  backendEngineer?: string;
  frontendEngineer?: string;
  designer?: string;
  address?: string;
  websiteUrl?: string;
}

// ============================================================================
// STUDENT DISCIPLINE & MISCONDUCT TIP-OFF (የተማሪዎች ስነ-ምግባር ክትትልና መጠቆሚያ)
// ============================================================================

export type MisconductCategory =
  | 'fighting_violence'          // ፀብ እና አካላዊ ጥቃት / ማስፈራራት (Fighting / Violence / Bullying)
  | 'verbal_abuse_harassment'    // ስድብ፣ ዛቻ እና ማሸማቀቅ (Verbal Abuse / Harassment / Threat)
  | 'classroom_disruption'       // የክፍል ረብሻ እና መምህራንን አለማክበር (Classroom Disruption / Disrespect)
  | 'substance_smoking_khat'     // አደንዛዥ እፅ፣ ጫት ወይም ሲጋራ (Substance Abuse / Khat / Smoking)
  | 'property_damage_vandalism'  // የትምህርት ቤት ንብረት ማውደም (Vandalism / Property Damage)
  | 'truancy_skipping_class'     // ከትምህርት ቤት ማምለጥና አለመገኘት (Truancy / Skipping Class)
  | 'exam_cheating'              // ፈተና ማጭበርበር እና ስርቆት (Exam Cheating / Stealing)
  | 'digital_mobile_misuse'      // የስልክ ተገቢ ያልሆነ አጠቃቀም (Inappropriate Mobile / Digital Use)
  | 'other_misconduct';          // ሌላ የስነ-ምግባር ጉድለት (Other Conduct Violation)

export type DisciplineReportSeverity = 'low' | 'medium' | 'high' | 'critical';

export type DisciplineReportStatus =
  | 'pending_review'      // አዲስ ጥቆማ (ያልታየ)
  | 'under_investigation' // በዳይሬክተር ምርመራ ላይ
  | 'parent_conference'   // ከወላጅ ጋር ውይይት ተጠርቷል
  | 'counseling_given'    // የምክር አገልግሎት ተሰጥቷል
  | 'action_taken'        // አስተዳደራዊ እርምጃ ተወስዷል
  | 'resolved_closed';    // ተጠናቆ ተዘግቷል

export interface StudentDisciplineReport {
  id: string;
  schoolId: string;
  schoolName: string;

  // Target Student (የተጠቆመበት ተማሪ)
  targetStudentId?: string;
  targetStudentName: string;
  targetStudentCode?: string;
  grade: number;
  section: string;

  // Reporter Information (የጠቋሚው ማንነት)
  reporterType: 'student' | 'parent' | 'teacher' | 'anonymous';
  reporterName?: string;
  reporterPhone?: string;
  reporterCode?: string;
  isConfidential: boolean; // ሚስጥራዊ ጥቆማ

  // Incident Details (የስነ-ምግባር ጥሰቱ ዝርዝር)
  category: MisconductCategory;
  customCategoryTitle?: string;
  severity: DisciplineReportSeverity;
  incidentDate: string; // e.g. "2026-11-08"
  incidentTime?: string; // e.g. "4:30 ከሰዓት"
  incidentLocation?: string; // e.g. "በክፍል ውስጥ", "በግቢው በር ላይ", "በካፍቴሪያ"
  description: string; // ዝርዝር መግለጫ
  witnesses?: string; // የዓይን እማኞች / አብረው የነበሩ ተማሪዎች

  // Director Resolution, Acknowledgment & Action (የዳይሬክተር ውሳኔ፣ ዕውቅና መስጫና እርምጃ)
  status: DisciplineReportStatus;
  directorRemarks?: string;
  actionTaken?: string;
  actionDate?: string;
  reviewedByDirectorName?: string;
  isAcknowledged?: boolean; // ዳይሬክተሩ ማየቱን/ዕውቅና መስጠቱን የሚያረጋግጥ
  acknowledgedByDirectorName?: string; // ዕውቅና የሰጠው ዳይሬክተር ስም
  directorAcknowledgedAt?: string; // ይፋዊ ቀንና ሰዓት (Timestamp, e.g. "2026-11-08T06:50:00Z")
  createdAt: string;
  updatedAt?: string;
}



