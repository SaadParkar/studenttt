import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="w-full h-full min-h-[100dvh] flex flex-col bg-white dark:bg-[#060911] text-[#0F172A] dark:text-white font-sans antialiased selection:bg-[#6366F1] selection:text-white relative transition-colors duration-300">
      {/* Background Soft Glowing Ambient Light Orbs - pointer-events-none and static for max performance */}
      <div className="fixed top-[-80px] left-[-80px] w-96 h-96 bg-indigo-300/10 dark:bg-indigo-900/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-[30%] right-[-100px] w-80 h-80 bg-sky-300/10 dark:bg-sky-900/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-[-60px] left-[10%] w-96 h-96 bg-purple-300/10 dark:bg-purple-900/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="w-full sm:max-w-md sm:mx-auto flex-1 flex flex-col relative bg-white dark:bg-[#060911] sm:shadow-2xl z-10 transition-colors duration-300 min-h-0 h-full">
        <div className="flex-1 flex flex-col relative w-full h-full min-h-0 bg-white dark:bg-[#060911]">
          {children}
        </div>
      </div>
    </div>
  );
};
