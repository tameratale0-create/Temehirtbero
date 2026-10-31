import React from 'react';
import { X, QrCode } from 'lucide-react';
import { School, StudentRecord, Language, AppUserSession, StudentAttendanceRecord } from '../types';
import { StudentQRAttendanceView } from './StudentQRAttendanceView';

interface StudentQRAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: School;
  students: StudentRecord[];
  currentUser: AppUserSession | null;
  currentLang: Language;
  preSelectedStudentId?: string;
  onAttendanceRecorded?: (record: StudentAttendanceRecord) => void;
}

export const StudentQRAttendanceModal: React.FC<StudentQRAttendanceModalProps> = ({
  isOpen,
  onClose,
  school,
  students,
  currentUser,
  currentLang,
  preSelectedStudentId,
  onAttendanceRecorded
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                የተማሪዎች ዕለታዊ መገኘት በ QR ኮድ (Student QR Attendance Desk)
              </h3>
              <p className="text-[11px] text-slate-500">
                {school.name} · የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-slate-200 hover:bg-slate-300 rounded-full text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          <StudentQRAttendanceView
            school={school}
            students={students}
            currentUser={currentUser}
            currentLang={currentLang}
            preSelectedStudentId={preSelectedStudentId}
            onAttendanceRecorded={onAttendanceRecorded}
          />
        </div>
      </div>
    </div>
  );
};
