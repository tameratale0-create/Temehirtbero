/**
 * Shashemene City Administration Education Bureau
 * Offline Data Synchronization Engine (Offline-First Architecture)
 * 
 * Supports offline recording and automated background synchronization for:
 * 1. Student Performance (Assessments, continuous evaluations, grades, attendance)
 * 2. Teacher Credentials (Degrees, certifications, licenses, FAYDA IDs)
 * 3. Training Materials (CPD modules, pedagogical materials, offline completions)
 */

export type SyncEntityType =
  | 'student_performance'
  | 'teacher_credential'
  | 'training_material'
  | 'exam_submission'
  | 'teacher_evaluation'
  | 'grade_workflow';

export interface SyncQueueItem {
  id: string;
  entity: SyncEntityType;
  action: 'create' | 'update' | 'delete';
  entityId: string;
  data: any;
  timestamp: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  retryCount: number;
  errorMessage?: string;
  clientMeta?: {
    authorName?: string;
    schoolName?: string;
    role?: string;
    description?: string;
  };
}

export interface SyncMetadata {
  lastSyncTime: string | null;
  lastSyncStatus: 'success' | 'failed' | 'in_progress' | 'never';
  totalSyncedCount: number;
  simulatedOffline: boolean;
}

const QUEUE_STORAGE_KEY = 'shash_edu_sync_queue_v2';
const META_STORAGE_KEY = 'shash_edu_sync_meta_v2';

type SyncSubscriber = (state: {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: string | null;
  simulatedOffline: boolean;
  queue: SyncQueueItem[];
}) => void;

class OfflineSyncEngine {
  private queue: SyncQueueItem[] = [];
  private metadata: SyncMetadata = {
    lastSyncTime: null,
    lastSyncStatus: 'never',
    totalSyncedCount: 0,
    simulatedOffline: false
  };
  private isSyncing = false;
  private subscribers: Set<SyncSubscriber> = new Set();
  private autoSyncInterval: any = null;

  constructor() {
    this.loadState();
    this.initEventListeners();
  }

  private loadState() {
    try {
      const storedQueue = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (storedQueue) {
        this.queue = JSON.parse(storedQueue);
      }

      const storedMeta = localStorage.getItem(META_STORAGE_KEY);
      if (storedMeta) {
        this.metadata = { ...this.metadata, ...JSON.parse(storedMeta) };
      }
    } catch (e) {
      console.warn('Failed to load offline sync state from storage:', e);
    }
  }

