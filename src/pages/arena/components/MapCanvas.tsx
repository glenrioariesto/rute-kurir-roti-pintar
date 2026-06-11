import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Connection, LevelConfig } from '@/types';

interface MapCanvasProps {
  level: LevelConfig;
  selectedRoute: string[];
  segmentLengths: number[];
  isDelivering: boolean;
  animationStep: number;
  courierPos: { x: number; y: number };
  onHouseClick: (id: string) => void;
  onBack: () => void;
}

const ASSETS = {
  canvasBg: '/Background.webp',
  house:  '/assets/house.png',
  store:  '/assets/store.png',
  mapBg:  '/map-level-1-baru.webp',
  motorDiagKananAtas:  '/motor-kanan-atas.webp',
  motorDiagKananBawah: '/motor-kanan-bawah.webp',
  motorDiagKiriAtas:   '/motor-kiri-atas.webp',
  motorDiagKiriBawah:  '/motor-kiri-bawah.webp',
};

interface Transform { x: number; y: number; scale: number; }
const MIN_SCALE = 0.5;
const MAX_SCALE = 3.0;
const INITIAL: Transform = { x: 0, y: 0, scale: 1 };

export const MapCanvas: React.FC<MapCanvasProps> = ({
  level, selectedRoute, segmentLengths, isDelivering, animationStep, courierPos, onHouseClick, onBack,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tf, setTf] = useState<Transform>(INITIAL);
  const tfRef = useRef<Transform>(INITIAL);

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
    onHouseClick(id);
  }, [onHouseClick]);

  const resetView = () => {
    tfRef.current = INITIAL;
    setTf(INITIAL);
  };

  const getMotorAsset = () => {
    if (!isDelivering || selectedRoute.length < 2) return ASSETS.motorDiagKananAtas;
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

  return (
    <div className="relative w-full h-full overflow-hidden select-none" style={{ backgroundImage: `url(${ASSETS.canvasBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-3 left-3 z-20 bg-white/90 border border-slate-200 rounded-lg p-1.5 shadow-sm hover:bg-white active:scale-95 transition text-slate-600"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Hint */}
      <div className="absolute top-3 left-12 z-20 pointer-events-none">
        <div className="text-[11px] font-medium text-slate-600 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm border border-slate-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping shrink-0" />
          Geser / cubit untuk zoom · klik titik lokasi untuk rute
        </div>
      </div>

      {/* Reset button */}
      <button
        onClick={resetView}
        className="absolute top-3 right-3 z-20 bg-white/90 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-600 shadow-sm hover:bg-white active:scale-95 transition"
      >
        ⟳ Reset View
      </button>



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
              `}
            </style>

            <image
              href={ASSETS.mapBg}
              x="0" y="0"
              width="100%" height="100%"
              preserveAspectRatio="xMidYMid meet"
            />

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
              const wpNumber = house.id.replace('wp-', '');
              return (
                <g
                  key={house.id}
                  transform={`translate(${house.x},${house.y})`}
                  onClick={(e) => handleNodeClick(house.id, e)}
                  style={{ cursor: 'pointer' }}
                  filter="url(#node-shadow)"
                >
                  <circle r={22} fill="transparent" pointerEvents="all" cx="0" cy="0" style={{ cursor: 'pointer' }} />
                  <circle cx="0" cy="0" r="8" fill={isInRoute ? '#10b981' : '#ffffff'} stroke={isInRoute ? '#059669' : '#64748b'} strokeWidth="1.8" />
                  <text
                    y="3"
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="black"
                    fill={isInRoute ? '#ffffff' : '#475569'}
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
                  {/* Scan / Ping Animation */}
                  <circle r={mHalf + 10} fill="transparent" stroke="#3b82f6" strokeWidth="2"
                    className="animate-ping" style={{ animationDuration: '2s' }} />
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

              const cleanPath = (p: string) => p.startsWith('/assets/') ? p.replace('/assets/', '/') : p;
              const originalIndex = level.houses.findIndex(h => h.id === house.id);
              const getMarkerSrc = () => {
                if (isToko) return '/point-roti.webp';
                if (house.markerImage) return cleanPath(house.markerImage);
                const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
                const letter = letters[originalIndex - 1] || 'a';
                return `/point-${letter}.webp`;
              };

              const markerSrc = getMarkerSrc();
              return (
                <g key={house.id} transform={`translate(${house.x},${house.y})`} onClick={(e) => handleNodeClick(house.id, e)} style={{ cursor: 'pointer' }} filter="url(#node-shadow)">
                  <circle r={isToko ? 45 : 30} fill="transparent" pointerEvents="all" cx={ox} cy={isToko ? oy + 18 : oy} style={{ cursor: 'pointer' }} />
                  {isLatest && !isDelivering && (
                    <g transform={`translate(${isToko ? 0 : ox},${isToko ? 0 : oy})`}>
                      <circle r={isToko ? 36 : mHalf + 10} fill="none" stroke={house.radarColor ?? '#10b981'} strokeWidth="2" className="animate-ping" style={{ animationDuration: '2s' }} />
                    </g>
                  )}
                  <g className={isLatest && !isDelivering ? 'animate-marker-bounce' : ''}>
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
    </div>
  );
};
