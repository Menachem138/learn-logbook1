export type NotificationType = 
  | 'timer_complete'
  | 'course_progress'
  | 'achievement_earned'
  | 'goal_deadline'
  | 'goal_completed';

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface TimerNotification extends NotificationPayload {
  type: 'timer_complete';
  data: {
    sessionId: string;
    duration: number;
    type: string;
  };
}

export interface CourseProgressNotification extends NotificationPayload {
  type: 'course_progress';
  data: {
    lessonId: string;
    courseId: string;
    progress: number;
  };
}

export interface AchievementNotification extends NotificationPayload {
  type: 'achievement_earned';
  data: {
    achievementId: string;
    title: string;
    type: string;
  };
}

export interface GoalNotification extends NotificationPayload {
  type: 'goal_deadline' | 'goal_completed';
  data: {
    goalId: string;
    title: string;
    deadline?: string;
  };
}
