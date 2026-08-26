import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GoalItem } from '../../types';
import { Target, Award, Plus, CheckCircle2, Trophy, Clock } from 'lucide-react';

interface GoalsTabProps {
  goals: GoalItem[];
  onAddGoal?: (goal: Omit<GoalItem, 'id'>) => void;
}

export const GoalsTab: React.FC<GoalsTabProps> = React.memo(({ goals, onAddGoal }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Attendance' | 'CGPA' | 'Assignment' | 'Credits'>('Attendance');
  const [newTarget, setNewTarget] = useState(90);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    if (onAddGoal) {
      onAddGoal({
        title: newTitle,
        category: newCategory,
        currentValue: newCategory === 'Attendance' ? 88.5 : newCategory === 'CGPA' ? 8.9 : 10,
        targetValue: newTarget,
        unit: newCategory === 'Attendance' ? '%' : newCategory === 'CGPA' ? ' CGPA' : '',
        deadline: 'End of Semester',
        isCompleted: false,
      });
    }
    setShowAddModal(false);
    setNewTitle('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-4 transform-gpu"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white p-5 rounded-[28px] shadow-lg border border-emerald-400/30 flex justify-between items-center">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
            Milestone Tracker
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Semester Targets & Goals
          </h2>
          <p className="text-xs text-emerald-100 font-medium">
            4 Active Targets • 92% Average Accomplishment
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-2xl bg-white text-emerald-800 font-black text-xs flex items-center gap-1.5 shadow-md hover:bg-emerald-50 cursor-pointer active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {goals.map((goal) => {
          const progress = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));

          return (
            <div
              key={goal.id}
              className="bg-white dark:bg-slate-800/90 p-4 rounded-[26px] border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[9px] font-black uppercase">
                      {goal.category}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                      {goal.title}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                    {goal.currentValue}{goal.unit} / {goal.targetValue}{goal.unit}
                  </span>
                  <span className="block text-[10px] font-bold text-emerald-600">
                    {progress}% Achieved
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10.5px] font-medium text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Deadline: {goal.deadline}
                </span>
                {progress >= 100 && (
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Goal Completed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Add New Goal</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Goal Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Reach 92% in Operating Systems"
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Target Value</label>
                <input
                  type="number"
                  value={newTarget}
                  onChange={(e) => setNewTarget(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 mt-1"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
});
