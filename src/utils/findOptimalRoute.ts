import { LevelConfig, Connection } from '@/types';

export function calculateRouteMetrics(route: string[], level: LevelConfig) {
  if (route.length < 2) {
    return { distance: 0, time: 0, isValid: true };
  }

  let totalDistance = 0;

  for (let i = 0; i < route.length - 1; i++) {
    const fromId = route[i];
    const toId = route[i + 1];

    const conn = level.connections.find(
      (c) =>
        ((c.from === fromId && c.to === toId) || (c.from === toId && c.to === fromId)) &&
        !c.isBlockedByLevel
    );

    if (!conn) return { distance: 0, time: 0, isValid: false };

    totalDistance += conn.distance;
  }

  // Check for immediate backtracking (X -> Y -> X)
  for (let i = 0; i < route.length - 2; i++) {
    if (route[i] === route[i + 2]) {
      return { distance: 0, time: 0, isValid: false };
    }
  }

  return {
    distance: totalDistance,
    time: Math.round(totalDistance * 0.5 * 10) / 10,
    isValid: true,
  };
}

/**
 * Helper to check if a route visits all houses in a level.
 */
export function visitsAllHouses(route: string[], level: LevelConfig): boolean {
  const targetIds = level.houses
    .filter((h) => h.id !== 'Toko' && !h.isWaypoint)
    .map((h) => h.id);
  const routeSet = new Set(route.filter((id) => id !== 'Toko'));
  return targetIds.every((id) => routeSet.has(id));
}

/**
 * Finds the absolute shortest path starting and ending at 'Toko' that visits
 * all houses in the level at least once. It respects blocked connections.
 */
export function findOptimalRoute(level: LevelConfig): { route: string[]; distance: number; time: number } {
  const targetHouses = level.houses
    .filter((h) => h.id !== 'Toko' && !h.isWaypoint)
    .map((h) => h.id);

  const adj: Record<string, { to: string; distance: number }[]> = {};
  for (const h of level.houses) {
    adj[h.id] = [];
  }
  for (const c of level.connections) {
    if (c.isBlockedByLevel) continue;
    adj[c.from].push({ to: c.to, distance: c.distance });
    adj[c.to].push({ to: c.from, distance: c.distance });
  }

  let bestRoute: string[] = [];
  let minDistance = Infinity;

  const memo = new Map<string, number>();

  function search(
    curr: string,
    prev: string | null,
    visitedMask: number,
    dist: number,
    path: string[]
  ) {
    if (dist >= minDistance) return;
    if (path.length > 40) return; // safety depth limit

    const stateKey = `${curr}_${prev || 'none'}_${visitedMask}`;
    const existing = memo.get(stateKey);
    if (existing !== undefined && dist >= existing) {
      return;
    }
    memo.set(stateKey, dist);

    if (curr === 'Toko' && visitedMask === (1 << targetHouses.length) - 1) {
      if (dist < minDistance) {
        minDistance = dist;
        bestRoute = [...path];
      }
      return;
    }

    const neighbors = adj[curr] || [];
    for (const edge of neighbors) {
      const nextNode = edge.to;
      if (nextNode === prev) continue;

      const houseIndex = targetHouses.indexOf(nextNode);
      let nextMask = visitedMask;
      if (houseIndex !== -1) {
        nextMask |= (1 << houseIndex);
      }

      path.push(nextNode);
      search(nextNode, curr, nextMask, dist + edge.distance, path);
      path.pop();
    }
  }

  search('Toko', null, 0, 0, ['Toko']);

  if (minDistance === Infinity) {
    const dummy = ['Toko', ...targetHouses, 'Toko'];
    return { route: dummy, distance: 99, time: 99 };
  }

  const time = Math.round(minDistance * 0.5 * 10) / 10;
  return { route: bestRoute, distance: minDistance, time };
}

export function formatTime(minutes: number): string {
  const totalSeconds = Math.round(minutes * 60);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hrs > 0) {
    const hrStr = `${hrs} jam`;
    const minStr = mins > 0 ? ` ${mins} menit` : '';
    const secStr = secs > 0 ? ` ${secs} detik` : '';
    return `${hrStr}${minStr}${secStr}`;
  } else {
    const minStr = mins > 0 ? `${mins} menit` : '';
    const secStr = secs > 0 ? `${secs} detik` : '';
    if (minStr && secStr) return `${minStr} ${secStr}`;
    if (minStr) return minStr;
    if (secStr) return secStr;
    return '0 detik';
  }
}
