import React, { useState } from 'react';
import { LevelConfig } from '@/types';
import { BookOpen, HelpCircle, ChevronDown, ChevronUp, Compass, Award } from 'lucide-react';

interface CtExplanationPanelProps {
  level: LevelConfig;
}

export const CtExplanationPanel: React.FC<CtExplanationPanelProps> = ({ level }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 leading-tight">
              Pojok Computational Thinking (CT)
            </h4>
            <p className="text-[11px] text-slate-400">
              Bagaimana cara berpikir komputer membantumu mengirim roti otomatis?
            </p>
          </div>
        </div>

        <button className="text-slate-400 hover:text-slate-600 transition">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-5 flex flex-col gap-5 animate-fade-in">
          
          {/* Level CT Principles Grid list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* DECOMPOSITION */}
            <div className="flex gap-3 bg-indigo-50/20 p-3.5 rounded-xl border border-indigo-100/30">
              <span className="text-xl shrink-0 select-none">🧩</span>
              <div>
                <h5 className="text-xs font-extrabold text-indigo-900 uppercase">
                  1. Decomposition (Dekomposisi)
                </h5>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {level.ctExplanation.decomposition}
                </p>
              </div>
            </div>

            {/* PATTERN RECOGNITION */}
            <div className="flex gap-3 bg-teal-50/20 p-3.5 rounded-xl border border-teal-100/30">
              <span className="text-xl shrink-0 select-none">👁️</span>
              <div>
                <h5 className="text-xs font-extrabold text-teal-900 uppercase">
                  2. Pattern Recognition (Pengenalan Pola)
                </h5>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {level.ctExplanation.patternRecognition}
                </p>
              </div>
            </div>

            {/* ABSTRACTION */}
            <div className="flex gap-3 bg-pink-50/20 p-3.5 rounded-xl border border-pink-100/30">
              <span className="text-xl shrink-0 select-none">📐</span>
              <div>
                <h5 className="text-xs font-extrabold text-pink-900 uppercase">
                  3. Abstraction (Abstraksi)
                </h5>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {level.ctExplanation.abstraction}
                </p>
              </div>
            </div>

            {/* ALGORITHM */}
            <div className="flex gap-3 bg-amber-50/20 p-3.5 rounded-xl border border-amber-100/30">
              <span className="text-xl shrink-0 select-none">⛓️</span>
              <div>
                <h5 className="text-xs font-extrabold text-amber-900 uppercase">
                  4. Algorithm (Algoritma)
                </h5>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {level.ctExplanation.algorithm}
                </p>
              </div>
            </div>

          </div>

          {/* Real World Application explanation */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex gap-3">
            <Compass className="w-5 h-5 text-slate-500 shrink-0 mt-0.5 animate-spin-slow" />
            <div>
              <h5 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                <span>Penerapan di Dunia Nyata 🌍</span>
                <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                  Logistics & TSP
                </span>
              </h5>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                Tantangan yang kamu mainkan di game ini adalah perwujudan dari <strong>Travelling Salesperson Problem (TSP)</strong>. Konsep ini dipakai setiap hari oleh sistem logistik raksasa seperti <strong>Google Maps GPS</strong>, kargo kurir paket pos, pengantar pizza keliling, rute ojek online, dan optimasi jalur sirkuit mikrochip robotik demi menghemat bensin, meminimalkan emisi CO2, dan memotong biaya operasional!
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
