import {
  Language,
  School,
  BureauStaff,
  TeacherCredential,
  TeacherExam,
  TrainingMaterial,
  StudentRecord,
  SchoolAnnouncement,
  HomeworkAssignment,
  SchoolStakeholder,
  StudentDisciplineReport,
  BureauStandardCriteria,
  SchoolBankAccount,
  NightClassScheduleItem
} from '../types';
import { SchoolUserCode } from './storage';

/**
 * Checks whether the active language is Afaan Oromoo ('om').
 */
export const isOromo = (lang?: Language): boolean => lang === 'om';
export const isEnglish = (lang?: Language): boolean => lang === 'en';

// =========================================================================
// 1. SCHOOLS LOCALIZATION
// =========================================================================
const OROMO_SCHOOL_DATA: Record<
  string,
  { name: string; subcity: string; principalName: string; typeDesc?: string }
> = {
  'sch-1': {
    name: 'Mana Barumsa Sadarkaa 2ffaa Waliigalaa Shashamannee',
    subcity: 'Kifle Ketemaa Abostoo (Abosto)',
    principalName: 'Obbo Gutamaa Waaqoo (Daarektara)'
  },
  'sch-2': {
    name: 'M/B Sadarkaa 1ffaa fi Giddu-galeessaa Bulchaanaa',
    subcity: 'Kifle Ketemaa Bulchaanaa (Bulchana)',
    principalName: 'Adde Zahaaraa Huseen (Daarektara)'
  },
  'sch-3': {
    name: 'Akaadaamii Dhuunfaa Hawaas',
    subcity: 'Kifle Ketemaa Awaashoo (Awasho)',
    principalName: 'Dr. Tasfaayee Baqqalaa (Daarektara)'
  },
  'sch-4': {
    name: 'Mana Barumsa Sadarkaa 2ffaa Kuyyaraa',
    subcity: 'Kifle Ketemaa Kuyyaraa (Kuyera)',
    principalName: 'Obbo Dassaaleny Tolasaa (Daarektara)'
  },
  'sch-5': {
    name: 'M/B Sadarkaa 1ffaa Abostoo',
    subcity: 'Kifle Ketemaa Abostoo (Abosto)',
    principalName: 'Adde Birtukaan Haayiluu (Daarektara)'
  },
  'sch-6': {
    name: 'M/B Moodeela Awaashoo',
    subcity: 'Kifle Ketemaa Awaashoo (Awasho)',
    principalName: 'Obbo Alamaayyoo Dajanee (Daarektara)'
  },
  'sch-7': {
    name: 'M/B Sadarkaa 1ffaa Aleeluu',
    subcity: 'Kifle Ketemaa Aleeluu (Alelu)',
    principalName: 'Obbo Taayyee Fiqaaduu (Daarektara)'
  },
  'sch-8': {
    name: 'M/B Sadarkaa 1ffaa Diidaa Booqee',
    subcity: 'Kifle Ketemaa Diidaa Booqee (Dida Boke)',
    principalName: 'Adde Caaltuu Mokonnon (Daarektara)'
  }
};

export const getLocalizedSchool = (school: School, lang?: Language): School => {
  if (!isOromo(lang)) return school;
  const oromo = OROMO_SCHOOL_DATA[school.id];
  if (!oromo) {
    return {
      ...school,
      name: school.nameOm || school.name
    };
  }
  return {
    ...school,
    name: oromo.name,
    nameOm: school.name, // Keep Amharic as secondary reference
    subcity: oromo.subcity,
    principalName: oromo.principalName
  };
};

export const getLocalizedSchools = (schools: School[], lang?: Language): School[] => {
  return schools.map((s) => getLocalizedSchool(s, lang));
};

// =========================================================================
// 2. BUREAU STAFF LOCALIZATION
// =========================================================================
const OROMO_STAFF_DATA: Record<
  string,
  { fullName: string; roleTitle: string; department: string }
> = {
  'st-1': {
    fullName: 'Obbo Taamiraat Alamuu (Ato Tamerat Alemu)',
    roleTitle: 'Hoogganaa Biiroo Barnootaa (Bureau Head)',
    department: 'Hoggansa Biiroo (Executive)'
  },
  'st-2': {
    fullName: 'Adde Caaltuu Darrajjee (W/ro Chaltu Dereje)',
    roleTitle: 'Daarektara Qulqullina Barnootaa fi Inispeekshinii (Quality & Inspection)',
    department: 'Inispeekshinii fi Madaallii Sadarkaa (Inspection)'
  },
  'st-3': {
    fullName: 'Obbo Gamachuu Baqqalaa (Ato Gemechu Bekele)',
    roleTitle: 'Ogeessa Sirna Barnootaa fi Misooma Barsiisotaa (Curriculum & CPD)',
    department: 'Sirna Barnootaa fi Leenjii (Curriculum)'
  },
  'st-4': {
    fullName: 'Adde Birtukaan Haayiluu (W/ro Birtukan Hailu)',
    roleTitle: 'Daarektara Qormaataa fi Madaallii (Exams & Assessment)',
    department: 'Kutaa Qormaataa fi Madaallii (Examinations)'
  },
  'st-5': {
    fullName: 'Obbo Dassaaleny Tolasaa (Ato Dessalegn Tolosa)',
    roleTitle: 'Ogeessa Teeknoolojii fi Qunnamtii Barnootaa (ICT & EdTech)',
    department: 'Teeknoolojii fi Qunnamtii (ICT Department)'
  },
  'st-6': {
    fullName: 'Adde Hawwii Kadiir (W/ro Hawi Kedir)',
    roleTitle: 'Ogeettii Qunnamtii fi Qooda Fudhattootaa (Public Relations)',
    department: 'Qunnamtii Ummataa fi Koominikeeshinii (PR)'
  }
};

export const getLocalizedStaff = (staff: BureauStaff, lang?: Language): BureauStaff => {
  if (!isOromo(lang)) return staff;
  const oromo = OROMO_STAFF_DATA[staff.id];
  if (!oromo) return staff;
  return {
    ...staff,
    fullName: oromo.fullName,
    roleTitle: oromo.roleTitle,
    department: oromo.department
  };
};

export const getLocalizedStaffList = (staffList: BureauStaff[], lang?: Language): BureauStaff[] => {
  return staffList.map((s) => getLocalizedStaff(s, lang));
};

// =========================================================================
// 3. TRAINING MATERIALS LOCALIZATION
// =========================================================================
const OROMO_TRAINING_DATA: Record<
  string,
  {
    title: string;
    subject: string;
    authorDepartment: string;
    summary: string;
    fullContent: string;
  }
