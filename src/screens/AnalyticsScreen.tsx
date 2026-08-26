import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { SkeletonLoader } from '../components/SkeletonLoader';
import {
  ScreenId,
  StudentProfile,
  Lecture,
  Assignment,
  LibraryBook,
  SubjectAttendance,
  SubjectGrade,
  GoalItem,
} from '../types';
import { DashboardSecondaryNav, DashboardTab } from '../components/DashboardSecondaryNav';
import { OverviewTab } from '../components/dashboard/OverviewTab';
import { AttendanceTab } from '../components/dashboard/AttendanceTab';
import { AcademicsTab } from '../components/dashboard/AcademicsTab';
import { PerformanceTab } from '../components/dashboard/PerformanceTab';
import { GoalsTab } from '../components/dashboard/GoalsTab';
import { AssignmentsTab } from '../components/dashboard/AssignmentsTab';
import { LibraryTab } from '../components/dashboard/LibraryTab';
import { CreditsTab } from '../components/dashboard/CreditsTab';
import { AIInsightsTab } from '../components/dashboard/AIInsightsTab';

interface AnalyticsScreenProps {
  student: StudentProfile;
  subjects: SubjectAttendance[];
  navigate: (screen: ScreenId) => void;
  lectures?: Lecture[];
  assignments?: Assignment[];
  books?: LibraryBook[];
  grades?: SubjectGrade[];
  goals?: GoalItem[];
  openScannerModal?: () => void;
  onSelectLecture?: (lec: Lecture) => void;
  onSubmitAssignment?: (assignmentId: string, fileName: string) => void;
  onRenewBook?: (bookId: string) => void;
  onAddGoal?: (goal: Omit<GoalItem, 'id'>) => void;
  initialTab?: DashboardTab;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = React.memo(({
  student,
  subjects = [],
  navigate,
  lectures = [],
  assignments = [],
  books = [],
  grades = [],
  goals = [],
  openScannerModal = () => navigate('live_attendance'),
  onSelectLecture = () => {},
  onSubmitAssignment = () => {},
  onRenewBook = () => {},
  onAddGoal,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);

  const handleTabChange = (newTab: DashboardTab) => {
    setActiveTab(newTab);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.18, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4 pb-6 max-w-2xl mx-auto px-2 sm:px-4 transform-gpu"
    >
      {/* Analytics Page Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center pt-2 px-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 flex items-center justify-center text-[#0F172A] dark:text-white hover:bg-slate-50 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#0F172A] dark:text-white tracking-tight">
              Analytics & Dashboard
            </h1>
            <p className="text-xs text-[#64748B] dark:text-slate-400 font-medium">
              Academic Performance & Attendance Hub
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-[10px] font-extrabold uppercase border border-emerald-200">
          {student.overallAttendance}% Overall
        </span>
      </motion.div>

      {/* SECONDARY DASHBOARD NAVIGATION: Floating pill tabs menu */}
      <motion.div variants={itemVariants}>
        <DashboardSecondaryNav
          activeTab={activeTab}
          onSelectTab={handleTabChange}
        />
      </motion.div>

      {/* ACTIVE TAB CONTENT */}
      <motion.div variants={itemVariants} className="pt-2 min-h-[380px] transform-gpu">
        <div key={activeTab}>
          {activeTab === 'overview' && (
            <OverviewTab
              student={student}
              lectures={lectures}
              assignments={assignments}
              goals={goals}
              onSwitchTab={(tab) => setActiveTab(tab)}
              openScannerModal={openScannerModal}
              onSelectLecture={onSelectLecture}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceTab student={student} subjects={subjects} />
          )}

          {activeTab === 'academics' && (
            <AcademicsTab student={student} grades={grades} navigate={navigate} />
          )}

          {activeTab === 'performance' && (
            <PerformanceTab student={student} />
          )}

          {activeTab === 'goals' && (
            <GoalsTab goals={goals} onAddGoal={onAddGoal} />
          )}

          {activeTab === 'assignments' && (
            <AssignmentsTab
              assignments={assignments}
              onSubmitAssignment={onSubmitAssignment}
            />
          )}

          {activeTab === 'library' && (
            <LibraryTab
              student={student}
              books={books}
              onRenewBook={onRenewBook}
            />
          )}

          {activeTab === 'credits' && (
            <CreditsTab student={student} />
          )}

          {activeTab === 'ai_insights' && (
            <AIInsightsTab student={student} subjects={subjects} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});
