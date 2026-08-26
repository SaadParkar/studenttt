import React, { useEffect, useRef } from 'react';

interface ThemeTransitionOverlayProps {
  isTriggered: boolean;
  targetDarkMode: boolean;
  origin: { x: number; y: number };
  onComplete: () => void;
}

export const ThemeTransitionOverlay: React.FC<ThemeTransitionOverlayProps> = ({
  isTriggered,
  targetDarkMode,
  origin,
  onComplete,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTriggered) return;

    // Accessibility check: disable animation if reduced motion is requested
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    const overlay = overlayRef.current;
    if (!overlay) {
      onComplete();
      return;
    }

    const x = origin.x || (typeof window !== 'undefined' ? window.innerWidth - 40 : 300);
    const y = origin.y || 40;

    // Calculate maximum radius to ensure 100% viewport coverage from origin (x, y)
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    );

    // Apply will-change: clip-path right before animation on GPU compositor layer
    overlay.style.willChange = 'clip-path';

    // Radial reveal animation expanding outward from toggle button
    const animation = overlay.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${maxRadius + 30}px at ${x}px ${y}px)` },
      ],
      {
        duration: 520,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)', // Smooth ease-out spring timing
        fill: 'forwards',
      }
    );

    animation.onfinish = () => {
      // Remove will-change immediately after completion to conserve memory
      if (overlay) {
        overlay.style.willChange = 'auto';
      }
      onComplete();
    };

    return () => {
      try {
        animation.cancel();
      } catch (_) {}
    };
  }, [isTriggered, targetDarkMode, origin, onComplete]);

  if (!isTriggered) return null;

  // Solid flat background color matching target theme for optimal GPU compositor performance
  const overlayBg = targetDarkMode ? '#060911' : '#F8FAFC';

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: overlayBg,
        pointerEvents: 'none',
        clipPath: `circle(0px at ${origin.x || 300}px ${origin.y || 40}px)`,
      }}
    />
  );
};

