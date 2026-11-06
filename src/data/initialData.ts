import {
  School,
  BureauStaff,
  TeacherCredential,
  TeacherExam,
  TrainingMaterial,
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
  ExamSubmission,
  NightClassScheduleItem,
  DeveloperPaymentReceipt,
  DeveloperPaymentConfig
} from '../types';

export const initialSchools: School[] = [
  {
    id: 'sch-1',
    name: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    nameOm: 'Mana Barumsa Sadarkaa 2ffaa Waliigalaa Shashamannee',
    code: 'SHAS-SEC-01',
    type: 'government',
    level: 'secondary',
    subcity: 'አቦስቶ (Abosto)',
    principalName: 'አቶ ጉተማ ዋቆ (Ato Gutema Wako)',
    phone: '+251 46 110 2420',
    email: 'shashemene.sec@education.gov.et',
    establishedYear: 1968,
    totalStudents: 2450,
    maleStudents: 1240,
    femaleStudents: 1210,
    totalTeachers: 84,
    maleTeachers: 52,
    femaleTeachers: 32,
    classroomsCount: 42,
    labsCount: 4,
    libraryCapacity: 250,
    inspectionLevel: 'level_3',
    status: 'active',
    accessCode: 'SHAS-SEC-01',
    createdAt: '2024-09-01',
    developerPaymentStatus: 'approved',
    developerPaymentApprovedAt: '2024-09-02T11:30:00'
  },
  {
    id: 'sch-2',
    name: 'ቡልቻና 1ኛ እና መካከለኛ ደረጃ ትምህርት ቤት',
    nameOm: 'M/B Sadarkaa 1ffaa fi Giddu-galeessaa Bulchaanaa',
    code: 'BUL-MID-02',
    type: 'government',
    level: 'middle',
    subcity: 'ቡልቻና (Bulchana)',
    principalName: 'ወ/ሮ ዘሃራ ሁሴን (W/ro Zahara Hussein)',
    phone: '+251 46 110 3311',
    email: 'bulchana.school@education.gov.et',
    establishedYear: 1984,
    totalStudents: 1820,
    maleStudents: 910,
    femaleStudents: 910,
    totalTeachers: 58,
    maleTeachers: 30,
    femaleTeachers: 28,
    classroomsCount: 30,
    labsCount: 2,
    libraryCapacity: 160,
    inspectionLevel: 'level_3',
    status: 'active',
    accessCode: 'BUL-MID-02',
    createdAt: '2024-09-01',
    developerPaymentStatus: 'receipt_submitted',
    developerPaymentReceiptId: 'dev-rec-bulchana-01'
  },
  {
    id: 'sch-3',
    name: 'ሃዋስ ፕራይቬት አካዳሚ',
    nameOm: 'Akaadaamii Dhuunfaa Hawaas',
    code: 'HAW-ACAD-03',
    type: 'private',
    level: 'complete',
    subcity: 'አዋሾ (Awasho)',
    principalName: 'ዶ/ር ተስፋዬ በቀለ (Dr. Tesfaye Bekele)',
    phone: '+251 46 110 5590',
    email: 'info@hawasacademy.edu.et',
    establishedYear: 2005,
    totalStudents: 940,
    maleStudents: 480,
    femaleStudents: 460,
    totalTeachers: 48,
    maleTeachers: 26,
    femaleTeachers: 22,
    classroomsCount: 24,
    labsCount: 3,
    libraryCapacity: 180,
    inspectionLevel: 'level_4',
    status: 'active',
    accessCode: 'HAW-ACAD-03',
    createdAt: '2024-09-01',
    developerPaymentStatus: 'pending_payment'
  },
  {
    id: 'sch-4',
    name: 'ቁዬራ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    nameOm: 'Mana Barumsa Sadarkaa 2ffaa Kuyyaraa',
    code: 'KUY-SEC-04',
    type: 'government',
    level: 'secondary',
    subcity: 'ቁዬራ (Kuyera)',
    principalName: 'አቶ ደረጀ ገለታ (Ato Dereje Geleta)',
    phone: '+251 46 110 7712',
    email: 'kuyera.high@education.gov.et',
    establishedYear: 1978,
    totalStudents: 1980,
    maleStudents: 1010,
    femaleStudents: 970,
    totalTeachers: 66,
    maleTeachers: 40,
    femaleTeachers: 26,
    classroomsCount: 36,
    labsCount: 3,
    libraryCapacity: 200,
    inspectionLevel: 'level_3',
    status: 'active',
    accessCode: 'KUY-SEC-04',
    createdAt: '2024-09-01'
  },
  {
    id: 'sch-5',
    name: 'አቦስቶ 1ኛ ደረጃ ትምህርት ቤት',
    nameOm: 'M/B Sadarkaa 1ffaa Abostoo',
    code: 'ABO-PRI-05',
    type: 'government',
    level: 'primary',
    subcity: 'አቦስቶ (Abosto)',
    principalName: 'አቶ ጀማል ከድር (Ato Jemal Kedir)',
    phone: '+251 46 110 4488',
    email: 'abosto.primary@education.gov.et',
    establishedYear: 1991,
    totalStudents: 1340,
    maleStudents: 680,
    femaleStudents: 660,
    totalTeachers: 42,
    maleTeachers: 20,
    femaleTeachers: 22,
    classroomsCount: 22,
    labsCount: 1,
    libraryCapacity: 90,
    inspectionLevel: 'level_2',
    status: 'active',
    accessCode: 'ABO-PRI-05',
    createdAt: '2024-09-01'
  },
  {
    id: 'sch-6',
    name: 'አዋሾ ሞዴል ትምህርት ቤት',
    nameOm: 'M/B Moodeela Awaashoo',
    code: 'AWA-MOD-06',
    type: 'mission',
    level: 'complete',
    subcity: 'አዋሾ (Awasho)',
    principalName: 'ሲስተር ማርያም ጴጥሮስ (Sister Maryam Petros)',
    phone: '+251 46 110 9901',
    email: 'awasho.model@missionschools.et',
    establishedYear: 1996,
    totalStudents: 1120,
    maleStudents: 550,
    femaleStudents: 570,
    totalTeachers: 52,
    maleTeachers: 25,
    femaleTeachers: 27,
    classroomsCount: 26,
    labsCount: 4,
    libraryCapacity: 220,
    inspectionLevel: 'level_4',
    status: 'active',
    accessCode: 'AWA-MOD-06',
    createdAt: '2024-09-01'
  },
  {
    id: 'sch-7',
    name: 'አለሉ 1ኛ ደረጃ ትምህርት ቤት',
    nameOm: 'M/B Sadarkaa 1ffaa Aleeluu',
    code: 'ALE-PRI-07',
    type: 'government',
    level: 'primary',
    subcity: 'አለሉ (Alelu)',
    principalName: 'አቶ ወርቁ ታደሰ (Ato Worku Tadese)',
    phone: '+251 46 110 6623',
    email: 'alelu.primary@education.gov.et',
    establishedYear: 1998,
    totalStudents: 980,
    maleStudents: 500,
    femaleStudents: 480,
    totalTeachers: 34,
    maleTeachers: 18,
    femaleTeachers: 16,
    classroomsCount: 18,
    labsCount: 1,
    libraryCapacity: 80,
    inspectionLevel: 'level_2',
    status: 'active',
    accessCode: 'ALE-PRI-07',
    createdAt: '2024-09-01'
  },
  {
    id: 'sch-8',
    name: 'ዲዳ ቦቄ 1ኛ ደረጃ ትምህርት ቤት',
    nameOm: 'M/B Sadarkaa 1ffaa Diidaa Booqee',
    code: 'DID-PRI-08',
    type: 'government',
    level: 'primary',
    subcity: 'ዲዳ ቦቄ (Dida Boke)',
    principalName: 'ወ/ሮ ጫልቱ ገመቹ (W/ro Chaltu Gemechu)',
    phone: '+251 46 110 8834',
    email: 'didaboke.school@education.gov.et',
    establishedYear: 2002,
    totalStudents: 820,
    maleStudents: 410,
    femaleStudents: 410,
    totalTeachers: 28,
    maleTeachers: 14,
    femaleTeachers: 14,
    classroomsCount: 16,
    labsCount: 1,
    libraryCapacity: 70,
    inspectionLevel: 'level_2',
    status: 'active',
    accessCode: 'DID-PRI-08',
    createdAt: '2024-09-01'
  }
];

export const initialStaff: BureauStaff[] = [
  {
    id: 'st-1',
    fullName: 'አቶ ታምራት አለሙ (Ato Tamerat Alemu)',
    roleTitle: 'የትምህርት ቢሮ ኃላፊ (Bureau Head)',
    department: 'የቢሮ አመራር (Executive)',
    accessCode: 'BUR-HEAD-01',
    phone: '+251 91 144 5566',
    email: 'tamerat.head@shasheducation.gov.et',
    permissions: ['all_management', 'approve_licenses', 'send_materials', 'view_reports'],
    status: 'active',
    joinedDate: '2021-02-15'
  },
  {
    id: 'st-2',
    fullName: 'ወ/ሮ ጫልቱ ደረጀ (W/ro Chaltu Dereje)',
    roleTitle: 'የትምህርት ጥራትና ኢንስፔክሽን ዳይሬክተር (Quality & Inspection)',
    department: 'ኢንስፔክሽንና ደረጃ ምዘና (Inspection)',
    accessCode: 'BUR-INSP-02',
    phone: '+251 92 233 4455',
    email: 'chaltu.inspection@shasheducation.gov.et',
    permissions: ['inspect_schools', 'audit_credentials', 'rate_standards'],
    status: 'active',
    joinedDate: '2022-04-10'
  },
  {
    id: 'st-3',
    fullName: 'አቶ ገመቹ በቀለ (Ato Gemechu Bekele)',
    roleTitle: 'የስርዓተ-ትምህርትና መምህራን ልማት ባለሙያ (Curriculum & CPD)',
    department: 'ስርዓተ-ትምህርትና ስልጠና (Curriculum)',
    accessCode: 'BUR-CURR-03',
    phone: '+251 93 344 5566',
    email: 'gemechu.cpd@shasheducation.gov.et',
    permissions: ['send_training', 'review_curriculum', 'verify_teachers'],
    status: 'active',
    joinedDate: '2022-08-01'
  },
  {
    id: 'st-4',
    fullName: 'ወ/ሮ ረሂማ ሙስጠፋ (W/ro Rehima Mustafa)',
    roleTitle: 'የፈተናና ምዘና ዋና አስተባባሪ (Examinations & Assessment)',
    department: 'ፈተናና ምዘና (Examinations)',
    accessCode: 'BUR-EXAM-04',
    phone: '+251 94 455 6677',
    email: 'rehima.exams@shasheducation.gov.et',
    permissions: ['create_exams', 'evaluate_scores', 'issue_certificates'],
    status: 'active',
    joinedDate: '2023-01-12'
  },
  {
    id: 'st-5',
    fullName: 'አቶ ካሳሁን ደበበ (Ato Kassahun Debebe)',
    roleTitle: 'የትምህርት ስታትስቲክስና ፕላን ኦፊሰር (Planning & Statistics)',
    department: 'ፕላንና መረጃ (Planning & EMIS)',
    accessCode: 'BUR-PLAN-05',
    phone: '+251 95 566 7788',
    email: 'kassahun.emis@shasheducation.gov.et',
    permissions: ['manage_emis', 'school_analytics', 'sync_records'],
    status: 'active',
    joinedDate: '2023-05-18'
  }
];

export const initialTeacherCredentials: TeacherCredential[] = [
  {
    id: 'tc-1',
    teacherName: 'መ/ር በፈቃዱ ጥላሁን (Befekadu Tilahun)',
    gender: 'M',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    subject: 'Mathematics (ሂሳብ)',
    qualification: 'Degree',
    institution: 'ሀዋሳ ዩኒቨርሲቲ (Hawassa University)',
    graduationYear: 2017,
    licenseNumber: 'ETH-OR-SH-2022-0192',
    experienceYears: 7,
    verificationStatus: 'verified',
    verifiedBy: 'ወ/ሮ ጫልቱ ደረጀ',
    verificationDate: '2024-10-15',
    notes: 'የዲግሪ ሰርተፊኬት እና የፈተና ውጤት ትክክለኛነቱ ተረጋግጧል።'
  },
  {
    id: 'tc-2',
    teacherName: 'መ/ርት ሰላማዊት ታደሰ (Selamawit Tadese)',
    gender: 'F',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    subject: 'Afaan Oromoo (ኦሮሚኛ)',
    qualification: 'Degree',
    institution: 'አዲስ አበባ ዩኒቨርሲቲ (AAU)',
    graduationYear: 2018,
    licenseNumber: 'ETH-OR-SH-2021-4822',
    experienceYears: 6,
    verificationStatus: 'verified',
    verifiedBy: 'ወ/ሮ ጫልቱ ደረጀ',
    verificationDate: '2024-10-18',
    notes: 'በአፋን ኦሮሞ ቋንቋ እና ስነ-ፅሁፍ የላቀ ማዕረግ አላት።'
  },
  {
    id: 'tc-3',
    teacherName: 'መ/ር ቶሎሳ ጉተማ (Tolosa Gutema)',
    gender: 'M',
    schoolId: 'sch-4',
    schoolName: 'ቁዬራ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    subject: 'Physics (ፊዚክስ)',
    qualification: 'Masters',
    institution: 'አዳማ ሳይንስና ቴክኖሎጂ ዩኒቨርሲቲ (ASTU)',
    graduationYear: 2019,
    licenseNumber: 'ETH-OR-SH-2020-9901',
    experienceYears: 9,
    verificationStatus: 'verified',
    verifiedBy: 'አቶ ገመቹ በቀለ',
    verificationDate: '2024-11-02',
    notes: 'የማስተርስ ዲግሪ ሰነድ ኦፊሴላዊ ማህተም አለበት።'
  },
  {
    id: 'tc-4',
    teacherName: 'መ/ርት አሚና ኑሪ (Amina Nuri)',
    gender: 'F',
    schoolId: 'sch-3',
    schoolName: 'ሃዋስ ፕራይቬት አካዳሚ',
    subject: 'English (እንግሊዝኛ)',
    qualification: 'Degree',
    institution: 'ሀረማያ ዩኒቨርሲቲ (Haramaya University)',
    graduationYear: 2021,
    licenseNumber: 'ETH-OR-SH-2023-1194',
    experienceYears: 4,
    verificationStatus: 'pending',
    notes: 'የኦሪጅናል ትራንስክሪፕት ቅጂ በቢሮው እየተገመገመ ይገኛል።'
  },
  {
    id: 'tc-5',
    teacherName: 'መ/ር ደርቤ ገለታ (Derbe Geleta)',
    gender: 'M',
    schoolId: 'sch-2',
    schoolName: 'ቡልቻና 1ኛ እና መካከለኛ ደረጃ ትምህርት ቤት',
    subject: 'General Science / Biology (ባዮሎጂ)',
    qualification: 'Diploma',
    institution: 'ሀዋሳ መምህራን ትምህርት ኮሌጅ (Hawassa CTE)',
    graduationYear: 2014,
    licenseNumber: 'ETH-OR-SH-2018-7721',
    experienceYears: 10,
    verificationStatus: 'flagged',
    notes: 'በአዲሱ የትምህርት ፍኖተ-ካርታ መስፈርት መሰረት ወደ ዲግሪ ማሻሻል ይጠበቅበታል።'
  },
  {
    id: 'tc-6',
    teacherName: 'መ/ር ከድር አህመድ (Kedir Ahmed)',
    gender: 'M',
    schoolId: 'sch-6',
    schoolName: 'አዋሾ ሞዴል ትምህርት ቤት',
    subject: 'Chemistry (ኬሚስትሪ)',
    qualification: 'Degree',
    institution: 'አርሲ ዩኒቨርሲቲ (Arsi University)',
    graduationYear: 2020,
    licenseNumber: 'ETH-OR-SH-2023-3329',
    experienceYears: 5,
    verificationStatus: 'verified',
    verifiedBy: 'ወ/ሮ ጫልቱ ደረጀ',
    verificationDate: '2024-11-10'
  }
];

