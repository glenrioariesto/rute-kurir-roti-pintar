import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MousePointerClick, Route, Truck, RotateCcw, ZoomIn } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayClick?: () => void;
  levelId?: number;
}

interface Slide {
  icon: React.ReactNode;
  title: string;
  tips: React.ReactNode[];
}

const getModalTheme = (levelId: number = 1) => {
  if (levelId === 1) {
    return {
      border: 'border-[#0f5a31]',
      borderDark: 'border-[#073019]',
      bg: 'bg-[#0f5a31]',
      bgHover: 'hover:bg-[#0b4826]',
      text: 'text-[#0f5a31]',
      counterBg: 'bg-[#0f5a31]/10 text-[#0f5a31]',
    };
  }
  if (levelId === 2) {
    return {
      border: 'border-[#b45309]',
      borderDark: 'border-[#7c2d12]',
      bg: 'bg-[#b45309]',
      bgHover: 'hover:bg-[#9a3412]',
      text: 'text-[#b45309]',
      counterBg: 'bg-[#b45309]/10 text-[#b45309]',
    };
  }
  return {
    border: 'border-[#be123c]',
    borderDark: 'border-[#881337]',
    bg: 'bg-[#be123c]',
    bgHover: 'hover:bg-[#9f1239]',
    text: 'text-[#be123c]',
    counterBg: 'bg-[#be123c]/10 text-[#be123c]',
  };
};

const getSlides = (accentText: string): Slide[] => [
  {
    icon: <Route className="w-4 h-4" />,
    title: 'TUJUAN PERMAINAN :',
    tips: [
      <>Temukan <strong className={`${accentText} font-extrabold`}>rute terpendek / paling efisien</strong> untuk mengunjungi semua rumah warga.</>,
      <>Perjalanan dimulai dari <strong className={`${accentText} font-extrabold`}>Toko Roti</strong>, mengunjungi semua rumah, lalu <strong className={`${accentText} font-extrabold`}>kembali ke Toko Roti</strong>. Semakin pendek rute, semakin <strong className={`${accentText} font-extrabold`}>tinggi skor</strong> kamu!</>,
    ],
  },
  {
    icon: <MousePointerClick className="w-4 h-4" />,
    title: 'MENYUSUN RUTE :',
    tips: [
      <>Ketuk <strong className={`${accentText} font-extrabold`}>Toko Roti</strong> sebagai titik awal, lalu ketuk <strong className={`${accentText} font-extrabold`}>rumah-rumah (A, B, C, ...)</strong> secara berurutan.</>,
      <>Gunakan <strong className={`${accentText} font-extrabold`}>titik persimpangan jalan</strong> untuk menghubungkan jalur antar rumah.</>,
    ],
  },
  {
    icon: <ZoomIn className="w-4 h-4" />,
    title: 'NAVIGASI PETA :',
    tips: [
      <><strong className={`${accentText} font-extrabold`}>Geser peta</strong> dengan menyeret layar. <strong className={`${accentText} font-extrabold`}>Cubit layar</strong> atau <strong className={`${accentText} font-extrabold`}>gulir roda tetikus</strong> untuk perbesar/perkecil.</>,
      <>Tekan tombol <strong className={`${accentText} font-extrabold`}>⟳ Tampilan Awal</strong> untuk mengatur ulang kamera peta.</>,
    ],
  },
  {
    icon: <RotateCcw className="w-4 h-4" />,
    title: 'KONTROL RUTE :',
    tips: [
      <>Tombol <strong className={`${accentText} font-extrabold`}>Hapus Terakhir</strong> membatalkan titik sebelumnya. Tombol <strong className={`${accentText} font-extrabold`}>Ulangi</strong> menghapus seluruh rute dari awal.</>,
      <>Atur kecepatan jalan kurir dengan tombol kecepatan (<strong className={`${accentText} font-extrabold`}>1×, 2×, 3×</strong>).</>,
    ],
  },
  {
    icon: <Truck className="w-4 h-4" />,
    title: 'KIRIM KURIR :',
    tips: [
      <><strong className={`${accentText} font-extrabold`}>Kurir roti</strong> akan otomatis berjalan melintasi rute yang kamu susun dan sistem akan menghitung <strong className={`${accentText} font-extrabold`}>jarak total</strong> perjalananmu.</>,
      <>Cobalah <strong className={`${accentText} font-extrabold`}>berbagai kombinasi rute</strong> untuk mencari jalur yang paling efisien!</>,
    ],
  },
];

