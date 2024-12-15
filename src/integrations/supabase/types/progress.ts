export interface CourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  completed_sections: string[];
  total_sections: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  type: 'badge' | 'trophy' | 'star';
  earned_at: string;
  created_at: string;
}