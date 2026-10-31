import React, { useState, useMemo } from 'react';
import {
  X,
  Star,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  User,
  Shield,
  ShieldCheck,
  Send,
  Building2,
  BookOpen,
  Heart,
  Clock,
  HelpCircle,
  Smile,
  GraduationCap
} from 'lucide-react';
import {
  Language,
  School,
  StudentRecord,
  TeacherCredential,
  TeacherEvaluationRecord,
  EvaluationCriterionKey
} from '../types';
import { StorageService } from '../utils/storage';
import { OfflineSyncManager } from '../utils/offlineSync';

interface TeacherEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  school: School;
  student?: StudentRecord;
  preSelectedTeacherId?: string;
  onEvaluationSubmitted?: (record: TeacherEvaluationRecord) => void;
}

interface CriterionConfig {
  key: EvaluationCriterionKey;
  number: number;
  titleAm: string;
  titleOm: string;
  titleEn: string;
  descriptionAm: string;
  descriptionEn: string;
  icon: string;
}

const CRITERIA_CONFIGS: CriterionConfig[] = [
  {
    key: 'teaching_competence',
    number: 1,
    titleAm: 'የማስተማር ብቃቱ (Subject Mastery)',
    titleOm: 'Dandeettii Barsiisuu (Gartuu Barnootaa)',
    titleEn: 'Teaching Competence & Subject Mastery',
    descriptionAm: 'መምህሩ በትምህርት አይነቱ ላይ ያለው ጥልቅ እውቀት፣ ውስብስብ ፅንሰ-ሀሳቦችን የማስረዳትና ጥያቄዎችን የመመለስ አቅም',
    descriptionEn: 'Teacher mastery of the curriculum, depth of subject knowledge, and capability to explain complex concepts',
    icon: '🧠'
  },
  {
    key: 'pedagogical_delivery',
    number: 2,
    titleAm: 'የትምህርት አሰጣጡ (Methodology & Clarity)',
    titleOm: 'Haala Dhiheessa Barnootaa',
    titleEn: 'Pedagogical Delivery & Clarity of Explanation',
    descriptionAm: 'ትምህርቱን ግልጽና ሳቢ በሆነ መንገድ የማቅረብ፣ የተለያዩ የማስተማሪያ ዘዴዎችን፣ ምሳሌዎችንና እይታዎችን የመጠቀም ችሎታ',
    descriptionEn: 'Ability to explain clearly and engagingly, using relevant practical examples, audiovisuals and active student engagement',
    icon: '💡'
  },
  {
    key: 'teaching_motivation',
    number: 3,
    titleAm: 'ለማስተማር ያለው ተነሳሽነት (Motivation & Dedication)',
    titleOm: 'Kaka\'umsa Barsiisuuf Qabu',
    titleEn: 'Teaching Motivation, Enthusiasm & Punctuality',
    descriptionAm: 'ለስራው ያለው ፍቅር፣ በሰዓት መገኘት፣ የተማሪዎችን ፍላጎት የማነሳሳትና የማበረታታት ጉጉት',
    descriptionEn: 'Teacher enthusiasm for the profession, punctuality to class, and passion for inspiring and encouraging learners',
    icon: '🔥'
  },
  {
    key: 'student_support',
    number: 4,
    titleAm: 'የተማሪ ጥያቄን ማዳመጥና መደገፍ (Student Support & Fairness)',
    titleOm: 'Gaaffii Barattootaa Dhaggeeffachuu fi Deeggaruu',
    titleEn: 'Student Support, Empathy & Approachability',
    descriptionAm: 'ተማሪዎች ጥያቄ ሲጠይቁ በትዕግስት የማዳመጥ፣ እኩል የማየት፣ የሚያስቸግራቸውን ተማሪዎች የመደገፍ አቀራረብ',
    descriptionEn: 'Patience when listening to learner questions, equitable treatment without discrimination, and helping struggling students',
    icon: '🤝'
  },
  {
    key: 'classroom_management',
    number: 5,
    titleAm: 'የክፍል ስነ-ስርዓትና የጊዜ አጠቃቀም (Classroom Discipline)',
    titleOm: 'Nagaa fi Sirna Daree Eeguu fi Yeroo Qusachuu',
    titleEn: 'Classroom Management & Time Utilization',
    descriptionAm: 'የክፍል ውስጥ ጸጥታና ስነ-ስርዓት በአግባቡ የመጠበቅ፣ 45ቱን ደቂቃ ለትምህርት ብቻ የመጠቀም ችሎታ',
    descriptionEn: 'Maintaining a quiet, respectful learning atmosphere and maximizing the entire period for instructional value',
    icon: '⏱️'
  },
  {
    key: 'timely_assessment',
    number: 6,
    titleAm: 'የቤት ስራና ፈተናን በወቅቱ ማረምና ግብረ-መልስ (Assessment & Feedback)',
    titleOm: 'Hojii Mannee fi Qormaata Yeroon Sirreessuu',
    titleEn: 'Timely Assessment, Correction & Constructive Feedback',
    descriptionAm: 'የቤት ስራዎችንና ፈተናዎችን በወቅቱ አርሞ ማስታወሻና ማበረታቻ የመስጠት፣ ስህተቶችን ለተማሪው የማስረዳት ልምድ',
    descriptionEn: 'Correcting quizzes and homework promptly, returning marks with constructive guidance, and explaining mistakes',
    icon: '📝'
  }
];

