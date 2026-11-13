import React, { useState, useEffect } from 'react';
import {
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Plus,
  HelpCircle,
  FileCheck,
  Download,
  Building2,
  Sparkles,
  Printer,
  Search,
  Filter,
  BookOpen,
  X,
  Timer,
  ListOrdered,
  Send,
  Eye,
  CheckCheck,
  UserCheck,
  Check,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Unlock,
  FileSearch,
  RotateCcw,
  Info
} from 'lucide-react';
import { Language, TeacherExam, ExamQuestion, ExamSubmission, SubmissionAnswer, AppUserSession } from '../types';
import { translations } from '../data/translations';
import { StorageService } from '../utils/storage';
import { AIExamGeneratorModal } from './AIExamGeneratorModal';
import { getTeacherAssignment, isExamForTeacher } from '../utils/teacherAssignment';

interface TeacherOnlineExamsProps {
  currentLang: Language;
  exams: TeacherExam[];
  onExamsChange: (updated: TeacherExam[]) => void;
  currentTeacherName?: string;
  currentSchoolName?: string;
  isBureauOfficer?: boolean;
  currentUser?: AppUserSession | null;
}

export const TeacherOnlineExams: React.FC<TeacherOnlineExamsProps> = ({
  currentLang,
  exams,
  onExamsChange,
  currentTeacherName = 'መ/ር በፈቃዱ ጥላሁን',
  currentSchoolName = 'ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት',
  isBureauOfficer = false,
  currentUser = null
}) => {
  const t = translations[currentLang];

  // Submissions state (persisted across sessions)
  const [submissions, setSubmissions] = useState<ExamSubmission[]>(() => StorageService.getSubmissions());

  // Top navigation tab: 'exams' (Available Exams) | 'bureau_reviews' (Bureau Review & Release) | 'my_results' (My Results & Certs)
  const [activeExamTab, setActiveExamTab] = useState<'exams' | 'bureau_reviews' | 'my_results'>('exams');

  // Guard: Only Bureau officers have access to bureau_reviews tab
  useEffect(() => {
    if (!isBureauOfficer && activeExamTab === 'bureau_reviews') {
      setActiveExamTab('exams');
    }
  }, [isBureauOfficer, activeExamTab]);

  // Exam taker active state
  const [activeExam, setActiveExam] = useState<TeacherExam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  // 1. አንድ ጥያቄ ስንት ደቂቃ ይቆይ (Question timer state in seconds)
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number>(0);
  const [autoAdvanceNotice, setAutoAdvanceNotice] = useState<string | null>(null);

  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [examResult, setExamResult] = useState<ExamSubmission | null>(null);

  // Bureau Review Modal state (3. ጥያቄውና መልሱ ከታየ በኋላ ትምህርት ቢሮ ለመምህራን ይደርስ ሲል መምህሩ በራሱ አካውንት ይደርሰዋል)
  const [selectedSubmissionForReview, setSelectedSubmissionForReview] = useState<ExamSubmission | null>(null);
  const [bureauOfficerFeedback, setBureauOfficerFeedback] = useState<string>('');
  const [reviewFilterStatus, setReviewFilterStatus] = useState<'all' | 'pending' | 'released'>('all');
  const [submissionSearch, setSubmissionSearch] = useState<string>('');
  const [inspectResultDetails, setInspectResultDetails] = useState<ExamSubmission | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 4500);
  };

  // AI Exam Generator Modal State
  const [showAIGeneratorModal, setShowAIGeneratorModal] = useState(false);
  const [aiGeneratorInitialMaterialId, setAiGeneratorInitialMaterialId] = useState<string | undefined>(undefined);

  // Detect teacher subject & grade levels
  const teacherAssignment = React.useMemo(() => {
    return getTeacherAssignment(currentUser);
  }, [currentUser]);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');

  const filteredExams = React.useMemo(() => {
    return exams.filter((exam) => {
      // 1. Role-based Subject & Grade Level restriction for Teachers:
      // "መምህሩ እንደሚያስተምረው የትምህርት አይነቶች እና የ ክፍል ደረጃ ብቻ ፈተናወች እንዲደርሰው አድርጉ"
      if (!isBureauOfficer) {
        if (!isExamForTeacher(exam, teacherAssignment)) {
          return false;
        }
      }

      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        exam.title.toLowerCase().includes(q) ||
        exam.subject.toLowerCase().includes(q) ||
        exam.instructions.toLowerCase().includes(q);

      const matchesSubject =
        selectedSubjectFilter === 'all' || exam.subject.toLowerCase().includes(selectedSubjectFilter.toLowerCase());

      return matchesSearch && matchesSubject;
    });
  }, [exams, isBureauOfficer, teacherAssignment, searchTerm, selectedSubjectFilter]);

  // Exam creator state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Pedagogy & Methodology');
  const [newTargetGradeLevels, setNewTargetGradeLevels] = useState('Grades 9 - 12');
  const [newDuration, setNewDuration] = useState(20);
  // 1. አንድ ጥያቄ ስንት ደቂቃ ይቆይ
  const [newTimePerQuestion, setNewTimePerQuestion] = useState<number>(2);
  // 2. የፈተናው ሙሉ ጥያቄ ይድረሰው ወይስ አንድን ጥያቄ ሰርቶ ሲጨርስ ቀጣይ ጥያቄ ይደረሰው
  const [newDeliveryMode, setNewDeliveryMode] = useState<'one_by_one' | 'all_at_once'>('one_by_one');
  const [newPassingScore, setNewPassingScore] = useState(70);
  const [newInstructions, setNewInstructions] = useState(
    currentLang === 'om'
      ? 'Qormaanni kun Biiroo Barnootaa Bulchiinsa Magaalaa Shaashamanneetiin kan qophaa’e madaallii gahumsa barsiisotaa idileeti.'
      : currentLang === 'en'
      ? 'This is an official teacher competency assessment prepared by the Shashemene City Education Bureau.'
      : 'ይህ ፈተና በሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ የተዘጋጀ ይፋዊ የመምህራን ብቃት መመዘኛ ነው።'
  );
  const [newQuestions, setNewQuestions] = useState<ExamQuestion[]>([
    {
      id: 'nq-1',
      questionText:
        currentLang === 'om'
          ? 'Mala baruuf barsiisuu barataa giddugaleessa godhate keessatti gaheen barsiisaa inni jalqabaa maali?'
          : currentLang === 'en'
          ? 'In student-centered pedagogy, what is the primary role of the teacher?'
          : 'በተማሪ ተኮር የማስተማር ዘዴ ውስጥ የመምህሩ ቀዳሚ ተግባር ምንድነው?',
      options:
        currentLang === 'om'
          ? [
              'Barattoonni beekumsa akka maddisiisan haala mijeessuu fi gargaaruu (Facilitate)',
              'Yaadannoo walitti fufinsaan barreessisuu qofa',
              'Kitaaba barataa guutummaatti qomaan qabachiisuu',
              'Qormaata qofa qopheessuu'
            ]
          : currentLang === 'en'
          ? [
              'Facilitate and guide students to construct knowledge',
              'Only dictate continuous notes',
              'Make students memorize the entire textbook by heart',
              'Only prepare examinations'
            ]
          : [
              'ተማሪዎች እውቀትን እንዲያፈልቁ ማመቻቸትና ማገዝ (Facilitate)',
              'ማስታወሻዎችን ያለማቋረጥ ማጻፍ ብቻ',
              'የመማሪያ መጽሐፉን በሙሉ በቃል ማስሸምደድ',
              'ፈተናዎችን ብቻ ማዘጋጀት'
            ],
      correctIndex: 0,
      explanation:
        currentLang === 'om'
          ? 'Barsiisaan dhiyeessaa beekumsaa qofa osoo hin taane haala mijeessaa (Facilitator) adeemsa barachuuti.'
          : currentLang === 'en'
          ? 'A teacher is not just a knowledge transmitter, but a facilitator of the learning process.'
          : 'መምህሩ የእውቀት አቅራቢ ብቻ ሳይሆን የመማር ሂደቱን አመቻች (Facilitator) ነው።'
    }
  ]);

  // Overall Exam Timer effect
  useEffect(() => {
    if (!activeExam || isExamCompleted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExam, isExamCompleted, timeLeft]);

  // 1. አንድ ጥያቄ ስንት ደቂቃ ይቆይ - Per Question Timer effect
  useEffect(() => {
    if (!activeExam || isExamCompleted || !activeExam.timePerQuestionMinutes) return;

    const qTimer = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          // Question time expired! Auto-advance to next question or submit if last
          setAutoAdvanceNotice(
            currentLang === 'om'
              ? `Yeroon gaaffii ${currentQuestionIndex + 1} waan dhumateef ofumaan gara gaaffii itti aanutti darbeera!`
              : currentLang === 'en'
              ? `Time for question ${currentQuestionIndex + 1} expired; auto-advancing!`
              : `የጥያቄ ${currentQuestionIndex + 1} የጊዜ ገደብ ስላለቀ በራስ-ሰር ወደ ቀጣዩ ጥያቄ ተሸጋግሯል!`
          );
          setTimeout(() => setAutoAdvanceNotice(null), 4000);

          if (currentQuestionIndex < activeExam.questions.length - 1) {
            setCurrentQuestionIndex((idx) => idx + 1);
            return (activeExam.timePerQuestionMinutes || 2) * 60;
          } else {
            handleSubmitExam();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(qTimer);
  }, [activeExam, isExamCompleted, currentQuestionIndex, activeExam?.timePerQuestionMinutes]);

  // Reset question timer whenever question index changes
  useEffect(() => {
    if (activeExam?.timePerQuestionMinutes) {
      setQuestionTimeLeft(activeExam.timePerQuestionMinutes * 60);
    }
  }, [currentQuestionIndex, activeExam]);

  const handleStartExam = (exam: TeacherExam) => {
    setActiveExam(exam);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    const safeDuration = exam.durationMinutes || (exam.timePerQuestionMinutes ? exam.timePerQuestionMinutes * exam.questions.length : 20);
    setTimeLeft(safeDuration * 60);
    if (exam.timePerQuestionMinutes) {
      setQuestionTimeLeft(exam.timePerQuestionMinutes * 60);
    } else {
      setQuestionTimeLeft(0);
    }
    setIsExamCompleted(false);
    setExamResult(null);
    setAutoAdvanceNotice(null);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitExam = () => {
    if (!activeExam) return;

    let correctCount = 0;
    const answerEntries: SubmissionAnswer[] = activeExam.questions.map((q) => {
      const selected = selectedAnswers[q.id];
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        questionText: q.questionText,
        selectedOption: selected !== undefined ? selected : -1,
        selectedOptionText:
          selected !== undefined && q.options[selected]
            ? q.options[selected]
            : currentLang === 'om'
            ? 'Kan hin deebifamne (Unanswered)'
            : currentLang === 'en'
            ? 'Unanswered'
            : 'ያልተመለሰ (Unanswered)',
        correctOption: q.correctIndex,
        correctOptionText: q.options[q.correctIndex],
        isCorrect,
        explanation: q.explanation
      };
    });

    const scorePercentage = Math.round((correctCount / activeExam.questions.length) * 100);
    const passed = scorePercentage >= activeExam.passingScore;
    const certNum = passed
      ? `CERT-SHAS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
      : undefined;

    const submission: ExamSubmission = {
      id: `sub-${Date.now()}`,
      examId: activeExam.id,
      examTitle: activeExam.title,
      teacherId: 'tch-current',
      teacherName: currentTeacherName,
      schoolName: currentSchoolName,
      subject: activeExam.subject,
      score: correctCount,
      totalMarks: activeExam.questions.length,
      percentage: scorePercentage,
      passed,
      submittedAt: new Date().toISOString(),
      certificateNumber: certNum,
      reviewStatus: 'pending_bureau_review',
      answers: answerEntries
    };

    const updated = StorageService.addSubmission(submission);
    setSubmissions(updated);
    setExamResult(submission);
    setIsExamCompleted(true);
  };

  // Bureau Officer: Release Result to Teacher
  const handleBureauReleaseResult = (submissionId: string, feedback?: string) => {
    const reviewerLabel =
      currentLang === 'om'
        ? 'Daayirektoreetii Madaallii fi Gahumsaa Biiroo Barnootaa'
        : currentLang === 'en'
        ? 'Education Bureau Assessment & Competency Directorate'
        : 'የትምህርት ቢሮ ምዘናና ብቃት ዳይሬክቶሬት';
    const updated = StorageService.updateSubmissionReview(
      submissionId,
      'released_to_teacher',
      reviewerLabel,
      feedback
    );
    setSubmissions(updated);
    if (selectedSubmissionForReview?.id === submissionId) {
      setSelectedSubmissionForReview(updated.find((s) => s.id === submissionId) || null);
    }
    showToast(
      currentLang === 'om'
        ? '✓ Qabxiin qormaataa mirkanaa’ee gara akaawuntii dhuunfaa barsiisaatti milkaa’inaan ergameera!'
        : currentLang === 'en'
        ? '✓ Exam result approved and released to the teacher account!'
        : '✓ የፈተናው ጥያቄና መልስ ውጤት በተሳካ ሁኔታ ጸድቆ ወደ መምህሩ የግል አካውንት እንዲደርስ ተደርጓል!'
    );
  };

  // Bureau Officer: Batch release all pending submissions
  const handleBatchReleaseAll = () => {
    const pendingCount = submissions.filter((s) => s.reviewStatus === 'pending_bureau_review').length;
    if (pendingCount === 0) {
      showToast(
        currentLang === 'om'
          ? 'Qabxiin qormaataa gamaaggama eegu hin jiru.'
          : currentLang === 'en'
          ? 'No pending exam results to release.'
          : 'ግምገማ የሚጠብቅ ያልተለቀቀ የፈተና ውጤት የለም።'
      );
      return;
    }
    const reviewerLabel =
      currentLang === 'om'
        ? 'Daayirektoreetii Madaallii fi Gahumsaa Biiroo Barnootaa'
        : currentLang === 'en'
        ? 'Education Bureau Assessment & Competency Directorate'
        : 'የትምህርት ቢሮ ምዘናና ብቃት ዳይሬክቶሬት';
    const updated = StorageService.batchReleaseSubmissions(reviewerLabel);
    setSubmissions(updated);
    showToast(
      currentLang === 'om'
        ? `✓ Qabxiileen qormaataa ${pendingCount} hundi barsiisotaaf milkaa’inaan ergamaniiru!`
        : currentLang === 'en'
        ? `✓ ${pendingCount} exam results released to teachers!`
        : `✓ ${pendingCount} የፈተና ውጤቶች ለመምህራን በሙሉ በስኬት ተልከዋል!`
    );
  };

  const handleAddQuestionToDraft = () => {
    const nextNum = newQuestions.length + 1;
    const isOm = currentLang === 'om';
    const isEn = currentLang === 'en';
    const qPrefix = isOm ? 'Gaaffii' : isEn ? 'Question' : 'ጥያቄ';
    const optPrefix = isOm ? 'Filannoo' : isEn ? 'Option' : 'ምርጫ';
    setNewQuestions([
      ...newQuestions,
      {
        id: `nq-${Date.now()}`,
        questionText: `${qPrefix} ${nextNum}: `,
        options: [`${optPrefix} 1`, `${optPrefix} 2`, `${optPrefix} 3`, `${optPrefix} 4`],
        correctIndex: 0,
        explanation: isOm ? 'Ibsa sirrii...' : isEn ? 'Correct explanation...' : 'ትክክለኛ ማብራሪያ...'
      }
    ]);
  };

  const handleSaveNewExam = (e: React.FormEvent) => {
    e.preventDefault();

    const calculatedDuration = newTimePerQuestion > 0
      ? Math.max(newTimePerQuestion * newQuestions.length, 5)
      : Number(newDuration);

    const created: TeacherExam = {
      id: `exam-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      targetCategory: 'all',
      targetGradeLevels: newTargetGradeLevels || 'All Grades',
      durationMinutes: calculatedDuration,
      timePerQuestionMinutes: newTimePerQuestion > 0 ? Number(newTimePerQuestion) : undefined,
      deliveryMode: newDeliveryMode,
      totalMarks: 100,
      passingScore: Number(newPassingScore),
      questions: newQuestions,
      instructions: newInstructions,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      deadline: '2025-12-30'
    };

    const updated = StorageService.addExam(created);
    onExamsChange(updated);
    setShowCreateModal(false);

    // Reset
    setNewTitle('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification Banner */}
      {toastNotice && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastNotice}</span>
          <button
            onClick={() => setToastNotice(null)}
            className="ml-2 text-slate-400 hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Active Exam Taking Screen */}
      {activeExam && !isExamCompleted ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-lg animate-in fade-in duration-150">
          {/* Top exam status bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                {activeExam.subject}
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                {activeExam.title}
              </h2>
              <p className="text-xs text-slate-500">
                {currentLang === 'om' ? 'Qoramaataa:' : currentLang === 'en' ? 'Examinee:' : 'ተፈታኝ፡'}{' '}
                <strong className="text-slate-800">{currentTeacherName}</strong> ({currentSchoolName})
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Active Question Timer */}
              {activeExam.timePerQuestionMinutes ? (
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-xs ${
                    questionTimeLeft < 30
                      ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                      : 'bg-amber-50 text-amber-900 border-amber-300'
                  }`}
                  title={currentLang === 'om' ? 'Sa’aatii gaaffii kanaa hafe' : currentLang === 'en' ? 'Remaining question time' : 'የዚህ ነጠላ ጥያቄ የቀረው ሰዓት'}
                >
                  <Timer className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                  <span>
                    {currentLang === 'om' ? 'Sa’aatii Gaaffii:' : currentLang === 'en' ? 'Question:' : 'የጥያቄው ሰዓት፡'}{' '}
                    {formatTime(questionTimeLeft)}
                  </span>
                </div>
              ) : null}

              {/* Overall Exam Timer */}
              <div
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                  timeLeft < 180
                    ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
                title={currentLang === 'om' ? 'Sa’aatii waliigalaa hafe' : currentLang === 'en' ? 'Total remaining exam time' : 'ጠቅላላ የፈተናው የቀረው ሰዓት'}
              >
                <Clock className="w-4 h-4" />
                <span>
                  {currentLang === 'om' ? 'Waliigala:' : currentLang === 'en' ? 'Total:' : 'ጠቅላላ፡'}{' '}
                  {formatTime(timeLeft)}
                </span>
              </div>

              <button
                onClick={() => setActiveExam(null)}
                className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                {currentLang === 'om' ? 'Addaan Kuti' : currentLang === 'en' ? 'Exit' : 'አቋርጥ'}
              </button>
            </div>
          </div>

          {/* Delivery Mode Banner Notice */}
          <div className="mt-3">
            {activeExam.deliveryMode === 'one_by_one' ? (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 text-xs font-bold">
                <Lock className="w-4 h-4 text-teal-700 shrink-0" />
                <span>
                  {currentLang === 'om'
                    ? "🔒 Tartiiba Cimaa: Gaaffii tokko hojjetanii 'Gaaffii Itti-Aanu' yoo tuqan qofa kan itti aanu dhufa. Gara gaaffii darbeetti deebi’uun hin eeyyamamu."
                    : currentLang === 'en'
                    ? "🔒 Strict Sequence: Click 'Next Question' after each item. Returning to previous questions is locked."
                    : "🔒 ጥብቅ ቅደም-ተከተል፡ አንድ ጥያቄ ሰርተው 'ቀጣይ ጥያቄ' ሲሉ ብቻ የሚቀጥለው ይደርስዎታል። የቀደመ ጥያቄ ላይ መመለስ አይፈቀድም።"}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <Unlock className="w-4 h-4 text-indigo-700 shrink-0" />
                  <span>
                    {currentLang === 'om'
                      ? '🔓 Dhiyeessa Banaa: Gaaffilee irra utaaluun hojjechuu fi deebii keessa deebi’uu dandeessu.'
                      : currentLang === 'en'
                      ? '🔓 Open Navigation: You can jump between questions and review your answers.'
                      : '🔓 ክፍት አቀራረብ፡ ጥያቄዎችን እንደፈለጉ እየዘለሉ መስራትና መልስ መከለስ ይችላሉ።'}
                  </span>
                </div>
                {/* Question jumping pills in all_at_once mode */}
                <div className="flex items-center gap-1 overflow-x-auto">
                  {activeExam.questions.map((_, qIdx) => (
                    <button
                      key={qIdx}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(qIdx)}
                      className={`w-6 h-6 rounded-md text-[11px] font-mono font-bold transition-all ${
                        currentQuestionIndex === qIdx
                          ? 'bg-indigo-800 text-white shadow-xs'
                          : selectedAnswers[activeExam.questions[qIdx].id] !== undefined
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {qIdx + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Auto advance notice toast */}
          {autoAdvanceNotice && (
            <div className="mt-3 p-3 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold flex items-center gap-2 animate-bounce">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{autoAdvanceNotice}</span>
            </div>
          )}

          {/* Question View */}
          {activeExam.questions[currentQuestionIndex] && (
            <div className="py-4 space-y-5">
              {/* Question progress & per-question timer bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>
                    {currentLang === 'om'
                      ? `Gaaffii ${currentQuestionIndex + 1} / ${activeExam.questions.length}`
                      : currentLang === 'en'
                      ? `Question ${currentQuestionIndex + 1} of ${activeExam.questions.length}`
                      : `ጥያቄ ${currentQuestionIndex + 1} ከ ${activeExam.questions.length}`}
                  </span>
                  <span>
                    {currentLang === 'om' ? 'Kan Deebifame:' : currentLang === 'en' ? 'Answered:' : 'የተመለሱ፡'}{' '}
                    {Object.keys(selectedAnswers).length} / {activeExam.questions.length}
                  </span>
                </div>

                {activeExam.timePerQuestionMinutes ? (
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-1.5 transition-all duration-1000"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            (questionTimeLeft / ((activeExam.timePerQuestionMinutes || 2) * 60)) * 100
                          )
                        )}%`
                      }}
                    />
                  </div>
                ) : null}
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-sm font-bold text-slate-900 leading-relaxed">
                  {activeExam.questions[currentQuestionIndex].questionText}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {activeExam.questions[currentQuestionIndex].options.map((opt, idx) => {
                  const qId = activeExam.questions[currentQuestionIndex].id;
                  const isSelected = selectedAnswers[qId] === idx;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(qId, idx)}
                      className={`w-full text-left p-3.5 rounded-xl text-xs font-medium border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                            isSelected
                              ? 'bg-emerald-800 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {activeExam.deliveryMode !== 'one_by_one' ? (
                  <button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                    className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl transition-colors cursor-pointer"
                  >
                    {currentLang === 'om'
                      ? '← Gaaffii Duraa'
                      : currentLang === 'en'
                      ? '← Previous Question'
                      : '← የቀደመ ጥያቄ'}
                  </button>
                ) : (
                  <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {currentLang === 'om'
                        ? 'Gara duubatti deebi\'uun hin danda\'amu'
                        : currentLang === 'en'
                        ? 'Cannot go back'
                        : 'ወደ ኋላ መመለስ አይቻልም'}
                    </span>
                  </div>
                )}

                {currentQuestionIndex < activeExam.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>
                      {currentLang === 'om'
                        ? 'Gaaffii Itti-Aanu'
                        : currentLang === 'en'
                        ? 'Next Question'
                        : 'የሚቀጥለው ጥያቄ'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitExam}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span>
                      {currentLang === 'om'
                        ? '✓ Qormaata Xumuriitii Biiroof Ergi'
                        : currentLang === 'en'
                        ? '✓ Finish & Submit to Bureau'
                        : '✓ ፈተናውን ጨርስና ለትምህርት ቢሮ አስረክብ'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : activeExam && isExamCompleted && examResult ? (
        /* Exam Submitted - Pending Bureau Review (Requirement #3) */
        <div className="space-y-6 animate-in fade-in zoom-in-95 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-lg text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-9 h-9 animate-pulse" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 mb-2">
                {currentLang === 'om'
                  ? '🟡 Haala Qabxii: Gamaaggama Biiroo Barnootaa Irra Jira (Pending Review)'
                  : currentLang === 'en'
                  ? '🟡 Result Status: Pending Education Bureau Review'
                  : '🟡 የውጤት ሁኔታ፡ በትምህርት ቢሮ ግምገማ ላይ (Pending Review)'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {currentLang === 'om'
                  ? 'Qormaanni Keessan Milkaa’inaan Xumuramee Biiroo Barnootaatiif Ergameera!'
                  : currentLang === 'en'
                  ? 'Exam Completed and Submitted to the Education Bureau!'
                  : 'ፈተናዎ በስኬት ተጠናቆ ለትምህርት ቢሮ ተልኳል!'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {currentLang === 'om' ? 'Qormaata:' : currentLang === 'en' ? 'Exam:' : 'ፈተና፡'}{' '}
                <strong>{examResult.examTitle || activeExam.title}</strong>
              </p>
            </div>

            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-left space-y-2.5 text-xs text-amber-950">
              <div className="flex items-start gap-2">
                <FileSearch className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>
                    {currentLang === 'om'
                      ? 'Hojmaata Idilee Qabxii Biiroo Barnootaa: '
                      : currentLang === 'en'
                      ? 'Official Bureau Grading Process: '
                      : 'የትምህርት ቢሮ ይፋዊ የውጤት አሰራር፡ '}
                  </strong>
                  {currentLang === 'om'
                    ? 'Gaaffii fi deebiin keessan Biiroo Barnootaatiin erga ilaalamee booda yeroo biiroon "Qabxiin Barsiisaa Haa Gahu" jedhu akaawuntii keessan ("Qabxiiwwan Koo") irratti battalumatti isin gaha.'
                    : currentLang === 'en'
                    ? 'Once the Education Bureau reviews your questions and answers and clicks "Release to Teacher", your score and certificate will appear immediately under "My Results".'
                    : 'የመምህራን የፈተና ጥያቄና መልስ ውጤት በትምህርት ቢሮ ጥያቄውና መልሱ ከታየ በኋላ ትምህርት ቢሮ "ውጤት ለመምህራን ይድረስ" ሲል በራስዎ አካውንት ("የእኔ ውጤቶች" ገፅ ላይ) ወዲያውኑ ይደርስዎታል።'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200 text-[11px]">
                <div>
                  {currentLang === 'om' ? 'Barsiisaa Qoramaataa:' : currentLang === 'en' ? 'Examinee:' : 'ተፈታኝ መምህር፡'}{' '}
                  <strong>{examResult.teacherName}</strong>
                </div>
                <div>
                  {currentLang === 'om' ? 'Mana Barumsaa:' : currentLang === 'en' ? 'School:' : 'ትምህርት ቤት፡'}{' '}
                  <strong>{examResult.schoolName}</strong>
                </div>
                <div>
                  {currentLang === 'om' ? 'Baay’ina Gaaffii:' : currentLang === 'en' ? 'Questions:' : 'የጥያቄዎች ብዛት፡'}{' '}
                  <strong>
                    {examResult.totalMarks} {currentLang === 'om' ? 'Gaaffilee' : currentLang === 'en' ? 'Questions' : 'ጥያቄዎች'}
                  </strong>
                </div>
                <div>
                  {currentLang === 'om' ? 'Yeroo Ergame:' : currentLang === 'en' ? 'Submitted:' : 'የተላከበት ቀንና ሰዓት፡'}{' '}
                  <strong>{new Date(examResult.submittedAt).toLocaleTimeString()}</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveExam(null);
                  setActiveExamTab('my_results');
                }}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>
                  {currentLang === 'om'
                    ? 'Haala Qabxiiwwan Koo Ilaali (My Results)'
                    : currentLang === 'en'
                    ? 'View My Results Status'
                    : 'የእኔ ውጤቶች ሁኔታን ተመልከት (My Results)'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveExam(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {currentLang === 'om'
                  ? 'Gara Tarree Qormaataatti Deebi’i'
                  : currentLang === 'en'
                  ? 'Back to Exams Directory'
                  : 'ወደ ፈተናዎች ማውጫ ተመለስ'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Exams Directory & Management Tabs */
        <div className="space-y-6">
          {/* Main Module Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveExamTab('exams')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeExamTab === 'exams'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>
                {currentLang === 'om'
                  ? `Tarree Qormaataa (${filteredExams.length})`
                  : currentLang === 'en'
                  ? `Available Exams (${filteredExams.length})`
                  : `የፈተናዎች ማውጫ (${filteredExams.length})`}
              </span>
            </button>

            {isBureauOfficer && (
              <button
                type="button"
                onClick={() => setActiveExamTab('bureau_reviews')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  activeExamTab === 'bureau_reviews'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>
                  {currentLang === 'om'
                    ? 'Gamaaggama Biiroo & Gadhiisa Qabxii'
                    : currentLang === 'en'
                    ? 'Bureau Review & Result Release'
                    : 'የትምህርት ቢሮ ግምገማ እና ውጤት መልቀቂያ'}
                </span>
                {submissions.filter((s) => s.reviewStatus === 'pending_bureau_review').length > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                    {submissions.filter((s) => s.reviewStatus === 'pending_bureau_review').length}{' '}
                    {currentLang === 'om' ? 'Eegaa Jiru' : currentLang === 'en' ? 'Pending' : 'ግምገማ የሚጠብቁ'}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveExamTab('my_results')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeExamTab === 'my_results'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 text-indigo-700" />
              <span>
                {currentLang === 'om'
                  ? 'Qabxiiwwan Koo (My Results)'
                  : currentLang === 'en'
                  ? 'My Results'
                  : 'የእኔ ውጤቶች (My Results)'}
              </span>
              {submissions.filter((s) => s.reviewStatus === 'released_to_teacher').length > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {submissions.filter((s) => s.reviewStatus === 'released_to_teacher').length}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: EXAMS DIRECTORY */}
          {activeExamTab === 'exams' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                          {t.exam_title}
                        </h2>
                        <span className="text-xs text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 font-bold">
                          {filteredExams.length} / {exams.length}{' '}
                          {currentLang === 'om' ? 'Qormaatawwan' : currentLang === 'en' ? 'Exams' : 'ፈተናዎች'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{t.exam_desc}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
                    {isBureauOfficer ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setAiGeneratorInitialMaterialId(undefined);
                            setShowAIGeneratorModal(true);
                          }}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-950 hover:from-emerald-700 hover:to-indigo-900 text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer border border-emerald-400/40 hover:scale-102"
                        >
                          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                          <span>
                            {currentLang === 'om'
                              ? '✨ AI dhaan Barreeffama Leenjii Irraa Qormaata Baasi'
                              : currentLang === 'en'
                              ? '✨ AI Exam Generator from Training'
                              : '✨ በ AI ከስልጠና ፅሁፍ ፈተና አውጣ (AI Exam Generator)'}
                          </span>
                        </button>

                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>
                            {currentLang === 'om'
                              ? 'Harkaan Qopheessi (Manual)'
                              : currentLang === 'en'
                              ? 'Create Manual Exam'
                              : 'በእጅ አዘጋጅ (Manual)'}
                          </span>
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold">
                        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>
                          {currentLang === 'om'
                            ? 'Aangoon seera qabeessi qormaata baasuu kan Biiroo Barnootaa qofa.'
                            : currentLang === 'en'
                            ? 'Exam creation authority belongs solely to the Education Bureau.'
                            : 'ፈተና የማውጣት ህጋዊ ስልጣን የትምህርት ቢሮ ብቻ ነው።'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Exam Generation Authority Showcase Banner */}
                <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 rounded-2xl p-4 text-white border border-emerald-500/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-[10px] font-bold text-amber-300">
                      <ShieldCheck className="w-3 h-3 text-amber-300" />
                      <span>
                        {currentLang === 'om'
                          ? 'Giddugala Qormaata Idilee Biiroo Barnootaa · Bureau Exam Authority'
                          : currentLang === 'en'
                          ? 'Official Education Bureau Exam Center'
                          : 'ይፋዊ የትምህርት ቢሮ የፈተናዎች ማዕከል · Bureau Exam Authority'}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-black tracking-tight text-white">
                      {currentLang === 'om'
                        ? 'Aangoon qormaata gahumsa barsiisotaa qopheessuu fi baasuu kan Biiroo Barnootaa qofa'
                        : currentLang === 'en'
                        ? 'Only the Education Bureau is authorized to prepare and publish teacher competency exams'
                        : 'የመምህራን ብቃት መመዘኛ ፈተናዎችን የማዘጋጀት እና የማውጣት ስልጣን የትምህርት ቢሮ ብቻ ነው'}
                    </h3>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {isBureauOfficer
                        ? currentLang === 'om'
                          ? 'Ogeeyyiin Biiroo Barnootaa kallattiidhaan mojuulota leenjii irraa teeknooloojii AI tiin ykn harkaan gaaffilee, daangaa sa’aatii fi qabxii darbinsaa murteessanii barsiisotaaf gadhiisu.'
                          : currentLang === 'en'
                          ? 'Bureau specialists generate or craft competency exams directly from training manuals with custom per-question timers and passing scores.'
                          : 'የትምህርት ቢሮ ባለሙያዎች በቀጥታ ከስልጠና ማንዋሎች ላይ በ AI ቴክኖሎጂ ወይም በእጅ ጥያቄዎችን፣ የጥያቄ ሰዓት ገደብ እና የማለፊያ ነጥብ ወስነው ለመምህራን ይፋ ያደርጋሉ።'
                        : currentLang === 'om'
                        ? 'Qormaatawwan gahumsaa Biiroo Barnootaatiin qophaa’an tarree armaan gadii keessaa filachuun "Qormaata Fudhadhu" isa jedhu cuqaasaa. Qabxiin yeroo Biiroon mirkanaa’u akaawuntii keessanitti ni dhufa.'
                        : currentLang === 'en'
                        ? 'Select an official competency exam prepared by the Bureau below and click "Take Exam". Results will be delivered to your account after Bureau review.'
                        : 'የትምህርት ቢሮ ያዘጋጃቸውንና ያረጋገጣቸውን ይፋዊ የብቃት ፈተናዎች ከታች ካለው ዝርዝር በመምረጥ "ፈተናውን ውሰድ" የሚለውን ይጫኑ። የፈተናው ውጤት በትምህርት ቢሮ ተገምግሞ ሲለቀቅ በግል አካውንትዎ ይደርሰዎታል።'}
                    </p>
                  </div>

                  {isBureauOfficer ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAiGeneratorInitialMaterialId(undefined);
                        setShowAIGeneratorModal(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {currentLang === 'om'
                          ? 'AI dhaan Qormaata Baasi'
                          : currentLang === 'en'
                          ? 'Generate with AI'
                          : 'ፈተና በ AI አውጣ'}
                      </span>
                    </button>
                  ) : (
                    <div className="px-3.5 py-2 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20 text-white text-xs font-bold shrink-0 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-300" />
                      <span>
                        {filteredExams.length}{' '}
                        {currentLang === 'om'
                          ? 'Qormaatawwan Qophaa’oo Idilee'
                          : currentLang === 'en'
                          ? 'Official Ready Exams'
                          : 'ዝግጁ ይፋዊ ፈተናዎች'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Search & Subject Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={
                        currentLang === 'om'
                          ? 'Mata-duree qormaataa, gosa barnootaa ykn qajeelfama barbaadi...'
                          : currentLang === 'en'
                          ? 'Search exam title, subject or instructions...'
                          : 'የፈተናውን ርዕስ፣ የትምህርት አይነት ወይም መመሪያ ፈልግ...'
                      }
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-600 focus:outline-hidden font-medium"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Subject Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
                    {[
                      { id: 'all', label: currentLang === 'om' ? 'Qormaata Hunda' : currentLang === 'en' ? 'All Exams' : 'ሁሉም ፈተናዎች' },
                      { id: 'Pedagogy', label: currentLang === 'om' ? 'Mala Barsiisuu (Pedagogy)' : currentLang === 'en' ? 'Pedagogy' : 'ስነ-ዘዴ (Pedagogy)' },
                      { id: 'Mathematics', label: currentLang === 'om' ? 'Herrega' : currentLang === 'en' ? 'Mathematics' : 'ሂሳብ' },
                      { id: 'English', label: currentLang === 'om' ? 'Ingiliffa' : currentLang === 'en' ? 'English' : 'እንግሊዝኛ' },
                      { id: 'Oromoo', label: 'Afaan Oromoo' },
                      { id: 'Science', label: currentLang === 'om' ? 'Saayinsii' : currentLang === 'en' ? 'Science' : 'ሳይንስ' }
                    ].map((sb) => (
                      <button
                        key={sb.id}
                        type="button"
                        onClick={() => setSelectedSubjectFilter(sb.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          selectedSubjectFilter === sb.id
                            ? 'bg-amber-800 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        {sb.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Personalized Teacher Assignment Banner:
                  "መምህሩ እንደሚያስተምረው የትምህርት አይነቶች እና የ ክፍል ደረጃ ብቻ ፈተናወች እንዲደርሰው አድርጉ" */}
              {!isBureauOfficer && (
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border-2 border-emerald-300/80 rounded-2xl p-4 shadow-xs space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Award className="w-5 h-5 text-amber-300" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-emerald-950">
                            {currentLang === 'om'
                              ? 'Dirree Barnootaa fi Sadarkaa Kutaa Isiniif Ramadame'
                              : currentLang === 'en'
                              ? 'Your Assigned Subject Field & Grade Level'
                              : 'የእርስዎ የተመደበበት የትምህርት መስክና የክፍል ደረጃ'}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 border border-emerald-300">
                            {currentLang === 'om'
                              ? 'Ramaddii Idilee Gingilchaame'
                              : currentLang === 'en'
                              ? 'Official Filtered Assignment'
                              : 'ይፋዊ የተጣራ ምደባ'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 mt-0.5">
                          {currentLang === 'om'
                            ? 'Gosa barnootaa barsiistan: '
                            : currentLang === 'en'
                            ? 'Assigned Subject: '
                            : 'የሚያስተምሩት የትምህርት ዓይነት፡ '}
                          <strong className="text-emerald-900 font-bold underline">
                            {teacherAssignment.primarySubjectLabel}
                          </strong>{' '}
                          ·{' '}
                          {currentLang === 'om'
                            ? 'Sadarkaa Kutaa: '
                            : currentLang === 'en'
                            ? 'Grade Level: '
                            : 'የክፍል ደረጃ፡ '}
                          <strong className="text-amber-900 font-bold underline">
                            {teacherAssignment.primaryGradeLabel}
                          </strong>
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 text-xs font-bold shrink-0 shadow-2xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>
                        {filteredExams.length}{' '}
                        {currentLang === 'om'
                          ? 'Qormaatawwan Ramadaman Qofa'
                          : currentLang === 'en'
                          ? 'Assigned Exams Only'
                          : 'የተመደቡ ፈተናዎች ብቻ'}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-emerald-900/90 bg-white/70 p-2.5 rounded-xl border border-emerald-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>
                        {currentLang === 'om'
                          ? 'Qajeelfama Biiroo Barnootaa: '
                          : currentLang === 'en'
                          ? 'Education Bureau Policy: '
                          : 'የትምህርት ቢሮ ደንብ፡ '}
                      </strong>
                      {currentLang === 'om'
                        ? 'Qormaatawwan gosa barnootaa fi sadarkaa kutaa barsiistanitti qophaa’an qofatu gingilchaamee isin gahe.'
                        : currentLang === 'en'
                        ? 'Only competency exams tailored to your assigned subject and grade levels are filtered and shown here.'
                        : 'እርስዎ ለሚያስተምሩት የትምህርት ዓይነትና የክፍል ደረጃ የተዘጋጁ ፈተናዎች እና አጠቃላይ የክፍል ስነ-ዘዴ ምዘናዎች ብቻ ተጣርተው ደርሰውዎታል። የሌሎች የትምህርት ክፍሎች ፈተናዎች ተደብቀዋል።'}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                            {exam.subject}
                          </span>
                          {exam.targetGradeLevels && (
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                              {exam.targetGradeLevels}
                            </span>
                          )}
                          {exam.generatedByAI && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-900 border border-indigo-300">
                              <Sparkles className="w-3 h-3 text-indigo-600" />
                              <span>
                                {currentLang === 'om'
                                  ? '✨ AI dhaan Qophaa’e'
                                  : currentLang === 'en'
                                  ? '✨ AI Generated'
                                  : '✨ በ AI የተዘጋጀ'}
                              </span>
                            </span>
                          )}
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            exam.deliveryMode === 'one_by_one'
                              ? 'bg-teal-50 text-teal-900 border-teal-200'
                              : 'bg-indigo-50 text-indigo-900 border-indigo-200'
                          }`}>
                            {exam.deliveryMode === 'one_by_one'
                              ? currentLang === 'om'
                                ? '🔒 Tartiiba (Step)'
                                : currentLang === 'en'
                                ? '🔒 Step-by-Step'
                                : '🔒 ቅደም-ተከተል (Step)'
                              : currentLang === 'om'
                              ? '🔓 Banaa (All)'
                              : currentLang === 'en'
                              ? '🔓 Open (All)'
                              : '🔓 ክፍት (All)'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {currentLang === 'om' ? 'Hanga' : currentLang === 'en' ? 'Until' : 'እስከ'} {exam.deadline}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {exam.title}
                      </h3>

                      {exam.sourceTrainingTitle && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-900 font-semibold mt-1 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/80">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate">
                            {currentLang === 'om'
                              ? 'Barreeffama Leenjii:'
                              : currentLang === 'en'
                              ? 'Training Source:'
                              : 'የስልጠና ፅሁፍ፡'}{' '}
                            {exam.sourceTrainingTitle}
                          </span>
                        </div>
                      )}

                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {exam.instructions}
                      </p>

                      <div className="mt-4 grid grid-cols-4 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-400 block">
                            {currentLang === 'om' ? 'Sa’aatii Waliigalaa' : currentLang === 'en' ? 'Total Time' : 'ጠቅላላ ሰዓት'}
                          </span>
                          <strong className="text-slate-800">
                            {exam.durationMinutes}{' '}
                            {currentLang === 'om' ? 'Daqiiqaa' : currentLang === 'en' ? 'Min' : 'ደቂቃ'}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">
                            {currentLang === 'om' ? 'Sa’aatii Gaaffii' : currentLang === 'en' ? 'Per Question' : 'የጥያቄ ሰዓት'}
                          </span>
                          <strong className="text-amber-800">
                            {exam.timePerQuestionMinutes
                              ? `${exam.timePerQuestionMinutes} ${currentLang === 'om' ? 'Daq/Gaaffii' : currentLang === 'en' ? 'min/Q' : 'ደ/ጥ'}`
                              : currentLang === 'om'
                              ? 'Daangaa Malee'
                              : currentLang === 'en'
                              ? 'Unlimited'
                              : 'ያልተገደበ'}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">
                            {currentLang === 'om' ? 'Baay’ina Gaaffii' : currentLang === 'en' ? 'Questions' : 'የጥያቄ ብዛት'}
                          </span>
                          <strong className="text-slate-800">
                            {exam.questions.length}{' '}
                            {currentLang === 'om' ? 'Gaaffii' : currentLang === 'en' ? 'Q' : 'ጥያቄ'}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">
                            {currentLang === 'om' ? 'Qabxii Darbinsaa' : currentLang === 'en' ? 'Passing' : 'ማለፊያ'}
                          </span>
                          <strong className="text-emerald-800">{exam.passingScore}%</strong>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {currentLang === 'om' ? 'Haala:' : currentLang === 'en' ? 'Status:' : 'ሁኔታ፡'}{' '}
                        <strong className="text-emerald-700">
                          {currentLang === 'om' ? 'Qophii' : currentLang === 'en' ? 'Ready' : 'ዝግጁ'}
                        </strong>
                      </span>
                      <button
                        onClick={() => handleStartExam(exam)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>{t.btn_take_exam}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: BUREAU REVIEW & RELEASE (Requirement #3) */}
          {activeExamTab === 'bureau_reviews' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Bureau Review Header */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-md border border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-bold">
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                      <span>
                        {currentLang === 'om'
                          ? 'Giddugala Odiitii Qabxii & Mirkaneessaa Biiroo Barnootaa'
                          : currentLang === 'en'
                          ? 'Official Bureau Score Audit & Approval Center'
                          : 'የትምህርት ቢሮ ይፋዊ የውጤት ኦዲት እና ማፅደቂያ ማዕከል'}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      {currentLang === 'om'
                        ? 'Gamaaggama Gaaffii & Deebii Barsiisotaa fi Qabxii Ifa Gochuu'
                        : currentLang === 'en'
                        ? 'Teacher Exam Q&A Review & Result Publishing'
                        : 'የመምህራን ፈተና ጥያቄና መልስ ግምገማ እና ይፋ ማድረጊያ'}
                    </h2>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      {currentLang === 'om'
                        ? 'Gaaffii fi deebii barsiisonni hojjetan asitti gamaaggamaa. Yeroo "Qabxiin Barsiisaa Haa Gahu / Mirkaneessi" cuqaastan barsiisaan akaawuntii isaa irratti qabxii fi waraqaa ragaa battalumatti argata.'
                        : currentLang === 'en'
                        ? 'Review submitted teacher exam answers here. Clicking "Release to Teacher / Approve" immediately delivers the score, explanations, and certificate to the teacher.'
                        : 'መምህራን የሰሩትን የፈተና ጥያቄዎችና የመረጧቸውን መልሶች እዚህ ይገምግሙ። "ውጤቱ ለመምህሩ ይድረስ / አጽድቅ" ሲሉ መምህሩ በራሱ አካውንት ውጤቱን፣ ትክክለኛ ማብራሪያዎችን እና ይፋዊ ሰርተፊኬቱን ወዲያውኑ ይቀበላል።'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleBatchReleaseAll}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer flex items-center justify-center gap-2 shrink-0"
                  >
                    <Send className="w-4 h-4 text-slate-950" />
                    <span>
                      {currentLang === 'om'
                        ? '🚀 Hunda Barsiisotaaf Yeroo Tokkotti Ergi'
                        : currentLang === 'en'
                        ? '🚀 Release All to Teachers'
                        : '🚀 ሁሉንም ለመምህራን በአንድ ጊዜ ላክ'}
                    </span>
                  </button>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15">
                    <span className="text-[11px] text-slate-300 block">
                      {currentLang === 'om'
                        ? "Ida'ama Qormaatawwan Ergamanii"
                        : currentLang === 'en'
                        ? 'Total Submitted Exams'
                        : 'ጠቅላላ የተላኩ ፈተናዎች'}
                    </span>
                    <strong className="text-xl font-black font-mono text-white">
                      {submissions.length}
                    </strong>
                  </div>
                  <div className="bg-amber-500/20 backdrop-blur-xs p-3.5 rounded-2xl border border-amber-400/30">
                    <span className="text-[11px] text-amber-200 block">
                      {currentLang === 'om'
                        ? 'Gamaaggama Kan Eegan (Pending)'
                        : currentLang === 'en'
                        ? 'Pending Review'
                        : 'ግምገማ የሚጠብቁ (Pending)'}
                    </span>
                    <strong className="text-xl font-black font-mono text-amber-300 flex items-center gap-2">
                      <span>{submissions.filter((s) => s.reviewStatus === 'pending_bureau_review').length}</span>
                      <span className="text-xs font-normal bg-amber-400/30 px-2 py-0.5 rounded-full text-amber-100">
                        {currentLang === 'om' ? 'Eegaa Jiru' : currentLang === 'en' ? 'Waiting' : 'ግምገማ ይጠብቃሉ'}
                      </span>
                    </strong>
                  </div>
                  <div className="bg-emerald-500/20 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-400/30">
                    <span className="text-[11px] text-emerald-200 block">
                      {currentLang === 'om'
                        ? 'Barsiisotaaf Kan Gadhiifaman (Released)'
                        : currentLang === 'en'
                        ? 'Released to Teachers'
                        : 'ለመምህራን የተለቀቁ (Released)'}
                    </span>
                    <strong className="text-xl font-black font-mono text-emerald-300">
                      {submissions.filter((s) => s.reviewStatus === 'released_to_teacher').length}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Submissions Filter & Search */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={submissionSearch}
                    onChange={(e) => setSubmissionSearch(e.target.value)}
                    placeholder={
                      currentLang === 'om'
                        ? 'Barsiisaa, mana barumsaa ykn mata-duree qormaataa barbaadi...'
                        : currentLang === 'en'
                        ? 'Search teacher, school or exam title...'
                        : 'መምህር፣ ትምህርት ቤት ወይም የፈተና ርዕስ ፈልግ...'
                    }
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white font-medium"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  {[
                    {
                      id: 'all',
                      label: `${currentLang === 'om' ? 'Hunda' : currentLang === 'en' ? 'All' : 'ሁሉም'} (${submissions.length})`
                    },
                    {
                      id: 'pending',
                      label: `${currentLang === 'om' ? 'Kan Eegan' : currentLang === 'en' ? 'Pending' : 'ግምገማ የሚጠብቁ'} (${submissions.filter((s) => s.reviewStatus === 'pending_bureau_review').length})`
                    },
                    {
                      id: 'released',
                      label: `${currentLang === 'om' ? 'Gadhiifaman' : currentLang === 'en' ? 'Released' : 'የተለቀቁ'} (${submissions.filter((s) => s.reviewStatus === 'released_to_teacher').length})`
                    }
                  ].map((flt) => (
                    <button
                      key={flt.id}
                      type="button"
                      onClick={() => setReviewFilterStatus(flt.id as any)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                        reviewFilterStatus === flt.id
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {flt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submissions List */}
              <div className="space-y-3">
                {submissions
                  .filter((sub) => {
                    if (reviewFilterStatus === 'pending') return sub.reviewStatus === 'pending_bureau_review';
                    if (reviewFilterStatus === 'released') return sub.reviewStatus === 'released_to_teacher';
                    return true;
                  })
                  .filter((sub) => {
                    const q = submissionSearch.toLowerCase().trim();
                    if (!q) return true;
                    return (
                      sub.teacherName.toLowerCase().includes(q) ||
                      sub.schoolName.toLowerCase().includes(q) ||
                      (sub.examTitle || '').toLowerCase().includes(q) ||
                      sub.subject.toLowerCase().includes(q)
                    );
                  })
                  .map((sub) => (
                    <div
                      key={sub.id}
                      className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                              sub.reviewStatus === 'pending_bureau_review'
                                ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            }`}
                          >
                            {sub.reviewStatus === 'pending_bureau_review'
                              ? currentLang === 'om'
                                ? '🟡 Gamaaggama Biiroo Irra Jira'
                                : currentLang === 'en'
                                ? '🟡 Pending Bureau Review'
                                : '🟡 በትምህርት ቢሮ ግምገማ ላይ'
                              : currentLang === 'om'
                              ? '🟢 Barsiisaaf Gadhiifameera'
                              : currentLang === 'en'
                              ? '🟢 Released to Teacher'
                              : '🟢 ለመምህሩ ተለቋል'}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500">
                            {sub.subject}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <h3 className="text-sm font-black text-slate-900">
                          {sub.examTitle || (currentLang === 'om' ? 'Madaallii Gahumsa Barsiisotaa' : currentLang === 'en' ? 'Teacher Competency Assessment' : 'የመምህራን ብቃት ምዘና')}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                          <span>
                            {currentLang === 'om' ? 'Qoramaataa:' : currentLang === 'en' ? 'Examinee:' : 'ተፈታኝ፡'}{' '}
                            <strong className="text-slate-900">{sub.teacherName}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            {currentLang === 'om' ? 'Mana Barumsaa:' : currentLang === 'en' ? 'School:' : 'ትምህርት ቤት፡'}{' '}
                            <strong className="text-slate-800">{sub.schoolName}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            {currentLang === 'om' ? 'Qabxii:' : currentLang === 'en' ? 'Score:' : 'ውጤት፡'}{' '}
                            <strong className={sub.passed ? 'text-emerald-700' : 'text-rose-700'}>
                              {sub.percentage}% ({sub.score}/{sub.totalMarks})
                            </strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSubmissionForReview(sub);
                            setBureauOfficerFeedback(sub.bureauNotes || '');
                          }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-700" />
                          <span>
                            {currentLang === 'om'
                              ? 'Gaaffii & Deebii Gamaaggami'
                              : currentLang === 'en'
                              ? 'Inspect Q&A'
                              : 'ጥያቄና መልስ ገምግም'}
                          </span>
                        </button>

                        {sub.reviewStatus === 'pending_bureau_review' ? (
                          <button
                            type="button"
                            onClick={() => handleBureauReleaseResult(sub.id)}
                            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>
                              {currentLang === 'om'
                                ? 'Qabxii Barsiisaaf Ergi'
                                : currentLang === 'en'
                                ? 'Release to Teacher'
                                : 'ውጤት ለመምህሩ ላክ'}
                            </span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
                            <span>
                              {currentLang === 'om' ? 'Ergameera' : currentLang === 'en' ? 'Sent' : 'ተልኳል'}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 3: MY RESULTS (Teacher Account View) */}
          {activeExamTab === 'my_results' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-100 text-indigo-800">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      {currentLang === 'om'
                        ? 'Qabxiiwwan Qormaataa fi Waraqaawwan Ragaa Koo (My Results)'
                        : currentLang === 'en'
                        ? 'My Exam Results & Certificates'
                        : 'የእኔ የፈተና ውጤቶች እና ሰርተፊኬቶች (My Results)'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {currentLang === 'om'
                        ? 'Tarree qormaata gahumsaa fudhattanii. Qabxiiwwan Biiroon Barnootaa gamaaggamee gadhiise asitti ilaalaa.'
                        : currentLang === 'en'
                        ? 'List of competency exams you have taken. View scores and certificates released after Bureau review.'
                        : 'የወሰዷቸው የብቃት ፈተናዎች ዝርዝር። የትምህርት ቢሮ ጥያቄውንና መልሱን ከገመገመ በኋላ ይፋ ያደረጋቸውን ውጤቶች እዚህ ይመልከቱ።'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {submissions.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-500">
                      {currentLang === 'om'
                        ? 'Hanga ammaatti qormaanni fudhattan hin jiru.'
                        : currentLang === 'en'
                        ? 'You have not taken any exams yet.'
                        : 'እስካሁን የወሰዱት ፈተና የለም።'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveExamTab('exams')}
                      className="mt-3 px-4 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      {currentLang === 'om'
                        ? 'Qormaatawwan Ilaali'
                        : currentLang === 'en'
                        ? 'Browse Exams'
                        : 'ፈተናዎችን ይመልከቱ'}
                    </button>
                  </div>
                ) : (
                  submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                            {sub.subject}
                          </span>
                          <h3 className="text-sm font-black text-slate-900 mt-1">
                            {sub.examTitle || (currentLang === 'om' ? 'Madaallii Gahumsa Barsiisotaa' : currentLang === 'en' ? 'Teacher Competency Exam' : 'የመምህራን ብቃት ምዘና')}
                          </h3>
                        </div>

                        <div>
                          {sub.reviewStatus === 'pending_bureau_review' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
                              <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                              <span>
                                {currentLang === 'om'
                                  ? '🟡 Gamaaggama Biiroo Irra Jira'
                                  : currentLang === 'en'
                                  ? '🟡 Under Bureau Review'
                                  : '🟡 በትምህርት ቢሮ ግምገማ ላይ ነው'}
                              </span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>
                                {currentLang === 'om'
                                  ? '🟢 Qabxiin Biiroon Gadhiifameera'
                                  : currentLang === 'en'
                                  ? '🟢 Result Released by Bureau'
                                  : '🟢 ውጤቱ በትምህርት ቢሮ ተለቋል'}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content based on review status */}
                      {sub.reviewStatus === 'pending_bureau_review' ? (
                        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-3">
                          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-bold">
                              {currentLang === 'om'
                                ? 'Qormaanni keessan gamaaggama Biiroo Barnootaa irra jira!'
                                : currentLang === 'en'
                                ? 'Your exam is currently under Education Bureau review!'
                                : 'ፈተናዎ በትምህርት ቢሮ ግምገማ ላይ ይገኛል!'}
                            </p>
                            <p className="text-slate-600 leading-relaxed text-[11px]">
                              {currentLang === 'om'
                                ? 'Ogeeyyiin Biiroo Barnootaa gaaffii fi deebii erga mirkaneessanii booda yeroo "Qabxiin Barsiisaa Haa Gahu" jedhan qabxiin keessan fi waraqaan ragaa asitti gadhiifama.'
                                : currentLang === 'en'
                                ? 'Once Bureau specialists verify your answers and release the score, your detailed breakdown and official certificate will appear here.'
                                : 'የትምህርት ቢሮ ባለሙያዎች የፈተና ጥያቄዎችንና የመለሷቸውን መልሶች ካረጋገጡ በኋላ "ውጤት ለመምህሩ ይድረስ" ሲሉ ውጤትዎ፣ ትክክለኛ ማብራሪያዎች እና ይፋዊ ሰርተፊኬት እዚህ ገፅ ላይ ወዲያውኑ ይለቀቃል።'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                            <div className="flex items-center gap-4">
                              <div>
                                <span className="text-[10px] text-slate-400 block">
                                  {currentLang === 'om' ? 'Qabxii (Score)' : currentLang === 'en' ? 'Score' : 'ውጤት (Score)'}
                                </span>
                                <strong className={`text-2xl font-black font-mono ${sub.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                                  {sub.percentage}%
                                </strong>
                              </div>
                              <div className="border-l border-slate-200 pl-4">
                                <span className="text-[10px] text-slate-400 block">
                                  {currentLang === 'om' ? 'Haala' : currentLang === 'en' ? 'Status' : 'ሁኔታ'}
                                </span>
                                <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                                  sub.passed ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                                }`}>
                                  {sub.passed
                                    ? currentLang === 'om'
                                      ? '✓ Darbaniiru (Passed)'
                                      : currentLang === 'en'
                                      ? '✓ Passed'
                                      : '✓ አልፈዋል (Passed)'
                                    : currentLang === 'om'
                                    ? '✕ Hin Darbine (Failed)'
                                    : currentLang === 'en'
                                    ? '✕ Failed'
                                    : '✕ አላለፉም (Failed)'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setInspectResultDetails(sub)}
                                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>
                                  {currentLang === 'om'
                                    ? 'Bal’ina Gaaffii & Deebii'
                                    : currentLang === 'en'
                                    ? 'Q&A Breakdown'
                                    : 'የጥያቄና መልስ ዝርዝር'}
                                </span>
                              </button>

                              {sub.passed && (
                                <button
                                  type="button"
                                  onClick={() => setInspectResultDetails(sub)}
                                  className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <Award className="w-3.5 h-3.5" />
                                  <span>
                                    {currentLang === 'om'
                                      ? 'Waraqaa Ragaa Agarsiisi'
                                      : currentLang === 'en'
                                      ? 'Show Certificate'
                                      : 'ሰርተፊኬት አሳይ'}
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>

                          {sub.bureauNotes && (
                            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-950">
                              <span className="font-bold block mb-0.5">
                                {currentLang === 'om'
                                  ? 'Yaada Idilee Biiroo Barnootaa:'
                                  : currentLang === 'en'
                                  ? 'Official Bureau Feedback:'
                                  : 'የትምህርት ቢሮ ይፋዊ አስተያየት፡'}
                              </span>
                              <p className="text-[11px] leading-relaxed">{sub.bureauNotes}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create New Exam Modal (Strictly for Bureau Officers) */}
      {showCreateModal && isBureauOfficer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {currentLang === 'om'
                  ? 'Qormaata To’annoo Barsiisotaa Haaraa Qopheessi'
                  : currentLang === 'en'
                  ? 'Create New Teacher Online Exam'
                  : 'አዲስ የመምህራን ኦንላይን ፈተና አዘጋጅ'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewExam} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLang === 'om' ? 'Mata-duree Qormaataa *' : currentLang === 'en' ? 'Exam Title *' : 'የፈተናው ርዕስ *'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={
                    currentLang === 'om'
                      ? 'Fkn: Qormaata Gahumsa Mala Barsiisuu fi Qabiyyee Herregaa'
                      : currentLang === 'en'
                      ? 'e.g., Mathematics Pedagogy & Content Competency Exam'
                      : 'ምሳሌ፡ የሂሳብ መምህራን የስነ-ዘዴ እና የይዘት ብቃት ፈተና'
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Gosa Barnootaa' : currentLang === 'en' ? 'Subject' : 'የትምህርት አይነት'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Yeroo (Daqiiqaa)' : currentLang === 'en' ? 'Duration (Mins)' : 'ጊዜ (ደቂቃ)'}
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Qabxii Darbinsaa (%)' : currentLang === 'en' ? 'Passing Score (%)' : 'የማለፊያ ነጥብ (%)'}
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={newPassingScore}
                    onChange={(e) => setNewPassingScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Requirement #1 & #2: Time Per Question and Delivery Mode Selection */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Timer className="w-4 h-4 text-emerald-800" />
                  <span>
                    {currentLang === 'om'
                      ? '1. Gaaffiin tokko daqiiqaa meeqa tura? (Daangaa Yeroo Gaaffii)'
                      : currentLang === 'en'
                      ? '1. Time Limit Per Question'
                      : '1. አንድ ጥያቄ ስንት ደቂቃ ይቆይ? (የጥያቄ ሰዓት ገደብ)'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {currentLang === 'om'
                        ? 'Daqiiqaa gaaffii tokkoof ramadame'
                        : currentLang === 'en'
                        ? 'Minutes allocated per question'
                        : 'ለአንድ ጥያቄ የተመደበ ደቂቃ'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0.5}
                        max={30}
                        step={0.5}
                        value={newTimePerQuestion}
                        onChange={(e) => setNewTimePerQuestion(Number(e.target.value))}
                        className="w-24 px-3 py-1.5 text-xs font-bold text-emerald-900 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-600"
                      />
                      <span className="text-xs text-slate-600 font-medium">
                        {currentLang === 'om' ? 'Daqiiqaa / Gaaffii' : currentLang === 'en' ? 'Min / Question' : 'ደቂቃ / ጥያቄ'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-500 w-full">
                      {currentLang === 'om' ? 'Filannoo Ariifataa:' : currentLang === 'en' ? 'Quick Presets:' : 'ፈጣን ምርጫዎች፡'}
                    </span>
                    {[1, 2, 3, 5].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setNewTimePerQuestion(mins)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                          newTimePerQuestion === mins
                            ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {mins} {currentLang === 'om' ? 'Daq' : currentLang === 'en' ? 'Min' : 'ደቂቃ'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200/80 pt-3 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    {currentLang === 'om'
                      ? '2. Haala Dhiyeessa Qormaataa (Dhiyeessa Gaaffiiwwanii)'
                      : currentLang === 'en'
                      ? '2. Exam Delivery Mode'
                      : '2. የፈተናው አቀራረብ ዘዴ (የጥያቄዎች አሰጣጥ)'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setNewDeliveryMode('one_by_one')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                        newDeliveryMode === 'one_by_one'
                          ? 'border-emerald-700 bg-emerald-50/70 ring-1 ring-emerald-600 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <Lock className={`w-4 h-4 shrink-0 mt-0.5 ${newDeliveryMode === 'one_by_one' ? 'text-emerald-800' : 'text-slate-400'}`} />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {currentLang === 'om'
                            ? 'Gaaffii tokko yoo xumuru kan itti aanu haa gahu'
                            : currentLang === 'en'
                            ? 'One Question at a Time (Sequential)'
                            : 'አንድን ጥያቄ ሰርቶ ሲጨርስ ቀጣይ ጥያቄ ይድረሰው'}
                        </span>
                        <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                          {currentLang === 'om'
                            ? 'Barsiisaan gaaffii tokko erga deebisee ykn yeroon erga dhumee qofa gaaffiin itti aanu banama. Duubatti deebi’uun hin eeyyamamu.'
                            : currentLang === 'en'
                            ? 'Next question unlocks only after answering or timer expiry. No going back.'
                            : 'መምህሩ አንድን ጥያቄ መልሶ ሲጨርስ ወይም ሰዓቱ ሲያልቅ ብቻ ቀጣዩ ጥያቄ ይከፈታል። ወደ ኋላ መመለስ አይፈቀድም።'}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewDeliveryMode('all_at_once')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                        newDeliveryMode === 'all_at_once'
                          ? 'border-indigo-700 bg-indigo-50/70 ring-1 ring-indigo-600 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <Unlock className={`w-4 h-4 shrink-0 mt-0.5 ${newDeliveryMode === 'all_at_once' ? 'text-indigo-800' : 'text-slate-400'}`} />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {currentLang === 'om'
                            ? 'Gaaffiiwwan guutuun yeroo tokkotti haa gahan'
                            : currentLang === 'en'
                            ? 'All Questions at Once (Free Navigation)'
                            : 'የፈተናው ሙሉ ጥያቄዎች በአንድ ጊዜ ይድረሱት'}
                        </span>
                        <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                          {currentLang === 'om'
                            ? 'Gaaffiiwwan hunda arguu fi bilisaan fuulduraa fi duubatti naanna’anii deebisuun ni danda’ama.'
                            : currentLang === 'en'
                            ? 'View all questions and freely navigate back and forth.'
                            : 'ሁሉንም ጥያቄዎች ማየትና በነፃነት ወደ ፊትና ወደ ኋላ እየተዘዋወሩ መመለስ ይቻላል።'}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLang === 'om' ? 'Qajeelfama (Instructions)' : currentLang === 'en' ? 'Instructions' : 'መመሪያ (Instructions)'}
                </label>
                <textarea
                  rows={2}
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              {/* Questions list */}
              <div className="border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800">
                    {currentLang === 'om'
                      ? `Gaaffiiwwan Qormaataa (${newQuestions.length})`
                      : currentLang === 'en'
                      ? `Exam Questions (${newQuestions.length})`
                      : `የፈተና ጥያቄዎች (${newQuestions.length})`}
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuestionToDraft}
                    className="text-xs font-semibold text-emerald-800 hover:underline"
                  >
                    {currentLang === 'om' ? '+ Gaaffii Dabali' : currentLang === 'en' ? '+ Add Question' : '+ ጥያቄ ጨምር'}
                  </button>
                </div>

                <div className="space-y-3">
                  {newQuestions.map((q, qIdx) => (
                    <div key={q.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-700 block mb-1">
                          {currentLang === 'om' ? `Gaaffii ${qIdx + 1}:` : currentLang === 'en' ? `Question ${qIdx + 1}:` : `ጥያቄ ${qIdx + 1}፡`}
                        </span>
                        <input
                          type="text"
                          required
                          value={q.questionText}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewQuestions((prev) =>
                              prev.map((item, idx) =>
                                idx === qIdx ? { ...item, questionText: val } : item
                              )
                            );
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-1.5">
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={q.correctIndex === optIdx}
                              onChange={() => {
                                setNewQuestions((prev) =>
                                  prev.map((item, idx) =>
                                    idx === qIdx ? { ...item, correctIndex: optIdx } : item
                                  )
                                );
                              }}
                              className="text-emerald-700"
                              title={currentLang === 'om' ? 'Deebii sirrii filadhu' : currentLang === 'en' ? 'Select correct answer' : 'ትክክለኛውን መልስ ይምረጡ'}
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const val = e.target.value;
                                setNewQuestions((prev) =>
                                  prev.map((item, idx) =>
                                    idx === qIdx
                                      ? {
                                          ...item,
                                          options: item.options.map((o, oi) =>
                                            oi === optIdx ? val : o
                                          )
                                        }
                                      : item
                                  )
                                );
                              }}
                              className="w-full px-2 py-1 text-[11px] bg-white border border-slate-300 rounded-md"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {currentLang === 'om' ? 'Haqi' : currentLang === 'en' ? 'Cancel' : 'ሰርዝ'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs"
                >
                  {currentLang === 'om' ? 'Qormaata Mirkaneessi & Gadhiisi' : currentLang === 'en' ? 'Approve & Publish Exam' : 'ፈተናውን አጽድቅና ልቀቅ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Exam Generator Modal (Strictly for Bureau Officers) */}
      <AIExamGeneratorModal
        isOpen={showAIGeneratorModal && isBureauOfficer}
        onClose={() => setShowAIGeneratorModal(false)}
        initialMaterialId={aiGeneratorInitialMaterialId}
        currentLang={currentLang}
        onExamCreated={(newExam) => {
          onExamsChange([newExam, ...exams]);
        }}
        onTakeExamNow={(newExam) => {
          handleStartExam(newExam);
        }}
      />

      {/* 3. BUREAU REVIEW MODAL: Education Bureau Officer inspects Q&As and clicks "Release / Deliver to Teacher" */}
      {selectedSubmissionForReview && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-200">
                    <ShieldCheck className="w-5 h-5 text-indigo-800" />
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900">
                      {currentLang === 'om'
                        ? 'Odiitii Qabxii Idilee Biiroo Barnootaa'
                        : currentLang === 'en'
                        ? 'Official Education Bureau Score Audit'
                        : 'የትምህርት ቢሮ ይፋዊ የውጤት ኦዲት'}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {currentLang === 'om'
                        ? 'Gamaaggama Gaaffii fi Deebii Qormaata Barsiisaa'
                        : currentLang === 'en'
                        ? 'Teacher Exam Q&A Review'
                        : 'የመምህሩ የፈተና ጥያቄና መልስ ግምገማ'}
                    </h3>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSubmissionForReview(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Submitter & Performance Banner */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">
                  {currentLang === 'om' ? 'Barsiisaa Qorame' : currentLang === 'en' ? 'Examinee Teacher' : 'ተፈታኝ መምህር'}
                </span>
                <strong className="text-slate-900 text-sm block truncate">
                  {selectedSubmissionForReview.teacherName}
                </strong>
                <span className="text-[10px] text-slate-500 block truncate">
                  {selectedSubmissionForReview.schoolName}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">
                  {currentLang === 'om' ? 'Mata-duree Qormaataa' : currentLang === 'en' ? 'Exam Title' : 'የፈተና ርዕስ'}
                </span>
                <strong className="text-slate-900 block truncate">
                  {selectedSubmissionForReview.examTitle || selectedSubmissionForReview.subject}
                </strong>
                <span className="text-[10px] text-slate-500 block">
                  {new Date(selectedSubmissionForReview.submittedAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">
                  {currentLang === 'om' ? 'Qabxii Qormaataa' : currentLang === 'en' ? 'Exam Score' : 'የፈተና ውጤት'}
                </span>
                <strong className={`text-base font-black font-mono ${selectedSubmissionForReview.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {selectedSubmissionForReview.percentage}% ({selectedSubmissionForReview.score}/{selectedSubmissionForReview.totalMarks})
                </strong>
                <span className="text-[10px] font-bold text-slate-600 block">
                  {selectedSubmissionForReview.passed
                    ? currentLang === 'om' ? '✓ Darbaniiru' : currentLang === 'en' ? '✓ Passed' : '✓ አልፈዋል'
                    : currentLang === 'om' ? '✕ Hin Darbine' : currentLang === 'en' ? '✕ Failed' : '✕ አላለፉም'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">
                  {currentLang === 'om' ? 'Haala Qabxii' : currentLang === 'en' ? 'Result Status' : 'የውጤት ሁኔታ'}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-lg border mt-1 ${
                    selectedSubmissionForReview.reviewStatus === 'pending_bureau_review'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  }`}
                >
                  {selectedSubmissionForReview.reviewStatus === 'pending_bureau_review'
                    ? currentLang === 'om' ? '🟡 Gamaaggama Eeggata' : currentLang === 'en' ? '🟡 Pending Review' : '🟡 ግምገማ ይጠብቃል'
                    : currentLang === 'om' ? '🟢 Barsiisaaf Gadhiifameera' : currentLang === 'en' ? '🟢 Released to Teacher' : '🟢 ለመምህሩ ተለቋል'}
                </span>
              </div>
            </div>

            {/* Question by Question Inspection */}
            <div className="overflow-y-auto pr-1 space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <FileSearch className="w-4 h-4 text-emerald-800" />
                  <span>
                    {currentLang === 'om'
                      ? `Gaaffiiwwan fi Filannoo Barsiisaa (${selectedSubmissionForReview.answers?.length || 0})`
                      : currentLang === 'en'
                      ? `Questions & Teacher Selections (${selectedSubmissionForReview.answers?.length || 0})`
                      : `ጥያቄዎች እና የመምህሩ ምርጫዎች (${selectedSubmissionForReview.answers?.length || 0})`}
                  </span>
                </h4>
                <span className="text-[11px] text-slate-500">
                  {currentLang === 'om' ? 'Sirrii:' : currentLang === 'en' ? 'Correct:' : 'ትክክል፡'}{' '}
                  <strong className="text-emerald-700">{selectedSubmissionForReview.score}</strong> |{' '}
                  {currentLang === 'om' ? 'Dogoggora:' : currentLang === 'en' ? 'Incorrect:' : 'የተሳሳተ፡'}{' '}
                  <strong className="text-rose-700">{selectedSubmissionForReview.totalMarks - selectedSubmissionForReview.score}</strong>
                </span>
              </div>

              {selectedSubmissionForReview.answers && selectedSubmissionForReview.answers.length > 0 ? (
                selectedSubmissionForReview.answers.map((ans, idx) => (
                  <div
                    key={ans.questionId || idx}
                    className={`p-4 rounded-2xl border text-xs space-y-2.5 transition-all ${
                      ans.isCorrect
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                          {currentLang === 'om' ? `Gaaffii ${idx + 1}` : currentLang === 'en' ? `Question ${idx + 1}` : `ጥያቄ ${idx + 1}`}
                        </span>
                        <p className="font-bold text-slate-900 text-xs sm:text-sm mt-1">
                          {ans.questionText}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-black px-2 py-1 rounded-lg shrink-0 flex items-center gap-1 ${
                          ans.isCorrect
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}
                      >
                        {ans.isCorrect ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span>{currentLang === 'om' ? 'Sirrii' : currentLang === 'en' ? 'Correct' : 'ትክክል'}</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3 text-rose-700" />
                            <span>{currentLang === 'om' ? 'Dogoggora' : currentLang === 'en' ? 'Wrong' : 'ስህተት'}</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Answers comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className={`p-2.5 rounded-xl border ${
                        ans.isCorrect
                          ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950 font-semibold'
                          : 'bg-rose-100/60 border-rose-300 text-rose-950 font-semibold'
                      }`}>
                        <span className="text-[10px] text-slate-500 block">
                          {currentLang === 'om' ? 'Filannoo Barsiisaa:' : currentLang === 'en' ? 'Selected Answer:' : 'የመምህሩ ምርጫ (Selected Answer)፡'}
                        </span>
                        <span>{ans.selectedOptionText}</span>
                      </div>

                      <div className="p-2.5 rounded-xl border bg-emerald-100/80 border-emerald-300 text-emerald-950 font-semibold">
                        <span className="text-[10px] text-emerald-800 block">
                          {currentLang === 'om' ? 'Deebii Sirrii:' : currentLang === 'en' ? 'Correct Answer:' : 'ትክክለኛው መልስ (Correct Answer)፡'}
                        </span>
                        <span>{ans.correctOptionText}</span>
                      </div>
                    </div>

                    {ans.explanation && (
                      <div className="p-2.5 bg-white/80 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                        <span className="font-bold text-slate-800 block mb-0.5">
                          {currentLang === 'om' ? 'Ibsa Ogummaa (Explanation):' : currentLang === 'en' ? 'Pedagogical Explanation:' : 'ማብራሪያ (Pedagogical Explanation)፡'}
                        </span>
                        <p>{ans.explanation}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                  {currentLang === 'om'
                    ? 'Odeeffannoon bal’aan gaaffii fi deebii hin argamne.'
                    : currentLang === 'en'
                    ? 'Detailed Q&A data not found.'
                    : 'ዝርዝር የጥያቄና መልስ መረጃ አልተገኘም።'}
                </div>
              )}

              {/* Bureau Notes field */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  {currentLang === 'om'
                    ? 'Yaada fi Duub-deebii Idilee Biiroo Barnootaa'
                    : currentLang === 'en'
                    ? 'Official Bureau Notes / Feedback'
                    : 'የትምህርት ቢሮ ይፋዊ አስተያየት እና ግብረ-መልስ (Bureau Notes / Feedback)'}
                </label>
                <textarea
                  rows={2}
                  value={bureauOfficerFeedback}
                  onChange={(e) => setBureauOfficerFeedback(e.target.value)}
                  placeholder={
                    currentLang === 'om'
                      ? 'Fkn: Gaaffiiwwan gahumsaan deebisaniiru; dandeettiin mala barsiisuu agarsiisan jajjabeessaadha.'
                      : currentLang === 'en'
                      ? 'e.g., Answered questions competently; demonstrated encouraging pedagogical skills.'
                      : 'ለምሳሌ፡ ጥያቄዎችን በብቃት መልሰዋል፤ በትምህርት ስነ-ዘዴ ዘርፍ ያሳዩት ብቃት አበረታች ነው።'
                  }
                  className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-400 block">
                  {currentLang === 'om'
                    ? 'Yaadni kun yeroo qabxiin gadhiifamu akkuma walitti aanuun akaawuntii barsiisichaarratti mul’ata.'
                    : currentLang === 'en'
                    ? 'This feedback will be visible on the teacher’s portal once the result is released.'
                    : 'ይህ አስተያየት ውጤቱ ሲለቀቅ ለመምህሩ በግል አካውንታቸው አብሮ ይታያል።'}
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedSubmissionForReview(null)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                {currentLang === 'om' ? 'Cufi' : currentLang === 'en' ? 'Close' : 'ዝጋ'}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {selectedSubmissionForReview.reviewStatus === 'pending_bureau_review' ? (
                  <button
                    type="button"
                    onClick={() => handleBureauReleaseResult(selectedSubmissionForReview.id, bureauOfficerFeedback)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {currentLang === 'om'
                        ? '✓ Qabxiin Barsiisaa Haa Gahu / Mirkaneessi'
                        : currentLang === 'en'
                        ? '✓ Approve & Release to Teacher'
                        : '✓ ውጤቱ ለመምህሩ ይድረስ / አጽድቅ (Release to Teacher)'}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleBureauReleaseResult(selectedSubmissionForReview.id, bureauOfficerFeedback)}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCheck className="w-4 h-4 text-emerald-400" />
                    <span>{currentLang === 'om' ? 'Yaada Haaromsi' : currentLang === 'en' ? 'Update Feedback' : 'አስተያየቱን አድስ'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEACHER INSPECT DETAILS & CERTIFICATE MODAL */}
      {inspectResultDetails && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 my-8 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    {currentLang === 'om' ? 'Qabxii Qormaataa Idilee' : currentLang === 'en' ? 'Official Exam Result' : 'ይፋዊ የፈተና ውጤት'}
                  </span>
                  <h3 className="text-base font-black text-slate-900">
                    {inspectResultDetails.examTitle || (currentLang === 'om' ? 'Madaallii Gahumsa Barsiisotaa' : currentLang === 'en' ? 'Teacher Competency Exam' : 'የመምህራን ብቃት ምዘና')}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectResultDetails(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 space-y-4 flex-1">
              {/* Score card */}
              <div className="bg-gradient-to-br from-emerald-800 to-teal-900 p-5 rounded-2xl text-white space-y-2 text-center">
                <span className="text-xs font-semibold text-emerald-200 uppercase tracking-widest block">
                  {currentLang === 'om' ? 'Qabxii Qormaata Keessanii' : currentLang === 'en' ? 'Your Exam Score' : 'የፈተና ውጤትዎ'}
                </span>
                <div className="text-4xl font-black font-mono">
                  {inspectResultDetails.percentage}%
                </div>
                <p className="text-xs text-emerald-100">
                  {currentLang === 'om' ? 'Qoramaa:' : currentLang === 'en' ? 'Examinee:' : 'ተፈታኝ፡'}{' '}
                  <strong>{inspectResultDetails.teacherName}</strong> |{' '}
                  {currentLang === 'om' ? 'Mana Barumsaa:' : currentLang === 'en' ? 'School:' : 'ትምህርት ቤት፡'}{' '}
                  {inspectResultDetails.schoolName}
                </p>
                {inspectResultDetails.certificateNumber && (
                  <div className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-[11px] font-mono text-emerald-100">
                    {currentLang === 'om' ? 'Lakk. Waraqaa Ragaa Idilee:' : currentLang === 'en' ? 'Official Certificate No.:' : 'ይፋዊ የምስክር ወረቀት ቁጥር፡'}{' '}
                    {inspectResultDetails.certificateNumber}
                  </div>
                )}
              </div>

              {/* Bureau feedback if any */}
              {inspectResultDetails.bureauNotes && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-800" />
                    <span>
                      {currentLang === 'om' ? 'Yaada Idilee Biiroo Barnootaa:' : currentLang === 'en' ? 'Official Bureau Feedback:' : 'የትምህርት ቢሮ ይፋዊ አስተያየት፡'}
                    </span>
                  </span>
                  <p className="text-[11px] leading-relaxed text-slate-700">
                    {inspectResultDetails.bureauNotes}
                  </p>
                </div>
              )}

              {/* Answers breakdown */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-800">
                  {currentLang === 'om'
                    ? 'Xiinxala Bal’aa Gaaffii fi Deebii'
                    : currentLang === 'en'
                    ? 'Detailed Q&A Analysis'
                    : 'የጥያቄዎችና መልሶች ዝርዝር ትንተና'}
                </h4>

                {inspectResultDetails.answers && inspectResultDetails.answers.length > 0 ? (
                  inspectResultDetails.answers.map((ans, idx) => (
                    <div
                      key={ans.questionId || idx}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                        ans.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900">
                          {currentLang === 'om' ? `Gaaffii ${idx + 1}:` : currentLang === 'en' ? `Q${idx + 1}:` : `ጥያቄ ${idx + 1}፡`}{' '}
                          {ans.questionText}
                        </span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded ${
                            ans.isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                          }`}
                        >
                          {ans.isCorrect
                            ? currentLang === 'om' ? '✓ Sirrii' : currentLang === 'en' ? '✓ Correct' : '✓ ትክክል'
                            : currentLang === 'om' ? '✕ Dogoggora' : currentLang === 'en' ? '✕ Wrong' : '✕ ስህተት'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px]">
                            {currentLang === 'om' ? 'Kan isin filattan:' : currentLang === 'en' ? 'Your Choice:' : 'እርስዎ የመረጡት፡'}
                          </span>
                          <span className={ans.isCorrect ? 'text-emerald-900 font-semibold' : 'text-rose-900 font-semibold'}>
                            {ans.selectedOptionText}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">
                            {currentLang === 'om' ? 'Deebii Sirrii:' : currentLang === 'en' ? 'Correct Answer:' : 'ትክክለኛው መልስ፡'}
                          </span>
                          <span className="text-emerald-900 font-semibold">
                            {ans.correctOptionText}
                          </span>
                        </div>
                      </div>

                      {ans.explanation && (
                        <div className="p-2 bg-white/80 rounded-lg text-[10px] text-slate-600 border border-slate-200">
                          <strong>{currentLang === 'om' ? 'Ibsa:' : currentLang === 'en' ? 'Explanation:' : 'ማብራሪያ፡'}</strong>{' '}
                          {ans.explanation}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">
                    {currentLang === 'om' ? 'Odeeffannoon bal’aan hin argamne.' : currentLang === 'en' ? 'Detailed information not found.' : 'ዝርዝር መረጃ አልተገኘም።'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setInspectResultDetails(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                {currentLang === 'om' ? 'Cufi' : currentLang === 'en' ? 'Close' : 'ዝጋ'}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{currentLang === 'om' ? 'Qabxii Maxxansi (Print)' : currentLang === 'en' ? 'Print Result' : 'ውጤት አትም (Print)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
