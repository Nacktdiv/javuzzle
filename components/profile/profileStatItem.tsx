import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

interface ProfileStatItemProps {
  label: string;
  value: string | number;
}

const { width } = Dimensions.get('window');

export default function ProfileStatItem({ label, value }: ProfileStatItemProps) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  statValue: {
    fontSize: width * 0.05,
    fontFamily: 'Fraunces-Bold',
    color: '#FFECC8',
  },
  statLabel: {
    fontSize: 13,
    fontFamily: 'Balthazar-Regular',
    color: '#FFECC8',
    marginTop: 2,
  },
});