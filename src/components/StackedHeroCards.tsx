import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StackedHeroCard, ScreenId } from '../types';
import {
  QrCode,
  Calendar,
  FileText,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Video,
  TrendingUp,
  Zap,
  Hand,
  Sparkles,
} from 'lucide-react';

interface StackedHeroCardsProps {
  cards: StackedHeroCard[];
  navigate: (screen: ScreenId) => void;
}

interface CardMeta {
  bgGradient: string;
  borderColor: string;
  titleColor: string;
  subtitleColor: string;
  badgeBg: string;
  badgeText: string;
  badgeTextColor: string;
  iconBg: string;
  iconColor: string;
  ctaBg: string;
  ctaText: string;
  shadow: string;
  iconComponent: React.ReactNode;
  render3DIllustration: (isFront: boolean) => React.ReactNode;
}

const getCardMeta = (cardId: string, card: StackedHeroCard, index: number): CardMeta => {
  const idKey = cardId.toLowerCase();

  // 1. CARD 1: ELECTRIC VIOLET / PURPLE (Attendance & Live QR)
  if (idKey === 'card-1' || idKey === 'hero-attendance' || index % 6 === 0) {
    return {
      bgGradient:
        'from-[#F3E8FF] via-[#EDE9FE] to-[#DDD6FE] dark:from-[#2E1065] dark:via-[#3B0764] dark:to-[#1E004A]',
      borderColor: 'border-purple-300 dark:border-purple-500/60',
      titleColor: 'text-[#2E1065] dark:text-white',
      subtitleColor: 'text-[#6D28D9] dark:text-purple-300',
      badgeBg: 'bg-[#DDD6FE] dark:bg-purple-950/90',
      badgeText: card.badgeText || '• LIVE WINDOW',
      badgeTextColor: 'text-[#5B21B6] dark:text-purple-300',
      iconBg: 'bg-[#7C3AED]',
      iconColor: 'text-white',
      ctaBg:
        'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/30',
      ctaText: card.ctaText || 'Join Attendance',
      shadow: 'shadow-[0_12px_30px_-5px_rgba(124,58,237,0.3)]',
      iconComponent: <QrCode className="w-4.5 h-4.5 stroke-[2.2]" />,
      render3DIllustration: (isFront: boolean) => (
        <div className="relative flex flex-col items-center justify-center p-1">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute bottom-0 w-14 h-5 bg-gradient-to-r from-purple-500/40 via-indigo-500/60 to-cyan-500/40 rounded-[50%] blur-xs animate-pulse" />
            <div className="absolute bottom-1 w-12 h-3 border-2 border-indigo-400/60 rounded-[50%]" />
            <div
              className={`relative -top-1 w-11 h-11 bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 rounded-xl p-1.5 border-2 border-indigo-300/80 flex flex-col items-center justify-center rotate-[-6deg] shadow-xl ${
                isFront ? 'animate-bounce-subtle' : ''
              }`}
            >
              <QrCode className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
          </div>
        </div>
      ),
    };
  }

  // 2. CARD 2: SAPPHIRE OCEAN BLUE (Timetable & Schedule)
  if (idKey === 'card-2' || idKey === 'hero-timetable' || index % 6 === 1) {
    return {
      bgGradient:
        'from-[#E0F2FE] via-[#BAE6FD] to-[#7DD3FC] dark:from-[#082F49] dark:via-[#0C4A6E] dark:to-[#032B45]',
      borderColor: 'border-sky-300 dark:border-sky-500/60',
      titleColor: 'text-[#0C4A6E] dark:text-white',
      subtitleColor: 'text-[#0284C7] dark:text-sky-300',
      badgeBg: 'bg-[#BAE6FD] dark:bg-sky-950/90',
      badgeText: card.badgeText || 'Room 302',
      badgeTextColor: 'text-[#0369A1] dark:text-sky-300',
      iconBg: 'bg-[#0284C7]',
      iconColor: 'text-white',
      ctaBg:
        'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-lg shadow-sky-500/30',
      ctaText: card.ctaText || 'View Schedule',
      shadow: 'shadow-[0_12px_30px_-5px_rgba(2,132,199,0.3)]',
      iconComponent: <Calendar className="w-4.5 h-4.5 stroke-[2.2]" />,
      render3DIllustration: () => (
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute bottom-1 w-12 h-4 bg-gradient-to-r from-sky-300 via-blue-200 to-sky-300 rounded-[50%] opacity-80" />
            <div className="relative -top-1 w-10 h-10 bg-white dark:bg-slate-800 rounded-xl p-1 border-2 border-sky-300 flex flex-col items-center justify-center rotate-[3deg] shadow-xs">
              <Calendar className="w-4.5 h-4.5 text-[#0284C7] stroke-[2.2]" />
              <span className="text-[6.5px] font-black text-sky-900 dark:text-sky-200 mt-0.5 tracking-wider">
                TODAY
              </span>
            </div>
          </div>
        </div>
      ),
    };
  }

  // 3. CARD 3: EMERALD JADE MINT (Live Class & Video)
  if (idKey === 'card-3' || idKey === 'hero-live-class' || index % 6 === 2) {
    return {
      bgGradient:
        'from-[#D1FAE5] via-[#A7F3D0] to-[#6EE7B7] dark:from-[#022C22] dark:via-[#065F46] dark:to-[#047857]',
      borderColor: 'border-emerald-300 dark:border-emerald-500/60',
      titleColor: 'text-[#064E3B] dark:text-white',
      subtitleColor: 'text-[#059669] dark:text-emerald-300',
      badgeBg: 'bg-[#A7F3D0] dark:bg-emerald-950/90',
      badgeText: card.badgeText || 'IN SESSION',
      badgeTextColor: 'text-[#047857] dark:text-emerald-300',
      iconBg: 'bg-[#10B981]',
      iconColor: 'text-white',
      ctaBg:
        'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/30',
      ctaText: card.ctaText || 'Enter Class',
      shadow: 'shadow-[0_12px_30px_-5px_rgba(16,185,129,0.3)]',
      iconComponent: <Video className="w-4.5 h-4.5 stroke-[2.2]" />,
      render3DIllustration: () => (
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute bottom-1 w-12 h-4 bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-300 rounded-[50%] opacity-80" />
            <div className="relative -top-1 w-10 h-10 bg-white dark:bg-slate-800 rounded-xl p-1 border-2 border-emerald-300 flex flex-col items-center justify-center rotate-[-2deg] shadow-xs">
              <Video className="w-4.5 h-4.5 text-[#10B981] stroke-[2.2]" />
              <span className="text-[6.5px] font-black text-emerald-900 dark:text-emerald-200 mt-0.5">LIVE</span>
            </div>
          </div>
        </div>
      ),
    };
  }

  // 4. CARD 4: VIVID CRIMSON ROSE (Assignments & Tasks)
  if (idKey === 'card-4' || idKey === 'hero-assignments' || index % 6 === 3) {
    return {
      bgGradient:
        'from-[#FFE4E6] via-[#FECDD3] to-[#FDA4AF] dark:from-[#4C0519] dark:via-[#881337] dark:to-[#BE123C]',
      borderColor: 'border-rose-300 dark:border-rose-500/60',
      titleColor: 'text-[#881337] dark:text-white',
      subtitleColor: 'text-[#E11D48] dark:text-rose-300',
      badgeBg: 'bg-[#FECDD3] dark:bg-rose-950/90',
      badgeText: card.badgeText || 'DUE IN 2 DAYS',
      badgeTextColor: 'text-[#9F1239] dark:text-rose-300',
      iconBg: 'bg-[#E11D48]',
      iconColor: 'text-white',
      ctaBg:
        'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-500/30',
      ctaText: card.ctaText || 'Submit Task',
      shadow: 'shadow-[0_12px_30px_-5px_rgba(225,29,72,0.3)]',
      iconComponent: <FileText className="w-4.5 h-4.5 stroke-[2.2]" />,
      render3DIllustration: () => (
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute bottom-1 w-12 h-4 bg-gradient-to-r from-rose-300 via-pink-200 to-rose-300 rounded-[50%] opacity-80" />
            <div className="relative -top-1 w-10 h-10 bg-white dark:bg-slate-800 rounded-xl p-1 border-2 border-rose-300 flex flex-col items-center justify-center rotate-[4deg] shadow-xs">
              <FileText className="w-4.5 h-4.5 text-[#E11D48] stroke-[2.2]" />
              <span className="text-[6.5px] font-black text-rose-950 dark:text-rose-200 mt-0.5">85% DONE</span>
            </div>
          </div>
        </div>
      ),
    };
  }

  // 5. CARD 5: METALLIC GOLD AMBER (Library & Digital ID)
  if (idKey === 'card-5' || idKey === 'hero-library' || index % 6 === 4) {
    return {
      bgGradient:
        'from-[#FEF3C7] via-[#FDE68A] to-[#FCD34D] dark:from-[#451A03] dark:via-[#78350F] dark:to-[#B45309]',
      borderColor: 'border-amber-300 dark:border-amber-500/60',
      titleColor: 'text-[#78350F] dark:text-white',
      subtitleColor: 'text-[#D97706] dark:text-amber-300',
      badgeBg: 'bg-[#FDE68A] dark:bg-amber-950/90',
      badgeText: card.badgeText || '12 ACTIVE BOOKS',
      badgeTextColor: 'text-[#92400E] dark:text-amber-300',
      iconBg: 'bg-[#D97706]',
      iconColor: 'text-white',
      ctaBg:
        'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white shadow-lg shadow-amber-500/30',
      ctaText: card.ctaText || 'Manage Books',
      shadow: 'shadow-[0_12px_30px_-5px_rgba(217,119,6,0.3)]',
      iconComponent: <BookOpen className="w-4.5 h-4.5 stroke-[2.2]" />,
      render3DIllustration: () => (
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute bottom-1 w-12 h-4 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 rounded-[50%] opacity-80" />
            <div className="relative -top-1 w-10 h-10 bg-white dark:bg-slate-800 rounded-xl p-1 border-2 border-amber-300 flex flex-col items-center justify-center rotate-[-3deg] shadow-xs">
              <BookOpen className="w-4.5 h-4.5 text-[#D97706] stroke-[2.2]" />
              <span className="text-[6.5px] font-black text-amber-950 dark:text-amber-200 mt-0.5">ID PASS</span>
            </div>
          </div>
        </div>
      ),
    };
  }

  // 6. CARD 6: ROYAL CYAN INDIGO (Attendance Analytics)
  return {
    bgGradient:
      'from-[#E0E7FF] via-[#C7D2FE] to-[#A5B4FC] dark:from-[#1E1B4B] dark:via-[#312E81] dark:to-[#4338CA]',
    borderColor: 'border-indigo-300 dark:border-indigo-500/60',
    titleColor: 'text-[#1E1B4B] dark:text-white',
    subtitleColor: 'text-[#4F46E5] dark:text-indigo-300',
    badgeBg: 'bg-[#C7D2FE] dark:bg-indigo-950/90',
    badgeText: card.badgeText || '84% AVG TREND',
    badgeTextColor: 'text-[#3730A3] dark:text-indigo-300',
    iconBg: 'bg-[#4F46E5]',
    iconColor: 'text-white',
    ctaBg:
      'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-500/30',
    ctaText: card.ctaText || 'View Analytics',
    shadow: 'shadow-[0_12px_30px_-5px_rgba(79,70,229,0.3)]',
    iconComponent: <TrendingUp className="w-4.5 h-4.5 stroke-[2.2]" />,
    render3DIllustration: () => (
      <div className="relative flex flex-col items-center justify-center">
        <div className="relative w-14 h-14 flex items-center justify-center">
          <div className="absolute bottom-1 w-12 h-4 bg-gradient-to-r from-indigo-300 via-blue-200 to-indigo-300 rounded-[50%] opacity-80" />
          <div className="relative -top-1 w-10 h-10 bg-white dark:bg-slate-800 rounded-xl p-1 border-2 border-indigo-300 flex flex-col items-center justify-center rotate-[3deg] shadow-xs">
            <TrendingUp className="w-4.5 h-4.5 text-[#4F46E5] stroke-[2.2]" />
            <span className="text-[6.5px] font-black text-indigo-950 dark:text-indigo-200 mt-0.5">84% CGPA</span>
          </div>
        </div>
      </div>
    ),
  };
};

