import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';

const { width } = Dimensions.get('window');

export default function StepOne() {
  return (
    <View style={styles.slide}>
      <Image
        source={require('@/assets/images/maskot-hello.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Sugeng Rawuh datheng Javuzzle!</Text>
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
    gap: 20,
  },
  image: {
    height: '50%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E3224',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: '#6F614B',
    textAlign: 'center',
    lineHeight: 24,
  },
});