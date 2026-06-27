import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function StepThree() {
  return (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Text style={styles.emoji}>🔥</Text>
      </View>
      
      <Text style={styles.title}>Atur Jadwal Latihanmu Sekarang!</Text>
      <Text style={styles.subtitle}>
        Bangun kebiasaan kanthi sistem streak, kuis mingguan, lan penghargaan budaya.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    width: width,
  },
  imageContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFF7E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    elevation: 2,
    shadowColor: '#3E3224',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3E3224',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6F614B',
    textAlign: 'center',
    lineHeight: 24,
  },
});