> = {
  'mat-1': {
    title: 'Barnoota Herregaa Maloota Rakkoo Hiikuun Barsiisuu (Problem-Based Math Instruction)',
    subject: 'Herrega (Mathematics)',
    authorDepartment: 'Daarektoreetii Sirna Barnootaa fi Misooma Barsiisotaa (Curriculum Dept)',
    summary:
      'Barattoonni foormulaa sammuutti qabachuu qofa irraa gara rakkoolee guyyaa guyyaa fi gaaffilee qabatamaa irratti hojiirra oolchuutti akka ce’an gargaaru.',
    fullContent: `Kenniinsa barnoota herregaa manneen barnootaa magaalaa Shashamannee keessatti bu’aa olaanaa akka fiduuf qabxiilee gurguddoo barsiisonni hordofuu qaban:

1. Fakkeenyota qabatamaa dursuu:
Foormulaa kallattiin kennuu mannaa, gabaa Shashamannee, daldala fi ijaarsa keessatti rakkoolee lakkoofsaa mudatan akka ka'umsaatti fayyadamaa.

2. Hojii cimdii fi garee:
Herrega mariin baruun soda barattootaa hir’isa. Yeroo barattoonni walii isaaniif ibsan dandeettiin yaadachuu isaanii hanga 90% gaha.

3. Teeknoolojii dijitaalaa fayyadamuu:
GeoGebra fi appilikeeshinoota bilisaa fayyadamuun garaafii fi ji’oomeetirii agarsiisuun baruu saffisiisaa.

4. Duub-deebii wal-irraa hin cinne:
Torbanitti qormaata gabaabaa daqiiqaa 5 kennuun bakka hanqinni jiru adda baasaa deeggarsa kennaa.`
  },
  'mat-2': {
    title: 'Mala Barsiisuu Hirmaachisaa fi Hordoffii Qulqullina Barnootaa (Active Learning & Pedagogy)',
    subject: 'Afaan Oromoo fi Ogummaa Barsiisummaa (Pedagogy)',
    authorDepartment: 'Kutaa Misooma Barsiisotaa fi Inispeekshinii (CPD Dept)',
    summary:
      'Daree barnootaa keessatti hirmaannaa barattootaa guddisuu fi dandeettii yaaduu olaanaa (Critical Thinking) gabbisuuf qajeelfama qophaa’e.',
    fullContent: `Qajeelfama Biiroo Barnootaa Magaalaa Shashamannee:

1. Barataa Giddu-galeessa Godhachuu: Barsiisaan odeeffannoo kennuu qofa osoo hin taane, barataan akka qoratuu fi ibsu haala mijeessaa.
2. Gaaffilee Yaada Kakaasan (HOTS): Gaaffilee 'Eeyyee/Lakki' irra darbuun 'Maaliif? Akkamitti?' jedhanii yaadan gaafadhaa.
3. Hordoffii Daree Madaalawaa: Shamarranii fi barattoota qaama miidhamootti xiyyeeffannoo addaa kennaa.`
  },
  'mat-3': {
    title: 'Qajeelfama Qormaataa fi Madaallii Itti-fufiinsa Qabu (Continuous Assessment Guidelines)',
    subject: 'Madaallii fi Qormaata (Assessment & Evaluation)',
    authorDepartment: 'Daarektoreetii Qormaataa fi Madaallii (Exam Directorate)',
    summary:
      'Ulaagaa Biiroo Barnootaa Oromiyaa fi Ministeera Barnootaatiin qormaata qulqullina qabu qopheessuu fi sirna madaallii 100% hojiirra oolchuu.',
    fullContent: `Qajeelfama Madaallii Barnootaa 2017:

1. Kuuwwizii fi Hojii Daree (20%): Torban torbaniin madaallii gabaabaa gaggeessuu.
2. Hojii Manaa fi Pirojektii (20%): Hojii dhuunfaa fi garee madaaluu.
3. Qormaata Walakkaa Semisteeraa (Mid-Exam - 20%): Barnoota semisteera walakkaa madaaluu.
4. Qormaata Xumura Semisteeraa (Final Exam - 40%): Qulqullina qormaataa fi eegumsa iccitii mirkaneessuu.`
  },
  'mat-4': {
    title: 'Barnoota Saayinsii Laabiraatoorii fi Qorannoon Barsiisuu (Practical Science Instruction)',
    subject: 'Fiiziksii fi Keemistirii (Science)',
    authorDepartment: 'Kutaa Barnoota Saayinsii fi Teeknoolojii (Science Dept)',
    summary:
      'Manneen barnootaa qabeenya laabiraatoorii qabaniin shaakala qabatamaa adeemsisuu fi eegumsa nageenyaa eeguu.',
    fullContent: `Barnoota saayinsii afaaniin qofa osoo hin taane laabiraatoorii fi wantoota naannootti fayyadamuun qabatamaa taasisaa.`
  },
  'mat-5': {
    title: 'Teeknoolojii Dijitaalaa fi Sirna Barnootaa Toora Irraa (EdTech Integration)',
    subject: 'Teeknoolojii fi ICT (EdTech)',
    authorDepartment: 'Kutaa ICT fi Teeknoolojii Barnootaa (EdTech)',
    summary:
      'Barsiisonni meeshaalee dijitaalaa fi bilbila ammayyaa fayyadamuun baruu-barsiisuu cimsuu.',
    fullContent: `Barsiisonni meeshaalee dijitaalaa qophii dareetiif, qormaata toora irraatiif fi kitaabota bilisaan argachuuf akka itti fayyadaman qajeelfama kenname.`
  },
  'mat-6': {
    title: 'Hoggansa Daree fi Amala Gaarii Barattootaa Ijaaruu (Positive Classroom Management)',
    subject: 'Amala Barattootaa fi Qajeelcha (Discipline & Counseling)',
    authorDepartment: 'Kutaa Qajeelcha Xiin-sammuu fi Amalaa (Counseling)',
    summary:
      'Adabbii qaamaa malee sirna ifa ta’ee fi jaalalaan daree hoogganuu fi amala barattootaa qajeelchuu.',
    fullContent: `Adabbiin qaamaa seeraan dhowwameera. Barattoota wajjin mari’achuun seera daree baasuu fi amala qajeelaa jajjabeessuun bu’a qabeessa dha.`
  }
};

