import React, { useState } from 'react';
import { ScreenId } from '../types';
import { QrCode, Layers, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OnboardingScreenProps {
  navigate: (screen: ScreenId) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'slide-1',
      title: 'Smart Attendance in Seconds',
      description:
        'No physical sign-sheets or PDF forms. Open camera, scan dynamic professor QR codes, and your attendance is instantly marked.',
      badge: 'CAMERA QR SCANNER',
      icon: <QrCode className="w-12 h-12 text-[#6366F1]" />,
      preview: (
        <div className="w-56 h-56 bg-white rounded-3xl p-4 shadow-xl border border-[#E2E8F0] flex flex-col justify-between items-center relative overflow-hidden">
          <div className="w-full bg-[#EEF2FF] p-2.5 rounded-2xl flex items-center justify-between border border-indigo-100">
            <span className="text-[10px] font-bold text-[#6366F1]">LIVE CLASS</span>
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping"></span>
          </div>
          <div className="w-28 h-28 bg-[#6366F1] rounded-2xl flex items-center justify-center shadow-lg text-white">
            <QrCode className="w-16 h-16" />
          </div>
          <p className="text-[10px] font-bold text-[#64748B]">Center QR inside camera view</p>
        </div>
      ),
    },
    {
      id: 'slide-2',
      title: 'Everything You Need in One OS',
      description:
        'Manage timetables, assignment readiness, library renewals, exam results, and credit requirements with one beautiful dashboard.',
      badge: 'ALL-IN-ONE UTILITY',
      icon: <Layers className="w-12 h-12 text-[#06B6D4]" />,
      preview: (
        <div className="w-64 h-52 relative flex flex-col items-center justify-center">
          <div className="absolute top-0 w-52 bg-white rounded-2xl p-3 shadow-md border border-[#E2E8F0] text-xs font-bold text-[#0F172A] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>Attendance: 92% (Safe Zone)</span>
          </div>
          <div className="absolute top-6 w-56 bg-[#6366F1] rounded-2xl p-3 shadow-lg text-xs font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#22D3EE]" />
            <span>Timetable: CS201 at 10:30 AM</span>
          </div>
          <div className="absolute top-12 w-60 bg-[#0F172A] rounded-2xl p-3.5 shadow-2xl text-xs font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
            <span>CGPA: 3.88 (Top 3 Rank)</span>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-3',
      title: 'Offline-First & PWA Installable',
      description:
        'Works seamlessly on weak campus Wi-Fi. Attendance requests queue automatically and sync when reconnected.',
      badge: 'PWA CAPABILITY',
      icon: <ShieldCheck className="w-12 h-12 text-[#8B5CF6]" />,
      preview: (
        <div className="w-56 h-56 bg-white rounded-3xl p-5 shadow-xl border border-[#E2E8F0] flex flex-col justify-between items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F0FDF4] border border-emerald-200 flex items-center justify-center text-[#22C55E]">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h4 className="text-sm font-black text-[#0F172A]">Offline Queue Ready</h4>
            <p className="text-[11px] text-[#64748B] mt-1">Zero data loss guaranteed</p>
          </div>
          <span className="text-[10px] font-bold text-[#6366F1] bg-[#EEF2FF] px-3 py-1 rounded-full border border-indigo-100">
            Auto-Sync Active
          </span>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('login');
    }
  };

  const current = slides[currentSlide];

  return (
    <div className="w-full min-h-full bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between p-6 font-sans relative overflow-y-auto">
      {/* Background Soft Glowing Ambient Light Orbs */}
      <div className="absolute top-10 -left-20 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="pt-2 flex justify-between items-center z-10 max-w-md mx-auto w-full">
        <span className="text-[11px] font-extrabold text-[#6366F1] uppercase tracking-wider bg-[#EEF2FF] px-3 py-1 rounded-full border border-indigo-100">
          {current.badge}
        </span>
        <button
          onClick={() => navigate('login')}
          className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
        >
          Skip
        </button>
      </div>

      {/* Slide Visual Content */}
      <div className="my-auto flex flex-col items-center text-center space-y-6 z-10 max-w-md mx-auto w-full py-6">
        <div className="h-60 flex items-center justify-center">{current.preview}</div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
            {current.title}
          </h2>
          <p className="text-xs text-[#64748B] leading-relaxed max-w-xs mx-auto font-medium">
            {current.description}
          </p>
        </div>
      </div>

      {/* Bottom Navigation Controls */}
      <div className="space-y-6 z-10 max-w-md mx-auto w-full pb-6">
        {/* Pagination Indicators */}
        <div className="flex justify-center items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentSlide
                  ? 'w-8 bg-[#6366F1]'
                  : 'w-2 bg-[#CBD5E1] hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* Primary CTA */}
        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white font-bold py-4 rounded-2xl text-xs tracking-wide shadow-[0_8px_20px_rgba(99,102,241,0.25)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
