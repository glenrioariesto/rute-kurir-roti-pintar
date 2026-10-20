import React, { useEffect, useRef, useState } from 'react';
import { PackageCheck, Sparkles, ArrowRight } from 'lucide-react';

export interface DeliveryInfo {
  houseId: string;
  houseName: string;
  stepNumber: number;
  videoUrl?: string;
}

interface DeliveryModalProps {
  delivery: DeliveryInfo | null;
  onComplete: () => void;
  speed?: number;
}

const BASE = import.meta.env.BASE_URL;

// Available delivery videos for random selection
const CANDIDATE_VIDEOS = [
  `${BASE}delivery-1.mp4`,
  `${BASE}delivery-2.mp4`,
];

export const DeliveryModal: React.FC<DeliveryModalProps> = ({
  delivery,
  onComplete,
  speed = 1,
}) => {
  const [videoSrc, setVideoSrc] = useState<string>(`${BASE}delivery-1.mp4`);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [progress, setProgress] = useState(100);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Default duration in milliseconds for the delivery delay (scaled by delivery speed)
  const durationMs = Math.max(1200, Math.round(2600 / speed));

  // Reset state and pick random video when a new delivery arrives
  useEffect(() => {
    if (delivery) {
      setHasVideoError(false);
      setProgress(100);

      if (delivery.videoUrl) {
        setVideoSrc(delivery.videoUrl);
      } else {
        // Randomly pick one of the delivery videos (delivery-1.mp4 or delivery-2.mp4)
        const randomIndex = Math.floor(Math.random() * CANDIDATE_VIDEOS.length);
        setVideoSrc(CANDIDATE_VIDEOS[randomIndex]);
      }
    }
  }, [delivery]);

  // Handle fallback timer if video is not available or has error
  useEffect(() => {
    if (!delivery) return;

    let startTime = Date.now();
    let animFrame: number;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / durationMs) * 100);
      setProgress(remainingPct);

      if (elapsed >= durationMs) {
        onComplete();
      } else {
        animFrame = requestAnimationFrame(tick);
      }
    };

    if (hasVideoError) {
      animFrame = requestAnimationFrame(tick);
    } else {
      // Safety timeout in case video stalls or fails to trigger onEnded
      const timeout = setTimeout(() => {
        onComplete();
      }, durationMs + 2500);
      return () => clearTimeout(timeout);
    }

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [delivery, hasVideoError, durationMs, onComplete]);

  // Update progress bar based on actual video playback
  const handleTimeUpdate = () => {
    const el = videoRef.current;
    if (el && el.duration > 0) {
      const remainingPct = Math.max(0, 100 - (el.currentTime / el.duration) * 100);
      setProgress(remainingPct);
    }
  };

  const handleVideoError = () => {
    // If the chosen video (e.g. delivery-2.mp4) isn't uploaded yet, fallback to delivery-1.mp4
    if (videoSrc !== `${BASE}delivery-1.mp4` && videoSrc !== `${BASE}delivery-animation.mp4`) {
      setVideoSrc(`${BASE}delivery-1.mp4`);
    } else {
      // If even delivery-1.mp4 fails, fallback to built-in SVG animation
      setHasVideoError(true);
    }
  };

  if (!delivery) return null;

  return (
    <div
      id="arena-delivery-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-fade-in"
      onClick={onComplete}
    >
      <div
        id="arena-delivery-modal-card"
        className="relative w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-amber-200/90 shadow-2xl p-4 sm:p-5 flex flex-col gap-3.5 transform transition-all animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Badge */}
        <div className="flex items-center justify-between gap-2 border-b border-amber-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-amber-100/90 text-amber-800 flex items-center justify-center text-base shadow-xs shrink-0">
              🥖
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600 font-display">
                  Paket Roti Terkirim!
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-800 font-display">
                {delivery.houseName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 text-white font-mono text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
            <span>Step</span>
            <span className="text-amber-400">#{delivery.stepNumber}</span>
          </div>
        </div>

        {/* Video / Animation Presentation Container */}
        <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center border border-amber-200/60 shadow-inner bg-amber-50">
          {!hasVideoError ? (
            <video
              key={`${delivery.houseId}-${delivery.stepNumber}-${videoSrc}`}
              ref={videoRef}
              src={videoSrc}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
              onEnded={onComplete}
              onTimeUpdate={handleTimeUpdate}
              onError={handleVideoError}
            />
          ) : (
            // Built-in Delightful Fallback Delivery Animation
            <div className="w-full h-full bg-gradient-to-br from-amber-500/15 via-orange-400/10 to-emerald-500/15 flex flex-col items-center justify-center p-4 text-center select-none relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-amber-300/20 blur-xl animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-orange-400/20 blur-xl animate-pulse" style={{ animationDelay: '1s' }} />

              <div className="relative flex items-center justify-center mb-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-md flex items-center justify-center border border-amber-200 relative animate-bounce" style={{ animationDuration: '1.2s' }}>
                  <span className="text-3xl sm:text-4xl filter drop-shadow-sm">🥖</span>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-xs">
                    <PackageCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-black text-slate-800 font-display">
                Kurir sedang menyerahkan pesanan
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium max-w-xs mt-0.5">
                Roti hangat sukses diterima warga di {delivery.houseName}! ✨
              </p>
            </div>
          )}
        </div>

        {/* Progress & Quick Skip Actions */}
        <div className="flex flex-col gap-2 pt-0.5">
          {/* Delay Countdown Progress Bar */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-[#FC8C00] transition-all duration-75 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10.5px] sm:text-xs text-slate-500">
            <span className="font-semibold flex items-center gap-1 text-slate-400">
              <span>Melanjutkan perjalanan...</span>
            </span>

            <button
              id="arena-delivery-skip-btn"
              type="button"
              onClick={onComplete}
              className="font-display font-black text-[#0083C1] hover:text-[#006ca0] flex items-center gap-1 active:scale-95 transition cursor-pointer px-2 py-1 rounded-lg hover:bg-sky-50"
            >
              <span>Lanjut</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
