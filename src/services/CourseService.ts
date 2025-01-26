import { supabase } from '../config/supabase';
import { sections } from '../data/courseData';
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
    // Return static sections data from courseData
    return sections;
  }

  async getLessons(sectionId: string): Promise<Lesson[]> {
    // Find section and return its lessons
    const section = sections.find(s => s.id === sectionId);
    return section?.lessons || [];
  }

  async getProgress(userId: string): Promise<Record<string, CourseProgress>> {
    const { data, error } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    const progressMap: Record<string, CourseProgress> = {};
    (data || []).forEach(progress => {
      progressMap[progress.lesson_id] = {
        userId: progress.user_id,
        lessonId: progress.lesson_id,
        completed: progress.completed || false,
        lastViewedAt: progress.created_at,
        progress: 0, // Not tracked in current schema
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
      .from('course_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        completed: progress.completed,
        created_at: new Date().toISOString(),
      });

    if (error) throw error;

    // Update overall progress tracking
    const { data: trackingData, error: trackingError } = await supabase
      .from('progress_tracking')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!trackingError && trackingData) {
      const completedSections = new Set(trackingData.completed_sections || []);
      if (progress.completed) {
        completedSections.add(lessonId);
      } else {
        completedSections.delete(lessonId);
      }

      await supabase
        .from('progress_tracking')
        .update({
          completed_sections: Array.from(completedSections),
          last_activity: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    }
  }
}

export const courseService = CourseService.getInstance();
