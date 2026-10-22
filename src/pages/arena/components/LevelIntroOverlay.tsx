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

const LEVEL_BORDER_COLORS: Record<number, string> = {
  1: 'border-[#0f5a31]',
  2: 'border-[#b45309]',
  3: 'border-[#be123c]',
};

const PETUNJUK_IMAGE = `${BASE}petunjuk-rute.webp`;

type Phase =
  | 'toast-enter'
  | 'toast-visible'
  | 'soal-enter'
  | 'soal-visible'
  | 'petunjuk-enter'
  | 'petunjuk-visible'
  | 'exit'
  | 'done';

interface LevelIntroOverlayProps {
  levelId: number;
  onComplete: () => void;
}

export const LevelIntroOverlay: React.FC<LevelIntroOverlayProps> = ({ levelId, onComplete }) => {
  const [phase, setPhase] = useState<Phase>('toast-enter');

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase('toast-visible'), 100));
    timers.push(setTimeout(() => setPhase('soal-enter'), 1400));
    timers.push(setTimeout(() => setPhase('soal-visible'), 1800));
    timers.push(setTimeout(() => setPhase('petunjuk-enter'), 2300));
    timers.push(setTimeout(() => setPhase('petunjuk-visible'), 2700));

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleDismiss = useCallback(() => {
    if (phase !== 'soal-visible' && phase !== 'petunjuk-enter' && phase !== 'petunjuk-visible') return;
    setPhase('exit');
    setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 500);
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  const toastSrc = LEVEL_TOAST_IMAGES[levelId] || LEVEL_TOAST_IMAGES[1];
  const soalSrc = SOAL_IMAGES[levelId] || SOAL_IMAGES[1];
  const borderColor = LEVEL_BORDER_COLORS[levelId] || LEVEL_BORDER_COLORS[1];

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
  const showSoal =
    phase === 'soal-enter' ||
    phase === 'soal-visible' ||
    phase === 'petunjuk-enter' ||
    phase === 'petunjuk-visible' ||
    isExit;

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

  // Petunjuk Rute: pops in right after level-intro-soal-img appears
  const showPetunjuk =
    phase === 'petunjuk-enter' ||
    phase === 'petunjuk-visible' ||
    isExit;

  const petunjukStyle: React.CSSProperties = {
    transform:
      phase === 'petunjuk-enter'
        ? 'scale(0.85)'
        : isExit
        ? 'scale(0.5)'
        : 'scale(1)',
    opacity: phase === 'petunjuk-enter' ? 0 : isExit ? 0 : 1,
    transition: isExit
      ? 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
  };

  // Overlay backdrop
  const overlayStyle: React.CSSProperties = {
    opacity: isExit ? 0 : 1,
    transition: 'opacity 0.45s ease',
  };

  return (
    <div
      id="level-intro-overlay"
      className="fixed inset-0 z-[100] flex flex-col items-center select-none"
      style={overlayStyle}
      onClick={handleDismiss}
    >
      {/* Dark backdrop with blur */}
      <div id="level-intro-backdrop" className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Toast - center top area */}
      <div
        id="level-intro-toast-container"
        className="relative z-10 mt-[4vh] sm:mt-[6vh] flex-shrink-0"
        style={toastStyle}
      >
        <img
          id="level-intro-toast-img"
          src={toastSrc}
          alt={`Level ${levelId}`}
          className="h-10 sm:h-14 md:h-18 lg:h-22 w-auto object-contain drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          draggable={false}
        />
      </div>

      {/* Soal & Petunjuk Rute - center area */}
      {showSoal && (
        <div
          id="level-intro-soal-container"
          className="relative z-10 flex-1 flex flex-col items-center justify-center gap-2.5 sm:gap-4 px-4 min-h-0"
        >
          <div className="relative" style={soalStyle}>
            <img
              id="level-intro-soal-img"
              src={soalSrc}
              alt={`Soal Level ${levelId}`}
              className="max-w-[88vw] sm:max-w-[68vw] md:max-w-[480px] lg:max-w-[540px] max-h-[22vh] sm:max-h-[24vh] w-auto object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
              draggable={false}
            />
          </div>

          {showPetunjuk && (
            <div id="level-intro-petunjuk-container" className="relative" style={petunjukStyle}>
              <img
                id="level-intro-petunjuk-img"
                src={PETUNJUK_IMAGE}
                alt={`Petunjuk Rute Level ${levelId}`}
                className={`max-w-[88vw] sm:max-w-[68vw] md:max-w-[480px] lg:max-w-[540px] max-h-[32vh] sm:max-h-[36vh] w-auto object-contain rounded-xl sm:rounded-2xl border-[3px] sm:border-[5px] ${borderColor} drop-shadow-[0_8px_32px_rgba(0,0,0,0.35)]`}
                draggable={false}
              />
            </div>
          )}
        </div>
      )}

      {/* Tap to continue hint */}
      {phase === 'petunjuk-visible' && (
        <div id="level-intro-hint" className="relative z-10 mb-[4vh] sm:mb-[6vh] animate-pulse">
          <span className="text-white/80 text-xs sm:text-sm md:text-base font-semibold tracking-wider uppercase drop-shadow-md">
            Ketuk untuk mulai
          </span>
        </div>
      )}
    </div>
  );
};
