import { useState } from 'react';
import { ChevronRight, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { levels } from '@/levels';
import { TutorialModal } from '@/components/shared/TutorialModal';

const BASE_URL = import.meta.env?.BASE_URL || '/';
const logoPusbuk = `${BASE_URL}logo-pusbuk.webp`;

interface DashboardPageProps {
  onSelectLevel: (id: number) => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
  onPlayClick: () => void;
}

const difficultyLabel = (id: number) => {
  if (id === 1) return { label: 'Mudah', color: 'bg-emerald-50 text-emerald-600 border border-emerald-100' };
  if (id === 2) return { label: 'Sedang', color: 'bg-amber-50 text-amber-600 border border-amber-100' };
  return { label: 'Sulit', color: 'bg-rose-50 text-rose-600 border border-rose-100' };
};

const levelGradients = (id: number) => {
  if (id === 1) return {
    bg: 'from-emerald-400 to-teal-500',
    hoverBorder: 'hover:border-emerald-300/80',
    hoverGlow: 'hover:shadow-emerald-500/10',
    btnBg: 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 focus:ring-emerald-200',
    badgeBg: 'bg-emerald-50 text-emerald-700',
    numberBg: 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-400/25',
    accentText: 'text-emerald-500',
  };
  if (id === 2) return {
    bg: 'from-amber-400 to-orange-500',
    hoverBorder: 'hover:border-amber-300/80',
    hoverGlow: 'hover:shadow-amber-500/10',
    btnBg: 'bg-[#FC8C00] hover:bg-amber-600 active:bg-amber-700 focus:ring-amber-200',
    badgeBg: 'bg-amber-50 text-amber-700',
    numberBg: 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-400/25',
    accentText: 'text-amber-500',
  };
  return {
    bg: 'from-rose-400 to-pink-500',
    hoverBorder: 'hover:border-rose-300/80',
    hoverGlow: 'hover:shadow-rose-500/10',
    btnBg: 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 focus:ring-rose-200',
    badgeBg: 'bg-rose-50 text-rose-700',
    numberBg: 'bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg shadow-rose-400/25',
    accentText: 'text-rose-500',
  };
};

export function DashboardPage({ onSelectLevel, isSoundOn, onToggleSound, onPlayClick }: DashboardPageProps) {
  const [showTutorial, setShowTutorial] = useState(true);
  return (
    <div className="h-screen w-full bg-gradient-to-br from-amber-50/40 via-slate-50 to-orange-50/30 flex flex-col justify-center items-center relative overflow-hidden antialiased py-3 px-3 sm:py-4 sm:px-4 md:py-6 md:px-6 lg:py-8 lg:px-8">
      
      {/* Logo Pusbuk - Pojok Kiri Atas */}
      <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 md:top-6 md:left-6 z-30">
        <img 
          src={logoPusbuk} 
          alt="Logo Pusbuk" 
          className="h-7 sm:h-10 md:h-14 lg:h-18 w-auto object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Top-right Corner Buttons: Sound + Cara Main */}
      <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 md:top-6 md:right-6 z-30 flex items-center gap-2 sm:gap-2.5">
        {/* Sound Toggle */}
        <button
          onClick={() => {
            onPlayClick();
            onToggleSound();
          }}
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-500 hover:text-amber-600 hover:bg-white/90 hover:border-amber-200/60 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 active:scale-90 cursor-pointer group"
          title={isSoundOn ? 'Matikan Suara' : 'Nyalakan Suara'}
        >
          {isSoundOn ? (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 group-hover:scale-110 transition-transform" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 group-hover:scale-110 transition-transform text-slate-400" />
          )}
        </button>

        {/* Cara Main */}
        <button
          onClick={() => {
            onPlayClick();
            setShowTutorial(true);
          }}
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-500 hover:text-amber-600 hover:bg-white/90 hover:border-amber-200/60 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 active:scale-90 cursor-pointer group"
          title="Cara Bermain"
        >
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Centered Content Wrapper */}
      <div className="flex flex-col w-full max-w-5xl z-10 gap-3 sm:gap-4 md:gap-8 justify-center min-h-0">
        
        {/* Header */}
        <header className="w-full flex flex-col items-center text-center shrink-0">
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black font-display tracking-wide text-slate-800 leading-tight">
            Pilih Level
          </h1>
        </header>

        {/* Level Cards */}
        <main className="w-full min-h-0">
          <div className="w-full flex md:grid md:grid-cols-3 flex-row overflow-x-auto md:overflow-x-visible snap-x snap-mandatory gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-1 sm:px-2 md:px-0 pb-3 md:pb-0 scrollbar-none min-h-0">
            {levels.map((level) => {
              const diff = difficultyLabel(level.id);
              const theme = levelGradients(level.id);
              const housesOnlyCount = level.houses.filter(h => !h.isWaypoint && h.id !== 'Toko').length;
              
              return (
                <div
                  key={level.id}
                  onClick={() => onSelectLevel(level.id)}
                  className={`bg-white/80 backdrop-blur-md border border-slate-100/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 text-left flex flex-col justify-between shadow-sm hover:shadow-xl ${theme.hoverBorder} ${theme.hoverGlow} hover:-translate-y-1.5 transition-all duration-300 active:scale-98 group cursor-pointer relative overflow-hidden shrink-0 w-[75vw] sm:w-[55vw] md:w-auto snap-center min-h-[200px] sm:min-h-[220px] md:min-h-[250px]`}
                >
                  {/* Background decoration */}
                  <div className="absolute right-3 sm:right-4 top-8 sm:top-10 opacity-15 pointer-events-none group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">
                    <svg width="80" height="64" viewBox="0 0 100 80" fill="none" stroke="currentColor" className="w-16 h-12 sm:w-20 sm:h-16 md:w-[100px] md:h-[80px]">
                      <circle cx="20" cy="60" r="5" fill="currentColor" className={theme.accentText} />
                      <circle cx="55" cy="20" r="5" fill="currentColor" className={theme.accentText} />
                      <circle cx="85" cy="45" r="5" fill="currentColor" className={theme.accentText} />
                      <line x1="20" y1="60" x2="55" y2="20" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" className={theme.accentText} />
                      <line x1="55" y1="20" x2="85" y2="45" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" className={theme.accentText} />
                    </svg>
                  </div>

                  {/* Card Top: Level number + difficulty */}
                  <div className="flex items-start justify-between shrink-0">
                    <div className="flex flex-col">
                      <span className="text-[8px] sm:text-[9px] font-black text-slate-400 tracking-wider uppercase font-display mb-0.5">
                        Level
                      </span>
                      <span className={`text-3xl sm:text-4xl font-black font-display leading-none bg-gradient-to-br ${theme.bg} bg-clip-text text-transparent`}>
                        {level.id < 10 ? `0${level.id}` : level.id}
                      </span>
                    </div>
                    <span className={`text-[8px] sm:text-[9px] md:text-[10px] font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${diff.color}`}>
                      {diff.label}
                    </span>
                  </div>

                  {/* Level Title */}
                  <div className="my-3 sm:my-4 md:my-5 shrink-0">
                    <h3 className="font-black text-slate-800 text-sm sm:text-base md:text-lg leading-tight font-display tracking-wide group-hover:text-amber-600 transition-colors pr-10 sm:pr-12">
                      {level.title.replace(/Level \d+: /, '')}
                    </h3>
                  </div>

                  {/* Stats + Play Button */}
                  <div className="mt-auto shrink-0">
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
                      <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-50 text-slate-600 font-bold text-[8px] sm:text-[9px] md:text-[10px] border border-slate-100">
                        {housesOnlyCount} Rumah + 1 Toko Roti
                      </span>
                      {level.timeLimitMinutes && (
                        <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-50 text-slate-600 font-bold text-[8px] sm:text-[9px] md:text-[10px] border border-slate-100">
                          ⏱️ {level.timeLimitMinutes} Menit
                        </span>
                      )}
                    </div>

                    <button className={`w-full py-2 sm:py-2.5 pl-4 sm:pl-5 pr-2 sm:pr-2.5 rounded-xl sm:rounded-2xl text-white font-bold text-[10px] sm:text-xs flex items-center justify-between shadow-md transition-all duration-300 hover:shadow-lg active:scale-98 cursor-pointer group/btn border border-white/10 ${theme.btnBg}`}>
                      <span className="font-display tracking-wider">Mulai Bermain</span>
                      <span className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-full flex items-center justify-center group-hover/btn:bg-white/35 group-hover/btn:translate-x-0.5 transition-all">
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                        </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} onPlayClick={onPlayClick} />
    </div>
  );
}