export const getLocalizedTraining = (material: TrainingMaterial, lang?: Language): TrainingMaterial => {
  if (!isOromo(lang)) return material;
  const oromo = OROMO_TRAINING_DATA[material.id];
  if (!oromo) return material;
  return {
    ...material,
    title: oromo.title,
    subject: oromo.subject,
    authorDepartment: oromo.authorDepartment,
    summary: oromo.summary,
    fullContent: oromo.fullContent
  };
};

export const getLocalizedTrainingList = (
  materials: TrainingMaterial[],
  lang?: Language
): TrainingMaterial[] => {
  return materials.map((m) => getLocalizedTraining(m, lang));
};

// =========================================================================
// 4. TEACHER EXAMS LOCALIZATION
// =========================================================================
const OROMO_EXAM_DATA: Record<
  string,
  {
    title: string;
    subject: string;
    instructions: string;
    questions?: Array<{
      id: string;
      questionText: string;
      options: string[];
      explanation?: string;
    }>;
  }
> = {
  'exam-1': {
    title: 'Madaallii Gahumsa Ogummaa Barsiisummaa fi Hoggansa Daree (Pedagogical Competency)',
    subject: 'Ogummaa Barsiisummaa fi Hoggansa Daree (Pedagogy)',
    instructions:
      'Qormaanni kun Biiroo Barnootaa Bulchiinsa Magaalaa Shashamanneetiin kan qophaa\'e qormaata gahumsa barsiisotaa seera-qabeessa dha. Gaaffilee of eeggannoon dubbisaatii deebii sirrii filadhaa. 70% fi isaa ol yoo fidxan waraqaa ragaa ni argattu.',
    questions: [
      {
        id: 'q1',
        questionText:
          'Mala baruu-barsiisuu barataa giddu-galeessa godhate (Student-Centered Learning) keessatti gaheen guddaan barsiisaa maali?',
        options: [
          'Odeeffannoo barattootaaf qofa kennuu (Direct lecture)',
          'Barattoonni beekumsa mataa isaaniitiin akka maddisiisan haala mijeessuu fi qajeelchuu (Facilitator & Guide)',
          'Yeroo qormaataa akka callisan to\'achuu qofa',
          'Kitaaba barnootaa jala sararuun dubbisuu qofa'
        ],
        explanation:
          'Mala barataa giddu-galeessa godhate keessatti barsiisaan madda beekumsaa qofa osoo hin taane adeemsa baruu kan haala mijeessu (Facilitator) dha.'
      },
      {
        id: 'q2',
        questionText:
          'Kaayyoon guddaan madaallii itti-fufiinsa qabu (Continuous Formative Assessment) maali?',
        options: [
          'Barattoota wal-dorgomsiisuu fi moo\'ataa uumuu',
          'Hanqinaalee baruu-barsiisuu adda baasuun deeggarsa sirreeffamaa kennuu',
          'Barattoota sodaachisuuf qabxii galmeessuu',
          'Qormaata gabaasa Biiroo Barnootaatiif qofa oolchuu'
        ],
        explanation:
          'Kaayyoon madaallii itti-fufaa barataan eessatti akka rakkate beekuun duub-deebii battalaa kennuu dha.'
      },
      {
        id: 'q3',
        questionText:
          'Sadarkaa yaaduu olaanaa (Bloom\'s Taxonomy - Higher Order Thinking) keessatti kan ramadamu kami?',
        options: [
          'Yaadachuu (Remembering)',
          'Hubachuu (Understanding)',
          'Xiinxaluu fi Uumuu (Analyzing & Creating)',
          'Foormulaa sammuutti qabachuu (Rote memorization)'
        ],
        explanation: 'Xiinxaluu, madaaluu fi uumuun sadarkaalee yaaduu olaanoo (HOTS) ti.'
      },
      {
        id: 'q4',
        questionText:
          'Sirna daree hirmaachisaa ta\'e ijaaruuf (Positive Discipline) kan gorfamu kami?',
        options: [
          'Adabbii qaamaa fi barataa daree duratti qaanessuu',
          'Seerota waliigalaa ifa ta\'an barattoota wajjin baasuun jajjabina kennuu',
          'Barattoota dadhaboo daree keessaa ari\'uu',
          'Dhimma amalaa hunda gara maatiitti erguu'
        ],
        explanation:
          'Seera waliinii baasuun amala gaarii jajjabeessuun daree tasgabbaa\'aa uuma.'
      }
    ]
  }
};

export const getLocalizedExam = (exam: TeacherExam, lang?: Language): TeacherExam => {
  if (!isOromo(lang)) return exam;
  const oromo = OROMO_EXAM_DATA[exam.id];
  if (!oromo) return exam;
  return {
    ...exam,
    title: oromo.title,
    subject: oromo.subject,
    instructions: oromo.instructions,
    questions: exam.questions.map((q, idx) => {
      const oromoQ = oromo.questions?.[idx];
      if (!oromoQ) return q;
      return {
        ...q,
        questionText: oromoQ.questionText,
        options: oromoQ.options,
        explanation: oromoQ.explanation || q.explanation
      };
    })
  };
};

export const getLocalizedExams = (exams: TeacherExam[], lang?: Language): TeacherExam[] => {
  return exams.map((e) => getLocalizedExam(e, lang));
};

// =========================================================================
// 5. TEACHER CREDENTIALS LOCALIZATION
// =========================================================================
const OROMO_CREDENTIALS_DATA: Record<
  string,
  {
    fullName: string;
    schoolName: string;
    subject: string;
    degree: string;
    specialization: string;
    university: string;
  }
