import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import CustomSplashScreen from '@/components/main/splashScreen'; 

export default function HomeScreen() {
  const router = useRouter();
  
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const checkOnboarding = async () => {
  //     try {
  //       console.log('splash screen aktif')
  //       await new Promise(resolve => setTimeout(resolve, 2500));
  //       console.log('splash screen selesai')

  //       const alreadyLaunched = await AsyncStorage.getItem('alreadyLaunched');
        
  //       if (alreadyLaunched === null) {
  //         router.replace('/onboarding');
  //       } else {
  //         setIsLoading(false);
  //       }
  //     } catch (error) {
  //       console.error("Gagal ngecek onboarding:", error);
  //       setIsLoading(false); 
  //     }
  //   };

  //   checkOnboarding();
  // }, []);

  const handleResetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('alreadyLaunched');
      alert('Data onboarding berhasil di-reset!');
      router.replace('/onboarding');
    } catch (error) {
      console.error(error);
    }
  };

  // if (isLoading) {
  //   return <CustomSplashScreen />;
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ini Halaman Utama (Index)</Text>
      
      <TouchableOpacity style={styles.btnReset} onPress={handleResetOnboarding}>
        <Text style={styles.btnText}>Reset & Tes Onboarding Lagi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FFECC8' 
  }, 
  text: { 
    fontSize: 18, 
    marginBottom: 20, 
    color: '#3E3224', 
    fontWeight: 'bold' 
  },
  btnReset: { 
    backgroundColor: '#d9534f', 
    padding: 12, 
    borderRadius: 8 
  },
  btnText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  }
});