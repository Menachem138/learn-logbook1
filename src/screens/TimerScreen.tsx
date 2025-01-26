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
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface.primary,
  },
  title: {
    fontSize: theme.typography.fontSize.heading2,
    fontWeight: '700',
    color: theme.colors.text.primary,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.primary,
  },
  quoteContainer: {
    width: '100%',
    padding: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
    backgroundColor: theme.colors.surface.secondary,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 'auto',
    ...theme.shadow.small,
  },
  quote: {
    fontSize: theme.typography.fontSize.body,
    fontStyle: 'italic',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    maxWidth: '80%',
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.medium,
  },
});
