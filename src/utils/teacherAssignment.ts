import { AppUserSession, TrainingMaterial, TeacherExam } from '../types';
import { StorageService } from './storage';

export interface TeacherAssignment {
  primarySubject: string;
  subjects: string[];
  primaryGrade: number;
  grades: number[];
  primarySubjectLabel: string;
  primaryGradeLabel: string;
  assignedRawString: string;
}

export const CANONICAL_SUBJECTS = [
  'Mathematics (ሂሳብ)',
  'Afaan Oromoo (ኦሮሚኛ)',
  'English (እንግሊዝኛ)',
  'Physics (ፊዚክስ)',
  'Chemistry (ኬሚስትሪ)',
  'Biology (ባዮሎጂ)',
  'Citizenship & Social Studies (ስነ-ዜጋ)',
  'General Pedagogy & CPD (አጠቃላይ ስነ-ዘዴ)'
];

/**
 * Extracts a numeric list of grades covered by a grade range string.
 * e.g. "Grades 9 - 12" -> [9, 10, 11, 12]
 * e.g. "Kutaa 5 - 12" -> [5, 6, 7, 8, 9, 10, 11, 12]
 * e.g. "Grade 10" -> [10]
 * e.g. "All Grades (1 - 12)" -> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
 */
export function parseGradeRange(str: string): number[] {
  if (!str) return [9, 10]; // default secondary

  const lower = str.toLowerCase();
  if (lower.includes('all') || lower.includes('ሁሉም')) {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  }

  // Check for range like "9 - 12" or "9-10" or "7 - 10"
  const rangeMatch = str.match(/([0-9]+)\s*(?:-|to|–|—|እና|&)\s*([0-9]+)/i);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    const end = parseInt(rangeMatch[2], 10);
    if (!isNaN(start) && !isNaN(end) && start <= end && start >= 1 && end <= 12) {
      const list: number[] = [];
      for (let g = start; g <= end; g++) {
        list.push(g);
      }
      return list;
    }
  }

  // Single numbers like "Grade 10" or "Grade 9, 10"
  const numbers = str.match(/\b([1-9]|1[0-2])\b/g);
  if (numbers && numbers.length > 0) {
    const list = Array.from(new Set(numbers.map((n) => parseInt(n, 10)))).sort((a, b) => a - b);
    return list;
  }

  if (lower.includes('primary') || lower.includes('አንደኛ ደረጃ')) {
    return [1, 2, 3, 4, 5, 6];
  }
  if (lower.includes('middle') || lower.includes('መካከለኛ')) {
    return [7, 8];
  }
  if (lower.includes('secondary') || lower.includes('2ኛ ደረጃ')) {
    return [9, 10, 11, 12];
  }

  return [9, 10];
}

/**
 * Normalizes subject string into canonical form
 */
export function normalizeSubject(raw: string): string {
  if (!raw) return 'Mathematics (ሂሳብ)';
  const lower = raw.toLowerCase();

  if (lower.includes('math') || lower.includes('ሂሳብ')) return 'Mathematics (ሂሳብ)';
  if (lower.includes('orom') || lower.includes('ኦሮሚኛ') || lower.includes('afaan')) return 'Afaan Oromoo (ኦሮሚኛ)';
  if (lower.includes('english') || lower.includes('እንግሊዝኛ')) return 'English (እንግሊዝኛ)';
  if (lower.includes('physic') || lower.includes('ፊዚክስ')) return 'Physics (ፊዚክስ)';
  if (lower.includes('chemist') || lower.includes('ኬሚስትሪ')) return 'Chemistry (ኬሚስትሪ)';
  if (lower.includes('bio') || lower.includes('ባዮ')) return 'Biology (ባዮሎጂ)';
  if (lower.includes('civic') || lower.includes('ዜጋ') || lower.includes('citizenship')) return 'Citizenship & Social Studies (ስነ-ዜጋ)';
  if (lower.includes('pedagogy') || lower.includes('cpd') || lower.includes('ስነ-ዘዴ') || lower.includes('ስርዓተ')) {
    return 'General Pedagogy & CPD (አጠቃላይ ስነ-ዘዴ)';
  }

  return raw;
}

/**
 * Resolves a teacher's assigned subjects and grade levels based on their session,
 * access codes, and registered school stakeholder profile.
 */
