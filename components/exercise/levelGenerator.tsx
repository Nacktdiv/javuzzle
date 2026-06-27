import React, { useContext } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import { useRouter } from 'expo-router'

import { globalDataContext } from '@/app/_layout';

const { width } = Dimensions.get('window');

export default function LevelGenerator({ data }: { data: any[] }) {
  const router = useRouter()
  const { user } = useContext(globalDataContext)

  const getMarginLeft = (index: number) => {
    const amplitude = 70; 
    const frequency = 1.2;
    const xOffset = Math.sin(index * frequency) * amplitude;
    return (width / 2) - 45 + xOffset; 
  };

  let globalLevelIndex = 0;

  return (
    <ScrollView 
      scrollEventThrottle={16}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
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
                    <Text style={styles.unitHeadlineText}>UNIT {unit.unitId}</Text>
                    <Text style={styles.unitHeadlineSubText}>{unit.namaUnit}</Text>
                    <View style={styles.unitDashedLine} />
                </View>

                <View style={styles.levelsPath}>
                  {user?.level && unit.levels.map((level: any) => {
                    const isCompleted = level.id < user.level
                    const isActive = level.id === user.level
                    const isLocked = level.id > user.level;

                    let buttonStyle = styles.btnLocked;
                    if (isCompleted) buttonStyle = styles.btnCompleted;
                    if (isActive) buttonStyle = styles.btnActive;

                    const marginLeftValue = getMarginLeft(globalLevelIndex);
                    globalLevelIndex++; 

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

                        <TouchableOpacity
                          disabled={isLocked}
                          style={[styles.levelButton, buttonStyle]}
                          activeOpacity={0.8}
                          onPress={() => router.push({
                            pathname: `/(mode)/${level.type}`,
                            params: {
                              question: level.question,
                              level: level.level,
                              poin: level.poin
                            }
                          })}
                        >
                          <Text style={styles.textLevelButton}>{level.level}</Text>
                        </TouchableOpacity>
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
    paddingBottom: 0, 
  },
  bagianContainer: {
    marginBottom: 10,
  },
  bagianHeadlineContainer: {
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 16,
    borderRadius: 16,
    borderBottomWidth: 4,
    backgroundColor: '#8B5A2B',
    borderBottomColor: '#6E4720',
  },
  bagianHeadlineText: {
    fontSize: 18,
    fontFamily: 'Fraunces-Bold',
    color: '#fff',
    letterSpacing: 1,
  },
  unitContainer: {
    marginVertical: 20,
  },
  unitHeadlineContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unitHeadlineText: {
    color: '#3E3224',
    fontSize: 16,
    fontFamily: 'Fraunces-Bold',
    marginRight: 5,
    textAlign:'center',
    textAlignVertical:'center'
  },
  unitHeadlineSubText: {
    color: '#3E3224',
    fontSize: 16,
    fontFamily: 'Fraunces-Bold',
    marginTop: 2,
    flex:1,
    textAlign:'center',
    textAlignVertical:'center'
  },
  unitDashedLine: {
    width: 40,                  
    borderStyle: 'dashed',     
    borderBottomWidth: 2,     
    borderBottomColor: '#A08E75',
    height: 1, 
    margin: 10,             
  },
  levelsPath: {
    position: 'relative',
    gap:30
  },
  levelWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
  },
  activeWrapper: {
    marginVertical: 10,
  },
  levelButton: {
    width: '100%',
    height: '100%',
    borderRadius: 45, 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  textLevelButton: {
    fontSize: 28,
    fontFamily: 'Fraunces-Bold',
    color: '#FFFFFF'
  },
  btnCompleted: {
    backgroundColor: '#8B5A2B',
    borderBottomWidth: 6,
    borderBottomColor: '#6E4720',
  },
  btnActive: {
    backgroundColor: '#E6A15C',
    borderBottomWidth: 6,
    borderBottomColor: '#C48443',
  },
  btnLocked: {
    backgroundColor: '#D2C5B4',
    borderBottomWidth: 6,
    borderBottomColor: '#B5A898',
  },
  activeRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: '#E6A15C',
    borderStyle: 'dashed',
    zIndex: 1,
  },
});