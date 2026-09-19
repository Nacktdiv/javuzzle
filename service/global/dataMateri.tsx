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
  { nama: "3_reverse", image: require("@/assets/component/3_reverse.png") },
  { nama: "5", image: require("@/assets/component/5.png") },
  { nama: "cucuk", image: require("@/assets/component/cucuk.png") },
  { nama: "down_n", image: require("@/assets/component/down_n.png") },
  { nama: "K", image: require("@/assets/component/K.png") },
  { nama: "m", image: require("@/assets/component/m.png") },
  { nama: "n_down", image: require("@/assets/component/n_down.png") },
  { nama: "n_nyantik", image: require("@/assets/component/n_nyantik.png") },
  { nama: "n_waw", image: require("@/assets/component/n_waw.png") },
  { nama: "n", image: require("@/assets/component/n.png") },
  { nama: "nyantik", image: require("@/assets/component/nyantik.png") },
  { nama: "payung_m", image: require("@/assets/component/payung_m.png") },
  { nama: "pepet_c", image: require("@/assets/component/pepet_c.png") },
  { nama: "suku_c", image: require("@/assets/component/suku_c.png") },
  { nama: "tarung_c", image: require("@/assets/component/tarung_c.png") },
  { nama: "taling_c", image: require("@/assets/component/taling_c.png") },
  { nama: "up_n", image: require("@/assets/component/up_n.png") },
  { nama: "wulu_c", image: require("@/assets/component/wulu_c.png") }
];

