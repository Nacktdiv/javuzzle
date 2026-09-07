import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';

import { Colors } from '@/config/colors';

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
        tabBarActiveTintColor: Colors.primaryDark, 
        tabBarInactiveTintColor: Colors.text,      
        tabBarStyle: {
          backgroundColor: Colors.secondary, 
          borderTopWidth: 0, 
          borderTopLeftRadius: 30, 
          borderTopRightRadius: 30,
          height: 75,
          position: 'absolute', 
          elevation: 0,        
          shadowOpacity: 0,    
        },
        tabBarItemStyle: {
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',     
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Fraunces-Bold',
          fontSize: 13,
          marginTop: 4
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
          title: 'Peringkat',
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