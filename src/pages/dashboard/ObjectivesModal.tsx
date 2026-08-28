import { useState } from 'react';
import { Target, CheckCircle2, ListOrdered, Route, Scale, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ObjectivesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  onPlayClick?: () => void;
}

const ACCENT = '#0090D4';
const ACCENT_DARK = '#074C83';

interface Slide {
  icon: typeof Target;
  title: string;
  subtitle?: string;
  items: { title: string; text: string }[];
}

const slides: Slide[] = [
  {
    icon: Target,
    title: 'Tujuan Pembelajaran',
    items: [
      {
        title: 'Berpikir Komputasional',
        text: 'Belajar menemukan rute terpendek pengantaran roti dari Toko Roti ke semua rumah warga.',
      },
    ],
  },
  {
    icon: ListOrdered,
    title: 'Setelah Misi Ini, Kamu Mampu',
    items: [
      {
        title: 'Dekomposisi',
        text: 'Mengurai rute menjadi bagian-bagian kecil.',
      },
      {
        title: 'Pengenalan Pola',
        text: 'Mengenali pola rute yang efisien.',
      },
    ],
  },
  {
    icon: Scale,
    title: 'Setelah Misi Ini, Kamu Mampu',
    items: [
      {
        title: 'Abstraksi',
        text: 'Menyederhanakan peta menjadi grafik jalur.',
      },
      {
        title: 'Algoritma',
        text: 'Menyusun langkah rute terpendek.',
      },
    ],
  },
];

const ACCENTS: Record<number, string> = {
  0: 'text-[#0090D4] border-[#0090D4]/20 bg-[#0090D4]/5',
  1: 'text-emerald-700 border-emerald-200 bg-emerald-50',
  2: 'text-amber-700 border-amber-200 bg-amber-50',
};

export function ObjectivesModal({ isOpen, onClose, onStart, onPlayClick }: ObjectivesModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slide = slides[currentSlide];
  const total = slides.length;
  const isFirst = currentSlide === 0;
  const isLast = currentSlide === total - 1;
  const accentClass = ACCENTS[currentSlide];

  const goNext = () => {
    onPlayClick?.();
    if (isLast) {
      onStart();
    } else {
      setCurrentSlide(p => p + 1);
    }
  };

  const goPrev = () => {
    onPlayClick?.();
    if (!isFirst) setCurrentSlide(p => p - 1);
  };

  const goToSlide = (index: number) => {
    onPlayClick?.();
    setCurrentSlide(index);
  };

  const close = () => {
    onPlayClick?.();
    onClose();
  };

  return (
    <div
      id="objectives-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in"
      onClick={close}
    >
      {/* Backdrop - blur seperti dashboard-card */}
      <div id="objectives-modal-overlay" className="absolute inset-0 bg-white/70 backdrop-blur-lg" />

      {/* Modal Container */}
      <div
        id="objectives-modal-card"
        className={`relative z-10 w-full max-w-[300px] sm:max-w-md md:max-w-lg max-h-[82vh] sm:max-h-[85vh] bg-white border-[3px] sm:border-[5px] border-[#0090D4] rounded-[16px] sm:rounded-[24px] md:rounded-[28px] shadow-2xl flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div id="objectives-modal-header" className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 px-2.5 sm:px-4 md:px-5 pt-2 sm:pt-4 md:pt-5 pb-1.5 sm:pb-3 md:pb-4 border-b border-slate-100 shrink-0 bg-[#0090D4]">
          <div className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-white/20 rounded-md sm:rounded-lg md:rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
            <slide.icon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
          </div>
          <h2 id="objectives-modal-title" className="text-[8px] sm:text-sm md:text-base lg:text-lg font-black font-display tracking-wide text-white flex-1 leading-none">
            {slide.title}
          </h2>
          <span id="objectives-modal-counter" className="text-[7px] sm:text-[10px] md:text-xs lg:text-sm font-black bg-white/20 text-white tracking-wider font-display shrink-0 px-1.5 sm:px-2.5 md:px-3 py-0.5 md:py-1 rounded-full">
            {currentSlide + 1}/{total}
          </span>
          <button
            id="objectives-modal-close-btn"
            onClick={close}
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors shrink-0 ml-0.5 cursor-pointer"
          >
            <X className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
          </button>
        </div>

        {/* Body */}
        <div id="objectives-modal-body" className="p-2.5 sm:p-4 md:p-5 flex flex-col gap-1.5 sm:gap-2.5 bg-white flex-1 min-h-0 overflow-y-auto scrollbar-none">
          {slide.items.map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-1.5 sm:gap-2.5 border rounded-lg sm:rounded-xl md:rounded-2xl p-1.5 sm:p-3 md:p-4 ${accentClass}`}
            >
              <CheckCircle2 className="w-3 h-3 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 shrink-0 mt-0.5" />
              <span className="text-slate-700 text-[7.5px] sm:text-[11.5px] md:text-sm lg:text-[15px] font-medium leading-snug sm:leading-relaxed font-sans">
                <strong className="font-extrabold text-slate-800">{item.title}:</strong>{' '}
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div id="objectives-modal-footer" className="px-2.5 sm:px-4 md:px-5 pt-2 sm:pt-3 pb-2.5 sm:pb-4 border-t border-slate-100 shrink-0 flex flex-col gap-1.5 sm:gap-2.5">
          {/* Dot Indicators */}
          <div id="objectives-modal-dots" className="flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentSlide
                    ? 'w-3.5 sm:w-4 md:w-5 h-1 sm:h-1.5 md:h-2 bg-[#0090D4]'
                    : 'w-1 sm:w-1.5 md:w-2 h-1 sm:h-1.5 md:h-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div id="objectives-modal-nav" className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
            {!isFirst && (
              <button
                id="objectives-modal-prev-btn"
                onClick={goPrev}
                className="flex-1 py-1 sm:py-2 md:py-2.5 lg:py-3 px-2.5 sm:px-4 md:px-5 rounded-lg sm:rounded-xl md:rounded-2xl text-slate-700 font-bold text-[8px] sm:text-[11px] md:text-sm lg:text-base flex items-center justify-center gap-0.5 sm:gap-1 bg-slate-100 hover:bg-slate-200 border-b-2 sm:border-b-4 border-slate-300 active:border-b-0 active:translate-y-[2px] sm:active:translate-y-[4px] transition-all font-display tracking-wider cursor-pointer"
              >
                <ChevronLeft className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                Kembali
              </button>
            )}
            <button
              id="objectives-modal-next-btn"
              onClick={goNext}
              className="flex-1 py-1 sm:py-2 md:py-2.5 lg:py-3 px-2.5 sm:px-4 md:px-5 rounded-lg sm:rounded-xl md:rounded-2xl text-white font-bold text-[8px] sm:text-[11px] md:text-sm lg:text-base flex items-center justify-center gap-0.5 sm:gap-1 bg-[#0090D4] hover:bg-[#074C83] border-b-2 sm:border-b-4 border-[#074C83] active:border-b-0 active:translate-y-[2px] sm:active:translate-y-[4px] transition-all font-display tracking-wider cursor-pointer shadow-md"
            >
              {isLast ? 'Mulai Bermain' : 'Lanjut'}
              {!isLast && <ChevronRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
