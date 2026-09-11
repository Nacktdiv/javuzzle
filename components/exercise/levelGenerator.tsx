import React, { useContext } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { CopilotStep, walkthroughable } from 'react-native-copilot';

import { globalDataContext } from '@/app/_layout';
import { Colors } from '@/config/colors';

const { width } = Dimensions.get('window');

// Wrappers untuk react-native-copilot
const CopilotView = walkthroughable(View);
const CopilotTouchableOpacity = walkthroughable(TouchableOpacity);

export default function LevelGenerator({ data }: { data: any[] }) {
  const router = useRouter();
  const { user } = useContext(globalDataContext);

  const getMarginLeft = (index: number) => {
    const amplitude = 70; 
    const frequency = 1.2;
    const xOffset = Math.sin(index * frequency) * amplitude;
    return (width / 2) - 45 + xOffset; 
  };

  let globalLevelIndex = 0;

  const streakDays = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];
  const activeDaysCount = 4; 

  return (
    <ScrollView 
      scrollEventThrottle={16}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Step 3: Rangkaian Latihan / Streak */}
      <CopilotStep
        text="Ini adalah rangkaian latihan kamu. Latihan setiap hari untuk menjaga streak dan konsistensimu!"
        order={3}
        name="streakCardStep"
      >
        <CopilotView style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <View style={styles.fireIconWrapper}>
              <Text style={styles.fireIconText}>🔥</Text>
            </View>
            <View>
              <Text style={styles.streakTitle}>Rangkaian Latihan</Text>
              <Text style={styles.streakSubtitle}>4 Hari Berurutan</Text>
            </View>
          </View>
          <View style={styles.daysContainer}>
            {streakDays.map((day, index) => {
              const isActive = index < activeDaysCount;
              return (
                <View key={index} style={[styles.dayCircle, isActive && styles.dayActive]}>
                  <Text style={[styles.dayText, isActive && styles.dayTextActive]}>{day}</Text>
                </View>
              );
            })}
          </View>
        </CopilotView>
      </CopilotStep>

      {data.map((bagian) => (
        <View key={bagian.bagianId} style={styles.bagianContainer}>
          
          <View style={styles.bagianHeadlineContainer}>
            <Text style={styles.bagianHeadlineText}>{bagian.namaBagian.toUpperCase()}</Text>
          </View>

          {bagian.units.map((unit: any) => {
            return (
              <View key={unit.unitId} style={styles.unitContainer}>
                
                <View style={styles.unitHeadlineContainer}>
                    <View style={styles.unitDashedLine} />
                    <View style={styles.unitTextWrapper}>
                      <Text style={styles.unitHeadlineText}>UNIT {unit.unitId}</Text>
                      <Text style={styles.unitHeadlineSubText}>{unit.namaUnit}</Text>
                    </View>
                    <View style={styles.unitDashedLine} />
                </View>

                <View style={styles.levelsPath}>
                  {user?.level && unit.levels.map((level: any) => {
                    const isCompleted = level.id < user.level;
                    const isActive = level.id === user.level;
                    const isLocked = level.id > user.level;

                    let buttonType = require('../../assets/images/levelUnlocked.png');
                    if (isCompleted) buttonType = require('../../assets/images/levelComplete.png');
                    if (isActive) buttonType = require('../../assets/images/levelActive.png');

                    const marginLeftValue = getMarginLeft(globalLevelIndex);
                    const isFirstLevel = globalLevelIndex === 0;
                    globalLevelIndex++; 

                    const renderButton = (
                      <TouchableOpacity
                        disabled={isLocked}
                        style={styles.levelButton}
                        activeOpacity={0.8}
                        onPress={() => router.push({
                          pathname: `/(mode)/${level.type}`,
                          params: {
                            question: level.question,
                            level: level.level,
                            poin: level.poin,
                            audio: level.audio
                          }
                        })}
                      >
                        <ImageBackground
                          source={buttonType}
                          style={styles.buttonStyle}
                          resizeMode='cover'
                        >
                          <Text style={styles.textLevelButton}>{level.level}</Text>
                        </ImageBackground>
                      </TouchableOpacity>
                    );

                    return (
                      <View 
                        key={level.id} 
                        style={[
                          styles.levelWrapper, 
                          isActive && styles.activeWrapper,
                          { marginLeft: marginLeftValue }
                        ]}
                      >
                        {isActive && <View style={styles.activeRing} />}

                        {/* Step 4: Menyorot Level Pertama/Aktif */}
                        {isFirstLevel ? (
                          <CopilotStep
                            text="Ketuk tombol level ini untuk mulai mengerjakan latihan dan tantangan aksara!"
                            order={4}
                            name="activeLevelButton"
                          >
                            <CopilotView style={styles.levelButtonWrapper}>
                              {renderButton}
                            </CopilotView>
                          </CopilotStep>
                        ) : (
                          renderButton
                        )}
                      </View>
                    );
                  })}
                </View>

              </View>
            );
          })}

        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 20,
    paddingBottom: 40, 
  },

  streakCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginBottom: 25,
    padding: 16,
    borderRadius: 16,
    borderBottomWidth: 4,
    borderBottomColor: Colors.borderDark,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fireIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fireIconText: {
    fontSize: 22,
  },
  streakTitle: {
    color: Colors.text,
    fontFamily: 'Playfair-Display-Bold',
    fontSize: 14,
  },
  streakSubtitle: {
    color: Colors.backgroundDark,
    fontFamily: 'Playfair-Display-Bold',
    fontSize: 12,
    marginTop: 2,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayActive: {
    backgroundColor: Colors.orange,
  },
  dayText: {
    color: Colors.secondary,
    fontFamily: 'Fraunces-Bold',
    fontSize: 12,
  },
  dayTextActive: {
    color: Colors.textDark,
  },

  // STYLES BAGIAN/SECTION
  bagianContainer: {
    marginBottom: 10,
  },
  bagianHeadlineContainer: {
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 20,
    borderRadius: 12,
    backgroundColor: Colors.gold,
    borderBottomWidth: 4,
    borderBottomColor: Colors.primaryDark,
    justifyContent: 'center',
  },
  bagianHeadlineText: {
    fontSize: 20,
    fontFamily: 'Fraunces-Bold',
    color: Colors.text,
    letterSpacing: 0.5,
    textAlign: 'left',
    lineHeight: 28,
  },

  // STYLES UNIT
  unitContainer: {
    marginVertical: 10,
  },
  unitHeadlineContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitTextWrapper: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  unitHeadlineText: {
    color: Colors.primaryDark,
    fontSize: 16,
    fontFamily: 'Fraunces-Bold',
    textAlign: 'center',
  },
  unitHeadlineSubText: {
    color: Colors.primaryDark,
    fontSize: 16,
    fontFamily: 'Fraunces-Bold',
    marginTop: 2,
    textAlign: 'center',
  },
  unitDashedLine: {
    width: 40,                  
    borderStyle: 'dashed',     
    borderBottomWidth: 3,     
    borderBottomColor: Colors.primaryDark,
    height: 1, 
    marginTop: -8,            
  },

  // STYLES LEVELS
  levelsPath: {
    position: 'relative',
    gap: 30
  },
  levelWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  activeWrapper: {
    marginVertical: 10,
  },
  levelButtonWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  textLevelButton: {
    textAlign: 'center',
    fontSize: 32,
    fontFamily: 'Fraunces-Bold',
    color: Colors.text
  },
  buttonStyle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  activeRing: {
    position: 'absolute',
    width: 125,
    height: 125,
    borderRadius: 62.5,
    borderWidth: 6,
    borderColor: Colors.text,
    borderStyle: 'dashed',
    zIndex: 1,
  },
});