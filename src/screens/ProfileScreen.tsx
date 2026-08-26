import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId, StudentProfile } from '../types';
import {
  ArrowLeft,
  ShieldCheck,
  Award,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  QrCode,
  LogOut,
  Mail,
  User,
  Building2,
  Share2,
  Download,
  Flame,
  BadgeCheck,
  Laptop,
  Camera,
  Phone,
  Droplet,
  Shield,
  Clock,
  KeyRound,
  Upload,
  Check,
  X,
  Lock,
} from 'lucide-react';

interface ProfileScreenProps {
  student: StudentProfile;
  navigate: (screen: ScreenId) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ student, navigate }) => {
  const [activeTab, setActiveTab] = useState<'transcript' | 'badges' | 'endorsements'>('transcript');
  const [showPassModal, setShowPassModal] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  
  // Custom Profile Picture State
  const [currentAvatar, setCurrentAvatar] = useState<string>(student.avatarUrl || PRESET_AVATARS[0]);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [customAvatarInput, setCustomAvatarInput] = useState('');

  // Fixed accurate timestamp with seconds
  const loginTimestamp = 'Aug 11, 2026, 07:35:12 PM';

  const handleCopyId = () => {
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSelectAvatar = (url: string) => {
    setCurrentAvatar(url);
    setIsAvatarModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCurrentAvatar(reader.result);
          setIsAvatarModalOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const semBreakdown = [
    { sem: 'Semester I', gpa: '3.82 / 4.00', credits: 22, status: 'Passed (Distinction)' },
    { sem: 'Semester II', gpa: '3.88 / 4.00', credits: 24, status: 'Passed (Distinction)' },
    { sem: 'Semester III', gpa: '3.90 / 4.00', credits: 24, status: 'Passed (Distinction)' },
    { sem: 'Semester IV', gpa: '3.95 / 4.00', credits: 24, status: 'Passed (Distinction)' },
    { sem: 'Semester V', gpa: '3.92 / 4.00', credits: 24, status: 'In Progress (Active)' },
  ];

  const badges = [
    {
      id: 'b1',
      title: 'Top 1% Attendance',
      desc: 'Maintained >90% aggregate for 3 consecutive terms',
      icon: ShieldCheck,
      color: 'from-amber-500 to-yellow-400',
      tag: 'GOLD TIER',
    },
    {
      id: 'b2',
      title: 'Hackathon Champion',
      desc: '1st Place in National Campus AI Build-off',
      icon: Sparkles,
      color: 'from-indigo-600 to-cyan-400',
      tag: 'SPECIAL',
    },
    {
      id: 'b3',
      title: '12-Day Active Streak',
      desc: 'Attended all morning lectures without delay',
      icon: Flame,
      color: 'from-rose-500 to-orange-400',
      tag: 'STREAK',
    },
    {
      id: 'b4',
      title: 'Dean’s Honor List',
      desc: 'Recognized by HOD for academic excellence',
      icon: Award,
      color: 'from-emerald-500 to-teal-400',
      tag: 'ACADEMIC',
    },
  ];

  const endorsements = [
    {
      id: 'e1',
      faculty: 'Dr. A. Sharma',
      role: 'Head of Department (Computer Science)',
      quote: 'Saad demonstrates exceptional analytical rigour in algorithm design and maintains stellar attendance punctuality.',
      date: 'May 2026',
    },
    {
      id: 'e2',
      faculty: 'Prof. R. Mehta',
      role: 'Chief Exam Controller & Systems Lead',
      quote: 'Top performing student in OS kernel labs with consistent 100% assignment submission record.',
      date: 'April 2026',
    },
  ];

  return (
    <div className="space-y-5 pb-6 max-w-2xl mx-auto px-4 sm:px-6 animate-in fade-in duration-300">
      {/* Top Header - No Settings Button as requested */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-center text-slate-900 dark:text-white hover:bg-slate-50 cursor-pointer transition-transform active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Student Profile</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Official Academic Identity & Digital ID</p>
          </div>
        </div>
      </div>

      {/* Luxury Digital Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[32px] p-6 shadow-2xl border border-indigo-500/30 text-white relative overflow-hidden space-y-5">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10 text-center sm:text-left">
          {/* Profile Picture with Change Avatar Overlay */}
          <div className="relative shrink-0 group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
            <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-indigo-400/40 shadow-xl bg-slate-800">
              <img
                src={currentAvatar}
                alt={student.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="absolute inset-0 rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[10px] font-extrabold gap-1">
              <Camera className="w-4 h-4 text-cyan-300" />
              <span>Change Photo</span>
            </div>
            <span className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 border-2 border-slate-900 rounded-full flex items-center justify-center shadow-lg text-white" title="Change Avatar">
              <Camera className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black tracking-tight text-white">{student.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-cyan-400/30">
                HONORS FELLOW
              </span>
            </div>

            <p className="text-xs font-extrabold text-indigo-300 flex items-center justify-center sm:justify-start gap-2">
              <span>Roll No: {student.idNumber}</span>
              <span className="text-indigo-400">•</span>
              <span>ID: STUDENT-8802</span>
            </p>

            <p className="text-xs text-slate-300 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{student.department} (Sem V • Class A)</span>
            </p>

            <p className="text-[11.5px] text-slate-400 font-medium flex items-center justify-center sm:justify-start gap-1">
              <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{student.collegeName}</span>
            </p>
          </div>
        </div>

        {/* Digital ID Pass Trigger Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5 relative z-10">
          <button
            onClick={() => setShowPassModal(!showPassModal)}
            className="w-full sm:flex-1 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:opacity-90 text-white font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-cyan-300" />
            <span>{showPassModal ? 'Hide Digital Student ID Pass' : 'View Digital NFC / QR ID Pass'}</span>
          </button>

          <button
            onClick={handleCopyId}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/15 transition-all cursor-pointer shrink-0"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-300" />
            <span>{copiedId ? 'Roll No Copied!' : 'Copy Roll No'}</span>
          </button>
        </div>

        {/* Expandable Digital NFC/QR ID Pass Card */}
        <AnimatePresence>
          {showPassModal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-3 border-t border-indigo-500/30 space-y-3 overflow-hidden"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-200 uppercase tracking-wider text-[10px]">CAMPUS CLEARANCE STATUS</span>
                  <span className="text-emerald-400 font-black flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-4 h-4" /> LEVEL 4 FULL ACCESS
                  </span>
                </div>

                {/* QR Code Graphic Box */}
                <div className="bg-white p-3 rounded-2xl w-40 h-40 mx-auto flex flex-col items-center justify-center shadow-2xl">
                  <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-slate-900 rounded-lg">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          i % 2 === 0 || i % 7 === 0 ? 'bg-cyan-400' : i % 5 === 0 ? 'bg-indigo-500' : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center space-y-0.5">
                  <p className="text-[11px] font-mono text-cyan-200 font-extrabold tracking-widest">RFID-HASH: {student.idNumber}-9982X</p>
                  <p className="text-[10px] text-slate-300 font-medium">Valid for Automated Library, Labs, and Turnstile Gate Scanners</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Student Personal & Contact Details Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Student Official Details</span>
          </h3>
          <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase">Class A • Batch B1</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Official Email</span>
            <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>saad.parkar@campus.edu</span>
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Phone Number</span>
            <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>+91 98765 43210</span>
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Guardian Name & Contact</span>
            <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>Parvez Parkar (+91 98765 00000)</span>
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Blood Group & Medical ID</span>
            <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>O+ (Emergency Contacts Verified)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Logged-In Device & Security Locks Card */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl p-5 border border-indigo-500/30 shadow-xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-indigo-500/20">
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Device & Session Security</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
            ● Active Session
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Last Login Timestamp</span>
            <p className="font-mono font-bold text-cyan-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{loginTimestamp}</span>
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Logged-In Device & OS</span>
            <p className="font-bold text-slate-200 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>iPhone 15 Pro • iOS 18.2</span>
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">IP & Security Protocol</span>
            <p className="font-mono text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>192.168.1.104 (TLS 256-Bit)</span>
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Biometric Hardware Lock</span>
            <p className="font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Face ID / Fingerprint Verified</span>
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex bg-slate-200/80 dark:bg-slate-900 p-1 rounded-2xl text-xs font-bold gap-1 border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('transcript')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'transcript'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Academic Transcript
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'badges'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Honors & Badges
        </button>

        <button
          onClick={() => setActiveTab('endorsements')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'endorsements'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Faculty Letters
        </button>
      </div>

      {/* Tab 1: Academic Transcript */}
      {activeTab === 'transcript' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>Semester GPA & Credit History</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-500">5 Semesters Recorded</span>
            </div>

            <div className="space-y-2">
              {semBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black flex items-center justify-center shrink-0">
                      S{idx + 1}
                    </span>
                    <div>
                      <p className="font-extrabold text-slate-900 dark:text-white">{item.sem}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{item.credits} Credits Completed</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{item.gpa}</span>
                    <p className="text-[9.5px] font-extrabold text-emerald-600 dark:text-emerald-400">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => alert('Simulating official transcript PDF generation... PDF download initialized!')}
            className="w-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-extrabold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Official Encrypted PDF Transcript</span>
          </button>
        </div>
      )}

      {/* Tab 2: Honors & Badges */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
          {badges.map((b) => {
            const IconComp = b.icon;
            return (
              <div
                key={b.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <div className={`p-2.5 rounded-2xl bg-gradient-to-tr ${b.color} text-white shadow-md`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-black uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                    {b.tag}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">{b.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-snug">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Faculty Letters */}
      {activeTab === 'endorsements' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {endorsements.map((e) => (
            <div key={e.id} className="bg-white dark:bg-slate-900 p-4.5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">{e.faculty}</h4>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{e.role}</p>
                </div>
              </div>

              <blockquote className="p-3.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 italic text-[11.5px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                "{e.quote}"
              </blockquote>

              <p className="text-[10px] text-slate-400 text-right font-bold">Verified Letter • {e.date}</p>
            </div>
          ))}
        </div>
      )}

      {/* Logout Action */}
      <button
        onClick={() => navigate('welcome')}
        className="w-full bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-black py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all border border-rose-200 dark:border-rose-900/50 cursor-pointer shadow-2xs active:scale-98"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out of Campus OS</span>
      </button>

      {/* Avatar Change Modal */}
      <AnimatePresence>
        {isAvatarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm w-full space-y-4 shadow-2xl text-slate-900 dark:text-white"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Update Profile Picture</span>
                </h3>
                <button
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Upload Local File CTA */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  Option 1: Upload from Device
                </label>
                <label className="flex items-center justify-center gap-2 w-full p-3 rounded-2xl border-2 border-dashed border-indigo-500/40 hover:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs cursor-pointer transition-all">
                  <Upload className="w-4 h-4" />
                  <span>Choose Photo File...</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {/* Preset Avatar Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  Option 2: Pick Preset Student Avatar
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectAvatar(url)}
                      className={`relative rounded-2xl overflow-hidden border-2 aspect-square cursor-pointer transition-transform hover:scale-105 ${
                        currentAvatar === url ? 'border-indigo-600 shadow-lg scale-105' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                      {currentAvatar === url && (
                        <div className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-0.5 shadow-md">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
