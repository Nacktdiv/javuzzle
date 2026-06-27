import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { globalDataContext } from '@/app/_layout'
import { dataLevel } from '@/components/exercise/dataLevel';
import LevelGenerator from '@/components/exercise/levelGenerator';

export default function LatihanScreen() {
  const { user } = useContext(globalDataContext)

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <View style={styles.headerComponent}>
          <Ionicons name='person-outline' size={26} color='#FFF' />
          <Text style={[styles.headerComponentText, {color: '#FFF'}]}>{user?.nama}</Text>
        </View>
        <View style={styles.headerComponent}>
          <Ionicons name='star' size={26} color='#FFD700' />
          <Text style={[styles.headerComponentText, {color: '#FFD700'}]}>{user?.level}</Text>
        </View>
        <View style={styles.headerComponent}>
          <Ionicons name='diamond-outline' size={26} color='#B9F2FF' />
          <Text style={[styles.headerComponentText, {color: '#B9F2FF'}]}>{user?.poin}</Text>
        </View>
      </View>
      
      <LevelGenerator
        data={dataLevel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFECC8',
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap:4
  },
  headerComponentText: {
    fontSize: 18,
    fontFamily: 'Playfair-Display-Bold'
  }
});