import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import {
  X,
  XCircle,
  Flashlight,
  RefreshCw,
  Edit3,
  HelpCircle,
  WifiOff,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Radio,
  MapPin,
  Sparkles,
  Lock,
  Cpu,
  QrCode,
  KeyRound,
} from 'lucide-react';
import { Lecture } from '../types';
import { getPersistentDeviceId } from '../lib/deviceId';
import { submitAttendanceScan } from '../lib/supabase';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLecture: Lecture;
  onAttendanceSuccess: (lectureId: string, isOffline: boolean) => void;
  isOffline: boolean;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  currentLecture,
  onAttendanceSuccess,
  isOffline,
}) => {
  const [scanMode, setScanMode] = useState<'qr' | 'otp'>('qr');
  const [otpInput, setOtpInput] = useState('');
  const [cameraAllowed, setCameraAllowed] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [activeCodeLabel, setActiveCodeLabel] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string>('binding-device...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    getPersistentDeviceId().then((id) => setDeviceId(id));
  }, []);

  // Web Audio Synth for High-Tech Beep Effect
  const playBeep = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12); // E6 high chirp

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio context blocked or unsupported
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraAllowed(false);
        return;
      }

      let stream: MediaStream | null = null;
      // Sequential fallback array for maximum phone device compatibility (preferring rear/back camera)
      const attempts = facingMode === 'environment'
        ? [
            { video: { facingMode: { exact: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } } },
            { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } },
            { video: { facingMode: 'environment' } },
            { video: true },
          ]
        : [
            { video: { facingMode: 'user' } },
            { video: true },
          ];

      for (const constraint of attempts) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraint);
          if (stream) break;
        } catch (e) {
          console.log('Camera constraint attempt failed, trying next fallback:', e);
        }
      }

      if (stream) {
        streamRef.current = stream;
        setCameraAllowed(true);
        // Attach stream immediately if video element is ready
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.setAttribute('webkit-playsinline', 'true');
          videoRef.current.play().catch((e) => console.warn('Video play error:', e));
        }
      } else {
        setCameraAllowed(false);
      }
    } catch (err) {
      console.warn('Camera access fallback active:', err);
      setCameraAllowed(false);
    }
  }, [facingMode, stopCamera]);

  // Secondary effect ensuring video stream is bound to videoRef element
  useEffect(() => {
    if (isOpen && streamRef.current && videoRef.current) {
      const v = videoRef.current;
      if (v.srcObject !== streamRef.current) {
        v.srcObject = streamRef.current;
      }
      v.setAttribute('playsinline', 'true');
      v.setAttribute('webkit-playsinline', 'true');
      v.play().catch((e) => console.warn('Camera stream play retry note:', e));
    }
  }, [isOpen, cameraAllowed, scanMode]);

  // Flashlight / Torch Hardware Toggle
  const toggleFlashlight = async () => {
    const nextState = !flashOn;
    setFlashOn(nextState);

    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track && 'applyConstraints' in track) {
        try {
          await (track as unknown as { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
            advanced: [{ torch: nextState }],
          });
        } catch {
          // Torch not supported by this camera hardware
        }
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScanSuccess(false);
      setIsScanning(true);
      setActiveCodeLabel(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  const handleSimulateScan = useCallback(async (label?: string, scannedPayload?: string) => {
    if (scanSuccess) return;
    setErrorMessage(null);

    const currentDeviceId = deviceId.startsWith('binding')
      ? await getPersistentDeviceId()
      : deviceId;

    const qrToken = scannedPayload || `TOKEN_${Date.now()}_SLOT_${Math.floor(Date.now() / 4000)}`;

    // Submit payload to Edge Function / Supabase / Local Queue
    const scanResult = await submitAttendanceScan(
      {
        qr_string: qrToken,
        student_id: 'std-2026-88',
        student_name: 'Saad Parkar',
        roll_no: '#ST-992044',
        lecture_id: currentLecture.id,
        device_id: currentDeviceId,
        method: scanMode === 'otp' ? 'otp' : 'qr',
      },
      isOffline
    );

    if (!scanResult.success) {
      setIsScanning(false);
      setErrorMessage(
        scanResult.message || 'Session Expired or Invalid QR Code. Please check with your faculty.'
      );
      return;
    }

    setIsScanning(false);
    setScanSuccess(true);
    setActiveCodeLabel(label || 'Faculty Session QR Code');
    playBeep();

    setTimeout(() => {
      onAttendanceSuccess(currentLecture.id, isOffline);
      setTimeout(() => {
        onClose();
      }, 700);
    }, 1100);
  }, [scanSuccess, playBeep, deviceId, isOffline, onAttendanceSuccess, currentLecture.id, onClose, scanMode]);

  // Real-time camera QR decoding loop using jsQR
  useEffect(() => {
    if (!isOpen || !cameraAllowed || scanSuccess) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    let isSubmitting = false;

    const scanFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && video.readyState === video.HAVE_ENOUGH_DATA && canvas && !isSubmitting) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });
          if (code && code.data && code.data.trim().length > 0) {
            isSubmitting = true;
            handleSimulateScan(`QR Scanned: ${code.data.slice(0, 18)}...`, code.data);
            return;
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(scanFrame);
    };

    animFrameRef.current = requestAnimationFrame(scanFrame);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isOpen, cameraAllowed, scanSuccess, handleSimulateScan]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode) return;
    setShowManualModal(false);
    handleSimulateScan(`Dynamic Code #${manualCode}`, `PASSCODE_${manualCode}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col justify-between overflow-hidden text-white font-sans transition-all duration-300 transform-gpu select-none">
      {/* Background Cyber Grid Matrix */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:2rem_2rem]" />

      {/* Top Header Controls & HUD Telemetry */}
      <div className="pt-6 sm:pt-8 pb-3 px-4 sm:px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/95 via-black/80 to-transparent backdrop-blur-md border-b border-slate-800/40">
        {/* Prominent Glowing Close/Cancel Button - Left Side */}
        <button
          onClick={onClose}
          aria-label="Close Scanner"
          className="group flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-rose-500/25 hover:bg-rose-500/40 border-2 border-rose-500/80 text-rose-100 font-black text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(244,63,94,0.6)] hover:shadow-[0_0_30px_rgba(244,63,94,0.9)] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <div className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md group-hover:rotate-90 transition-transform duration-300">
            <X className="w-4.5 h-4.5 stroke-[3]" />
          </div>
          <span className="font-black tracking-widest text-[11px] drop-shadow-[0_0_6px_rgba(244,63,94,0.9)]">
            CLOSE
          </span>
        </button>

        <div className="text-center space-y-0.5">
          <div className="flex items-center justify-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <h2 className="text-xs sm:text-sm font-black tracking-wider uppercase text-slate-100">
              AI Attendance Scanner
            </h2>
          </div>
          <p className="text-[10.5px] text-cyan-300/80 font-mono tracking-tight">
            {currentLecture.title} • {currentLecture.room}
          </p>
        </div>

        {/* Telemetry Badge & Right Side Quick Close */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 bg-indigo-950/80 border border-indigo-500/40 px-2.5 py-1 rounded-full text-[9px] font-mono text-indigo-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>60 FPS</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 px-2 py-0.5 rounded-md text-[8.5px] font-mono text-cyan-300">
              <Cpu className="w-2.5 h-2.5 text-cyan-400" />
              <span className="truncate max-w-[90px]">{deviceId}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Exit Scanner"
            className="w-10 h-10 rounded-2xl bg-slate-900/90 border border-rose-500/50 hover:border-rose-400 text-rose-300 flex items-center justify-center hover:bg-rose-950/50 transition-all active:scale-95 shadow-[0_0_12px_rgba(244,63,94,0.4)] cursor-pointer"
            title="Exit Scanner"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Top Mode Switcher Tabs: Scan QR vs Type 5-Digit OTP */}
      <div className="z-30 px-4 flex justify-center bg-black/40 backdrop-blur-xs py-1">
        <div className="bg-slate-900/90 border border-slate-700/80 p-1 rounded-2xl flex items-center gap-1 shadow-2xl">
          <button
            type="button"
            onClick={() => setScanMode('qr')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              scanMode === 'qr'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg border border-indigo-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Live QR</span>
          </button>
          <button
            type="button"
            onClick={() => setScanMode('otp')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              scanMode === 'otp'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg border border-indigo-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Type 5-Digit OTP</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Area */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden p-4">
        {scanMode === 'otp' ? (
          /* Dedicated 5-Digit OTP Type View */
          <div className="z-30 max-w-sm w-full bg-slate-900/95 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center mx-auto text-indigo-400 shadow-lg">
              <KeyRound className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white tracking-tight">Enter Live 5-Digit OTP</h3>
              <p className="text-xs text-slate-400 mt-1">
                Type the 5-digit dynamic OTP displayed on Prof. {currentLecture.professor}'s screen.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (otpInput.trim().length >= 4) {
                  handleSimulateScan(`Verified Live OTP #${otpInput}`, `OTP_${otpInput}`);
                }
              }}
              className="space-y-4"
            >
              <input
                type="text"
                maxLength={5}
                placeholder="e.g. 78412"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-950 border-2 border-indigo-500/50 rounded-2xl px-4 py-4 text-center font-mono text-3xl font-black tracking-[0.3em] text-emerald-400 focus:outline-none focus:border-indigo-400 shadow-inner"
              />

              <button
                type="submit"
                disabled={otpInput.trim().length < 4}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-40 text-white font-extrabold py-3.5 rounded-2xl transition-all shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                <span>Verify & Mark Present</span>
              </button>
            </form>

            <p className="text-[10.5px] text-slate-400 font-mono">
              Note: OTP refreshes every 4s on classroom screen.
            </p>

            {/* OTP Mode Explicit Cancel Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-rose-500/20 hover:bg-rose-500/35 border-2 border-rose-500/60 text-rose-200 font-extrabold py-3 rounded-2xl transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)] active:scale-98 cursor-pointer flex items-center justify-center gap-2 text-xs"
            >
              <X className="w-4 h-4 stroke-[3]" />
              <span>Cancel & Exit Scanner</span>
            </button>
          </div>
        ) : (
          /* Live QR Camera View */
          <>
            {/* FLOATING EASY-CLICK LEFT SIDE CANCEL BUTTON - Low down, high visibility */}
            <div className="absolute left-3 top-3.5 z-40">
              <button
                onClick={onClose}
                aria-label="Cancel Scanner"
                className="group flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-950/90 hover:bg-rose-950/90 border-2 border-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] hover:shadow-[0_0_30px_rgba(244,63,94,0.9)] backdrop-blur-md transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md group-hover:rotate-90 transition-transform">
                  <X className="w-4 h-4 stroke-[3]" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-[11px] font-black tracking-wider uppercase text-rose-200 leading-tight">
                    CANCEL
                  </span>
                  <span className="text-[8px] font-mono text-slate-400 leading-none">
                    Exit Camera
                  </span>
                </div>
              </button>
            </div>
            {/* Real Video Stream element - always mounted in DOM for immediate stream attachment */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                cameraAllowed ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            />
            <canvas ref={canvasRef} className="hidden" />

            {!cameraAllowed && (
              <div className="absolute inset-0 w-full h-full bg-slate-950 flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen scale-105 filter saturate-150 contrast-125"
                  style={{
                    backgroundImage:
                      'url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop")',
                  }}
                />
                {/* Ambient Tech Gradient Overlay */}
                <div className="absolute inset-0 bg-radial from-indigo-950/40 via-black/80 to-slate-950" />
              </div>
            )}

            {/* Flash Light Cone Effect Simulation */}
            {flashOn && (
              <div className="absolute inset-0 bg-amber-100/15 pointer-events-none mix-blend-soft-light backdrop-brightness-125 transition-opacity" />
            )}

            {/* Top Badges overlay */}
            <div className="absolute top-3 left-4 right-4 flex justify-between items-center z-20">
              <div className="bg-black/75 border border-cyan-500/30 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-300 uppercase">
                  HARDWARE BOUND
                </span>
              </div>

              <div className="bg-black/75 border border-purple-500/30 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[10px] font-bold text-slate-200">
                  {currentLecture.building || 'Main Campus'}
                </span>
              </div>
            </div>

            {/* High-Tech HUD Target Reticle Box */}
            <div className="relative w-64 sm:w-72 h-64 sm:h-72 z-20 flex items-center justify-center">
              {/* Radar Sweep Ring */}
              <div className="absolute inset-[-12px] border border-cyan-500/20 rounded-full radar-sweep pointer-events-none flex items-center justify-center">
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
              </div>

              {/* Holographic Border Frame */}
              <div
                className={`w-full h-full border rounded-3xl relative overflow-hidden transition-all duration-300 transform-gpu ${
                  scanSuccess
                    ? 'border-emerald-400 bg-emerald-500/25 shadow-[0_0_50px_rgba(16,185,129,0.5)]'
                    : 'border-cyan-400/30 bg-indigo-950/20 backdrop-blur-2xs'
                }`}
              >
                {/* Glowing Corner HUD Brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-cyan-400 rounded-tl-2xl shadow-[0_0_10px_#22d3ee]" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-cyan-400 rounded-tr-2xl shadow-[0_0_10px_#22d3ee]" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-cyan-400 rounded-bl-2xl shadow-[0_0_10px_#22d3ee]" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-cyan-400 rounded-br-2xl shadow-[0_0_10px_#22d3ee]" />

                {/* Center Reticle Crosshairs */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="w-8 h-0.5 bg-cyan-300" />
                  <div className="h-8 w-0.5 bg-cyan-300 absolute" />
                  <div className="w-3 h-3 rounded-full border border-cyan-300 absolute" />
                </div>

                {/* Smooth GPU Laser Scanner Beam */}
                {isScanning && <div className="scanner-beam absolute top-0 left-0 right-0 h-1 z-30" />}

                {/* Success Overlay View with Futuristic Badge */}
                {scanSuccess && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/85 backdrop-blur-md p-4 text-center animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/30 border border-emerald-400 flex items-center justify-center mb-2 shadow-[0_0_30px_#10b981]">
                      <CheckCircle2 className="w-10 h-10 text-emerald-300 animate-bounce" />
                    </div>
                    <h3 className="text-base font-black tracking-tight text-white uppercase">
                      ATTENDANCE VERIFIED!
                    </h3>
                    <p className="text-[11px] text-emerald-200 font-mono mt-1 font-bold">
                      {activeCodeLabel}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/50 text-[10px] text-emerald-300 font-mono">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isOffline ? 'Queued for Auto-Sync' : 'Encrypted Portal Sync'}</span>
                    </div>
                  </div>
                )}

                {/* Error Overlay View */}
                {errorMessage && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-rose-950/90 backdrop-blur-md p-5 text-center animate-in zoom-in-95 duration-200 z-40">
                    <div className="w-14 h-14 rounded-2xl bg-rose-500/30 border border-rose-400 flex items-center justify-center mb-2 shadow-[0_0_30px_#f43f5e]">
                      <XCircle className="w-8 h-8 text-rose-300" />
                    </div>
                    <h3 className="text-base font-black tracking-tight text-white uppercase">
                      Scan Rejected / Expired
                    </h3>
                    <p className="text-xs text-rose-200 font-medium mt-1 max-w-xs leading-relaxed">
                      {errorMessage}
                    </p>
                    <button
                      onClick={() => {
                        setErrorMessage(null);
                        setIsScanning(true);
                      }}
                      className="mt-4 px-4 py-2 rounded-xl bg-white text-rose-950 font-extrabold text-xs shadow-lg hover:bg-rose-100 active:scale-95 transition-all cursor-pointer"
                    >
                      Retry / Resume Scanner
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Quick Test QR Triggers */}
            <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-2 z-30 px-4">
              <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-300/80 bg-black/60 px-3 py-0.5 rounded-full backdrop-blur-md border border-cyan-500/20">
                Tap Preset to Simulate QR Recognition
              </p>
              <div className="flex items-center gap-2 flex-wrap justify-center max-w-md">
                <button
                  onClick={() => handleSimulateScan('Board #1 QR (Main Screen)')}
                  className="bg-indigo-600/90 hover:bg-indigo-500 text-white backdrop-blur-md px-3.5 py-1.5 rounded-xl text-[11px] font-bold shadow-lg flex items-center gap-1.5 active:scale-95 transition-all border border-indigo-400/40 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Smart QR Code</span>
                </button>

                <button
                  onClick={() => handleSimulateScan('Lab Terminal Scanner #02')}
                  className="bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-[11px] font-bold shadow-lg flex items-center gap-1.5 active:scale-95 transition-all border border-cyan-500/40 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Lab Terminal #2</span>
                </button>

                <button
                  onClick={() => handleSimulateScan('Expired Session', 'EXPIRED_SESSION')}
                  className="bg-rose-950/80 hover:bg-rose-900 text-rose-200 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-[11px] font-bold shadow-lg flex items-center gap-1.5 active:scale-95 transition-all border border-rose-500/40 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Test Expired QR</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Utility Toolbar */}
      <div className="p-4 z-30 bg-slate-950/90 backdrop-blur-2xl border-t border-slate-800 flex flex-col gap-3">
        <div className="flex justify-around items-center">
          {/* Flashlight toggle */}
          <button
            onClick={toggleFlashlight}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              flashOn ? 'text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-xs ${
                flashOn
                  ? 'bg-amber-500/20 border border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                  : 'bg-slate-900 border border-slate-800'
              }`}
            >
              <Flashlight className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold">Flash</span>
          </button>

          {/* Camera Flip */}
          <button
            onClick={() =>
              setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
            }
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center active:rotate-180 transition-transform duration-300">
              <RefreshCw className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold">Flip Cam</span>
          </button>

          {/* Manual Entry */}
          <button
            onClick={() => setShowManualModal(true)}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold">Enter Code</span>
          </button>

          {/* Help */}
          <button
            onClick={() => handleSimulateScan('Instant QR Help Scan')}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold">Instant Pass</span>
          </button>
        </div>

        {/* Offline Status */}
        {isOffline && (
          <div className="bg-amber-950/80 border border-amber-500/40 rounded-xl p-2.5 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[11px] font-medium">Offline Mode: Attendance will sync when connected.</span>
            </div>
            <Lock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          </div>
        )}
      </div>

      {/* Manual Code Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-white">Professor Passcode</h3>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter the 6-digit dynamic passcode displayed on Professor {currentLecture.professor}'s classroom screen.
            </p>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="e.g. 984210"
                maxLength={6}
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3.5 text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-indigo-500 shadow-inner"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3.5 rounded-2xl transition-all shadow-md active:scale-98 cursor-pointer"
              >
                Verify & Mark Present
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
