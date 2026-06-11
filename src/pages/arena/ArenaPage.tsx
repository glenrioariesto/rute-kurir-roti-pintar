import { useState } from 'react';
import { levels } from '@/levels';
import { useRouteGame } from '@hooks/useRouteGame';
import { MapCanvas } from '@pages/arena/components/MapCanvas';
import { RoutePanel } from '@pages/arena/components/RoutePanel';
import { ResultModal } from '@pages/arena/components/ResultModal';
import { AlertCircle, ChevronUp, X } from 'lucide-react';

interface ArenaPageProps {
  initialLevelId: number;
  onBack: () => void;
}

export function ArenaPage({ initialLevelId, onBack }: ArenaPageProps) {
  const [selectedLevelId, setSelectedLevelId] = useState(initialLevelId);
  const [showPanel, setShowPanel] = useState(false);

  const currentLevel = levels.find((l) => l.id === selectedLevelId) || levels[0];

  const {
    selectedRoute, segmentLengths, isDelivering, showResult, setShowResult,
    score, feedback, errorToast, optimal, currentMetrics,
    handleHouseClick, handleUndo, handleReset, handleDeliver,
    getCourierPosition, attempts, animationStep, deliverySpeed, setDeliverySpeed,
  } = useRouteGame(currentLevel);

  const handleNextLevel = () => {
    if (selectedLevelId < levels.length) setSelectedLevelId(selectedLevelId + 1);
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      <main className="flex-1 overflow-hidden flex flex-col lg:flex-row">

        {/* MAP */}
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
          />
          {errorToast && (
            <div className="absolute bottom-16 left-3 right-3 lg:bottom-3 bg-rose-600 text-white px-3 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce z-40 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorToast}</span>
            </div>
          )}

          {/* Floating button — mobile only */}
          <button
            onClick={() => setShowPanel(true)}
            className="lg:hidden absolute bottom-4 right-4 z-30 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-sm font-bold active:scale-95 transition"
          >
            <ChevronUp className="w-4 h-4" />
            Alur Perjalanan
          </button>
        </div>

        {/* ROUTE PANEL — desktop: side panel, mobile: bottom sheet */}
        {/* Desktop */}
        <div className="hidden lg:block bg-white p-4 border-l border-slate-200 shadow-sm overflow-y-auto lg:w-80">
          <RoutePanel
            level={currentLevel}
            selectedRoute={selectedRoute}
            currentMetrics={currentMetrics}
            isDelivering={isDelivering}
            onUndo={handleUndo}
            onReset={handleReset}
            onDeliver={handleDeliver}
            deliverySpeed={deliverySpeed}
            onChangeSpeed={setDeliverySpeed}
          />
        </div>

        {/* Mobile bottom sheet */}
        {showPanel && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowPanel(false)} />
            {/* Sheet */}
            <div className="relative bg-white rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-700">Alur Perjalanan</span>
                <button onClick={() => setShowPanel(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <RoutePanel
                level={currentLevel}
                selectedRoute={selectedRoute}
                currentMetrics={currentMetrics}
                isDelivering={isDelivering}
                onUndo={handleUndo}
                onReset={handleReset}
                onDeliver={handleDeliver}
                deliverySpeed={deliverySpeed}
                onChangeSpeed={setDeliverySpeed}
              />
            </div>
          </div>
        )}

      </main>

      <ResultModal
        isOpen={showResult}
        score={score}
        feedback={feedback}
        distance={currentMetrics.distance}
        time={currentMetrics.time}
        optimalDistance={optimal.distance}
        onClose={() => setShowResult(false)}
        onRetry={() => { setShowResult(false); handleReset(); }}
        onNextLevel={() => { setShowResult(false); handleNextLevel(); }}
        hasNextLevel={selectedLevelId < levels.length}
      />


    </div>
  );
}
