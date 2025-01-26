import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

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
    marginVertical: 20,
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  typeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeType: {
    backgroundColor: '#4285F4',
  },
  typeText: {
    fontSize: 16,
    color: '#666',
  },
  activeTypeText: {
    color: 'white',
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: '#4285F4',
    minWidth: 120,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
