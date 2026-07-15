import { ChevronRight, Play, Volume2, VolumeX } from 'lucide-react';

const BASE_URL = import.meta.env?.BASE_URL || '/';
const logoPusbuk = `${BASE_URL}logo-pusbuk.webp`;
const splashBg = `${BASE_URL}splash-bg.webp`;

interface SplashPageProps {
  onStart: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
  onPlayClick: () => void;
}

export function SplashPage({ onStart, isSoundOn, onToggleSound, onPlayClick }: SplashPageProps) {
  const handleToggle = () => {
    onPlayClick();
    onToggleSound();
  };
  return (
    <div 
      className="h-screen w-full flex flex-col justify-center items-end relative overflow-hidden select-none pl-4 pr-3 lg:pr-12 2xl:pr-24"
      style={{ 
        backgroundImage: `url(${splashBg})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      {/* Soft bright gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 z-0 animate-fade-in" />

      {/* Logo Pusbuk - Floating in Top Corner */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30">
        <img 
          src={logoPusbuk} 
          alt="Logo Pusbuk" 
          className="h-7 sm:h-10 md:h-14 lg:h-16 w-auto object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Top-right Corner Buttons: Sound */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
        <button
          onClick={handleToggle}
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-lg border border-white/35 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-800 hover:bg-white/35 hover:border-white/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 active:scale-90 cursor-pointer group"
          title={isSoundOn ? 'Matikan Suara' : 'Nyalakan Suara'}
        >
          {isSoundOn ? (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 group-hover:scale-110 transition-transform" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 group-hover:scale-110 transition-transform text-slate-500" />
          )}
        </button>
      </div>

      {/* Right-aligned Card (Transparent White/Glassmorphism) */}
      <div className="z-10 bg-white/20 backdrop-blur-lg border border-white/35 rounded-2xl sm:rounded-3xl p-4 lg:p-10 max-w-[290px] lg:max-w-lg w-full shadow-xl hover:shadow-2xl hover:bg-white/25 hover:border-white/50 transition-all duration-500 flex flex-col gap-4 sm:gap-8 animate-fade-in-up">
        {/* Title */}
        <h1 className="text-3xl lg:text-5xl font-display text-slate-800 leading-tight drop-shadow-sm select-none">
          Petualangan Kurir<br />
          <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-600 bg-clip-text text-transparent">
            Mengantar Roti
          </span>
        </h1>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="w-full sm:w-auto px-5 py-2.5 sm:px-10 sm:py-4 md:px-12 md:py-4.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-display text-xs sm:text-lg md:text-xl rounded-lg shadow-lg border border-amber-300/30 hover:scale-[1.03] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 cursor-pointer group animate-pulse-glow"
        >
          <Play className="w-3 h-3 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 fill-white text-white" />
          Mulai Game
        </button>
      </div>
    </div>
  );
}
