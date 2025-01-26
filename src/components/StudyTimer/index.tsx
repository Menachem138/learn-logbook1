import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { useTimer } from '../../hooks/useTimer';

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
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
