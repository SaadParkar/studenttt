import React, { useEffect } from 'react';
import { ScreenId, StudentProfile } from '../types';
import { CheckCircle2, Sparkles, Award, ArrowRight } from 'lucide-react';

interface AuthSuccessScreenProps {
  student: StudentProfile;
  navigate: (screen: ScreenId) => void;
}

export const AuthSuccessScreen: React.FC<AuthSuccessScreenProps> = ({ student, navigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('home');
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="w-full min-h-full bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white flex flex-col justify-between items-center px-5 font-sans relative overflow-y-auto"
      style={{
        paddingTop: 'max(1.25rem, calc(env(safe-area-inset-top, 0px) + 12px))',
        paddingBottom: 'max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 12px))',
      }}
    >
      {/* Background Soft Aurora Light Gradients */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-200/40 dark:bg-emerald-950/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-200/40 dark:bg-indigo-950/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full flex justify-end items-center z-10 max-w-sm">
        <span className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-200 dark:border-emerald-800/80 shadow-2xs">
          AUTH SUCCESSFUL
        </span>
      </div>

      {/* Main Success Visual */}
      <div className="flex flex-col items-center text-center z-10 space-y-6 my-auto max-w-sm w-full py-4">
        {/* Animated Green Checkmark Ring */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border-4 border-emerald-400 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-lg animate-bounce">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-[26px] font-black tracking-tight text-[#0F172A] dark:text-white">
            Welcome, {student.name}!
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-300 font-medium">
            Your Campus OS session is active & synchronized
          </p>
        </div>

        {/* Quick Academic Card */}
        <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-2xs w-full grid grid-cols-2 gap-3 text-center">
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Overall Attendance</span>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{student.overallAttendance}%</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current CGPA</span>
            <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{student.cgpa}</p>
          </div>
        </div>

        <button
          onClick={() => navigate('home')}
          className="w-full h-13 min-h-[50px] bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white font-bold rounded-2xl text-xs sm:text-sm tracking-wide shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 active:scale-[0.97] transition-all cursor-pointer"
        >
          <span>Launching Dashboard...</span>
          <ArrowRight className="w-4.5 h-4.5 animate-pulse" />
        </button>
      </div>

      <div className="pt-2 text-center z-10 max-w-sm mx-auto w-full">
        <p className="text-[11px] text-slate-400 font-medium">
          SIES College of Arts, Science & Commerce • Official Portal v2.4
        </p>
      </div>
    </div>
  );
};
