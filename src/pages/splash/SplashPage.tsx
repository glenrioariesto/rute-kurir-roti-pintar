import { Sparkles, ChevronRight } from 'lucide-react';
import logoPusbuk from '../../../assets/logo-pusbuk.webp';

interface SplashPageProps {
  onStart: () => void;
}

export function SplashPage({ onStart }: SplashPageProps) {
  return (
    <div className="h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex flex-col overflow-hidden">

      {/* Logo */}
      <div className="px-4 py-2 shrink-0">
        <img 
          src={logoPusbuk} 
          alt="Logo Pusbuk" 
          className="h-8 w-auto object-contain"
        />
      </div>

      {/* Konten tengah */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 text-center gap-2.5 min-h-0">

        <div className="text-4xl sm:text-6xl animate-bounce">🍞</div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold tracking-wide">
          <Sparkles className="w-3 h-3" />
          Computational Thinking Game
        </span>

        <h1 className="text-xl sm:text-3xl font-black text-slate-800 leading-tight font-display tracking-wide">
          Rute Kurir<br />
          <span className="text-amber-500">Roti Pintar</span>
        </h1>

        <p className="text-slate-500 text-[8.5px] md:text-[11px] max-w-[260px] leading-relaxed font-medium">
          Bantu kurir menemukan rute tercepat untuk mengantarkan roti ke semua rumah warga setiap pagi!
        </p>

        <button
          onClick={onStart}
          className="mt-1 flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/30 transition-all active:scale-95 font-display tracking-wider"
        >
          Mulai Bermain
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <p className="text-[10px] text-slate-400">5 Level Tantangan Tersedia</p>
      </div>

      <div className="px-5 py-2 text-center shrink-0">
        <p className="text-[10px] text-slate-400">Belajar Algoritma & Problem Solving dengan cara seru 🧠</p>
      </div>

    </div>
  );
}
