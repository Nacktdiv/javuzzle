import React, { } from 'react';
import { StyleSheet, View, Image, ActivityIndicator, Text, Animated } from 'react-native';

export default function CustomSplashScreen() {
  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/maskot-head.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Javuzzle</Text>

      <ActivityIndicator size="large" color="#8B5A2B" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFECC8', // Warna krem pastel khas aplikasimu
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3E3224',
    letterSpacing: 1,
  },
  loader: {
    marginTop: 30,
  },
});