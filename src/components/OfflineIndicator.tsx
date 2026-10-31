import React, { useState } from 'react';
import { WifiOff, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { OfflineSyncHubModal } from './OfflineSyncHubModal';
import { Language } from '../types';

interface OfflineIndicatorProps {
  currentLang?: Language;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ currentLang = 'am' }) => {
  const { isOnline, isSyncing, pendingCount, triggerSync } = useOfflineSync();
  const [showHubModal, setShowHubModal] = useState(false);

  // If online and nothing is pending and not syncing, don't obstruct the screen
  if (isOnline && pendingCount === 0 && !isSyncing) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900/95 text-white px-4 py-2.5 text-xs font-semibold shadow-2xl backdrop-blur-md border border-slate-700 animate-in slide-in-from-bottom duration-200">
        {isSyncing ? (
          <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
        ) : !isOnline ? (
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
        ) : (
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span>
            {isSyncing
              ? 'መረጃዎች ከመካከለኛው ሰርቨር ጋር በመመሳሰል ላይ ናቸው...'
              : !isOnline
              ? 'ኦፍላይን ሁነታ ላይ ነዎት — መረጃዎች በስልክዎ/ፒሲዎ ይቀመጣሉ'
              : `${pendingCount} ያልተመሳሰሉ መረጃዎች (Pending Sync)`}
          </span>

          <div className="flex items-center gap-1.5">
            {pendingCount > 0 && isOnline && !isSyncing && (
              <button
                type="button"
                onClick={() => triggerSync()}
                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-black cursor-pointer shadow-xs"
              >
                አሁን አመሳስል
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowHubModal(true)}
              className="text-[11px] text-amber-300 hover:text-amber-200 underline font-bold cursor-pointer"
            >
              ማዕከል ክፈት
            </button>
          </div>
        </div>
      </div>

      <OfflineSyncHubModal
        isOpen={showHubModal}
        onClose={() => setShowHubModal(false)}
        currentLang={currentLang}
      />
    </>
  );
};
