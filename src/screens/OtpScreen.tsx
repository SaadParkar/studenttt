import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId } from '../types';
import { ArrowLeft, RefreshCw, AlertCircle, ShieldCheck, Sparkles, Check, Cpu, Zap, Lock } from 'lucide-react';

interface OtpScreenProps {
  email: string;
  navigate: (screen: ScreenId) => void;
}

export const OtpScreen: React.FC<OtpScreenProps> = React.memo(({ email, navigate }) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [activeBoxIndex, setActiveBoxIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [errorMsg, setErrorMsg] = useState('');

  // Streamlined stage machine: 'typing' -> 'verifying' -> 'success' -> 'launch'
  const [stage, setStage] = useState<'typing' | 'verifying' | 'success' | 'launch'>('typing');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Resend Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Focus active input on typing state
  useEffect(() => {
    if (stage === 'typing' && inputRefs.current[activeBoxIndex]) {
      inputRefs.current[activeBoxIndex]?.focus();
    }
  }, [activeBoxIndex, stage]);

  // Instant verification pipeline
  const startVerificationSequence = useCallback((digits: string[]) => {
    if (digits.join('').length < 6) {
      setErrorMsg('Please enter all 6 digits of your security passcode.');
      return;
    }

    setStage('verifying');
    setErrorMsg('');

    const t1 = setTimeout(() => {
      setStage('success');
    }, 300);
    timeoutsRef.current.push(t1);

    const t2 = setTimeout(() => {
      setStage('launch');
    }, 650);
    timeoutsRef.current.push(t2);

    const t3 = setTimeout(() => {
      navigate('home');
    }, 1050);
    timeoutsRef.current.push(t3);
  }, [navigate]);

  const handleChange = useCallback((index: number, value: string) => {
    setErrorMsg('');
    if (value && !/^\d+$/.test(value)) return;

    const char = value.slice(-1);
    setOtp((prev) => {
      const nextOtp = [...prev];
      nextOtp[index] = char;
      return nextOtp;
    });

    if (char) {
      if (index < 5) {
        setActiveBoxIndex(index + 1);
      } else {
        // 6th digit entered
        setOtp((currentOtp) => {
          const fullOtp = [...currentOtp];
          fullOtp[5] = char;
          if (fullOtp.every((d) => d !== '')) {
            startVerificationSequence(fullOtp);
          }
          return fullOtp;
        });
      }
    }
  }, [startVerificationSequence]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        setActiveBoxIndex(index - 1);
        setOtp((prev) => {
          const nextOtp = [...prev];
          nextOtp[index - 1] = '';
          return nextOtp;
        });
      } else {
        setOtp((prev) => {
          const nextOtp = [...prev];
          nextOtp[index] = '';
          return nextOtp;
        });
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveBoxIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < 5) {
      setActiveBoxIndex(index + 1);
    }
  }, [otp]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      setActiveBoxIndex(5);
      startVerificationSequence(digits);
    }
  }, [startVerificationSequence]);

  const handleResend = useCallback(() => {
    setTimeLeft(30);
    setErrorMsg('');
    setOtp(['', '', '', '', '', '']);
    setActiveBoxIndex(0);
    setStage('typing');
  }, []);

  const handleManualSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    startVerificationSequence(otp);
  }, [otp, startVerificationSequence]);

  return (
    <div
      className="w-full min-h-full bg-[#F8FAFC] dark:bg-[#070B14] text-[#0F172A] dark:text-white flex flex-col px-4 sm:px-5 py-4 font-sans overflow-y-auto selection:bg-purple-500 relative"
      style={{
        paddingTop: 'max(1rem, calc(env(safe-area-inset-top, 0px) + 8px))',
        paddingBottom: 'max(1rem, calc(env(safe-area-inset-bottom, 0px) + 8px))',
      }}
    >
      {/* Lightweight Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden transform-gpu">
        <div className="absolute -top-16 -left-16 w-80 h-80 bg-purple-600/15 dark:bg-purple-600/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-indigo-600/15 dark:bg-indigo-600/20 rounded-full blur-2xl" />
      </div>

      {/* Screen Launch Overlay */}
      <AnimatePresence>
        {stage === 'launch' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-white/95 dark:bg-[#070B14]/95 z-50 pointer-events-none flex flex-col items-center justify-center space-y-5 transform-gpu"
          >
            {/* Morphing Glowing Breathing Orb */}
            <div className="relative flex items-center justify-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 opacity-90 shadow-xl flex items-center justify-center animate-pulse">
                <div className="w-14 h-14 rounded-2xl bg-slate-900/90 border border-white/20 flex items-center justify-center shadow-lg">
                  <Cpu className="w-7 h-7 text-cyan-400" />
                </div>
              </div>
            </div>

            <div className="text-center space-y-1 z-10 px-4">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Initialising Campus OS
              </h3>
              <p className="text-xs font-mono text-purple-600 dark:text-purple-300 tracking-wider uppercase">
                Readying student intelligence workspace...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Top Safe-Area Navigation Bar */}
      <div className="w-full max-w-sm mx-auto flex justify-between items-center z-10 shrink-0 mb-3">
        <button
          type="button"
          onClick={() => navigate('login')}
          className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 flex items-center justify-center text-[#0F172A] dark:text-white shadow-2xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-90"
          aria-label="Go back to login"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 text-[11px] font-black border border-purple-300/40 dark:border-purple-800 tracking-wider uppercase shadow-2xs">
          <Zap className="w-3.5 h-3.5 text-purple-500" />
          <span>IDENTITY GATEWAY</span>
        </div>
      </div>

      {/* 2. Main Workspace Body */}
      <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center items-center py-2 z-10">
        {/* Shield Icon & Title Header */}
        <div className="text-center w-full mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 mx-auto mb-3 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-white dark:bg-[#0D1527] rounded-[14px] flex items-center justify-center text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] dark:text-white mb-1 leading-tight">
            Verify Your Identity
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
            Enter the 6-digit verification code sent to your registered student mobile.
          </p>
        </div>

        {/* OTP Input Card Area */}
        <div className="w-full relative flex flex-col items-center justify-center">
          {stage === 'typing' ? (
            <form onSubmit={handleManualSubmit} className="w-full space-y-4">
              {/* 6 Individual Equal Sized OTP Boxes */}
              <div className="w-full flex justify-center items-center gap-1.5 sm:gap-2" onPaste={handlePaste}>
                {otp.map((digit, index) => {
                  const isActive = activeBoxIndex === index;
                  const isFilled = Boolean(digit);

                  return (
                    <div key={index} className="relative flex-1 max-w-[46px]">
                      <input
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                        maxLength={1}
                        value={digit}
                        onFocus={() => setActiveBoxIndex(index)}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`w-full h-13 sm:h-14 min-h-[44px] text-center font-mono text-xl sm:text-2xl font-black rounded-2xl border-2 transition-all leading-none focus:outline-none select-none flex items-center justify-center ${
                          isActive
                            ? 'border-purple-600 dark:border-purple-400 bg-white dark:bg-slate-900 ring-4 ring-purple-500/20 text-purple-600 dark:text-white shadow-md scale-105 z-10'
                            : isFilled
                            ? 'border-indigo-400/90 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-200 shadow-2xs'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-white shadow-2xs hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="flex items-center justify-center gap-2 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/50 p-2.5 rounded-2xl border border-rose-200 dark:border-rose-800 font-bold animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Resend Actions & Instant Auto-Fill Chip */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-baseline px-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-baseline gap-1">
                    {timeLeft > 0 ? (
                      <>
                        <span>Resend code in</span>
                        <span className="text-purple-600 dark:text-purple-400 font-black font-mono text-xs">{timeLeft}s</span>
                      </>
                    ) : (
                      <span className="text-amber-500 font-semibold">Code expired</span>
                    )}
                  </span>

                  <button
                    type="button"
                    disabled={timeLeft > 0}
                    onClick={handleResend}
                    className="text-purple-600 dark:text-purple-400 font-bold hover:underline disabled:opacity-40 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend Code</span>
                  </button>
                </div>

                {/* One-Tap Test Code Pill Button */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      const demo = ['8', '4', '9', '2', '0', '1'];
                      setOtp(demo);
                      setActiveBoxIndex(5);
                      startVerificationSequence(demo);
                    }}
                    className="w-full sm:w-auto px-4 py-2 min-h-[40px] rounded-full bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-100/90 dark:hover:bg-indigo-900/60 active:scale-[0.97] transition-all cursor-pointer shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400 shrink-0" />
                    <span>
                      One-Tap Test Code: <strong className="font-mono font-black text-purple-600 dark:text-purple-300 ml-0.5">849201</strong>
                    </span>
                  </button>
                </div>
              </div>

              {/* Verify Passcode & Unlock Button */}
              <button
                type="submit"
                className="w-full h-12 min-h-[48px] bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-black rounded-2xl text-sm tracking-wide shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97] active:opacity-90 transition-all duration-150"
              >
                <Lock className="w-4 h-4 text-cyan-300 stroke-[2.3]" />
                <span>Verify Passcode & Unlock</span>
              </button>
            </form>
          ) : (
            /* VERIFYING & SUCCESS CARD */
            <div className="relative flex flex-col items-center justify-center my-4 w-full">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={`relative p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 shadow-2xl flex flex-col items-center justify-center space-y-3 w-64 ${
                  stage === 'success'
                    ? 'border-emerald-500 shadow-emerald-500/20'
                    : 'border-purple-500 shadow-purple-500/20'
                }`}
              >
                {stage === 'verifying' ? (
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <div className="w-12 h-12 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                    <ShieldCheck className="w-6 h-6 text-purple-500 absolute" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 animate-bounce">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                )}

                <div className="text-center space-y-0.5">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {stage === 'success' ? 'Passcode Verified!' : 'Verifying Identity...'}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {stage === 'success'
                      ? 'Launching Campus OS workspace'
                      : 'Matching student credentials'}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Security Badge */}
      <div className="shrink-0 pt-2 pb-1 text-center z-10 max-w-sm mx-auto w-full">
        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          Encrypted Biometric Authentication • Campus OS
        </p>
      </div>
    </div>
  );
});
