import React, { useState, createContext } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useRouter,  Slot } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from '@/components/main/progressBar';

export const ModeContext = createContext<any>(null)

export default function ModeLayout () {
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
                        <Ionicons name="caret-back" size={26} color='#6f411d'/>
                    </TouchableOpacity>
                    <View style={[styles.headerComponent, {marginHorizontal: 20}]}>
                        <Ionicons name='game-controller' size={26} color='#FFECC8' />
                        <Text style={[styles.headerComponentText, {color: '#FFECC8'}]}>Level 1</Text>
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
        backgroundColor: '#6f411d'
    },
    header: {
        backgroundColor: '#cb9163', 
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomWidth: 4,
        borderBottomColor: '#6f411d',
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
        backgroundColor : '#FFECC8',
        borderRadius: 10
    },
    headerComponentText: {
        fontSize: 18,
        fontFamily: 'Fraunces-Bold',
    }
})