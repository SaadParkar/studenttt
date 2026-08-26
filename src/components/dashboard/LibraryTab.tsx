import React from 'react';
import { motion } from 'motion/react';
import { LibraryBook, StudentProfile } from '../../types';
import {
  BookMarked,
  Clock,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

interface LibraryTabProps {
  student: StudentProfile;
  books: LibraryBook[];
  onRenewBook: (bookId: string) => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = React.memo(({ books, onRenewBook }) => {
  const borrowedBooks = books.filter((b) => b.status === 'borrowed');
  const recommendedBooks = books.filter((b) => b.status === 'recommended');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-4 transform-gpu"
    >
      {/* Library Fine & Membership Status Header */}
      <div className="bg-gradient-to-br from-cyan-700 via-blue-800 to-indigo-900 text-white p-5 rounded-[24px] shadow-lg border border-cyan-400/30 flex justify-between items-center">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-fit">
            <ShieldCheck className="w-3 h-3 text-emerald-300" />
            Central Library Clearance Active
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Library & Digital E-Books
          </h2>
          <p className="text-xs text-cyan-100 font-medium">
            Fine Balance: <strong className="text-emerald-300 font-black">$0.00 (Good Standing)</strong>
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20">
          <BookMarked className="w-6 h-6" />
        </div>
      </div>

      {/* Borrowed Books Section */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-[26px] border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-500" />
          <span>Currently Borrowed Books ({borrowedBooks.length})</span>
        </h3>

        <div className="space-y-3">
          {borrowedBooks.map((book) => (
            <div
              key={book.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3.5"
            >
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-12 h-16 rounded-xl object-cover shadow-xs shrink-0"
              />

              <div className="flex-1 min-w-0">
                <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-[9px] font-black uppercase">
                  {book.category}
                </span>
                <h4 className="text-xs font-black text-slate-900 dark:text-white truncate mt-0.5">
                  {book.title}
                </h4>
                <p className="text-[11px] font-medium text-slate-500 truncate">{book.author}</p>
                <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Due Date: {book.dueDate} ({book.daysRemaining} days left)
                </p>
              </div>

              <button
                onClick={() => onRenewBook(book.id)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10.5px] flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all shrink-0"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Renew</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Reading List */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-[26px] border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>AI Reading Recommendations</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recommendedBooks.map((book) => (
            <div
              key={book.id}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3"
            >
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-10 h-14 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {book.title}
                </h4>
                <p className="text-[10.5px] font-medium text-slate-500 truncate">{book.author}</p>
                <span className="text-[9.5px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase mt-0.5 block">
                  Available in E-Library
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});
