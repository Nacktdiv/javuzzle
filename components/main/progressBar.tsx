import { View, Animated, StyleSheet } from 'react-native'
import { useRef, useEffect } from 'react'

type mainType = {
    progress: number 
}

export default function ProgressBar ({progress} : mainType) {
    const animatedWidth = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.timing(animatedWidth, {
            toValue: progress,
            duration: 500, 
            useNativeDriver: false 
        }).start()
    }, [progress])

    const widthInterpolate = animatedWidth.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%']
    })
    
    return (
        <View
            style={[
                styles.progressContainer
            ]}
        >
            <Animated.View
                style={[
                    styles.progressBar,
                    {width: widthInterpolate}
                ]}
            >
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    progressContainer : {
        height: 20,
        width: '100%',
        borderRadius: 10,
        backgroundColor: '#e0e0e0',
        overflow: 'hidden'
    }, 
    progressBar : {
        height: '100%',
        borderRadius: 10,
        backgroundColor: '#6E4720'
    }
})