export const TeacherEvaluationModal: React.FC<TeacherEvaluationModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  school,
  student,
  preSelectedTeacherId,
  onEvaluationSubmitted
}) => {
  // Available teachers in this school or generally
  const allTeachers = useMemo(() => {
    const list = StorageService.getCredentials();
    return list.filter((t) => t.schoolId === school.id || t.schoolName === school.name);
  }, [school.id, school.name]);

  const fallbackTeachers = useMemo(() => {
    if (allTeachers.length > 0) return allTeachers;
    return StorageService.getCredentials();
  }, [allTeachers]);

  // Selected teacher
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(() => {
    if (preSelectedTeacherId) return preSelectedTeacherId;
    return fallbackTeachers[0]?.id || 'tc-1';
  });

  const activeTeacher = useMemo(() => {
    return fallbackTeachers.find((t) => t.id === selectedTeacherId) || fallbackTeachers[0];
  }, [fallbackTeachers, selectedTeacherId]);

  // Evaluator type & anonymity
  const [evaluatorRole, setEvaluatorRole] = useState<'student' | 'parent'>('student');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [evaluatorName, setEvaluatorName] = useState<string>(student?.fullName || '');
  const [evaluatorParentName, setEvaluatorParentName] = useState<string>(student?.parentName || '');

  // 6 Criteria Scores (default each to 8 or 9)
  const [scores, setScores] = useState<Record<EvaluationCriterionKey, number>>({
    teaching_competence: 9,
    pedagogical_delivery: 8,
    teaching_motivation: 9,
    student_support: 9,
    classroom_management: 8,
    timely_assessment: 8
  });

  // Qualitative Remarks
  const [strengthsFeedback, setStrengthsFeedback] = useState<string>('');
  const [improvementAreas, setImprovementAreas] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string>('');

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // Totals
  const totalScore = useMemo(() => {
    return (
      scores.teaching_competence +
      scores.pedagogical_delivery +
      scores.teaching_motivation +
      scores.student_support +
      scores.classroom_management +
      scores.timely_assessment
    );
  }, [scores]);

  const percentage = useMemo(() => {
    return Number(((totalScore / 60) * 100).toFixed(1));
  }, [totalScore]);

  const ratingTier = useMemo<'outstanding' | 'very_good' | 'satisfactory' | 'needs_improvement'>(() => {
    if (percentage >= 90) return 'outstanding';
    if (percentage >= 75) return 'very_good';
    if (percentage >= 60) return 'satisfactory';
    return 'needs_improvement';
  }, [percentage]);

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'outstanding':
        return { label: 'የላቀ ውጤት (Outstanding)', color: 'bg-emerald-500 text-white border-emerald-400' };
      case 'very_good':
        return { label: 'በጣም ጥሩ (Very Good)', color: 'bg-teal-500 text-white border-teal-400' };
      case 'satisfactory':
        return { label: 'አጥጋቢ (Satisfactory)', color: 'bg-amber-500 text-slate-950 border-amber-400' };
      default:
        return { label: 'ማሻሻያ የሚሻ (Needs Improvement)', color: 'bg-rose-500 text-white border-rose-400' };
    }
  };

  const playSuccessChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch (_) {}
  };

  const handleScoreChange = (key: EvaluationCriterionKey, value: number) => {
    setScores((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(10, value))
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeacher) return;

    setIsSubmitting(true);

    const newEvaluation: TeacherEvaluationRecord = {
      id: `eval-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      teacherId: activeTeacher.id,
      teacherName: activeTeacher.teacherName,
      schoolId: school.id,
      schoolName: school.name,
      subject: activeTeacher.subject,
      gradeLevel: student?.grade || 10,
      section: student?.section || 'A',
      academicYear: '2016/2017 ዓ.ም',
      semester: '1',
      scores: { ...scores },
      totalScore,
      percentage,
      ratingTier,
      strengthsFeedback: strengthsFeedback.trim() || undefined,
      improvementAreas: improvementAreas.trim() || undefined,
      recommendations: recommendations.trim() || undefined,
      evaluatorRole,
      isAnonymous,
      evaluatorName: isAnonymous ? undefined : evaluatorName.trim() || undefined,
      evaluatorStudentId: isAnonymous ? undefined : student?.id,
      evaluatorParentName: isAnonymous ? undefined : evaluatorParentName.trim() || undefined,
      submittedAt: new Date().toISOString(),
      bureauSyncStatus: 'synced',
      bureauDecisionNotes: 'ከወላጅ/ተማሪ በቀጥታ ለሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ የተላከ ይፋዊ ግምገማ'
    };

    // 1. Save in local StorageService
    StorageService.addTeacherEvaluation(newEvaluation);

    // 2. Enqueue in OfflineSyncManager for Central Bureau Sync
    OfflineSyncManager.enqueue(
      'teacher_evaluation',
      'create',
      newEvaluation.id,
      newEvaluation,
      {
        authorName: isAnonymous ? 'ስም ያልተገለጸ ተማሪ/ወላጅ' : evaluatorName || 'ተማሪ',
        schoolName: school.name,
        role: evaluatorRole,
        description: `Teacher appraisal for ${activeTeacher.teacherName} (${percentage}%)`
      }
    );

    playSuccessChime();
    setSubmittedSuccess(true);
    setIsSubmitting(false);

    if (onEvaluationSubmitted) {
      onEvaluationSubmitted(newEvaluation);
    }

    setTimeout(() => {
      setSubmittedSuccess(false);
      onClose();
    }, 2400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Modal Top Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Star className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ · ይፋዊ የመምህራን መመዘኛ
              </span>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                የመምህራን የማስተማር ብቃትና የትምህርት አሰጣጥ ግምገማ
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content / Form */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {submittedSuccess ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                ግምገማዎ በተሳካ ሁኔታ ተልኳል!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                ለመ/ር <strong>{activeTeacher?.teacherName}</strong> የሰጡት ምዘና <strong>({totalScore}/60 - {percentage}%)</strong> ተመዝግቧል።
                መረጃው ወደ ሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ የመምህራን መመዘኛና እድገት ዳታቤዝ በቀጥታ ተልኳል።
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>ወደ ማዕከላዊ የትምህርት ቢሮ ሰርቨር ተመሳስሏል (Synced)</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Context Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">
                    ይህ ግምገማ ለመምህራን የብቃት መመዘኛ፣ የደረጃ እድገት እና የማስተማር ፈቃድ እድሳት በግብዓትነት ያገለግላል።
                  </p>
                  <p className="text-amber-800">
                    እባክዎ እያንዳንዱን መስፈርት ከ 10 ነጥብ በጥንቃቄና በታማኝነት ይመዝኑ። የተማሪው/የወላጁ ስም በምስጢር እንዲጠበቅ መምረጥ ይችላሉ።
                  </p>
                </div>
              </div>

              {/* 1. Teacher Selector & Evaluator Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {/* Teacher Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    የሚገመገመው መምህር (Select Teacher):
                  </label>
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600"
                  >
                    {fallbackTeachers.map((tch) => (
                      <option key={tch.id} value={tch.id}>
                        {tch.teacherName} — {tch.subject} ({tch.schoolName})
                      </option>
                    ))}
                  </select>
                  {activeTeacher && (
                    <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                      <span>የትምህርት ደረጃ፡ {activeTeacher.qualification} ({activeTeacher.institution})</span>
                      <span>·</span>
                      <span>የስራ ልምድ፡ {activeTeacher.experienceYears} ዓመት</span>
                    </div>
                  )}
                </div>

                {/* Evaluator Role & Anonymity */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    የገምጋሚው አካል (Evaluator Role):
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEvaluatorRole('student')}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        evaluatorRole === 'student'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>ተማሪ ነኝ (Student)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEvaluatorRole('parent')}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        evaluatorRole === 'parent'
                          ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>ወላጅ ነኝ (Parent)</span>
                    </button>
                  </div>

                  {/* Confidential / Anonymous Checkbox */}
                  <label className="flex items-center gap-2 pt-1 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="font-semibold">ስሜ በምስጢር ይያዝልኝ (Anonymous Evaluation)</span>
                  </label>
                </div>
              </div>

              {/* 2. Live Score Gauge & Summary Card */}
              <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-emerald-800/40">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                    አጠቃላይ የምዘና ውጤት (Total Score)
                  </span>
                  <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                    <span className="text-3xl sm:text-4xl font-black text-white">{totalScore}</span>
                    <span className="text-sm font-semibold text-slate-300">/ 60 ነጥብ</span>
                    <span className="text-xl font-bold text-emerald-400 ml-2">({percentage}%)</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    6 መስፈርቶች × እያንዳንዳቸው በ 10 ነጥብ የተመዘኑ
                  </p>
                </div>

                <div className="flex flex-col items-center sm:items-end gap-1.5">
                  <span className="text-[10px] text-slate-300">የደረጃ ምድብ (Rating Tier):</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${getTierLabel(ratingTier).color}`}>
                    {getTierLabel(ratingTier).label}
                  </span>
                </div>
              </div>

              {/* 3. The 6 Evaluation Criteria Cards (Each 0-10) */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                    የግምገማ መስፈርቶች ዝርዝር (6 Core Criteria · እያንዳንዳቸው 10 ነጥብ)
                  </h4>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    ነጥብ ለመስጠት ጠቅ ያድርጉ ወይም ተንሸራታቹን ይጠቀሙ
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {CRITERIA_CONFIGS.map((cfg) => {
                    const currentVal = scores[cfg.key];
                    return (
                      <div
                        key={cfg.key}
                        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <span className="text-xl shrink-0 p-1 bg-slate-100 rounded-xl">{cfg.icon}</span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-200">
                                  #{cfg.number}
                                </span>
                                <h5 className="text-xs font-bold text-slate-900 leading-tight">
                                  {cfg.titleAm}
                                </h5>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                {cfg.descriptionAm}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-lg font-black text-emerald-800">
                              {currentVal}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">/10</span>
                          </div>
                        </div>

                        {/* Interactive Range Slider + Quick Buttons */}
                        <div className="space-y-1.5 pt-1">
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="1"
                            value={currentVal}
                            onChange={(e) => handleScoreChange(cfg.key, Number(e.target.value))}
                            className="w-full accent-emerald-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
                          />

                          {/* Quick 10 Buttons for fast selection */}
                          <div className="flex items-center justify-between gap-1 pt-0.5">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => handleScoreChange(cfg.key, num)}
                                className={`w-6 h-6 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                  currentVal === num
                                    ? 'bg-emerald-800 text-white shadow-xs scale-105'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Qualitative Written Feedback & Bureau Recommendation */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 border-b border-slate-200 pb-2">
                  የፅሁፍ አስተያየት እና ለትምህርት ቢሮ የሚተላለፍ ግብዓት (Qualitative Appraisal Feedback)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      የመምህሩ ዋና ዋና ጥንካሬዎች (Key Strengths):
                    </label>
                    <textarea
                      rows={2}
                      value={strengthsFeedback}
                      onChange={(e) => setStrengthsFeedback(e.target.value)}
                      placeholder="ምሳሌ፡ ትምህርቱን በሚገባ ያስረዳል፣ የተማሪዎችን ጥያቄ በትዕግስት ያዳምጣል..."
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      መምህሩ ወደፊት ሊያሻሽላቸው የሚገቡ ነጥቦች (Areas for Improvement):
                    </label>
                    <textarea
                      rows={2}
                      value={improvementAreas}
                      onChange={(e) => setImprovementAreas(e.target.value)}
                      placeholder="ምሳሌ፡ የቤት ስራ ፈተና ከመድረሱ በፊት ቀደም ብሎ ቢያርም መልካም ነው..."
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ለትምህርት ቢሮ የመምህራን መመዘኛ ኮሚቴ የሚሰጥ ምክረ-ሀሳብ (Recommendation to Education Bureau):
                  </label>
                  <input
                    type="text"
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    placeholder="ምሳሌ፡ ለዚህ መምህር የላቀ ማበረታቻ ወይም ተጨማሪ የስልጠና እድል እንዲመቻችለት እንጠይቃለን..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                </div>
              </div>

              {/* Submit Buttons Bar */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>ግምገማው ኦፍላይንም ይሰራል፤ መስመር ሲመጣ ከትምህርት ቢሮው ጋር ይመሳሰላል</span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    ተመለስ (Cancel)
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>ግምገማውን ወደ ትምህርት ቢሮ ላክ ({totalScore}/60)</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