export const StackedHeroCards: React.FC<StackedHeroCardsProps> = React.memo(({ cards, navigate }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  // Store dynamic throw velocity vector for real throwing effect
  const [throwVector, setThrowVector] = useState<{ x: number; y: number; rot: number }>({
    x: -380,
    y: 0,
    rot: -5,
  });

  if (!cards || cards.length === 0) return null;

  const nextCard = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const prevCard = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  // AUTO SHUFFLE EVERY 5 SECONDS WHEN USER IS NOT INTERACTING
  useEffect(() => {
    if (isInteracting) return;
    const interval = setInterval(() => {
      setThrowVector({ x: -380, y: 0, rot: -5 });
      nextCard();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextCard, isInteracting]);

  // Symmetrical & Clean 3-Layer Stack Configuration for 60fps performance on low-end devices
  const stackConfigs = [
    { x: 0, y: 0, scale: 1.0, zIndex: 30, opacity: 1.0 },
    { x: 12, y: 3, scale: 0.97, zIndex: 20, opacity: 0.88 },
    { x: 22, y: 6, scale: 0.94, zIndex: 10, opacity: 0.72 },
  ];

  const visibleLayers = [0, 1, 2].map((offsetIndex) => {
    const cardIndex = (activeIndex + offsetIndex) % cards.length;
    return {
      card: cards[cardIndex],
      offsetIndex,
      config: stackConfigs[offsetIndex],
      cardIndex,
    };
  });

  return (
    <section className="relative my-2 select-none w-full max-w-full overflow-hidden touch-pan-y">
      {/* STACKED CARD CAROUSEL CONTAINER */}
      <div
        className="relative h-[236px] w-full flex items-center justify-start px-0.5 transform-gpu"
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
      >
        <AnimatePresence initial={false}>
          {visibleLayers
            .slice()
            .reverse()
            .map(({ card, offsetIndex, config, cardIndex }) => {
              const meta = getCardMeta(card.id, card, cardIndex);
              const isFront = offsetIndex === 0;

              return (
                <motion.div
                  key={card.id || `card-layer-${offsetIndex}`}
                  drag={isFront ? 'x' : false}
                  dragDirectionLock={true}
                  dragMomentum={false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  dragSnapToOrigin={true}
                  onDragStart={() => setIsInteracting(true)}
                  onDragEnd={(_, info) => {
                    setIsInteracting(false);
                    const offsetX = info.offset.x;
                    const velX = info.velocity.x;

                    // SWIPE LEFT: Advance to next card
                    if (offsetX < -40 || velX < -140) {
                      setThrowVector({
                        x: -380,
                        y: 0,
                        rot: -5,
                      });
                      nextCard();
                    }
                    // SWIPE RIGHT: Go to previous card
                    else if (offsetX > 40 || velX > 140) {
                      setThrowVector({
                        x: 380,
                        y: 0,
                        rot: 5,
                      });
                      prevCard();
                    }
                  }}
                  onClick={() => {
                    if (!isFront) {
                      setActiveIndex(cardIndex);
                    }
                  }}
                  initial={{
                    x: config.x + 20,
                    y: config.y,
                    scale: config.scale * 0.96,
                    opacity: 0,
                    rotate: 0,
                  }}
                  animate={{
                    x: config.x,
                    y: config.y,
                    scale: config.scale,
                    opacity: config.opacity,
                    zIndex: config.zIndex,
                    rotate: 0,
                  }}
                  exit={{
                    x: throwVector.x,
                    y: throwVector.y,
                    rotate: throwVector.rot,
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.22, ease: 'easeOut' },
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 32,
                  }}
                  style={{
                    zIndex: config.zIndex,
                    transformOrigin: 'center center',
                  }}
                  className={`absolute top-0 left-0 w-[92%] sm:w-[88%] h-[224px] rounded-[24px] bg-gradient-to-br ${meta.bgGradient} p-4 sm:p-5 ${meta.shadow} border ${meta.borderColor} flex flex-col justify-between overflow-hidden cursor-grab active:cursor-grabbing box-border transform-gpu will-change-[transform,opacity]`}
                >
                  {/* TOP HEADER ROW: Icon + Title/Subtitle + Status Badge */}
                  <div className="flex justify-between items-center gap-2.5 z-10 w-full min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className={`w-9.5 h-9.5 rounded-xl ${meta.iconBg} ${meta.iconColor} flex items-center justify-center shadow-xs shrink-0`}
                      >
                        {meta.iconComponent}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3
                          className={`text-[16px] sm:text-[18px] font-black tracking-tight leading-tight truncate ${meta.titleColor}`}
                        >
                          {card.title}
                        </h3>
                        <p
                          className={`text-[12px] sm:text-[13px] font-bold truncate ${meta.subtitleColor} mt-0.5`}
                        >
                          {card.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10.5px] sm:text-[11px] font-black uppercase tracking-wider whitespace-nowrap shrink-0 ${meta.badgeBg} ${meta.badgeTextColor}`}
                    >
                      {card.badgeText || meta.badgeText}
                    </span>
                  </div>

                  {/* MIDDLE ROW: Left Main Class Details + Right 3D Illustration */}
                  <div className="flex justify-between items-center gap-2 z-10 my-1 w-full min-w-0">
                    <div className="space-y-1 min-w-0 flex-1 pr-1">
                      <p className="text-[14.5px] sm:text-[16px] font-black text-[#0F172A] dark:text-slate-100 leading-tight truncate">
                        {card.statPrimary}
                      </p>
                      {card.statSecondary && (
                        <p className="text-[12px] sm:text-[13px] font-bold text-[#334155] dark:text-slate-300 truncate">
                          {card.statSecondary}
                        </p>
                      )}
                      {card.locationOrTime && (
                        <p className="text-[11.5px] sm:text-[12.5px] font-semibold text-[#475569] dark:text-slate-400 truncate">
                          {card.locationOrTime}
                        </p>
                      )}
                    </div>

                    {/* 3D Illustration Graphic */}
                    <div className="shrink-0">{meta.render3DIllustration(isFront)}</div>
                  </div>

                  {/* BOTTOM ROW: Action CTA button + Swipe controls */}
                  <div className="flex justify-between items-center gap-2 z-10 pt-1 w-full min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#64748B] shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setThrowVector({ x: 300, y: -100, rot: 20 });
                          prevCard();
                        }}
                        className="w-8 h-8 rounded-full hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-pointer flex items-center justify-center"
                        title="Previous"
                      >
                        <ChevronLeft className="w-4 h-4 text-[#334155] dark:text-slate-300" />
                      </button>
                      <span className="font-mono font-black text-[12px] text-[#334155] dark:text-slate-300">
                        {activeIndex + 1}/{cards.length}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setThrowVector({ x: -300, y: -100, rot: -20 });
                          nextCard();
                        }}
                        className="w-8 h-8 rounded-full hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-pointer flex items-center justify-center"
                        title="Next"
                      >
                        <ChevronRight className="w-4 h-4 text-[#334155] dark:text-slate-300" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {isFront && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold text-slate-600 dark:text-slate-300">
                          <Hand className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                          Swipe
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(card.targetScreen);
                        }}
                        className={`h-11 px-4 sm:px-5 rounded-xl text-[13px] sm:text-[14px] font-black active:scale-95 transition-all cursor-pointer shadow-md flex items-center gap-1.5 whitespace-nowrap shrink-0 ${meta.ctaBg}`}
                      >
                        <span>{meta.ctaText}</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>

      {/* PAGINATION DOTS WITH PROGRESS ACCENT */}
      <div className="flex justify-center items-center gap-2 mt-3">
        {cards.map((_, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveIndex(idx);
                setIsInteracting(false);
              }}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                isActive
                  ? 'w-7 h-2 bg-[#7C3AED] shadow-2xs'
                  : 'w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
              }`}
              title={`Card ${idx + 1}`}
            />
          );
        })}
      </div>
    </section>
  );
});
