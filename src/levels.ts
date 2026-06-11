import { LevelConfig } from './types';

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
    title: 'Level 1: Dasar Urutan (6 Rumah)',
    viewBox: '0 0 800 520',
    linear: true,
    hideConnectionLines: true,
    description: 'Setiap pagi kurir roti mengantarkan pesanan ke 6 rumah warga. Temukan rute terpendek yang mengunjungi semua rumah! Kamu hanya perlu memulai dari Toko dan selesai di rumah terakhir.',
    hints: 'Pilihlah rute yang teratur agar tidak bolak-balik melintasi jalur yang sama.',
    startTimeString: '07:00',
    houses: [
      { id: 'Toko', name: 'Toko Roti🥖', x: 95, y: 375, markerImage: '/assets/point-roti.webp', markerSize: 40, hideIcon: true, markerOffset : { x: -45, y: -95, } },
      { id: 'A', name: 'Rumah A', x: 195, y: 325, markerImage: '/assets/point-a.webp', markerSize: 40, markerOffset : { x: -20, y: -85  , }, radarColor: "#F2000D" },
      { id: 'B', name: 'Rumah B', x: 365, y: 225, markerImage: '/assets/point-b.webp', markerSize: 40, hideIcon: true, markerOffset : { x:-40, y: -70, }, radarColor: "#FC8C00" },
      { id: 'C', name: 'Rumah C', x: 325, y: 325, markerImage: '/assets/point-c.webp', markerSize: 40, hideIcon: true, markerOffset : { x: 35, y: -65, }, radarColor: "#B25826" },
      { id: 'D', name: 'Rumah D', x: 560, y: 375, markerImage: '/assets/point-d.webp', markerSize: 40, hideIcon: true, markerOffset : { x: -10, y: -85, }, radarColor: "#FEBE00" },
      { id: 'E', name: 'Rumah E', x: 500, y: 230, markerImage: '/assets/point-e.webp', markerSize: 40, hideIcon: true, markerOffset : { x: 40, y: -70, }, radarColor: "#009B00" },
      { id: 'F', name: 'Rumah F', x: 670, y: 200, markerImage: '/assets/point-f.webp', markerSize: 40, hideIcon: true, markerOffset : { x: 35, y: -85, }, radarColor: "#009791" },
      { id: 'wp-1', name: 'belok-1', x: 205, y: 440, isWaypoint: true },
      { id: 'wp-2', name: 'belok-2', x: 262, y: 287, isWaypoint: true },
      { id: 'wp-3', name: 'belok-3', x: 373, y: 352, isWaypoint: true },
      { id: 'wp-4', name: 'belok-4', x: 485, y: 405, isWaypoint: true },
      { id: 'wp-5', name: 'belok-5', x: 540, y: 255, isWaypoint: true },
      { id: 'wp-6', name: 'belok-6', x: 655, y: 320, isWaypoint: true },
      { id: 'wp-7', name: 'belok-7', x: 765, y: 255, isWaypoint: true },
      { id: 'wp-8', name: 'belok-8', x: 430, y: 190, isWaypoint: true },
      { id: 'wp-9', name: 'belok-9', x: 540, y: 125, isWaypoint: true },
  
    ],
    connections: [
      // --- AREA KIRI (Toko, A) ---
      { id: 'Toko-A',   from: 'Toko', to: 'A',    distance: 110 }, // Langsung dari Toko ke A
      { id: 'Toko-wp1', from: 'Toko', to: 'wp-1', distance: 100 },

      // --- PERCABANGAN KIRI-TENGAH (A, B, C via wp-2) ---
      { id: 'A-wp2',    from: 'A',    to: 'wp-2', distance: 40 },
      { id: 'B-wp2',    from: 'B',    to: 'wp-2', distance: 110 },
      { id: 'C-wp2',    from: 'C',    to: 'wp-2', distance: 70 },

      // --- AREA TENGAH (C, wp-1, wp-3, wp-4) ---
      { id: 'wp1-wp3',  from: 'wp-1', to: 'wp-3', distance: 150 },
      { id: 'C-wp3',    from: 'C',    to: 'wp-3', distance: 30 },
      { id: 'wp3-wp4',  from: 'wp-3', to: 'wp-4', distance: 100 },
      { id: 'wp3-wp5',  from: 'wp-3', to: 'wp-5', distance: 150 },

      // --- AKSES KE D (Hanya bisa via wp-4 atau wp-6) ---
      { id: 'wp4-D',    from: 'wp-4', to: 'D',    distance: 80 },
      { id: 'D-wp6',    from: 'D',    to: 'wp-6', distance: 70 }, // D menuju rute F

      // --- AKSES KE E (Via wp-5 atau wp-8) ---
      { id: 'wp5-E',    from: 'wp-5', to: 'E',    distance: 50 },
      { id: 'B-wp8',    from: 'B',    to: 'wp-8', distance: 40 },
      { id: 'wp8-E',    from: 'wp-8', to: 'E',    distance: 50 },

      // --- AREA KANAN / MENUJU F (Via wp-6, wp-7, wp-9) ---
      { id: 'wp5-wp6',  from: 'wp-5', to: 'wp-6', distance: 100 },
      { id: 'wp6-wp7',  from: 'wp-6', to: 'wp-7', distance: 150 },
      { id: 'wp7-F',    from: 'wp-7', to: 'F',    distance: 100 }, // Wajib masuk F lewat wp-7 jika dari bawah

      // --- JALUR UTARA BEBAS HAMBATAN (B -> E -> F via wp-8, wp-9) ---
      { id: 'wp8-wp9',  from: 'wp-8', to: 'wp-9', distance: 100 },
      { id: 'F-wp9',    from: 'F',    to: 'wp-9', distance: 110 }, // Masuk F dari atas
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
    title: 'Level 2: Analisis Rute (5 Rumah)',
    viewBox: '0 0 800 820',
    description: 'Wilayah pengantaran kini 5 rumah. Ada rumah di tengah yang bisa jadi jalan pintas — gunakan dengan cermat!',
    hints: 'Gunakan Rumah E di tengah sebagai penghubung yang cerdas untuk meminimalkan jarak tempuh.',
    startTimeString: '07:00',
    houses: [
      { id: 'Toko', name: 'Toko Roti🥖', x: 400, y: 440, color: '#f59e0b' },
      { id: 'A',    name: 'Rumah A🏠',   x: 200, y: 260, color: '#3b82f6' },
      { id: 'B',    name: 'Rumah B🏠',   x: 400, y: 80,  color: '#10b981' },
      { id: 'C',    name: 'Rumah C🏠',   x: 600, y: 260, color: '#8b5cf6' },
      { id: 'D',    name: 'Rumah D🏠',   x: 580, y: 370, color: '#ec4899' },
      { id: 'E',    name: 'Rumah E🏠',   x: 400, y: 10, color: '#06b6d4' },
    ],
    connections: [
      { id: 'Toko-D', from: 'Toko', to: 'D', distance: 4 },
      { id: 'Toko-E', from: 'Toko', to: 'E', distance: 4 },
      { id: 'A-B',    from: 'A',    to: 'B', distance: 3 },
      { id: 'A-E',    from: 'A',    to: 'E', distance: 4 },
      { id: 'B-C',    from: 'B',    to: 'C', distance: 3 },
      { id: 'C-D',    from: 'C',    to: 'D', distance: 3 },
      { id: 'A-D',    from: 'A',    to: 'D', distance: 5 },
      { id: 'B-E',    from: 'B',    to: 'E', distance: 5 },
      { id: 'C-E',    from: 'C',    to: 'E', distance: 5 },
    ],
    ctExplanation: {
      decomposition: 'Memetakan tiap rumah sebagai simpul (node) dan jalan sebagai sisi (edge), mengubah masalah pengiriman menjadi masalah grafik terhubung.',
      patternRecognition: 'Rumah E di tengah bisa memotong jarak secara signifikan dibanding mengitari seluruh pinggir diamond.',
      abstraction: 'Membayangkan peta sebagai diagram berbobot sederhana di mana bobot adalah jarak dalam meter.',
      algorithm: 'Bandingkan rute luar penuh vs rute shortcut melalui E untuk menemukan total m terkecil.',
    },
  },
  {
    // ─── LEVEL 3 ─── diamond ganda / hexagon (6 outer + 2 inner)
    //
    //              C(400,80)
    //             / \
    //         B(250,180)   D(550,180)
    //        /     \ /      \
    //    A(120,260) G(340,260) H(460,260) E(680,260)
    //        \     / \      /
    //         ──(250,340)  (550,340)
    //             \         /
    //            Toko(400,430)   F(550,340)
    //
    id: 3,
    title: 'Level 3: Labirin Rute Kompleks (8 Rumah)',
    description: 'Ada 8 rumah di komplek perumahan. Temukan rute terpendek yang mengunjungi semua rumah!',
    hints: 'Gunakan jalan dalam komplek (G dan H) sebagai penghubung pintas antara sisi kiri dan kanan.',
    startTimeString: '07:00',
    houses: [
      { id: 'Toko', name: 'Toko Roti🥖', x: 400, y: 430, color: '#f59e0b' },
      { id: 'A',    name: 'Rumah A🏠',   x: 120, y: 260, color: '#3b82f6' },
      { id: 'B',    name: 'Rumah B🏠',   x: 250, y: 150, color: '#10b981' },
      { id: 'C',    name: 'Rumah C🏠',   x: 400, y: 80,  color: '#8b5cf6' },
      { id: 'D',    name: 'Rumah D🏠',   x: 550, y: 150, color: '#ec4899' },
      { id: 'E',    name: 'Rumah E🏠',   x: 680, y: 260, color: '#f43f5e' },
      { id: 'F',    name: 'Rumah F🏠',   x: 550, y: 340, color: '#eab308' },
      { id: 'G',    name: 'Rumah G🏠',   x: 310, y: 260, color: '#06b6d4' },
      { id: 'H',    name: 'Rumah H🏠',   x: 490, y: 260, color: '#14b8a6' },
    ],
    connections: [
      { id: 'Toko-A',  from: 'Toko', to: 'A', distance: 3 },
      { id: 'Toko-F',  from: 'Toko', to: 'F', distance: 3 },
      { id: 'Toko-G',  from: 'Toko', to: 'G', distance: 4 },
      { id: 'Toko-H',  from: 'Toko', to: 'H', distance: 4 },
      { id: 'A-B',     from: 'A',    to: 'B', distance: 3 },
      { id: 'A-G',     from: 'A',    to: 'G', distance: 3 },
      { id: 'B-C',     from: 'B',    to: 'C', distance: 3 },
      { id: 'B-G',     from: 'B',    to: 'G', distance: 3 },
      { id: 'C-D',     from: 'C',    to: 'D', distance: 3 },
      { id: 'C-H',     from: 'C',    to: 'H', distance: 3 },
      { id: 'D-E',     from: 'D',    to: 'E', distance: 3 },
      { id: 'D-H',     from: 'D',    to: 'H', distance: 3 },
      { id: 'E-F',     from: 'E',    to: 'F', distance: 3 },
      { id: 'F-H',     from: 'F',    to: 'H', distance: 3 },
      { id: 'G-H',     from: 'G',    to: 'H', distance: 3 },
    ],
    ctExplanation: {
      decomposition: 'Membagi jalanan komplek menjadi 2 ring: Ring Luar (A,B,C,D,E,F) dan Ring Dalam (G,H).',
      patternRecognition: 'Jalan inner G-H memperbolehkan kita berpindah dari sisi kiri ke kanan tanpa mengitari seluruh outer ring.',
      abstraction: 'Menyederhanakan belokan jalan asli komplek menjadi garis-garis diagonal.',
      algorithm: 'Susun urutan kunjungan yang meminimalkan backtrack — manfaatkan G dan H sebagai shortcut.',
    },
  },
  {
    // ─── LEVEL 4 ─── diamond + tengah, 1 jalan diblokir
    //
    //           B(400,80)
    //          / ✕ \        (B-C diblokir)
    //      A(220,260) C(580,260)
    //          \ | /
    //           E(400,260)  ← tengah
    //          / \
    //      ──(220,430)  D(580,430)
    //         Toko(400,430)
    //
    id: 4,
    title: 'Level 4: Penutupan Jalan Darurat! (🚧)',
    description: 'Pagi ini ada perbaikan jalan! Jalan B-C ditutup 🚧. Cari jalur alternatif agar semua pesanan tetap sampai.',
    hints: 'Rumah E di tengah adalah satu-satunya penghubung antara sisi kiri (A,B) dan kanan (C,D). Lewati E!',
    startTimeString: '07:00',
    houses: [
      { id: 'Toko', name: 'Toko Roti',  x: 400, y: 430, color: '#f59e0b' },
      { id: 'A',    name: 'Rumah A',    x: 160, y: 300, color: '#3b82f6' },
      { id: 'B',    name: 'Rumah B',    x: 310, y: 130, color: '#10b981' },
      { id: 'C',    name: 'Rumah C',    x: 490, y: 130, color: '#8b5cf6' },
      { id: 'D',    name: 'Rumah D',    x: 640, y: 300, color: '#ec4899' },
      { id: 'E',    name: 'Rumah E',    x: 400, y: 260, color: '#06b6d4' },
    ],
    connections: [
      { id: 'Toko-A', from: 'Toko', to: 'A', distance: 4 },
      { id: 'Toko-D', from: 'Toko', to: 'D', distance: 4 },
      { id: 'Toko-E', from: 'Toko', to: 'E', distance: 3 },
      { id: 'A-B',    from: 'A',    to: 'B', distance: 3 },
      { id: 'A-E',    from: 'A',    to: 'E', distance: 3 },
      { id: 'C-D',    from: 'C',    to: 'D', distance: 3 },
      { id: 'D-E',    from: 'D',    to: 'E', distance: 3 },
      { id: 'B-E',    from: 'B',    to: 'E', distance: 3 },
      { id: 'C-E',    from: 'C',    to: 'E', distance: 3 },
      { id: 'B-C',    from: 'B',    to: 'C', distance: 5, isBlockedByLevel: true },
    ],
    ctExplanation: {
      decomposition: 'Menghapus opsi rute B-C dari daftar jalan valid karena sedang diperbaiki.',
      patternRecognition: 'Rumah E (tengah) kini wajib menjadi jembatan penghubung antara sisi kiri (A,B) dan kanan (C,D).',
      abstraction: 'Fokus pada kondisi jalan (Terbuka/Ditutup) bukan fisik pembatas konstruksi.',
      algorithm: 'Terapkan Detour Algorithm: lewati E sebagai titik transit wajib pengganti jalur B-C yang diblokir.',
    },
  },
  {
    // ─── LEVEL 5 ─── diamond besar 5 sudut + 1 tengah + constraint
    //
    //              C(400,80)
    //             / \
    //         B(250,180)   D(550,180)
    //        /      \  /      \
    //    A(120,300)  F(400,260) E(680,300)
    //        \                  /
    //              Toko(400,430)
    //
    id: 5,
    title: 'Level 5: Efisiensi Maksimal (Ujian Logistik)',
    description: 'Ujian kurir profesional! Kirimkan roti ke seluruh rumah warga dengan rute terpendek!',
    hints: 'Gunakan node F di tengah sebagai shortcut. Rencanakan rute perjalanan seefisien mungkin.',
    houses: [
      { id: 'Toko', name: 'Toko Roti', x: 400, y: 430, color: '#f59e0b' },
      { id: 'A',    name: 'Rumah A',   x: 120, y: 300, color: '#3b82f6' },
      { id: 'B',    name: 'Rumah B',   x: 250, y: 150, color: '#10b981' },
      { id: 'C',    name: 'Rumah C',   x: 400, y: 80,  color: '#8b5cf6' },
      { id: 'D',    name: 'Rumah D',   x: 550, y: 150, color: '#ec4899' },
      { id: 'E',    name: 'Rumah E',   x: 680, y: 300, color: '#06b6d4' },
      { id: 'F',    name: 'Rumah F',   x: 400, y: 260, color: '#a78bfa' },
    ],
    connections: [
      { id: 'Toko-A', from: 'Toko', to: 'A', distance: 4 },
      { id: 'Toko-E', from: 'Toko', to: 'E', distance: 4 },
      { id: 'Toko-F', from: 'Toko', to: 'F', distance: 3 },
      { id: 'A-B',    from: 'A',    to: 'B', distance: 3 },
      { id: 'A-F',    from: 'A',    to: 'F', distance: 4 },
      { id: 'B-C',    from: 'B',    to: 'C', distance: 3 },
      { id: 'B-F',    from: 'B',    to: 'F', distance: 3 },
      { id: 'C-D',    from: 'C',    to: 'D', distance: 3 },
      { id: 'C-F',    from: 'C',    to: 'F', distance: 3 },
      { id: 'D-E',    from: 'D',    to: 'E', distance: 3 },
      { id: 'D-F',    from: 'D',    to: 'F', distance: 3 },
      { id: 'E-F',    from: 'E',    to: 'F', distance: 4 },
    ],
    ctExplanation: {
      decomposition: 'Pecah masalah besar menjadi pencarian rute terpendek untuk seluruh rumah warga.',
      patternRecognition: 'Rute terpendek m dicapai dengan membandingkan jalan memutar vs shortcut via F di tengah.',
      abstraction: 'Sederhanakan peta dengan memfokuskan pencarian pada rute terpendek dalam meter.',
      algorithm: 'Constraint Optimization: cari rute dengan total m sekecil mungkin.',
    },
  },
];
