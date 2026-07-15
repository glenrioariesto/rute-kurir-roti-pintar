/**
 * Jawaban Rute Optimal Bebas Backtracking untuk Semua Level
 * Kecepatan motor: 1 meter = 30 detik (0.5 menit)
 */

export interface OptimalAnswer {
  levelId: number;
  title: string;
  route: string[];
  distance: number;
  timeFormatted: string;
}

export const optimalAnswers: OptimalAnswer[] = [
  {
    levelId: 1,
    title: 'Level 1: Dasar Urutan (6 Rumah)',
    route: [
      'Toko', 'A', 'wp-2', 'B', 'wp-8', 'E', 'wp-5', 'wp-6', 'wp-7', 'F',
      'wp-9', 'wp-8', 'E', 'wp-5', 'wp-6', 'D', 'wp-4', 'wp-3', 'C', 'wp-2',
      'A', 'Toko'
    ],
    distance: 79,
    timeFormatted: '39 menit 30 detik' // 79 * 0.5 = 39.5 menit
  },
  {
    levelId: 2,
    title: 'Level 2: Analisis Rute (9 Rumah, 14 Titik)',
    route: [
      'Toko', 'W1', 'W2', 'B', 'W4', 'A', 'W5', 'C', 'W6', 'W3',
      'F', 'W11', 'W9', 'H', 'W6', 'W7', 'W8', 'G', 'W9', 'W10',
      'D', 'W12', 'W13', 'E', 'W1', 'Toko'
    ],
    distance: 610,
    timeFormatted: '5 jam 5 menit' // 610 * 0.5 = 305 menit = 5 jam 5 menit
  },


];
