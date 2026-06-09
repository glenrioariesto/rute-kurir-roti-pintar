import React from 'react';
import { Route, Zap, HelpCircle, Flame, Target } from 'lucide-react';

interface DistanceCalculatorProps {
  currentDistance: number;
  optimalDistance: number;
  currentRoute: string[];
  isCompletedRoute: boolean; // whether they returned to Toko and visited everything
}

export const DistanceCalculator: React.FC<DistanceCalculatorProps> = ({
  currentDistance,
  optimalDistance,
  currentRoute,
  isCompletedRoute,
}) => {
  const diff = Math.round((currentDistance - optimalDistance) * 10) / 10;
  const isOptimal = diff <= 0.05;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-150 shadow-sm">
      <h4 className="text-sm font-bold text-slate-800 mb-3.5 flex items-center gap-1.5">
        <Target className="w-4.5 h-4.5 text-amber-500" />
        <span>Uji Efisiensi Rute (Perbandingannya)</span>
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Your Route kilometer card */}
        <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Rute Kamu</span>
            <p className="text-2xl font-extrabold text-slate-700 font-mono mt-1">
              {currentRoute.length > 1 ? `${currentDistance} km` : '--'}
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Jarak total yang ditempuh kurir melalui urutan usulanmu.
          </p>
        </div>

        {/* Optimal TSP route kilometer card */}
        <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-amber-500 font-semibold text-shadow-sm">Rute Terbaik</span>
            <p className="text-2xl font-extrabold text-amber-700 font-mono mt-1">
              {optimalDistance} km
            </p>
          </div>
          <p className="text-xs text-amber-600 mt-2">
            Rute komputasi paling efisien untuk melayani seluruh warga!
          </p>
        </div>

        {/* Diff metrics calculated */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-amber-600 font-semibold">Selisih Jarak</span>
            <p
              className={`text-2xl font-extrabold font-mono mt-1 ${
                !isCompletedRoute
                  ? 'text-slate-400'
                  : isOptimal
                  ? 'text-emerald-600 animate-pulse'
                  : diff <= 2
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {!isCompletedRoute ? '--' : isOptimal ? '0 km (Optimal!)' : `+${diff} km`}
            </p>
          </div>
          <div className="mt-2 text-xs">
            {!isCompletedRoute ? (
              <span className="text-slate-400">Hubungkan semua rumah untuk mengukur selisih.</span>
            ) : isOptimal ? (
              <span className="text-emerald-700 font-semibold">Selamat! Anda menghemat bensin maksimal! 🌟</span>
            ) : (
              <span className="text-slate-600 font-medium">Bisa dihemat {diff} km lagi. Coba atur urutan rutenya!</span>
            )}
          </div>
        </div>
      </div>

      {/* Visual meter bar comparing efficiency */}
      {isCompletedRoute && (
        <div className="mt-5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
            <span>Efisiensi Rute</span>
            <span>{isOptimal ? '100% Sempurna⭐' : diff <= 2 ? '85% Sangat Baik' : '60% Perlu Perbaikan'}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isOptimal ? 'bg-emerald-500' : diff <= 2 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{
                width: `${Math.max(10, Math.min(100, (optimalDistance / currentDistance) * 100))}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
