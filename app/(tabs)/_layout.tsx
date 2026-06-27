import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';

export default function TabsLayout() {

  useEffect(() => {
    // Pastikan fungsi ini hanya berjalan di Android (karena iOS tidak punya tombol ini)
    if (Platform.OS === 'android') {
      // PILIHAN A: Sembunyikan total (Akan muncul sedikit jika user swipe layar dari bawah ke atas)
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3E3224',
        tabBarInactiveTintColor: '#A08E75',
        tabBarStyle: {
          backgroundColor: '#FFF7E6', 
          borderTopWidth: 1,
          borderTopColor: '#E6D3B3',
          paddingTop: 10,
          height: 80
        },
        tabBarItemStyle: {
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',     
          height: '100%',   
        },
        tabBarLabelStyle: {
          fontFamily : 'Playfair-Display-Bold',
          fontSize: 12,
          marginTop: 6
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Latihan',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons 
                name={focused ? 'game-controller' : 'game-controller-outline'} 
                size={26}
                color={color} 
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="materi"
        options={{
          title: 'Materi',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons 
                name={focused ? 'book' : 'book-outline'} 
                size={26} 
                color={color} 
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons 
                name={focused ? 'trophy' : 'trophy-outline'} 
                size={26} 
                color={color} 
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons 
                name={focused ? 'person' : 'person-outline'} 
                size={26} 
                color={color} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}