import { ImageSourcePropType } from 'react-native';

export type TilesType = {
  nama: string,
  image: any
}

export type ComponentType = {
  urutan:number, 
  nama: string,
  image: ImageSourcePropType 
}

export type MateriType = {
  id: string;
  aksara: ImageSourcePropType;
  latin: string;
  deskripsi: string;
  contoh: { kata: string; arti: string }[];
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
  { nama: "pepet", image: require("@/assets/component/pepet.png") },
  { nama: "suku", image: require("@/assets/component/suku.png") },
  { nama: "taling_tarung", image: require("@/assets/component/taling_tarung.png") },
  { nama: "taling", image: require("@/assets/component/taling.png") },
  { nama: "up_n", image: require("@/assets/component/up_n.png") },
  { nama: "wulu", image: require("@/assets/component/wulu.png") }
];

export const MATERI_AKSARA: MateriType[] = [
  {
    id: '1',
    aksara: require('@/assets/aksara_jawa/ha.png'), // Sesuaikan path gambar asli kamu nanti
    latin: 'Ha',
    deskripsi: 'Aksara Ha merupakan aksara pertama yang melambangkan bunyi "ha" atau "a".',
    contoh: [
      { kata: 'ꦲꦤ (Ana)', arti: 'Ada' },
      { kata: 'ꦲꦠꦶ (Ati)', arti: 'Hati' }
    ],
    komponen: [
        { urutan: 1, nama:'n', image:require('@/assets/component/n.png') },
        { urutan: 2, nama:'m', image:require('@/assets/component/m.png') },
    ] 
  },
  {
    id: '2',
    aksara: require('@/assets/aksara_jawa/na.png'),
    latin: 'Na',
    deskripsi: 'Aksara Na melambangkan fonem dental nasal /n/.',
    contoh: [
      { kata: 'ꦦꦤ (Nawa)', arti: 'Sembilan' },
      { kata: 'ꦤꦩ (Nama)', arti: 'Nama' }
    ],
    komponen: [
        { urutan: 1, nama:'n', image:require('@/assets/component/n.png') },
        { urutan: 2, nama:'up_n', image:require('@/assets/component/up_n.png') },
    ] 
  },
  {
    id: '3',
    aksara: require('@/assets/aksara_jawa/ca.png'),
    latin: 'Ca',
    deskripsi: 'Aksara Ca melambangkan fonem palatal afrikat /c/.',
    contoh: [
      { kata: 'ꦧꦕ (Baca)', arti: 'Membaca' },
      { kata: 'ꦣꦕ (Cacing)', arti: 'Cacing' }
    ],
    komponen: [
        { urutan: 1, nama:'n_down', image:require('@/assets/component/n_down.png') },
        { urutan: 2, nama:'cucuk', image:require('@/assets/component/cucuk.png') },
    ] 
  },
  {
    id: '4',
    aksara: require('@/assets/aksara_jawa/ra.png'),
    latin: 'Ra',
    deskripsi: 'Aksara Ra melambangkan fonem alveolar trill /r/.',
    contoh: [
      { kata: 'ꦫꦱ (Rasa)', arti: 'Rasa' },
      { kata: 'ꦫꦠꦸ (Ratu)', arti: 'Raja / Ratu' }
    ],
    komponen: [
        { urutan: 1, nama:'n', image:require('@/assets/component/n.png') },
    ] 
  },
  {
    id: '5',
    aksara: require('@/assets/aksara_jawa/ka.png'),
    latin: 'Ka',
    deskripsi: 'Aksara Ka melambangkan fonem velar plosif /k/.',
    contoh: [
      { kata: 'ꦏꦭ (Kala)', arti: 'Waktu / Ketika' },
      { kata: 'ꦏꦪ (Kaya)', arti: 'Kaya / Seperti' }
    ],
    komponen: [
        { urutan: 1, nama:'n', image:require('@/assets/component/n.png') },
        { urutan: 2, nama:'up_n', image:require('@/assets/component/up_n.png') },
        { urutan: 3, nama:'n', image:require('@/assets/component/n.png') },
    ] 
  },
  {
    id: '6',
    aksara: require('@/assets/aksara_jawa/da.png'),
    latin: 'Da',
    deskripsi: 'Aksara Da melambangkan fonem dental plosif /d/ (berbeda tipis dengan Dha).',
    contoh: [
      { kata: 'ꦢꦢꦶ (Dadi)', arti: 'Jadi' },
      { kata: 'ꦢꦺꦮ (Dewa)', arti: 'Dewa' }
    ],
    komponen: [
        { urutan: 1, nama:'n', image:require('@/assets/component/n.png') },
        { urutan: 2, nama:'down_n', image:require('@/assets/component/down_n.png') },
    ] 
  },
  {
    id: '7',
    aksara: require('@/assets/aksara_jawa/ta.png'),
    latin: 'Ta',
    deskripsi: 'Aksara Ta melambangkan fonem dental plosif tanpa suara /t/.',
    contoh: [
      { kata: 'ꦠꦸꦏꦸ (Tuku)', arti: 'Beli' },
      { kata: 'ꦠꦠ (Tata)', arti: 'Atur / Tertib' }
    ],
    komponen: [
        { urutan: 1, nama:'n', image:require('@/assets/component/n.png') },
        { urutan: 2, nama:'5', image:require('@/assets/component/5.png') },
        { urutan: 3, nama:'n', image:require('@/assets/component/n.png') },
    ] 
  },
  {
    id: '8',
    aksara: require('@/assets/aksara_jawa/sa.png'),
    latin: 'Sa',
    deskripsi: 'Aksara Sa melambangkan fonem alveolar frikatif /s/.',
    contoh: [
      { kata: 'ꦱꦥ (Sapa)', arti: 'Siapa' },
      { kata: 'ꦱꦠꦺ (Sate)', arti: 'Sate' }
    ],
    komponen: [
        { urutan: 1, nama:'n_down', image:require('@/assets/component/n_down.png') },
        { urutan: 2, nama:'n', image:require('@/assets/component/n.png') },
    ] 
  },
  {
    id: '9',
    aksara: require('@/assets/aksara_jawa/wa.png'),
    latin: 'Wa',
    deskripsi: 'Aksara Wa melambangkan fonem labio-velar aproksiman /w/.',
    contoh: [
      { kata: 'ꦯꦤ (Wana)', arti: 'Hutan' },
      { kata: 'ꦮꦠꦸ (Watu)', arti: 'Batu' }
    ],
    komponen: [
        { urutan: 1, nama:'n', image:require('@/assets/component/n.png') },
        { urutan: 2, nama:'cucuk', image:require('@/assets/component/cucuk.png') },
    ] 
  },
  {
    id: '10',
    aksara: require('@/assets/aksara_jawa/la.png'),
    latin: 'La',
    deskripsi: 'Aksara La melambangkan fonem alveolar lateral aproksiman /l/.',
    contoh: [
      { kata: 'ꦭꦭꦶ (Lali)', arti: 'Lupa' },
      { kata: 'ꦭꦫ (Lara)', arti: 'Sakit' }
    ],
    komponen: [
        { urutan: 1, nama:'m', image:require('@/assets/component/m.png') },
        { urutan: 2, nama:'n', image:require('@/assets/component/n.png') },
    ] 
  },
  {
    id: '11',
    aksara: require('@/assets/aksara_jawa/pa.png'),
    latin: 'Pa',
    deskripsi: 'Aksara Pa melambangkan fonem bilabial plosif tanpa suara /p/.',
    contoh: [
      { kata: 'ꦥꦥꦤ꧀ (Papan)', arti: 'Tempat' },
      { kata: 'ꦥꦱꦂ (Pasar)', arti: 'Pasar' }
    ],
    komponen: [
        { urutan: 1, nama:'n', image:require('@/assets/component/n.png') },
        { urutan: 2, nama:'n', image:require('@/assets/component/n.png') },
    ] 
  },
  {
    id: '12',
    aksara: require('@/assets/aksara_jawa/dha.png'),
    latin: 'Dha',
    deskripsi: 'Aksara Dha melambangkan fonem retrofleks plosif /ɖ/ (posisi lidah menekuk ke langit-langit).',
    contoh: [
      { kata: 'ꦦꦲꦂ (Dhahar)', arti: 'Makan (halus)' },
      { kata: 'ꦦꦺꦮꦺ (Dhewe)', arti: 'Sendiri' }
    ],
    komponen: [
        { urutan: 1, nama:'n', image:require('@/assets/component/n.png') },
        { urutan: 2, nama:'nyantik', image:require('@/assets/component/nyantik.png') },
        { urutan: 3, nama:'cucuk', image:require('@/assets/component/cucuk.png') },
    ] 
  },
  {
    id: '13',
    aksara: require('@/assets/aksara_jawa/ja.png'),
    latin: 'Ja',
    deskripsi: 'Aksara Ja melambangkan fonem palatal afrikat bersuara /ɟ/.',
    contoh: [
      { kata: 'ꦗꦩꦸ (Jamu)', arti: 'Jamu' },
      { kata: 'ꦗꦭ (Jala)', arti: 'Jaring / Jala' }
    ],
    komponen: [
        { urutan: 1, nama:'n', image:require('@/assets/component/n.png') },
        { urutan: 2, nama:'K', image:require('@/assets/component/K.png') },
    ]
  },
  {
    id: '14',
    aksara: require('@/assets/aksara_jawa/ya.png'),
    latin: 'Ya',
    deskripsi: 'Aksara Ya melambangkan fonem palatal aproksiman /j/.',
    contoh: [
      { kata: 'ꦪꦏꦶꦤ꧀ (Yakin)', arti: 'Percaya / Yakin' },
      { kata: 'ꦪꦪꦠ꧀ (Yayat)', arti: 'Nama orang / Julukan' }
    ],
    komponen: [
        { urutan: 1, nama:'n', image:require('@/assets/component/n.png') },
        { urutan: 2, nama:'n', image:require('@/assets/component/n.png') },
        { urutan: 3, nama:'n', image:require('@/assets/component/n.png') },
    ] 
  },
  {
    id: '15',
    aksara: require('@/assets/aksara_jawa/nya.png'),
    latin: 'Nya',
    deskripsi: 'Aksara Nya melambangkan fonem palatal nasal /ɲ/.',
    contoh: [
      { kata: 'ꦚꦠ (Nyata)', arti: 'Terbukti / Nyata' },
      { kata: 'ꦚꦩꦸꦏ꧀ (Nyamuk)', arti: 'Nyamuk' }
    ],
    komponen: [
        { urutan: 1, nama:'n_nyantik', image:require('@/assets/component/n_nyantik.png') },
        { urutan: 2, nama:'payung_m', image:require('@/assets/component/payung_m.png') },
        { urutan: 3, nama:'m', image:require('@/assets/component/m.png') },
    ]
  },
  {
    id: '16',
    aksara: require('@/assets/aksara_jawa/ma.png'),
    latin: 'Ma',
    deskripsi: 'Aksara Ma melambangkan fonem bilabial nasal /m/.',
    contoh: [
      { kata: 'ꦩꦠꦠ (Mata)', arti: 'Mata' },
      { kata: 'ꦩꦕꦤ꧀ (Macan)', arti: 'Harimau' }
    ],
    komponen: [
        { urutan: 1, nama:'3_reverse', image:require('@/assets/component/3_reverse.png') },
        { urutan: 2, nama:'n', image:require('@/assets/component/n.png') },
    ] 
  },
  {
    id: '17',
    aksara: require('@/assets/aksara_jawa/ga.png'),
    latin: 'Ga',
    deskripsi: 'Aksara Ga melambangkan fonem velar plosif bersuara /g/.',
    contoh: [
      { kata: 'ꦓꦭ (Gajah)', arti: 'Gajah' },
      { kata: 'ꦭꦒꦸ (Lagu)', arti: 'Nyanyian / Lagu' }
    ],
    komponen: [
        { urutan: 1, nama:'m', image:require('@/assets/component/m.png') },
    ] 
  },
  {
    id: '18',
    aksara: require('@/assets/aksara_jawa/ba.png'),
    latin: 'Ba',
    deskripsi: 'Aksara Ba melambangkan fonem bilabial plosif bersuara /b/.',
    contoh: [
      { kata: 'ꦧꦭ (Bala)', arti: 'Teman / Pasukan' },
      { kata: 'ꦧꦠꦶ (Bati)', arti: 'Untung' }
    ],
    komponen: [
        { urutan: 1, nama:'n_nyantik', image:require('@/assets/component/n_nyantik.png') },
        { urutan: 2, nama:'payung_m', image:require('@/assets/component/payung_m.png') },
        { urutan: 3, nama:'n', image:require('@/assets/component/n.png') },
    ] 
  },
  {
    id: '19',
    aksara: require('@/assets/aksara_jawa/tha.png'),
    latin: 'Tha',
    deskripsi: 'Aksara Tha melambangkan fonem retrofleks plosif tanpa suara /ʈ/.',
    contoh: [
      { kata: 'ꦛꦺꦛꦺꦏ꧀ (Thuthuk)', arti: 'Pukul' },
      { kata: 'ꦛꦶꦛꦶꦏ꧀ (Thithik)', arti: 'Sedikit' }
    ],
    komponen: [
        { urutan: 1, nama:'n_waw', image:require('@/assets/component/n_waw.png') },
        { urutan: 2, nama:'payung_m', image:require('@/assets/component/payung_m.png') },
    ] 
  },
  {
    id: '20',
    aksara: require('@/assets/aksara_jawa/nga.png'),
    latin: 'Nga',
    deskripsi: 'Aksara Nga melambangkan fonem velar nasal /ŋ/.',
    contoh: [
      { kata: 'ꦔꦥꦶ (Ngopi)', arti: 'Minum Kopi' },
      { kata: 'ꦔꦭꦩ꧀ (Ngalam)', arti: 'Alam / Dunia' }
    ],
    komponen: [
        { urutan: 1, nama:'n_nyantik', image:require('@/assets/component/n_nyantik.png') },
        { urutan: 2, nama:'payung_m', image:require('@/assets/component/payung_m.png') },
    ] 
  },
  {
    id: '21',
    aksara: require('@/assets/component/wulu.png'),
    latin: 'i',
    deskripsi: 'Sandhangan Wulu digunakake kanggo ngowahi swara dhasar (a) dadi swara (i). Ditulis ing ndhuwur pungkasan aksara.',
    contoh: [
      { kata: 'ꦔꦥꦶ (Ngopi)', arti: 'Minum Kopi' },
      { kata: 'ꦱꦶꦠꦶ (Siti)', arti: 'Tanah / Nama orang' }
    ],
    komponen: [
        { urutan: 1, nama: 'aksara_ga', image: require('@/assets/aksara_jawa/ga.png') }, // Seluruh tubuh aksara
        { urutan: 2, nama: 'wulu', image: require('@/assets/component/wulu.png') }     // Pasangannya (sandhangan)
    ] 
  },
  {
    id: '22',
    aksara: require('@/assets/component/pepet.png'),
    latin: 'ê',
    deskripsi: 'Sandhangan Pepet digunakake kanggo ngowahi swara dhasar dadi swara ê (kaya ing tembung "sega" utawa "lemah"). Ditulis ing ndhuwur aksara.',
    contoh: [
      { kata: 'ꦱꦼꦒ (Sega)', arti: 'Nasi' },
      { kata: 'ꦊꦩꦃ (Lemah)', arti: 'Tanah' }
    ],
    komponen: [
        { urutan: 1, nama: 'aksara_ga', image: require('@/assets/aksara_jawa/ga.png') },
        { urutan: 2, nama: 'pepet', image: require('@/assets/component/pepet.png') }
    ] 
  },
  {
    id: '23',
    aksara: require('@/assets/component/taling.png'),
    latin: 'e',
    deskripsi: 'Sandhangan Taling digunakake kanggo ngowahi swara dhasar dadi swara é (kaya "sate") utawa è (kaya "bebek"). Ditulis ing ngarepe (sebelah kiwa) aksara.',
    contoh: [
      { kata: 'ꦥꦱꦠꦺ (Sate)', arti: 'Sate' },
      { kata: 'ꦭꦺꦭꦺ (Lele)', arti: 'Ikan Lele' }
    ],
    komponen: [
        { urutan: 1, nama: 'aksara_na', image: require('@/assets/aksara_jawa/na.png') },
        { urutan: 2, nama: 'taling', image: require('@/assets/component/taling.png') }
    ] 
  },
  {
    id: '24',
    aksara: require('@/assets/component/taling_tarung.png'),
    latin: 'o',
    deskripsi: 'Sandhangan Taling Tarung digunakake kanggo ngowahi swara dhasar dadi swara (o). Aksarane dijepit ing tengah-tengah antarane taling lan tarung.',
    contoh: [
      { kata: 'ꦭꦯꦺꦴꦏꦺꦴ (Loro)', arti: 'Dua / Sakit' },
      { kata: 'ꦠꦺꦴꦏꦺꦴ (Toko)', arti: 'Toko' }
    ],
    komponen: [
        { urutan: 1, nama: 'aksara_na', image: require('@/assets/aksara_jawa/na.png') },
        { urutan: 2, nama: 'taling_tarung', image: require('@/assets/component/taling_tarung.png') }
    ] 
  },
  {
    id: '25',
    aksara: require('@/assets/component/suku.png'),
    latin: 'u',
    deskripsi: 'Sandhangan Suku digunakake kanggo ngowahi swara dhasar dadi swara (u). Ditulis nggandheng ing ngisor buri aksara.',
    contoh: [
      { kata: 'ꦠꦸ%ꦏꦸ (Tuku)', arti: 'Beli' },
      { kata: 'ꦧꦸ%ꦏꦸ (Buku)', arti: 'Buku' }
    ],
    komponen: [
        { urutan: 1, nama: 'aksara_ga', image: require('@/assets/aksara_jawa/ga.png') },
        { urutan: 2, nama: 'suku', image: require('@/assets/component/suku.png') }
    ] 
  }
];