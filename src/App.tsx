import { useState } from 'react';
import { SplashPage } from '@pages/splash/SplashPage';
import { DashboardPage } from '@pages/dashboard/DashboardPage';
import { ArenaPage } from '@pages/arena/ArenaPage';

type Page = 'splash' | 'dashboard' | 'arena';

export default function App() {
  const [page, setPage] = useState<Page>('splash');
  const [selectedLevelId, setSelectedLevelId] = useState(1);

  const handleSelectLevel = (id: number) => {
    setSelectedLevelId(id);
    setPage('arena');
  };

  if (page === 'splash') return <SplashPage onStart={() => setPage('dashboard')} />;
  if (page === 'dashboard') return <DashboardPage onSelectLevel={handleSelectLevel} />;
  return <ArenaPage initialLevelId={selectedLevelId} onBack={() => setPage('dashboard')} />;
}
