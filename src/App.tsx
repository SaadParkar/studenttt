import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { flushSync } from 'react-dom';
import {
  ScreenId,
  StudentProfile,
  StackedHeroCard,
  Lecture,
  Assignment,
  LibraryBook,
  SubjectAttendance,
  SubjectGrade,
  CampusEvent,
  GoalItem,
  NotificationItem,
  OfflineAttendanceRecord,
} from './types';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_HERO_CARDS,
  INITIAL_LECTURES,
  INITIAL_ASSIGNMENTS,
  INITIAL_LIBRARY_BOOKS,
  INITIAL_SUBJECT_ATTENDANCE,
  INITIAL_SUBJECT_GRADES,
  INITIAL_EVENTS,
  INITIAL_GOALS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';

// Layout & Frame Components
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { QRScannerModal } from './components/QRScannerModal';
import { SelectLectureModal } from './components/SelectLectureModal';
import { PageSkeleton } from './components/PageSkeleton';
import { Toast } from './components/Toast';
import { IOSPwaInstallGate } from './components/IOSPwaInstallGate';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { loadFullAppState, saveFullAppState } from './lib/appStatePersistence';
import { motion, AnimatePresence } from 'motion/react';

// Core Screens loaded eagerly for instant interactive boot
import { SplashScreen } from './screens/SplashScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { OtpScreen } from './screens/OtpScreen';
import { AuthLoadingScreen } from './screens/AuthLoadingScreen';
import { ProfileSetupScreen } from './screens/ProfileSetupScreen';
import { AuthSuccessScreen } from './screens/AuthSuccessScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';

// Secondary screens code-split for lightweight memory footprint on mobile
const LiveAttendanceScreen = lazy(() => import('./screens/LiveAttendanceScreen').then((m) => ({ default: m.LiveAttendanceScreen })));
const TodayAttendanceScreen = lazy(() => import('./screens/TodayAttendanceScreen').then((m) => ({ default: m.TodayAttendanceScreen })));
const TimetableScreen = lazy(() => import('./screens/TimetableScreen').then((m) => ({ default: m.TimetableScreen })));
const ClassDetailsScreen = lazy(() => import('./screens/ClassDetailsScreen').then((m) => ({ default: m.ClassDetailsScreen })));
const AssignmentsScreen = lazy(() => import('./screens/AssignmentsScreen').then((m) => ({ default: m.AssignmentsScreen })));
const LibraryScreen = lazy(() => import('./screens/LibraryScreen').then((m) => ({ default: m.LibraryScreen })));
const AnalyticsScreen = lazy(() => import('./screens/AnalyticsScreen').then((m) => ({ default: m.AnalyticsScreen })));
const ResultsScreen = lazy(() => import('./screens/ResultsScreen').then((m) => ({ default: m.ResultsScreen })));
const CreditsScreen = lazy(() => import('./screens/CreditsScreen').then((m) => ({ default: m.CreditsScreen })));
const GoalsScreen = lazy(() => import('./screens/GoalsScreen').then((m) => ({ default: m.GoalsScreen })));
const EventsScreen = lazy(() => import('./screens/EventsScreen').then((m) => ({ default: m.EventsScreen })));
const NotificationsScreen = lazy(() => import('./screens/NotificationsScreen').then((m) => ({ default: m.NotificationsScreen })));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen').then((m) => ({ default: m.ProfileScreen })));
const SettingsScreen = lazy(() => import('./screens/SettingsScreen').then((m) => ({ default: m.SettingsScreen })));

