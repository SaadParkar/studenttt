import React, { useState, useEffect } from 'react';
import { ScreenId } from '../types';
import {
  ArrowLeft,
  WifiOff,
  RefreshCw,
  Sun,
  Moon,
  Shield,
  HelpCircle,
  Smartphone,
  CheckCircle2,
  Lock,
  LogOut,
  Cpu,
  ShieldAlert,
  Bell,
  Scan,
  Zap,
  Radio,
  Database,
  Volume2,
  Trash2,
  Wifi,
  Sparkles,
} from 'lucide-react';
import { getPersistentDeviceId } from '../lib/deviceId';

interface SettingsScreenProps {
  navigate: (screen: ScreenId) => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  autoSync: boolean;
  setAutoSync: (val: boolean) => void;
  offlineQueueCount: number;
  onSyncNow: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isLiveSessionActive?: boolean;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  navigate,
  isOffline,
  setIsOffline,
  autoSync,
  setAutoSync,
  offlineQueueCount,
  onSyncNow,
  isDarkMode,
  onToggleDarkMode,
  isLiveSessionActive = true,
}) => {
  const [boundDeviceId, setBoundDeviceId] = useState<string>('binding...');
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [livenessLevel, setLivenessLevel] = useState<'high' | 'standard'>('high');
  const [classReminders, setClassReminders] = useState(true);
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);
  const [beaconAutoConnect, setBeaconAutoConnect] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [cacheClearedMsg, setCacheClearedMsg] = useState(false);

  useEffect(() => {
    getPersistentDeviceId().then(setBoundDeviceId);
  }, []);

  const handleClearCache = () => {
    setCacheClearedMsg(true);
    setTimeout(() => setCacheClearedMsg(false), 2500);
  };

  return (
    <div className="space-y-5 pb-6 max-w-2xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => navigate('home')}
          className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white hover:bg-slate-50 cursor-pointer shadow-2xs transition-transform active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            OS Preferences & Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Theme, Security, Offline Engine & System Controls</p>
        </div>
      </div>

      {/* 1. Theme & Visual Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Appearance & Visual Theme</span>
        </h3>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            {isDarkMode ? <Moon className="w-5 h-5 text-indigo-400 shrink-0" /> : <Sun className="w-5 h-5 text-amber-500 shrink-0" />}
            <div>
              <p className="text-xs font-extrabold text-slate-900 dark:text-white">Dark Mode Theme</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {isDarkMode ? 'Eye-safe dark canvas enabled' : 'Clean high-contrast light theme active'}
              </p>
            </div>
          </div>
          <button
            onClick={onToggleDarkMode}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
              isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Haptic Feedback Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-slate-900 dark:text-white">Tactile Haptic Vibrations</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Vibrate on attendance scan & QR verification</p>
            </div>
          </div>
          <button
            onClick={() => setHapticFeedback(!hapticFeedback)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
              hapticFeedback ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                hapticFeedback ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Biometrics & Security Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
          <Scan className="w-4 h-4" />
          <span>Biometrics & Anti-Spoof Guard</span>
        </h3>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-purple-500 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-slate-900 dark:text-white">Face ID / Biometric Quick Unlock</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Use hardware biometric sensors for instant login</p>
            </div>
          </div>
          <button
            onClick={() => setBiometricsEnabled(!biometricsEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
              biometricsEnabled ? 'bg-purple-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                biometricsEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Liveness Check Sensitivity Selection */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-slate-900 dark:text-white">Liveness Verification Mode</span>
            <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase">3D Depth Active</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              onClick={() => setLivenessLevel('high')}
              className={`py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                livenessLevel === 'high'
                  ? 'bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-300 font-black'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              High Security (3D Mesh)
            </button>
            <button
              onClick={() => setLivenessLevel('standard')}
              className={`py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                livenessLevel === 'standard'
                  ? 'bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-300 font-black'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              Fast Scan Mode
            </button>
          </div>
        </div>
      </div>

      {/* 3. Offline & Sync Settings Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
          <WifiOff className="w-4 h-4 text-cyan-500" />
          <span>Offline Storage & Connectivity Engine</span>
        </h3>

        {/* Offline Mode Toggle */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-slate-900 dark:text-white">Simulate Offline Mode</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Queue attendance scans locally without network</p>
            </div>
          </div>
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
              isOffline ? 'bg-amber-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                isOffline ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Auto Sync Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-slate-900 dark:text-white">Auto-Sync When Online</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Sync pending attendance records automatically</p>
            </div>
          </div>
          <button
            onClick={() => setAutoSync(!autoSync)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
              autoSync ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                autoSync ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Sync Action */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-500 dark:text-slate-400">Queued Scans:</span>
            <span className="ml-1 font-black text-amber-600 dark:text-amber-400">{offlineQueueCount} Pending</span>
          </div>

          <button
            onClick={onSyncNow}
            disabled={offlineQueueCount === 0}
            className="px-4 py-2 bg-indigo-600 disabled:opacity-50 hover:bg-indigo-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Force Sync Now</span>
          </button>
        </div>
      </div>

      {/* 4. Campus Beacon & Auto Wi-Fi */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <Radio className="w-4 h-4" />
          <span>Campus Beacon & Wi-Fi Passpoint</span>
        </h3>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <Wifi className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-slate-900 dark:text-white">Auto-Connect Campus Wi-Fi</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Automatic 802.1x Passpoint authentication for SIES-CAMPUS</p>
            </div>
          </div>
          <button
            onClick={() => setBeaconAutoConnect(!beaconAutoConnect)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
              beaconAutoConnect ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                beaconAutoConnect ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 5. Hardware & Device Binding Info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4" />
            <span>Bound Hardware Device</span>
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black border border-emerald-500/20">
            ACTIVE BINDING
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
          Attendance records are hardware-verified using this unique device identifier to prevent proxy scans.
        </p>

        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-between">
          <span className="truncate mr-2">{boundDeviceId}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        </div>
      </div>

      {/* 6. PWA Cache & Local Storage */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-indigo-500" />
            <span>PWA Local Storage Cache</span>
          </h3>
          <span className="text-[11px] font-mono font-bold text-slate-500">14.2 MB / 500 MB</span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          Offline timetable, encrypted student passes, and lecture notes cached on device.
        </p>

        {cacheClearedMsg ? (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold text-center border border-emerald-500/20 animate-fadeIn">
            Local PWA Database & Timetable Cache Cleared!
          </div>
        ) : (
          <button
            onClick={handleClearCache}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Purge PWA Local Cache</span>
          </button>
        )}
      </div>

      {/* 7. Session Lock & Logout Security Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Account Security & Session Lock
        </h3>

        {isLiveSessionActive ? (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-extrabold text-amber-900 dark:text-amber-200">
                Session Soft-Lock Active
              </p>
              <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80 font-medium leading-relaxed">
                A live attendance window is active for your class ({'CS201 Data Structures'}). Logging out is soft-locked to prevent session tampering during active lectures.
              </p>
            </div>
          </div>
        ) : null}

        <button
          onClick={() => {
            if (isLiveSessionActive) {
              alert('Soft Session-Lock: Live lecture attendance is currently active for your class. Logging out now will be flagged in portal logs.');
            } else {
              navigate('welcome');
            }
          }}
          className={`w-full py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
            isLiveSessionActive
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900 hover:bg-rose-100'
          }`}
        >
          {isLiveSessionActive ? <Lock className="w-4 h-4 text-amber-500" /> : <LogOut className="w-4 h-4" />}
          <span>{isLiveSessionActive ? 'Logout Soft-Locked (Session Active)' : 'Log Out of Student Account'}</span>
        </button>
      </div>

      {/* App Info Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
          About Campus OS
        </h3>

        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-slate-500 dark:text-slate-300 font-bold">PWA Build Version</span>
          <span className="font-black text-slate-900 dark:text-white">v2.4.1 (Flagship Edition)</span>
        </div>

        <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-300 font-bold">Architecture</span>
          <span className="font-black text-indigo-600 dark:text-indigo-400">Aurora Design Engine</span>
        </div>
      </div>
    </div>
  );
};

