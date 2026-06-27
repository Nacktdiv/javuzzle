// if (typeof require !== 'undefined' && require.extensions) {
//   require.extensions['.png'] = function () {
//     return 1; // Kembalikan ID angka dummy mirip seperti cara kerja Metro Bundler
//   };
// }

import { MATERI_AKSARA } from "../material/dataMateri2"; 

export function Silabisasi(kata: string) {
  let hasil = kata.toLowerCase();

  // 1. Aturan V-V: Dua vokal berurutan dipisah (kecuali diftong, tapi di sini kita pisah dasar)
  // Contoh: ana -> a-na (jika ada vokal berdampingan seperti 'oi' di kata lain)
  hasil = hasil.replace(/([aeiou])([aeiou])/g, '$1-$2');

  // 2. Aturan V-K-V: Jika ada satu konsonan di antara dua vokal, dipisah sebelum konsonan
  // Contoh: pa-sar, ma-ngan (ng dihitung satu kesatuan konsonan)
  // Kita amankan kluster 'ng', 'ny', 'th', 'dh', 'ch' agar tidak terpisah di tengah jalan
  hasil = hasil.replace(/([aeiou])(ng|ny|th|dh|ch|[bcdfghjklmnpqrstvwxyz])([aeiou])/g, '$1-$2$3');

  // 3. Aturan V-K-K-V: Jika ada dua konsonan berurutan di antara dua vokal, dipisah di antara konsonan
  // Contoh: man-tap, pas-ti
  hasil = hasil.replace(/([aeiou])([bcdfghjklmnpqrstvwxyz])([bcdfghjklmnpqrstvwxyz])([aeiou])/g, '$1$2-$3$4');

  // Potong string berdasarkan tanda strip yang dibuat
  return hasil.split('-');
}

function SorterComponent(data: any[]) {
    return data.map((item, index) => (
        item = {...item, urutan : index+1}
    ))
}

export default function DataPuzzleGenerator (kalimat : string){
    const perKata = kalimat.split(' ')
    const data = perKata.reduce<Record<string, any>[]>((acc, kata) => {
        let perSukuKata = Silabisasi(kata)
        const data = perSukuKata.reduce<Record<string, any[]>>((acc, sukuKata) => {
            if (/^(ha|a)$/i.test(sukuKata)) {
                acc[sukuKata] = MATERI_AKSARA[0].komponen
            } else if (/^(i|u|e|o)$/i.test(sukuKata)) {
                const komponenTambahan = MATERI_AKSARA.filter((item) => {
                    const clearItemLatin = item.latin.replace(/a/g, "").toLowerCase()
                    return sukuKata.includes(clearItemLatin)
                })
                .reduce<any>((cont, item) => {
                    cont = [...cont, item.komponen[1]]
                    return cont
                }, []);
                const komponenAkhir = SorterComponent([...MATERI_AKSARA[0].komponen, ...komponenTambahan])
                acc[sukuKata] = komponenAkhir
            } else {
                let komponen = MATERI_AKSARA.filter((item) => {
                    const clearItemLatin = item.latin.replace(/a/g, "").toLowerCase()
                    return sukuKata.includes(clearItemLatin)
                })
                .reduce<any>((cont, item) => {
                    if (/^(i|u|e|o)$/i.test(item.latin)) {
                        cont = [...cont, item.komponen[1]]
                    } else {
                        cont = [...cont, ...item.komponen]
                    }
                    return cont
                }, []);
                komponen = SorterComponent(komponen)
                acc[sukuKata] = komponen
            }
            return acc
        }, {})
        const obj = {
            [kata] : data
        }
        acc.push(obj)
        return acc
    }, [])
    return data
}

console.dir(DataPuzzleGenerator('Ibu Aku Ora Turu'), { depth: null, colors: true })
// DataPuzzleGenerator('uma')