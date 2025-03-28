import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import ProfileScreen from "../(tabs)/ProfileScreen";
import ExploreScreen from './ExploreScreen';
import FavorisScreen from './FavorisScreen';
import EditProfileScreen from '../screens/EditProfileScreen'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'Mon profil' }} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ title: 'Modifier le profil' }} />
    </Stack.Navigator>
  );
};

// const TestStack = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="TestMain" component={TestScreen} options={{ title: 'Test' }} />
//       <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Détails' }} />
//     </Stack.Navigator>
//   );
// };

const MainTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
            name="Explore"
            component={ExploreScreen}
            options={{
                tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color} />,
            }}
        />
      <Tab.Screen
        name="Favorris"
        component={FavorisScreen}
        options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="heart-circle" size={size} color={color} />,
        }}
      />
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
          }}
        />
    </Tab.Navigator>
  );
};

export default MainTabs;
