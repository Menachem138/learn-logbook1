import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/components/auth/AuthProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { configurePushNotifications, registerForPushNotificationsAsync } from './src/utils/notifications';

export default function App() {
  useEffect(() => {
    // Configure notifications when app starts
    configurePushNotifications();
    registerForPushNotificationsAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