> = {
  'tc-1': {
    fullName: 'Obbo Bafqaaduu Xilahun (Befekadu Tilahun)',
    schoolName: 'Mana Barumsa Sadarkaa 2ffaa Waliigalaa Shashamannee',
    subject: 'Herrega (Mathematics)',
    degree: 'Digirii Lammaffaa (MSc)',
    specialization: 'Herrega Qulqulluu (Applied Mathematics)',
    university: 'Yuunivarsitii Hawaasaa (Hawassa University)'
  },
  'tc-2': {
    fullName: 'Adde Salaamawit Taaddasaa (Selamawit Tadese)',
    schoolName: 'Mana Barumsa Sadarkaa 2ffaa Waliigalaa Shashamannee',
    subject: 'Afaan Oromoo fi Og-barruu',
    degree: 'Digirii Jalqabaa (BEd)',
    specialization: 'Barnoota Afaan Oromoo (Afaan Oromoo Education)',
    university: 'Yuunivarsitii Jimmaa (Jimma University)'
  },
  'tc-3': {
    fullName: 'Obbo Toofiq Kadiir (Tofik Kedir)',
    schoolName: 'M/B Sadarkaa 1ffaa fi Giddu-galeessaa Bulchaanaa',
    subject: 'Fiiziksii (Physics)',
    degree: 'Digirii Jalqabaa (BSc)',
    specialization: 'Fiiziksii Qabatamaa (Applied Physics)',
    university: 'Yuunivarsitii Madda Walaabuu (Madda Walabu University)'
  },
  'tc-4': {
    fullName: 'Adde Haliimaa Abbaas (Halima Abbas)',
    schoolName: 'Akaadaamii Dhuunfaa Hawaas',
    subject: 'Keemistirii (Chemistry)',
    degree: 'Digirii Jalqabaa (BEd)',
    specialization: 'Keemistirii fi Saayinsii (Chemistry Education)',
    university: 'Yuunivarsitii Arsii (Arsi University)'
  },
  'tc-5': {
    fullName: 'Obbo Taaddasaa Guutamaa (Tadese Gutema)',
    schoolName: 'Mana Barumsa Sadarkaa 2ffaa Kuyyaraa',
    subject: 'Baayoloojii (Biology)',
    degree: 'Digirii Lammaffaa (MSc)',
    specialization: 'Baayoloojii Naannoo (Environmental Biology)',
    university: 'Yuunivarsitii Finfinnee (Addis Ababa University)'
  },
  'tc-6': {
    fullName: 'Adde Caaltuu Mokonnon (Chaltu Mekonnen)',
    schoolName: 'M/B Sadarkaa 1ffaa Abostoo',
    subject: 'Ingiliffa (English)',
    degree: 'Digirii Jalqabaa (BA)',
    specialization: 'Afaan Ingiliffaa fi Og-barruu (English Literature)',
    university: 'Yuunivarsitii Dambi Doolloo (Dambi Dollo University)'
  },
  'tc-7': {
    fullName: 'Obbo Alamaayyoo Dajanee (Alemayehu Dejene)',
    schoolName: 'M/B Moodeela Awaashoo',
    subject: 'Seenaa fi Hawaasummaa (History)',
    degree: 'Digirii Jalqabaa (BA)',
    specialization: 'Seenaa fi Barnoota Lammummaa (History)',
    university: 'Yuunivarsitii Bulee Horaa (Bule Hora University)'
  },
  'tc-8': {
    fullName: 'Adde Muluu Balaxxa (Mulu Belete)',
    schoolName: 'M/B Sadarkaa 1ffaa Aleeluu',
    subject: 'Lammummaa fi Seera (Civics)',
    degree: 'Digirii Jalqabaa (LLB / BEd)',
    specialization: 'Barnoota Lammummaa fi Seeraa (Civics & Ethics)',
    university: 'Yuunivarsitii Wallaggaa (Wollega University)'
  }
};

export const getLocalizedCredential = (
  cred: TeacherCredential,
  lang?: Language
): TeacherCredential => {
  if (!isOromo(lang)) return cred;
  const oromo = OROMO_CREDENTIALS_DATA[cred.id];
  if (!oromo) return cred;
  return {
    ...cred,
    teacherName: oromo.fullName,
    schoolName: oromo.schoolName,
    subject: oromo.subject,
    institution: oromo.university || cred.institution
  };
};

export const getLocalizedCredentials = (
  creds: TeacherCredential[],
  lang?: Language
): TeacherCredential[] => {
  return creds.map((c) => getLocalizedCredential(c, lang));
};

// =========================================================================
// 6. STUDENTS LOCALIZATION
// =========================================================================
const OROMO_STUDENT_NAMES: Record<
  string,
  {
    fullName: string;
    schoolName: string;
    parentName: string;
    shiftSchedule?: string;
  }
> = {
  'stu-1': {
    fullName: 'Kiyaar Kadiir Alii (Kiyar Kedir Ali)',
    schoolName: 'Mana Barumsa Sadarkaa 2ffaa Waliigalaa Shashamannee',
    parentName: 'Obbo Kadiir Alii (Ato Kedir Ali)',
    shiftSchedule: 'Wiixata - Jimaata | 2:00 - 9:00 Guyyaa (8:00 AM - 3:00 PM)'
  },
  'stu-2': {
    fullName: 'Biftuu Tolasaa Guutamaa (Biftu Tolosa Gutema)',
    schoolName: 'Mana Barumsa Sadarkaa 2ffaa Waliigalaa Shashamannee',
    parentName: 'Obbo Tolasaa Guutamaa (Ato Tolosa Gutema)',
    shiftSchedule: 'Wiixata - Jimaata | 2:00 - 9:00 Guyyaa (8:00 AM - 3:00 PM)'
  },
  'stu-3': {
    fullName: 'Naahom Daan\'el Taaddasaa (Nahom Daniel Tadese)',
    schoolName: 'Mana Barumsa Sadarkaa 2ffaa Waliigalaa Shashamannee',
    parentName: 'Obbo Daan\'el Taaddasaa (Ato Daniel Tadese)',
    shiftSchedule: 'Wiixata - Jimaata | 2:00 - 9:00 Guyyaa'
  },
  'stu-4': {
    fullName: 'Roobel Salamoon Habtee (Robel Solomon Habte)',
    schoolName: 'Mana Barumsa Sadarkaa 2ffaa Waliigalaa Shashamannee',
    parentName: 'Obbo Salamoon Habtee (Ato Solomon Habte)',
    shiftSchedule: 'Wiixata - Jimaata | 2:00 - 9:00 Guyyaa'
  },
  'stu-5': {
    fullName: 'Hanan Abdurashiid Umar (Hanan Abdurashid)',
    schoolName: 'Mana Barumsa Sadarkaa 2ffaa Waliigalaa Shashamannee',
    parentName: 'Obbo Abdurashiid Umar',
    shiftSchedule: 'Wiixata - Jimaata | 2:00 - 9:00 Guyyaa'
  },
  'stu-night-1': {
    fullName: 'Obbo Huseen Abdullaahii Umar (Barataa Galgalaa)',
    schoolName: 'Mana Barumsa Sadarkaa 2ffaa Waliigalaa Shashamannee',
    parentName: 'Adde Faaxumaa Huseen (Wabii)',
    shiftSchedule: 'Wiixata - Jimaata | 11:30 - 2:30 Galgala'
  },
  'stu-night-2': {
    fullName: 'Aaddee Raddiyyet Tafarraa Mogas (Barattuu Galgalaa)',
    schoolName: 'Mana Barumsa Sadarkaa 2ffaa Waliigalaa Shashamannee',
    parentName: 'Obbo Tafarraa Mogas',
    shiftSchedule: 'Wiixata - Jimaata | 11:30 - 2:30 Galgala'
  },
  'stu-night-3': {
    fullName: 'Obbo Gamachuu Baqqalaa Diidaa (Barataa Galgalaa)',
    schoolName: 'Mana Barumsa Sadarkaa 2ffaa Waliigalaa Shashamannee',
    parentName: 'Obbo Baqqalaa Diidaa',
    shiftSchedule: 'Wiixata - Jimaata | 11:30 - 2:30 Galgala'
  }
};

