import { useState } from 'react';
import { SplashPage } from '@pages/splash/SplashPage';
import { DashboardPage } from '@pages/dashboard/DashboardPage';
import { ArenaPage } from '@pages/arena/ArenaPage';
import { PortraitWarning } from '@/components/shared/PortraitWarning';

type Page = 'splash' | 'dashboard' | 'arena';

export default function App() {
  const [page, setPage] = useState<Page>('splash');
  const [selectedLevelId, setSelectedLevelId] = useState(1);

  const handleSelectLevel = (id: number) => {
    setSelectedLevelId(id);
    setPage('arena');
  };

  return (
    <>
      {page === 'splash' && <SplashPage onStart={() => setPage('dashboard')} />}
      {page === 'dashboard' && <DashboardPage onSelectLevel={handleSelectLevel} />}
      {page === 'arena' && <ArenaPage initialLevelId={selectedLevelId} onBack={() => setPage('dashboard')} />}
      <PortraitWarning />
    </>
  );
}