export function TutorialModal({ isOpen, onClose, onPlayClick, levelId = 1 }: TutorialModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const theme = getModalTheme(levelId);
  const slides = getSlides(theme.text);
  const slide = slides[currentSlide];
  const isFirst = currentSlide === 0;
  const isLast = currentSlide === slides.length - 1;

  const goNext = () => {
    onPlayClick?.();
    if (isLast) {
      onClose();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const goPrev = () => {
    onPlayClick?.();
    if (!isFirst) setCurrentSlide(prev => prev - 1);
  };

  const goToSlide = (index: number) => {
    onPlayClick?.();
    setCurrentSlide(index);
  };

  return (
    <div id="tutorial-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in" onClick={onClose}>
      {/* Backdrop */}
      <div id="tutorial-modal-overlay" className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Container — Worksheet card matching level card color border */}
      <div
        id="tutorial-modal-card"
        className={`relative z-10 w-full max-w-[300px] sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[82vh] sm:max-h-[85vh] bg-white border-[3px] sm:border-[5px] md:border-[6px] ${theme.border} rounded-[16px] sm:rounded-[24px] md:rounded-[28px] shadow-2xl flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — Icon + Title + Counter + Close */}
        <div id="tutorial-modal-header" className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 px-2.5 sm:px-4 md:px-5 lg:px-6 pt-2 sm:pt-4 md:pt-5 pb-1.5 sm:pb-3 md:pb-4 border-b border-slate-100 shrink-0">
          <div className={`w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 ${theme.bg} rounded-md sm:rounded-lg md:rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm`}>
            {slide.icon}
          </div>
          <h2 id="tutorial-modal-title" className="text-[7.5px] sm:text-sm md:text-base lg:text-lg font-black font-display tracking-wide text-slate-800 flex-1 leading-none">
            {slide.title}
          </h2>
          <span id="tutorial-modal-counter" className={`text-[7px] sm:text-[10px] md:text-xs lg:text-sm font-black ${theme.counterBg} tracking-wider font-display shrink-0 px-1.5 sm:px-2.5 md:px-3 py-0.5 md:py-1 rounded-full`}>
            {currentSlide + 1}/{slides.length}
          </span>
          <button
            id="tutorial-modal-close-btn"
            onClick={() => {
              onPlayClick?.();
              onClose();
            }}
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors shrink-0 ml-0.5 cursor-pointer"
          >
            <X className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-slate-500" />
          </button>
        </div>

        {/* Content Body — scrollable */}
        <div id="tutorial-modal-body" className="p-2.5 sm:p-4 md:p-5 lg:p-6 flex flex-col gap-2 sm:gap-3.5 md:gap-4 bg-white flex-1 min-h-0 overflow-y-auto scrollbar-none">
          {/* Tips List */}
          <div id="tutorial-modal-tips-list" className="flex flex-col gap-1 sm:gap-2.5 md:gap-3">
            {slide.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-1.5 sm:gap-2.5 md:gap-3 bg-slate-50/50 border border-slate-100 rounded-lg sm:rounded-xl md:rounded-2xl p-1.5 sm:p-3 md:p-4 shadow-sm hover:shadow transition-shadow">
                <span className={`w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full ${theme.bg} text-white text-[7px] sm:text-[9px] md:text-[10px] lg:text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow-sm`}>
                  {i + 1}
                </span>
                <span className="text-slate-700 text-[7.5px] sm:text-[11.5px] md:text-sm lg:text-base font-medium leading-snug sm:leading-relaxed font-sans">
                  {tip}
                </span>
              </div>
            ))}
          </div>

          {/* Dot Indicators */}
          <div id="tutorial-modal-dots" className="flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 py-0 sm:py-1 md:py-2 shrink-0">
            {slides.map((_, i) => (
              <button
                key={i}
                id={`tutorial-modal-dot-${i + 1}`}
                onClick={() => goToSlide(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentSlide
                    ? `w-3.5 sm:w-4 md:w-5 h-1 sm:h-1.5 md:h-2 ${theme.bg}`
                    : 'w-1 sm:w-1.5 md:w-2 h-1 sm:h-1.5 md:h-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div id="tutorial-modal-nav" className="flex items-center gap-1.5 sm:gap-3 md:gap-4 shrink-0">
            {!isFirst && (
              <button
                id="tutorial-modal-prev-btn"
                onClick={goPrev}
                className="flex-1 py-1 sm:py-2 md:py-2.5 lg:py-3 px-2.5 sm:px-4 md:px-5 rounded-lg sm:rounded-xl md:rounded-2xl text-slate-700 font-bold text-[8px] sm:text-[11px] md:text-sm lg:text-base flex items-center justify-center gap-0.5 sm:gap-1 bg-slate-100 hover:bg-slate-200 border-b-2 sm:border-b-4 border-slate-300 active:border-b-0 active:translate-y-[2px] sm:active:translate-y-[4px] transition-all font-display tracking-wider cursor-pointer"
              >
                <ChevronLeft className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                Kembali
              </button>
            )}
            <button
              id="tutorial-modal-next-btn"
              onClick={goNext}
              className={`flex-1 py-1 sm:py-2 md:py-2.5 lg:py-3 px-2.5 sm:px-4 md:px-5 rounded-lg sm:rounded-xl md:rounded-2xl text-white font-bold text-[8px] sm:text-[11px] md:text-sm lg:text-base flex items-center justify-center gap-0.5 sm:gap-1 ${theme.bg} ${theme.bgHover} border-b-2 sm:border-b-4 ${theme.borderDark} active:border-b-0 active:translate-y-[2px] sm:active:translate-y-[4px] transition-all font-display tracking-wider cursor-pointer shadow-md`}
            >
              {isLast ? 'Mulai Bermain!' : 'Lanjut'}
              {!isLast && <ChevronRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

