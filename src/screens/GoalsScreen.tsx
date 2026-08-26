import React, { useState } from 'react';
import { ScreenId, GoalItem } from '../types';
import { ArrowLeft, Target, Plus, CheckCircle2, Award, Sparkles, X } from 'lucide-react';

interface GoalsScreenProps {
  goals: GoalItem[];
  navigate: (screen: ScreenId) => void;
  onAddGoal: (newGoal: GoalItem) => void;
}

export const GoalsScreen: React.FC<GoalsScreenProps> = ({ goals, navigate, onAddGoal }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('95');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    onAddGoal({
      id: `goal-${Date.now()}`,
      title: newTitle,
      category: 'Attendance',
      currentValue: 80,
      targetValue: Number(newTarget),
      unit: '%',
      deadline: 'Dec 2026',
      isCompleted: false,
    });

    setNewTitle('');
    setShowAddModal(false);
  };

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
              Goals & Badges
            </h1>
            <p className="text-xs text-[#64748B] font-medium">Academic Targets & Achievements</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#6366F1] hover:bg-indigo-600 text-white p-2.5 rounded-full flex items-center gap-1 text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="pr-1">Add Goal</span>
        </button>
      </div>

      {/* Badges Carousel */}
      <div className="bg-gradient-to-r from-[#F3E8FF] via-white to-[#EEF2FF] text-[#0F172A] rounded-[28px] p-5 shadow-md border border-[#E2E8F0] space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#7C3AED]">
          Earned Badges
        </h3>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          <div className="bg-white px-4 py-3 rounded-2xl flex items-center gap-3 min-w-[170px] border border-[#E2E8F0] shadow-2xs">
            <Award className="w-7 h-7 text-[#D97706]" />
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Dean's List</p>
              <p className="text-[9px] text-[#64748B]">Top 3 CGPA Holder</p>
            </div>
          </div>

          <div className="bg-white px-4 py-3 rounded-2xl flex items-center gap-3 min-w-[170px] border border-[#E2E8F0] shadow-2xs">
            <Sparkles className="w-7 h-7 text-[#06B6D4]" />
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Hackathon Winner</p>
              <p className="text-[9px] text-[#64748B]">1st Place AI Fest</p>
            </div>
          </div>

          <div className="bg-white px-4 py-3 rounded-2xl flex items-center gap-3 min-w-[170px] border border-[#E2E8F0] shadow-2xs">
            <CheckCircle2 className="w-7 h-7 text-[#22C55E]" />
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Attendance Streak</p>
              <p className="text-[9px] text-[#64748B]">14 Days Perfect</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Goals List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#0F172A]">Active Milestone Targets</h3>

        {goals.map((g) => (
          <div
            key={g.id}
            className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#7C3AED] text-[9px] font-extrabold uppercase">
                  {g.category}
                </span>
                <h4 className="text-sm font-extrabold text-[#0F172A] mt-1">
                  {g.title}
                </h4>
              </div>
              <span className="text-xs font-bold text-[#6366F1]">
                {g.currentValue} / {g.targetValue} {g.unit}
              </span>
            </div>

            <div className="w-full bg-[#F1F5F9] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#6366F1] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (g.currentValue / g.targetValue) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#E2E8F0] shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#0F172A]">Add Academic Goal</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#0F172A]">Goal Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Maintain 95% in Algorithms"
                  className="w-full p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-xs font-semibold mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A]">Target Value (%)</label>
                <input
                  type="number"
                  required
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-xs font-semibold mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#6366F1] hover:bg-indigo-600 text-white font-bold py-3 rounded-2xl text-xs shadow-md mt-2"
              >
                Save Goal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
