import React from 'react';
import { motion } from 'motion/react';
import { StudentProfile } from '../../types';
import { Award, ShieldCheck, CheckCircle2, ChevronRight, Layers, GraduationCap } from 'lucide-react';

interface CreditsTabProps {
  student: StudentProfile;
}

export const CreditsTab: React.FC<CreditsTabProps> = React.memo(({ student }) => {
  const categories = [
    { name: 'Core Computer Science', earned: 72, required: 80, color: 'bg-indigo-500' },
    { name: 'Elective Specializations', earned: 24, required: 30, color: 'bg-purple-500' },
    { name: 'Practical & Lab Work', earned: 16, required: 20, color: 'bg-emerald-500' },
    { name: 'Humanities & Management', earned: 6, required: 10, color: 'bg-amber-500' },
  ];

  const earnedPercentage = Math.round((student.totalCredits / student.requiredCredits) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-4 transform-gpu"
    >
      {/* Total Credits & Graduation Progress Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white p-5 rounded-[24px] shadow-lg border border-indigo-500/30">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-fit">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-300" />
              Degree Audit • B.Tech Computer Science
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-1">
              Credit Accumulation Status
            </h2>
            <p className="text-xs text-indigo-200 font-medium">
              {student.totalCredits} of {student.requiredCredits} Total Credits Accumulated
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-cyan-300 border border-white/20">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-black text-white">
            <span>Graduation Readiness</span>
            <span className="text-cyan-300">{earnedPercentage}%</span>
          </div>
          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 h-full rounded-full"
              style={{ width: `${earnedPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Credit Summary Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-center shadow-2xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase">EARNED</span>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {student.totalCredits}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-center shadow-2xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase">REMAINING</span>
          <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
            {student.requiredCredits - student.totalCredits}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-center shadow-2xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase">REQUIRED</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            {student.requiredCredits}
          </p>
        </div>
      </div>

      {/* Credit Distribution Breakdown */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-[24px] border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>Category Credit Distribution</span>
        </h3>

        <div className="space-y-3">
          {categories.map((cat) => {
            const pct = Math.round((cat.earned / cat.required) * 100);
            return (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs font-black text-slate-900 dark:text-white">
                  <span>{cat.name}</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {cat.earned} / {cat.required} Credits ({pct}%)
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
});