export const initialExams: TeacherExam[] = [
  {
    id: 'exam-1',
    title: 'የስነ-ማስተማር ብቃትና የክፍል አመራር ምዘና (Pedagogical Competency Assessment)',
    subject: 'Pedagogy & Classroom Management',
    targetCategory: 'all',
    durationMinutes: 20,
    totalMarks: 100,
    passingScore: 70,
    status: 'active',
    instructions: 'ይህ ፈተና በሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ የተዘጋጀ ይፋዊ የመምህራን ብቃት መመዘኛ ነው። ጥያቄዎቹን በጥንቃቄ በማንበብ ትክክለኛውን መልስ ይምረጡ። 70% እና በላይ ካመጡ ይፋዊ ሰርተፊኬት ያገኛሉ።',
    createdAt: '2025-01-10',
    deadline: '2025-12-30',
    questions: [
      {
        id: 'q1',
        questionText: 'በተማሪ ተኮር የማስተማር ዘዴ (Student-Centered Learning) ውስጥ የመምህሩ ዋነኛ ሚና ምንድን ነው?',
        options: [
          'መረጃን ያለማቋረጥ ለተማሪዎች ብቻ መስጠት (Direct lecture)',
          'ተማሪዎች እውቀትን ራሳቸው እንዲያፈልቁ ማመቻቸትና ማገዝ (Facilitator & Guide)',
          'ተማሪዎች በፈተና ወቅት ዝም እንዲሉ መቆጣጠር ብቻ',
          'የመማሪያ መጽሐፉን ከዳር እስከ ዳር ማንበብ'
        ],
        correctIndex: 1,
        explanation: 'በተማሪ ተኮር ዘዴ መምህሩ የእውቀት ምንጭ ብቻ ሳይሆን የመማር ሂደቱን የሚያመቻች (Facilitator) ነው።'
      },
      {
        id: 'q2',
        questionText: 'ቀጣይነት ያለው የተማሪዎች ምዘና (Continuous Formative Assessment) ዋና አላማው ምንድነው?',
        options: [
          'ተማሪዎችን ማወዳደርና ማሸነፍ ማስፈጠር',
          'የመማር ማስተማር ሂደቱን ጉድለቶች በመለየት የማስተካከያ ድጋፍ መስጠት',
          'ተማሪዎችን ማስፈራሪያ ነጥብ መመዝገብ',
          'ፈተናዎችን ለትምህርት ቢሮ ሪፖርት ማድረጊያ ብቻ ማዋል'
        ],
        correctIndex: 1,
        explanation: 'ቀጣይነት ያለው ምዘና ዋነኛ ግቡ ተማሪው የት ጋር እንደተቸገረ አውቆ አፋጣኝ ማስተካከያ (Feedback) መስጠት ነው።'
      },
      {
        id: 'q3',
        questionText: 'በብሉም የታክሶኖሚ (Bloom’s Taxonomy) የከፍተኛ የማሰብ ክህሎት (Higher Order Thinking) የሚባለው የትኛው ነው?',
        options: [
          'ማስታወስ (Remembering)',
          'መረዳት (Understanding)',
          'መተንተንና መፍጠር (Analyzing & Creating)',
          'ቀመሮችን በቃል መሸምደድ (Rote memorization)'
        ],
        correctIndex: 2,
        explanation: 'መተንተን፣ መገምገም እና መፍጠር ከፍተኛ የአስተሳሰብ እርከኖች (HOTS) ናቸው።'
      },
      {
        id: 'q4',
        questionText: 'አሳታፊ የክፍል ስነ-ስርዓትን ለመገንባት (Positive Discipline) ከሚከተሉት የትኛው ይመከራል?',
        options: [
          'አካላዊ ቅጣትና ተማሪን በክፍል ፊት ማሸማቀቅ',
          'ግልጽ የጋራ ደንቦችን ከተማሪዎች ጋር በማውጣት አወንታዊ ማበረታቻ መስጠት',
          'ደንብ ያፈረሰን ተማሪ ለሳምንታት ከክፍል ማባረር',
          'ማንኛውንም ጥፋት ችላ ብሎ ማለፍ'
        ],
        correctIndex: 1,
        explanation: 'አወንታዊ ስነ-ስርዓት የሚገነባው ግልጽ ውይይት፣ ማበረታቻ እና አክብሮት በተሞላበት አቀራረብ ነው።'
      },
      {
        id: 'q5',
        questionText: 'አካታች ትምህርት (Inclusive Education) ማለት ምን ማለት ነው?',
        options: [
          'ፈጣን ተማሪዎችን ብቻ ለይቶ ማስተማር',
          'ሁሉንም ተማሪዎች (የተለያየ አቅም፣ ፆታ እና ልዩ ፍላጎት ያላቸውን) በአንድነት በእኩል መብት ማስተማር',
          'የግል ትምህርት ቤቶችን ብቻ የሚመለከት ፅንሰ ሀሳብ',
          'የውጭ ቋንቋዎችን ብቻ ማካተት'
        ],
        correctIndex: 1,
        explanation: 'አካታች ትምህርት ልዩ ፍላጎት ያላቸውን ጨምሮ ሁሉንም ህጻናት በእኩል እድል ያሳትፋል።'
      }
    ]
  },
  {
    id: 'exam-2',
    title: 'የአዲሱ ስርዓተ-ትምህርት ብቃት ተኮር ምዘና (Competency-Based Curriculum Test)',
    subject: 'Curriculum & Assessment Framework',
    targetCategory: 'all',
    durationMinutes: 15,
    totalMarks: 100,
    passingScore: 70,
    status: 'active',
    instructions: 'የኢትዮጵያ አዲሱን የትምህርት ፍኖተ-ካርታ እና የሻሸመኔ ከተማ የጥራት መለኪያዎችን መሰረት ያደረገ ምዘና።',
    createdAt: '2025-01-15',
    deadline: '2025-12-30',
    questions: [
      {
        id: 'c1',
        questionText: 'በብቃት ተኮር ስርዓተ-ትምህርት (Competency-Based) ውስጥ የተማሪው ውጤታማነት የሚለካው በዋናነት በምንድነው?',
        options: [
          'መጽሐፍትን በቃል ማስታወስ በመቻሉ ብቻ',
          'እውቀትን በተግባር፣ በክህሎትና በህይወት አጋጣሚዎች ላይ መተግበር በመቻሉ',
          'በክፍል ውስጥ ረጅሙን ማስታወሻ መጻፍ በመቻሉ',
          'በተደጋጋሚ ተገኝቶ በመቀመጡ ብቻ'
        ],
        correctIndex: 1,
        explanation: 'ብቃት (Competency) እውቀትን፣ ክህሎትን እና አመለካከትን በተግባር ማዋሃድ ነው።'
      },
      {
        id: 'c2',
        questionText: 'የሻሸመኔ ከተማ ትምህርት ቢሮ ደረጃ 4 (Level 4) ትምህርት ቤት ለመባል ዝቅተኛው የተሟላ መስፈርት ምን ያህል ነው?',
        options: [
          '50% መስፈርት ማሟላት',
          '75% እና ከዚያ በላይ የጥራት መስፈርቶችን ማሟላት',
          'የግል ትምህርት ቤት መሆን ብቻ',
          'የተማሪዎች ብዛት ከ 500 በታች መሆን'
        ],
        correctIndex: 1,
        explanation: 'ደረጃ 4 (ሞዴል) የትምህርት ጥራት መለኪያዎችን ከ 75% በላይ በከፍተኛ ብቃት ያሟሉ ተቋማት የሚሰጥ ነው።'
      },
      {
        id: 'c3',
        questionText: 'በመምህራን ቀጣይነት ያለው የሙያ ማሻሻያ (CPD) ውስጥ መምህሩ ከባልደረቦቹ ጋር የሚሰራው የትኛውን ነው?',
        options: [
          'የክፍል ውስጥ እርስ በርስ ምልከታና የልምድ ልውውጥ (Peer Observation & Reflection)',
          'በክፍለ-ጊዜ መወያየትና ጊዜ ማሳለፍ',
          'የፈተና ጥያቄዎችን ከተማሪዎች መደበቅ',
          'የተማሪዎችን ውጤት አለማስታወቅ'
        ],
        correctIndex: 0,
        explanation: 'የስራ ባልደረቦች እርስ በርስ ክፍላቸው ገብተው ልምድ መለዋወጥ የCPD ወሳኝ ምሶሶ ነው።'
      }
    ]
  },
  {
    id: 'exam-3',
    title: 'የ10ኛ ክፍል የሂሳብ ማስተማር ስነ-ዘዴ እና የብቃት መመዘኛ ፈተና (Grade 10 Mathematics Pedagogy Exam)',
    subject: 'Mathematics (ሂሳብ)',
    targetCategory: 'secondary',
    targetGradeLevels: 'Grades 9 - 10',
    durationMinutes: 20,
    timePerQuestionMinutes: 2,
    deliveryMode: 'one_by_one',
    totalMarks: 100,
    passingScore: 70,
    status: 'active',
    instructions: 'ይህ ፈተና በሻሸመኔ ከተማ ትምህርት ቢሮ ለ 9ኛ እና 10ኛ ክፍል የሂሳብ መምህራን የተዘጋጀ ይፋዊ የይዘትና የማስተማሪያ ስነ-ዘዴ ምዘና ነው።',
    createdAt: '2025-01-20',
    deadline: '2025-12-30',
    questions: [
      {
        id: 'm1',
        questionText: 'በ 10ኛ ክፍል የኳድራቲክ እኩልዮሽ (Quadratic Equations) ትምህርት ወቅት ተማሪዎች ቀመሩን ከመሸምደድ ይልቅ በግራፍ እንዲረዱ የትኛው ዘዴ ይመረጣል?',
        options: [
          'ቀመሩን 10 ጊዜ እንዲገለብጡ ማድረግ',
          'የፓራቦላ (Parabola) ቅርጽና የ x-መጥለቅ (x-intercepts) በጂኦሜትሪ ገበታ ወይም በቴክኖሎጂ አሳይቶ ማስተሳሰር',
          'የሂሳብ ታሪክን ብቻ በቃል ማስረዳት',
          'ምንም ማብራሪያ ሳይሰጡ ልምምድ ብቻ መስጠት'
        ],
        correctIndex: 1,
        explanation: 'ተማሪዎች የግራፉን ቅርጽ ከእኩልዮሹ መልስ ጋር አገናኝተው ሲረዱ የፅንሰ-ሀሳብ ግንዛቤያቸው የጠነከረ ይሆናል።'
      },
      {
        id: 'm2',
        questionText: 'በ 9ኛ እና 10ኛ ክፍል የጂኦሜትሪ ማረጋገጫ (Geometric Proofs) ተማሪዎች እንዳይቸገሩ መምህሩ ምን ማድረግ አለበት?',
        options: [
          'ማረጋገጫዎቹን ሙሉ ለሙሉ መተው',
          'ከቀላል የዕለት ተዕለት ግንባታዎችና ቅርጾች በመነሳት ደረጃ በደረጃ አመክንዮአዊ ምክንያቶችን (Logical Deductions) ማሰልጠን',
          'ተማሪዎች በቃላቸው እንዲሸመድዱት ማስገደድ',
          'ለከፍተኛ ተማሪዎች ብቻ ማስተማር'
        ],
        correctIndex: 1,
        explanation: 'ጂኦሜትሪ የደረጃ በደረጃ አመክንዮ ውጤት በመሆኑ ከቀላል እይታ ወደ ረቂቅ ማረጋገጫ መሸጋገር ወሳኝ ነው።'
      },
      {
        id: 'm3',
        questionText: 'በሂሳብ ትምህርት ውስጥ "ችግር ፈቺ ዘዴ" (Problem-Based Math Instruction) ሲተገበር የተማሪው ሚና ምንድን ነው?',
        options: [
          'የመምህሩን ማስታወሻ መገልበጥ ብቻ',
          'ችግሮችን በቡድን መመርመር፣ መላምቶችን መሞከር እና የመፍትሄ መንገዶችን ማወዳደር',
          'መልሶችን ከጓደኛ መቅዳት',
          'ካልኩሌተርን ያለማቋረጥ መጠቀም'
        ],
        correctIndex: 1,
        explanation: 'ችግር ፈቺ ዘዴ ተማሪውን ተመራማሪና አመዛዛኝ እንዲሆን ያደርገዋል።'
      }
    ]
  },
  {
    id: 'exam-4',
    title: 'የ11ኛ እና 12ኛ ክፍል ከፍተኛ ሂሳብ ስነ-ዘዴ ፈተና (Grades 11-12 Advanced Math Pedagogy)',
    subject: 'Mathematics (ሂሳብ)',
    targetCategory: 'preparatory',
    targetGradeLevels: 'Grades 11 - 12',
    durationMinutes: 20,
    timePerQuestionMinutes: 2,
    deliveryMode: 'one_by_one',
    totalMarks: 100,
    passingScore: 75,
    status: 'active',
    instructions: 'ለ 11ኛ እና 12ኛ ክፍል የመሰናዶ ሂሳብ መምህራን የተዘጋጀ ይፋዊ የብቃት ፈተና።',
    createdAt: '2025-01-22',
    deadline: '2025-12-30',
    questions: [
      {
        id: 'am1',
        questionText: 'የካልኩለስ (Calculus - Limits & Derivatives) ፅንሰ-ሀሳብን ሲያስተምሩ ተማሪዎች የለውጥ ምጣኔን (Rate of Change) እንዲረዱ የተሻለው ምሳሌ የትኛው ነው?',
        options: [
          'የመኪና ፍጥነት (Instantaneous Speed) እና የፍጥነት መጨመር (Acceleration) ተጨባጭ ምሳሌዎች',
          'የቀመር ደንቦችን ብቻ መደርደር',
          'ታሪካዊ የኒውተን የህይወት ታሪክን ብቻ ማንበብ',
          'ያለ ማብራሪያ ጥያቄዎችን በቤት ስራ መስጠት'
        ],
        correctIndex: 0,
        explanation: 'ዴሪቬቲቭ በቅጽበት የሚከሰት የለውጥ ምጣኔ በመሆኑ ከፍጥነትና ከአካላዊ እንቅስቃሴ ጋር ሲገናኝ በቀላሉ ይገባል።'
      }
    ]
  },
  {
    id: 'exam-5',
    title: 'Qormaata Ogummaa Barsiisota Afaan Oromoo Kutaa 9-12 (Secondary Afaan Oromoo Teachers Exam)',
    subject: 'Afaan Oromoo (ኦሮሚኛ)',
    targetCategory: 'secondary',
    targetGradeLevels: 'Kutaa 9 - 12',
    durationMinutes: 20,
    timePerQuestionMinutes: 2,
    deliveryMode: 'one_by_one',
    totalMarks: 100,
    passingScore: 70,
    status: 'active',
    instructions: 'Qormaata Biiroo Barnootaa Magaalaa Shashamannee Barsiisota Afaan Oromoo Sadarkaa 2ffaa fi Qophaa\'inaatiif qophaa\'e.',
    createdAt: '2025-01-25',
    deadline: '2025-12-30',
    questions: [
      {
        id: 'ao1',
        questionText: 'Kutaa 9-12 keessatti barsiisaan Afaan Oromoo dandeettii barreeffama kalaqaa (Creative Writing) barattootaa akkamitti cimsuu qaba?',
        options: [
          'Seerluga qofa akka baratan gochuun',
          'Mata duree aadaa, seenaa fi jireenya qabatamaa irratti asoosamaa fi walaloo akka barreessan jajjabeessuu',
          'Kitaaba qofa akka dubbisan gochuu',
          'Barreeffama isaanii utuu hin sirreessin dhiisuu'
        ],
        correctIndex: 1,
        explanation: 'Barreeffamni kalaqaa yaada bilisaa fi aadaa isaanii wajjin wal simsiisuun dandeettii afaanii isaanii sadarkaa olaanaatti guddisa.'
      }
    ]
  },
  {
    id: 'exam-6',
    title: 'Secondary School English Language Teaching Assessment (Grades 9-12)',
    subject: 'English (እንግሊዝኛ)',
    targetCategory: 'secondary',
    targetGradeLevels: 'Grades 9 - 12',
    durationMinutes: 20,
    timePerQuestionMinutes: 2,
    deliveryMode: 'one_by_one',
    totalMarks: 100,
    passingScore: 70,
    status: 'active',
    instructions: 'Official Bureau pedagogical competency assessment for high school and preparatory English teachers.',
    createdAt: '2025-01-26',
    deadline: '2025-12-30',
    questions: [
      {
        id: 'en1',
        questionText: 'When teaching communicative speaking skills in high school English classes, what is the best strategy?',
        options: [
          'Correcting every minor pronunciation error immediately during speech',
          'Engaging students in debates, role plays, and problem-solving discussions to build fluency',
          'Having students read text out loud individually in silence',
          'Translating every word into mother tongue'
        ],
        correctIndex: 1,
        explanation: 'Interactive tasks like debates and role plays build communicative confidence and conversational fluency.'
      }
    ]
  },
  {
    id: 'exam-7',
    title: 'የሁለተኛ ደረጃ ሳይንስና ላብራቶሪ ማስተማሪያ ፈተና (Secondary Science & Lab Instruction Exam)',
    subject: 'Physics (ፊዚክስ)',
    targetCategory: 'secondary',
    targetGradeLevels: 'Grades 9 - 12',
    durationMinutes: 20,
    timePerQuestionMinutes: 2,
    deliveryMode: 'one_by_one',
    totalMarks: 100,
    passingScore: 70,
    status: 'active',
    instructions: 'የሁለተኛ ደረጃ የፊዚክስና ኬሚስትሪ መምህራን የተግባር ላብራቶሪ እና የሳይንስ ስነ-ዘዴ ፈተና።',
    createdAt: '2025-01-28',
    deadline: '2025-12-30',
    questions: [
      {
        id: 'sc1',
        questionText: 'በ 9ኛ - 12ኛ ክፍል የፊዚክስ ትምህርት ወቅት የተማሪዎችን የተግባር ግንዛቤ ለማሳደግ የላብራቶሪ ሙከራዎች እንዴት መመራት አለባቸው?',
        options: [
          'መምህሩ ብቻውን ሰርቶ ማሳየትና ተማሪዎች ዝም ብለው እንዲመለከቱ ማድረግ',
          'ተማሪዎች በቀጥታ እጃቸውን አስገብተው እንዲሞክሩ (Hands-on experiments) እና የተመለከቱትን መረጃ እንዲመዘግቡ ማድረግ',
          'የላብራቶሪ መሳሪያዎች እንዳይበላሹ ሙከራዎችን አለመስራት',
          'የንድፈ-ሀሳብ ማብራሪያ ብቻ መስጠት'
        ],
        correctIndex: 1,
        explanation: 'በሳይንስ ትምህርት ተማሪዎች እራሳቸው ሙከራውን ሲያከናውኑ ሳይንሳዊ ምርምርንና እውነተኛ እውነታዎችን በቀላሉ ይረዳሉ።'
      }
    ]
  }
];

