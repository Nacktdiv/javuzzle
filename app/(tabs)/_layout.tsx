import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';

export default function TabsLayout() {

  useEffect(() => {
    if (Platform.OS === 'android') {
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