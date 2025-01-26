import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../config/supabase';
import type { NotificationPayload } from '../types/notifications';

class NotificationService {
  private static instance: NotificationService;
  private pushToken: string | null = null;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize() {
    // Configure notification behavior
    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Request permissions and get token
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    // Get push token
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Platform.select({
        ios: 'your-ios-project-id', // TODO: Replace with actual iOS project ID
        android: 'your-android-project-id', // TODO: Replace with actual Android project ID
      }),
    });

    this.pushToken = token.data;

    // Store token in Supabase for the current user
    await this.savePushToken();

    // Set up notification listeners
    this.setupNotificationListeners();
  }

  private async savePushToken() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !this.pushToken) return;

      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          preferences: { 
            pushToken: this.pushToken,
            platform: Platform.OS,
          } 
        })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  }

  private setupNotificationListeners() {
    // Handle notifications when app is in foreground
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
    });

    // Handle notification response when user taps notification
    Notifications.addNotificationResponseReceivedListener(response => {
      const { notification } = response;
      this.handleNotificationTap(notification.request.content.data);
    });
  }

  private handleNotificationTap(data: any) {
    // TODO: Implement navigation logic based on notification type
    console.log('Notification tapped:', data);
  }

  async scheduleNotification(notification: NotificationPayload) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
        },
        trigger: null, // Immediate notification
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  async scheduleTimerNotification(duration: number, type: string) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: type === 'study' ? 'זמן למידה הסתיים' : 'זמן הפסקה הסתיים',
          body: `${duration} דקות ${type === 'study' ? 'של למידה' : 'של הפסקה'} הושלמו`,
          data: { type: 'timer_complete', duration },
        },
        trigger: {
          seconds: duration * 60,
        } as any, // TODO: Fix notification trigger type
      });
    } catch (error) {
      console.error('Error scheduling timer notification:', error);
    }
  }
}

export const notificationService = NotificationService.getInstance();
