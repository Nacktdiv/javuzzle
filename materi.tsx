import { ImageSourcePropType } from 'react-native';

export type TilesType = {
  nama: string;
  image: any;
};

export type ComponentType = {
  urutan: number;
  nama: string;
  image: ImageSourcePropType;
};

export type ContohType = {
  kata: string;
  arti: string;
  audio?: any; // Aset audio dari require()
};

export type MateriType = {
  id: string;
  aksara: ImageSourcePropType;
  latin: string;
  deskripsi: string;
  audioAksara?: any; // Aset audio pengucapan aksara/sandhangan
  contoh: ContohType[];
  komponen: ComponentType[];
};

export const komponenAksara = [
  { nama: "3_reverse", image: require('') },
  { nama: "5", image: require('') },
  { nama: "cucuk", image: require('') },
  { nama: "down_n", image: require('') },
  { nama: "K", image: require('') },
  { nama: "m", image: require('') },
  { nama: "n_down", image: require('') },
  { nama: "n_nyantik", image: require('') },
  { nama: "n_waw", image: require('') },
  { nama: "n", image: require('') },
  { nama: "nyantik", image: require('') },
  { nama: "payung_m", image: require('') },
  { nama: "pepet", image: require('') },
  { nama: "suku", image: require('') },
  { nama: "taling_tarung", image: require('') },
  { nama: "taling", image: require('') },
  { nama: "up_n", image: require('') },
  { nama: "wulu", image: require('') }
];

