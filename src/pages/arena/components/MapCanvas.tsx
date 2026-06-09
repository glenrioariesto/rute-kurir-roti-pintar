import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { LevelConfig } from '@/types';

interface MapCanvasProps {
  level: LevelConfig;
  selectedRoute: string[];
  isDelivering: boolean;
  animationStep: number;
  courierPos: { x: number; y: number };
  onHouseClick: (id: string) => void;
  onBack: () => void;
}

const ASSETS = {
  house:  '/assets/house.png',
  store:  '/assets/store.png',
  mapBg:  '/rute-bangunan-.webp',
  motorDiagKananAtas:  '/Motor-diagonal-kanan-atas.webp',
  motorDiagKananBawah: '/Motor-diagonal-kanan-bawah.webp',
  motorDiagKiriAtas:   '/Motor-diagonal-kiri-atas .webp',
  motorDiagKiriBawah:  '/Motor-diagonal-kiri-bawah.webp',
};

interface Transform { x: number; y: number; scale: number; }
const MIN_SCALE = 0.5;
const MAX_SCALE = 3.0;
const INITIAL: Transform = { x: 0, y: 0, scale: 1 };

export const MapCanvas: React.FC<MapCanvasProps> = ({
  level, selectedRoute, isDelivering, animationStep, courierPos, onHouseClick, onBack,
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

  const getStepIdx = (from: string, to: string) => {
    for (let i = 0; i < selectedRoute.length - 1; i++) {
      const u = selectedRoute[i], v = selectedRoute[i + 1];
      if ((u === from && v === to) || (u === to && v === from)) return i;
    }
    return -1;
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-100 select-none">
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
          Geser / cubit untuk zoom · klik rumah untuk rute
        </div>
      </div>

      {/* Reset button */}
      <button
        onClick={resetView}
        className="absolute top-3 right-3 z-20 bg-white/90 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-600 shadow-sm hover:bg-white active:scale-95 transition"
      >
        ⟳ Reset View
      </button>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/60" />

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
              const stepIdx   = getStepIdx(conn.from, conn.to);
              const isBlocked = !!conn.isBlockedByLevel;
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2;
              return (
                <g key={conn.id}>
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={isBlocked ? '#fecaca' : active ? '#fde047' : '#e2e8f0'}
                    strokeWidth={isBlocked ? 10 : active ? 14 : 9}
                    strokeLinecap="round" className="transition-all duration-300"
                  />
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={isBlocked ? 'url(#caution-stripes)' : active ? '#f59e0b' : '#94a3b8'}
                    strokeWidth={isBlocked ? 6 : active ? 5 : 2.5}
                    strokeDasharray={'none'}
                    strokeLinecap="round" className="transition-all duration-300"
                  />
                  <g transform={`translate(${midX},${midY})`}>
                    <rect x="-16" y="-10" width="32" height="18" rx="5"
                      fill={isBlocked ? '#fef2f2' : active ? '#fef3c7' : 'white'}
                      stroke={isBlocked ? '#ef4444' : active ? '#f59e0b' : '#cbd5e1'}
                      strokeWidth="1.5"
                    />
                    <text y="4" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">
                      {conn.distance}km
                    </text>
                  </g>
                  {isBlocked && (
                    <g transform={`translate(${midX},${midY - 24})`}>
                      <rect x="-13" y="-9" width="26" height="16" rx="4" fill="#ef4444" />
                      <text y="4" textAnchor="middle" fontSize="11">🚧</text>
                    </g>
                  )}
                  {active && stepIdx >= 0 && (
                    <g transform={`translate(${from.x * 0.65 + to.x * 0.35},${from.y * 0.65 + to.y * 0.35 - 16})`}>
                      <circle r="10" fill="#f59e0b" stroke="white" strokeWidth="2" />
                      <text y="4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">{stepIdx + 1}</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Compass */}
            <g transform="translate(54, 450)" opacity="0.45">
              <circle r="20" fill="white" stroke="#cbd5e1" strokeWidth="1.5" />
              <text y="-6" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#64748b">N</text>
              <polygon points="0,-14 -3.5,-3 3.5,-3" fill="#ef4444" />
              <polygon points="0,14 -3.5,3 3.5,3" fill="#94a3b8" />
            </g>

            {/* ── NODES ── */}
            {level.houses.map((house) => {
              const isToko    = house.id === 'Toko';
              const isWaypoint = !!house.isWaypoint;
              const isInRoute = selectedRoute.includes(house.id);
              const isLatest  = selectedRoute[selectedRoute.length - 1] === house.id;
              const r         = isToko ? 26 : isWaypoint ? 10 : 20;
              return (
                <g
                  key={house.id}
                  transform={`translate(${house.x},${house.y})`}
                  onClick={(e) => !isWaypoint && handleNodeClick(house.id, e)}
                  style={{ cursor: isWaypoint ? 'default' : 'pointer' }}
                  filter="url(#node-shadow)"
                >
                  {isLatest && !isDelivering && (
                    <circle r={r + 14} fill="none" stroke="#10b981" strokeWidth="2"
                      className="animate-ping" style={{ animationDuration: '2s' }} />
                  )}
                  <circle r={r + 6}
                    fill={isLatest ? '#d1fae5' : 'transparent'}
                    stroke={isLatest ? '#10b981' : isInRoute ? '#fbbf24' : 'transparent'}
                    strokeWidth="2.5" strokeDasharray={isLatest ? '4,3' : 'none'}
                    className="transition-all duration-200"
                  />
                  <circle r={r}
                    fill={isToko ? '#fef3c7' : isInRoute ? '#eff6ff' : 'white'}
                    stroke={isToko ? '#d97706' : isInRoute ? '#3b82f6' : '#94a3b8'}
                    strokeWidth={isLatest ? 3 : 2}
                    className="transition-all duration-200"
                  />
                  {!isWaypoint && (
                    <image
                      href={isToko ? ASSETS.store : ASSETS.house}
                      x={-r * 0.7} y={-r * 0.85}
                      width={r * 1.4} height={r * 1.4}
                      preserveAspectRatio="xMidYMid meet"
                      style={{ pointerEvents: 'none' }}
                      onError={(e) => { (e.currentTarget as SVGImageElement).style.display = 'none'; }}
                    />
                  )}
                  {!isWaypoint && (
                    <text y="5" textAnchor="middle" fontSize={isToko ? 16 : 14} className="select-none"
                      style={{ pointerEvents: 'none' }}>
                      {isToko ? '🥖' : '🏠'}
                    </text>
                  )}
                  {!isWaypoint && (
                    <g transform={`translate(0,${r + 14})`}>
                      <rect x="-30" y="-9" width="60" height="16" rx="4"
                        fill={isLatest ? '#059669' : isToko ? '#d97706' : isInRoute ? '#3b82f6' : '#475569'}
                        opacity="0.9"
                      />
                      <text y="4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white"
                        style={{ pointerEvents: 'none' }}>
                        {isToko ? 'TOKO ROTI' : `Rumah ${house.id}`}
                      </text>
                    </g>
                  )}
                  {isInRoute && !isToko && (
                    <g transform={`translate(${r - 4}, ${-r + 4})`}>
                      <circle r="8" fill="#10b981" stroke="white" strokeWidth="1.5" />
                      <path d="M-4 0 L-1.5 2.5 L4 -3" fill="none" stroke="white"
                        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  )}
                </g>
              );
            })}

            {/* ── COURIER ── */}
            <g transform={`translate(${courierPos.x},${courierPos.y})`}
              style={{ transition: 'transform 800ms linear' }}>
              <image
                href={getMotorAsset()}
                x="-24" y="-24"
                width="48" height="48"
                preserveAspectRatio="xMidYMid meet"
                style={{ pointerEvents: 'none' }}
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
