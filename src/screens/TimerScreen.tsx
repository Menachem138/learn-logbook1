import React from 'react';
import { View, StyleSheet, SafeAreaView, Text, I18nManager } from 'react-native';
import { StudyTimer } from '../components/StudyTimer';
import { theme } from '../theme';
import { commonStyles } from '../theme/components';

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function TimerScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>מעקב זמן למידה</Text>
      </View>
      <View style={styles.content}>
        <StudyTimer />
      </View>
      <View style={styles.quoteContainer}>
        <Text style={styles.quote}>"ההצלחה היא סך כל המאמצים הקטנים שחוזרים על עצמם יום אחר יום."</Text>
        <Text style={styles.quoteAuthor}>- רוברט קולייר</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: theme.typography.fontSize.heading2,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  quoteContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface.secondary,
    alignItems: 'flex-end',
  },
  quote: {
    fontSize: theme.typography.fontSize.body,
    fontStyle: 'italic',
    color: theme.colors.text.primary,
    textAlign: 'right',
    marginBottom: theme.spacing.xs,
  },
  quoteAuthor: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text.secondary,
    textAlign: 'right',
  },
});
