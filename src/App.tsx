import { useState, useEffect } from 'react';
import { SplashPage } from '@pages/splash/SplashPage';
import { DashboardPage } from '@pages/dashboard/DashboardPage';
import { ArenaPage } from '@pages/arena/ArenaPage';
import { PortraitWarning } from '@/components/shared/PortraitWarning';
import { useSound } from '@/hooks/useSound';

type Page = 'splash' | 'dashboard' | 'arena';

export default function App() {
  const [page, setPage] = useState<Page>('splash');
  const [selectedLevelId, setSelectedLevelId] = useState(1);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);

  // Disable right-click / context menu globally across all game components
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    window.addEventListener('contextmenu', handleContextMenu);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const {
    isSoundOn,
    toggleSound,
    playClick,
    playHouseClick,
    playWaypointClick,
    playDeliverSound,
    playResetSound,
    playUndoSound,
    playMotor,
    stopMotor,
    playWin,
    stopWin,
  } = useSound();

  const handleStartFromSplash = () => {
    playClick();
    const isFullscreenSupported = typeof document !== 'undefined' && !!document.documentElement.requestFullscreen;
    const isCurrentlyFullscreen = typeof document !== 'undefined' && !!document.fullscreenElement;
    if (isFullscreenSupported && !isCurrentlyFullscreen) {
      setShowFullscreenPrompt(true);
    } else {
      setPage('dashboard');
    }
  };

  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen permission denied or not supported by browser", err);
    }
    setShowFullscreenPrompt(false);
    setPage('dashboard');
  };

  const handleSelectLevel = (id: number) => {
    playClick();
    setSelectedLevelId(id);
    setPage('arena');
  };

  return (
    <>
      {/* Mode Layar Penuh Modal - Colors exactly matching Splash page (#0f5a31 green border, #037DC2 blue button) */}
      {showFullscreenPrompt && (
        <div id="fullscreen-prompt-modal" className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 select-none animate-fadeIn">
          <div id="fullscreen-prompt-card" className="relative max-w-sm w-full mx-auto bg-white border-[3px] border-[#0f5a31] shadow-2xl rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center">
            <div id="fullscreen-prompt-icon-wrapper" className="relative flex items-center justify-center mb-6">
              <div className="absolute w-20 h-20 bg-[#037DC2]/20 rounded-full animate-ping opacity-75" />
              <div className="w-16 h-16 bg-[#037DC2]/10 border border-[#037DC2]/30 rounded-2xl flex items-center justify-center text-3xl shadow-sm z-10">
                📺
              </div>
            </div>

            <h3 id="fullscreen-prompt-title" className="text-lg sm:text-xl font-black text-slate-800 tracking-tight mb-2 uppercase font-display">
              Mode Layar Penuh
            </h3>
            
            <p id="fullscreen-prompt-desc" className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">
              Apakah Anda ingin masuk ke mode layar penuh?
            </p>

            <div id="fullscreen-prompt-actions" className="flex items-center gap-3 w-full">
              <button
                id="fullscreen-prompt-yes-btn"
                type="button"
                onClick={enterFullscreen}
                className="flex-1 bg-[#037DC2] hover:bg-[#074C83] border-b-3 border-[#074C83] text-white font-black py-2.5 rounded-xl transition-all shadow-md active:translate-y-[2px] active:border-b-0 cursor-pointer uppercase tracking-wide font-display text-xs"
              >
                Yes
              </button>
              
              <button
                id="fullscreen-prompt-no-btn"
                type="button"
                onClick={() => {
                  playClick();
                  setShowFullscreenPrompt(false);
                  setPage('dashboard');
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-black py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer uppercase tracking-wide font-display text-xs"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {page === 'splash' && (
        <SplashPage 
          onStart={handleStartFromSplash} 
          isSoundOn={isSoundOn} 
          onToggleSound={toggleSound}
          onPlayClick={playClick}
        />
      )}
      {page === 'dashboard' && (
        <DashboardPage 
          onSelectLevel={handleSelectLevel} 
          isSoundOn={isSoundOn} 
          onToggleSound={toggleSound} 
          onPlayClick={playClick}
        />
      )}
      {page === 'arena' && (
        <ArenaPage 
          initialLevelId={selectedLevelId} 
          onBack={() => {
            playClick();
            setPage('dashboard');
          }} 
          onPlayClick={playClick} 
          isSoundOn={isSoundOn}
          onToggleSound={toggleSound}
          playHouseClick={playHouseClick}
          playWaypointClick={playWaypointClick}
          playDeliverSound={playDeliverSound}
          playResetSound={playResetSound}
          playUndoSound={playUndoSound}
          playMotor={playMotor}
          stopMotor={stopMotor}
          playWin={playWin}
          stopWin={stopWin}
        />
      )}
      <PortraitWarning />
    </>
  );
}
