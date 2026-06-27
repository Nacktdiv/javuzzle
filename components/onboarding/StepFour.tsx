import React, {useContext} from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import { globalDataContext } from '@/app/_layout';

const { width } = Dimensions.get('window');

interface objectButtonType {
  value: number;
  label: string;
}

const buttonData : Array<objectButtonType> = [
  {value: 3, label:"Santai"},
  {value: 5, label:"Biasa"},
  {value: 10, label:"Serius"},
  {value: 15, label:"Hebat"},
]

export default function StepOne() {
  const {user, setUser} = useContext(globalDataContext)

  return (
    <View style={styles.slide}>
      <Image
        source={require('@/assets/images/maskot-hello.png')}
        style={styles.image}
      />
      {
        buttonData.map((item, index) => {
          return (
            <TouchableOpacity 
              style={[styles.button, user?.study_plan === item.value && styles.buttonActive]}
              key={index}
              onPress={() => setUser((prev) => {
                if(!prev) {
                  return null
                };
                return {...prev, study_plan : item.value}
              })}
              >
              <Text style={[styles.buttonText, user?.study_plan === item.value && styles.buttonTextActive]}>{item.value} Menit/Hari</Text>
              <Text style={[styles.buttonText, user?.study_plan === item.value && styles.buttonTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          )
        })
      }
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
    height: '50%',
    resizeMode: 'contain',
  }, 
  button: {
    width: '100%',
    height: 50,
    borderWidth: 2,
    borderColor: '#3E3224',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5
  }, 
  buttonActive: {
    backgroundColor: '#3E3224',
    borderWidth: 0
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3E3224',
    textAlign: 'center', 
  }, 
  buttonTextActive: {
    color: '#FFFFFF'
  }
});