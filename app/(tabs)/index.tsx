import React, { useContext, useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CopilotStep, walkthroughable, useCopilot, CopilotProvider } from 'react-native-copilot';

import { globalDataContext } from '@/app/_layout';
import { Colors } from '@/config/colors';

import { dataLevel } from '@/components/exercise/dataLevel';
import LevelGenerator from '@/components/exercise/levelGenerator';

const CopilotView = walkthroughable(View);

function LatihanContent() {
  const { user } = useContext(globalDataContext);
  const { start, stop } = useCopilot();

  const [hasOpenedBefore, setHasOpenedBefore] = useState<boolean>(false);

  const handleStartWalkthrough = useCallback(() => {
    start().catch(() => {});
  }, [start]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/bg.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={2}
      >
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.header}>
          {/* Step 1: Profil Nama */}
          <CopilotStep
            text="Ini adalah profil dan nama pengguna kamu."
            order={1}
            name="profileHeader"
          >
            <CopilotView style={styles.headerProfile}>
              <View style={styles.avatarCircle}>
                <Ionicons name='person' size={22} color={Colors.primary} />
              </View>
              <Text 
                style={styles.headerNameText} 
                numberOfLines={1} 
                ellipsizeMode="tail"
              >
                {user?.nama || 'Nadhif'}
              </Text>
            </CopilotView>
          </CopilotStep>
          
          <View style={styles.headerRightGroup}>
            {/* Step 2: Koin / Poin */}
            <CopilotStep
              text="Ini adalah total poin atau koin yang kamu kumpulkan."
              order={2}
              name="scoreHeader"
            >
              <CopilotView style={styles.headerScore}>
                <Image
                  source={require('../../assets/images/coin.png')}
                  style={styles.headerScoreIcon}
                />
                <Text style={styles.headerScoreText}>{user?.poin || '1200'}</Text>
              </CopilotView>
            </CopilotStep>

            <TouchableOpacity 
              style={styles.helpButton} 
              onPress={handleStartWalkthrough}
              activeOpacity={0.7}
            >
              <Ionicons name="help-circle-outline" size={24} color={Colors.textDark} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Container Level Generator tanpa CopilotStep wrapper */}
        <View style={styles.levelContainerWrapper}>
          <LevelGenerator
            data={dataLevel}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

export default function LatihanScreen() {
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
      <LatihanContent />
    </CopilotProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    backgroundColor: Colors.secondary, 
    paddingHorizontal: 20,
    paddingTop: 45, 
    paddingBottom: 15,
    borderBottomWidth: 4,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1, 
    paddingRight: 10, 
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.text, 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.borderDark,
  },
  headerNameText: {
    fontSize: 18,
    fontFamily: 'Fraunces-Bold',
    color: Colors.textDark, 
    flexShrink: 1, 
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  headerScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0, 
  },
  headerScoreText: {
    fontSize: 18,
    fontFamily: 'Fraunces-Bold',
    color: Colors.textDark, 
  },
  headerScoreIcon: {
    width: 32,
    height: 32,
  },
  helpButton: {
    paddingLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelContainerWrapper: {
    flex: 1,
  },
});