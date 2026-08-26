import React, { useState } from 'react';
import { motion } from 'motion/react';
import { StudentProfile } from '../../types';
import { Sparkles, Zap, AlertCircle, TrendingUp, Calendar, BookOpen, CheckCircle2 } from 'lucide-react';

interface AIInsightsTabProps {
  student: StudentProfile;
}

export const AIInsightsTab: React.FC<AIInsightsTabProps> = React.memo(({ student }) => {
  const [simulatedGrade, setSimulatedGrade] = useState(88);

  const predictedSGPA = (8.9 + (simulatedGrade - 80) * 0.015).toFixed(2);

  const insights = [
    {
      title: 'Attendance Risk Analysis',
      type: 'success',
      desc: 'All enrolled subjects are safely above 85%. No immediate attendance default risk detected.',
      icon: CheckCircle2,
    },
    {
      title: 'GPA Growth Prediction',
      type: 'info',
      desc: 'Maintaining 88+ in Mid-Term exams will boost overall CGPA from 8.90 to 9.15.',
      icon: TrendingUp,
    },
    {
      title: 'Study Planner Recommendation',
      type: 'warning',
      desc: 'Allocate 45 mins daily to CS201 Algorithm Lab Report to avoid last-minute submission penalties.',
      icon: BookOpen,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-4 transform-gpu"
    >
      {/* AI Studio Assistant Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white p-5 rounded-[24px] shadow-lg border border-purple-500/30">
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/30 text-purple-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-fit">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Gemini AI Studio Engine
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-1">
              Personalized AI Intelligence
            </h2>
            <p className="text-xs text-purple-200 font-medium">
              Real-time predictive analytics & academic optimization
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 border border-white/20">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Interactive GPA Simulator */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-[24px] border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <span>Interactive GPA Predictor</span>
        </h3>

        <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-800 dark:text-slate-200">Expected Mid-Term Score: {simulatedGrade}%</span>
            <span className="text-indigo-600 dark:text-indigo-400">Projected SGPA: {predictedSGPA}</span>
          </div>

          <input
            type="range"
            min="60"
            max="100"
            value={simulatedGrade}
            onChange={(e) => setSimulatedGrade(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>

      {/* AI Insights Cards */}
      <div className="space-y-3">
        {insights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-[24px] bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs flex items-start gap-3.5"
            >
              <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
});
