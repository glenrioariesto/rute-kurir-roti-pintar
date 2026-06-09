import { Truck, Award, ChevronRight, Sparkles, Clock, Fuel } from 'lucide-react';
import { levels } from '@/levels';

interface DashboardPageProps {
  onSelectLevel: (id: number) => void;
}

const difficultyLabel = (id: number) => {
  if (id <= 2) return { label: 'Mudah', color: 'bg-emerald-100 text-emerald-700' };
  if (id === 3) return { label: 'Sedang', color: 'bg-amber-100 text-amber-700' };
  return { label: 'Sulit', color: 'bg-rose-100 text-rose-700' };
};

export function DashboardPage({ onSelectLevel }: DashboardPageProps) {
  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex flex-col">

      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-4 py-2.5 shrink-0 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-500 rounded-lg text-white shadow-sm">
            <Truck className="w-3.5 h-3.5" />
          </div>
          <div>
            <h1 className="text-xs font-black text-slate-800 tracking-tight">Roti Pintar</h1>
            <p className="text-[10px] text-slate-400 font-medium">Pilih level tantanganmu</p>
          </div>
        </div>
      </header>

      {/* Konten */}
      <main className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-3 py-3 flex flex-col gap-3">

        {/* Hero */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-3 text-white flex items-center gap-3 shadow-md shadow-amber-500/20">
          <span className="text-3xl">🍞</span>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Sparkles className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Misi Kurir</span>
            </div>
            <h2 className="text-sm font-black leading-tight">Temukan Rute Terpendek!</h2>
            <p className="text-[10px] opacity-80 mt-0.5">Antarkan roti ke semua rumah dan kembali ke toko.</p>
          </div>
        </div>

        {/* Grid Level */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Pilih Level</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {levels.map((level) => {
              const diff = difficultyLabel(level.id);
              const houseCount = level.houses.filter(h => h.id !== 'Toko').length;
              return (
                <button
                  key={level.id}
                  onClick={() => onSelectLevel(level.id)}
                  className="bg-white border border-slate-100 rounded-xl p-3 text-left hover:border-amber-300 hover:shadow-md hover:shadow-amber-500/10 transition-all active:scale-95 group flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between">
                    <span className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-sm font-black text-amber-600 group-hover:bg-amber-100 transition-colors">
                      {level.id}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${diff.color}`}>
                      {diff.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 text-[11px] leading-tight">
                      {level.title.replace(/Level \d+: /, '')}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{level.description}</p>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium mt-auto">
                    <span className="flex items-center gap-0.5">🏠 {houseCount} rumah</span>
                    {level.maxFuel && (
                      <span className="flex items-center gap-0.5">
                        <Fuel className="w-2.5 h-2.5" /> {level.maxFuel}km
                      </span>
                    )}
                    {level.timeLimitMinutes && (
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" /> {level.timeLimitMinutes}m
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-amber-600 text-[10px] font-bold group-hover:gap-1.5 transition-all">
                    Mulai Level <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
