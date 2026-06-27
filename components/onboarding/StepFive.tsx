import React, {useContext} from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { globalDataContext } from '@/app/_layout';
const { width } = Dimensions.get('window');

export default function StepFive() {
  const {userPlan} = useContext(globalDataContext)

  return (
    <View style={styles.slide}>
      <View
        style={styles.mainContainerBubble}  
      >
        <View
          style={styles.containerBubble}  
        >
          <Text
            style={styles.containerBubbleText}
          >
          Iki latihan {userPlan?.value || 0} menit pertamamu!
          </Text>
        </View>
        <View style={styles.arrowBubble} />
      </View>
      <Image
        source={require('@/assets/images/maskot-pena.png')}
        style={styles.image}
      />
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
    marginBottom: 100,
    height: '50%',
    resizeMode: 'contain',
  },
  mainContainerBubble: {
    position: 'relative', 
    top: 100,
    left: 50,
    zIndex: 1
  },
  arrowBubble: {
    width: 0,
    height: 0,
    marginLeft: 20,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderRightWidth: 40,
    borderRightColor: 'transparent',
    borderTopWidth: 40,
    borderTopColor: '#3E3224'
  },
  containerBubble: {
    backgroundColor: '#3E3224',
    width: 200,
    padding: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'

  },
  containerBubbleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  }
});