/**
 * Main navigation configuration
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Import screens (will be created next)
import LoginScreen from '../screens/LoginScreen';
import MapScreen from '../screens/MapScreen';
import LocationDetailScreen from '../screens/LocationDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          component={MapScreen}
          options={{ title: '1co926 - Sales Support' }}
        />
        <Stack.Screen 
          name="LocationDetail" 
          component={LocationDetailScreen}
          options={{ title: 'Location Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
