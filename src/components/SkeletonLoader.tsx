import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'card' | 'line' | 'avatar' | 'chart' | 'banner' | 'grid' | 'table';
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'card',
}) => {
  const shimmerClass =
    'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-indigo-400/10 before:to-transparent';

  if (variant === 'avatar') {
    return (
      <div
        className={`w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800/80 ${shimmerClass} shrink-0 ${className}`}
      />
    );
  }

  if (variant === 'line') {
    return (
      <div
        className={`h-4 bg-slate-200 dark:bg-slate-800/80 rounded-lg ${shimmerClass} ${className}`}
      />
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${className}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs ${shimmerClass}`}
          >
            <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-800/80 rounded-md" />
            <div className="w-3/4 h-6 bg-slate-200 dark:bg-slate-800/80 rounded-md" />
            <div className="w-2/3 h-2.5 bg-slate-100 dark:bg-slate-800/50 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div
        className={`p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs ${shimmerClass} ${className}`}
      >
        <div className="flex justify-between items-center">
          <div className="w-36 h-5 bg-slate-200 dark:bg-slate-800/80 rounded-lg" />
          <div className="w-20 h-5 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full" />
        </div>
        <div className="h-44 w-full bg-slate-100 dark:bg-slate-950/60 rounded-2xl p-4 flex items-end justify-between gap-3 border border-slate-200/50 dark:border-slate-800/50">
          <div className="w-full bg-slate-200 dark:bg-slate-800/80 rounded-t-xl h-[45%]" />
          <div className="w-full bg-indigo-500/30 rounded-t-xl h-[85%]" />
          <div className="w-full bg-slate-200 dark:bg-slate-800/80 rounded-t-xl h-[65%]" />
          <div className="w-full bg-cyan-500/30 rounded-t-xl h-[95%]" />
          <div className="w-full bg-slate-200 dark:bg-slate-800/80 rounded-t-xl h-[55%]" />
        </div>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div
        className={`h-32 w-full bg-gradient-to-r from-slate-200 via-indigo-100/50 to-slate-200 dark:from-slate-900 dark:via-indigo-950/50 dark:to-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs ${shimmerClass} ${className}`}
      />
    );
  }

  return (
    <div
      className={`p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs ${shimmerClass} ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20" />
        <div className="space-y-2 flex-1">
          <div className="w-2/3 h-4 bg-slate-200 dark:bg-slate-800/80 rounded-md" />
          <div className="w-1/3 h-3 bg-slate-100 dark:bg-slate-800/50 rounded-md" />
        </div>
      </div>
      <div className="w-full h-12 bg-slate-100 dark:bg-slate-950/60 rounded-2xl border border-slate-200/50 dark:border-slate-800/50" />
    </div>
  );
};
