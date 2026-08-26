/**
 * Device ID Management for Campus OS Student App
 * 
 * - iOS / Web (PWA): Generates a persistent UUID on first launch, saved in IndexedDB & localStorage.
 *   Persists across logout/login on the same phone.
 * - Android (Capacitor APK): Reads real hardware device identifier when Capacitor Device plugin is present.
 */

const DEVICE_ID_KEY = 'campus_os_student_device_id';

export async function getPersistentDeviceId(): Promise<string> {
  // Check if Capacitor Device plugin is available (Android APK build)
  if (typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform()) {
    try {
      const Device = (window as any).Capacitor.Plugins?.Device;
      if (Device && typeof Device.getId === 'function') {
        const info = await Device.getId();
        if (info && info.identifier) {
          return `android-cap-${info.identifier}`;
        }
      }
    } catch (e) {
      console.warn('Capacitor Device plugin lookup fallback:', e);
    }
  }

  // 1. Check localStorage cache
  let existingId = localStorage.getItem(DEVICE_ID_KEY);
  if (existingId) {
    return existingId;
  }

  // 2. Check IndexedDB as secondary persistent fallback
  try {
    const idbValue = await getFromIndexedDB(DEVICE_ID_KEY);
    if (idbValue) {
      localStorage.setItem(DEVICE_ID_KEY, idbValue);
      return idbValue;
    }
  } catch (err) {
    console.warn('IndexedDB read error:', err);
  }

  // 3. Generate new persistent UUID for this device
  const newDeviceId = generateUUID();
  localStorage.setItem(DEVICE_ID_KEY, newDeviceId);
  
  try {
    await saveToIndexedDB(DEVICE_ID_KEY, newDeviceId);
  } catch (err) {
    console.warn('IndexedDB write error:', err);
  }

  return newDeviceId;
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `device-ios-${crypto.randomUUID()}`;
  }
  return `device-pwa-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

// Simple IndexedDB Helpers
function getFromIndexedDB(key: string): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve(null);
    const req = indexedDB.open('CampusOS_DB', 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore('device_store');
    };
    req.onsuccess = () => {
      const db = req.result;
      try {
        const tx = db.transaction('device_store', 'readonly');
        const store = tx.objectStore('device_store');
        const getReq = store.get(key);
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    };
    req.onerror = () => resolve(null);
  });
}

function saveToIndexedDB(key: string, value: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve();
    const req = indexedDB.open('CampusOS_DB', 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore('device_store');
    };
    req.onsuccess = () => {
      const db = req.result;
      try {
        const tx = db.transaction('device_store', 'readwrite');
        const store = tx.objectStore('device_store');
        store.put(value, key);
        tx.oncomplete = () => resolve();
      } catch {
        resolve();
      }
    };
    req.onerror = () => resolve();
  });
}
