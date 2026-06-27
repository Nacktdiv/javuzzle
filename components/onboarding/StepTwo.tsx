import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';

const { width } = Dimensions.get('window');

export default function StepTwo() {
  return (
    <View style={styles.slide}>
      <Image
        source={require('@/assets/images/maskot-half.png')}
        style={styles.image}
      />
      <View style={styles.spacer}/>
      <View style={styles.textContainer}>
        <Text style={styles.subtitle}>Sugeng Rawuh - Welcome</Text>
        <Text style={styles.title}>Tulis Aksara, uri-uri budaya</Text>
        <Text style={styles.subtitle}>Wiwiti perjalananmu saiki</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    position: 'relative',
    width: width,
  },
  image: {
    position: 'absolute',
    height: 300,
    resizeMode: 'contain',
    top: '35%',
    transform: [{ translateY: '-50%' }],
    left: -50,
  },
  spacer: {
    height: 300,
  },
  textContainer: {
    // flex:1,
    justifyContent: 'flex-start', // Mengatur semua teks pas di tengah vertikal ruang kosong
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 5,      // Memaksa teks berada di lapisan paling depan
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#3E3224',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6F614B',
    textAlign: 'center',
    lineHeight: 24,
  },
});