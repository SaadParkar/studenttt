import React from 'react';
import { motion } from 'motion/react';
import { StudentProfile, SubjectGrade } from '../../types';
import {
  GraduationCap,
  BookOpen,
  UserCheck,
  Calendar,
  Award,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface AcademicsTabProps {
  student: StudentProfile;
  grades: SubjectGrade[];
  navigate: (screen: any) => void;
}

export const AcademicsTab: React.FC<AcademicsTabProps> = React.memo(({ student, grades, navigate }) => {
  const semesters = [
    { sem: 'Sem 1', gpa: 8.8, status: 'Completed', credits: 24 },
    { sem: 'Sem 2', gpa: 9.1, status: 'Completed', credits: 26 },
    { sem: 'Sem 3', gpa: 8.9, status: 'Current', credits: 24 },
    { sem: 'Sem 4', gpa: 0.0, status: 'Upcoming', credits: 24 },
  ];

  const facultyMembers = [
    { name: 'Dr. Robert Vance', subject: 'Operating Systems', office: 'Block C-302', hours: 'Mon/Wed 2-4 PM' },
    { name: 'Prof. Anita Sharma', subject: 'Data Structures & Algorithms', office: 'Lab 4', hours: 'Tue/Thu 10 AM-12 PM' },
    { name: 'Dr. Michael Chen', subject: 'Computer Networks', office: 'Block A-108', hours: 'Fri 1-3 PM' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-4 transform-gpu"
    >
      {/* CGPA & Semester GPA Summary Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-5 rounded-[28px] shadow-lg border border-indigo-400/30">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
              {student.department} • {student.semester}
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-1">
              Academic Transcript
            </h2>
            <p className="text-xs text-indigo-100 font-medium">
              Overall CGPA: <strong className="text-amber-300 text-sm font-black">{student.cgpa} / 10.0</strong>
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Semester GPA Progress Bar */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/20">
          {semesters.map((s) => (
            <div key={s.sem} className="text-center bg-white/10 p-2 rounded-xl backdrop-blur-xs">
              <span className="text-[10px] font-bold text-indigo-200 block">{s.sem}</span>
              <span className="text-xs font-black text-white">
                {s.gpa > 0 ? `${s.gpa}` : 'In Progress'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Course Grades & Exam Results */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-[26px] border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-500" />
            <span>Enrolled Courses & Grades</span>
          </h3>

          <button
            onClick={() => navigate('results')}
            className="text-xs font-extrabold text-[#6366F1] dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Full Transcript</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {grades.map((g) => (
            <div
              key={g.code}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                  {g.subjectName}
                </h4>
                <p className="text-[11px] font-medium text-slate-500">
                  {g.code} • {g.credits} Credits • Point {g.gpaPoint}
                </p>
              </div>

              <span className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center">
                {g.grade}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Faculty Details */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-[26px] border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-500" />
          <span>Faculty & Office Hours</span>
        </h3>

        <div className="space-y-2">
          {facultyMembers.map((fac) => (
            <div
              key={fac.name}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {fac.name}
                </h4>
                <p className="text-[10.5px] font-medium text-indigo-600 dark:text-indigo-400">
                  {fac.subject}
                </p>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                  Office: {fac.office} • Hours: {fac.hours}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Calendar Link */}
      <div
        onClick={() => navigate('timetable')}
        className="p-4 rounded-[22px] bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between cursor-pointer hover:bg-indigo-100/80 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">
              Academic Calendar & Timetable
            </h4>
            <p className="text-[11px] font-medium text-slate-500">
              View class schedule, holidays, exam dates & room allocations
            </p>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
      </div>
    </motion.div>
  );
});
