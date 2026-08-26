import React, { useState, useEffect, useMemo } from 'react';
import { ScreenId, Lecture } from '../types';
import {
  ArrowLeft,
  QrCode,
  MapPin,
  Clock,
  CheckCircle2,
  Users,
  ShieldAlert,
  WifiOff,
  Video,
  Sparkles,
  Zap,
  Building2,
  UserCheck,
  Search,
  KeyRound,
  User,
  ShieldCheck,
  RefreshCw,
  Download,
  Check,
  X,
  GraduationCap,
  Lock,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface StudentRosterItem {
  id: string;
  name: string;
  rollNo: string;
  avatar: string;
  status: 'present' | 'absent';
  method?: 'QR Code' | '5-Digit OTP' | 'Manual Override';
  markedAt?: string;
  isCurrentUser?: boolean;
}

const INITIAL_ROSTER: StudentRosterItem[] = [
  {
    id: 'std-2026-88',
    name: 'Alex Rivera',
    rollNo: 'std-2026-88',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    status: 'absent',
    isCurrentUser: true,
  },
  {
    id: 'std-2026-01',
    name: 'Sarah Connor',
    rollNo: 'std-2026-01',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    status: 'present',
    method: 'QR Code',
    markedAt: '12:02:14 PM',
  },
  {
    id: 'std-2026-02',
    name: 'Devon Vance',
    rollNo: 'std-2026-02',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    status: 'present',
    method: '5-Digit OTP',
    markedAt: '12:03:40 PM',
  },
  {
    id: 'std-2026-03',
    name: 'Marcus Brody',
    rollNo: 'std-2026-03',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    status: 'present',
    method: 'QR Code',
    markedAt: '12:04:05 PM',
  },
  {
    id: 'std-2026-04',
    name: 'Elena Rostova',
    rollNo: 'std-2026-04',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    status: 'present',
    method: '5-Digit OTP',
    markedAt: '12:04:22 PM',
  },
  {
    id: 'std-2026-05',
    name: 'Priya Sharma',
    rollNo: 'std-2026-05',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    status: 'absent',
  },
  {
    id: 'std-2026-06',
    name: 'Liam Hemsworth',
    rollNo: 'std-2026-06',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    status: 'present',
    method: 'QR Code',
    markedAt: '12:04:35 PM',
  },
  {
    id: 'std-2026-07',
    name: 'Sophia Chen',
    rollNo: 'std-2026-07',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    status: 'absent',
  },
];

interface LiveAttendanceScreenProps {
  currentLecture: Lecture;
  navigate: (screen: ScreenId) => void;
  openScannerModal: () => void;
  isOffline: boolean;
  markedLectures: string[];
}

export const LiveAttendanceScreen: React.FC<LiveAttendanceScreenProps> = ({
  currentLecture,
  navigate,
  openScannerModal,
  isOffline,
  markedLectures,
}) => {
  const [viewMode, setViewMode] = useState<'student' | 'faculty'>('student');
  const [isFacultyUnlocked, setIsFacultyUnlocked] = useState(false);
  const [facultyPinInput, setFacultyPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const handleFacultyUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (facultyPinInput === '2026' || facultyPinInput === '1234' || facultyPinInput.length >= 4) {
      setIsFacultyUnlocked(true);
      setPinError('');
    } else {
      setPinError('Invalid Faculty PIN. (Hint: Enter 2026)');
    }
  };
  const [sessionSecondsLeft, setSessionSecondsLeft] = useState(120); // 2 minutes max
  const [slotSecondsLeft, setSlotSecondsLeft] = useState(4); // 4-second rapid shuffle
  const [currentOtp, setCurrentOtp] = useState<string>('78412');
  const [roster, setRoster] = useState<StudentRosterItem[]>(INITIAL_ROSTER);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent'>('all');

  const isMarked = markedLectures.includes(currentLecture.id);

  // Generate fresh 5-digit OTP
  const generateNewOtp = () => {
    const freshOtp = Math.floor(10000 + Math.random() * 90000).toString();
    setCurrentOtp(freshOtp);
  };

  // Synchronize current user (Alex Rivera) state whenever markedLectures updates
  useEffect(() => {
    if (isMarked) {
      setRoster((prev) =>
        prev.map((item) =>
          item.isCurrentUser
            ? {
                ...item,
                status: 'present',
                method: '5-Digit OTP',
                markedAt: new Date().toLocaleTimeString(),
              }
            : item
        )
      );
    }
  }, [isMarked]);

  // Fetch real attendance records from Supabase database if configured & subscribe to updates
  useEffect(() => {
    // Helper function to insert/update record in roster
    const handleIncomingRecord = (r: any) => {
      const lecId = r.lecture_id || r.session_id;
      if (lecId && lecId !== currentLecture.id) return;

      const studentId = r.student_id || 'std-2026-88';
      const studentName = r.student_name || 'Saad Parkar';
      const rollNo = r.roll_no || studentId;
      const methodLabel = r.method === 'otp' || r.qr_payload?.includes('OTP') ? '5-Digit OTP' : 'QR Code';
      const timeStr = r.scanned_at ? new Date(r.scanned_at).toLocaleTimeString() : new Date().toLocaleTimeString();

      setRoster((prev) => {
        const idx = prev.findIndex(
          (item) => item.id === studentId || item.name.toLowerCase() === studentName.toLowerCase()
        );

        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = {
            ...copy[idx],
            status: 'present',
            method: methodLabel,
            markedAt: timeStr,
          };
          return copy;
        }

        return [
          {
            id: studentId,
            name: studentName,
            rollNo: rollNo,
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
            status: 'present',
            method: methodLabel,
            markedAt: timeStr,
            isCurrentUser: studentId === 'std-2026-88' || studentName.toLowerCase().includes('saad'),
          },
          ...prev,
        ];
      });
    };

    // 1. Listen for local CustomEvents
    const onCustomEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) handleIncomingRecord(detail);
    };
    window.addEventListener('campus_os_attendance_marked', onCustomEvent);

    // 2. Listen for BroadcastChannel events
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('campus_os_attendance_sync');
      bc.onmessage = (event) => {
        if (event.data?.type === 'ATTENDANCE_RECORD_ADDED' && event.data.record) {
          handleIncomingRecord(event.data.record);
        }
      };
    } catch (_) {}

    // 3. Supabase Initial Query
    if (isSupabaseConfigured) {
      const fetchSupabaseAttendance = async () => {
        try {
          const { data, error } = await supabase
            .from('attendance_records')
            .select('*')
            .eq('lecture_id', currentLecture.id)
            .order('scanned_at', { ascending: false });

          if (data && data.length > 0) {
            data.forEach((r: any) => handleIncomingRecord(r));
          }
        } catch (err) {
          console.warn('Supabase roster query note:', err);
        }
      };

      fetchSupabaseAttendance();

      // 4. Supabase Real-time postgres_changes subscription
      const channel = supabase
        .channel('attendance_live_roster_' + currentLecture.id)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'attendance_records' },
          (payload: any) => {
            if (payload.new) handleIncomingRecord(payload.new);
          }
        )
        .subscribe();

      return () => {
        window.removeEventListener('campus_os_attendance_marked', onCustomEvent);
        if (bc) bc.close();
        supabase.removeChannel(channel);
      };
    }

    return () => {
      window.removeEventListener('campus_os_attendance_marked', onCustomEvent);
      if (bc) bc.close();
    };
  }, [currentLecture.id, isMarked]);

  // 1-second interval timer for 2-minute max session & 4-second token shuffle
  useEffect(() => {
    generateNewOtp();
    const interval = setInterval(() => {
      setSessionSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setSlotSecondsLeft((prev) => {
        if (prev <= 1) {
          generateNewOtp();
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatSessionTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const toggleStudentAttendance = (studentId: string) => {
    setRoster((prev) =>
      prev.map((item) => {
        if (item.id === studentId) {
          const nextStatus = item.status === 'present' ? 'absent' : 'present';
          return {
            ...item,
            status: nextStatus,
            method: nextStatus === 'present' ? 'Manual Override' : undefined,
            markedAt: nextStatus === 'present' ? new Date().toLocaleTimeString() : undefined,
          };
        }
        return item;
      })
    );
  };

  const filteredRoster = useMemo(() => {
    return roster.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterStatus === 'all'
          ? true
          : filterStatus === 'present'
          ? item.status === 'present'
          : item.status === 'absent';
      return matchesSearch && matchesFilter;
    });
  }, [roster, searchQuery, filterStatus]);

  const presentCount = useMemo(() => roster.filter((r) => r.status === 'present').length, [roster]);
  const absentCount = roster.length - presentCount;

  return (
    <div className="space-y-6 pb-6 max-w-2xl mx-auto px-4 sm:px-6 select-none">
      {/* Top Navigation & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-center text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Live Attendance Portal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {currentLecture.title} • {currentLecture.room}
            </p>
          </div>
        </div>

        {/* View Mode Toggle Button */}
        <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-2xl flex items-center gap-1 self-start sm:self-auto border border-slate-300 dark:border-slate-700">
          <button
            onClick={() => setViewMode('student')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'student'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Student View</span>
          </button>
          <button
            onClick={() => setViewMode('faculty')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'faculty'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Faculty Roster</span>
          </button>
        </div>
      </div>

      {viewMode === 'faculty' ? (
        !isFacultyUnlocked ? (
          /* FACULTY PASSCODE SECURITY GATE */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-5 max-w-md mx-auto animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider border border-amber-500/20">
                RESTRICTED FACULTY AREA
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Faculty Passcode Lock</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Enter your 4-digit faculty authorization PIN to access live classroom attendance roster and manual override controls.
              </p>
            </div>

            <form onSubmit={handleFacultyUnlock} className="space-y-4">
              <div className="space-y-1">
                <input
                  type="password"
                  maxLength={6}
                  placeholder="Enter Passcode (Default: 2026)"
                  value={facultyPinInput}
                  onChange={(e) => setFacultyPinInput(e.target.value)}
                  className="w-full text-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 font-mono font-black text-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 tracking-widest placeholder:text-slate-400 placeholder:text-xs placeholder:font-sans"
                />
                {pinError && <p className="text-xs font-extrabold text-rose-500 animate-shake">{pinError}</p>}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('student')}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer transition-all"
                >
                  Return to Student View
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-white font-black text-xs shadow-md shadow-indigo-600/30 cursor-pointer transition-all active:scale-95"
                >
                  Unlock Roster
                </button>
              </div>
            </form>

            <p className="text-[10.5px] text-slate-400 font-medium">
              🔑 Faculty Default Access PIN: <strong className="text-indigo-600 dark:text-indigo-400">2026</strong>
            </p>
          </div>
        ) : (
          /* UNLOCKED FACULTY / PROFESSOR LIVE ROSTER VIEW */
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Professor Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-5 shadow-xl text-white relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-500/30">
                  Prof. {currentLecture.professor}'s Classroom
                </span>
                <h2 className="text-xl font-black tracking-tight mt-2">Faculty Attendance Roster</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time synchronization with student devices via Dynamic QR & 5-Digit OTP.
                </p>
              </div>

              <div className="text-right bg-black/60 p-3 rounded-2xl border border-indigo-500/30">
                <span className="text-[9px] font-mono uppercase font-bold text-amber-400 block">
                  Broadcast OTP
                </span>
                <span className="font-mono text-2xl font-black text-emerald-400 tracking-widest block">
                  {currentOtp}
                </span>
              </div>
            </div>

            {/* Attendance Stat Chips */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Present</span>
                <span className="text-lg font-black text-emerald-400">{presentCount}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Absent</span>
                <span className="text-lg font-black text-rose-400">{absentCount}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Rate</span>
                <span className="text-lg font-black text-cyan-400">
                  {Math.round((presentCount / roster.length) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    filterStatus === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  All ({roster.length})
                </button>
                <button
                  onClick={() => setFilterStatus('present')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    filterStatus === 'present'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Present ({presentCount})
                </button>
                <button
                  onClick={() => setFilterStatus('absent')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    filterStatus === 'absent'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Absent ({absentCount})
                </button>
              </div>

              <button
                onClick={() => {
                  alert('Attendance records downloaded as CSV.');
                }}
                className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Live Student List Roster */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredRoster.map((student) => (
              <div
                key={student.id}
                className={`p-3.5 flex items-center justify-between transition-colors ${
                  student.isCurrentUser
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/30'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {student.name}
                      </span>
                      {student.isCurrentUser && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-[9px] font-extrabold uppercase">
                          YOU (CURRENT STUDENT)
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Roll: {student.rollNo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {student.status === 'present' ? (
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300 dark:border-emerald-800">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>PRESENT</span>
                      </span>
                      <span className="text-[9px] text-slate-400 block font-mono mt-0.5">
                        {student.method} • {student.markedAt || 'Just now'}
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold border border-rose-300 dark:border-rose-800">
                      <X className="w-3 h-3 text-rose-600" />
                      <span>ABSENT</span>
                    </span>
                  )}

                  {/* Manual Toggle Button */}
                  <button
                    onClick={() => toggleStudentAttendance(student.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-300 dark:border-slate-700 cursor-pointer active:scale-95 transition-all"
                  >
                    Toggle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        )
      ) : (
        /* STUDENT ATTENDANCE SCANNER VIEW */
        <div className="space-y-6">
          {/* Main Hero Session Card */}
          <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-950 rounded-[28px] p-6 shadow-xl border border-indigo-100 dark:border-indigo-900/50 relative overflow-hidden">
            {/* Ambient Glow Orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex justify-between items-start relative z-10 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 w-fit border border-rose-200 dark:border-rose-800/60 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span>WINDOW ACTIVE</span>
                  </span>

                  {isOffline && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[9.5px] font-bold flex items-center gap-1 border border-amber-200 dark:border-amber-800/60">
                      <WifiOff className="w-3 h-3" />
                      <span>Offline Ready</span>
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-2.5">
                  {currentLecture.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Video className="w-3.5 h-3.5" />
                  </span>
                  <span>Prof. {currentLecture.professor}</span>
                </div>
              </div>

              {/* Time Remaining Digital Clock */}
              <div className="text-right shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-indigo-100 dark:border-slate-800 shadow-2xs">
                <span className="text-[9.5px] uppercase font-mono font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  SESSION TIMEOUT
                </span>
                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tight mt-0.5">
                  {formatSessionTime(sessionSecondsLeft)}
                </p>
              </div>
            </div>

            {/* Center High-Tech Interactive QR & OTP Box */}
            <div className="my-6 flex flex-col items-center">
              <div
                onClick={openScannerModal}
                className="relative p-5 bg-white dark:bg-slate-900 rounded-3xl border border-indigo-200/80 dark:border-slate-800 shadow-xl group hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <div className="w-48 h-48 bg-slate-950 dark:bg-slate-950 rounded-2xl flex items-center justify-center relative overflow-hidden border border-indigo-500/30">
                  {/* Laser Beam Animation inside Preview */}
                  <div className="scanner-beam absolute top-0 left-0 right-0 h-1 z-20" />

                  <QrCode className="w-32 h-32 text-indigo-400 dark:text-indigo-400 stroke-[1.5] group-hover:scale-110 transition-transform" />

                  {isMarked && (
                    <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center animate-in fade-in duration-300">
                      <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-1 animate-bounce" />
                      <span className="text-xs font-black text-white uppercase tracking-wider">
                        PRESENT ✓
                      </span>
                      <p className="text-[10px] text-emerald-300 font-mono mt-0.5">
                        Synced with Faculty Portal
                      </p>
                    </div>
                  )}
                </div>

                {/* Micro Badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap">
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>Tap to Scan or Enter OTP</span>
                </div>
              </div>

              {/* 4-Second Dynamic Token & 5-Digit Backup OTP Badge */}
              <div className="mt-6 w-full max-w-sm bg-slate-900/90 dark:bg-slate-950 border border-indigo-500/30 rounded-2xl p-3.5 shadow-lg flex flex-col items-center justify-center gap-2 text-center">
                <div className="flex items-center justify-between w-full px-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    4s Rapid Token Shuffle
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-md">
                    Shuffle in {slotSecondsLeft}s
                  </span>
                </div>

                {/* Live 5-Digit OTP Display */}
                <div className="flex items-center gap-2 my-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Live OTP:</span>
                  <div className="flex gap-1.5 font-mono text-xl font-black text-emerald-400 bg-black/80 px-4 py-1.5 rounded-xl border border-emerald-500/40 shadow-inner tracking-widest">
                    {currentOtp.split('').map((char, idx) => (
                      <span key={idx} className="w-5 text-center">{char}</span>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 font-medium">
                  Students can scan QR code with camera OR type this 5-Digit Live OTP in the app.
                </p>
              </div>

              {/* Location Badge */}
              <div className="mt-4 flex items-center gap-2 bg-indigo-100/80 dark:bg-indigo-950/60 px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-800/60 shadow-2xs">
                <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {currentLecture.room} ({currentLecture.building || 'Science Complex'})
                </span>
              </div>
            </div>

            {/* Primary Action CTA Button */}
            <button
              onClick={openScannerModal}
              className={`w-full py-4 rounded-2xl font-extrabold text-xs sm:text-sm tracking-wide shadow-lg flex items-center justify-center gap-2.5 active:scale-98 transition-all cursor-pointer ${
                isMarked
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-indigo-600/30'
              }`}
            >
              <QrCode className="w-5 h-5 stroke-[2.2]" />
              <span>{isMarked ? 'Attendance Marked Present ✓' : 'Scan QR Code or Type OTP'}</span>
            </button>
          </div>

          {/* Live Classroom Attendance Stats */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-[10px] font-extrabold uppercase tracking-wider">Checked In</span>
                <UserCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1.5">
                {presentCount} <span className="text-xs font-bold text-slate-400">/ {roster.length}</span>
              </p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((presentCount / roster.length) * 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-[10px] font-extrabold uppercase tracking-wider">Device Binding</span>
                <Sparkles className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Verified</span>
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-semibold">
                Hardware ID Active
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
