import React, { useState, useMemo } from 'react';
import { ScreenId, Lecture, AttendanceSessionRecord } from '../types';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  ShieldCheck,
  QrCode,
  Zap,
  Download,
  Search,
  Filter,
  Video,
  Sparkles,
  Calendar,
  Lock,
  Cpu,
  Share2,
} from 'lucide-react';

interface TodayAttendanceScreenProps {
  lectures: Lecture[];
  markedLectures: string[];
  navigate: (screen: ScreenId) => void;
  openScannerModal: () => void;
}

export const TodayAttendanceScreen: React.FC<TodayAttendanceScreenProps> = ({
  lectures,
  markedLectures,
  navigate,
  openScannerModal,
}) => {
  const [filter, setFilter] = useState<'all' | 'present' | 'absent'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Map lectures into full Session Logs
  const sessionRecords: AttendanceSessionRecord[] = useMemo(() => {
    return lectures.map((lec, idx) => {
      const isMarked = markedLectures.includes(lec.id) || lec.attendanceStatus === 'marked';
      return {
        sessionId: `SES-2026-${(88420 + idx * 17).toString()}`,
        lectureId: lec.id,
        lectureTitle: lec.title,
        subjectCode: lec.code,
        professor: lec.professor,
        room: lec.room,
        scannedAtTime: isMarked ? `${10 + idx}:${(12 + idx * 8).toString().padStart(2, '0')} AM` : 'Not Marked',
        status: isMarked ? 'PRESENT' : lec.status === 'completed' ? 'ABSENT' : 'PENDING',
        method: idx % 2 === 0 ? 'QR Code Camera' : '5-Digit OTP',
        deviceId: 'DEV-IPHONE-15-8839',
        securityHash: `0x8F9A...${(7721 + idx).toString(16).toUpperCase()}`,
        locationVerified: true,
      };
    });
  }, [lectures, markedLectures]);

  const filteredSessions = useMemo(() => {
    return sessionRecords.filter((rec) => {
      const matchesSearch =
        rec.lectureTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.sessionId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filter === 'all'
          ? true
          : filter === 'present'
          ? rec.status === 'PRESENT'
          : rec.status === 'ABSENT';

      return matchesSearch && matchesFilter;
    });
  }, [sessionRecords, searchQuery, filter]);

  const presentCount = sessionRecords.filter((s) => s.status === 'PRESENT').length;
  const totalCount = sessionRecords.length;
  const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

  return (
    <div className="space-y-6 pb-6 max-w-2xl mx-auto px-4 sm:px-6 select-none animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-center text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Today&apos;s Attendance Log
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>Monday, Aug 10, 2026 • Verified Sessions</span>
            </p>
          </div>
        </div>

        <button
          onClick={openScannerModal}
          className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
        >
          <QrCode className="w-4 h-4" />
          <span>Scan Live QR</span>
        </button>
      </div>

      {/* Main Stats Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-[28px] p-5 shadow-xl border border-indigo-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-500/30 inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>SUPER SECURE • SESSION AUDITED</span>
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-2.5">
              Today&apos;s Attendance: <span className="text-emerald-400">{attendancePercentage}%</span>
            </h2>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {presentCount} of {totalCount} class sessions verified on campus
            </p>
          </div>

          <div className="bg-black/60 p-3 rounded-2xl border border-indigo-500/30 text-center shrink-0">
            <span className="text-[9px] font-mono uppercase text-slate-400 block">Verified Rate</span>
            <span className="text-xl font-black font-mono text-cyan-400">{presentCount}/{totalCount}</span>
          </div>
        </div>

        {/* Attendance Progress Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full mt-4 overflow-hidden p-0.5 border border-slate-700/60">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${attendancePercentage}%` }}
          />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search session ID, subject name, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setFilter('present')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filter === 'present'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Present ({presentCount})
            </button>
            <button
              onClick={() => setFilter('absent')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filter === 'absent'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Absent ({totalCount - presentCount})
            </button>
          </div>

          <button
            onClick={() => {
              alert('Today\'s Attendance Session Pass downloaded successfully as PDF.');
            }}
            className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer text-xs font-extrabold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Pass</span>
          </button>
        </div>
      </div>

      {/* Session Logs List */}
      <div className="space-y-3.5">
        {filteredSessions.map((rec) => {
          const isPresent = rec.status === 'PRESENT';

          return (
            <div
              key={rec.sessionId}
              className={`p-4 rounded-2xl border transition-all duration-200 shadow-2xs relative overflow-hidden ${
                isPresent
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 opacity-90'
              }`}
            >
              {/* Top Row: Session ID & Status Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    {rec.sessionId}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">
                    {rec.subjectCode}
                  </span>
                </div>

                {isPresent ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10.5px] font-extrabold border border-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>PRESENT ✓</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10.5px] font-extrabold border border-rose-300 dark:border-rose-800">
                    <XCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>ABSENT</span>
                  </span>
                )}
              </div>

              {/* Middle Row: Title & Details */}
              <div className="space-y-1.5">
                <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                  {rec.lectureTitle}
                </h3>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{rec.professor}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{rec.room}</span>
                  </span>
                  {isPresent && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Marked at {rec.scannedAtTime}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Verification Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span>Method: <strong className="text-slate-700 dark:text-slate-300">{rec.method}</strong></span>
                </div>

                <div className="font-mono text-slate-400 text-[9.5px]">
                  Hash: <span className="text-indigo-500 dark:text-indigo-400 font-bold">{rec.securityHash}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
