import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft, SkipBack, RotateCcw, Truck, ChevronDown, ChevronUp, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { Connection, LevelConfig } from '@/types';
import { formatDistance } from '@utils/findOptimalRoute';

interface MapCanvasProps {
  level: LevelConfig;
  selectedRoute: string[];
  segmentLengths: number[];
  isDelivering: boolean;
  animationStep: number;
  courierPos: { x: number; y: number };
  onHouseClick: (id: string) => void;
  onBack: () => void;
  onUndo: () => void;
  onReset: () => void;
  onDeliver: () => void;
  onStopDeliver: () => void;
  deliverySpeed: number;
  onChangeSpeed: (speed: number) => void;
  currentMetrics: { distance: number; time: number; isValid: boolean };
  onHelpClick?: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
  onPlayClick?: () => void;
  playHouseClick: () => void;
  playWaypointClick: () => void;
  playDeliverSound: () => void;
  playResetSound: () => void;
  playUndoSound: () => void;
  playMotor: () => void;
  stopMotor: () => void;
}

const BASE = import.meta.env.BASE_URL;
const ASSETS = {
  canvasBg: `${BASE}Background.webp`,
  house:  `${BASE}house.png`,
  store:  `${BASE}store.png`,
  motorDiagKananAtas:  `${BASE}motor-kanan-atas.webp`,
  motorDiagKananBawah: `${BASE}motor-kanan-bawah.webp`,
  motorDiagKiriAtas:   `${BASE}motor-kiri-atas.webp`,
  motorDiagKiriBawah:  `${BASE}motor-kiri-bawah.webp`,
};

interface Transform { x: number; y: number; scale: number; }
const MIN_SCALE = 0.5;
const MAX_SCALE = 3.0;
const INITIAL: Transform = { x: 0, y: 0, scale: 1 };

