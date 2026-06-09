import { useState, useEffect, useRef } from 'react';
import { LevelConfig } from '@/types';
import { calculateRouteMetrics, findOptimalRoute, visitsAllHouses } from '@utils/findOptimalRoute';

export function useRouteGame(level: LevelConfig) {
  const [selectedRoute, setSelectedRoute] = useState<string[]>(['Toko']);
  const [isDelivering, setIsDelivering] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<{
    route: string[]; distance: number; time: number; score: number; isValid: boolean;
  }[]>([]);

  // Refs untuk animasi — hindari stale closure
  const stepRef      = useRef(0);
  const progressRef  = useRef(0);
  const routeRef     = useRef<string[]>(['Toko']);
  const deliveringRef = useRef(false);
  const pausedRef    = useRef(false);

  useEffect(() => {
    setSelectedRoute(['Toko']);
    routeRef.current = ['Toko'];
    setIsDelivering(false);
    deliveringRef.current = false;
    setShowResult(false);
    setScore(0);
    setFeedback('');
  }, [level]);

  const currentMetrics = calculateRouteMetrics(selectedRoute, level);
  const optimal = findOptimalRoute(level);

  const handleHouseClick = (houseId: string) => {
    if (isDelivering || showResult) return;

    const lastNode = selectedRoute[selectedRoute.length - 1];

    if (houseId === 'Toko' && selectedRoute.length === 1) return;
    if (level.linear && houseId === 'Toko') return;

    if (selectedRoute.length >= 2 && selectedRoute[selectedRoute.length - 2] === houseId) {
      handleUndo();
      return;
    }

    const findPath = (from: string, to: string): string[] | null => {
      const direct = level.connections.find(
        (c) => ((c.from === from && c.to === to) || (c.from === to && c.to === from)) && !c.isBlockedByLevel
      );
      if (direct) return [to];

      const waypointNodes = level.houses.filter(h => h.isWaypoint).map(h => h.id);
      for (const wp of waypointNodes) {
        const leg1 = level.connections.find(
          (c) => ((c.from === from && c.to === wp) || (c.from === wp && c.to === from)) && !c.isBlockedByLevel
        );
        const leg2 = level.connections.find(
          (c) => ((c.from === wp && c.to === to) || (c.from === to && c.to === wp)) && !c.isBlockedByLevel
        );
        if (leg1 && leg2) return [wp, to];
      }
      return null;
    };

    const path = findPath(lastNode, houseId);

    if (!path) {
      setErrorToast(`❌ Tidak ada jalan dari ${lastNode} ke ${houseId}! Silakan ikuti jalur bergaris.`);
      setTimeout(() => setErrorToast(null), 3000);
      return;
    }

    if (lastNode === 'Toko' && selectedRoute.length > 1) {
      setErrorToast('🔒 Rute sudah ditutup kembali ke Toko Roti. Sila klik "Kirim" atau "Reset"!');
      setTimeout(() => setErrorToast(null), 3000);
      return;
    }

    const newRoute = [...selectedRoute, ...path];
    setSelectedRoute(newRoute);
    routeRef.current = newRoute;
  };

  const handleUndo = () => {
    if (isDelivering || showResult) return;
    if (selectedRoute.length > 1) {
      const copy = [...selectedRoute];
      copy.pop();
      setSelectedRoute(copy);
      routeRef.current = copy;
    }
  };

  const handleReset = () => {
    if (isDelivering) return;
    setSelectedRoute(['Toko']);
    routeRef.current = ['Toko'];
    setShowResult(false);
    setScore(0);
    setFeedback('');
  };

  const handleDeliver = () => {
    if (selectedRoute.length < 2) {
      setErrorToast('⚠️ Tentukan rutenya terlebih dahulu dengan mengeklik rumah!');
      setTimeout(() => setErrorToast(null), 3000);
      return;
    }

    if (!level.linear && selectedRoute[selectedRoute.length - 1] !== 'Toko') {
      setErrorToast('🥖 Jangan lupa selesaikan rute dengan mengeklik "Toko Roti" kembali di akhir!');
      setTimeout(() => setErrorToast(null), 3500);
      return;
    }

    if (!visitsAllHouses(selectedRoute, level)) {
      setErrorToast('🏠 Masih ada warga yang belum menerima kiriman roti. Kunjungi seluruh rumah!');
      setTimeout(() => setErrorToast(null), 3500);
      return;
    }

    stepRef.current = 0;
    progressRef.current = 0;
    pausedRef.current = false;
    setAnimationStep(0);
    setAnimationProgress(0);
    setIsDelivering(true);
    deliveringRef.current = true;
    setShowResult(false);
  };

  // Animation loop — gunakan ref agar tidak stale
  useEffect(() => {
    if (!isDelivering) return;

    const route = routeRef.current;
    const totalLegs = route.length - 1;
    if (totalLegs <= 0) { setIsDelivering(false); return; }

    const timer = setInterval(() => {
      if (pausedRef.current) return;

      progressRef.current += 4;

      if (progressRef.current >= 100) {
        progressRef.current = 100;
        setAnimationProgress(100);

        if (stepRef.current < totalLegs - 1) {
          // Pause sebentar di titik ini sebelum lanjut
          pausedRef.current = true;
          setTimeout(() => {
            stepRef.current += 1;
            progressRef.current = 0;
            setAnimationStep(stepRef.current);
            setAnimationProgress(0);
            pausedRef.current = false;
          }, 600);
        } else {
          clearInterval(timer);
          setTimeout(() => {
            deliveringRef.current = false;
            setIsDelivering(false);
            calculateFinalScore();
          }, 800);
        }
      } else {
        setAnimationProgress(progressRef.current);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [isDelivering]);

  const calculateFinalScore = () => {
    const route = routeRef.current;
    const routeVisitedAll = visitsAllHouses(route, level);
    const endsAtToko = level.linear || route[route.length - 1] === 'Toko';

    if (!routeVisitedAll) {
      setScore(0);
      setFeedback('Kamu belum mengirimkan roti ke seluruh rumah warga!');
      setShowResult(true);
      return;
    }

    if (!endsAtToko) {
      setScore(40);
      setFeedback('Roti sudah sampai ke semua warga, tapi kurir lupa kembali ke Toko Roti!');
      setShowResult(true);
      return;
    }

    const metrics = calculateRouteMetrics(route, level);
    const distance = metrics.distance;
    const time = metrics.time;

    if (level.maxFuel && distance > level.maxFuel) {
      setScore(50);
      setFeedback(`Bensin tidak cukup (Maksimal ${level.maxFuel} km). Jarak tempuh: ${distance} km!`);
      setShowResult(true);
      return;
    }

    if (level.timeLimitMinutes && time > level.timeLimitMinutes) {
      setScore(50);
      setFeedback(`Waktu melebihi batas (${time} menit). Roti terlambat sampai!`);
      setShowResult(true);
      return;
    }

    const diff = Math.round((distance - optimal.distance) * 10) / 10;
    let finalScore = 60;
    let finalFeedback = '';

    if (diff <= 0.05) {
      finalScore = 100;
      finalFeedback = 'Hebat! Kamu menemukan rute terpendek yang sempurna! ⭐';
    } else if (diff <= 2.1) {
      finalScore = 80;
      finalFeedback = `Hampir sempurna! Selisih ${diff} km dari rute terbaik. Coba lagi!`;
    } else {
      finalScore = 60;
      finalFeedback = 'Coba kunjungi rumah-rumah terdekat secara berurutan agar lebih hemat km!';
    }

    setScore(finalScore);
    setFeedback(finalFeedback);
    setShowResult(true);
    setAttempts((prev) => [{ route, distance, time, score: finalScore, isValid: true }, ...prev]);
  };

  const getCourierPosition = () => {
    const route = routeRef.current;
    const step = stepRef.current;
    const progress = progressRef.current;

    if (!deliveringRef.current || route.length < 2) {
      const toko = level.houses.find(h => h.id === 'Toko');
      return { x: toko?.x || 400, y: toko?.y || 400 };
    }

    const fromHouse = level.houses.find(h => h.id === route[step]);
    const toHouse   = level.houses.find(h => h.id === route[step + 1]);
    if (!fromHouse || !toHouse) return { x: 400, y: 400 };

    const ratio = Math.min(progress / 100, 1);
    return {
      x: fromHouse.x + (toHouse.x - fromHouse.x) * ratio,
      y: fromHouse.y + (toHouse.y - fromHouse.y) * ratio,
    };
  };

  return {
    selectedRoute,
    isDelivering,
    animationStep,
    animationProgress,
    showResult,
    setShowResult,
    score,
    feedback,
    errorToast,
    optimal,
    currentMetrics,
    handleHouseClick,
    handleUndo,
    handleReset,
    handleDeliver,
    getCourierPosition,
    attempts,
  };
}