export const MATERI_AKSARA: MateriType[] = [
  {
    id: '1',
    aksara: require(''),
    latin: 'Ha',
    deskripsi: 'Aksara Ha merupakan aksara pertama yang melambangkan bunyi "ha" atau "a".',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦲꦤ (Ana)', arti: 'Ada', audio: require('') },
      { kata: 'ꦲꦠꦶ (Ati)', arti: 'Hati', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('') },
      { urutan: 2, nama: 'm', image: require('') }
    ] 
  },
  {
    id: '2',
    aksara: require(''),
    latin: 'Na',
    deskripsi: 'Aksara Na melambangkan fonem dental nasal /n/.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦦꦤ (Nawa)', arti: 'Sembilan', audio: require('') },
      { kata: 'ꦤꦩ (Nama)', arti: 'Nama', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('') },
      { urutan: 2, nama: 'up_n', image: require('') }
    ] 
  },
  {
    id: '3',
    aksara: require(''),
    latin: 'Ca',
    deskripsi: 'Aksara Ca melambangkan fonem palatal afrikat /c/.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦧꦕ (Baca)', arti: 'Membaca', audio: require('') },
      { kata: 'ꦣꦕ (Cacing)', arti: 'Cacing', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'n_down', image: require('') },
      { urutan: 2, nama: 'cucuk', image: require('') }
    ] 
  },
  {
    id: '4',
    aksara: require(''),
    latin: 'Ra',
    deskripsi: 'Aksara Ra melambangkan fonem alveolar trill /r/.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦫꦱ (Rasa)', arti: 'Rasa', audio: require('') },
      { kata: 'ꦫꦠꦸ (Ratu)', arti: 'Raja / Ratu', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('') }
    ] 
  },
  {
    id: '5',
    aksara: require(''),
    latin: 'Ka',
    deskripsi: 'Aksara Ka melambangkan fonem velar plosif /k/.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦏꦭ (Kala)', arti: 'Waktu / Ketika', audio: require('') },
      { kata: 'ꦏꦪ (Kaya)', arti: 'Kaya / Seperti', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('') },
      { urutan: 2, nama: 'up_n', image: require('') },
      { urutan: 3, nama: 'n', image: require('') }
    ] 
  },
  {
    id: '6',
    aksara: require(''),
    latin: 'Da',
    deskripsi: 'Aksara Da melambangkan fonem dental plosif /d/ (berbeda tipis dengan Dha).',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦢꦢꦶ (Dadi)', arti: 'Jadi', audio: require('') },
      { kata: 'ꦢꦺꦮ (Dewa)', arti: 'Dewa', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('') },
      { urutan: 2, nama: 'down_n', image: require('') }
    ] 
  },
  {
    id: '7',
    aksara: require(''),
    latin: 'Ta',
    deskripsi: 'Aksara Ta melambangkan fonem dental plosif tanpa suara /t/.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦠꦸꦏꦸ (Tuku)', arti: 'Beli', audio: require('') },
      { kata: 'ꦠꦠ (Tata)', arti: 'Atur / Tertib', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('') },
      { urutan: 2, nama: '5', image: require('') },
      { urutan: 3, nama: 'n', image: require('') }
    ] 
  },
  {
    id: '8',
    aksara: require(''),
    latin: 'Sa',
    deskripsi: 'Aksara Sa melambangkan fonem alveolar frikatif /s/.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦱꦥ (Sapa)', arti: 'Siapa', audio: require('') },
      { kata: 'ꦱꦠꦺ (Sate)', arti: 'Sate', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'n_down', image: require('') },
      { urutan: 2, nama: 'n', image: require('') }
    ] 
  },
  {
    id: '9',
    aksara: require(''),
    latin: 'Wa',
    deskripsi: 'Aksara Wa melambangkan fonem labio-velar aproksiman /w/.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦯꦤ (Wana)', arti: 'Hutan', audio: require('') },
      { kata: 'ꦮꦠꦸ (Watu)', arti: 'Batu', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('') },
      { urutan: 2, nama: 'cucuk', image: require('') }
    ] 
  },
  {
    id: '10',
    aksara: require(''),
    latin: 'La',
    deskripsi: 'Aksara La melambangkan fonem alveolar lateral aproksiman /l/.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦭꦭꦶ (Lali)', arti: 'Lupa', audio: require('') },
      { kata: 'ꦭꦫ (Lara)', arti: 'Sakit', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'm', image: require('') },
      { urutan: 2, nama: 'n', image: require('') }
    ] 
  },
  {
    id: '11',
    aksara: require(''),
    latin: 'Pa',
    deskripsi: 'Aksara Pa melambangkan fonem bilabial plosif tanpa suara /p/.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦥꦥꦤ꧀ (Papan)', arti: 'Tempat', audio: require('') },
      { kata: 'ꦥꦱꦂ (Pasar)', arti: 'Pasar', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('') },
      { urutan: 2, nama: 'n', image: require('') }
    ] 
  },
  {
    id: '12',
    aksara: require(''),
    latin: 'Dha',
    deskripsi: 'Aksara Dha melambangkan fonem retrofleks plosif /ɖ/ (posisi lidah menekuk ke langit-langit).',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦦꦲꦂ (Dhahar)', arti: 'Makan (halus)', audio: require('') },
      { kata: 'ꦦꦺꦮꦺ (Dhewe)', arti: 'Sendiri', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('') },
      { urutan: 2, nama: 'nyantik', image: require('') },
      { urutan: 3, nama: 'cucuk', image: require('') }
    ] 
  },
  {
    id: '13',
    aksara: require(''),
    latin: 'Ja',
    deskripsi: 'Aksara Ja melambangkan fonem palatal afrikat bersuara /ɟ/.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦗꦩꦸ (Jamu)', arti: 'Jamu', audio: require('') },
      { kata: 'ꦗꦭ (Jala)', arti: 'Jaring / Jala', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('') },
      { urutan: 2, nama: 'K', image: require('') }
    ]
  },
  {
    id: '14',
    aksara: require(''),
    latin: 'Ya',
    deskripsi: 'Aksara Ya melambangkan fonem palatal aproksiman /j/.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦪꦏꦶꦤ꧀ (Yakin)', arti: 'Percaya / Yakin', audio: require('') },
      { kata: 'ꦪꦪꦠ꧀ (Yayat)', arti: 'Nama orang / Julukan', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('') },
      { urutan: 2, nama: 'n', image: require('') },
      { urutan: 3, nama: 'n', image: require('') }
    ] 
  },
  {
    id: '15',
    aksara: require(''),
    latin: 'Nya',
    deskripsi: 'Aksara Nya melambangkan fonem palatal nasal /ɲ/.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦚꦠ (Nyata)', arti: 'Terbukti / Nyata', audio: require('') },
      { kata: 'ꦚꦩꦸꦏ꧀ (Nyamuk)', arti: 'Nyamuk', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'n_nyantik', image: require('') },
      { urutan: 2, nama: 'payung_m', image: require('') },
      { urutan: 3, nama: 'm', image: require('') }
    ]
  },
  {
    id: '16',
    aksara: require(''),
    latin: 'Ma',
    deskripsi: 'Aksara Ma melambangkan fonem bilabial nasal /m/.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦩꦠꦠ (Mata)', arti: 'Mata', audio: require('') },
      { kata: 'ꦩꦕꦤ꧀ (Macan)', arti: 'Harimau', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: '3_reverse', image: require('') },
      { urutan: 2, nama: 'n', image: require('') }
    ] 
  },
  {
    id: '17',
    aksara: require(''),
    latin: 'Ga',
    deskripsi: 'Aksara Ga melambangkan fonem velar plosif bersuara /g/.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦓꦭ (Gajah)', arti: 'Gajah', audio: require('') },
      { kata: 'ꦭꦒꦸ (Lagu)', arti: 'Nyanyian / Lagu', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'm', image: require('') }
    ] 
  },
  {
    id: '18',
    aksara: require(''),
    latin: 'Ba',
    deskripsi: 'Aksara Ba melambangkan fonem bilabial plosif bersuara /b/.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦧꦭ (Bala)', arti: 'Teman / Pasukan', audio: require('') },
      { kata: 'ꦧꦠꦶ (Bati)', arti: 'Untung', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'n_nyantik', image: require('') },
      { urutan: 2, nama: 'payung_m', image: require('') },
      { urutan: 3, nama: 'n', image: require('') }
    ] 
  },
  {
    id: '19',
    aksara: require(''),
    latin: 'Tha',
    deskripsi: 'Aksara Tha melambangkan fonem retrofleks plosif tanpa suara /ʈ/.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦛꦺꦛꦺꦏ꧀ (Thuthuk)', arti: 'Pukul', audio: require('') },
      { kata: 'ꦛꦶꦛꦶꦏ꧀ (Thithik)', arti: 'Sedikit', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'n_waw', image: require('') },
      { urutan: 2, nama: 'payung_m', image: require('') }
    ] 
  },
  {
    id: '20',
    aksara: require(''),
    latin: 'Nga',
    deskripsi: 'Aksara Nga melambangkan fonem velar nasal /ŋ/.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦔꦥꦶ (Ngopi)', arti: 'Minum Kopi', audio: require('') },
      { kata: 'ꦔꦭꦩ꧀ (Ngalam)', arti: 'Alam / Dunia', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'n_nyantik', image: require('') },
      { urutan: 2, nama: 'payung_m', image: require('') }
    ] 
  }
];

