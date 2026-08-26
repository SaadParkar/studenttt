import React from 'react';
import { motion } from 'motion/react';

export const PageSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="p-4 sm:p-5 space-y-5 animate-pulse select-none"
    >
      {/* Header Greeting Skeleton */}
      <div className="flex items-center justify-between bg-white/60 dark:bg-slate-900/60 p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-2">
            <div className="w-28 h-3.5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="w-40 h-4 bg-slate-300 dark:bg-slate-700 rounded-lg" />
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Hero Metric Banner Skeleton */}
      <div className="bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <div className="w-32 h-4 bg-slate-300 dark:bg-slate-700 rounded-lg" />
          <div className="w-16 h-6 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>
        <div className="flex items-baseline gap-3">
          <div className="w-24 h-10 bg-slate-300 dark:bg-slate-700 rounded-xl" />
          <div className="w-32 h-4 bg-slate-300 dark:bg-slate-700 rounded-lg" />
        </div>
        <div className="w-full h-3 bg-slate-300 dark:bg-slate-700 rounded-full" />
      </div>

      {/* Quick Action Grid Skeletons */}
      <div className="space-y-2">
        <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-4 gap-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center gap-2"
            >
              <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="w-12 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Lecture Cards Skeleton */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center">
          <div className="w-36 h-4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="w-16 h-3 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800/80 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
            <div className="w-3/4 h-5 bg-slate-300 dark:bg-slate-700 rounded-lg" />
            <div className="flex gap-4 pt-1">
              <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="w-20 h-3 bg-slate-200 dark:bg-slate-800 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