export function getTeacherAssignment(currentUser: AppUserSession | null): TeacherAssignment {
  let rawAssigned = '';
  let detectedSubject = 'Mathematics (ሂሳብ)';
  let detectedGrades: number[] = [10];

  if (currentUser) {
    // 1. Check schoolCodes table
    const schoolCodes = StorageService.getSchoolCodes();
    const matchedCode = schoolCodes.find(
      (c) => c.accessCode === currentUser.accessCode || c.id === currentUser.identifier
    );

    if (matchedCode && matchedCode.assignedClassOrSubject) {
      rawAssigned = matchedCode.assignedClassOrSubject;
    } else if (currentUser.staffDepartment) {
      rawAssigned = currentUser.staffDepartment;
    } else {
      // 2. Check stakeholders table
      const stakeholders = StorageService.getStakeholders();
      const matchedStk = stakeholders.find(
        (s) =>
          s.accessCode === currentUser.accessCode ||
          (currentUser.name && s.fullName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0]))
      );
      if (matchedStk) {
        rawAssigned = `${matchedStk.officeOrDepartment || ''} ${matchedStk.roleCustomTitle || ''}`;
      }
    }

    if (!rawAssigned && currentUser.name) {
      rawAssigned = currentUser.name;
    }
  }

  // Parse subject from rawAssigned
  if (rawAssigned) {
    detectedSubject = normalizeSubject(rawAssigned);
    const parsedGrades = parseGradeRange(rawAssigned);
    if (parsedGrades.length > 0) {
      detectedGrades = parsedGrades;
    }
  }

  const primaryGrade = detectedGrades[0] || 10;
  const gradeLabel =
    detectedGrades.length === 1
      ? `${detectedGrades[0]}ኛ ክፍል (Grade ${detectedGrades[0]})`
      : `${detectedGrades[0]}ኛ - ${detectedGrades[detectedGrades.length - 1]}ኛ ክፍል (Grades ${detectedGrades[0]}-${detectedGrades[detectedGrades.length - 1]})`;

  return {
    primarySubject: detectedSubject,
    subjects: [detectedSubject],
    primaryGrade,
    grades: detectedGrades,
    primarySubjectLabel: detectedSubject,
    primaryGradeLabel: gradeLabel,
    assignedRawString: rawAssigned || 'Mathematics Grade 10A, 10B'
  };
}

/**
 * Evaluates whether a training material is relevant for the teacher's subject and grade level.
 */
export function isTrainingMaterialForTeacher(
  material: TrainingMaterial,
  assignment: TeacherAssignment
): boolean {
  // 1. Subject match:
  // Material matches if it belongs to the teacher's subject OR is general pedagogy/CPD
  const matSubjectLower = material.subject.toLowerCase();
  const teacherSubjectLower = assignment.primarySubject.toLowerCase();

  const isGeneralPedagogy =
    matSubjectLower.includes('pedagogy') ||
    matSubjectLower.includes('cpd') ||
    matSubjectLower.includes('ስነ-ዘዴ') ||
    matSubjectLower.includes('curriculum') ||
    matSubjectLower.includes('ስርዓተ-ትምህርት') ||
    material.tags.some((t) => t.toLowerCase().includes('pedagogy'));

  const matchesSubject =
    isGeneralPedagogy ||
    matSubjectLower.includes(teacherSubjectLower.split(' ')[0].toLowerCase()) ||
    teacherSubjectLower.includes(matSubjectLower.split(' ')[0].toLowerCase());

  if (!matchesSubject) {
    return false;
  }

  // 2. Grade Level match:
  // Material grade level range must overlap with at least one grade the teacher teaches
  const materialGrades = parseGradeRange(material.gradeLevels);
  const matchesGrade = assignment.grades.some((g) => materialGrades.includes(g));

  return matchesGrade;
}

/**
 * Evaluates whether an examination is intended for the teacher's subject and grade level.
 */
export function isExamForTeacher(
  exam: TeacherExam,
  assignment: TeacherAssignment
): boolean {
  const examSubLower = exam.subject.toLowerCase();
  const teacherSubLower = assignment.primarySubject.toLowerCase();

  const isGeneralPedagogy =
    examSubLower.includes('pedagogy') ||
    examSubLower.includes('cpd') ||
    examSubLower.includes('ስነ-ዘዴ') ||
    examSubLower.includes('curriculum') ||
    examSubLower.includes('classroom management') ||
    examSubLower.includes('አመራር');

  const matchesSubject =
    isGeneralPedagogy ||
    examSubLower.includes(teacherSubLower.split(' ')[0].toLowerCase()) ||
    teacherSubLower.includes(examSubLower.split(' ')[0].toLowerCase());

  if (!matchesSubject) {
    return false;
  }

  // Grade level match:
  const examGradeStr = exam.targetGradeLevels || exam.targetCategory || 'all';
  const examGrades = parseGradeRange(examGradeStr);
  const matchesGrade = assignment.grades.some((g) => examGrades.includes(g));

  return matchesGrade;
}
