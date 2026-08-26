import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId, Lecture } from '../types';
import { SkeletonLoader } from '../components/SkeletonLoader';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  Video,
  QrCode,
} from 'lucide-react';

interface TimetableScreenProps {
  lectures: Lecture[];
  navigate: (screen: ScreenId) => void;
  onSelectLecture: (lec: Lecture) => void;
}

export const TimetableScreen: React.FC<TimetableScreenProps> = ({
  lectures,
  navigate,
  onSelectLecture,
}) => {
  const [selectedDay, setSelectedDay] = useState(2); // WED
  const [isLoading, setIsLoading] = useState(false);
  const [isTeacherQrActive, setIsTeacherQrActive] = useState(false);

  const days = [
    { day: 'MON', date: '12' },
    { day: 'TUE', date: '13' },
    { day: 'WED', date: '14' },
    { day: 'THU', date: '15' },
    { day: 'FRI', date: '16' },
  ];

  const handleSelectDay = (index: number) => {
    setIsLoading(true);
    setSelectedDay(index);
    setTimeout(() => {
      setIsLoading(false);
    }, 220);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-6 max-w-2xl mx-auto px-4 sm:px-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => navigate('home')}
            className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 flex items-center justify-center text-[#0F172A] dark:text-white hover:bg-slate-50 cursor-pointer transition-transform active:scale-95 shadow-xs min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
              Class Timetable
            </h1>
            <p className="text-sm text-[#64748B] dark:text-slate-400 font-medium">September 2026 Schedule</p>
          </div>
        </div>

        <button className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] flex items-center justify-center hover:bg-indigo-100 transition-colors cursor-pointer active:scale-95 shadow-xs min-h-[44px] min-w-[44px]">
          <Calendar className="w-5 h-5 stroke-[2.3]" />
        </button>
      </motion.div>

      {/* Week Selector Bar */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-xs border border-[#E2E8F0] dark:border-slate-700 flex justify-between items-center">
        {days.map((d, idx) => {
          const isSelected = idx === selectedDay;

          return (
            <button
              key={idx}
              onClick={() => handleSelectDay(idx)}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer min-h-[56px] ${
                isSelected
                  ? 'bg-[#6366F1] text-white shadow-md font-black scale-105'
                  : 'text-[#64748B] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <span className="text-[11px] font-bold tracking-wider">{d.day}</span>
              <span className="text-[15px] font-extrabold">{d.date}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Path-style Lectures Timeline List */}
      <motion.div variants={itemVariants} className="relative pl-1 space-y-4 min-h-[300px]">
        {isLoading ? (
          <div className="space-y-4">
            <SkeletonLoader variant="card" />
            <SkeletonLoader variant="card" />
            <SkeletonLoader variant="card" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {lectures.map((lec, index) => {
              const isMissed = lec.attendanceStatus === 'missed' || lec.attendanceStatus === 'absent';
              const isCurrent = lec.status === 'current';
              const isCompleted = lec.status === 'completed' || lec.attendanceStatus === 'marked';
              const isLast = index === lectures.length - 1;

              const arcColor = isMissed
                ? '#E11D48'
                : isCompleted
                ? '#22C55E'
                : isCurrent
                ? '#6366F1'
                : index % 2 === 0
                ? '#06B6D4'
                : '#8B5CF6';

              return (
                <motion.div
                  key={lec.id}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="flex items-start gap-3 relative group"
                >
                  {/* Left Time Column & Path Line */}
                  <div className="w-14 shrink-0 flex flex-col items-center pt-3">
                    <span
                      className={`text-[14px] font-black tracking-tight ${
                        isMissed
                          ? 'text-[#E11D48]'
                          : isCurrent
                          ? 'text-[#6366F1]'
                          : isCompleted
                          ? 'text-[#22C55E]'
                          : 'text-[#64748B]'
                      }`}
                    >
                      {lec.startTime}
                    </span>

                    {!isLast && (
                      <div className="w-[2px] bg-[#E2E8F0] dark:bg-slate-700 h-16 my-1 rounded-full group-hover:bg-slate-300 transition-colors" />
                    )}
                  </div>

                  {/* Right Capsule Card with Path Arc Border */}
                  <div
                    onClick={() => {
                      onSelectLecture(lec);
                      navigate('class_details');
                    }}
                    className={`flex-1 ${
                      isMissed
                        ? 'bg-[#FFF1F2] dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50'
                        : 'bg-white dark:bg-slate-800 border-[#E2E8F0] dark:border-slate-700'
                    } rounded-[28px] p-4.5 pr-5 border shadow-2xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden active:scale-[0.99]`}
                  >
                    {/* SVG Smooth Arched Curve Border on Left */}
                    <svg
                      className="absolute left-0 top-0 bottom-0 h-full w-7 pointer-events-none"
                      viewBox="0 0 28 80"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M 26 3 C 6 3, 3 20, 3 40 C 3 60, 6 77, 26 77"
                        fill="none"
                        stroke={arcColor}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-[17px] font-black text-[#0F172A] dark:text-white leading-tight">
                            {lec.title}
                          </h3>
                          <p className="text-[12.5px] text-[#64748B] dark:text-slate-400 font-bold mt-0.5">
                            {lec.code} • {lec.startTime} - {lec.endTime}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {isMissed ? (
                            <span className="px-3.5 py-1.5 rounded-full bg-[#FFE4E6] dark:bg-rose-950/60 text-[#E11D48] text-[11px] font-black uppercase tracking-wide flex items-center gap-1 border border-rose-200">
                              <XCircle className="w-3.5 h-3.5" /> NOT ATTENDED
                            </span>
                          ) : isCurrent ? (
                            <span className="px-3.5 py-1.5 rounded-full bg-[#EEF2FF] text-[#6366F1] text-[11px] font-black uppercase tracking-wide border border-indigo-100">
                              CURRENT
                            </span>
                          ) : isCompleted ? (
                            <span className="px-3.5 py-1.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[11px] font-black uppercase tracking-wide flex items-center gap-1 border border-emerald-100">
                              <CheckCircle2 className="w-3.5 h-3.5" /> MARKED
                            </span>
                          ) : (
                            <span className="px-3.5 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-slate-700 text-[#64748B] dark:text-slate-300 text-[11px] font-black uppercase tracking-wide">
                              Upcoming
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Lecturer & Location Row */}
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] font-bold text-[#64748B] dark:text-slate-300 pt-2.5 border-t border-slate-100 dark:border-slate-700 mt-2.5">
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-[#6366F1]" />
                          <span>{lec.professor}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#06B6D4]" />
                          <span>{lec.room}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#8B5CF6]" />
                          <span>{lec.duration}</span>
                        </div>
                      </div>

                      {isCurrent && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider">
                            <span className="text-slate-500">FACULTY QR SESSION:</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsTeacherQrActive((prev) => !prev);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center gap-1 min-h-[38px] ${
                                isTeacherQrActive
                                  ? 'bg-emerald-500 text-white shadow-xs'
                                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                              }`}
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>{isTeacherQrActive ? 'QR Active ✓' : 'Teacher: Generate QR'}</span>
                            </button>
                          </div>

                          <button
                            disabled={!isTeacherQrActive}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isTeacherQrActive) {
                                onSelectLecture(lec);
                                navigate('live_attendance');
                              }
                            }}
                            className={`w-full font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all min-h-[46px] ${
                              isTeacherQrActive
                                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-white cursor-pointer active:scale-95 shadow-indigo-600/30'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-300/50 dark:border-slate-700/50'
                            }`}
                          >
                            <QrCode className="w-4 h-4 stroke-[2.2]" />
                            <span>{isTeacherQrActive ? 'Scan QR Code (Activated)' : 'Scan QR Code (Disabled - Waiting for Teacher)'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
};
