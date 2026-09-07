import React, { useState, createContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Slot, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CopilotProvider, useCopilot } from 'react-native-copilot';

import { Colors } from '@/config/colors';
import ProgressBar from '@/components/main/progressBar';

export const ModeContext = createContext<{
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setOnHelpPress: React.Dispatch<React.SetStateAction<(() => void) | null>>;
}>({
  progress: 0,
  setProgress: () => {},
  setOnHelpPress: () => {},
});

function HeaderHelpButton({ onHelpPress }: { onHelpPress: (() => void) | null }) {
  const { start } = useCopilot();

  const handlePress = () => {
    if (onHelpPress) {
      onHelpPress();
    } else {
      start();
    }
  };

  return (
    <TouchableOpacity
      style={styles.helpButton}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Ionicons name="help-circle-outline" size={28} color={Colors.textDark} />
    </TouchableOpacity>
  );
}

function LayoutContent() {
  const { level: levelParam } = useLocalSearchParams<{ level: string }>();
  const router = useRouter();
  const [progress, setProgress] = useState<number>(0);
  const [onHelpPress, setOnHelpPress] = useState<(() => void) | null>(null);

  return (
    <ModeContext.Provider value={{ progress, setProgress, setOnHelpPress }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContainer}>
          {/* Header Bar */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/(tabs)');
                }
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={28} color={Colors.textDark} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Level {levelParam || 1}</Text>

            {/* Tombol Bantuan (?) */}
            <HeaderHelpButton onHelpPress={onHelpPress} />
          </View>

          {/* Progress Bar Container */}
          <View style={styles.progressContainer}>
            <ProgressBar progress={progress} />
          </View>

          {/* Render Screen Anak (PuzzleMode / CanvasMode) */}
          <Slot />
        </View>
      </SafeAreaView>
    </ModeContext.Provider>
  );
}

export default function ModeLayout() {
  return (
    <CopilotProvider
      stopOnOutsideClick
      androidStatusBarVisible
      verticalOffset={24}
      backdropColor="rgba(0, 0, 0, 0.6)"
      labels={{
        previous: 'Sebelumnya',
        next: 'Lanjut',
        skip: 'Lewati',
        finish: 'Selesai',
      }}
    >
      <LayoutContent />
    </CopilotProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Fraunces-Bold',
    color: Colors.textDark,
  },
  helpButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  progressContainer: {
    marginVertical: 10,
  },
});