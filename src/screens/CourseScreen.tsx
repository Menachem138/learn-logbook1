import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Section } from '../components/CourseContent/Section';
import { courseService } from '../services/CourseService';
import { useAuth } from '../components/auth/AuthProvider';
import type { Section as SectionType, Lesson, CourseProgress } from '../components/CourseContent/types';

export default function CourseScreen() {
  const { user } = useAuth();
  const [sections, setSections] = useState<SectionType[]>([]);
  const [progress, setProgress] = useState<Record<string, CourseProgress>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCourseData = async () => {
    try {
      if (!user) return;

      const [sectionsData, progressData] = await Promise.all([
        courseService.getSections(),
        courseService.getProgress(user.id),
      ]);

      // Sections already include lessons
      setSections(sectionsData);
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading course data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCourseData();
  }, [user]);

  const handleLessonPress = async (lesson: Lesson) => {
    try {
      if (!user) return;

      // Update lesson progress
      await courseService.updateProgress(user.id, lesson.id, {
        lastViewedAt: new Date().toISOString(),
        progress: 0, // Reset progress when starting lesson
      });

      // TODO: Navigate to lesson viewer
      // navigation.navigate('LessonViewer', { lesson });
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadCourseData();
          }}
        />
      }
    >
      {sections.map(section => (
        <Section
          key={section.id}
          section={section}
          onLessonPress={handleLessonPress}
          progress={progress}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
