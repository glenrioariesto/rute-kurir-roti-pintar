export interface House {
  id: string;
  name: string;
  x: number;
  y: number;
  color?: string;
  isWaypoint?: boolean; // titik belok, tidak perlu diklik user
  labelOffset?: { x?: number; y?: number }; // custom posisi label
  markerImage?: string; // path gambar marker custom (misal '/point-a.webp'), mengganti circle+icon default
  markerSize?: number;  // ukuran marker custom (default 48)
  markerOffset?: { x?: number; y?: number }; // offset posisi marker image dari center
  radarColor?: string; // warna radar ping (default '#10b981')
  hideIcon?: boolean;   // sembunyikan icon emoji (🏠/🥖) di node
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  distance: number;
  isBlockedByLevel?: boolean;
  dashed?: boolean;
  waypoints?: string[]; // node perantara yang otomatis diinsert saat klik to
  labelOffset?: { x?: number; y?: number };
  fontSize?: number;
}

export interface LevelConfig {
  id: number;
  title: string;
  viewBox?: string;
  linear?: boolean;
  hideConnectionLines?: boolean;
  houses: House[];
  connections: Connection[];
  description: string;
  hints: string;
  timeLimitMinutes?: number; // Level 5 time constraint
  startTimeString?: string; // e.g., '07:00'
  motorSize?: number; // ukuran sprite motor kurir (default 48)
  ctExplanation: {
    decomposition: string;
    patternRecognition: string;
    abstraction: string;
    algorithm: string;
  };
}