export const initialTrainingMaterials: TrainingMaterial[] = [
  {
    id: 'mat-1',
    title: 'የሂሳብ ትምህርትን በችግር ፈቺ ዘዴዎች ማስተማር (Problem-Based Math Instruction)',
    subject: 'Mathematics (ሂሳብ)',
    gradeLevels: 'Grades 7 - 12',
    authorDepartment: 'ስርዓተ-ትምህርትና የመምህራን ልማት (Curriculum Dept)',
    uploadedAt: '2025-01-05',
    readTimeMinutes: 12,
    downloadCount: 142,
    tags: ['Mathematics', 'Problem Solving', 'High School'],
    summary: 'ተማሪዎች የሂሳብ ቀመሮችን ከመሸምደድ ወጥተው በዕለት ተዕለት ችግሮችና በተግባራዊ ጥያቄዎች ላይ እንዲተገብሩ የሚያግዝ የማስተማሪያ ዘዴ።',
    fullContent: `የሂሳብ ትምህርት አሰጣጥ በሻሸመኔ ከተማ ትምህርት ቤቶች ውስጥ የላቀ ውጤት እንዲያመጣ መምህራን ሊከተሏቸው የሚገቡ ዋና ዋና ነጥቦች፡

1. ተግባራዊ ምሳሌዎችን ማስቀደም፡
ቀመሩን በቀጥታ ከመስጠት ይልቅ ተማሪዎች በሻሸመኔ ገበያ፣ በንግድ እና በግንባታ ላይ የሚያገኟቸውን እውነተኛ የቁጥር ችግሮች እንደ መነሻ ያድርጉ።

2. ጥንድና የቡድን ስራዎች፡
ሂሳብን በውይይት መማር የተማሪዎችን ፍርሃት ይቀንሳል። ተማሪዎች አንዱ ለአንዱ ሲያስረዱ የማስታወስ አቅማቸው እስከ 90% ይደርሳል።

3. የዲጂታል ቴክኖሎጂ እና ስማርት ስልኮች አጠቃቀም፡
ጂኦጄብራ (GeoGebra) እና ሌሎች ነፃ መተግበሪያዎችን በመጠቀም የግራፍና የጂኦሜትሪ ትምህርቶችን በእይታ ማስደገፍ።

4. ቀጣይነት ያለው ግብረ-መልስ፡
በየሳምንቱ አጫጭር የ 5 ደቂቃ ፈተናዎችን በመስጠት ተማሪዎች ያልገባቸውን ቀድሞ መለየት።`
  },
  {
    id: 'mat-2',
    title: 'Tooftaalee Barsiisa Afaan Oromoo fi Og-barruu Ammayyaa (Modern Afaan Oromoo Pedagogy)',
    subject: 'Afaan Oromoo (ኦሮሚኛ)',
    gradeLevels: 'Kutaa 5 - 12',
    authorDepartment: 'Kutaa Qophii fi Misooma Sirna Barnootaa (Biiroo Shashamannee)',
    uploadedAt: '2025-01-08',
    readTimeMinutes: 10,
    downloadCount: 188,
    tags: ['Afaan Oromoo', 'Og-barruu', 'Dubbisuu'],
    summary: 'Dandeettiiwwan afaanii afran (Dhaggeeffachuu, Dubbachuu, Dubbisuu fi Barreessuu) haala qabatamaatiin kutaa keessatti guddisuu.',
    fullContent: `Qajeelfama Barsiisota Afaan Oromoo Bulchiinsa Magaalaa Shashamannee:

1. Dandeettii Dubbachuu fi Waldhabdee Furachuu:
Barattoonni akkaataa waloo fi mormii yaadaa (debate) gaggeessuun dandeettii afaanii isaanii akka cimsatan gochuu.

2. Aadaa Dubbisuu Dagaagsuu:
Mana kitaabaa keessatti kitaabota afaan Oromoo fi og-barruu durii fi ammayyaa akka dubbisan jajjabeessuu.

3. Seer-luga (Grammar) Qabatamaa Barsiisuu:
Seerluga akka seeraatti qofa osoo hin taane, barreeffama guyyaa guyyaa keessatti fayyadama isaa agarsiisuu.

4. Og-afaan (Oral Literature) Hojiirra Oolchuu:
Mammaaksa, hibboo fi jechamoota oromoo jireenya barattootaa wajjin wal-qabsiisuun barsiisuu.`
  },
  {
    id: 'mat-3',
    title: 'Communicative Language Teaching (CLT) for English Language Educators',
    subject: 'English (እንግሊዝኛ)',
    gradeLevels: 'Grades 9 - 12',
    authorDepartment: 'English Language Quality Assurance Unit',
    uploadedAt: '2025-01-12',
    readTimeMinutes: 15,
    downloadCount: 210,
    tags: ['English', 'CLT', 'Speaking Skills', 'Grammar'],
    summary: 'Shift from traditional grammar memorization to interactive real-life fluency activities in secondary classrooms.',
    fullContent: `Comprehensive English Pedagogy Guidelines for Shashemene Secondary Schools:

1. Maximizing Student Talking Time (STT):
The traditional classroom is often teacher-dominated (TTT). In CLT, teachers must ensure at least 60% of class time is STT through pair works, role plays, and communicative simulations.

2. Error Treatment:
Avoid interrupting students during fluency-based activities. Note systemic errors and address them during debrief sessions.

3. Contextual Vocabulary Acquisition:
Never teach words in isolation. Always teach collocations, idioms, and vocabulary embedded in contextual reading passages.

4. Integrating Listening Comprehension:
Use audio recordings, short news clips, or teacher read-alouds with clear pre-listening, while-listening, and post-listening tasks.`
  },
  {
    id: 'mat-4',
    title: 'በቀላሉ በሚገኙ ቁሳቁሶች የሳይንስ ላብራቶሪ ሙከራዎችን ማከናወን (Low-Cost Science Labs)',
    subject: 'Physics & Chemistry (ሳይንስ)',
    gradeLevels: 'Grades 7 - 10',
    authorDepartment: 'የሳይንስና ቴክኖሎጂ ላብራቶሪ ክፍል',
    uploadedAt: '2025-01-18',
    readTimeMinutes: 14,
    downloadCount: 165,
    tags: ['Physics', 'Chemistry', 'Laboratory', 'Low Cost'],
    summary: 'ውድ የሆኑ ኬሚካሎች እና መሳሪያዎች በሌሉበት አካባቢያዊ ቁሳቁሶችን ተጠቅሞ የተሟላ ሳይንሳዊ ሙከራዎችን የማከናወኛ ዘዴዎች።',
    fullContent: `የሳይንስ መምህራን በሻሸመኔ ትምህርት ቤቶች ተግባራዊ ላብራቶሪዎችን እንዲያካሂዱ የሚረዳ ተግባራዊ መመሪያ፡

1. የአካባቢ ቁሳቁሶችን መጠቀም፡
- የፕላስቲክ ጠርሙሶችና ቱቦዎች ለግፊትና ፈሳሽ ሙከራዎች
- ሎሚ እና ድንች ለቀላል የኤሌክትሪክ ሰርኪውት (Bio-battery)
- ቀይ ጎመን ለተፈጥሮአዊ የአሲድና ቤዝ መለያ (pH Indicator)

2. የተማሪዎች የደህንነት ጥንቃቄ (Safety Protocol)፡
ምንም እንኳን አካባቢያዊ ቁሳቁሶች ቢሆኑም፣ አይን መከላከያና የእሳት ደህንነት ጥንቃቄዎች በቅድሚያ መተግበር አለባቸው።

3. የሙከራ ሪፖርት አዘገጃጀት፡
ተማሪዎች መላምት (Hypothesis)፣ አሰራር፣ ምልከታ እና ድምዳሜ የያዘ የላብራቶሪ ደብተር እንዲይዙ ማድረግ።`
  },
  {
    id: 'mat-5',
    title: 'የተማሪዎችን ንቁ ተሳትፎና ስነ-ምግባር ማጎልበቻ ስነ-ዘዴዎች (Active Learning & Classroom Management)',
    subject: 'General Pedagogy & CPD (አጠቃላይ ስነ-ዘዴ)',
    gradeLevels: 'All Grades (1 - 12)',
    authorDepartment: 'የትምህርት ጥራትና መምህራን ልማት (Quality Assurance)',
    uploadedAt: '2025-01-20',
    readTimeMinutes: 16,
    downloadCount: 235,
    tags: ['Pedagogy', 'CPD', 'Classroom Management', 'Active Learning'],
    summary: 'የመማር ማስተማር ሂደቱን ተማሪ-ተኮር በማድረግ የክፍል ውስጥ ስነ-ምግባርን እና የተማሪዎችን ተነሳሽነት የማሳደጊያ ዘዴዎች።',
    fullContent: `የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ የመምህራን ቀጣይነት ያለው የሙያ ማሻሻያ (CPD) ይፋዊ መመሪያ፡

1. ተማሪ-ተኮር የመማር ስልቶች (Active Learning Strategies):
- Think-Pair-Share (አስብ-ተጣመር-አጋራ)፡ እያንዳንዱ ተማሪ መልሱን እንዲያስብ 1 ደቂቃ መስጠት፤ ከጎኑ ካለ ጋር እንዲወያይ ማድረግ፤ ከዚያም ለክፍሉ ማካፈል።
- ጂግሶው (Jigsaw Technique)፡ ተማሪዎችን ወደ ልዩ ልዩ ንዑስ ቡድኖች በመክፈል አንዱ ሌላውን እንዲያስተምር ማድረግ።

2. የክፍል ውስጥ መልካም ስነ-ምግባር አጠባበቅ (Positive Discipline):
- አሉታዊ ቅጣቶችን ከመጠቀም ይልቅ በክፍል ጅማሮ ላይ ተማሪዎች በራሳቸው የተስማሙባቸውን የክፍል ደንቦች ግድግዳ ላይ መለጠፍ።
- መልካም ባህሪ ላሳዩ ተማሪዎች የቃል ምስጋና እና ማበረታቻ መስጠት።

3. አካታች ትምህርት (Inclusive Education):
- ልዩ ፍላጎት ያላቸውንና ዝግ ብለው የሚማሩ ተማሪዎችን ወደ ፊት ረድፍ ማስቀመጥና ተጨማሪ የድጋፍ ሰዓት መስጠት።`
  },
  {
    id: 'mat-6',
    title: 'በተፈጥሮ ሳይንስና ባዮሎጂ ትምህርት ውስጥ ሞዴሎችንና ስዕላዊ መግለጫዎችን ማስተማር (Visual Models in Biology)',
    subject: 'Biology (ባዮሎጂ)',
    gradeLevels: 'Grades 9 - 12',
    authorDepartment: 'የተፈጥሮ ሳይንስ ስርዓተ-ትምህርት ቡድን',
    uploadedAt: '2025-01-22',
    readTimeMinutes: 12,
    downloadCount: 118,
    tags: ['Biology', 'Visuals', 'Ecology', 'Cell Structure'],
    summary: 'የሴል አወቃቀር፣ የስነ-ህይወት ዑደት እና የአካባቢ ጥበቃን በቀላሉ በስዕል እና በአካባቢያዊ ሞዴሎች የማስተማር ዘዴዎች።',
    fullContent: `የባዮሎጂ መምህራን ተማሪዎቻቸውን በተግባራዊ እይታ ለማስተማር ሊከተሏቸው የሚገቡ ዋና ዋና አሰራሮች፡

1. የሴል እና የሰውነት አካላት ሞዴሎችን በጭቃና በካርቶን ማዘጋጀት፡
ተማሪዎች እራሳቸው የእፅዋትና የእንስሳት ሴሎችን ባለቀለም ሸክላ (Clay) ተጠቅመው ሲሰሩ ውስብስብ ክፍሎችን በቀላሉ ያስታውሳሉ።

2. የትምህርት ቤት የአትክልት ስፍራን እንደ ላብራቶሪ መጠቀም፡
ስለ ስነ-ህዋሳት (Ecology) እና ፎቶሲንተሲስ በትምህርት ቤቱ ግቢ ውስጥ ያሉትን እፅዋት በቀጥታ በማሳየት ማስተማር።

3. የማይክሮስኮፕ ስላይዶችን በጋራ ማየት፡
ማይክሮስኮፕ እጥረት ባለበት ጊዜ በስማርት ስልክ ካሜራ ማጉያውን አንስቶ በፕሮጀክተር ለክፍሉ ማሳየት።`
  },
  {
    id: 'mat-7',
    title: 'የስነ-ዜጋና ማህበራዊ ጥናት ተማሪዎችን አገር ወዳድና ሰላም ወዳድ ዜጎች የማድረግ ሚና (Civic Education & Peace Building)',
    subject: 'Citizenship & Social Studies (ስነ-ዜጋ)',
    gradeLevels: 'Grades 7 - 12',
    authorDepartment: 'የማህበራዊ ሳይንስና ስነ-ዜጋ ትምህርት ክፍል',
    uploadedAt: '2025-01-25',
    readTimeMinutes: 11,
    downloadCount: 145,
    tags: ['Civics', 'Ethics', 'Peace Building', 'Constitution'],
    summary: 'ተማሪዎች ዲሞክራሲያዊ ባህልን፣ ሰብአዊ መብትን፣ የህግ የበላይነትን እና በውይይት ችግሮችን የመፍታት ክህሎትን እንዲያዳብሩ ማስቻል',
    fullContent: `የስነ-ዜጋ መምህራን በክፍል ውስጥ ሊተገብሯቸው የሚገቡ የሰላምና የዲሞክራሲ ባህል ማጎልበቻዎች፡

1. የሞክ ችሎት እና ክርክር (Mock Trials & Parliamentary Debates):
ተማሪዎች የህግ አወጣጥንና ክርክርን በተግባር እንዲለማመዱ ማድረግ።

2. የበጎ አድራጎት እና የማህበረሰብ አገልግሎት፡
ተማሪዎች በትምህርት ቤቱ ግቢ ውስጥ አቅመ ደካሞችን እንዲደግፉ እና ጽዳት እንዲያካሂዱ ማስተባበር።

3. አለመግባባቶችን በሰላማዊ መንገድ የመፍታት ዘዴ (Conflict Resolution):
ተማሪዎች ቅሬታዎቻቸውን በግልፅነት እና በመደማመጥ የሚፈቱበትን የግጭት አፈታት ስልጠና መስጠት።`
  },
  {
    id: 'mat-8',
    title: 'የቀጣይነት ያለው የተማሪዎች ምዘና (Continuous Assessment) እና የፈተና ጥያቄዎች አዘገጃጀት መመሪያ',
    subject: 'Assessment & Pedagogy (ምዘና እና ስነ-ዘዴ)',
    gradeLevels: 'Grades 7 - 12',
    authorDepartment: 'የትምህርት ምዘናና ፈተናዎች መምሪያ (Shashemene City Education Bureau)',
    uploadedAt: '2025-01-28',
    readTimeMinutes: 18,
    downloadCount: 260,
    tags: ['Assessment', 'Exam Preparation', 'Bloom Taxonomy', 'Continuous Assessment', 'Pedagogy'],
    summary: 'ተከታታይ ምዘናን ውጤታማ በሆነ መንገድ በክፍል ውስጥ የመተግበር፣ የብሉም ታክሶኖሚ የጠበቁ ሚዛናዊ የፈተና ጥያቄዎችን የማዘጋጀት እና ገንቢ ግብረ-መልስ የመስጠት ይፋዊ መመሪያ።',
    fullContent: `የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ - የቀጣይነት ያለው ምዘና እና የፈተና አዘገጃጀት ይፋዊ የስልጠና ሰነድ፡

ምዕራፍ 1፡ የቀጣይነት ያለው ምዘና (Continuous Assessment) ጽንሰ-ሀሳብና ፋይዳ
1.1 የምዘና አይነቶች ልዩነት፡
- መመርመሪያ ምዘና (Diagnostic Assessment)፡ ትምህርቱ ከመጀመሩ በፊት የተማሪዎችን የቀደመ እውቀት (Prior Knowledge) ለመፈተሽ የሚያገለግል።
- ማሻሻያ ምዘና (Formative Assessment)፡ በመማር ማስተማር ሂደት ውስጥ የተማሪዎችን ግንዛቤ ለመፈተሽ፣ የመማር ክፍተቶችን ለመለየትና የማስተማሪያ ስልትን ለማስተካከል የሚረዳ ቀጣይነት ያለው ምዘና።
- ማጠቃለያ ምዘና (Summative Assessment)፡ በሴሚስተር ወይም በዓመት መጨረሻ የተማሪውን አጠቃላይ እውቀትና ክህሎት በመለካት የውጤት ውሳኔ ለመስጠት የሚያገለግል።
1.2 ቀጣይነት ያለው ምዘና የሚካተቱ ክፍሎች፡
የክፍል ውስጥ ተሳትፎ (10%)፣ የቤት ስራና የተግባር ፕሮጀክት (15%)፣ አጫጭር የፈተና ጥያቄዎች/ኩዊዞች (15%) እና ወርሃዊ ፈተናዎች (20%)።

ምዕራፍ 2፡ የብሉም ታክሶኖሚ (Bloom's Taxonomy) ደረጃዎችን የጠበቀ የፈተና አዘገጃጀት
ፈተናዎችን ሲያዘጋጁ ጥያቄዎች በአንድ ደረጃ ብቻ እንዳይወሰኑ በሚከተሉት የብቃት ደረጃዎች መከፋፈል አለባቸው፡
1. ማስታወስና እውቀት (Remembering/Knowledge)፡ ቀመሮችን፣ ፍቺዎችን፣ ታሪካዊ ቀኖችን ማስታወስ (25-30%)።
2. ግንዛቤ (Understanding/Comprehension)፡ ሀሳቦችን በራስ አገላለጽ ማብራራትና ማነፃፀር (25-30%)።
3. ተግባራዊ ማድረግ (Application)፡ የቀሰሙትን እውቀት በአዲስ ሁኔታ ወይም በተግባራዊ ችግር ላይ መተርጎም (20-25%)።
4. ትንተና እና ግምገማ (Analysis & Evaluation)፡ የመረጃ ክፍሎችን መተንተን፣ መንስኤና ውጤትን መለየት፣ ትክክለኛውን ምርጫ መገምገም (15-20%)።

ምዕራፍ 3፡ ደረጃቸውን የጠበቁ ምርጫ ጥያቄዎች (Multiple Choice Questions) አፃፃፍ ህጎች
- ዋናው የጥያቄ ግንድ (Stem) ግልጽ፣ ቀጥተኛና አሻሚ ቃላት የሌሉት መሆን አለበት።
- አማራጮች (Options) በአወቃቀር እና በርዝመት ተመጣጣኝ መሆን አለባቸው።
- አሳሳች አማራጮች (Distractors) ተማሪዎች በተለምዶ የሚሰሩትን ስህተት መሰረት ያደረጉ ምክንያታዊ ምርጫዎች መሆን አለባቸው።
- "ከላይ የተጠቀሱት ሁሉም" ወይም "መልሱ አልተሰጠም" የሚሉ አማራጮችን ከመጠቀም መቆጠብ ይመረጣል።

ምዕራፍ 4፡ ገንቢ ግብረ-መልስ (Constructive Feedback) አሰጣጥ
- ውጤትን ብቻ ከመስጠት ይልቅ ተማሪው ለምን እንደተሳሳተና እንዴት ማሻሻል እንዳለበት ማብራሪያ መስጠት።
- ግብረ-መልስ በወቅቱ (በ 3 ቀናት ውስጥ) ለተማሪው መድረስ አለበት።

ምዕራፍ 5፡ የፈተና ስነ-ምግባር እና የማጭበርበር መከላከያ ስልቶች
- በፈተና ወቅት የተለያዩ የጥያቄ ስሪቶችን (ሞዴል A እና ሞዴል B) መጠቀም ተማሪዎች እርስበርስ እንዳይገለባበጡ ይረዳል።
- በፈተና ወቅት የመቀመጫ አደረጃጀትን ማራራቅና ጥብቅ ክትትል ማድረግ።`
  },
  {
    id: 'mat-9',
    title: 'Tooftaalee Madaallii Walitti Fufaa (Continuous Assessment) fi Qophii Qormaataa Barsiisotaa',
    subject: 'Afaan Oromoo fi Madaallii (Pedagogy & Assessment)',
    gradeLevels: 'Kutaa 7 - 12',
    authorDepartment: 'Kutaa Madaallii fi Qormaata Biiroo Barnootaa Magaalaa Shashamannee',
    uploadedAt: '2025-01-29',
    readTimeMinutes: 17,
    downloadCount: 245,
    tags: ['Afaan Oromoo', 'Madaallii', 'Qormaata', 'Continuous Assessment', 'Pedagogy'],
    summary: 'Biiroon Barnootaa Bulchiinsa Magaalaa Shashamannee qajeelfama qulqullina barnootaa fi qophii qormaataa sadarkaa isaa eeggate ilaalchisee qopheesse.',
    fullContent: `Biiroo Barnootaa Bulchiinsa Magaalaa Shashamannee - Qajeelfama Leenjii Madaallii Walitti Fufaa fi Qophii Qormaata Barsiisotaa:

Boqonnaa 1: Yaada-Rimee Madaallii Walitti Fufaa (Concept of Continuous Assessment)
1.1 Garaagarummaa Madaalliiwwanii:
- Madaallii Adda Baasaa (Diagnostic Assessment): Adeemsi baruu-barsiisuu osoo hin eegalamin dura beekumsa duraanii barattootaa sakatta'uuf kan tajaajiluudha.
- Madaallii Hojiirraa (Formative Assessment): Yeroo baruu-barsiisuu keessatti hanqinaalee hubannoo barattootaa yeroon adda baasuuf, tarsiimoo barsiisaa fooyyessuuf fi barattoota deeggaruuf oola.
- Madaallii Xumuraa (Summative Assessment): Xumura semisteeraa yookiin waggaa irratti qabxii fi sadarkaa barataa murteessuuf kan gaggeeffamuudha.
1.2 Qoodiinsa Qabxii Madaallii Walitti Fufaa:
Hirmaannaa daree (10%), Hojii manaa fi Pirojektii (15%), Qormaata gaggabaaboo/Kwiizii (15%), fi Qormaata Ji'aa (20%).

Boqonnaa 2: Sadarkaalee Bloom (Bloom's Taxonomy) Eeggachuun Gaaffilee Qopheessuu
Barsiisaan gaaffilee qopheessu sadarkaalee yaaduu ol'aanoo fi gadi-aanoo wal-madaalchisuu qaba:
1. Yaadachuu fi Beekumsa (Remembering): Hiika, seera, fi yaad-rimee bu'uuraa yaadachuu (25-30%).
2. Hubannoo (Understanding): Yaada tokko afaan ofiitiin ibsuu, fakkeenya kennuu fi adda baasuu (25-30%).
3. Hojiirra Oolchuu (Application): Beekumsa argatan haala haaraa fi rakkina qabatamaa irratti itti fayyadamuu (20-25%).
4. Xiinxala fi Madaallii (Analysis & Evaluation): Qabiyyee adda qooduun sababaa fi bu'aa wal-simsiisuu, murtii sirrii kennuu (15-20%).

Boqonnaa 3: Qajeelfama Qophii Gaaffilee Filannoo (Multiple Choice Questions)
- Utubaan gaaffichaa (Stem) ifaa, gabaabaa fi iftoomina kan qabu ta'uu qaba.
- Filannoowwan dhiyaatan (Options) dheerinaa fi caasaadhaan wal-fakkaachuu qabu.
- Filannoowwan dogoggoraa (Distractors) dogoggora baratamaa barattoonni uuman irratti hundaa'uu qabu malee wanta hin beekamne ta'uu hin qaban.
- Yaada "Hundi deebiidha" yookiin "Deebiin hin jiru" jedhu fayyadamuu dhiisuun gaariidha.

Boqonnaa 4: Sirna Deebii Ijaarsaa (Constructive Feedback) Kennuu
- Barsiisaan qabxii qofa kennuu osoo hin taane, sababa dogoggorichaa fi haala fooyya'iinsaa ibsuu qaba.
- Deebiin yeroo gabaabaa (guyyoota 3 keessatti) barataaf deebi'uu qaba.

Boqonnaa 5: Eegumsa Qulqullina fi Naamusa Qormaataa
- Haala fakkaattummaa (walfakkeenya) qormaataa ittisuuf moodeelota garaagaraa (Moodeela A fi Moodeela B) qopheessuu.
- Sirna teessuma barattootaa daree keessatti fageenya eegsisuu fi hordoffii cimaa gochuu.`
  },
  {
    id: 'mat-10',
    title: 'ዲጂታል ቴክኖሎጂንና አይሲቲን (ICT) በክፍል ማስተማሪያነት የማዋሃድ ስነ-ዘዴ',
    subject: 'Educational Technology & ICT (የትምህርት ቴክኖሎጂ)',
    gradeLevels: 'Grades 5 - 12',
    authorDepartment: 'የኢንፎርሜሽን ቴክኖሎጂና ዲጂታል ትምህርት ዳይሬክቶሬት',
    uploadedAt: '2025-01-30',
    readTimeMinutes: 14,
    downloadCount: 195,
    tags: ['ICT', 'Digital Learning', 'Educational Technology', 'Pedagogy'],
    summary: 'መምህራን ስማርት ስልኮችን፣ ኮምፒውተሮችን፣ የኦንላይን እና ከመስመር ውጪ (Offline) የትምህርት መተግበሪያዎችን በመጠቀም ትምህርትን ሳቢና ግልፅ የማድረጊያ ስልቶች።',
    fullContent: `የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ - አይሲቲን በማስተማር ስነ-ዘዴ ውስጥ የማዋሃድ ስልጠና፡

ምዕራፍ 1፡ አይሲቲን የማዋሃድ አስፈላጊነት በትምህርት ቤቶች
1.1 ተማሪዎችን በእይታ እና በድምፅ (Multimedia) መደገፍ ረቂቅ የሳይንስና የሂሳብ ሀሳቦችን በቀላሉ እንዲረዱ ያደርጋል።
1.2 በ 21ኛው ክፍለ-ዘመን ተማሪዎች የዲጂታል ክህሎት (Digital Literacy) እንዲኖራቸው የመማሪያ ክፍሉ ቁልፍ ሚና ይጫወታል።

ምዕራፍ 2፡ ከመስመር ውጪ (Offline) የሚሰሩ የዲጂታል ትምህርት መሳሪያዎች
- ፊፕላኔት (PhET Interactive Simulations)፡ የፊዚክስ፣ ኬሚስትሪ እና ባዮሎጂ ላብራቶሪ ሙከራዎችን ያለ ኢንተርኔት በኮምፒውተር ወይም በሞባይል በተግባር ማሳየት።
- ካሊብሪ (Kolibri) እና ኪዊክስ (Kiwix)፡ ኢንተርኔት በሌለበት ሁኔታ የዊኪፔዲያ እና የኦንላይን መማሪያ መጽሐፍትን ማጋራት።
- ጂኦጄብራ (GeoGebra)፡ የጂኦሜትሪ ቅርጾችንና ግራፎችን በቀላሉ መንደፍ።

ምዕራፍ 3፡ የተማሪዎችን ንቁ ተሳትፎ ማሳደግ
- የቪዲዮ ክሊፖችን ማሳየት ብቻ ሳይሆን ከቪዲዮው በፊትና በኋላ ጥያቄዎችን በመጠየቅ ውይይት ማስነሳት።
- ተማሪዎች በቡድን ሆነው በዲጂታል መንገድ ፕሮጀክቶችን (Slides, Digital Reports) እንዲያዘጋጁ ማበረታታት።

ምዕራፍ 4፡ የስነ-ምግባር እና የዲጂታል ደህንነት (Cyber Safety)
- ተማሪዎች ዲጂታል መሳሪያዎችን ለትምህርት ብቻ እንዲጠቀሙ ህግ ማውጣት።
- የመረጃ ትክክለኛነትን የመለየትና የሌሎችን ስራ ያለፍቃድ ያለመጠቀም (Plagiarism Prevention) ግንዛቤ ማስጨበጥ።`
  },
  {
    id: 'mat-11',
    title: 'Geggeessummaa Daree Ammayyaa, Naamusa Gaarii fi Barnoota Hunda-Hammatoo',
    subject: 'Ogummaa Barsiisummaa (General Pedagogy)',
    gradeLevels: 'Kutaa 1 - 12',
    authorDepartment: 'Kutaa Misooma Barsiisotaa fi Qulqullina Barnootaa',
    uploadedAt: '2025-02-01',
    readTimeMinutes: 15,
    downloadCount: 220,
    tags: ['Classroom Management', 'Inclusive Education', 'Positive Discipline', 'Pedagogy'],
    summary: 'Barattoota fedhii addaa qaban hirmaachisuu, adabbii qaamaa malee naamusa gaarii daree keessatti ijaaruu fi kakaumsa barattootaa guddisuu.',
    fullContent: `Biiroo Barnootaa Bulchiinsa Magaalaa Shashamannee - Qajeelfama Geggeessummaa Daree fi Barnoota Hunda-Hammatoo:

Boqonnaa 1: Yaada-Rimee Barnoota Hunda-Hammatoo (Inclusive Education)
1.1 Barattoonni dandeettii, qaamaa, fi haala jireenyaatiin garaagara ta'anis hundi isaanii mirga baruu qabu.
1.2 Barsiisaan barattoota fedhii addaa qaban (kanneen dhageettii, argama, yookiin qaamaa irratti rakkina qaban) adda baasee daree keessatti hirmaachisuu qaba:
- Barattoota argamni isaanii laafaa ta'e fuuldura teessisuu fi barreeffama gabatee bal'isanii barreessuu.
- Barattoota ariitiin baruu hin dandeenyeef yeroo dabalataa fi gargaarsa qeenxee kennuu.

Boqonnaa 2: Naamusa Gaarii fi Qajeelfama Daree (Positive Discipline)
2.1 Adabbii qaamaa fi jecha salphisaa fayyadamuun guutummaatti dhorkaadha.
2.2 Dambiiwwan daree barattoota hirmaachisuun baasuu fi gabatee daree irratti maxxansuu.
2.3 Amala gaarii jajjabeessuu: Barattoota naamusa qabaniif galata afaanii fi beekamtii kennuun warra kaan kakaasuu.

Boqonnaa 3: Hirmaannaa Barattootaa Daree Keessatti Guddisuu
- Tarsiimoo "Think-Pair-Share" (Yaadi - Waliin Qoodi - Dareef Ibsi) hojiirra oolchuu.
- Barattoonni akkaataa gareetiin wal-deeggaranii akka hojjetan gochuu.
- Gaaffilee dandeettii yaaduu barattootaa kakaasan (Open-ended questions) gaafachuu.`
  }
];