export const MATERI_AKSARA: MateriType[] = [
  {
    id: '1',
    aksara: require('@/assets/aksara_jawa/ha.png'),
    latin: 'Ha',
    deskripsi: 'Aksara Ha merupakan aksara pertama yang melambangkan bunyi "ha" atau "a".',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/ha/aksara.mp3'),
    contoh: [
      { kata: 'ꦲꦤ (Ana)', arti: 'Ada', audio: require('@/assets/audio/output_audio/aksara_jawa/ha/contoh1_ana.mp3') },
      { kata: 'ꦲꦠꦶ (Ati)', arti: 'Hati', audio: require('@/assets/audio/output_audio/aksara_jawa/ha/contoh2_ati.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('@/assets/component/n.png') },
      { urutan: 2, nama: 'm', image: require('@/assets/component/m.png') }
    ] 
  },
  {
    id: '2',
    aksara: require('@/assets/aksara_jawa/na.png'),
    latin: 'Na',
    deskripsi: 'Aksara Na melambangkan fonem dental nasal /n/.',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/na/aksara.mp3'),
    contoh: [
      { kata: 'ꦦꦤ (Nawa)', arti: 'Sembilan', audio: require('@/assets/audio/output_audio/aksara_jawa/na/contoh1_nawa.mp3') },
      { kata: 'ꦤꦩ (Nama)', arti: 'Nama', audio: require('@/assets/audio/output_audio/aksara_jawa/na/contoh2_nama.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('@/assets/component/n.png') },
      { urutan: 2, nama: 'up_n', image: require('@/assets/component/up_n.png') }
    ] 
  },
  {
    id: '3',
    aksara: require('@/assets/aksara_jawa/ca.png'),
    latin: 'Ca',
    deskripsi: 'Aksara Ca melambangkan fonem palatal afrikat /c/.',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/ca/aksara.mp3'),
    contoh: [
      { kata: 'ꦧꦕ (Baca)', arti: 'Membaca', audio: require('@/assets/audio/output_audio/aksara_jawa/ca/contoh1_baca.mp3') },
      { kata: 'ꦣꦕ (Cacing)', arti: 'Cacing', audio: require('@/assets/audio/output_audio/aksara_jawa/ca/contoh2_cacing.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'n_down', image: require('@/assets/component/n_down.png') },
      { urutan: 2, nama: 'cucuk', image: require('@/assets/component/cucuk.png') }
    ] 
  },
  {
    id: '4',
    aksara: require('@/assets/aksara_jawa/ra.png'),
    latin: 'Ra',
    deskripsi: 'Aksara Ra melambangkan fonem alveolar trill /r/.',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/ra/aksara.mp3'),
    contoh: [
      { kata: 'ꦫꦱ (Rasa)', arti: 'Rasa', audio: require('@/assets/audio/output_audio/aksara_jawa/ra/contoh1_rasa.mp3') },
      { kata: 'ꦫꦠꦸ (Ratu)', arti: 'Raja / Ratu', audio: require('@/assets/audio/output_audio/aksara_jawa/ra/contoh2_ratu.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('@/assets/component/n.png') }
    ] 
  },
  {
    id: '5',
    aksara: require('@/assets/aksara_jawa/ka.png'),
    latin: 'Ka',
    deskripsi: 'Aksara Ka melambangkan fonem velar plosif /k/.',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/ka/aksara.mp3'),
    contoh: [
      { kata: 'ꦏꦭ (Kala)', arti: 'Waktu / Ketika', audio: require('@/assets/audio/output_audio/aksara_jawa/ka/contoh1_kala.mp3') },
      { kata: 'ꦏꦪ (Kaya)', arti: 'Kaya / Seperti', audio: require('@/assets/audio/output_audio/aksara_jawa/ka/contoh2_kaya.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('@/assets/component/n.png') },
      { urutan: 2, nama: 'up_n', image: require('@/assets/component/up_n.png') },
      { urutan: 3, nama: 'n', image: require('@/assets/component/n.png') }
    ] 
  },
  {
    id: '6',
    aksara: require('@/assets/aksara_jawa/da.png'),
    latin: 'Da',
    deskripsi: 'Aksara Da melambangkan fonem dental plosif /d/ (berbeda tipis dengan Dha).',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/da/aksara.mp3'),
    contoh: [
      { kata: 'ꦢꦢꦶ (Dadi)', arti: 'Jadi', audio: require('@/assets/audio/output_audio/aksara_jawa/da/contoh1_dadi.mp3') },
      { kata: 'ꦢꦺꦮ (Dewa)', arti: 'Dewa', audio: require('@/assets/audio/output_audio/aksara_jawa/da/contoh2_dewa.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('@/assets/component/n.png') },
      { urutan: 2, nama: 'down_n', image: require('@/assets/component/down_n.png') }
    ] 
  },
  {
    id: '7',
    aksara: require('@/assets/aksara_jawa/ta.png'),
    latin: 'Ta',
    deskripsi: 'Aksara Ta melambangkan fonem dental plosif tanpa suara /t/.',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/ta/aksara.mp3'),
    contoh: [
      { kata: 'ꦠꦸꦏꦸ (Tuku)', arti: 'Beli', audio: require('@/assets/audio/output_audio/aksara_jawa/ta/contoh1_tuku.mp3') },
      { kata: 'ꦠꦠ (Tata)', arti: 'Atur / Tertib', audio: require('@/assets/audio/output_audio/aksara_jawa/ta/contoh2_tata.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('@/assets/component/n.png') },
      { urutan: 2, nama: '5', image: require('@/assets/component/5.png') },
      { urutan: 3, nama: 'n', image: require('@/assets/component/n.png') }
    ] 
  },
  {
    id: '8',
    aksara: require('@/assets/aksara_jawa/sa.png'),
    latin: 'Sa',
    deskripsi: 'Aksara Sa melambangkan fonem alveolar frikatif /s/.',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/sa/aksara.mp3'),
    contoh: [
      { kata: 'ꦱꦥ (Sapa)', arti: 'Siapa', audio: require('@/assets/audio/output_audio/aksara_jawa/sa/contoh1_sapa.mp3') },
      { kata: 'ꦱꦠꦺ (Sate)', arti: 'Sate', audio: require('@/assets/audio/output_audio/aksara_jawa/sa/contoh2_sate.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'n_down', image: require('@/assets/component/n_down.png') },
      { urutan: 2, nama: 'n', image: require('@/assets/component/n.png') }
    ] 
  },
  {
    id: '9',
    aksara: require('@/assets/aksara_jawa/wa.png'),
    latin: 'Wa',
    deskripsi: 'Aksara Wa melambangkan fonem labio-velar aproksiman /w/.',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/wa/aksara.mp3'),
    contoh: [
      { kata: 'ꦯꦤ (Wana)', arti: 'Hutan', audio: require('@/assets/audio/output_audio/aksara_jawa/wa/contoh1_wana.mp3') },
      { kata: 'ꦮꦠꦸ (Watu)', arti: 'Batu', audio: require('@/assets/audio/output_audio/aksara_jawa/wa/contoh2_watu.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('@/assets/component/n.png') },
      { urutan: 2, nama: 'cucuk', image: require('@/assets/component/cucuk.png') }
    ] 
  },
  {
    id: '10',
    aksara: require('@/assets/aksara_jawa/la.png'),
    latin: 'La',
    deskripsi: 'Aksara La melambangkan fonem alveolar lateral aproksiman /l/.',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/la/aksara.mp3'),
    contoh: [
      { kata: 'ꦭꦭꦶ (Lali)', arti: 'Lupa', audio: require('@/assets/audio/output_audio/aksara_jawa/la/contoh1_lali.mp3') },
      { kata: 'ꦭꦫ (Lara)', arti: 'Sakit', audio: require('@/assets/audio/output_audio/aksara_jawa/la/contoh2_lara.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'm', image: require('@/assets/component/m.png') },
      { urutan: 2, nama: 'n', image: require('@/assets/component/n.png') }
    ] 
  },
  {
    id: '11',
    aksara: require('@/assets/aksara_jawa/pa.png'),
    latin: 'Pa',
    deskripsi: 'Aksara Pa melambangkan fonem bilabial plosif tanpa suara /p/.',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/pa/aksara.mp3'),
    contoh: [
      { kata: 'ꦥꦥꦤ꧀ (Papan)', arti: 'Tempat', audio: require('@/assets/audio/output_audio/aksara_jawa/pa/contoh1_papan.mp3') },
      { kata: 'ꦥꦱꦂ (Pasar)', arti: 'Pasar', audio: require('@/assets/audio/output_audio/aksara_jawa/pa/contoh2_pasar.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('@/assets/component/n.png') },
      { urutan: 2, nama: 'n', image: require('@/assets/component/n.png') }
    ] 
  },
  {
    id: '12',
    aksara: require('@/assets/aksara_jawa/dha.png'),
    latin: 'Dha',
    deskripsi: 'Aksara Dha melambangkan fonem retrofleks plosif /ɖ/ (posisi lidah menekuk ke langit-langit).',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/dha/aksara.mp3'),
    contoh: [
      { kata: 'ꦦꦲꦂ (Dhahar)', arti: 'Makan (halus)', audio: require('@/assets/audio/output_audio/aksara_jawa/dha/contoh1_dhahar.mp3') },
      { kata: 'ꦦꦺꦮꦺ (Dhewe)', arti: 'Sendiri', audio: require('@/assets/audio/output_audio/aksara_jawa/dha/contoh2_dhewe.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('@/assets/component/n.png') },
      { urutan: 2, nama: 'nyantik', image: require('@/assets/component/nyantik.png') },
      { urutan: 3, nama: 'cucuk', image: require('@/assets/component/cucuk.png') }
    ] 
  },
  {
    id: '13',
    aksara: require('@/assets/aksara_jawa/ja.png'),
    latin: 'Ja',
    deskripsi: 'Aksara Ja melambangkan fonem palatal afrikat bersuara /ɟ/.',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/ja/aksara.mp3'),
    contoh: [
      { kata: 'ꦗꦩꦸ (Jamu)', arti: 'Jamu', audio: require('@/assets/audio/output_audio/aksara_jawa/ja/contoh1_jamu.mp3') },
      { kata: 'ꦗꦭ (Jala)', arti: 'Jaring / Jala', audio: require('@/assets/audio/output_audio/aksara_jawa/ja/contoh2_jala.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('@/assets/component/n.png') },
      { urutan: 2, nama: 'K', image: require('@/assets/component/K.png') }
    ]
  },
  {
    id: '14',
    aksara: require('@/assets/aksara_jawa/ya.png'),
    latin: 'Ya',
    deskripsi: 'Aksara Ya melambangkan fonem palatal aproksiman /j/.',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/ya/aksara.mp3'),
    contoh: [
      { kata: 'ꦪꦏꦶꦤ꧀ (Yakin)', arti: 'Percaya / Yakin', audio: require('@/assets/audio/output_audio/aksara_jawa/ya/contoh1_yakin.mp3') },
      { kata: 'ꦪꦪꦠ꧀ (Yayat)', arti: 'Nama orang / Julukan', audio: require('@/assets/audio/output_audio/aksara_jawa/ya/contoh2_yayat.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'n', image: require('@/assets/component/n.png') },
      { urutan: 2, nama: 'n', image: require('@/assets/component/n.png') },
      { urutan: 3, nama: 'n', image: require('@/assets/component/n.png') }
    ] 
  },
  {
    id: '15',
    aksara: require('@/assets/aksara_jawa/nya.png'),
    latin: 'Nya',
    deskripsi: 'Aksara Nya melambangkan fonem palatal nasal /ɲ/.',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/nya/aksara.mp3'),
    contoh: [
      { kata: 'ꦚꦠ (Nyata)', arti: 'Terbukti / Nyata', audio: require('@/assets/audio/output_audio/aksara_jawa/nya/contoh1_nyata.mp3') },
      { kata: 'ꦚꦩꦸꦏ꧀ (Nyamuk)', arti: 'Nyamuk', audio: require('@/assets/audio/output_audio/aksara_jawa/nya/contoh2_nyamuk.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'n_nyantik', image: require('@/assets/component/n_nyantik.png') },
      { urutan: 2, nama: 'payung_m', image: require('@/assets/component/payung_m.png') },
      { urutan: 3, nama: 'm', image: require('@/assets/component/m.png') }
    ]
  },
  {
    id: '16',
    aksara: require('@/assets/aksara_jawa/ma.png'),
    latin: 'Ma',
    deskripsi: 'Aksara Ma melambangkan fonem bilabial nasal /m/.',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/ma/aksara.mp3'),
    contoh: [
      { kata: 'ꦩꦠꦠ (Mata)', arti: 'Mata', audio: require('@/assets/audio/output_audio/aksara_jawa/ma/contoh1_mata.mp3') },
      { kata: 'ꦩꦕꦤ꧀ (Macan)', arti: 'Harimau', audio: require('@/assets/audio/output_audio/aksara_jawa/ma/contoh2_macan.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: '3_reverse', image: require('@/assets/component/3_reverse.png') },
      { urutan: 2, nama: 'n', image: require('@/assets/component/n.png') }
    ] 
  },
  {
    id: '17',
    aksara: require('@/assets/aksara_jawa/ga.png'),
    latin: 'Ga',
    deskripsi: 'Aksara Ga melambangkan fonem velar plosif bersuara /g/.',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/ga/aksara.mp3'),
    contoh: [
      { kata: 'ꦓꦭ (Gajah)', arti: 'Gajah', audio: require('@/assets/audio/output_audio/aksara_jawa/ga/contoh1_gajah.mp3') },
      { kata: 'ꦭꦒꦸ (Lagu)', arti: 'Nyanyian / Lagu', audio: require('@/assets/audio/output_audio/aksara_jawa/ga/contoh2_lagu.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'm', image: require('@/assets/component/m.png') }
    ] 
  },
  {
    id: '18',
    aksara: require('@/assets/aksara_jawa/ba.png'),
    latin: 'Ba',
    deskripsi: 'Aksara Ba melambangkan fonem bilabial plosif bersuara /b/.',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/ba/aksara.mp3'),
    contoh: [
      { kata: 'ꦧꦭ (Bala)', arti: 'Teman / Pasukan', audio: require('@/assets/audio/output_audio/aksara_jawa/ba/contoh1_bala.mp3') },
      { kata: 'ꦧꦠꦶ (Bati)', arti: 'Untung', audio: require('@/assets/audio/output_audio/aksara_jawa/ba/contoh2_bati.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'n_nyantik', image: require('@/assets/component/n_nyantik.png') },
      { urutan: 2, nama: 'payung_m', image: require('@/assets/component/payung_m.png') },
      { urutan: 3, nama: 'n', image: require('@/assets/component/n.png') }
    ] 
  },
  {
    id: '19',
    aksara: require('@/assets/aksara_jawa/tha.png'),
    latin: 'Tha',
    deskripsi: 'Aksara Tha melambangkan fonem retrofleks plosif tanpa suara /ʈ/.',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/tha/aksara.mp3'),
    contoh: [
      { kata: 'ꦛꦺꦛꦺꦏ꧀ (Thuthuk)', arti: 'Pukul', audio: require('@/assets/audio/output_audio/aksara_jawa/tha/contoh1_thuthuk.mp3') },
      { kata: 'ꦛꦶꦛꦶꦏ꧀ (Thithik)', arti: 'Sedikit', audio: require('@/assets/audio/output_audio/aksara_jawa/tha/contoh2_thithik.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'n_waw', image: require('@/assets/component/n_waw.png') },
      { urutan: 2, nama: 'payung_m', image: require('@/assets/component/payung_m.png') }
    ] 
  },
  {
    id: '20',
    aksara: require('@/assets/aksara_jawa/nga.png'),
    latin: 'Nga',
    deskripsi: 'Aksara Nga melambangkan fonem velar nasal /ŋ/.',
    audioAksara: require('@/assets/audio/output_audio/aksara_jawa/nga/aksara.mp3'),
    contoh: [
      { kata: 'ꦔꦥꦶ (Ngopi)', arti: 'Minum Kopi', audio: require('@/assets/audio/output_audio/aksara_jawa/nga/contoh1_ngopi.mp3') },
      { kata: 'ꦔꦭꦩ꧀ (Ngalam)', arti: 'Alam / Dunia', audio: require('@/assets/audio/output_audio/aksara_jawa/nga/contoh2_ngalam.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'n_nyantik', image: require('@/assets/component/n_nyantik.png') },
      { urutan: 2, nama: 'payung_m', image: require('@/assets/component/payung_m.png') }
    ] 
  }
];

export const MATERI_SANDHANGAN: MateriType[] = [
  {
    id: '21',
    aksara: require('@/assets/component/wulu.png'),
    latin: 'i',
    deskripsi: 'Sandhangan Wulu digunakake kanggo ngowahi swara dhasar (a) dadi swara (i). Ditulis ing ndhuwur pungkasan aksara.',
    audioAksara: require('@/assets/audio/output_audio/sandhangan/wulu/sandhangan.mp3'),
    contoh: [
      { kata: 'ꦔꦥꦶ (Ngopi)', arti: 'Minum Kopi', audio: require('@/assets/audio/output_audio/sandhangan/wulu/contoh1_ngopi.mp3') },
      { kata: 'ꦱꦶꦠꦶ (Siti)', arti: 'Tanah / Nama orang', audio: require('@/assets/audio/output_audio/sandhangan/wulu/contoh2_siti.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'aksara_ga', image: require('@/assets/aksara_jawa/ga.png') },
      { urutan: 2, nama: 'wulu_c', image: require('@/assets/component/wulu_c.png') }
    ] 
  },
  {
    id: '22',
    aksara: require('@/assets/component/pepet.png'),
    latin: 'ê',
    deskripsi: 'Sandhangan Pepet digunakake kanggo ngowahi swara dhasar dadi swara ê (kaya ing tembung "sega" utawa "lemah"). Ditulis ing ndhuwur aksara.',
    audioAksara: require('@/assets/audio/output_audio/sandhangan/pepet/sandhangan.mp3'),
    contoh: [
      { kata: 'ꦱꦼꦒ (Sega)', arti: 'Nasi', audio: require('@/assets/audio/output_audio/sandhangan/pepet/contoh1_sega.mp3') },
      { kata: 'ꦊꦩꦃ (Lemah)', arti: 'Tanah', audio: require('@/assets/audio/output_audio/sandhangan/pepet/contoh2_lemah.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'aksara_ga', image: require('@/assets/aksara_jawa/ga.png') },
      { urutan: 2, nama: 'pepet_c', image: require('@/assets/component/pepet_c.png') }
    ] 
  },
  {
    id: '23',
    aksara: require('@/assets/component/taling.png'),
    latin: 'e',
    deskripsi: 'Sandhangan Taling digunakake kanggo ngowahi swara dhasar dadi swara é (kaya "sate") utawa è (kaya "bebek"). Ditulis ing ngarepe (sebelah kiwa) aksara.',
    audioAksara: require('@/assets/audio/output_audio/sandhangan/taling/sandhangan.mp3'),
    contoh: [
      { kata: 'ꦥꦱꦠꦺ (Sate)', arti: 'Sate', audio: require('@/assets/audio/output_audio/sandhangan/taling/contoh1_sate.mp3') },
      { kata: 'ꦭꦺꦭꦺ (Lele)', arti: 'Ikan Lele', audio: require('@/assets/audio/output_audio/sandhangan/taling/contoh2_lele.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'taling_c', image: require('@/assets/component/taling_c.png') },
      { urutan: 2, nama: 'aksara_na', image: require('@/assets/aksara_jawa/na.png') },
    ] 
  },
  {
    id: '24',
    aksara: require('@/assets/component/taling_tarung.png'),
    latin: 'o',
    deskripsi: 'Sandhangan Taling Tarung digunakake kanggo ngowahi swara dhasar dadi swara (o). Aksarane dijepit ing tengah-tengah antarane taling lan tarung.',
    audioAksara: require('@/assets/audio/output_audio/sandhangan/taling_tarung/sandhangan.mp3'),
    contoh: [
      { kata: 'ꦭꦯꦺꦴꦏꦺꦴ (Loro)', arti: 'Dua / Sakit', audio: require('@/assets/audio/output_audio/sandhangan/taling_tarung/contoh1_loro.mp3') },
      { kata: 'ꦠꦺꦴꦏꦺꦴ (Toko)', arti: 'Toko', audio: require('@/assets/audio/output_audio/sandhangan/taling_tarung/contoh2_toko.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'taling_c', image: require('@/assets/component/taling_c.png') },
      { urutan: 2, nama: 'aksara_na', image: require('@/assets/aksara_jawa/na.png') },
      { urutan: 3, nama: 'tarung_c', image: require('@/assets/component/tarung_c.png') }
    ] 
  },
  {
    id: '25',
    aksara: require('@/assets/component/suku.png'),
    latin: 'u',
    deskripsi: 'Sandhangan Suku digunakake kanggo ngowahi swara dhasar dadi swara (u). Ditulis nggandheng ing ngisor buri aksara.',
    audioAksara: require('@/assets/audio/output_audio/sandhangan/suku/sandhangan.mp3'),
    contoh: [
      { kata: 'ꦠꦸꦏꦸ (Tuku)', arti: 'Beli', audio: require('@/assets/audio/output_audio/sandhangan/suku/contoh1_tuku.mp3') },
      { kata: 'ꦧꦸꦏꦸ (Buku)', arti: 'Buku', audio: require('@/assets/audio/output_audio/sandhangan/suku/contoh2_buku.mp3') }
    ],
    komponen: [
      { urutan: 1, nama: 'aksara_ga', image: require('@/assets/aksara_jawa/ga.png') },
      { urutan: 2, nama: 'suku_c', image: require('@/assets/component/suku_c.png') }
    ] 
  }
];

export const MATERI_GABUNGAN: MateriType[] = [
  ...MATERI_AKSARA,
  ...MATERI_SANDHANGAN
];