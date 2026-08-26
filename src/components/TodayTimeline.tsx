import React, { useState, useEffect } from 'react';
import { Lecture, ScreenId } from '../types';
import {
  MapPin,
  User,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  Radio,
  QrCode,
  Check,
  Zap,
} from 'lucide-react';

interface TodayTimelineProps {
  lectures: Lecture[];
  navigate: (screen: ScreenId) => void;
  onSelectLecture: (lec: Lecture) => void;
  openScannerModal?: () => void;
}

const CountdownBadge: React.FC = React.memo(() => {
  const [secondsRemaining, setSecondsRemaining] = useState(1458);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 1458));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} left`;

  return (
    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30 text-[11px] font-mono font-black">
      ⏱ {timeStr}
    </span>
  );
});

export const TodayTimeline: React.FC<TodayTimelineProps> = React.memo(({
  lectures,
  navigate,
  onSelectLecture,
  openScannerModal,
}) => {
  const [isTeacherQrActive, setIsTeacherQrActive] = useState(false);

  return (
    <section className="my-7 space-y-4">
      {/* Header Bar */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-2xs">
            <Radio className="w-5 h-5 stroke-[2.5] animate-pulse text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-[18px] sm:text-[20px] font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 leading-none">
              <span>Today&apos;s Live Timeline</span>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </h2>
            <p className="text-[12px] font-bold text-slate-500 dark:text-slate-400 mt-1">
              Tuesday, Aug 11 • Semester 5 Schedule
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('timetable')}
          className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1 shadow-2xs transition-all active:scale-95 min-h-[44px]"
        >
          <span>Full Schedule</span>
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Timeline List with Connecting Vertical Beam */}
      <div className="relative space-y-5 pl-1">
        {/* Continuous Dynamic Connecting Axis Line */}
        <div className="absolute left-[3.9rem] sm:left-[4.2rem] top-6 bottom-6 w-[3px] bg-gradient-to-b from-emerald-500 via-indigo-600 via-amber-400 to-slate-200 dark:to-slate-800 rounded-full z-0 opacity-90 shadow-2xs" />

        {lectures.map((lec, index) => {
          const isCurrent = lec.status === 'current';
          const isCompleted = lec.status === 'completed' || lec.attendanceStatus === 'marked';

          const timeParts = (lec.startTime || '').split(' ');
          const displayTime = timeParts[0] || lec.startTime;
          const period = timeParts[1] || (index >= 2 ? 'PM' : 'AM');

          return (
            <div key={lec.id} className="flex items-start gap-3.5 sm:gap-4 relative z-10 group">
              {/* Left Timestamp Column */}
              <div className="w-13 sm:w-14 shrink-0 pt-3 flex flex-col items-start justify-center">
                <span
                  className={`text-sm sm:text-[15px] font-black tracking-tight leading-none ${
                    isCompleted
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : isCurrent
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {displayTime}
                </span>
                <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                  {period}
                </span>
              </div>

              {/* Status Node Marker */}
              <div className="pt-2.5 shrink-0 flex items-center justify-center relative">
                {isCompleted ? (
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 ring-4 ring-emerald-100 dark:ring-emerald-950/80 transition-transform group-hover:scale-110 z-10">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <div className="relative flex items-center justify-center z-10">
                    <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-indigo-400 opacity-60"></span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-indigo-600/50 ring-4 ring-indigo-200 dark:ring-indigo-950 z-10">
                      <Zap className="w-4 h-4 fill-white stroke-none" />
                    </div>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-500 text-amber-500 flex items-center justify-center shadow-xs ring-4 ring-white dark:ring-[#0F172A] z-10">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                  </div>
                )}
              </div>

              {/* Lecture Card Component */}
              <div
                onClick={() => {
                  onSelectLecture(lec);
                  navigate('class_details');
                }}
                className={`flex-1 rounded-3xl p-4 sm:p-5 transition-all cursor-pointer relative overflow-hidden flex flex-col gap-3 active:scale-[0.99] border ${
                  isCurrent
                    ? 'bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-slate-900/10 dark:from-indigo-950/80 dark:via-indigo-900/40 dark:to-slate-900/90 border-indigo-500/80 dark:border-indigo-500/60 shadow-xl shadow-indigo-500/15 ring-2 ring-indigo-500/20'
                    : isCompleted
                    ? 'bg-white dark:bg-slate-900/90 border-emerald-500/30 dark:border-emerald-800/40 shadow-xs hover:shadow-md'
                    : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Top Row: Course Badge + Live Status */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider border ${
                        isCurrent
                          ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border-indigo-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {lec.subjectCode || `CS-${101 + index}`}
                    </span>

                    {isCurrent && (
                      <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-300" /> LIVE CLASS
                      </span>
                    )}
                  </div>

                  {isCompleted ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> PRESENT
                    </span>
                  ) : isCurrent ? (
                    <CountdownBadge />
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> UPCOMING
                    </span>
                  )}
                </div>

                {/* Subject Name */}
                <h3 className="text-[15.5px] sm:text-[17px] font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                  {lec.title}
                </h3>

                {/* Location & Professor Row */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[13px] font-bold text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-xl">
                      <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>{lec.room}</span>
                    </span>

                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{lec.professor}</span>
                    </span>
                  </div>

                  {/* Live Actions if Current Class */}
                  {isCurrent && (
                    <div className="flex items-center gap-2 ml-auto pt-1 sm:pt-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsTeacherQrActive((prev) => !prev);
                        }}
                        className={`h-10 px-3 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center gap-1 min-h-[44px] ${
                          isTeacherQrActive
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                        }`}
                        title="Simulate Faculty Live QR Generation"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>{isTeacherQrActive ? 'Teacher QR Active ✓' : 'Teacher: QR'}</span>
                      </button>

                      <button
                        disabled={!isTeacherQrActive}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isTeacherQrActive) {
                            if (openScannerModal) openScannerModal();
                            else navigate('live_attendance');
                          }
                        }}
                        className={`h-10 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 min-h-[44px] ${
                          isTeacherQrActive
                            ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-600/30 hover:opacity-90 cursor-pointer active:scale-95'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <QrCode className="w-4 h-4" />
                        <span>{isTeacherQrActive ? 'Scan QR Code' : 'Scan QR'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});
