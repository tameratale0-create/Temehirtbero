import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  GraduationCap,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Server,
  Database,
  X,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { Language } from '../types';

interface OfflineSyncHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: Language;
}

export const OfflineSyncHubModal: React.FC<OfflineSyncHubModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'am'
}) => {
  const {
    isOnline,
    isSyncing,
    pendingCount,
    lastSyncTime,
    simulatedOffline,
    queue,
    toggleSimulatedOffline,
    triggerSync,
    clearSyncedHistory,
    exportBundle
  } = useOfflineSync();

  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'about'>('pending');

  if (!isOpen) return null;

  const handleManualSync = async () => {
    setSyncFeedback(null);
    const result = await triggerSync();
    setSyncFeedback(result.message);
    setTimeout(() => {
      setSyncFeedback(null);
    }, 6000);
  };

  const handleExport = () => {
    const json = exportBundle();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shashemene-education-offline-sync-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pendingItems = queue.filter((q) => q.status === 'pending' || q.status === 'failed');
  const historyItems = queue.filter((q) => q.status === 'synced');

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case 'student_performance':
        return <GraduationCap className="w-4 h-4 text-emerald-600" />;
      case 'teacher_credential':
        return <Award className="w-4 h-4 text-amber-600" />;
      case 'training_material':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      default:
        return <Database className="w-4 h-4 text-slate-600" />;
    }
  };

  const getEntityLabel = (entity: string) => {
    switch (entity) {
      case 'student_performance':
        return 'የተማሪዎች ውጤትና ብቃት';
      case 'teacher_credential':
        return 'የመምህራን ማስረጃና መታወቂያ';
      case 'training_material':
        return 'የስልጠና ሰነድና ሞጁል';
      default:
        return 'መረጃ';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 my-8 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              {isOnline ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ኦፍላይን እና ኦንላይን አውቶማቲክ ማመሳሰያ
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  isOnline ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                }`}>
                  {isOnline ? '🟢 ኦንላይን (መስመር ላይ)' : '🔴 ኦፍላይን (ከመስመር ውጭ)'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                የሻሸመኔ ከተማ ትምህርት ቢሮ - የመረጃ ማመሳሰያ ማዕከል
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Feedback Toast */}
        {syncFeedback && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-950 font-bold animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="flex-1">{syncFeedback}</span>
          </div>
        )}

        {/* Status & Simulation Banner */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">የግንኙነት ሁኔታ (Network)</span>
            <div className="flex items-center gap-2 mt-1">
              <strong className={`text-xs font-black ${isOnline ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isOnline ? 'መስመር ላይ (Connected)' : 'ከመስመር ውጭ (Offline Mode)'}
              </strong>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {simulatedOffline ? '⚙️ በሙከራ ኦፍላይን ሞድ ላይ ነዎት' : 'የእውነተኛ ኔትዎርክ ሁኔታ'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">ያልተመሳሰሉ መረጃዎች (Pending)</span>
            <div className="flex items-center gap-2 mt-1">
              <strong className={`text-base font-black font-mono ${pendingCount > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                {pendingCount} መዝገቦች
              </strong>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {pendingCount > 0 ? 'ኢንተርኔት ሲገኝ በራስ-ሰር ይላካሉ' : 'ሁሉም መረጃዎች ከመካከለኛው ሰርቨር ጋር ተመሳስለዋል'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">የመጨረሻ ማመሳሰል (Last Sync)</span>
            <strong className="text-xs text-slate-800 block mt-1 truncate">
              {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'እስካሁን አልተመሳሰለም'}
            </strong>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {lastSyncTime ? new Date(lastSyncTime).toLocaleDateString() : 'መጀመሪያ ሲገናኝ ይመሳሰላል'}
            </span>
          </div>
        </div>

        {/* Offline Test Simulation Controller */}
        <div className="p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 rounded-xl text-indigo-800">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs font-black text-indigo-950 block">
                የኦፍላይን ሞድ ሞካሪ (Offline Simulation Toggle)
              </strong>
              <p className="text-[10px] text-indigo-700 leading-tight">
                ኢንተርኔቱን ሳያቋርጡ መተግበሪያው ያለ ኔትዎርክ እንዴት እንደሚሰራ ለመሞከር ይህን ያብሩት፤ መልሰው ሲያጠፉት በራስ-ሰር ይመሳሰላል!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleSimulatedOffline}
            className={`px-3.5 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              simulatedOffline
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-indigo-700 hover:bg-indigo-800 text-white'
            }`}
          >
            {simulatedOffline ? '🔴 ኦፍላይን ሞድን አጥፋ (Go Online)' : '🧪 ኦፍላይን ሞድን አብራ (Test Offline)'}
          </button>
        </div>

        {/* 3 Domain Info Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0">
          <div className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-800 shrink-0" />
            <div className="min-w-0">
              <strong className="text-[11px] font-bold text-emerald-950 block truncate">1. የተማሪዎች ውጤት</strong>
              <span className="text-[10px] text-slate-500 block truncate">ምዘና፣ ፈተናና መገኘት</span>
            </div>
          </div>

          <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-800 shrink-0" />
            <div className="min-w-0">
              <strong className="text-[11px] font-bold text-amber-950 block truncate">2. የመምህራን ማስረጃ</strong>
              <span className="text-[10px] text-slate-500 block truncate">ዲግሪ፣ ፈቃድና ፋይዳ ID</span>
            </div>
          </div>

          <div className="p-2.5 bg-indigo-50/60 border border-indigo-200 rounded-xl flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-800 shrink-0" />
            <div className="min-w-0">
              <strong className="text-[11px] font-bold text-indigo-950 block truncate">3. የስልጠና ሰነዶች</strong>
              <span className="text-[10px] text-slate-500 block truncate">CPD ሞጁሎችና ንባብ</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`pb-2 px-3 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            የሚላኩ መረጃዎች ({pendingItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`pb-2 px-3 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            የተመሳሰሉ መዝገቦች ({historyItems.length})
          </button>
        </div>

        {/* Tab Content: Queue List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {activeTab === 'pending' ? (
            pendingItems.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-xs font-black text-slate-800">
                  ሁሉም መረጃዎች ከመካከለኛው ሰርቨር ጋር ተመሳስለዋል!
                </h4>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  ያለ ኢንተርኔት የሚያስገቧቸው አዳዲስ የተማሪዎች ውጤቶች፣ የመምህራን ማስረጃዎች እና የስልጠና መረጃዎች እዚህ ተሰብስበው ኢንተርኔት ሲገኝ በራስ-ሰር ይላካሉ።
                </p>
              </div>
            ) : (
              pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 shrink-0">
                      {getEntityIcon(item.entity)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 truncate">
                          {item.clientMeta?.description || getEntityLabel(item.entity)}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                          {item.action === 'create' ? 'አዲስ' : 'ማሻሻያ'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {item.clientMeta?.schoolName || 'ሻሸመኔ ትምህርት ቤት'} · {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3 animate-spin" />
                    <span>ማመሳሰል ይጠብቃል</span>
                  </span>
                </div>
              ))
            )
          ) : (
            historyItems.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <FileCheck2 className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-600">እስካሁን የተመዘገበ ታሪክ የለም።</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={clearSyncedHistory}
                    className="text-[10px] text-slate-500 hover:text-slate-700 underline"
                  >
                    ታሪክ አጽዳ
                  </button>
                </div>
                {historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 shrink-0">
                        {getEntityIcon(item.entity)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate">
                          {item.clientMeta?.description || getEntityLabel(item.entity)}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>ተመሳስሏል (Synced)</span>
                    </span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleExport}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto"
              title="በፍላሽ/USB ወደ ትምህርት ቢሮ ለመውሰድ ፓኬጁን አውርድ"
            >
              <Download className="w-3.5 h-3.5" />
              <span>የኦፍላይን ፓኬጅ አውርድ</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer w-full sm:w-auto text-center"
            >
              ዝጋ
            </button>

            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className={`px-5 py-2.5 text-xs font-black rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto ${
                isSyncing
                  ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'በማመሳሰል ላይ...' : '🚀 አሁን አመሳስል (Sync Now)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
