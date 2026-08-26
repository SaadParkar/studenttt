import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ScreenId } from '../types';
import { Sparkles } from 'lucide-react';

interface AuthLoadingScreenProps {
  navigate: (screen: ScreenId) => void;
}

export const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({ navigate }) => {
  useEffect(() => {
    // Instant native boot (<600ms)
    const redirectTimeout = setTimeout(() => {
      navigate('splash');
    }, 600);

    return () => {
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    <div className="w-full min-h-[100dvh] bg-[#F8FAFC] dark:bg-[#060911] text-[#0F172A] dark:text-white flex flex-col justify-between items-center p-6 selection:bg-indigo-500 overflow-hidden font-sans relative select-none">
      {/* Background Soft Aurora Lights */}
      <div className="absolute top-1/4 -left-28 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-28 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Label */}
      <div className="w-full flex justify-between items-center z-10 pt-2 max-w-md">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-2xs backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            CAMPUS OS
          </span>
        </div>

        <button
          onClick={() => navigate('splash')}
          className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
        >
          Skip &rarr;
        </button>
      </div>

      {/* Center Logo Reveal */}
      <div className="flex flex-col items-center text-center z-10 my-auto max-w-md space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[28px] bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 p-1 shadow-[0_16px_40px_rgba(99,102,241,0.35)]">
            <div className="w-full h-full bg-white dark:bg-[#0B132B] rounded-[24px] flex items-center justify-center relative overflow-hidden border border-white/60 dark:border-slate-800 backdrop-blur-xl">
              <Sparkles className="w-12 h-12 text-indigo-600 dark:text-indigo-400 stroke-[2.2] animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Status */}
        <div className="space-y-1">
          <p className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            Initializing Campus OS...
          </p>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-400">
            Intelligent Student Workspace
          </p>
        </div>
      </div>

      {/* Bottom Progress */}
      <div className="w-full max-w-xs z-10 pb-4">
        <div className="w-full bg-slate-200/80 dark:bg-slate-800/80 h-1.5 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
