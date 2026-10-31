import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  GraduationCap,
  Award,
  Filter,
  Plus,
  Star
} from 'lucide-react';
import { Language, TeacherCredential } from '../types';
import { translations } from '../data/translations';
import { StorageService } from '../utils/storage';
import { BureauTeacherAppraisalView } from './BureauTeacherAppraisalView';

interface TeacherCredentialsAuditProps {
  currentLang: Language;
  credentials: TeacherCredential[];
  onCredentialsChange: (updated: TeacherCredential[]) => void;
  currentOfficerName?: string;
}

export const TeacherCredentialsAudit: React.FC<TeacherCredentialsAuditProps> = ({
  currentLang,
  credentials,
  onCredentialsChange,
  currentOfficerName = 'የቢሮ ኢንስፔክተር'
}) => {
  const t = translations[currentLang];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'flagged'>('all');
  const [selectedCred, setSelectedCred] = useState<TeacherCredential | null>(null);
  const [auditNotes, setAuditNotes] = useState('');
  const [activeBureauDeskTab, setActiveBureauDeskTab] = useState<'credentials' | 'appraisal'>('credentials');

  // New credential registration state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newSchoolName, setNewSchoolName] = useState('ሻሸመኔ አጠቃላይ 2ኛ ደረጃ ትምህርት ቤት');
  const [newSubject, setNewSubject] = useState('');
  const [newQualification, setNewQualification] = useState<'Diploma' | 'Degree' | 'Masters' | 'PhD'>('Degree');
  const [newInstitution, setNewInstitution] = useState('');
  const [newGraduationYear, setNewGraduationYear] = useState(2020);
  const [newLicenseNumber, setNewLicenseNumber] = useState('');
  const [newExperience, setNewExperience] = useState(5);

  const filtered = credentials.filter((c) => {
    const matchesSearch =
      c.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: 'verified' | 'pending' | 'flagged') => {
    const updated = StorageService.updateCredentialStatus(
      id,
      newStatus,
      currentOfficerName,
      auditNotes || undefined
    );
    onCredentialsChange(updated);
    setSelectedCred(null);
    setAuditNotes('');
  };

  const handleCreateCredential = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedLicense =
      newLicenseNumber || `ETH-OR-SH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newEntry: TeacherCredential = {
      id: `tc-${Date.now()}`,
      teacherName: newTeacherName,
      gender: 'M',
      schoolId: 'sch-1',
      schoolName: newSchoolName,
      subject: newSubject,
      qualification: newQualification,
      institution: newInstitution,
      graduationYear: Number(newGraduationYear),
      licenseNumber: generatedLicense,
      experienceYears: Number(newExperience),
      verificationStatus: 'verified',
      verifiedBy: currentOfficerName,
      verificationDate: new Date().toISOString().split('T')[0],
      notes: 'በትምህርት ቢሮ በቀጥታ ተረጋግጦ የተመዘገበ።'
    };

    const updated = StorageService.addCredential(newEntry);
    onCredentialsChange(updated);
    setShowAddModal(false);

    // Reset
    setNewTeacherName('');
    setNewSubject('');
    setNewInstitution('');
    setNewLicenseNumber('');
  };

  return (
    <div className="space-y-6">
      {/* Bureau Desk Mode Switcher: Credentials Audit vs Teacher Appraisal */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveBureauDeskTab('credentials')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeBureauDeskTab === 'credentials'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4 text-sky-300" />
          <span>የመምህራን ማስረጃና ፈቃድ ቁጥጥር (Credentials & Licenses)</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeBureauDeskTab === 'credentials' ? 'bg-emerald-950 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {credentials.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveBureauDeskTab('appraisal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeBureauDeskTab === 'appraisal'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
          <span>የተማሪና ወላጅ ግምገማዎች (Teacher Appraisal Desk)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-200 text-slate-900 font-black">
            60 ማርክ
          </span>
        </button>
      </div>

      {activeBureauDeskTab === 'appraisal' ? (
        <BureauTeacherAppraisalView
          currentLang={currentLang}
          currentUser={{ role: 'bureau_admin', name: currentOfficerName, identifier: 'officer', accessCode: 'bureau_admin' }}
          schools={StorageService.getSchools()}
        />
      ) : (
        <>
          {/* =========================================================================
              🌟 CREDENTIALS AUDIT TOP ACTION TOOLBAR: All actions unified at the top!
              "ሁሉም በየራሱ ገፅ ላይ ያሉ በተን ሳይዘበራረቅ ከላይ እንዲቀመጥ"
             ========================================================================= */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-100 text-sky-800">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {t.cred_title} (Teacher Credentials Audit)
                </h2>
                <span className="text-xs text-sky-900 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-300 font-bold">
                  {filtered.length} / {credentials.length} መምህራን
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{t.cred_desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="የማስረጃዎች ኦዲት ዝርዝር አትም"
            >
              <span>ኦዲት አትም</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>አዲስ ማስረጃ መዝግብ</span>
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
              placeholder="የመምህሩ ስም፣ የትምህርት አይነት፣ ዩኒቨርሲቲ ወይም ፈቃድ ቁጥር ፈልግ..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-600 focus:outline-hidden font-medium"
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
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-sky-800 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              ሁሉም ({credentials.length})
            </button>
            <button
              onClick={() => setStatusFilter('verified')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === 'verified'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
              }`}
            >
              የተረጋገጡ ({credentials.filter((c) => c.verificationStatus === 'verified').length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800'
              }`}
            >
              በመጠባበቅ ({credentials.filter((c) => c.verificationStatus === 'pending').length})
            </button>
            <button
              onClick={() => setStatusFilter('flagged')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === 'flagged'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-800'
              }`}
            >
              ጥያቄ ያለባቸው ({credentials.filter((c) => c.verificationStatus === 'flagged').length})
            </button>
          </div>
        </div>
      </div>

      {/* Credentials Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3.5">{t.cred_teacher}</th>
                <th className="px-4 py-3.5">{t.cred_school}</th>
                <th className="px-4 py-3.5">{t.cred_subject}</th>
                <th className="px-4 py-3.5">{t.cred_qualification}</th>
                <th className="px-4 py-3.5">{t.cred_institution}</th>
                <th className="px-4 py-3.5">{t.cred_license}</th>
                <th className="px-4 py-3.5">{t.cred_status}</th>
                <th className="px-4 py-3.5 text-right">ተግባር (Action)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((cred) => {
                const isVerified = cred.verificationStatus === 'verified';
                const isPending = cred.verificationStatus === 'pending';
                const isFlagged = cred.verificationStatus === 'flagged';

                return (
                  <tr key={cred.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      {cred.teacherName}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        ልምድ: {cred.experienceYears} ዓመት
                      </span>
                    </td>
                    <td className="px-4 py-3.5">{cred.schoolName}</td>
                    <td className="px-4 py-3.5 font-medium text-emerald-900">{cred.subject}</td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-800">{cred.qualification}</span>
                      <span className="text-[10px] text-slate-400 block">({cred.graduationYear} ዓ.ም)</span>
                    </td>
                    <td className="px-4 py-3.5">{cred.institution}</td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-600 font-medium">
                      {cred.licenseNumber}
                    </td>
                    <td className="px-4 py-3.5">
                      {isVerified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{t.status_verified}</span>
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                          <Clock className="w-3 h-3 text-sky-600" />
                          <span>{t.status_pending}</span>
                        </span>
                      )}
                      {isFlagged && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>{t.status_flagged}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedCred(cred);
                          setAuditNotes(cred.notes || '');
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                      >
                        መርምር / ቀይር
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credential Review Modal */}
      {selectedCred && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  የመምህር የትምህርት ማስረጃ ምርመራ (Credential Audit)
                </h3>
                <p className="text-xs text-slate-500">{selectedCred.teacherName} · {selectedCred.schoolName}</p>
              </div>
              <button
                onClick={() => setSelectedCred(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-100">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">የትምህርት ደረጃ:</span>
                  <span className="font-bold text-slate-800">{selectedCred.qualification}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">የተመረቁበት ተቋም:</span>
                  <span className="font-bold text-slate-800">{selectedCred.institution}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">የማስተማር ፈቃድ ቁጥር:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedCred.licenseNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">የትምህርት አይነት:</span>
                  <span className="font-bold text-emerald-900">{selectedCred.subject}</span>
                </div>
              </div>

              {selectedCred.verifiedBy && (
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                  የፈተሸው ባለሙያ: <strong className="text-slate-700">{selectedCred.verifiedBy}</strong> ({selectedCred.verificationDate})
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                የትምህርት ቢሮ የምርመራ ማስታወሻ (Audit Notes)
              </label>
              <textarea
                rows={2}
                value={auditNotes}
                onChange={(e) => setAuditNotes(e.target.value)}
                placeholder="ስለ ማስረጃው ትክክለኛነት ወይም የሚጎድል ነገር ካለ ይጻፉ..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedCred.id, 'flagged')}
                className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
              >
                {t.btn_flag}
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedCred.id, 'pending')}
                className="px-3.5 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors"
              >
                በመጠባበቅ ላይ አድርግ
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedCred.id, 'verified')}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs"
              >
                ✓ {t.btn_verify}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Credential Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">አዲስ መምህር እና ማስረጃ መዝግብ</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCredential} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  የመምህሩ ሙሉ ስም *
                </label>
                <input
                  type="text"
                  required
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  placeholder="መ/ር ..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  የሚያስተምሩበት ትምህርት ቤት *
                </label>
                <input
                  type="text"
                  required
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    የትምህርት አይነት *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="ምሳሌ፡ ኬሚስትሪ / ፊዚክስ"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    የትምህርት ደረጃ
                  </label>
                  <select
                    value={newQualification}
                    onChange={(e) =>
                      setNewQualification(e.target.value as 'Diploma' | 'Degree' | 'Masters' | 'PhD')
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden"
                  >
                    <option value="Degree">Degree (የመጀመሪያ ዲግሪ)</option>
                    <option value="Masters">Masters (ሁለተኛ ዲግሪ)</option>
                    <option value="Diploma">Diploma (ዲፕሎማ)</option>
                    <option value="PhD">PhD (ዶክትሬት)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    የተመረቁበት ዩኒቨርሲቲ/ኮሌጅ *
                  </label>
                  <input
                    type="text"
                    required
                    value={newInstitution}
                    onChange={(e) => setNewInstitution(e.target.value)}
                    placeholder="ሀዋሳ / አዲስ አበባ ዩኒቨርሲቲ"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    የስራ ልምድ (በዓመት)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newExperience}
                    onChange={(e) => setNewExperience(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs"
                >
                  መዝግብ እና አረጋግጥ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
