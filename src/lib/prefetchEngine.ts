/**
 * Campus OS Smart Idle Prefetching Engine
 * Prefetches and pre-warms data structures for the next logically accessed screens
 * (Timetable, Assignments, Analytics, Library) while the user is idle on the Home screen.
 */

import { ScreenId, Lecture, Assignment, LibraryBook } from '../types';

export interface PrefetchedCache {
  timetable: {
    days: Array<{ day: string; date: string; lectureCount: number }>;
    todayLectures: Lecture[];
    upcomingCount: number;
    timestamp: number;
  };
  assignments: {
    pending: Assignment[];
    submitted: Assignment[];
    urgentCount: number;
    timestamp: number;
  };
  analytics: {
    cgpaSummary: string;
    attendanceRatio: number;
    timestamp: number;
  };
  library: {
    activeBooks: LibraryBook[];
    timestamp: number;
  };
}

class PrefetchEngineManager {
  private cache: Partial<PrefetchedCache> = {};
  private prefetchStatus: 'idle' | 'prefetching' | 'prefetched' = 'idle';
  private idleTimer: any = null;
  private listeners: Array<(status: 'idle' | 'prefetching' | 'prefetched') => void> = [];

  public getStatus() {
    return this.prefetchStatus;
  }

  public subscribe(listener: (status: 'idle' | 'prefetching' | 'prefetched') => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.prefetchStatus));
  }

  /**
   * Called when Home Screen mounts or activeScreen becomes 'home'.
   * Listens for user idle state and triggers background prefetching.
   */
  public registerIdlePrefetch(
    lectures: Lecture[],
    assignments: Assignment[],
    books: LibraryBook[]
  ) {
    this.clearIdleTimer();

    // Start 1.2 second idle timer for background prefetching
    const executePrefetch = () => {
      if (this.prefetchStatus === 'prefetched') return;

      this.prefetchStatus = 'prefetching';
      this.notify();

      // Use requestIdleCallback if available, or fallback to setTimeout
      const task = () => {
        const start = performance.now();

        // 1. Prefetch & Warm Timetable Matrix
        const days = [
          { day: 'MON', date: '12', lectureCount: lectures.length },
          { day: 'TUE', date: '13', lectureCount: lectures.length },
          { day: 'WED', date: '14', lectureCount: lectures.length },
          { day: 'THU', date: '15', lectureCount: lectures.length - 1 },
          { day: 'FRI', date: '16', lectureCount: lectures.length - 2 },
        ];

        this.cache.timetable = {
          days,
          todayLectures: [...lectures],
          upcomingCount: lectures.filter((l) => l.status === 'upcoming').length,
          timestamp: Date.now(),
        };

        // 2. Prefetch & Sort Assignments Data
        const pending = assignments.filter((a) => a.status === 'Pending');
        const submitted = assignments.filter((a) => a.status === 'Submitted' || a.status === 'Completed');
        const urgentCount = pending.filter((a) => a.dueDate?.toLowerCase().includes('tomorrow') || a.dueDate?.toLowerCase().includes('today')).length;

        this.cache.assignments = {
          pending,
          submitted,
          urgentCount,
          timestamp: Date.now(),
        };

        // 3. Prefetch Analytics & Library Summaries
        this.cache.analytics = {
          cgpaSummary: '3.88 / 4.0',
          attendanceRatio: 92.4,
          timestamp: Date.now(),
        };

        this.cache.library = {
          activeBooks: books.filter((b) => b.status === 'borrowed'),
          timestamp: Date.now(),
        };

        const elapsed = (performance.now() - start).toFixed(2);
        console.log(`[Campus OS PrefetchEngine] Warm-cached Timetable, Assignments & Analytics in ${elapsed}ms`);

        this.prefetchStatus = 'prefetched';
        this.notify();
      };

      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(task, { timeout: 2000 });
      } else {
        setTimeout(task, 100);
      }
    };

    this.idleTimer = setTimeout(executePrefetch, 1200);
  }

  public clearIdleTimer() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  public getCache(): Partial<PrefetchedCache> {
    return this.cache;
  }

  public isScreenPrefetched(screenId: ScreenId): boolean {
    if (screenId === 'timetable') return !!this.cache.timetable;
    if (screenId === 'assignments') return !!this.cache.assignments;
    if (screenId === 'attendance_analytics' || screenId === 'results') return !!this.cache.analytics;
    if (screenId === 'library') return !!this.cache.library;
    return false;
  }
}

export const prefetchEngine = new PrefetchEngineManager();
