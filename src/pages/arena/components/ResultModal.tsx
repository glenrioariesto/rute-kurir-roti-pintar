import { useEffect } from 'react';
import { RefreshCcw, ArrowRight, X } from 'lucide-react';
import { formatDistance } from '@utils/findOptimalRoute';

interface ResultModalProps {
  isOpen: boolean;
  score: number;
  feedback: string;
  distance: number;
  optimalDistance: number;
  onClose: () => void;
  onRetry: () => void;
  onNextLevel: () => void;
  hasNextLevel: boolean;
  playWin: () => void;
  stopWin: () => void;
  levelId?: number;
}

const getResultTheme = (levelId: number = 1) => {
  if (levelId === 1) {
    return {
      cardBorder: 'border-[3px] md:border-[5px] border-[#0f5a31]',
      headerBg: 'bg-gradient-to-tr from-[#0f5a31] to-[#1e8d4f]',
      primaryBtn: 'bg-[#0f5a31] hover:bg-[#0b4826] border-b-3 border-[#073019] text-white',
      accentText: 'text-[#0f5a31]',
      optimalText: 'text-[#0f5a31]',
      scoreBadge: 'bg-white/20 text-white',
    };
  }
  if (levelId === 2) {
    return {
      cardBorder: 'border-[3px] md:border-[5px] border-[#b45309]',
      headerBg: 'bg-gradient-to-tr from-[#b45309] to-[#d97706]',
      primaryBtn: 'bg-[#b45309] hover:bg-[#9a3412] border-b-3 border-[#7c2d12] text-white',
      accentText: 'text-[#b45309]',
      optimalText: 'text-[#b45309]',
      scoreBadge: 'bg-white/20 text-white',
    };
  }
  return {
    cardBorder: 'border-[3px] md:border-[5px] border-[#be123c]',
    headerBg: 'bg-gradient-to-tr from-[#be123c] to-[#e11d48]',
    primaryBtn: 'bg-[#be123c] hover:bg-[#9f1239] border-b-3 border-[#881337] text-white',
    accentText: 'text-[#be123c]',
    optimalText: 'text-[#be123c]',
    scoreBadge: 'bg-white/20 text-white',
  };
};

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  score,
  feedback,
  distance,
  optimalDistance,
  onClose,
  onRetry,
  onNextLevel,
  hasNextLevel,
  playWin,
  stopWin,
  levelId = 1,
}) => {
  useEffect(() => {
    if (isOpen) {
      playWin();
    }
    return () => {
      stopWin();
    };
  }, [isOpen, playWin, stopWin]);

  if (!isOpen) return null;

  const isPerfect = score === 100;
  const isGood = score >= 80 && score < 100;
  const theme = getResultTheme(levelId);

  return (
    <div id="result-modal-backdrop" className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div id="result-modal-card" className={`bg-white rounded-[24px] sm:rounded-[32px] max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl ${theme.cardBorder} flex flex-col transform transition-all duration-300 scale-100`}>
        
        {/* Banner header themed by level card */}
        <div
          id="result-modal-header"
          className={`p-4 sm:p-6 text-center text-white relative flex flex-col items-center shrink-0 ${theme.headerBg}`}
        >
          {/* Close button top right */}
          <button
            id="result-modal-close-btn"
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/20 hover:bg-white/35 text-white p-1.5 rounded-full transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Trophy element with debounce bounce-jump animation */}
          <div id="result-modal-trophy" className="flex items-center justify-center mb-1.5 sm:mb-2 text-4xl sm:text-5xl select-none animate-bounce-jump">
            🏆
          </div>

          <h3 id="result-modal-title" className="text-base sm:text-xl font-bold font-display tracking-wide drop-shadow-xs">
            {isPerfect ? 'Misi Sukses Sempurna!' : isGood ? 'Misi Sukses!' : 'Misi Selesai!'}
          </h3>
          
          <div id="result-modal-score-badge" className={`mt-1 sm:mt-2 ${theme.scoreBadge} px-3.5 sm:px-5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase font-display backdrop-blur-xs`}>
            Skor Uji: {score} Poin
          </div>
        </div>

        {/* Modal content body */}
        <div id="result-modal-body" className="p-4 sm:p-6 flex-1 flex flex-col gap-3 sm:gap-4 overflow-y-auto">
          
          {/* Feedback message */}
          {feedback && (
            <div id="result-modal-feedback" className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/80 text-center">
              <p className="text-xs sm:text-sm font-semibold text-slate-700 font-sans">{feedback}</p>
            </div>
          )}

          {/* Compare mini metrics summary */}
          <div id="result-modal-metrics" className="grid grid-cols-2 gap-2 sm:gap-3 bg-slate-50 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200/80">
            <div className="text-center border-r border-slate-200">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">Rute Anda</span>
              <p className="text-base sm:text-lg font-extrabold text-slate-700 font-sans mt-0.5">{formatDistance(distance)}</p>
            </div>
            <div className="text-center">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">Rute Optimal</span>
              <p className={`text-base sm:text-lg font-extrabold ${theme.optimalText} font-sans mt-0.5`}>{formatDistance(optimalDistance)}</p>
              <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 font-sans">Teoritis Terpendek</p>
            </div>
          </div>

          {/* Action buttons */}
          <div id="result-modal-actions" className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 mt-2 sm:mt-3 pt-1 sm:pt-1.5 font-display tracking-wider shrink-0">
            <button
              id="result-modal-retry-btn"
              onClick={onRetry}
              className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
            >
              <RefreshCcw className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-600" />
              Coba Rute Lain
            </button>

            {hasNextLevel && (isPerfect || isGood) ? (
              <button
                id="result-modal-next-btn"
                onClick={onNextLevel}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold ${theme.primaryBtn} active:border-b-0 active:translate-y-[2px] flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer`}
              >
                Lanjut Level Berikutnya
                <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" />
              </button>
            ) : hasNextLevel ? (
              <button
                id="result-modal-skip-next-btn"
                onClick={onNextLevel}
                className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
              >
                Lompati ke Level Berikutnya
                <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              </button>
            ) : (
              <button
                id="result-modal-finish-btn"
                onClick={onClose}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold ${theme.primaryBtn} active:border-b-0 active:translate-y-[2px] flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer`}
              >
                Kembali ke Lab Game
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
