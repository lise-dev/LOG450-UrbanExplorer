import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="test"
        options={{
          title: 'TestScreen',
          tabBarIcon: <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
