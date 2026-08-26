import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Rocket,
  Wifi,
  Shield,
  Share2,
  PlusSquare,
  Sparkles,
  Lock,
  ChevronRight,
  Star,
  Search,
  BookOpen,
  Copy,
  PartyPopper,
  Zap,
} from 'lucide-react';

interface IOSPwaInstallGateProps {
  children: React.ReactNode;
}

export const IOSPwaInstallGate: React.FC<IOSPwaInstallGateProps> = ({ children }) => {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // Default true so desktop & Android pass freely
  const [devBypass, setDevBypass] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userAgent = window.navigator.userAgent || '';
    const isIOSDevice =
      /iPhone|iPad|iPod/i.test(userAgent) ||
      (window.navigator.maxTouchPoints > 1 && /Macintosh/i.test(userAgent));

    const standaloneMode =
      (window.navigator as any).standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches;

    setIsIOS(isIOSDevice);
    setIsStandalone(standaloneMode);
  }, []);

  // If user is on iOS AND NOT running in standalone mode (and dev bypass not toggled)
  const shouldBlockIOS = isIOS && !isStandalone && !devBypass;

  if (shouldBlockIOS) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#070913] text-white font-sans flex flex-col items-center justify-between p-4 sm:p-6 overflow-y-auto select-none pt-safe-header pb-safe-nav">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-72 bg-gradient-to-b from-purple-600/15 via-indigo-600/10 to-transparent pointer-events-none blur-3xl" />

        <div className="relative z-10 w-full max-w-md mx-auto space-y-5 my-auto py-2">
          {/* 1. Top Pill Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#131528] border border-indigo-500/30 text-indigo-300 text-[11px] font-mono font-black tracking-widest uppercase shadow-xs">
              <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400 animate-pulse" />
              <span>PWA READY</span>
            </div>
          </div>

          {/* 2. Main Title & Subtitle */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Add Campus OS to{' '}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
                Your iPhone
              </span>
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-300 font-medium leading-relaxed max-w-xs mx-auto">
              Install Campus OS as a native app for the best experience with offline access and full features.
            </p>
          </div>

          {/* 3. Three Feature Badges Grid */}
          <div className="grid grid-cols-3 gap-2">
            {/* Badge 1 */}
            <div className="bg-[#0E1122] border border-slate-800/80 rounded-xl p-2.5 text-center flex flex-col items-center justify-center space-y-1">
              <Rocket className="w-4 h-4 text-indigo-400 shrink-0" />
              <h4 className="text-[11px] font-black text-white leading-none">Super Fast</h4>
              <p className="text-[9px] text-slate-400 font-medium leading-tight">Launch instantly like a native app</p>
            </div>

            {/* Badge 2 */}
            <div className="bg-[#0E1122] border border-slate-800/80 rounded-xl p-2.5 text-center flex flex-col items-center justify-center space-y-1">
              <Wifi className="w-4 h-4 text-[#5EEAD4] shrink-0" />
              <h4 className="text-[11px] font-black text-white leading-none">Works Offline</h4>
              <p className="text-[9px] text-slate-400 font-medium leading-tight">Access your data even without internet</p>
            </div>

            {/* Badge 3 */}
            <div className="bg-[#0E1122] border border-slate-800/80 rounded-xl p-2.5 text-center flex flex-col items-center justify-center space-y-1">
              <Shield className="w-4 h-4 text-purple-400 shrink-0" />
              <h4 className="text-[11px] font-black text-white leading-none">Secure & Private</h4>
              <p className="text-[9px] text-slate-400 font-medium leading-tight">Your data stays protected</p>
            </div>
          </div>

          {/* 4. Vertical Steps List (Steps 1, 2, 3, 4) */}
          <div className="space-y-3 relative">
            {/* Step 1 */}
            <div className="bg-[#0E1122] border border-slate-800/90 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 relative">
              <div className="flex items-start gap-3 flex-1 min-w-0 w-full">
                <div className="w-7 h-7 rounded-full bg-[#2A1B54] border border-purple-500/40 text-purple-200 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-black text-purple-300">Tap the Share Icon</h3>
                  <p className="text-[11px] text-slate-300 font-medium mt-0.5 leading-snug">
                    Tap the <Share2 className="inline w-3 h-3 text-purple-400 mx-0.5" /> icon at the bottom of your Safari browser.
                  </p>
                </div>
              </div>

              {/* Step 1 Visual Box */}
              <div className="w-full sm:w-48 bg-[#14182E] border border-purple-500/30 rounded-xl p-2 flex items-center justify-around shrink-0">
                <span className="text-slate-500 font-bold text-xs">&lt;</span>
                <span className="text-slate-500 font-bold text-xs">&gt;</span>
                <div className="w-7 h-7 rounded-full bg-purple-600/40 border border-purple-400 flex items-center justify-center text-purple-200 shadow-xs shadow-purple-500/30 animate-pulse">
                  <Share2 className="w-3.5 h-3.5" />
                </div>
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <Copy className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>

            {/* Vertical Connector Line 1 */}
            <div className="w-0.5 h-3 border-l-2 border-dashed border-purple-500/30 ml-7 -my-2.5 relative z-0" />

            {/* Step 2 */}
            <div className="bg-[#0E1122] border border-slate-800/90 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 relative">
              <div className="flex items-start gap-3 flex-1 min-w-0 w-full">
                <div className="w-7 h-7 rounded-full bg-[#2A1B54] border border-purple-500/40 text-purple-200 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-black text-purple-300">
                    Scroll & Tap &quot;Add to Home Screen&quot;
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium mt-0.5 leading-snug">
                    In the share menu, scroll down and tap on &quot;Add to Home Screen&quot;.
                  </p>
                </div>
              </div>

              {/* Step 2 Visual Box */}
              <div className="w-full sm:w-48 bg-[#14182E] border border-slate-800 rounded-xl p-1.5 space-y-1 text-[10.5px] shrink-0 font-medium">
                <div className="flex items-center justify-between text-slate-400 px-1.5 py-0.5">
                  <span>Add to Favorites</span>
                  <Star className="w-3 h-3 text-slate-500" />
                </div>
                <div className="flex items-center justify-between text-slate-400 px-1.5 py-0.5">
                  <span>Find on Page</span>
                  <Search className="w-3 h-3 text-slate-500" />
                </div>
                <div className="flex items-center justify-between bg-purple-950/80 border border-purple-500/60 rounded-lg px-2 py-1 text-white font-bold shadow-xs">
                  <span className="text-purple-200">Add to Home Screen</span>
                  <PlusSquare className="w-3.5 h-3.5 text-purple-300" />
                </div>
              </div>
            </div>

            {/* Vertical Connector Line 2 */}
            <div className="w-0.5 h-3 border-l-2 border-dashed border-purple-500/30 ml-7 -my-2.5 relative z-0" />

            {/* Step 3 */}
            <div className="bg-[#0E1122] border border-slate-800/90 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 relative">
              <div className="flex items-start gap-3 flex-1 min-w-0 w-full">
                <div className="w-7 h-7 rounded-full bg-[#1E1B4B] border border-indigo-500/40 text-indigo-200 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-black text-indigo-300">Tap &quot;Add&quot;</h3>
                  <p className="text-[11px] text-slate-300 font-medium mt-0.5 leading-snug">
                    Review the app name and tap &quot;Add&quot; in the top-right corner.
                  </p>
                </div>
              </div>

              {/* Step 3 Visual Box */}
              <div className="w-full sm:w-48 bg-[#14182E] border border-slate-800 rounded-xl p-2 space-y-1.5 shrink-0">
                <div className="flex items-center justify-between text-[10px] font-bold border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Cancel</span>
                  <span className="text-white">Add to Home Screen</span>
                  <span className="text-indigo-400 font-black">Add</span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/campus_os_icon.jpg"
                    alt="Campus OS"
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-md object-cover border border-white/20"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black text-white truncate">Campus OS</p>
                    <p className="text-[8.5px] text-slate-400 truncate">https://campus-os.ai.studio</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vertical Connector Line 3 */}
            <div className="w-0.5 h-3 border-l-2 border-dashed border-emerald-500/30 ml-7 -my-2.5 relative z-0" />

            {/* Step 4 */}
            <div className="bg-[#0E1122] border border-slate-800/90 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 relative">
              <div className="flex items-start gap-3 flex-1 min-w-0 w-full">
                <div className="w-7 h-7 rounded-full bg-[#064E3B] border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  4
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-black text-emerald-400">Enjoy Campus OS!</h3>
                  <p className="text-[11px] text-slate-300 font-medium mt-0.5 leading-snug">
                    Campus OS is now added to your Home Screen. Launch and enjoy the full app experience!
                  </p>
                </div>
              </div>

              {/* Step 4 Visual Box */}
              <div className="w-full sm:w-48 bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D111E] border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-center relative overflow-hidden shrink-0 h-22">
                <div className="flex flex-col items-center justify-center space-y-1 z-10">
                  <div className="relative">
                    <img
                      src="/campus_os_icon.jpg"
                      alt="Campus OS"
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-xl object-cover shadow-lg border border-purple-400/50"
                    />
                    {/* Pointer Arrow */}
                    <div className="absolute -bottom-2 -right-3 text-emerald-400 font-black animate-bounce text-sm">
                      ↗
                    </div>
                  </div>
                  <span className="text-[9.5px] font-black text-white">Campus OS</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Bottom Success Box */}
          <div className="bg-[#0E1122] border border-slate-800/90 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 fill-indigo-400 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">That&apos;s it! You&apos;re all set.</h4>
                <p className="text-[11px] text-slate-400 font-medium">
                  Campus OS will now work like a native app on your iPhone.
                </p>
              </div>
            </div>
            <div className="text-xl shrink-0">🎉</div>
          </div>

          {/* Developer / Web Preview Bypass Button */}
          <div className="flex flex-col items-center gap-2 pt-1">
            <button
              onClick={() => setDevBypass(true)}
              className="w-full py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/60 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Continue in Web Browser</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Your data is secure and always protected.</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
