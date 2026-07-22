import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { Colors } from '@/config/colors';

export default function Header({ isLoginMode } : { isLoginMode : boolean }) {
  return (
    <View style={styles.logoSection}>
      <View style={styles.logoCircle}>
        <Image style={styles.logoImage} source={require('@/assets/images/maskot-head.png')}/>
      </View>
      <Text style={styles.title}>Javuzzle</Text>
      <Text style={styles.subtitle}>
        {isLoginMode ? 'Mulai petualangan belajarmu hari ini' : 'Buat akun untuk menyimpan progres belajarmu'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoSection: {
    alignItems: 'center',
    marginBottom: 35,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    aspectRatio: 1
  },
  title: {
    fontSize: 30,
    fontFamily: 'Fraunces-Bold',
    color: Colors.accent,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Balthazar-Regular',
    color: Colors.textDark,
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 10,
  },
});