export const initialStudentReports: SchoolReportSubmission[] = [
  {
    id: 'rep-1',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    academicYear: '2016 E.C. (2024)',
    semester: 'Semester 1',
    gradeLevel: 'Grade 10 & 12',
    totalStudents: 1240,
    malePassed: 590,
    femalePassed: 575,
    promotedPercentage: 93.9,
    averageScore: 78.4,
    topStudentName: 'ኪያር ከድር (Kiyar Kedir)',
    topStudentScore: 98.6,
    submittedDate: '2024-07-10',
    status: 'approved',
    reviewedBy: 'ወ/ሮ ጫልቱ ደረጀ',
    feedback: 'የላቀ ውጤት ነው፤ የሴት ተማሪዎች የማለፍ ምጣኔ አበረታች ነው።'
  },
  {
    id: 'rep-2',
    schoolId: 'sch-3',
    schoolName: 'ሃዋስ ፕራይቬት አካዳሚ',
    academicYear: '2016 E.C. (2024)',
    semester: 'Semester 1',
    gradeLevel: 'All Grades (1-12)',
    totalStudents: 940,
    malePassed: 470,
    femalePassed: 455,
    promotedPercentage: 98.4,
    averageScore: 86.2,
    topStudentName: 'ሃናን አብዱረህማን (Hanan Abdurahman)',
    topStudentScore: 99.2,
    submittedDate: '2024-07-12',
    status: 'approved',
    reviewedBy: 'አቶ ታምራት አለሙ',
    feedback: 'የትምህርት ጥራት መለኪያዎችን በከፍተኛ ሁኔታ ያሟላ ነው።'
  },
  {
    id: 'rep-3',
    schoolId: 'sch-4',
    schoolName: 'ቁዬራ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    academicYear: '2016 E.C. (2024)',
    semester: 'Semester 1',
    gradeLevel: 'Grade 9 - 12',
    totalStudents: 1980,
    malePassed: 890,
    femalePassed: 860,
    promotedPercentage: 88.3,
    averageScore: 73.1,
    topStudentName: 'ኤልያስ ገመቹ (Elias Gemechu)',
    topStudentScore: 96.4,
    submittedDate: '2024-07-15',
    status: 'approved',
    reviewedBy: 'አቶ ካሳሁን ደበበ',
    feedback: 'በተፈጥሮ ሳይንስ ትምህርቶች ላይ ተጨማሪ ማጠናከሪያ ያስፈልጋል።'
  },
  {
    id: 'rep-4',
    schoolId: 'sch-5',
    schoolName: 'አቦስቶ 1ኛ ደረጃ ትምህርት ቤት',
    academicYear: '2016 E.C. (2024)',
    semester: 'Semester 1',
    gradeLevel: 'Grade 1 - 8',
    totalStudents: 1340,
    malePassed: 540,
    femalePassed: 530,
    promotedPercentage: 79.8,
    averageScore: 68.5,
    topStudentName: 'ዮናስ ታደሰ (Yonas Tadese)',
    topStudentScore: 94.0,
    submittedDate: '2024-07-20',
    status: 'submitted',
    feedback: 'የማለፍ ምጣኔ ማሻሻያ እቅድ ከትምህርት ቤቱ ይጠበቃል።'
  }
];

