import { ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { levels } from '@/levels';

const BASE_URL = import.meta.env?.BASE_URL || '/';
const logoPusbuk = `${BASE_URL}logo-pusbuk.webp`;
const dashboardBg = `${BASE_URL}bg-splash.webp?v=2`;

interface DashboardPageProps {
  onSelectLevel: (id: number) => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
  onPlayClick: () => void;
}

const difficultyLabel = (id: number) => {
  if (id === 1) return { label: 'Mudah', color: 'bg-[#0f5a31] text-white shadow-xs' };
  if (id === 2) return { label: 'Sedang', color: 'bg-[#b45309] text-white shadow-xs' };
  return { label: 'Sulit', color: 'bg-[#be123c] text-white shadow-xs' };
};

const levelGradients = (id: number) => {
  if (id === 1) return {
    bg: 'from-emerald-400 to-teal-500',
    cardBg: 'bg-emerald-50/90 backdrop-blur-md border-[3px] border-[#0f5a31]',
    hoverBorder: 'hover:border-[#16a34a]',
    hoverGlow: 'hover:shadow-emerald-500/10',
    btnBg: 'bg-[#0f5a31] hover:bg-[#0b4826] border-b-3 border-[#073019] active:border-b-0 active:translate-y-[3px]',
    badgeBg: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    statsBg: 'bg-emerald-100/50 text-emerald-800 border border-emerald-200/50',
    numberBg: 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-400/25',
    accentText: 'text-[#0f5a31]',
  };
  if (id === 2) return {
    bg: 'from-amber-400 to-orange-500',
    cardBg: 'bg-amber-50/90 backdrop-blur-md border-[3px] border-[#b45309]',
    hoverBorder: 'hover:border-[#ea580c]',
    hoverGlow: 'hover:shadow-amber-500/10',
    btnBg: 'bg-[#b45309] hover:bg-[#9a3412] border-b-3 border-[#7c2d12] active:border-b-0 active:translate-y-[3px]',
    badgeBg: 'bg-amber-100 text-amber-800 border border-amber-200',
    statsBg: 'bg-amber-100/50 text-amber-800 border border-amber-200/50',
    numberBg: 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-400/25',
    accentText: 'text-[#b45309]',
  };
  return {
    bg: 'from-rose-400 to-pink-500',
    cardBg: 'bg-rose-50/90 backdrop-blur-md border-[3px] border-[#be123c]',
    hoverBorder: 'hover:border-[#e11d48]',
    hoverGlow: 'hover:shadow-rose-500/10',
    btnBg: 'bg-[#be123c] hover:bg-[#9f1239] border-b-3 border-[#881337] active:border-b-0 active:translate-y-[3px]',
    badgeBg: 'bg-rose-100 text-rose-800 border border-rose-200',
    statsBg: 'bg-rose-100/50 text-rose-800 border border-rose-200/50',
    numberBg: 'bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg shadow-rose-400/25',
    accentText: 'text-[#be123c]',
  };
};

const titleColorClass = (id: number) => {
  if (id === 1) return 'text-[#0f5a31]/50 group-hover:text-[#0f5a31]';
  if (id === 2) return 'text-[#b45309]/50 group-hover:text-[#b45309]';
  return 'text-[#be123c]/50 group-hover:text-[#be123c]';
};

export function DashboardPage({ onSelectLevel, isSoundOn, onToggleSound, onPlayClick }: DashboardPageProps) {
  return (
    <div id="dashboard-page" className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden antialiased py-1.5 px-2 sm:py-3 sm:px-4 lg:py-6 lg:px-8 xl:py-8 select-none">
      {/* Background Image - Full screen */}
      <div id="dashboard-bg-container" className="absolute inset-0 z-0 pointer-events-none select-none">
        <img
          id="dashboard-bg-img"
          src={dashboardBg}
          alt="Latar Belakang Level"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Logo Pusbuk - Pojok Kiri Atas */}
      <div id="dashboard-logo-container" className="absolute top-2 left-2 sm:top-4 sm:left-4 md:top-6 md:left-6 2xl:top-10 2xl:left-10 z-30">
        <img 
          id="dashboard-logo"
          src={logoPusbuk} 
          alt="Logo Pusbuk" 
          className="h-6 sm:h-9 md:h-14 lg:h-18 2xl:h-28 w-auto object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Top-right Corner Buttons: Sound + Cara Main */}
      <div id="dashboard-sound-container" className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 2xl:top-10 2xl:right-10 z-30 flex items-center gap-1.5 sm:gap-2.5">
        {/* Sound Toggle */}
        <button
          id="dashboard-sound-btn"
          onClick={() => {
            onPlayClick();
            onToggleSound();
          }}
          className="w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 2xl:w-20 2xl:h-20 bg-white/50 backdrop-blur-md border border-slate-200/60 rounded-lg sm:rounded-2xl 2xl:rounded-3xl flex items-center justify-center text-slate-500 hover:text-amber-600 hover:bg-white/90 hover:border-amber-200/60 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 active:scale-90 cursor-pointer group"
          title={isSoundOn ? 'Matikan Suara' : 'Nyalakan Suara'}
        >
          {isSoundOn ? (
            <Volume2 className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-5.5 md:h-5.5 2xl:w-10 2xl:h-10 group-hover:scale-110 transition-transform" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-5.5 md:h-5.5 2xl:w-10 2xl:h-10 group-hover:scale-110 transition-transform text-slate-400" />
          )}
        </button>
      </div>

      {/* Header - Separate from dashboard-card on both mobile and desktop */}
      <header 
        id="dashboard-header" 
        className="z-10 w-fit mx-auto flex flex-col items-center text-center shrink-0 bg-[#0090D4] backdrop-blur-md border-[2.5px] sm:border-[3px] md:border-[4px] 2xl:border-[6px] border-white rounded-lg sm:rounded-2xl 2xl:rounded-3xl shadow-lg py-1 px-3.5 sm:py-2 sm:px-6 md:py-2.5 md:px-8 2xl:py-3.5 2xl:px-12 mb-1.5 sm:mb-3 md:mb-4 lg:mb-5 2xl:mb-7 animate-fade-in-up"
      >
        <h1 
          id="dashboard-title" 
          className="text-xs sm:text-lg md:text-2xl lg:text-4xl 2xl:text-5xl font-black font-display tracking-wide text-white leading-tight drop-shadow-md select-none"
        >
          Pilih Level
        </h1>
      </header>

      {/* Level Cards Wrapper Card - Active on desktop (lg:), transparent/borderless on mobile */}
      <div 
        id="dashboard-card" 
        className="z-10 w-full max-w-5xl 2xl:max-w-6xl bg-transparent lg:bg-white/50 lg:backdrop-blur-md border-0 lg:border-[3px] md:border-[5px] 2xl:border-[7px] border-transparent lg:border-white rounded-none lg:rounded-2xl md:rounded-[24px] 2xl:rounded-[36px] shadow-none lg:shadow-2xl flex flex-col p-0 lg:p-8 2xl:p-12 justify-center min-h-0 animate-fade-in-up transition-all duration-500"
      >
        {/* Level Cards */}
        <main id="dashboard-main" className="w-full min-h-0">
          <div id="dashboard-level-grid" className="w-full grid grid-cols-3 gap-1.5 sm:gap-3 md:gap-4 lg:gap-5 2xl:gap-7 px-0 pb-0 min-h-0">
            {levels.map((level) => {
              const diff = difficultyLabel(level.id);
              const theme = levelGradients(level.id);
              const housesOnlyCount = level.houses.filter(h => !h.isWaypoint && h.id !== 'Toko').length;
              
              return (
                <div
                  key={level.id}
                  id={`dashboard-level-card-${level.id}`}
                  onClick={() => onSelectLevel(level.id)}
                  className={`${theme.cardBg} rounded-lg sm:rounded-2xl md:rounded-3xl 2xl:rounded-4xl p-2 sm:p-3 md:p-5 lg:p-6 2xl:p-8 text-left flex flex-col justify-between shadow-sm hover:shadow-xl ${theme.hoverBorder} ${theme.hoverGlow} hover:-translate-y-1 transition-all duration-300 active:scale-98 group cursor-pointer relative overflow-hidden w-full min-h-0 sm:min-h-[160px] md:min-h-[220px] lg:min-h-[250px] 2xl:min-h-[300px]`}
                >

                  {/* Card Top: Level number + difficulty */}
                  <div className="flex items-start justify-between shrink-0">
                    <div className="flex flex-col">
                      <span className="text-[6.5px] sm:text-[8px] md:text-[9px] 2xl:text-xs font-black text-slate-400 tracking-wider uppercase font-display leading-none mb-0.5">
                        Level
                      </span>
                      <span className={`text-base sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-black font-display leading-none ${theme.accentText}`}>
                        {level.id < 10 ? `0${level.id}` : level.id}
                      </span>
                    </div>
                    <span className={`text-[6.5px] sm:text-[8px] md:text-xs lg:text-sm 2xl:text-base font-black px-1.5 sm:px-2.5 md:px-3 py-0.5 lg:py-1 2xl:py-1.5 2xl:px-4 rounded-full ${diff.color} leading-none`}>
                      {diff.label}
                    </span>
                  </div>

                  {/* Level Title */}
                  <div className="my-1 sm:my-2 md:my-3 lg:my-5 2xl:my-6 shrink-0">
                     <h3 id={`dashboard-level-title-${level.id}`} className={`font-black ${titleColorClass(level.id)} text-[9px] sm:text-xs md:text-base lg:text-lg 2xl:text-2xl leading-tight font-display tracking-wide transition-colors duration-300 pr-1 sm:pr-3 md:pr-8 truncate sm:whitespace-normal`}>
                      {level.title.replace(/Level \d+: /, '')}
                    </h3>
                  </div>

                  {/* Stats + Play Button */}
                  <div className="mt-auto shrink-0 flex flex-col">
                    <div className="flex flex-wrap gap-0.5 sm:gap-1 md:gap-1.5 2xl:gap-2 mb-1 sm:mb-2 md:mb-3 lg:mb-4 2xl:mb-6">
                      {/* <span className={`inline-flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2 md:px-2.5 2xl:px-3.5 py-0.5 sm:py-1 md:py-1.5 2xl:py-2 rounded sm:rounded-lg md:rounded-xl 2xl:rounded-2xl ${theme.statsBg} font-bold text-[6.5px] sm:text-[8px] md:text-[10px] lg:text-xs 2xl:text-sm whitespace-nowrap leading-none`}>
                        {housesOnlyCount} Rumah + 1 Toko<span className="hidden sm:inline"> Roti</span>
                      </span> */}
                      {level.timeLimitMinutes && (
                        <span className={`inline-flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2 md:px-2.5 2xl:px-3.5 py-0.5 sm:py-1 md:py-1.5 2xl:py-2 rounded sm:rounded-lg md:rounded-xl 2xl:rounded-2xl ${theme.statsBg} font-bold text-[6.5px] sm:text-[8px] md:text-[10px] lg:text-xs 2xl:text-sm whitespace-nowrap leading-none`}>
                          ⏱️ {level.timeLimitMinutes}<span className="hidden sm:inline"> Menit</span><span className="sm:hidden">m</span>
                        </span>
                      )}
                    </div>

                    <button id={`dashboard-level-play-btn-${level.id}`} className={`w-full py-1 sm:py-1.5 md:py-2.5 2xl:py-3.5 pl-1.5 sm:pl-3 md:pl-5 2xl:pl-6 pr-1 sm:pr-1.5 md:pr-2.5 2xl:pr-4 rounded-md sm:rounded-xl md:rounded-2xl 2xl:rounded-3xl text-white font-bold text-[7.5px] sm:text-[9px] md:text-xs 2xl:text-base flex items-center justify-between shadow-xs sm:shadow-md transition-all duration-300 hover:shadow-lg active:scale-98 cursor-pointer group/btn border border-white/10 ${theme.btnBg}`}>
                      <span className="font-display tracking-wider">Mulai Bermain</span>
                      <span className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 2xl:w-9 2xl:h-9 bg-white/20 rounded-full flex items-center justify-center group-hover/btn:bg-white/35 group-hover/btn:translate-x-0.5 transition-all shrink-0">
                        <ChevronRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 2xl:w-5 2xl:h-5 text-white" />
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>


    </div>
  );
}
