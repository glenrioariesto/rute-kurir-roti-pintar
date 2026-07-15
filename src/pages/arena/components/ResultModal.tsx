import { useEffect } from 'react';
import { Award, RefreshCcw, ArrowRight, X } from 'lucide-react';
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
}

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

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col transform transition-all duration-300 scale-100">
        
        {/* Banner header themed by score */}
        <div
          className={`p-4 sm:p-6 text-center text-white relative flex flex-col items-center shrink-0 ${
            isPerfect
              ? 'bg-gradient-to-tr from-amber-500 to-yellow-400'
              : isGood
              ? 'bg-gradient-to-tr from-indigo-500 to-blue-400'
              : 'bg-gradient-to-tr from-slate-600 to-slate-500'
          }`}
        >
          {/* Close button top right */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/20 hover:bg-white/35 text-white p-1 rounded-full transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Trophy element */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center mb-1.5 sm:mb-2 animate-bounce-slow">
            <Award className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
          </div>

          <h3 className="text-base sm:text-xl font-bold font-display tracking-wide">
            {isPerfect ? 'Misi Sukses Sempurna! 🎉' : isGood ? 'Misi Sukses! 👍' : 'Misi Selesai! 🚚'}
          </h3>
          
          <div className="mt-1 sm:mt-2 bg-white/15 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase font-display">
            Skor Uji: {score} Poin
          </div>
        </div>

        {/* Modal content body */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col gap-3 sm:gap-4 overflow-y-auto">
          
          {/* Compare mini metrics summary */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 bg-slate-50 p-2.5 sm:p-3.5 rounded-2xl border border-slate-150">
            <div className="text-center border-r border-slate-200">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">Rute Anda</span>
              <p className="text-base sm:text-lg font-extrabold text-slate-700 font-mono mt-0.5">{formatDistance(distance)}</p>
            </div>
            <div className="text-center">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">Rute Optimal</span>
              <p className="text-base sm:text-lg font-extrabold text-amber-600 font-mono mt-0.5">{formatDistance(optimalDistance)}</p>
              <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5">Teoritis Terpendek</p>
            </div>
          </div>


          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 mt-2 sm:mt-4 pt-1 sm:pt-1.5 font-display tracking-wider shrink-0">
            <button
              onClick={onRetry}
              className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-205 border border-slate-300 flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
            >
              <RefreshCcw className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-600" />
              Coba Rute Lain
            </button>

            {hasNextLevel && (isPerfect || isGood) ? (
              <button
                onClick={onNextLevel}
                className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-1.5 shadow-md shadow-indigo-200 active:scale-95 transition cursor-pointer"
              >
                Lanjut Level Berikutnya
                <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" />
              </button>
            ) : hasNextLevel ? (
              <button
                onClick={onNextLevel}
                className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
              >
                Lompati ke Level Berikutnya
                <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
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
