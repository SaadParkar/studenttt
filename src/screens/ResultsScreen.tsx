import React from 'react';
import { ScreenId, SubjectGrade, StudentProfile } from '../types';
import { ArrowLeft, Award, GraduationCap, Sparkles, CheckCircle2 } from 'lucide-react';

interface ResultsScreenProps {
  student: StudentProfile;
  grades: SubjectGrade[];
  navigate: (screen: ScreenId) => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ student, grades, navigate }) => {
  return (
    <div className="space-y-6 pb-6 max-w-2xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-center text-[#0F172A] hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#0F172A] tracking-tight">
              Exam Marksheet
            </h1>
            <p className="text-xs text-[#64748B] font-medium">Spring 2026 Academic Report</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] text-[10px] font-extrabold uppercase border border-amber-200">
          TOP 3 CLASS RANK
        </span>
      </div>

      {/* Hero CGPA Card */}
      <div className="bg-gradient-to-br from-[#FEF3C7] via-white to-[#FFEDD5] text-[#0F172A] rounded-[28px] p-6 shadow-md border border-[#E2E8F0] relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <span className="px-3 py-1 bg-[#F59E0B]/10 text-[#D97706] rounded-full text-[10px] font-extrabold uppercase border border-amber-200">
              CUMULATIVE GPA
            </span>
            <h2 className="text-3xl font-black tracking-tight mt-2 text-[#0F172A]">{student.cgpa} / 4.00</h2>
            <p className="text-xs text-[#64748B] mt-1 font-medium">Class Rank #{student.classRank} of {student.totalStudentsInClass}</p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] border border-amber-200 flex items-center justify-center shadow-2xs">
            <Award className="w-7 h-7 text-[#D97706]" />
          </div>
        </div>

        {/* Scholarship Progress */}
        <div className="mt-5 p-3 rounded-2xl bg-white border border-amber-200 shadow-2xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <span className="font-semibold text-[#0F172A]">Dean's Merit Grant ($2,500)</span>
          </div>
          <span className="font-extrabold text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full">ELIGIBLE ✓</span>
        </div>
      </div>

      {/* Subject Grades List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#0F172A]">Semester Grade Card</h3>

        {grades.map((g) => (
          <div
            key={g.code}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-[#E2E8F0] dark:border-slate-700 shadow-xs flex justify-between items-center"
          >
            <div>
              <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">{g.subjectName}</h4>
              <p className="text-[11px] text-[#64748B] dark:text-slate-400 font-medium">
                {g.code} • {g.credits} Credits • Semester: {g.semester}
              </p>
            </div>

            <div className="text-right">
              <span className="text-lg font-black text-[#6366F1]">{g.grade}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
