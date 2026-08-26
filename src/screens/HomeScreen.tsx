import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ScreenId, StudentProfile, Lecture } from '../types';
import { StackedHeroCards } from '../components/StackedHeroCards';
import { QuickActionGrid } from '../components/QuickActionGrid';
import { TodayTimeline } from '../components/TodayTimeline';
import { INITIAL_HERO_CARDS } from '../data/mockData';
import { prefetchEngine } from '../lib/prefetchEngine';
import {
  Bot,
  Sparkles,
  Calendar,
  Clock,
  ChevronRight,
  BellRing,
  ShieldCheck,
  FileCheck,
  Zap,
} from 'lucide-react';

interface HomeScreenProps {
  student: StudentProfile;
  lectures: Lecture[];
  navigate: (screen: ScreenId) => void;
  openScannerModal: () => void;
  onSelectLecture: (lec: Lecture) => void;
  assignments?: any;
  books?: any;
  subjects?: any;
  grades?: any;
  goals?: any;
  onSubmitAssignment?: any;
  onRenewBook?: any;
  onAddGoal?: any;
  initialTab?: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = React.memo(({
  student,
  lectures,
  navigate,
  openScannerModal,
  onSelectLecture,
  assignments = [],
  books = [],
}) => {
  const firstName = student.name.split(' ')[0] || 'Saad';
  const [prefetchState, setPrefetchState] = useState<'idle' | 'prefetching' | 'prefetched'>(
    prefetchEngine.getStatus()
  );

  useEffect(() => {
    // Register idle prefetch for next logical screens (Timetable, Assignments, Analytics)
    prefetchEngine.registerIdlePrefetch(lectures, assignments, books);

    const unsubscribe = prefetchEngine.subscribe((status) => {
      setPrefetchState(status);
    });

    return () => {
      unsubscribe();
      prefetchEngine.clearIdleTimer();
    };
  }, [lectures, assignments, books]);

  const upcomingDeadlines = [
    {
      id: 'dsa-1',
      title: 'DSA Algorithm Assignment',
      due: 'Due Tomorrow',
      time: '11:59 PM',
      priority: 'HIGH',
      badgeBg: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
      iconBg: 'bg-rose-500/15 text-rose-500 dark:text-rose-400',
    },
    {
      id: 'os-1',
      title: 'OS Process Lab Report',
      due: 'Due 18 May',
      time: '11:59 PM',
      priority: 'MEDIUM',
      badgeBg: 'bg-sky-500/10 text-sky-500 border-sky-500/30',
      iconBg: 'bg-sky-500/15 text-sky-500 dark:text-sky-400',
    },
    {
      id: 'math-1',
      title: 'Maths Fourier Problem Set',
      due: 'Due 20 May',
      time: '11:59 PM',
      priority: 'LOW',
      badgeBg: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
      iconBg: 'bg-amber-500/15 text-amber-500 dark:text-amber-400',
    },
  ];

  const facultyNotices = [
    {
      id: 'fn-1',
      tag: "DEAN'S DESK",
      author: 'Dr. A. Sharma (HOD Comp Sci)',
      time: '2 hours ago',
      title: 'Mid-term Practical Timetable Released',
      desc: 'All Sem-6 students must check their assigned lab batches on the notice board or student portal.',
      verified: true,
    },
    {
      id: 'fn-2',
      tag: 'ACADEMIC ADVISORY',
      author: 'Prof. Mehta (Exam Controller)',
      time: 'Yesterday',
      title: 'Minimum 75% Attendance Mandatory for Hall Ticket',
      desc: 'Hall ticket distribution begins next Monday. Ensure your aggregate attendance is above 75%.',
      verified: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.01,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-6 max-w-2xl mx-auto px-4 sm:px-6 pt-2 transform-gpu"
    >
      {/* 0. Signature Greeting & Dynamic Student Pulse Bar */}
      <motion.div variants={itemVariants} className="space-y-3 pt-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-black tracking-wider uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ACADEMIC SESSION ACTIVE
              </span>

              {prefetchState === 'prefetched' && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-[11px] font-black tracking-wider uppercase flex items-center gap-1.5 shadow-2xs"
                  title="Next screens (Timetable & Assignments) preloaded during idle time"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />
                  PRELOADED
                </motion.span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mt-1">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                {firstName}
              </span>{' '}
              👋
            </h1>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              {student.course} • Batch of {student.batchYear || '2026'}
            </p>
          </div>

          <button
            onClick={() => navigate('profile')}
            className="w-11 h-11 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:scale-105 transition-transform shrink-0 cursor-pointer flex items-center justify-center min-h-[44px] min-w-[44px]"
            title="View Profile Stats"
          >
            <ShieldCheck className="w-5.5 h-5.5 text-indigo-600 dark:text-indigo-400" />
          </button>
        </div>
      </motion.div>

      {/* 1. Stacked Hero Cards Carousel */}
      <motion.div variants={itemVariants}>
        <StackedHeroCards cards={INITIAL_HERO_CARDS} navigate={navigate} />
      </motion.div>

      {/* 2. Quick Access 2-Column Grid */}
      <motion.div variants={itemVariants}>
        <QuickActionGrid navigate={navigate} openScanner={openScannerModal} />
      </motion.div>

      {/* 3. Today's Schedule Live Timeline */}
      <motion.div variants={itemVariants}>
        <TodayTimeline
          lectures={lectures}
          navigate={navigate}
          onSelectLecture={onSelectLecture}
          openScannerModal={openScannerModal}
        />
      </motion.div>

      {/* 4. Official College & Faculty Bulletins (Spotlight) */}
      <motion.div variants={itemVariants} className="space-y-3.5">
        <div className="flex justify-between items-center px-0.5">
          <h2 className="text-[18px] sm:text-[20px] font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BellRing className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Faculty & Official Bulletins</span>
          </h2>
          <button
            onClick={() => navigate('notifications')}
            className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1 min-h-[44px] min-w-[44px] justify-end"
          >
            <span>All Bulletins</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="space-y-3">
          {facultyNotices.map((notice, i) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.35 }}
              onClick={() => navigate('notifications')}
              className={`bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xs hover:border-indigo-500/50 transition-all cursor-pointer space-y-2 relative overflow-hidden active:scale-[0.99]`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[10.5px] font-black uppercase tracking-wider">
                  {notice.tag}
                </span>
                <span className="text-[11.5px] font-bold text-slate-400">
                  {notice.time}
                </span>
              </div>

              <h4 className="text-[15px] sm:text-[16px] font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                {notice.title}
              </h4>
              <p className="text-[13px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-normal">
                {notice.desc}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 text-[12px] text-slate-500 dark:text-slate-400 font-semibold">
                <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  {notice.author}
                </span>
                <span className="text-slate-400">Read details →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 5. Upcoming Deadlines Section */}
      <motion.div variants={itemVariants} className="space-y-3.5">
        <div className="flex justify-between items-center px-0.5">
          <h2 className="text-[18px] sm:text-[20px] font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-rose-500" />
            <span>Upcoming Deadlines</span>
          </h2>
          <button
            onClick={() => navigate('assignments')}
            className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1 min-h-[44px] min-w-[44px] justify-end"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {upcomingDeadlines.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05, duration: 0.35 }}
              onClick={() => navigate('assignments')}
              className="bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-xs hover:border-indigo-500/50 transition-all cursor-pointer space-y-2.5 flex flex-col justify-between group active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${item.iconBg} group-hover:scale-105 transition-transform`}>
                  <Calendar className="w-5 h-5" />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider border ${item.badgeBg}`}>
                  {item.priority}
                </span>
              </div>

              <div>
                <h4 className="text-[14.5px] sm:text-[15.5px] font-black text-slate-900 dark:text-white tracking-tight truncate">
                  {item.title}
                </h4>
                <p className="text-[12px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.due} • {item.time}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
});

