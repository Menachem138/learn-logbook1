import { notificationService } from '../services/NotificationService';

export async function registerForPushNotificationsAsync() {
  await notificationService.initialize();
}

export async function configurePushNotifications() {
  // Configuration is now handled in NotificationService
  return;
}
