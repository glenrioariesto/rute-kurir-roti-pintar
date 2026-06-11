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
    title: 'Level 2: Analisis Rute (5 Rumah)',
    route: ['Toko', 'D', 'C', 'B', 'A', 'E', 'Toko'],
    distance: 21,
    timeFormatted: '10 menit 30 detik' // 21 * 0.5 = 10.5 menit
  },
  {
    levelId: 3,
    title: 'Level 3: Labirin Rute Kompleks (8 Rumah)',
    route: ['Toko', 'A', 'B', 'G', 'H', 'C', 'D', 'E', 'F', 'Toko'],
    distance: 27,
    timeFormatted: '13 menit 30 detik' // 27 * 0.5 = 13.5 menit
  },
  {
    levelId: 4,
    title: 'Level 4: Penutupan Jalan Darurat! (🚧)',
    route: ['Toko', 'A', 'B', 'E', 'C', 'D', 'Toko'],
    distance: 20,
    timeFormatted: '10 menit' // 20 * 0.5 = 10 menit
  },
  {
    levelId: 5,
    title: 'Level 5: Batas Waktu (Ujian Logistik)',
    route: ['Toko', 'A', 'B', 'C', 'D', 'E', 'F', 'Toko'],
    distance: 23,
    timeFormatted: '11 menit 30 detik' // 23 * 0.5 = 11.5 menit
  }
];
