import { useState, useEffect } from 'react';
import { OfflineSyncManager, SyncQueueItem } from '../utils/offlineSync';

export interface UseOfflineSyncReturn {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: string | null;
  simulatedOffline: boolean;
  queue: SyncQueueItem[];
  toggleSimulatedOffline: () => boolean;
  triggerSync: () => Promise<{ success: boolean; syncedCount: number; message: string }>;
  clearSyncedHistory: () => void;
  exportBundle: () => string;
}

export function useOfflineSync(): UseOfflineSyncReturn {
  const [syncState, setSyncState] = useState(() => OfflineSyncManager.getState());

  useEffect(() => {
    const unsubscribe = OfflineSyncManager.subscribe((updated) => {
      setSyncState(updated);
    });
    return unsubscribe;
  }, []);

  return {
    isOnline: syncState.isOnline,
    isSyncing: syncState.isSyncing,
    pendingCount: syncState.pendingCount,
    lastSyncTime: syncState.lastSyncTime,
    simulatedOffline: syncState.simulatedOffline,
    queue: syncState.queue,
    toggleSimulatedOffline: () => OfflineSyncManager.toggleSimulatedOffline(),
    triggerSync: () => OfflineSyncManager.sync(),
    clearSyncedHistory: () => OfflineSyncManager.clearSyncedHistory(),
    exportBundle: () => OfflineSyncManager.exportOfflineSyncBundle()
  };
}
