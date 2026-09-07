import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Colors } from '@/config/colors';

interface FormatTextProps {
  kalimat: string;
  indexActive: number;
}

function Silabisasi(kata: string) {
  let hasil = kata.normalize("NFC"); 

  hasil = hasil.replace(
    /([aeiouê])(ng|ny|th|dh|ch|[bcdfghjklmnpqrstvwxyz])(?=[aeiouê])/gi,
    "$1-$2"
  );

  hasil = hasil.replace(
    /([aeiouê])([bcdfghjklmnpqrstvwxyz])(?=(ng|ny|th|dh|ch|[bcdfghjklmnpqrstvwxyz])[aeiouê])/gi,
    "$1$2-"
  );

  hasil = hasil.replace(/([aeiouê])(?=[aeiouê])/gi, "$1-");

  return hasil.split('-');
}

export default function TeksHighlight({ kalimat, indexActive }: FormatTextProps) {
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
    <View style={styles.container}>
      {perSukuKata.map((potongan, index) => {
        const sukuKataActive = index === indexActive;

        return (
          <Text
            key={index}
            style={[
              styles.textBase,
              sukuKataActive ? styles.highlightText : styles.normalText,
            ]}
          >
            {potongan}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBase: {
    fontSize: 36,
    fontFamily: 'Fraunces-Bold',
    fontWeight: 'bold',
  },
  normalText: {
    color: Colors.textDark,
  },
  highlightText: {
    color: Colors.orange,
    backgroundColor: '#FFE3C8',
    paddingHorizontal: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
});