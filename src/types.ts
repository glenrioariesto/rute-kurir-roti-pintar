export interface House {
  id: string;
  name: string;
  x: number;
  y: number;
  color?: string;
  isWaypoint?: boolean; // titik belok, tidak perlu diklik user
  labelOffset?: { x?: number; y?: number }; // custom posisi label
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  distance: number;
  isBlockedByLevel?: boolean;
  dashed?: boolean;
  waypoints?: string[]; // node perantara yang otomatis diinsert saat klik to
}

export interface LevelConfig {
  id: number;
  title: string;
  viewBox?: string;
  linear?: boolean;
  houses: House[];
  connections: Connection[];
  description: string;
  hints: string;
  maxFuel?: number; // Level 5 or general fuel limit
  timeLimitMinutes?: number; // Level 5 time constraint
  startTimeString?: string; // e.g., '07:00'
  ctExplanation: {
    decomposition: string;
    patternRecognition: string;
    abstraction: string;
    algorithm: string;
  };
}
