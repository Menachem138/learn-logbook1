import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { StudyTimer } from '../components/StudyTimer';

export default function TimerScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <StudyTimer />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
});
