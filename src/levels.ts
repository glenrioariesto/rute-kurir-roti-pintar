import { LevelConfig } from './types';

const BASE_URL = import.meta.env?.BASE_URL || '/';

//
// Semua level menggunakan pola diamond/wajik seperti level 1:
// node di atas, bawah, kiri, kanan dari titik tengah → semua koneksi diagonal 45°
//
// ViewBox: 800 x 500
// Center : 400, 260
// Grid   :
//   Atas        : y = 80
//   Tengah-atas : y = 180
//   Tengah      : y = 260
//   Tengah-bawah: y = 340
//   Bawah       : y = 430
//
//   Kiri-jauh   : x = 120
//   Kiri        : x = 220
//   Tengah-kiri : x = 310
//   Tengah      : x = 400
//   Tengah-kanan: x = 490
//   Kanan       : x = 580
//   Kanan-jauh  : x = 680
//

export const levels: LevelConfig[] = [
  {
    // ─── LEVEL 1 ─── linear Toko → A → B → Toko
    //
    //    Toko(400,440)
    //       \
    //       A(200,260)
    //       /
    //    B(400,80)
    //
    id: 1,
    motorSize: 30,
    title: 'Level 1: Dasar Urutan 6 Rumah + 1 Toko Roti',
    viewBox: '0 0 800 520',
    linear: true,
    hideConnectionLines: true,
    mapImage: 'map-level-1.webp?v=3',
    description: 'Setiap pagi, kurir roti mengantarkan pesanan dari Toko Roti ke 6 rumah warga. Temukan rute terpendek untuk mengunjungi semua rumah dan kembali lagi ke Toko Roti!',
    hints: 'Pilihlah rute yang teratur agar tidak bolak-balik melintasi jalur yang sama.',
    startTimeString: '07:00',
    houses: [
      { id: 'Toko', name: 'Toko Roti🥖', x: 95, y: 375, markerImage: `${BASE_URL}point-roti.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: -45, y: -95, },radarColor: "#E0A060", radarOffset: { x: 0, y: 15 } },
      { id: 'A', name: 'Rumah A', x: 195, y: 325, markerImage: `${BASE_URL}point-a.webp`, markerSize: 40, markerOffset : { x: -20, y: -85  , }, radarColor: "#F2000D", radarOffset: { x: 0, y: 15 } },
      { id: 'B', name: 'Rumah B', x: 365, y: 225, markerImage: `${BASE_URL}point-b.webp`, markerSize: 40, hideIcon: true, markerOffset : { x:-40, y: -70, }, radarColor: "#FC8C00", radarOffset: { x: 0, y: 15 } },
      { id: 'C', name: 'Rumah C', x: 325, y: 325, markerImage: `${BASE_URL}point-c.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: 35, y: -65, }, radarColor: "#B25826", radarOffset: { x: 0, y: 15 } },
      { id: 'D', name: 'Rumah D', x: 560, y: 375, markerImage: `${BASE_URL}point-d.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: -10, y: -85, }, radarColor: "#FEBE00", radarOffset: { x: 0, y: 15 } },
      { id: 'E', name: 'Rumah E', x: 500, y: 230, markerImage: `${BASE_URL}point-e.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: 40, y: -70, }, radarColor: "#009B00", radarOffset: { x: 0, y: 15 } },
      { id: 'F', name: 'Rumah F', x: 670, y: 200, markerImage: `${BASE_URL}point-f.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: 35, y: -85, }, radarColor: "#009791", radarOffset: { x: 0, y: 15 } },
      { id: '1', name: 'Titik 1', x: 205, y: 440, isWaypoint: true },
      { id: '2', name: 'Titik 2', x: 262, y: 287, isWaypoint: true },
      { id: '3', name: 'Titik 3', x: 373, y: 352, isWaypoint: true },
      { id: '4', name: 'Titik 4', x: 485, y: 405, isWaypoint: true },
      { id: '5', name: 'Titik 5', x: 540, y: 255, isWaypoint: true },
      { id: '6', name: 'Titik 6', x: 655, y: 320, isWaypoint: true },
      { id: '7', name: 'Titik 7', x: 765, y: 255, isWaypoint: true },
      { id: '8', name: 'Titik 8', x: 430, y: 190, isWaypoint: true },
      { id: '9', name: 'Titik 9', x: 540, y: 125, isWaypoint: true },
  
    ],
    connections: [
      // --- AREA KIRI (Toko, A) ---
      { id: 'Toko-A',   from: 'Toko', to: 'A',    distance: 110 }, // Langsung dari Toko ke A
      { id: 'Toko-1',   from: 'Toko', to: '1',    distance: 100 },

      // --- PERCABANGAN KIRI-TENGAH (A, B, C via 2) ---
      { id: 'A-2',      from: 'A',    to: '2',    distance: 40 },
      { id: 'B-2',      from: 'B',    to: '2',    distance: 110 },
      { id: 'C-2',      from: 'C',    to: '2',    distance: 70 },

      // --- AREA TENGAH (C, 1, 3, 4) ---
      { id: '1-3',      from: '1',    to: '3',    distance: 150 },
      { id: 'C-3',      from: 'C',    to: '3',    distance: 30 },
      { id: '3-4',      from: '3',    to: '4',    distance: 100 },
      { id: '3-5',      from: '3',    to: '5',    distance: 150 },

      // --- AKSES KE D (Hanya bisa via 4 atau 6) ---
      { id: '4-D',      from: '4',    to: 'D',    distance: 80 },
      { id: 'D-6',      from: 'D',    to: '6',    distance: 70 }, // D menuju rute F

      // --- AKSES KE E (Via 5 atau 8) ---
      { id: '5-E',      from: '5',    to: 'E',    distance: 50 },
      { id: 'B-8',      from: 'B',    to: '8',    distance: 40 },
      { id: '8-E',      from: '8',    to: 'E',    distance: 50 },

      // --- AREA KANAN / MENUJU F (Via 6, 7, 9) ---
      { id: '5-6',      from: '5',    to: '6',    distance: 100 },
      { id: '6-7',      from: '6',    to: '7',    distance: 150 },
      { id: '7-F',      from: '7',    to: 'F',    distance: 100 }, // Wajib masuk F lewat 7 jika dari bawah

      // --- JALUR UTARA BEBAS HAMBATAN (B -> E -> F via 8, 9) ---
      { id: '8-9',      from: '8',    to: '9',    distance: 100 },
      { id: 'F-9',      from: 'F',    to: '9',    distance: 110 }, // Masuk F dari atas
    ],
    ctExplanation: {
      decomposition: 'Mengurai peta pengantaran 6 titik menjadi rute antar persimpangan dan lokasi rumah warga.',
      patternRecognition: 'Melihat rute linear satu arah dari barat ke timur untuk meminimalkan lintasan berulang.',
      abstraction: 'Menyederhanakan 6 rumah warga menjadi simpul graf dengan marker 1-6 terbobot jarak tempuh m.',
      algorithm: 'Menyusun langkah terpendek: Toko Roti ➔ A ➔ B ➔ C ➔ D ➔ E ➔ F.',
    },
  },
  {
    id: 2,
    motorSize: 30,
    title: 'Level 2: Analisis Rute 8 Rumah + 1 Toko Roti',
    viewBox: '0 0 800 820',
    linear: true,
    hideConnectionLines: true,
    mapImage: 'map-level-2.webp?v=3',
    initialMotorImage: 'motor-kiri-bawah.webp',
    description: 'Wilayah pengantaran meluas menjadi 8 rumah warga dan 1 Toko Roti dengan total 14 titik rute. Temukan rute terpendek dari Toko Roti, kunjungi semua rumah, dan kembali ke Toko Roti!',
    hints: 'Gunakan titik-titik persimpangan (tanpa rumah) untuk memotong rute dan meminimalkan jarak tempuh.',
    startTimeString: '07:00',
    houses: [
      { id: 'Toko', name: 'Toko Roti🥖', x: 600, y: 250, color: '#f59e0b', markerImage: `${BASE_URL}point-roti.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: -45, y: -95, },radarColor: "#E0A060", radarOffset: { x: 0, y: 15 } },
      { id: 'A',    name: 'Rumah A🏠',   x: 130, y: 350, color: '#ec4899', markerImage: `${BASE_URL}point-a.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: -40, y: -75 }, radarColor: "#F2000D", radarOffset: { x: 0, y: 15 } },
      { id: 'B',    name: 'Rumah B🏠',   x: 315, y: 240, color: '#3b82f6', markerImage: `${BASE_URL}point-b.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: -50, y: -80 }, radarColor: "#FC8C00", radarOffset: { x: 0, y: 15 } },
      { id: 'C',    name: 'Rumah C🏠',   x: 160, y: 430, color: '#06b6d4', markerImage: `${BASE_URL}point-c.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: 40, y: -70 }, radarColor: "#B25826", radarOffset: { x: 0, y: 15 } },
      { id: 'D',    name: 'Rumah D🏠',   x: 600, y: 570, color: '#14b8a6', markerImage: `${BASE_URL}point-d.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: -30, y: -75 }, radarColor: "#FEBE00", radarOffset: { x: 0, y: 15 } },
      { id: 'E',    name: 'Rumah E🏠',   x: 645, y: 400, color: '#10b981', markerImage: `${BASE_URL}point-e.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: 45, y: -75 }, radarColor: "#009B00", radarOffset: { x: 0, y: 15 } },
      { id: 'F',    name: 'Rumah F🏠',   x: 450, y: 410, color: '#8b5cf6', markerImage: `${BASE_URL}point-f.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: 35, y: -65 }, radarColor: "#009791", radarOffset: { x: 0, y: 15 } },
      { id: 'G',    name: 'Rumah G🏠',   x: 280, y: 630, color: '#eab308', markerImage: `${BASE_URL}point-g.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: -20, y: -85 }, radarColor: "#eab308", radarOffset: { x: 0, y: 15 } },
      { id: 'H',    name: 'Rumah H🏠',   x: 340, y: 530, color: '#f43f5e', markerImage: `${BASE_URL}point-h.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: 45, y: -65 }, radarColor: "#14b8a6", radarOffset: { x: 0, y: 15 } },
      { id: '1',    name: 'Titik 1',     x: 500, y: 320, isWaypoint: true },
      { id: '2',    name: 'Titik 2',     x: 340, y: 225, isWaypoint: true },
      { id: '3',    name: 'Titik 3',     x: 395, y: 380, isWaypoint: true },
      { id: '4',    name: 'Titik 4',     x: 230, y: 290, isWaypoint: true },
      { id: '5',    name: 'Titik 5',     x: 75, y: 380, isWaypoint: true },
      { id: '6',    name: 'Titik 6',     x: 230, y: 470, isWaypoint: true },
      { id: '7',    name: 'Titik 7',     x: 75, y: 565, isWaypoint: true },
      { id: '8',    name: 'Titik 8',     x: 230, y: 655, isWaypoint: true },
      { id: '9',    name: 'Titik 9',     x: 395, y: 565, isWaypoint: true },
      { id: '10',   name: 'Titik 10',    x: 500, y: 625, isWaypoint: true },
      { id: '11',   name: 'Titik 11',    x: 550, y: 470, isWaypoint: true },
      { id: '12',   name: 'Titik 12',    x: 660, y: 535, isWaypoint: true },
      { id: '13',   name: 'Titik 13',    x: 765, y: 475, isWaypoint: true },
    ],
    connections: [
      { id: 'Toko-1', from: 'Toko', to: '1', distance: 110 },
      { id: '1-2', from: '1', to: '2', distance: 150 },
      { id: '2-B', from: '2', to: 'B', distance: 30 },
      { id: '1-3', from: '1', to: '3', distance: 100 },
      { id: '3-F', from: '3', to: 'F', distance: 50 },
      { id: '1-E', from: '1', to: 'E', distance: 130 },
      { id: 'B-4', from: 'B', to: '4', distance: 70 },
      { id: '4-A', from: '4', to: 'A', distance: 100 },
      { id: '4-3', from: '4', to: '3', distance: 150 },
      { id: '3-6', from: '3', to: '6', distance: 150 },
      { id: '6-C', from: '6', to: 'C', distance: 50 },
      { id: 'A-5', from: 'A', to: '5', distance: 50 },
      { id: '5-C', from: '5', to: 'C', distance: 100 },
      { id: 'F-11', from: 'F', to: '11', distance: 100 },
      { id: '11-12', from: '11', to: '12', distance: 100 },
      { id: '12-D', from: '12', to: 'D', distance: 50 },
      { id: '11-9', from: '11', to: '9', distance: 150 },
      { id: '9-H', from: '9', to: 'H', distance: 50 },
      { id: '12-13', from: '12', to: '13', distance: 100 },
      { id: '13-E', from: '13', to: 'E', distance: 120 },
      { id: '6-H', from: '6', to: 'H', distance: 10 },
      { id: '6-7', from: '6', to: '7', distance: 150 },
      { id: '7-8', from: '7', to: '8', distance: 150 },
      { id: '8-G', from: '8', to: 'G', distance: 50 },
      { id: '9-G', from: '9', to: 'G', distance: 100 },
      { id: '9-10', from: '9', to: '10', distance: 100 },
      { id: '10-D', from: '10', to: 'D', distance: 100 },
    ],
    ctExplanation: {
      decomposition: 'Mengurai peta pengantaran 6 titik menjadi rute antar persimpangan dan lokasi rumah warga.',
      patternRecognition: 'Melihat rute linear satu arah dari barat ke timur untuk meminimalkan lintasan berulang.',
      abstraction: 'Menyederhanakan 6 rumah warga menjadi simpul graf dengan marker 1-6 terbobot jarak tempuh m.',
      algorithm: 'Menyusun langkah terpendek: Toko Roti ➔ A ➔ B ➔ C ➔ D ➔ E ➔ F.',
    },
  },
  {
    id: 3,
    motorSize: 30,
    title: 'Level 3: Labirin Kota 8 Rumah + 1 Toko Roti',
    viewBox: '0 0 800 820',
    linear: true,
    hideConnectionLines: true,
    mapImage: 'map-level-3.webp?v=3',
    initialMotorImage: 'motor-kiri-bawah.webp',
    description: 'Tantangan perkotaan paling rumit dengan gang-gang sempit dan persimpangan padat. Antar roti ke 8 rumah warga dari Toko Roti dan kembali dengan rute paling efisien!',
    hints: 'Gunakan persimpangan (Titik 1-13) dengan cerdik untuk mempersingkat waktu. Rencanakan seluruh rute sebelum melangkah.',
    startTimeString: '07:00',
    houses: [
      { id: 'Toko', name: 'Toko Roti🥖', x: 600, y: 250, color: '#f59e0b', markerImage: `${BASE_URL}point-roti.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: -45, y: -95, },radarColor: "#E0A060", radarOffset: { x: 0, y: 15 } },
      { id: 'A',    name: 'Rumah A🏠',   x: 130, y: 350, color: '#ec4899', markerImage: `${BASE_URL}point-a.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: -40, y: -75 }, radarColor: "#F2000D", radarOffset: { x: 0, y: 15 } },
      { id: 'B',    name: 'Rumah B🏠',   x: 315, y: 240, color: '#3b82f6', markerImage: `${BASE_URL}point-b.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: -50, y: -80 }, radarColor: "#FC8C00", radarOffset: { x: 0, y: 15 } },
      { id: 'C',    name: 'Rumah C🏠',   x: 160, y: 430, color: '#06b6d4', markerImage: `${BASE_URL}point-c.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: 40, y: -70 }, radarColor: "#B25826", radarOffset: { x: 0, y: 15 } },
      { id: 'D',    name: 'Rumah D🏠',   x: 600, y: 570, color: '#14b8a6', markerImage: `${BASE_URL}point-d.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: -30, y: -75 }, radarColor: "#FEBE00", radarOffset: { x: 0, y: 15 } },
      { id: 'E',    name: 'Rumah E🏠',   x: 645, y: 400, color: '#10b981', markerImage: `${BASE_URL}point-e.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: 45, y: -75 }, radarColor: "#009B00", radarOffset: { x: 0, y: 15 } },
      { id: 'F',    name: 'Rumah F🏠',   x: 450, y: 410, color: '#8b5cf6', markerImage: `${BASE_URL}point-f.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: 35, y: -65 }, radarColor: "#009791", radarOffset: { x: 0, y: 15 } },
      { id: 'G',    name: 'Rumah G🏠',   x: 280, y: 630, color: '#eab308', markerImage: `${BASE_URL}point-g.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: -20, y: -85 }, radarColor: "#eab308", radarOffset: { x: 0, y: 15 } },
      { id: 'H',    name: 'Rumah H🏠',   x: 340, y: 530, color: '#f43f5e', markerImage: `${BASE_URL}point-h.webp`, markerSize: 40, hideIcon: true, markerOffset : { x: 45, y: -65 }, radarColor: "#14b8a6", radarOffset: { x: 0, y: 15 } },
      { id: '1',    name: 'Titik 1',     x: 500, y: 320, isWaypoint: true },
      { id: '2',    name: 'Titik 2',     x: 340, y: 225, isWaypoint: true },
      { id: '3',    name: 'Titik 3',     x: 395, y: 380, isWaypoint: true },
      { id: '4',    name: 'Titik 4',     x: 230, y: 290, isWaypoint: true },
      { id: '5',    name: 'Titik 5',     x: 75, y: 380, isWaypoint: true },
      { id: '6',    name: 'Titik 6',     x: 230, y: 470, isWaypoint: true },
      { id: '7',    name: 'Titik 7',     x: 75, y: 565, isWaypoint: true },
      { id: '8',    name: 'Titik 8',     x: 230, y: 655, isWaypoint: true },
      { id: '9',    name: 'Titik 9',     x: 395, y: 565, isWaypoint: true },
      { id: '10',   name: 'Titik 10',    x: 500, y: 625, isWaypoint: true },
      { id: '11',   name: 'Titik 11',    x: 550, y: 470, isWaypoint: true },
      { id: '12',   name: 'Titik 12',    x: 660, y: 535, isWaypoint: true },
      { id: '13',   name: 'Titik 13',    x: 765, y: 475, isWaypoint: true },
    ],
    connections: [
      { id: 'Toko-1', from: 'Toko', to: '1', distance: 110 },
      { id: '1-2', from: '1', to: '2', distance: 150 },
      { id: '2-B', from: '2', to: 'B', distance: 30 },
      { id: '1-3', from: '1', to: '3', distance: 100 },
      { id: '3-F', from: '3', to: 'F', distance: 50 },
      { id: '1-E', from: '1', to: 'E', distance: 130 },
      { id: 'B-4', from: 'B', to: '4', distance: 70 },
      { id: '4-A', from: '4', to: 'A', distance: 100 },
      { id: '4-3', from: '4', to: '3', distance: 150 },
      { id: '3-6', from: '3', to: '6', distance: 150 },
      { id: '6-C', from: '6', to: 'C', distance: 50 },
      { id: 'A-5', from: 'A', to: '5', distance: 50 },
      { id: '5-C', from: '5', to: 'C', distance: 100 },
      { id: 'F-11', from: 'F', to: '11', distance: 100 },
      { id: '11-12', from: '11', to: '12', distance: 100 },
      { id: '12-D', from: '12', to: 'D', distance: 50 },
      { id: '11-9', from: '11', to: '9', distance: 150 },
      { id: '9-H', from: '9', to: 'H', distance: 50 },
      { id: '12-13', from: '12', to: '13', distance: 100 },
      { id: '13-E', from: '13', to: 'E', distance: 120 },
      { id: '6-H', from: '6', to: 'H', distance: 10 },
      { id: '6-7', from: '6', to: '7', distance: 150 },
      { id: '7-8', from: '7', to: '8', distance: 150 },
      { id: '8-G', from: '8', to: 'G', distance: 50 },
      { id: '9-G', from: '9', to: 'G', distance: 100 },
      { id: '9-10', from: '9', to: '10', distance: 100 },
      { id: '10-D', from: '10', to: 'D', distance: 100 },
    ],
    ctExplanation: {
      decomposition: 'Mengurai peta pengantaran 6 titik menjadi rute antar persimpangan dan lokasi rumah warga.',
      patternRecognition: 'Melihat rute linear satu arah dari barat ke timur untuk meminimalkan lintasan berulang.',
      abstraction: 'Menyederhanakan 6 rumah warga menjadi simpul graf dengan marker 1-6 terbobot jarak tempuh m.',
      algorithm: 'Menyusun langkah terpendek: Toko Roti ➔ A ➔ B ➔ C ➔ D ➔ E ➔ F.',
    },
  },
];
