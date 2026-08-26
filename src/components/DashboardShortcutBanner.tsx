import React from 'react';
import { ScreenId, StudentProfile } from '../types';
import { LayoutDashboard, ArrowRight, TrendingUp, Sparkles, Award } from 'lucide-react';

interface DashboardShortcutBannerProps {
  navigate: (screen: ScreenId) => void;
  student?: StudentProfile;
}

export const DashboardShortcutBanner: React.FC<DashboardShortcutBannerProps> = ({
  navigate,
  student,
}) => {
  return (
    <div
      onClick={() => navigate('attendance_analytics')}
      className="relative group overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 dark:from-indigo-950 dark:via-purple-950/80 dark:to-slate-900 text-white p-3.5 sm:p-4 border border-indigo-400/30 dark:border-indigo-500/40 shadow-md shadow-indigo-500/15 hover:shadow-indigo-500/25 active:scale-[0.99] transition-all cursor-pointer select-none"
    >
      {/* Background Ambient Glow Orbs */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-purple-400/25 dark:bg-purple-500/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
      <div className="absolute -left-8 -top-8 w-28 h-28 bg-indigo-400/20 dark:bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />

      {/* Content Layout */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        {/* Left Icon & Text */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Small Icon Badge */}
          <div className="w-10 h-10 rounded-xl bg-white/20 dark:bg-indigo-500/30 border border-white/30 dark:border-indigo-400/40 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <LayoutDashboard className="w-5 h-5 stroke-[2.2] text-white" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[14px] sm:text-[15px] font-black tracking-tight text-white leading-tight">
                Dashboard & Analytics
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-white/20 dark:bg-indigo-500/40 text-white backdrop-blur-xs border border-white/20">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                <span>LIVE METRICS</span>
              </span>
            </div>

            <p className="text-[11px] font-medium text-indigo-100/90 dark:text-indigo-200/80 truncate mt-0.5">
              Real-time attendance trends, CGPA & academic stats
            </p>

            {student && (
              <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold text-indigo-100">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-300" />
                  <span>{student.overallAttendance}% Attendance</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-indigo-300/60" />
                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-300" />
                  <span>{student.cgpa} CGPA</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right CTA Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate('attendance_analytics');
          }}
          className="px-3.5 py-2 rounded-xl bg-white text-indigo-950 dark:bg-indigo-500 dark:text-white font-black text-[11.5px] sm:text-[12px] flex items-center gap-1.5 shadow-sm group-hover:bg-indigo-50 dark:group-hover:bg-indigo-400 transition-all shrink-0 cursor-pointer"
        >
          <span>Open</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
