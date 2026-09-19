// Map static audio assets
const getSoalAudio = (levelId: number) => {
  const audioMap: { [key: number]: any } = {
    1: require('@/assets/audio/audio_soal/level1.mp3'),
    2: require('@/assets/audio/audio_soal/level2.mp3'),
    3: require('@/assets/audio/audio_soal/level3.mp3'),
    4: require('@/assets/audio/audio_soal/level4.mp3'),
    5: require('@/assets/audio/audio_soal/level5.mp3'),
    6: require('@/assets/audio/audio_soal/level6.mp3'),
    7: require('@/assets/audio/audio_soal/level7.mp3'),
    8: require('@/assets/audio/audio_soal/level8.mp3'),
    9: require('@/assets/audio/audio_soal/level9.mp3'),
    10: require('@/assets/audio/audio_soal/level10.mp3'),
    11: require('@/assets/audio/audio_soal/level11.mp3'),
    12: require('@/assets/audio/audio_soal/level12.mp3'),
    13: require('@/assets/audio/audio_soal/level13.mp3'),
    14: require('@/assets/audio/audio_soal/level14.mp3'),
    15: require('@/assets/audio/audio_soal/level15.mp3'),
    16: require('@/assets/audio/audio_soal/level16.mp3'),
    17: require('@/assets/audio/audio_soal/level17.mp3'),
    18: require('@/assets/audio/audio_soal/level18.mp3'),
    19: require('@/assets/audio/audio_soal/level19.mp3'),
    20: require('@/assets/audio/audio_soal/level20.mp3'),
    21: require('@/assets/audio/audio_soal/level21.mp3'),
    22: require('@/assets/audio/audio_soal/level22.mp3'),
    23: require('@/assets/audio/audio_soal/level23.mp3'),
    24: require('@/assets/audio/audio_soal/level24.mp3'),
    25: require('@/assets/audio/audio_soal/level25.mp3'),
    26: require('@/assets/audio/audio_soal/level26.mp3'),
    27: require('@/assets/audio/audio_soal/level27.mp3'),
    28: require('@/assets/audio/audio_soal/level28.mp3'),
    29: require('@/assets/audio/audio_soal/level29.mp3'),
    30: require('@/assets/audio/audio_soal/level30.mp3'),
    31: require('@/assets/audio/audio_soal/level31.mp3'),
    32: require('@/assets/audio/audio_soal/level32.mp3'),
    33: require('@/assets/audio/audio_soal/level33.mp3'),
    34: require('@/assets/audio/audio_soal/level34.mp3'),
    35: require('@/assets/audio/audio_soal/level35.mp3'),
    36: require('@/assets/audio/audio_soal/level36.mp3'),
    37: require('@/assets/audio/audio_soal/level37.mp3'),
    38: require('@/assets/audio/audio_soal/level38.mp3'),
    39: require('@/assets/audio/audio_soal/level39.mp3'),
    40: require('@/assets/audio/audio_soal/level40.mp3'),
    41: require('@/assets/audio/audio_soal/level41.mp3'),
    42: require('@/assets/audio/audio_soal/level42.mp3'),
    43: require('@/assets/audio/audio_soal/level43.mp3'),
    44: require('@/assets/audio/audio_soal/level44.mp3'),
    45: require('@/assets/audio/audio_soal/level45.mp3'),
    46: require('@/assets/audio/audio_soal/level46.mp3'),
    47: require('@/assets/audio/audio_soal/level47.mp3'),
    48: require('@/assets/audio/audio_soal/level48.mp3'),
    49: require('@/assets/audio/audio_soal/level49.mp3'),
    50: require('@/assets/audio/audio_soal/level50.mp3'),
  };
  return audioMap[levelId];
};