const OROMO_SUBJECT_MAP: Record<string, string> = {
  'Mathematics (ሂሳብ)': 'Herrega (Mathematics)',
  'English (እንግሊዝኛ)': 'Ingiliffa (English)',
  'Afaan Oromoo (ኦሮሚኛ)': 'Afaan Oromoo',
  'Physics (ፊዚክስ)': 'Fiiziksii (Physics)',
  'Chemistry (ኬሚስትሪ)': 'Keemistirii (Chemistry)',
  'Biology (ባዮሎጂ)': 'Baayoloojii (Biology)',
  'Citizenship (ስነ-ዜጋ)': 'Lammummaa fi Hawaasummaa (Citizenship)',
  'Geography (ጆግራፊ)': 'Ji\'oogiraafii (Geography)',
  'History (ታሪክ)': 'Seenaa (History)',
  'Economics (ኢኮኖሚክስ)': 'Diinagdee (Economics)',
  'Information Technology (አይቲ)': 'Teeknoolojii Odeeffannoo (IT)'
};

export const getLocalizedStudent = (student: StudentRecord, lang?: Language): StudentRecord => {
  if (!isOromo(lang)) return student;
  const oromo = OROMO_STUDENT_NAMES[student.id];
  const localizedScores = student.scores.map((s) => ({
    ...s,
    subject: OROMO_SUBJECT_MAP[s.subject] || s.subject
  }));

  if (!oromo) {
    return {
      ...student,
      scores: localizedScores
    };
  }

  return {
    ...student,
    fullName: oromo.fullName,
    schoolName: oromo.schoolName,
    parentName: oromo.parentName,
    shiftSchedule: oromo.shiftSchedule || student.shiftSchedule,
    scores: localizedScores
  };
};

export const getLocalizedStudents = (
  students: StudentRecord[],
  lang?: Language
): StudentRecord[] => {
  return students.map((s) => getLocalizedStudent(s, lang));
};

// =========================================================================
// 7. ANNOUNCEMENTS LOCALIZATION
// =========================================================================
const OROMO_ANNOUNCEMENTS: Record<
  string,
  { title: string; content: string; authorName: string }
> = {
  'ann-1': {
    title: 'Murtii Boordii: Qaxara Daarektara Haaraa fi Qajeelfama Hojii',
    content:
      'Walga’ii boordii eegumsa olaanaa mana barnootaatiin Obbo Guutamaa Waaqoo daarektara olaanaa ta’uun muudamaniiru. Aangoon guutuun hoggansaa fi sirnichaa kan kennameef yoo ta’u, hojjettoonni hundi tumsa barbaachisaa akka taasisan hubachiifna.',
    authorName: 'Dr. Tasfaayee Baqqalaa (Walitti-qabaa Boordii / Abbaa Qabeenyaa)'
  },
  'ann-2': {
    title: 'Qormaata Walakkaa Semisteera 1ffaa fi Yaa\'ii Maatii fi Barsiisotaa (PTA)',
    content:
      'Qormaanni walakkaa semisteera 1ffaa Onkololeessa 25 irraa eegalee waan kennamuuf barattoonni qophii akka taasisan, akkasumas Dilbata Onkololeessa 27 ganama sa\'aatii 2:30 irratti mariin maatii maraa ni gaggeeffama.',
    authorName: 'Obbo Guutamaa Waaqoo (Daarektara Olaanaa)'
  },
  'ann-3': {
    title: 'Hojii Manaa Fiiziksii fi Herregaa Kutaa 11ffaa (Homework Assignment)',
    content:
      'Barattoota kutaa 11ffaa hundaaf hojii manaa Seerota Sochii Niiwutan sirnichaan kenname hojjettanii hanga Roobii Onkololeessa 20 akka galchitan beeksisna.',
    authorName: 'Barsiisaa Bafqaaduu Xilahun (Barsiisaa Fiiziksii)'
  },
  'ann-4': {
    title: 'Beeksisa Kaffaltii Ji’aa M/Barnootaa Ji’a Onkololeessaa (Tuition Fees)',
    content:
      'Kaffaltii ji’aa Onkololeessaa Telebirr, Baankii Daldala Itoophiyaa (CBE Birr) ykn waajjira faayinaansiitti qaamaan kaffaluu kan dandeessan yoo ta’u, hanga Onkololeessa 30tti akka xumurtan kabajaan isin beeksisna.',
    authorName: 'Adde Salaamawit Abarraa (Abbaa Herregaa Olaantuu)'
  },
  'ann-5': {
    title: 'Qajeelfama Biiroo Barnootaa: Madaallii Qulqullina Mana Dubbisaa fi Laabiraatoorii',
    content:
      'Qajeelfama Biiroo Barnootaa Magaalaa Shashamanneetiin ergame: Manni dubbisaa fi laabiraatooriin sadarkaa moodeelaan akka guutamu akeekkachiisa inispeekshinii kenname.',
    authorName: 'Adde Caaltuu Darrajjee (Daarektara Inispeekshinii Biiroo)'
  }
};

export const getLocalizedAnnouncement = (
  ann: SchoolAnnouncement,
  lang?: Language
): SchoolAnnouncement => {
  if (!isOromo(lang)) return ann;
  const oromo = OROMO_ANNOUNCEMENTS[ann.id];
  if (!oromo) return ann;
  return {
    ...ann,
    title: oromo.title,
    content: oromo.content,
    authorName: oromo.authorName
  };
};

export const getLocalizedAnnouncements = (
  anns: SchoolAnnouncement[],
  lang?: Language
): SchoolAnnouncement[] => {
  return anns.map((a) => getLocalizedAnnouncement(a, lang));
};

// =========================================================================
// 8. HOMEWORK LOCALIZATION
// =========================================================================
const OROMO_HOMEWORK: Record<
  string,
  { title: string; description: string; subject: string }
