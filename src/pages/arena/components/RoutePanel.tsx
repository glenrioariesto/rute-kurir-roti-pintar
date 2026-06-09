import React from 'react';
import { LevelConfig } from '@/types';
import {
  RotateCcw, SkipBack, Truck, Fuel, Clock, ArrowRight, Sparkles, AlertTriangle,
} from 'lucide-react';

interface RoutePanelProps {
  level: LevelConfig;
  selectedRoute: string[];
  currentMetrics: { distance: number; time: number; fuel: number; isValid: boolean };
  isDelivering: boolean;
  onUndo: () => void;
  onReset: () => void;
  onDeliver: () => void;
}

export const RoutePanel: React.FC<RoutePanelProps> = ({
  level,
  selectedRoute,
  currentMetrics,
  isDelivering,
  onUndo,
  onReset,
  onDeliver,
}) => {
  const gasPercentage = level.maxFuel
    ? Math.max(0, 100 - (currentMetrics.distance / level.maxFuel) * 100)
    : 100;

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* 1. MANIFEST ROUTE TIMELINE */}
      <div className="bg-white rounded-2xl p-4 border border-slate-150 flex-1 flex flex-col min-h-[140px] shadow-sm">
        <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Alur Perjalanan Saat Ini</span>
        </h4>

        {selectedRoute.length <= 1 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <p className="text-xs text-slate-400 max-w-[200px]">
              Silakan klik rumah-rumah di peta sebelah kiri untuk mulai mengantar.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-3 py-2">
              {selectedRoute.map((node, index) => {
                const isToko = node === 'Toko';
                const isLast = index === selectedRoute.length - 1;
                return (
                  <React.Fragment key={index}>
                    <div
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs border flex items-center gap-1 transition-all ${
                        isToko
                          ? 'bg-amber-100 text-amber-900 border-amber-200'
                          : 'bg-indigo-50 text-indigo-900 border-indigo-150'
                      }`}
                    >
                      <span className="text-[11px] opacity-70">#{index + 1}</span>
                      <span>{isToko ? '🥖 Toko Roti' : `Rumah ${node}`}</span>
                    </div>

                    {!isLast && (
                      <ArrowRight className="w-3 h-3 text-slate-400 stroke-[3px] shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Short metrics feedback inside route timeline block */}
        {selectedRoute.length > 1 && (
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 bg-slate-50/50 p-2.5 rounded-xl">
            {/* Live Distance count */}
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase leading-none">Jarak Tempuh</p>
                <p className="text-sm font-extrabold text-slate-700 font-mono mt-0.5">
                  {currentMetrics.distance} km
                </p>
              </div>
            </div>

            {/* Live Time count */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase leading-none">Waktu Tempuh</p>
                <p className="text-sm font-extrabold text-slate-700 font-mono mt-0.5">
                  {currentMetrics.time} Menit
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. COURIER STATS GAUGES (FOR CONSTRAINTS) */}
      {(level.maxFuel || level.timeLimitMinutes) && (
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 border border-slate-805 flex flex-col gap-3 shadow-md">
          <h4 className="text-xs font-bold text-amber-400 tracking-wider uppercase">
            Indikator Batasan (Constraints)
          </h4>

          {/* Fuel restriction level */}
          {level.maxFuel && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Fuel className="w-3.5 h-3.5 text-amber-500" /> Bensin Motor
                </span>
                <span className="font-mono text-slate-200">
                  <strong className="font-bold text-white">{currentMetrics.distance}</strong> / {level.maxFuel} km
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    gasPercentage > 40
                      ? 'bg-amber-400'
                      : gasPercentage > 15
                      ? 'bg-orange-500 animate-pulse'
                      : 'bg-rose-500 animate-pulse'
                  }`}
                  style={{ width: `${gasPercentage}%` }}
                />
              </div>
              {currentMetrics.distance > level.maxFuel && (
                <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1 font-semibold">
                  <AlertTriangle className="w-3 h-3 shrink-0" /> Bensin melebihi batas! Kurir akan mogok di jalan.
                </p>
              )}
            </div>
          )}

          {/* Time restriction level */}
          {level.timeLimitMinutes && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> Batas Waktu (Sebelum 08:00)
                </span>
                <span className="font-mono text-slate-200">
                  <strong className="font-bold text-white">{currentMetrics.time}</strong> / {level.timeLimitMinutes} m
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    currentMetrics.time <= level.timeLimitMinutes
                      ? 'bg-emerald-400'
                      : 'bg-rose-500 animate-pulse'
                  }`}
                  style={{ width: `${Math.min(100, (currentMetrics.time / level.timeLimitMinutes) * 100)}%` }}
                />
              </div>
              {currentMetrics.time > level.timeLimitMinutes && (
                <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1 font-semibold">
                  <AlertTriangle className="w-3 h-3 shrink-0" /> Terlambat! Roti akan sampai di atas pukul 08:00 pagi.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. BUTTONS BOX */}
      <div className="grid grid-cols-2 gap-2 mt-auto">
        <button
          onClick={onUndo}
          disabled={selectedRoute.length <= 1 || isDelivering}
          className="py-3 px-4 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition flex items-center justify-center gap-2"
        >
          <SkipBack className="w-4 h-4 text-slate-600" />
          Hapus Terakhir
        </button>

        <button
          onClick={onReset}
          disabled={selectedRoute.length <= 1 || isDelivering}
          className="py-3 px-4 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4 text-slate-600" />
          Mulai Ulang (Reset)
        </button>

        <button
          onClick={onDeliver}
          disabled={selectedRoute.length <= 1 || isDelivering}
          className="col-span-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-amber-600 hover:bg-amber-700 active:scale-95 transition flex items-center justify-center gap-2 shadow-md shadow-amber-650/20 disabled:opacity-50 disabled:pointer-events-none"
        >
          <Truck className="w-4 h-4 text-white hover:animate-bounce" />
          Kirim Kurir Roti 🚚
        </button>
      </div>
    </div>
  );
};
