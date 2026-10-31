import React, { useState, useMemo } from 'react';
import {
  Star,
  Award,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Building2,
  BookOpen,
  GraduationCap,
  Users,
  ShieldCheck,
  FileText,
  Printer,
  ChevronRight,
  TrendingUp,
  Heart,
  User,
  Sparkles,
  Edit,
  Save,
  Clock,
  Send,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  X
} from 'lucide-react';
import {
  Language,
  School,
  TeacherEvaluationRecord,
  TeacherEvaluationSummary,
  TeacherCredential,
  AppUserSession
} from '../types';
import { translations } from '../data/translations';
import { StorageService } from '../utils/storage';
import { OfflineSyncManager } from '../utils/offlineSync';
import { TeacherEvaluationModal } from './TeacherEvaluationModal';

interface BureauTeacherAppraisalViewProps {
  currentLang: Language;
  currentUser: AppUserSession | null;
  schools: School[];
  initialSchoolFilter?: string;
  isEmbeddedInSchool?: boolean;
}

export const BureauTeacherAppraisalView: React.FC<BureauTeacherAppraisalViewProps> = ({
  currentLang,
  currentUser,
  schools,
  initialSchoolFilter,
  isEmbeddedInSchool = false
}) => {
  const t = translations[currentLang];

  // Evaluations state from StorageService
  const [evaluations, setEvaluations] = useState<TeacherEvaluationRecord[]>(() =>
    StorageService.getTeacherEvaluations()
  );

  const [activeTab, setActiveTab] = useState<'summaries' | 'individual_logs'>('summaries');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>(initialSchoolFilter || 'all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('all');

  // Selected teacher for Bureau Action / Appraisal Decision
  const [selectedTeacherForDecision, setSelectedTeacherForDecision] = useState<TeacherEvaluationSummary | null>(null);
  const [decisionActionType, setDecisionActionType] = useState<'promotion' | 'renewal' | 'training' | 'award'>('promotion');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [decisionSavedMessage, setDecisionSavedMessage] = useState(false);

  // Modal to add a new evaluation directly from this view if needed
  const [showAddEvalModal, setShowAddEvalModal] = useState(false);

  // Reload summaries
  const teacherSummaries = useMemo(() => {
    return StorageService.getAllTeacherSummaries(
      selectedSchoolFilter !== 'all' ? selectedSchoolFilter : undefined
    );
  }, [evaluations, selectedSchoolFilter]);

  // Overall Bureau KPIs
  const kpis = useMemo(() => {
    const totalEvals = evaluations.length;
    if (totalEvals === 0) {
      return {
        totalEvaluations: 0,
        avgComp: 0,
        avgPed: 0,
        avgMot: 0,
        avgSup: 0,
        avgMgmt: 0,
        avgAssess: 0,
        cityAveragePercent: 0,
        outstandingCount: 0,
        needsImprovementCount: 0
      };
    }

    let c = 0, p = 0, m = 0, s = 0, mg = 0, as = 0;
    evaluations.forEach((e) => {
      c += e.scores.teaching_competence;
      p += e.scores.pedagogical_delivery;
      m += e.scores.teaching_motivation;
      s += e.scores.student_support;
      mg += e.scores.classroom_management;
      as += e.scores.timely_assessment;
    });

    const avgComp = Number((c / totalEvals).toFixed(1));
    const avgPed = Number((p / totalEvals).toFixed(1));
    const avgMot = Number((m / totalEvals).toFixed(1));
    const avgSup = Number((s / totalEvals).toFixed(1));
    const avgMgmt = Number((mg / totalEvals).toFixed(1));
    const avgAssess = Number((as / totalEvals).toFixed(1));

    const totalPossiblePoints = totalEvals * 60;
    const totalEarnedPoints = evaluations.reduce((sum, e) => sum + e.totalScore, 0);
    const cityAveragePercent = Number(((totalEarnedPoints / totalPossiblePoints) * 100).toFixed(1));

    const outstandingCount = teacherSummaries.filter((t) => t.ratingTier === 'outstanding').length;
    const needsImprovementCount = teacherSummaries.filter((t) => t.ratingTier === 'needs_improvement').length;

    return {
      totalEvaluations: totalEvals,
      avgComp,
      avgPed,
      avgMot,
      avgSup,
      avgMgmt,
      avgAssess,
      cityAveragePercent,
      outstandingCount,
      needsImprovementCount
    };
  }, [evaluations, teacherSummaries]);

  // Filtered summaries
  const filteredSummaries = useMemo(() => {
    return teacherSummaries.filter((item) => {
      const matchSearch =
        searchTerm.trim() === '' ||
        item.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.schoolName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSubject =
        selectedSubjectFilter === 'all' || item.subject.includes(selectedSubjectFilter);

      const matchTier =
        selectedTierFilter === 'all' || item.ratingTier === selectedTierFilter;

      return matchSearch && matchSubject && matchTier;
    });
  }, [teacherSummaries, searchTerm, selectedSubjectFilter, selectedTierFilter]);

  // Filtered individual logs
  const filteredLogs = useMemo(() => {
    return evaluations.filter((item) => {
      const matchSearch =
        searchTerm.trim() === '' ||
        item.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.strengthsFeedback && item.strengthsFeedback.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.evaluatorName && item.evaluatorName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchSchool =
        selectedSchoolFilter === 'all' || item.schoolId === selectedSchoolFilter;

      const matchSubject =
        selectedSubjectFilter === 'all' || item.subject.includes(selectedSubjectFilter);

      return matchSearch && matchSchool && matchSubject;
    });
  }, [evaluations, searchTerm, selectedSchoolFilter, selectedSubjectFilter]);

  const handleRecordAppraisalDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherForDecision) return;

    // Find all evaluations for this teacher and annotate them
    const teacherEvals = evaluations.filter((ev) => ev.teacherId === selectedTeacherForDecision.teacherId);
    let actionLabel = 'ለደረጃ እድገት ግብዓት ተመዝግቧል';
    if (decisionActionType === 'renewal') actionLabel = 'ለማስተማር ፈቃድ እድሳት ግብዓት ተመዝግቧል';
    if (decisionActionType === 'training') actionLabel = 'ለአቅም ግንባታ ስልጠና ተመርጧል';
    if (decisionActionType === 'award') actionLabel = 'ለትምህርት ቢሮ ልዩ የላቀ ውጤት የምስክር ወረቀት ተመዝግቧል';

    const fullNote = `[${new Date().toISOString().split('T')[0]}] ${currentUser?.name || 'የትምህርት ቢሮ ኃላፊ'}: ${actionLabel} - ${decisionNotes}`;

    teacherEvals.forEach((ev) => {
      StorageService.updateTeacherEvaluationAppraisal(ev.id, fullNote, true);
    });

    setEvaluations(StorageService.getTeacherEvaluations());
    setDecisionSavedMessage(true);
    setTimeout(() => {
      setDecisionSavedMessage(false);
      setSelectedTeacherForDecision(null);
      setDecisionNotes('');
    }, 1800);
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'outstanding':
        return { label: 'የላቀ (Outstanding)', cls: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold' };
      case 'very_good':
        return { label: 'በጣም ጥሩ (Very Good)', cls: 'bg-teal-100 text-teal-900 border-teal-300 font-bold' };
      case 'satisfactory':
        return { label: 'አጥጋቢ (Satisfactory)', cls: 'bg-amber-100 text-amber-950 border-amber-300 font-bold' };
      default:
        return { label: 'ማሻሻያ የሚሻ (Needs CPD)', cls: 'bg-rose-100 text-rose-950 border-rose-300 font-bold' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shrink-0">
              <Star className="w-6 h-6 fill-slate-950 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                  የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ ይፋዊ ማዕከል
                </span>
                <span className="text-[10px] font-semibold text-emerald-300">
                  · የተማሪ እና ወላጅ ግብረ-መልስ ትንተና
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                የመምህራን የማስተማር ብቃትና ምዘና መመዘኛ ግብዓት (Teacher Appraisal Desk)
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                ከተማሪዎችና ከወላጆች የተሰበሰቡትን 6 ዋና ዋና የማስተማር መስፈርቶች (እያንዳንዳቸው ከ 10 ነጥብ) በመተንተን ለመምህራን የደረጃ እድገት፣
                ለማስተማር ፈቃድ እድሳት እና ለአቅም ግንባታ ስልጠናዎች በግብዓትነት ማዋል
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAddEvalModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md hover:scale-102 cursor-pointer"
            >
              <Star className="w-4 h-4 fill-slate-950" />
              <span>አዲስ ግምገማ መዝግብ (Rate Teacher)</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors border border-white/20 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>ሪፖርት አትም (Print Roster)</span>
            </button>
          </div>
        </div>
      </div>

      {/* City-Wide KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1: Total Evaluations */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-semibold block">ጠቅላላ ግምገማዎች</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">
            {kpis.totalEvaluations}
          </span>
          <span className="text-[10px] text-emerald-700 font-bold block mt-1">
            ከተማሪዎች & ወላጆች
          </span>
        </div>

        {/* KPI 2: Teaching Competence (Mastery) */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-semibold block">1. የማስተማር ብቃት</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-emerald-800">{kpis.avgComp}</span>
            <span className="text-xs text-slate-400 font-bold">/10</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">የይዘትና እውቀት ጥልቀት</span>
        </div>

        {/* KPI 3: Pedagogical Delivery */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-semibold block">2. የትምህርት አሰጣጥ</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-teal-800">{kpis.avgPed}</span>
            <span className="text-xs text-slate-400 font-bold">/10</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">ግልጽነትና ስነ-ዘዴ</span>
        </div>

        {/* KPI 4: Motivation */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-semibold block">3. ተነሳሽነት & ፍቅር</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-amber-700">{kpis.avgMot}</span>
            <span className="text-xs text-slate-400 font-bold">/10</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">ለሙያው ቁርጠኝነት</span>
        </div>

        {/* KPI 5: Student Support */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-semibold block">4. የተማሪ ድጋፍ</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-blue-800">{kpis.avgSup}</span>
            <span className="text-xs text-slate-400 font-bold">/10</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">ትዕግስት & እኩልነት</span>
        </div>

        {/* KPI 6: City Average Satisfaction */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-3.5 rounded-2xl shadow-xs">
          <span className="text-[10px] text-emerald-200 font-semibold block">የከተማው አማካይ</span>
          <span className="text-2xl font-black text-amber-300 mt-0.5 block">
            {kpis.cityAveragePercent}%
          </span>
          <span className="text-[10px] text-white/90 font-medium block mt-1">
            {kpis.outstandingCount} የላቁ መምህራን
          </span>
        </div>
      </div>

      {/* Tabs & Search Filter Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-3">
          {/* Sub-Tabs: Aggregated Summaries vs Individual Logs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('summaries')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'summaries'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              የመምህራን የውጤት ካርድና ደረጃ ({filteredSummaries.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('individual_logs')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'individual_logs'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              የተማሪና ወላጅ ዝርዝር አስተያየቶች ({filteredLogs.length})
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            ሻሸመኔ ከተማ አስተዳደር · ይፋዊ የትምህርት ጥራት መከታተያ
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="የመምህር ስም ወይም ትምህርት አይነት..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white"
            />
          </div>

          {/* School Filter */}
          {!isEmbeddedInSchool && (
            <div>
              <select
                value={selectedSchoolFilter}
                onChange={(e) => setSelectedSchoolFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-xl bg-white"
              >
                <option value="all">ሁሉም ትምህርት ቤቶች (All Schools)</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-xl bg-white"
            >
              <option value="all">ሁሉም የትምህርት አይነቶች (All Subjects)</option>
              <option value="Math">Mathematics (ሂሳብ)</option>
              <option value="Oromo">Afaan Oromoo (ኦሮሚኛ)</option>
              <option value="Physics">Physics (ፊዚክስ)</option>
              <option value="Chemistry">Chemistry (ኬሚስትሪ)</option>
              <option value="Biology">Biology (ባዮሎጂ)</option>
              <option value="English">English (እንግሊዝኛ)</option>
            </select>
          </div>

          {/* Rating Tier Filter */}
          <div>
            <select
              value={selectedTierFilter}
              onChange={(e) => setSelectedTierFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-xl bg-white"
            >
              <option value="all">ሁሉም ደረጃዎች (All Tiers)</option>
              <option value="outstanding">የላቀ ውጤት (Outstanding - 90%+)</option>
              <option value="very_good">በጣም ጥሩ (Very Good - 75-89%)</option>
              <option value="satisfactory">አጥጋቢ (Satisfactory - 60-74%)</option>
              <option value="needs_improvement">ማሻሻያ የሚሻ (Needs CPD - &lt;60%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: TEACHER AGGREGATE SCORECARDS & APPRAISAL DECISION MAKER
         ========================================================================= */}
      {activeTab === 'summaries' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSummaries.length === 0 ? (
            <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-500 space-y-2">
              <Star className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700">ምንም የመምህር ምዘና መረጃ አልተገኘም</p>
              <p className="text-xs text-slate-400">
                የፍለጋ ቃላትን ይቀይሩ ወይም በተማሪ/ወላጅ ፖርታል በኩል አዲስ ግምገማ እንዲሰጥ ያድርጉ።
              </p>
            </div>
          ) : (
            filteredSummaries.map((summary) => {
              const tierBadge = getTierBadge(summary.ratingTier);
              return (
                <div
                  key={summary.teacherId}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 transition-all space-y-4 relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Teacher Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 leading-tight">
                            {summary.teacherName}
                          </h3>
                        </div>
                        <p className="text-xs text-emerald-800 font-bold mt-0.5">
                          {summary.subject} · {summary.schoolName}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {summary.totalEvaluations} ግምገማዎች ({summary.studentEvaluationsCount} ተማሪ፣ {summary.parentEvaluationsCount} ወላጅ)
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`px-2.5 py-1 rounded-full text-xs border ${tierBadge.cls}`}>
                          {tierBadge.label}
                        </span>
                        <div className="mt-1.5 flex items-baseline justify-end gap-1">
                          <span className="text-2xl font-black text-slate-900">
                            {summary.overallPercentage}%
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">
                            ({summary.overallAverageScore}/60)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* The 6 Criteria Progress Bars */}
                    <div className="space-y-2 pt-1 text-xs">
                      {/* 1. Teaching Competence */}
                      <div>
                        <div className="flex justify-between text-[11px] font-bold py-0.5 text-slate-700">
                          <span>1. የማስተማር ብቃቱ (Subject Mastery)</span>
                          <span className="text-emerald-800">{summary.averageScores.teaching_competence} / 10</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all"
                            style={{ width: `${(summary.averageScores.teaching_competence / 10) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* 2. Pedagogical Delivery */}
                      <div>
                        <div className="flex justify-between text-[11px] font-bold py-0.5 text-slate-700">
                          <span>2. የትምህርት አሰጣጡ (Clarity & Methodology)</span>
                          <span className="text-teal-800">{summary.averageScores.pedagogical_delivery} / 10</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-600 rounded-full transition-all"
                            style={{ width: `${(summary.averageScores.pedagogical_delivery / 10) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* 3. Teaching Motivation */}
                      <div>
                        <div className="flex justify-between text-[11px] font-bold py-0.5 text-slate-700">
                          <span>3. ለማስተማር ያለው ተነሳሽነት (Motivation)</span>
                          <span className="text-amber-800">{summary.averageScores.teaching_motivation} / 10</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all"
                            style={{ width: `${(summary.averageScores.teaching_motivation / 10) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* 4. Student Support */}
                      <div>
                        <div className="flex justify-between text-[11px] font-bold py-0.5 text-slate-700">
                          <span>4. የተማሪ ጥያቄን ማዳመጥ & መደገፍ</span>
                          <span className="text-blue-800">{summary.averageScores.student_support} / 10</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all"
                            style={{ width: `${(summary.averageScores.student_support / 10) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* 5. Classroom Discipline */}
                      <div>
                        <div className="flex justify-between text-[11px] font-bold py-0.5 text-slate-700">
                          <span>5. የክፍል ስነ-ስርዓትና የጊዜ አጠቃቀም</span>
                          <span className="text-indigo-800">{summary.averageScores.classroom_management} / 10</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all"
                            style={{ width: `${(summary.averageScores.classroom_management / 10) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* 6. Assessment & Feedback */}
                      <div>
                        <div className="flex justify-between text-[11px] font-bold py-0.5 text-slate-700">
                          <span>6. የቤት ስራና ፈተናን በወቅቱ ማረም</span>
                          <span className="text-purple-800">{summary.averageScores.timely_assessment} / 10</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600 rounded-full transition-all"
                            style={{ width: `${(summary.averageScores.timely_assessment / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Qualitative Insights Snapshot */}
                    {summary.strengthsSummary.length > 0 && (
                      <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-[11px] space-y-1">
                        <span className="font-bold text-emerald-950 flex items-center gap-1">
                          <ThumbsUp className="w-3.5 h-3.5 text-emerald-700" />
                          <span>የተማሪና ወላጅ ምስክርነት (Key Strengths):</span>
                        </span>
                        <p className="text-emerald-900 italic">
                          "{summary.strengthsSummary[0]}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Bureau Official Action Trigger */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 font-semibold">
                      የቢሮ መመዘኛ ግብዓት
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTeacherForDecision(summary);
                        setDecisionNotes('');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                      <span>የቢሮ ውሳኔ መዝግብ (Appraisal Action)</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: INDIVIDUAL DETAILED EVALUATIONS LOG
         ========================================================================= */}
      {activeTab === 'individual_logs' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              የተሰበሰቡ ግምገማዎች ዝርዝር መዝገብ (Direct Feedbacks Log)
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              ድምር: {filteredLogs.length} ምዘናዎች
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">ቀን</th>
                  <th className="py-3 px-3">የመምህር ስም & ትምህርት</th>
                  <th className="py-3 px-3">ትምህርት ቤት</th>
                  <th className="py-3 px-3">ገምጋሚ</th>
                  <th className="py-3 px-3 text-center">ውጤት (ከ 60)</th>
                  <th className="py-3 px-3">የተማሪ/ወላጅ ዋና አስተያየት</th>
                  <th className="py-3 px-3">የቢሮ ማስታወሻ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {log.submittedAt.split('T')[0]}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{log.teacherName}</span>
                      <span className="text-[11px] text-emerald-800 font-semibold">{log.subject}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{log.schoolName}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                        {log.evaluatorRole === 'student' ? '🎓 ተማሪ' : '👨‍👩‍👧 ወላጅ'}
                        {log.isAnonymous ? ' (ምስጢራዊ)' : ` - ${log.evaluatorName || log.evaluatorParentName}`}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {log.totalScore} / 60 ({log.percentage}%)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 max-w-xs">
                      {log.strengthsFeedback && (
                        <p className="line-clamp-2 italic text-emerald-950 font-medium">
                          "{log.strengthsFeedback}"
                        </p>
                      )}
                      {log.improvementAreas && (
                        <p className="line-clamp-1 text-slate-500 text-[11px] mt-0.5">
                          መሻሻል ያለበት፡ {log.improvementAreas}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs text-[11px]">
                      {log.bureauDecisionNotes ? (
                        <span className="text-emerald-800 font-semibold line-clamp-2">
                          {log.bureauDecisionNotes}
                        </span>
                      ) : (
                        <span className="text-slate-400">በሂደት ላይ</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          BUREAU OFFICIAL DECISION MODAL: APPRAISAL ACTION
         ========================================================================= */}
      {selectedTeacherForDecision && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">
                  የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ ይፋዊ የመምህራን ውሳኔ
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  የመምህር መመዘኛ ውሳኔ መዝግብ (Record Appraisal Decision)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  መምህር፡ <strong>{selectedTeacherForDecision.teacherName}</strong> ({selectedTeacherForDecision.subject})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTeacherForDecision(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {decisionSavedMessage ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-950">
                  ውሳኔው በስኬት ተመዝግቧል!
                </h4>
                <p className="text-xs text-emerald-800">
                  የመምህሩ የግምገማ ውጤት ወደ ትምህርት ቢሮ ማዕከላዊ የሰው ኃይል እና ፈቃድ አሰጣጥ ሰነድ ተካቷል።
                </p>
              </div>
            ) : (
              <form onSubmit={handleRecordAppraisalDecision} className="space-y-4">
                {/* Teacher Score Summary Pills */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block">የተማሪ/ወላጅ አማካይ ውጤት፡</span>
                    <span className="text-base font-black text-slate-900">
                      {selectedTeacherForDecision.overallAverageScore}/60 ({selectedTeacherForDecision.overallPercentage}%)
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs border ${getTierBadge(selectedTeacherForDecision.ratingTier).cls}`}>
                    {getTierBadge(selectedTeacherForDecision.ratingTier).label}
                  </span>
                </div>

                {/* Decision Action Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    የውሳኔ አይነት ምረጥ (Select Bureau Action Category):
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setDecisionActionType('promotion')}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        decisionActionType === 'promotion'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      ⭐ ለደረጃ እድገት ግብዓት (Promotion)
                    </button>

                    <button
                      type="button"
                      onClick={() => setDecisionActionType('renewal')}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        decisionActionType === 'renewal'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      📜 ለማስተማር ፈቃድ እድሳት (License Renewal)
                    </button>

                    <button
                      type="button"
                      onClick={() => setDecisionActionType('award')}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        decisionActionType === 'award'
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      🏆 የላቀ ውጤት የምስጋና ወረቀት (Award)
                    </button>

                    <button
                      type="button"
                      onClick={() => setDecisionActionType('training')}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        decisionActionType === 'training'
                          ? 'bg-teal-800 text-white border-teal-800 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      📚 ለአቅም ግንባታ ስልጠና (Target CPD)
                    </button>
                  </div>
                </div>

                {/* Decision Official Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    የትምህርት ቢሮ ይፋዊ ማስታወሻ እና መመሪያ (Official Bureau Appraisal Notes):
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={decisionNotes}
                    onChange={(e) => setDecisionNotes(e.target.value)}
                    placeholder="ምሳሌ፡ የተማሪዎችን እና የወላጆችን ግምገማ (95%) መሰረት በማድረግ ለመጪው የደረጃ እድገት በእጩነት እንዲያዝ ተወስኗል..."
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTeacherForDecision(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    ሰርዝ
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>ውሳኔውን በይፋ መዝግብ</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Rate Teacher Modal */}
      <TeacherEvaluationModal
        isOpen={showAddEvalModal}
        onClose={() => {
          setShowAddEvalModal(false);
          setEvaluations(StorageService.getTeacherEvaluations());
        }}
        currentLang={currentLang}
        school={schools[0]}
        onEvaluationSubmitted={() => {
          setEvaluations(StorageService.getTeacherEvaluations());
        }}
      />
    </div>
  );
};
