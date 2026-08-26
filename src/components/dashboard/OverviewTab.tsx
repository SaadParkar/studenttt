import React from 'react';
import { motion } from 'motion/react';
import { StudentProfile, Lecture, Assignment, GoalItem } from '../../types';
import { DashboardTab } from '../DashboardSecondaryNav';
import {
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Award,
  Clock,
  ArrowRight,
  MapPin,
  User,
  FileText,
  AlertCircle,
  Bell,
  Target,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface OverviewTabProps {
  student: StudentProfile;
  lectures: Lecture[];
  assignments: Assignment[];
  goals: GoalItem[];
  onSwitchTab: (tab: DashboardTab) => void;
  openScannerModal: () => void;
  onSelectLecture: (lec: Lecture) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = React.memo(({
  student,
  lectures,
  assignments,
  goals,
  onSwitchTab,
  openScannerModal,
  onSelectLecture,
}) => {
  const currentLecture = lectures.find((l) => l.status === 'current') || lectures[0];
  const next3Lectures = lectures.slice(0, 3);
  const pendingAssignment = assignments.find((a) => a.status === 'Pending') || assignments[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-4 transform-gpu"
    >
      {/* 1. AI HERO SUMMARY CARD */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#311B92] p-5 text-white shadow-lg border border-indigo-500/20">
        <div className="relative z-10 space-y-4">
          {/* Top Badge & Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                AI Studio Smart Sync
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wide">
              Safe Zone • Honors Eligible
            </span>
          </div>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/10">
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                Attendance
              </span>
              <span className="text-xl font-black text-emerald-400 tracking-tight">
                {student.overallAttendance}%
              </span>
            </div>

            <div className="text-center sm:text-left">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                CGPA
              </span>
              <span className="text-xl font-black text-amber-300 tracking-tight">
                {student.cgpa} / 10
              </span>
            </div>

            <div className="text-center sm:text-left">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                Credits Earned
              </span>
              <span className="text-xl font-black text-cyan-300 tracking-tight">
                {student.totalCredits} / {student.requiredCredits}
              </span>
            </div>
          </div>

          {/* Today's Live Class & Upcoming Assignment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Live Class Highlight */}
            {currentLecture && (
              <div className="p-3 rounded-2xl bg-white/10 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-indigo-200 font-bold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    Today's Live Class
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/40 text-white text-[9px] font-black uppercase">
                    {currentLecture.startTime}
                  </span>
                </div>
                <h4 className="text-xs font-black text-white truncate">
                  {currentLecture.title}
                </h4>
                <div className="flex items-center gap-3 text-[10.5px] text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-300" />
                    {currentLecture.room}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {currentLecture.professor}
                  </span>
                </div>
              </div>
            )}

            {/* Upcoming Assignment Highlight */}
            {pendingAssignment && (
              <div className="p-3 rounded-2xl bg-white/10 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-purple-200 font-bold">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    Upcoming Assignment
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/30 text-rose-200 text-[9px] font-black uppercase">
                    {pendingAssignment.priority}
                  </span>
                </div>
                <h4 className="text-xs font-black text-white truncate">
                  {pendingAssignment.title}
                </h4>
                <div className="flex items-center justify-between text-[10.5px] text-slate-300">
                  <span>Due: {pendingAssignment.dueDate}</span>
                  <span className="text-amber-300 font-bold">
                    {pendingAssignment.readinessPercentage}% Draft
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* AI Recommendation footer */}
          <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/20 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-[11px] text-indigo-100 font-medium">
                <strong className="text-white">AI Suggestion:</strong> Attend Tuesday's OS lecture to boost attendance to 90.2%.
              </p>
            </div>
            <button
              onClick={() => onSwitchTab('ai_insights')}
              className="text-[10.5px] font-extrabold text-amber-300 hover:underline shrink-0 cursor-pointer flex items-center gap-0.5"
            >
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. QUICK STATISTICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          onClick={() => onSwitchTab('attendance')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2 gap-1">
            <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 truncate">
              Attendance
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {student.overallAttendance}%
            </p>
            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
              +1.5% from last week
            </p>
          </div>
        </div>

        <div
          onClick={() => onSwitchTab('academics')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2 gap-1">
            <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 truncate">
              Current CGPA
            </span>
            <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {student.cgpa}
            </p>
            <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 truncate">
              Rank #{student.classRank} of {student.totalStudentsInClass}
            </p>
          </div>
        </div>

        <div
          onClick={() => onSwitchTab('credits')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2 gap-1">
            <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 truncate">
              Credits Earned
            </span>
            <div className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {student.totalCredits} <span className="text-xs font-semibold text-slate-400">/ {student.requiredCredits}</span>
            </p>
            <p className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 mt-0.5 truncate">
              84.2% Completion
            </p>
          </div>
        </div>

        <div
          onClick={() => onSwitchTab('assignments')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2 gap-1">
            <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 truncate">
              Pending Tasks
            </span>
            <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {assignments.filter((a) => a.status === 'Pending').length} Tasks
            </p>
            <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 mt-0.5 truncate">
              Due in 2 days
            </p>
          </div>
        </div>
      </div>

      {/* 3. TODAY'S SCHEDULE (NEXT 3 LECTURES ONLY) + VIEW MORE CTA */}
      <div className="p-4 rounded-[26px] bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Today's Live Schedule</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-[11px] font-semibold text-slate-500">Next 3 scheduled classes</p>
          </div>

          <button
            onClick={() => onSwitchTab('attendance')}
            className="text-xs font-extrabold text-[#6366F1] dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {next3Lectures.map((lec) => (
            <div
              key={lec.id}
              onClick={() => onSelectLecture(lec)}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-indigo-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[11px] font-black">{lec.startTime}</span>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {lec.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>{lec.room}</span>
                    <span>•</span>
                    <span>{lec.professor}</span>
                  </div>
                </div>
              </div>

              {lec.status === 'completed' || lec.attendanceStatus === 'marked' ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[9.5px] font-black uppercase">
                  Marked
                </span>
              ) : lec.status === 'current' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openScannerModal();
                  }}
                  className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase shadow-xs hover:bg-indigo-700"
                >
                  Mark Present
                </button>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[9.5px] font-bold uppercase">
                  Upcoming
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. UPCOMING ASSIGNMENT PREVIEW + VIEW MORE CTA */}
      <div className="p-4 rounded-[26px] bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Upcoming Assignment</span>
              <FileText className="w-4 h-4 text-purple-500" />
            </h3>
            <p className="text-[11px] font-semibold text-slate-500">Highest priority submission</p>
          </div>

          <button
            onClick={() => onSwitchTab('assignments')}
            className="text-xs font-extrabold text-[#6366F1] dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingAssignment && (
          <div
            onClick={() => onSwitchTab('assignments')}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50/80 via-white to-indigo-50/80 dark:from-purple-950/30 dark:via-slate-900 dark:to-indigo-950/30 border border-purple-200/80 dark:border-purple-800/60 cursor-pointer space-y-2 hover:shadow-xs transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[9px] font-black uppercase">
                  {pendingAssignment.priority} Priority
                </span>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white mt-1">
                  {pendingAssignment.title}
                </h4>
                <p className="text-[11px] font-semibold text-slate-500">
                  {pendingAssignment.subject} • {pendingAssignment.faculty}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400">DUE DATE</span>
                <p className="text-xs font-black text-rose-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {pendingAssignment.dueDate}
                </p>
              </div>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full"
                style={{ width: `${pendingAssignment.readinessPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 5. LATEST NOTICE & ACADEMIC PREVIEW + VIEW MORE CTA */}
      <div className="p-4 rounded-[26px] bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Campus Notice & Calendar</span>
              <Bell className="w-4 h-4 text-amber-500" />
            </h3>
            <p className="text-[11px] font-semibold text-slate-500">Official university updates</p>
          </div>

          <button
            onClick={() => onSwitchTab('academics')}
            className="text-xs font-extrabold text-[#6366F1] dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
              Mid-Semester Practical Exam Schedule Published
            </h4>
            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-0.5">
              Practical exams start on August 18, 2026. Hall tickets available in Academics portal.
            </p>
          </div>
        </div>
      </div>

      {/* 6. AI INSIGHTS PREVIEW + VIEW MORE CTA */}
      <div className="p-4 rounded-[26px] bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Smart AI Recommendations</span>
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </h3>
            <p className="text-[11px] font-semibold text-slate-500">Predictive risk & grade optimization</p>
          </div>

          <button
            onClick={() => onSwitchTab('ai_insights')}
            className="text-xs font-extrabold text-[#6366F1] dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                GPA Boost Opportunity
              </h4>
              <p className="text-[10.5px] font-medium text-slate-600 dark:text-slate-300">
                Scoring 88+ in OS Practical will elevate total SGPA to 9.15.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. GOALS PROGRESS PREVIEW + VIEW MORE CTA */}
      <div className="p-4 rounded-[26px] bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Semester Goals Progress</span>
              <Target className="w-4 h-4 text-emerald-500" />
            </h3>
            <p className="text-[11px] font-semibold text-slate-500">Degree milestone achievements</p>
          </div>

          <button
            onClick={() => onSwitchTab('goals')}
            className="text-xs font-extrabold text-[#6366F1] dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {goals.slice(0, 2).map((g) => (
            <div
              key={g.id}
              onClick={() => onSwitchTab('goals')}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 cursor-pointer space-y-1.5"
            >
              <div className="flex justify-between text-xs font-black text-slate-900 dark:text-white">
                <span>{g.title}</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {g.currentValue}{g.unit} / {g.targetValue}{g.unit}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: `${Math.min(100, (g.currentValue / g.targetValue) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});
