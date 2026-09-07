import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileStatItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
}

export default function ProfileStatItem({ icon, label, value }: ProfileStatItemProps) {
  return (
    <View style={styles.statBox}>
      <Ionicons name={icon} size={22} color="#FFFFFF" style={styles.icon} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Balthazar-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 2,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Fraunces-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});