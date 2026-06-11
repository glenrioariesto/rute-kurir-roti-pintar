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
}) => {
  if (!isOpen) return null;

  const isPerfect = score === 100;
  const isGood = score >= 80 && score < 100;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col transform transition-all duration-300 scale-100">
        
        {/* Banner header themed by score */}
        <div
          className={`p-6 text-center text-white relative flex flex-col items-center ${
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
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/35 text-white p-1 rounded-full transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Trophy element */}
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-2 animate-bounce-slow">
            <Award className="w-10 h-10 text-white" />
          </div>

          <h3 className="text-xl font-bold font-display tracking-wide">
            {isPerfect ? 'Misi Sukses Sempurna! 🎉' : isGood ? 'Misi Sukses! 👍' : 'Misi Selesai! 🚚'}
          </h3>
          
          <div className="mt-2 bg-white/15 px-4 py-1 rounded-full text-xs font-semibold tracking-wider uppercase font-display">
            Skor Uji: {score} Poin
          </div>
        </div>

        {/* Modal content body */}
        <div className="p-6 flex-1 flex flex-col gap-4">
          
          {/* Compare mini metrics summary */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-150">
            <div className="text-center border-r border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">Rute Anda</span>
              <p className="text-lg font-extrabold text-slate-700 font-mono mt-0.5">{formatDistance(distance)}</p>
            </div>
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">Rute Optimal</span>
              <p className="text-lg font-extrabold text-amber-600 font-mono mt-0.5">{formatDistance(optimalDistance)}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Teoritis Terpendek</p>
            </div>
          </div>


          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-1.5 font-display tracking-wider">
            <button
              onClick={onRetry}
              className="flex-1 py-3 px-4 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-205 border border-slate-300 flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <RefreshCcw className="w-3.5 h-3.5 text-slate-600" />
              Coba Rute Lain
            </button>

            {hasNextLevel && (isPerfect || isGood) ? (
              <button
                onClick={onNextLevel}
                className="flex-1 py-3 px-4 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-1.5 shadow-md shadow-indigo-200 active:scale-95 transition"
              >
                Lanjut Level Berikutnya
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            ) : hasNextLevel ? (
              <button
                onClick={onNextLevel}
                className="flex-1 py-3 px-4 rounded-2xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-1.5 active:scale-95 transition"
              >
                Lompati ke Level Berikutnya
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-2xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-1.5 active:scale-95 transition"
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