  private saveState() {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
      localStorage.setItem(META_STORAGE_KEY, JSON.stringify(this.metadata));
      this.notifySubscribers();
    } catch (e) {
      console.warn('Failed to save offline sync state:', e);
    }
  }

  private initEventListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.notifySubscribers();
      if (!this.metadata.simulatedOffline) {
        this.sync();
      }
    });

    window.addEventListener('offline', () => {
      this.notifySubscribers();
    });

    // Periodic auto-sync check every 30 seconds
    this.autoSyncInterval = setInterval(() => {
      if (this.isOnline() && this.getPendingCount() > 0 && !this.isSyncing) {
        this.sync();
      }
    }, 30000);
  }

  public subscribe(cb: SyncSubscriber): () => void {
    this.subscribers.add(cb);
    cb(this.getState());
    return () => this.subscribers.delete(cb);
  }

  private notifySubscribers() {
    const state = this.getState();
    this.subscribers.forEach((cb) => cb(state));
  }

  public getState() {
    return {
      isOnline: this.isOnline(),
      isSyncing: this.isSyncing,
      pendingCount: this.getPendingCount(),
      lastSyncTime: this.metadata.lastSyncTime,
      simulatedOffline: this.metadata.simulatedOffline,
      queue: [...this.queue]
    };
  }

  public isOnline(): boolean {
    if (this.metadata.simulatedOffline) return false;
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  public getPendingCount(): number {
    return this.queue.filter((q) => q.status === 'pending' || q.status === 'failed').length;
  }

  public getQueue(): SyncQueueItem[] {
    return [...this.queue];
  }

  public toggleSimulatedOffline(): boolean {
    this.metadata.simulatedOffline = !this.metadata.simulatedOffline;
    this.saveState();

    // If switched back to online, automatically sync any queued offline work
    if (!this.metadata.simulatedOffline && this.isOnline() && this.getPendingCount() > 0) {
      setTimeout(() => this.sync(), 400);
    }

    return this.metadata.simulatedOffline;
  }

  /**
   * Enqueue a new mutation to be synced to the central server
   */
  public enqueue(
    entity: SyncEntityType,
    action: 'create' | 'update' | 'delete',
    entityId: string,
    data: any,
    clientMeta?: SyncQueueItem['clientMeta']
  ): SyncQueueItem {
    const item: SyncQueueItem = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      entity,
      action,
      entityId,
      data,
      timestamp: new Date().toISOString(),
      status: 'pending',
      retryCount: 0,
      clientMeta
    };

    // Replace previous pending mutations for same entityId if appropriate
    const existingIdx = this.queue.findIndex(
      (q) => q.entityId === entityId && q.entity === entity && q.status === 'pending'
    );
    if (existingIdx >= 0 && action === 'update') {
      this.queue[existingIdx] = item;
    } else {
      this.queue.unshift(item);
    }

    this.saveState();

    // If online, immediately initiate background sync
    if (this.isOnline() && !this.isSyncing) {
      setTimeout(() => this.sync(), 200);
    }

    return item;
  }

  /**
   * Synchronize pending offline queue with central server
   */
  public async sync(force = false): Promise<{ success: boolean; syncedCount: number; message: string }> {
    if (this.isSyncing) {
      return { success: false, syncedCount: 0, message: 'ማመሳሰል በሂደት ላይ ነው (Sync already in progress)' };
    }

    if (!this.isOnline() && !force) {
      return { success: false, syncedCount: 0, message: 'ከመስመር ውጭ (Offline) - ኢንተርኔት ሲኖር ይመሳሰላል' };
    }

    const pendingItems = this.queue.filter((q) => q.status === 'pending' || q.status === 'failed');
    if (pendingItems.length === 0) {
      // Even with no pending items, update lastSync timestamp by pinging status
      try {
        const res = await fetch('/api/sync/status');
        if (res.ok) {
          this.metadata.lastSyncTime = new Date().toISOString();
          this.metadata.lastSyncStatus = 'success';
          this.saveState();
        }
      } catch (_) {}
      return { success: true, syncedCount: 0, message: 'ሁሉም መረጃዎች ቀድመው ተመሳስለዋል (All data up to date)' };
    }

    this.isSyncing = true;
    this.metadata.lastSyncStatus = 'in_progress';
    this.notifySubscribers();

    // Mark pending as syncing
    pendingItems.forEach((item) => {
      item.status = 'syncing';
    });
    this.saveState();

    try {
      const response = await fetch('/api/sync/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: pendingItems,
          clientUser: 'Shashemene Local Client App',
          clientTimestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const syncedTimestamp = result.serverTimestamp || new Date().toISOString();

      // Mark items as synced
      pendingItems.forEach((item) => {
        item.status = 'synced';
        item.retryCount += 1;
      });

      // Keep recent 30 synced items for auditing/history, prune older
      this.queue = this.queue.filter((q, idx) => q.status !== 'synced' || idx < 30);

      this.metadata.lastSyncTime = syncedTimestamp;
      this.metadata.lastSyncStatus = 'success';
      this.metadata.totalSyncedCount += pendingItems.length;
      this.isSyncing = false;
      this.saveState();

      return {
        success: true,
        syncedCount: pendingItems.length,
        message: `✓ ${pendingItems.length} መረጃዎች ከመካከለኛው ሰርቨር ጋር በተሳካ ሁኔታ ተመሳስለዋል!`
      };
    } catch (error: any) {
      console.warn('Sync push error:', error);
      pendingItems.forEach((item) => {
        item.status = 'failed';
        item.retryCount += 1;
        item.errorMessage = error?.message || 'Connection failed';
      });

      this.metadata.lastSyncStatus = 'failed';
      this.isSyncing = false;
      this.saveState();

      return {
        success: false,
        syncedCount: 0,
        message: `የማመሳሰል ስህተት፡ ${error?.message || 'ከሰርቨሩ ጋር መገናኘት አልተቻለም'}`
      };
    }
  }

  /**
   * Clear synced history items from local cache
   */
  public clearSyncedHistory() {
    this.queue = this.queue.filter((q) => q.status === 'pending' || q.status === 'failed');
    this.saveState();
  }

  /**
   * Export sync queue as JSON bundle for offline USB flash-drive transfer
   */
  public exportOfflineSyncBundle(): string {
    return JSON.stringify(
      {
        bureau: 'Shashemene City Administration Education Bureau',
        bundleType: 'OFFLINE_SYNC_PACKAGE',
        exportedAt: new Date().toISOString(),
        pendingCount: this.getPendingCount(),
        items: this.queue
      },
      null,
      2
    );
  }
}

export const OfflineSyncManager = new OfflineSyncEngine();
