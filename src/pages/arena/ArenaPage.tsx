import { useState } from 'react';
import { levels } from '@/levels';
import { useRouteGame } from '@hooks/useRouteGame';
import { MapCanvas } from '@pages/arena/components/MapCanvas';
import { ResultModal } from '@pages/arena/components/ResultModal';
import { TutorialModal } from '@/components/shared/TutorialModal';
import { AlertCircle } from 'lucide-react';

interface ArenaPageProps {
  initialLevelId: number;
  onBack: () => void;
  onPlayClick?: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
}

export function ArenaPage({ initialLevelId, onBack, onPlayClick, isSoundOn, onToggleSound }: ArenaPageProps) {
  const [selectedLevelId, setSelectedLevelId] = useState(initialLevelId);
  const [showTutorial, setShowTutorial] = useState(false);

  const currentLevel = levels.find((l) => l.id === selectedLevelId) || levels[0];

  const {
    selectedRoute, segmentLengths, isDelivering, showResult, setShowResult,
    score, feedback, errorToast, optimal, currentMetrics,
    handleHouseClick, handleUndo, handleReset, handleDeliver, handleStopDeliver,
    getCourierPosition, attempts, animationStep, deliverySpeed, setDeliverySpeed,
  } = useRouteGame(currentLevel);

  const handleNextLevel = () => {
    if (selectedLevelId < levels.length) setSelectedLevelId(selectedLevelId + 1);
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      <main className="flex-1 overflow-hidden flex">
        {/* MAP CANVAS fills the entire screen */}
        <div className="flex-1 relative overflow-hidden">
          <MapCanvas
            level={currentLevel}
            selectedRoute={selectedRoute}
            segmentLengths={segmentLengths}
            isDelivering={isDelivering}
            animationStep={animationStep}
            courierPos={getCourierPosition()}
            onHouseClick={handleHouseClick}
            onBack={onBack}
            onUndo={handleUndo}
            onReset={handleReset}
            onDeliver={handleDeliver}
            onStopDeliver={handleStopDeliver}
            deliverySpeed={deliverySpeed}
            onChangeSpeed={setDeliverySpeed}
            currentMetrics={currentMetrics}
            onHelpClick={() => {
              onPlayClick?.();
              setShowTutorial(true);
            }}
            isSoundOn={isSoundOn}
            onToggleSound={onToggleSound}
            onPlayClick={onPlayClick}
          />
          {errorToast && (
            <div className="absolute bottom-24 left-3 right-3 bg-rose-600 text-white px-3 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce z-40 text-xs font-semibold md:left-4 md:right-auto md:max-w-md">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorToast}</span>
            </div>
          )}

        </div>
      </main>

      <ResultModal
        isOpen={showResult}
        score={score}
        feedback={feedback}
        distance={currentMetrics.distance}
        optimalDistance={optimal.distance}
        onClose={() => setShowResult(false)}
        onRetry={() => { setShowResult(false); handleReset(); }}
        onNextLevel={() => { setShowResult(false); handleNextLevel(); }}
        hasNextLevel={selectedLevelId < levels.length}
      />

      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} onPlayClick={onPlayClick} />
    </div>
  );
}
