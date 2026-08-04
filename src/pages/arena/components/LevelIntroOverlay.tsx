import React, { useState, useEffect, useCallback } from 'react';

const BASE = import.meta.env.BASE_URL;

const LEVEL_TOAST_IMAGES: Record<number, string> = {
  1: `${BASE}level-1-toast.webp`,
  2: `${BASE}level-2-toast.webp`,
  3: `${BASE}level-3-toast.webp`,
};

const SOAL_IMAGES: Record<number, string> = {
  1: `${BASE}soal-1.webp`,
  2: `${BASE}soal-2.webp`,
  3: `${BASE}soal-3.webp`,
};

type Phase = 'toast-enter' | 'toast-visible' | 'soal-enter' | 'soal-visible' | 'exit' | 'done';

interface LevelIntroOverlayProps {
  levelId: number;
  onComplete: () => void;
}

export const LevelIntroOverlay: React.FC<LevelIntroOverlayProps> = ({ levelId, onComplete }) => {
  const [phase, setPhase] = useState<Phase>('toast-enter');

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase('toast-visible'), 100));
    timers.push(setTimeout(() => setPhase('soal-enter'), 1600));
    timers.push(setTimeout(() => setPhase('soal-visible'), 2000));

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleDismiss = useCallback(() => {
    if (phase !== 'soal-visible') return;
    setPhase('exit');
    setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 500);
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  const toastSrc = LEVEL_TOAST_IMAGES[levelId] || LEVEL_TOAST_IMAGES[1];
  const soalSrc = SOAL_IMAGES[levelId] || SOAL_IMAGES[1];

  const isExit = phase === 'exit';

  // Toast: on exit, shrink and fly to top-center (where the persistent badge lives)
  const toastStyle: React.CSSProperties = {
    transform:
      phase === 'toast-enter'
        ? 'translateY(-80px) scale(0.8)'
        : isExit
        ? 'translateY(-8vh) scale(0.45)'
        : 'translateY(0) scale(1)',
    opacity: phase === 'toast-enter' ? 0 : isExit ? 0 : 1,
    transition: isExit
      ? 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
  };

  // Soal: on exit, shrink and fly to bottom-right (where the persistent soal badge lives)
  const showSoal = phase === 'soal-enter' || phase === 'soal-visible' || isExit;
  const soalStyle: React.CSSProperties = {
    transform:
      phase === 'soal-enter'
        ? 'scale(0.85)'
        : isExit
        ? 'scale(0.3) translate(40vw, 40vh)'
        : 'scale(1)',
    opacity: phase === 'soal-enter' ? 0 : isExit ? 0 : 1,
    transition: isExit
      ? 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
  };

  // Overlay backdrop
  const overlayStyle: React.CSSProperties = {
    opacity: isExit ? 0 : 1,
    transition: 'opacity 0.45s ease',
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center select-none"
      style={overlayStyle}
      onClick={handleDismiss}
    >
      {/* Dark backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Toast - center top area */}
      <div
        className="relative z-10 mt-[6vh] sm:mt-[8vh] flex-shrink-0"
        style={toastStyle}
      >
        <img
          src={toastSrc}
          alt={`Level ${levelId}`}
          className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto object-contain drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          draggable={false}
        />
      </div>

      {/* Soal - center center */}
      {showSoal && (
        <div
          className="relative z-10 flex-1 flex items-center justify-center px-4"
          style={soalStyle}
        >
          <div className="relative">
            <img
              src={soalSrc}
              alt={`Soal Level ${levelId}`}
              className="max-w-[90vw] sm:max-w-[70vw] md:max-w-[500px] lg:max-w-[560px] w-auto object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
              draggable={false}
            />
          </div>
        </div>
      )}

      {/* Tap to continue hint */}
      {phase === 'soal-visible' && (
        <div className="relative z-10 mb-[6vh] animate-pulse">
          <span className="text-white/80 text-xs sm:text-sm md:text-base font-semibold tracking-wider uppercase drop-shadow-md">
            Ketuk untuk mulai
          </span>
        </div>
      )}
    </div>
  );
};
