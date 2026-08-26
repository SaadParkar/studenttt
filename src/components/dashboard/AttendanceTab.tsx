import React, { useState } from 'react';
import { motion } from 'motion/react';
import { StudentProfile, SubjectAttendance } from '../../types';
import {
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface AttendanceTabProps {
  student: StudentProfile;
  subjects: SubjectAttendance[];
}

export const AttendanceTab: React.FC<AttendanceTabProps> = React.memo(({ student, subjects }) => {
  const [extraClasses, setExtraClasses] = useState(3);
  const [missClasses, setMissClasses] = useState(1);

  // Safe skip calculation: Total attended vs total conducted
  const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
  const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
  // Formula for max skippable classes while staying >= 75%:
  // (attended) / (total + skippable) >= 0.75 => skippable = Math.floor(attended / 0.75 - total)
  const maxSafeSkips = Math.max(0, Math.floor(totalAttended / 0.75 - totalClasses));

  // Projected attendance if attending 'extraClasses'
  const projectedAttendanceWithExtra = (
    ((totalAttended + extraClasses) / (totalClasses + extraClasses)) *
    100
  ).toFixed(1);

  // Projected attendance if missing 'missClasses'
  const projectedAttendanceWithMiss = (
    (totalAttended / (totalClasses + missClasses)) *
    100
  ).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-4 transform-gpu"
    >
      {/* Top Header Card: Apple Activity Rings & Overall Attendance */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white p-5 rounded-[28px] shadow-lg border border-indigo-500/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center sm:text-left">
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              75% Safe Threshold Compliance
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Safe Zone Active ({student.overallAttendance}%)
            </h2>
            <p className="text-xs text-slate-300 font-medium max-w-xs">
              You are {student.overallAttendance - 75}% above the mandatory threshold across all courses.
            </p>
          </div>

          {/* Concentric Progress Rings Visual */}
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Outer Ring: Semester (88.5%) */}
              <circle cx="50" cy="50" r="40" className="stroke-indigo-950" strokeWidth="8" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-indigo-500"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 * (1 - student.overallAttendance / 100)}
                strokeLinecap="round"
                fill="none"
              />

              {/* Middle Ring: Monthly (92%) */}
              <circle cx="50" cy="50" r="28" className="stroke-sky-950" strokeWidth="8" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="28"
                className="stroke-cyan-400"
                strokeWidth="8"
                strokeDasharray="175.8"
                strokeDashoffset={175.8 * (1 - 0.92)}
                strokeLinecap="round"
                fill="none"
              />

              {/* Inner Ring: Weekly (100%) */}
              <circle cx="50" cy="50" r="16" className="stroke-emerald-950" strokeWidth="8" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="16"
                className="stroke-emerald-400"
                strokeWidth="8"
                strokeDasharray="100.5"
                strokeDashoffset={0}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className="text-lg font-black text-white">{student.overallAttendance}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safe Skip Calculator & Attendance Predictor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Safe Skip Calculator */}
        <div className="bg-white dark:bg-slate-800/90 p-4 rounded-[24px] border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Safe Skip Calculator</span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              You can safely skip <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-black">{maxSafeSkips} classes</strong>
            </p>
            <p className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Without falling below the 75% university attendance threshold rule.
            </p>
          </div>
        </div>

        {/* Smart Attendance Predictor Simulator */}
        <div className="bg-white dark:bg-slate-800/90 p-4 rounded-[24px] border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-wide">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Attendance Predictor</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            <div>
              <p className="text-[11px] font-bold text-slate-900 dark:text-white">
                Attend next <span className="text-indigo-600 dark:text-indigo-400 font-black">{extraClasses} classes</span>
              </p>
              <p className="text-[10px] text-slate-500">Projected: <strong className="text-emerald-600">{projectedAttendanceWithExtra}%</strong></p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setExtraClasses(Math.max(1, extraClasses - 1))}
                className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 font-bold text-xs shadow-2xs hover:bg-slate-100 cursor-pointer"
              >
                -
              </button>
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{extraClasses}</span>
              <button
                onClick={() => setExtraClasses(extraClasses + 1)}
                className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 font-bold text-xs shadow-2xs hover:bg-slate-100 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly & Monthly Attendance Trends */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-[24px] border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>Weekly & Monthly Trend Analysis</span>
          </h3>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase">30-Day Audit</span>
        </div>

        {/* Heatmap days */}
        <div className="grid grid-cols-10 gap-1.5 pt-1">
          {Array.from({ length: 30 }, (_, i) => {
            const isMissed = i === 4 || i === 18;
            const isWarning = i === 11;
            return (
              <div
                key={i}
                title={`Day ${i + 1}: ${isMissed ? 'Absent' : 'Present'}`}
                className={`h-6 rounded-md transition-all ${
                  isMissed
                    ? 'bg-rose-500 shadow-xs'
                    : isWarning
                    ? 'bg-amber-400'
                    : 'bg-emerald-500/80 hover:bg-emerald-500'
                }`}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-1">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Attended</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" /> Late</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" /> Missed</span>
        </div>
      </div>

      {/* Subject-Wise Breakdown List */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-[26px] border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <h3 className="text-sm font-black text-slate-900 dark:text-white">
          Course-wise Breakdown ({subjects.length} Subjects)
        </h3>

        <div className="space-y-2.5">
          {subjects.map((sub) => (
            <div
              key={sub.subjectId || sub.code}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    {sub.subjectName}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    {sub.code} • {sub.attended} / {sub.total} Classes Attended
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-black ${
                    sub.percentage >= 85
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : sub.percentage >= 75
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                >
                  {sub.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    sub.percentage >= 85
                      ? 'bg-emerald-500'
                      : sub.percentage >= 75
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${sub.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});
