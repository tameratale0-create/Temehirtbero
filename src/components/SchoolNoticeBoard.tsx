import React, { useState, useMemo } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  Filter,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Building2,
  GraduationCap,
  Users,
  ShieldCheck,
  Send,
  X,
  Megaphone,
  Sparkles,
  Search,
  Lock
} from 'lucide-react';
import { SchoolAnnouncement, AppUserSession, Language } from '../types';
import { StorageService } from '../utils/storage';
import { getLocalizedAnnouncements } from '../utils/localizedData';

interface SchoolNoticeBoardProps {
  schoolId: string;
  schoolName: string;
  currentUser: AppUserSession | null;
  currentLang: Language;
}

export const SchoolNoticeBoard: React.FC<SchoolNoticeBoardProps> = ({
  schoolId,
  schoolName,
  currentUser,
  currentLang
}) => {
  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>(() =>
    StorageService.getAnnouncements(schoolId)
  );
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New announcement form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<SchoolAnnouncement['targetAudience']>('all');
  const [priority, setPriority] = useState<SchoolAnnouncement['priority']>('normal');
  const [category, setCategory] = useState<SchoolAnnouncement['category']>('administrative');
  const [confirmDeleteAnnId, setConfirmDeleteAnnId] = useState<string | null>(null);

  // Strict Read-Only Rule for Bureau: "ትምህርት ቢሮ ከትምህርት ቤት የሚላኩ ማንኛውም መረጃወች ማየት ብቻ ማሻሻል ማስተካከል አይቻልም"
  const isBureauRole =
    currentUser?.role === 'bureau_admin' || currentUser?.role === 'bureau_staff';

  const canPost =
    !isBureauRole &&
    (currentUser?.role === 'school_owner' ||
      currentUser?.role === 'school_director' ||
      currentUser?.role === 'school_admin' ||
      currentUser?.role === 'teacher' ||
      currentUser?.role === 'accountant');

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    let authorRole: SchoolAnnouncement['authorRole'] = 'director';
    if (currentUser?.role === 'school_owner') authorRole = 'owner_board';
    else if (currentUser?.role === 'teacher') authorRole = 'teacher';
    else if (currentUser?.role === 'accountant') authorRole = 'accountant';
    else if (currentUser?.role === 'bureau_admin' || currentUser?.role === 'bureau_staff')
      authorRole = 'bureau';

    const newAnn: SchoolAnnouncement = {
      id: `ann-${Date.now()}`,
      schoolId,
      schoolName,
      title: title.trim(),
      content: content.trim(),
      authorRole,
      authorName:
        currentUser?.name ||
        (currentLang === 'om'
          ? 'Bulchiinsa Mana Barnootaa'
          : currentLang === 'en'
          ? 'School Administration'
          : 'የትምህርት ቤት አስተዳደር'),
      targetAudience,
      priority,
      category,
      createdAt: new Date().toISOString().split('T')[0]
    };

    StorageService.addAnnouncement(newAnn);
    setAnnouncements(StorageService.getAnnouncements(schoolId));
    setShowAddModal(false);
    setTitle('');
    setContent('');
  };

  const handleDeleteAnnouncement = (id: string) => {
    StorageService.deleteAnnouncement(id);
    setAnnouncements(StorageService.getAnnouncements(schoolId));
    setConfirmDeleteAnnId(null);
  };

  const localizedAnnouncements = useMemo(
    () => getLocalizedAnnouncements(announcements, currentLang),
    [announcements, currentLang]
  );

  // Filter announcements
  const filteredAnnouncements = useMemo(() => {
    return localizedAnnouncements.filter((a) => {
      const matchAudience =
        selectedAudience === 'all' ||
        a.targetAudience === 'all' ||
        a.targetAudience === selectedAudience;
      const matchCategory = selectedCategory === 'all' || a.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchAudience && matchCategory && matchSearch;
    });
  }, [localizedAnnouncements, selectedAudience, selectedCategory, searchQuery]);

  const getAuthorBadge = (role: SchoolAnnouncement['authorRole']) => {
    switch (role) {
      case 'owner_board':
        return {
          label:
            currentLang === 'om'
              ? 'Hoggansa Boordii / Abbaa M/B'
              : currentLang === 'en'
              ? 'Board Leadership / Owner'
              : 'የቦርድ አመራር / ባለቤት',
          style: 'bg-purple-100 text-purple-900 border-purple-300',
          icon: <Building2 className="w-3 h-3 text-purple-700" />
        };
      case 'director':
        return {
          label:
            currentLang === 'om'
              ? 'Daarektara Olaanaa / Durabu\'aa'
              : currentLang === 'en'
              ? 'School Principal / Director'
              : 'ዋና ዳይሬክተር / ርዕሰ መምህር',
          style: 'bg-teal-100 text-teal-900 border-teal-300',
          icon: <ShieldCheck className="w-3 h-3 text-teal-700" />
        };
      case 'teacher':
        return {
          label: currentLang === 'om' ? 'Barsiisaa' : currentLang === 'en' ? 'Teacher' : 'መምህር',
          style: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: <GraduationCap className="w-3 h-3 text-amber-700" />
        };
      case 'accountant':
        return {
          label:
            currentLang === 'om'
              ? 'Hojjetaa Herregaa / Faayinaansii'
              : currentLang === 'en'
              ? 'Accountant / Finance'
              : 'ሒሳብ ሹም / ፋይናንስ',
          style: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          icon: <Users className="w-3 h-3 text-emerald-700" />
        };
      case 'bureau':
        return {
          label:
            currentLang === 'om'
              ? 'Biiroo Barnootaa Shaashamannee'
              : currentLang === 'en'
              ? 'Shashemene Education Bureau'
              : 'የሻሸመኔ ትምህርት ቢሮ',
          style: 'bg-blue-100 text-blue-900 border-blue-300',
          icon: <Building2 className="w-3 h-3 text-blue-700" />
        };
      default:
        return {
          label: currentLang === 'om' ? 'Bulchiinsa' : currentLang === 'en' ? 'Administration' : 'አስተዳደር',
          style: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: <Bell className="w-3 h-3 text-slate-600" />
        };
    }
  };

  const getAudienceLabel = (aud: SchoolAnnouncement['targetAudience']) => {
    switch (aud) {
      case 'all':
        return currentLang === 'om' ? 'Hundaaf (All)' : currentLang === 'en' ? 'All' : 'ለሁሉም (All)';
      case 'teachers':
        return currentLang === 'om' ? 'Barsiisota Qofaaf' : currentLang === 'en' ? 'Teachers Only' : 'ለመምህራን ብቻ';
      case 'students':
        return currentLang === 'om' ? 'Barattoota Qofaaf' : currentLang === 'en' ? 'Students Only' : 'ለተማሪዎች ብቻ';
      case 'parents':
        return currentLang === 'om' ? 'Maatii Qofaaf' : currentLang === 'en' ? 'Parents Only' : 'ለወላጆች ብቻ';
      case 'staff':
        return currentLang === 'om' ? 'Hojjettoota Qofaaf' : currentLang === 'en' ? 'Staff Only' : 'ለሰራተኞች ብቻ';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-800/80 border border-teal-400/40 rounded-full text-xs font-semibold text-teal-200">
              <Megaphone className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>
                {currentLang === 'om'
                  ? 'Giddugala Beeksisa fi Qajeelfama Mana Barumsaa'
                  : currentLang === 'en'
                  ? 'School Announcements & Directives Hub'
                  : 'የትምህርት ቤት ማስታወቂያ እና መመሪያ ማዕከል'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {currentLang === 'om'
                ? 'Gabatee Beeksisa Seera-Qabeessa (School Notice Board)'
                : currentLang === 'en'
                ? 'Official School Notice Board'
                : 'ይፋዊ የማስታወቂያ ሰሌዳ (School Notice Board)'}
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
              {currentLang === 'om'
                ? 'Beeksisaalee yeroo ammaa miseensota boordii, daarektara, barsiisota, kutaa faayinaansii fi Biiroo Barnootaa irraa hawaasa mana barumsaatiif darban'
                : currentLang === 'en'
                ? 'Timely announcements delivered to the school community from the Board, Principal, Teachers, Finance, and the Education Bureau.'
                : 'ከቦርድ አባላት፣ ከዳይሬክተር፣ ከመምህራን፣ ከሒሳብ ክፍል እና ከትምህርት ቢሮ ለት/ቤቱ ማህበረሰብ የተላለፉ ወቅታዊ ማስታወቂያዎች'}
            </p>
          </div>

          {canPost && (
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>
                {currentLang === 'om'
                  ? 'Beeksisa Haaraa Maxxansi'
                  : currentLang === 'en'
                  ? 'Post New Announcement'
                  : 'አዲስ ማስታወቂያ ለጥፍ'}
              </span>
            </button>
          )}

          {isBureauRole && (
            <div className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-amber-500/20 text-amber-200 border border-amber-400/40 rounded-xl text-xs font-bold shrink-0">
              <Lock className="w-4 h-4 text-amber-300" />
              <span>
                {currentLang === 'om'
                  ? 'Ilaalcha Biiroo Barnootaa (Ilaaluu Qofa - Read-Only)'
                  : currentLang === 'en'
                  ? 'Bureau View (Read-Only)'
                  : 'የትምህርት ቢሮ እይታ (ማየት ብቻ - Read-Only)'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              currentLang === 'om'
                ? 'Mata-duree, qabiyyee ykn qopheessaa barbaadi...'
                : currentLang === 'en'
                ? 'Search title, content, or author...'
                : 'ርዕስ፣ ይዘት ወይም አዘጋጅ ፈልግ...'
            }
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-500 font-medium">
              {currentLang === 'om' ? 'Qaama Ilaallatu:' : currentLang === 'en' ? 'Audience:' : 'የዒላማ ክፍል፡'}
            </span>
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-xl bg-white font-semibold text-slate-700"
            >
              <option value="all">
                {currentLang === 'om' ? 'Beeksisaalee Hunda' : currentLang === 'en' ? 'All Announcements' : 'ሁሉም ማስታወቂያዎች'}
              </option>
              <option value="teachers">
                {currentLang === 'om' ? 'Barsiisotaaf' : currentLang === 'en' ? 'For Teachers' : 'ለመምህራን'}
              </option>
              <option value="students">
                {currentLang === 'om' ? 'Barattootaaf' : currentLang === 'en' ? 'For Students' : 'ለተማሪዎች'}
              </option>
              <option value="parents">
                {currentLang === 'om' ? 'Maatiif' : currentLang === 'en' ? 'For Parents' : 'ለወላጆች'}
              </option>
              <option value="staff">
                {currentLang === 'om' ? 'Hojjettoota Deeggarsaaf' : currentLang === 'en' ? 'For Support Staff' : 'ለድጋፍ ሰጪ ሰራተኞች'}
              </option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-500 font-medium">
              {currentLang === 'om' ? 'Ramaddii:' : currentLang === 'en' ? 'Category:' : 'ምድብ፡'}
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-xl bg-white font-semibold text-slate-700"
            >
              <option value="all">
                {currentLang === 'om' ? 'Ramaddiiwwan Hunda' : currentLang === 'en' ? 'All Categories' : 'ሁሉም ምድቦች'}
              </option>
              <option value="administrative">
                {currentLang === 'om' ? 'Bulchiinsaa' : currentLang === 'en' ? 'Administrative' : 'አስተዳደራዊ'}
              </option>
              <option value="academic">
                {currentLang === 'om' ? 'Akaadaamii / Barnootaa' : currentLang === 'en' ? 'Academic' : 'አካዳሚክ / የትምህርት'}
              </option>
              <option value="finance">
                {currentLang === 'om' ? 'Kaffaltii Ji\'aa / Faayinaansii' : currentLang === 'en' ? 'Tuition / Finance' : 'የወር ክፍያ / ፋይናንስ'}
              </option>
              <option value="pta">
                {currentLang === 'om' ? 'Koree Maatii-Barsiisaa (PTA)' : currentLang === 'en' ? 'PTA' : 'የወላጅ መምህራን (PTA)'}
              </option>
              <option value="exam">
                {currentLang === 'om' ? 'Qormaatawwan' : currentLang === 'en' ? 'Exams' : 'ፈተናዎች'}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <Bell className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">
            {currentLang === 'om' ? 'Beeksisni homaa hin argamne' : currentLang === 'en' ? 'No announcements found' : 'ምንም ማስታወቂያ አልተገኘም'}
          </p>
          <p className="text-xs text-slate-500">
            {currentLang === 'om'
              ? 'Ulaagaa filatameen beeksisni maxxanfame hin jiru.'
              : currentLang === 'en'
              ? 'There are no announcements matching the selected filters.'
              : 'በተመረጠው መስፈርት የተለጠፈ ማስታወቂያ የለም።'}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredAnnouncements.map((ann) => {
            const author = getAuthorBadge(ann.authorRole);
            return (
              <div
                key={ann.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all hover:shadow-md ${
                  ann.priority === 'urgent'
                    ? 'border-rose-300 ring-1 ring-rose-200'
                    : ann.priority === 'important'
                    ? 'border-amber-300 ring-1 ring-amber-200'
                    : 'border-slate-200/90'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${author.style}`}
                    >
                      {author.icon}
                      <span>{author.label}</span>
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {currentLang === 'om' ? 'Kan Ilaallatu:' : currentLang === 'en' ? 'Target:' : 'የሚመለከተው፡'}{' '}
                      {getAudienceLabel(ann.targetAudience)}
                    </span>

                    {ann.priority === 'urgent' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{currentLang === 'om' ? 'Ariifachiisaa (Urgent)' : currentLang === 'en' ? 'Urgent' : 'አስቸኳይ (Urgent)'}</span>
                      </span>
                    )}

                    {ann.priority === 'important' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                        {currentLang === 'om' ? 'Barbaachisaa (Important)' : currentLang === 'en' ? 'Important' : 'አስፈላጊ (Important)'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {ann.createdAt}
                    </span>

                    {!isBureauRole &&
                      (currentUser?.role === 'school_owner' ||
                        currentUser?.role === 'school_director') && (
                      confirmDeleteAnnId === ann.id ? (
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDeleteAnnouncement(ann.id)}
                            className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-md transition-colors cursor-pointer"
                          >
                            {currentLang === 'om' ? 'Mirkaneessi' : currentLang === 'en' ? 'Confirm' : 'አረጋግጥ'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteAnnId(null)}
                            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-md transition-colors cursor-pointer"
                          >
                            {currentLang === 'om' ? 'Dhiisi' : currentLang === 'en' ? 'Cancel' : 'ተወው'}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteAnnId(ann.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title={currentLang === 'om' ? 'Beeksisa haqi' : currentLang === 'en' ? 'Delete announcement' : 'ማስታወቂያውን ሰርዝ'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                    {ann.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {ann.content}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium text-slate-600">
                    {currentLang === 'om' ? 'Qopheessaa:' : currentLang === 'en' ? 'Author:' : 'አዘጋጅ፡'}{' '}
                    <strong>{ann.authorName}</strong>
                  </span>
                  <span className="font-medium text-teal-800">{ann.schoolName}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Announcement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-teal-800 to-emerald-950 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm sm:text-base">
                  {currentLang === 'om' ? 'Bakka Beeksisa Haaraa Itti Maxxansan' : currentLang === 'en' ? 'Post New Announcement' : 'አዲስ ማስታወቂያ መለጠፊያ'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-teal-200 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLang === 'om' ? 'Mata-duree Beeksisa *' : currentLang === 'en' ? 'Announcement Title *' : 'የማስታወቂያው ርዕስ *'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    currentLang === 'om'
                      ? 'Fakkeenyaaf: Qormaata Walakkaa Seemisteera 1ffaa...'
                      : currentLang === 'en'
                      ? 'e.g. 1st Semester Mid-Exam Schedule...'
                      : 'ምሳሌ፡ የ1ኛ ወሰነ-ትምህርት አጋማሽ ፈተና...'
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Kan Ilaallatu (Target)' : currentLang === 'en' ? 'Target Audience' : 'የሚመለከተው (Target)'}
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) =>
                      setTargetAudience(e.target.value as SchoolAnnouncement['targetAudience'])
                    }
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="all">{currentLang === 'om' ? 'Hundaaf (All)' : currentLang === 'en' ? 'All' : 'ለሁሉም (All)'}</option>
                    <option value="teachers">{currentLang === 'om' ? 'Barsiisota Qofaaf' : currentLang === 'en' ? 'Teachers Only' : 'ለመምህራን ብቻ'}</option>
                    <option value="students">{currentLang === 'om' ? 'Barattoota Qofaaf' : currentLang === 'en' ? 'Students Only' : 'ለተማሪዎች ብቻ'}</option>
                    <option value="parents">{currentLang === 'om' ? 'Maatii Qofaaf' : currentLang === 'en' ? 'Parents Only' : 'ለወላጆች ብቻ'}</option>
                    <option value="staff">{currentLang === 'om' ? 'Hojjettoota Deeggarsaaf' : currentLang === 'en' ? 'Support Staff' : 'ለድጋፍ ሰራተኞች'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Sadarkaa / Dursa (Priority)' : currentLang === 'en' ? 'Priority' : 'ደረጃ / ቅድሚያ (Priority)'}
                  </label>
                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value as SchoolAnnouncement['priority'])
                    }
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="normal">{currentLang === 'om' ? 'Idilee (Normal)' : currentLang === 'en' ? 'Normal' : 'መደበኛ (Normal)'}</option>
                    <option value="important">{currentLang === 'om' ? 'Barbaachisaa (Important)' : currentLang === 'en' ? 'Important' : 'አስፈላጊ (Important)'}</option>
                    <option value="urgent">{currentLang === 'om' ? 'Ariifachiisaa (Urgent)' : currentLang === 'en' ? 'Urgent' : 'አስቸኳይ (Urgent)'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'om' ? 'Ramaddii (Category)' : currentLang === 'en' ? 'Category' : 'ምድብ (Category)'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as SchoolAnnouncement['category'])
                    }
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="administrative">{currentLang === 'om' ? 'Bulchiinsaa' : currentLang === 'en' ? 'Administrative' : 'አስተዳደራዊ'}</option>
                    <option value="academic">{currentLang === 'om' ? 'Barnoota / Qormaata' : currentLang === 'en' ? 'Academic / Exam' : 'የትምህርት / ፈተና'}</option>
                    <option value="finance">{currentLang === 'om' ? 'Kaffaltii fi Faayinaansii' : currentLang === 'en' ? 'Finance & Tuition' : 'ክፍያና ፋይናንስ'}</option>
                    <option value="pta">{currentLang === 'om' ? 'Yaa\'ii Maatii (PTA)' : currentLang === 'en' ? 'PTA Meeting' : 'የወላጅ ጉባኤ (PTA)'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLang === 'om' ? 'Qabiyyee Bal\'aa Beeksisa *' : currentLang === 'en' ? 'Detailed Content *' : 'የማስታወቂያው ዝርዝር ይዘት *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    currentLang === 'om'
                      ? 'Ergaa beeksisa kanaa asitti bal\'inaan barreessaa...'
                      : currentLang === 'en'
                      ? 'Write the detailed announcement message here...'
                      : 'የማስታወቂያውን መልእክት እዚህ በዝርዝር ይጻፉ...'
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  {currentLang === 'om' ? 'Haqi' : currentLang === 'en' ? 'Cancel' : 'ሰርዝ'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{currentLang === 'om' ? 'Beeksisa Maxxansi' : currentLang === 'en' ? 'Post Announcement' : 'ማስታወቂያውን ለጥፍ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
