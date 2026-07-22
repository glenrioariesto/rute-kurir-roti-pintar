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

      {/* Card (Worksheet modal-like card with thick green border) */}
      <div className="z-10 relative max-w-[290px] lg:max-w-lg w-full bg-white/50 backdrop-blur-xs border-[3px] md:border-[5px] border-[#0f5a31] rounded-2xl md:rounded-[24px] shadow-2xl overflow-hidden flex flex-col p-4 lg:p-10 gap-4 lg:gap-8 animate-fade-in-up hover:shadow-green-900/10 hover:bg-white/90 transition-all duration-500">
        {/* Title Section */}
        <h1 className="text-lg lg:text-3xl font-display text-slate-800 leading-tight select-none text-center font-black">
          Menentukan Rute Pengantaran<br />
          <span className="bg-gradient-to-r from-[#0f5a31] to-[#1e8d4f] bg-clip-text text-transparent">
            Roti Paling Efisien
          </span>
        </h1>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="w-full py-3 px-5 lg:py-4 lg:px-8 rounded-xl sm:rounded-2xl text-white font-black text-sm lg:text-lg flex items-center justify-center gap-2 bg-[#0f5a31] hover:bg-[#0b4826] border-b-4 sm:border-b-5 border-[#073019] active:border-b-0 active:translate-y-[4px] sm:active:translate-y-[5px] transition-all font-display tracking-wider cursor-pointer shadow-md hover:shadow-lg hover:shadow-green-950/10 group"
        >
          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white group-hover:scale-110 transition-transform" />
          Mulai Game
        </button>
      </div>
    </div>
  );
}