> = {
  'hw-1': {
    title: 'Hojii Manaa Seerota Sochii Niiwutan (Newton\'s Laws of Motion)',
    subject: 'Fiiziksii (Physics)',
    description:
      'Seerota sochii Niiwutan sadan fakkeenya guyyaa guyyaa gabaa Shashamannee keessatti mudatuun ibsaa fi gaaffilee herregaa fuula 42 jiran hojjedhaa.'
  },
  'hw-2': {
    title: 'Qo\'annoo Caasluga Afaan Oromoo fi Og-barruu (Grammar & Literature)',
    subject: 'Afaan Oromoo',
    description:
      'Walaloo fi himoota caasluga qaban adda baasuun seera barreessaa hordofuun barreeffama gabaabaa qopheessaa.'
  },
  'hw-3': {
    title: 'Kalaqa Saayinsii fi Pirojektii Keemistirii (Chemistry Experiments)',
    subject: 'Keemistirii (Chemistry)',
    description:
      'Re\'aakshinii keemikaalaa fi wantoota naannoo fayyadamuun pirojektii saayinsii gareen hojjetamu.'
  }
};

export const getLocalizedHomework = (
  hw: HomeworkAssignment,
  lang?: Language
): HomeworkAssignment => {
  if (!isOromo(lang)) return hw;
  const oromo = OROMO_HOMEWORK[hw.id];
  if (!oromo) return hw;
  return {
    ...hw,
    title: oromo.title,
    description: oromo.description,
    subject: oromo.subject
  };
};

export const getLocalizedHomeworkList = (
  hwList: HomeworkAssignment[],
  lang?: Language
): HomeworkAssignment[] => {
  return hwList.map((h) => getLocalizedHomework(h, lang));
};

// =========================================================================
// 9. STAKEHOLDERS LOCALIZATION
// =========================================================================
const OROMO_STAKEHOLDERS: Record<
  string,
  { fullName: string; role: string; department: string; qualification: string }
> = {
  'stk-1': {
    fullName: 'Obbo Guutamaa Waaqoo (Gutama Wako)',
    role: 'Daarektara Olaanaa (Principal)',
    department: 'Hoggansa Mana Barnootaa (Administration)',
    qualification: 'Digirii Lammaffaa (MA in Educational Leadership)'
  },
  'stk-2': {
    fullName: 'Adde Zahaaraa Huseen (Zahara Hussein)',
    role: 'Itti-aantuu Daarektaraa (Vice Principal)',
    department: 'Barnootaa fi Sirna Qajeelchaa (Academics)',
    qualification: 'Digirii Jalqabaa (BEd in Curriculum)'
  },
  'stk-3': {
    fullName: 'Obbo Daan\'el Nigusee (Daniel Nigussie)',
    role: 'Reejistiraara Barattootaa (Registrar)',
    department: 'Galmee fi Ragaa Barattootaa (Admissions)',
    qualification: 'Digirii Jalqabaa (BA in Management)'
  },
  'stk-4': {
    fullName: 'Adde Salaamawit Abarraa (Selamawit Abera)',
    role: 'Abbaa Herregaa Olaantuu (Chief Accountant)',
    department: 'Faayinaansii fi Kaffaltii (Finance)',
    qualification: 'Digirii Jalqabaa (BA in Accounting)'
  },
  'stk-5': {
    fullName: 'Barsiisaa Bafqaaduu Xilahun (Befekadu Tilahun)',
    role: 'Barsiisaa Olaanaa Herregaa (Senior Math Teacher)',
    department: 'Kutaa Barnoota Herregaa (Mathematics)',
    qualification: 'Digirii Lammaffaa (MSc in Mathematics)'
  },
  'stk-6': {
    fullName: 'Barsiistuu Salaamawit Taaddasaa (Selamawit Tadese)',
    role: 'Barsiistuu Afaan Oromoo fi Kutaadhaa (Homeroom Teacher)',
    department: 'Kutaa Afaan Oromoo (Language Dept)',
    qualification: 'Digirii Jalqabaa (BEd in Afaan Oromoo)'
  },
  'stk-7': {
    fullName: 'Obbo Toofiq Kadiir (Tofik Kedir)',
    role: 'Barsiisaa Fiiziksii fi Qindeessaa Laabiraatoorii (Lab Coordinator)',
    department: 'Kutaa Saayinsii fi Laabiraatoorii (Science Dept)',
    qualification: 'Digirii Jalqabaa (BSc in Physics)'
  },
  'stk-8': {
    fullName: 'Adde Muluu Balaxxa (Mulu Belete)',
    role: 'Hoggantuu Mana Dubbisaa (Librarian)',
    department: 'Kutaa Mana Dubbisaa (Library Services)',
    qualification: 'Dippiloomaa fi Digirii Saayinsii Mana Dubbisaa (Library Science)'
  }
};

export const getLocalizedStakeholder = (
  st: SchoolStakeholder,
  lang?: Language
): SchoolStakeholder => {
  if (!isOromo(lang)) return st;
  const oromo = OROMO_STAKEHOLDERS[st.id];
  if (!oromo) return st;
  return {
    ...st,
    fullName: oromo.fullName,
    roleCustomTitle: oromo.role,
    officeOrDepartment: oromo.department || st.officeOrDepartment
  };
};

export const getLocalizedStakeholders = (
  stakeholders: SchoolStakeholder[],
  lang?: Language
): SchoolStakeholder[] => {
  return stakeholders.map((s) => getLocalizedStakeholder(s, lang));
};

// =========================================================================
// 10. DISCIPLINE REPORTS LOCALIZATION
// =========================================================================
const OROMO_DISCIPLINE: Record<
  string,
  {
    targetStudentName: string;
    reporterName: string;
    incidentLocation: string;
    description: string;
    actionTaken: string;
    directorRemarks: string;
    reviewedByDirectorName: string;
  }
> = {
  'disc-001': {
    targetStudentName: 'Naahom Daan\'el Taaddasaa (Nahom Daniel Tadese)',
    reporterName: 'Barataa Daree Tokkoo (Hiriyaa Daree)',
    incidentLocation: 'Daree 10A keessatti yeroo barnoota herregaa',
    description:
      'Yeroo barnootaa barattoota kaan jeequun fi sagalee sirrii hin taane dhageessisuun xiyyeeffannoo akka hin kennine gochaa jira. Yeroo baay\'ee akeekkachiifameera.',
    actionTaken: 'Gorsa xiin-sammuu fi akeekkachiisa afaanii kennameera',
    directorRemarks:
      'Barataa fi barsiisaa kutaadhaa wajjin dubbanneerra; gorsi kennamee waadaa seeneera. Yeroo itti aanu maatiin ni waamama.',
    reviewedByDirectorName: 'Obbo Guutamaa Waaqoo (Daarektara)'
  },
  'disc-002': {
    targetStudentName: 'Roobel Salamoon Habtee (Robel Solomon Habte)',
    reporterName: 'Barsiisaa Alamaayyoo Dajanee (Barsiisaa Kutaadhaa)',
    incidentLocation: 'Balbala bahiinsaa mana barnootaa dura',
    description:
      'Hiriyaa daree wajjin wal-dhabdee uumuun gara lola qaamaatti seenee seera uffataa tarsaasee fi barattoota sodachiseera.',
    actionTaken: 'Maatiin waamamee mariin gaggeeffame; akeekkachiisni barreeffamaa kenname',
    directorRemarks:
      'Dhimmi kun maatii wajjin furamee barataan qajeelcha argateera.',
    reviewedByDirectorName: 'Obbo Guutamaa Waaqoo (Daarektara)'
  }
};

