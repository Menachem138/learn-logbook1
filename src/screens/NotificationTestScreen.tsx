import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { notificationService } from '../services/NotificationService';

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
    <View style={styles.container}>
      <Text style={styles.title}>בדיקת התראות</Text>
      
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

      <Text style={styles.status}>{testStatus}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});
