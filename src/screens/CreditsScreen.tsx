import React from 'react';
import { ScreenId, StudentProfile } from '../types';
import { ArrowLeft, CheckCircle2, GraduationCap, Award } from 'lucide-react';

interface CreditsScreenProps {
  student: StudentProfile;
  navigate: (screen: ScreenId) => void;
}

export const CreditsScreen: React.FC<CreditsScreenProps> = ({ student, navigate }) => {
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
              Degree Credits Audit
            </h1>
            <p className="text-xs text-[#64748B] font-medium">Graduation Progress Roadmap</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E] text-[10px] font-extrabold uppercase border border-teal-200">
          SENIOR HONORS
        </span>
      </div>

      {/* Hero Progress Card */}
      <div className="bg-gradient-to-br from-[#F0FDFA] via-white to-[#E6FFFA] text-[#0F172A] rounded-[28px] p-6 shadow-md border border-[#E2E8F0] space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#0D9488]/10 text-[#0D9488] text-[10px] font-extrabold uppercase border border-teal-200">
              CREDIT COMPLETION
            </span>
            <h2 className="text-3xl font-black mt-2 text-[#0F172A]">
              {student.totalCredits} / {student.requiredCredits}
            </h2>
            <p className="text-xs text-[#64748B] mt-1 font-medium">26 Credits Remaining to Graduate</p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#CCFBF1] border border-teal-200 flex items-center justify-center shadow-2xs">
            <GraduationCap className="w-7 h-7 text-[#0D9488]" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#F1F5F9] h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="bg-[#0D9488] h-full rounded-full transition-all duration-500"
            style={{ width: `${(student.totalCredits / student.requiredCredits) * 100}%` }}
          />
        </div>
      </div>

      {/* Credit Categories List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#0F172A]">Credit Breakdown</h3>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-[#0F172A]">
            <span>Core Computer Science Courses</span>
            <span className="text-[#0D9488]">64 / 64 Credits</span>
          </div>
          <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
            <div className="bg-[#0D9488] h-full rounded-full w-full" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-[#0F172A]">
            <span>Department Electives</span>
            <span className="text-[#0D9488]">32 / 40 Credits</span>
          </div>
          <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
            <div className="bg-[#0D9488] h-full rounded-full w-[80%]" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-[#0F172A]">
            <span>Open & Humanities Electives</span>
            <span className="text-[#0D9488]">18 / 36 Credits</span>
          </div>
          <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
            <div className="bg-[#0D9488] h-full rounded-full w-[50%]" />
          </div>
        </div>
      </div>
    </div>
  );
};
