import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

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
    marginVertical: theme.spacing.lg,
  },
  type: {
    fontSize: theme.typography.fontSize.heading3,
    fontWeight: theme.typography.fontWeight.semiBold,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  time: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
});
