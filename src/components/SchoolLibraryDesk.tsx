import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  User,
  Bookmark,
  Calendar,
  AlertCircle,
  RotateCcw,
  BookMarked,
  Layers,
  GraduationCap,
  ShieldCheck,
  Check
} from 'lucide-react';
import { School, LibraryBookRecord, Language, AppUserSession } from '../types';
import { StorageService } from '../utils/storage';

interface SchoolLibraryDeskProps {
  school: School;
  currentUser: AppUserSession | null;
  currentLang: Language;
}

export const SchoolLibraryDesk: React.FC<SchoolLibraryDeskProps> = ({
  school,
  currentUser,
  currentLang
}) => {
  const [books, setBooks] = useState<LibraryBookRecord[]>(() =>
    StorageService.getLibraryBooks(school.id)
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'borrowed'>('all');

  // Lending modal state
  const [selectedBookForBorrow, setSelectedBookForBorrow] = useState<LibraryBookRecord | null>(null);
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerGrade, setBorrowerGrade] = useState('Grade 10A');
  const [returnDays, setReturnDays] = useState(14);

  // New Book modal state
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('Mathematics (ሂሳብ)');
  const [newShelfCode, setNewShelfCode] = useState('SH-01');
  const [newCopies, setNewCopies] = useState(20);

  const handleBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookForBorrow || !borrowerName.trim()) return;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Number(returnDays));
    const dueDateStr = dueDate.toISOString().split('T')[0];

    StorageService.borrowBook(selectedBookForBorrow.id, borrowerName, borrowerGrade, dueDateStr);
    setBooks(StorageService.getLibraryBooks(school.id));
    setSelectedBookForBorrow(null);
    setBorrowerName('');
  };

  const handleReturn = (bookId: string) => {
    StorageService.returnBook(bookId);
    setBooks(StorageService.getLibraryBooks(school.id));
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newBook: LibraryBookRecord = {
      id: `bk-${Date.now()}`,
      schoolId: school.id,
      title: newTitle,
      author: newAuthor || 'የደራሲ ስም',
      category: newCategory,
      shelfCode: newShelfCode,
      totalCopies: Number(newCopies),
      availableCopies: Number(newCopies),
      status: 'available'
    };

    StorageService.addLibraryBook(newBook);
    setBooks(StorageService.getLibraryBooks(school.id));
    setShowAddBookModal(false);
    setNewTitle('');
    setNewAuthor('');
  };

  // Filtered books
  const filteredBooks = books.filter((b) => {
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      q === '' ||
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.shelfCode.toLowerCase().includes(q) ||
      (b.borrowerName && b.borrowerName.toLowerCase().includes(q));

    const matchCat = categoryFilter === 'all' || b.category === categoryFilter;
    const matchStat = statusFilter === 'all' || b.status === statusFilter;

    return matchSearch && matchCat && matchStat;
  });

  const totalCopies = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const borrowedCount = books.filter((b) => b.status === 'borrowed').length;
  const availableCount = books.reduce((acc, b) => acc + b.availableCopies, 0);

  return (
    <div className="space-y-4">
      {/* 1. Header Banner & Isolation Status */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-md border border-blue-700/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold">
                የትምህርት ቤተ-መጻሕፍት እና የመረጃ ማዕከል ጽ/ቤት (Library Desk)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-400 text-blue-950">
                የተለየ የስራ ክፍል (Isolated Workspace)
              </span>
            </div>
            <p className="text-xs text-blue-200/90 mt-0.5">
              ኃላፊ፡ <strong className="text-white">{currentUser?.name || 'የት/ቤት ቤተ-መጻሕፍት ባለሙያ'}</strong> ·
              የመጻሕፍት ካታሎግ፣ የተማሪዎች ንባብ አገልግሎትና የተውሶ መጽሐፍ ቁጥጥር
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddBookModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>አዲስ መጽሐፍ መዝግብ</span>
        </button>
      </div>

      {/* 2. Statistical Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 block">አጠቃላይ የመጽሐፍ ቅጾች</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
              {totalCopies}
            </span>
            <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-bold">
              {books.length} አርዕስት
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block truncate">በተቋሙ ካታሎግ ውስጥ</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 block">ለተማሪ የተዋሱ መጻሕፍት</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-700 font-mono">
              {borrowedCount}
            </span>
            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
              በተማሪ እጅ ላይ
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block truncate">መመለሻ ጊዜያቸው የተወሰነ</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 block">በመደርደሪያ ላይ ዝግጁ</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-800 font-mono">
              {availableCount}
            </span>
            <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
              አሁኑኑ የሚሰጡ
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block truncate">ለንባብ የተዘጋጁ</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 block">የንባብ አዳራሽ ወንበሮች</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-extrabold text-indigo-900 font-mono">
              {school.libraryCapacity || 80}
            </span>
            <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full font-bold">
              ወንበር
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block truncate">የተማሪዎች ንባብ ማዕከል</span>
        </div>
      </div>

      {/* 3. Search and Filtering Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="መጽሐፍ በርዕስ፣ በደራሲ፣ በመደርደሪያ ኮድ ወይም በተዋሰው ተማሪ ፈልግ..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">ሁሉም ሁኔታ (All Status)</option>
            <option value="available">ዝግጁ (Available)</option>
            <option value="borrowed">የተዋሱ (Borrowed)</option>
          </select>
        </div>
      </div>

      {/* 4. Book Inventory and Lending Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-blue-700" />
            <span>የትምህርት ቤቱ የመጻሕፍት ዝርዝር እና የተውሶ መዝገብ</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            ድምር፡ <strong>{filteredBooks.length}</strong> መጻሕፍት
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-sm">{book.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {book.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-blue-50 text-blue-800 border border-blue-200">
                    {book.shelfCode}
                  </span>
                  {book.status === 'borrowed' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>የተዋሰ</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>ዝግጁ ({book.availableCopies}/{book.totalCopies})</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-slate-500">
                  <span>ደራሲ/አዘጋጅ፡ <strong>{book.author}</strong></span>
                  <span>·</span>
                  <span>ጠቅላላ ኮፒ፡ <strong>{book.totalCopies} ቅጾች</strong></span>
                  {book.borrowerName && (
                    <>
                      <span>·</span>
                      <span className="text-amber-800 font-medium">
                        የተዋሰው ተማሪ፡ <strong>{book.borrowerName} ({book.borrowerGrade})</strong>
                      </span>
                      <span>·</span>
                      <span className="text-slate-600">
                        የመመለሻ ቀን፡ <strong>{book.returnDueDate}</strong>
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {book.status === 'borrowed' ? (
                  <button
                    type="button"
                    onClick={() => handleReturn(book.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ተመልሷል (Return)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedBookForBorrow(book)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>ለተማሪ አውርስ (Lend)</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredBooks.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              ምንም የተገኘ መጽሐፍ የለም።
            </div>
          )}
        </div>
      </div>

      {/* 5. Lend Book Modal */}
      {selectedBookForBorrow && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-700" />
                <span>መጽሐፍ ለተማሪ ማዋሻ ቅጽ</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedBookForBorrow(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-900">
              የተመረጠ መጽሐፍ፡ <strong>{selectedBookForBorrow.title}</strong>
              <div className="text-[11px] text-blue-700">መደርደሪያ፡ {selectedBookForBorrow.shelfCode}</div>
            </div>

            <form onSubmit={handleBorrow} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  የተማሪው ሙሉ ስም *
                </label>
                <input
                  type="text"
                  required
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="ምሳሌ፡ ኪያር ከድር አሊ"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ክፍል እና ክፍልፋይ *
                </label>
                <input
                  type="text"
                  required
                  value={borrowerGrade}
                  onChange={(e) => setBorrowerGrade(e.target.value)}
                  placeholder="ምሳሌ፡ Grade 10A"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  የተውሶ ጊዜ ቆይታ (ቀናት)
                </label>
                <select
                  value={returnDays}
                  onChange={(e) => setReturnDays(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-hidden"
                >
                  <option value={7}>1 ሳምንት (7 ቀናት)</option>
                  <option value={14}>2 ሳምንት (14 ቀናት)</option>
                  <option value={21}>3 ሳምንት (21 ቀናት)</option>
                  <option value={30}>1 ወር (30 ቀናት)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookForBorrow(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-medium"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  አውርስ (Confirm Loan)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Add Book Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-700" />
                <span>አዲስ መጽሐፍ ወደ ካታሎግ መጨመሪያ</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddBookModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBook} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  የመጽሐፉ ርዕስ *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ምሳሌ፡ የ12ኛ ክፍል ባዮሎጂ"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ደራሲ / አዘጋጅ
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="ምሳሌ፡ ትምህርት ሚኒስቴር"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    የትምህርት ዘርፍ
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-hidden"
                  >
                    <option value="Mathematics (ሂሳብ)">ሂሳብ (Mathematics)</option>
                    <option value="Physics (ፊዚክስ)">ፊዚክስ (Physics)</option>
                    <option value="Chemistry (ኬሚስትሪ)">ኬሚስትሪ (Chemistry)</option>
                    <option value="Biology (ባዮሎጂ)">ባዮሎጂ (Biology)</option>
                    <option value="Language & Literature">ቋንቋና ስነ-ጽሑፍ</option>
                    <option value="History & Social Science">ማህበራዊ ሳይንስ</option>
                    <option value="ICT & Technology">ኮምፒውተርና አይቲ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    የመደርደሪያ ኮድ
                  </label>
                  <input
                    type="text"
                    required
                    value={newShelfCode}
                    onChange={(e) => setNewShelfCode(e.target.value)}
                    placeholder="ምሳሌ፡ SH-BIO-05"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  የቅጾች (Copies) ብዛት
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={newCopies}
                  onChange={(e) => setNewCopies(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-medium"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  መዝግብ (Save Book)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
