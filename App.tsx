import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from './src/config/supabase';
import { configurePushNotifications, registerForPushNotificationsAsync } from './src/utils/notifications';
import { ConfigTest } from './src/components/ConfigTest';

export default function App() {
  useEffect(() => {
    // Configure notifications when app starts
    configurePushNotifications();
    registerForPushNotificationsAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Learn Logbook Mobile</Text>
        <ConfigTest />
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
