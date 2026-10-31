import React, { useState } from 'react';
import {
  Users,
  KeyRound,
  Plus,
  ShieldCheck,
  Phone,
  Mail,
  Copy,
  Check,
  Building,
  UserCheck,
  Briefcase,
  Search,
  Filter,
  X
} from 'lucide-react';
import { Language, BureauStaff } from '../types';
import { translations } from '../data/translations';
import { StorageService } from '../utils/storage';

interface StaffManagementProps {
  currentLang: Language;
  staff: BureauStaff[];
  onStaffChange: (updated: BureauStaff[]) => void;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({
  currentLang,
  staff,
  onStaffChange
}) => {
  const t = translations[currentLang];

  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');

  // New staff form state
  const [fullName, setFullName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [department, setDepartment] = useState('ኢንስፔክሽንና ደረጃ ምዘና (Inspection)');
  const [phone, setPhone] = useState('+251 9');
  const [email, setEmail] = useState('');

  const generateStaffCode = (dept: string) => {
    let prefix = 'BUR-STF';
    if (dept.includes('Inspection') || dept.includes('ኢንስፔክሽን')) prefix = 'BUR-INSP';
    if (dept.includes('Curriculum') || dept.includes('ስርዓተ-ትምህርት')) prefix = 'BUR-CURR';
    if (dept.includes('Examination') || dept.includes('ፈተና')) prefix = 'BUR-EXAM';
    if (dept.includes('Planning') || dept.includes('ፕላን')) prefix = 'BUR-PLAN';
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${rand}`;
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = generateStaffCode(department);

    const newStaffMember: BureauStaff = {
      id: `st-${Date.now()}`,
      fullName,
      roleTitle,
      department,
      accessCode: newCode,
      phone,
      email: email || `${newCode.toLowerCase()}@shasheducation.gov.et`,
      permissions: ['view_reports', 'audit_credentials', 'send_materials'],
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const updated = StorageService.addStaff(newStaffMember);
    onStaffChange(updated);
    setShowAddModal(false);

    // Reset form
    setFullName('');
    setRoleTitle('');
    setPhone('+251 9');
    setEmail('');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const filteredStaff = staff.filter((s) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.fullName.toLowerCase().includes(q) ||
      s.roleTitle.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.accessCode.toLowerCase().includes(q) ||
      s.phone.includes(q);

    const matchesDept = selectedDept === 'all' || s.department.includes(selectedDept);
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* =========================================================================
          🌟 STAFF TOP ACTION TOOLBAR: All actions unified at the top!
          "ሁሉም በየራሱ ገፅ ላይ ያሉ በተን ሳይዘበራረቅ ከላይ እንዲቀመጥ"
         ========================================================================= */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {t.staff_title} (Bureau Staff Registry)
                </h2>
                <span className="text-xs text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 font-bold">
                  {filteredStaff.length} / {staff.length} ሰራተኞች
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{t.staff_desc}</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="self-stretch sm:self-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.add_staff_btn}</span>
          </button>
        </div>

        {/* Search & Department Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="የሰራተኛውን ስም፣ የስራ ድርሻ ወይም የመግቢያ ኮድ ፈልግ..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-medium"
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

          {/* Department Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            {[
              { id: 'all', label: 'ሁሉም ክፍሎች' },
              { id: 'Inspection', label: 'ኢንስፔክሽን' },
              { id: 'Curriculum', label: 'ስርዓተ-ትምህርት' },
              { id: 'Examination', label: 'ፈተና' },
              { id: 'Planning', label: 'ፕላን' }
            ].map((dept) => (
              <button
                key={dept.id}
                type="button"
                onClick={() => setSelectedDept(dept.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDept === dept.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Staff List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-sm">
                    {member.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      {member.fullName}
                    </h3>
                    <p className="text-[11px] text-emerald-800 font-semibold">{member.roleTitle}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium border border-emerald-200">
                  {member.status === 'active' ? 'በስራ ላይ' : 'እረፍት'}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px]">የስራ ክፍል፡</span>
                  <span className="font-semibold text-slate-700">{member.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px]">ስልክ፡</span>
                  <span className="text-slate-700">{member.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px]">የተመዘገበበት ቀን፡</span>
                  <span className="text-slate-500 text-[11px]">{member.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Access Code display with copy button */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">የመግቢያ ኮድ (Access Code)</span>
                <span className="font-mono font-bold text-emerald-900 text-xs">
                  {member.accessCode}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(member.accessCode, member.id)}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                title="ኮዱን ቅዳ"
              >
                {copiedCodeId === member.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">ተቀድቷል</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>ኮድ ቅዳ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-800" />
                <h3 className="text-sm font-bold text-slate-900">{t.add_staff_btn}</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.staff_name} *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="አቶ/ወ/ሮ ..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.staff_role} *
                </label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="ምሳሌ፡ የትምህርት ጥራት ኢንስፔክተር"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.staff_dept} *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden bg-white"
                >
                  <option value="ኢንስፔክሽንና ደረጃ ምዘና (Inspection)">
                    ኢንስፔክሽንና ደረጃ ምዘና (Inspection)
                  </option>
                  <option value="ስርዓተ-ትምህርትና ስልጠና (Curriculum & CPD)">
                    ስርዓተ-ትምህርትና ስልጠና (Curriculum & CPD)
                  </option>
                  <option value="ፈተናና ምዘና (Examinations)">
                    ፈተናና ምዘና (Examinations)
                  </option>
                  <option value="ፕላንና መረጃ (Planning & EMIS)">
                    ፕላንና መረጃ (Planning & EMIS)
                  </option>
                  <option value="የቢሮ አመራር (Executive Unit)">
                    የቢሮ አመራር (Executive Unit)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.staff_phone} *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251 9..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ኢሜይል (Email)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@shasheducation.gov.et"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-900">
                <span className="font-bold">ማስታወሻ፡</span> ሰራተኛው ሲመዘገብ ልዩ ይፋዊ የመግቢያ ኮድ በራስ-ሰር ይፈጠርለታል። ይህንን ኮድ በመጠቀም ወደ ሲስተሙ መግባት ይችላል።
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
                  መዝግብ እና ኮድ አፍልቅ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
