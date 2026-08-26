import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Assignment } from '../../types';
import {
  FileText,
  Clock,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';

interface AssignmentsTabProps {
  assignments: Assignment[];
  onSubmitAssignment: (assignmentId: string, fileName: string) => void;
}

export const AssignmentsTab: React.FC<AssignmentsTabProps> = React.memo(({
  assignments,
  onSubmitAssignment,
}) => {
  const [activeTab, setActiveTab] = useState<'Pending' | 'Submitted' | 'Completed'>('Pending');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');

  const filtered = assignments.filter((a) => a.status === activeTab);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    const fileName = uploadFileName || `${selectedAssignment.title.replace(/\s+/g, '_')}_Final.pdf`;
    onSubmitAssignment(selectedAssignment.id, fileName);
    setSelectedAssignment(null);
    setUploadFileName('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-4 transform-gpu"
    >
      {/* AI Priority Suggestion Banner */}
      <div className="p-4 rounded-[24px] bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white border border-purple-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white">AI Submission Priority</h3>
            <p className="text-[11px] font-medium text-purple-200">
              Focus on <strong className="text-amber-300">CS201 Algorithm Lab Report</strong> first due in 2 days.
            </p>
          </div>
        </div>
      </div>

      {/* Segmented Tab Filter */}
      <div className="bg-slate-200/80 dark:bg-slate-800 p-1.5 rounded-2xl flex justify-between gap-1">
        {(['Pending', 'Submitted', 'Completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Assignment Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-slate-800/90 rounded-[26px] border border-dashed border-slate-300 dark:border-slate-700">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-black text-slate-800 dark:text-slate-200">No {activeTab} Assignments</p>
            <p className="text-[11px] text-slate-400">All submissions in this tab are up to date.</p>
          </div>
        ) : (
          filtered.map((asg) => (
            <div
              key={asg.id}
              className="bg-white dark:bg-slate-800/90 p-4 rounded-[26px] border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        asg.priority === 'High'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : asg.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {asg.priority} PRIORITY
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{asg.subject}</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {asg.title}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500">{asg.faculty}</p>
                </div>

                <div className="text-right">
                  <span className="text-[9.5px] text-slate-400 uppercase font-extrabold">DUE DATE</span>
                  <p className="text-xs font-black text-rose-600 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    {asg.dueDate}
                  </p>
                </div>
              </div>

              {asg.status === 'Pending' ? (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${asg.readinessPercentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">
                      {asg.readinessPercentage}% Draft
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedAssignment(asg)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Solution</span>
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Submitted ({asg.submissionFile})
                  </span>
                  <span className="text-[10px] text-slate-400">{asg.submittedAt}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* File Upload Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Submit File</h3>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-1 rounded-full bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 p-6 rounded-2xl text-center space-y-2">
                <UploadCloud className="w-8 h-8 text-indigo-600 mx-auto" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {uploadFileName ? uploadFileName : 'Choose PDF file to upload'}
                </p>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFileName(e.target.files[0].name);
                    }
                  }}
                  className="hidden"
                  id="asg-file-input"
                />
                <label
                  htmlFor="asg-file-input"
                  className="inline-block bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Browse
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-md"
              >
                Confirm Submission
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
});
