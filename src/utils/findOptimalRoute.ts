import { LevelConfig, Connection } from '@/types';

export function calculateRouteMetrics(route: string[], level: LevelConfig) {
  if (route.length < 2) {
    return { distance: 0, time: 0, fuel: 0, isValid: true };
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

    if (!conn) return { distance: 0, time: 0, fuel: 0, isValid: false };

    totalDistance += conn.distance;
  }

  return {
    distance: totalDistance,
    time: Math.round(totalDistance * 3 * 10) / 10,
    fuel: totalDistance,
    isValid: true,
  };
}

/**
 * Helper to check if a route visits all houses in a level.
 */
export function visitsAllHouses(route: string[], level: LevelConfig): boolean {
  const targetIds = level.houses.filter((h) => h.id !== 'Toko').map((h) => h.id);
  const routeSet = new Set(route.filter((id) => id !== 'Toko'));
  return targetIds.every((id) => routeSet.has(id));
}

/**
 * Finds the absolute shortest path starting and ending at 'Toko' that visits
 * all houses in the level at least once. It respects blocked connections.
 */
export function findOptimalRoute(level: LevelConfig): { route: string[]; distance: number; time: number } {
  const housesToVisit = level.houses.map((h) => h.id).filter((id) => id !== 'Toko');
  const allNodes = level.houses.map((h) => h.id);
  const isLinear = !!level.linear;

  const adj: { [key: string]: { node: string; distance: number }[] } = {};
  allNodes.forEach((id) => { adj[id] = []; });
  level.connections.forEach((conn) => {
    if (conn.isBlockedByLevel) return;
    adj[conn.from].push({ node: conn.to, distance: conn.distance });
    adj[conn.to].push({ node: conn.from, distance: conn.distance });
  });

  let bestRoute: string[] = [];
  let minDistance = Infinity;
  const maxPathLength = level.houses.length * 2;

  function search(currNode: string, path: string[], currentDistance: number) {
    if (currentDistance >= minDistance) return;

    const visitedRequired = housesToVisit.every((id) => path.includes(id));

    if (isLinear) {
      // Linear: selesai saat semua rumah dikunjungi, tidak perlu balik ke Toko
      if (visitedRequired && currNode !== 'Toko') {
        minDistance = currentDistance;
        bestRoute = [...path];
        return;
      }
    } else {
      if (currNode === 'Toko' && path.length > 1 && visitedRequired) {
        minDistance = currentDistance;
        bestRoute = [...path];
        return;
      }
    }

    if (path.length >= maxPathLength) return;

    for (const neighbor of (adj[currNode] || [])) {
      if (path.length >= 2 && path[path.length - 2] === neighbor.node) {
        const currentUnvisited = housesToVisit.filter(id => !path.includes(id));
        if (currentUnvisited.length === 0 && neighbor.node !== 'Toko') continue;
      }
      const visitCount = path.filter(x => x === neighbor.node).length;
      if (visitCount > 2) continue;
      path.push(neighbor.node);
      search(neighbor.node, path, currentDistance + neighbor.distance);
      path.pop();
    }
  }

  search('Toko', ['Toko'], 0);

  if (bestRoute.length === 0) {
    const dummy = ['Toko', ...housesToVisit, ...(isLinear ? [] : ['Toko'])];
    return { route: dummy, distance: 99, time: 99 };
  }

  const metrics = calculateRouteMetrics(bestRoute, level);
  return { route: bestRoute, distance: metrics.distance, time: metrics.time };
}
