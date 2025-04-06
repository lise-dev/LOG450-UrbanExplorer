import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import ProfileScreen from "./ProfileScreen";
import ExploreScreen from './ExploreScreen';
import FavorisScreen from './FavorisScreen';
import EditProfileScreen from '../EditProfileScreen'
import ModerationScreen from './ModerationScreen';
import ContributionScreen from './ContributionScreen';
import { AuthContext } from '../../../AuthContext';
import Roles from '../../constants/roles';
import DetailScreen from '../DetailScreen';
import AddSpotScreen from '../AddSpotScreen';

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

const ExploreStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ExploreScreen" component={ExploreScreen} options={{headerShown: false, title: "Explorer"}} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} options={{headerShown: true, title: "Détail"}} />
      <Stack.Screen name="AddSpotScreen" component={AddSpotScreen} options={{headerShown: true, title: "Ajouter un nouveau lieu"}} />
    </Stack.Navigator>
  )
}

const FavoritesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FavoritesScreen" component={FavorisScreen} options={{headerShown: false, title: "Mes favoris"}} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} options={{headerShown: true, title: "Détail"}} />
    </Stack.Navigator>
  )
}

const MainTabs = () => {

  const { user, userData } = useContext(AuthContext);


  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
            name="Explore"
            component={ExploreStack}
            options={{
                tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color} />,
            }}
        />

      <Tab.Screen
        name="Favoris"
        component={FavoritesStack}
        options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="heart-circle" size={size} color={color} />,
        }}
      />
      
      {userData != null && userData["role"] === Roles.contributeur && (
        <Tab.Screen
          name="Contribution"
          component={ContributionScreen}
          options={{
              tabBarIcon: ({ color, size }) => <Ionicons name="extension-puzzle" size={size} color={color} />,
          }}
        />
      )}
      {userData != null && userData["role"] === Roles.moderateur && (
        <Tab.Screen
          name="Moderation"
          component={ModerationScreen}
          options={{
              tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} />,
          }}
        />
      )}
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
