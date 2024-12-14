export enum TimerState {
  STOPPED,
  STUDYING,
  BREAK
}

export interface TimerSession {
  id?: string;
  user_id: string;
  type: string;
  duration?: number;
  started_at?: string;
  ended_at?: string;
  created_at?: string;
}