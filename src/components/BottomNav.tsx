import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ScreenId } from '../types';
import { Compass, CalendarDays, PieChart, QrCode, Grid3X3 } from 'lucide-react';
import { MoreMenuSheet } from './MoreMenuSheet';

interface BottomNavProps {
  activeScreen: ScreenId;
  navigate: (screen: ScreenId) => void;
  openSelectLectureModal: () => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = React.memo(({
  activeScreen,
  navigate,
  openSelectLectureModal,
  unreadCount = 0,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  if (
    ['splash', 'welcome', 'login', 'otp', 'auth_loading', 'profile_setup', 'auth_success'].includes(
      activeScreen
    )
  ) {
    return null;
  }

  const isHome = activeScreen === 'home';
  const isTimetable = activeScreen === 'timetable' || activeScreen === 'live_attendance' || activeScreen === 'today_attendance';
  const isAnalytics = ['analytics', 'attendance_analytics', 'results'].includes(activeScreen);

  const leftItems = [
    {
      id: 'home',
      label: 'Explore',
      icon: Compass,
      isActive: isHome && !isMoreOpen,
      onClick: () => {
        setIsMoreOpen(false);
        navigate('home');
      },
    },
    {
      id: 'timetable',
      label: 'Schedule',
      icon: CalendarDays,
      isActive: isTimetable && !isMoreOpen,
      onClick: () => {
        setIsMoreOpen(false);
        navigate('timetable');
      },
    },
  ];

  const rightItems = [
    {
      id: 'analytics',
      label: 'Metrics',
      icon: PieChart,
      isActive: isAnalytics && !isMoreOpen,
      onClick: () => {
        setIsMoreOpen(false);
        navigate('analytics');
      },
    },
    {
      id: 'more',
      label: 'Modules',
      icon: Grid3X3,
      isActive: isMoreOpen,
      onClick: () => setIsMoreOpen(!isMoreOpen),
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  return (
    <>
      {/* Organic More Apps Drawer */}
      <MoreMenuSheet
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        navigate={navigate}
        unreadCount={unreadCount}
      />

      {/* Floating Bottom Nav Container anchored to absolute bottom of the screen */}
      <nav
        id="bottom-navbar"
        aria-label="Main Navigation"
        className="bottom-nav fixed bottom-0 left-0 right-0 w-full z-50 select-none border-t border-slate-200/90 dark:border-slate-800/90 shadow-[0_-4px_24px_rgba(15,23,42,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)] transition-colors duration-300"
        style={{
          height: 'calc(5rem + env(safe-area-inset-bottom, 0px))',
          backgroundColor: 'var(--bg-primary)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          margin: 0,
        }}
      >
        {/* Inner Controls Row (Fixed 60px height, icons stay vertically centered) */}
        <div className="w-full sm:max-w-md mx-auto relative h-[60px] flex items-center justify-between px-4 sm:px-6">
          {/* Center Floating Action Button (Elevated QR Scanner) */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-5 z-20">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                setIsMoreOpen(false);
                openSelectLectureModal();
              }}
              className="w-[54px] h-[54px] rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/35 ring-4 ring-white dark:ring-slate-900 cursor-pointer transition-transform group active:scale-95"
              title="Scan QR Attendance - Select Lecture"
              aria-label="Scan QR Attendance"
            >
              <QrCode className="w-6 h-6 text-white stroke-[2.3] group-hover:rotate-12 transition-transform" />
            </motion.button>
          </div>

          {/* Left Group */}
          <div className="flex items-center gap-4 sm:gap-7">
            {leftItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.isActive;

              return (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.92 }}
                  onClick={item.onClick}
                  className={`relative flex flex-col items-center justify-center py-1 min-w-[56px] sm:min-w-[64px] min-h-[44px] group transition-colors cursor-pointer active:scale-95 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <Icon
                      className={`w-5.5 h-5.5 transition-transform duration-200 ${
                        isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[2] group-hover:scale-105'
                      }`}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="activeNavDot"
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-xs shadow-indigo-500"
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[11px] tracking-tight font-bold mt-0.5 transition-all ${
                      isActive ? 'font-black opacity-100' : 'opacity-75 group-hover:opacity-100'
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Right Group */}
          <div className="flex items-center gap-4 sm:gap-7">
            {rightItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.isActive;

              return (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.92 }}
                  onClick={item.onClick}
                  className={`relative flex flex-col items-center justify-center py-1 min-w-[56px] sm:min-w-[64px] min-h-[44px] group transition-colors cursor-pointer active:scale-95 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <Icon
                      className={`w-5.5 h-5.5 transition-transform duration-200 ${
                        isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[2] group-hover:scale-105'
                      }`}
                    />
                    {item.badge ? (
                      <span className="absolute -top-1 -right-2 min-w-4.5 h-4.5 px-1 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs">
                        {item.badge}
                      </span>
                    ) : null}

                    {isActive && (
                      <motion.div
                        layoutId="activeNavDot"
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-xs shadow-indigo-500"
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[11px] tracking-tight font-bold mt-0.5 transition-all ${
                      isActive ? 'font-black opacity-100' : 'opacity-75 group-hover:opacity-100'
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
});
