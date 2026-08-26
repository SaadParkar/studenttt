import React from 'react';
import { motion } from 'motion/react';
import { StudentProfile } from '../../types';
import {
  TrendingUp,
  Trophy,
  BarChart3,
  Sparkles,
  Award,
  Zap,
  Medal,
} from 'lucide-react';

interface PerformanceTabProps {
  student: StudentProfile;
}

export const PerformanceTab: React.FC<PerformanceTabProps> = React.memo(({ student }) => {
  const leaderboard = [
    { rank: 1, name: 'Aarav Patel', cgpa: 9.95, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
    { rank: 2, name: 'Priya Sharma', cgpa: 9.82, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { rank: 3, name: 'Rohan Gupta', cgpa: 9.75, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { rank: 5, name: `${student.name} (You)`, cgpa: student.cgpa, avatar: student.avatarUrl, isUser: true },
  ];

  const subjectComparisons = [
    { name: 'Operating Systems', score: 92, avg: 78, color: 'bg-indigo-500' },
    { name: 'Data Structures & Algo', score: 95, avg: 74, color: 'bg-emerald-500' },
    { name: 'Computer Networks', score: 88, avg: 76, color: 'bg-cyan-500' },
    { name: 'Linear Algebra', score: 90, avg: 72, color: 'bg-purple-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-4 transform-gpu"
    >
      {/* Class Leaderboard & Percentile Header */}
      <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-orange-800 text-white p-5 rounded-[24px] shadow-lg border border-amber-400/30">
        <div className="flex justify-between items-center mb-3">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-fit">
              <Trophy className="w-3 h-3 text-amber-200" />
              Class Percentile Top 4%
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Rank #{student.classRank} of {student.totalStudentsInClass}
            </h2>
            <p className="text-xs text-amber-100 font-medium">
              Honor Roll & Dean's Scholarship Eligible
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
            <Medal className="w-7 h-7 text-amber-200" />
          </div>
        </div>

        {/* Quick Rank Badge */}
        <div className="p-3 rounded-2xl bg-white/10 flex items-center justify-between text-xs border border-white/10">
          <span className="font-semibold text-amber-100">Semester SGPA Growth</span>
          <span className="font-black text-white flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-emerald-300" /> +0.28 vs Sem 1
          </span>
        </div>
      </div>

      {/* Class Leaderboard Snippet */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-[24px] border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Department Batch Leaderboard</span>
        </h3>

        <div className="space-y-2">
          {leaderboard.map((item) => (
            <div
              key={item.rank}
              className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                item.isUser
                  ? 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 ring-2 ring-indigo-500/20'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center ${
                    item.rank === 1
                      ? 'bg-amber-400 text-slate-900'
                      : item.rank === 2
                      ? 'bg-slate-300 text-slate-900'
                      : item.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  #{item.rank}
                </span>

                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />

                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {item.name}
                </span>
              </div>

              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                {item.cgpa} CGPA
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Comparison & Score vs Class Average */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-[24px] border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-500" />
          <span>Your Score vs Class Average</span>
        </h3>

        <div className="space-y-3">
          {subjectComparisons.map((sub) => (
            <div key={sub.name} className="space-y-1">
              <div className="flex justify-between text-xs font-extrabold text-slate-900 dark:text-white">
                <span>{sub.name}</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {sub.score}% (Avg: {sub.avg}%)
                </span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden relative">
                {/* Class average marker line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-900 dark:bg-white z-10"
                  style={{ left: `${sub.avg}%` }}
                />
                {/* User score bar */}
                <div
                  className={`h-full ${sub.color} rounded-full`}
                  style={{ width: `${sub.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Performance Analysis */}
      <div className="p-4 rounded-[24px] bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-black text-slate-900 dark:text-white">
            AI Performance Analysis
          </h4>
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-0.5">
            Your performance in practical labs exceeds 94% of your peers. Maintaining current assignment submission consistency will guarantee a first-class distinction diploma.
          </p>
        </div>
      </div>
    </motion.div>
  );
});
