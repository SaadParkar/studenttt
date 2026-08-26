import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId } from '../types';
import {
  X,
  FileText,
  BookOpen,
  Bell,
  Calendar,
  Award,
  BookMarked,
  Clock,
  Radio,
  Target,
  TrendingUp,
  User,
  Settings,
  Search,
  RotateCw,
  Cloud,
  Sparkles,
  Zap,
} from 'lucide-react';

interface MoreMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (screen: ScreenId) => void;
  unreadCount?: number;
}

interface MenuItem {
  id: ScreenId;
  title: string;
  ext: string;
  category: string;
  icon: React.ElementType;
  gradient: string;
  shadow: string;
  iconColor: string;
  badge?: number | string;
}

export const MoreMenuSheet: React.FC<MoreMenuSheetProps> = React.memo(({
  isOpen,
  onClose,
  navigate,
  unreadCount = 0,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'academic' | 'campus'>('all');

  const menuItems: MenuItem[] = [
    {
      id: 'assignments',
      title: 'Assignments',
      ext: '.docx',
      category: 'academic',
      icon: FileText,
      gradient: 'from-blue-500/15 via-indigo-500/10 to-transparent',
      shadow: 'shadow-xs',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'class_details',
      title: 'Syllabus',
      ext: '.syll',
      category: 'academic',
      icon: BookOpen,
      gradient: 'from-cyan-500/15 via-teal-500/10 to-transparent',
      shadow: 'shadow-xs',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
    },
    {
      id: 'notifications',
      title: 'Alerts',
      ext: '.notif',
      category: 'campus',
      icon: Bell,
      gradient: 'from-rose-500/15 via-pink-500/10 to-transparent',
      shadow: 'shadow-xs',
      iconColor: 'text-rose-600 dark:text-rose-400',
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      id: 'events',
      title: 'Campus Fest',
      ext: '.event',
      category: 'campus',
      icon: Calendar,
      gradient: 'from-amber-500/15 via-orange-500/10 to-transparent',
      shadow: 'shadow-xs',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 'credits',
      title: 'Credits',
      ext: '.points',
      category: 'academic',
      icon: Award,
      gradient: 'from-emerald-500/15 via-teal-500/10 to-transparent',
      shadow: 'shadow-xs',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'library',
      title: 'Library',
      ext: '.books',
      category: 'academic',
      icon: BookMarked,
      gradient: 'from-purple-500/15 via-indigo-500/10 to-transparent',
      shadow: 'shadow-xs',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      id: 'today_attendance',
      title: 'Today Log',
      ext: '.records',
      category: 'campus',
      icon: Clock,
      gradient: 'from-violet-500/15 via-purple-500/10 to-transparent',
      shadow: 'shadow-xs',
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      id: 'live_attendance',
      title: 'Faculty QR Console',
      ext: '.lock 🔒',
      category: 'campus',
      icon: Radio,
      gradient: 'from-amber-500/15 via-rose-500/10 to-transparent',
      shadow: 'shadow-xs',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 'goals',
      title: 'Academic Goals',
      ext: '.target',
      category: 'academic',
      icon: Target,
      gradient: 'from-teal-500/15 via-emerald-500/10 to-transparent',
      shadow: 'shadow-xs',
      iconColor: 'text-teal-600 dark:text-teal-400',
    },
    {
      id: 'results',
      title: 'CGPA Results',
      ext: '.gpa',
      category: 'academic',
      icon: TrendingUp,
      gradient: 'from-indigo-500/15 via-blue-500/10 to-transparent',
      shadow: 'shadow-xs',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 'profile',
      title: 'ID Profile',
      ext: '.identity',
      category: 'campus',
      icon: User,
      gradient: 'from-pink-500/15 via-rose-500/10 to-transparent',
      shadow: 'shadow-xs',
      iconColor: 'text-pink-600 dark:text-pink-400',
    },
    {
      id: 'settings',
      title: 'Preferences',
      ext: '.system',
      category: 'campus',
      icon: Settings,
      gradient: 'from-slate-500/15 via-zinc-500/10 to-transparent',
      shadow: 'shadow-xs',
      iconColor: 'text-slate-600 dark:text-slate-300',
    },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesTab = selectedTab === 'all' || item.category === selectedTab;
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ext.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSelect = (screenId: ScreenId) => {
    navigate(screenId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/75 dark:bg-slate-950/85 transition-opacity"
          />

          {/* S-Curve Split Screen Panel Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative w-full max-w-md mx-auto h-[88vh] flex flex-col rounded-t-[36px] overflow-hidden shadow-2xl z-10 select-none transform-gpu"
          >
            {/* TOP ZONE: Dark/Indigo Executive Top Header Area */}
            <div className="relative bg-[#111625] dark:bg-[#0B0F19] text-white pt-3 px-6 pb-8 shrink-0 z-10 transition-colors">
              {/* Top Handle Pill */}
              <div
                onClick={onClose}
                className="w-full flex flex-col items-center justify-center pb-2 pt-0.5 cursor-pointer group"
              >
                <div className="w-12 h-1 rounded-full bg-white/30 group-hover:bg-white/60 active:bg-white/80 transition-colors" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity mt-1">
                  Tap to close
                </span>
              </div>

              {/* Header Title & Close Button */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl border border-indigo-400/30 overflow-hidden shadow-inner shrink-0">
                    <img
                      src="/campus_os_icon.jpg"
                      alt="Campus OS"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-black tracking-tight text-white">
                        Campus OS Apps
                      </h2>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        12 Modules
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Select an application to open
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-slate-300 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dark Search Input */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search modules (.docx, .syll, alerts)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-inner transition-all"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 text-[11px] font-extrabold">
                <button
                  onClick={() => setSelectedTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                    selectedTab === 'all'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white/10 text-slate-400 hover:text-white hover:bg-white/15'
                  }`}
                >
                  All Apps
                </button>
                <button
                  onClick={() => setSelectedTab('academic')}
                  className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                    selectedTab === 'academic'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white/10 text-slate-400 hover:text-white hover:bg-white/15'
                  }`}
                >
                  Academics
                </button>
                <button
                  onClick={() => setSelectedTab('campus')}
                  className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                    selectedTab === 'campus'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white/10 text-slate-400 hover:text-white hover:bg-white/15'
                  }`}
                >
                  Campus Life
                </button>
              </div>
            </div>

            {/* ORGANIC S-CURVE LIQUID SVG DIVIDER */}
            <div className="relative w-full h-12 -mt-7 z-20 pointer-events-none select-none">
              <svg
                className="w-full h-12 text-slate-100 dark:text-[#0F172A] fill-current"
                viewBox="0 0 400 48"
                preserveAspectRatio="none"
              >
                <path d="M 0,48 L 0,28 C 90,52 170,-8 280,32 C 340,50 380,20 400,10 L 400,48 Z" />
              </svg>
            </div>

            {/* BOTTOM ZONE: Light Porcelain / Dark Slate Neumorphic Clay Grid */}
            <div className="relative flex-1 bg-slate-100 dark:bg-[#0F172A] px-5 pt-1 pb-6 overflow-y-auto custom-scrollbar flex flex-col justify-between transition-colors transform-gpu">
              {/* 3-Column Soft Grid */}
              <div className="grid grid-cols-3 gap-3 py-2">
                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className="relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs hover:border-indigo-400 active:scale-95 transition-all group cursor-pointer overflow-hidden"
                    >
                      {/* Inner Glow Gradient Accent */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-b ${item.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
                      />

                      {/* Floating Neumorphic Squircle Disk for Icon */}
                      <div className="relative w-11 h-11 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                        <Icon className={`w-5.5 h-5.5 ${item.iconColor}`} />

                        {/* Optional Alert Badge */}
                        {item.badge && (
                          <span className="absolute -top-1 -right-1.5 bg-rose-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-2xs">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* App Name and File Extension Label */}
                      <span className="relative z-10 text-xs font-black text-slate-900 dark:text-white tracking-tight text-center truncate w-full">
                        {item.title}
                      </span>
                      <span className="relative z-10 text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 lowercase tracking-wider">
                        {item.ext}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Close Button */}
              <div
                className="w-full flex justify-center pt-3 shrink-0"
                style={{
                  paddingBottom: 'max(1rem, calc(0.75rem + env(safe-area-inset-bottom, 16px)))',
                }}
              >
                <button
                  onClick={onClose}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-white shadow-sm active:scale-95 flex items-center justify-center cursor-pointer transition-transform group"
                  title="Close More Sheet"
                  aria-label="Close"
                >
                  <RotateCw className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400 group-hover:rotate-180 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

