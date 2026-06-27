import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface FormatTextProps {
  kalimat: string;
  indexActive: number;
}

function Silabisasi(kata: string) {
  // Kita tidak menggunakan .toLowerCase() agar string asli tetap terjaga huruf kapitalnya
  let hasil = kata.normalize("NFC"); 

  // 1. Aturan V-K-V: Pisah SEBELUM konsonan tunggal / digraf yang diapit dua vokal
  // Ditambahkan ê ke daftar vokal, menggunakan (?=[aeiouê]) agar vokal kanan tidak terkunci
  hasil = hasil.replace(
    /([aeiouê])(ng|ny|th|dh|ch|[bcdfghjklmnpqrstvwxyz])(?=[aeiouê])/gi,
    "$1-$2"
  );

  // 2. Aturan V-K-K-V: Pisah DI ANTARA dua konsonan yang diapit dua vokal
  hasil = hasil.replace(
    /([aeiouê])([bcdfghjklmnpqrstvwxyz])(?=(ng|ny|th|dh|ch|[bcdfghjklmnpqrstvwxyz])[aeiouê])/gi,
    "$1$2-"
  );

  // 3. Aturan V-V: Dua vokal berurutan dipisah
  hasil = hasil.replace(/([aeiouê])(?=[aeiouê])/gi, "$1-");

  return hasil.split('-');
}

export default function TeksHighlight ({ kalimat, indexActive }: FormatTextProps) {
  const perSukuKata = kalimat.split(" ").reduce<string[]>((acc, kata, kataIdx, arrayKata) => {
    const silabisasiKata = Silabisasi(kata);
    
    const hasilSukuKata = silabisasiKata.map((suku, sukuIdx) => {
      const apakahSukuTerakhir = sukuIdx === silabisasiKata.length - 1;
      const apakahKataTerakhir = kataIdx === arrayKata.length - 1;

      if (apakahSukuTerakhir && !apakahKataTerakhir) {
        return `${suku} `;
      }
      return suku;
    });

    return [...acc, ...hasilSukuKata];
  }, []);

  return (
    <Text>
      {perSukuKata.map((potongan, index) => {
        const sukuKataActive = index === indexActive;

        return (
          <Text
            key={index}
            style={sukuKataActive ? styles.highlightText : styles.normalText}
          >
            {potongan}
          </Text>
        );
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  normalText: {
    fontSize: 24,
    fontFamily: 'Fraunces-Bold',
    color: '#6f411d'
  },
  highlightText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#cb9163',
    backgroundColor: '#6f411d',
    borderRadius: 4, 
  },
});