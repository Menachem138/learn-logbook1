export interface Section {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  completed?: boolean;
  duration?: number;
  order: number;
  type: 'video' | 'text' | 'quiz';
}

export interface CourseProgress {
  userId: string;
  lessonId: string;
  completed: boolean;
  lastViewedAt: string;
  progress?: number;
}

export interface SectionProps {
  section: Section;
  onLessonPress: (lesson: Lesson) => void;
  progress: Record<string, CourseProgress>;
}

export interface LessonItemProps {
  lesson: Lesson;
  onPress: () => void;
  progress?: CourseProgress;
}
