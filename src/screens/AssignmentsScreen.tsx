import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId, Assignment } from '../types';
import {
  ArrowLeft,
  FileCheck,
  UploadCloud,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileText,
  X,
  Sparkles,
  Plus,
  FileCode,
  Download,
  Eye,
  Check,
  Building,
  User,
  Hash,
  BookOpen,
} from 'lucide-react';

interface AssignmentsScreenProps {
  assignments: Assignment[];
  navigate: (screen: ScreenId) => void;
  onSubmitAssignment: (assignmentId: string, fileName: string) => void;
}

export const AssignmentsScreen: React.FC<AssignmentsScreenProps> = ({
  assignments,
  navigate,
  onSubmitAssignment,
}) => {
  const [activeTab, setActiveTab] = useState<'Pending' | 'Submitted' | 'Completed'>('Pending');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Form states
  const [studentName, setStudentName] = useState('Saad Parkar');
  const [studentRollNo, setStudentRollNo] = useState('std-2026-88');
  const [selectedSubject, setSelectedSubject] = useState('Data Structures & Algorithms');
  const [customTitle, setCustomTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);

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

  const subjectsList = [
    { code: 'CS-101', name: 'Data Structures & Algorithms' },
    { code: 'CS-204', name: 'Operating Systems' },
    { code: 'CS-302', name: 'Database Management Systems' },
    { code: 'CS-401', name: 'Computer Networks' },
    { code: 'CS-505', name: 'Software Engineering' },
    { code: 'MA-201', name: 'Fourier Mathematics & Calculus' },
  ];

  const filtered = assignments.filter((a) => a.status === activeTab);

  const handleStartUploadProcess = (file: File | null, explicitName?: string) => {
    const finalName = explicitName || (file ? file.name : 'Assignment_Solution_V1.pdf');
    setUploadFileName(finalName);
    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const asgId = selectedAssignment ? selectedAssignment.id : `custom-${Date.now()}`;
    const finalFile = uploadFileName || 'Assignment_Submission.pdf';

    onSubmitAssignment(asgId, finalFile);

    setSubmissionSuccess({
      receiptId: `SUB-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      title: selectedAssignment ? selectedAssignment.title : (customTitle || 'Custom Assignment Solution'),
      subject: selectedSubject,
      fileName: finalFile,
      submittedAt: new Date().toLocaleString(),
    });

    setSelectedAssignment(null);
    setIsCustomModalOpen(false);
    setUploadFileName('');
    setCustomTitle('');
    setNotes('');
    setUploadFile(null);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-6 max-w-2xl mx-auto px-4 sm:px-6"
    >
      {/* Top Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-white hover:bg-slate-100 cursor-pointer shadow-2xs active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Assignments & Tasks
            </h1>
            <p className="text-xs text-slate-500 font-semibold">Real-time Portal Submissions</p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsCustomModalOpen(true);
            setSelectedAssignment(null);
          }}
          className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Upload</span>
        </button>
      </motion.div>

      {/* Submission Success Toast Card */}
      <AnimatePresence>
        {submissionSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-3xl shadow-lg flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div className="space-y-0.5">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider">
                  SUBMISSION VERIFIED
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  {submissionSuccess.title}
                </h4>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Receipt ID: <span className="font-mono font-bold">{submissionSuccess.receiptId}</span> • File: {submissionSuccess.fileName}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSubmissionSuccess(null)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Segmented Control Tabs */}
      <motion.div variants={itemVariants} className="bg-slate-100/90 dark:bg-slate-800/90 p-1.5 rounded-2xl flex justify-between gap-1 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
        {(['Pending', 'Submitted', 'Completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Assignments List */}
      <motion.div variants={itemVariants} className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-6 space-y-2"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">All caught up!</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                No {activeTab.toLowerCase()} assignments right now. Tap &quot;New Upload&quot; above to submit custom solutions.
              </p>
            </motion.div>
          ) : (
            filtered.map((asg, idx) => (
              <motion.div
                key={asg.id}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all space-y-3 relative overflow-hidden"
              >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[9.5px] font-black uppercase tracking-wider ${
                        asg.priority === 'High'
                          ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                          : asg.priority === 'Medium'
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      }`}
                    >
                      {asg.priority} PRIORITY
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-extrabold">
                      {asg.subject}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                    {asg.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">{asg.faculty}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9.5px] text-slate-400 uppercase font-black tracking-wider">DUE DATE</span>
                  <p className="text-xs font-black text-rose-600 dark:text-rose-400 flex items-center gap-1 justify-end">
                    <Clock className="w-3.5 h-3.5" />
                    {asg.dueDate}
                  </p>
                </div>
              </div>

              {/* Progress & Submit Bar */}
              {asg.status === 'Pending' ? (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${asg.readinessPercentage}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {asg.readinessPercentage}% Draft Ready
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedAssignment(asg);
                      setSelectedSubject(asg.subject);
                      setCustomTitle(asg.title);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4 stroke-[2.3]" />
                    <span>Upload Solution PDF/DOC</span>
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Submitted: {asg.submissionFile || 'Solution_Document.pdf'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{asg.submittedAt || 'Today 11:30 AM'}</span>
                </div>
              )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Upload Submission Wizard Modal */}
      {(selectedAssignment || isCustomModalOpen) && (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-[32px] p-6 max-w-lg w-full space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider">
                  STUDENT SUBMISSION PORTAL
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {selectedAssignment ? `Submit: ${selectedAssignment.title}` : 'Upload Custom Assignment'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedAssignment(null);
                  setIsCustomModalOpen(false);
                }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Student Metadata Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Student Full Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Roll Number / ID</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentRollNo}
                    onChange={(e) => setStudentRollNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Subject Selection Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Select Course Subject</span>
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {subjectsList.map((sub) => (
                    <option key={sub.code} value={sub.name}>
                      {sub.code} — {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title / Topic Name */}
              {!selectedAssignment && (
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                    Assignment Topic / Document Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lab Experiment 4 - Binary Search Trees"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleStartUploadProcess(e.dataTransfer.files[0]);
                  }
                }}
                className="border-2 border-dashed border-indigo-500/40 rounded-3xl p-6 text-center space-y-3 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-50 transition-colors cursor-pointer relative"
              >
                <UploadCloud className="w-10 h-10 text-indigo-600 mx-auto stroke-[2.2]" />
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">
                    {uploadFileName ? uploadFileName : 'Drag & drop solution file here'}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                    Supports PDF, DOCX, ZIP, PNG (Max file size 25MB)
                  </p>
                </div>

                <label className="inline-block px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 text-xs font-black shadow-xs hover:border-indigo-500 cursor-pointer active:scale-95 transition-all">
                  Browse Device Files
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleStartUploadProcess(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="space-y-1.5 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
                  <div className="flex justify-between items-center text-xs font-extrabold text-indigo-700 dark:text-indigo-300">
                    <span>Uploading attachment...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-indigo-200 dark:bg-indigo-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Remarks Notes */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                  Notes for Professor (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Attached complete source code and problem explanations on page 4."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:opacity-90 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all text-xs cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Submit Solution Document</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