export const MATERI_SANDHANGAN: MateriType[] = [
  {
    id: '21',
    aksara: require(''),
    latin: 'i',
    deskripsi: 'Sandhangan Wulu digunakake kanggo ngowahi swara dhasar (a) dadi swara (i). Ditulis ing ndhuwur pungkasan aksara.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦔꦥꦶ (Ngopi)', arti: 'Minum Kopi', audio: require('') },
      { kata: 'ꦱꦶꦠꦶ (Siti)', arti: 'Tanah / Nama orang', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'aksara_ga', image: require('') },
      { urutan: 2, nama: 'wulu', image: require('') }
    ] 
  },
  {
    id: '22',
    aksara: require(''),
    latin: 'ê',
    deskripsi: 'Sandhangan Pepet digunakake kanggo ngowahi swara dhasar dadi swara ê (kaya ing tembung "sega" utawa "lemah"). Ditulis ing ndhuwur aksara.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦱꦼꦒ (Sega)', arti: 'Nasi', audio: require('') },
      { kata: 'ꦊꦩꦃ (Lemah)', arti: 'Tanah', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'aksara_ga', image: require('') },
      { urutan: 2, nama: 'pepet', image: require('') }
    ] 
  },
  {
    id: '23',
    aksara: require(''),
    latin: 'e',
    deskripsi: 'Sandhangan Taling digunakake kanggo ngowahi swara dhasar dadi swara é (kaya "sate") utawa è (kaya "bebek"). Ditulis ing ngarepe (sebelah kiwa) aksara.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦥꦱꦠꦺ (Sate)', arti: 'Sate', audio: require('') },
      { kata: 'ꦭꦺꦭꦺ (Lele)', arti: 'Ikan Lele', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'aksara_na', image: require('') },
      { urutan: 2, nama: 'taling', image: require('') }
    ] 
  },
  {
    id: '24',
    aksara: require(''),
    latin: 'o',
    deskripsi: 'Sandhangan Taling Tarung digunakake kanggo ngowahi swara dhasar dadi swara (o). Aksarane dijepit ing tengah-tengah antarane taling lan tarung.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦭꦯꦺꦴꦏꦺꦴ (Loro)', arti: 'Dua / Sakit', audio: require('') },
      { kata: 'ꦠꦺꦴꦏꦺꦴ (Toko)', arti: 'Toko', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'aksara_na', image: require('') },
      { urutan: 2, nama: 'taling_tarung', image: require('') }
    ] 
  },
  {
    id: '25',
    aksara: require(''),
    latin: 'u',
    deskripsi: 'Sandhangan Suku digunakake kanggo ngowahi swara dhasar dadi swara (u). Ditulis nggandheng ing ngisor buri aksara.',
    audioAksara: require(''),
    contoh: [
      { kata: 'ꦠꦸꦏꦸ (Tuku)', arti: 'Beli', audio: require('') },
      { kata: 'ꦧꦸꦏꦸ (Buku)', arti: 'Buku', audio: require('') }
    ],
    komponen: [
      { urutan: 1, nama: 'aksara_ga', image: require('') },
      { urutan: 2, nama: 'suku', image: require('') }
    ] 
  }
];

export const MATERI_GABUNGAN: MateriType[] = [
  ...MATERI_AKSARA,
  ...MATERI_SANDHANGAN
];