import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, I18nManager } from 'react-native';
import { notificationService } from '../services/NotificationService';
import { theme } from '../theme';
import { commonStyles } from '../theme/components';

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function NotificationTestScreen() {
  const [testStatus, setTestStatus] = useState<string>('');

  const testTimerNotification = async () => {
    try {
      // Test a 1-minute study timer notification
      await notificationService.scheduleTimerNotification(1, 'study');
      setTestStatus('טיימר למידה של דקה אחת נקבע');
    } catch (error) {
      setTestStatus('שגיאה: ' + (error as Error).message);
    }
  };

  const testAchievementNotification = async () => {
    try {
      await notificationService.scheduleNotification({
        type: 'achievement_earned',
        title: 'הישג חדש!',
        body: 'השלמת את המשימה הראשונה שלך!',
        data: {
          achievementId: 'test-achievement',
          title: 'המתחיל',
          type: 'first_completion'
        }
      });
      setTestStatus('התראת הישג נשלחה');
    } catch (error) {
      setTestStatus('שגיאה: ' + (error as Error).message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>בדיקת התראות</Text>
      </View>
      
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.button}
          onPress={testTimerNotification}
        >
          <Text style={styles.buttonText}>בדוק התראת טיימר</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={testAchievementNotification}
        >
          <Text style={styles.buttonText}>בדוק התראת הישג</Text>
        </TouchableOpacity>

        {testStatus ? (
          <View style={styles.statusContainer}>
            <Text style={styles.status}>{testStatus}</Text>
          </View>
        ) : null}
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
    backgroundColor: theme.colors.surface.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadow.small,
  },
  buttonText: {
    color: theme.colors.surface.primary,
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  statusContainer: {
    backgroundColor: theme.colors.surface.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
    width: '100%',
    maxWidth: 300,
  },
  status: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
});
