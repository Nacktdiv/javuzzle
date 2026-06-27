import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { globalDataContext } from '@/app/_layout'
import { supabase } from '@/config/supabase.web';

// Import komponen halaman terpisah yang sudah kamu buat di folder components
import StepOne from '@/components/onboarding/StepOne';
import StepTwo from '@/components/onboarding/StepTwo';
import StepThree from '@/components/onboarding/StepThree';
import StepFour from '@/components/onboarding/StepFour';
import StepFive from '@/components/onboarding/StepFive';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const {user} = useContext(globalDataContext)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const router = useRouter();
  const totalSteps = 5;

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      if (currentStep === 4 && !user?.study_plan) {
        alert("Masukkan rencana belajar yang sesuai terlebih dahulu")
      } else if (currentStep === 4 && user?.study_plan) {
        const {data, error} = await supabase
          .from('users')
          .update({study_plan: user?.study_plan})
          .eq('id', user?.id)
        if (error) {
          alert('Gagal melakukan update study plan ke database: ' + error)
        }
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      try {
        router.replace('/(tabs)');
      } catch (error) {
        console.error('Gagal menyimpan status onboarding:', error);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
    }
  };

  // Fungsi merender halaman berdasarkan step aktif
  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepOne />;
      case 2: return <StepTwo />;
      case 3: return <StepThree />;
      case 4: return <StepFour />;
      case 5: return <StepFive />;
      default: return <StepOne />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Memastikan Header bawaan Stack tidak muncul dan menyembunyikan Tabs */}
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />

      {/* 1. Header Area (Tombol Lewati / Skip) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace ('/auth')} activeOpacity={0.6}>
            <Text style={styles.skipText}>Lewati</Text>
          </TouchableOpacity>
      </View>

      {/* 2. Konten Utama (Komponen Terpisah) */}
      <View style={styles.contentContainer}>
        {renderStep()}
      </View>

      {/* 3. Footer Area (Indikator & Tombol Navigasi) */}
      <View style={styles.footer}>
        {/* Indikator Titik (Pagination Dots) */}
        <View style={styles.indicatorContainer}>
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            return (
              <View
                key={stepNumber}
                style={[
                  styles.indicator,
                  currentStep === stepNumber ? styles.indicatorActive : styles.indicatorInactive,
                ]}
              />
            );
          })}
        </View>

        {/* Area Tombol Navigasi Bawah */}
        <View style={styles.buttonContainer}>
        
        {/* Tombol Kembali (Hanya muncul jika step > 1) */}
        {currentStep > 1 ? (
            <TouchableOpacity 
            style={[styles.navButton, styles.backButton]} 
            onPress={handleBack}
            activeOpacity={0.7}
            >
            <Text style={styles.backButtonText}>Kembali</Text>
            </TouchableOpacity>
        ) : (
            <></> 
        )}

        {/* Tombol Lanjutkan / Mulai */}
        <TouchableOpacity 
            style={[styles.navButton, styles.nextButton]} 
            onPress={handleNext}
            activeOpacity={0.8}
        >
            <Text style={styles.nextButtonText}>
            {currentStep === totalSteps ? 'Mulai Sekarang' : 'Lanjutkan'}
            </Text>
        </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFECC8', // Latar belakang pastel hangat serasi dengan splash screen
  },
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6F614B', // Warna cokelat gelap yang kontras tapi lembut
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4
  },
  indicatorActive: {
    width: 24, // Efek memanjang seperti kapsul untuk halaman aktif
    backgroundColor: '#3E3224',
  },
  indicatorInactive: {
    width: 8,
    backgroundColor: '#E6D3B3',
  },
  buttonContainer: {
    flexDirection: 'row', // Membuat tombol berjajar ke samping
    width: width - 48,
    gap: 16, // Jarak antar tombol
  },
  navButton: {
    flex: 1, // Agar kedua tombol punya lebar yang sama (50:50)
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3E3224', // Outline cokelat arang
  },
  nextButton: {
    backgroundColor: '#3E3224',
    elevation: 4,
    shadowColor: '#3E3224',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  backButtonText: {
    color: '#3E3224',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});