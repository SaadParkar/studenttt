import React from 'react';
import { motion } from 'motion/react';
import { ScreenId, StudentProfile } from '../types';
import { Bell, Settings, Sun, Moon, WifiOff, Calendar } from 'lucide-react';

interface HeaderProps {
  student: StudentProfile;
  activeScreen: ScreenId;
  navigate: (screen: ScreenId) => void;
  unreadNotificationsCount: number;
  isOffline: boolean;
  offlineQueueCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: (e?: React.MouseEvent) => void;
}

export const Header: React.FC<HeaderProps> = React.memo(({
  student,
  activeScreen,
  navigate,
  unreadNotificationsCount,
  isOffline,
  offlineQueueCount,
  isDarkMode,
  onToggleDarkMode,
}) => {
  if (['splash', 'welcome', 'login', 'otp', 'auth_loading', 'profile_setup', 'auth_success'].includes(activeScreen)) {
    return null;
  }

  const firstName = student.name.split(' ')[0] || 'Saad';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 sm:px-5 py-3 pt-safe-header flex justify-between items-center w-full transition-colors border-b border-slate-200/90 dark:border-slate-800/90 shadow-2xs">
      {/* Left: Avatar, Greeting & Semester Selector */}
      <div className="flex items-center gap-2.5 min-w-0 max-w-[62%]">
        <div
          className="flex items-center gap-2.5 cursor-pointer group active:scale-95 transition-transform min-w-0"
          onClick={() => navigate('profile')}
        >
          <div className="relative shrink-0">
            <div className="w-10.5 h-10.5 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 text-white font-black text-sm flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform ring-2 ring-white dark:ring-slate-800">
              SP
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 ring-2 ring-white dark:ring-slate-900 rounded-full shadow-xs"></span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <p className="text-[14px] sm:text-[15px] font-black text-slate-900 dark:text-slate-100 leading-tight truncate">
                Hi, <span className="font-black text-indigo-600 dark:text-indigo-400">{firstName}</span> 👋
              </p>
            </div>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-semibold truncate">
              {student.collegeName || 'SIES College'}
            </p>
          </div>
        </div>

        {/* Sem 5 Pill */}
        <div className="shrink-0 flex items-center">
          <span className="px-2.5 py-1 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[11px] sm:text-xs font-black tracking-tight shadow-2xs">
            Sem 5
          </span>
        </div>
      </div>

      {/* Right Actions: Offline, Theme, Notifications, Settings with 44px minimum touch targets */}
      <div className="flex items-center gap-2 shrink-0">
        {isOffline && (
          <div
            onClick={() => navigate('settings')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[11px] font-extrabold border border-amber-200 dark:border-amber-800 cursor-pointer animate-pulse"
          >
            <WifiOff className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Off ({offlineQueueCount})</span>
          </div>
        )}

        {/* Physics-based Theme Toggle Button (44px target) */}
        <button
          onClick={(e) => onToggleDarkMode(e)}
          className="w-10 h-10 sm:w-10.5 sm:h-10.5 flex items-center justify-center rounded-xl bg-slate-100/90 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/90 text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-indigo-50/50 dark:hover:bg-slate-700 cursor-pointer relative overflow-hidden active:scale-90 transition-transform"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            <motion.div
              initial={false}
              animate={{
                rotate: isDarkMode ? 180 : 0,
                scale: isDarkMode ? 0 : 1,
                opacity: isDarkMode ? 0 : 1,
              }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="w-5 h-5 text-indigo-600 dark:text-slate-300 stroke-[2.2]" />
            </motion.div>

            <motion.div
              initial={false}
              animate={{
                rotate: isDarkMode ? 0 : -180,
                scale: isDarkMode ? 1 : 0,
                opacity: isDarkMode ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="w-5 h-5 text-amber-400 stroke-[2.2]" />
            </motion.div>
          </div>
        </button>

        {/* Notifications Button (44px target) */}
        <button
          onClick={() => navigate('notifications')}
          className="relative w-10 h-10 sm:w-10.5 sm:h-10.5 flex items-center justify-center rounded-xl bg-slate-100/90 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/90 text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-indigo-50/50 dark:hover:bg-slate-700 active:scale-90 transition-transform cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-slate-700 dark:text-slate-200 stroke-[2.2]" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Settings Button (44px target) */}
        <button
          onClick={() => navigate('settings')}
          className="w-10 h-10 sm:w-10.5 sm:h-10.5 flex items-center justify-center rounded-xl bg-slate-100/90 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/90 text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-indigo-50/50 dark:hover:bg-slate-700 active:scale-90 transition-transform cursor-pointer"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-slate-700 dark:text-slate-200 stroke-[2.2]" />
        </button>
      </div>
    </header>
  );
});


