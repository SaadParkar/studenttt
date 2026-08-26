import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ScreenId } from '../types';
import { ShieldCheck, ArrowRight, Smartphone, Zap } from 'lucide-react';

interface SplashScreenProps {
  navigate: (screen: ScreenId) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigate }) => {
  useEffect(() => {
    // Ultra-crisp native launch timing (<750ms reveal)
    const timer = setTimeout(() => {
      navigate('login');
    }, 750);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-full min-h-[100dvh] bg-[#F8FAFC] dark:bg-[#060911] text-[#0F172A] dark:text-white flex flex-col justify-between items-center p-6 selection:bg-indigo-500 overflow-hidden font-sans relative select-none">
      {/* Background Soft Lighting */}
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <div className="w-full flex justify-between items-center z-10 pt-2 max-w-md">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
            CAMPUS OS INSTANCE
          </span>
        </div>

        <button
          onClick={() => navigate('login')}
          className="text-xs font-bold text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          Skip &rarr;
        </button>
      </div>

      {/* Center Hero Glass Card & Identity */}
      <div className="flex flex-col items-center text-center z-10 my-auto max-w-md space-y-6 px-2">
        {/* Fast hardware-accelerated logo entrance (0ms to 250ms) */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center transform-gpu"
        >
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[28px] bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 p-1 shadow-[0_16px_40px_rgba(99,102,241,0.35)] relative overflow-hidden">
            <div className="w-full h-full bg-[#0D1527] rounded-[24px] flex items-center justify-center relative overflow-hidden border border-white/20">
              <img
                src="/campus_os_icon.jpg"
                alt="Campus OS Icon"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[24px]"
              />
            </div>
          </div>
        </motion.div>

        {/* Title & Tagline */}
        <div className="space-y-1.5">
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.25 }}
            className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight"
          >
            Campus OS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.25 }}
            className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 tracking-tight"
          >
            Your Campus. One Intelligent Workspace.
          </motion.p>
        </div>

        {/* Feature Badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="flex items-center gap-2 pt-1"
        >
          <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/80 text-[10.5px] font-extrabold text-indigo-600 dark:text-indigo-300 flex items-center gap-1.5 shadow-2xs">
            <Zap className="w-3 h-3" />
            Live NFC & QR
          </span>
          <span className="px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200/80 dark:border-cyan-800/80 text-[10.5px] font-extrabold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5 shadow-2xs">
            <Smartphone className="w-3 h-3" />
            PWA Standalone
          </span>
        </motion.div>
      </div>

      {/* Bottom Launch CTA */}
      <div className="w-full max-w-xs z-10 pb-4">
        <button
          onClick={() => navigate('login')}
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Open Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