export function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('auth_loading');
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [heroCards, setHeroCards] = useState<StackedHeroCard[]>(INITIAL_HERO_CARDS);
  const [lectures, setLectures] = useState<Lecture[]>(INITIAL_LECTURES);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [books, setBooks] = useState<LibraryBook[]>(INITIAL_LIBRARY_BOOKS);
  const [subjects, setSubjects] = useState<SubjectAttendance[]>(INITIAL_SUBJECT_ATTENDANCE);
  const [grades] = useState<SubjectGrade[]>(INITIAL_SUBJECT_GRADES);
  const [events, setEvents] = useState<CampusEvent[]>(INITIAL_EVENTS);
  const [goals, setGoals] = useState<GoalItem[]>(INITIAL_GOALS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Restore full state from IndexedDB / LocalStorage on app boot
  useEffect(() => {
    loadFullAppState().then((saved) => {
      if (saved) {
        if (saved.activeScreen && saved.activeScreen !== 'auth_loading') {
          setActiveScreen(saved.activeScreen as ScreenId);
        }
        if (typeof saved.isDarkMode === 'boolean') {
          setIsDarkMode(saved.isDarkMode);
        }
        if (Array.isArray(saved.markedLectures) && saved.markedLectures.length > 0) {
          setMarkedLectures(saved.markedLectures);
        }
        if (Array.isArray(saved.offlineQueue)) {
          setOfflineQueue(saved.offlineQueue);
        }
      }
    });
  }, []);

  // Scroll to top automatically when activeScreen changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [activeScreen]);

  // Dark Mode Theme State (Default: Light Theme)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Supabase Realtime Subscription to 'sessions' table for live attendance notifications
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('public:sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sessions' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const sessionData = payload.new;
            if (sessionData && sessionData.status === 'active') {
              showToast('🔔 Live Lecture Session Started! Tap to scan attendance.', 'info');
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // App States & Scans
  const [selectedLecture, setSelectedLecture] = useState<Lecture>(INITIAL_LECTURES[1]); // CS201
  const [markedLectures, setMarkedLectures] = useState<string[]>(['lec-1']);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSelectLectureOpen, setIsSelectLectureOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState<OfflineAttendanceRecord[]>([]);

  const handleNavigate = (nextScreen: ScreenId) => {
    if (nextScreen === activeScreen) return;
    React.startTransition(() => {
      setActiveScreen(nextScreen);
    });
  };

  const handleSelectAndScan = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setIsSelectLectureOpen(false);
    setIsScannerOpen(true);
  };

  // Save full state whenever key state changes
  useEffect(() => {
    if (activeScreen !== 'auth_loading' && activeScreen !== 'splash') {
      saveFullAppState({
        activeScreen,
        isDarkMode,
        markedLectures,
        offlineQueue,
      });
    }
  }, [activeScreen, isDarkMode, markedLectures, offlineQueue]);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(
    null
  );

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const darkCircleRef = React.useRef<HTMLDivElement>(null);
  const lightCircleRef = React.useRef<HTMLDivElement>(null);

  const toggleDarkMode = (e?: React.MouseEvent) => {
    let x = typeof window !== 'undefined' ? window.innerWidth - 40 : 300;
    let y = 40;

    if (e && e.currentTarget) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else if (e && typeof e.clientX === 'number' && e.clientX > 0) {
      x = e.clientX;
      y = e.clientY;
    }

    const xPercent = (x / window.innerWidth) * 100;
    const yPercent = (y / window.innerHeight) * 100;

    document.documentElement.style.setProperty('--toggle-x', `${xPercent}%`);
    document.documentElement.style.setProperty('--toggle-y', `${yPercent}%`);

    const growingCircle = isDarkMode ? lightCircleRef.current : darkCircleRef.current;

    if (growingCircle) {
      growingCircle.classList.remove('grow');
      // trigger reflow
      void growingCircle.offsetWidth;
      growingCircle.classList.add('grow');

      setTimeout(() => {
        flushSync(() => {
          setIsDarkMode(!isDarkMode);
        });
      }, 250);

      setTimeout(() => {
        growingCircle.classList.remove('grow');
      }, 550);
    } else {
      setIsDarkMode(!isDarkMode);
    }

    showToast(!isDarkMode ? 'Dark Mode activated 🌙' : 'Light Mode activated ☀️', 'info');
  };

  const handleUpdateStudent = (updated: Partial<StudentProfile>) => {
    setStudent((prev) => ({ ...prev, ...updated }));
  };

  // Mark Attendance Handler
  const handleAttendanceSuccess = (lectureId: string, offline: boolean) => {
    if (!markedLectures.includes(lectureId)) {
      setMarkedLectures((prev) => [...prev, lectureId]);

      // Update lecture status in list
      setLectures((prev) =>
        prev.map((lec) =>
          lec.id === lectureId
            ? { ...lec, attendanceStatus: 'marked', attendancePercentage: Math.min(100, lec.attendancePercentage + 2) }
            : lec
        )
      );

      // Increment overall attendance
      setStudent((prev) => ({
        ...prev,
        overallAttendance: Math.min(100, prev.overallAttendance + 1),
      }));
    }

    if (offline) {
      const record: OfflineAttendanceRecord = {
        id: `rec-${Date.now()}`,
        lectureId,
        lectureTitle: selectedLecture.title,
        scannedAt: new Date().toLocaleTimeString(),
        qrPayload: `QR_PASS_${lectureId}_${Date.now()}`,
        isSynced: false,
      };
      setOfflineQueue((prev) => [...prev, record]);
      showToast('Attendance Saved Offline! Will auto-sync when online.', 'info');
    } else {
      showToast('Attendance Marked Present & Synced with College Portal! ✓', 'success');
    }
  };

  // Auto sync when coming online
  const handleSyncNow = () => {
    if (offlineQueue.length === 0) {
      showToast('No pending records to sync.', 'info');
      return;
    }
    const count = offlineQueue.length;
    setOfflineQueue([]);
    setIsOffline(false);
    showToast(`Successfully synced ${count} offline attendance records!`, 'success');
  };

  // Assignment submission handler
  const handleSubmitAssignment = (assignmentId: string, fileName: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? {
              ...a,
              status: 'Submitted',
              readinessPercentage: 100,
              submissionFile: fileName,
              submittedAt: 'Just Now',
            }
          : a
      )
    );
    showToast(`Assignment "${fileName}" submitted successfully!`, 'success');
  };

  // Library renewal handler
  const handleRenewBook = (bookId: string) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? {
              ...b,
              daysRemaining: (b.daysRemaining || 0) + 14,
              isDueSoon: false,
              dueDate: 'Nov 20, 2026',
            }
          : b
      )
    );
    showToast('Book renewed for +14 days!', 'success');
  };

  // RSVP Event handler
  const handleToggleRsvp = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              isRsvped: !e.isRsvped,
              attendeesCount: e.isRsvped ? e.attendeesCount - 1 : e.attendeesCount + 1,
            }
          : e
      )
    );
    const ev = events.find((e) => e.id === eventId);
    if (ev && !ev.isRsvped) {
      showToast(`RSVP Confirmed for ${ev.title}!`, 'success');
    } else {
      showToast('RSVP Cancelled.', 'info');
    }
  };

  // Add Goal handler
  const handleAddGoal = (newGoal: GoalItem) => {
    setGoals((prev) => [newGoal, ...prev]);
    showToast('New academic milestone goal created!', 'success');
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    showToast('All notifications marked as read.', 'info');
  };

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  return (
    <IOSPwaInstallGate>
      <div className={`w-full h-[100dvh] min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
        <MobileFrame>
          {/* Toast Notification */}
          {toast && (
            <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
          )}

        {/* Header Bar */}
        <Header
          student={student}
          activeScreen={activeScreen}
          navigate={handleNavigate}
          unreadNotificationsCount={unreadCount}
          isOffline={isOffline}
          offlineQueueCount={offlineQueue.length}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        {/* Main Screen Router Content with Native Smooth Touch Momentum */}
        <main
          ref={mainRef}
          id="main-scroll-container"
          className="flex-1 w-full min-h-0 overflow-y-auto overflow-x-hidden touch-pan-y overscroll-y-contain overscroll-x-none bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white transition-colors relative"
          style={{
            WebkitOverflowScrolling: 'touch',
            paddingBottom: [
              'splash',
              'welcome',
              'login',
              'otp',
              'auth_loading',
              'profile_setup',
              'auth_success',
            ].includes(activeScreen)
              ? '0px'
              : 'calc(5.5rem + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, ease: 'linear' }}
              className="w-full min-h-full"
            >
              <Suspense fallback={<PageSkeleton />}>
                {activeScreen === 'splash' && <SplashScreen navigate={handleNavigate} />}

                {activeScreen === 'welcome' && <WelcomeScreen navigate={handleNavigate} />}

                {activeScreen === 'login' && (
                  <LoginScreen student={student} navigate={handleNavigate} />
                )}

                {activeScreen === 'otp' && (
                  <OtpScreen email={student.email} navigate={handleNavigate} />
                )}

                {activeScreen === 'auth_loading' && (
                  <AuthLoadingScreen navigate={handleNavigate} />
                )}

                {activeScreen === 'profile_setup' && (
                  <ProfileSetupScreen
                    student={student}
                    navigate={handleNavigate}
                    onUpdateStudent={handleUpdateStudent}
                  />
                )}

                {activeScreen === 'auth_success' && (
                  <AuthSuccessScreen student={student} navigate={handleNavigate} />
                )}

                {activeScreen === 'onboarding' && <OnboardingScreen navigate={handleNavigate} />}

                {activeScreen === 'home' && (
                  <HomeScreen
                    student={student}
                    lectures={lectures}
                    assignments={assignments}
                    books={books}
                    subjects={subjects}
                    grades={grades}
                    goals={goals}
                    navigate={handleNavigate}
                    openScannerModal={() => setIsSelectLectureOpen(true)}
                    onSelectLecture={setSelectedLecture}
                    onSubmitAssignment={handleSubmitAssignment}
                    onRenewBook={handleRenewBook}
                    onAddGoal={handleAddGoal}
                  />
                )}

                {activeScreen === 'live_attendance' && (
                  <LiveAttendanceScreen
                    currentLecture={selectedLecture}
                    navigate={handleNavigate}
                    openScannerModal={() => setIsSelectLectureOpen(true)}
                    isOffline={isOffline}
                    markedLectures={markedLectures}
                  />
                )}

                {activeScreen === 'today_attendance' && (
                  <TodayAttendanceScreen
                    lectures={lectures}
                    markedLectures={markedLectures}
                    navigate={handleNavigate}
                    openScannerModal={() => setIsSelectLectureOpen(true)}
                  />
                )}

                {activeScreen === 'timetable' && (
                  <TimetableScreen
                    lectures={lectures}
                    navigate={handleNavigate}
                    onSelectLecture={setSelectedLecture}
                  />
                )}

                {activeScreen === 'class_details' && (
                  <ClassDetailsScreen
                    lecture={selectedLecture}
                    navigate={handleNavigate}
                    openScannerModal={() => setIsSelectLectureOpen(true)}
                  />
                )}

                {activeScreen === 'assignments' && (
                  <AssignmentsScreen
                    assignments={assignments}
                    navigate={handleNavigate}
                    onSubmitAssignment={handleSubmitAssignment}
                  />
                )}

                {activeScreen === 'library' && (
                  <LibraryScreen
                    student={student}
                    books={books}
                    navigate={handleNavigate}
                    onRenewBook={handleRenewBook}
                  />
                )}

                {(activeScreen === 'analytics' || activeScreen === 'attendance_analytics') && (
                  <AnalyticsScreen
                    student={student}
                    lectures={lectures}
                    assignments={assignments}
                    books={books}
                    subjects={subjects}
                    grades={grades}
                    goals={goals}
                    navigate={handleNavigate}
                    openScannerModal={() => setIsSelectLectureOpen(true)}
                    onSelectLecture={setSelectedLecture}
                    onSubmitAssignment={handleSubmitAssignment}
                    onRenewBook={handleRenewBook}
                    onAddGoal={handleAddGoal}
                  />
                )}

                {activeScreen === 'results' && (
                  <ResultsScreen student={student} grades={grades} navigate={handleNavigate} />
                )}

                {activeScreen === 'credits' && (
                  <CreditsScreen student={student} navigate={handleNavigate} />
                )}

                {activeScreen === 'goals' && (
                  <GoalsScreen goals={goals} navigate={handleNavigate} onAddGoal={handleAddGoal} />
                )}

                {activeScreen === 'events' && (
                  <EventsScreen
                    events={events}
                    navigate={handleNavigate}
                    onToggleRsvp={handleToggleRsvp}
                  />
                )}

                {activeScreen === 'notifications' && (
                  <NotificationsScreen
                    notifications={notifications}
                    navigate={handleNavigate}
                    onMarkAllAsRead={handleMarkAllNotificationsRead}
                  />
                )}

                {activeScreen === 'profile' && (
                  <ProfileScreen student={student} navigate={handleNavigate} />
                )}

                {activeScreen === 'settings' && (
                  <SettingsScreen
                    navigate={handleNavigate}
                    isOffline={isOffline}
                    setIsOffline={setIsOffline}
                    autoSync={autoSync}
                    setAutoSync={setAutoSync}
                    offlineQueueCount={offlineQueue.length}
                    onSyncNow={handleSyncNow}
                    isDarkMode={isDarkMode}
                    onToggleDarkMode={toggleDarkMode}
                    isLiveSessionActive={true}
                  />
                )}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Modal 1: Select Lecture Modal prior to scanning */}
        <SelectLectureModal
          isOpen={isSelectLectureOpen}
          onClose={() => setIsSelectLectureOpen(false)}
          lectures={lectures}
          selectedLecture={selectedLecture}
          onSelectAndScan={handleSelectAndScan}
        />

        {/* Modal 2: QR Camera Attendance Scanner Modal */}
        <QRScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          currentLecture={selectedLecture}
          onAttendanceSuccess={handleAttendanceSuccess}
          isOffline={isOffline}
        />

        {/* Bottom Floating Notched Navigation Bar */}
        <BottomNav
          activeScreen={activeScreen}
          navigate={handleNavigate}
          openSelectLectureModal={() => setIsSelectLectureOpen(true)}
          unreadCount={unreadCount}
        />
        {/* Theme Transition Overlays (Circle Grow Animation) */}
        <div className="theme-circle theme-circle--dark" ref={darkCircleRef} />
        <div className="theme-circle theme-circle--light" ref={lightCircleRef} />
      </MobileFrame>
    </div>
    </IOSPwaInstallGate>
  );
}

export default App;