export const initialBureauStandards: BureauStandardCriteria[] = [
  {
    id: 'std-1',
    category: 'የመምህራን ብቃት (Teacher Competency)',
    criterionTitle: 'የመምህራን የትምህርት ማስረጃ እና ፍቃድ (Licensing)',
    description: 'በሁሉም ት/ቤቶች ያሉ መምህራን በህጋዊ የትምህርት ተቋም የተመረቁና የማስተማር ፈቃድ ያላቸው መሆን አለባቸው።',
    targetStandard: '100% ፈቃድ ያላቸው መምህራን',
    currentCityAverage: '89.4% የተረጋገጠ',
    status: 'on_track'
  },
  {
    id: 'std-2',
    category: 'የመማሪያ ክፍል ምጣኔ (Classroom Ratio)',
    criterionTitle: 'የተማሪ እና ክፍል ምጣኔ (Student-to-Classroom Ratio)',
    description: 'በአንድ የመማሪያ ክፍል ውስጥ ያለው የተማሪ ብዛት ከ 50 ተማሪዎች መብለጥ የለበትም።',
    targetStandard: '1:45 (አማካይ)',
    currentCityAverage: '1:52 (በመንግስት ት/ቤቶች)',
    status: 'attention_needed'
  },
  {
    id: 'std-3',
    category: 'የሳይንስ ላብራቶሪ (Laboratories)',
    criterionTitle: 'የፊዚክስ፣ ኬሚስትሪና ባዮሎጂ ላብራቶሪዎች',
    description: 'እያንዳንዱ የ2ኛ ደረጃ ትምህርት ቤት ቢያንስ 3 የተሟሉ የሳይንስ ላብራቶሪዎች ሊኖሩት ይገባል።',
    targetStandard: '3 የተሟሉ ላቦራቶሪዎች',
    currentCityAverage: '2.4 ላብራቶሪ በአማካይ',
    status: 'on_track'
  },
  {
    id: 'std-4',
    category: 'የተማሪዎች የማለፍ ምጣኔ (Promotion Rate)',
    criterionTitle: 'የክልላዊና ሀገራዊ ፈተናዎች ማለፍ ምጣኔ',
    description: 'የትምህርት ቤቶች አጠቃላይ የማለፍ ምጣኔ ከ 85% በላይ መሆን ይጠበቅበታል።',
    targetStandard: '≥ 85% ማለፍ',
    currentCityAverage: '87.1% በሻሸመኔ ከተማ',
    status: 'on_track'
  },
  {
    id: 'std-5',
    category: 'ቤተ-መጽሐፍትና ዲጂታል ቴክኖሎጂ',
    criterionTitle: 'የኮምፒውተር ቤተ-ሙከራ እና የኢንተርኔት ግንኙነት',
    description: 'የሁለተኛ ደረጃ ትምህርት ቤቶች ቢያንስ 30 ኮምፒውተሮች ያሉት የICT ክፍል ሊኖራቸው ይገባል።',
    targetStandard: '30+ ኮምፒውተሮች',
    currentCityAverage: '18 ኮምፒውተሮች በአማካይ',
    status: 'attention_needed'
  }
];

export const initialStudents: StudentRecord[] = [
  {
    id: 'stu-1',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    studentIdNumber: 'SHAS-ST-2024-001',
    fullName: 'ኪያር ከድር አሊ (Kiyar Kedir Ali)',
    gender: 'M',
    grade: 10,
    section: 'A',
    accessCode: 'STU-KIYAR-01',
    parentName: 'አቶ ከድር አሊ (Ato Kedir Ali)',
    parentPhone: '+251 91 190 8821',
    parentAccessCode: 'PAR-KIYAR-01',
    attendanceRate: 98,
    conduct: 'A',
    rank: 1,
    shift: 'regular_day',
    shiftSchedule: 'ሰኞ - አርብ | 2:00 - 9:00 ቀን (8:00 AM - 3:00 PM)',
    scores: [
      { subject: 'Mathematics (ሂሳብ)', quiz1: 10, quiz2: 10, midExam: 29, finalExam: 49, total: 98, gradeLetter: 'A' },
      { subject: 'English (እንግሊዝኛ)', quiz1: 9, quiz2: 10, midExam: 28, finalExam: 48, total: 95, gradeLetter: 'A' },
      { subject: 'Afaan Oromoo (ኦሮሚኛ)', quiz1: 10, quiz2: 10, midExam: 30, finalExam: 49, total: 99, gradeLetter: 'A' },
      { subject: 'Physics (ፊዚክስ)', quiz1: 10, quiz2: 9, midExam: 29, finalExam: 48, total: 96, gradeLetter: 'A' },
      { subject: 'Chemistry (ኬሚስትሪ)', quiz1: 9, quiz2: 10, midExam: 29, finalExam: 49, total: 97, gradeLetter: 'A' },
      { subject: 'Biology (ባዮሎጂ)', quiz1: 10, quiz2: 10, midExam: 29, finalExam: 49, total: 98, gradeLetter: 'A' },
      { subject: 'Citizenship (ስነ-ዜጋ)', quiz1: 10, quiz2: 10, midExam: 30, finalExam: 50, total: 100, gradeLetter: 'A' }
    ]
  },
  {
    id: 'stu-2',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    studentIdNumber: 'SHAS-ST-2024-002',
    fullName: 'ቢፍቱ ቶሎሳ ጉተማ (Biftu Tolosa Gutema)',
    gender: 'F',
    grade: 10,
    section: 'A',
    accessCode: 'STU-BIFTU-02',
    parentName: 'አቶ ቶሎሳ ጉተማ (Ato Tolosa Gutema)',
    parentPhone: '+251 92 280 7733',
    parentAccessCode: 'PAR-BIFTU-02',
    attendanceRate: 96,
    conduct: 'A',
    rank: 2,
    shift: 'regular_day',
    shiftSchedule: 'ሰኞ - አርብ | 2:00 - 9:00 ቀን (8:00 AM - 3:00 PM)',
    scores: [
      { subject: 'Mathematics (ሂሳብ)', quiz1: 9, quiz2: 9, midExam: 28, finalExam: 47, total: 93, gradeLetter: 'A' },
      { subject: 'English (እንግሊዝኛ)', quiz1: 10, quiz2: 10, midExam: 29, finalExam: 49, total: 98, gradeLetter: 'A' },
      { subject: 'Afaan Oromoo (ኦሮሚኛ)', quiz1: 10, quiz2: 10, midExam: 30, finalExam: 48, total: 98, gradeLetter: 'A' },
      { subject: 'Physics (ፊዚክስ)', quiz1: 9, quiz2: 9, midExam: 27, finalExam: 46, total: 91, gradeLetter: 'A' },
      { subject: 'Chemistry (ኬሚስትሪ)', quiz1: 9, quiz2: 9, midExam: 28, finalExam: 47, total: 93, gradeLetter: 'A' },
      { subject: 'Biology (ባዮሎጂ)', quiz1: 10, quiz2: 9, midExam: 28, finalExam: 48, total: 95, gradeLetter: 'A' },
      { subject: 'Citizenship (ስነ-ዜጋ)', quiz1: 10, quiz2: 10, midExam: 29, finalExam: 48, total: 97, gradeLetter: 'A' }
    ]
  },
  {
    id: 'stu-3',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    studentIdNumber: 'SHAS-ST-2024-003',
    fullName: 'ናሆም ዳንኤል ታደሰ (Nahom Daniel Tadese)',
    gender: 'M',
    grade: 10,
    section: 'A',
    accessCode: 'STU-NAHOM-03',
    parentName: 'አቶ ዳንኤል ታደሰ (Ato Daniel Tadese)',
    parentPhone: '+251 93 370 6644',
    parentAccessCode: 'PAR-NAHOM-03',
    attendanceRate: 92,
    conduct: 'B',
    rank: 3,
    shift: 'regular_day',
    shiftSchedule: 'ሰኞ - አርብ | 2:00 - 9:00 ቀን (8:00 AM - 3:00 PM)',
    scores: [
      { subject: 'Mathematics (ሂሳብ)', quiz1: 8, quiz2: 9, midExam: 25, finalExam: 44, total: 86, gradeLetter: 'A' },
      { subject: 'English (እንግሊዝኛ)', quiz1: 9, quiz2: 8, midExam: 26, finalExam: 45, total: 88, gradeLetter: 'A' },
      { subject: 'Afaan Oromoo (ኦሮሚኛ)', quiz1: 9, quiz2: 9, midExam: 27, finalExam: 46, total: 91, gradeLetter: 'A' },
      { subject: 'Physics (ፊዚክስ)', quiz1: 8, quiz2: 8, midExam: 24, finalExam: 42, total: 82, gradeLetter: 'B' },
      { subject: 'Chemistry (ኬሚስትሪ)', quiz1: 8, quiz2: 8, midExam: 25, finalExam: 43, total: 84, gradeLetter: 'B' },
      { subject: 'Biology (ባዮሎጂ)', quiz1: 9, quiz2: 9, midExam: 26, finalExam: 45, total: 89, gradeLetter: 'A' },
      { subject: 'Citizenship (ስነ-ዜጋ)', quiz1: 9, quiz2: 9, midExam: 27, finalExam: 45, total: 90, gradeLetter: 'A' }
    ]
  },
  // =================== የማታ ተማሪዎች (NIGHT SHIFT STUDENTS) ===================
  {
    id: 'stu-night-1',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    studentIdNumber: 'SHAS-NG10-001',
    fullName: 'አቶ ሁሴን አብዱላሂ ኡመር (Hussein Abdullahi Umer)',
    gender: 'M',
    grade: 10,
    section: 'N1',
    accessCode: 'STU-HUSSEIN-N1',
    parentName: 'ወ/ሮ ፋጡማ ሁሴን (ባለቤት / ተጠሪ)',
    parentPhone: '+251 91 140 2299',
    parentAccessCode: 'PAR-HUSSEIN-N1',
    attendanceRate: 94,
    conduct: 'A',
    rank: 1,
    shift: 'night_shift',
    nightProgramType: 'secondary_night',
    occupation: 'የጅምላ ንግድ ስራ አስኪያጅ (Wholesale Merchant)',
    workplace: 'ሻሸመኔ አውቶቡስ ተራ የንግድ ማዕከል',
    shiftSchedule: 'ሰኞ - አርብ | 11:30 - 3:00 ማታ (5:30 - 9:00 PM)',
    emergencyContact: '+251 91 140 2299 (ወ/ሮ ፋጡማ)',
    enrollmentYear: '2016/2017 ዓ.ም',
    scores: [
      { subject: 'Mathematics (ሂሳብ)', quiz1: 9, quiz2: 10, midExam: 28, finalExam: 47, total: 94, gradeLetter: 'A' },
      { subject: 'English (እንግሊዝኛ)', quiz1: 9, quiz2: 9, midExam: 27, finalExam: 46, total: 91, gradeLetter: 'A' },
      { subject: 'Afaan Oromoo (ኦሮሚኛ)', quiz1: 10, quiz2: 9, midExam: 29, finalExam: 48, total: 96, gradeLetter: 'A' },
      { subject: 'Physics (ፊዚክስ)', quiz1: 8, quiz2: 9, midExam: 26, finalExam: 44, total: 87, gradeLetter: 'A' },
      { subject: 'Chemistry (ኬሚስትሪ)', quiz1: 9, quiz2: 8, midExam: 25, finalExam: 45, total: 87, gradeLetter: 'A' },
      { subject: 'Biology (ባዮሎጂ)', quiz1: 9, quiz2: 9, midExam: 27, finalExam: 46, total: 91, gradeLetter: 'A' },
      { subject: 'Citizenship (ስነ-ዜጋ)', quiz1: 10, quiz2: 10, midExam: 29, finalExam: 49, total: 98, gradeLetter: 'A' }
    ]
  },
  {
    id: 'stu-night-2',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    studentIdNumber: 'SHAS-NG11-002',
    fullName: 'ወ/ሪት ረድኤት ተፈራ ሞገስ (Rediet Tefera Moges)',
    gender: 'F',
    grade: 11,
    section: 'N1',
    stream: 'Social',
    accessCode: 'STU-REDIET-N1',
    parentName: 'አቶ ተፈራ ሞገስ (ወላጅ አባት)',
    parentPhone: '+251 92 355 8812',
    parentAccessCode: 'PAR-REDIET-N1',
    attendanceRate: 96,
    conduct: 'A',
    rank: 1,
    shift: 'night_shift',
    nightProgramType: 'secondary_night',
    occupation: 'የመንግስት ሰራተኛ - የሂሳብ ባለሙያ (Civil Servant)',
    workplace: 'ሻሸመኔ ከተማ ገቢዎች ባለስልጣን ጽ/ቤት',
    shiftSchedule: 'ሰኞ - አርብ | 11:30 - 3:00 ማታ (5:30 - 9:00 PM)',
    emergencyContact: '+251 92 355 8812',
    enrollmentYear: '2016/2017 ዓ.ም',
    scores: [
      { subject: 'English (እንግሊዝኛ)', quiz1: 10, quiz2: 10, midExam: 29, finalExam: 49, total: 98, gradeLetter: 'A' },
      { subject: 'Economics (ኢኮኖሚክስ)', quiz1: 10, quiz2: 9, midExam: 28, finalExam: 48, total: 95, gradeLetter: 'A' },
      { subject: 'History (ታሪክ)', quiz1: 9, quiz2: 10, midExam: 28, finalExam: 47, total: 94, gradeLetter: 'A' },
      { subject: 'Geography (ጂኦግራፊ)', quiz1: 9, quiz2: 9, midExam: 27, finalExam: 46, total: 91, gradeLetter: 'A' },
      { subject: 'General Math (ሂሳብ)', quiz1: 8, quiz2: 9, midExam: 26, finalExam: 44, total: 87, gradeLetter: 'A' },
      { subject: 'Afaan Oromoo (ኦሮሚኛ)', quiz1: 10, quiz2: 10, midExam: 29, finalExam: 48, total: 97, gradeLetter: 'A' },
      { subject: 'Citizenship (ስነ-ዜጋ)', quiz1: 10, quiz2: 10, midExam: 30, finalExam: 49, total: 99, gradeLetter: 'A' }
    ]
  },
  {
    id: 'stu-night-3',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    studentIdNumber: 'SHAS-NG12-003',
    fullName: 'አቶ ገመቹ በቀለ ዲዳ (Gemechu Bekele Dida)',
    gender: 'M',
    grade: 12,
    section: 'N1',
    stream: 'Natural',
    accessCode: 'STU-GEMECHU-N1',
    parentName: 'ወ/ሮ ጫልቱ ገመቹ (ባለቤት / ተጠሪ)',
    parentPhone: '+251 91 677 3421',
    parentAccessCode: 'PAR-GEMECHU-N1',
    attendanceRate: 92,
    conduct: 'A',
    rank: 1,
    shift: 'night_shift',
    nightProgramType: 'secondary_night',
    occupation: 'የጤና ኤክስቴንሽን ባለሙያ (Health Extension Officer)',
    workplace: 'ሻሸመኔ ቡልቻና ጤና ጣቢያ',
    shiftSchedule: 'ሰኞ - አርብ | 11:30 - 3:00 ማታ (5:30 - 9:00 PM)',
    emergencyContact: '+251 91 677 3421',
    enrollmentYear: '2016/2017 ዓ.ም',
    scores: [
      { subject: 'Physics (ፊዚክስ)', quiz1: 9, quiz2: 9, midExam: 27, finalExam: 46, total: 91, gradeLetter: 'A' },
      { subject: 'Chemistry (ኬሚስትሪ)', quiz1: 9, quiz2: 9, midExam: 28, finalExam: 47, total: 93, gradeLetter: 'A' },
      { subject: 'Biology (ባዮሎጂ)', quiz1: 10, quiz2: 10, midExam: 29, finalExam: 49, total: 98, gradeLetter: 'A' },
      { subject: 'Mathematics (ሂሳብ)', quiz1: 8, quiz2: 9, midExam: 26, finalExam: 45, total: 88, gradeLetter: 'A' },
      { subject: 'English (እንግሊዝኛ)', quiz1: 9, quiz2: 8, midExam: 26, finalExam: 44, total: 87, gradeLetter: 'A' },
      { subject: 'Afaan Oromoo (ኦሮሚኛ)', quiz1: 10, quiz2: 9, midExam: 28, finalExam: 47, total: 94, gradeLetter: 'A' },
      { subject: 'Citizenship (ስነ-ዜጋ)', quiz1: 9, quiz2: 10, midExam: 28, finalExam: 47, total: 94, gradeLetter: 'A' }
    ]
  },
  {
    id: 'stu-night-4',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    studentIdNumber: 'SHAS-NG09-004',
    fullName: 'ወ/ሮ ፋጡማ አደም ከድር (Fatuma Adem Kedir)',
    gender: 'F',
    grade: 9,
    section: 'N1',
    accessCode: 'STU-FATUMA-N1',
    parentName: 'አቶ አደም ከድር (ወላጅ)',
    parentPhone: '+251 93 411 9088',
    parentAccessCode: 'PAR-FATUMA-N1',
    attendanceRate: 95,
    conduct: 'A',
    rank: 1,
    shift: 'night_shift',
    nightProgramType: 'secondary_night',
    occupation: 'የግል ስራ ፈጣሪና ዲዛይነር (Tailor & Entrepreneur)',
    workplace: 'አቦስቶ ሴቶች ንግድ ህንፃ',
    shiftSchedule: 'ሰኞ - አርብ | 11:30 - 3:00 ማታ (5:30 - 9:00 PM)',
    emergencyContact: '+251 93 411 9088',
    enrollmentYear: '2016/2017 ዓ.ም',
    scores: [
      { subject: 'Mathematics (ሂሳብ)', quiz1: 9, quiz2: 9, midExam: 27, finalExam: 45, total: 90, gradeLetter: 'A' },
      { subject: 'English (እንግሊዝኛ)', quiz1: 9, quiz2: 9, midExam: 26, finalExam: 46, total: 90, gradeLetter: 'A' },
      { subject: 'General Science (አጠቃላይ ሳይንስ)', quiz1: 9, quiz2: 8, midExam: 26, finalExam: 45, total: 88, gradeLetter: 'A' },
      { subject: 'Social Studies (ህብረተሰብ ጥናት)', quiz1: 10, quiz2: 9, midExam: 28, finalExam: 47, total: 94, gradeLetter: 'A' },
      { subject: 'Afaan Oromoo (ኦሮሚኛ)', quiz1: 10, quiz2: 10, midExam: 29, finalExam: 48, total: 97, gradeLetter: 'A' },
      { subject: 'Citizenship (ስነ-ዜጋ)', quiz1: 10, quiz2: 10, midExam: 29, finalExam: 48, total: 97, gradeLetter: 'A' }
    ]
  },
  {
    id: 'stu-night-5',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    studentIdNumber: 'SHAS-NG10-005',
    fullName: 'አቶ ዮሴፍ አበራ ደስታ (Yosef Abera Desta)',
    gender: 'M',
    grade: 10,
    section: 'N2',
    accessCode: 'STU-YOSEF-N2',
    parentName: 'አቶ አበራ ደስታ (አባት / ተጠሪ)',
    parentPhone: '+251 91 188 4590',
    parentAccessCode: 'PAR-YOSEF-N2',
    attendanceRate: 91,
    conduct: 'A',
    rank: 2,
    shift: 'night_shift',
    nightProgramType: 'remedial',
    occupation: 'የኤሌክትሪክ ቴክኒሻን (Senior Electrician)',
    workplace: 'ሻሸመኔ ኢንዱስትሪ መንደር',
    shiftSchedule: 'ሰኞ - አርብ | 11:30 - 3:00 ማታ (5:30 - 9:00 PM)',
    emergencyContact: '+251 91 188 4590',
    enrollmentYear: '2016/2017 ዓ.ም',
    scores: [
      { subject: 'Mathematics (ሂሳብ)', quiz1: 8, quiz2: 8, midExam: 25, finalExam: 43, total: 84, gradeLetter: 'B' },
      { subject: 'English (እንግሊዝኛ)', quiz1: 8, quiz2: 9, midExam: 26, finalExam: 44, total: 87, gradeLetter: 'A' },
      { subject: 'Physics (ፊዚክስ)', quiz1: 9, quiz2: 9, midExam: 28, finalExam: 47, total: 93, gradeLetter: 'A' },
      { subject: 'Chemistry (ኬሚስትሪ)', quiz1: 8, quiz2: 8, midExam: 24, finalExam: 41, total: 81, gradeLetter: 'B' },
      { subject: 'Biology (ባዮሎጂ)', quiz1: 8, quiz2: 9, midExam: 25, finalExam: 43, total: 85, gradeLetter: 'A' },
      { subject: 'Afaan Oromoo (ኦሮሚኛ)', quiz1: 9, quiz2: 9, midExam: 27, finalExam: 46, total: 91, gradeLetter: 'A' },
      { subject: 'Citizenship (ስነ-ዜጋ)', quiz1: 9, quiz2: 9, midExam: 27, finalExam: 46, total: 91, gradeLetter: 'A' }
    ]
  }
];