export const getLocalizedDiscipline = (
  report: StudentDisciplineReport,
  lang?: Language
): StudentDisciplineReport => {
  if (!isOromo(lang)) return report;
  const oromo = OROMO_DISCIPLINE[report.id];
  if (!oromo) return report;
  return {
    ...report,
    targetStudentName: oromo.targetStudentName,
    reporterName: oromo.reporterName,
    incidentLocation: oromo.incidentLocation,
    description: oromo.description,
    actionTaken: oromo.actionTaken,
    directorRemarks: oromo.directorRemarks,
    reviewedByDirectorName: oromo.reviewedByDirectorName,
    acknowledgedByDirectorName: oromo.reviewedByDirectorName
  };
};

export const getLocalizedDisciplineList = (
  reports: StudentDisciplineReport[],
  lang?: Language
): StudentDisciplineReport[] => {
  return reports.map((r) => getLocalizedDiscipline(r, lang));
};

// =========================================================================
// 11. BUREAU STANDARDS LOCALIZATION
// =========================================================================
const OROMO_STANDARDS: Record<
  string,
  { name: string; category: string; description: string }
> = {
  'std-1': {
    name: 'Qulqullina Barnootaa fi Raawwii Sirna Barnootaa (Curriculum Implementation)',
    category: 'Barnootaa fi Gahumsa (Academic)',
    description:
      'Silabasii fi kitaabilee barnootaa haaraa Oromiyaa fi Ministeera Barnootaatiin qophaa\'an 100% daree keessatti hojiirra oolchuu.'
  },
  'std-2': {
    name: 'Gahumsa Ogummaa fi Leenjii Barsiisotaa (Teacher CPD & Certification)',
    category: 'Misooma Barsiisotaa (Teacher Standards)',
    description:
      'Barsiisonni hundi ragaa Fayda fi eeyyama ogummaa qabaachuu, leenjii itti-fufiinsa qabu (CPD) waggaatti sa\'aatii 60 xumuruu.'
  },
  'std-3': {
    name: 'Qabeenya Laabiraatoorii fi Saayinsii (Science Laboratories)',
    category: 'Bu\'uuraalee Misoomaa (Infrastructure)',
    description:
      'Laabiraatoorii Fiiziksii, Keemistirii fi Baayoloojii meeshaalee nageenyaa fi keemikaala barbaachisuun guutuu.'
  },
  'std-4': {
    name: 'Mana Dubbisaa Dijitaalaa fi Kitaabota (Library Standards)',
    category: 'Bu\'uuraalee Misoomaa (Infrastructure)',
    description:
      'Kitaabilee qulqullina qaban barattootaaf dhiyeessuu fi kompiitara intarneetii qabu daree dubbisaatti qopheessuu.'
  },
  'std-5': {
    name: 'Hoggansa fi Hirmannaa Maatii (Community & Leadership)',
    category: 'Hoggansa (Governance)',
    description:
      'Koree maatii fi barsiisotaa (PTA) cimsuu fi qabeenya mana barnootaa seeraan bulchuu.'
  }
};

export const getLocalizedStandard = (
  std: BureauStandardCriteria,
  lang?: Language
): BureauStandardCriteria => {
  if (!isOromo(lang)) return std;
  const oromo = OROMO_STANDARDS[std.id];
  if (!oromo) return std;
  return {
    ...std,
    criterionTitle: oromo.name,
    category: oromo.category,
    description: oromo.description
  };
};

export const getLocalizedStandards = (
  standards: BureauStandardCriteria[],
  lang?: Language
): BureauStandardCriteria[] => {
  return standards.map((s) => getLocalizedStandard(s, lang));
};

// =========================================================================
// 12. SCHOOL BANK ACCOUNTS LOCALIZATION
// =========================================================================
const OROMO_BANK_ACCOUNTS: Record<
  string,
  { bankName: string; accountName: string }
> = {
  'sba-1': {
    bankName: 'Baankii Daldala Itoophiyaa (Commercial Bank of Ethiopia)',
    accountName: 'M/B Sadarkaa 2ffaa Waliigalaa Shashamannee - Herrega Galii'
  },
  'sba-2': {
    bankName: 'Telebirr (Telebirr SuperApp - Ethio Telecom)',
    accountName: 'Kaffaltii Ji\'aa M/B Sadarkaa 2ffaa Shashamannee'
  },
  'sba-3': {
    bankName: 'Baankii Awaash (Awash International Bank)',
    accountName: 'M/B Sadarkaa 2ffaa Shashamannee - Herrega Kaffaltii Barattootaa'
  },
  'sba-4': {
    bankName: 'Baankii Daashan (Dashen Bank)',
    accountName: 'M/B Sadarkaa 2ffaa Shashamannee'
  }
};

export const getLocalizedBankAccount = (
  acc: SchoolBankAccount,
  lang?: Language
): SchoolBankAccount => {
  if (!isOromo(lang)) return acc;
  const oromo = OROMO_BANK_ACCOUNTS[acc.id];
  if (!oromo) return acc;
  return {
    ...acc,
    bankName: oromo.bankName,
    accountHolder: oromo.accountName
  };
};

export const getLocalizedBankAccounts = (
  accounts: SchoolBankAccount[],
  lang?: Language
): SchoolBankAccount[] => {
  return accounts.map((a) => getLocalizedBankAccount(a, lang));
};

// =========================================================================
// 13. SCHOOL USER CODES LOCALIZATION
// =========================================================================
const OROMO_SCHOOL_CODES: Record<
  string,
  { fullName: string; assignedClassOrSubject: string }
