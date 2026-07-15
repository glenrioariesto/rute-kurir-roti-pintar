import { useState } from 'react';
import { SplashPage } from '@pages/splash/SplashPage';
import { DashboardPage } from '@pages/dashboard/DashboardPage';
import { ArenaPage } from '@pages/arena/ArenaPage';
import { PortraitWarning } from '@/components/shared/PortraitWarning';
import { useSound } from '@/hooks/useSound';

type Page = 'splash' | 'dashboard' | 'arena';

export default function App() {
  const [page, setPage] = useState<Page>('splash');
  const [selectedLevelId, setSelectedLevelId] = useState(1);
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

  const handleSelectLevel = (id: number) => {
    playClick();
    setSelectedLevelId(id);
    setPage('arena');
  };

  return (
    <>
      {page === 'splash' && (
        <SplashPage 
          onStart={() => {
            playClick();
            setPage('dashboard');
          }} 
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
