export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  totalTime: number;
  type: 'study' | 'break';
}

export interface TimerSession {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: 'study' | 'break';
  userId: string;
}

export interface TimerStats {
  totalStudyTime: number;
  totalBreakTime: number;
  sessionsToday: number;
  averageSessionLength: number;
}

export interface TimerSettings {
  studyDuration: number;
  breakDuration: number;
  autoStartBreak: boolean;
  autoStartNextSession: boolean;
}
