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
      'Toko', 'A', '2', 'B', '8', 'E', '5', '6', '7', 'F',
      '9', '8', 'E', '5', '6', 'D', '4', '3', 'C', '2',
      'A', 'Toko'
    ],
    distance: 1660,
    timeFormatted: '13 jam 50 menit'
  },
  {
    levelId: 2,
    title: 'Level 2: Analisis Rute (8 Rumah, 14 Titik)',
    route: [
      'Toko', '1', '2', 'B', '4', 'A', '5', 'C', '6', '3',
      'F', '11', '9', 'H', '6', '7', '8', 'G', '9', '10',
      'D', '12', '13', 'E', '1', 'Toko'
    ],
    distance: 2330,
    timeFormatted: '19 jam 25 menit'
  },
  {
    levelId: 3,
    title: 'Level 3: Labirin Kota (10 Rumah, 14 Titik)',
    route: [
      'Toko', 'I', '4', 'J', '3', 'B', '2', '1', 'C', '9',
      'H', '10', '11', 'E', '8', '9', 'H', '10', '11', '14',
      'G', '13', '12', 'F', '7', 'D', '6', '5', 'A', '4',
      'I', 'Toko'
    ],
    distance: 2700,
    timeFormatted: '22 jam 30 menit'
  },
];
