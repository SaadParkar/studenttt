import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[90%] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-indigo-100 dark:border-slate-800 rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`p-2 rounded-full ${
        type === 'success' ? 'bg-emerald-100 text-emerald-600' :
        type === 'error' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
      }`}>
        {type === 'success' && <CheckCircle2 className="w-5 h-5" />}
        {type === 'error' && <AlertCircle className="w-5 h-5" />}
        {type === 'info' && <Info className="w-5 h-5" />}
      </div>
      <p className="flex-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{message}</p>
      <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-full">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
