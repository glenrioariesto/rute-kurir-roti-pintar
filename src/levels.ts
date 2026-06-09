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
    title: 'Level 1: Dasar Urutan (3 Rumah)',
    viewBox: '0 0 800 520',
    linear: true,
    description: 'Setiap pagi kurir roti mengantarkan pesanan ke 3 rumah warga. Temukan rute yang mengunjungi semua rumah dan kembali ke Toko Roti dengan rute terpendek!',
    hints: 'Cobalah untuk mengunjungi rumah yang bersebelahan secara berurutan dan jangan melompati rumah yang terlalu jauh.',
    startTimeString: '07:00',
    houses: [
      { id: 'Toko', name: 'Toko Roti🥖', x: 80, y: 380, color: '#f59e0b' },
      { id: 'A',    name: 'Rumah A🏠',   x: 280, y: 260, color: '#3b82f6' },
      { id: 'belok-1',    name: 'belok-1',   x: 440, y: 170,  color: '#10b981', isWaypoint: true },
      { id: 'B',    name: 'Rumah B🏠',   x: 610, y: 260,  color: '#10b981' },

    ],
    connections: [
      { id: 'Toko-A', from: 'Toko', to: 'A', distance: 5 },
      { id: 'A-belok-1',    from: 'A',    to: 'belok-1', distance: 4 },
      { id: 'belok-1-B',    from: 'belok-1',    to: 'B', distance: 4 },

    ],
    ctExplanation: {
      decomposition: 'Masalah "antar semua roti" dipecah menjadi sub-masalah kecil: (1) Jalan ke Rumah A, (2) Lanjut ke B, (3) Lanjut ke C, (4) Kembali ke Toko.',
      patternRecognition: 'Mengenali pola bahwa rute melingkar (Toko ➔ A ➔ B ➔ C ➔ Toko) jauh lebih efisien dibanding bolak-balik melintasi jalan yang sama.',
      abstraction: 'Mengabaikan detail bentuk rumah, warna cat, atau pepohonan, dan hanya fokus pada angka jarak (kilometer) antar titik simpul rute.',
      algorithm: 'Menyusun langkah terurut: Toko Roti ➔ Rumah A (5km) ➔ Rumah B (4km) ➔ Rumah C (4km) ➔ Toko Roti (5km).',
    },
  },
  {
    // ─── LEVEL 2 ─── diamond 3 rumah + 2 ekstra
    //
    //        B(400,80)
    //       / \
    //    A(200,260)   C(600,260)
    //       \ /
    //      Toko(400,440)
    //
    // D dan E mengikuti pola diagonal step x=200, step y=180
    //
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
      abstraction: 'Membayangkan peta sebagai diagram berbobot sederhana di mana bobot adalah jarak dalam kilometer.',
      algorithm: 'Bandingkan rute luar penuh vs rute shortcut melalui E untuk menemukan total km terkecil.',
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
    title: 'Level 5: Batas Waktu & Bensin (Ujian Logistik)',
    description: 'Ujian kurir profesional! Roti harus dikirim sebelum jam 08:00 (batas 60 menit) dan bensin max 24 km. Rencanakan rute seefisien mungkin!',
    hints: 'Gunakan node F di tengah sebagai shortcut. Hindari rute memutar yang menghabiskan bensin berlebih.',
    maxFuel: 24,
    timeLimitMinutes: 60,
    startTimeString: '07:00',
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
      decomposition: 'Hitung dua cost sekaligus: cost Jarak (bensin) dan cost Waktu (durasi perjalanan).',
      patternRecognition: 'Rute terpendek km belum tentu yang tercepat — pertimbangkan shortcut via F di tengah.',
      abstraction: 'Sederhanakan constraint menjadi dua angka batas: distance ≤ 24km dan time ≤ 60 menit.',
      algorithm: 'Constraint Optimization: cari rute yang memenuhi KEDUA batasan sekaligus dengan total km sekecil mungkin.',
    },
  },
];
