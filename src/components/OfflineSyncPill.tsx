import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { OfflineSyncHubModal } from './OfflineSyncHubModal';
import { Language } from '../types';

interface OfflineSyncPillProps {
  currentLang?: Language;
  compact?: boolean;
}

export const OfflineSyncPill: React.FC<OfflineSyncPillProps> = ({
  currentLang = 'am',
  compact = false
}) => {
  const { isOnline, isSyncing, pendingCount, simulatedOffline, triggerSync } = useOfflineSync();
  const [showHubModal, setShowHubModal] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowHubModal(true)}
        className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs ${
          isSyncing
            ? 'bg-indigo-50 text-indigo-900 border-indigo-300'
            : !isOnline
            ? 'bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100'
            : pendingCount > 0
            ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
            : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
        }`}
        title="የኦፍላይን እና ኦንላይን መረጃ ማመሳሰያ ሁኔታን ይመልከቱ"
      >
        {isSyncing ? (
          <RefreshCw className="w-3.5 h-3.5 text-indigo-700 animate-spin" />
        ) : !isOnline ? (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
          </span>
        ) : pendingCount > 0 ? (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
          </span>
        ) : (
          <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
        )}

        <span className="truncate">
          {isSyncing
            ? 'በማመሳሰል ላይ...'
            : !isOnline
            ? '🔴 ኦፍላይን (Offline)'
            : pendingCount > 0
            ? `🟡 ${pendingCount} የሚላኩ መረጃዎች`
            : compact
            ? '🟢 ተመሳስሏል'
            : '🟢 መስመር ላይ (Online)'}
        </span>

        {pendingCount > 0 && isOnline && !isSyncing && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              triggerSync();
            }}
            className="ml-1 text-[10px] font-black underline hover:text-amber-950"
            title="አሁን አመሳስል"
          >
            አመሳስል
          </span>
        )}
      </button>

      <OfflineSyncHubModal
        isOpen={showHubModal}
        onClose={() => setShowHubModal(false)}
        currentLang={currentLang}
      />
    </>
  );
};
