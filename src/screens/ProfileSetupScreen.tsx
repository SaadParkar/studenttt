import React, { useState } from 'react';
import { ScreenId, StudentProfile } from '../types';
import { ShieldCheck, UserCheck, ArrowRight, CheckCircle2, Building, GraduationCap, Award } from 'lucide-react';

interface ProfileSetupScreenProps {
  student: StudentProfile;
  navigate: (screen: ScreenId) => void;
  onUpdateStudent: (updated: Partial<StudentProfile>) => void;
}

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  student,
  navigate,
  onUpdateStudent,
}) => {
  const [name, setName] = useState(student.name || 'Saad Parkar');
  const [department, setDepartment] = useState(student.department || 'Computer Science');
  const [semester, setSemester] = useState(student.semester || 'Semester 5 (Senior Year)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStudent({ name, department, semester });
    navigate('auth_success');
  };

  return (
    <div
      className="w-full min-h-full bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white flex flex-col justify-between px-5 font-sans relative overflow-y-auto"
      style={{
        paddingTop: 'max(1.25rem, calc(env(safe-area-inset-top, 0px) + 12px))',
        paddingBottom: 'max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 12px))',
      }}
    >
      {/* Background Soft Aurora Light Gradients */}
      <div className="absolute top-0 -left-20 w-80 h-80 bg-indigo-200/40 dark:bg-indigo-950/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-sky-200/40 dark:bg-sky-950/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-sm mx-auto flex justify-between items-center z-10">
        <span className="px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 text-[10px] font-extrabold border border-indigo-200 dark:border-indigo-800 shadow-2xs">
          Step 3 of 3 • Student Setup
        </span>
        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 stroke-[2.3]" /> ID Verified
        </span>
      </div>

      {/* Main Container */}
      <div className="my-auto max-w-sm w-full mx-auto space-y-6 z-10 py-4">
        {/* Profile Card Preview */}
        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-2xs text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6366F1] via-[#8B5CF6] to-[#06B6D4] text-white font-black text-xl flex items-center justify-center mx-auto shadow-md border-2 border-white dark:border-slate-700">
            SP
          </div>

          <div>
            <h2 className="text-lg font-black text-[#0F172A] dark:text-white">{name}</h2>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{student.idNumber}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{student.collegeName}</p>
          </div>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-[26px] font-black tracking-tight text-[#0F172A] dark:text-white">
            Confirm Student Identity
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-300 font-medium">
            Review academic records linked to your institutional account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] dark:text-white">
              Student Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-700 text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] dark:text-white">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-700 text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Tech</option>
                <option value="Data Science">Data Science</option>
                <option value="Biotechnology">Biotechnology</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] dark:text-white">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-700 text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
              >
                <option value="Semester 5 (Senior Year)">Sem 5 (Senior)</option>
                <option value="Semester 6 (Final)">Sem 6 (Final)</option>
                <option value="Semester 4">Sem 4</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-13 min-h-[50px] bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white font-bold rounded-2xl text-xs sm:text-sm tracking-wide shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 active:scale-[0.97] transition-all cursor-pointer"
          >
            <span>Complete Setup & Launch Dashboard</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </button>
        </form>
      </div>

      <div className="pt-2 text-center z-10 max-w-sm mx-auto w-full">
        <p className="text-[11px] text-slate-400 font-medium">
          SIES College of Arts, Science & Commerce • Student Portal v2.4
        </p>
      </div>
    </div>
  );
};
