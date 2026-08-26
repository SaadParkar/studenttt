import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lecture } from '../types';
import { X, QrCode, Clock, MapPin, CheckCircle2, Sparkles, ChevronRight, User } from 'lucide-react';

interface SelectLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  lectures: Lecture[];
  selectedLecture: Lecture;
  onSelectAndScan: (lecture: Lecture) => void;
}

export const SelectLectureModal: React.FC<SelectLectureModalProps> = ({
  isOpen,
  onClose,
  lectures,
  selectedLecture,
  onSelectAndScan,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transform-gpu"
        >
          {/* Top Notch Handle */}
          <div className="w-full flex justify-center pt-2.5 pb-1 bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>

          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs">
                <QrCode className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                    Select Lecture to Scan
                  </h3>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Choose your class session to activate the QR scanner
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              className="w-10 h-10 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 dark:hover:bg-rose-500/35 hover:scale-105 flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-xs"
              title="Close"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Body: Lecture Cards */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
              <span>Today's Scheduled Classes</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono text-[10px]">
                {lectures.length} Lectures Total
              </span>
            </div>

            {lectures.map((lec) => {
              const isCurrent = lec.id === selectedLecture.id;
              const isMarked = lec.attendanceStatus === 'marked';

              return (
                <motion.div
                  key={lec.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectAndScan(lec)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isCurrent
                      ? 'bg-gradient-to-r from-indigo-50/90 to-purple-50/90 dark:from-indigo-950/60 dark:to-purple-950/60 border-indigo-500/80 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Status Indicator Stripe */}
                  <div
                    className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                      isMarked
                        ? 'bg-emerald-500'
                        : isCurrent
                        ? 'bg-indigo-600 dark:bg-indigo-400'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />

                  <div className="pl-2 flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold">
                          {lec.code}
                        </span>

                        {isMarked && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Present Marked
                          </span>
                        )}

                        {!isMarked && isCurrent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-300 dark:border-amber-800 animate-pulse">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            Active Session
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {lec.title}
                      </h4>

                      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs flex-wrap pt-0.5">
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lec.time}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lec.room}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px]">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Prof. {lec.professor}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center justify-center self-center w-8 h-8 rounded-xl bg-indigo-600 text-white shadow-sm group-hover:scale-110 transition-transform">
                      <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Tap any lecture to launch the high-speed camera QR & OTP scanner
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
