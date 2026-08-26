import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  CheckCircle2,
  GraduationCap,
  TrendingUp,
  Target,
  FileText,
  BookMarked,
  Award,
  Sparkles,
} from 'lucide-react';

export type DashboardTab =
  | 'overview'
  | 'attendance'
  | 'academics'
  | 'performance'
  | 'goals'
  | 'assignments'
  | 'library'
  | 'credits'
  | 'ai_insights';

interface TabItem {
  id: DashboardTab;
  label: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'attendance', label: 'Attendance', icon: CheckCircle2 },
  { id: 'academics', label: 'Academics', icon: GraduationCap },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'assignments', label: 'Assignments', icon: FileText },
  { id: 'library', label: 'Library', icon: BookMarked },
  { id: 'credits', label: 'Credits', icon: Award },
  { id: 'ai_insights', label: 'AI Insights', icon: Sparkles },
];

interface DashboardSecondaryNavProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
}

export const DashboardSecondaryNav: React.FC<DashboardSecondaryNavProps> = React.memo(({
  activeTab,
  onSelectTab,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Auto-scroll selected tab into view smoothly
  useEffect(() => {
    const selectedBtn = tabRefs.current[activeTab];
    if (selectedBtn && containerRef.current) {
      const container = containerRef.current;
      const btnLeft = selectedBtn.offsetLeft;
      const btnWidth = selectedBtn.offsetWidth;
      const containerWidth = container.offsetWidth;

      container.scrollTo({
        left: btnLeft - containerWidth / 2 + btnWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [activeTab]);

  return (
    <div className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800/90 py-2.5 px-3 transition-colors shadow-2xs">
      <div
        ref={containerRef}
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-1 max-w-full"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors duration-150 select-none cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
