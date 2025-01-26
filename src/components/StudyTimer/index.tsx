import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { useTimer } from '../../hooks/useTimer';
import { theme } from '../../theme';

export function StudyTimer() {
  const { state, startTimer, pauseTimer, stopTimer, switchType } = useTimer();

  return (
    <View style={styles.container}>
      <TimerDisplay
        timeLeft={state.timeLeft}
        type={state.type}
      />
      <TimerControls
        isRunning={state.isRunning}
        onStart={startTimer}
        onPause={pauseTimer}
        onStop={stopTimer}
        onSwitchType={switchType}
        type={state.type}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadow.medium,
    width: '100%',
    alignItems: 'center',
  },
});
