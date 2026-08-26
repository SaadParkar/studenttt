import React from 'react';
import { ScreenId, Lecture } from '../types';
import {
  ArrowLeft,
  User,
  MapPin,
  Clock,
  BookOpen,
  QrCode,
  FileText,
  Download,
  Video,
  CheckCircle2,
} from 'lucide-react';

interface ClassDetailsScreenProps {
  lecture: Lecture;
  navigate: (screen: ScreenId) => void;
  openScannerModal: () => void;
}

export const ClassDetailsScreen: React.FC<ClassDetailsScreenProps> = ({
  lecture,
  navigate,
  openScannerModal,
}) => {
  const syllabusModules = [
    { title: 'Module 1: Binary Search Trees & AVL Rotations', completed: true },
    { title: 'Module 2: Graph Traversal (DFS/BFS) & Dijkstra', completed: true },
    { title: 'Module 3: Dynamic Programming & Greedy Knapsack', completed: false },
    { title: 'Module 4: Amortized Analysis & Fibonacci Heaps', completed: false },
  ];

  return (
    <div className="space-y-6 pb-6 max-w-2xl mx-auto px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => navigate('timetable')}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Class Hub & Details
          </h1>
          <p className="text-xs text-slate-500 font-medium">{lecture.code}</p>
        </div>
      </div>

      {/* Hero Subject Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 rounded-[28px] shadow-xl relative overflow-hidden border border-indigo-800/40">
        <div className="flex justify-between items-start">
          <div>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-[10px] font-extrabold border border-cyan-400/30">
              {lecture.credits} CREDITS CORE
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-2">{lecture.title}</h2>
            <p className="text-xs text-indigo-200 mt-0.5">{lecture.building}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-2xl text-center border border-white/10">
            <p className="text-[10px] uppercase font-bold text-indigo-300">ATTENDANCE</p>
            <p className="text-lg font-black text-emerald-400">{lecture.attendancePercentage}%</p>
          </div>
        </div>

        {/* Professor Banner */}
        <div className="mt-5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-3">
          <img
            src={lecture.professorAvatar}
            alt={lecture.professor}
            className="w-11 h-11 rounded-xl object-cover border border-white/20"
          />
          <div>
            <p className="text-xs font-bold text-white">{lecture.professor}</p>
            <p className="text-[10px] text-indigo-200">Department Head • Office Hours Wed 2-4 PM</p>
          </div>
        </div>

        {/* Quick CTA */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={openScannerModal}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Mark Attendance</span>
          </button>
          {lecture.onlineMeetingUrl && (
            <button className="px-4 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 border border-white/20">
              <Video className="w-4 h-4 text-cyan-300" />
              <span>Meet</span>
            </button>
          )}
        </div>
      </div>

      {/* Syllabus Progress */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Syllabus Progress</h3>
          <span className="text-xs font-bold text-indigo-600">50% Completed</span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full w-1/2 rounded-full" />
        </div>

        <div className="space-y-2.5 pt-2">
          {syllabusModules.map((m, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3 text-xs"
            >
              <CheckCircle2
                className={`w-4 h-4 ${m.completed ? 'text-emerald-500' : 'text-slate-300'}`}
              />
              <span
                className={`font-semibold ${
                  m.completed ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'
                }`}
              >
                {m.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Course Resources & Reading Material */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Lecture Handouts & Notes</h3>

        <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-rose-500" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                AVL_Tree_Rotations_Lecture_Slides.pdf
              </p>
              <p className="text-[10px] text-slate-400">2.4 MB • Shared yesterday</p>
            </div>
          </div>
          <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