export const initialNightClassSchedule: NightClassScheduleItem[] = [
  {
    id: 'ncs-1',
    periodNumber: 1,
    startTime: '11:30 ማታ',
    endTime: '12:15 ማታ',
    standardTime: '5:30 PM - 6:15 PM',
    grade: 10,
    section: 'N1',
    subject: 'Mathematics (ሂሳብ)',
    teacherName: 'መ/ር በፈቃዱ ጥላሁን (ሂሳብ)',
    classroomNumber: 'ክፍል 14 (ማታ)',
    daysOfWeek: 'ሰኞ፣ ረቡዕ፣ አርብ'
  },
  {
    id: 'ncs-2',
    periodNumber: 2,
    startTime: '12:20 ማታ',
    endTime: '1:05 ማታ',
    standardTime: '6:20 PM - 7:05 PM',
    grade: 10,
    section: 'N1',
    subject: 'Physics (ፊዚክስ)',
    teacherName: 'መ/ር ቶሎሳ ጉተማ (ፊዚክስ)',
    classroomNumber: 'ክፍል 14 (ማታ)',
    daysOfWeek: 'ሰኞ፣ ረቡዕ፣ አርብ'
  },
  {
    id: 'ncs-3',
    periodNumber: 3,
    startTime: '1:25 ማታ',
    endTime: '2:10 ማታ',
    standardTime: '7:25 PM - 8:10 PM',
    grade: 10,
    section: 'N1',
    subject: 'English (እንግሊዝኛ)',
    teacherName: 'መ/ርት አሚና ኑሪ (እንግሊዝኛ)',
    classroomNumber: 'ክፍል 14 (ማታ)',
    daysOfWeek: 'ማክሰኞ፣ ሐሙስ'
  },
  {
    id: 'ncs-4',
    periodNumber: 4,
    startTime: '2:15 ማታ',
    endTime: '3:00 ማታ',
    standardTime: '8:15 PM - 9:00 PM',
    grade: 10,
    section: 'N1',
    subject: 'Afaan Oromoo (ኦሮሚኛ)',
    teacherName: 'መ/ርት ሰላማዊት ታደሰ (Afaan Oromoo)',
    classroomNumber: 'ክፍል 14 (ማታ)',
    daysOfWeek: 'ሰኞ - አርብ'
  },
  {
    id: 'ncs-5',
    periodNumber: 1,
    startTime: '11:30 ማታ',
    endTime: '12:15 ማታ',
    standardTime: '5:30 PM - 6:15 PM',
    grade: 11,
    section: 'N1',
    subject: 'Economics (ኢኮኖሚክስ)',
    teacherName: 'መ/ር ደርቤ ገለታ (ማህበራዊ ሳይንስ)',
    classroomNumber: 'ክፍል 16 (ማታ)',
    daysOfWeek: 'ሰኞ፣ ረቡዕ፣ አርብ'
  },
  {
    id: 'ncs-6',
    periodNumber: 2,
    startTime: '12:20 ማታ',
    endTime: '1:05 ማታ',
    standardTime: '6:20 PM - 7:05 PM',
    grade: 12,
    section: 'N1',
    subject: 'Biology & Chemistry (የተፈጥሮ ሳይንስ)',
    teacherName: 'መ/ር ከድር አህመድ (ኬሚስትሪ)',
    classroomNumber: 'ክፍል 18 (ማታ)',
    daysOfWeek: 'ማክሰኞ፣ ሐሙስ'
  }
];

export const initialStakeholders: SchoolStakeholder[] = [
  {
    id: 'stk-1',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    fullName: 'አቶ ጉተማ ዋቆ (Ato Gutema Wako)',
    gender: 'M',
    role: 'principal',
    roleCustomTitle: 'ዋና ርዕሰ መምህር / ዳይሬክተር (Head Principal)',
    officeOrDepartment: 'የትምህርት ቤት ዋና አስተዳደር ጽ/ቤት (Principal Office)',
    phone: '+251 46 110 2420',
    email: 'gutema.principal@shasheducation.gov.et',
    faydaNumber: 'FAYDA-9481-2049-5820',
    faydaVerified: true,
    credentials: [
      {
        id: 'crd-1',
        level: 'Masters',
        fieldOfStudy: 'Educational Leadership & Management (የትምህርት አመራርና አስተዳደር)',
        institution: 'Addis Ababa University (አዲስ አበባ ዩኒቨርሲቲ)',
        graduationYear: 2014,
        credentialDocNumber: 'AAU-MA-EDU-2014-9912'
      },
      {
        id: 'crd-2',
        level: 'Degree',
        fieldOfStudy: 'B.Ed in Pedagogical Sciences & History (ስነ-ትምህርት እና ታሪክ)',
        institution: 'Hawassa University (ሀዋሳ ዩኒቨርሲቲ)',
        graduationYear: 2004,
        credentialDocNumber: 'HU-BED-2004-3310'
      },
      {
        id: 'crd-3',
        level: 'License',
        fieldOfStudy: 'Senior Educational Leader Statutory License (የከፍተኛ ትምህርት አመራር ፈቃድ)',
        institution: 'Ministry of Education Ethiopia (ትምህርት ሚኒስቴር)',
        graduationYear: 2016,
        credentialDocNumber: 'MOE-LIC-LEAD-2016-8840'
      }
    ],
    professionalLicenseNumber: 'ETH-OR-PRIN-2016-0042',
    experienceYears: 20,
    accessCode: 'DIR-SHAS-01',
    certificateNumber: 'SHAS-STK-CERT-2024-001',
    status: 'active',
    registeredDate: '2024-09-01'
  },
  {
    id: 'stk-2',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    fullName: 'ወ/ሮ ሙሉእመቤት ደረሰ (W/ro Muluemebet Derese)',
    gender: 'F',
    role: 'head_librarian',
    roleCustomTitle: 'የትምህርት ቤት ቤተ-መጻሕፍት ኃላፊ እና የመረጃ ባለሙያ (Chief School Librarian)',
    officeOrDepartment: 'የትምህርት ቤተ-መጻሕፍት እና የመረጃ ማዕከል ጽ/ቤት (Library & Info Center)',
    phone: '+251 91 184 9201',
    email: 'mulu.library@shasheducation.gov.et',
    faydaNumber: 'FAYDA-8201-4491-1182',
    faydaVerified: true,
    credentials: [
      {
        id: 'crd-4',
        level: 'Degree',
        fieldOfStudy: 'B.Sc in Information & Library Science (የኢንፎርሜሽን እና ላይብረሪ ሳይንስ)',
        institution: 'Jimma University (ጅማ ዩኒቨርሲቲ)',
        graduationYear: 2017,
        credentialDocNumber: 'JU-BSC-ILS-2017-7429'
      },
      {
        id: 'crd-5',
        level: 'Diploma',
        fieldOfStudy: 'Diploma in Archival Science & Digital Records (ዲጂታል ሰነድ አያያዝ)',
        institution: 'Adama Science & Technology University (አዳማ ሳይንስና ቴክኖሎጂ)',
        graduationYear: 2013,
        credentialDocNumber: 'ASTU-DIP-2013-1029'
      },
      {
        id: 'crd-6',
        level: 'Certificate',
        fieldOfStudy: 'Certified National E-Library & Cataloging System (ብሔራዊ የኢ-ላይብረሪ ስርዓት)',
        institution: 'Ethiopian National Archives and Library Agency (ወመዘክር)',
        graduationYear: 2021,
        credentialDocNumber: 'NALA-CERT-2021-049'
      }
    ],
    professionalLicenseNumber: 'ETH-OR-LIB-2017-1093',
    experienceYears: 11,
    accessCode: 'LIB-MULU-02',
    certificateNumber: 'SHAS-STK-CERT-2024-002',
    status: 'active',
    registeredDate: '2024-09-02'
  },
  {
    id: 'stk-3',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    fullName: 'መ/ር በፈቃዱ ጥላሁን (Befekadu Tilahun)',
    gender: 'M',
    role: 'vice_principal_academic',
    roleCustomTitle: 'ምክትል ርዕሰ መምህር (አካዳሚክ) እና የሂሳብ ት/ክፍል ኃላፊ',
    officeOrDepartment: 'አካዳሚክ ጉዳዮች እና ስርአተ-ትምህርት ጽ/ቤት (Academic Affairs)',
    phone: '+251 91 688 2341',
    email: 'befekadu.acad@shasheducation.gov.et',
    faydaNumber: 'FAYDA-5519-3382-7740',
    faydaVerified: true,
    credentials: [
      {
        id: 'crd-7',
        level: 'Masters',
        fieldOfStudy: 'M.Sc in Mathematics Education (የሂሳብ ማስተማር ሳይንስ)',
        institution: 'Haramaya University (ሀረማያ ዩኒቨርሲቲ)',
        graduationYear: 2018,
        credentialDocNumber: 'HRU-MSC-MATH-2018-883'
      },
      {
        id: 'crd-8',
        level: 'Degree',
        fieldOfStudy: 'B.Sc in Mathematics (ሂሳብ ሳይንስ)',
        institution: 'Arba Minch University (አርባ ምንጭ ዩኒቨርሲቲ)',
        graduationYear: 2011,
        credentialDocNumber: 'AMU-BSC-2011-4402'
      },
      {
        id: 'crd-9',
        level: 'License',
        fieldOfStudy: 'Professional Teacher License - Advanced Secondary (ከፍተኛ መምህርነት)',
        institution: 'Ministry of Education Ethiopia (ትምህርት ሚኒስቴር)',
        graduationYear: 2019,
        credentialDocNumber: 'MOE-TCH-LIC-2019-901'
      }
    ],
    professionalLicenseNumber: 'ETH-OR-TCH-2019-4820',
    experienceYears: 13,
    accessCode: 'TCH-BEFE-01',
    certificateNumber: 'SHAS-STK-CERT-2024-003',
    status: 'active',
    registeredDate: '2024-09-02'
  },
  {
    id: 'stk-4',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    fullName: 'መ/ርት ሰላማዊት ታደሰ (Selamawit Tadese)',
    gender: 'F',
    role: 'department_head',
    roleCustomTitle: 'የቋንቋዎች ትምህርት ክፍል ኃላፊ (Afaan Oromoo & Languages)',
    officeOrDepartment: 'የቋንቋዎች ዲፓርትመንት እና የተማሪዎች ምክር ጽ/ቤት (Languages & Counseling)',
    phone: '+251 92 345 6789',
    email: 'selamawit.oromo@shasheducation.gov.et',
    faydaNumber: 'FAYDA-7730-1194-8832',
    faydaVerified: true,
    credentials: [
      {
        id: 'crd-10',
        level: 'Masters',
        fieldOfStudy: 'MA in Afaan Oromoo Literature & Linguistics (ስነ-ፅሁፍና ስነ-ልሳን)',
        institution: 'Addis Ababa University (አዲስ አበባ ዩኒቨርሲቲ)',
        graduationYear: 2019,
        credentialDocNumber: 'AAU-MA-AFAAN-2019-204'
      },
      {
        id: 'crd-11',
        level: 'Degree',
        fieldOfStudy: 'B.Ed in Afaan Oromoo Education (ቋንቋ ማስተማር)',
        institution: 'Hawassa University (ሀዋሳ ዩኒቨርሲቲ)',
        graduationYear: 2012,
        credentialDocNumber: 'HU-BED-LANG-2012-771'
      }
    ],
    professionalLicenseNumber: 'ETH-OR-TCH-2020-3310',
    experienceYears: 12,
    accessCode: 'TCH-SELA-02',
    certificateNumber: 'SHAS-STK-CERT-2024-004',
    status: 'active',
    registeredDate: '2024-09-02'
  },
  {
    id: 'stk-5',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    fullName: 'አቶ ከድር ኡመር (Ato Kedir Umer)',
    gender: 'M',
    role: 'lab_technician',
    roleCustomTitle: 'የሳይንስ እና ቴክኖሎጂ ላብራቶሪ ዋና ባለሙያ (Chief Laboratory Specialist)',
    officeOrDepartment: 'ፊዚክስ፣ ኬሚስትሪ እና ባዮሎጂ ላብራቶሪ (Science Laboratories)',
    phone: '+251 94 482 1092',
    email: 'kedir.lab@shasheducation.gov.et',
    faydaNumber: 'FAYDA-3391-7729-4410',
    faydaVerified: true,
    credentials: [
      {
        id: 'crd-12',
        level: 'Degree',
        fieldOfStudy: 'B.Sc in Applied Chemistry & Laboratory Techniques (የላብራቶሪ ኬሚስትሪ)',
        institution: 'Madda Walabu University (መዳ ወላቡ ዩኒቨርሲቲ)',
        graduationYear: 2018,
        credentialDocNumber: 'MWU-BSC-2018-5019'
      },
      {
        id: 'crd-13',
        level: 'Diploma',
        fieldOfStudy: 'Diploma in School Science Lab Safety (የላብራቶሪ ደህንነት እና ጥበቃ)',
        institution: 'Hawassa TVET College (ሀዋሳ ቴክኒክና ሙያ)',
        graduationYear: 2014,
        credentialDocNumber: 'HTVET-2014-9102'
      }
    ],
    professionalLicenseNumber: 'ETH-OR-LAB-2018-6629',
    experienceYears: 10,
    accessCode: 'LAB-KEDIR-05',
    certificateNumber: 'SHAS-STK-CERT-2024-005',
    status: 'active',
    registeredDate: '2024-09-03'
  },
  {
    id: 'stk-6',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    fullName: 'አቶ ከድር አሊ (Ato Kedir Ali)',
    gender: 'M',
    role: 'pta_chair',
    roleCustomTitle: 'የወላጅ መምህራን ህብረት (PTA) ሰብሳቢ እና የማህበረሰብ ተወካይ',
    officeOrDepartment: 'የወላጅ መምህራን ማህበር እና ማህበረሰብ ግንኙነት ጽ/ቤት (PTA Office)',
    phone: '+251 91 184 9201',
    email: 'kedir.pta@shasheducation.gov.et',
    faydaNumber: 'FAYDA-6629-8810-3329',
    faydaVerified: true,
    credentials: [
      {
        id: 'crd-14',
        level: 'Degree',
        fieldOfStudy: 'BA in Public Administration & Community Leadership (ህዝብ አስተዳደር)',
        institution: 'Rift Valley University (ሪፍት ቫሊ ዩኒቨርሲቲ)',
        graduationYear: 2010,
        credentialDocNumber: 'RVU-BA-2010-8819'
      }
    ],
    professionalLicenseNumber: 'ETH-OR-PTA-2022-004',
    experienceYears: 8,
    accessCode: 'PAR-KIYAR-01',
    certificateNumber: 'SHAS-STK-CERT-2024-006',
    status: 'active',
    registeredDate: '2024-09-05'
  },
  {
    id: 'stk-7',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    fullName: 'ዶ/ር ተስፋዬ በቀለ (Dr. Tesfaye Bekele)',
    gender: 'M',
    role: 'school_owner_board',
    roleCustomTitle: 'የትምህርት ቤት የበላይ ጠባቂ ቦርድ ሰብሳቢ / ባለቤት (Board Chair & Founder)',
    officeOrDepartment: 'የትምህርት ቤት ቦርድ አመራር እና ስትራቴጂክ አስተዳደር (Board Room)',
    phone: '+251 91 123 4567',
    email: 'board.chair@shasheducation.gov.et',
    faydaNumber: 'FAYDA-1190-4420-9981',
    faydaVerified: true,
    credentials: [
      {
        id: 'crd-15',
        level: 'PhD',
        fieldOfStudy: 'Educational Policy & Institutional Development (የትምህርት ፖሊሲ ዶክትሬት)',
        institution: 'Addis Ababa University (አዲስ አበባ ዩኒቨርሲቲ)',
        graduationYear: 2012,
        credentialDocNumber: 'AAU-PHD-EDU-2012-008'
      },
      {
        id: 'crd-16',
        level: 'Masters',
        fieldOfStudy: 'MBA in Organizational Management (የድርጅት አመራር ማስተርስ)',
        institution: 'Hawassa University (ሀዋሳ ዩኒቨርሲቲ)',
        graduationYear: 2005,
        credentialDocNumber: 'HU-MBA-2005-119'
      }
    ],
    professionalLicenseNumber: 'ETH-OR-BRD-2015-001',
    experienceYears: 24,
    accessCode: 'OWN-SHAS-01',
    certificateNumber: 'SHAS-STK-CERT-2024-007',
    status: 'active',
    registeredDate: '2024-08-20'
  },
  {
    id: 'stk-8',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    fullName: 'ወ/ሮ ሰላማዊት አበራ (Selamawit Abera)',
    gender: 'F',
    role: 'registrar_finance',
    roleCustomTitle: 'ዋና ሒሳብ ሹም እና የፋይናንስ ኃላፊ (Chief School Accountant)',
    officeOrDepartment: 'የፋይናንስና ክፍያ አስተዳደር ጽ/ቤት (Finance & Treasury)',
    phone: '+251 92 881 2290',
    email: 'finance.sec@shasheducation.gov.et',
    faydaNumber: 'FAYDA-4402-9918-3321',
    faydaVerified: true,
    credentials: [
      {
        id: 'crd-17',
        level: 'Degree',
        fieldOfStudy: 'BA in Accounting & Finance (አካውንቲንግ እና ፋይናንስ)',
        institution: 'Rift Valley University (ሪፍት ቫሊ ዩኒቨርሲቲ)',
        graduationYear: 2016,
        credentialDocNumber: 'RVU-ACC-2016-5591'
      },
      {
        id: 'crd-18',
        level: 'Certificate',
        fieldOfStudy: 'Certified Public Financial Management & Electronic Billing (ታክስና ፋይናንስ)',
        institution: 'Ministry of Finance Ethiopia (ገንዘብ ሚኒስቴር)',
        graduationYear: 2020,
        credentialDocNumber: 'MOF-CPFM-2020-882'
      }
    ],
    professionalLicenseNumber: 'ETH-OR-ACC-2017-0921',
    experienceYears: 9,
    accessCode: 'ACC-SHAS-01',
    certificateNumber: 'SHAS-STK-CERT-2024-008',
    status: 'active',
    registeredDate: '2024-09-01'
  },
  {
    id: 'stk-9',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    fullName: 'አቶ ዳንኤል ንጉሴ (Daniel Nigussie)',
    gender: 'M',
    role: 'registrar_finance',
    roleCustomTitle: 'የተማሪዎች ቅበላ እና ሰነድ ሬጅስትራር (Head School Registrar)',
    officeOrDepartment: 'ሬጅስትራር እና የተማሪዎች መዝገብ ጽ/ቤት (Registrar Office)',
    phone: '+251 93 119 4488',
    email: 'registrar.sec@shasheducation.gov.et',
    faydaNumber: 'FAYDA-2291-7781-4409',
    faydaVerified: true,
    credentials: [
      {
        id: 'crd-19',
        level: 'Degree',
        fieldOfStudy: 'B.Sc in Information Systems & Student Records (ኢንፎርሜሽን ሲስተም)',
        institution: 'Haramaya University (ሀረማያ ዩኒቨርሲቲ)',
        graduationYear: 2017,
        credentialDocNumber: 'HRU-IS-2017-4401'
      }
    ],
    professionalLicenseNumber: 'ETH-OR-REG-2018-0331',
    experienceYears: 8,
    accessCode: 'REG-SHAS-01',
    certificateNumber: 'SHAS-STK-CERT-2024-009',
    status: 'active',
    registeredDate: '2024-09-01'
  },
  {
    id: 'stk-10',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    fullName: 'አቶ ዳዊት በቀለ (Dawit Bekele)',
    gender: 'M',
    role: 'guidance_counselor',
    roleCustomTitle: 'የትምህርት ቤት ስነ-ልቦና እና የምክር ባለሙያ (Guidance Counselor)',
    officeOrDepartment: 'የተማሪዎች ስነ-ልቦና ምክርና ስነ-ምግባር ጽ/ቤት (Guidance & Counseling)',
    phone: '+251 91 662 9011',
    email: 'counselor.sec@shasheducation.gov.et',
    faydaNumber: 'FAYDA-5510-2291-8840',
    faydaVerified: true,
    credentials: [
      {
        id: 'crd-20',
        level: 'Degree',
        fieldOfStudy: 'B.A in Psychology & Behavioral Sciences (ሳይኮሎጂ)',
        institution: 'Hawassa University (ሀዋሳ ዩኒቨርሲቲ)',
        graduationYear: 2015,
        credentialDocNumber: 'HU-PSY-2015-8819'
      }
    ],
    professionalLicenseNumber: 'ETH-OR-CNS-2016-1102',
    experienceYears: 10,
    accessCode: 'CNS-DAWIT-01',
    certificateNumber: 'SHAS-STK-CERT-2024-010',
    status: 'active',
    registeredDate: '2024-09-01'
  },
  {
    id: 'stk-11',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    fullName: 'ኢ/ር ሮቤል ጌታቸው (Robel Getachew)',
    gender: 'M',
    role: 'lab_technician',
    roleCustomTitle: 'የሲስተም ዳታቤዝ እና አይሲቲ ቴክኒካል ድጋፍ ሰጪ (ICT & Systems Administrator)',
    officeOrDepartment: 'አይሲቲ፣ የኮምፒውተር ቤተ-ሙከራ እና ዲጂታል ቴክኖሎጂ (ICT Lab)',
    phone: '+251 94 551 2289',
    email: 'ict.admin@shasheducation.gov.et',
    faydaNumber: 'FAYDA-9901-3381-1120',
    faydaVerified: true,
    credentials: [
      {
        id: 'crd-21',
        level: 'Degree',
        fieldOfStudy: 'B.Sc in Computer Science & Networking (ኮምፒውተር ሳይንስ)',
        institution: 'Adama Science & Technology University (አዳማ ሳይንስና ቴክኖሎጂ)',
        graduationYear: 2019,
        credentialDocNumber: 'ASTU-CS-2019-3310'
      }
    ],
    professionalLicenseNumber: 'ETH-OR-ICT-2020-0019',
    experienceYears: 6,
    accessCode: 'ICT-ROBEL-01',
    certificateNumber: 'SHAS-STK-CERT-2024-011',
    status: 'active',
    registeredDate: '2024-09-01'
  }
];

