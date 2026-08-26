import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId, LibraryBook, StudentProfile } from '../types';
import {
  ArrowLeft,
  BookOpen,
  QrCode,
  RefreshCw,
  Clock,
  Sparkles,
  CheckCircle2,
  Award,
  Star,
} from 'lucide-react';

interface LibraryScreenProps {
  student: StudentProfile;
  books: LibraryBook[];
  navigate: (screen: ScreenId) => void;
  onRenewBook: (bookId: string) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  student,
  books,
  navigate,
  onRenewBook,
}) => {
  const [activeTab, setActiveTab] = useState<'Active' | 'History'>('Active');
  const [tiltPos, setTiltPos] = useState({ x: 0, y: 0 });

  const activeBooks = books.filter((b) => b.status === 'borrowed');
  const returnedBooks = books.filter((b) => b.status === 'returned');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
    setTiltPos({ x, y });
  };

  const handleMouseLeave = () => {
    setTiltPos({ x: 0, y: 0 });
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Library & Campus ID
            </h1>
            <p className="text-xs text-slate-500 font-medium">Digital Access & Catalog</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold">
          {activeBooks.length} ACTIVE BOOKS
        </span>
      </motion.div>

      {/* 3D TILT DIGITAL CAMPUS ID CARD */}
      <motion.div
        variants={itemVariants}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tiltPos.y}deg) rotateY(${tiltPos.x}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-[28px] p-6 shadow-2xl relative overflow-hidden border border-indigo-500/30 cursor-pointer"
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-[10px] font-extrabold tracking-widest uppercase text-indigo-400">
              CAMPUS DIGITAL ID PASS
            </p>
            <h2 className="text-xl font-black tracking-tight text-white mt-1">{student.name}</h2>
            <p className="text-xs text-indigo-200 font-medium">{student.idNumber}</p>
          </div>

          <div className="w-12 h-12 bg-white rounded-xl p-1 shadow-md">
            <QrCode className="w-full h-full text-slate-950" />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-xs relative z-10">
          <div>
            <p className="text-[9px] uppercase font-bold text-slate-400">DEPARTMENT</p>
            <p className="font-bold text-white">{student.department}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase font-bold text-slate-400">VALID UNTIL</p>
            <p className="font-bold text-emerald-400">MAY 2027</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl flex">
        <button
          onClick={() => setActiveTab('Active')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'Active'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm'
              : 'text-slate-500'
          }`}
        >
          Active Borrows ({activeBooks.length})
        </button>
        <button
          onClick={() => setActiveTab('History')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'History'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm'
              : 'text-slate-500'
          }`}
        >
          Reading History ({returnedBooks.length})
        </button>
      </motion.div>

      {/* Books List */}
      <motion.div variants={itemVariants} className="space-y-4">
        {activeTab === 'Active' ? (
          activeBooks.map((bk) => (
            <div
              key={bk.id}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4"
            >
              <img
                src={bk.coverImage}
                alt={bk.title}
                className="w-16 h-22 rounded-xl object-cover shadow-md border border-slate-200"
              />

              <div className="flex-1 space-y-1">
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[9px] font-extrabold uppercase">
                  {bk.category}
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                  {bk.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{bk.author}</p>

                <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 pt-1">
                  <Clock className="w-3.5 h-3.5" />
                  Due {bk.dueDate} ({bk.daysRemaining} days remaining)
                </p>
              </div>

              <button
                onClick={() => onRenewBook(bk.id)}
                className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-xs flex flex-col items-center gap-1 active:scale-95 transition-all"
                title="Renew book for +14 days"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-[9px]">Renew</span>
              </button>
            </div>
          ))
        ) : (
          returnedBooks.map((bk) => (
            <div
              key={bk.id}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4"
            >
              <img
                src={bk.coverImage}
                alt={bk.title}
                className="w-14 h-20 rounded-xl object-cover opacity-80"
              />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{bk.title}</h3>
                <p className="text-xs text-slate-500">{bk.author}</p>
                <div className="flex items-center gap-1 mt-1 text-amber-500">
                  {Array.from({ length: bk.myRating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};
