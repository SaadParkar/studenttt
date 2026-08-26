import React, { useState } from 'react';
import { ScreenId } from '../types';
import { ShieldCheck, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface WelcomeScreenProps {
  navigate: (screen: ScreenId) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigate }) => {
  const [ssoLoading, setSsoLoading] = useState<'google' | 'microsoft' | null>(null);

  const handleGoogleSignIn = () => {
    setSsoLoading('google');
    setTimeout(() => {
      setSsoLoading(null);
      navigate('auth_loading');
    }, 1200);
  };

  const handleMicrosoftSignIn = () => {
    setSsoLoading('microsoft');
    setTimeout(() => {
      setSsoLoading(null);
      navigate('auth_loading');
    }, 1200);
  };

  return (
    <div
      className="w-full min-h-full bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white flex flex-col px-4 sm:px-5 py-4 font-sans relative overflow-y-auto"
      style={{
        paddingTop: 'max(1rem, calc(env(safe-area-inset-top, 0px) + 8px))',
        paddingBottom: 'max(1rem, calc(env(safe-area-inset-bottom, 0px) + 8px))',
      }}
    >
      {/* Background Soft Aurora Light Gradients */}
      <div className="absolute top-0 -left-20 w-80 h-80 bg-indigo-200/40 dark:bg-indigo-950/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-sky-200/40 dark:bg-sky-950/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-sm mx-auto flex justify-between items-center z-10 shrink-0 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8.5 h-8.5 rounded-xl bg-[#6366F1] text-white flex items-center justify-center font-black text-xs shadow-xs">
            OS
          </div>
          <span className="text-sm font-extrabold tracking-tight text-[#0F172A] dark:text-white">Campus OS</span>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800/80 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5" /> Institutional Auth
        </span>
      </div>

      {/* Hero Visual Card */}
      <div className="max-w-sm w-full mx-auto flex-1 flex flex-col justify-center space-y-5 z-10 py-2">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#6366F1] via-[#8B5CF6] to-[#06B6D4] p-0.5 mx-auto shadow-md">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-[#6366F1]" />
            </div>
          </div>
          <h1 className="text-xl sm:text-[24px] font-black tracking-tight text-[#0F172A] dark:text-white">
            Welcome to Campus OS
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto font-medium leading-relaxed">
            SIES College official student portal. Sign in to access live QR attendance, marksheet, and timetable.
          </p>
        </div>

        {/* SSO Options Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={ssoLoading !== null}
            className="w-full h-13 min-h-[50px] bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#0F172A] dark:text-white font-bold px-4 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-2xs flex items-center justify-center gap-3 active:scale-[0.97] transition-all cursor-pointer disabled:opacity-50"
          >
            {ssoLoading === 'google' ? (
              <span className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span className="text-xs sm:text-sm">Continue with Google Workspace</span>
          </button>

          {/* Microsoft Sign In Button */}
          <button
            onClick={handleMicrosoftSignIn}
            disabled={ssoLoading !== null}
            className="w-full h-13 min-h-[50px] bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#0F172A] dark:text-white font-bold px-4 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-2xs flex items-center justify-center gap-3 active:scale-[0.97] transition-all cursor-pointer disabled:opacity-50"
          >
            {ssoLoading === 'microsoft' ? (
              <span className="w-5 h-5 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
            )}
            <span className="text-xs sm:text-sm">Continue with Microsoft 365</span>
          </button>

          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-[#F8FAFC] dark:bg-[#0F172A] px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider absolute">
              OR USE EMAIL
            </span>
          </div>

          {/* Email Login Button */}
          <button
            onClick={() => navigate('login')}
            className="w-full h-13 min-h-[50px] bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white font-bold rounded-2xl text-xs sm:text-sm tracking-wide shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 active:scale-[0.97] transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Sign in with Institutional Email</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 text-center z-10 max-w-sm mx-auto w-full">
        <p className="text-[11px] text-slate-400 font-medium">
          SIES College of Arts, Science & Commerce • Official Portal v2.4
        </p>
      </div>
    </div>
  );
};