// Initial School Announcements (የማስታወቂያ ሰሌዳ)
export const initialAnnouncements: SchoolAnnouncement[] = [
  {
    id: 'ann-1',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    title: 'የቦርድ አመራር አዲስ ዳይሬክተር ቅጥርና የስራ መመሪያ ማሳሰቢያ',
    content: 'የትምህርት ቤቱ የበላይ ጠባቂ ቦርድ ባደረገው ስብሰባ መሰረት አቶ ጉተማ ዋቆ በት/ቤቱ ዋና ርዕሰ መምህርነት ተሹመዋል። ሙሉ የአስተዳደርና የሲስተም ስልጣን የተሰጣቸው ሲሆን ሁሉም ሰራተኞች አስፈላጊውን ትብብር እንዲያደርጉ እናሳስባለን።',
    authorRole: 'owner_board',
    authorName: 'ዶ/ር ተስፋዬ በቀለ (የት/ቤት ቦርድ ሰብሳቢ / ባለቤት)',
    targetAudience: 'all',
    priority: 'important',
    createdAt: '2024-09-02',
    category: 'administrative'
  },
  {
    id: 'ann-2',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    title: 'የ1ኛ ወሰነ-ትምህርት አጋማሽ ፈተና እና የወላጅ መምህራን ጉባኤ (PTA Meeting)',
    content: 'የመጀመሪያው መንፈቀ-ዓመት የአጋማሽ ፈተናዎች ከጥቅምት 25 ጀምሮ ስለሚሰጡ ተማሪዎች ዝግጅት እንዲያደርጉ፣ እንዲሁም እሁድ ጥቅምት 27 ጠዋት 2:30 ላይ ጠቅላላ የወላጆች ውይይት ይካሄዳል።',
    authorRole: 'director',
    authorName: 'አቶ ጉተማ ዋቆ (ዋና ዳይሬክተር)',
    targetAudience: 'all',
    priority: 'urgent',
    createdAt: '2024-10-10',
    category: 'pta'
  },
  {
    id: 'ann-3',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    title: 'የ11ኛ ክፍል ፊዚክስ እና ሒሳብ የቤት ስራ (Homework Assignment) ማሳሰቢያ',
    content: 'ለ11ኛ ክፍል ተማሪዎች በሙሉ በሲስተሙ የተሰጠውን የኒውተን እንቅስቃሴ ህጎች የቤት ስራ ሰርታችሁ እስከ ረቡዕ ጥቅምት 20 እንድታስገቡ እናሳውቃለን።',
    authorRole: 'teacher',
    authorName: 'መ/ር በፈቃዱ ጥላሁን (የፊዚክስ መምህር)',
    targetAudience: 'students',
    priority: 'normal',
    createdAt: '2024-10-12',
    category: 'academic'
  },
  {
    id: 'ann-4',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    title: 'የጥቅምት ወር የትምህርት ቤት ወርሃዊ ክፍያ ማሳሰቢያ',
    content: 'የጥቅምት ወር የወር ክፍያ በቴሌብር (Telebirr)፣ በንግድ ባንክ (CBE Birr) ወይም በፋይናንስ ጽ/ቤት በአካል መክፈል የምትችሉ ሲሆን እስከ ጥቅምት 30 ድረስ ክፍያውን እንድታጠናቅቁ በትህትና እናሳስባለን።',
    authorRole: 'accountant',
    authorName: 'ወ/ሮ ሰላማዊት አበራ (ዋና ሒሳብ ሹም)',
    targetAudience: 'parents',
    priority: 'important',
    createdAt: '2024-10-15',
    category: 'finance'
  },
  {
    id: 'ann-5',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    title: 'የትምህርት ቢሮ የላብራቶሪና የቤተ-መጻሕፍት የጥራት ምዘና ሰርኩላር',
    content: 'በሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ የተላከ መመሪያ፡ የትምህርት ቤት ቤተ-መጻሕፍት እና ላብራቶሪዎች በሞዴል ደረጃ እንዲሟሉ የተሰጠ የኢንስፔክሽን ማሳሰቢያ።',
    authorRole: 'bureau',
    authorName: 'ወ/ሮ ጫልቱ ደረጀ (የቢሮ ኢንስፔክሽን ዳይሬክተር)',
    targetAudience: 'staff',
    priority: 'normal',
    createdAt: '2024-10-16',
    category: 'administrative'
  }
];

// Initial Homework Assignments (የቤት ስራ)
export const initialHomework: HomeworkAssignment[] = [
  {
    id: 'hw-1',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    teacherId: 'tch-1',
    teacherName: 'መ/ር በፈቃዱ ጥላሁን (የፊዚክስ መምህር)',
    grade: 11,
    section: 'A',
    subject: 'Physics (ፊዚክስ)',
    title: 'የኒውተን እንቅስቃሴ ህጎች እና የቬክተር ስሌት (Newton\'s Laws of Motion)',
    description: '1. የኒውተንን ሁለተኛ ህግ F=ma በመጠቀም በ5 ኪሎ ግራም ክብደት ላይ 20 ኒውተን ሃይል ቢተገበር የሚፈጠረውን ፍጥንጥነት አስሉ?\n2. የቬክተር እና የስኬላር መጠኖች ዋና ዋና ልዩነቶችን በምሳሌ አስረዱ?\n3. የግጭት ሃይል (Friction) ጠቀሜታ እና ጉዳቶችን ዘርዝሩ?',
    dueDate: '2024-10-25',
    maxScore: 10,
    createdAt: '2024-10-14'
  },
  {
    id: 'hw-2',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    teacherId: 'tch-2',
    teacherName: 'መ/ር ተስፋዬ ገመቹ (የሂሳብ መምህር)',
    grade: 11,
    section: 'A',
    subject: 'Mathematics (ሒሳብ)',
    title: 'ኳድራቲክ እኩልታዎች እና ማትሪክስ (Quadratic Equations & Matrices)',
    description: 'በገጽ 45 ላይ ያሉትን ጥያቄዎች ቁጥር 1 እስከ 5 በማስታወሻ ደብተር ሰርታችሁ አስረክቡ ወይም በሲስተሙ መልሳችሁን አስገቡ።',
    dueDate: '2024-10-28',
    maxScore: 15,
    createdAt: '2024-10-15'
  }
];

// Initial Homework Submissions (የቤት ስራ መልሶች)
export const initialHomeworkSubmissions: HomeworkSubmission[] = [
  {
    id: 'sub-1',
    assignmentId: 'hw-1',
    studentId: 'stu-1',
    studentName: 'ኪያር ጀማል (Kiyar Jemal)',
    grade: 11,
    section: 'A',
    submissionText: 'መልስ 1: F = m * a => a = F / m = 20N / 5kg = 4 m/s² ፍጥንጥነት ይሆናል።\n\nመልስ 2: ቬክተር አቅጣጫ እና መጠን አለው (ለምሳሌ፡ ፍጥነት፣ ሃይል)፤ ስኬላር መጠን ብቻ አለው (ለምሳሌ፡ ጊዜ፣ ክብደት)።\n\nመልስ 3: ጠቀሜታው ለመራመድ እና መኪና ለማቆም ይረዳል፤ ጉዳቱ መኪናዎችን ያሞቃል እና እቃዎችን ያበላሻል።',
    submissionDate: '2024-10-18',
    score: 9.5,
    teacherFeedback: 'በጣም ጥሩ ስራ ነው! ስሌቱ ትክክል ነው፤ ማብራሪያውም ግልጽ ነው። በርታ!',
    status: 'graded'
  }
];

// Initial Student Attendance Records (የተማሪዎች ዕለታዊ መገኘት)
export const initialAttendance: StudentAttendanceRecord[] = [
  {
    id: 'att-1',
    schoolId: 'sch-1',
    studentId: 'stu-1',
    studentName: 'ኪያር ጀማል (Kiyar Jemal)',
    grade: 11,
    section: 'A',
    date: '2024-10-14',
    status: 'present',
    recordedBy: 'መ/ር በፈቃዱ ጥላሁን'
  },
  {
    id: 'att-2',
    schoolId: 'sch-1',
    studentId: 'stu-1',
    studentName: 'ኪያር ጀማል (Kiyar Jemal)',
    grade: 11,
    section: 'A',
    date: '2024-10-15',
    status: 'present',
    recordedBy: 'መ/ር በፈቃዱ ጥላሁን'
  },
  {
    id: 'att-3',
    schoolId: 'sch-1',
    studentId: 'stu-1',
    studentName: 'ኪያር ጀማል (Kiyar Jemal)',
    grade: 11,
    section: 'A',
    date: '2024-10-16',
    status: 'present',
    recordedBy: 'መ/ር በፈቃዱ ጥላሁን'
  },
  {
    id: 'att-4',
    schoolId: 'sch-1',
    studentId: 'stu-1',
    studentName: 'ኪያር ጀማል (Kiyar Jemal)',
    grade: 11,
    section: 'A',
    date: '2024-10-17',
    status: 'late',
    reason: 'የትራንስፖርት መዘግየት ምክንያት 10 ደቂቃ ዘግይቶ ገብቷል',
    recordedBy: 'መ/ር በፈቃዱ ጥላሁን'
  },
  {
    id: 'att-5',
    schoolId: 'sch-1',
    studentId: 'stu-1',
    studentName: 'ኪያር ጀማል (Kiyar Jemal)',
    grade: 11,
    section: 'A',
    date: '2024-10-18',
    status: 'present',
    recordedBy: 'መ/ር በፈቃዱ ጥላሁን'
  }
];

