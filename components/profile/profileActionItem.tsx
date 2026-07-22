import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '@/config/colors';

interface ProfileActionItemProps {
  label: string;
  onPress: () => void;
  isDanger?: boolean;
}

const { width } = Dimensions.get('window');

export default function ProfileActionItem({ label, onPress, isDanger = false }: ProfileActionItemProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, isDanger ? styles.dangerButton : styles.normalButton]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, isDanger ? styles.dangerText : styles.normalText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: width * 0.035,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalButton: {
    backgroundColor: Colors.gold,
    borderColor: Colors.borderDark,
  },
  dangerButton: {
    backgroundColor: Colors.danger,
    borderColor: Colors.borderDark,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Fraunces-Bold',
  },
  normalText: {
    color: Colors.text,
  },
  dangerText: {
    color: Colors.text,
  },
});