export const MapCanvas: React.FC<MapCanvasProps> = ({
  level, selectedRoute, segmentLengths, isDelivering, animationStep, courierPos, onHouseClick, onBack,
  onUndo, onReset, onDeliver, onStopDeliver, deliverySpeed, onChangeSpeed, currentMetrics, onHelpClick,
  isSoundOn, onToggleSound, onPlayClick,
  playHouseClick, playWaypointClick, playDeliverSound, playResetSound, playUndoSound,
  playMotor, stopMotor,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tf, setTf] = useState<Transform>(INITIAL);
  const tfRef = useRef<Transform>(INITIAL);
  const [isControlsExpanded, setIsControlsExpanded] = useState(true);
  const [showRouteTimeline, setShowRouteTimeline] = useState(false);

  const updateTf = useCallback((updater: (prev: Transform) => Transform) => {
    setTf(prev => {
      const next = updater(prev);
      tfRef.current = next;
      return next;
    });
  }, []);

  const dragRef = useRef({ active: false, startX: 0, startY: 0, originX: 0, originY: 0 });
  const pinchRef = useRef({ active: false, dist: 0 });
  const didDragRef = useRef(false);

  const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  const getPinchDist = (touches: TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // ── Native listeners (non-passive) ───────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStartNative = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinchRef.current = { active: true, dist: getPinchDist(e.touches) };
        dragRef.current.active = false;
      } else if (e.touches.length === 1) {
        pinchRef.current.active = false;
        dragRef.current = {
          active: true,
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          originX: tfRef.current.x,
          originY: tfRef.current.y,
        };
        didDragRef.current = false;
      }
    };

    const onTouchMoveNative = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 2 && pinchRef.current.active) {
        const newDist = getPinchDist(e.touches);
        const ratio = newDist / pinchRef.current.dist;
        pinchRef.current.dist = newDist;
        const rect = el.getBoundingClientRect();
        const midX = ((e.touches[0].clientX + e.touches[1].clientX) / 2) - rect.left;
        const midY = ((e.touches[0].clientY + e.touches[1].clientY) / 2) - rect.top;
        updateTf(prev => {
          const newScale = clampScale(prev.scale * ratio);
          const sc = newScale / prev.scale;
          return { scale: newScale, x: midX - sc * (midX - prev.x), y: midY - sc * (midY - prev.y) };
        });
      } else if (e.touches.length === 1 && dragRef.current.active && !pinchRef.current.active) {
        const dx = e.touches[0].clientX - dragRef.current.startX;
        const dy = e.touches[0].clientY - dragRef.current.startY;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDragRef.current = true;
        updateTf(() => ({ ...tfRef.current, x: dragRef.current.originX + dx, y: dragRef.current.originY + dy }));
      }
    };

    const onTouchEndNative = (e: TouchEvent) => {
      if (e.touches.length < 2) pinchRef.current.active = false;
      if (e.touches.length === 0) dragRef.current.active = false;
    };

    const onWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      updateTf(prev => {
        const newScale = clampScale(prev.scale * delta);
        const sc = newScale / prev.scale;
        return { scale: newScale, x: mx - sc * (mx - prev.x), y: my - sc * (my - prev.y) };
      });
    };

    el.addEventListener('touchstart', onTouchStartNative, { passive: false });
    el.addEventListener('touchmove', onTouchMoveNative, { passive: false });
    el.addEventListener('touchend', onTouchEndNative, { passive: false });
    el.addEventListener('wheel', onWheelNative, { passive: false });

    return () => {
      el.removeEventListener('touchstart', onTouchStartNative);
      el.removeEventListener('touchmove', onTouchMoveNative);
      el.removeEventListener('touchend', onTouchEndNative);
      el.removeEventListener('wheel', onWheelNative);
    };
  }, [updateTf]);

  useEffect(() => {
    if (isDelivering) {
      playMotor();
    } else {
      stopMotor();
    }
    return () => {
      stopMotor();
    };
  }, [isDelivering, playMotor, stopMotor]);

  // ── Mouse drag (desktop) ─────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return; // handled by touch listeners
    if (e.isPrimary) {
      dragRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        originX: tfRef.current.x,
        originY: tfRef.current.y,
      };
      didDragRef.current = false;
    }
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    if (!dragRef.current.active || !e.isPrimary) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDragRef.current = true;
    updateTf(() => ({ ...tfRef.current, x: dragRef.current.originX + dx, y: dragRef.current.originY + dy }));
  }, [updateTf]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    dragRef.current.active = false;
  }, []);

  const handleNodeClick = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (didDragRef.current) return;

    const clickedHouse = level.houses.find(h => h.id === id);
    if (clickedHouse) {
      if (clickedHouse.isWaypoint) {
        playWaypointClick();
      } else {
        playHouseClick();
      }
    }

    onHouseClick(id);
  }, [didDragRef, level.houses, playWaypointClick, playHouseClick, onHouseClick]);

  const resetView = () => {
    tfRef.current = INITIAL;
    setTf(INITIAL);
  };

  const getMotorAsset = () => {
    if (!isDelivering || selectedRoute.length < 2) {
      if (level.initialMotorImage) {
        return `${BASE}${level.initialMotorImage}`;
      }
      return ASSETS.motorDiagKananAtas;
    }
    const fromId = selectedRoute[animationStep];
    const toId   = selectedRoute[animationStep + 1];
    const from   = level.houses.find(h => h.id === fromId);
    const to     = level.houses.find(h => h.id === toId);
    if (!from || !to) return ASSETS.motorDiagKananAtas;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    if (dx >= 0 && dy <= 0) return ASSETS.motorDiagKananAtas;
    if (dx >= 0 && dy > 0)  return ASSETS.motorDiagKananBawah;
    if (dx < 0  && dy <= 0) return ASSETS.motorDiagKiriAtas;
    return ASSETS.motorDiagKiriBawah;
  };

  const isConnectionActive = (from: string, to: string) => {
    for (let i = 0; i < selectedRoute.length - 1; i++) {
      const u = selectedRoute[i], v = selectedRoute[i + 1];
      if ((u === from && v === to) || (u === to && v === from)) return true;
    }
    return false;
  };

  const getStepNumbers = (from: string, to: string) => {
    const steps: number[] = [];
    for (let i = 0; i < selectedRoute.length - 1; i++) {
      const u = selectedRoute[i], v = selectedRoute[i + 1];
      if ((u === from && v === to) || (u === to && v === from)) {
        let accumulated = 0;
        for (let s = 0; s < segmentLengths.length; s++) {
          accumulated += segmentLengths[s];
          if (i < accumulated) {
            if (!steps.includes(s + 1)) {
              steps.push(s + 1);
            }
            break;
          }
        }
      }
    }
    return steps;
  };

  // Group segments between actual houses/store (filtering out waypoints) and sum their distances
  const legs: { nodeId: string; distanceToNext?: number }[] = [];
  if (selectedRoute.length > 0) {
    let currentLegNode = selectedRoute[0];
    let currentLegDistance = 0;

    for (let i = 0; i < selectedRoute.length - 1; i++) {
      const fromId = selectedRoute[i];
      const toId = selectedRoute[i + 1];

      const conn = level.connections.find(
        (c) =>
          ((c.from === fromId && c.to === toId) || (c.from === toId && c.to === fromId)) &&
          !c.isBlockedByLevel
      );
      const dist = conn ? conn.distance : 0;
      currentLegDistance += dist;

      const nextHouse = level.houses.find((h) => h.id === toId);
      if (nextHouse && !nextHouse.isWaypoint) {
        legs.push({
          nodeId: currentLegNode,
          distanceToNext: currentLegDistance,
        });
        currentLegNode = toId;
        currentLegDistance = 0;
      }
    }
    legs.push({ nodeId: currentLegNode });
  }

  return (
    <div className="relative w-full h-full overflow-hidden select-none" style={{ backgroundImage: `url(${ASSETS.canvasBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Top Left Header Actions Container */}
      <div className="absolute top-3 left-3 z-20 flex items-start gap-1.5 sm:gap-2">
        {/* Back button */}
        <button
          onClick={onBack}
          className="bg-white/60 backdrop-blur-md border border-slate-200/80 rounded-lg p-1.5 shadow-sm hover:bg-white/85 active:scale-95 transition text-slate-600 cursor-pointer animate-fade-in"
          title="Kembali"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={() => {
            onPlayClick?.();
            onToggleSound();
          }}
          className="bg-white/60 backdrop-blur-md border border-slate-200/80 rounded-lg p-1.5 shadow-sm hover:bg-white/85 active:scale-95 transition text-slate-600 cursor-pointer animate-fade-in"
          title={isSoundOn ? 'Matikan Suara' : 'Nyalakan Suara'}
        >
          {isSoundOn ? (
            <Volume2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {/* Help Button */}
        <button
          onClick={() => {
            onPlayClick?.();
            onHelpClick?.();
          }}
          className="bg-white/60 backdrop-blur-md border border-slate-200/80 rounded-lg p-1.5 shadow-sm hover:bg-white/85 active:scale-95 transition text-amber-600 cursor-pointer animate-fade-in"
          title="Cara Bermain"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
        
        {/* Hint */}
        <div className="z-20 pointer-events-none block md:hidden">
          <div className="text-[11px] font-medium text-slate-600 bg-white/60 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-slate-200/80 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping shrink-0" />
            Geser / cubit untuk memperbesar/memperkecil <br/> · klik titik lokasi untuk rute
          </div>
        </div>
      </div>


      {/* Top Right Header Actions Container */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 sm:gap-2">
        {/* Route panel button */}
        <button
          onClick={() => {
            onPlayClick?.();
            setShowRouteTimeline(prev => !prev);
          }}
          className={`bg-white/60 backdrop-blur-md border rounded-lg px-2.5 py-1 text-[8.5px] md:text-[11px] font-semibold shadow-sm hover:bg-white/85 active:scale-95 transition flex items-center gap-1 font-display tracking-wider ${
            showRouteTimeline
              ? 'border-indigo-500 text-indigo-700 bg-indigo-50/45'
              : 'border-slate-200/80 text-slate-600'
          }`}
        >
          📋 Rute
        </button>

        {/* Reset button */}
        <button
          onClick={() => {
            onPlayClick?.();
            resetView();
          }}
          className="bg-white/60 backdrop-blur-md border border-slate-200/80 rounded-lg px-2.5 py-1 text-[8.5px] md:text-[11px] font-semibold text-slate-600 shadow-sm hover:bg-white/85 active:scale-95 transition font-display tracking-wider"
        >
          ⟳ Tampilan Awal
        </button>
      </div>

      {/* Route Timeline Floating Panel */}
      {showRouteTimeline && (
        <div className="absolute top-14 left-3 right-3 sm:left-auto sm:right-3 z-20 w-[calc(100%-24px)] sm:w-80 max-h-[60vh] bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-2xl p-3 sm:p-4 shadow-lg flex flex-col gap-2.5 overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 shrink-0">
            <h4 className="text-[10px] sm:text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-display">
              <span>📋 Alur Perjalanan ({legs.length > 0 ? legs.length - 1 : 0} Kunjungan)</span>
            </h4>
            <button
              onClick={() => setShowRouteTimeline(false)}
              className="text-slate-400 hover:text-slate-600 transition text-[8.5px] md:text-[11px] font-bold font-display"
            >
              Tutup
            </button>
          </div>

          {/* Live Metrics inside panel */}
          <div className="bg-slate-50/45 backdrop-blur-xs p-2 sm:p-2.5 rounded-xl border border-slate-200 shrink-0">
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase">Jarak Tempuh</span>
              <span className="text-[10.5px] md:text-xs font-extrabold text-slate-700 font-mono mt-0.5">{formatDistance(currentMetrics.distance)}</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1 min-h-0">
            {legs.length <= 1 ? (
              <p className="text-[10px] md:text-xs text-slate-400 text-center py-4">
                Belum ada rute pengiriman. Klik rumah atau toko di peta untuk mulai menyusun rute.
              </p>
            ) : (
              <div className="flex flex-col gap-2 py-0.5">
                {legs.map((leg, index) => {
                  const isToko = leg.nodeId === 'Toko';
                  const isLast = index === legs.length - 1;
                  return (
                    <div key={index} className="relative flex items-start gap-2 sm:gap-3 pl-1">
                      {/* Vertical Timeline Line */}
                      {!isLast && (
                        <span className="absolute left-[11px] sm:left-[13px] top-[20px] sm:top-[24px] bottom-[-18px] sm:bottom-[-20px] w-[1.5px] bg-slate-200" />
                      )}

                      {/* Number Bullet */}
                      <div className={`w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] rounded-full shrink-0 flex items-center justify-center text-[9px] md:text-[10px] font-black border z-10 font-display backdrop-blur-xs ${
                        isToko
                          ? 'bg-amber-100/50 border-amber-300/50 text-amber-800'
                          : 'bg-indigo-50/50 border-indigo-200/50 text-indigo-800'
                      }`}>
                        {isToko ? '🥖' : index}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9.5px] md:text-[11px] font-bold text-slate-800 truncate">
                            {isToko ? 'Toko Roti' : `Rumah ${leg.nodeId}`}
                          </span>
                          {leg.distanceToNext !== undefined && leg.distanceToNext > 0 && (
                            <span className="text-[8px] md:text-[9px] font-extrabold text-indigo-600 bg-indigo-50/45 backdrop-blur-xs border border-indigo-100/60 px-1 sm:px-1.5 py-0.5 rounded-md shrink-0 font-mono">
                              {formatDistance(leg.distanceToNext)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pan/zoom container */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          style={{
            transform: `translate(${tf.x}px, ${tf.y}px) scale(${tf.scale})`,
            transformOrigin: '0 0',
            willChange: 'transform',
            width: '100%',
            height: '100%',
          }}
        >
          <svg
            viewBox={level.viewBox ?? '0 0 800 500'}
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="map-dots" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.2" fill="#cbd5e1" />
              </pattern>
              <pattern id="caution-stripes" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="10" height="20" fill="#ef4444" />
                <rect x="10" width="10" height="20" fill="#facc15" />
              </pattern>
              <filter id="node-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000033" />
              </filter>
            </defs>

            <style>
              {`
                @keyframes markerBounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-8px); }
                }
                .animate-marker-bounce {
                  animation: markerBounce 0.8s infinite ease-in-out;
                }
                @keyframes radarPing {
                  0% { transform: scale(0.25); opacity: 0.95; }
                  100% { transform: scale(1.6); opacity: 0; }
                }
                .animate-radar-ping {
                  animation: radarPing 0.8s infinite cubic-bezier(0.1, 0.8, 0.3, 1);
                  transform-origin: 0px 0px;
                }
              `}
            </style>

            {level.mapImage && (
              <image
                href={`${BASE}${level.mapImage}`}
                x="0" y="0"
                width="100%" height="100%"
                preserveAspectRatio="xMidYMid meet"
              />
            )}

            {/* ── ROADS ── */}
            {level.connections.map((conn) => {
              const from = level.houses.find(h => h.id === conn.from);
              const to   = level.houses.find(h => h.id === conn.to);
              if (!from || !to) return null;
              const active    = isConnectionActive(conn.from, conn.to);
              const isBlocked = !!conn.isBlockedByLevel;
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2;
              const lx = conn.labelOffset?.x ?? 0;
              const ly = conn.labelOffset?.y ?? 0;
              return (
                <g key={conn.id}>
                  {!level.hideConnectionLines && (
                    <>
                      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                        stroke={isBlocked ? '#fecaca' : 'transparent'}
                        strokeWidth={isBlocked ? 10 : 9}
                        strokeLinecap="round" className="transition-all duration-300"
                      />
                      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                        stroke={isBlocked ? 'url(#caution-stripes)' : '#ffffff'}
                        strokeWidth={isBlocked ? 6 : 3.5}
                        strokeDasharray="6,6"
                        strokeLinecap="round" className="transition-all duration-300"
                      />
                    </>
                  )}
                  <g transform={`translate(${midX + lx},${midY + ly})`}>
                    <rect x="-13" y="-8" width="26" height="14" rx="4"
                      fill={isBlocked ? '#fef2f2' : active ? '#fef3c7' : 'white'}
                      stroke={isBlocked ? '#ef4444' : active ? '#f59e0b' : '#cbd5e1'}
                      strokeWidth="1.2"
                    />
                    <text y="2.5" textAnchor="middle" fontSize={conn.fontSize ?? 8} fontWeight="bold" fill="#334155">
                      {conn.distance}m
                    </text>
                  </g>
                  {isBlocked && (
                    <g transform={`translate(${midX},${midY - 24})`}>
                      <rect x="-13" y="-9" width="26" height="16" rx="4" fill="#ef4444" />
                      <text y="4" textAnchor="middle" fontSize="11">🚧</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* ── WAYPOINTS ── */}
            {level.houses.filter(h => h.isWaypoint).map((house) => {
              const isInRoute = selectedRoute.includes(house.id);
              const isLatest = selectedRoute[selectedRoute.length - 1] === house.id && !isDelivering;
              const wpNumber = house.id.replace('wp-', '');

              // Priority: per-waypoint → level default → hardcoded
              const hw = house.waypointColors;
              const lw = level.defaultWaypointColors;
              const colors = isLatest
                ? {
                    fill:   hw?.latest?.fill   ?? lw?.latest?.fill   ?? '#6366f1',
                    stroke: hw?.latest?.stroke ?? lw?.latest?.stroke ?? '#4338ca',
                    text:   hw?.latest?.text   ?? lw?.latest?.text   ?? '#ffffff',
                    glow:   hw?.latest?.glow   ?? lw?.latest?.glow   ?? '#818cf8',
                  }
                : isInRoute
                ? {
                    fill:   hw?.visited?.fill   ?? lw?.visited?.fill   ?? '#10b981',
                    stroke: hw?.visited?.stroke ?? lw?.visited?.stroke ?? '#059669',
                    text:   hw?.visited?.text   ?? lw?.visited?.text   ?? '#ffffff',
                    glow:   '',
                  }
                : {
                    fill:   hw?.inactive?.fill   ?? lw?.inactive?.fill   ?? '#ffffff',
                    stroke: hw?.inactive?.stroke ?? lw?.inactive?.stroke ?? '#64748b',
                    text:   hw?.inactive?.text   ?? lw?.inactive?.text   ?? '#475569',
                    glow:   '',
                  };

              return (
                <g
                  key={house.id}
                  transform={`translate(${house.x},${house.y})`}
                  onClick={(e) => handleNodeClick(house.id, e)}
                  style={{ cursor: 'pointer' }}
                  filter="url(#node-shadow)"
                >
                  <circle r={22} fill="transparent" pointerEvents="all" cx="0" cy="0" style={{ cursor: 'pointer' }} />

                  {/* Pulsing glow ring — only on the latest waypoint */}
                  {isLatest && (
                    <>
                      <circle cx="0" cy="0" r="14" fill="none" stroke={colors.glow} strokeWidth="2" opacity="0.35" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                      <circle cx="0" cy="0" r="11" fill={colors.fill} opacity="0.12" />
                    </>
                  )}

                  <circle
                    cx="0" cy="0"
                    r={isLatest ? 9.5 : 8}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={isLatest ? 2.2 : 1.8}
                    style={{ transition: 'all 0.3s ease' }}
                  />

                  {/* Number label — always show */}
                  <text
                    y="3"
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="black"
                    fill={colors.text}
                  >
                    {wpNumber}
                  </text>
                </g>
              );
            })}

            {/* ── HOUSE CENTER DOTS ── */}
            {level.houses.filter(h => !h.isWaypoint && h.id !== 'Toko').map((house) => {
              const isInRoute = selectedRoute.includes(house.id);
              return (
                <g key={`dot-${house.id}`} transform={`translate(${house.x},${house.y})`}>
                  <circle
                    cx="0"
                    cy="0"
                    r="4.5"
                    fill={isInRoute ? '#10b981' : '#ffffff'}
                    stroke={isInRoute ? '#059669' : '#64748b'}
                    strokeWidth="2.5"
                  />
                </g>
              );
            })}

            {/* ── COURIER ── */}
            {(() => {
              const mSize = level.motorSize ?? 48;
              const mHalf = mSize / 2;
              return (
                <g transform={`translate(${courierPos.x},${courierPos.y})`}
                  style={{ transition: 'transform 50ms linear' }}>

                  <image
                    href={getMotorAsset()}
                    x={-mHalf} y={-mHalf}
                    width={mSize} height={mSize}
                    preserveAspectRatio="xMidYMid meet"
                    style={{ pointerEvents: 'none' }}
                  />
                </g>
              );
            })()}

            {/* ── HOUSES & TOKO ── */}
            {level.houses.filter(h => !h.isWaypoint).map((house) => {
              const isToko    = house.id === 'Toko';
              const isInRoute = selectedRoute.includes(house.id);
              const isLatest  = selectedRoute[selectedRoute.length - 1] === house.id;
              const mSize     = house.markerSize ?? 48;
              const mHalf     = mSize / 2;
              const ox        = house.markerOffset?.x ?? 0;
              const oy        = house.markerOffset?.y ?? 0;
              const rox       = house.radarOffset?.x ?? 0;
              const roy       = house.radarOffset?.y ?? 0;

              const originalIndex = level.houses.findIndex(h => h.id === house.id);
              const getMarkerSrc = () => {
                if (isToko) return `${BASE}point-roti.webp`;
                if (house.markerImage) return house.markerImage;
                const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
                const letter = letters[originalIndex - 1] || 'a';
                return `${BASE}point-${letter}.webp`;
              };

              const markerSrc = getMarkerSrc();
              return (
                <g key={house.id} transform={`translate(${house.x},${house.y})`} onClick={(e) => handleNodeClick(house.id, e)} style={{ cursor: 'pointer' }} filter="url(#node-shadow)">
                  <circle r={isToko ? 45 : 30} fill="transparent" pointerEvents="all" cx={ox} cy={isToko ? oy + 18 : oy} style={{ cursor: 'pointer' }} />
                  <g className={isLatest && !isDelivering ? 'animate-marker-bounce' : ''}>
                    {isLatest && !isDelivering && (
                      <g transform={`translate(${ox + rox},${oy + roy})`}>
                        <circle
                          cx="0"
                          cy="0"
                          r={isToko ? 36 : mHalf + 10}
                          fill="none"
                          stroke={house.radarColor ?? '#10b981'}
                          strokeWidth="2.5"
                          className="animate-radar-ping"
                        />
                      </g>
                    )}
                    <image href={markerSrc} x={-mHalf + ox} y={-mHalf + oy} width={mSize} height={mSize} preserveAspectRatio="xMidYMid meet" style={{ pointerEvents: 'auto', opacity: 1.0, filter: 'none', transition: 'all 0.3s ease' }} />
                    {isInRoute && !isToko && (() => {
                      const visitCount = selectedRoute.filter(id => id === house.id).length;
                      return (
                        <g transform={`translate(${ox + mHalf - 4}, ${oy - mHalf + 4})`}>
                          <circle r="9" fill="#10b981" stroke="white" strokeWidth="1.5" />
                          <path d="M-4 0 L-1.5 2.5 L4 -3" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          {visitCount > 1 && (
                            <g transform="translate(7, -7)">
                              <circle r="6" fill="#f59e0b" stroke="white" strokeWidth="1.0" />
                              <text y="2" textAnchor="middle" fontSize="6.5" fontWeight="black" fill="white">{visitCount}</text>
                            </g>
                          )}
                        </g>
                      );
                    })()}
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Floating Controls Overlay at the bottom */}
      {isControlsExpanded ? (
        <div className="absolute bottom-3 left-3 right-3 z-20 lg:left-1/2 lg:-translate-x-1/2 lg:max-w-xl lg:bg-white/50 lg:backdrop-blur-md lg:border border-slate-200/80 rounded-xl lg:p-2.5 lg:shadow-lg flex items-center justify-between gap-2 sm:gap-3 transition-all animate-fade-in">
          {/* Speed selection */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-100/40 backdrop-blur-xs p-0.5 rounded-lg sm:rounded-xl border border-slate-200/65 shrink-0">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  onPlayClick?.();
                  onChangeSpeed(s);
                }}
                className={`py-1 sm:py-1.5 px-2 sm:px-3 rounded-md sm:rounded-lg text-[8.5px] md:text-[11px] font-bold transition-all font-display ${
                  deliverySpeed === s
                    ? 'bg-[#0083C1] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60 active:scale-95'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Actions group */}
          <div className="flex items-center gap-1 sm:gap-1.5 font-display tracking-wider bg-white/50 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border lg:border-none border-slate-200/80 rounded-xl shadow-sm lg:shadow-none">
            <button
              onClick={() => {
                playUndoSound();
                onUndo();
              }}
              disabled={selectedRoute.length <= 1 || isDelivering}
              className="py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg sm:rounded-xl font-bold text-[8.5px] md:text-[11px] text-slate-700 bg-slate-100/50 backdrop-blur-xs hover:bg-slate-200/70 border border-slate-300/80 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition flex items-center justify-center gap-1 font-display"
            >
              <SkipBack className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Hapus Terakhir</span>
            </button>

            <button
              onClick={() => {
                playResetSound();
                onReset();
              }}
              disabled={selectedRoute.length <= 1 || isDelivering}
              className="py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg sm:rounded-xl font-bold text-[8.5px] md:text-[11px] text-slate-700 bg-slate-100/50 backdrop-blur-xs hover:bg-slate-200/70 border border-slate-300/80 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition flex items-center justify-center gap-1 font-display"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Ulangi</span>
            </button>

            {isDelivering ? (
              <button
                onClick={() => {
                  playUndoSound();
                  onStopDeliver();
                }}
                className="py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg sm:rounded-xl font-bold text-[8.5px] md:text-[11px] text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/10 font-display"
              >
                <RotateCcw className="w-3.5 h-3.5 text-white" />
                Berhenti
              </button>
            ) : (
              <button
                onClick={() => {
                  playDeliverSound();
                  onDeliver();
                }}
                disabled={selectedRoute.length <= 1}
                className="py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg sm:rounded-xl font-bold text-[8.5px] md:text-[11px] text-white bg-[#FC8C00] backdrop-blur-xs hover:bg-amber-600 active:scale-95 transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/10 disabled:opacity-50 disabled:pointer-events-none font-display"
              >
                <Truck className="w-3.5 h-3.5 text-white" />
                Berangkat
              </button>
            )}

            {/* Collapse button */}
            <button
              onClick={() => {
                onPlayClick?.();
                setIsControlsExpanded(false);
              }}
              className="py-1.5 sm:py-2 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl font-bold text-xs text-slate-600 bg-slate-100/50 backdrop-blur-xs hover:bg-slate-200/70 border border-slate-300/80 active:scale-95 transition flex items-center justify-center gap-1"
              title="Sembunyikan"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            onPlayClick?.();
            setIsControlsExpanded(true);
          }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-lg sm:rounded-xl px-1.5 md:px-2.5 py-1.5 md:py-2.5 shadow-lg hover:bg-white/85 active:scale-95 transition text-slate-700 font-bold text-[8.5px] md:text-[11px] flex items-center gap-1.5 animate-fade-in font-display tracking-wider"
        >
          <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 animate-bounce" style={{ animationDuration: '1s' }} />
          <span>Tampilkan Kontrol</span>
        </button>
      )}
    </div>
  );
};
