import { supabase } from '../config/supabase';
import type { Section, Lesson, CourseProgress } from '../components/CourseContent/types';

class CourseService {
  private static instance: CourseService;

  private constructor() {}

  static getInstance(): CourseService {
    if (!CourseService.instance) {
      CourseService.instance = new CourseService();
    }
    return CourseService.instance;
  }

  async getSections(): Promise<Section[]> {
    const { data, error } = await supabase
      .from('course_sections')
      .select('*')
      .order('order');

    if (error) throw error;
    return data || [];
  }

  async getLessons(sectionId: string): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('section_id', sectionId)
      .order('order');

    if (error) throw error;
    return data || [];
  }

  async getProgress(userId: string): Promise<Record<string, CourseProgress>> {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    const progressMap: Record<string, CourseProgress> = {};
    (data || []).forEach(progress => {
      progressMap[progress.lesson_id] = {
        userId: progress.user_id,
        lessonId: progress.lesson_id,
        completed: progress.completed,
        lastViewedAt: progress.last_viewed_at,
        progress: progress.progress,
      };
    });

    return progressMap;
  }

  async updateProgress(
    userId: string,
    lessonId: string,
    progress: Partial<CourseProgress>
  ): Promise<void> {
    const { error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        completed: progress.completed,
        last_viewed_at: new Date().toISOString(),
        progress: progress.progress,
      });

    if (error) throw error;
  }
}

export const courseService = CourseService.getInstance();