> = {
  'sc-1': {
    fullName: 'Obbo Guutamaa Waaqoo (Daarektara)',
    assignedClassOrSubject: 'Hoggansa Waliigalaa Mana Barnootaa'
  },
  'sc-2': {
    fullName: 'Barsiisaa Bafqaaduu Xilahun (Herrega)',
    assignedClassOrSubject: 'Herrega Kutaa 10A, 10B'
  },
  'sc-3': {
    fullName: 'Barsiistuu Salaamawit Taaddasaa (Afaan Oromoo)',
    assignedClassOrSubject: 'Afaan Oromoo Kutaa 10 & 11'
  },
  'sc-4': {
    fullName: 'Kiyaar Kadiir Alii (Barataa)',
    assignedClassOrSubject: 'Kutaa 10ffaa Daree A'
  },
  'sc-5': {
    fullName: 'Obbo Kadiir Alii (Maatii Kiyaar)',
    assignedClassOrSubject: 'Maatii Barataa Kiyaar Kadiir (10A)'
  },
  'sc-6': {
    fullName: 'Dr. Tasfaayee Baqqalaa (Walitti-qabaa Boordii / Abbaa Qabeenyaa)',
    assignedClassOrSubject: 'Boordii Eegumsa Olaanaa Mana Barnootaa'
  },
  'sc-7': {
    fullName: 'Adde Salaamawit Abarraa (Abbaa Herregaa Olaantuu)',
    assignedClassOrSubject: 'Waajjira Faayinaansii fi Kaffaltii'
  },
  'sc-8': {
    fullName: 'Obbo Daan\'el Nigusee (Reejistiraara Barattootaa)',
    assignedClassOrSubject: 'Simannaa fi Galmee Barattootaa'
  }
};

export const getLocalizedSchoolCode = (
  code: SchoolUserCode,
  lang?: Language
): SchoolUserCode => {
  if (!isOromo(lang)) return code;
  const oromo = OROMO_SCHOOL_CODES[code.id];
  if (!oromo) return code;
  return {
    ...code,
    fullName: oromo.fullName,
    assignedClassOrSubject: oromo.assignedClassOrSubject
  };
};

export const getLocalizedSchoolCodes = (
  codes: SchoolUserCode[],
  lang?: Language
): SchoolUserCode[] => {
  return codes.map((c) => getLocalizedSchoolCode(c, lang));
};

// =========================================================================
// 14. NIGHT CLASS SCHEDULE LOCALIZATION
// =========================================================================
const OROMO_NIGHT_SCHEDULE: Record<
  string,
  {
    subject: string;
    teacherName: string;
    classroomNumber: string;
    daysOfWeek: string;
    startTime?: string;
    endTime?: string;
    standardTime?: string;
  }
> = {
  'ncs-1': {
    subject: 'Herrega (Mathematics Grade 10)',
    teacherName: 'B/saa Bafqaaduu Xilahun (Herrega)',
    classroomNumber: 'Kutaa 14 (Daree Galgalaa)',
    daysOfWeek: 'Wiixata, Roobii, Jimaata',
    startTime: '11:30 Galgala',
    endTime: '12:15 Galgala',
    standardTime: '5:30 PM - 6:15 PM'
  },
  'ncs-2': {
    subject: 'Fiiziksii (Physics Grade 10)',
    teacherName: 'B/saa Tolasaa Gutamaa (Fiiziksii)',
    classroomNumber: 'Kutaa 14 (Daree Galgalaa)',
    daysOfWeek: 'Wiixata, Roobii, Jimaata',
    startTime: '12:20 Galgala',
    endTime: '1:05 Galgala',
    standardTime: '6:20 PM - 7:05 PM'
  },
  'ncs-3': {
    subject: 'Afaan Ingiliffaa (English Grade 10)',
    teacherName: 'B/ttii Amiinaa Nuurii (Ingiliffa)',
    classroomNumber: 'Kutaa 14 (Daree Galgalaa)',
    daysOfWeek: 'Kibxata, Kamisa',
    startTime: '1:25 Galgala',
    endTime: '2:10 Galgala',
    standardTime: '7:25 PM - 8:10 PM'
  },
  'ncs-4': {
    subject: 'Afaan Oromoo (Oromo Language Grade 10)',
    teacherName: 'B/ttii Salaamawit Taaddasaa (Afaan Oromoo)',
    classroomNumber: 'Kutaa 14 (Daree Galgalaa)',
    daysOfWeek: 'Kibxata, Kamisa',
    startTime: '2:15 Galgala',
    endTime: '3:00 Halkan',
    standardTime: '8:15 PM - 9:00 PM'
  },
  'ns-1': {
    subject: 'Herrega (Mathematics Grade 10)',
    teacherName: 'B/saa Bafqaaduu Xilahun',
    classroomNumber: 'Kutaa 10A (Daree Galgalaa)',
    daysOfWeek: 'Wiixata, Roobii, Jimaata'
  },
  'ns-2': {
    subject: 'Afaan Ingiliffaa (English Grade 10)',
    teacherName: 'B/ttii Caaltuu Mokonnon',
    classroomNumber: 'Kutaa 10A (Daree Galgalaa)',
    daysOfWeek: 'Wiixata, Roobii, Jimaata'
  },
  'ns-3': {
    subject: 'Afaan Oromoo (Grade 11 Social)',
    teacherName: 'B/ttii Salaamawit Taaddasaa',
    classroomNumber: 'Kutaa 11B (Daree Galgalaa)',
    daysOfWeek: 'Wiixata, Roobii, Jimaata'
  },
  'ns-4': {
    subject: 'Fiiziksii (Physics Grade 12 Natural)',
    teacherName: 'B/saa Toofiq Kadiir',
    classroomNumber: 'Kutaa 12A (Daree Galgalaa)',
    daysOfWeek: 'Kibxata, Kamisa'
  }
};

export const getLocalizedNightSchedule = (
  sch: NightClassScheduleItem,
  lang?: Language
): NightClassScheduleItem => {
  if (!isOromo(lang)) return sch;
  const oromo = OROMO_NIGHT_SCHEDULE[sch.id];
  if (!oromo) return sch;
  return {
    ...sch,
    subject: oromo.subject,
    teacherName: oromo.teacherName,
    classroomNumber: oromo.classroomNumber,
    daysOfWeek: oromo.daysOfWeek,
    startTime: oromo.startTime || sch.startTime,
    endTime: oromo.endTime || sch.endTime,
    standardTime: oromo.standardTime || sch.standardTime
  };
};

export const getLocalizedNightScheduleList = (
  list: NightClassScheduleItem[],
  lang?: Language
): NightClassScheduleItem[] => {
  return list.map((item) => getLocalizedNightSchedule(item, lang));
};
