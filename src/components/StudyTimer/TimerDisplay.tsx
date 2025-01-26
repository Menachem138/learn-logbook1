import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TimerDisplayProps {
  timeLeft: number;
  type: 'study' | 'break';
}

export function TimerDisplay({ timeLeft, type }: TimerDisplayProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <View style={styles.container}>
      <Text style={styles.type}>
        {type === 'study' ? 'זמן למידה' : 'זמן הפסקה'}
      </Text>
      <Text style={styles.time}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  type: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  time: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1a1a1a',
    fontVariant: ['tabular-nums'],
  },
});
