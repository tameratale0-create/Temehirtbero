import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  UserCheck,
  UserX,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  FileText,
  Printer,
  Sparkles,
  Building2,
  Calendar,
  Lock,
  Unlock,
  Check,
  X,
  ChevronRight,
  Phone,
  MessageSquare,
  Scale,
  Award,
  AlertCircle,
  GraduationCap,
  ShieldCheck,
  HeartHandshake,
  Trash2,
  Info
} from 'lucide-react';
import {
  School,
  StudentRecord,
  AppUserSession,
  Language,
  StudentDisciplineReport,
  MisconductCategory,
  DisciplineReportSeverity,
  DisciplineReportStatus
} from '../types';
import { StorageService } from '../utils/storage';
import { getLocalizedDisciplineList } from '../utils/localizedData';
import { OfflineSyncManager } from '../utils/offlineSync';

interface StudentDisciplineDeskProps {
  school: School;
  students: StudentRecord[];
  currentUser: AppUserSession | null;
  currentLang: Language;
  onReportsUpdated?: (reports: StudentDisciplineReport[]) => void;
  preSelectedGrade?: number;
  preSelectedSection?: string;
  initialMode?: 'tip_off' | 'director_board' | 'classmates';
  onCloseModal?: () => void;
}

export const StudentDisciplineDesk: React.FC<StudentDisciplineDeskProps> = ({
  school,
  students,
  currentUser,
  currentLang,
  onReportsUpdated,
  preSelectedGrade,
  preSelectedSection,
  initialMode,
  onCloseModal
}) => {
  const isDirectorOrAdmin =
    currentUser?.role === 'school_director' ||
    currentUser?.role === 'school_owner' ||
    currentUser?.role === 'bureau_admin' ||
    currentUser?.role === 'bureau_staff';

  const isStudent = currentUser?.role === 'student';
  const isParent = currentUser?.role === 'parent';
  const isTeacher = currentUser?.role === 'teacher';

  // Determine initial active sub-tab
  const defaultTab = initialMode
    ? initialMode
    : isDirectorOrAdmin
    ? 'director_board'
    : 'tip_off';

  const [activeTab, setActiveTab] = useState<'tip_off' | 'director_board' | 'classmates'>(defaultTab);

  // Quick Acknowledgment Input Modal
  const [acknowledgingReport, setAcknowledgingReport] = useState<StudentDisciplineReport | null>(null);
  const [quickAcknowledgeRemarks, setQuickAcknowledgeRemarks] = useState<string>('');

  // All discipline reports for this school
  const [reports, setReports] = useState<StudentDisciplineReport[]>(() =>
    StorageService.getDisciplineReports(school.id)
  );

  // Success toast
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Active report for Director Action / Details Modal
  const [selectedReport, setSelectedReport] = useState<StudentDisciplineReport | null>(null);
  const [directorRemarksInput, setDirectorRemarksInput] = useState<string>('');
  const [actionTakenInput, setActionTakenInput] = useState<string>('የቃል ማስጠንቀቂያና የስነ-ምግባር ምክር ተሰጥቷል');
  const [newStatusInput, setNewStatusInput] = useState<DisciplineReportStatus>('under_investigation');

  // =========================================================================
  // TIP-OFF SUBMISSION FORM STATE
  // =========================================================================
  // Find current student if currentUser is student
  const studentSelf = useMemo(() => {
    if (!isStudent) return null;
    return students.find(
      (s) =>
        s.accessCode === currentUser?.accessCode ||
        s.studentIdNumber === currentUser?.identifier ||
        s.fullName.toLowerCase().includes(currentUser?.name?.toLowerCase() || '')
    );
  }, [students, currentUser, isStudent]);

  // Selected Grade and Section for tip-off form
  const [formGrade, setFormGrade] = useState<number>(() => {
    if (preSelectedGrade) return preSelectedGrade;
    if (studentSelf) return studentSelf.grade;
    return 10;
  });

  const [formSection, setFormSection] = useState<string>(() => {
    if (preSelectedSection) return preSelectedSection;
    if (studentSelf) return studentSelf.section;
    return 'A';
  });

  // Target Student selected for misconduct
  const [selectedTargetStudent, setSelectedTargetStudent] = useState<StudentRecord | null>(null);
  const [targetStudentNameManual, setTargetStudentNameManual] = useState<string>('');

  // Classmates search filter on the form
  const [classmatesSearch, setClassmatesSearch] = useState<string>('');

  // Misconduct Form Fields
  const [reporterType, setReporterType] = useState<'student' | 'parent' | 'teacher' | 'anonymous'>(() => {
    if (isStudent) return 'student';
    if (isParent) return 'parent';
    if (isTeacher) return 'teacher';
    return 'student';
  });
  const [isConfidential, setIsConfidential] = useState<boolean>(true);
  const [reporterNameInput, setReporterNameInput] = useState<string>(() => {
    if (isStudent && studentSelf) return studentSelf.fullName;
    if (currentUser?.name) return currentUser.name;
    return '';
  });
  const [reporterPhoneInput, setReporterPhoneInput] = useState<string>(() => {
    if (isParent && studentSelf?.parentPhone) return studentSelf.parentPhone;
    return '+251 9';
  });

  const [category, setCategory] = useState<MisconductCategory>('classroom_disruption');
  const [customCategoryTitle, setCustomCategoryTitle] = useState<string>('');
  const [severity, setSeverity] = useState<DisciplineReportSeverity>('medium');
  const [incidentDate, setIncidentDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [incidentTime, setIncidentTime] = useState<string>('4:00 ከሰዓት');
  const [incidentLocation, setIncidentLocation] = useState<string>('በክፍል ውስጥ');
  const [description, setDescription] = useState<string>('');
  const [witnesses, setWitnesses] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // =========================================================================
  // CLASSMATES ROSTER CALCULATION
  // "አብረው የሚማሩ የክፍል ተማሪዎች ስም ዝርዝር በመጠቆምያው ገፅ ላይ እንዲመጣ አርገው"
  // =========================================================================
  const classmates = useMemo(() => {
    return students.filter(
      (s) =>
        s.schoolId === school.id &&
        Number(s.grade) === Number(formGrade) &&
        s.section.toUpperCase() === formSection.toUpperCase()
    );
  }, [students, school.id, formGrade, formSection]);

  const filteredClassmates = useMemo(() => {
    if (!classmatesSearch.trim()) return classmates;
    const q = classmatesSearch.toLowerCase().trim();
    return classmates.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.studentIdNumber.toLowerCase().includes(q) ||
        c.accessCode.toLowerCase().includes(q)
    );
  }, [classmates, classmatesSearch]);

  // Available grades and sections in this school
  const availableGrades = useMemo(() => {
    const gradesSet = new Set<number>();
    students.forEach((s) => gradesSet.add(s.grade));
    const list = Array.from(gradesSet).sort((a, b) => a - b);
    return list.length > 0 ? list : [9, 10, 11, 12];
  }, [students]);

  const availableSections = useMemo(() => {
    const secSet = new Set<string>();
    students.filter((s) => Number(s.grade) === Number(formGrade)).forEach((s) => secSet.add(s.section));
    const list = Array.from(secSet).sort();
    return list.length > 0 ? list : ['A', 'B', 'C', 'N1'];
  }, [students, formGrade]);

  // Handle selecting a classmate from the roster
  const handleSelectClassmate = (student: StudentRecord) => {
    setSelectedTargetStudent(student);
    setTargetStudentNameManual(student.fullName);
  };

  // Misconduct category definitions
  const misconductCategories: {
    key: MisconductCategory;
    titleAm: string;
    icon: string;
    description: string;
    defaultSeverity: DisciplineReportSeverity;
  }[] = [
    {
      key: 'classroom_disruption',
      titleAm: 'የክፍል ረብሻ እና መምህራንን አለማክበር',
      icon: '🚫',
      description: 'መምህሩ ሲያስተምሩ መረበሽ፣ ያልተገባ ጩኸት፣ የትምህርት ክፍለ-ጊዜን ማስተጓጎል',
      defaultSeverity: 'medium'
    },
    {
      key: 'fighting_violence',
      titleAm: 'ፀብ፣ አካላዊ ጥቃት እና ማስፈራራት (Bullying)',
      icon: '🥊',
      description: 'ከተማሪዎች ጋር መጣላት፣ መደባደብ፣ በቡድን ማስፈራራት፣ አካላዊ ጉዳት ማድረስ',
      defaultSeverity: 'high'
    },
    {
      key: 'verbal_abuse_harassment',
      titleAm: 'ስድብ፣ ዛቻ እና የሞራል ማሸማቀቅ',
      icon: '🗣️',
      description: 'አጸያፊ ቃላት መሳደብ፣ ተማሪዎችን ማሸማቀቅ፣ ስም ማጥፋት፣ ማስፈራራት',
      defaultSeverity: 'medium'
    },
    {
      key: 'substance_smoking_khat',
      titleAm: 'አደንዛዥ እፅ፣ ጫት ወይም ሲጋራ መቃም/ማጨስ',
      icon: '🚬',
      description: 'በትምህርት ቤት ሰዓት ወይም ዩኒፎርም ለብሶ ጫት መቃም፣ ሲጋራ ማጨስ፣ አደንዛዥ እፅ መጠቀም',
      defaultSeverity: 'critical'
    },
    {
      key: 'property_damage_vandalism',
      titleAm: 'የትምህርት ቤት ንብረት ማውደም (Vandalism)',
      icon: '🔨',
      description: 'ዴስክ፣ በር፣ መስታወት፣ መጽሐፍት ወይም የትምህርት መሳሪያዎችን ሆን ብሎ መስበርና ማበላሸት',
      defaultSeverity: 'high'
    },
    {
      key: 'truancy_skipping_class',
      titleAm: 'ከትምህርት ቤት ማምለጥ እና አለመገኘት',
      icon: '🏃‍♂️',
      description: 'ወላጅ ሳያውቅ ከአጥር ዘሎ መውጣት፣ የተወሰኑ ክፍለ-ጊዜዎችን ቆርጦ መቅረት',
      defaultSeverity: 'medium'
    },
    {
      key: 'exam_cheating',
      titleAm: 'ፈተና ማጭበርበር እና ስርቆት',
      icon: '📝',
      description: 'በፈተና ወቅት ኩረጃ መኮረጅ፣ ኮፒ ማስገባት፣ የተማሪዎችን ንብረት ወይም ፈተና መስረቅ',
      defaultSeverity: 'high'
    },
    {
      key: 'digital_mobile_misuse',
      titleAm: 'የሞባይል ስልክ ተገቢ ያልሆነ አጠቃቀም',
      icon: '📱',
      description: 'በክፍል ውስጥ ስልክ መደወል/ጌም መጫወት፣ ያለፍቃድ ቪዲዮ/ፎቶ መቅረጽ እና ማሰራጨት',
      defaultSeverity: 'low'
    },
    {
      key: 'other_misconduct',
      titleAm: 'ሌላ የስነ-ምግባር ጉድለት (Other)',
      icon: '⚠️',
      description: 'የትምህርት ቤቱን ውስጣዊ ደንብ የሚጥስ ሌላ ማንኛውም የስነ-ምግባር ግድፈት',
      defaultSeverity: 'medium'
    }
  ];

  // Submit Tip-off handler
  const handleSubmitTipOff = (e: React.FormEvent) => {
    e.preventDefault();

    const targetName = selectedTargetStudent ? selectedTargetStudent.fullName : targetStudentNameManual.trim();

    if (!targetName) {
      alert('እባክዎ የስነ-ምግባር ችግር ያለበትን ተማሪ ከስም ዝርዝሩ ይምረጡ ወይም ስሙን ያስገቡ!');
      return;
    }

    if (!description.trim()) {
      alert('እባክዎ የተከሰተውን የስነ-ምግባር ችግር ሁኔታ በዝርዝር ይግለጹ!');
      return;
    }

    setIsSubmitting(true);

    const newReport: StudentDisciplineReport = {
      id: `disc-${Date.now()}`,
      schoolId: school.id,
      schoolName: school.name,
      targetStudentId: selectedTargetStudent?.id,
      targetStudentName: targetName,
      targetStudentCode: selectedTargetStudent?.studentIdNumber || selectedTargetStudent?.accessCode,
      grade: Number(formGrade),
      section: formSection,
      reporterType,
      reporterName: isConfidential && reporterType === 'anonymous' ? 'ሚስጥራዊ ጥቆማ' : reporterNameInput || 'ያልተገለጸ',
      reporterPhone: reporterPhoneInput,
      reporterCode: studentSelf?.accessCode,
      isConfidential,
      category,
      customCategoryTitle: category === 'other_misconduct' ? customCategoryTitle : undefined,
      severity,
      incidentDate,
      incidentTime,
      incidentLocation,
      description: description.trim(),
      witnesses: witnesses.trim(),
      status: 'pending_review',
      createdAt: new Date().toISOString()
    };

    const updated = StorageService.addDisciplineReport(newReport);
    setReports(updated);
    onReportsUpdated?.(updated);

    // Enqueue for offline sync
    OfflineSyncManager.enqueue(
      'student_discipline',
      'create',
      newReport.id,
      newReport,
      {
        authorName: newReport.reporterName,
        schoolName: school.name,
        description: `የስነ-ምግባር ጥቆማ፡ ${newReport.targetStudentName} (${newReport.grade}${newReport.section})`
      }
    );

    setIsSubmitting(false);
    setSuccessToast(`የስነ-ምግባር ጥቆማው ለትምህርት ቤቱ ዳይሬክተር በስኬት ተልኳል! የምስጢር መለያ ቁጥር፡ ${newReport.id}`);

    // Reset Form
    setSelectedTargetStudent(null);
    setTargetStudentNameManual('');
    setDescription('');
    setWitnesses('');
    setCustomCategoryTitle('');

    setTimeout(() => {
      setSuccessToast(null);
    }, 6000);
  };

  // =========================================================================
  // DIRECTOR ACTIONS
  // =========================================================================
  const handleOpenActionModal = (report: StudentDisciplineReport) => {
    setSelectedReport(report);
    setDirectorRemarksInput(report.directorRemarks || '');
    setActionTakenInput(report.actionTaken || 'የቃል ማስጠንቀቂያና የስነ-ምግባር ምክር ተሰጥቷል');
    setNewStatusInput(report.status);
  };

  const handleSaveDirectorAction = () => {
    if (!selectedReport) return;

    const nowIso = new Date().toISOString();
    const updatedReport: StudentDisciplineReport = {
      ...selectedReport,
      status: newStatusInput,
      directorRemarks: directorRemarksInput.trim(),
      actionTaken: actionTakenInput.trim(),
      actionDate: new Date().toISOString().split('T')[0],
      reviewedByDirectorName: currentUser?.name || 'ርዕሰ መምህር (School Director)',
      isAcknowledged: true,
      acknowledgedByDirectorName: selectedReport.acknowledgedByDirectorName || currentUser?.name || 'ርዕሰ መምህር (School Director)',
      directorAcknowledgedAt: selectedReport.directorAcknowledgedAt || nowIso,
      updatedAt: nowIso
    };

    const updatedList = StorageService.updateDisciplineReport(updatedReport);
    setReports(updatedList);
    onReportsUpdated?.(updatedList);

    // Enqueue offline sync
    OfflineSyncManager.enqueue(
      'student_discipline',
      'update',
      updatedReport.id,
      updatedReport,
      {
        authorName: updatedReport.reviewedByDirectorName,
        schoolName: school.name,
        description: `የዳይሬክተር እርምጃ ውሳኔ፡ ${updatedReport.targetStudentName} - ሁኔታ፡ ${updatedReport.status}`
      }
    );

    setSelectedReport(null);
    setSuccessToast(`የዳይሬክተር ውሳኔና ይፋዊ ማረጋገጫ (Acknowledgment) በተሳካ ሁኔታ ተመዝግቧል!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Quick Direct Acknowledgment with Timestamp
  const handleConfirmQuickAcknowledge = () => {
    if (!acknowledgingReport) return;
    const directorName = currentUser?.name || 'ርዕሰ መምህር (School Director)';
    const updated = StorageService.acknowledgeDisciplineReport(
      acknowledgingReport.id,
      directorName,
      quickAcknowledgeRemarks.trim() || undefined
    );
    setReports(updated);
    onReportsUpdated?.(updated);

    const acknowledgedItem = updated.find((r) => r.id === acknowledgingReport.id);
    if (acknowledgedItem) {
      OfflineSyncManager.enqueue(
        'student_discipline',
        'update',
        acknowledgedItem.id,
        acknowledgedItem,
        {
          authorName: directorName,
          schoolName: school.name,
          description: `የዳይሬክተር ዕውቅና መስጫ (Acknowledged): ${acknowledgedItem.targetStudentName} (${acknowledgedItem.grade}${acknowledgedItem.section})`
        }
      );
    }

    setAcknowledgingReport(null);
    setQuickAcknowledgeRemarks('');
    setSuccessToast(
      `የስነ-ምግባር መዝገቡ በዳይሬክተር ${directorName} ታይቶ ይፋዊ ማረጋገጫና ሰዓት (Timestamp) ተሰጥቶታል!`
    );
    setTimeout(() => setSuccessToast(null), 4500);
  };

  const handleDeleteReport = (id: string) => {
    if (!confirm('ይህን የስነ-ምግባር መዝገብ መሰረዝ ይፈልጋሉ?')) return;
    const updated = StorageService.deleteDisciplineReport(id);
    setReports(updated);
    onReportsUpdated?.(updated);
  };

  // Director Board Filters
  const [boardSearch, setBoardSearch] = useState<string>('');
  const [boardStatusFilter, setBoardStatusFilter] = useState<string>('all');
  const [boardCategoryFilter, setBoardCategoryFilter] = useState<string>('all');
  const [boardGradeFilter, setBoardGradeFilter] = useState<string>('all');

  const localizedReports = useMemo(
    () => getLocalizedDisciplineList(reports, currentLang),
    [reports, currentLang]
  );

  const filteredReports = useMemo(() => {
    return localizedReports.filter((r) => {
      if (boardStatusFilter !== 'all' && r.status !== boardStatusFilter) return false;
      if (boardCategoryFilter !== 'all' && r.category !== boardCategoryFilter) return false;
      if (boardGradeFilter !== 'all' && Number(r.grade) !== Number(boardGradeFilter)) return false;

      if (boardSearch.trim()) {
        const q = boardSearch.toLowerCase().trim();
        const matchesTarget = r.targetStudentName.toLowerCase().includes(q);
        const matchesDesc = r.description.toLowerCase().includes(q);
        const matchesReporter = (r.reporterName || '').toLowerCase().includes(q);
        return matchesTarget || matchesDesc || matchesReporter;
      }
      return true;
    });
  }, [localizedReports, boardStatusFilter, boardCategoryFilter, boardGradeFilter, boardSearch]);

  // Statistics
  const stats = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((r) => r.status === 'pending_review').length;
    const investigating = reports.filter(
      (r) => r.status === 'under_investigation' || r.status === 'parent_conference'
    ).length;
    const resolved = reports.filter(
      (r) => r.status === 'counseling_given' || r.status === 'action_taken' || r.status === 'resolved_closed'
    ).length;
    return { total, pending, investigating, resolved };
  }, [reports]);

  // Print Official Incident Letter
  const handlePrintReportLetter = (rep: StudentDisciplineReport) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>የተማሪ ስነ-ምግባር ግኝትና የዳይሬክተር ውሳኔ ሰነድ</title>
          <style>
            body { font-family: sans-serif; padding: 30px; line-height: 1.6; color: #0f172a; }
            .header { text-align: center; border-bottom: 3px double #047857; padding-bottom: 15px; margin-bottom: 20px; }
            .school-name { font-size: 18px; font-weight: 800; color: #064e3b; }
            .sub-title { font-size: 12px; color: #047857; font-weight: 600; margin-top: 4px; }
            .title { font-size: 16px; font-weight: 800; text-align: center; margin: 20px 0; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 8px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; font-size: 12px; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; }
            .full-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 15px; font-size: 12px; }
            .decision-box { background: #fefce8; border: 2px solid #eab308; border-radius: 8px; padding: 14px; margin-top: 20px; font-size: 13px; }
            .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; }
            .sign { border-top: 1px solid #000; width: 180px; text-align: center; padding-top: 5px; margin-top: 40px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="school-name">${school.name}</div>
            <div class="sub-title">የተማሪዎች ስነ-ምግባር፣ ስነ-ስርዓትና የምክር አገልግሎት ኮሚቴ ጽ/ቤት</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 3px;">ሻሸመኔ ከተማ አስተዳደር · የኦሮሚያ ክልል</div>
          </div>

          <div class="title">የተማሪ ስነ-ምግባር ግኝት እና የዳይሬክተር ይፋዊ የውሳኔ መዝገብ</div>

          <div class="grid">
            <div class="box">
              <strong>የተማሪው ስም፡</strong> ${rep.targetStudentName}<br/>
              <strong>የክፍል ደረጃና ሴክሽን፡</strong> ክፍል ${rep.grade} - ${rep.section}<br/>
              <strong>የተማሪ መለያ ቁጥር፡</strong> ${rep.targetStudentCode || 'የክፍል ተማሪ'}
            </div>
            <div class="box">
              <strong>የጥቆማ መለያ ቁጥር፡</strong> ${rep.id}<br/>
              <strong>የተከሰተበት ቀን፡</strong> ${rep.incidentDate} (${rep.incidentTime || 'ሰዓት አልተጠቀሰም'})<br/>
              <strong>የተከሰተበት ቦታ፡</strong> ${rep.incidentLocation || 'በትምህርት ቤት ግቢ'}
            </div>
          </div>

          <div class="full-box">
            <strong>የስነ-ምግባር ጥሰት አይነት፡</strong> ${rep.category}<br/>
            <strong>የስነ-ምግባር ችግሩ ዝርዝር ሁኔታ፡</strong><br/>
            ${rep.description}
          </div>

          <div class="decision-box">
            <strong>የዳይሬክተር ግምገማና ውሳኔ፡</strong><br/>
            ${rep.directorRemarks || 'ውሳኔ በመሰጠት ላይ'}<br/><br/>
            <strong>የተወሰደ አስተዳደራዊ እርምጃ፡</strong> ${rep.actionTaken || 'ምክርና ማስጠንቀቂያ'}<br/>
            <strong>የወቅቱ ሁኔታ፡</strong> ${rep.status}
          </div>

          <div class="footer">
            <div>
              <div class="sign">የክፍል ተጠሪ መምህር ፊርማ</div>
            </div>
            <div>
              <div class="sign">የተማሪው ወላጅ/አሳዳጊ ፊርማ</div>
            </div>
            <div>
              <div class="sign">የርዕሰ መምህር / ዳይሬክተር ፊርማ እና ማህተም</div>
            </div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 2000);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* 1. HERO HEADER */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-amber-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs font-bold text-amber-300">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>የተማሪዎች ስነ-ምግባር መዝገብና ክትትል (Student Conduct & Behavioral Log)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
              የተማሪዎች ስነ-ምግባር ምዝገባና ክትትል (Student Conduct & Behavioral Log)
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              መምህራን በክፍልና በትምህርት ቤት ግቢ ውስጥ የተከሰቱ የተማሪዎች የስነ-ምግባር ክስተቶችን (Behavioral Incidents) ይመዘግባሉ፤ የትምህርት ቤት ዳይሬክተሮች ደግሞ ጉዳዮቹን ገምግመው ይፋዊ ዕውቅና (Acknowledge) እና ሰዓት (Timestamp) ይሰጣሉ። እንዲሁም ተማሪዎችና ወላጆች ሚስጥራዊ ጥቆማዎችን ለዳይሬክተሩ ማድረስ ይችላሉ።
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5 font-medium">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>ት/ቤት፡ <strong>{school.name}</strong></span>
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 flex items-center gap-1.5 font-bold">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% ሚስጥራዊነት የተጠበቀ (Confidential & Direct)</span>
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-200 flex items-center gap-1.5 font-bold">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>ጠቅላላ የተመዘገቡ ተማሪዎች፡ {students.length}</span>
              </span>
            </div>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('tip_off')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                activeTab === 'tip_off'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-amber-500/30'
                  : 'bg-slate-800/90 hover:bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{isTeacher ? '📝 የስነ-ምግባር ክስተት መዝግብ (Log Incident)' : '✍️ ስነ-ምግባር ጥቆማ አስገባ'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('classmates')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                activeTab === 'classmates'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-amber-500/30'
                  : 'bg-slate-800/90 hover:bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              <Users className="w-4 h-4 text-amber-300" />
              <span>👥 አብረው የሚማሩ የክፍል ተማሪዎች ({classmates.length})</span>
            </button>

            {isDirectorOrAdmin && (
              <button
                type="button"
                onClick={() => setActiveTab('director_board')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                  activeTab === 'director_board'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-emerald-500/30'
                    : 'bg-slate-800/90 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>🏛️ የዳይሬክተር መዝገብ ሰሌዳ ({reports.length})</span>
                {stats.pending > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold animate-pulse">
                    {stats.pending}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="bg-emerald-900/90 text-emerald-100 p-4 rounded-2xl border border-emerald-400 flex items-center justify-between gap-3 shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast(null)}
            className="text-xs bg-emerald-800 hover:bg-emerald-700 px-3 py-1 rounded-lg cursor-pointer"
          >
            እሺ
          </button>
        </div>
      )}

      {/* =========================================================================
          TAB 1: TIP-OFF SUBMISSION FORM WITH CLASSMATES ROSTER
         ========================================================================= */}
      {activeTab === 'tip_off' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): The Classmates Roster */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>አብረው የሚማሩ የክፍል ተማሪዎች ዝርዝር</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  የክፍሉን ተማሪዎች ይመልከቱ፤ ጥቆማ የሚሰጡበትን ተማሪ ጠቅ በማድረግ በቀላሉ ይምረጡ።
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-black">
                ክፍል {formGrade} - {formSection}
              </span>
            </div>

            {/* Class Grade & Section Selector on Top of Classmates List */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  የክፍል ደረጃ (Grade)
                </label>
                <select
                  value={formGrade}
                  onChange={(e) => {
                    const g = Number(e.target.value);
                    setFormGrade(g);
                    setSelectedTargetStudent(null);
                  }}
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
                >
                  {availableGrades.map((g) => (
                    <option key={g} value={g}>
                      ክፍል {g} (Grade {g})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  ሴክሽን (Section)
                </label>
                <select
                  value={formSection}
                  onChange={(e) => {
                    setFormSection(e.target.value);
                    setSelectedTargetStudent(null);
                  }}
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
                >
                  {availableSections.map((sec) => (
                    <option key={sec} value={sec}>
                      ሴክሽን {sec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search within Classmates */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={classmatesSearch}
                onChange={(e) => setClassmatesSearch(e.target.value)}
                placeholder="የክፍል ተማሪ በስም ወይም መታወቂያ ፈልግ..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-slate-50/50"
              />
            </div>

            {/* Selected Target Student Pill */}
            {selectedTargetStudent && (
              <div className="p-3 bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-400 rounded-2xl flex items-center justify-between gap-2 shadow-xs animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
                    {selectedTargetStudent.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-amber-950 font-bold block">የተመረጠ ተማሪ (Target Student)፡</span>
                    <strong className="text-xs text-amber-950 truncate block">
                      {selectedTargetStudent.fullName}
                    </strong>
                    <span className="text-[10px] text-amber-800">
                      ክፍል {selectedTargetStudent.grade}-{selectedTargetStudent.section} · ID: {selectedTargetStudent.studentIdNumber || selectedTargetStudent.accessCode}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedTargetStudent(null);
                    setTargetStudentNameManual('');
                  }}
                  className="p-1 rounded-full bg-amber-200 text-amber-900 hover:bg-amber-300 transition-colors text-xs cursor-pointer shrink-0"
                  title="ምርጫ ሰርዝ"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Classmates Cards Scrollable Grid */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {filteredClassmates.length === 0 ? (
                <div className="text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                  <Users className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">
                    በዚህ ክፍልና ሴክሽን (ክፍል {formGrade}-{formSection}) የተገኘ ተማሪ የለም።
                  </p>
                  <p className="text-[11px] text-slate-400">
                    ከላይ ሌላ ክፍል ወይም ሴክሽን በመምረጥ የሌሎች ክፍሎችን ተማሪዎች መመልከት ይችላሉ።
                  </p>
                </div>
              ) : (
                filteredClassmates.map((student) => {
                  const isSelected = selectedTargetStudent?.id === student.id;
                  return (
                    <div
                      key={student.id}
                      onClick={() => handleSelectClassmate(student)}
                      className={`p-3 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-400/30 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            student.gender === 'F'
                              ? 'bg-purple-100 text-purple-900'
                              : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {student.fullName.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {student.fullName}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                            <span>ID: {student.studentIdNumber || student.accessCode}</span>
                            <span>·</span>
                            <span>ጾታ፡ {student.gender === 'F' ? 'ሴት' : 'ወንድ'}</span>
                            <span>·</span>
                            <span className="font-semibold text-emerald-700">ስነ-ምግባር፡ {student.conduct}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectClassmate(student);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900'
                        }`}
                      >
                        {isSelected ? '✓ ተመርጧል' : '+ ጥቆማ ስጥ'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>ጠቃሚ ማሳሰቢያ፡</strong> ተማሪውን ከዝርዝሩ ከመረጡ በኋላ በቀኝ በኩል ያለውን የስነ-ምግባር ችግር አይነት፣ የተከሰተበትን ሰዓት እና ዝርዝር ሁኔታ በመሙላት ለዳይሬክተር ይላኩ።
              </span>
            </div>
          </div>

          {/* Right Column (7 cols): The Misconduct Report Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  <span>
                    {isTeacher
                      ? 'የተማሪ የስነ-ምግባር ክስተት መመዝገቢያ (Record Behavioral Incident)'
                      : 'የስነ-ምግባር ችግር ጥቆማ መሙያ ቅጽ (Student Conduct & Incident Form)'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isTeacher
                    ? 'መምህራን የተማሪዎችን የስነ-ምግባር ክስተቶች እዚህ ይመዘግባሉ፤ ለትምህርት ቤት ዳይሬክተር ደርሶ ይፋዊ ዕውቅና (Acknowledgment) ይሰጠዋል።'
                    : 'ይህ ጥቆማ በቀጥታ ለትምህርት ቤቱ ዳይሬክተር ዴስክ ብቻ ይደርሳል።'}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-red-50 text-red-900 border border-red-200 text-xs font-bold">
                {isTeacher ? 'የመምህራን ይፋዊ መዝገብ' : 'ቀጥታ ለዳይሬክተር'}
              </span>
            </div>

            <form onSubmit={handleSubmitTipOff} className="space-y-4">
              {/* 1. Target Student Display or Manual Entry */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  የስነ-ምግባር ችግር ያለበት ተማሪ ስም (Target Student) *
                </label>
                {selectedTargetStudent ? (
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between">
                    <div>
                      <strong className="text-xs text-amber-950">{selectedTargetStudent.fullName}</strong>
                      <span className="text-[11px] text-amber-800 ml-2">
                        (ክፍል {selectedTargetStudent.grade}-{selectedTargetStudent.section})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTargetStudent(null);
                        setTargetStudentNameManual('');
                      }}
                      className="text-xs text-red-600 hover:underline font-bold"
                    >
                      ሌላ ተማሪ ቀይር
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="text"
                      required
                      value={targetStudentNameManual}
                      onChange={(e) => setTargetStudentNameManual(e.target.value)}
                      placeholder="የተማሪውን ሙሉ ስም ያስገቡ ወይም በግራ በኩል ካለው የክፍል ተማሪዎች ዝርዝር ይምረጡ..."
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                    <span className="text-[10px] text-slate-400">
                      * በግራ በኩል ካለው የክፍል ተማሪዎች ስም ዝርዝር ላይ ጠቅ በማድረግ በቅጽበት መምረጥ ይችላሉ።
                    </span>
                  </div>
                )}
              </div>

              {/* 2. Reporter Identity & Confidentiality Option */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>የጠቋሚው ማንነት እና የሚስጥር ጥበቃ ደረጃ *</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isConfidential}
                      onChange={(e) => setIsConfidential(e.target.checked)}
                      className="rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span>ሙሉ በሙሉ በሚስጥር ይያዝ (Confidential)</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReporterType('anonymous');
                      setIsConfidential(true);
                    }}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      reporterType === 'anonymous'
                        ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🕵️ ሚስጥራዊ (ስም አልባ)
                  </button>

                  <button
                    type="button"
                    onClick={() => setReporterType('student')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      reporterType === 'student'
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🎓 በተማሪ ስም
                  </button>

                  <button
                    type="button"
                    onClick={() => setReporterType('parent')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      reporterType === 'parent'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    👨‍👩‍👧 በወላጅ ስም
                  </button>

                  <button
                    type="button"
                    onClick={() => setReporterType('teacher')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      reporterType === 'teacher'
                        ? 'bg-indigo-800 text-white border-indigo-800 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    👨‍🏫 በመምህር ስም
                  </button>
                </div>

                {reporterType !== 'anonymous' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        የጠቋሚው ሙሉ ስም (የአማራጭ)
                      </label>
                      <input
                        type="text"
                        value={reporterNameInput}
                        onChange={(e) => setReporterNameInput(e.target.value)}
                        placeholder="ስምዎን ያስገቡ..."
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        ስልክ ቁጥር (ዳይሬክተሩ ለመደወል)
                      </label>
                      <input
                        type="tel"
                        value={reporterPhoneInput}
                        onChange={(e) => setReporterPhoneInput(e.target.value)}
                        placeholder="+251 9..."
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Misconduct Category Grid Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  የስነ-ምግባር ችግር አይነት (Misconduct Category) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {misconductCategories.map((cat) => {
                    const isCatSelected = category === cat.key;
                    return (
                      <div
                        key={cat.key}
                        onClick={() => {
                          setCategory(cat.key);
                          setSeverity(cat.defaultSeverity);
                        }}
                        className={`p-2.5 rounded-2xl border text-left cursor-pointer transition-all ${
                          isCatSelected
                            ? 'bg-red-50 border-red-400 ring-2 ring-red-400/20 shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-base">{cat.icon}</span>
                          <span className="text-xs font-black text-slate-900 leading-tight">
                            {cat.titleAm}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                          {cat.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Incident Specifics: Severity, Date, Time, Location */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    የችግሩ ክብደት (Severity)
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as DisciplineReportSeverity)}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-hidden"
                  >
                    <option value="low">ዝቅተኛ (Low)</option>
                    <option value="medium">መካከለኛ (Medium)</option>
                    <option value="high">ከፍተኛ (High)</option>
                    <option value="critical">አስቸኳይ / አሳሳቢ (Critical)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    የተከሰተበት ቀን
                  </label>
                  <input
                    type="date"
                    required
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    የተከሰተበት ሰዓት
                  </label>
                  <input
                    type="text"
                    value={incidentTime}
                    onChange={(e) => setIncidentTime(e.target.value)}
                    placeholder="ምሳሌ፡ 4:30 ከሰዓት"
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    የተከሰተበት ቦታ
                  </label>
                  <input
                    type="text"
                    value={incidentLocation}
                    onChange={(e) => setIncidentLocation(e.target.value)}
                    placeholder="ምሳሌ፡ በክፍል ውስጥ..."
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-hidden"
                  />
                </div>
              </div>

              {/* 5. Detailed Description */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  የስነ-ምግባር ችግሩ ዝርዝር መግለጫ (Detailed Description) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="የተማሪውን የስነ-ምግባር ችግር ሁኔታ በዝርዝር ይግለጹ (ምን ተከሰተ? ከማን ጋር? ምን አይነት ድርጊት ተፈጸመ?)..."
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              {/* 6. Witnesses */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  የዓይን እማኞች / አብረው የነበሩ ተማሪዎች ወይም መምህራን (Witnesses - አማራጭ)
                </label>
                <input
                  type="text"
                  value={witnesses}
                  onChange={(e) => setWitnesses(e.target.value)}
                  placeholder="ምሳሌ፡ የክፍሉ ተማሪዎች፣ የግቢው ጥበቃ፣ የክፍል ተጠሪ..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>ጥቆማው ለትምህርት ቤቱ ዳይሬክተር በቀጥታ ይላካል፤ ለተጠቆመበት ተማሪ ማንነትዎ አይገለጽም።</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'በመላክ ላይ...' : 'ጥቆማውን ለዳይሬክተር ላክ (Submit)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: CLASSMATES ROSTER EXPLORER (አብረው የሚማሩ የክፍል ተማሪዎች)
         ========================================================================= */}
      {activeTab === 'classmates' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-slate-900">
                  አብረው የሚማሩ የክፍል ተማሪዎች ስም ዝርዝር (Classmates Roster)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                በተመረጠው የክፍል ደረጃና ሴክሽን ውስጥ የሚገኙ ተማሪዎች ዝርዝር።
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">ክፍል፡</span>
              <select
                value={formGrade}
                onChange={(e) => setFormGrade(Number(e.target.value))}
                className="bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-hidden cursor-pointer"
              >
                {availableGrades.map((g) => (
                  <option key={g} value={g}>
                    ክፍል {g}
                  </option>
                ))}
              </select>

              <span className="text-xs font-bold text-slate-600 ml-2">ሴክሽን፡</span>
              <select
                value={formSection}
                onChange={(e) => setFormSection(e.target.value)}
                className="bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-hidden cursor-pointer"
              >
                {availableSections.map((sec) => (
                  <option key={sec} value={sec}>
                    ሴክሽን {sec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={classmatesSearch}
              onChange={(e) => setClassmatesSearch(e.target.value)}
              placeholder="ተማሪዎችን በስም ወይም መታወቂያ ፈልግ..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-slate-50"
            />
          </div>

          {/* Grid of Classmates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredClassmates.map((st) => (
              <div
                key={st.id}
                className="p-4 bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-amber-400 rounded-2xl transition-all shadow-2xs space-y-2.5 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                        st.gender === 'F' ? 'bg-purple-100 text-purple-900' : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {st.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{st.fullName}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        ID: {st.studentIdNumber || st.accessCode}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      st.conduct === 'A'
                        ? 'bg-emerald-100 text-emerald-800'
                        : st.conduct === 'B'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    ስነ-ምግባር፡ {st.conduct}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600">
                  <span>መገኘት፡ <strong>{st.attendanceRate}%</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectClassmate(st);
                      setActiveTab('tip_off');
                    }}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>ጥቆማ ስጥበት</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: DIRECTOR REVIEW BOARD ("የዳይሬክተር የጥቆማዎች መዝገብና ክትትል")
         ========================================================================= */}
      {activeTab === 'director_board' && isDirectorOrAdmin && (
        <div className="space-y-5">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">ጠቅላላ ጥቆማዎች</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.total}</div>
              <span className="text-[10px] text-slate-500">ከሁሉም ክፍሎች የተላኩ</span>
            </div>

            <div className="bg-red-50 p-4 rounded-2xl border border-red-200 shadow-2xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-red-700 block">አዲስ ያልታዩ (Pending)</span>
              <div className="text-xl sm:text-2xl font-black text-red-900">{stats.pending}</div>
              <span className="text-[10px] text-red-600 font-medium">የዳይሬክተር እርምጃ የሚጠብቁ</span>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">በምርመራ / በውይይት ላይ</span>
              <div className="text-xl sm:text-2xl font-black text-amber-900">{stats.investigating}</div>
              <span className="text-[10px] text-amber-600 font-medium">ከወላጅ ጋር ቀጠሮ የተያዘላቸው</span>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-2xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">መፍትሔ ያገኙ (Resolved)</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-900">{stats.resolved}</div>
              <span className="text-[10px] text-emerald-600 font-medium">እርምጃና ምክር የተሰጣቸው</span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={boardSearch}
                onChange={(e) => setBoardSearch(e.target.value)}
                placeholder="በተማሪ ስም፣ መግለጫ ወይም ጠቋሚ ፈልግ..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={boardStatusFilter}
                onChange={(e) => setBoardStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="all">ሁሉንም ሁኔታዎች</option>
                <option value="pending_review">አዲስ (Pending Review)</option>
                <option value="under_investigation">በምርመራ ላይ</option>
                <option value="parent_conference">የወላጅ ውይይት</option>
                <option value="counseling_given">ምክር የተሰጣቸው</option>
                <option value="action_taken">እርምጃ የተወሰደባቸው</option>
                <option value="resolved_closed">የተዘጉ</option>
              </select>

              <select
                value={boardCategoryFilter}
                onChange={(e) => setBoardCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="all">ሁሉም የጥሰት አይነቶች</option>
                <option value="fighting_violence">ፀብ እና ጥቃት</option>
                <option value="classroom_disruption">የክፍል ረብሻ</option>
                <option value="verbal_abuse_harassment">ስድብና ዛቻ</option>
                <option value="substance_smoking_khat">ጫት/ሲጋራ/እፅ</option>
                <option value="property_damage_vandalism">ንብረት ማውደም</option>
                <option value="truancy_skipping_class">ማምለጥ/መቅረት</option>
                <option value="exam_cheating">ፈተና ማጭበርበር</option>
              </select>
            </div>
          </div>

          {/* Reports Table / List */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-black">የተማሪዎች ስነ-ምግባር ጥቆማዎች መዝገብ</h4>
              </div>
              <span className="text-xs text-slate-300">
                የተገኙ ጥቆማዎች፡ <strong>{filteredReports.length}</strong>
              </span>
            </div>

            {filteredReports.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-slate-700">ምንም የተመዘገበ የስነ-ምግባር ጥቆማ የለም</p>
                <p className="text-xs text-slate-400">ለዚህ ማጣሪያ የሚስማማ ሪፖርት አልተገኘም።</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredReports.map((rep) => {
                  const isPending = rep.status === 'pending_review';
                  return (
                    <div
                      key={rep.id}
                      className={`p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isPending ? 'bg-red-50/40' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="space-y-2 min-w-0 max-w-3xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase">
                            ክፍል {rep.grade} - {rep.section}
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              rep.severity === 'critical'
                                ? 'bg-red-600 text-white animate-pulse'
                                : rep.severity === 'high'
                                ? 'bg-red-100 text-red-900 border border-red-200'
                                : 'bg-amber-100 text-amber-900 border border-amber-200'
                            }`}
                          >
                            ክብደት፡ {rep.severity}
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              rep.status === 'pending_review'
                                ? 'bg-red-50 text-red-900 border-red-300'
                                : rep.status === 'under_investigation'
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : rep.status === 'parent_conference'
                                ? 'bg-purple-50 text-purple-900 border-purple-300'
                                : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            }`}
                          >
                            {rep.status === 'pending_review'
                              ? '🚨 አዲስ ጥቆማ (Pending)'
                              : rep.status === 'under_investigation'
                              ? '🔍 በምርመራ ላይ'
                              : rep.status === 'parent_conference'
                              ? '👨‍👩‍👦 የወላጅ ውይይት'
                              : rep.status === 'counseling_given'
                              ? '🤝 ምክር ተሰጥቷል'
                              : rep.status === 'action_taken'
                              ? '⚖️ እርምጃ ተወስዷል'
                              : '✅ ተዘግቷል'}
                          </span>

                          <span className="text-[11px] text-slate-400">
                            ቀን፡ {rep.incidentDate} ({rep.incidentTime || ''})
                          </span>

                          {rep.isAcknowledged ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>
                                በዳይሬክተር ታይቶ ዕውቅና ተሰጥቷል (Acknowledged)
                              </span>
                              {rep.directorAcknowledgedAt && (
                                <span className="font-mono text-[9px] text-emerald-700 ml-1">
                                  ({new Date(rep.directorAcknowledgedAt).toLocaleDateString()} {new Date(rep.directorAcknowledgedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>የዳይሬክተር ዕውቅና ይጠብቃል (Pending Review/Ack)</span>
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-black text-slate-900">
                            የተጠቆመው ተማሪ፡ <span className="text-amber-950 underline">{rep.targetStudentName}</span>
                          </h4>
                          <p className="text-xs text-slate-700 mt-1 line-clamp-2 leading-relaxed bg-white/80 p-2.5 rounded-xl border border-slate-200">
                            {rep.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                          <span>
                            መዝጋቢ/ጠቋሚ፡{' '}
                            <strong>
                              {rep.reporterType === 'teacher'
                                ? `👨‍🏫 ${rep.reporterName || 'መምህር'} (Teacher Log)`
                                : rep.isConfidential
                                ? '🕵️ ሚስጥራዊ ጥቆማ'
                                : rep.reporterName || 'ተማሪ/ወላጅ'}
                            </strong>
                          </span>
                          <span>·</span>
                          <span>ቦታ፡ <strong>{rep.incidentLocation || 'በት/ቤት'}</strong></span>
                          {rep.actionTaken && (
                            <>
                              <span>·</span>
                              <span className="text-emerald-800 font-bold">
                                የተወሰደ እርምጃ፡ {rep.actionTaken}
                              </span>
                            </>
                          )}
                          {rep.directorRemarks && (
                            <>
                              <span>·</span>
                              <span className="text-slate-700 italic">
                                የዳይሬክተር ማስታወሻ፡ {rep.directorRemarks}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons for Director */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center flex-wrap">
                        {/* Quick Acknowledge with Timestamp Button if not yet acknowledged */}
                        {!rep.isAcknowledged && (
                          <button
                            type="button"
                            onClick={() => {
                              setAcknowledgingReport(rep);
                              setQuickAcknowledgeRemarks('');
                            }}
                            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer border border-amber-400"
                            title="ዕውቅና ስጥ እና ሰዓት መዝግብ (Acknowledge with Timestamp)"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>ዕውቅና ስጥ (Acknowledge)</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handlePrintReportLetter(rep)}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 cursor-pointer"
                          title="የውሳኔ ሰነድ አትም / Print Incident Form"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenActionModal(rep)}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>ምርመራ / እርምጃ ውሰድ</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteReport(rep.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="መዝገብ ሰርዝ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          DIRECTOR ACTION MODAL (የዳይሬክተር ውሳኔና እርምጃ መመዝገቢያ)
         ========================================================================= */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-5 text-white shrink-0 relative">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    <Scale className="w-3 h-3 text-emerald-400" />
                    <span>የዳይሬክተር ይፋዊ የስነ-ምግባር ግምገማና ውሳኔ ሰሌዳ</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    ተማሪ {selectedReport.targetStudentName} (ክፍል {selectedReport.grade}-{selectedReport.section})
                  </h3>
                  <p className="text-xs text-emerald-200/90">
                    የጥቆማ መለያ፡ {selectedReport.id} · የተመዘገበበት ቀን፡ {selectedReport.incidentDate}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-800">
              {/* Incident Summary Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span>የጥሰት አይነት፡ <strong className="text-slate-900">{selectedReport.category}</strong></span>
                  <span>ክብደት፡ <strong className="text-red-700">{selectedReport.severity}</strong></span>
                </div>
                <div className="text-slate-900 font-medium whitespace-pre-line bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {selectedReport.description}
                </div>
                {selectedReport.witnesses && (
                  <p className="text-[11px] text-slate-500">
                    የዓይን እማኞች፡ <strong>{selectedReport.witnesses}</strong>
                  </p>
                )}
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  የጉዳዩ ወቅታዊ ሁኔታ (Status) *
                </label>
                <select
                  value={newStatusInput}
                  onChange={(e) => setNewStatusInput(e.target.value as DisciplineReportStatus)}
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                >
                  <option value="under_investigation">🔍 በምርመራና በክትትል ላይ (Under Investigation)</option>
                  <option value="parent_conference">👨‍👩‍👧 አስቸኳይ የወላጅ ውይይት መጥሪያ (Parent Conference)</option>
                  <option value="counseling_given">🤝 የስነ-ልቦና ምክርና መመሪያ ተሰጥቷል (Counseling Given)</option>
                  <option value="action_taken">⚖️ አስተዳደራዊ እርምጃ ተወስዷል (Disciplinary Action Taken)</option>
                  <option value="resolved_closed">✅ ስነ-ምግባሩ ተስተካክሎ ጉዳዩ ተዘግቷል (Resolved & Closed)</option>
                </select>
              </div>

              {/* Action Taken Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  የተወሰደው ይፋዊ እርምጃ (Action Taken) *
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[
                    'የቃል ማስጠንቀቂያና የስነ-ምግባር ምክር ተሰጥቷል',
                    'የወላጅ ውይይት ተደርጎ የጽሑፍ ቃልኪዳን ተፈርሟል',
                    'የመጀመሪያ ዙር የጽሑፍ ማስጠንቀቂያ በፋይል ተመዝግቧል',
                    'የትምህርት ቤት ማህበረሰብ አገልግሎት (3 ቀናት)',
                    'ጊዜያዊ እገዳ (3 የትምህርት ቀናት)',
                    'ምንም ጥፋት ባለመገኘቱ ጥቆማው ውድቅ ሆኗል'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setActionTakenInput(preset)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 border border-slate-200 transition-colors cursor-pointer"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  value={actionTakenInput}
                  onChange={(e) => setActionTakenInput(e.target.value)}
                  placeholder="የተወሰደውን እርምጃ ያስገቡ..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              {/* Director Findings & Remarks */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  የርዕሰ መምህር / ዳይሬክተር ግምገማና ውሳኔ (Director Remarks & Findings) *
                </label>
                <textarea
                  rows={3}
                  value={directorRemarksInput}
                  onChange={(e) => setDirectorRemarksInput(e.target.value)}
                  placeholder="ከተማሪው፣ ከወላጆች ወይም ከክፍል ተጠሪው ጋር የተደረገውን ውይይት ውጤት እና የዳይሬክተሩን ውሳኔ እዚህ ይመዝግቡ..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden leading-relaxed"
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handlePrintReportLetter(selectedReport)}
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>ይፋዊ ሰነድ አትም</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  ሰርዝ
                </button>
                <button
                  type="button"
                  onClick={handleSaveDirectorAction}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>ውሳኔውን መዝግብ (Save Resolution)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DIRECTOR QUICK ACKNOWLEDGMENT MODAL (ዕውቅና መስጫ በጊዜ ማህተም / Timestamp)
         ========================================================================= */}
      {acknowledgingReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 p-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      የዳይሬክተር ይፋዊ ዕውቅና ማረጋገጫ (Acknowledge Incident)
                    </h3>
                    <p className="text-xs text-amber-300 font-mono mt-0.5">
                      ይፋዊ ሰዓት (Timestamp)፡ {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAcknowledgingReport(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-800">
              <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-900">
                    ተማሪ፡ {acknowledgingReport.targetStudentName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white font-mono text-[10px]">
                    ክፍል {acknowledgingReport.grade}-{acknowledgingReport.section}
                  </span>
                </div>
                <p className="text-slate-600 line-clamp-2 italic">
                  "{acknowledgingReport.description}"
                </p>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-amber-200/60 flex items-center justify-between">
                  <span>መዝጋቢ፡ {acknowledgingReport.reporterName || 'መምህር/ተማሪ'}</span>
                  <span>ክስተት ቀን፡ {acknowledgingReport.incidentDate}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  የርዕሰ መምህር / ዳይሬክተር ዕውቅና ማስታወሻ (Director Acknowledgment Note)
                </label>
                <textarea
                  rows={3}
                  value={quickAcknowledgeRemarks}
                  onChange={(e) => setQuickAcknowledgeRemarks(e.target.value)}
                  placeholder="የስነ-ምግባር ክስተቱ መዝገብ በዳይሬክተር ታይቷል፤ አስፈላጊው ክትትል እንዲደረግ ለክፍል ተጠሪው መመሪያ ተላልፏል..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  ይህንን ሲያረጋግጡ የዳይሬክተሩ ስም (<strong>{currentUser?.name || 'School Director'}</strong>) እና አሁን ያለው ሰዓት (Timestamp) በስርዓቱ ላይ በቋሚነት ይመዘገባል።
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAcknowledgingReport(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                ሰርዝ
              </button>
              <button
                type="button"
                onClick={handleConfirmQuickAcknowledge}
                className="px-5 py-2 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>ዕውቅና ስጥ እና ሰዓት መዝግብ (Acknowledge with Timestamp)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
