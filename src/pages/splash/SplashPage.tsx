import { ChevronRight, Play, Volume2, VolumeX } from 'lucide-react';

const BASE_URL = import.meta.env?.BASE_URL || '/';
const logoPusbuk = `${BASE_URL}logo-pusbuk.webp`;
const splashBg = `${BASE_URL}bg-splash.webp?v=2`;

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
      id="splash-page"
      className="h-screen w-full flex flex-col justify-center items-end relative overflow-hidden select-none pl-4 pr-3 lg:pr-12 2xl:pr-24"
      style={{ 
        backgroundImage: `url(${splashBg})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      {/* Soft bright gradient overlay */}
      <div id="splash-gradient-overlay" className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 z-0 animate-fade-in" />

      {/* Logo Pusbuk - Floating in Top Corner */}
      <div id="splash-logo-container" className="absolute top-4 left-4 sm:top-6 sm:left-6 2xl:top-10 2xl:left-10 z-30">
        <img 
          id="splash-logo"
          src={logoPusbuk} 
          alt="Logo Pusbuk" 
          className="h-7 sm:h-10 md:h-14 lg:h-16 2xl:h-28 w-auto object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Top-right Corner Buttons: Sound */}
      <div id="splash-sound-container" className="absolute top-4 right-4 sm:top-6 sm:right-6 2xl:top-10 2xl:right-10 z-30">
        <button
          id="splash-sound-btn"
          onClick={handleToggle}
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 2xl:w-20 2xl:h-20 bg-white/20 backdrop-blur-lg border border-white/35 2xl:border-white/50 rounded-xl sm:rounded-2xl 2xl:rounded-3xl flex items-center justify-center text-slate-800 hover:bg-white/35 hover:border-white/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 active:scale-90 cursor-pointer group"
          title={isSoundOn ? 'Matikan Suara' : 'Nyalakan Suara'}
        >
          {isSoundOn ? (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 2xl:w-10 2xl:h-10 group-hover:scale-110 transition-transform" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 2xl:w-10 2xl:h-10 group-hover:scale-110 transition-transform text-slate-500" />
          )}
        </button>
      </div>

      {/* Card (Worksheet modal-like card with thick green border) */}
      <div id="splash-card" className="z-10 relative max-w-[290px] lg:max-w-[580px] 2xl:max-w-[820px] w-full bg-white border-[3px] md:border-[5px] 2xl:border-[7px] border-[#0f5a31] rounded-[24px] 2xl:rounded-[36px] shadow-2xl overflow-hidden flex flex-col p-4 lg:p-10 2xl:p-12 gap-4 lg:gap-8 2xl:gap-10 animate-fade-in-up hover:shadow-green-900/10 transition-all duration-500">
        {/* Title Section */}
        <h1 id="splash-title" className="text-lg lg:text-[40px] 2xl:text-[48px] font-display text-slate-800 uppercase leading-tight select-none font-black px-2 2xl:px-4">
          Rute Pintar <br />
          <span className="bg-gradient-to-r from-[#0f5a31] to-[#1e8d4f] bg-clip-text text-transparent 2xl:whitespace-nowrap 2xl:inline-block">
            Sang pengantar roti
          </span>
        </h1>

        {/* Start Button */}
        <button
          id="splash-start-btn"
          onClick={onStart}
          className="w-full py-3 px-5 lg:py-4 lg:px-8 2xl:py-5 2xl:px-10 rounded-xl sm:rounded-2xl 2xl:rounded-3xl text-white font-black text-sm lg:text-lg 2xl:text-2xl flex items-center justify-center gap-2 2xl:gap-3 bg-[#037DC2] hover:bg-[#074C83] border-b-3 2xl:border-b-4 border-[#074C83] active:border-b-0 active:translate-y-[3px] transition-all font-display tracking-wider cursor-pointer shadow-md hover:shadow-lg hover:shadow-amber-900/10 group"
        >
          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-6 2xl:h-6 fill-white text-white group-hover:scale-110 transition-transform" />
          Mulai Game
        </button>
      </div>
    </div>
  );
}
