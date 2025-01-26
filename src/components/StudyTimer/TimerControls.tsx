import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onSwitchType: (type: 'study' | 'break') => void;
  type: 'study' | 'break';
}

export function TimerControls({
  isRunning,
  onStart,
  onPause,
  onStop,
  onSwitchType,
  type,
}: TimerControlsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.typeButtons}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'study' && styles.activeType]}
          onPress={() => onSwitchType('study')}
        >
          <Text style={[styles.typeText, type === 'study' && styles.activeTypeText]}>
            למידה
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'break' && styles.activeType]}
          onPress={() => onSwitchType('break')}
        >
          <Text style={[styles.typeText, type === 'break' && styles.activeTypeText]}>
            הפסקה
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainControls}>
        {isRunning ? (
          <TouchableOpacity style={styles.button} onPress={onPause}>
            <Text style={styles.buttonText}>השהה</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.startButton]} onPress={onStart}>
            <Text style={styles.buttonText}>התחל</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={onStop}>
          <Text style={styles.buttonText}>עצור</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.lg,
    width: '100%',
  },
  typeButtons: {
    flexDirection: 'row-reverse', // RTL support
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  typeButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface.secondary,
  },
  activeType: {
    backgroundColor: theme.colors.primary,
  },
  typeText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
  },
  activeTypeText: {
    color: theme.colors.surface.primary,
  },
  mainControls: {
    flexDirection: 'row-reverse', // RTL support
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  button: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    minWidth: 120,
    alignItems: 'center',
    ...theme.shadow.small,
  },
  startButton: {
    backgroundColor: theme.colors.success,
  },
  stopButton: {
    backgroundColor: theme.colors.error,
  },
  buttonText: {
    color: theme.colors.surface.primary,
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
