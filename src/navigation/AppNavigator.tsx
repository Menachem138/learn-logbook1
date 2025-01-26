import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../components/auth/AuthProvider';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import NotificationTestScreen from '../screens/NotificationTestScreen';
import TimerScreen from '../screens/TimerScreen';
import JournalScreen from '../screens/JournalScreen';
import CourseScreen from '../screens/CourseScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="NotificationTest" component={NotificationTestScreen} />
            <Stack.Screen name="Timer" component={TimerScreen} />
            <Stack.Screen name="Journal" component={JournalScreen} />
            <Stack.Screen name="Course" component={CourseScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