// Initial Fee Payments (የወር ክፍያ መዝገብ)
export const initialFeePayments: FeePaymentRecord[] = [
  {
    id: 'fee-1',
    schoolId: 'sch-1',
    studentId: 'stu-1',
    studentName: 'ኪያር ጀማል (Kiyar Jemal)',
    grade: 11,
    section: 'A',
    parentName: 'አቶ ጀማል ሁሴን (Ato Jemal Hussein)',
    month: 'መስከረም 2017',
    amount: 850,
    paymentDate: '2024-09-12',
    paymentMethod: 'telebirr',
    receiptNumber: 'SHAS-REC-2024-8901',
    status: 'paid',
    collectedBy: 'ወ/ሮ ሰላማዊት አበራ (ሒሳብ ሹም)',
    notes: 'የመስከረም ወርሃዊ ክፍያ በቴሌብር ተጠናቋል'
  },
  {
    id: 'fee-2',
    schoolId: 'sch-1',
    studentId: 'stu-1',
    studentName: 'ኪያር ጀማል (Kiyar Jemal)',
    grade: 11,
    section: 'A',
    parentName: 'አቶ ጀማል ሁሴን (Ato Jemal Hussein)',
    month: 'ጥቅምት 2017',
    amount: 850,
    paymentDate: '2024-10-10',
    paymentMethod: 'cbe_birr',
    receiptNumber: 'SHAS-REC-2024-9120',
    status: 'paid',
    collectedBy: 'ወ/ሮ ሰላማዊት አበራ (ሒሳብ ሹም)',
    notes: 'የጥቅምት ወርሃዊ ክፍያ በሲቢኢ ብር ተጠናቋል'
  },
  {
    id: 'fee-3',
    schoolId: 'sch-1',
    studentId: 'stu-2',
    studentName: 'ትዕግስት በቀለ (Tigist Bekele)',
    grade: 10,
    section: 'B',
    parentName: 'ወ/ሮ ጫልቱ ገመቹ',
    month: 'ጥቅምት 2017',
    amount: 850,
    paymentDate: '2024-10-14',
    paymentMethod: 'cash',
    receiptNumber: 'SHAS-REC-2024-9188',
    status: 'paid',
    collectedBy: 'ወ/ሮ ሰላማዊት አበራ (ሒሳብ ሹም)'
  }
];

// Initial Operational Expenses (አስተዳደራዊ ወጪዎች)
export const initialExpenses: SchoolExpenseRecord[] = [
  {
    id: 'exp-1',
    schoolId: 'sch-1',
    title: 'የላብራቶሪ ኬሚካሎች እና የሙከራ ቱቦዎች ግዢ',
    category: 'supplies',
    amount: 14500,
    date: '2024-09-20',
    approvedBy: 'አቶ ጉተማ ዋቆ (ዳይሬክተር)',
    paidTo: 'ናይል ሳይንቲፊክ ዕቃዎች አቅራቢ',
    recordedBy: 'ወ/ሮ ሰላማዊት አበራ (ሒሳብ ሹም)',
    receiptDocNumber: 'EXP-REC-001',
    notes: 'ለ11ኛ እና 12ኛ ክፍል ኬሚስትሪ ላብራቶሪ'
  },
  {
    id: 'exp-2',
    schoolId: 'sch-1',
    title: 'የትምህርት ቤት ኢንተርኔት እና ቴሌኮም ክፍያ (ወርሃዊ)',
    category: 'utilities',
    amount: 4200,
    date: '2024-10-05',
    approvedBy: 'አቶ ጉተማ ዋቆ (ዳይሬክተር)',
    paidTo: 'ኢትዮ ቴሌኮም (ሻሸመኔ ቅርንጫፍ)',
    recordedBy: 'ወ/ሮ ሰላማዊት አበራ (ሒሳብ ሹም)',
    receiptDocNumber: 'EXP-REC-002'
  },
  {
    id: 'exp-3',
    schoolId: 'sch-1',
    title: 'የመማሪያ ክፍሎች ጠረጴዛና ወንበሮች ጥገና',
    category: 'maintenance',
    amount: 8900,
    date: '2024-10-12',
    approvedBy: 'አቶ ጉተማ ዋቆ (ዳይሬክተር)',
    paidTo: 'አባ ገዳ የእንጨትና ብረታብረት ስራ',
    recordedBy: 'ወ/ሮ ሰላማዊት አበራ (ሒሳብ ሹም)',
    receiptDocNumber: 'EXP-REC-003'
  }
];

// Initial Director Appointments (የቦርድ የዳይሬክተር ቅጥር)
export const initialDirectorAppointments: DirectorAppointment[] = [
  {
    id: 'apt-1',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    principalName: 'አቶ ጉተማ ዋቆ (Ato Gutema Wako)',
    qualification: 'MEd in Educational Leadership & Management (የትምህርት አመራር ማስተርስ)',
    phone: '+251 46 110 2420',
    email: 'gutema.principal@shasheducation.gov.et',
    appointedDate: '2024-08-25',
    appointedBy: 'ዶ/ር ተስፋዬ በቀለ (የት/ቤት ቦርድ ሰብሳቢ / ባለቤት)',
    accessCode: 'SHAS-SEC-01',
    status: 'active',
    dutiesAndPowers: [
      'የትምህርት ቤቱን አጠቃላይ አስተዳደራዊ እና አካዳሚክ ስራዎች በበላይነት መምራት',
      'መምህራን እና ድጋፍ ሰጪ ሰራተኞችን መመደብ፣ መቆጣጠር እና የሲስተም ኮድ መስጠት',
      'የትምህርት ውጤትና የተማሪዎች ሪፖርት ለትምህርት ቢሮ ማቅረብ',
      'የትምህርት ቤቱን በጀት በሒሳብ ሰራተኛ በኩል ማስተዳደር እና ወጪ ማጽደቅ',
      'ለማህበረሰቡ፣ ለመምህራንና ለወላጆች ማስታወቂያዎችን ማስተላለፍ'
    ]
  }
];

// Initial Teacher Exam Submissions (የትምህርት ቢሮ ግምገማ እና ለመምህራን የመልቀቂያ መዝገብ)
export const initialSubmissions: ExamSubmission[] = [
  {
    id: 'sub-sample-1',
    examId: 'exam-1',
    examTitle: 'የስነ-ማስተማር ብቃትና የክፍል አመራር ምዘና (Pedagogical Competency Assessment)',
    teacherId: 'tch-101',
    teacherName: 'መ/ር በፈቃዱ ጥላሁን',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    subject: 'Pedagogy & Classroom Management',
    score: 3,
    totalMarks: 3,
    percentage: 100,
    passed: true,
    submittedAt: '2025-02-14T09:30:00.000Z',
    certificateNumber: 'CERT-SHAS-2025-94821',
    reviewStatus: 'pending_bureau_review',
    answers: [
      {
        questionId: 'q1',
        questionText: 'በተማሪ ተኮር የማስተማር ዘዴ (Student-Centered Learning) ውስጥ የመምህሩ ዋነኛ ሚና ምንድን ነው?',
        selectedOption: 1,
        selectedOptionText: 'ተማሪዎች እውቀትን ራሳቸው እንዲያፈልቁ ማመቻቸትና ማገዝ (Facilitator & Guide)',
        correctOption: 1,
        correctOptionText: 'ተማሪዎች እውቀትን ራሳቸው እንዲያፈልቁ ማመቻቸትና ማገዝ (Facilitator & Guide)',
        isCorrect: true,
        explanation: 'በተማሪ ተኮር ዘዴ መምህሩ የእውቀት ምንጭ ብቻ ሳይሆን የመማር ሂደቱን የሚያመቻች (Facilitator) ነው።'
      },
      {
        questionId: 'q2',
        questionText: 'ቀጣይነት ያለው የተማሪዎች ምዘና (Continuous Formative Assessment) ዋና አላማው ምንድነው?',
        selectedOption: 1,
        selectedOptionText: 'የመማር ማስተማር ሂደቱን ጉድለቶች በመለየት የማስተካከያ ድጋፍ መስጠት',
        correctOption: 1,
        correctOptionText: 'የመማር ማስተማር ሂደቱን ጉድለቶች በመለየት የማስተካከያ ድጋፍ መስጠት',
        isCorrect: true,
        explanation: 'ቀጣይነት ያለው ምዘና ዋነኛ ግቡ ተማሪው የት ጋር እንደተቸገረ አውቆ አፋጣኝ ማስተካከያ (Feedback) መስጠት ነው።'
      },
      {
        questionId: 'q3',
        questionText: 'በብሉም የታክሶኖሚ (Bloom’s Taxonomy) የከፍተኛ የማሰብ ክህሎት (Higher Order Thinking) የሚባለው የትኛው ነው?',
        selectedOption: 2,
        selectedOptionText: 'መተንተንና መፍጠር (Analyzing & Creating)',
        correctOption: 2,
        correctOptionText: 'መተንተንና መፍጠር (Analyzing & Creating)',
        isCorrect: true,
        explanation: 'መተንተን፣ መገምገም እና አዳዲስ ሀሳቦችን መፍጠር የከፍተኛ ደረጃ የማሰብ ክህሎቶች (Higher Order) ናቸው።'
      }
    ]
  },
  {
    id: 'sub-sample-2',
    examId: 'exam-1',
    examTitle: 'የስነ-ማስተማር ብቃትና የክፍል አመራር ምዘና (Pedagogical Competency Assessment)',
    teacherId: 'tch-102',
    teacherName: 'መምህርት ትዕግስት አስፋው',
    schoolName: 'አባ ገዳ የመጀመሪያ ደረጃ ትምህርት ቤት',
    subject: 'Pedagogy & Classroom Management',
    score: 2,
    totalMarks: 3,
    percentage: 67,
    passed: false,
    submittedAt: '2025-02-12T14:15:00.000Z',
    reviewStatus: 'released_to_teacher',
    reviewedBy: 'አቶ ቶሎሳ ጉዲና (የትምህርት ቢሮ ምዘና ባለሙያ)',
    reviewedAt: '2025-02-13T10:00:00.000Z',
    bureauNotes: 'በቀጣይነት ባለው የተማሪዎች ምዘና ጽንሰ-ሀሳብ ላይ ተጨማሪ ስልጠና እንዲወስዱ ይበረታታሉ።',
    answers: [
      {
        questionId: 'q1',
        questionText: 'በተማሪ ተኮር የማስተማር ዘዴ (Student-Centered Learning) ውስጥ የመምህሩ ዋነኛ ሚና ምንድን ነው?',
        selectedOption: 1,
        selectedOptionText: 'ተማሪዎች እውቀትን ራሳቸው እንዲያፈልቁ ማመቻቸትና ማገዝ (Facilitator & Guide)',
        correctOption: 1,
        correctOptionText: 'ተማሪዎች እውቀትን ራሳቸው እንዲያፈልቁ ማመቻቸትና ማገዝ (Facilitator & Guide)',
        isCorrect: true,
        explanation: 'በተማሪ ተኮር ዘዴ መምህሩ የእውቀት ምንጭ ብቻ ሳይሆን የመማር ሂደቱን የሚያመቻች (Facilitator) ነው።'
      },
      {
        questionId: 'q2',
        questionText: 'ቀጣይነት ያለው የተማሪዎች ምዘና (Continuous Formative Assessment) ዋና አላማው ምንድነው?',
        selectedOption: 0,
        selectedOptionText: 'ተማሪዎችን ማወዳደርና ማሸነፍ ማስፈጠር',
        correctOption: 1,
        correctOptionText: 'የመማር ማስተማር ሂደቱን ጉድለቶች በመለየት የማስተካከያ ድጋፍ መስጠት',
        isCorrect: false,
        explanation: 'ቀጣይነት ያለው ምዘና ዋነኛ ግቡ ተማሪው የት ጋር እንደተቸገረ አውቆ አፋጣኝ ማስተካከያ (Feedback) መስጠት ነው።'
      },
      {
        questionId: 'q3',
        questionText: 'በብሉም የታክሶኖሚ (Bloom’s Taxonomy) የከፍተኛ የማሰብ ክህሎት (Higher Order Thinking) የሚባለው የትኛው ነው?',
        selectedOption: 2,
        selectedOptionText: 'መተንተንና መፍጠር (Analyzing & Creating)',
        correctOption: 2,
        correctOptionText: 'መተንተንና መፍጠር (Analyzing & Creating)',
        isCorrect: true,
        explanation: 'መተንተን፣ መገምገም እና አዳዲስ ሀሳቦችን መፍጠር የከፍተኛ ደረጃ የማሰብ ክህሎቶች (Higher Order) ናቸው።'
      }
    ]
  }
];

export const initialDeveloperConfig: DeveloperPaymentConfig = {
  feeAmount: 5000,
  currency: 'ETB',
  accountHolder: 'ታምራት አሌ (Tamerat Ale)',
  cbeAccount: '1000192837465',
  telebirrNumber: '0911029070',
  awashAccount: '01320894567800',
  dashenAccount: '5129038475612',
  abyssiniaAccount: '88492019482',
  coopAccount: '100098471923',
  developerPhone: '+251 91 102 9070',
  secondaryPhone: '+251 70 137 0299',
  developerEmail: 'tameratale09@gmail.com',
  parentCompany: 'ታሜና ሥራው ኃ/የተ/የግ/ማ (Tame & Seraw PLC)',
  sisterCompany: 'ውሽዬ ሶፍትዌር ሶሉሽን (Wushiye Software Solution)',
  leadProgrammer: 'ታምራት አሌ (Tamerat Ale)',
  backendEngineer: 'ታምራት አሌ (Tamerat Ale)',
  frontendEngineer: 'ታምራት አሌ (Tamerat Ale)',
  designer: 'ታምራት አሌ (Tamerat Ale)',
  address: 'ሻሸመኔ፣ ኢትዮጵያ (Shashemene, Ethiopia)',
  instructionsAm: 'ክፍያውን በንግድ ባንክ ወይም በቴሌብር ከፈጸሙ በኋላ የደረሰኙን ወይም የስሊፑን ፎቶ / ስክሪንሾት እና የትራንዛክሽን ቁጥር (Transaction Reference) በማስገባት ይላኩ። በአበልፃጊው በ10 ደቂቃ ውስጥ ተረጋግጦ ይከፈታል!',
  bankAccounts: [
    {
      id: 'bank-1',
      bankName: 'የኢትዮጵያ ንግድ ባንክ (Commercial Bank of Ethiopia - CBE)',
      accountNumber: '1000192837465',
      accountHolder: 'ታምራት አሌ (Tamerat Ale)',
      branchOrPhone: 'ሻሸመኔ ቅርንጫፍ',
      isActive: true,
      notes: 'ዋና የክፍያ መቀበያ ሂሳብ'
    },
    {
      id: 'bank-2',
      bankName: 'ቴሌብር (Telebirr)',
      accountNumber: '0911029070',
      accountHolder: 'ታምራት አሌ (Tamerat Ale)',
      branchOrPhone: '+251 91 102 9070 / +251 70 137 0299',
      isActive: true,
      notes: 'ፈጣን የሞባይል ክፍያ'
    },
    {
      id: 'bank-3',
      bankName: 'አዋሽ ባንክ (Awash Bank)',
      accountNumber: '01320894567800',
      accountHolder: 'ታምራት አሌ (Tamerat Ale)',
      branchOrPhone: 'ሻሸመኔ ቅርንጫፍ',
      isActive: true
    },
    {
      id: 'bank-4',
      bankName: 'ዳሸን ባንክ (Dashen Bank)',
      accountNumber: '5129038475612',
      accountHolder: 'ታምራት አሌ (Tamerat Ale)',
      branchOrPhone: 'ሻሸመኔ ቅርንጫፍ',
      isActive: true
    },
    {
      id: 'bank-5',
      bankName: 'አቢሲንያ ባንክ (Bank of Abyssinia)',
      accountNumber: '88492019482',
      accountHolder: 'ታምራት አሌ (Tamerat Ale)',
      branchOrPhone: 'ሻሸመኔ ቅርንጫፍ',
      isActive: true
    },
    {
      id: 'bank-6',
      bankName: 'ኦሮሚያ ህብረት ስራ ባንክ (Cooperative Bank of Oromia - Coop)',
      accountNumber: '100098471923',
      accountHolder: 'ታምራት አሌ (Tamerat Ale)',
      branchOrPhone: 'ሻሸመኔ ቅርንጫፍ',
      isActive: true
    }
  ]
};

export const initialDeveloperPayments: DeveloperPaymentReceipt[] = [
  {
    id: 'dev-rec-shas-01',
    schoolId: 'sch-1',
    schoolName: 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
    amount: 5000,
    currency: 'ETB',
    bankName: 'የኢትዮጵያ ንግድ ባንክ (Commercial Bank of Ethiopia)',
    transactionRef: 'FT24255019882',
    receiptImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    payerName: 'አቶ ጉተማ ዋቆ (ርዕሰ መምህር)',
    payerPhone: '+251 46 110 2420',
    submittedAt: '2024-09-02T10:15:00',
    status: 'approved',
    reviewedAt: '2024-09-02T11:30:00',
    reviewedBy: 'Tamerat Ale (System Developer)',
    notes: 'የዓመቱ ሙሉ ፈቃድና የትምህርት ቢሮ ዳታ ኢንተግሬሽን ፀድቋል'
  },
  {
    id: 'dev-rec-bulchana-01',
    schoolId: 'sch-2',
    schoolName: 'ቡልቻና 1ኛ እና መካከለኛ ደረጃ ትምህርት ቤት',
    amount: 5000,
    currency: 'ETB',
    bankName: 'ቴሌብር (Telebirr)',
    transactionRef: 'TB99201948529',
    receiptImageUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80',
    payerName: 'ወ/ሮ ዘሃራ ሁሴን (ርዕሰ መምህርት)',
    payerPhone: '+251 46 110 3311',
    submittedAt: '2024-10-28T14:40:00',
    status: 'receipt_submitted',
    notes: 'በቴሌብር የተከፈለ የ5,000 ብር ደረሰኝ ማረጋገጫ በመጠባበቅ ላይ'
  }
];


