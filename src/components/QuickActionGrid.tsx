import React from 'react';
import { ScreenId } from '../types';
import {
  CalendarRange,
  FileCheck2,
  BookMarked,
  CheckCircle2,
  QrCode,
  Award,
  ArrowUpRight,
} from 'lucide-react';

interface QuickActionGridProps {
  navigate: (screen: ScreenId) => void;
  openScanner: () => void;
}

export const QuickActionGrid: React.FC<QuickActionGridProps> = React.memo(({ navigate }) => {
  const actions = [
    {
      id: 'timetable',
      label: 'Timetable',
      sublabel: 'Daily schedule',
      tag: 'CALENDAR',
      icon: <CalendarRange className="w-6 h-6 text-sky-600 dark:text-sky-400 stroke-[2.3]" />,
      gradient: 'from-sky-500/15 via-sky-500/5 to-transparent',
      borderColor: 'border-sky-200/80 dark:border-sky-900/60',
      badgeColor: 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300',
      screen: 'timetable' as ScreenId,
    },
    {
      id: 'assignments',
      label: 'Assignments',
      sublabel: 'Pending tasks',
      tag: 'TASKS',
      icon: <FileCheck2 className="w-6 h-6 text-rose-600 dark:text-rose-400 stroke-[2.3]" />,
      gradient: 'from-rose-500/15 via-rose-500/5 to-transparent',
      borderColor: 'border-rose-200/80 dark:border-rose-900/60',
      badgeColor: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300',
      screen: 'assignments' as ScreenId,
    },
    {
      id: 'library',
      label: 'E-Library',
      sublabel: 'Books & passes',
      tag: 'BOOKS',
      icon: <BookMarked className="w-6 h-6 text-indigo-600 dark:text-indigo-400 stroke-[2.3]" />,
      gradient: 'from-indigo-500/15 via-indigo-500/5 to-transparent',
      borderColor: 'border-indigo-200/80 dark:border-indigo-900/60',
      badgeColor: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300',
      screen: 'library' as ScreenId,
    },
    {
      id: 'today_log',
      label: "Today's Log",
      sublabel: 'Attendance check',
      tag: 'ATTENDANCE',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 stroke-[2.3]" />,
      gradient: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-200/80 dark:border-emerald-900/60',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300',
      screen: 'today_attendance' as ScreenId,
    },
    {
      id: 'attendance',
      label: 'Live QR',
      sublabel: 'Instant check-in',
      tag: 'SCANNER',
      icon: <QrCode className="w-6 h-6 text-violet-600 dark:text-violet-400 stroke-[2.3]" />,
      gradient: 'from-violet-500/15 via-violet-500/5 to-transparent',
      borderColor: 'border-violet-200/80 dark:border-violet-900/60',
      badgeColor: 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300',
      screen: 'live_attendance' as ScreenId,
    },
    {
      id: 'grades',
      label: 'Results & GPA',
      sublabel: 'Score metrics',
      tag: 'ACADEMICS',
      icon: <Award className="w-6 h-6 text-amber-600 dark:text-amber-400 stroke-[2.3]" />,
      gradient: 'from-amber-500/15 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-200/80 dark:border-amber-900/60',
      badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300',
      screen: 'results' as ScreenId,
    },
  ];

  return (
    <section className="my-6 px-0.5">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-3.5">
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] sm:text-[20px] font-black text-slate-900 dark:text-white tracking-tight">
            Quick Access
          </h2>
          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700">
            6 Shortcuts
          </span>
        </div>
        <button
          onClick={() => navigate('settings')}
          className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1 min-h-[44px] min-w-[44px] justify-end"
        >
          <span>Customize</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* 2-Column Responsive Card Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
        {actions.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.screen)}
            className={`relative flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br ${item.gradient} bg-white dark:bg-slate-900 border ${item.borderColor} shadow-xs hover:shadow-md group active:scale-[0.98] transition-all cursor-pointer overflow-hidden min-h-[82px] text-left`}
          >
            {/* Left Icon Container */}
            <div className="w-12 h-12 rounded-2xl bg-white/95 dark:bg-slate-800/95 shadow-xs border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              {item.icon}
            </div>

            {/* Right Text Stack */}
            <div className="min-w-0 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className={`text-[9.5px] font-black px-1.5 py-0.2 rounded ${item.badgeColor} uppercase tracking-wider`}
                >
                  {item.tag}
                </span>
              </div>
              <span className="text-[14.5px] sm:text-[15.5px] font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight truncate">
                {item.label}
              </span>
              <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {item.sublabel}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
});

