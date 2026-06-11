import { useState, useEffect, useRef } from 'react';
import { LevelConfig } from '@/types';
import { calculateRouteMetrics, findOptimalRoute, visitsAllHouses } from '@utils/findOptimalRoute';

export function useRouteGame(level: LevelConfig) {
  const [selectedRoute, setSelectedRoute] = useState<string[]>(['Toko']);
  const [segmentLengths, setSegmentLengths] = useState<number[]>([]);
  const [isDelivering, setIsDelivering] = useState(false);
  const [deliverySpeed, setDeliverySpeed] = useState<number>(1);
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
    setSegmentLengths([]);
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

    // Cari node non-waypoint sebelumnya untuk fitur click-undo
    let prevNonWpNode: string | null = null;
    if (segmentLengths.length > 0) {
      const prevIndex = selectedRoute.length - 1 - segmentLengths[segmentLengths.length - 1];
      if (prevIndex >= 0) prevNonWpNode = selectedRoute[prevIndex];
    }
    if (prevNonWpNode && houseId === prevNonWpNode) {
      handleUndo();
      return;
    }

    // DFS pathfinding to find all paths using only waypoints as transit nodes
    const findAllPaths = (from: string, to: string): string[][] => {
      const adj: Record<string, string[]> = {};
      for (const h of level.houses) {
        adj[h.id] = [];
      }
      for (const c of level.connections) {
        if (c.isBlockedByLevel) continue;
        adj[c.from]?.push(c.to);
        adj[c.to]?.push(c.from);
      }

      const predecessor = selectedRoute.length >= 2 ? selectedRoute[selectedRoute.length - 2] : null;

      const paths: string[][] = [];
      const dfs = (node: string, currentPath: string[], visited: Set<string>) => {
        if (node === to) {
          paths.push([...currentPath]);
          return;
        }

        for (const neighbor of (adj[node] || [])) {
          if (visited.has(neighbor)) continue;

          // No immediate backtracking rule:
          // If this is the first step of the path, we cannot go back to the predecessor
          if (node === from && neighbor === predecessor) continue;

          // Allow transiting through any node (house or waypoint)
          visited.add(neighbor);
          dfs(neighbor, [...currentPath, neighbor], visited);
          visited.delete(neighbor);
        }
      };

      dfs(from, [], new Set<string>([from]));
      return paths;
    };

    if (lastNode === 'Toko' && selectedRoute.length > 1) {
      setErrorToast('🔒 Rute sudah ditutup kembali ke Toko Roti. Silakan klik "Berangkat" atau "Ulangi"!');
      setTimeout(() => setErrorToast(null), 3000);
      return;
    }

    const allPaths = findAllPaths(lastNode, houseId);

    if (allPaths.length === 0) {
      const lastHouse = level.houses.find(h => h.id === lastNode);
      const targetHouse = level.houses.find(h => h.id === houseId);
      const lastDisplayName = lastHouse?.isWaypoint ? lastHouse.name : lastNode === 'Toko' ? 'Toko Roti' : `Rumah ${lastNode}`;
      const targetDisplayName = targetHouse?.isWaypoint ? targetHouse.name : houseId === 'Toko' ? 'Toko Roti' : `Rumah ${houseId}`;
      setErrorToast(`❌ Tidak ada jalan dari ${lastDisplayName} ke ${targetDisplayName}! Silakan ikuti jalur bergaris.`);
      setTimeout(() => setErrorToast(null), 3000);
      return;
    }

    // Hitung jarak (dalam meter) untuk setiap rute yang ditemukan
    const getPathDistance = (p: string[], startNode: string): number => {
      let dist = 0;
      let curr = startNode;
      for (const node of p) {
        const conn = level.connections.find(
          c => !c.isBlockedByLevel &&
               ((c.from === curr && c.to === node) || (c.from === node && c.to === curr))
        );
        if (conn) dist += conn.distance;
        curr = node;
      }
      return dist;
    };

    const pathsWithDist = allPaths.map(p => ({
      path: p,
      distance: getPathDistance(p, lastNode)
    }));

    // Cari jarak minimum
    const minDistance = Math.min(...pathsWithDist.map(pwd => pwd.distance));

    // Filter rute yang jaraknya wajar (tidak lebih dari 1.8 kali lipat jarak terpendek)
    // agar jalan memutar yang sangat jauh/looping otomatis disaring,
    // sedangkan 2 jalan alternatif yang wajar tetap ditanyakan (Ada 2 rute).
    const validPaths = pathsWithDist.filter(pwd => pwd.distance <= 1.8 * minDistance);

    let path = validPaths[0].path;

    if (validPaths.length > 1) {
      // Jika salah satu rute yang valid adalah koneksi langsung (panjang path = 1), gunakan koneksi langsung tersebut.
      const directPath = validPaths.find(pwd => pwd.path.length === 1);
      if (directPath) {
        path = directPath.path;
      } else {
        const targetHouse = level.houses.find(h => h.id === houseId);
        const displayName = targetHouse?.isWaypoint ? targetHouse.name : houseId === 'Toko' ? 'Toko Roti' : `Rumah ${houseId}`;
        setErrorToast(`⚠️ Ada beberapa rute ke ${displayName}. Pilih jalur dengan mengeklik titik belok di peta!`);
        setTimeout(() => setErrorToast(null), 4000);
        return;
      }
    }
    const newRoute = [...selectedRoute, ...path];
    setSelectedRoute(newRoute);
    routeRef.current = newRoute;
    setSegmentLengths(prev => [...prev, path.length]);
  };

  const handleUndo = () => {
    if (isDelivering || showResult) return;
    if (selectedRoute.length > 1 && segmentLengths.length > 0) {
      const lastSegLen = segmentLengths[segmentLengths.length - 1];
      const copy = selectedRoute.slice(0, selectedRoute.length - lastSegLen);
      setSelectedRoute(copy);
      routeRef.current = copy;
      setSegmentLengths(prev => prev.slice(0, -1));
    }
  };

  const handleReset = () => {
    if (isDelivering) return;
    setSelectedRoute(['Toko']);
    routeRef.current = ['Toko'];
    setSegmentLengths([]);
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

    if (selectedRoute[selectedRoute.length - 1] !== 'Toko') {
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

  const handleStopDeliver = () => {
    setIsDelivering(false);
    deliveringRef.current = false;
    stepRef.current = 0;
    progressRef.current = 0;
    setAnimationStep(0);
    setAnimationProgress(0);
  };

  // Animation loop — gunakan ref agar tidak stale
  useEffect(() => {
    if (!isDelivering) return;

    const route = routeRef.current;
    const totalLegs = route.length - 1;
    if (totalLegs <= 0) { setIsDelivering(false); return; }

    const timer = setInterval(() => {
      if (pausedRef.current) return;

      progressRef.current += 4 * deliverySpeed;

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
          }, 600 / deliverySpeed);
        } else {
          clearInterval(timer);
          setTimeout(() => {
            deliveringRef.current = false;
            setIsDelivering(false);
            calculateFinalScore();
          }, 800 / deliverySpeed);
        }
      } else {
        setAnimationProgress(progressRef.current);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [isDelivering, deliverySpeed]);

  const calculateFinalScore = () => {
    const route = routeRef.current;
    const routeVisitedAll = visitsAllHouses(route, level);
    const endsAtToko = route[route.length - 1] === 'Toko';

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



    const ratio = optimal.distance / distance;
    let finalScore = Math.round(100 * ratio);
    finalScore = Math.max(10, Math.min(100, finalScore));

    let finalFeedback = '';
    if (finalScore === 100) {
      finalFeedback = 'Hebat! Kamu menemukan rute terpendek yang sempurna! ⭐';
    } else if (finalScore >= 85) {
      finalFeedback = `Sangat baik! Rutenya sudah sangat efisien (Skor: ${finalScore}). Sedikit lagi menuju sempurna!`;
    } else if (finalScore >= 70) {
      finalFeedback = `Cukup baik (Skor: ${finalScore})! Namun rutenya masih bisa dioptimalkan agar lebih pendek.`;
    } else if (finalScore >= 50) {
      finalFeedback = `Rutenya cukup panjang (Skor: ${finalScore}). Cobalah mencari jalan pintas atau urutan yang lebih searah.`;
    } else {
      finalFeedback = `Rutenya sangat panjang dan tidak efisien (Skor: ${finalScore}). Perhatikan posisi rumah terdekat untuk menghemat jarak!`;
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
    segmentLengths,
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
    handleStopDeliver,
    getCourierPosition,
    attempts,
    deliverySpeed,
    setDeliverySpeed,
  };
}
