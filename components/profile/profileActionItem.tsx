import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/config/colors';

interface ProfileActionItemProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  bgColor: string;
  onPress: () => void;
  isLast?: boolean;
}

export default function ProfileActionItem({ 
  label, 
  icon, 
  iconColor, 
  bgColor, 
  onPress, 
  isLast = false 
}: ProfileActionItemProps) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.itemContainer} onPress={onPress} activeOpacity={0.6}>
        <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
          <Ionicons name={icon} size={25} color={iconColor} />
        </View>
        <Text style={styles.labelText}>{label}</Text>
      </TouchableOpacity>
      {!isLast && <View style={styles.borderBottom} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  labelText: {
    fontSize: 18,
    fontFamily: 'Balthazar-Regular',
    color: Colors.textDark,
  },
  borderBottom: {
    height: 1,
    backgroundColor: Colors.border,
    opacity: 0.4,
    marginLeft: 60, // Menyesuaikan agar garis mulai dari teks, bukan dari ujung kiri
  },
});