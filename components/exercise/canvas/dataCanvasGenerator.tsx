
import { MATERI_AKSARA } from "@/components/material/dataMateri";
// import { MATERI_AKSARA } from "@/other/dataMateri2";

export function Silabisasi(kata: string) {
  let hasil = kata.toLowerCase();

  // 1. Amankan kluster konsonan ganda (digraf) agar dianggap sebagai satu konsonan 'K'
  // Kita bisa ubah sementara menjadi karakter khusus atau ditangani langsung di regex

  // Aturan V-K-V: Pisah SEBELUM konsonan tunggal / digraf yang diapit dua vokal
  // Menggunakan positive lookahead (?=...) agar tidak "memakan" huruf vokalnya
  hasil = hasil.replace(
    /([aeêiou])(ng|ny|th|dh|ch|[bcdfghjklmnpqrstvwxyz])(?=[aeêiou])/g,
    "$1-$2"
  );

  // Aturan V-K-K-V: Pisah DI ANTARA dua konsonan yang diapit dua vokal
  // Pastikan tidak memotong digraf seperti 'ng', 'ny', dll.
  hasil = hasil.replace(
    /([aeêiou])([bcdfghjklmnpqrstvwxyz])(?=(ng|ny|th|dh|ch|[bcdfghjklmnpqrstvwxyz])[aeêiou])/g,
    "$1$2-"
  );

  // Aturan V-V: Dua vokal berurutan dipisah
  hasil = hasil.replace(/([aeêiou])(?=[aeêiou])/g, "$1-");

  // Potong string berdasarkan tanda strip
  return hasil.split("-");
}

// function SorterComponent(data: any[]) {
//     return data.map((item, index) => (
//         item = {...item, urutan : index+1}
//     ))
// }

export default function DataCanvasGenerator(kalimat: string) {
  const perKata = kalimat.split(" ");
  const data = perKata.reduce<object[]>((acc, kata) => {
    let perSukuKata = Silabisasi(kata);
    const data = perSukuKata.reduce<Record<string, string[]>[]>(
      (acc, sukuKata) => {
        sukuKata = sukuKata.normalize("NFC")
        if (/^(ha|a)$/i.test(sukuKata)) {
          const obj = {
            [sukuKata]: [MATERI_AKSARA[0].latin.toLowerCase()],
          };
          acc.push(obj);
        } else if (/^(i|u|e|ê|o)$/.test(sukuKata)) {
          const komponenTambahan = MATERI_AKSARA.filter((item) => {
            const clearItemLatin = item.latin.replace(/a/g, "").toLowerCase().normalize("NFC")
            return sukuKata.includes(clearItemLatin);
          }).reduce<any>((cont, item) => {
            cont = [...cont, item.komponen[1].nama.toLowerCase()];
            return cont;
          }, []);
          const obj = {
            [sukuKata]: [
              MATERI_AKSARA[0].latin.toLowerCase(),
              ...komponenTambahan,
            ],
          };
          acc.push(obj);
        } else {
          let komponen = MATERI_AKSARA.filter((item) => {
            const latinItem = item.latin.toLowerCase().normalize("NFC");
            if (/^(e|ê|i|u|o)$/.test(latinItem)) {
              if (latinItem === "e") {
                return sukuKata.includes("e") && !sukuKata.includes("ê");
              }
              return sukuKata.includes(latinItem);
            } 
            const clearItemLatin = latinItem.replace(/a/g, "");
            return sukuKata.includes(clearItemLatin);
          }).reduce<any>((cont, item) => {
            const latinItem = item.latin.toLowerCase().normalize("NFC");
            if (/^(i|u|e|ê|o)$/.test(latinItem)) {
              cont = [...cont, item.komponen[1].nama.toLowerCase()];
            } else {
              cont = [...cont, item.latin.toLowerCase()];
            }
            return cont;
          }, []);
          const obj = {
            [sukuKata]: komponen,
          };
          acc.push(obj);
        }
        return acc;
      },
      [],
    );
    return (acc = [...acc, ...data]);
  }, []);
  return data;
}

// console.dir(DataCanvasGenerator("masesêsaê"), {
//   depth: null,
//   colors: true,
// });
