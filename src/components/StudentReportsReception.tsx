import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Search,
  Award,
  Users,
  Check,
  Send,
  Building2,
  Plus,
  Printer,
  Filter,
  X,
  Eye,
  Lock
} from 'lucide-react';
import { Language, SchoolReportSubmission } from '../types';
import { translations } from '../data/translations';
import { StorageService } from '../utils/storage';

interface StudentReportsReceptionProps {
  currentLang: Language;
  reports: SchoolReportSubmission[];
  onReportsChange: (updated: SchoolReportSubmission[]) => void;
  currentOfficerName?: string;
  onOpenSubmitReport?: () => void;
}

export const StudentReportsReception: React.FC<StudentReportsReceptionProps> = ({
  currentLang,
  reports,
  onReportsChange,
  currentOfficerName = 'የትምህርት ቢሮ ፈተናና ምዘና ባለሙያ',
  onOpenSubmitReport
}) => {
  const t = translations[currentLang];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'submitted' | 'requires_revision'>('all');
  const [selectedReport, setSelectedReport] = useState<SchoolReportSubmission | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const filtered = reports.filter((r) => {
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      r.schoolName.toLowerCase().includes(q) ||
      r.gradeLevel.toLowerCase().includes(q) ||
      r.topStudentName.toLowerCase().includes(q);

    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleApprove = (id: string) => {
    const updated = StorageService.updateReportStatus(
      id,
      'approved',
      currentOfficerName,
      feedbackText ||
        (currentLang === 'om'
          ? 'Gabaasni Biiroo Barnootaa Bulchiinsa Magaalaa Shaashamanneetiin gamaaggamamee mirkanaa’eera.'
          : currentLang === 'en'
          ? 'Report reviewed and approved by Shashemene City Education Bureau.'
          : 'ሪፖርቱ በሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ ተገምግሞ ጸድቋል።')
    );
    onReportsChange(updated);
    setSelectedReport(null);
    setFeedbackText('');
  };

  const handleRequestRevision = (id: string) => {
    const updated = StorageService.updateReportStatus(
      id,
      'requires_revision',
      currentOfficerName,
      feedbackText ||
        (currentLang === 'om'
          ? 'Maaloo harka darbinsa barattootaa fi tarree barattoota dubaraa irra deebi’aa sakatta’aatii ergaa.'
          : currentLang === 'en'
          ? 'Please re-verify student pass rates and female student breakdown and resubmit.'
          : 'እባክዎ የተማሪዎችን የማለፍ ምጣኔ እና የሴት ተማሪዎች ዝርዝር እንደገና ፈትሸው ይላኩ።')
    );
    onReportsChange(updated);
    setSelectedReport(null);
    setFeedbackText('');
  };

  // Compute City Statistics from submitted reports
  const totalReportedStudents = reports.reduce((acc, r) => acc + r.totalStudents, 0);
  const cityAverageScore =
    reports.length > 0
      ? (reports.reduce((acc, r) => acc + r.averageScore, 0) / reports.length).toFixed(1)
      : '0';
  const cityAveragePassRate =
    reports.length > 0
      ? (reports.reduce((acc, r) => acc + r.promotedPercentage, 0) / reports.length).toFixed(1)
      : '0';

  return (
    <div className="space-y-6">
      {/* =========================================================================
          🌟 REPORTS TOP ACTION TOOLBAR: All actions unified at the top!
         ========================================================================= */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-100 text-teal-800">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {t.report_title} (Semester Reports Audit)
                </h2>
                <span className="text-xs text-teal-900 bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-300 font-bold">
                  {filtered.length} / {reports.length}{' '}
                  {currentLang === 'om' ? 'Gabaasota' : currentLang === 'en' ? 'Reports' : 'ሪፖርቶች'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{t.report_desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-900 border border-teal-300 rounded-xl text-xs font-bold">
              <Eye className="w-4 h-4 text-teal-700" />
              <span>
                {currentLang === 'om'
                  ? 'Manneen Barnootaarraa Kan Ergame (Dubbisuu Qofa - Read-Only)'
                  : currentLang === 'en'
                  ? 'Submitted by Schools (Read-Only)'
                  : 'ከትምህርት ቤቶች የተላኩ (ማየት ብቻ - Read-Only)'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title={currentLang === 'om' ? 'Gabaasa Qabxii Waliigalaa Maxxansi' : currentLang === 'en' ? 'Print Overall Score Report' : 'አጠቃላይ የውጤት ሪፖርት አትም'}
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>{currentLang === 'om' ? 'Gabaasa Maxxansi' : currentLang === 'en' ? 'Print Report' : 'ሪፖርት አትም'}</span>
            </button>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                currentLang === 'om'
                  ? 'Maqaa mana barumsaa, kutaa (Grade) ykn barataa qabxii olaanaa barbaadi...'
                  : currentLang === 'en'
                  ? 'Search school name, grade level, or top student...'
                  : 'የትምህርት ቤት ስም፣ ክፍል (Grade) ወይም ከፍተኛ ውጤት ተማሪ ፈልግ...'
              }
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-hidden font-medium"
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

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            {[
              { id: 'all' as const, label: currentLang === 'om' ? 'Gabaasota Hunda' : currentLang === 'en' ? 'All Reports' : 'ሁሉም ሪፖርቶች' },
              { id: 'submitted' as const, label: currentLang === 'om' ? 'Gamaaggama Irra' : currentLang === 'en' ? 'Under Review' : 'በግምገማ ላይ' },
              { id: 'approved' as const, label: currentLang === 'om' ? 'Mirkanaa’an' : currentLang === 'en' ? 'Approved' : 'የጸደቁ' },
              { id: 'requires_revision' as const, label: currentLang === 'om' ? 'Fooyya’insa Barbaadan' : currentLang === 'en' ? 'Needs Revision' : 'ማሻሻያ የሚሹ' }
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === st.id
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Aggregate City Marks Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200/80 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-emerald-800 block">
              {currentLang === 'om'
                ? 'Barattoota Gabaasichaan Hammataman'
                : currentLang === 'en'
                ? 'Students Included in Reports'
                : 'በሪፖርት የተካተቱ ተማሪዎች'}
            </span>
            <span className="text-2xl font-extrabold text-emerald-950">
              {totalReportedStudents.toLocaleString()}
            </span>
          </div>
          <Users className="w-8 h-8 text-emerald-600/70" />
        </div>

        <div className="bg-teal-50 border border-teal-200/80 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-teal-800 block">
              {currentLang === 'om'
                ? 'Harka Darbinsa Waliigalaa Magaalaa Shaashamannee'
                : currentLang === 'en'
                ? 'Shashemene City Overall Pass Rate'
                : 'የሻሸመኔ ከተማ አጠቃላይ የማለፍ ምጣኔ'}
            </span>
            <span className="text-2xl font-extrabold text-teal-950">
              {cityAveragePassRate}%
            </span>
          </div>
          <TrendingUp className="w-8 h-8 text-teal-600/70" />
        </div>

        <div className="bg-sky-50 border border-sky-200/80 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-sky-800 block">
              {currentLang === 'om'
                ? 'Qabxii Giddugaleessaa Manneen Barnootaa'
                : currentLang === 'en'
                ? 'Average School Score'
                : 'የትምህርት ቤቶች አማካይ ውጤት'}
            </span>
            <span className="text-2xl font-extrabold text-sky-950">
              {cityAverageScore} / 100
            </span>
          </div>
          <Award className="w-8 h-8 text-sky-600/70" />
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3.5">{t.report_school}</th>
                <th className="px-4 py-3.5">{t.report_term}</th>
                <th className="px-4 py-3.5">
                  {currentLang === 'om' ? 'Sadarkaa Kutaa' : currentLang === 'en' ? 'Grade Level' : 'የክፍል ደረጃ'}
                </th>
                <th className="px-4 py-3.5">{t.report_enrolled}</th>
                <th className="px-4 py-3.5">{t.report_pass_rate}</th>
                <th className="px-4 py-3.5">{t.report_average}</th>
                <th className="px-4 py-3.5">{t.report_top_student}</th>
                <th className="px-4 py-3.5">{t.report_status}</th>
                <th className="px-4 py-3.5 text-right">
                  {currentLang === 'om' ? 'Gocha' : currentLang === 'en' ? 'Action' : 'ተግባር'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((rep) => {
                const isApproved = rep.status === 'approved';
                const isRevision = rep.status === 'requires_revision';

                return (
                  <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {rep.schoolName}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {rep.academicYear} · {rep.semester}
                    </td>
                    <td className="px-4 py-3.5 font-medium">{rep.gradeLevel}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      {rep.totalStudents.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-emerald-800">
                        {rep.promotedPercentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold">{rep.averageScore}</td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-900 block">{rep.topStudentName}</span>
                      <span className="text-[10px] text-amber-700 font-bold">({rep.topStudentScore}%)</span>
                    </td>
                    <td className="px-4 py-3.5">
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{currentLang === 'om' ? 'Kan Mirkanaa’e' : currentLang === 'en' ? 'Approved' : 'የጸደቀ'}</span>
                        </span>
                      )}
                      {isRevision && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          <span>{currentLang === 'om' ? 'Fooyya’insa Barbaada' : currentLang === 'en' ? 'Needs Revision' : 'ማሻሻያ የሚሻ'}</span>
                        </span>
                      )}
                      {rep.status === 'submitted' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                          <span>{currentLang === 'om' ? 'Eeggannoo Irra' : currentLang === 'en' ? 'Pending Review' : 'በመጠባበቅ ላይ'}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedReport(rep);
                          setFeedbackText(rep.feedback || '');
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                      >
                        {currentLang === 'om' ? 'Gamaaggami' : currentLang === 'en' ? 'Review' : 'ገምግም'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {currentLang === 'om'
                    ? 'Mirkaneessa Gabaasa Qabxii Mana Barumsaa (Report Evaluation)'
                    : currentLang === 'en'
                    ? 'School Score Report Evaluation'
                    : 'የትምህርት ቤት ውጤት ሪፖርት ማረጋገጫ (Report Evaluation)'}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedReport.schoolName} · {selectedReport.academicYear}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 block">
                  {currentLang === 'om' ? 'Qoramtoota Waliigalaa:' : currentLang === 'en' ? 'Total Examinees:' : 'አጠቃላይ ተፈታኞች:'}
                </span>
                <span className="font-bold text-slate-900">{selectedReport.totalStudents}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">
                  {currentLang === 'om' ? 'Barattoota Darban (Dhi/Dub):' : currentLang === 'en' ? 'Passed Students (M/F):' : 'ያለፉ ተማሪዎች (ወ/ሴ):'}
                </span>
                <span className="font-bold text-slate-900">
                  {currentLang === 'om' ? 'Dhiira:' : currentLang === 'en' ? 'Male:' : 'ወንድ:'} {selectedReport.malePassed} ·{' '}
                  {currentLang === 'om' ? 'Dubara:' : currentLang === 'en' ? 'Female:' : 'ሴት:'} {selectedReport.femalePassed}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">
                  {currentLang === 'om' ? 'Harka Darbinsaa (Pass Rate):' : currentLang === 'en' ? 'Pass Rate:' : 'የማለፍ ምጣኔ (Pass Rate):'}
                </span>
                <span className="font-extrabold text-emerald-800 text-sm">
                  {selectedReport.promotedPercentage}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">
                  {currentLang === 'om' ? 'Qabxii Giddugaleessaa:' : currentLang === 'en' ? 'Average Score:' : 'አማካይ ውጤት:'}
                </span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {selectedReport.averageScore} / 100
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-semibold">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                {currentLang === 'om'
                  ? 'Daataan qabxii mana barnootaa dubbisuu qofaaf; biiroon gabaasa gamaaggamuu fi mirkaneessa/sirreeffama erguu qofa danda’a.'
                  : currentLang === 'en'
                  ? 'School score data is read-only; the Bureau may only evaluate and approve or request revision.'
                  : 'የትምህርት ቤቱ የውጤት ዳታ ማየት ብቻ ነው፤ ቢሮው ሪፖርቱን መገምገምና ይሁንታ/ማሻሻያ መላክ ብቻ ይችላል።'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {currentLang === 'om'
                  ? 'Duub-deebii Biiroo Barnootaa (Bureau Feedback to School)'
                  : currentLang === 'en'
                  ? 'Bureau Feedback to School'
                  : 'የትምህርት ቢሮ ግብረ-መልስ (Bureau Feedback to School)'}
              </label>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={
                  currentLang === 'om'
                    ? 'Yaada ykn sirreeffama mana barnootaaf kennamu yoo jiraate barreessi...'
                    : currentLang === 'en'
                    ? 'Write any feedback or corrections for the school...'
                    : 'ለትምህርት ቤቱ የሚሰጥ አስተያየት ወይም ማስተካከያ ካለ ይጻፉ...'
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleRequestRevision(selectedReport.id)}
                className="px-3.5 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
              >
                {t.btn_request_revision}
              </button>
              <button
                type="button"
                onClick={() => handleApprove(selectedReport.id)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs"
              >
                ✓ {t.btn_approve_report}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