// Raw Data
const rawDataLevel = [
  {
    bagianId: 1,
    namaBagian: "Dasar-Dasar Aksara Nglegena",
    units: [
      {
        unitId: 1,
        namaUnit: "Aksara Dasar (Vokal A)",
        levels: [
          { id: 1, level: 1, title: 'Mengenal \'Dada\'', type: 'canvas', question: 'Dada', poin: 100 },
          { id: 2, level: 2, title: 'Kata Benda Dasar', type: 'puzzle', question: 'Kaca', poin: 110 },
          { id: 3, level: 3, title: 'Nama Orang', type: 'puzzle', question: 'Rara', poin: 120 },
          { id: 4, level: 4, title: 'Sebutan Keluarga', type: 'canvas', question: 'Bapa', poin: 130 },
          { id: 5, level: 5, title: 'Frasa Nglegena', type: 'puzzle', question: 'Jaka Maca', poin: 140 }
        ]
      },
      {
        unitId: 2,
        namaUnit: "Sandhangan Wulu & Suku",
        levels: [
          { id: 6, level: 6, title: 'Mengenal Wulu (i)', type: 'canvas', question: 'Siti', poin: 150 },
          { id: 7, level: 7, title: 'Mengenal Suku (u)', type: 'puzzle', question: 'Buku', poin: 160 },
          { id: 8, level: 8, title: 'Kombinasi Angka', type: 'canvas', question: 'Siji', poin: 170 },
          { id: 9, level: 9, title: 'Kata Kerja Sederhana', type: 'puzzle', question: 'Tuku', poin: 180 },
          { id: 10, level: 10, title: 'Kalimat Unit 2', type: 'puzzle', question: 'Siti Tuku Buku', poin: 190 }
        ]
      }
    ]
  },
  {
    bagianId: 2,
    namaBagian: "Eksplorasi Vokal Lanjutan",
    units: [
      {
        unitId: 3,
        namaUnit: "Sandhangan Taling & Taling Tarung",
        levels: [
          { id: 11, level: 11, title: 'Mengenal Taling (e/è)', type: 'canvas', question: 'Sore', poin: 200 },
          { id: 12, level: 12, title: 'Taling Tarung (o)', type: 'puzzle', question: 'Soto', poin: 210 },
          { id: 13, level: 13, title: 'Hewan Vokal O', type: 'canvas', question: 'Kêbo', poin: 220 },
          { id: 14, level: 14, title: 'Hewan Vokal E', type: 'puzzle', question: 'Lele', poin: 230 },
          { id: 15, level: 15, title: 'Evaluasi Vokal O/E', type: 'puzzle', question: 'Rene Tuku Soto', poin: 240 }
        ]
      },
      {
        unitId: 4,
        namaUnit: "Sandhangan Pêpêt (ê)",
        levels: [
          { id: 16, level: 16, title: 'Mengenal Pêpêt', type: 'canvas', question: 'Sêga', poin: 250 },
          { id: 17, level: 17, title: 'Kombinasi Tiga Suku Kata', type: 'puzzle', question: 'Sêpeda', poin: 260 },
          { id: 18, level: 18, title: 'Kata Kerja Pêpêt', type: 'canvas', question: 'Têka', poin: 270 },
          { id: 19, level: 19, title: 'Kondisi Alam', type: 'puzzle', question: 'Mêga', poin: 280 },
          { id: 20, level: 20, title: 'Kalimat Campuran Vokal', type: 'puzzle', question: 'Bapa Têka Sore', poin: 290 }
        ]
      }
    ]
  },
  {
    bagianId: 3,
    namaBagian: "Merangkai Objek dan Alam",
    units: [
      {
        unitId: 5,
        namaUnit: "Benda di Sekitar",
        levels: [
          { id: 21, level: 21, title: 'Benda Ruangan', type: 'canvas', question: 'Meja', poin: 300 },
          { id: 22, level: 22, title: 'Wadah Simpan', type: 'puzzle', question: 'Pêti', poin: 310 },
          { id: 23, level: 23, title: 'Pakaian', type: 'canvas', question: 'Topi', poin: 320 },
          { id: 24, level: 24, title: 'Bahan Bangunan', type: 'puzzle', question: 'Bata', poin: 330 },
          { id: 25, level: 25, title: 'Aksi dan Benda', type: 'puzzle', question: 'Nata Bata', poin: 340 }
        ]
      },
      {
        unitId: 6,
        namaUnit: "Dunia Hewan",
        levels: [
          { id: 26, level: 26, title: 'Ternak', type: 'canvas', question: 'Sapi', poin: 350 },
          { id: 27, level: 27, title: 'Hewan Buas Air', type: 'puzzle', question: 'Baya', poin: 360 },
          { id: 28, level: 28, title: 'Raja Hutan', type: 'canvas', question: 'Singa', poin: 370 },
          { id: 29, level: 29, title: 'Kondisi Hewan', type: 'puzzle', question: 'Sapi Lêmu', poin: 380 },
          { id: 30, level: 30, title: 'Ujian Unit Hewan', type: 'puzzle', question: 'Baya Gêdi', poin: 390 }
        ]
      }
    ]
  },
  {
    bagianId: 4,
    namaBagian: "Dinamika Kata Kerja & Sifat",
    units: [
      {
        unitId: 7,
        namaUnit: "Kegiatan Sehari-hari",
        levels: [
          { id: 31, level: 31, title: 'Istirahat', type: 'canvas', question: 'Turu', poin: 400 },
          { id: 32, level: 32, title: 'Bepergian', type: 'puzzle', question: 'Lunga', poin: 410 },
          { id: 33, level: 33, title: 'Kegiatan Belajar', type: 'canvas', question: 'Maca', poin: 420 },
          { id: 34, level: 34, title: 'Kembali', type: 'puzzle', question: 'Bali', poin: 430 },
          { id: 35, level: 35, title: 'Frasa Tiga Kata', type: 'puzzle', question: 'Siti Lunga Ngaji', poin: 440 }
        ]
      },
      {
        unitId: 8,
        namaUnit: "Kata Sifat (Kahanan)",
        levels: [
          { id: 36, level: 36, title: 'Sifat Fisik 1', type: 'canvas', question: 'Lêmu', poin: 450 },
          { id: 37, level: 37, title: 'Ukuran', type: 'puzzle', question: 'Gêdi', poin: 460 },
          { id: 38, level: 38, title: 'Waktu', type: 'canvas', question: 'Suwe', poin: 470 },
          { id: 39, level: 39, title: 'Sifat Fisik 2', type: 'puzzle', question: 'Kuru', poin: 480 },
          { id: 40, level: 40, title: 'Penggabungan Kahanan', type: 'puzzle', question: 'Kêbo Kuru Suwe', poin: 490 }
        ]
      }
    ]
  },
  {
    bagianId: 5,
    namaBagian: "Penguasaan Kalimat Penuh",
    units: [
      {
        unitId: 9,
        namaUnit: "Menyusun Cerita Pendek",
        levels: [
          { id: 41, level: 41, title: 'Aktivitas Ibu', type: 'canvas', question: 'Ibu Tuku Jamu', poin: 500 },
          { id: 42, level: 42, title: 'Aktivitas Bapak', type: 'puzzle', question: 'Bapa Maca Buku', poin: 510 },
          { id: 43, level: 43, title: 'Kejadian', type: 'canvas', question: 'Jaka Tiba Loro', poin: 520 },
          { id: 44, level: 44, title: 'Tugas Rumah', type: 'puzzle', question: 'Siti Nyapu Watu', poin: 530 },
          { id: 45, level: 45, title: 'Keterangan Waktu', type: 'puzzle', question: 'Rara Bali Sore', poin: 540 }
        ]
      },
      {
        unitId: 10,
        namaUnit: "Tantangan Maestro Aksara",
        levels: [
          { id: 46, level: 46, title: 'Kalimat Indikator', type: 'canvas', question: 'Dina Iki Sida', poin: 550 },
          { id: 47, level: 47, title: 'Nama Kota', type: 'puzzle', question: 'Sura Baya Gêdi', poin: 560 },
          { id: 48, level: 48, title: 'Kalimat Petunjuk', type: 'canvas', question: 'Kene Ana Kêbo', poin: 570 },
          { id: 49, level: 49, title: 'Perumpamaan Alam', type: 'puzzle', question: 'Bumi Kene Kaya Sagara', poin: 580 },
          { id: 50, level: 50, title: 'Ujian Akhir Maestro', type: 'puzzle', question: 'Muga Muga Sida Beda', poin: 590 }
        ]
      }
    ]
  }
];

// Injeksi otomatis properti 'audio' ke setiap level
export const dataLevel = rawDataLevel.map((bagian) => ({
  ...bagian,
  units: bagian.units.map((unit) => ({
    ...unit,
    levels: unit.levels.map((lvl) => ({
      ...lvl,
      audio: getSoalAudio(lvl.id),
    })),
  })),
}));