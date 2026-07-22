import React, { useState, createContext } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useRouter,  Slot, useLocalSearchParams} from 'expo-router'
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/config/colors';

import ProgressBar from '@/components/main/progressBar';

export const ModeContext = createContext<any>(null)

export default function ModeLayout () {
    const { question, level: levelParam, poin: poinParam } = useLocalSearchParams<{ 
        question: string; 
        level: string; 
        poin: string; 
    }>();
    const router = useRouter()

    const [progress, setProgress] = useState<number>(0)

    return (
        <ModeContext.Provider value={{ progress, setProgress }}>
            <View style={styles.mainContainer}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.headerPressable}
                        onPress={() => {
                            if(router.canGoBack()){
                                router.back()
                            } else {
                                router.replace('/(tabs)')
                            }
                        }}    
                    >
                        <Ionicons name="caret-back" size={26} color={Colors.text}/>
                    </TouchableOpacity>
                    <View style={[styles.headerComponent, {marginHorizontal: 20}]}>
                        <Ionicons name='game-controller' size={26} color={Colors.gold} />
                        <Text style={[styles.headerComponentText, {color: `${Colors.text}`}]}>Level {levelParam}</Text>
                    </View>
                    
                    <View style={[styles.headerComponent, {flex: 1}]}>
                        <ProgressBar
                            progress={progress}
                        />
                    </View>
                </View>
                <Slot/>
            </View>
        </ModeContext.Provider>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        flex: 1,
        backgroundColor: Colors.primary
    },
    header: {
        backgroundColor: Colors.border, 
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomWidth: 4,
        borderBottomColor: Colors.borderDark,
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerComponent: {
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap:4
    },
    headerPressable: {
        width: 40,
        height : '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor : Colors.gold,
        borderRadius: 10
    },
    headerComponentText: {
        fontSize: 18,
        fontFamily: 'Fraunces-Bold',
    }
})