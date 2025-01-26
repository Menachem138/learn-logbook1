import React from 'react';
import { View, StyleSheet, SafeAreaView, I18nManager } from 'react-native';
import { StudyTimer } from '../components/StudyTimer';
import { theme } from '../theme';
import { commonStyles } from '../theme/components';

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

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
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
});
