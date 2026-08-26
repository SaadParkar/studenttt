/**
 * Full App State Persistence Engine using IndexedDB & LocalStorage
 * Restores screen ID, theme, form drafts, and user state seamlessly across browser refreshes.
 */

const DB_NAME = 'CampusOS_AppState_DB';
const STORE_NAME = 'app_state';
const STATE_KEY = 'campus_os_saved_state';

export interface SavedAppState {
  activeScreen: string;
  isDarkMode: boolean;
  markedLectures: string[];
  offlineQueue: any[];
  selectedSemester: string;
  formDrafts?: Record<string, any>;
  lastUpdated: string;
}

export async function saveFullAppState(state: Partial<SavedAppState>): Promise<void> {
  try {
    const existing = (await loadFullAppState()) || ({} as Partial<SavedAppState>);
    const merged: SavedAppState = {
      activeScreen: state.activeScreen || existing.activeScreen || 'home',
      isDarkMode: state.isDarkMode ?? existing.isDarkMode ?? false,
      markedLectures: state.markedLectures || existing.markedLectures || ['lec-1'],
      offlineQueue: state.offlineQueue || existing.offlineQueue || [],
      selectedSemester: state.selectedSemester || existing.selectedSemester || 'Sem 6',
      formDrafts: state.formDrafts || existing.formDrafts || {},
      lastUpdated: new Date().toISOString(),
    };

    // Fast localStorage fallback
    localStorage.setItem(STATE_KEY, JSON.stringify(merged));

    // Persistent IndexedDB
    if (typeof indexedDB !== 'undefined') {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE_NAME)) {
          req.result.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => {
        const db = req.result;
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          tx.objectStore(STORE_NAME).put(merged, STATE_KEY);
        } catch (e) {
          console.warn('IDB write failed:', e);
        }
      };
    }
  } catch (err) {
    console.warn('Failed to save app state:', err);
  }
}

export async function loadFullAppState(): Promise<SavedAppState | null> {
  // 1. Try LocalStorage
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed as SavedAppState;
      }
    }
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }

  // 2. Try IndexedDB
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve(null);
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE_NAME)) {
        req.result.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => {
      const db = req.result;
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const getReq = tx.objectStore(STORE_NAME).get(STATE_KEY);
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    };
    req.onerror = () => resolve(null);
  });
}
